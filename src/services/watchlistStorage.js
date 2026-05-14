import { movies } from '../data/movies.js';

const WATCHLIST_KEY = 'yourfilm.watchlist';

function hydrateWatchlist(items) {
  return items
    .map((item) => movies.find((movie) => movie.id === item.id) ?? item)
    .filter(Boolean);
}

export function getWatchlist() {
  try {
    const rawValue = localStorage.getItem(WATCHLIST_KEY);
    return rawValue ? hydrateWatchlist(JSON.parse(rawValue)) : [];
  } catch {
    return [];
  }
}

export function saveToWatchlist(movie) {
  const currentList = getWatchlist();
  const nextList = currentList.some((item) => item.id === movie.id)
    ? currentList
    : [...currentList, movie];

  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(nextList));
  return nextList;
}

export function removeFromWatchlist(movieId) {
  const nextList = getWatchlist().filter((movie) => movie.id !== movieId);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(nextList));
  return nextList;
}
