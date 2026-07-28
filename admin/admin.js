/**
 * Admin Login Page Entry Point
 */
import { checkAdminSession, handleAdminLogin } from "./scripts/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#admin-login-form");
  const emailInput = document.querySelector("#admin-email");
  const passwordInput = document.querySelector("#admin-password");
  const loginButton = document.querySelector("#admin-login-button");
  const loginMessage = document.querySelector("#admin-login-message");

  function showLoginMessage(message, state = "") {
    if (!loginMessage) return;
    loginMessage.textContent = message;
    if (state) {
      loginMessage.dataset.state = state;
    } else {
      delete loginMessage.dataset.state;
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = emailInput?.value.trim();
      const password = passwordInput?.value;

      if (!email || !password) {
        showLoginMessage("Enter both your email address and password.", "error");
        return;
      }

      if (loginButton) {
        loginButton.disabled = true;
        loginButton.textContent = "Signing In…";
      }
      showLoginMessage("");

      try {
        await handleAdminLogin(email, password);
        showLoginMessage("Login successful. Opening dashboard…", "success");
        window.location.replace("./dashboard.html");
      } catch (error) {
        console.error("Admin login failed:", error);
        showLoginMessage("Login failed. Check your email and password.", "error");
        if (loginButton) {
          loginButton.disabled = false;
          loginButton.textContent = "Sign In";
        }
      }
    });
  }

  checkAdminSession(false, true);
});
