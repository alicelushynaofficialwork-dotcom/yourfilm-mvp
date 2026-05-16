import { movies } from '../../data/movies.js';
import { localizeMovie } from '../../utils/localization.js';

export default function HeroSection({ copy, language = 'ru' }) {
  const heroMovies = movies.slice(0, 6).map((movie) => localizeMovie(movie, language));

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="eyebrow">{copy.hero.eyebrow}</p>
        <h1>{copy.hero.title}</h1>
        <p className="hero-copy">{copy.hero.copy}</p>
        <div className="hero-actions" aria-label="Главные действия">
          <a className="primary-action" href="#recommendation">
            {copy.hero.primary}
          </a>
          <a className="ghost-action" href="#how-it-works">
            {copy.hero.secondary}
          </a>
        </div>
      </div>
      <aside className="hero-poster-wall" aria-label="Подборка фильмов YourFilm">
        {heroMovies.map((movie, index) => (
          <article className={`hero-poster-tile tile-${index + 1}`} key={movie.id}>
            <img src={movie.poster} alt={`${copy.result.posterAlt} ${movie.title}`} />
            <span>{movie.title}</span>
          </article>
        ))}
        <div className="hero-watch-now">
          <div>
            <span>Сейчас смотрят</span>
            <strong>Эти фильмы смотрят твои друзья</strong>
          </div>
          <div className="watch-now-covers" aria-hidden="true">
            {heroMovies.slice(0, 4).map((movie) => (
              <img src={movie.poster} alt="" key={movie.id} />
            ))}
          </div>
          <a href="#recommendation">Посмотреть</a>
        </div>
      </aside>
    </section>
  );
}
