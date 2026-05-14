import { useState } from 'react';
import { languages } from '../../data/translations.js';

export default function Header({
  copy,
  language,
  themeMode,
  onThemeChange,
  onLanguageChange,
}) {
  const [openMenu, setOpenMenu] = useState('');
  const themeOptions = [
    { id: 'light', label: copy.nav.lightTheme },
    { id: 'dark', label: copy.nav.darkTheme },
    { id: 'cartoon', label: copy.nav.cartoonTheme },
  ];
  const activeTheme = themeOptions.find((item) => item.id === themeMode) ?? themeOptions[0];
  const activeLanguage = languages.find((item) => item.id === language) ?? languages[0];

  function handleLogoClick(event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleThemeSelect(nextThemeMode) {
    onThemeChange(nextThemeMode);
    setOpenMenu('');
  }

  function handleLanguageSelect(nextLanguage) {
    onLanguageChange(nextLanguage);
    setOpenMenu('');
  }

  const navigationItems = [
    { href: '/#recommendation', label: copy.nav.recommendation },
    { href: '/#film-of-day', label: copy.nav.filmOfDay },
    { href: '/#how-it-works', label: copy.nav.howItWorks },
  ];
  const currentPath = window.location.pathname;

  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="YourFilm" onClick={handleLogoClick}>
        <img src="/images/logo-header.png" alt="YourFilm" />
      </a>
      <nav className="nav-links" aria-label={copy.nav.recommendation}>
        <div className="primary-nav">
          {navigationItems.map((item) => (
            <a
              className={item.href === currentPath ? 'active' : ''}
              key={item.href}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>
        <a className={currentPath === '/profile' ? 'profile-nav-link active' : 'profile-nav-link'} href="/profile">
          Профиль
        </a>
        <div className="header-controls">
          <div className="theme-select control-dropdown">
            <span>{copy.nav.theme}</span>
            <button
              className="dropdown-trigger"
              type="button"
              aria-expanded={openMenu === 'theme'}
              onClick={() => setOpenMenu(openMenu === 'theme' ? '' : 'theme')}
            >
              {activeTheme.label}
            </button>
            {openMenu === 'theme' ? (
              <div className="dropdown-menu">
                {themeOptions.map((item) => (
                  <button
                    className={item.id === themeMode ? 'dropdown-option active' : 'dropdown-option'}
                    key={item.id}
                    type="button"
                    onClick={() => handleThemeSelect(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="language-select control-dropdown">
            <span>{copy.nav.language}</span>
            <button
              className="dropdown-trigger"
              type="button"
              aria-expanded={openMenu === 'language'}
              onClick={() => setOpenMenu(openMenu === 'language' ? '' : 'language')}
            >
              {activeLanguage.label}
            </button>
            {openMenu === 'language' ? (
              <div className="dropdown-menu">
                {languages.map((item) => (
                  <button
                    className={item.id === language ? 'dropdown-option active' : 'dropdown-option'}
                    key={item.id}
                    type="button"
                    onClick={() => handleLanguageSelect(item.id)}
                  >
                  {item.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </nav>
    </header>
  );
}
