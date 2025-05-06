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

  //Save info to localStorage
  const user = { name, username, email, password };
  localStorage.setItem("critix-user", JSON.stringify(user));

  //Redirect or show the success
  alert("Account created! Please log in.");
  window.location.href = "login.html";
}

//Function for the log in validation
function login() {
  const enteredUser = document.getElementById("login-username").value.trim();
  const eneteredPass = document.getElementById("login-password").value;

  const savedUser = JSON.parse(localStorage.getItem("critix-user"));

  if (!savedUser) {
    showError("login-error", "No account found. Please create one.");
    return;
  }

  if (
    (enteredUser === savedUser.username || eneteredUser === savedUser.email) &&
    eneteredPass === savedUser.password
  ) {
    alert("Logged in successfully!");
    window.location.href = "account.html";
  } else {
    showError("login-error", "Invalid info.");
  }
}

//Function to show error
function showError(id, message) {
  document.getElementById(id).textContent = message;
}
