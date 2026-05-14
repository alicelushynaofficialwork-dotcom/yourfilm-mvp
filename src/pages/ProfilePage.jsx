import { useEffect, useMemo, useState } from 'react';
import Header from '../components/layout/Header.jsx';
import UserProfilePanel from '../components/profile/UserProfilePanel.jsx';
import { getUserProfileProgress } from '../services/profileEngine.js';
import { useWatchlist } from '../hooks/useWatchlist.js';
import { ui } from '../data/translations.js';

export default function ProfilePage() {
  const [language, setLanguage] = useState(() => localStorage.getItem('yourfilm.language') || 'ru');
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem('yourfilm.theme');

    if (savedTheme) {
      return savedTheme;
    }

    return localStorage.getItem('yourfilm.lightTheme') === 'true' ? 'light' : 'dark';
  });
  const { watchlist } = useWatchlist();
  const copy = ui[language] || ui.ru;
  const profile = useMemo(() => getUserProfileProgress(), []);

  useEffect(() => {
    document.body.classList.toggle('light-theme-page', themeMode !== 'dark');
    document.body.classList.toggle('cartoon-theme-page', themeMode === 'cartoon');

    return () => {
      document.body.classList.remove('light-theme-page');
      document.body.classList.remove('cartoon-theme-page');
    };
  }, [themeMode]);

  function handleLanguageChange(nextLanguage) {
    setLanguage(nextLanguage);
    localStorage.setItem('yourfilm.language', nextLanguage);
  }

  function handleThemeChange(nextThemeMode) {
    setThemeMode(nextThemeMode);
    localStorage.setItem('yourfilm.theme', nextThemeMode);
    localStorage.setItem('yourfilm.lightTheme', String(nextThemeMode !== 'dark'));
  }

  const appClassName =
    themeMode === 'dark' ? 'app-shell' : `app-shell light-theme ${themeMode}-theme`;

  return (
    <div className={appClassName}>
      <Header
        copy={copy}
        language={language}
        themeMode={themeMode}
        onThemeChange={handleThemeChange}
        onLanguageChange={handleLanguageChange}
      />
      <main className="profile-page">
        <div className="profile-page-heading">
          <p className="eyebrow">Профиль</p>
          <h1>Твой игровой путь YourFilm</h1>
          <p>
            Здесь собраны уровень, опыт, достижения, титулы, рейтинги, любимые жанры,
            любимые фильмы, эмоциональный кино-портрет и фильмы на потом.
          </p>
        </div>
        <UserProfilePanel language={language} profile={profile} watchlist={watchlist} />
      </main>
    </div>
  );
}
