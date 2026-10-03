// Stoichbalance V2 - Level Selection Logic

// ==========================================
// 1. AUDIO ENGINE (Soft Click)
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
    osc.frequency.setValueAtTime(800, audioCtx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
}

function playSpeedSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, audioCtx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
}

// ==========================================
// 2. NAVIGATION LOGIC
// ==========================================
function goBack() {
    playSoftClick();
    const btn = document.querySelector('.btn-back');
    const oldTransform = btn.style.transform;
    const oldBoxShadow = btn.style.boxShadow;
    
    btn.style.transform = 'translateY(6px)';
    btn.style.boxShadow = '0 0 0 transparent';
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 150);
}

function startLevel(levelNum) {
    playSoftClick();
    
    // Add a slight delay so the soft click sound and hover effects can play
    setTimeout(() => {
        window.location.href = `game.html?level=${levelNum}`;
    }, 150);
}

let currentPage = 1;

function changePage(pageNum) {
    // Prevent re-triggering the same page or firing if manually blocked
    if (pageNum === currentPage) return;
    
    playSoftClick();
    currentPage = pageNum;
    
    // Hide all pages
    document.getElementById('page-1').style.display = 'none';
    document.getElementById('page-2').style.display = 'none';
    
    // Show target page (Empty string allows CSS media queries to safely decide between 'grid' or 'flex')
    document.getElementById(`page-${pageNum}`).style.display = '';
    
    // Update dots
    document.getElementById('dot-1').classList.remove('active');
    document.getElementById('dot-2').classList.remove('active');
    document.getElementById(`dot-${pageNum}`).classList.add('active');
    
    // Update buttons
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    
    if (pageNum === 1) {
        btnPrev.disabled = true;
        btnPrev.classList.remove('interactive');
        btnNext.disabled = false;
        btnNext.classList.add('interactive');
    } else {
        btnPrev.disabled = false;
        btnPrev.classList.add('interactive');
        btnNext.disabled = true;
        btnNext.classList.remove('interactive');
    }
}

// Extract URL Params to set Form title/background
function parseUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const form = urlParams.get('form') || 'Form 4';
    const name = urlParams.get('name') || 'Student';
    
    document.getElementById('form-title').innerText = form;
    
    const nameEl = document.getElementById('display-name');
    if (nameEl) nameEl.innerText = name;
    
    // Change background based on Form 4 vs Form 5
    const bg = document.getElementById('bg-levels');
    if (form.includes('5')) {
        bg.classList.remove('bg-blue');
        bg.classList.add('bg-purple');
    }
}

// Dynamically count solved and total puzzles
function updateScoreWidget() {
    // Only count actual puzzles in the current view (or all of them across all pages)
    const totalPuzzles = document.querySelectorAll('.level-card').length;
    const solvedPuzzles = document.querySelectorAll('.level-card.mastered').length;
    
    const scoreText = document.querySelector('.score-text');
    if (scoreText) {
        scoreText.innerText = `${solvedPuzzles} / ${totalPuzzles}`;
    }
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
    
    const scale = Math.random() * 0.4 + 0.6; 
    molecule.style.transform = `translate(-50%, -50%) scale(${scale})`;
    
    const spawnX = x !== undefined ? x : (Math.random() * window.innerWidth * 0.9 + window.innerWidth * 0.05);
    const spawnY = y !== undefined ? y : window.innerHeight + 100;
    
    molecule.style.left = `${spawnX}px`;
    molecule.style.top = `${spawnY}px`;
    
    canvas.appendChild(molecule);

    const p = {
        el: molecule, x: spawnX, y: spawnY,
        vx: (Math.random() - 0.5) * 2, 
        vy: - (Math.random() * 2 + 1), 
        rot: 0, vrot: (Math.random() - 0.5) * 2, scale: scale
    };
    particles.push(p);

    molecule.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        draggingParticle = p;
        dragOffset.x = e.clientX - p.x;
        dragOffset.y = e.clientY - p.y;
        mouseHistory = [{x: e.clientX, y: e.clientY, time: performance.now()}];
        molecule.style.cursor = 'grabbing';
    });
}

document.addEventListener('mousemove', (e) => {
    if (draggingParticle) {
        draggingParticle.x = e.clientX - dragOffset.x;
        draggingParticle.y = e.clientY - dragOffset.y;
        
        const now = performance.now();
        mouseHistory.push({x: e.clientX, y: e.clientY, time: now});
        if (mouseHistory.length > 5) mouseHistory.shift();
    }
});

document.addEventListener('mouseup', () => {
    if (draggingParticle) {
        draggingParticle.el.style.cursor = 'grab';
        if (mouseHistory.length > 1) {
            const first = mouseHistory[0];
            const last = mouseHistory[mouseHistory.length - 1];
            const timeDiff = Math.max(last.time - first.time, 1);
            
            const vx = (last.x - first.x) / timeDiff * 15;
            const vy = (last.y - first.y) / timeDiff * 15;
            
            draggingParticle.vx = Math.max(Math.min(vx, 30), -30);
            draggingParticle.vy = Math.max(Math.min(vy, 30), -30);
            draggingParticle.vrot = (Math.random() - 0.5) * 10;
        }
        draggingParticle = null;
        mouseHistory = [];
    }
});

function physicsLoop() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p !== draggingParticle) {
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vrot;
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.vrot *= 0.98;
            if (p.vy > -2) p.vy -= 0.05;
        }
        p.el.style.left = `${p.x}px`;
        p.el.style.top = `${p.y}px`;
        p.el.style.transform = `translate(-50%, -50%) scale(${p.scale}) rotate(${p.rot}deg)`;
        
        if (p.y < -300 || p.x < -200 || p.x > window.innerWidth + 200 || p.y > window.innerHeight + 500) {
            p.el.remove();
            particles.splice(i, 1);
        }
    }
    requestAnimationFrame(physicsLoop);
}

document.addEventListener('DOMContentLoaded', () => {
    parseUrlParams();
    updateScoreWidget();
    
    document.body.addEventListener('mousedown', () => initAudio(), { once: true });
    
    document.querySelectorAll('.interactive').forEach(el => {
        el.addEventListener('mousedown', (e) => {
            if(!el.classList.contains('molecule')) playSoftClick();
        });
    });
    
    document.body.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BODY' || e.target.id === 'particle-canvas' || e.target.classList.contains('bg-layer')) {
            spawnMoleculeAt(e.clientX, e.clientY);
        }
    });

    physicsLoop();
    setInterval(() => spawnMoleculeAt(), 2500);
    for(let i=0; i<3; i++) { setTimeout(() => spawnMoleculeAt(), i * 400); }
});
