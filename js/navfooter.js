document.addEventListener("DOMContentLoaded", () => {
  // Load Navbar
  fetch("navbar.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;
    })
    .catch((err) => console.error("Navbar load error:", err));

  // Load Footer
  fetch("footer.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
    })
    .catch((err) => console.error("Footer load error:", err));
});
