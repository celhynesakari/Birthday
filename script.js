const password = "050725";
const reasons = Array.from({ length: 100 }, (_, i) => `Reason ${i + 1}: Your smile makes my whole world softer and brighter.`);
const reasonGrid = document.getElementById("reasonsGrid");
const passwordScreen = document.getElementById("passwordScreen");
const loadingScreen = document.getElementById("loadingScreen");
const appShell = document.getElementById("appShell");
const digitInputs = Array.from(document.querySelectorAll(".digit-box"));
const enterBtn = document.getElementById("enterBtn");
let failedAttempts = 0;
const passwordMessage = document.getElementById("passwordMessage");
const themeToggle = document.getElementById("themeToggle");
const musicToggle = document.getElementById("musicToggle");
const confettiBtn = document.getElementById("confettiBtn");
const finalHeartBtn = document.getElementById("finalHeartBtn");
const easterMessage = document.getElementById("easterMessage");
const letterButtons = document.querySelectorAll(".letter-card");
const letterModal = document.getElementById("letterModal");
const closeLetter = document.getElementById("closeLetter");
const lightbox = document.getElementById("lightbox");
const closeLightbox = document.getElementById("closeLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const gameBoard = document.getElementById("gameBoard");
const gameStatus = document.getElementById("gameStatus");
const countdownEls = {
  years: document.getElementById("years"),
  months: document.getElementById("months"),
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};
const countdownText = document.getElementById("countdownText");
const backgroundPicker = document.getElementById("backgroundPicker");
const buttonSound = document.getElementById("buttonSound");
const lockedSections = document.querySelectorAll(".locked-section");
const lockedNavLinks = document.querySelectorAll(".locked-link");
const unlockSection = document.getElementById("unlock-countdown");
const unlockEls = {
  days: document.getElementById("unlockDays"),
  hours: document.getElementById("unlockHours"),
  minutes: document.getElementById("unlockMinutes"),
  seconds: document.getElementById("unlockSeconds")
};
const CONTENT_UNLOCK_DATE = new Date("2026-11-13T00:00:00");
const EARLY_ACCESS_CODE = "131126";
const earlyAccessInput = document.getElementById("earlyAccessInput");
const earlyAccessBtn = document.getElementById("earlyAccessBtn");
const earlyAccessMessage = document.getElementById("earlyAccessMessage");
let earlyAccessGranted = false;
const backgroundPresets = {
  Default: "background.jpg",
  YourWP: "bg 1.jpg",
  MyWP: "My WP.jpg"
};

function renderReasons() {
  reasons.forEach((reason) => {
    const chip = document.createElement("div");
    chip.className = "reason-chip glass";
    chip.textContent = reason;
    reasonGrid.appendChild(chip);
  });
}

const BUTTON_SOUND_VOLUME = 0.35;

function playButtonSound() {
  if (!buttonSound) return;
  buttonSound.currentTime = 0;
  buttonSound.volume = BUTTON_SOUND_VOLUME;
  buttonSound.play().catch((error) => {
    console.warn("Button sound was blocked:", error);
  });
}

function setupButtonSounds() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(
      "button, .btn, .nav-pill a, .letter-card, .memory-card"
    );
    if (trigger) playButtonSound();
  });
}

function getEnteredCode() {
  return digitInputs.map((input) => input.value.trim()).join("");
}

function unlockSite() {
  const value = getEnteredCode();
  if (value === password) {
    failedAttempts = 0;
    passwordMessage.textContent = "Welcome to our love story.";
    setTimeout(() => {
      passwordScreen.classList.add("hidden");
      appShell.classList.remove("hidden");
      loadingScreen.classList.add("hidden");
    }, 900);
  } else {
    failedAttempts += 1;
    if (failedAttempts >= 10) {
      passwordMessage.textContent = "Wrong password try again. Hint: Anniversary";
    } else {
      passwordMessage.textContent = "Wrong password try again.";
    }
  }
}

function createFloatingElements() {
  const heartsLayer = document.querySelector(".hearts-layer");
  const petalsLayer = document.querySelector(".petals-layer");

  for (let i = 0; i < 24; i++) {
    const heart = document.createElement("span");
    heart.textContent = i % 2 === 0 ? "💗" : "💖";
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDuration = `${8 + Math.random() * 10}s`;
    heart.style.animationDelay = `${Math.random() * 2}s`;
    heartsLayer.appendChild(heart);
  }

  for (let i = 0; i < 30; i++) {
    const petal = document.createElement("span");
    petal.textContent = "🍓";
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${5 + Math.random() * 6}s`;
    petal.style.animationDelay = `${Math.random() * 3}s`;
    petalsLayer.appendChild(petal);
  }
}

function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function setupGalleryLightbox() {
  document.querySelectorAll(".polaroid img").forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImage.src = img.src;
      lightbox.classList.remove("hidden");
    });
  });

  closeLightbox.addEventListener("click", () => lightbox.classList.add("hidden"));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.classList.add("hidden");
    }
  });
}

function setupLetters() {
  letterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("letterTitle").textContent = btn.dataset.title;
      document.getElementById("letterText").textContent = btn.dataset.message;
      letterModal.classList.remove("hidden");
    });
  });
  closeLetter.addEventListener("click", () => letterModal.classList.add("hidden"));
}

function initGame() {
  const symbols = ["💖", "💘", "💞", "💐", "🌸", "🍓"];
  const deck = [...symbols, ...symbols];
  let shuffled = deck.sort(() => Math.random() - 0.5);
  let flippedCards = [];
  let matched = 0;

  function renderDeck() {
    gameBoard.innerHTML = "";
    shuffled.forEach((emoji, index) => {
      const card = document.createElement("button");
      card.className = "memory-card";
      card.dataset.index = index;
      card.dataset.emoji = emoji;
      card.textContent = "❓";
      card.addEventListener("click", () => flipCard(card));
      gameBoard.appendChild(card);
    });
  }

  function flipCard(card) {
    if (card.classList.contains("flipped") || flippedCards.length === 2) return;
    card.classList.add("flipped");
    card.textContent = card.dataset.emoji;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (first.dataset.emoji === second.dataset.emoji) {
        matched += 1;
        gameStatus.textContent = `Woahh! ${matched} pairs found.`;
        flippedCards = [];
        if (matched === symbols.length) {
          gameStatus.textContent = "You found every little piece of our love story! So pro ahh!";
          createConfetti();
        }
      } else {
        gameStatus.textContent = "enkk — try again.";
        setTimeout(() => {
          first.classList.remove("flipped");
          second.classList.remove("flipped");
          first.textContent = "❓";
          second.textContent = "❓";
          flippedCards = [];
        }, 700);
      }
    }
  }

  renderDeck();
}

function isContentUnlocked() {
  return earlyAccessGranted || new Date() >= CONTENT_UNLOCK_DATE;
}

function attemptEarlyAccess() {
  const value = earlyAccessInput.value.trim();
  if (value === EARLY_ACCESS_CODE) {
    earlyAccessGranted = true;
    earlyAccessMessage.textContent = "Unlocked early! Enjoy the rest of our story.";
    applyLockState();
  } else {
    earlyAccessMessage.textContent = "That code isn't right, try again.";
  }
}

function setupEarlyAccess() {
  earlyAccessBtn.addEventListener("click", attemptEarlyAccess);
  earlyAccessInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") attemptEarlyAccess();
  });
}

function applyLockState() {
  const unlocked = isContentUnlocked();
  lockedSections.forEach((section) => section.classList.toggle("hidden", !unlocked));
  lockedNavLinks.forEach((link) => link.classList.toggle("hidden", !unlocked));
  unlockSection.classList.toggle("hidden", unlocked);
}

function updateUnlockCountdown() {
  if (isContentUnlocked()) {
    applyLockState();
    return;
  }

  const diff = CONTENT_UNLOCK_DATE - new Date();
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  unlockEls.days.textContent = days;
  unlockEls.hours.textContent = hours;
  unlockEls.minutes.textContent = minutes;
  unlockEls.seconds.textContent = seconds;
}

function updateCountdown() {
  const anniversary = new Date("2025-05-07T01:30:00");
  const now = new Date();
  countdownText.textContent = "We have been making beautiful memories since before and our anniversary.";

  if (now <= anniversary) {
    countdownEls.years.textContent = 0;
    countdownEls.months.textContent = 0;
    countdownEls.days.textContent = 0;
    countdownEls.hours.textContent = 0;
    countdownEls.minutes.textContent = 0;
    countdownEls.seconds.textContent = 0;
    return;
  }

  let years = now.getFullYear() - anniversary.getFullYear();
  let months = now.getMonth() - anniversary.getMonth();
  let days = now.getDate() - anniversary.getDate();
  let hours = now.getHours() - anniversary.getHours();
  let minutes = now.getMinutes() - anniversary.getMinutes();
  let seconds = now.getSeconds() - anniversary.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthLastDay;
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  countdownEls.years.textContent = years;
  countdownEls.months.textContent = months;
  countdownEls.days.textContent = days;
  countdownEls.hours.textContent = hours;
  countdownEls.minutes.textContent = minutes;
  countdownEls.seconds.textContent = seconds;
}

function createConfetti() {
  for (let i = 0; i < 30; i++) {
    const piece = document.createElement("span");
    piece.textContent = ["🎉", "💖", "🌸"][Math.floor(Math.random() * 3)];
    piece.style.position = "fixed";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.top = "-5vh";
    piece.style.fontSize = `${20 + Math.random() * 16}px`;
    piece.style.animation = `floatUp ${2 + Math.random() * 2}s linear forwards`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3300);
  }
}

const musicAudio = document.getElementById("musicAudio");
const volumeControl = document.getElementById("volumeControl");
let isMusicPlaying = false;

async function toggleMusic() {
  if (!isMusicPlaying) {
    try {
      await musicAudio.play();
      isMusicPlaying = true;
      musicToggle.textContent = "⏸️";
    } catch (error) {
      console.warn("Music playback was blocked:", error.name, error.message);
      isMusicPlaying = false;
      musicToggle.textContent = "⚠️";
      musicToggle.title = `Music failed to play: ${error.name}. Check that song.mp3 is in the same folder and that you're viewing this through a local server (not by double-clicking the file).`;
      setTimeout(() => {
        musicToggle.textContent = "🎵";
      }, 2000);
    }
  } else {
    musicAudio.pause();
    musicAudio.currentTime = 0;
    isMusicPlaying = false;
    musicToggle.textContent = "🎵";
  }
}

function setupVolumeControl() {
  if (musicAudio) {
    musicAudio.volume = Number(volumeControl.value) / 100;
    volumeControl.addEventListener("input", (event) => {
      musicAudio.volume = Number(event.target.value) / 100;
    });
  }
}

function applyBackground(preset = "Default") {
  const image = backgroundPresets[preset] || backgroundPresets.Default;
  document.body.style.backgroundImage = `linear-gradient(rgba(255, 244, 247, 0.55), rgba(255, 244, 247, 0.72)), url('${image}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";
}

function setupTheme() {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light" : "🌙 Dark";
  });
}

// Singe line comment
function setupEasterEggs() {
  document.querySelectorAll(".surprise-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.easter;
      const messages = {
        moon: "Secret moon wish: I love your quiet nights and the comfort of your hand in mine.",
        sun: "Secret sun smile: You are the warmest part of every day.",
        star: "Secret star note: You are my favorite constellation and my forever home."
      };
      easterMessage.textContent = messages[value];
    });
  });
}
/* Multiple line comment */

function setupSparkleCursor() {
  const cursor = document.querySelector(".sparkle-cursor");
  window.addEventListener("mousemove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });
}

function setupParallax() {
  window.addEventListener("scroll", () => {
    const offset = window.scrollY * 0.18;
    document.body.style.backgroundPosition = `0 ${offset}px`;
  });
}

function init() {
  renderReasons();
  createFloatingElements();
  revealOnScroll();
  setupGalleryLightbox();
  setupLetters();
  setupButtonSounds();
  initGame();
  updateCountdown();
  applyLockState();
  updateUnlockCountdown();
  setupEarlyAccess();
  applyBackground();
  backgroundPicker.addEventListener("change", (event) => applyBackground(event.target.value));
  setupVolumeControl();
  setupTheme();
  setupEasterEggs();
  setupSparkleCursor();
  setupParallax();

  enterBtn.addEventListener("click", unlockSite);
  digitInputs.forEach((input, index) => {
    input.addEventListener("input", (event) => {
      event.target.value = event.target.value.replace(/\D/g, "").slice(0, 1);
      if (event.target.value && index < digitInputs.length - 1) {
        digitInputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && !input.value && index > 0) {
        digitInputs[index - 1].focus();
      }
      if (event.key === "Enter") unlockSite();
    });
  });

  confettiBtn.addEventListener("click", () => {
    createConfetti();
  });
  finalHeartBtn.addEventListener("click", () => {
    createConfetti();
    easterMessage.textContent = "My favorite person, you are the loveliest part of every future I imagine. Happy anniversary and birthday, love.";
  });

  musicToggle.addEventListener("click", toggleMusic);
  setInterval(updateCountdown, 1000);
  setInterval(updateUnlockCountdown, 1000);
}

function bootstrap() {
  init();
  setTimeout(() => {
    loadingScreen.classList.add("hidden");
  }, 2200);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}