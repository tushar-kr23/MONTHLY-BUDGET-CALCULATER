"use strict";

(function () {
  const USERS_KEY = "tushar_budget_users";
  const SESSION_KEY = "tushar_budget_current_user";

  const page = document.body.dataset.authPage;
  const form = document.getElementById("authForm");
  const alertBox = document.getElementById("authAlert");

  if (!page || !form) return;

  const fields = {
    name: document.getElementById("fullName"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword")
  };

  function readUsers() {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      const users = raw ? JSON.parse(raw) : [];
      return Array.isArray(users) ? users : [];
    } catch (err) {
      console.warn("Could not read saved users.", err);
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function normalizeEmail(value) {
    return value.trim().toLowerCase();
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function hashPassword(password) {
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      const bytes = new TextEncoder().encode(password);
      const digest = await window.crypto.subtle.digest("SHA-256", bytes);
      return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    }

    return btoa(unescape(encodeURIComponent(password)));
  }

  function setActiveSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      signedInAt: new Date().toISOString()
    }));
  }

  function showAlert(message, type) {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `auth-alert auth-alert-${type}`;
    alertBox.style.display = "block";
  }

  function clearAlert() {
    if (!alertBox) return;
    alertBox.textContent = "";
    alertBox.style.display = "none";
  }

  function goToDashboard() {
    window.location.href = "index.html";
  }

  function setupPasswordToggles() {
    document.querySelectorAll("[data-password-toggle]").forEach((button) => {
      const input = document.getElementById(button.dataset.passwordToggle);
      if (!input) return;

      button.addEventListener("click", () => {
        const shouldShow = input.type === "password";
        input.type = shouldShow ? "text" : "password";
        button.textContent = shouldShow ? "Hide" : "Show";
      });
    });
  }

  async function handleRegister() {
    const name = fields.name.value.trim();
    const email = normalizeEmail(fields.email.value);
    const password = fields.password.value;
    const confirmPassword = fields.confirmPassword.value;

    if (!name || !email || !password || !confirmPassword) {
      showAlert("Please fill in every field to create your account.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showAlert("Please enter a valid email address.", "error");
      return;
    }

    if (password.length < 6) {
      showAlert("Password must be at least 6 characters long.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Passwords do not match.", "error");
      return;
    }

    const users = readUsers();
    if (users.some((user) => user.email === email)) {
      showAlert("An account with this email already exists. Please sign in.", "error");
      return;
    }

    const user = {
      id: `user-${Date.now()}`,
      name,
      email,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString()
    };

    users.push(user);
    saveUsers(users);
    setActiveSession(user);
    showAlert("Account created successfully. Opening your dashboard...", "success");
    setTimeout(goToDashboard, 700);
  }

  async function handleLogin() {
    const email = normalizeEmail(fields.email.value);
    const password = fields.password.value;

    if (!email || !password) {
      showAlert("Please enter your email and password.", "error");
      return;
    }

    const users = readUsers();
    const user = users.find((savedUser) => savedUser.email === email);
    const passwordHash = await hashPassword(password);

    if (!user || user.passwordHash !== passwordHash) {
      showAlert("Incorrect email or password.", "error");
      return;
    }

    setActiveSession(user);
    showAlert("Signed in successfully. Opening your dashboard...", "success");
    setTimeout(goToDashboard, 500);
  }

  setupPasswordToggles();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearAlert();

    if (page === "register") {
      handleRegister().catch(() => showAlert("Could not create your account. Please try again.", "error"));
    } else {
      handleLogin().catch(() => showAlert("Could not sign you in. Please try again.", "error"));
    }
  });
})();
