import { useEffect, useState } from 'react';
import { getWatchlist, removeFromWatchlist, saveToWatchlist } from '../services/watchlistStorage.js';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    setWatchlist(getWatchlist());
  }, []);

  function saveMovie(movie) {
    setWatchlist(saveToWatchlist(movie));
  }

  function removeMovie(movieId) {
    setWatchlist(removeFromWatchlist(movieId));
  }

  function isMovieSaved(movieId) {
    return watchlist.some((movie) => movie.id === movieId);
  }

  return {
    watchlist,
    saveMovie,
    removeMovie,
    isMovieSaved,
  };
}
