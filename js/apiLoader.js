const apiKey = "ae0a4eba1c7e749c1ac3ccf61effa065";

const endpoints = {
  popularMovies: `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`,
  popularSeries: `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`,
};

function fetchAndDisplay(url, containerId, type = "movie") {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const items = data.results;
      const container = document.getElementById(containerId);

      items.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${
          item.title || item.name
        }">
          <h3>${item.title || item.name}</h3>
          <p>⭐ ${item.vote_average}</p>
        `;
        container.appendChild(card);
      });
    })

    .catch((err) => {
      console.error(`Error loading from TMDb (${type}):`, err);
      document.getElementById(
        containerId
      ).innerHTML = `<p>Failed to load ${type}s. Try again later.</p>`;
    });
}

fetchAndDisplay(endpoints.popularMovies, "popular-movies", "movie");
fetchAndDisplay(endpoints.popularSeries, "popular-series", "series");

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
