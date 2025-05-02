document.addEventListener("DOMContentLoaded", () => {
  // Starfield Animation
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  const stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.5 + 0.5,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
  }));

  function animateStars() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#00ffff";
    stars.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      s.x += s.dx;
      s.y += s.dy;
      if (s.x < 0 || s.x > w) s.dx *= -1;
      if (s.y < 0 || s.y > h) s.dy *= -1;
    });
    requestAnimationFrame(animateStars);
  }
  animateStars();

  // Particle Effects
  function createParticles() {
    const particleCount = 30;
    const particlesContainer = document.getElementById("particles");
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${5 + Math.random() * 5}s`;
      particle.style.width =
        particle.style.height = `${2 + Math.random() * 2}px`;
      particlesContainer.appendChild(particle);
    }
  }
  createParticles();

  // Form Switching
  document.querySelectorAll(".form-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".form-toggle")
        .forEach((b) => b.classList.remove("active"));
      document
        .querySelectorAll(".auth-form")
        .forEach((f) => f.classList.remove("active"));
      btn.classList.add("active");
      document
        .getElementById(`${btn.dataset.form}Form`)
        .classList.add("active");
    });
  });

  // Form Validation
  function validateForm(form, callback) {
    let valid = true;
    const inputs = form.querySelectorAll("input");
    inputs.forEach((input) => {
      const parent = input.parentElement;
      const error = parent.querySelector(".error-message");
      const value = input.value.trim();
      if (input.type === "text" || input.type === "email") {
        if (!value) {
          parent.classList.add("error");
          error.textContent = "This field is required";
          error.style.display = "block";
          valid = false;
        } else if (
          input.type === "email" &&
          !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)
        ) {
          parent.classList.add("error");
          error.textContent = "Valid email required";
          error.style.display = "block";
          valid = false;
        } else {
          parent.classList.remove("error");
          error.style.display = "none";
        }
      }
      if (input.type === "password") {
        const confirmPassword =
          input.id === "regPassword"
            ? document.getElementById("regConfirmPassword")
            : null;
        if (value.length < 6) {
          parent.classList.add("error");
          error.textContent = "Password must be at least 6 characters";
          error.style.display = "block";
          valid = false;
        } else if (confirmPassword && value !== confirmPassword.value) {
          parent.classList.add("error");
          error.textContent = "Passwords do not match";
          error.style.display = "block";
          valid = false;
        } else {
          parent.classList.remove("error");
          error.style.display = "none";
        }
      }
    });
    if (valid) callback();
  }

  // Login Handler
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    validateForm(this, () => {
      const users = JSON.parse(localStorage.getItem("users")) || {};
      if (!users[username] || users[username].password !== password) {
        const usernameGroup =
          document.getElementById("loginUsername").parentElement;
        const passwordGroup =
          document.getElementById("loginPassword").parentElement;
        usernameGroup.classList.add("error");
        passwordGroup.classList.add("error");
        usernameGroup.querySelector(".error-message").textContent =
          "Invalid username";
        passwordGroup.querySelector(".error-message").textContent =
          "Invalid password";
        usernameGroup.querySelector(".error-message").style.display = "block";
        passwordGroup.querySelector(".error-message").style.display = "block";
        this.style.animation = "shake 0.5s ease";
        setTimeout(() => (this.style.animation = ""), 500);
        return;
      }
      localStorage.setItem("loggedInUser", username);
      alert("Login successful!");
      window.location.href = "dashboard.html";
    });
  });

  // Registration Handler
  document
    .getElementById("registerForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("regUsername").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      validateForm(this, () => {
        const users = JSON.parse(localStorage.getItem("users")) || {};
        if (users[username]) {
          const usernameGroup =
            document.getElementById("regUsername").parentElement;
          usernameGroup.classList.add("error");
          usernameGroup.querySelector(".error-message").textContent =
            "Username already exists";
          usernameGroup.querySelector(".error-message").style.display = "block";
          this.style.animation = "shake 0.5s ease";
          setTimeout(() => (this.style.animation = ""), 500);
          return;
        }
        users[username] = {
          email: email,
          password: document.getElementById("regPassword").value.trim(),
        };
        localStorage.setItem("users", JSON.stringify(users));
        alert("Registration successful! You can now log in.");
        document.querySelectorAll(".form-toggle")[0].click();
      });
    });

  // Add CSS animation for shaking
  const styleSheet = document.styleSheets[0];
  try {
    styleSheet.insertRule(
      `
      @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        50% { transform: translateX(10px); }
        75% { transform: translateX(-10px); }
        100% { transform: translateX(0); }
      }
    `,
      styleSheet.cssRules.length,
    );
  } catch (e) {
    console.warn("Could not insert shake animation:", e);
  }

  // Dynamic Card Tilt Effect
  const cardContainer = document.querySelector(".card-container");
  const card = document.querySelector(".card");

  if (cardContainer && card) {
    cardContainer.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((e.offsetY - centerY) / centerY) * -5;
      const rotateY = ((e.offsetX - centerX) / centerX) * 5;
      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.02, 1.02, 1.02)
      `;
    });

    cardContainer.addEventListener("mouseleave", () => {
      card.style.transform = `
        perspective(1000px)
        rotateX(0deg)
        rotateY(0deg)
        scale3d(1, 1, 1)
      `;
    });
  }

  // Theme Toggle Logic
  const themeBtn = document.querySelector(".theme-toggle-btn");
  const themeDropdown = document.querySelector(".theme-dropdown");
  const themeOptions = document.querySelectorAll(".theme-option");
  const themeReveal = document.querySelector(".theme-reveal");
  const themeBlur = document.querySelector(".theme-reveal-blur");

  // Theme list
  const allThemes = ["dark", "neon", "cinema", "vibrant", "retro", "pastel"];

  // Load saved theme
  const savedTheme = localStorage.getItem("siteTheme") || "dark";
  const savedIcon = localStorage.getItem("themeIcon") || "moon";

  const moonIcon = document.querySelector(".moon-icon");
  const sunIcon = document.querySelector(".sun-icon");

  // Apply saved theme
  if (savedTheme !== "dark") {
    document.documentElement.classList.add(`theme-${savedTheme}`);
  }

  // Update icon
  if (savedIcon === "sun") {
    moonIcon.style.display = "none";
    sunIcon.style.display = "inline";
  } else {
    moonIcon.style.display = "inline";
    sunIcon.style.display = "none";
  }

  // Sound toggle (mobile policy)
  let soundEnabled = false;
  document.body.addEventListener("click", () => {
    soundEnabled = true;
  });

  // Play theme sound
  function playThemeSound() {
    const sound = document.getElementById("theme-sound");
    if (sound && soundEnabled) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  }

  // Update reveal color dynamically
  function updateRevealColor() {
    const rootStyles = getComputedStyle(document.documentElement);
    const glowColor = rootStyles.getPropertyValue("--glow-color").trim();
    if (themeReveal) {
      themeReveal.style.background = `radial-gradient(circle, ${glowColor} 30%, transparent 31%)`;
    }
  }

  // Apply theme with delay
  function applyTheme(theme) {
    // Remove old theme classes
    allThemes.forEach((t) => {
      document.documentElement.classList.remove(`theme-${t}`);
    });

    // Apply new theme
    if (theme !== "dark") {
      document.documentElement.classList.add(`theme-${theme}`);
    }
  }
  // Theme Option Click
  themeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const theme = option.dataset.theme;
      playThemeSound();

      // Set initial state
      themeReveal.style.clipPath = "circle(0% at 50% 50%)";
      themeReveal.style.opacity = "1";

      // Trigger animation
      setTimeout(() => {
        themeReveal.style.clipPath = "circle(150% at 50% 50%)";
      }, 50);

      // Apply theme after animation ends
      setTimeout(() => {
        applyTheme(theme);
        // Reset animation
        themeReveal.style.opacity = "0";
        themeReveal.style.clipPath = "circle(0% at 50% 50%)";
        themeBlur.style.opacity = "0";
      }, 1000);
      themeBlur.style.opacity = "0.3";
      setTimeout(() => {
        themeBlur.style.opacity = "0";
      }, 1000);
      // Save theme
      localStorage.setItem("siteTheme", theme);
      if (theme === "pastel" || theme === "cinema") {
        localStorage.setItem("themeIcon", "sun");
        moonIcon.style.display = "none";
        sunIcon.style.display = "inline";
      } else {
        localStorage.setItem("themeIcon", "moon");
        moonIcon.style.display = "inline";
        sunIcon.style.display = "none";
      }

      themeDropdown.classList.remove("active");
    });
  });

  // Dropdown Toggle
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      themeDropdown.classList.toggle("active");
    });
  }

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    if (!themeDropdown.contains(e.target) && !themeBtn.contains(e.target)) {
      themeDropdown.classList.remove("active");
    }
  });
});
