const loginForm = document.querySelector("#admin-login-form");
const emailInput = document.querySelector("#admin-email");
const passwordInput = document.querySelector("#admin-password");
const loginButton = document.querySelector("#admin-login-button");
const loginMessage = document.querySelector("#admin-login-message");

function showLoginMessage(message, state = "") {
  loginMessage.textContent = message;

  if (state) {
    loginMessage.dataset.state = state;
  } else {
    delete loginMessage.dataset.state;
  }
}

async function redirectAuthenticatedUser() {
  const {
    data: { session },
    error,
  } = await window.portfolioDb.auth.getSession();

  if (error) {
    console.error("Session check failed:", error);
    return;
  }

  if (session) {
    window.location.replace("./dashboard.html");
  }
}

async function handleAdminLogin(event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showLoginMessage("Enter both your email address and password.", "error");
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = "Signing In…";
  showLoginMessage("");

  const { error } = await window.portfolioDb.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Admin login failed:", error);

    showLoginMessage("Login failed. Check your email and password.", "error");

    loginButton.disabled = false;
    loginButton.textContent = "Sign In";
    return;
  }

  showLoginMessage("Login successful. Opening dashboard…", "success");

  window.location.replace("./dashboard.html");
}

loginForm.addEventListener("submit", handleAdminLogin);

redirectAuthenticatedUser();
