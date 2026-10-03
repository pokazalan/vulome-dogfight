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

  // Hover SFX: synthesized 8-bit "blip" (no audio file needed) for the
  // moving buttons/cards. Desktop-only (real hover + mouse), since the
  // effect only makes sense where hovering is a deliberate gesture.
  const supportsHoverSfx = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (supportsHoverSfx) {
    let audioCtx;
    const unlockAudio = () => {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
    };
    document.addEventListener("pointerdown", unlockAudio, { once: true });
    document.addEventListener("keydown", unlockAudio, { once: true });

    const playHoverBlip = () => {
      if (!audioCtx || audioCtx.state !== "running") return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.09, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    };

    document.querySelectorAll(".btn, .lang-btn, .social-card, .video-link").forEach((el) => {
      el.addEventListener("mouseenter", playHoverBlip);
    });
  }
});
