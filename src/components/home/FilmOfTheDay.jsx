import { localizeMovie } from '../../utils/localization.js';

export default function FilmOfTheDay({ copy, language, movie }) {
  const localizedMovie = localizeMovie(movie, language);

  return (
    <section className="section-panel compact-panel" id="film-of-day">
      <p className="eyebrow">{copy.day.eyebrow}</p>
      <h2>{localizedMovie.title}</h2>
      <p>{localizedMovie.shortReason}</p>
    </section>
  );
}
