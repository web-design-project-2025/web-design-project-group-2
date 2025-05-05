//Filters for different genres in a hanburger menu
document.addEventListener("DOMContentLoaded", () => {
  const genreEndpoints = {
    comedy: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=35&language=en-US`,
    horror: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=27&language=en-US`,
    fantasy: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=14&language=en-US`,
  };

  const hamburger = document.getElementById("hamburger-icon");
  const filterMenu = document.getElementById("filter-menu");
  const filteredContainer = document.getElementById("filtered-movies");

  //toggle the hamburger menu
  hamburger.addEventListener("click", () => {
    filterMenu.classList.toggle("visible");
  });

  //Filter buttons
  document.querySelectorAll(".filter-genre").forEach((btn) => {
    btn.addEventListener("click", () => {
      const genre = btn.getAttribute("data-genre");

      document
        .querySelectorAll(
          ".carousel-section, .tinder-section, #genre-carousels"
        )
        .forEach((section) => (section.style.display = "none"));

      filteredContainer.style.display = "grid";
      filteredContainer.innerHTML = "";

      fetchAndDisplay(genreEndpoints[genre], "filtered-movies", genre, 20);
    });
  });

  //Clear the filters
  document.getElementById("clear-filter").addEventListener("click", () => {
    document
      .querySelectorAll(".carousel-section, .tinder-section, #genre-carousels")
      .forEach((section) => (section.style.display = "block"));

    filteredContainer.style.display = "none";
    filteredContainer.innerHTML = "";

    filterMenu.classList.remove("visible");
  });

  //Search function
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();

    if (query === "") return;

    //Hide the discover sections
    document
      .querySelectorAll(".carousel-section, .tinder-section, #genre-carousels")
      .forEach((section) => (section.style.display = "none"));

    filteredContainer.style.display = "grid";
    filteredContainer.innerHTML = "";

    const searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(
      query
    )}&page=1`;

    fetch(searchUrl)
      .then((res) => res.json())
      .then((data) => {
        const results = data.results.filter(
          (item) => item.media_type === "movie" || item.media_type === "tv"
        );

        if (results.length === 0) {
          filteredContainer.innerHTML = "<p>No results found. </p>";
          return;
        }

        results.slice(0, 20).forEach((item) => {
          const card = document.createElement("div");
          card.classList.add("movie-card");
          card.innerHTML = `<a href="movieDetail.html?id=${item.id}">
              <img src="https://image.tmdb.org/t/p/w500${
                item.poster_path
              }" alt="${item.title || item.name}">
              <h3>${item.title || item.name}</h3>
              <p>⭐ ${item.vote_average || "N/A"}</p>
            </a>`;
          filteredContainer.appendChild(card);
        });
      })

      .catch((err) => {
        console.error("Search failed:", err);
        filteredContainer.innerHTML = "<p>Search failed. Try again.</p>";
      });
  });

  //Search with 'enter'
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchButton.click();
    }
  });
});
