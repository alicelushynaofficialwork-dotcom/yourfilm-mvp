import { movies } from '../data/movies.js';
import { newReleases } from '../data/newReleases.js';
import { localizeMovie } from '../utils/localization.js';

export const movieCatalog = [...newReleases, ...movies];

const plotStopWords = new Set([
  'про',
  'фильм',
  'кино',
  'about',
  'movie',
  'film',
  'фільм',
  'кіно',
]);

export function getGenres(language, kidsOnly = false) {
  const source = kidsOnly ? movieCatalog.filter((movie) => movie.kidSafe) : movieCatalog;
  const genres = source.flatMap((movie) => localizeMovie(movie, language).genres);
  return [...new Set(genres)].sort((firstGenre, secondGenre) =>
    firstGenre.localeCompare(secondGenre),
  );
}

export function getYears() {
  return [...new Set(movieCatalog.map((movie) => movie.year))].sort(
    (firstYear, secondYear) => secondYear - firstYear,
  );
}

export function searchMovies({
  actor = '',
  director = '',
  genre = '',
  kidsOnly = false,
  language = 'ru',
  plot = '',
  query = '',
  year = '',
}) {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedActor = actor.trim().toLowerCase();
  const normalizedDirector = director.trim().toLowerCase();
  const plotWords = plot
    .trim()
    .toLowerCase()
    .split(/[\s,.;:!?]+/)
    .filter((word) => word.length > 2 && !plotStopWords.has(word));

  const source = kidsOnly ? movieCatalog.filter((movie) => movie.kidSafe) : movieCatalog;
  const results = source.filter((movie) => {
    const localizedMovie = localizeMovie(movie, language);
    const localizedTitle = localizedMovie.title.toLowerCase();
    const baseTitle = movie.title.toLowerCase();
    const translatedTitles = Object.values(movie.translations ?? {}).map((translation) =>
      translation.title.toLowerCase(),
    );
    const matchesQuery =
      !normalizedQuery ||
      localizedTitle.includes(normalizedQuery) ||
      baseTitle.includes(normalizedQuery) ||
      translatedTitles.some((title) => title.includes(normalizedQuery));
    const matchesGenre = !genre || localizedMovie.genres.includes(genre);
    const matchesYear = !year || String(movie.year) === String(year);
    const matchesActor =
      !normalizedActor ||
      movie.actors?.some((actorName) => actorName.toLowerCase().includes(normalizedActor));
    const matchesDirector =
      !normalizedDirector ||
      movie.director?.toLowerCase().includes(normalizedDirector);
    const searchablePlot = [
      localizedMovie.title,
      localizedMovie.description,
      localizedMovie.shortReason,
      ...(movie.plotKeywords ?? []),
    ]
      .join(' ')
      .toLowerCase();
    const matchesPlot =
      plotWords.length === 0 || plotWords.some((word) => searchablePlot.includes(word));

    return (
      matchesQuery &&
      matchesGenre &&
      matchesYear &&
      matchesActor &&
      matchesDirector &&
      matchesPlot
    );
  });

  return [...new Map(results.map((movie) => [movie.id, movie])).values()];
}
