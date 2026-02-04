
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { translations, Language } from './i18n';

// Utility for native TTS
const speakText = (text: string, lang: Language) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  // Simple mapping for native voices
  const langMap: Record<Language, string> = {
    en: 'en-US', he: 'he-IL', zh: 'zh-CN', hi: 'hi-IN', de: 'de-DE', es: 'es-ES', fr: 'fr-FR'
  };
  utterance.lang = langMap[lang];
  window.speechSynthesis.speak(utterance);
};

// Share functionality
const shareContent = async (title: string, text: string) => {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url: window.location.href });
    } catch (err) {
      console.log('Share canceled or failed', err);
    }
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard.writeText(`${title}: ${text}`).then(() => {
      alert('Content copied to clipboard!');
    });
  }
};

const AdPlaceholder = () => (
  <div className="w-full bg-slate-200 dark:bg-slate-800 h-32 flex items-center justify-center my-8 rounded-xl border-2 border-dashed border-slate-400 dark:border-slate-600 overflow-hidden" aria-hidden="true">
    <span className="text-slate-500 text-xs font-mono uppercase tracking-widest">Sponsored Advertisement</span>
  </div>
);

const IconButton = ({ onClick, icon, label, title }: { onClick: () => void, icon: string, label?: string, title?: string }) => (
  <button 
    onClick={onClick}
    title={title}
    aria-label={label || title}
    className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-sm font-medium"
  >
    <span>{icon}</span>
    {label && <span>{label}</span>}
  </button>
);

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [theme, lang]);

  const allContent = useMemo(() => [
    { type: 'tip', title: t.point1Title, desc: t.point1Desc, icon: "⚡" },
    { type: 'tip', title: t.point2Title, desc: t.point2Desc, icon: "🎨" },
    { type: 'tip', title: t.point3Title, desc: t.point3Desc, icon: "⛰️" },
    { type: 'tip', title: t.point4Title, desc: t.point4Desc, icon: "🦋" },
    { type: 'tip', title: t.point5Title, desc: t.point5Desc, icon: "🤝" },
    { type: 'example', title: t.ex1Title, desc: t.ex1Desc, icon: "📝" },
    { type: 'example', title: t.ex2Title, desc: t.ex2Desc, icon: "💼" },
  ], [t]);

  const filteredContent = useMemo(() => {
    if (!searchQuery) return allContent;
    const q = searchQuery.toLowerCase();
    return allContent.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.desc.toLowerCase().includes(q)
    );
  }, [allContent, searchQuery]);

  const exportResults = () => {
    const blob = new Blob([JSON.stringify(filteredContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `storymaster-results-${lang}.json`;
    a.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const text = e.dataTransfer.getData('text');
    if (text) setSearchQuery(text);
  };

  return (
    <div className={`min-h-screen font-sans transition-all duration-300 font-size-${fontSize} ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">S</div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight">{t.title}</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 ring-indigo-500"
              aria-label={t.switchLang}
            >
              <option value="en">English</option>
              <option value="he">עברית</option>
              <option value="zh">中文</option>
              <option value="hi">हिन्दी</option>
              <option value="de">Deutsch</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>

            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              {(['sm', 'md', 'lg'] as const).map(size => (
                <button 
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${fontSize === size ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600' : 'text-slate-500'}`}
                  title={`${t.fontSize}: ${size}`}
                >
                  <span className={`font-bold ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}>A</span>
                </button>
              ))}
            </div>

            <IconButton onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} icon={theme === 'dark' ? '☀️' : '🌙'} title={t.toggleTheme} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-12 overflow-hidden bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/20">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight animate-fade-in">
            {t.heroTitle}
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.heroDesc}
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95">
            {t.cta}
          </button>
        </div>
      </header>

      {/* Search & Functionality Section */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500">
            🔍
          </div>
          <input 
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-24 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all shadow-lg text-lg"
            aria-label={t.searchPlaceholder}
          />
          <div className="absolute inset-y-0 right-2 flex items-center gap-1">
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
                title={t.clear}
              >
                ✕
              </button>
            )}
            <button 
              onClick={exportResults}
              className="p-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg font-bold text-xs"
              title={t.export}
            >
              CSV/JSON
            </button>
          </div>
        </div>
        
        {/* Autocomplete suggestions (Titles only) */}
        {searchQuery && filteredContent.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {filteredContent.slice(0, 5).map((item, i) => (
              <button 
                key={i}
                onClick={() => setSearchQuery(item.title)}
                className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
              >
                {item.title}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Main Content Sections */}
      <main className="max-w-7xl mx-auto px-4 pb-20">
        
        {/* Ad Space 1 */}
        <AdPlaceholder />

        {/* Tips Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold mb-10 border-l-4 border-indigo-600 pl-4">{t.pointsTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredContent.filter(c => c.type === 'tip').map((tip, idx) => (
              <article key={idx} className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-4xl p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform">{tip.icon}</div>
                  <div className="flex gap-1">
                    <IconButton onClick={() => speakText(`${tip.title}. ${tip.desc}`, lang)} icon="🔊" title={t.speak} />
                    <IconButton onClick={() => shareContent(tip.title, tip.desc)} icon="🔗" title={t.share} />
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-4">{tip.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{tip.desc}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Ad Space 2 */}
        <AdPlaceholder />

        {/* Examples Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold mb-10 border-l-4 border-purple-600 pl-4">{t.examplesTitle}</h3>
          <div className="space-y-8">
            {filteredContent.filter(c => c.type === 'example').map((ex, idx) => (
              <article key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{ex.title}</h4>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconButton onClick={() => speakText(ex.desc, lang)} icon="🔊" title={t.speak} />
                    <IconButton onClick={() => shareContent(ex.title, ex.desc)} icon="🔗" title={t.share} />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-l-4 border-indigo-500 shadow-inner italic text-lg leading-relaxed">
                  "{ex.desc}"
                </div>
              </article>
            ))}
          </div>
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <div className="text-6xl mb-4">🕵️‍♂️</div>
            <p className="text-xl">{t.noResults}</p>
          </div>
        )}
      </main>

      {/* Final CTA */}
      <section className="bg-indigo-600 dark:bg-indigo-700 py-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold mb-6">Master the Narrative Today</h2>
          <p className="text-indigo-100 mb-10 text-lg opacity-90">Unlock global opportunities by speaking the universal language of great stories.</p>
          <button className="bg-white text-indigo-600 px-10 py-4 rounded-full font-extrabold text-xl hover:bg-slate-100 transition-all hover:scale-105 shadow-2xl">
            {t.cta}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm font-bold text-slate-500">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">Accessibility Statement</a>
          </div>
          <p className="mb-4 text-slate-500 dark:text-slate-400 font-medium">{t.footerText}</p>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{t.footerContact}</span>
            <a href={`mailto:${t.email}`} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition-colors">
              {t.email}
            </a>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 p-4 bg-indigo-600 text-white rounded-2xl shadow-2xl transition-all duration-300 transform z-50 hover:bg-indigo-700 active:scale-90 ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <span className="block text-2xl">↑</span>
      </button>

      {/* Accessibility Focus Trap / Skip Link */}
      <a href="#root" className="sr-only focus:not-sr-only fixed top-4 left-4 z-[100] bg-white text-indigo-600 px-4 py-2 rounded shadow-lg">
        Skip to main content
      </a>
    </div>
  );
}
