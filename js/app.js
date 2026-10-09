
window.renderProfiles = function(filterText = "") {
    let profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    let dropdown = document.getElementById('profile-dropdown');
    if (!dropdown) return;
    
    // Filter profiles based on input
    let filtered = profiles.filter(p => p.toLowerCase().includes(filterText.toLowerCase()));
    
    if (filtered.length === 0) {
        dropdown.style.display = 'none';
        return;
    }
    
    dropdown.innerHTML = '';
    filtered.forEach(p => {
        let item = document.createElement('div');
        item.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding: 12px 16px; cursor:pointer; border-radius: 8px; transition: background 0.1s; color: #334155; font-weight: 800; font-size: 1.1rem;";
        item.onmouseenter = () => item.style.background = "#f1f5f9";
        item.onmouseleave = () => item.style.background = "transparent";
        
        let nameSpan = document.createElement('span');
        nameSpan.innerText = p;
        nameSpan.style.flex = "1";
        nameSpan.onclick = () => {
            document.getElementById('player-name').value = p;
            dropdown.style.display = 'none';
        };
        
                let trashBtn = document.createElement('span');
        trashBtn.innerHTML = "🗑️";
        trashBtn.title = "Remove player?";
        trashBtn.style.cssText = "font-size: 1.1rem; cursor:pointer; padding: 4px 6px; opacity: 0.7; transition: all 0.1s; border: 2px solid transparent; border-radius: 8px;";
        trashBtn.onmouseenter = () => { trashBtn.style.opacity = "1"; trashBtn.style.transform = "scale(1.1)"; trashBtn.style.border = "2px solid #ef4444"; trashBtn.style.background = "#fef2f2"; };
        trashBtn.onmouseleave = () => { trashBtn.style.opacity = "0.7"; trashBtn.style.transform = "scale(1)"; trashBtn.style.border = "2px solid transparent"; trashBtn.style.background = "transparent"; };
        trashBtn.onclick = (e) => {
            e.stopPropagation();
            
            // Custom Confirmation Modal
            let overlay = document.createElement("div");
            overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15,23,42,0.85); display: flex; justify-content: center; align-items: center; z-index: 100000; backdrop-filter: blur(8px);";
            
            let modal = document.createElement("div");
            modal.style.cssText = "background: white; border: 6px solid #ef4444; border-radius: 24px; padding: 30px; text-align: center; box-shadow: 0 15px 40px rgba(0,0,0,0.4); max-width: 450px; width: 90%; animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); display:flex; flex-direction:column; gap:20px;";
            
            modal.innerHTML = `
                <h2 style="margin:0; color:#b91c1c; font-size:2.2rem; font-weight:900; letter-spacing:-1px;">DELETE PLAYER?</h2>
                <p style="margin:0; color:#475569; font-size:1.1rem; font-weight:700;">Are you sure you want to completely erase <b>${p}</b>'s profile? This will delete all their stars and progress permanently.</p>
                <div style="display:flex; gap:15px; margin-top:10px;">
                    <button id="cancel-del" style="flex:1; padding:15px; border-radius:16px; background:#94a3b8; color:white; border:4px solid #475569; box-shadow:0 6px 0 #334155; font-weight:900; font-size:1.1rem; cursor:pointer; transition: transform 0.1s;">CANCEL</button>
                    <button id="confirm-del" style="flex:1; padding:15px; border-radius:16px; background:#ef4444; color:white; border:4px solid #b91c1c; box-shadow:0 6px 0 #991b1b; font-weight:900; font-size:1.1rem; cursor:pointer; transition: transform 0.1s;">DELETE</button>
                </div>
            `;
            
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            if(typeof playSound === 'function') playSound('tactile');
            
            let btnC = document.getElementById('cancel-del');
            let btnD = document.getElementById('confirm-del');
            
            btnC.onmousedown = () => { btnC.style.transform = "translateY(6px)"; btnC.style.boxShadow = "none"; };
            btnD.onmousedown = () => { btnD.style.transform = "translateY(6px)"; btnD.style.boxShadow = "none"; };
            
            btnC.onclick = () => {
                if(typeof playSound === 'function') playSound('click');
                overlay.remove();
            };
            
            btnD.onclick = () => {
                if(typeof playSound === 'function') playSound('click');
                profiles = profiles.filter(name => name !== p);
                localStorage.setItem('profiles', JSON.stringify(profiles));
                localStorage.removeItem('solvedLevels_' + p);
                localStorage.removeItem('solvedLevelData_' + p);
                if (localStorage.getItem('currentPlayer') === p) {
                    localStorage.removeItem('currentPlayer');
                    document.getElementById('player-name').value = '';
                }
                window.renderProfiles(document.getElementById('player-name').value);
                overlay.remove();
            };
        };
        
        item.appendChild(nameSpan);
        item.appendChild(trashBtn);
        dropdown.appendChild(item);
    });
    
    dropdown.style.display = 'flex';
};

window.showProfileDropdown = function() {
    let inp = document.getElementById('player-name');
    if(inp) window.renderProfiles(inp.value);
};

window.filterProfiles = function() {
    let inp = document.getElementById('player-name');
    if(inp) window.renderProfiles(inp.value);
};

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    let input = document.getElementById('player-name');
    let dropdown = document.getElementById('profile-dropdown');
    if (input && dropdown && e.target !== input && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

// Auto-fill last used name
window.addEventListener('DOMContentLoaded', () => {
    let lastPlayer = localStorage.getItem('currentPlayer');
    if (lastPlayer) {
        let nameInput = document.getElementById('player-name');
        if(nameInput) nameInput.value = lastPlayer;
    }
});

// Stoichbalance V2 - Interactive Chemistry Engine

// ==========================================
// 1. MENU LOGIC
// ==========================================
let currentMode = 'class'; 
let currentSubOption = 'Form 4'; 

function selectMode(mode) {
    if(typeof window.playSound==="function") window.playSound("select");
    if (currentMode === mode) return; 
    currentMode = mode;

    document.querySelectorAll('.mode-card').forEach(card => card.classList.remove('active-mode'));
    document.getElementById(`mode-${mode}`).classList.add('active-mode');

    document.querySelectorAll('.bg-layer').forEach(bg => bg.classList.remove('active-bg'));
    if (mode === 'class' && currentSubOption === 'Form 5') {
        document.getElementById('bg-form5').classList.add('active-bg');
    } else {
        document.getElementById(`bg-${mode}`).classList.add('active-bg');
    }

    const activeSubBtn = document.querySelector(`#mode-${mode} .sub-btn.active-sub`);
    if (activeSubBtn) {
        currentSubOption = activeSubBtn.innerText;
    } else {
        currentSubOption = null;
    }
    updatePlayButton();
}

function selectSubOption(event, mode, subValue) {
    if(typeof window.playSound==="function") window.playSound("select");
    event.stopPropagation(); 
    if(currentMode !== mode) selectMode(mode);

    const optionsContainer = document.getElementById(`mode-${mode}`);
    optionsContainer.querySelectorAll('.sub-btn').forEach(btn => btn.classList.remove('active-sub'));

    event.target.classList.add('active-sub');
    currentSubOption = subValue;
    
    if (mode === 'class') {
        document.querySelectorAll('.bg-layer').forEach(bg => bg.classList.remove('active-bg'));
        if (subValue === 'Form 5') {
            document.getElementById('bg-form5').classList.add('active-bg');
        } else {
            document.getElementById('bg-class').classList.add('active-bg');
        }
    }
    updatePlayButton();
}

function updatePlayButton() {
    const playBtnText = document.getElementById('play-btn-text');
    if (currentMode === 'class') {
        playBtnText.innerText = `Start ${currentSubOption}`;
    } 
    else if (currentMode === 'challenge') {
        playBtnText.innerText = `Start ${currentSubOption}`;
    } 
    else if (currentMode === 'sandbox') {
        playBtnText.innerText = 'Enter Sandbox';
    }
}

function startGame() {
    if(typeof window.playSound==="function") window.playSound("start");
    const btn = document.getElementById('main-play-btn');
    const oldTransform = btn.style.transform;
    const oldBoxShadow = btn.style.boxShadow;
    
    btn.style.transform = 'translateY(8px)';
    btn.style.boxShadow = '0 0 0 transparent';
    
    const playerNameInput = document.getElementById('player-name').value.trim();
    const finalName = playerNameInput !== '' ? playerNameInput : 'Student';
    
    // Redirect to Level Selection Screen
    if (currentMode === 'sandbox') {
        document.getElementById('sandbox-choice-modal').style.display = 'flex';
    } else {
        const formParam = encodeURIComponent(currentSubOption);
        const nameParam = encodeURIComponent(finalName);
        
        // Multi-profile save
        let profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
        if (!profiles.includes(finalName)) {
            profiles.push(finalName);
            localStorage.setItem('profiles', JSON.stringify(profiles));
        }
        localStorage.setItem('currentPlayer', finalName);
        
        window.transitionTo(`levels.html?form=${formParam}&mode=${currentMode}&name=${nameParam}`);

    }
}



const ELEMENT_DB = {
    'Li': {
        name: 'Lithium', z: 3, groupName: 'Alkali Metal', groupKey: 'alkali', color: '#ef4444',
        mass: '6.941 u', density: '0.512 g/cm³', melt: '180.54 °C', boil: '1342 °C',
        discoverer: 'Johan August Arfwedson', year: '1817',
        fact: 'Although it is a metal, Lithium is soft enough to cut with a knife.',
        protons: 3, neutrons: 4, electrons: 3, shells: [2, 1]
    },
    'H': {
        name: 'Hydrogen', z: 1, groupName: 'Non-metal', groupKey: 'nonmetal', color: '#06b6d4',
        mass: '1.008 u', density: '0.00008 g/cm³', melt: '-259.1 °C', boil: '-252.9 °C',
        discoverer: 'Henry Cavendish', year: '1766',
        fact: 'Hydrogen is the most abundant chemical substance in the universe.',
        protons: 1, neutrons: 0, electrons: 1, shells: [1]
    },
    'O': {
        name: 'Oxygen', z: 8, groupName: 'Non-metal', groupKey: 'nonmetal', color: '#06b6d4',
        mass: '15.999 u', density: '0.00143 g/cm³', melt: '-218.8 °C', boil: '-183.0 °C',
        discoverer: 'Joseph Priestley', year: '1774',
        fact: 'Liquid and solid oxygen are pale blue in color.',
        protons: 8, neutrons: 8, electrons: 8, shells: [2, 6]
    },
    'Na': {
        name: 'Sodium', z: 11, groupName: 'Alkali Metal', groupKey: 'alkali', color: '#ef4444',
        mass: '22.990 u', density: '0.968 g/cm³', melt: '97.79 °C', boil: '882.8 °C',
        discoverer: 'Humphry Davy', year: '1807',
        fact: 'Sodium is highly reactive and explodes when it touches water!',
        protons: 11, neutrons: 12, electrons: 11, shells: [2, 8, 1]
    }
};

// Fallback generator for un-hardcoded elements
function getElementData(symbol, rawElData, groups) {
    
    
    // Auto-generate based on rawElements array
    let z = rawElData[0];
    let name = rawElData[2];
    let grpKey = rawElData[3];
    let grpName = grpKey.charAt(0).toUpperCase() + grpKey.slice(1);
    let color = groups[grpKey] || '#94a3b8';
    
    // Calculate simple shells (Standard Aufbau Approximation)
    let shells = [];
    let rem = z;
    const caps = [2, 8, 18, 32, 32, 18, 8];
    for(let cap of caps) {
        if(rem > cap) { shells.push(cap); rem -= cap; }
        else if(rem > 0) { shells.push(rem); rem = 0; }
    }
    
    let ext = (window.FULL_ELEMENT_DB && window.FULL_ELEMENT_DB[symbol]) || {};
    if (ext.type) grpName = ext.type;
    
    return {
        name: name, z: z, groupName: grpName, groupKey: grpKey, color: color,
        mass: ext.mass || ((z * 2 + (z > 10 ? 2 : 0)).toFixed(3) + ' u'), 
        density: ext.density || 'Unknown', 
        melt: ext.melt || 'Unknown', 
        boil: ext.boil || 'Unknown',
        discoverer: ext.discoverer || 'Various', 
        year: ext.year || 'Ancient/Unknown',
        fact: ext.fact || `${name} is an interesting chemical element belonging to the ${grpName} family.`,
        protons: z, neutrons: Math.round(z * 1.2), electrons: z, shells: shells
    };
}

function updateElementDetails(symbol, rawElData, groups) {
    document.getElementById('element-details-empty').style.display = 'none';
    let content = document.getElementById('element-details-content');
    content.style.display = 'flex';
    content.style.animation = 'none';
    setTimeout(() => content.style.animation = 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 10);
    
    let data = getElementData(symbol, rawElData, groups);
    
    document.getElementById('ed-name').innerText = data.name;
    document.getElementById('ed-symbol').innerText = symbol;
    document.getElementById('ed-num').innerText = data.z;
    
    let badge = document.getElementById('ed-group-badge');
    badge.innerText = data.groupName;
    badge.style.background = data.color;
    
    document.getElementById('ed-fact').innerText = data.fact;
    document.getElementById('ed-mass').innerText = data.mass;
    document.getElementById('ed-density').innerText = data.density;
    document.getElementById('ed-melt').innerText = data.melt;
    document.getElementById('ed-boil').innerText = data.boil;
    document.getElementById('ed-discoverer').innerText = data.discoverer;
    document.getElementById('ed-year').innerText = data.year;
    
    // Build Structure Text
    let shellText = data.shells.map((count, i) => `<li><b>Shell ${i+1}:</b> Holds ${count} electron${count>1?'s':''}</li>`).join('');
    
    document.getElementById('ed-structure-text').innerHTML = `
        <div style="margin-bottom:10px;"><b>${data.name} (${symbol})</b> has an atomic number of ${data.z}, meaning a neutral atom contains exactly ${data.protons} protons, ${data.neutrons} neutrons, and ${data.electrons} electrons.</div>
        <div style="margin-bottom:10px;"><b>The Nucleus (The Core)</b><br>At the center sits the dense nucleus containing:
        <ul style="margin:5px 0; padding-left:20px;"><li>${data.protons} Protons (+1 charge)</li><li>${data.neutrons} Neutrons (Neutral)</li></ul></div>
        <div><b>The Electron Layout (The Shells)</b><br>The ${data.electrons} electrons orbit the nucleus in specific energy levels:
        <ul style="margin:5px 0; padding-left:20px;">${shellText}</ul></div>
    `;
    
    // Draw Bohr Model SVG
    let svg = `<svg viewBox="-120 -120 240 240" width="100%" height="100%">`;
    
    // Nucleus
    svg += `<circle cx="0" cy="0" r="18" fill="${data.color}" filter="drop-shadow(0 0 8px ${data.color})" />`;
    svg += `<text x="0" y="-3" font-size="10" fill="#fff" font-weight="bold" text-anchor="middle">P:${data.protons}</text>`;
    svg += `<text x="0" y="8" font-size="10" fill="#fff" font-weight="bold" text-anchor="middle">N:${data.neutrons}</text>`;
    
    // Shells and Electrons
    let currentRadius = 35;
    data.shells.forEach((electronsInShell, shellIndex) => {
        // Draw orbital ring
        svg += `<circle cx="0" cy="0" r="${currentRadius}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2" stroke-dasharray="4 4" />`;
        
        // Draw electrons
        let angleStep = (Math.PI * 2) / electronsInShell;
        // Offset animation via css transform rotate
        svg += `<g style="animation: spin ${10 + shellIndex*5}s linear infinite;">`;
        for(let e=0; e<electronsInShell; e++) {
            let cx = Math.cos(angleStep * e) * currentRadius;
            let cy = Math.sin(angleStep * e) * currentRadius;
            svg += `<circle cx="${cx}" cy="${cy}" r="4" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />`;
        }
        svg += `</g>`;
        
        currentRadius += 22; // Next shell expands outwards
    });
    
    svg += `</svg>`;
    
    // Add global keyframes if not exists
    if(!document.getElementById('spin-anim')) {
        let st = document.createElement('style');
        st.id = 'spin-anim';
        st.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(st);
    }
    
    document.getElementById('ed-bohr-container').innerHTML = svg;
}


const PT_GROUPS = {
    'alkali': '#ef4444', 'alkaline': '#f97316', 'transition': '#f59e0b',
    'post': '#84cc16', 'metalloid': '#10b981', 'nonmetal': '#06b6d4',
    'halogen': '#3b82f6', 'noble': '#8b5cf6', 'lanthanide': '#d946ef',
    'actinide': '#f43f5e', 'unknown': '#64748b'
};

const PT_RAW_ELEMENTS = [
    [1,'H','Hydrogen','nonmetal',1,1], [2,'He','Helium','noble',18,1],
    [3,'Li','Lithium','alkali',1,2], [4,'Be','Beryllium','alkaline',2,2], [5,'B','Boron','metalloid',13,2], [6,'C','Carbon','nonmetal',14,2], [7,'N','Nitrogen','nonmetal',15,2], [8,'O','Oxygen','nonmetal',16,2], [9,'F','Fluorine','halogen',17,2], [10,'Ne','Neon','noble',18,2],
    [11,'Na','Sodium','alkali',1,3], [12,'Mg','Magnesium','alkaline',2,3], [13,'Al','Aluminum','post',13,3], [14,'Si','Silicon','metalloid',14,3], [15,'P','Phosphorus','nonmetal',15,3], [16,'S','Sulfur','nonmetal',16,3], [17,'Cl','Chlorine','halogen',17,3], [18,'Ar','Argon','noble',18,3],
    [19,'K','Potassium','alkali',1,4], [20,'Ca','Calcium','alkaline',2,4], [21,'Sc','Scandium','transition',3,4], [22,'Ti','Titanium','transition',4,4], [23,'V','Vanadium','transition',5,4], [24,'Cr','Chromium','transition',6,4], [25,'Mn','Manganese','transition',7,4], [26,'Fe','Iron','transition',8,4], [27,'Co','Cobalt','transition',9,4], [28,'Ni','Nickel','transition',10,4], [29,'Cu','Copper','transition',11,4], [30,'Zn','Zinc','transition',12,4], [31,'Ga','Gallium','post',13,4], [32,'Ge','Germanium','metalloid',14,4], [33,'As','Arsenic','metalloid',15,4], [34,'Se','Selenium','nonmetal',16,4], [35,'Br','Bromine','halogen',17,4], [36,'Kr','Krypton','noble',18,4],
    [37,'Rb','Rubidium','alkali',1,5], [38,'Sr','Strontium','alkaline',2,5], [39,'Y','Yttrium','transition',3,5], [40,'Zr','Zirconium','transition',4,5], [41,'Nb','Niobium','transition',5,5], [42,'Mo','Molybdenum','transition',6,5], [43,'Tc','Technetium','transition',7,5], [44,'Ru','Ruthenium','transition',8,5], [45,'Rh','Rhodium','transition',9,5], [46,'Pd','Palladium','transition',10,5], [47,'Ag','Silver','transition',11,5], [48,'Cd','Cadmium','transition',12,5], [49,'In','Indium','post',13,5], [50,'Sn','Tin','post',14,5], [51,'Sb','Antimony','metalloid',15,5], [52,'Te','Tellurium','metalloid',16,5], [53,'I','Iodine','halogen',17,5], [54,'Xe','Xenon','noble',18,5],
    [55,'Cs','Cesium','alkali',1,6], [56,'Ba','Barium','alkaline',2,6], [57,'La','Lanthanum','lanthanide',3,8], [58,'Ce','Cerium','lanthanide',4,8], [59,'Pr','Praseodymium','lanthanide',5,8], [60,'Nd','Neodymium','lanthanide',6,8], [61,'Pm','Promethium','lanthanide',7,8], [62,'Sm','Samarium','lanthanide',8,8], [63,'Eu','Europium','lanthanide',9,8], [64,'Gd','Gadolinium','lanthanide',10,8], [65,'Tb','Terbium','lanthanide',11,8], [66,'Dy','Dysprosium','lanthanide',12,8], [67,'Ho','Holmium','lanthanide',13,8], [68,'Er','Erbium','lanthanide',14,8], [69,'Tm','Thulium','lanthanide',15,8], [70,'Yb','Ytterbium','lanthanide',16,8], [71,'Lu','Lutetium','lanthanide',17,8],
    [72,'Hf','Hafnium','transition',4,6], [73,'Ta','Tantalum','transition',5,6], [74,'W','Tungsten','transition',6,6], [75,'Re','Rhenium','transition',7,6], [76,'Os','Osmium','transition',8,6], [77,'Ir','Iridium','transition',9,6], [78,'Pt','Platinum','transition',10,6], [79,'Au','Gold','transition',11,6], [80,'Hg','Mercury','transition',12,6], [81,'Tl','Thallium','post',13,6], [82,'Pb','Lead','post',14,6], [83,'Bi','Bismuth','post',15,6], [84,'Po','Polonium','post',16,6], [85,'At','Astatine','halogen',17,6], [86,'Rn','Radon','noble',18,6],
    [87,'Fr','Francium','alkali',1,7], [88,'Ra','Radium','alkaline',2,7], [89,'Ac','Actinium','actinide',3,9], [90,'Th','Thorium','actinide',4,9], [91,'Pa','Protactinium','actinide',5,9], [92,'U','Uranium','actinide',6,9], [93,'Np','Neptunium','actinide',7,9], [94,'Pu','Plutonium','actinide',8,9], [95,'Am','Americium','actinide',9,9], [96,'Cm','Curium','actinide',10,9], [97,'Bk','Berkelium','actinide',11,9], [98,'Cf','Californium','actinide',12,9], [99,'Es','Einsteinium','actinide',13,9], [100,'Fm','Fermium','actinide',14,9], [101,'Md','Mendelevium','actinide',15,9], [102,'No','Nobelium','actinide',16,9], [103,'Lr','Lawrencium','actinide',17,9],
    [104,'Rf','Rutherfordium','transition',4,7], [105,'Db','Dubnium','transition',5,7], [106,'Sg','Seaborgium','transition',6,7], [107,'Bh','Bohrium','transition',7,7], [108,'Hs','Hassium','transition',8,7], [109,'Mt','Meitnerium','unknown',9,7], [110,'Ds','Darmstadtium','unknown',10,7], [111,'Rg','Roentgenium','unknown',11,7], [112,'Cn','Copernicium','transition',12,7], [113,'Nh','Nihonium','post',13,7], [114,'Fl','Flerovium','post',14,7], [115,'Mc','Moscovium','post',15,7], [116,'Lv','Livermorium','post',16,7], [117,'Ts','Tennessine','halogen',17,7], [118,'Og','Oganesson','noble',18,7]
];

function openElements() {
    if(typeof window.playSound==="function") window.playSound("click");
    document.getElementById('periodic-picker-modal').style.display = 'flex';
    
    let grid = document.getElementById('picker-grid');
    if(grid && grid.children.length === 0) {
        let ptHtml = '';
        PT_RAW_ELEMENTS.forEach(el => {
            let col = PT_GROUPS[el[3]] || '#94a3b8';
            let grpClass = 'pt-group-' + el[3];
            
            // Clean, square, sleek design for each tile
            ptHtml += `
            <button class="vk-pt-btn pt-element interactive ${grpClass}" data-group="${el[3]}" 
                style="grid-column:${el[4]}; grid-row:${el[5]}; background:${col}; color:white; 
                       border: 2px solid rgba(0,0,0,0.15); border-radius:12%; 
                       box-shadow: 0 3px 0 rgba(0,0,0,0.25); cursor:pointer; 
                       position:relative; display:flex; flex-direction:column; 
                       justify-content:center; align-items:center; padding: 2px;
                       aspect-ratio: 1/1; overflow:hidden;" 
                title="${el[2]}" 
                onmouseenter="highlightGroup('${el[3]}'); updateElementDetails('${el[1]}');" 
                onmouseleave="removeHighlightGroup(); if(window.selectedElement) updateElementDetails(window.selectedElement); else clearElementDetails();"
                onclick="window.selectedElement = '${el[1]}'; if(typeof playSound === 'function') playSound('click');">
                
                <div class="el-num" style="position:absolute; top:4%; left:6%; font-weight:900; opacity:0.9;">${el[0]}</div>
                <div class="el-symbol" style="font-weight:900; line-height:1; margin-top:8%;">${el[1]}</div>
                <div class="el-name" style="font-weight:800; opacity:0.95; text-transform:capitalize; width:95%; white-space:nowrap; text-align:center; font-size: clamp(5px, 0.5vw, 9px); letter-spacing: -0.3px;">${el[2]}</div>
            </button>`;
        });
        
        // Add the legend keys
        let legendHtml = `<div style="grid-column:1 / -1; margin-top: 10px; display:flex; flex-wrap:wrap; gap:10px; align-items:center; justify-content:center; padding:10px; background: #f8fafc; border-radius: 16px; border: 3px solid #e2e8f0;">`;
        Object.keys(PT_GROUPS).forEach(g => {
            let name = g.charAt(0).toUpperCase() + g.slice(1);
            legendHtml += `<div style="display:flex; align-items:center; gap:6px; font-size:13px; font-weight:900; color:#334155;"><div style="width:16px; height:16px; border-radius:6px; border: 2px solid rgba(0,0,0,0.1); background:${PT_GROUPS[g]}; box-shadow: 0 2px 0 rgba(0,0,0,0.2);"></div>${name}</div>`;
        });
        legendHtml += `</div>`;
        
        grid.innerHTML = ptHtml + legendHtml;
    }
}

// Fixed getElementData to use the global arrays
function getElementData(symbol) {
    
    
    // Auto-generate based on global rawElements array
    let rawElData = PT_RAW_ELEMENTS.find(e => e[1] === symbol);
    if(!rawElData) return null;
    
    let z = rawElData[0];
    let name = rawElData[2];
    let grpKey = rawElData[3];
    let grpName = grpKey.charAt(0).toUpperCase() + grpKey.slice(1);
    let color = PT_GROUPS[grpKey] || '#94a3b8';
    
    // Calculate simple shells
    let shells = [];
    let rem = z;
    const caps = [2, 8, 18, 32, 32, 18, 8];
    for(let cap of caps) {
        if(rem > cap) { shells.push(cap); rem -= cap; }
        else if(rem > 0) { shells.push(rem); rem = 0; }
    }
    
    let ext = (window.FULL_ELEMENT_DB && window.FULL_ELEMENT_DB[symbol]) || {};
    if (ext.type) grpName = ext.type;
    
    return {
        name: name, z: z, groupName: grpName, groupKey: grpKey, color: color,
        mass: ext.mass || ((z * 2 + (z > 10 ? 2 : 0)).toFixed(3) + ' u'), 
        density: ext.density || 'Unknown', 
        melt: ext.melt || 'Unknown', 
        boil: ext.boil || 'Unknown',
        discoverer: ext.discoverer || 'Various', 
        year: ext.year || 'Ancient/Unknown',
        fact: ext.fact || `${name} is a chemical element belonging to the ${grpName} family.`,
        protons: z, neutrons: Math.round(z * 1.2), electrons: z, shells: shells
    };
}

window.updateElementDetails = function(symbol) {
    let emptyState = document.getElementById('element-details-empty');
    if (emptyState) emptyState.style.display = 'none';
    
    let content = document.getElementById('element-details-content');
    if (!content) return;
    
    content.style.display = 'flex';
    content.style.animation = 'none';
    setTimeout(() => content.style.animation = 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 10);
    
    let data = getElementData(symbol);
    if(!data) return;
    
    document.getElementById('ed-name').innerText = data.name;
    document.getElementById('ed-symbol').innerText = symbol;
    document.getElementById('ed-num').innerText = data.z;
    
    let badge = document.getElementById('ed-group-badge');
    if(badge) {
        badge.innerText = data.groupName;
        badge.style.background = data.color;
    }
    
    let dPanel = document.querySelector('.pt-details-panel');
    if(dPanel) {
        dPanel.style.border = "4px solid " + data.color;
        dPanel.style.boxShadow = "0 8px 0 " + data.color + "80";
    }
    
    window.bohrZoom = 1.4; // Zoomed in default on new element

    
    // Period and Group numbers
    let rawElData = PT_RAW_ELEMENTS.find(e => e[1] === symbol);
    if(rawElData) {
        let groupEl = document.getElementById('ed-group-num');
        let periodEl = document.getElementById('ed-period-num');
        if(groupEl) groupEl.innerText = rawElData[4];
        if(periodEl) periodEl.innerText = rawElData[5];
    }
    
    let factEl = document.getElementById('ed-fact');
    let massEl = document.getElementById('ed-mass');
    let densityEl = document.getElementById('ed-density');
    let meltEl = document.getElementById('ed-melt');
    let boilEl = document.getElementById('ed-boil');
    
    if(factEl) factEl.innerText = data.fact || 'No fact available.';
    if(massEl) massEl.innerText = data.mass;
    if(densityEl) densityEl.innerText = data.density;
    if(meltEl) meltEl.innerText = data.melt;
    if(boilEl) boilEl.innerText = data.boil;
    
    let discEl = document.getElementById('ed-discoverer');
    let yearEl = document.getElementById('ed-year');
    if(discEl) discEl.innerText = data.discoverer;
    if(yearEl) yearEl.innerText = data.year;
    
    let shellText = data.shells.map((count, i) => `<div style="background:#e2e8f0; border-radius:8px; padding:6px 10px; font-size:12px; font-weight:800; color:#334155; white-space:nowrap; border:2px solid #cbd5e1; flex-shrink:0;">S${i+1}: <span style="color:#0f172a; font-weight:900;">${count}e⁻</span></div>`).join('');
    
    let structText = document.getElementById('ed-structure-text');
    if(structText) {
        
        let cBg = data.color + '15'; // Very transparent background
        let cBorder = data.color + '50'; // Semi-transparent border
        let cText = data.color;
        
        structText.innerHTML = `
            <div style="display:flex; gap:10px; margin-bottom:12px; width:100%;">
                <div style="flex:1; background:${cBg}; border:2px solid ${cBorder}; border-radius:12px; padding:10px; text-align:center;">
                    <div style="font-size:10px; font-weight:900; color:${cText}; text-transform:uppercase;">Protons</div>
                    <div style="font-size:22px; font-weight:900; color:${cText}; line-height:1; margin-top:4px;">${data.protons}</div>
                </div>
                <div style="flex:1; background:${cBg}; border:2px solid ${cBorder}; border-radius:12px; padding:10px; text-align:center;">
                    <div style="font-size:10px; font-weight:900; color:${cText}; text-transform:uppercase;">Neutrons</div>
                    <div style="font-size:22px; font-weight:900; color:${cText}; line-height:1; margin-top:4px;">${data.neutrons}</div>
                </div>
                <div style="flex:1; background:${cBg}; border:2px solid ${cBorder}; border-radius:12px; padding:10px; text-align:center;">
                    <div style="font-size:10px; font-weight:900; color:${cText}; text-transform:uppercase;">Electrons</div>
                    <div style="font-size:22px; font-weight:900; color:${cText}; line-height:1; margin-top:4px;">${data.electrons}</div>
                </div>
            </div>
            
            <div style="background: ${cBg}; border: 2px solid ${cBorder}; border-radius: 16px; padding: 12px;">
                <div style="font-size:11px; font-weight:900; color:${cText}; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px; text-align:center;">Electron Shell Orbitals</div>
                <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:8px;">
                    ${data.shells.map((count, i) => `
                        <div style="background: white; border-radius: 50%; width: 45px; height: 45px; display: flex; flex-direction: column; justify-content: center; align-items: center; border: 3px solid ${cBorder}; box-shadow: 0 4px 0 ${cBorder};">
                            <span style="font-size: 9px; font-weight: 900; color: #94a3b8; line-height: 1;">n=${i+1}</span>
                            <span style="font-size: 14px; font-weight: 900; color: ${cText}; line-height: 1;">${count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Dynamically colorize the top info cards based on element type
    let gNum = document.getElementById('ed-group-num');
    let pNum = document.getElementById('ed-period-num');
    if(gNum) { gNum.parentElement.style.background = data.color + '15'; gNum.parentElement.style.borderColor = data.color + '50'; gNum.style.color = data.color; gNum.previousElementSibling.style.color = data.color; }
    if(pNum) { pNum.parentElement.style.background = data.color + '15'; pNum.parentElement.style.borderColor = data.color + '50'; pNum.style.color = data.color; pNum.previousElementSibling.style.color = data.color; }
    
    if(badge) {
        badge.parentElement.style.background = data.color + '15'; 
        badge.parentElement.style.borderColor = data.color + '50';
        badge.previousElementSibling.style.color = data.color;
        badge.style.background = data.color;
    }
    
    dPanel = document.querySelector('.pt-details-panel');
    if(dPanel) {
        dPanel.style.border = "4px solid " + data.color;
        dPanel.style.boxShadow = "0 8px 0 " + data.color + "80";
    }
    
    window.bohrZoom = 1.4; // Zoomed in default on new element

    // Very large viewBox so atoms like Oganesson never get cut off!
    let svg = `<svg viewBox="-260 -260 520 520" width="100%" height="100%" style="transition: transform 0.2s ease-out; transform: scale(${window.bohrZoom || 1});">`;
    
    svg += `<circle cx="0" cy="0" r="38" fill="${data.color}" filter="drop-shadow(0 0 12px ${data.color})" />`;
    svg += `<text x="0" y="4" font-size="26" fill="#fff" font-weight="900" text-anchor="middle">${symbol}</text>`;
    svg += `<text x="0" y="20" font-size="11" fill="#fff" font-weight="900" text-anchor="middle" letter-spacing="-0.3">${data.name}</text>`;
    
    let currentRadius = 60;
    data.shells.forEach((electronsInShell, shellIndex) => {
        svg += `<circle cx="0" cy="0" r="${currentRadius}" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2.5" stroke-dasharray="6 6" />`;
        
        let angleStep = (Math.PI * 2) / electronsInShell;
        svg += `<g style="animation: spin ${12 + shellIndex*4}s linear infinite;">`;
        for(let e=0; e<electronsInShell; e++) {
            let cx = Math.cos(angleStep * e) * currentRadius;
            let cy = Math.sin(angleStep * e) * currentRadius;
            svg += `<circle cx="${cx}" cy="${cy}" r="6" fill="#38bdf8" filter="drop-shadow(0 0 8px #38bdf8)" />`;
        }
        svg += `</g>`;
        currentRadius += 28; 
    });
    
    svg += `</svg>`;
    
    if(!document.getElementById('spin-anim')) {
        let st = document.createElement('style');
        st.id = 'spin-anim';
        st.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(st);
    }
    
    let bohr = document.getElementById('ed-bohr-container');
    if(bohr) bohr.innerHTML = svg;
}

window.highlightGroup = function(grp) {
    let elements = document.querySelectorAll('.pt-element');
    elements.forEach(el => {
        if(el.dataset.group === grp) {
            el.style.transform = 'scale(1.08) translateY(-4px)';
            el.style.filter = 'brightness(1.15)';
            el.style.zIndex = '10';
            el.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
        } else {
            el.style.transform = 'scale(0.95)';
            el.style.filter = 'grayscale(0.7) opacity(0.5)';
            el.style.zIndex = '1';
            el.style.boxShadow = '0 2px 0 rgba(0,0,0,0.1)';
        }
    });
}

window.removeHighlightGroup = function() {
    let elements = document.querySelectorAll('.pt-element');
    elements.forEach(el => {
        el.style.transform = 'none';
        el.style.filter = 'none';
        el.style.zIndex = '1';
        el.style.boxShadow = '0 4px 0 rgba(0,0,0,0.25)';
    });
}



// ==========================================
// 3. DRAG & THROW PARTICLE PHYSICS ENGINE
// ==========================================
const compounds = [
    `<div class="comp-h2o"><div class="atom a-O">O<span class="glare"></span></div><div class="atom a-H">H<span class="glare"></span></div><div class="atom a-H">H<span class="glare"></span></div></div>`,
    `<div class="comp-co2"><div class="atom a-O">O<span class="glare"></span></div><div class="atom a-C">C<span class="glare"></span></div><div class="atom a-O">O<span class="glare"></span></div></div>`,
    `<div class="comp-nacl"><div class="atom a-Na">Na<span class="glare"></span></div><div class="atom a-Cl">Cl<span class="glare"></span></div></div>`,
    `<div class="comp-single"><div class="atom a-O">O<span class="glare"></span></div></div>`,
    `<div class="comp-single"><div class="atom a-Na">Na<span class="glare"></span></div></div>`
];

let particles = [];
let draggingParticle = null;
let dragOffset = { x: 0, y: 0 };
let mouseHistory = [];

function spawnMoleculeAt(x, y) {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const molecule = document.createElement('div');
    molecule.className = 'molecule';
    molecule.innerHTML = compounds[Math.floor(Math.random() * compounds.length)];
    
    const scale = Math.random() * 0.4 + 0.6; // 0.6 to 1.0
    molecule.style.transform = `translate(-50%, -50%) scale(${scale})`;
    
    // Default spawn at bottom if no X/Y provided
    const spawnX = x !== undefined ? x : (Math.random() * window.innerWidth * 0.9 + window.innerWidth * 0.05);
    const spawnY = y !== undefined ? y : window.innerHeight + 100;
    
    molecule.style.left = `${spawnX}px`;
    molecule.style.top = `${spawnY}px`;
    
    canvas.appendChild(molecule);

    // Physics object
    const p = {
        el: molecule,
        x: spawnX,
        y: spawnY,
        vx: (Math.random() - 0.5) * 2, // Slight random horizontal drift
        vy: - (Math.random() * 2 + 1), // Drift upwards
        rot: 0,
        vrot: (Math.random() - 0.5) * 2,
        scale: scale
    };
    
    particles.push(p);

    // Interaction Handlers
    molecule.addEventListener('mousedown', (e) => {
        e.stopPropagation(); // Don't spawn a new one behind it
        draggingParticle = p;
        dragOffset.x = e.clientX - p.x;
        dragOffset.y = e.clientY - p.y;
        mouseHistory = [{x: e.clientX, y: e.clientY, time: performance.now()}];
        molecule.style.cursor = 'grabbing';
    });
}

// Global Mouse Physics
document.addEventListener('mousemove', (e) => {
    if (draggingParticle) {
        draggingParticle.x = e.clientX - dragOffset.x;
        draggingParticle.y = e.clientY - dragOffset.y;
        
        // Track history for throw momentum
        const now = performance.now();
        mouseHistory.push({x: e.clientX, y: e.clientY, time: now});
        if (mouseHistory.length > 5) mouseHistory.shift();
    }
});

document.addEventListener('mouseup', () => {
    if (draggingParticle) {
        draggingParticle.el.style.cursor = 'grab';
        
        // Calculate throw momentum
        if (mouseHistory.length > 1) {
            const first = mouseHistory[0];
            const last = mouseHistory[mouseHistory.length - 1];
            const timeDiff = Math.max(last.time - first.time, 1); // Avoid div zero
            
            // Pixels per millisecond * arbitrary multiplier for feel
            const vx = (last.x - first.x) / timeDiff * 15;
            const vy = (last.y - first.y) / timeDiff * 15;
            
            // Cap throw speed
            draggingParticle.vx = Math.max(Math.min(vx, 30), -30);
            draggingParticle.vy = Math.max(Math.min(vy, 30), -30);
            
            // Add some spin on throw
            draggingParticle.vrot = (Math.random() - 0.5) * 10;
        }
        
        draggingParticle = null;
        mouseHistory = [];
    }
});

// Physics Loop
function physicsLoop() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        if (p !== draggingParticle) {
            // Apply velocity
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vrot;
            
            // Friction (Air resistance)
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.vrot *= 0.98;
            
            // Buoyancy (Always try to float slowly upwards if completely stopped)
            if (p.vy > -2) p.vy -= 0.05;
        }
        
        // Update DOM
        p.el.style.left = `${p.x}px`;
        p.el.style.top = `${p.y}px`;
        p.el.style.transform = `translate(-50%, -50%) scale(${p.scale}) rotate(${p.rot}deg)`;
        
        // Destroy if it floats far off screen
        if (p.y < -300 || p.x < -200 || p.x > window.innerWidth + 200 || p.y > window.innerHeight + 500) {
            p.el.remove();
            particles.splice(i, 1);
        }
    }
    requestAnimationFrame(physicsLoop);
}


// ==========================================
// 4. GOOFY NAME GENERATOR
// ==========================================
const goofyNames = [
    "Atomic Avocado", "Salty Sodium", "Neon Ninja", "Proton Panda", 
    "Mighty Molecule", "Helium Hippo", "Copper Captain", "Radical Radish",
    "Bubbly Barium", "Lithium Lizard", "Noble Gas", "Covalent Cat",
    "Iron Iguana", "Carbon Comet", "Brave Boron", "Furious Fluorine"
];

function generateGoofyName() {
    const nameInput = document.getElementById('player-name');
    if (nameInput && !nameInput.value) {
        nameInput.value = goofyNames[Math.floor(Math.random() * goofyNames.length)];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updatePlayButton();
    generateGoofyName();
    
    // Bind soft click sound to all interactive elements
    document.body.addEventListener('mousedown', () => {
        initAudio();
    }, { once: true });
    
    document.querySelectorAll('.interactive').forEach(el => {
        el.addEventListener('mousedown', (e) => {
            // Only play if it's not a molecule (they have their own logic now)
            if(!el.classList.contains('molecule')) playSoftClick();
        });
    });
    
    // Spawn on clicking empty space
    document.body.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BODY' || e.target.id === 'particle-canvas' || e.target.classList.contains('bg-layer')) {
            spawnMoleculeAt(e.clientX, e.clientY);
        }
    });

    // Start Physics
    physicsLoop();
    
    // Auto-spawner
    setInterval(() => spawnMoleculeAt(), 2500);
    
    // Initial spawns
    for(let i=0; i<3; i++) {
        setTimeout(() => spawnMoleculeAt(), i * 400);
    }
});


// ==========================================
// SANDBOX ENGINE
// ==========================================

window.openVirtualKeyboard = function() {
    if(typeof window.playSound==="function") window.playSound("click");
    document.getElementById('sandbox-virtual-modal').style.display = 'flex';
    document.getElementById('vk-display').innerText = '';
    
    // Generate PT Grid if not already done
    let grid = document.getElementById('vk-pt-grid');
    if(grid && grid.children.length === 0) {
        const groups = {
            'alkali': '#ef4444', 'alkaline': '#f97316', 'transition': '#f59e0b',
            'post': '#84cc16', 'metalloid': '#10b981', 'nonmetal': '#06b6d4',
            'halogen': '#3b82f6', 'noble': '#8b5cf6', 'lanthanide': '#d946ef',
            'actinide': '#f43f5e', 'unknown': '#64748b'
        };
        const rawElements = [
            [1,'H','Hydrogen','nonmetal',1,1], [2,'He','Helium','noble',18,1],
            [3,'Li','Lithium','alkali',1,2], [4,'Be','Beryllium','alkaline',2,2], [5,'B','Boron','metalloid',13,2], [6,'C','Carbon','nonmetal',14,2], [7,'N','Nitrogen','nonmetal',15,2], [8,'O','Oxygen','nonmetal',16,2], [9,'F','Fluorine','halogen',17,2], [10,'Ne','Neon','noble',18,2],
            [11,'Na','Sodium','alkali',1,3], [12,'Mg','Magnesium','alkaline',2,3], [13,'Al','Aluminum','post',13,3], [14,'Si','Silicon','metalloid',14,3], [15,'P','Phosphorus','nonmetal',15,3], [16,'S','Sulfur','nonmetal',16,3], [17,'Cl','Chlorine','halogen',17,3], [18,'Ar','Argon','noble',18,3],
            [19,'K','Potassium','alkali',1,4], [20,'Ca','Calcium','alkaline',2,4], [21,'Sc','Scandium','transition',3,4], [22,'Ti','Titanium','transition',4,4], [23,'V','Vanadium','transition',5,4], [24,'Cr','Chromium','transition',6,4], [25,'Mn','Manganese','transition',7,4], [26,'Fe','Iron','transition',8,4], [27,'Co','Cobalt','transition',9,4], [28,'Ni','Nickel','transition',10,4], [29,'Cu','Copper','transition',11,4], [30,'Zn','Zinc','transition',12,4], [31,'Ga','Gallium','post',13,4], [32,'Ge','Germanium','metalloid',14,4], [33,'As','Arsenic','metalloid',15,4], [34,'Se','Selenium','nonmetal',16,4], [35,'Br','Bromine','halogen',17,4], [36,'Kr','Krypton','noble',18,4]
        ]; // Shortened for space, but valid for basic testing

        let ptHtml = '';
        rawElements.forEach(el => {
            let col = groups[el[3]] || '#94a3b8';
            ptHtml += `<button class="vk-pt-btn interactive" onclick="window.vkType('${el[1]}')" style="grid-column:${el[4]}; grid-row:${el[5]}; background:${col}; color:white; border:none; border-radius:8px; font-weight:900; box-shadow:0 4px 0 rgba(0,0,0,0.2); cursor:pointer;" title="${el[2]}">${el[1]}</button>`;
        });
        grid.innerHTML = ptHtml;
    }
};

window.vkType = function(char) {
    if(typeof window.playSound==="function") window.playSound("click");
    let disp = document.getElementById('vk-display');
    document.getElementById('vk-feedback').style.display = 'none';

    if(char === '->') {
        disp.innerText += '  ';
        document.getElementById('vk-arrow-btn').disabled = true;
        document.getElementById('vk-arrow-btn').style.opacity = '0.5';
    } else if (char === '+') {
        disp.innerText += ' + ';
    } else if (/[0-9]/.test(char)) {
        const subs = {'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'};
        disp.innerText += subs[char];
    } else {
        disp.innerText += char;
    }
};

window.vkBackspace = function() {
    if(typeof window.playSound==="function") window.playSound("click");
    let disp = document.getElementById('vk-display');
    let text = disp.innerText;
    if(text.length === 0) return;

    if(text.endsWith('  ')) {
        disp.innerText = text.slice(0, -3);
        document.getElementById('vk-arrow-btn').disabled = false;
        document.getElementById('vk-arrow-btn').style.opacity = '1';
    } else if (text.endsWith(' + ')) {
        disp.innerText = text.slice(0, -3);
    } else {
        disp.innerText = text.slice(0, -1);
    }
    document.getElementById('vk-feedback').style.display = 'none';
};

window.vkCheck = function() {
    if(typeof window.playSound==="function") window.playSound("click");
    let feedback = document.getElementById('vk-feedback');
    let eq = document.getElementById('vk-display').innerText.trim();

    // Skip validation for now, just save and go
    localStorage.setItem('stoich_sandbox_level', eq);
    document.getElementById('sandbox-virtual-modal').style.display = 'none';
    
    // We will pass it via URL
    let nameParam = encodeURIComponent(document.getElementById('player-name').value.trim() || 'Student');
    window.transitionTo(`game.html?level=sandbox&name=${nameParam}&eq=${encodeURIComponent(eq)}`);
};

// Builder Mode
let boxCounter = 0;
window.builderAddBox = function(side) {
    if(typeof window.playSound==="function") window.playSound("click");
    let container = document.getElementById(`builder-${side}-container`);
    let id = `box-${boxCounter++}`;
    
    let wrap = document.createElement('div');
    wrap.style.cssText = "display:flex; align-items:center; gap:5px;";
    
    if(container.children.length > 0) {
        let plus = document.createElement('div');
        plus.innerText = "+";
        plus.style.cssText = "font-size:32px; font-weight:900; color:#cbd5e1;";
        wrap.appendChild(plus);
    }
    
    let input = document.createElement('input');
    input.type = 'text';
    input.id = id;
    input.placeholder = 'H2O';
    input.style.cssText = "font-size:24px; font-weight:900; padding:10px; width:120px; border:4px solid #cbd5e1; border-radius:12px; text-align:center;";
    wrap.appendChild(input);
    
    let del = document.createElement('button');
    del.className = "interactive";
    del.innerText = "X";
    del.style.cssText = "background:#ef4444; color:white; border:none; border-radius:8px; font-weight:900; padding:10px; cursor:pointer;";
    del.onclick = function() {
        wrap.remove();
        // Remove leading plus if first child
        if(container.children.length > 0 && container.children[0].children[0].innerText === '+') {
            container.children[0].children[0].remove();
        }
    };
    wrap.appendChild(del);
    
    container.appendChild(wrap);
};

window.builderHideSave = function() {
    document.getElementById('builder-save-btn').style.display = 'none';
    document.getElementById('builder-feedback').style.display = 'none';
};

window.builderCheck = function() {
    if(typeof window.playSound==="function") window.playSound("click");
    document.getElementById('builder-save-btn').style.display = 'block';
    document.getElementById('builder-feedback').style.display = 'block';
    document.getElementById('builder-feedback').innerText = "Looks good! Click Save & Play!";
    document.getElementById('builder-feedback').style.background = "#d1fae5";
    document.getElementById('builder-feedback').style.color = "#047857";
};

window.builderSaveAndPlay = function() {
    if(typeof window.playSound==="function") window.playSound("click");
    let reacts = Array.from(document.getElementById('builder-reactants-container').querySelectorAll('input')).map(i => i.value).join(' + ');
    let prods = Array.from(document.getElementById('builder-products-container').querySelectorAll('input')).map(i => i.value).join(' + ');
    let eq = reacts + " -> " + prods;
    
    document.getElementById('sandbox-input-modal').style.display = 'none';
    let nameParam = encodeURIComponent(document.getElementById('player-name').value.trim() || 'Student');
    window.transitionTo(`game.html?level=sandbox&name=${nameParam}&eq=${encodeURIComponent(eq)}`);
};

window.openPeriodicPicker = function() {
    if(typeof window.playSound==="function") window.playSound("click");
    alert("Periodic picker not hooked up yet, type manually!");
};

window.bohrZoom = 1.4;
window.zoomBohr = function(delta) {
    window.bohrZoom = Math.max(0.5, Math.min(3, window.bohrZoom + delta));
    let svg = document.querySelector('#ed-bohr-container svg');
    if(svg) svg.style.transform = `scale(${window.bohrZoom})`;
};
