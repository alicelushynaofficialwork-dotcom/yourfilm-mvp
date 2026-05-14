export function formatMovieMeta(movie) {
  return `${movie.year} · ${movie.genres.join(', ')}`;
}
