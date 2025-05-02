document.addEventListener("DOMContentLoaded", () => {
  const genreEndpoints = {
    comedy: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=35&language=en-US`,
    horror: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=27&language=en-US`,
    fantasy: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=14&language=en-US`,
  };

  const hamburger = document.getElementById("hamburger-icon");
  const filterMenu = document.getElementById("filter-menu");
  const filteredContainer = document.getElementById("filtered-movies");

  hamburger.addEventListener("click", () => {
    filterMenu.classList.toggle("visible");
  });

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

  //Clear filters
  document.getElementById("clear-filter").addEventListener("click", () => {
    document
      .querySelectorAll(".carousel-section, .tinder-section, #genre-carousels")
      .forEach((section) => (section.style.display = "block"));

    filteredContainer.style.display = "none";
    filteredContainer.innerHTML = "";

    filterMenu.classList.remove("visible");
  });
});
