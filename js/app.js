/**
 * SINYLON - STELLANTIS | Main Application Controller V2
 * Moteur de Semaine Active, Gestion des Permis de Travail, Édition Rapide & Fiche de Contrôle Publique
 */

const App = {
    currentView: 'dashboard',
    currentWeek: 36,
    currentPermitId: 'SYN-K9-KW36',
    previewPage: 'p1',
    currentZone: 'ALL',

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

                const dict = {
                    fr: {
                        zonePermit: `📍 Permis Spécifique par Zone (Semaine ${p.week || 36}) :`,
                        dedicatedPermits: "3 Permis Dédiés",
                        officialPermit: `🛡️ PERMIS OFFICIEL ${p.zoneKey || 'UB'} — PROJET K9 TAFRAOUI`,
                        permitNo: "N°",
                        week: "Semaine",
                        to: "au",
                        activeBadge: `🟢 PERMIS AUTORISÉ & ACTIF (SEMAINE S${p.week || 36})`,
                        suiviVisa: "Visa Ingénieur de Suivi M. W.P.E.E.X",
                        officialSignOffs: `✍️ Émargements Officiels — ${p.id}`,
                        siteK9: "Site K9 Stellantis",
                        wpeexTitle: "Ingénieur de Suivi",
                        chefTitle: "Resp. Exécution",
                        hseTitle: "Superviseur HSE",
                        receveurTitle: "Receveur Travaux",
                        signed: "✓ SIGNÉ",
                        signBtn: "✍️ Signer",
                        signSiteBtn: "<span>✍️</span> SIGNER AU DOIGT / STYLET SUR SITE",
                        nextWeekBtn: `<span>🚀</span> S${parseInt(p.week || 36, 10) + 1}`,
                        fiveDocsTitle: `📁 Les 5 Documents Officiels de la ${p.zoneKey || 'UB'}`,
                        formatA4: "Format A4 Certifié",
                        doc1Title: `Permis Général — ${p.zoneKey || 'UB'}`,
                        doc1Sub: "Recto A4 + Verso Revalidations 08h00 M. W.P.E.E.X",
                        doc2Title: "Annexe A — Travail en Hauteur",
                        doc2Sub: "Nacelles Ciseaux + Manlift · Harnais certifiés",
                        doc3Title: "Annexe B — Travail à Chaud (Permis Feu)",
                        doc3Sub: "Soudage & Meulage · Extincteurs · Bâches ignifugées",
                        doc4Title: "Annexe C — Électrique & LOTO",
                        doc4Sub: "Consignation TGBT & Armoires · Cadenas LOTO-SINY",
                        doc5Title: "Affiche A4 Réglementaire de Zone",
                        doc5Sub: "Panneau d'entrée de zone avec QR Code géant",
                        openBtn: "👁️ Ouvrir",
                        viewAllBtn: "📑 AFFICHER LE DOSSIER COMPLET (5 PAGES A4)",
                        printBtn: "🖨️ IMPRIMER / TÉLÉCHARGER CE PERMIS (A4)",
                        supervisorBtn: "🔒 Accès Superviseur (Équipe SINYLON)"
                    },
                    en: {
                        zonePermit: `📍 Specific Zone Permit (Week ${p.week || 36}) :`,
                        dedicatedPermits: "3 Dedicated Permits",
                        officialPermit: `🛡️ OFFICIAL PERMIT ${p.zoneKey || 'UB'} — K9 PROJECT TAFRAOUI`,
                        permitNo: "No.",
                        week: "Week",
                        to: "to",
                        activeBadge: `🟢 AUTHORIZED & ACTIVE PERMIT (WEEK W${p.week || 36})`,
                        suiviVisa: "Follow-up Engineer Visa: M. W.P.E.E.X",
                        officialSignOffs: `✍️ Official Sign-offs — ${p.id}`,
                        siteK9: "Stellantis K9 Site",
                        wpeexTitle: "Follow-up Engineer",
                        chefTitle: "Execution Lead",
                        hseTitle: "HSE Supervisor",
                        receveurTitle: "Work Receiver",
                        signed: "✓ SIGNED",
                        signBtn: "✍️ Sign",
                        signSiteBtn: "<span>✍️</span> SIGN WITH FINGER / STYLUS ON SITE",
                        nextWeekBtn: `<span>🚀</span> W${parseInt(p.week || 36, 10) + 1}`,
                        fiveDocsTitle: `📁 The 5 Official Documents — ${p.zoneKey || 'UB'}`,
                        formatA4: "Certified A4 Format",
                        doc1Title: `General Work Permit — ${p.zoneKey || 'UB'}`,
                        doc1Sub: "Front A4 + Back Daily Revalidations 08:00 M. W.P.E.E.X",
                        doc2Title: "Annex A — Work at Height",
                        doc2Sub: "Scissor Lifts + Manlift · Certified Harnesses",
                        doc3Title: "Annex B — Hot Work (Fire Permit)",
                        doc3Sub: "Welding & Grinding · Fire Extinguishers · Fireproof Tarps",
                        doc4Title: "Annex C — Electrical & LOTO",
                        doc4Sub: "Main Switchboard & Panels Lockout · LOTO-SINY Padlocks",
                        doc5Title: "Zone Regulatory A4 Poster",
                        doc5Sub: "Zone Entrance Board with Giant QR Code",
                        openBtn: "👁️ Open",
                        viewAllBtn: "📑 VIEW FULL DOSSIER (5 PAGES A4)",
                        printBtn: "🖨️ PRINT / DOWNLOAD THIS PERMIT (A4)",
                        supervisorBtn: "🔒 Supervisor Access (SINYLON Team)"
                    },
                    zh: {
                        zonePermit: `📍 施工区域专属许可证 (第 ${p.week || 36} 周) :`,
                        dedicatedPermits: "3个专属区域许可证",
                        officialPermit: `🛡️ 官方作业许可证 ${p.zoneKey || 'UB'} — 塔夫拉维 K9 项目`,
                        permitNo: "编号",
                        week: "作业周",
                        to: "至",
                        activeBadge: `🟢 许可证已签发并生效 (第 S${p.week || 36} 周)`,
                        suiviVisa: "Sinylon现场监理工程师 M. W.P.E.E.X 审核通过",
                        officialSignOffs: `✍️ 官方审批签字 — ${p.id}`,
                        siteK9: "Stellantis K9 现场",
                        wpeexTitle: "监理工程师",
                        chefTitle: "施工负责人",
                        hseTitle: "安全主管 HSE",
                        receveurTitle: "作业接收人",
                        signed: "✓ 已签署",
                        signBtn: "✍️ 签名",
                        signSiteBtn: "<span>✍️</span> 现场指纹/触控笔电子签名",
                        nextWeekBtn: `<span>🚀</span> 第 S${parseInt(p.week || 36, 10) + 1} 周`,
                        fiveDocsTitle: `📁 ${p.zoneKey || 'UB'} 区域 5 份官方许可文件`,
                        formatA4: "A4 官方认证格式",
                        doc1Title: `通用安全作业许可证 — ${p.zoneKey || 'UB'}`,
                        doc1Sub: "正页A4 + 背页每日08:00复核签字 M. W.P.E.E.X",
                        doc2Title: "附件 A — 高空作业许可证",
                        doc2Sub: "剪叉升降车 + 曲臂车 · 双钩安全带认证",
                        doc3Title: "附件 B — 动火作业许可证 (防火许可)",
                        doc3Sub: "焊接与打磨 · 6kg灭火器 · 防火布覆盖",
                        doc4Title: "附件 C — 电气安全与上锁挂牌 (LOTO)",
                        doc4Sub: "主配电柜及设备断电挂牌 · LOTO-SINY 安全锁",
                        doc5Title: "施工区域 A4 安全警示公示牌",
                        doc5Sub: "车间工位入口张贴 · 带高清核验二维码",
                        openBtn: "👁️ 查看",
                        viewAllBtn: "📑 查看完整许可档案 (5页A4)",
                        printBtn: "🖨️ 打印 / 下载该许可证 (A4)",
                        supervisorBtn: "🔒 管理员登录 (SINYLON 团队)"
                    }
                };

                const L = dict[currentLang] || dict.fr;
                const zoneStr = isChinese ? (p.zone_zh || p.zone || 'K9 总装线') : (isEnglish ? (p.zone_en || p.zone || 'K9 Assembly Line') : (p.zone || 'Montage K9'));
                const permitTitle = isChinese ? (p.title_zh || p.title) : (isEnglish ? (p.title_en || p.title) : (p.title || ('PERMIS ' + p.id)));

                const sigs = p.signatures || {};
                const chefSig = sigs.chef;
                const hseSig = sigs.hse;
                const recSig = sigs.receveur;
                const wpeexSig = sigs.wpeex;

                const validDeb = p.validFrom || p.date_debut || '2026-08-31';
                const validFin = p.validUntil || p.date_fin || '2026-09-06';
                const weekNum = p.week || 36;

                // Helper d'affichage pour une case de signature électronique
                const renderSigCard = (roleKey, title, defaultName, sigObj) => {
                    if (sigObj && sigObj.dataUrl) {
                        return `
                            <div style="background: rgba(16,185,129,0.1); border: 1.5px solid #10b981; border-radius: 10px; padding: 8px; text-align: center; box-shadow: 0 4px 12px rgba(16,185,129,0.15);">
                                <div style="font-size: 9.5px; font-weight: 800; color: #34d399; text-transform: uppercase;">${title}</div>
                                <div style="font-size: 11px; font-weight: 900; color: #ffffff; margin: 2px 0;">${sigObj.signatoryName || defaultName}</div>
                                <div style="background: #ffffff; border-radius: 6px; padding: 3px; margin: 4px 0; display: inline-block; width: 100%; max-width: 140px;">
                                    <img src="${sigObj.dataUrl}" style="height: 24px; max-width: 100%; object-fit: contain;" alt="Signature">
                                </div>
                                <div style="font-size: 8.5px; color: #6ee7b7; font-weight: 700;">
                                    ${L.signed} ${sigObj.date} ${sigObj.time}
                                </div>
                            </div>
                        `;
                    }
                    return `
                        <div style="background: rgba(30,41,59,0.6); border: 1.5px dashed #475569; border-radius: 10px; padding: 8px; text-align: center;">
                            <div style="font-size: 9.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">${title}</div>
                            <div style="font-size: 11px; font-weight: 800; color: #cbd5e1; margin: 2px 0;">${defaultName}</div>
                            <button type="button" onclick="if(window.SignaturePad)SignaturePad.open('${p.id}','${roleKey}')" style="margin-top: 4px; background: #2563eb; color: #fff; border: none; padding: 6px 10px; min-height: 38px; border-radius: 6px; font-size: 10.5px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 4px; box-shadow: 0 2px 8px rgba(37,99,235,0.4); touch-action: manipulation; width: 100%;">
                                ${L.signBtn}
                            </button>
                        </div>
                    `;
                };

                const zCurrent = p.zoneKey || (p.id.includes('UB') ? 'UB' : (p.id.includes('UAR') ? 'UAR' : (p.id.includes('FUSA') ? 'FUSA' : 'UB')));

                clientView.innerHTML = `
                    <div style="max-width: 720px; margin: 0 auto; padding: 18px 14px; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        
                        <!-- 1. EN-TÊTE INDUSTRIEL TITANIUM PRO -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; gap: 8px; flex-wrap: wrap;">
                            <div style="display: flex; gap: 8px; align-items: center;">
                                <span style="background: #ffffff; color: #000; padding: 5px 12px; font-weight: 900; font-size: 14px; border-radius: 4px; letter-spacing: 1px;">SINYLON</span>
                                <span style="border: 2px solid #ffffff; color: #ffffff; padding: 4px 12px; font-weight: 900; font-size: 14px; border-radius: 4px; letter-spacing: 1px;">STELLANTIS</span>
                            </div>
                            <div class="lang-switch-group">
                                <button class="lang-btn ${currentLang === 'fr' ? 'active' : ''}" onclick="Translator.setLang('fr'); App.showPublicClientView('${p.id}');">FR</button>
                                <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" onclick="Translator.setLang('en'); App.showPublicClientView('${p.id}');">EN</button>
                                <button class="lang-btn ${currentLang === 'zh' ? 'active' : ''}" onclick="Translator.setLang('zh'); App.showPublicClientView('${p.id}');">中文</button>
                            </div>
                        </div>

                        <!-- 2. SÉLECTEUR RAPIDE DES 3 ZONES DU SITE K9 -->
                        <div style="background: rgba(15,23,42,0.9); border: 1.5px solid #0284c7; border-radius: 12px; padding: 10px 12px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                            <div style="font-size: 11px; font-weight: 800; color: #38bdf8; margin-bottom: 8px; text-transform: uppercase; display: flex; justify-content: space-between; align-items: center;">
                                <span>${L.zonePermit}</span>
                                <span style="font-size: 10px; color: #94a3b8;">${L.dedicatedPermits}</span>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
                                <button type="button" onclick="App.showPublicClientView('K9-W${weekNum}-UB')" style="background: ${zCurrent === 'UB' ? '#2563eb' : 'rgba(30,41,59,0.8)'}; border: 1.5px solid ${zCurrent === 'UB' ? '#60a5fa' : '#475569'}; color: #fff; padding: 10px 4px; border-radius: 8px; font-size: 11.5px; font-weight: 900; cursor: pointer; text-align: center; touch-action: manipulation; box-shadow: ${zCurrent === 'UB' ? '0 0 12px rgba(37,99,235,0.6)' : 'none'};">
                                    🔵 ZONE UB
                                </button>
                                <button type="button" onclick="App.showPublicClientView('K9-W${weekNum}-UAR')" style="background: ${zCurrent === 'UAR' ? '#0284c7' : 'rgba(30,41,59,0.8)'}; border: 1.5px solid ${zCurrent === 'UAR' ? '#38bdf8' : '#475569'}; color: #fff; padding: 10px 4px; border-radius: 8px; font-size: 11.5px; font-weight: 900; cursor: pointer; text-align: center; touch-action: manipulation; box-shadow: ${zCurrent === 'UAR' ? '0 0 12px rgba(2,132,199,0.6)' : 'none'};">
                                    🔷 ZONE UAR
                                </button>
                                <button type="button" onclick="App.showPublicClientView('K9-W${weekNum}-FUSA')" style="background: ${zCurrent === 'FUSA' ? '#d97706' : 'rgba(30,41,59,0.8)'}; border: 1.5px solid ${zCurrent === 'FUSA' ? '#f59e0b' : '#475569'}; color: #fff; padding: 10px 4px; border-radius: 8px; font-size: 11.5px; font-weight: 900; cursor: pointer; text-align: center; touch-action: manipulation; box-shadow: ${zCurrent === 'FUSA' ? '0 0 12px rgba(217,119,6,0.6)' : 'none'};">
                                    🟠 ZONE FUSA
                                </button>
                            </div>
                        </div>

                        <!-- 3. HERO BANNER : VALIDITÉ SEMAINE COMPLÈTE DE LA ZONE -->
                        <div style="background: linear-gradient(135deg, #0f172a, #1e293b); border: 2px solid #10b981; border-radius: 16px; padding: 22px 18px; text-align: center; margin-bottom: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); position: relative; overflow: hidden;">
                            <div style="position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; background: rgba(16,185,129,0.15); border-radius: 50%; filter: blur(25px);"></div>
                            
                            <div style="display: inline-block; background: rgba(16,185,129,0.2); border: 1.5px solid #10b981; color: #34d399; font-size: 11px; font-weight: 900; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                                ${L.officialPermit}
                            </div>

                            <div style="font-size: 24px; font-weight: 900; letter-spacing: 1px; color: #ffffff; margin: 4px 0;">
                                ${permitTitle}
                            </div>
                            <div style="font-size: 13px; color: #94a3b8; font-weight: 600;">
                                ${L.permitNo} <strong style="color: #60a5fa; font-family: monospace;">${p.id}</strong> · ${L.week} ${weekNum} (${validDeb} ${L.to} ${validFin})
                            </div>

                            <!-- GRAND BADGE VERT : VALIDITÉ HEBDOMADAIRE STRICTE -->
                            <div style="margin-top: 14px; background: linear-gradient(135deg, #15803d, #166534); border: 2px solid #4ade80; border-radius: 12px; padding: 12px 16px; box-shadow: 0 4px 15px rgba(22,163,74,0.4);">
                                <div style="font-size: 15px; font-weight: 900; color: #ffffff; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                    <span>🟢</span> ${L.activeBadge}
                                </div>
                                <div style="font-size: 11.5px; color: #bbf7d0; margin-top: 4px; font-weight: 500;">
                                    ${zoneStr} · ${L.suiviVisa}
                                </div>
                            </div>
                        </div>

                        <!-- 4. MODULE SIGNATURES ÉLECTRONIQUES CHANTIER SUR SITE -->
                        <div style="background: #0f172a; border: 1.5px solid #1e3a8a; border-radius: 14px; padding: 18px; margin-bottom: 18px; box-shadow: 0 6px 20px rgba(0,0,0,0.4);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">
                                <div style="font-size: 14px; font-weight: 900; color: #60a5fa; display: flex; align-items: center; gap: 8px;">
                                    <span>✍️</span> ${L.officialSignOffs}
                                </div>
                                <span style="font-size: 10px; background: rgba(59,130,246,0.2); color: #93c5fd; padding: 2px 8px; border-radius: 10px; font-weight: 700;">${L.siteK9}</span>
                            </div>

                            <!-- CARTOUCHE MAJEURE : INGÉNIEUR DE SUIVI SINYLON (M. W.P.E.E.X) -->
                            <div style="background: linear-gradient(135deg, rgba(30,58,138,0.5), rgba(15,23,42,0.9)); border: 2px solid #3b82f6; border-radius: 12px; padding: 14px; margin-bottom: 14px; text-align: center; box-shadow: 0 4px 16px rgba(59,130,246,0.25);">
                                <div style="font-size: 11px; font-weight: 900; color: #60a5fa; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; justify-content: center; gap: 6px;">
                                    <span>🎖️</span> ${L.wpeexTitle} — SINYLON / STELLANTIS
                                </div>
                                <div style="font-size: 15px; font-weight: 900; color: #ffffff; margin: 4px 0 8px 0;">
                                    ${p['wpeex-nom'] || 'M. W.P.E.E.X'}
                                </div>
                                ${wpeexSig && wpeexSig.dataUrl ? `
                                    <div style="background: #ffffff; border-radius: 8px; padding: 6px; margin: 6px auto; max-width: 200px; display: flex; justify-content: center; align-items: center;">
                                        <img src="${wpeexSig.dataUrl}" style="height: 38px; max-width: 100%; object-fit: contain;" alt="Signature M. W.P.E.E.X">
                                    </div>
                                    <div style="font-size: 10.5px; color: #34d399; font-weight: 800; margin-top: 4px;">
                                        ${L.signed} ${wpeexSig.date} ${wpeexSig.time}
                                    </div>
                                ` : `
                                    <button type="button" onclick="if(window.SignaturePad)SignaturePad.open('${p.id}','wpeex')" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); border: 1.5px solid #60a5fa; color: #ffffff; padding: 12px 18px; min-height: 44px; border-radius: 8px; font-size: 13px; font-weight: 900; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(37,99,235,0.4); touch-action: manipulation; width: 100%; max-width: 340px;">
                                        <span>✍️</span> ${currentLang === 'zh' ? '监理工程师 M. W.P.E.E.X 电子签名' : (currentLang === 'en' ? 'Sign as Follow-up Engineer (M. W.P.E.E.X)' : 'Signer (Ingénieur de Suivi M. W.P.E.E.X)')}
                                    </button>
                                `}
                            </div>

                            <!-- GRILLE DES AUTRES SIGNATAIRES DU CHANTIER -->
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 12px;">
                                ${renderSigCard('chef', L.chefTitle, p['chef-nom'] || 'Xie Xian', chefSig)}
                                ${renderSigCard('hse', L.hseTitle, p['hse-nom'] || 'Nouri Chahrour', hseSig)}
                                ${renderSigCard('receveur', L.receveurTitle, p['receveur-nom'] || 'Zhou Lin', recSig)}
                            </div>

                            <button type="button" onclick="if(window.SignaturePad)SignaturePad.open('${p.id}')" style="width: 100%; padding: 13px; min-height: 46px; background: rgba(30,41,59,0.8); border: 1.5px solid #475569; color: #e2e8f0; font-weight: 800; font-size: 12px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; touch-action: manipulation;">
                                <span>✍️</span> ${L.signSiteBtn}
                            </button>
                        </div>

                        <!-- 5. SECTION DÉDIÉE : LES 5 PERMIS OFFICIELS DE CETTE ZONE -->
                        <div style="background: #0f172a; border: 1.5px solid #334155; border-radius: 14px; padding: 18px; margin-bottom: 18px;">
                            <div style="font-size: 14px; font-weight: 900; color: #f8fafc; border-bottom: 1px solid #1e293b; padding-bottom: 8px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
                                <span>${L.fiveDocsTitle}</span>
                                <span style="font-size: 11px; color: #94a3b8; font-weight: 700;">${L.formatA4}</span>
                            </div>

                            <div style="display: flex; flex-direction: column; gap: 10px;">
                                
                                <!-- DOCUMENT 1 : PERMIS GÉNÉRAL -->
                                <div style="background: rgba(30,41,59,0.7); border: 1.5px solid #3b82f6; border-radius: 10px; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <div style="background: #2563eb; color: #fff; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 15px;">1</div>
                                        <div>
                                            <div style="font-weight: 800; color: #ffffff; font-size: 13.5px;">${L.doc1Title}</div>
                                            <div style="font-size: 11px; color: #93c5fd;">${L.doc1Sub}</div>
                                        </div>
                                    </div>
                                    <button type="button" onclick="App.showPermitSpecificPage('${p.id}', 'general')" style="background: #2563eb; color: #fff; border: none; padding: 8px 14px; min-height: 38px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; white-space: nowrap; touch-action: manipulation;">
                                        ${L.openBtn}
                                    </button>
                                </div>

                                <!-- DOCUMENT 2 : ANNEXE A HAUTEUR -->
                                <div style="background: rgba(30,41,59,0.7); border: 1.5px solid #0284c7; border-radius: 10px; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <div style="background: #0284c7; color: #fff; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 15px;">A</div>
                                        <div>
                                            <div style="font-weight: 800; color: #ffffff; font-size: 13.5px;">${L.doc2Title}</div>
                                            <div style="font-size: 11px; color: #7dd3fc;">${L.doc2Sub}</div>
                                        </div>
                                    </div>
                                    <button type="button" onclick="App.showPermitSpecificPage('${p.id}', 'height')" style="background: #0284c7; color: #fff; border: none; padding: 8px 14px; min-height: 38px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; white-space: nowrap; touch-action: manipulation;">
                                        ${L.openBtn}
                                    </button>
                                </div>

                                <!-- DOCUMENT 3 : ANNEXE B CHAUD -->
                                <div style="background: rgba(30,41,59,0.7); border: 1.5px solid #ef4444; border-radius: 10px; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <div style="background: #ef4444; color: #fff; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 15px;">B</div>
                                        <div>
                                            <div style="font-weight: 800; color: #ffffff; font-size: 13.5px;">${L.doc3Title}</div>
                                            <div style="font-size: 11px; color: #fca5a5;">${L.doc3Sub}</div>
                                        </div>
                                    </div>
                                    <button type="button" onclick="App.showPermitSpecificPage('${p.id}', 'hot')" style="background: #ef4444; color: #fff; border: none; padding: 8px 14px; min-height: 38px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; white-space: nowrap; touch-action: manipulation;">
                                        ${L.openBtn}
                                    </button>
                                </div>

                                <!-- DOCUMENT 4 : ANNEXE C LOTO -->
                                <div style="background: rgba(30,41,59,0.7); border: 1.5px solid #f59e0b; border-radius: 10px; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <div style="background: #f59e0b; color: #000; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 15px;">C</div>
                                        <div>
                                            <div style="font-weight: 800; color: #ffffff; font-size: 13.5px;">${L.doc4Title}</div>
                                            <div style="font-size: 11px; color: #fcd34d;">${L.doc4Sub}</div>
                                        </div>
                                    </div>
                                    <button type="button" onclick="App.showPermitSpecificPage('${p.id}', 'electric')" style="background: #f59e0b; color: #000; border: none; padding: 8px 14px; min-height: 38px; border-radius: 6px; font-size: 12px; font-weight: 900; cursor: pointer; white-space: nowrap; touch-action: manipulation;">
                                        ${L.openBtn}
                                    </button>
                                </div>

                                <!-- DOCUMENT 5 : AFFICHE DE ZONE QR -->
                                <div style="background: rgba(30,41,59,0.7); border: 1.5px solid #10b981; border-radius: 10px; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <div style="background: #10b981; color: #fff; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 15px;">QR</div>
                                        <div>
                                            <div style="font-weight: 800; color: #ffffff; font-size: 13.5px;">${L.doc5Title}</div>
                                            <div style="font-size: 11px; color: #86efac;">${L.doc5Sub}</div>
                                        </div>
                                    </div>
                                    <button type="button" onclick="App.showPermitSpecificPage('${p.id}', 'poster')" style="background: #10b981; color: #fff; border: none; padding: 8px 14px; min-height: 38px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; white-space: nowrap; touch-action: manipulation;">
                                        ${L.openBtn}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 6. BOUTONS D'ACTION MAJEURS -->
                        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">
                            <button type="button" onclick="App.togglePermitDetailViewer('${p.id}', 'all')" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; border: 2px solid #34d399; border-radius: 12px; font-size: 15px; font-weight: 900; box-shadow: 0 4px 16px rgba(16,185,129,0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; touch-action: manipulation;">
                                <span style="font-size: 18px;">📑</span> ${L.viewAllBtn}
                            </button>

                            <button type="button" onclick="App.printPermit('${p.id}')" style="width: 100%; padding: 14px; background: #2563eb; color: #ffffff; border: 1.5px solid #3b82f6; border-radius: 10px; font-size: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; touch-action: manipulation;">
                                ${L.printBtn}
                            </button>

                            <button type="button" onclick="App.openSupervisorModal()" style="color: #94a3b8; background: transparent; border: 1px solid #334155; padding: 10px; font-size: 12px; border-radius: 8px; cursor: pointer; touch-action: manipulation;">
                                ${L.supervisorBtn}
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
        document.getElementById('fast-edit-hse').value = permit.hseNom || permit.contact || 'Nouri Chahrour (0562765157)';
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

    selectZone(zoneKey) {
        this.currentZone = zoneKey || 'ALL';
        document.querySelectorAll('.zone-filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-zone') === this.currentZone);
        });
        if (this.currentView === 'preview' && this.previewPage === 'poster') {
            this.renderPreview();
        }
    },

    printZonePoster(zoneKey) {
        const p = Store.getPermit(this.getActivePermitId());
        const z = (zoneKey && zoneKey !== 'ALL') ? zoneKey : (p ? p.zoneKey : (this.currentZone !== 'ALL' ? this.currentZone : 'UB'));
        if (window.PrintEngine && typeof PrintEngine.printZonePoster === 'function') {
            PrintEngine.printZonePoster(this.getActivePermitId(), z);
        } else {
            this.showToast(`Impression de l'affiche zone ${z}...`, 'info');
            window.print();
        }
    },

    toggleMobileSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.toggle('mobile-open');
        }
    },

    // Affiche un document spécifique (Général, Hauteur, Chaud, Élec, Affiche Zone) dans le visualiseur
    showPermitSpecificPage(permitId, pageKey) {
        this.currentPermitId = permitId || this.getActivePermitId();
        const p = Store.getPermit(this.currentPermitId);
        if (!p) {
            this.showToast('Permis introuvable', 'error');
            return;
        }

        const z = p.zoneKey || (p.id.includes('UB') ? 'UB' : (p.id.includes('UAR') ? 'UAR' : (p.id.includes('FUSA') ? 'FUSA' : 'ALL')));

        let docHtml = '';
        let docTitle = 'Document Officiel';

        if (pageKey === 'general') {
            docHtml = Templates.generalP1(p) + '<div style="page-break-before: always; margin-top: 20px;"></div>' + Templates.generalP2(p);
            docTitle = `Permis Général & Revalidations (${p.id} — ${p.zone || z})`;
        } else if (pageKey === 'height') {
            docHtml = Templates.heightAnnexe(p);
            docTitle = `Annexe A — Travail en Hauteur (${p.id} — ${p.zone || z})`;
        } else if (pageKey === 'hot') {
            docHtml = Templates.hotAnnexe(p);
            docTitle = `Annexe B — Travail à Chaud & Soudure (${p.id} — ${p.zone || z})`;
        } else if (pageKey === 'electric') {
            docHtml = Templates.electricAnnexe(p);
            docTitle = `Annexe C — Consignation Électrique & LOTO (${p.id} — ${p.zone || z})`;
        } else if (pageKey === 'poster') {
            docHtml = Templates.renderZonePosterA4(p, z);
            docTitle = `Affiche Réglementaire A4 (${p.id} — ${p.zone || z})`;
        } else {
            docHtml = Templates.generalP1(p);
            docTitle = `Permis de Travail (${p.id})`;
        }

        this._openDocViewerModal(docTitle, docHtml, p.id);
    },

    // Affiche le dossier complet (les 5 documents A4)
    togglePermitDetailViewer(permitId, viewMode = 'all') {
        this.currentPermitId = permitId || this.getActivePermitId();
        const p = Store.getPermit(this.currentPermitId);
        if (!p) {
            this.showToast('Permis introuvable', 'error');
            return;
        }

        const z = p.zoneKey || (p.id.includes('UB') ? 'UB' : (p.id.includes('UAR') ? 'UAR' : (p.id.includes('FUSA') ? 'FUSA' : 'ALL')));
        const separator = '<div style="page-break-before: always; margin: 30px 0; border-top: 2px dashed #94a3b8;"></div>';
        const docHtml = `
            ${Templates.generalP1(p)}
            ${separator}
            ${Templates.generalP2(p)}
            ${separator}
            ${Templates.heightAnnexe(p)}
            ${separator}
            ${Templates.hotAnnexe(p)}
            ${separator}
            ${Templates.electricAnnexe(p)}
            ${separator}
            ${Templates.renderZonePosterA4(p, z)}
        `;

        this._openDocViewerModal(`Dossier Complet Permis N° ${p.id} (5 Pages A4 + Affiche Zone)`, docHtml, p.id);
    },

    _openDocViewerModal(title, contentHtml, permitId) {
        let modal = document.getElementById('modal-doc-viewer');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-doc-viewer';
            modal.className = 'modal-backdrop';
            modal.style.zIndex = '100000';
            modal.innerHTML = `
                <div class="modal-window" style="max-width: 960px; width: 98%; max-height: 96vh; display: flex; flex-direction: column; background: #0f172a; border: 2px solid #3b82f6; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
                    <div class="modal-header" style="background: #0f172a; border-bottom: 2px solid #3b82f6; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                        <h3 id="doc-viewer-title" style="color: #f8fafc; font-size: 15px; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>📄</span> <span id="doc-viewer-title-text">Document Officiel</span>
                        </h3>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <button type="button" onclick="App.printPermit(App.currentPermitId)" class="btn btn-primary btn-sm" style="font-weight: 800; display: inline-flex; align-items: center; gap: 4px; padding: 8px 14px; min-height: 38px;">
                                🖨️ Imprimer A4
                            </button>
                            <button type="button" onclick="App.closeDocViewerModal()" class="btn btn-secondary btn-sm" style="font-weight: 800; padding: 8px 14px; min-height: 38px;">
                                ✕ Fermer
                            </button>
                        </div>
                    </div>
                    <div class="modal-body" id="doc-viewer-body" style="overflow-y: auto; overflow-x: auto; padding: 16px 10px; background: #1e293b; flex: 1; -webkit-overflow-scrolling: touch; display: flex; flex-direction: column; align-items: center;">
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        const titleText = document.getElementById('doc-viewer-title-text');
        if (titleText) titleText.textContent = title;

        const bodyEl = document.getElementById('doc-viewer-body');
        if (bodyEl) {
            bodyEl.innerHTML = `
                <div style="width: 100%; max-width: 850px; display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    ${contentHtml}
                </div>
            `;
            bodyEl.scrollTop = 0;
        }

        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.style.zIndex = '999999';
        modal.scrollTop = 0;
        modal.onclick = (e) => { if (e.target === modal) App.closeDocViewerModal(); };
    },

    closeDocViewerModal() {
        const modal = document.getElementById('modal-doc-viewer');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
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
        } else if (this.previewPage === 'poster') {
            html = Templates.renderZonePosterA4(permit, (this.currentZone && this.currentZone !== 'ALL') ? this.currentZone : permit.zoneKey);
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
            company: 'SINYLON & Sinylon',
            responsible: document.getElementById('form-chef-nom').value.trim() || 'XIE XIAN',
            chefNom: document.getElementById('form-chef-nom').value.trim() || 'XIE XIAN',
            chefEquipe: document.getElementById('form-chef-equipe').value.trim() || 'ZHOULIN',
            hseNom: document.getElementById('form-contact').value.trim() || 'Nouri Chahrour (0562765157)',
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

    // Validation journalière du matin à 08h00 (Protocole officiel Sinylon / HSE)
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
            wpeexEngineer: 'M. W.P.E.E.X (Ingénieur de Suivi)',
            wpeexValidated: true,
            execManager: 'Xie Xian (Responsable Exécution Sinylon)',
            comments: `Revalidation conforme Jour ${dayIndex} effectuée le matin à 08:00.`
        };

        permit.revalidations.push(newEntry);
        Store.savePermit(permit);

        if (this.currentView === 'preview') {
            this.renderPreview();
        } else {
            this.renderDashboard();
        }

        this.showToast(`✅ Revalidation Jour ${dayIndex} (${dateStr}) signée à 08:00 par M. W.P.E.E.X & Xie Xian !`, 'success');
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
                wpeexEngineer: 'M. W.P.E.E.X (Ingénieur de Suivi)',
                wpeexValidated: true,
                execManager: 'Xie Xian (Responsable Exécution Sinylon)',
                comments: `Revalidation matinale 08:00 (K9 CKD0 Protocol)`
            });
        }

        Store.savePermit(permit);

        if (this.currentView === 'preview') {
            this.renderPreview();
        } else {
            this.renderDashboard();
        }

        this.showToast(`✍️ Revalidations signées par M. W.P.E.E.X & Xie Xian pour 08:00 !`, 'success');
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

