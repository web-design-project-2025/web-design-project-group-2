document.addEventListener("DOMContentLoaded", () => {
  // Load Navbar
  fetch("navbar.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;

      //Load auth.js after navbar
      const authScript = document.createElement("script");
      authScript.src = "js/sessionCheck.js";
      document.body.appendChild(authScript);
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
