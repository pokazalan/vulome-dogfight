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

  const scrollTargets = Array.from(document.querySelectorAll(".hero, .about, .clip, .game, .follow, .site-footer"))
    .map((section) => ({
      section,
      sky: section.querySelector(":scope > .hero-sky, :scope > .section-sky"),
      overlay: section.querySelector(":scope > .scroll-fade"),
    }))
    .filter((t) => t.sky || t.overlay);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && scrollTargets.length) {
    const parallaxFactor = 0.3;
    let ticking = false;

    const updateScrollEffects = () => {
      // Read phase: measure every section once before writing anything,
      // so none of these reads are forced to flush a pending style write.
      const rects = scrollTargets.map(({ section }) => section.getBoundingClientRect());

      // Write phase: apply all style changes using the cached measurements.
      scrollTargets.forEach(({ sky, overlay }, i) => {
        const rect = rects[i];

        if (sky) {
          const buffer = rect.height * 0.2;
          const raw = -rect.top * parallaxFactor;
          const clamped = Math.max(-buffer, Math.min(buffer, raw));
          sky.style.transform = `translateY(${clamped}px)`;
        }

        if (overlay) {
          overlay.style.opacity = rect.top < 0 ? Math.min(-rect.top / rect.height, 1) : 0;
        }
      });

      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    }, { passive: true });

    updateScrollEffects();
  }
});
