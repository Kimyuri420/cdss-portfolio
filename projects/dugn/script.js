
/* =========================================
   DUGN — Portfolio Interaction
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================
       01. Lucide Icons
    ===================================== */

    if (window.lucide) {
        window.lucide.createIcons();
    }


    /* =====================================
       02. Reduced Motion
    ===================================== */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================
       03. Code Copy
    ===================================== */

    const copyButtons = document.querySelectorAll(
        ".copy-code, .copy-button"
    );

    const copyTimers = new WeakMap();

    async function copyText(text) {

        if (navigator.clipboard && window.isSecureContext) {

            try {

                await navigator.clipboard.writeText(text);

                return;

            } catch (error) {

                // Clipboard API 실패 시 fallback 실행

            }

        }

        const textarea = document.createElement("textarea");

        textarea.value = text;

        textarea.setAttribute("readonly", "");

        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";

        const previousFocus = document.activeElement;

        document.body.appendChild(textarea);

        textarea.select();

        let copied = false;

        try {

            copied = document.execCommand("copy");

        } finally {

            textarea.remove();

            if (previousFocus instanceof HTMLElement) {
                previousFocus.focus();
            }

        }

        if (!copied) {
            throw new Error("Clipboard copy failed");
        }

    }


    copyButtons.forEach((button) => {

        const originalHTML = button.innerHTML;

        button.addEventListener("click", async () => {

            const panel = button.closest(
                ".implementation-code, .code-panel"
            );

            if (!panel) return;

            const code = panel.querySelector("pre code");

            if (!code) return;

            const oldTimer = copyTimers.get(button);

            if (oldTimer) {
                window.clearTimeout(oldTimer);
            }

            button.classList.remove("copied", "copy-error");

            try {

                await copyText(code.textContent);

                button.classList.add("copied");

                button.innerHTML = `
                    <i data-lucide="check"></i>
                    <span>Copied!</span>
                `;

                button.setAttribute(
                    "aria-label",
                    "Code copied"
                );

            } catch (error) {

                button.classList.add("copy-error");

                button.innerHTML = `
                    <i data-lucide="alert-circle"></i>
                    <span>Copy failed</span>
                `;

                button.setAttribute(
                    "aria-label",
                    "Copy failed"
                );

            }

            if (window.lucide) {
                window.lucide.createIcons();
            }

            const timer = window.setTimeout(() => {

                button.classList.remove(
                    "copied",
                    "copy-error"
                );

                button.innerHTML = originalHTML;

                button.setAttribute(
                    "aria-label",
                    "Copy code"
                );

                if (window.lucide) {
                    window.lucide.createIcons();
                }

            }, 1800);

            copyTimers.set(button, timer);

        });

    });


    /* =====================================
       04. Scroll Reveal Animation
    ===================================== */

    const revealElements = document.querySelectorAll(`
        .meta-card,
        .feature-card,
        .workflow-panel,
        .diagram-panel,
        .scope-card,
        .engineering-card,
        .implementation-card,
        .medical-storage-card,
        .engineering-summary,
        .validation-stat,
        .trouble-card,
        .resource-card
    `);

    if (
        !reducedMotion &&
        "IntersectionObserver" in window
    ) {

        const revealObserver = new IntersectionObserver(

            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(entry.target);

                    }

                });

            },

            {
                threshold: 0,
                rootMargin: "0px 0px -30px 0px"
            }

        );

        revealElements.forEach((element) => {

            element.classList.add("reveal");

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach((element) => {

            element.classList.add("visible");

        });

    }


    /* =====================================
       05. Sidebar Active Navigation
    ===================================== */

    const sections = Array.from(
        document.querySelectorAll(
            ".main-content section[id]"
        )
    );

    const navLinks = Array.from(
        document.querySelectorAll(
            ".section-nav .nav-link"
        )
    );

    function setActiveSection(sectionId) {

        navLinks.forEach((link) => {

            const isActive =
                link.getAttribute("href") ===
                `#${sectionId}`;

            link.classList.toggle(
                "active",
                isActive
            );

            if (isActive) {

                link.setAttribute(
                    "aria-current",
                    "location"
                );

            } else {

                link.removeAttribute(
                    "aria-current"
                );

            }

        });

    }

    function updateActiveSection() {

        if (!sections.length) return;

        const topbar = document.querySelector(".topbar");

        const sidebar = document.querySelector(".sidebar");

        let offset = topbar
            ? topbar.offsetHeight + 45
            : 120;

        if (
            window.innerWidth <= 800 &&
            sidebar
        ) {

            offset += sidebar.offsetHeight;

        }

        let activeSection = sections[0].id;

        sections.forEach((section) => {

            const position =
                section.getBoundingClientRect().top;

            if (position <= offset) {

                activeSection = section.id;

            }

        });

        setActiveSection(activeSection);

    }

    navLinks.forEach((link) => {

        link.addEventListener("click", () => {

            const sectionId = link
                .getAttribute("href")
                .replace("#", "");

            setActiveSection(sectionId);

        });

    });


    /* =====================================
       06. Back to Top
    ===================================== */

    const backToTop = document.getElementById(
        "back-to-top"
    );

    function updateBackToTop() {

        if (!backToTop) return;

        backToTop.classList.toggle(
            "visible",
            window.scrollY > 500
        );

    }

    if (backToTop) {

        backToTop.addEventListener("click", () => {

            window.scrollTo({

                top: 0,

                behavior: reducedMotion
                    ? "auto"
                    : "smooth"

            });

        });

    }


    /* =====================================
       07. Optimized Scroll Events
    ===================================== */

    let ticking = false;

    function handleScroll() {

        if (ticking) return;

        ticking = true;

        window.requestAnimationFrame(() => {

            updateActiveSection();

            updateBackToTop();

            ticking = false;

        });

    }

    window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        handleScroll
    );


    /* =====================================
       08. Accordion Accessibility
    ===================================== */

    const accordions = document.querySelectorAll(
        ".trouble-card"
    );

    accordions.forEach((accordion) => {

        const summary = accordion.querySelector(
            "summary"
        );

        if (!summary) return;

        summary.setAttribute(
            "aria-expanded",
            String(accordion.open)
        );

        accordion.addEventListener("toggle", () => {

            summary.setAttribute(
                "aria-expanded",
                String(accordion.open)
            );

            handleScroll();

        });

    });


    /* =====================================
       09. Initial State
    ===================================== */

    updateActiveSection();

    updateBackToTop();

});
