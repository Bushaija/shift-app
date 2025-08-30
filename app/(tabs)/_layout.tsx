import React from 'react';
import { View, Platform } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { Home, Calendar, User, Briefcase } from 'lucide-react-native';
import { NotificationBadge } from '@/components/layout/navigation';
import { useNotificationsCenter } from '@/hooks/api/notifications/use-notifications-center';
import { useAuthStore } from '@/stores/auth-store';

export default function TabLayout() {
  const { isAuthenticated } = useAuthStore();
  const { unreadCount } = useNotificationsCenter();

  console.log('[TabsLayout] render', { isAuthenticated });
  if (!isAuthenticated) {
    console.log('[TabsLayout] unauthenticated -> /auth/signin');
    return <Redirect href="/auth/signin" />;
  }

  const TabIcon = ({
    Icon,
    color,
    size,
    focused,
    showBadge = false
  }: {
    Icon: React.ComponentType<any>;
    color: string;
    size: number;
    focused: boolean;
    showBadge?: boolean;
  }) => (
    <View className="items-center justify-center relative">
      {/* Active indicator */}
      {focused && (
        <View className="absolute -top-2 w-8 h-0.5 bg-blue-500 rounded-full" />
      )}

      {/* Icon container with background - removed transform classes */}
      <View
        className={`p-2 rounded-xl ${focused ? 'bg-blue-50' : 'bg-transparent'}`}
        style={{
          transform: [{ scale: focused ? 1.05 : 1 }],
        }}
      >
        <Icon
          size={focused ? size + 2 : size}
          color={color}
          strokeWidth={focused ? 2.5 : 2}
        />
      </View>

      {/* Notification badge for profile */}
      {showBadge && <NotificationBadge count={unreadCount} />}
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6', // Blue-500
        tabBarInactiveTintColor: '#6B7280', // Gray-500
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          paddingBottom: Platform.OS === 'ios' ? 24 : 12,
          paddingTop: 12,
          height: 70,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: -8,
          },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 12,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '400',
          marginTop: 4,
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              Icon={Home}
              color={color}
              size={size}
              focused={focused}
              showBadge={false}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="shifts"
        options={{
          title: 'Shifts',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              Icon={Briefcase}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              Icon={Calendar}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              Icon={User}
              color={color}
              size={size}
              focused={focused}
              showBadge={true}
            />
          ),
        }}
      />

      {/* Hide nested routes from tab bar */}
      <Tabs.Screen
        name="shifts/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="shifts/my-shifts"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="schedule/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/edit"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/settings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/notifications"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/availability"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
