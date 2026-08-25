/**
 * SINYLON - STELLANTIS | QR Engine V2
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
            return window.location.origin + window.location.pathname.replace(/\/index\.html$/, '');
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
        const baseUrl = this.getBaseURL();
        return `${baseUrl}/?permitId=${encodeURIComponent(permit.id)}`;
    },

    // Dessiner un QR Code sur un canvas HTML
    renderToCanvas(canvasElement, permit, options = {}) {
        if (!canvasElement || !permit) return;
        const payload = this.generatePayload(permit);
        const size = options.size || 256;

        if (window.QRCodeGenerator || window.QRCode) {
            const engine = window.QRCodeGenerator || window.QRCode;
            engine.drawCanvas(canvasElement, payload, {
                size: size,
                margin: options.margin !== undefined ? options.margin : 2,
                darkColor: options.darkColor || '#000000',
                lightColor: options.lightColor || '#ffffff'
            });
        }
    },

    // Obtenir l'image Base64 DataURL du QR Code
    getDataURL(permit, size = 300) {
        const payload = this.generatePayload(permit);
        if (window.QRCodeGenerator) {
            return window.QRCodeGenerator.toDataURL(payload, { size: size });
        }
        return '';
    },

    // =========================================================================
    // MODAL QR & ACTIONS RAPIDES
    // =========================================================================

    openMobileQRModal(permitId) {
        const permit = Store.getPermit(permitId || App.currentPermitId);
        if (!permit) {
            App.showToast('⚠️ Permis introuvable', 'error');
            return;
        }

        this.currentPermitId = permit.id;
        const modal = document.getElementById('modal-mobile-qr');
        if (!modal) return;

        // Informations d'en-tête
        const elId = document.getElementById('mobile-qr-permit-id');
        if (elId) elId.innerText = permit.id;

        const elComp = document.getElementById('mobile-qr-company');
        if (elComp) elComp.innerText = permit.contractor || permit.company || 'SINYLON';

        const elZone = document.getElementById('mobile-qr-zone');
        if (elZone) elZone.innerText = `${permit.ouvrage || 'Atelier Montage'} — ${permit.zone || 'Zone 4'}`;

        const elWork = document.getElementById('mobile-qr-work');
        if (elWork) {
            elWork.innerText = (permit.activity && (permit.activity.en || permit.activity.fr)) || permit['work-desc'] || permit.title || 'Travaux de Montage';
        }

        const elDates = document.getElementById('mobile-qr-hours');
        if (elDates) {
            elDates.innerText = `${permit.validFrom || permit['date-main']} → ${permit.validUntil || permit['date_fin'] || ''} (${permit.timeStart || permit['time-start'] || '07h30'} - ${permit.timeEnd || permit['time-end'] || '18h00'})`;
        }

        const elResp = document.getElementById('mobile-qr-chef');
        if (elResp) elResp.innerText = permit.responsible || permit.chefNom || permit['chef-nom'] || 'Nouri Chahrour';

        const elHse = document.getElementById('mobile-qr-contact');
        if (elHse) elHse.innerText = permit.hseNom || permit.contact || 'Nouri Chahrour (0563765157)';

        // Rendu du QR Code dans le canvas du modal
        const canvas = document.getElementById('mobile-qr-canvas-preview');
        if (canvas) {
            this.renderToCanvas(canvas, permit, { size: 280, margin: 2 });
        }

        const urlText = document.getElementById('mobile-qr-link-url');
        if (urlText) {
            urlText.value = this.generatePayload(permit);
        }

        modal.dataset.currentPermitId = permit.id;
        modal.classList.add('active');
    },

    closeMobileQRModal() {
        const modal = document.getElementById('modal-mobile-qr');
        if (modal) modal.classList.remove('active');
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

        const dataUrl = this.getDataURL(permit, 500);
        if (!dataUrl) return;

        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `QR_PERMIS_${permit.id}_SINYLON_STELLANTIS.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        App.showToast(`📥 Image QR Code (${permit.id}) téléchargée en haute résolution !`, 'success');
    },

    // Déclencher l'impression de l'Affiche QR Chantier depuis le modal
    printPosterFromModal() {
        if (!this.currentPermitId) return;
        this.closeMobileQRModal();
        PrintEngine.printQROnly(this.currentPermitId);
    },

    // Ouvrir le scanner / vérificateur
    openVerifierModal() {
        const modal = document.getElementById('modal-verifier');
        if (modal) modal.classList.add('active');
    },

    closeVerifierModal() {
        const modal = document.getElementById('modal-verifier');
        if (modal) modal.classList.remove('active');
    }
};

window.QREngine = QREngine;
