export function getFilmOfTheDay(movies) {
  const dayIndex = new Date().getDate() % movies.length;
  return movies[dayIndex];
}
