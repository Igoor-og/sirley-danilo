// =========================================================
// CONFIGURAÇÕES
// =========================================================

// Libera no INÍCIO do dia (00:00)
const targetDate = new Date("December 30, 2025 00:00:00").getTime();

// Dev mode via ?dev=true
const urlParams = new URLSearchParams(window.location.search);
const isDevMode = urlParams.get("dev") === "true";

// Elementos
const lockScreen = document.querySelector(".lock-screen-countdown");
const countdownTimeDisplay = document.getElementById("countdown-time");

// Intervalo
let countdownInterval = null;

// =========================================================
// CONTADOR
// =========================================================

function updateCountdown() {
  const now = Date.now();
  const distance = targetDate - now;

  if (distance <= 0) {
    clearInterval(countdownInterval);

    if (lockScreen) lockScreen.classList.add("hidden");
    if (countdownTimeDisplay) countdownTimeDisplay.innerHTML = "É HOJE!";

    initializeSwiper();
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  const pad = (n) => String(n).padStart(2, "0");

  if (countdownTimeDisplay) {
    countdownTimeDisplay.innerHTML = `${days} dias ${pad(hours)}:${pad(
      minutes
    )}:${pad(seconds)}`;
  }

  if (lockScreen) lockScreen.classList.remove("hidden");
}

// =========================================================
// SWIPER
// =========================================================

function initializeSwiper() {
  const swiperContainer = document.querySelector(".mySwiper");
  if (!swiperContainer || swiperContainer.swiper) return;

  const carouselWrapper = document.getElementById("carousel-wrapper");
  if (!carouselWrapper) return;

  const totalPhotos = 8;
  const fragment = document.createDocumentFragment();

  for (let i = 1; i <= totalPhotos; i++) {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    const img = document.createElement("img");
    img.src = `assets/photo${i}.jpeg`;
    img.alt = `Momento nosso ${i}`;

    slide.appendChild(img);
    fragment.appendChild(slide);
  }

  carouselWrapper.appendChild(fragment);

  new Swiper(".mySwiper", {
    effect: "coverflow",
    centeredSlides: true,
    grabCursor: true,
    loop: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      640: { slidesPerView: 1.2 },
      1024: { slidesPerView: 1.5 },
    },
  });
}

// =========================================================
// APP
// =========================================================

function initializeApp() {
  // Tema salvo
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("theme-dark");
  }

  // DEV MODE
  if (isDevMode) {
    if (lockScreen) lockScreen.classList.add("hidden");
    initializeSwiper();
    return;
  }

  // NORMAL
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

window.addEventListener("load", initializeApp);

// =========================================================
// TEMA
// =========================================================

const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("theme-dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("theme-dark") ? "dark" : "light"
    );
  });
}

// =========================================================
// ÁUDIO (libera no clique)
// =========================================================

document.addEventListener(
  "click",
  () => {
    const audio = document.getElementById("music");
    if (audio) {
      audio.muted = false;
      audio.play().catch(() => {});
    }
  },
  { once: true }
);
