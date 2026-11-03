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
