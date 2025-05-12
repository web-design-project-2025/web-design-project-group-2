//https://developer.themoviedb.org/reference/keyword-movies
//https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
//Get Id for movies
const urlParam = new URLSearchParams(window.location.search);
const movieId = urlParam.get("id");

//Html containers for the details
const detailContainer = document.getElementById("movie-section");
const reviewsWrapper = document.getElementById("reviews-wrapper");

//Get movie data
async function fetchMovieDetails() {
  try {
    //Info
    const movieRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
    );
    const movieData = await movieRes.json();

    //Trailer
    const trailerRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`
    );
    const trailerData = await trailerRes.json();

    //Cast and crew
    const creditsRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=en-US`
    );
    const creditsData = await creditsRes.json();

    //Trailer on youtube
    const trailer = trailerData.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    renderMovieDetail(movieData, trailer, creditsData);
    loadReviews(movieId, movieData.title);
  } catch (error) {
    console.error("Failed to load movie details:", error);
  }
}

//Function to show the details, trailer, poster, titler, overview and cast
function renderMovieDetail(movie, trailer, credits) {
  detailContainer.innerHTML = `<div class="trailer-container">
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
    <div class="movie-title-row">
    <h1>${movie.title} (${new Date(movie.release_date).getFullYear()})</h1>
    <div class="action-icons">
    <img src="images/icons/watch.png" alt="Watch later" class="watch-later-icon" id="watch-later-icon" />
    <img src="images/icons/save.png" alt="Save to list" class="save-icon" id="save-icon" />
    </div>
    </div>
    <p class="rating">⭐ ${movie.vote_average.toFixed(1)}/10</p>
    <p class="overview">${movie.overview}</p>
    </div>
    </div>

    <div class="cast-crew">
    <h2>Top Cast & Crew</h2>
    <div class="cast-list">
    ${credits.cast
      .slice(0, 6)
      .map(
        (actor) =>
          `<div class="cast-card"><img src="https://image.tmdb.org/t/p/w200${actor.profile_path}" alt="${actor.name}">
      <p>${actor.name}</p>
      <small>${actor.character}</small>
      </div>`
      )
      .join("")}
      </div>
      </div>`;

  //Watch later check
  const watchIcon = document.getElementById("watch-later-icon");
  const watchLaterList = JSON.parse(localStorage.getItem("watchLater")) || [];

  const savedMovie = watchLaterList.find((m) => m.id === movie.id);
  if (savedMovie) {
    watchIcon.src = "images/icons/watched.png";
  }

  watchIcon.addEventListener("click", () => {
    let updatedList = JSON.parse(localStorage.getItem("watchLater")) || [];

    const exists = updatedList.find((m) => m.id === movie.id);
    if (exists) {
      updatedList = updatedList.filter((m) => m.id !== movie.id);
      watchIcon.src = "images/icons/watch.png";
    } else {
      updatedList.push({
        id: movie.id,
        title: movie.title,
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
      watchIcon.src = "images/icons/watched.png";
    }

    localStorage.setItem("watchLater", JSON.stringify(updatedList));
  });

  //Save button
  const saveIcon = document.getElementById("save-icon");
  const userLists = JSON.parse(localStorage.getItem("userLists")) || [];

  //Check if movie is in a list
  const isSaved = userLists.some((list) =>
    list.movies.some((m) => m.id === movie.id)
  );

  if (isSaved) {
    saveIcon.src = "images/icons/saved.png";
  }

  saveIcon.addEventListener("click", () => {
    const currentlySaved = userLists.some((list) =>
      list.movies.some((m) => m.id === movie.id)
    );

    //Remove from all lists
    if (currentlySaved) {
      userLists.forEach((list) => {
        list.movies = list.movies.filter((m) => m.id !== movie.id);
      });

      localStorage.setItem("userLists", JSON.stringify(userLists));
      saveIcon.src = "images/icons/save.png";
    } else {
      //Eventually a modal to select a list to add movie in
      saveIcon.src = "images/icons/saved.png";
      if (userLists.length > 0) {
        userLists[0].movies.push({
          id: movie.id,
          title: movie.title,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        });
        localStorage.setItem("userLists", JSON.stringify(userLists));
      }
    }
  });
}

//Reviews from a JSON file
function loadReviews(movieId, movieTitle) {
  fetch("data/reviews.json")
    .then((res) => res.json())
    .then((reviews) => {
      reviews.slice(0, 4).forEach((review) => {
        reviewsWrapper.innerHTML += generateReviewCard(review, movieTitle);
      });
    })
    .catch((err) => console.error("Error loading reviews", err));
}

//Function to show similar movies
function loadSimilarMovies(movieId) {
  fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}&language=en-US`
  )
    .then((res) => res.json())
    .then((data) => {
      const similarWrapper = document.getElementById("similar-wrapper");
      const movies = data.results.slice(0, 6);

      movies.forEach((movie) => {
        const card = document.createElement("div");
        card.classList.add("similar-card");

        card.innerHTML = `
          <a href="movieDetail.html?id=${movie.id}">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average}</p>
          </a>
        `;

        similarWrapper.appendChild(card);
      });
    })
    .catch((err) => console.error("Error loading similar movies", err));
}

//Function to generate review cards
function generateReviewCard(review, movieTitle) {
  return `<div class="review-card ${review.color}">
  <div class="user-info">
  <div class="user-img">
  <img src="images/icons/user.png" alt="User picture"></div>
  <p class="username">@${review.username}</p>
  </div>
  <div class="review-content">
  <h3>${movieTitle} (2025)</h3>
  <p class="review-rating">⭐ ${review.rating}</p>
  <p class="review-text">${review.text}</p>
  </div>
  </div>`;
}

fetchMovieDetails();
loadSimilarMovies(movieId);
