
const ELEM_NAMES = { 
    H: "Hydrogen", O: "Oxygen", N: "Nitrogen", Na: "Sodium", K: "Potassium", 
    I: "Iodine", Zn: "Zinc", S: "Sulfur", Ag: "Silver", C: "Carbon", 
    Pb: "Lead", Al: "Aluminium", Cl: "Chlorine", Mg: "Magnesium", 
    Fe: "Iron", Cu: "Copper", Br: "Bromine", P: "Phosphorus", Ca: "Calcium" 
};



let audioCtx;
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

window.playSound = function(type) {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'undo') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    } else if (type === 'startover') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(150, audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
    } else { // click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }
};



// engine.js - Dynamic Level Rendering Engine for Stoichbalance

let currentLevelData = null;


window.setMode = function(mode) {
    let tabEasy = document.getElementById("tab-easy");
    let tabHard = document.getElementById("tab-hard");
    if(mode === "hard") {
        document.body.classList.add("hard-mode-on");
        if(tabHard) { tabHard.classList.add("active-tab"); }
        if(tabEasy) { tabEasy.classList.remove("active-tab"); }
    } else {
        document.body.classList.remove("hard-mode-on");
        if(tabEasy) { tabEasy.classList.add("active-tab"); }
        if(tabHard) { tabHard.classList.remove("active-tab"); }
    }
};

window.toggleFullscreen = function() {
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
    let block = document.querySelector(".block-" + side);
    if(block) block.classList.toggle("collapsed");
    
    let layout = document.querySelector(".good-layout");
    if(layout) {
        let leftCollapsed = document.querySelector(".block-left")?.classList.contains("collapsed");
        let rightCollapsed = document.querySelector(".block-right")?.classList.contains("collapsed");
        layout.style.setProperty("--left-w", leftCollapsed ? "80px" : "280px");
        layout.style.setProperty("--right-w", rightCollapsed ? "80px" : "280px");
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
    let levelId = params.get('level') || 'F4L6';
    // Remove quotes if present
    levelId = levelId.replace(/['"]/g, '');
    
    currentLevelData = LEVELS[levelId];
    if (!currentLevelData) {
        currentLevelData = LEVELS['F4L6']; // Fallback
    }
    
    document.title = currentLevelData.title;
    renderBoard();
    updateSimulation();
    
    // Welcome message

        setTimeout(() => { window.clearChat(); window.addChatMessage("Welcome to <b>" + currentLevelData.title + "</b>!<br><br>Let us balance the reaction.", "&#128075; Prof. Beaker"); }, 100);
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

    
    // Render Sleek Equation
    const sleekReact = document.getElementById('sleek-reactants');
    const sleekProd = document.getElementById('sleek-products');
    const sleekEq = document.getElementById('dynamic-sleek-equation');
    
    if (sleekEq) {
        let rHtml = `<div style="display: flex; justify-content: flex-start; align-items: center; gap: clamp(5px, 1.5cqw, 15px); min-width: 0; width: 100%;">`;
        currentLevelData.reactants.forEach((m, idx) => {
            let formula = m.displayHtml;
            // add sub styling
            formula = formula.replace(/([\u2082\u2083\u2084\u2085\u2086\u2087\u2088\u2089])/g, '<span class="sci-sub">$1</span>');
            
            let coeffHtml = '<div id="coeff-eq-react-' + m.id + '" class="sci-coeff img-coeff">1</div>';
            
            rHtml += `<div class="sci-mol">${coeffHtml}<div class="sci-formula">${formula}<span class="state-label">(${m.state || 'aq'})</span></div></div>`;
            
            if (idx < currentLevelData.reactants.length - 1) {
                rHtml += '<div class="sci-plus">+</div>';
            }
        });
        rHtml += '</div>';
        
        let arrowHtml = '<div style="display: flex; justify-content: center;"><div class="sci-arrow-box" style="border-radius: 12px;">&#10142;</div></div>';
        
        let pHtml = `<div style="display: flex; justify-content: flex-end; align-items: center; gap: clamp(5px, 1.5cqw, 15px); min-width: 0; width: 100%;">`;
        currentLevelData.products.forEach((m, idx) => {
            let formula = m.displayHtml;
            formula = formula.replace(/([\u2082\u2083\u2084\u2085\u2086\u2087\u2088\u2089])/g, '<span class="sci-sub">$1</span>');
            
            let coeffHtml = '<div id="coeff-eq-prod-' + m.id + '" class="sci-coeff img-coeff">1</div>';
            
            pHtml += `<div class="sci-mol">${coeffHtml}<div class="sci-formula">${formula}<span class="state-label">(${m.state || 'aq'})</span></div></div>`;
            
            if (idx < currentLevelData.products.length - 1) {
                pHtml += '<div class="sci-plus">+</div>';
            }
        });
        pHtml += '</div>';
        
        sleekEq.innerHTML = rHtml.replace("(')", "") + arrowHtml + pHtml.replace("(')", "");
    }


    // 1. Render Reactant Buttons
    const btnReactContainer = document.getElementById('react-btn-container');
    if(btnReactContainer) {
        btnReactContainer.innerHTML = '';
        currentLevelData.reactants.forEach(m => {
            let btn = document.createElement('div');
            btn.className = 'mol-btn btn-react';
            btn.innerHTML = `<span style="font-size: 1.5rem; margin-right: 4px;">+</span> <span>${m.displayHtml}</span>`;
            
              btn.onclick = () => window.addMolecule('react', m.id);
            btnReactContainer.appendChild(btn);
        });
    }

    // 2. Render Product Buttons
    const btnProdContainer = document.getElementById('prod-btn-container');
    if(btnProdContainer) {
        btnProdContainer.innerHTML = '';
        currentLevelData.products.forEach(m => {
            let btn = document.createElement('div');
            btn.className = 'mol-btn btn-prod';
            btn.innerHTML = `<span style="font-size: 1.5rem; margin-right: 4px;">+</span> <span>${m.displayHtml}</span>`;
            
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
            row.style.cssText = 'display: none; flex-direction: row-reverse; flex-wrap: wrap; gap: 8px; width: 100%; background: transparent; border: none; padding: 5px;';
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

// Global Override for addMolecule
window.actionHistory = window.actionHistory || [];
window.addMolecule = function(side, typeId) {
    if(typeof playSound === "function") playSound("click");
    let rowId = "row-" + side + "-" + typeId;
    let row = document.getElementById(rowId);
    if (!row) return;

    // Find molecule def
    let m = currentLevelData.reactants.find(x => x.id === typeId) || currentLevelData.products.find(x => x.id === typeId);
    if(!m) return;

    let block = document.createElement("div");
    block.className = "mol-block";
    
    block.onclick = function() {
        if(typeof playSound === "function") playSound("undo");
        window.actionHistory.push({ action: "remove", side: side, block: block, parent: row });
        block.remove();
        updateSimulation();
    };

    let marblesHtml = "";
    for(let el in m.composition) {
        let count = m.composition[el];
        for(let i=0; i<count; i++) {
            marblesHtml += getHyperMarble(el);
        }
    }

    block.innerHTML = `<div class="mol-remove-overlay">&#10006;</div><div style="font-weight: 900; font-size: 1.1rem; color: #1e293b;">${m.displayHtml}</div><div style="display: flex; flex-wrap: wrap; justify-content: center;">${marblesHtml}</div>`;
    row.appendChild(block);
    
    window.actionHistory.push({ action: "add", side: side, block: block, parent: row });
    
    updateSimulation();
};

window.undo = function() {
    if (window.actionHistory.length === 0) return;
    let last = window.actionHistory.pop();
    if (last.action === "add") {
        last.block.remove();
    } else if (last.action === "remove") {
        last.parent.appendChild(last.block);
    }
    updateSimulation();
};

window.resetEquation = function() {
    window.actionHistory = [];
    currentLevelData.reactants.forEach(m => {
        let row = document.getElementById("row-react-" + m.id);
        if(row) row.innerHTML = "";
    });
    currentLevelData.products.forEach(m => {
        let row = document.getElementById("row-prod-" + m.id);
        if(row) row.innerHTML = "";
    });
    updateSimulation();
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
};


window.updateSimulation = function() {
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
            if (rCount < pCount) {
                leftBooks += "<div style=\"color: #ef4444; font-weight: 900; font-size: 1.2rem; line-height: 1; text-align: center; margin-bottom: 2px; text-shadow: 0 1px 0 rgba(255,255,255,0.8); animation: pulseWarning 1s infinite;\">!</div>";
            }
            
            let pBookCount = 0; let rightBooks = "";
            while (pBookCount < pCount) {
                rightBooks += "<div class=\"book-col\" style=\"display:flex; flex-direction:column-reverse; gap:1px; margin:0;\">";
                for(let i=0; i<5 && pBookCount < pCount; i++, pBookCount++) { rightBooks += "<div class=\"book-block orange\"></div>"; }
                rightBooks += "</div>";
            }
            if (pCount < rCount) {
                rightBooks += "<div style=\"color: #ef4444; font-weight: 900; font-size: 1.2rem; line-height: 1; text-align: center; margin-bottom: 2px; text-shadow: 0 1px 0 rgba(255,255,255,0.8); animation: pulseWarning 1s infinite;\">!</div>";
            }

            let angle = 0;
            if(diff > 0) angle = -3;
            if(diff < 0) angle = 3;
            
            let eqSymbol = (rCount === pCount) ? "=" : "&#8800;";
            let tallyClass = (rCount === 0 && pCount === 0) ? "empty" : (isBalanced ? "balanced" : "unbalanced");
            
            html += `
            <div class="pro-scale-card ${colorClass}">
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
            fHtml += "<div class=\"footer-stat " + colorClass + "\" style=\"flex:1; display:flex; justify-content:center; align-items:center; " + textStyle + " font-weight:900; gap:8px; font-size:1.1rem; padding: 5px; border-left: 1px solid rgba(255,255,255,0.2);\">" + smallMarble + "<span>= " + rCounts[el] + "</span></div>";
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
            fHtml += "<div class=\"footer-stat " + colorClass + "\" style=\"flex:1; display:flex; justify-content:center; align-items:center; " + textStyle + " font-weight:900; gap:8px; font-size:1.1rem; padding: 5px; border-left: 1px solid rgba(255,255,255,0.2);\">" + smallMarble + "<span>= " + pCounts[el] + "</span></div>";
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
            el.style.background = count === 0 ? "#1e293b" : "#ef4444";
        }
    });
    currentLevelData.products.forEach(m => {
        let el = document.getElementById("coeff-eq-prod-" + m.id);
        if(el) {
            let count = molCounts.prod[m.id] || 0;
            el.innerText = count;
            el.style.background = count === 0 ? "#1e293b" : "#ef4444";
        }
    });

    const statusLeft = document.querySelector(".status-left");
    const statusRight = document.querySelector(".status-right");
    if(statusLeft && statusRight) {
        let isBalanced = (!isEmpty && JSON.stringify(rCounts) === JSON.stringify(pCounts));
        let allCoeffs = [];
        for(let id in molCounts.react) if(molCounts.react[id] > 0) allCoeffs.push(molCounts.react[id]);
        for(let id in molCounts.prod) if(molCounts.prod[id] > 0) allCoeffs.push(molCounts.prod[id]);
        
        let gcd = getArrayGCD(allCoeffs);
        let isSimplified = (gcd === 1);

        if (isBalanced) {
            statusLeft.innerHTML = "BALANCED"; statusLeft.style.background = "#22c55e";
        } else {
            statusLeft.innerHTML = "UNBALANCED"; statusLeft.style.background = "#ef4444";
        }

        if (isSimplified || isEmpty) {
            statusRight.innerHTML = "SIMPLIFIED"; statusRight.style.background = isEmpty ? "#94a3b8" : "#22c55e";
        } else {
            statusRight.innerHTML = "NOT SIMPLIFIED"; statusRight.style.background = "#eab308";
        }
        if (isEmpty) {
            statusLeft.innerHTML = "EMPTY"; statusLeft.style.background = "#94a3b8";
            statusRight.innerHTML = "NO ATOMS"; statusRight.style.background = "#94a3b8";
        }
    }
};


window.addChatMessage = function(msg, prefixLabel) {
    let container = document.querySelector(".beaker-message");
    if(!container) return;
    let bubbleContainer = document.createElement("div");
    bubbleContainer.style.cssText = "margin-top: 10px; display: flex; flex-direction: column; align-items: flex-start;";
    
    let labelHtml = "";
    if (prefixLabel) {
        labelHtml = "<div style=\"font-weight: 900; font-size: 0.85rem; color: #64748b; margin-bottom: 4px; margin-left: 12px;\">" + prefixLabel + "</div>";
    }

    let bubbleStyle = "background: #0ea5e9; border: none; border-radius: 20px; border-bottom-left-radius: 4px; padding: 10px 16px; font-size: 1.05rem; color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 90%; line-height: 1.4;";
    
    bubbleContainer.innerHTML = labelHtml + "<div style=\"" + bubbleStyle + "\">" + msg + "</div>";
    container.appendChild(bubbleContainer);
    container.scrollTop = container.scrollHeight;
};

window.clearChat = function() {
    let container = document.querySelector(".beaker-message");
    if(container) container.innerHTML = "";
};

window.revealHeuristicHint = function() {
    let rCounts = window.counts.rCounts;
    let pCounts = window.counts.pCounts;
    let molCounts = window.counts.molCounts;
    
    let imbalancedEl = null;
    let needsMoreOn = null;
    
    for (let el in rCounts) {
        if (rCounts[el] < pCounts[el]) { imbalancedEl = el; needsMoreOn = "react"; break; }
        if (pCounts[el] < rCounts[el]) { imbalancedEl = el; needsMoreOn = "prod"; break; }
    }
    
    if (window.counts && window.counts.isEmpty) {
        window.addChatMessage("Add some reactants or products to the scales to start balancing!", "&#128161; Hint #" + window.hintCounter++);
        return;
    }
    if (!imbalancedEl) {
        window.addChatMessage("Everything looks perfectly balanced! You are doing great!", "&#128161; Hint #" + window.hintCounter++);
        return;
    }
    
    let sideName = needsMoreOn === "react" ? "REACTANTS (left side)" : "PRODUCTS (right side)";
    let bestMol = null;
    let bestMolObj = null;
    let mols = needsMoreOn === "react" ? currentLevelData.reactants : currentLevelData.products;
    mols.forEach(m => {
        if (m.composition[imbalancedEl]) { bestMol = m.name || m.id; bestMolObj = m; }
    });
    
    let elName = ELEM_NAMES[imbalancedEl] || imbalancedEl;
    let msg = "Try adding more <span style=\"background:rgba(255,255,255,0.2); padding:2px 8px; border-radius:12px; font-weight:bold;\">" + bestMolObj.displayHtml + "</span> to the <span style=\"font-weight:bold;\">" + sideName + "</span> to balance the " + elName + " atoms!";
    
    window.addChatMessage(msg, "&#128161; Hint #" + window.hintCounter++);
};


window.onload = function() { initEngine(); };
