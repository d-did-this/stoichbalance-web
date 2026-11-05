window.buildLevelMinohPlanCard = function(levelData) {
    if (!levelData || !levelData.elements) return '';

    const METALS = new Set(['Na', 'K', 'Ca', 'Mg', 'Al', 'Zn', 'Fe', 'Pb', 'Cu', 'Ag', 'Ba', 'Li', 'Sn', 'Ni', 'Mn', 'Cr']);
    const KNOWN_POLYATOMIC = [
        { key: 'NO3', display: 'NO₃', name: 'Nitrate', elements: ['N', 'O'] },
        { key: 'SO4', display: 'SO₄', name: 'Sulfate', elements: ['S', 'O'] },
        { key: 'CO3', display: 'CO₃', name: 'Carbonate', elements: ['C', 'O'] },
        { key: 'OH', display: 'OH', name: 'Hydroxide', elements: ['O', 'H'] }
    ];

    const rRaw = (levelData.reactants || []).map(r => r.id).join(' ');
    const pRaw = (levelData.products || []).map(p => p.id).join(' ');

    const activeIons = [];
    let strippedR = rRaw;
    let strippedP = pRaw;

    for (const ion of KNOWN_POLYATOMIC) {
        if (rRaw.includes(ion.key) && pRaw.includes(ion.key)) {
            activeIons.push(ion);
            strippedR = strippedR.split(ion.key).join('');
            strippedP = strippedP.split(ion.key).join('');
        }
    }

    const strippedCombined = strippedR + ' ' + strippedP;

    const metals = [];
    const nonMetals = [];
    let hasOxygen = strippedCombined.includes('O');
    let hasHydrogen = strippedCombined.includes('H');

    for (const el of levelData.elements) {
        if (METALS.has(el)) {
            metals.push(el);
        } else if (el === 'O' || el === 'H') {
            // Handled via stripped check
        } else {
            if (strippedCombined.includes(el)) {
                nonMetals.push(el);
            }
        }
    }

    const steps = [];
    if (metals.length > 0) {
        steps.push({ letter: 'M', title: 'Metals', items: metals.map(m => (ELEM_NAMES[m] || m) + ' (' + m + ')'), priority: 1, color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' });
    }
    if (activeIons.length > 0) {
        steps.push({ letter: 'I', title: 'Polyatomic Ions', items: activeIons.map(i => i.name + ' (' + i.display + ')'), priority: 2, color: '#6d28d9', bg: '#f5f3ff', border: '#ddd6fe' });
    }
    if (nonMetals.length > 0) {
        steps.push({ letter: 'N', title: 'Non-Metals', items: nonMetals.map(n => (ELEM_NAMES[n] || n) + ' (' + n + ')'), priority: 3, color: '#0369a1', bg: '#f0f9ff', border: '#bae6fd' });
    }
    if (hasOxygen) {
        steps.push({ letter: 'O', title: 'Oxygen', items: ['Oxygen (O)'], priority: 4, color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' });
    }
    if (hasHydrogen) {
        steps.push({ letter: 'H', title: 'Hydrogen', items: ['Hydrogen (H)'], priority: 5, color: '#047857', bg: '#ecfdf5', border: '#a7f3d0' });
    }

    if (steps.length === 0) return '';

    // Summary order string
    let orderBadges = steps.map(s => `<span style="background:${s.bg}; color:${s.color}; border:1px solid ${s.border}; border-radius:6px; padding:2px 7px; font-weight:900; font-size:0.78rem;">[${s.letter}] ${s.items.map(it => it.replace(/\s*\([^)]*\)/, '')).join(', ')}</span>`).join(' <span style="color:#94a3b8; font-size:0.75rem;">➔</span> ');

    // Steps list rows
    let stepsRowsHtml = steps.map((s, idx) => `
        <div style="display:flex; align-items:center; justify-content:space-between; background:${s.bg}; border:1px solid ${s.border}; border-radius:8px; padding:5px 9px;">
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="background:${s.color}; color:#ffffff; width:20px; height:20px; border-radius:50%; font-size:0.72rem; font-weight:900; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;">${idx + 1}</span>
                <span style="font-weight:900; font-size:0.84rem; color:${s.color};">[${s.letter}] ${s.title}:</span>
            </div>
            <span style="font-weight:800; font-size:0.82rem; color:#1e293b;">${s.items.join(', ')}</span>
        </div>
    `).join('');

    return `
    <div class="minoh-plan-card" style="display:flex; flex-direction:column; gap:8px;">
        <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1.5px solid #e2e8f0; padding-bottom:6px;">
            <span style="font-weight:900; font-size:0.86rem; color:#1e293b; display:inline-flex; align-items:center; gap:6px;">
                <span>🎯</span> <span>MINOH Balancing Order</span>
            </span>
            <span style="font-size:0.72rem; font-weight:800; color:#64748b; background:#f1f5f9; padding:2px 6px; border-radius:4px;">Best Practice</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:5px;">
            ${stepsRowsHtml}
        </div>
        <div style="display:flex; flex-wrap:wrap; align-items:center; gap:4px; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px; padding:6px 8px; margin-top:2px;">
            <span style="font-size:0.72rem; font-weight:900; color:#475569; text-transform:uppercase;">Sequence:</span>
            ${orderBadges}
        </div>
    </div>`;
};


window.spamTracker = {
    lastSide: null,
    lastId: null,
    consecutiveClicks: 0,
    mistakeCount: 0,
    lastWarningTime: 0
};

window.showLabWarning = function(msg) {
    let now = Date.now();
    if (now - window.spamTracker.lastWarningTime < 2200) return;
    window.spamTracker.lastWarningTime = now;
    if (typeof playSound === "function") playSound("wrong");
    
    let existing = document.getElementById('lab-warning-toast');
    if (existing) existing.remove();
    let toast = document.createElement('div');
    toast.id = 'lab-warning-toast';
    toast.style.cssText = "position: absolute; top: 16px; left: 50%; transform: translateX(-50%); background: #fef3c7; color: #92400e; border: 3px solid #d97706; box-shadow: 0 4px 14px rgba(217,119,6,0.3); border-radius: 14px; padding: 10px 20px; font-weight: 800; font-size: 0.95rem; z-index: 9999; display: flex; align-items: center; gap: 8px; pointer-events: none; animation: popBounceIn 0.3s ease;";
    toast.innerHTML = `<span>⚠️</span> <span>${msg}</span>`;
    
    let middle = document.querySelector('.block-middle');
    if (middle) {
        middle.style.position = 'relative';
        middle.appendChild(toast);
        setTimeout(() => {
            toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-10px)';
            setTimeout(() => toast.remove(), 400);
        }, 2800);
    }
};


// Universal chemical formula tokenizer for hover info cards
function tokenizeChemicalFormula(html) {
    let clean = html.replace(/<span[^>]*>([0-9]+)<\/span>/gi, '_SUB_$1_');
    const uniMap = { '₂':'2', '₃':'3', '₄':'4', '₅':'5', '₆':'6', '₇':'7', '₈':'8', '₉':'9' };
    clean = clean.replace(/([₂₃₄₅₆₇₈₉])/g, (m, c) => `_SUB_${uniMap[c]}_`);

    const tokenRegex = /_SUB_(\d+)_|([A-Z][a-z]?)|(\()|(\))|(\d+)/g;
    let result = '';
    let lastElement = 'H';
    let match;

    while ((match = tokenRegex.exec(clean)) !== null) {
        if (match[1] !== undefined) {
            const count = match[1];
            result += `<span class="sci-sub-token has-chem-info" data-info="subscript" data-element="${lastElement}" data-count="${count}">${count}</span>`;
        } else if (match[2] !== undefined) {
            const el = match[2];
            lastElement = el;
            result += `<span class="sci-elem-token has-chem-info" data-info="element" data-element="${el}">${el}</span>`;
        } else if (match[3] !== undefined) {
            result += '(';
        } else if (match[4] !== undefined) {
            result += ')';
        } else if (match[5] !== undefined) {
            const count = match[5];
            result += `<span class="sci-sub-token has-chem-info" data-info="subscript" data-element="${lastElement}" data-count="${count}">${count}</span>`;
        }
    }
    return result;
}


window.handleGameBackClick = function() {
    if (typeof playSound === "function") playSound("click");
    if (window.isChallengeMode) {
        if (window.challengeInterval) clearInterval(window.challengeInterval);
        window.transitionTo('index.html');
    } else {
        const params = new URLSearchParams(window.location.search);
        const lvl = params.get('level') || '';
        const form = params.get('form') || (lvl.toUpperCase().startsWith('F5') ? 'Form 5' : 'Form 4');
        const name = params.get('name') || localStorage.getItem('currentPlayer') || 'Player';
        window.transitionTo(`levels.html?form=${encodeURIComponent(form)}&mode=class&name=${encodeURIComponent(name)}`);
    }
};


const ELEM_NAMES = { 
    H: "Hydrogen", O: "Oxygen", N: "Nitrogen", Na: "Sodium", K: "Potassium", 
    I: "Iodine", Zn: "Zinc", S: "Sulfur", Ag: "Silver", C: "Carbon", 
    Pb: "Lead", Al: "Aluminium", Cl: "Chlorine", Mg: "Magnesium", 
    Fe: "Iron", Cu: "Copper", Br: "Bromine", P: "Phosphorus", Ca: "Calcium" 
};






// engine.js - Dynamic Level Rendering Engine for Stoichbalance

let currentLevelData = null;




window.toggleFullscreen = function() {
    if (typeof playSound === "function") playSound("tactile");
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log("Error attempting to enable fullscreen:", err);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
};



window.toggleBlock = function(side) {
    if (window.isChallengeMode) {
        if (side === 'left' && window.challengeScaleSetting === 'off') {
            if (typeof playSound === 'function') playSound('wrong');
            let block = document.querySelector(".block-left");
            if (block) {
                block.classList.add("shake-locked");
                setTimeout(() => block.classList.remove("shake-locked"), 400);
            }
            return;
        }
        if (side === 'right' && window.challengeHintsSetting === '0') {
            if (typeof playSound === 'function') playSound('wrong');
            let block = document.querySelector(".block-right");
            if (block) {
                block.classList.add("shake-locked");
                setTimeout(() => block.classList.remove("shake-locked"), 400);
            }
            return;
        }
    }
    
    if (typeof playSound === "function") playSound("whoosh");
    let block = document.querySelector(".block-" + side);
    if(block) block.classList.toggle("collapsed");
    
    let layout = document.querySelector(".good-layout");
    if(layout) {
        let leftCollapsed = document.querySelector(".block-left")?.classList.contains("collapsed");
        let rightCollapsed = document.querySelector(".block-right")?.classList.contains("collapsed");
        if (leftCollapsed) {
            layout.style.setProperty("--left-w", "72px");
        } else {
            layout.style.removeProperty("--left-w");
        }
        if (rightCollapsed) {
            layout.style.setProperty("--right-w", "72px");
        } else {
            layout.style.removeProperty("--right-w");
        }
    }
};


function getGCD(a, b) {
    return b === 0 ? a : getGCD(b, a % b);
}
function getArrayGCD(arr) {
    if(arr.length === 0) return 1;
    let res = arr[0];
    for(let i = 1; i < arr.length; i++) {
        res = getGCD(res, arr[i]);
        if(res === 1) return 1;
    }
    return res;
}

window.hintCounter = 1;

let hintLevel = 1;
let lastHintElement = null;

function initEngine() {

    const params = new URLSearchParams(window.location.search);
    let mode = params.get('mode');
    let formParam = params.get('form') || '';
    let levelId = params.get('level') || 'F4L6';
    if (mode === 'challenge') {
        document.documentElement.style.setProperty('--bg-color', '#f59e0b');
        document.documentElement.classList.add('is-challenge-mode');
        window.initChallengeMode(params);
        return;
    }
    if (formParam.includes('5') || levelId.toUpperCase().startsWith('F5')) {
        document.documentElement.style.setProperty('--bg-color', '#10b981');
        document.documentElement.classList.add('is-form5-mode');
    }
    // Remove quotes if present
    levelId = levelId.replace(/['"]/g, '');
    
    if (levelId === 'sandbox') {
        let stored = localStorage.getItem('stoich_custom_sandbox');
        let customData = null;
        if (stored) {
            try { customData = JSON.parse(stored); } catch (_) {}
        }
        if (!customData || !customData.reactants || customData.reactants.length === 0) {
            let eqParam = params.get('eq') || localStorage.getItem('stoich_sandbox_level') || 'H2 + O2 -> H2O';
            customData = (typeof window.buildSandboxLevelData === 'function') ? window.buildSandboxLevelData(eqParam) : null;
        }
        if (customData) {
            currentLevelData = {
                id: 'sandbox',
                title: 'Sandbox : ' + (customData.equation || 'Custom Reaction'),
                form: 'Sandbox',
                equation: customData.equation || 'Custom Reaction',
                reactants: customData.reactants,
                products: customData.products,
                elements: customData.elements,
                balanced: customData.balanced
            };
            LEVELS['sandbox'] = currentLevelData;
        } else {
            currentLevelData = LEVELS['F4L1'];
        }
    } else {
        currentLevelData = LEVELS[levelId];
    }
    window.proEquationRendered = false;

    if (!currentLevelData) {
        currentLevelData = LEVELS['F4L6']; // Fallback
        levelId = 'F4L6';
    }
    if (currentLevelData && !currentLevelData.id) {
        currentLevelData.id = levelId;
    }
    
    document.title = currentLevelData.title;
    renderBoard();
    let titleEl = document.getElementById("level-title");
    if(titleEl && currentLevelData) {
        let match = levelId.match(/L(\d+)/);
        let prefix = match ? "Level " + match[1] + " : " : "";
        titleEl.innerText = prefix + currentLevelData.title;
    }
    
    // Remove any review mode top button from previous level
    window.isReviewMode = false;
    let existingReviewBtn = document.getElementById('btn-top-next-level');
    if (existingReviewBtn) existingReviewBtn.remove();

    window.hardFloorOfOne = (!window.isChallengeMode && levelId !== 'TUT0' && levelId !== 'tutorial');
    if (levelId === 'TUT0' || levelId === 'tutorial') {
        setTimeout(() => {
            if (typeof window.openTutorial === 'function') window.openTutorial(0);
        }, 320);
    }
    
    window.unproductiveMovesCount = 0;
    window.lastBalanceScore = 999;
    window.proactiveBeakerTriggeredForLevel = false;
    if (typeof window.resetIdleGuidanceTimer === 'function') window.resetIdleGuidanceTimer();

    if (window.hardFloorOfOne) {
        window.initDefaultMolecules();
    } else {
        updateSimulation();
    }
    
    // Welcome message

        setTimeout(() => { 
            window.clearChat(); 
            window.addChatMessage("Welcome! Let's balance <b>" + currentLevelData.title + "</b>.<br>⚖️ Equal atoms on both sides wins!", "Prof. Beaker"); 
            let minohCardHtml = window.buildLevelMinohPlanCard(currentLevelData);
            if (minohCardHtml) {
                setTimeout(() => {
                    window.addChatMessage(minohCardHtml, "MINOH Strategy");
                }, 280);
            }
        }, 100);
}

function getAtomMarble(element) {
    let color = ATOM_COLORS[element] || { bg: "#94a3b8", color: "white" };
    return `<div style="width: 24px; height: 24px; border-radius: 50%; background: ${color.bg}; display: inline-flex; align-items: center; justify-content: center; color: ${color.color}; font-size: 11px; font-weight: 900; box-shadow: inset -2px -2px 4px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.15); border: 1px solid rgba(0,0,0,0.2); margin-right: 2px;">${element}</div>`;
}

function getHyperMarble(element) {
    let color = ATOM_COLORS[element] || { bg: "#94a3b8", color: "white" };
    return `<div style="width: 28px; height: 28px; border-radius: 50%; background: ${color.bg}; display: inline-flex; align-items: center; justify-content: center; color: ${color.color}; font-size: 14px; font-weight: 900; box-shadow: inset -3px -3px 6px rgba(0,0,0,0.3), inset 3px 3px 6px rgba(255,255,255,0.8), 0 3px 6px rgba(0,0,0,0.2); border: 1px solid rgba(0,0,0,0.2);">${element}</div>`;
}


function renderBoard() {
    let eq = document.getElementById('dynamic-sci-equation');
    if(eq && currentLevelData) {
        // e.g. "Zn + AgNO₃ → Zn(NO₃)₂ + Ag"
        eq.innerHTML = currentLevelData.equation.replace(/([₂₃₄₅₆₇₈₉])/g, '<span style="font-size: 0.6em; vertical-align: sub; color: #475569;">$1</span>');
    }

    
    // Render Sleek Equation (Option A: Always Single-Line with Proportional Auto-Fit)
    const sleekEq = document.getElementById('dynamic-sleek-equation');
    const eqSection = document.querySelector('.section-equation');
    
    if (sleekEq) {
        const buildMolHtml = (m, side) => {
            let formula = tokenizeChemicalFormula(m.displayHtml);
            let coeffHtml = `<div id="coeff-eq-${side}-${m.id}" class="sci-coeff img-coeff has-chem-info" data-info="coeff" data-mol-name="${m.name}" data-mol-formula="${m.id}" data-composition='${JSON.stringify(m.composition)}'>1</div>`;
            let stateHtml = `<span class="state-label sci-state-token has-chem-info" data-info="state" data-state="${m.state || 'aq'}">(${m.state || 'aq'})</span>`;
            return `<div class="sci-mol">${coeffHtml}<div class="sci-formula has-chem-info" data-info="molecule" data-mol-name="${m.name}" data-mol-formula="${m.id}">${formula}${stateHtml}</div></div>`;
        };

        const isLevel7 = (typeof currentLevelData !== 'undefined' && currentLevelData && (
            currentLevelData.id === 'F4L7' ||
            (currentLevelData.title && currentLevelData.title.includes('Acid-Carbonate')) ||
            (new URLSearchParams(window.location.search).get('level') || '').toUpperCase() === 'F4L7'
        ));

        if (eqSection) {
            eqSection.classList.remove('level7-dedicated');
            eqSection.style.height = '';
            eqSection.style.minHeight = '';
            eqSection.style.padding = isLevel7 ? '4px 20px' : '4px 24px';
        }

        sleekEq.classList.remove('level7-dedicated');
        if (isLevel7) {
            sleekEq.classList.add('level7-scaled');
        } else {
            sleekEq.classList.remove('level7-scaled');
        }

        sleekEq.style.display = 'grid';
        sleekEq.style.gridTemplateColumns = 'minmax(0, 1fr) auto minmax(0, 1fr)';
        sleekEq.style.alignItems = 'center';
        sleekEq.style.width = '100%';
        sleekEq.style.height = '100%';
        sleekEq.style.whiteSpace = 'nowrap';
        sleekEq.style.flexWrap = 'nowrap';
        sleekEq.style.boxSizing = 'border-box';
        sleekEq.style.gap = '0px';

        const gapStyle = isLevel7 ? '3px' : 'clamp(3px, 0.8cqw, 8px)';
        let rHtml = `<div class="eq-side eq-reactants" style="display: flex; align-items: center; justify-content: flex-start; gap: ${gapStyle}; white-space: nowrap; flex-wrap: nowrap; min-width: 0; width: 100%;">`;
        currentLevelData.reactants.forEach((m, idx) => {
            rHtml += buildMolHtml(m, 'react');
            if (idx < currentLevelData.reactants.length - 1) {
                rHtml += `<div class="sci-plus has-chem-info" data-info="plus"${isLevel7 ? ' style="margin: 0 1px;"' : ''}>+</div>`;
            }
        });
        rHtml += '</div>';

        const arrowPadding = isLevel7 ? '0 6px' : '0 clamp(4px, 1cqw, 10px)';
        let arrowHtml = `<div class="eq-arrow-wrapper" style="flex-shrink: 0; display: flex; justify-content: center; align-items: center; padding: ${arrowPadding}; white-space: nowrap;"><div class="sci-arrow-box has-chem-info" data-info="arrow" style="border-radius: 9px;">&#10142;</div></div>`;

        let pHtml = `<div class="eq-side eq-products" style="display: flex; align-items: center; justify-content: flex-end; gap: ${gapStyle}; white-space: nowrap; flex-wrap: nowrap; min-width: 0; width: 100%;">`;
        currentLevelData.products.forEach((m, idx) => {
            pHtml += buildMolHtml(m, 'prod');
            if (idx < currentLevelData.products.length - 1) {
                pHtml += `<div class="sci-plus has-chem-info" data-info="plus"${isLevel7 ? ' style="margin: 0 1px;"' : ''}>+</div>`;
            }
        });
        pHtml += '</div>';

        sleekEq.innerHTML = rHtml + arrowHtml + pHtml;

        if (typeof window.autoFitEquation === 'function') {
            window.autoFitEquation();
            requestAnimationFrame(() => window.autoFitEquation());
        }
    }


    // 1. Render Reactant Buttons
    const btnReactContainer = document.getElementById('react-btn-container');
    if(btnReactContainer) {
        btnReactContainer.innerHTML = '';
        currentLevelData.reactants.forEach(m => {
            let btn = document.createElement('div');
            btn.id = 'btn-add-react-' + m.id; btn.className = 'mol-btn btn-react has-chem-info'; btn.setAttribute('data-info', 'btn-react'); btn.setAttribute('data-mol-name', m.name); btn.setAttribute('data-mol-id', m.id); btn.setAttribute('data-side', 'react'); btn.setAttribute('data-composition', JSON.stringify(m.composition));
            btn.innerHTML = `<span style="font-size: 1.5rem; margin-right: 4px;">+</span> <span>${m.displayHtml}</span>`;
            
              btn.onclick = () => window.addMolecule('react', m.id);
            btnReactContainer.appendChild(btn);
        });
    }

    // 2. Render Product Buttons
    const btnProdContainer = document.getElementById('prod-btn-container');
    if(btnProdContainer) {
        btnProdContainer.innerHTML = '';
        const isDenseProd = currentLevelData.products.length >= 3;
        currentLevelData.products.forEach(m => {
            let btn = document.createElement('div');
            btn.id = 'btn-add-prod-' + m.id; btn.className = 'mol-btn btn-prod has-chem-info'; btn.setAttribute('data-info', 'btn-prod'); btn.setAttribute('data-mol-name', m.name); btn.setAttribute('data-mol-id', m.id); btn.setAttribute('data-side', 'prod'); btn.setAttribute('data-composition', JSON.stringify(m.composition));
            if (isDenseProd) {
                btn.style.padding = '8px 8px';
                btn.style.fontSize = '0.95rem';
                btn.style.flex = '1 1 0';
                btn.style.minWidth = '0';
            }
            btn.innerHTML = `<span style="font-size: 1.3rem; margin-right: 4px;">+</span> <span>${m.displayHtml}</span>`;
            
              btn.onclick = () => window.addMolecule('prod', m.id);
            btnProdContainer.appendChild(btn);
        });
    }

    // 3. Render Drop Rows (Reactants)
    const dropReactContainer = document.getElementById('react-drop-container');
    if(dropReactContainer) {
        dropReactContainer.innerHTML = '';
        currentLevelData.reactants.forEach(m => {
            let row = document.createElement('div');
            row.id = 'row-react-' + m.id;
            row.className = 'drop-row';
            row.setAttribute('data-accept', m.id);
            row.style.cssText = 'display: none; flex-direction: row; flex-wrap: wrap; gap: 8px; width: 100%; background: transparent; border: none; padding: 5px; justify-content: flex-start;';
            dropReactContainer.appendChild(row);
        });
    }

    // 4. Render Drop Rows (Products)
    const dropProdContainer = document.getElementById('prod-drop-container');
    if(dropProdContainer) {
        dropProdContainer.innerHTML = '';
        currentLevelData.products.forEach(m => {
            let row = document.createElement('div');
            row.id = 'row-prod-' + m.id;
            row.className = 'drop-row';
            row.setAttribute('data-accept', m.id);
            row.style.cssText = 'display: none; flex-direction: row-reverse; flex-wrap: wrap; gap: 8px; width: 100%; background: transparent; border: none; padding: 5px;';
            dropProdContainer.appendChild(row);
        });
    }
}

// Global Override for addMolecule with Hard Floor of 1 & Default Starting State
window.actionHistory = window.actionHistory || [];
window.hardFloorOfOne = true;

window.insertMoleculeBlock = function(side, typeId, recordHistory = true) {
    let rowId = "row-" + side + "-" + typeId;
    let row = document.getElementById(rowId);
    if (!row) return;

    let m = currentLevelData.reactants.find(x => x.id === typeId) || currentLevelData.products.find(x => x.id === typeId);
    if (!m) return;

    let block = document.createElement("div");
    block.className = "mol-block";

    block.onclick = function() {
        window.activeVisualHint = null;

        // Hard floor constraint: prevent removing the last remaining molecule of a formula
        if (window.hardFloorOfOne && row.querySelectorAll('.mol-block').length <= 1) {
            if (typeof playSound === "function") playSound("error");
            block.style.animation = "shakeError 0.35s ease";
            setTimeout(() => { block.style.animation = ""; }, 350);
            return;
        }

        if (typeof playSound === "function") playSound("undo");
        if (recordHistory) {
            window.actionHistory.push({ action: "remove", side: side, block: block, parent: row });
        }
        block.remove();
        updateSimulation();
    };

    let marblesHtml = "";
    for (let el in m.composition) {
        let count = m.composition[el];
        for (let i = 0; i < count; i++) {
            marblesHtml += getHyperMarble(el);
        }
    }

    block.innerHTML = `<div class="mol-remove-overlay">&#10006;</div><div style="font-weight: 900; font-size: 1.1rem; color: #1e293b;">${m.displayHtml}</div><div style="display: flex; flex-wrap: wrap; justify-content: center;">${marblesHtml}</div>`;
    row.appendChild(block);

    if (recordHistory) {
        window.actionHistory.push({ action: "add", side: side, block: block, parent: row });
    }
};

window.addMolecule = function(side, typeId) {
    window.activeVisualHint = null;
    
    // Track rapid consecutive clicks on same molecule
    if (window.spamTracker.lastSide === side && window.spamTracker.lastId === typeId) {
        window.spamTracker.consecutiveClicks++;
    } else {
        window.spamTracker.lastSide = side;
        window.spamTracker.lastId = typeId;
        window.spamTracker.consecutiveClicks = 1;
    }
    
    let row = document.getElementById("row-" + side + "-" + typeId);
    let currentCoeff = row ? row.querySelectorAll('.mol-block').length : 0;
    
    if (window.spamTracker.consecutiveClicks >= 4 || currentCoeff >= 5) {
        window.showLabWarning(`Whoa, slow down! Adding too many ${typeId} molecules will tilt the scale too far.`);
    }
    
    if (typeof playSound === "function") playSound("click");
    window.insertMoleculeBlock(side, typeId, true);
    updateSimulation();
};

window.initDefaultMolecules = function() {
    window.actionHistory = [];
    if (!currentLevelData) return;
    currentLevelData.reactants.forEach(m => {
        let row = document.getElementById("row-react-" + m.id);
        if (row && row.children.length === 0) {
            window.insertMoleculeBlock('react', m.id, false);
        }
    });
    currentLevelData.products.forEach(m => {
        let row = document.getElementById("row-prod-" + m.id);
        if (row && row.children.length === 0) {
            window.insertMoleculeBlock('prod', m.id, false);
        }
    });
    updateSimulation();
};

window.undo = function() {
    if (typeof playSound === "function") playSound("undo");
    if (window.actionHistory.length === 0) return;
    let last = window.actionHistory[window.actionHistory.length - 1];
    if (last.action === "add") {
        let row = last.parent;
        if (window.hardFloorOfOne && row.querySelectorAll('.mol-block').length <= 1) {
            return;
        }
        window.actionHistory.pop();
        last.block.remove();
    } else if (last.action === "remove") {
        window.actionHistory.pop();
        last.parent.appendChild(last.block);
    }
    updateSimulation();
};

window.resetEquation = function() {
    if (typeof playSound === "function") playSound("trash");
    window.actionHistory = [];
    currentLevelData.reactants.forEach(m => {
        let row = document.getElementById("row-react-" + m.id);
        if(row) row.innerHTML = "";
    });
    currentLevelData.products.forEach(m => {
        let row = document.getElementById("row-prod-" + m.id);
        if(row) row.innerHTML = "";
    });
    if (window.hardFloorOfOne) {
        window.initDefaultMolecules();
    } else {
        updateSimulation();
    }
};

window.toggleFullScreen = function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen(); 
        }
    }
};


window.toggleMute = function() {
    window.isMuted = !window.isMuted;
    let on = document.getElementById("icon-sound-on");
    let off = document.getElementById("icon-sound-off");
    if(on && off) {
        on.style.display = window.isMuted ? "none" : "block";
        off.style.display = window.isMuted ? "block" : "none";
    }
    if (!window.isMuted && typeof playSound === "function") {
        playSound("pop");
    }
};


window.updateSimulation = function() {
    let dropReact = document.getElementById("react-drop-container");
    let dropProd = document.getElementById("prod-drop-container");
    if(dropReact && dropProd) {
        if(window.activeVisualHint) {
            if(window.activeVisualHint.side === "react") {
                dropReact.style.boxShadow = "0 0 0 6px rgba(192, 38, 211, 0.4) inset, 0 0 20px rgba(192, 38, 211, 0.3)";
                dropReact.style.background = "rgba(253, 244, 255, 0.8)";
                dropReact.style.animation = "flashHintDrop 1s infinite";
                dropProd.style.boxShadow = "none";
                dropProd.style.background = "transparent";
                dropProd.style.animation = "none";
            } else {
                dropProd.style.boxShadow = "0 0 0 6px rgba(192, 38, 211, 0.4) inset, 0 0 20px rgba(192, 38, 211, 0.3)";
                dropProd.style.background = "rgba(253, 244, 255, 0.8)";
                dropProd.style.animation = "flashHintDrop 1s infinite";
                dropReact.style.boxShadow = "none";
                dropReact.style.background = "transparent";
                dropReact.style.animation = "none";
            }
        } else {
            dropReact.style.boxShadow = "none";
            dropReact.style.background = "transparent";
            dropReact.style.animation = "none";
            dropProd.style.boxShadow = "none";
            dropProd.style.background = "transparent";
            dropProd.style.animation = "none";
        }
    }
    if(!currentLevelData) return;

    let rCounts = {}; let pCounts = {};
    window.molCounts = { react: {}, prod: {} }; let molCounts = window.molCounts;
    let isEmpty = true;

    currentLevelData.elements.forEach(el => { rCounts[el] = 0; pCounts[el] = 0; });

    currentLevelData.reactants.forEach(m => {
        let row = document.getElementById("row-react-" + m.id);
        let count = row ? row.children.length : 0;
        molCounts.react[m.id] = count;
        if(count > 0) isEmpty = false;
        for(let el in m.composition) { rCounts[el] += count * m.composition[el]; }
    });

    currentLevelData.products.forEach(m => {
        let row = document.getElementById("row-prod-" + m.id);
        let count = row ? row.children.length : 0;
        molCounts.prod[m.id] = count;
        if(count > 0) isEmpty = false;
        for(let el in m.composition) { pCounts[el] += count * m.composition[el]; }
    });

    // Hide empty rows
    currentLevelData.reactants.forEach(m => {
        let row = document.getElementById("row-react-" + m.id);
        let count = molCounts.react[m.id] || 0;
        if(row) row.style.display = count === 0 ? "none" : "flex";
    });
    currentLevelData.products.forEach(m => {
        let row = document.getElementById("row-prod-" + m.id);
        let count = molCounts.prod[m.id] || 0;
        if(row) row.style.display = count === 0 ? "none" : "flex";
    });

    window.counts = { rCounts, pCounts, isEmpty, molCounts };
    window.syncProBoxes();

    let leftSidebar = document.querySelector(".block-left .sidebar-grid");
    if(leftSidebar) {
        let html = "";
        currentLevelData.elements.forEach(el => {
            let rCount = rCounts[el]; let pCount = pCounts[el];
            let diff = rCount - pCount;
            let isBalanced = (rCount === pCount && rCount > 0);
            
            let colorClass = ""; let msg = "";
            if (isEmpty) { msg = "Add some molecules to start balancing!"; } 
            else if (isBalanced) { colorClass = "matched"; msg = "Yay! " + el + " atoms are perfectly balanced!"; } 
            else { msg = "Oh no, " + el + " atoms are unbalanced!"; }

            let rBookCount = 0; let leftBooks = "";
            while (rBookCount < rCount) {
                leftBooks += "<div class=\"book-col\" style=\"display:flex; flex-direction:column-reverse; gap:1px; margin:0;\">";
                for(let i=0; i<5 && rBookCount < rCount; i++, rBookCount++) { leftBooks += "<div class=\"book-block blue\"></div>"; }
                leftBooks += "</div>";
            }
            
            
            let pBookCount = 0; let rightBooks = "";
            while (pBookCount < pCount) {
                rightBooks += "<div class=\"book-col\" style=\"display:flex; flex-direction:column-reverse; gap:1px; margin:0;\">";
                for(let i=0; i<5 && pBookCount < pCount; i++, pBookCount++) { rightBooks += "<div class=\"book-block orange\"></div>"; }
                rightBooks += "</div>";
            }
            

            let angle = 0;
            if(diff > 0) angle = -3;
            if(diff < 0) angle = 3;
            
            let eqSymbol = (rCount === pCount) ? "=" : "&#8800;";
            let tallyClass = (rCount === 0 && pCount === 0) ? "empty" : (isBalanced ? "balanced" : "unbalanced");

            
            let diffBadge = "";
            if (rCount < pCount) {
                diffBadge = `<div style="position: absolute; top: -5px; left: -5px; background: #ef4444; color: white; border-radius: 50%; min-width: 28px; height: 28px; font-size: 13px; font-weight: 900; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 4px 10px rgba(239,68,68,0.5); animation: pulseWarning 1s infinite; z-index: 10;">-${pCount - rCount}</div>`;
            } else if (pCount < rCount) {
                diffBadge = `<div style="position: absolute; top: -5px; right: -5px; background: #ef4444; color: white; border-radius: 50%; min-width: 28px; height: 28px; font-size: 13px; font-weight: 900; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 4px 10px rgba(239,68,68,0.5); animation: pulseWarning 1s infinite; z-index: 10;">-${rCount - pCount}</div>`;
            }
            
            let visualGlow = "";
            if (window.activeVisualHint && window.activeVisualHint.element === el) {
                visualGlow = "animation: flashHintBox 1s infinite; z-index: 5;";
            }

            html += `
            <div class="pro-scale-card ${colorClass} has-chem-info" data-info="tracker-card" data-element="${el}" data-rcount="${rCount}" data-pcount="${pCount}" style="position: relative; ${visualGlow}">${diffBadge}
                <h3>${ELEM_NAMES[el] || el} (${el})</h3>
                <div class="scale-labels"><span>REACTANTS</span><span>PRODUCTS</span></div>


                <div class="mini-seesaw">
                    <div class="mini-plank" style="transform: rotate(${angle}deg); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
                        <div class="mini-stack-zone left" style="display:flex; align-items:flex-end;">${leftBooks}</div>
                        <div class="mini-stack-zone right" style="display:flex; align-items:flex-end;">${rightBooks}</div>
                    </div>
                    <div class="mini-fulcrum"></div>
                </div>
                <div class="scale-tally">
                    <div class="tally-box ${tallyClass}">${rCount}</div>
                    <div class="tally-eq ${tallyClass}" style="font-family: monospace;">${eqSymbol}</div>
                    <div class="tally-box ${tallyClass}">${pCount}</div>
                </div>
            </div>`;
        });
        leftSidebar.innerHTML = html;
    }

    const fReact = document.getElementById("footer-react");
    if (fReact) {
        let fHtml = "";
        currentLevelData.elements.forEach(el => {
            let isEmptyState = (rCounts[el] === 0);
            let isBalancedState = (rCounts[el] === pCounts[el] && !isEmptyState);
            let colorClass = isEmptyState ? "f-empty" : (isBalancedState ? "f-green" : "f-red");
            let textStyle = "color:white;";
            let smallMarble = getHyperMarble(el).replace("width: 28px; height: 28px;", "width: 22px; height: 22px; font-size: 11px;");
            fHtml += "<div class=\"footer-stat " + colorClass + " has-chem-info\" data-info=\"footer-count\" data-element=\"" + el + "\" data-side=\"react\" data-count=\"" + rCounts[el] + "\" style=\"flex:1; display:flex; justify-content:center; align-items:center; " + textStyle + " font-weight:900; gap:8px; font-size:1.1rem; padding: 5px; border-left: 1px solid rgba(255,255,255,0.2);\">" + smallMarble + "<span>= " + rCounts[el] + "</span></div>";
        });
        fReact.innerHTML = fHtml;
        if(fReact.children.length > 0) fReact.children[0].style.borderLeft = "none";
        let isReactEmpty = true; for(let el in rCounts) if(rCounts[el]>0) isReactEmpty = false;
        fReact.style.background = isReactEmpty ? "#000000" : (JSON.stringify(rCounts) === JSON.stringify(pCounts) ? "#22c55e" : "#ef4444");
        let reactDrop = document.getElementById("react-drop-container");
        if(reactDrop) reactDrop.classList.toggle("empty-drop", isReactEmpty);
    }

    const fProd = document.getElementById("footer-prod");
    if (fProd) {
        let fHtml = "";
        currentLevelData.elements.forEach(el => {
            let isEmptyState = (pCounts[el] === 0);
            let isBalancedState = (rCounts[el] === pCounts[el] && !isEmptyState);
            let colorClass = isEmptyState ? "f-empty" : (isBalancedState ? "f-green" : "f-red");
            let textStyle = "color:white;";
            let smallMarble = getHyperMarble(el).replace("width: 28px; height: 28px;", "width: 22px; height: 22px; font-size: 11px;");
            fHtml += "<div class=\"footer-stat " + colorClass + " has-chem-info\" data-info=\"footer-count\" data-element=\"" + el + "\" data-side=\"prod\" data-count=\"" + pCounts[el] + "\" style=\"flex:1; display:flex; justify-content:center; align-items:center; " + textStyle + " font-weight:900; gap:8px; font-size:1.1rem; padding: 5px; border-left: 1px solid rgba(255,255,255,0.2);\">" + smallMarble + "<span>= " + pCounts[el] + "</span></div>";
        });
        fProd.innerHTML = fHtml;
        if(fProd.children.length > 0) fProd.children[0].style.borderLeft = "none";
        let isProdEmpty = true; for(let el in pCounts) if(pCounts[el]>0) isProdEmpty = false;
        fProd.style.background = isProdEmpty ? "#000000" : (JSON.stringify(rCounts) === JSON.stringify(pCounts) ? "#22c55e" : "#ef4444");
        let prodDrop = document.getElementById("prod-drop-container");
        if(prodDrop) prodDrop.classList.toggle("empty-drop", isProdEmpty);
    }

    const giantReact = document.getElementById("adv-beaker-react");
    const giantProd = document.getElementById("adv-beaker-prod");
    const giantPlank = document.getElementById("adv-giant-plank");
    
    let totalReactAtoms = 0; let totalProdAtoms = 0;

    if(giantReact) {
        let html = "";
        currentLevelData.reactants.forEach(m => {
            let count = molCounts.react[m.id] || 0;
            for(let i=0; i<count; i++) {
                for(let el in m.composition) {
                    let atomCount = m.composition[el];
                    for(let j=0; j<atomCount; j++) { html += getHyperMarble(el); totalReactAtoms++; }
                }
            }
        });
        giantReact.innerHTML = html;
    }

    if(giantProd) {
        let html = "";
        currentLevelData.products.forEach(m => {
            let count = molCounts.prod[m.id] || 0;
            for(let i=0; i<count; i++) {
                for(let el in m.composition) {
                    let atomCount = m.composition[el];
                    for(let j=0; j<atomCount; j++) { html += getHyperMarble(el); totalProdAtoms++; }
                }
            }
        });
        giantProd.innerHTML = html;
    }

    if(giantPlank) {
        let diff = totalReactAtoms - totalProdAtoms;
        let angle = 0;
        if(diff > 0) angle = -3;
        if(diff < 0) angle = 3;
        if(totalReactAtoms === 0 && totalProdAtoms === 0) angle = 0;
        giantPlank.style.transform = "rotate(" + angle + "deg)";
    }

    // Update Equation Coefficients
    currentLevelData.reactants.forEach(m => {
        let el = document.getElementById("coeff-eq-react-" + m.id);
        if(el) {
            let count = molCounts.react[m.id] || 0;
            el.innerText = count;
            el.style.background = "#ef4444";
        }
    });
    currentLevelData.products.forEach(m => {
        let el = document.getElementById("coeff-eq-prod-" + m.id);
        if(el) {
            let count = molCounts.prod[m.id] || 0;
            el.innerText = count;
            el.style.background = "#ef4444";
        }
    });

    const statusLeft = document.querySelector(".status-left");
    const statusRight = document.querySelector(".status-right");
    if(statusLeft && statusRight) {
        let isBalanced = (!isEmpty && JSON.stringify(rCounts) === JSON.stringify(pCounts));
        let allCoeffs = [];
        let isComplete = true;
        currentLevelData.reactants.forEach(m => {
            let count = molCounts.react[m.id] || 0;
            if (count === 0) isComplete = false;
            allCoeffs.push(count);
        });
        currentLevelData.products.forEach(m => {
            let count = molCounts.prod[m.id] || 0;
            if (count === 0) isComplete = false;
            allCoeffs.push(count);
        });
        
        isBalanced = isBalanced && isComplete && !isEmpty;
        
        let isSimplified = false;
        if (isComplete && allCoeffs.length > 0) {
            let gcd = getArrayGCD(allCoeffs);
            isSimplified = (gcd === 1);
        }

        if (isBalanced) {
            statusLeft.innerHTML = "BALANCED"; statusLeft.style.background = "#22c55e";
        } else {
            statusLeft.innerHTML = "UNBALANCED"; statusLeft.style.background = "#ef4444";
        }

        if (isEmpty) {
            statusRight.innerHTML = "NO ATOMS"; statusRight.style.background = "#94a3b8";
            statusLeft.innerHTML = "EMPTY"; statusLeft.style.background = "#94a3b8";
        } else if (!isComplete || !isBalanced) {
            statusRight.innerHTML = "INCOMPLETE"; statusRight.style.background = "#ef4444";
        } else if (isSimplified) {
            statusRight.innerHTML = "SIMPLIFIED"; statusRight.style.background = "#22c55e";
        } else {
            statusRight.innerHTML = "NOT SIMPLIFIED"; statusRight.style.background = "#eab308";
        }
        
        // Handle Win State Detection
        const currentParamLvl = (new URLSearchParams(window.location.search).get('level') || '').toUpperCase();
        const isTutLevel = currentParamLvl.startsWith('TUT');

        if (isBalanced && isSimplified) {
            if (window.lastWinState !== "won") {
                if(typeof window.playSound === "function") window.playSound("success");
                window.lastWinState = "won";
                // In TUT0 interactive tutorial level, defer celebration modal until student reaches & clicks Finish Tour
                if (!isTutLevel || window.tutorialFinished) {
                    setTimeout(() => window.showWinPopup(true), 300);
                }
            }
        } else if (isBalanced && !isSimplified) {
            if (window.lastWinState !== "balanced") {
                if(typeof window.playSound === "function") window.playSound("success");
                window.lastWinState = "balanced";
                if (!isTutLevel || window.tutorialFinished) {
                    setTimeout(() => window.showWinPopup(false), 300);
                }
            }
        } else {
            window.lastWinState = "none";
        }

        if (typeof window.updateBarGraph === "function") {
            window.updateBarGraph(rCounts, pCounts, isBalanced);
        // Reset two-stage clue state ONLY if student actually added or removed a molecule
        let currentBoardState = JSON.stringify(rCounts) + JSON.stringify(pCounts);
        if (window.clueState && window.clueState.stage === 2) {
            if (window.clueState.boardState && window.clueState.boardState !== currentBoardState) {
                window.clueState = { el: null, side: null, stage: 1, boardState: null };
                let dynamicLabel = document.getElementById('clue-btn-dynamic-text');
                if (dynamicLabel) dynamicLabel.textContent = "I am Stuck! Help!";
            }
        }
        }

        if (typeof window.checkProactiveBeakerGuidance === "function") {
            window.checkProactiveBeakerGuidance(rCounts, pCounts, isBalanced);
        }
    }
};


// ==========================================
// Phase 2: Prof. Beaker AI & Study Room System
// ==========================================
window.beakerChatHistory = [];
window.isBeakerThinking = false;
window.unproductiveMovesCount = 0;
window.lastBalanceScore = 999;
window.proactiveBeakerTriggeredForLevel = false;
window.idleGuidanceTimer = null;

window.resetIdleGuidanceTimer = function() {
    if (window.idleGuidanceTimer) clearTimeout(window.idleGuidanceTimer);
    if (window.isChallengeMode) return;
    window.idleGuidanceTimer = setTimeout(() => {
        // If student is already actively chatting, don't interrupt with idle cards
        if (window.beakerChatHistory && window.beakerChatHistory.length > 0) return;
        if (!window.proactiveBeakerTriggeredForLevel && window.counts && !window.counts.isEmpty) {
            let rCounts = window.counts.rCounts || {};
            let pCounts = window.counts.pCounts || {};
            let worstEl = null;
            let maxDiff = 0;
            for (let el in rCounts) {
                let diff = Math.abs((rCounts[el] || 0) - (pCounts[el] || 0));
                if (diff > maxDiff) { maxDiff = diff; worstEl = el; }
            }
            if (worstEl && maxDiff > 0) {
                window.proactiveBeakerTriggeredForLevel = true;
                if (typeof playSound === 'function') playSound('pop');
                let elName = ELEM_NAMES[worstEl] || worstEl;
                let leftC = rCounts[worstEl] || 0;
                let rightC = pCounts[worstEl] || 0;
                let marbleHtml = (typeof getHyperMarble === 'function') ? getHyperMarble(worstEl) : (typeof getAtomMarble === 'function' ? getAtomMarble(worstEl) : `<b>${worstEl}</b>`);
                let cardHtml = `
                <div class="chat-clue-card">
                    <div class="chat-clue-header">
                        ${marbleHtml}
                        <span><b>${elName}</b> is off!</span>
                    </div>
                    <div class="chat-scale-row">
                        <div class="chat-side-pill left">Left: <b>${leftC}</b></div>
                        <div class="chat-scale-icon">⚖️</div>
                        <div class="chat-side-pill right">Right: <b>${rightC}</b></div>
                    </div>
                    <div class="chat-action-box" style="background:#eff6ff; border-color:#93c5fd; color:#1e40af;">
                        💡 Tap <b>I am Stuck! Help!</b> below for help!
                    </div>
                </div>`;
                window.addChatMessage(cardHtml, "Prof. Beaker", "assistant");
            }
        }
    }, 50000);
};

window.checkProactiveBeakerGuidance = function(rCounts, pCounts, isBalanced) {
    if (isBalanced) {
        window.unproductiveMovesCount = 0;
        return;
    }
    
    let totalImbalance = 0;
    let worstElement = null;
    let maxDiff = 0;
    for (let el in rCounts) {
        let diff = Math.abs((rCounts[el] || 0) - (pCounts[el] || 0));
        totalImbalance += diff;
        if (diff > maxDiff) {
            maxDiff = diff;
            worstElement = el;
        }
    }
    
    if (totalImbalance >= window.lastBalanceScore) {
        window.unproductiveMovesCount++;
    } else {
        window.unproductiveMovesCount = Math.max(0, window.unproductiveMovesCount - 1);
    }
    window.lastBalanceScore = totalImbalance;
    
    if (window.unproductiveMovesCount >= 5 && !window.proactiveBeakerTriggeredForLevel && worstElement) {
        window.proactiveBeakerTriggeredForLevel = true;
        window.unproductiveMovesCount = 0;
        let elName = ELEM_NAMES[worstElement] || worstElement;
        let leftC = rCounts[worstElement] || 0;
        let rightC = pCounts[worstElement] || 0;
        setTimeout(() => {
            if (typeof playSound === 'function') playSound('pop');
            let marbleHtml = (typeof getHyperMarble === 'function') ? getHyperMarble(worstElement) : (typeof getAtomMarble === 'function' ? getAtomMarble(worstElement) : `<b>${worstElement}</b>`);
            let cardHtml = `
            <div class="chat-clue-card">
                <div class="chat-clue-header">
                    ${marbleHtml}
                    <span><b>${elName}</b> needs balance!</span>
                </div>
                <div class="chat-scale-row">
                    <div class="chat-side-pill left">Left: <b>${leftC}</b></div>
                    <div class="chat-scale-icon">⚖️</div>
                    <div class="chat-side-pill right">Right: <b>${rightC}</b></div>
                </div>
                <div class="chat-action-box" style="background:#eff6ff; border-color:#93c5fd; color:#1e40af;">
                    💡 Tap <b>I am Stuck! Help!</b> or add <b>${worstElement}</b> to balance!
                </div>
            </div>`;
            window.addChatMessage(cardHtml, "Prof. Beaker", "assistant");
        }, 350);
    }
};

function parseProfBeakerMarkdown(text) {
    if (typeof text !== 'string') return text;
    if (text.includes('<div') || text.includes('<table')) return text;

    function parseInline(str) {
        if (!str) return '';
        // Bold and Italic
        str = str.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        str = str.replace(/\*(.*?)\*/g, '<i>$1</i>');
        // Colored text tags: [blue:text], [orange:text], [green:text]
        str = str.replace(/\[blue:(.*?)\]/gi, '<span class="chat-highlight-blue">$1</span>');
        str = str.replace(/\[orange:(.*?)\]/gi, '<span class="chat-highlight-orange">$1</span>');
        str = str.replace(/\[green:(.*?)\]/gi, '<span class="chat-highlight-green">$1</span>');
        // Convert chemical formulas with plain numbers into Unicode subscripts (e.g. N2 -> N₂, H2 -> H₂, NH3 -> NH₃, CO2 -> CO₂)
        const subMap = { '0':'₀', '1':'₁', '2':'₂', '3':'₃', '4':'₄', '5':'₅', '6':'₆', '7':'₇', '8':'₈', '9':'₉' };
        str = str.replace(/\b([A-Z][a-z]?)(\d+)\b/g, (m, el, num) => {
            let sub = num.split('').map(d => subMap[d] || d).join('');
            return `${el}${sub}`;
        });
        return str;
    }

    let lines = text.split('\n');
    let inTable = false;
    let tableRows = [];
    let processedLines = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line.startsWith('|') && line.endsWith('|')) {
            inTable = true;
            if (/^\|(\s*:?-+:?\s*\|)+$/.test(line)) {
                continue; // skip delimiter row
            }
            let cells = line.slice(1, -1).split('|').map(c => c.trim());
            tableRows.push(cells);
        } else {
            if (inTable && tableRows.length > 0) {
                let header = tableRows[0];
                let body = tableRows.slice(1);
                let tHtml = '<table class="chat-table"><thead><tr>';
                header.forEach(h => { tHtml += `<th>${parseInline(h)}</th>`; });
                tHtml += '</tr></thead><tbody>';
                body.forEach(row => {
                    tHtml += '<tr>';
                    row.forEach(cell => { tHtml += `<td>${parseInline(cell)}</td>`; });
                    tHtml += '</tr>';
                });
                tHtml += '</tbody></table>';
                processedLines.push(tHtml);
                tableRows = [];
                inTable = false;
            }
            if (line.length > 0) {
                processedLines.push(parseInline(line));
            }
        }
    }

    if (inTable && tableRows.length > 0) {
        let header = tableRows[0];
        let body = tableRows.slice(1);
        let tHtml = '<table class="chat-table"><thead><tr>';
        header.forEach(h => { tHtml += `<th>${parseInline(h)}</th>`; });
        tHtml += '</tr></thead><tbody>';
        body.forEach(row => {
            tHtml += '<tr>';
            row.forEach(cell => { tHtml += `<td>${parseInline(cell)}</td>`; });
            tHtml += '</tr>';
        });
        tHtml += '</tbody></table>';
        processedLines.push(tHtml);
    }

    return processedLines.join('<br>').replace(/(<br>)*(<table class="chat-table">[\s\S]*?<\/table>)(<br>)*/g, '$2');
}

window.addChatMessage = function(msg, prefixLabel, role = 'assistant') {
    let containers = [
        document.querySelector(".beaker-message"),
        document.getElementById("study-room-messages")
    ].filter(Boolean);
    if(containers.length === 0) return;
    
    let isUser = (role === 'user');
    let isHint = prefixLabel && (prefixLabel.includes("Hint") || prefixLabel.includes("Clue") || prefixLabel.includes("Step") || prefixLabel.includes("Guide") || prefixLabel.includes("Solution"));
    
    // High-contrast, unmistakable styling per sender
    let badgeBg = isUser ? '#1e3a8a' : (isHint ? '#d97706' : '#0284c7');
    let badgeColor = '#ffffff';
    let badgeIcon = isUser ? '🎓 ' : (isHint ? '💡 ' : '🧪 ');
    let badgeText = badgeIcon + (prefixLabel || (isUser ? 'Student' : 'Prof. Beaker'));
    
    let bubbleBg = isUser ? '#2563eb' : (isHint ? '#fffdf0' : '#ffffff');
    let bubbleBorder = isUser ? '2.5px solid #1d4ed8' : (isHint ? '2.5px solid #f59e0b' : '2.5px solid #cbd5e1');
    let textColor = isUser ? '#ffffff' : '#0f172a';
    let align = isUser ? 'flex-end' : 'flex-start';
    let radius = isUser ? 'border-radius: 16px; border-bottom-right-radius: 3px;' : 'border-radius: 16px; border-top-left-radius: 3px;';
    let bubbleShadow = isUser ? 'box-shadow: 0 4px 10px rgba(37,99,235,0.25);' : (isHint ? 'box-shadow: 0 4px 12px rgba(245,158,11,0.18);' : 'box-shadow: 0 3px 8px rgba(0,0,0,0.06);');
    let maxW = isUser ? 'max-width: 85%;' : 'max-width: 95%;';
    
    // Convert markdown formatting into HTML with tables, colors, and subscripts
    let parsedMsg = parseProfBeakerMarkdown(msg);
    
    let bubbleStyle = `background: ${bubbleBg}; border: ${bubbleBorder}; ${radius}; padding: 11px 14px; font-size: 0.94rem; color: ${textColor}; ${bubbleShadow} line-height: 1.45; font-weight: ${isUser ? '700' : '600'}; ${maxW} word-break: break-word;`;
    
    let finalHtml = `
    <div style="display: flex; flex-direction: column; align-items: ${align}; width: 100%;">
        <div class="beaker-sender-tag" style="background: ${badgeBg}; color: ${badgeColor}; font-weight: 900; font-size: 0.76rem; letter-spacing: 0.3px; padding: 2px 10px; border-radius: 6px; margin-bottom: 4px; ${isUser ? 'margin-right: 6px;' : 'margin-left: 6px;'} box-shadow: 0 2px 4px rgba(0,0,0,0.15);">
            ${badgeText}
        </div>
        <div class="beaker-bubble-text" style="${bubbleStyle}">
            ${parsedMsg}
        </div>
    </div>`;
    
    containers.forEach(c => {
        let bubbleContainer = document.createElement("div");
        bubbleContainer.style.cssText = "margin-top: 12px; width: 100%; box-sizing: border-box;";
        bubbleContainer.innerHTML = finalHtml;
        c.appendChild(bubbleContainer);
        c.scrollTop = c.scrollHeight;
    });
};

window.clearChat = function(userInitiated) {
    if (userInitiated && typeof playSound === "function") playSound("trash");
    let c1 = document.querySelector(".beaker-message");
    if(c1) c1.innerHTML = "";
    let c2 = document.getElementById("study-room-messages");
    if(c2) c2.innerHTML = "";
    window.beakerChatHistory = [];
    window.clueState = { el: null, side: null, stage: 1, boardState: null };
    let dynamicLabel = document.getElementById('clue-btn-dynamic-text');
    if (dynamicLabel) dynamicLabel.textContent = "I am Stuck! Help!";
};


window.getLocalProfBeakerReply = function(userPrompt, lvl, rCounts, pCounts) {
    const p = (userPrompt || '').toLowerCase();
    
    // 1. Greetings
    if (/\b(hi|hello|hey|halo|salam|morning|afternoon|evening|yo)\b/.test(p)) {
        return "Hello there! Professor Beaker here, glad to have you in the lab. Take a look at the seesaw scale in the center. Let us balance this equation together!";
    }
    
    // 2. Ready / Start / Let's go
    if (/\b(let|lets|let's|start|begin|ready|go|ok|okay)\b/.test(p)) {
        return "Let's do this! Check the element trays on the left to spot which atoms are uneven, and add molecules using the plus buttons to level the seesaw.";
    }
    
    // 3. Coefficients and Subscripts
    if (/\b(coeff|coefficient|subscript|number|numbers)\b/.test(p)) {
        return "Great question! The big numbers in front are **coefficients** (how many molecule bundles you have). The small numbers like the ₂ in N₂ are **subscripts** (atoms bonded inside). You can change coefficients, but never subscripts!";
    }
    
    // 4. Starting Over / Reset
    if (/\b(reset|start over|clear|restart|trash|undo)\b/.test(p)) {
        return "To start fresh, tap the red **trash can button** (🗑️) next to the hint button below to reset all coefficients to 1, or click any molecule block in the drop zones to remove it!";
    }
    
    // 5. How to balance / MINOH rule / Stuck
    if (/\b(how|what|balance|minoh|rule|stuck|help|clue|hint|guide|next)\b/.test(p)) {
        let worstEl = null;
        let maxDiff = 0;
        for (let el in rCounts) {
            let diff = Math.abs((rCounts[el] || 0) - (pCounts[el] || 0));
            if (diff > maxDiff) { maxDiff = diff; worstEl = el; }
        }
        if (worstEl && maxDiff > 0) {
            let elName = (window.ELEM_NAMES && window.ELEM_NAMES[worstEl]) || worstEl;
            let lighterSide = (rCounts[worstEl] || 0) < (pCounts[worstEl] || 0) ? "Reactants (Left)" : "Products (Right)";
            return `Follow the **MINOH** strategy! Right now, **${elName}** is uneven (${rCounts[worstEl] || 0} Left vs ${pCounts[worstEl] || 0} Right). Try adding a molecule with **${worstEl}** to the **${lighterSide}** side, or tap **I am Stuck! Help!** below for the exact step!`;
        }
        return "Follow the **MINOH** strategy: Metals first, then Polyatomic ions, Non-metals next, Oxygen near the end, and Hydrogen last! Tap **I am Stuck! Help!** below for step-by-step guidance.";
    }
    
    // 6. Generic friendly contextual reply
    let worstEl = null;
    let maxDiff = 0;
    for (let el in rCounts) {
        let diff = Math.abs((rCounts[el] || 0) - (pCounts[el] || 0));
        if (diff > maxDiff) { maxDiff = diff; worstEl = el; }
    }
    if (worstEl && maxDiff > 0) {
        let elName = (window.ELEM_NAMES && window.ELEM_NAMES[worstEl]) || worstEl;
        return `I am here to help! Looking at the scales, **${elName}** is currently off balance. Try adjusting the coefficient for molecules containing **${worstEl}**, or click **I am Stuck! Help!** below for a direct clue.`;
    }
    
    return "You are doing great! Keep comparing the atom counts on both sides of the reaction arrow. If you need a hint, tap the yellow button below!";
};

window.askProfBeaker = async function(userPrompt) {
    if (!userPrompt || !userPrompt.trim()) return;
    if (window.isBeakerThinking) return;

    userPrompt = userPrompt.trim();
    if (typeof playSound === 'function') playSound('click');
    if (typeof window.resetIdleGuidanceTimer === 'function') window.resetIdleGuidanceTimer();

    // 1. Render user message in chat
    window.addChatMessage(userPrompt, "Student", "user");

    // Clear input fields
    const inputEl = document.getElementById('beaker-chat-input');
    if (inputEl) inputEl.value = '';
    const studyInputEl = document.getElementById('study-room-input');
    if (studyInputEl) studyInputEl.value = '';

    // 2. Add typing indicator
    window.isBeakerThinking = true;
    const sendBtn = document.getElementById('btn-beaker-send');
    if (sendBtn) { sendBtn.disabled = true; sendBtn.style.opacity = '0.6'; }
    const studySendBtn = document.getElementById('btn-study-room-send');
    if (studySendBtn) { studySendBtn.disabled = true; studySendBtn.style.opacity = '0.6'; }

    const typingId = 'beaker-typing-indicator';
    let container = document.querySelector('.beaker-message');
    let studyContainer = document.getElementById('study-room-messages');

    function showTypingBubble(targetContainer) {
        if (!targetContainer) return;
        const typingEl = document.createElement('div');
        typingEl.id = typingId;
        typingEl.style.cssText = 'margin-top: 10px; display: flex; flex-direction: column; align-items: flex-start;';
        typingEl.innerHTML = `
            <div style="background: #f0f9ff; color: #0369a1; font-weight: 900; font-size: 0.75rem; padding: 2px 8px; border-radius: 6px; margin-bottom: 4px; margin-left: 8px; border: 1px solid #bae6fd;">Prof. Beaker</div>
            <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 14px; border-top-left-radius: 3px; padding: 8px 14px;">
                <div class="chat-typing-dots">
                    <div class="chat-typing-dot"></div>
                    <div class="chat-typing-dot"></div>
                    <div class="chat-typing-dot"></div>
                </div>
            </div>`;
        targetContainer.appendChild(typingEl);
        targetContainer.scrollTop = targetContainer.scrollHeight;
    }
    showTypingBubble(container);
    showTypingBubble(studyContainer);

    // 3. Build Level Context
    let levelContext = '';
    if (currentLevelData) {
        const rCounts = window.counts?.rCounts || {};
        const pCounts = window.counts?.pCounts || {};
        const molReact = window.molCounts?.react || {};
        const molProd = window.molCounts?.prod || {};
        levelContext = `Level Title: ${currentLevelData.title}
Chemical Equation: ${currentLevelData.equation}
Current Reactant Multipliers: ${JSON.stringify(molReact)}
Current Product Multipliers: ${JSON.stringify(molProd)}
Current Reactant Atom Totals: ${JSON.stringify(rCounts)}
Current Product Atom Totals: ${JSON.stringify(pCounts)}`;
    }

    // 4. Fetch DeepSeek from local proxy
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userPrompt,
                history: window.beakerChatHistory || [],
                levelContext: levelContext
            })
        });

        const data = await response.json();
        document.querySelectorAll('#' + typingId).forEach(el => el.remove());

        if (data.reply) {
            let cleanReply = data.reply.replace(/\u2014/g, ' - ').replace(/;/g, ',');
            window.addChatMessage(cleanReply, 'Prof. Beaker', 'assistant');
            window.beakerChatHistory = window.beakerChatHistory || [];
            window.beakerChatHistory.push({ role: 'user', content: userPrompt });
            window.beakerChatHistory.push({ role: 'assistant', content: cleanReply });
            if (typeof playSound === 'function') playSound('pop');
        } else {
            const rCounts = window.counts?.rCounts || {};
            const pCounts = window.counts?.pCounts || {};
            let fallbackReply = window.getLocalProfBeakerReply(userPrompt, currentLevelData, rCounts, pCounts);
            window.addChatMessage(fallbackReply, 'Prof. Beaker', 'assistant');
            window.beakerChatHistory = window.beakerChatHistory || [];
            window.beakerChatHistory.push({ role: 'user', content: userPrompt });
            window.beakerChatHistory.push({ role: 'assistant', content: fallbackReply });
            if (typeof playSound === 'function') playSound('pop');
        }
    } catch (err) {
        document.querySelectorAll('#' + typingId).forEach(el => el.remove());
        const rCounts = window.counts?.rCounts || {};
        const pCounts = window.counts?.pCounts || {};
        let fallbackReply = window.getLocalProfBeakerReply(userPrompt, currentLevelData, rCounts, pCounts);
        window.addChatMessage(fallbackReply, 'Prof. Beaker', 'assistant');
        window.beakerChatHistory = window.beakerChatHistory || [];
        window.beakerChatHistory.push({ role: 'user', content: userPrompt });
        window.beakerChatHistory.push({ role: 'assistant', content: fallbackReply });
        if (typeof playSound === 'function') playSound('pop');
    } finally {
        window.isBeakerThinking = false;
        if (sendBtn) { sendBtn.disabled = false; sendBtn.style.opacity = '1'; }
        if (studySendBtn) { studySendBtn.disabled = false; studySendBtn.style.opacity = '1'; }
    }
};

window.sendChipPrompt = function(promptText) {
    window.askProfBeaker(promptText);
};

window.submitBeakerInput = function() {
    const inputEl = document.getElementById('beaker-chat-input');
    if (inputEl && inputEl.value.trim()) {
        window.askProfBeaker(inputEl.value.trim());
    }
};

window.openStudyRoomModal = function() {
    let modal = document.getElementById('study-room-modal');
    if (!modal || !currentLevelData) return;
    
    let titleEl = document.getElementById('study-room-level-name');
    if (titleEl) titleEl.innerText = (currentLevelData.title || '') + ' • SPM Chemistry Chapter 3';
    
    let eqEl = document.getElementById('study-room-equation');
    if (eqEl) {
        let eqFormatted = (currentLevelData.equation || '').replace(/([₂₃₄₅₆₇₈₉])/g, '<span style="font-size:0.7em; vertical-align:sub; font-weight:900;">$1</span>');
        eqEl.innerHTML = eqFormatted;
    }
    
    let tableContainer = document.getElementById('study-room-mass-table');
    if (tableContainer) {
        let rCounts = window.counts?.rCounts || {};
        let pCounts = window.counts?.pCounts || {};
        let elementsHtml = '';
        
        currentLevelData.elements.forEach(el => {
            let r = rCounts[el] || 0;
            let p = pCounts[el] || 0;
            let elName = ELEM_NAMES[el] || el;
            let marble = (typeof getHyperMarble === 'function') ? getHyperMarble(el) : (typeof getAtomMarble === 'function' ? getAtomMarble(el) : `<b>${el}</b>`);
            let maxCount = Math.max(r, p, 1);
            let rPct = Math.min(100, Math.round((r / maxCount) * 100));
            let pPct = Math.min(100, Math.round((p / maxCount) * 100));
            
            let statusBadge = '';
            let scaleIcon = '⚖️';
            if (r === p && r > 0) {
                statusBadge = `<span style="background:#dcfce7; color:#15803d; border:1.5px solid #86efac; border-radius:8px; padding:2px 8px; font-size:0.75rem; font-weight:800; display:inline-flex; align-items:center; gap:4px;">⚖️ Balanced (${r} = ${p})</span>`;
                scaleIcon = '⚖️';
            } else if (r < p) {
                statusBadge = `<span style="background:#fef2f2; color:#b91c1c; border:1.5px solid #fca5a5; border-radius:8px; padding:2px 8px; font-size:0.75rem; font-weight:800; display:inline-flex; align-items:center; gap:4px;">⚠️ Need +${p - r} on Left</span>`;
                scaleIcon = '⚖️';
            } else if (r > p) {
                statusBadge = `<span style="background:#fef2f2; color:#b91c1c; border:1.5px solid #fca5a5; border-radius:8px; padding:2px 8px; font-size:0.75rem; font-weight:800; display:inline-flex; align-items:center; gap:4px;">⚠️ Need +${r - p} on Right</span>`;
                scaleIcon = '⚖️';
            } else {
                statusBadge = `<span style="background:#f1f5f9; color:#64748b; border:1.5px solid #cbd5e1; border-radius:8px; padding:2px 8px; font-size:0.75rem; font-weight:800;">Empty (0 = 0)</span>`;
            }
            
            let color = ATOM_COLORS[el] || { bg: "#94a3b8", color: "white" };
            
            // Build visual marble rows
            let rBalls = '';
            let pBalls = '';
            let rMax = Math.min(r, 8);
            for (let i = 0; i < rMax; i++) {
                rBalls += `<div style="width:16px; height:16px; border-radius:50%; background:${color.bg}; display:inline-flex; align-items:center; justify-content:center; color:${color.color}; font-size:8px; font-weight:900; box-shadow:inset -1px -1px 2px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.15); border:1px solid rgba(0,0,0,0.2); margin-right:2px;">${el}</div>`;
            }
            if (r > 8) rBalls += `<span style="font-size:0.75rem; font-weight:800; color:#64748b; margin-left:2px;">+${r - 8}</span>`;
            if (r === 0) rBalls = '<span style="font-size:0.72rem; color:#94a3b8; font-weight:700;">0 atoms</span>';
            
            let pMax = Math.min(p, 8);
            for (let i = 0; i < pMax; i++) {
                pBalls += `<div style="width:16px; height:16px; border-radius:50%; background:${color.bg}; display:inline-flex; align-items:center; justify-content:center; color:${color.color}; font-size:8px; font-weight:900; box-shadow:inset -1px -1px 2px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.15); border:1px solid rgba(0,0,0,0.2); margin-right:2px;">${el}</div>`;
            }
            if (p > 8) pBalls += `<span style="font-size:0.75rem; font-weight:800; color:#64748b; margin-left:2px;">+${p - 8}</span>`;
            if (p === 0) pBalls = '<span style="font-size:0.72rem; color:#94a3b8; font-weight:700;">0 atoms</span>';
            
            elementsHtml += `
            <div style="background:#ffffff; border:2px solid #e2e8f0; border-radius:14px; padding:10px 12px; box-shadow:0 2px 4px rgba(0,0,0,0.04); display:flex; flex-direction:column; gap:8px;">
                <div style="display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        ${marble}
                        <span style="font-size:0.92rem; font-weight:900; color:#1e293b;">${elName} (${el})</span>
                    </div>
                    ${statusBadge}
                </div>
                
                <!-- Side-by-Side Visual Bar & Balls -->
                <div style="display:grid; grid-template-columns:1fr auto 1fr; gap:10px; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:8px 10px;">
                    <!-- Reactants LHS -->
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; font-weight:800;">
                            <span style="color:#2563eb;">Reactants</span>
                            <span style="background:#dbeafe; color:#1d4ed8; padding:1px 6px; border-radius:6px;">${r}</span>
                        </div>
                        <div style="height:6px; background:#e2e8f0; border-radius:3px; overflow:hidden;">
                            <div style="height:100%; width:${rPct}%; background:#3b82f6; border-radius:3px; transition:width 0.3s ease;"></div>
                        </div>
                        <div style="display:flex; align-items:center; min-height:18px; margin-top:2px;">
                            ${rBalls}
                        </div>
                    </div>
                    
                    <!-- Middle Pivot -->
                    <div style="font-size:1.1rem; line-height:1; display:flex; align-items:center; justify-content:center; color:#64748b;">
                        ${scaleIcon}
                    </div>
                    
                    <!-- Products RHS -->
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; font-weight:800;">
                            <span style="color:#ea580c;">Products</span>
                            <span style="background:#ffedd5; color:#c2410c; padding:1px 6px; border-radius:6px;">${p}</span>
                        </div>
                        <div style="height:6px; background:#e2e8f0; border-radius:3px; overflow:hidden;">
                            <div style="height:100%; width:${pPct}%; background:#f97316; border-radius:3px; transition:width 0.3s ease;"></div>
                        </div>
                        <div style="display:flex; align-items:center; min-height:18px; margin-top:2px;">
                            ${pBalls}
                        </div>
                    </div>
                </div>
            </div>`;
        });
        
        tableContainer.innerHTML = elementsHtml;
    }

    modal.style.display = 'flex';
};

window.closeStudyRoomModal = function() {
    let modal = document.getElementById('study-room-modal');
    if (modal) modal.style.display = 'none';
};

window.sendStudyRoomPrompt = function(promptText) {
    window.askProfBeaker(promptText);
};

window.submitStudyRoomInput = function() {
    const inputEl = document.getElementById('study-room-input');
    if (inputEl && inputEl.value.trim()) {
        let val = inputEl.value.trim();
        inputEl.value = '';
        window.askProfBeaker(val);
    }
};

window.clueState = window.clueState || { el: null, side: null, stage: 1 };

window.revealGuidedSolvingHint = function() {
    if(typeof playSound === "function") playSound("hint");
    if(!currentLevelData) return;
    
    let rCounts = window.counts ? window.counts.rCounts : {};
    let pCounts = window.counts ? window.counts.pCounts : {};
    
    // MINOH Heuristic Priority: Metals (1) -> Non-metals (2) -> Oxygen (3) -> Hydrogen (4)
    function getMinohWeight(el) {
        const METALS = new Set(['Na', 'K', 'Ca', 'Mg', 'Al', 'Zn', 'Fe', 'Pb', 'Cu', 'Ag', 'Ba', 'Li', 'Sn', 'Ni', 'Mn', 'Cr']);
        if (METALS.has(el)) return 1;
        if (el === 'O') return 3;
        if (el === 'H') return 4;
        return 2; // Non-metals (C, N, Cl, S, P, etc.)
    }

    let candidates = [];
    for (let el in rCounts) {
        let diff = Math.abs((rCounts[el] || 0) - (pCounts[el] || 0));
        if (diff > 0) {
            candidates.push({
                el,
                diff,
                weight: getMinohWeight(el),
                needsMoreOn: ((rCounts[el] || 0) < (pCounts[el] || 0)) ? "react" : "prod"
            });
        }
    }

    candidates.sort((a, b) => {
        if (a.weight !== b.weight) return a.weight - b.weight;
        return b.diff - a.diff;
    });

    let bestCandidate = candidates[0] || null;
    let imbalancedEl = bestCandidate ? bestCandidate.el : null;
    let needsMoreOn = bestCandidate ? bestCandidate.needsMoreOn : null;
    let maxDiff = bestCandidate ? bestCandidate.diff : 0;
    
    if (window.counts && window.counts.isEmpty) {
        window.addChatMessage("Add some molecules to the scales to begin balancing!", "Guided Step");
        return;
    }
    if (!imbalancedEl || maxDiff === 0) {
        window.addChatMessage("All atoms are currently balanced! Review your atom counters or proceed to the next challenge.", "Guided Step");
        return;
    }
    
    let sideName = (needsMoreOn === "react") ? "Reactants" : "Products";
    let targetMols = (needsMoreOn === "react") ? currentLevelData.reactants : currentLevelData.products;
    let bestMolObj = targetMols.find(m => m.composition[imbalancedEl]) || targetMols[0];
    
    window.activeVisualHint = { element: imbalancedEl, side: needsMoreOn };
    updateSimulation();
    
    let elName = ELEM_NAMES[imbalancedEl] || imbalancedEl;
    let rVal = rCounts[imbalancedEl] || 0;
    let pVal = pCounts[imbalancedEl] || 0;
    let marbleHtml = (typeof getHyperMarble === 'function') ? getHyperMarble(imbalancedEl) : (typeof getAtomMarble === 'function' ? getAtomMarble(imbalancedEl) : `<b>${imbalancedEl}</b>`);
    let dynamicLabel = document.getElementById('clue-btn-dynamic-text');

    // Check if this is a repeat tap on the exact same imbalance: STAGE 2 (Full Solution + Explanation)
    if (window.clueState.el === imbalancedEl && window.clueState.side === needsMoreOn && window.clueState.stage === 2) {
        let cardHtml = `
        <div class="chat-clue-card">
            <div class="chat-clue-header">
                ${marbleHtml}
                <span style="color: #1e293b;"><b>Solution Move:</b> Balance <b>${elName}</b></span>
            </div>
            <div class="chat-scale-row">
                <div class="chat-side-pill left">Left: <b>${rVal}</b></div>
                <div class="chat-scale-icon">⚖️</div>
                <div class="chat-side-pill right">Right: <b>${pVal}</b></div>
            </div>
            <div class="chat-action-box" style="background: #eff6ff; border: 2px solid #3b82f6; color: #1d4ed8; font-size: 0.98rem; font-weight: 800;">
                👉 Tap <b>+ ${bestMolObj.displayHtml}</b> on <b>${sideName}</b>!
            </div>
            <div style="font-size: 0.84rem; color: #475569; font-weight: 700; margin-top: 6px; line-height: 1.35; padding: 7px 10px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px;">
                🔬 <b>Why?</b> ${bestMolObj.displayHtml} contains ${imbalancedEl}. Adding it increases ${sideName} atoms towards equal balance!
            </div>
        </div>`;
        window.addChatMessage(cardHtml, "Step Solution #" + (window.hintCounter++));
        window.clueState = { el: null, side: null, stage: 1 };
        if (dynamicLabel) dynamicLabel.textContent = "I am Stuck! Help!";
    } else {
        // STAGE 1: Socratic Guidance (Guide the student first)
        let curState = JSON.stringify(rCounts) + JSON.stringify(pCounts);
        window.clueState = { el: imbalancedEl, side: needsMoreOn, stage: 2, boardState: curState };
        if (dynamicLabel) dynamicLabel.textContent = "Give me answer!";
        
        let cardHtml = `
        <div class="chat-clue-card">
            <div class="chat-clue-header">
                ${marbleHtml}
                <span><b>${elName}</b> is uneven!</span>
            </div>
            <div class="chat-scale-row">
                <div class="chat-side-pill left">Left: <b>${rVal}</b></div>
                <div class="chat-scale-icon">⚖️</div>
                <div class="chat-side-pill right">Right: <b>${pVal}</b></div>
            </div>
            <div class="chat-action-box" style="background: #fffbeb; border: 2px dashed #f59e0b; color: #92400e;">
                🤔 The <b>${sideName}</b> side is lighter on <b>${elName}</b>. Can you spot a molecule with <b>${imbalancedEl}</b> on ${sideName} to even it out?
            </div>
            <div style="font-size: 0.82rem; color: #b45309; font-weight: 800; margin-top: 6px; text-align: center; background: rgba(254, 243, 199, 0.7); padding: 5px 10px; border-radius: 8px; border: 1.5px solid rgba(245, 158, 11, 0.35);">
                ✨ <b>MINOH Rule:</b> ${bestCandidate && bestCandidate.weight === 1 ? 'Metals first!' : (bestCandidate && bestCandidate.weight === 2 ? 'Non-metals before O & H!' : (bestCandidate && bestCandidate.weight === 3 ? 'Balance Oxygen now!' : 'Hydrogen finishes last!'))}
            </div>
        </div>`;
        window.addChatMessage(cardHtml, "Step Guide #" + (window.hintCounter++));
    }
};
window.revealHeuristicHint = window.revealGuidedSolvingHint;



window.currentViewMode = "scale";

window.updateBarGraph = function(rCounts, pCounts, isBalanced) {
    const container = document.getElementById('section-bar-graph');
    const lvl = (typeof currentLevelData !== 'undefined' && currentLevelData) ? currentLevelData : window.currentLevelData;
    if (!container || !lvl) return;

    if (!rCounts || !pCounts) {
        if (window.counts) {
            rCounts = window.counts.rCounts || {};
            pCounts = window.counts.pCounts || {};
            isBalanced = (JSON.stringify(rCounts) === JSON.stringify(pCounts) && !window.counts.isEmpty);
        } else {
            rCounts = {};
            pCounts = {};
            isBalanced = false;
        }
    }

    const rBox = document.getElementById('bar-graph-reactants');
    const pBox = document.getElementById('bar-graph-products');
    const symEl = document.getElementById('bar-graph-symbol');

    if (!rBox || !pBox || !symEl) return;

    // Check if totally empty
    let totalAtoms = 0;
    for (let el in rCounts) totalAtoms += rCounts[el] || 0;
    for (let el in pCounts) totalAtoms += pCounts[el] || 0;
    const isEmpty = (totalAtoms === 0);

    // Equality Symbol: = when balanced, ≠ when unbalanced
    if (isBalanced && !isEmpty) {
        symEl.innerHTML = "=";
        symEl.style.color = "#10b981";
    } else {
        symEl.innerHTML = "&#8800;";
        symEl.style.color = "#1e3a8a";
    }

    // Proportional bar height fitted to shared scale/bar box height
    function calcBarHeight(count) {
        if (count === 0) return 6;
        const isCompact = (window.innerWidth <= 1200 || window.innerHeight <= 850);
        const maxH = isCompact ? 100 : 130;
        const increment = isCompact ? 6 : 7;
        return Math.min(maxH, Math.max(12, Math.round(10 + count * increment)));
    }

    // Build Reactant Bars
    let rHtml = '';
    lvl.elements.forEach(el => {
        const count = rCounts[el] || 0;
        const color = (typeof ATOM_COLORS !== 'undefined' && ATOM_COLORS[el]) ? ATOM_COLORS[el] : { bg: '#94a3b8', color: '#ffffff' };
        const barH = calcBarHeight(count);
        const marbleHtml = typeof getHyperMarble === 'function' 
            ? getHyperMarble(el).replace('width: 28px; height: 28px;', 'width: 20px; height: 20px; font-size: 11px;')
            : `<div style="width:18px;height:18px;border-radius:50%;background:${color.bg};"></div>`;

        rHtml += `
            <div class="bar-col" style="display:flex; flex-direction:column; align-items:center; justify-content:flex-end; width:56px; height:100%;">
                <span class="bar-count" style="font-size:1.25rem; font-weight:900; color:#0f172a; margin-bottom:5px; font-family:'Nunito',sans-serif;">${count}</span>
                <div class="bar-fill" style="width:46px; height:${barH}px; background:${color.bg}; border:2.5px solid #0f172a; border-radius:6px; box-shadow:0 3px 0 rgba(0,0,0,0.18); transition:height 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);"></div>
                <div class="bar-label" style="display:flex; align-items:center; gap:6px; margin-top:8px; font-weight:900; font-size:1.15rem; color:#0f172a;">
                    ${marbleHtml}
                    <span>${el}</span>
                </div>
            </div>
        `;
    });
    rBox.innerHTML = rHtml;

    // Build Product Bars
    let pHtml = '';
    lvl.elements.forEach(el => {
        const count = pCounts[el] || 0;
        const color = (typeof ATOM_COLORS !== 'undefined' && ATOM_COLORS[el]) ? ATOM_COLORS[el] : { bg: '#94a3b8', color: '#ffffff' };
        const barH = calcBarHeight(count);
        const marbleHtml = typeof getHyperMarble === 'function' 
            ? getHyperMarble(el).replace('width: 28px; height: 28px;', 'width: 20px; height: 20px; font-size: 11px;')
            : `<div style="width:18px;height:18px;border-radius:50%;background:${color.bg};"></div>`;

        pHtml += `
            <div class="bar-col" style="display:flex; flex-direction:column; align-items:center; justify-content:flex-end; width:56px; height:100%;">
                <span class="bar-count" style="font-size:1.25rem; font-weight:900; color:#0f172a; margin-bottom:5px; font-family:'Nunito',sans-serif;">${count}</span>
                <div class="bar-fill" style="width:46px; height:${barH}px; background:${color.bg}; border:2.5px solid #0f172a; border-radius:6px; box-shadow:0 3px 0 rgba(0,0,0,0.18); transition:height 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);"></div>
                <div class="bar-label" style="display:flex; align-items:center; gap:6px; margin-top:8px; font-weight:900; font-size:1.15rem; color:#0f172a;">
                    ${marbleHtml}
                    <span>${el}</span>
                </div>
            </div>
        `;
    });
    pBox.innerHTML = pHtml;
};

window.switchViewMode = function(mode) {
    if (mode === "simple" || mode === "pro") mode = "scale";
    if (mode === window.currentViewMode) return;
    window.currentViewMode = mode;
    if(typeof playSound === "function") playSound("switch");
    
    let btnScale = document.getElementById("btn-side-scale") || document.getElementById("btn-side-simple");
    let btnBar = document.getElementById("btn-side-bar");

    if (btnScale) btnScale.classList.toggle("active-tab", mode === "scale");
    if (btnBar) btnBar.classList.toggle("active-tab", mode === "bar");

    let secScale = document.querySelector(".section-scale");
    let secBar = document.getElementById("section-bar-graph");
    let blockLeft = document.querySelector(".block-left");
    let blockRight = document.querySelector(".block-right");
    let blockMiddle = document.querySelector(".block-middle");
    let statusBar = document.querySelector(".status-bar-shared");
    let layout = document.querySelector(".good-layout");

    if (blockLeft) blockLeft.style.display = "flex";
    if (blockRight) blockRight.style.display = "flex";
    if (blockMiddle) {
        blockMiddle.style.display = "flex";
        blockMiddle.style.gridColumn = "";
        blockMiddle.style.gridRow = "";
    }

    if (layout) {
        let leftCollapsed = blockLeft?.classList.contains("collapsed");
        let rightCollapsed = blockRight?.classList.contains("collapsed");
        if (leftCollapsed) {
            layout.style.setProperty("--left-w", "72px");
        } else {
            layout.style.removeProperty("--left-w");
        }
        if (rightCollapsed) {
            layout.style.setProperty("--right-w", "72px");
        } else {
            layout.style.removeProperty("--right-w");
        }
        layout.style.gridTemplateRows = "";
    }

    if (mode === "scale") {
        if (secScale) secScale.style.display = "flex";
        if (secBar) secBar.style.display = "none";
        if (statusBar) statusBar.style.marginBottom = "85px";
        if (typeof window.updateSimulation === "function") {
            window.updateSimulation();
        }
    } else {
        if (secScale) secScale.style.display = "none";
        if (secBar) secBar.style.display = "flex";
        if (statusBar) statusBar.style.marginBottom = "14px";
        if (typeof window.updateBarGraph === "function") {
            window.updateBarGraph();
        }
    }
};

window.renderProModeEquation = function() {
    let container = document.getElementById("pro-equation-container");
    if (!container || !currentLevelData) return;
    container.innerHTML = "";
    
    let createStepper = (m, side, isLast) => {
        let group = document.createElement("div");
        group.style.cssText = "display: flex; align-items: center; gap: 15px;";
        
        // Stepper
        let stepper = document.createElement("div");
        stepper.style.cssText = "display: flex; flex-direction: column; align-items: center; gap: 6px; background: transparent; width: 65px;";
        
        let btnUp = document.createElement("button");
        btnUp.innerHTML = "&#9650;";
        btnUp.style.cssText = "width: 44px; height: 26px; border: none; background: #475569; border-radius: 8px; cursor: pointer; color: white; font-size: 0.9rem; display: flex; justify-content: center; align-items: center; transition: all 0.1s; box-shadow: 0 4px 0 #1e293b;";
        btnUp.onmousedown = () => { btnUp.style.transform = 'translateY(4px)'; btnUp.style.boxShadow = 'none'; };
        btnUp.onmouseup = () => { btnUp.style.transform = 'translateY(0)'; btnUp.style.boxShadow = '0 4px 0 #1e293b'; };
        btnUp.onmouseleave = () => { btnUp.style.transform = 'translateY(0)'; btnUp.style.boxShadow = '0 4px 0 #1e293b'; };
        btnUp.onclick = () => { window.addMolecule(side, m.id); updateSimulation(); };
        
        let val = document.createElement("div");
        val.id = "pro-stepper-" + side + "-" + m.id;
        val.innerText = "0";
        val.style.cssText = "font-size: 2.2rem; font-weight: 900; color: #1e293b; background: white; border: 3px solid #94a3b8; border-radius: 12px; width: 100%; height: 60px; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); box-sizing: border-box;";
        
        let btnDown = document.createElement("button");
        btnDown.innerHTML = "&#9660;";
        btnDown.style.cssText = "width: 44px; height: 26px; border: none; background: #475569; border-radius: 8px; cursor: pointer; color: white; font-size: 0.9rem; display: flex; justify-content: center; align-items: center; transition: all 0.1s; box-shadow: 0 4px 0 #1e293b;";
        btnDown.onmousedown = () => { btnDown.style.transform = 'translateY(4px)'; btnDown.style.boxShadow = 'none'; };
        btnDown.onmouseup = () => { btnDown.style.transform = 'translateY(0)'; btnDown.style.boxShadow = '0 4px 0 #1e293b'; };
        btnDown.onmouseleave = () => { btnDown.style.transform = 'translateY(0)'; btnDown.style.boxShadow = '0 4px 0 #1e293b'; };
        btnDown.onclick = () => {
            let row = document.getElementById("row-" + side + "-" + m.id);
            if (row && row.children.length > 0) {
                row.lastElementChild.click();
            }
        };
        
        stepper.appendChild(btnUp);
        stepper.appendChild(val);
        stepper.appendChild(btnDown);
        
        // Formula
        let formula = document.createElement("div");
        formula.innerHTML = m.displayHtml;
        formula.style.cssText = "font-size: 3.5rem; font-weight: 800; color: #334155; margin-left: 5px;";
        
        group.appendChild(stepper);
        group.appendChild(formula);
        
        container.appendChild(group);
        
        if (!isLast) {
            let plus = document.createElement("div");
            plus.innerText = "+";
            plus.style.cssText = "font-size: 4rem; font-weight: 900; color: #94a3b8; margin: 0 15px;";
            container.appendChild(plus);
        }
    };
    
    currentLevelData.reactants.forEach((m, idx) => {
        createStepper(m, "react", idx === currentLevelData.reactants.length - 1);
    });
    
    let arrow = document.createElement("div");
    arrow.innerHTML = `<svg style="width: 60px; height: 60px; color: #1e40af;" fill="currentColor" viewBox="0 0 24 24"><path d="M4 12h12V7l7 7-7 7v-5H4z"></path></svg>`;
    arrow.style.cssText = "margin: 0 25px; display: flex; align-items: center;";
    container.appendChild(arrow);
    
    currentLevelData.products.forEach((m, idx) => {
        createStepper(m, "prod", idx === currentLevelData.products.length - 1);
    });
};

window.syncProBoxes = function() {
    let proReact = document.getElementById("pro-box-react");
    let proProd = document.getElementById("pro-box-prod");
    if (!proReact || !proProd || !currentLevelData) return;
    
    proReact.innerHTML = "";
    proProd.innerHTML = "";
    
    currentLevelData.reactants.forEach(m => {
        let count = window.counts.molCounts.react[m.id] || 0;
        let step = document.getElementById("pro-stepper-react-" + m.id);
        if (step) step.innerText = count;
        
        let row = document.getElementById("row-react-" + m.id);
        if (row) {
            Array.from(row.children).forEach(child => {
                let clone = child.cloneNode(true);
                clone.style.position = "relative";
                clone.style.margin = "10px";
                clone.onclick = null;
                clone.style.cursor = "default";
                proReact.appendChild(clone);
            });
        }
    });
    
    currentLevelData.products.forEach(m => {
        let count = window.counts.molCounts.prod[m.id] || 0;
        let step = document.getElementById("pro-stepper-prod-" + m.id);
        if (step) step.innerText = count;
        
        let row = document.getElementById("row-prod-" + m.id);
        if (row) {
            Array.from(row.children).forEach(child => {
                let clone = child.cloneNode(true);
                clone.style.position = "relative";
                clone.style.margin = "10px";
                clone.onclick = null;
                clone.style.cursor = "default";
                proProd.appendChild(clone);
            });
        }
    });

    if (proReact.children.length === 0) {
        proReact.innerHTML = `<div style="width:100%; text-align:center; color:#475569; font-weight:800; font-size:1.5rem; display:flex; align-items:center; justify-content:center; padding: 40px;">Use the arrows below to add molecules</div>`;
    }
    if (proProd.children.length === 0) {
        proProd.innerHTML = `<div style="width:100%; text-align:center; color:#475569; font-weight:800; font-size:1.5rem; display:flex; align-items:center; justify-content:center; padding: 40px;">Use the arrows below to add molecules</div>`;
    }

    let arrow = document.getElementById("pro-arrow-svg");
    if (arrow && window.counts && window.counts.rCounts) {
        let isBalanced = (!window.counts.isEmpty && JSON.stringify(window.counts.rCounts) === JSON.stringify(window.counts.pCounts));
        if (isBalanced) {
            arrow.style.color = "#10b981";
            arrow.style.filter = "drop-shadow(0 4px 0 #047857)";
            arrow.style.transform = "scale(1.1)";
        } else {
            arrow.style.color = "#1e40af";
            arrow.style.filter = "drop-shadow(0 4px 0 #1e3a8a)";
            arrow.style.transform = "scale(1)";
        }
    }
};


window.onload = function() { initEngine(); };

window.showWinPopup = function(isPerfect) {

    if (typeof window.closeTutorial === 'function') {
        window.closeTutorial();
    }
    const tour = document.getElementById('stoich-spotlight-tour');
    if (tour) {
        tour.style.display = 'none';
        tour.style.opacity = '0';
        try { tour.remove(); } catch(e) {}
    }

    if (window.isChallengeMode) {
        window.handleChallengeRoundComplete(isPerfect);
        return;
    }
    if (document.getElementById("win-popup")) document.getElementById("win-popup").remove();
    
    let levelId = new URLSearchParams(window.location.search).get('level');
    
    // Save state
    let solvedLevels = JSON.parse(localStorage.getItem('solvedLevels_' + (localStorage.getItem('currentPlayer')||'Player')) || '[]');
    if (!solvedLevels.includes(levelId)) {
        solvedLevels.push(levelId);
        localStorage.setItem('solvedLevels_' + (localStorage.getItem('currentPlayer')||'Player'), JSON.stringify(solvedLevels));
    }
    
    let solvedData = JSON.parse(localStorage.getItem('solvedLevelData_' + (localStorage.getItem('currentPlayer')||'Player')) || '{}');
    let currentStars = solvedData[levelId] ? solvedData[levelId].stars : 0;
    let newStars = isPerfect ? 3 : 1.5;
    if (newStars > currentStars) {
        solvedData[levelId] = { stars: newStars };
        localStorage.setItem('solvedLevelData_' + (localStorage.getItem('currentPlayer')||'Player'), JSON.stringify(solvedData));
    }

    let overlay = document.createElement("div");
    overlay.id = "win-popup";
    overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15,23,42,0.85); display: flex; justify-content: center; align-items: center; z-index: 999999; backdrop-filter: blur(12px);";
    
    let borderColor = isPerfect ? "#10b981" : "#f59e0b"; // Modern emerald or amber
    let shadowColor = isPerfect ? "#047857" : "#b45309";
    let titleColor = isPerfect ? "#059669" : "#d97706";
    let titleText = isPerfect ? "PERFECT BALANCE!" : "BALANCED!";
    let subText = (levelId === "TUT0") ? "Awesome job! You balanced your first reaction: 2H₂ + O₂ → 2H₂O. You are ready for Form 4!" : (isPerfect ? "Flawless work! The equation is in its simplest form." : "Nice job! The equation is balanced, but the coefficients can be simplified further.");
    let badgeText = isPerfect ? "3 STARS" : "1.5 STARS";
    
    let svgFull = `<svg width="40" height="40" viewBox="0 0 24 24" fill="#facc15" stroke="#ca8a04" stroke-width="2" stroke-linejoin="round" style="margin:0 4px; filter:drop-shadow(0 4px 0 rgba(0,0,0,0.15));"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`;
    let svgHalf = `<svg width="40" height="40" viewBox="0 0 24 24" stroke="#ca8a04" stroke-width="2" stroke-linejoin="round" style="margin:0 4px; filter:drop-shadow(0 4px 0 rgba(0,0,0,0.15));"><defs><linearGradient id="hgPopupRedesign" x1="0" x2="1" y1="0" y2="0"><stop offset="50%" stop-color="#facc15"/><stop offset="50%" stop-color="#e2e8f0"/></linearGradient></defs><polygon fill="url(#hgPopupRedesign)" points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`;
    
    let starsHtml = isPerfect ? 
        `<div style="display:flex; justify-content:center; align-items:center; margin: 20px 0;">${svgFull}${svgFull}${svgFull}</div>` :
        `<div style="display:flex; justify-content:center; align-items:center; margin: 20px 0;">${svgFull}${svgHalf}</div>`;

    // Find next level
    let nextLevel = null;
    if (typeof LEVELS !== 'undefined') {
        let keys = Object.keys(LEVELS);
        let idx = keys.indexOf(levelId);
        if(idx !== -1 && idx < keys.length - 1) {
            nextLevel = keys[idx+1];
        }
    }
    
    if(!document.getElementById('popup-style')) {
        let style = document.createElement('style');
        style.id = 'popup-style';
        style.innerHTML = `
            .win-btn { flex: 1; min-width: 140px; padding: 18px 24px; font-size: 1.15rem; font-weight: 900; border-radius: 20px; cursor: pointer; transition: all 0.15s cubic-bezier(0.25, 1, 0.5, 1); display: flex; justify-content: center; align-items: center; letter-spacing: 0.5px; }
            .win-btn:hover { transform: scale(1.05) translateY(-6px); filter: brightness(1.15); box-shadow: 0 12px 0 rgba(0,0,0,0.2) !important; z-index: 10; }
            .win-btn:active { transform: translateY(4px); box-shadow: 0 0 0 transparent !important; }
            @keyframes slideUpFade { 0% { transform: translateY(60px) scale(0.9); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
            @keyframes pulseBadge { 0% { transform: translateX(-50%) scale(1); } 50% { transform: translateX(-50%) scale(1.05); } 100% { transform: translateX(-50%) scale(1); } }
        `;
        document.head.appendChild(style);
    }
    
    window.slideTransitionTo = function(url) {
        let slideOverlay = document.createElement('div');
        slideOverlay.style.cssText = "position: fixed; top: 0; left: 100vw; width: 100vw; height: 100vh; background: #2563eb; z-index: 9999999; transition: left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; justify-content: center; align-items: center;";
        slideOverlay.innerHTML = `<h1 style="color: white; font-size: 4rem; font-weight: 900; text-shadow: 0 6px 0 #1e3a8a; font-family: system-ui, sans-serif;">NEXT LEVEL</h1>`;
        document.body.appendChild(slideOverlay);
        if(typeof playSound==='function') playSound('start');
        setTimeout(() => { slideOverlay.style.left = "0"; }, 10);

        let match = url.match(/game\.html\?level=([^&]+)/);
        if (match && match[1]) {
            setTimeout(() => {
                let winPopup = document.getElementById("win-popup");
                if (winPopup) winPopup.remove();
                window.actionHistory = [];
                window.activeVisualHint = null;
                history.pushState(null, '', url);
                initEngine();
                if (localStorage.getItem('stoich_fullscreen') === 'true' && !document.fullscreenElement) {
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen().catch(() => {});
                    }
                }
                slideOverlay.style.transition = "left 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease";
                slideOverlay.style.left = "-100vw";
                setTimeout(() => { slideOverlay.remove(); }, 450);
            }, 550);
        } else {
            setTimeout(() => { window.location.href = url; }, 550);
        }
    };

    let buttonsHtml = `<div style="display: flex; gap: 16px; margin-top: 35px; flex-wrap: wrap; justify-content:center;">`;
    
    if (!isPerfect) {
        buttonsHtml += `<button class="win-btn interactive" onclick="if(typeof playSound==='function') playSound('click'); document.getElementById('win-popup').remove();" style=" background: #f59e0b; color: white; border: 4px solid #b45309; box-shadow: 0 8px 0 #92400e;">RETRY</button>`;
    }
    
    buttonsHtml += `<button class="win-btn interactive" onclick="if(typeof playSound==='function') playSound('click'); window.enterReviewMode('${nextLevel || ''}');" style=" background: #64748b; color: white; border: 4px solid #475569; box-shadow: 0 8px 0 #334155;">REVIEW</button>`;
    
    if (nextLevel) {
        let nextBtnLabel = (levelId === "TUT0") ? "START FORM 4 ▶" : "NEXT LEVEL";
        buttonsHtml += `<button class="win-btn interactive" onclick="if(typeof playSound==='function') playSound('click'); window.slideTransitionTo('game.html?level=${nextLevel}')" style=" background: #3b82f6; color: white; border: 4px solid #1d4ed8; box-shadow: 0 8px 0 #1e3a8a;">${nextBtnLabel}</button>`;
    }
    
    buttonsHtml += `<button class="win-btn interactive" onclick="if(typeof playSound==='function') playSound('click'); window.transitionTo('levels.html')" style=" background: #ec4899; color: white; border: 4px solid #be185d; box-shadow: 0 8px 0 #9d174d;">MAIN MENU</button>`;
    buttonsHtml += `</div>`;

    let modal = document.createElement("div");
    modal.style.cssText = `background: #ffffff; border: 8px solid ${borderColor}; border-radius: 40px; padding: 50px 40px; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 -10px 0 rgba(0,0,0,0.05); max-width: 650px; width: 90%; animation: slideUpFade 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; font-family: system-ui, -apple-system, sans-serif;`;
    
    modal.innerHTML = `
        <div style="position:absolute; top:-25px; left:50%; transform:translateX(-50%); background:${borderColor}; color:white; padding:10px 24px; border-radius:24px; font-weight:900; font-size:1.1rem; letter-spacing:1px; border:4px solid white; box-shadow:0 8px 0 ${shadowColor}; animation: pulseBadge 2s infinite;">${badgeText}</div>
        <h1 style="font-size: 3rem; color: ${titleColor}; margin: 20px 0 10px 0; line-height: 1; font-weight:900; text-transform:uppercase; letter-spacing:-1px;">${titleText}</h1>
        ${starsHtml}
        <p style="font-size: 1.3rem; color: #475569; margin: 0 20px; font-weight: 700; line-height:1.5;">${subText}</p>
        ${buttonsHtml}
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}



// ==========================================
// CHALLENGE GAUNTLET ENGINE EXTENSION
// ==========================================
window.initChallengeMode = function(params) {
    window.isChallengeMode = true;
    window.challengeTier = (params.get('tier') || 'easy').toLowerCase();
    window.challengeScaleSetting = params.get('scale') || 'on';
    window.challengeHintsSetting = params.get('hints') || '1';
    window.challengeTimerSetting = params.get('timer') || 'stopwatch';
    window.challengePlayer = params.get('name') || localStorage.getItem('currentPlayer') || 'Student';
    
    window.challengeCurrentRound = 0;
    window.challengeTotalRounds = 5;
    window.challengeHintsRemaining = window.challengeHintsSetting === '1' ? 1 : 0;
    window.challengeHintsUsed = false;
    window.challengeScalePeeked = false;
    window.challengeResetsCount = 0;
    window.challengeStartTime = Date.now();
    window.challengeElapsedSec = 0;
    window.challengeCountdownRemaining = 90;
    
    // Pick 5 random equations from pool
    let pool = window.CHALLENGE_POOLS ? (window.CHALLENGE_POOLS[window.challengeTier] || window.CHALLENGE_POOLS['easy']) : [];
    if (!pool || pool.length === 0) {
        pool = Object.values(LEVELS).slice(0, 5);
    }
    let shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    window.challengeRounds = shuffled.slice(0, 5);
    
    // Show Challenge HUD
    let hudPills = document.getElementById('challenge-hud-pills');
    if (hudPills) hudPills.style.display = 'flex';
    
    // Start Timer
    if (window.challengeInterval) clearInterval(window.challengeInterval);
    window.challengeInterval = setInterval(() => {
        let timerContainer = document.getElementById('challenge-timer-badge');
        let timerText = document.getElementById('challenge-timer-text') || timerContainer;
        
        if (window.challengeTimerSetting === 'countdown') {
            window.challengeCountdownRemaining--;
            let rem = Math.max(0, window.challengeCountdownRemaining);
            let m = Math.floor(rem / 60);
            let s = rem % 60;
            let str = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            if (timerText) timerText.innerText = str;
            if (timerContainer && window.challengeCountdownRemaining <= 10) {
                timerContainer.classList.add('warning');
            }
            if (window.challengeCountdownRemaining <= 0) {
                clearInterval(window.challengeInterval);
                window.handleChallengeTimeout();
            }
        } else {
            window.challengeElapsedSec = Math.floor((Date.now() - window.challengeStartTime) / 1000);
            let m = Math.floor(window.challengeElapsedSec / 60);
            let s = window.challengeElapsedSec % 60;
            let str = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            if (timerText) timerText.innerText = str;
        }
    }, 1000);
    
    window.loadChallengeRound(0);
};

window.loadChallengeRound = function(roundIndex) {
    window.challengeCurrentRound = roundIndex;
    currentLevelData = window.challengeRounds[roundIndex];
    window.proEquationRendered = false;
    
    document.title = `Challenge: Round ${roundIndex + 1}/5 - ${currentLevelData.title}`;
    renderBoard();
    
    let titleEl = document.getElementById("level-title");
    if (titleEl) {
        titleEl.innerText = `Round ${roundIndex + 1}/5 : ${currentLevelData.title}`;
    }
    
    let diffPill = document.getElementById('challenge-diff-pill') || document.getElementById('challenge-round-badge');
    if (diffPill) {
        let tierClean = (window.challengeTier || 'easy').toLowerCase();
        diffPill.className = `lvl-diff diff-${tierClean}`;
        diffPill.innerText = tierClean.charAt(0).toUpperCase() + tierClean.slice(1);
    }
    
    window.applyChallengeScaleSettings();
    window.updateChallengeHintButton();
    updateSimulation();
    
    setTimeout(() => {
        window.clearChat();
        if (window.challengeHintsSetting === '0') {
            window.addChatMessage(`<b>Round ${roundIndex + 1} of 5</b><br><br>Solo mode active (No hints). Balance purely with your stoichiometry skills!`, "Prof. Beaker");
        } else if (window.challengeHintsRemaining > 0) {
            window.addChatMessage(`<b>Round ${roundIndex + 1} of 5</b><br><br>You have <b>1 hint token</b> remaining for this run. Balance as fast as you can!`, "Prof. Beaker");
        } else {
            window.addChatMessage(`<b>Round ${roundIndex + 1} of 5</b><br><br>Hint token already used. Keep pushing forward!`, "Prof. Beaker");
        }
    }, 100);
};

window.applyChallengeScaleSettings = function() {
    let scaleSection = document.querySelector('.section-scale');
    let scaleCards = document.querySelectorAll('.pro-scale-card');
    let leftBlock = document.querySelector('.block-left');
    let rightBlock = document.querySelector('.block-right');
    let layout = document.querySelector('.good-layout');
    
    // 1. Hide Scale Modifier -> Blur beam & collapse Element Tray
    if (window.challengeScaleSetting === 'off' && !window.challengeScalePeeked) {
        if (scaleSection) {
            scaleSection.style.filter = 'blur(14px)';
            scaleSection.style.pointerEvents = 'none';
        }
        scaleCards.forEach(c => {
            c.style.filter = 'blur(10px)';
            c.style.pointerEvents = 'none';
        });
        if (leftBlock) {
            leftBlock.classList.add('collapsed');
            leftBlock.classList.add('is-mod-locked');
            let btn = leftBlock.querySelector('.rect-btn');
            if (btn) btn.setAttribute('title', 'Element Trays locked (No Scale Challenge active)');
        }
        if (layout) {
            layout.style.setProperty('--left-w', '80px');
        }
    } else {
        if (scaleSection) {
            scaleSection.style.filter = 'none';
            scaleSection.style.pointerEvents = 'auto';
        }
        scaleCards.forEach(c => {
            c.style.filter = 'none';
            c.style.pointerEvents = 'auto';
        });
        if (leftBlock) {
            leftBlock.classList.remove('is-mod-locked');
        }
    }
    
    // 2. No Hints Modifier -> Collapse Prof Beaker
    if (window.challengeHintsSetting === '0') {
        if (rightBlock) {
            rightBlock.classList.add('collapsed');
            rightBlock.classList.add('is-mod-locked');
            let btn = rightBlock.querySelector('.rect-btn');
            if (btn) btn.setAttribute('title', 'Prof. Beaker locked (No Hints Solo Mode)');
        }
        if (layout) {
            layout.style.setProperty('--right-w', '80px');
        }
    } else {
        if (rightBlock) {
            rightBlock.classList.remove('is-mod-locked');
        }
    }
};

window.updateChallengeHintButton = function() {
    let hintBtn = document.querySelector('.btn-hint-clean');
    if (!hintBtn) return;
    
    if (window.challengeHintsSetting === '0') {
        hintBtn.innerText = 'Hints Disabled (Solo)';
        hintBtn.style.opacity = '0.5';
        hintBtn.style.pointerEvents = 'none';
    } else if (window.challengeHintsRemaining <= 0) {
        hintBtn.innerText = '0 Hints Left';
        hintBtn.style.opacity = '0.5';
        hintBtn.style.pointerEvents = 'none';
    } else {
        hintBtn.innerHTML = `💡 1 Hint Left!`;
        hintBtn.style.opacity = '1';
        hintBtn.style.pointerEvents = 'auto';
    }
};

// Hook into hint revealing
let origRevealHint = window.revealHeuristicHint;
window.revealHeuristicHint = function() {
    if (window.isChallengeMode) {
        if (window.challengeHintsSetting === '0') {
            window.addChatMessage("Hints are disabled for this solo challenge run!", "Prof. Beaker");
            return;
        }
        if (window.challengeHintsRemaining <= 0) {
            window.addChatMessage("You have no hints left for this challenge run! You can do it!", "Prof. Beaker");
            return;
        }
        window.challengeHintsRemaining--;
        window.challengeHintsUsed = true;
        window.updateChallengeHintButton();
    }
    if (typeof origRevealHint === 'function') origRevealHint();
};

window.handleChallengeRoundComplete = function(isPerfect) {
    if (typeof playSound === 'function') playSound('win');
    
    let isFinalRound = window.challengeCurrentRound >= (window.challengeTotalRounds - 1);
    
    if (!isFinalRound) {
        let overlay = document.createElement("div");
        overlay.id = "challenge-round-popup";
        overlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15,23,42,0.8); display:flex; justify-content:center; align-items:center; z-index:10000; backdrop-filter:blur(6px);";
        
        let card = document.createElement("div");
        card.style.cssText = "background:white; border:6px solid #10b981; border-radius:28px; padding:35px 40px; text-align:center; box-shadow:0 20px 40px rgba(0,0,0,0.4); max-width:480px; width:90%; animation:slideUpFade 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);";
        
        let timeStr = "";
        if (window.challengeTimerSetting === 'countdown') {
            timeStr = `${window.challengeCountdownRemaining}s left`;
        } else {
            let m = Math.floor(window.challengeElapsedSec / 60);
            let s = window.challengeElapsedSec % 60;
            timeStr = `${m}m ${s}s`;
        }
        
        card.innerHTML = `
            <div style="font-size:3rem; margin-bottom:8px;">⚡</div>
            <h2 style="margin:0; font-size:2rem; font-weight:900; color:#065f46;">ROUND ${window.challengeCurrentRound + 1} BALANCED!</h2>
            <p style="margin:8px 0 20px; font-weight:800; color:#475569; font-size:1.1rem;">Clock: <span style="color:#059669;">${timeStr}</span></p>
            <button id="next-challenge-btn" class="interactive" style="width:100%; padding:16px; background:#10b981; color:white; border:4px solid #047857; border-radius:18px; font-weight:900; font-size:1.2rem; cursor:pointer; box-shadow:0 6px 0 #064e3b; transition:all 0.1s;" onmousedown="this.style.transform='translateY(6px)'; this.style.boxShadow='none';" onmouseup="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 0 #064e3b';">
                NEXT REACTION ➔
            </button>
        `;
        
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        
        let nextBtn = document.getElementById('next-challenge-btn');
        let autoAdvance = setTimeout(() => {
            if (overlay.parentNode) overlay.remove();
            window.loadChallengeRound(window.challengeCurrentRound + 1);
        }, 2200);
        
        nextBtn.onclick = () => {
            clearTimeout(autoAdvance);
            overlay.remove();
            window.loadChallengeRound(window.challengeCurrentRound + 1);
        };
        return;
    }
    
    // FINAL ROUND
    if (window.challengeInterval) clearInterval(window.challengeInterval);
    let totalSec = window.challengeElapsedSec;
    if (window.challengeTimerSetting === 'countdown') {
        totalSec = 90 - window.challengeCountdownRemaining;
    }
    
    let m = Math.floor(totalSec / 60);
    let s = totalSec % 60;
    let timeStr = `${m > 0 ? m + 'm ' : ''}${s}s`;
    
    let stars = 3;
    if (totalSec > 90) stars = 2;
    if (totalSec > 150) stars = 1;
    
    let player = window.challengePlayer || 'Student';
    let unlockedBadges = JSON.parse(localStorage.getItem('challengeBadges_' + player) || '[]');
    let newlyEarnedBadges = [];
    
    function awardBadge(id) {
        if (!unlockedBadges.includes(id)) {
            unlockedBadges.push(id);
            newlyEarnedBadges.push(id);
        }
    }
    
    if (window.challengeScaleSetting === 'off' && !window.challengeScalePeeked) awardBadge('mental_math');
    if (window.challengeHintsRemaining > 0 && !window.challengeHintsUsed) awardBadge('solo_chemist');
    if (window.challengeScaleSetting === 'off' && !window.challengeScalePeeked && window.challengeHintsSetting === '0') awardBadge('blindfold');
    if (totalSec <= 60) awardBadge('lightning');
    if (stars === 3) {
        if (window.challengeTier === 'easy') awardBadge('apprentice');
        if (window.challengeTier === 'medium') awardBadge('specialist');
        if (window.challengeTier === 'hard') awardBadge('grandmaster');
    }
    if (unlockedBadges.includes('apprentice') && unlockedBadges.includes('specialist') && unlockedBadges.includes('grandmaster')) {
        awardBadge('grand_slam');
    }
    
    let history = JSON.parse(localStorage.getItem('challengeHistory_' + player) || '[]');
    let today = new Date();
    let dateStr = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ', ' + today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    history.push({
        tier: window.challengeTier,
        timeSec: totalSec,
        timeStr: timeStr,
        stars: stars,
        scale: window.challengeScaleSetting,
        hints: (window.challengeHintsSetting === '0' || !window.challengeHintsUsed) ? (window.challengeHintsSetting === '0' ? '0' : '1') : '1',
        timer: window.challengeTimerSetting || 'stopwatch',
        date: dateStr
    });
    
    if (history.length >= 10) awardBadge('veteran');
    
    localStorage.setItem('challengeHistory_' + player, JSON.stringify(history));
    localStorage.setItem('challengeBadges_' + player, JSON.stringify(unlockedBadges));
    
    let overlay = document.createElement("div");
    overlay.id = "challenge-final-popup";
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15,23,42,0.85); display:flex; justify-content:center; align-items:center; z-index:10000; backdrop-filter:blur(12px);";
    
    let starSVGs = '';
    for (let i = 0; i < 3; i++) {
        let fill = i < stars ? "#facc15" : "#e2e8f0";
        let stroke = i < stars ? "#ca8a04" : "#94a3b8";
        starSVGs += `<svg width="48" height="48" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round" style="margin:0 4px;"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`;
    }
    
    let badgesSection = '';
    if (newlyEarnedBadges.length > 0) {
        let badgeItems = newlyEarnedBadges.map(bid => {
            let b = (window.CHALLENGE_BADGES || []).find(x => x.id === bid);
            return b ? `<span style="background:#f3e8ff; border:2px solid #c084fc; border-radius:12px; padding:6px 12px; font-weight:900; color:#581c87; font-size:0.95rem;">${b.icon} ${b.name}</span>` : '';
        }).join(' ');
        badgesSection = `
            <div style="margin-top:16px; background:#faf5ff; border:2px dashed #d8b4fe; border-radius:18px; padding:14px;">
                <div style="font-weight:900; color:#7e22ce; font-size:0.85rem; text-transform:uppercase; margin-bottom:8px;">New Badges Unlocked!</div>
                <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:8px;">${badgeItems}</div>
            </div>
        `;
    }
    
    let card = document.createElement("div");
    card.style.cssText = "background:white; border:8px solid #8b5cf6; border-radius:36px; padding:45px 35px; text-align:center; box-shadow:0 25px 60px rgba(0,0,0,0.5); max-width:620px; width:92%; animation:slideUpFade 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); position:relative;";
    
    card.innerHTML = `
        <div style="font-size:3.5rem; margin-bottom:4px;">🏆</div>
        <h1 style="margin:0; font-size:2.4rem; font-weight:900; color:#581c87; letter-spacing:-1px;">CHALLENGE COMPLETE!</h1>
        <p style="margin:6px 0 15px; font-weight:800; color:#64748b; font-size:1.1rem; text-transform:uppercase;">${window.challengeTier} Tier • 5/5 Reactions Balanced</p>
        
        <div style="display:flex; justify-content:center; margin-bottom:15px;">${starSVGs}</div>
        
        <div style="background:#f8fafc; border:3px solid #e2e8f0; border-radius:20px; padding:16px; display:flex; justify-content:space-around; align-items:center;">
            <div>
                <div style="font-size:0.8rem; font-weight:900; color:#94a3b8; text-transform:uppercase;">Total Time</div>
                <div style="font-size:1.8rem; font-weight:900; color:#1e293b;">${timeStr}</div>
            </div>
            <div style="width:2px; height:40px; background:#e2e8f0;"></div>
            <div>
                <div style="font-size:0.8rem; font-weight:900; color:#94a3b8; text-transform:uppercase;">Solved By</div>
                <div style="font-size:1.5rem; font-weight:900; color:#8b5cf6;">${player}</div>
            </div>
        </div>

        ${badgesSection}

        <div style="display:flex; gap:12px; margin-top:28px;">
            <button class="btn-modal-action btn-play-again-purple interactive" onclick="if(typeof playSound==='function') playSound('start'); window.location.reload();">
                <svg class="modal-icon modal-icon-retry" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <path d="M3 3v5h5"></path>
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                    <path d="M16 21h5v-5"></path>
                </svg>
                <span>PLAY AGAIN</span>
            </button>
            <button class="btn-modal-action btn-main-menu-pink interactive" onclick="if(typeof playSound==='function') playSound('click'); window.transitionTo('index.html');">
                <svg class="modal-icon modal-icon-home" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m3 9.5 9-7 9 7v10.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>MAIN MENU</span>
            </button>
        </div>
    `;
    
    overlay.appendChild(card);
    document.body.appendChild(overlay);
};

window.handleChallengeTimeout = function() {
    if (window.challengeInterval) clearInterval(window.challengeInterval);
    if (typeof playSound === 'function') playSound('error');

    let player = window.challengePlayer || localStorage.getItem('currentPlayer') || 'Student';
    let roundsCleared = window.challengeCurrentRound || 0;
    let tierClean = (window.challengeTier || 'easy').toLowerCase();
    let tierDisplay = tierClean.charAt(0).toUpperCase() + tierClean.slice(1);
    
    // 1. Record the timeout run into player history
    let history = JSON.parse(localStorage.getItem('challengeHistory_' + player) || '[]');
    let today = new Date();
    let dateStr = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ', ' + today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    history.push({
        tier: tierClean,
        timeSec: 90,
        timeStr: '90s (Timeout)',
        stars: 0,
        status: 'timeout',
        roundsCleared: roundsCleared,
        scale: window.challengeScaleSetting,
        hints: window.challengeHintsSetting === '0' ? '0' : '1',
        timer: 'countdown',
        date: dateStr
    });
    localStorage.setItem('challengeHistory_' + player, JSON.stringify(history));

    // 2. Build the Tactile Arcade Timeout Pop-out Modal
    let overlay = document.createElement("div");
    overlay.id = "challenge-timeout-popup";
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15,23,42,0.85); display:flex; justify-content:center; align-items:center; z-index:9999999; backdrop-filter:blur(12px);";
    
    let card = document.createElement("div");
    card.style.cssText = "background:white; border:6px solid #ef4444; border-radius:32px; padding:44px 34px; text-align:center; box-shadow:0 24px 0 #b91c1c; max-width:580px; width:92%; animation:slideUpFade 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position:relative; box-sizing:border-box;";
    
    card.innerHTML = `
        <div style="width:76px; height:76px; border-radius:22px; background:#fef2f2; border:3.5px solid #ef4444; box-shadow:0 4px 0 #b91c1c; display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
            <svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="#ef4444" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="13" r="8"></circle>
                <path d="M12 9v4l2.5 2"></path>
                <path d="M5 3 2 6"></path>
                <path d="m22 6-3-3"></path>
                <path d="M12 2v3"></path>
            </svg>
        </div>
        
        <span style="display:inline-block; font-size:0.82rem; font-weight:900; letter-spacing:1.5px; color:#ef4444; background:#fef2f2; border:2px solid #fecaca; border-radius:10px; padding:5px 14px; text-transform:uppercase; margin-bottom:10px;">
            TIME HAS RUN OUT
        </span>

        <h1 style="margin:2px 0 10px; font-size:2.4rem; font-weight:900; color:#0f172a; letter-spacing:-0.5px; line-height:1.1;">
            Reaction Overheated!
        </h1>
        
        <p style="margin:0 auto 24px; font-size:1.05rem; font-weight:700; color:#64748b; line-height:1.45; max-width:440px;">
            The 90-second countdown expired before balancing all 5 reactions. This attempt was logged into your career records.
        </p>
        
        <div style="background:#f8fafc; border:3px solid #e2e8f0; border-radius:20px; padding:16px 20px; display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:28px; text-align:center;">
            <div>
                <div style="font-size:0.75rem; font-weight:900; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px;">Progress</div>
                <div style="font-size:1.5rem; font-weight:900; color:#0f172a; margin-top:2px;">${roundsCleared} / 5</div>
                <div style="font-size:0.75rem; font-weight:800; color:#ef4444;">Round ${roundsCleared + 1} Reached</div>
            </div>
            <div style="border-left:2px solid #e2e8f0; border-right:2px solid #e2e8f0;">
                <div style="font-size:0.75rem; font-weight:900; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px;">Time Elapsed</div>
                <div style="font-size:1.5rem; font-weight:900; color:#dc2626; margin-top:2px;">90s</div>
                <div style="font-size:0.75rem; font-weight:800; color:#64748b;">90s Rush Limit</div>
            </div>
            <div>
                <div style="font-size:0.75rem; font-weight:900; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px;">Attempt Logged</div>
                <div style="font-size:1.5rem; font-weight:900; color:#7e22ce; margin-top:2px;">Recorded</div>
                <div style="font-size:0.75rem; font-weight:800; color:#64748b;">${player}</div>
            </div>
        </div>

        <div style="display:flex; gap:14px;">
            <button class="btn-modal-action btn-try-again interactive" onclick="if(typeof playSound==='function') playSound('start'); window.location.reload();">
                <svg class="modal-icon modal-icon-retry" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <path d="M3 3v5h5"></path>
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                    <path d="M16 21h5v-5"></path>
                </svg>
                <span>TRY AGAIN</span>
            </button>
            <button class="btn-modal-action btn-main-menu interactive" onclick="if(typeof playSound==='function') playSound('click'); window.transitionTo('index.html');">
                <svg class="modal-icon modal-icon-home" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m3 9.5 9-7 9 7v10.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>MAIN MENU</span>
            </button>
        </div>
    `;
    
    overlay.appendChild(card);
    document.body.appendChild(overlay);
};


// Clean up any historical zoom state from localStorage or inline styles
function cleanupZoom() {
    try {
        localStorage.removeItem('stoich_zoom_level');
    } catch(e) {}
    if (document.documentElement) document.documentElement.style.zoom = '';
    if (document.body) document.body.style.zoom = '';
    const layout = document.querySelector('.good-layout');
    if (layout) {
        layout.style.transform = '';
        layout.style.transformOrigin = '';
        layout.style.width = '';
        layout.style.height = '';
        layout.style.maxWidth = '';
        layout.style.margin = '';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanupZoom);
} else {
    cleanupZoom();
}


window.enterReviewMode = function(nextLvl) {
    window.isReviewMode = true;
    let winPopup = document.getElementById('win-popup');
    if (winPopup) winPopup.remove();

    let topBlock = document.querySelector('.good-block.block-top');
    if (topBlock && nextLvl && !document.getElementById('btn-top-next-level')) {
        let btn = document.createElement('button');
        btn.id = 'btn-top-next-level';
        btn.className = 'btn-back btn-next-action interactive';
        btn.style.cssText = 'position: absolute; right: 18px; left: auto; background: #10b981; border-color: #065f46; box-shadow: 0 4px 0 #065f46; display: inline-flex; align-items: center; justify-content: center; gap: 6px; top: 50%; transform: translateY(-50%);';
        btn.innerHTML = '<span>Next</span> <span class="next-icon" style="font-size: 0.92em; line-height: 1;">▶</span>';
        btn.onmouseover = function() { this.style.transform = 'translateY(-2px)'; this.style.boxShadow = '0 8px 0 #065f46'; };
        btn.onmouseout = function() { this.style.transform = 'translateY(0)'; this.style.boxShadow = '0 6px 0 #065f46'; };
        btn.onmousedown = function() { this.style.transform = 'translateY(6px)'; this.style.boxShadow = '0 0 0 transparent'; };
        btn.onclick = function() {
            if (typeof playSound === 'function') playSound('start');
            window.slideTransitionTo('game.html?level=' + nextLvl);
        };
        topBlock.appendChild(btn);
    }

    if (typeof window.addChatMessage === 'function') {
        setTimeout(() => {
            window.addChatMessage("Great work balancing this reaction! Take your time to review the beakers and atom counts, or click <b>Next ▶</b> on the top right when you are ready to continue.", "Prof. Beaker");
        }, 150);
    }
};

// ==========================================
// Option A: Proportional Auto-Fit Loop for Chemical Equations
// Keeps all equations strictly on a single horizontal line
// ==========================================
window.autoFitEquation = function() {
    const sleekEq = document.getElementById('dynamic-sleek-equation');
    if (!sleekEq) return;
    const eqSection = sleekEq.closest('.section-equation') || sleekEq.parentElement;
    if (!eqSection) return;

    const react = sleekEq.querySelector('.eq-reactants');
    const prod = sleekEq.querySelector('.eq-products');
    const arrow = sleekEq.querySelector('.eq-arrow-wrapper');
    if (!react || !prod || !arrow) return;

    const isLevel7 = sleekEq.classList.contains('level7-scaled') || (typeof currentLevelData !== 'undefined' && currentLevelData && (
        currentLevelData.id === 'F4L7' ||
        (currentLevelData.title && currentLevelData.title.includes('Acid-Carbonate')) ||
        (new URLSearchParams(window.location.search).get('level') || '').toUpperCase() === 'F4L7'
    ));

    // Reset transforms to measure natural unscaled dimensions
    react.style.transform = 'none';
    prod.style.transform = 'none';

    const arrowRect = arrow.getBoundingClientRect();
    const colWidth = (sleekEq.clientWidth - arrowRect.width) / 2;
    const safeBuffer = isLevel7 ? 8 : 10;
    const safeHalf = colWidth - safeBuffer; // buffer before arrow

    let reactNatural = 0;
    Array.from(react.children).forEach((ch, i) => {
        reactNatural += ch.offsetWidth + (i > 0 ? (isLevel7 ? 3 : 6) : 0);
    });

    let prodNatural = 0;
    Array.from(prod.children).forEach((ch, i) => {
        prodNatural += ch.offsetWidth + (i > 0 ? (isLevel7 ? 3 : 6) : 0);
    });

    const maxNatural = Math.max(reactNatural, prodNatural);

    let scale = 1.0;
    if (maxNatural > safeHalf && safeHalf > 0) {
        const factor = isLevel7 ? 0.96 : 0.94;
        scale = Math.max(0.42, Math.min(1.0, (safeHalf / maxNatural) * factor));
    }

    react.style.transformOrigin = 'left center';
    prod.style.transformOrigin = 'right center';

    if (scale < 1.0) {
        react.style.transform = `scale(${scale.toFixed(3)})`;
        prod.style.transform = `scale(${scale.toFixed(3)})`;
    }
};

window.addEventListener('resize', () => {
    if (typeof window.autoFitEquation === 'function') {
        window.autoFitEquation();
    }
});
