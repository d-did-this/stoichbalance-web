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
    let actionCheckInterval = null;

    // 1. Scripted Interactive Tutorial Level (TUT0: Water Synthesis)
    const TUT0_STEPS = [
        {
            selector: "#level-title",
            fallbackSelector: "#dynamic-sleek-equation",
            badge: "1/12 Welcome",
            title: "Water Synthesis",
            desc: "Let's balance water: H₂ + O₂ → H₂O. Atoms cannot disappear, so both sides must have the exact same number of atoms.",
            tip: "🎯 Goal: Make Hydrogen and Oxygen equal on both sides."
        },
        {
            selector: "#dynamic-sleek-equation",
            fallbackSelector: ".sleek-equation-card",
            badge: "2/12 Inspect",
            title: "Check Molecule Info",
            desc: "Hover over any formula to see what atoms it contains. On a tablet, press and hold.",
            tip: "💡 Inspect any symbol anytime for atom counts."
        },
        {
            selector: "#btn-add-react-H2",
            fallbackSelector: '[data-info="btn-react"][data-mol-id="H2"], [data-info="btn-react"]',
            badge: "3/12 Reactants",
            title: "Add Reactant H₂",
            desc: "Click <b>+ H₂</b> to drop one Hydrogen molecule into the left beaker.",
            tip: "👉 Click + H₂ now!",
            action: 'add-H2',
            targetCount: 1,
            interactiveClick: true
        },
        {
            selector: "#btn-add-react-O2",
            fallbackSelector: '[data-info="btn-react"][data-mol-id="O2"]',
            badge: "4/12 Reactants",
            title: "Add Reactant O₂",
            desc: "Now click <b>+ O₂</b> to add Oxygen to the left beaker.",
            tip: "👉 Click + O₂ now!",
            action: 'add-O2',
            targetCount: 1,
            interactiveClick: true
        },
        {
            selector: "#btn-add-prod-H2O",
            fallbackSelector: '[data-info="btn-prod"][data-mol-id="H2O"], [data-info="btn-prod"]',
            badge: "5/12 Products",
            title: "Add Product H₂O",
            desc: "Click <b>+ H₂O</b> on the right side to add one Water molecule.",
            tip: "👉 Click + H₂O now!",
            action: 'add-H2O',
            targetCount: 1,
            interactiveClick: true
        },
        {
            selector: ".scale-section",
            fallbackSelector: "#adv-giant-plank, .mini-seesaw",
            badge: "6/12 Check Scales",
            title: "Look at the Scales",
            desc: "Notice the scale is tilted! The left side has 2 Oxygens, but the right side only has 1. Products is missing an Oxygen.",
            tip: "⚖️ The red badge warns you which atom is unbalanced."
        },
        {
            selector: '[data-info="btn-tray"]',
            fallbackSelector: "#btn-toggle-tray, .rect-btn",
            badge: "7/12 Mini-Scales",
            title: "Element Mini-Scales",
            desc: "This side drawer tracks each element individually so you can see which side needs more.",
            tip: "💡 Each atom has its own mini-scale."
        },
        {
            selector: "#react-drop-container",
            fallbackSelector: ".drop-zone",
            badge: "8/12 Mistakes",
            title: "Fixing Mistakes",
            desc: "If you add too many molecules, click any molecule card in the beaker to delete it.",
            tip: "💡 You never need to restart the whole level."
        },
        {
            selector: "#prof-beaker-card",
            fallbackSelector: '[data-info="btn-hint"], #chat-toggle-btn',
            badge: "9/12 Clues",
            title: "Ask Prof. Beaker",
            desc: "Click Prof. Beaker anytime for clues. Rule of thumb: balance Oxygen before Hydrogen!",
            tip: "💡 Stuck? Ask Prof. Beaker for guidance."
        },
        {
            selector: "#btn-open-study-room",
            fallbackSelector: '[data-info="btn-study-room"], .study-room-pill-btn',
            badge: "10/12 Notes",
            title: "Study Room Notes",
            desc: "Click Study Room to review formula notes, or click Next to solve the reaction.",
            tip: "🔍 Tap Study Room or click Next.",
            action: 'study-room'
        },
        {
            selector: "#btn-add-prod-H2O",
            fallbackSelector: '[data-info="btn-prod"][data-mol-id="H2O"], [data-info="btn-prod"]',
            badge: "11/12 Solve O",
            title: "Step 1: Balance Oxygen",
            desc: "Right now, the right side is missing an Oxygen (Left: 2, Right: 1). Click <b>+ H₂O</b> to add another Water molecule!",
            tip: "👉 Click + H₂O now!",
            action: 'add-H2O',
            targetCount: 2,
            interactiveClick: true
        },
        {
            selector: "#btn-add-react-H2",
            fallbackSelector: '[data-info="btn-react"][data-mol-id="H2"], [data-info="btn-react"]',
            badge: "12/12 Solve H",
            title: "Step 2: Check Back & Fix Hydrogen",
            desc: "Check the scale! Oxygen is balanced (2 on each side). But adding water gave the right side 4 Hydrogens, while the left only has 2! Click <b>+ H₂</b> on the left to even it out!",
            tip: "👉 Click + H₂ to achieve equilibrium!",
            action: 'add-H2',
            targetCount: 2,
            interactiveClick: true
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
        `;
        document.head.appendChild(style);
    }

    function createTourDOM() {
        if (tourContainer) return;
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
                border: 4px solid #2563eb;
                border-radius: 20px;
                box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
                max-width: 400px;
                width: 90vw;
                padding: 18px 20px;
                box-sizing: border-box;
                z-index: 99995;
                transition: all 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.15);
                pointer-events: auto;
            ">
                <!-- Header -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span id="tour-card-badge" style="
                        background: #dbeafe;
                        color: #1e40af;
                        border: 1.5px solid #93c5fd;
                        font-size: 0.75rem;
                        font-weight: 900;
                        padding: 2px 8px;
                        border-radius: 9999px;
                    ">Step 1</span>
                    <button id="tour-btn-close" style="
                        background: #f1f5f9;
                        border: 1.5px solid #cbd5e1;
                        border-radius: 50%;
                        width: 28px;
                        height: 28px;
                        font-size: 0.95rem;
                        font-weight: 900;
                        color: #475569;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    " title="Close Guide">✕</button>
                </div>

                <!-- Title & Description -->
                <h4 id="tour-card-title" style="margin:0 0 6px 0; font-size:1.15rem; font-weight:900; color:#0f172a; line-height:1.2;">Title</h4>
                <p id="tour-card-desc" style="margin:0 0 10px 0; font-size:0.9rem; font-weight:600; line-height:1.4; color:#334155;">Description</p>

                <!-- Tip -->
                <div id="tour-card-tip" style="
                    background: #fefce8;
                    border: 1.5px solid #fef08a;
                    border-radius: 10px;
                    padding: 6px 10px;
                    margin-bottom: 12px;
                    font-size: 0.82rem;
                    font-weight: 800;
                    color: #854d0e;
                    line-height: 1.35;
                ">Tip</div>

                <!-- Footer Navigation -->
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1.5px solid #f1f5f9; padding-top:12px;">
                    <!-- Dots -->
                    <div id="tour-dots-row" style="display:flex; gap:5px; flex-wrap:wrap; max-width:180px;"></div>

                    <!-- Buttons -->
                    <div style="display:flex; gap:8px;">
                        <button id="tour-btn-prev" style="
                            background: #f1f5f9;
                            border: 2px solid #cbd5e1;
                            border-radius: 10px;
                            padding: 6px 14px;
                            font-size: 0.85rem;
                            font-weight: 800;
                            color: #475569;
                            cursor: pointer;
                        ">Back</button>

                        <button id="tour-btn-next" style="
                            background: #2563eb;
                            border: 2px solid #1d4ed8;
                            border-radius: 10px;
                            padding: 6px 16px;
                            font-size: 0.85rem;
                            font-weight: 900;
                            color: #ffffff;
                            cursor: pointer;
                            box-shadow: 0 3px 0 #1e40af;
                        ">Next →</button>
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
        document.getElementById('tour-btn-next').addEventListener('click', nextTourStep);

        document.addEventListener('keydown', (e) => {
            if (!tourContainer || tourContainer.style.display !== 'block') return;
            if (e.key === 'Escape') closeTour();
            if (e.key === 'ArrowRight') nextTourStep();
            if (e.key === 'ArrowLeft') prevTourStep();
        });

        window.addEventListener('resize', () => {
            if (tourContainer && tourContainer.style.display === 'block') {
                positionSpotlight(currentStep);
            }
        });
    }

    function positionSpotlight(stepIndex) {
        const steps = getActiveSteps();
        const step = steps[stepIndex] || steps[0];

        let targetEl = null;
        if (step.selector) targetEl = document.querySelector(step.selector);
        if (!targetEl && step.fallbackSelector) targetEl = document.querySelector(step.fallbackSelector);

        const padding = 8;
        let rect = {
            top: window.innerHeight * 0.25,
            left: window.innerWidth * 0.15,
            width: window.innerWidth * 0.7,
            height: 80
        };

        if (targetEl) {
            const r = targetEl.getBoundingClientRect();
            rect = {
                top: Math.max(0, r.top - padding),
                left: Math.max(0, r.left - padding),
                width: Math.max(20, r.width + padding * 2),
                height: Math.max(20, r.height + padding * 2)
            };
        }

        // Update Highlight Pulse Ring
        if (highlightPulseEl) {
            highlightPulseEl.style.display = 'block';
            highlightPulseEl.style.top = `${rect.top}px`;
            highlightPulseEl.style.left = `${rect.left}px`;
            highlightPulseEl.style.width = `${rect.width}px`;
            highlightPulseEl.style.height = `${rect.height}px`;
        }

        // Position Popover Card
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

            if (rect.left > viewportW - 220) {
                cardLeft = Math.max(16, rect.left - cardWidth - 20);
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

        // Setup real interaction gating
        if (step.interactiveClick && targetEl) {
            activeTargetEl = targetEl;
            activeClickListener = () => {
                setTimeout(() => {
                    nextTourStep();
                }, 350);
            };
            targetEl.addEventListener('click', activeClickListener, { once: true });
        }

        // Periodic state check for molecule counts / tray / study room / balance completion
        if (step.action) {
            actionCheckInterval = setInterval(() => {
                if (step.action === 'add-H2') {
                    const count = (window.molecules?.react || []).filter(m => m.id === 'H2').length;
                    if (count >= (step.targetCount || 1)) {
                        clearInterval(actionCheckInterval);
                        actionCheckInterval = null;
                        // If this was Step 12 (final balance), close the tour card completely so victory popup is unobstructed!
                        if (step.targetCount === 2) {
                            setTimeout(closeTour, 300);
                        } else {
                            setTimeout(nextTourStep, 350);
                        }
                    }
                } else if (step.action === 'add-O2') {
                    const count = (window.molecules?.react || []).filter(m => m.id === 'O2').length;
                    if (count >= (step.targetCount || 1)) {
                        clearInterval(actionCheckInterval);
                        actionCheckInterval = null;
                        setTimeout(nextTourStep, 350);
                    }
                } else if (step.action === 'add-H2O') {
                    const count = (window.molecules?.prod || []).filter(m => m.id === 'H2O').length;
                    if (count >= (step.targetCount || 1)) {
                        clearInterval(actionCheckInterval);
                        actionCheckInterval = null;
                        setTimeout(nextTourStep, 350);
                    }
                } else if (step.action === 'study-room') {
                    const modal = document.getElementById('study-room-modal');
                    if (modal && modal.style.display !== 'none') {
                        const closeBtn = document.getElementById('study-room-close-btn');
                        if (closeBtn && activeTargetEl !== closeBtn) {
                            activeTargetEl = closeBtn;
                            const r = closeBtn.getBoundingClientRect();
                            if (highlightPulseEl) {
                                highlightPulseEl.style.top = `${r.top - 4}px`;
                                highlightPulseEl.style.left = `${r.left - 4}px`;
                                highlightPulseEl.style.width = `${r.width + 8}px`;
                                highlightPulseEl.style.height = `${r.height + 8}px`;
                            }
                            const descEl = document.getElementById('tour-card-desc');
                            if (descEl) descEl.innerHTML = "When done reviewing notes, click the <b>✕ button</b> at top right to return to balancing!";
                            closeBtn.addEventListener('click', () => {
                                clearInterval(actionCheckInterval);
                                actionCheckInterval = null;
                                setTimeout(nextTourStep, 300);
                            }, { once: true });
                        }
                    }
                }
            }, 250);
        }
    }

    function renderTourStep(index) {
        const steps = getActiveSteps();
        if (index < 0) index = 0;
        if (index >= steps.length) index = steps.length - 1;
        currentStep = index;

        const step = steps[currentStep];

        // CRITICAL: Close study room modal if not on study-room step to prevent view blockage
        if (step.action !== 'study-room') {
            const modal = document.getElementById('study-room-modal');
            if (modal && modal.style.display !== 'none' && typeof window.closeStudyRoomModal === 'function') {
                window.closeStudyRoomModal();
            }
        }

        document.getElementById('tour-card-badge').innerText = step.badge;
        document.getElementById('tour-card-title').innerText = step.title;
        document.getElementById('tour-card-desc').innerHTML = step.desc;
        document.getElementById('tour-card-tip').innerHTML = step.tip;

        // Render Dots
        const dotsContainer = document.getElementById('tour-dots-row');
        if (dotsContainer) {
            dotsContainer.innerHTML = steps.map((_, i) => {
                const active = i === currentStep;
                return `<div onclick="window.goToTourStep(${i})" style="width:${active ? 16 : 6}px; height:6px; border-radius:999px; background:${active ? '#2563eb' : '#cbd5e1'}; cursor:pointer; transition:all 0.2s;"></div>`;
            }).join('');
        }

        // Update Prev / Next Buttons
        const prevBtn = document.getElementById('tour-btn-prev');
        const nextBtn = document.getElementById('tour-btn-next');

        if (currentStep === 0) {
            prevBtn.style.opacity = '0.4';
            prevBtn.style.pointerEvents = 'none';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.pointerEvents = 'auto';
        }

        if (currentStep === steps.length - 1) {
            nextBtn.innerText = "Finish 🚀";
            nextBtn.style.background = '#10b981';
            nextBtn.style.borderColor = '#059669';
        } else {
            nextBtn.innerText = "Next →";
            nextBtn.style.background = '#2563eb';
            nextBtn.style.borderColor = '#1d4ed8';
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

        const modal = document.getElementById('study-room-modal');
        if (modal && modal.style.display !== 'none' && typeof window.closeStudyRoomModal === 'function') {
            window.closeStudyRoomModal();
        }

        tourContainer.style.opacity = '0';
        setTimeout(() => {
            tourContainer.style.display = 'none';
        }, 220);

        if (typeof playSound === 'function') {
            playSound('click');
        }
    }

    function nextTourStep() {
        if (typeof playSound === 'function') playSound('click');
        const steps = getActiveSteps();
        if (currentStep >= steps.length - 1) {
            closeTour();
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
