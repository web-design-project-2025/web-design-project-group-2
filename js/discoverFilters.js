//Filters for different genres in a hanburger menu
document.addEventListener("DOMContentLoaded", () => {
  const genreEndpoints = {
    comedy: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=35&language=en-US`,
    horror: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=27&language=en-US`,
    action: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=28&language=en-US`,
    fantasy: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=14&language=en-US`,
    drama: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=18&language=en-US`,
    romance: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=10749&language=en-US`,
  };

  const hamburger = document.getElementById("hamburger-icon");
  const filterMenu = document.getElementById("filter-menu");
  const filterContainer = document.getElementById("filtered-movies");

  //toggle the hamburger menu when clicked
  hamburger.addEventListener("click", () => {
    filterMenu.classList.toggle("visible");
  });

  //Filter buttons
  document.querySelectorAll(".filter-genre").forEach((btn) => {
    btn.addEventListener("click", () => {
      const genre = btn.getAttribute("data-genre");

      //Hide the sections and show the filtered section
      document
        .querySelectorAll(
          ".carousel-section, .tinder-section, #genre-carousels"
        )
        .forEach((section) => (section.style.display = "none"));

      filterContainer.style.display = "grid";
      filterContainer.innerHTML = "";

      fetchAndDisplay(genreEndpoints[genre], "filtered-movies", genre, 20);
    });
  });

  //Clear the filters
  document.getElementById("clear-filter").addEventListener("click", () => {
    document
      .querySelectorAll(".carousel-section, .tinder-section, #genre-carousels")
      .forEach((section) => (section.style.display = "block"));

    filterContainer.style.display = "none";
    filterContainer.innerHTML = "";

    filterMenu.classList.remove("visible");
  });

  //Search function
  const searchBar = document.getElementById("search-bar");
  const searchButton = document.getElementById("search-button");

  searchButton.addEventListener("click", () => {
    const query = searchBar.value.trim();

    if (query === "") return;

    //Hide the discover sections
    document
      .querySelectorAll(".carousel-section, .tinder-section, #genre-carousels")
      .forEach((section) => (section.style.display = "none"));

    filterContainer.style.display = "grid";
    filterContainer.innerHTML = "";

    //Search url for TMDB API
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
          filterContainer.innerHTML = "<p>No results found. </p>";
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
          filterContainer.appendChild(card);
        });
      })

      .catch((err) => {
        console.error("Search failed:", err);
        filterContainer.innerHTML = "<p>Search failed. Try again.</p>";
      });
  });

  //Search with 'enter'
  searchBar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchButton.click();
    }
  });
});
