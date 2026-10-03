// Audio Engine
let audioCtx = null;
window.addEventListener('click', () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}, {once:true});

function playSoftClick() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
}

function playSuccessSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime); 
    osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1); 
    osc.frequency.setValueAtTime(800, audioCtx.currentTime + 0.2); 
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
}


// ==========================================
// PUZZLE LOGIC & STATE
// ==========================================
// Mock State for Water Synthesis: _ H2 + _ O2 -> _ H2O
const gameState = {
    r1: { coeff: 1, formula: { H: 2 } },
    r2: { coeff: 1, formula: { O: 2 } },
    p1: { coeff: 1, formula: { H: 2, O: 1 } }
};

function changeCoeff(termId, delta) {
    playSoftClick();
    
    let newVal = gameState[termId].coeff + delta;
    if (newVal < 0) newVal = 0;
    if (newVal > 9) newVal = 9;
    
    // In Simple View, minimum is 1. In Pro View, minimum is 0 for drag-drop mimic.
    // Let's use 0 as the absolute minimum.
    gameState[termId].coeff = newVal;
    
    // Animate Simple View DOM
    const valEl = document.getElementById(`val-${termId}`);
    if (valEl) {
        valEl.innerText = newVal === 0 ? 1 : newVal; // Simple view defaults visual to 1
        valEl.style.transform = 'scale(1.5)';
        setTimeout(() => { valEl.style.transform = 'scale(1)'; }, 100);
    }
    
    // Animate Advanced View DOM
    const advValEl = document.getElementById(`adv-coeff-${termId}`);
    if(advValEl) {
        advValEl.setAttribute('data-html-tooltip', 'You added <strong>' + newVal + '</strong> of these!');
    }
    if (advValEl) {
        advValEl.innerText = newVal;
        advValEl.style.transform = 'translateY(4px)';
        setTimeout(() => { advValEl.style.transform = 'translateY(0)'; }, 100);
    }
    
    updateVisuals();
    checkBalance();
    if(typeof renderLegacyDropZones === 'function') renderLegacyDropZones();
}

// Generate DOM Elements for Molecules
function createMoleculeVisual(formulaObj) {
    const group = document.createElement('div');
    group.className = 'molecule-group';
    
    if (formulaObj.H === 2 && !formulaObj.O) {
        group.innerHTML = `<div class="atom a-H" style="z-index:2">H</div><div class="atom a-H" style="margin-left:-10px; z-index:1">H</div>`;
    } else if (formulaObj.O === 2) {
        group.innerHTML = `<div class="atom a-O" style="z-index:2">O</div><div class="atom a-O" style="margin-left:-10px; z-index:1">O</div>`;
    } else if (formulaObj.H === 2 && formulaObj.O === 1) {
        group.innerHTML = `
            <div class="atom a-H" style="margin-right:-15px; margin-top:20px; z-index:2">H</div>
            <div class="atom a-O" style="z-index:1; width:50px; height:50px;">O</div>
            <div class="atom a-H" style="margin-left:-15px; margin-top:20px; z-index:2">H</div>
        `;
    }
    return group;
}

function updateVisuals() {
    ['r1', 'r2', 'p1'].forEach(term => {
        const box = document.getElementById(`vis-${term}`);
        if (!box) return;
        
        box.innerHTML = '';
        const loops = gameState[term].coeff === 0 ? 1 : gameState[term].coeff; // Simple view visual
        for (let i = 0; i < loops; i++) {
            box.appendChild(createMoleculeVisual(gameState[term].formula));
        }
    });
}

function checkBalance() {
    // Tally Reactants
    const reactH = (gameState.r1.coeff * 2);
    const reactO = (gameState.r2.coeff * 2);
    
    // Tally Products
    const prodH = (gameState.p1.coeff * 2);
    const prodO = (gameState.p1.coeff * 1);
    
    // ==========================================
    // SIMPLE VIEW UPDATES
    // ==========================================
    const isHBalanced = (reactH === prodH) && reactH > 0;
    const isOBalanced = (reactO === prodO) && reactO > 0;
    
    // ==========================================
    // SIMPLE VIEW UPDATES
    // ==========================================
    const board = document.getElementById('balance-board');
    if (board) {
        board.innerHTML = `
            <div class="element-tally ${isHBalanced ? 'matched' : 'imbalanced'}">
                <div class="tally-count left-count">${reactH}</div>
                <div class="tally-symbol atom-H">H</div>
                <div class="tally-count right-count">${prodH}</div>
            </div>
            <div class="element-tally ${isOBalanced ? 'matched' : 'imbalanced'}">
                <div class="tally-count left-count">${reactO}</div>
                <div class="tally-symbol atom-O">O</div>
                <div class="tally-count right-count">${prodO}</div>
            </div>
        `;
    }
    
    const btnCheck = document.getElementById('btn-check');
    if (btnCheck) {
        if (isHBalanced && isOBalanced) {
            if (!btnCheck.classList.contains('ready')) playSuccessSound();
            btnCheck.classList.add('ready');
            btnCheck.removeAttribute('disabled');
            btnCheck.innerHTML = `<span class="check-text">CHECK</span><span class="check-icon">✨</span>`;
        } else {
            btnCheck.classList.remove('ready');
            btnCheck.setAttribute('disabled', 'true');
            btnCheck.innerHTML = `<span class="check-text">LOCKED</span><span class="check-icon">🔒</span>`;
        }
    }

    // ==========================================
    // UPDATE PRO VIEW VISUAL DOM
    // ==========================================
    const r1 = gameState.r1.coeff;
    const r2 = gameState.r2.coeff;
    const p1 = gameState.p1.coeff;
    
    // 1. Stackable Bar Books (H and O)
    const renderBooks = (id, count, colorClass) => {
        const el = document.getElementById(id);
        if(!el) return;
        let html = '';
        let remaining = count;
        while(remaining > 0) {
            let chunk = Math.min(5, remaining);
            let chunkHtml = '';
            for(let i=0; i<chunk; i++) {
                chunkHtml += `<div class="book-block ${colorClass}"></div>`;
            }
            html += `<div class="book-col">${chunkHtml}</div>`;
            remaining -= chunk;
        }
        el.innerHTML = html;
    };
    
    renderBooks('mini-H-left', reactH, 'blue');
    renderBooks('mini-H-right', prodH, 'orange');
    renderBooks('mini-O-left', reactO, 'blue');
    renderBooks('mini-O-right', prodO, 'orange');

    const updateCard = (elType, leftC, rightC) => {
        const card = document.getElementById(`card-${elType}`);
        const plank = document.getElementById(`mini-plank-${elType}`);
        const tL = document.getElementById(`tally-${elType}-left`);
        const tR = document.getElementById(`tally-${elType}-right`);
        const tEq = document.getElementById(`tally-${elType}-eq`);
        
        if(!card || !plank || !tL || !tR || !tEq) return;
        
        tL.innerText = leftC;
        tR.innerText = rightC;
        
        if (leftC === rightC && leftC > 0) {
            card.classList.add('matched');
            tL.classList.add('balanced');
            tR.classList.add('balanced');
            tEq.innerText = '=';
            tEq.style.color = 'var(--green)';
            
        } else {
            card.classList.remove('matched');
            tL.classList.remove('balanced');
            tR.classList.remove('balanced');
            tEq.innerText = '≠';
            tEq.style.color = 'var(--text-muted)';
            const diff = leftC - rightC;
            
        }
    };
    
    updateCard('H', reactH, prodH);
    updateCard('O', reactO, prodO);

    // 2. Beaker Atoms
    const beakerReact = document.getElementById('adv-beaker-react');
    const beakerProd = document.getElementById('adv-beaker-prod');
    if(beakerReact && beakerProd) {
        beakerReact.innerHTML = '';
        beakerProd.innerHTML = '';
        
        for(let i=0; i<r1; i++) beakerReact.innerHTML += `<div class="beaker-atom-group"><div class="b-atom H">H</div><div class="b-atom H">H</div></div>`;
        for(let i=0; i<r2; i++) beakerReact.innerHTML += `<div class="beaker-atom-group"><div class="b-atom O">O</div><div class="b-atom O">O</div></div>`;
        for(let i=0; i<p1; i++) beakerProd.innerHTML += `<div class="beaker-atom-group"><div class="b-atom H">H</div><div class="b-atom H">H</div><div class="b-atom O">O</div></div>`;
    }

    // 3. Drop Zone Cards
    const dropReact = document.getElementById('adv-drop-reactants');
    const dropProd = document.getElementById('adv-drop-products');
    if(dropReact && dropProd) {
        dropReact.innerHTML = '';
        dropProd.innerHTML = '';
        
        const h2Str = `<div class="drop-molecule"><div class="drop-formula">H<span class="sub">2</span><span class="state">(g)</span></div><div class="drop-atoms"><div class="b-atom H">H</div><div class="b-atom H">H</div></div></div>`;
        const o2Str = `<div class="drop-molecule"><div class="drop-formula">O<span class="sub">2</span><span class="state">(g)</span></div><div class="drop-atoms"><div class="b-atom O">O</div><div class="b-atom O">O</div></div></div>`;
        const h2oStr = `<div class="drop-molecule"><div class="drop-formula">H<span class="sub">2</span>O<span class="state">(l)</span></div><div class="drop-atoms"><div class="b-atom H">H</div><div class="b-atom H">H</div><div class="b-atom O">O</div></div></div>`;
        
        for(let i=0; i<r1; i++) dropReact.innerHTML += h2Str;
        for(let i=0; i<r2; i++) dropReact.innerHTML += o2Str;
        if(r1 === 0 && r2 === 0) dropReact.innerHTML = '👇 Click Pills to Add 👇';

        for(let i=0; i<p1; i++) dropProd.innerHTML += h2oStr;
        if(p1 === 0) dropProd.innerHTML = '👇 Click Pills to Add 👇';
    }

    // ==========================================
    // ADVANCED VIEW TEXT UPDATES
    // ==========================================
    const setAdvText = (id, val) => { if(document.getElementById(id)) document.getElementById(id).innerText = val; };
    setAdvText('adv-tally-react-H', reactH);
    setAdvText('adv-tally-react-O', reactO);
    setAdvText('adv-tally-prod-H', prodH);
    setAdvText('adv-tally-prod-O', prodO);
    
    // Tiny scale numbers and backgrounds
    setAdvText('adv-tiny-react-H', reactH);
    setAdvText('adv-tiny-prod-H', prodH);
    setAdvText('adv-tiny-react-O', reactO);
    setAdvText('adv-tiny-prod-O', prodO);
    
    if(document.getElementById('adv-tiny-react-H')) document.getElementById('adv-tiny-react-H').className = `tally-box ${isHBalanced ? 'balanced' : ''}`;
    if(document.getElementById('adv-tiny-prod-H')) document.getElementById('adv-tiny-prod-H').className = `tally-box ${isHBalanced ? 'balanced' : ''}`;
    if(document.getElementById('adv-tiny-react-O')) document.getElementById('adv-tiny-react-O').className = `tally-box ${isOBalanced ? 'balanced' : ''}`;
    if(document.getElementById('adv-tiny-prod-O')) document.getElementById('adv-tiny-prod-O').className = `tally-box ${isOBalanced ? 'balanced' : ''}`;

    setAdvText('adv-eq-H', reactH === prodH ? '=' : '≠');
    setAdvText('adv-eq-O', reactO === prodO ? '=' : '≠');
    
    // Bottom Footers
    if(document.getElementById('adv-foot-react-bg')) document.getElementById('adv-foot-react-bg').className = `zone-footer ${isHBalanced && isOBalanced ? 'balanced' : ''}`;
    if(document.getElementById('adv-foot-prod-bg')) document.getElementById('adv-foot-prod-bg').className = `zone-footer ${isHBalanced && isOBalanced ? 'balanced' : ''}`;

    // 2. Animate Seesaw Planks
    const rotatePlank = (id, leftWeight, rightWeight) => {
        const el = document.getElementById(id);
        if(!el) return;
        let deg = 0;
        if (leftWeight > rightWeight) deg = -2;
        if (rightWeight > leftWeight) deg = 2;
        el.style.transform = `rotate(${deg}deg)`;
        el.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    };
    rotatePlank('adv-plank-H', reactH, prodH);
    rotatePlank('adv-plank-O', reactO, prodO);
    
    const totalReactants = reactH + reactO;
    const totalProducts = prodH + prodO;
    rotatePlank('adv-giant-plank', totalReactants, totalProducts);

    // 3. Status Banner
    const statusBanner = document.querySelector('.pro-status-banner');
    const statusText = document.getElementById('adv-status-text');
    
        const legEq = document.getElementById('pro-legacy-equation');
        const legText = document.getElementById('adv-legacy-status-text');
        if (legEq && legText) {
            if (giantDiff === 0 && (reactH + reactO > 0)) {
                legEq.className = 'state-green';
                legText.style.color = '#10b981';
                legText.innerText = 'BALANCED!';
            } else {
                legEq.className = 'state-red';
                legText.style.color = '#ef4444';
                legText.innerText = 'UNBALANCED';
            }
        }

    if (statusBanner && statusText) {
        if (totalReactants === 0 && totalProducts === 0) {
            statusText.innerText = 'EMPTY';
            statusBanner.className = 'pro-status-banner'; // Default gray
        } else if (isHBalanced && isOBalanced) {
            statusText.innerText = 'BALANCED!';
            statusBanner.className = 'pro-status-banner is-balanced'; // Green
        } else {
            statusText.innerText = 'UNBALANCED';
            statusBanner.className = 'pro-status-banner is-unbalanced'; // Red
        }
    }
}

// ==========================================
// NAVIGATION
// ==========================================
function goBack() {
    playSoftClick();
    setTimeout(() => {
        // Simple fallback history
        window.history.back();
        // If that fails due to being a new tab
        setTimeout(() => window.location.href = 'levels.html', 100);
    }, 150);
}

function openMenu() {
    playSoftClick();
    alert('Settings/Menu Modal opened!');
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('mousedown', () => initAudio(), { once: true });
    
    // Sync starting coefficients to advanced view
    ['r1', 'r2', 'p1'].forEach(termId => {
        const advValEl = document.getElementById(`adv-coeff-${termId}`);
        if (advValEl) advValEl.innerText = gameState[termId].coeff;
    });

    updateVisuals();
    checkBalance();
    if(typeof renderLegacyDropZones === 'function') renderLegacyDropZones();
    
    // Check answer button logic
    const btnCheck = document.getElementById('btn-check');
    if (btnCheck) {
        btnCheck.addEventListener('click', () => {
            if (btnCheck.classList.contains('ready')) {
                playSuccessSound();
                btnCheck.innerHTML = `<span class="check-text">CORRECT!</span><span class="check-icon">🎉</span>`;
                setTimeout(() => {
                    alert('Moving to next level...');
                }, 1000);
            }
        });
    }
});

// ==========================================
// VIEW TOGGLE LOGIC
// ==========================================
function setViewMode(mode) {
    playSoftClick();
    const simple = document.getElementById('view-simple');
    const orig = document.getElementById('view-original');
    const legacy = document.getElementById('view-legacy');
    const testV = document.getElementById('view-test');
    const goodV = document.getElementById('view-good');
    
    const btnSimple = document.getElementById('btn-simple');
    const btnAdvanced = document.getElementById('btn-advanced');
    const btnLegacy = document.getElementById('btn-legacy');
    const btnTest = document.getElementById('btn-test');
    const btnGood = document.getElementById('btn-good');
    
    // Reset displays
    if (simple) simple.style.display = 'none';
    if (orig) orig.style.display = 'none';
    if (legacy) legacy.style.display = 'none';
    if (testV) testV.style.display = 'none';
    if (goodV) goodV.style.display = 'none';
    
    // Reset active states
    if (btnSimple) btnSimple.classList.remove('active');
    if (btnAdvanced) btnAdvanced.classList.remove('active');
    if (btnLegacy) btnLegacy.classList.remove('active');
    if (btnTest) btnTest.classList.remove('active');
    if (btnGood) btnGood.classList.remove('active');
    
    if (mode === 'advanced') {
        if (orig) orig.style.display = 'flex';
        if (btnAdvanced) btnAdvanced.classList.add('active');
    } else if (mode === 'legacy') {
        if (legacy) legacy.style.display = 'block';
        if (btnLegacy) btnLegacy.classList.add('active');
        
        // Load legacy iframe if not loaded
        const frame = document.getElementById('legacy-frame');
        if (frame && !frame.src.includes('legacy.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const lvl = urlParams.get('level') || 1;
            frame.src = 'legacy.html?level=' + lvl + '&v=' + Date.now();
        }
    
    
    } else if (mode === 'good') {
        if (goodV) goodV.style.display = 'block';
        if (btnGood) btnGood.classList.add('active');
        const frame = document.getElementById('good-frame');
        if (frame) {
            const urlParams = new URLSearchParams(window.location.search);
            const lvl = urlParams.get('level') || 1;
            frame.src = 'good.html?level=' + lvl + '&v=' + Date.now();
            if(typeof LEVELS !== 'undefined') {
                const lvlData = LEVELS[lvl];
                if(lvlData) {
                    let titleH1 = document.querySelector('.pro-header-left h1');
                    if(titleH1) titleH1.innerHTML = lvlData.form ? ('Form ' + lvlData.form + ' : ' + lvlData.title) : lvlData.title;
                }
            }
        }
} else if (mode === 'test') {
        if (testV) testV.style.display = 'block';
        if (btnTest) btnTest.classList.add('active');
        
        // Load test iframe if not loaded
        const frame = document.getElementById('test-frame');
        if (frame && !frame.src.includes('test.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const lvl = urlParams.get('level') || 1;
            frame.src = 'test.html?level=' + lvl + '&v=' + Date.now();
        }
    } else {
        if (simple) simple.style.display = 'block';
        if (btnSimple) btnSimple.classList.add('active');
    }
}

// --- PRO VIEW PANEL TOGGLE ---
window.toggleProPanel = function(btn) {
    playSoftClick();
    const panel = btn.closest('.pro-panel'); if(!panel) return;
    panel.classList.toggle('collapsed');
    
    // Update grid track width based on collapse state
    const grid = document.querySelector('.pro-grid');
    if(grid) {
        const leftCollapsed = document.querySelector('.pro-left').classList.contains('collapsed');
        const rightCollapsed = document.querySelector('.pro-right').classList.contains('collapsed');
        const leftW = leftCollapsed ? '75px' : '280px';
        const rightW = rightCollapsed ? '75px' : '300px';
        grid.style.gridTemplateColumns = `${leftW} 1fr ${rightW}`;
    }
};

// --- JS TOOLTIP LOGIC ---
let activeTooltip = null;
document.addEventListener('mouseover', function(e) {
    let target = e.target.closest('[data-tooltip], [data-html-tooltip], [data-info]');
    if(target) {
        if(activeTooltip) activeTooltip.remove();
        let isHtml = target.hasAttribute('data-html-tooltip');
        let content = isHtml ? target.getAttribute('data-html-tooltip') : (target.getAttribute('data-tooltip') || target.getAttribute('data-info'));
        
        activeTooltip = document.createElement('div');
        activeTooltip.className = isHtml ? 'js-tooltip html-tip' : 'js-tooltip';
        activeTooltip.innerHTML = content;
        document.body.appendChild(activeTooltip);
        
        let rect = target.getBoundingClientRect();
        let tipRect = activeTooltip.getBoundingClientRect();
        let top = rect.top - tipRect.height - 10;
        let left = rect.left + (rect.width/2) - (tipRect.width/2);
        
        if(top < 10) top = rect.bottom + 10;
        
        activeTooltip.style.top = top + 'px';
        activeTooltip.style.left = left + 'px';
        activeTooltip.style.opacity = '1';
    }
});
document.addEventListener('mouseout', function(e) {
    let target = e.target.closest('[data-tooltip], [data-html-tooltip], [data-info]');
    if(target && activeTooltip) {
        activeTooltip.remove();
        activeTooltip = null;
    }
});

// --- RENDER LEGACY DROP ZONES IN PRO VIEW ---
function renderLegacyDropZones() {
    const renderMol = (id, count, formulaHtml, marblesHtml) => {
        let html = '';
        for(let i=0; i<count; i++) {
            html += `<div class="mol-card" onclick="changeCoeff('${id}', -1)" style="cursor:pointer; background:white; border:4px solid #cbd5e1; border-radius:16px; box-shadow:0 6px 0 #cbd5e1; padding:12px; display:flex; flex-direction:column; align-items:center; position:relative; margin:5px;" data-tooltip="Click to remove">
                <div class="mol-remove-overlay" style="position:absolute; top:-10px; right:-10px; background:red; color:white; border-radius:50%; width:24px; height:24px; display:none; justify-content:center; align-items:center; font-size:12px; font-weight:bold; box-shadow:0 2px 4px rgba(0,0,0,0.3);">X</div>
                <div class="mol-formula" style="font-size:22px; font-weight:900; font-family:'Nunito', sans-serif;">${formulaHtml}</div>
                <div style="display:flex; justify-content:center; gap:2px; margin-top:5px;">${marblesHtml}</div>
            </div>`;
        }
        return html;
    };
    
    // Reactants
    const leftArea = document.getElementById('area-left');
    if(leftArea) {
        let html = '';
        html += renderMol('r1', gameState.r1.coeff, 'H<span style="font-size:0.6em; vertical-align:sub;">2</span>', '<div class="b-atom H">H</div><div class="b-atom H">H</div>');
        html += renderMol('r2', gameState.r2.coeff, 'O<span style="font-size:0.6em; vertical-align:sub;">2</span>', '<div class="b-atom O">O</div><div class="b-atom O">O</div>');
        leftArea.innerHTML = html;
    }
    
    // Products
    const rightArea = document.getElementById('area-right');
    if(rightArea) {
        let html = '';
        html += renderMol('p1', gameState.p1.coeff, 'H<span style="font-size:0.6em; vertical-align:sub;">2</span>O', '<div class="b-atom H">H</div><div class="b-atom O">O</div><div class="b-atom H">H</div>');
        rightArea.innerHTML = html;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if(typeof setViewMode === 'function') {
        setViewMode('good');
    }
});
