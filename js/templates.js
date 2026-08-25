/**
 * SINYLON - STELLANTIS | Templates A4 Haute Fidélité V3
 * Moteur de Revalidation Journalière Dynamique (Jour par Jour à 08h00 - Protocole HSE W.P.E.E.X)
 * Emplacement QR Code sécurisé en bas de page (Footer)
 */

const Templates = {
    // Helper pour le bandeau QR en bas de page (Rendu Vectoriel SVG direct et infaillible)
    renderFooterQR(permit) {
        const payload = (window.QREngine && typeof QREngine.generatePayload === 'function') 
            ? QREngine.generatePayload(permit) 
            : `https://permis-sinylon.onrender.com/?permitId=${permit.id}`;
        
        let svgQr = '';
        const engine = window.QRCodeGenerator || window.QRCode;
        if (engine && typeof engine.toSVG === 'function') {
            svgQr = engine.toSVG(payload, { size: 44, margin: 1 });
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

        const descFr = (permit.activity && permit.activity.fr) || permit['work-desc'] || permit.title || '';
        const descEn = (permit.activity && permit.activity.en) || permit['work-desc-en'] || permit.title_en || Translator.localDictionaryTranslate(descFr);
        const workers = permit.workers && permit.workers.length > 0 ? permit.workers : ['Xie (Chef de Projet)', 'Nouri Chahrour (HSE Sinylon)'];
        const descFr = permit.activite_detaillee_fr || (permit.activity && (permit.activity.fr || permit.activity.en)) || permit['work-desc'] || permit.title || 'Installation Mécanique et Montage';
        const descEn = permit.activite_detaillee_en || (permit.activity && permit.activity.en) || permit.title_en || 'Mechanical and Assembly Installation';
        const descZh = permit.activite_detaillee_zh || (permit.activity && permit.activity.zh) || permit.title_zh || '机械装配与设备安装';
        const equipementsStr = Array.isArray(permit.equipements_a_installer) ? permit.equipements_a_installer.join(', ') : (permit.equipements_a_installer || 'Nacelles ciseaux (x6), Palans DEMAG KBK, Outillages certifiés');

        // Générer les vignettes d'intervenants
        const workers = permit.travailleurs || permit.workers || [];
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
                </div>       </div>
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

    // 3. ANNEXE A (BLEUE) — HAUTEUR (6 Nacelles Ciseaux + 1 Manlift / Pas d'échafaudages)
    heightAnnexe(permit) {
        return `
            <div class="a4-document annexe-height-doc" id="a4-doc-${permit.id}-height">
                <div class="doc-header-exact">
                    <div class="doc-logo-box">
                        <span class="logo-sinylon-badge">SINYLON</span>
                        <span class="logo-stellantis-badge">STELLANTIS</span>
                    </div>
                    <div class="doc-title-exact" style="color: #0369a1;">
                        ANNEXE A : PERMIS TRAVAIL EN HAUTEUR (BLEUE)<br>
                        <span style="font-size: 8px; font-weight: normal; color: #000;">Work at Height Safety Verification Checklist</span>
                    </div>
                    <div class="doc-header-right-group">
                        <div class="doc-id-box-exact">
                            <strong>Permit ID</strong><br>
                            <span style="font-size: 12px; font-weight: 900; color: #0369a1;">${permit.id}</span>
                        </div>
                    </div>
                </div>

                <div style="background: #e0f2fe; border: 1.5px solid #0284c7; padding: 6px 12px; margin-top: 8px; border-radius: 4px; font-size: 10px; color: #0369a1; font-weight: 700;">
                    🧗 ÉQUIPEMENTS AUTORISÉS : 6 NACELLES CISEAUX + 1 MANLIFT (PEMP) — AUCUN ÉCHAFAUDAGE
                </div>

                <table class="doc-table-exact" style="margin-top: 10px;">
                    <thead>
                        <tr>
                            <th style="width: 75%;">Points de Contrôle Obligatoires</th>
                            <th style="width: 25%;">Conformité</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Nacelles élévatrices PEMP vérifiées avec VGP valide</td><td class="text-center font-bold" style="color: green;">OUI (6 Ciseaux + 1 Manlift)</td></tr>
                        <tr><td>Opérateurs formés et titulaires du CACES PEMP</td><td class="text-center font-bold" style="color: green;">CONFORME ✓</td></tr>
                        <tr><td>Port du harnais de sécurité complet avec longe courte obligatoire en nacelle</td><td class="text-center font-bold" style="color: green;">OUI (100% Vérifié)</td></tr>
                        <tr><td>Balisage physique au sol sous la zone de travail en hauteur</td><td class="text-center font-bold" style="color: green;">OUI (Balisage 360°)</td></tr>
                        <tr><td>Sol stable, propre, sec et nivelé pour circulation des nacelles</td><td class="text-center font-bold" style="color: green;">CONFORME ✓</td></tr>
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
    },

    // 4. ANNEXE B (ROUGE) — TRAVAIL À CHAUD & SOUDURE
    hotAnnexe(permit) {
        return `
            <div class="a4-document annexe-hot-doc" id="a4-doc-${permit.id}-hot">
                <div class="doc-header-exact">
                    <div class="doc-logo-box">
                        <span class="logo-sinylon-badge">SINYLON</span>
                        <span class="logo-stellantis-badge">STELLANTIS</span>
                    </div>
                    <div class="doc-title-exact" style="color: #b91c1c;">
                        ANNEXE B : PERMIS TRAVAIL À CHAUD / SOUDURE (ROUGE)<br>
                        <span style="font-size: 8px; font-weight: normal; color: #000;">Hot Work & Welding Safety Verification Checklist</span>
                    </div>
                    <div class="doc-header-right-group">
                        <div class="doc-id-box-exact">
                            <strong>Permit ID</strong><br>
                            <span style="font-size: 12px; font-weight: 900; color: #b91c1c;">${permit.id}</span>
                        </div>
                    </div>
                </div>

                <div style="background: #fee2e2; border: 1.5px solid #ef4444; padding: 6px 12px; margin-top: 8px; border-radius: 4px; font-size: 10px; color: #b91c1c; font-weight: 700;">
                    🔥 CONSIGNES SOUDAGE / MEULAGE : DÉGAGEMENT 10M + EXTINCTEURS DIRECTEMENT SUR LE POSTE
                </div>

                <table class="doc-table-exact" style="margin-top: 10px;">
                    <thead>
                        <tr>
                            <th style="width: 75%;">Mesures de Prévention Incendie</th>
                            <th style="width: 25%;">Conformité</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Zone de 10 mètres dégagée de tout matériau combustible</td><td class="text-center font-bold" style="color: green;">CONFORME ✓</td></tr>
                        <tr><td>Moyens d'extinction appropriés à portée immédiate (Eau, Poudre, CO2)</td><td class="text-center font-bold" style="color: green;">OUI (Présents)</td></tr>
                        <tr><td>Bâches ignifugées déployées pour retenir les projections d'étincelles</td><td class="text-center font-bold" style="color: green;">OUI (Installées)</td></tr>
                        <tr><td>État des détecteurs de fumée usine</td><td class="text-center font-bold">Phase Montage (Non activés)</td></tr>
                        <tr><td>Surveillance continue pendant l'exécution des travaux</td><td class="text-center font-bold" style="color: green;">OUI (Surveillant présent)</td></tr>
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
