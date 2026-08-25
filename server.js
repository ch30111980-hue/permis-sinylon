/**
 * SINYLON - STELLANTIS | Production HTTP Web Server
 * Compatible Render.com, Cloud VPS & Local Intranet
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

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
    // Nettoyage de l'URL demandée
    let safePath = path.normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '') {
        safePath = '/index.html';
    }

    const filePath = path.join(PUBLIC_DIR, safePath);

    // Vérification d'existence du fichier
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Fallback SPA vers index.html pour les routes dynamiques
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
            'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*'
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🛡️  SINYLON - STELLANTIS | Système Permis de Travail`);
    console.log(`🚀 Serveur actif sur : http://0.0.0.0:${PORT}`);
    console.log(`📱 Prêt pour Render.com & Scanners QR Mobiles`);
    console.log(`====================================================`);
});
