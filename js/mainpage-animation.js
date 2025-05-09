document.addEventListener("DOMContentLoaded", () => {
  const fadeSections = document.querySelectorAll(".fade-in-section");

  console.log("Number of fade sections:", fadeSections.length);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("Fading in:", entry.target);
          entry.target.classList.add("visible");
        } else {
          console.log("Fading OUT:", entry.target);
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  fadeSections.forEach((section) => {
    observer.observe(section);
  });
});
