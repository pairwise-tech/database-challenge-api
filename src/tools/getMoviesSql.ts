import movies from "../data/movies.json";
import { IRating } from "./fetchMovies.js";
import { writeFileSync } from "fs";

const getMoviesSql = () => {
  const getRottenTomatoesRating = (ratings: IRating[]) => {
    const rating = ratings.find((x) => x.Source === "Rotten Tomatoes")?.Value;
    return rating ? parseInt(rating) : null;
  };

  const movieValues = movies
    .map((m) => {
      const year = m.Year.slice(0, 4);
      const runtime = parseInt(m.Runtime);
      const genre = m.Genre.split(",")[0];
      const rating = getRottenTomatoesRating(m.Ratings);

      // escape single quotes for SQL query
      const escapeQuote = (s: string) => s.replace(/'/g, "''");

      // prettier-ignore
      return `('${escapeQuote(m.Title)}','${escapeQuote(m.Writer)}','${escapeQuote(m.Director)}',${year},'${escapeQuote(genre)}','${m.Rated}',${rating},${runtime})`;
    })
    .join(",\n");

  const sql = `
  INSERT INTO movie (
      title
    , writer
    , director
    , year
    , genre
    , rated
    , rotten_tomatoes_rating
    , runtime_min
  ) VALUES ${movieValues}`;

  // uncomment to debug SQL query if needed
  // writeFileSync(__dirname + "/../data/sql.txt", sql);
  return sql;
};

export default getMoviesSql;
