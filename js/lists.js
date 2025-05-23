document.addEventListener("DOMContentLoaded", () => {
  //Check if the user is logged in, if not go to login.html
  const user = JSON.parse(localStorage.getItem("critix-user"));
  if (!user || user.isLoggedIn !== true) {
    window.location = "login.html";
  }

  //Watch later
  const watchLaterGrid = document.getElementById("watch-later-grid");
  const watchLaterList = JSON.parse(localStorage.getItem("watchLater")) || [];

  if (watchLaterList.length === 0) {
    watchLaterGrid.innerHTML = "<p>No movies added yet.</p>";
  } else {
    watchLaterList.forEach((movie) => {
      const card = document.createElement("div");
      card.classList.add("movie-card");
      card.innerHTML = `<a href="movieDetail.html?id=${movie.id}">
          <img src="${movie.poster}" alt="${movie.title}"/>
          <h3>${movie.title}</h3>
          </a>`;
      watchLaterGrid.appendChild(card);
    });
  }

  //Modal
  const modal = document.getElementById("list-modal");
  const closeModal = document.getElementById("close-modal");
  const modalTitle = document.getElementById("modal-title");
  const deleteBtn = document.getElementById("delete-list-btn");
  const modalGrid = modal.querySelector(".movie-grid");

  function openModal(title, movies = [], listIndex = null) {
    modal.style.display = "block";
    modalTitle.textContent = title;
    modalGrid.innerHTML = "";

    //Edit list name only on the user created lists
    if (listIndex !== null) {
      modalTitle.contentEditable = true;
      modalTitle.spellcheck = false;
      modalTitle.style.cursor = "text";
      deleteBtn.style.display = "inline-block";

      modalTitle.onblur = () => {
        const newName = modalTitle.textContent.trim() || "Untitled List";
        userLists[listIndex].name = newName;
        localStorage.setItem("userLists", JSON.stringify(userLists));
        renderUserLists();
      };

      deleteBtn.onclick = () => {
        if (confirm(`Do you want to delete this list?`)) {
          userLists.splice(listIndex, 1);
          localStorage.setItem("userLists", JSON.stringify(userLists));
          modal.style.display = "none";
          renderUserLists();
        }
      };
    } else {
      modalTitle.contentEditable = false;
      modalTitle.style.cursor = "default";
      modalTitle.onblur = null;
      deleteBtn.style.display = "none";
    }

    if (movies.length > 0) {
      movies.forEach((movie) => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `<a href="movieDetail.html?id=${movie.id}">
        <img src="${movie.poster}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        </a>`;
        modalGrid.appendChild(card);
      });
    } else {
      modalGrid.innerHTML = "<p>No movies added to this list yet.</p>";
    }
  }

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  });

  //"Top tier movies" list as example of how lists works and looks like
  const listBox = document.querySelector(`.list-box[data-list="top-tier"]`);
  listBox.addEventListener("click", () => {
    openModal("Top Tier Movies");

    fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=ae0a4eba1c7e749c1ac3ccf61effa065&language=en-US&page=1`
    )
      .then((res) => res.json())
      .then((data) => {
        //Clear
        modalGrid.innerHTML = "";
        data.results.slice(0, 12).forEach((movie) => {
          const card = document.createElement("div");
          card.classList.add("movie-card");
          card.innerHTML = `<a href="movieDetail.html?id${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.vote_average}</p>
        </a>`;
          modalGrid.appendChild(card);
        });
      })
      .catch((err) => {
        modalGrid.innerHTML = "<p>Failed to load `top tier movies`</p>";
        console.error(err);
      });
  });

  //Create button for users to create lists
  const createBtn = document.getElementById("create-list-btn");
  const userListscontainer = document.getElementById("users-lists");

  let userLists = JSON.parse(localStorage.getItem("userLists")) || [];

  function renderUserLists() {
    userListscontainer
      .querySelectorAll(".list-box.user-list")
      .forEach((el) => el.remove());

    userLists.forEach((list, index) => {
      const box = document.createElement("div");
      box.classList.add("list-box", "user-list");
      box.dataset.index = index;

      const title = document.createElement("h3");
      title.textContent = list.name;
      title.contentEditable = true;
      title.spellcheck = false;
      title.addEventListener("blur", () => {
        userLists[index].name = title.textContent.trim() || "Untitled list";
        localStorage.setItem("userLists", JSON.stringify(userLists));
        renderUserLists();
      });

      box.appendChild(title);
      box.addEventListener("click", () => {
        openModal(list.name, list.movies, index);
      });

      userListscontainer.appendChild(box);
    });
  }

  createBtn.addEventListener("click", () => {
    const newList = {
      name: "Untitled List",
      movies: [],
    };
    userLists.push(newList);
    localStorage.setItem("userLists", JSON.stringify(userLists));
    renderUserLists();
  });

  renderUserLists();
});
