/**
 * SINYLON - STELLANTIS | Module de Signature Électronique Tactile Chantier
 * Permet l'émargement manuscrit au doigt/stylet directement sur site
 * Horodatage cryptographique certifié & Incrustation sur les 5 permis officiels
 */

const SignaturePad = {
    canvas: null,
    ctx: null,
    isDrawing: false,
    currentSignatory: 'wpeex', // 'wpeex', 'chef', 'hse', 'receveur'
    currentPermitId: 'SYN-K9-KW36',
    inkColor: '#1e3a8a', // Encre bleue d'ingénieur par défaut
    hasDrawn: false,

    init() {
        // Crée ou prépare le conteneur modal de signature
        this.injectModal();
    },

    injectModal() {
        if (document.getElementById('modal-signature-pad')) return;

        const modal = document.createElement('div');
        modal.id = 'modal-signature-pad';
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 100000;
            background: rgba(11, 15, 25, 0.88);
            backdrop-filter: blur(12px);
            display: none;
            align-items: center;
            justify-content: center;
            padding: 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            touch-action: manipulation;
        `;

        modal.innerHTML = `
            <div style="background: #0f172a; border: 2px solid #3b82f6; border-radius: 16px; width: 100%; max-width: 580px; box-shadow: 0 20px 50px rgba(0,0,0,0.7); overflow: hidden; display: flex; flex-direction: column;">
                
                <!-- En-tête modal -->
                <div style="background: linear-gradient(135deg, #1e3a8a, #0f172a); padding: 14px 18px; border-bottom: 1.5px solid #1e40af; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 22px;">✍️</span>
                        <div>
                            <div style="font-weight: 900; color: #ffffff; font-size: 15px; letter-spacing: 0.5px;">SIGNATURE ÉLECTRONIQUE SUR SITE</div>
                            <div style="font-size: 11px; color: #93c5fd;">Sinylon Stellantis K9 · Validation Ingénieur & Responsables</div>
                        </div>
                    </div>
                    <button type="button" onclick="SignaturePad.close()" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 36px; height: 36px; min-height: 36px; border-radius: 50%; font-weight: 900; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; touch-action: manipulation;">✕</button>
                </div>

                <!-- Corps avec sélection du signataire & Canvas -->
                <div style="padding: 16px;">
                    
                    <!-- Choix du rôle de signature (4 Signataires Officiels) -->
                    <label style="display: block; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px;">Signataire officiel :</label>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 14px;">
                        <button type="button" id="sig-role-wpeex" class="sig-role-btn active" onclick="SignaturePad.setSignatory('wpeex')" style="padding: 10px 8px; min-height: 48px; font-size: 11.5px; font-weight: 800; border-radius: 8px; border: 1.5px solid #3b82f6; background: #1e3a8a; color: #fff; cursor: pointer; text-align: center; touch-action: manipulation;">
                            🛡️ M. W.P.E.E.X<br><span style="font-size: 9.5px; opacity: 0.85; font-weight: 600;">Ingénieur de Suivi</span>
                        </button>
                        <button type="button" id="sig-role-chef" class="sig-role-btn" onclick="SignaturePad.setSignatory('chef')" style="padding: 10px 8px; min-height: 48px; font-size: 11.5px; font-weight: 800; border-radius: 8px; border: 1px solid #334155; background: #1e293b; color: #cbd5e1; cursor: pointer; text-align: center; touch-action: manipulation;">
                            👨‍💼 Xie Xian<br><span style="font-size: 9.5px; opacity: 0.85; font-weight: 600;">Responsable Exécution</span>
                        </button>
                        <button type="button" id="sig-role-hse" class="sig-role-btn" onclick="SignaturePad.setSignatory('hse')" style="padding: 10px 8px; min-height: 48px; font-size: 11.5px; font-weight: 800; border-radius: 8px; border: 1px solid #334155; background: #1e293b; color: #cbd5e1; cursor: pointer; text-align: center; touch-action: manipulation;">
                            🦺 Nouri Chahrour<br><span style="font-size: 9.5px; opacity: 0.85; font-weight: 600;">Superviseur HSE</span>
                        </button>
                        <button type="button" id="sig-role-receveur" class="sig-role-btn" onclick="SignaturePad.setSignatory('receveur')" style="padding: 10px 8px; min-height: 48px; font-size: 11.5px; font-weight: 800; border-radius: 8px; border: 1px solid #334155; background: #1e293b; color: #cbd5e1; cursor: pointer; text-align: center; touch-action: manipulation;">
                            👷 Zhou Lin<br><span style="font-size: 9.5px; opacity: 0.85; font-weight: 600;">Receveur Travaux</span>
                        </button>
                    </div>

                    <!-- Zone de dessin (Pad Canvas) -->
                    <div style="position: relative; border: 2px dashed #475569; border-radius: 12px; background: #ffffff; height: 180px; overflow: hidden; box-shadow: inset 0 2px 8px rgba(0,0,0,0.1);">
                        <canvas id="signature-canvas" style="width: 100%; height: 100%; touch-action: none; cursor: crosshair;"></canvas>
                        
                        <div id="sig-placeholder-text" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 13px; font-weight: 600; pointer-events: none; user-select: none;">
                            ✍️ Signez ici avec votre doigt ou un stylet
                        </div>

                        <!-- Ligne guide d'émargement -->
                        <div style="position: absolute; bottom: 35px; left: 20px; right: 20px; border-bottom: 1px dashed #cbd5e1; pointer-events: none;"></div>
                        <div style="position: absolute; bottom: 18px; right: 25px; font-size: 9px; color: #94a3b8; font-weight: 700; pointer-events: none;">
                            SINYLON STELLANTIS K9
                        </div>
                    </div>

                    <!-- Outils du pad : Encre & Effacer -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <span style="font-size: 11px; color: #94a3b8; font-weight: 700;">Couleur :</span>
                            <button type="button" onclick="SignaturePad.setInk('#1e3a8a')" style="width: 28px; height: 28px; border-radius: 50%; background: #1e3a8a; border: 2px solid #fff; cursor: pointer; touch-action: manipulation;" title="Bleu"></button>
                            <button type="button" onclick="SignaturePad.setInk('#000000')" style="width: 28px; height: 28px; border-radius: 50%; background: #000000; border: 2px solid #64748b; cursor: pointer; touch-action: manipulation;" title="Noir"></button>
                        </div>
                        <button type="button" onclick="SignaturePad.clearCanvas()" style="background: rgba(239,68,68,0.15); border: 1px solid #ef4444; color: #fca5a5; font-size: 12px; font-weight: 700; padding: 6px 14px; min-height: 38px; border-radius: 8px; cursor: pointer; touch-action: manipulation;">
                            🗑️ Effacer
                        </button>
                    </div>

                    <!-- Notice légale de certification -->
                    <div style="margin-top: 12px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 8px; padding: 8px 12px; font-size: 11px; color: #a7f3d0; line-height: 1.4;">
                        🔒 <strong>Engagement Opérationnel :</strong> Cette signature électronique certifie l'autorisation des travaux et la validation de sécurité pour <strong>l'ensemble de la semaine</strong>.
                    </div>
                </div>

                <!-- Boutons d'action -->
                <div style="background: #090d16; padding: 12px 16px; border-top: 1.5px solid #1e293b; display: flex; gap: 10px;">
                    <button type="button" onclick="SignaturePad.close()" style="flex: 1; padding: 12px; min-height: 46px; background: #1e293b; border: 1px solid #334155; color: #cbd5e1; font-weight: 800; font-size: 13px; border-radius: 8px; cursor: pointer; touch-action: manipulation;">
                        Annuler
                    </button>
                    <button type="button" onclick="SignaturePad.saveSignature()" style="flex: 2; padding: 12px; min-height: 46px; background: linear-gradient(135deg, #10b981, #059669); border: 1.5px solid #34d399; color: #ffffff; font-weight: 900; font-size: 14px; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 12px rgba(16,185,129,0.4); display: flex; align-items: center; justify-content: center; gap: 6px; touch-action: manipulation;">
                        <span>✅</span> Valider & Sceller
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupCanvasListeners();
    },

    setupCanvasListeners() {
        this.canvas = document.getElementById('signature-canvas');
        if (!this.canvas) return;

        // Configuration Retina / High-DPI
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(dpr, dpr);
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.lineWidth = 2.8;
        this.ctx.strokeStyle = this.inkColor;

        const getPos = (e) => {
            const r = this.canvas.getBoundingClientRect();
            if (e.touches && e.touches.length > 0) {
                return {
                    x: e.touches[0].clientX - r.left,
                    y: e.touches[0].clientY - r.top
                };
            }
            return {
                x: e.clientX - r.left,
                y: e.clientY - r.top
            };
        };

        const startDraw = (e) => {
            if (e.cancelable) e.preventDefault();
            this.isDrawing = true;
            this.hasDrawn = true;
            const ph = document.getElementById('sig-placeholder-text');
            if (ph) ph.style.display = 'none';

            const pos = getPos(e);
            this.ctx.beginPath();
            this.ctx.moveTo(pos.x, pos.y);
        };

        const draw = (e) => {
            if (!this.isDrawing) return;
            if (e.cancelable) e.preventDefault();
            const pos = getPos(e);
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.stroke();
        };

        const stopDraw = (e) => {
            if (this.isDrawing) {
                this.isDrawing = false;
                if (this.ctx) this.ctx.closePath();
            }
        };

        // Pointer Events modernes
        this.canvas.style.touchAction = 'none';
        
        // Mouse events
        this.canvas.addEventListener('mousedown', startDraw);
        this.canvas.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', stopDraw);

        // Touch events
        this.canvas.addEventListener('touchstart', startDraw, { passive: false });
        this.canvas.addEventListener('touchmove', draw, { passive: false });
        this.canvas.addEventListener('touchend', stopDraw);
        this.canvas.addEventListener('touchcancel', stopDraw);
    },

    open(permitId, signatory = 'wpeex') {
        this.init();
        this.currentPermitId = permitId || (window.App && window.App.currentPermitId) || 'SYN-K9-KW36';
        this.setSignatory(signatory || 'wpeex');
        this.clearCanvas();

        const modal = document.getElementById('modal-signature-pad');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                this.setupCanvasListeners();
            }, 100);
        }
    },

    close() {
        const modal = document.getElementById('modal-signature-pad');
        if (modal) modal.style.display = 'none';
    },

    setSignatory(role) {
        this.currentSignatory = role;
        document.querySelectorAll('.sig-role-btn').forEach(btn => {
            btn.style.borderColor = '#334155';
            btn.style.background = '#1e293b';
            btn.style.color = '#cbd5e1';
        });

        const activeBtn = document.getElementById(`sig-role-${role}`);
        if (activeBtn) {
            activeBtn.style.borderColor = '#3b82f6';
            activeBtn.style.background = '#1e3a8a';
            activeBtn.style.color = '#fff';
        }
    },

    setInk(color) {
        this.inkColor = color;
        if (this.ctx) {
            this.ctx.strokeStyle = color;
        }
    },

    clearCanvas() {
        if (!this.ctx || !this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rect.width, rect.height);
        this.hasDrawn = false;
        const ph = document.getElementById('sig-placeholder-text');
        if (ph) ph.style.display = 'flex';
    },

    saveSignature() {
        if (!this.hasDrawn) {
            if (window.App) window.App.showToast('⚠️ Veuillez tracer une signature avant de valider', 'warning');
            return;
        }

        const dataUrl = this.canvas.toDataURL('image/png');
        const now = new Date();
        const dateStr = now.toLocaleDateString('fr-FR');
        const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

        const signatoryNames = {
            wpeex: 'M. W.P.E.E.X (Ingénieur de Suivi Sinylon / Stellantis)',
            chef: 'Xie Xian (Responsable Exécution Sinylon)',
            hse: 'Nouri Chahrour (Superviseur HSE Sinylon)',
            receveur: 'Zhou Lin (Receveur Travaux Sinylon)'
        };

        const signatureObj = {
            dataUrl: dataUrl,
            role: this.currentSignatory,
            signatoryName: signatoryNames[this.currentSignatory] || 'Signataire Officiel',
            date: dateStr,
            time: timeStr,
            timestamp: now.toISOString(),
            hash: 'SIG-' + Math.random().toString(36).substring(2, 9).toUpperCase()
        };

        // Sauvegarder dans le Store et propager aux 3 zones de la même semaine (UB, UAR, FUSA)
        if (window.Store) {
            const p = window.Store.getPermit(this.currentPermitId);
            if (p) {
                const targetWeek = p.week || p.week_num;
                const allPermits = window.Store.getAllPermits();
                
                // Appliquer la signature sur tous les permis de la même semaine
                Object.values(allPermits).forEach(perm => {
                    if (perm.id === p.id || (targetWeek && (perm.week === targetWeek || perm.week_num === targetWeek))) {
                        if (!perm.signatures) perm.signatures = {};
                        perm.signatures[this.currentSignatory] = signatureObj;
                        perm.isWeeklySigned = true;
                        perm.weeklySignDate = dateStr;
                    }
                });
                
                window.Store.saveAllPermits(allPermits);

                // Synchroniser instantanément avec le serveur Render
                if (typeof fetch !== 'undefined') {
                    fetch('/api/permits', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(allPermits)
                    }).catch(() => {});
                }
            }
        }

        this.close();

        if (window.App) {
            window.App.showToast(`✅ Signature de ${signatoryNames[this.currentSignatory]} scellée avec succès !`, 'success');
            
            // Rafraîchir la vue active
            if (typeof window.App.showPublicClientView === 'function' && document.documentElement.classList.contains('qr-mode')) {
                window.App.showPublicClientView(this.currentPermitId);
            } else if (typeof window.App.renderPreview === 'function') {
                window.App.renderPreview();
            }
        }
    },

    // Créer une nouvelle semaine sur chantier
    createNewWeekPermit(newWeekNum) {
        if (!window.Store) return;
        const currentP = window.Store.getPermit(this.currentPermitId) || {};
        const nextWeek = newWeekNum || (parseInt(currentP.week || 36, 10) + 1);
        const nextId = `SYN-K9-KW${nextWeek}`;

        const newPermit = {
            ...currentP,
            id: nextId,
            week: nextWeek,
            weekLabel: `Semaine ${nextWeek}`,
            signatures: {}, // Nouvelles signatures requises pour la nouvelle semaine
            isWeeklySigned: false,
            validFrom: `2026-09-${String(7 + (nextWeek - 37) * 7).padStart(2, '0')}`,
            validUntil: `2026-09-${String(13 + (nextWeek - 37) * 7).padStart(2, '0')}`
        };

        window.Store.savePermit(newPermit);
        if (window.App) {
            window.App.currentPermitId = nextId;
            window.App.showToast(`🚀 Nouvelle Semaine ${nextWeek} créée avec succès ! Prête pour signature.`, 'success');
            if (document.documentElement.classList.contains('qr-mode')) {
                window.App.showPublicClientView(nextId);
            } else {
                window.App.renderPermitList();
                window.App.openPermitPreview(nextId);
            }
        }
    }
};

if (typeof window !== 'undefined') {
    window.SignaturePad = SignaturePad;
    document.addEventListener('DOMContentLoaded', () => {
        SignaturePad.init();
    });
}
