//Check if user logged in
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("account.html")) {
    const user = JSON.parse(localStorage.getItem("critix-user"));
    if (!user || user.isLoggedIn !== true) {
      window.location.href = "login.html";
    }
  }
});
