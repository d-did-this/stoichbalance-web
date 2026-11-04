# Stoichbalance V2 Architecture & Layout Engine Contract

## 1. Multi-Column Dashboard Architecture (`game.html`)
The main chemistry game uses a fluid, responsive 3-column laboratory layout with dedicated peripheral clearance channels.

* **Viewport Strategy**: Pure CSS viewport-filling fluid layout with zero artificial scale wrappers or root zoom artifacts.
* **Invisible Perimeter Gutters**:
  ```css
  body {
      padding: clamp(8px, 1.5vh, 16px) clamp(92px, 6.5vw, 110px);
  }
  ```
  The horizontal gutter clamps dynamically between 92px and 110px. This reserves dedicated space for floating HUD elements outside the board.
* **Grid Hierarchy (`.good-layout`)**:
  - `grid-template-rows: 90px minmax(0, 1fr)`
  - `grid-template-columns: var(--left-w, 280px) minmax(0, 1fr) var(--right-w, 280px)`
  - `max-width: 1760px; margin: 0 auto; gap: clamp(10px, 1.4vw, 18px);`
* **Clearance Guarantees**:
  - Left Gutter (Mode Switcher): Fixed at `left: 15px`, width 65px (occupies 15px to 80px). Layout begins at `>= 92px`, guaranteeing `>= 12px` clearance.
  - Right Gutter (Settings FAB): Fixed at `right: 24px`, width 56px.
  - Center Column (`minmax(0, 1fr)`): Expands naturally to provide wide, comfortable space for chemical reactions, atoms, and balance scales across all widescreen displays.

## 2. Menu & Level Selection Architecture (`index.html`, `levels.html`)
The landing and level selection screens use centered card layouts centered horizontally and vertically within the viewport.

## 3. Tablet Landscape Viewport Contract (1024px to 1200px width, <= 760px height)
To ensure seamless visual appeal on tablets without regression on desktop monitors:
1. **Dynamic Sidebars (`game.html`)**:
   `grid-template-columns: var(--left-w, clamp(210px, 21vw, 280px)) minmax(0, 1fr) var(--right-w, clamp(210px, 21vw, 280px));`
   Expands to 280px on 1080p desktop while compressing smoothly down to 210-220px on 1024px tablets.
2. **Side Gutters**:
   `padding: clamp(6px, 1.2vh, 16px) clamp(74px, 6vw, 110px);`
   Provides guaranteed clearance for `#mode-switcher-sidebar` (left 10px, width 52px) and `.fab-container` (right 12px, width 48px).
3. **Centered Flexible Equation**:
   `#dynamic-sleek-equation` uses centered flexbox with flex-shrink protection on reactants, arrow, and products, guaranteeing zero text-arrow collision.
4. **Adaptive Row Heights (`levels.html`)**:
   `grid-template-rows: repeat(2, minmax(0, 1fr));` ensures both card rows fit on short tablet screens.
5. **Adaptive Vertical Padding (`index.html`)**:
   Responsive brand margins and input heights keep the entire launch card framed within `94vh` on short tablet screens.


## 4. Master Circular Iris Wipe & Persistent Stage Engine (`js/fullscreen.js`)
To guarantee unbroken native fullscreen and 60 FPS transitions without screen flashing across physical tablets:
* **Single Master Iris Orchestrator**:
  - Maintained on `window.top` with `z-index: 99999999`.
  - Geometric aperture: `width: 240vmax; height: 240vmax; border-radius: 50%;`.
  - Closing state: `box-shadow: inset 0 0 0 130vmax #0f172a;` (0.48s cubic-bezier).
  - Open state: `box-shadow: inset 0 0 0 0vmax #0f172a;`.
* **Zero-Flicker Stage Concealment**:
  - During subframe navigations, the iris contracts inward to solid navy `#0f172a`.
  - Frame document unloading, network fetch, and initial layout settlement occur completely behind the closed aperture.
  - Subframe local overlays are set to `display: none` to prevent competing GPU operations and duplicate transitions.
  - Upon `frame.onload` and layout readiness, `window.top` expands the aperture outward from the center, unveiling the new page smoothly.


## 5. Proportional Stage Scaler & Headroom Contract (`game.html`, `js/autoscale.js`)
To eliminate element collisions, text squeezing, and beaker clipping on tablet screens:
* **Dedicated Peripheral Clearance Channels**:
  - Reserving `gutter = Math.min(Math.max(window.innerWidth * 0.08, 86), 115)`.
  - Guarantees `>= 20px` clear space between `#mode-switcher-sidebar` (left), `#left-bottom-hud` (bottom-left), `.fab-container` (bottom-right), and `.good-layout`.
* **Proportional Autoscale on Tablet Viewports**:
  - Activated when `window.innerWidth < 1440` or `window.innerHeight < 860`.
  - Base reference: `baseW = 1140`, `baseH = 700`.
  - Factor: `scale = Math.min(availW / baseW, availH / baseH, 1.0)`.
  - Peripheral HUD controls scale proportionally by `widgetScale = Math.min(Math.max(scale, 0.78), 1.0)`.
  - On widescreen 1080p monitors (`>= 1440w`, `>= 860h`), autoscale automatically yields to the full unzoomed fluid CSS grid.
* **Scale Headroom Geometry**:
  - Fulcrum height set to 28px (`border-bottom: 28px solid #334155`).
  - Plank bottom set to 28px (`bottom: 28px`).
  - Section container height set to 145px (`height: 145px`).
  - Beakers (`height: 76px`, `bottom: 6px`) retain at least 19px of vertical headroom when resting and 8px+ when tilting, guaranteeing zero clipping of the rounded glass rims.


## 6. Sleek Tablet Proportions & Touch-Hold Information Cards (`game.html`, `js/info_cards.js`)
* **Sleek Proportional Dimensions for Tablets (`@media (max-width: 1280px), (max-height: 850px)`)**:
  - Top Bar: Slimmed to 45px - 52px height (`min-height: 52px; max-height: 54px;`), 1.25rem title font size, and 36px back button.
  - Sidebars: Constrained to 176px - 200px width (`clamp(185px, 18vw, 205px)`), freeing up over 120px of extra width for the center interactive stage.
  - Center Board: Expands to 600px+ width, allowing spacious 50/50 Reactants and Products columns.
  - Beakers & Balance Scale: Beakers sized to 156px - 165px width and 64px - 67px height, resting on a 22px plank in a 110px container, with unclipped tilt headroom.
  - Element Trays & Prof. Beaker: Sized compactly with 36px mini seesaws and 0.92rem titles, guaranteeing up to 3 element cards fit without vertical scrolling.
* **Touch-Hold Interaction Contract (`js/info_cards.js`)**:
  - Distinguishes physical touch events (`pointerType === 'touch'`) from physical desktop mouse movement.
  - Fast taps (< 450ms) add or manipulate molecules without triggering the info card popup, eliminating screen obstruction during rapid gameplay.
  - Deliberate long press (>= 450ms hold without movement > 10px) triggers the chemical info card with subtle haptic vibration (`navigator.vibrate(25)`).
  - Tapping outside or tapping the card instantly dismisses the info popup.
  - Desktop mouse hover and mouse leave continue to function immediately with zero latency.


## 7. Equation Centering, Button Alignment, and Mode Preservation Invariants
* **Symmetric Equation Layout Rule (`#dynamic-sleek-equation`)**:
  - The equation row uses a balanced 3-part layout:
    - Reactants side (`.eq-reactants`): `flex: 1; display: flex; justify-content: flex-end; align-items: center; min-width: 0;` (reactants positioned cleanly on the left, leading up to the center arrow).
    - Center arrow (`.eq-arrow-wrapper`): `flex-shrink: 0; display: flex; justify-content: center; align-items: center; padding: 0 clamp(8px, 1.5vw, 24px);` (locked at the exact 50% midpoint of the container, aligning with the balance scale fulcrum and column divider).
    - Products side (`.eq-products`): `flex: 1; display: flex; justify-content: flex-start; align-items: center; min-width: 0;` (products positioned cleanly on the right, leading away from the center arrow).
  - Red Coefficient Badges (`.sci-coeff`): Always rendered with red `#ef4444` background, 4px/3px solid `#b91c1c` border, and crisp white bold text.
  - Formula tokens use `clamp(1.2rem, 3.8cqw, 2.05rem)` on desktop and `1.25rem` on tablet, guaranteeing punchy legibility without overflow.
* **Element Tray Mini Scale Geometry**:
  - Mini seesaws maintain 68px (tablet) to 85px (desktop) height with `overflow: visible` so stacked atom blocks never get clipped.
  - The vertical dividing dashed line (`border-right: 2px dashed rgba(30, 41, 59, 0.25)`) resides on `.mini-stack-zone.left` at 100% height, clearly dividing reactants and products without overshooting.
* **Prof. Beaker Action Buttons & Chat Bubble Scaling**:
  - Both `.btn-hint` and `.btn-trash` share 4px solid #1e293b borders (3.5px on tablet), matching heights (42px desktop, 38px tablet), matching baseline alignments, and 3D box shadows. Text uses `white-space: nowrap` to prevent multiline wrapping.
  - Chat messages sent by Professor Beaker use `.beaker-bubble-text` scaled down to `0.8rem` on tablets for comfortable reading.
* **Scale / Bar Block Headroom & Status Bar Gap**:
  - Status bar (`.status-bar-shared`) maintains an explicit 18px (tablet) to 22px (desktop) bottom gap before the scale/bar container.
  - `.grid-section.section-scale` and `#section-bar-graph` maintain 140px (tablet) to 195px (desktop) height, with `calcBarHeight()` scaling up to 105px.
  - Tablet equation block (`.section-equation`) is compacted to 46px height with 0.95rem typography, maximizing vertical space for drop containers.
* **In-Place Inter-Level Navigation & Fullscreen Continuity Invariant**:
  - Transitioning between levels (`window.slideTransitionTo()` and `window.transitionTo()`) updates the browser history via `history.pushState(null, '', url)` and triggers `initEngine()` in-place.
  - By avoiding document destruction and page reloads (`window.location.href`), HTML5 Fullscreen is continuously preserved without exiting across all level completions.


## 8. MINOH Balancing Strategy & Interactive Pedagogical Tooling Engine
* **Level Start MINOH Attack Plan (`window.buildLevelMinohPlanCard`)**:
  - Automatically calculates the optimal balancing sequence for any chemical equation based on the MINOH heuristic:
    1. Metals (M) first (e.g. Na, K, Ca, Mg, Al, Zn, Fe, Pb, Cu, Ag).
    2. Polyatomic Ions (I) next if appearing unchanged on both sides (e.g. SO4, NO3, CO3, OH).
    3. Non-Metals (N) next (e.g. C, N, Cl, S, P, Br, I).
    4. Oxygen (O) near the end.
    5. Hydrogen (H) always last.
  - Generates a structured strategy card posted by Prof. Beaker directly following the initial welcome greeting.
* **Interactive Chemistry Hover Classification (`js/info_cards.js`)**:
  - Every element token, tracker drawer card, and molecule compound provides instant MINOH category context (`[M] Metal`, `[I] Polyatomic Ion`, `[N] Non-Metal`, `[O] Oxygen`, `[H] Hydrogen`) and balancing priority.
* **Uncrowded Clue Card Architecture**:
  - Socratic guidance card in Stage 1 features a centered MINOH Rule callout with zero secondary button text collision. Stage 2 provides step solutions with full chemical reasoning.


## 9. Scripted Tutorial Level (TUT0), Home Spotlight Tour, and Sandbox Reaction Builder
* **Dedicated Scripted Tutorial Level (`TUT0`)**:
  - Reaction: Water Synthesis ($2H_2 + O_2 \rightarrow 2H_2O$).
  - Starting Floor: Explicitly initialized with 0 molecules (`window.hardFloorOfOne = false`) so students begin with empty beakers.
  - 13-Step Physical Spotlight Walkthrough (`js/tutorial.js`):
    - Dims the entire viewport using four opaque blocker divs (`#tut-mask-top`, `#tut-mask-bottom`, `#tut-mask-left`, `#tut-mask-right`) framing an unmasked interactive cutout.
    - Systematically guides the student through:
      1. Chemical Equation reading.
      2. Element info cards (hover and tablet hold mechanics).
      3. Adding reactant molecules ($H_2$ and $O_2$).
      4. Mini balance scales and atom tracking.
      5. Removing mistakes using element trash cans.
      6. Adding product molecules ($H_2O$).
      7. Using Professor Beaker and MINOH rules for advice.
      8. Study Room reference notes.
      9. Final balancing to $2H_2 + O_2 \rightarrow 2H_2O$.
      10. Custom victory celebration and direct transition into Form 4 curriculum.
* **Home Page Interactive Spotlight Tour (`startHomeSpotlightTour`)**:
  - Accessible via the top-left Help button on the main menu.
  - Spotlight sequences through Player Name personalization, Game Modes, and an action card offering a direct one-click launchpad into `game.html?level=TUT0`.
* **Universal Chemical Equation Parser & Stoichiometric Solver (`js/element_data.js`)**:
  - `parseChemicalFormula(formula)`: Handles compound parsing with nested parentheses (e.g. $Ca(OH)_2$, $(NH_4)_2SO_4$).
  - `validateAndSolveEquation(equation)`: Validates element existence against `FULL_ELEMENT_DB`, ensures elemental balance, and computes lowest integer stoichiometric coefficients.
  - `buildSandboxLevelData(equation)`: Generates valid level objects on the fly with custom reactant/product inventories.
* **Interactive Sandbox Reaction Builder & Virtual Chemistry Keyboard**:
  - Dual input modalities:
    1. Virtual periodic table keyboard with formula buttons, parenthetical inputs, and reaction arrows.
    2. Physical keyboard typing and pasting directly into `#vk-display` with real-time Enter-key submission and live validation feedback.
  - Launches into sandbox game board with a guaranteed floor of 1 molecule per compound.
* **Snappy Tablet Info Card Touch & Hold Engine**:
  - Long-press delay reduced to 320ms with active `.sic-touch-holding` CSS animation (`scale(0.95)` with brightness dip).
  - Explicit touch dismiss pill (`👆 Tap anywhere to close`) and updated tooltips across all buttons.


## 10. Single-Line Auto-Fit Equation Engine & Instant Audio Assets
* **Proportional Single-Line Auto-Fit Loop (`js/game.js`)**:
  - Eliminates vertical wrapping and 3-row layout clutter on long multi-compound reactions (e.g. Sodium-Water, Hydrocarbon combustion).
  - Enforces `white-space: nowrap !important; flex-wrap: nowrap !important;` on the equation row.
  - `window.autoFitEquation()`: Measures `scrollWidth` against container `clientWidth`. When content exceeds container width, it scales font size, coefficient box dimensions, and padding proportionally down to 0.52x, guaranteeing complete single-line fit on any display.
* **Pre-Rendered In-Memory Instant Audio Delivery (`js/audio_assets.js`)**:
  - Eliminates network fetch latency and silent audio drops on cloud CDNs and mobile Safari/Chrome.
  - Bundles pre-rendered uncompressed 16-bit PCM WAV Data URIs for critical sound effects:
    1. `start`: Rich laboratory power chord (C4, G4, C5, E5 harmonic blend with 420ms exponential decay).
    2. `retro-select`: High-register arcade sparkle arpeggio (F5 -> A5 -> C6 -> E6 glide).
  - Direct HTML5 Audio playback with synchronous fallback to the Web Audio API synthesis engine.
* **Prof. Bunsen Reaction Architect & Keypad Ergonomics**:
  - Replaced ambiguous dual clear buttons with a single unified Backspace button inside the formula display bar and an action Clear button on the numpad.
  - Hover info cards provide clear context regarding Prof. Bunsen's AI chemical synthesis capabilities.
