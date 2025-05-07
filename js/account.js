const movieId = [986056, 950387, 348, 603, 157336];
const seriesId = [1399, 66732, 100088, 1402, 82856];

const editForm = document.getElementById("edit-form");
const editName = document.getElementById("edit-name");
const editFavorite = document.getElementById("edit-favorite");

//Be able to edit profile
document.getElementById("edit-profile").onclick = (e) => {
  e.preventDefault();
  editForm.classList.toggle("hid");
};

document.getElementById("save-profile").onclick = () => {
  const user = JSON.parse(localStorage.getItem("critix-user")) || {};
  if (editName.value) user.name = editName.value.trim();
  if (editFavorite.value) user.favoriteMovie = editFavorite.value.trim();

  localStorage.setItem("critix-user", JSON.stringify(user));
  loadUserProfile();

  //Reset the form
  editName.value = "";
  editFavorite.value = "";
  editForm.classList.add("hid");
};

//Load and show the user profile info from localStorage
function loadUserProfile() {
  const user = JSON.parse(localStorage.getItem("critix-user"));
  if (user) {
    document.getElementById("profile-name").textContent =
      user.name || "Jane Doe";
    document.getElementById("profile-favorite").textContent =
      user.favoriteMovie || "-";
    document.getElementById("username-dis").textContent =
      user.username || "Jane Doe";
  } else {
    document.getElementById("profile-name").textContent = "Jane Doe";
    document.getElementById("profile-favorite").textContent = "-";
    document.getElementById("username-dis").textContent = "Jane Doe";
  }
}

//Functions to show specific movies and series with their IDs
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

        card.innerHTML = `<a href="movieDetail.html?id=${movie.id}">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average}</p>
          </a>`;
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

        card.innerHTML = `<a href="seriesDetail.html?id=${series.id}">
            <img src="https://image.tmdb.org/t/p/w500${series.poster_path}" alt="${series.name}">
            <h3>${series.name}</h3>
            <p>⭐ ${series.vote_average}</p>
          </a>`;
        container.appendChild(card);
      })
      .catch((err) => {
        console.error(`Failed to fetch movie with ID ${id}:`, err);
      });
  });
}

//Function to show reviews from a json file once at a time
let currentReview = 0;
let allReviews = [];

function showReview(index) {
  const container = document.getElementById("user-reviews");
  container.innerHTML = "";

  if (allReviews.length > 0) {
    const review = allReviews[index];

    //Get username
    const user = JSON.parse(localStorage.getItem("critix-user"));
    const username = user?.username || "Jane Doe";

    const card = document.createElement("div");
    card.classList.add("review-card");

    card.innerHTML = `<div class="review-user">
            <img src="images/icons/user.png" alt="User picture" />
            <span>@${username}</span>
            </div>
            <div class="review-content">
            <h3>${review.movieTitle} (${review.year})</h3>
            <p><span class="star">⭐</span>${review.rating}/10</p>
            <p>${review.review}</p>
            <div class="review-likes">👍 ${review.likes}</div>
            </div>`;

    container.appendChild(card);
  }
}

//Function to load the reviews
function loadUserReviews() {
  fetch("data/userReviews.json")
    .then((response) => response.json())
    .then((reviews) => {
      allReviews = reviews;
      currentReview = 0;
      showReview(currentReview);
    })
    .catch((error) => {
      console.error("Error loading user reviews:", error);
    });
}

//Arrows
document.getElementById("previous-rev").addEventListener("click", () => {
  if (currentReview > 0) {
    currentReview--;
    showReview(currentReview);
  }
});

document.getElementById("next-rev").addEventListener("click", () => {
  if (currentReview < allReviews.length - 1) {
    currentReview++;
    showReview(currentReview);
  }
});

//Initialize
getSpecificMovie(movieId, "movie-carousel");
getSpecificSerie(seriesId, "series-carousel");
loadUserProfile();
loadUserReviews();
