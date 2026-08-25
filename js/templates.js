/**
 * SINYLON - STELLANTIS | Templates A4 Haute Fidélité (Reproduction exacte des scans réels)
 * Modifiables en direct, ajout/suppression de noms et intervenants, validation W.P.E.E.X
 */

const Templates = {
    // 1. PERMIS GÉNÉRAL - PAGE 1/2 (RECTO)
    generalP1(permit) {
        const d = permit.dangers || {};
        const isY = (val) => val ? 'check-active' : '';
        const isN = (val) => !val ? 'check-active' : '';

        const descFr = permit['work-desc'] || permit.title || '';
        const descEn = permit['work-desc-en'] || permit['title-en'] || Translator.localDictionaryTranslate(descFr);
        const workers = permit.workers && permit.workers.length > 0 ? permit.workers : ['XIE XIAN (Chef de Projet)', 'ZHOULIN (Chef d\'Équipe)', 'Nouri Chahrour (HSE - 0563765157)'];

        const workersHtml = workers.map((w, idx) => `
            <span class="worker-chip">
                <span>👤</span>
                <span contenteditable="true" onblur="App.updateWorkerName('${permit.id}', ${idx}, this.innerText)">${w}</span>
                <span class="worker-chip-del no-print" onclick="App.removeWorker('${permit.id}', ${idx})">✕</span>
            </span>
        `).join('');

        return `
            <div class="a4-document" id="a4-doc-${permit.id}">
                <!-- En-tête officiel exact -->
                <div class="doc-header-exact">
                    <div class="doc-logo-box">
                        <span class="logo-sinylon-badge">SINYLON</span>
                        <span class="logo-stellantis-badge">STELLANTIS</span>
                    </div>
                    <div class="doc-title-exact">
                        Permis de Travail de Securité Générale<br>
                        <span style="font-size: 8px; font-weight: normal;">(à afficher sur le site de travail) / General Safety Work Permit</span>
                    </div>
                    <div class="doc-header-right-group">
                        <div class="doc-id-box-exact">
                            <strong>Identifiant du permis / Permit ID</strong><br>
                            <span style="font-size: 11px; font-weight: bold; color: #1e3a8a;" contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'id', this.innerText)">${permit.id}</span>
                        </div>
                        <div class="qr-container qr-code-box" id="doc-qr-p1" title="Scan QR Code Mobile"></div>
                    </div>
                </div>

                <!-- Brève description du travail (Bande Jaune) -->
                <div class="yellow-bar-header">Bréve description du travail / Brief work description</div>
                <div class="doc-box-bordered" style="min-height: 38px;">
                    <div style="font-weight: 500;"><strong>FR :</strong> <span contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'work-desc', this.innerText)">${descFr}</span></div>
                    <div style="font-size: 8.5px; color: #1e3a8a; font-style: italic; margin-top: 2px;"><strong>EN :</strong> <span contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'work-desc-en', this.innerText)">${descEn}</span></div>
                </div>

                <!-- Endroit de travail & Équipement/Machinerie (Bande Jaune 2 colonnes) -->
                <div class="yellow-grid-2" style="margin-top: 4px;">
                    <div class="yellow-bar-header" style="border-right: none;">Endroit de travail:</div>
                    <div class="yellow-bar-header">Equipment/Machinerie / Zone sur lequel s'effectue le travail</div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0;">
                    <div class="doc-box-bordered" style="border-right: none;" contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'location', this.innerText)">
                        ${permit.location || 'Hall Montage / Usine Stellantis'}
                    </div>
                    <div class="doc-box-bordered" contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'ouvrage', this.innerText)">
                        ${permit.ouvrage || 'Ligne Assemblage'} — Zone : <span contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'zone', this.innerText)">${permit.zone || 'Zone 4'}</span>
                    </div>
                </div>

                <!-- Entreprise Intervenante & Contacts -->
                <div style="display: grid; grid-template-columns: 1.4fr 1fr; margin-top: 4px;">
                    <div class="doc-box-bordered" style="border-right: none;">
                        <strong>Entreprise Intervenante :</strong> <span contenteditable="true" style="font-weight: bold;" onblur="App.updatePermitField('${permit.id}', 'company', this.innerText)">${permit.company || 'SINYLON'}</span><br>
                        Avant de commencer le travail, veuillez contacter :<br>
                        <strong>Chef de Projet :</strong> <span contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'chef-nom', this.innerText)">${permit['chef-nom'] || 'XIE XIAN'}</span>
                    </div>
                    <div class="doc-box-bordered">
                        <div style="display: flex; justify-content: space-between;">
                            <span>Plan d'urgence du site attaché :</span>
                            <span class="check-yn"><span>Y</span><span class="check-active">N</span></span>
                        </div>
                        <strong>Ouvrage :</strong> <span contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'ouvrage', this.innerText)">${permit.ouvrage || 'Stellantis'}</span> 
                        <strong>ZONE :</strong> <span contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'zone', this.innerText)">${permit.zone || 'Zone 4'}</span><br>
                        <strong>Tél. HSE :</strong> <span contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'tel', this.innerText)">${permit.tel || '+213 550 12 34 56'}</span>
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

                <!-- Grille d'Analyse des Grands Dangers (Fidèle à l'image 1) -->
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

                <div style="display: flex; justify-content: space-between; align-items: center; border: 1px solid #000; padding: 2px 6px; margin-top: 4px; font-size: 8.5px;">
                    <div>
                        Est ce travail, une modification couverte par MOC?
                        <span class="check-yn" style="margin-left: 6px;"><span>Y</span><span class="check-active">N</span></span>
                    </div>
                    <div>
                        MOC Ref. Nr. / Id. : <strong contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'moc-ref', this.innerText)">/</strong>
                    </div>
                </div>

                <!-- Validité du permis et signatures -->
                <div style="margin-top: 6px; border: 1.5px solid #000; padding: 4px 6px;">
                    <div style="font-weight: bold; font-size: 9.5px; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 4px;">
                        validité du permis et signatures
                    </div>
                    <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 4px; font-size: 9px;">
                        <div>Date du permis : <span style="border-bottom: 1px solid #000; font-weight: bold; padding: 0 8px;" contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'date-main', this.innerText)">${permit['date-main'] || '2026-08-24'}</span></div>
                        <div>heure de début : <span style="border-bottom: 1px solid #000; font-weight: bold; padding: 0 8px;" contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'time-start', this.innerText)">${permit['time-start'] || '07h30'}</span></div>
                        <div>heure de fin : <span style="border-bottom: 1px solid #000; font-weight: bold; padding: 0 8px;" contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'time-end', this.innerText)">${permit['time-end'] || '18h00'}</span></div>
                    </div>
                    <div style="font-size: 7.5px; color: #333; line-height: 1.15; margin-bottom: 4px;">
                        Ce permis de travail de sécurité générale et sa liste de verification des grands danger avec le meme identifiant du permis sont uniquement valide pour la date et la période spécifiée ci-dessus. Toute les signatures doivent etre obtenues avant l'entame du travail. Permis affiché sur le lieu de travail. Copies: Emetteur du permis, receveur du permis et si applicable: Coordinateur, chef de quart et/ou salle de controle.
                    </div>

                    <!-- Les Signatures Fidèles -->
                    <div class="signatures-grid-exact">
                        <div class="sign-card-exact">
                            <div class="sign-card-header">Chef de Projet Entreprise</div>
                            <div style="font-size: 8px;">Nom : <strong contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'chef-nom', this.innerText)">${permit['chef-nom'] || 'XIE XIAN'}</strong></div>
                            <div style="font-size: 8px; color: #2563eb; font-weight: bold;">Signature : XIE XIAN (Validé)</div>
                        </div>
                        <div class="sign-card-exact wpeex-sign">
                            <div class="sign-card-header">W.P.E.E.X - Ingénieur de Suivi</div>
                            <div style="font-size: 8px;">Nom : <strong contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'wpeex-nom', this.innerText)">${permit['wpeex-nom'] || 'M. W.P.E.E.X'}</strong></div>
                            <div style="font-size: 8px; color: #1d4ed8; font-weight: bold;">Visa : W.P.E.E.X (Approuvé)</div>
                        </div>
                        <div class="sign-card-exact">
                            <div class="sign-card-header">Superviseur HSE</div>
                            <div style="font-size: 8px;">Nom : <strong contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'hse-nom', this.innerText)">${permit['hse-nom'] || 'Nouri Chahrour (0563765157)'}</strong></div>
                            <div class="sign-legal-note">Précautions et conformité HSE validées.</div>
                        </div>
                        <div class="sign-card-exact">
                            <div class="sign-card-header">Chef d'Équipe Chantier</div>
                            <div style="font-size: 8px;">Nom : <strong contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'chef_equipe', this.innerText)">${permit.chef_equipe || 'ZHOULIN'}</strong></div>
                            <div class="sign-legal-note">Équipe briefée, instructions de sécurité suivies.</div>
                        </div>
                    </div>
                </div>

                <!-- Permit Hand-Back (Restitution) -->
                <div class="handback-section">
                    <div style="font-weight: bold; font-size: 9px; margin-bottom: 2px;">
                        Permit Hand-Back (renvoyer à l'emetteur du permis après signature)
                    </div>
                    <div style="font-size: 7.5px; font-style: italic; margin-bottom: 4px;">(supèrvisuer d'unité: veuillez cocher les caases appropriées ci-dessous)</div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 8px;">
                        <div>
                            <strong>Etat de travail :</strong><br>
                            <span class="checkbox-square">${permit.isClosed ? 'X' : ''}</span> Achevé<br>
                            <span class="checkbox-square"></span> Inachevé (veuillez spécifier ci-dessous)
                        </div>
                        <div>
                            <strong>Etat de la surface/installation/équipmer :</strong><br>
                            <span class="checkbox-square">${permit.isClosed ? 'X' : ''}</span> pret pour l'operation normale<br>
                            <span class="checkbox-square"></span> pas pret (veuillez spécifier ci-dessous)
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin-top: 4px;">
                        <div class="sign-card-exact">
                            <div class="sign-card-header">Chef d'Équipe</div>
                            <div style="font-size: 7.5px;">Nom : ${permit.chef_equipe || 'ZHOULIN'}</div>
                            <div style="font-size: 7.5px;">Signature : Validé</div>
                        </div>
                        <div class="sign-card-exact">
                            <div class="sign-card-header">HSE Sinylon</div>
                            <div style="font-size: 7.5px;">Nom : Nouri Chahrour</div>
                            <div style="font-size: 7.5px;">Tel : 0563765157</div>
                        </div>
                        <div class="sign-card-exact wpeex-sign">
                            <div class="sign-card-header">W.P.E.E.X</div>
                            <div style="font-size: 7.5px;">Visa : Conforme</div>
                            <div style="font-size: 7.5px;">Date : ${permit['date-main']}</div>
                        </div>
                        <div class="sign-card-exact">
                            <div class="sign-card-header">Chef de Projet</div>
                            <div style="font-size: 7.5px;">Nom : ${permit['chef-nom'] || 'XIE XIAN'}</div>
                            <div style="font-size: 7.5px;">Statut : CLÔTURÉ</div>
                        </div>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; font-size: 8px; margin-top: 4px; border-top: 1px solid #000; padding-top: 2px;">
                    <span>Contact HSE : <strong>${permit.tel || '+213 550 12 34 56'} (Nouri Chahrour)</strong></span>
                    <span>Projet : <strong>Algeria K9 CKD0</strong></span>
                    <span>Page 1/2</span>
                </div>
            </div>
        `;
    },

    // 2. PAGE 2/2 (VERSO REVALIDATION DU PERMIS PAR W.P.E.E.X)
    generalP2(permit) {
        const revals = permit.revalidations || [];
        const baseDate = permit.date_debut || permit['date-main'] || '2026-08-24';
        const dayNames = ['Lundi (J1 Initial)', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi (Caisse)', 'Samedi (Caisse)', 'Dimanche'];
        const rows = [];

        for (let i = 2; i <= 7; i++) {
            const rowIndex = i - 2;
            let rev = revals[rowIndex];
            
            // Calculer la date prévisionnelle du jour si non renseignée
            let defaultDate = '--/--/----';
            try {
                const d = new Date(baseDate);
                d.setDate(d.getDate() + (i - 1));
                defaultDate = d.toISOString().split('T')[0];
            } catch (e) {}

            const curDate = rev?.date || defaultDate;
            const curWpeex = rev?.wpeexEngineer || 'M. W.P.E.E.X';
            const isWpeexValid = rev?.wpeexValidated !== false && (rev?.status === 'VALIDE' || rev?.wpeexValidated === true);
            const curExec = rev?.execManager || 'XIE XIAN';
            const isExecSigned = rev?.sinylonSigned !== false && (rev?.status === 'VALIDE' || rev?.sinylonSigned === true);

            rows.push(`
                <tr>
                    <td class="text-center bold-cell" style="font-weight: bold; width: 40px; background: #f8fafc;">
                        Jour ${i}<br>
                        <span style="font-size: 7.5px; color: #64748b; font-weight: normal;">${dayNames[i - 1]}</span>
                    </td>
                    <td class="text-center" style="font-weight: 600;">
                        <input type="text" value="${curDate}" class="reval-inline-input" style="width: 85px; text-align: center; border: 1px dashed #cbd5e1; border-radius: 4px; padding: 2px; font-size: 8.5px;" onchange="App.updateRevalRow('${permit.id}', ${rowIndex}, 'date', this.value)">
                    </td>
                    <td class="text-center">
                        <input type="text" value="${curWpeex}" class="reval-inline-input" style="width: 100px; text-align: center; border: 1px dashed #cbd5e1; border-radius: 4px; padding: 2px; font-size: 8.5px;" onchange="App.updateRevalRow('${permit.id}', ${rowIndex}, 'wpeexEngineer', this.value)">
                    </td>
                    <td class="text-center" style="font-size: 7.5px; color: #64748b;">Ingénieur Suivi</td>
                    <td class="text-center" style="cursor: pointer;" onclick="App.toggleRevalWpeex('${permit.id}', ${rowIndex})">
                        <span class="badge ${isWpeexValid ? 'badge-blue' : 'badge-yellow'}" style="font-size: 8px; padding: 2px 6px; cursor: pointer;" title="Cliquer pour basculer la validation">
                            ${isWpeexValid ? 'VALIDÉ W.P.E.E.X ✓' : '⏳ EN ATTENTE'}
                        </span>
                    </td>
                    <td class="text-center">
                        <input type="text" value="${curExec}" class="reval-inline-input" style="width: 85px; text-align: center; border: 1px dashed #cbd5e1; border-radius: 4px; padding: 2px; font-size: 8.5px;" onchange="App.updateRevalRow('${permit.id}', ${rowIndex}, 'execManager', this.value)">
                    </td>
                    <td class="text-center" style="font-size: 7.5px; color: #64748b;">Chef de Projet</td>
                    <td class="text-center" style="cursor: pointer;" onclick="App.toggleRevalSinylon('${permit.id}', ${rowIndex})">
                        <span class="badge ${isExecSigned ? 'badge-sky' : 'badge-yellow'}" style="font-size: 8px; padding: 2px 6px; cursor: pointer;" title="Cliquer pour basculer la signature">
                            ${isExecSigned ? 'SIGNÉ XIE XIAN ✓' : '⏳ EN ATTENTE'}
                        </span>
                    </td>
                    <td class="text-center no-print" style="width: 75px;">
                        <button type="button" class="btn btn-sm btn-outline" style="font-size: 8px; padding: 1px 4px;" onclick="App.toggleRevalBoth('${permit.id}', ${rowIndex})">
                            ${(isWpeexValid && isExecSigned) ? '↩️ Annuler' : '✍️ Valider'}
                        </button>
                    </td>
                </tr>
            `);
        }

        return `
            <div class="a4-document" id="a4-doc-p2">
                <div class="doc-header-exact">
                    <div class="doc-logo-box">
                        <span class="logo-sinylon-badge">SINYLON</span>
                        <span class="logo-stellantis-badge">STELLANTIS</span>
                    </div>
                    <div class="doc-title-exact">
                        Permis de Travail de Securité Générale<br>
                        <span style="font-size: 8px; font-weight: normal;">(Tableau des Revalidations Quotidiennes / Work Permit Daily Revalidations)</span>
                    </div>
                    <div class="doc-header-right-group">
                        <div class="doc-id-box-exact">
                            <strong>Identifiant du permis</strong><br>
                            <span style="font-size: 11px; font-weight: bold; color: #1e3a8a;">${permit.id}</span>
                        </div>
                        <div class="qr-container qr-code-box" id="doc-qr-p2" title="Scan QR Code Mobile"></div>
                    </div>
                </div>

                <!-- Barre d'action rapide pour Revalidation -->
                <div class="no-print" style="margin-top: 8px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 6px 12px; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
                    <div style="color: #166534; font-weight: 600;">
                        ⏰ <strong>Revalidation Matin 07h55 :</strong> <span class="badge badge-sky" style="font-size: 9px;">ACTIVE</span> (Validation automatique chaque matin à 07h55)
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <button type="button" class="btn btn-sm btn-primary" onclick="App.revalidateTodayAuto('${permit.id}')">⚡ Revalider Aujourd'hui (07h55)</button>
                        <button type="button" class="btn btn-sm btn-secondary" onclick="App.signAllRevalidations('${permit.id}')">✍️ Signer Toute la Semaine</button>
                    </div>
                </div>

                <div class="yellow-bar-header" style="margin-top: 10px;">REVALIDATION DU PERMIS (JOURNAL QUOTIDIEN DU JOUR 2 AU JOUR 7)</div>
                <table class="doc-table-exact" style="margin-top: 6px;">
                    <thead>
                        <tr>
                            <th rowspan="2" style="width: 40px;">JOUR</th>
                            <th rowspan="2" style="width: 85px;">DATE</th>
                            <th colspan="3">W.P.E.E.X - Ingénieur de Suivi</th>
                            <th colspan="3">Responsable d'exécution (SINYLON)</th>
                            <th rowspan="2" class="no-print" style="width: 75px;">ACTION</th>
                        </tr>
                        <tr>
                            <th>Nom</th>
                            <th>Fonction</th>
                            <th>Signature / Visa</th>
                            <th>Nom</th>
                            <th>Fonction</th>
                            <th>Signature / Visa</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.join('')}
                    </tbody>
                </table>

                <div class="yellow-bar-header" style="margin-top: 24px;">REVALIDATION DU PERMIS DE TRAVAIL & SUPERVISION W.P.E.E.X</div>
                <table class="doc-table-exact" style="margin-top: 6px;">
                    <thead>
                        <tr>
                            <th style="width: 45px;">JOUR</th>
                            <th style="width: 90px;">DATE</th>
                            <th>Nom Superviseur</th>
                            <th>Fonction</th>
                            <th>Signature & Cachet Officiel W.P.E.E.X</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td class="text-center bold-cell">Jour 2</td><td class="text-center">Mardi</td><td>M. W.P.E.E.X</td><td>Ingénieur de Suivi</td><td class="text-center" style="font-weight: bold; color: #1e3a8a;">VISA ELECTRONIQUE CONFORME ✓</td></tr>
                        <tr><td class="text-center bold-cell">Jour 3</td><td class="text-center">Mercredi</td><td>M. W.P.E.E.X</td><td>Ingénieur de Suivi</td><td class="text-center" style="font-weight: bold; color: #1e3a8a;">VISA ELECTRONIQUE CONFORME ✓</td></tr>
                        <tr><td class="text-center bold-cell">Jour 4</td><td class="text-center">Jeudi</td><td>M. W.P.E.E.X</td><td>Ingénieur de Suivi</td><td class="text-center" style="font-weight: bold; color: #1e3a8a;">VISA ELECTRONIQUE CONFORME ✓</td></tr>
                        <tr><td class="text-center bold-cell">Jour 5</td><td class="text-center">Vendredi</td><td>M. W.P.E.E.X</td><td>Ingénieur de Suivi</td><td class="text-center" style="font-weight: bold; color: #1e3a8a;">VISA CAISSE WEEK-END VALIDÉ ✓</td></tr>
                        <tr><td class="text-center bold-cell">Jour 6</td><td class="text-center">Samedi</td><td>M. W.P.E.E.X</td><td>Ingénieur de Suivi</td><td class="text-center" style="font-weight: bold; color: #1e3a8a;">VISA CAISSE WEEK-END VALIDÉ ✓</td></tr>
                        <tr><td class="text-center bold-cell">Jour 7</td><td class="text-center">Dimanche</td><td>M. W.P.E.E.X</td><td>Ingénieur de Suivi</td><td class="text-center" style="font-weight: bold; color: #1e3a8a;">CLÔTURE HEBDOMADAIRE ✓</td></tr>
                    </tbody>
                </table>

                <div style="display: flex; justify-content: space-between; font-size: 8px; margin-top: 30px; border-top: 1px solid #000; padding-top: 2px;">
                    <span>SINYLON - STELLANTIS | Suivi Officiel W.P.E.E.X</span>
                    <span>Projet : <strong>Algeria K9 CKD0</strong></span>
                    <span>Page 2/2</span>
                </div>
            </div>
        `;
    },

    // 3. ANNEXE A (BLEUE) — TRAVAIL EN HAUTEUR (6 Nacelles Ciseaux + 1 Manlift / Pas d'échafaudages)
    heightAnnexe(permit) {
        const h = permit.heightDetails || {};
        const isY = (val) => val ? 'check-active' : '';
        const isN = (val) => !val ? 'check-active' : '';
        const workers = permit.workers && permit.workers.length > 0 ? permit.workers : ['XIE XIAN (Chef de Projet)', 'ZHOULIN (Chef d\'Équipe)', 'Nouri Chahrour (HSE - 0563765157)'];

        const workersHtml = workers.map((w, idx) => `
            <span class="worker-chip">
                <span>👤</span>
                <span contenteditable="true" onblur="App.updateWorkerName('${permit.id}', ${idx}, this.innerText)">${w}</span>
                <span class="worker-chip-del no-print" onclick="App.removeWorker('${permit.id}', ${idx})">✕</span>
            </span>
        `).join('');

        return `
            <div class="a4-document" style="border: 2px solid #0284c7;">
                <div class="doc-header-exact">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="annexe-letter-badge annexe-letter-a">A</span>
                        <span style="font-size: 16px; font-weight: 900; color: #0284c7;">Travail en hauteur</span>
                    </div>
                    <div class="doc-logo-box">
                        <span class="logo-sinylon-badge">SINYLON</span>
                        <span class="logo-stellantis-badge">STELLANTIS</span>
                    </div>
                    <div class="doc-header-right-group">
                        <div class="doc-id-box-exact">
                            <strong>Identifiant du permis</strong><br>
                            <span style="font-size: 11px; font-weight: bold; color: #0284c7;">${permit.id}</span>
                        </div>
                        <div class="qr-container qr-code-box" title="Scan QR Code Mobile"></div>
                    </div>
                </div>

                <div style="font-size: 8px; font-style: italic; text-align: center; margin-bottom: 4px;">
                    Cette liste de verification doit etre toujours accompagnée par le permis de travail de sécurité générale
                </div>

                <!-- Usage des équipements : 6 Nacelles Ciseaux + 1 Manlift (Pas d'échafaudages) -->
                <div class="doc-box-bordered">
                    <div style="font-size: 8px; font-weight: bold; margin-bottom: 2px;">Équipements de travail en hauteur utilisés sur le chantier :</div>
                    
                    <table class="doc-table-exact">
                        <tr>
                            <td style="width: 50%;">Echaffaudage fixe / mobile <span class="check-yn"><span>.Y.</span><span class="check-active">N</span></span></td>
                            <td>Non requis (travail exclusivement en nacelles élévatrices)</td>
                        </tr>
                        <tr>
                            <td><strong>Nacelles élévatrices PEMP (6 Nacelles Ciseaux + 1 Manlift)</strong> <span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td>
                            <td>
                                Opérateurs habilités & formés (CACES PEMP) <span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span><br>
                                Ordre d'utilisation & VGP à jour <span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span><br>
                                <strong>Port du harnais avec longe d'assujettissement : [X] OBLIGATOIRE</strong>
                            </td>
                        </tr>
                        <tr>
                            <td>Echelle <span class="check-yn"><span>Y</span><span class="check-active">N</span></span></td>
                            <td>Interdite comme poste de travail (utilisée uniquement pour accès ponctuel)</td>
                        </tr>
                        <tr>
                            <td>Equipement d'arret de chute / Ligne de vie <span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td>
                            <td>
                                Vérification visuelle avant chaque montée <span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span><br>
                                Points d'ancrage certifiés sur le panier de la nacelle <span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Équipe intervenants -->
                <div class="doc-workers-box" style="margin-top: 4px;">
                    <div class="doc-workers-header">
                        <span>👥 ÉQUIPE HABILITÉE HAUTEUR (CHEF DE PROJET & HSE)</span>
                        <button type="button" class="btn-add-worker-mini no-print" onclick="App.promptAddWorker('${permit.id}')">+ AJOUTER UN NOM</button>
                    </div>
                    <div class="doc-workers-tags">${workersHtml}</div>
                </div>

                <!-- Travail sur toit & Checklist terrain -->
                <div class="doc-box-bordered" style="margin-top: 4px;">
                    <div style="display: flex; justify-content: space-between; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 2px;">
                        <span>Travail sur toit / charpente</span>
                        <span class="check-yn"><span>.Y.</span><span class="check-active">N</span></span>
                    </div>
                    <table class="doc-table-exact" style="margin-top: 2px;">
                        <tr><td>Capacité de Charge de la dalle/structure suffisante</td><td><span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td></tr>
                        <tr><td>Protection de chute et balisage de la zone sous la nacelle</td><td><span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td></tr>
                    </table>
                </div>

                <table class="doc-table-exact" style="margin-top: 4px;">
                    <tr><td>Endroit de travail barré pour véhicules/traffic/piétons sous nacelle</td><td><span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td></tr>
                    <tr><td>Obstacles en hauteur (chemins de câbles, busbars, tuyauteries) identifiés</td><td><span class="check-yn"><span class="check-active">Y</span></span></td></tr>
                    <tr><td>Issue de secours et allées de circulation dégagées</td><td><span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td></tr>
                    <tr><td>Directives de sécurité nécessaires et port du casque avec jugulaire</td><td><span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td></tr>
                </table>

                <!-- Conditions ambiantes -->
                <div class="doc-box-bordered" style="margin-top: 4px; font-size: 8px;">
                    <div style="font-weight: bold;">Conditions ambiantes & Sol de circulation des nacelles :</div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-top: 2px;">
                        <div>Éclairage atelier : Conforme [X]</div>
                        <div>Sol béton atelier : Sec et nivelé [X]</div>
                        <div>Environnement intérieur : Sans vent [X]</div>
                    </div>
                </div>

                <!-- Signatures Hauteur -->
                <div style="display: grid; grid-template-columns: 1.5fr 1.5fr 1fr; gap: 6px; margin-top: 6px;">
                    <div class="sign-card-exact">
                        <div class="sign-card-header">CHEF DE PROJET</div>
                        <div style="font-size: 8px;">Nom : <strong contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'chef-nom', this.innerText)">${permit['chef-nom'] || 'XIE XIAN'}</strong></div>
                        <div style="font-size: 8px; color: #0284c7; font-weight: bold;">Signature : XIE XIAN (Validé)</div>
                    </div>
                    <div class="sign-card-exact">
                        <div class="sign-card-header">HSE ENTREPRISE</div>
                        <div style="font-size: 8px;">Nom : <strong contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'hse-nom', this.innerText)">${permit['hse-nom'] || 'Nouri Chahrour'}</strong></div>
                        <div style="font-size: 8px; color: #0284c7; font-weight: bold;">Signature : Nouri C.</div>
                    </div>
                    <div class="doc-box-bordered" style="font-size: 8px;">
                        Date : <strong contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'date-main', this.innerText)">${permit['date-main'] || '2026-08-24'}</strong><br>
                        Heure : <strong contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'time-start', this.innerText)">${permit['time-start'] || '07h30'}</strong>
                    </div>
                </div>
            </div>
        `;
    },

    // 4. ANNEXE B (ROUGE) — TRAVAIL À CHAUD & SÉCURITÉ INCENDIE
    hotAnnexe(permit) {
        const ht = permit.hotDetails || {};
        const isY = (val) => val ? 'check-active' : '';
        const isN = (val) => !val ? 'check-active' : '';
        const workers = permit.workers && permit.workers.length > 0 ? permit.workers : ['XIE XIAN (Chef de Projet)', 'ZHOULIN (Chef d\'Équipe)', 'Nouri Chahrour (HSE - 0563765157)'];

        const workersHtml = workers.map((w, idx) => `
            <span class="worker-chip">
                <span>👤</span>
                <span contenteditable="true" onblur="App.updateWorkerName('${permit.id}', ${idx}, this.innerText)">${w}</span>
                <span class="worker-chip-del no-print" onclick="App.removeWorker('${permit.id}', ${idx})">✕</span>
            </span>
        `).join('');

        return `
            <div class="a4-document" style="border: 2px solid #dc2626;">
                <div class="doc-header-exact">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="annexe-letter-badge annexe-letter-b">B</span>
                        <span style="font-size: 16px; font-weight: 900; color: #dc2626;">Travail chaud</span>
                    </div>
                    <div class="doc-logo-box">
                        <span class="logo-sinylon-badge">SINYLON</span>
                        <span class="logo-stellantis-badge">STELLANTIS</span>
                    </div>
                    <div class="doc-header-right-group">
                        <div class="doc-id-box-exact">
                            <strong>Permit Identifier</strong><br>
                            <span style="font-size: 11px; font-weight: bold; color: #dc2626;">${permit.id}</span>
                        </div>
                        <div class="qr-container qr-code-box" title="Scan QR Code Mobile"></div>
                    </div>
                </div>

                <div style="font-size: 8px; font-style: italic; text-align: center; margin-bottom: 4px;">
                    La liste de vérification doit être toujours accompagnée par le permis de travail de sécurité générale
                </div>

                <table class="doc-table-exact">
                    <tr><td>Tous les produits inflammables ou combustibles seront dégagés <strong>10 m (min. 10 m)</strong></td><td><span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td></tr>
                    <tr><td>Si déplacement pas possible : protégés par bâches ignifugées / fire resistant curtains</td><td><span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td></tr>
                    <tr><td>Tous débris, saleté ou poussière enlevés de l'environnement de travail</td><td><span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td></tr>
                    <tr><td>Couvertures résistantes au feu / écran équipé à résister aux étincelles de soudage</td><td><span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td></tr>
                    <tr><td>Fermeture des ouvertures, égouts et caniveaux au sol à proximité</td><td><span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td></tr>
                    <tr><td>Appareils électriques et câbles de soudure protégés et vérifiés</td><td><span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td></tr>
                    <tr><td>Le Site du travail est balisé et barricadé adéquatement</td><td><span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td></tr>
                </table>

                <!-- Équipe intervenants -->
                <div class="doc-workers-box" style="margin-top: 4px;">
                    <div class="doc-workers-header">
                        <span>👥 ÉQUIPE SOUDURE (CHEF DE PROJET & HSE)</span>
                        <button type="button" class="btn-add-worker-mini no-print" onclick="App.promptAddWorker('${permit.id}')">+ AJOUTER UN NOM</button>
                    </div>
                    <div class="doc-workers-tags">${workersHtml}</div>
                </div>

                <!-- Équipement lutte anti-feu -->
                <div class="doc-box-bordered" style="margin-top: 4px; font-size: 8px;">
                    <div style="font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 3px;">
                        Equipement de lutte anti-feu & Surveillance Continue durant les travaux :
                    </div>
                    <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 6px;">
                        <div>
                            Extincteurs de sécurité à portée immédiate : Water [X] Poudre ABC [X] CO2 [X]<br>
                            Couvertures anti-feu et seau d'eau disponibles : [X] OUI<br>
                            <span style="color: #dc2626; font-weight: bold;">Surveillance continue durant toute la durée d'exécution des travaux de soudage / meulage.</span>
                        </div>
                        <div class="doc-box-bordered" style="background: #fef2f2;">
                            Surveillance continue : <strong>Active durant les travaux</strong><br>
                            Contrôle immédiat après arrêt : <strong>[X] Effectué</strong>
                        </div>
                    </div>
                </div>

                <!-- Alarme incendie & bloc sécurité -->
                <div class="doc-box-bordered" style="margin-top: 4px; font-size: 8px;">
                    Poste d'alerte d'urgence le plus proche : <strong style="border: 1px solid #000; padding: 1px 6px; background: #fff;">POSTE CENTRAL SÉCURITÉ STELLANTIS</strong><br>
                    Statut détecteurs d'incendie : <em>Usine en phase montage/chantier — Détecteurs de fumée non activés (Aucun by-pass requis)</em>
                </div>

                <!-- Signatures Chaud -->
                <div style="display: grid; grid-template-columns: 1.5fr 1.5fr 1fr; gap: 6px; margin-top: 6px;">
                    <div class="sign-card-exact">
                        <div class="sign-card-header" style="background: #fecaca;">CHEF DE PROJET</div>
                        <div style="font-size: 8px;">Nom : <strong contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'chef-nom', this.innerText)">${permit['chef-nom'] || 'XIE XIAN'}</strong></div>
                        <div style="font-size: 8px; color: #dc2626; font-weight: bold;">Signature : XIE XIAN (Validé)</div>
                    </div>
                    <div class="sign-card-exact">
                        <div class="sign-card-header" style="background: #fecaca;">HSE ENTREPRISE</div>
                        <div style="font-size: 8px;">Nom : <strong contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'hse-nom', this.innerText)">${permit['hse-nom'] || 'Nouri Chahrour'}</strong></div>
                        <div style="font-size: 8px; color: #dc2626; font-weight: bold;">Signature : Nouri C.</div>
                    </div>
                    <div class="doc-box-bordered" style="font-size: 8px;">
                        Date : <strong contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'date-main', this.innerText)">${permit['date-main'] || '2026-08-24'}</strong><br>
                        Heure : <strong contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'time-start', this.innerText)">${permit['time-start'] || '07h30'}</strong>
                    </div>
                </div>
            </div>
        `;
    },

    // 5. ANNEXE C (JAUNE) — TRAVAIL ÉLECTRIQUE & CONSIGNATION
    // Tirage de câbles, pose des armoires électriques, installation des moteurs & équipements
    electricAnnexe(permit) {
        const el = permit.electricDetails || {};
        const workers = permit.workers && permit.workers.length > 0 ? permit.workers : ['XIE XIAN (Chef de Projet)', 'ZHOULIN (Chef d\'Équipe)', 'Nouri Chahrour (HSE - 0563765157)'];

        const workersHtml = workers.map((w, idx) => `
            <span class="worker-chip">
                <span>👤</span>
                <span contenteditable="true" onblur="App.updateWorkerName('${permit.id}', ${idx}, this.innerText)">${w}</span>
                <span class="worker-chip-del no-print" onclick="App.removeWorker('${permit.id}', ${idx})">✕</span>
            </span>
        `).join('');

        return `
            <div class="a4-document" style="border: 2px solid #d97706;">
                <div class="doc-header-exact">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="annexe-letter-badge annexe-letter-c">C</span>
                        <span style="font-size: 16px; font-weight: 900; color: #d97706;">Travail Électrique & Équipements</span>
                    </div>
                    <div class="doc-logo-box">
                        <span class="logo-sinylon-badge">SINYLON</span>
                        <span class="logo-stellantis-badge">STELLANTIS</span>
                    </div>
                    <div class="doc-header-right-group">
                        <div class="doc-id-box-exact">
                            <strong>Permit Identifier</strong><br>
                            <span style="font-size: 11px; font-weight: bold; color: #d97706;">${permit.id}</span>
                        </div>
                        <div class="qr-container qr-code-box" title="Scan QR Code Mobile"></div>
                    </div>
                </div>

                <div style="font-size: 8px; font-style: italic; text-align: center; margin-bottom: 4px;">
                    Tirage de câbles, Pose des armoires électriques, Installation des moteurs & Raccordement des équipements (Lignes UB / UAR / FUSA)
                </div>

                <div class="doc-workers-box">
                    <div class="doc-workers-header">
                        <span>👥 ÉQUIPE TRAVAUX ÉLECTRIQUES & ÉQUIPEMENTS (CHEF DE PROJET & HSE)</span>
                        <button type="button" class="btn-add-worker-mini no-print" onclick="App.promptAddWorker('${permit.id}')">+ AJOUTER UN NOM</button>
                    </div>
                    <div class="doc-workers-tags">${workersHtml}</div>
                </div>

                <table class="doc-table-exact" style="margin-top: 6px;">
                    <thead><tr><th>ACTIVITÉ / ÉTAPE NORMATIVE</th><th>DÉTAILS DES TRAVAUX RÉALISÉS</th><th>CONTRÔLE</th></tr></thead>
                    <tbody>
                        <tr><td><strong>1. Tirage de câbles</strong></td><td>Tirage et passage des câbles de puissance, busbars IG2 et câbles de contrôle</td><td><span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td></tr>
                        <tr><td><strong>2. Armoires électriques</strong></td><td>Installation, fixation et mise à la terre des armoires électriques et coffrets divisionnaires</td><td><span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td></tr>
                        <tr><td><strong>3. Moteurs & Actionneurs</strong></td><td>Pose, alignement mécanique et raccordement des moteurs, réducteurs et convoyeurs</td><td><span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td></tr>
                        <tr><td><strong>4. Consignation LOTO</strong></td><td>Cadenassage, étiquetage de sécurité et consignation des sources d'énergie</td><td><span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td></tr>
                        <tr><td><strong>5. V.A.T / Absence Tension</strong></td><td>Vérification d'Absence de Tension avec testeur certifié avant toute intervention</td><td><span class="check-yn"><span class="check-active">.Y.</span><span>N</span></span></td></tr>
                    </tbody>
                </table>

                <div style="display: grid; grid-template-columns: 1.5fr 1.5fr 1fr; gap: 6px; margin-top: 10px;">
                    <div class="sign-card-exact">
                        <div class="sign-card-header" style="background: #fde68a;">CHEF DE PROJET</div>
                        <div style="font-size: 8px;">Nom : <strong contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'chef-nom', this.innerText)">${permit['chef-nom'] || 'XIE XIAN'}</strong></div>
                        <div style="font-size: 8px; color: #d97706; font-weight: bold;">Signature : XIE XIAN (Validé)</div>
                    </div>
                    <div class="sign-card-exact">
                        <div class="sign-card-header" style="background: #fde68a;">HSE ENTREPRISE</div>
                        <div style="font-size: 8px;">Nom : <strong contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'hse-nom', this.innerText)">${permit['hse-nom'] || 'Nouri Chahrour'}</strong></div>
                        <div style="font-size: 8px; color: #d97706; font-weight: bold;">Signature : Nouri C.</div>
                    </div>
                    <div class="doc-box-bordered" style="font-size: 8px;">
                        Date : <strong contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'date-main', this.innerText)">${permit['date-main'] || '2026-08-24'}</strong><br>
                        Heure : <strong contenteditable="true" onblur="App.updatePermitField('${permit.id}', 'time-start', this.innerText)">${permit['time-start'] || '07h30'}</strong>
                    </div>
                </div>
            </div>
        `;
    },

    // 6. CAISSE WEEK-END RECAP
    caisseSummary(weekendData, dates) {
        const permits = weekendData.all;
        const rows = permits.map((p, idx) => `
            <tr>
                <td class="text-center bold-cell">${idx + 1}</td>
                <td class="bold-cell">${p.id}</td>
                <td><strong>${p.type.toUpperCase()}</strong></td>
                <td><strong>${p.company || 'SINYLON'}</strong></td>
                <td>${p['work-desc'] || p.title || ''}</td>
                <td>${p.ouvrage || ''} (${p.zone || ''})</td>
                <td>${p.isFriday ? '📅 Vendredi' : '📅 Samedi'}</td>
                <td class="text-center bold-cell">${p['chef-nom'] || 'XIE XIAN'} / ${p['receveur-nom'] || 'Xian'}</td>
                <td class="text-center"><span class="sign-badge">CONFORME</span></td>
            </tr>
        `).join('');

        return `
            <div class="a4-document">
                <div class="doc-header-exact">
                    <div class="doc-logo-box">
                        <span class="logo-sinylon-badge">SINYLON</span>
                        <span class="logo-stellantis-badge">STELLANTIS</span>
                    </div>
                    <div class="doc-title-exact">
                        BORDEREAU DE TRANSMISSION — CAISSE WEEK-END<br>
                        <span style="font-size: 8px; font-weight: normal;">(Dossier préparé le Mercredi pour présentation et validation par STELLANTIS)</span>
                    </div>
                    <div class="doc-id-box-exact">
                        <strong>RÉFÉRENCE DOSSIER</strong><br>
                        <span style="font-size: 11px; font-weight: bold; color: #8b5cf6;">CW-${dates.friday.replace(/-/g, '')}</span>
                    </div>
                </div>

                <div class="doc-box-bordered" style="margin-top: 8px; font-size: 8.5px;">
                    <strong>Période du Week-end :</strong> ${dates.rangeLabel} | 
                    <strong>Total Permis Programmés :</strong> <strong>${permits.length} Permis</strong> | 
                    <strong>Supervision :</strong> Ingénieur de Suivi W.P.E.E.X
                </div>

                <table class="doc-table-exact" style="margin-top: 8px;">
                    <thead>
                        <tr>
                            <th style="width: 25px;">N°</th>
                            <th>ID PERMIS</th>
                            <th>TYPE</th>
                            <th>ENTREPRISE</th>
                            <th>DESCRIPTION DES TRAVAUX</th>
                            <th>ZONE</th>
                            <th>JOUR</th>
                            <th>INTERVENANTS</th>
                            <th>VISA</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 14px;">
                    <div class="sign-card-exact">
                        <div class="sign-card-header">SINYLON (Chef de Projet)</div>
                        <div style="font-size: 8px;">Nom : XIE XIAN</div>
                        <div style="font-size: 8px;">Dépôt Dossier Week-end</div>
                    </div>
                    <div class="sign-card-exact wpeex-sign">
                        <div class="sign-card-header">W.P.E.E.X (Ingénieur Suivi)</div>
                        <div style="font-size: 8px;">Nom : M. W.P.E.E.X</div>
                        <div style="font-size: 8px;">Revue Technique & Approbation</div>
                    </div>
                    <div class="sign-card-exact">
                        <div class="sign-card-header">STELLANTIS (Client)</div>
                        <div style="font-size: 8px;">Direction de Site Stellantis</div>
                        <div style="font-size: 8px;">Autorisation d'Accès</div>
                    </div>
                </div>
            </div>
        `;
    }
};

window.Templates = Templates;
