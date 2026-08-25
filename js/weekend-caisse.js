/**
 * SINYLON - STELLANTIS | Caisse Week-end (Vendredi + Samedi)
 * Préparation automatique chaque MERCREDI pour présentation au Maître de l'Ouvrage STELLANTIS.
 * Contrôle qualité des dossiers, alertes de complétude et impression unifiée A4.
 */

const WeekendCaisseModule = {
    // Calculer les dates du vendredi et samedi du week-end cible
    getWeekendDates() {
        const today = new Date();
        const currentDay = today.getDay(); // 0: Dimanche, 1: Lundi, 2: Mardi, 3: Mercredi, 4: Jeudi, 5: Vendredi, 6: Samedi
        
        // Trouver le prochain Vendredi (ou le Vendredi en cours si on est Vendredi/Samedi)
        let diffToFriday = (5 - currentDay + 7) % 7;
        // Si aujourd'hui est dimanche (0), le vendredi d'avant ou d'après
        if (currentDay === 0) diffToFriday = 5;

        const friday = new Date(today);
        friday.setDate(today.getDate() + diffToFriday);

        const saturday = new Date(friday);
        saturday.setDate(friday.getDate() + 1);

        const formatDate = (d) => {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        };

        const formatPretty = (d) => {
            const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
            return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        };

        return {
            fridayIso: formatDate(friday),
            saturdayIso: formatDate(saturday),
            fridayLabel: `Vendredi ${formatPretty(friday)}`,
            saturdayLabel: `Samedi ${formatPretty(saturday)}`,
            rangeLabel: `Vendredi ${friday.getDate()} & Samedi ${saturday.getDate()} ${formatPretty(saturday).split(' ').slice(1).join(' ')}`,
            isWednesday: currentDay === 3,
            isThursday: currentDay === 4
        };
    },

    // Récupérer tous les permis associés au week-end
    getWeekendPermits() {
        const dates = this.getWeekendDates();
        const allPermits = Store.getAllPermits();
        const result = {
            friday: [],
            saturday: [],
            all: []
        };

        Object.values(allPermits).forEach(p => {
            // Un permis est considéré week-end si sa date correspond au vendredi/samedi OU si le drapeau isWeekendWork est coché
            const isFri = p['date-main'] === dates.fridayIso || (p.isWeekendWork && p.weekendDay === 'vendredi');
            const isSat = p['date-main'] === dates.saturdayIso || (p.isWeekendWork && p.weekendDay === 'samedi');

            if (isFri) {
                result.friday.push(p);
                result.all.push(p);
            } else if (isSat) {
                result.saturday.push(p);
                result.all.push(p);
            } else if (p.isWeekendWork) {
                result.friday.push(p);
                result.all.push(p);
            }
        });

        return result;
    },

    // Évaluer la conformité et le contrôle qualité d'un permis pour Stellantis
    evaluateCompliance(permit) {
        const checks = {
            company: !!(permit.company && permit.company.trim().length > 1),
            zone: !!((permit.zone || permit.ouvrage) && (permit.zone || permit.ouvrage).trim().length > 1),
            workDesc: !!(permit['work-desc'] && permit['work-desc'].trim().length > 5),
            personnel: !!(permit['chef-nom'] || permit.contact),
            checklist: false,
            measures: true,
            wpeexValidation: !!(permit.wpeexValidated || (permit['wpeex-nom'] && permit['wpeex-nom'].length > 2)),
            documents: true
        };

        // Checklist spécifique selon type
        if (permit.type === 'general') {
            checks.checklist = true;
        } else if (permit.type === 'height') {
            checks.checklist = !!(permit.heightDetails && (permit.heightDetails.fixedScaffold || permit.heightDetails.mobileScaffold || permit.heightDetails.platform || permit.heightDetails.ladder || permit.heightDetails.roofWork));
        } else if (permit.type === 'hot') {
            checks.checklist = !!(permit.hotDetails && (permit.hotDetails.extinguisherPowder || permit.hotDetails.extinguisherWater || permit.hotDetails.extinguisherCO2 || permit.hotDetails.fireWatcherPresent));
        } else if (permit.type === 'electric') {
            checks.checklist = !!(permit.electricDetails && (permit.electricDetails.consignationChecked || permit.electricDetails.lockoutTagout));
        }

        const totalChecks = Object.keys(checks).length;
        const passedChecks = Object.values(checks).filter(Boolean).length;
        const isReady = passedChecks === totalChecks;

        return {
            checks,
            totalChecks,
            passedChecks,
            isReady,
            percentage: Math.round((passedChecks / totalChecks) * 100)
        };
    },

    // Rendu de la vue Caisse Week-end
    renderCaisseView() {
        const dates = this.getWeekendDates();
        const { friday, saturday, all } = this.getWeekendPermits();

        const titleEl = document.getElementById('caisse-weekend-dates-title');
        if (titleEl) titleEl.innerText = dates.rangeLabel;

        const bannerNotice = document.getElementById('caisse-wednesday-banner');
        if (bannerNotice) {
            bannerNotice.innerHTML = `
                <div class="caisse-alert-header">
                    <div class="alert-icon">📦</div>
                    <div class="alert-info">
                        <h4>PRÉPARATION DU WEEK-END — PRÉSENTATION MAÎTRE DE L'OUVRAGE (STELLANTIS)</h4>
                        <p>Préparation obligatoire chaque <strong>Mercredi</strong> pour contrôle, validation W.P.E.E.X et présentation officielle à <strong>Stellantis</strong>.</p>
                    </div>
                    <button onclick="WeekendCaisseModule.printCompleteCaisseDossier()" class="btn btn-warning btn-lg">
                        🖨️ IMPRIMER LA CAISSE WEEK-END
                    </button>
                </div>
            `;
        }

        // Statistiques de la caisse
        const readyCount = all.filter(p => this.evaluateCompliance(p).isReady).length;
        const pendingCount = all.length - readyCount;

        const statTotal = document.getElementById('caisse-stat-total');
        const statReady = document.getElementById('caisse-stat-ready');
        const statPending = document.getElementById('caisse-stat-pending');

        if (statTotal) statTotal.innerText = all.length;
        if (statReady) statReady.innerText = readyCount;
        if (statPending) statPending.innerText = pendingCount;

        // Rendu Vendredi
        const friContainer = document.getElementById('caisse-friday-list');
        if (friContainer) {
            if (friday.length === 0) {
                friContainer.innerHTML = `<div class="empty-caisse-day">Aucun travail programmé pour le Vendredi.</div>`;
            } else {
                friContainer.innerHTML = friday.map(p => this.renderPermitCard(p)).join('');
            }
        }

        // Rendu Samedi
        const satContainer = document.getElementById('caisse-saturday-list');
        if (satContainer) {
            if (saturday.length === 0) {
                satContainer.innerHTML = `<div class="empty-caisse-day">Aucun travail programmé pour le Samedi.</div>`;
            } else {
                satContainer.innerHTML = saturday.map(p => this.renderPermitCard(p)).join('');
            }
        }
    },

    // Rendu d'une carte de permis dans la Caisse Week-end
    renderPermitCard(permit) {
        const comp = this.evaluateCompliance(permit);
        const typeLabels = {
            general: 'GÉNÉRAL',
            hot: 'CHAUD',
            height: 'HAUTEUR',
            electric: 'ÉLECTRIQUE'
        };

        const typeBadgeColors = {
            general: 'badge-blue',
            hot: 'badge-red',
            height: 'badge-sky',
            electric: 'badge-yellow'
        };

        return `
            <div class="caisse-permit-card ${comp.isReady ? 'ready' : 'incomplete'}" data-permit-id="${permit.id}">
                <div class="caisse-card-top">
                    <div class="caisse-card-id-block">
                        <span class="badge ${typeBadgeColors[permit.type] || 'badge-blue'}">${typeLabels[permit.type] || 'GÉNÉRAL'}</span>
                        <strong class="permit-code">${permit.id}</strong>
                    </div>
                    <div class="caisse-card-status">
                        ${comp.isReady 
                            ? `<span class="badge badge-success">🟢 PRÊT POUR STELLANTIS</span>` 
                            : `<span class="badge badge-warning">🟠 À COMPLÉTER (${comp.passedChecks}/${comp.totalChecks})</span>`
                        }
                    </div>
                </div>

                <h4 class="caisse-card-title">${permit.title || permit['work-desc'] || 'Travaux de maintenance'}</h4>
                
                <div class="caisse-card-meta">
                    <div>🏢 <strong>Entreprise :</strong> ${permit.company || '<span class="text-danger">Manquant</span>'}</div>
                    <div>📍 <strong>Zone :</strong> ${permit.ouvrage || ''} (${permit.zone || ''})</div>
                    <div>⏰ <strong>Horaires :</strong> ${permit['time-start']} → ${permit['time-end']}</div>
                    <div>👷 <strong>Suivi :</strong> ${permit['wpeex-nom'] || '<span class="text-warning">W.P.E.E.X</span>'}</div>
                </div>

                <!-- Matrice de contrôle rapide -->
                <div class="caisse-checklist-summary">
                    <span title="Entreprise" class="${comp.checks.company ? 'check-ok' : 'check-ko'}">🏢 Entr</span>
                    <span title="Zone" class="${comp.checks.zone ? 'check-ok' : 'check-ko'}">📍 Zone</span>
                    <span title="Personnel" class="${comp.checks.personnel ? 'check-ok' : 'check-ko'}">👷 Pers</span>
                    <span title="Checklist Spécifique" class="${comp.checks.checklist ? 'check-ok' : 'check-ko'}">📋 Check</span>
                    <span title="Validation WPEEX" class="${comp.checks.wpeexValidation ? 'check-ok' : 'check-ko'}">✍️ WPEEX</span>
                </div>

                <div class="caisse-card-actions">
                    <button onclick="QREngine.openMobileQRModal('${permit.id}')" class="btn btn-secondary btn-sm" title="Afficher le QR sur mobile">
                        📱 QR
                    </button>
                    <button onclick="App.openPermitPreview('${permit.id}')" class="btn btn-primary btn-sm" title="Voir le permis A4">
                        📄 Voir A4
                    </button>
                    <button onclick="PrintEngine.printPermit('${permit.id}')" class="btn btn-outline btn-sm" title="Imprimer ce permis">
                        🖨️
                    </button>
                    <button onclick="RevalidationModule.openModal('${permit.id}')" class="btn btn-outline btn-sm" title="Revalidation">
                        🔄
                    </button>
                </div>
            </div>
        `;
    },

    // Impression groupée de tout le dossier A4 de la Caisse Week-end pour Stellantis
    printCompleteCaisseDossier() {
        const { all } = this.getWeekendPermits();
        if (all.length === 0) {
            App.showToast('Aucun permis dans la Caisse Week-end à imprimer.', 'warning');
            return;
        }
        PrintEngine.printFullWeekendDossier(all);
    }
};

window.WeekendCaisseModule = WeekendCaisseModule;
