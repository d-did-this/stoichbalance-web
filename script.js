
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
    { name: "[Med] Rusting Iron 🧲", left: ["Fe(s)", "O2(g)"], right: ["Fe2O3(s)"] },
    { name: "[Easy] Burning Magnesium ✨", left: ["Mg(s)", "O2(g)"], right: ["MgO(s)"] },
    { name: "[Med] Potassium in Water 💥", left: ["K(s)", "H2O(l)"], right: ["KOH(aq)", "H2(g)"] },
    { name: "[Easy] Calcium Oxidation 🪨", left: ["Ca(s)", "O2(g)"], right: ["CaO(s)"] },
    { name: "[Med] Sulfur Trioxide ☁️", left: ["SO2(g)", "O2(g)"], right: ["SO3(g)"] },
    { name: "[Hard] Phosphorus Burning 🎇", left: ["P4(s)", "O2(g)"], right: ["P4O10(s)"] },
    { name: "[Med] Peroxide Fizz 🫧", left: ["H2O2(aq)"], right: ["H2O(l)", "O2(g)"] },
    { name: "[Med] Zinc & Acid 🧪", left: ["Zn(s)", "HCl(aq)"], right: ["ZnCl2(aq)", "H2(g)"] },
    { name: "[Easy] Soot Formation 🌑", left: ["C(s)", "O2(g)"], right: ["CO(g)"] },
    { name: "[Med] Aluminum Bromide 🏺", left: ["Al(s)", "Br2(l)"], right: ["AlBr3(s)"] },
    { name: "[Easy] Monoxide Burning 🔥", left: ["CO(g)", "O2(g)"], right: ["CO2(g)"] }
];

const FORM_5_REACTIONS = [
    { name: "[Med] Burning Methanol 🔥", left: ["CH3OH(l)", "O2(g)"], right: ["CO2(g)", "H2O(g)"] },
    { name: "[Hard] Baking Soda 🧁", left: ["NaHCO3(s)"], right: ["Na2CO3(s)", "H2O(l)", "CO2(g)"] },
    { name: "[Hard] Aluminum Thermite 💥", left: ["Al(s)", "Fe2O3(s)"], right: ["Al2O3(s)", "Fe(s)"] },
    { name: "[Hard] Glucose Combustion 🌿", left: ["C6H12O6(s)", "O2(g)"], right: ["CO2(g)", "H2O(g)"] },
    { name: "[Hard] Copper Nitric Acid 🧪", left: ["Cu(s)", "HNO3(aq)"], right: ["Cu(NO3)2(aq)", "NO2(g)", "H2O(l)"] },
    { name: "[Med] Chlorate Decomp 🧨", left: ["KClO3(s)"], right: ["KCl(s)", "O2(g)"] },
    { name: "[Hard] Iron Smelting ⚔️", left: ["Fe2O3(s)", "CO(g)"], right: ["Fe(s)", "CO2(g)"] },
    { name: "[Hard] Ammonia Oxidation 💨", left: ["NH3(g)", "O2(g)"], right: ["NO(g)", "H2O(g)"] },
    { name: "[Boss] Octane Combustion ⛽", left: ["C8H18(l)", "O2(g)"], right: ["CO2(g)", "H2O(g)"] },
    { name: "[Med] Golden Rain 🌧️", left: ["Pb(NO3)2(aq)", "KI(aq)"], right: ["PbI2(s)", "KNO3(aq)"] },
    { name: "[Hard] Ethane Burning 🔥", left: ["C2H6(g)", "O2(g)"], right: ["CO2(g)", "H2O(g)"] },
    { name: "[Med] Neutralization 💧", left: ["NaOH(aq)", "H2SO4(aq)"], right: ["Na2SO4(aq)", "H2O(l)"] },
    { name: "[Med] Copper Precipitate 🟦", left: ["CuSO4(aq)", "NaOH(aq)"], right: ["Cu(OH)2(s)", "Na2SO4(aq)"] },
    { name: "[Med] Silver Chloride 🪙", left: ["AgNO3(aq)", "CaCl2(aq)"], right: ["AgCl(s)", "Ca(NO3)2(aq)"] },
    { name: "[Hard] Propane Combustion 🔥", left: ["C3H8(g)", "O2(g)"], right: ["CO2(g)", "H2O(g)"] }
];

const FORM_DEV_REACTIONS = [
    { name: "[Test] Developer Sandbox 🛠️", left: ["H2(g)", "O2(g)"], right: ["H2O(l)"] }
];

let REACTIONS = FORM_4_REACTIONS;

        const MOLECULE_NAMES = { "H2(g)": "Hydrogen Gas", "O2(g)": "Oxygen Gas", "H2O(l)": "Liquid Water", "H2O(g)": "Water Vapor", "CH3OH(l)": "Methanol", "CO2(g)": "Carbon Dioxide", "Fe(s)": "Solid Iron", "Cl2(g)": "Chlorine Gas", "FeCl3(s)": "Iron(III) Chloride", "Na(s)": "Solid Sodium", "NaOH(aq)": "Aqueous Sodium Hydroxide", "N2(g)": "Nitrogen Gas", "NH3(g)": "Ammonia Gas", "NaCl(s)": "Sodium Chloride", "CH4(g)": "Methane", "Fe2O3(s)": "Iron(III) Oxide", "NaHCO3(s)": "Sodium Bicarbonate", "Na2CO3(s)": "Sodium Carbonate", "Al(s)": "Solid Aluminum", "Al2O3(s)": "Aluminum Oxide", "C6H12O6(s)": "Glucose", "Cu(s)": "Copper", "HNO3(aq)": "Nitric Acid", "Cu(NO3)2(aq)": "Copper(II) Nitrate", "NO2(g)": "Nitrogen Dioxide", "Mg(s)": "Magnesium", "MgO(s)": "Magnesium Oxide", "K(s)": "Potassium", "KOH(aq)": "Potassium Hydroxide", "Ca(s)": "Calcium", "CaO(s)": "Calcium Oxide", "SO2(g)": "Sulfur Dioxide", "SO3(g)": "Sulfur Trioxide", "P4(s)": "White Phosphorus", "P4O10(s)": "Phosphorus Pentoxide", "H2O2(aq)": "Hydrogen Peroxide", "Zn(s)": "Zinc", "HCl(aq)": "Hydrochloric Acid", "ZnCl2(aq)": "Zinc Chloride", "C(s)": "Carbon", "CO(g)": "Carbon Monoxide", "Br2(l)": "Bromine", "AlBr3(s)": "Aluminum Bromide", "KClO3(s)": "Potassium Chlorate", "KCl(s)": "Potassium Chloride", "NO(g)": "Nitric Oxide", "C8H18(l)": "Octane", "Pb(NO3)2(aq)": "Lead(II) Nitrate", "KI(aq)": "Potassium Iodide", "PbI2(s)": "Lead(II) Iodide", "KNO3(aq)": "Potassium Nitrate", "C2H6(g)": "Ethane", "H2SO4(aq)": "Sulfuric Acid", "Na2SO4(aq)": "Sodium Sulfate", "CuSO4(aq)": "Copper(II) Sulfate", "Cu(OH)2(s)": "Copper(II) Hydroxide", "AgNO3(aq)": "Silver Nitrate", "CaCl2(aq)": "Calcium Chloride", "AgCl(s)": "Silver Chloride", "Ca(NO3)2(aq)": "Calcium Nitrate", "C3H8(g)": "Propane" };

        const FULL_ELEMENT_NAMES = {
            "H": "Hydrogen", "O": "Oxygen", "C": "Carbon", "Fe": "Iron", "Cl": "Chlorine", "Na": "Sodium", "N": "Nitrogen", "S": "Sulfur"
        };

        window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        window.playSound = function(type) { if (isMuted) return;

            if(window.audioCtx.state === 'suspended') window.audioCtx.resume();
            const osc = window.audioCtx.createOscillator();
            const gain = window.audioCtx.createGain();
            osc.connect(gain);
            gain.connect(window.audioCtx.destination);
            if (type === 'clink') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, window.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, window.audioCtx.currentTime + 0.05);
                gain.gain.setValueAtTime(0.3, window.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, window.audioCtx.currentTime + 0.1);
                osc.start(window.audioCtx.currentTime);
                osc.stop(window.audioCtx.currentTime + 0.1);
                        } else if (type === 'click') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(400, window.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, window.audioCtx.currentTime + 0.05);
                gain.gain.setValueAtTime(0.1, window.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, window.audioCtx.currentTime + 0.05);
                osc.start(window.audioCtx.currentTime);
                osc.stop(window.audioCtx.currentTime + 0.05);
            } else if (type === 'whoosh') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(300, window.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, window.audioCtx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.2, window.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, window.audioCtx.currentTime + 0.15);
                osc.start(window.audioCtx.currentTime);
                osc.stop(window.audioCtx.currentTime + 0.15);
            } else if (type === 'ding') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, window.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1600, window.audioCtx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.4, window.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, window.audioCtx.currentTime + 1.0);
                osc.start(window.audioCtx.currentTime);
                osc.stop(window.audioCtx.currentTime + 1.0);
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

        const DISTINCT_COLORS = [ { bg: '#6366f1', color: '#fff' }, { bg: '#0ea5e9', color: '#fff' }, { bg: '#f59e0b', color: '#000' }, { bg: '#8b5cf6', color: '#fff' }, { bg: '#14b8a6', color: '#fff' }, { bg: '#d946ef', color: '#fff' }, { bg: '#64748b', color: '#fff' } ];

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
    initPhysics();

    state.completed = new Set();
    REACTIONS.forEach((rx, i) => {
        if (localStorage.getItem('solved_' + rx.name)) {
            state.completed.add(i);
        }
    });
    updateCounter();
    
    let savedName = localStorage.getItem('stoich_student_name') || '';
    let savedForm = localStorage.getItem('stoich_student_form') || currentForm;
    let greet = document.getElementById('user-greeting');
    if (greet && savedName) {
        greet.innerText = "👋 Welcome, " + savedName + " (" + savedForm + ")";
    }

                        let grid = document.getElementById('level-grid');
        if (grid) {
            if (typeof window.currentPage === 'undefined') window.currentPage = 0;
            const itemsPerPage = 6;
            const maxPage = Math.ceil(REACTIONS.length / itemsPerPage) - 1;
            
            function renderPage() {
                grid.innerHTML = '';
                let start = window.currentPage * itemsPerPage;
                let end = start + itemsPerPage;
                let currentItems = REACTIONS.slice(start, end);
                
                currentItems.forEach((rx, i) => {
                    let actualIdx = start + i;
                    let btn = document.createElement('button');
                    btn.className = 'level-btn';
                    
                    if (localStorage.getItem('solved_' + rx.name)) {
                        btn.classList.add('solved');
                    }
                    
                    let diffColor = rx.name.includes('[Easy]') ? '#10b981' : (rx.name.includes('[Med]') ? '#f59e0b' : '#ef4444');
                    let cleanName = rx.name;
                    let tag = "";
                    let match = rx.name.match(/\[(.*?)\]/);
                    if(match) {
                        tag = match[0];
                        cleanName = rx.name.replace(tag + ' ', '').trim();
                    }
                    
                    let tagHtml = `<div class="level-tag" style="background:${diffColor}22; color:${diffColor}; border: 3px solid ${diffColor};">Level ${actualIdx + 1}</div>`;
                    let leftFormatted = rx.left.map(f => getFormulaHTML(f)).join(' + ');
                    let rightFormatted = rx.right.map(f => getFormulaHTML(f)).join(' + ');
                    btn.innerHTML = `${tagHtml}<div class="level-btn-title">${cleanName}</div><div class="eq-preview">${leftFormatted} &rarr; ${rightFormatted}</div>`;
                    
                    btn.onclick = () => { playSound('click'); startGame(actualIdx); };
                    grid.appendChild(btn);
                });
                
                let pControl = document.getElementById('pagination-controls');
                if (!pControl) {
                    pControl = document.createElement('div');
                    pControl.id = 'pagination-controls';
                    pControl.style.cssText = "display:flex; justify-content:center; align-items:center; gap:20px; margin-top:20px; width:100%;";
                    grid.parentNode.appendChild(pControl);
                }
                
                pControl.innerHTML = `
                    <button id="prev-page-btn" style="background:#ffffff; color:#3b82f6; border:3px solid #bfdbfe; padding:10px 20px; border-radius:12px; font-weight:900; cursor:pointer; box-shadow:0 4px 0 #bfdbfe; visibility: ${window.currentPage > 0 ? 'visible' : 'hidden'}"><svg style="width:20px;height:20px;display:inline-block;vertical-align:middle;margin-right:5px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"></path></svg>Prev</button>
                    <span style="font-weight:bold; color:#64748b; font-size: 16px;">Page ${window.currentPage + 1} of ${maxPage + 1}</span>
                    <button id="next-page-btn" style="background:#ffffff; color:#3b82f6; border:3px solid #bfdbfe; padding:10px 20px; border-radius:12px; font-weight:900; cursor:pointer; box-shadow:0 4px 0 #bfdbfe; visibility: ${window.currentPage < maxPage ? 'visible' : 'hidden'}">Next<svg style="width:20px;height:20px;display:inline-block;vertical-align:middle;margin-left:5px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"></path></svg></button>
                `;
                
                let prevBtn = document.getElementById('prev-page-btn');
                if (prevBtn) prevBtn.onclick = () => { playSound('click'); if (window.currentPage > 0) { window.currentPage--; renderPage(); } };
                
                let nextBtn = document.getElementById('next-page-btn');
                if (nextBtn) nextBtn.onclick = () => { playSound('click'); if (window.currentPage < maxPage) { window.currentPage++; renderPage(); } };
            }
            renderPage();
        }
    
    if (!localStorage.getItem('STOICHBALANCE_tutorial_seen')) {
        openTutorial();
    }
}

function loadReaction(idx) {
    window.manualZoom = false;
    state.hintLevel = 0;
            state.rxIdx = parseInt(idx);
            let rx = REACTIONS[state.rxIdx];
            assignColors(rx);
            state.left = []; 
            state.right = [];
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
                    addChatMessage(`<strong>🌟 Great job!</strong> You followed the hint perfectly! Let's keep balancing!`, 'success');
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

                        function autoAdjustUISize() {
            if (window.manualZoom) return;
            
            let slider = document.getElementById('ui-size-slider');
            let leftC = document.querySelector('.eq-left-container');
            let rightC = document.querySelector('.eq-right-container');
            if (!slider || !leftC || !rightC) return;
            
            let zoomVal = 1.0;
            document.querySelector('.app-body').style.zoom = zoomVal;
            slider.value = zoomVal;
            
            let attempts = 0;
            while (rightC.offsetTop > leftC.offsetTop + 20 && zoomVal > 0.5 && attempts < 20) {
                zoomVal -= 0.05;
                document.querySelector('.app-body').style.zoom = zoomVal;
                slider.value = zoomVal;
                attempts++;
            }
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
                            ${generateMarbleCluster(f, 30)}
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

                    if (count >= 0) { // Always show all elements in the tally bar, even 0
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
            let htmlStr = `
                <div class="sidebar-title-wrapper" data-tooltip="Click to toggle!" style="cursor:pointer; padding-bottom:4px;" onclick="document.getElementById('element-scales-container').classList.toggle('collapsed')">
                    <div class="sidebar-title" style="display:flex; align-items:center; justify-content:center; padding: 5px 10px; width: 100%; box-sizing: border-box; text-align:center;"><svg class="title-svg" style="width:36px;height:36px;color:#ffffff;margin-right:8px;" fill="none" stroke="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> <span class="full-text" style="font-size:24px;font-weight:900;margin-left:5px; white-space: nowrap;">TINY SCALES!</span></div>
                </div>
                <div id="tiny-scales-grid" style="display:flex; flex-direction:column; gap:20px; width:100%; box-sizing:border-box;">
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

                htmlStr += `\n                      <div class="scale-card card ${sClass} ${lTotals[el]===rTotals[el] ? 'state-balanced' : 'state-unbalanced'}" id="scale-card-${el}" data-tooltip="${tip}">
                        <div class="scale-header" style="font-weight: 900; font-size: 20px; text-align: center; margin-bottom: 5px; white-space: normal; line-height: 1.2; word-break: break-word;">${fullName}</div>
                    <div style="display:flex; justify-content:space-between; width:100%; margin-top:0px; margin-bottom:-8px; padding:0 5px; z-index:20;">
                        <span class="reactant-label">Reactants</span>
                        <span class="product-label">Products</span>
                        
                        </div>
                        <!-- Book Stacks -->
                        <div class="book-stack-container" style="display:flex; width: 100%; height:100px; padding-bottom:10px; margin-top:15px; position:relative;">
    <!-- Absolute Pin exactly centered -->
    <div style="position:absolute; bottom:-10px; left:50%; transform:translateX(-50%); width:16px; height:16px; background:linear-gradient(135deg, #64748b 0%, #0f172a 100%); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); z-index: 10;"></div>
    
    <!-- Left Half (Reactants) -->
    <div style="flex:1; display:flex; justify-content:flex-end; align-items:flex-end; border-right: 2px dashed #cbd5e1; border-bottom: 4px solid #3b82f6; padding-right: 10px; position: relative;">
        <div class="book-stack left-stack" style="display:flex; flex-direction:row-reverse; gap:5px; justify-content:flex-end; align-items:flex-end; z-index:2;">
                                ${(function(){
                                      let html = '';
                                      let remaining = l;
                                      while(remaining > 0) {
                                          let chunk = Math.min(5, remaining);
                                          html += '<div style="display:flex; flex-direction:column-reverse; gap:3px;">' + Array(chunk).fill('<div style="width:30px; height:12px; background:#3b82f6; border:2px solid #1d4ed8; border-radius:3px; box-shadow:0 2px 0 #1d4ed8;"></div>').join('') + '</div>';
                                          remaining -= chunk;
                                      }
                                      return html;
                                  })()}
                            </div>
    </div>
    <!-- Right Half (Products) -->
    <div style="flex:1; display:flex; justify-content:flex-start; align-items:flex-end; border-bottom: 4px solid #f97316; padding-left: 10px; position: relative;">
        <div class="book-stack right-stack" style="display:flex; flex-direction:row; gap:5px; justify-content:flex-start; align-items:flex-end; z-index:2;">
                                ${(function(){
                                        let html = '';
                                        let remaining = r;
                                        while(remaining > 0) {
                                            let chunk = Math.min(5, remaining);
                                            html += '<div style="display:flex; flex-direction:column-reverse; gap:3px;">' + Array(chunk).fill('<div style="width:30px; height:12px; background:#f97316; border:2px solid #c2410c; border-radius:3px; box-shadow:0 2px 0 #c2410c;"></div>').join('') + '</div>';
                                            remaining -= chunk;
                                        }
                                        return html;
                                    })()}
                            </div>
    </div>
</div>
<div class="scale-footer" style="margin-top: 10px; display: flex; justify-content: space-around; font-size: 20px; font-weight: 900; background: #f1f5f9; padding: 8px 10px; border-radius: 12px; border: 2px solid #cbd5e1;"><span style="color:${l>r?'#ef4444':'#334155'};">${l}</span><span style="color:${r>l?'#ef4444':'#334155'};">${r}</span></div>
                    </div>
                `;
            });
            htmlStr += `</div>`;
            cont.innerHTML = htmlStr;

            // Master Scale logic
            let mDiff = totalL - totalR;
            // Gradual tilt calculation (max 6 degrees so it doesn't overflow)
            let mTilt = Math.max(-6, Math.min(6, -mDiff * 1.2));
            
            document.getElementById('ms-beam').style.transform = `rotate(${mTilt}deg)`;
            
            // Counter-rotate the jars so they stay physically upright like swinging buckets!
            document.getElementById('ms-jar-left').style.transform = `rotate(${-mTilt}deg)`;
            document.getElementById('ms-jar-right').style.transform = `rotate(${-mTilt}deg)`;

            // Hexagonal packing in the master bucket (Radius 12 => size 26, max 8 per base row in 200px jar)
            document.getElementById('ms-marbles-left').innerHTML = generateDomMarblesGrid(280, lTotals, 26, 8);
            document.getElementById('ms-marbles-right').innerHTML = generateDomMarblesGrid(280, rTotals, 26, 8);

            const mCard = document.getElementById('master-scale');
            const mText = document.getElementById('ms-status-text');
            const mEmoji = document.getElementById('ms-emoji');
            
            mCard.className = "master-card card";
            const evalBox = document.getElementById('main-eval-box');
            if (evalBox) evalBox.className = ""; // Reset
            
            // Background Color Logic
            let lCounts = countMolecules(state.left);
            let rCounts = countMolecules(state.right);
            if (totalL === 0 && totalR === 0) {
                if (evalBox) evalBox.classList.add("state-red");
            } else if (mTilt === 0 && totalL > 0) {
                if (checkCanSimplify(lCounts, rCounts)) {
                    if (evalBox) evalBox.classList.add("state-yellow");
                } else {
                    if (evalBox) evalBox.classList.add("state-green");
                }
            } else {
                if (Math.abs(totalL - totalR) <= 5) {
                    if (evalBox) evalBox.classList.add("state-yellow");
                } else {
                    if (evalBox) evalBox.classList.add("state-red");
                }
            }

            
            // Triangle > < = removed

            // Status Text Update
                const statBal = document.getElementById('status-balance');
                const statLabel = document.getElementById('status-label');
                
                if (statLabel && rx && rx.name) {
                    let cleanName = rx.name.replace(/\[.*?\]\s*/, '').replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]/gu, '').trim().toUpperCase();
                    statLabel.innerHTML = `THE <span style="font-weight:900; color:#1e293b;">${cleanName}</span> EQUATION IS :`;
                }

                let textLCounts = countMolecules(state.left);
                let textRCounts = countMolecules(state.right);
                let canSimplify = checkCanSimplify(textLCounts, textRCounts);
                
                let isChemBalanced = (balancedCount === allElsSet.size && allElsSet.size > 0);
                
                if (statBal) {
                    if (totalL === 0 && totalR === 0) {
                        statBal.innerText = "EMPTY";
                        statBal.style.color = "#94a3b8";
                    } else if (isChemBalanced) {
                        if (canSimplify) {
                            statBal.innerText = "BALANCED BUT NOT SIMPLIFIED";
                            statBal.style.color = "#eab308"; // Yellow
                        } else {
                            statBal.innerText = "BALANCED & SIMPLIFIED";
                            statBal.style.color = "#22c55e"; // Green
                        }
                    } else {
                        statBal.innerText = "UNBALANCED";
                        statBal.style.color = "#ef4444"; // Red
                    }
                }
                
                
            // Simplification Badge & Text update
            const badge = document.getElementById('simplified-badge');
            if (badge) {
                let isChemBalanced = (balancedCount === allElsSet.size && allElsSet.size > 0);
                if (isChemBalanced && totalL > 0) {
                    let lCounts = countMolecules(state.left);
                    let rCounts = countMolecules(state.right);
                    let canSimplify = checkCanSimplify(lCounts, rCounts);
                    
                    if (!canSimplify) {
                        badge.style.display = 'block';
                        
                    } else {
                        badge.style.display = 'none';
                        
                    }
                } else {
                    badge.style.display = 'none';
                    if (chessText) {
                        let diff = Math.abs(totalL - totalR);
                        if (totalL === 0 && totalR === 0) { chessText.innerHTML = "Empty Scale"; chessText.style.color = "#94a3b8"; }
                        else if (diff <= 5) { chessText.innerHTML = "Almost there"; chessText.style.color = "#f97316"; }
                        else if (diff <= 15) { chessText.innerHTML = "Close"; chessText.style.color = "#ef4444"; }
                        else { chessText.innerHTML = "Unbalanced"; chessText.style.color = "#b91c1c"; }
                    }
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
                        
                        
                    }
                                        playSound('ding');
                    triggerConfetti();
                    const winModal = document.getElementById('win-modal'); 
                    if (winModal) {
                        winModal.style.display = 'flex';
                        let mvEl = document.getElementById('win-modal-moves');
                        let efEl = document.getElementById('win-modal-efficiency');
                        if (mvEl) mvEl.innerText = state.moves;
                        if (efEl) {
                            let optimalMoves = (rx.left.length + rx.right.length) * 2;
                            let stars = state.moves <= optimalMoves ? 3 : (state.moves <= optimalMoves * 2 ? 2 : 1);
                            efEl.innerText = '⭐'.repeat(stars) + '❌'.repeat(3-stars);
                        }
                    }
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

                    addChatMessage(`<strong>🌟 YOU DID IT! 🌟</strong><br/>The equation is perfectly balanced!<br/>Moves: <strong>${state.moves}</strong> | Efficiency: ${starStr}<br/><br/><div style="font-size:12px; background:#f0fdf4; padding:8px; border-radius:8px;"><strong>Why didn't we stop earlier?</strong><br/>The simplest integer ratio is the standard way to write chemical equations because it represents the smallest possible fundamental reaction!</div><br/>Pick a new puzzle from the menu to play again!`, 'success');
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
                addChatMessage(`<svg style="width:24px;height:24px;margin-right:6px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> Let's focus on ${fullNameBadge}! Check its tiny scale to the left... it looks like it's tipping! We have too few on the ${sideNameBadge}.`, 'agent');
                
                let tinyScale = document.getElementById(`scale-card-${hintData.element}`);
                if(tinyScale) {
                    tinyScale.style.boxShadow = "0 0 0 5px var(--st-yellow), 0 10px 20px rgba(0,0,0,0.2)";
                    setTimeout(() => { tinyScale.style.boxShadow = "var(--shadow-toy)"; }, 5000);
                }
            } 
            else if (state.hintLevel === 2) {
                addChatMessage(`👈 To fix the ${fullNameBadge} imbalance, we need to add more molecules to the ${sideNameBadge} box!`, 'agent');
                
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
    const text = `STOICHBALANCE - TEACHER REPORT\nDate: ${new Date().toLocaleString()}\nStudent: ${name} (${document.getElementById('student-form').value || 'Form 4'})\n\nTotal Puzzles Solved: ${puzzlesSolvedCount}\nCurrent Streak: ${currentStreak}\nTotal Hints Used: ${totalHintsUsed}\n\nKeep up the great work!`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Stoichbalance_Report.txt';
    a.click();
    URL.revokeObjectURL(url);
}



function goToLevels(selectedForm) {
    try {
        let name = document.getElementById('student-name').value.trim();
        if(!name) {
            alert("Please enter your Student Name before continuing!");
            return;
        }
        
        localStorage.setItem('stoich_student_name', name);
        localStorage.setItem('stoich_student_form', selectedForm);
        
        currentForm = selectedForm;
        if (currentForm === 'Form 5') {
            REACTIONS = FORM_5_REACTIONS;
        } else if (currentForm === 'Developer') {
            REACTIONS = FORM_DEV_REACTIONS;
        } else {
            REACTIONS = FORM_4_REACTIONS;
        }
        
        init();
        
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('level-screen').style.display = 'flex';
    } catch(e) {
        alert("ERROR: " + e.stack);
        console.error(e);
    }
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
        if (currentForm === 'Form 5') {
            REACTIONS = FORM_5_REACTIONS;
        } else if (currentForm === 'Developer') {
            REACTIONS = FORM_DEV_REACTIONS;
        } else {
            REACTIONS = FORM_4_REACTIONS;
        }
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('level-screen').style.display = 'flex';
    } else {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('level-screen').style.display = 'none';
    }
    init();
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// Fullscreen Logic
document.addEventListener('fullscreenchange', updateFullscreenIcon);
document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
document.addEventListener('msfullscreenchange', updateFullscreenIcon);

function updateFullscreenIcon() {
    const fsIcon = document.getElementById('fs-icon');
    if (!fsIcon) return;
    
    const isFull = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    if (isFull) {
        // Compress Icon
        fsIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-3.75 3.75M15 9h4.5M15 9V4.5M15 9l3.75-3.75M15 15h4.5M15 15v4.5m0-4.5l3.75 3.75"></path>';
    } else {
        // Expand Icon
        fsIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"></path>';
    }
}




// Expose functions to global scope for HTML onclick handlers
window.goToLevels = goToLevels;
window.returnToMenu = returnToMenu;
window.toggleMute = toggleMute;
window.downloadReport = downloadReport;
window.openTutorial = openTutorial;
window.toggleFullScreen = toggleFullScreen;
window.revealHeuristicHint = revealHeuristicHint;
window.clearChat = clearChat;
window.createCustomEquation = createCustomEquation;
window.showTutSlide = showTutSlide;
window.closeTutorial = closeTutorial;
window.undo = undo;
window.resetEquation = resetEquation;
window.startGame = startGame;
window.toggleHardMode = toggleHardMode;
window.addMolecule = addMolecule;
window.removeMolecule = removeMolecule;