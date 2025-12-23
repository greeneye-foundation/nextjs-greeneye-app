import { useRouter } from 'next/router';

const LANG_LABELS = {
  en: "English",
  fr: "Français",
  es: "Español",
  ar: "العربية",
  zh: "中文",
  ja: "日本語",
  hi: "हिन्दी",
};

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, locales, asPath } = router;

  if (!locales || locales.length === 0) return null; // prevent error

  return (
    <select
      value={locale}
      onChange={e => router.push(asPath, asPath, { locale: e.target.value })}
      className="language-selector"
      style={{
        padding: '6px 10px',
        borderRadius: '6px',
        fontSize: '14px',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid #2a5994ff',
        color: '#333',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        outline: 'none',
      }}
    >
      {locales.map(l => (
        <option key={l} value={l}>
          {LANG_LABELS[l] || l.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
