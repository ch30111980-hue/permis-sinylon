/**
 * SINYLON - STELLANTIS | Print & PDF Engine
 * Moteur d'impression A4 et d'exportation PDF certifié
 */

const PrintEngine = {
    // Imprimer uniquement la page actuellement visualisée à l'écran (Page 1 seule, ou Annexe seule)
    printCurrentPreview() {
        const container = document.getElementById('a4-preview-render');
        const printContainer = document.getElementById('print-container');
        if (!container || !printContainer) return;

        printContainer.innerHTML = container.innerHTML;

        setTimeout(() => {
            if (window.require) {
                try {
                    const { ipcRenderer } = window.require('electron');
                    ipcRenderer.invoke('print-document');
                    return;
                } catch (e) {}
            }
            window.print();
            setTimeout(() => {
                printContainer.innerHTML = '';
            }, 1000);
        }, 100);
    },

    // Imprimer un permis spécifique avec toutes ses pages et annexes (5 Pages A4)
    printPermit(permitId) {
        const store = typeof window !== 'undefined' && window.Store ? window.Store : Store;
        const templates = typeof window !== 'undefined' && window.Templates ? window.Templates : Templates;
        const targetId = permitId || (typeof window !== 'undefined' && window.App && window.App.currentPermitId) || 'SYN-K9-KW36';
        
        const permit = store.getPermit(targetId);
        if (!permit) {
            if (typeof window !== 'undefined' && window.App) window.App.showToast('⚠️ Permis introuvable pour impression', 'error');
            return;
        }

        const printContainer = document.getElementById('print-container');
        if (!printContainer) return;

        // Construire l'intégralité du dossier officiel certifié (5 Pages A4)
        let htmlPages = [];

        // 1. Permis Général Hebdomadaire (Page 1)
        htmlPages.push(templates.generalP1(permit));

        // 2. Annexe A : Travail en Hauteur (Page 2)
        htmlPages.push(templates.heightAnnexe(permit));

        // 3. Annexe B : Travail à Chaud (Page 3)
        htmlPages.push(templates.hotAnnexe(permit));

        // 4. Annexe C : Travail Électrique & Consignation (Page 4)
        htmlPages.push(templates.electricAnnexe(permit));

        // 5. Affiche A4 QR Code de Zone (Page 5)
        if (typeof this.getPosterHtml === 'function') {
            htmlPages.push(this.getPosterHtml(permit));
        }

        printContainer.innerHTML = htmlPages.join('');

        // Déclencher l'impression instantanée
        setTimeout(() => {
            if (typeof window !== 'undefined' && window.require) {
                try {
                    const { ipcRenderer } = window.require('electron');
                    ipcRenderer.invoke('print-document');
                    return;
                } catch (e) {}
            }
            if (typeof window !== 'undefined') {
                window.print();
            }
            setTimeout(() => {
                printContainer.innerHTML = '';
            }, 1000);
        }, 100);
    },

    // Imprimer uniquement le QR Code en grand format pour affichage sur chantier
    printQROnly(permitId) {
        const store = typeof window !== 'undefined' && window.Store ? window.Store : Store;
        const targetId = permitId || (typeof window !== 'undefined' && window.App && window.App.currentPermitId) || 'K9-W35-01';
        const permit = store.getPermit(targetId);
        if (!permit) return;

        const printContainer = document.getElementById('print-container');
        if (!printContainer) return;

        printContainer.innerHTML = `
            <div class="a4-document qr-only-print-page" style="padding: 12mm 15mm; display: flex; flex-direction: column; justify-content: space-between; min-height: 270mm; border: 3px solid #000; box-sizing: border-box; background: #ffffff;">
                
                <!-- 1. TITRE GÉANT EN HAUT -->
                <div style="text-align: center; border-bottom: 4px solid #000; padding-bottom: 8px; margin-bottom: 12px;">
                    <div style="font-size: 34px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; color: #000000; line-height: 1.1;">
                        PERMIS DE TRAVAIL
                    </div>
                    <div style="font-size: 14px; font-weight: 700; color: #334155; margin-top: 4px;">
                        AFFICHAGE OFFICIEL DE SÉCURITÉ SUR LE LIEU DE TRAVAIL
                    </div>
                </div>

                <!-- 2. EN-TÊTE LOGOS & IDENTIFIANT -->
                <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 2px solid #000; padding: 8px 14px; border-radius: 4px; margin-bottom: 14px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="background: #000; color: #fff; padding: 4px 10px; font-weight: 900; font-size: 14px; border-radius: 3px;">SINYLON</span>
                        <span style="border: 2px solid #000; padding: 3px 10px; font-weight: 900; font-size: 14px; border-radius: 3px; background: #fff;">STELLANTIS</span>
                    </div>
                    <div style="font-size: 13px; font-weight: 800; color: #000;">
                        Maître de l'Ouvrage : <strong>STELLANTIS</strong>
                    </div>
                    <div style="border: 2px solid #000; padding: 4px 12px; font-weight: 900; font-size: 14px; background: #e2e8f0; border-radius: 3px;">
                        PERMIS N° ${permit.id}
                    </div>
                </div>

                <!-- 3. GRAND QR CODE AU CENTRE (VECTORIEL SVG CRISTALLIN) -->
                <div style="text-align: center; margin: 10px 0; display: flex; flex-direction: column; align-items: center;">
                    <div style="display: inline-flex; align-items: center; justify-content: center; padding: 12px; background: #ffffff; border: 3px solid #000; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 320px; height: 320px;">
                        ${(window.QRCodeGenerator && window.QRCodeGenerator.toSVG(QREngine.generatePayload(permit), { size: 300, margin: 2 })) || '<canvas id="qr-poster-canvas"></canvas>'}
                    </div>
                    <div style="margin-top: 10px; font-size: 18px; font-weight: 900; color: #15803d; background: #dcfce7; border: 2px solid #15803d; padding: 4px 20px; border-radius: 20px; display: inline-block;">
                        🟢 STATUT : ${permit.status || 'VALIDE & ACTIF'}
                    </div>
                </div>

                <!-- 4. DÉTAILS OPÉRATIONNELS DU CHANTIER -->
                <div style="border: 2px solid #000; border-radius: 4px; overflow: hidden; margin-top: 10px; font-size: 12px;">
                    <div style="background: #000; color: #fff; font-weight: 800; padding: 6px 12px; font-size: 13px; text-transform: uppercase;">
                        📋 Informations du Chantier & Responsables
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 10px 14px; background: #ffffff;">
                        <div>🏢 <strong>Entreprise :</strong> SINYLON</div>
                        <div>📍 <strong>Zone / Atelier :</strong> ${permit.ouvrage || 'Atelier Montage'} (${permit.zone || ''})</div>
                        <div>👨‍💼 <strong>Chef de Projet :</strong> ${permit['chef-nom'] || 'XIE XIAN (Chef de Projet)'}</div>
                        <div>📋 <strong>Chef d'Équipe :</strong> ${permit.chef_equipe || 'ZHOULIN (Chef d\'Équipe)'}</div>
                        <div>📞 <strong>Contact HSE :</strong> ${permit.contact || 'Nouri Chahrour'} (${permit.tel || '0563765157'})</div>
                        <div>🛡️ <strong>Ingénieur de Suivi :</strong> ${permit['wpeex-nom'] || 'M. W.P.E.E.X (Ingénieur de Suivi)'}</div>
                        <div style="grid-column: span 2;">⏰ <strong>Période de Validité :</strong> ${permit.validFrom || permit['date-main']} → ${permit.validUntil || permit['date_fin'] || ''} (${permit.timeStart || '08h00'} → ${permit.timeEnd || '17h30'})</div>
                        <div style="grid-column: span 2; border-top: 1px dashed #94a3b8; padding-top: 6px; color: #0f172a;">
                            <strong>🛠️ Travaux Autorisés :</strong> ${permit['work-desc'] || permit.title || ''}
                        </div>
                    </div>
                </div>

                <!-- 5. BANDEAU D'INSTRUCTION EN BAS -->
                <div style="margin-top: 14px; padding: 12px 16px; background: #000000; color: #ffffff; text-align: center; border-radius: 6px;">
                    <div style="font-size: 16px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">
                        📲 SCANNEZ LE PERMIS AVEC VOTRE SMARTPHONE
                    </div>
                    <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">
                        Accédez directement au permis officiel, à la liste des intervenants et aux mesures de sécurité
                    </div>
                </div>
            </div>
        `;

        const canvas = document.getElementById('qr-poster-canvas');
        if (canvas) {
            QREngine.renderToCanvas(canvas, permit, { size: 360 });
        }

        setTimeout(() => {
            if (window.require) {
                try {
                    const { ipcRenderer } = window.require('electron');
                    ipcRenderer.invoke('print-document');
                    return;
                } catch (e) {}
            }
            window.print();
        }, 150);
    },

    // Imprimer l'intégralité du Dossier Caisse Week-end pour Stellantis
    printFullWeekendDossier(permitsList) {
        const printContainer = document.getElementById('print-container');
        if (!printContainer) return;

        const dates = WeekendCaisseModule.getWeekendDates();
        let htmlPages = [];

        // Page 1 : Feuille récapitulative pour Stellantis
        htmlPages.push(Templates.weekendSummarySheet(dates, permitsList));

        // Pages suivantes : Chaque permis de travail avec son Recto et son Annexe
        permitsList.forEach(permit => {
            htmlPages.push(Templates.generalP1(permit));
            htmlPages.push(Templates.generalP2(permit));

            const d = permit.dangers || {};
            if (permit.type === 'height' || d.height) htmlPages.push(Templates.heightAnnexe(permit));
            if (permit.type === 'hot' || d.hot) htmlPages.push(Templates.hotAnnexe(permit));
            if (permit.type === 'electric' || d.electric) htmlPages.push(Templates.electricAnnexe(permit));
        });

        printContainer.innerHTML = htmlPages.join('');

        // Injecter les QR codes
        permitsList.forEach(permit => {
            this.injectPrintQRCodes(permit);
        });

        setTimeout(() => {
            if (window.require) {
                try {
                    const { ipcRenderer } = window.require('electron');
                    ipcRenderer.invoke('print-document');
                    return;
                } catch (e) {}
            }
            window.print();
        }, 200);
    },

    // Export PDF direct
    exportPermitPDF(permitId) {
        const permit = Store.getPermit(permitId);
        if (!permit) return;

        // Préparer le conteneur
        this.printPermit(permitId);

        if (window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                ipcRenderer.invoke('export-pdf', { filename: `PERMIS_${permit.id}_SINYLON_STELLANTIS.pdf` })
                    .then(res => {
                        if (res.success) {
                            App.showToast(`✅ Permis exporté en PDF : ${res.filePath}`, 'success');
                        }
                    });
                return;
            } catch (e) {}
        }

        // Web fallback : déclenche le dialogue d'impression du navigateur pour Enregistrer au format PDF
        App.showToast('Veuillez sélectionner "Enregistrer au format PDF" dans la boîte de dialogue d\'impression.', 'info');
        window.print();
    },

    // Injecter les QR Codes dans les conteneurs du DOM d'impression
    injectPrintQRCodes(permit) {
        const qrContainers = document.querySelectorAll('.qr-container');
        qrContainers.forEach(container => {
            const canvas = document.createElement('canvas');
            QREngine.renderToCanvas(canvas, permit, { size: 100, margin: 1 });
            container.innerHTML = '';
            container.appendChild(canvas);
        });
    },

    // Imprimer l'affiche A4 réglementaire spécifique pour une zone (UB, UAR, FUSA)
    printZonePoster(permitId, zoneKey = null) {
        const store = typeof window !== 'undefined' && window.Store ? window.Store : Store;
        const templates = typeof window !== 'undefined' && window.Templates ? window.Templates : Templates;
        const targetId = permitId || (typeof window !== 'undefined' && window.App && window.App.currentPermitId) || 'SYN-K9-KW36';
        const permit = store.getPermit(targetId);
        if (!permit) {
            if (window.App) window.App.showToast('⚠️ Permis introuvable', 'error');
            return;
        }

        const printContainer = document.getElementById('print-container');
        if (!printContainer) return;

        printContainer.innerHTML = templates.renderZonePosterA4(permit, zoneKey || permit.zoneKey);

        setTimeout(() => {
            if (typeof window !== 'undefined' && window.require) {
                try {
                    const { ipcRenderer } = window.require('electron');
                    ipcRenderer.invoke('print-document');
                    return;
                } catch (e) {}
            }
            window.print();
            setTimeout(() => {
                printContainer.innerHTML = '';
            }, 1000);
        }, 120);
    }
};

window.PrintEngine = PrintEngine;
