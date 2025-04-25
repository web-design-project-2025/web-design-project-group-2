const tinderStack = document.getElementById("tinder-card-stack");
let tinderMovies = [];
let currentTinderIndex = 0;
let watchLater = [];

//Fetch movies for Tinder
fetch(endpoints.popularMovies)
  .then((res) => res.json())
  .then((data) => {
    tinderMovies = data.results.slice(0, 10); // Pick first 10 movies
    showNextTinderCard();
  });

//Show next movie in stack
function showNextTinderCard() {
  tinderStack.innerHTML = ""; //Clear the current card

  if (currentTinderIndex >= tinderMovies.length) {
    tinderStack.innerHTML = "<p>No more movies!</p>";
    return;
  }

  const movie = tinderMovies[currentTinderIndex];
  const card = document.createElement("div");
  card.classList.add("movie-card", "tinder");

  card.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    <h3>${movie.title}</h3>
  `;

  tinderStack.appendChild(card);
}

//Liked button
document.getElementById("tinder-like").addEventListener("click", () => {
  const likedMovie = tinderMovies[currentTinderIndex];
  watchLater.push(likedMovie);
  showPopup("Added to watchlist!");
  currentTinderIndex++;
  showNextTinderCard();
});

//Dislike button
document.getElementById("tinder-dislike").addEventListener("click", () => {
  currentTinderIndex++;
  showNextTinderCard();
});

//Show pop up

function showPopup(message) {
  const popup = document.createElement("div");
  popup.classList.add("popup-message");
  popup.textContent = message;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 1500);
}
