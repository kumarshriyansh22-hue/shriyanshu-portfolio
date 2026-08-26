/* =========================================================
   SHRIYANSHU PORTFOLIO — MAIN JAVASCRIPT
   Visual interactions + navigation + scroll effects
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       SHARED PAGE FALLBACKS
       Older pages use the same navbar but may not include the
       mobile toggle/id markup. Normalise them at runtime.
    ========================================================= */

    const navContainer = document.querySelector(".nav-container");
    let mainNav = document.getElementById("mainNav") || document.querySelector(".navbar nav");
    let menuToggle = document.getElementById("menuToggle");

    if (mainNav && !mainNav.id) {
        mainNav.id = "mainNav";
    }

    if (navContainer && mainNav && !menuToggle) {
        menuToggle = document.createElement("button");
        menuToggle.className = "menu-toggle";
        menuToggle.id = "menuToggle";
        menuToggle.type = "button";
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = "<span></span><span></span>";
        navContainer.insertBefore(menuToggle, mainNav);
    }

    let scrollProgress = document.getElementById("scrollProgress");

    if (!scrollProgress) {
        scrollProgress = document.createElement("div");
        scrollProgress.className = "scroll-progress";
        scrollProgress.id = "scrollProgress";
        document.body.prepend(scrollProgress);
    }

    /* =========================================================
       MOBILE NAVIGATION
    ========================================================= */

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("open");
            menuToggle.classList.toggle("open", isOpen);
            menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        const navLinks = mainNav.querySelectorAll("a");

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("open");
                menuToggle.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", event => {
            if (
                !mainNav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                mainNav.classList.remove("open");
                menuToggle.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 700) {
                mainNav.classList.remove("open");
                menuToggle.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* =========================================================
       SCROLL PROGRESS
    ========================================================= */

    const updateScrollProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

        if (documentHeight <= 0) {
            scrollProgress.style.width = "0%";
            return;
        }

        const progress = (scrollTop / documentHeight) * 100;
        scrollProgress.style.width = `${Math.min(progress, 100)}%`;
    };

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    /* =========================================================
       REVEAL ANIMATIONS
       CSS uses .reveal.visible, so JavaScript must add "visible".
    ========================================================= */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -20px 0px"
            }
        );

        revealElements.forEach(element => revealObserver.observe(element));
    } else {
        revealElements.forEach(element => element.classList.add("visible"));
    }

    /* =========================================================
       ACTIVE NAVIGATION
    ========================================================= */

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navigationLinks = document.querySelectorAll("#mainNav a, .nav-links a");

    navigationLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (!href) return;

        const linkPage = href.split("/").pop();

        if (
            linkPage === currentPage ||
            (currentPage === "" && linkPage === "index.html")
        ) {
            navigationLinks.forEach(navLink => navLink.classList.remove("active"));
            link.classList.add("active");
        }
    });

    /* =========================================================
       SMOOTH INTERNAL LINKS
    ========================================================= */

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    /* =========================================================
       CARD HOVER MICRO-INTERACTION
    ========================================================= */

    const interactiveCards = document.querySelectorAll(
        ".focus-card, .learning-card, .contact-card, .project-row, .project-feature, .work-card, .experience-card, .certification-card"
    );

    interactiveCards.forEach(card => {
        card.addEventListener("mousemove", event => {
            if (window.innerWidth < 768) return;

            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -1.5;
            const rotateY = ((x - centerX) / centerX) * 1.5;

            card.style.transform = `translateY(-4px) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });

    /* =========================================================
       MAGNETIC BUTTON EFFECT
    ========================================================= */

    const buttons = document.querySelectorAll(".btn.primary, .cta-button");

    buttons.forEach(button => {
        button.addEventListener("mousemove", event => {
            if (window.innerWidth < 768) return;

            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const moveX = (x - rect.width / 2) * 0.08;
            const moveY = (y - rect.height / 2) * 0.08;

            button.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        button.addEventListener("mouseleave", () => {
            button.style.transform = "";
        });
    });

    /* =========================================================
       MARQUEE PAUSE ON HOVER
    ========================================================= */

    const marquee = document.querySelector(".marquee-track");

    if (marquee) {
        marquee.addEventListener("mouseenter", () => {
            marquee.style.animationPlayState = "paused";
        });

        marquee.addEventListener("mouseleave", () => {
            marquee.style.animationPlayState = "running";
        });
    }

    /* =========================================================
       PARALLAX HERO EFFECT
    ========================================================= */

    const heroCard = document.querySelector(".hero-card");
    const heroSection = document.querySelector(".home-hero");

    if (heroCard && heroSection && window.innerWidth >= 900) {
        window.addEventListener(
            "scroll",
            () => {
                const scroll = window.scrollY;
                const heroHeight = heroSection.offsetHeight;

                if (scroll > heroHeight) return;

                const movement = scroll * 0.035;
                heroCard.style.transform = `translateY(${movement}px)`;
            },
            { passive: true }
        );
    }

    /* =========================================================
       CURRENT YEAR
    ========================================================= */

    document.querySelectorAll("[data-current-year]").forEach(element => {
        element.textContent = new Date().getFullYear();
    });

    /* =========================================================
       EXTERNAL LINKS
    ========================================================= */

    document.querySelectorAll('a[href^="http://"], a[href^="https://"]').forEach(link => {
        if (!link.getAttribute("target")) {
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");
        }
    });

    /* =========================================================
       REDUCED MOTION ACCESSIBILITY
    ========================================================= */

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const applyMotionPreference = event => {
        if (event.matches) {
            document.documentElement.classList.add("reduce-motion");
            revealElements.forEach(element => element.classList.add("visible"));
        } else {
            document.documentElement.classList.remove("reduce-motion");
        }
    };

    applyMotionPreference(prefersReducedMotion);

    if (prefersReducedMotion.addEventListener) {
        prefersReducedMotion.addEventListener("change", applyMotionPreference);
    }

    document.body.classList.add("page-loaded");
});