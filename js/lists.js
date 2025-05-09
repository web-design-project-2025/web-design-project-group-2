document.addEventListener("DOMContentLoaded", () => {
  const watchLaterGrid = document.getElementById("watch-later-grid");
  const watchLaterList = JSON.parse(localStorage.getItem("watchLater")) || [];

  if (watchLaterList.length === 0) {
    watchLaterGrid.innerHTML = "<p>No movies added yet.</p>";
    return;
  }

  watchLaterList.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.innerHTML = `<a href="movieDetail.html?id=${movie.id}">
        <img src="${movie.poster}" alt="${movie.title}"/>
        <h3>${movie.title}</h3>
        </a>`;
    watchLaterGrid.appendChild(card);
  });
});
