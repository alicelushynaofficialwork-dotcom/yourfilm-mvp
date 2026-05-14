import { localizeMovie } from '../../utils/localization.js';

export default function WatchlistPreview({ copy, language, movies, onRemoveMovie }) {
  return (
    <section className="watchlist-preview" id="watchlist-preview">
      <div className="section-heading">
        <p className="eyebrow">{copy.watchlist.eyebrow}</p>
        <h2>{copy.watchlist.title}</h2>
      </div>
      {movies.length === 0 ? (
        <p className="empty-state">{copy.watchlist.empty}</p>
      ) : (
        <div className="saved-row">
          {movies.map((movie) => {
            const localizedMovie = localizeMovie(movie, language);

            return (
              <article className="saved-movie" key={movie.id}>
                <img src={movie.poster} alt={`${copy.result.posterAlt} ${localizedMovie.title}`} />
                <div>
                  <h3>{localizedMovie.title}</h3>
                  <p>{localizedMovie.shortReason}</p>
                  <button className="text-button" type="button" onClick={() => onRemoveMovie(movie.id)}>
                    {copy.watchlist.remove}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
