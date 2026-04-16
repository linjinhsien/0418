import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { climbsService, ValidationErrors } from './climbsService';
import { ClimbInput, ClimbResult } from './types';
import { t } from '@/shared/i18n';

const RESULTS: ClimbResult[] = ['sent', 'attempt'];

export default function ClimbForm({ onSaved }: { onSaved?: () => void }) {
  const [form, setForm] = useState<ClimbInput>({
    routeName: '',
    grade: '',
    date: new Date().toISOString().slice(0, 10),
    result: 'sent',
    location: '',
    notes: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [gradeWarning, setGradeWarning] = useState(false);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ClimbInput>(key: K, value: ClimbInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit() {
    setSaving(true);
    try {
      const climb = await climbsService.addClimb(form);
      setGradeWarning(climb.gradeWarning);
      setForm({ routeName: '', grade: '', date: new Date().toISOString().slice(0, 10), result: 'sent', location: '', notes: '' });
      setErrors({});
      onSaved?.();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errors' in err) {
        setErrors((err as { errors: ValidationErrors }).errors);
      } else {
        Alert.alert(t('common.error'), String(err));
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('climbForm.title')}</Text>

      <Text style={styles.label}>{t('climbForm.routeName')}</Text>
      <TextInput
        style={[styles.input, errors.routeName && styles.inputError]}
        value={form.routeName}
        onChangeText={(v) => set('routeName', v)}
        placeholder={t('climbForm.routeName')}
        accessibilityLabel={t('climbForm.routeName')}
      />
      {errors.routeName && <Text style={styles.error}>{t('climbForm.validation.required')}</Text>}

      <Text style={styles.label}>{t('climbForm.grade')}</Text>
      <TextInput
        style={[styles.input, errors.grade && styles.inputError]}
        value={form.grade}
        onChangeText={(v) => set('grade', v)}
        placeholder="V5 / 5.10a"
        autoCapitalize="characters"
        accessibilityLabel={t('climbForm.grade')}
      />
      {errors.grade && <Text style={styles.error}>{t('climbForm.validation.required')}</Text>}
      {gradeWarning && <Text style={styles.warning}>{t('climbForm.validation.gradeWarning')}</Text>}

      <Text style={styles.label}>{t('climbForm.date')}</Text>
      <TextInput
        style={[styles.input, errors.date && styles.inputError]}
        value={form.date}
        onChangeText={(v) => set('date', v)}
        placeholder="YYYY-MM-DD"
        accessibilityLabel={t('climbForm.date')}
      />
      {errors.date && <Text style={styles.error}>{t('climbForm.validation.required')}</Text>}

      <Text style={styles.label}>{t('climbForm.result')}</Text>
      <View style={styles.row}>
        {RESULTS.map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.chip, form.result === r && styles.chipActive]}
            onPress={() => set('result', r)}
            accessibilityRole="button"
            accessibilityState={{ selected: form.result === r }}
          >
            <Text style={[styles.chipText, form.result === r && styles.chipTextActive]}>
              {t(`climbForm.${r}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>{t('climbForm.location')}</Text>
      <TextInput
        style={styles.input}
        value={form.location}
        onChangeText={(v) => set('location', v)}
        placeholder={t('climbForm.location')}
        accessibilityLabel={t('climbForm.location')}
      />

      <Text style={styles.label}>{t('climbForm.notes')}</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={form.notes}
        onChangeText={(v) => set('notes', v)}
        placeholder={t('climbForm.notes')}
        multiline
        numberOfLines={3}
        accessibilityLabel={t('climbForm.notes')}
      />

      <TouchableOpacity
        style={[styles.button, saving && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={saving}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>
          {saving ? t('common.loading') : t('climbForm.submit')}
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
  inputError: { borderColor: '#e53e3e' },
  multiline: { height: 80, textAlignVertical: 'top' },
  error: { color: '#e53e3e', fontSize: 12, marginTop: 2 },
  warning: { color: '#d97706', fontSize: 12, marginTop: 2 },
  row: { flexDirection: 'row', gap: 8, marginTop: 4 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ccc' },
  chipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  chipText: { fontSize: 14, color: '#333' },
  chipTextActive: { color: '#fff' },
  button: { marginTop: 24, backgroundColor: '#2563eb', borderRadius: 8, padding: 14, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
