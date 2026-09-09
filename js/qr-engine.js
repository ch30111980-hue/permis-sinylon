/**
 * SINYLON - STELLANTIS | QR Engine V2 (Multi-Renderer & Auto-Fallback)
 * Génération de QR Codes dynamiques ultra-légers (URL directe vers la Fiche Publique de Contrôle)
 * Impression de la Grande Affiche QR A4 de Sécurité et Export PNG haute résolution
 */

const QREngine = {
    currentPermitId: null,

    // Récupérer l'URL de base pour la consultation mobile (Render.com / Serveur Web)
    getBaseURL() {
        const savedUrl = localStorage.getItem('sinylon_render_url');
        if (savedUrl && savedUrl.trim() !== '') {
            return savedUrl.trim().replace(/\/+$/, '');
        }
        if (window.location && window.location.protocol.startsWith('http') && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
            // Supprimer le slash final pour éviter le double // dans les URLs QR
            return (window.location.origin + window.location.pathname.replace(/\/index\.html$/, '')).replace(/\/+$/, '');
        }
        return 'https://permis-sinylon.onrender.com';
    },

    setRenderURL(url) {
        if (url) {
            localStorage.setItem('sinylon_render_url', url.trim());
        } else {
            localStorage.removeItem('sinylon_render_url');
        }
    },

    // Payload dynamique pur (URL directe vers le permis sur Render)
    generatePayload(permit) {
        if (!permit) return '';
        const id = typeof permit === 'string' ? permit : permit.id;
        const baseUrl = this.getBaseURL();
        return `${baseUrl}/?permitId=${encodeURIComponent(id)}`;
    },

    // Payload de zone pur (URL directe vers la vue zone sur Render)
    generateZonePayload(zoneCode) {
        const cleanZone = String(zoneCode || 'UB').toUpperCase().replace(/[^A-Z0-9]/g, '');
        const baseUrl = this.getBaseURL();
        return `${baseUrl}/?zone=${encodeURIComponent(cleanZone)}`;
    },

    // Ouvrir le modal QR dédié à une zone (UB, UAR, FUSA, WE)
    openZoneQRModal(zoneCode) {
        const zone = String(zoneCode || 'UB').toUpperCase();
        this.currentZoneCode = zone;
        const payload = this.generateZonePayload(zone);
        
        let modal = document.getElementById('modal-zone-qr');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-zone-qr';
            modal.className = 'modal-backdrop';
            modal.style.zIndex = '100000';
            modal.innerHTML = `
                <div class="modal-window" style="max-width: 480px; text-align: center; background: #0f172a; border: 2px solid #38bdf8; border-radius: 16px; padding: 22px; color: #fff; box-shadow: 0 10px 40px rgba(0,0,0,0.85);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1.5px solid #1e293b; padding-bottom: 8px;">
                        <h3 style="font-size: 18px; font-weight: 900; color: #38bdf8; margin: 0; display: flex; align-items: center; gap: 8px;" id="zone-modal-title">
                            <span>🏭</span> QR ZONE ${zone}
                        </h3>
                        <button type="button" onclick="QREngine.closeZoneQRModal()" class="btn btn-outline btn-sm" style="font-weight: 800; padding: 4px 10px;">✕</button>
                    </div>
                    <div style="font-size: 11.5px; color: #94a3b8; margin-bottom: 14px;" id="zone-modal-sub">STELLANTIS K9 · PERMIS ACTIFS ZONE ${zone}</div>
                    <div id="zone-modal-canvas-box" style="display: inline-flex; align-items: center; justify-content: center; padding: 14px; background: #fff; border-radius: 14px; margin-bottom: 14px; box-shadow: 0 8px 25px rgba(0,0,0,0.5); min-width: 250px; min-height: 250px;">
                        <canvas id="zone-modal-canvas" width="240" height="240" style="display: block; background: #ffffff; border-radius: 8px;"></canvas>
                    </div>
                    <div class="form-group" style="margin-bottom: 14px; text-align: left;">
                        <label style="font-size: 11px; color: #94a3b8; font-weight: 700; display: block; margin-bottom: 4px;">URL Souveraine Permanente :</label>
                        <div style="display: flex; gap: 6px;">
                            <input type="text" id="zone-modal-url" class="form-control" readonly style="font-family: monospace; font-size: 11px; flex: 1; background: #0b0f19; border: 1px solid #334155; color: #38bdf8;">
                            <button type="button" onclick="QREngine.copyZoneQRLink()" class="btn btn-secondary btn-sm" style="font-weight: 700;">📋 Copier</button>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <button type="button" id="zone-modal-print-btn" class="btn btn-warning btn-lg" style="font-weight: 800; font-size: 13px;">🏷️ Affiche A4</button>
                        <button type="button" onclick="QREngine.downloadZoneQRPNG()" class="btn btn-primary btn-lg" style="font-weight: 800; font-size: 13px;">📥 Télécharger PNG</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.onclick = (e) => { if (e.target === modal) QREngine.closeZoneQRModal(); };
        }
        
        const titleEl = document.getElementById('zone-modal-title');
        if (titleEl) titleEl.innerHTML = `<span>🏭</span> QR ZONE ${zone}`;
        const subEl = document.getElementById('zone-modal-sub');
        if (subEl) subEl.innerText = `STELLANTIS K9 · PERMIS ACTIFS ZONE ${zone}`;
        const urlInput = document.getElementById('zone-modal-url');
        if (urlInput) urlInput.value = payload;
        
        const printBtn = document.getElementById('zone-modal-print-btn');
        if (printBtn) {
            printBtn.onclick = () => {
                QREngine.closeZoneQRModal();
                if (window.App && typeof App.printZonePosterA4 === 'function') {
                    App.printZonePosterA4(zone);
                }
            };
        }
        
        const box = document.getElementById('zone-modal-canvas-box');
        if (box) {
            box.innerHTML = '';
            const canvas = document.createElement('canvas');
            canvas.id = 'zone-modal-canvas';
            canvas.width = 240;
            canvas.height = 240;
            canvas.style.display = 'block';
            canvas.style.borderRadius = '8px';
            canvas.style.background = '#ffffff';
            box.appendChild(canvas);
            
            const engine = window.QRCodeGenerator || window.QRCode;
            let drawn = false;
            if (engine && typeof engine.drawCanvas === 'function') {
                try {
                    engine.drawCanvas(canvas, payload, { size: 240, margin: 2, darkColor: '#000000', lightColor: '#ffffff' });
                    drawn = true;
                } catch(e) {
                    console.warn('Zone QR drawCanvas fallback:', e);
                }
            }
            if (!drawn) {
                box.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&bgcolor=255-255-255&color=0-0-0&data=${encodeURIComponent(payload)}" style="width:240px;height:240px;background:#fff;border-radius:8px;" alt="QR Zone">`;
            }
        }
        
        modal.classList.add('active');
        modal.style.display = 'flex';
    },

    closeZoneQRModal() {
        const modal = document.getElementById('modal-zone-qr');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
    },

    copyZoneQRLink() {
        const urlInput = document.getElementById('zone-modal-url');
        if (urlInput && urlInput.value) {
            navigator.clipboard.writeText(urlInput.value).then(() => {
                if (window.App) App.showToast('📋 Lien QR Zone copié !', 'success');
            }).catch(() => {
                urlInput.select();
                document.execCommand('copy');
                if (window.App) App.showToast('📋 Lien copié !', 'success');
            });
        }
    },

    downloadZoneQRPNG() {
        const canvas = document.getElementById('zone-modal-canvas');
        const zone = this.currentZoneCode || 'UB';
        if (canvas) {
            const link = document.createElement('a');
            link.download = `QR_ZONE_${zone}_SINYLON_STELLANTIS.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            if (window.App) App.showToast(`📥 QR Code Zone ${zone} téléchargé en PNG HD !`, 'success');
        } else {
            const url = this.generateZonePayload(zone);
            window.open(`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(url)}`, '_blank');
        }
    },

    // Dessiner un QR Code sur un canvas ou dans un conteneur HTML
    renderToCanvas(targetElement, permit, options = {}) {
        if (!targetElement || !permit) return;
        const payload = this.generatePayload(permit);
        const size = options.size || 256;
        const margin = options.margin !== undefined ? options.margin : 2;

        let canvas = targetElement;
        if (targetElement.tagName !== 'CANVAS') {
            targetElement.innerHTML = '';
            canvas = document.createElement('canvas');
            targetElement.appendChild(canvas);
        }

        const engine = window.QRCodeGenerator || window.QRCode;
        if (engine && typeof engine.drawCanvas === 'function') {
            try {
                engine.drawCanvas(canvas, payload, {
                    size: size,
                    margin: margin,
                    darkColor: options.darkColor || '#000000',
                    lightColor: options.lightColor !== undefined ? options.lightColor : '#ffffff'
                });
                return canvas;
            } catch (e) {
                console.error('Erreur drawCanvas QRCode:', e);
            }
        }

        // Fallback ultime : API Image externe si besoin
        if (canvas && canvas.getContext) {
            const ctx = canvas.getContext('2d');
            canvas.width = size;
            canvas.height = size;
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                // Fond transparent avant de dessiner l'image
                ctx.clearRect(0, 0, size, size);
                ctx.drawImage(img, 0, 0, size, size);
            };
            // &bgcolor=0-0-0-0 pour fond transparent sur api.qrserver.com
            img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&bgcolor=255-255-255-0&color=0-0-0&data=${encodeURIComponent(payload)}`;
        }
        return canvas;
    },

    // Obtenir l'image Base64 DataURL du QR Code
    getDataURL(permit, size = 300) {
        const payload = this.generatePayload(permit);
        const engine = window.QRCodeGenerator || window.QRCode;
        if (engine && typeof engine.toDataURL === 'function') {
            try {
                return engine.toDataURL(payload, { size: size });
            } catch (e) {
                console.error('Erreur getDataURL:', e);
            }
        }
        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(payload)}`;
    },

    // =========================================================================
    // MODAL QR & ACTIONS RAPIDES
    // =========================================================================

    openMobileQRModal(permitId) {
        let targetId = permitId || (typeof App !== 'undefined' && App.getActivePermitId ? App.getActivePermitId() : null) || 'K9-W35-01';
        let permit = Store.getPermit(targetId);
        if (!permit) {
            const list = Store.getPermitsByWeek(typeof App !== 'undefined' ? App.currentWeek : 35);
            if (list && list.length > 0) {
                permit = list[0];
            } else {
                permit = { id: targetId, contractor: 'SINYLON', zone: 'Zone K9', title: 'Permis de Travail' };
            }
        }

        this.currentPermitId = permit.id;
        const modal = document.getElementById('modal-mobile-qr');
        if (!modal) return;

        // Informations d'en-tête
        const elId = document.getElementById('mobile-qr-permit-id');
        if (elId) elId.innerText = permit.id;

        const elComp = document.getElementById('mobile-qr-company');
        if (elComp) elComp.innerText = permit.contractor || permit.company || 'SINYLON & Sinylon';

        const elZone = document.getElementById('mobile-qr-zone');
        if (elZone) elZone.innerText = `${permit.ouvrage || 'Atelier Montage'} — ${permit.zone || 'Zone 4'}`;

        const elWork = document.getElementById('mobile-qr-work');
        if (elWork) {
            elWork.innerText = (permit.activity && (permit.activity.en || permit.activity.fr)) || permit['work-desc'] || permit.title || 'Travaux de Montage';
        }

        const elDates = document.getElementById('mobile-qr-hours');
        if (elDates) {
            elDates.innerText = `${permit.validFrom || permit['date-main'] || '2026-08-24'} → ${permit.validUntil || permit['date_fin'] || '2026-08-30'} (${permit.timeStart || permit['time-start'] || '08h00'} - ${permit.timeEnd || permit['time-end'] || '17h30'})`;
        }

        // Rendu du QR Code
        const payload = this.generatePayload(permit);
        const previewBox = document.getElementById('mobile-qr-preview-box');
        const canvas = document.getElementById('mobile-qr-canvas-preview');
        const engine = typeof window !== 'undefined' ? (window.QRCodeGenerator || window.QRCode) : (typeof QRCodeGenerator !== 'undefined' ? QRCodeGenerator : null);

        let qrDrawn = false;
        // Priorité 1 : dessiner sur le canvas avec fond BLANC PUR (#ffffff) et modules NOIRS (#000000)
        if (canvas && engine && typeof engine.drawCanvas === 'function') {
            try {
                engine.drawCanvas(canvas, payload, {
                    size: 248,
                    margin: 2,
                    darkColor: '#000000',
                    lightColor: '#ffffff'
                });
                canvas.style.display = 'block';
                qrDrawn = true;
            } catch (e) {
                console.warn('drawCanvas échoué, tentative SVG:', e);
            }
        }

        // Priorité 2 : SVG inline avec fond blanc
        if (!qrDrawn && previewBox && engine && typeof engine.toSVG === 'function') {
            try {
                let svg = engine.toSVG(payload, { size: 248, margin: 2, darkColor: '#000000', lightColor: '#ffffff' });
                if (svg && svg.length > 50) {
                    previewBox.innerHTML = svg;
                    qrDrawn = true;
                }
            } catch (e) {
                console.warn('toSVG échoué, tentative API externe:', e);
            }
        }

        // Priorité 3 (fallback) : API externe fond blanc
        if (!qrDrawn && previewBox) {
            previewBox.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=248x248&bgcolor=255-255-255&color=0-0-0&data=${encodeURIComponent(payload)}" style="width:100%;height:100%;object-fit:contain;background:#ffffff;border-radius:8px;" alt="QR Code">`;
        }

        const urlText = document.getElementById('mobile-qr-link-url');
        if (urlText) {
            urlText.value = payload;
        }

        modal.dataset.currentPermitId = permit.id;
        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.onclick = (e) => { if (e.target === modal) QREngine.closeMobileQRModal(); };
    },

    closeMobileQRModal() {
        const modal = document.getElementById('modal-mobile-qr');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
    },

    // Ouvrir directement la fiche publique dans un nouvel onglet
    openPublicViewDirect() {
        const url = this.generatePayload(this.currentPermitId || App.currentPermitId);
        if (url) {
            window.open(url, '_blank');
        }
    },

    // Copier l'URL permanente du QR Code
    copyQRLink() {
        const urlInput = document.getElementById('mobile-qr-link-url');
        if (urlInput) {
            navigator.clipboard.writeText(urlInput.value).then(() => {
                App.showToast('📋 Lien QR officiel copié dans le presse-papier !', 'success');
            }).catch(() => {
                urlInput.select();
                document.execCommand('copy');
                App.showToast('📋 Lien copié !', 'success');
            });
        }
    },

    // Télécharger l'image PNG du QR Code
    downloadQRPNG(permitId) {
        const targetId = permitId || this.currentPermitId || App.currentPermitId;
        const permit = Store.getPermit(targetId);
        if (!permit) return;

        const dataUrl = this.getDataURL(permit, 600);
        if (!dataUrl) return;

        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `QR_PERMIS_${permit.id}_SINYLON_STELLANTIS.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        App.showToast('📥 QR Code HD téléchargé avec succès !', 'success');
    },

    // Imprimer l'affiche QR Poster A4 depuis le modal
    printPosterFromModal() {
        this.closeMobileQRModal();
        PrintEngine.printQROnly(this.currentPermitId || App.currentPermitId);
    },

    // =========================================================================
    // MODAL VÉRIFICATEUR DE QR CODE
    // =========================================================================

    openVerifierModal() {
        const modal = document.getElementById('modal-verifier');
        if (!modal) return;
        const input = document.getElementById('verifier-input-text') || document.getElementById('verifier-url-input');
        if (input) input.value = '';
        const resBox = document.getElementById('verifier-result-box');
        if (resBox) resBox.innerHTML = '';
        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.onclick = (e) => { if (e.target === modal) QREngine.closeVerifierModal(); };
    },

    closeVerifierModal() {
        const modal = document.getElementById('modal-verifier');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
    },

    verifyPastedCode() {
        const input = document.getElementById('verifier-url-input');
        if (!input || !input.value.trim()) return;

        const raw = input.value.trim();
        let permitId = null;

        if (raw.includes('permitId=')) {
            const urlObj = new URL(raw.startsWith('http') ? raw : `http://${raw}`);
            permitId = urlObj.searchParams.get('permitId');
        } else if (raw.startsWith('K9-') || raw.startsWith('SYN-')) {
            permitId = raw;
        }

        const resBox = document.getElementById('verifier-result-box');
        if (!resBox) return;

        if (!permitId) {
            resBox.innerHTML = `<div class="alert alert-danger" style="margin-top: 12px;">❌ Code QR non reconnu. Format attendu : <code>K9-W35-01</code> ou URL officielle.</div>`;
            return;
        }

        const permit = Store.getPermit(permitId);
        if (!permit) {
            resBox.innerHTML = `<div class="alert alert-danger" style="margin-top: 12px;">❌ Permis <strong>${permitId}</strong> introuvable dans la base de données K9.</div>`;
            return;
        }

        resBox.innerHTML = `
            <div style="background: #064e3b; border: 1px solid #10b981; border-radius: 8px; padding: 12px; margin-top: 12px; color: #ecfdf5;">
                <div style="font-weight: 800; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                    <span>✅</span> <span>PERMIS AUTHENTIQUE ET VALIDE : ${permit.id}</span>
                </div>
                <div style="font-size: 12px; margin-top: 6px;">
                    <strong>Activité :</strong> ${(permit.activity && permit.activity.en) || permit.title}<br>
                    <strong>Zone :</strong> ${permit.ouvrage} — ${permit.zone}<br>
                    <strong>Responsable :</strong> ${permit.responsible || permit['chef-nom']}
                </div>
                <div style="margin-top: 10px; display: flex; gap: 8px;">
                    <button class="btn btn-primary btn-sm" onclick="App.openPermitPreview('${permit.id}'); QREngine.closeVerifierModal();">📄 Ouvrir le Permis A4</button>
                    <a href="${this.generatePayload(permit)}" target="_blank" class="btn btn-secondary btn-sm">📱 Ouvrir Fiche Mobile</a>
                </div>
            </div>
        `;
    }
};

window.QREngine = QREngine;
