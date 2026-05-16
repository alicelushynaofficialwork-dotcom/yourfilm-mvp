import { localizeMovie } from '../../utils/localization.js';

const communityUsers = [
  {
    name: 'Мария',
    title: 'Киноман',
    genres: ['драма', 'приключения'],
    movies: ['Головоломка 2', 'Невероятная жизнь Уолтера Митти'],
  },
  {
    name: 'София',
    title: 'Романтик кино',
    genres: ['романтика', 'мюзикл'],
    movies: ['Ла-Ла Ленд', 'Маленькая мисс Счастье'],
  },
  {
    name: 'Даниил',
    title: 'Мастер мотивации',
    genres: ['драма', 'биография'],
    movies: ['В погоне за счастьем', 'Повар на колесах'],
  },
];

const publicCollections = [
  {
    title: 'Фильмы для мотивации',
    text: 'Истории, которые помогают снова двигаться и не бросать важное.',
  },
  {
    title: 'Фильмы после расставания',
    text: 'Мягкое кино про принятие, себя и новую опору.',
  },
  {
    title: 'Фильмы для уютного вечера',
    text: 'Тёплые подборки для спокойного просмотра дома.',
  },
  {
    title: 'Фильмы, которые изменили мой взгляд на жизнь',
    text: 'Личные списки киноманов с историями, которые зацепили глубже обычного.',
  },
];

export default function CommunitySection({ language, movies }) {
  const previewMovies = movies.slice(0, 4).map((movie) => localizeMovie(movie, language));

  return (
    <section className="community-section" id="community" aria-label="Сообщество">
      <div className="community-heading">
        <p className="eyebrow">Сообщество киноманов</p>
        <h2>Делись фильмами и находи людей с похожим вкусом</h2>
        <p>
          MVP-раздел для публичных подборок, титулов, открытых профилей и рекомендаций от
          других зрителей YourFilm.
        </p>
      </div>
      <div className="community-grid">
        <article className="community-panel community-collections">
          <h3>Публичные подборки</h3>
          <div className="collection-list">
            {publicCollections.map((collection) => (
              <button className="collection-card" key={collection.title} type="button">
                <strong>{collection.title}</strong>
                <span>{collection.text}</span>
              </button>
            ))}
          </div>
        </article>
        <article className="community-panel">
          <h3>Профили пользователей</h3>
          <div className="community-user-list">
            {communityUsers.map((user) => (
              <div className="community-user-card" key={user.name}>
                <div>
                  <strong>{user.name}</strong>
                  <span>{user.title}</span>
                </div>
                <small>{user.genres.join(' · ')}</small>
                <p>{user.movies.join(', ')}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="community-panel community-top">
          <h3>Топ недели</h3>
          <div className="community-movie-stack">
            {previewMovies.map((movie) => (
              <div className="community-movie-row" key={movie.id}>
                <img src={movie.poster} alt={movie.title} />
                <div>
                  <strong>{movie.title}</strong>
                  <span>{movie.year} · рекомендуют киноманы</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
