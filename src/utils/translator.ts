export type TranslationField = 'name' | 'appearance' | 'packaging' | 'applications' | 'general';

export async function translateText(
  text: string,
  from: 'ar' | 'en',
  to: 'ar' | 'en',
  field: TranslationField = 'general'
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed, from, to, field }),
    });

    if (!res.ok) {
      throw new Error(`Translate API error: ${res.status}`);
    }

    const data = await res.json();
    return (data.translation || '').trim();
  } catch (err) {
    console.warn('[translateText] failed:', err);
    throw err;
  }
}
