# Stoichbalance V2 Lessons Learned

## 1. Chromium CSS Root Zoom GPU Artifact
* **Symptom**: A semi-transparent dark rectangle covering exactly the fractional zoomed area (e.g., top-left 80% of the screen) while margins remained normal brightness.
* **Root Cause**: `document.documentElement.style.zoom = '0.8'` triggered a known Chromium Skia rasterizer bug where the unzoomed portion of the viewport compositor pass draws a dark tile backdrop over the scaled document.
* **Solution**: Replace CSS `zoom` with a reference canvas scaled via standard CSS transform `scale(s)` inside a flex-centered wrapper.

## 2. Invariant Margin & Side Control Clearance
* **Problem**: When side tabs (`#mode-switcher-sidebar`) and settings FAB (`.fab-container`) were fixed to the viewport while `.good-layout` scaled fluidly, the panels overlapped on small laptops.
* **Solution**: Place all floating controls and the 3-column layout inside a single 1440 × 900 stage with 92px side padding. When the stage scales, the relative clearance (12px to 14px) is preserved across all screens.

## 3. Fixed Canvas vs. Fluid Gutter Architecture on Multi-Column Dashboards
* **Symptom**: Wrapping `game.html` inside a fixed 1440x900 proportional scale canvas made the game look cramped and awkward on 1080p widescreen displays. The center reaction column was crushed while massive blue bars wasted space on either side.
* **Root Cause**: While a fixed 1440x900 canvas works well for single centered modal cards (like `index.html` and `levels.html`), interactive 3-column lab boards require horizontal breathing room for chemical formulas, drag targets, and balance beams.
* **Solution**: Keep `game.html` in the fluid safe-margin architecture using `body { padding: clamp(8px, 1.5vh, 16px) clamp(92px, 6.5vw, 110px); }` and `.good-layout { grid-template-columns: var(--left-w, 280px) minmax(0, 1fr) var(--right-w, 280px); max-width: 1760px; }`. This lets the center reaction column expand to fill widescreen monitors while the dedicated side gutters prevent floating tabs and settings controls from ever overlapping the game board.

## 4. Tablet Landscape Viewport Sizing (Short-Height Viewports)
* **Symptom**: On tablets in landscape (1024x682 fullscreen or 1024x572 with browser UI):
  1. `index.html`: The bottom of the card was cut off, hiding "Start Form 4" and "Sandbox Mode".
  2. `levels.html`: The 2nd row of cards (cards 4, 5, 6) was cut off halfway.
  3. `game.html`: The center column was crushed down to 248px, causing the arrow to collide into molecules and clipping the "PRODUCTS" header.
* **Root Causes**:
  - `index.html`: Desktop vertical margins (`margin-bottom: clamp(3.4rem, 6.8vh, 5.2rem)`) and input heights (74px) exceeded the 572px viewport height.
  - `levels.html`: `.levels-grid` enforced `grid-template-rows: repeat(2, minmax(260px, 1fr))`, demanding 520px of cards alone plus header and footer.
  - `game.html`: Desktop side gutters (92px each = 184px) plus fixed 280px sidebars consumed 744px of the 1024px width, leaving only 248px for the center column.
* **Solutions**:
  - Dedicated landscape media queries (`@media (max-height: 760px) and (min-aspect-ratio: 1/1)` and `@media (max-width: 1200px), (max-height: 760px)`).
  - Flexible sidebars in `game.html`: `var(--left-w, clamp(210px, 21vw, 280px))`, freeing up 140px for the reaction board.
  - Centered flexbox equation container (`#dynamic-sleek-equation`) preventing arrow/molecule collisions.
  - `grid-template-rows: repeat(2, minmax(0, 1fr))` in `levels.html` so all 6 cards scale proportionally.
  - Proportional compact spacing on `index.html` preventing bottom overflow.


## 5. Fullscreen Persistence Across Multi-Page Navigation
* **Symptom**: Clicking fullscreen on `index.html` worked, but navigating to `levels.html` or `game.html` immediately dumped the browser out of fullscreen back to normal windowed mode.
* **Root Cause**: The W3C Fullscreen API specification enforces that whenever `window.location.href` unloads the current document, the browser automatically terminates the active fullscreen session. In addition, when unloading, the browser fires `fullscreenchange` with `active = false`, which inadvertently overwrote `localStorage.setItem('stoich_fullscreen', 'false')`. Calling `requestFullscreen()` during page load on the destination page is also blocked by modern browsers without a direct user gesture.
* **Solution**: Implemented a Seamless Fullscreen Stage (`#stoich-fullscreen-viewport`). When fullscreen mode is active, transitions load the destination page inside a full-viewport, borderless stage frame while keeping the top-level document alive in fullscreen. The address bar stays synchronized via `window.history.pushState()`, and returning home closes the frame seamlessly. Fullscreen stays 100% continuous from start to finish until the user explicitly clicks the fullscreen toggle button or presses Escape.

## 6. One-Glance Level Grid Guarantee (Zero Scrolling on Any Screen)
* **Symptom**: On tablets and compact laptops (1164 × 776, 1366 × 768, 1024 × 768), cards 4, 5, and 6 on `levels.html` were pushed below the fold, forcing vertical scrolling.
* **Root Cause**: `.levels-grid` enforced `grid-template-rows: repeat(2, minmax(260px, 1fr))` along with fixed card body, banner, and header heights. This demanded over 590px of vertical space for the grid alone, exceeding the available container height (470px - 510px).
* **Solution**: Replaced hard minimum row heights with `grid-template-rows: repeat(2, minmax(0, 1fr))` and set `overflow-y: hidden`. Applied coordinated CSS `clamp()` tokens to `.levels-header`, `.btn-back`, `.levels-title`, `.card-top`, `.lvl-num`, `.lvl-diff`, `.card-body`, `.lvl-equation`, and `.status-banner`. All 6 level cards on the active page now fit comfortably within the viewport on all screens from 800 × 600 to 1920 × 1080 with zero scrolling.


## 7. Eliminating Tablet Fullscreen Transition Flicker & Preserving the Circular Iris Wipe
* **Symptom**: In fullscreen mode on tablets, navigating between pages (home -> levels, levels -> game, and back) caused visible flickering, stuttering, and white/background flashes during transitions. Replacing this with a plain opacity fade removed the flicker but lost the circular Iris Wipe animation that users love.
* **Root Causes**:
  1. **Iframe Document Unload**: When navigating inside a subframe via `window.location.href`, the browser destroys the outgoing document immediately. Until the incoming document finishes network retrieval and parsing, the iframe briefly flashes white or renders transparently, exposing the underlying parent page.
  2. **Overlapping Heavy GPU Box-Shadows**: Each individual page ran its own 200vmax animated inset box-shadow (`#iris-wipe-overlay`). Running overlapping, unsynchronized box-shadow rasterizations on mobile GPUs caused severe frame drops and compositor stutter.
* **Solution**:
  1. Built a single master circular Iris Wipe (`#stoich-master-curtain`) hosted exclusively on `window.top` with `z-index: 99999999`.
  2. When navigating, `window.top` smoothly contracts the iris circle inward to solid dark navy `#0f172a` (`box-shadow: inset 0 0 0 130vmax #0f172a` in 0.48s cubic-bezier).
  3. The subframe unloads and loads entirely hidden behind the closed aperture, eliminating all white flashes and layout jumps.
  4. Local iris wipes inside child frames are automatically disabled (`display: none`) to eliminate conflicting transitions and conserve tablet GPU resources.
  5. The master iris expands outward to `0vmax` only after `frame.onload` and layout settlement complete, delivering 100% flicker-free 60 FPS transitions while preserving the beloved camera aperture Iris Wipe.


## 8. Tablet Game Board Scaling & Headroom Preservation
* **Symptom**: On tablets (1164 × 776):
  1. The game board (`.good-layout`) collided with the floating side tabs (`#mode-switcher-sidebar`), the floating help button (`#left-bottom-hud`), and the settings button (`.fab-container`).
  2. The tops of the glass beakers on the balance seesaw were clipped off by the container boundary.
  3. The cards touched the very bottom edge of the tablet display with zero breathing room.
* **Root Causes**:
  - The previous responsive stylesheet used a media query restricted to `@media (max-width: 1024px), (max-height: 760px)`. Because the tablet viewport is 1164 × 776, it was treated as a 1080p desktop, loading full desktop-sized cards and 74px margins.
  - The old tablet media query had forced `.grid-section.section-scale { height: 95px !important; }` while the seesaw plank and beakers required over 120px, shaving off the top 25px of the beakers.
* **Solution**:
  1. Integrated `.good-layout` into `js/autoscale.js` to proportionally scale the entire 3-column lab stage on tablet viewports while preserving widescreen fluid mode on desktop monitors.
  2. Provided dedicated 86px - 115px clearance gutters and proportionally scaled floating HUD buttons, ensuring at least 20px of clear space around the board.
  3. Tuned the fulcrum (28px), plank (28px), and scale section (145px) geometry, guaranteeing ample headroom for the balance beakers even when fully tilted.


## 9. Touch-Hold vs Synthetic Hover Conflict & Proportional Laboratory Layout
* **Symptom**: On tablets and mobile touchscreens, every normal finger tap on a molecule button or header immediately opened a large chemical info card right on top of the stage, blocking the user from seeing the scale or reaction products. At the same time, top bars, sidebars, and balance beakers were oversized and crowded the board.
* **Root Causes**:
  1. Touchscreens emit synthetic `mouseover` events following `touchstart` and `touchend`. Because the tooltip engine listened directly to `mouseover`, every quick gameplay tap triggered the popup as if a mouse hovered over it.
  2. The top bar was fixed to `min-height: 80px`, sidebars spanned up to 280px each, and balance beakers were 220px wide. On a 1164x776 tablet, this compressed the center reaction column down to less than 480px and filled the screen with oversized elements.
* **Solution**:
  1. Implemented pointer discrimination in `js/info_cards.js`. When a touch event is detected (`pointerType === 'touch'`), synthetic `mouseover` events are suppressed.
  2. Implemented a 450ms long-press hold timer. Quick finger taps (< 450ms) add molecules with zero popup disruption. Holding a button stationary for >= 450ms triggers the chemical card cleanly with light haptic feedback.
  3. Tapping anywhere outside the card dismisses it immediately.
  4. Preserved immediate hover and leave responsiveness for desktop mouse users.
  5. Scaled down top bar (45px - 52px), sidebars (176px - 200px), and balance scale (156px beakers, 110px container) in `@media (max-width: 1280px), (max-height: 850px)`. This expanded the center reaction board from 486px to 609px (+123px width), allowing up to 3 element trays to fit in a single glance without scrolling.


## 10. Dynamic Equation Layout Rule, Tactile Button Integrity, Element Tray Stack Headroom, and Gap Geometry
* **Symptom**:
  1. The chemical equation arrow was displaced or terms were pushed 800px apart to opposite screen edges when using full-width `flex-start` and `flex-end`.
  2. In tablet view, the chemical equation text was shrunken too small (0.9rem), and coefficient badges turned black when count was zero.
  3. Action buttons in Prof. Beaker lost their proper height matching and red trash styling.
  4. The dotted vertical separator line in the element tray mini scale vanished after an aggressive CSS rule (`border-right: none`), and stacked atom blocks were chopped off by an artificial 32px height constraint with `overflow: hidden`.
  5. The gap between the status bar and the balance scale/bar view was cramped, causing beakers to touch the status bar when tilting.
  6. Message content sent by Professor Beaker was oversized on tablet screens.
  7. Switching from Bar View back to Scale View failed to re-sync the active scale simulation.
* **Root Causes**:
  - Reactants and products flying apart occurred when using extreme alignments without grouping against the arrow.
  - Setting `el.style.background = count === 0 ? "#1e293b" : "#ef4444"` in JavaScript caused coefficient boxes to turn into black bars instead of red badges.
  - Missing base `.btn-trash` CSS rules caused the trash button to collapse in size on tablet.
  - `border-right: none !important` and `height: 32px !important; overflow: hidden !important;` on `.mini-seesaw` removed the dividing line and clipped stacked atom blocks.
  - `window.switchViewMode` did not re-invoke `window.updateSimulation()` when switching back to `"scale"`.
* **Solution**:
  1. Enforced the centered arrow invariant: `.eq-reactants` has `flex: 1; justify-content: flex-end`, `.eq-products` has `flex: 1; justify-content: flex-start`, and `.eq-arrow-wrapper` stays locked at the 50% midpoint.
  2. Fixed `.sci-coeff` to always maintain `#ef4444` red background with `#b91c1c` border.
  3. Increased equation sizing to `1.25rem` on tablet and `clamp(1.2rem, 3.8cqw, 2.05rem)` on desktop.
  4. Restored `.btn-hint-clean` (gold/yellow `#facc15`, 4px/2.5px border, lightbulb SVG) and `.btn-trash` (red `#ef4444`, 4px/2.5px border, white trash SVG) with identical heights and tactile click transforms.
  5. Restored the dashed dividing line on `.mini-stack-zone.left` (`border-right: 2px dashed rgba(0, 0, 0, 0.2)`), increased `.mini-seesaw` height to 64px on tablet (90px on desktop), with `overflow: visible` for stacked atom blocks.
  6. Increased the gap below the status bar to 16px, and increased `.section-scale` / `#section-bar-graph` height to 140px on tablet so tilting beakers never collide with the status bar.
  7. Added `.beaker-bubble-text` and `.beaker-sender-tag` classes, reducing font size to `0.84rem` on tablet for clean reading.
  8. Added `if (typeof window.updateSimulation === "function") window.updateSimulation();` in `switchViewMode("scale")` so the scale immediately re-syncs when switching back from Bar View.



## 11. Scale vs Bar Container Footprint Equalization, Responsive Action Buttons, and Bottom Edge Shadow Headroom
* **Symptom**:
  1. Switching between Scale View and Bar View caused the chemical equation and lower reaction board to jump vertically. On desktop, the Bar Graph container had an inline height of 195px while the Scale was 145px, and JavaScript dynamically stripped the status bar bottom margin upon switching to Bar mode.
  2. On tablet view, the Hint button text ("Hint please!") was overflowing the button boundary, pushing the lightbulb SVG icon off to the left and overlapping the trash button. When sidebars narrowed or shrank, the text was clipped.
  3. On both desktop and tablet views, the 3D drop-shadow and rounded bottom corners of the Hint and Trash buttons were cut off by the bottom border of the right sidebar card.
* **Root Causes**:
  - The status bar bottom margin was set inline (`margin-bottom: 85px`) and removed at runtime by `statusBar.style.removeProperty("margin-bottom")` in `window.switchViewMode()`.
  - `#section-bar-graph` and `.section-scale` lacked equalized container heights and margins across both CSS and markup.
  - "Hint please!" was 12 characters long, which in Nunito Bold 0.8rem exceeded the available ~90px width inside the narrow tablet sidebar. A subsequent non-scoped desktop rule at line 1391 had overridden the tablet media query rule.
  - `.block-right` and `.sidebar-content` had insufficient bottom padding and `overflow: hidden`, causing the 4px 3D box-shadow of `.btn-hint-clean` and `.btn-trash` to collide with the card's 18px rounded bottom corners.
* **Solution**:
  1. Equalized container geometry: `.section-scale` and `#section-bar-graph` now share the exact same height (`160px` desktop, `140px` tablet) and margin-bottom (`14px` desktop, `10px` tablet). Removed runtime mutation of `margin-bottom` in `window.switchViewMode()`.
  2. Made the Hint button text responsive: `<span class="hint-text-desktop">Hint please!</span><span class="hint-text-tablet">Hint</span>`, showing "Hint please!" on desktop and "Hint" on tablet/compact screens with `text-overflow: ellipsis; overflow: hidden;`.
  3. Added bottom shadow headroom: Gave `.good-block.block-right` explicit bottom padding (`20px` desktop, `16px` tablet), set `margin-bottom: 6px; padding-bottom: 2px;` on `.beaker-actions`, and enabled `overflow: visible` so 3D button shadows remain fully visible.


## 12. Equation Alignment Invariant and Complete Action Button Visibility
* **Symptom**:
  1. The dynamic equation had reactants aligned to the right (`justify-content: flex-end`) and products aligned to the left (`justify-content: flex-start`), clustering around the arrow instead of left-aligning reactants and right-aligning products.
  2. The Hint button on tablet had been shortened to "Hint" as an earlier workaround to avoid overflow.
* **Root Causes**:
  - `initEngine()` in `js/game.js` set `justify-content: flex-end` for reactants and `justify-content: flex-start` for products.
  - The tablet right sidebar was clamped to 178px-192px with 12px padding, leaving insufficient width for the 12-character "Hint please!" text alongside the 18px SVG and trash button.
* **Solution**:
  1. Enforced the equation alignment rule across both `js/game.js` and `game.html`: `.eq-reactants` uses `justify-content: flex-start !important;` (left-aligned), `.eq-products` uses `justify-content: flex-end !important;` (right-aligned), and `.eq-arrow-wrapper` is centered at the exact 50% midpoint.
  2. Adjusted tablet equation font scaling to `1.05rem` with `gap: 6px` to prevent long molecular formulas from crowding the center arrow.
  3. Increased tablet sidebar clamp to `clamp(198px, 19vw, 216px)`, giving both sidebars comfortable breathing room. Standardized the button text to `"Hint please!"` on all devices with `font-size: 0.78rem` on tablet, ensuring full visibility without truncation or clipping.


## 13. Tablet Collapsed Parity, Equation Compaction, Laptop Scale Expansion, and In-Place Fullscreen Persistence
* **Symptoms**:
  1. On tablet view, collapsing the element tray or Prof. Beaker left an awkward squished button with uneven padding, small 18px icons, and flat 3px shadows, unlike the polished 60x60 square tiles in laptop view.
  2. The block containing the equation in tablet view was too tall (90px), taking up excessive vertical room from the drop buckets below.
  3. The scale and bar graph block on laptop view was relatively short (160px), constraining vertical bar growth.
  4. In both laptop and tablet views, clicking "NEXT LEVEL" on the victory modal caused the browser to immediately exit fullscreen mode.
* **Root Causes**:
  - Tablet CSS rules for `.good-block` (`padding: 10px 12px !important;`) and `.block-left .rect-btn` (`padding: 5px 8px !important; border-radius: 12px !important; svg width: 18px !important;`) overrode the desktop `.good-block.collapsed` rules.
  - `.section-equation` had `height: 90px;` in desktop CSS and was not overridden with a reduced height in the tablet media query.
  - The scale and bar graph container had a hardcoded `height: 160px;` with `calcBarHeight()` capped at 82px.
  - The victory modal's "NEXT LEVEL" button triggered `window.slideTransitionTo()`, which executed `window.location.href = url`. Browsers automatically terminate HTML5 Fullscreen upon document navigation or reload.
* **Solutions**:
  1. **Tablet Collapsed Parity**: Added scoped rules `body .good-layout .good-block.collapsed` with `padding: 0 !important;` and `.rect-btn` forced to a centered `60px x 60px` tile with `border-radius: 16px !important; box-shadow: 0 6px 0 var(--dark-border) !important;` and 32px centered SVG icon, matching laptop view exactly.
  2. **Reduced Tablet Equation Height**: Set `.grid-section.section-equation` on tablet to `height: 46px !important; min-height: 44px !important; padding: 4px 10px !important;` with compact `0.95rem` typography, reducing height by 49% with zero overflow.
  3. **Increased Laptop Scale & Bar Height**: Increased `.section-scale` and `#section-bar-graph` height from `160px` to `195px` (`margin-bottom: 16px;`), and updated `calcBarHeight()` to allow reactant and product bars to grow up to 105px.
  4. **In-Place Fullscreen Persistence**: Re-architected `window.slideTransitionTo()` and `window.transitionTo()` for inter-level navigation: when navigating between levels within `game.html`, the engine pushes the new URL via `history.pushState(null, '', url)` and calls `initEngine()` directly in-place. The document stays alive in memory, keeping HTML5 Fullscreen 100% continuous and uninterrupted.
