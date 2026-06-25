import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '@/theme/colors';
import { font } from '@/theme/type';
import { BookmarkIcon, HomeIcon, ProfileIcon } from '@/components/Icon';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.dim,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          borderTopWidth: 1,
          height: 82,
          paddingTop: 11,
        },
        tabBarLabelStyle: {
          fontFamily: font.extrabold,
          fontSize: 11,
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon size={25} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <BookmarkIcon size={25} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <ProfileIcon size={25} color={color} />,
        }}
      />
    </Tabs>
  );
}
