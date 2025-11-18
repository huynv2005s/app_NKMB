// import ScrollView  from '@/components/parallax-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TimeState {
  weeks: number;
  days: number;
  months: number;
  daysLeft: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState<TimeState | null>(null);
  const [timeArr, setTimeArr] = useState<number[]>([]);
  const [dateArray, setDateArray] = useState<number[]>([]);
  const generateWeekDays = (): number[] => {
    const today = new Date();
    const dates: number[] = [];

    // Tạo 3 ngày trước today
    for (let i = 3; i > 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.getDate());
    }

    // Thêm today
    dates.push(today.getDate());

    // Tạo 3 ngày sau today
    for (let i = 1; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.getDate());
    }

    return dates;
  };
  useEffect(() => {
    setDateArray(generateWeekDays());
    const fetchTimeEnd = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          router.replace('/login');
          return;
        }

        const res = await fetch(
          'https://app-nhat-ky-me-bau.onrender.com/api/getTimeEnd',
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Không thể tải thông tin người dùng');
        }

        const timeData: TimeState = {
          weeks: data.weeks,
          days: data.days,
          months: data.months ?? 0,
          daysLeft: data.daysLeft,
        };

        setTime(timeData);

        // Update time array
        const array = String(timeData.daysLeft)
          .split('')
          .map(Number);
        while (array.length < 3) {
          array.unshift(0);
        }
        setTimeArr(array);
      } catch (error) {
        console.error('Error fetching time end:', error);
      }
    };

    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          router.replace('/login');
          return;
        }

        const res = await fetch(
          'https://app-nhat-ky-me-bau.onrender.com/api/auth/me',
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Không thể tải thông tin người dùng');
        }

        setUser(data.user);

        if (
          !data.user.dueDate ||
          !data.user.baby?.name ||
          !data.user.pregnancyWeek
        ) {
          router.replace('../fill-info');
        }
      } catch (err) {
        console.error(err);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    const initializeData = async () => {
      await Promise.all([fetchTimeEnd(), fetchUser()]);
    };

    initializeData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6699" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header với thời gian */}
        <View style={styles.header}>
          <Text style={styles.time}>9:41</Text>
        </View>

        {/* Phần ngày tháng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hôm nay</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesScrollView}
          >
            {dateArray.map((day, index) => (
              <View
                key={index}
                style={[
                  styles.dateCircle,
                  index === 3 && styles.currentDate,
                ]}
              >
                <Text
                  style={[
                    styles.dateText,
                    index === 3 && styles.currentDateText,
                  ]}
                >
                  {day}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Banner hình ảnh */}
        <View style={styles.banner}>
          <Image
            source={{
              uri: 'https://giaophannhatrang.org/uploads/news/2021_12/icth-foetus-570x360.jpg',
            }}
            style={styles.image}
          />
        </View>

        {/* Thông tin tuần thai */}
        <View style={styles.week}>
          <View style={styles.numberWeek}>
            <Text style={styles.weekNumber}>Tuần</Text>
            <Text style={styles.weekNumber}>{time?.weeks}</Text>
          </View>
          <View style={styles.stick} />
          <View style={styles.contentWeek}>
            <Text style={styles.pregnancyStatus}>
              Bạn đang ở tháng thứ {time?.months} của thai kỳ
            </Text>
            <Text style={styles.pregnancyDetails}>
              {time?.weeks} tuần {time?.days} ngày (
              {(time ? time.weeks * 7 + time.days : 0)} ngày)
            </Text>
          </View>
        </View>

        {/* Countdown đến ngày dự sinh */}
        <View style={styles.countdownSection}>
          <View style={styles.digitsContainer}>
            {timeArr.map((item, index) => (
              <View key={index} style={styles.digitBox}>
                <Text style={styles.digit}>{item}</Text>
              </View>
            ))}
          </View>
          <View>
            <Text style={styles.countdownLabel}>NGÀY NỮA ĐẾN</Text>
            <Text style={styles.dueDateLabel}>Ngày dự sinh</Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  section: {
    paddingHorizontal: 12,
    marginTop: 32,
  },
  week: {
    width: '100%',
    flexDirection: 'row',
    gap: 5,
    padding: 12,
    borderRadius: 12,
    marginTop: 32,
    backgroundColor: '#FFFFFF',
  },
  stick: {
    width: 5,
    height: '100%',
    backgroundColor: '#FFC7CC',
    marginHorizontal: 12,
  },
  numberWeek: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFC7CC',
    height: 100,
    justifyContent: 'center',
    borderRadius: 12,
  },
  contentWeek: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    borderRadius: 12,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  datesScrollView: {
    flexDirection: 'row',
    paddingRight: 24,
  },
  dateCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'transparent',
  },
  currentDate: {
    backgroundColor: '#FFC7CC',
    borderRadius: 50,
  },
  dateText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#8E8E93',
  },
  currentDateText: {
    color: '#000000',
  },
  weekNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  pregnancyStatus: {
    fontSize: 17,
    color: '#48484A',
    marginBottom: 4,
    width: '80%',
  },
  pregnancyDetails: {
    fontSize: 15,
    color: '#8E8E93',
  },
  countdownSection: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 12,
    marginTop: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  digitsContainer: {
    flexDirection: 'row',
  },
  digitBox: {
    width: 60,
    height: 150,
    backgroundColor: '#FFC7CC',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  digit: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  countdownLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E8E93',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  dueDateLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  banner: {
    height: 300,
    width: '100%',
    marginTop: 10,
  },
  image: {
    height: '100%',
    width: '100%',
  },
});