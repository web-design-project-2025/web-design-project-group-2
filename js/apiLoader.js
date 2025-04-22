const apiKey = "ae0a4eba1c7e749c1ac3ccf61effa065";
const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    const movies = data.results;
    const container = document.getElementById("movie-container");

    movies.forEach((movie) => {
      const card = document.createElement("div");
      card.classList.add("movie-card");
      card.innerHTML = card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.vote_average}</p>
        <p>${movie.release_date}</p>
      `;
      container.appendChild(card);
    });
  })

  .catch((err) => {
    console.error("Error loading from API:", err);
    document.getElementById("movie-container").innerHTML =
      "<p>Failed to load movies. Please try again later.</p>";
  });
