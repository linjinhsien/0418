import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { initDb } from '@/shared/db';
import { t } from '@/shared/i18n';

export default function RootLayout() {
  useEffect(() => {
    initDb().catch((err) => {
      console.error('DB init failed:', err);
    });
  }, []);

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: t('nav.climbs') }} />
      <Tabs.Screen name="dashboard" options={{ title: t('nav.dashboard') }} />
      <Tabs.Screen name="suggestions" options={{ title: t('nav.suggestions') }} />
      <Tabs.Screen name="profile" options={{ title: t('nav.profile') }} />
    </Tabs>
  );
}
