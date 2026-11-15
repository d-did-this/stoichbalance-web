// Vercel Serverless Function: /api/chat
// Hardened with Antigravity Defensive Security Standards
const https = require('https');
const fs = require('fs');
const path = require('path');

// Safe local fallback from .env (ignored by version control)
if (!process.env.DEEPSEEK_API_KEY) {
    try {
        const envPath = path.join(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#') && trimmed.startsWith('DEEPSEEK_API_KEY=')) {
                    process.env.DEEPSEEK_API_KEY = trimmed.split('=')[1].trim();
                    break;
                }
            }
        }
    } catch (e) {}
}

const PROF_BEAKER_SYSTEM_PROMPT = `You are Professor Beaker, an enthusiastic, friendly chemistry mentor in the Stoichbalance learning tool. You guide students (SPM Chemistry Form 4/5, Chapter 3: Chemical Formulae and Equations) to discover and understand chemical balancing.

TEACHING PRINCIPLES:
1. ENCOURAGE CURIOSITY AND UNDERSTANDING (DO NOT JUST SPOON-FEED ANSWERS):
   - When a student asks what an element is (e.g. "what is nitrogen"), explain its real-world context simply and connect it to the visual marbles on their screen (e.g. "Nitrogen is the gas making up most of our air! In our reaction, each Nitrogen molecule has 2 atoms, shown as the purple marbles.").
   - When a student asks about numbers or symbols (e.g. "why is there a two in N2", "what does the arrow mean"), explain the chemistry concept clearly (e.g. "The small 2 is a subscript! It means Nitrogen atoms travel in bonded pairs like twins. You cannot change subscripts, but you can add more molecules!").
   - When a student asks how to balance or what to do next, do NOT just shout the answer. Guide them Socratically: point out which atom count is uneven on the scale, and prompt them on what molecule might help even it out!
   - If the student is completely stuck, has tried multiple times, or explicitly asks for the exact answer, provide the step with clear reasoning so they understand WHY.

2. ACCURATE WEBSITE NAVIGATION & CONTROLS:
   When a student asks how to use the website, how to start over, or where things are, provide exact instructions:
   - To Start Over / Reset: Tap the red Trash Can (🗑️) button next to the hint button below the chat area, or click individual molecule blocks in the drop zones to remove them.
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

const PROF_BUNSEN_SYSTEM_PROMPT = `You are Professor Bunsen, the passionate AI Chemical Architect in Stoichbalance. You are chatting directly with students in the Sandbox reaction lab.

YOUR MISSION:
1. TALK TO THE STUDENT: Speak warmly, enthusiastically, and conversationally. Ask what kind of reactions or chemistry topics they want to explore (e.g. combustion, rocket propellant, fireworks, rusting, acid-base, precipitation, synthesis).
2. GIVE SPECIFIC RECOMMENDATIONS: Whenever the student asks for an idea, recommendation, or topic, give 1-2 exciting real-world reactions, explain why they are fascinating or tricky to balance, and ask what they think!
3. REACTION TAG SPECIFICATION:
   Whenever you recommend, propose, or discuss a chemical reaction for the student to balance, ALWAYS append a tag on its own line at the end of your response in this exact format:
   [REACTION: Reactants -> Products | BalancedEquation | Title | Difficulty]
   
   Examples:
   - [REACTION: CH4 + O2 -> CO2 + H2O | CH4 + 2O2 -> CO2 + 2H2O | Combustion of Methane | Intermediate]
   - [REACTION: NH3 + O2 -> NO + H2O | 4NH3 + 5O2 -> 4NO + 6H2O | Oxidation of Ammonia | Advanced]
   - [REACTION: Fe + O2 -> Fe2O3 | 4Fe + 3O2 -> 2Fe2O3 | Rusting of Iron | Intermediate]
   - [REACTION: HCl + NaOH -> NaCl + H2O | HCl + NaOH -> NaCl + H2O | Neutralisation | Easy]
   - [REACTION: N2 + H2 -> NH3 | N2 + 3H2 -> 2NH3 | Haber Process | Easy]
   - [REACTION: Al + Fe2O3 -> Al2O3 + Fe | 2Al + Fe2O3 -> Al2O3 + 2Fe | Thermite Reaction | Advanced]
   - [REACTION: Na + H2O -> NaOH + H2 | 2Na + 2H2O -> 2NaOH + H2 | Sodium & Water Reaction | Intermediate]

4. STRICT INVARIANTS:
   - Zero em dashes (—). Use hyphens, commas, or colons instead.
   - Zero semicolons (;).
   - Zero AI buzzwords (delve, crucial, vital, tapestry, intricate, showcase, highlight, underscore, testament, navigate, pivotal).
   - Keep messages lively, engaging, and concise (2-4 sentences max per response) so the chat stays fast and responsive!`;

// Allowed CORS Origins allowlist (CWE-770 defense)
const ALLOWED_ORIGINS = new Set([
    'https://stoichbalance-edu.vercel.app',
    'https://d-did-this.github.io',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
]);

// In-Memory Rate Limiting per serverless instance (CWE-770 defense)
const ipRequests = new Map();
function checkServerlessRateLimit(ip) {
    const now = Date.now();
    const timestamps = (ipRequests.get(ip) || []).filter(t => now - t < 60000);
    if (timestamps.length >= 25) {
        return false; // Max 25 requests per minute per IP
    }
    if (timestamps.length > 0 && (now - timestamps[timestamps.length - 1]) < 1200) {
        return false; // Minimum 1.2s delay between requests
    }
    timestamps.push(now);
    ipRequests.set(ip, timestamps);
    if (ipRequests.size > 1000) {
        const threshold = now - 60000;
        for (const [k, v] of ipRequests.entries()) {
            if (v.length === 0 || v[v.length - 1] < threshold) {
                ipRequests.delete(k);
            }
        }
    }
    return true;
}

module.exports = async function handler(req, res) {
    // 1. Strict CORS Allowlist Enforcement
    const clientOrigin = req.headers.origin || '';
    const originToSet = ALLOWED_ORIGINS.has(clientOrigin) ? clientOrigin : 'https://stoichbalance-edu.vercel.app';
    res.setHeader('Access-Control-Allow-Origin', originToSet);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
    }

    // 2. Rate Limiting Check
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
    if (!checkServerlessRateLimit(ip)) {
        res.writeHead(429, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment before sending another message.' }));
        return;
    }

    // 3. Body Parsing with Payload Size Guard (Max 12KB)
    let body = req.body;
    if (!body || typeof body !== 'object') {
        try {
            if (typeof body === 'string') {
                body = JSON.parse(body);
            } else {
                let raw = '';
                for await (const chunk of req) {
                    raw += chunk;
                    if (raw.length > 12288) {
                        res.writeHead(413, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Payload too large.' }));
                        return;
                    }
                }
                body = JSON.parse(raw || '{}');
            }
        } catch (e) {
            body = {};
        }
    }

    // 4. Input Sanitization & Clamping (CWE-20 defense)
    const rawMessage = typeof body.message === 'string' ? body.message : '';
    const userMessage = rawMessage.trim().slice(0, 500);
    if (!userMessage) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Message cannot be empty.' }));
        return;
    }

    const levelContext = (typeof body.levelContext === 'string') ? body.levelContext.trim().slice(0, 800) : '';

    // 5. Secret Retrieval: Zero Hardcoded Keys in Source Control (CWE-798 defense)
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            error: 'DeepSeek API key is not configured in Vercel Environment Variables. Please set DEEPSEEK_API_KEY in the Vercel project dashboard.' 
        }));
        return;
    }

    // 6. Persona Selection (Supports both Prof. Bunsen in Sandbox and Prof. Beaker in Game)
    const persona = (body.persona === 'bunsen' || body.agent === 'bunsen') ? 'bunsen' : 'beaker';
    const systemPrompt = (persona === 'bunsen') ? PROF_BUNSEN_SYSTEM_PROMPT : PROF_BEAKER_SYSTEM_PROMPT;

    const messages = [
        { role: 'system', content: systemPrompt + (levelContext ? `\n\nCurrent Level Context:\n${levelContext}` : '') }
    ];

    // 7. Provenance & Role Sanitization (Clamp strictly to user/assistant turns)
    const history = Array.isArray(body.history) ? body.history : [];
    history.slice(-4).forEach(h => {
        if (h && typeof h.content === 'string') {
            const safeRole = (h.role === 'assistant') ? 'assistant' : 'user';
            const safeContent = h.content.trim().slice(0, 500);
            if (safeContent) {
                messages.push({ role: safeRole, content: safeContent });
            }
        }
    });

    messages.push({ role: 'user', content: userMessage });

    const payload = JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        max_tokens: 260,
        temperature: 0.6
    });

    return new Promise((resolve) => {
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
                        // Output sanitization: normalize forbidden punctuation
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
                resolve();
            });
        });

        dsReq.on('error', err => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Could not connect to DeepSeek API service.' }));
            resolve();
        });

        dsReq.write(payload);
        dsReq.end();
    });
};
