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
            document.querySelectorAll('.fun-widget, .btn-fullscreen-toggle').forEach(w => {
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

            const fsBtn = document.querySelector('.btn-fullscreen-toggle');
            if (fsBtn) {
                fsBtn.style.zoom = Math.min(Math.max(scale, 0.72), 1.0);
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
