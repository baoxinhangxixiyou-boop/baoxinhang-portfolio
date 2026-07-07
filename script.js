const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sectionLinks = Array.from(document.querySelectorAll('a[href^="#"]'));

if (navToggle && header) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

sectionLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    if (header) {
      header.classList.remove("nav-open");
    }
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
});

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    {
      rootMargin: "-30% 0px -55% 0px",
      threshold: [0.12, 0.4, 0.7],
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function showImageFallback(img) {
  const shell = img.closest(".image-shell");
  if (!shell || shell.querySelector(".image-fallback")) return;

  img.style.display = "none";
  const fallback = document.createElement("div");
  fallback.className = "image-fallback";
  fallback.textContent = img.dataset.fallback || "Image placeholder";
  shell.appendChild(fallback);
}

document.querySelectorAll("img[data-fallback]").forEach((img) => {
  img.addEventListener("error", () => showImageFallback(img));

  if (img.complete && img.naturalWidth === 0) {
    showImageFallback(img);
  }
});
