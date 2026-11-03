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
