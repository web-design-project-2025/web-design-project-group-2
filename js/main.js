//This function fetches 10 popular movies from TMDb and displays them in a Tinder-style card stack
//https://developer.themoviedb.org/reference/movie-popular-list
function loadMovieTinder() {
  const stack = document.getElementById("tinder-card-stack"); //This is where cards will be inserted

  //Fetches popular movies
  fetch(endpoints.popularMovies)
    .then((res) => res.json()) //Converts response to JSON
    .then((data) => {
      //Limit to 10 movies to keep the stack manageable
      data.results.slice(0, 10).forEach((movie) => {
        const card = document.createElement("div");
        card.classList.add("movie-card", "tinder"); //Reuse .movie-card styling and a custom "tinder" class

        //Use TMDb poster and movie title
        //Image source based on https://developer.themoviedb.org/docs/image-basics
        card.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
          <h3>${movie.title}</h3>
        `;
        stack.appendChild(card); //Add card to the stack
      });

      setupTinderSwipe(); //Start swipe logic after loading cards
    })
    .catch((err) => {
      console.error("Failed to load Tinder cards:", err);
    });
}

//Adds a functionality for swipe buttons that animate cards off the screen
function setupTinderSwipe() {
  const cards = document.querySelectorAll(".movie-card.tinder");
  let index = card.length - 1; //Start with the top card

  //Get the like and dislike buttons
  const likeBtn = document.getElementById("tinder-like");
  const dislikeBtn = document.getElementById("tinder-dislike");

  //Button event listeners that call swipeCard with a direction
  likeBtn.addEventListener("click", () => swipeCard("right"));
  dislikeBtn.addEventListener("click", () => swipeCard("left"));

  //Animates the top card off the stack depending on direction
  function swipeCard(direction) {
    if (index < 0) return; //No more cards left

    const card = cards[index];

    //Animate the card to swipe right or left
    //Used transform for the animation and opacity a fade-out
    card.style.transform = `translateX(${
      direction === "right" ? "300px" : "-300px"
    }) rotate(${direction === "right" ? 15 : -15}deg)`;
    card.style.opacity = 0;

    index--; //Move to the next card in the stack
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadMovieTinder();
});
