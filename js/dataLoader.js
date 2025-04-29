//JSON data loader
//Working on it

fetch("data/reviews.json")
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById("movie-container");

    data.forEach((movie) => {
      const card = document.createElement("div");
      card.classList.add("movie-card");
      card.innerHTML = `
        <img src="assets/${movie.poster}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>${movie.genre}</p>
        <p>⭐ ${movie.rating}</p>
      `;
      container.appendChild(card);
    });
  })
  .catch((error) => {
    console.error("Failed to load JSON:", error);
    document.getElementById(
      "movie-container"
    ).innerHTML = `<p>Oops! Couldn't load local data.</p>`;
  });
