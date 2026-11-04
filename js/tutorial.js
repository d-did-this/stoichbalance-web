/**
 * Stoichbalance V2 - Interactive Spotlight Onboarding Tour & Tutorial Level Engine
 * Keeps the board 100% bright and clear (no dark dimming) while highlighting target
 * elements with high-visibility animated pulse rings and interactive state gating.
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
            badge: "Tutorial 1/13",
            title: "Welcome! Your First Reaction",
            desc: "Chemical equations show how atoms rearrange. The Law of Conservation of Mass states that atoms cannot be created or destroyed: every atom on the Reactants (left) side must equal the Products (right) side!",
            tip: "🎯 Mission: Balance Water Synthesis (H₂ + O₂ → H₂O) step-by-step."
        },
        {
            selector: "#dynamic-sleek-equation",
            fallbackSelector: ".sleek-equation-card",
            badge: "Touch & Inspect",
            title: "Chemistry Info Cards",
            desc: "Hover over any chemical symbol or formula to inspect its atomic composition and states of matter. <b>On tablet/touchscreen: press and hold for 300ms</b> to open its interactive Chemistry Info Card!",
            tip: "📱 Tablet Tip: Tap and hold any element to inspect its card."
        },
        {
            selector: "#btn-add-react-H2",
            fallbackSelector: '[data-info="btn-react"][data-mol-id="H2"], [data-info="btn-react"]',
            badge: "Step 1: Add Reactants",
            title: "Drop Hydrogen (H₂)",
            desc: "Tap the glowing <b>+ H₂</b> button to drop your first Hydrogen gas molecule into the left beaker. Notice that each molecule brings 2 Hydrogen atoms!",
            tip: "👉 Tap + H₂ to drop Hydrogen into the beaker!",
            action: 'add-H2',
            targetCount: 1,
            interactiveClick: true
        },
        {
            selector: "#btn-add-react-O2",
            fallbackSelector: '[data-info="btn-react"][data-mol-id="O2"]',
            badge: "Step 2: Add Reactants",
            title: "Drop Oxygen (O₂)",
            desc: "Now tap <b>+ O₂</b> to drop an Oxygen gas molecule into the left beaker. It brings 2 Oxygen atoms.",
            tip: "👉 Tap + O₂ to add Oxygen!",
            action: 'add-O2',
            targetCount: 1,
            interactiveClick: true
        },
        {
            selector: "#btn-add-prod-H2O",
            fallbackSelector: '[data-info="btn-prod"][data-mol-id="H2O"], [data-info="btn-prod"]',
            badge: "Step 3: Add Products",
            title: "Create Water (H₂O)",
            desc: "Now tap <b>+ H₂O</b> on the right side to add one Water molecule into the products beaker.",
            tip: "👉 Tap + H₂O to create Water!",
            action: 'add-H2O',
            targetCount: 1,
            interactiveClick: true
        },
        {
            selector: ".scale-section",
            fallbackSelector: "#adv-giant-plank, .mini-seesaw",
            badge: "Step 4: Check Scales",
            title: "Reading the Seesaw Scale",
            desc: "Look at the seesaw scale! We currently have: <br>• Left: <b>2 H, 2 O</b><br>• Right: <b>2 H, 1 O</b><br>The scale tilts down on the left because the Products side is missing <b>1 Oxygen atom</b>!",
            tip: "⚖️ The red badge warns you which atom is unbalanced."
        },
        {
            selector: '[data-info="btn-tray"]',
            fallbackSelector: "#btn-toggle-tray, .rect-btn",
            badge: "Step 5: Element Tray",
            title: "Open the Element Tray",
            desc: "Tap the <b>Element Tray</b> on the left. It slides open a drawer tracking each element on its own mini-scale and shows the MINOH balancing order.",
            tip: "👉 Tap the Element Tray button to slide open the drawer!",
            action: 'open-tray',
            interactiveClick: true
        },
        {
            selector: "#react-drop-container",
            fallbackSelector: ".drop-zone",
            badge: "Step 6: Correction Tool",
            title: "Fixing Mistakes",
            desc: "If you ever drop too many molecules, hover over any molecule card in the beaker (or tap it directly on tablet) to reveal the trash button to remove it. You never have to restart!",
            tip: "💡 Click or tap any placed molecule card to remove it."
        },
        {
            selector: "#prof-beaker-card",
            fallbackSelector: '[data-info="btn-hint"], #chat-toggle-btn',
            badge: "Step 7: AI Chemistry Tutor",
            title: "Prof. Beaker & MINOH Rule",
            desc: "Stuck on a tricky reaction? Prof. Beaker uses the <b>MINOH Rule</b> (Metals first, Polyatomic Ions next, Non-metals, then <b>Oxygen</b>, and <b>Hydrogen last</b>)! Notice his advice: balance Oxygen first before Hydrogen!",
            tip: "💡 Always follow the MINOH attack sequence!"
        },
        {
            selector: "#btn-open-study-room",
            fallbackSelector: '[data-info="btn-study-room"], .study-room-pill-btn',
            badge: "Step 8: Study Room",
            title: "Visual Study Room",
            desc: "Need full stoichiometric notes or mass comparison bars? Tap the <b>Study Room</b> button. When done inspecting, click the <b>✕ button</b> at the top right of the Study Room to return to balancing!",
            tip: "🔍 Tap Study Room to inspect notes, or click Next to solve!",
            action: 'study-room'
        },
        {
            selector: "#btn-add-prod-H2O",
            fallbackSelector: '[data-info="btn-prod"][data-mol-id="H2O"], [data-info="btn-prod"]',
            badge: "Step 9: Solve Oxygen",
            title: "Solve Step 1: Balance Oxygen",
            desc: "Following the MINOH rule, let us balance Oxygen first! <br>Reactants has <b>2 Oxygen atoms</b>, but Products only has <b>1</b>. Tap <b>+ H₂O</b> to drop a second Water molecule so Oxygen reaches 2 on both sides!",
            tip: "👉 Tap + H₂O to equalize Oxygen!",
            action: 'add-H2O',
            targetCount: 2,
            interactiveClick: true
        },
        {
            selector: "#btn-add-react-H2",
            fallbackSelector: '[data-info="btn-react"][data-mol-id="H2"], [data-info="btn-react"]',
            badge: "Step 10: Solve Hydrogen",
            title: "Solve Step 2: Balance Hydrogen",
            desc: "Look closely at Hydrogen now: The two Water molecules brought <b>4 Hydrogen atoms</b> (2 × 2) to the right side, while the left only has <b>2</b>. Tap <b>+ H₂</b> to add a second Hydrogen molecule so both sides have 4!",
            tip: "👉 Tap + H₂ to achieve perfect balance!",
            action: 'add-H2',
            targetCount: 2,
            interactiveClick: true
        },
        {
            selector: ".status-bar-shared",
            fallbackSelector: "#status-container, .status-left",
            badge: "Step 11: Perfect Balance",
            title: "Reaction Balanced & Simplified!",
            desc: "Both status bars shine bright green: <b>BALANCED</b> and <b>SIMPLIFIED</b>!<br>Reactants: <b>4 H, 2 O</b> | Products: <b>4 H, 2 O</b>.<br>You just balanced <b>2H₂ + O₂ → 2H₂O</b> using the Law of Conservation of Mass. You are now fully prepared for Form 4 and Form 5!",
            tip: "🎉 Tap Finish Tour to celebrate your victory!"
        }
    ];

    // 2. Standard Level Tour
    const TOUR_STEPS = [
        {
            selector: "#level-title",
            badge: "Level Info",
            title: "Check Your Level & Reaction",
            desc: "Hover over the level title (or tap and hold on tablet) to inspect real-world chemistry background, reaction history, and key facts about the chemical equation.",
            tip: "💡 Always check the level name to know what you are synthesizing!"
        },
        {
            selector: "#dynamic-sleek-equation",
            badge: "Equation & Hover Cards",
            title: "Hover (or Hold on Tablet) Any Element",
            desc: "This is your chemical equation. Hover over any coefficient, chemical formula, or subscript (or press and hold for 300ms on tablet) to inspect real-time atom calculations, bonding groups, and element facts.",
            tip: "💡 Try hovering over coefficients to see how groups multiply atoms!"
        },
        {
            selector: ".status-bar-shared",
            badge: "Status Bars",
            title: "Balanced & Simplified",
            desc: "Your mission has two parts: 1) Equalize all atom types so the left bar turns green (<strong>BALANCED</strong>), and 2) Ensure coefficients are in their lowest whole-number ratio to turn the right bar green (<strong>SIMPLIFIED</strong>).",
            tip: "💡 If an equation is balanced but not simplified, reduce all coefficients!"
        },
        {
            selector: '[data-info="btn-react"]',
            badge: "Adding Molecules",
            title: "Click to Add Reactants",
            desc: "Press this blue <strong>+ Reactant</strong> button to drop reactant molecule marbles into the balance beaker! You can also click the orange buttons on the right to add products.",
            tip: "👉 Click the glowing button now or press Next!",
            interactiveClick: true
        },
        {
            selector: "#react-drop-container",
            badge: "Removing Molecules",
            title: "How to Remove Molecules",
            desc: "Need to take back a move? Hover over any placed molecule card in the balance beaker (or tap it directly on tablet) to reveal the red <strong>✕ remove button</strong>, then click it to delete that molecule group.",
            tip: "💡 You can also use the Undo button in Settings!"
        },
        {
            selector: '[data-info="btn-tray"]',
            badge: "Element Tray",
            title: "Compare Each Element",
            desc: "Click the <strong>Element Tray</strong> button on the left to slide open the side drawer. It tracks each element individually and shows which side needs more atoms.",
            tip: "👉 Click to open or close the drawer!",
            interactiveClick: true
        },
        {
            selector: '[data-info="btn-hint"]',
            badge: "Hints & Tutor",
            title: "Prof. Beaker & Hints",
            desc: "Stuck on a tricky reaction? Click <strong>I am Stuck! Help!</strong> or open <strong>Prof. Beaker</strong> on the right to get personalized step-by-step guidance without losing points.",
            tip: "💡 Stuck? There is no shame in asking for a clue!"
        },
        {
            selector: ".fab-container",
            badge: "Settings Menu",
            title: "Game Controls & Settings",
            desc: "Access quick utility controls here: toggle sound (Mute/Unmute), go Full screen, Undo moves, or Reset the board. You can also re-open this tutorial or zoom with the buttons on the bottom left!",
            tip: "🚀 You are all set to start balancing equations. Have fun!"
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
                0% { box-shadow: 0 0 0 4px #2563eb, 0 0 0 8px rgba(37, 99, 235, 0.45), 0 0 25px rgba(37, 99, 235, 0.7); transform: scale(1); }
                50% { box-shadow: 0 0 0 6px #3b82f6, 0 0 0 14px rgba(59, 130, 246, 0.25), 0 0 40px rgba(59, 130, 246, 0.85); transform: scale(1.02); }
                100% { box-shadow: 0 0 0 4px #2563eb, 0 0 0 8px rgba(37, 99, 235, 0.45), 0 0 25px rgba(37, 99, 235, 0.7); transform: scale(1); }
            }
            @keyframes stoichTourBouncePill {
                0% { transform: translate(-50%, 0); }
                100% { transform: translate(-50%, -6px); }
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
            <!-- Non-dimming transparent container: Board stays 100% bright and visible -->
            <div id="tour-blocker-top" style="position:fixed; background:transparent; pointer-events:none; z-index:99990;"></div>
            <div id="tour-blocker-bottom" style="position:fixed; background:transparent; pointer-events:none; z-index:99990;"></div>
            <div id="tour-blocker-left" style="position:fixed; background:transparent; pointer-events:none; z-index:99990;"></div>
            <div id="tour-blocker-right" style="position:fixed; background:transparent; pointer-events:none; z-index:99990;"></div>

            <!-- Spotlight Pulsing Ring: Vibrant, Eye-catching border -->
            <div id="tour-pulse-ring" style="
                position: fixed;
                border: 3.5px solid #2563eb;
                border-radius: 16px;
                animation: stoichTourRingPulse 1.4s ease-in-out infinite;
                pointer-events: none;
                transition: all 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.15);
                z-index: 99992;
                display: none;
            ">
                <div id="tour-ring-pill" style="
                    position: absolute;
                    top: -34px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #2563eb;
                    color: #ffffff;
                    font-size: 11px;
                    font-weight: 900;
                    padding: 3px 12px;
                    border-radius: 999px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                    white-space: nowrap;
                    letter-spacing: 0.5px;
                    border: 2px solid #ffffff;
                    animation: stoichTourBouncePill 0.8s infinite alternate ease-in-out;
                ">👇 INTERACT HERE</div>
            </div>

            <!-- Guided Popover Card -->
            <div id="tour-popover-card" style="
                position: fixed;
                background: #ffffff;
                border: 4.5px solid #2563eb;
                border-radius: 20px;
                box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35), inset 0 -4px 0 rgba(0,0,0,0.06);
                max-width: 440px;
                width: 90vw;
                padding: 20px 22px 18px 22px;
                box-sizing: border-box;
                z-index: 99995;
                transition: all 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.15);
                pointer-events: auto;
            ">
                <!-- Header -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span id="tour-card-badge" style="
                            background: #dbeafe;
                            color: #1e40af;
                            border: 1.5px solid #93c5fd;
                            font-size: 0.72rem;
                            font-weight: 900;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            padding: 2px 8px;
                            border-radius: 9999px;
                        ">STEP 1</span>
                        <span id="tour-card-step-text" style="font-size:0.75rem; font-weight:800; color:#64748b;">Step 1</span>
                    </div>
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
                <h4 id="tour-card-title" style="margin:0 0 6px 0; font-size:1.18rem; font-weight:900; color:#0f172a; line-height:1.25;">Title</h4>
                <p id="tour-card-desc" style="margin:0 0 10px 0; font-size:0.88rem; font-weight:600; line-height:1.45; color:#334155;">Description</p>

                <!-- Tip / Action Callout -->
                <div id="tour-card-tip" style="
                    background: #fefce8;
                    border: 1.5px solid #fef08a;
                    border-radius: 10px;
                    padding: 7px 10px;
                    margin-bottom: 14px;
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
                            box-shadow: 0 2px 0 #cbd5e1;
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

            const pill = document.getElementById('tour-ring-pill');
            if (pill) {
                if (rect.top < 45) {
                    pill.style.top = 'auto';
                    pill.style.bottom = '-32px';
                    pill.innerText = '👆 INTERACT HERE';
                } else {
                    pill.style.bottom = 'auto';
                    pill.style.top = '-34px';
                    pill.innerText = '👇 INTERACT HERE';
                }
            }
        }

        // Position Popover Card
        if (popoverCard) {
            const cardWidth = Math.min(440, window.innerWidth - 32);
            const cardHeight = popoverCard.offsetHeight || 240;
            const viewportW = window.innerWidth;
            const viewportH = window.innerHeight;

            let cardLeft = rect.left + (rect.width / 2) - (cardWidth / 2);
            cardLeft = Math.max(16, Math.min(cardLeft, viewportW - cardWidth - 16));

            let cardTop = rect.top + rect.height + 16;
            // If near bottom of screen, flip card to appear above element
            if (cardTop + cardHeight > viewportH - 20) {
                cardTop = Math.max(16, rect.top - cardHeight - 16);
            }

            // If target is on the far right, place popover to its left
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
                }, 400);
            };
            targetEl.addEventListener('click', activeClickListener, { once: true });
        }

        // Periodic state check for molecule counts / tray / study room
        if (step.action) {
            actionCheckInterval = setInterval(() => {
                if (step.action === 'add-H2') {
                    const count = (window.molecules?.react || []).filter(m => m.id === 'H2').length;
                    if (count >= (step.targetCount || 1)) {
                        clearInterval(actionCheckInterval);
                        actionCheckInterval = null;
                        setTimeout(nextTourStep, 350);
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
                } else if (step.action === 'open-tray') {
                    const tray = document.getElementById('element-tray');
                    if (tray && tray.classList.contains('open')) {
                        clearInterval(actionCheckInterval);
                        actionCheckInterval = null;
                        setTimeout(nextTourStep, 450);
                    }
                } else if (step.action === 'study-room') {
                    const modal = document.getElementById('study-room-modal');
                    if (modal && modal.style.display !== 'none') {
                        // Modal is open! Spotlight the close button so the user can close it cleanly
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
                            if (descEl) descEl.innerHTML = "Great! This is your Study Room with notes and mass bars. Now click the <b>✕ button</b> at top right to return to balancing!";
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
        document.getElementById('tour-card-step-text').innerText = `Step ${currentStep + 1} of ${steps.length}`;
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
            nextBtn.innerText = "Finish Tour 🚀";
            nextBtn.style.background = '#10b981';
            nextBtn.style.borderColor = '#059669';
            nextBtn.style.boxShadow = '0 3px 0 #047857';
        } else {
            nextBtn.innerText = "Next →";
            nextBtn.style.background = '#2563eb';
            nextBtn.style.borderColor = '#1d4ed8';
            nextBtn.style.boxShadow = '0 3px 0 #1e40af';
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

        // Make sure study room modal is closed if open
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
