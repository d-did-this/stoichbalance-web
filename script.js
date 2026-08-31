
// Restore from storage
window.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('stoich_student_name')) {
        document.getElementById('student-name').value = localStorage.getItem('stoich_student_name');
    }
    });
let currentStreak = parseInt(localStorage.getItem('stoich_streak') || '0');
let puzzlesSolvedCount = parseInt(localStorage.getItem('stoich_solved') || '0');
let totalHintsUsed = parseInt(localStorage.getItem('stoich_hints') || '0');

function updateCountersDOM() {
    let p = document.getElementById('puzzle-counter');
    if(p) p.innerText = puzzlesSolvedCount + ' Solved';
    let s = document.getElementById('streak-counter');
    if(s) s.innerText = '🔥 ' + currentStreak;
}
let isMuted = false;
function toggleMute() {
    isMuted = !isMuted;
    const btn = document.getElementById('mute-btn');
    if(btn) btn.innerHTML = isMuted ? '🔇 Muted' : '🔊 Sound On';
}
// JS Dynamic Tooltips Engine (Guarantees NO clipping, always front layer)
        let activeTooltip = null;
        document.body.addEventListener('mouseover', (e) => {
            let target = e.target.closest('[data-tooltip], [data-html-tooltip]');
            if(target) {
                if(activeTooltip) activeTooltip.remove();
                
                let isHtml = target.hasAttribute('data-html-tooltip');
                let content = isHtml ? target.getAttribute('data-html-tooltip') : target.getAttribute('data-tooltip');
                
                activeTooltip = document.createElement('div');
                activeTooltip.className = isHtml ? 'js-tooltip html-tip' : 'js-tooltip';
                activeTooltip.innerHTML = content;
                document.body.appendChild(activeTooltip);
                
                let rect = target.getBoundingClientRect();
                let tipRect = activeTooltip.getBoundingClientRect();
                
                let top = rect.bottom + 10;
                let left = rect.left + (rect.width/2) - (tipRect.width/2);
                
                // Flip top if offscreen bottom
                if(top + tipRect.height > window.innerHeight) top = rect.top - tipRect.height - 10;
                // Boundary limits X
                if(left < 10) left = 10;
                if(left + tipRect.width > window.innerWidth - 10) left = window.innerWidth - tipRect.width - 10;
                
                activeTooltip.style.top = top + 'px';
                activeTooltip.style.left = left + 'px';
                
                // Reflow for CSS transition
                activeTooltip.offsetHeight;
                activeTooltip.style.opacity = 1;
            }
        });
        document.body.addEventListener('mouseout', (e) => {
            let target = e.target.closest('[data-tooltip], [data-html-tooltip]');
            if(target && activeTooltip) {
                activeTooltip.remove();
                activeTooltip = null;
            }
        });

        let currentForm = 'Form 4';

const FORM_4_REACTIONS = [
    { name: "[Easy] Making Water 💧", left: ["H2(g)", "O2(g)"], right: ["H2O(l)"] },
    { name: "[Easy] Salt Formation 🧂", left: ["Na(s)", "Cl2(g)"], right: ["NaCl(s)"] },
    { name: "[Easy] Making Ammonia 💨", left: ["N2(g)", "H2(g)"], right: ["NH3(g)"] },
    { name: "[Med] Burning Methane 🔥", left: ["CH4(g)", "O2(g)"], right: ["CO2(g)", "H2O(g)"] },
    { name: "[Med] Rusting Iron 🧲", left: ["Fe(s)", "O2(g)"], right: ["Fe2O3(s)"] }
];

const FORM_5_REACTIONS = [
    { name: "[Med] Burning Methanol 🔥", left: ["CH3OH(l)", "O2(g)"], right: ["CO2(g)", "H2O(g)"] },
    { name: "[Hard] Baking Soda 🧁", left: ["NaHCO3(s)"], right: ["Na2CO3(s)", "H2O(l)", "CO2(g)"] },
    { name: "[Hard] Aluminum Thermite 💥", left: ["Al(s)", "Fe2O3(s)"], right: ["Al2O3(s)", "Fe(s)"] },
    { name: "[Hard] Glucose Combustion 🌿", left: ["C6H12O6(s)", "O2(g)"], right: ["CO2(g)", "H2O(g)"] },
    { name: "[Hard] Copper Nitric Acid 🧪", left: ["Cu(s)", "HNO3(aq)"], right: ["Cu(NO3)2(aq)", "NO2(g)", "H2O(l)"] }
];

let REACTIONS = FORM_4_REACTIONS;

        const MOLECULE_NAMES = { "H2(g)": "Hydrogen Gas", "O2(g)": "Oxygen Gas", "H2O(l)": "Liquid Water", "H2O(g)": "Water Vapor", "CH3OH(l)": "Methanol", "CO2(g)": "Carbon Dioxide", "Fe(s)": "Solid Iron", "Cl2(g)": "Chlorine Gas", "FeCl3(s)": "Iron(III) Chloride", "Na(s)": "Solid Sodium", "NaOH(aq)": "Aqueous Sodium Hydroxide", "N2(g)": "Nitrogen Gas", "NH3(g)": "Ammonia Gas", "NaCl(s)": "Sodium Chloride", "CH4(g)": "Methane", "Fe2O3(s)": "Iron(III) Oxide", "NaHCO3(s)": "Sodium Bicarbonate", "Na2CO3(s)": "Sodium Carbonate", "Al(s)": "Solid Aluminum", "Al2O3(s)": "Aluminum Oxide", "C6H12O6(s)": "Glucose", "Cu(s)": "Copper", "HNO3(aq)": "Nitric Acid", "Cu(NO3)2(aq)": "Copper(II) Nitrate", "NO2(g)": "Nitrogen Dioxide" };

        const FULL_ELEMENT_NAMES = {
            "H": "Hydrogen", "O": "Oxygen", "C": "Carbon", "Fe": "Iron", "Cl": "Chlorine", "Na": "Sodium", "N": "Nitrogen", "S": "Sulfur"
        };

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        function playSound(type) { if (isMuted) return;

            if(audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            if (type === 'clink') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
                gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 0.1);
            } else if (type === 'whoosh') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(300, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 0.15);
            } else if (type === 'ding') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1600, audioCtx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.0);
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 1.0);
            }
        }

        function triggerConfetti() {
            for(let i=0; i<40; i++) {
                let conf = document.createElement('div');
                conf.style.position = 'fixed';
                conf.style.left = '50%';
                conf.style.top = '30%';
                conf.style.width = '12px';
                conf.style.height = '12px';
                conf.style.backgroundColor = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#ec4899'][Math.floor(Math.random()*5)];
                conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
                conf.style.zIndex = '9999';
                conf.style.pointerEvents = 'none';
                document.body.appendChild(conf);
                
                let angle = Math.random() * Math.PI * 2;
                let vel = 10 + Math.random() * 15;
                let vx = Math.cos(angle) * vel;
                let vy = Math.sin(angle) * vel - 10;
                let rot = Math.random() * 360;
                let vrot = (Math.random() - 0.5) * 20;
                
                let x = window.innerWidth/2;
                let y = window.innerHeight * 0.3;
                
                let anim = setInterval(() => {
                    x += vx;
                    vy += 0.5;
                    y += vy;
                    rot += vrot;
                    conf.style.transform = `translate(${x - window.innerWidth/2}px, ${y - window.innerHeight*0.3}px) rotate(${rot}deg)`;
                    if (y > window.innerHeight) {
                        clearInterval(anim);
                        conf.remove();
                    }
                }, 16);
            }
        }

        let state = { 
            rxIdx: 0, left: [], right: [], elementColors: {}, hintLevel: 0, lastHintElement: null, expectedMove: null, wrongMovesCounter: 0, 
            history: [], moves: 0, hardMode: false, hintsUsed: 0, completed: new Set() 
        };

        const DISTINCT_COLORS = [
            { bg: "#ef4444", color: "#fff" }, { bg: "#3b82f6", color: "#fff" }, 
            { bg: "#f59e0b", color: "#000" }, { bg: "#8b5cf6", color: "#fff" }, 
            { bg: "#10b981", color: "#fff" }, { bg: "#ec4899", color: "#fff" }, 
            { bg: "#06b6d4", color: "#000" } 
        ];

        function assignColors(reaction) {
            let elements = new Set();
            [...reaction.left, ...reaction.right].forEach(f => {
                Object.keys(parseFormula(f)).forEach(el => elements.add(el));
            });
            state.elementColors = {};
            let colorIdx = 0;
            elements.forEach(el => {
                state.elementColors[el] = DISTINCT_COLORS[colorIdx % DISTINCT_COLORS.length];
                colorIdx++;
            });
        }

        function parseFormula(f) {
            let core = f.split('(')[0];
            let atoms = {};
            let parts = core.match(/([A-Z][a-z]*)(\d*)/g) || [];
            parts.forEach(p => {
                let [, el, count] = p.match(/([A-Z][a-z]*)(\d*)/);
                atoms[el] = (atoms[el] || 0) + (parseInt(count) || 1);
            });
            return atoms;
        }

        function getFormulaHTML(f) {
            let stateMatch = f.match(/\(([a-z]+)\)/);
            let stateStr = stateMatch ? `<span style="font-size:0.6em; color:#94a3b8; font-style:italic; margin-left:2px;">(${stateMatch[1]})</span>` : '';
            let core = f.split('(')[0];
            return core.replace(/([A-Z][a-z]*)(\d+)/g, (match, el, num) => {
                return `${el}<span class="subscript">${num}</span>`;
            }) + stateStr;
        }

        function getFormulaHTMLForEquation(f) {
            let stateMatch = f.match(/\(([a-z]+)\)/);
            let stateStr = stateMatch ? `<span style="font-size:0.5em; color:#94a3b8; font-style:italic; margin-left:4px;">(${stateMatch[1]})</span>` : '';
            let core = f.split('(')[0];
            
            let html = core.replace(/([A-Z][a-z]*)(\d+)/g, (match, el, num) => {
                let col = state.elementColors[el];
                
                let marblesHtml = '';
                for(let i=0; i<num; i++) {
                    marblesHtml += `<div class="atom-marble" style="background:${col.bg}; color:${col.color}; width:28px; height:28px; font-size:14px; margin:0 3px;">${el}</div>`;
                }
                
                let tooltipHTML = `
                    <div style="margin-bottom: 12px; color:#64748b; font-size:16px; text-align:center;">The tiny <strong style="color:var(--primary); font-size:22px;">${num}</strong> means this molecule<br/>has ${num} atoms (marbles) inside it!</div>
                    <div style="display:flex; justify-content:center;">${marblesHtml}</div>
                `;

                return `${el}<span class="subscript-wrapper" data-html-tooltip='${tooltipHTML.replace(/'/g, "&apos;")}'>
                    <span class="subscript" style="border-bottom: 3px dotted #94a3b8; cursor:help;">${num}</span>
                </span>`;
            });
            return html + stateStr;
        }

        function calculateTotals(arr) {
            let totals = {};
            arr.forEach(f => {
                let atoms = parseFormula(f);
                for (let [el, num] of Object.entries(atoms)) {
                    totals[el] = (totals[el] || 0) + num;
                }
            });
            return totals;
        }

        function countMolecules(arr) {
            let counts = {};
            arr.forEach(f => counts[f] = (counts[f]||0) + 1);
            return counts;
        }

        function gcd(a, b) { return !b ? a : gcd(b, a % b); }
        function checkCanSimplify(lCounts, rCounts) {
            let rx = REACTIONS[state.rxIdx];
            let allVals = [];
            let isMissing = false;
            [...rx.left, ...rx.right].forEach(f => {
                let c = (lCounts[f] || 0) + (rCounts[f] || 0);
                if(c > 0) allVals.push(c);
                else isMissing = true;
            });
            if(allVals.length === 0 || isMissing) return false;
            let g = allVals[0];
            for(let i=1; i<allVals.length; i++) g = gcd(g, allVals[i]);
            return g > 1;
        }

        function dragStart(e, side, formula) {
            e.dataTransfer.setData("application/json", JSON.stringify({side, formula}));
            e.dataTransfer.effectAllowed = "copy";
        }
        function allowDrop(e) { e.preventDefault(); }
        function dragEnter(e) { e.currentTarget.classList.add('drag-over'); }
        function dragLeave(e) { e.currentTarget.classList.remove('drag-over'); }
        function drop(e, targetSide) {
            e.preventDefault();
            e.currentTarget.classList.remove('drag-over');
            let data = e.dataTransfer.getData("application/json");
            if(data) {
                let parsed = JSON.parse(data);
                if(parsed.side === targetSide) addMolecule(targetSide, parsed.formula);
            }
        }

        function openCustomModal() {
            document.getElementById('custom-modal').style.display = 'flex';
            document.getElementById('custom-name').value = '';
            document.getElementById('custom-left').value = '';
            document.getElementById('custom-right').value = '';
            document.getElementById('custom-error').style.display = 'none';
        }

        function closeCustomModal() {
            document.getElementById('custom-modal').style.display = 'none';
        }

        function saveCustomPuzzle() {
            let name = document.getElementById('custom-name').value.trim() || "Custom Puzzle";
            let leftStr = document.getElementById('custom-left').value.trim();
            let rightStr = document.getElementById('custom-right').value.trim();
            let errorEl = document.getElementById('custom-error');

            if(!leftStr || !rightStr) {
                errorEl.textContent = "Please enter both Reactants and Products!";
                errorEl.style.display = 'block';
                return;
            }

            // Replace spaces but keep valid alphanumeric for formula parsing
            let left = leftStr.split(',').map(s => s.replace(/\s+/g, '')).filter(s => s.length > 0);
            let right = rightStr.split(',').map(s => s.replace(/\s+/g, '')).filter(s => s.length > 0);

            if(left.length === 0 || right.length === 0) {
                errorEl.textContent = "Invalid format! Use commas like: H2, O2";
                errorEl.style.display = 'block';
                return;
            }

            // Validate that elements match on both sides
            let lElements = new Set();
            let rElements = new Set();
            left.forEach(f => Object.keys(parseFormula(f)).forEach(e => lElements.add(e)));
            right.forEach(f => Object.keys(parseFormula(f)).forEach(e => rElements.add(e)));
            
            let lArray = Array.from(lElements).sort();
            let rArray = Array.from(rElements).sort();
            if(JSON.stringify(lArray) !== JSON.stringify(rArray)) {
                errorEl.textContent = `Elements don't match! Reactants have [${lArray.join(',')}] but Products have [${rArray.join(',')}]`;
                errorEl.style.display = 'block';
                return;
            }

            let newReaction = { name: "🛠️ " + name, left: left, right: right };
            REACTIONS.push(newReaction);
            
            populateDropdown();
            let newIdx = REACTIONS.length - 1;
            document.getElementById('reaction-select').value = newIdx;
            loadReaction(newIdx);
            
            closeCustomModal();
        }

        function updateCounter() {
            let total = REACTIONS.length;
            let comp = state.completed.size;
            let el = document.getElementById('puzzle-counter');
            el.textContent = `${comp} / ${total}`;
            
            if (comp === total) {
                el.setAttribute('data-tooltip', `Amazing! ${comp} out of ${total} completed! Congrats! 🎉`);
                el.style.background = '#facc15';
                el.style.borderColor = '#ca8a04';
                el.style.boxShadow = '0 4px 0 #ca8a04';
                el.style.color = '#713f12';
            } else {
                el.setAttribute('data-tooltip', `${comp} out of ${total} completed! Solve more!`);
                el.style.background = 'var(--st-green)';
                el.style.borderColor = '#047857';
                el.style.boxShadow = '0 4px 0 #047857';
                el.style.color = 'white';
            }
        }

        function populateDropdown() {
            const sel = document.getElementById('reaction-select');
            sel.innerHTML = '';
            REACTIONS.forEach((rx, i) => {
                let badge = state.completed.has(i) ? '✅ ' : '';
                sel.add(new Option(`${badge}Puzzle: ${rx.name}`, i));
            });
            sel.add(new Option(`➕ Create Custom Puzzle...`, 'custom'));
        }

        function showTutSlide(n) {
            for(let i=1; i<=5; i++) {
                let el = document.getElementById('tut-slide-' + i);
                if(el) el.style.display = 'none';
            }
            let target = document.getElementById('tut-slide-' + n);
            if(target) target.style.display = 'block';
        }

        function openTutorial() {
            document.getElementById('tutorial-modal').style.display = 'flex';
            showTutSlide(1);
        }

        function closeTutorial() {
            document.getElementById('tutorial-modal').style.display = 'none';
            localStorage.setItem('STOICHBALANCE_tutorial_seen', 'true');
        }

        
function init() {
    updateCountersDOM();
    
    let savedName = localStorage.getItem('stoich_student_name') || '';
    let savedForm = localStorage.getItem('stoich_student_form') || currentForm;
    let greet = document.getElementById('user-greeting');
    if (greet && savedName) {
        greet.innerText = "👋 Welcome, " + savedName + " (" + savedForm + ")";
    }

    let grid = document.getElementById('level-grid');
    if (grid) {
        grid.innerHTML = '';
        REACTIONS.forEach((rx, i) => {
            let btn = document.createElement('button');
            btn.className = 'level-btn';
            
            // Check if solved
            if (localStorage.getItem('solved_' + rx.name)) {
                btn.classList.add('solved');
            }
            
            let diffColor = rx.name.includes('[Easy]') ? '#10b981' : (rx.name.includes('[Med]') ? '#f59e0b' : '#ef4444');
            let cleanName = rx.name;
            let tag = "";
            let match = rx.name.match(/\[(.*?)\]/);
            if(match) {
                tag = match[0];
                cleanName = rx.name.replace(tag + ' ', '');
            }
            
            let tagHtml = `<div class="level-tag" style="background:${diffColor}22; color:${diffColor}; border: 3px solid ${diffColor};">Level ${i + 1}</div>`;
            let leftFormatted = rx.left.map(f => getFormulaHTML(f)).join(' + ');
            let rightFormatted = rx.right.map(f => getFormulaHTML(f)).join(' + ');
            btn.innerHTML = `${tagHtml}<div class="level-btn-title">${cleanName}</div><div class="eq-preview">${leftFormatted} &rarr; ${rightFormatted}</div>`;
            
            btn.onclick = () => startGame(i);
            grid.appendChild(btn);
        });
    }
    
    if (!localStorage.getItem('STOICHBALANCE_tutorial_seen')) {
        openTutorial();
    }
}

function loadReaction(idx) {
    state.hintLevel = 0;
            state.rxIdx = parseInt(idx);
            let rx = REACTIONS[state.rxIdx];
            assignColors(rx);
            state.left = [...rx.left]; 
            state.right = [...rx.right];
            state.hintLevel = 0;
            state.lastHintElement = null;
            state.expectedMove = null;
            state.wrongMovesCounter = 0;
            state.history = [];
            state.moves = 0;
            state.hintsUsed = 0;
            
            const chatBox = document.getElementById('chat-box');
            chatBox.innerHTML = '';
            addChatMessage(`Hello there! 👋 We are solving: <strong>${rx.name}</strong>!<br/><br/>Try dragging colorful molecule blocks from the top into the big white boxes below!`, 'agent');

            document.getElementById('header-reactants').setAttribute('data-tooltip', `REACTANTS are the starting ingredients! (${rx.left.join(', ')})`);
            document.getElementById('header-products').setAttribute('data-tooltip', `PRODUCTS are what we make! (${rx.right.join(', ')})`);

            renderTrays();
            updateCounter();
            updateUI();
        }

        function clearChat() {
            document.getElementById('chat-box').innerHTML = '';
            addChatMessage(`Chat cleared! What's next?`, 'agent');
            state.expectedMove = null;
            state.wrongMovesCounter = 0;
            state.hintLevel = 0;
            state.lastHintElement = null;
        }

        function solveOneStep(side, formula) {
            state.wrongMovesCounter = 0;
            state.expectedMove = null;
            state[side].push(formula);
            document.getElementById('chat-box').innerHTML = '';
            addChatMessage(`I've added the <strong>${MOLECULE_NAMES[formula]||formula}</strong> block for you! Let's continue!`, 'success');
            state.hintLevel = 0; 
            state.lastHintElement = null; 
            updateUI(); 
        }

        function resetEquation() { loadReaction(state.rxIdx); }
        
        function saveState() {
            state.history.push({ left: [...state.left], right: [...state.right] });
        }

        function undo() {
            if(state.history.length > 0) {
                let last = state.history.pop();
                state.left = [...last.left];
                state.right = [...last.right];
                playSound('whoosh');
                updateUI();
            }
        }

        function toggleHardMode() {
            state.hardMode = document.getElementById('hard-mode-toggle').checked;
            document.getElementById('element-scales-container').style.display = state.hardMode ? 'none' : 'flex';
        }

        function addMolecule(side, formula) { 
            saveState();
            state.moves++;
            state[side].push(formula); 
            playSound('clink');
            
            // Common Mistake Detection
            let lTotals = calculateTotals(state.left);
            let rTotals = calculateTotals(state.right);
            let addedAtoms = parseFormula(formula);
            let isExcess = false;
            let excessEl = '';
            for(let [el, num] of Object.entries(addedAtoms)) {
                if(side === 'left' && lTotals[el] - num > (rTotals[el] || 0)) { isExcess = true; excessEl = el; break; }
                if(side === 'right' && rTotals[el] - num > (lTotals[el] || 0)) { isExcess = true; excessEl = el; break; }
            }
            if(isExcess) {
                addChatMessage(`Careful! You already have too much <strong>${FULL_ELEMENT_NAMES[excessEl] || excessEl}</strong> on the ${side==='left'?'Reactants':'Products'} side! Adding this block tips the scale even further!`, 'system');
            }

            if (state.expectedMove) {
                if (state.expectedMove.side === side && state.expectedMove.molecule === formula) {
                    document.getElementById('chat-box').innerHTML = '';
                    addChatMessage(`<strong>🎉 Great job!</strong> You followed the hint perfectly! Let's keep balancing!`, 'success');
                    state.wrongMovesCounter = 0;
                    state.expectedMove = null;
                } else {
                    state.wrongMovesCounter++;
                    let msg = `Oops! That wasn't the exact block the hint suggested. Try re-reading the hint!`;
                    if (state.wrongMovesCounter >= 2) {
                        msg += `<br><br><button onclick="solveOneStep('${state.expectedMove.side}', '${state.expectedMove.molecule}')" style="background:#10b981; color:white; border-color:#047857; box-shadow: 0 4px 0 #047857; width:100%;">Solve this step for me</button>`;
                    }
                    addChatMessage(msg, 'system');
                }
            }
            
            state.hintLevel = 0; 
            state.lastHintElement = null; 
            updateUI(); 
        }
        
        function removeMolecule(side, index) { 
            saveState();
            state.moves++;
            state[side].splice(index, 1); 
            playSound('whoosh');
            state.hintLevel = 0; 
            state.lastHintElement = null; 
            updateUI(); 
        }

        function updateUI() {
            renderEquationGrid();
            renderWorkspaceAreas();
            let lTotals = calculateTotals(state.left);
            let rTotals = calculateTotals(state.right);
            renderTallies(lTotals, rTotals);
            renderScales(lTotals, rTotals);
            checkWinState(lTotals, rTotals);
        }

        function renderEquationGrid() {
            let rx = REACTIONS[state.rxIdx];
            let lCounts = countMolecules(state.left);
            let rCounts = countMolecules(state.right);

            const renderSide = (mols, counts) => {
                return mols.map((f, i) => {
                    let plus = i > 0 ? ` <div class="eq-plus">+</div> ` : '';
                    let c = counts[f] || 0;
                    
                    let clusterHtml = generateMarbleCluster(f, 20);
                    let coeffVisuals = '';
                    for(let k=0; k<c; k++) coeffVisuals += `<div style="display:inline-block; margin:2px;">${clusterHtml}</div>`;
                    let coeffTooltip = `<div style="margin-bottom:10px; font-size:16px; text-align:center;">You added <strong>${c}</strong> of these!</div><div style="display:flex; flex-wrap:wrap; justify-content:center; max-width:200px;">${coeffVisuals}</div>`;

                    let coeffMarkup = `<span class="eq-coeff" ${c > 0 ? `data-html-tooltip='${coeffTooltip.replace(/'/g, "&apos;")}'` : ''}>${c}</span>`;

                    return `${plus}<div class="eq-mol">
                        <span class="subscript-wrapper" style="margin-right:8px;">${coeffMarkup}</span>
                        <span class="eq-formula" data-tooltip="This is ${MOLECULE_NAMES[f]||f}!">${getFormulaHTMLForEquation(f)}</span>
                    </div>`;
                }).join('');
            };

            document.getElementById('eq-left-content').innerHTML = renderSide(rx.left, lCounts);
            document.getElementById('eq-right-content').innerHTML = renderSide(rx.right, rCounts);
        }

        function generateMarbleCluster(formula, size=24) {
            let atomsObj = parseFormula(formula);
            let html = `<div class="atom-cluster">`;
            for (let [el, num] of Object.entries(atomsObj)) {
                let col = state.elementColors[el];
                for(let i=0; i<num; i++) {
                    html += `<div class="atom-marble" style="background:${col.bg}; color:${col.color}; width:${size}px; height:${size}px; font-size:${size*0.45}px;">${el}</div>`;
                }
            }
            html += `</div>`;
            return html;
        }

        function renderTrays() {
            let rx = REACTIONS[state.rxIdx];
            const renderSide = (id, arr, sideStr) => {
                const tray = document.getElementById(id);
                tray.innerHTML = '';
                arr.forEach(f => {
                    let btn = document.createElement('div');
                    btn.className = 'tray-btn';
                    btn.draggable = true;
                    btn.ondragstart = (e) => dragStart(e, sideStr, f);
                    btn.onclick = () => addMolecule(sideStr, f); 
                    
                    let previewHTML = `
                        <div style="font-size: 16px; font-weight: 900; color: #334155; margin-bottom: 6px; border-bottom: 2px dashed #e2e8f0; padding-bottom: 4px; width: 100%; text-align: center;">${MOLECULE_NAMES[f]||f}</div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size:14px; color:#64748b;">Drag me!</span>
                            <span style="font-size:20px; color:var(--primary);">→</span>
                            ${generateMarbleCluster(f, 30)}
                        </div>
                    `;
                    
                    btn.setAttribute('data-html-tooltip', previewHTML.replace(/'/g, "&apos;"));
                    btn.innerHTML = getFormulaHTML(f);
                    tray.appendChild(btn);
                });
            };
            renderSide('tray-left', rx.left, 'left');
            renderSide('tray-right', rx.right, 'right');
        }

        function renderWorkspaceAreas() {
            const renderSide = (id, arr, sideStr) => {
                const area = document.getElementById(id);
                area.innerHTML = '';
                
                let groups = {};
                arr.forEach((f, idx) => {
                    if(!groups[f]) groups[f] = [];
                    groups[f].push(idx);
                });

                Object.keys(groups).forEach(f => {
                    let row = document.createElement('div');
                    row.className = 'mol-row';
                    
                    groups[f].forEach(idx => {
                        let card = document.createElement('div');
                        card.className = 'mol-card';
                        card.onclick = () => removeMolecule(sideStr, idx);
                        card.title = "Click to remove";
                        
                        card.innerHTML = `
                            <div class="mol-remove-overlay">❌</div>
                            <div class="mol-formula">${getFormulaHTML(f)}</div>
                            ${generateMarbleCluster(f, 36)}
                        `;
                        row.appendChild(card);
                    });
                    
                    area.appendChild(row);
                });
            };
            renderSide('area-left', state.left, 'left');
            renderSide('area-right', state.right, 'right');
        }

        function renderTallies(lTotals, rTotals) {
            let rx = REACTIONS[state.rxIdx];
            let allElements = new Set();
            [...rx.left, ...rx.right].forEach(f => { Object.keys(parseFormula(f)).forEach(el => allElements.add(el)); });
            
            const renderSide = (id, totals, oppositeTotals) => {
                const tally = document.getElementById(id);
                tally.innerHTML = '';
                allElements.forEach(el => {
                    let count = totals[el] || 0;
                    let opCount = oppositeTotals[el] || 0;
                    
                    let statusClass = 'tally-red';
                    let tip = `Uh oh! Atoms don't match!`;
                    if(count > 0 || opCount > 0) {
                        if(count === opCount) { statusClass = 'tally-green'; tip = `Perfect! These match exactly!`; }
                    }

                    if (count > 0 || opCount > 0) {
                        let col = state.elementColors[el];
                        tally.innerHTML += `
                            <div class="tally-item ${statusClass}" data-tooltip="${tip}">
                                <div class="atom-marble" style="background:${col.bg}; color:${col.color}; width:24px; height:24px; font-size:12px; border:2px solid rgba(0,0,0,0.2); box-shadow:none;">${el}</div>
                                <span>= ${count}</span>
                            </div>
                        `;
                    }
                });
            };
            renderSide('tally-left', lTotals, rTotals);
            renderSide('tally-right', rTotals, lTotals);
        }

        // DOM Hexagonal Packing Math (Draws perfectly inside the HTML Divs!)
        function generateDomMarblesGrid(jarWidth, countsObj, size, maxPerRowBase) {
            let html = '';
            let flatMarbles = [];
            for(let [el, num] of Object.entries(countsObj)) {
                for(let i=0; i<num; i++) flatMarbles.push(el);
            }
            
            let row = 0;
            let indexInRow = 0;
            let currentMax = maxPerRowBase;
            let r = size/2;
            
            for(let i=0; i<flatMarbles.length; i++) {
                let el = flatMarbles[i];
                if(indexInRow >= currentMax) {
                    row++;
                    indexInRow = 0;
                    currentMax = (row % 2 === 0) ? maxPerRowBase : (maxPerRowBase - 1);
                }
                
                let rowWidth = (currentMax - 1) * (r * 2.1);
                let startX = (jarWidth / 2) - (rowWidth / 2);
                let left = startX + (indexInRow * (r * 2.1));
                let bottom = 5 + (row * (r * 1.8)); // 5px padding from floor
                
                let col = state.elementColors[el];
                html += `<div class="atom-marble" style="position:absolute; left:${left - r}px; bottom:${bottom}px; width:${size}px; height:${size}px; font-size:${size*0.45}px; background:${col.bg}; color:${col.color}; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">${el}</div>`;
                indexInRow++;
            }
            return html;
        }

        function renderScales(lTotals, rTotals) {
            let rx = REACTIONS[state.rxIdx];
            let allElsSet = new Set([...Object.keys(calculateTotals(rx.left)), ...Object.keys(calculateTotals(rx.right))]);
            let allElements = Array.from(allElsSet);
            
            const cont = document.getElementById('element-scales-container');
            cont.innerHTML = `
                <div class="sidebar-title-wrapper" data-tooltip="These scales show if each Element's atoms are balanced!">
                    <div class="sidebar-title">🔍 Tiny Scales!</div>
                </div>
            `;

            let totalL = 0, totalR = 0, balancedCount = 0;

            allElements.forEach(el => {
                let l = lTotals[el] || 0, r = rTotals[el] || 0;
                totalL += l; totalR += r;
                let diff = l - r;
                
                let sClass = 'state-red', tilt = 0;
                let tip = `Oh no, ${FULL_ELEMENT_NAMES[el]} atoms are unbalanced!`;
                
                if (diff === 0 && l > 0) { sClass = 'state-green'; balancedCount++; tip = `Yay! ${FULL_ELEMENT_NAMES[el]} atoms are perfectly balanced!`; }
                else if (diff === 0) { sClass = ''; balancedCount++; tip = `Empty! Add some blocks!`; } 
                else { tilt = diff>0?-15:15; }

                let objL = {}; if(l>0) objL[el] = l;
                let objR = {}; if(r>0) objR[el] = r;
                let fullName = `${FULL_ELEMENT_NAMES[el] || el} (${el})`;

                cont.innerHTML += `
                    <div class="scale-card card ${sClass}" id="scale-card-${el}" data-tooltip="${tip}">
                        <div class="scale-header">${fullName}</div>
                        
                        <!-- DOM Tiny Seesaw -->
                        <div class="tiny-seesaw-container">
                            <div class="seesaw-beam" id="ts-beam-${el}" style="transform: rotate(${tilt}deg);">
                                <div class="seesaw-jar left-jar" id="ts-jar-l-${el}" style="transform: rotate(${-tilt}deg);">
                                    <div class="jar-marbles-container">${generateDomMarblesGrid(60, objL, 16, 4)}</div>
                                </div>
                                <div class="seesaw-jar right-jar" id="ts-jar-r-${el}" style="transform: rotate(${-tilt}deg);">
                                    <div class="jar-marbles-container">${generateDomMarblesGrid(60, objR, 16, 4)}</div>
                                </div>
                            </div>
                            <div class="seesaw-pin"></div>
                            <div class="seesaw-base"></div>
                        </div>

                        <div class="scale-footer"><span style="color:${l>r?'#ef4444':''}">${l}</span><span style="color:${r>l?'#ef4444':''}">${r}</span></div>
                    </div>
                `;
            });

            // Master Scale logic
            let mDiff = totalL - totalR;
            let mTilt = mDiff===0 ? 0 : (mDiff>0?-10:10);
            
            document.getElementById('ms-beam').style.transform = `rotate(${mTilt}deg)`;
            
            // Counter-rotate the jars so they stay physically upright like swinging buckets!
            document.getElementById('ms-jar-left').style.transform = `rotate(${-mTilt}deg)`;
            document.getElementById('ms-jar-right').style.transform = `rotate(${-mTilt}deg)`;

            // Hexagonal packing in the master bucket (Radius 12 => size 26, max 8 per base row in 200px jar)
            document.getElementById('ms-marbles-left').innerHTML = generateDomMarblesGrid(200, lTotals, 26, 8);
            document.getElementById('ms-marbles-right').innerHTML = generateDomMarblesGrid(200, rTotals, 26, 8);

            const mCard = document.getElementById('master-scale');
            const mText = document.getElementById('ms-status-text');
            const mEmoji = document.getElementById('ms-emoji');
            
            mCard.className = "master-card card";
            
            if (totalL === 0 && totalR === 0) {
                mCard.classList.add("state-red");
                mText.textContent = "It's empty! Add molecules!"; mEmoji.textContent = "🤔";
            } else if (balancedCount === allElements.length) {
                let lCounts = countMolecules(state.left);
                let rCounts = countMolecules(state.right);
                if (checkCanSimplify(lCounts, rCounts)) {
                    mCard.classList.add("state-yellow");
                    mText.textContent = "Equal, but too big! Take some away!"; mEmoji.textContent = "😅";
                } else {
                    mCard.classList.add("state-green");
                    mText.textContent = "YAY! PERFECTLY BALANCED!"; mEmoji.textContent = "🎉";
                }
            } else {
                if (Math.abs(mDiff) > 0 && Math.abs(mDiff) <= 2) {
                    mCard.classList.add("state-yellow");
                    mText.textContent = "So Close! Keep going!"; mEmoji.textContent = "👀";
                } else {
                    mCard.classList.add("state-red");
                    mText.textContent = "Uh Oh! Unbalanced!"; mEmoji.textContent = "😢";
                }
            }
        }

        /* --- Friendly Chat System --- */
        function toggleGuide() {
            document.getElementById('teacher-guide').classList.toggle('collapsed');
        }

        function addChatMessage(msg, type) {
            const chatBox = document.getElementById('chat-box');
            let bubble = document.createElement('div');
            bubble.className = `chat-bubble chat-${type}`;
            bubble.innerHTML = msg;
            chatBox.appendChild(bubble);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        function checkWinState(lTotals, rTotals) {
            let rx = REACTIONS[state.rxIdx];
            let allElsSet = new Set([...Object.keys(calculateTotals(rx.left)), ...Object.keys(calculateTotals(rx.right))]);
            let balancedCount = 0;
            
            for(let el of allElsSet) {
                let l = lTotals[el] || 0, r = rTotals[el] || 0;
                if(l === r && l > 0) balancedCount++;
            }

            if (balancedCount === allElsSet.size && allElsSet.size > 0) {
                let lCounts = countMolecules(state.left);
                let rCounts = countMolecules(state.right);
                if (checkCanSimplify(lCounts, rCounts)) {
                    addChatMessage(`You did it! But wait... we can make it simpler! Try taking away the exact same amount of molecules from BOTH sides!`, 'system');
                } else {
                    if (!state.completed.has(state.rxIdx)) {
                        state.completed.add(state.rxIdx);
                        updateCounter();
                        populateDropdown();
                        document.getElementById('reaction-select').value = state.rxIdx;
                    }
                    playSound('ding');
                    triggerConfetti();
    if (!localStorage.getItem('solved_' + REACTIONS[state.rxIdx].name)) {
        currentStreak++;
        puzzlesSolvedCount++;
        localStorage.setItem('stoich_streak', currentStreak);
        localStorage.setItem('stoich_solved', puzzlesSolvedCount);
        updateCountersDOM();
        localStorage.setItem('solved_' + REACTIONS[state.rxIdx].name, 'true');
    }
                    
                    let optimalMoves = (rx.left.length + rx.right.length) * 2; // rough estimate
                    let stars = state.moves <= optimalMoves ? 3 : (state.moves <= optimalMoves * 2 ? 2 : 1);
                    let starStr = '⭐'.repeat(stars) + '❌'.repeat(3-stars);

                    addChatMessage(`<strong>🎉 YOU DID IT! 🎉</strong><br/>The equation is perfectly balanced!<br/>Moves: <strong>${state.moves}</strong> | Efficiency: ${starStr}<br/><br/><div style="font-size:12px; background:#f0fdf4; padding:8px; border-radius:8px;"><strong>Why didn't we stop earlier?</strong><br/>The simplest integer ratio is the standard way to write chemical equations because it represents the smallest possible fundamental reaction!</div><br/>Pick a new puzzle from the menu to play again!`, 'success');
                }
            }
        }

        function getBestHintData() {
            let lTotals = calculateTotals(state.left);
            let rTotals = calculateTotals(state.right);
            let rx = REACTIONS[state.rxIdx];
            let allElsSet = new Set([...Object.keys(calculateTotals(rx.left)), ...Object.keys(calculateTotals(rx.right))]);
            
            let imbalances = [];
            for(let el of allElsSet) {
                let l = lTotals[el] || 0, r = rTotals[el] || 0;
                if(l !== r) {
                    let diff = Math.abs(l - r);
                    let sideNeeds = l < r ? 'left' : 'right';
                    let mols = sideNeeds === 'left' ? rx.left : rx.right;
                    
                    let options = mols.filter(m => parseFormula(m)[el] > 0);
                    if(options.length === 0) continue;

                    let bestOption = options[0];
                    let minComplexity = 999;
                    options.forEach(opt => {
                        let complexity = Object.keys(parseFormula(opt)).length;
                        if(complexity < minComplexity) { minComplexity = complexity; bestOption = opt; }
                    });
                    
                    imbalances.push({
                        element: el,
                        diff: diff,
                        sideNeeds: sideNeeds,
                        bestMolecule: bestOption,
                        score: diff + (10 - minComplexity)
                    });
                }
            }
            
            if(imbalances.length === 0) return null;
            imbalances.sort((a,b) => b.score - a.score);
            return imbalances[0];
        }

        function revealHeuristicHint() {
    totalHintsUsed++;
    currentStreak = 0;
    localStorage.setItem('stoich_streak', 0);
    localStorage.setItem('stoich_hints', totalHintsUsed);
    updateCountersDOM();

            if(state.hardMode && state.hintsUsed >= 3) {
                addChatMessage(`🚨 You've used all 3 hints for this puzzle in Hard Mode! You're on your own now!`, 'agent');
                return;
            }
            state.hintsUsed++;

            let hintData = getBestHintData();
            if(!hintData) {
                addChatMessage(`Looks perfectly balanced to me! You're doing great!`, 'agent');
                return;
            }

            if(state.lastHintElement !== hintData.element) {
                state.hintLevel = 1;
                state.lastHintElement = hintData.element;
            } else {
                state.hintLevel++;
                if(state.hintLevel > 3) state.hintLevel = 3; // Cap at 3
            }

            let isLeft = hintData.sideNeeds === 'left';
            let sideName = isLeft ? "REACTANTS (left side)" : "PRODUCTS (right side)";
            let sideColor = isLeft ? "var(--primary)" : "var(--st-green)";
            let sideBorder = isLeft ? "#1d4ed8" : "#047857";
            let sideNameBadge = `<span style="background:${sideColor}; color:white; padding:4px 8px; border-radius:8px; border:2px solid ${sideBorder}; font-weight:900; box-shadow:0 2px 0 ${sideBorder}; display:inline-block; margin:2px 0;">${sideName}</span>`;
            
            let fullName = FULL_ELEMENT_NAMES[hintData.element] || hintData.element;
            let fullNameBadge = `<span style="background:var(--st-yellow); color:#713f12; padding:4px 8px; border-radius:8px; border:2px solid #ca8a04; font-weight:900; box-shadow:0 2px 0 #ca8a04; display:inline-block; margin:2px 0;">${fullName}</span>`;
            
            let molName = MOLECULE_NAMES[hintData.bestMolecule] || hintData.bestMolecule;
            let molHTML = generateMarbleCluster(hintData.bestMolecule, 32);
            let molBadge = `<span style="background:#ffffff; color:#1e293b; padding:4px 8px; border-radius:8px; border:2px solid #cbd5e1; font-weight:900; box-shadow:0 2px 0 #cbd5e1; display:inline-block; margin:2px 0;">${molName}</span>`;
            
            if (state.hintLevel === 1) {
                addChatMessage(`🤔 Let's focus on ${fullNameBadge}! Check its tiny scale to the left... it looks like it's tipping! We have too few on the ${sideNameBadge}.`, 'agent');
                
                let tinyScale = document.getElementById(`scale-card-${hintData.element}`);
                if(tinyScale) {
                    tinyScale.style.boxShadow = "0 0 0 5px var(--st-yellow), 0 10px 20px rgba(0,0,0,0.2)";
                    setTimeout(() => { tinyScale.style.boxShadow = "var(--shadow-toy)"; }, 5000);
                }
            } 
            else if (state.hintLevel === 2) {
                addChatMessage(`⚖️ To fix the ${fullNameBadge} imbalance, we need to add more molecules to the ${sideNameBadge} box!`, 'agent');
                
                let dropArea = document.getElementById(`area-${hintData.sideNeeds}`);
                if(dropArea) {
                    dropArea.style.boxShadow = "0 0 0 5px var(--st-yellow), inset 0 0 20px rgba(234, 179, 8, 0.3)";
                    setTimeout(() => { dropArea.style.boxShadow = ""; }, 5000);
                }
            }
            else {
                state.expectedMove = { side: hintData.sideNeeds, molecule: hintData.bestMolecule };
                addChatMessage(`💡 <strong>Try this exact move:</strong><br/><br/>Drag a ${molBadge} block into the ${sideNameBadge} box!<br/><br/><div style="display:flex; justify-content:center; background:rgba(255,255,255,0.6); padding:10px; border-radius:16px; border:3px dashed #94a3b8;">${molHTML}</div>`, 'agent');
                
                let trays = document.getElementById(`tray-${hintData.sideNeeds}`).children;
                for(let btn of trays) {
                    if(btn.innerHTML.includes(hintData.bestMolecule)) {
                        btn.style.transform = "scale(1.2)";
                        btn.style.boxShadow = "0 0 0 5px var(--st-yellow), 0 10px 20px rgba(0,0,0,0.2)";
                        setTimeout(() => { btn.style.transform = ""; btn.style.boxShadow = "0 4px 0 var(--primary)"; }, 5000);
                        break;
                    }
                }
            }
        }

        window.onload = init;
function downloadReport() {
    const name = document.getElementById('student-name').value || 'Unknown Student';
    const age = document.getElementById('student-form').value || 'N/A';
    const text = "STOICHBALANCE - TEACHER REPORT\nDate: " + new Date().toLocaleString() + "\nStudent: " + name + " (" + (document.getElementById('student-form').value || 'Form 4') + "\n\nTotal Puzzles Solved: " + puzzlesSolvedCount + "\nCurrent Streak: " + currentStreak + "\nTotal Hints Used: " + totalHintsUsed + "\n\nKeep up the great work!";
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Stoichbalance_Report.txt';
    a.click();
    URL.revokeObjectURL(url);
}



function goToLevels(selectedForm) {
    let name = document.getElementById('student-name').value.trim();
    if(!name) {
        alert("Please enter your Student Name before continuing!");
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('stoich_student_name', name);
    localStorage.setItem('stoich_student_form', selectedForm);
    
    currentForm = selectedForm;
    REACTIONS = (currentForm === 'Form 5') ? FORM_5_REACTIONS : FORM_4_REACTIONS;
    
    // Re-render grid for specific form
    init();
    
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('level-screen').style.display = 'flex';
}

function startGame(index) {
    document.getElementById('main-menu').classList.add('hidden');
    if(typeof isMuted !== 'undefined' && !isMuted) playSound('whoosh');
    state.rxIdx = index;
    loadReaction(index);
}


function returnToMenu() {
    document.getElementById('main-menu').classList.remove('hidden');
    // If they already entered their name, take them straight to the level grid
    let savedName = document.getElementById('student-name').value.trim();
    if(savedName !== '') {
        currentForm = localStorage.getItem('stoich_student_form') || 'Form 4';
        REACTIONS = (currentForm === 'Form 5') ? FORM_5_REACTIONS : FORM_4_REACTIONS;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('level-screen').style.display = 'flex';
    } else {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('level-screen').style.display = 'none';
    }
    init();
}
