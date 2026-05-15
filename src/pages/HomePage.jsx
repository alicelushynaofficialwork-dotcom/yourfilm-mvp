import { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../components/layout/Header.jsx';
import HeroSection from '../components/home/HeroSection.jsx';
import MoodQuickSelect from '../components/home/MoodQuickSelect.jsx';
import FilmOfTheDay from '../components/home/FilmOfTheDay.jsx';
import HowItWorks from '../components/home/HowItWorks.jsx';
import MovieSearchPanel from '../components/home/MovieSearchPanel.jsx';
import NewReleasesRail from '../components/home/NewReleasesRail.jsx';
import RecommendationResult from '../components/chat/RecommendationResult.jsx';
import { moods } from '../data/moods.js';
import { movies } from '../data/movies.js';
import { newReleases } from '../data/newReleases.js';
import { getFilmOfTheDay } from '../data/filmOfTheDay.js';
import { getRecommendation } from '../services/recommendationEngine.js';
import { getGenres, getYears, searchMovies } from '../services/movieCatalog.js';
import { useWatchlist } from '../hooks/useWatchlist.js';
import { ui } from '../data/translations.js';

export default function HomePage() {
  const [language, setLanguage] = useState(() => localStorage.getItem('yourfilm.language') || 'ru');
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem('yourfilm.theme');

    if (savedTheme) {
      return savedTheme;
    }

    return localStorage.getItem('yourfilm.lightTheme') === 'true' ? 'light' : 'dark';
  });
  const [selectedMood, setSelectedMood] = useState(moods[0].id);
  const [selectedReleaseId, setSelectedReleaseId] = useState('');
  const [selectedSearchMovieId, setSelectedSearchMovieId] = useState('');
  const [customMood, setCustomMood] = useState('');
  const [movieQuery, setMovieQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [actorQuery, setActorQuery] = useState('');
  const [directorQuery, setDirectorQuery] = useState('');
  const [plotQuery, setPlotQuery] = useState('');
  const [skipIds, setSkipIds] = useState([]);
  const discoveryLayoutRef = useRef(null);
  const moodPanelRef = useRef(null);
  const { watchlist, saveMovie, isMovieSaved } = useWatchlist();
  const copy = ui[language] || ui.ru;

  const filmOfTheDay = getFilmOfTheDay(movies);
  const genres = useMemo(() => getGenres(language), [language]);
  const years = useMemo(() => getYears(), []);
  const searchResults = useMemo(
    () =>
      searchMovies({
        actor: actorQuery,
        director: directorQuery,
        genre: selectedGenre,
        language,
        plot: plotQuery,
        query: movieQuery,
        year: selectedYear,
      }),
    [actorQuery, directorQuery, language, movieQuery, plotQuery, selectedGenre, selectedYear],
  );
  const hasSearchFilters =
    movieQuery.trim() ||
    selectedGenre ||
    selectedYear ||
    actorQuery.trim() ||
    directorQuery.trim() ||
    plotQuery.trim();
  const autoSelectedSearchMovieId = hasSearchFilters ? searchResults[0]?.id ?? '' : '';

  const recommendation = useMemo(
    () => getRecommendation({
      customMood,
      moodId: selectedMood,
      movieId: selectedSearchMovieId || selectedReleaseId || autoSelectedSearchMovieId,
      skipIds,
    }),
    [
      autoSelectedSearchMovieId,
      customMood,
      selectedMood,
      selectedReleaseId,
      selectedSearchMovieId,
      skipIds,
    ],
  );

  useEffect(() => {
    document.body.classList.toggle('light-theme-page', themeMode !== 'dark');
    document.body.classList.toggle('cartoon-theme-page', themeMode === 'cartoon');

    return () => {
      document.body.classList.remove('light-theme-page');
      document.body.classList.remove('cartoon-theme-page');
    };
  }, [themeMode]);

  useEffect(() => {
    const layoutElement = discoveryLayoutRef.current;
    const moodPanelElement = moodPanelRef.current;

    if (!layoutElement || !moodPanelElement) {
      return undefined;
    }

    const syncRailHeight = () => {
      layoutElement.style.setProperty(
        '--new-releases-height',
        `${moodPanelElement.offsetHeight}px`,
      );
    };

    syncRailHeight();

    const resizeObserver = new ResizeObserver(syncRailHeight);
    resizeObserver.observe(moodPanelElement);
    window.addEventListener('resize', syncRailHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', syncRailHeight);
    };
  }, [
    actorQuery,
    customMood,
    directorQuery,
    language,
    movieQuery,
    plotQuery,
    recommendation,
    selectedGenre,
    selectedMood,
    selectedYear,
  ]);

  function handleMoodSelect(moodId) {
    setCustomMood('');
    setSelectedReleaseId('');
    setSelectedSearchMovieId('');
    setSelectedMood(moodId);
    setSkipIds([]);
  }

  function handleCustomMoodChange(nextCustomMood) {
    setSelectedReleaseId('');
    setSelectedSearchMovieId('');
    setCustomMood(nextCustomMood);
    setSkipIds([]);
  }

  function handleReleaseSelect(movieId) {
    setCustomMood('');
    setSelectedSearchMovieId('');
    setSelectedReleaseId(movieId);
    setSkipIds([]);
  }

  function handleSearchMovieSelect(movieId) {
    setCustomMood('');
    setSelectedReleaseId('');
    setSelectedSearchMovieId(movieId);
    setSkipIds([]);
  }

  function handleMovieQueryChange(nextQuery) {
    setMovieQuery(nextQuery);
    setSelectedReleaseId('');
    setSelectedSearchMovieId('');
    setSkipIds([]);
  }

  function handleGenreChange(nextGenre) {
    setSelectedGenre(nextGenre);
    setSelectedReleaseId('');
    setSelectedSearchMovieId('');
    setSkipIds([]);
  }

  function handleYearChange(nextYear) {
    setSelectedYear(nextYear);
    setSelectedReleaseId('');
    setSelectedSearchMovieId('');
    setSkipIds([]);
  }

  function handleActorChange(nextActorQuery) {
    setActorQuery(nextActorQuery);
    setSelectedReleaseId('');
    setSelectedSearchMovieId('');
    setSkipIds([]);
  }

  function handleDirectorChange(nextDirectorQuery) {
    setDirectorQuery(nextDirectorQuery);
    setSelectedReleaseId('');
    setSelectedSearchMovieId('');
    setSkipIds([]);
  }

  function handlePlotChange(nextPlotQuery) {
    setPlotQuery(nextPlotQuery);
    setSelectedReleaseId('');
    setSelectedSearchMovieId('');
    setSkipIds([]);
  }

  function handleAnotherMovie() {
    if (!recommendation?.movie) return;
    setSkipIds((currentIds) => [...currentIds, recommendation.movie.id]);
  }

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
      <main>
        <HeroSection copy={copy} language={language} />
        <section className="discovery-layout" ref={discoveryLayoutRef} aria-label="Подбор фильма">
          <NewReleasesRail
            copy={copy}
            language={language}
            releases={newReleases}
            selectedMovieId={selectedReleaseId}
            onSelectRelease={handleReleaseSelect}
          />
          <div className="mvp-grid">
            <div className="mood-panel" ref={moodPanelRef}>
              <MoodQuickSelect
                copy={copy}
                customMood={customMood}
                language={language}
                moods={moods}
                selectedMood={selectedMood}
                onCustomMoodChange={handleCustomMoodChange}
                onSelectMood={handleMoodSelect}
              />
              <MovieSearchPanel
                copy={copy}
                actor={actorQuery}
                director={directorQuery}
                genre={selectedGenre}
                genres={genres}
                language={language}
                plot={plotQuery}
                query={movieQuery}
              selectedMovieId={selectedSearchMovieId}
                year={selectedYear}
                years={years}
                onActorChange={handleActorChange}
                onDirectorChange={handleDirectorChange}
                onGenreChange={handleGenreChange}
                onPlotChange={handlePlotChange}
                onQueryChange={handleMovieQueryChange}
                onSelectMovie={handleSearchMovieSelect}
                onYearChange={handleYearChange}
              />
              <FilmOfTheDay copy={copy} language={language} movie={filmOfTheDay} />
            </div>
            <div className="recommendation-stack">
              <a className="watchlist-link recommendation-watchlist-link" href="/profile#watchlist-preview">
                {copy.nav.watchlist} {watchlist.length > 0 ? `(${watchlist.length})` : ''}
              </a>
              <RecommendationResult
                copy={copy}
                language={language}
                recommendation={recommendation}
                onAnotherMovie={handleAnotherMovie}
                onSaveMovie={saveMovie}
                onSelectMovie={handleSearchMovieSelect}
                isSaved={recommendation ? isMovieSaved(recommendation.movie.id) : false}
              />
            </div>
          </div>
        </section>
        <HowItWorks copy={copy} />
      </main>
    </div>
  );
}
