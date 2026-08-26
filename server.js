/**
 * SINYLON - STELLANTIS | Production HTTP Web Server & Real-time Persistence API
 * Compatible Render.com, Cloud VPS & Local Intranet
 * API REST intégrée : GET/POST /api/permits pour synchronisation temps réel PC ⇄ Smartphone
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DB_FILE = path.join(__dirname, 'k9_v2_permits.json');

// Chargement de la base de données en mémoire
let permitsDatabase = {};
function loadDatabase() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const raw = fs.readFileSync(DB_FILE, 'utf8');
            permitsDatabase = JSON.parse(raw);
            console.log(`📊 Base de données chargée : ${Object.keys(permitsDatabase).length} permis.`);
        }
    } catch (e) {
        console.error('Erreur chargement base de données:', e);
    }
}
loadDatabase();

function saveDatabase() {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(permitsDatabase, null, 2), 'utf8');
    } catch (e) {
        console.error('Erreur sauvegarde base de données:', e);
    }
}

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    // En-têtes CORS pour autoriser l'accès cross-origin si nécessaire
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = urlObj.pathname;

    // =========================================================================
    // API REST TEMPS RÉEL (PC MODIFIE → SERVEUR ENREGISTRE → SMARTPHONE SCANNE)
    // =========================================================================

    // 1. GET /api/permits : Récupérer tous les permis
    if (req.method === 'GET' && pathname === '/api/permits') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' });
        res.end(JSON.stringify(permitsDatabase));
        return;
    }

    // 2. GET /api/permits/:id : Récupérer un permis en direct
    if (req.method === 'GET' && pathname.startsWith('/api/permits/')) {
        const permitId = decodeURIComponent(pathname.replace('/api/permits/', '')).trim();
        const permit = permitsDatabase[permitId] || permitsDatabase[permitId.toUpperCase()];
        if (permit) {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' });
            res.end(JSON.stringify(permit));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Permit not found', id: permitId }));
        }
        return;
    }

    // 3. POST /api/permits/:id : Mettre à jour ou créer un permis sur le serveur
    if ((req.method === 'POST' || req.method === 'PUT') && pathname.startsWith('/api/permits/')) {
        const permitId = decodeURIComponent(pathname.replace('/api/permits/', '')).trim();
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const updatedPermit = JSON.parse(body);
                updatedPermit.id = permitId;
                updatedPermit.updatedAt = new Date().toISOString();

                permitsDatabase[permitId] = updatedPermit;
                saveDatabase();

                console.log(`💾 Permis ${permitId} mis à jour et synchronisé sur le serveur.`);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true, permit: updatedPermit }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // =========================================================================
    // SERVEUR DE FICHIERS STATIQUES & SPA ROUTING
    // =========================================================================

    let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '') {
        safePath = '/index.html';
    }

    const filePath = path.join(PUBLIC_DIR, safePath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Fallback SPA vers index.html pour les scans directs et URLs propres
            const indexPath = path.join(PUBLIC_DIR, 'index.html');
            fs.readFile(indexPath, (readErr, content) => {
                if (readErr) {
                    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('404 Not Found - SINYLON STELLANTIS System');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(content);
            });
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🛡️  SINYLON - STELLANTIS | Système Permis de Travail`);
    console.log(`🚀 Serveur actif sur : http://0.0.0.0:${PORT}`);
    console.log(`🔄 API de Synchronisation Temps Réel : /api/permits`);
    console.log(`📱 Prêt pour Render.com & Scanners QR Mobiles`);
    console.log(`====================================================`);

    // =========================================================================
    // SELF-PING ANTI-SLEEP — Garde le serveur éveillé sur Render Free Tier
    // Render endort les services après 15 min d'inactivité → 502 au scan QR
    // Ce ping interne toutes les 14 min empêche le sommeil définitivement
    // =========================================================================
    const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes
    const selfPing = () => {
        const host = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
        const pingUrl = `${host}/api/permits`;
        try {
            const mod = pingUrl.startsWith('https') ? require('https') : require('http');
            const req = mod.get(pingUrl, (res) => {
                console.log(`🔔 Self-ping OK (${new Date().toISOString()}) → Status ${res.statusCode}`);
            });
            req.on('error', (e) => {
                console.warn(`⚠️ Self-ping failed: ${e.message}`);
            });
            req.setTimeout(10000, () => { req.destroy(); });
        } catch (e) {
            console.warn(`⚠️ Self-ping error: ${e.message}`);
        }
    };

    // Premier ping 30 secondes après le démarrage, puis toutes les 14 minutes
    setTimeout(() => {
        selfPing();
        setInterval(selfPing, PING_INTERVAL_MS);
    }, 30000);
});
