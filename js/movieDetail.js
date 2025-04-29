const urlParam = new URLSearchParams(window.location.search);
const movieId = urlParam.get("id");

const detailContainer = document.getElementById("movie-section");
const reviewsWrapper = document.getElementById("reviews-wrapper");

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
    loadReviews(movieId, movieData.title);
  } catch (error) {
    console.error("Failed to load movie details:", error);
  }
}

function renderMovieDetail(movie, trailer, credits) {
  detailContainer.innerHTML = `
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
        <h1>${movie.title} (${new Date(movie.release_date).getFullYear()})</h1>
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
  `;
}

//Reviews from JSON file
function loadReviews(movieId, movieTitle) {
  fetch("data/reviews.json")
    .then((res) => res.json())
    .then((reviews) => {
      const filtered = reviews.filter((r) => r.movieId == movieId);
      if (!filtered.length) return;

      filtered.slice(0, 4).forEach((review) => {
        reviewsWrapper.innerHTML += generateReviewCard(review, movieTitle);
      });
    })
    .catch((err) => console.error("Error loading reviews", err));
}

//Review cards
function generateReviewCard(review, movieTitle) {
  return `
    <div class="review-card ${review.color}">
      <div class="user-info">
        <div class="user-img"></div>
        <img class="user-icon" src="images/user.png" alt="user icon" />
        <p class="username">@${review.username}</p>
      </div>
      <div class="review-content">
        <h3>${movieTitle} (2025)</h3>
        <p class="review-rating">⭐ ${review.rating}</p>
        <p class="review-text">${review.text}</p>
      </div>
    </div>
  `;
}

fetchMovieDetails();
