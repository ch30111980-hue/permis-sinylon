/**
 * SINYLON - STELLANTIS | Print & PDF Engine
 * Moteur d'impression A4 et d'exportation PDF certifié
 * Mémorisation automatique de l'imprimante réseau / Mac
 */

const PrintEngine = {
    // Obtenir le nom de l'imprimante configurée par l'utilisateur
    getSelectedPrinter() {
        try {
            return localStorage.getItem('sinylon_selected_printer') || '';
        } catch(e) {
            return '';
        }
    },

    setSelectedPrinter(printerName) {
        try {
            if (printerName) {
                localStorage.setItem('sinylon_selected_printer', printerName);
            } else {
                localStorage.removeItem('sinylon_selected_printer');
            }
        } catch(e) {}
    },

    // Déclencher l'impression via Electron ou navigateur
    async executePrint(onComplete) {
        const printContainer = document.getElementById('print-container');
        const selectedPrinter = this.getSelectedPrinter();

        if (typeof window !== 'undefined' && window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                const printOpts = {
                    deviceName: selectedPrinter || undefined,
                    silent: false
                };
                const res = await ipcRenderer.invoke('print-document', printOpts);
                if (printContainer) {
                    setTimeout(() => { printContainer.innerHTML = ''; }, 3000);
                }
                if (onComplete) onComplete(res);
                return;
            } catch (e) {
                console.warn('IPC Print fallback:', e);
            }
        }

        if (typeof window !== 'undefined') {
            window.print();
            if (printContainer) {
                setTimeout(() => { printContainer.innerHTML = ''; }, 3000);
            }
            if (onComplete) onComplete({ success: true });
        }
    },

    // Imprimer uniquement la page actuellement visualisée à l'écran (Page 1 seule, ou Annexe seule)
    printCurrentPreview() {
        const container = document.getElementById('a4-preview-render');
        const printContainer = document.getElementById('print-container');
        if (!container || !printContainer) return;

        printContainer.innerHTML = container.innerHTML;

        setTimeout(() => {
            this.executePrint();
        }, 120);
    },

    // Imprimer un permis spécifique avec toutes ses pages et annexes (A4)
    printPermit(permitId) {
        const store = typeof window !== 'undefined' && window.Store ? window.Store : Store;
        const templates = typeof window !== 'undefined' && window.Templates ? window.Templates : Templates;
        const targetId = permitId || (typeof window !== 'undefined' && window.App && window.App.getActivePermitId ? window.App.getActivePermitId() : null) || 'K9-W37-UB';
        
        const permit = store.getPermit(targetId);
        if (!permit) {
            if (typeof window !== 'undefined' && window.App) window.App.showToast('⚠️ Permis introuvable pour impression', 'error');
            return;
        }

        const printContainer = document.getElementById('print-container');
        if (!printContainer) return;

        let htmlPages = [];

        // Si c'est le permis spécial week-end
        if (permit.type === 'weekend' || permit.id.endsWith('-WE')) {
            const dates = typeof window !== 'undefined' && window.WeekendCaisseModule ? window.WeekendCaisseModule.getWeekendDates() : null;
            const weekPermits = store.getPermitsByWeek(permit.week || store.getCurrentWeekNumber());
            htmlPages.push(templates.weekendSummarySheet(dates, weekPermits));
            htmlPages.push(templates.generalP1(permit));
            htmlPages.push(templates.generalP2(permit));
        } else {
            // 1. Permis Général Hebdomadaire (Page 1/2)
            htmlPages.push(templates.generalP1(permit));

            // 2. Revalidation Quotidienne & Effectifs Habilités (Page 2/2)
            htmlPages.push(templates.generalP2(permit));

            // 3. Annexes si dangers applicables
            const d = permit.dangers || {};
            if (permit.type === 'height' || d.height) {
                htmlPages.push(templates.heightAnnexe(permit));
            }
            if (permit.type === 'hot' || d.hot) {
                htmlPages.push(templates.hotAnnexe(permit));
            }
            if (permit.type === 'electric' || d.electric) {
                htmlPages.push(templates.electricAnnexe(permit));
            }

            // 4. Affiche A4 de Zone
            if (typeof templates.renderZonePosterA4 === 'function') {
                htmlPages.push(templates.renderZonePosterA4(permit, permit.zoneKey || 'UB'));
            }
        }

        printContainer.innerHTML = htmlPages.join('');

        setTimeout(() => {
            this.executePrint();
        }, 120);
    },

    // Imprimer uniquement le QR Code en grand format pour affichage sur chantier
    printQROnly(permitId) {
        const store = typeof window !== 'undefined' && window.Store ? window.Store : Store;
        const targetId = permitId || (typeof window !== 'undefined' && window.App && window.App.getActivePermitId ? window.App.getActivePermitId() : null) || 'K9-W37-UB';
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
            this.executePrint();
        }, 150);
    },

    // Imprimer l'intégralité du Dossier Caisse Week-end pour Stellantis
    printFullWeekendDossier(permitsList) {
        const printContainer = document.getElementById('print-container');
        if (!printContainer) return;

        const dates = typeof window !== 'undefined' && window.WeekendCaisseModule ? window.WeekendCaisseModule.getWeekendDates() : null;
        const templates = typeof window !== 'undefined' && window.Templates ? window.Templates : Templates;
        const pcConfig = typeof window !== 'undefined' && window.WeekendCaisseModule ? window.WeekendCaisseModule.getPowerCutConfig() : null;
        let htmlPages = [];

        // Page 1 : Feuille récapitulative A4 pour Stellantis
        htmlPages.push(templates.weekendSummarySheet(dates, permitsList, pcConfig));

        // Pages suivantes : Chaque permis de travail avec son Recto, Verso Revalidation, et Annexes actives
        permitsList.forEach(permit => {
            htmlPages.push(templates.generalP1(permit));
            htmlPages.push(templates.generalP2(permit));

            const d = permit.dangers || {};
            if (permit.type === 'height' || d.height) htmlPages.push(templates.heightAnnexe(permit));
            if (permit.type === 'hot' || d.hot) htmlPages.push(templates.hotAnnexe(permit));
            if (permit.type === 'electric' || d.electric) htmlPages.push(templates.electricAnnexe(permit));
        });

        printContainer.innerHTML = htmlPages.join('');

        // Injecter les QR codes
        permitsList.forEach(permit => {
            this.injectPrintQRCodes(permit);
        });

        if (typeof window !== 'undefined' && window.App) {
            window.App.showToast(`🖨️ Préparation du Dossier Week-end (${htmlPages.length} pages A4)...`, 'info');
        }

        setTimeout(() => {
            this.executePrint();
        }, 200);
    },

    // Export PDF direct
    exportPermitPDF(permitId) {
        const targetId = permitId || (typeof window !== 'undefined' && window.App && window.App.getActivePermitId ? window.App.getActivePermitId() : null) || 'K9-W37-UB';
        const permit = Store.getPermit(targetId);
        if (!permit) return;

        // Préparer le conteneur
        this.printPermit(targetId);

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

        // Web fallback
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
            this.executePrint();
        }, 120);
    },

    // Imprimer tous les permis de la semaine pour affichage mural complet (Dossier Mural Propre)
    // Structure par zone :
    // - Pour UB, UAR, FUSA : Affiche A4 Zone (Mur) + Recto P1 + Verso P2 (Revalidations 08h00 avec émargement stylo)
    // - Pour WE (Week-end) : Fiche récapitulative Caisse Week-end + Recto P1 + Verso P2 Revalidation
    // Pas de doublons ni de 24 pages inutiles !
    printAllWeeklyPermitsForWall(weekNum) {
        const store = typeof window !== 'undefined' && window.Store ? window.Store : Store;
        const templates = typeof window !== 'undefined' && window.Templates ? window.Templates : Templates;
        const dates = typeof window !== 'undefined' && window.WeekendCaisseModule ? window.WeekendCaisseModule.getWeekendDates() : null;
        const pcConfig = typeof window !== 'undefined' && window.WeekendCaisseModule ? window.WeekendCaisseModule.getPowerCutConfig() : null;
        const targetWeek = weekNum || (typeof window !== 'undefined' && window.App && window.App.currentWeek) || store.getCurrentWeekNumber();
        const permits = store.getPermitsByWeek(targetWeek);

        if (!permits || permits.length === 0) {
            if (typeof window !== 'undefined' && window.App) window.App.showToast(`⚠️ Aucun permis trouvé pour la Semaine ${targetWeek}`, 'warning');
            return;
        }

        const printContainer = document.getElementById('print-container');
        if (!printContainer) return;

        let htmlPages = [];

        // Séparer les permis de zones réguliers et le permis week-end
        const zonePermits = permits.filter(p => !p.id.endsWith('-WE') && p.type !== 'weekend');
        const weekendPermits = permits.filter(p => p.id.endsWith('-WE') || p.type === 'weekend');

        // 1. Pour chaque zone de production (UB, UAR, FUSA) : AFFICHE MURALE + P1 + P2 (Revalidations prêtes à signer au stylo)
        zonePermits.forEach(permit => {
            // Affiche A4 d'Entrée de Zone (à coller directement sur le mur / palissade)
            if (typeof templates.renderZonePosterA4 === 'function') {
                htmlPages.push(templates.renderZonePosterA4(permit, permit.zoneKey || 'UB'));
            }

            // Permis officiel Recto (Page 1/2)
            htmlPages.push(templates.generalP1(permit));

            // Fiche Revalidation Quotidienne & Émargements 08h00 (Page 2/2)
            htmlPages.push(templates.generalP2(permit));

            // Uniquement les annexes spécifiques si le permis a des risques réels déclarés
            const d = permit.dangers || {};
            if (permit.type === 'height' || (d.height && permit.type !== 'general')) {
                htmlPages.push(templates.heightAnnexe(permit));
            }
            if (permit.type === 'hot' || (d.hot && permit.type !== 'general')) {
                htmlPages.push(templates.hotAnnexe(permit));
            }
            if (permit.type === 'electric' || (d.electric && permit.type !== 'general')) {
                htmlPages.push(templates.electricAnnexe(permit));
            }
        });

        // 2. Pour le Week-end (WE) : Feuille Récapitulative Caisse Week-end + P1 + P2 Revalidations Vendredi/Samedi
        if (weekendPermits.length > 0) {
            const wePermit = weekendPermits[0];
            // Feuille Récapitulative Caisse Week-end pour Stellantis
            htmlPages.push(templates.weekendSummarySheet(dates, permits, pcConfig));
            // Permis Recto WE
            htmlPages.push(templates.generalP1(wePermit));
            // Revalidations WE
            htmlPages.push(templates.generalP2(wePermit));
        } else {
            // Si pas de permis WE dédié, générer la feuille de récapitulative week-end standard
            htmlPages.push(templates.weekendSummarySheet(dates, permits, pcConfig));
        }

        printContainer.innerHTML = htmlPages.join('');

        // Injecter les QR codes
        permits.forEach(permit => {
            this.injectPrintQRCodes(permit);
        });

        if (typeof window !== 'undefined' && window.App) {
            window.App.showToast(`🖨️ Dossier Mural Prêt : ${htmlPages.length} pages optimisées (Affiches + Permis + Week-end)`, 'info');
        }

        setTimeout(() => {
            this.executePrint();
        }, 200);
    }
};

if (typeof window !== 'undefined') {
    window.PrintEngine = PrintEngine;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PrintEngine;
}
