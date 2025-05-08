// --- Existing popular movies scroll setup ---
fetchAndDisplay(endpoints.popularMovies, "popular-movies", "movie", 30);

// Smooth continuous scroll with seamless looping and working buttons
let manualScroll = false;
let manualScrollTimeout;

function startAutoScroll(containerId, speed = 0.8) {
  const container = document.getElementById(containerId);

  function step() {
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (!manualScroll) {
      container.scrollLeft += speed;

      // If reached the end, reset to the start smoothly
      if (container.scrollLeft >= maxScroll) {
        container.scrollLeft = 0;
      }
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Scroll buttons: pause auto-scroll briefly when clicked
function scrollCarousel(id, direction) {
  const container = document.getElementById(id);
  const card = container.querySelector(".movie-card");

  if (!card) return;

  const cardWidth = card.offsetWidth + 16; // Adjust if your gap is different

  container.scrollBy({
    left: direction * cardWidth,
    behavior: "smooth",
  });

  // Pause auto-scroll for 2 seconds after manual interaction
  manualScroll = true;
  clearTimeout(manualScrollTimeout);
  manualScrollTimeout = setTimeout(() => {
    manualScroll = false;
  }, 2000);
}

// Start the smooth auto-scroll on the popular-movies container
startAutoScroll("popular-movies", 0.8);

// --- Featured Movie Carousel (new) ---
(function () {
  const carousel = document.querySelector(".featured-movie-carousel");
  if (!carousel) return; // safely exit if not present

  const inner = carousel.querySelector(".featured-carousel-inner");
  const dots = carousel.querySelectorAll(".featured-carousel-dot");

  // Fetch popular movies for the carousel
  fetch(endpoints.popularMovies)
    .then((res) => res.json())
    .then((data) => {
      const popularMovies = data.results.slice(0, 4); // Get 4 popular movies

      // Clear existing placeholder
      inner.innerHTML = "";

      // Array to track when all the items are loaded
      const loadPromises = [];

      // Create a carousel item for each movie
      popularMovies.forEach((movie, index) => {
        const item = document.createElement("div");
        item.className = "featured-carousel-item";

        // Create a promise for each movie that's loading
        const moviePromise = new Promise((resolve) => {
          fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=en-US`
          )
            .then((res) => res.json())
            .then((videoData) => {
              const trailer = videoData.results.find(
                (video) => video.type === "Trailer" && video.site === "YouTube"
              );

              //HTML structure for the movie item
              item.innerHTML = `
            <div class="featured-movie-box">
              <div class="featured-trailer-container">
                ${
                  trailer
                    ? `<iframe src="https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&loop=1&playlist=${trailer.key}&controls=0" frameborder="0" allowfullscreen></iframe>`
                    : `<div class="no-trailer-placeholder"></div>`
                }
              </div>
              <div class="featured-poster-overlay">
                <img src="https://image.tmdb.org/t/p/w500${
                  movie.poster_path
                }" alt="Poster for ${movie.title}" loading="lazy" />
              </div>
              <div class="featured-title-overlay">
                <h2>${movie.title}</h2>
                <p>⭐ ${movie.vote_average.toFixed(1)}</p>
              </div>
            </div>

            <div class="featured-review-box">
              <!-- Header with user image, movie title, and rating -->
              <div class="featured-review-header">
                <img src="images/icons/user.png" alt="Reviewer" loading="lazy" />
                <div>
                  <div class="featured-movie-title">${movie.title}</div>
                  <div class="featured-movie-rating">⭐ ${movie.vote_average.toFixed(
                    1
                  )}</div>
                  <div class="featured-review-username">Username</div> <!-- Replace with dynamic username -->
                </div>
              </div>

              <!-- Movie review text -->
              <div class="featured-review-text">
                ${movie.overview.substring(0, 100)}...
              </div>

            
            </div>
            `;

              inner.appendChild(item);

              resolve();
            })
            .catch((err) => {
              console.error("Error fetching video data:", err);
              resolve(); // Resolve even if there's an error
            });
        });

        loadPromises.push(moviePromise);
      });

      // Initialize carousel when all items are loaded
      Promise.all(loadPromises).then(() => {
        initCarousel();
      });
    })
    .catch((err) => {
      console.error("Error loading popular movies:", err);
    });

  // Initialize the carousel after items are loaded
  function initCarousel() {
    const items = document.querySelectorAll(".featured-carousel-item");
    const rightArrow = document.querySelector(".featured-carousel-arrow.right");
    const leftArrow = document.querySelector(".featured-carousel-arrow.left");

    if (items.length === 0) return; // Safety

    let featuredCurrentIndex = 0;

    function showFeaturedSlide(index) {
      const offset = -index * 100;
      inner.style.transform = `translateX(${offset}%)`;
      dots.forEach((dot) => dot.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    }

    // Initialize first slide
    showFeaturedSlide(0);

    // Arrow functionality
    if (rightArrow) {
      rightArrow.addEventListener("click", () => {
        featuredCurrentIndex = (featuredCurrentIndex + 1) % items.length;
        showFeaturedSlide(featuredCurrentIndex);
      });
    }

    if (leftArrow) {
      leftArrow.addEventListener("click", () => {
        featuredCurrentIndex =
          (featuredCurrentIndex - 1 + items.length) % items.length;
        showFeaturedSlide(featuredCurrentIndex);
      });
    }

    // Auto-slide functionality
    const featuredInterval = setInterval(() => {
      featuredCurrentIndex = (featuredCurrentIndex + 1) % items.length;
      showFeaturedSlide(featuredCurrentIndex);
    }, 15000);
  }
})();
