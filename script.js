document.addEventListener("DOMContentLoaded", () => {
  const langButtons = document.querySelectorAll(".lang-btn");
  const i18nEls = document.querySelectorAll("[data-i18n-hu]");
  const storedLang = localStorage.getItem("vulome-lang");
  const initialLang = storedLang === "en" || storedLang === "hu" ? storedLang : "en";

  const setLang = (lang) => {
    i18nEls.forEach((el) => {
      el.textContent = lang === "en" ? el.dataset.i18nEn : el.dataset.i18nHu;
    });
    langButtons.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });
    document.documentElement.lang = lang;
    localStorage.setItem("vulome-lang", lang);
  };

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  setLang(initialLang);

  const sections = document.querySelectorAll(".about, .clip, .game, .follow");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((section) => {
    section.classList.add("pre-reveal");
    observer.observe(section);
  });

  const lazyVideo = document.querySelector(".lazy-video");
  if (lazyVideo) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            lazyVideo.src = lazyVideo.dataset.src;
            lazyVideo.play().catch(() => {});
            videoObserver.unobserve(lazyVideo);
          }
        });
      },
      { rootMargin: "200px" }
    );
    videoObserver.observe(lazyVideo);
  }

  // Backgrounds stay static (no scroll-linked movement) — scroll-driven JS
  // parallax proved unreliable on mobile and too heavy on desktop. Only the
  // darkening fade is scroll-linked, and it's cheap: one rect read + one
  // opacity write per section, no transforms.
  const fadeTargets = Array.from(document.querySelectorAll(".hero, .about, .clip, .game, .follow, .site-footer"))
    .map((section) => ({ section, overlay: section.querySelector(":scope > .scroll-fade") }))
    .filter((t) => t.overlay);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && fadeTargets.length) {
    let ticking = false;

    const updateFades = () => {
      const rects = fadeTargets.map(({ section }) => section.getBoundingClientRect());

      fadeTargets.forEach(({ overlay }, i) => {
        const rect = rects[i];
        overlay.style.opacity = rect.top < 0 ? Math.min(-rect.top / rect.height, 1) : 0;
      });

      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateFades);
        ticking = true;
      }
    }, { passive: true });

    updateFades();
  }
});
