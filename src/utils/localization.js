import { moodCopy } from '../data/translations.js';

export function localizeMood(mood, language) {
  const copy = moodCopy[mood.id]?.[language];

  if (!copy) return mood;

  return {
    ...mood,
    label: copy[0],
    description: copy[1],
  };
}

export function localizeMovie(movie, language) {
  const copy = movie.translations?.[language];

  if (!copy) return movie;

  return {
    ...movie,
    ...copy,
  };
}
