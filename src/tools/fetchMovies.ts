import moviesSource from "../data/movies_source.json";
import moviesTarget from "../data/movies.json";
import { writeFileSync } from "fs";
import { string } from "getenv";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export interface IRating {
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
  Error?: string;
}

const iterations = 176;
const apiKey = string("OMDB_API_KEY");
const OMDB_BASE_URL = `http://www.omdbapi.com/?apikey=${apiKey}`;

const fetchMovieData = async () => {
  let i = 0;

  const moviesLeft = moviesSource.filter(({ fetched }) => !fetched).length;

  if (moviesLeft === 0) {
    console.log(`[FetchMovies] All movies have been fetched.`);
    return;
  }

  console.log(`[FetchMovies] ${moviesLeft} movies left to fetch.`);
  console.log(`[FetchMovies] ${moviesTarget.length} movies already fetched.`);

  try {
    for (const movie of moviesSource) {
      if (i === iterations) break;

      if (!movie.fetched) {
        const queryString = `${OMDB_BASE_URL}&i=${movie.imdb}`;
        const { data } = await axios.get<IOmdbResponse>(queryString);

        if (data.Response === "True") {
          // @ts-ignore
          moviesTarget.push(data);
          movie.fetched = true;
          i++;

          console.log(
            `[FetchMovies] ${i} movie(s) fetched so far. Just fetched: ${movie.title}`
          );
        } else {
          throw new Error(
            data.Error + ` For Title: ${movie.title} (${movie.imdb})`
          );
        }
      }
    }

    console.log(`[FetchMovies] Fetched ${i} movies. Updating JSON files.`);
  } catch (e) {
    console.error(`[FetchMovies] ${e}`);
    console.error(
      `[FetchMovies] Error while fetching movies, aborting and updating JSON files.`
    );
  } finally {
    // sort source by un-fetched so we're more efficient on the next run
    moviesSource.sort((a, b) => (!a.fetched ? -1 : 1));

    // write fetched movies to file.
    writeFileSync(
      __dirname + "/../data/movies.json",
      JSON.stringify(moviesTarget, null, 2)
    );

    // write updated movies source to file
    writeFileSync(
      __dirname + "/../data/movies_source.json",
      JSON.stringify(moviesSource, null, 2)
    );
  }
};

fetchMovieData();
