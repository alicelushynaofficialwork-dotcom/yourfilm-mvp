import { movieCatalog } from './movieCatalog.js';

const customMoodRules = [
  {
    moodId: 'drive',
    words: ['драйв', 'адреналин', 'экшен', 'энерг', 'злюсь', 'злость', 'action', 'drive', 'angry', 'energy', 'драйв', 'адреналін', 'злюся'],
  },
  {
    moodId: 'anxious',
    words: ['трев', 'страх', 'паник', 'нерв', 'устал', 'anxious', 'stress', 'tired', 'трив', 'втом'],
  },
  {
    moodId: 'sad',
    words: ['груст', 'плак', 'одинок', 'sad', 'cry', 'lonely', 'сум', 'плак'],
  },
  {
    moodId: 'romance',
    words: ['роман', 'любов', 'нежн', 'romance', 'love', 'tender', 'кохан', 'ніжн'],
  },
  {
    moodId: 'motivation',
    words: ['мотива', 'цель', 'успех', 'сил', 'motivation', 'goal', 'success', 'мотива', 'мета', 'успіх'],
  },
  {
    moodId: 'family',
    words: ['семь', 'родител', 'дет', 'family', 'kids', 'сім', 'діт'],
  },
  {
    moodId: 'escape',
    words: ['отвлеч', 'переключ', 'легк', 'escape', 'distract', 'fun', 'відвол', 'перемк'],
  },
];

function detectMoodFromText(text) {
  const normalizedText = text.trim().toLowerCase();

  if (!normalizedText) return null;

  return customMoodRules.find((rule) =>
    rule.words.some((word) => normalizedText.includes(word)),
  )?.moodId ?? 'escape';
}

function getSimilarMovies(movie, source) {
  const scoredMovies = source
    .filter((candidate) => candidate.id !== movie.id)
    .map((candidate) => {
      const moodScore = candidate.moods.filter((mood) => movie.moods.includes(mood)).length * 2;
      const genreScore = candidate.genres.filter((genre) => movie.genres.includes(genre)).length;

      return {
        movie: candidate,
        score: moodScore + genreScore,
      };
    })
    .filter((item) => item.score > 0)
    .sort((firstItem, secondItem) => secondItem.score - firstItem.score)
    .map((item) => item.movie);
  const fallbackMovies = source.filter(
    (candidate) =>
      candidate.id !== movie.id && !scoredMovies.some((scoredMovie) => scoredMovie.id === candidate.id),
  );

  return [...scoredMovies, ...fallbackMovies].slice(0, 6);
}

function createRecommendation(movie, source, confidenceScore, matchedMoodId) {
  return {
    movie,
    reason: movie.whyRecommended,
    emotionalEffect: movie.emotionGiven,
    heroLesson: movie.heroLesson,
    perspectiveShift: movie.perspectiveShift,
    confidenceScore,
    matchedMoodId,
    similarMovies: getSimilarMovies(movie, source),
  };
}

export function getRecommendation({
  customMood = '',
  kidsOnly = false,
  moodId,
  movieId = '',
  skipIds = [],
}) {
  const source = kidsOnly ? movieCatalog.filter((movie) => movie.kidSafe) : movieCatalog;
  const selectedMovie = source.find((movie) => movie.id === movieId);

  if (selectedMovie) {
    return createRecommendation(selectedMovie, source, 0.96, selectedMovie.moods[0]);
  }

  const effectiveMoodId = detectMoodFromText(customMood) ?? moodId;
  const matches = source.filter(
    (movie) => movie.moods.includes(effectiveMoodId) && !skipIds.includes(movie.id),
  );
  const fallbackMatches = source.filter((movie) => movie.moods.includes(effectiveMoodId));
  const movie = matches[0] ?? fallbackMatches[0] ?? source[0];

  if (!movie) return null;

  return createRecommendation(
    movie,
    source,
    movie.moods.includes(effectiveMoodId) ? 0.9 : 0.55,
    effectiveMoodId,
  );
}
