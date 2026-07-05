(function () {
    const root = document.documentElement;
    const themeToggle = document.getElementById("theme-toggle");
    const themeLabel = themeToggle ? themeToggle.querySelector("span") : null;
    const themeIcon = themeToggle ? themeToggle.querySelector("i") : null;

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);

        if (!themeToggle || !themeLabel || !themeIcon) {
            return;
        }

        const isLight = theme === "light";
        themeLabel.textContent = isLight ? "Day" : "Night";
        themeIcon.className = isLight ? "bx bx-sun" : "bx bx-moon";
        themeToggle.setAttribute("aria-pressed", String(isLight));
    }

    const savedTheme = localStorage.getItem("site-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
        applyTheme(savedTheme);
    } else {
        const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
        applyTheme(prefersLight ? "light" : "dark");
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
            root.classList.add("theme-animating");
            applyTheme(nextTheme);
            localStorage.setItem("site-theme", nextTheme);

            window.setTimeout(() => {
                root.classList.remove("theme-animating");
            }, 420);
        });
    }

    const copyEmailButton = document.getElementById("copy-email");
    const copyFeedback = document.getElementById("copy-feedback");

    if (copyEmailButton && copyFeedback) {
        copyEmailButton.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText("alexwu0706@gmail.com");
                copyFeedback.textContent = "Email copied: alexwu0706@gmail.com";
            } catch (error) {
                copyFeedback.textContent = "Copy failed. Please email alexwu0706@gmail.com directly.";
            }
        });
    }

    function externalLinksOpenInNewTab() {
        const links = document.querySelectorAll("a[href]");

        links.forEach((link) => {
            const href = link.getAttribute("href");

            if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
                return;
            }

            try {
                const url = new URL(href, window.location.href);
                if (url.origin !== window.location.origin) {
                    link.setAttribute("target", "_blank");

                    const rel = (link.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
                    if (!rel.includes("noopener")) {
                        rel.push("noopener");
                    }
                    if (!rel.includes("noreferrer")) {
                        rel.push("noreferrer");
                    }
                    link.setAttribute("rel", rel.join(" "));
                }
            } catch (error) {
                // Ignore invalid URLs.
            }
        });
    }

    externalLinksOpenInNewTab();

    function initSiteTextMotion() {
        if (!document.body.classList.contains("page-motion")) {
            return;
        }

        const selector = document.body.classList.contains("page-about")
            ? ".about-intro p, .about-story > div, .story-item, #focus-style > div, #focus-style .panel-card, #metrics > div, #metrics .stat-pill, #skills > div, #skills .skill-pill, #contact"
            : "main > section, .panel-card, .job-card, .project-media-card, .story-item, .stat-pill, .recruiter-band";

        const revealTargets = document.querySelectorAll(selector);

        revealTargets.forEach((element, index) => {
            element.classList.add("site-reveal");
            element.style.setProperty("--site-reveal-delay", `${Math.min(index * 55, 480)}ms`);
        });

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
            revealTargets.forEach((element) => element.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries, activeObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");
                    activeObserver.unobserve(entry.target);
                });
            },
            {
                threshold: 0.15,
                rootMargin: "0px 0px -8% 0px"
            }
        );

        revealTargets.forEach((element) => observer.observe(element));
    }

    initSiteTextMotion();

})();
