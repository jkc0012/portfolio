// ===============================
// Loader (Back Like Before)
// ===============================
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (!loader) return;

  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
    setTimeout(() => loader.remove(), 300);
  }, 400);
});

// ===============================
// Reveal Animation (section-by-section on mobile)
// ===============================
const reveals = document.querySelectorAll(".reveal");

function getRevealObserver() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (isMobile) {
    // Mobile: reveal when element enters top ~65% of viewport (section-by-section feel)
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -35% 0px" }
    );
  }
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    },
    { threshold: 0.15 }
  );
}

let revealObserver = getRevealObserver();
reveals.forEach((el) => revealObserver.observe(el));

// Mobile: stagger delays so items within a section appear one-by-one
function setMobileRevealStagger() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  reveals.forEach((el) => {
    if (!isMobile) {
      el.style.removeProperty("--reveal-delay");
      return;
    }
    const section = el.closest("section") || el.closest("main") || el.parentElement;
    const siblings = section ? [...section.querySelectorAll(".reveal")] : [el];
    const index = siblings.indexOf(el);
    el.style.setProperty("--reveal-delay", index * 0.05 + "s");
  });
}
function initRevealObserver() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = getRevealObserver();
  reveals.forEach((el) => revealObserver.observe(el));
}
setMobileRevealStagger();
window.addEventListener("resize", () => {
  initRevealObserver();
  setMobileRevealStagger();
});

// ===============================
// Cursor Glow
// ===============================
const glow = document.getElementById("cursorGlow");
if (glow) {
  window.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });
}

// ===============================
// Scroll Progress
// ===============================
const spFill = document.getElementById("spFill");
const spText = document.getElementById("spText");

if (spFill && spText) {
  window.addEventListener("scroll", () => {
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const scrolled = (window.scrollY / docHeight) * 100;
    const value = Math.min(100, Math.max(0, scrolled));

    spFill.style.height = value + "%";
    spText.textContent = Math.round(value) + "%";
  });
}

// ===============================
// Theme Toggle
// ===============================
const themeToggle = document.getElementById("themeToggle");

function setTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem("jk_theme", mode);
}

const savedTheme = localStorage.getItem("jk_theme");
if (savedTheme) setTheme(savedTheme);
else setTheme("dark");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current =
      document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(current === "dark" ? "light" : "dark");
  });

  // Keyboard accessibility
  themeToggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      themeToggle.click();
    }
  });
}

// ===============================
// Mobile Menu
// ===============================
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const nav = document.getElementById("nav");

function closeMobileMenu() {
  if (mobileMenu) mobileMenu.classList.remove("show");
}

function positionMobileMenu() {
  if (!mobileMenu || !nav) return;
  const rect = nav.getBoundingClientRect();
  mobileMenu.style.top = rect.bottom + "px";
}

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
    if (mobileMenu.classList.contains("show")) positionMobileMenu();
  });

  mobileMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      mobileMenu.querySelectorAll("a").forEach((l) => l.classList.remove("active"));
      a.classList.add("active");
      closeMobileMenu();
    });
  });
}

window.addEventListener("resize", () => {
  positionMobileMenu();
  if (window.innerWidth >= 1050) closeMobileMenu();
});

// ===============================
// Nav scroll-spy: highlight menu item for section in view
// ===============================
const sections = document.querySelectorAll("section[id], main[id]");
const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
const mobileLinks = document.querySelectorAll(".mobile-menu a[href^='#']");

function setActiveNav() {
  const scrollY = window.scrollY;
  const viewportMid = scrollY + window.innerHeight * 0.35;

  let currentId = "";
  sections.forEach((section) => {
    const id = section.getAttribute("id");
    if (!id) return;
    const rect = section.getBoundingClientRect();
    const top = rect.top + scrollY;
    const bottom = top + rect.height;
    if (viewportMid >= top && viewportMid <= bottom) currentId = id;
  });

  if (!currentId && scrollY < 100) currentId = "top";

  function setActive(links) {
    links.forEach((a) => {
      const href = a.getAttribute("href");
      const id = href === "#" ? "top" : href.slice(1);
      if (id === currentId) a.classList.add("active");
      else a.classList.remove("active");
    });
  }
  setActive(navLinks);
  setActive(mobileLinks);
}

window.addEventListener("scroll", () => setActiveNav(), { passive: true });
window.addEventListener("load", () => setActiveNav());

// ===============================
// Footer year
// ===============================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===============================
// View More Projects
// ===============================
const viewMoreBtn = document.getElementById("viewMoreBtn");
const moreProjects = document.getElementById("moreProjects");

if (viewMoreBtn && moreProjects) {
  viewMoreBtn.addEventListener("click", () => {
    moreProjects.classList.toggle("open");

    viewMoreBtn.textContent = moreProjects.classList.contains("open")
      ? "Hide Projects"
      : "View More Projects";
  });
}

// ===============================
// Show More Experience
// ===============================
const experienceTimeline = document.getElementById("experienceTimeline");
const showMoreExperienceBtn = document.getElementById("showMoreExperienceBtn");

if (experienceTimeline && showMoreExperienceBtn) {
  showMoreExperienceBtn.addEventListener("click", () => {
    experienceTimeline.classList.toggle("expanded");

    showMoreExperienceBtn.textContent = experienceTimeline.classList.contains("expanded")
      ? "Show Less Experience"
      : "Show More Experience";
  });
}
