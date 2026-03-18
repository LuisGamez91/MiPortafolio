function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
  document.body.style.overflow = "auto";
}

// Close modal when clicking outside
window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
    document.body.style.overflow = "auto";
  }
};

// Close modal with Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const modals = document.getElementsByClassName("modal");
    for (let modal of modals) {
      if (modal.style.display === "block") {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    }
  }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const navbarHeight = document.querySelector(".navbar").offsetHeight;
      const targetPosition = target.offsetTop - navbarHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});
