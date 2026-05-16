import { useEffect, useMemo, useState } from 'react';
import Header from '../components/layout/Header.jsx';
import { movies } from '../data/movies.js';
import { newReleases } from '../data/newReleases.js';
import { ui } from '../data/translations.js';
import { getUserProfileProgress } from '../services/profileEngine.js';
import { localizeMovie } from '../utils/localization.js';

const friends = [
  {
    id: 'maria',
    name: 'Мария',
    title: 'Легенда YourFilm',
    taste: 'драма · вдохновение · семейное кино',
    status: 'смотрит уютные фильмы вечером',
    watchlistIds: ['inside-out-2', 'paddington-2', 'chef'],
    recommendationIds: ['the-secret-life-of-walter-mitty', 'little-miss-sunshine'],
    rank: 1,
    rating: 6420,
    friendsCount: 284,
    titles: ['Легенда YourFilm', 'Кинокритик', 'Психолог кино'],
    achievements: ['7/7 наград', 'Мастер подборок', 'Лучший отзыв недели'],
  },
  {
    id: 'sofia',
    name: 'София',
    title: 'Романтик кино',
    taste: 'романтика · мюзиклы · тёплая меланхолия',
    status: 'собирает подборку после расставания',
    watchlistIds: ['la-la-land', 'wicked', 'the-fall-guy'],
    recommendationIds: ['la-la-land', 'little-miss-sunshine'],
    rank: 3,
    rating: 5215,
    friendsCount: 176,
    titles: ['Романтик кино', 'Кинокритик', 'Ночной зритель'],
    achievements: ['5/7 наград', 'Лучшие романтические подборки', 'Тёплые отзывы'],
  },
  {
    id: 'daniil',
    name: 'Даниил',
    title: 'Мастер мотивации',
    taste: 'мотивация · биографии · внутренний рост',
    status: 'готов к совместному просмотру',
    watchlistIds: ['the-pursuit-of-happyness', 'dune-part-two', 'furiosa'],
    recommendationIds: ['the-pursuit-of-happyness', 'chef'],
    rank: 2,
    rating: 5890,
    friendsCount: 219,
    titles: ['Мастер мотивации', 'Исследователь жанров', 'Киноман'],
    achievements: ['6/7 наград', 'Серия просмотров', 'Рекомендации друзьям'],
  },
];

function getMovieById(movieId) {
  return [...newReleases, ...movies].find((movie) => movie.id === movieId);
}

export default function FriendsPage() {
  const [language, setLanguage] = useState(() => localStorage.getItem('yourfilm.language') || 'ru');
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem('yourfilm.theme');

    if (savedTheme) {
      return savedTheme;
    }

    return localStorage.getItem('yourfilm.lightTheme') === 'true' ? 'light' : 'dark';
  });
  const [selectedFriendId, setSelectedFriendId] = useState(friends[0].id);
  const [friendRequestSent, setFriendRequestSent] = useState('');
  const [shareTarget, setShareTarget] = useState(friends[0].id);
  const [shareKind, setShareKind] = useState('film');
  const [shareMessage, setShareMessage] = useState('Думаю, тебе может понравиться этот фильм');
  const copy = ui[language] || ui.ru;
  const myProfile = useMemo(() => getUserProfileProgress(), []);
  const myUnlockedAchievements = myProfile.achievements.filter((achievement) => achievement.unlocked);
  const myRatingScore =
    myProfile.xp * 10 + myUnlockedAchievements.length * 85 + myProfile.watchedCount * 40;
  const selectedFriend = friends.find((friend) => friend.id === selectedFriendId) ?? friends[0];
  const openWatchlistMovies = selectedFriend.watchlistIds.map(getMovieById).filter(Boolean);
  const recommendedMovies = selectedFriend.recommendationIds.map(getMovieById).filter(Boolean);
  const watchPartyMovie = useMemo(() => localizeMovie(openWatchlistMovies[0] ?? movies[0], language), [
    language,
    openWatchlistMovies,
  ]);

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
      <main className="friends-page">
        <section className="friends-hero">
          <p className="eyebrow">Друзья</p>
          <h1>Кино вместе с людьми, чей вкус тебе близок</h1>
          <p>
            Добавляй друзей, смотри их открытые watchlist, получай рекомендации, планируй
            совместный просмотр и отправляй фильмы или списки.
          </p>
        </section>

        <section className="friends-layout" aria-label="Друзья YourFilm">
          <aside className="friends-list-panel">
            <div className="leaderboard-heading">
              <span>Друзья</span>
              <strong>{friends.length} в списке</strong>
            </div>
            <article className="my-profile-preview-card">
              <div className="friend-avatar">{myProfile.name.slice(0, 1)}</div>
              <div>
                <p className="eyebrow">Мой профиль</p>
                <strong>{myProfile.name}</strong>
                <small>{myProfile.title}</small>
              </div>
              <div className="my-profile-preview-stats">
                <span>{myRatingScore} рейтинг</span>
                <span>{myProfile.watchedCount} фильма</span>
                <span>{myUnlockedAchievements.length} награды</span>
              </div>
            </article>
            <button
              className="add-friend-button"
              type="button"
              onClick={() => setFriendRequestSent('Заявка отправлена новому другу')}
            >
              + Добавить друга
            </button>
            {friendRequestSent ? <p className="friend-notice">{friendRequestSent}</p> : null}
            <div className="friend-list">
              {friends.map((friend) => (
                <button
                  className={friend.id === selectedFriendId ? 'friend-row active' : 'friend-row'}
                  key={friend.id}
                  type="button"
                  onClick={() => {
                    setSelectedFriendId(friend.id);
                    setShareTarget(friend.id);
                  }}
                >
                  <span>{friend.name.slice(0, 1)}</span>
                  <div>
                    <strong>{friend.name}</strong>
                    <small>{friend.title}</small>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="friend-detail-panel">
            <div className="friend-profile-card">
              <div className="friend-avatar">{selectedFriend.name.slice(0, 1)}</div>
              <div>
                <p className="eyebrow">Профиль друга</p>
                <h2>{selectedFriend.name}</h2>
                <p>{selectedFriend.taste}</p>
                <span>{selectedFriend.status}</span>
              </div>
            </div>

            <div className="friends-grid">
              <article className="friend-section-card friend-achievements-card">
                <div className="leaderboard-heading">
                  <span>Достижения друга</span>
                  <strong>#{selectedFriend.rank} · {selectedFriend.rating}</strong>
                </div>
                <div className="friend-rating-strip">
                  <article>
                    <span>Рейтинг</span>
                    <strong>{selectedFriend.rating}</strong>
                  </article>
                  <article>
                    <span>Друзья</span>
                    <strong>{selectedFriend.friendsCount}</strong>
                  </article>
                  <article>
                    <span>Место</span>
                    <strong>#{selectedFriend.rank}</strong>
                  </article>
                </div>
                <div className="friend-public-tags">
                  <span>Титулы</span>
                  {selectedFriend.titles.map((title) => (
                    <strong key={title}>{title}</strong>
                  ))}
                </div>
                <div className="friend-public-tags">
                  <span>Награды</span>
                  {selectedFriend.achievements.map((achievement) => (
                    <strong key={achievement}>{achievement}</strong>
                  ))}
                </div>
              </article>

              <article className="friend-section-card">
                <div className="leaderboard-heading">
                  <span>Рекомендации от друзей</span>
                  <strong>Фильмы</strong>
                </div>
                <div className="friend-movie-list">
                  {recommendedMovies.map((movie) => {
                    const localizedMovie = localizeMovie(movie, language);

                    return (
                      <div className="friend-movie-card" key={movie.id}>
                        <img src={movie.poster} alt={localizedMovie.title} />
                        <div>
                          <strong>{localizedMovie.title}</strong>
                          <small>{localizedMovie.shortReason}</small>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>

              <article className="friend-section-card">
                <div className="leaderboard-heading">
                  <span>Открытый watchlist</span>
                  <strong>{openWatchlistMovies.length} фильма</strong>
                </div>
                <div className="friend-watchlist-stack">
                  {openWatchlistMovies.map((movie) => {
                    const localizedMovie = localizeMovie(movie, language);

                    return <img src={movie.poster} alt={localizedMovie.title} key={movie.id} />;
                  })}
                </div>
                <p>Можно открыть список, выбрать фильм и отправить его в совместный просмотр.</p>
              </article>

              <article className="friend-section-card watch-party-card">
                <div className="leaderboard-heading">
                  <span>Совместный просмотр</span>
                  <strong>Сегодня</strong>
                </div>
                <h3>{watchPartyMovie.title}</h3>
                <p>Предложи время, собери друзей и запусти общий просмотр с обсуждением после фильма.</p>
                <button className="primary-action" type="button">
                  Запланировать просмотр
                </button>
              </article>

              <article className="friend-section-card share-card">
                <div className="leaderboard-heading">
                  <span>Отправка фильмов и списков</span>
                  <strong>Поделиться</strong>
                </div>
                <label>
                  <span>Друг</span>
                  <select value={shareTarget} onChange={(event) => setShareTarget(event.target.value)}>
                    {friends.map((friend) => (
                      <option value={friend.id} key={friend.id}>
                        {friend.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Что отправить</span>
                  <select value={shareKind} onChange={(event) => setShareKind(event.target.value)}>
                    <option value="film">Фильм</option>
                    <option value="playlist">Список фильмов</option>
                  </select>
                </label>
                <label>
                  <span>Сообщение</span>
                  <textarea value={shareMessage} onChange={(event) => setShareMessage(event.target.value)} />
                </label>
                <button className="primary-action" type="button">
                  Отправить {shareKind === 'film' ? 'фильм' : 'список'}
                </button>
              </article>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
