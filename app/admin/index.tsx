import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

interface AdminStats {
    totalUsers: number;
    newUsersToday: number;
    totalArticles: number;
    totalDiaries: number;
    activeUsers: number;
    pendingArticles: number;
}

interface RecentActivity {
    id: string;
    type: 'user' | 'article' | 'diary';
    title: string;
    description: string;
    time: string;
    user?: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    joinDate: string;
    status: 'active' | 'inactive';
    lastLogin: string;
}

// Mock data cho admin
const mockAdminStats: AdminStats = {
    totalUsers: 1247,
    newUsersToday: 23,
    totalArticles: 156,
    totalDiaries: 2894,
    activeUsers: 892,
    pendingArticles: 8
};

const mockRecentActivities: RecentActivity[] = [
    {
        id: '1',
        type: 'user',
        title: 'Người dùng mới',
        description: 'Nguyễn Thị Mai đã đăng ký tài khoản',
        time: '10 phút trước',
        user: 'mai.nguyen@email.com'
    },
    {
        id: '2',
        type: 'article',
        title: 'Bài viết mới',
        description: 'Bài viết "Dinh dưỡng cho bà bầu" đã được đăng',
        time: '2 giờ trước'
    },
    {
        id: '3',
        type: 'diary',
        title: 'Nhật ký mới',
        description: 'Có 15 nhật ký mới được viết hôm nay',
        time: '5 giờ trước'
    },
    {
        id: '4',
        type: 'user',
        title: 'Đăng nhập',
        description: 'Trần Văn Nam vừa đăng nhập',
        time: '8 giờ trước',
        user: 'nam.tran@email.com'
    }
];

const mockRecentUsers: User[] = [
    {
        id: '1',
        name: 'Nguyễn Thị Mai',
        email: 'mai.nguyen@email.com',
        joinDate: '2024-10-01',
        status: 'active',
        lastLogin: '2024-10-08 14:30'
    },
    {
        id: '2',
        name: 'Trần Văn Nam',
        email: 'nam.tran@email.com',
        joinDate: '2024-09-28',
        status: 'active',
        lastLogin: '2024-10-08 10:15'
    },
    {
        id: '3',
        name: 'Lê Thị Hương',
        email: 'huong.le@email.com',
        joinDate: '2024-09-25',
        status: 'inactive',
        lastLogin: '2024-10-05 09:20'
    },
    {
        id: '4',
        name: 'Phạm Văn Đức',
        email: 'duc.pham@email.com',
        joinDate: '2024-09-20',
        status: 'active',
        lastLogin: '2024-10-08 16:45'
    }
];

export default function AdminDashboardScreen() {
    const router = useRouter();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [activities, setActivities] = useState<RecentActivity[]>([]);
    const [recentUsers, setRecentUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        const loadAdminData = () => {
            setTimeout(() => {
                setStats(mockAdminStats);
                setActivities(mockRecentActivities);
                setRecentUsers(mockRecentUsers);
                setIsLoading(false);
            }, 1500);
        };

        loadAdminData();
    }, []);

    const getActivityIcon = (type: string) => {
        const icons = {
            user: 'person.fill',
            article: 'doc.text.fill',
            diary: 'book.fill'
        };
        return icons[type as keyof typeof icons] || 'bell.fill';
    };

    const getActivityColor = (type: string) => {
        const colors = {
            user: '#FFC7CC',
            article: '#A2D2FF',
            diary: '#B5EAD7'
        };
        return colors[type as keyof typeof colors] || '#FFC7CC';
    };

    const getStatusColor = (status: string) => {
        return status === 'active' ? '#4CAF50' : '#FF6B6B';
    };

    const quickActions = [
        {
            title: 'Quản lý người dùng',
            icon: 'person.2.fill',
            color: '#FFC7CC',
            route: '/admin/users',
            count: mockAdminStats.totalUsers
        },
        {
            title: 'Quản lý bài viết',
            icon: 'doc.text.fill',
            color: '#A2D2FF',
            route: '/admin/articles',
            count: mockAdminStats.totalArticles
        },
        {
            title: 'Bài viết chờ duyệt',
            icon: 'clock.fill',
            color: '#FFB7B2',
            route: '/admin/pending-articles',
            count: mockAdminStats.pendingArticles
        },
        {
            title: 'Thống kê',
            icon: 'chart.bar.fill',
            color: '#B5EAD7',
            route: '/admin/analytics',
            count: mockAdminStats.activeUsers
        }
    ];

    const statsCards = [
        {
            title: 'Tổng người dùng',
            value: stats?.totalUsers || 0,
            icon: 'person.2.fill',
            color: '#FFC7CC',
            change: '+12%'
        },
        {
            title: 'Người dùng mới',
            value: stats?.newUsersToday || 0,
            icon: 'person.fill.badge.plus',
            color: '#A2D2FF',
            change: '+5%'
        },
        {
            title: 'Bài viết',
            value: stats?.totalArticles || 0,
            icon: 'doc.text.fill',
            color: '#B5EAD7',
            change: '+3%'
        },
        {
            title: 'Nhật ký',
            value: stats?.totalDiaries || 0,
            icon: 'book.fill',
            color: '#FFB7B2',
            change: '+8%'
        }
    ];

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <View style={styles.loadingIcon}>
                        <IconSymbol name="chart.bar.fill" size={40} color="#FFC7CC" />
                    </View>
                    <Text style={styles.loadingText}>Đang tải dashboard...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Xin chào, Admin!</Text>
                        <Text style={styles.subtitle}>Quản lý ứng dụng thai kỳ</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={() => Alert.alert('Thông báo', 'Tính năng đang phát triển')}
                    >
                        <IconSymbol name="bell.fill" size={24} color="#FF6B81" />
                        <View style={styles.notificationBadge}>
                            <Text style={styles.notificationText}>3</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Stats Overview */}
                <View style={styles.statsSection}>
                    <Text style={styles.sectionTitle}>Tổng quan</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.statsScrollContent}
                    >
                        {statsCards.map((stat, index) => (
                            <View key={index} style={styles.statCard}>
                                <View style={styles.statHeader}>
                                    <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                                        <IconSymbol name={stat.icon} size={20} color="#333" />
                                    </View>
                                    <Text style={styles.statChange}>{stat.change}</Text>
                                </View>
                                <Text style={styles.statValue}>{stat.value.toLocaleString()}</Text>
                                <Text style={styles.statTitle}>{stat.title}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActionsSection}>
                    <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
                    <View style={styles.quickActionsGrid}>
                        {quickActions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.quickActionCard}
                                onPress={() => Alert.alert('Chuyển hướng', `Đến ${action.title}`)}
                            >
                                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                                    <IconSymbol name={action.icon} size={24} color="#333" />
                                </View>
                                <Text style={styles.quickActionTitle}>{action.title}</Text>
                                <Text style={styles.quickActionCount}>{action.count}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Recent Activities */}
                <View style={styles.activitiesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>Xem tất cả</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.activitiesList}>
                        {activities.map((activity) => (
                            <View key={activity.id} style={styles.activityItem}>
                                <View style={[styles.activityIcon, { backgroundColor: getActivityColor(activity.type) }]}>
                                    <IconSymbol name={getActivityIcon(activity.type)} size={16} color="#333" />
                                </View>
                                <View style={styles.activityContent}>
                                    <Text style={styles.activityTitle}>{activity.title}</Text>
                                    <Text style={styles.activityDescription}>{activity.description}</Text>
                                    {activity.user && (
                                        <Text style={styles.activityUser}>{activity.user}</Text>
                                    )}
                                </View>
                                <Text style={styles.activityTime}>{activity.time}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Recent Users */}
                <View style={styles.usersSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Người dùng mới nhất</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>Xem tất cả</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.usersList}>
                        {recentUsers.map((user) => (
                            <View key={user.id} style={styles.userItem}>
                                <View style={styles.userAvatar}>
                                    <IconSymbol name="person.fill" size={20} color="#FFF" />
                                </View>
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>{user.name}</Text>
                                    <Text style={styles.userEmail}>{user.email}</Text>
                                    <Text style={styles.userDate}>Tham gia: {user.joinDate}</Text>
                                </View>
                                <View style={styles.userStatus}>
                                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(user.status) }]} />
                                    <Text style={[styles.statusText, { color: getStatusColor(user.status) }]}>
                                        {user.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* System Status */}
                <View style={styles.systemSection}>
                    <Text style={styles.sectionTitle}>Trạng thái hệ thống</Text>
                    <View style={styles.systemGrid}>
                        <View style={styles.systemItem}>
                            <IconSymbol name="server.rack" size={24} color="#4CAF50" />
                            <Text style={styles.systemLabel}>Server</Text>
                            <Text style={[styles.systemStatus, { color: '#4CAF50' }]}>Online</Text>
                        </View>
                        <View style={styles.systemItem}>
                            <IconSymbol name="database.fill" size={24} color="#4CAF50" />
                            <Text style={styles.systemLabel}>Database</Text>
                            <Text style={[styles.systemStatus, { color: '#4CAF50' }]}>Stable</Text>
                        </View>
                        <View style={styles.systemItem}>
                            <IconSymbol name="network" size={24} color="#4CAF50" />
                            <Text style={styles.systemLabel}>API</Text>
                            <Text style={[styles.systemStatus, { color: '#4CAF50' }]}>Running</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF9FA',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFC7CC',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    notificationButton: {
        position: 'relative',
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF9FA',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFC7CC',
    },
    notificationBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#FF6B6B',
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    statsSection: {
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    statsScrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    statCard: {
        width: 160,
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: '#FFC7CC',
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statChange: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: '600',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    statTitle: {
        fontSize: 12,
        color: '#666',
    },
    quickActionsSection: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    quickActionCard: {
        width: (width - 52) / 2,
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: '#FFC7CC',
    },
    quickActionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickActionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
        textAlign: 'center',
    },
    quickActionCount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6B81',
    },
    activitiesSection: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    seeAllText: {
        color: '#FF6B81',
        fontSize: 14,
        fontWeight: '600',
    },
    activitiesList: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: '#FFC7CC',
        overflow: 'hidden',
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    activityIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    activityDescription: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    activityUser: {
        fontSize: 11,
        color: '#999',
    },
    activityTime: {
        fontSize: 11,
        color: '#999',
    },
    usersSection: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    usersList: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: '#FFC7CC',
        overflow: 'hidden',
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFC7CC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    userDate: {
        fontSize: 11,
        color: '#999',
    },
    userStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '500',
    },
    systemSection: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    systemGrid: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: '#FFC7CC',
    },
    systemItem: {
        flex: 1,
        alignItems: 'center',
        gap: 8,
    },
    systemLabel: {
        fontSize: 12,
        color: '#666',
    },
    systemStatus: {
        fontSize: 12,
        fontWeight: '600',
    },
});