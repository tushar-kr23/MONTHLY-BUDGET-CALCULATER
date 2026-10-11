/**
 * ==============================================================================
 * BUDGETLY — Authentication Module (auth.js)
 * Manages Registration, Login, Logout, and Auth State Guards
 * ==============================================================================
 */

import { 
  auth, 
  db, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from "./firebase-config.js";

/**
 * Translates Firebase Auth error codes into clear, friendly error messages.
 */
export function getFriendlyAuthErrorMessage(errorCode) {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email address is already registered. Please log in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/operation-not-allowed":
      return "Email/Password sign-in is not enabled in Firebase Console. Please enable it in Authentication settings.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/user-disabled":
      return "This user account has been disabled. Please contact support.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Please verify your credentials and try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Access to this account has been temporarily disabled. Please reset your password or try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    default:
      return "An unexpected error occurred. Please verify your Firebase configuration and try again.";
  }
}

/**
 * Attaches a show/hide password toggle to a password input and toggle button.
 */
export function setupPasswordToggle(inputId, buttonId) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);
  if (!input || !button) return;

  button.addEventListener("click", () => {
    const isPassword = input.getAttribute("type") === "password";
    input.setAttribute("type", isPassword ? "text" : "password");
    button.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    button.innerHTML = isPassword
      ? `<svg class="icon" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
      : `<svg class="icon" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  });
}

/**
 * Handles User Registration:
 * 1. Creates user with Firebase Auth.
 * 2. Updates user profile with displayName.
 * 3. Creates the user profile document in Firestore: users/{uid}
 * 4. Redirects to index.html.
 */
export async function registerUser({ name, email, password, submitBtn, alertBox }) {
  if (!name || !email || !password) {
    throw new Error("Please fill in all required fields.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  // Set loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Creating Account...";
  }
  if (alertBox) {
    alertBox.style.display = "none";
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Firebase Auth display name
    await updateProfile(user, {
      displayName: name.trim()
    });

    // Create user document in Firestore: users/{uid}
    await setDoc(doc(db, "users", user.uid), {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      createdAt: serverTimestamp()
    });

    // Redirect to Dashboard
    window.location.href = "index.html";
  } catch (err) {
    console.error("Registration error:", err);
    const friendlyMsg = getFriendlyAuthErrorMessage(err.code || err.message);
    if (alertBox) {
      alertBox.textContent = friendlyMsg;
      alertBox.className = "auth-alert auth-alert-error";
      alertBox.style.display = "block";
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Create Account";
    }
    throw err;
  }
}

/**
 * Handles User Login:
 * 1. Signs in user with email & password.
 * 2. Redirects to index.html.
 */
export async function loginUser({ email, password, submitBtn, alertBox }) {
  if (!email || !password) {
    throw new Error("Please enter both email and password.");
  }

  // Set loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Signing In...";
  }
  if (alertBox) {
    alertBox.style.display = "none";
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Redirect to Dashboard
    window.location.href = "index.html";
  } catch (err) {
    console.error("Login error:", err);
    const friendlyMsg = getFriendlyAuthErrorMessage(err.code || err.message);
    if (alertBox) {
      alertBox.textContent = friendlyMsg;
      alertBox.className = "auth-alert auth-alert-error";
      alertBox.style.display = "block";
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign In";
    }
    throw err;
  }
}

/**
 * Handles User Logout:
 * Signs out from Firebase and redirects to login.html.
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (err) {
    console.error("Logout error:", err);
    window.location.href = "login.html";
  }
}

/**
 * Auth State Guard for Auth Pages (login.html, register.html):
 * If the user is already authenticated, redirect them to index.html.
 */
export function checkAuthRedirectIfLoggedIn() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = "index.html";
    }
  });
}

/**
 * Auth State Guard for Dashboard (index.html):
 * 1. If user is NOT authenticated, redirect them to login.html.
 * 2. If authenticated, passes user object to the provided callback.
 */
export function requireAuth(onAuthenticatedCallback) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // Try fetching fresh name if displayName is not immediately in Auth token
    let displayName = user.displayName;
    if (!displayName) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          displayName = userSnap.data().name;
        }
      } catch (e) {
        console.warn("Could not fetch user profile document:", e);
      }
    }

    if (typeof onAuthenticatedCallback === "function") {
      onAuthenticatedCallback(user, displayName || "User");
    }
  });
}