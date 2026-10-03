// Stoichbalance V2 - Interactive Chemistry Engine

// ==========================================
// 1. MENU LOGIC
// ==========================================
let currentMode = 'class'; 
let currentSubOption = 'Form 4'; 

function selectMode(mode) {
    if (currentMode === mode) return; 
    currentMode = mode;

    document.querySelectorAll('.mode-card').forEach(card => card.classList.remove('active-mode'));
    document.getElementById(`mode-${mode}`).classList.add('active-mode');

    document.querySelectorAll('.bg-layer').forEach(bg => bg.classList.remove('active-bg'));
    document.getElementById(`bg-${mode}`).classList.add('active-bg');

    const activeSubBtn = document.querySelector(`#mode-${mode} .sub-btn.active-sub`);
    if (activeSubBtn) {
        currentSubOption = activeSubBtn.innerText;
    } else {
        currentSubOption = null;
    }
    updatePlayButton();
}

function selectSubOption(event, mode, subValue) {
    event.stopPropagation(); 
    if(currentMode !== mode) selectMode(mode);

    const optionsContainer = document.getElementById(`mode-${mode}`);
    optionsContainer.querySelectorAll('.sub-btn').forEach(btn => btn.classList.remove('active-sub'));

    event.target.classList.add('active-sub');
    currentSubOption = subValue;
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
    const btn = document.getElementById('main-play-btn');
    const oldTransform = btn.style.transform;
    const oldBoxShadow = btn.style.boxShadow;
    
    btn.style.transform = 'translateY(8px)';
    btn.style.boxShadow = '0 0 0 transparent';
    
    setTimeout(() => {
        const playerNameInput = document.getElementById('player-name').value.trim();
        const finalName = playerNameInput !== '' ? playerNameInput : 'Student';
        
        // Redirect to Level Selection Screen
        if (currentMode === 'sandbox') {
            alert('Loading Sandbox Engine...');
            // window.location.href = 'sandbox.html';
        } else {
            // Encode parameters
            const formParam = encodeURIComponent(currentSubOption);
            const nameParam = encodeURIComponent(finalName);
            window.location.href = `levels.html?form=${formParam}&mode=${currentMode}&name=${nameParam}`;
        }
        
        btn.style.transform = oldTransform;
        btn.style.boxShadow = oldBoxShadow;
    }, 150);
}

function openElements() {
    alert('Opening Periodic Table Database...');
}

// ==========================================
// 2. AUDIO ENGINE (Soft Click)
// ==========================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playSoftClick() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    // Very quick, soft, pleasant drop
    osc.frequency.setValueAtTime(800, audioCtx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // Low volume
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
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
