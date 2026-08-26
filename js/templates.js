/**
 * SINYLON - STELLANTIS | Templates A4 Haute Fidélité V3
 * Moteur de Revalidation Journalière Dynamique (Jour par Jour à 08h00 - Protocole HSE W.P.E.E.X)
 * Emplacement QR Code sécurisé en bas de page (Footer)
 */

const Templates = {
    // Helper pour le bandeau QR en bas de page (Rendu Vectoriel SVG direct et infaillible)
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
            <div class="doc-footer-qr-verification">
                <div class="qr-verify-text">
                    <div style="font-weight: 900; font-size: 8.5px; text-transform: uppercase; color: #000; letter-spacing: 0.5px;">
                        🛡️ VÉRIFICATION ÉLECTRONIQUE / DIGITAL WORK PERMIT QR VERIFICATION
                    </div>
                    <div style="font-size: 7.5px; color: #334155; margin-top: 1px;">
                        Scannez ce QR Code pour vérifier en direct la validité journalière, les visas MOEX / W.P.E.E.X et les habilitations.
                    </div>
                    <div style="font-family: monospace; font-weight: 800; font-size: 8.5px; color: #1e3a8a; margin-top: 1px;">
                        PERMIS N° ${permit.id} · PROJET ALGERIA K9 CKD0 · STELLANTIS
                    </div>
                </div>
                <div class="qr-container qr-code-box-footer" id="doc-qr-${permit.id}" title="Scan QR Code">
                    ${svgQr}
                </div>
            </div>
        `;
    },

    // 1. PERMIS GÉNÉRAL - PAGE 1/2 (RECTO)
    generalP1(permit) {
        const d = permit.dangers || {};
        const isY = (val) => val ? 'check-active' : '';
        const isN = (val) => !val ? 'check-active' : '';

        const descFr = permit.activite_detaillee_fr || (permit.activity && (permit.activity.fr || permit.activity.en)) || permit['work-desc'] || permit.title || 'Installation Mécanique et Montage';
        const descEn = permit.activite_detaillee_en || (permit.activity && permit.activity.en) || permit.title_en || 'Mechanical and Assembly Installation';
        const descZh = permit.activite_detaillee_zh || (permit.activity && permit.activity.zh) || permit.title_zh || '机械装配与设备安装';
        const equipementsStr = Array.isArray(permit.equipements_a_installer) ? permit.equipements_a_installer.join(', ') : (permit.equipements_a_installer || 'Nacelles ciseaux (x6), Palans DEMAG KBK, Outillages certifiés');

        // Générer les vignettes d'intervenants
        const workers = permit.travailleurs || permit.workers || ['Xie (Chef de Projet)', 'Nouri Chahrour (HSE Sinylon)'];
        const workersHtml = workers.map(w => {
            const nom = typeof w === 'object' ? w.nom : w;
            const role = typeof w === 'object' ? w.role : 'Intervenant';
            return `<span class="worker-tag"><strong>${nom}</strong> <small>(${role})</small></span>`;
        }).join(' ');

        return `
            <div class="a4-document" id="doc-${permit.id}-p1">
                <!-- En-tête Logos & Titre Officiel -->
                <div class="doc-header">
                    <div class="doc-logo">
                        <div class="logo-sinylon">SINYLON</div>
                        <div class="logo-stellantis">STELLANTIS</div>
                    </div>
                    <div class="doc-title-container">
                        <div class="doc-title-main">PERMIS GENERAL DE TRAVAIL</div>
                        <div class="doc-title-sub">GENERAL WORK PERMIT / 通用作业许可证</div>
                    </div>
                    <div class="doc-permit-number">
                        <div class="permit-label">PERMIS N°</div>
                        <div class="permit-value" contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'id', this.innerText)">${permit.id}</div>
                    </div>
                </div>

                <!-- Validité & Date d'émission (Bande Jaune) -->
                <div class="yellow-grid-3">
                    <div>
                        <div class="yellow-bar-header">Date d'émission:</div>
                        <div class="doc-box-bordered" contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'date-main', this.innerText)">${permit.validFrom || permit['date-main'] || '2026-08-24'}</div>
                    </div>
                    <div>
                        <div class="yellow-bar-header">Période de validité du permis:</div>
                        <div class="doc-box-bordered" style="color: #1e3a8a; font-weight: 800;">
                            Du: <span contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'date-main', this.innerText)">${permit.validFrom || permit['date-main'] || '2026-08-24'}</span> 
                            Au: <span contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'date_fin', this.innerText)">${permit.validUntil || permit['date_fin'] || '2026-08-30'}</span>
                        </div>
                    </div>
                    <div>
                        <div class="yellow-bar-header">Horaires autorisés:</div>
                        <div class="doc-box-bordered" style="font-weight: 800;">
                            De: <span>${permit.timeStart || permit['time-start'] || '08h00'}</span> 
                            À: <span>${permit.timeEnd || permit['time-end'] || '17h30'}</span>
                        </div>
                    </div>
                </div>

                <!-- Brève description du travail (Bande Jaune) -->
                <div class="yellow-bar-header">Bréve description du travail & Activités de la zone / Brief work description (UB / UAR / FUSA)</div>
                <div class="doc-box-bordered" style="min-height: 38px; font-size: 8px;">
                    <div style="font-weight: 600;"><strong>FR :</strong> <span contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'work-desc', this.innerText)">${descFr}</span></div>
                    <div style="font-size: 7.5px; color: #1e3a8a; font-style: italic; margin-top: 1px;"><strong>EN :</strong> <span contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'work-desc-en', this.innerText)">${descEn}</span></div>
                    <div style="font-size: 7.5px; color: #047857; margin-top: 1px;"><strong>ZH :</strong> ${descZh}</div>
                </div>

                <!-- Endroit de travail & Équipement/Machinerie (Bande Jaune 2 colonnes) -->
                <div class="yellow-grid-2" style="margin-top: 4px;">
                    <div class="yellow-bar-header" style="border-right: none;">Endroit de travail & Zone(s) d'implantation :</div>
                    <div class="yellow-bar-header">Équipements & Installations à poser dans la zone :</div>
                </div>
                <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 0;">
                    <div class="doc-box-bordered" style="border-right: none; font-size: 8px;">
                        <strong>Bâtiment :</strong> ${permit.location || 'Hall Montage / Usine Stellantis'}<br>
                        <strong>Secteur :</strong> ${permit.ouvrage || 'Ligne Assemblage K9 CKD0'}<br>
                        <strong>ZONE(S) :</strong> <span style="color: #1e3a8a; font-weight: 800;">${permit.zone || 'UB / UAR / FUSA'}</span>
                    </div>
                    <div class="doc-box-bordered" style="font-size: 7.5px; line-height: 1.25;">
                        <strong>Équipements à installer :</strong><br>
                        <span style="color: #0f172a; font-weight: 600;">${equipementsStr}</span>
                    </div>
                </div>

                <!-- Entreprise Intervenante & Contacts -->
                <div style="display: grid; grid-template-columns: 1.4fr 1fr; margin-top: 4px;">
                    <div class="doc-box-bordered" style="border-right: none;">
                        <strong>Entreprise Intervenante :</strong> <span contenteditable="true" style="font-weight: bold;" onblur="App.updatePermitField('${permit.id}', 'company', this.innerText)">${permit.contractor || permit.company || 'SINYLON'}</span><br>
                        Avant de commencer le travail, veuillez contacter :<br>
                        <strong>Chef de Projet :</strong> <span contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'chef-nom', this.innerText)">${permit.chefNom || permit['chef-nom'] || 'Xie (Chef de Projet)'}</span>
                    </div>
                    <div class="doc-box-bordered">
                        <div style="display: flex; justify-content: space-between;">
                            <span>Plan d'urgence du site attaché :</span>
                            <span class="check-yn"><span>Y</span><span class="check-active">N</span></span>
                        </div>
                        <strong>Ouvrage :</strong> <span contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'ouvrage', this.innerText)">${permit.ouvrage || 'Stellantis'}</span> 
                        <strong>ZONE :</strong> <span contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'zone', this.innerText)">${permit.zone || 'Zone 4'}</span><br>
                        <strong>Tél. HSE :</strong> <span contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'tel', this.innerText)">${permit.tel || '0563765157'}</span>
                    </div>
                </div>

                <!-- Équipe & Intervenants autorisés -->
                <div class="doc-workers-box" style="margin-top: 4px;">
                    <div class="doc-workers-header">
                        <span>👥 INTERVENANTS AUTORISÉS (CHEF DE PROJET & HSE)</span>
                        <button type="button" class="btn-add-worker-mini no-print" onclick="App.promptAddWorker('${permit.id}')">+ AJOUTER UN NOM</button>
                    </div>
                    <div class="doc-workers-tags">${workersHtml}</div>
                </div>

                <!-- Grille d'Analyse des Grands Dangers -->
                <div style="margin-top: 4px; font-weight: bold; font-size: 8.5px;">
                    si oui, la liste de verification des grands danger suivante doit être attachée :
                </div>
                <table class="doc-table-exact">
                    <tr>
                        <td style="width: 50%;">
                            <div style="display: flex; justify-content: space-between; align-items: center;" onclick="App.toggleHazard('${permit.id}', 'height')">
                                <span>Travail en hauteur</span>
                                <div>
                                    <span class="check-yn"><span class="${isY(d.height)}">.Y.</span><span class="${isN(d.height)}">N</span></span>
                                    <strong style="margin-left: 4px;">A</strong>
                                </div>
                            </div>
                        </td>
                        <td style="width: 50%;">
                            <div style="display: flex; justify-content: space-between; align-items: center;" onclick="App.toggleHazard('${permit.id}', 'hot')">
                                <span>Travail à chaud</span>
                                <div>
                                    <span class="check-yn"><span class="${isY(d.hot)}">.Y.</span><span class="${isN(d.hot)}">N</span></span>
                                    <strong style="margin-left: 4px;">B</strong>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style="display: flex; justify-content: space-between; align-items: center;" onclick="App.toggleHazard('${permit.id}', 'electric')">
                                <span>Travail Électrique</span>
                                <div>
                                    <span class="check-yn"><span class="${isY(d.electric)}">.Y.</span><span class="${isN(d.electric)}">N</span></span>
                                    <strong style="margin-left: 4px;">C</strong>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div style="display: flex; justify-content: space-between; align-items: center;" onclick="App.toggleHazard('${permit.id}', 'confined')">
                                <span>Espace confiné</span>
                                <div>
                                    <span class="check-yn"><span class="${isY(d.confined)}">.Y.</span><span class="${isN(d.confined)}">N</span></span>
                                    <strong style="margin-left: 4px;">D</strong>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style="display: flex; justify-content: space-between; align-items: center;" onclick="App.toggleHazard('${permit.id}', 'excavation')">
                                <span>Excavation</span>
                                <div>
                                    <span class="check-yn"><span class="${isY(d.excavation)}">.Y.</span><span class="${isN(d.excavation)}">N</span></span>
                                    <strong style="margin-left: 4px;">E</strong>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div style="display: flex; justify-content: space-between; align-items: center;" onclick="App.toggleHazard('${permit.id}', 'tension')">
                                <span>Tension ou rupture de conduite</span>
                                <div>
                                    <span class="check-yn"><span class="${isY(d.tension)}">.Y.</span><span class="${isN(d.tension)}">N</span></span>
                                    <strong style="margin-left: 4px;">F</strong>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>

                <div style="display: flex; justify-content: space-between; align-items: center; border: 1px solid #000; padding: 2px 6px; margin-top: 4px; font-size: 8.5px;">
                    <div>
                        Est ce que l'analyse des risques de travail / la méthode d'exécution est requise ?
                        <span class="check-yn" style="margin-left: 6px;"><span class="check-active">.Y.</span><span>N</span></span>
                    </div>
                    <div>
                        Si oui, Ref. Nr. / Id. : <strong contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'method-ref', this.innerText)">${permit['method-ref'] || 'SINY-MOS-K9-01'}</strong>
                    </div>
                </div>

                <!-- Validité du permis et signatures initiales (Jour 1 Lundi) -->
                <div style="margin-top: 4px; border: 1.5px solid #000; padding: 4px 6px;">
                    <div style="font-weight: bold; font-size: 9.5px; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 4px;">
                        validité du permis et signatures initiales (Jour 1)
                    </div>
                    <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 4px; font-size: 9px;">
                        <div>Date initiale : <span style="border-bottom: 1px solid #000; font-weight: bold; padding: 0 8px;" contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'date-main', this.innerText)">${permit.validFrom || permit['date-main'] || '2026-08-24'}</span></div>
                        <div>heure début : <span style="border-bottom: 1px solid #000; font-weight: bold; padding: 0 8px;" contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'time-start', this.innerText)">${permit.timeStart || permit['time-start'] || '08h00'}</span></div>
                        <div>heure fin : <span style="border-bottom: 1px solid #000; font-weight: bold; padding: 0 8px;" contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'time-end', this.innerText)">${permit.timeEnd || permit['time-end'] || '17h30'}</span></div>
                    </div>

                    <!-- Signatures Officielles -->
                    <div class="signatures-grid-exact">
                        <div class="sign-card-exact">
                            <div class="sign-card-header">Chef de Projet Entreprise</div>
                            <div style="font-size: 8px;">Nom : <strong>${permit.chefNom || permit['chef-nom'] || 'Xie (Chef de Projet)'}</strong></div>
                            <div style="font-size: 8px; color: #2563eb; font-weight: bold;">Signature : Xie (Validé ✓)</div>
                        </div>
                        <div class="sign-card-exact wpeex-sign">
                            <div class="sign-card-header">W.P.E.E.X - Ingénieur de Suivi</div>
                            <div style="font-size: 8px;">Nom : <strong>${permit.wpeexNom || permit['wpeex-nom'] || 'M. W.P.E.E.X'}</strong></div>
                            <div style="font-size: 8px; color: #1d4ed8; font-weight: bold;">Visa Initial : W.P.E.E.X ✓</div>
                        </div>
                        <div class="sign-card-exact">
                            <div class="sign-card-header">Superviseur HSE</div>
                            <div style="font-size: 8px;">Nom : <strong>${permit.hseNom || permit['hse-nom'] || 'Nouri Chahrour (HSE Sinylon)'}</strong></div>
                            <div class="sign-legal-note">Précautions et conformité HSE validées.</div>
                        </div>
                        <div class="sign-card-exact">
                            <div class="sign-card-header">Receveur / Chef d'Équipe</div>
                            <div style="font-size: 8px;">Nom : <strong>${permit.chefEquipe || permit.chef_equipe || 'Xian'}</strong></div>
                            <div class="sign-legal-note">Équipe briefée, consignes de sécurité appliquées.</div>
                        </div>
                    </div>
                </div>

                <!-- QR CODE FOOTER DÉDIÉ -->
                ${this.renderFooterQR(permit)}
            </div>
        `;
    },

    // 2. PERMIS GÉNÉRAL - PAGE 2/2 (VERSO REVALIDATIONS DYNAMIQUES DU JOUR 2 AU JOUR 7 À 08H00)
    generalP2(permit) {
        const dStart = permit.validFrom || permit['date-main'] || '2026-08-24';
        const startDate = new Date(dStart);
        
        // Données des revalidations enregistrées
        const revals = permit.revalidations || [];
        const revalMap = {};
        revals.forEach(r => {
            if (r.dayIndex) revalMap[r.dayIndex] = r;
            else if (r.date) revalMap[r.date] = r;
        });

        const dayNames = [
            { dayIndex: 2, name: 'Jour 2 (Mardi)', offset: 1, isWeekend: false },
            { dayIndex: 3, name: 'Jour 3 (Mercredi)', offset: 2, isWeekend: false },
            { dayIndex: 4, name: 'Jour 4 (Jeudi)', offset: 3, isWeekend: false },
            { dayIndex: 5, name: 'Jour 5 (Vendredi)', offset: 4, isWeekend: true },
            { dayIndex: 6, name: 'Jour 6 (Samedi)', offset: 5, isWeekend: true },
            { dayIndex: 7, name: 'Jour 7 (Dimanche)', offset: 6, isWeekend: false }
        ];

        const rows = dayNames.map(dayInfo => {
            const targetDate = new Date(startDate);
            targetDate.setDate(startDate.getDate() + dayInfo.offset);
            const dateStr = targetDate.toISOString().split('T')[0];
            
            const existing = revalMap[dayInfo.dayIndex] || revalMap[dateStr];
            const isValidated = !!existing;
            const timeValidated = existing ? (existing.time || '08:00') : '08:00';

            return `
                <tr>
                    <td class="text-center bold-cell">${dayInfo.name}</td>
                    <td class="text-center" style="font-family: monospace;">${dateStr}</td>
                    <td>${isValidated ? 'M. W.P.E.E.X' : '<span style="color:#94a3b8;">—</span>'}</td>
                    <td>${isValidated ? 'Ingénieur Suivi' : '<span style="color:#94a3b8;">—</span>'}</td>
                    <td class="text-center">
                        ${isValidated 
                            ? `<span style="font-weight: 800; color: #1e3a8a;">VISA W.P.E.E.X ✓ (${timeValidated})</span>`
                            : `<span style="color: #64748b; font-style: italic;">En attente 08h00</span>`
                        }
                    </td>
                    <td>${isValidated ? 'Xie' : '<span style="color:#94a3b8;">—</span>'}</td>
                    <td>${isValidated ? 'Chef de Projet' : '<span style="color:#94a3b8;">—</span>'}</td>
                    <td class="text-center">
                        ${isValidated 
                            ? `<span style="font-weight: 800; color: #2563eb;">SIGNÉ ✓ (${timeValidated})</span>`
                            : `<span style="color: #64748b; font-style: italic;">Non signé</span>`
                        }
                    </td>
                    <td class="no-print text-center">
                        ${isValidated 
                            ? `<span class="badge badge-success" style="font-size: 8px;">VALIDÉ 08:00</span>`
                            : `<button type="button" class="btn btn-xs btn-primary" onclick="App.validateDayMorning('${permit.id}', ${dayInfo.dayIndex}, '${dateStr}')">⚡ Valider 08h00</button>`
                        }
                    </td>
                </tr>
            `;
        });

        return `
            <div class="a4-document" id="a4-doc-${permit.id}-p2">
                <div class="doc-header-exact">
                    <div class="doc-logo-box">
                        <span class="logo-sinylon-badge">SINYLON</span>
                        <span class="logo-stellantis-badge">STELLANTIS</span>
                    </div>
                    <div class="doc-title-exact">
                        Revalidation Quotidienne du Permis de Travail<br>
                        <span style="font-size: 8px; font-weight: normal;">Daily Work Permit Revalidation Sheet (Contrôle du Lendemain à 08h00)</span>
                    </div>
                    <div class="doc-header-right-group">
                        <div class="doc-id-box-exact">
                            <strong>Permit ID</strong><br>
                            <span style="font-size: 12px; font-weight: 900; color: #1e3a8a;">${permit.id}</span>
                        </div>
                    </div>
                </div>

                <div class="no-print" style="margin-top: 6px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 6px 12px; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
                    <div style="color: #166534; font-weight: 600;">
                        📋 <strong>Protocole Chantier :</strong> Chaque matin à 08h00, l'ingénieur W.P.E.E.X et le Chef de Projet Xie revalident les conditions de sécurité.
                    </div>
                    <div>
                        <button type="button" class="btn btn-sm btn-secondary" onclick="App.signAllRevalidations('${permit.id}')">✍️ Signer Tout Jusqu'à Aujourd'hui</button>
                    </div>
                </div>

                <div class="yellow-bar-header" style="margin-top: 8px;">REVALIDATION QUOTIDIENNE DU PERMIS (CONTRÔLE LE LENDEMAIN À 08H00)</div>
                <table class="doc-table-exact" style="margin-top: 4px;">
                    <thead>
                        <tr>
                            <th rowspan="2" style="width: 105px;">JOURNÉE</th>
                            <th rowspan="2" style="width: 80px;">DATE</th>
                            <th colspan="3">W.P.E.E.X - Ingénieur de Suivi</th>
                            <th colspan="3">Responsable d'exécution (SINYLON)</th>
                            <th rowspan="2" class="no-print" style="width: 90px;">ACTION</th>
                        </tr>
                        <tr>
                            <th>Nom</th>
                            <th>Fonction</th>
                            <th>Visa & Heure</th>
                            <th>Nom</th>
                            <th>Fonction</th>
                            <th>Signature & Heure</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.join('')}
                    </tbody>
                </table>

                <div class="yellow-bar-header" style="margin-top: 16px;">SUPERVISION SPÉCIALE CAISSE WEEK-END (VENDREDI / SAMEDI)</div>
                <table class="doc-table-exact" style="margin-top: 4px;">
                    <thead>
                        <tr>
                            <th style="width: 80px;">JOURNÉE</th>
                            <th style="width: 90px;">DATE</th>
                            <th>SUPERVISEUR W.P.E.E.X</th>
                            <th>CONTRÔLE DE SÉCURITÉ (08H00)</th>
                            <th>DOSSIER CAISSE STELLANTIS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="text-center bold-cell">Vendredi</td>
                            <td class="text-center" style="font-family: monospace;">2026-08-28</td>
                            <td>M. W.P.E.E.X</td>
                            <td>Vérification 360°, Nacelles, Extincteurs, Balisage</td>
                            <td class="text-center" style="font-weight: 800; color: #15803d;">AUTORISÉ CAISSE WEEK-END ✓</td>
                        </tr>
                        <tr>
                            <td class="text-center bold-cell">Samedi</td>
                            <td class="text-center" style="font-family: monospace;">2026-08-29</td>
                            <td>M. W.P.E.E.X</td>
                            <td>Vérification 360°, Nacelles, Extincteurs, Balisage</td>
                            <td class="text-center" style="font-weight: 800; color: #15803d;">AUTORISÉ CAISSE WEEK-END ✓</td>
                        </tr>
                    </tbody>
                </table>

                <!-- QR CODE FOOTER DÉDIÉ -->
                ${this.renderFooterQR(permit)}
            </div>
        `;
    },

    // 3. ANNEXE A (BLEUE) — TRAVAIL EN HAUTEUR (conforme formulaire CSPS FIAT réel)
    heightAnnexe(permit) {
        const h = permit.annexeA || {};
        const yn = (v, field) => `
            <span style="display:inline-flex;gap:2px;">
                <span style="border:1px solid #000;padding:0 3px;font-size:7.5px;font-weight:800;background:${v===true?'#000':'#fff'};color:${v===true?'#fff':'#000'};">Y</span>
                <span style="border:1px solid #000;padding:0 3px;font-size:7.5px;font-weight:800;background:${v===false?'#000':'#fff'};color:${v===false?'#fff':'#000'};">N</span>
            </span>`;
        const ynR = (v) => yn(v); // alias court
        const chefNom = permit.responsible || permit.chefNom || 'Xie';
        const hseNom = permit.hseNom || 'Nouri Chahrour';
        const datePermis = permit.validFrom || permit['date-main'] || new Date().toISOString().slice(0,10);

        return `
            <div class="a4-document annexe-height-doc" id="a4-doc-${permit.id}-height" style="font-size:8px;line-height:1.4;">

                <!-- EN-TÊTE CSPS FIAT -->
                <div style="display:grid;grid-template-columns:1fr auto auto;align-items:center;border:2px solid #1e3a8a;margin-bottom:4px;">
                    <div style="padding:4px 8px;">
                        <div style="background:#1e3a8a;color:#fff;font-weight:900;font-size:14px;display:inline-block;padding:2px 8px;">A</div>
                        <span style="font-size:13px;font-weight:900;margin-left:6px;color:#1e3a8a;">Travail en hauteur</span>
                        <div style="font-size:7px;font-weight:600;color:#1e3a8a;margin-top:1px;">CSPS <strong>FIAT</strong></div>
                        <div style="font-size:7px;color:#444;margin-top:1px;">Cette liste de vérification doit être toujours accompagnée par le permis de travail de sécurité générale</div>
                    </div>
                    <div style="border-left:1px solid #1e3a8a;padding:4px 8px;text-align:center;">
                        <div style="font-size:7px;font-weight:700;">Identifiant du permis</div>
                        <div style="font-size:14px;font-weight:900;color:#1e3a8a;">${permit.id}</div>
                    </div>
                </div>

                <!-- NOTE INTRO -->
                <div style="border:1px solid #1e3a8a;padding:3px 6px;margin-bottom:3px;font-style:italic;font-size:7.5px;color:#1e3a8a;">
                    Cette question est pour vous aider avec votre évaluation des risques.<br>
                    <strong>Usage de</strong> (si "oui" continuer à la colonne de droite):
                </div>

                <!-- TABLEAU ÉQUIPEMENTS -->
                <table style="width:100%;border-collapse:collapse;margin-bottom:3px;">
                    <thead>
                        <tr style="background:#1e3a8a;color:#fff;">
                            <th style="padding:2px 4px;font-size:7.5px;width:38%;border:1px solid #1e3a8a;">Type d'équipement</th>
                            <th style="padding:2px 4px;font-size:7.5px;width:8%;border:1px solid #1e3a8a;text-align:center;">Y/N</th>
                            <th style="padding:2px 4px;font-size:7.5px;width:46%;border:1px solid #1e3a8a;">Vérification requise si OUI</th>
                            <th style="padding:2px 4px;font-size:7.5px;width:8%;border:1px solid #1e3a8a;text-align:center;">Y/N</th>
                        </tr>
                    </thead>
                    <tbody style="font-size:7.5px;">
                        <tr>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Échaffaudage fixe</td>
                            <td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.echafaud_fixe)}</td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Approuvé et caché par le personnel qualifié</td>
                            <td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.echafaud_fixe_ok)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Échaffaudage mobile</td>
                            <td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.echafaud_mobile)}</td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Approuvé et caché par le personnel qualifié</td>
                            <td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.echafaud_mobile_ok)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #aaa;padding:2px 4px;" rowspan="4">Élévateur de plateforme mobile (PEMP / Nacelle)</td>
                            <td style="border:1px solid #aaa;padding:2px;text-align:center;" rowspan="4">${ynR(h.elevateur ?? true)}</td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">L'opérateur et le travailleur entraînés</td>
                            <td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.elevateur_forme ?? true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Order to use given in written</td>
                            <td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.elevateur_order ?? true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Port d'équipement d'arrêt de chute</td>
                            <td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.elevateur_harnais ?? true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #aaa;padding:2px 4px;">6 Nacelles ciseaux + 1 Manlift PEMP — VGP valide</td>
                            <td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.vgp ?? true)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #aaa;padding:2px 4px;" rowspan="4">Échelle</td>
                            <td style="border:1px solid #aaa;padding:2px;text-align:center;" rowspan="4">${ynR(h.echelle)}</td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Aucun autre équipement ne peut être utilisé — Utilisé pour des activités à court terme</td>
                            <td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.echelle_court_terme)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Avec un potentiel de danger minimum</td>
                            <td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.echelle_danger_min)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Vérifier et cacheter</td>
                            <td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.echelle_verif)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Travailleur entraîné dans l'usage</td>
                            <td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.echelle_forme)}</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Équipement d'arrêt de chute requis ?</td>
                            <td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.antichute ?? true)}</td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Vérifier avant de commencer le travail — Moyens d'attachement définis par le personnel qualifié</td>
                            <td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.antichute_verif ?? true)}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- TRAVAIL SUR TOIT -->
                <div style="border:1.5px solid #1e3a8a;margin-bottom:3px;">
                    <div style="background:#1e3a8a;color:#fff;font-weight:800;font-size:8px;padding:2px 6px;">Travail sur toit</div>
                    <table style="width:100%;border-collapse:collapse;">
                        <tr style="font-size:7.5px;">
                            <td style="border:1px solid #aaa;padding:2px 4px;width:40%;">Capacité de Charge du toit suffisante à supporter</td>
                            <td style="border:1px solid #aaa;padding:2px;width:8%;text-align:center;">${ynR(h.toit_charge)}</td>
                            <td style="border:1px solid #aaa;padding:2px 4px;width:38%;">Endroit coordonné fermé</td>
                            <td style="border:1px solid #aaa;padding:2px;width:8%;text-align:center;">${ynR(h.toit_ferme)}</td>
                        </tr>
                        <tr style="font-size:7.5px;">
                            <td style="border:1px solid #aaa;padding:2px 4px;">Présence d'une toiture fragile à proximité du site</td>
                            <td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.toit_fragile)}</td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Protection de chute / Protection de bord existante ?</td>
                            <td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.toit_protection)}</td>
                        </tr>
                        <tr style="font-size:7.5px;">
                            <td colspan="4" style="border:1px solid #aaa;padding:2px 4px;">Mesures additionnelles : <span style="border-bottom:1px solid #000;display:inline-block;width:70%;"> </span></td>
                        </tr>
                    </table>
                </div>

                <!-- CHECKLIST GÉNÉRALE -->
                <table style="width:100%;border-collapse:collapse;margin-bottom:3px;">
                    <tbody style="font-size:7.5px;">
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;width:88%;">Endroit de travail barré pour véhicules / traffic / piétons</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.balisage ?? true)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Obstacles sur ou à proximité du site de travail (conduit de câble, câbles seuls, tuyauteries, etc.)</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.obstacles)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Conduits d'aération, cheminées, échappements qui peuvent émettre des substances chaudes/odorantes/dangereuses</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.ventilation)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Parties d'équipement de l'usine à protéger</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.protec_equipement)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Issue de secours d'urgence</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.issue_secours ?? true)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Matériels / outils qui a besoin d'être déplacé</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.materiel_deplace)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Directives de sécurité nécessaires</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.directives ?? true)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Autres : <span style="border-bottom:1px solid #000;display:inline-block;width:60%;"> </span></td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${ynR(h.autres)}</td></tr>
                    </tbody>
                </table>

                <!-- CONDITIONS AMBIANTES -->
                <div style="border:1.5px solid #1e3a8a;margin-bottom:4px;">
                    <div style="background:#1e3a8a;color:#fff;font-weight:800;font-size:8px;padding:2px 6px;">Conditions ambiantes au moment du travail</div>
                    <div style="font-size:7px;padding:2px 6px;color:#555;font-style:italic;">NOTE: Permis doit être revu si les conditions se détériorent.</div>
                    <table style="width:100%;border-collapse:collapse;">
                        <tr style="font-size:7.5px;">
                            <td style="border:1px solid #aaa;padding:2px 4px;width:20%;font-weight:700;">Visibilité générale</td>
                            <td colspan="7" style="border:1px solid #aaa;padding:2px;"></td>
                        </tr>
                        <tr style="font-size:7.5px;">
                            <td style="border:1px solid #aaa;padding:2px 4px;font-weight:700;">Pluie</td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">claire <strong>Y</strong></td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Amoindrit <strong>Y</strong></td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Sombre <strong>Y</strong></td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">obscure <strong>Y</strong></td>
                            <td colspan="3" style="border:1px solid #aaa;padding:2px;"></td>
                        </tr>
                        <tr style="font-size:7.5px;">
                            <td style="border:1px solid #aaa;padding:2px 4px;font-weight:700;">Surface du site de travail</td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">aucune <strong>Y</strong></td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">légère <strong>Y</strong></td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">modérée <strong>Y</strong></td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Forte <strong>Y</strong></td>
                            <td colspan="3" style="border:1px solid #aaa;padding:2px;"></td>
                        </tr>
                        <tr style="font-size:7.5px;">
                            <td style="border:1px solid #aaa;padding:2px 4px;font-weight:700;">Vent</td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">sec <strong>Y</strong></td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Mouillé <strong>Y</strong></td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">glissante <strong>Y</strong></td>
                            <td style="border:1px solid #aaa;padding:2px 4px;"></td>
                            <td colspan="3" style="border:1px solid #aaa;padding:2px;"></td>
                        </tr>
                        <tr style="font-size:7.5px;">
                            <td style="border:1px solid #aaa;padding:2px 4px;font-weight:700;">Surface glissante</td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">aucun <strong>Y</strong></td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Légère <strong>Y</strong></td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Modéré <strong>Y</strong></td>
                            <td style="border:1px solid #aaa;padding:2px 4px;">Fort <strong>Y</strong></td>
                            <td colspan="3" style="border:1px solid #aaa;padding:2px;"></td>
                        </tr>
                        <tr style="font-size:7.5px;">
                            <td colspan="8" style="border:1px solid #aaa;padding:2px 4px;">Surface de travail glissante suite au déversement des huiles et des produits chimiques ? ${ynR(h.surface_glissante)}</td>
                        </tr>
                        <tr style="font-size:7.5px;">
                            <td colspan="8" style="border:1px solid #aaa;padding:2px 4px;">Mesures additionnelles : <strong>Porter obligatoire Casques anti choc et Ceinture de Sécurité</strong></td>
                        </tr>
                    </table>
                </div>

                <!-- SIGNATURES -->
                <table style="width:100%;border-collapse:collapse;margin-top:4px;">
                    <tr>
                        <td style="border:2px solid #1e3a8a;padding:6px;width:50%;vertical-align:top;">
                            <div style="font-size:8px;font-weight:800;background:#1e3a8a;color:#fff;padding:2px 4px;margin-bottom:4px;">CHEF DE PROJET</div>
                            <div style="font-size:7.5px;">Nom : <strong>${chefNom}</strong></div>
                            <div style="font-size:7.5px;margin-top:4px;">Signature : <span style="border-bottom:1px solid #000;display:inline-block;width:60%;"> </span></div>
                        </td>
                        <td style="border:2px solid #1e3a8a;padding:6px;width:30%;vertical-align:top;">
                            <div style="font-size:8px;font-weight:800;background:#1e3a8a;color:#fff;padding:2px 4px;margin-bottom:4px;">HSE ENTREPRISE</div>
                            <div style="font-size:7.5px;">Nom : <strong>${hseNom}</strong></div>
                            <div style="font-size:7.5px;margin-top:4px;">Signature : <span style="border-bottom:1px solid #000;display:inline-block;width:55%;"> </span></div>
                        </td>
                        <td style="border:2px solid #1e3a8a;padding:6px;width:20%;vertical-align:top;">
                            <div style="font-size:7.5px;">Date : <strong>${datePermis}</strong></div>
                            <div style="font-size:7.5px;margin-top:4px;">Heure : <strong>${permit.timeStart || '08h00'}</strong></div>
                        </td>
                    </tr>
                </table>

                <!-- QR FOOTER -->
                ${this.renderFooterQR(permit)}
            </div>
        `;
    },

    // 4. ANNEXE B (ROUGE) — TRAVAIL À CHAUD (conforme formulaire CSPS FIAT réel)
    hotAnnexe(permit) {
        const b = permit.annexeB || {};
        const yn = (v) => `
            <span style="display:inline-flex;gap:2px;">
                <span style="border:1px solid #000;padding:0 3px;font-size:7.5px;font-weight:800;background:${v===true?'#b91c1c':'#fff'};color:${v===true?'#fff':'#000'};">Y</span>
                <span style="border:1px solid #000;padding:0 3px;font-size:7.5px;font-weight:800;background:${v===false?'#b91c1c':'#fff'};color:${v===false?'#fff':'#000'};">N</span>
            </span>`;
        const chefNom = permit.responsible || permit.chefNom || 'Xie';
        const hseNom = permit.hseNom || 'Nouri Chahrour';
        const datePermis = permit.validFrom || permit['date-main'] || new Date().toISOString().slice(0,10);

        return `
            <div class="a4-document annexe-hot-doc" id="a4-doc-${permit.id}-hot" style="font-size:8px;line-height:1.4;">

                <!-- EN-TÊTE CSPS FIAT -->
                <div style="display:grid;grid-template-columns:1fr auto;align-items:center;border:2px solid #b91c1c;margin-bottom:4px;">
                    <div style="padding:4px 8px;">
                        <div style="background:#b91c1c;color:#fff;font-weight:900;font-size:14px;display:inline-block;padding:2px 8px;">B</div>
                        <span style="font-size:13px;font-weight:900;margin-left:6px;color:#b91c1c;">Travail chaud</span>
                        <div style="font-size:7px;font-weight:600;color:#b91c1c;margin-top:1px;">CSPS <strong>FIAT</strong></div>
                        <div style="font-size:7px;color:#444;margin-top:1px;">La liste de vérification doit être toujours accompagnée par le permis de travail de sécurité générale</div>
                    </div>
                    <div style="border-left:1px solid #b91c1c;padding:4px 10px;text-align:center;">
                        <div style="font-size:7px;font-weight:700;">Permit Identifier</div>
                        <div style="font-size:14px;font-weight:900;color:#b91c1c;">${permit.id}</div>
                    </div>
                </div>

                <!-- CHECKLIST PRINCIPALE Y/N -->
                <table style="width:100%;border-collapse:collapse;margin-bottom:4px;">
                    <tbody style="font-size:7.5px;">
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;width:88%;">Tous les produits inflammable ou combustible seront dégagés au minimum <strong>10 m</strong> du lieu d'intervention — Si le déplacement n'est pas possible, les produits inflammable ou combustible seront protégés and/or fire resistant curtains or covers</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${yn(b.degagement_10m ?? true)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Tous débris, saleté, ou poussière est enlevé — environnement de travail incluant les vaissaux, tuyauterie, derrière des murs etc. — vérifiyer pour ou dissimulation de produit inflammable ou combustible</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${yn(b.debris_enleve ?? true)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Présence dans un étage/autre structure combustible — si "oui" spécifier les précautions entreprises (e.g. arrosage avec l'eau, couverture avec de l'inerte matériaux): <span style="border-bottom:1px solid #000;display:inline-block;width:35%;"> </span></td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${yn(b.etage_combustible)}</td></tr>
                        <tr style="background:#fee2e2;"><td style="border:1px solid #aaa;padding:2px 4px;font-weight:700;">Couvrir tous les matériaux sont inflammés hors le lieu d'intervention</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${yn(b.couvrir_materiaux ?? true)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Couvertures résistantes au feu / écran équipé à résister aux étincelles</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${yn(b.couvertures_feu ?? true)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Fermetures des vannes, égouts, couvercles etc. automatiquement ouvrables</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${yn(b.vannes_ferme ?? true)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Isolement sûr des conduits / convoyeurs / systèmes d'échapement qui peuvent resulter sur étincelles</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${yn(b.isolement_conduits ?? true)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Couverture des trous et égouts (joints scellés, fentes, ouvertures, conduits, etc.)</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${yn(b.couverture_trous ?? true)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Ventilation suffisante sur le lieu de travail (naturel <strong>Y</strong> — technique <strong>Y</strong>)</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${yn(b.ventilation ?? true)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Appareils électrique et câbles protégés</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${yn(b.cables_proteges ?? true)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Tous les équipements, tuyauteries, matériels de voisinnage sont protégés</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${yn(b.equipements_proteges ?? true)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Pour les travaux en hauteur ou treillis, des protection supplémentaires sont fournies pour les endroits</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${yn(b.protection_hauteur ?? true)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Le Site du travail est marqué / posté et barricadé adéquatement</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${yn(b.site_balise ?? true)}</td></tr>
                        <tr><td style="border:1px solid #aaa;padding:2px 4px;">Une gaz surveillance est nécessaire avant l'entame du travail pour gaz ou vapeurs inflammables — si "oui" exposition forme X additionnel est nécessaire</td><td style="border:1px solid #aaa;padding:2px;text-align:center;">${yn(b.surveillance_gaz)}</td></tr>
                        <tr><td colspan="2" style="border:1px solid #aaa;padding:2px 4px;font-size:7px;font-style:italic;">NB: Isolation sûre de l'équipements / lignes a besoin d'isolation forme I additionnel</td></tr>
                    </tbody>
                </table>

                <!-- ÉQUIPEMENT ANTI-FEU + SIGNATURE HSE -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:4px;">
                    <div style="border:1.5px solid #b91c1c;padding:4px;">
                        <div style="font-weight:800;font-size:8px;margin-bottom:3px;">Équipement de lutte anti feu fourni</div>
                        <table style="width:100%;border-collapse:collapse;">
                            <tr style="font-size:7.5px;">
                                <td style="padding:1px 2px;">Extincteur de feu Water</td>
                                <td style="padding:1px 2px;">${yn(b.extincteur_water ?? true)}</td>
                                <td style="padding:1px 2px;">Poudre</td>
                                <td style="padding:1px 2px;">${yn(b.extincteur_poudre ?? true)}</td>
                                <td style="padding:1px 2px;">CO₂</td>
                                <td style="padding:1px 2px;">${yn(b.extincteur_co2)}</td>
                            </tr>
                            <tr style="font-size:7.5px;">
                                <td style="padding:1px 2px;">Couvertures anti-feu</td>
                                <td colspan="5" style="padding:1px 2px;">${yn(b.couvertures_antifeu ?? true)}</td>
                            </tr>
                            <tr style="font-size:7.5px;">
                                <td style="padding:1px 2px;">Surveillant d'incendie</td>
                                <td colspan="5" style="padding:1px 2px;">${yn(b.surveillant ?? true)}</td>
                            </tr>
                            <tr style="font-size:7.5px;">
                                <td style="padding:1px 2px;">Instruction par site</td>
                                <td colspan="5" style="padding:1px 2px;">${yn(b.instruction_site ?? true)}</td>
                            </tr>
                        </table>
                        <div style="font-size:7px;color:#555;margin-top:3px;">Éloigner tous les matériaux inflammables hors le lieu d'intervention (Hors l'exposition de feu)</div>
                    </div>
                    <div style="border:1.5px solid #b91c1c;padding:4px;">
                        <div style="background:#b91c1c;color:#fff;font-weight:800;font-size:7.5px;padding:2px 4px;margin-bottom:3px;">HSE ENTREPRISE<br><span style="font-weight:400;">Nom (lettres majuscule) et signature :</span></div>
                        <div style="font-size:8px;font-weight:700;margin-bottom:2px;">${hseNom}</div>
                        <div style="border-bottom:1px solid #000;height:16px;margin-bottom:6px;"></div>
                        <div style="font-size:7px;color:#b91c1c;font-weight:700;">Surveillant d'incendie doit être présent durant le travail à chaud et <u>30 minutes après son achèvement</u></div>
                    </div>
                </div>

                <!-- INSPECTION TEMPS -->
                <div style="display:flex;align-items:center;gap:12px;border:1px solid #b91c1c;padding:4px 8px;margin-bottom:4px;font-size:8px;">
                    <span style="font-weight:700;">Inspection du site de travail :</span>
                    <span style="border:1px solid #000;padding:2px 6px;font-weight:800;background:${b.insp_1h?'#b91c1c':'#fff'};color:${b.insp_1h?'#fff':'#000'};">1</span>
                    <span style="border:1px solid #000;padding:2px 6px;font-weight:800;background:${b.insp_2h?'#b91c1c':'#fff'};color:${b.insp_2h?'#fff':'#000'};">2</span>
                    <span style="border:1px solid #000;padding:2px 6px;font-weight:800;background:${b.insp_3h?'#b91c1c':'#fff'};color:${b.insp_3h?'#fff':'#000'};">3</span>
                    <span>h</span>
                    <span style="margin-left:auto;font-weight:700;">Durée de la dernière inspection :</span>
                    <span style="border:1px solid #000;padding:2px 8px;font-weight:900;font-family:monospace;">${b.duree_inspection || '30 MIN'}</span>
                </div>

                <!-- ALARME INCENDIE & DÉTECTION -->
                <table style="width:100%;border-collapse:collapse;margin-bottom:4px;">
                    <tr style="font-size:7.5px;">
                        <td style="border:1px solid #aaa;padding:2px 4px;width:50%;">L'alarme d'incendie la plus proche / appel d'urgence</td>
                        <td style="border:1px solid #aaa;padding:2px 4px;width:50%;font-weight:800;text-align:center;">BLOC SÉCURITÉ</td>
                    </tr>
                    <tr style="font-size:7.5px;">
                        <td colspan="2" style="border:1px solid #aaa;padding:2px 4px;">Mise hors service de l'instrument de détection ? ${yn(b.detection_hors_service)}
                            <span style="margin-left:8px;font-style:italic;">si "oui" :</span>
                        </td>
                    </tr>
                    <tr style="font-size:7.5px;">
                        <td style="border:1px solid #aaa;padding:2px 4px;">Notification requise Dept incendie ${yn(b.notif_incendie)} — numéro de téléphone : <span style="border-bottom:1px solid #000;display:inline-block;width:22%;"> </span></td>
                        <td style="border:1px solid #aaa;padding:2px 4px;">Name : <span style="border-bottom:1px solid #000;display:inline-block;width:40%;"> </span></td>
                    </tr>
                    <tr style="font-size:7.5px;">
                        <td style="border:1px solid #aaa;padding:2px 4px;">Notification requise à l'assurance ${yn(b.notif_assurance)}</td>
                        <td style="border:1px solid #aaa;padding:2px 4px;font-style:italic;">(Tel. Henkel Insurance Dept., 24h/weekend)</td>
                    </tr>
                    <tr style="font-size:7.5px;">
                        <td colspan="2" style="border:1px solid #aaa;padding:2px 4px;">Vérification que le détecteur d'incendie est éteint ? ${yn(b.detecteur_eteint)}</td>
                    </tr>
                    <tr style="font-size:7.5px;">
                        <td colspan="2" style="border:1px solid #aaa;padding:2px 4px;">Surveillance de gaz pour d'éventuel gaz ou vapeurs inflammables sont nécessaires durant la tâche. ${yn(b.surveillance_gaz_final ?? true)} — si "oui" exposition forme X additionnel est nécessaire</td>
                    </tr>
                </table>

                <!-- SIGNATURES -->
                <table style="width:100%;border-collapse:collapse;margin-top:6px;">
                    <tr>
                        <td style="border:2px solid #b91c1c;padding:6px;width:40%;vertical-align:top;">
                            <div style="font-size:8px;font-weight:800;background:#b91c1c;color:#fff;padding:2px 4px;margin-bottom:4px;">CHEF DE PROJET</div>
                            <div style="font-size:7.5px;font-style:italic;color:#555;">Nom (lettres majuscule) et signature</div>
                            <div style="font-size:8px;font-weight:700;margin-top:2px;">${chefNom}</div>
                            <div style="border-bottom:1px solid #000;height:18px;margin-top:4px;"></div>
                        </td>
                        <td style="border:2px solid #b91c1c;padding:6px;width:40%;vertical-align:top;">
                            <div style="font-size:8px;font-weight:800;background:#b91c1c;color:#fff;padding:2px 4px;margin-bottom:4px;">HSE ENTREPRISE</div>
                            <div style="font-size:7.5px;font-style:italic;color:#555;">Nom (lettres majuscule) et signature</div>
                            <div style="font-size:8px;font-weight:700;margin-top:2px;">${hseNom}</div>
                            <div style="border-bottom:1px solid #000;height:18px;margin-top:4px;"></div>
                        </td>
                        <td style="border:2px solid #b91c1c;padding:6px;width:20%;vertical-align:top;">
                            <div style="font-size:7.5px;">Date : <strong>${datePermis}</strong></div>
                            <div style="font-size:7.5px;margin-top:6px;">Heure : <strong>${permit.timeStart || '08h00'}</strong></div>
                        </td>
                    </tr>
                </table>

                <!-- QR FOOTER -->
                ${this.renderFooterQR(permit)}
            </div>
        `;
    },

    // 5. ANNEXE C (JAUNE) — ÉLECTRICITÉ & CONSIGNATION
    electricAnnexe(permit) {
        return `
            <div class="a4-document annexe-elec-doc" id="a4-doc-${permit.id}-electric">
                <div class="doc-header-exact">
                    <div class="doc-logo-box">
                        <span class="logo-sinylon-badge">SINYLON</span>
                        <span class="logo-stellantis-badge">STELLANTIS</span>
                    </div>
                    <div class="doc-title-exact" style="color: #b45309;">
                        ANNEXE C : PERMIS ÉLECTRIQUE & CONSIGNATION (JAUNE)<br>
                        <span style="font-size: 8px; font-weight: normal; color: #000;">Electrical Works, Cabling & LOTO Lockout Protocol</span>
                    </div>
                    <div class="doc-header-right-group">
                        <div class="doc-id-box-exact">
                            <strong>Permit ID</strong><br>
                            <span style="font-size: 12px; font-weight: 900; color: #b45309;">${permit.id}</span>
                        </div>
                    </div>
                </div>

                <div style="background: #fef3c7; border: 1.5px solid #f59e0b; padding: 6px 12px; margin-top: 8px; border-radius: 4px; font-size: 10px; color: #b45309; font-weight: 700;">
                    ⚡ TRAVAUX : TIRAGE DE CÂBLES, ARMOIRES ÉLECTRIQUES, MOTEURS & ÉQUIPEMENTS INDUSTRIELS
                </div>

                <table class="doc-table-exact" style="margin-top: 10px;">
                    <thead>
                        <tr>
                            <th style="width: 75%;">Protocoles de Sécurité Électrique</th>
                            <th style="width: 25%;">Conformité</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Consignation LOTO effectuée et cadenas posés</td><td class="text-center font-bold" style="color: green;">OUI (Cadenas Sinylon)</td></tr>
                        <tr><td>Vérification d'Absence de Tension (VAT) certifiée</td><td class="text-center font-bold" style="color: green;">CONFORME (0V) ✓</td></tr>
                        <tr><td>Habilitations électriques des intervenants vérifiées (B2V / BR / BC / H1V)</td><td class="text-center font-bold" style="color: green;">OUI (Habilités)</td></tr>
                        <tr><td>EPI isolants (Gants 1000V, Écran facial anti-arc, Chaussures isolantes)</td><td class="text-center font-bold" style="color: green;">CONFORME ✓</td></tr>
                        <tr><td>Mise à la terre et en court-circuit (MALT/CC) si requise</td><td class="text-center font-bold" style="color: green;">APPLIQUÉE ✓</td></tr>
                    </tbody>
                </table>

                <div class="signatures-grid-exact" style="margin-top: 20px;">
                    <div class="sign-card-exact">
                        <div class="sign-card-header">Chef de Projet Sinylon</div>
                        <div>Xie (Validé ✓)</div>
                    </div>
                    <div class="sign-card-exact wpeex-sign">
                        <div class="sign-card-header">W.P.E.E.X Suivi</div>
                        <div>M. W.P.E.E.X (Approuvé ✓)</div>
                    </div>
                    <div class="sign-card-exact">
                        <div class="sign-card-header">Superviseur HSE</div>
                        <div>Nouri Chahrour (0563765157)</div>
                    </div>
                </div>

                <!-- QR CODE FOOTER DÉDIÉ -->
                ${this.renderFooterQR(permit)}
            </div>
        `;
    }
};

window.Templates = Templates;
