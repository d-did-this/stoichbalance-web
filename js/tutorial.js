/**
 * Stoichbalance V2 - Interactive Spotlight Onboarding Tour & Tutorial Level Engine
 * Uses 4 surrounding dim blockers to physically expose each targeted button,
 * allowing students to interactively click and press the highlighted feature.
 */
(function() {
    let currentStep = 0;
    let tourContainer = null;
    let popoverCard = null;
    let highlightPulseEl = null;
    let activeClickListener = null;
    let activeTargetEl = null;

    // 1. Scripted Interactive Tutorial Level (TUT0: Water Synthesis)
    const TUT0_STEPS = [
        {
            selector: "#level-title",
            fallbackSelector: "#dynamic-sleek-equation",
            badge: "Tutorial 1/13",
            title: "Welcome! Your First Reaction",
            desc: "Chemical equations show how atoms rearrange. The Law of Conservation of Mass states that atoms cannot be created or destroyed. What goes in must equal what comes out!",
            tip: "🎯 Mission: Equalize Hydrogen (H) and Oxygen (O) to make Water."
        },
        {
            selector: "#dynamic-sleek-equation",
            fallbackSelector: ".sleek-equation-card",
            badge: "Touch & Inspect",
            title: "Chemistry Info Cards",
            desc: "Hover over any chemical symbol or formula to inspect its atomic composition and states of matter. <b>On tablet/touchscreen: press and hold for half a second</b> to open its interactive Chemistry Info Card!",
            tip: "📱 Tablet Tip: Tap and hold any element to inspect its card."
        },
        {
            selector: "#btn-add-react-H2",
            fallbackSelector: '[data-info="btn-react"][data-mol-id="H2"], [data-info="btn-react"]',
            badge: "Add Reactants",
            title: "Step 1: Add Reactant H₂",
            desc: "Tap the glowing <b>+ H₂</b> button to drop your first Hydrogen gas molecule into the left beaker. Notice that each molecule brings 2 Hydrogen atoms!",
            tip: "👉 Tap + H₂ to drop Hydrogen into the beaker!",
            interactiveClick: true
        },
        {
            selector: "#btn-add-react-O2",
            fallbackSelector: '[data-info="btn-react"][data-mol-id="O2"]',
            badge: "Add Reactants",
            title: "Step 2: Add Reactant O₂",
            desc: "Now tap <b>+ O₂</b> to drop an Oxygen gas molecule into the left beaker. It brings 2 Oxygen atoms.",
            tip: "👉 Tap + O₂ to add Oxygen!",
            interactiveClick: true
        },
        {
            selector: "#btn-add-prod-H2O",
            fallbackSelector: '[data-info="btn-prod"][data-mol-id="H2O"], [data-info="btn-prod"]',
            badge: "Add Products",
            title: "Step 3: Create Water (H₂O)",
            desc: "Now tap <b>+ H₂O</b> on the right side to add one Water molecule into the products beaker.",
            tip: "👉 Tap + H₂O to create Water!",
            interactiveClick: true
        },
        {
            selector: ".scale-section",
            fallbackSelector: "#adv-giant-plank, .mini-seesaw",
            badge: "Reading the Scales",
            title: "Step 4: Check the Seesaw Scale",
            desc: "Look at the seesaw scale! We have 2 Hydrogens on each side (balanced!), but we have <b>2 Oxygens on the left</b> and only <b>1 on the right</b>. The scale is tilted because the reactants side is heavier!",
            tip: "⚖️ The red badge (-1) warns you which side is lacking atoms."
        },
        {
            selector: '[data-info="btn-tray"]',
            fallbackSelector: "#btn-toggle-tray, .rect-btn",
            badge: "Element Tray",
            title: "Step 5: Open the Element Tray",
            desc: "Tap the <b>Element Tray</b> on the left. It slides open a drawer tracking each atom individually and showing the MINOH balancing order.",
            tip: "👉 Tap the Element Tray button to slide open the drawer!",
            interactiveClick: true
        },
        {
            selector: "#react-drop-container",
            fallbackSelector: ".drop-zone",
            badge: "Correction Tool",
            title: "Step 6: Fixing Mistakes",
            desc: "If you ever drop too many molecules, hover over any molecule card in the beaker (or tap it directly on tablet) to remove it. You never have to restart the whole level!",
            tip: "💡 Click or tap any placed molecule card to remove it."
        },
        {
            selector: "#prof-beaker-card",
            fallbackSelector: '[data-info="btn-hint"], #chat-toggle-btn',
            badge: "AI Chemistry Tutor",
            title: "Step 7: Ask Prof. Beaker",
            desc: "Stuck on a tricky reaction? Prof. Beaker uses the MINOH rule (Metals, Polyatomic Ions, Non-metals, Oxygen, Hydrogen) to give guided clues. Notice his advice: balance Oxygen first before Hydrogen!",
            tip: "💡 Always follow the MINOH attack sequence!"
        },
        {
            selector: "#btn-open-study-room",
            fallbackSelector: '[data-info="btn-study-room"], .study-room-pill-btn',
            badge: "Study Room",
            title: "Step 8: Visual Study Room",
            desc: "Need a full overview? Tap the <b>Study Room</b> button to inspect real-time comparison bars and stoichiometry formulas across the screen.",
            tip: "🔍 Tap the button to open or press Next to continue!"
        },
        {
            selector: "#btn-add-prod-H2O",
            fallbackSelector: '[data-info="btn-prod"][data-mol-id="H2O"], [data-info="btn-prod"]',
            badge: "Executing Strategy",
            title: "Step 9: Balance Oxygen",
            desc: "Following MINOH, let's fix Oxygen! The right side has 1 Oxygen, but needs 2. Tap <b>+ H₂O</b> to drop a second Water molecule.",
            tip: "👉 Tap + H₂O now!",
            interactiveClick: true
        },
        {
            selector: "#btn-add-react-H2",
            fallbackSelector: '[data-info="btn-react"][data-mol-id="H2"], [data-info="btn-react"]',
            badge: "Final Balance",
            title: "Step 10: Balance Hydrogen",
            desc: "Look closely: Oxygen is now balanced (2 vs 2)! But the new Water molecule brought 4 Hydrogens on the right, while we only have 2 on the left. Tap <b>+ H₂</b> one more time to finish balancing!",
            tip: "👉 Tap + H₂ to achieve perfect balance!",
            interactiveClick: true
        },
        {
            selector: ".status-bar-shared",
            fallbackSelector: "#status-container, .status-left",
            badge: "Mastery",
            title: "Step 11: Perfect Balance!",
            desc: "Both status bars shine green: <b>BALANCED</b> and <b>SIMPLIFIED</b>! You just balanced <b>2H₂ + O₂ → 2H₂O</b> using the Law of Conservation of Mass. You are now fully prepared for Form 4 and Form 5!",
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
            desc: "This is your chemical equation. Hover over any coefficient, chemical formula, or subscript (or press and hold on tablet) to inspect real-time atom calculations, bonding groups, and element facts.",
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

    function createTourDOM() {
        if (tourContainer) return;

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
            transition: opacity 0.25s ease-out;
            pointer-events: none;
            font-family: 'Fredoka', system-ui, -apple-system, sans-serif;
        `;

        const blockerStyle = `
            position: fixed;
            background: rgba(15, 23, 42, 0.82);
            pointer-events: auto;
            transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.15);
            z-index: 99990;
        `;

        tourContainer.innerHTML = `
            <!-- 4 Physical Blockers creating an unobstructed interactive hole -->
            <div id="tour-blocker-top" style="${blockerStyle}"></div>
            <div id="tour-blocker-bottom" style="${blockerStyle}"></div>
            <div id="tour-blocker-left" style="${blockerStyle}"></div>
            <div id="tour-blocker-right" style="${blockerStyle}"></div>

            <!-- Spotlight Pulsing Ring -->
            <div id="tour-pulse-ring" style="
                position: fixed;
                border: 3.5px solid #38bdf8;
                border-radius: 14px;
                box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.35), 0 0 25px rgba(56, 189, 248, 0.6);
                pointer-events: none;
                transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.15);
                z-index: 99992;
                display: none;
            "></div>

            <!-- Guided Popover Card -->
            <div id="tour-popover-card" style="
                position: fixed;
                background: #ffffff;
                border: 4.5px solid #2563eb;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45), inset 0 -4px 0 rgba(0,0,0,0.06);
                max-width: 430px;
                width: 90vw;
                padding: 20px 22px 18px 22px;
                box-sizing: border-box;
                z-index: 99995;
                transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.15);
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

        // 1. Update 4 physical blockers around rect
        const topEl = document.getElementById('tour-blocker-top');
        const bottomEl = document.getElementById('tour-blocker-bottom');
        const leftEl = document.getElementById('tour-blocker-left');
        const rightEl = document.getElementById('tour-blocker-right');

        if (topEl && bottomEl && leftEl && rightEl) {
            topEl.style.top = '0px';
            topEl.style.left = '0px';
            topEl.style.width = '100vw';
            topEl.style.height = `${rect.top}px`;

            bottomEl.style.top = `${rect.top + rect.height}px`;
            bottomEl.style.left = '0px';
            bottomEl.style.width = '100vw';
            bottomEl.style.height = `calc(100vh - ${rect.top + rect.height}px)`;

            leftEl.style.top = `${rect.top}px`;
            leftEl.style.left = '0px';
            leftEl.style.width = `${rect.left}px`;
            leftEl.style.height = `${rect.height}px`;

            rightEl.style.top = `${rect.top}px`;
            rightEl.style.left = `${rect.left + rect.width}px`;
            rightEl.style.width = `calc(100vw - ${rect.left + rect.width}px)`;
            rightEl.style.height = `${rect.height}px`;
        }

        // 2. Update Highlight Pulse Ring
        if (highlightPulseEl) {
            highlightPulseEl.style.display = 'block';
            highlightPulseEl.style.top = `${rect.top}px`;
            highlightPulseEl.style.left = `${rect.left}px`;
            highlightPulseEl.style.width = `${rect.width}px`;
            highlightPulseEl.style.height = `${rect.height}px`;
        }

        // 3. Position Popover Card
        if (popoverCard) {
            const cardWidth = Math.min(430, window.innerWidth - 32);
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

        // 4. Attach interactive click auto-advance if specified
        if (activeClickListener && activeTargetEl) {
            activeTargetEl.removeEventListener('click', activeClickListener);
            activeClickListener = null;
            activeTargetEl = null;
        }

        if (step.interactiveClick && targetEl) {
            activeTargetEl = targetEl;
            activeClickListener = () => {
                setTimeout(() => {
                    nextTourStep();
                }, 400);
            };
            targetEl.addEventListener('click', activeClickListener, { once: true });
        }
    }

    function renderTourStep(index) {
        const steps = getActiveSteps();
        if (index < 0) index = 0;
        if (index >= steps.length) index = steps.length - 1;
        currentStep = index;

        const step = steps[currentStep];

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

        if (activeClickListener && activeTargetEl) {
            activeTargetEl.removeEventListener('click', activeClickListener);
            activeClickListener = null;
            activeTargetEl = null;
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
