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

    const searchInput = document.getElementById("site-search-input");
    const searchResults = document.getElementById("search-results");
    const searchToggle = document.getElementById("search-toggle");
    const searchContainer = searchInput ? searchInput.closest(".site-search") : null;

    const searchIndex = [
        {
            title: "Home: Intro",
            excerpt: "Role summary, DSP emphasis, and open-to-work status.",
            keywords: ["home", "intro", "open to", "dsp", "analog circuit design", "test engineer", "cambridge industries group"],
            url: "index.html#intro"
        },
        {
            title: "Home: About Me",
            excerpt: "Combined introduction and concise about summary.",
            keywords: ["about", "summary", "engineering", "intro", "home about"],
            url: "index.html#intro"
        },
        {
            title: "About: Story",
            excerpt: "Narrative journey from UCLA foundations to optical validation work.",
            keywords: ["about", "story", "journey", "ucla", "optical validation"],
            url: "about.html#story"
        },
        {
            title: "About: Focus and Style",
            excerpt: "Core focus areas and practical working style.",
            keywords: ["core focus", "working style", "analog circuit design", "firmware testing"],
            url: "about.html#focus-style"
        },
        {
            title: "About: Contact Actions",
            excerpt: "Resume download, email, LinkedIn, and copy-email quick actions.",
            keywords: ["contact", "resume", "linkedin", "email", "copy email"],
            url: "about.html#contact"
        },
        {
            title: "About: Metrics",
            excerpt: "Quantified engineering outcomes and performance data.",
            keywords: ["metrics", "impact", "60%", "18.3s", "results"],
            url: "about.html#metrics"
        },
        {
            title: "About: Capabilities",
            excerpt: "Core capabilities including analog circuit design, optical test, firmware validation, and DSP tooling.",
            keywords: ["skills", "capabilities", "analog circuit design", "automation", "dsp and data tools", "validation"],
            url: "about.html#skills"
        },
        {
            title: "Projects",
            excerpt: "Micromouse, path-following car, ECG design, and more project details.",
            keywords: ["projects", "micromouse", "pid", "ecg", "solar", "sokoban"],
            url: "project.html#projects"
        },
        {
            title: "Toolbelt",
            excerpt: "Programming, DSP, circuit analysis, and engineering toolkit.",
            keywords: ["toolbelt", "python", "matlab", "dsp", "analog circuit", "signal processing", "c++"],
            url: "toolbelt.html#toolbelt"
        },
        {
            title: "Job Experience",
            excerpt: "CIG and ESP test engineering experience timeline.",
            keywords: ["job", "experience", "cig", "esp safety", "optical transceiver"],
            url: "job.html#experience"
        },
        {
            title: "Achievements",
            excerpt: "NCEES FE (2024) milestone and credential-backed engineering track.",
            keywords: ["achievements", "ncees", "fe", "eit", "fundamentals of engineering", "2024", "license"],
            url: "achievements.html#achievements"
        }
    ];

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

    function renderResults(query) {
        if (!searchResults) {
            return;
        }

        const normalized = query.trim().toLowerCase();
        if (normalized.length < 2) {
            searchResults.classList.remove("show");
            searchResults.innerHTML = "";
            return;
        }

        const matches = searchIndex.filter((item) => {
            const haystack = [item.title, item.excerpt, item.keywords.join(" ")].join(" ").toLowerCase();
            return haystack.includes(normalized);
        }).slice(0, 6);

        if (matches.length === 0) {
            searchResults.innerHTML = '<p class="search-empty">No exact match found. Try terms like "DSP", "CIG", or "micromouse".</p>';
            searchResults.classList.add("show");
            return;
        }

        searchResults.innerHTML = matches.map((item) => (
            '<a class="search-result-item" href="' + item.url + '">' +
            '<strong>' + item.title + '</strong>' +
            '<span>' + item.excerpt + '</span>' +
            '</a>'
        )).join("");
        searchResults.classList.add("show");
    }

    if (searchInput && searchResults) {
        if (searchToggle && searchContainer) {
            searchToggle.addEventListener("click", () => {
                const isOpen = searchContainer.classList.toggle("open");
                if (isOpen) {
                    searchInput.focus();
                }
            });
        }

        searchInput.addEventListener("input", (event) => {
            renderResults(event.target.value);
        });

        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                const first = searchResults.querySelector(".search-result-item");
                if (first) {
                    window.location.href = first.getAttribute("href");
                }
            }
        });

        document.addEventListener("click", (event) => {
            const insideSearch = event.target.closest(".site-search");
            if (!insideSearch) {
                searchResults.classList.remove("show");
                if (searchContainer) {
                    searchContainer.classList.remove("open");
                }
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                searchResults.classList.remove("show");
                if (searchContainer) {
                    searchContainer.classList.remove("open");
                }
            }
        });
    }
})();
