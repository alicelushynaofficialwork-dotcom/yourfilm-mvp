import { useEffect, useState } from 'react';
import { movies } from '../../data/movies.js';
import { userLevels, userTitles } from '../../data/profile.js';
import { localizeMovie } from '../../utils/localization.js';

const calendarWeekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const watchedMovieSchedule = [
  {
    day: 2,
    watchedAt: '2026-05-02',
    movieId: 'the-secret-life-of-walter-mitty',
    note: 'Вечер для вдохновения',
    watchedTime: '20:15',
    minutesWatched: 114,
    completed: true,
    moodBefore: 'Усталость',
    moodAfter: 'Вдохновение',
    rating: 9,
    helpedEmotionally: true,
    rewatch: false,
    visibility: 'public',
    userComment: 'После него захотелось снова планировать путешествия и не откладывать жизнь.',
  },
  {
    day: 6,
    watchedAt: '2026-05-06',
    movieId: 'little-miss-sunshine',
    note: 'Мягкий фильм после тяжелого дня',
    watchedTime: '19:40',
    minutesWatched: 101,
    completed: true,
    moodBefore: 'Грусть',
    moodAfter: 'Тепло',
    rating: 8,
    helpedEmotionally: true,
    rewatch: false,
    visibility: 'public',
    userComment: 'Очень теплый фильм, будто кто-то аккуратно напомнил: странность тоже сила.',
  },
  {
    day: 9,
    watchedAt: '2026-05-09',
    movieId: 'chef',
    note: 'Уютный просмотр дома',
    watchedTime: '21:05',
    minutesWatched: 86,
    completed: false,
    moodBefore: 'Тревога',
    moodAfter: 'Спокойствие',
    rating: 8,
    helpedEmotionally: true,
    rewatch: true,
    visibility: 'private',
    userComment: 'Смотрела не до конца, но стало спокойнее. Оставлю для уютного вечера.',
  },
  {
    day: 14,
    watchedAt: '2026-05-14',
    movieId: 'la-la-land',
    note: 'Романтичный вечер',
    watchedTime: '22:10',
    minutesWatched: 128,
    completed: true,
    moodBefore: 'Ностальгия',
    moodAfter: 'Меланхолия',
    rating: 9,
    helpedEmotionally: false,
    rewatch: false,
    visibility: 'public',
    userComment: 'Красиво, но грустно. Фильм больше про принятие, чем про легкость.',
  },
  {
    day: 19,
    watchedAt: '2026-05-19',
    movieId: 'the-pursuit-of-happyness',
    note: 'Фильм для мотивации',
    watchedTime: '18:50',
    minutesWatched: 117,
    completed: true,
    moodBefore: 'Неуверенность',
    moodAfter: 'Собранность',
    rating: 10,
    helpedEmotionally: true,
    rewatch: false,
    visibility: 'public',
    userComment: 'Очень помог собраться и перестать себя жалеть.',
  },
  {
    day: 23,
    watchedAt: '2026-05-23',
    movieId: 'paddington-2',
    note: 'Легкое семейное кино',
    watchedTime: '17:30',
    minutesWatched: 103,
    completed: true,
    moodBefore: 'Напряжение',
    moodAfter: 'Легкость',
    rating: 9,
    helpedEmotionally: true,
    rewatch: true,
    visibility: 'public',
    userComment: 'Идеально, когда хочется чего-то доброго и безопасного.',
  },
];

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getCalendarLocale(language) {
  if (language === 'uk') return 'uk-UA';
  if (language === 'en') return 'en-US';

  return 'ru-RU';
}

function formatMonthInLabel(cursor, language) {
  if (language !== 'ru') {
    return cursor.toLocaleDateString(getCalendarLocale(language), {
      month: 'long',
      year: 'numeric',
    });
  }

  const monthNames = [
    'январе',
    'феврале',
    'марте',
    'апреле',
    'мае',
    'июне',
    'июле',
    'августе',
    'сентябре',
    'октябре',
    'ноябре',
    'декабре',
  ];

  return `${monthNames[cursor.getMonth()]} ${cursor.getFullYear()} г.`;
}

function getCalendarCells(cursor, watchedByDate) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7;
  const emptyCells = Array.from({ length: leadingEmptyDays }, (_, index) => ({
    id: `empty-${index}`,
    empty: true,
  }));
  const dayCells = Array.from({ length: daysInMonth }, (_, index) => {
    const date = new Date(year, month, index + 1);
    const dateKey = formatDateKey(date);

    return {
      id: dateKey,
      day: index + 1,
      dateKey,
      event: watchedByDate.get(dateKey),
    };
  });

  return [...emptyCells, ...dayCells];
}

function getTopValue(items, getValue) {
  const counts = items.reduce((accumulator, item) => {
    const value = getValue(item);
    accumulator[value] = (accumulator[value] ?? 0) + 1;
    return accumulator;
  }, {});
  const [topValue] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] ?? [];

  return topValue ?? 'Пока нет данных';
}

function formatWatchHours(minutes) {
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;

  if (!hours) return `${restMinutes} мин`;
  if (!restMinutes) return `${hours} ч`;

  return `${hours} ч ${restMinutes} мин`;
}

function getViewingStreak(entries) {
  const watchedDays = entries
    .map((entry) => Math.floor(entry.date.getTime() / 86400000))
    .sort((a, b) => a - b);
  let currentStreak = 0;
  let maxStreak = 0;
  let previousDay = null;

  watchedDays.forEach((day) => {
    currentStreak = previousDay === day - 1 ? currentStreak + 1 : 1;
    maxStreak = Math.max(maxStreak, currentStreak);
    previousDay = day;
  });

  return maxStreak;
}

function isSameMonth(date, cursor) {
  return date.getFullYear() === cursor.getFullYear() && date.getMonth() === cursor.getMonth();
}

function isSameWeek(date, cursor) {
  const start = new Date(cursor);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return date >= start && date < end;
}

function getProfileSectionFromHash() {
  const hash = window.location.hash;

  if (hash === '#achievements') return 'my-achievements';
  if (hash === '#public-profile') return 'my-public-profile';
  if (hash === '#statistics') return 'my-statistics';
  if (hash === '#watchlist-preview' || hash === '#watch-later' || hash === '#playlists') return 'my-playlists';
  if (hash === '#calendar') return 'my-calendar';

  return 'my-achievements';
}

export default function UserProfilePanel({
  copy,
  language = 'ru',
  profile,
  watchlist = [],
  onRemoveMovie,
}) {
  const [activeProfileSection, setActiveProfileSection] = useState(() => getProfileSectionFromHash());
  const [calendarCursor, setCalendarCursor] = useState(() => {
    const today = new Date();

    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(() => formatDateKey(new Date()));
  const [historySearch, setHistorySearch] = useState('');
  const [historyPeriod, setHistoryPeriod] = useState('month');
  const [historyDateFrom, setHistoryDateFrom] = useState('');
  const [historyDateTo, setHistoryDateTo] = useState('');
  const [historyGenre, setHistoryGenre] = useState('all');
  const [historyMood, setHistoryMood] = useState('all');
  const [historyRating, setHistoryRating] = useState('all');
  const [historyVisibility, setHistoryVisibility] = useState('all');
  const [historyCompletion, setHistoryCompletion] = useState('all');
  const [statisticsPeriod, setStatisticsPeriod] = useState('month');
  const [statisticsDateFrom, setStatisticsDateFrom] = useState('');
  const [statisticsDateTo, setStatisticsDateTo] = useState('');
  const [historyComments, setHistoryComments] = useState({});
  const [historyPrivacy, setHistoryPrivacy] = useState({});
  const [shareFriend, setShareFriend] = useState('Мария');
  const [shareMessage, setShareMessage] = useState('Я посмотрела этот фильм сегодня, думаю тебе тоже может понравиться');
  const [shareStatus, setShareStatus] = useState('');
  const [expandedPlaylistGroups, setExpandedPlaylistGroups] = useState({
    personal: true,
    themed: false,
  });
  const [openPlaylistMenu, setOpenPlaylistMenu] = useState('');
  const [playlistNotice, setPlaylistNotice] = useState('');
  const [createdPlaylists, setCreatedPlaylists] = useState([]);
  const [profileVisibility, setProfileVisibility] = useState('friends');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [calendarViewFilter, setCalendarViewFilter] = useState('watched');
  const [openCardMenu, setOpenCardMenu] = useState('');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    movieId: 'chef',
    friend: 'Мария',
    date: '2026-05-20',
    time: '20:00',
    comment: 'Думаю, нам понравится этот фильм',
  });
  const [plannedWatchEntries, setPlannedWatchEntries] = useState([
    {
      id: 'planned-chef-maria',
      movieId: 'chef',
      friend: 'Мария',
      dateKey: '2026-05-20',
      time: '20:00',
      comment: 'Уютный фильм для совместного вечера',
      status: 'ожидает подтверждения',
    },
  ]);
  const [chatMessages, setChatMessages] = useState([]);
  const unlockedAchievements = profile.achievements.filter((achievement) => achievement.unlocked);
  const ratingScore = profile.xp * 10 + unlockedAchievements.length * 85 + profile.watchedCount * 40;
  const savedMovies = watchlist.length > 0
    ? watchlist.slice(0, 4).map((movie) => localizeMovie(movie, language).title)
    : profile.watchLater;
  const monthMovies = savedMovies.slice(0, 4);
  const profileSections = [
    { id: 'my-achievements', label: 'Мой основной профиль' },
    { id: 'my-public-profile', label: 'Мой публичный профиль' },
    { id: 'my-playlists', label: 'Мои плейлисты' },
    { id: 'my-calendar', label: 'Мой календарь' },
    { id: 'my-statistics', label: 'Моя статистика' },
  ];
  const fallbackWatchlistMovies = movies.filter((movie) =>
    profile.watchLater.includes(localizeMovie(movie, language).title),
  );
  const watchLaterMovies = watchlist.length > 0 ? watchlist : fallbackWatchlistMovies;
  const playlistGroups = [
    {
      id: 'personal',
      title: 'Личные плейлисты',
      description: 'Списки, которые собираешь для себя.',
      playlists: [
        {
          id: 'watch-later-playlist',
          title: 'Смотреть позже плейлист',
          description: 'Фильмы, которые ты сохранила на потом.',
          movies: watchLaterMovies,
        },
        ...createdPlaylists,
      ],
    },
    {
      id: 'themed',
      title: 'Подборки по настроению',
      description: 'Готовые группы, которые можно раскрывать и дополнять.',
      playlists: [
        {
          id: 'cozy-evening-playlist',
          title: 'Для уютного вечера',
          description: 'Мягкие фильмы для спокойного просмотра.',
          movies: movies.filter((movie) => ['chef', 'paddington-2', 'little-miss-sunshine'].includes(movie.id)),
        },
        {
          id: 'motivation-playlist',
          title: 'Для мотивации',
          description: 'Истории, после которых хочется снова действовать.',
          movies: movies.filter((movie) =>
            ['the-secret-life-of-walter-mitty', 'the-pursuit-of-happyness'].includes(movie.id),
          ),
        },
      ],
    },
  ];
  const publicProfileFriends = ['Мария', 'София', 'Даниил'];
  const openPublicPlaylists = playlistGroups.flatMap((group) =>
    group.playlists.map((playlist) => ({
      ...playlist,
      groupTitle: group.title,
    })),
  );
  const publicFriendRecommendations = [
    {
      friend: 'Мария',
      movieId: 'chef',
      comment:
        'Мне понравилось, как фильм возвращает спокойствие через простые вещи. Кажется, тебе тоже зайдет для уютного вечера.',
      sharedFrom: 'Поделилась через календарь просмотров',
    },
    {
      friend: 'София',
      movieId: 'la-la-land',
      comment:
        'Очень красивый фильм про мечту и выбор. Думаю, тебе понравится его атмосфера и мягкая меланхолия.',
      sharedFrom: 'Поделилась через календарь просмотров',
    },
    {
      friend: 'Даниил',
      movieId: 'the-pursuit-of-happyness',
      comment:
        'Мне понравилась мотивация героя. Кажется, тебе тоже подойдет, когда хочется собраться и снова поверить в себя.',
      sharedFrom: 'Поделился через календарь просмотров',
    },
  ];
  const shareableMovies = [...movies];

  function togglePlaylistGroup(groupId) {
    setExpandedPlaylistGroups((currentGroups) => ({
      ...currentGroups,
      [groupId]: !currentGroups[groupId],
    }));
  }

  function handleCreatePlaylist() {
    const playlistNumber = createdPlaylists.length + 1;

    setCreatedPlaylists((currentPlaylists) => [
      ...currentPlaylists,
      {
        id: `custom-playlist-${playlistNumber}`,
        title: `Новый плейлист ${playlistNumber}`,
        description: 'Пустой плейлист для будущих фильмов.',
        movies: [],
      },
    ]);
    setPlaylistNotice(`Создан плейлист: Новый плейлист ${playlistNumber}`);
    setOpenPlaylistMenu('');
    setExpandedPlaylistGroups((currentGroups) => ({
      ...currentGroups,
      personal: true,
    }));
  }
  const allWatchedEntries = watchedMovieSchedule
    .map((entry) => {
      const movie = movies.find((item) => item.id === entry.movieId);
      const date = new Date(entry.watchedAt);
      const dateKey = formatDateKey(date);

      if (!movie) return null;

      return {
        ...entry,
        date,
        day: date.getDate(),
        dateKey,
        movie,
        userComment: historyComments[dateKey] ?? entry.userComment,
        visibility: historyPrivacy[dateKey] ?? entry.visibility ?? 'public',
      };
    })
    .filter(Boolean);
  const watchedEntries = allWatchedEntries.filter((entry) => isSameMonth(entry.date, calendarCursor));
  const watchedByDate = new Map(
    watchedEntries.map((entry) => [
      entry.dateKey,
      { ...entry, kind: 'watched' },
    ]),
  );
  const scheduledEntries = plannedWatchEntries
    .map((entry) => {
      const movie = movies.find((item) => item.id === entry.movieId);
      const date = new Date(`${entry.dateKey}T${entry.time || '20:00'}`);

      if (!movie) return null;

      return {
        ...entry,
        date,
        day: date.getDate(),
        movie,
        minutesWatched: movie.runtime ?? 120,
        kind: 'planned',
      };
    })
    .filter(Boolean)
    .filter((entry) => isSameMonth(entry.date, calendarCursor));
  const calendarEvents = calendarViewFilter === 'planned'
    ? scheduledEntries
    : calendarViewFilter === 'friends-history'
      ? watchedEntries
        .filter((entry) => entry.visibility !== 'private')
        .map((entry) => ({ ...entry, kind: 'friends-history' }))
      : watchedEntries.map((entry) => ({ ...entry, kind: 'watched' }));
  const calendarEventsByDate = new Map(
    calendarEvents.map((entry) => [
      entry.dateKey,
      entry,
    ]),
  );
  const calendarCells = getCalendarCells(calendarCursor, calendarEventsByDate);
  const selectedCalendarEvent = calendarEventsByDate.get(selectedCalendarDate);
  const selectedWatchedEntry =
    selectedCalendarEvent?.kind === 'watched' || selectedCalendarEvent?.kind === 'friends-history'
      ? selectedCalendarEvent
      : null;
  const selectedPlannedEntry = selectedCalendarEvent?.kind === 'planned' ? selectedCalendarEvent : null;
  const selectedWatchedMovie = selectedWatchedEntry
    ? localizeMovie(selectedWatchedEntry.movie, language)
    : null;
  const selectedPlannedMovie = selectedPlannedEntry
    ? localizeMovie(selectedPlannedEntry.movie, language)
    : null;
  const calendarLocale = getCalendarLocale(language);
  const calendarMonthLabel = calendarCursor.toLocaleDateString(calendarLocale, {
    month: 'long',
    year: 'numeric',
  });
  const monthSummaryLabel = formatMonthInLabel(calendarCursor, language);
  const totalWatchMinutes = watchedEntries.reduce((total, entry) => total + entry.minutesWatched, 0);
  const emotionallyHelpfulMovies = watchedEntries.filter((entry) => entry.helpedEmotionally);
  const completedMovies = watchedEntries.filter((entry) => entry.completed);
  const monthTopGenre = getTopValue(watchedEntries, (entry) => localizeMovie(entry.movie, language).genres[0]);
  const monthTopMood = getTopValue(watchedEntries, (entry) => entry.moodBefore);
  const favoriteMonthEntry = [...watchedEntries].sort((a, b) => b.rating - a.rating)[0];
  const helpfulMonthEntry = emotionallyHelpfulMovies
    .sort((a, b) => b.rating - a.rating || b.minutesWatched - a.minutesWatched)[0];
  const viewingStreak = getViewingStreak(watchedEntries);
  const monthSummary = `В ${monthSummaryLabel} ты посмотрел ${watchedEntries.length} фильмов — ${formatWatchHours(totalWatchMinutes)} кино. Чаще ты выбирал/-ла жанр "${monthTopGenre}". ${emotionallyHelpfulMovies.length} фильмов улучшили настроение.`;
  const statisticsPeriodEntries = allWatchedEntries.filter((entry) => {
    if (statisticsPeriod === 'week') return isSameWeek(entry.date, selectedWatchedEntry?.date ?? calendarCursor);
    if (statisticsPeriod === 'month') return isSameMonth(entry.date, calendarCursor);

    return true;
  });
  const statisticsEntries = statisticsPeriodEntries.filter((entry) => {
    if (statisticsDateFrom && entry.dateKey < statisticsDateFrom) return false;
    if (statisticsDateTo && entry.dateKey > statisticsDateTo) return false;

    return true;
  });
  const statisticsWatchMinutes = statisticsEntries.reduce((total, entry) => total + entry.minutesWatched, 0);
  const statisticsHelpfulMovies = statisticsEntries.filter((entry) => entry.helpedEmotionally);
  const statisticsCompletedMovies = statisticsEntries.filter((entry) => entry.completed);
  const statisticsTopGenre = getTopValue(statisticsEntries, (entry) => localizeMovie(entry.movie, language).genres[0]);
  const statisticsTopMood = getTopValue(statisticsEntries, (entry) => entry.moodBefore);
  const statisticsViewingStreak = getViewingStreak(statisticsEntries);
  const statisticsPeriodLabel = statisticsPeriod === 'week'
    ? 'за неделю'
    : statisticsPeriod === 'month'
      ? 'за месяц'
      : 'за весь период';
  const statisticsSummary = `${statisticsPeriodLabel}: ${statisticsEntries.length} фильмов — ${formatWatchHours(statisticsWatchMinutes)} кино. Чаще ты выбирал/-ла жанр "${statisticsTopGenre}". ${statisticsHelpfulMovies.length} фильмов улучшили настроение.`;
  const historyFilterDate = selectedWatchedEntry?.date ?? calendarCursor;
  const historyPeriodEntries = allWatchedEntries.filter((entry) => {
    if (historyPeriod === 'week') return isSameWeek(entry.date, historyFilterDate);
    if (historyPeriod === 'month') return isSameMonth(entry.date, calendarCursor);

    return true;
  });
  const historyDateEntries = historyPeriodEntries.filter((entry) => {
    if (historyDateFrom && entry.dateKey < historyDateFrom) return false;
    if (historyDateTo && entry.dateKey > historyDateTo) return false;

    return true;
  });
  const historyGenreOptions = Array.from(new Set(
    allWatchedEntries.flatMap((entry) => localizeMovie(entry.movie, language).genres),
  ));
  const historyMoodOptions = Array.from(new Set(
    allWatchedEntries.flatMap((entry) => [entry.moodBefore, entry.moodAfter]),
  ));
  const historyAdvancedEntries = historyDateEntries.filter((entry) => {
    const movie = localizeMovie(entry.movie, language);

    if (historyGenre !== 'all' && !movie.genres.includes(historyGenre)) return false;
    if (historyMood !== 'all' && entry.moodBefore !== historyMood && entry.moodAfter !== historyMood) return false;
    if (historyRating !== 'all' && entry.rating < Number(historyRating)) return false;
    if (historyVisibility !== 'all' && entry.visibility !== historyVisibility) return false;
    if (historyCompletion === 'completed' && !entry.completed) return false;
    if (historyCompletion === 'unfinished' && entry.completed) return false;

    return true;
  });
  const normalizedHistorySearch = historySearch.trim().toLowerCase();
  const filteredHistoryEntries = historyAdvancedEntries.filter((entry) => {
    if (!normalizedHistorySearch) return true;

    const movie = localizeMovie(entry.movie, language);
    const searchableText = [
      movie.title,
      movie.genres.join(' '),
      entry.moodBefore,
      entry.moodAfter,
      entry.note,
      entry.userComment,
      entry.date.toLocaleDateString(calendarLocale, { day: 'numeric', month: 'long', year: 'numeric' }),
    ].join(' ').toLowerCase();

    return searchableText.includes(normalizedHistorySearch);
  });
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

  useEffect(() => {
    function handleHashChange() {
      setActiveProfileSection(getProfileSectionFromHash());
    }

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  function handleCalendarMonthChange(direction) {
    const nextMonth = new Date(
      calendarCursor.getFullYear(),
      calendarCursor.getMonth() + direction,
      1,
    );

    setCalendarCursor(nextMonth);
    setSelectedCalendarDate(formatDateKey(nextMonth));
  }

  function openPlaylist(playlist) {
    setSelectedPlaylist(playlist);
    setPlaylistNotice(`Открыт список: ${playlist.title}`);
  }

  function openScheduleModal(movieId = scheduleForm.movieId, friend = scheduleForm.friend) {
    setScheduleForm((currentForm) => ({
      ...currentForm,
      movieId,
      friend,
    }));
    setScheduleModalOpen(true);
  }

  function handleScheduleSubmit() {
    const movie = shareableMovies.find((item) => item.id === scheduleForm.movieId) ?? shareableMovies[0];
    const localizedMovie = localizeMovie(movie, language);
    const nextEntry = {
      id: `planned-${movie.id}-${Date.now()}`,
      movieId: movie.id,
      friend: scheduleForm.friend,
      dateKey: scheduleForm.date,
      time: scheduleForm.time,
      comment: scheduleForm.comment,
      status: 'ожидает подтверждения',
    };

    setPlannedWatchEntries((currentEntries) => [...currentEntries, nextEntry]);
    setChatMessages((currentMessages) => [
      ...currentMessages,
      `Алиса предлагает посмотреть фильм «${localizedMovie.title}» ${scheduleForm.date} в ${scheduleForm.time}. Комментарий: ${scheduleForm.comment}`,
    ]);
    setCalendarViewFilter('planned');
    setCalendarCursor(new Date(`${scheduleForm.date}T00:00`));
    setSelectedCalendarDate(scheduleForm.date);
    setScheduleModalOpen(false);
  }

  function handleCardAction(action, movieTitle) {
    setPlaylistNotice(`${movieTitle}: ${action}`);
    setOpenCardMenu('');
  }

  function cycleEntryVisibility(entry) {
    const nextVisibility = entry.visibility === 'private'
      ? 'friends'
      : entry.visibility === 'friends'
        ? 'public'
        : 'private';

    setHistoryPrivacy((current) => ({
      ...current,
      [entry.dateKey]: nextVisibility,
    }));
  }

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

      <div className="profile-section-menu" aria-label="Разделы профиля">
        <div className="profile-section-list" role="tablist">
          {profileSections.map((section) => (
            <button
              className={activeProfileSection === section.id ? 'active' : ''}
              type="button"
              role="tab"
              aria-selected={activeProfileSection === section.id}
              key={section.id}
              onClick={() => setActiveProfileSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {activeProfileSection === 'my-calendar' ? (
        <div className="profile-calendar">
          <div className="leaderboard-heading">
            <span>Мой календарь</span>
            <strong>История просмотров</strong>
          </div>
          <div className="watch-calendar-summary">
            <p>{monthSummary}</p>
            <div>
              <span>{watchedEntries.length} фильмов</span>
              <span>{formatWatchHours(totalWatchMinutes)}</span>
              <span>{completedMovies.length} досмотрено</span>
            </div>
          </div>
          <div className="calendar-view-filter" aria-label="Фильтр календаря">
            <button
              className={calendarViewFilter === 'watched' ? 'active' : ''}
              type="button"
              onClick={() => setCalendarViewFilter('watched')}
            >
              Посмотреть мои просмотры
            </button>
            <button
              className={calendarViewFilter === 'planned' ? 'active' : ''}
              type="button"
              onClick={() => setCalendarViewFilter('planned')}
            >
              Посмотреть запланированные просмотры
            </button>
            <button
              className={calendarViewFilter === 'friends-history' ? 'active' : ''}
              type="button"
              onClick={() => setCalendarViewFilter('friends-history')}
            >
              История просмотров с друзьями
            </button>
          </div>
          <div className="calendar-widget">
            <div className="calendar-widget-main">
              <div className="calendar-widget-header">
                <button
                  className="calendar-nav-button"
                  type="button"
                  aria-label="Предыдущий месяц"
                  onClick={() => handleCalendarMonthChange(-1)}
                >
                  ‹
                </button>
                <strong>{calendarMonthLabel}</strong>
                <button
                  className="calendar-nav-button"
                  type="button"
                  aria-label="Следующий месяц"
                  onClick={() => handleCalendarMonthChange(1)}
                >
                  ›
                </button>
              </div>
              <div className="calendar-weekdays" aria-hidden="true">
                {calendarWeekdays.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="calendar-day-grid" aria-label="Календарь просмотров">
                {calendarCells.map((item) =>
                  item.empty ? (
                    <span className="calendar-empty-day" key={item.id} />
                  ) : (
                    <button
                      className={`calendar-day${item.event ? ' watched' : ''}${
                        selectedCalendarDate === item.dateKey ? ' selected' : ''
                      }`}
                      type="button"
                      key={item.id}
                      aria-pressed={selectedCalendarDate === item.dateKey}
                      onClick={() => setSelectedCalendarDate(item.dateKey)}
                    >
                      <span>{item.day}</span>
                      {item.event ? <i aria-hidden="true" /> : null}
                      {item.event ? (
                        <small>{localizeMovie(item.event.movie, language).title}</small>
                      ) : null}
                    </button>
                  ),
                )}
              </div>
            </div>
            <article className="calendar-selected-movie">
              {selectedWatchedMovie ? (
                <>
                  <div className="history-poster-column">
                    <img
                      src={selectedWatchedMovie.poster}
                      alt={`${copy.result.posterAlt} ${selectedWatchedMovie.title}`}
                    />
                    <div className="history-plot-tooltip">
                      <span>Полный сюжет</span>
                      <p>{selectedWatchedMovie.description}</p>
                    </div>
                    <div className="history-privacy-row poster-privacy">
                      <span>Видимость</span>
                      <button
                        className={selectedWatchedEntry.visibility === 'friends' ? 'active' : ''}
                        type="button"
                        onClick={() => {
                          setHistoryPrivacy((current) => ({
                            ...current,
                            [selectedWatchedEntry.dateKey]: 'friends',
                          }));
                        }}
                      >
                        Для друзей
                      </button>
                      <button
                        className={selectedWatchedEntry.visibility === 'public' ? 'active' : ''}
                        type="button"
                        onClick={() => {
                          setHistoryPrivacy((current) => ({
                            ...current,
                            [selectedWatchedEntry.dateKey]: 'public',
                          }));
                        }}
                      >
                        Для всех
                      </button>
                      <button
                        className={selectedWatchedEntry.visibility === 'private' ? 'active' : ''}
                        type="button"
                        onClick={() => {
                          setHistoryPrivacy((current) => ({
                            ...current,
                            [selectedWatchedEntry.dateKey]: 'private',
                          }));
                        }}
                      >
                        Только для себя
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="movie-card-actions-row">
                      <button
                        className="visibility-icon-button"
                        type="button"
                        aria-label="Изменить видимость"
                        onClick={() => cycleEntryVisibility(selectedWatchedEntry)}
                      >
                        {selectedWatchedEntry.visibility === 'private'
                          ? '◑'
                          : selectedWatchedEntry.visibility === 'friends'
                            ? '◉'
                            : '◎'}
                      </button>
                      <div className="card-menu-wrap">
                        <button
                          className="playlist-menu-button"
                          type="button"
                          aria-label="Открыть действия с фильмом"
                          onClick={() =>
                            setOpenCardMenu(openCardMenu === selectedWatchedEntry.dateKey ? '' : selectedWatchedEntry.dateKey)
                          }
                        >
                          ⋯
                        </button>
                        {openCardMenu === selectedWatchedEntry.dateKey ? (
                          <div className="playlist-menu-popover card-action-popover">
                            <button
                              type="button"
                              onClick={() => handleCardAction('сохранить в плейлист', selectedWatchedMovie.title)}
                            >
                              Сохранить в плейлист
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCardAction('отправить другу', selectedWatchedMovie.title)}
                            >
                              Отправить другу
                            </button>
                            <button
                              type="button"
                              onClick={() => openScheduleModal(selectedWatchedEntry.movie.id)}
                            >
                              Запланировать просмотр
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <span>
                      {selectedWatchedEntry.date.toLocaleDateString(calendarLocale, {
                        day: 'numeric',
                        month: 'long',
                      })}
                    </span>
                    <h3>{selectedWatchedMovie.title}</h3>
                    <p>{selectedWatchedMovie.shortReason}</p>
                    <dl className="watch-detail-list">
                      <div>
                        <dt>Дата</dt>
                        <dd>
                          {selectedWatchedEntry.date.toLocaleDateString(calendarLocale, {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </dd>
                      </div>
                      <div>
                        <dt>Время просмотра</dt>
                        <dd>{selectedWatchedEntry.watchedTime}</dd>
                      </div>
                      <div>
                        <dt>Длительность</dt>
                        <dd>{formatWatchHours(selectedWatchedEntry.minutesWatched)}</dd>
                      </div>
                      <div>
                        <dt>Жанр</dt>
                        <dd>{selectedWatchedMovie.genres.join(', ')}</dd>
                      </div>
                      <div>
                        <dt>Статус</dt>
                        <dd>{selectedWatchedEntry.completed ? 'Досмотрено' : 'Не досмотрено'}</dd>
                      </div>
                      <div>
                        <dt>Настроение</dt>
                        <dd>{selectedWatchedEntry.moodBefore} → {selectedWatchedEntry.moodAfter}</dd>
                      </div>
                      <div>
                        <dt>Оценка</dt>
                        <dd>{selectedWatchedEntry.rating}/10</dd>
                      </div>
                    </dl>
                    <small>
                      {selectedWatchedEntry.helpedEmotionally ? 'Помог эмоционально' : 'Не изменил состояние'} · {selectedWatchedEntry.note}
                    </small>
                    <div className="history-card-controls">
                      <label>
                        <span>Комментарий</span>
                        <textarea
                          value={selectedWatchedEntry.userComment}
                          onChange={(event) => {
                            setHistoryComments((current) => ({
                              ...current,
                              [selectedWatchedEntry.dateKey]: event.target.value,
                            }));
                          }}
                        />
                      </label>
                      <div className="history-share-box">
                        <label>
                          <span>Друг</span>
                          <select
                            value={shareFriend}
                            onChange={(event) => setShareFriend(event.target.value)}
                          >
                            <option>Мария</option>
                            <option>София</option>
                            <option>Даниил</option>
                          </select>
                        </label>
                        <label>
                          <span>Сообщение</span>
                          <textarea
                            value={shareMessage}
                            onChange={(event) => setShareMessage(event.target.value)}
                          />
                        </label>
                        <button
                          className="history-share-button"
                          type="button"
                          onClick={() => setShareStatus(`Фильм отправлен: ${shareFriend}`)}
                        >
                          Поделиться с другом
                        </button>
                        {shareStatus ? <em>{shareStatus}</em> : null}
                      </div>
                    </div>
                  </div>
                </>
              ) : selectedPlannedMovie ? (
                <div className="planned-watch-card">
                  <img
                    src={selectedPlannedMovie.poster}
                    alt={`${copy.result.posterAlt} ${selectedPlannedMovie.title}`}
                  />
                  <div>
                    <span>Запланированный просмотр</span>
                    <h3>{selectedPlannedMovie.title}</h3>
                    <p>{selectedPlannedEntry.comment}</p>
                    <dl className="watch-detail-list">
                      <div>
                        <dt>Дата</dt>
                        <dd>{selectedPlannedEntry.dateKey}</dd>
                      </div>
                      <div>
                        <dt>Время</dt>
                        <dd>{selectedPlannedEntry.time}</dd>
                      </div>
                      <div>
                        <dt>С кем</dt>
                        <dd>{selectedPlannedEntry.friend}</dd>
                      </div>
                      <div>
                        <dt>Статус</dt>
                        <dd>{selectedPlannedEntry.status}</dd>
                      </div>
                    </dl>
                    <button
                      className="history-share-button"
                      type="button"
                      onClick={() =>
                        setChatMessages((currentMessages) => [
                          ...currentMessages,
                          `Чат по фильму «${selectedPlannedMovie.title}» открыт с ${selectedPlannedEntry.friend}.`,
                        ])
                      }
                    >
                      Открыть чат
                    </button>
                  </div>
                </div>
              ) : (
                <div className="calendar-empty-selection">
                  <span>Дата выбрана</span>
                  <h3>В этот день просмотра нет</h3>
                  <p>Выбери дату с отметкой, чтобы увидеть фильм или запланированный просмотр.</p>
                </div>
              )}
            </article>
          </div>
          <div className="watched-history-panel">
            <div className="leaderboard-heading">
              <span>История</span>
              <strong>Просмотренные фильмы</strong>
            </div>
            <div className="history-toolbar">
              <label>
                <span>Поиск по истории</span>
                <input
                  type="search"
                  value={historySearch}
                  placeholder="Название, жанр, настроение, дата, комментарий"
                  onChange={(event) => setHistorySearch(event.target.value)}
                />
              </label>
              <div className="history-period-filter" aria-label="Фильтр периода истории просмотров">
                <button
                  className={historyPeriod === 'week' ? 'active' : ''}
                  type="button"
                  onClick={() => setHistoryPeriod('week')}
                >
                  Неделя
                </button>
                <button
                  className={historyPeriod === 'month' ? 'active' : ''}
                  type="button"
                  onClick={() => setHistoryPeriod('month')}
                >
                  Месяц
                </button>
                <button
                  className={historyPeriod === 'all' ? 'active' : ''}
                  type="button"
                  onClick={() => setHistoryPeriod('all')}
                >
                  Весь период
                </button>
              </div>
              <div className="history-date-range">
                <label>
                  <span>С</span>
                  <input
                    type="date"
                    value={historyDateFrom}
                    onChange={(event) => setHistoryDateFrom(event.target.value)}
                  />
                </label>
                <label>
                  <span>До</span>
                  <input
                    type="date"
                    value={historyDateTo}
                    onChange={(event) => setHistoryDateTo(event.target.value)}
                  />
                </label>
              </div>
            </div>
            <div className="history-advanced-filters">
              <label>
                <span>Жанр</span>
                <select value={historyGenre} onChange={(event) => setHistoryGenre(event.target.value)}>
                  <option value="all">Все жанры</option>
                  {historyGenreOptions.map((genre) => (
                    <option value={genre} key={genre}>{genre}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Настроение</span>
                <select value={historyMood} onChange={(event) => setHistoryMood(event.target.value)}>
                  <option value="all">Все настроения</option>
                  {historyMoodOptions.map((mood) => (
                    <option value={mood} key={mood}>{mood}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Оценка</span>
                <select value={historyRating} onChange={(event) => setHistoryRating(event.target.value)}>
                  <option value="all">Любая оценка</option>
                  <option value="10">10/10</option>
                  <option value="9">9+ / 10</option>
                  <option value="8">8+ / 10</option>
                </select>
              </label>
              <label>
                <span>Видимость</span>
                <select value={historyVisibility} onChange={(event) => setHistoryVisibility(event.target.value)}>
                  <option value="all">Все</option>
                  <option value="friends">Для друзей</option>
                  <option value="public">Для всех</option>
                  <option value="private">Только для себя</option>
                </select>
              </label>
              <label>
                <span>Просмотр</span>
                <select value={historyCompletion} onChange={(event) => setHistoryCompletion(event.target.value)}>
                  <option value="all">Все</option>
                  <option value="completed">Досмотренные</option>
                  <option value="unfinished">Не досмотренные</option>
                </select>
              </label>
            </div>
            <div className="history-result-summary">
              <strong>{filteredHistoryEntries.length}</strong>
              <span>фильмов найдено</span>
            </div>
            <div className="watched-history-list">
              {filteredHistoryEntries.map((entry) => {
                const movie = localizeMovie(entry.movie, language);

                return (
                  <article
                    className={selectedCalendarDate === entry.dateKey ? 'active' : ''}
                    key={entry.dateKey}
                  >
                    <img src={movie.poster} alt={`${copy.result.posterAlt} ${movie.title}`} />
                    <div>
                      <span>{entry.date.toLocaleDateString(calendarLocale, { day: 'numeric', month: 'long' })}</span>
                      <strong>{movie.title}</strong>
                      <small>{formatWatchHours(entry.minutesWatched)} · {entry.completed ? 'досмотрено' : 'не досмотрено'} · {entry.rating}/10</small>
                      <small>
                        {entry.visibility === 'private'
                          ? 'Только для себя'
                          : entry.visibility === 'friends'
                            ? 'Для друзей'
                            : 'Для всех'} · {entry.moodBefore} → {entry.moodAfter}
                      </small>
                      <button
                        type="button"
                        onClick={() => {
                          setCalendarCursor(new Date(entry.date.getFullYear(), entry.date.getMonth(), 1));
                          setSelectedCalendarDate(entry.dateKey);
                        }}
                      >
                        Открыть карточку
                      </button>
                    </div>
                  </article>
                );
              })}
              {filteredHistoryEntries.length === 0 ? (
                <p className="history-empty-state">По этому поиску просмотров пока нет.</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {activeProfileSection === 'my-playlists' ? (
        <div className="profile-playlists">
          <div className="leaderboard-heading">
            <span>Мои плейлисты</span>
            <strong>{playlistGroups.reduce((total, group) => total + group.playlists.length, 0)} плейлиста</strong>
          </div>
          <p className="playlist-helper">
            Здесь собраны все твои списки фильмов. Открывай группы, смотри плейлист
            «Смотреть позже» и создавай новые списки через меню с тремя точками.
          </p>
          {playlistNotice ? <p className="playlist-notice">{playlistNotice}</p> : null}
          <div className="playlist-group-list">
            {playlistGroups.map((group) => (
              <section className="playlist-group" key={group.id}>
                <button
                  className="playlist-group-toggle"
                  type="button"
                  aria-expanded={expandedPlaylistGroups[group.id]}
                  onClick={() => togglePlaylistGroup(group.id)}
                >
                  <span>{expandedPlaylistGroups[group.id] ? '−' : '+'}</span>
                  <div>
                    <strong>{group.title}</strong>
                    <small>{group.description}</small>
                  </div>
                  <b>{group.playlists.length}</b>
                </button>
                {expandedPlaylistGroups[group.id] ? (
                  <div className="playlist-card-grid">
                    {group.playlists.map((playlist) => {
                      const previewMovies = playlist.movies.slice(0, 4);

                      return (
                        <article className="playlist-card" key={playlist.id}>
                          <button
                            className="playlist-cover-stack playlist-cover-button"
                            type="button"
                            onClick={() => openPlaylist(playlist)}
                            aria-label={`Открыть список ${playlist.title}`}
                          >
                            {previewMovies.length > 0 ? (
                              previewMovies.map((movie) => {
                                const localizedMovie = localizeMovie(movie, language);

                                return (
                                  <img
                                    src={movie.poster}
                                    alt={`${copy.result.posterAlt} ${localizedMovie.title}`}
                                    key={movie.id}
                                  />
                                );
                              })
                            ) : (
                              <div className="playlist-empty-cover">+</div>
                            )}
                          </button>
                          <div className="playlist-card-body">
                            <div className="playlist-card-top">
                              <div>
                                <h3>{playlist.title}</h3>
                                <p>{playlist.description}</p>
                              </div>
                              <button
                                className="open-list-button"
                                type="button"
                                onClick={() => openPlaylist(playlist)}
                              >
                                Открыть список
                              </button>
                              <div className="playlist-menu">
                                <button
                                  className="playlist-menu-button"
                                  type="button"
                                  aria-label="Открыть меню плейлиста"
                                  aria-expanded={openPlaylistMenu === playlist.id}
                                  onClick={() =>
                                    setOpenPlaylistMenu(openPlaylistMenu === playlist.id ? '' : playlist.id)
                                  }
                                >
                                  ⋯
                                </button>
                                {openPlaylistMenu === playlist.id ? (
                                  <div className="playlist-menu-popover">
                                    <button type="button" onClick={handleCreatePlaylist}>
                                      Создать плейлист
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        openPlaylist(playlist);
                                        setOpenPlaylistMenu('');
                                      }}
                                    >
                                      Открыть плейлист
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                            <div className="playlist-meta-row">
                              <span>{playlist.movies.length} фильмов</span>
                              <span>Плейлист</span>
                            </div>
                            <div className="playlist-movie-list">
                              {playlist.movies.slice(0, 3).map((movie) => {
                                const localizedMovie = localizeMovie(movie, language);

                                return <span key={movie.id}>{localizedMovie.title}</span>;
                              })}
                              {playlist.movies.length === 0 ? <span>Пока пусто</span> : null}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      ) : null}

      {activeProfileSection === 'my-statistics' ? (
        <div className="profile-statistics-section">
          <div className="leaderboard-heading">
            <span>Моя статистика</span>
            <strong>{formatWatchHours(statisticsWatchMinutes)} {statisticsPeriodLabel}</strong>
          </div>
          <div className="statistics-filter-panel">
            <div className="history-period-filter" aria-label="Фильтр периода статистики">
              <button
                className={statisticsPeriod === 'week' ? 'active' : ''}
                type="button"
                onClick={() => setStatisticsPeriod('week')}
              >
                Неделя
              </button>
              <button
                className={statisticsPeriod === 'month' ? 'active' : ''}
                type="button"
                onClick={() => setStatisticsPeriod('month')}
              >
                Месяц
              </button>
              <button
                className={statisticsPeriod === 'all' ? 'active' : ''}
                type="button"
                onClick={() => setStatisticsPeriod('all')}
              >
                Весь период
              </button>
            </div>
            <div className="history-date-range">
              <label>
                <span>С</span>
                <input
                  type="date"
                  value={statisticsDateFrom}
                  onChange={(event) => setStatisticsDateFrom(event.target.value)}
                />
              </label>
              <label>
                <span>До</span>
                <input
                  type="date"
                  value={statisticsDateTo}
                  onChange={(event) => setStatisticsDateTo(event.target.value)}
                />
              </label>
            </div>
          </div>
          <p className="watch-month-summary">{statisticsSummary}</p>
          <div className="watch-stat-grid">
            <article>
              <span>Фильмы</span>
              <strong>{statisticsEntries.length}</strong>
            </article>
            <article>
              <span>Часы просмотра</span>
              <strong>{formatWatchHours(statisticsWatchMinutes)}</strong>
            </article>
            <article>
              <span>Досмотрено</span>
              <strong>{statisticsCompletedMovies.length}</strong>
            </article>
            <article>
              <span>Жанр периода</span>
              <strong>{statisticsTopGenre}</strong>
            </article>
            <article>
              <span>Настроение периода</span>
              <strong>{statisticsTopMood}</strong>
            </article>
            <article>
              <span>Серия дней</span>
              <strong>{statisticsViewingStreak}</strong>
            </article>
          </div>
          {cinemaProfilePanel}
          {aiProfilePanel}
        </div>
      ) : null}

      {activeProfileSection === 'my-emotional-changes' ? (
        <div className="profile-emotional-section">
          <div className="leaderboard-heading">
            <span>Эмоции после просмотра</span>
            <strong>{emotionallyHelpfulMovies.length} улучшили состояние</strong>
          </div>
          <div className="emotional-change-list">
            {watchedEntries.map((entry) => {
              const movie = localizeMovie(entry.movie, language);

              return (
                <article key={entry.dateKey}>
                  <div>
                    <span>{entry.moodBefore}</span>
                    <strong>→</strong>
                    <span>{entry.moodAfter}</span>
                  </div>
                  <h3>{movie.title}</h3>
                  <p>
                    {entry.helpedEmotionally
                      ? 'Фильм помог эмоционально'
                      : 'Фильм не изменил состояние'}
                  </p>
                  <small>{entry.rating}/10 · {formatWatchHours(entry.minutesWatched)}</small>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}

      {activeProfileSection === 'my-public-profile' ? (
        <div className="profile-public-profile">
          <div className="friend-profile-card public-profile-card">
            <div className="friend-avatar">{profile.name.slice(0, 1)}</div>
            <div>
              <p className="eyebrow">Мой публичный профиль</p>
              <h2>{profile.name}</h2>
              <p>{profile.favoriteGenres.join(' · ')} · {profile.favoriteMood}</p>
              <span>{profile.title}</span>
            </div>
          </div>

          <div className="profile-social-card">
            <div className="leaderboard-heading">
              <span>Видимость профиля</span>
              <strong>
                {profileVisibility === 'friends'
                  ? 'Открыт для друзей'
                  : profileVisibility === 'public'
                    ? 'Открыт для всех'
                    : 'Только для себя'}
              </strong>
            </div>
            <div className="profile-visibility-controls" aria-label="Видимость профиля">
              <button
                className={profileVisibility === 'friends' ? 'active' : ''}
                type="button"
                onClick={() => setProfileVisibility('friends')}
              >
                Для друзей
              </button>
              <button
                className={profileVisibility === 'public' ? 'active' : ''}
                type="button"
                onClick={() => setProfileVisibility('public')}
              >
                Для всех
              </button>
              <button
                className={profileVisibility === 'private' ? 'active' : ''}
                type="button"
                onClick={() => setProfileVisibility('private')}
              >
                Для себя
              </button>
            </div>
            <div className="profile-friends-summary">
              <article>
                <span>Друзья</span>
                <strong>128</strong>
                <small>добавлено в YourFilm</small>
              </article>
              <article>
                <span>Все друзья</span>
                <strong>{publicProfileFriends.join(' · ')}</strong>
                <a href="/friends">Открыть всех друзей</a>
              </article>
            </div>
          </div>

          <div className="friends-grid">
            <article className="friend-section-card friend-achievements-card">
              <div className="leaderboard-heading">
                <span>Публичная аналитика</span>
                <strong>#128 · {ratingScore}</strong>
              </div>
              <div className="friend-rating-strip">
                <article>
                  <span>Рейтинг</span>
                  <strong>{ratingScore}</strong>
                </article>
                <article>
                  <span>Друзья</span>
                  <strong>128</strong>
                </article>
                <article>
                  <span>Фильмы</span>
                  <strong>{profile.watchedCount}</strong>
                </article>
              </div>
              <div className="friend-public-tags">
                <span>Титулы</span>
                <strong>{profile.title}</strong>
                {profile.earnedTitles?.slice(0, 3).map((title) => (
                  <strong key={title}>{title}</strong>
                ))}
              </div>
              <div className="friend-public-tags">
                <span>Награды</span>
                {unlockedAchievements.slice(0, 4).map((achievement) => (
                  <strong key={achievement.id}>{achievement.title}</strong>
                ))}
              </div>
            </article>

            <article className="friend-section-card">
              <div className="leaderboard-heading">
                <span>Рекомендации от друзей</span>
                <strong>{publicFriendRecommendations.length} совета</strong>
              </div>
              <div className="friend-movie-list">
                {publicFriendRecommendations.map((recommendation) => {
                  const movie = movies.find((item) => item.id === recommendation.movieId);

                  if (!movie) return null;

                  const localizedMovie = localizeMovie(movie, language);

                  return (
                    <div className="friend-movie-card friend-recommendation-card" key={recommendation.movieId}>
                      <img src={movie.poster} alt={localizedMovie.title} />
                      <div>
                        <strong>{localizedMovie.title}</strong>
                        <small>
                          {recommendation.friend} советует · {recommendation.sharedFrom}
                        </small>
                        <p>{recommendation.comment}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="friend-section-card">
              <div className="leaderboard-heading">
                <span>Открытый watchlist</span>
                <strong>{openPublicPlaylists.length} плейлиста</strong>
              </div>
              <div className="public-playlist-list">
                {openPublicPlaylists.map((playlist) => (
                  <div className="public-playlist-card" key={playlist.id}>
                    <div className="friend-watchlist-stack compact-watchlist-stack">
                      {playlist.movies.slice(0, 3).map((movie) => {
                        const localizedMovie = localizeMovie(movie, language);

                        return <img src={movie.poster} alt={localizedMovie.title} key={movie.id} />;
                      })}
                    </div>
                    <div>
                      <strong>{playlist.title}</strong>
                      <p>{playlist.description}</p>
                      <small>{playlist.groupTitle} · {playlist.movies.length} фильмов</small>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="friend-section-card watch-party-card">
              <div className="leaderboard-heading">
                <span>Совместный просмотр</span>
                <strong>Запланировать</strong>
              </div>
              <h3>Вечерний просмотр с друзьями</h3>
              <p>Выбери друзей рядом и создай общий просмотр из открытого плейлиста.</p>
              <div className="watch-party-friends">
                {publicProfileFriends.map((friend) => (
                  <button type="button" key={friend}>
                    {friend}
                  </button>
                ))}
              </div>
              <button className="primary-action" type="button">
                Запланировать просмотр
              </button>
            </article>

            <article className="friend-section-card share-card">
              <div className="leaderboard-heading">
                <span>Отправка фильмов и списков</span>
                <strong>Для друзей</strong>
              </div>
              <label>
                <span>Друг</span>
                <select value={shareFriend} onChange={(event) => setShareFriend(event.target.value)}>
                  {publicProfileFriends.map((friend) => (
                    <option key={friend}>{friend}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Сообщение</span>
                <textarea value={shareMessage} onChange={(event) => setShareMessage(event.target.value)} />
              </label>
              <button
                className="primary-action"
                type="button"
                onClick={() => setShareStatus(`Список отправлен: ${shareFriend}`)}
              >
                Отправить фильм или список
              </button>
              {shareStatus ? <em>{shareStatus}</em> : null}
            </article>
          </div>
        </div>
      ) : null}

      {activeProfileSection === 'my-achievements' ? (
        <>
      <div className="profile-subblock-heading">
        <span>Мои достижения</span>
        <strong>Рейтинг, титулы и награды</strong>
      </div>
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

