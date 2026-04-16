import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import ClimbForm from '@/climbs/ClimbForm';
import ClimbList from '@/climbs/ClimbList';

export default function ClimbsScreen() {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <ClimbForm onSaved={() => setRefreshKey((k) => k + 1)} />
      </View>
      <View style={styles.list}>
        <ClimbList refreshKey={refreshKey} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { flex: 1 },
  list: { flex: 1 },
});
