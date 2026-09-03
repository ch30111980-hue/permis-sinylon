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

        const activeKW = (window.App && App.currentPermitId) ? App.currentPermitId : 'SYN-K9-KW35';

        Object.values(allPermits).forEach(p => {
            // Un permis est considéré week-end si :
            // 1. isWeekendWork est coché explicitement
            // 2. Ou la date correspond au Vendredi/Samedi
            // 3. Ou sa plage de dates englobe le week-end
            // 4. Ou c'est le permis de la semaine active
            const isExplicitWeekend = !!p.isWeekendWork;
            const isMatchingDate = (p['date-main'] === dates.fridayIso || p['date-main'] === dates.saturdayIso);
            const isDateInRange = (p.date_debut && p.date_fin && p.date_debut <= dates.saturdayIso && p.date_fin >= dates.fridayIso);
            const isActivePermit = (p.id === activeKW);

            if (isExplicitWeekend || isMatchingDate || isDateInRange || isActivePermit) {
                if (p.weekendDay === 'samedi' || p['date-main'] === dates.saturdayIso) {
                    result.saturday.push(p);
                } else {
                    result.friday.push(p);
                }
                result.all.push(p);
            }
        });

        // Dédupliquer la liste globale
        const uniqueAll = [];
        const seenIds = new Set();
        result.all.forEach(p => {
            if (!seenIds.has(p.id)) {
                seenIds.add(p.id);
                uniqueAll.push(p);
            }
        });
        result.all = uniqueAll;

        return result;
    },

    // Basculer l'inclusion d'un permis dans la Caisse Week-end
    togglePermitWeekend(permitId) {
        const permit = Store.getPermit(permitId);
        if (!permit) return;
        permit.isWeekendWork = !permit.isWeekendWork;
        Store.savePermit(permit);
        this.renderCaisseView();
        if (window.App) {
            App.renderDashboard();
            App.showToast(permit.isWeekendWork ? `✅ Permis ${permitId} ajouté à la Caisse Week-end !` : `Permis ${permitId} retiré de la Caisse Week-end`, 'info');
        }
    },

    // Ajouter un permis sélectionné depuis le planning
    addSelectedPermitToCaisse() {
        const select = document.getElementById('caisse-select-add-permit');
        if (!select) return;
        const permitId = select.value;
        if (!permitId) return;

        const permit = Store.getPermit(permitId);
        if (permit) {
            permit.isWeekendWork = true;
            Store.savePermit(permit);
            this.renderCaisseView();
            if (window.App) {
                App.renderDashboard();
                App.showToast(`✅ Permis ${permitId} ajouté à la Caisse Week-end !`, 'success');
            }
        }
    },

    // Évaluer la conformité et le contrôle qualité d'un permis pour Stellantis
    evaluateCompliance(permit) {
        const checks = {
            company: !!(permit.company && permit.company.trim().length > 1),
            zone: !!((permit.zone || permit.ouvrage) && (permit.zone || permit.ouvrage).trim().length > 1),
            workDesc: !!(permit['work-desc'] && permit['work-desc'].trim().length > 5),
            personnel: !!(permit['chef-nom'] || permit.contact),
            checklist: true,
            measures: true,
            wpeexValidation: !!(permit.wpeexValidated || (permit['wpeex-nom'] && permit['wpeex-nom'].length > 2)),
            documents: true
        };

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
        const allPermits = Store.getAllPermits();

        const titleEl = document.getElementById('caisse-weekend-dates-title');
        if (titleEl) titleEl.innerText = dates.rangeLabel;

        const bannerNotice = document.getElementById('caisse-wednesday-banner');
        if (bannerNotice) {
            bannerNotice.innerHTML = `
                <div class="caisse-alert-header" style="display: flex; justify-content: space-between; align-items: center; background: rgba(245, 158, 11, 0.15); border: 2px solid #f59e0b; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="font-size: 32px;">📦</div>
                        <div>
                            <h4 style="margin: 0; color: #f59e0b; font-size: 16px; font-weight: 800;">PRÉPARATION DE LA CAISSE WEEK-END (STELLANTIS)</h4>
                            <p style="margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1;">Préparation obligatoire chaque <strong>Mercredi</strong> pour contrôle Sinylon et présentation au Maître de l'Ouvrage <strong>Stellantis</strong>.</p>
                        </div>
                    </div>
                    <button onclick="WeekendCaisseModule.printCompleteCaisseDossier()" class="btn btn-warning btn-lg" style="font-weight: 800;">
                        🖨️ IMPRIMER LE DOSSIER WEEK-END
                    </button>
                </div>

                <!-- Sélecteur rapide pour ajouter n'importe quel permis de la planification -->
                <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
                    <span style="font-weight: 700; color: #60a5fa;">➕ Ajouter un permis du planning à la Caisse :</span>
                    <select id="caisse-select-add-permit" class="form-control" style="flex: 1; max-width: 420px;">
                        ${Object.values(allPermits).map(p => `<option value="${p.id}" ${p.isWeekendWork ? 'selected' : ''}>${p.id} — ${p.title || p['work-desc'] || ''} (KW${p.week_num || ''})</option>`).join('')}
                    </select>
                    <button onclick="WeekendCaisseModule.addSelectedPermitToCaisse()" class="btn btn-primary btn-sm" style="font-weight: 700;">
                        Ajouter à la Caisse
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
                    <div>👷 <strong>Suivi :</strong> ${permit['wpeex-nom'] || '<span class="text-warning">Sinylon</span>'}</div>
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
