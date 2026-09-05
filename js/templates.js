/**
 * SINYLON - STELLANTIS | Templates A4 Haute Fidélité V4 (MODÈLES OFFICIELS SINYLON - STELLANTIS)
 * Reproduction exacte des photos de permis du chantier Stellantis Algeria K9 CKD0
 * - Signatures et visas VIDES pour émargement manuscrit au stylo / tampon
 * - Revalidation quotidienne certifiée à 08h00 chaque matin
 * - Annexe A (Bleue), Annexe B (Rouge), Annexe C (Ambre) conformes aux formulaires SINYLON - STELLANTIS
 */

const Templates = {

    // Rendu dynamique d'une case de signature (Manuscrite électronique ou à signer)
    renderSigBox(permit, role, title, defaultName, subtitle = '') {
        const p = permit || {};
        const sigs = p.signatures || {};
        const sig = sigs[role];
        const name = sig ? (sig.signatoryName || defaultName) : defaultName;

        if (sig && sig.dataUrl) {
            return `
                <div style="border:1.5px solid #16a34a;background:#fff;padding:2px 4px;font-size:7px;min-height:44px;display:flex;flex-direction:column;justify-content:space-between;border-radius:2px;box-shadow:0 1px 4px rgba(22,163,74,0.15);">
                    <div style="background:#dcfce7;color:#15803d;font-weight:900;padding:1px 3px;text-align:center;border-bottom:1px solid #16a34a;font-size:7px;letter-spacing:0.3px;">${title}</div>
                    <div style="font-size:6.5px;">Nom : <strong>${name}</strong></div>
                    <div style="display:flex;align-items:center;justify-content:space-between;background:#f0fdf4;border:1px solid #86efac;border-radius:2px;padding:1px 4px;margin:1px 0;">
                        <img src="${sig.dataUrl}" style="height:20px;max-width:95px;object-fit:contain;" alt="Signature">
                        <div style="font-size:5.5px;color:#16a34a;font-weight:900;text-align:right;line-height:1;">
                            ✓ SIGNÉ SUR SITE<br>${sig.date} ${sig.time}
                        </div>
                    </div>
                    ${subtitle ? `<div style="font-size:5px;color:#555;line-height:1;">${subtitle}</div>` : ''}
                </div>
            `;
        }

        // Si signature par défaut pour Semaine 36
        return `
            <div style="border:1px solid #000;background:#fff;padding:2px 4px;font-size:7px;min-height:44px;display:flex;flex-direction:column;justify-content:space-between;">
                <div style="background:#bfdbfe;font-weight:bold;padding:1px 3px;text-align:center;border-bottom:1px solid #000;font-size:7px;">${title}</div>
                <div style="font-size:6.5px;">Nom : <strong>${defaultName}</strong></div>
                <div style="height:18px;border-bottom:1px dashed #999;color:#2563eb;font-size:6px;display:flex;align-items:flex-end;justify-content:space-between;cursor:pointer;" onclick="if(window.SignaturePad)SignaturePad.open('${p.id}','${role}')">
                    <span style="color:#777;">Signature :</span>
                    <span style="font-size:6px;font-weight:bold;background:#eff6ff;color:#1d4ed8;padding:1px 4px;border-radius:2px;border:1px solid #bfdbfe;">✍️ Signer</span>
                </div>
                ${subtitle ? `<div style="font-size:5px;color:#555;line-height:1;">${subtitle}</div>` : ''}
            </div>
        `;
    },

    // Logo officiel SINYLON - STELLANTIS
    renderLogoSinylonStellantis() {
        return `
            <div style="display:inline-flex;align-items:center;gap:6px;vertical-align:middle;">
                <span style="background:#000;color:#fff;font-weight:900;font-size:13px;padding:2px 7px;border-radius:2px;letter-spacing:1px;">SINYLON</span>
                <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:13px;padding:1px 7px;border-radius:2px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
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
                        Scannez ce QR Code pour vérifier en direct la validité journalière <strong>(Validité Hebdomadaire)</strong>, les visas M. W.P.E.E.X / Sinylon et les habilitations.
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
    // =========================================================================
    // PAGE 1 : PERMIS DE TRAVAIL DE SECURITÉ GÉNÉRALE (RECTO - PAGE 1/2)
    // REPRODUCTION EXACTE DE LA PHOTO HSE Sinylon ADAPTÉE POUR SINYLON - STELLANTIS
    // Utilise dynamiquement la description et les données du permis dans l'application
    // =========================================================================
    generalP1(permit) {
        const p = permit || {};
        const dangers = p.dangers || {};
        const isHeight = !!dangers.height;
        const isHot = !!dangers.hot;
        const isElec = !!dangers.electric;
        const isConfined = !!dangers.confined;
        const isTension = !!dangers.tension;
        const isExcav = !!dangers.excavation;
        const isRupture = !!dangers.rupture;

        // Description exacte provenant de l'application / JSON
        const workDescription = p['work-desc'] || p.description || p.desc || '';
        const workDescEn = p['work-desc-en'] || '';

        return `
        <div class="a4-document" style="font-family:Arial,Helvetica,sans-serif;color:#000;padding:5mm 8mm 4mm 8mm;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;height:297mm;overflow:hidden;position:relative;">
            <div>
                <!-- EN-TÊTE : EXACT PHOTO -->
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px;">
                    <div style="flex:1;text-align:center;padding-left:40px;">
                        <div style="font-size:16px;font-weight:900;letter-spacing:0.2px;text-transform:none;">
                            Permis de Travail de Securité Générale
                        </div>
                        <div style="font-size:8.5px;color:#000;margin-top:1px;">
                            (à afficher sur le site de travail )
                        </div>
                    </div>
                    <div style="display:flex;align-items:center;gap:12px;">
                        <div style="display:flex;align-items:center;gap:5px;">
                            <span style="background:#000;color:#fff;font-weight:900;font-size:14px;padding:2px 7px;border-radius:2px;letter-spacing:1px;">SINYLON</span>
                            <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:14px;padding:1px 7px;border-radius:2px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
                        </div>
                        <div style="border:1px solid #000;text-align:center;width:130px;">
                            <div style="font-size:7.5px;font-weight:700;border-bottom:1px solid #000;padding:1px 4px;background:#f8fafc;">Identifiant du permis</div>
                            <div style="font-size:12px;font-weight:900;padding:1px 4px;color:#000;">${p.id || 'SYN-K9-KW35'}</div>
                        </div>
                    </div>
                </div>

                <!-- SECTION 1 : BRÈVE DESCRIPTION DU TRAVAIL (BANDEAU JAUNE) -->
                <div style="border:1px solid #000;margin-top:3px;">
                    <div style="background:#ffeb3b;border-bottom:1px solid #000;padding:2px 6px;font-weight:900;font-size:8.5px;text-align:center;">
                        Bréve description du travail
                    </div>
                    <div style="padding:4px 6px;min-height:38px;font-size:7.5px;line-height:1.25;color:#000;">
                        ${workDescription}
                        ${workDescEn ? `<div style="font-size:7px;color:#475569;font-style:italic;margin-top:2px;">${workDescEn}</div>` : ''}
                    </div>
                </div>

                <!-- SECTION 2 : ENDROIT DE TRAVAIL & ÉQUIPEMENTS (BANDEAUX JAUNES) -->
                <div style="display:grid;grid-template-columns:1fr 1fr;border:1px solid #000;border-top:none;">
                    <div style="border-right:1px solid #000;">
                        <div style="background:#ffeb3b;border-bottom:1px solid #000;padding:2px 6px;font-weight:900;font-size:8.5px;text-align:center;">
                            Endroit de travail:
                        </div>
                        <div style="padding:3px 6px;font-size:7.5px;min-height:34px;">
                            <strong>Localisation :</strong> ${p.location || p.ouvrage || 'Bâtiment Montage Stellantis — Lignes FUSA / UAR / UB'}<br>
                            <strong>Secteur :</strong> ${p.ouvrage || 'Atelier Assemblage Stellantis (Algeria K9 CKD0)'}
                        </div>
                    </div>
                    <div>
                        <div style="background:#ffeb3b;border-bottom:1px solid #000;padding:2px 6px;font-weight:900;font-size:8.5px;text-align:center;">
                            Equipment/Machinerie / Zone sur lequel s'effectue le travail
                        </div>
                        <div style="padding:3px 6px;font-size:7.5px;min-height:34px;">
                            <strong>ZONE :</strong> <span style="font-weight:bold;color:#1e3a8a;">${p.zone || 'Zones FUSA / UAR / UB'}</span><br>
                            <strong>Équipements :</strong> Postes de soudage ARO, Pinces manuelles, Nacelles ciseaux (x6), Manlift, Palans DEMAG
                        </div>
                    </div>
                </div>

                <!-- SECTION 3 : ENTREPRISE INTERVENANTE & CONTACTS -->
                <div style="display:grid;grid-template-columns:1.2fr 1fr;border:1px solid #000;border-top:none;font-size:7.5px;">
                    <div style="border-right:1px solid #000;padding:3px 6px;">
                        <div><strong>Entreprise Intervenante :</strong> <span style="font-weight:bold;">${p.company || 'SINYLON'}</span></div>
                        <div style="color:#333;margin-top:1px;">Avant de commencer le travail, veuillez contacter:</div>
                        <div style="margin-top:1px;"><strong>Nom:</strong> ${p['chef-nom'] || 'XIE XIAN (Chef de Projet)'}</div>
                    </div>
                    <div style="padding:3px 6px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span>Plan d'urgence du site attaché</span>
                            <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                <span style="padding:0 3px;">Y</span>
                                <span style="background:#000;color:#fff;padding:0 3px;">N</span>
                            </span>
                        </div>
                        <div style="margin-top:2px;">
                            <strong>Ouvrage :</strong> ${p.ouvrage ? 'Stellantis K9' : 'Stellantis K9'}&nbsp;&nbsp;&nbsp;
                            <strong>ZONE :</strong> ${p.zone || 'FUSA/UAR/UB'}&nbsp;&nbsp;&nbsp;
                            <strong>Tél. :</strong> ${p.tel || '0562765157'}
                        </div>
                    </div>
                </div>

                <!-- SECTION 4 : GRANDS DANGERS (EXACT PHOTO) -->
                <div style="border:1px solid #000;border-top:none;padding:2px 6px 4px 6px;font-size:7px;">
                    <div style="font-size:7.5px;font-style:italic;margin-bottom:2px;color:#000;">
                        si oui, la liste de verification des grands danger suivante doit etre attachée &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; de &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; de
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                        <!-- Colonne gauche -->
                        <div>
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                                <span>Travail en hauteur</span>
                                <span>
                                    <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                        <span style="${isHeight ? 'background:#000;color:#fff;' : ''}padding:0 2px;">.Y.</span>
                                        <span style="${!isHeight ? 'background:#000;color:#fff;' : ''}padding:0 2px;">N</span>
                                    </span>
                                    <strong style="margin-left:4px;font-size:8px;">A</strong>
                                </span>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                                <span>Travail dans un espace confiné</span>
                                <span>
                                    <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                        <span style="${isConfined ? 'background:#000;color:#fff;' : ''}padding:0 2px;">.Y.</span>
                                        <span style="${!isConfined ? 'background:#000;color:#fff;' : ''}padding:0 2px;">N</span>
                                    </span>
                                    <strong style="margin-left:4px;font-size:8px;">B</strong>
                                </span>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                                <span>Travail sur un système électrique</span>
                                <span>
                                    <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                        <span style="${isElec ? 'background:#000;color:#fff;' : ''}padding:0 2px;">.Y.</span>
                                        <span style="${!isElec ? 'background:#000;color:#fff;' : ''}padding:0 2px;">N</span>
                                    </span>
                                    <strong style="margin-left:4px;font-size:8px;">C</strong>
                                </span>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                                <span>Ouvrir un système/une ligne de rupture ( ligne Hydraulique etc )</span>
                                <span>
                                    <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                        <span style="${isRupture ? 'background:#000;color:#fff;' : ''}padding:0 2px;">.Y.</span>
                                        <span style="${!isRupture ? 'background:#000;color:#fff;' : ''}padding:0 2px;">N</span>
                                    </span>
                                    <strong style="margin-left:4px;font-size:8px;">D</strong>
                                </span>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                                <span>Autre travaux dangereux: (si oui veuillez spécifier ci-dessous)</span>
                                <span>
                                    <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                        <span style="padding:0 2px;">.Y.</span>
                                        <span style="background:#000;color:#fff;padding:0 2px;">N</span>
                                    </span>
                                    <strong style="margin-left:4px;font-size:8px;">E</strong>
                                </span>
                            </div>
                        </div>

                        <!-- Colonne droite -->
                        <div>
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                                <span>Travail à chaud</span>
                                <span>
                                    <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                        <span style="${isHot ? 'background:#000;color:#fff;' : ''}padding:0 2px;">Y</span>
                                        <span style="${!isHot ? 'background:#000;color:#fff;' : ''}padding:0 2px;">N</span>
                                    </span>
                                    <strong style="margin-left:4px;font-size:8px;">B</strong>
                                </span>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                                <span>Excavation</span>
                                <span>
                                    <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                        <span style="${isExcav ? 'background:#000;color:#fff;' : ''}padding:0 2px;">.Y.</span>
                                        <span style="${!isExcav ? 'background:#000;color:#fff;' : ''}padding:0 2px;">N</span>
                                    </span>
                                    <strong style="margin-left:4px;font-size:8px;">D</strong>
                                </span>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                                <span>Travail sur equipement sous tension</span>
                                <span>
                                    <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                        <span style="${isTension ? 'background:#000;color:#fff;' : ''}padding:0 2px;">.Y.</span>
                                        <span style="${!isTension ? 'background:#000;color:#fff;' : ''}padding:0 2px;">N</span>
                                    </span>
                                    <strong style="margin-left:4px;font-size:8px;">E</strong>
                                </span>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                                <span>Exposition/Cond. Atmosphérique</span>
                                <span>
                                    <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                        <span style="padding:0 2px;">.Y.</span>
                                        <span style="background:#000;color:#fff;padding:0 2px;">N</span>
                                    </span>
                                    <strong style="margin-left:4px;font-size:8px;">F</strong>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Lignes Déclaration de méthode & MOC -->
                    <div style="border-top:1px dashed #aaa;margin-top:3px;padding-top:2px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1px;">
                            <span>Declaration de methode requis</span>
                            <span>
                                <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                    <span style="background:#000;color:#fff;padding:0 2px;">Y</span>
                                    <span style="padding:0 2px;">N</span>
                                </span>
                                <strong style="margin-left:4px;font-size:8px;">G</strong>
                            </span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1px;">
                            <span>Autre listes de verification attachées (si oui spécifier ci-dessous)</span>
                            <span>
                                <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                    <span style="padding:0 2px;">Y</span>
                                    <span style="background:#000;color:#fff;padding:0 2px;">N</span>
                                </span>
                            </span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1px;">
                            <div style="display:flex;align-items:center;gap:8px;">
                                <span>Est ce travail, une modification couverte par MOC?</span>
                                <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                    <span style="padding:0 2px;">Y</span>
                                    <span style="background:#000;color:#fff;padding:0 2px;">N</span>
                                </span>
                            </div>
                            <div>
                                <span>MOC Ref. Nr. / Id.</span>
                                <span style="border-bottom:1px solid #000;display:inline-block;width:90px;height:10px;"></span> /
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SECTION 5 : VALIDITÉ DU PERMIS ET SIGNATURES -->
                <div style="border:1px solid #000;border-top:none;padding:3px 6px;">
                    <div style="font-weight:900;font-size:8.5px;margin-bottom:2px;">
                        validité du permis et signatures
                    </div>
                    <div style="display:flex;gap:15px;align-items:center;font-size:7.5px;margin-bottom:2px;">
                        <div>Date du permis : <span style="border:1px solid #000;padding:1px 6px;font-weight:bold;font-family:monospace;">${p.date_debut || '2026-08-24'}</span></div>
                        <div>heure de début : <span style="border:1px solid #000;padding:1px 6px;font-weight:bold;font-family:monospace;">${p['time-start'] || '08h00'}</span></div>
                        <div>heure de fin : <span style="border:1px solid #000;padding:1px 6px;font-weight:bold;font-family:monospace;">${p['time-end'] || '17h30'}</span></div>
                    </div>
                    <div style="font-size:6.5px;color:#333;line-height:1.2;margin-bottom:3px;">
                        Ce permis de travail de sécurité générale et sa liste de verification des grands danger avec le meme identifiant du permis sont uniquement valide pour la date et la période spécifiée ci-dessus. Toute les signatures doivent etre obtenues avant l'entame du travail. Permis affiché sur le lieu de travail. Copies: Emetteur du permis,receveur du permis et si applicable: Coordinateurr, chef de quart et/ou salle de controle.
                    </div>

                    <!-- GRILLE DES SIGNATURES OFFICIELLES SINYLON AVEC SUPPORT ÉLECTRONIQUE -->
                    <div style="display:grid;grid-template-columns:1fr 1fr 1.2fr;gap:4px;margin-bottom:3px;">
                        ${this.renderSigBox(p, 'chef', 'Chef de Projet Sinylon', p['chef-nom'] || 'XIE XIAN', 'Autorisation officielle des travaux de la semaine')}
                        ${this.renderSigBox(p, 'hse', 'Superviseur HSE Sinylon', p['hse-nom'] || 'Nouri Chahrour', 'Conformité HSE & Mesures de sécurité 360°')}
                        ${this.renderSigBox(p, 'receveur', 'Receveur Sinylon', p['receveur-nom'] || p.chef_equipe || 'ZHOU LIN', 'Engagements d\'application stricte des consignes')}
                    </div>
                </div>

                <!-- SECTION 6 : PERMIT HAND-BACK (EXACT PHOTO) -->
                <div style="border:1px solid #000;border-top:none;padding:3px 6px;font-size:7px;">
                    <div style="font-weight:bold;font-size:8px;">
                        Permit Hand-Back <span style="font-weight:normal;font-size:7px;">(renvoyer à l'emetteur du permis après signature)</span>
                    </div>
                    <div style="font-size:6.5px;color:#444;font-style:italic;margin-bottom:2px;">
                        (superviseur d'unité: veuillez cocher les caases appropriées ci-dessous)
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:8px;margin-bottom:3px;">
                        <!-- Etat de travail -->
                        <div>
                            <div style="font-weight:bold;margin-bottom:1px;">Etat de travail</div>
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <span>Achevé</span>
                                <span style="border:1px solid #000;width:12px;height:12px;display:inline-block;"></span>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1px;">
                                <span>Inachevé (veuillez spécifier ci-dessous)</span>
                                <span style="border:1px solid #000;width:12px;height:12px;display:inline-block;"></span>
                            </div>
                        </div>
                        <!-- Etat de la surface -->
                        <div>
                            <div style="font-weight:bold;margin-bottom:1px;">Etat de la surface/installation/équipmer</div>
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <span>pret pour l'operation normale</span>
                                <span style="border:1px solid #000;width:12px;height:12px;display:inline-block;"></span>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1px;">
                                <span>pas pret (veuillez spécifier ci-dessous)</span>
                                <span style="border:1px solid #000;width:12px;height:12px;display:inline-block;"></span>
                            </div>
                        </div>
                    </div>

                    <!-- Signatures Hand-Back (EXACT PHOTO - 2 LIGNES) -->
                    <div style="display:grid;grid-template-columns:1.2fr 1.2fr 1fr;gap:4px;margin-bottom:3px;">
                        <div style="border:1px solid #000;background:#fff;padding:2px 4px;min-height:30px;display:flex;flex-direction:column;justify-content:space-between;">
                            <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;font-size:7px;">Receveur du permis</div>
                            <div style="font-size:6px;color:#555;">Nom (lettres en majuscule) et signature:</div>
                            <div style="height:12px;border-bottom:1px dashed #999;font-size:6px;color:#777;">Signature :</div>
                        </div>
                        <div style="border:1px solid #000;background:#fff;padding:2px 4px;min-height:30px;display:flex;flex-direction:column;justify-content:space-between;">
                            <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;font-size:7px;">M. W.P.E.E.X - Ingénieur de Suivi</div>
                            <div style="font-size:6px;color:#555;">Nom(lettres en majuscule) et signature:</div>
                            <div style="height:12px;border-bottom:1px dashed #999;font-size:6px;color:#777;">Signature :</div>
                        </div>
                        <div style="display:flex;flex-direction:column;justify-content:center;gap:3px;font-size:7px;">
                            <div style="display:flex;gap:4px;align-items:center;">
                                <span>Date:</span>
                                <span style="border:1px solid #000;flex:1;height:14px;"></span>
                            </div>
                            <div style="display:flex;gap:4px;align-items:center;">
                                <span>Heure:</span>
                                <span style="border:1px solid #000;flex:1;height:14px;"></span>
                            </div>
                        </div>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
                        <div style="border:1px solid #000;background:#fff;padding:2px 4px;min-height:30px;display:flex;flex-direction:column;justify-content:space-between;">
                            <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;font-size:7px;">Chef de Projet Entreprise</div>
                            <div style="font-size:6px;color:#555;">Nom (lettres en majuscule) et signature:</div>
                            <div style="height:12px;border-bottom:1px dashed #999;font-size:6px;color:#777;">Signature :</div>
                        </div>
                        <div style="border:1px solid #000;background:#fff;padding:2px 4px;min-height:30px;display:flex;flex-direction:column;justify-content:space-between;">
                            <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;font-size:7px;">HSE Entreprise</div>
                            <div style="font-size:6px;color:#555;">Nom (lettres en majuscule) et signature:</div>
                            <div style="height:12px;border-bottom:1px dashed #999;font-size:6px;color:#777;">Signature :</div>
                        </div>
                    </div>
                </div>

                <!-- PIED DE PAGE EXACT PHOTO : Numéro d'urgence / Mobile / Page 1/2 -->
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:8px;font-weight:bold;margin-top:3px;padding:0 4px;">
                    <div>Numéro d'urgence : <span style="font-weight:normal;">0562765157 / 14</span></div>
                    <div>Mobile : <span style="font-weight:normal;">0562765157</span></div>
                    <div>Page 1/2</div>
                </div>
            </div>

            <!-- Discrete Secure QR Footer for Online Verification at 08h00 -->
            ${this.renderFooterQR(p)}
        </div>
        `;
    },

    // 2. PERMIS GÉNÉRAL - PAGE 2/2 (VERSO REVALIDATIONS DU JOUR 2 AU JOUR 7)
    // Tableau avec colonnes Visa et Signature VIDES pour émargement manuscrit chaque matin à 08h00
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
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">M. Sinylon</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Ingénieur Suivi</td>
                    <!-- CASE VISA WPEEX VIDE POUR SIGNATURE MANUELLE À 08H00 -->
                    <td class="text-center" style="border:1px solid #000;padding:2px;width:110px;">
                        <div style="height:20px;border-bottom:1px dashed #999;margin:1px 4px;"></div>
                    </td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Xie</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Chef de Projet</td>
                    <!-- CASE SIGNATURE SINYLON VIDE POUR SIGNATURE MANUELLE À 08H00 -->
                    <td class="text-center" style="border:1px solid #000;padding:2px;width:110px;">
                        <div style="height:20px;border-bottom:1px dashed #999;margin:1px 4px;"></div>
                    </td>
                    <td class="no-print text-center" style="border:1px solid #000;padding:2px;font-size:7.5px;">
                        <span style="color:#16a34a;font-weight:700;">À signer 08h00</span>
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
                        ${this.renderLogoSinylonStellantis()}
                    </div>
                    <div class="doc-title-exact" style="font-size:14px;font-weight:900;text-align:center;flex:1;">
                        Revalidation Quotidienne du Permis de Travail<br>
                        <span style="font-size:7.5px;font-weight:normal;color:#333;">Daily Work Permit Revalidation Sheet (Contrôle et émargement chaque matin à 08h00)</span>
                    </div>
                    <div class="doc-header-right-group">
                        <div class="doc-id-box-exact" style="border:1.5px solid #000;padding:2px 8px;text-align:center;border-radius:2px;background:#f8fafc;">
                            <strong style="font-size:7.5px;">Permit ID</strong><br>
                            <span style="font-size:12px;font-weight:900;color:#1e3a8a;">${permit.id}</span>
                        </div>
                    </div>
                </div>

                <div class="yellow-bar-header" style="background:#ffeb3b;border:1px solid #000;padding:3px 6px;font-weight:900;font-size:8.5px;margin-top:6px;display:flex;justify-content:space-between;">
                    <span>REVALIDATION QUOTIDIENNE DU PERMIS (DU JOUR 2 AU JOUR 7 — ÉMARGEMENT SUR SITE À 08H00)</span>
                    <span style="font-size:7.5px;font-weight:normal;font-style:italic;">Chaque matin avant le démarrage des travaux</span>
                </div>
                <table class="doc-table-exact" style="width:100%;border-collapse:collapse;margin-top:4px;">
                    <thead>
                        <tr style="background:#f1f5f9;font-size:7.5px;">
                            <th rowspan="2" style="border:1px solid #000;padding:3px 4px;width:95px;">JOURNÉE</th>
                            <th rowspan="2" style="border:1px solid #000;padding:3px 4px;width:75px;">DATE</th>
                            <th colspan="3" style="border:1px solid #000;padding:2px;background:#eff6ff;color:#1e3a8a;">Sinylon - Ingénieur de Suivi</th>
                            <th colspan="3" style="border:1px solid #000;padding:2px;">Responsable d'exécution (SINYLON)</th>
                            <th rowspan="2" class="no-print" style="border:1px solid #000;padding:2px;width:70px;">STATUT</th>
                        </tr>
                        <tr style="background:#f8fafc;font-size:7px;">
                            <th style="border:1px solid #000;padding:2px;">Nom</th>
                            <th style="border:1px solid #000;padding:2px;">Fonction</th>
                            <th style="border:1px solid #000;padding:2px;background:#eff6ff;color:#1e3a8a;">Visa Manuscrit </th>
                            <th style="border:1px solid #000;padding:2px;">Nom</th>
                            <th style="border:1px solid #000;padding:2px;">Fonction</th>
                            <th style="border:1px solid #000;padding:2px;">Signature Manuscrite </th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.join('')}
                    </tbody>
                </table>

                <div class="yellow-bar-header" style="background:#ffeb3b;border:1px solid #000;padding:3px 6px;font-weight:900;font-size:8.5px;margin-top:10px;">
                    SUPERVISION SPÉCIALE CAISSE WEEK-END (VENDREDI / SAMEDI — 08H00)
                </div>
                <table class="doc-table-exact" style="width:100%;border-collapse:collapse;margin-top:4px;font-size:7.5px;">
                    <thead>
                        <tr style="background:#f1f5f9;">
                            <th style="border:1px solid #000;padding:3px;width:80px;">JOURNÉE</th>
                            <th style="border:1px solid #000;padding:3px;width:85px;">DATE</th>
                            <th style="border:1px solid #000;padding:3px;">SUPERVISEUR Sinylon</th>
                            <th style="border:1px solid #000;padding:3px;">CONTRÔLE SÉCURITÉ </th>
                            <th style="border:1px solid #000;padding:3px;width:150px;">VISA CAISSE STELLANTIS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="height:28px;">
                            <td class="text-center bold-cell" style="border:1px solid #000;font-weight:bold;padding:3px;">Vendredi</td>
                            <td class="text-center" style="border:1px solid #000;font-family:monospace;padding:3px;">2026-08-28</td>
                            <td style="border:1px solid #000;padding:3px;">M. Sinylon</td>
                            <td style="border:1px solid #000;padding:3px;">Vérification 360°, Nacelles, Extincteurs, Balisage</td>
                            <td style="border:1px solid #000;padding:2px;text-align:center;">
                                <div style="height:20px;border-bottom:1px dashed #999;margin:1px 6px;"></div>
                            </td>
                        </tr>
                        <tr style="height:28px;">
                            <td class="text-center bold-cell" style="border:1px solid #000;font-weight:bold;padding:3px;">Samedi</td>
                            <td class="text-center" style="border:1px solid #000;font-family:monospace;padding:3px;">2026-08-29</td>
                            <td style="border:1px solid #000;padding:3px;">M. Sinylon</td>
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
    // REPRODUCTION EXACTE DE LA PHOTO SINYLON - STELLANTIS (Cadre Bleu, Logo SINYLON - STELLANTIS, Checklist exacte)
    heightAnnexe(permit) {
        const chefNom = permit.responsible || permit.chefNom || 'Xie';
        const hseNom = permit.hseNom || 'Nouri Chahrour';
        const datePermis = permit.validFrom || permit['date-main'] || '2026-08-24';

        return `
            <div class="a4-document annexe-height-doc" id="a4-doc-${permit.id}-height" style="border:3px solid #004080;padding:5px 8px;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;font-size:7.5px;line-height:1.2;color:#000;">
                
                <!-- EN-TÊTE EXACT PHOTO SINYLON - STELLANTIS -->
                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #004080;padding-bottom:3px;margin-bottom:3px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="background:#000;color:#fff;font-size:22px;font-weight:900;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:2px;">A</div>
                        <div style="font-size:17px;font-weight:900;color:#000;letter-spacing:0.3px;">Travail en hauteur</div>
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;">
                        ${this.renderLogoSinylonStellantis()}
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
                                <span style="border:1px solid #000;flex:1;padding:1px 3px;font-family:monospace;font-size:7.5px;">08h00</span>
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
    // REPRODUCTION EXACTE DE LA PHOTO SINYLON - STELLANTIS (Cadre Rouge, Logo SINYLON - STELLANTIS, Checklist exacte)
    hotAnnexe(permit) {
        const chefNom = permit.responsible || permit.chefNom || 'Xie';
        const hseNom = permit.hseNom || 'Nouri Chahrour';
        const datePermis = permit.validFrom || permit['date-main'] || '2026-08-24';

        return `
            <div class="a4-document annexe-hot-doc" id="a4-doc-${permit.id}-hot" style="border:3px solid #cc0000;padding:5px 8px;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;font-size:7.5px;line-height:1.2;color:#000;">
                
                <!-- EN-TÊTE EXACT PHOTO SINYLON - STELLANTIS -->
                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #cc0000;padding-bottom:3px;margin-bottom:3px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="background:#000;color:#fff;font-size:22px;font-weight:900;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:2px;">B</div>
                        <div style="font-size:17px;font-weight:900;color:#000;letter-spacing:0.3px;">Travail chaud</div>
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;">
                        ${this.renderLogoSinylonStellantis()}
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
                            <span style="font-size:6.5px;color:#555;">(Tel. Stellantis Security / HSE Sinylon 24h/24)</span>
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
                                <span style="border:1px solid #000;flex:1;padding:1px 3px;font-family:monospace;font-size:7.5px;">08h00</span>
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
    // REPRODUCTION EXACTE DU STANDARD SINYLON - STELLANTIS (Cadre Ambre, Logo SINYLON - STELLANTIS, Checklist LOTO)
    electricAnnexe(permit) {
        const chefNom = permit.responsible || permit.chefNom || 'Xie';
        const hseNom = permit.hseNom || 'Nouri Chahrour';
        const datePermis = permit.validFrom || permit['date-main'] || '2026-08-24';

        return `
            <div class="a4-document annexe-elec-doc" id="a4-doc-${permit.id}-electric" style="border:3px solid #d97706;padding:5px 8px;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;font-size:7.5px;line-height:1.2;color:#000;">
                
                <!-- EN-TÊTE EXACT SINYLON - STELLANTIS -->
                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #d97706;padding-bottom:3px;margin-bottom:3px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="background:#000;color:#fff;font-size:22px;font-weight:900;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:2px;">C</div>
                        <div style="font-size:17px;font-weight:900;color:#000;letter-spacing:0.3px;">Travail électrique &amp; Consignation</div>
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;">
                        ${this.renderLogoSinylonStellantis()}
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
                                Chargé de Consignation Sinylon / M. W.P.E.E.X : <strong>Nouri Chahrour / Xie Xian</strong> — N° Cadenas : <span style="border-bottom:1px solid #000;display:inline-block;width:35%;height:10px;">LOTO-SINY-01</span>
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
                                <span style="border:1px solid #000;flex:1;padding:1px 3px;font-family:monospace;font-size:7.5px;">08h00</span>
                            </div>
                        </td>
                    </tr>
                </table>

                <!-- QR CODE FOOTER DÉDIÉ -->
                ${this.renderFooterQR(permit)}
            </div>
        `;
    },

    // =========================================================================
    // NOUVEAU : AFFICHE A4 OFFICIELLE D'ENTRÉE DE ZONE (UB / UAR / FUSA)
    // À COLLER SUR LES PALISSADES / ENTRÉES DE ZONE SUR CHANTIER
    // =========================================================================
    renderZonePosterA4(permit, zoneKey = null) {
        const p = permit || {};
        
        // Résolution stricte de la zone (UB, UAR ou FUSA)
        let z = (zoneKey && zoneKey !== 'ALL') ? zoneKey : (p.zoneKey || '');
        if (!z || !['UB', 'UAR', 'FUSA'].includes(z.toUpperCase())) {
            if (p.id && p.id.includes('UAR')) z = 'UAR';
            else if (p.id && p.id.includes('FUSA')) z = 'FUSA';
            else if (p.id && p.id.includes('UB')) z = 'UB';
            else if (p.zone && p.zone.includes('UAR')) z = 'UAR';
            else if (p.zone && p.zone.includes('FUSA')) z = 'FUSA';
            else z = 'UB';
        }
        z = z.toUpperCase();

        const zoneMeta = {
            UB: {
                name: 'ZONE UB — UNDERBODY (SOUBASSEMENT CENTRAL)',
                nameZh: 'UB 区域 (中底盘工位)',
                badgeColor: '#1d4ed8',
                bgBadge: '#dbeafe',
                borderColor: '#2563eb',
                icon: '🏗️',
                desc: 'Traçage au sol, ancrages chimiques, charpentes, lignes de manutention et montage outillages.',
                equip: 'Nacelles ciseaux, Manlift, Palans DEMAG KBK, Visseuses dynamométriques'
            },
            UAR: {
                name: 'ZONE UAR — UNDERBODY REAR (SOUBASSEMENT ARRIÈRE)',
                nameZh: 'UAR 区域 (后底盘工位)',
                badgeColor: '#0369a1',
                bgBadge: '#e0f2fe',
                borderColor: '#0284c7',
                icon: '🔩',
                desc: 'Montage structures aériennes, pose des guides, raccordement eau/air et travaux en hauteur.',
                equip: 'Nacelles ciseaux électriques, Harnais de sécurité doubles longes, Lignes de vie'
            },
            FUSA: {
                name: 'ZONE FUSA — FRONT UNDERBODY SUB-ASSEMBLY (AVANT)',
                nameZh: 'FUSA 区域 (前底盘分总成)',
                badgeColor: '#b45309',
                bgBadge: '#fef3c7',
                borderColor: '#d97706',
                icon: '⚡',
                desc: 'Lignes de soudage par points, charpentes métalliques, armoires électriques et consignation LOTO.',
                equip: 'Postes de soudure conformes, Extincteurs CO2, Cadenas LOTO, Écrans thermiques'
            }
        };

        const activeZone = zoneMeta[z] || zoneMeta['UB'];
        const weekNum = p.week || p.week_num || 36;
        
        // Identifiant officiel du permis de zone
        let permitZoneId = p.id;
        if (!permitZoneId) {
            permitZoneId = `K9-W${weekNum}-${z}`;
        } else if (!permitZoneId.includes(z)) {
            permitZoneId = `${permitZoneId}-${z}`;
        }
        
        const validDeb = p.validFrom || p.date_debut || '2026-08-31';
        const validFin = p.validUntil || p.date_fin || '2026-09-06';

        // Filtrer les tâches spécifiques à la zone
        let tasksList = [];
        if (p.tasks_fr && Array.isArray(p.tasks_fr)) {
            tasksList = p.tasks_fr.filter(t => t.includes(`[${z}]`));
            if (tasksList.length === 0) tasksList = p.tasks_fr;
        } else {
            const rawDesc = p['work-desc'] || p.title || '';
            tasksList = rawDesc.split(';').map(t => t.trim()).filter(Boolean);
        }

        const payload = `https://permis-sinylon.onrender.com/?permitId=${permitZoneId}`;

        let svgQr = '';
        const engine = typeof window !== 'undefined' ? (window.QRCodeGenerator || window.QRCode) : (typeof QRCodeGenerator !== 'undefined' ? QRCodeGenerator : null);
        if (engine && typeof engine.toSVG === 'function') {
            try {
                svgQr = engine.toSVG(payload, { size: 180, margin: 1 });
            } catch(e) {}
        }
        if (!svgQr || svgQr.length < 50) {
            svgQr = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(payload)}" style="width:100%;height:100%;object-fit:contain;" alt="QR Code">`;
        }

        return `
        <div class="a4-document zone-poster-a4" style="font-family:Arial,Helvetica,sans-serif;color:#000;padding:6mm 8mm;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;height:297mm;overflow:hidden;border:3.5px solid ${activeZone.borderColor};background:#fff;">
            
            <!-- 1. EN-TÊTE CORPORATE OFFICIEL -->
            <div style="border-bottom:2px solid #000;padding-bottom:6px;display:flex;justify-content:space-between;align-items:center;">
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="background:#000;color:#fff;font-weight:900;font-size:16px;padding:3px 10px;border-radius:3px;letter-spacing:1px;">SINYLON</span>
                    <span style="border:2px solid #000;color:#000;font-weight:900;font-size:16px;padding:2px 10px;border-radius:3px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:11px;font-weight:900;color:#1e3a8a;text-transform:uppercase;letter-spacing:1px;">Chantier Tafraoui · Usine K9 CKD0</div>
                    <div style="font-size:8px;color:#475569;">Projet Assemblage Véhicules Utilitaires Stellantis Algérie</div>
                </div>
                <div style="border:2px solid #000;background:#f8fafc;padding:3px 10px;text-align:center;border-radius:4px;">
                    <div style="font-size:7.5px;font-weight:800;color:#64748b;">PERMIS N°</div>
                    <div style="font-size:13px;font-weight:900;font-family:monospace;color:#000;">${permitZoneId}</div>
                </div>
            </div>

            <!-- 2. TITRE GÉANT DU POSTER DE ZONE -->
            <div style="background:${activeZone.bgBadge};border:2.5px solid ${activeZone.borderColor};border-radius:8px;padding:10px 14px;text-align:center;margin-top:6px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                <div style="font-size:10px;font-weight:900;color:${activeZone.badgeColor};text-transform:uppercase;letter-spacing:1.5px;margin-bottom:2px;">
                    ${activeZone.icon} AFFICHAGE RÉGLEMENTAIRE DE SÉCURITÉ DE ZONE
                </div>
                <div style="font-size:18px;font-weight:900;color:#000;letter-spacing:0.5px;line-height:1.2;">
                    ${activeZone.name}
                </div>
                <div style="font-size:11px;color:#334155;font-weight:700;margin-top:2px;">
                    ${activeZone.nameZh}
                </div>
            </div>

            <!-- 3. BANDEAU DE VALIDITÉ HEBDOMADAIRE & HORAIRES -->
            <div style="display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:8px;margin-top:6px;">
                <div style="border:1.5px solid #16a34a;background:#f0fdf4;border-radius:6px;padding:6px 10px;text-align:center;">
                    <div style="font-size:7.5px;font-weight:800;color:#166534;">STATUT DU PERMIS DE ZONE</div>
                    <div style="font-size:12px;font-weight:900;color:#15803d;margin-top:1px;">🟢 AUTORISÉ & ACTIF (SEMAINE ${weekNum})</div>
                </div>
                <div style="border:1.5px solid #000;background:#f8fafc;border-radius:6px;padding:6px 10px;text-align:center;">
                    <div style="font-size:7.5px;font-weight:800;color:#475569;">PÉRIODE DE VALIDITÉ</div>
                    <div style="font-size:10.5px;font-weight:900;color:#000;margin-top:1px;">${validDeb} → ${validFin}</div>
                </div>
                <div style="border:1.5px solid #000;background:#f8fafc;border-radius:6px;padding:6px 10px;text-align:center;">
                    <div style="font-size:7.5px;font-weight:800;color:#475569;">HORAIRES AUTORISÉS</div>
                    <div style="font-size:10.5px;font-weight:900;color:#000;margin-top:1px;">08h00 → 17h30</div>
                </div>
            </div>

            <!-- 4. CORPS PRINCIPAL : QR CODE GÉANT DE SCAN + TÂCHES AUTORISÉES -->
            <div style="display:grid;grid-template-columns:220px 1fr;gap:12px;margin-top:8px;align-items:stretch;">
                
                <!-- BLOC QR CODE GÉANT -->
                <div style="border:2px solid #000;border-radius:8px;padding:10px;text-align:center;background:#f8fafc;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                    <div style="font-size:8.5px;font-weight:900;color:#000;text-transform:uppercase;margin-bottom:6px;letter-spacing:0.5px;">
                        📱 SCAN CONTRÔLE HSE
                    </div>
                    <div style="width:160px;height:160px;background:#fff;border:2px solid #000;border-radius:6px;padding:4px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(0,0,0,0.15);">
                        ${svgQr}
                    </div>
                    <div style="font-size:7.5px;font-weight:800;color:#1e3a8a;margin-top:6px;line-height:1.2;">
                        Scannez pour vérifier en direct les visas de M. W.P.E.E.X, habilitations et revalidation
                    </div>
                </div>

                <!-- BLOC TÂCHES AUTORISÉES & ÉQUIPEMENTS -->
                <div style="border:1.5px solid #000;border-radius:8px;padding:10px 12px;background:#fff;display:flex;flex-direction:column;justify-content:space-between;">
                    <div>
                        <div style="font-size:9.5px;font-weight:900;color:#000;border-bottom:1.5px solid #000;padding-bottom:3px;margin-bottom:6px;text-transform:uppercase;">
                            📋 ACTIVITÉS AUTORISÉES EN ${activeZone.name.split('—')[0].trim()} :
                        </div>
                        <ul style="margin:0;padding-left:14px;font-size:8.5px;line-height:1.4;color:#1e293b;">
                            ${tasksList.map(t => `<li style="margin-bottom:3px;"><strong>${t}</strong></li>`).join('')}
                        </ul>
                    </div>

                    <div style="margin-top:8px;background:#f1f5f9;border:1px solid #cbd5e1;border-radius:6px;padding:6px 8px;">
                        <div style="font-size:7.5px;font-weight:800;color:#475569;text-transform:uppercase;">Outillages & Équipements de Levage Homologués :</div>
                        <div style="font-size:8px;color:#0f172a;font-weight:600;margin-top:2px;">${activeZone.equip}</div>
                    </div>
                </div>
            </div>

            <!-- 5. MATRICE DE SÉCURITÉ & ANNEXES EXIGÉES POUR LA ZONE -->
            <div style="border:1.5px solid #000;border-radius:6px;padding:8px 12px;margin-top:8px;background:#fff;">
                <div style="font-size:8.5px;font-weight:900;color:#000;margin-bottom:4px;text-transform:uppercase;">
                    🛡️ CONSIGNES CRITIQUES & ANNEXES DU DOSSIER ASSOCIÉES À CETTE ZONE :
                </div>
                <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:6px;font-size:7.5px;">
                    <div style="border:1px solid #0284c7;background:#f0f9ff;padding:4px 6px;border-radius:4px;text-align:center;">
                        <strong style="color:#0284c7;">ANNEXE A (HAUTEUR)</strong><br>
                        <span>Harnais double longe obligatoire dès 1.80m</span>
                    </div>
                    <div style="border:1px solid #dc2626;background:#fef2f2;padding:4px 6px;border-radius:4px;text-align:center;">
                        <strong style="color:#dc2626;">ANNEXE B (CHAUD)</strong><br>
                        <span>Extincteur 6kg + écran thermique + veille 30min</span>
                    </div>
                    <div style="border:1px solid #d97706;background:#fffbeb;padding:4px 6px;border-radius:4px;text-align:center;">
                        <strong style="color:#d97706;">ANNEXE C (LOTO)</strong><br>
                        <span>Consignation cadenassée TGBT & Armoires</span>
                    </div>
                    <div style="border:1px solid #16a34a;background:#f0fdf4;padding:4px 6px;border-radius:4px;text-align:center;">
                        <strong style="color:#16a34a;">59 INTERVENANTS</strong><br>
                        <span>Badges & Stickers casques SINYLON validés</span>
                    </div>
                </div>
            </div>

            <!-- 6. BLOC DE SIGNATURES OFFICIELLES DU PERMIS DE ZONE -->
            <div style="border:1.5px solid #000;border-radius:6px;padding:6px 10px;margin-top:8px;background:#f8fafc;">
                <div style="font-size:8px;font-weight:900;color:#000;margin-bottom:4px;text-transform:uppercase;text-align:center;">
                    VISAS & ÉMARGEMENTS DU PERMIS DE ZONE (VALIDITÉ SEMAINE ${weekNum})
                </div>
                <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:6px;">
                    ${this.renderSigBox(p, 'wpeex', 'M. W.P.E.E.X', p['wpeex-nom'] || 'M. W.P.E.E.X', 'Ingénieur de Suivi Sinylon / Stellantis')}
                    ${this.renderSigBox(p, 'chef', 'Xie Xian', p['chef-nom'] || 'Xie Xian', 'Responsable Exécution Sinylon')}
                    ${this.renderSigBox(p, 'hse', 'Nouri Chahrour', p['hse-nom'] || 'Nouri Chahrour', 'Superviseur HSE Sinylon')}
                </div>
            </div>

            <!-- 7. FOOTER DE BAS D'AFFICHE -->
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:7px;color:#64748b;margin-top:4px;border-top:1px solid #cbd5e1;padding-top:3px;">
                <div>Document officiel de chantier · Affichage obligatoire à l'entrée de la zone de travail</div>
                <div>SINYLON & W.P.E.E.X · Système Permis Stellantis K9</div>
                <div>Date d'impression : ${new Date().toLocaleDateString('fr-FR')}</div>
            </div>
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
