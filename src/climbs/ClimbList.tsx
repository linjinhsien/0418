import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { climbsService } from './climbsService';
import { Climb } from './types';
import { t } from '@/shared/i18n';

function ClimbItem({ item }: { item: Climb }) {
  return (
    <View style={styles.item}>
      <View style={styles.row}>
        <Text style={styles.routeName}>{item.routeName}</Text>
        <View style={[styles.badge, item.result === 'sent' ? styles.sent : styles.attempt]}>
          <Text style={styles.badgeText}>{t(`climbList.${item.result}`)}</Text>
        </View>
      </View>
      <Text style={styles.meta}>
        {item.grade}
        {item.gradeWarning ? ' ⚠️' : ''} · {item.date}
        {item.location ? ` · ${item.location}` : ''}
      </Text>
    </View>
  );
}

export default function ClimbList({ refreshKey }: { refreshKey?: number }) {
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setClimbs(await climbsService.getClimbs());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load, refreshKey]);

  if (loading) return <Text style={styles.center}>{t('common.loading')}</Text>;

  return (
    <FlatList
      data={climbs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ClimbItem item={item} />}
      ListEmptyComponent={<Text style={styles.center}>{t('climbList.empty')}</Text>}
      contentContainerStyle={climbs.length === 0 ? styles.emptyContainer : undefined}
    />
  );
}

const styles = StyleSheet.create({
  item: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  routeName: { fontSize: 16, fontWeight: '600', flex: 1 },
  meta: { fontSize: 13, color: '#666', marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  sent: { backgroundColor: '#d1fae5' },
  attempt: { backgroundColor: '#fee2e2' },
  badgeText: { fontSize: 12, fontWeight: '600' },
  center: { textAlign: 'center', marginTop: 40, color: '#666' },
  emptyContainer: { flexGrow: 1, justifyContent: 'center' },
});
