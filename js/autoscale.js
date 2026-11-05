// Universal Proportional Viewport Scaler for Stoichbalance
(function() {
    function fitStage() {
        // In portrait mode (phones), let standard responsive flow handle it
        if (window.innerWidth < window.innerHeight) {
            const container = document.querySelector('.main-container');
            if (container) {
                container.style.zoom = '';
            }
            const levelsContainer = document.querySelector('.levels-container');
            if (levelsContainer) {
                levelsContainer.style.zoom = '';
                levelsContainer.style.width = '';
                levelsContainer.style.height = '';
                levelsContainer.style.maxHeight = '';
            }
            return;
        }

        // In landscape mode (tablets, laptops, desktops), auto-scale stage to perfectly fit
        const container = document.querySelector('.main-container');
        if (container) {
            // Reserve 90px - 130px invisible border gutters on left and right for floating widgets
            const gutter = Math.min(Math.max(window.innerWidth * 0.09, 90), 130);
            const availW = window.innerWidth - (gutter * 2) - 20;
            const availH = window.innerHeight - 36;

            const baseW = 1140;
            const baseH = 700;

            const scale = Math.min(availW / baseW, availH / baseH, 1.0);
            container.style.zoom = scale;

            // Scale floating corner widgets proportionally
            const widgetScale = Math.min(Math.max(scale, 0.72), 1.0);
            document.querySelectorAll('.fun-widget, .btn-fullscreen-toggle, #fullscreen-nudge-bubble, .btn-lang-toggle').forEach(w => {
                w.style.zoom = widgetScale;
            });
        }

        // Auto-scale Level Selection stage for tablets and compact landscape screens
        const levelsContainer = document.querySelector('.levels-container');
        if (levelsContainer) {
            const marginX = 24;
            const marginY = 24;
            const availW = window.innerWidth - marginX;
            const availH = window.innerHeight - marginY;

            const baseW = 1180;
            const baseH = 720;

            const scale = Math.min(availW / baseW, availH / baseH, 1.0);
            levelsContainer.style.zoom = scale;
            if (scale < 1.0) {
                levelsContainer.style.width = baseW + 'px';
                levelsContainer.style.height = baseH + 'px';
                levelsContainer.style.maxHeight = 'none';
            } else {
                levelsContainer.style.width = '';
                levelsContainer.style.height = '';
                levelsContainer.style.maxHeight = '';
            }

            const cornerBtns = document.querySelectorAll('.btn-fullscreen-toggle, .btn-lang-toggle');
            cornerBtns.forEach(btn => {
                btn.style.zoom = Math.min(Math.max(scale, 0.72), 1.0);
            });
        }

        // Auto-scale Game Dashboard stage for tablets and compact landscape screens
        const gameLayout = document.querySelector('.good-layout');
        if (gameLayout) {
            // In phone portrait mode, let vertical flow handle it
            if (window.innerWidth < window.innerHeight) {
                gameLayout.style.zoom = '';
                gameLayout.style.width = '';
                gameLayout.style.height = '';
                document.body.style.display = '';
                document.body.style.padding = '';
                return;
            }

            // Clearance gutters for peripheral floating widgets
            // Left HUD: Mode switcher (width 65px at left 15px -> ends at 80px)
            // Right HUD: Settings FAB (width 56px at right 18px -> starts at 100vw - 74px)
            // Left Bottom HUD: Help button (width 56px at left 18px -> ends at 74px)
            const minGutter = 86;
            const gutter = Math.min(Math.max(window.innerWidth * 0.08, minGutter), 115);
            const availW = window.innerWidth - (gutter * 2);
            const availH = window.innerHeight - 24;

            // Desktop widescreen fluid expansion (e.g. 1080p, 1440p)
            if (window.innerWidth >= 1440 && window.innerHeight >= 860) {
                document.body.style.padding = 'clamp(8px, 1.5vh, 16px) clamp(92px, 6.5vw, 110px)';
                document.body.style.display = '';
                document.body.style.alignItems = '';
                document.body.style.justifyContent = '';
                gameLayout.style.zoom = '';
                gameLayout.style.width = '';
                gameLayout.style.height = '';
                const leftSidebar = document.getElementById('mode-switcher-sidebar');
                if (leftSidebar) {
                    leftSidebar.style.transform = 'translateY(-50%)';
                    leftSidebar.style.left = '15px';
                }
                const leftBottom = document.getElementById('left-bottom-hud');
                if (leftBottom) {
                    leftBottom.style.transform = '';
                    leftBottom.style.left = '24px';
                    leftBottom.style.bottom = '24px';
                }
                const rightFab = document.querySelector('.fab-container');
                if (rightFab) {
                    rightFab.style.transform = '';
                    rightFab.style.right = '24px';
                    rightFab.style.bottom = '24px';
                }
            } else {
                // Tablet and compact landscape screens: proportional stage autoscale
                const baseW = 1200;
                const baseH = 740;
                const scale = Math.min(availW / baseW, availH / baseH, 1.0);

                document.body.style.padding = '12px ' + gutter + 'px';
                document.body.style.display = 'flex';
                document.body.style.alignItems = 'center';
                document.body.style.justifyContent = 'center';
                document.body.style.boxSizing = 'border-box';

                gameLayout.style.zoom = scale;
                gameLayout.style.width = Math.round(availW / scale) + 'px';
                gameLayout.style.height = Math.round(availH / scale) + 'px';

                // Scale peripheral floating HUD controls proportionally
                const widgetScale = Math.min(Math.max(scale, 0.78), 1.0);
                const leftSidebar = document.getElementById('mode-switcher-sidebar');
                if (leftSidebar) {
                    leftSidebar.style.transform = `translateY(-50%) scale(${widgetScale})`;
                    leftSidebar.style.transformOrigin = 'left center';
                    leftSidebar.style.left = '14px';
                }
                const leftBottom = document.getElementById('left-bottom-hud');
                if (leftBottom) {
                    leftBottom.style.transform = `scale(${widgetScale})`;
                    leftBottom.style.transformOrigin = 'bottom left';
                    leftBottom.style.left = '16px';
                    leftBottom.style.bottom = '16px';
                }
                const rightFab = document.querySelector('.fab-container');
                if (rightFab) {
                    rightFab.style.transform = `scale(${widgetScale})`;
                    rightFab.style.transformOrigin = 'bottom right';
                    rightFab.style.right = '16px';
                    rightFab.style.bottom = '16px';
                }
            }
        }

        // Auto-scale Periodic Table modal to fit any landscape screen
        const ptWrapper = document.querySelector('.pt-modal-wrapper');
        if (ptWrapper) {
            const availW = window.innerWidth - 24;
            const availH = window.innerHeight - 24;
            const baseW = 1260;
            const baseH = 820;
            const ptScale = Math.min(availW / baseW, availH / baseH, 1.0);
            ptWrapper.style.zoom = ptScale;
        }
    }

    window.autoScaleStage = fitStage;

    window.addEventListener('resize', fitStage);
    window.addEventListener('orientationchange', fitStage);
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(ev => {
        document.addEventListener(ev, () => {
            setTimeout(fitStage, 80);
            setTimeout(fitStage, 250);
        });
    });

    document.addEventListener('DOMContentLoaded', fitStage);
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        fitStage();
    }
})();
