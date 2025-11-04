
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      label: 'Analyzer',
      icon: 'play.circle.fill',
    },
    {
      name: 'settings',
      label: 'Settings',
      icon: 'gear',
    },
  ];

  if (Platform.OS === 'web') {
    return (
      <Stack>
        <Stack.Screen
          name="(home)"
          options={{
            title: 'Highlight Analyzer',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Settings',
            headerShown: true,
          }}
        />
      </Stack>
    );
  }

  return (
    <>
      <Stack>
        <Stack.Screen
          name="(home)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
