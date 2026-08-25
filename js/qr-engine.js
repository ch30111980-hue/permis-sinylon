/**
 * SINYLON - STELLANTIS | QR Engine & Mobile Field Verification
 * Module "Mon QR" & Consultation Chantier Mobile sans compte
 * Contrôle d'accès par Code d'Autorisation & Journal de Traçabilité QR_TERRAIN
 * Export PNG, PDF Fiche QR et Impression directe
 */

const QREngine = {
    currentPermitId: null,

    // Récupérer l'URL de base pour la consultation mobile (Render.com / Serveur Web)
    getBaseURL() {
        const savedUrl = localStorage.getItem('sinylon_render_url');
        if (savedUrl && savedUrl.trim() !== '') {
            return savedUrl.trim().replace(/\/+$/, '');
        }
        // Si l'application tourne déjà en ligne (sur Render ou serveur web)
        if (window.location && window.location.protocol.startsWith('http') && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
            return window.location.origin + window.location.pathname.replace(/\/index\.html$/, '');
        }
        // URL par défaut Render configurée pour le projet Sinylon
        return 'https://permis-sinylon.onrender.com';
    },

    setRenderURL(url) {
        if (url) {
            localStorage.setItem('sinylon_render_url', url.trim());
        } else {
            localStorage.removeItem('sinylon_render_url');
        }
    },

    // Générer le lien Web officiel pour le QR Code (Smartphone-Ready)
    generatePayload(permit) {
        if (!permit) return '';
        const baseUrl = this.getBaseURL();
        // Format d'ancre direct : ouvre instantanément la fiche du permis sur mobile
        return `${baseUrl}/#${permit.id}`;
    },

    // Dessiner un QR Code net et contrasté dans un canvas
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

    // Obtenir une image DataURL du QR Code
    getDataURL(permit, size = 300) {
        const payload = this.generatePayload(permit);
        if (window.QRCodeGenerator) {
            return window.QRCodeGenerator.toDataURL(payload, { size: size });
        }
        return '';
    },

    // =========================================================================
    // 1. CONSULTATION CHANTIER MOBILE (SANS COMPTE REQUIS)
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
        document.getElementById('mobile-qr-permit-id').innerText = permit.id;
        document.getElementById('mobile-qr-company').innerText = permit.company || 'SINYLON';
        document.getElementById('mobile-qr-zone').innerText = `${permit.ouvrage || ''} — ${permit.zone || ''}`;
        document.getElementById('mobile-qr-location').innerText = permit.location || 'Site Industriel Stellantis';
        document.getElementById('mobile-qr-work').innerText = permit['work-desc'] || permit.title || 'Travaux autorisés';
        if (document.getElementById('mobile-qr-work-en')) {
            document.getElementById('mobile-qr-work-en').innerText = permit['work-desc-en'] || permit['title-en'] || '';
        }
        document.getElementById('mobile-qr-hours').innerText = `${permit['date-main']} (${permit['time-start']} → ${permit['time-end']})`;
        
        // Responsables
        document.getElementById('mobile-qr-chef').innerText = permit['chef-nom'] || 'Xie (Chef de Projet)';
        document.getElementById('mobile-qr-receveur').innerText = permit['receveur-nom'] || 'Xian (Receveur)';
        document.getElementById('mobile-qr-chef-equipe').innerText = permit.chef_equipe || permit['receveur-nom'] || 'Xian';
        document.getElementById('mobile-qr-contact').innerText = `${permit.contact || 'Nouri Chahrour'} (${permit.tel || '+213 550 12 34 56'})`;
        document.getElementById('mobile-qr-wpeex').innerText = permit['wpeex-nom'] || 'M. W.P.E.E.X (Ingénieur de Suivi)';

        // Badge Statut dynamique
        const badge = document.getElementById('mobile-qr-status-badge');
        const st = (permit.status || 'VALIDE').toUpperCase();
        badge.className = 'status-badge status-' + st.toLowerCase();
        
        let statusLabel = '🟢 VALIDE & ACTIF';
        if (st === 'REVALIDATION_REQUISE') statusLabel = '🟠 REVALIDATION REQUISE';
        else if (st === 'EN_ATTENTE_WPEEX' || st === 'ATTENTE_CSPS') statusLabel = '🟠 EN ATTENTE VALIDATION W.P.E.E.X / CSPS';
        else if (st === 'EXPIRE') statusLabel = '🔴 EXPIRÉ';
        else if (st === 'SUSPENDU') statusLabel = '🔴 SUSPENDU';
        else if (st === 'BLOQUE') statusLabel = '⛔ BLOQUÉ';
        else if (st === 'CLOTURE') statusLabel = '⚫ CLÔTURÉ';
        badge.innerHTML = statusLabel;

        // Type de permis
        let typeBadge = permit.type_permis || 'PERMIS GÉNÉRAL DE TRAVAIL';
        if (permit.type === 'hot') typeBadge = '🔥 TRAVAIL À CHAUD (ANNEXE ROUGE)';
        else if (permit.type === 'height') typeBadge = '🧗 TRAVAIL EN HAUTEUR (ANNEXE BLEUE)';
        else if (permit.type === 'electric') typeBadge = '⚡ TRAVAIL ÉLECTRIQUE (ANNEXE JAUNE)';
        document.getElementById('mobile-qr-type-badge').innerText = typeBadge;

        // Mesures de Sécurité & Annexes Applicables
        this.renderSafetyAnnexes(permit);

        // Liste des Intervenants / Travailleurs autorisés
        this.renderWorkersList(permit);

        // Liste des Revalidations du jour
        this.renderRevalidationsList(permit);

        // Historique des Modifications (Traçabilité QR_TERRAIN)
        this.renderAuditHistory(permit);

        // Générer le QR Code dans le canvas
        const canvas = document.getElementById('mobile-qr-canvas');
        if (canvas) {
            this.renderToCanvas(canvas, permit, { size: 260 });
        }

        modal.dataset.currentPermitId = permit.id;
        modal.classList.add('active');
    },

    // Rendu des mesures de sécurité et annexes activées
    renderSafetyAnnexes(permit) {
        const container = document.getElementById('mobile-qr-safety-annexes');
        if (!container) return;

        const h = permit.heightDetails || {};
        const hot = permit.hotDetails || {};
        const el = permit.electricDetails || {};

        container.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    <span class="badge badge-sky" style="font-size: 10px;">🔵 Annexe Hauteur : 6 Nacelles Ciseaux + 1 Manlift</span>
                    <span class="badge badge-red" style="font-size: 10px;">🔴 Annexe Chaud : Extincteurs + Bâches ignifugées</span>
                    <span class="badge badge-yellow" style="font-size: 10px;">🟡 Annexe Élec & Matériel : Câbles, Armoires, Moteurs</span>
                </div>
                <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.4; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 6px;">
                    <div>⚠️ <strong>Travail en Hauteur :</strong> Travail exclusivement en nacelles élévatrices PEMP, port obligatoire du harnais avec longe courte.</div>
                    <div>🧯 <strong>Travail à Chaud :</strong> Dégagement 10m, extincteurs Eau+Poudre+CO2 à portée. Pas de détecteurs de fumée usine en phase montage. Surveillance continue pendant les travaux.</div>
                    <div>⚡ <strong>Travaux Électriques & Équipements :</strong> Tirage de câbles, pose et raccordement des armoires électriques, installation des moteurs et équipements industriels (Lignes UB / UAR / FUSA). Consignation LOTO & VAT.</div>
                </div>
                <div style="display: flex; gap: 6px; margin-top: 4px;">
                    <button type="button" onclick="App.openPermitPreview('${permit.id}'); App.switchPreviewTab('p1'); QREngine.closeMobileQRModal();" class="btn btn-secondary btn-sm" style="font-size: 10px; padding: 2px 6px;">📄 Recto A4</button>
                    <button type="button" onclick="App.openPermitPreview('${permit.id}'); App.switchPreviewTab('height'); QREngine.closeMobileQRModal();" class="btn btn-secondary btn-sm" style="font-size: 10px; padding: 2px 6px; color: #38bdf8;">🔵 A (Hauteur)</button>
                    <button type="button" onclick="App.openPermitPreview('${permit.id}'); App.switchPreviewTab('hot'); QREngine.closeMobileQRModal();" class="btn btn-secondary btn-sm" style="font-size: 10px; padding: 2px 6px; color: #f87171;">🔴 B (Chaud)</button>
                    <button type="button" onclick="App.openPermitPreview('${permit.id}'); App.switchPreviewTab('electric'); QREngine.closeMobileQRModal();" class="btn btn-secondary btn-sm" style="font-size: 10px; padding: 2px 6px; color: #facc15;">🟡 C (Élec)</button>
                </div>
            </div>
        `;
    },

    closeMobileQRModal() {
        const modal = document.getElementById('modal-mobile-qr');
        if (modal) modal.classList.remove('active');
    },

    // Rendu de la liste des intervenants sur la fiche mobile
    renderWorkersList(permit) {
        const container = document.getElementById('mobile-qr-workers-list');
        if (!container) return;

        const workers = permit.travailleurs || [];
        if (workers.length === 0) {
            container.innerHTML = `<div style="color: var(--text-secondary); font-size: 12px; font-style: italic;">Aucun intervenant enregistré. Cliquez sur "Modifier" pour ajouter.</div>`;
            return;
        }

        let html = '<div class="mobile-workers-grid">';
        workers.forEach((w, index) => {
            html += `
                <div class="mobile-worker-card">
                    <div class="worker-avatar">👷</div>
                    <div class="worker-info">
                        <div class="worker-name"><strong>${w.nom || 'Intervenant'}</strong></div>
                        <div class="worker-role">${w.role || 'Opérateur'}</div>
                        <div class="worker-badge"><span class="badge badge-sm badge-outline">${w.badge || 'Badge SYN-' + (index + 10)}</span></div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    },

    // Rendu de l'historique des revalidations sur la fiche mobile
    renderRevalidationsList(permit) {
        const container = document.getElementById('mobile-qr-revals-list');
        if (!container) return;

        const revals = permit.revalidations || [];
        if (revals.length === 0) {
            container.innerHTML = `<div style="color: var(--text-secondary); font-size: 12px;">Aucune revalidation enregistrée à ce jour.</div>`;
            return;
        }

        let html = '<div class="mobile-reval-timeline">';
        revals.forEach(r => {
            html += `
                <div class="mobile-reval-item">
                    <div class="reval-time-badge">📅 ${r.date} à ${r.time} (${r.session || 'Session'})</div>
                    <div class="reval-desc">Visa W.P.E.E.X : <strong>${r.wpeexEngineer}</strong> | Responsable : <strong>${r.execManager}</strong></div>
                    <div class="reval-comment"><em>"${r.comments || 'Conforme'}"</em></div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    },

    // Rendu du journal d'audit (Traçabilité QR_TERRAIN)
    renderAuditHistory(permit) {
        const container = document.getElementById('mobile-qr-audit-list');
        if (!container) return;

        const logs = permit.historique_modifications || [];
        if (logs.length === 0) {
            container.innerHTML = `<div style="color: var(--text-secondary); font-size: 12px;">Aucune modification terrain enregistrée.</div>`;
            return;
        }

        let html = '<div class="mobile-audit-timeline">';
        logs.forEach(log => {
            const isQR = log.methode === 'QR_TERRAIN';
            html += `
                <div class="mobile-audit-item ${isQR ? 'audit-qr' : ''}">
                    <div class="audit-header">
                        <span class="badge ${isQR ? 'badge-primary' : 'badge-secondary'} badge-sm">
                            ${isQR ? '📱 QR_TERRAIN' : log.methode || 'SYSTÈME'}
                        </span>
                        <span class="audit-date">${log.date} à ${log.heure}</span>
                    </div>
                    <div class="audit-field">Champ modifié : <strong>${log.champ}</strong></div>
                    <div class="audit-diff">
                        <span class="diff-old">Ancien : <del>${log.ancienne_valeur}</del></span>
                        <span class="diff-arrow"> ➔ </span>
                        <span class="diff-new">Nouveau : <ins>${log.nouvelle_valeur}</ins></span>
                    </div>
                    <div class="audit-author">Auteur : <em>${log.auteur || 'Superviseur Chantier'}</em></div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    },

    // =========================================================================
    // 2. MODIFICATION CONTRÔLÉE PAR CODE D'AUTORISATION
    // =========================================================================

    openModifyModal(permitId) {
        const id = permitId || this.currentPermitId || App.currentPermitId;
        const permit = Store.getPermit(id);
        if (!permit) {
            App.showToast('⚠️ Permis introuvable', 'error');
            return;
        }

        this.currentPermitId = permit.id;
        const modal = document.getElementById('modal-qr-modify');
        if (!modal) return;

        document.getElementById('modify-permit-id-label').innerText = permit.id;
        document.getElementById('modify-permit-title-label').innerText = permit.title || permit['work-desc'] || 'Permis Sinylon';
        
        // Reset form
        document.getElementById('modify-auth-code').value = '';
        document.getElementById('modify-author-name').value = 'Superviseur Chantier';
        document.getElementById('modify-new-value').value = '';
        document.getElementById('modify-field-select').selectedIndex = 0;
        this.onModifyFieldChange();

        modal.classList.add('active');
    },

    closeModifyModal() {
        const modal = document.getElementById('modal-qr-modify');
        if (modal) modal.classList.remove('active');
    },

    onModifyFieldChange() {
        const select = document.getElementById('modify-field-select');
        const fieldKey = select.value;
        const permit = Store.getPermit(this.currentPermitId);
        if (!permit) return;

        const container = document.getElementById('modify-field-inputs-container');
        if (!container) return;

        if (fieldKey === 'travailleurs_add') {
            container.innerHTML = `
                <div class="form-group" style="margin-bottom: 8px;">
                    <label>Nom et Prénom de l'Intervenant :</label>
                    <input type="text" id="mod-worker-name" class="form-control" placeholder="Ex: Karim Belkacem">
                </div>
                <div class="form-grid-2">
                    <div class="form-group">
                        <label>Rôle / Fonction :</label>
                        <input type="text" id="mod-worker-role" class="form-control" placeholder="Ex: Soudeur / Monteur">
                    </div>
                    <div class="form-group">
                        <label>N° de Badge :</label>
                        <input type="text" id="mod-worker-badge" class="form-control" placeholder="Ex: SYN-045">
                    </div>
                </div>
            `;
        } else if (fieldKey === 'travailleurs_remove') {
            const workers = permit.travailleurs || [];
            let optionsHtml = workers.map(w => `<option value="${w.id || w.nom}">${w.nom} (${w.role || 'Opérateur'} - ${w.badge || 'Sans badge'})</option>`).join('');
            if (workers.length === 0) optionsHtml = '<option value="">Aucun intervenant à retirer</option>';
            container.innerHTML = `
                <div class="form-group">
                    <label>Sélectionner l'intervenant à retirer de l'équipe :</label>
                    <select id="mod-worker-select-remove" class="form-control">
                        ${optionsHtml}
                    </select>
                </div>
            `;
        } else {
            let currentVal = permit[fieldKey] || '';
            container.innerHTML = `
                <div class="form-group">
                    <label>Valeur Actuelle :</label>
                    <input type="text" class="form-control" value="${currentVal}" disabled style="background: rgba(255,255,255,0.05); color: var(--text-secondary);">
                </div>
                <div class="form-group">
                    <label>Nouvelle Valeur :</label>
                    <input type="text" id="modify-new-value" class="form-control" placeholder="Entrez la nouvelle valeur...">
                </div>
            `;
        }
    },

    submitFieldModification() {
        const permitId = this.currentPermitId;
        const select = document.getElementById('modify-field-select');
        const fieldKey = select.value;
        const authCode = document.getElementById('modify-auth-code').value;
        const authorName = document.getElementById('modify-author-name').value || 'Superviseur Chantier';

        if (!authCode || authCode.trim() === '') {
            App.showToast('❌ Le code d\'autorisation est obligatoire !', 'error');
            document.getElementById('modify-auth-code').focus();
            return;
        }

        let newValue = null;

        if (fieldKey === 'travailleurs_add') {
            const name = document.getElementById('mod-worker-name').value;
            const role = document.getElementById('mod-worker-role').value;
            const badge = document.getElementById('mod-worker-badge').value;

            if (!name || name.trim() === '') {
                App.showToast('⚠️ Veuillez renseigner le nom de l\'intervenant.', 'warning');
                return;
            }

            newValue = {
                id: 'T-' + Date.now(),
                nom: name.trim(),
                role: role ? role.trim() : 'Opérateur Chantier',
                badge: badge ? badge.trim() : 'SYN-' + Math.floor(100 + Math.random() * 900)
            };
        } else if (fieldKey === 'travailleurs_remove') {
            const selectWorker = document.getElementById('mod-worker-select-remove');
            const targetVal = selectWorker ? selectWorker.value : null;
            if (!targetVal) {
                App.showToast('⚠️ Aucun intervenant sélectionné.', 'warning');
                return;
            }
            const permit = Store.getPermit(permitId);
            const workerObj = (permit.travailleurs || []).find(w => w.id === targetVal || w.nom === targetVal);
            newValue = workerObj || { nom: targetVal };
        } else {
            const inputVal = document.getElementById('modify-new-value');
            if (!inputVal || !inputVal.value || inputVal.value.trim() === '') {
                App.showToast('⚠️ Veuillez saisir la nouvelle valeur.', 'warning');
                return;
            }
            newValue = inputVal.value.trim();
        }

        // Application de la modification via le Store (Vérifie le code + Enregistre dans l'historique QR_TERRAIN)
        const result = Store.applyFieldModification(permitId, fieldKey, newValue, authCode, authorName);

        if (!result.success) {
            App.showToast(`⛔ ÉCHEC : ${result.error}`, 'error', 4000);
            return;
        }

        // Succès : Fermeture modal & Rafraîchissement direct
        this.closeModifyModal();
        this.openMobileQRModal(permitId);
        App.renderDashboard();
        App.renderPermitList();
        App.showToast(`✅ Modification validée & enregistrée dans l'historique d'audit (QR_TERRAIN)`, 'success', 4000);
    },

    // =========================================================================
    // 3. OUTILS D'EXPORT DU QR (IMAGE PNG, PDF & PRINT)
    // =========================================================================

    // Sauvegarder l'image QR PNG
    saveQRImage(permitId) {
        const id = permitId || this.currentPermitId || App.currentPermitId;
        const permit = Store.getPermit(id);
        if (!permit) return;

        const dataUrl = this.getDataURL(permit, 600);
        if (!dataUrl) {
            App.showToast('⚠️ Erreur de génération du QR Code', 'error');
            return;
        }

        if (window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                ipcRenderer.invoke('save-qr-image', {
                    base64Data: dataUrl,
                    filename: `QR_SINYLON_${permit.id}.png`
                }).then(res => {
                    if (res && res.success) {
                        App.showToast(`💾 Image QR enregistrée : ${res.filePath}`, 'success');
                    }
                });
                return;
            } catch (e) {}
        }

        // Navigateur standard : téléchargement automatique
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `QR_SINYLON_${permit.id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        App.showToast('📲 QR Code enregistré pour le téléphone !', 'success');
    },

    // Exporter la fiche QR en format PDF synthétique
    exportQRPDF(permitId) {
        const id = permitId || this.currentPermitId || App.currentPermitId;
        PrintEngine.printQROnly(id);
    },

    // Imprimer directement la fiche d'affichage QR
    printQRSheet(permitId) {
        const id = permitId || this.currentPermitId || App.currentPermitId;
        PrintEngine.printQROnly(id);
    },

    // =========================================================================
    // 4. SCANNER / VÉRIFICATEUR MANUEL
    // =========================================================================

    openVerifierModal() {
        const modal = document.getElementById('modal-qr-verifier');
        if (modal) {
            document.getElementById('verifier-input-text').value = '';
            document.getElementById('verifier-result').innerHTML = '';
            modal.classList.add('active');
        }
    },

    closeVerifierModal() {
        const modal = document.getElementById('modal-qr-verifier');
        if (modal) modal.classList.remove('active');
    },

    verifyScannedCode(input) {
        const resultContainer = document.getElementById('verifier-result');
        if (!input || !input.trim()) {
            resultContainer.innerHTML = '<div class="alert alert-warning">Veuillez coller un code ou numéro de permis.</div>';
            return;
        }

        let targetId = input.trim();
        try {
            const parsed = JSON.parse(input);
            if (parsed.id) targetId = parsed.id;
        } catch (e) {}

        const permit = Store.getPermit(targetId);
        if (!permit) {
            resultContainer.innerHTML = `
                <div class="alert alert-danger" style="margin-top: 12px;">
                    <strong>❌ Permis Introuvable</strong><br>
                    Aucun permis correspondant à l'identifiant <code>${targetId}</code> n'a été trouvé dans la base locale.
                </div>
            `;
            return;
        }

        resultContainer.innerHTML = `
            <div class="alert alert-success" style="margin-top: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <strong>✅ PERMIS VALIDE EN BASE : ${permit.id}</strong>
                    <span class="badge badge-success">${permit.status || 'VALIDE'}</span>
                </div>
                <div><strong>Type :</strong> ${permit.type_permis || permit.type}</div>
                <div><strong>Entreprise :</strong> ${permit.company || 'SINYLON'}</div>
                <div><strong>Zone :</strong> ${permit.ouvrage || ''} (${permit.zone || ''})</div>
                <div><strong>Responsable :</strong> ${permit['chef-nom'] || ''} | <strong>Receveur :</strong> ${permit['receveur-nom'] || ''}</div>
                <div><strong>Intervenants :</strong> ${(permit.travailleurs || []).length} personnes enregistrées</div>
                <div style="margin-top: 12px; display: flex; gap: 8px;">
                    <button onclick="QREngine.closeVerifierModal(); QREngine.openMobileQRModal('${permit.id}');" class="btn btn-primary btn-sm">
                        📱 Ouvrir Fiche Chantier Mobile
                    </button>
                    <button onclick="QREngine.closeVerifierModal(); App.openPermitPreview('${permit.id}');" class="btn btn-secondary btn-sm">
                        📄 Voir Document A4
                    </button>
                </div>
            </div>
        `;
    }
};

window.QREngine = QREngine;
