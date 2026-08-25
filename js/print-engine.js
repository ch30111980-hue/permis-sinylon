/**
 * SINYLON - STELLANTIS | Print & PDF Engine
 * Moteur d'impression A4 et d'exportation PDF certifié
 */

const PrintEngine = {
    // Imprimer un permis spécifique avec toutes ses pages et annexes
    printPermit(permitId) {
        const permit = Store.getPermit(permitId);
        if (!permit) return;

        const printContainer = document.getElementById('print-container');
        if (!printContainer) return;

        // Construire les pages à imprimer selon le type et les annexes
        let htmlPages = [];

        // 1. Permis Général P1 (Recto)
        htmlPages.push(Templates.generalP1(permit));

        // 2. Permis Général P2 (Verso Revalidations)
        htmlPages.push(Templates.generalP2(permit));

        // 3. Annexes spécifiques
        const d = permit.dangers || {};
        if (permit.type === 'height' || d.height || (permit.annexes && permit.annexes.includes('height'))) {
            htmlPages.push(Templates.heightAnnexe(permit));
        }

        if (permit.type === 'hot' || d.hot || (permit.annexes && permit.annexes.includes('hot'))) {
            htmlPages.push(Templates.hotAnnexe(permit));
        }

        if (permit.type === 'electric' || d.electric || (permit.annexes && permit.annexes.includes('electric'))) {
            htmlPages.push(Templates.electricAnnexe(permit));
        }

        printContainer.innerHTML = htmlPages.join('');

        // Générer les QR Codes pour chaque page
        this.injectPrintQRCodes(permit);

        // Déclencher l'impression
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

    // Imprimer uniquement le QR Code en grand format pour affichage sur chantier
    printQROnly(permitId) {
        const permit = Store.getPermit(permitId);
        if (!permit) return;

        const printContainer = document.getElementById('print-container');
        if (!printContainer) return;

        printContainer.innerHTML = `
            <div class="a4-document qr-only-print-page">
                <div class="doc-header">
                    <div class="doc-header-left">
                        <div class="doc-brand">
                            <span class="brand-main">SINYLON</span>
                            <span class="brand-sub">STELLANTIS</span>
                        </div>
                        <div class="doc-maitre-ouvrage">Maître de l'Ouvrage : <strong>STELLANTIS</strong></div>
                        <div class="doc-title-main" style="font-size: 20px;">ACCÈS NUMÉRIQUE AU PERMIS DE TRAVAIL</div>
                    </div>
                    <div class="doc-header-right">
                        <div class="doc-id-box">
                            <div class="id-label">PERMIS N°</div>
                            <div class="id-value">${permit.id}</div>
                        </div>
                    </div>
                </div>

                <div class="qr-poster-center">
                    <div class="qr-poster-canvas-wrapper">
                        <canvas id="qr-poster-canvas"></canvas>
                    </div>
                    <div class="qr-poster-id">${permit.id}</div>
                    <div class="qr-poster-badge status-${(permit.status || 'valide').toLowerCase()}">${permit.status || 'VALIDE'}</div>
                </div>

                <div class="qr-poster-details">
                    <div class="qr-detail-row"><strong>Entreprise Intervenante :</strong> ${permit.company || ''}</div>
                    <div class="qr-detail-row"><strong>Zone / Équipement :</strong> ${permit.ouvrage || ''} (${permit.zone || ''})</div>
                    <div class="qr-detail-row"><strong>Description des Travaux :</strong> ${permit['work-desc'] || permit.title || ''}</div>
                    <div class="qr-detail-row"><strong>Validité :</strong> ${permit['date-main']} (${permit['time-start']} → ${permit['time-end']})</div>
                    <div class="qr-detail-row"><strong>Ingénieur de Suivi :</strong> ${permit['wpeex-nom'] || 'M. W.P.E.E.X'}</div>
                </div>

                <div class="qr-poster-footer">
                    Scannez ce QR Code avec un smartphone pour vérifier la validité en temps réel auprès du système SINYLON.
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
    }
};

window.PrintEngine = PrintEngine;
