// Persistent Fullscreen and Seamless Stage Engine for Stoichbalance
(function() {
    const FS_KEY = 'stoich_fullscreen';
    let isNavigating = false;

    const ICON_ENTER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;display:block;"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
    const ICON_EXIT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;display:block;"><path d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M14 4v6m0 0h6m-6 0L21 3M10 4v6m0 0H4m6 0L3 3"/></svg>';

    function isTopWindow() {
        return window === window.top;
    }

    function isFullscreenActive() {
        const doc = isTopWindow() ? document : window.top.document;
        return !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
    }

    function updateButtonUI(isFs) {
        const btns = document.querySelectorAll('.btn-fullscreen-toggle');
        btns.forEach(btn => {
            btn.innerHTML = isFs ? ICON_EXIT : ICON_ENTER;
            btn.title = isFs ? 'Exit Fullscreen' : 'Enter Fullscreen';
            btn.setAttribute('aria-label', btn.title);
        });

        // If top window has an active iframe, notify it too
        if (isTopWindow()) {
            const frame = document.getElementById('stoich-fullscreen-viewport');
            if (frame && frame.contentWindow) {
                try {
                    frame.contentWindow.postMessage({ type: 'STOICH_FS_STATE', isFs: isFs }, '*');
                } catch (e) {}
            }
        }
    }

    function requestFullscreenInternal() {
        if (!isTopWindow()) {
            try {
                return window.top.toggleFullscreen();
            } catch (e) {
                window.top.postMessage({ type: 'STOICH_FS_REQUEST' }, '*');
                return Promise.resolve();
            }
        }

        const el = document.documentElement;
        const rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (rfs) {
            return rfs.call(el).then(() => {
                localStorage.setItem(FS_KEY, 'true');
                updateButtonUI(true);
            }).catch(err => {
                console.log('Fullscreen request error:', err);
            });
        }
        return Promise.reject(new Error('Fullscreen not supported'));
    }

    function exitFullscreenInternal() {
        if (!isTopWindow()) {
            try {
                return window.top.toggleFullscreen();
            } catch (e) {
                window.top.postMessage({ type: 'STOICH_FS_EXIT' }, '*');
                return Promise.resolve();
            }
        }

        const doc = document;
        const efs = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;
        if (efs) {
            return efs.call(doc).then(() => {
                localStorage.setItem(FS_KEY, 'false');
                updateButtonUI(false);
            }).catch(err => {
                console.log('Exit fullscreen error:', err);
            });
        }
        return Promise.reject(new Error('Exit fullscreen not supported'));
    }

    window.toggleFullscreen = function() {
        if (typeof window.playSound === 'function') window.playSound('tactile');
        if (!isFullscreenActive()) {
            requestFullscreenInternal();
        } else {
            exitFullscreenInternal();
        }
    };

    // Prevent clearing preference during unload
    window.addEventListener('beforeunload', () => { isNavigating = true; });
    window.addEventListener('pagehide', () => { isNavigating = true; });

    // Listen for state changes (e.g. Esc key or gesture exit)
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(ev => {
        document.addEventListener(ev, () => {
            if (isNavigating) return;
            const active = isFullscreenActive();
            localStorage.setItem(FS_KEY, active ? 'true' : 'false');
            updateButtonUI(active);
        });
    });

    // Listen for messages between parent shell and child frames
    window.addEventListener('message', (ev) => {
        if (!ev.data) return;
        if (ev.data.type === 'STOICH_FS_STATE') {
            updateButtonUI(ev.data.isFs);
        } else if (ev.data.type === 'STOICH_FS_REQUEST') {
            if (isTopWindow()) requestFullscreenInternal();
        } else if (ev.data.type === 'STOICH_FS_EXIT') {
            if (isTopWindow()) exitFullscreenInternal();
        } else if (ev.data.type === 'STOICH_NAVIGATE') {
            if (isTopWindow() && typeof window.transitionTo === 'function') {
                window.transitionTo(ev.data.url);
            }
        }
    });

    // Top window helper to close seamless stage and return home
    window.returnToHome = function() {
        const overlay = document.getElementById('iris-wipe-overlay');
        const frame = document.getElementById('stoich-fullscreen-viewport');
        if (overlay) overlay.classList.remove('open');

        setTimeout(() => {
            if (frame) {
                frame.style.display = 'none';
                frame.src = 'about:blank';
            }
            try {
                window.history.pushState(null, '', 'index.html');
            } catch (e) {}

            setTimeout(() => {
                if (overlay) overlay.classList.add('open');
                if (typeof window.autoScaleStage === 'function') window.autoScaleStage();
            }, 100);
        }, 500);
    };

    window.updateViewportUrl = function(newUrl) {
        if (isTopWindow()) {
            try {
                window.history.pushState({ stoichUrl: newUrl }, '', newUrl);
            } catch (e) {}
        }
    };

    // Unified Transition Handler
    window.transitionTo = function(url) {
        const overlay = document.getElementById('iris-wipe-overlay');
        const wantsFs = localStorage.getItem(FS_KEY) === 'true' || isFullscreenActive();

        // Subframe handling
        if (!isTopWindow()) {
            if (url === 'index.html' || url.startsWith('index.html')) {
                try {
                    window.top.returnToHome();
                    return;
                } catch (e) {
                    window.top.postMessage({ type: 'STOICH_NAVIGATE', url: 'index.html' }, '*');
                    return;
                }
            }

            // Normal subframe navigation keeps parent document fullscreen intact
            if (overlay) {
                overlay.classList.remove('open');
                setTimeout(() => {
                    try { window.top.updateViewportUrl(url); } catch (e) {}
                    window.location.href = url;
                }, 550);
            } else {
                try { window.top.updateViewportUrl(url); } catch (e) {}
                window.location.href = url;
            }
            return;
        }

        // Top window handling
        if (url === 'index.html' || url.startsWith('index.html')) {
            const frame = document.getElementById('stoich-fullscreen-viewport');
            if (frame && frame.style.display !== 'none') {
                window.returnToHome();
                return;
            }
        }

        // If fullscreen is active or requested, use Seamless Fullscreen Stage to preserve fullscreen
        if (wantsFs && url !== 'index.html') {
            if (overlay) overlay.classList.remove('open');

            setTimeout(() => {
                let frame = document.getElementById('stoich-fullscreen-viewport');
                if (!frame) {
                    frame = document.createElement('iframe');
                    frame.id = 'stoich-fullscreen-viewport';
                    frame.setAttribute('allow', 'fullscreen; autoplay');
                    frame.style.position = 'fixed';
                    frame.style.top = '0';
                    frame.style.left = '0';
                    frame.style.width = '100vw';
                    frame.style.height = '100vh';
                    frame.style.border = 'none';
                    frame.style.zIndex = '999990';
                    frame.style.background = '#0f172a';
                    document.body.appendChild(frame);
                }

                frame.src = url;
                frame.style.display = 'block';
                try {
                    window.history.pushState({ stoichUrl: url }, '', url);
                } catch (e) {}

                frame.onload = function() {
                    setTimeout(() => {
                        if (overlay) overlay.classList.add('open');
                    }, 80);
                };
            }, overlay ? 500 : 0);
            return;
        }

        // Fallback: standard navigation when not in fullscreen mode
        if (overlay) {
            overlay.classList.remove('open');
            setTimeout(() => { window.location.href = url; }, 550);
        } else {
            window.location.href = url;
        }
    };

    // Auto-restore fullscreen on first gesture if preference was stored and page was hard-reloaded
    function restoreOnGesture() {
        if (localStorage.getItem(FS_KEY) === 'true' && !isFullscreenActive()) {
            requestFullscreenInternal();
        }
    }
    ['pointerdown', 'touchstart', 'click', 'keydown'].forEach(ev => {
        window.addEventListener(ev, restoreOnGesture, { capture: true, passive: true });
    });

    // Browser back/forward navigation
    window.addEventListener('popstate', (e) => {
        if (isTopWindow()) {
            const frame = document.getElementById('stoich-fullscreen-viewport');
            if (frame && frame.style.display !== 'none') {
                if (e.state && e.state.stoichUrl && !e.state.stoichUrl.startsWith('index.html')) {
                    frame.src = e.state.stoichUrl;
                } else {
                    window.returnToHome();
                }
            }
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        updateButtonUI(isFullscreenActive());
    });

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        updateButtonUI(isFullscreenActive());
    }
})();
