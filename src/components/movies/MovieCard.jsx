import { localizeMovie } from '../../utils/localization.js';

export default function MovieCard({ copy, language, movie }) {
  const localizedMovie = localizeMovie(movie, language);

  return (
    <article className="movie-card" key={movie.id}>
      <div className="movie-card-poster">
        <img
          key={movie.id}
          src={movie.poster}
          alt={`${copy.result.posterAlt} ${localizedMovie.title}`}
        />
        <div className="movie-card-tooltip" aria-hidden="true">
          <span>Содержание фильма</span>
          <p>{localizedMovie.description}</p>
        </div>
      </div>
      <div>
        <h2>{localizedMovie.title}</h2>
        <p className="movie-meta">
          {movie.year} · {localizedMovie.genres.join(', ')}
        </p>
        <p>{localizedMovie.description}</p>
        <a className="trailer-link" href={movie.trailerUrl} target="_blank" rel="noreferrer">
          {copy.result.trailer}
        </a>
      </div>
    </article>
  );
}
