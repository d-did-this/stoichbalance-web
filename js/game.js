
const ELEM_NAMES = { 
    H: "Hydrogen", O: "Oxygen", N: "Nitrogen", Na: "Sodium", K: "Potassium", 
    I: "Iodine", Zn: "Zinc", S: "Sulfur", Ag: "Silver", C: "Carbon", 
    Pb: "Lead", Al: "Aluminium", Cl: "Chlorine", Mg: "Magnesium", 
    Fe: "Iron", Cu: "Copper", Br: "Bromine", P: "Phosphorus", Ca: "Calcium" 
};






// engine.js - Dynamic Level Rendering Engine for Stoichbalance

let currentLevelData = null;




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
    window.proEquationRendered = false;

    if (!currentLevelData) {
        currentLevelData = LEVELS['F4L6']; // Fallback
    }
    
    document.title = currentLevelData.title;
    renderBoard();
    let titleEl = document.getElementById("level-title");
    if(titleEl && currentLevelData) {
        let match = levelId.match(/L(\d+)/);
        let prefix = match ? "Level " + match[1] + " : " : "";
        titleEl.innerText = prefix + currentLevelData.title;
    }
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

// Global Override for addMolecule
window.actionHistory = window.actionHistory || [];
window.addMolecule = function(side, typeId) {
    window.activeVisualHint = null; // Clear hint on interaction

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
    window.activeVisualHint = null; // Clear hint on interaction

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
            <div class="pro-scale-card ${colorClass}" style="position: relative; ${visualGlow}">${diffBadge}
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
        
        // Handle Win State Detection
        if (isBalanced && isSimplified) {
            if (window.lastWinState !== "won") {
                if(typeof playSound === "function") playSound("success");
                window.lastWinState = "won";
                setTimeout(showWinPopup, 300);
            }
        } else if (isBalanced && !isSimplified) {
            if (window.lastWinState !== "balanced") {
                if(typeof playSound === "function") playSound("sad");
                window.lastWinState = "balanced";
            }
        } else {
            window.lastWinState = "none";
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
    bubbleContainer.style.cssText = "margin-top: 15px; width: 100%; box-sizing: border-box;";
    
    let isHint = prefixLabel && prefixLabel.includes("Hint");
    let avatarIcon = isHint ? '💡' : '👨‍🔬';
    let avatarBg = isHint ? '#fef08a' : '#bfdbfe';
    let avatarColor = isHint ? '#a16207' : '#1e3a8a';
    let borderColor = isHint ? '#fde047' : '#93c5fd';
    
    let bubbleStyle = `background: #ffffff; border: 3px solid ${borderColor}; border-radius: 20px; padding: 14px 18px; font-size: 1.1rem; color: #334155; box-shadow: 0 4px 10px rgba(0,0,0,0.05); flex: 1; min-width: 0; line-height: 1.5; font-weight: 700; position: relative;`;
    
    let parsedLabel = prefixLabel ? prefixLabel.replace(/&#\d+;/g, "").trim() : (isHint ? "Hint" : "Prof. Beaker");
    let finalHtml = `
    <div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; margin-left: 12px;">
            <div style="width: 30px; height: 30px; border-radius: 50%; background: ${avatarBg}; border: 2px solid ${borderColor}; display: flex; align-items: center; justify-content: center; font-size: 1rem; color: ${avatarColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                ${avatarIcon}
            </div>
            <div style="font-weight: 900; font-size: 0.9rem; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">
                ${parsedLabel}
            </div>
        </div>
        <div style="${bubbleStyle}">
            ${msg}
        </div>
    </div>`;
    
    bubbleContainer.innerHTML = finalHtml;
    
    container.appendChild(bubbleContainer);
    container.scrollTop = container.scrollHeight;
};

window.clearChat = function() {
    let container = document.querySelector(".beaker-message");
    if(container) container.innerHTML = "";
};

window.revealHeuristicHint = function() {
    if(typeof playSound === "function") playSound("hint");
    let rCounts = window.counts.rCounts;
    let pCounts = window.counts.pCounts;
    
    let imbalancedEl = null;
    let needsMoreOn = null;
    
    for (let el in rCounts) {
        if (rCounts[el] < pCounts[el]) { imbalancedEl = el; needsMoreOn = "react"; break; }
        if (pCounts[el] < rCounts[el]) { imbalancedEl = el; needsMoreOn = "prod"; break; }
    }
    
    if (window.counts && window.counts.isEmpty) {
        window.addChatMessage("Add some reactants or products to the scales to start balancing!", "Hint #" + window.hintCounter++);
        return;
    }
    if (!imbalancedEl) {
        window.addChatMessage("Everything looks perfectly balanced! You are doing great!", "Hint #" + window.hintCounter++);
        return;
    }
    
    let sideName = needsMoreOn === "react" ? "REACTANTS" : "PRODUCTS";
    let bestMol = null;
    let bestMolObj = null;
    let mols = needsMoreOn === "react" ? currentLevelData.reactants : currentLevelData.products;
    mols.forEach(m => {
        if (m.composition[imbalancedEl]) { bestMol = m.name || m.id; bestMolObj = m; }
    });
    
    // Set visual hint
    window.activeVisualHint = { element: imbalancedEl, side: needsMoreOn };
    if(typeof playSound === "function") playSound("hint");
    updateSimulation(); // Apply visual glow immediately
    
    let elName = ELEM_NAMES[imbalancedEl] || imbalancedEl;
    let molHtml = `<span style="background: #eff6ff; color: #2563eb; border: 2px solid #bfdbfe; padding: 1px 6px; border-radius: 6px; font-weight: 800; font-size: 0.85em; box-shadow: 0 1px 0 #bfdbfe;">${bestMolObj.displayHtml}</span>`;
    let sideHtml = `<span style="background: #fdf4ff; color: #c026d3; border: 2px solid #f5d0fe; padding: 1px 6px; border-radius: 6px; font-weight: 800; font-size: 0.85em; box-shadow: 0 1px 0 #f5d0fe;">${sideName}</span>`;
    let elHtml = `<span style="background: #fef2f2; color: #dc2626; border: 2px solid #fecaca; padding: 1px 6px; border-radius: 6px; font-weight: 800; font-size: 0.85em; box-shadow: 0 1px 0 #fecaca;">${elName} atoms</span>`;
    
    let msg = `Add ${molHtml} to ${sideHtml} for ${elHtml}.`;
    
    window.addChatMessage(msg, "Hint #" + window.hintCounter++);
};



window.currentViewMode = "simple";
window.switchViewMode = function(mode) {
    if (mode === window.currentViewMode) return;
    window.currentViewMode = mode;
    if(typeof playSound === "function") playSound("switch");
    
    let btnSimple = document.getElementById("btn-side-simple");
    let btnPro = document.getElementById("btn-side-pro");
    if(mode === "simple") {
        if(btnSimple) btnSimple.classList.add("active-tab");
        if(btnPro) btnPro.classList.remove("active-tab");
        
        document.querySelector(".block-left").style.display = "flex";
        document.querySelector(".block-right").style.display = "flex";
        
        let blockMiddle = document.querySelector(".block-middle");
        if(blockMiddle) {
            blockMiddle.style.display = "flex";
            blockMiddle.style.gridColumn = "";
            blockMiddle.style.gridRow = "";
        }
        
        let blockPro = document.getElementById("block-pro");
        if(blockPro) blockPro.style.display = "none";
        
        // Reset grid
        let layout = document.querySelector(".good-layout");
        if(layout) {
            let leftCollapsed = document.querySelector(".block-left")?.classList.contains("collapsed");
            let rightCollapsed = document.querySelector(".block-right")?.classList.contains("collapsed");
            layout.style.setProperty("--left-w", leftCollapsed ? "80px" : "280px");
            layout.style.setProperty("--right-w", rightCollapsed ? "80px" : "280px");
            layout.style.gridTemplateRows = "";
        }
    } else if(mode === "pro") {
        if(btnPro) btnPro.classList.add("active-tab");
        if(btnSimple) btnSimple.classList.remove("active-tab");
        
        document.querySelector(".block-left").style.display = "none";
        document.querySelector(".block-right").style.display = "none";
        
        let blockMiddle = document.querySelector(".block-middle");
        if(blockMiddle) {
            blockMiddle.style.display = "flex";
            blockMiddle.style.gridColumn = "1 / -1";
            blockMiddle.style.gridRow = "3";
        }
        
        let blockPro = document.getElementById("block-pro");
        if(blockPro) blockPro.style.setProperty("display", "flex", "important");
        
        // Collapse grid so pro block can span cleanly
        let layout = document.querySelector(".good-layout");
        if(layout) {
            layout.style.setProperty("--left-w", "0px");
            layout.style.setProperty("--right-w", "0px");
            layout.style.gridTemplateRows = "90px auto minmax(0, 1fr)";
        }
        
        if(!window.proEquationRendered) {
            window.renderProModeEquation();
            window.proEquationRendered = true;
        }
        window.syncProBoxes();
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

window.showWinPopup = function() {
    if (document.getElementById("win-popup")) return;
    let overlay = document.createElement("div");
    overlay.id = "win-popup";
    overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 10000; backdrop-filter: blur(5px);";
    
    let modal = document.createElement("div");
    modal.style.cssText = "background: white; border: 4px solid #22c55e; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3); animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);";
    
    let levelId = new URLSearchParams(window.location.search).get('level');
    
    modal.innerHTML = `
        <h1 style="font-size: 3.5rem; color: #16a34a; margin: 0 0 10px 0; text-shadow: 0 2px 0 #bbf7d0;">🎉 BALANCED! 🎉</h1>
        <p style="font-size: 1.2rem; color: #475569; margin-bottom: 30px; font-weight: 700;">You successfully balanced the equation in its simplest form.</p>
        <button onclick="if(typeof playSound==='function') playSound('click'); window.transitionTo('levels.html')" style="background: #3b82f6; color: white; border: 4px solid #1d4ed8; padding: 15px 40px; font-size: 1.4rem; font-weight: 900; border-radius: 16px; cursor: pointer; box-shadow: 0 6px 0 #1e3a8a; transition: all 0.1s;" onmousedown="this.style.transform='translateY(6px)'; this.style.boxShadow='none';" onmouseup="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 0 #1e3a8a';">CONTINUE</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Create animation style if missing
    if(!document.getElementById('win-anim-style')) {
        let style = document.createElement('style');
        style.id = 'win-anim-style';
        style.innerHTML = `@keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }`;
        document.head.appendChild(style);
    }
    
    // Save to localStorage
    if (levelId) {
        let solved = JSON.parse(localStorage.getItem('solvedLevels') || '[]');
        if (!solved.includes(levelId)) {
            solved.push(levelId);
            localStorage.setItem('solvedLevels', JSON.stringify(solved));
        }
    }
};
