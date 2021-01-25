import moviesSource from "../data/movies_source.json";
import moviesTarget from "../data/movies_target.json";
import { writeFileSync } from "fs";
import { string } from "getenv";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

interface IRating {
  Source: string;
  Value: string;
}

interface IOmdbResponse {
  Title: string;
  Year: number;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: IRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

interface IPairwiseMovie {
  title: string;
  writer: string;
  director: string;
  year: number;
  genre: string;
  rated: string;
  rotten_tomatoes_rating: number | null;
  runtime_min: number;
}

const iterations = 10;
const apiKey = string("OMDB_API_KEY");
const OMDB_BASE_URL = `http://www.omdbapi.com/?apikey=${apiKey}`;

const getRottenTomatoesRating = (ratings: IRating[]) => {
  const rating = ratings.find((x) => x.Source === "Rotten Tomatoes")?.Value;
  return rating ? parseInt(rating) : null;
};

const fetchMovieData = async () => {
  let i = 0;

  for (const movie of moviesSource) {
    if (i === iterations) break;

    if (!movie.fetched) {
      const queryString = `${OMDB_BASE_URL}&i=${movie.imdb}`;
      const { data } = await axios.get<IOmdbResponse>(queryString);

      const newMovie: IPairwiseMovie = {
        title: data.Title,
        writer: data.Writer,
        director: data.Director,
        year: data.Year,
        genre: data.Genre.split(",")[0],
        rated: data.Rated,
        rotten_tomatoes_rating: getRottenTomatoesRating(data.Ratings),
        runtime_min: parseInt(data.Runtime),
      };

      // @ts-ignore
      moviesTarget.push(newMovie);
      movie.fetched = true;
      i++;
    }
  }

  // sort source by un-fetched so we're more efficient on the next run
  moviesSource.sort((a, b) => (!a.fetched ? -1 : 1));

  // write fetched movies to file.
  writeFileSync(
    __dirname + "/../data/movies_target.json",
    JSON.stringify(moviesTarget, null, 2)
  );

  // write updated movies source to file
  writeFileSync(
    __dirname + "/../data/movies_source.json",
    JSON.stringify(moviesSource, null, 2)
  );
};

fetchMovieData();
