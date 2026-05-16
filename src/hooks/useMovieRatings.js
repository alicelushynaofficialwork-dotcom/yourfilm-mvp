import { useState } from 'react';
import {
  readMovieRatings,
  saveMovieRating,
  toggleMovieRatingTag,
} from '../services/ratingStorage.js';

export function useMovieRatings() {
  const [ratings, setRatings] = useState(() => readMovieRatings());

  function rateMovie(movieId, rating) {
    setRatings(saveMovieRating(movieId, rating));
  }

  function toggleTag(movieId, tag) {
    setRatings(toggleMovieRatingTag(movieId, tag));
  }

  return {
    ratings,
    rateMovie,
    toggleTag,
  };
}
