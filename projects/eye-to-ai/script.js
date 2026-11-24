
/* =========================================================
   EYE TO AI — Backend Engineering Portfolio
   Interactive Script
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* 01. DOM References */

    const header = document.querySelector(".site-header");
    const mainNav = document.querySelector(".main-nav");
    const menuToggle = document.querySelector(".menu-toggle");
    const scrollProgress = document.querySelector(".scroll-progress");
    const backToTop = document.querySelector(".back-to-top");

    const navLinks = Array.from(
        document.querySelectorAll('.main-nav a[href^="#"]')
    );

    const revealElements = document.querySelectorAll(".reveal");
    const performanceCharts = document.querySelectorAll(".performance-chart");
    const troubleCards = document.querySelectorAll(".trouble-card");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    const mobileBreakpoint = window.matchMedia(
        "(max-width: 900px)"
    );


    /* 02. Mobile Navigation */

    function setMenuState(isOpen) {

        if (!menuToggle || !mainNav) {
            return;
        }

        mainNav.classList.toggle("is-open", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "메뉴 닫기" : "메뉴 열기"
        );
    }

    if (menuToggle && mainNav) {

        setMenuState(false);

        menuToggle.addEventListener("click", () => {

            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            setMenuState(!isOpen);
        });

        mainNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {
                setMenuState(false);
            });
        });

        document.addEventListener("click", event => {

            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (
                isOpen &&
                !mainNav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                setMenuState(false);
            }
        });

        document.addEventListener("keydown", event => {

            if (
                event.key === "Escape" &&
                menuToggle.getAttribute("aria-expanded") === "true"
            ) {
                setMenuState(false);
                menuToggle.focus();
            }
        });

        mobileBreakpoint.addEventListener("change", event => {

            if (!event.matches) {
                setMenuState(false);
            }
        });
    }


    /* 03. Section Mapping */

    const sectionMap = navLinks
        .map(link => {

            const href = link.getAttribute("href");

            if (!href || href === "#") {
                return null;
            }

            const section = document.getElementById(
                href.slice(1)
            );

            if (!section) {
                return null;
            }

            return {
                link,
                section,
                id: section.id
            };
        })
        .filter(Boolean);

    let activeSectionId = null;


    /* 04. Active Navigation */

    function setActiveSection(sectionId) {

        if (activeSectionId === sectionId) {
            return;
        }

        activeSectionId = sectionId;

        sectionMap.forEach(({ link, id }) => {

            const isActive = id === sectionId;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    function updateActiveSection() {

        if (sectionMap.length === 0) {
            return;
        }

        const headerHeight = header
            ? header.offsetHeight
            : 76;

        const offset = headerHeight + 120;

        let currentSection = null;

        sectionMap.forEach(({ section, id }) => {

            const rect = section.getBoundingClientRect();

            if (rect.top <= offset) {
                currentSection = id;
            }
        });

        const documentHeight =
            document.documentElement.scrollHeight;

        const isAtBottom =
            window.scrollY + window.innerHeight >=
            documentHeight - 5;

        if (isAtBottom && window.scrollY > 0) {

            currentSection =
                sectionMap[sectionMap.length - 1].id;
        }

        setActiveSection(currentSection);
    }


    /* 05. Scroll Progress */

    function updateScrollProgress() {

        if (!scrollProgress) {
            return;
        }

        const scrollTop =
            window.scrollY ||
            document.documentElement.scrollTop;

        const scrollableHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress = scrollableHeight > 0
            ? (scrollTop / scrollableHeight) * 100
            : 0;

        const safeProgress = Math.min(
            100,
            Math.max(0, progress)
        );

        scrollProgress.style.width =
            `${safeProgress}%`;

        scrollProgress.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    /* 06. Back to Top */

    function updateBackToTop() {

        if (!backToTop) {
            return;
        }

        const shouldShow = window.scrollY > 500;

        backToTop.hidden = !shouldShow;
    }

    if (backToTop) {

        backToTop.setAttribute(
            "aria-label",
            "페이지 최상단으로 이동"
        );

        backToTop.addEventListener("click", event => {

            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: reducedMotion.matches
                    ? "instant"
                    : "smooth"
            });
        });
    }


    /* 07. Scroll Event Optimization */

    let scrollTicking = false;

    function updateScrollUI() {

        updateScrollProgress();
        updateActiveSection();
        updateBackToTop();

        scrollTicking = false;
    }

    function requestScrollUpdate() {

        if (scrollTicking) {
            return;
        }

        scrollTicking = true;

        window.requestAnimationFrame(
            updateScrollUI
        );
    }

    window.addEventListener(
        "scroll",
        requestScrollUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        requestScrollUpdate
    );

    window.addEventListener(
        "load",
        requestScrollUpdate
    );


    /* 08. Scroll Reveal */

    let revealObserver = null;

    function initializeReveal() {

        if (
            reducedMotion.matches ||
            !("IntersectionObserver" in window)
        ) {

            revealElements.forEach(element => {

                element.classList.remove("reveal-pending");
                element.classList.add("is-visible");
            });

            return;
        }

        revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");

                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.05,
                rootMargin: "0px 0px 0px 0px"
            }
        );

        revealElements.forEach(element => {

            const rect = element.getBoundingClientRect();

            if (rect.top < window.innerHeight) {

                element.classList.add("is-visible");

            } else {

                element.classList.add("reveal-pending");

                revealObserver.observe(element);
            }
        });
    }

    initializeReveal();


    /* 09. Performance Chart Animation */

    let chartObserver = null;

    function initializeCharts() {

        if (
            reducedMotion.matches ||
            !("IntersectionObserver" in window)
        ) {
            return;
        }

        chartObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-animated");

                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.15
            }
        );

        performanceCharts.forEach(chart => {

            chartObserver.observe(chart);
        });
    }

    initializeCharts();


    /* 10. Troubleshooting Accordion */

    troubleCards.forEach(card => {

        const summary = card.querySelector("summary");

        if (!summary) {
            return;
        }

        card.addEventListener("toggle", () => {

            /*
             * Native details/summary handles
             * keyboard and expanded state.
             *
             * Update page progress because
             * expanding a card changes page height.
             */

            requestScrollUpdate();
        });
    });


    /* 11. Anchor Navigation */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const href = link.getAttribute("href");

            if (!href || href === "#") {
                return;
            }

            const target = document.getElementById(
                href.slice(1)
            );

            if (!target) {
                return;
            }

            if (
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            /*
             * Native anchor navigation preserves
             * URL hashes and browser history.
             */

            setMenuState(false);

            if (target.classList.contains("reveal-pending")) {

                target.classList.add("is-visible");

                if (revealObserver) {
                    revealObserver.unobserve(target);
                }
            }
        });
    });


    /* 12. Deep Link Support */

    function revealHashTarget() {

        const hash = window.location.hash;

        if (!hash || hash === "#") {
            return;
        }

        let targetId;

        try {
            targetId = decodeURIComponent(hash.slice(1));
        } catch {
            return;
        }

        const target = document.getElementById(targetId);

        if (!target) {
            return;
        }

        const revealParent = target.closest(".reveal");

        if (revealParent) {

            revealParent.classList.add("is-visible");

            if (revealObserver) {
                revealObserver.unobserve(revealParent);
            }
        }

        requestScrollUpdate();
    }

    window.addEventListener(
        "hashchange",
        revealHashTarget
    );

    revealHashTarget();


    /* 13. Reduced Motion Accessibility */

    reducedMotion.addEventListener("change", event => {

        if (!event.matches) {
            return;
        }

        if (revealObserver) {
            revealObserver.disconnect();
        }

        if (chartObserver) {
            chartObserver.disconnect();
        }

        revealElements.forEach(element => {

            element.classList.remove("reveal-pending");
            element.classList.add("is-visible");
        });

        performanceCharts.forEach(chart => {

            chart.classList.remove("is-animated");
        });
    });


    /* 14. External Link Security */

    document.querySelectorAll('a[target="_blank"]').forEach(link => {

        link.relList.add("noopener");
        link.relList.add("noreferrer");
    });


    /* 15. Initial UI State */

    updateScrollUI();

});

/* End of EYE TO AI Interactive Script */
