export const ratingTags = [
  'понравилась атмосфера',
  'понравился герой',
  'понравилась романтика',
  'понравилась мотивация',
  'понравился визуальный стиль',
  'не понравился темп',
  'не подошло настроение',
  'слишком тяжёлый фильм',
];

const ratingsStorageKey = 'yourfilm.movieRatings';

export function readMovieRatings() {
  try {
    return JSON.parse(localStorage.getItem(ratingsStorageKey) || '{}');
  } catch {
    return {};
  }
}

export function writeMovieRatings(ratings) {
  localStorage.setItem(ratingsStorageKey, JSON.stringify(ratings));
}

export function saveMovieRating(movieId, rating) {
  const ratings = readMovieRatings();
  const currentRating = ratings[movieId] ?? { tags: [] };

  if (!rating) {
    delete ratings[movieId];
  } else {
    ratings[movieId] = {
      ...currentRating,
      rating,
      updatedAt: new Date().toISOString(),
    };
  }

  writeMovieRatings(ratings);
  return ratings;
}

export function toggleMovieRatingTag(movieId, tag) {
  const ratings = readMovieRatings();
  const currentRating = ratings[movieId] ?? { rating: 0, tags: [] };
  const currentTags = currentRating.tags ?? [];
  const tags = currentTags.includes(tag)
    ? currentTags.filter((currentTag) => currentTag !== tag)
    : [...currentTags, tag];

  ratings[movieId] = {
    ...currentRating,
    tags,
    updatedAt: new Date().toISOString(),
  };

  writeMovieRatings(ratings);
  return ratings;
}
