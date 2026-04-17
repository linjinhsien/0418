import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { climbsService } from '@/climbs/climbsService';
import { statsAggregator, ClimbStats } from './statsAggregator';
import { t } from '@/shared/i18n';

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<ClimbStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    climbsService.getClimbs().then((climbs) => {
      setStats(statsAggregator.compute(climbs));
      setLoading(false);
    });
  }, []);

  if (loading) return <Text style={styles.center}>{t('common.loading')}</Text>;

  if (!stats || stats.totalClimbs === 0) {
    return <Text style={styles.center}>{t('dashboard.empty')}</Text>;
  }

  const gradeEntries = Object.entries(stats.byGrade).sort(([a], [b]) => a.localeCompare(b));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('dashboard.title')}</Text>

      <View style={styles.row}>
        <StatCard label={t('dashboard.totalClimbs')} value={stats.totalClimbs} />
        <StatCard label={t('dashboard.totalSends')} value={stats.totalSends} />
        <StatCard label={t('dashboard.totalAttempts')} value={stats.totalAttempts} />
      </View>

      <Text style={styles.sectionTitle}>{t('dashboard.gradeBreakdown')}</Text>
      {gradeEntries.map(([grade, count]) => (
        <View key={grade} style={styles.gradeRow}>
          <Text style={styles.gradeLabel}>{grade}</Text>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                { width: `${Math.min(100, (count / stats.totalClimbs) * 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.gradeCount}>{count}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 24, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8 },
  card: { flex: 1, backgroundColor: '#f0f4ff', borderRadius: 12, padding: 14, alignItems: 'center' },
  cardValue: { fontSize: 28, fontWeight: '800', color: '#2563eb' },
  cardLabel: { fontSize: 12, color: '#555', marginTop: 2, textAlign: 'center' },
  gradeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  gradeLabel: { width: 56, fontSize: 13, fontWeight: '600' },
  barContainer: { flex: 1, height: 14, backgroundColor: '#e5e7eb', borderRadius: 7, overflow: 'hidden', marginHorizontal: 8 },
  bar: { height: '100%', backgroundColor: '#2563eb', borderRadius: 7 },
  gradeCount: { width: 24, fontSize: 13, textAlign: 'right', color: '#555' },
  center: { textAlign: 'center', marginTop: 60, color: '#666' },
});
