import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { createGeminiClient } from './geminiClient';
import { createSuggestionsService, AISuggestion, ClimbingStyle, SuggestionRequest } from './suggestionsService';
import { SuggestionError } from '@/shared/errorTypes';
import { t } from '@/shared/i18n';

const STYLES: ClimbingStyle[] = ['bouldering', 'sport', 'trad'];

// API key should come from app config / env — placeholder shown here
const API_KEY = (process.env.EXPO_PUBLIC_GEMINI_API_KEY as string) ?? '';
const geminiClient = createGeminiClient(API_KEY);
const suggestionsService = createSuggestionsService(geminiClient);

export default function SuggestionsScreen() {
  const [maxGrade, setMaxGrade] = useState('');
  const [style, setStyle] = useState<ClimbingStyle>('bouldering');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [error, setError] = useState<SuggestionError | null>(null);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => setOffline(!state.isConnected));
    return unsub;
  }, []);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setSuggestions([]);
    const req: SuggestionRequest = { maxGrade, style };
    const result = await suggestionsService.getSuggestions(req);
    if (result.status === 'success') {
      setSuggestions(result.suggestions);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('suggestions.title')}</Text>

      {offline && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{t('suggestions.offline')}</Text>
        </View>
      )}

      {error && (
        <View style={[styles.banner, styles.errorBanner]}>
          <Text style={styles.bannerText}>{t(`suggestions.${error}`)}</Text>
          <TouchableOpacity onPress={handleSubmit} accessibilityRole="button">
            <Text style={styles.retryText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.label}>{t('suggestions.maxGrade')}</Text>
      <TextInput
        style={styles.input}
        value={maxGrade}
        onChangeText={setMaxGrade}
        placeholder="V5 / 5.10a"
        autoCapitalize="characters"
        accessibilityLabel={t('suggestions.maxGrade')}
      />

      <Text style={styles.label}>{t('suggestions.style')}</Text>
      <View style={styles.row}>
        {STYLES.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, style === s && styles.chipActive]}
            onPress={() => setStyle(s)}
            accessibilityRole="button"
            accessibilityState={{ selected: style === s }}
          >
            <Text style={[styles.chipText, style === s && styles.chipTextActive]}>
              {t(`suggestions.styles.${s}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, (loading || !maxGrade) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading || !maxGrade}
        accessibilityRole="button"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{t('suggestions.submit')}</Text>
        )}
      </TouchableOpacity>

      {suggestions.map((s, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{s.name}</Text>
          <Text style={styles.cardMeta}>{s.grade} · {t(`suggestions.styles.${s.style}`)}</Text>
          <Text style={styles.cardReason}>{s.reason}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ccc' },
  chipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  chipText: { fontSize: 14, color: '#333' },
  chipTextActive: { color: '#fff' },
  button: { marginTop: 20, backgroundColor: '#2563eb', borderRadius: 8, padding: 14, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  banner: { backgroundColor: '#fef3c7', borderRadius: 8, padding: 12, marginBottom: 12 },
  errorBanner: { backgroundColor: '#fee2e2' },
  bannerText: { fontSize: 14, color: '#333' },
  retryText: { color: '#2563eb', fontWeight: '600', marginTop: 6 },
  card: { marginTop: 14, backgroundColor: '#f8fafc', borderRadius: 12, padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardMeta: { fontSize: 13, color: '#555', marginTop: 2 },
  cardReason: { fontSize: 14, color: '#333', marginTop: 6 },
});
