const urlParam = new URLSearchParams(window.location.search);
const movieId = urlParam.get("id");

const detailContainer = document.querySelector("main");

//Fetch the movie details
async function fetchMovieDetails() {
  try {
    const movieRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
    );
    const movieData = await movieRes.json();

    const trailerRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`
    );
    const trailerData = await trailerRes.json();

    const creditsRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=en-US`
    );
    const creditsData = await creditsRes.json();

    const trailer = trailerData.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    renderMovieDetail(movieData, trailer, creditsData);
  } catch (error) {
    console.error("Failed to load movie details:", error);
  }
}

function renderMovieDetail(movie, trailer, credits) {
  detailContainer.innerHTML = `
    <section class="movie-detail">
      <div class="trailer-container">
        ${
          trailer
            ? `<iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>`
            : "<p>No trailer available.</p>"
        }
      </div>

      <div class="movie-main-info">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
    movie.title
  }" class="movie-poster"/>
        <div class="movie-text">
          <h1>${movie.title} (${new Date(
    movie.release_date
  ).getFullYear()})</h1>
          <p class="rating">⭐ ${movie.vote_average.toFixed(1)}/10</p>
          <p class="overview">${movie.overview}</p>
        </div>
      </div>

      <div class="cast-crew">
        <h2>Cast & Crew</h2>
        <div class="cast-list">
          ${credits.cast
            .slice(0, 6)
            .map(
              (actor) => `
            <div class="cast-card">
              <img src="https://image.tmdb.org/t/p/w200${actor.profile_path}" alt="${actor.name}">
              <p>${actor.name}</p>
              <small>${actor.character}</small>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

fetchMovieDetails();
