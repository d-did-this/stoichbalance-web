// Persistent Fullscreen and Flicker-Free Seamless Stage Engine for Stoichbalance
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

        // Sync Fullscreen Nudge Bubble Visibility
        const nudge = document.getElementById('fullscreen-nudge-bubble');
        if (nudge) {
            if (isFs) {
                nudge.classList.add('is-hidden');
                nudge.style.display = 'none';
            } else {
                if (typeof window.updateFullscreenNudgeState === 'function') {
                    window.updateFullscreenNudgeState();
                } else {
                    nudge.classList.remove('is-hidden');
                    nudge.style.display = 'flex';
                }
            }
        }

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

    // =========================================================================
    // GPU-ACCELERATED FLICKER-FREE MASTER IRIS WIPE (TOP WINDOW ONLY)
    // =========================================================================
    function getOrCreateMasterCurtain() {
        let curtain = document.getElementById('stoich-master-curtain');
        if (!curtain) {
            curtain = document.getElementById('iris-wipe-overlay');
            if (curtain) {
                curtain.id = 'stoich-master-curtain';
            } else {
                curtain = document.createElement('div');
                curtain.id = 'stoich-master-curtain';
                document.body.appendChild(curtain);
            }
        }
        curtain.style.position = 'fixed';
        curtain.style.top = '50%';
        curtain.style.left = '50%';
        curtain.style.transform = 'translate(-50%, -50%)';
        curtain.style.width = '240vmax';
        curtain.style.height = '240vmax';
        curtain.style.borderRadius = '50%';
        curtain.style.zIndex = '99999999';
        curtain.style.pointerEvents = 'none';
        curtain.style.transition = 'box-shadow 0.48s cubic-bezier(0.645, 0.045, 0.355, 1)';
        curtain.style.webkitTransition = '-webkit-box-shadow 0.48s cubic-bezier(0.645, 0.045, 0.355, 1), box-shadow 0.48s cubic-bezier(0.645, 0.045, 0.355, 1)';
        curtain.style.willChange = 'box-shadow';
        return curtain;
    }

    function showCurtain(cb) {
        const curtain = getOrCreateMasterCurtain();
        curtain.style.pointerEvents = 'all';
        void curtain.offsetWidth; // Force layout reflow
        curtain.style.boxShadow = 'inset 0 0 0 130vmax #0f172a'; // Iris circle closes inward to center
        curtain.classList.remove('open');
        if (typeof cb === 'function') {
            setTimeout(cb, 480);
        }
    }

    function hideCurtain(delay = 60) {
        setTimeout(() => {
            const curtain = getOrCreateMasterCurtain();
            curtain.style.boxShadow = 'inset 0 0 0 0vmax #0f172a'; // Iris circle opens outward from center
            curtain.classList.add('open');
            setTimeout(() => {
                curtain.style.pointerEvents = 'none';
            }, 480);
        }, delay);
    }

    // Top window unified flicker-free stage navigator
    window.seamlessNavigate = function(url) {
        if (!isTopWindow()) {
            try {
                window.top.seamlessNavigate(url);
            } catch (e) {
                window.top.postMessage({ type: 'STOICH_SEAMLESS_NAVIGATE', url: url }, '*');
            }
            return;
        }

        showCurtain(() => {
            // Returning to home (index.html)
            if (url === 'index.html' || url.startsWith('index.html')) {
                const frame = document.getElementById('stoich-fullscreen-viewport');
                if (frame) {
                    frame.style.display = 'none';
                    frame.src = 'about:blank';
                }
                try {
                    window.history.pushState(null, '', 'index.html');
                } catch (e) {}

                if (typeof window.autoScaleStage === 'function') {
                    window.autoScaleStage();
                }

                requestAnimationFrame(() => {
                    hideCurtain(60);
                });
                return;
            }

            // Navigating to subpage (levels.html or game.html)
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

            frame.style.display = 'block';

            // One-time load handler to unveil only when DOM and layout are ready
            frame.onload = function() {
                try {
                    window.history.pushState({ stoichUrl: url }, '', url);
                } catch (e) {}

                requestAnimationFrame(() => {
                    hideCurtain(80);
                });
            };

            frame.src = url;
        });
    };

    // Cross-window message listener
    window.addEventListener('message', (ev) => {
        if (!ev.data) return;
        if (ev.data.type === 'STOICH_FS_STATE') {
            updateButtonUI(ev.data.isFs);
        } else if (ev.data.type === 'STOICH_FS_REQUEST') {
            if (isTopWindow()) requestFullscreenInternal();
        } else if (ev.data.type === 'STOICH_FS_EXIT') {
            if (isTopWindow()) exitFullscreenInternal();
        } else if (ev.data.type === 'STOICH_SEAMLESS_NAVIGATE') {
            if (isTopWindow()) window.seamlessNavigate(ev.data.url);
        }
    });

    // Unified Transition Handler
    window.transitionTo = function(url) {
        const wantsFs = localStorage.getItem(FS_KEY) === 'true' || isFullscreenActive();

        // If inside subframe, delegate navigation to parent stage
        if (!isTopWindow()) {
            try {
                window.top.seamlessNavigate(url);
                return;
            } catch (e) {
                window.top.postMessage({ type: 'STOICH_SEAMLESS_NAVIGATE', url: url }, '*');
                return;
            }
        }

        // If top window in fullscreen mode, use seamless stage
        if (wantsFs) {
            window.seamlessNavigate(url);
            return;
        }

        // Normal window fallback navigation
        const overlay = document.getElementById('iris-wipe-overlay');
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
                    window.seamlessNavigate(e.state.stoichUrl);
                } else {
                    window.seamlessNavigate('index.html');
                }
            }
        }
    });

    // On subframes, disable local iris wipe to prevent double transitions and GPU thrashing
    function initFrameState() {
        updateButtonUI(isFullscreenActive());
        if (!isTopWindow()) {
            const localOverlay = document.getElementById('iris-wipe-overlay');
            if (localOverlay) {
                localOverlay.style.display = 'none';
            }
        } else {
            // On top window, ensure master iris is initialized in open state
            const curtain = getOrCreateMasterCurtain();
            if (curtain) {
                curtain.style.boxShadow = 'inset 0 0 0 0vmax #0f172a';
                curtain.classList.add('open');
                curtain.style.pointerEvents = 'none';
            }
        }
    }

    document.addEventListener('DOMContentLoaded', initFrameState);
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initFrameState();
    }

    // =========================================================================
    // FULLSCREEN NUDGE ROTATOR ENGINE (INDEX.HTML ONLY)
    // =========================================================================
    (function initFullscreenNudgeRotator() {
        const phrases = [
            "✨ Hey, click me!",
            "🖥️ Fullscreen?",
            "😎 I bet you will like this!",
            "👉 Come on!",
            "🚀 Just try!",
            "🔍 Much better view!",
            "🧪 Expand the lab!",
            "👀 Try full size!",
            "🎉 Click for full view!",
            "⭐ You will love this!",
            "✨ Fullscreen feels great!",
            "👆 Go on, tap here!"
        ];

        let currentIndex = 0;
        let rotationTimer = null;

        function checkFs() {
            try {
                const doc = (window === window.top) ? document : window.top.document;
                return !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
            } catch(e) {
                return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
            }
        }

        function shouldHideNudge() {
            if (checkFs()) return true;
            const tour = document.getElementById('home-spotlight-tour');
            if (tour && window.getComputedStyle(tour).display !== 'none') return true;
            const aiModal = document.getElementById('sandbox-ai-modal');
            if (aiModal && window.getComputedStyle(aiModal).display !== 'none') return true;
            const ptModal = document.getElementById('periodic-table-modal');
            if (ptModal && window.getComputedStyle(ptModal).display !== 'none') return true;
            const tgModal = document.getElementById('teacher-guide-modal');
            if (tgModal && window.getComputedStyle(tgModal).display !== 'none') return true;
            return false;
        }

        function updateNudgeState() {
            const bubble = document.getElementById('fullscreen-nudge-bubble');
            if (!bubble) return;
            if (shouldHideNudge()) {
                bubble.classList.add('is-hidden');
                bubble.style.display = 'none';
            } else {
                bubble.classList.remove('is-hidden');
                bubble.style.display = 'flex';
            }
        }
        window.updateFullscreenNudgeState = updateNudgeState;

        function cyclePhrase() {
            if (shouldHideNudge()) return;
            const bubble = document.getElementById('fullscreen-nudge-bubble');
            if (!bubble || bubble.classList.contains('is-hidden') || window.getComputedStyle(bubble).display === 'none') return;
            const textEl = document.getElementById('fs-nudge-text');
            if (!textEl) return;

            currentIndex = (currentIndex + 1) % phrases.length;
            const container = textEl.parentElement;
            if (container) {
                container.classList.remove('pop-in');
                void container.offsetWidth; // trigger reflow
                textEl.innerText = phrases[currentIndex];
                container.classList.add('pop-in');
            }
        }

        function start() {
            updateNudgeState();
            if (!rotationTimer) {
                rotationTimer = setInterval(cyclePhrase, 2600);
            }

            // Observe modal visibility changes so nudge updates instantly
            try {
                const observer = new MutationObserver(() => {
                    updateNudgeState();
                });
                ['sandbox-ai-modal', 'periodic-table-modal', 'teacher-guide-modal', 'home-spotlight-tour'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        observer.observe(el, { attributes: true, attributeFilter: ['style', 'class'] });
                    }
                });
            } catch(e) {}
        }

        ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(ev => {
            document.addEventListener(ev, updateNudgeState);
        });

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', start);
        } else {
            start();
        }
    })();

})();
