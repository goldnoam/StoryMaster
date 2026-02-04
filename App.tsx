
import React, { useState, useEffect } from 'react';
import { translations, Language } from './i18n';

// Components
const AdPlaceholder = () => (
  <div className="w-full bg-slate-200 dark:bg-slate-800 h-32 flex items-center justify-center my-8 rounded-lg border-2 border-dashed border-slate-400 dark:border-slate-600">
    <span className="text-slate-500 text-sm font-mono">Google AdSense Space</span>
  </div>
);

const Navbar = ({ lang, setLang, theme, toggleTheme }: { 
  lang: Language, 
  setLang: (l: Language) => void,
  theme: 'dark' | 'light',
  toggleTheme: () => void 
}) => {
  const t = translations[lang];
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
          <span className="text-xl font-bold tracking-tight">{t.title}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          <button 
            onClick={() => setLang(lang === 'en' ? 'he' : 'en')}
            className="px-3 py-1 text-sm font-semibold rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {t.switchLang}
          </button>
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ lang }: { lang: Language }) => {
  const t = translations[lang];
  return (
    <header className="relative py-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 blur-3xl opacity-20">
        <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500 rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {t.heroTitle}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
          {t.heroDesc}
        </p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95">
          {t.cta}
        </button>
      </div>
    </header>
  );
};

const TipsGrid = ({ lang }: { lang: Language }) => {
  const t = translations[lang];
  const tips = [
    { title: t.point1Title, desc: t.point1Desc, icon: "⚡" },
    { title: t.point2Title, desc: t.point2Desc, icon: "🎨" },
    { title: t.point3Title, desc: t.point3Desc, icon: "⛰️" },
    { title: t.point4Title, desc: t.point4Desc, icon: "🦋" },
    { title: t.point5Title, desc: t.point5Desc, icon: "🤝" },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">{t.pointsTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tips.map((tip, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{tip.icon}</div>
              <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Examples = ({ lang }: { lang: Language }) => {
  const t = translations[lang];
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">{t.examplesTitle}</h2>
        <div className="space-y-8">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-800">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
              <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              {t.ex1Title}
            </h3>
            <p className="italic text-lg text-slate-700 dark:text-slate-300">"{t.ex1Desc}"</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-8 rounded-3xl border border-purple-100 dark:border-purple-800">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-purple-600 dark:text-purple-400">
              <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              {t.ex2Title}
            </h3>
            <p className="italic text-lg text-slate-700 dark:text-slate-300">"{t.ex2Desc}"</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ lang }: { lang: Language }) => {
  const t = translations[lang];
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="mb-4 text-slate-500 dark:text-slate-400 font-medium">{t.footerText}</p>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-slate-400">{t.footerContact}</span>
          <a href={`mailto:${t.email}`} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            {t.email}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Apply theme and language dir on load
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [theme, lang]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className={`min-h-screen font-sans ${lang === 'he' ? 'font-heebo' : 'font-inter'}`}>
      <Navbar lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} />
      
      <main className="pb-20">
        <Hero lang={lang} />
        
        <div className="max-w-5xl mx-auto px-4">
          <AdPlaceholder />
        </div>

        <TipsGrid lang={lang} />
        
        <div className="max-w-5xl mx-auto px-4">
          <AdPlaceholder />
        </div>

        <Examples lang={lang} />

        <section className="bg-indigo-600 py-16 text-center text-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Ready to write your next chapter?</h2>
            <p className="text-indigo-100 mb-10 text-lg">Use these frameworks to transform your simple facts into powerful experiences.</p>
            <button className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-xl hover:bg-slate-100 transition-colors shadow-xl">
              {translations[lang].cta}
            </button>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
