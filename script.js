/* ==========================================================
   MODOU LAMIN SANNO — DATA SCIENCE PORTFOLIO
   Script
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       THEME TOGGLE (dark / light, persisted in localStorage)
       Note: the *initial* theme is applied by a tiny inline
       script in <head> (before paint) to avoid a flash of the
       wrong theme. This block only wires up the toggle button.
    ====================================================== */

    const themeToggleButtons = document.querySelectorAll(".theme-toggle");

    function setThemeButtonsState(isLight) {
        themeToggleButtons.forEach((btn) => {
            btn.setAttribute("aria-pressed", isLight ? "true" : "false");
        });
    }

    setThemeButtonsState(document.documentElement.getAttribute("data-theme") === "light");

    themeToggleButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const root = document.documentElement;
            const isLight = root.getAttribute("data-theme") === "light";
            const next = isLight ? "dark" : "light";

            if (next === "light") {
                root.setAttribute("data-theme", "light");
            } else {
                root.removeAttribute("data-theme");
            }

            try {
                localStorage.setItem("portfolio-theme", next);
            } catch (e) { /* localStorage unavailable — theme just won't persist */ }

            setThemeButtonsState(next === "light");
        });
    });

    /* ======================================================
       REVEAL ON SCROLL
    ====================================================== */

    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach((el) => revealObserver.observe(el));

    /* ======================================================
       SKILL BAR FILL ON SCROLL INTO VIEW
    ====================================================== */

    const skillBars = document.querySelectorAll(".skill-bar-fill");

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const target = entry.target.getAttribute("data-level") || "0";
                entry.target.style.width = target + "%";
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach((bar) => skillObserver.observe(bar));

    /* ======================================================
       STATS COUNTER ANIMATION
    ====================================================== */

    const counters = document.querySelectorAll(".stat-card h3[data-target]");

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const target = parseInt(el.getAttribute("data-target"), 10);
            const duration = 1200;
            const start = performance.now();

            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const value = Math.floor(progress * target);
                el.textContent = value + "+";
                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = target + "+";
                }
            }

            requestAnimationFrame(tick);
            countObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach((counter) => countObserver.observe(counter));

    /* ======================================================
       BACK TO TOP BUTTON
    ====================================================== */

    const topBtn = document.getElementById("topBtn");

    if (topBtn) {
        window.addEventListener("scroll", () => {
            topBtn.style.display = window.scrollY > 400 ? "flex" : "none";
        });

        topBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* ======================================================
       TYPEWRITER EFFECT
    ====================================================== */

    const typingElement = document.getElementById("typing");

    const words = [
        "Data Science Student",
        "Machine Learning Enthusiast",
        "Data Analyst",
        "Tableau Dashboard Creator",
        "Python Developer",
        "Problem Solver"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {
        if (!typingElement) return;

        const currentWord = words[wordIndex];

        if (!deleting) {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentWord.length) {
                deleting = true;
                setTimeout(typeEffect, 1800);
                return;
            }
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
        }

        setTimeout(typeEffect, deleting ? 45 : 85);
    }

    typeEffect();

    /* ======================================================
       ACTIVE NAVIGATION LINK ON SCROLL
    ====================================================== */

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let current = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 150;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active-link");
            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active-link");
            }
        });
    });

    /* ======================================================
       SMOOTH SCROLL + CLOSE MOBILE MENU ON LINK CLICK
    ====================================================== */

    const mobileMenu = document.getElementById("menu");
    const bsCollapse = (mobileMenu && window.bootstrap)
        ? new bootstrap.Collapse(mobileMenu, { toggle: false })
        : null;

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            const target = document.querySelector(targetId);

            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
                target.setAttribute("tabindex", "-1");
                target.focus({ preventScroll: true });
            }

            if (bsCollapse && mobileMenu.classList.contains("show")) {
                bsCollapse.hide();
            }
        });
    });

    /* ======================================================
       PROFILE CARD TILT EFFECT (disabled for touch / reduced motion)
    ====================================================== */

    const profileCard = document.querySelector(".profile-card");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = window.matchMedia("(hover: none)").matches;

    if (profileCard && !prefersReducedMotion && !isTouchDevice) {
        profileCard.addEventListener("mousemove", (e) => {
            const rect = profileCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateY = ((x / rect.width) - 0.5) * 8;
            const rotateX = ((y / rect.height) - 0.5) * -8;

            profileCard.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        profileCard.addEventListener("mouseleave", () => {
            profileCard.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
        });
    }

    /* ======================================================
       CERTIFICATE MODAL
    ====================================================== */

    const certTriggers = document.querySelectorAll("[data-cert-trigger]");
    const certOverlay = document.getElementById("certModalOverlay");
    const certModalTitle = document.getElementById("certModalTitle");
    const certModalProgram = document.getElementById("certModalProgram");
    const certModalGrade = document.getElementById("certModalGrade");
    const certModalImage = document.getElementById("certModalImage");
    const certModalDownload = document.getElementById("certModalDownload");
    const certModalVerify = document.getElementById("certModalVerify");
    const certModalClose = document.getElementById("certModalClose");

    let lastFocusedCertTrigger = null;

    function openCertModal(trigger) {
        if (!certOverlay) return;

        const title = trigger.getAttribute("data-cert-title") || "";

        certModalTitle.textContent = title;
        certModalProgram.textContent = trigger.getAttribute("data-cert-program") || "";
        certModalGrade.textContent = trigger.getAttribute("data-cert-grade") || "";
        certModalImage.src = trigger.getAttribute("data-cert-image") || "";
        certModalImage.alt = title + " certificate preview";
        certModalDownload.href = trigger.getAttribute("data-cert-download") || "#";

        const verifyUrl = trigger.getAttribute("data-cert-verify");
        if (certModalVerify) {
            if (verifyUrl) {
                certModalVerify.href = verifyUrl;
                certModalVerify.style.display = "inline-flex";
            } else {
                certModalVerify.style.display = "none";
            }
        }

        certOverlay.classList.add("is-open");
        lastFocusedCertTrigger = trigger;
        certModalClose.focus();
        document.body.style.overflow = "hidden";
    }

    function closeCertModal() {
        if (!certOverlay) return;
        certOverlay.classList.remove("is-open");
        document.body.style.overflow = "";
        if (lastFocusedCertTrigger) lastFocusedCertTrigger.focus();
    }

    certTriggers.forEach((trigger) => {
        trigger.addEventListener("click", () => openCertModal(trigger));
    });

    if (certModalClose) certModalClose.addEventListener("click", closeCertModal);

    if (certOverlay) {
        certOverlay.addEventListener("click", (e) => {
            if (e.target === certOverlay) closeCertModal();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && certOverlay && certOverlay.classList.contains("is-open")) {
            closeCertModal();
        }
    });

    /* ======================================================
       CONTACT FORM — CLIENT-SIDE VALIDATION + DEMO SEND
       NOTE: This is a static page with no backend, so this
       cannot actually deliver an email. To make it functional,
       connect it to a form service such as Formspree, or your
       own backend endpoint, and POST the form data there.
    ====================================================== */

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        const nameField = document.getElementById("nameField");
        const emailField = document.getElementById("emailField");
        const messageField = document.getElementById("messageField");
        const formMessage = document.getElementById("formMessage");

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        function showFieldError(field, errorEl, show) {
            if (!errorEl) return;
            errorEl.classList.toggle("is-visible", show);
            field.classList.toggle("was-validated-error", show);
        }

        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            let valid = true;

            const nameError = document.getElementById("nameError");
            const emailError = document.getElementById("emailError");
            const messageError = document.getElementById("messageError");

            if (!nameField.value.trim()) {
                showFieldError(nameField, nameError, true);
                valid = false;
            } else {
                showFieldError(nameField, nameError, false);
            }

            if (!emailPattern.test(emailField.value.trim())) {
                showFieldError(emailField, emailError, true);
                valid = false;
            } else {
                showFieldError(emailField, emailError, false);
            }

            if (!messageField.value.trim()) {
                showFieldError(messageField, messageError, true);
                valid = false;
            } else {
                showFieldError(messageField, messageError, false);
            }

            if (!valid) {
                formMessage.textContent = "Please fix the highlighted fields.";
                formMessage.className = "error";
                return;
            }

            formMessage.textContent = "Message ready — note: this demo form has no backend yet, so nothing was actually sent.";
            formMessage.className = "success";
            contactForm.reset();
        });
    }

    /* ======================================================
       FOOTER YEAR
    ====================================================== */

    const footerYear = document.getElementById("footer-year");
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    /* ======================================================
       CONSOLE MESSAGE
    ====================================================== */

    console.log(`
╔══════════════════════════════════════╗
║      MODOU LAMIN SANNO PORTFOLIO     ║
╚══════════════════════════════════════╝

Role: Data Science Student
University: Albukhary International University
Focus: Data Science, Machine Learning, Data Analytics, Data Visualization
Status: Seeking Internship Opportunities
GitHub: github.com/modoulaminsanno5-debug
`);

});
