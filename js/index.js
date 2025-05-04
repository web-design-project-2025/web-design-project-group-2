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
  const items = carousel.querySelectorAll(".featured-carousel-item");
  const dots = carousel.querySelectorAll(".featured-carousel-dot");
  const rightArrow = carousel.querySelector(".featured-carousel-arrow.right");
  const leftArrow = carousel.querySelector(".featured-carousel-arrow.left");

  let featuredCurrentIndex = 0;

  function showFeaturedSlide(index) {
    const offset = -index * 100;
    inner.style.transform = `translateX(${offset}%)`;
    dots.forEach((dot) => dot.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
  }

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

  const featuredInterval = setInterval(() => {
    featuredCurrentIndex = (featuredCurrentIndex + 1) % items.length;
    showFeaturedSlide(featuredCurrentIndex);
  }, 15000);
})();
