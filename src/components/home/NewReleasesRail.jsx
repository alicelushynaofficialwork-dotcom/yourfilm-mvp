import { useRef } from 'react';
import { localizeMovie } from '../../utils/localization.js';

export default function NewReleasesRail({
  copy,
  language,
  releases,
  selectedMovieId,
  onSelectRelease,
}) {
  const releaseFeedRef = useRef(null);

  function scrollReleases(direction) {
    if (!releaseFeedRef.current) return;

    releaseFeedRef.current.scrollBy({
      top: direction * 280,
      behavior: 'smooth',
    });
  }

  return (
    <aside className="new-releases-rail" aria-label={copy.releases.title}>
      <div className="rail-heading">
        <p className="eyebrow">{copy.releases.eyebrow}</p>
        <h2>{copy.releases.title}</h2>
        <p>{copy.releases.copy}</p>
      </div>
      <div className="release-feed-shell">
        <div className="release-arrow-panel" aria-label="Управление лентой новинок">
          <button
            className="release-arrow"
            type="button"
            aria-label="Прокрутить новинки вверх"
            onClick={() => scrollReleases(-1)}
          >
            ↑
          </button>
          <button
            className="release-arrow"
            type="button"
            aria-label="Прокрутить новинки вниз"
            onClick={() => scrollReleases(1)}
          >
            ↓
          </button>
        </div>
        <div className="release-feed" ref={releaseFeedRef} aria-label={copy.releases.feedLabel}>
          {releases.map((movie) => {
            const localizedMovie = localizeMovie(movie, language);
            const isActive = movie.id === selectedMovieId;

            return (
              <button
                className={isActive ? 'release-story active' : 'release-story'}
                key={movie.id}
                type="button"
                onClick={() => onSelectRelease(movie.id)}
              >
                <img src={movie.poster} alt={`${copy.result.posterAlt} ${localizedMovie.title}`} />
                <span>{localizedMovie.title}</span>
                <small>
                  {movie.year} · {localizedMovie.genres[0]}
                </small>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
