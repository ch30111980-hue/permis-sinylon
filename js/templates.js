/**
 * SINYLON - STELLANTIS | Templates A4 Haute Fidélité V4 (MODÈLES OFFICIELS CSPS FIAT)
 * Reproduction exacte des photos de permis du chantier Stellantis Algeria K9 CKD0
 * - Signatures et visas VIDES pour émargement manuscrit au stylo / tampon
 * - Revalidation quotidienne certifiée à 08h10 chaque matin
 * - Annexe A (Bleue), Annexe B (Rouge), Annexe C (Ambre) conformes aux formulaires CSPS FIAT
 */

const Templates = {
    // Helper Logo CSPS FIAT conforme aux photos officielles
    renderLogoCSPSFIAT() {
        return `
            <div class="csps-fiat-logo" style="display:inline-flex;align-items:center;border:1.5px solid #000;border-radius:2px;overflow:hidden;height:24px;vertical-align:middle;">
                <span style="background:#000;color:#fff;font-weight:900;font-size:13px;padding:2px 6px;letter-spacing:1px;display:flex;align-items:center;height:100%;">CSPS</span>
                <span style="background:#fff;color:#c00;font-weight:900;font-size:13px;padding:2px 6px;letter-spacing:1px;font-style:italic;display:flex;align-items:center;height:100%;font-family:Arial,Helvetica,sans-serif;">FIAT</span>
            </div>
        `;
    },

    // Helper pour le bandeau QR en bas de page
    renderFooterQR(permit) {
        const payload = (typeof window !== 'undefined' && window.QREngine && typeof window.QREngine.generatePayload === 'function') 
            ? window.QREngine.generatePayload(permit) 
            : `https://permis-sinylon.onrender.com/?permitId=${permit.id}`;
        
        let svgQr = '';
        const engine = typeof window !== 'undefined' ? (window.QRCodeGenerator || window.QRCode) : (typeof QRCodeGenerator !== 'undefined' ? QRCodeGenerator : null);
        if (engine && typeof engine.toSVG === 'function') {
            try {
                svgQr = engine.toSVG(payload, { size: 44, margin: 1 });
            } catch(e) {}
        }
        if (!svgQr || svgQr.length < 50) {
            svgQr = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(payload)}" style="width:100%;height:100%;object-fit:contain;" alt="QR Code">`;
        }

        return `
            <div class="doc-footer-qr-verification" style="margin-top:auto;border:1.5px solid #000;padding:3px 8px;background:#f8fafc;border-radius:3px;display:flex;justify-content:space-between;align-items:center;box-sizing:border-box;">
                <div class="qr-verify-text" style="font-size:7.5px;color:#000;line-height:1.2;flex:1;">
                    <div style="font-weight:900;font-size:8.5px;text-transform:uppercase;color:#000;letter-spacing:0.5px;">
                        🛡️ VÉRIFICATION ÉLECTRONIQUE / DIGITAL WORK PERMIT QR VERIFICATION
                    </div>
                    <div style="font-size:7.5px;color:#334155;margin-top:1px;">
                        Scannez ce QR Code pour vérifier en direct la validité journalière <strong>(Validé à 08h10 chaque matin)</strong>, les visas MOEX / W.P.E.E.X et les habilitations.
                    </div>
                    <div style="font-family:monospace;font-weight:800;font-size:8.5px;color:#1e3a8a;margin-top:1px;">
                        PERMIS N° ${permit.id} · PROJET ALGERIA K9 CKD0 · STELLANTIS
                    </div>
                </div>
                <div class="qr-container qr-code-box-footer" id="doc-qr-${permit.id}" title="Scan QR Code" style="width:44px;height:44px;min-width:44px;min-height:44px;background:#fff;border:1.5px solid #000;border-radius:2px;padding:1px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
                    ${svgQr}
                </div>
            </div>
        `;
    },

    // Helper Case à cocher [.Y .N] conforme aux formulaires
    renderCheckYN(value, isYNStyle = true) {
        if (!isYNStyle) {
            return `<span style="border:1px solid #000;padding:0 3px;font-size:7.5px;font-weight:800;display:inline-block;">Y</span>`;
        }
        return `
            <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:800;line-height:1;margin-left:4px;vertical-align:middle;">
                <span style="padding:1px 3px;border-right:1px solid #000;background:${value===true?'#000':'#fff'};color:${value===true?'#fff':'#000'};">.Y</span>
                <span style="padding:1px 3px;background:${value===false?'#000':'#fff'};color:${value===false?'#fff':'#000'};">.N</span>
            </span>
        `;
    },

    // 1. PERMIS GÉNÉRAL - PAGE 1/2 (RECTO)
    // Signatures VIDES prêtes pour émargement manuscrit au stylo / tampon
    generalP1(permit) {
        const d = permit.dangers || {};
        const isY = (val) => val ? 'check-active' : '';
        const isN = (val) => !val ? 'check-active' : '';

        const descFr = permit.activite_detaillee_fr || (permit.activity && (permit.activity.fr || permit.activity.en)) || permit['work-desc'] || permit.title || 'Installation Mécanique et Montage';
        const descEn = permit.activite_detaillee_en || (permit.activity && permit.activity.en) || permit.title_en || 'Mechanical and Assembly Installation';
        const descZh = permit.activite_detaillee_zh || (permit.activity && permit.activity.zh) || permit.title_zh || '机械装配与设备安装';
        const equipementsStr = Array.isArray(permit.equipements_a_installer) ? permit.equipements_a_installer.join(', ') : (permit.equipements_a_installer || 'Nacelles ciseaux (x6), Palans DEMAG KBK, Outillages certifiés');

        const workers = permit.travailleurs || permit.workers || ['Xie (Chef de Projet)', 'Nouri Chahrour (HSE Sinylon)'];
        const workersHtml = workers.map(w => {
            const nom = typeof w === 'object' ? w.nom : w;
            const role = typeof w === 'object' ? (w.role || 'Intervenant') : 'Intervenant';
            const isActive = typeof w === 'object' ? (w.status !== 'Inactif' && w.status !== 'Inactive') : true;
            if (isActive) {
                return `<span class="worker-tag" style="background:#fff;color:#0f172a;border:1.5px solid #0f172a;font-weight:800;padding:2px 8px;border-radius:4px;display:inline-block;margin:2px;"><strong>${nom}</strong> <small style="color:#475569;">(${role})</small> <span style="color:#16a34a;font-weight:900;">✓</span></span>`;
            } else {
                return `<span class="worker-tag" style="background:#dbeafe;color:#1e40af;border:1.5px solid #3b82f6;font-weight:700;padding:2px 8px;border-radius:4px;display:inline-block;margin:2px;"><strong>${nom}</strong> <small style="color:#3b82f6;">(${role})</small> <span style="color:#2563eb;font-weight:800;">🔵 Inactif</span></span>`;
            }
        }).join(' ');

        return `
            <div class="a4-document" id="doc-${permit.id}-p1">
                <!-- En-tête Logos & Titre Officiel -->
                <div class="doc-header" style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #000;padding-bottom:5px;margin-bottom:4px;">
                    <div class="doc-logo" style="display:flex;align-items:center;gap:6px;">
                        <span style="background:#000;color:#fff;font-weight:900;font-size:13px;padding:2px 6px;border-radius:2px;">SINYLON</span>
                        <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:13px;padding:1px 6px;border-radius:2px;background:#fff;">STELLANTIS</span>
                        ${this.renderLogoCSPSFIAT()}
                    </div>
                    <div class="doc-title-container" style="text-align:center;flex:1;">
                        <div class="doc-title-main" style="font-size:14px;font-weight:900;">PERMIS GENERAL DE TRAVAIL</div>
                        <div class="doc-title-sub" style="font-size:7.5px;color:#333;">GENERAL WORK PERMIT / 通用作业许可证 (à afficher sur le site de travail)</div>
                    </div>
                    <div class="doc-permit-number" style="border:1.5px solid #000;padding:2px 8px;text-align:center;border-radius:2px;background:#f8fafc;">
                        <div class="permit-label" style="font-size:7.5px;font-weight:700;">PERMIS N°</div>
                        <div class="permit-value" style="font-size:13px;font-weight:900;color:#1e3a8a;">${permit.id}</div>
                    </div>
                </div>

                <!-- Validité & Date d'émission (Bande Jaune) -->
                <div class="yellow-grid-3" style="display:grid;grid-template-columns:1fr 1.5fr 1fr;margin-bottom:4px;">
                    <div>
                        <div class="yellow-bar-header" style="background:#ffeb3b;border:1px solid #000;padding:2px 4px;font-weight:900;font-size:8px;">Date d'émission :</div>
                        <div class="doc-box-bordered" style="border:1px solid #000;border-top:none;padding:2px 4px;font-size:8px;">${permit.validFrom || permit['date-main'] || '2026-08-24'}</div>
                    </div>
                    <div>
                        <div class="yellow-bar-header" style="background:#ffeb3b;border:1px solid #000;padding:2px 4px;font-weight:900;font-size:8px;">Période de validité du permis :</div>
                        <div class="doc-box-bordered" style="border:1px solid #000;border-top:none;padding:2px 4px;font-size:8px;color:#1e3a8a;font-weight:800;">
                            Du : <span>${permit.validFrom || permit['date-main'] || '2026-08-24'}</span> 
                            Au : <span>${permit.validUntil || permit['date_fin'] || '2026-08-30'}</span>
                        </div>
                    </div>
                    <div>
                        <div class="yellow-bar-header" style="background:#ffeb3b;border:1px solid #000;padding:2px 4px;font-weight:900;font-size:8px;">Horaires autorisés :</div>
                        <div class="doc-box-bordered" style="border:1px solid #000;border-top:none;padding:2px 4px;font-size:8px;font-weight:800;">
                            De : <span>${permit.timeStart || permit['time-start'] || '08h00'}</span> 
                            À : <span>${permit.timeEnd || permit['time-end'] || '17h30'}</span>
                        </div>
                    </div>
                </div>

                <!-- Brève description du travail (Bande Jaune) -->
                <div class="yellow-bar-header" style="background:#ffeb3b;border:1px solid #000;padding:2px 4px;font-weight:900;font-size:8px;">Bréve description du travail & Activités de la zone / Brief work description</div>
                <div class="doc-box-bordered" style="border:1px solid #000;border-top:none;padding:3px 6px;min-height:36px;font-size:8px;">
                    <div style="font-weight:600;"><strong>FR :</strong> ${descFr}</div>
                    <div style="font-size:7.5px;color:#1e3a8a;font-style:italic;margin-top:1px;"><strong>EN :</strong> ${descEn}</div>
                    <div style="font-size:7.5px;color:#047857;margin-top:1px;"><strong>ZH :</strong> ${descZh}</div>
                </div>

                <!-- Endroit de travail & Équipement/Machinerie -->
                <div class="yellow-grid-2" style="display:grid;grid-template-columns:1.1fr 1fr;margin-top:4px;">
                    <div class="yellow-bar-header" style="background:#ffeb3b;border:1px solid #000;border-right:none;padding:2px 4px;font-weight:900;font-size:8px;">Endroit de travail & Zone(s) :</div>
                    <div class="yellow-bar-header" style="background:#ffeb3b;border:1px solid #000;padding:2px 4px;font-weight:900;font-size:8px;">Équipements & Installations à poser :</div>
                </div>
                <div style="display:grid;grid-template-columns:1.1fr 1fr;">
                    <div class="doc-box-bordered" style="border:1px solid #000;border-top:none;border-right:none;padding:3px 6px;font-size:8px;">
                        <strong>Bâtiment :</strong> ${permit.location || 'Hall Montage / Usine Stellantis'}<br>
                        <strong>Secteur :</strong> ${permit.ouvrage || 'Ligne Assemblage K9 CKD0'}<br>
                        <strong>ZONE(S) :</strong> <span style="color:#1e3a8a;font-weight:800;">${permit.zone || 'UB / UAR / FUSA'}</span>
                    </div>
                    <div class="doc-box-bordered" style="border:1px solid #000;border-top:none;padding:3px 6px;font-size:7.5px;line-height:1.25;">
                        <strong>Équipements à installer :</strong><br>
                        <span style="color:#0f172a;font-weight:600;">${equipementsStr}</span>
                    </div>
                </div>

                <!-- Entreprise Intervenante & Contacts -->
                <div style="display:grid;grid-template-columns:1.4fr 1fr;margin-top:4px;">
                    <div class="doc-box-bordered" style="border:1px solid #000;border-right:none;padding:3px 6px;font-size:8px;">
                        <strong>Entreprise Intervenante :</strong> <span style="font-weight:bold;">${permit.contractor || permit.company || 'SINYLON'}</span><br>
                        Avant de commencer le travail, veuillez contacter :<br>
                        <strong>Chef de Projet :</strong> <span>${permit.chefNom || permit['chef-nom'] || 'Xie (Chef de Projet)'}</span>
                    </div>
                    <div class="doc-box-bordered" style="border:1px solid #000;padding:3px 6px;font-size:8px;">
                        <div style="display:flex;justify-content:space-between;">
                            <span>Plan d'urgence du site attaché :</span>
                            <span class="check-yn"><span>Y</span><span class="check-active" style="background:#000;color:#fff;padding:0 3px;">N</span></span>
                        </div>
                        <strong>Ouvrage :</strong> <span>${permit.ouvrage || 'Stellantis'}</span> 
                        <strong>ZONE :</strong> <span>${permit.zone || 'Zone 4'}</span><br>
                        <strong>Tél. HSE :</strong> <span>${permit.tel || '0563765157'}</span>
                    </div>
                </div>

                <!-- Équipe & Intervenants autorisés -->
                <div class="doc-workers-box" style="border:1px solid #000;padding:3px 6px;margin-top:4px;">
                    <div style="font-weight:bold;font-size:8px;color:#1e3a8a;margin-bottom:2px;">
                        👥 INTERVENANTS AUTORISÉS (CHEF DE PROJET, HSE & TECHNICIENS SINYLON)
                    </div>
                    <div>${workersHtml}</div>
                </div>

                <!-- Grille d'Analyse des Grands Dangers (A, B, C, D, E, F) -->
                <div style="margin-top:4px;font-weight:bold;font-size:8px;">
                    si oui, la liste de verification des grands danger suivante doit être attachée :
                </div>
                <table class="doc-table-exact" style="width:100%;border-collapse:collapse;margin-top:2px;font-size:7.5px;">
                    <tr>
                        <td style="border:1px solid #000;padding:2px 4px;width:50%;">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <span>Travail en hauteur (Annexe A Bleue)</span>
                                <div><span class="check-yn"><span class="${isY(d.height)}" style="${isY(d.height)?'background:#000;color:#fff;':''}">.Y.</span><span class="${isN(d.height)}">N</span></span> <strong style="margin-left:4px;">A</strong></div>
                            </div>
                        </td>
                        <td style="border:1px solid #000;padding:2px 4px;width:50%;">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <span>Travail à chaud / Soudage (Annexe B Rouge)</span>
                                <div><span class="check-yn"><span class="${isY(d.hot)}" style="${isY(d.hot)?'background:#000;color:#fff;':''}">.Y.</span><span class="${isN(d.hot)}">N</span></span> <strong style="margin-left:4px;">B</strong></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="border:1px solid #000;padding:2px 4px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <span>Travail Électrique & Consignation (Annexe C Jaune)</span>
                                <div><span class="check-yn"><span class="${isY(d.electric)}" style="${isY(d.electric)?'background:#000;color:#fff;':''}">.Y.</span><span class="${isN(d.electric)}">N</span></span> <strong style="margin-left:4px;">C</strong></div>
                            </div>
                        </td>
                        <td style="border:1px solid #000;padding:2px 4px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <span>Espace confiné</span>
                                <div><span class="check-yn"><span>.Y.</span><span class="check-active" style="background:#000;color:#fff;padding:0 3px;">N</span></span> <strong style="margin-left:4px;">D</strong></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="border:1px solid #000;padding:2px 4px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <span>Excavation / Fouille</span>
                                <div><span class="check-yn"><span>.Y.</span><span class="check-active" style="background:#000;color:#fff;padding:0 3px;">N</span></span> <strong style="margin-left:4px;">E</strong></div>
                            </div>
                        </td>
                        <td style="border:1px solid #000;padding:2px 4px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <span>Tension ou rupture de conduite</span>
                                <div><span class="check-yn"><span>.Y.</span><span class="check-active" style="background:#000;color:#fff;padding:0 3px;">N</span></span> <strong style="margin-left:4px;">F</strong></div>
                            </div>
                        </td>
                    </tr>
                </table>

                <div style="display:flex;justify-content:space-between;align-items:center;border:1px solid #000;padding:2px 6px;margin-top:3px;font-size:8px;">
                    <div>
                        Est ce que l'analyse des risques de travail / la méthode d'exécution est requise ?
                        <span class="check-yn" style="margin-left:6px;"><span style="background:#000;color:#fff;padding:0 3px;">.Y.</span><span>N</span></span>
                    </div>
                    <div>
                        Si oui, Ref. Nr. / Id. : <strong>${permit['method-ref'] || 'SINY-MOS-K9-01'}</strong>
                    </div>
                </div>

                <!-- VALIDITÉ DU PERMIS ET SIGNATURES (CASES VIDES POUR SIGNATURE ET TAMPON À LA MAIN) -->
                <div style="margin-top:4px;border:1.5px solid #000;padding:4px 6px;">
                    <div style="font-weight:bold;font-size:8.5px;border-bottom:1px solid #000;padding-bottom:2px;margin-bottom:3px;display:flex;justify-content:space-between;">
                        <span>VALIDITÉ DU PERMIS ET SIGNATURES INITIALES (JOUR 1 — VALIDÉ À 08H10)</span>
                        <span style="font-size:7.5px;color:#555;">(Émargement manuscrit obligatoire avant démarrage)</span>
                    </div>
                    <div style="display:flex;gap:12px;align-items:center;margin-bottom:4px;font-size:8px;">
                        <div>Date initiale : <span style="border-bottom:1px solid #000;font-weight:bold;padding:0 8px;">${permit.validFrom || permit['date-main'] || '2026-08-24'}</span></div>
                        <div>Heure début : <span style="border-bottom:1px solid #000;font-weight:bold;padding:0 8px;">08h10</span></div>
                        <div>Heure fin : <span style="border-bottom:1px solid #000;font-weight:bold;padding:0 8px;">17h30</span></div>
                    </div>

                    <!-- Grille des 4 Signatures : CASES VIDES POUR SIGNATURE MANUELLE -->
                    <div class="signatures-grid-exact" style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;">
                        <div class="sign-card-exact" style="border:1px solid #000;padding:3px;font-size:7.5px;min-height:56px;display:flex;flex-direction:column;justify-content:space-between;background:#fff;">
                            <div class="sign-card-header" style="background:#f1f5f9;font-weight:900;font-size:7.5px;padding:1px;text-align:center;border-bottom:1px solid #000;">Chef de Projet Entreprise</div>
                            <div>Nom : <strong>${permit.chefNom || permit['chef-nom'] || 'Xie'}</strong></div>
                            <div style="height:26px;border-bottom:1px dashed #777;display:flex;align-items:flex-end;color:#888;font-size:7px;">Signature / Tampon :</div>
                        </div>

                        <div class="sign-card-exact wpeex-sign" style="border:1.5px solid #1e3a8a;padding:3px;font-size:7.5px;min-height:56px;display:flex;flex-direction:column;justify-content:space-between;background:#eff6ff;">
                            <div class="sign-card-header" style="background:#1e3a8a;color:#fff;font-weight:900;font-size:7.5px;padding:1px;text-align:center;">W.P.E.E.X - Ingénieur de Suivi</div>
                            <div>Nom : <strong>${permit.wpeexNom || permit['wpeex-nom'] || 'M. W.P.E.E.X'}</strong></div>
                            <div style="height:26px;border-bottom:1px dashed #1e3a8a;display:flex;align-items:flex-end;color:#1e3a8a;font-size:7px;">Visa & Cachet (08h10) :</div>
                        </div>

                        <div class="sign-card-exact" style="border:1px solid #000;padding:3px;font-size:7.5px;min-height:56px;display:flex;flex-direction:column;justify-content:space-between;background:#fff;">
                            <div class="sign-card-header" style="background:#f1f5f9;font-weight:900;font-size:7.5px;padding:1px;text-align:center;border-bottom:1px solid #000;">Superviseur HSE Sinylon</div>
                            <div>Nom : <strong>${permit.hseNom || permit['hse-nom'] || 'Nouri Chahrour'}</strong></div>
                            <div style="height:26px;border-bottom:1px dashed #777;display:flex;align-items:flex-end;color:#888;font-size:7px;">Signature & Visa HSE :</div>
                        </div>

                        <div class="sign-card-exact" style="border:1px solid #000;padding:3px;font-size:7.5px;min-height:56px;display:flex;flex-direction:column;justify-content:space-between;background:#fff;">
                            <div class="sign-card-header" style="background:#f1f5f9;font-weight:900;font-size:7.5px;padding:1px;text-align:center;border-bottom:1px solid #000;">Receveur / Chef d'Équipe</div>
                            <div>Nom : <strong>${permit.chefEquipe || permit.chef_equipe || 'Xian'}</strong></div>
                            <div style="height:26px;border-bottom:1px dashed #777;display:flex;align-items:flex-end;color:#888;font-size:7px;">Signature :</div>
                        </div>
                    </div>
                </div>

                <!-- QR CODE FOOTER DÉDIÉ -->
                ${this.renderFooterQR(permit)}
            </div>
        `;
    },

    // 2. PERMIS GÉNÉRAL - PAGE 2/2 (VERSO REVALIDATIONS DU JOUR 2 AU JOUR 7)
    // Tableau avec colonnes Visa et Signature VIDES pour émargement manuscrit chaque matin à 08h10
    generalP2(permit) {
        const dStart = permit.validFrom || permit['date-main'] || '2026-08-24';
        const startDate = new Date(dStart);

        const dayNames = [
            { dayIndex: 2, name: 'Jour 2 (Mardi)', offset: 1 },
            { dayIndex: 3, name: 'Jour 3 (Mercredi)', offset: 2 },
            { dayIndex: 4, name: 'Jour 4 (Jeudi)', offset: 3 },
            { dayIndex: 5, name: 'Jour 5 (Vendredi)', offset: 4 },
            { dayIndex: 6, name: 'Jour 6 (Samedi)', offset: 5 },
            { dayIndex: 7, name: 'Jour 7 (Dimanche)', offset: 6 }
        ];

        const rows = dayNames.map(dayInfo => {
            const targetDate = new Date(startDate);
            targetDate.setDate(startDate.getDate() + dayInfo.offset);
            const dateStr = targetDate.toISOString().split('T')[0];

            return `
                <tr style="height:26px;">
                    <td class="text-center bold-cell" style="font-weight:bold;font-size:8px;border:1px solid #000;padding:2px 4px;">${dayInfo.name}</td>
                    <td class="text-center" style="font-family:monospace;font-size:8px;border:1px solid #000;padding:2px 4px;">${dateStr}</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">M. W.P.E.E.X</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Ingénieur Suivi</td>
                    <!-- CASE VISA WPEEX VIDE POUR SIGNATURE MANUELLE À 08H10 -->
                    <td class="text-center" style="border:1px solid #000;padding:2px;width:110px;">
                        <div style="height:20px;border-bottom:1px dashed #999;margin:1px 4px;"></div>
                    </td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Xie</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Chef de Projet</td>
                    <!-- CASE SIGNATURE SINYLON VIDE POUR SIGNATURE MANUELLE À 08H10 -->
                    <td class="text-center" style="border:1px solid #000;padding:2px;width:110px;">
                        <div style="height:20px;border-bottom:1px dashed #999;margin:1px 4px;"></div>
                    </td>
                    <td class="no-print text-center" style="border:1px solid #000;padding:2px;font-size:7.5px;">
                        <span style="color:#16a34a;font-weight:700;">À signer 08h10</span>
                    </td>
                </tr>
            `;
        });

        return `
            <div class="a4-document" id="a4-doc-${permit.id}-p2">
                <div class="doc-header-exact" style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #000;padding-bottom:5px;margin-bottom:4px;">
                    <div class="doc-logo-box" style="display:flex;align-items:center;gap:6px;">
                        <span style="background:#000;color:#fff;font-weight:900;font-size:13px;padding:2px 6px;border-radius:2px;">SINYLON</span>
                        <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:13px;padding:1px 6px;border-radius:2px;background:#fff;">STELLANTIS</span>
                        ${this.renderLogoCSPSFIAT()}
                    </div>
                    <div class="doc-title-exact" style="font-size:14px;font-weight:900;text-align:center;flex:1;">
                        Revalidation Quotidienne du Permis de Travail<br>
                        <span style="font-size:7.5px;font-weight:normal;color:#333;">Daily Work Permit Revalidation Sheet (Contrôle et émargement chaque matin à 08h10)</span>
                    </div>
                    <div class="doc-header-right-group">
                        <div class="doc-id-box-exact" style="border:1.5px solid #000;padding:2px 8px;text-align:center;border-radius:2px;background:#f8fafc;">
                            <strong style="font-size:7.5px;">Permit ID</strong><br>
                            <span style="font-size:12px;font-weight:900;color:#1e3a8a;">${permit.id}</span>
                        </div>
                    </div>
                </div>

                <div class="yellow-bar-header" style="background:#ffeb3b;border:1px solid #000;padding:3px 6px;font-weight:900;font-size:8.5px;margin-top:6px;display:flex;justify-content:space-between;">
                    <span>REVALIDATION QUOTIDIENNE DU PERMIS (DU JOUR 2 AU JOUR 7 — ÉMARGEMENT SUR SITE À 08H10)</span>
                    <span style="font-size:7.5px;font-weight:normal;font-style:italic;">Chaque matin avant le démarrage des travaux</span>
                </div>
                <table class="doc-table-exact" style="width:100%;border-collapse:collapse;margin-top:4px;">
                    <thead>
                        <tr style="background:#f1f5f9;font-size:7.5px;">
                            <th rowspan="2" style="border:1px solid #000;padding:3px 4px;width:95px;">JOURNÉE</th>
                            <th rowspan="2" style="border:1px solid #000;padding:3px 4px;width:75px;">DATE</th>
                            <th colspan="3" style="border:1px solid #000;padding:2px;background:#eff6ff;color:#1e3a8a;">W.P.E.E.X - Ingénieur de Suivi</th>
                            <th colspan="3" style="border:1px solid #000;padding:2px;">Responsable d'exécution (SINYLON)</th>
                            <th rowspan="2" class="no-print" style="border:1px solid #000;padding:2px;width:70px;">STATUT</th>
                        </tr>
                        <tr style="background:#f8fafc;font-size:7px;">
                            <th style="border:1px solid #000;padding:2px;">Nom</th>
                            <th style="border:1px solid #000;padding:2px;">Fonction</th>
                            <th style="border:1px solid #000;padding:2px;background:#eff6ff;color:#1e3a8a;">Visa Manuscrit (08h10)</th>
                            <th style="border:1px solid #000;padding:2px;">Nom</th>
                            <th style="border:1px solid #000;padding:2px;">Fonction</th>
                            <th style="border:1px solid #000;padding:2px;">Signature Manuscrite (08h10)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.join('')}
                    </tbody>
                </table>

                <div class="yellow-bar-header" style="background:#ffeb3b;border:1px solid #000;padding:3px 6px;font-weight:900;font-size:8.5px;margin-top:10px;">
                    SUPERVISION SPÉCIALE CAISSE WEEK-END (VENDREDI / SAMEDI — 08H10)
                </div>
                <table class="doc-table-exact" style="width:100%;border-collapse:collapse;margin-top:4px;font-size:7.5px;">
                    <thead>
                        <tr style="background:#f1f5f9;">
                            <th style="border:1px solid #000;padding:3px;width:80px;">JOURNÉE</th>
                            <th style="border:1px solid #000;padding:3px;width:85px;">DATE</th>
                            <th style="border:1px solid #000;padding:3px;">SUPERVISEUR W.P.E.E.X</th>
                            <th style="border:1px solid #000;padding:3px;">CONTRÔLE SÉCURITÉ (08H10)</th>
                            <th style="border:1px solid #000;padding:3px;width:150px;">VISA CAISSE STELLANTIS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="height:28px;">
                            <td class="text-center bold-cell" style="border:1px solid #000;font-weight:bold;padding:3px;">Vendredi</td>
                            <td class="text-center" style="border:1px solid #000;font-family:monospace;padding:3px;">2026-08-28</td>
                            <td style="border:1px solid #000;padding:3px;">M. W.P.E.E.X</td>
                            <td style="border:1px solid #000;padding:3px;">Vérification 360°, Nacelles, Extincteurs, Balisage</td>
                            <td style="border:1px solid #000;padding:2px;text-align:center;">
                                <div style="height:20px;border-bottom:1px dashed #999;margin:1px 6px;"></div>
                            </td>
                        </tr>
                        <tr style="height:28px;">
                            <td class="text-center bold-cell" style="border:1px solid #000;font-weight:bold;padding:3px;">Samedi</td>
                            <td class="text-center" style="border:1px solid #000;font-family:monospace;padding:3px;">2026-08-29</td>
                            <td style="border:1px solid #000;padding:3px;">M. W.P.E.E.X</td>
                            <td style="border:1px solid #000;padding:3px;">Vérification 360°, Nacelles, Extincteurs, Balisage</td>
                            <td style="border:1px solid #000;padding:2px;text-align:center;">
                                <div style="height:20px;border-bottom:1px dashed #999;margin:1px 6px;"></div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- QR CODE FOOTER DÉDIÉ -->
                ${this.renderFooterQR(permit)}
            </div>
        `;
    },

    // 3. ANNEXE A (BLEUE) — TRAVAIL EN HAUTEUR
    // REPRODUCTION EXACTE DE LA PHOTO CSPS FIAT (Cadre Bleu, Logo CSPS FIAT, Checklist exacte)
    heightAnnexe(permit) {
        const chefNom = permit.responsible || permit.chefNom || 'Xie';
        const hseNom = permit.hseNom || 'Nouri Chahrour';
        const datePermis = permit.validFrom || permit['date-main'] || '2026-08-24';

        return `
            <div class="a4-document annexe-height-doc" id="a4-doc-${permit.id}-height" style="border:3px solid #004080;padding:5px 8px;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;font-size:7.5px;line-height:1.2;color:#000;">
                
                <!-- EN-TÊTE EXACT PHOTO CSPS FIAT -->
                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #004080;padding-bottom:3px;margin-bottom:3px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="background:#000;color:#fff;font-size:22px;font-weight:900;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:2px;">A</div>
                        <div style="font-size:17px;font-weight:900;color:#000;letter-spacing:0.3px;">Travail en hauteur</div>
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;">
                        ${this.renderLogoCSPSFIAT()}
                        <div style="border:1px solid #000;text-align:center;width:125px;">
                            <div style="font-size:7.5px;font-weight:700;border-bottom:1px solid #000;padding:1px 4px;background:#f8fafc;">Identifiant du permis</div>
                            <div style="font-size:12px;font-weight:900;padding:1px 4px;color:#000;">${permit.id || '0'}</div>
                        </div>
                    </div>
                </div>

                <div style="text-align:center;font-size:7.5px;font-weight:bold;margin-bottom:3px;color:#000;">
                    Cette liste de verification doit etre toujours accompagnée par le permis de travail de sécurité générale
                </div>

                <div style="font-style:italic;font-size:7px;margin-bottom:2px;color:#333;">
                    Cette question est pour vous aider avec votre évaluation des risques.<br>
                    <strong>Usage de</strong> (si "oui" continuer à la colonne de droite):
                </div>

                <!-- TABLEAU ÉQUIPEMENTS & RISQUES SECTION 1 -->
                <table style="width:100%;border-collapse:collapse;margin-bottom:3px;font-size:7px;">
                    <tbody>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;width:34%;">Echaffaudage fixe</td>
                            <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;">${this.renderCheckYN(false)}</td>
                            <td style="border:1px solid #999;padding:1.5px 3px;width:52%;">approuvé et cacheté par le personnel qua</td>
                            <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;">${this.renderCheckYN(false)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;">Echaffaudage mobile</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                            <td style="border:1px solid #999;padding:1.5px 3px;">approuvé et cacheté par le personnel qua</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;" rowspan="3">Elevateur de plateforme mobile</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;" rowspan="3">${this.renderCheckYN(true)}</td>
                            <td style="border:1px solid #999;padding:1.5px 3px;">L'opérateur et le travailleur entrainés</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;">Order to use given in written</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;">Port d'équipement d'arret de chute</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;" rowspan="5">Echelle</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;" rowspan="5">${this.renderCheckYN(false)}</td>
                            <td style="border:1px solid #999;padding:1.5px 3px;">aucun autre équipement ne peut etre utilisé</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;"><span style="border:1px solid #000;padding:0 3px;font-weight:800;">Y</span></td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;">Utilisé pour des activités à court terme</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;">Avec un potentiel de danger minimum</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;">verifier et cacheter</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;">travailleur entrainé dans l'usage</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;" rowspan="2">Equipement d'arret de chute requis ?</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;" rowspan="2">${this.renderCheckYN(true)}</td>
                            <td style="border:1px solid #999;padding:1.5px 3px;">Verfiyer avant de commencer le travail</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;">Moyens d'attachement définis par le personnel qualifié</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- SECTION 2 : TRAVAIL SUR TOIT -->
                <div style="border:1px solid #000;margin-bottom:3px;font-size:7px;">
                    <div style="font-weight:bold;padding:2px 4px;border-bottom:1px solid #000;background:#f1f5f9;display:flex;justify-content:space-between;">
                        <span>Travail sur toit</span>
                        <span>${this.renderCheckYN(false)}</span>
                    </div>
                    <table style="width:100%;border-collapse:collapse;">
                        <tr>
                            <td style="border:1px solid #999;padding:2px 4px;width:40%;">Capacité de Charge du toit suffisante à supporter</td>
                            <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;">${this.renderCheckYN(false)}</td>
                            <td style="border:1px solid #999;padding:2px 4px;width:46%;">Endroit coordonné fermé</td>
                            <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;">${this.renderCheckYN(false)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:2px 4px;">Présence d'une toiture fragile proximité du site d</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                            <td style="border:1px solid #999;padding:2px 4px;">Protection de chute/Protection de bord existante?</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                        </tr>
                        <tr>
                            <td colspan="4" style="border:1px solid #999;padding:2px 4px;">
                                Mesures additionnel : <span style="border-bottom:1px solid #000;display:inline-block;width:75%;height:10px;"></span>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- SECTION 3 : CHECKLIST CONSIGNES SUR LE SITE -->
                <table style="width:100%;border-collapse:collapse;margin-bottom:3px;font-size:7px;">
                    <tbody>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;width:92%;">Endroit de travail barré pour véhicules/traffic/piétons</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;width:8%;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">Obstacles sur ou approximité du site de travail (conduit de cable, cables seul, tuyauteries, etc.)</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;"><span style="border:1px solid #000;padding:0 3px;font-weight:800;">Y</span></td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">Conduits d'aération, cheminées, échappements qui peuvent émettre des substances chaudes/odorantes/d</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">Parties d'équipement de l'usine à protéger</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">Issue de secours d'urgence</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">Materiels/outils qui a besoin d'être deplacé</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">Directives de sécurité necessaires</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">
                                Autres: <span style="border-bottom:1px solid #000;display:inline-block;width:55%;height:10px;"></span> porter les
                            </td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- SECTION 4 : CONDITIONS AMBIANTES AU MOMENT DU PROBLÈME -->
                <div style="border:1px solid #000;padding:3px 4px;margin-bottom:3px;font-size:7px;">
                    <div style="font-weight:bold;margin-bottom:1px;">Conditions ambiantes au moment du problème</div>
                    <div style="font-size:6.5px;font-style:italic;color:#555;margin-bottom:2px;">NOTE: Permis doit être revu si les conditions se détériorent.</div>
                    
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
                        <span style="width:110px;font-weight:600;">visibilité générale</span>
                        <span>claire <span style="border:1px solid #000;padding:0 3px;font-weight:800;background:#000;color:#fff;">Y</span></span>
                        <span>Amoindrit ${this.renderCheckYN(false)}</span>
                        <span>Sombre ${this.renderCheckYN(false)}</span>
                        <span>obscure ${this.renderCheckYN(false)}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
                        <span style="width:110px;font-weight:600;">pluit</span>
                        <span>aucune <span style="border:1px solid #000;padding:0 3px;font-weight:800;background:#000;color:#fff;">Y</span></span>
                        <span>légère ${this.renderCheckYN(false)}</span>
                        <span>moderé ${this.renderCheckYN(false)}</span>
                        <span>Forte ${this.renderCheckYN(false)}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
                        <span style="width:110px;font-weight:600;">Surface du site de travail</span>
                        <span>sec <span style="border:1px solid #000;padding:0 3px;font-weight:800;background:#000;color:#fff;">Y</span></span>
                        <span>Mouillé ${this.renderCheckYN(false)}</span>
                        <span>glissante ${this.renderCheckYN(false)}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
                        <span style="width:110px;font-weight:600;">Vent</span>
                        <span>aucun <span style="border:1px solid #000;padding:0 3px;font-weight:800;background:#000;color:#fff;">Y</span></span>
                        <span>Légère ${this.renderCheckYN(false)}</span>
                        <span>Modéré ${this.renderCheckYN(false)}</span>
                        <span>Fort ${this.renderCheckYN(false)}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:2px;border-top:1px dashed #aaa;padding-top:2px;">
                        <span>Surface de travail glissante suite au deversement des huiles et des produits chimiques?</span>
                        <span>${this.renderCheckYN(false)}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:2px;">
                        <span>Mesures additionnel : <strong>Porter obligatoire Casques anti choc et Ceinture de Sécurité</strong></span>
                        <span>${this.renderCheckYN(true)}</span>
                    </div>
                </div>

                <!-- SECTION 5 : SIGNATURES VIDES POUR ÉMARGEMENT MANUEL (EXACT PHOTO) -->
                <table style="width:100%;border-collapse:collapse;margin-top:auto;border:1.5px solid #004080;margin-bottom:2px;">
                    <tr style="background:#dbeafe;font-size:7.5px;font-weight:900;text-align:center;">
                        <th style="border:1px solid #004080;padding:2px;width:38%;">CHEF DE PROJET</th>
                        <th style="border:1px solid #004080;padding:2px;width:38%;">HSE ENTREPRISE</th>
                        <th style="border:1px solid #004080;padding:2px;width:24%;">DATE / HEURE</th>
                    </tr>
                    <tr>
                        <td style="border:1px solid #004080;padding:3px 6px;height:38px;vertical-align:top;font-size:7.5px;">
                            <div>Nom : <strong>${chefNom}</strong></div>
                            <div style="margin-top:8px;font-size:7px;color:#777;">Signature : </div>
                        </td>
                        <td style="border:1px solid #004080;padding:3px 6px;height:38px;vertical-align:top;font-size:7.5px;">
                            <div>Nom : <strong>${hseNom}</strong></div>
                            <div style="margin-top:8px;font-size:7px;color:#777;">Signature : </div>
                        </td>
                        <td style="border:1px solid #004080;padding:3px 6px;height:38px;vertical-align:middle;font-size:7.5px;">
                            <div style="display:flex;gap:4px;align-items:center;margin-bottom:3px;">
                                <span>Date :</span>
                                <span style="border:1px solid #000;flex:1;padding:1px 3px;font-family:monospace;font-size:7.5px;">${datePermis}</span>
                            </div>
                            <div style="display:flex;gap:4px;align-items:center;">
                                <span>Heure :</span>
                                <span style="border:1px solid #000;flex:1;padding:1px 3px;font-family:monospace;font-size:7.5px;">08h10</span>
                            </div>
                        </td>
                    </tr>
                </table>

                <!-- QR CODE FOOTER DÉDIÉ -->
                ${this.renderFooterQR(permit)}
            </div>
        `;
    },

    // 4. ANNEXE B (ROUGE) — TRAVAIL CHAUD
    // REPRODUCTION EXACTE DE LA PHOTO CSPS FIAT (Cadre Rouge, Logo CSPS FIAT, Checklist exacte)
    hotAnnexe(permit) {
        const chefNom = permit.responsible || permit.chefNom || 'Xie';
        const hseNom = permit.hseNom || 'Nouri Chahrour';
        const datePermis = permit.validFrom || permit['date-main'] || '2026-08-24';

        return `
            <div class="a4-document annexe-hot-doc" id="a4-doc-${permit.id}-hot" style="border:3px solid #cc0000;padding:5px 8px;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;font-size:7.5px;line-height:1.2;color:#000;">
                
                <!-- EN-TÊTE EXACT PHOTO CSPS FIAT -->
                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #cc0000;padding-bottom:3px;margin-bottom:3px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="background:#000;color:#fff;font-size:22px;font-weight:900;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:2px;">B</div>
                        <div style="font-size:17px;font-weight:900;color:#000;letter-spacing:0.3px;">Travail chaud</div>
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;">
                        ${this.renderLogoCSPSFIAT()}
                        <div style="border:1px solid #000;text-align:center;width:125px;">
                            <div style="font-size:7.5px;font-weight:700;border-bottom:1px solid #000;padding:1px 4px;background:#f8fafc;">Permit Identifier</div>
                            <div style="font-size:12px;font-weight:900;padding:1px 4px;color:#000;">${permit.id || '0'}</div>
                        </div>
                    </div>
                </div>

                <div style="text-align:center;font-size:7.5px;font-weight:bold;margin-bottom:3px;color:#000;">
                    La liste de vérification doit être toujours accompagnée par le permis de travail de sécurité générale
                </div>

                <!-- CHECKLIST TRAVAIL CHAUD AVEC CASES [.Y .N.] (EXACT PHOTO) -->
                <table style="width:100%;border-collapse:collapse;margin-bottom:3px;font-size:7px;">
                    <tbody>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;width:92%;">
                                Tous les produits inflamable ou combustible seront déga <span style="border:1px solid #000;padding:0 3px;font-weight:bold;">10</span> m (min. 10 m)
                            </td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;width:8%;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">
                                S i le déplacement n'est pas possible: les produits inflamable ou combustible seront protégés and/or fire resistant curtains or covers
                            </td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">Tous debris, saleté, ou poussière est enlevé</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">
                                environnement de travail incluant les vaissaux, tuyauterie, derrière des murs etc. verifier pour ou dissimulation de produit inflamable ou combustible
                            </td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">
                                Présence dans un étage/autre structure combustible si "oui" spécifier les précautions entreprises (e.g. arosage avec l'eau, couverture avec d'inerte matériaux):<br>
                                <div style="border:1px solid #000;padding:1px 4px;margin-top:1px;display:flex;justify-content:space-between;background:#fef2f2;">
                                    <span>Couvrir tous les materiaux sont inflammés hors le lieu d'intervention</span>
                                    <span>${this.renderCheckYN(true)}</span>
                                </div>
                            </td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;vertical-align:top;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">couvertures resistantes au feu/écran equipé à resister aux eteincelles</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">Fermeturs des vannes, égouts,couvercles etc. automatiquement ouvrables</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">Isolement sûr des conduits/convoyeurs/systémes d'échapement qui peuvent resulter sur éteincelles</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">Couverture des trous et égouts ( joints scellés, fentes, ouvertures, conduits, etc.)</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">
                                ventillation suffisante sur le lieu de travail &nbsp;&nbsp; (naturel <span style="border:1px solid #000;padding:0 2px;font-weight:bold;">Y</span> &nbsp; technique <span style="border:1px solid #000;padding:0 2px;font-weight:bold;">Y</span>)
                            </td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">Apareils électrique et cables protégés</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">Tous les equipements, tuyauteries, materiels de voisinnage sont protégés</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">Pour les travaux en hauteur ou treillis, des protection supplémentaires sont fournies pour les endroit</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">Le Site du travail est marqué/posté et barricadé adequetement</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">
                                Une gaz surveillance est nécessaire avant l'entame du travail pour gaz ou vapeurs inflammables si "oui" exposition forme X additionnel est nécessaire
                            </td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="border:1px solid #999;padding:1px 4px;font-size:6.5px;font-style:italic;">
                                NB: Isolation sûre de l'équipements/lignes a besoin d'isolation forme I additionnel
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- SECTION ÉQUIPEMENT DE LUTTE ANTI FEU FOURNI -->
                <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:4px;margin-bottom:3px;border:1px solid #cc0000;padding:3px;font-size:7px;">
                    <div>
                        <div style="font-weight:bold;margin-bottom:2px;">Equipement de lutte anti feu fourni</div>
                        <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
                            <span>Extincteur de feu :</span>
                            <span>Water <span style="border:1px solid #000;padding:0 2px;font-weight:bold;">Y</span></span>
                            <span>Poudre <span style="border:1px solid #000;padding:0 2px;font-weight:bold;background:#000;color:#fff;">Y</span></span>
                            <span>CO₂ <span style="border:1px solid #000;padding:0 2px;font-weight:bold;">Y</span></span>
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
                            <span>Couvertures anti-feu <span style="border:1px solid #000;padding:0 2px;font-weight:bold;background:#000;color:#fff;">Y</span></span>
                            <span>Gourde <span style="border:1px solid #000;padding:0 2px;font-weight:bold;">Y</span></span>
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
                            <span>surveillent d'incendie <span style="border:1px solid #000;padding:0 2px;font-weight:bold;background:#000;color:#fff;">Y</span></span>
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span>Instruction par site <span style="border:1px solid #000;padding:0 2px;font-weight:bold;background:#000;color:#fff;">Y</span></span>
                        </div>
                        <div style="display:flex;align-items:center;gap:4px;margin-top:3px;border-top:1px dashed #aaa;padding-top:2px;">
                            <span>Inspection du site de trava</span>
                            <span style="border:1px solid #000;padding:0 3px;font-weight:bold;">1</span>
                            <span style="border:1px solid #000;padding:0 3px;font-weight:bold;background:#000;color:#fff;">2</span>
                            <span style="border:1px solid #000;padding:0 3px;font-weight:bold;">3</span> h
                            <span style="margin-left:4px;">Durée de la dernière inspecti</span>
                            <span style="border:1px solid #000;padding:0 4px;font-weight:bold;">30 MIN</span>
                        </div>
                    </div>
                    <div style="border-left:1px solid #cc0000;padding-left:4px;display:flex;flex-direction:column;justify-content:space-between;">
                        <div style="font-size:6.5px;color:#000;line-height:1.2;">
                            <strong>Eloigner tous les materiaux inflammable</strong> hors le lieu d'intervention<br>
                            (Hors l'exposition de feu)
                        </div>
                        <div style="border:1px solid #cc0000;background:#fee2e2;padding:2px 4px;margin:2px 0;">
                            <div style="font-weight:bold;font-size:7px;color:#991b1b;">HSE ENTREPRISE</div>
                            <div style="font-size:6.5px;">Nom (lettres majuscule) et signature:</div>
                            <div style="font-weight:bold;font-size:7.5px;">${hseNom}</div>
                            <div style="height:14px;border-bottom:1px dashed #991b1b;"></div>
                        </div>
                        <div style="font-size:6.5px;color:#991b1b;font-weight:bold;line-height:1.2;">
                            Surveillent d'incendie doit être présent durant le travail à chaud et <u>30 minutes après son achèvement</u>
                        </div>
                    </div>
                </div>

                <!-- SECTION ALARME & NOTIFICATIONS -->
                <div style="border:1px solid #000;padding:3px;margin-bottom:3px;font-size:7px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
                        <span>L'alarme d'incendie la plus proche/appel d'urge</span>
                        <span style="border:1px solid #000;padding:1px 6px;font-weight:bold;background:#f8fafc;">BLOC SECURITE</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
                        <span>Mise hors service de l'instrument de detection</span>
                        <span>${this.renderCheckYN(false)}</span>
                    </div>
                    <div style="padding-left:8px;margin-bottom:2px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span>si "oui": Notification requise Dept incendie ${this.renderCheckYN(false)}</span>
                            <span>numero de téléphone <span style="border:1px solid #000;padding:0 8px;">/</span> Name <span style="border:1px solid #000;padding:0 8px;">/</span></span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1px;">
                            <span>Notification requise à l'assurance ${this.renderCheckYN(false)}</span>
                            <span style="font-size:6.5px;color:#555;">(Tel. Henkel Insurance Dept., 24h/weekend)</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1px;">
                            <span>verification que le detecteur d'incendie est étein</span>
                            <span>${this.renderCheckYN(false)}</span>
                        </div>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px dashed #aaa;padding-top:2px;">
                        <span>Surveillance de gaz pour d'éventuel gaz ou vapeurs inflammable sont necessaires durant la tache. si "oui" exposition forme X additionnel est necessaire</span>
                        <span>${this.renderCheckYN(false)}</span>
                    </div>
                </div>

                <!-- SECTION SIGNATURES VIDES POUR ÉMARGEMENT MANUEL (EXACT PHOTO) -->
                <table style="width:100%;border-collapse:collapse;margin-top:auto;border:1.5px solid #cc0000;margin-bottom:2px;">
                    <tr style="background:#fee2e2;font-size:7.5px;font-weight:900;text-align:center;">
                        <th style="border:1px solid #cc0000;padding:2px;width:38%;">CHEF DE PROJET</th>
                        <th style="border:1px solid #cc0000;padding:2px;width:38%;">HSE ENTREPRISE</th>
                        <th style="border:1px solid #cc0000;padding:2px;width:24%;">DATE / HEURE</th>
                    </tr>
                    <tr>
                        <td style="border:1px solid #cc0000;padding:3px 6px;height:38px;vertical-align:top;font-size:7.5px;">
                            <div style="font-size:6.5px;color:#555;">Nom (lettres majuscule) et signature :</div>
                            <div style="font-weight:700;font-size:8px;">${chefNom}</div>
                            <div style="margin-top:8px;font-size:7px;color:#777;">Signature : </div>
                        </td>
                        <td style="border:1px solid #cc0000;padding:3px 6px;height:38px;vertical-align:top;font-size:7.5px;">
                            <div style="font-size:6.5px;color:#555;">Nom (lettres majuscule) et signature :</div>
                            <div style="font-weight:700;font-size:8px;">${hseNom}</div>
                            <div style="margin-top:8px;font-size:7px;color:#777;">Signature : </div>
                        </td>
                        <td style="border:1px solid #cc0000;padding:3px 6px;height:38px;vertical-align:middle;font-size:7.5px;">
                            <div style="display:flex;gap:4px;align-items:center;margin-bottom:3px;">
                                <span>Date :</span>
                                <span style="border:1px solid #000;flex:1;padding:1px 3px;font-family:monospace;font-size:7.5px;">${datePermis}</span>
                            </div>
                            <div style="display:flex;gap:4px;align-items:center;">
                                <span>Heure :</span>
                                <span style="border:1px solid #000;flex:1;padding:1px 3px;font-family:monospace;font-size:7.5px;">08h10</span>
                            </div>
                        </td>
                    </tr>
                </table>

                <!-- QR CODE FOOTER DÉDIÉ -->
                ${this.renderFooterQR(permit)}
            </div>
        `;
    },

    // 5. ANNEXE C (AMBRE / JAUNE) — TRAVAIL ÉLECTRIQUE & CONSIGNATION
    // REPRODUCTION EXACTE DU STANDARD CSPS FIAT (Cadre Ambre, Logo CSPS FIAT, Checklist LOTO)
    electricAnnexe(permit) {
        const chefNom = permit.responsible || permit.chefNom || 'Xie';
        const hseNom = permit.hseNom || 'Nouri Chahrour';
        const datePermis = permit.validFrom || permit['date-main'] || '2026-08-24';

        return `
            <div class="a4-document annexe-elec-doc" id="a4-doc-${permit.id}-electric" style="border:3px solid #d97706;padding:5px 8px;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;font-size:7.5px;line-height:1.2;color:#000;">
                
                <!-- EN-TÊTE EXACT CSPS FIAT -->
                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #d97706;padding-bottom:3px;margin-bottom:3px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="background:#000;color:#fff;font-size:22px;font-weight:900;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:2px;">C</div>
                        <div style="font-size:17px;font-weight:900;color:#000;letter-spacing:0.3px;">Travail électrique &amp; Consignation</div>
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;">
                        ${this.renderLogoCSPSFIAT()}
                        <div style="border:1px solid #000;text-align:center;width:125px;">
                            <div style="font-size:7.5px;font-weight:700;border-bottom:1px solid #000;padding:1px 4px;background:#f8fafc;">Identifiant du permis</div>
                            <div style="font-size:12px;font-weight:900;padding:1px 4px;color:#000;">${permit.id || '0'}</div>
                        </div>
                    </div>
                </div>

                <div style="text-align:center;font-size:7.5px;font-weight:bold;margin-bottom:3px;color:#000;">
                    Cette liste de verification doit etre toujours accompagnée par le permis de travail de sécurité générale
                </div>

                <div style="font-style:italic;font-size:7px;margin-bottom:2px;color:#333;">
                    Cette question est pour vous aider avec votre évaluation des risques électriques (Câblage, Armoires, Moteurs &amp; LOTO).<br>
                    <strong>Type de travaux électriques</strong> (si "oui" continuer à la colonne de droite):
                </div>

                <!-- TABLEAU TYPES DE TRAVAUX ÉLECTRIQUES -->
                <table style="width:100%;border-collapse:collapse;margin-bottom:3px;font-size:7px;">
                    <tbody>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;width:34%;">Tirage de câbles / Chemins de câbles</td>
                            <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;">${this.renderCheckYN(true)}</td>
                            <td style="border:1px solid #999;padding:1.5px 3px;width:52%;">Câbles hors tension et protégés mécaniquement</td>
                            <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;">Raccordement armoire électrique BT</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            <td style="border:1px solid #999;padding:1.5px 3px;">Consignation LOTO effectuée et cadenas posés</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;" rowspan="3">Intervention moteur / variateur</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;" rowspan="3">${this.renderCheckYN(true)}</td>
                            <td style="border:1px solid #999;padding:1.5px 3px;">Vérification d'Absence de Tension (VAT 0V certifiée)</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;">Habilitations électriques des intervenants vérifiées</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;">Port d'EPI isolants (Gants 1000V, écran facial anti-arc)</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;" rowspan="3">Mise à la terre et court-circuit (MALT/CC)</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;" rowspan="3">${this.renderCheckYN(true)}</td>
                            <td style="border:1px solid #999;padding:1.5px 3px;">Dispositif MALT raccordé avant intervention</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;"><span style="border:1px solid #000;padding:0 3px;font-weight:800;">Y</span></td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;">Outillage à main isolé 1000V certifié EN 60900</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 3px;">Balisage de sécurité autour des cellules sous tension</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- SECTION MESURES DE CONSIGNATION LOTO -->
                <div style="border:1px solid #d97706;margin-bottom:3px;font-size:7px;">
                    <div style="font-weight:bold;padding:2px 4px;background:#fef3c7;border-bottom:1px solid #d97706;display:flex;justify-content:space-between;">
                        <span>Procédure de Consignation et Déconsignation (LOTO - Lockout / Tagout)</span>
                        <span>${this.renderCheckYN(true)}</span>
                    </div>
                    <table style="width:100%;border-collapse:collapse;">
                        <tr>
                            <td style="border:1px solid #999;padding:2px 4px;width:40%;">Séparation de la source d'énergie (Disjoncteur / Sectionneur ouvert)</td>
                            <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;">${this.renderCheckYN(true)}</td>
                            <td style="border:1px solid #999;padding:2px 4px;width:46%;">Condamnation mécanique par cadenas individuel</td>
                            <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:2px 4px;">Pose de la pancarte d'interdiction de manœuvre (Tagout)</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            <td style="border:1px solid #999;padding:2px 4px;">Vérification de décharge des condensateurs</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td colspan="4" style="border:1px solid #999;padding:2px 4px;">
                                Chargé de Consignation Sinylon / MOEX : <strong>Nouri Chahrour / Xie</strong> — N° Cadenas : <span style="border-bottom:1px solid #000;display:inline-block;width:35%;height:10px;">LOTO-SINY-01</span>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- SECTION CHECKLIST DE SÉCURITÉ CHANTIER ÉLECTRIQUE -->
                <table style="width:100%;border-collapse:collapse;margin-bottom:3px;font-size:7px;">
                    <tbody>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;width:92%;">Zone de tirage de câbles balisée avec ruban de signalisation et panneaux danger</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;width:8%;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">Présence d'un surveillant électricien habilité pendant les manœuvres</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">Éclairage de chantier 24V ou autonome protégé IP55</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">Extincteur CO₂ approprié pour feu électrique présent à proximité immédiate</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;"><span style="border:1px solid #000;padding:0 3px;font-weight:800;">Y</span></td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #999;padding:1.5px 4px;">Procédure d'urgence et coupure générale d'urgence localisée</td>
                            <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- SECTION SIGNATURES VIDES POUR ÉMARGEMENT MANUEL -->
                <table style="width:100%;border-collapse:collapse;margin-top:auto;border:1.5px solid #d97706;margin-bottom:2px;">
                    <tr style="background:#fef3c7;font-size:7.5px;font-weight:900;text-align:center;">
                        <th style="border:1px solid #d97706;padding:2px;width:38%;">CHEF DE PROJET</th>
                        <th style="border:1px solid #d97706;padding:2px;width:38%;">HSE ENTREPRISE / CHARGÉ CONSIGNATION</th>
                        <th style="border:1px solid #d97706;padding:2px;width:24%;">DATE / HEURE</th>
                    </tr>
                    <tr>
                        <td style="border:1px solid #d97706;padding:3px 6px;height:38px;vertical-align:top;font-size:7.5px;">
                            <div style="font-size:6.5px;color:#555;">Nom (lettres majuscule) et signature :</div>
                            <div style="font-weight:700;font-size:8px;">${chefNom}</div>
                            <div style="margin-top:8px;font-size:7px;color:#777;">Signature : </div>
                        </td>
                        <td style="border:1px solid #d97706;padding:3px 6px;height:38px;vertical-align:top;font-size:7.5px;">
                            <div style="font-size:6.5px;color:#555;">Nom (lettres majuscule) et signature :</div>
                            <div style="font-weight:700;font-size:8px;">${hseNom}</div>
                            <div style="margin-top:8px;font-size:7px;color:#777;">Signature : </div>
                        </td>
                        <td style="border:1px solid #d97706;padding:3px 6px;height:38px;vertical-align:middle;font-size:7.5px;">
                            <div style="display:flex;gap:4px;align-items:center;margin-bottom:3px;">
                                <span>Date :</span>
                                <span style="border:1px solid #000;flex:1;padding:1px 3px;font-family:monospace;font-size:7.5px;">${datePermis}</span>
                            </div>
                            <div style="display:flex;gap:4px;align-items:center;">
                                <span>Heure :</span>
                                <span style="border:1px solid #000;flex:1;padding:1px 3px;font-family:monospace;font-size:7.5px;">08h10</span>
                            </div>
                        </td>
                    </tr>
                </table>

                <!-- QR CODE FOOTER DÉDIÉ -->
                ${this.renderFooterQR(permit)}
            </div>
        `;
    }
};

if (typeof window !== 'undefined') {
    window.Templates = Templates;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Templates;
}
