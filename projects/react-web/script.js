
// ============================================================
// ANGIO XAI — Engineering Portfolio
// Interactive Demonstration
// ============================================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // 01. COMMON UTILITIES
    // ========================================================

    const $ = (selector, root = document) =>
        root.querySelector(selector);

    const $$ = (selector, root = document) =>
        Array.from(root.querySelectorAll(selector));

    const byId = (id) =>
        document.getElementById(id);

    const clamp = (value, min, max) =>
        Math.min(max, Math.max(min, value));

    const listen = (id, event, handler) => {
        byId(id)?.addEventListener(event, handler);
    };

    const setText = (id, value) => {
        const element = byId(id);

        if (element) {
            element.textContent = value;
        }
    };

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const activate = (elements, selected) => {
        elements.forEach((element) => {
            const active = element === selected;

            element.classList.toggle("active", active);
            element.classList.toggle("is-active", active);

            element.setAttribute(
                "aria-pressed",
                String(active)
            );
        });
    };


    // ========================================================
    // 02. SCROLL PROGRESS
    // ========================================================

    function initScrollProgress() {

        const progress = byId("scrollProgress");
        const header = byId("siteHeader");
        const backToTop = byId("backToTop");

        function updateScroll() {

            const scrollTop = window.scrollY;

            const scrollHeight =
                document.documentElement.scrollHeight -
                window.innerHeight;

            const percent = scrollHeight > 0
                ? clamp(scrollTop / scrollHeight * 100, 0, 100)
                : 0;

            if (progress) {
                progress.style.width = `${percent}%`;
            }

            header?.classList.toggle(
                "scrolled",
                scrollTop > 30
            );

            header?.classList.toggle(
                "is-scrolled",
                scrollTop > 30
            );

            backToTop?.classList.toggle(
                "visible",
                scrollTop > 500
            );

            backToTop?.classList.toggle(
                "is-visible",
                scrollTop > 500
            );
        }

        window.addEventListener(
            "scroll",
            updateScroll,
            { passive: true }
        );

        window.addEventListener(
            "resize",
            updateScroll
        );

        backToTop?.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: reducedMotion ? "auto" : "smooth"
            });

        });

        updateScroll();
    }


    // ========================================================
    // 03. MOBILE NAVIGATION
    // ========================================================

    function initNavigation() {

        const toggle = byId("menuToggle");
        const nav = byId("mainNav");

        if (!toggle || !nav) return;

        function setMenu(open) {

            nav.classList.toggle("open", open);
            nav.classList.toggle("is-open", open);

            toggle.classList.toggle("active", open);
            toggle.classList.toggle("is-active", open);

            toggle.setAttribute(
                "aria-expanded",
                String(open)
            );
        }

        toggle.addEventListener("click", () => {

            const open =
                toggle.getAttribute("aria-expanded") === "true";

            setMenu(!open);

        });

        $$("a", nav).forEach((link) => {

            link.addEventListener("click", () => {
                setMenu(false);
            });

        });

        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                setMenu(false);
            }

        });

        document.addEventListener("click", (event) => {

            if (
                !nav.contains(event.target) &&
                !toggle.contains(event.target)
            ) {
                setMenu(false);
            }

        });

        window.addEventListener("resize", () => {

            if (window.innerWidth > 1024) {
                setMenu(false);
            }

        });

        setMenu(false);
    }


    // ========================================================
    // 04. ACTIVE SECTION NAVIGATION
    // ========================================================

    function initSectionNavigation() {

        const links = $$("#mainNav a[href^='#']");

        if (!links.length) return;

        const sections = links
            .map((link) => {

                const id = link
                    .getAttribute("href")
                    .slice(1);

                return {
                    link,
                    section: byId(id)
                };

            })
            .filter((item) => item.section);

        function updateActiveSection() {

            let current = null;

            sections.forEach((item) => {

                if (
                    item.section.getBoundingClientRect().top
                    <= 160
                ) {
                    current = item;
                }

            });

            links.forEach((link) => {

                const active = current?.link === link;

                link.classList.toggle("active", active);
                link.classList.toggle("is-active", active);

                if (active) {
                    link.setAttribute(
                        "aria-current",
                        "location"
                    );
                } else {
                    link.removeAttribute("aria-current");
                }

            });
        }

        window.addEventListener(
            "scroll",
            updateActiveSection,
            { passive: true }
        );

        updateActiveSection();
    }


    // ========================================================
    // 05. REVEAL ANIMATION
    // ========================================================

    function initReveal() {

        const elements = $$(
            ".reveal, [data-reveal], .reveal-up"
        );

        function show(element) {

            element.classList.add(
                "visible",
                "is-visible",
                "revealed",
                "is-revealed"
            );

        }

        if (
            reducedMotion ||
            !("IntersectionObserver" in window)
        ) {
            elements.forEach(show);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) return;

                    show(entry.target);

                    observer.unobserve(entry.target);

                });

            },
            {
                threshold: 0.08
            }
        );

        elements.forEach((element) => {
            observer.observe(element);
        });
    }


    // ========================================================
    // 06. PATIENT DASHBOARD DEMO
    //
    // All patient records below are fictional demonstration
    // data. No actual patient information is used.
    // ========================================================

    function initPatientDashboard() {

        const search = byId("patientSearch");
        const filters = byId("patientFilters");
        const tableBody = byId("patientTableBody");

        if (!search || !tableBody) return;

        const patients = [

            {
                id: "PT-001",
                name: "김환자",
                age: "67세 / 남",
                ecg: "미검사",
                troponin: "0.08 ng/mL",
                complaint: "흉통"
            },

            {
                id: "PT-002",
                name: "이환자",
                age: "58세 / 여",
                ecg: "정상 소견",
                troponin: "0.02 ng/mL",
                complaint: "호흡곤란"
            },

            {
                id: "PT-003",
                name: "박환자",
                age: "72세 / 남",
                ecg: "ST 변화",
                troponin: "0.15 ng/mL",
                complaint: "흉부 압박감"
            },

            {
                id: "PT-004",
                name: "최환자",
                age: "54세 / 여",
                ecg: "데이터 없음",
                troponin: "미검사",
                complaint: "가슴 불편감"
            },

            {
                id: "PT-005",
                name: "정환자",
                age: "63세 / 남",
                ecg: "정상 소견",
                troponin: "0.03 ng/mL",
                complaint: "운동 시 흉통"
            }

        ];

        let filter = "all";
        let selectedId = patients[0].id;

        const filterButtons = filters
            ? $$("[data-filter]", filters)
            : [];

        function updatePatientDetail(patient) {

            selectedId = patient.id;

            setText("selectedPatientName", patient.name);
            setText("selectedPatientId", patient.id);
            setText("selectedPatientAge", patient.age);
            setText("selectedPatientEcg", patient.ecg);

            setText(
                "selectedPatientTroponin",
                patient.troponin
            );

            setText(
                "selectedPatientComplaint",
                patient.complaint
            );

        }

        function getFilteredPatients() {

            const query = search.value
                .trim()
                .toLowerCase();

            return patients.filter((patient) => {

                const nameMatch = patient.name
                    .toLowerCase()
                    .includes(query);

                const idMatch = patient.id
                    .toLowerCase()
                    .includes(query);

                if (filter === "name") {
                    return nameMatch;
                }

                if (filter === "id") {
                    return idMatch;
                }

                return nameMatch || idMatch;

            });
        }

        function renderPatients() {

            const result = getFilteredPatients();

            tableBody.replaceChildren();

            setText("patientCount", result.length);

            if (!result.length) {

                const row = document.createElement("tr");
                const cell = document.createElement("td");

                const table = tableBody.closest("table");

                cell.colSpan =
                    table?.querySelectorAll("thead th").length
                    || 5;

                cell.textContent =
                    "검색 조건에 해당하는 환자가 없습니다.";

                cell.className = "empty-state";

                row.appendChild(cell);
                tableBody.appendChild(row);

                return;
            }

            const table = tableBody.closest("table");

            const headings = table
                ? $$("thead th", table)
                : [];

            function getCellValue(heading, patient, index) {

                const label = heading
                    .textContent
                    .trim()
                    .toLowerCase();

                if (
                    label.includes("id") ||
                    label.includes("번호")
                ) {
                    return patient.id;
                }

                if (
                    label.includes("이름") ||
                    label.includes("성명") ||
                    label.includes("환자명")
                ) {
                    return patient.name;
                }

                if (
                    label.includes("나이") ||
                    label.includes("연령")
                ) {
                    return patient.age;
                }

                if (label.includes("성별")) {
                    return patient.age.split("/")[1]?.trim()
                        || "-";
                }

                if (
                    label.includes("ecg") ||
                    label.includes("심전도")
                ) {
                    return patient.ecg;
                }

                if (
                    label.includes("troponin") ||
                    label.includes("트로포닌")
                ) {
                    return patient.troponin;
                }

                if (
                    label.includes("증상") ||
                    label.includes("호소")
                ) {
                    return patient.complaint;
                }

                if (
                    label.includes("상세") ||
                    label.includes("선택") ||
                    label.includes("보기")
                ) {
                    return null;
                }

                return [
                    patient.id,
                    patient.name,
                    patient.age,
                    patient.complaint,
                    null
                ][index] ?? "-";
            }

            result.forEach((patient) => {

                const row = document.createElement("tr");

                row.classList.add("patient-row");

                row.dataset.patientId = patient.id;

                row.classList.toggle(
                    "selected",
                    patient.id === selectedId
                );

                row.classList.toggle(
                    "is-selected",
                    patient.id === selectedId
                );

                row.tabIndex = 0;

                row.setAttribute(
                    "aria-label",
                    `${patient.name} ${patient.id} 상세정보`
                );

                function selectPatient() {

                    updatePatientDetail(patient);
                    renderPatients();

                }

                row.addEventListener(
                    "click",
                    selectPatient
                );

                row.addEventListener("keydown", (event) => {

                    if (
                        event.target === row &&
                        (
                            event.key === "Enter" ||
                            event.key === " "
                        )
                    ) {
                        event.preventDefault();
                        selectPatient();
                    }

                });

                const values = headings.length
                    ? headings.map((heading, index) =>
                        getCellValue(heading, patient, index)
                    )
                    : [
                        patient.id,
                        patient.name,
                        patient.age,
                        patient.complaint,
                        null
                    ];

                values.forEach((value) => {

                    const cell = document.createElement("td");

                    if (value === null) {

                        const button =
                            document.createElement("button");

                        button.type = "button";

                        button.className =
                            "patient-select-button";

                        button.textContent = "상세 보기";

                        button.addEventListener(
                            "click",
                            (event) => {

                                event.stopPropagation();
                                selectPatient();

                            }
                        );

                        cell.appendChild(button);

                    } else {

                        cell.textContent = value;

                    }

                    row.appendChild(cell);

                });

                tableBody.appendChild(row);

            });
        }

        search.addEventListener(
            "input",
            renderPatients
        );

        search.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {

                search.value = "";
                renderPatients();

            }

        });

        filterButtons.forEach((button) => {

            button.addEventListener("click", () => {

                filter = button.dataset.filter || "all";

                activate(filterButtons, button);

                renderPatients();

            });

        });

        updatePatientDetail(patients[0]);

        activate(
            filterButtons,
            filterButtons.find(
                (button) => button.dataset.filter === "all"
            )
        );

        renderPatients();
    }


    // ========================================================
    // 07. MEDICAL VIEWER DEMO
    //
    // This is an interactive schematic, not a diagnostic
    // medical image or an actual video playback engine.
    // ========================================================

    function initMedicalViewer() {

        const stage = byId("viewerStage");
        const transform = byId("viewerTransform");
        const canvas = byId("annotationCanvas");

        const heatmap = byId("viewerHeatmap");
        const boundingBox = byId("viewerBoundingBox");

        const zoomInput = byId("viewerZoom");
        const opacityInput = byId("heatmapOpacity");

        if (!stage || !transform || !canvas) return;

        const context = canvas.getContext("2d");

        if (!context) return;

        const state = {

            zoom: 1,

            position: {
                x: 0,
                y: 0
            },

            tool: "pan",

            annotations: [],

            drawing: null,

            dragging: false,

            pointerId: null,

            dragStart: null

        };

        const toolButtons = $$("[data-tool]")
            .filter((button) =>
                ["pan", "bbox", "pen", "text"]
                    .includes(button.dataset.tool)
            );

        const toolNames = {

            pan: "Pan / 이동",
            bbox: "Bounding Box",
            pen: "Pen / 자유곡선",
            text: "Text / 텍스트"

        };

        const guides = {

            pan:
                "영상을 드래그하여 이동하거나 확대·축소 버튼을 사용하세요.",

            bbox:
                "영상 위에서 드래그하여 사각형 주석을 생성하세요.",

            pen:
                "영상 위에서 드래그하여 자유곡선을 그리세요.",

            text:
                "텍스트를 입력한 후 영상 위의 원하는 위치를 클릭하세요."

        };


        // ----------------------------------------------------
        // 07-1. Shared Image / Overlay Transform
        // ----------------------------------------------------

        function updateTransform() {

            transform.style.transform =
                `translate(${state.position.x}px, ` +
                `${state.position.y}px) ` +
                `scale(${state.zoom})`;

            transform.style.transformOrigin = "center center";

            setText(
                "viewerZoomLabel",
                `${state.zoom.toFixed(1)}×`
            );

            setText(
                "viewerZoomValue",
                `${state.zoom.toFixed(1)}×`
            );

            if (zoomInput) {

                const max = Number(zoomInput.max || 3);

                zoomInput.value = max > 10
                    ? state.zoom * 100
                    : state.zoom;

            }
        }

        function setZoom(value) {

            const rawMax = Number(zoomInput?.max || 3);

            const max = rawMax > 10
                ? rawMax / 100
                : rawMax;

            state.zoom = clamp(
                Number(value) || 1,
                1,
                Math.max(1, max)
            );

            if (state.zoom === 1) {

                state.position.x = 0;
                state.position.y = 0;

            }

            updateTransform();
        }

        function resetTransform() {

            state.zoom = 1;
            state.position = { x: 0, y: 0 };

            updateTransform();
        }

        listen("viewerZoomIn", "click", () => {

            setZoom(
                Math.round((state.zoom + 0.2) * 10) / 10
            );

        });

        listen("viewerZoomOut", "click", () => {

            setZoom(
                Math.round((state.zoom - 0.2) * 10) / 10
            );

        });

        zoomInput?.addEventListener("input", () => {

            const max = Number(zoomInput.max || 3);

            const value = Number(zoomInput.value);

            setZoom(max > 10 ? value / 100 : value);

        });

        listen(
            "resetTransform",
            "click",
            resetTransform
        );

        stage.addEventListener("wheel", (event) => {

            // Prevent ordinary page scrolling from being
            // captured unless the user explicitly zooms.

            if (!event.ctrlKey && !event.metaKey) return;

            event.preventDefault();

            setZoom(
                state.zoom +
                (event.deltaY < 0 ? 0.1 : -0.1)
            );

        }, { passive: false });


        // ----------------------------------------------------
        // 07-2. Fullscreen
        // ----------------------------------------------------

        listen("viewerFullscreen", "click", async () => {

            try {

                if (document.fullscreenElement) {

                    await document.exitFullscreen();

                } else if (stage.requestFullscreen) {

                    await stage.requestFullscreen();

                } else {

                    setText(
                        "viewerGuide",
                        "현재 브라우저에서 전체화면을 지원하지 않습니다."
                    );

                }

            } catch (error) {

                console.warn(
                    "[ANGIO XAI] Fullscreen:",
                    error
                );

                setText(
                    "viewerGuide",
                    "전체화면으로 전환하지 못했습니다."
                );

            }

        });

        document.addEventListener(
            "fullscreenchange",
            () => {

                const button = byId("viewerFullscreen");

                button?.setAttribute(
                    "aria-pressed",
                    String(document.fullscreenElement === stage)
                );

                requestAnimationFrame(resizeCanvas);

            }
        );


        // ----------------------------------------------------
        // 07-3. XAI Overlay Controls
        // ----------------------------------------------------

        function updateHeatmap() {

            const toggle = byId("heatmapToggle");

            const enabled = toggle
                ? toggle.checked
                : true;

            if (heatmap) {

                heatmap.style.display = enabled
                    ? ""
                    : "none";

            }

            if (opacityInput) {

                const opacity = clamp(
                    Number(opacityInput.value),
                    0,
                    100
                );

                heatmap?.setAttribute(
                    "opacity",
                    String(opacity / 100)
                );

                setText(
                    "heatmapOpacityValue",
                    `${opacity}%`
                );

                opacityInput.disabled = !enabled;
            }
        }

        function updateBoundingBox() {

            const toggle = byId("bboxToggle");

            const enabled = toggle
                ? toggle.checked
                : true;

            if (boundingBox) {

                boundingBox.style.display = enabled
                    ? ""
                    : "none";

            }
        }

        listen(
            "heatmapToggle",
            "change",
            updateHeatmap
        );

        listen(
            "bboxToggle",
            "change",
            updateBoundingBox
        );

        opacityInput?.addEventListener(
            "input",
            updateHeatmap
        );


        // ----------------------------------------------------
        // 07-4. Canvas Resolution
        //
        // Device pixel ratio is handled separately from
        // normalized annotation coordinates.
        // ----------------------------------------------------

        let canvasWidth = 1;
        let canvasHeight = 1;

        function resizeCanvas() {

            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            if (!width || !height) return;

            const dpr = window.devicePixelRatio || 1;

            canvasWidth = width;
            canvasHeight = height;

            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);

            context.setTransform(
                dpr, 0, 0, dpr, 0, 0
            );

            redrawAnnotations();
        }

        function getNormalizedPoint(event) {

            const rect = canvas.getBoundingClientRect();

            return {

                x: clamp(
                    (event.clientX - rect.left) /
                    Math.max(rect.width, 1),
                    0,
                    1
                ),

                y: clamp(
                    (event.clientY - rect.top) /
                    Math.max(rect.height, 1),
                    0,
                    1
                )

            };
        }

        function toCanvasPoint(point) {

            return {

                x: point.x * canvasWidth,

                y: point.y * canvasHeight

            };
        }


        // ----------------------------------------------------
        // 07-5. Annotation Rendering
        // ----------------------------------------------------

        function drawAnnotation(annotation) {

            context.save();

            context.lineWidth = 2;

            context.lineCap = "round";

            context.lineJoin = "round";

            if (annotation.type === "bbox") {

                const start = toCanvasPoint(annotation.start);
                const end = toCanvasPoint(annotation.end);

                const x = Math.min(start.x, end.x);
                const y = Math.min(start.y, end.y);

                const width = Math.abs(end.x - start.x);
                const height = Math.abs(end.y - start.y);

                context.strokeStyle = "#60a5fa";

                context.fillStyle =
                    "rgba(96, 165, 250, 0.08)";

                context.fillRect(
                    x, y, width, height
                );

                context.strokeRect(
                    x, y, width, height
                );

                context.font = "11px sans-serif";

                context.fillStyle = "#93c5fd";

                context.fillText(
                    "Annotation",
                    x,
                    Math.max(12, y - 6)
                );

            }

            if (annotation.type === "pen") {

                if (!annotation.points.length) {

                    context.restore();

                    return;
                }

                context.strokeStyle = "#34d399";

                context.beginPath();

                annotation.points.forEach((point, index) => {

                    const position = toCanvasPoint(point);

                    if (index === 0) {

                        context.moveTo(
                            position.x,
                            position.y
                        );

                    } else {

                        context.lineTo(
                            position.x,
                            position.y
                        );

                    }

                });

                context.stroke();
            }

            if (annotation.type === "text") {

                const position = toCanvasPoint(
                    annotation.point
                );

                context.font = "600 13px sans-serif";

                const width = context
                    .measureText(annotation.text)
                    .width;

                const x = clamp(
                    position.x,
                    0,
                    Math.max(0, canvasWidth - width - 12)
                );

                const y = clamp(
                    position.y,
                    18,
                    Math.max(18, canvasHeight - 6)
                );

                context.fillStyle =
                    "rgba(15, 23, 42, 0.85)";

                context.fillRect(
                    x,
                    y - 17,
                    width + 10,
                    23
                );

                context.fillStyle = "#fbbf24";

                context.fillText(
                    annotation.text,
                    x + 5,
                    y
                );

            }

            context.restore();
        }

        function redrawAnnotations() {

            context.clearRect(
                0,
                0,
                canvasWidth,
                canvasHeight
            );

            state.annotations.forEach(drawAnnotation);

            if (state.drawing) {
                drawAnnotation(state.drawing);
            }

            setText(
                "annotationCount",
                state.annotations.length
            );

            const undo = byId("undoAnnotation");

            const clear = byId("clearAnnotations");

            if (undo) {
                undo.disabled = !state.annotations.length;
            }

            if (clear) {
                clear.disabled = !state.annotations.length;
            }
        }


        // ----------------------------------------------------
        // 07-6. Tool State Management
        // ----------------------------------------------------

        function selectTool(tool) {

            if (!Object.hasOwn(toolNames, tool)) return;

            state.tool = tool;

            state.drawing = null;

            state.dragging = false;

            state.pointerId = null;

            activate(
                toolButtons,
                toolButtons.find(
                    (button) => button.dataset.tool === tool
                )
            );

            setText(
                "activeToolLabel",
                toolNames[tool]
            );

            setText(
                "viewerGuide",
                guides[tool]
            );

            stage.style.cursor =
                tool === "pan"
                    ? "grab"
                    : tool === "text"
                        ? "text"
                        : "crosshair";

            canvas.style.pointerEvents =
                tool === "pan"
                    ? "none"
                    : "auto";

            stage.style.touchAction = "none";

            canvas.style.touchAction = "none";

            const textInput = byId("annotationText");

            if (textInput) {

                textInput.disabled = tool !== "text";

                if (tool === "text") {

                    textInput.focus({
                        preventScroll: true
                    });

                }

            }

            redrawAnnotations();
        }

        toolButtons.forEach((button) => {

            button.addEventListener("click", () => {

                selectTool(button.dataset.tool);

            });

        });


        // ----------------------------------------------------
        // 07-7. Pointer Events: Pan
        // ----------------------------------------------------

        stage.addEventListener("pointerdown", (event) => {

            if (
                state.tool !== "pan" ||
                event.button !== 0 ||
                state.pointerId !== null
            ) return;

            if (
                event.target.closest(
                    "button, input, select, a"
                )
            ) return;

            if (state.zoom <= 1) return;

            state.dragging = true;

            state.pointerId = event.pointerId;

            state.dragStart = {

                x: event.clientX - state.position.x,

                y: event.clientY - state.position.y

            };

            stage.setPointerCapture(event.pointerId);

            stage.style.cursor = "grabbing";

            event.preventDefault();

        });

        stage.addEventListener("pointermove", (event) => {

            if (
                !state.dragging ||
                state.pointerId !== event.pointerId ||
                state.tool !== "pan"
            ) return;

            const maxX =
                stage.clientWidth * (state.zoom - 1) / 2;

            const maxY =
                stage.clientHeight * (state.zoom - 1) / 2;

            state.position.x = clamp(
                event.clientX - state.dragStart.x,
                -maxX,
                maxX
            );

            state.position.y = clamp(
                event.clientY - state.dragStart.y,
                -maxY,
                maxY
            );

            updateTransform();

        });

        function stopPan(event) {

            if (
                !state.dragging ||
                state.pointerId !== event.pointerId
            ) return;

            state.dragging = false;

            state.pointerId = null;

            state.dragStart = null;

            stage.style.cursor = "grab";

            if (stage.hasPointerCapture(event.pointerId)) {

                stage.releasePointerCapture(
                    event.pointerId
                );

            }
        }

        stage.addEventListener("pointerup", stopPan);

        stage.addEventListener("pointercancel", stopPan);

        stage.addEventListener("lostpointercapture", stopPan);


        // ----------------------------------------------------
        // 07-8. Pointer Events: Canvas Annotation
        // ----------------------------------------------------

        canvas.addEventListener("pointerdown", (event) => {

            if (
                state.tool === "pan" ||
                event.button !== 0 ||
                state.pointerId !== null
            ) return;

            event.preventDefault();

            event.stopPropagation();

            const point = getNormalizedPoint(event);

            if (state.tool === "text") {

                const input = byId("annotationText");

                const text = input?.value.trim().slice(0, 80);

                if (!text) {

                    setText(
                        "viewerGuide",
                        "먼저 주석 내용을 입력해 주세요."
                    );

                    input?.focus();

                    return;
                }

                state.annotations.push({

                    type: "text",

                    point,

                    text

                });

                redrawAnnotations();

                return;
            }

            state.pointerId = event.pointerId;

            canvas.setPointerCapture(event.pointerId);

            if (state.tool === "bbox") {

                state.drawing = {

                    type: "bbox",

                    start: point,

                    end: point

                };

            }

            if (state.tool === "pen") {

                state.drawing = {

                    type: "pen",

                    points: [point]

                };

            }

            redrawAnnotations();

        });

        canvas.addEventListener("pointermove", (event) => {

            if (
                !state.drawing ||
                state.pointerId !== event.pointerId
            ) return;

            event.stopPropagation();

            const point = getNormalizedPoint(event);

            if (state.drawing.type === "bbox") {

                state.drawing.end = point;

            }

            if (state.drawing.type === "pen") {

                state.drawing.points.push(point);

            }

            redrawAnnotations();

        });

        canvas.addEventListener("pointerup", (event) => {

            if (
                !state.drawing ||
                state.pointerId !== event.pointerId
            ) return;

            event.stopPropagation();

            const annotation = state.drawing;

            if (annotation.type === "bbox") {

                annotation.end = getNormalizedPoint(event);

                const width = Math.abs(
                    annotation.end.x -
                    annotation.start.x
                ) * canvasWidth;

                const height = Math.abs(
                    annotation.end.y -
                    annotation.start.y
                ) * canvasHeight;

                if (width > 5 && height > 5) {

                    state.annotations.push(annotation);

                }

            }

            if (
                annotation.type === "pen" &&
                annotation.points.length > 1
            ) {

                state.annotations.push(annotation);

            }

            state.drawing = null;

            state.pointerId = null;

            if (canvas.hasPointerCapture(event.pointerId)) {

                canvas.releasePointerCapture(
                    event.pointerId
                );

            }

            redrawAnnotations();

        });

        function cancelDrawing(event) {

            if (state.pointerId !== event.pointerId) return;

            state.drawing = null;

            state.pointerId = null;

            redrawAnnotations();
        }

        canvas.addEventListener(
            "pointercancel",
            cancelDrawing
        );

        canvas.addEventListener(
            "lostpointercapture",
            cancelDrawing
        );


        // ----------------------------------------------------
        // 07-9. Undo / Clear
        // ----------------------------------------------------

        function undoAnnotation() {

            state.annotations.pop();

            redrawAnnotations();
        }

        listen(
            "undoAnnotation",
            "click",
            undoAnnotation
        );

        listen("clearAnnotations", "click", () => {

            state.annotations = [];

            state.drawing = null;

            redrawAnnotations();

        });

        stage.addEventListener("keydown", (event) => {

            if (
                event.target.matches(
                    "input, textarea, select"
                )
            ) return;

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "z"
            ) {

                event.preventDefault();

                undoAnnotation();

            }

            if (event.key === "Escape") {

                selectTool("pan");

            }

        });


        // ----------------------------------------------------
        // 07-10. Initialization
        // ----------------------------------------------------

        if ("ResizeObserver" in window) {

            const observer = new ResizeObserver(
                resizeCanvas
            );

            observer.observe(canvas);

        }

        window.addEventListener(
            "resize",
            resizeCanvas
        );

        stage.tabIndex = 0;

        selectTool("pan");

        updateTransform();

        updateHeatmap();

        updateBoundingBox();

        resizeCanvas();
    }


    // ========================================================
    // 08. FRAME PLAYBACK SIMULATION
    //
    // Frame navigation is simulated using a counter.
    // It does not represent real angiography video frames.
    // ========================================================

    function initFramePlayback() {

        const slider = byId("frameSlider");
        const speedSelect = byId("playbackSpeed");
        const playButton = byId("framePlay");
        const thumbnails = byId("frameThumbnails");

        if (!slider || !playButton) return;

        const minFrame = Number(slider.min || 1);

        const maxFrame = Number(slider.max || 250);

        let frame = clamp(
            Number(slider.value) || minFrame,
            minFrame,
            maxFrame
        );

        let playing = false;

        let timer = null;

        let speed = 1;

        function renderThumbnails() {

            if (!thumbnails) return;

            thumbnails.replaceChildren();

            const count = Math.min(
                7,
                maxFrame - minFrame + 1
            );

            const start = clamp(
                frame - 3,
                minFrame,
                maxFrame - count + 1
            );

            for (
                let number = start;
                number < start + count;
                number++
            ) {

                const button =
                    document.createElement("button");

                button.type = "button";

                button.className = "frame-thumbnail";

                button.dataset.frame = number;

                button.classList.toggle(
                    "active",
                    number === frame
                );

                button.classList.toggle(
                    "is-active",
                    number === frame
                );

                button.setAttribute(
                    "aria-label",
                    `시뮬레이션 프레임 ${number}`
                );

                button.setAttribute(
                    "aria-pressed",
                    String(number === frame)
                );

                const preview =
                    document.createElement("span");

                preview.className = "thumbnail-preview";

                preview.textContent = "◇";

                preview.setAttribute(
                    "aria-hidden",
                    "true"
                );

                const label =
                    document.createElement("span");

                label.textContent = `F-${number}`;

                button.append(preview, label);

                button.addEventListener("click", () => {

                    stopPlayback();

                    setFrame(number);

                });

                thumbnails.appendChild(button);

            }
        }

        function setFrame(value) {

            frame = clamp(
                Math.round(Number(value) || minFrame),
                minFrame,
                maxFrame
            );

            slider.value = frame;

            setText(
                "frameCounter",
                `${frame} / ${maxFrame}`
            );

            renderThumbnails();
        }

        function updatePlayButton() {

            playButton.textContent =
                playing ? "❚❚" : "▶";

            playButton.classList.toggle(
                "active",
                playing
            );

            playButton.setAttribute(
                "aria-label",
                playing ? "일시정지" : "재생"
            );

            playButton.setAttribute(
                "aria-pressed",
                String(playing)
            );
        }

        function stopPlayback() {

            if (timer !== null) {

                clearInterval(timer);

                timer = null;

            }

            playing = false;

            updatePlayButton();
        }

        function startPlayback() {

            stopPlayback();

            if (frame >= maxFrame) {

                setFrame(minFrame);

            }

            playing = true;

            updatePlayButton();

            timer = setInterval(() => {

                if (frame >= maxFrame) {

                    stopPlayback();

                    return;
                }

                setFrame(frame + 1);

                if (frame >= maxFrame) {

                    stopPlayback();

                }

            }, 1000 / (10 * speed));
        }

        playButton.addEventListener("click", () => {

            if (playing) {

                stopPlayback();

            } else {

                startPlayback();

            }

        });

        listen("frameFirst", "click", () => {

            stopPlayback();

            setFrame(minFrame);

        });

        listen("framePrevious", "click", () => {

            stopPlayback();

            setFrame(frame - 1);

        });

        listen("frameNext", "click", () => {

            stopPlayback();

            setFrame(frame + 1);

        });

        listen("frameLast", "click", () => {

            stopPlayback();

            setFrame(maxFrame);

        });

        slider.addEventListener("input", () => {

            stopPlayback();

            setFrame(slider.value);

        });

        speedSelect?.addEventListener("change", () => {

            speed = clamp(
                parseFloat(speedSelect.value) || 1,
                0.25,
                4
            );

            if (playing) {

                startPlayback();

            }

        });

        document.addEventListener(
            "visibilitychange",
            () => {

                if (document.hidden) {

                    stopPlayback();

                }

            }
        );

        window.addEventListener(
            "pagehide",
            stopPlayback
        );

        speed = clamp(
            parseFloat(speedSelect?.value) || 1,
            0.25,
            4
        );

        setFrame(frame);

        updatePlayButton();
    }


    // ========================================================
    // 09. BOOKMARK EVENT PROPAGATION DEMO
    //
    // Demonstrates bubbling and stopPropagation().
    // No real bookmark or server data is deleted.
    // ========================================================

    function initBookmarkDemo() {

        const card = byId("bookmarkDemoCard");

        const toggle = byId("stopPropagationToggle");

        const openButton = byId("bookmarkOpenButton");

        const deleteButton = byId("bookmarkDeleteButton");

        const log = byId("eventLog");

        const modal = byId("bookmarkModal");

        if (!card || !log) return;

        let eventCount = 0;

        function addLog(message, type = "info") {

            eventCount++;

            const item = document.createElement("div");

            item.className = `event-log-item log-${type}`;

            const number = document.createElement("span");

            number.className = "event-log-number";

            number.textContent =
                String(eventCount).padStart(2, "0");

            const text = document.createElement("span");

            text.textContent = message;

            item.append(number, text);

            log.appendChild(item);

            while (log.children.length > 30) {

                log.firstElementChild?.remove();

            }

            log.scrollTop = log.scrollHeight;
        }

        function openModal() {

            if (!modal || modal.open) return;

            if (typeof modal.showModal === "function") {

                modal.showModal();

            } else {

                modal.setAttribute("open", "");

            }
        }

        function closeModal() {

            if (!modal) return;

            if (typeof modal.close === "function") {

                if (modal.open) {

                    modal.close();

                }

            } else {

                modal.removeAttribute("open");

            }
        }

        function handlePropagation(event) {

            if (toggle?.checked) {

                event.stopPropagation();

                addLog(
                    "stopPropagation() → 부모 이벤트 차단",
                    "success"
                );

            } else {

                addLog(
                    "이벤트 버블링 허용",
                    "warning"
                );

            }
        }

        card.addEventListener("click", () => {

            addLog(
                "Parent: 카드 onClick 실행",
                "parent"
            );

            openModal();

        });

        card.addEventListener("keydown", (event) => {

            if (
                event.target === card &&
                (
                    event.key === "Enter" ||
                    event.key === " "
                )
            ) {

                event.preventDefault();

                card.click();

            }

        });

        card.tabIndex = 0;

        openButton?.addEventListener("click", (event) => {

            addLog(
                "Child: 상세 보기 버튼 클릭",
                "child"
            );

            handlePropagation(event);

            openModal();

        });

        deleteButton?.addEventListener("click", (event) => {

            addLog(
                "Child: 삭제 버튼 클릭 — 데모 실행",
                "child"
            );

            handlePropagation(event);

        });

        toggle?.addEventListener("change", () => {

            addLog(
                toggle.checked
                    ? "stopPropagation 활성화"
                    : "stopPropagation 비활성화",
                "info"
            );

        });

        listen("clearEventLog", "click", () => {

            log.replaceChildren();

            eventCount = 0;

            addLog("이벤트 로그가 초기화되었습니다.");

        });

        listen(
            "closeBookmarkModal",
            "click",
            closeModal
        );

        listen(
            "closeBookmarkModalBottom",
            "click",
            closeModal
        );

        modal?.addEventListener("click", (event) => {

            if (event.target !== modal) return;

            const rect = modal.getBoundingClientRect();

            const outside =
                event.clientX < rect.left ||
                event.clientX > rect.right ||
                event.clientY < rect.top ||
                event.clientY > rect.bottom;

            if (outside) {

                closeModal();

            }

        });

        log.replaceChildren();

        addLog(
            "버튼을 클릭하여 이벤트 전달 순서를 확인하세요."
        );
    }


    // ========================================================
    // 10. TROUBLESHOOTING FILTER
    // ========================================================

    function initTroubleshooting() {

        const container = byId("troubleFilters");

        const section = byId("troubleshooting");

        if (!container || !section) return;

        const buttons = $$("button", container);

        const cards = $$("[data-category]", section)
            .filter((card) => !container.contains(card));

        function resolveFilter(button) {

            const explicit =
                button.dataset.filter ||
                button.dataset.category ||
                button.dataset.troubleFilter;

            if (explicit) return explicit;

            const label = button.textContent
                .trim()
                .toLowerCase();

            if (
                label.includes("개인") ||
                label.includes("personal")
            ) return "personal";

            if (
                label.includes("팀") ||
                label.includes("team")
            ) return "team";

            if (
                label.includes("리뷰") ||
                label.includes("개선") ||
                label.includes("review")
            ) return "review";

            return "all";
        }

        function applyFilter(filter, button) {

            activate(buttons, button);

            cards.forEach((card) => {

                const show =
                    filter === "all" ||
                    card.dataset.category === filter;

                card.hidden = !show;

                card.style.display = show ? "" : "none";

                card.classList.toggle(
                    "is-filtered-out",
                    !show
                );

            });
        }

        buttons.forEach((button) => {

            button.addEventListener("click", () => {

                applyFilter(
                    resolveFilter(button),
                    button
                );

            });

        });

        const allButton = buttons.find(
            (button) => resolveFilter(button) === "all"
        );

        applyFilter("all", allButton);
    }


    // ========================================================
    // 11. GIT EVIDENCE CHART
    // ========================================================

    function initEvidenceChart() {

        const chart = byId("fileChart");

        if (!chart) return;

        const bars = $$("[data-width]", chart);

        function animateChart() {

            bars.forEach((bar, index) => {

                const width = clamp(
                    Number(bar.dataset.width) || 0,
                    0,
                    100
                );

                if (reducedMotion) {

                    bar.style.transition = "none";

                } else {

                    bar.style.transition =
                        `width 900ms ease ${index * 100}ms`;

                }

                bar.style.width = `${width}%`;

            });
        }

        bars.forEach((bar) => {

            bar.style.width = "0%";

        });

        if (
            reducedMotion ||
            !("IntersectionObserver" in window)
        ) {

            animateChart();

            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) return;

                    requestAnimationFrame(animateChart);

                    observer.unobserve(entry.target);

                });

            },
            {
                threshold: 0.15
            }
        );

        observer.observe(chart);
    }


    // ========================================================
    // 12. INITIALIZATION
    //
    // Each feature is initialized independently so an error
    // in one demonstration does not disable the entire page.
    // ========================================================

    const modules = [

        ["Scroll Progress", initScrollProgress],

        ["Navigation", initNavigation],

        ["Section Navigation", initSectionNavigation],

        ["Reveal Animation", initReveal],

        ["Patient Dashboard", initPatientDashboard],

        ["Medical Viewer", initMedicalViewer],

        ["Frame Playback", initFramePlayback],

        ["Bookmark Demo", initBookmarkDemo],

        ["Troubleshooting", initTroubleshooting],

        ["Evidence Chart", initEvidenceChart]

    ];

    const initialized = [];

    const failed = [];

    modules.forEach(([name, initialize]) => {

        try {

            initialize();

            initialized.push(name);

        } catch (error) {

            failed.push(name);

            console.error(
                `[ANGIO XAI] ${name} initialization failed`,
                error
            );

        }

    });

    console.info(
        "[ANGIO XAI] Portfolio initialized"
    );

    console.info(
        "[ANGIO XAI] Initialized modules:",
        initialized
    );

    if (failed.length) {

        console.warn(
            "[ANGIO XAI] Failed modules:",
            failed
        );

    }

});
