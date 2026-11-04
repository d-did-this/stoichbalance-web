/**
 * Stoichbalance V2 - Interactive Spotlight Onboarding Tour & Tutorial Level Engine
 * Keeps the board 100% bright and clear (no dark dimming) during tutorials,
 * highlighting target elements with clean pulse rings and pedagogical state checks.
 */
(function() {
    let currentStep = 0;
    let tourContainer = null;
    let popoverCard = null;
    let highlightPulseEl = null;
    let activeClickListener = null;
    let activeTargetEl = null;
    let activeHoverListener = null;
    let actionCheckInterval = null;

    // Helper: enable or disable the Next -> button
    function setNextButtonState(enabled) {
        const nextBtn = document.getElementById('tour-btn-next');
        if (!nextBtn) return;
        const steps = getActiveSteps();
        const isLast = (currentStep === steps.length - 1);

        if (enabled) {
            nextBtn.disabled = false;
            nextBtn.style.opacity = '1';
            nextBtn.style.pointerEvents = 'auto';
            nextBtn.style.cursor = 'pointer';
            nextBtn.style.filter = 'none';
            nextBtn.style.background = isLast ? '#10b981' : '#2563eb';
            nextBtn.style.borderColor = '#1e293b';
            nextBtn.style.boxShadow = isLast ? '0 4px 0 #065f46' : '0 4px 0 #1e293b';
            nextBtn.style.color = '#ffffff';
        } else {
            nextBtn.disabled = true;
            nextBtn.style.opacity = '0.45';
            nextBtn.style.pointerEvents = 'none';
            nextBtn.style.cursor = 'not-allowed';
            nextBtn.style.filter = 'grayscale(0.7)';
            nextBtn.style.background = '#94a3b8';
            nextBtn.style.borderColor = '#64748b';
            nextBtn.style.boxShadow = '0 2px 0 #475569';
            nextBtn.style.color = '#f1f5f9';
        }
    }

    // 1. Scripted Interactive Tutorial Level (TUT0: Water Synthesis)
    const TUT0_STEPS = [
        {
            selector: "#level-title",
            fallbackSelector: "#dynamic-sleek-equation",
            badge: "1/20 Welcome",
            title: "Water Synthesis Reaction",
            desc: "Welcome to the laboratory! In chemistry, atoms cannot appear or disappear out of nowhere. Both sides of an equation must have the exact same count of each atom.",
            tip: "🎯 Goal: Equalize Hydrogen and Oxygen on both sides."
        },
        {
            selector: "#dynamic-sleek-equation",
            fallbackSelector: ".sleek-equation-card",
            badge: "2/20 Inspect Formulas",
            title: "Hover to Inspect Chemical Formulas",
            desc: "Hover your mouse over any formula card (or press and hold on tablet) to inspect its atoms and physical state!",
            tip: "👉 Hover over H2, O2, or H2O now to unlock Next!",
            interactiveHover: true
        },
        {
            selector: "#btn-add-react-H2",
            fallbackSelector: '[data-info="btn-react"][data-mol-id="H2"], [data-info="btn-react"]',
            badge: "3/20 Reactants",
            title: "Add a Hydrogen Molecule",
            desc: "Click the blue <b>+ H₂</b> button on the left to drop one Hydrogen molecule into the reactants beaker.",
            tip: "👉 Click + H₂ now!",
            action: 'add-H2',
            targetCount: 1,
            interactiveClick: true
        },
        {
            selector: "#footer-react",
            fallbackSelector: "#react-drop-container, .panel-react",
            badge: "4/20 Atom Counters",
            title: "Check the Bottom Counter",
            desc: "Look at the bottom of the left beaker! It now counts <b>H = 2, O = 0</b>. Each H₂ molecule gives you 2 Hydrogen atoms.",
            tip: "👀 The bottom counter gives you real-time atom totals."
        },
        {
            selector: "#btn-add-react-O2",
            fallbackSelector: '[data-info="btn-react"][data-mol-id="O2"]',
            badge: "5/20 Reactants",
            title: "Add an Oxygen Molecule",
            desc: "Now click the blue <b>+ O₂</b> button to drop one Oxygen molecule into the reactants beaker.",
            tip: "👉 Click + O₂ now!",
            action: 'add-O2',
            targetCount: 1,
            interactiveClick: true
        },
        {
            selector: ".section-scale",
            fallbackSelector: "#adv-giant-plank, .giant-seesaw",
            badge: "6/20 Seesaw Scale",
            title: "The Scale Tilts Down!",
            desc: "Notice how the balance beam tilts down on the left! Reactants currently has 2 H and 2 O, while Products is completely empty. The heavier side tilts down.",
            tip: "⚖️ A balanced chemical reaction stays completely level!"
        },
        {
            selector: "#btn-add-prod-H2O",
            fallbackSelector: '[data-info="btn-prod"][data-mol-id="H2O"], [data-info="btn-prod"]',
            badge: "7/20 Products",
            title: "Add Water (H₂O)",
            desc: "Now let us build the right side! Click the orange <b>+ H₂O</b> button to drop one Water molecule into the products beaker.",
            tip: "👉 Click + H₂O now!",
            action: 'add-H2O',
            targetCount: 1,
            interactiveClick: true
        },
        {
            selector: "#footer-prod",
            fallbackSelector: "#prod-drop-container, .panel-prod",
            badge: "8/20 Compare Bottoms",
            title: "Compare Both Counters",
            desc: "Look at both bottoms! Left has <b>2 H, 2 O</b>. Right has <b>2 H, 1 O</b>. Hydrogen is even, but Oxygen is uneven (2 vs 1)! The scale still tilts left.",
            tip: "👀 The right side is missing 1 Oxygen atom."
        },
        {
            selector: "#btn-side-bar",
            fallbackSelector: ".side-tab-btn[data-info=\"mode-bar\"]",
            badge: "9/20 Bar View",
            title: "Switch to Bar View Mode",
            desc: "Prefer charts over seesaws? Click the <b>BAR</b> button on the left sidebar to toggle Bar Chart View!",
            tip: "👉 Click the BAR button on the left sidebar now!",
            action: 'switch-bar',
            interactiveClick: true
        },
        {
            selector: "#section-bar-graph",
            fallbackSelector: ".grid-section.section-scale",
            badge: "10/20 Bar Chart",
            title: "Compare Bar Heights",
            desc: "In Bar View, vertical bars show atom counts for Reactants vs Products side by side. Notice Hydrogen bars are equal height, but Oxygen's blue bar is taller than its orange bar!",
            tip: "📊 When every bar pair matches in height, the reaction is balanced!"
        },
        {
            selector: "#btn-side-scale",
            fallbackSelector: ".side-tab-btn[data-info=\"mode-scale\"]",
            badge: "11/20 Scale View",
            title: "Return to Scale View",
            desc: "Now click the <b>SCALE</b> button on the left sidebar to switch back to the seesaw balance beam!",
            tip: "👉 Click the SCALE button now!",
            action: 'switch-scale',
            interactiveClick: true
        },
        {
            selector: '[data-info="btn-tray"]',
            fallbackSelector: "#btn-toggle-tray, .rect-btn",
            badge: "12/20 Element Tray",
            title: "Open the Element Tray Drawer",
            desc: "Click <b>Element Trays</b> on the left to slide open the dedicated element inspection drawer!",
            tip: "👉 Click Element Trays on the left now!",
            action: 'open-tray',
            interactiveClick: true
        },
        {
            selector: '.pro-scale-card[data-element="O"], #element-tray-container',
            fallbackSelector: "#element-tray-container, .sidebar-grid",
            badge: "13/20 Tray Counters",
            title: "Inspect Mini-Scales & Counters",
            desc: "Look inside the drawer! Each element has its own mini-seesaw and atom counter. Oxygen shows <b>2 ≠ 1</b> in red with a <b>-1</b> badge because Products needs 1 more Oxygen atom!",
            tip: "🔍 The Element Tray isolates each element so you know what needs balancing."
        },
        {
            selector: "#beaker-chat-input",
            fallbackSelector: "#btn-guided-hint, .beaker-chat-wrapper",
            badge: "14/20 Prof. Beaker Chat",
            title: "Ask Prof. Beaker in the Chat Box",
            desc: "Need advice? Click the chat box below and type a question (or click <b>💡 I am Stuck! Help!</b> on the right sidebar)!",
            tip: "👉 Type in the chat box or click 'I am Stuck! Help!' now!",
            action: 'use-chat',
            interactiveClick: true
        },
        {
            selector: ".beaker-message",
            fallbackSelector: "#beaker-chat-bubble, #prof-beaker-card",
            badge: "15/20 Read Advice",
            title: "Prof. Beaker's Clue",
            desc: "Prof. Beaker explains: Following the MINOH rule, balance Oxygen before Hydrogen. Since Products only has 1 Oxygen, we need another Water molecule!",
            tip: "💡 Prof. Beaker always guides you to the next MINOH step."
        },
        {
            selector: "#btn-add-prod-H2O",
            fallbackSelector: '[data-info="btn-prod"][data-mol-id="H2O"], [data-info="btn-prod"]',
            badge: "16/20 Balance Oxygen",
            title: "Add Second + H₂O",
            desc: "Following Prof. Beaker's advice, click <b>+ H₂O</b> to give the products beaker its second Oxygen atom!",
            tip: "👉 Click + H₂O now!",
            action: 'add-H2O',
            targetCount: 2,
            interactiveClick: true
        },
        {
            selector: "#footer-prod",
            fallbackSelector: ".section-scale, #footer-react",
            badge: "17/20 Check Back",
            title: "Oxygen Balanced, But Hydrogen Shifted!",
            desc: "Check the bottom counters: Oxygen is now balanced (2 on each side)! BUT adding water doubled Hydrogen to <b>H = 4</b> on the right, while the left only has <b>H = 2</b>! The scale now tilts right!",
            tip: "👀 Balancing one element can shift another. Always check back!"
        },
        {
            selector: "#btn-add-react-H2",
            fallbackSelector: '[data-info="btn-react"][data-mol-id="H2"]',
            badge: "18/20 Deliberate Mistake",
            title: "Deliberate Mistake: Add Too Much!",
            desc: "Accidents happen in chemistry! Let us purposely make a mistake: click <b>+ H₂</b> TWICE so we have too much Hydrogen on the left side!",
            tip: "👉 Click + H₂ twice to add too much Hydrogen!",
            action: 'deliberate-mistake-H2',
            targetCount: 3,
            interactiveClick: true
        },
        {
            selector: "#row-react-H2 .mol-block",
            fallbackSelector: "#react-drop-container, .drop-zone",
            badge: "19/20 Erase Mistake",
            title: "Erase the Mistake by Clicking the Card!",
            desc: "Look: left now has <b>H = 6</b>, which is too much! Click the extra <b>H₂</b> molecule card directly inside the left beaker to delete it and erase the mistake!",
            tip: "👉 Click the placed H₂ card in the left beaker to remove it!",
            action: 'delete-mistake-H2',
            targetCount: 2,
            interactiveClick: true
        },
        {
            selector: "#dynamic-sleek-equation",
            fallbackSelector: ".section-scale",
            badge: "20/20 Equilibrium",
            title: "Perfect Balance Achieved!",
            desc: "Both sides now have exactly <b>4 H and 2 O</b>! Both status bars shine bright green: <b>BALANCED</b> and <b>SIMPLIFIED</b> in the lowest whole ratio 2H₂ + O₂ → 2H₂O!",
            tip: "🎉 Tap Finish to celebrate your victory!"
        }
    ];

    // 2. Standard Level Tour
    const TOUR_STEPS = [
        {
            selector: "#level-title",
            badge: "Level Info",
            title: "Check Your Level & Reaction",
            desc: "Hover over the level title (or tap and hold on tablet) to inspect chemistry background and key facts.",
            tip: "💡 Check the title to know what you are synthesizing!"
        },
        {
            selector: "#dynamic-sleek-equation",
            badge: "Equation Cards",
            title: "Hover (or Hold on Tablet) Any Element",
            desc: "Hover over any coefficient or formula (or press and hold on tablet) to see real-time atom calculations.",
            tip: "💡 Try hovering over coefficients to see multiplication!"
        },
        {
            selector: ".status-bar-shared",
            badge: "Status Bars",
            title: "Balanced & Simplified",
            desc: "Equalize all atom types so the left bar turns green, and reduce coefficients to their lowest ratio for the right bar.",
            tip: "💡 If balanced but not simplified, reduce all coefficients!"
        },
        {
            selector: '[data-info="btn-react"]',
            badge: "Add Molecules",
            title: "Click to Add Reactants",
            desc: "Press the blue button on the left to add reactants, and orange buttons on the right to add products.",
            tip: "👉 Click the glowing button now or press Next!",
            interactiveClick: true
        },
        {
            selector: "#react-drop-container",
            badge: "Remove Molecules",
            title: "How to Remove Molecules",
            desc: "Need to take back a move? Click any placed molecule card in the balance beaker to delete it.",
            tip: "💡 You can also use the Undo button in Settings!"
        },
        {
            selector: '[data-info="btn-tray"]',
            badge: "Element Tray",
            title: "Compare Each Element",
            desc: "Click the Element Tray button on the left to slide open individual element mini-scales.",
            tip: "👉 Click to open or close the drawer!",
            interactiveClick: true
        },
        {
            selector: '[data-info="btn-hint"]',
            badge: "Hints",
            title: "Prof. Beaker Clues",
            desc: "Stuck on a tricky reaction? Click Prof. Beaker on the right for guidance.",
            tip: "💡 There is no penalty for asking for a clue!"
        },
        {
            selector: ".fab-container",
            badge: "Settings",
            title: "Game Controls",
            desc: "Mute/Unmute audio, go Fullscreen, Undo moves, or Reset the board from this corner menu.",
            tip: "🚀 You are all set to balance equations. Have fun!"
        }
    ];

    function getActiveSteps() {
        const params = new URLSearchParams(window.location.search);
        const lvl = (params.get('level') || '').toUpperCase();
        if (lvl === 'TUT0' || lvl === 'TUTORIAL') {
            return TUT0_STEPS;
        }
        return TOUR_STEPS;
    }

    function ensureTourStyles() {
        if (document.getElementById('stoich-tour-injected-styles')) return;
        const style = document.createElement('style');
        style.id = 'stoich-tour-injected-styles';
        style.textContent = `
            @keyframes stoichTourRingPulse {
                0% { box-shadow: 0 0 0 4px #2563eb, 0 0 0 8px rgba(37, 99, 235, 0.45), 0 0 20px rgba(37, 99, 235, 0.6); transform: scale(1); }
                50% { box-shadow: 0 0 0 5px #3b82f6, 0 0 0 12px rgba(59, 130, 246, 0.25), 0 0 32px rgba(59, 130, 246, 0.8); transform: scale(1.02); }
                100% { box-shadow: 0 0 0 4px #2563eb, 0 0 0 8px rgba(37, 99, 235, 0.45), 0 0 20px rgba(37, 99, 235, 0.6); transform: scale(1); }
            }
            .tour-nav-btn {
                transition: all 0.12s cubic-bezier(0.2, 0.8, 0.2, 1);
                user-select: none;
                -webkit-user-select: none;
            }
            .tour-nav-btn:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 6px 0 #1e293b !important;
            }
            .tour-nav-btn:active:not(:disabled) {
                transform: translateY(2px);
                box-shadow: 0 1px 0 #1e293b !important;
            }
            #tour-btn-close:hover {
                background: #fee2e2 !important;
                color: #ef4444 !important;
                border-color: #ef4444 !important;
                transform: translateY(-1px) scale(1.08);
            }
        `;
        document.head.appendChild(style);
    }

    function createTourDOM() {
        if (tourContainer) return;

        // Auto-close tour immediately whenever victory popup appears to prevent overlapping
        if (typeof MutationObserver !== 'undefined') {
            const winObs = new MutationObserver(() => {
                if (document.getElementById('win-popup')) {
                    closeTour();
                    if (tourContainer) {
                        tourContainer.style.display = 'none';
                        tourContainer.style.opacity = '0';
                        try { tourContainer.remove(); } catch(e) {}
                        tourContainer = null;
                    }
                }
            });
            winObs.observe(document.body, { childList: true, subtree: true });
        }
        ensureTourStyles();

        tourContainer = document.createElement('div');
        tourContainer.id = 'stoich-spotlight-tour';
        tourContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 99990;
            display: none;
            opacity: 0;
            transition: opacity 0.22s ease-out;
            pointer-events: none;
            font-family: 'Fredoka', system-ui, -apple-system, sans-serif;
        `;

        tourContainer.innerHTML = `
            <!-- Transparent non-dimming blockers: board remains 100% visible and bright -->
            <div id="tour-blocker-top" style="position:fixed; background:transparent; pointer-events:none; z-index:99990;"></div>
            <div id="tour-blocker-bottom" style="position:fixed; background:transparent; pointer-events:none; z-index:99990;"></div>
            <div id="tour-blocker-left" style="position:fixed; background:transparent; pointer-events:none; z-index:99990;"></div>
            <div id="tour-blocker-right" style="position:fixed; background:transparent; pointer-events:none; z-index:99990;"></div>

            <!-- Spotlight Pulsing Ring: Clean focus border without dumb text pills -->
            <div id="tour-pulse-ring" style="
                position: fixed;
                border: 3.5px solid #2563eb;
                border-radius: 16px;
                animation: stoichTourRingPulse 1.4s ease-in-out infinite;
                pointer-events: none;
                transition: all 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.15);
                z-index: 99992;
                display: none;
            "></div>

            <!-- Guided Popover Card -->
            <div id="tour-popover-card" style="
                position: fixed;
                background: #ffffff;
                border: 3.5px solid #1e293b;
                border-radius: 24px;
                box-shadow: 0 16px 36px rgba(15, 23, 42, 0.24), 0 5px 0 #1e293b;
                max-width: 410px;
                width: 90vw;
                padding: 18px 20px;
                box-sizing: border-box;
                z-index: 99995;
                transition: all 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.15);
                pointer-events: auto;
                font-family: 'Fredoka', system-ui, -apple-system, sans-serif;
            ">
                <!-- Header -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span id="tour-card-badge" style="
                        background: #ede9fe;
                        color: #5b21b6;
                        border: 2px solid #1e293b;
                        box-shadow: 0 2px 0 #1e293b;
                        font-size: 0.78rem;
                        font-weight: 900;
                        padding: 3px 10px;
                        border-radius: 9999px;
                        letter-spacing: 0.3px;
                    ">Step 1</span>
                    <button id="tour-btn-close" style="
                        background: #f1f5f9;
                        border: 2.5px solid #1e293b;
                        border-radius: 50%;
                        width: 32px;
                        height: 32px;
                        font-size: 1rem;
                        font-weight: 900;
                        color: #475569;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 2px 0 #1e293b;
                        transition: all 0.12s;
                    " title="Close Guide">✕</button>
                </div>

                <!-- Slim Progress Bar -->
                <div style="width: 100%; height: 6px; background: #f1f5f9; border: 1.5px solid #cbd5e1; border-radius: 999px; overflow: hidden; margin-bottom: 12px;">
                    <div id="tour-progress-bar" style="height: 100%; width: 5%; background: linear-gradient(90deg, #3b82f6, #06b6d4); border-radius: 999px; transition: width 0.25s ease;"></div>
                </div>

                <!-- Title & Description -->
                <h4 id="tour-card-title" style="margin:0 0 6px 0; font-size:1.18rem; font-weight:900; color:#0f172a; line-height:1.25;">Title</h4>
                <p id="tour-card-desc" style="margin:0 0 10px 0; font-size:0.92rem; font-weight:600; line-height:1.45; color:#334155;">Description</p>

                <!-- Tip -->
                <div id="tour-card-tip" style="
                    background: #fefce8;
                    border: 2.5px solid #1e293b;
                    box-shadow: 0 3px 0 #1e293b;
                    border-radius: 12px;
                    padding: 8px 12px;
                    margin-bottom: 14px;
                    font-size: 0.85rem;
                    font-weight: 800;
                    color: #854d0e;
                    line-height: 1.4;
                ">Tip</div>

                <!-- Footer Navigation -->
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:2px solid #f1f5f9; padding-top:14px;">
                    <!-- Step Counter Badge -->
                    <div id="tour-step-counter" style="font-size: 0.82rem; font-weight: 900; color: #64748b; font-family: 'Fredoka', system-ui, sans-serif;">
                        Step <span style="color:#2563eb; font-weight:900;">1</span> of 20
                    </div>

                    <!-- Action Buttons -->
                    <div style="display:flex; gap:10px; align-items:center;">
                        <button id="tour-btn-prev" class="tour-nav-btn" style="
                            background: #f8fafc;
                            border: 2.5px solid #1e293b;
                            border-radius: 14px;
                            padding: 8px 16px;
                            font-size: 0.88rem;
                            font-weight: 900;
                            color: #1e293b;
                            cursor: pointer;
                            box-shadow: 0 4px 0 #1e293b;
                            display: inline-flex;
                            align-items: center;
                            gap: 4px;
                        ">
                            <span style="font-size:1.15rem; line-height:1;">‹</span>
                            <span>Back</span>
                        </button>

                        <button id="tour-btn-next" class="tour-nav-btn" style="
                            background: #2563eb;
                            border: 2.5px solid #1e293b;
                            border-radius: 14px;
                            padding: 8px 20px;
                            font-size: 0.92rem;
                            font-weight: 900;
                            color: #ffffff;
                            cursor: pointer;
                            box-shadow: 0 4px 0 #1e293b;
                            display: inline-flex;
                            align-items: center;
                            gap: 6px;
                        ">
                            <span>Next</span>
                            <span style="font-size:1.15rem; line-height:1;">›</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(tourContainer);

        popoverCard = document.getElementById('tour-popover-card');
        highlightPulseEl = document.getElementById('tour-pulse-ring');

        // Listeners
        document.getElementById('tour-btn-close').addEventListener('click', closeTour);
        document.getElementById('tour-btn-prev').addEventListener('click', prevTourStep);
        document.getElementById('tour-btn-next').addEventListener('click', () => {
            const nextBtn = document.getElementById('tour-btn-next');
            if (nextBtn && !nextBtn.disabled) nextTourStep();
        });

        document.addEventListener('keydown', (e) => {
            if (!tourContainer || tourContainer.style.display !== 'block') return;
            if (e.key === 'Escape') closeTour();
            if (e.key === 'ArrowRight') {
                const nextBtn = document.getElementById('tour-btn-next');
                if (nextBtn && !nextBtn.disabled) nextTourStep();
            }
            if (e.key === 'ArrowLeft') prevTourStep();
        });

        window.addEventListener('resize', () => {
            if (tourContainer && tourContainer.style.display === 'block') {
                positionSpotlight(currentStep);
            }
        });

        window.addEventListener('scroll', () => {
            if (tourContainer && tourContainer.style.display === 'block') {
                positionSpotlight(currentStep);
            }
        }, true);
    }

    function positionSpotlight(stepIndex) {
        const steps = getActiveSteps();
        const step = steps[stepIndex];
        if (!step) return;

        let targetEl = document.querySelector(step.selector);
        if (!targetEl && step.fallbackSelector) {
            targetEl = document.querySelector(step.fallbackSelector);
        }

        const padding = 10;
        let rect = {
            top: Math.round(window.innerHeight / 2 - 80),
            left: Math.round(window.innerWidth / 2 - 180),
            width: 360,
            height: 160
        };

        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'auto', block: 'nearest' });
            const r = targetEl.getBoundingClientRect();
            rect = {
                top: Math.max(0, r.top - padding),
                left: Math.max(0, r.left - padding),
                width: Math.max(20, r.width + padding * 2),
                height: Math.max(20, r.height + padding * 2)
            };

            if (highlightPulseEl) {
                highlightPulseEl.style.display = 'block';
                highlightPulseEl.style.top = `${rect.top}px`;
                highlightPulseEl.style.left = `${rect.left}px`;
                highlightPulseEl.style.width = `${rect.width}px`;
                highlightPulseEl.style.height = `${rect.height}px`;
            }
        } else {
            if (highlightPulseEl) highlightPulseEl.style.display = 'none';
        }

        if (popoverCard) {
            const cardWidth = Math.min(400, window.innerWidth - 32);
            const cardHeight = popoverCard.offsetHeight || 220;
            const viewportW = window.innerWidth;
            const viewportH = window.innerHeight;

            let cardLeft = rect.left + (rect.width / 2) - (cardWidth / 2);
            cardLeft = Math.max(16, Math.min(cardLeft, viewportW - cardWidth - 16));

            let cardTop = rect.top + rect.height + 14;
            if (cardTop + cardHeight > viewportH - 20) {
                cardTop = Math.max(16, rect.top - cardHeight - 14);
            }

            // Side-docked elements on left (e.g. Element Tray, Bar buttons)
            if (rect.left < 280) {
                cardLeft = Math.min(viewportW - cardWidth - 16, rect.left + rect.width + 16);
                cardTop = Math.max(16, Math.min(rect.top, viewportH - cardHeight - 20));
            }
            // Side-docked elements on right (e.g. Prof. Beaker, Chat)
            else if (rect.left > viewportW - 380) {
                cardLeft = Math.max(16, rect.left - cardWidth - 16);
                cardTop = Math.max(16, Math.min(rect.top, viewportH - cardHeight - 20));
            }

            popoverCard.style.top = `${cardTop}px`;
            popoverCard.style.left = `${cardLeft}px`;
        }

        // Clean up previous action polling and listeners
        if (actionCheckInterval) {
            clearInterval(actionCheckInterval);
            actionCheckInterval = null;
        }

        if (activeClickListener && activeTargetEl) {
            activeTargetEl.removeEventListener('click', activeClickListener);
            activeClickListener = null;
            activeTargetEl = null;
        }

        if (activeHoverListener && activeTargetEl) {
            activeTargetEl.removeEventListener('mouseenter', activeHoverListener);
            activeTargetEl.removeEventListener('pointerenter', activeHoverListener);
            activeTargetEl.removeEventListener('touchstart', activeHoverListener);
            activeHoverListener = null;
            activeTargetEl = null;
        }

        // Action Gating: grey out Next button if the user must interact
        const requiresInteraction = !!(step.interactiveClick || step.interactiveHover || step.action);
        setNextButtonState(!requiresInteraction);

        // 1. Interactive Hover enforcement
        if (step.interactiveHover && targetEl) {
            activeTargetEl = targetEl;
            activeHoverListener = () => {
                if (typeof playSound === 'function') playSound('pop');
                setNextButtonState(true);
            };
            targetEl.addEventListener('mouseenter', activeHoverListener, { once: true });
            targetEl.addEventListener('pointerenter', activeHoverListener, { once: true });
            targetEl.addEventListener('touchstart', activeHoverListener, { once: true });
        }

        // 2. Interactive Click on target
        if (step.interactiveClick && targetEl) {
            activeTargetEl = targetEl;
            activeClickListener = () => {
                if (step.action === 'switch-bar') {
                    if (typeof window.switchViewMode === 'function') window.switchViewMode('bar');
                } else if (step.action === 'switch-scale') {
                    if (typeof window.switchViewMode === 'function') window.switchViewMode('scale');
                } else if (step.action === 'open-tray') {
                    const blockLeft = document.querySelector('.block-left');
                    if (blockLeft && blockLeft.classList.contains('collapsed') && typeof window.toggleBlock === 'function') {
                        window.toggleBlock('left');
                    }
                } else if (step.action === 'use-chat') {
                    if (typeof window.revealGuidedSolvingHint === 'function') {
                        window.revealGuidedSolvingHint();
                    }
                }
            };
            targetEl.addEventListener('click', activeClickListener);
        }

        // 3. Periodic state check for hands-on actions
        if (step.action) {
            actionCheckInterval = setInterval(() => {
                if (step.action === 'add-H2') {
                    const count = document.querySelectorAll('#row-react-H2 .mol-block').length;
                    if (count >= (step.targetCount || 1)) {
                        clearInterval(actionCheckInterval);
                        actionCheckInterval = null;
                        setNextButtonState(true);
                        setTimeout(nextTourStep, 380);
                    }
                } else if (step.action === 'add-O2') {
                    const count = document.querySelectorAll('#row-react-O2 .mol-block').length;
                    if (count >= (step.targetCount || 1)) {
                        clearInterval(actionCheckInterval);
                        actionCheckInterval = null;
                        setNextButtonState(true);
                        setTimeout(nextTourStep, 380);
                    }
                } else if (step.action === 'add-H2O') {
                    const count = document.querySelectorAll('#row-prod-H2O .mol-block').length;
                    if (count >= (step.targetCount || 1)) {
                        clearInterval(actionCheckInterval);
                        actionCheckInterval = null;
                        setNextButtonState(true);
                        setTimeout(nextTourStep, 380);
                    }
                } else if (step.action === 'switch-bar') {
                    const isBar = document.getElementById('btn-side-bar')?.classList.contains('active-tab');
                    if (isBar) {
                        clearInterval(actionCheckInterval);
                        actionCheckInterval = null;
                        setNextButtonState(true);
                        setTimeout(nextTourStep, 380);
                    }
                } else if (step.action === 'switch-scale') {
                    const isScale = document.getElementById('btn-side-scale')?.classList.contains('active-tab');
                    if (isScale) {
                        clearInterval(actionCheckInterval);
                        actionCheckInterval = null;
                        setNextButtonState(true);
                        setTimeout(nextTourStep, 380);
                    }
                } else if (step.action === 'open-tray') {
                    const blockLeft = document.querySelector('.block-left');
                    const isOpen = blockLeft && !blockLeft.classList.contains('collapsed');
                    if (isOpen) {
                        clearInterval(actionCheckInterval);
                        actionCheckInterval = null;
                        setNextButtonState(true);
                        setTimeout(nextTourStep, 380);
                    }
                } else if (step.action === 'use-chat') {
                    const chatInput = document.getElementById('beaker-chat-input');
                    const hasInput = chatInput && chatInput.value.trim().length > 0;
                    const bubble = document.getElementById('beaker-chat-bubble');
                    const hasBubble = bubble && bubble.innerText.trim().length > 0;
                    const userMessages = document.querySelectorAll('#beaker-chat-messages .user-message, #beaker-chat-messages [data-role="user"]');
                    if (hasInput || hasBubble || userMessages.length > 0 || window.isBeakerThinking || window.beakerChatUsed) {
                        clearInterval(actionCheckInterval);
                        actionCheckInterval = null;
                        setNextButtonState(true);
                        setTimeout(nextTourStep, 380);
                    }
                } else if (step.action === 'deliberate-mistake-H2') {
                    const count = document.querySelectorAll('#row-react-H2 .mol-block').length;
                    if (count >= (step.targetCount || 3)) {
                        clearInterval(actionCheckInterval);
                        actionCheckInterval = null;
                        setNextButtonState(true);
                        setTimeout(nextTourStep, 380);
                    }
                } else if (step.action === 'delete-mistake-H2') {
                    const count = document.querySelectorAll('#row-react-H2 .mol-block').length;
                    if (count <= (step.targetCount || 2)) {
                        clearInterval(actionCheckInterval);
                        actionCheckInterval = null;
                        setNextButtonState(true);
                        setTimeout(nextTourStep, 380);
                    }
                }
            }, 200);
        }
    }

    function renderTourStep(index) {
        const steps = getActiveSteps();
        if (index < 0) index = 0;
        if (index >= steps.length) index = steps.length - 1;
        currentStep = index;

        const step = steps[currentStep];

        if (step.action === 'use-chat') {
            const chatInput = document.getElementById('beaker-chat-input');
            const hintBtn = document.getElementById('btn-guided-hint');
            if (chatInput) {
                chatInput.addEventListener('input', () => {
                    if (chatInput.value.trim().length > 0) {
                        window.beakerChatUsed = true;
                        setNextButtonState(true);
                    }
                });
            }
            if (hintBtn) {
                hintBtn.addEventListener('click', () => {
                    window.beakerChatUsed = true;
                    setNextButtonState(true);
                });
            }
        }

        // CRITICAL: Close study room modal if not on study-room step to prevent view blockage
        const modal = document.getElementById('study-room-modal');
        if (modal && modal.style.display !== 'none' && typeof window.closeStudyRoomModal === 'function') {
            window.closeStudyRoomModal();
        }

        document.getElementById('tour-card-badge').innerText = step.badge;
        document.getElementById('tour-card-title').innerText = step.title;
        document.getElementById('tour-card-desc').innerHTML = step.desc;
        document.getElementById('tour-card-tip').innerHTML = step.tip;

        // Update Progress Bar & Step Counter
        const progressBar = document.getElementById('tour-progress-bar');
        const stepCounter = document.getElementById('tour-step-counter');

        if (progressBar) {
            const pct = Math.round(((currentStep + 1) / steps.length) * 100);
            progressBar.style.width = `${pct}%`;
        }
        if (stepCounter) {
            stepCounter.innerHTML = `Step <span style="color:#2563eb; font-weight:900;">${currentStep + 1}</span> of ${steps.length}`;
        }

        // Update Prev / Next Buttons
        const prevBtn = document.getElementById('tour-btn-prev');
        const nextBtn = document.getElementById('tour-btn-next');

        if (prevBtn) {
            if (currentStep === 0) {
                prevBtn.disabled = true;
                prevBtn.style.opacity = '0.35';
                prevBtn.style.pointerEvents = 'none';
                prevBtn.style.boxShadow = 'none';
                prevBtn.style.borderColor = '#cbd5e1';
                prevBtn.style.color = '#94a3b8';
            } else {
                prevBtn.disabled = false;
                prevBtn.style.opacity = '1';
                prevBtn.style.pointerEvents = 'auto';
                prevBtn.style.boxShadow = '0 4px 0 #1e293b';
                prevBtn.style.borderColor = '#1e293b';
                prevBtn.style.color = '#1e293b';
            }
        }

        if (nextBtn) {
            if (currentStep === steps.length - 1) {
                nextBtn.innerHTML = `<span>Finish</span> 🚀`;
                nextBtn.style.background = '#10b981';
                nextBtn.style.boxShadow = '0 4px 0 #065f46';
                nextBtn.style.borderColor = '#1e293b';
            } else {
                nextBtn.innerHTML = `<span>Next</span> <span style="font-size:1.15rem; line-height:1;">›</span>`;
                nextBtn.style.background = '#2563eb';
                nextBtn.style.boxShadow = '0 4px 0 #1e293b';
                nextBtn.style.borderColor = '#1e293b';
            }
        }

        positionSpotlight(currentStep);
    }

    function openTour(step = 0) {
        createTourDOM();
        tourContainer.style.display = 'block';
        void tourContainer.offsetWidth;
        tourContainer.style.opacity = '1';

        renderTourStep(step);

        if (typeof playSound === 'function') {
            playSound('pop');
        }
    }

    function closeTour() {
        if (!tourContainer) return;

        if (actionCheckInterval) {
            clearInterval(actionCheckInterval);
            actionCheckInterval = null;
        }

        if (activeClickListener && activeTargetEl) {
            activeTargetEl.removeEventListener('click', activeClickListener);
            activeClickListener = null;
            activeTargetEl = null;
        }

        if (activeHoverListener && activeTargetEl) {
            activeTargetEl.removeEventListener('mouseenter', activeHoverListener);
            activeTargetEl.removeEventListener('pointerenter', activeHoverListener);
            activeTargetEl.removeEventListener('touchstart', activeHoverListener);
            activeHoverListener = null;
            activeTargetEl = null;
        }

        const modal = document.getElementById('study-room-modal');
        if (modal && modal.style.display !== 'none' && typeof window.closeStudyRoomModal === 'function') {
            window.closeStudyRoomModal();
        }

        tourContainer.style.opacity = '0';
        tourContainer.style.display = 'none';

        if (typeof playSound === 'function') {
            playSound('click');
        }
    }

    function nextTourStep() {
        if (typeof playSound === 'function') playSound('click');
        const steps = getActiveSteps();
        if (currentStep >= steps.length - 1) {
            window.tutorialFinished = true;
            closeTour();
            if (tourContainer) {
                tourContainer.style.display = 'none';
                tourContainer.style.opacity = '0';
                try { tourContainer.remove(); } catch(e) {}
                tourContainer = null;
            }
            if (typeof window.showWinPopup === 'function') {
                window.showWinPopup(true);
            }
        } else {
            renderTourStep(currentStep + 1);
        }
    }

    function prevTourStep() {
        if (typeof playSound === 'function') playSound('click');
        if (currentStep > 0) {
            renderTourStep(currentStep - 1);
        }
    }

    window.openTutorial = openTour;
    window.closeTutorial = closeTour;
    window.goToTourStep = function(i) {
        if (typeof playSound === 'function') playSound('click');
        renderTourStep(i);
    };
})();
