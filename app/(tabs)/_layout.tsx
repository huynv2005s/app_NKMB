import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
          borderTopColor: colorScheme === 'dark' ? '#38383A' : '#E5E5EA',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Theo dõi",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="chart.line.uptrend.xyaxis" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="article"
        options={{
          title: "Kiến thức",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="book.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: "Nhật ký",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="pencil.and.outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: "Cá nhân",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}