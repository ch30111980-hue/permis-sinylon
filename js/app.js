/**
 * SINYLON - STELLANTIS | Main Application Controller (Bilingual & 100% Modifiable)
 * Orchestrateur de l'interface, gestion des 4 permis, édition inline directe, QR Terrain & Code d'Autorisation
 */

const App = {
    currentView: 'dashboard',
    currentPermitId: 'SYN-K9-KW35',
    previewPage: 'p1',

    // Initialisation
    init() {
        this.bindEvents();
        this.renderDashboard();
        this.renderPermitList();
        
        const permits = Store.getAllPermits();
        if (permits['SYN-K9-KW35']) {
            this.currentPermitId = 'SYN-K9-KW35';
        } else {
            const firstId = Object.keys(permits)[0] || 'SYN-K9-KW35';
            this.currentPermitId = firstId;
        }

        // Détection de l'alerte du Mercredi pour la caisse week-end
        const dates = WeekendCaisseModule.getWeekendDates();
        if (dates.isWednesday) {
            this.showToast('🔔 MERCREDI : Préparation de la Caisse Week-end pour présentation à Stellantis !', 'warning', 8000);
        }

        // Lancement du moteur de revalidation automatique quotidienne à 18h00
        this.initAutoRevalidationEngine();

        // Détection éventuelle de scan QR direct dans l'URL (ex: #SYN-K9-KW25)
        const handleUrlHash = () => {
            if (window.location.hash && window.location.hash.length > 1) {
                const targetId = window.location.hash.substring(1).trim();
                if (Store.getPermit(targetId)) {
                    setTimeout(() => {
                        QREngine.openMobileQRModal(targetId);
                    }, 200);
                }
            }
        };
        handleUrlHash();
        window.addEventListener('hashchange', handleUrlHash);
    },

    // Liaison des événements UI
    bindEvents() {
        const searchInput = document.getElementById('search-permits');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterPermitList(e.target.value));
        }

        const descFr = document.getElementById('form-work-desc');
        if (descFr) {
            descFr.addEventListener('blur', () => this.autoTranslateForm());
        }

        const titleFr = document.getElementById('form-title');
        if (titleFr) {
            titleFr.addEventListener('blur', () => this.autoTranslateForm());
        }
    },

    // =========================================================================
    // ÉDITION EN DIRECT SUR LA PAGE A4 (INLINE EDITING, BOUTON SAVE & AUTO-SAVE)
    // =========================================================================

    autoSaveTimer: null,

    scheduleAutoSave(permitId) {
        if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
        this.autoSaveTimer = setTimeout(() => {
            this.saveCurrentA4View(true);
        }, 500);
    },

    // Enregistrer explicitement toutes les modifications du document A4 actuellement affiché
    saveCurrentA4View(isSilent = false) {
        const permitId = this.currentPermitId;
        const permit = Store.getPermit(permitId);
        if (!permit) return;

        const container = document.getElementById('a4-preview-render');
        if (container) {
            // Parcourir tous les éléments éditables et mettre à jour le permis
            const editables = container.querySelectorAll('[contenteditable="true"]');
            editables.forEach(el => {
                const onblurAttr = el.getAttribute('onblur');
                if (onblurAttr && onblurAttr.includes('updatePermitField')) {
                    const match = onblurAttr.match(/updatePermitField\('[^']+',\s*'([^']+)'/);
                    if (match && match[1]) {
                        const field = match[1];
                        const val = el.innerText.trim();
                        permit[field] = val;
                    }
                }
            });

            // Parcourir les inputs de revalidation si présents
            const revalInputs = container.querySelectorAll('.reval-inline-input');
            revalInputs.forEach(inp => {
                const onchangeAttr = inp.getAttribute('onchange');
                if (onchangeAttr && onchangeAttr.includes('updateRevalRow')) {
                    const match = onchangeAttr.match(/updateRevalRow\('[^']+',\s*(\d+),\s*'([^']+)'/);
                    if (match && match[1] !== undefined && match[2]) {
                        const rowIndex = parseInt(match[1], 10);
                        const field = match[2];
                        if (!permit.revalidations) permit.revalidations = [];
                        while (permit.revalidations.length <= rowIndex) {
                            permit.revalidations.push({
                                weekNumber: rowIndex + 2,
                                date: new Date().toISOString().split('T')[0],
                                wpeexEngineer: 'M. W.P.E.E.X',
                                execManager: 'Xie',
                                status: 'VALIDE',
                                wpeexValidated: true,
                                sinylonSigned: true
                            });
                        }
                        permit.revalidations[rowIndex][field] = inp.value.trim();
                    }
                }
            });
        }

        permit.lastModified = new Date().toISOString();
        Store.savePermit(permit);
        this.renderDashboard();
        this.renderPermitList();

        if (!isSilent) {
            this.showToast(`💾 Permis ${permit.id} et Revalidations enregistrés avec succès !`, 'success', 3000);
            this.renderPreview();
        }
    },

    // Mettre à jour un champ directement modifié sur le document A4
    updatePermitField(permitId, fieldName, value) {
        const cleanVal = value.replace(/<[^>]*>?/gm, '').trim();
        const permit = Store.getPermit(permitId);
        if (!permit) return;

        permit[fieldName] = cleanVal;
        Store.savePermit(permit);
        this.renderDashboard();
        this.renderPermitList();
        this.showToast(`💾 Modification enregistrée : ${fieldName}`, 'info', 1200);
    },

    // =========================================================================
    // GESTION COMPLÈTE DU TABLEAU DE REVALIDATION (PAGE 2)
    // =========================================================================

    // Mettre à jour une ligne du tableau de revalidation
    updateRevalRow(permitId, rowIndex, fieldName, value) {
        const permit = Store.getPermit(permitId);
        if (!permit) return;

        if (!permit.revalidations) permit.revalidations = [];
        while (permit.revalidations.length <= rowIndex) {
            permit.revalidations.push({
                weekNumber: permit.revalidations.length + 2,
                date: new Date().toISOString().split('T')[0],
                wpeexEngineer: 'M. W.P.E.E.X',
                execManager: 'Xie',
                status: 'VALIDE',
                wpeexValidated: true,
                sinylonSigned: true
            });
        }

        permit.revalidations[rowIndex][fieldName] = value.trim();
        Store.savePermit(permit);
        this.showToast('💾 Revalidation mise à jour', 'info', 1200);
    },

    // Basculer la validation W.P.E.E.X pour une journée
    toggleRevalWpeex(permitId, rowIndex) {
        const permit = Store.getPermit(permitId);
        if (!permit) return;

        if (!permit.revalidations) permit.revalidations = [];
        while (permit.revalidations.length <= rowIndex) {
            permit.revalidations.push({
                weekNumber: rowIndex + 2,
                date: new Date().toISOString().split('T')[0],
                wpeexEngineer: 'M. W.P.E.E.X',
                execManager: 'Xie',
                status: 'VALIDE',
                wpeexValidated: false,
                sinylonSigned: false
            });
        }

        const cur = permit.revalidations[rowIndex].wpeexValidated;
        permit.revalidations[rowIndex].wpeexValidated = !cur;
        Store.savePermit(permit);
        this.renderPreview();
        this.showToast(`W.P.E.E.X Jour ${rowIndex + 2} : ${!cur ? 'VALIDÉ ✓' : 'EN ATTENTE'}`, 'info', 1500);
    },

    // Basculer la signature Sinylon (Xie) pour une journée
    toggleRevalSinylon(permitId, rowIndex) {
        const permit = Store.getPermit(permitId);
        if (!permit) return;

        if (!permit.revalidations) permit.revalidations = [];
        while (permit.revalidations.length <= rowIndex) {
            permit.revalidations.push({
                weekNumber: rowIndex + 2,
                date: new Date().toISOString().split('T')[0],
                wpeexEngineer: 'M. W.P.E.E.X',
                execManager: 'Xie',
                status: 'VALIDE',
                wpeexValidated: true,
                sinylonSigned: false
            });
        }

        const cur = permit.revalidations[rowIndex].sinylonSigned;
        permit.revalidations[rowIndex].sinylonSigned = !cur;
        Store.savePermit(permit);
        this.renderPreview();
        this.showToast(`Sinylon Xie Jour ${rowIndex + 2} : ${!cur ? 'SIGNÉ ✓' : 'EN ATTENTE'}`, 'info', 1500);
    },

    // Basculer à la fois W.P.E.E.X et Sinylon
    toggleRevalBoth(permitId, rowIndex) {
        const permit = Store.getPermit(permitId);
        if (!permit) return;

        if (!permit.revalidations) permit.revalidations = [];
        while (permit.revalidations.length <= rowIndex) {
            permit.revalidations.push({
                weekNumber: rowIndex + 2,
                date: new Date().toISOString().split('T')[0],
                wpeexEngineer: 'M. W.P.E.E.X',
                execManager: 'Xie',
                status: 'VALIDE',
                wpeexValidated: false,
                sinylonSigned: false
            });
        }

        const isCurrentlyValid = permit.revalidations[rowIndex].wpeexValidated && permit.revalidations[rowIndex].sinylonSigned;
        permit.revalidations[rowIndex].wpeexValidated = !isCurrentlyValid;
        permit.revalidations[rowIndex].sinylonSigned = !isCurrentlyValid;
        permit.revalidations[rowIndex].status = !isCurrentlyValid ? 'VALIDE' : 'EN_ATTENTE_WPEEX';

        Store.savePermit(permit);
        this.renderPreview();
        this.showToast(`Jour ${rowIndex + 2} : ${!isCurrentlyValid ? '✅ VALIDÉ ET SIGNÉ' : '⏳ REMIS EN ATTENTE'}`, 'success', 2000);
    },

    // Revalidation automatique de la journée d'aujourd'hui (comme à 07h55)
    revalidateTodayAuto(permitId) {
        const permit = Store.getPermit(permitId || this.currentPermitId);
        if (!permit) return;

        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Dimanche, 1 = Lundi, 2 = Mardi, ..., 6 = Samedi
        const targetRowIndex = dayOfWeek === 0 ? 5 : (dayOfWeek >= 2 ? dayOfWeek - 2 : 0);
        const todayStr = now.toISOString().split('T')[0];

        if (!permit.revalidations) permit.revalidations = [];
        while (permit.revalidations.length <= targetRowIndex) {
            permit.revalidations.push({
                weekNumber: permit.revalidations.length + 2,
                date: todayStr,
                wpeexEngineer: 'M. W.P.E.E.X',
                execManager: 'XIE XIAN (Chef de Projet)',
                status: 'VALIDE',
                wpeexValidated: true,
                sinylonSigned: true
            });
        }

        permit.revalidations[targetRowIndex].date = todayStr;
        permit.revalidations[targetRowIndex].wpeexValidated = true;
        permit.revalidations[targetRowIndex].sinylonSigned = true;
        permit.revalidations[targetRowIndex].status = 'VALIDE';
        permit.revalidations[targetRowIndex].revalidatedAt = now.toISOString();

        Store.savePermit(permit);
        this.renderPreview();
        this.showToast(`⚡ Revalidation automatique 07h55 exécutée avec succès pour Jour ${targetRowIndex + 2} (${todayStr}) !`, 'success', 4000);
    },

    // Valider et signer l'intégralité des 6 jours (Jour 2 à Jour 7)
    signAllRevalidations(permitId) {
        const permit = Store.getPermit(permitId || this.currentPermitId);
        if (!permit) return;

        const baseDate = permit.date_debut || permit['date-main'] || '2026-08-24';
        permit.revalidations = [];

        for (let i = 2; i <= 7; i++) {
            let rowDate = baseDate;
            try {
                const d = new Date(baseDate);
                d.setDate(d.getDate() + (i - 1));
                rowDate = d.toISOString().split('T')[0];
            } catch (e) {}

            permit.revalidations.push({
                weekNumber: i,
                date: rowDate,
                wpeexEngineer: 'M. W.P.E.E.X',
                execManager: 'XIE XIAN (Chef de Projet)',
                status: 'VALIDE',
                wpeexValidated: true,
                sinylonSigned: true,
                revalidatedAt: new Date().toISOString()
            });
        }

        permit.status = 'VALIDE';
        Store.savePermit(permit);
        this.renderPreview();
        this.showToast(`✅ Tous les jours de revalidation (Jour 2 à 7) ont été validés et signés !`, 'success', 3500);
    },

    // =========================================================================
    // MOTEUR DE REVALIDATION AUTOMATIQUE DU MATIN À 07H55
    // =========================================================================

    initAutoRevalidationEngine() {
        // Exécution d'un cycle de vérification toutes les minutes
        const checkCycle = () => {
            const now = new Date();
            const hour = now.getHours();
            const min = now.getMinutes();

            // Si 07h55 du matin ou plus, revalider automatiquement le permis actif de la semaine
            const permits = Store.getAllPermits();
            const activePermit = permits[this.currentPermitId] || Object.values(permits)[0];
            if (!activePermit) return;

            const todayStr = now.toISOString().split('T')[0];
            const dayOfWeek = now.getDay();
            const rowIndex = dayOfWeek === 0 ? 5 : (dayOfWeek >= 2 ? dayOfWeek - 2 : 0);

            if (!activePermit.revalidations) activePermit.revalidations = [];
            while (activePermit.revalidations.length <= rowIndex) {
                activePermit.revalidations.push({
                    weekNumber: activePermit.revalidations.length + 2,
                    date: todayStr,
                    wpeexEngineer: 'M. W.P.E.E.X',
                    execManager: 'XIE XIAN (Chef de Projet)',
                    status: 'VALIDE',
                    wpeexValidated: true,
                    sinylonSigned: true
                });
            }

            // Si non validé aujourd'hui et qu'il est 07h55 ou plus
            if (!activePermit.revalidations[rowIndex].wpeexValidated || !activePermit.revalidations[rowIndex].sinylonSigned) {
                if (hour > 7 || (hour === 7 && min >= 55)) {
                    activePermit.revalidations[rowIndex].date = todayStr;
                    activePermit.revalidations[rowIndex].wpeexValidated = true;
                    activePermit.revalidations[rowIndex].sinylonSigned = true;
                    activePermit.revalidations[rowIndex].status = 'VALIDE';
                    Store.savePermit(activePermit);
                    console.log(`[AutoReval 07h55] Permis ${activePermit.id} Jour ${rowIndex + 2} revalidé automatiquement.`);
                }
            }
        };

        checkCycle();
        setInterval(checkCycle, 60000);
    },

    // =========================================================================
    // GESTION DES NOMS D'INTERVENANTS & OUVRIERS
    // =========================================================================

    promptAddWorker(permitId) {
        const name = prompt("Entrez le nom et le rôle du nouvel intervenant :\n(Ex: 'Karim Belkacem (Soudeur)', 'Wang Chen (Monteur)')");
        if (!name || !name.trim()) return;

        const permit = Store.getPermit(permitId);
        if (!permit) return;

        if (!permit.travailleurs) permit.travailleurs = [];
        permit.travailleurs.push({
            id: 'T-' + Date.now(),
            nom: name.trim(),
            role: 'Opérateur',
            badge: 'SYN-' + Math.floor(100 + Math.random() * 900)
        });

        Store.savePermit(permit);
        this.renderPreview();
        this.showToast(`👤 Intervenant ajouté : ${name}`, 'success');
    },

    // Basculer un danger / une case à cocher directement sur l'A4
    toggleHazard(permitId, hazardName) {
        const permit = Store.getPermit(permitId);
        if (!permit) return;

        if (!permit.dangers) permit.dangers = {};
        permit.dangers[hazardName] = !permit.dangers[hazardName];

        Store.savePermit(permit);
        this.renderPreview();
        this.showToast(`Danger ${hazardName} : ${permit.dangers[hazardName] ? 'ACTIVÉ [X]' : 'DÉSACTIVÉ'}`, 'info', 1500);
    },

    // Supprimer un permis avec confirmation
    deletePermitAction(permitId) {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement le permis ${permitId} ?`)) {
            return;
        }

        Store.deletePermit(permitId);
        const permits = Store.getAllPermits();
        const firstId = Object.keys(permits)[0] || null;
        this.currentPermitId = firstId;

        this.renderDashboard();
        this.renderPermitList();
        if (firstId) {
            this.openPermitPreview(firstId);
        } else {
            this.switchView('dashboard');
        }
        this.showToast(`🗑️ Permis ${permitId} supprimé avec succès.`, 'warning');
    },

    // Dupliquer un permis
    duplicatePermit(permitId) {
        const src = Store.getPermit(permitId);
        if (!src) return;

        const clone = JSON.parse(JSON.stringify(src));
        clone.id = Store.generateId();
        clone.title = `Copie de ${src.title}`;
        clone.createdAt = new Date().toISOString();
        clone.revalidations = [];
        clone.historique_modifications = [];

        Store.savePermit(clone);
        this.currentPermitId = clone.id;

        this.renderDashboard();
        this.renderPermitList();
        this.openPermitPreview(clone.id);
        this.showToast(`📋 Permis dupliqué sous le numéro ${clone.id}`, 'success');
    },

    // =========================================================================
    // TRADUCTION AUTOMATIQUE
    // =========================================================================

    async autoTranslateForm() {
        const descFr = document.getElementById('form-work-desc')?.value || '';
        const titleFr = document.getElementById('form-title')?.value || '';

        if (descFr.trim()) {
            const translatedDesc = await Translator.translateFrToEn(descFr);
            const descEnInput = document.getElementById('form-work-desc-en');
            if (descEnInput && (!descEnInput.value || descEnInput.dataset.autoGenerated === 'true' || descEnInput.value === '')) {
                descEnInput.value = translatedDesc;
                descEnInput.dataset.autoGenerated = 'true';
            }
        }

        if (titleFr.trim()) {
            const translatedTitle = await Translator.translateFrToEn(titleFr);
            const titleEnInput = document.getElementById('form-title-en');
            if (titleEnInput && (!titleEnInput.value || titleEnInput.dataset.autoGenerated === 'true' || titleEnInput.value === '')) {
                titleEnInput.value = translatedTitle;
                titleEnInput.dataset.autoGenerated = 'true';
            }
        }
    },

    async forceTranslateNow() {
        const descFr = document.getElementById('form-work-desc')?.value || '';
        const titleFr = document.getElementById('form-title')?.value || '';

        if (!descFr.trim() && !titleFr.trim()) {
            this.showToast('Veuillez d\'abord saisir un titre ou une description en français.', 'warning');
            return;
        }

        this.showToast('Traduction automatique en cours...', 'info', 2000);

        if (descFr.trim()) {
            const translatedDesc = await Translator.translateFrToEn(descFr);
            document.getElementById('form-work-desc-en').value = translatedDesc;
        }

        if (titleFr.trim()) {
            const translatedTitle = await Translator.translateFrToEn(titleFr);
            document.getElementById('form-title-en').value = translatedTitle;
        }

        this.showToast('✅ Traduction bilingue FR ⇄ EN effectuée !', 'success');
    },

    // Découper automatiquement le formulaire en 4 permis distincts
    splitFormInto4Permits() {
        const formData = {
            company: document.getElementById('form-company').value.trim() || 'SINYLON',
            contact: document.getElementById('form-contact').value.trim() || 'Nouri Chahrour (HSE Sinylon)',
            tel: document.getElementById('form-tel').value.trim() || '+213 550 12 34 56',
            ouvrage: document.getElementById('form-ouvrage').value.trim() || 'Atelier Assemblage Stellantis',
            zone: document.getElementById('form-zone').value.trim() || 'Zone 4',
            location: document.getElementById('form-location').value.trim() || 'Bâtiment Principal',
            'date-main': document.getElementById('form-date-main').value,
            'time-start': document.getElementById('form-time-start').value,
            'time-end': document.getElementById('form-time-end').value,
            'chef-nom': document.getElementById('form-chef-nom').value.trim() || 'Xie (Chef de Projet Sinylon)',
            'wpeex-nom': document.getElementById('form-wpeex-nom').value.trim() || 'M. W.P.E.E.X (Ingénieur de Suivi)',
            'hse-nom': document.getElementById('form-hse-nom').value.trim() || 'Nouri Chahrour (HSE Sinylon)',
            'receveur-nom': document.getElementById('form-receveur-nom').value.trim() || 'Xian (Receveur du Permis)',
        };

        const generatedIds = Store.splitGlobalInto4Permits(formData);
        this.currentPermitId = generatedIds[0];

        this.renderPermitList();
        this.renderDashboard();
        this.switchView('list');
        this.showToast('✅ Les 4 permis distincts ont été créés avec succès pour Xie et Xian !', 'success', 5000);
    },

    // Navigation entre vues principales
    switchView(viewName) {
        this.currentView = viewName;

        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        const activeNav = document.getElementById(`nav-${viewName}`);
        if (activeNav) activeNav.classList.add('active');

        document.querySelectorAll('.view-pane').forEach(el => el.style.display = 'none');
        const activePane = document.getElementById(`view-${viewName}`);
        if (activePane) activePane.style.display = 'block';

        if (viewName === 'dashboard') {
            this.renderDashboard();
        } else if (viewName === 'caisse') {
            WeekendCaisseModule.renderCaisseView();
        } else if (viewName === 'list') {
            this.renderPermitList();
        } else if (viewName === 'preview') {
            if (this.currentPermitId) this.renderPreview();
        }
    },

    // Rendu du Dashboard
    renderDashboard() {
        const permits = Store.getAllPermits();
        const list = Object.values(permits);

        const total = list.length;
        const valides = list.filter(p => p.status === 'VALIDE').length;
        const revals = list.filter(p => p.status === 'REVALIDATION_REQUISE' || p.status === 'EN_ATTENTE_WPEEX').length;
        const weekendPermits = list.filter(p => p.isWeekendWork).length;

        const elTotal = document.getElementById('dash-stat-total');
        const elValide = document.getElementById('dash-stat-valide');

        if (elTotal) elTotal.innerText = total;
        if (elValide) elValide.innerText = valides;

        const dates = WeekendCaisseModule.getWeekendDates();
        const weekendData = WeekendCaisseModule.getWeekendPermits();
        const readyCount = weekendData.all.filter(p => WeekendCaisseModule.evaluateCompliance(p).isReady).length;

        const widgetDates = document.getElementById('dash-weekend-dates');
        const widgetCount = document.getElementById('dash-weekend-count');
        const widgetReady = document.getElementById('dash-weekend-ready');

        if (widgetDates) widgetDates.innerText = dates.rangeLabel;
        if (widgetCount) widgetCount.innerText = `${weekendData.all.length} permis programmés`;
        if (widgetReady) widgetReady.innerText = `${readyCount} Prêts · ${weekendData.all.length - readyCount} À compléter`;

        const recentTable = document.getElementById('dash-recent-table-body');
        if (recentTable) {
            recentTable.innerHTML = list.map(p => `
                <tr>
                    <td><strong class="text-primary">${p.id}</strong></td>
                    <td><span class="badge ${p.type === 'height' ? 'badge-sky' : p.type === 'hot' ? 'badge-red' : p.type === 'electric' ? 'badge-yellow' : 'badge-blue'}">${(p.type_permis || p.type).toUpperCase()}</span></td>
                    <td><strong>${p.company || 'SINYLON'}</strong></td>
                    <td>${p.ouvrage || ''} (${p.zone || ''})</td>
                    <td><span class="status-badge status-${(p.status || 'valide').toLowerCase()}">${p.status || 'VALIDE'}</span></td>
                    <td>
                        <button onclick="QREngine.openMobileQRModal('${p.id}')" class="btn btn-primary btn-sm" style="font-weight: 700;">📱 Fiche QR</button>
                        <button onclick="App.openPermitPreview('${p.id}')" class="btn btn-secondary btn-sm">📄 A4</button>
                        <button onclick="App.editPermit('${p.id}')" class="btn btn-warning btn-sm" style="font-weight: 700; background: #f59e0b; color: #000; border: none;">✏️ Modif</button>
                        <button onclick="App.deletePermitAction('${p.id}')" class="btn btn-outline btn-sm" style="color: #ef4444;" title="Supprimer">🗑️</button>
                    </td>
                </tr>
            `).join('');
        }
    },

    // Rendu de la liste latérale et de la vue Registre
    renderPermitList() {
        const permits = Store.getAllPermits();
        const list = Object.values(permits);

        const sidebarList = document.getElementById('sidebar-permit-list');
        if (sidebarList) {
            sidebarList.innerHTML = list.map(p => `
                <div class="permit-mini-card ${p.id === this.currentPermitId ? 'active' : ''}" onclick="App.openPermitPreview('${p.id}')">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span class="mini-id">${p.id}</span>
                        <span class="badge ${p.type === 'height' ? 'badge-sky' : p.type === 'hot' ? 'badge-red' : p.type === 'electric' ? 'badge-yellow' : 'badge-blue'}" style="font-size: 9px; padding: 1px 4px;">${p.type.toUpperCase()}</span>
                    </div>
                    <div class="mini-company">${p.title || p.company}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                        <span class="mini-zone">${p.zone || p.ouvrage || 'Zone 4'}</span>
                        <button onclick="event.stopPropagation(); QREngine.openMobileQRModal('${p.id}')" class="btn btn-primary btn-sm" style="font-size: 9px; padding: 1px 6px;">📱 QR</button>
                    </div>
                </div>
            `).join('');
        }

        const fullListTable = document.getElementById('full-permits-table-body');
        if (fullListTable) {
            fullListTable.innerHTML = list.map(p => `
                <tr>
                    <td><strong class="text-primary">${p.id}</strong></td>
                    <td><span class="badge ${p.type === 'height' ? 'badge-sky' : p.type === 'hot' ? 'badge-red' : p.type === 'electric' ? 'badge-yellow' : 'badge-blue'}">${(p.type_permis || p.type).toUpperCase()}</span></td>
                    <td><strong>${p.company || 'SINYLON'}</strong></td>
                    <td>${p.ouvrage || ''} - ${p.zone || ''}</td>
                    <td>${p['work-desc'] || p.title || ''}</td>
                    <td><strong>XIE XIAN</strong> (Chef) / <strong>ZHOULIN</strong> (Équipe)</td>
                    <td><span class="status-badge status-${(p.status || 'valide').toLowerCase()}">${p.status || 'VALIDE'}</span></td>
                    <td>
                        <button onclick="QREngine.openMobileQRModal('${p.id}')" class="btn btn-primary btn-sm" style="font-weight: 700;">📱 Fiche QR</button>
                        <button onclick="App.openPermitPreview('${p.id}')" class="btn btn-secondary btn-sm">📄 A4</button>
                        <button onclick="App.editPermit('${p.id}')" class="btn btn-warning btn-sm" style="font-weight: 700; background: #f59e0b; color: #000; border: none;">✏️ Modif</button>
                        <button onclick="App.duplicatePermit('${p.id}')" class="btn btn-outline btn-sm" title="Dupliquer">📋</button>
                        <button onclick="App.deletePermitAction('${p.id}')" class="btn btn-outline btn-sm" style="color: #ef4444;" title="Supprimer">🗑️</button>
                    </td>
                </tr>
            `).join('');
        }
    },

    filterPermitList(query) {
        const q = query.toLowerCase();
        const cards = document.querySelectorAll('.permit-mini-card');
        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(q) ? 'block' : 'none';
        });
    },

    createNewPermit() {
        const today = new Date().toISOString().split('T')[0];
        const newId = Store.generateId();

        document.getElementById('form-permit-id').value = newId;
        document.getElementById('form-permit-type').value = 'general';
        document.getElementById('form-title').value = '';
        document.getElementById('form-title-en').value = '';
        document.getElementById('form-company').value = 'SINYLON';
        document.getElementById('form-contact').value = 'Nouri Chahrour (HSE Sinylon)';
        document.getElementById('form-tel').value = '0563765157';
        document.getElementById('form-ouvrage').value = 'Atelier Assemblage Stellantis';
        document.getElementById('form-zone').value = 'Zone 4';
        document.getElementById('form-location').value = 'Bâtiment Principal';
        document.getElementById('form-work-desc').value = '';
        document.getElementById('form-work-desc-en').value = '';
        document.getElementById('form-date-main').value = today;
        document.getElementById('form-time-start').value = '07h30';
        document.getElementById('form-time-end').value = '18h00';
        document.getElementById('form-is-weekend').checked = false;
        document.getElementById('form-chef-nom').value = 'XIE XIAN (Chef de Projet)';
        document.getElementById('form-wpeex-nom').value = 'M. W.P.E.E.X (Ingénieur de Suivi)';
        document.getElementById('form-hse-nom').value = 'Nouri Chahrour (HSE Sinylon)';
        if (document.getElementById('form-chef-equipe')) {
            document.getElementById('form-chef-equipe').value = 'ZHOULIN (Chef d\'Équipe)';
        }

        this.switchView('create');
        this.showToast('Nouveau permis initialisé.', 'info');
    },

    editPermit(permitId) {
        const permit = Store.getPermit(permitId);
        if (!permit) return;

        this.currentPermitId = permit.id;
        document.getElementById('form-permit-id').value = permit.id;
        document.getElementById('form-permit-type').value = permit.type || 'general';
        document.getElementById('form-title').value = permit.title || '';
        document.getElementById('form-title-en').value = permit['title-en'] || Translator.localDictionaryTranslate(permit.title || '');
        document.getElementById('form-company').value = permit.company || 'SINYLON';
        document.getElementById('form-contact').value = permit.contact || 'Nouri Chahrour (HSE Sinylon)';
        document.getElementById('form-tel').value = permit.tel || '0563765157';
        document.getElementById('form-ouvrage').value = permit.ouvrage || '';
        document.getElementById('form-zone').value = permit.zone || '';
        document.getElementById('form-location').value = permit.location || '';
        document.getElementById('form-work-desc').value = permit['work-desc'] || '';
        document.getElementById('form-work-desc-en').value = permit['work-desc-en'] || Translator.localDictionaryTranslate(permit['work-desc'] || '');
        document.getElementById('form-date-main').value = permit['date-main'] || '';
        document.getElementById('form-time-start').value = permit['time-start'] || '';
        document.getElementById('form-time-end').value = permit['time-end'] || '';
        document.getElementById('form-is-weekend').checked = !!permit.isWeekendWork;
        document.getElementById('form-chef-nom').value = permit['chef-nom'] || 'XIE XIAN (Chef de Projet)';
        document.getElementById('form-wpeex-nom').value = permit['wpeex-nom'] || 'M. W.P.E.E.X (Ingénieur de Suivi)';
        document.getElementById('form-hse-nom').value = permit['hse-nom'] || 'Nouri Chahrour (HSE Sinylon)';
        if (document.getElementById('form-chef-equipe')) {
            document.getElementById('form-chef-equipe').value = permit.chef_equipe || 'ZHOULIN (Chef d\'Équipe)';
        }

        this.switchView('create');
        this.showToast(`✏️ Mode modification activé pour le permis ${permit.id}`, 'info');
    },

    savePermitFromForm() {
        const id = document.getElementById('form-permit-id').value.trim() || Store.generateId();
        const type = document.getElementById('form-permit-type').value;

        const permit = Store.getPermit(id) || { 
            id, 
            createdAt: new Date().toISOString(), 
            revalidations: [], 
            travailleurs: [
                { id: 'T-101', nom: 'ZHOULIN', role: 'Chef d\'Équipe', badge: 'SYN-014' }
            ],
            historique_modifications: []
        };

        permit.type = type;
        permit.type_permis = document.getElementById('form-permit-type').options[document.getElementById('form-permit-type').selectedIndex].text;
        permit.title = document.getElementById('form-title').value.trim() || 'Permis de Travail';
        permit['title-en'] = document.getElementById('form-title-en').value.trim() || Translator.localDictionaryTranslate(permit.title);
        permit.company = document.getElementById('form-company').value.trim() || 'SINYLON';
        permit.contact = document.getElementById('form-contact').value.trim() || 'Nouri Chahrour (HSE Sinylon)';
        permit.tel = document.getElementById('form-tel').value.trim() || '0563765157';
        permit.ouvrage = document.getElementById('form-ouvrage').value.trim();
        permit.zone = document.getElementById('form-zone').value.trim();
        permit.location = document.getElementById('form-location').value.trim();
        permit['work-desc'] = document.getElementById('form-work-desc').value.trim();
        permit['work-desc-en'] = document.getElementById('form-work-desc-en').value.trim() || Translator.localDictionaryTranslate(permit['work-desc']);
        permit['date-main'] = document.getElementById('form-date-main').value;
        permit['time-start'] = document.getElementById('form-time-start').value;
        permit['time-end'] = document.getElementById('form-time-end').value;
        permit.isWeekendWork = document.getElementById('form-is-weekend').checked;
        permit['chef-nom'] = document.getElementById('form-chef-nom').value.trim() || 'XIE XIAN (Chef de Projet)';
        permit.chef_equipe = (document.getElementById('form-chef-equipe') ? document.getElementById('form-chef-equipe').value.trim() : '') || 'ZHOULIN (Chef d\'Équipe)';
        permit['wpeex-nom'] = document.getElementById('form-wpeex-nom').value.trim() || 'M. W.P.E.E.X (Ingénieur de Suivi)';
        permit['hse-nom'] = document.getElementById('form-hse-nom').value.trim() || 'Nouri Chahrour (HSE Sinylon)';
        permit['receveur-nom'] = '';

        if (!permit.dangers) permit.dangers = { methodReq: true };
        permit.dangers.height = (type === 'height');
        permit.dangers.hot = (type === 'hot');
        permit.dangers.electric = (type === 'electric');

        permit.dangers.emergencyPlan = false; // Pas de plan d'urgence attaché

        if (type === 'height') {
            permit.annexes = ['height'];
            permit.heightDetails = { platform: true, mobileScaffold: false, fixedScaffold: false, scissorLiftsCount: 6, manliftCount: 1, harnessChecked: true, operatorTrained: true, weatherClear: true, dryFloor: true, qualifiedApproved: true, fallArrest: true, safetyNet: false };
        } else if (type === 'hot') {
            permit.annexes = ['hot'];
            permit.hotDetails = { inflammablesClear10m: true, fireproofTarps: true, extinguisherPowder: true, extinguisherWater: true, extinguisherCO2: true, fireWatcherPresent: true, alarmZone: 'Poste Central Sécurité Stellantis', detectorBypass: false, drainsClosed: true, ventilationAdequate: true, cablesProtected: true, postWorkWatch: false };
        } else if (type === 'electric') {
            permit.annexes = ['electric'];
            permit.electricDetails = { consignationChecked: true, voltageAbsenceChecked: true, lockoutTagout: true, habilitationNiveau: 'B2V / BR / BC / H1V', protectiveGloves: true, isolatedTools: true, schematicAttached: true, cablePulling: true, switchboardInstall: true, motorsInstall: true };
        }

        permit.wpeexValidated = true;

        Store.savePermit(permit);
        this.currentPermitId = permit.id;

        this.renderPermitList();
        this.renderDashboard();
        this.openPermitPreview(permit.id);
        this.showToast(`✅ Permis ${permit.id} enregistré avec succès !`, 'success');
    },

    openPermitPreview(permitId) {
        this.currentPermitId = permitId;
        const permit = Store.getPermit(permitId);
        if (permit) {
            if (permit.type === 'height') this.previewPage = 'height';
            else if (permit.type === 'hot') this.previewPage = 'hot';
            else if (permit.type === 'electric') this.previewPage = 'electric';
            else this.previewPage = 'p1';
        }

        this.switchView('preview');
        this.renderPreview();
    },

    switchPreviewTab(pageName) {
        this.previewPage = pageName;
        document.querySelectorAll('.preview-tab-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById(`btn-tab-${pageName}`);
        if (activeBtn) activeBtn.classList.add('active');
        this.renderPreview();
    },

    renderPreview() {
        const permit = Store.getPermit(this.currentPermitId);
        if (!permit) return;

        const container = document.getElementById('a4-preview-render');
        if (!container) return;

        let content = '';
        if (this.previewPage === 'p1') {
            content = Templates.generalP1(permit);
        } else if (this.previewPage === 'p2') {
            content = Templates.generalP2(permit);
        } else if (this.previewPage === 'height') {
            content = Templates.heightAnnexe(permit);
        } else if (this.previewPage === 'hot') {
            content = Templates.hotAnnexe(permit);
        } else if (this.previewPage === 'electric') {
            content = Templates.electricAnnexe(permit);
        }

        container.innerHTML = content;

        // Auto-save sur toute modification de texte au clavier dans le document A4
        container.oninput = () => {
            this.scheduleAutoSave(this.currentPermitId);
        };

        // Rendu automatique et instantané du QR Code sur tous les conteneurs de la page
        const qrBoxes = container.querySelectorAll('.qr-container');
        qrBoxes.forEach(qrBox => {
            const canvas = document.createElement('canvas');
            QREngine.renderToCanvas(canvas, permit, { size: 100, margin: 1 });
            qrBox.innerHTML = '';
            qrBox.appendChild(canvas);
        });
    },

    // =========================================================================
    // PARAMÈTRES DU CODE D'AUTORISATION
    // =========================================================================

    openAuthSettingsModal() {
        const modal = document.getElementById('modal-auth-settings');
        if (!modal) return;

        document.getElementById('settings-current-auth-code').value = Store.getAuthCode();
        document.getElementById('settings-new-auth-code').value = '';
        const renderInput = document.getElementById('settings-render-url');
        if (renderInput) {
            renderInput.value = QREngine.getBaseURL();
        }
        modal.classList.add('active');
    },

    closeAuthSettingsModal() {
        const modal = document.getElementById('modal-auth-settings');
        if (modal) modal.classList.remove('active');
    },

    saveAuthAndRenderSettings() {
        const newCode = document.getElementById('settings-new-auth-code').value;
        const renderUrl = document.getElementById('settings-render-url') ? document.getElementById('settings-render-url').value : '';

        if (newCode && newCode.trim().length >= 4) {
            Store.setAuthCode(newCode.trim());
        }

        if (renderUrl !== undefined) {
            QREngine.setRenderURL(renderUrl.trim());
        }

        this.closeAuthSettingsModal();
        this.renderPreview();
        this.showToast('✅ Paramètres et URL Render enregistrés ! QR Codes actualisés.', 'success', 4000);
    },

    saveNewAuthCode() {
        this.saveAuthAndRenderSettings();
    },

    // Modal d'Action Urgente Terrain ("BESOIN URGENT")
    openUrgentActionModal() {
        const modal = document.getElementById('modal-urgent-action');
        if (modal) modal.classList.add('active');
    },

    closeUrgentActionModal() {
        const modal = document.getElementById('modal-urgent-action');
        if (modal) modal.classList.remove('active');
    },

    // Toast Notification System
    showToast(message, type = 'info', duration = 3500) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerText = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, duration);
    }
};

window.App = App;

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
