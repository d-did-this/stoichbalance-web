// Unified Audio Engine and Page Transitions
const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
let audioCtx;

window.initAudio = function() {
    if (!audioCtx) audioCtx = new AudioCtxClass();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Ensure audio context is started on first interaction anywhere
document.addEventListener('click', () => {
    if(!audioCtx) window.initAudio();
    else if(audioCtx.state === 'suspended') audioCtx.resume();
}, {once: false});

window.playSound = function(type) {
    if (window.isMuted) return;
    if (!audioCtx) window.initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    try {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
                if (type === 'start') {
            // Elegant, warm laboratory chime arpeggio (C5 -> E5 -> G5 -> C6)
            const chord = [523.25, 659.25, 783.99, 1046.50];
            chord.forEach((freq, idx) => {
                const noteOsc = audioCtx.createOscillator();
                const noteGain = audioCtx.createGain();
                noteOsc.type = 'sine';
                noteOsc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.06);
                noteGain.gain.setValueAtTime(0.001, audioCtx.currentTime + idx * 0.06);
                noteGain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + idx * 0.06 + 0.02);
                noteGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.06 + 0.35);
                noteOsc.connect(noteGain);
                noteGain.connect(audioCtx.destination);
                noteOsc.start(audioCtx.currentTime + idx * 0.06);
                noteOsc.stop(audioCtx.currentTime + idx * 0.06 + 0.35);
            });
            return;
        } else if (type === 'select') {
            // Warm tactile wooden marimba tap
            osc.type = 'sine';
            osc.frequency.setValueAtTime(480, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.08);
            gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.08);
        } else if (type === 'swoosh' || type === 'whoosh') {
            // "expanding and collapsing the element tray and the prof beaker, it should have a swoosh / whoosh sound instead"
            try {
                const bufferSize = Math.floor(audioCtx.sampleRate * 0.22);
                const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    output[i] = Math.random() * 2 - 1;
                }
                const whiteNoise = audioCtx.createBufferSource();
                whiteNoise.buffer = noiseBuffer;
                
                const filter = audioCtx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(280, audioCtx.currentTime);
                filter.frequency.exponentialRampToValueAtTime(750, audioCtx.currentTime + 0.08);
                filter.frequency.exponentialRampToValueAtTime(160, audioCtx.currentTime + 0.22);
                filter.Q.setValueAtTime(2.2, audioCtx.currentTime);

                const noiseGain = audioCtx.createGain();
                noiseGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
                noiseGain.gain.linearRampToValueAtTime(0.32, audioCtx.currentTime + 0.06);
                noiseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);

                whiteNoise.connect(filter);
                filter.connect(noiseGain);
                noiseGain.connect(audioCtx.destination);
                whiteNoise.start();
                whiteNoise.stop(audioCtx.currentTime + 0.22);
                return;
            } catch(e) {
                // Fallback to sine sweep if noise buffer fails
                osc.type = 'sine';
                osc.frequency.setValueAtTime(100, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.12);
                osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.22);
                gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
                gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.22);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.22);
            }
        } else if (type === 'drop') {
            // "change teh audio of adding stuff n to teh drop box" - plop sound
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } else if (type === 'remove') {
            // "removing them" - reverse plop
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.05);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } else if (type === 'trash') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
        } else if (type === 'success') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
            osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
            osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
            osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.3); // C6
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.8);
        } else if (type === 'sad') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.5);
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
        } else if (type === 'hint') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        } else if (type === 'back' || type === 'page') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(500, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.15);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        } else if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } else {
            // Default
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        }
    } catch(e) {
        console.warn("Audio generation failed", e);
    }
};

// PAGE TRANSITION LOGIC
window.transitionTo = function(url) {
    let overlay = document.getElementById('iris-wipe-overlay');
    if(overlay) {
        overlay.classList.remove('open');
        setTimeout(() => { window.location.href = url; }, 550);
    } else {
        window.location.href = url;
    }
};

window.addEventListener('load', () => {
    let overlay = document.getElementById('iris-wipe-overlay');
    if(overlay) {
        overlay.classList.add('open');
    }
});
