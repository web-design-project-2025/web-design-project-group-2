//Tinder stack container and arrays
const tinderStack = document.getElementById("tinder-card-stack");
let tinderMovies = [];
let currentTinderIndex = 0;
let watchLater = [];

//Get the popular movies from the API and load 20
fetch(endpoints.popularMovies)
  .then((res) => res.json())
  .then((data) => {
    tinderMovies = data.results.slice(0, 20);
    showNextTinderCard();
  });

//Function to show the next movie card after the card before disapears
function showNextTinderCard() {
  tinderStack.innerHTML = "";

  //When all the 20 movies are shown, show a message
  if (currentTinderIndex >= tinderMovies.length) {
    tinderStack.innerHTML = "<p>No more movies!</p>";
    return;
  }

  const movie = tinderMovies[currentTinderIndex];
  const card = document.createElement("div");
  card.classList.add("movie-card", "tinder");

  //The cards content
  card.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    <h3>${movie.title}</h3>
  `;

  //When the movie card is clicked, open the modal that shows more info
  card.addEventListener("click", () => {
    openModal(movie);
  });

  tinderStack.appendChild(card);
}

//Liked button
document.getElementById("tinder-like").addEventListener("click", () => {
  const card = document.querySelector(".movie-card.tinder");
  if (!card) return;

  //Animation of swipe
  card.style.transform = "translateX(500px) rotate(20deg)";
  card.style.opacity = "0";

  //After the animation, add movie to watchlist, show next card
  setTimeout(() => {
    const likedMovie = tinderMovies[currentTinderIndex];
    watchLater.push(likedMovie);
    showPopup("Added to watchlist!");
    currentTinderIndex++;
    showNextTinderCard();
  }, 400);
});

//Dislike button
document.getElementById("tinder-dislike").addEventListener("click", () => {
  const card = document.querySelector(".movie-card.tinder");
  if (!card) return;

  //Animation of swipe
  card.style.transform = "translateX(-500px) rotate(-20deg)";
  card.style.opacity = "0";

  //After the animation, show next card
  setTimeout(() => {
    currentTinderIndex++;
    showNextTinderCard();
  }, 400);
});

//Function to show pop up message
function showPopup(message) {
  const popup = document.createElement("div");
  popup.classList.add("popup-message");
  popup.textContent = message;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 1500);
}

//Function to open modal with movie info
function openModal(movie) {
  const modal = document.getElementById("movie-modal");
  const title = document.getElementById("modal-title");
  const description = document.getElementById("modal-description");
  const rating = document.getElementById("modal-rating");
  const trailerIframe = document.getElementById("trailer-iframe");

  //Movie info
  title.textContent = movie.title;
  description.textContent = movie.overview || "No description available.";
  rating.textContent = `⭐ ${movie.vote_average}`;

  //Movie trailer
  fetch(
    `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailer) {
        trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}`;
      } else {
        trailerIframe.src = "";
      }
    });

  modal.classList.remove("hidden");

  //CLose modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      trailerIframe.src = "";
    }
  });
}
