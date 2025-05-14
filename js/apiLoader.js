//Personal TMDb API key (from: https://developer.themoviedb.org)
const apiKey = "ae0a4eba1c7e749c1ac3ccf61effa065";

// I used TMDb's API documentation to find the endpoints for movies, series...
// https://developer.themoviedb.org/reference/intro
const endpoints = {
  popularMovies: `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`,
  popularSeries: `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`,
  recommended: `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`,
};

const genreEndpoints = {
  comedy: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=35&language=en-US`,
  horror: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=27&language=en-US`,
  fantasy: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=14&language=en-US`,
};

//Function to display movies and series from the API
function fetchAndDisplay(url, containerId, type = "movie", limit) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const items = data.results;
      const container = document.getElementById(containerId);

      //Display a limit of movies/series
      items.slice(0, limit).forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("movie-card");

        card.innerHTML = `<a href="movieDetail.html?id=${item.id}">
          <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${
          item.title || item.name
        }">
          <h3>${item.title || item.name}</h3>
          <p>⭐ ${item.vote_average}</p>
          </a>`;

        container.appendChild(card);
      });
    })

    //Error handle
    .catch((err) => {
      console.error(`Error loading from TMDb (${type}):`, err);
      document.getElementById(
        containerId
      ).innerHTML = `<p>Failed to load ${type}. Try again later.</p>`;
    });
}

//Function to be able to scroll the carousels with arrows
function scrollCarousel(id, direction) {
  const container = document.getElementById(id);
  const card = container.querySelector(".movie-card");

  if (!card) return;

  const cardWidth = card.offsetWidth + 16;
  container.scrollBy({
    left: direction * cardWidth,
    behavior: "smooth",
  });
}

//Load each function/section with a limited number to display
fetchAndDisplay(endpoints.popularMovies, "popular-movies", "movie", 10);
fetchAndDisplay(endpoints.popularSeries, "popular-series", "series", 10);
fetchAndDisplay(endpoints.recommended, "recommended-fy", "recommended", 7);
fetchAndDisplay(genreEndpoints.comedy, "comedy-movies", "Comedy Movies", 20);
fetchAndDisplay(genreEndpoints.horror, "horror-movies", "Horror Movies", 20);
fetchAndDisplay(genreEndpoints.fantasy, "fantasy-movies", "Fantasy Movies", 20);
