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

//Modal
document.addEventListener("DOMContentLoaded", () => {
  const listBox = document.querySelector(".list-box");
  const modal = document.getElementById("list-modal");
  const closeModal = document.getElementById("close-modal");
  const topTierGrid = document.getElementById("top-tier-grid");

  listBox.addEventListener("click", () => {
    modal.style.display = "block";

    //Clear content
    topTierGrid.innerHTML = "";

    fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=ae0a4eba1c7e749c1ac3ccf61effa065&language=en-US&page=1`
    )
      .then((res) => res.json())
      .then((data) => {
        data.results.slice(0, 12).forEach((movie) => {
          const card = document.createElement("div");
          card.classList.add("movie-card");
          card.innerHTML = `<a href="movieDetail.html?id$[movie.id]">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.vote_average}</p>
        </a>`;
          topTierGrid.appendChild(card);
        });
      })
      .catch((err) => {
        topTierGrid.innerHTML = "<p>Failed to load `top tier movies`</p>";
        console.error(err);
      });
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  });
});
