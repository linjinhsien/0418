import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { profileRepository, UserProfile } from './profileRepository';
import { t } from '@/shared/i18n';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Omit<UserProfile, 'id'>>({
    name: '',
    homeGym: '',
    climbingSince: '',
    goals: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    profileRepository.get().then((p) => {
      if (p) setProfile({ name: p.name ?? '', homeGym: p.homeGym ?? '', climbingSince: p.climbingSince ?? '', goals: p.goals ?? '' });
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await profileRepository.save({ id: 'singleton', ...profile });
    } catch (err) {
      Alert.alert(t('common.error'), String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('profile.title')}</Text>

      {(['name', 'homeGym', 'climbingSince', 'goals'] as const).map((field) => (
        <React.Fragment key={field}>
          <Text style={styles.label}>{t(`profile.${field}`)}</Text>
          <TextInput
            style={styles.input}
            value={profile[field] ?? ''}
            onChangeText={(v) => setProfile((prev) => ({ ...prev, [field]: v }))}
            placeholder={t(`profile.${field}`)}
            accessibilityLabel={t(`profile.${field}`)}
            multiline={field === 'goals'}
          />
        </React.Fragment>
      ))}

      <TouchableOpacity
        style={[styles.button, saving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saving}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>
          {saving ? t('common.loading') : t('profile.save')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16 },
  button: { marginTop: 24, backgroundColor: '#2563eb', borderRadius: 8, padding: 14, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
