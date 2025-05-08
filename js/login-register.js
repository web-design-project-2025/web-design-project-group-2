//Function to register new user
function register() {
  const name = document.getElementById("name").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (!name || !username || !email || !password) {
    showError("signup-error", "All fields are required.");
    return;
  }

  if (password !== confirmPassword) {
    showError("signup-error", "Passwords don't match.");
    return;
  }

  //Check if username or email exist
  const existingUser = JSON.parse(localStorage.getItem("critix-user"));
  if (
    existingUser &&
    (existingUser.username === username || existingUser.email === email)
  ) {
    showError("signup-error", "Username or email already exist");
    return;
  }

  //Create a new user object with the login
  const user = {
    name,
    username,
    email,
    password,
    isLoggedIn: true,
    editFavorite: "",
    joinDate: new Date().toISOString(),
  };

  //Save to localStorage
  localStorage.setItem("critix-user", JSON.stringify(user));

  //Go to account
  alert("Account created successfully");
  window.location.href = "account.html";
}

//Function for the log in validation
function login() {
  const enteredUser = document.getElementById("login-username").value.trim();
  const enteredPass = document.getElementById("login-password").value;

  const savedUser = JSON.parse(localStorage.getItem("critix-user"));

  if (!savedUser) {
    showError("login-error", "No account found. Please create one.");
    return;
  }

  //Validate
  const usernameMatch = enteredUser === savedUser.username;
  const emailMatch = enteredUser === savedUser.email;
  const passwordMatch = enteredPass === savedUser.password;

  //Update login and save
  if ((usernameMatch || emailMatch) && passwordMatch) {
    savedUser.isLoggedIn = true;
    localStorage.setItem("critix-user", JSON.stringify(savedUser));

    //Go to login page
    alert("Logged in");
    window.location.href = "account.html";
  } else {
    showError("login-error", "Wrong username/email or password");
  }
}

function checkLogin() {
  const user = JSON.parse(localStorage.getItem("critix-user"));
  return user && user.isLoggedIn;
}

//Function to show error
function showError(elementId, message) {
  const errorEl = document.getElementById(elementId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = "block";

    //Hide error msg after 5 seconds
    setTimeout(() => {
      errorEl.style.display = "none";
    }, 5000);
  }
}

//Initialize login status checker
document.addEventListener("DOMContentLoaded", function () {
  //If the login page and already logged in, go to account
  if (
    window.location.pathname.includes("login.html") ||
    window.location.pathname.includes("register.html")
  ) {
    if (checkLogin()) {
      window.location.href = "account.html";
    }
  }
});
