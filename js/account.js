const movieId = [986056, 950387, 348, 603, 157336];
const seriesId = [1399, 66732, 100088, 1402, 82856];

const editForm = document.getElementById("edit-form");
const editName = document.getElementById("edit-name");
const editFavorite = document.getElementById("edit-favorite");

const user = JSON.parse(localStorage.getItem("critix-user"));
if (!user || user.isLoggedIn !== true) {
  window.location.href = "login.html";
}

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

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("critix-user"));

  //Go to login if not logged in
  if (!user || !user.isLoggedIn) {
    window.location.href = "login.html";
    return;
  }

  //Logout buttton
  document.getElementById("logout-btn").addEventListener("click", () => {
    user.isLoggedIn = false;
    localStorage.setItem("critix-user", JSON.stringify(user));
    window.location.href = "index.html";
  });
});

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

    card.innerHTML = `<button class="delete-btn"><img src="images/icons/delete.png" alt="Delete icon"></button>
    <div class="review-user">
    <img src="images/icons/user.png" alt="User picture" />
    <span>@${username}</span>
    </div>
    <div class="review-content">
    <h3>${review.movieTitle} (${review.year})</h3>
    <p><span class="star">⭐</span><span class="rating">${review.rating}</span>/10</p>
    <p class="text">${review.review}</p>
    <div class="review-likes"><img src="images/icons/thumbsup.png" alt="Thumbs up icon"> ${review.likes}</div>
    <button class="edit-btn">Edit</button>
    <div class="review-edit-form hid">
    <input type="number" min="1" max="10" class="edit-rating" value="${review.rating}" />
    <input type="text" class="edit-text" value="${review.review}" />
    <button class="save-review-btn">Save</button>
    </div>
    </div>`;

    container.appendChild(card);

    //Edit
    const editButton = card.querySelector(".edit-btn");
    const editForm = card.querySelector(".review-edit-form");
    const saveButton = card.querySelector(".save-review-btn");

    editButton.addEventListener("click", () => {
      editForm.classList.toggle("hid");
    });

    saveButton.addEventListener("click", () => {
      const newText = card.querySelector(".edit-text").value.trim();
      const newRating = parseInt(card.querySelector(".edit-rating").value);

      if (newText && !isNaN(newRating)) {
        review.review = newText;
        review.rating = newRating;

        localStorage.setItem("critix-reviews", JSON.stringify(allReviews));
        showReview(index);
      }
    });

    //Delete
    const deleteButton = card.querySelector(".delete-btn");
    deleteButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this?")) {
        allReviews.splice(index, 1);
        localStorage.setItem("critix-reviews", JSON.stringify(allReviews));
        if (currentReview >= allReviews.length)
          currentReview = allReviews.length - 1;
        showReview(currentReview);
      }
    });
  }
}

//Function to load the reviews
function loadUserReviews() {
  const saved = localStorage.getItem("critix-reviews");
  if (saved) {
    allReviews = JSON.parse(saved);
    currentReview = 0;
    showReview(currentReview);
  } else {
    fetch("data/userReviews.json")
      .then((response) => response.json())
      .then((reviews) => {
        allReviews = reviews;
        localStorage.setItem("critix-reviews", JSON.stringify(reviews));
        currentReview = 0;
        showReview(currentReview);
      })
      .catch((error) => {
        console.error("Error loading user reviews:", error);
      });
  }
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

//Function to load and show friends from json file
function loadFriends() {
  const container = document.getElementById("friends-list");
  container.innerHTML = "";

  fetch("data/friends.json")
    .then((res) => res.json())
    .then((friends) => {
      friends.forEach((friend) => {
        const card = document.createElement("div");
        card.classList.add("friends-card");
        card.innerHTML = `<img src="${friend.picture}" alt="Friend picture" />
            <span>@${friend.username}</span>`;
        container.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("failed to load friends:", error);
    });
}

//Initialize
getSpecificMovie(movieId, "movie-carousel");
getSpecificSerie(seriesId, "series-carousel");
loadUserProfile();
loadUserReviews();
loadFriends();
