import { useRef } from 'react';
import MovieCard from '../movies/MovieCard.jsx';
import { localizeMovie } from '../../utils/localization.js';

export default function RecommendationResult({
  copy,
  language,
  recommendation,
  onAnotherMovie,
  onSaveMovie,
  onSelectMovie,
  onRateMovie,
  onToggleRatingTag,
  ratings = {},
  isSaved,
}) {
  const similarListRef = useRef(null);

  if (!recommendation) {
    return (
      <section className="section-panel result-panel" id="recommendation">
        <h2>{copy.result.emptyTitle}</h2>
        <p>{copy.result.emptyText}</p>
      </section>
    );
  }

  const localizedMovie = localizeMovie(recommendation.movie, language);

  function scrollSimilarMovies(direction) {
    if (!similarListRef.current) return;

    similarListRef.current.scrollBy({
      left: direction * 260,
      behavior: 'smooth',
    });
  }

  return (
    <section className="section-panel result-panel" id="recommendation">
      <p className="eyebrow">{copy.result.eyebrow}</p>
      <MovieCard
        copy={copy}
        language={language}
        movie={recommendation.movie}
        ratingData={ratings[recommendation.movie.id]}
        onRateMovie={onRateMovie}
        onToggleRatingTag={onToggleRatingTag}
      />
      <div className="reason-grid">
        <article>
          <h3>{copy.result.why}</h3>
          <p>{localizedMovie.whyRecommended}</p>
        </article>
        <article>
          <h3>{copy.result.emotion}</h3>
          <p>{localizedMovie.emotionGiven}</p>
        </article>
        <article>
          <h3>{copy.result.lesson}</h3>
          <p>{localizedMovie.heroLesson}</p>
        </article>
        <article>
          <h3>{copy.result.perspective}</h3>
          <p>{localizedMovie.perspectiveShift}</p>
        </article>
      </div>
      <div className="actions">
        <button className="primary-action" type="button" onClick={() => onSaveMovie(recommendation.movie)}>
          {isSaved ? copy.result.saved : copy.result.save}
        </button>
        <button className="ghost-action" type="button" onClick={onAnotherMovie}>
          {copy.result.another}
        </button>
      </div>
      <section className="trailer-panel" aria-label={copy.result.trailerTitle}>
        <div>
          <p className="eyebrow">{copy.result.trailerTitle}</p>
          <h3>{localizedMovie.title}</h3>
          <p>{copy.result.trailerText}</p>
        </div>
        <a className="primary-action" href={recommendation.movie.trailerUrl} target="_blank" rel="noreferrer">
          {copy.result.trailerButton}
        </a>
      </section>
      <div className="recommendation-next">
        <section className="similar-panel" aria-label={copy.result.similarTitle}>
          <div>
            <h3>{copy.result.similarTitle}</h3>
            <p>{copy.result.similarHint}</p>
          </div>
          <div className="similar-carousel">
            <button
              className="similar-arrow left"
              type="button"
              aria-label={copy.result.scrollLeft}
              onClick={() => scrollSimilarMovies(-1)}
            >
              &lt;
            </button>
            <div className="similar-list" ref={similarListRef}>
              {recommendation.similarMovies.map((movie) => {
                const similarMovie = localizeMovie(movie, language);

                return (
                  <button
                    className="similar-card"
                    key={movie.id}
                    type="button"
                    onClick={() => onSelectMovie(movie.id)}
                  >
                    <img src={movie.poster} alt={`${copy.result.posterAlt} ${similarMovie.title}`} />
                    <span>{similarMovie.title}</span>
                    <small>{movie.year}</small>
                  </button>
                );
              })}
            </div>
            <button
              className="similar-arrow right"
              type="button"
              aria-label={copy.result.scrollRight}
              onClick={() => scrollSimilarMovies(1)}
            >
              &gt;
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}
