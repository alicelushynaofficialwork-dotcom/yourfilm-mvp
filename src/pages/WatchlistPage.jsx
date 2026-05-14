import { useEffect, useState } from 'react';
import Header from '../components/layout/Header.jsx';
import WatchlistPreview from '../components/watchlist/WatchlistPreview.jsx';
import { useWatchlist } from '../hooks/useWatchlist.js';
import { ui } from '../data/translations.js';

export default function WatchlistPage() {
  const [language, setLanguage] = useState(() => localStorage.getItem('yourfilm.language') || 'ru');
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem('yourfilm.theme');

    if (savedTheme) {
      return savedTheme;
    }

    return localStorage.getItem('yourfilm.lightTheme') === 'true' ? 'light' : 'dark';
  });
  const { watchlist, removeMovie } = useWatchlist();
  const copy = ui[language] || ui.ru;

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
      <main className="watchlist-page">
        <div className="profile-page-heading">
          <p className="eyebrow">Смотреть позже</p>
          <h1>Фильмы на потом</h1>
          <p>
            Здесь собраны фильмы, которые ты сохранил после рекомендаций YourFilm.
            Можно вернуться к ним, когда появится подходящее настроение.
          </p>
        </div>
        <WatchlistPreview
          copy={copy}
          language={language}
          movies={watchlist}
          onRemoveMovie={removeMovie}
        />
      </main>
    </div>
  );
}
