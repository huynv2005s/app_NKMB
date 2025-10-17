// import ScrollView  from '@/components/parallax-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProtectedRoute from '../ProtectedRoute';

// const { width } = Dimensions.get('window');
function getPregnancyInfo(pregnancyWeek: any) {
  const totalDays = pregnancyWeek * 7;
  const months = Math.floor(pregnancyWeek / 4.3) + 1;
  const displayWeeks = pregnancyWeek;
  const displayDays = totalDays % 7;
  return { months, totalDays, displayWeeks, displayDays };
}
export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { months, totalDays, displayWeeks, displayDays } = getPregnancyInfo(user?.pregnancyWeek ?? 0);
  useEffect(() => {

    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("/login");
          return;
        }

        // 🔹 Gọi API lấy thông tin người dùng
        const res = await fetch("https://app-nhat-ky-me-bau.onrender.com/api/auth/me", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Không thể tải thông tin người dùng");

        setUser(data.user);

        // 🔹 Nếu thiếu thông tin thai kỳ → chuyển qua màn hình FillInfoScreen
        if (!data.user.dueDate || !data.user.baby?.name || !data.user.pregnancyWeek) {
          router.replace("../fill-info");
        }
      } catch (err) {
        console.error(err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  });

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ff6699" />
      </View>
    );
  }
  return (
    <ProtectedRoute>
      <ScrollView>
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
              {[16, 17, 18, 19, 20, 21, 22, 23, 24, 25].map((day, index) => (
                <View key={day} style={[
                  styles.dateCircle,
                  index === 4 && styles.currentDate
                ]}>
                  <Text style={[
                    styles.dateText,
                    index === 4 && styles.currentDateText
                  ]}>
                    {day}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={styles.banner}>
            <Image
              source={{
                uri: "https://giaophannhatrang.org/uploads/news/2021_12/icth-foetus-570x360.jpg",
              }}
              style={styles.image}
            />
          </View>
          {/* Thông tin tuần thai */}
          <View style={styles.week}>
            <View style={styles.numberWeek}>
              <Text style={styles.weekNumber}>Tuần</Text>
              <Text style={styles.weekNumber}>
                {displayWeeks}
              </Text>
            </View>
            <View style={styles.stick}>

            </View>
            <View style={styles.contentWeek}>
              <Text style={styles.pregnancyStatus}>
                Bạn đang ở tháng thứ {months} của thai kỳ
              </Text>
              <Text style={styles.pregnancyDetails}>
                {displayWeeks} tuần {displayDays} ngày ({totalDays} ngày)
              </Text>
            </View>
          </View>

          {/* Countdown đến ngày dự sinh */}
          <View style={styles.countdownSection}>
            <View style={styles.digitsContainer}>
              <View style={styles.digitBox}>
                <Text style={styles.digit}>0</Text>
              </View>
              <View style={styles.digitBox}>
                <Text style={styles.digit}>5</Text>
              </View>
              <View style={styles.digitBox}>
                <Text style={styles.digit}>1</Text>
              </View>
            </View>
            <View>
              <Text style={styles.countdownLabel}>NGÀY NỮA ĐẾN</Text>
              <Text style={styles.dueDateLabel}>Ngày dự sinh</Text>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView >
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    paddingHorizontal: 24,
    marginTop: 32,
  },
  week: {
    width: "100%",
    flexDirection: 'row',
    gap: 5,
    padding: 12,
    borderRadius: 12,
    marginTop: 32,
    backgroundColor: "#FFFFFF"
  },
  stick: {
    width: 5,
    height: "100%",
    backgroundColor: "#FFC7CC",
    marginHorizontal: 12
  },
  numberWeek: {
    display: "flex",
    flexDirection: 'column',
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFC7CC",
    height: 100,
    justifyContent: "center",
    borderRadius: 12
  },
  contentWeek: {
    display: "flex",
    // flex: 1,
    // width: "70%",
    flexDirection: 'column',
    alignItems: "flex-start",
    justifyContent: "space-around",
    borderRadius: 12
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
    backgroundColor: '#007AFF',
  },
  dateText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#8E8E93',
  },
  currentDateText: {
    color: '#FFFFFF',
  },
  weekNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C1C1E',
    // marginBottom: 8,
  },
  pregnancyStatus: {
    fontSize: 17,
    color: '#48484A',
    marginBottom: 4,
    width: "80%"
  },
  pregnancyDetails: {
    fontSize: 15,
    color: '#8E8E93',
  },
  countdownSection: {
    // minHeight: 200,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: "row",
    padding: 12,
    marginTop: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF"
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
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  banner: {
    height: 300,
    width: "100%",
    marginTop: 10
  },
  image: {
    height: "100%",
    width: "100%",
  },
});