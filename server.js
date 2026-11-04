const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;

// Simple .env parser to load DEEPSEEK_API_KEY safely
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '.env');
        if (fs.existsSync(envPath)) {
            const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#')) {
                    const eqIdx = trimmed.indexOf('=');
                    if (eqIdx !== -1) {
                        const key = trimmed.slice(0, eqIdx).trim();
                        const val = trimmed.slice(eqIdx + 1).trim();
                        if (!process.env[key]) {
                            process.env[key] = val;
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.error('Error loading .env file:', e.message);
    }
}
loadEnv();

// Simple in-memory rate limiter: max 1 req per 2s, max 30 reqs per min per IP
const ipRateLimits = new Map();
function checkRateLimit(ip) {
    const now = Date.now();
    const history = ipRateLimits.get(ip) || [];
    // Keep requests within last 60 seconds
    const recent = history.filter(t => now - t < 60000);
    if (recent.length > 0 && (now - recent[recent.length - 1]) < 1800) {
        return { allowed: false, reason: 'Please wait a moment before sending another message to Prof. Beaker.' };
    }
    if (recent.length >= 30) {
        return { allowed: false, reason: 'Rate limit reached. Please wait a minute before asking more questions.' };
    }
    recent.push(now);
    ipRateLimits.set(ip, recent);
    return { allowed: true };
}

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
};

const PROF_BEAKER_SYSTEM_PROMPT = `You are Professor Beaker, an enthusiastic, friendly chemistry mentor in the Stoichbalance learning tool. You guide students (SPM Chemistry Form 4/5, Chapter 3: Chemical Formulae and Equations) to discover and understand chemical balancing.

TEACHING PRINCIPLES:
1. ENCOURAGE CURIOSITY AND UNDERSTANDING (DO NOT JUST SPOON-FEED ANSWERS):
   - When a student asks what an element is (e.g. "what is nitrogen"), explain its real-world context simply and connect it to the visual marbles on their screen (e.g. "Nitrogen is the gas making up most of our air! In our reaction, each Nitrogen molecule has 2 atoms, shown as the purple marbles.").
   - When a student asks about numbers or symbols (e.g. "why is there a two in N2", "what does the arrow mean"), explain the chemistry concept clearly (e.g. "The small 2 is a subscript! It means Nitrogen atoms travel in bonded pairs like twins. You cannot change subscripts, but you can add more molecules!").
   - When a student asks how to balance or what to do next, do NOT just shout the answer. Guide them Socratically: point out which atom count is uneven on the scale, and prompt them on what molecule might help even it out!
   - If the student is completely stuck, has tried multiple times, or explicitly asks for the exact answer, provide the step with clear reasoning so they understand WHY.

2. ACCURATE WEBSITE NAVIGATION & CONTROLS:
   When a student asks how to use the website, how to start over, or where things are, provide exact instructions:
   - To Start Over / Reset: Tap the red Trash Can button next to the chat input, or click individual molecule blocks in the drop zones to remove them.
   - To Add Molecules: Tap the blue buttons (+ N₂, + H₂) in the Reactants box or orange buttons (+ NH₃) in the Products box.
   - To Remove a Molecule: Click directly on any molecule block in the white drop zones.
   - To Check Balance: Look at the seesaw scale tilting in the center, or open "Element Trays" on the top left to inspect each element.
   - To Change Visuals: Tap the Scale or Bar Graph buttons on the far-left vertical tab rail.
   - To Enter Study Room: Tap the "[ ⛶ Study Room ]" button right above the chat input for a full-screen view.
   - To View Help: Tap the red "?" button on the bottom left.

3. CHEMICAL NOTATION & FORMATTING:
   - Always write chemical formulas with proper Unicode subscripts: N₂, H₂, NH₃, CO₂, H₂O, Na₂CO₃, HCl. Never use plain numbers like N2 or NH3.
   - You can create Markdown tables to compare atoms between Reactants and Products when helpful (e.g. comparing Left vs Right atom counts).
   - You can highlight key words using [blue:Reactants], [orange:Products], or [green:Balanced!].
   - Always bold key chemical terms, element names, and atom counts (e.g. **Nitrogen**, **N₂**, **subscript**, **2 atoms**).

4. THE MINOH BALANCING STRATEGY (SPM / IGCSE CHEMISTRY):
   When a student asks how to begin, how to balance, or what element to balance first, always teach the MINOH method:
   - M: Metals first (e.g. Na, Fe, Mg, Zn, Ca, Cu). Lock down the metal salts first!
   - I: Polyatomic Ions next (if they appear unchanged on both sides, e.g. SO4, NO3, CO3).
   - N: Non-metals next (e.g. C, Cl, N, S, P).
   - O: Oxygen (leave for the end).
   - H: Hydrogen (always balances out last!).
   - Invariant Rule: Adjust big molecule coefficients using the plus buttons. Never change small subscripts!

5. FORMAT & TONE:
   - Warm, encouraging, patient tutor who celebrates learning.
   - Concise: 2 to 4 friendly sentences (around 35 to 65 words total), or a concise table with a 1-sentence takeaway.

6. STRICT INVARIANTS:
   - Zero em dashes (—). Use hyphens, commas, or colons instead.
   - Zero semicolons (;).
   - Zero AI buzzwords (delve, crucial, vital, tapestry, intricate, showcase, highlight, underscore, testament, navigate, pivotal).`;

function handleDeepSeekChat(req, res) {
    const ip = req.socket.remoteAddress || 'unknown';
    const rateStatus = checkRateLimit(ip);
    if (!rateStatus.allowed) {
        res.writeHead(429, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: rateStatus.reason }));
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        try {
            const data = JSON.parse(body || '{}');
            const userMessage = data.message || '';
            const history = Array.isArray(data.history) ? data.history : [];
            const levelContext = data.levelContext || '';

            const apiKey = process.env.DEEPSEEK_API_KEY;
            if (!apiKey) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ 
                    error: 'DeepSeek API key is not configured on the local server.' 
                }));
            }

            // Build conversation payload
            const messages = [
                { role: 'system', content: PROF_BEAKER_SYSTEM_PROMPT + (levelContext ? `\n\nCurrent Level Context:\n${levelContext}` : '') }
            ];

            // Append last 4 messages for conversational context
            history.slice(-4).forEach(h => {
                if (h.role && h.content) {
                    messages.push({ role: h.role, content: h.content });
                }
            });

            messages.push({ role: 'user', content: userMessage });

            const payload = JSON.stringify({
                model: 'deepseek-chat',
                messages: messages,
                max_tokens: 260,
                temperature: 0.6
            });

            const dsReq = https.request({
                hostname: 'api.deepseek.com',
                path: '/chat/completions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Length': Buffer.byteLength(payload)
                }
            }, dsRes => {
                let dsData = '';
                dsRes.on('data', chunk => { dsData += chunk; });
                dsRes.on('end', () => {
                    if (dsRes.statusCode >= 200 && dsRes.statusCode < 300) {
                        try {
                            const parsed = JSON.parse(dsData);
                            let reply = parsed.choices?.[0]?.message?.content || 'Keep experimenting with the molecules to balance the atoms!';
                            // Sanitize any stray em dashes or semicolons from model output
                            reply = reply.replace(/\u2014/g, ' - ').replace(/;/g, ',');
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ reply: reply }));
                        } catch (pe) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Failed to parse AI response.' }));
                        }
                    } else {
                        res.writeHead(dsRes.statusCode, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: `DeepSeek API returned status ${dsRes.statusCode}`, details: dsData }));
                    }
                });
            });

            dsReq.on('error', err => {
                console.error('DeepSeek request error:', err.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Could not connect to DeepSeek API service.' }));
            });

            dsReq.write(payload);
            dsReq.end();
        } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON request payload.' }));
        }
    });
}

const server = http.createServer((req, res) => {
    // API Route for DeepSeek Chat
    if (req.url === '/api/chat' && req.method === 'POST') {
        return handleDeepSeekChat(req, res);
    }

    // Strip query parameters so file lookup works (e.g. /levels.html?form=X -> /levels.html)
    const basePath = req.url.split('?')[0];
    let filePath = path.join(__dirname, basePath === '/' ? 'index.html' : basePath);
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error: ' + err.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Local Development Server Running!`);
    console.log(`\n💻 Test on this computer: http://localhost:${PORT}`);
    
    // Get local network IP so they can test on their phone
    const interfaces = os.networkInterfaces();
    let localIp = '';
    for (let name of Object.keys(interfaces)) {
        for (let iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                localIp = iface.address;
                console.log(`📱 Test on your phone (must be on same WiFi): http://${localIp}:${PORT}`);
            }
        }
    }
    console.log('\nPress Ctrl+C to stop the server.');
});
