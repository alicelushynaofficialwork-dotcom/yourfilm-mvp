import { useState } from 'react';
import { userLevels, userTitles } from '../../data/profile.js';
import { localizeMovie } from '../../utils/localization.js';

export default function UserProfilePanel({ language = 'ru', profile, watchlist = [] }) {
  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false);
  const [activeProfileSection, setActiveProfileSection] = useState('my-achievements');
  const unlockedAchievements = profile.achievements.filter((achievement) => achievement.unlocked);
  const ratingScore = profile.xp * 10 + unlockedAchievements.length * 85 + profile.watchedCount * 40;
  const savedMovies = watchlist.length > 0
    ? watchlist.slice(0, 4).map((movie) => localizeMovie(movie, language).title)
    : profile.watchLater;
  const monthMovies = savedMovies.slice(0, 4);
  const profileSections = [
    { id: 'my-calendar', label: 'Мой календарь' },
    { id: 'my-statistics', label: 'Моя статистика' },
    { id: 'my-achievements', label: 'Мои достижения' },
    { id: 'my-month-movies', label: 'Мои фильмы месяца' },
  ];
  const calendarDays = [
    { day: 'Пн', value: 'Подбор' },
    { day: 'Вт', value: 'Watchlist' },
    { day: 'Ср', value: 'Отзыв' },
    { day: 'Чт', value: 'Премьера' },
    { day: 'Пт', value: 'Киновечер' },
    { day: 'Сб', value: 'Марафон' },
    { day: 'Вс', value: 'Итоги' },
  ];
  const awardTypes = {
    'watched-count': 'bronze',
    'genre-variety': 'silver',
    'mood-films': 'gold',
    'collection-paths': 'trophy',
    reviews: 'bronze',
    'friend-recommendations': 'silver',
    'viewing-streak': 'gold',
  };
  const awardIcons = {
    'watched-count': '▶',
    'genre-variety': '▦',
    'mood-films': '◐',
    'collection-paths': '◆',
    reviews: '✎',
    'friend-recommendations': '↗',
    'viewing-streak': '∞',
  };
  const leaderboard = [
    { place: 1, name: 'Мария', title: 'Легенда YourFilm', score: 6420, trend: '+240' },
    { place: 2, name: 'Даниил', title: 'Мастер кино', score: 5890, trend: '+180' },
    { place: 3, name: 'София', title: 'Кинокритик', score: 5215, trend: '+120' },
    { place: 128, name: profile.name, title: profile.title, score: ratingScore, trend: '+85', current: true },
  ];
  const levelGoals = {
    newbie: 'Сделать первый подбор и сохранить фильм',
    'movie-fan': 'Смотреть фильмы и открыть первые награды',
    'genre-explorer': 'Попробовать разные жанры и настроения',
    critic: 'Оставлять отзывы после просмотра',
    master: 'Проходить подборки и советовать друзьям',
    legend: 'Собрать титулы и стать лидером сезона',
  };
  const ratingSections = [
    {
      id: 'global',
      title: 'Общий рейтинг пользователей',
      value: '#128',
      description: 'Место среди всех пользователей YourFilm',
    },
    {
      id: 'genres',
      title: 'Рейтинг по жанрам',
      value: '#34',
      description: 'Позиция в любимых жанрах и тематических подборках',
    },
    {
      id: 'critics',
      title: 'Рейтинг кинокритиков',
      value: '#72',
      description: 'Баллы за отзывы, оценки и разборы фильмов',
    },
    {
      id: 'friends',
      title: 'Рейтинг друзей',
      value: '#5',
      description: 'Позиция среди друзей и совместных watchlists',
    },
    {
      id: 'seasonal',
      title: 'Сезонные рейтинги',
      value: 'Весна 2026',
      description: 'Прогресс в текущем сезонном событии',
    },
  ];

  const aiProfilePanel = (
    <div className="ai-profile-panel">
      <div className="leaderboard-heading">
        <span>AI-профиль</span>
        <strong>Темы выбора</strong>
      </div>
      <p>
        AI анализирует, какие фильмы человек выбирает чаще, и собирает карту эмоциональных
        интересов для более точных рекомендаций.
      </p>
      <div className="ai-profile-grid">
        {profile.aiProfile.map((item) => (
          <article className="ai-profile-card" key={item.id}>
            <div>
              <strong>{item.label}</strong>
              <span>{item.score}%</span>
            </div>
            <div className="ai-score-track" aria-label={`${item.label} ${item.score}%`}>
              <span style={{ width: `${item.score}%` }} />
            </div>
            <small>{item.insight}</small>
          </article>
        ))}
      </div>
    </div>
  );
  const cinemaProfilePanel = (
    <div className="profile-insights">
      <div className="leaderboard-heading">
        <span>Кино-профиль</span>
        <strong>Персональные данные</strong>
      </div>
      <div className="profile-insight-grid">
        <article className="profile-insight-card">
          <span>Любимые жанры</span>
          <div className="profile-tag-list">
            {profile.favoriteGenres.map((genre) => (
              <strong key={genre}>{genre}</strong>
            ))}
          </div>
        </article>
        <article className="profile-insight-card">
          <span>Любимые фильмы</span>
          <ul>
            {profile.favoriteMovies.map((movie) => (
              <li key={movie}>{movie}</li>
            ))}
          </ul>
        </article>
        <article className="profile-insight-card portrait-card">
          <span>Эмоциональный кино-портрет</span>
          <ul>
            {profile.emotionalPortrait.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="profile-insight-card">
          <span>Watchlist / фильмы на потом</span>
          <ul>
            {savedMovies.map((movie) => (
              <li key={movie}>{movie}</li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );

  return (
    <section className="profile-panel rating-board" id="profile" aria-label="Профиль пользователя">
      <div className="rating-header">
        <div>
          <p className="eyebrow">Рейтинг YourFilm</p>
          <h2>Игровой профиль</h2>
        </div>
        <div className="rating-season">
          <span>Сезон</span>
          <strong>Весна 2026</strong>
        </div>
      </div>

      <div className="profile-section-menu">
        <button
          className="profile-section-trigger"
          type="button"
          aria-expanded={isSectionMenuOpen}
          aria-controls="profile-section-list"
          onClick={() => setIsSectionMenuOpen((isOpen) => !isOpen)}
        >
          Разделы профиля
        </button>
        {isSectionMenuOpen ? (
          <div className="profile-section-list" id="profile-section-list">
            {profileSections.map((section) => (
              <button
                className={activeProfileSection === section.id ? 'active' : ''}
                type="button"
                key={section.id}
                onClick={() => {
                  setActiveProfileSection(section.id);
                  setIsSectionMenuOpen(false);
                }}
              >
                {section.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {activeProfileSection === 'my-calendar' ? (
        <div className="profile-calendar">
          <div className="leaderboard-heading">
            <span>Мой календарь</span>
            <strong>План недели</strong>
          </div>
          <div className="profile-calendar-grid" aria-label="Календарь профиля">
            {calendarDays.map((item) => (
              <article key={item.day}>
                <span>{item.day}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {activeProfileSection === 'my-statistics' ? (
        <div className="profile-statistics-section">
          <div className="leaderboard-heading">
            <span>Моя статистика</span>
            <strong>{ratingScore} баллов</strong>
          </div>
          <div className="rating-stats">
            <article>
              <span>Фильмы</span>
              <strong>{profile.watchedCount}</strong>
            </article>
            <article>
              <span>Награды</span>
              <strong>
                {unlockedAchievements.length}/{profile.achievements.length}
              </strong>
            </article>
            <article>
              <span>Вектор</span>
              <strong>{profile.favoriteMood}</strong>
            </article>
          </div>
          {cinemaProfilePanel}
          {aiProfilePanel}
        </div>
      ) : null}

      {activeProfileSection === 'my-month-movies' ? (
        <div className="profile-month-movies">
          <div className="leaderboard-heading">
            <span>Мои фильмы месяца</span>
            <strong>{monthMovies.length} в подборке</strong>
          </div>
          <div className="month-movie-list">
            {monthMovies.map((movie, index) => (
              <article key={movie}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{movie}</strong>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {activeProfileSection === 'my-achievements' ? (
        <>
      <div className="current-rating-card">
        <div className="rank-position">
          <span>Место</span>
          <strong>#128</strong>
        </div>
        <div className="player-avatar rating-avatar" aria-hidden="true">
          {profile.name.slice(0, 1)}
        </div>
        <div className="rating-player">
          <span>{profile.level.name}</span>
          <strong>{profile.name}</strong>
          <small>{profile.title}</small>
        </div>
        <div className="rating-score">
          <span>Рейтинг</span>
          <strong>{ratingScore}</strong>
        </div>

        <div className="profile-progress rating-progress">
          <div>
            <span>{profile.xp} XP</span>
            <small>
              До уровня «{profile.nextLevel.name}» осталось {profile.xpToNextLevel} XP
            </small>
          </div>
          <div className="xp-track" aria-label={`Прогресс уровня ${profile.progressPercent}%`}>
            <span style={{ width: `${profile.progressPercent}%` }} />
          </div>
        </div>

        <div className="rating-stats">
          <article>
            <span>Фильмы</span>
            <strong>{profile.watchedCount}</strong>
          </article>
          <article>
            <span>Награды</span>
            <strong>
              {unlockedAchievements.length}/{profile.achievements.length}
            </strong>
          </article>
          <article>
            <span>Вектор</span>
            <strong>{profile.favoriteMood}</strong>
          </article>
        </div>
      </div>

      <div className="leaderboard-panel">
        <div className="leaderboard-heading">
          <span>Таблица лидеров</span>
          <strong>Топ сезона</strong>
        </div>
        <div className="leaderboard-list">
          {leaderboard.map((player) => (
            <article className={player.current ? 'leader-row current' : 'leader-row'} key={player.place}>
              <span className="leader-place">#{player.place}</span>
              <div>
                <strong>{player.name}</strong>
                <small>{player.title}</small>
              </div>
              <span className="leader-score">{player.score}</span>
              <span className="leader-trend">{player.trend}</span>
            </article>
          ))}
        </div>
      </div>

      <div className="ratings-hub">
        <div className="leaderboard-heading">
          <span>Рейтинги</span>
          <strong>5 разделов</strong>
        </div>
        <div className="ratings-hub-list" aria-label="Разделы рейтингов">
          {ratingSections.map((section) => (
            <article className={`rating-section-card ${section.id}`} key={section.id}>
              <span>{section.value}</span>
              <strong>{section.title}</strong>
              <small>{section.description}</small>
            </article>
          ))}
        </div>
      </div>

      {false ? (
      <div className="profile-insights">
        <div className="leaderboard-heading">
          <span>Кино-профиль</span>
          <strong>Персональные данные</strong>
        </div>
        <div className="profile-insight-grid">
          <article className="profile-insight-card">
            <span>Любимые жанры</span>
            <div className="profile-tag-list">
              {profile.favoriteGenres.map((genre) => (
                <strong key={genre}>{genre}</strong>
              ))}
            </div>
          </article>
          <article className="profile-insight-card">
            <span>Любимые фильмы</span>
            <ul>
              {profile.favoriteMovies.map((movie) => (
                <li key={movie}>{movie}</li>
              ))}
            </ul>
          </article>
          <article className="profile-insight-card portrait-card">
            <span>Эмоциональный кино-портрет</span>
            <ul>
              {profile.emotionalPortrait.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="profile-insight-card">
            <span>Watchlist / фильмы на потом</span>
            <ul>
              {savedMovies.map((movie) => (
                <li key={movie}>{movie}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
      ) : null}

      {false ? (
      <div className="ai-profile-panel">
        <div className="leaderboard-heading">
          <span>AI-профиль</span>
          <strong>Темы выбора</strong>
        </div>
        <p>
          AI анализирует, какие фильмы человек выбирает чаще, и собирает карту эмоциональных
          интересов для более точных рекомендаций.
        </p>
        <div className="ai-profile-grid">
          {profile.aiProfile.map((item) => (
            <article className="ai-profile-card" key={item.id}>
              <div>
                <strong>{item.label}</strong>
                <span>{item.score}%</span>
              </div>
              <div className="ai-score-track" aria-label={`${item.label} ${item.score}%`}>
                <span style={{ width: `${item.score}%` }} />
              </div>
              <small>{item.insight}</small>
            </article>
          ))}
        </div>
      </div>

      ) : null}

      <div className="compact-awards">
        <div className="leaderboard-heading">
          <span>Рейтинговые награды</span>
          <strong>{unlockedAchievements.length} открыто</strong>
        </div>
        <div className="compact-award-list">
          {profile.achievements.map((achievement) => (
            <article
              className={`compact-award award-${awardTypes[achievement.id] ?? 'bronze'}${
                achievement.unlocked ? '' : ' locked'
              }`}
              key={achievement.id}
            >
              <div className="award-medal" aria-hidden="true">
                <span className="award-icon">{awardIcons[achievement.id] ?? '★'}</span>
              </div>
              <div>
                <strong>{achievement.title}</strong>
                <small>{achievement.description}</small>
                <em>{achievement.unlocked ? 'Открыто' : 'Еще не достигнуто'}</em>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="level-path">
        <div className="leaderboard-heading">
          <span>Путь пользователя</span>
          <strong>{profile.level.name}</strong>
        </div>
        <div className="level-path-list" aria-label="Уровни пользователя">
          {userLevels.map((level) => {
            const isCompleted = profile.xp >= level.maxXp && level.id !== profile.level.id;
            const isCurrent = level.id === profile.level.id;

            return (
              <article
                className={`level-step${isCurrent ? ' current' : ''}${isCompleted ? ' completed' : ''}`}
                key={level.id}
              >
                <span className="level-flag" aria-hidden="true" />
                <strong>{level.name}</strong>
                <small>
                  {isCurrent
                    ? 'Текущий уровень'
                    : isCompleted
                      ? 'Пройден'
                      : `${level.minXp}+ XP`}
                </small>
                <p>{levelGoals[level.id]}</p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="title-board">
        <div className="leaderboard-heading">
          <span>Титулы пользователя</span>
          <strong>{profile.title}</strong>
        </div>
        <div className="title-list" aria-label="Титулы пользователя">
          {userTitles.map((title) => {
            const isCurrent = title.name === profile.title;
            const isEarned = profile.earnedTitles?.includes(title.name);

            return (
              <article
                className={`title-card${isCurrent ? ' current' : ''}${isEarned ? ' earned' : ' locked'}`}
                key={title.id}
              >
                <span>{isCurrent ? 'Текущий' : isEarned ? 'Получен' : 'Будущий'}</span>
                <strong>{title.name}</strong>
                <div className="title-prize">
                  <b>+{title.xpReward} XP</b>
                  <i aria-label={`${title.stars} звезд`}>
                    {'★'.repeat(title.stars)}
                    {'☆'.repeat(5 - title.stars)}
                  </i>
                </div>
                <small>{title.description}</small>
              </article>
            );
          })}
        </div>
      </div>
        </>
      ) : null}
    </section>
  );
}
