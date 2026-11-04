
window.checkPlayerDropdownVisibility = function() {
    let profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    let btn = document.getElementById('player-dropdown-toggle-btn');
    if (btn) {
        btn.style.display = (profiles && profiles.length > 1) ? 'flex' : 'none';
    }
};

window.togglePlayerDropdown = function(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    let dropdown = document.getElementById('profile-dropdown');
    let inp = document.getElementById('player-name');
    let btn = document.getElementById('player-dropdown-toggle-btn');
    
    if (dropdown && dropdown.style.display === 'flex') {
        dropdown.style.display = 'none';
        if (btn) btn.classList.remove('is-open');
    } else {
        if (typeof playSound === 'function') playSound('click');
        window.renderProfiles("");
        if (btn) btn.classList.add('is-open');
        if (inp) inp.focus();
    }
};

window.renderProfiles = function(filterText = "") {
    let profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    let dropdown = document.getElementById('profile-dropdown');
    let toggleBtn = document.getElementById('player-dropdown-toggle-btn');
    
    // Dropdown chevron button appears ONLY if there are more than 1 player
    if (toggleBtn) {
        toggleBtn.style.display = profiles.length > 1 ? 'flex' : 'none';
    }
    
    if (!dropdown) return;
    
    let filtered = profiles.filter(p => p.toLowerCase().includes(filterText.toLowerCase()));
    
    dropdown.innerHTML = '';
    
    if (filtered.length === 0) {
        dropdown.style.display = 'none';
        if (toggleBtn) toggleBtn.classList.remove('is-open');
        return;
    }
    
    filtered.forEach(p => {
        let item = document.createElement('div');
        item.className = 'profile-item-row interactive';
        
        let nameSpan = document.createElement('span');
        nameSpan.className = 'profile-name-text';
        nameSpan.innerText = p;
        nameSpan.onclick = () => {
            document.getElementById('player-name').value = p;
            dropdown.style.display = 'none';
            if (toggleBtn) toggleBtn.classList.remove('is-open');
            if (typeof playSound === 'function') playSound('click');
        };
        
        let trashBtn = document.createElement('button');
        trashBtn.className = 'profile-trash-btn interactive';
        trashBtn.type = 'button';
        trashBtn.title = `Delete ${p}'s profile`;
        trashBtn.setAttribute('aria-label', `Delete ${p}'s profile`);
        trashBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
        `;
        
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
                localStorage.removeItem('challengeHistory_' + p);
                localStorage.removeItem('challengeBadges_' + p);
                if (localStorage.getItem('currentPlayer') === p) {
                    localStorage.removeItem('currentPlayer');
                    document.getElementById('player-name').value = '';
                }
                window.renderProfiles(document.getElementById('player-name').value);
                window.checkPlayerDropdownVisibility();
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
    if(inp) {
        inp.select(); // Highlight the current name so typing replaces it instantly
        window.renderProfiles(""); // ALWAYS show all profiles when first clicking the box!
    }
};

window.filterProfiles = function() {
    let inp = document.getElementById('player-name');
    if(inp) window.renderProfiles(inp.value);
};

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    let input = document.getElementById('player-name');
    let dropdown = document.getElementById('profile-dropdown');
    let toggleBtn = document.getElementById('player-dropdown-toggle-btn');
    if (input && dropdown && e.target !== input && !dropdown.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
        dropdown.style.display = 'none';
        if (toggleBtn) toggleBtn.classList.remove('is-open');
    }
});

// Auto-fill last used name & check dropdown button visibility
function initPlayerState() {
    let lastPlayer = localStorage.getItem('currentPlayer');
    if (lastPlayer) {
        let nameInput = document.getElementById('player-name');
        if (nameInput) nameInput.value = lastPlayer;
    }
    if (typeof window.checkPlayerDropdownVisibility === 'function') {
        window.checkPlayerDropdownVisibility();
    }
}
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initPlayerState);
} else {
    initPlayerState();
}

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

// HOME CHALLENGE MODIFIERS STATE
window.homeModifiers = {
    scale: false,
    hints: false,
    rush: false
};

window.toggleHomeModifier = function(event, type) {
    if (event) event.stopPropagation();
    if (typeof playSound === 'function') playSound('tactile');
    
    window.homeModifiers[type] = !window.homeModifiers[type];
    
    const btn = document.getElementById(`home-mod-${type}`);
    if (btn) {
        if (window.homeModifiers[type]) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    }
    
    updateHomeMultiplier();
};

function updateHomeMultiplier() {
    let mult = 1.0;
    let count = 0;
    if (window.homeModifiers.scale) { mult += 0.5; count++; }
    if (window.homeModifiers.hints) { mult += 0.5; count++; }
    if (window.homeModifiers.rush) { mult += 0.5; count++; }
    
    const tagEl = document.getElementById('home-multiplier-tag');
    if (tagEl) {
        if (mult >= 2.5) {
            tagEl.innerText = '2.5x LEGENDARY';
            tagEl.style.background = '#fef3c7';
            tagEl.style.color = '#d97706';
            tagEl.style.borderColor = '#d97706';
        } else if (mult >= 2.0) {
            tagEl.innerText = '2.0x EXPERT';
            tagEl.style.background = '#f3e8ff';
            tagEl.style.color = '#7e22ce';
            tagEl.style.borderColor = '#7e22ce';
        } else if (mult >= 1.5) {
            tagEl.innerText = '1.5x VETERAN';
            tagEl.style.background = '#dbeafe';
            tagEl.style.color = '#2563eb';
            tagEl.style.borderColor = '#2563eb';
        } else {
            tagEl.innerText = '1.0x STANDARD';
            tagEl.style.background = 'rgba(255, 255, 255, 0.2)';
            tagEl.style.color = 'white';
            tagEl.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        }
    }
    
    updatePlayButton();
}

function updatePlayButton() {
    const playBtnText = document.getElementById('play-btn-text');
    const statsBtn = document.getElementById('challenge-stats-btn');
    if (statsBtn) statsBtn.style.display = 'inline-flex';
    if (currentMode === 'class') {
        playBtnText.innerText = `Start ${currentSubOption}`;
    } 
    else if (currentMode === 'challenge') {
        let mult = 1.0;
        if (window.homeModifiers) {
            if (window.homeModifiers.scale) mult += 0.5;
            if (window.homeModifiers.hints) mult += 0.5;
            if (window.homeModifiers.rush) mult += 0.5;
        }
        let multStr = mult > 1.0 ? ` (${mult.toFixed(1)}x)` : '';
        playBtnText.innerText = `Start ${currentSubOption} Challenge${multStr}`;
    } 
    else if (currentMode === 'sandbox') {
        const isLevels = (currentSubOption === 'Select Levels' || currentSubOption === 'Levels');
        playBtnText.innerText = isLevels ? 'Select Levels' : 'Create Level';
    }
}

function startGame() {
    if(typeof window.playSound==="function") window.playSound("start");
    const btn = document.getElementById('main-play-btn');
    if (btn) {
        btn.style.transform = 'translateY(8px)';
        btn.style.boxShadow = '0 0 0 transparent';
        setTimeout(() => {
            btn.style.transform = '';
            btn.style.boxShadow = '';
        }, 180);
    }
    
    const playerNameInput = document.getElementById('player-name').value.trim();
    const finalName = playerNameInput !== '' ? playerNameInput : 'Student';
    
    // Redirect to Level Selection Screen
    if (currentMode === 'sandbox') {
        const isLevels = (currentSubOption === 'Select Levels' || currentSubOption === 'Levels');
        if (isLevels) {
            window.transitionTo(`levels.html?mode=sandbox&name=${encodeURIComponent(finalName)}`);
        } else {
            window.openVirtualKeyboard();
        }
        return;
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
        
        if (currentMode === 'challenge') {
            const tierParam = encodeURIComponent((currentSubOption || 'Easy').toLowerCase());
            const scaleParam = (window.homeModifiers && window.homeModifiers.scale) ? 'off' : 'on';
            const hintsParam = (window.homeModifiers && window.homeModifiers.hints) ? '0' : '1';
            const timerParam = (window.homeModifiers && window.homeModifiers.rush) ? 'countdown' : 'stopwatch';
            window.transitionTo(`game.html?mode=challenge&tier=${tierParam}&scale=${scaleParam}&hints=${hintsParam}&timer=${timerParam}&name=${nameParam}`);
        } else {
            window.transitionTo(`levels.html?form=${formParam}&mode=${currentMode}&name=${nameParam}`);
        }

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
    const initParams = new URLSearchParams(window.location.search);
    if (initParams.get('mode') === 'sandbox') {
        selectMode('sandbox');
        if (initParams.get('action') === 'create') {
            setTimeout(() => {
                if (typeof window.openVirtualKeyboard === 'function') window.openVirtualKeyboard();
            }, 250);
        }
    }
    updatePlayButton();
    generateGoofyName();
    
    // Bind soft click sound to all interactive elements
    document.body.addEventListener('mousedown', () => {
        initAudio();
    }, { once: true });
    
    document.querySelectorAll('.interactive').forEach(el => {
        el.addEventListener('mousedown', (e) => {
            // Only play if it's not a molecule (they have their own logic now)
            if(!el.classList.contains('molecule')) {
                if (typeof window.playSound === 'function') window.playSound('click');
            }
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

window.openSandboxModal = function() {
    if (typeof playSound === 'function') playSound('select');
    const modal = document.getElementById('sandbox-choice-modal');
    if (modal) modal.style.display = 'flex';
    if (typeof window.renderSavedAiLevels === 'function') window.renderSavedAiLevels();
};

window.closeVirtualKeyboardModal = function() {
    if (typeof playSound === 'function') playSound('click');
    const modal = document.getElementById('sandbox-virtual-modal');
    if (modal) modal.style.display = 'none';
};

window.openVirtualKeyboardModal = function() {
    window.openVirtualKeyboard();
};

window.openVirtualKeyboard = function() {
    if(typeof window.playSound==="function") window.playSound("click");
    document.getElementById('sandbox-virtual-modal').style.display = 'flex';
    document.getElementById('vk-display').innerText = '';
    if (typeof window.updateVkKeypadState === 'function') window.updateVkKeypadState();
    
    // Generate PT Grid if not already done - uses full 118 elements and group colors!
    let grid = document.getElementById('vk-pt-grid');
    if(grid && grid.children.length === 0) {
        let ptHtml = '';
        const rawElements = (typeof PT_RAW_ELEMENTS !== 'undefined') ? PT_RAW_ELEMENTS : [];
        const groups = (typeof PT_GROUPS !== 'undefined') ? PT_GROUPS : {};

        rawElements.forEach(el => {
            let col = groups[el[3]] || '#94a3b8';
            let grpClass = 'pt-group-' + el[3];
            ptHtml += `
            <button class="vk-pt-btn pt-element interactive ${grpClass}" data-group="${el[3]}" 
                style="grid-column:${el[4]}; grid-row:${el[5]}; background:${col}; color:white; 
                       border: 2px solid rgba(0,0,0,0.18); border-radius:8px; 
                       box-shadow: 0 2px 0 rgba(0,0,0,0.25); cursor:pointer; 
                       position:relative; display:flex; flex-direction:column; 
                       justify-content:center; align-items:center; padding: 2px;
                       aspect-ratio: 1/1; overflow:hidden;" 
                title="${el[0]} - ${el[2]} (${el[1]})" 
                onclick="window.vkType('${el[1]}')">
                <div class="el-num" style="position:absolute; top:2%; left:5%; font-size:clamp(6px, 0.55vw, 9.5px); font-weight:900; opacity:0.85;">${el[0]}</div>
                <div class="el-symbol" style="font-size:clamp(11px, 1.25vw, 19px); font-weight:900; line-height:1; margin-top:5%;">${el[1]}</div>
                <div class="el-name" style="font-size:clamp(4.5px, 0.42vw, 8px); font-weight:800; opacity:0.9; text-transform:capitalize; width:95%; white-space:nowrap; text-align:center; overflow:hidden; text-overflow:ellipsis;">${el[2]}</div>
            </button>`;
        });
        
        // Add legend bar
        let legendHtml = `<div style="grid-column:1 / -1; margin-top:6px; display:flex; flex-wrap:wrap; gap:6px; align-items:center; justify-content:center; padding:5px 10px; background:#f8fafc; border-radius:10px; border:2px solid #e2e8f0;">`;
        Object.keys(groups).forEach(g => {
            let name = g.charAt(0).toUpperCase() + g.slice(1);
            legendHtml += `<div style="display:flex; align-items:center; gap:4px; font-size:10px; font-weight:800; color:#334155;"><div style="width:10px; height:10px; border-radius:3px; background:${groups[g]}; border:1px solid rgba(0,0,0,0.15);"></div>${name}</div>`;
        });
        legendHtml += `</div>`;
        grid.innerHTML = ptHtml + legendHtml;
    }
};

window.vkClear = function() {
    if(typeof window.playSound==="function") window.playSound("click");
    let disp = document.getElementById('vk-display');
    if (disp) disp.innerText = '';
    let arrowBtn = document.getElementById('vk-arrow-btn');
    if (arrowBtn) {
        arrowBtn.disabled = false;
        arrowBtn.style.opacity = '1';
    }
    let feedback = document.getElementById('vk-feedback');
    if (feedback) feedback.style.display = 'none';
    let launchBtn = document.getElementById('vk-launch-btn');
    if (launchBtn) launchBtn.style.display = 'none';
};

window.setVkBtnToCheckMode = function() {
    const btn = document.getElementById('vk-check-btn') || document.getElementById('vk-solve-btn');
    if (!btn) return;
    btn.setAttribute('data-mode', 'check');
    btn.disabled = false;
    btn.style.background = '#f59e0b';
    btn.style.color = '#1e1b4b';
    btn.style.borderColor = '#1e293b';
    btn.style.boxShadow = '0 4px 0 #1e293b';
    btn.style.cursor = 'pointer';
    btn.title = 'Check equation or let AI auto-complete';
    btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span id="vk-check-btn-text">Check Equation</span>
    `;
};

window.setVkBtnToSaveMode = function() {
    const btn = document.getElementById('vk-check-btn') || document.getElementById('vk-solve-btn');
    if (!btn) return;
    btn.setAttribute('data-mode', 'save');
    btn.disabled = false;
    btn.style.background = '#10b981';
    btn.style.color = '#ffffff';
    btn.style.borderColor = '#1e293b';
    btn.style.boxShadow = '0 4px 0 #1e293b';
    btn.style.cursor = 'pointer';
    btn.title = 'Reaction is valid! Click to save this level to your collection';
    btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
        </svg>
        <span id="vk-check-btn-text" style="letter-spacing:0.3px;">Save This Level</span>
    `;
};

window.setVkBtnToSavedMode = function() {
    const btn = document.getElementById('vk-check-btn') || document.getElementById('vk-solve-btn');
    if (!btn) return;
    btn.setAttribute('data-mode', 'saved');
    btn.disabled = true;
    btn.style.background = '#059669';
    btn.style.color = '#ffffff';
    btn.style.borderColor = '#047857';
    btn.style.boxShadow = 'none';
    btn.style.cursor = 'default';
    btn.title = 'Saved to custom levels';
    btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span id="vk-check-btn-text" style="letter-spacing:0.3px;">Saved to Collection! ✓</span>
    `;
};

window.onVkMainBtnClick = function() {
    const btn = document.getElementById('vk-check-btn') || document.getElementById('vk-solve-btn');
    if (!btn) return;
    const mode = btn.getAttribute('data-mode') || 'check';
    if (mode === 'save') {
        if (typeof window.saveSandboxKeypadLevel === 'function') {
            window.saveSandboxKeypadLevel();
        }
    } else if (mode === 'check') {
        window.vkCheck();
    }
};

window.updateVkKeypadState = function() {
    let disp = document.getElementById('vk-display');
    let text = disp ? (disp.innerText || disp.textContent || '').trim() : '';
    let checkBtn = document.getElementById('vk-check-btn') || document.getElementById('vk-solve-btn');
    let feedback = document.getElementById('vk-feedback');

    if (checkBtn) {
        checkBtn.style.display = text.length > 0 ? 'flex' : 'none';
        const currentMode = checkBtn.getAttribute('data-mode');
        if (currentMode !== 'check') {
            window.setVkBtnToCheckMode();
            window.validSandboxLevel = null;
        }
    }
    if (text.length === 0) {
        if (feedback) feedback.style.display = 'none';
        window.validSandboxLevel = null;
    }
};

window.vkClear = function() {
    if(typeof window.playSound==="function") window.playSound("click");
    let disp = document.getElementById('vk-display');
    if (disp) disp.innerText = '';
    let arrowBtn = document.getElementById('vk-arrow-btn');
    if (arrowBtn) {
        arrowBtn.disabled = false;
        arrowBtn.style.opacity = '1';
    }
    window.updateVkKeypadState();
};

window.vkLoadPreset = function(presetEq) {
    if(typeof window.playSound==="function") window.playSound("click");
    let disp = document.getElementById('vk-display');
    if (disp) disp.innerText = presetEq;
    let arrowBtn = document.getElementById('vk-arrow-btn');
    if (arrowBtn) {
        arrowBtn.disabled = true;
        arrowBtn.style.opacity = '0.5';
    }
    window.updateVkKeypadState();
    window.vkCheck();
};

window.vkType = function(char) {
    if(typeof window.playSound==="function") window.playSound("click");
    let disp = document.getElementById('vk-display');
    if (!disp) return;
    let feedback = document.getElementById('vk-feedback');
    if (feedback) feedback.style.display = 'none';

    if(char === '->' || char === '→') {
        disp.innerText += ' → ';
        let arrowBtn = document.getElementById('vk-arrow-btn');
        if (arrowBtn) {
            arrowBtn.disabled = true;
            arrowBtn.style.opacity = '0.5';
        }
    } else if (char === '+' || char === '=') {
        disp.innerText += ' + ';
    } else if (char === '(' || char === ')') {
        disp.innerText += char;
    } else if (/[0-9]/.test(char)) {
        const subs = {'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'};
        disp.innerText += subs[char];
    } else {
        disp.innerText += char;
    }
    window.updateVkKeypadState();
};

window.vkBackspace = function() {
    if(typeof window.playSound==="function") window.playSound("click");
    let disp = document.getElementById('vk-display');
    if (!disp) return;
    let text = disp.innerText || disp.textContent || '';
    if(text.length === 0) {
        window.updateVkKeypadState();
        return;
    }

    if(text.endsWith(' → ') || text.endsWith(' -> ')) {
        disp.innerText = text.slice(0, -3);
        let arrowBtn = document.getElementById('vk-arrow-btn');
        if (arrowBtn) {
            arrowBtn.disabled = false;
            arrowBtn.style.opacity = '1';
        }
    } else if (text.endsWith(' + ')) {
        disp.innerText = text.slice(0, -3);
    } else {
        disp.innerText = text.slice(0, -1);
    }
    let feedback = document.getElementById('vk-feedback');
    if (feedback) feedback.style.display = 'none';
    window.updateVkKeypadState();
};

// Unified Check Equation & AI Auto-Complete Function
window.vkCheck = function() {
    if(typeof window.playSound==="function") window.playSound("click");
    let feedback = document.getElementById('vk-feedback');
    let disp = document.getElementById('vk-display');
    let eq = (disp.innerText || disp.textContent || '').trim();

    if (!eq) {
        if (feedback) {
            feedback.style.display = 'block';
            feedback.style.background = '#fef2f2';
            feedback.style.color = '#991b1b';
            feedback.style.border = '2px solid #ef4444';
            feedback.innerText = 'Please enter a chemical formula or choose elements from the periodic table.';
        }
        return;
    }

    // 1. Check if complete equation with arrow and both sides
    const hasArrow = eq.includes('->') || eq.includes('→') || eq.includes('=');
    let parts = hasArrow ? eq.split(/->|→|=/) : [eq, ''];
    let hasBothSides = parts.length >= 2 && parts[0].trim() && parts[1].trim();

    if (hasBothSides) {
        let cleanEq = parts[0].trim() + ' -> ' + parts[1].trim();
        let res = window.validateAndSolveEquation ? window.validateAndSolveEquation(cleanEq) : { valid: false, error: 'Validator loading...' };
        
        if (res.valid) {
            feedback.style.display = 'block';
            feedback.style.background = '#ecfdf5';
            feedback.style.color = '#065f46';
            feedback.style.border = '2px solid #10b981';
            feedback.innerHTML = `✅ <b>Valid Reaction!</b> Balanced target: <b>${res.balancedString}</b>`;
            
            let dbMatch = (typeof window.resolveReactionFromPrompt === 'function') ? window.resolveReactionFromPrompt(res.equation) : null;
            if (dbMatch && dbMatch.title) {
                res.title = dbMatch.title;
            } else {
                res.title = 'Custom Reaction';
            }
            window.validSandboxLevel = res;
            localStorage.setItem('stoich_custom_sandbox', JSON.stringify(res));
            localStorage.setItem('stoich_sandbox_level', res.equation);

            if (typeof window.setVkBtnToSaveMode === 'function') {
                window.setVkBtnToSaveMode();
            }
            return;
        }
    }

    // 2. Incomplete reaction or reactants-only: TRIGGER AI AUTO-COMPLETE!
    let match = window.resolveReactionFromPrompt ? window.resolveReactionFromPrompt(eq) : null;
    if (match) {
        disp.innerText = match.equation;
        let res = window.validateAndSolveEquation ? window.validateAndSolveEquation(match.equation) : null;
        window.validSandboxLevel = {
            valid: true,
            title: match.title,
            equation: match.equation,
            balancedString: (res && res.balancedString) || match.balancedString,
            reactants: (res && res.reactants) || match.reactants,
            products: (res && res.products) || match.products,
            coefficients: (res && { react: res.reactCoeffs, prod: res.prodCoeffs }) || match.coefficients,
            difficulty: match.difficulty || "Custom Level"
        };
        localStorage.setItem('stoich_custom_sandbox', JSON.stringify(window.validSandboxLevel));
        localStorage.setItem('stoich_sandbox_level', match.equation);

        feedback.style.display = 'block';
        feedback.style.background = '#ecfdf5';
        feedback.style.color = '#065f46';
        feedback.style.border = '2px solid #10b981';
        feedback.innerHTML = `✨ <b>AI Auto-Completed:</b> Identified <b>${match.title}</b>! Balanced: <b>${window.validSandboxLevel.balancedString}</b>`;

        if (typeof window.setVkBtnToSaveMode === 'function') {
            window.setVkBtnToSaveMode();
        }
        return;
    }

    // 3. Fallback error
    feedback.style.display = 'block';
    feedback.style.background = '#fef2f2';
    feedback.style.color = '#b91c1c';
    feedback.style.border = '2px solid #ef4444';
    feedback.innerHTML = `❌ <b>Could not balance:</b> Provide reactants and products with an arrow (e.g. <code>H₂ + O₂ → H₂O</code>) or type recognized formulas (e.g. <code>Mg + O₂</code>).`;
    if (typeof window.setVkBtnToCheckMode === 'function') {
        window.setVkBtnToCheckMode();
    }
};

window.vkLaunchGame = function() {
    if(typeof window.playSound==="function") window.playSound("start");
    document.getElementById('sandbox-virtual-modal').style.display = 'none';
    let nameParam = encodeURIComponent(document.getElementById('player-name').value.trim() || 'Student');
    let eqParam = encodeURIComponent((window.validSandboxLevel && window.validSandboxLevel.equation) || 'H2 + O2 -> H2O');
    window.transitionTo(`game.html?level=sandbox&name=${nameParam}&eq=${eqParam}`);
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



// ==========================================
// CHALLENGE BRIEFING & STATS SYSTEM
// ==========================================
window.challengeBriefingConfig = {
    tier: 'easy',
    player: 'Student',
    scale: 'on',
    hints: '1',
    timer: 'stopwatch'
};

window.openChallengeBriefingModal = function(tier, playerName) {
    if (typeof playSound === 'function') playSound('pop');
    let tierClean = (tier || 'Easy').toLowerCase();
    window.challengeBriefingConfig.tier = tierClean;
    window.challengeBriefingConfig.player = playerName || localStorage.getItem('currentPlayer') || 'Student';
    
    let titleEl = document.getElementById('briefing-tier-title');
    if (titleEl) titleEl.innerText = `${tierClean.toUpperCase()} CHALLENGE`;
    
    // Look up personal best
    let history = JSON.parse(localStorage.getItem('challengeHistory_' + window.challengeBriefingConfig.player) || '[]');
    let tierHistory = history.filter(h => h.tier && h.tier.toLowerCase() === tierClean);
    let bestEl = document.getElementById('briefing-best-record');
    if (bestEl) {
        if (tierHistory.length > 0) {
            let fastest = tierHistory.reduce((prev, curr) => (prev.timeSec < curr.timeSec ? prev : curr));
            bestEl.innerHTML = `🏆 Personal Best: <b>${fastest.timeStr || (fastest.timeSec + 's')}</b> (${'⭐'.repeat(fastest.stars || 3)})`;
        } else {
            bestEl.innerHTML = `🏆 Personal Best: None logged yet`;
        }
    }
    
    if (typeof window.switchChallengeDesign === 'function') {
        window.switchChallengeDesign(window.activeChallengeDesign || 'puzzle', true);
    } else {
        window.updateBriefingToggleUI();
    }
    
    let modal = document.getElementById('challenge-briefing-modal');
    if (modal) modal.style.display = 'flex';
};

window.closeChallengeBriefingModal = function() {
    if (typeof playSound === 'function') playSound('click');
    let modal = document.getElementById('challenge-briefing-modal');
    if (modal) modal.style.display = 'none';
    const btn = document.getElementById('main-play-btn');
    if (btn) {
        btn.style.transform = '';
        btn.style.boxShadow = '';
    }
};

window.toggleBriefingSetting = function(type) {
    if (typeof playSound === 'function') playSound('select');
    if (type === 'scale') {
        window.challengeBriefingConfig.scale = window.challengeBriefingConfig.scale === 'on' ? 'off' : 'on';
    } else if (type === 'hints') {
        window.challengeBriefingConfig.hints = window.challengeBriefingConfig.hints === '1' ? '0' : '1';
    } else if (type === 'timer') {
        window.challengeBriefingConfig.timer = window.challengeBriefingConfig.timer === 'stopwatch' ? 'countdown' : 'stopwatch';
    }
    window.updateBriefingToggleUI();
};

window.activeChallengeDesign = 'puzzle';

window.switchChallengeDesign = function(letter, silent) {
    window.activeChallengeDesign = letter;
    if (!silent && typeof playSound === 'function') playSound('select');
    
    ['puzzle', 'hybrid', 'b', 'old', 'a', 'c'].forEach(l => {
        let pill = document.getElementById('dpill-' + l);
        let view = document.getElementById('design-view-' + l);
        if (pill) {
            if (l === letter) pill.classList.add('active');
            else pill.classList.remove('active');
        }
        if (view) {
            if (l === letter) {
                view.style.display = (l === 'a') ? 'grid' : 'flex';
            } else {
                view.style.display = 'none';
            }
        }
    });
    
    window.updateBriefingToggleUI();
};

window.updateBriefingToggleUI = function() {
    let tierClean = (window.challengeBriefingConfig.tier || 'easy').toLowerCase();
    let tierUpper = tierClean.toUpperCase();
    
    // Update Greeting Player Name
    let currentPName = window.challengeBriefingConfig.player || localStorage.getItem('currentPlayer') || 'Student';
    let puzPNameEl = document.getElementById('puz-player-name');
    if (puzPNameEl) puzPNameEl.innerText = currentPName;

    // 1. Update Tier Badges & Titles across all designs
    document.querySelectorAll('.all-tier-pill').forEach(el => {
        el.innerText = `${tierUpper} CHALLENGE`;
        if (tierClean === 'hard') el.style.background = '#ef4444';
        else if (tierClean === 'medium') el.style.background = '#f59e0b';
        else el.style.background = '#8b5cf6';
    });
    
    document.querySelectorAll('.all-tier-title').forEach(el => {
        if (el.closest('#design-view-c')) {
            el.innerText = `${tierUpper} CHALLENGE`;
        } else if (el.closest('#design-view-puzzle')) {
            el.innerText = `${tierUpper} CHALLENGE`;
        } else {
            el.innerText = tierClean === 'hard' ? 'Master Stoichiometry' : (tierClean === 'medium' ? 'Reaction Specialist' : 'Chemical Gauntlet');
        }
    });
    
    // 2. Update Personal Best
    let history = JSON.parse(localStorage.getItem('challengeHistory_' + window.challengeBriefingConfig.player) || '[]');
    let tierHistory = history.filter(h => h.tier && h.tier.toLowerCase() === tierClean);
    let bestStr = 'None yet';
    if (tierHistory.length > 0) {
        let fastest = tierHistory.reduce((prev, curr) => (prev.timeSec < curr.timeSec ? prev : curr));
        bestStr = `${fastest.timeStr || (fastest.timeSec + 's')} (${'⭐'.repeat(fastest.stars || 3)})`;
    }
    document.querySelectorAll('.all-best-record').forEach(el => {
        el.innerText = bestStr;
    });

    let scaleOn = window.challengeBriefingConfig.scale === 'on';
    let hintsOn = window.challengeBriefingConfig.hints === '1';
    let isStopwatch = window.challengeBriefingConfig.timer === 'stopwatch';

    // -------------------------------------------------------------
    // SCALE SWITCHES (DESIGNS PUZZLE, HYBRID, B, OLD, A, C)
    // -------------------------------------------------------------
    ['.dpuz-scale-track', '.dhy-scale-track', '.db-scale-track', '.dold-scale-track', '.da-scale-track', '.dc-scale-track'].forEach(sel => {
        let track = document.querySelector(sel);
        if (track) track.style.background = scaleOn ? '#22c55e' : '#94a3b8';
    });
    ['.dpuz-scale-knob', '.dhy-scale-knob', '.db-scale-knob', '.dold-scale-knob', '.da-scale-knob', '.dc-scale-knob'].forEach(sel => {
        let knob = document.querySelector(sel);
        if (knob) knob.style.transform = scaleOn ? 'translateX(30px)' : 'translateX(0px)';
    });
    document.querySelectorAll('.all-scale-exp').forEach(el => {
        el.innerHTML = scaleOn 
            ? 'Live 3D balance scale active. Turn OFF for the <b>Mental Math</b> badge.' 
            : '<b style="color:#7e22ce;">Scale hidden!</b> Mental Math mode enabled.';
    });
    // Puzzle badge & banner
    let puzScaleBadge = document.getElementById('puz-scale-badge');
    if (puzScaleBadge) {
        puzScaleBadge.innerText = scaleOn ? 'ACTIVE' : 'MENTAL MATH 🧠';
        puzScaleBadge.style.background = scaleOn ? '#16a34a' : '#7e22ce';
    }
    let puzScaleBanner = document.getElementById('puz-scale-banner');
    if (puzScaleBanner) {
        puzScaleBanner.innerText = scaleOn ? '✔ SCALE ACTIVE' : '🧠 MENTAL MATH (+BONUS)';
        puzScaleBanner.style.background = scaleOn ? '#10b981' : '#7e22ce';
        puzScaleBanner.style.color = 'white';
    }
    ['dhy-scale-tag', 'db-scale-tag'].forEach(id => {
        let tag = document.getElementById(id);
        if (tag) {
            tag.innerText = scaleOn ? 'ACTIVE' : 'MENTAL MATH 🧠';
            tag.style.background = scaleOn ? '#dcfce7' : '#f3e8ff';
            tag.style.color = scaleOn ? '#16a34a' : '#7e22ce';
            tag.style.borderColor = scaleOn ? '#16a34a' : '#7e22ce';
        }
    });

    // -------------------------------------------------------------
    // HINTS SWITCHES (DESIGNS PUZZLE, HYBRID, B, OLD, A, C)
    // -------------------------------------------------------------
    ['.dpuz-hints-track', '.dhy-hints-track', '.db-hints-track', '.dold-hints-track', '.da-hints-track', '.dc-hints-track'].forEach(sel => {
        let track = document.querySelector(sel);
        if (track) track.style.background = hintsOn ? '#3b82f6' : '#94a3b8';
    });
    ['.dpuz-hints-knob', '.dhy-hints-knob', '.db-hints-knob', '.dold-hints-knob', '.da-hints-knob', '.dc-hints-knob'].forEach(sel => {
        let knob = document.querySelector(sel);
        if (knob) knob.style.transform = hintsOn ? 'translateX(30px)' : 'translateX(0px)';
    });
    document.querySelectorAll('.all-hints-exp').forEach(el => {
        el.innerHTML = hintsOn 
            ? '1 emergency hint token allowed. Turn OFF for the <b>Solo Chemist</b> badge.' 
            : '<b style="color:#2563eb;">Hints disabled!</b> Solo Chemist mode active.';
    });
    // Puzzle hints badge & banner
    let puzHintsBadge = document.getElementById('puz-hints-badge');
    if (puzHintsBadge) {
        puzHintsBadge.innerText = hintsOn ? '1 TOKEN' : 'SOLO RUN 🎓';
        puzHintsBadge.style.background = hintsOn ? '#3b82f6' : '#64748b';
    }
    let puzHintsBanner = document.getElementById('puz-hints-banner');
    if (puzHintsBanner) {
        puzHintsBanner.innerText = hintsOn ? '✔ 1 HINT READY' : '🎓 SOLO CHEMIST (+BONUS)';
        puzHintsBanner.style.background = hintsOn ? '#3b82f6' : '#64748b';
        puzHintsBanner.style.color = 'white';
    }
    ['dhy-hints-tag', 'db-hints-tag'].forEach(id => {
        let tag = document.getElementById(id);
        if (tag) {
            tag.innerText = hintsOn ? '1 TOKEN' : 'SOLO RUN 🎓';
            tag.style.background = hintsOn ? '#dbeafe' : '#f1f5f9';
            tag.style.color = hintsOn ? '#2563eb' : '#64748b';
            tag.style.borderColor = hintsOn ? '#2563eb' : '#64748b';
        }
    });

    // -------------------------------------------------------------
    // TIMER SWITCHES (DESIGNS PUZZLE, HYBRID, B, OLD, A, C)
    // -------------------------------------------------------------
    ['.dpuz-timer-track', '.dhy-timer-track', '.db-timer-track', '.dold-timer-track', '.da-timer-track', '.dc-timer-track'].forEach(sel => {
        let track = document.querySelector(sel);
        if (track) track.style.background = isStopwatch ? '#8b5cf6' : '#f59e0b';
    });
    ['.dpuz-timer-knob', '.dhy-timer-knob', '.db-timer-knob', '.dold-timer-knob', '.da-timer-knob', '.dc-timer-knob'].forEach(sel => {
        let knob = document.querySelector(sel);
        if (knob) knob.style.transform = isStopwatch ? 'translateX(0px)' : 'translateX(30px)';
    });
    document.querySelectorAll('.all-timer-title').forEach(el => {
        el.innerText = isStopwatch ? 'Timer: Stopwatch' : 'Timer: 90s Countdown';
    });
    document.querySelectorAll('.all-timer-exp').forEach(el => {
        el.innerHTML = isStopwatch 
            ? 'Stopwatch tracks fastest time. Switch for <b>90s Arcade Rush</b>.' 
            : '<b style="color:#d97706;">Arcade Rush!</b> 90 seconds to balance all 5.';
    });
    // Puzzle timer badge & banner
    let puzTimerBadge = document.getElementById('puz-timer-badge');
    if (puzTimerBadge) {
        puzTimerBadge.innerText = isStopwatch ? 'STOPWATCH' : '90s RUSH ⏳';
        puzTimerBadge.style.background = isStopwatch ? '#8b5cf6' : '#f59e0b';
    }
    let puzTimerBanner = document.getElementById('puz-timer-banner');
    if (puzTimerBanner) {
        puzTimerBanner.innerText = isStopwatch ? '⏱️ STOPWATCH SPEEDRUN' : '⏳ 90s COUNTDOWN RUSH';
        puzTimerBanner.style.background = isStopwatch ? '#8b5cf6' : '#f59e0b';
        puzTimerBanner.style.color = 'white';
    }
    ['dhy-timer-tag', 'db-timer-tag'].forEach(id => {
        let tag = document.getElementById(id);
        if (tag) {
            tag.innerText = isStopwatch ? 'STOPWATCH' : '90s COUNTDOWN ⏳';
            tag.style.background = isStopwatch ? '#f3e8ff' : '#fef3c7';
            tag.style.color = isStopwatch ? '#7e22ce' : '#d97706';
            tag.style.borderColor = isStopwatch ? '#7e22ce' : '#d97706';
        }
    });
};

window.launchChallengeFromBriefing = function() {
    if (typeof playSound === 'function') playSound('start');
    let c = window.challengeBriefingConfig;
    let url = `game.html?mode=challenge&tier=${encodeURIComponent(c.tier)}&scale=${c.scale}&hints=${c.hints}&timer=${c.timer}&name=${encodeURIComponent(c.player)}`;
    window.transitionTo(url);
};

// ==========================================
// STATS & BADGES MODAL LOGIC (REDESIGNED)
// ==========================================
window.openStatsModal = function() {
    if (typeof playSound === 'function') playSound('pop');
    let currentPlayer = localStorage.getItem('currentPlayer') || (document.getElementById('player-name') ? document.getElementById('player-name').value.trim() : '') || 'Student';
    let profileEl = document.getElementById('stats-profile-name');
    if (profileEl) profileEl.innerText = currentPlayer;
    
    window.renderMatchHistory(currentPlayer);
    window.renderBadges(currentPlayer);
    window.switchStatsTab('history');
    
    let modal = document.getElementById('challenge-stats-modal');
    if (modal) modal.style.display = 'flex';
};

window.closeStatsModal = function() {
    if (typeof playSound === 'function') playSound('click');
    let modal = document.getElementById('challenge-stats-modal');
    if (modal) modal.style.display = 'none';
};

window.switchStatsTab = function(tab) {
    if (typeof playSound === 'function') playSound('tactile');
    let tabHist = document.getElementById('stats-tab-history');
    let tabBadge = document.getElementById('stats-tab-badges');
    let btnHist = document.getElementById('tab-btn-history');
    let btnBadge = document.getElementById('tab-btn-badges');
    
    if (tab === 'history') {
        if (tabHist) tabHist.style.display = 'block';
        if (tabBadge) tabBadge.style.display = 'none';
        if (btnHist) btnHist.classList.add('active');
        if (btnBadge) btnBadge.classList.remove('active');
    } else {
        if (tabHist) tabHist.style.display = 'none';
        if (tabBadge) tabBadge.style.display = 'block';
        if (btnBadge) btnBadge.classList.add('active');
        if (btnHist) btnHist.classList.remove('active');
    }
};

window.activeHistoryFilter = 'all';

window.setMatchHistoryFilter = function(filter) {
    if (typeof playSound === 'function') playSound('click');
    window.activeHistoryFilter = filter;
    document.querySelectorAll('.stats-filter-btn').forEach(btn => btn.classList.remove('active'));
    let activeBtn = document.getElementById('filter-btn-' + filter);
    if (activeBtn) activeBtn.classList.add('active');
    
    let currentPlayer = localStorage.getItem('currentPlayer') || (document.getElementById('player-name') ? document.getElementById('player-name').value.trim() : '') || 'Student';
    window.renderMatchHistory(currentPlayer, filter);
};

window.renderMatchHistory = function(player, filter = window.activeHistoryFilter || 'all') {
    let container = document.getElementById('history-list-container');
    let countPill = document.getElementById('history-count-pill');
    if (!container) return;
    
    let history = JSON.parse(localStorage.getItem('challengeHistory_' + player) || '[]');
    if (countPill) countPill.innerText = history.length;
    
    if (history.length === 0) {
        container.innerHTML = `
            <div class="stats-empty-state">
                <div class="empty-state-icon">
                    <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                    </svg>
                </div>
                <div class="empty-state-title">No Challenge Attempts Yet</div>
                <div class="empty-state-desc">Select a difficulty on the home screen and launch a run to log your best times and multiplier ranks here.</div>
            </div>
        `;
        return;
    }

    // Apply Filter
    let filteredHistory = filter === 'all' 
        ? history 
        : history.filter(h => (h.tier || 'easy').toLowerCase() === filter.toLowerCase());

    // Compute Metrics based on filtered history (supporting both completed and timeout runs)
    let totalRuns = filteredHistory.length;
    let completedRuns = filteredHistory.filter(h => h.status !== 'timeout');
    let failCount = filteredHistory.filter(h => h.status === 'timeout').length;
    let clearRate = totalRuns > 0 ? Math.round((completedRuns.length / totalRuns) * 100) : 100;

    let bestTimeSec = completedRuns.length > 0 ? Math.min(...completedRuns.map(h => h.timeSec || 9999)) : null;
    let bestRun = bestTimeSec !== null ? completedRuns.find(h => h.timeSec === bestTimeSec) : null;
    let bestTimeStr = bestRun ? (bestRun.timeStr || (bestRun.timeSec + 's')) : '--';
    let bestTierLabel = bestRun ? (bestRun.tier || 'Easy').toUpperCase() : (filter !== 'all' ? filter.toUpperCase() : 'EASY');
    
    let totalStars = filteredHistory.reduce((acc, h) => acc + (h.stars !== undefined ? h.stars : 3), 0);
    let maxStars = totalRuns * 3;
    let avgStars = totalRuns > 0 ? (totalStars / totalRuns) : 0;
    let rankTierName = avgStars >= 2.8 ? 'Gold Rank Tier' : (avgStars >= 2.0 ? 'Silver Rank Tier' : 'Bronze Rank Tier');
    
    let precisionRate = clearRate;
    let equationsBalanced = filteredHistory.reduce((sum, h) => sum + (h.roundsCleared !== undefined ? h.roundsCleared : 5), 0);
    
    let summaryHtml = `
        <div class="career-kpi-grid-4">
            <!-- 1. TOTAL RUNS -->
            <div class="kpi-stat-card">
                <div class="kpi-card-top">
                    <span class="kpi-card-label">TOTAL RUNS</span>
                    <div class="kpi-icon-pill kpi-icon-runs">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                            <line x1="4" y1="22" x2="4" y2="15"/>
                        </svg>
                    </div>
                </div>
                <div class="kpi-card-middle">
                    <span class="kpi-val-number">${totalRuns}</span>
                </div>
                <div class="kpi-card-bottom">
                    <span><span class="kpi-sub-dot" style="${clearRate < 100 ? 'background:#ef4444;' : ''}"></span>${clearRate}% Clear Rate</span>
                </div>
            </div>

            <!-- 2. FASTEST CLEAR -->
            <div class="kpi-stat-card">
                <div class="kpi-card-top">
                    <span class="kpi-card-label">FASTEST CLEAR</span>
                    <div class="kpi-icon-pill kpi-icon-time">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                    </div>
                </div>
                <div class="kpi-card-middle">
                    <span class="kpi-val-number kpi-val-purple">${bestTimeStr}</span>
                </div>
                <div class="kpi-card-bottom">
                    <span><span class="kpi-sub-pill">${bestTierLabel}</span>Personal Best</span>
                </div>
            </div>

            <!-- 3. STARS EARNED -->
            <div class="kpi-stat-card">
                <div class="kpi-card-top">
                    <span class="kpi-card-label">STARS EARNED</span>
                    <div class="kpi-icon-pill kpi-icon-stars">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/>
                        </svg>
                    </div>
                </div>
                <div class="kpi-card-middle">
                    <span class="kpi-val-number kpi-val-gold">★ ${totalStars}</span>
                    <span class="kpi-val-denom">/${maxStars || 0}</span>
                </div>
                <div class="kpi-card-bottom">
                    <span class="kpi-rank-badge">✨ ${rankTierName}</span>
                </div>
            </div>

            <!-- 4. PRECISION RATE -->
            <div class="kpi-stat-card">
                <div class="kpi-card-top">
                    <span class="kpi-card-label">PRECISION RATE</span>
                    <div class="kpi-icon-pill kpi-icon-precision">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <circle cx="12" cy="12" r="6"/>
                            <circle cx="12" cy="12" r="2"/>
                        </svg>
                    </div>
                </div>
                <div class="kpi-card-middle">
                    <span class="kpi-val-number kpi-val-emerald">${precisionRate}<span class="kpi-val-unit">%</span></span>
                </div>
                <div class="kpi-card-bottom">
                    <span>${equationsBalanced} Eq Balanced</span>
                    <span style="${failCount > 0 ? 'color:#ef4444; font-weight:900;' : 'color:#64748b;'}">${failCount} Fail${failCount === 1 ? '' : 's'}</span>
                </div>
            </div>
        </div>

        <div class="match-logs-header">
            <span class="match-logs-title">Completed Match Logs</span>
            <span class="match-logs-count-pill">${filteredHistory.length} Record${filteredHistory.length === 1 ? '' : 's'}</span>
        </div>
    `;
    
    let sorted = [...filteredHistory].reverse();
    let rowsHtml = '<div class="match-history-list">';
    
    sorted.forEach((run) => {
        let isTimeout = run.status === 'timeout';
        let starSvgs = '';
        if (isTimeout) {
            let emptyStar = '<svg viewBox="0 0 24 24" width="20" height="20" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
            starSvgs = Array(3).fill(emptyStar).join('');
        } else {
            let starsCount = run.stars !== undefined ? run.stars : 3;
            let starSvg = '<svg viewBox="0 0 24 24" width="20" height="20" fill="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
            starSvgs = Array(starsCount).fill(starSvg).join('');
        }

        let tier = (run.tier || 'easy').toLowerCase();
        let tierClass = tier === 'hard' ? 'tier-pill-hard' : (tier === 'medium' ? 'tier-pill-medium' : 'tier-pill-easy');
        
        let modsCount = 0;
        if (run.scale === 'off') modsCount++;
        if (run.hints === '0') modsCount++;
        if (run.timer === 'countdown') modsCount++;
        
        let rankLabel = 'STANDARD';
        let rankClass = 'rank-pill-standard';
        let rankBonus = '1.0x';
        
        if (isTimeout) {
            rankLabel = `OVERHEATED (${run.roundsCleared || 0}/5)`;
            rankClass = 'rank-pill-overheated';
            rankBonus = 'FAILED';
        } else if (modsCount >= 3) {
            rankLabel = 'LEGENDARY';
            rankClass = 'rank-pill-legendary';
            rankBonus = '+1.5x';
        } else if (modsCount === 2) {
            rankLabel = 'EXPERT';
            rankClass = 'rank-pill-expert';
            rankBonus = '+1.0x';
        } else if (modsCount === 1) {
            rankLabel = 'VETERAN';
            rankClass = 'rank-pill-veteran';
            rankBonus = '+0.5x';
        }

        let rankPillHtml = isTimeout
            ? `<span class="match-rank-pill" style="background:#fee2e2 !important; color:#991b1b !important; border-color:#ef4444 !important;">${rankLabel}</span>`
            : `<span class="match-rank-pill ${rankClass}">${rankLabel} <span class="rank-bonus-sub">(${rankBonus})</span></span>`;

        let timeBadgeHtml = isTimeout
            ? `<div class="match-time-badge" style="border-color:#ef4444 !important; color:#dc2626 !important; background:#fef2f2 !important; box-shadow:0 3px 0 #b91c1c !important;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span class="match-time-number">${run.timeStr || '90s (Failed)'}</span>
               </div>`
            : `<div class="match-time-badge">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="13" r="8"/>
                    <path d="M12 9v4l2 2"/>
                    <path d="M10 2h4"/>
                </svg>
                <span class="match-time-number">${run.timeStr || (run.timeSec + 's')}</span>
               </div>`;
        
        rowsHtml += `
    <div class="match-run-card ${isTimeout ? 'match-card-timeout' : ''}">
        <div class="match-left-group">
            <span class="match-tier-pill ${tierClass}">${tier}</span>
            ${rankPillHtml}
        </div>
        
        <div class="match-center-date">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>${run.date || 'Recent Attempt'}</span>
        </div>
        
        <div class="match-right-group">
            <div class="match-stars-display">${starSvgs}</div>
            ${timeBadgeHtml}
        </div>
    </div>
`;
    });
    
    rowsHtml += '</div>';
    container.innerHTML = summaryHtml + rowsHtml;
};

window.renderBadges = function(player) {
    let container = document.getElementById('badges-grid-container');
    let countEl = document.getElementById('badges-count-text');
    if (!container) return;
    
    let unlocked = JSON.parse(localStorage.getItem('challengeBadges_' + player) || '[]');
    let allBadges = window.CHALLENGE_BADGES || [];
    
    if (countEl) countEl.innerText = `${unlocked.length}/${allBadges.length}`;
    
    let pct = allBadges.length > 0 ? Math.round((unlocked.length / allBadges.length) * 100) : 0;
    
    let bannerHtml = `
        <div class="badges-progress-banner">
            <div class="badges-banner-row">
                <span>Achievements Unlocked: <b>${unlocked.length} of ${allBadges.length}</b></span>
                <span><b>${pct}%</b></span>
            </div>
            <div class="badges-bar-track">
                <div class="badges-bar-fill" style="width: ${pct}%;"></div>
            </div>
        </div>
    `;
    
    let gridHtml = '<div class="badges-showcase-grid">';
    allBadges.forEach(b => {
        let isUnlocked = unlocked.includes(b.id);
        let cardClass = isUnlocked ? 'badge-trophy-card is-unlocked' : 'badge-trophy-card is-locked';
        let iconBg = isUnlocked ? (b.color ? b.color + '20' : '#f3e8ff') : '#f1f5f9';
        let iconBorder = isUnlocked ? (b.color || '#1e293b') : '#cbd5e1';
        let statusIndicator = isUnlocked 
            ? `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` 
            : `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
        
        gridHtml += `
            <div class="${cardClass}">
                <div class="badge-trophy-icon-box" style="background:${iconBg}; border-color:${iconBorder};">
                    ${b.icon}
                </div>
                <div class="badge-trophy-content">
                    <div class="badge-trophy-header">
                        <span class="badge-trophy-title">${b.name}</span>
                        ${statusIndicator}
                    </div>
                    <div class="badge-trophy-desc">${b.desc}</div>
                </div>
            </div>
        `;
    });
    gridHtml += '</div>';
    
    container.innerHTML = bannerHtml + gridHtml;
};

/* ========================================================
   TOP FLOATING TYPING BAR ENGINE (OPTION 2)
======================================================== */
window.handlePlayerNameClick = function(e) {
    const isTouchOrTablet = ('ontouchstart' in window) || 
                            (navigator.maxTouchPoints > 0) || 
                            (window.innerWidth <= 1280 && window.innerHeight <= 900);
    if (isTouchOrTablet) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const inp = document.getElementById('player-name');
        if (inp) inp.blur();
        window.openTopTypingBar();
        return false;
    }
    if (typeof window.showProfileDropdown === 'function') {
        window.showProfileDropdown();
    }
};

window.handlePlayerNameFocus = function(e) {
    const isTouchOrTablet = ('ontouchstart' in window) || 
                            (navigator.maxTouchPoints > 0) || 
                            (window.innerWidth <= 1280 && window.innerHeight <= 900);
    if (isTouchOrTablet) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const inp = document.getElementById('player-name');
        if (inp) inp.blur();
        window.openTopTypingBar();
        return;
    }
    if (typeof window.showProfileDropdown === 'function') {
        window.showProfileDropdown();
    }
};

window.openTopTypingBar = function() {
    const overlay = document.getElementById('top-typing-bar-overlay');
    const topInput = document.getElementById('top-typing-input');
    const mainInput = document.getElementById('player-name');
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) dropdown.style.display = 'none';

    if (!overlay || !topInput) return;

    if (typeof window.playSound === 'function') window.playSound('click');
    topInput.value = mainInput ? mainInput.value : '';

    window.renderTopTypingChips();

    overlay.style.display = 'flex';
    setTimeout(() => {
        topInput.focus();
        topInput.select();
    }, 60);
};

window.confirmTopTypingName = function() {
    const overlay = document.getElementById('top-typing-bar-overlay');
    const topInput = document.getElementById('top-typing-input');
    const mainInput = document.getElementById('player-name');
    if (!topInput || !mainInput) return;

    let val = topInput.value.trim();
    if (!val) {
        if (typeof goofyNames !== 'undefined' && goofyNames.length) {
            val = goofyNames[Math.floor(Math.random() * goofyNames.length)];
        } else {
            val = 'Student';
        }
    }

    mainInput.value = val;
    localStorage.setItem('currentPlayer', val);

    let profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    if (!profiles.includes(val)) {
        profiles.push(val);
        localStorage.setItem('profiles', JSON.stringify(profiles));
        if (typeof window.checkPlayerDropdownVisibility === 'function') {
            window.checkPlayerDropdownVisibility();
        }
    }

    if (typeof window.playSound === 'function') window.playSound('success');
    if (overlay) overlay.style.display = 'none';
};

window.closeTopTypingBar = function() {
    const overlay = document.getElementById('top-typing-bar-overlay');
    if (overlay) overlay.style.display = 'none';
    if (typeof window.playSound === 'function') window.playSound('click');
};

window.randomizeTopTypingName = function() {
    const topInput = document.getElementById('top-typing-input');
    if (!topInput || typeof goofyNames === 'undefined') return;
    const rand = goofyNames[Math.floor(Math.random() * goofyNames.length)];
    topInput.value = rand;
    if (typeof window.playSound === 'function') window.playSound('select');
    topInput.focus();
};

window.renderTopTypingChips = function() {
    const container = document.getElementById('top-typing-chips');
    if (!container) return;
    container.innerHTML = '<span class="typing-chip-label">Quick Picks:</span>';

    let profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    let chips = profiles.slice(-2);
    
    if (typeof goofyNames !== 'undefined') {
        for (let name of goofyNames) {
            if (chips.length >= 4) break;
            if (!chips.includes(name)) chips.push(name);
        }
    }

    chips.forEach(name => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'typing-chip interactive';
        btn.innerText = name;
        btn.onclick = () => {
            const topInput = document.getElementById('top-typing-input');
            if (topInput) {
                topInput.value = name;
                if (typeof window.playSound === 'function') window.playSound('select');
                topInput.focus();
            }
        };
        container.appendChild(btn);
    });
};

// Wire up Enter and Escape on top typing input
document.addEventListener('DOMContentLoaded', () => {
    const topInput = document.getElementById('top-typing-input');
    if (topInput) {
        topInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                window.confirmTopTypingName();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                window.closeTopTypingBar();
            }
        });
    }
});


// ==========================================
// 🤖 AI REACTION & LEVEL GENERATION ENGINE
// ==========================================

const AI_REACTION_DATABASE = [
    {
        title: "Water Synthesis",
        aliases: ["water", "water synthesis", "making water", "h2 + o2", "hydrogen oxygen"],
        reactants: ["H2", "O2"],
        products: ["H2O"],
        equation: "H2 + O2 -> H2O",
        balancedString: "2H2 + O2 -> 2H2O",
        coefficients: { react: [2, 1], prod: [2] },
        difficulty: "Easy (Form 4)",
        minoh: "O -> H (Balance Oxygen first by adding H2O, then balance Hydrogen with H2)"
    },
    {
        title: "Combustion of Methane",
        aliases: ["methane", "burning methane", "ch4 + o2", "natural gas", "hydrocarbon combustion"],
        reactants: ["CH4", "O2"],
        products: ["CO2", "H2O"],
        equation: "CH4 + O2 -> CO2 + H2O",
        balancedString: "CH4 + 2O2 -> CO2 + 2H2O",
        coefficients: { react: [1, 2], prod: [1, 2] },
        difficulty: "Medium (Form 4)",
        minoh: "C -> H -> O (Balance Carbon, then Hydrogen, and finally pure Oxygen)"
    },
    {
        title: "Combustion of Propane",
        aliases: ["propane", "burning propane", "c3h8 + o2", "lpg gas"],
        reactants: ["C3H8", "O2"],
        products: ["CO2", "H2O"],
        equation: "C3H8 + O2 -> CO2 + H2O",
        balancedString: "C3H8 + 5O2 -> 3CO2 + 4H2O",
        coefficients: { react: [1, 5], prod: [3, 4] },
        difficulty: "Hard (Form 5)",
        minoh: "C -> H -> O (Balance 3 Carbons, 8 Hydrogens to 4 H2O, then tally 10 Oxygens to 5 O2)"
    },
    {
        title: "Rusting of Iron",
        aliases: ["rust", "rusting", "rusting iron", "fe + o2", "iron oxidation"],
        reactants: ["Fe", "O2"],
        products: ["Fe2O3"],
        equation: "Fe + O2 -> Fe2O3",
        balancedString: "4Fe + 3O2 -> 2Fe2O3",
        coefficients: { react: [4, 3], prod: [2] },
        difficulty: "Medium (Form 4)",
        minoh: "Fe -> O (Use common multiple 6 for Oxygen atoms: 3 O2 and 2 Fe2O3, then 4 Fe)"
    },
    {
        title: "Haber Process (Ammonia Synthesis)",
        aliases: ["haber", "haber process", "ammonia", "making ammonia", "n2 + h2", "nitrogen hydrogen"],
        reactants: ["N2", "H2"],
        products: ["NH3"],
        equation: "N2 + H2 -> NH3",
        balancedString: "N2 + 3H2 -> 2NH3",
        coefficients: { react: [1, 3], prod: [2] },
        difficulty: "Easy (Form 4)",
        minoh: "N -> H (Balance 2 Nitrogens with 2 NH3, then 6 Hydrogens with 3 H2)"
    },
    {
        title: "Photosynthesis",
        aliases: ["photosynthesis", "glucose synthesis", "plant food", "co2 + h2o", "carbon dioxide and water"],
        reactants: ["CO2", "H2O"],
        products: ["C6H12O6", "O2"],
        equation: "CO2 + H2O -> C6H12O6 + O2",
        balancedString: "6CO2 + 6H2O -> C6H12O6 + 6O2",
        coefficients: { react: [6, 6], prod: [1, 6] },
        difficulty: "Hard (Form 5)",
        minoh: "C -> H -> O (Balance 6 Carbons, 12 Hydrogens, then tally 18 Oxygens)"
    },
    {
        title: "Acid-Base Neutralization",
        aliases: ["neutralization", "hcl + naoh", "acid base", "hydrochloric acid and sodium hydroxide"],
        reactants: ["HCl", "NaOH"],
        products: ["NaCl", "H2O"],
        equation: "HCl + NaOH -> NaCl + H2O",
        balancedString: "HCl + NaOH -> NaCl + H2O",
        coefficients: { react: [1, 1], prod: [1, 1] },
        difficulty: "Easy (Form 4)",
        minoh: "Na -> Cl -> H -> O (Already balanced in 1:1:1:1 ratio)"
    },
    {
        title: "Sulfuric Acid Neutralization",
        aliases: ["sulfuric neutralization", "h2so4 + naoh", "battery acid neutralization"],
        reactants: ["H2SO4", "NaOH"],
        products: ["Na2SO4", "H2O"],
        equation: "H2SO4 + NaOH -> Na2SO4 + H2O",
        balancedString: "H2SO4 + 2NaOH -> Na2SO4 + 2H2O",
        coefficients: { react: [1, 2], prod: [1, 2] },
        difficulty: "Medium (Form 4)",
        minoh: "Na -> S -> H -> O (Balance 2 Sodiums with 2 NaOH, then 4 Hydrogens with 2 H2O)"
    },
    {
        title: "Zinc in Hydrochloric Acid",
        aliases: ["zinc and acid", "zn + hcl", "zinc acid", "hydrogen gas generation"],
        reactants: ["Zn", "HCl"],
        products: ["ZnCl2", "H2"],
        equation: "Zn + HCl -> ZnCl2 + H2",
        balancedString: "Zn + 2HCl -> ZnCl2 + H2",
        coefficients: { react: [1, 2], prod: [1, 1] },
        difficulty: "Easy (Form 4)",
        minoh: "Zn -> Cl -> H (Balance Chlorine with 2 HCl, which balances Hydrogen)"
    },
    {
        title: "Magnesium Ribbon Combustion",
        aliases: ["magnesium", "burning magnesium", "mg + o2", "bright white flame"],
        reactants: ["Mg", "O2"],
        products: ["MgO"],
        equation: "Mg + O2 -> MgO",
        balancedString: "2Mg + O2 -> 2MgO",
        coefficients: { react: [2, 1], prod: [2] },
        difficulty: "Easy (Form 4)",
        minoh: "Mg -> O (Balance 2 Oxygens with 2 MgO, then 2 Magnesiums with 2 Mg)"
    },
    {
        title: "Thermal Decomposition of Limestone",
        aliases: ["limestone", "caco3", "calcium carbonate", "lime kiln", "quicklime"],
        reactants: ["CaCO3"],
        products: ["CaO", "CO2"],
        equation: "CaCO3 -> CaO + CO2",
        balancedString: "CaCO3 -> CaO + CO2",
        coefficients: { react: [1], prod: [1, 1] },
        difficulty: "Easy (Form 4)",
        minoh: "Ca -> C -> O (1:1:1 stoichiometric ratio)"
    },
    {
        title: "Decomposition of Potassium Chlorate",
        aliases: ["potassium chlorate", "kclo3", "oxygen lab prep"],
        reactants: ["KClO3"],
        products: ["KCl", "O2"],
        equation: "KClO3 -> KCl + O2",
        balancedString: "2KClO3 -> 2KCl + 3O2",
        coefficients: { react: [2], prod: [2, 3] },
        difficulty: "Medium (Form 4)",
        minoh: "K -> Cl -> O (Use common multiple 6 for Oxygen: 2 KClO3 and 3 O2)"
    },
    {
        title: "Copper Displacing Silver Nitrate",
        aliases: ["copper and silver nitrate", "cu + agno3", "silver tree", "single displacement"],
        reactants: ["Cu", "AgNO3"],
        products: ["Cu(NO3)2", "Ag"],
        equation: "Cu + AgNO3 -> Cu(NO3)2 + Ag",
        balancedString: "Cu + 2AgNO3 -> Cu(NO3)2 + 2Ag",
        coefficients: { react: [1, 2], prod: [1, 2] },
        difficulty: "Medium (Form 4)",
        minoh: "Cu -> Ag -> N -> O (Balance nitrate polyatomic group with 2 AgNO3 and 2 Ag)"
    },
    {
        title: "Sodium in Water",
        aliases: ["sodium and water", "na + h2o", "alkali metal reaction"],
        reactants: ["Na", "H2O"],
        products: ["NaOH", "H2"],
        equation: "Na + H2O -> NaOH + H2",
        balancedString: "2Na + 2H2O -> 2NaOH + H2",
        coefficients: { react: [2, 2], prod: [2, 1] },
        difficulty: "Medium (Form 4)",
        minoh: "Na -> O -> H (Use 2 NaOH to get even Hydrogens, then 2 H2O and 2 Na)"
    },
    {
        title: "Decomposition of Hydrogen Peroxide",
        aliases: ["elephant toothpaste", "h2o2", "hydrogen peroxide decomposition"],
        reactants: ["H2O2"],
        products: ["H2O", "O2"],
        equation: "H2O2 -> H2O + O2",
        balancedString: "2H2O2 -> 2H2O + O2",
        coefficients: { react: [2], prod: [2, 1] },
        difficulty: "Easy (Form 4)",
        minoh: "H -> O (Balance Oxygen by doubling H2O2 and H2O)"
    }
];

window.resolveReactionFromPrompt = function(promptText) {
    if (!promptText || !promptText.trim()) return null;
    const subMap = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
    let cleanPrompt = promptText.replace(/[₀-₉]/g, ch => subMap[ch] || ch);
    let text = cleanPrompt.trim().toLowerCase();
    
    // Normalize arrow separators (including unicode right arrow →)
    text = text.replace(/→/g, '->').replace(/-->/g, '->').replace(/=>/g, '->').replace(/=/g, '->');

    // 1. Exact or Alias keyword match
    for (let r of AI_REACTION_DATABASE) {
        if (text === r.title.toLowerCase()) return r;
        for (let alias of r.aliases) {
            let cleanAlias = alias.toLowerCase().replace(/→/g, '->').replace(/-->/g, '->').replace(/[₀-₉]/g, ch => subMap[ch] || ch);
            if (text === cleanAlias || text.includes(cleanAlias)) return r;
        }
    }

    // 2. Direct Equation parsing if arrow exists AND both sides have formulas
    if (text.includes('->')) {
        let parts = text.split('->');
        let reactSide = parts[0].trim();
        let prodSide = parts[1].trim();

        if (reactSide && prodSide) {
            let cleanEq = reactSide.split('+').map(s => s.trim()).filter(Boolean).join(' + ') +
                          ' -> ' +
                          prodSide.split('+').map(s => s.trim()).filter(Boolean).join(' + ');

            if (window.validateAndSolveEquation) {
                let res = window.validateAndSolveEquation(cleanEq);
                if (res && res.valid) {
                    return {
                        title: "Custom AI Reaction",
                        aliases: [],
                        reactants: res.reactants,
                        products: res.products,
                        equation: res.equation,
                        balancedString: res.balancedString,
                        coefficients: { react: res.reactCoeffs, prod: res.prodCoeffs },
                        difficulty: "Custom Level",
                        minoh: "Follow MINOH: Metals -> Polyatomic Ions -> Non-metals -> Oxygen -> Hydrogen"
                    };
                }
            }
        }
    }

    // 3. Reactant-only matching (e.g. "fe + o2", "ch4 + o2", "mg + o2 ->", "mg + o2")
    let cleanTokensText = text.replace(/->/g, ' ').replace(/\+/g, ' ');
    let tokens = cleanTokensText.split(/\s+/).map(t => t.trim()).filter(Boolean);
    for (let r of AI_REACTION_DATABASE) {
        let rReactants = r.reactants.map(m => m.toLowerCase().replace(/[₀-₉]/g, ch => subMap[ch] || ch));
        let matches = 0;
        for (let token of tokens) {
            if (rReactants.includes(token)) matches++;
        }
        if (matches >= r.reactants.length && tokens.length <= r.reactants.length + 1) {
            return r;
        }
        if (matches === tokens.length && tokens.length >= 1 && tokens.length === rReactants.length) {
            return r;
        }
    }

    // 4. Fallback search
    for (let r of AI_REACTION_DATABASE) {
        let rReactants = r.reactants.map(m => m.toLowerCase().replace(/[₀-₉]/g, ch => subMap[ch] || ch));
        let matchCount = 0;
        for (let token of tokens) {
            if (rReactants.includes(token)) matchCount++;
        }
        if (matchCount > 0 && matchCount === rReactants.length) {
            return r;
        }
    }

    return null;
};

// In-Keypad AI Auto-Complete
window.vkAiAutoComplete = function() {
    if (typeof playSound === 'function') playSound('pop');
    let disp = document.getElementById('vk-display');
    if (!disp) return;
    let currentText = (disp.innerText || disp.value || '').trim();

    if (!currentText) {
        let sample = AI_REACTION_DATABASE[Math.floor(Math.random() * AI_REACTION_DATABASE.length)];
        disp.innerText = sample.equation;
        window.vkCheck();
        return;
    }

    let match = window.resolveReactionFromPrompt(currentText);
    if (match) {
        disp.innerText = match.equation;
        window.vkCheck();
        let feedback = document.getElementById('vk-feedback');
        if (feedback) {
            feedback.innerHTML = `✨ <b>AI Auto-Completed:</b> Identified <b>${match.title}</b>! Target: <b>${match.balancedString}</b>`;
        }
    } else {
        // Fallback: check if valid as-is
        window.vkCheck();
    }
};

// Open AI Reaction & Level Generator Modal
let currentGeneratedAiLevel = null;

window.openAiLevelModal = function() {
    if (typeof playSound === 'function') playSound('pop');
    let modal = document.getElementById('sandbox-ai-modal');
    if (modal) {
        modal.style.display = 'flex';
        let choiceModal = document.getElementById('sandbox-choice-modal');
        if (choiceModal) choiceModal.style.display = 'none';
        window.renderSavedAiLevels();
    }
};

window.closeAiLevelModal = function() {
    if (typeof playSound === 'function') playSound('click');
    let modal = document.getElementById('sandbox-ai-modal');
    if (modal) modal.style.display = 'none';
};

window.setAiPrompt = function(promptText) {
    let inp = document.getElementById('ai-level-input');
    if (inp) {
        inp.value = promptText;
        window.generateAiLevel();
    }
};

window.generateAiLevel = function() {
    if (typeof playSound === 'function') playSound('click');
    let inp = document.getElementById('ai-level-input');
    let promptText = inp ? inp.value.trim() : '';
    let preview = document.getElementById('ai-level-preview') || document.getElementById('ai-preview-card');
    let statusBox = document.getElementById('ai-status-box');

    if (!promptText) {
        if (statusBox) {
            statusBox.style.display = 'block';
            statusBox.style.background = '#fef2f2';
            statusBox.style.color = '#991b1b';
            statusBox.style.border = '2px solid #ef4444';
            statusBox.innerHTML = '⚠️ Please enter a chemical reaction or topic!';
        }
        return;
    }

    let reaction = window.resolveReactionFromPrompt(promptText);

    if (!reaction) {
        if (statusBox) {
            statusBox.style.display = 'block';
            statusBox.style.background = '#fef2f2';
            statusBox.style.color = '#991b1b';
            statusBox.style.border = '2px solid #ef4444';
            statusBox.innerHTML = '❌ <b>Could not recognize reaction.</b> Try writing formulas (e.g. <code>CH4 + O2</code> or <code>Fe + O2 -> Fe2O3</code>) or choose one of the suggestion chips!';
        }
        if (preview) preview.style.display = 'none';
        return;
    }

    if (statusBox) statusBox.style.display = 'none';
    currentGeneratedAiLevel = reaction;

    if (preview) {
        preview.style.display = 'flex';
        let titleEl = document.getElementById('ai-preview-title');
        let diffEl = document.getElementById('ai-preview-difficulty');
        let eqEl = document.getElementById('ai-preview-equation');
        
        if (titleEl) titleEl.innerText = reaction.title;
        if (diffEl) diffEl.innerText = reaction.difficulty;
        if (eqEl) eqEl.innerHTML = `${reaction.equation} &nbsp;➔&nbsp; <span style="color:#059669;">${reaction.balancedString}</span>`;
        
        let saveBtn = document.getElementById('ai-save-btn');
        if (saveBtn) {
            saveBtn.innerText = "💾 Save Level";
            saveBtn.disabled = false;
        }
    }
};

window.saveCurrentAiLevel = function() {
    if (!currentGeneratedAiLevel) return;
    if (typeof playSound === 'function') playSound('start');

    let saved = JSON.parse(localStorage.getItem('stoich_saved_custom_levels') || '[]');
    let exists = saved.some(l => l.equation === currentGeneratedAiLevel.equation);
    if (!exists) {
        saved.unshift({
            title: currentGeneratedAiLevel.title,
            equation: currentGeneratedAiLevel.equation,
            balancedString: currentGeneratedAiLevel.balancedString,
            difficulty: currentGeneratedAiLevel.difficulty,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('stoich_saved_custom_levels', JSON.stringify(saved));
    }

    let saveBtn = document.getElementById('ai-save-btn');
    if (saveBtn) {
        saveBtn.innerText = "✅ Saved to Collection!";
        saveBtn.disabled = true;
    }
    window.renderSavedAiLevels();
};

window.playCurrentAiLevel = function() {
    if (!currentGeneratedAiLevel) return;
    if (typeof playSound === 'function') playSound('start');
    let nameParam = encodeURIComponent(document.getElementById('player-name').value.trim() || 'Student');
    let eqParam = encodeURIComponent(currentGeneratedAiLevel.equation);
    window.transitionTo(`game.html?level=sandbox&name=${nameParam}&eq=${eqParam}`);
};

window.editInVirtualKeyboard = function() {
    if (!currentGeneratedAiLevel) return;
    window.closeAiLevelModal();
    window.openVirtualKeyboardModal();
    let disp = document.getElementById('vk-display');
    if (disp) {
        disp.innerText = currentGeneratedAiLevel.equation;
        window.vkCheck();
    }
};

window.saveSandboxKeypadLevel = function() {
    if (!window.validSandboxLevel) return;
    if (typeof playSound === 'function') playSound('start');

    let saved = JSON.parse(localStorage.getItem('stoich_saved_custom_levels') || '[]');
    let eq = window.validSandboxLevel.equation;
    let exists = saved.some(l => l.equation === eq);

    if (!exists) {
        let title = window.validSandboxLevel.title;
        if (!title || title.startsWith('Custom:') || title.trim() === eq.trim()) {
            let dbMatch = (typeof window.resolveReactionFromPrompt === 'function') ? window.resolveReactionFromPrompt(eq) : null;
            if (dbMatch && dbMatch.title) {
                title = dbMatch.title;
            } else {
                title = `Custom Reaction`;
            }
        }
        saved.unshift({
            title: title,
            equation: eq,
            balancedString: window.validSandboxLevel.balancedString,
            difficulty: window.validSandboxLevel.difficulty || "Custom Level",
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('stoich_saved_custom_levels', JSON.stringify(saved));
    }

    if (typeof window.setVkBtnToSavedMode === 'function') {
        window.setVkBtnToSavedMode();
    }
    window.renderSavedAiLevels();
};

window.renderSavedAiLevels = function() {
    let saved = JSON.parse(localStorage.getItem('stoich_saved_custom_levels') || '[]');
    let aiList = document.getElementById('ai-saved-list') || document.getElementById('ai-saved-levels-list');
    let choiceList = document.getElementById('sandbox-saved-levels-list');
    let countSpan = document.getElementById('ai-saved-count');
    if (countSpan) countSpan.innerText = saved.length;

    let html = '';
    if (saved.length === 0) {
        html = '<div style="font-size:13px; font-weight:700; color:#94a3b8; padding:8px 4px;">No saved custom levels yet. Create and save reactions above!</div>';
    } else {
        html = saved.map((lvl, idx) => {
            let eq = lvl.equation || '';
            let rawTitle = lvl.title || '';
            
            // Clean title and eliminate duplicate repeating strings
            let displayTitle = rawTitle;
            let isRedundant = !displayTitle || 
                              displayTitle === eq || 
                              displayTitle === ('Custom: ' + eq) || 
                              displayTitle.toLowerCase().startsWith('custom:') ||
                              displayTitle.replace(/[\s\-\>→\+]/g, '') === eq.replace(/[\s\-\>→\+]/g, '');

            if (isRedundant) {
                let dbMatch = (typeof window.resolveReactionFromPrompt === 'function') ? window.resolveReactionFromPrompt(eq) : null;
                if (dbMatch && dbMatch.title) {
                    displayTitle = dbMatch.title;
                } else {
                    displayTitle = `Custom Reaction #${saved.length - idx}`;
                }
            }

            return `
                <div style="background:#ffffff; border:2.5px solid #1e293b; border-radius:14px; padding:10px 14px; display:flex; align-items:center; justify-content:space-between; gap:12px; box-shadow:0 3px 0 #1e293b; width:100%; box-sizing:border-box;">
                    <div style="display:flex; align-items:center; gap:12px; min-width:0;">
                        <div style="width:36px; height:36px; border-radius:10px; background:#ede9fe; color:#6d28d9; border:2px solid #1e293b; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 2px 0 #1e293b;">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M10 2v7.31L4.1 19.33A2 2 0 0 0 5.82 22h12.36a2 2 0 0 0 1.72-2.67L14 9.31V2"/>
                                <line x1="8" y1="2" x2="16" y2="2"/>
                                <line x1="6.5" y1="16" x2="17.5" y2="16"/>
                            </svg>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:3px; min-width:0;">
                            <span style="font-size:13.5px; font-weight:900; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${displayTitle}</span>
                            <span style="font-size:12px; font-weight:800; color:#6d28d9; font-family:monospace; background:#f5f3ff; border:1px solid #ddd6fe; border-radius:6px; padding:2px 8px; width:fit-content; letter-spacing:0.3px;">${eq}</span>
                        </div>
                    </div>
                    <div style="display:flex; gap:8px; align-items:center; flex-shrink:0;">
                        <button type="button" class="interactive ai-saved-play-btn" onclick="window.playSavedLevel('${encodeURIComponent(lvl.equation)}')" 
                            style="background:#10b981; border:2.5px solid #1e293b; color:#ffffff; font-size:12.5px; font-weight:900; border-radius:10px; padding:6px 14px; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 2px 0 #047857;" 
                            title="Play Level Now">
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3"/>
                            </svg>
                            <span>Play</span>
                        </button>
                        <button type="button" class="interactive ai-saved-del-btn" onclick="window.deleteSavedLevel(${idx})" 
                            style="background:#fee2e2; border:2.5px solid #1e293b; color:#dc2626; border-radius:10px; padding:6px 10px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 0 #991b1b;" 
                            title="Delete Level">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    if (aiList) aiList.innerHTML = html;
    if (choiceList) choiceList.innerHTML = html;
};

window.playSavedLevel = function(encodedEq) {
    if (typeof playSound === 'function') playSound('start');
    let nameParam = encodeURIComponent(document.getElementById('player-name').value.trim() || 'Student');
    window.transitionTo(`game.html?level=sandbox&name=${nameParam}&eq=${encodedEq}`);
};

window.deleteSavedLevel = function(index) {
    if (typeof playSound === 'function') playSound('click');
    let saved = JSON.parse(localStorage.getItem('stoich_saved_custom_levels') || '[]');
    saved.splice(index, 1);
    localStorage.setItem('stoich_saved_custom_levels', JSON.stringify(saved));
    window.renderSavedAiLevels();
};

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.renderSavedAiLevels();
    });
}
