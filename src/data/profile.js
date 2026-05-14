export const userLevels = [
  {
    id: 'newbie',
    name: 'Новичок',
    minXp: 0,
    maxXp: 120,
  },
  {
    id: 'movie-fan',
    name: 'Киноман',
    minXp: 120,
    maxXp: 320,
  },
  {
    id: 'genre-explorer',
    name: 'Исследователь жанров',
    minXp: 320,
    maxXp: 620,
  },
  {
    id: 'critic',
    name: 'Кинокритик',
    minXp: 620,
    maxXp: 980,
  },
  {
    id: 'master',
    name: 'Мастер кино',
    minXp: 980,
    maxXp: 1500,
  },
  {
    id: 'legend',
    name: 'Легенда YourFilm',
    minXp: 1500,
    maxXp: 1500,
  },
];

export const profileAchievements = [
  {
    id: 'watched-count',
    title: 'Первые просмотры',
    description: 'За количество просмотренных фильмов',
  },
  {
    id: 'genre-variety',
    title: 'Жанровый путь',
    description: 'За просмотр разных жанров',
  },
  {
    id: 'mood-films',
    title: 'Кино по настроению',
    description: 'За просмотр фильмов по настроению',
  },
  {
    id: 'collection-paths',
    title: 'Путь подборок',
    description: 'За прохождение подборок',
  },
  {
    id: 'reviews',
    title: 'Голос кинокритика',
    description: 'За отзывы',
  },
  {
    id: 'friend-recommendations',
    title: 'Совет друзьям',
    description: 'За рекомендации друзьям',
  },
  {
    id: 'viewing-streak',
    title: 'Регулярный зритель',
    description: 'За регулярность просмотров',
  },
];

export const userTitles = [
  {
    id: 'emotion-architect',
    name: 'Архитектор эмоций',
    description: 'За глубокие подборы под настроение.',
    xpReward: 180,
    stars: 3,
  },
  {
    id: 'movie-psychologist',
    name: 'Психолог кино',
    description: 'За интерес к мотивам героев.',
    xpReward: 220,
    stars: 4,
  },
  {
    id: 'night-viewer',
    name: 'Ночной зритель',
    description: 'За поздние просмотры и ночные подборки.',
    xpReward: 120,
    stars: 2,
  },
  {
    id: 'meaning-seeker',
    name: 'Искатель смысла',
    description: 'Текущий титул за фильмы о внутреннем росте.',
    xpReward: 200,
    stars: 4,
  },
  {
    id: 'romance-curator',
    name: 'Куратор романтики',
    description: 'За романтические рекомендации.',
    xpReward: 160,
    stars: 3,
  },
  {
    id: 'motivation-master',
    name: 'Мастер мотивации',
    description: 'За выбор вдохновляющего кино.',
    xpReward: 260,
    stars: 5,
  },
  {
    id: 'hope-guide',
    name: 'Проводник надежды',
    description: 'За фильмы, которые возвращают опору.',
    xpReward: 240,
    stars: 5,
  },
];

export const baseUserProfile = {
  name: 'Алиса',
  xp: 185,
  title: 'Искатель смысла',
  earnedTitles: ['Искатель смысла', 'Мастер мотивации'],
  watchedCount: 3,
  favoriteMood: 'Мотивация',
  favoriteGenres: ['драма', 'приключения', 'анимация', 'семейное кино'],
  favoriteMovies: ['Головоломка 2', 'Невероятная жизнь Уолтера Митти', 'Маленькая мисс Счастье'],
  emotionalPortrait: [
    'ищет смысл и внутренний рост',
    'часто выбирает вдохновляющее кино',
    'ценит надежду, поддержку и теплые истории',
  ],
  aiProfile: [
    {
      id: 'hope',
      label: 'про надежду',
      score: 82,
      insight: 'часто выбирает истории, где после сложностей появляется опора',
    },
    {
      id: 'love',
      label: 'про любовь',
      score: 46,
      insight: 'иногда выбирает теплые и романтические фильмы',
    },
    {
      id: 'career',
      label: 'про карьеру',
      score: 38,
      insight: 'интересуется фильмами о выборе пути и самореализации',
    },
    {
      id: 'inner-growth',
      label: 'про внутренний рост',
      score: 91,
      insight: 'чаще всего выбирает кино о взрослении, смысле и изменениях',
    },
    {
      id: 'overcoming',
      label: 'про преодоление',
      score: 74,
      insight: 'заметен интерес к героям, которые проходят через трудности',
    },
    {
      id: 'family',
      label: 'про семью',
      score: 57,
      insight: 'есть тяга к историям про поддержку и близких людей',
    },
  ],
  watchLater: ['Головоломка 2', 'Дюна: Часть вторая', 'Дикий робот'],
  achievements: ['watched-count', 'genre-variety', 'mood-films'],
};
