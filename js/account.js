//Function to show specific movies with their IDs

const movieId = [986056, 950387, 348, 603, 157336];
const seriesId = [1399, 66732, 100088, 1402, 82856];

function getSpecificMovie(movieIds, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  movieIds.forEach((id) => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=ae0a4eba1c7e749c1ac3ccf61effa065&language=en-US`
    )
      .then((res) => res.json())
      .then((movie) => {
        const card = document.createElement("div");
        card.classList.add("movie-card");

        card.innerHTML = `
          <a href="movieDetail.html?id=${movie.id}">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average}</p>
          </a>
        `;
        container.appendChild(card);
      })
      .catch((err) => {
        console.error(`Failed to fetch movie with ID ${id}:`, err);
      });
  });
}

function getSpecificSerie(serieIds, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  serieIds.forEach((id) => {
    fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=ae0a4eba1c7e749c1ac3ccf61effa065&language=en-US`
    )
      .then((res) => res.json())
      .then((series) => {
        const card = document.createElement("div");
        card.classList.add("movie-card");

        card.innerHTML = `
          <a href="seriesDetail.html?id=${series.id}">
            <img src="https://image.tmdb.org/t/p/w500${series.poster_path}" alt="${series.name}">
            <h3>${series.name}</h3>
            <p>⭐ ${series.vote_average}</p>
          </a>
        `;
        container.appendChild(card);
      })
      .catch((err) => {
        console.error(`Failed to fetch movie with ID ${id}:`, err);
      });
  });
}

getSpecificMovie(movieId, "movie-carousel");
getSpecificSerie(seriesId, "series-carousel");

/*fetchAndDisplay(
  "https://api.themoviedb.org/3/movie/popular?api_key=ae0a4eba1c7e749c1ac3ccf61effa065&language=en-US&page=1",
  "movie-carousel",
  "movie",
  5
);

fetchAndDisplay(
  "https://api.themoviedb.org/3/tv/popular?api_key=ae0a4eba1c7e749c1ac3ccf61effa065&language=en-US&page=1",
  "series-carousel",
  "series",
  5
);*/
