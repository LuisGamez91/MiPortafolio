// Utility: Debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Lazy Loading Images
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll(".lazy-load");

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute("data-src");

          if (src) {
            img.src = src;
            img.classList.add("loaded");
            img.removeAttribute("data-src");
            observer.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: "50px",
    },
  );

  lazyImages.forEach((img) => imageObserver.observe(img));
}

document.addEventListener("DOMContentLoaded", lazyLoadImages);

// Theme Toggle Functionality
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

const currentTheme = localStorage.getItem("theme") || "dark";
html.setAttribute("data-theme", currentTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", function () {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    this.style.transform = "rotate(360deg)";
    setTimeout(() => {
      this.style.transform = "rotate(0deg)";
    }, 300);
  });
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    if (href === "#" || href === "") {
      return;
    }

    e.preventDefault();
    const target = document.querySelector(href);

    if (target) {
      const navbarHeight = document.querySelector(".navbar").offsetHeight;
      const targetPosition = target.offsetTop - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        navbarCollapse.classList.remove("show");
      }
    }
  });
});

// Navbar Background on Scroll (DEB'd)
const handleNavbarScroll = debounce(function () {
  const navbar = document.querySelector(".navbar");

  if (window.scrollY > 50) {
    navbar.style.background = "var(--bg-primary)";
    navbar.style.boxShadow = "0 4px 12px rgba(81, 2, 81, 0.3)";
  } else {
    navbar.style.background = "var(--bg-primary)";
    navbar.style.boxShadow = "var(--shadow-sm)";
  }
}, 10);

window.addEventListener("scroll", handleNavbarScroll, { passive: true });

// Active Navigation Link (DEB'd)
const handleActiveLink = debounce(function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  let current = "";
  const scrollPos = window.pageYOffset;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (scrollPos >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}, 50);

window.addEventListener("scroll", handleActiveLink, { passive: true });

// Contact Form Handling
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const asunto = document.getElementById("asunto").value;
    const mensaje = document.getElementById("mensaje").value;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="bi bi-hourglass-split me-2"></i>Enviando...';
    submitBtn.disabled = true;

    setTimeout(() => {
      formMessage.className = "alert alert-success mt-4";
      formMessage.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>
        <strong>¡Mensaje enviado!</strong> Gracias ${nombre}, te responderé pronto.
      `;
      formMessage.classList.remove("d-none");

      contactForm.reset();

      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      setTimeout(() => {
        formMessage.classList.add("d-none");
      }, 5000);
    }, 1500);
  });
}

// Scroll to Top Button (DEB'd)
function createScrollToTopButton() {
  const button = document.createElement("button");
  button.innerHTML = '<i class="bi bi-arrow-up"></i>';
  button.className = "scroll-to-top";
  button.setAttribute("aria-label", "Scroll to top");

  document.body.appendChild(button);

  const handleScrollTopButton = debounce(function () {
    if (window.pageYOffset > 300) {
      button.classList.add("visible");
    } else {
      button.classList.remove("visible");
    }
  }, 100);

  window.addEventListener("scroll", handleScrollTopButton, { passive: true });

  button.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

createScrollToTopButton();

// Performance: Reduce Motion for Accessibility
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.style.setProperty("scroll-behavior", "auto");

  const style = document.createElement("style");
  style.textContent = `
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  `;
  document.head.appendChild(style);
}

// Music Player
const musicPlayer = {
  playlist: [
    {
      title: "Seven Tears are Flowing to the River",
      artist: "Nargaroth",
      src: "./music/SevenTears.mp3",
    },
    {
      title: "Our Foes Shall Fall",
      artist: "Summoning",
      src: "./music/OurFoes.mp3",
    },
    {
      title: "Moonlight Sonata M1",
      artist: "Beethoven",
      src: "./music/Moonlight.mp3",
    },
    {
      title: "Not Saved",
      artist: "Ulver",
      src: "./music/NotSaved.mp3",
    },
    {
      title: "The Ballað Of The Broken Birdie Records",
      artist: "múm",
      src: "./music/BalladBroken.mp3",
    },
  ],
  currentTrack: 0,
  isPlaying: false,
  isShuffled: false,
  isRepeating: false,

  init() {
    this.audio = document.getElementById("audioPlayer");
    this.playerToggle = document.getElementById("playerToggle");
    this.playerExpanded = document.getElementById("playerExpanded");
    this.playerClose = document.getElementById("playerClose");
    this.playPauseBtn = document.getElementById("playPauseBtn");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.shuffleBtn = document.getElementById("shuffleBtn");
    this.repeatBtn = document.getElementById("repeatBtn");
    this.progressBar = document.getElementById("progressBar");
    this.volumeSlider = document.getElementById("volumeSlider");
    this.volumeValue = document.getElementById("volumeValue");
    this.trackTitle = document.getElementById("trackTitle");
    this.trackArtist = document.getElementById("trackArtist");
    this.currentTime = document.getElementById("currentTime");
    this.totalTime = document.getElementById("totalTime");
    this.playlistEl = document.getElementById("playlist");

    this.setupEventListeners();
    this.renderPlaylist();
    this.loadTrack(0);

    this.audio.volume = 0.2;

    this.isPlaying = false;
    this.playerToggle.classList.remove("playing");
    this.playPauseBtn.querySelector("i").className = "bi bi-play-circle-fill";
  },

  setupEventListeners() {
    this.playerToggle.addEventListener("click", () => this.togglePlayer());
    this.playerClose.addEventListener("click", () => this.closePlayer());
    this.playPauseBtn.addEventListener("click", () => this.togglePlay());
    this.prevBtn.addEventListener("click", () => this.prevTrack());
    this.nextBtn.addEventListener("click", () => this.nextTrack());
    this.shuffleBtn.addEventListener("click", () => this.toggleShuffle());
    this.repeatBtn.addEventListener("click", () => this.toggleRepeat());

    this.progressBar.addEventListener("input", (e) => {
      const time = (this.audio.duration / 100) * e.target.value;
      this.audio.currentTime = time;
    });

    this.volumeSlider.addEventListener("input", (e) => {
      const volume = e.target.value / 100;
      this.audio.volume = volume;
      this.volumeValue.textContent = e.target.value + "%";
    });

    this.audio.addEventListener("timeupdate", () => this.updateProgress());
    this.audio.addEventListener("loadedmetadata", () => this.updateDuration());
    this.audio.addEventListener("ended", () => this.handleTrackEnd());
  },

  togglePlayer() {
    this.playerExpanded.classList.toggle("active");
  },

  closePlayer() {
    this.playerExpanded.classList.remove("active");
  },

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
      this.playPauseBtn.querySelector("i").className = "bi bi-play-circle-fill";
      this.playerToggle.classList.remove("playing");
    } else {
      this.audio.play().catch(() => {});
      this.isPlaying = true;
      this.playPauseBtn.querySelector("i").className =
        "bi bi-pause-circle-fill";
      this.playerToggle.classList.add("playing");
    }
  },

  loadTrack(index) {
    this.currentTrack = index;
    const track = this.playlist[index];

    this.audio.src = track.src;
    this.trackTitle.textContent = track.title;
    this.trackArtist.textContent = track.artist;
    this.updatePlaylistActive();
  },

  prevTrack() {
    this.currentTrack =
      this.currentTrack > 0 ? this.currentTrack - 1 : this.playlist.length - 1;

    this.loadTrack(this.currentTrack);

    if (this.isPlaying) {
      this.audio.play().catch(() => {});
    }
  },

  nextTrack() {
    if (this.isShuffled) {
      this.currentTrack = Math.floor(Math.random() * this.playlist.length);
    } else {
      this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
    }

    this.loadTrack(this.currentTrack);

    if (this.isPlaying) {
      this.audio.play().catch(() => {});
    }
  },

  toggleShuffle() {
    this.isShuffled = !this.isShuffled;
    this.shuffleBtn.classList.toggle("active", this.isShuffled);
  },

  toggleRepeat() {
    this.isRepeating = !this.isRepeating;
    this.repeatBtn.classList.toggle("active", this.isRepeating);
    this.audio.loop = this.isRepeating;
  },

  handleTrackEnd() {
    if (!this.isRepeating) {
      this.nextTrack();
    }
  },

  updateProgress() {
    const progress = (this.audio.currentTime / this.audio.duration) * 100;
    this.progressBar.value = progress || 0;
    this.currentTime.textContent = this.formatTime(this.audio.currentTime);
  },

  updateDuration() {
    this.totalTime.textContent = this.formatTime(this.audio.duration);
  },

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  },

  renderPlaylist() {
    this.playlistEl.innerHTML = this.playlist
      .map(
        (track, index) => `
      <div class="playlist-item" data-index="${index}">
        <div class="playlist-item-title">${track.title}</div>
        <div class="playlist-item-artist">${track.artist}</div>
      </div>
    `,
      )
      .join("");

    this.playlistEl.querySelectorAll(".playlist-item").forEach((item) => {
      item.addEventListener("click", () => {
        const index = parseInt(item.dataset.index);
        this.loadTrack(index);
        if (!this.isPlaying) this.togglePlay();
      });
    });
  },

  updatePlaylistActive() {
    this.playlistEl
      .querySelectorAll(".playlist-item")
      .forEach((item, index) => {
        item.classList.toggle("active", index === this.currentTrack);
      });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("musicPlayer")) {
    musicPlayer.init();
  }
});

document.addEventListener("click", function startMusic() {
  if (musicPlayer.audio && musicPlayer.audio.paused) {
    musicPlayer.audio.play().catch(() => {});
    musicPlayer.isPlaying = true;
    musicPlayer.playerToggle.classList.add("playing");
    musicPlayer.playPauseBtn.querySelector("i").className =
      "bi bi-pause-circle-fill";
  }
  document.removeEventListener("click", startMusic);
});

// EE
let clickCount = 0;
let clickTimer;

document.querySelector(".navbar-brand").addEventListener("click", (e) => {
  e.preventDefault();
  clickCount++;

  clearTimeout(clickTimer);

  if (clickCount === 3) {
    const secretSection = document.getElementById("secretSection");
    secretSection.classList.remove("d-none");

    setTimeout(() => {
      const navbarHeight = document.querySelector(".navbar").offsetHeight;
      const targetPosition = secretSection.offsetTop - navbarHeight;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }, 100);

    clickCount = 0;
  }

  clickTimer = setTimeout(() => {
    clickCount = 0;
  }, 1000);
});
