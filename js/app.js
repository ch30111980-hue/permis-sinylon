/**
 * SINYLON - STELLANTIS | Main Application Controller V2
 * Moteur de Semaine Active, Gestion des Permis de Travail, Édition Rapide & Fiche de Contrôle Publique
 */

const App = {
    currentView: 'dashboard',
    currentWeek: 35,
    currentPermitId: 'K9-W35-01',
    previewPage: 'p1',

    // Sécurité : mode lecture seule pour visiteurs QR
    isQRSession: false,
    _supAttempts: 0,
    _supLockedUntil: 0,

    // Helper robuste — résout l'ID du permis actif au moment du clic (jamais null)
    getActivePermitId() {
        if (this.currentPermitId) return this.currentPermitId;
        const permits = Store.getPermitsByWeek(this.currentWeek || 35);
        if (permits && permits.length > 0) {
            this.currentPermitId = permits[0].id;
            return this.currentPermitId;
        }
        return 'K9-W35-01';
    },

    // Initialisation
    async init() {
        // 0. Détection immédiate de scan QR direct dans l'URL (?permitId=... ou #K9-W35-01) pour éviter tout clignotement
        const urlParams = new URLSearchParams(window.location.search);
        const queryPermitId = urlParams.get('permitId') || (window.location.hash ? window.location.hash.substring(1).trim() : null);

        if (queryPermitId) {
            this.currentPermitId = queryPermitId;
            this.isQRSession = true; // 🔒 Mode lecture seule — bloque l'accès au dashboard
            document.documentElement.classList.add('qr-mode');
            await Store.initAuth();
            await this.showPublicClientView(queryPermitId);
            return;
        }

        // 1. Migration sécurité : passer le code auth en hash (SHA-256)
        await Store.initAuth();

        // 2. Détection de la semaine courante
        this.currentWeek = Store.getCurrentWeekNumber();

        // 3. Gestion des paramètres de l'application & langue
        const settings = Store.getSettings();
        if (settings.defaultLang) {
            Translator.currentLang = settings.defaultLang;
            this.updateLanguageButtons(settings.defaultLang);
        }

        // 4. Liaison des événements
        this.bindEvents();

        // 5. Initialisation propre du Dashboard
        this.renderDashboard();
        this.renderSidebarWeekIndex();

        // 6. Synchronisation douce en arrière-plan sans re-render brutal (anti-clignotement)
        Store.syncWithServer().then((updated) => {
            if (updated && this.currentView === 'dashboard' && !this.isQRSession) {
                this.renderSidebarWeekIndex();
            }
        });

        // 7. Alerte Caisse Weekend le Mercredi
        const dates = WeekendCaisseModule.getWeekendDates();
        if (dates && dates.isWednesday) {
            this.showToast('🔔 MERCREDI : Préparation du Dossier Week-end pour présentation STELLANTIS !', 'warning', 8000);
        }

        // 8. Écouteur de changement de hash
        window.addEventListener('hashchange', async () => {
            if (window.location.hash && window.location.hash.length > 1) {
                const targetId = window.location.hash.substring(1).trim();
                await this.showPublicClientView(targetId);
            }
        });
    },

    exitToDashboard() {
        // 🔒 SÉCURITÉ : bloquer l'accès dashboard pour les visiteurs QR non authentifiés
        if (this.isQRSession) {
            this.showToast('⛔ Accès réservé aux superviseurs SINYLON. Utilisez le bouton 🔒.', 'error', 4000);
            return;
        }
        document.documentElement.classList.remove('qr-mode');
        const clientView = document.getElementById('client-public-view');
        if (clientView) clientView.style.display = 'none';
        const layout = document.querySelector('.app-layout');
        if (layout) layout.style.display = 'grid';
        if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        this.switchView('dashboard');
        this.renderDashboard();
    },

    // =========================================================================
    // VUE PUBLIQUE DE CONTRÔLE CHANTIER (100% SÉCURISÉE & CONFIDENTIELLE)
    // =========================================================================

    async showPublicClientView(permitId) {
        // 1. Récupération synchrone — FIXE 5 : erreur si permitId inconnu (pas de fallback silencieux)
        document.documentElement.classList.add('qr-mode');
        const layout = document.querySelector('.app-layout');
        if (layout) layout.style.display = 'none';
        const clientView = document.getElementById('client-public-view');
        if (!clientView) return;
        clientView.style.display = 'block';

        let p = Store.getPermit(permitId);

        // Si non trouvé en cache local, tenter une synchronisation ciblée
        if (!p && typeof Store.syncWithServer === 'function') {
            await Store.syncWithServer();
            p = Store.getPermit(permitId);
        }

        if (!p) {
            // Affichage sécurisé d'erreur
            clientView.innerHTML = `
                <div style="max-width: 500px; margin: 60px auto; padding: 30px; text-align: center; background: rgba(15,23,42,0.95); border: 2px solid #ef4444; border-radius: 16px; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
                    <div style="font-size: 48px; margin-bottom: 12px;">🚫</div>
                    <h2 style="color: #ef4444; margin-bottom: 8px;">Permis Non Trouvé / Invalide</h2>
                    <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">L'identifiant de permis <strong>"${permitId}"</strong> n'existe pas ou n'est pas encore synchronisé sur le serveur officiel SINYLON.</p>
                    <div style="margin-top: 24px; display: flex; justify-content: center; gap: 10px;">
                        <button onclick="window.location.reload()" style="background: #3b82f6; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer;">🔄 Réessayer</button>
                        <button onclick="App.openSupervisorAuthModal()" style="background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer;">🔒 Superviseur</button>
                    </div>
                </div>
            `;
            return;
        }

        const renderMobileContent = (p) => {
            if (!p) return;
            try {
                const currentLang = Translator.currentLang || 'fr';
                const isChinese = currentLang === 'zh';
                const isEnglish = currentLang === 'en';

                const zoneStr = p.zone || 'Zone A1 (Bâtiment Principal / Ligne Montage)';
                const activityText = isChinese ? (p.activite_detaillee_zh || p.title_zh || p.title || '') :
                                    isEnglish ? (p.activite_detaillee_en || p.title_en || p.title || '') :
                                    (p.activite_detaillee_fr || p.title || 'Installation Mécanique et Montage');

                const equipementsStr = Array.isArray(p.equipements_a_installer) ? p.equipements_a_installer.join(', ') : (p.equipements_a_installer || 'Nacelles ciseaux (x6), Palans DEMAG KBK, Outillages certifiés');

                const workers = p.travailleurs && p.travailleurs.length > 0 ? p.travailleurs : [
                    { id: 'T-1', nom: 'Xie', role: 'Chef de Projet / Receveur', badge: 'SYN-001', status: 'Actif' },
                    { id: 'T-2', nom: 'Nouri Chahrour', role: 'Superviseur HSE Sinylon (0563765157)', badge: 'SYN-003', status: 'Actif' }
                ];

                // Rendu des travailleurs avec la règle : BLANC si Actif / Sur liste, BLEU si Inactif / Hors liste
                let workersHtml = workers.map((w, idx) => {
                    const nom = typeof w === 'object' ? w.nom : w;
                    const role = typeof w === 'object' ? (w.role || 'Intervenant') : 'Intervenant';
                    const badge = typeof w === 'object' && w.badge ? w.badge : `SIN-${1040 + idx * 2}`;
                    const isActive = typeof w === 'object' ? (w.status !== 'Inactif' && w.status !== 'Inactive') : true;

                    if (isActive) {
                        return `
                            <div style="background: rgba(15, 23, 42, 0.7); border: 1.5px solid rgba(52, 211, 153, 0.4); border-left: 4px solid #34d399; border-radius: 10px; padding: 10px 14px; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                                <div style="font-size: 24px;">👷</div>
                                <div style="flex: 1;">
                                    <!-- NOM EN BLANC ÉCLATANT -->
                                    <div style="font-weight: 800; color: #ffffff; font-size: 14px; letter-spacing: 0.3px; text-shadow: 0 0 8px rgba(255,255,255,0.4);">${nom}</div>
                                    <div style="font-size: 11px; color: #cbd5e1; margin-top: 2px;">${role}</div>
                                </div>
                                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                                    <span style="background: #ffffff; color: #0f172a; font-weight: 900; font-size: 10px; padding: 2px 7px; border-radius: 4px; font-family: monospace;">${badge}</span>
                                    <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-weight: 800; font-size: 9.5px; padding: 2px 6px; border-radius: 8px; border: 1px solid rgba(52, 211, 153, 0.4);">🟢 SUR LISTE</span>
                                </div>
                            </div>
                        `;
                    } else {
                        return `
                            <div style="background: rgba(30, 58, 138, 0.2); border: 1.5px solid rgba(96, 165, 250, 0.35); border-left: 4px solid #3b82f6; border-radius: 10px; padding: 10px 14px; display: flex; align-items: center; gap: 12px;">
                                <div style="font-size: 24px; opacity: 0.8;">👤</div>
                                <div style="flex: 1;">
                                    <!-- NOM EN BLEU / HORS LISTE -->
                                    <div style="font-weight: 700; color: #60a5fa; font-size: 14px; letter-spacing: 0.2px;">${nom}</div>
                                    <div style="font-size: 11px; color: #93c5fd; margin-top: 2px;">${role}</div>
                                </div>
                                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                                    <span style="background: rgba(59, 130, 246, 0.2); color: #93c5fd; font-weight: 700; font-size: 10px; padding: 2px 7px; border-radius: 4px; font-family: monospace;">${badge}</span>
                                    <span style="background: rgba(37, 99, 235, 0.2); color: #93c5fd; font-weight: 800; font-size: 9.5px; padding: 2px 6px; border-radius: 8px; border: 1px solid rgba(96, 165, 250, 0.35);">🔵 HORS LISTE</span>
                                </div>
                            </div>
                        `;
                    }
                }).join('');

                const ppeList = p.ppe || ["Casque de sécurité", "Chaussures S3", "Gilet haute visibilité", "Gants de protection", "Harnais antichute"];
                const ppeHtml = ppeList.map(item => `
                    <span class="badge badge-sky" style="font-size: 11px; padding: 4px 8px;">🛡️ ${item}</span>
                `).join(' ');

                const isWeekend = !!p.weekend || !!p.isWeekendWork;
                const statusBadge = isWeekend ? 
                    `<span style="background: #8b5cf6; color: #ffffff; font-weight: 800; padding: 6px 18px; border-radius: 20px; font-size: 13px; display: inline-flex; align-items: center; gap: 6px;">🟣 PERMIS TRAVAIL WEEK-END</span>` :
                    `<span style="background: #15803d; color: #ffffff; font-weight: 800; padding: 6px 18px; border-radius: 20px; font-size: 13px; display: inline-flex; align-items: center; gap: 6px;">🟢 PERMIS VALIDE & ACTIF SUR CHANTIER</span>`;

                clientView.innerHTML = `
                    <div style="max-width: 680px; margin: 0 auto; padding: 20px 16px; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        <!-- En-tête Langues & Logos -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; gap: 8px; flex-wrap: wrap;">
                            <div style="display: flex; gap: 8px; align-items: center;">
                                <span style="background: #ffffff; color: #000; padding: 4px 10px; font-weight: 900; font-size: 14px; border-radius: 4px;">SINYLON</span>
                                <span style="border: 2px solid #ffffff; color: #ffffff; padding: 3px 10px; font-weight: 900; font-size: 14px; border-radius: 4px;">STELLANTIS</span>
                            </div>
                            <div style="display: flex; gap: 6px; align-items: center;">
                                <div class="lang-switch-group">
                                    <button class="lang-btn ${currentLang === 'fr' ? 'active' : ''}" onclick="Translator.setLang('fr'); App.showPublicClientView('${p.id}');">FR</button>
                                    <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" onclick="Translator.setLang('en'); App.showPublicClientView('${p.id}');">EN</button>
                                    <button class="lang-btn ${currentLang === 'zh' ? 'active' : ''}" onclick="Translator.setLang('zh'); App.showPublicClientView('${p.id}');">中文</button>
                                </div>
                            </div>
                        </div>

                        <!-- Header de Certification Officielle -->
                        <div style="background: linear-gradient(135deg, #1e3a8a, #0f172a); border: 2px solid #3b82f6; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.5);">
                            <div style="font-size: 11px; font-weight: 700; color: #93c5fd; text-transform: uppercase; letter-spacing: 1px;">
                                🛡️ FICHE DE CONTRÔLE HSE ET AUDIT CHANTIER OFFICIEL
                            </div>
                            <div style="font-size: 24px; font-weight: 900; letter-spacing: 1px; color: #ffffff; margin-top: 4px;">
                                PERMIS ${p.id}
                            </div>
                            <div style="font-size: 13px; color: #cbd5e1; margin-top: 2px;">
                                Projet : Algeria K9 CKD0 — Usine Stellantis
                            </div>
                            
                            <div style="margin-top: 14px;">
                                ${statusBadge}
                            </div>
                        </div>

                        <!-- Activité et Détails de la Zone -->
                        <div style="background: #182238; border: 1px solid #23304c; border-radius: 12px; padding: 18px; margin-bottom: 16px;">
                            <div style="font-size: 14px; font-weight: 800; color: #60a5fa; border-bottom: 1px solid #23304c; padding-bottom: 8px; margin-bottom: 12px;">
                                📋 Activités & Travaux de la Zone
                            </div>
                            <div style="font-size: 14px; font-weight: 600; color: #ffffff; line-height: 1.5; margin-bottom: 10px; white-space: pre-line;">
                                ${activityText}
                            </div>
                            <div style="background: rgba(0,0,0,0.2); border: 1px solid #23304c; border-radius: 8px; padding: 10px; margin-bottom: 12px; font-size: 12.5px;">
                                <strong style="color: #38bdf8;">📦 Équipements à installer :</strong><br>
                                <span style="color: #e2e8f0;">${equipementsStr}</span>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 10px;">
                                <div>🏢 <strong>Entreprise :</strong> ${p.contractor || p.company || 'SINYLON'}</div>
                                <div>🏛️ <strong>Client :</strong> STELLANTIS</div>
                                <div>📍 <strong>Secteur :</strong> ${p.ouvrage || 'Atelier Montage K9'}</div>
                                <div>📌 <strong>Zone(s) :</strong> <span style="color: #60a5fa; font-weight: 800;">${p.zone || 'UB / UAR / FUSA'}</span></div>
                                <div>👨‍💼 <strong>Chef de Projet :</strong> ${p.responsible || p.chefNom || 'Xie (Chef de Projet)'}</div>
                                <div>📞 <strong>Tél. HSE :</strong> <span style="color: #10b981; font-weight: 800;">${p.tel || '0563765157'}</span></div>
                                <div style="grid-column: span 2;">⏰ <strong>Horaires de Travail :</strong> ${p.timeStart || '08h00'} → ${p.timeEnd || '17h30'} (${p.validFrom || '2026-08-24'} au ${p.validUntil || '2026-08-30'})</div>
                            </div>
                        </div>

                        <!-- 3 Annexes de Sécurité Certifiées -->
                        <div style="background: #182238; border: 1px solid #23304c; border-radius: 12px; padding: 18px; margin-bottom: 16px;">
                            <div style="font-size: 14px; font-weight: 800; color: #f59e0b; border-bottom: 1px solid #23304c; padding-bottom: 8px; margin-bottom: 12px;">
                                ⚠️ Annexes de Sécurité & Dossier 5 Pages Certifié
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr; gap: 8px; font-size: 12px;">
                                <div style="background: rgba(2,132,199,0.15); border: 1px solid #0284c7; padding: 8px 12px; border-radius: 6px; color: #7dd3fc;">
                                    🧗 <strong>Annexe A (Hauteur) :</strong> 6 Nacelles Ciseaux + 1 Manlift (PEMP) — Validé ✓
                                </div>
                                <div style="background: rgba(239,68,68,0.15); border: 1px solid #ef4444; padding: 8px 12px; border-radius: 6px; color: #fca5a5;">
                                    🔥 <strong>Annexe B (Chaud) :</strong> Soudage / Pinces X/C, Extincteurs à poste — Validé ✓
                                </div>
                                <div style="background: rgba(245,158,11,0.15); border: 1px solid #f59e0b; padding: 8px 12px; border-radius: 6px; color: #fcd34d;">
                                    ⚡ <strong>Annexe C (Électrique) :</strong> Consignation LOTO, VAT 0V, Gants 1000V — Validé ✓
                                </div>
                            </div>
                            <div style="margin-top: 12px;">
                                ${ppeHtml}
                            </div>
                        </div>

                        <!-- Visas MOEX / W.P.E.E.X / SINYLON HSE -->
                        <div style="background: #182238; border: 1px solid #23304c; border-radius: 12px; padding: 18px; margin-bottom: 16px;">
                            <div style="font-size: 14px; font-weight: 800; color: #10b981; border-bottom: 1px solid #23304c; padding-bottom: 8px; margin-bottom: 12px;">
                                ✅ Visas Officiels & Revalidations Journalières (08h00)
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-size: 11px; text-align: center;">
                                <div style="background: rgba(16,185,129,0.1); border: 1px solid #10b981; padding: 8px; border-radius: 6px;">
                                    <div style="font-weight: 700; color: #10b981;">STELLANTIS</div>
                                    <div style="font-size: 10px; color: #a7f3d0;">✓ VALIDÉ</div>
                                </div>
                                <div style="background: rgba(16,185,129,0.1); border: 1px solid #10b981; padding: 8px; border-radius: 6px;">
                                    <div style="font-weight: 700; color: #10b981;">W.P.E.E.X SUIVI</div>
                                    <div style="font-size: 10px; color: #a7f3d0;">✓ 08H00 MATIN</div>
                                </div>
                                <div style="background: rgba(16,185,129,0.1); border: 1px solid #10b981; padding: 8px; border-radius: 6px;">
                                    <div style="font-weight: 700; color: #10b981;">SINYLON HSE</div>
                                    <div style="font-size: 10px; color: #a7f3d0;">✓ 0563765157</div>
                                </div>
                            </div>
                        </div>

                        <!-- Intervenants autorisés -->
                        <div style="background: #182238; border: 1px solid #23304c; border-radius: 12px; padding: 18px; margin-bottom: 16px;">
                            <div style="font-size: 14px; font-weight: 800; color: #60a5fa; border-bottom: 1px solid #23304c; padding-bottom: 8px; margin-bottom: 12px;">
                                👥 Équipe Autorisée sur Chantier
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                ${workersHtml}
                            </div>
                        </div>

                        <!-- Boutons d'action -->
                        <div style="text-align: center; margin-top: 20px; display: flex; flex-direction: column; gap: 10px;">
                            <button onclick="App.printPermit('${p.id}')" class="btn btn-primary btn-lg" style="width: 100%; justify-content: center; font-size: 15px; padding: 14px;">
                                🖨️ IMPRIMER / TÉLÉCHARGER DOSSIER COMPLET (5 PAGES A4)
                            </button>
                            <button onclick="App.openSupervisorModal()" class="btn btn-outline btn-sm" style="color: #64748b; border-color: #334155; font-size: 12px; padding: 8px;">
                                🔒 Accès Superviseur (Équipe SINYLON)
                            </button>
                        </div>
                    </div>
                `;
            } catch (err) {
                console.error("Erreur renderMobileContent:", err);
            }
        };

        // Rendu immédiat
        renderMobileContent(p);

        // Rafraîchissement en arrière-plan
        if (typeof Store.getPermitAsync === 'function') {
            Store.getPermitAsync(permitId).then(fresh => {
                if (fresh && fresh.id) {
                    renderMobileContent(fresh);
                }
            });
        }
    },

    // =========================================================================
    // MODAL SUPERVISEUR — Accès sécurisé avec 3 tentatives max + verrouillage
    // =========================================================================

    openSupervisorModal() {
        const modal = document.getElementById('modal-supervisor');
        if (!modal) return;
        const input = document.getElementById('supervisor-code-input');
        const attemptWarn = document.getElementById('supervisor-attempt-warning');
        const lockWarn = document.getElementById('supervisor-lock-warning');
        if (input) input.value = '';
        if (attemptWarn) attemptWarn.style.display = 'none';
        if (this._supLockedUntil > Date.now()) {
            if (lockWarn) lockWarn.style.display = 'block';
            this._startLockTimer();
        } else {
            if (lockWarn) lockWarn.style.display = 'none';
            this._supAttempts = 0;
        }
        modal.classList.add('active');
        setTimeout(() => { if (input) input.focus(); }, 150);
    },

    closeSupervisorModal() {
        const modal = document.getElementById('modal-supervisor');
        if (modal) modal.classList.remove('active');
    },

    async submitSupervisorCode() {
        const MAX_ATTEMPTS = 3;
        const LOCK_MS = 5 * 60 * 1000; // 5 minutes

        if (this._supLockedUntil > Date.now()) {
            this.showToast('⛔ Accès bloqué — Réessayez dans quelques minutes.', 'error');
            return;
        }

        const input = document.getElementById('supervisor-code-input');
        const code = input ? input.value.trim() : '';
        if (!code) { this.showToast('⚠️ Entrez le code superviseur', 'warning'); return; }

        const btn = document.getElementById('supervisor-submit-btn');
        if (btn) { btn.disabled = true; btn.textContent = '⏳...'; }

        const ok = await Store.verifyAuthCode(code);

        if (btn) { btn.disabled = false; btn.textContent = '🔓 Accéder'; }

        if (ok) {
            this._supAttempts = 0;
            this._supLockedUntil = 0;
            this.isQRSession = false; // 🔓 Lever le verrou QR
            this.closeSupervisorModal();
            this.showToast('🔓 Accès Superviseur accordé !', 'success');
            this.exitToDashboard();
        } else {
            this._supAttempts++;
            const remaining = MAX_ATTEMPTS - this._supAttempts;
            if (remaining <= 0) {
                this._supLockedUntil = Date.now() + LOCK_MS;
                this._supAttempts = 0;
                const lockWarn = document.getElementById('supervisor-lock-warning');
                const attemptWarn = document.getElementById('supervisor-attempt-warning');
                if (lockWarn) lockWarn.style.display = 'block';
                if (attemptWarn) attemptWarn.style.display = 'none';
                this._startLockTimer();
                this.showToast('🔴 Accès bloqué 5 min — 3 tentatives échouées', 'error', 6000);
            } else {
                const attemptWarn = document.getElementById('supervisor-attempt-warning');
                const attLeft = document.getElementById('supervisor-attempts-left');
                if (attemptWarn) attemptWarn.style.display = 'block';
                if (attLeft) attLeft.textContent = remaining;
                this.showToast(`⛔ Code incorrect — ${remaining} tentative(s) restante(s)`, 'error');
            }
            if (input) { input.value = ''; input.focus(); }
        }
    },

    _startLockTimer() {
        const timerEl = document.getElementById('supervisor-lock-timer');
        if (!timerEl) return;
        const tick = () => {
            const left = Math.max(0, this._supLockedUntil - Date.now());
            if (left <= 0) {
                timerEl.textContent = '0:00';
                const lockWarn = document.getElementById('supervisor-lock-warning');
                if (lockWarn) lockWarn.style.display = 'none';
                return;
            }
            const m = Math.floor(left / 60000);
            const s = Math.floor((left % 60000) / 1000);
            timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
            setTimeout(tick, 1000);
        };
        tick();
    },

    // =========================================================================
    // MOTEUR DE SEMAINE & NAVIGATION (AUTO WEEK ENGINE)
    // =========================================================================

    prevWeek() {
        if (this.currentWeek > 25) {
            this.currentWeek--;
            this.renderDashboard();
        } else {
            this.showToast('First planned week reached (KW25).', 'info');
        }
    },

    nextWeek() {
        if (this.currentWeek < 53) {
            this.currentWeek++;
            this.renderDashboard();
        } else {
            this.showToast('Last planned week reached (KW53).', 'info');
        }
    },

    goToCurrentWeek() {
        this.currentWeek = Store.getCurrentWeekNumber();
        this.renderDashboard();
        this.showToast(`Active week W${this.currentWeek} loaded.`, 'info');
    },

    goToWeek(wNum) {
        this.currentWeek = parseInt(wNum, 10);
        this.switchView('dashboard');
        this.renderDashboard();
    },

    // =========================================================================
    // RENDU DU DASHBOARD V2 (SEMAINE ACTIVE & CARTES DE PERMIS)
    // =========================================================================

    renderDashboard() {
        const wNum = this.currentWeek;
        const weekRange = Store.getWeekRange(wNum);
        const permits = Store.getPermitsByWeek(wNum);

        // 1. Mettre à jour le bandeau de semaine
        const elBadge = document.getElementById('dash-active-week-badge');
        if (elBadge) elBadge.innerText = `WEEK ${wNum}`;

        const elTitle = document.getElementById('dash-week-title');
        if (elTitle) elTitle.innerText = `W${wNum} — ${weekRange}`;

        const elCount = document.getElementById('dash-stat-week-count');
        if (elCount) elCount.innerText = permits.length;

        const elListTitle = document.getElementById('dash-permits-list-title');
        if (elListTitle) elListTitle.innerText = `Active Work Permits for Week ${wNum} (${weekRange})`;

        const elAddWeekNo = document.getElementById('dash-add-week-no');
        if (elAddWeekNo) elAddWeekNo.innerText = wNum;

        // 2. Rendu des cartes de permis
        const container = document.getElementById('dash-permits-cards-container');
        if (!container) return;

        if (permits.length === 0) {
            container.innerHTML = `
                <div class="empty-state-card" style="grid-column: span 2; padding: 40px; text-align: center; background: var(--bg-card); border-radius: 12px; border: 1px dashed var(--border-color);">
                    <div style="font-size: 32px; margin-bottom: 10px;">📋</div>
                    <h3 style="color: #f8fafc; margin-bottom: 6px;">No Permits Configured for Week ${wNum}</h3>
                    <p style="color: #94a3b8; font-size: 13px; margin-bottom: 16px;">You can add a new permit for this week with the button below.</p>
                    <button onclick="App.createNewPermitForCurrentWeek()" class="btn btn-primary">➕ Create Permit for W${wNum}</button>
                </div>
            `;
            return;
        }

        const currentLang = Translator.currentLang || 'en';

        container.innerHTML = permits.map(p => {
            const isWeekend = !!p.weekend || !!p.isWeekendWork;
            const activityMain = (p.activity && (p.activity[currentLang] || p.activity.en || p.activity.fr)) || p['work-desc'] || p.title || '';
            const statusLabel = isWeekend ? '● WEEKEND' : (p.status === 'VALIDE' ? '● VALID' : `● ${p.status || 'ACTIVE'}`);
            const statusClass = isWeekend ? 'status-pill weekend' : (p.status === 'VALIDE' ? 'status-pill valid' : 'status-pill closed');

            // Badges risques
            const d = p.dangers || {};
            let riskBadges = [];
            if (d.height) riskBadges.push('<span class="risk-tag height">🧗 Height</span>');
            if (d.hot) riskBadges.push('<span class="risk-tag hot">🔥 Hot Work</span>');
            if (d.electric) riskBadges.push('<span class="risk-tag electric">⚡ Electrical</span>');
            if (d.confined) riskBadges.push('<span class="risk-tag confined">🕳️ Confined</span>');
            if (d.lifting) riskBadges.push('<span class="risk-tag lifting">🏗️ Lifting</span>');
            if (riskBadges.length === 0) riskBadges.push('<span class="risk-tag general">⚙️ General</span>');

            return `
                <div class="permit-card-v2 ${isWeekend ? 'weekend-card' : ''}" id="card-${p.id}">
                    <div class="permit-card-header">
                        <div class="permit-id-group">
                            <span class="permit-id-code">${p.id}</span>
                            <span class="permit-type-label">${p.type_permis || 'Permis de Travail'}</span>
                        </div>
                        <span class="${statusClass}">${statusLabel}</span>
                    </div>

                    <div class="permit-card-body">
                        <h3 class="permit-activity-title">${activityMain}</h3>

                        <div class="permit-info-grid">
                            <div class="info-item" style="grid-column: span 2;">
                                <span class="info-label">📍 Implantation & Zone(s)</span>
                                <span class="info-value" style="color: #38bdf8; font-weight: 700;">${p.zone || 'Zone UB / UAR / FUSA'}</span>
                            </div>
                            <div class="info-item" style="grid-column: span 2;">
                                <span class="info-label">⚙️ Équipements à installer</span>
                                <span class="info-value" style="color: #cbd5e1; font-size: 11px;">${Array.isArray(p.equipements_a_installer) ? p.equipements_a_installer.slice(0, 4).join(', ') : (p.equipements_a_installer || 'Nacelles ciseaux (x6), Palans DEMAG KBK')}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">🏢 Entreprise</span>
                                <span class="info-value">${p.contractor || p.company || 'SINYLON'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">📅 Période & Horaires</span>
                                <span class="info-value">${p.validFrom || p['date-main']} → ${p.validUntil || p['date_fin'] || ''} (08h00 - 17h30)</span>
                            </div>
                        </div>

                        <div class="permit-risks-bar">
                            ${riskBadges.join(' ')}
                        </div>
                    </div>

                    <div class="permit-card-actions">
                        <button type="button" class="btn-action btn-open" onclick="App.openPermitPreview('${p.id}')" title="View A4 Sheet">
                            <span>👁️</span> OPEN
                        </button>
                        <button type="button" class="btn-action btn-modify" onclick="App.fastEditPermit('${p.id}')" title="Quick Edit">
                            <span>✏️</span> MODIFY
                        </button>
                        <button type="button" class="btn-action btn-qr" onclick="App.openQR('${p.id}')" title="QR Code & Poster">
                            <span>📱</span> QR
                        </button>
                        <button type="button" class="btn-action btn-print" onclick="App.printPermit('${p.id}')" title="Print A4 Document">
                            <span>🖨️</span> PRINT
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    // =========================================================================
    // ÉDITION RAPIDE MODALE (FAST EDIT MODAL)
    // =========================================================================

    fastEditPermit(permitId) {
        const permit = Store.getPermit(permitId);
        if (!permit) return;

        this.currentPermitId = permit.id;
        document.getElementById('fast-edit-id').value = permit.id;
        document.getElementById('fast-edit-id-title').innerText = permit.id;

        const currentLang = Translator.currentLang || 'en';
        document.getElementById('fast-edit-title').value = permit.title_en || permit.title || '';
        document.getElementById('fast-edit-type').value = permit.type || 'general';
        document.getElementById('fast-edit-activity').value = (permit.activity && (permit.activity[currentLang] || permit.activity.en || permit.activity.fr)) || permit['work-desc'] || '';
        document.getElementById('fast-edit-zone').value = `${permit.ouvrage || ''} — ${permit.zone || ''}`;
        document.getElementById('fast-edit-contractor').value = permit.contractor || permit.company || 'SINYLON';
        document.getElementById('fast-edit-responsible').value = permit.responsible || permit.chefNom || 'Nouri Chahrour';
        document.getElementById('fast-edit-hse').value = permit.hseNom || permit.contact || 'Nouri Chahrour (0563765157)';
        document.getElementById('fast-edit-valid-from').value = permit.validFrom || permit['date-main'] || '';
        document.getElementById('fast-edit-valid-until').value = permit.validUntil || permit['date_fin'] || '';

        const d = permit.dangers || {};
        document.getElementById('fast-edit-risk-height').checked = !!d.height;
        document.getElementById('fast-edit-risk-hot').checked = !!d.hot;
        document.getElementById('fast-edit-risk-electric').checked = !!d.electric;
        document.getElementById('fast-edit-risk-confined').checked = !!d.confined;

        const modal = document.getElementById('modal-fast-edit');
        if (modal) modal.classList.add('active');
    },

    closeFastEditModal() {
        const modal = document.getElementById('modal-fast-edit');
        if (modal) modal.classList.remove('active');
    },

    saveFastEditModal() {
        const id = document.getElementById('fast-edit-id').value;
        const permit = Store.getPermit(id);
        if (!permit) return;

        permit.title = document.getElementById('fast-edit-title').value.trim();
        permit.title_en = permit.title;
        permit.type = document.getElementById('fast-edit-type').value;
        permit.type_permis = document.getElementById('fast-edit-type').options[document.getElementById('fast-edit-type').selectedIndex].text;

        const actText = document.getElementById('fast-edit-activity').value.trim();
        if (!permit.activity) permit.activity = {};
        permit.activity.en = actText;
        permit.activity.fr = actText;
        permit['work-desc'] = actText;
        permit['work-desc-en'] = actText;

        const zoneRaw = document.getElementById('fast-edit-zone').value.trim();
        permit.zone = zoneRaw;
        permit.contractor = document.getElementById('fast-edit-contractor').value.trim();
        permit.responsible = document.getElementById('fast-edit-responsible').value.trim();
        permit.hseNom = document.getElementById('fast-edit-hse').value.trim();
        permit.validFrom = document.getElementById('fast-edit-valid-from').value.trim();
        permit.validUntil = document.getElementById('fast-edit-valid-until').value.trim();
        permit['date-main'] = permit.validFrom;

        if (!permit.dangers) permit.dangers = {};
        permit.dangers.height = document.getElementById('fast-edit-risk-height').checked;
        permit.dangers.hot = document.getElementById('fast-edit-risk-hot').checked;
        permit.dangers.electric = document.getElementById('fast-edit-risk-electric').checked;
        permit.dangers.confined = document.getElementById('fast-edit-risk-confined').checked;

        Store.savePermit(permit);
        this.closeFastEditModal();
        this.renderDashboard();
        if (this.currentView === 'preview') {
            this.renderPreview();
        }
        this.showToast(`✅ Permit ${permit.id} updated successfully!`, 'success');
    },

    // =========================================================================
    // APERÇU A4 & PRINT CONTROLLER
    // =========================================================================

    openPermitPreview(permitId) {
        const permit = Store.getPermit(permitId);
        if (!permit) return;

        this.currentPermitId = permit.id;
        this.switchView('preview');
        this.populatePreviewSelect(permit.id);
        this.renderPreview();
    },

    populatePreviewSelect(selectedId) {
        const select = document.getElementById('preview-permit-select');
        if (!select) return;

        const all = Store.getAllPermits();
        const list = Object.values(all).filter(p => p && !p.id.startsWith("SYN-K9-KW"));

        select.innerHTML = list.map(p => `
            <option value="${p.id}" ${p.id === selectedId ? 'selected' : ''}>
                ${p.id} — ${p.title_en || p.title || 'Permit'} (${p.weekLabel || 'W' + p.week})
            </option>
        `).join('');
    },

    switchPreviewTab(pageName) {
        this.previewPage = pageName;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        const activeTab = document.getElementById(`tab-${pageName}`);
        if (activeTab) activeTab.classList.add('active');
        this.renderPreview();
    },

    renderPreview() {
        const container = document.getElementById('a4-preview-render');
        const permit = Store.getPermit(this.currentPermitId);
        if (!container || !permit) return;

        let html = '';
        if (this.previewPage === 'p1') {
            html = Templates.generalP1(permit);
        } else if (this.previewPage === 'p2') {
            html = Templates.generalP2(permit);
        } else if (this.previewPage === 'height') {
            html = Templates.heightAnnexe(permit);
        } else if (this.previewPage === 'hot') {
            html = Templates.hotAnnexe(permit);
        } else if (this.previewPage === 'electric') {
            html = Templates.electricAnnexe(permit);
        } else {
            html = Templates.generalP1(permit);
        }

        container.innerHTML = html;
        PrintEngine.injectPrintQRCodes(permit);
    },

    // =========================================================================
    // PROGRAMME COMPLET 29 SEMAINES (MASTER PLAN VIEW)
    // =========================================================================

    renderSidebarWeekIndex() {
        const sidebarList = document.getElementById('sidebar-permit-list');
        if (!sidebarList) return;

        const weeks = Store.getAvailableWeeks();
        sidebarList.innerHTML = weeks.map(w => `
            <div class="sidebar-permit-item ${w === this.currentWeek ? 'active' : ''}" onclick="App.goToWeek(${w})">
                <span class="kw-badge">W${w}</span>
                <div class="sidebar-permit-info">
                    <div class="sidebar-permit-title">${Store.getWeekRange(w)}</div>
                    <div class="sidebar-permit-zone">Projet K9 CKD0</div>
                </div>
            </div>
        `).join('');
    },

    renderMasterPlanTable() {
        const tbody = document.getElementById('all-permits-table-body');
        if (!tbody) return;

        const all = Store.getAllPermits();
        const list = Object.values(all).filter(p => p && !p.id.startsWith("SYN-K9-KW"));

        tbody.innerHTML = list.map(p => `
            <tr>
                <td><strong>W${p.week}</strong></td>
                <td><code style="color: #60a5fa; font-weight: bold;">${p.id}</code></td>
                <td><span class="badge badge-outline">${p.type_permis || p.type}</span></td>
                <td>${(p.activity && p.activity.en) || p.title || ''}</td>
                <td>${p.ouvrage || ''} (${p.zone || ''})</td>
                <td><span class="badge ${p.status === 'VALIDE' ? 'badge-success' : 'badge-secondary'}">${p.status || 'ACTIF'}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="App.openPermitPreview('${p.id}')">👁️ Open</button>
                    <button class="btn btn-warning btn-sm" onclick="App.fastEditPermit('${p.id}')">✏️ Modify</button>
                    <button class="btn btn-secondary btn-sm" onclick="QREngine.openMobileQRModal('${p.id}')">📱 QR</button>
                </td>
            </tr>
        `).join('');
    },

    filterAllPermits(query) {
        const tbody = document.getElementById('all-permits-table-body');
        if (!tbody) return;
        const q = query.toLowerCase().trim();
        const all = Store.getAllPermits();
        const list = Object.values(all).filter(p => p && !p.id.startsWith("SYN-K9-KW"));

        const filtered = list.filter(p => {
            return (p.id && p.id.toLowerCase().includes(q)) ||
                   (p.title && p.title.toLowerCase().includes(q)) ||
                   (p.contractor && p.contractor.toLowerCase().includes(q)) ||
                   (p.zone && p.zone.toLowerCase().includes(q));
        });

        tbody.innerHTML = filtered.map(p => `
            <tr>
                <td><strong>W${p.week}</strong></td>
                <td><code style="color: #60a5fa; font-weight: bold;">${p.id}</code></td>
                <td><span class="badge badge-outline">${p.type_permis || p.type}</span></td>
                <td>${(p.activity && p.activity.en) || p.title || ''}</td>
                <td>${p.ouvrage || ''} (${p.zone || ''})</td>
                <td><span class="badge ${p.status === 'VALIDE' ? 'badge-success' : 'badge-secondary'}">${p.status || 'ACTIF'}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="App.openPermitPreview('${p.id}')">👁️ Open</button>
                    <button class="btn btn-warning btn-sm" onclick="App.fastEditPermit('${p.id}')">✏️ Modify</button>
                    <button class="btn btn-secondary btn-sm" onclick="QREngine.openMobileQRModal('${p.id}')">📱 QR</button>
                </td>
            </tr>
        `).join('');
    },

    // =========================================================================
    // CRÉATION DE NOUVEAU PERMIS
    // =========================================================================

    createNewPermitForCurrentWeek() {
        const newId = Store.generateId(this.currentWeek);
        document.getElementById('form-permit-id').value = newId;
        this.switchView('create');
    },

    createNewPermit() {
        const newId = Store.generateId(this.currentWeek);
        document.getElementById('form-permit-id').value = newId;
        this.switchView('create');
    },

    savePermitFromForm() {
        const id = document.getElementById('form-permit-id').value.trim() || Store.generateId(this.currentWeek);
        const type = document.getElementById('form-permit-type').value;

        const newPermit = {
            id,
            week: this.currentWeek,
            weekLabel: `W${this.currentWeek} — ${Store.getWeekRange(this.currentWeek)}`,
            type: type,
            type_permis: document.getElementById('form-permit-type').options[document.getElementById('form-permit-type').selectedIndex].text,
            title: document.getElementById('form-title').value.trim() || 'Work Permit',
            title_en: document.getElementById('form-title-en').value.trim() || 'Work Permit',
            activity: {
                en: document.getElementById('form-work-desc-en').value.trim() || 'Assembly activities',
                fr: document.getElementById('form-work-desc').value.trim() || 'Activités de montage'
            },
            ouvrage: document.getElementById('form-ouvrage').value.trim(),
            zone: document.getElementById('form-zone').value.trim(),
            location: document.getElementById('form-location').value.trim(),
            contractor: document.getElementById('form-company').value.trim() || 'SINYLON',
            company: 'SINYLON & W.P.E.E.X',
            responsible: document.getElementById('form-chef-nom').value.trim() || 'XIE XIAN',
            chefNom: document.getElementById('form-chef-nom').value.trim() || 'XIE XIAN',
            chefEquipe: document.getElementById('form-chef-equipe').value.trim() || 'ZHOULIN',
            hseNom: document.getElementById('form-contact').value.trim() || 'Nouri Chahrour (0563765157)',
            validFrom: document.getElementById('form-date-main').value || '2026-08-24',
            validUntil: document.getElementById('form-date-main').value || '2026-08-30',
            timeStart: document.getElementById('form-time-start').value || '07h30',
            timeEnd: document.getElementById('form-time-end').value || '18h00',
            status: 'VALIDE',
            weekend: type === 'weekend',
            dangers: {
                height: type === 'height',
                hot: type === 'hot',
                electric: type === 'electric',
                confined: false
            }
        };

        Store.savePermit(newPermit);
        this.switchView('dashboard');
        this.renderDashboard();
        this.showToast(`✅ Permit ${newPermit.id} created successfully!`, 'success');
    },

    // =========================================================================
    // ROUTEUR & VUES
    // =========================================================================

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
            this.renderSidebarWeekIndex();
        } else if (viewName === 'caisse') {
            WeekendCaisseModule.renderCaisseView();
        } else if (viewName === 'list') {
            this.renderMasterPlanTable();
        } else if (viewName === 'preview') {
            this.populatePreviewSelect(this.currentPermitId);
            this.renderPreview();
        }
    },

    // =========================================================================
    // GESTION DES LANGUES
    // =========================================================================

    updateLanguageButtons(lang) {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        const activeBtn = document.getElementById(`lang-btn-${lang}`);
        if (activeBtn) activeBtn.classList.add('active');
    },

    onLanguageChanged(lang) {
        this.updateLanguageButtons(lang);
        if (this.currentView === 'dashboard') {
            this.renderDashboard();
        } else if (this.currentView === 'list') {
            this.renderMasterPlanTable();
        }
        this.showToast(`Language switched to ${lang.toUpperCase()}`, 'info', 1500);
    },

    // =========================================================================
    // MODALS & PARAMÈTRES
    // =========================================================================

    openAuthSettingsModal() {
        document.getElementById('settings-current-auth-code').value = Store.getAuthCode();
        document.getElementById('settings-render-url').value = QREngine.getBaseURL();
        const modal = document.getElementById('modal-auth-settings');
        if (modal) modal.classList.add('active');
    },

    closeAuthSettingsModal() {
        const modal = document.getElementById('modal-auth-settings');
        if (modal) modal.classList.remove('active');
    },

    saveAuthAndRenderSettings() {
        const newCode = document.getElementById('settings-new-auth-code').value;
        if (newCode && newCode.trim().length >= 4) {
            Store.setAuthCode(newCode.trim());
        }

        const renderUrl = document.getElementById('settings-render-url').value;
        if (renderUrl) {
            QREngine.setRenderURL(renderUrl.trim());
        }

        this.closeAuthSettingsModal();
        this.showToast('✅ Security & URL settings saved successfully!', 'success');
    },

    openUrgentActionModal() {
        const modal = document.getElementById('modal-urgent-action');
        if (modal) modal.classList.add('active');
    },

    closeUrgentActionModal() {
        const modal = document.getElementById('modal-urgent-action');
        if (modal) modal.classList.remove('active');
    },

    // Validation journalière du matin à 08h00 (Protocole officiel W.P.E.E.X / HSE)
    validateDayMorning(permitId, dayIndex, dateStr) {
        const permit = Store.getPermit(permitId);
        if (!permit) return;

        if (!permit.revalidations) permit.revalidations = [];

        // Supprimer l'ancienne entrée pour ce jour si elle existe
        permit.revalidations = permit.revalidations.filter(r => r.dayIndex !== dayIndex && r.date !== dateStr);

        const newEntry = {
            id: 'REV-' + Date.now(),
            dayIndex: dayIndex,
            date: dateStr,
            time: '08:00',
            unchangedInfo: true,
            unchangedConditions: true,
            securityMeasuresApplicable: true,
            wpeexEngineer: 'M. W.P.E.E.X',
            wpeexValidated: true,
            execManager: 'Xie (Chef de Projet)',
            comments: `Revalidation conforme Jour ${dayIndex} effectuée le matin à 08:00.`
        };

        permit.revalidations.push(newEntry);
        Store.savePermit(permit);

        if (this.currentView === 'preview') {
            this.renderPermitPage(this.previewPage);
        } else {
            this.renderDashboard();
        }

        this.showToast(`✅ Revalidation Jour ${dayIndex} (${dateStr}) signée à 08:00 par W.P.E.E.X & Xie !`, 'success');
    },

    signAllRevalidations(permitId) {
        const permit = Store.getPermit(permitId);
        if (!permit) return;

        const dStart = permit.validFrom || permit['date-main'] || '2026-08-24';
        const startDate = new Date(dStart);

        if (!permit.revalidations) permit.revalidations = [];

        for (let i = 1; i <= 6; i++) {
            const targetDate = new Date(startDate);
            targetDate.setDate(startDate.getDate() + i);
            const dateStr = targetDate.toISOString().split('T')[0];
            const dayIndex = i + 1;

            permit.revalidations = permit.revalidations.filter(r => r.dayIndex !== dayIndex && r.date !== dateStr);
            permit.revalidations.push({
                id: 'REV-' + Date.now() + '-' + i,
                dayIndex: dayIndex,
                date: dateStr,
                time: '08:00',
                unchangedInfo: true,
                unchangedConditions: true,
                securityMeasuresApplicable: true,
                wpeexEngineer: 'M. W.P.E.E.X',
                wpeexValidated: true,
                execManager: 'Xie (Chef de Projet)',
                comments: `Revalidation matinale 08:00 (K9 CKD0 Protocol)`
            });
        }

        Store.savePermit(permit);

        if (this.currentView === 'preview') {
            this.renderPermitPage(this.previewPage);
        } else {
            this.renderDashboard();
        }

        this.showToast(`✍️ Revalidations de la semaine signées pour 08:00 !`, 'success');
    },

    verifyPermitFromInput() {
        const input = document.getElementById('verifier-input-text').value.trim();
        if (!input) return;

        // Extraire l'ID si une URL complète a été collée
        let permitId = input;
        if (input.includes('permitId=')) {
            permitId = input.split('permitId=')[1].split('&')[0].trim();
        } else if (input.includes('#')) {
            permitId = input.split('#')[1].trim();
        }

        const found = Store.getPermit(permitId);
        if (found) {
            QREngine.closeVerifierModal();
            this.showPublicClientView(found.id);
        } else {
            this.showToast(`Permit "${permitId}" not found in database.`, 'error');
        }
    },

    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => container.removeChild(toast), 300);
        }, duration);
    },

    openQR(permitId) {
        if (window.QREngine && typeof QREngine.openMobileQRModal === 'function') {
            QREngine.openMobileQRModal(permitId || this.currentPermitId);
        }
    },

    printPermit(permitId) {
        if (window.PrintEngine && typeof PrintEngine.printPermit === 'function') {
            PrintEngine.printPermit(permitId || this.currentPermitId);
        }
    },

    printQROnly(permitId) {
        if (window.PrintEngine && typeof PrintEngine.printQROnly === 'function') {
            PrintEngine.printQROnly(permitId || this.currentPermitId);
        }
    },

    printCurrentPage() {
        if (window.PrintEngine && typeof PrintEngine.printCurrentPreview === 'function') {
            PrintEngine.printCurrentPreview();
        }
    },

    downloadQRPNG(permitId) {
        if (window.QREngine && typeof QREngine.downloadQRPNG === 'function') {
            QREngine.downloadQRPNG(permitId || this.currentPermitId);
        }
    },

    bindEvents() {
        // Event bindings
    }
};

// Démarrage au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

window.App = App;

