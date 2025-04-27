//// My personal TMDb API key (from: https://developer.themoviedb.org)
const apiKey = "ae0a4eba1c7e749c1ac3ccf61effa065";

//Define endpoints for different types of data from TMDb
// I used TMDb's API documentation to find the correct endpoints for movies, series, and top-rated.
// Reference: https://developer.themoviedb.org/reference/intro
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
//Fetches data from the TMDb API and displays a limited number of movie or series cards
//url: The API URL you want to get data from
//containerId: The ID of the element where the movie cards should be displayed.
//type: A label for the type of data (used for error messages like "movie" or "series").
//limit: The number of results to show on the page.

function fetchAndDisplay(url, containerId, type = "movie", limit) {
  fetch(url)
    .then((res) => res.json()) //Convert the response to JSON
    .then((data) => {
      const items = data.results; //Array of movie/TV objects
      const container = document.getElementById(containerId); //Target DOM element

      //Only displat the first 'limit' items
      items.slice(0, limit).forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("movie-card");

        //Build HTML content for each card
        card.innerHTML = `<a href="movieDetail.html?id=${item.id}">
          <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${
          item.title || item.name
        }">
          <h3>${item.title || item.name}</h3>
          <p>⭐ ${item.vote_average}</p>
          </a>`;

        container.appendChild(card); //Add card to the page
      });
    })

    .catch((err) => {
      //Handle errors, e.g., no interner, API failure
      console.error(`Error loading from TMDb (${type}):`, err);
      document.getElementById(
        containerId
      ).innerHTML = `<p>Failed to load ${type}s. Try again later.</p>`;
    });
}

//Scrolls the carousel left or right by the width of one movie card
//id: The ID of the carousel container (e.g., popular movies)
//direction: Set to 1 to scroll right, or -1 to scroll left

function scrollCarousel(id, direction) {
  const container = document.getElementById(id);
  const card = container.querySelector(".movie-card");

  //If no card found, exit early
  if (!card) return;

  const cardWidth = card.offsetWidth + 16; //16px gap between cards
  container.scrollBy({
    left: direction * cardWidth,
    behavior: "smooth", //Smooth scrolling
  });
}

//Load each section with a specific number of items
fetchAndDisplay(endpoints.popularMovies, "popular-movies", "movie", 10);
fetchAndDisplay(endpoints.popularSeries, "popular-series", "series", 10);
fetchAndDisplay(endpoints.recommended, "recommended-fy", "recommended", 7);
fetchAndDisplay(genreEndpoints.comedy, "comedy-movies", "Comedy Movies", 20);
fetchAndDisplay(genreEndpoints.horror, "horror-movies", "Horror Movies", 20);
fetchAndDisplay(genreEndpoints.fantasy, "fantasy-movies", "Fantasy Movies", 20);
