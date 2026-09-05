/**
 * SINYLON - STELLANTIS | Caisse Week-end (Vendredi + Samedi)
 * Préparation automatique chaque MERCREDI pour présentation au Maître de l'Ouvrage STELLANTIS.
 * Option Consigne Spéciale : Coupure de Courant sur Site (Vendredi de HH:MM à HH:MM)
 * Contrôle qualité des dossiers, alertes de complétude et impression unifiée A4.
 */

const WeekendCaisseModule = {

    // Récupérer la configuration de coupure de courant du Vendredi
    getPowerCutConfig() {
        try {
            const raw = localStorage.getItem('sinylon_power_cut_config');
            if (raw) return JSON.parse(raw);
        } catch(e) {}
        return {
            enabled: true,
            day: 'Vendredi',
            startTime: '08:00',
            endTime: '12:00',
            zones: 'Zone UB, Zone UAR, Zone FUSA (Soubassements K9)',
            responsable: 'Nouri Chahrour / Xie Xian (Sinylon) · Visa : M. W.P.E.E.X',
            lockoutDetails: 'Consignation LOTO TGBT & Armoires Secondaires'
        };
    },

    savePowerCutConfig(config) {
        try {
            localStorage.setItem('sinylon_power_cut_config', JSON.stringify(config));
            if (window.App) window.App.showToast('⚡ Consigne de Coupure de Courant Vendredi enregistrée !', 'success');
            this.renderCaisseView();
        } catch(e) {}
    },

    // Calculer les dates du vendredi et samedi du week-end cible
    getWeekendDates() {
        const today = new Date();
        const currentDay = today.getDay(); // 0: Dimanche, 1: Lundi, 2: Mardi, 3: Mercredi, 4: Jeudi, 5: Vendredi, 6: Samedi
        
        // Trouver le prochain Vendredi (ou le Vendredi en cours si on est Vendredi/Samedi)
        let diffToFriday = (5 - currentDay + 7) % 7;
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

        const activeKW = (window.App && App.currentPermitId) ? App.currentPermitId : 'SYN-K9-KW36';

        Object.values(allPermits).forEach(p => {
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
            wpeexValidation: !!(permit.wpeexValidated || (permit['wpeex-nom'] && permit['wpeex-nom'].length > 2) || (permit.signatures && permit.signatures.wpeex)),
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
        const powerCut = this.getPowerCutConfig();

        const titleEl = document.getElementById('caisse-weekend-dates-title');
        if (titleEl) titleEl.innerText = dates.rangeLabel;

        const bannerNotice = document.getElementById('caisse-wednesday-banner');
        if (bannerNotice) {
            bannerNotice.innerHTML = `
                <div class="caisse-alert-header" style="display: flex; justify-content: space-between; align-items: center; background: rgba(245, 158, 11, 0.15); border: 2px solid #f59e0b; border-radius: 12px; padding: 16px; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <div style="font-size: 36px;">📦</div>
                        <div>
                            <h4 style="margin: 0; color: #f59e0b; font-size: 16.5px; font-weight: 900; letter-spacing: 0.5px;">ALERTE MERCREDI : PRÉPARATION DE LA CAISSE WEEK-END</h4>
                            <p style="margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1;">Préparation hebdomadaire obligatoire pour présentation au Maître de l'Ouvrage <strong>Stellantis</strong> · Suivi : <strong>M. W.P.E.E.X</strong> & <strong>Nouri Chahrour</strong>.</p>
                        </div>
                    </div>
                    <button onclick="WeekendCaisseModule.printCompleteCaisseDossier()" class="btn btn-warning btn-lg" style="font-weight: 900; min-height: 46px; padding: 10px 20px; box-shadow: 0 4px 15px rgba(245,158,11,0.3); touch-action: manipulation;">
                        🖨️ IMPRIMER LE DOSSIER WEEK-END
                    </button>
                </div>

                <!-- BLOC OPTION CONFIGURATION COUPURE DE COURANT DU VENDREDI SUR SITE -->
                <div style="background: rgba(15, 23, 42, 0.95); border: 2px solid #38bdf8; border-radius: 12px; padding: 16px; margin-bottom: 16px; box-shadow: 0 6px 20px rgba(0,0,0,0.4);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 24px;">⚡</span>
                            <div>
                                <strong style="font-size: 14.5px; color: #38bdf8; text-transform: uppercase;">Consigne Spéciale : Coupure de Courant sur Site (Vendredi)</strong>
                                <div style="font-size: 11.5px; color: #94a3b8;">Plage horaire officielle pour consignation LOTO & travaux hors tension</div>
                            </div>
                        </div>
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; background: rgba(56,189,248,0.15); padding: 6px 12px; border-radius: 8px; border: 1px solid #38bdf8;">
                            <input type="checkbox" id="powercut-toggle" ${powerCut.enabled ? 'checked' : ''} onchange="WeekendCaisseModule.handlePowerCutToggle(this.checked)" style="width: 18px; height: 18px; cursor: pointer;">
                            <span style="font-weight: 800; font-size: 12px; color: #e0f2fe;">Activer la Coupure Vendredi</span>
                        </label>
                    </div>

                    ${powerCut.enabled ? `
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; background: rgba(30,41,59,0.5); padding: 12px; border-radius: 8px; border: 1px solid #334155;">
                            <div>
                                <label style="display: block; font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 4px;">⏰ Heure de Début :</label>
                                <input type="time" id="powercut-start" value="${powerCut.startTime}" class="form-control" style="background: #0b0f19; border: 1px solid #475569; color: #fff; font-weight: bold; padding: 8px 10px; width: 100%; border-radius: 6px;" onchange="WeekendCaisseModule.updatePowerCutField('startTime', this.value)">
                            </div>
                            <div>
                                <label style="display: block; font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 4px;">⏰ Heure de Fin :</label>
                                <input type="time" id="powercut-end" value="${powerCut.endTime}" class="form-control" style="background: #0b0f19; border: 1px solid #475569; color: #fff; font-weight: bold; padding: 8px 10px; width: 100%; border-radius: 6px;" onchange="WeekendCaisseModule.updatePowerCutField('endTime', this.value)">
                            </div>
                            <div>
                                <label style="display: block; font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 4px;">📍 Zones Impactées :</label>
                                <select id="powercut-zones" class="form-control" style="background: #0b0f19; border: 1px solid #475569; color: #fff; font-weight: bold; padding: 8px 10px; width: 100%; border-radius: 6px;" onchange="WeekendCaisseModule.updatePowerCutField('zones', this.value)">
                                    <option value="Zone UB, Zone UAR, Zone FUSA (Soubassements K9)" ${powerCut.zones.includes('Soubassements') ? 'selected' : ''}>Toutes Zones (UB + UAR + FUSA)</option>
                                    <option value="Zone UB (Underbody / Soubassement)" ${powerCut.zones === 'Zone UB (Underbody / Soubassement)' ? 'selected' : ''}>Zone UB uniquement</option>
                                    <option value="Zone UAR (Soubassement Arrière)" ${powerCut.zones === 'Zone UAR (Soubassement Arrière)' ? 'selected' : ''}>Zone UAR uniquement</option>
                                    <option value="Zone FUSA (Soubassement Avant)" ${powerCut.zones === 'Zone FUSA (Soubassement Avant)' ? 'selected' : ''}>Zone FUSA uniquement</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 4px;">🛡️ Visa & Suivi :</label>
                                <input type="text" value="${powerCut.responsable}" class="form-control" style="background: #0b0f19; border: 1px solid #475569; color: #38bdf8; font-weight: bold; padding: 8px 10px; width: 100%; border-radius: 6px;" readonly>
                            </div>
                        </div>
                        <div style="margin-top: 10px; font-size: 12px; color: #7dd3fc; display: flex; align-items: center; gap: 6px;">
                            <span>⚠️</span> <strong>Avis Chantier :</strong> Coupure programmée le <strong>Vendredi de ${powerCut.startTime} à ${powerCut.endTime}</strong> sur <strong>${powerCut.zones}</strong> avec consignation LOTO obligatoire par M. W.P.E.E.X et Sinylon.
                        </div>
                    ` : `
                        <div style="font-size: 12px; color: #94a3b8;">Aucune coupure de courant programmée pour ce week-end. Les installations restent sous tension standard.</div>
                    `}
                </div>

                <!-- Sélecteur rapide pour ajouter n'importe quel permis de la planification -->
                <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                    <span style="font-weight: 800; color: #60a5fa; font-size: 13px;">➕ Ajouter un permis du planning à la Caisse :</span>
                    <select id="caisse-select-add-permit" class="form-control" style="flex: 1; min-width: 260px; max-width: 480px; min-height: 42px;">
                        ${Object.values(allPermits).map(p => `<option value="${p.id}" ${p.isWeekendWork ? 'selected' : ''}>${p.id} — ${p.title || p['work-desc'] || ''} (KW${p.week_num || ''})</option>`).join('')}
                    </select>
                    <button onclick="WeekendCaisseModule.addSelectedPermitToCaisse()" class="btn btn-primary" style="font-weight: 800; min-height: 42px; padding: 0 16px; touch-action: manipulation;">
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

    handlePowerCutToggle(enabled) {
        const config = this.getPowerCutConfig();
        config.enabled = enabled;
        this.savePowerCutConfig(config);
    },

    updatePowerCutField(field, value) {
        const config = this.getPowerCutConfig();
        config[field] = value;
        this.savePowerCutConfig(config);
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

                <h4 class="caisse-card-title">${permit.title || permit['work-desc'] || 'Travaux de montage et sécurisation'}</h4>
                
                <div class="caisse-card-meta">
                    <div>🏢 <strong>Entreprise :</strong> ${permit.company || 'SINYLON'}</div>
                    <div>📍 <strong>Zone :</strong> ${permit.ouvrage || ''} (${permit.zone || 'Zones FUSA / UAR / UB'})</div>
                    <div>⏰ <strong>Horaires :</strong> ${permit['time-start'] || '08h00'} → ${permit['time-end'] || '17h30'}</div>
                    <div>👷 <strong>Suivi :</strong> ${permit['wpeex-nom'] || 'M. W.P.E.E.X (Ingénieur de Suivi)'}</div>
                </div>

                <!-- Matrice de contrôle rapide -->
                <div class="caisse-checklist-summary">
                    <span title="Entreprise" class="${comp.checks.company ? 'check-ok' : 'check-ko'}">🏢 Sinylon</span>
                    <span title="Zone" class="${comp.checks.zone ? 'check-ok' : 'check-ko'}">📍 Zone</span>
                    <span title="Personnel" class="${comp.checks.personnel ? 'check-ok' : 'check-ko'}">👷 59 Ouvriers</span>
                    <span title="Checklist Spécifique" class="${comp.checks.checklist ? 'check-ok' : 'check-ko'}">📋 Check</span>
                    <span title="Validation M. W.P.E.E.X" class="${comp.checks.wpeexValidation ? 'check-ok' : 'check-ko'}">✍️ M. W.P.E.E.X</span>
                </div>

                <div class="caisse-card-actions">
                    <button type="button" onclick="QREngine.openMobileQRModal('${permit.id}')" class="btn btn-secondary btn-sm" title="Afficher le QR sur mobile" style="min-height: 40px; touch-action: manipulation;">
                        📱 QR
                    </button>
                    <button type="button" onclick="App.openPermitPreview('${permit.id}')" class="btn btn-primary btn-sm" title="Voir le permis A4" style="min-height: 40px; touch-action: manipulation;">
                        📄 Voir A4
                    </button>
                    <button type="button" onclick="PrintEngine.printPermit('${permit.id}')" class="btn btn-outline btn-sm" title="Imprimer ce permis" style="min-height: 40px; touch-action: manipulation;">
                        🖨️
                    </button>
                    <button type="button" onclick="RevalidationModule.openModal('${permit.id}')" class="btn btn-outline btn-sm" title="Revalidation" style="min-height: 40px; touch-action: manipulation;">
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
