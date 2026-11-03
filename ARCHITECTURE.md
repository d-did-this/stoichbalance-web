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
