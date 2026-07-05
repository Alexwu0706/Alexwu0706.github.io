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

})();
