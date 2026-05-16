import { localizeMovie } from '../../utils/localization.js';
import { ratingTags } from '../../services/ratingStorage.js';

export default function MovieCard({
  copy,
  language,
  movie,
  ratingData = {},
  onRateMovie,
  onToggleRatingTag,
}) {
  const localizedMovie = localizeMovie(movie, language);
  const currentRating = ratingData.rating ?? 0;
  const selectedTags = ratingData.tags ?? [];
  const plotText = localizedMovie.fullPlot
    ? localizedMovie.fullPlot
    : [localizedMovie.description, localizedMovie.whyRecommended].filter(Boolean).join(' ');

  return (
    <article className="movie-card" key={movie.id}>
      <div className="movie-card-poster" tabIndex={0}>
        <img
          key={movie.id}
          src={movie.poster}
          alt={`${copy.result.posterAlt} ${localizedMovie.title}`}
        />
        <div className="movie-card-tooltip" aria-hidden="true">
          <span>{'\u041f\u043e\u043b\u043d\u043e\u0435 \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435'}</span>
          <p>{plotText}</p>
        </div>
      </div>
      <div>
        <h2>{localizedMovie.title}</h2>
        <p className="movie-meta">
          {movie.year}
          {' · '}
          {localizedMovie.genres.join(', ')}
        </p>
        <p>{localizedMovie.description}</p>
        <a className="trailer-link" href={movie.trailerUrl} target="_blank" rel="noreferrer">
          {copy.result.trailer}
        </a>
        <section className="personal-rating" aria-label="Личная оценка фильма">
          <div className="personal-rating-header">
            <strong>Личная оценка</strong>
            <span>{currentRating ? `${currentRating}/5` : 'пока без оценки'}</span>
          </div>
          <div className="star-rating" role="group" aria-label="Оценка звёздами">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                className={star <= currentRating ? 'star-button active' : 'star-button'}
                key={star}
                type="button"
                aria-label={`${star} из 5`}
                onClick={() => onRateMovie?.(movie.id, star)}
              >
                ★
              </button>
            ))}
          </div>
          <p className="rating-explanation">
            Твоя оценка влияет на будущие рекомендации. Чем больше звёзд, тем больше
            похожих фильмов по стилю, теме, жанру и атмосфере мы будем предлагать тебе.
          </p>
          <div className="rating-tags" aria-label="Причины оценки">
            {ratingTags.map((tag) => (
              <button
                className={selectedTags.includes(tag) ? 'rating-tag active' : 'rating-tag'}
                key={tag}
                type="button"
                onClick={() => onToggleRatingTag?.(movie.id, tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
