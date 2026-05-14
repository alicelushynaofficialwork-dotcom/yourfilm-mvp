import { localizeMovie } from '../../utils/localization.js';

export default function MovieSearchPanel({
  copy,
  actor,
  director,
  genre,
  genres,
  language,
  plot,
  query,
  results,
  selectedMovieId,
  year,
  years,
  onActorChange,
  onDirectorChange,
  onGenreChange,
  onPlotChange,
  onQueryChange,
  onSelectMovie,
  onYearChange,
}) {
  return (
    <section className="section-panel search-panel" id="movie-search">
      <p className="eyebrow">{copy.search.eyebrow}</p>
      <h2>{copy.search.title}</h2>
      <label className="search-field">
        <span>{copy.search.nameLabel}</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={copy.search.namePlaceholder}
        />
      </label>
      <label className="search-field">
        <span>{copy.search.genreLabel}</span>
        <select value={genre} onChange={(event) => onGenreChange(event.target.value)}>
          <option value="">{copy.search.allGenres}</option>
          {genres.map((genreName) => (
            <option key={genreName} value={genreName}>
              {genreName}
            </option>
          ))}
        </select>
      </label>
      <div className="search-filter-grid">
        <label className="search-field">
          <span>{copy.search.yearLabel}</span>
          <select value={year} onChange={(event) => onYearChange(event.target.value)}>
            <option value="">{copy.search.allYears}</option>
            {years.map((yearValue) => (
              <option key={yearValue} value={yearValue}>
                {yearValue}
              </option>
            ))}
          </select>
        </label>
        <label className="search-field">
          <span>{copy.search.actorLabel}</span>
          <input
            type="search"
            value={actor}
            onChange={(event) => onActorChange(event.target.value)}
            placeholder={copy.search.actorPlaceholder}
          />
        </label>
      </div>
      <label className="search-field">
        <span>{copy.search.directorLabel}</span>
        <input
          type="search"
          value={director}
          onChange={(event) => onDirectorChange(event.target.value)}
          placeholder={copy.search.directorPlaceholder}
        />
      </label>
      <label className="search-field">
        <span>{copy.search.plotLabel}</span>
        <textarea
          value={plot}
          onChange={(event) => onPlotChange(event.target.value)}
          placeholder={copy.search.plotPlaceholder}
          rows="3"
        />
        <small>{copy.search.plotHint}</small>
      </label>
    </section>
  );
}
