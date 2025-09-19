function home() {
  window.location.href = "index.html";
}

// Show notification card 
function showNotification(message, type = "error") {
  const notification = document.createElement("div");
  notification.className = `notify ${type}`;
  notification.textContent = message;

  document.getElementById("notification").appendChild(notification);

  setTimeout(() => {
    notification.classList.add("hide");
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  const navAuthBtn = document.getElementById("navAuthBtn");
  const authBox = document.getElementById("authBox");
  const authTitle = document.getElementById("authTitle");

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  let isLoggedIn = !!localStorage.getItem("currentUser");

  // Switch Forms
  window.showSignup = function () {
    authTitle.textContent = "Sign Up";
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
  };

  window.showLogin = function () {
    authTitle.textContent = "Login";
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  };

  // Signup
  window.signup = function () {
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const signupBtn = document.getElementById("signupBtn");

    if (name && email && password) {
      signupBtn.innerHTML = `<div class="loader"></div>`;
      signupBtn.disabled = true;

      setTimeout(() => {
        localStorage.setItem("user", JSON.stringify({ name, email, password }));
        showNotification("✅ Account created! Please login.", "success");
        showLogin();
        signupBtn.innerHTML = "Create Account";
        signupBtn.disabled = false;
      }, 1500);
    } else {
      showNotification("⚠️ Please fill all fields.");
    }
  };

  // Login
  window.login = function () {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const user = JSON.parse(localStorage.getItem("user"));
    const loginBtn = document.getElementById("loginBtn");

    loginBtn.innerHTML = `<div class="loader"></div>`;
    loginBtn.disabled = true;

    setTimeout(() => {
      if (user && user.email === email && user.password === password) {
        isLoggedIn = true;
        localStorage.setItem("currentUser", email);
        authBox.classList.add("hidden");
        navAuthBtn.textContent = "Logout";
        window.location.href = "game.html";
      } else {
        showNotification("❌ Invalid email or password.");
      }
      loginBtn.innerHTML = "Login";
      loginBtn.disabled = false;
    }, 1200);
  };

  // Logout
  window.logout = function () {
    isLoggedIn = false;
    localStorage.removeItem("currentUser");
    authBox.classList.remove("hidden");
    showLogin();
    navAuthBtn.textContent = "Login";
  };

  // Navbar Auth Toggle
  navAuthBtn.addEventListener("click", () => {
    if (isLoggedIn) {
      logout();
    } else {
      authBox.classList.toggle("hidden");
    }
  });
});
