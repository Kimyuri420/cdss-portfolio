
/* =========================================================
   VENA ENGINEERING PORTFOLIO

   JavaScript Implementation

   PART 1 - COMMON UTILITIES & PAGE INTERACTIONS
   PART 2 - ARCHITECTURE & PATIENT MANAGEMENT
   PART 3 - MESSAGING & POLLING
   PART 4 - CONSULTATION WORKFLOW
   PART 5 - SCHEDULE & TASK MANAGEMENT
   PART 6 - CLINICAL NOTES
   PART 7 - DATA ENGINEERING & STATE MANAGEMENT
   PART 8 - APPLICATION INITIALIZATION

   All interactive demonstrations use fictional data.
   No real medical data or external API requests are used.
========================================================= */

"use strict";


/* =========================================================
   01. APPLICATION CONFIGURATION
========================================================= */

const VENA_CONFIG = Object.freeze({

    projectName: "VENA",

    version: "1.0.0",

    mobileBreakpoint: 1100,

    backToTopThreshold: 500,

    navigationOffset: 110,

    revealThreshold: 0.08,

    revealRootMargin: "0px 0px -20px 0px",

    maxEventLogs: 8,

    locale: "ko-KR",

    demoMode: true

});


/* =========================================================
   02. DOM UTILITIES
========================================================= */

/**
 * Select a single DOM element.
 */
function $(selector, root = document) {

    return root.querySelector(selector);

}


/**
 * Select multiple DOM elements.
 * Returns a normal Array instead of NodeList.
 */
function $$(selector, root = document) {

    return Array.from(
        root.querySelectorAll(selector)
    );

}


/**
 * Select an element by its HTML ID.
 */
function byId(id) {

    return document.getElementById(id);

}


/**
 * Safely update text content.
 * User input is never inserted through innerHTML.
 */
function setText(element, value) {

    if (!element) {

        return;

    }

    element.textContent = String(value ?? "");

}


/**
 * Safely update hidden state.
 */
function setHidden(element, hidden) {

    if (!element) {

        return;

    }

    element.hidden = Boolean(hidden);

}


/**
 * Safely update disabled state.
 */
function setDisabled(element, disabled) {

    if (!element) {

        return;

    }

    element.disabled = Boolean(disabled);

}


/**
 * Update aria-pressed state.
 */
function setPressed(element, pressed) {

    if (!element) {

        return;

    }

    element.setAttribute(
        "aria-pressed",
        String(Boolean(pressed))
    );

}


/**
 * Update aria-selected state.
 */
function setSelected(element, selected) {

    if (!element) {

        return;

    }

    element.setAttribute(
        "aria-selected",
        String(Boolean(selected))
    );

}


/**
 * Remove all child elements.
 */
function clearElement(element) {

    if (!element) {

        return;

    }

    element.replaceChildren();

}


/**
 * Create a DOM element with optional class and text.
 */
function createElement(
    tagName,
    className = "",
    text = ""
) {

    const element = document.createElement(tagName);

    if (className) {

        element.className = className;

    }

    if (text !== "") {

        element.textContent = String(text);

    }

    return element;

}


/* =========================================================
   03. NUMBER UTILITIES
========================================================= */

/**
 * Restrict a number to a given range.
 */
function clamp(value, minimum, maximum) {

    return Math.min(
        maximum,
        Math.max(minimum, value)
    );

}


/**
 * Convert input to a finite number.
 */
function toNumber(value, fallback = 0) {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;

}


/**
 * Format numbers for readable display.
 */
function formatNumber(value, digits = 0) {

    const number = toNumber(value);

    return new Intl.NumberFormat(
        VENA_CONFIG.locale,
        {
            maximumFractionDigits: digits
        }
    ).format(number);

}


/**
 * Calculate a safe percentage.
 */
function calculatePercent(value, total) {

    const numerator = toNumber(value);

    const denominator = toNumber(total);

    if (denominator <= 0) {

        return 0;

    }

    return clamp(
        (numerator / denominator) * 100,
        0,
        100
    );

}


/**
 * Update a progress bar.
 */
function setProgress(element, percent) {

    if (!element) {

        return;

    }

    const safePercent = clamp(
        toNumber(percent),
        0,
        100
    );

    element.style.width = `${safePercent}%`;

    element.setAttribute(
        "aria-valuenow",
        String(Math.round(safePercent))
    );

}


/* =========================================================
   04. DATE & TIME UTILITIES
========================================================= */

function padNumber(value) {

    return String(value).padStart(2, "0");

}


/**
 * Convert a Date to local YYYY-MM-DD.
 * Avoids UTC conversion through toISOString().
 */
function formatLocalDate(date = new Date()) {

    const year = date.getFullYear();

    const month = padNumber(
        date.getMonth() + 1
    );

    const day = padNumber(
        date.getDate()
    );

    return `${year}-${month}-${day}`;

}


/**
 * Parse YYYY-MM-DD into a local Date.
 * Invalid calendar dates are rejected.
 */
function parseLocalDate(value) {

    if (
        typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {

        return null;

    }

    const [year, month, day] = value
        .split("-")
        .map(Number);

    const date = new Date(0);

    date.setFullYear(year, month - 1, day);

    date.setHours(0, 0, 0, 0);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {

        return null;

    }

    return date;

}


/**
 * Format current local time.
 */
function formatCurrentTime() {

    const now = new Date();

    return [
        padNumber(now.getHours()),
        padNumber(now.getMinutes()),
        padNumber(now.getSeconds())
    ].join(":");

}


/**
 * Convert seconds to MM:SS.
 */
function formatDuration(seconds) {

    const total = Math.max(
        0,
        Math.floor(toNumber(seconds))
    );

    const minutes = Math.floor(total / 60);

    const remainingSeconds = total % 60;

    return (
        `${padNumber(minutes)}:` +
        `${padNumber(remainingSeconds)}`
    );

}


/**
 * Check whether a date belongs to an inclusive range.
 */
function isDateInRange(
    targetDate,
    startDate,
    endDate
) {

    const target = parseLocalDate(targetDate);

    const start = parseLocalDate(startDate);

    const end = parseLocalDate(endDate);

    if (!target || !start || !end) {

        return false;

    }

    return (
        target.getTime() >= start.getTime() &&
        target.getTime() <= end.getTime()
    );

}


/* =========================================================
   05. DATA UTILITIES
========================================================= */

let demoIdSequence = 0;


/**
 * Generate a local identifier for demo records.
 */
function createDemoId(prefix = "demo") {

    demoIdSequence += 1;

    return (
        `${prefix}-` +
        `${Date.now()}-` +
        `${demoIdSequence}`
    );

}


/**
 * Copy JSON-compatible demonstration data.
 */
function cloneData(value) {

    if (typeof structuredClone === "function") {

        return structuredClone(value);

    }

    return JSON.parse(
        JSON.stringify(value)
    );

}


/**
 * Display formatted JSON safely.
 */
function renderJson(element, value) {

    if (!element) {

        return;

    }

    element.textContent = JSON.stringify(
        value,
        null,
        2
    );

}


/**
 * Normalize text for case-insensitive search.
 */
function normalizeSearch(value) {

    return String(value ?? "")
        .normalize("NFC")
        .trim()
        .toLowerCase();

}


/* =========================================================
   06. EVENT LOG UTILITIES
========================================================= */

/**
 * Add a timestamped event to a demo event log.
 */
function addEventLog(
    container,
    message,
    type = "info"
) {

    if (!container) {

        return;

    }

    const allowedTypes = [
        "info",
        "success",
        "warning",
        "error"
    ];

    const safeType = allowedTypes.includes(type)
        ? type
        : "info";

    const tagName = ["UL", "OL"].includes(
        container.tagName
    )
        ? "li"
        : "div";

    const item = createElement(
        tagName,
        `demo-log-item log-${safeType}`
    );

    const time = createElement(
        "span",
        "demo-log-time",
        formatCurrentTime()
    );

    const content = createElement(
        "span",
        "demo-log-message",
        message
    );

    item.append(time, content);

    container.prepend(item);

    while (
        container.children.length >
        VENA_CONFIG.maxEventLogs
    ) {

        container.lastElementChild?.remove();

    }

}


/**
 * Update an accessible status message.
 */
function setFeedback(
    element,
    message,
    type = "info"
) {

    if (!element) {

        return;

    }

    element.classList.remove(
        "success",
        "error",
        "warning",
        "info",
        "is-success",
        "is-error",
        "is-warning",
        "is-info"
    );

    const allowedTypes = [
        "info",
        "success",
        "warning",
        "error"
    ];

    const safeType = allowedTypes.includes(type)
        ? type
        : "info";

    element.classList.add(
        safeType,
        `is-${safeType}`
    );

    element.dataset.status = safeType;

    element.setAttribute(
        "aria-live",
        safeType === "error"
            ? "assertive"
            : "polite"
    );

    setText(element, message);

}


/* =========================================================
   07. ACCESSIBILITY UTILITIES
========================================================= */

function prefersReducedMotion() {

    return window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

}


/**
 * Scroll to an element while respecting motion preferences.
 */
function scrollToElement(element) {

    if (!element) {

        return;

    }

    element.scrollIntoView({

        behavior: prefersReducedMotion()
            ? "instant"
            : "smooth",

        block: "start"

    });

}


/* =========================================================
   08. SAFE MODULE INITIALIZATION
========================================================= */

const venaModuleRegistry = new Map();


/**
 * Initialize each module independently.
 * A failure in one demo does not stop other demos.
 */
function initializeModule(name, initializer) {

    if (venaModuleRegistry.has(name)) {

        return;

    }

    try {

        const result = initializer();

        venaModuleRegistry.set(
            name,
            result === false
                ? "skipped"
                : "initialized"
        );

    } catch (error) {

        venaModuleRegistry.set(
            name,
            "failed"
        );

        console.error(
            `[VENA] Module failed: ${name}`,
            error
        );

    }

}


/**
 * Print module status during final validation.
 */
function printModuleStatus() {

    const results = Array.from(
        venaModuleRegistry.entries()
    ).map(([module, status]) => ({

        module,

        status

    }));

    console.table(results);

}


/* =========================================================
   09. MOBILE NAVIGATION
========================================================= */

function initMobileNavigation() {

    const header = byId("siteHeader");

    const navigation = byId("mainNav");

    const toggle = byId("menuToggle");

    if (!header || !navigation || !toggle) {

        return false;

    }

    const mobileMedia = window.matchMedia(
        `(max-width: ${VENA_CONFIG.mobileBreakpoint}px)`
    );

    const navigationLinks = $$(
        "a[href]",
        navigation
    );

    let isOpen = false;


    function updateMenu(open) {

        isOpen = Boolean(open) &&
            mobileMedia.matches;

        navigation.classList.toggle(
            "is-open",
            isOpen
        );

        toggle.classList.toggle(
            "is-active",
            isOpen
        );

        toggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        toggle.setAttribute(
            "aria-label",
            isOpen
                ? "메뉴 닫기"
                : "메뉴 열기"
        );

        if (mobileMedia.matches) {

            navigation.setAttribute(
                "aria-hidden",
                String(!isOpen)
            );

        } else {

            navigation.removeAttribute(
                "aria-hidden"
            );

        }

    }


    function closeMenu(restoreFocus = false) {

        updateMenu(false);

        if (restoreFocus) {

            toggle.focus();

        }

    }


    toggle.setAttribute(
        "aria-controls",
        "mainNav"
    );


    toggle.addEventListener(
        "click",
        () => updateMenu(!isOpen)
    );


    navigationLinks.forEach((link) => {

        link.addEventListener(
            "click",
            () => closeMenu()
        );

    });


    document.addEventListener(
        "click",
        (event) => {

            if (!isOpen) {

                return;

            }

            if (!header.contains(event.target)) {

                closeMenu();

            }

        }
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                isOpen
            ) {

                closeMenu(true);

            }

        }
    );


    mobileMedia.addEventListener(
        "change",
        () => closeMenu()
    );


    updateMenu(false);

}


/* =========================================================
   10. SCROLL PROGRESS
========================================================= */

function initScrollProgress() {

    const progress = byId("scrollProgress");

    const header = byId("siteHeader");

    if (!progress) {

        return false;

    }

    let scheduled = false;


    function updateProgress() {

        const root = document.documentElement;

        const scrollTop = window.scrollY;

        const scrollableHeight =
            root.scrollHeight - window.innerHeight;

        const percent = scrollableHeight > 0
            ? clamp(
                (scrollTop / scrollableHeight) * 100,
                0,
                100
            )
            : 0;

        progress.style.width = `${percent}%`;

        if (header) {

            header.classList.toggle(
                "is-scrolled",
                scrollTop > 20
            );

        }

        scheduled = false;

    }


    function requestUpdate() {

        if (scheduled) {

            return;

        }

        scheduled = true;

        window.requestAnimationFrame(
            updateProgress
        );

    }


    window.addEventListener(
        "scroll",
        requestUpdate,
        { passive: true }
    );


    window.addEventListener(
        "resize",
        requestUpdate
    );


    window.addEventListener(
        "load",
        requestUpdate
    );


    if ("ResizeObserver" in window) {

        const observer = new ResizeObserver(
            requestUpdate
        );

        observer.observe(document.body);

    }


    updateProgress();

}


/* =========================================================
   11. ACTIVE SECTION NAVIGATION
========================================================= */

function initActiveNavigation() {

    const navigation = byId("mainNav");

    const header = byId("siteHeader");

    if (!navigation) {

        return false;

    }

    const links = $$(
        'a[href^="#"]',
        navigation
    );

    const sections = links
        .map((link) => {

            const id = link
                .getAttribute("href")
                .slice(1);

            return {

                id,

                link,

                element: byId(id)

            };

        })
        .filter((item) => item.element);

    if (!sections.length) {

        return false;

    }

    let currentSection = null;

    let scheduled = false;


    function activateSection(id) {

        if (currentSection === id) {

            return;

        }

        currentSection = id;

        sections.forEach((section) => {

            const active = section.id === id;

            section.link.classList.toggle(
                "is-active",
                active
            );

            section.link.classList.toggle(
                "active",
                active
            );

            if (active) {

                section.link.setAttribute(
                    "aria-current",
                    "location"
                );

            } else {

                section.link.removeAttribute(
                    "aria-current"
                );

            }

        });

    }


    function updateActiveSection() {

        const offset = header
            ? header.offsetHeight + 34
            : VENA_CONFIG.navigationOffset;

        let activeId = null;

        sections.forEach((section) => {

            const position = section.element
                .getBoundingClientRect().top;

            if (position <= offset) {

                activeId = section.id;

            }

        });

        activateSection(activeId);

        scheduled = false;

    }


    function requestUpdate() {

        if (scheduled) {

            return;

        }

        scheduled = true;

        window.requestAnimationFrame(
            updateActiveSection
        );

    }


    window.addEventListener(
        "scroll",
        requestUpdate,
        { passive: true }
    );


    window.addEventListener(
        "resize",
        requestUpdate
    );


    window.addEventListener(
        "hashchange",
        requestUpdate
    );


    updateActiveSection();

}


/* =========================================================
   12. BACK TO TOP
========================================================= */

function initBackToTop() {

    const button = byId("backToTop");

    if (!button) {

        return false;

    }

    let scheduled = false;


    function updateVisibility() {

        const visible =
            window.scrollY >
            VENA_CONFIG.backToTopThreshold;

        button.classList.toggle(
            "is-visible",
            visible
        );

        button.setAttribute(
            "aria-hidden",
            String(!visible)
        );

        button.tabIndex = visible ? 0 : -1;

        scheduled = false;

    }


    function requestUpdate() {

        if (scheduled) {

            return;

        }

        scheduled = true;

        window.requestAnimationFrame(
            updateVisibility
        );

    }


    button.setAttribute(
        "aria-label",
        "페이지 맨 위로 이동"
    );


    button.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            window.scrollTo({

                top: 0,

                behavior: prefersReducedMotion()
                    ? "instant"
                    : "smooth"

            });

        }
    );


    window.addEventListener(
        "scroll",
        requestUpdate,
        { passive: true }
    );


    updateVisibility();

}


/* =========================================================
   13. SCROLL REVEAL ANIMATION
========================================================= */

function initScrollReveal() {

    const elements = $$(".reveal");

    if (!elements.length) {

        return false;

    }


    function revealElement(element) {

        element.classList.add(
            "is-visible"
        );

    }


    function revealAll() {

        elements.forEach(revealElement);

    }


    if (
        prefersReducedMotion() ||
        !("IntersectionObserver" in window)
    ) {

        revealAll();

        return;

    }


    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {

                    return;

                }

                revealElement(entry.target);

                observer.unobserve(
                    entry.target
                );

            });

        },

        {

            threshold: VENA_CONFIG.revealThreshold,

            rootMargin: VENA_CONFIG.revealRootMargin

        }

    );


    elements.forEach((element) => {

        const rect = element.getBoundingClientRect();

        const initiallyVisible =
            rect.top < window.innerHeight &&
            rect.bottom > 0;

        if (initiallyVisible) {

            revealElement(element);

        } else {

            observer.observe(element);

        }

    });


    /*
     * Enable hidden animation states only after
     * IntersectionObserver is successfully configured.
     */

    document.documentElement.classList.add(
        "js-enabled"
    );


    /*
     * Keyboard navigation should never leave
     * focused content visually hidden.
     */

    document.addEventListener(
        "focusin",
        (event) => {

            const revealContainer =
                event.target.closest(".reveal");

            if (revealContainer) {

                revealElement(revealContainer);

                observer.unobserve(
                    revealContainer
                );

            }

        }
    );


    const motionMedia = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


    motionMedia.addEventListener(
        "change",
        (event) => {

            if (event.matches) {

                revealAll();

                observer.disconnect();

            }

        }
    );

}


/* =========================================================
   14. SKIP LINK ACCESSIBILITY
========================================================= */

function initSkipLink() {

    const skipLink = $(".skip-link");

    const mainContent = byId("mainContent");

    if (!skipLink || !mainContent) {

        return false;

    }

    if (!mainContent.hasAttribute("tabindex")) {

        mainContent.setAttribute(
            "tabindex",
            "-1"
        );

    }


    skipLink.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            mainContent.focus({

                preventScroll: true

            });

            scrollToElement(mainContent);

        }
    );

}


/* =========================================================
   15. COMMON UI INITIALIZATION
========================================================= */

function initCommonUI() {

    initializeModule(
        "Mobile Navigation",
        initMobileNavigation
    );

    initializeModule(
        "Scroll Progress",
        initScrollProgress
    );

    initializeModule(
        "Active Navigation",
        initActiveNavigation
    );

    initializeModule(
        "Back to Top",
        initBackToTop
    );

    initializeModule(
        "Scroll Reveal",
        initScrollReveal
    );

    initializeModule(
        "Skip Link",
        initSkipLink
    );

}


/* =========================================================
   PART 1 END

   NEXT:
   API LIFECYCLE DEMONSTRATION
   PATIENT SEARCH
   PATIENT DETAIL
   RECENT PATIENT MANAGEMENT

   Note:
   Application initialization will be added in PART 8.
========================================================= */

/* =========================================================
   PART 2
   API LIFECYCLE & PATIENT MANAGEMENT

   All records and API responses are fictional.
   No external network requests are performed.
========================================================= */


/* =========================================================
   16. API LIFECYCLE DEMO DATA
========================================================= */

const VENA_API_STEPS = Object.freeze([

    {
        title: "View — 사용자 이벤트",

        description:
            "사용자가 환자 목록 화면에 진입하거나 " +
            "새로고침을 실행하면 ViewModel에 " +
            "데이터 조회를 요청합니다.",

        file:
            "features/patient/view/",

        code: [
            "// Simplified Flutter example",
            "",
            "final viewModel =",
            "    context.read<PatientListViewModel>();",
            "",
            "await viewModel.loadPatients();"
        ].join("\n")
    },

    {
        title: "ViewModel — 상태 관리",

        description:
            "ViewModel은 로딩 상태를 변경하고 " +
            "Repository에 환자 목록 조회를 요청합니다. " +
            "요청이 완료되면 상태를 갱신합니다.",

        file:
            "features/patient/view_model/",

        code: [
            "// Simplified state management",
            "",
            "_isLoading = true;",
            "notifyListeners();",
            "",
            "try {",
            "  _patients = await repository.getPatients();",
            "} finally {",
            "  _isLoading = false;",
            "  notifyListeners();",
            "}"
        ].join("\n")
    },

    {
        title: "Repository — 인증 및 데이터 접근",

        description:
            "Repository는 저장된 Access Token을 " +
            "확인하고 Service에 전달합니다. " +
            "인증 정보가 없는 경우 요청을 중단합니다.",

        file:
            "features/patient/repository/",

        code: [
            "// Simplified authentication guard",
            "",
            "final token = await readAccessToken();",
            "",
            "if (token == null || token.trim().isEmpty) {",
            "  throw Exception('Authentication required');",
            "}",
            "",
            "return service.getPatients(token);"
        ].join("\n")
    },

    {
        title: "Service — HTTP 요청 구성",

        description:
            "Service에서 환자 목록 API 주소와 " +
            "Authorization 헤더를 구성합니다. " +
            "HTTP 통신은 Dio를 통해 처리합니다.",

        file:
            "features/patient/service/",

        code: [
            "// Simplified HTTP request",
            "",
            "final response = await dio.get(",
            "  '/api/patients/',",
            "  options: Options(",
            "    headers: {",
            "      'Authorization': 'Bearer $token',",
            "    },",
            "  ),",
            ");"
        ].join("\n")
    },

    {
        title: "Backend API — 요청 및 응답",

        description:
            "Django API는 요청을 처리하고 " +
            "환자 데이터를 JSON 형태로 반환합니다. " +
            "아래 응답은 실제 서버 데이터가 아닌 예시입니다.",

        file:
            "GET /api/patients/",

        code: JSON.stringify({

            status: 200,

            results: [

                {
                    patient_id: "DEMO-001",
                    name: "가상 환자 A",
                    age: 52,
                    gender: "female"
                },

                {
                    patient_id: "DEMO-002",
                    name: "가상 환자 B",
                    age: 61,
                    gender: "male"
                }

            ]

        }, null, 2)
    },

    {
        title: "Model & View — 데이터 변환 및 갱신",

        description:
            "응답 JSON을 Patient 모델로 변환하고 " +
            "ViewModel의 상태를 갱신합니다. " +
            "View는 변경된 상태를 구독하여 화면을 다시 구성합니다.",

        file:
            "features/patient/model/",

        code: [
            "// Simplified model conversion",
            "",
            "final patients = items",
            "    .map((item) => Patient.fromJson(item))",
            "    .toList();",
            "",
            "// ViewModel",
            "_patients = patients;",
            "notifyListeners();",
            "",
            "// View",
            "final state =",
            "    context.watch<PatientListViewModel>();"
        ].join("\n")
    }

]);


/* =========================================================
   17. API LIFECYCLE DEMONSTRATION
========================================================= */

function initApiLifecycleDemo() {

    const root = byId("apiLifecycleDemo");

    if (!root) {

        return false;

    }

    const stepButtons = $$(
        "[data-api-step]",
        root
    );

    const counter = byId("apiStepCounter");

    const title = byId("apiStepTitle");

    const description = byId("apiStepDescription");

    const file = byId("apiStepFile");

    const code = byId("apiStepCode");

    const resetButton = byId("apiResetButton");

    const nextButton = byId("apiNextButton");

    if (
        !stepButtons.length ||
        !counter ||
        !title ||
        !description ||
        !file ||
        !code ||
        !resetButton ||
        !nextButton
    ) {

        console.warn(
            "[VENA] API Lifecycle elements missing."
        );

        return false;

    }

    let currentStep = 0;

    const nextButtonLabel =
        nextButton.textContent.trim() || "다음 단계";


    function renderStep(index) {

        currentStep = clamp(

            Math.floor(toNumber(index)),

            0,

            VENA_API_STEPS.length - 1

        );

        const step = VENA_API_STEPS[currentStep];

        setText(

            counter,

            `${padNumber(currentStep + 1)} / ` +
            `${padNumber(VENA_API_STEPS.length)}`

        );

        setText(title, step.title);

        setText(description, step.description);

        setText(file, step.file);

        setText(code, step.code);


        stepButtons.forEach((button) => {

            const buttonIndex = Number(
                button.dataset.apiStep
            );

            const active =
                buttonIndex === currentStep;

            const completed =
                buttonIndex < currentStep;

            button.classList.toggle(
                "active",
                active
            );

            button.classList.toggle(
                "is-active",
                active
            );

            button.classList.toggle(
                "completed",
                completed
            );

            setPressed(button, active);

        });


        const isLastStep =
            currentStep === VENA_API_STEPS.length - 1;

        setText(

            nextButton,

            isLastStep
                ? "처음부터 다시 보기"
                : nextButtonLabel

        );

    }


    stepButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                renderStep(
                    Number(button.dataset.apiStep)
                );

            }
        );

    });


    nextButton.addEventListener(
        "click",
        () => {

            const nextIndex =
                currentStep >= VENA_API_STEPS.length - 1
                    ? 0
                    : currentStep + 1;

            renderStep(nextIndex);

        }
    );


    resetButton.addEventListener(
        "click",
        () => renderStep(0)
    );


    counter.setAttribute(
        "aria-live",
        "polite"
    );


    renderStep(0);

}


/* =========================================================
   18. FICTIONAL PATIENT DATA
========================================================= */

const VENA_DEMO_PATIENTS = Object.freeze([

    Object.freeze({

        id: "DEMO-001",

        name: "가상 환자 A",

        age: 52,

        gender: "female",

        genderLabel: "여성",

        avatar: "A"

    }),

    Object.freeze({

        id: "DEMO-002",

        name: "가상 환자 B",

        age: 61,

        gender: "male",

        genderLabel: "남성",

        avatar: "B"

    }),

    Object.freeze({

        id: "DEMO-003",

        name: "가상 환자 C",

        age: 45,

        gender: "female",

        genderLabel: "여성",

        avatar: "C"

    }),

    Object.freeze({

        id: "DEMO-004",

        name: "가상 환자 D",

        age: 58,

        gender: "male",

        genderLabel: "남성",

        avatar: "D"

    }),

    Object.freeze({

        id: "DEMO-005",

        name: "가상 환자 E",

        age: 49,

        gender: "female",

        genderLabel: "여성",

        avatar: "E"

    })

]);


/* =========================================================
   19. PATIENT DATA UTILITIES
========================================================= */

/**
 * Find a fictional patient by ID.
 */
function findDemoPatient(patientId) {

    return VENA_DEMO_PATIENTS.find(
        (patient) => patient.id === patientId
    ) ?? null;

}


/**
 * Generate an illustrative API endpoint.
 */
function getDemoPatientEndpoint(patientId) {

    return (
        "/api/patients/" +
        encodeURIComponent(patientId) +
        "/"
    );

}


/**
 * Generate an illustrative patient detail response.
 *
 * This is not a captured production API response.
 */
function createDemoPatientResponse(patient) {

    if (!patient) {

        return null;

    }

    return {

        patient: {

            patient_id: patient.id,

            name: patient.name,

            age: patient.age,

            gender: patient.gender

        },

        examinations: [],

        ai_results: []

    };

}


/**
 * Search fictional patient records.
 *
 * Search fields:
 * - Patient ID
 * - Patient name
 */
function searchDemoPatients(query) {

    const keyword = normalizeSearch(query);

    if (!keyword) {

        return [...VENA_DEMO_PATIENTS];

    }

    return VENA_DEMO_PATIENTS.filter(
        (patient) => {

            const searchableText = normalizeSearch(

                `${patient.id} ${patient.name}`

            );

            return searchableText.includes(keyword);

        }
    );

}


/* =========================================================
   20. PATIENT MANAGEMENT DEMONSTRATION
========================================================= */

function initPatientManagementDemo() {

    const root = byId("patientSearchDemo");

    if (!root) {

        return false;

    }

    const elements = {

        input: byId("patientSearchInput"),

        reset: byId("patientSearchReset"),

        count: byId("patientResultCount"),

        list: byId("patientDemoList"),

        empty: byId("patientEmptyState"),

        avatar: byId("patientDetailAvatar"),

        name: byId("patientDetailName"),

        detailId: byId("patientDetailId"),

        fieldId: byId("patientFieldId"),

        age: byId("patientFieldAge"),

        gender: byId("patientFieldGender"),

        endpoint: byId("patientApiEndpoint"),

        json: byId("patientJsonOutput"),

        recentList: byId("recentPatientDemoList"),

        clearRecent: byId("clearRecentPatients")

    };


    const missingElements = Object.entries(elements)

        .filter(([, element]) => !element)

        .map(([name]) => name);


    if (missingElements.length) {

        console.warn(

            "[VENA] Patient demo elements missing:",

            missingElements

        );

        return false;

    }


    const patientRows = $$(
        "[data-patient-id]",
        elements.list
    );


    if (!patientRows.length) {

        return false;

    }


    const initialPatientId =
        VENA_DEMO_PATIENTS[0].id;


    const state = {

        query: "",

        selectedPatientId: initialPatientId,

        recentPatientIds: [],

        maxRecentPatients: 10

    };


    /* -----------------------------------------------------
       20-1. Render patient detail
    ----------------------------------------------------- */

    function renderPatientDetail() {

        const patient = findDemoPatient(
            state.selectedPatientId
        );

        if (!patient) {

            setText(elements.avatar, "—");

            setText(elements.name, "환자를 선택해 주세요.");

            setText(elements.detailId, "—");

            setText(elements.fieldId, "—");

            setText(elements.age, "—");

            setText(elements.gender, "—");

            setText(elements.endpoint, "—");

            renderJson(elements.json, null);

            return;

        }


        setText(
            elements.avatar,
            patient.avatar
        );

        setText(
            elements.name,
            patient.name
        );

        setText(
            elements.detailId,
            patient.id
        );

        setText(
            elements.fieldId,
            patient.id
        );

        setText(
            elements.age,
            `${patient.age}세`
        );

        setText(
            elements.gender,
            patient.genderLabel
        );

        setText(

            elements.endpoint,

            `GET ${getDemoPatientEndpoint(patient.id)}`

        );


        renderJson(

            elements.json,

            createDemoPatientResponse(patient)

        );

    }


    /* -----------------------------------------------------
       20-2. Update selected patient row
    ----------------------------------------------------- */

    function renderSelectedPatient() {

        patientRows.forEach((row) => {

            const selected =
                row.dataset.patientId ===
                state.selectedPatientId;

            row.classList.toggle(
                "active",
                selected
            );

            row.classList.toggle(
                "selected",
                selected
            );

            row.classList.toggle(
                "is-selected",
                selected
            );

            setPressed(row, selected);

            if (
                ["option", "tab", "row"].includes(
                    row.getAttribute("role")
                )
            ) {

                setSelected(row, selected);

            }

        });

    }


    /* -----------------------------------------------------
       20-3. Render search results
    ----------------------------------------------------- */

    function renderSearchResults() {

        const results = searchDemoPatients(
            state.query
        );

        const resultIds = new Set(

            results.map(
                (patient) => patient.id
            )

        );


        patientRows.forEach((row) => {

            const visible = resultIds.has(
                row.dataset.patientId
            );

            setHidden(row, !visible);

        });


        setText(

            elements.count,

            `${results.length}명 / ` +
            `${VENA_DEMO_PATIENTS.length}명`

        );


        setHidden(
            elements.empty,
            results.length !== 0
        );


        renderSelectedPatient();

    }


    /* -----------------------------------------------------
       20-4. Update recent patients

       - Deduplicate by patient ID
       - Most recently viewed patient first
       - Maximum 10 records
       - In-memory state only
    ----------------------------------------------------- */

    function rememberPatient(patientId) {

        if (!findDemoPatient(patientId)) {

            return;

        }

        state.recentPatientIds = [

            patientId,

            ...state.recentPatientIds.filter(
                (id) => id !== patientId
            )

        ].slice(

            0,

            state.maxRecentPatients

        );

    }


    /* -----------------------------------------------------
       20-5. Render recent patient list
    ----------------------------------------------------- */

    function renderRecentPatients() {

        clearElement(elements.recentList);


        setDisabled(

            elements.clearRecent,

            state.recentPatientIds.length === 0

        );


        const listTag = ["UL", "OL"].includes(
            elements.recentList.tagName
        )
            ? "li"
            : "div";


        if (!state.recentPatientIds.length) {

            const empty = createElement(

                listTag,

                "recent-patient-empty empty-state",

                "최근 조회한 환자가 없습니다."

            );

            elements.recentList.append(empty);

            return;

        }


        state.recentPatientIds.forEach((id) => {

            const patient = findDemoPatient(id);

            if (!patient) {

                return;

            }


            const item = createElement(

                listTag,

                "recent-patient-item"

            );


            const button = createElement(

                "button",

                "recent-patient-button"

            );


            button.type = "button";

            button.dataset.recentPatientId = id;

            button.setAttribute(

                "aria-label",

                `${patient.name} 상세 정보 조회`

            );


            const avatar = createElement(

                "span",

                "recent-patient-avatar",

                patient.avatar

            );


            avatar.setAttribute(
                "aria-hidden",
                "true"
            );


            const info = createElement(

                "span",

                "recent-patient-info"

            );


            const name = createElement(

                "strong",

                "recent-patient-name",

                patient.name

            );


            const patientId = createElement(

                "small",

                "recent-patient-id",

                patient.id

            );


            info.append(
                name,
                patientId
            );


            button.append(
                avatar,
                info
            );


            button.addEventListener(
                "click",
                () => {

                    state.query = "";

                    elements.input.value = "";

                    selectPatient(patient.id);

                    const selectedRow = patientRows.find(
                        (row) =>
                            row.dataset.patientId === patient.id
                    );

                    selectedRow?.focus({
                        preventScroll: true
                    });

                }
            );


            item.append(button);

            elements.recentList.append(item);

        });

    }


    /* -----------------------------------------------------
       20-6. Select patient
    ----------------------------------------------------- */

    function selectPatient(

        patientId,

        trackRecent = true

    ) {

        const patient = findDemoPatient(patientId);

        if (!patient) {

            return;

        }


        state.selectedPatientId = patient.id;


        if (trackRecent) {

            rememberPatient(patient.id);

        }


        renderSearchResults();

        renderPatientDetail();

        renderRecentPatients();

    }


    /* -----------------------------------------------------
       20-7. Reset search
    ----------------------------------------------------- */

    function resetSearch() {

        state.query = "";

        elements.input.value = "";

        renderSearchResults();

        elements.input.focus();

    }


    /* -----------------------------------------------------
       20-8. Bind user events
    ----------------------------------------------------- */

    elements.input.addEventListener(

        "input",

        (event) => {

            state.query = event.target.value;

            renderSearchResults();

        }

    );


    elements.input.addEventListener(

        "keydown",

        (event) => {

            if (event.key === "Escape") {

                resetSearch();

            }

            if (event.key === "Enter") {

                event.preventDefault();

                const results = searchDemoPatients(
                    state.query
                );

                if (results.length) {

                    selectPatient(results[0].id);

                }

            }

        }

    );


    elements.reset.addEventListener(

        "click",

        resetSearch

    );


    patientRows.forEach((row) => {

        row.addEventListener(

            "click",

            () => {

                selectPatient(
                    row.dataset.patientId
                );

            }

        );

    });


    elements.clearRecent.addEventListener(

        "click",

        () => {

            state.recentPatientIds = [];

            renderRecentPatients();

        }

    );


    elements.count.setAttribute(

        "aria-live",

        "polite"

    );


    /* -----------------------------------------------------
       20-9. Initial render
    ----------------------------------------------------- */

    elements.input.value = "";

    selectPatient(

        initialPatientId,

        false

    );

}


/* =========================================================
   21. ARCHITECTURE & PATIENT INITIALIZATION
========================================================= */

function initArchitectureAndPatient() {

    initializeModule(

        "API Lifecycle",

        initApiLifecycleDemo

    );

    initializeModule(

        "Patient Management",

        initPatientManagementDemo

    );

}


/* =========================================================
   PART 2 END

   NEXT:
   MESSAGING DEMONSTRATION
   CHAT ROOM MANAGEMENT
   SHARED RESOURCE STATUS
   POLLING REQUEST CALCULATOR

   Note:
   Application initialization will be added in PART 8.
========================================================= */

/* =========================================================
   PART 3
   MESSAGING & POLLING CALCULATOR

   Fictional messaging demonstration.
   No real messages, network requests or WebSocket connections.
========================================================= */


/* =========================================================
   22. CHAT DEMONSTRATION DATA
========================================================= */

const VENA_CHAT_ROOMS = [

    {
        id: "room-a",
        name: "의료진 A",
        department: "순환기내과",
        unreadCount: 0,

        messages: [

            {
                id: "message-a1",
                direction: "received",
                type: "text",
                content: "환자 검사 결과를 확인 부탁드립니다.",
                time: "09:10",
                isRead: true
            },

            {
                id: "resource-a",
                direction: "received",
                type: "resource",
                resourceType: "examination",
                title: "관상동맥 검사 자료",
                patientId: "DEMO-001",
                content: "검사 자료를 공유했습니다.",
                resourceStatus: "unread",
                time: "09:11",
                isRead: true
            },

            {
                id: "message-a2",
                direction: "sent",
                type: "text",
                content: "네, 확인 후 답변드리겠습니다.",
                time: "09:12",
                isRead: true
            }

        ]
    },

    {
        id: "room-b",
        name: "의료진 B",
        department: "영상의학과",
        unreadCount: 2,

        messages: [

            {
                id: "message-b1",
                direction: "received",
                type: "text",
                content: "영상 판독 자료를 확인해 주세요.",
                time: "10:20",
                isRead: false
            },

            {
                id: "message-b2",
                direction: "received",
                type: "text",
                content: "추가 검토가 필요한 부분이 있습니다.",
                time: "10:21",
                isRead: false
            }

        ]
    },

    {
        id: "room-c",
        name: "의료진 C",
        department: "내과",
        unreadCount: 1,

        messages: [

            {
                id: "message-c1",
                direction: "received",
                type: "text",
                content: "협진 요청 내용을 확인 부탁드립니다.",
                time: "11:05",
                isRead: false
            }

        ]
    }

];


const VENA_RECEIVE_MESSAGES = [

    "검사 결과를 추가로 확인했습니다.",

    "환자 정보 검토를 부탁드립니다.",

    "공유한 자료에 대한 의견을 부탁드립니다.",

    "협진 요청 내용을 확인해 주세요.",

    "확인 감사합니다. 추가 사항은 다시 전달드리겠습니다."

];


const VENA_RESOURCE_STATUS = Object.freeze({

    unread: "미확인",

    checked: "확인 완료",

    answered: "답변 완료"

});


/* =========================================================
   23. CHAT DATA UTILITIES
========================================================= */

function getChatUnreadTotal(rooms) {

    return rooms.reduce(

        (total, room) =>

            total + Math.max(
                0,
                toNumber(room.unreadCount)
            ),

        0

    );

}


function getChatDisplayTime() {

    const now = new Date();

    return (
        `${padNumber(now.getHours())}:` +
        `${padNumber(now.getMinutes())}`
    );

}


function createChatMessage(content, direction) {

    return {

        id: createDemoId("message"),

        direction,

        type: "text",

        content: String(content).trim(),

        time: getChatDisplayTime(),

        isRead: direction === "sent"

    };

}


/* =========================================================
   24. MESSAGING DEMONSTRATION
========================================================= */

function initMessagingDemo() {

    const root = byId("messagingDemo");

    if (!root) {

        return false;

    }


    const elements = {

        unreadTotal: byId("chatDemoUnreadTotal"),

        receiveButton: byId("chatReceiveButton"),

        resetButton: byId("chatResetButton"),

        roomName: byId("chatDemoRoomName"),

        messages: byId("chatDemoMessages"),

        form: byId("chatDemoForm"),

        input: byId("chatDemoInput"),

        sendButton: byId("chatDemoSend"),

        eventStatus: byId("chatDemoEventStatus"),

        eventLog: byId("chatDemoEventLog")

    };


    const missingElements = Object.entries(elements)

        .filter(([, element]) => !element)

        .map(([name]) => name);


    if (missingElements.length) {

        console.warn(

            "[VENA] Messaging elements missing:",

            missingElements

        );

        return false;

    }


    const roomButtons = $$(
        "[data-chat-room]",
        root
    );


    const unreadBadges = $$(
        "[data-room-unread]",
        root
    );


    const state = {

        rooms: cloneData(VENA_CHAT_ROOMS),

        activeRoomId: "room-a",

        receiveIndex: 0

    };


    /* -----------------------------------------------------
       24-1. Get active room
    ----------------------------------------------------- */

    function getActiveRoom() {

        return state.rooms.find(

            (room) => room.id === state.activeRoomId

        ) ?? null;

    }


    /* -----------------------------------------------------
       24-2. Event feedback
    ----------------------------------------------------- */

    function logEvent(message, type = "info") {

        setFeedback(

            elements.eventStatus,

            message,

            type

        );

        addEventLog(

            elements.eventLog,

            message,

            type

        );

    }


    /* -----------------------------------------------------
       24-3. Render room list
    ----------------------------------------------------- */

    function renderRoomList() {

        roomButtons.forEach((button) => {

            const active =

                button.dataset.chatRoom ===

                state.activeRoomId;


            button.classList.toggle(
                "active",
                active
            );

            button.classList.toggle(
                "is-active",
                active
            );

            button.classList.toggle(
                "selected",
                active
            );

            setPressed(button, active);


            if (
                ["tab", "option"].includes(
                    button.getAttribute("role")
                )
            ) {

                setSelected(button, active);

            }

        });


        unreadBadges.forEach((badge) => {

            const room = state.rooms.find(

                (item) =>

                    item.id === badge.dataset.roomUnread

            );


            const count = room?.unreadCount ?? 0;


            setText(

                badge,

                count > 99 ? "99+" : count

            );


            setHidden(badge, count === 0);

        });


        setText(

            elements.unreadTotal,

            getChatUnreadTotal(state.rooms)

        );

    }


    /* -----------------------------------------------------
       24-4. Create shared resource card
    ----------------------------------------------------- */

    function createResourceCard(message) {

        const card = createElement(

            "div",

            "shared-resource-card chat-resource-card"

        );


        card.dataset.resourceId = message.id;


        const header = createElement(

            "div",

            "shared-resource-header"

        );


        const label = createElement(

            "span",

            "resource-type",

            "SHARED EXAMINATION"

        );


        const status = createElement(

            "span",

            `resource-status resource-state ${message.resourceStatus}`,

            VENA_RESOURCE_STATUS[message.resourceStatus]

        );


        status.dataset.status = message.resourceStatus;


        header.append(label, status);


        const title = createElement(

            "strong",

            "resource-title",

            message.title

        );


        const patient = createElement(

            "p",

            "resource-patient",

            `Patient ID: ${message.patientId}`

        );


        const description = createElement(

            "p",

            "resource-description",

            message.content

        );


        const actions = createElement(

            "div",

            "resource-actions"

        );


        const checkButton = createElement(

            "button",

            "resource-action-button button button-outline",

            "자료 확인"

        );


        checkButton.type = "button";

        checkButton.dataset.resourceAction = "checked";

        checkButton.dataset.resourceId = message.id;


        setDisabled(

            checkButton,

            message.resourceStatus !== "unread"

        );


        const answerButton = createElement(

            "button",

            "resource-action-button button button-primary",

            "답변 완료"

        );


        answerButton.type = "button";

        answerButton.dataset.resourceAction = "answered";

        answerButton.dataset.resourceId = message.id;


        setDisabled(

            answerButton,

            message.resourceStatus !== "checked"

        );


        actions.append(

            checkButton,

            answerButton

        );


        card.append(

            header,

            title,

            patient,

            description,

            actions

        );


        return card;

    }


    /* -----------------------------------------------------
       24-5. Create message element
    ----------------------------------------------------- */

    function createMessageElement(message, room) {

        const isSent = message.direction === "sent";


        const row = createElement(

            "div",

            isSent

                ? "chat-message sent outgoing is-mine"

                : "chat-message received incoming"

        );


        row.dataset.messageId = message.id;


        if (!isSent) {

            const avatar = createElement(

                "span",

                "chat-message-avatar",

                room.name.slice(-1)

            );

            avatar.setAttribute(
                "aria-hidden",
                "true"
            );

            row.append(avatar);

        }


        const content = createElement(

            "div",

            "chat-message-content"

        );


        if (!isSent) {

            const sender = createElement(

                "span",

                "chat-message-sender",

                room.name

            );

            content.append(sender);

        }


        if (message.type === "resource") {

            content.append(

                createResourceCard(message)

            );

        } else {

            const bubble = createElement(

                "div",

                "chat-bubble message-bubble",

                message.content

            );


            content.append(bubble);

        }


        const metadata = createElement(

            "div",

            "chat-message-meta"

        );


        const time = createElement(

            "span",

            "chat-message-time",

            message.time

        );


        metadata.append(time);


        if (isSent) {

            const status = createElement(

                "span",

                "chat-message-read",

                message.isRead ? "읽음" : "전송됨"

            );


            metadata.append(status);

        }


        content.append(metadata);

        row.append(content);


        return row;

    }


    /* -----------------------------------------------------
       24-6. Render messages
    ----------------------------------------------------- */

    function renderMessages(scrollToBottom = true) {

        const room = getActiveRoom();

        clearElement(elements.messages);


        if (!room) {

            setText(

                elements.roomName,

                "채팅방을 선택해 주세요."

            );

            return;

        }


        setText(

            elements.roomName,

            room.name

        );


        if (!room.messages.length) {

            const empty = createElement(

                "div",

                "chat-empty-state empty-state",

                "아직 메시지가 없습니다."

            );

            elements.messages.append(empty);

            return;

        }


        room.messages.forEach((message) => {

            elements.messages.append(

                createMessageElement(message, room)

            );

        });


        if (scrollToBottom) {

            elements.messages.scrollTop =

                elements.messages.scrollHeight;

        }

    }


    /* -----------------------------------------------------
       24-7. Mark room as read

       Simulates:
       PATCH /api/chat/rooms/{id}/read/
    ----------------------------------------------------- */

    function markRoomAsRead(room) {

        if (!room) {

            return 0;

        }


        const previousCount = room.unreadCount;


        room.messages.forEach((message) => {

            if (message.direction === "received") {

                message.isRead = true;

            }

        });


        room.unreadCount = 0;


        return previousCount;

    }


    /* -----------------------------------------------------
       24-8. Open room
    ----------------------------------------------------- */

    function openRoom(roomId) {

        const room = state.rooms.find(

            (item) => item.id === roomId

        );


        if (!room) {

            return;

        }


        state.activeRoomId = roomId;


        const readCount = markRoomAsRead(room);


        renderRoomList();

        renderMessages();


        if (readCount > 0) {

            logEvent(

                `PATCH /api/chat/rooms/${roomId}/read/` +
                ` · ${readCount}개 메시지 읽음 처리`,

                "success"

            );

        } else {

            logEvent(

                `GET /api/chat/rooms/${roomId}/messages/`,

                "info"

            );

        }

    }


    /* -----------------------------------------------------
       24-9. Send message

       Simulates:
       POST /api/chat/rooms/{id}/messages/
    ----------------------------------------------------- */

    function sendMessage() {

        const room = getActiveRoom();


        if (!room) {

            return;

        }


        const content = elements.input.value.trim();


        if (!content) {

            logEvent(

                "메시지 내용을 입력해 주세요.",

                "warning"

            );

            return;

        }


        if (content.length > 200) {

            logEvent(

                "메시지는 200자 이내로 입력해 주세요.",

                "warning"

            );

            return;

        }


        const message = createChatMessage(

            content,

            "sent"

        );


        /*
         * The message is treated as a simulated
         * successful server response.
         */

        message.isRead = false;


        room.messages.push(message);


        elements.input.value = "";


        renderMessages();

        renderRoomList();


        logEvent(

            `POST /api/chat/rooms/${room.id}/messages/` +
            " · 201 Created (Simulation)",

            "success"

        );


        elements.input.focus();

    }


    /* -----------------------------------------------------
       24-10. Simulate incoming message

       Incoming messages are delivered to an inactive room
       so unread-count behavior can be demonstrated.
    ----------------------------------------------------- */

    function receiveMessage() {

        const inactiveRooms = state.rooms.filter(

            (room) => room.id !== state.activeRoomId

        );


        const targetRoom = inactiveRooms.length

            ? inactiveRooms[
                state.receiveIndex % inactiveRooms.length
            ]

            : getActiveRoom();


        if (!targetRoom) {

            return;

        }


        const content = VENA_RECEIVE_MESSAGES[

            state.receiveIndex %

            VENA_RECEIVE_MESSAGES.length

        ];


        state.receiveIndex += 1;


        const message = createChatMessage(

            content,

            "received"

        );


        const isActive =

            targetRoom.id === state.activeRoomId;


        message.isRead = isActive;


        targetRoom.messages.push(message);


        if (!isActive) {

            targetRoom.unreadCount += 1;

        }


        renderRoomList();


        if (isActive) {

            renderMessages();

        }


        logEvent(

            `${targetRoom.name} 메시지 수신` +

            ` · 미확인 ${targetRoom.unreadCount}개` +

            " (Simulation)",

            "info"

        );

    }


    /* -----------------------------------------------------
       24-11. Shared resource status transition

       unread -> checked -> answered

       This is a demonstration-side transition policy.
       Backend transition enforcement is not verified.
    ----------------------------------------------------- */

    function updateResourceStatus(resourceId, nextStatus) {

        const room = getActiveRoom();


        if (!room) {

            return;

        }


        const message = room.messages.find(

            (item) =>

                item.id === resourceId &&

                item.type === "resource"

        );


        if (!message) {

            return;

        }


        const allowedTransitions = {

            unread: ["checked"],

            checked: ["answered"],

            answered: []

        };


        const allowed =

            allowedTransitions[message.resourceStatus] ?? [];


        if (!allowed.includes(nextStatus)) {

            logEvent(

                "현재 상태에서 변경할 수 없는 요청입니다.",

                "warning"

            );

            return;

        }


        const previousStatus = message.resourceStatus;


        message.resourceStatus = nextStatus;


        const previousScroll = elements.messages.scrollTop;


        renderMessages(false);


        elements.messages.scrollTop = previousScroll;


        logEvent(

            `PATCH /api/chat/messages/${resourceId}/resource-status/` +

            ` · ${previousStatus} → ${nextStatus}`,

            "success"

        );

    }


    /* -----------------------------------------------------
       24-12. Reset demonstration
    ----------------------------------------------------- */

    function resetDemo() {

        state.rooms = cloneData(VENA_CHAT_ROOMS);

        state.activeRoomId = "room-a";

        state.receiveIndex = 0;


        elements.input.value = "";


        clearElement(elements.eventLog);


        renderRoomList();

        renderMessages();


        logEvent(

            "채팅 데모를 초기 상태로 복원했습니다.",

            "info"

        );

    }


    /* -----------------------------------------------------
       24-13. Bind events
    ----------------------------------------------------- */

    roomButtons.forEach((button) => {

        button.addEventListener(

            "click",

            () => openRoom(button.dataset.chatRoom)

        );

    });


    elements.form.addEventListener(

        "submit",

        (event) => {

            event.preventDefault();

            sendMessage();

        }

    );


    elements.receiveButton.addEventListener(

        "click",

        receiveMessage

    );


    elements.resetButton.addEventListener(

        "click",

        resetDemo

    );


    /*
     * Event delegation supports dynamically
     * generated shared-resource buttons.
     */

    elements.messages.addEventListener(

        "click",

        (event) => {

            const button = event.target.closest(

                "[data-resource-action][data-resource-id]"

            );


            if (

                !button ||

                !elements.messages.contains(button) ||

                button.disabled

            ) {

                return;

            }


            updateResourceStatus(

                button.dataset.resourceId,

                button.dataset.resourceAction

            );

        }

    );


    elements.input.maxLength = 200;


    elements.messages.setAttribute(

        "aria-live",

        "polite"

    );


    elements.unreadTotal.setAttribute(

        "aria-live",

        "polite"

    );


    /* -----------------------------------------------------
       24-14. Initial render
    ----------------------------------------------------- */

    resetDemo();

}


/* =========================================================
   25. POLLING CALCULATION CONFIGURATION
========================================================= */

const VENA_POLLING_CONFIG = Object.freeze({

    defaultUsers: 100,

    defaultInterval: 5,

    minUsers: 10,

    maxUsers: 1000,

    minInterval: 1,

    maxInterval: 30,

    comparisonIntervals: [5, 10, 15, 30]

});


/* =========================================================
   26. POLLING CALCULATION UTILITIES
========================================================= */

/**
 * Calculate theoretical REST polling request rates.
 *
 * Assumptions:
 * - Every user has one active polling client.
 * - Every polling cycle sends exactly one request.
 * - All clients poll continuously.
 * - Retries and other API requests are excluded.
 */

function calculatePollingRequests(users, interval) {

    const safeUsers = clamp(

        toNumber(users, VENA_POLLING_CONFIG.defaultUsers),

        VENA_POLLING_CONFIG.minUsers,

        VENA_POLLING_CONFIG.maxUsers

    );


    const safeInterval = clamp(

        toNumber(
            interval,
            VENA_POLLING_CONFIG.defaultInterval
        ),

        VENA_POLLING_CONFIG.minInterval,

        VENA_POLLING_CONFIG.maxInterval

    );


    const requestsPerSecond =

        safeUsers / safeInterval;


    return {

        users: safeUsers,

        interval: safeInterval,

        requestsPerSecond,

        requestsPerMinute: requestsPerSecond * 60,

        requestsPerHour: requestsPerSecond * 3600

    };

}


/* =========================================================
   27. POLLING CALCULATOR
========================================================= */

function initPollingCalculator() {

    const root = byId("pollingCalculator");


    if (!root) {

        return false;

    }


    const elements = {

        users: byId("pollingUsers"),

        usersValue: byId("pollingUsersValue"),

        interval: byId("pollingInterval"),

        intervalValue: byId("pollingIntervalValue"),

        reset: byId("pollingResetButton"),

        rps: byId("pollingRps"),

        rpm: byId("pollingRpm"),

        rph: byId("pollingRph")

    };


    const missingElements = Object.entries(elements)

        .filter(([, element]) => !element)

        .map(([name]) => name);


    if (missingElements.length) {

        console.warn(

            "[VENA] Polling calculator elements missing:",

            missingElements

        );

        return false;

    }


    const presetButtons = $$(

        "[data-polling-interval]",

        root

    );


    const comparisonBars = $$(

        "[data-polling-bar]",

        root

    );


    const comparisonCounts = $$(

        "[data-polling-count]",

        root

    );


    const state = {

        users: VENA_POLLING_CONFIG.defaultUsers,

        interval: VENA_POLLING_CONFIG.defaultInterval

    };


    /* -----------------------------------------------------
       27-1. Render calculated metrics
    ----------------------------------------------------- */

    function renderMetrics() {

        const result = calculatePollingRequests(

            state.users,

            state.interval

        );


        setText(

            elements.usersValue,

            `${formatNumber(result.users)}명`

        );


        setText(

            elements.intervalValue,

            `${result.interval}초`

        );


        setText(

            elements.rps,

            formatNumber(result.requestsPerSecond, 2)

        );


        setText(

            elements.rpm,

            formatNumber(result.requestsPerMinute, 2)

        );


        setText(

            elements.rph,

            formatNumber(result.requestsPerHour, 2)

        );


        elements.users.setAttribute(

            "aria-valuetext",

            `${result.users}명`

        );


        elements.interval.setAttribute(

            "aria-valuetext",

            `${result.interval}초`

        );

    }


    /* -----------------------------------------------------
       27-2. Render interval presets
    ----------------------------------------------------- */

    function renderPresets() {

        presetButtons.forEach((button) => {

            const interval = Number(

                button.dataset.pollingInterval

            );


            const active = interval === state.interval;


            button.classList.toggle(

                "active",

                active

            );


            button.classList.toggle(

                "is-active",

                active

            );


            setPressed(button, active);

        });

    }


    /* -----------------------------------------------------
       27-3. Render comparison chart

       All bars use requests per minute.
       The maximum comparison value represents 100%.
    ----------------------------------------------------- */

    function renderComparisonChart() {

        const results =

            VENA_POLLING_CONFIG.comparisonIntervals.map(

                (interval) => ({

                    interval,

                    ...calculatePollingRequests(

                        state.users,

                        interval

                    )

                })

            );


        const maxRequests = Math.max(

            1,

            ...results.map(

                (result) => result.requestsPerMinute

            )

        );


        comparisonBars.forEach((bar) => {

            const interval = Number(

                bar.dataset.pollingBar

            );


            const result = results.find(

                (item) => item.interval === interval

            );


            if (!result) {

                return;

            }


            const percent = calculatePercent(

                result.requestsPerMinute,

                maxRequests

            );


            setProgress(bar, percent);


            bar.classList.toggle(

                "active",

                interval === state.interval

            );


            bar.classList.toggle(

                "is-active",

                interval === state.interval

            );


            bar.setAttribute(

                "aria-label",

                `${interval}초 주기: ` +

                `분당 ${formatNumber(
                    result.requestsPerMinute,
                    2
                )}회`

            );

        });


        comparisonCounts.forEach((element) => {

            const interval = Number(

                element.dataset.pollingCount

            );


            const result = results.find(

                (item) => item.interval === interval

            );


            if (!result) {

                return;

            }


            setText(

                element,

                `${formatNumber(
                    result.requestsPerMinute,
                    2
                )}회`

            );

        });

    }


    /* -----------------------------------------------------
       27-4. Render all calculator components
    ----------------------------------------------------- */

    function render() {

        renderMetrics();

        renderPresets();

        renderComparisonChart();

    }


    /* -----------------------------------------------------
       27-5. Update user count
    ----------------------------------------------------- */

    function updateUsers(value) {

        state.users = clamp(

            Math.round(

                toNumber(
                    value,
                    VENA_POLLING_CONFIG.defaultUsers
                )

            ),

            VENA_POLLING_CONFIG.minUsers,

            VENA_POLLING_CONFIG.maxUsers

        );


        elements.users.value = String(state.users);


        render();

    }


    /* -----------------------------------------------------
       27-6. Update polling interval
    ----------------------------------------------------- */

    function updateInterval(value) {

        state.interval = clamp(

            Math.round(

                toNumber(
                    value,
                    VENA_POLLING_CONFIG.defaultInterval
                )

            ),

            VENA_POLLING_CONFIG.minInterval,

            VENA_POLLING_CONFIG.maxInterval

        );


        elements.interval.value = String(state.interval);


        render();

    }


    /* -----------------------------------------------------
       27-7. Reset calculator
    ----------------------------------------------------- */

    function resetCalculator() {

        state.users = VENA_POLLING_CONFIG.defaultUsers;

        state.interval = VENA_POLLING_CONFIG.defaultInterval;


        elements.users.value = String(state.users);

        elements.interval.value = String(state.interval);


        render();

    }


    /* -----------------------------------------------------
       27-8. Bind events
    ----------------------------------------------------- */

    elements.users.addEventListener(

        "input",

        (event) => updateUsers(event.target.value)

    );


    elements.interval.addEventListener(

        "input",

        (event) => updateInterval(event.target.value)

    );


    presetButtons.forEach((button) => {

        button.addEventListener(

            "click",

            () => updateInterval(

                button.dataset.pollingInterval

            )

        );

    });


    elements.reset.addEventListener(

        "click",

        resetCalculator

    );


    /* -----------------------------------------------------
       27-9. Initial render
    ----------------------------------------------------- */

    resetCalculator();

}


/* =========================================================
   28. MESSAGING & POLLING INITIALIZATION
========================================================= */

function initMessagingAndPolling() {

    initializeModule(

        "Messaging Demonstration",

        initMessagingDemo

    );


    initializeModule(

        "Polling Calculator",

        initPollingCalculator

    );

}


/* =========================================================
   PART 3 END

   NEXT:
   CONSULTATION WORKFLOW
   CONSULTATION STATUS MANAGEMENT
   PARALLEL REQUEST CALCULATOR

   Note:
   Application initialization will be added in PART 8.
========================================================= */

/* =========================================================
   PART 4
   CONSULTATION WORKFLOW & PARALLEL REQUEST CALCULATOR

   All consultation records and API responses are fictional.
   No external network requests are performed.
========================================================= */


/* =========================================================
   29. CONSULTATION CONFIGURATION
========================================================= */

const VENA_CONSULTATION_STATUS = Object.freeze({

    PENDING: "pending",

    IN_PROGRESS: "in_progress",

    COMPLETED: "completed"

});


const VENA_CONSULTATION_LABELS = Object.freeze({

    pending: "검토 대기",

    in_progress: "검토 중",

    completed: "답변 완료"

});


const VENA_CONSULTATION_STEPS = Object.freeze([

    "pending",

    "in_progress",

    "completed"

]);


const VENA_CONSULTATION_TRANSITIONS = Object.freeze({

    pending: ["in_progress"],

    in_progress: ["completed"],

    completed: []

});


const VENA_CONSULTATION_CONFIG = Object.freeze({

    requestId: "DEMO-C001",

    patientId: "DEMO-001",

    maxResponseLength: 500,

    simulatedDelay: 500

});


/* =========================================================
   30. CONSULTATION DATA UTILITIES
========================================================= */

/**
 * Create the initial fictional consultation record.
 */

function createInitialConsultation() {

    return {

        id: VENA_CONSULTATION_CONFIG.requestId,

        patientId: VENA_CONSULTATION_CONFIG.patientId,

        sender: "의료진 A",

        receiver: "의료진 B",

        reason: "관상동맥 검사 결과 검토 요청",

        priority: "normal",

        status: VENA_CONSULTATION_STATUS.PENDING,

        responseMemo: "",

        completedAt: null

    };

}


/**
 * Validate a demonstration-side status transition.
 *
 * This policy is not proof of backend enforcement.
 */

function canTransitionConsultation(
    currentStatus,
    nextStatus
) {

    const allowedTransitions =

        VENA_CONSULTATION_TRANSITIONS[currentStatus] ?? [];


    return allowedTransitions.includes(nextStatus);

}


/**
 * Validate a consultation response.
 */

function validateConsultationResponse(value) {

    const response = String(value ?? "").trim();


    if (!response) {

        return {

            valid: false,

            message: "협진 답변을 입력해 주세요."

        };

    }


    if (
        response.length >
        VENA_CONSULTATION_CONFIG.maxResponseLength
    ) {

        return {

            valid: false,

            message: "답변은 500자 이내로 입력해 주세요."

        };

    }


    return {

        valid: true,

        value: response

    };

}


/**
 * Simulate an asynchronous API response.
 *
 * No HTTP request is made.
 */

function simulateConsultationRequest(payload) {

    return new Promise((resolve) => {

        window.setTimeout(() => {

            resolve({

                status: 200,

                data: cloneData(payload),

                simulated: true

            });

        }, VENA_CONSULTATION_CONFIG.simulatedDelay);

    });

}


/* =========================================================
   31. CONSULTATION WORKFLOW DEMONSTRATION
========================================================= */

function initConsultationDemo() {

    const root = byId("consultationDemo");


    if (!root) {

        return false;

    }


    const elements = {

        badge: byId("consultationStatusBadge"),

        reviewButton: byId("consultationReviewButton"),

        resetButton: byId("consultationResetButton"),

        responseInput: byId("consultationResponseInput"),

        responseCount: byId("consultationResponseCount"),

        completeButton: byId("consultationCompleteButton"),

        completedResponse: byId("consultationCompletedResponse"),

        savedResponse: byId("consultationSavedResponse"),

        eventStatus: byId("consultationEventStatus"),

        eventLog: byId("consultationEventLog")

    };


    const missingElements = Object.entries(elements)

        .filter(([, element]) => !element)

        .map(([name]) => name);


    if (missingElements.length) {

        console.warn(

            "[VENA] Consultation elements missing:",

            missingElements

        );

        return false;

    }


    const stepElements = $$(
        "[data-consultation-step]",
        root
    );


    const state = {

        request: createInitialConsultation(),

        isSubmitting: false,

        requestVersion: 0

    };


    /* -----------------------------------------------------
       31-1. Event feedback
    ----------------------------------------------------- */

    function logEvent(message, type = "info") {

        setFeedback(

            elements.eventStatus,

            message,

            type

        );


        addEventLog(

            elements.eventLog,

            message,

            type

        );

    }


    /* -----------------------------------------------------
       31-2. Render consultation status
    ----------------------------------------------------- */

    function renderStatus() {

        const status = state.request.status;


        elements.badge.classList.remove(

            "pending",

            "in_progress",

            "in-progress",

            "completed",

            "is-pending",

            "is-in-progress",

            "is-completed"

        );


        elements.badge.classList.add(status);


        elements.badge.classList.add(

            `is-${status.replaceAll("_", "-")}`

        );


        elements.badge.dataset.status = status;


        setText(

            elements.badge,

            VENA_CONSULTATION_LABELS[status] ?? status

        );

    }


    /* -----------------------------------------------------
       31-3. Render workflow steps
    ----------------------------------------------------- */

    function renderSteps() {

        const currentIndex =

            VENA_CONSULTATION_STEPS.indexOf(

                state.request.status

            );


        stepElements.forEach((element) => {

            const step = element.dataset.consultationStep;


            const stepIndex =

                VENA_CONSULTATION_STEPS.indexOf(step);


            const current = stepIndex === currentIndex;


            const completed =

                stepIndex < currentIndex ||

                (
                    current &&
                    state.request.status === "completed"
                );


            element.classList.toggle(

                "active",

                current

            );


            element.classList.toggle(

                "is-active",

                current

            );


            element.classList.toggle(

                "current",

                current

            );


            element.classList.toggle(

                "completed",

                completed

            );


            element.classList.toggle(

                "done",

                completed

            );


            if (current) {

                element.setAttribute(

                    "aria-current",

                    "step"

                );

            } else {

                element.removeAttribute(

                    "aria-current"

                );

            }

        });

    }


    /* -----------------------------------------------------
       31-4. Render response character count
    ----------------------------------------------------- */

    function renderResponseCount() {

        const length =

            elements.responseInput.value.length;


        const maximum =

            VENA_CONSULTATION_CONFIG.maxResponseLength;


        setText(

            elements.responseCount,

            `${length} / ${maximum}`

        );


        elements.responseCount.classList.toggle(

            "warning",

            length >= maximum

        );

    }


    /* -----------------------------------------------------
       31-5. Render available actions
    ----------------------------------------------------- */

    function renderActions() {

        const status = state.request.status;


        const isPending = status === "pending";


        const isReviewing = status === "in_progress";


        const validation = validateConsultationResponse(

            elements.responseInput.value

        );


        setDisabled(

            elements.reviewButton,

            !isPending || state.isSubmitting

        );


        setDisabled(

            elements.responseInput,

            !isReviewing || state.isSubmitting

        );


        setDisabled(

            elements.completeButton,

            !isReviewing ||

            !validation.valid ||

            state.isSubmitting

        );


        root.setAttribute(

            "aria-busy",

            String(state.isSubmitting)

        );

    }


    /* -----------------------------------------------------
       31-6. Render completed response
    ----------------------------------------------------- */

    function renderCompletedResponse() {

        const completed =

            state.request.status === "completed";


        setHidden(

            elements.completedResponse,

            !completed

        );


        setText(

            elements.savedResponse,

            completed

                ? state.request.responseMemo

                : ""

        );

    }


    /* -----------------------------------------------------
       31-7. Render all consultation components
    ----------------------------------------------------- */

    function render() {

        renderStatus();

        renderSteps();

        renderResponseCount();

        renderActions();

        renderCompletedResponse();

    }


    /* -----------------------------------------------------
       31-8. Start consultation review

       Simulates:
       PATCH /api/consultations/{id}/status/
    ----------------------------------------------------- */

    async function startReview() {

        if (state.isSubmitting) {

            return;

        }


        const nextStatus =

            VENA_CONSULTATION_STATUS.IN_PROGRESS;


        if (
            !canTransitionConsultation(
                state.request.status,
                nextStatus
            )
        ) {

            logEvent(

                "현재 상태에서는 검토를 시작할 수 없습니다.",

                "warning"

            );

            return;

        }


        const requestVersion = ++state.requestVersion;


        state.isSubmitting = true;


        renderActions();


        logEvent(

            `PATCH /api/consultations/${state.request.id}/status/`,

            "info"

        );


        try {

            const payload = {

                ...state.request,

                status: nextStatus

            };


            const response =

                await simulateConsultationRequest(payload);


            /*
             * Ignore a response if the demonstration
             * has been reset while the request was pending.
             */

            if (requestVersion !== state.requestVersion) {

                return;

            }


            state.request = response.data;


            logEvent(

                "200 OK · pending → in_progress (Simulation)",

                "success"

            );


        } catch (error) {

            if (requestVersion !== state.requestVersion) {

                return;

            }


            console.error(

                "[VENA] Consultation review failed:",

                error

            );


            logEvent(

                "검토 상태 변경에 실패했습니다.",

                "error"

            );


        } finally {

            if (requestVersion === state.requestVersion) {

                state.isSubmitting = false;

                render();

                if (state.request.status === nextStatus) {

                    elements.responseInput.focus();

                }

            }

        }

    }


    /* -----------------------------------------------------
       31-9. Complete consultation

       Simulates:
       PATCH /api/consultations/{id}/complete/
    ----------------------------------------------------- */

    async function completeConsultation() {

        if (state.isSubmitting) {

            return;

        }


        const nextStatus =

            VENA_CONSULTATION_STATUS.COMPLETED;


        if (
            !canTransitionConsultation(
                state.request.status,
                nextStatus
            )
        ) {

            logEvent(

                "검토 중인 협진 요청만 완료할 수 있습니다.",

                "warning"

            );

            return;

        }


        const validation = validateConsultationResponse(

            elements.responseInput.value

        );


        if (!validation.valid) {

            logEvent(

                validation.message,

                "warning"

            );

            return;

        }


        const requestVersion = ++state.requestVersion;


        state.isSubmitting = true;


        renderActions();


        logEvent(

            `PATCH /api/consultations/${state.request.id}/complete/`,

            "info"

        );


        try {

            const payload = {

                ...state.request,

                status: nextStatus,

                responseMemo: validation.value,

                completedAt: new Date().toISOString()

            };


            const response =

                await simulateConsultationRequest(payload);


            if (requestVersion !== state.requestVersion) {

                return;

            }


            state.request = response.data;


            logEvent(

                "200 OK · in_progress → completed (Simulation)",

                "success"

            );


        } catch (error) {

            if (requestVersion !== state.requestVersion) {

                return;

            }


            console.error(

                "[VENA] Consultation completion failed:",

                error

            );


            logEvent(

                "협진 답변 등록에 실패했습니다.",

                "error"

            );


        } finally {

            if (requestVersion === state.requestVersion) {

                state.isSubmitting = false;

                render();

            }

        }

    }


    /* -----------------------------------------------------
       31-10. Reset consultation

       Incrementing the request version prevents
       stale asynchronous responses from restoring
       a previous consultation state.
    ----------------------------------------------------- */

    function resetDemo() {

        state.requestVersion += 1;


        state.request = createInitialConsultation();


        state.isSubmitting = false;


        elements.responseInput.value = "";


        clearElement(elements.eventLog);


        render();


        logEvent(

            "협진 요청을 초기 상태로 복원했습니다.",

            "info"

        );

    }


    /* -----------------------------------------------------
       31-11. Bind events
    ----------------------------------------------------- */

    elements.reviewButton.addEventListener(

        "click",

        (event) => {

            event.preventDefault();

            void startReview();

        }

    );


    elements.completeButton.addEventListener(

        "click",

        (event) => {

            event.preventDefault();

            void completeConsultation();

        }

    );


    elements.resetButton.addEventListener(

        "click",

        (event) => {

            event.preventDefault();

            resetDemo();

        }

    );


    elements.responseInput.addEventListener(

        "input",

        () => {

            renderResponseCount();

            renderActions();

        }

    );


    elements.responseInput.maxLength =

        VENA_CONSULTATION_CONFIG.maxResponseLength;


    elements.badge.setAttribute(

        "aria-live",

        "polite"

    );


    /* -----------------------------------------------------
       31-12. Initial render
    ----------------------------------------------------- */

    resetDemo();

}


/* =========================================================
   32. PARALLEL REQUEST CONFIGURATION
========================================================= */

const VENA_PARALLEL_CONFIG = Object.freeze({

    defaultReceivedTime: 400,

    defaultSentTime: 600,

    minimumTime: 100,

    maximumTime: 2000,

    step: 100

});


/* =========================================================
   33. PARALLEL REQUEST CALCULATION UTILITIES
========================================================= */

/**
 * Compare ideal sequential and parallel execution.
 *
 * Sequential:
 * T = A + B
 *
 * Parallel:
 * T = max(A, B)
 *
 * Network contention, scheduling overhead,
 * retries and server capacity are excluded.
 */

function calculateParallelRequests(
    receivedTime,
    sentTime
) {

    const received = clamp(

        toNumber(
            receivedTime,
            VENA_PARALLEL_CONFIG.defaultReceivedTime
        ),

        VENA_PARALLEL_CONFIG.minimumTime,

        VENA_PARALLEL_CONFIG.maximumTime

    );


    const sent = clamp(

        toNumber(
            sentTime,
            VENA_PARALLEL_CONFIG.defaultSentTime
        ),

        VENA_PARALLEL_CONFIG.minimumTime,

        VENA_PARALLEL_CONFIG.maximumTime

    );


    const sequentialTime = received + sent;


    const parallelTime = Math.max(

        received,

        sent

    );


    const savedTime =

        sequentialTime - parallelTime;


    const savedPercent = calculatePercent(

        savedTime,

        sequentialTime

    );


    return {

        receivedTime: received,

        sentTime: sent,

        sequentialTime,

        parallelTime,

        savedTime,

        savedPercent

    };

}


/* =========================================================
   34. PARALLEL REQUEST CALCULATOR
========================================================= */

function initParallelRequestDemo() {

    const root = byId("parallelRequestDemo");


    if (!root) {

        return false;

    }


    const elements = {

        receivedInput: byId("receivedRequestTime"),

        receivedValue: byId("receivedRequestTimeValue"),

        sentInput: byId("sentRequestTime"),

        sentValue: byId("sentRequestTimeValue"),

        sequentialTime: byId("sequentialTimeValue"),

        sequentialReceivedBar: byId("sequentialReceivedBar"),

        sequentialSentBar: byId("sequentialSentBar"),

        parallelTime: byId("parallelTimeValue"),

        parallelReceivedBar: byId("parallelReceivedBar"),

        parallelSentBar: byId("parallelSentBar"),

        savedTime: byId("parallelSavedTime"),

        savedPercent: byId("parallelSavedPercent")

    };


    const missingElements = Object.entries(elements)

        .filter(([, element]) => !element)

        .map(([name]) => name);


    if (missingElements.length) {

        console.warn(

            "[VENA] Parallel request elements missing:",

            missingElements

        );

        return false;

    }


    const state = {

        receivedTime: VENA_PARALLEL_CONFIG.defaultReceivedTime,

        sentTime: VENA_PARALLEL_CONFIG.defaultSentTime

    };


    /* -----------------------------------------------------
       34-1. Render execution metrics
    ----------------------------------------------------- */

    function renderMetrics(result) {

        setText(

            elements.receivedValue,

            `${formatNumber(result.receivedTime)} ms`

        );


        setText(

            elements.sentValue,

            `${formatNumber(result.sentTime)} ms`

        );


        setText(

            elements.sequentialTime,

            `${formatNumber(result.sequentialTime)} ms`

        );


        setText(

            elements.parallelTime,

            `${formatNumber(result.parallelTime)} ms`

        );


        setText(

            elements.savedTime,

            `${formatNumber(result.savedTime)} ms`

        );


        setText(

            elements.savedPercent,

            `${formatNumber(result.savedPercent, 1)}%`

        );


        elements.receivedInput.setAttribute(

            "aria-valuetext",

            `${result.receivedTime} milliseconds`

        );


        elements.sentInput.setAttribute(

            "aria-valuetext",

            `${result.sentTime} milliseconds`

        );

    }


    /* -----------------------------------------------------
       34-2. Render execution timeline

       Both sequential and parallel bars use the
       sequential execution time as a shared scale.
    ----------------------------------------------------- */

    function renderTimeline(result) {

        const receivedPercent = calculatePercent(

            result.receivedTime,

            result.sequentialTime

        );


        const sentPercent = calculatePercent(

            result.sentTime,

            result.sequentialTime

        );


        setProgress(

            elements.sequentialReceivedBar,

            receivedPercent

        );


        setProgress(

            elements.sequentialSentBar,

            sentPercent

        );


        setProgress(

            elements.parallelReceivedBar,

            receivedPercent

        );


        setProgress(

            elements.parallelSentBar,

            sentPercent

        );


        elements.sequentialReceivedBar.setAttribute(

            "aria-label",

            `받은 협진 요청 조회 ${result.receivedTime} ms`

        );


        elements.sequentialSentBar.setAttribute(

            "aria-label",

            `보낸 협진 요청 조회 ${result.sentTime} ms`

        );


        elements.parallelReceivedBar.setAttribute(

            "aria-label",

            `받은 협진 요청 병렬 조회 ${result.receivedTime} ms`

        );


        elements.parallelSentBar.setAttribute(

            "aria-label",

            `보낸 협진 요청 병렬 조회 ${result.sentTime} ms`

        );

    }


    /* -----------------------------------------------------
       34-3. Render calculator
    ----------------------------------------------------- */

    function render() {

        const result = calculateParallelRequests(

            state.receivedTime,

            state.sentTime

        );


        renderMetrics(result);


        renderTimeline(result);

    }


    /* -----------------------------------------------------
       34-4. Normalize slider values
    ----------------------------------------------------- */

    function normalizeRequestTime(value, fallback) {

        const step = VENA_PARALLEL_CONFIG.step;


        const normalized = Math.round(

            toNumber(value, fallback) / step

        ) * step;


        return clamp(

            normalized,

            VENA_PARALLEL_CONFIG.minimumTime,

            VENA_PARALLEL_CONFIG.maximumTime

        );

    }


    /* -----------------------------------------------------
       34-5. Update received request time
    ----------------------------------------------------- */

    function updateReceivedTime(value) {

        state.receivedTime = normalizeRequestTime(

            value,

            VENA_PARALLEL_CONFIG.defaultReceivedTime

        );


        elements.receivedInput.value =

            String(state.receivedTime);


        render();

    }


    /* -----------------------------------------------------
       34-6. Update sent request time
    ----------------------------------------------------- */

    function updateSentTime(value) {

        state.sentTime = normalizeRequestTime(

            value,

            VENA_PARALLEL_CONFIG.defaultSentTime

        );


        elements.sentInput.value =

            String(state.sentTime);


        render();

    }


    /* -----------------------------------------------------
       34-7. Bind events
    ----------------------------------------------------- */

    elements.receivedInput.addEventListener(

        "input",

        (event) => updateReceivedTime(event.target.value)

    );


    elements.sentInput.addEventListener(

        "input",

        (event) => updateSentTime(event.target.value)

    );


    /* -----------------------------------------------------
       34-8. Initial render
    ----------------------------------------------------- */

    elements.receivedInput.value =

        String(state.receivedTime);


    elements.sentInput.value =

        String(state.sentTime);


    render();

}


/* =========================================================
   35. CONSULTATION INITIALIZATION
========================================================= */

function initConsultationAndParallel() {

    initializeModule(

        "Consultation Workflow",

        initConsultationDemo

    );


    initializeModule(

        "Parallel Request Calculator",

        initParallelRequestDemo

    );

}


/* =========================================================
   PART 4 END

   NEXT:
   CALENDAR DEMONSTRATION
   INCLUSIVE DATE RANGE MANAGEMENT
   SCHEDULE CRUD
   TODO LIST MANAGEMENT
   UNDO & JSON STATE PREVIEW

   Note:
   Application initialization will be added in PART 8.
========================================================= */

/* =========================================================
   PART 5
   SCHEDULE & TASK MANAGEMENT

   Calendar, schedule CRUD, inclusive date range,
   task management and undo demonstration.

   All data is fictional and stored in memory.
========================================================= */


/* =========================================================
   36. SCHEDULE CONFIGURATION
========================================================= */

const VENA_SCHEDULE_CONFIG = Object.freeze({

    maxTitleLength: 100,

    defaultTime: "09:00",

    defaultColor: "#24459A",

    colors: [

        "#24459A",
        "#31836B",
        "#805AD5",
        "#DD8A35",
        "#B65353",
        "#697386"

    ],

    weekdays: [

        "일", "월", "화", "수",
        "목", "금", "토"

    ]

});


/* =========================================================
   37. CALENDAR DATE UTILITIES
========================================================= */

function getMonthStart(date) {

    return new Date(

        date.getFullYear(),

        date.getMonth(),

        1

    );

}


function shiftCalendarMonth(date, amount) {

    return new Date(

        date.getFullYear(),

        date.getMonth() + amount,

        1

    );

}


function addCalendarDays(date, amount) {

    const result = new Date(date.getTime());

    result.setDate(

        result.getDate() + amount

    );

    return result;

}


function getCalendarDates(month) {

    const firstDay = getMonthStart(month);

    const offset = firstDay.getDay();

    const gridStart = addCalendarDays(

        firstDay,

        -offset

    );

    return Array.from(

        { length: 42 },

        (_, index) =>

            addCalendarDays(gridStart, index)

    );

}


function formatCalendarMonth(date) {

    return (

        `${date.getFullYear()}년 ` +

        `${date.getMonth() + 1}월`

    );

}


function formatCalendarDate(value) {

    const date = parseLocalDate(value);

    if (!date) {

        return value;

    }

    return (

        `${date.getMonth() + 1}월 ` +

        `${date.getDate()}일 ` +

        `(${VENA_SCHEDULE_CONFIG.weekdays[date.getDay()]})`

    );

}


/* =========================================================
   38. SCHEDULE DEMONSTRATION DATA
========================================================= */

function createInitialSchedules(baseDate) {

    const today = formatLocalDate(baseDate);

    const tomorrow = formatLocalDate(

        addCalendarDays(baseDate, 1)

    );

    const dayAfterTomorrow = formatLocalDate(

        addCalendarDays(baseDate, 2)

    );

    return [

        {

            id: "schedule-001",

            title: "오전 외래 진료",

            date: today,

            endDate: today,

            time: "09:00",

            color: "#24459A"

        },

        {

            id: "schedule-002",

            title: "협진 요청 검토",

            date: today,

            endDate: today,

            time: "14:00",

            color: "#31836B"

        },

        {

            id: "schedule-003",

            title: "의료진 교육 일정",

            date: today,

            endDate: dayAfterTomorrow,

            time: "16:00",

            color: "#805AD5"

        },

        {

            id: "schedule-004",

            title: "검사 결과 확인",

            date: tomorrow,

            endDate: tomorrow,

            time: "11:00",

            color: "#DD8A35"

        }

    ];

}


/* =========================================================
   39. SCHEDULE DATA UTILITIES
========================================================= */

/**
 * Filter schedules by inclusive date range.
 *
 * startDate <= selectedDate <= endDate
 */

function getSchedulesForDate(schedules, selectedDate) {

    return schedules

        .filter((schedule) =>

            isDateInRange(

                selectedDate,

                schedule.date,

                schedule.endDate

            )

        )

        .sort((a, b) =>

            a.time.localeCompare(b.time) ||

            a.title.localeCompare(b.title)

        );

}


/**
 * Normalize color input.
 *
 * Only known color names or valid hex values are accepted.
 */

function normalizeScheduleColor(value) {

    const color = String(value ?? "").trim();

    const namedColors = {

        blue: "#24459A",

        green: "#31836B",

        purple: "#805AD5",

        orange: "#DD8A35",

        red: "#B65353",

        gray: "#697386",

        grey: "#697386"

    };

    if (namedColors[color.toLowerCase()]) {

        return namedColors[color.toLowerCase()];

    }

    if (/^#[0-9a-fA-F]{6}$/.test(color)) {

        return color.toUpperCase();

    }

    return VENA_SCHEDULE_CONFIG.defaultColor;

}


/**
 * Convert a CSS RGB hex color to an ARGB integer.
 *
 * Demonstrates the integer color representation
 * used by Flutter Color.toARGB32().
 */

function scheduleColorToArgb(value) {

    const color = normalizeScheduleColor(value);

    return Number.parseInt(

        `FF${color.slice(1)}`,

        16

    );

}


/**
 * Validate schedule form values.
 */

function validateSchedule(values) {

    const title = String(values.title ?? "").trim();

    const start = parseLocalDate(values.date);

    const end = parseLocalDate(values.endDate);

    const time = String(values.time ?? "").trim();

    if (!title) {

        return {

            valid: false,

            message: "일정 제목을 입력해 주세요."

        };

    }

    if (title.length > VENA_SCHEDULE_CONFIG.maxTitleLength) {

        return {

            valid: false,

            message: "일정 제목은 100자 이내로 입력해 주세요."

        };

    }

    if (!start || !end) {

        return {

            valid: false,

            message: "유효한 시작일과 종료일을 선택해 주세요."

        };

    }

    if (start.getTime() > end.getTime()) {

        return {

            valid: false,

            message: "종료일은 시작일보다 빠를 수 없습니다."

        };

    }

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {

        return {

            valid: false,

            message: "유효한 시간을 입력해 주세요."

        };

    }

    return {

        valid: true,

        data: {

            title,

            date: values.date,

            endDate: values.endDate,

            time,

            color: normalizeScheduleColor(values.color)

        }

    };

}


/**
 * Create an illustrative Flutter-compatible JSON preview.
 *
 * The demonstration ID is intentionally excluded.
 */

function serializeDemoSchedules(schedules) {

    return schedules.map((schedule) => ({

        date: `${schedule.date}T00:00:00.000`,

        endDate: `${schedule.endDate}T00:00:00.000`,

        time: schedule.time,

        title: schedule.title,

        description: null,

        color: scheduleColorToArgb(schedule.color)

    }));

}


/* =========================================================
   40. CALENDAR & SCHEDULE DEMONSTRATION
========================================================= */

function initCalendarDemo() {

    const root = byId("calendarDemo");

    if (!root) {

        return false;

    }

    const elements = {

        prevMonth: byId("calendarPrevMonth"),

        nextMonth: byId("calendarNextMonth"),

        monthLabel: byId("calendarMonthLabel"),

        grid: byId("calendarDemoGrid"),

        selectedDate: byId("calendarSelectedDate"),

        eventList: byId("calendarEventList"),

        form: byId("scheduleDemoForm"),

        editingId: byId("scheduleEditingId"),

        title: byId("scheduleTitle"),

        startDate: byId("scheduleStartDate"),

        endDate: byId("scheduleEndDate"),

        time: byId("scheduleTime"),

        color: byId("scheduleColor"),

        saveButton: byId("scheduleSaveButton"),

        cancelEdit: byId("scheduleCancelEdit"),

        feedback: byId("scheduleFormFeedback"),

        resetButton: byId("calendarResetButton"),

        json: byId("calendarJsonOutput")

    };

    const missingElements = Object.entries(elements)

        .filter(([, element]) => !element)

        .map(([name]) => name);

    if (missingElements.length) {

        console.warn(

            "[VENA] Calendar elements missing:",

            missingElements

        );

        return false;

    }

    const baseDate = new Date();

    baseDate.setHours(0, 0, 0, 0);

    const initialDate = formatLocalDate(baseDate);

    const initialSaveLabel =

        elements.saveButton.textContent.trim() ||

        "일정 등록";

    const state = {

        month: getMonthStart(baseDate),

        selectedDate: initialDate,

        schedules: createInitialSchedules(baseDate),

        editingId: null

    };


    /* -----------------------------------------------------
       40-1. Render feedback
    ----------------------------------------------------- */

    function feedback(message, type = "info") {

        setFeedback(

            elements.feedback,

            message,

            type

        );

    }


    /* -----------------------------------------------------
       40-2. Create calendar day
    ----------------------------------------------------- */

    function createCalendarDay(date) {

        const dateValue = formatLocalDate(date);

        const schedules = getSchedulesForDate(

            state.schedules,

            dateValue

        );

        const isSelected =

            dateValue === state.selectedDate;

        const isToday =

            dateValue === formatLocalDate(new Date());

        const isOutside =

            date.getMonth() !== state.month.getMonth();

        const button = createElement(

            "button",

            "calendar-day calendar-demo-day"

        );

        button.type = "button";

        button.dataset.calendarDate = dateValue;

        button.classList.toggle("selected", isSelected);

        button.classList.toggle("is-selected", isSelected);

        button.classList.toggle("today", isToday);

        button.classList.toggle("is-today", isToday);

        button.classList.toggle("outside-month", isOutside);

        button.classList.toggle("is-outside", isOutside);

        button.classList.toggle(

            "has-events",

            schedules.length > 0

        );

        button.classList.toggle(

            "sunday",

            date.getDay() === 0

        );

        button.classList.toggle(

            "saturday",

            date.getDay() === 6

        );

        setPressed(button, isSelected);

        button.setAttribute(

            "aria-label",

            `${dateValue}, 일정 ${schedules.length}개`

        );

        const number = createElement(

            "span",

            "calendar-day-number",

            date.getDate()

        );

        button.append(number);

        if (schedules.length) {

            const markerContainer = createElement(

                "span",

                "calendar-day-markers calendar-event-markers"

            );

            schedules.slice(0, 3).forEach((schedule) => {

                const marker = createElement(

                    "span",

                    "calendar-event-dot calendar-event-marker"

                );

                marker.style.backgroundColor = schedule.color;

                marker.setAttribute("aria-hidden", "true");

                markerContainer.append(marker);

            });

            button.append(markerContainer);

            const count = createElement(

                "span",

                "calendar-day-event-count",

                `${schedules.length}개`

            );

            button.append(count);

        }

        return button;

    }


    /* -----------------------------------------------------
       40-3. Render calendar grid
    ----------------------------------------------------- */

    function renderCalendar() {

        setText(

            elements.monthLabel,

            formatCalendarMonth(state.month)

        );

        clearElement(elements.grid);

        const fragment = document.createDocumentFragment();

        getCalendarDates(state.month).forEach((date) => {

            fragment.append(

                createCalendarDay(date)

            );

        });

        elements.grid.append(fragment);

    }


    /* -----------------------------------------------------
       40-4. Create schedule item
    ----------------------------------------------------- */

    function createScheduleItem(schedule) {

        const item = createElement(

            "div",

            "schedule-event-item schedule-demo-item"

        );

        item.dataset.scheduleId = schedule.id;

        const colorMarker = createElement(

            "span",

            "schedule-color-marker"

        );

        colorMarker.style.backgroundColor = schedule.color;

        colorMarker.setAttribute("aria-hidden", "true");

        const content = createElement(

            "div",

            "schedule-event-content"

        );

        const title = createElement(

            "strong",

            "schedule-event-title",

            schedule.title

        );

        const time = createElement(

            "span",

            "schedule-event-time",

            schedule.time

        );

        const dateRange = createElement(

            "span",

            "schedule-event-date",

            schedule.date === schedule.endDate

                ? schedule.date

                : `${schedule.date} ~ ${schedule.endDate}`

        );

        content.append(title, time, dateRange);

        const actions = createElement(

            "div",

            "schedule-event-actions"

        );

        const editButton = createElement(

            "button",

            "schedule-edit-button button button-outline",

            "수정"

        );

        editButton.type = "button";

        editButton.dataset.scheduleAction = "edit";

        editButton.dataset.scheduleId = schedule.id;

        editButton.setAttribute(

            "aria-label",

            `${schedule.title} 수정`

        );

        const deleteButton = createElement(

            "button",

            "schedule-delete-button button button-outline",

            "삭제"

        );

        deleteButton.type = "button";

        deleteButton.dataset.scheduleAction = "delete";

        deleteButton.dataset.scheduleId = schedule.id;

        deleteButton.setAttribute(

            "aria-label",

            `${schedule.title} 삭제`

        );

        actions.append(editButton, deleteButton);

        item.append(colorMarker, content, actions);

        return item;

    }


    /* -----------------------------------------------------
       40-5. Render selected date schedules
    ----------------------------------------------------- */

    function renderScheduleList() {

        const schedules = getSchedulesForDate(

            state.schedules,

            state.selectedDate

        );

        setText(

            elements.selectedDate,

            formatCalendarDate(state.selectedDate)

        );

        clearElement(elements.eventList);

        if (!schedules.length) {

            elements.eventList.append(

                createElement(

                    "div",

                    "schedule-empty-state empty-state",

                    "선택한 날짜에 등록된 일정이 없습니다."

                )

            );

            return;

        }

        schedules.forEach((schedule) => {

            elements.eventList.append(

                createScheduleItem(schedule)

            );

        });

    }


    /* -----------------------------------------------------
       40-6. Render JSON state
    ----------------------------------------------------- */

    function renderScheduleJson() {

        renderJson(

            elements.json,

            serializeDemoSchedules(state.schedules)

        );

    }


    /* -----------------------------------------------------
       40-7. Render all components
    ----------------------------------------------------- */

    function render() {

        renderCalendar();

        renderScheduleList();

        renderScheduleJson();

    }


    /* -----------------------------------------------------
       40-8. Set schedule color input
    ----------------------------------------------------- */

    function setColorInput(color) {

        const normalized = normalizeScheduleColor(color);

        if (elements.color.tagName === "SELECT") {

            const matchingOption = Array.from(

                elements.color.options

            ).find((option) =>

                normalizeScheduleColor(option.value) === normalized

            );

            if (matchingOption) {

                elements.color.value = matchingOption.value;

                return;

            }

            elements.color.selectedIndex = 0;

            return;

        }

        elements.color.value = normalized;

    }


    /* -----------------------------------------------------
       40-9. Reset schedule editor
    ----------------------------------------------------- */

    function resetEditor() {

        state.editingId = null;

        elements.editingId.value = "";

        elements.title.value = "";

        elements.startDate.value = state.selectedDate;

        elements.endDate.value = state.selectedDate;

        elements.endDate.min = state.selectedDate;

        elements.time.value = VENA_SCHEDULE_CONFIG.defaultTime;

        setColorInput(VENA_SCHEDULE_CONFIG.defaultColor);

        setText(

            elements.saveButton,

            initialSaveLabel

        );

        setHidden(elements.cancelEdit, true);

    }


    /* -----------------------------------------------------
       40-10. Select calendar date
    ----------------------------------------------------- */

    function selectDate(value) {

        const date = parseLocalDate(value);

        if (!date) {

            return;

        }

        state.selectedDate = value;

        state.month = getMonthStart(date);

        if (!state.editingId) {

            elements.startDate.value = value;

            elements.endDate.value = value;

            elements.endDate.min = value;

        }

        render();

    }


    /* -----------------------------------------------------
       40-11. Change visible month
    ----------------------------------------------------- */

    function changeMonth(amount) {

        state.month = shiftCalendarMonth(

            state.month,

            amount

        );

        renderCalendar();

    }


    /* -----------------------------------------------------
       40-12. Save schedule
    ----------------------------------------------------- */

    function saveSchedule() {

        const validation = validateSchedule({

            title: elements.title.value,

            date: elements.startDate.value,

            endDate: elements.endDate.value,

            time: elements.time.value,

            color: elements.color.value

        });

        if (!validation.valid) {

            feedback(validation.message, "warning");

            return;

        }

        const isEditing = Boolean(state.editingId);

        if (isEditing) {

            const index = state.schedules.findIndex(

                (schedule) =>

                    schedule.id === state.editingId

            );

            if (index === -1) {

                resetEditor();

                feedback(

                    "수정할 일정을 찾을 수 없습니다.",

                    "error"

                );

                return;

            }

            state.schedules[index] = {

                id: state.editingId,

                ...validation.data

            };

        } else {

            state.schedules.push({

                id: createDemoId("schedule"),

                ...validation.data

            });

        }

        state.selectedDate = validation.data.date;

        state.month = getMonthStart(

            parseLocalDate(state.selectedDate)

        );

        resetEditor();

        render();

        feedback(

            isEditing

                ? "일정을 수정했습니다."

                : "새 일정을 등록했습니다.",

            "success"

        );

    }


    /* -----------------------------------------------------
       40-13. Edit schedule
    ----------------------------------------------------- */

    function editSchedule(id) {

        const schedule = state.schedules.find(

            (item) => item.id === id

        );

        if (!schedule) {

            return;

        }

        state.editingId = id;

        elements.editingId.value = id;

        elements.title.value = schedule.title;

        elements.startDate.value = schedule.date;

        elements.endDate.min = schedule.date;

        elements.endDate.value = schedule.endDate;

        elements.time.value = schedule.time;

        setColorInput(schedule.color);

        setText(

            elements.saveButton,

            "수정 내용 저장"

        );

        setHidden(elements.cancelEdit, false);

        feedback(

            "일정 수정 모드입니다.",

            "info"

        );

        elements.title.focus();

    }


    /* -----------------------------------------------------
       40-14. Delete schedule
    ----------------------------------------------------- */

    function deleteSchedule(id) {

        const schedule = state.schedules.find(

            (item) => item.id === id

        );

        if (!schedule) {

            return;

        }

        const confirmed = window.confirm(

            `"${schedule.title}" 일정을 삭제하시겠습니까?`

        );

        if (!confirmed) {

            return;

        }

        state.schedules = state.schedules.filter(

            (item) => item.id !== id

        );

        if (state.editingId === id) {

            resetEditor();

        }

        render();

        feedback(

            "일정을 삭제했습니다.",

            "success"

        );

    }


    /* -----------------------------------------------------
       40-15. Reset calendar demonstration
    ----------------------------------------------------- */

    function resetDemo() {

        state.month = getMonthStart(baseDate);

        state.selectedDate = initialDate;

        state.schedules = createInitialSchedules(baseDate);

        resetEditor();

        render();

        feedback(

            "캘린더를 초기 상태로 복원했습니다.",

            "info"

        );

    }


    /* -----------------------------------------------------
       40-16. Bind events
    ----------------------------------------------------- */

    elements.prevMonth.addEventListener(

        "click",

        () => changeMonth(-1)

    );

    elements.nextMonth.addEventListener(

        "click",

        () => changeMonth(1)

    );

    elements.grid.addEventListener(

        "click",

        (event) => {

            const button = event.target.closest(

                "[data-calendar-date]"

            );

            if (!button || !elements.grid.contains(button)) {

                return;

            }

            const value = button.dataset.calendarDate;

            selectDate(value);

            const selected = $$(
                "[data-calendar-date]",
                elements.grid
            ).find((item) =>

                item.dataset.calendarDate === value

            );

            selected?.focus({ preventScroll: true });

        }

    );

    elements.form.addEventListener(

        "submit",

        (event) => {

            event.preventDefault();

            saveSchedule();

        }

    );

    elements.startDate.addEventListener(

        "change",

        () => {

            const start = elements.startDate.value;

            elements.endDate.min = start;

            if (

                !elements.endDate.value ||

                elements.endDate.value < start

            ) {

                elements.endDate.value = start;

            }

        }

    );

    elements.cancelEdit.addEventListener(

        "click",

        (event) => {

            event.preventDefault();

            resetEditor();

            feedback(

                "일정 수정을 취소했습니다.",

                "info"

            );

        }

    );

    elements.eventList.addEventListener(

        "click",

        (event) => {

            const button = event.target.closest(

                "[data-schedule-action][data-schedule-id]"

            );

            if (

                !button ||

                !elements.eventList.contains(button)

            ) {

                return;

            }

            const id = button.dataset.scheduleId;

            const action = button.dataset.scheduleAction;

            if (action === "edit") {

                editSchedule(id);

            }

            if (action === "delete") {

                deleteSchedule(id);

            }

        }

    );

    elements.resetButton.addEventListener(

        "click",

        resetDemo

    );

    elements.title.maxLength =

        VENA_SCHEDULE_CONFIG.maxTitleLength;

    elements.selectedDate.setAttribute(

        "aria-live",

        "polite"

    );

    /* -----------------------------------------------------
       40-17. Initial render
    ----------------------------------------------------- */

    resetDemo();

}


/* =========================================================
   41. TODO DEMONSTRATION CONFIGURATION
========================================================= */

const VENA_TODO_CONFIG = Object.freeze({

    maxTitleLength: 100,

    undoDuration: 5000

});


function createInitialTodos() {

    return [

        {

            id: "todo-001",

            title: "오전 진료 일정 확인",

            isCompleted: true

        },

        {

            id: "todo-002",

            title: "환자 검사 결과 검토",

            isCompleted: false

        },

        {

            id: "todo-003",

            title: "협진 요청 답변 작성",

            isCompleted: false

        },

        {

            id: "todo-004",

            title: "진료 메모 정리",

            isCompleted: false

        }

    ];

}


/* =========================================================
   42. TODO DATA UTILITIES
========================================================= */

function calculateTodoProgress(todos) {

    const total = todos.length;

    const completed = todos.filter(

        (todo) => todo.isCompleted

    ).length;

    const remaining = total - completed;

    const percent = total > 0

        ? Math.round((completed / total) * 100)

        : 0;

    return {

        total,

        completed,

        remaining,

        percent

    };

}


/**
 * Serialize the simplified Flutter To-do data structure.
 */

function serializeDemoTodos(todos) {

    return todos.map((todo) => ({

        title: todo.title,

        isCompleted: todo.isCompleted

    }));

}


/* =========================================================
   43. TODO LIST DEMONSTRATION
========================================================= */

function initTodoDemo() {

    const root = byId("todoDemo");

    if (!root) {

        return false;

    }

    const elements = {

        progressLabel: byId("todoProgressLabel"),

        progressPercent: byId("todoProgressPercent"),

        progressBar: byId("todoProgressBar"),

        form: byId("todoDemoForm"),

        input: byId("todoDemoInput"),

        list: byId("todoDemoList"),

        undoPanel: byId("todoUndoPanel"),

        undoMessage: byId("todoUndoMessage"),

        undoButton: byId("todoUndoButton"),

        json: byId("todoJsonOutput"),

        resetButton: byId("todoResetButton")

    };

    const missingElements = Object.entries(elements)

        .filter(([, element]) => !element)

        .map(([name]) => name);

    if (missingElements.length) {

        console.warn(

            "[VENA] Todo elements missing:",

            missingElements

        );

        return false;

    }

    const state = {

        todos: createInitialTodos(),

        lastDeleted: null,

        undoTimer: null

    };


    /* -----------------------------------------------------
       43-1. Render progress
    ----------------------------------------------------- */

    function renderProgress() {

        const progress = calculateTodoProgress(

            state.todos

        );

        setText(

            elements.progressLabel,

            `${progress.completed} / ${progress.total} 완료`

        );

        setText(

            elements.progressPercent,

            `${progress.percent}%`

        );

        setProgress(

            elements.progressBar,

            progress.percent

        );

        elements.progressBar.setAttribute(

            "aria-label",

            "할 일 완료율"

        );

    }


    /* -----------------------------------------------------
       43-2. Create todo element
    ----------------------------------------------------- */

    function createTodoItem(todo) {

        const item = createElement(

            "div",

            "todo-item todo-demo-item"

        );

        item.dataset.todoId = todo.id;

        item.classList.toggle(

            "completed",

            todo.isCompleted

        );

        item.classList.toggle(

            "is-completed",

            todo.isCompleted

        );

        const label = createElement(

            "label",

            "todo-checkbox-label"

        );

        const checkbox = createElement(

            "input",

            "todo-checkbox"

        );

        checkbox.type = "checkbox";

        checkbox.checked = todo.isCompleted;

        checkbox.dataset.todoToggle = todo.id;

        const title = createElement(

            "span",

            "todo-title todo-item-title",

            todo.title

        );

        if (todo.isCompleted) {

            title.style.textDecoration = "line-through";

        }

        label.append(checkbox, title);

        const deleteButton = createElement(

            "button",

            "todo-delete-button",

            "삭제"

        );

        deleteButton.type = "button";

        deleteButton.dataset.todoDelete = todo.id;

        deleteButton.setAttribute(

            "aria-label",

            `${todo.title} 삭제`

        );

        item.append(label, deleteButton);

        return item;

    }


    /* -----------------------------------------------------
       43-3. Render todo list
    ----------------------------------------------------- */

    function renderTodoList() {

        clearElement(elements.list);

        if (!state.todos.length) {

            elements.list.append(

                createElement(

                    "div",

                    "todo-empty-state empty-state",

                    "등록된 할 일이 없습니다."

                )

            );

            return;

        }

        state.todos.forEach((todo) => {

            elements.list.append(

                createTodoItem(todo)

            );

        });

    }


    /* -----------------------------------------------------
       43-4. Render JSON preview
    ----------------------------------------------------- */

    function renderTodoJson() {

        renderJson(

            elements.json,

            serializeDemoTodos(state.todos)

        );

    }


    /* -----------------------------------------------------
       43-5. Render all components
    ----------------------------------------------------- */

    function render() {

        renderProgress();

        renderTodoList();

        renderTodoJson();

    }


    /* -----------------------------------------------------
       43-6. Add todo
    ----------------------------------------------------- */

    function addTodo() {

        const title = elements.input.value.trim();

        if (!title) {

            elements.input.setCustomValidity(

                "할 일을 입력해 주세요."

            );

            elements.input.reportValidity();

            return;

        }

        if (title.length > VENA_TODO_CONFIG.maxTitleLength) {

            elements.input.setCustomValidity(

                "할 일은 100자 이내로 입력해 주세요."

            );

            elements.input.reportValidity();

            return;

        }

        elements.input.setCustomValidity("");

        state.todos.push({

            id: createDemoId("todo"),

            title,

            isCompleted: false

        });

        elements.input.value = "";

        render();

        elements.input.focus();

    }


    /* -----------------------------------------------------
       43-7. Toggle todo completion
    ----------------------------------------------------- */

    function toggleTodo(id, checked) {

        const todo = state.todos.find(

            (item) => item.id === id

        );

        if (!todo) {

            return;

        }

        todo.isCompleted = Boolean(checked);

        render();

        const checkbox = $$(
            "[data-todo-toggle]",
            elements.list
        ).find((item) =>

            item.dataset.todoToggle === id

        );

        checkbox?.focus({ preventScroll: true });

    }


    /* -----------------------------------------------------
       43-8. Clear undo state
    ----------------------------------------------------- */

    function clearUndo() {

        if (state.undoTimer !== null) {

            window.clearTimeout(state.undoTimer);

            state.undoTimer = null;

        }

        state.lastDeleted = null;

        setHidden(elements.undoPanel, true);

        setDisabled(elements.undoButton, true);

    }


    /* -----------------------------------------------------
       43-9. Show undo notification
    ----------------------------------------------------- */

    function showUndo(todo, index) {

        clearUndo();

        state.lastDeleted = {

            todo: cloneData(todo),

            index

        };

        setText(

            elements.undoMessage,

            `"${todo.title}" 항목을 삭제했습니다.`

        );

        setHidden(elements.undoPanel, false);

        setDisabled(elements.undoButton, false);

        state.undoTimer = window.setTimeout(

            clearUndo,

            VENA_TODO_CONFIG.undoDuration

        );

    }


    /* -----------------------------------------------------
       43-10. Delete todo
    ----------------------------------------------------- */

    function deleteTodo(id) {

        const index = state.todos.findIndex(

            (todo) => todo.id === id

        );

        if (index === -1) {

            return;

        }

        const [removed] = state.todos.splice(

            index,

            1

        );

        render();

        showUndo(removed, index);

        elements.undoButton.focus({

            preventScroll: true

        });

    }


    /* -----------------------------------------------------
       43-11. Undo deletion
    ----------------------------------------------------- */

    function undoDelete() {

        if (!state.lastDeleted) {

            return;

        }

        const { todo, index } = state.lastDeleted;

        const alreadyExists = state.todos.some(

            (item) => item.id === todo.id

        );

        if (!alreadyExists) {

            const insertIndex = clamp(

                index,

                0,

                state.todos.length

            );

            state.todos.splice(

                insertIndex,

                0,

                cloneData(todo)

            );

        }

        clearUndo();

        render();

        const restored = $$(
            "[data-todo-toggle]",
            elements.list
        ).find((item) =>

            item.dataset.todoToggle === todo.id

        );

        restored?.focus({ preventScroll: true });

    }


    /* -----------------------------------------------------
       43-12. Reset todo demonstration
    ----------------------------------------------------- */

    function resetDemo() {

        clearUndo();

        state.todos = createInitialTodos();

        elements.input.value = "";

        elements.input.setCustomValidity("");

        render();

    }


    /* -----------------------------------------------------
       43-13. Bind events
    ----------------------------------------------------- */

    elements.form.addEventListener(

        "submit",

        (event) => {

            event.preventDefault();

            addTodo();

        }

    );

    elements.input.addEventListener(

        "input",

        () => {

            elements.input.setCustomValidity("");

        }

    );

    elements.list.addEventListener(

        "change",

        (event) => {

            const checkbox = event.target.closest(

                "[data-todo-toggle]"

            );

            if (

                !checkbox ||

                !elements.list.contains(checkbox)

            ) {

                return;

            }

            toggleTodo(

                checkbox.dataset.todoToggle,

                checkbox.checked

            );

        }

    );

    elements.list.addEventListener(

        "click",

        (event) => {

            const button = event.target.closest(

                "[data-todo-delete]"

            );

            if (

                !button ||

                !elements.list.contains(button)

            ) {

                return;

            }

            deleteTodo(button.dataset.todoDelete);

        }

    );

    elements.undoButton.addEventListener(

        "click",

        undoDelete

    );

    elements.resetButton.addEventListener(

        "click",

        resetDemo

    );

    elements.input.maxLength =

        VENA_TODO_CONFIG.maxTitleLength;

    elements.progressLabel.setAttribute(

        "aria-live",

        "polite"

    );

    elements.undoPanel.setAttribute(

        "aria-live",

        "polite"

    );

    /* -----------------------------------------------------
       43-14. Initial render
    ----------------------------------------------------- */

    resetDemo();

}


/* =========================================================
   44. SCHEDULE & TASK INITIALIZATION
========================================================= */

function initScheduleAndTasks() {

    initializeModule(

        "Calendar & Schedule Management",

        initCalendarDemo

    );

    initializeModule(

        "Todo List Management",

        initTodoDemo

    );

}


/* =========================================================
   PART 5 END

   NEXT:
   TEXT MEMO CRUD
   MEMO TEMPLATE MANAGEMENT
   VOICE RECORDING SIMULATION
   RECORDING LIFECYCLE
   MULTIPART UPLOAD SIMULATION

   Note:
   Application initialization will be added in PART 8.
========================================================= */

/* =========================================================
   PART 6
   CLINICAL NOTES & VOICE MEMO MANAGEMENT

   Text memo CRUD, quick templates, recording lifecycle
   and multipart upload simulation.

   No microphone access.
   No actual audio files.
   No external network requests.
========================================================= */


/* =========================================================
   45. CLINICAL MEMO CONFIGURATION
========================================================= */

const VENA_MEMO_CONFIG = Object.freeze({

    maxTitleLength: 200,

    maxContentLength: 1000,

    autoTitleLength: 30,

    patientId: "DEMO-001",

    endpoint: "/api/memos/",

    voiceEndpoint: "/api/memos/voice/",

    templates: [

        "복용 약물",

        "추가 검사",

        "특이 사항"

    ]

});


/* =========================================================
   46. TEXT MEMO DATA UTILITIES
========================================================= */

function createInitialTextMemos() {

    const now = Date.now();

    return [

        {

            id: "memo-001",

            patientId: VENA_MEMO_CONFIG.patientId,

            memoType: "text",

            title: "검사 결과 검토",

            content: "가상 검사 결과 확인 및 추가 검토 예정.",

            createdAt: new Date(now - 3600000).toISOString(),

            updatedAt: new Date(now - 3600000).toISOString()

        },

        {

            id: "memo-002",

            patientId: VENA_MEMO_CONFIG.patientId,

            memoType: "text",

            title: "협진 관련 메모",

            content: "의료진 간 협진 요청 내용 확인.",

            createdAt: new Date(now - 7200000).toISOString(),

            updatedAt: new Date(now - 7200000).toISOString()

        }

    ];

}


/**
 * Generate a title from the first non-empty line.
 */

function generateMemoTitle(content) {

    const firstLine = String(content ?? "")

        .split(/\r?\n/)

        .map((line) => line.trim())

        .find(Boolean) || "텍스트 메모";

    const maximum = VENA_MEMO_CONFIG.autoTitleLength;

    return firstLine.length > maximum

        ? `${firstLine.slice(0, maximum)}…`

        : firstLine;

}


/**
 * Validate text memo form values.
 */

function validateTextMemo(title, content) {

    const normalizedTitle = String(title ?? "").trim();

    const normalizedContent = String(content ?? "").trim();

    if (!normalizedContent) {

        return {

            valid: false,

            message: "메모 내용을 입력해 주세요."

        };

    }

    if (

        normalizedTitle.length >

        VENA_MEMO_CONFIG.maxTitleLength

    ) {

        return {

            valid: false,

            message: "제목은 200자 이내로 입력해 주세요."

        };

    }

    if (

        normalizedContent.length >

        VENA_MEMO_CONFIG.maxContentLength

    ) {

        return {

            valid: false,

            message: "메모 내용은 1,000자 이내로 입력해 주세요."

        };

    }

    return {

        valid: true,

        data: {

            title: normalizedTitle ||

                generateMemoTitle(normalizedContent),

            content: normalizedContent

        }

    };

}


/**
 * Sort memos by latest modification time.
 */

function sortDemoMemos(memos) {

    return [...memos].sort((a, b) => {

        const aTime = Date.parse(

            a.updatedAt || a.createdAt

        ) || 0;

        const bTime = Date.parse(

            b.updatedAt || b.createdAt

        ) || 0;

        return bTime - aTime;

    });

}


/* =========================================================
   47. TEXT MEMO DEMONSTRATION
========================================================= */

function initTextMemoDemo() {

    const root = document.getElementById("textMemoDemo");

    if (!root) return false;

    const get = (id) => document.getElementById(id);

    const elements = {

        count: get("memoDemoCount"),

        newButton: get("memoNewButton"),

        list: get("memoDemoList"),

        editorMode: get("memoEditorMode"),

        form: get("memoDemoForm"),

        editingId: get("memoEditingId"),

        title: get("memoDemoTitle"),

        content: get("memoDemoContent"),

        contentCount: get("memoContentCount"),

        saveButton: get("memoSaveButton"),

        feedback: get("memoDemoFeedback"),

        resetButton: get("memoResetButton"),

        eventLog: get("memoDemoEventLog")

    };

    if (Object.values(elements).some((element) => !element)) {

        console.warn("[VENA] Text memo elements missing.");

        return false;

    }

    const state = {

        memos: createInitialTextMemos(),

        editingId: null

    };


    /* -----------------------------------------------------
       47-1. Feedback and event log
    ----------------------------------------------------- */

    function logEvent(message, type = "info") {

        setFeedback(

            elements.feedback,

            message,

            type

        );

        addEventLog(

            elements.eventLog,

            message,

            type

        );

    }


    /* -----------------------------------------------------
       47-2. Render character count
    ----------------------------------------------------- */

    function renderContentCount() {

        const length = elements.content.value.length;

        const maximum = VENA_MEMO_CONFIG.maxContentLength;

        elements.contentCount.textContent =

            `${length} / ${maximum}`;

        elements.contentCount.classList.toggle(

            "warning",

            length >= maximum

        );

        elements.saveButton.disabled =

            !elements.content.value.trim();

    }


    /* -----------------------------------------------------
       47-3. Create memo card
    ----------------------------------------------------- */

    function createMemoCard(memo) {

        const card = document.createElement("article");

        card.className = "memo-demo-card memo-list-item";

        card.dataset.memoId = memo.id;

        card.classList.toggle(

            "active",

            state.editingId === memo.id

        );

        const header = document.createElement("div");

        header.className = "memo-card-header";

        const type = document.createElement("span");

        type.className = "memo-type-badge";

        type.textContent = "TEXT";

        const title = document.createElement("strong");

        title.className = "memo-card-title";

        title.textContent = memo.title;

        header.append(type, title);

        const content = document.createElement("p");

        content.className = "memo-card-content";

        content.textContent = memo.content;

        const metadata = document.createElement("div");

        metadata.className = "memo-card-meta";

        metadata.textContent =

            `${memo.patientId} · ` +

            new Date(memo.updatedAt).toLocaleString("ko-KR");

        const actions = document.createElement("div");

        actions.className = "memo-card-actions";

        const editButton = document.createElement("button");

        editButton.type = "button";

        editButton.className =

            "button button-outline memo-edit-button";

        editButton.textContent = "수정";

        editButton.dataset.memoAction = "edit";

        editButton.dataset.memoId = memo.id;

        editButton.setAttribute(

            "aria-label",

            `${memo.title} 수정`

        );

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.className =

            "button button-outline memo-delete-button";

        deleteButton.textContent = "삭제";

        deleteButton.dataset.memoAction = "delete";

        deleteButton.dataset.memoId = memo.id;

        deleteButton.setAttribute(

            "aria-label",

            `${memo.title} 삭제`

        );

        actions.append(editButton, deleteButton);

        card.append(header, content, metadata, actions);

        return card;

    }


    /* -----------------------------------------------------
       47-4. Render memo list
    ----------------------------------------------------- */

    function renderMemoList() {

        elements.count.textContent =

            `${state.memos.length}개`;

        elements.list.replaceChildren();

        if (!state.memos.length) {

            const empty = document.createElement("div");

            empty.className = "empty-state memo-empty-state";

            empty.textContent = "등록된 텍스트 메모가 없습니다.";

            elements.list.append(empty);

            return;

        }

        sortDemoMemos(state.memos).forEach((memo) => {

            elements.list.append(createMemoCard(memo));

        });

    }


    /* -----------------------------------------------------
       47-5. Open new memo editor
    ----------------------------------------------------- */

    function resetEditor() {

        state.editingId = null;

        elements.editingId.value = "";

        elements.title.value = "";

        elements.content.value = "";

        elements.editorMode.textContent = "NEW MEMO";

        elements.saveButton.textContent = "메모 저장";

        renderContentCount();

        renderMemoList();

    }


    /* -----------------------------------------------------
       47-6. Edit existing memo
    ----------------------------------------------------- */

    function editMemo(id) {

        const memo = state.memos.find(

            (item) => item.id === id

        );

        if (!memo) return;

        state.editingId = memo.id;

        elements.editingId.value = memo.id;

        elements.title.value = memo.title;

        elements.content.value = memo.content;

        elements.editorMode.textContent = "EDIT MEMO";

        elements.saveButton.textContent = "수정 내용 저장";

        renderContentCount();

        renderMemoList();

        logEvent(

            `GET /api/memos/${memo.id}/ · Simulation`

        );

        elements.title.focus();

    }


    /* -----------------------------------------------------
       47-7. Save text memo
    ----------------------------------------------------- */

    function saveMemo() {

        const validation = validateTextMemo(

            elements.title.value,

            elements.content.value

        );

        if (!validation.valid) {

            logEvent(validation.message, "warning");

            return;

        }

        const now = new Date().toISOString();

        if (state.editingId) {

            const index = state.memos.findIndex(

                (memo) => memo.id === state.editingId

            );

            if (index === -1) {

                logEvent(

                    "수정할 메모를 찾을 수 없습니다.",

                    "error"

                );

                return;

            }

            const id = state.editingId;

            state.memos[index] = {

                ...state.memos[index],

                ...validation.data,

                updatedAt: now

            };

            resetEditor();

            logEvent(

                `PATCH /api/memos/${id}/ · 200 OK (Simulation)`,

                "success"

            );

        } else {

            const memo = {

                id: createDemoId("memo"),

                patientId: VENA_MEMO_CONFIG.patientId,

                memoType: "text",

                ...validation.data,

                createdAt: now,

                updatedAt: now

            };

            state.memos.unshift(memo);

            resetEditor();

            logEvent(

                "POST /api/memos/ · 201 Created (Simulation)",

                "success"

            );

        }

    }


    /* -----------------------------------------------------
       47-8. Delete memo
    ----------------------------------------------------- */

    function deleteMemo(id) {

        const memo = state.memos.find(

            (item) => item.id === id

        );

        if (!memo) return;

        if (!window.confirm(`"${memo.title}" 메모를 삭제할까요?`)) {

            return;

        }

        state.memos = state.memos.filter(

            (item) => item.id !== id

        );

        if (state.editingId === id) {

            resetEditor();

        }

        renderMemoList();

        logEvent(

            `DELETE /api/memos/${id}/ · 204 No Content (Simulation)`,

            "success"

        );

    }


    /* -----------------------------------------------------
       47-9. Insert quick template
    ----------------------------------------------------- */

    function insertTemplate(template) {

        if (!VENA_MEMO_CONFIG.templates.includes(template)) {

            return;

        }

        const current = elements.content.value;

        const separator = current.trim() ? "\n\n" : "";

        const addition = `${separator}${template}: `;

        if (

            current.length + addition.length >

            VENA_MEMO_CONFIG.maxContentLength

        ) {

            logEvent(

                "메모 글자 수 제한을 초과할 수 없습니다.",

                "warning"

            );

            return;

        }

        elements.content.value = current + addition;

        renderContentCount();

        elements.content.focus();

        elements.content.setSelectionRange(

            elements.content.value.length,

            elements.content.value.length

        );

    }


    /* -----------------------------------------------------
       47-10. Reset demonstration
    ----------------------------------------------------- */

    function resetDemo() {

        state.memos = createInitialTextMemos();

        elements.eventLog.replaceChildren();

        resetEditor();

        logEvent("텍스트 메모 데모 초기화.");

    }


    /* -----------------------------------------------------
       47-11. Bind events
    ----------------------------------------------------- */

    elements.form.addEventListener("submit", (event) => {

        event.preventDefault();

        saveMemo();

    });

    elements.content.addEventListener(

        "input",

        renderContentCount

    );

    elements.newButton.addEventListener("click", (event) => {

        event.preventDefault();

        resetEditor();

        elements.title.focus();

    });

    elements.list.addEventListener("click", (event) => {

        const button = event.target.closest(

            "[data-memo-action][data-memo-id]"

        );

        if (!button || !elements.list.contains(button)) return;

        const id = button.dataset.memoId;

        if (button.dataset.memoAction === "edit") {

            editMemo(id);

        }

        if (button.dataset.memoAction === "delete") {

            deleteMemo(id);

        }

    });

    root.querySelectorAll("[data-memo-template]")

        .forEach((button) => {

            button.addEventListener("click", (event) => {

                event.preventDefault();

                insertTemplate(button.dataset.memoTemplate);

            });

        });

    elements.resetButton.addEventListener("click", resetDemo);

    elements.title.maxLength = VENA_MEMO_CONFIG.maxTitleLength;

    elements.content.maxLength = VENA_MEMO_CONFIG.maxContentLength;

    resetDemo();

}


/* =========================================================
   48. VOICE MEMO CONFIGURATION
========================================================= */

const VENA_VOICE_CONFIG = Object.freeze({

    codec: "AAC-LC",

    extension: "m4a",

    bitRate: 128000,

    sampleRate: 44100,

    maxDurationSeconds: 300,

    uploadDelay: 1200,

    fileName: "voice_memo_demo.m4a"

});


const VENA_VOICE_STATUS = Object.freeze({

    IDLE: "idle",

    RECORDING: "recording",

    PAUSED: "paused",

    RECORDED: "recorded",

    UPLOADING: "uploading",

    UPLOADED: "uploaded",

    ERROR: "error"

});


const VENA_VOICE_LABELS = Object.freeze({

    idle: "녹음 대기",

    recording: "녹음 중",

    paused: "일시정지",

    recorded: "녹음 완료",

    uploading: "업로드 중",

    uploaded: "저장 완료",

    error: "업로드 실패"

});


/* =========================================================
   49. VOICE MEMO UTILITIES
========================================================= */

/**
 * Estimate encoded audio size.
 *
 * bytes = bitrate(bits/sec) * duration(sec) / 8
 *
 * Container overhead is excluded.
 */

function estimateVoiceFileSize(seconds) {

    return Math.round(

        VENA_VOICE_CONFIG.bitRate *

        Math.max(0, seconds) / 8

    );

}


function formatVoiceFileSize(bytes) {

    if (bytes >= 1024 * 1024) {

        return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;

    }

    return `${(bytes / 1024).toFixed(1)} KiB`;

}


function formatVoiceDuration(seconds) {

    const safeSeconds = Math.max(0, Math.floor(seconds));

    const minutes = Math.floor(safeSeconds / 60);

    const remainder = safeSeconds % 60;

    return (

        String(minutes).padStart(2, "0") +

        ":" +

        String(remainder).padStart(2, "0")

    );

}


/**
 * Create an illustrative multipart payload.
 *
 * This is a metadata object, not an actual FormData upload.
 */

function createVoicePayload(seconds) {

    return {

        patient_id: VENA_MEMO_CONFIG.patientId,

        memo_type: "voice",

        title: "음성 메모",

        audio_duration_seconds: Math.max(1, seconds),

        file: {

            name: VENA_VOICE_CONFIG.fileName,

            type: "audio/mp4",

            estimatedBytes: estimateVoiceFileSize(seconds)

        }

    };

}


/* =========================================================
   50. VOICE RECORDING DEMONSTRATION
========================================================= */

function initVoiceMemoDemo() {

    const root = document.getElementById("voiceMemoDemo");

    if (!root) return false;

    const get = (id) => document.getElementById(id);

    const elements = {

        status: get("voiceDemoStatus"),

        indicator: get("voiceRecordingIndicator"),

        timer: get("voiceDemoTimer"),

        waveform: get("voiceDemoWaveform"),

        startButton: get("voiceStartButton"),

        pauseButton: get("voicePauseButton"),

        stopButton: get("voiceStopButton"),

        filePreview: get("voiceFilePreview"),

        fileDuration: get("voiceFileDuration"),

        fileSize: get("voiceFileSize"),

        payloadDuration: get("voicePayloadDuration"),

        payloadFile: get("voicePayloadFile"),

        uploadScenario: get("voiceUploadScenario"),

        uploadProgress: get("voiceUploadProgress"),

        uploadFeedback: get("voiceUploadFeedback"),

        uploadButton: get("voiceUploadButton"),

        resetButton: get("voiceResetButton"),

        lifecycleStatus: get("voiceLifecycleStatus"),

        lifecycleLog: get("voiceLifecycleLog")

    };

    if (Object.values(elements).some((element) => !element)) {

        console.warn("[VENA] Voice memo elements missing.");

        return false;

    }

    const state = {

        status: VENA_VOICE_STATUS.IDLE,

        elapsedMs: 0,

        startedAt: null,

        duration: 0,

        recordingTimer: null,

        uploadTimer: null,

        uploadVersion: 0,

        uploadProgress: 0,

        file: null

    };


    /* -----------------------------------------------------
       50-1. Lifecycle event log
    ----------------------------------------------------- */

    function logLifecycle(message, type = "info") {

        setFeedback(

            elements.lifecycleStatus,

            message,

            type

        );

        addEventLog(

            elements.lifecycleLog,

            message,

            type

        );

    }


    /* -----------------------------------------------------
       50-2. Recording time management
    ----------------------------------------------------- */

    function getElapsedSeconds() {

        let elapsed = state.elapsedMs;

        if (

            state.status === VENA_VOICE_STATUS.RECORDING &&

            state.startedAt !== null

        ) {

            elapsed += performance.now() - state.startedAt;

        }

        return Math.min(

            Math.floor(elapsed / 1000),

            VENA_VOICE_CONFIG.maxDurationSeconds

        );

    }


    function accumulateRecordingTime() {

        if (state.startedAt !== null) {

            state.elapsedMs +=

                performance.now() - state.startedAt;

            state.startedAt = null;

        }

    }


    function clearRecordingTimer() {

        if (state.recordingTimer !== null) {

            window.clearInterval(state.recordingTimer);

            state.recordingTimer = null;

        }

    }


    function clearUploadTimer() {

        if (state.uploadTimer !== null) {

            window.clearInterval(state.uploadTimer);

            state.uploadTimer = null;

        }

    }


    /* -----------------------------------------------------
       50-3. Render recording timer
    ----------------------------------------------------- */

    function renderTimer() {

        const seconds = state.file

            ? state.duration

            : getElapsedSeconds();

        elements.timer.textContent =

            formatVoiceDuration(seconds);

    }


    /* -----------------------------------------------------
       50-4. Render simulated waveform
    ----------------------------------------------------- */

    function renderWaveform() {

        const recording =

            state.status === VENA_VOICE_STATUS.RECORDING;

        const paused =

            state.status === VENA_VOICE_STATUS.PAUSED;

        elements.waveform.classList.toggle(

            "recording",

            recording

        );

        elements.waveform.classList.toggle(

            "is-recording",

            recording

        );

        elements.waveform.classList.toggle(

            "active",

            recording

        );

        elements.waveform.classList.toggle(

            "paused",

            paused

        );

        elements.indicator.classList.toggle(

            "active",

            recording

        );

        elements.indicator.classList.toggle(

            "recording",

            recording

        );

        elements.indicator.dataset.status = state.status;

    }


    /* -----------------------------------------------------
       50-5. Render file metadata
    ----------------------------------------------------- */

    function renderFilePreview() {

        const hasFile = Boolean(state.file);

        elements.filePreview.hidden = !hasFile;

        elements.fileDuration.textContent = hasFile

            ? formatVoiceDuration(state.duration)

            : "00:00";

        elements.fileSize.textContent = hasFile

            ? formatVoiceFileSize(state.file.estimatedBytes)

            : "0 KiB";

        elements.payloadDuration.textContent = hasFile

            ? String(state.duration)

            : "0";

        elements.payloadFile.textContent = hasFile

            ? state.file.name

            : "—";

    }


    /* -----------------------------------------------------
       50-6. Render action availability
    ----------------------------------------------------- */

    function renderActions() {

        const recording =

            state.status === VENA_VOICE_STATUS.RECORDING;

        const paused =

            state.status === VENA_VOICE_STATUS.PAUSED;

        const uploading =

            state.status === VENA_VOICE_STATUS.UPLOADING;

        elements.startButton.disabled =

            recording || paused || uploading;

        elements.pauseButton.disabled =

            !recording && !paused;

        elements.stopButton.disabled =

            !recording && !paused;

        elements.pauseButton.textContent = paused

            ? "녹음 재개"

            : "일시정지";

        elements.uploadButton.disabled =

            !state.file ||

            uploading ||

            state.status === VENA_VOICE_STATUS.UPLOADED;

        elements.uploadScenario.disabled = uploading;

        elements.uploadButton.textContent = uploading

            ? "업로드 중..."

            : state.status === VENA_VOICE_STATUS.ERROR

                ? "다시 시도"

                : "음성 메모 업로드";

        root.setAttribute(

            "aria-busy",

            String(uploading)

        );

    }


    /* -----------------------------------------------------
       50-7. Render recording status
    ----------------------------------------------------- */

    function renderStatus() {

        const statuses = Object.values(VENA_VOICE_STATUS);

        statuses.forEach((status) => {

            elements.status.classList.remove(status);

            elements.status.classList.remove(`is-${status}`);

        });

        elements.status.classList.add(state.status);

        elements.status.classList.add(`is-${state.status}`);

        elements.status.dataset.status = state.status;

        elements.status.textContent =

            VENA_VOICE_LABELS[state.status];

    }


    /* -----------------------------------------------------
       50-8. Render upload progress
    ----------------------------------------------------- */

    function renderUploadProgress() {

        const progress = Math.max(

            0,

            Math.min(100, state.uploadProgress)

        );

        if (elements.uploadProgress.tagName === "PROGRESS") {

            elements.uploadProgress.max = 100;

            elements.uploadProgress.value = progress;

        } else {

            elements.uploadProgress.style.width =

                `${progress}%`;

        }

        elements.uploadProgress.setAttribute(

            "aria-valuenow",

            String(progress)

        );

    }


    /* -----------------------------------------------------
       50-9. Render all components
    ----------------------------------------------------- */

    function render() {

        renderStatus();

        renderTimer();

        renderWaveform();

        renderFilePreview();

        renderActions();

        renderUploadProgress();

    }


    /* -----------------------------------------------------
       50-10. Start timer
    ----------------------------------------------------- */

    function startRecordingTimer() {

        clearRecordingTimer();

        state.recordingTimer = window.setInterval(() => {

            renderTimer();

            if (

                getElapsedSeconds() >=

                VENA_VOICE_CONFIG.maxDurationSeconds

            ) {

                stopRecording();

            }

        }, 200);

    }


    /* -----------------------------------------------------
       50-11. Start recording simulation
    ----------------------------------------------------- */

    function startRecording() {

        if ([

            VENA_VOICE_STATUS.RECORDING,

            VENA_VOICE_STATUS.PAUSED,

            VENA_VOICE_STATUS.UPLOADING

        ].includes(state.status)) {

            return;

        }

        clearRecordingTimer();

        clearUploadTimer();

        state.uploadVersion += 1;

        state.elapsedMs = 0;

        state.duration = 0;

        state.file = null;

        state.uploadProgress = 0;

        state.startedAt = performance.now();

        state.status = VENA_VOICE_STATUS.RECORDING;

        setFeedback(

            elements.uploadFeedback,

            "녹음을 종료하면 파일 정보를 확인할 수 있습니다.",

            "info"

        );

        startRecordingTimer();

        render();

        logLifecycle(

            "IDLE → RECORDING · 가상 녹음 시작",

            "success"

        );

    }


    /* -----------------------------------------------------
       50-12. Pause or resume recording
    ----------------------------------------------------- */

    function toggleRecordingPause() {

        if (state.status === VENA_VOICE_STATUS.RECORDING) {

            accumulateRecordingTime();

            clearRecordingTimer();

            state.status = VENA_VOICE_STATUS.PAUSED;

            render();

            logLifecycle(

                "RECORDING → PAUSED · 녹음 시간 정지"

            );

            return;

        }

        if (state.status === VENA_VOICE_STATUS.PAUSED) {

            state.startedAt = performance.now();

            state.status = VENA_VOICE_STATUS.RECORDING;

            startRecordingTimer();

            render();

            logLifecycle(

                "PAUSED → RECORDING · 녹음 재개",

                "success"

            );

        }

    }


    /* -----------------------------------------------------
       50-13. Stop recording
    ----------------------------------------------------- */

    function stopRecording() {

        if (![

            VENA_VOICE_STATUS.RECORDING,

            VENA_VOICE_STATUS.PAUSED

        ].includes(state.status)) {

            return;

        }

        accumulateRecordingTime();

        clearRecordingTimer();

        state.duration = Math.min(

            VENA_VOICE_CONFIG.maxDurationSeconds,

            Math.max(1, Math.floor(state.elapsedMs / 1000))

        );

        const payload = createVoicePayload(state.duration);

        state.file = payload.file;

        state.status = VENA_VOICE_STATUS.RECORDED;

        render();

        setFeedback(

            elements.uploadFeedback,

            "가상 M4A 파일 정보가 준비되었습니다.",

            "success"

        );

        logLifecycle(

            `RECORDED · ${state.duration}초 · ` +

            formatVoiceFileSize(state.file.estimatedBytes),

            "success"

        );

    }


    /* -----------------------------------------------------
       50-14. Resolve upload scenario
    ----------------------------------------------------- */

    function getUploadScenario() {

        const value = String(

            elements.uploadScenario.value

        ).toLowerCase();

        if (

            value.includes("401") ||

            value.includes("unauthorized") ||

            value.includes("auth") ||

            value.includes("token")

        ) {

            return {

                success: false,

                code: "401 Unauthorized",

                message: "인증에 실패했습니다. 인증 상태 확인 후 재시도하세요."

            };

        }

        if (

            value.includes("timeout") ||

            value.includes("network") ||

            value.includes("connection")

        ) {

            return {

                success: false,

                code: "Network Error",

                message: "네트워크 오류가 발생했습니다. 파일은 유지됩니다."

            };

        }

        if (

            value.includes("400") ||

            value.includes("validation")

        ) {

            return {

                success: false,

                code: "400 Bad Request",

                message: "요청 데이터 검증에 실패했습니다."

            };

        }

        if (

            value.includes("500") ||

            value.includes("error") ||

            value.includes("fail") ||

            value.includes("server")

        ) {

            return {

                success: false,

                code: "500 Internal Server Error",

                message: "서버 오류가 발생했습니다. 다시 시도할 수 있습니다."

            };

        }

        if (

            value === "success" ||

            value === "201" ||

            value === "200" ||

            value === "ok" ||

            value.includes("success")

        ) {

            return {

                success: true,

                code: "201 Created",

                message: "가상 음성 메모가 저장되었습니다."

            };

        }

        return {

            success: false,

            code: "Unknown Scenario",

            message: "업로드 시나리오 설정을 확인해 주세요."

        };

    }


    /* -----------------------------------------------------
       50-15. Simulate multipart upload
    ----------------------------------------------------- */

    function uploadVoiceMemo() {

        if (!state.file) return;

        if (![

            VENA_VOICE_STATUS.RECORDED,

            VENA_VOICE_STATUS.ERROR

        ].includes(state.status)) {

            return;

        }

        clearUploadTimer();

        const version = ++state.uploadVersion;

        const scenario = getUploadScenario();

        const payload = createVoicePayload(state.duration);

        const startedAt = performance.now();

        state.status = VENA_VOICE_STATUS.UPLOADING;

        state.uploadProgress = 0;

        render();

        setFeedback(

            elements.uploadFeedback,

            "Multipart 요청 처리 중 (Simulation)",

            "info"

        );

        logLifecycle(

            `POST ${VENA_MEMO_CONFIG.voiceEndpoint}`

        );

        logLifecycle(

            `FormData · patient_id=${payload.patient_id} · ` +

            `duration=${payload.audio_duration_seconds}s`

        );

        state.uploadTimer = window.setInterval(() => {

            if (version !== state.uploadVersion) {

                return;

            }

            const elapsed = performance.now() - startedAt;

            state.uploadProgress = Math.min(

                100,

                Math.round(

                    elapsed / VENA_VOICE_CONFIG.uploadDelay * 100

                )

            );

            renderUploadProgress();

            if (state.uploadProgress < 100) return;

            clearUploadTimer();

            if (scenario.success) {

                state.status = VENA_VOICE_STATUS.UPLOADED;

                setFeedback(

                    elements.uploadFeedback,

                    `${scenario.code} · ${scenario.message}`,

                    "success"

                );

                logLifecycle(

                    "UPLOADED · 가상 서버 저장 성공",

                    "success"

                );

                logLifecycle(

                    "실제 앱에서는 성공 후 임시 파일 정리"

                );

            } else {

                state.status = VENA_VOICE_STATUS.ERROR;

                state.uploadProgress = 0;

                setFeedback(

                    elements.uploadFeedback,

                    `${scenario.code} · ${scenario.message}`,

                    "error"

                );

                logLifecycle(

                    `${scenario.code} · 파일 유지 및 재시도 가능`,

                    "error"

                );

            }

            render();

        }, 80);

    }


    /* -----------------------------------------------------
       50-16. Reset demonstration
    ----------------------------------------------------- */

    function resetDemo() {

        state.uploadVersion += 1;

        clearRecordingTimer();

        clearUploadTimer();

        state.status = VENA_VOICE_STATUS.IDLE;

        state.elapsedMs = 0;

        state.startedAt = null;

        state.duration = 0;

        state.file = null;

        state.uploadProgress = 0;

        elements.lifecycleLog.replaceChildren();

        elements.uploadScenario.selectedIndex = 0;

        setFeedback(

            elements.uploadFeedback,

            "녹음 완료 후 업로드할 수 있습니다.",

            "info"

        );

        render();

        logLifecycle("IDLE · 음성 메모 데모 초기화");

    }


    /* -----------------------------------------------------
       50-17. Bind events
    ----------------------------------------------------- */

    elements.startButton.addEventListener(

        "click",

        startRecording

    );

    elements.pauseButton.addEventListener(

        "click",

        toggleRecordingPause

    );

    elements.stopButton.addEventListener(

        "click",

        stopRecording

    );

    elements.uploadButton.addEventListener(

        "click",

        uploadVoiceMemo

    );

    elements.resetButton.addEventListener(

        "click",

        resetDemo

    );

    window.addEventListener("pagehide", () => {

        resetDemo();

    });

    elements.status.setAttribute(

        "aria-live",

        "polite"

    );

    elements.uploadFeedback.setAttribute(

        "aria-live",

        "polite"

    );

    resetDemo();

}


/* =========================================================
   51. CLINICAL NOTES INITIALIZATION
========================================================= */

function initClinicalNotes() {

    initializeModule(

        "Text Memo Management",

        initTextMemoDemo

    );

    initializeModule(

        "Voice Memo Lifecycle",

        initVoiceMemoDemo

    );

}


/* =========================================================
   PART 6 END

   NEXT:
   API ERROR HANDLING
   MOBILE THEME MANAGEMENT
   TROUBLESHOOTING FILTER
   ENGINEERING EVIDENCE FILTER

   Note:
   Application initialization will be added in PART 8.
========================================================= */

/* =========================================================
   PART 7
   API ERROR HANDLING & MOBILE STATE MANAGEMENT

   API response simulation
   Mobile theme management
   Troubleshooting category filters
   Engineering evidence filters

   All API responses are simulated.
========================================================= */


/* =========================================================
   52. API ERROR SCENARIO CONFIGURATION
========================================================= */

const VENA_API_SCENARIOS = Object.freeze({

    success: {

        status: 200,

        label: "200 OK",

        title: "정상 응답",

        type: "success",

        description:
            "서버 응답을 정상적으로 수신했습니다. " +
            "응답 데이터를 모델로 변환하고 화면 상태를 갱신합니다.",

        response: {

            status: 200,

            data: {

                patient_id: "DEMO-001",

                name: "가상 환자 A",

                age: 52

            }

        },

        recovery: [

            "응답 데이터 구조 확인",

            "JSON 모델 변환",

            "ViewModel 상태 갱신",

            "UI 재렌더링"

        ]

    },

    bad_request: {

        status: 400,

        label: "400 Bad Request",

        title: "요청 데이터 검증 실패",

        type: "error",

        description:
            "필수 입력값이 누락되었거나 요청 형식이 올바르지 않습니다. " +
            "서버의 필드별 검증 메시지를 확인해야 합니다.",

        response: {

            status: 400,

            patient_id: [

                "This field is required."

            ]

        },

        recovery: [

            "필수 입력값 확인",

            "요청 데이터 형식 확인",

            "필드별 오류 메시지 표시",

            "사용자 입력 수정 후 재요청"

        ]

    },

    unauthorized: {

        status: 401,

        label: "401 Unauthorized",

        title: "인증 실패",

        type: "error",

        description:
            "인증 토큰이 누락되었거나 유효하지 않습니다. " +
            "저장된 토큰과 로그인 상태를 확인해야 합니다.",

        response: {

            status: 401,

            detail:
                "Authentication credentials were not provided " +
                "or the token is invalid."

        },

        recovery: [

            "Bearer Token 존재 여부 확인",

            "토큰 유효성 확인",

            "필요 시 인증 상태 복구",

            "재로그인 또는 인증 갱신 정책 적용"

        ]

    },

    forbidden: {

        status: 403,

        label: "403 Forbidden",

        title: "접근 권한 부족",

        type: "error",

        description:
            "인증된 사용자라도 해당 리소스에 접근할 권한이 없을 수 있습니다. " +
            "서버에서 권한 검사가 필요합니다.",

        response: {

            status: 403,

            detail:
                "You do not have permission to perform this action."

        },

        recovery: [

            "사용자 역할 확인",

            "리소스 접근 권한 확인",

            "권한 부족 안내",

            "무조건적인 재시도 방지"

        ]

    },

    not_found: {

        status: 404,

        label: "404 Not Found",

        title: "리소스를 찾을 수 없음",

        type: "error",

        description:
            "요청한 환자, 메모 또는 기타 리소스가 존재하지 않거나 " +
            "접근 가능한 조회 대상에 포함되지 않습니다.",

        response: {

            status: 404,

            detail: "Not found."

        },

        recovery: [

            "요청 URL 확인",

            "리소스 ID 확인",

            "목록 데이터 다시 조회",

            "존재하지 않는 상세 데이터 정리"

        ]

    },

    conflict: {

        status: 409,

        label: "409 Conflict",

        title: "데이터 상태 충돌",

        type: "error",

        description:
            "현재 서버 상태와 사용자의 변경 요청이 충돌하는 상황입니다. " +
            "최신 데이터를 확인한 뒤 변경 여부를 판단해야 합니다.",

        response: {

            status: 409,

            detail: "Resource state conflict."

        },

        recovery: [

            "최신 서버 상태 조회",

            "충돌 원인 확인",

            "사용자에게 변경 사항 안내",

            "필요 시 수정 요청 재작성"

        ]

    },

    validation: {

        status: 422,

        label: "422 Unprocessable Entity",

        title: "요청 내용 처리 실패",

        type: "error",

        description:
            "요청 형식은 해석할 수 있지만 데이터의 내용이 " +
            "처리 조건을 충족하지 않습니다.",

        response: {

            status: 422,

            detail: [

                {

                    loc: ["body", "patient_id"],

                    msg: "Invalid patient identifier.",

                    type: "value_error"

                }

            ]

        },

        recovery: [

            "서버 검증 규칙 확인",

            "입력값 범위 확인",

            "데이터 수정",

            "수정된 요청 전송"

        ]

    },

    rate_limit: {

        status: 429,

        label: "429 Too Many Requests",

        title: "요청 횟수 제한",

        type: "error",

        description:
            "허용된 요청 횟수를 초과했습니다. " +
            "즉시 반복 요청하지 않고 서버의 재시도 정책을 확인해야 합니다.",

        response: {

            status: 429,

            detail: "Request was throttled."

        },

        recovery: [

            "Retry-After 헤더 확인",

            "반복 요청 중단",

            "재시도 간격 조절",

            "Polling 요청 빈도 검토"

        ]

    },

    server_error: {

        status: 500,

        label: "500 Internal Server Error",

        title: "서버 내부 오류",

        type: "error",

        description:
            "서버에서 요청 처리 중 오류가 발생했습니다. " +
            "사용자에게 안전한 오류 메시지를 제공하고 " +
            "입력 데이터가 손실되지 않도록 관리해야 합니다.",

        response: {

            status: 500,

            detail: "Internal server error."

        },

        recovery: [

            "기존 화면 데이터 유지 여부 판단",

            "사용자 입력 데이터 보존",

            "서버 오류 안내",

            "안전한 재시도 정책 적용"

        ]

    },

    unavailable: {

        status: 503,

        label: "503 Service Unavailable",

        title: "서비스 일시 중단",

        type: "error",

        description:
            "서버가 일시적으로 요청을 처리할 수 없습니다. " +
            "서비스 복구 여부와 재시도 가능 시간을 확인해야 합니다.",

        response: {

            status: 503,

            detail: "Service temporarily unavailable."

        },

        recovery: [

            "서비스 상태 확인",

            "사용자 입력 보존",

            "즉시 반복 요청 방지",

            "서비스 복구 후 재시도"

        ]

    },

    timeout: {

        status: null,

        label: "Request Timeout",

        title: "요청 시간 초과",

        type: "warning",

        description:
            "설정된 제한 시간 내에 요청 또는 응답 처리가 완료되지 않았습니다. " +
            "네트워크 상태와 서버 응답 지연을 확인해야 합니다.",

        response: {

            status: null,

            error: {

                type: "receiveTimeout",

                message: "Response timeout exceeded."

            }

        },

        recovery: [

            "Loading 상태 종료",

            "네트워크 연결 확인",

            "서버 응답 지연 확인",

            "요청 결과 확인 후 재시도"

        ]

    },

    network: {

        status: null,

        label: "Connection Error",

        title: "네트워크 연결 오류",

        type: "warning",

        description:
            "서버에 연결할 수 없거나 네트워크 연결이 중단되었습니다. " +
            "HTTP 응답 자체를 수신하지 못한 상황입니다.",

        response: {

            status: null,

            error: {

                type: "connectionError",

                message: "Unable to connect to the server."

            }

        },

        recovery: [

            "인터넷 연결 확인",

            "서버 주소 확인",

            "기존 데이터 및 입력값 유지",

            "연결 복구 후 재시도"

        ]

    },

    invalid_response: {

        status: 200,

        label: "Invalid Response",

        title: "응답 데이터 구조 오류",

        type: "error",

        description:
            "HTTP 요청은 성공했지만 응답 데이터 구조가 " +
            "클라이언트 모델의 예상 형식과 일치하지 않습니다.",

        response: {

            status: 200,

            data: "Unexpected response format"

        },

        recovery: [

            "응답 타입 검사",

            "JSON 필드 및 필수값 확인",

            "모델 변환 예외 처리",

            "잘못된 데이터를 UI에 반영하지 않음"

        ]

    }

});


/* =========================================================
   53. API SCENARIO UTILITIES
========================================================= */

/**
 * Resolve HTML select option values.
 *
 * Supports HTTP status codes and common scenario aliases.
 */

function resolveVenaApiScenario(value) {

    const normalized = String(value ?? "")

        .trim()

        .toLowerCase()

        .replace(/[\s-]+/g, "_");

    const aliases = {

        "200": "success",

        "201": "success",

        ok: "success",

        normal: "success",

        "400": "bad_request",

        badrequest: "bad_request",

        "401": "unauthorized",

        auth: "unauthorized",

        token: "unauthorized",

        "403": "forbidden",

        permission: "forbidden",

        "404": "not_found",

        notfound: "not_found",

        "409": "conflict",

        "422": "validation",

        "429": "rate_limit",

        "500": "server_error",

        server: "server_error",

        internal_server_error: "server_error",

        "503": "unavailable",

        service_unavailable: "unavailable",

        connection: "network",

        connection_error: "network",

        network_error: "network",

        receive_timeout: "timeout",

        connect_timeout: "timeout",

        connection_timeout: "timeout",

        parse_error: "invalid_response",

        invalid_json: "invalid_response",

        malformed: "invalid_response",

        malformed_response: "invalid_response",

        invalid_data: "invalid_response"

    };

    const key = aliases[normalized] || normalized;

    if (Object.prototype.hasOwnProperty.call(
        VENA_API_SCENARIOS,
        key
    )) {

        return VENA_API_SCENARIOS[key];

    }

    const statusMatch = normalized.match(

        /(?:^|_)(200|201|400|401|403|404|409|422|429|500|503)(?:_|$)/

    );

    if (statusMatch) {

        return VENA_API_SCENARIOS[

            aliases[statusMatch[1]]

        ];

    }

    if (normalized.includes("timeout")) {

        return VENA_API_SCENARIOS.timeout;

    }

    if (
        normalized.includes("network") ||
        normalized.includes("connection")
    ) {

        return VENA_API_SCENARIOS.network;

    }

    return null;

}


/**
 * Build a readable error message.
 *
 * Illustrates handling of detail, message
 * and field-level validation errors.
 */

function extractVenaApiMessage(response) {

    if (!response || typeof response !== "object") {

        return "응답 데이터를 확인할 수 없습니다.";

    }

    if (typeof response.detail === "string") {

        return response.detail;

    }

    if (typeof response.message === "string") {

        return response.message;

    }

    if (typeof response.error?.message === "string") {

        return response.error.message;

    }

    if (Array.isArray(response.detail)) {

        return response.detail

            .map((item) => {

                if (typeof item === "string") {

                    return item;

                }

                const location = Array.isArray(item.loc)

                    ? item.loc.join(".")

                    : "";

                return [

                    location,

                    item.msg || item.message || ""

                ].filter(Boolean).join(": ");

            })

            .filter(Boolean)

            .join("\n");

    }

    const fieldErrors = Object.entries(response)

        .filter(([key, value]) =>

            key !== "status" &&

            Array.isArray(value)

        )

        .map(([key, value]) =>

            `${key}: ${value.join(", ")}`

        );

    if (fieldErrors.length) {

        return fieldErrors.join("\n");

    }

    return "응답 구조 또는 상태를 확인해 주세요.";

}


/* =========================================================
   54. API ERROR HANDLING DEMONSTRATION
========================================================= */

function initApiErrorDemo() {

    const root = document.getElementById("apiErrorDemo");

    if (!root) return false;

    const get = (id) => document.getElementById(id);

    const elements = {

        scenario: get("apiErrorScenario"),

        runButton: get("apiErrorRunButton"),

        resetButton: get("apiErrorResetButton"),

        status: get("apiErrorStatus"),

        title: get("apiErrorTitle"),

        description: get("apiErrorDescription"),

        output: get("apiErrorOutput")

    };

    if (Object.values(elements).some((element) => !element)) {

        console.warn("[VENA] API error demo elements missing.");

        return false;

    }

    const state = {

        loading: false,

        timer: null,

        version: 0

    };

    const initialRunLabel =

        elements.runButton.textContent.trim() ||

        "요청 실행";


    /* -----------------------------------------------------
       54-1. Render response status
    ----------------------------------------------------- */

    function renderStatus(label, type = "idle") {

        const statusClasses = [

            "idle",

            "loading",

            "success",

            "warning",

            "error",

            "danger"

        ];

        statusClasses.forEach((className) => {

            elements.status.classList.remove(className);

            elements.status.classList.remove(`is-${className}`);

        });

        elements.status.classList.add(type);

        elements.status.classList.add(`is-${type}`);

        elements.status.dataset.status = type;

        elements.status.textContent = label;

    }


    /* -----------------------------------------------------
       54-2. Render loading state
    ----------------------------------------------------- */

    function setLoading(loading) {

        state.loading = loading;

        elements.runButton.disabled = loading;

        elements.scenario.disabled = loading;

        elements.runButton.textContent = loading

            ? "요청 처리 중..."

            : initialRunLabel;

        root.setAttribute(

            "aria-busy",

            String(loading)

        );

    }


    /* -----------------------------------------------------
       54-3. Render simulated response
    ----------------------------------------------------- */

    function renderScenario(scenario) {

        renderStatus(

            scenario.label,

            scenario.type

        );

        elements.title.textContent = scenario.title;

        elements.description.textContent =

            scenario.description;

        const result = {

            simulation: true,

            http_status: scenario.status,

            response: scenario.response,

            client_handling: {

                state: scenario.type === "success"

                    ? "success"

                    : "error",

                loading: false,

                message: scenario.type === "success"

                    ? "데이터 조회 성공"

                    : extractVenaApiMessage(

                        scenario.response

                    ),

                recovery: scenario.recovery

            }

        };

        elements.output.textContent = JSON.stringify(

            result,

            null,

            2

        );

    }


    /* -----------------------------------------------------
       54-4. Run simulated request
    ----------------------------------------------------- */

    function runRequest() {

        if (state.loading) return;

        const scenario = resolveVenaApiScenario(

            elements.scenario.value

        );

        if (!scenario) {

            renderStatus("Unknown Scenario", "warning");

            elements.title.textContent =

                "지원하지 않는 시나리오";

            elements.description.textContent =

                "HTML의 선택 옵션 값을 확인해 주세요.";

            elements.output.textContent = JSON.stringify({

                simulation: true,

                option: elements.scenario.value

            }, null, 2);

            return;

        }

        const version = ++state.version;

        setLoading(true);

        renderStatus("LOADING", "loading");

        elements.title.textContent = "API 요청 처리 중";

        elements.description.textContent =

            "가상의 서버 응답을 기다리고 있습니다.";

        elements.output.textContent = JSON.stringify({

            simulation: true,

            request: {

                method: "GET",

                endpoint: "/api/patients/DEMO-001/",

                authorization: "Bearer [DEMO_TOKEN]"

            },

            state: "loading"

        }, null, 2);

        state.timer = window.setTimeout(() => {

            if (version !== state.version) return;

            state.timer = null;

            try {

                renderScenario(scenario);

            } finally {

                setLoading(false);

            }

        }, 650);

    }


    /* -----------------------------------------------------
       54-5. Reset demonstration
    ----------------------------------------------------- */

    function resetDemo() {

        state.version += 1;

        if (state.timer !== null) {

            window.clearTimeout(state.timer);

            state.timer = null;

        }

        elements.scenario.selectedIndex = 0;

        setLoading(false);

        renderStatus("READY", "idle");

        elements.title.textContent = "API 응답 대기";

        elements.description.textContent =

            "응답 시나리오를 선택하고 요청을 실행해 보세요.";

        elements.output.textContent = JSON.stringify({

            simulation: true,

            state: "idle",

            loading: false,

            response: null,

            error: null

        }, null, 2);

    }


    /* -----------------------------------------------------
       54-6. Bind events
    ----------------------------------------------------- */

    elements.runButton.addEventListener("click", (event) => {

        event.preventDefault();

        runRequest();

    });

    elements.resetButton.addEventListener("click", (event) => {

        event.preventDefault();

        resetDemo();

    });

    elements.status.setAttribute("aria-live", "polite");

    window.addEventListener("pagehide", resetDemo);

    resetDemo();

}


/* =========================================================
   55. MOBILE THEME CONFIGURATION

   Color values based on the Flutter application theme.
   The portfolio page itself retains Sapphire Cream.
========================================================= */

const VENA_MOBILE_THEMES = Object.freeze({

    light: {

        label: "LIGHT MODE",

        background: "#F8FAFC",

        surface: "#FFFFFF",

        primary: "#1E3A8A",

        secondary: "#3B82F6",

        text: "#1F2937",

        muted: "#64748B",

        appBar: "#FFFFFF",

        navigation: "#FFFFFF",

        indicator: "#E0F2FE",

        divider: "#E2E8F0",

        error: "#DC2626"

    },

    dark: {

        label: "DARK MODE",

        background: "#0F172A",

        surface: "#1F2937",

        primary: "#93C5FD",

        secondary: "#3B82F6",

        text: "#F8FAFC",

        muted: "#CBD5E1",

        appBar: "#111827",

        navigation: "#111827",

        indicator: "#1E3A8A",

        divider: "#334155",

        error: "#FCA5A5"

    }

});


/* =========================================================
   56. THEME CODE PREVIEW
========================================================= */

/**
 * Illustrative Dart code based on SettingsViewModel
 * and MaterialApp.router theme integration.
 *
 * Not a complete source file.
 */

function createVenaThemeCode(mode) {

    return [

        "// SettingsViewModel",

        "class SettingsViewModel extends ChangeNotifier {",

        "",

        `  ThemeMode _themeMode = ThemeMode.${mode};`,

        "",

        "  ThemeMode get themeMode => _themeMode;",

        "",

        "  bool get isDarkMode =>",

        "      _themeMode == ThemeMode.dark;",

        "",

        "  void toggleTheme() {",

        "    _themeMode = isDarkMode",

        "        ? ThemeMode.light",

        "        : ThemeMode.dark;",

        "",

        "    notifyListeners();",

        "  }",

        "}",

        "",

        "// MaterialApp.router",

        "MaterialApp.router(",

        "  theme: AppTheme.lightTheme,",

        "  darkTheme: AppTheme.darkTheme,",

        "  themeMode: context",

        "      .watch<SettingsViewModel>()",

        "      .themeMode,",

        "  routerConfig: AppRouter.router,",

        ");"

    ].join("\n");

}


/* =========================================================
   57. MOBILE THEME DEMONSTRATION
========================================================= */

function initMobileThemeDemo() {

    const root = document.getElementById("mobileThemeDemo");

    if (!root) return false;

    const get = (id) => document.getElementById(id);

    const elements = {

        phone: get("themeDemoPhone"),

        modeLabel: get("themeDemoModeLabel"),

        backgroundSwatch: get("themeBackgroundSwatch"),

        backgroundValue: get("themeBackgroundValue"),

        surfaceSwatch: get("themeSurfaceSwatch"),

        surfaceValue: get("themeSurfaceValue"),

        primarySwatch: get("themePrimarySwatch"),

        primaryValue: get("themePrimaryValue"),

        textSwatch: get("themeTextSwatch"),

        textValue: get("themeTextValue"),

        code: get("themeDemoCode")

    };

    const buttons = Array.from(

        root.querySelectorAll("[data-mobile-theme]")

    );

    if (

        Object.values(elements).some((element) => !element) ||

        !buttons.length

    ) {

        console.warn("[VENA] Mobile theme elements missing.");

        return false;

    }

    const state = {

        mode: "light"

    };


    /* -----------------------------------------------------
       57-1. Render color swatch
    ----------------------------------------------------- */

    function renderSwatch(swatch, valueElement, color) {

        swatch.style.backgroundColor = color;

        swatch.setAttribute(

            "aria-label",

            `Color ${color}`

        );

        valueElement.textContent = color;

    }


    /* -----------------------------------------------------
       57-2. Render phone theme
    ----------------------------------------------------- */

    function renderPhone(theme) {

        const dark = state.mode === "dark";

        elements.phone.dataset.theme = state.mode;

        elements.phone.classList.toggle("dark", dark);

        elements.phone.classList.toggle("is-dark", dark);

        elements.phone.classList.toggle("dark-mode", dark);

        elements.phone.classList.toggle("theme-dark", dark);

        elements.phone.classList.toggle("theme-light", !dark);

        const variables = {

            "--theme-background": theme.background,

            "--theme-surface": theme.surface,

            "--theme-primary": theme.primary,

            "--theme-secondary": theme.secondary,

            "--theme-text": theme.text,

            "--theme-muted": theme.muted,

            "--theme-appbar": theme.appBar,

            "--theme-navigation": theme.navigation,

            "--theme-indicator": theme.indicator,

            "--theme-divider": theme.divider,

            "--theme-error": theme.error,

            "--mobile-bg": theme.background,

            "--mobile-surface": theme.surface,

            "--mobile-primary": theme.primary,

            "--mobile-text": theme.text,

            "--mobile-muted": theme.muted,

            "--mobile-border": theme.divider,

            "--app-background": theme.background,

            "--app-surface": theme.surface,

            "--app-primary": theme.primary,

            "--app-text": theme.text,

            "--app-muted": theme.muted,

            "--app-border": theme.divider

        };

        Object.entries(variables).forEach(([key, value]) => {

            elements.phone.style.setProperty(key, value);

        });

        elements.phone.style.colorScheme = state.mode;

    }


    /* -----------------------------------------------------
       57-3. Render active theme buttons
    ----------------------------------------------------- */

    function renderButtons() {

        buttons.forEach((button) => {

            const active =

                button.dataset.mobileTheme === state.mode;

            button.classList.toggle("active", active);

            button.classList.toggle("is-active", active);

            button.setAttribute(

                "aria-pressed",

                String(active)

            );

        });

    }


    /* -----------------------------------------------------
       57-4. Render theme state
    ----------------------------------------------------- */

    function render() {

        const theme = VENA_MOBILE_THEMES[state.mode];

        elements.modeLabel.textContent = theme.label;

        renderPhone(theme);

        renderSwatch(

            elements.backgroundSwatch,

            elements.backgroundValue,

            theme.background

        );

        renderSwatch(

            elements.surfaceSwatch,

            elements.surfaceValue,

            theme.surface

        );

        renderSwatch(

            elements.primarySwatch,

            elements.primaryValue,

            theme.primary

        );

        renderSwatch(

            elements.textSwatch,

            elements.textValue,

            theme.text

        );

        elements.code.textContent =

            createVenaThemeCode(state.mode);

        renderButtons();

    }


    /* -----------------------------------------------------
       57-5. Change theme
    ----------------------------------------------------- */

    function setTheme(mode) {

        if (!["light", "dark"].includes(mode)) {

            return;

        }

        state.mode = mode;

        render();

    }


    /* -----------------------------------------------------
       57-6. Bind events
    ----------------------------------------------------- */

    buttons.forEach((button) => {

        button.addEventListener("click", (event) => {

            event.preventDefault();

            setTheme(button.dataset.mobileTheme);

        });

    });

    elements.modeLabel.setAttribute(

        "aria-live",

        "polite"

    );

    setTheme("light");

}


/* =========================================================
   58. CATEGORY FILTER UTILITIES

   Shared filtering logic for troubleshooting
   and engineering evidence sections.
========================================================= */

/**
 * Create an independent category filter.
 *
 * All content is retained in the DOM.
 * Non-matching items are hidden.
 */

function createVenaCategoryFilter(config) {

    const toolbar = document.getElementById(

        config.toolbarId

    );

    const container = document.getElementById(

        config.containerId

    );

    const counter = document.getElementById(

        config.counterId

    );

    if (!toolbar || !container || !counter) {

        console.warn(

            "[VENA] Filter elements missing:",

            config.toolbarId

        );

        return null;

    }

    const buttons = Array.from(

        toolbar.querySelectorAll(

            `[${config.filterAttribute}]`

        )

    );

    const items = Array.from(

        container.querySelectorAll(

            `[${config.categoryAttribute}]`

        )

    );

    if (!buttons.length || !items.length) {

        console.warn(

            "[VENA] Filter buttons or items missing:",

            config.toolbarId

        );

        return null;

    }

    const validCategories = new Set(

        buttons.map((button) =>

            button.getAttribute(config.filterAttribute)

        )

    );

    const state = {

        activeCategory: "all"

    };


    /* -----------------------------------------------------
       58-1. Render filter buttons
    ----------------------------------------------------- */

    function renderButtons() {

        buttons.forEach((button) => {

            const category = button.getAttribute(

                config.filterAttribute

            );

            const active =

                category === state.activeCategory;

            button.classList.toggle("active", active);

            button.classList.toggle("is-active", active);

            button.setAttribute(

                "aria-pressed",

                String(active)

            );

        });

    }


    /* -----------------------------------------------------
       58-2. Render matching items
    ----------------------------------------------------- */

    function renderItems() {

        let visibleCount = 0;

        items.forEach((item) => {

            const categories = String(

                item.getAttribute(config.categoryAttribute) || ""

            ).split(/\s+/).filter(Boolean);

            const visible =

                state.activeCategory === "all" ||

                categories.includes(state.activeCategory);

            item.hidden = !visible;

            item.classList.toggle(

                "is-filtered-out",

                !visible

            );

            if (visible) {

                visibleCount += 1;

            }

        });

        counter.textContent =

            config.formatCount(visibleCount, items.length);

        return visibleCount;

    }


    /* -----------------------------------------------------
       58-3. Apply category
    ----------------------------------------------------- */

    function setCategory(category) {

        if (!validCategories.has(category)) {

            return;

        }

        state.activeCategory = category;

        renderButtons();

        renderItems();

    }


    /* -----------------------------------------------------
       58-4. Bind filter buttons
    ----------------------------------------------------- */

    buttons.forEach((button) => {

        button.addEventListener("click", (event) => {

            event.preventDefault();

            setCategory(

                button.getAttribute(config.filterAttribute)

            );

        });

    });

    counter.setAttribute("aria-live", "polite");

    setCategory(

        validCategories.has("all")

            ? "all"

            : buttons[0].getAttribute(config.filterAttribute)

    );

    return {

        setCategory,

        getCategory: () => state.activeCategory,

        getTotalCount: () => items.length,

        reset: () => setCategory("all")

    };

}


/* =========================================================
   59. TROUBLESHOOTING CATEGORY FILTER
========================================================= */

function initTroubleshootingFilter() {

    return createVenaCategoryFilter({

        toolbarId: "troubleFilters",

        containerId: "troubleCaseList",

        counterId: "troubleVisibleCount",

        filterAttribute: "data-trouble-filter",

        categoryAttribute: "data-trouble-category",

        formatCount: (visible, total) =>

            visible === total

                ? `${total} Cases`

                : `${visible} / ${total} Cases`

    });

}


/* =========================================================
   60. ENGINEERING EVIDENCE CATEGORY FILTER
========================================================= */

function initEngineeringEvidenceFilter() {

    return createVenaCategoryFilter({

        toolbarId: "evidenceFilters",

        containerId: "evidenceTableBody",

        counterId: "evidenceVisibleCount",

        filterAttribute: "data-evidence-filter",

        categoryAttribute: "data-evidence-category",

        formatCount: (visible, total) =>

            visible === total

                ? `${total} Selected Commits`

                : `${visible} / ${total} Selected Commits`

    });

}


/* =========================================================
   61. ENGINEERING MODULE INITIALIZATION
========================================================= */

function initEngineeringModules() {

    initializeModule(

        "API Error Handling",

        initApiErrorDemo

    );

    initializeModule(

        "Mobile Theme Management",

        initMobileThemeDemo

    );

    initializeModule(

        "Troubleshooting Filter",

        initTroubleshootingFilter

    );

    initializeModule(

        "Engineering Evidence Filter",

        initEngineeringEvidenceFilter

    );

}


/* =========================================================
   PART 7 END

   NEXT:
   APPLICATION INITIALIZATION
   MODULE INTEGRATION
   ERROR ISOLATION
   DOM READY HANDLING
   FINAL VALIDATION

   Note:
   Application initialization will be added in PART 8.
========================================================= */

/* =========================================================
   PART 8
   APPLICATION INITIALIZATION

   VENA Engineering Portfolio

   Application bootstrap
   Module integration
   Error isolation
   DOM ready handling
   Initialization diagnostics
========================================================= */


/* =========================================================
   62. APPLICATION METADATA
========================================================= */

const VENA_APPLICATION_META = Object.freeze({

    name: "VENA Engineering Portfolio",

    version: "1.0.0",

    environment: "Portfolio Demonstration",

    architecture: "Modular Vanilla JavaScript",

    simulation: true,

    networkRequests: false,

    microphoneAccess: false

});


/* =========================================================
   63. APPLICATION STATE
========================================================= */

const VENA_APPLICATION_STATE = {

    initialized: false,

    initializing: false,

    startedAt: null,

    completedAt: null,

    durationMs: null,

    modules: [],

    errors: []

};


/* =========================================================
   64. APPLICATION MODULE REGISTRY
========================================================= */

const VENA_APPLICATION_MODULES = Object.freeze([

    {

        id: "common-ui",

        name: "Common UI",

        initialize: initCommonUI

    },

    {

        id: "architecture-patient",

        name: "Architecture & Patient Management",

        initialize: initArchitectureAndPatient

    },

    {

        id: "messaging-polling",

        name: "Messaging & Polling",

        initialize: initMessagingAndPolling

    },

    {

        id: "consultation-parallel",

        name: "Consultation & Parallel Requests",

        initialize: initConsultationAndParallel

    },

    {

        id: "schedule-tasks",

        name: "Schedule & Tasks",

        initialize: initScheduleAndTasks

    },

    {

        id: "clinical-notes",

        name: "Clinical Notes",

        initialize: initClinicalNotes

    },

    {

        id: "engineering",

        name: "Engineering Modules",

        initialize: initEngineeringModules

    }

]);


/* =========================================================
   65. APPLICATION MODULE EXECUTION
========================================================= */

/**
 * Execute each top-level module independently.
 *
 * A failure in one module must not prevent
 * subsequent modules from being initialized.
 */

function runVenaApplicationModule(module) {

    const startedAt = performance.now();

    const result = {

        id: module.id,

        name: module.name,

        status: "pending",

        durationMs: 0,

        error: null

    };

    try {

        if (typeof module.initialize !== "function") {

            throw new TypeError(

                `Invalid initializer: ${module.name}`

            );

        }

        const initialized = module.initialize();

        if (initialized === false) {

            result.status = "skipped";

            console.warn(

                `[VENA] Module skipped: ${module.name}`

            );

        } else {

            result.status = "executed";

        }

    } catch (error) {

        result.status = "error";

        result.error = error instanceof Error

            ? error.message

            : String(error);

        VENA_APPLICATION_STATE.errors.push({

            module: module.name,

            message: result.error

        });

        console.error(

            `[VENA] Module initialization failed: ${module.name}`,

            error

        );

    } finally {

        result.durationMs = Number(

            (performance.now() - startedAt).toFixed(2)

        );

        VENA_APPLICATION_STATE.modules.push(result);

    }

    return result;

}


/* =========================================================
   66. APPLICATION DIAGNOSTICS
========================================================= */

/**
 * Return a snapshot of bootstrap execution.
 *
 * This report describes top-level initialization.
 * It is not a functional test report.
 */

function getVenaApplicationReport() {

    const modules = VENA_APPLICATION_STATE.modules.map(

        (module) => ({ ...module })

    );

    return {

        application: VENA_APPLICATION_META.name,

        version: VENA_APPLICATION_META.version,

        initialized: VENA_APPLICATION_STATE.initialized,

        initializing: VENA_APPLICATION_STATE.initializing,

        simulation: VENA_APPLICATION_META.simulation,

        durationMs: VENA_APPLICATION_STATE.durationMs,

        totalModules: VENA_APPLICATION_MODULES.length,

        executedModules: modules.filter(

            (module) => module.status === "executed"

        ).length,

        skippedModules: modules.filter(

            (module) => module.status === "skipped"

        ).length,

        failedModules: modules.filter(

            (module) => module.status === "error"

        ).length,

        modules,

        errors: VENA_APPLICATION_STATE.errors.map(

            (error) => ({ ...error })

        )

    };

}


/* =========================================================
   67. CONSOLE INITIALIZATION REPORT
========================================================= */

function printVenaApplicationReport() {

    const report = getVenaApplicationReport();

    console.groupCollapsed(

        `[VENA] ${report.application} v${report.version}`

    );

    console.info(

        "Environment:",

        VENA_APPLICATION_META.environment

    );

    console.info(

        "Architecture:",

        VENA_APPLICATION_META.architecture

    );

    console.info(

        "Simulation mode:",

        VENA_APPLICATION_META.simulation

    );

    console.info(

        "External network requests:",

        VENA_APPLICATION_META.networkRequests

    );

    console.info(

        "Microphone access:",

        VENA_APPLICATION_META.microphoneAccess

    );

    console.table(

        report.modules.map((module) => ({

            Module: module.name,

            Status: module.status,

            "Duration (ms)": module.durationMs,

            Error: module.error || "-"

        }))

    );

    console.info(

        `Executed modules: ${report.executedModules}/${report.totalModules}`

    );

    console.info(

        `Skipped modules: ${report.skippedModules}`

    );

    console.info(

        `Failed modules: ${report.failedModules}`

    );

    console.info(

        `Bootstrap duration: ${report.durationMs} ms`

    );

    if (report.errors.length > 0) {

        console.warn(

            "Application initialization completed with errors.",

            report.errors

        );

    } else {

        console.info(

            "Application bootstrap completed."

        );

    }

    console.info(

        "Note: Bootstrap execution does not guarantee " +

        "that every interactive feature has passed testing."

    );

    console.groupEnd();

}


/* =========================================================
   68. PUBLIC DIAGNOSTIC INTERFACE
========================================================= */

/**
 * Expose read-only diagnostic methods.
 *
 * No patient information, credentials,
 * or mutable application state is exposed.
 */

function exposeVenaDiagnostics() {

    window.VENA = Object.freeze({

        name: VENA_APPLICATION_META.name,

        version: VENA_APPLICATION_META.version,

        getReport: getVenaApplicationReport,

        printReport: printVenaApplicationReport

    });

}


/* =========================================================
   69. APPLICATION BOOTSTRAP
========================================================= */

function initializeVenaApplication() {

    if (

        VENA_APPLICATION_STATE.initialized ||

        VENA_APPLICATION_STATE.initializing

    ) {

        return;

    }

    VENA_APPLICATION_STATE.initializing = true;

    VENA_APPLICATION_STATE.startedAt = performance.now();

    VENA_APPLICATION_STATE.modules = [];

    VENA_APPLICATION_STATE.errors = [];

    try {

        VENA_APPLICATION_MODULES.forEach((module) => {

            runVenaApplicationModule(module);

        });

        VENA_APPLICATION_STATE.initialized = true;

        document.documentElement.dataset.venaReady = "true";

    } catch (error) {

        VENA_APPLICATION_STATE.errors.push({

            module: "Application Bootstrap",

            message: error instanceof Error

                ? error.message

                : String(error)

        });

        console.error(

            "[VENA] Application bootstrap failed.",

            error

        );

        document.documentElement.dataset.venaReady = "false";

    } finally {

        VENA_APPLICATION_STATE.initializing = false;

        VENA_APPLICATION_STATE.completedAt = performance.now();

        VENA_APPLICATION_STATE.durationMs = Number(

            (

                VENA_APPLICATION_STATE.completedAt -

                VENA_APPLICATION_STATE.startedAt

            ).toFixed(2)

        );

        exposeVenaDiagnostics();

        printVenaApplicationReport();

    }

}


/* =========================================================
   70. DOM READY HANDLING
========================================================= */

/**
 * Initialize after the HTML document is available.
 *
 * Supports both deferred script loading
 * and execution after DOMContentLoaded.
 */

if (document.readyState === "loading") {

    document.addEventListener(

        "DOMContentLoaded",

        initializeVenaApplication,

        { once: true }

    );

} else {

    initializeVenaApplication();

}


/* =========================================================
   VENA ENGINEERING PORTFOLIO

   JAVASCRIPT IMPLEMENTATION COMPLETE

   PART 1 — Common Utilities & UI
   PART 2 — Architecture & Patient Management
   PART 3 — Messaging & Polling
   PART 4 — Consultation & Parallel Requests
   PART 5 — Schedule & Tasks
   PART 6 — Clinical Notes
   PART 7 — Engineering Modules
   PART 8 — Application Initialization

   All interactive demonstrations use fictional data.

   No actual medical API requests.
   No real patient records.
   No microphone recording.
   No authentication credentials.

   NEXT:
   BROWSER VALIDATION
   RESPONSIVE LAYOUT REVIEW
   MAIN PORTFOLIO INTEGRATION
   GITHUB DEPLOYMENT
========================================================= */
