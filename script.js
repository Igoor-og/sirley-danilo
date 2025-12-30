document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".lock-screen-countdown")) {
    document.querySelector(".lock-screen-countdown").style.display = "none";
  }
});// =========================================================
// VARIÁVEIS GLOBAIS
// =========================================================
// ALTERADO: horário para 00:00
const targetDate = new Date("December 30, 2025 00:00:00").getTime();

const lockScreen = document.querySelector(".lock-screen-countdown");
const countdownTimeDisplay = document.getElementById("countdown-time");

// Verifica imediatamente se o parâmetro 'dev=true' está na URL
const urlParams = new URLSearchParams(window.location.search);
const isDevMode = urlParams.get("dev") === "true";

let countdownInterval = null; // Variável para armazenar o ID do intervalo do contador

// =========================================================
// FUNÇÕES PRINCIPAIS
// =========================================================

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const format = (num) => String(num).padStart(2, "0");

  if (distance < 0) {
    // *** DESBLOQUEIO POR DATA ***
    clearInterval(countdownInterval);
    if (lockScreen) {
      lockScreen.classList.add("hidden");
    }
    countdownTimeDisplay.innerHTML = "É HOJE!";
    initializeSwiper();
  } else {
    // Bloqueio ativo
    countdownTimeDisplay.innerHTML = `${days} dias ${format(hours)}:${format(minutes)}:${format(seconds)}`;
    if (lockScreen) {
      lockScreen.classList.remove("hidden");
    }
  }
}

// =========================================================
// INICIALIZAÇÃO DO SWIPER
// =========================================================

function initializeSwiper() {
  if (document.querySelector(".mySwiper").swiper) return;

  const carouselWrapper = document.getElementById("carousel-wrapper");
  const totalPhotos = 8;

  if (carouselWrapper) {
    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= totalPhotos; i++) {
      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");

      const img = document.createElement("img");
      img.setAttribute("src", `assets/photo${i}.jpeg`);
      img.alt = `Momento nosso ${i}`;

      slide.appendChild(img);
      fragment.appendChild(slide);
    }

    carouselWrapper.appendChild(fragment);

    new Swiper(".mySwiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
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
}

function initializeApp() {
  if (isDevMode) {
    console.log("Modo DEV ativado.");
    if (lockScreen) {
      lockScreen.classList.add("hidden");
    }
    initializeSwiper();
  } else {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("theme-dark");
  }
}

// =========================================================
// EVENT LISTENERS
// =========================================================

window.onload = initializeApp;

const observer = new IntersectionObserver((entries) => {
  if (isDevMode || (lockScreen && lockScreen.classList.contains("hidden"))) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }
});

document.querySelectorAll(".fade").forEach((el) => observer.observe(el));

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("theme-dark");
  const isDarkMode = document.body.classList.contains("theme-dark");
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
});

document.addEventListener(
  "click",
  () => {
    const audio = document.getElementById("music");
    if (audio) {
      audio.muted = false;
      audio.play().catch((error) => console.log("Autoplay bloqueado"));
    }
  },
  { once: true },
);
