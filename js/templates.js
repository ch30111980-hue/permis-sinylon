/**
 * SINYLON - STELLANTIS | Templates A4 Haute Fidélité V5 (CALIBRAGE PLEIN FORMAT A4)
 * Reproduction exacte des formulaires officiels du chantier Stellantis Algeria K9 CKD0
 * - Polices optimisées (8.5px à 10px corps, 18px-20px titres) pour lisibilité immédiate sans loupe
 * - Occupation harmonieuse de 100% de la hauteur A4 (297mm) sans débordement ni grand vide
 * - Signatures électroniques et manuelles intégrées avec zones de signature confortables (min-height: 60px-70px)
 * - Page 2 complète : Revalidation quotidienne (J2-J7) + Caisse Week-end + Registre des 59 Intervenants & Contrôles HSE Stellantis
 * - Annexes A (Hauteur), B (Chaud), C (Élec LOTO) & Affiche Zone A4 au standard d'ingénierie KORTI
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
                <div style="border:1.5px solid #16a34a;background:#fff;padding:4px 6px;font-size:8.5px;min-height:65px;display:flex;flex-direction:column;justify-content:space-between;border-radius:3px;box-shadow:0 1px 4px rgba(22,163,74,0.15);">
                    <div style="background:#dcfce7;color:#15803d;font-weight:900;padding:2px 4px;text-align:center;border-bottom:1px solid #16a34a;font-size:8.5px;letter-spacing:0.3px;">${title}</div>
                    <div style="font-size:8px;margin-top:1px;">Nom : <strong>${name}</strong></div>
                    <div style="display:flex;align-items:center;justify-content:space-between;background:#f0fdf4;border:1px solid #86efac;border-radius:2px;padding:2px 5px;margin:2px 0;">
                        <img src="${sig.dataUrl}" style="height:26px;max-width:110px;object-fit:contain;" alt="Signature">
                        <div style="font-size:6.5px;color:#16a34a;font-weight:900;text-align:right;line-height:1.1;">
                            ✓ SIGNÉ SUR SITE<br>${sig.date} ${sig.time}
                        </div>
                    </div>
                    ${subtitle ? `<div style="font-size:6.5px;color:#555;line-height:1.1;">${subtitle}</div>` : ''}
                </div>
            `;
        }

        // Si non encore signé
        return `
            <div style="border:1.2px solid #000;background:#fff;padding:4px 6px;font-size:8.5px;min-height:65px;display:flex;flex-direction:column;justify-content:space-between;border-radius:2px;">
                <div style="background:#bfdbfe;color:#1e3a8a;font-weight:bold;padding:2px 4px;text-align:center;border-bottom:1px solid #000;font-size:8.5px;">${title}</div>
                <div style="font-size:8px;margin-top:1px;">Nom : <strong>${defaultName}</strong></div>
                <div class="no-print" style="height:24px;border-bottom:1px dashed #999;color:#2563eb;font-size:7.5px;display:flex;align-items:flex-end;justify-content:space-between;cursor:pointer;padding-bottom:1px;" onclick="if(window.SignaturePad)SignaturePad.open('${p.id}','${role}')">
                    <span style="color:#777;font-size:7.5px;">Signature :</span>
                    <span style="font-size:7.5px;font-weight:bold;background:#eff6ff;color:#1d4ed8;padding:2px 6px;border-radius:2px;border:1px solid #bfdbfe;">✍️ Signer</span>
                </div>
                <div class="print-only-manual" style="display:none;height:24px;padding-top:4px;">
                    <div style="border-bottom:1px dashed #000;height:14px;"></div>
                    <div style="font-size:6px;color:#555;text-align:center;font-weight:bold;">Visa / Signature manuscrite</div>
                </div>
                ${subtitle ? `<div style="font-size:6.5px;color:#555;line-height:1.1;">${subtitle}</div>` : ''}
            </div>
        `;
    },

    // Logo officiel SINYLON - STELLANTIS
    renderLogoSinylonStellantis() {
        return `
            <div style="display:inline-flex;align-items:center;gap:6px;vertical-align:middle;">
                <span style="background:#000;color:#fff;font-weight:900;font-size:14px;padding:3px 8px;border-radius:2px;letter-spacing:1px;">SINYLON</span>
                <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:14px;padding:2px 8px;border-radius:2px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
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
                svgQr = engine.toSVG(payload, { size: 48, margin: 1 });
            } catch(e) {}
        }
        if (!svgQr || svgQr.length < 50) {
            svgQr = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(payload)}" style="width:100%;height:100%;object-fit:contain;" alt="QR Code">`;
        }

        return `
            <div class="doc-footer-qr-verification" style="margin-top:auto;border:1.5px solid #000;padding:4px 10px;background:#f8fafc;border-radius:3px;display:flex;justify-content:space-between;align-items:center;box-sizing:border-box;">
                <div class="qr-verify-text" style="font-size:8.5px;color:#000;line-height:1.25;flex:1;">
                    <div style="font-weight:900;font-size:9.5px;text-transform:uppercase;color:#000;letter-spacing:0.5px;">
                        🛡️ VÉRIFICATION ÉLECTRONIQUE / DIGITAL WORK PERMIT QR VERIFICATION
                    </div>
                    <div style="font-size:8px;color:#334155;margin-top:1px;">
                        Scannez ce QR Code pour vérifier en direct la validité journalière <strong>(Validité Hebdomadaire)</strong>, les visas M. W.P.E.E.X / Sinylon et les habilitations.
                    </div>
                    <div style="font-family:monospace;font-weight:800;font-size:9.5px;color:#1e3a8a;margin-top:1px;">
                        PERMIS N° ${permit.id} · PROJET ALGERIA K9 CKD0 · STELLANTIS
                    </div>
                </div>
                <div class="qr-container qr-code-box-footer" id="doc-qr-${permit.id}" title="Scan QR Code" style="width:48px;height:48px;min-width:48px;min-height:48px;background:#fff;border:1.5px solid #000;border-radius:2px;padding:1px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
                    ${svgQr}
                </div>
            </div>
        `;
    },

    // Helper Case à cocher [.Y .N] conforme aux formulaires
    renderCheckYN(value, isYNStyle = true) {
        if (!isYNStyle) {
            return `<span style="border:1px solid #000;padding:1px 4px;font-size:8px;font-weight:800;display:inline-block;">Y</span>`;
        }
        return `
            <span style="border:1px solid #000;display:inline-flex;font-size:8px;font-weight:800;line-height:1;margin-left:4px;vertical-align:middle;">
                <span style="padding:1.5px 4px;border-right:1px solid #000;background:${value===true?'#000':'#fff'};color:${value===true?'#fff':'#000'};">.Y</span>
                <span style="padding:1.5px 4px;background:${value===false?'#000':'#fff'};color:${value===false?'#fff':'#000'};">.N</span>
            </span>
        `;
    },

    // =========================================================================
    // 1. PERMIS GÉNÉRAL - PAGE 1/2 (RECTO)
    // REPRODUCTION EXACTE DU STANDARD SINYLON - STELLANTIS PLEIN FORMAT A4
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
        <div class="a4-document" style="font-family:Arial,Helvetica,sans-serif;color:#000;padding:7mm 9mm 6mm 9mm;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;height:297mm;max-height:297mm;overflow:hidden;position:relative;">
            <div>
                <!-- EN-TÊTE : EXACT PHOTO -->
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;padding-bottom:3px;border-bottom:1.5px solid #000;">
                    <div style="flex:1;text-align:center;padding-left:30px;">
                        <div style="font-size:18.5px;font-weight:900;letter-spacing:0.2px;text-transform:none;color:#000;">
                            Permis de Travail de Securité Générale
                        </div>
                        <div style="font-size:9.5px;color:#333;margin-top:1px;">
                            (à afficher obligatoirement sur le site de travail)
                        </div>
                    </div>
                    <div style="display:flex;align-items:center;gap:12px;">
                        <div style="display:flex;align-items:center;gap:6px;">
                            <span style="background:#000;color:#fff;font-weight:900;font-size:14px;padding:3px 8px;border-radius:2px;letter-spacing:1px;">SINYLON</span>
                            <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:14px;padding:2px 8px;border-radius:2px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
                        </div>
                        <div style="border:1.5px solid #000;text-align:center;width:145px;border-radius:2px;background:#f8fafc;">
                            <div style="font-size:8px;font-weight:800;border-bottom:1px solid #000;padding:2px 4px;background:#f1f5f9;color:#475569;">Identifiant du permis</div>
                            <div style="font-size:13px;font-weight:900;padding:2px 4px;color:#1e3a8a;font-family:monospace;">${p.id || 'SYN-K9-KW36'}</div>
                        </div>
                    </div>
                </div>

                <!-- SECTION 1 : BRÈVE DESCRIPTION DU TRAVAIL (BANDEAU JAUNE) -->
                <div style="border:1.2px solid #000;margin-top:4px;">
                    <div style="background:#ffeb3b;border-bottom:1.2px solid #000;padding:3px 8px;font-weight:900;font-size:9.5px;text-align:center;letter-spacing:0.3px;">
                        Bréve description du travail
                    </div>
                    <div style="padding:6px 10px;min-height:50px;font-size:9px;line-height:1.35;color:#000;">
                        <strong>${workDescription || 'Montage et assemblage structures métalliques, traçage au sol et manutention outillages.'}</strong>
                        ${workDescEn ? `<div style="font-size:8px;color:#475569;font-style:italic;margin-top:3px;">${workDescEn}</div>` : ''}
                    </div>
                </div>

                <!-- SECTION 2 : ENDROIT DE TRAVAIL & ÉQUIPEMENTS (BANDEAUX JAUNES) -->
                <div style="display:grid;grid-template-columns:1fr 1fr;border:1.2px solid #000;border-top:none;">
                    <div style="border-right:1.2px solid #000;">
                        <div style="background:#ffeb3b;border-bottom:1.2px solid #000;padding:3px 8px;font-weight:900;font-size:9.5px;text-align:center;">
                            Endroit de travail:
                        </div>
                        <div style="padding:5px 8px;font-size:9px;min-height:44px;line-height:1.35;">
                            <strong>Localisation :</strong> ${p.location || p.ouvrage || 'Bâtiment Montage Stellantis — Lignes FUSA / UAR / UB'}<br>
                            <strong>Secteur :</strong> ${p.ouvrage || 'Atelier Assemblage Stellantis (Algeria K9 CKD0)'}
                        </div>
                    </div>
                    <div>
                        <div style="background:#ffeb3b;border-bottom:1.2px solid #000;padding:3px 8px;font-weight:900;font-size:9.5px;text-align:center;">
                            Equipment / Machinerie / Zone sur lequel s'effectue le travail
                        </div>
                        <div style="padding:5px 8px;font-size:9px;min-height:44px;line-height:1.35;">
                            <strong>ZONE :</strong> <span style="font-weight:bold;color:#1e3a8a;">${p.zone || 'Zones FUSA / UAR / UB'}</span><br>
                            <strong>Équipements :</strong> Postes de soudage ARO, Pinces manuelles, Nacelles ciseaux (x6), Manlift, Palans DEMAG
                        </div>
                    </div>
                </div>

                <!-- SECTION 3 : ENTREPRISE INTERVENANTE & CONTACTS -->
                <div style="display:grid;grid-template-columns:1.2fr 1fr;border:1.2px solid #000;border-top:none;font-size:9px;line-height:1.35;">
                    <div style="border-right:1.2px solid #000;padding:5px 8px;">
                        <div><strong>Entreprise Intervenante :</strong> <span style="font-weight:bold;color:#1e3a8a;">${p.company || 'SINYLON'}</span></div>
                        <div style="color:#333;margin-top:2px;">Avant de commencer le travail, veuillez contacter:</div>
                        <div style="margin-top:2px;"><strong>Nom :</strong> ${p['chef-nom'] || 'XIE XIAN (Chef de Projet)'}</div>
                    </div>
                    <div style="padding:5px 8px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span>Plan d'urgence du site attaché</span>
                            <span style="border:1px solid #000;display:inline-flex;font-size:8px;font-weight:bold;">
                                <span style="padding:1px 4px;">Y</span>
                                <span style="background:#000;color:#fff;padding:1px 4px;">N</span>
                            </span>
                        </div>
                        <div style="margin-top:3px;">
                            <strong>Ouvrage :</strong> ${p.ouvrage ? 'Stellantis K9' : 'Stellantis K9'}&nbsp;&nbsp;&nbsp;
                            <strong>ZONE :</strong> <span style="font-weight:bold;color:#1e3a8a;">${p.zone || 'FUSA/UAR/UB'}</span>&nbsp;&nbsp;&nbsp;
                            <strong>Tél. :</strong> ${p.tel || '0562765157'}
                        </div>
                    </div>
                </div>

                <!-- SECTION 4 : GRANDS DANGERS (EXACT PHOTO) -->
                <div style="border:1.2px solid #000;border-top:none;padding:4px 8px;font-size:8.5px;">
                    <div style="font-size:8.5px;font-style:italic;margin-bottom:3px;color:#000;">
                        si oui, la liste de vérification des grands dangers suivante doit être attachée :
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                        <!-- Colonne gauche -->
                        <div>
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;">
                                <span>Travail en hauteur</span>
                                <span>
                                    <span style="border:1px solid #000;display:inline-flex;font-size:8px;font-weight:bold;">
                                        <span style="${isHeight ? 'background:#000;color:#fff;' : ''}padding:1px 4px;">.Y.</span>
                                        <span style="${!isHeight ? 'background:#000;color:#fff;' : ''}padding:1px 4px;">N</span>
                                    </span>
                                    <strong style="margin-left:6px;font-size:9.5px;color:#004080;">A</strong>
                                </span>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;">
                                <span>Travail dans un espace confiné</span>
                                <span>
                                    <span style="border:1px solid #000;display:inline-flex;font-size:8px;font-weight:bold;">
                                        <span style="${isConfined ? 'background:#000;color:#fff;' : ''}padding:1px 4px;">.Y.</span>
                                        <span style="${!isConfined ? 'background:#000;color:#fff;' : ''}padding:1px 4px;">N</span>
                                    </span>
                                    <strong style="margin-left:6px;font-size:9.5px;">B</strong>
                                </span>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;">
                                <span>Travail sur un système électrique</span>
                                <span>
                                    <span style="border:1px solid #000;display:inline-flex;font-size:8px;font-weight:bold;">
                                        <span style="${isElec ? 'background:#000;color:#fff;' : ''}padding:1px 4px;">.Y.</span>
                                        <span style="${!isElec ? 'background:#000;color:#fff;' : ''}padding:1px 4px;">N</span>
                                    </span>
                                    <strong style="margin-left:6px;font-size:9.5px;color:#d97706;">C</strong>
                                </span>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;">
                                <span>Ouvrir un système / ligne de rupture</span>
                                <span>
                                    <span style="border:1px solid #000;display:inline-flex;font-size:8px;font-weight:bold;">
                                        <span style="${isRupture ? 'background:#000;color:#fff;' : ''}padding:1px 4px;">.Y.</span>
                                        <span style="${!isRupture ? 'background:#000;color:#fff;' : ''}padding:1px 4px;">N</span>
                                    </span>
                                    <strong style="margin-left:6px;font-size:9.5px;">D</strong>
                                </span>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;">
                                <span>Autre travaux dangereux spécifiés</span>
                                <span>
                                    <span style="border:1px solid #000;display:inline-flex;font-size:8px;font-weight:bold;">
                                        <span style="padding:1px 4px;">.Y.</span>
                                        <span style="background:#000;color:#fff;padding:1px 4px;">N</span>
                                    </span>
                                    <strong style="margin-left:6px;font-size:9.5px;">E</strong>
                                </span>
                            </div>
                        </div>

                        <!-- Colonne droite -->
                        <div>
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;">
                                <span>Travail à chaud</span>
                                <span>
                                    <span style="border:1px solid #000;display:inline-flex;font-size:8px;font-weight:bold;">
                                        <span style="${isHot ? 'background:#000;color:#fff;' : ''}padding:1px 4px;">Y</span>
                                        <span style="${!isHot ? 'background:#000;color:#fff;' : ''}padding:1px 4px;">N</span>
                                    </span>
                                    <strong style="margin-left:6px;font-size:9.5px;color:#cc0000;">B</strong>
                                </span>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;">
                                <span>Excavation</span>
                                <span>
                                    <span style="border:1px solid #000;display:inline-flex;font-size:8px;font-weight:bold;">
                                        <span style="${isExcav ? 'background:#000;color:#fff;' : ''}padding:1px 4px;">.Y.</span>
                                        <span style="${!isExcav ? 'background:#000;color:#fff;' : ''}padding:1px 4px;">N</span>
                                    </span>
                                    <strong style="margin-left:6px;font-size:9.5px;">D</strong>
                                </span>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;">
                                <span>Travail sur équipement sous tension</span>
                                <span>
                                    <span style="border:1px solid #000;display:inline-flex;font-size:8px;font-weight:bold;">
                                        <span style="${isTension ? 'background:#000;color:#fff;' : ''}padding:1px 4px;">.Y.</span>
                                        <span style="${!isTension ? 'background:#000;color:#fff;' : ''}padding:1px 4px;">N</span>
                                    </span>
                                    <strong style="margin-left:6px;font-size:9.5px;">E</strong>
                                </span>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;">
                                <span>Exposition / Cond. Atmosphérique</span>
                                <span>
                                    <span style="border:1px solid #000;display:inline-flex;font-size:8px;font-weight:bold;">
                                        <span style="padding:1px 4px;">.Y.</span>
                                        <span style="background:#000;color:#fff;padding:1px 4px;">N</span>
                                    </span>
                                    <strong style="margin-left:6px;font-size:9.5px;">F</strong>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Lignes Déclaration de méthode & MOC -->
                    <div style="border-top:1px dashed #aaa;margin-top:4px;padding-top:3px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
                            <span>Déclaration de méthode requise :</span>
                            <span>
                                <span style="border:1px solid #000;display:inline-flex;font-size:8px;font-weight:bold;">
                                    <span style="background:#000;color:#fff;padding:1px 4px;">Y</span>
                                    <span style="padding:1px 4px;">N</span>
                                </span>
                                <strong style="margin-left:6px;font-size:9px;">G</strong>
                            </span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:2px;">
                            <div style="display:flex;align-items:center;gap:8px;">
                                <span>Est-ce un travail couvert par MOC (Management of Change) ?</span>
                                <span style="border:1px solid #000;display:inline-flex;font-size:8px;font-weight:bold;">
                                    <span style="padding:1px 4px;">Y</span>
                                    <span style="background:#000;color:#fff;padding:1px 4px;">N</span>
                                </span>
                            </div>
                            <div>
                                <span>MOC Ref. Nr. / Id. :</span>
                                <span style="border-bottom:1px solid #000;display:inline-block;width:100px;height:12px;"></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SECTION 5 : VALIDITÉ DU PERMIS ET SIGNATURES -->
                <div style="border:1.2px solid #000;border-top:none;padding:4px 8px;">
                    <div style="font-weight:900;font-size:9.5px;margin-bottom:3px;text-transform:uppercase;">
                        Validité du permis et signatures
                    </div>
                    <div style="display:flex;gap:18px;align-items:center;font-size:9px;margin-bottom:3px;">
                        <div>Date du permis : <span style="border:1px solid #000;padding:2px 8px;font-weight:bold;font-family:monospace;background:#f8fafc;">${p.validFrom || p.date_debut || p['date-main'] || '2026-08-31'}</span></div>
                        <div>Heure de début : <span style="border:1px solid #000;padding:2px 8px;font-weight:bold;font-family:monospace;background:#f8fafc;">${p['time-start'] || '08h00'}</span></div>
                        <div>Heure de fin : <span style="border:1px solid #000;padding:2px 8px;font-weight:bold;font-family:monospace;background:#f8fafc;">${p['time-end'] || '17h30'}</span></div>
                    </div>
                    <div style="font-size:7.5px;color:#333;line-height:1.25;margin-bottom:4px;">
                        Ce permis de travail de sécurité générale et sa liste de vérification des grands dangers sont valides uniquement pour la période spécifiée. Toutes les signatures doivent être obtenues avant l'entame du travail. Permis obligatoirement affiché sur le lieu de travail.
                    </div>

                    <!-- GRILLE DES SIGNATURES OFFICIELLES SINYLON -->
                    <div style="display:grid;grid-template-columns:1fr 1fr 1.2fr;gap:6px;margin-bottom:4px;">
                        ${this.renderSigBox(p, 'chef', 'Chef de Projet Sinylon', p['chef-nom'] || 'XIE XIAN', 'Autorisation officielle des travaux de la semaine')}
                        ${this.renderSigBox(p, 'hse', 'Superviseur HSE Sinylon', p['hse-nom'] || 'Nouri Chahrour', 'Conformité HSE & Mesures de sécurité 360°')}
                        ${this.renderSigBox(p, 'receveur', 'Receveur Sinylon', p['receveur-nom'] || p.chef_equipe || 'ZHOU LIN', 'Engagements d\'application stricte des consignes')}
                    </div>
                </div>

                <!-- SECTION 6 : PERMIT HAND-BACK (EXACT PHOTO) -->
                <div style="border:1.2px solid #000;border-top:none;padding:4px 8px;font-size:8.5px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
                        <span style="font-weight:bold;font-size:9.5px;">Permit Hand-Back <span style="font-weight:normal;font-size:8px;">(renvoyer à l'émetteur du permis après signature)</span></span>
                        <span style="font-size:7.5px;color:#444;font-style:italic;">Superviseur d'unité : veuillez cocher les cases ci-dessous</span>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:12px;margin-bottom:4px;">
                        <!-- État de travail -->
                        <div>
                            <div style="font-weight:bold;margin-bottom:2px;">État du travail</div>
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <span>Achevé</span>
                                <span style="border:1px solid #000;width:14px;height:14px;display:inline-block;"></span>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:2px;">
                                <span>Inachevé (veuillez spécifier ci-dessous)</span>
                                <span style="border:1px solid #000;width:14px;height:14px;display:inline-block;"></span>
                            </div>
                        </div>
                        <!-- État de la surface -->
                        <div>
                            <div style="font-weight:bold;margin-bottom:2px;">État de la surface / installation / équipement</div>
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <span>Prêt pour l'opération normale</span>
                                <span style="border:1px solid #000;width:14px;height:14px;display:inline-block;"></span>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:2px;">
                                <span>Pas prêt (veuillez spécifier ci-dessous)</span>
                                <span style="border:1px solid #000;width:14px;height:14px;display:inline-block;"></span>
                            </div>
                        </div>
                    </div>

                    <!-- Signatures Hand-Back (EXACT PHOTO - 2 LIGNES) -->
                    <div style="display:grid;grid-template-columns:1.2fr 1.2fr 1fr;gap:6px;margin-bottom:4px;">
                        <div style="border:1px solid #000;background:#fff;padding:3px 5px;min-height:36px;display:flex;flex-direction:column;justify-content:space-between;">
                            <div style="background:#bfdbfe;font-weight:bold;padding:1px 3px;text-align:center;font-size:8px;">Receveur du permis</div>
                            <div style="font-size:7px;color:#555;">Nom (lettres en majuscule) et signature:</div>
                            <div style="height:14px;border-bottom:1px dashed #999;font-size:7px;color:#777;">Signature :</div>
                        </div>
                        <div style="border:1px solid #000;background:#fff;padding:3px 5px;min-height:36px;display:flex;flex-direction:column;justify-content:space-between;">
                            <div style="background:#bfdbfe;font-weight:bold;padding:1px 3px;text-align:center;font-size:8px;">M. W.P.E.E.X - Ingénieur de Suivi</div>
                            <div style="font-size:7px;color:#555;">Nom (lettres en majuscule) et signature:</div>
                            <div style="height:14px;border-bottom:1px dashed #999;font-size:7px;color:#777;">Signature :</div>
                        </div>
                        <div style="display:flex;flex-direction:column;justify-content:center;gap:3px;font-size:8px;">
                            <div style="display:flex;gap:4px;align-items:center;">
                                <span>Date :</span>
                                <span style="border:1px solid #000;flex:1;height:16px;"></span>
                            </div>
                            <div style="display:flex;gap:4px;align-items:center;">
                                <span>Heure :</span>
                                <span style="border:1px solid #000;flex:1;height:16px;"></span>
                            </div>
                        </div>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                        <div style="border:1px solid #000;background:#fff;padding:3px 5px;min-height:36px;display:flex;flex-direction:column;justify-content:space-between;">
                            <div style="background:#bfdbfe;font-weight:bold;padding:1px 3px;text-align:center;font-size:8px;">Chef de Projet Entreprise</div>
                            <div style="font-size:7px;color:#555;">Nom (lettres en majuscule) et signature:</div>
                            <div style="height:14px;border-bottom:1px dashed #999;font-size:7px;color:#777;">Signature :</div>
                        </div>
                        <div style="border:1px solid #000;background:#fff;padding:3px 5px;min-height:36px;display:flex;flex-direction:column;justify-content:space-between;">
                            <div style="background:#bfdbfe;font-weight:bold;padding:1px 3px;text-align:center;font-size:8px;">HSE Entreprise</div>
                            <div style="font-size:7px;color:#555;">Nom (lettres en majuscule) et signature:</div>
                            <div style="height:14px;border-bottom:1px dashed #999;font-size:7px;color:#777;">Signature :</div>
                        </div>
                    </div>
                </div>

                <!-- PIED DE PAGE EXACT PHOTO : Numéro d'urgence / Mobile / Page 1/2 -->
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:9px;font-weight:bold;margin-top:4px;padding:0 6px;">
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

    // =========================================================================
    // 2. PERMIS GÉNÉRAL - PAGE 2/2 (VERSO REVALIDATIONS + EFFECTIFS HABILITÉS)
    // PLEIN FORMAT A4 : TABLEAUX REVALIDATIONS + CAISSE + 59 INTERVENANTS
    // =========================================================================
    generalP2(permit) {
        const dStart = permit.validFrom || permit['date-main'] || '2026-08-31';
        const startDate = new Date(dStart);

        const wpeexNom = permit['wpeex-nom'] || 'M. W.P.E.E.X';
        const chefNom = permit['chef-nom'] || 'Xie Xian';
        const hseNom = permit['hse-nom'] || 'Nouri Chahrour';

        const sigs = permit.signatures || {};
        const dailySigs = permit.dailySignatures || {};

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

            const daySpecificSigs = dailySigs[dateStr] || {};
            const wSig = daySpecificSigs.wpeex || sigs.wpeex;
            const cSig = daySpecificSigs.chef || sigs.chef;
            const isRowSigned = Boolean((wSig && wSig.dataUrl) || (cSig && cSig.dataUrl));

            return `
                <tr style="height:31px;">
                    <td class="text-center bold-cell" style="font-weight:bold;font-size:8.5px;border:1px solid #000;padding:3px 6px;">${dayInfo.name}</td>
                    <td class="text-center" style="font-family:monospace;font-size:8.5px;border:1px solid #000;padding:3px 6px;">${dateStr}</td>
                    <td style="border:1px solid #000;padding:3px 6px;font-size:8.5px;font-weight:${wSig ? 'bold' : 'normal'};">${wSig ? wpeexNom : ''}</td>
                    <td style="border:1px solid #000;padding:3px 6px;font-size:8.5px;">Ingénieur Suivi</td>
                    <td class="text-center" style="border:1px solid #000;padding:2px;width:125px;background:#f8fafc;">
                        ${wSig && wSig.dataUrl ? `
                            <div style="display:flex;align-items:center;justify-content:center;gap:5px;padding:1px 2px;">
                                <img src="${wSig.dataUrl}" style="height:22px;max-width:80px;object-fit:contain;" alt="Visa">
                                <span style="font-size:6.5px;color:#16a34a;font-weight:900;line-height:1.1;">✓ 08:00<br>${wSig.date || dateStr}</span>
                            </div>
                        ` : `
                            <div class="no-print" style="height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;" onclick="if(window.SignaturePad)SignaturePad.open('${permit.id}','wpeex','${dateStr}','${dayInfo.name}')">
                                <span style="font-size:7.5px;font-weight:bold;background:#eff6ff;color:#1d4ed8;padding:2px 8px;border-radius:3px;border:1px solid #bfdbfe;">✍️ Émarger 08h</span>
                            </div>
                            <div class="print-only-manual" style="display:none;padding:1px 2px;height:24px;">
                                <div style="border-bottom:1px dashed #000;height:16px;margin:0 4px;"></div>
                                <div style="font-size:6px;color:#475569;text-align:center;font-weight:bold;line-height:1;">Visa / Émargement manuel</div>
                            </div>
                        `}
                    </td>
                    <td style="border:1px solid #000;padding:3px 6px;font-size:8.5px;font-weight:${cSig ? 'bold' : 'normal'};">${cSig ? chefNom : ''}</td>
                    <td style="border:1px solid #000;padding:3px 6px;font-size:8.5px;">Chef de Projet</td>
                    <td class="text-center" style="border:1px solid #000;padding:2px;width:125px;background:#f8fafc;">
                        ${cSig && cSig.dataUrl ? `
                            <div style="display:flex;align-items:center;justify-content:center;gap:5px;padding:1px 2px;">
                                <img src="${cSig.dataUrl}" style="height:22px;max-width:80px;object-fit:contain;" alt="Signature">
                                <span style="font-size:6.5px;color:#16a34a;font-weight:900;line-height:1.1;">✓ 08:00<br>${cSig.date || dateStr}</span>
                            </div>
                        ` : `
                            <div class="no-print" style="height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;" onclick="if(window.SignaturePad)SignaturePad.open('${permit.id}','chef','${dateStr}','${dayInfo.name}')">
                                <span style="font-size:7.5px;font-weight:bold;background:#f8fafc;color:#0f172a;padding:2px 8px;border-radius:3px;border:1px solid #cbd5e1;">✍️ Signer 08h</span>
                            </div>
                            <div class="print-only-manual" style="display:none;padding:1px 2px;height:24px;">
                                <div style="border-bottom:1px dashed #000;height:16px;margin:0 4px;"></div>
                                <div style="font-size:6px;color:#475569;text-align:center;font-weight:bold;line-height:1;">Signature manuelle</div>
                            </div>
                        `}
                    </td>
                    <td class="text-center" style="border:1px solid #000;padding:2px;font-size:8px;">
                        ${isRowSigned ? `<span style="color:#16a34a;font-weight:900;font-size:7.5px;">🟢 CONFORME</span>` : `<span class="no-print" style="color:#94a3b8;font-size:7.5px;">En attente</span><span class="print-only-manual" style="display:none;font-size:6.5px;font-weight:bold;color:#000;">[  ] O.K.</span>`}
                    </td>
                </tr>
            `;
        });

        const friDate = new Date(startDate);
        friDate.setDate(startDate.getDate() + 4);
        const friDateStr = friDate.toISOString().split('T')[0];

        const satDate = new Date(startDate);
        satDate.setDate(startDate.getDate() + 5);
        const satDateStr = satDate.toISOString().split('T')[0];

        const friSig = (dailySigs[friDateStr] && dailySigs[friDateStr].hse) || sigs.hse;
        const satSig = (dailySigs[satDateStr] && dailySigs[satDateStr].hse) || sigs.hse;

        return `
            <div class="a4-document" id="a4-doc-${permit.id}-p2" style="font-family:Arial,Helvetica,sans-serif;color:#000;padding:7mm 9mm 6mm 9mm;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;height:297mm;max-height:297mm;overflow:hidden;position:relative;">
                <div>
                    <!-- EN-TÊTE : REVALIDATION QUOTIDIENNE -->
                    <div class="doc-header-exact" style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #000;padding-bottom:4px;margin-bottom:4px;">
                        <div class="doc-logo-box" style="display:flex;align-items:center;gap:6px;">
                            <span style="background:#000;color:#fff;font-weight:900;font-size:14px;padding:3px 8px;border-radius:2px;">SINYLON</span>
                            <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:14px;padding:2px 8px;border-radius:2px;background:#fff;">STELLANTIS</span>
                        </div>
                        <div class="doc-title-exact" style="font-size:16px;font-weight:900;text-align:center;flex:1;">
                            Revalidation Quotidienne du Permis de Travail<br>
                            <span style="font-size:8.5px;font-weight:normal;color:#333;">Daily Work Permit Revalidation Sheet (Contrôle et émargement chaque matin à 08h00)</span>
                        </div>
                        <div class="doc-header-right-group">
                            <div class="doc-id-box-exact" style="border:1.5px solid #000;padding:2px 10px;text-align:center;border-radius:2px;background:#f8fafc;">
                                <strong style="font-size:8px;color:#64748b;">Permit ID</strong><br>
                                <span style="font-size:13px;font-weight:900;color:#1e3a8a;font-family:monospace;">${permit.id}</span>
                            </div>
                        </div>
                    </div>

                    <!-- SECTION 1 : REVALIDATION DU JOUR 2 AU JOUR 7 -->
                    <div class="yellow-bar-header" style="background:#ffeb3b;border:1.2px solid #000;padding:3px 8px;font-weight:900;font-size:9px;margin-top:4px;display:flex;justify-content:space-between;letter-spacing:0.3px;">
                        <span>REVALIDATION QUOTIDIENNE DU PERMIS (DU JOUR 2 AU JOUR 7 — ÉMARGEMENT SUR SITE À 08H00)</span>
                        <span style="font-size:8px;font-weight:normal;font-style:italic;">Chaque matin avant le démarrage des travaux</span>
                    </div>
                    <table class="doc-table-exact" style="width:100%;border-collapse:collapse;margin-top:2px;">
                        <thead>
                            <tr style="background:#f1f5f9;font-size:8px;">
                                <th rowspan="2" style="border:1px solid #000;padding:3px 4px;width:100px;">JOURNÉE</th>
                                <th rowspan="2" style="border:1px solid #000;padding:3px 4px;width:80px;">DATE</th>
                                <th colspan="3" style="border:1px solid #000;padding:2px;background:#eff6ff;color:#1e3a8a;">Ingénieur de Suivi</th>
                                <th colspan="3" style="border:1px solid #000;padding:2px;">Responsable d'exécution (SINYLON)</th>
                                <th rowspan="2" style="border:1px solid #000;padding:2px;width:75px;">STATUT</th>
                            </tr>
                            <tr style="background:#f8fafc;font-size:7.5px;">
                                <th style="border:1px solid #000;padding:2px;">Nom</th>
                                <th style="border:1px solid #000;padding:2px;">Fonction</th>
                                <th style="border:1px solid #000;padding:2px;background:#eff6ff;color:#1e3a8a;">Visa Électronique</th>
                                <th style="border:1px solid #000;padding:2px;">Nom</th>
                                <th style="border:1px solid #000;padding:2px;">Fonction</th>
                                <th style="border:1px solid #000;padding:2px;">Signature Électronique</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.join('')}
                        </tbody>
                    </table>

                    <!-- SECTION 2 : SUPERVISION SPÉCIALE WEEK-END -->
                    <div class="yellow-bar-header" style="background:#ffeb3b;border:1.2px solid #000;padding:3px 8px;font-weight:900;font-size:9px;margin-top:6px;letter-spacing:0.3px;">
                        SUPERVISION SPÉCIALE CAISSE WEEK-END (VENDREDI / SAMEDI — 08H00)
                    </div>
                    <table class="doc-table-exact" style="width:100%;border-collapse:collapse;margin-top:2px;font-size:8.5px;">
                        <thead>
                            <tr style="background:#f1f5f9;font-size:8px;">
                                <th style="border:1px solid #000;padding:3px;width:90px;">JOURNÉE</th>
                                <th style="border:1px solid #000;padding:3px;width:90px;">DATE</th>
                                <th style="border:1px solid #000;padding:3px;">SUPERVISEUR HSE</th>
                                <th style="border:1px solid #000;padding:3px;">CONTRÔLE SÉCURITÉ 360°</th>
                                <th style="border:1px solid #000;padding:3px;width:180px;">VISA CAISSE ÉLECTRONIQUE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="height:31px;">
                                <td class="text-center bold-cell" style="border:1px solid #000;font-weight:bold;padding:3px;">Vendredi</td>
                                <td class="text-center" style="border:1px solid #000;font-family:monospace;padding:3px;">${friDateStr}</td>
                                <td style="border:1px solid #000;padding:3px;font-weight:bold;">${friSig ? hseNom : 'Nouri Chahrour'}</td>
                                <td style="border:1px solid #000;padding:3px;">Vérification 360°, Nacelles, Extincteurs, Balisage</td>
                                <td style="border:1px solid #000;padding:2px;text-align:center;background:#f8fafc;">
                                    ${friSig && friSig.dataUrl ? `
                                        <div style="display:flex;align-items:center;justify-content:center;gap:6px;">
                                            <img src="${friSig.dataUrl}" style="height:22px;max-width:90px;object-fit:contain;" alt="Visa Caisse">
                                            <span style="font-size:6.5px;color:#16a34a;font-weight:900;">✓ VISA OK 08H00<br>${friSig.date}</span>
                                        </div>
                                    ` : `
                                        <div class="no-print" style="height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;" onclick="if(window.SignaturePad)SignaturePad.open('${permit.id}','hse','${friDateStr}','Caisse Vendredi')">
                                            <span style="font-size:7.5px;font-weight:bold;background:#eff6ff;color:#1d4ed8;padding:2px 8px;border-radius:3px;border:1px solid #bfdbfe;">✍️ Visa Caisse (08h00)</span>
                                        </div>
                                        <div class="print-only-manual" style="display:none;padding:1px 2px;height:24px;">
                                            <div style="border-bottom:1px dashed #000;height:16px;margin:0 10px;"></div>
                                            <div style="font-size:6px;color:#475569;text-align:center;font-weight:bold;line-height:1;">Visa Caisse manuel HSE</div>
                                        </div>
                                    `}
                                </td>
                            </tr>
                            <tr style="height:31px;">
                                <td class="text-center bold-cell" style="border:1px solid #000;font-weight:bold;padding:3px;">Samedi</td>
                                <td class="text-center" style="border:1px solid #000;font-family:monospace;padding:3px;">${satDateStr}</td>
                                <td style="border:1px solid #000;padding:3px;font-weight:bold;">${satSig ? hseNom : 'Nouri Chahrour'}</td>
                                <td style="border:1px solid #000;padding:3px;">Vérification 360°, Nacelles, Extincteurs, Balisage</td>
                                <td style="border:1px solid #000;padding:2px;text-align:center;background:#f8fafc;">
                                    ${satSig && satSig.dataUrl ? `
                                        <div style="display:flex;align-items:center;justify-content:center;gap:6px;">
                                            <img src="${satSig.dataUrl}" style="height:22px;max-width:90px;object-fit:contain;" alt="Visa Caisse">
                                            <span style="font-size:6.5px;color:#16a34a;font-weight:900;">✓ VISA OK 08H00<br>${satSig.date}</span>
                                        </div>
                                    ` : `
                                        <div class="no-print" style="height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;" onclick="if(window.SignaturePad)SignaturePad.open('${permit.id}','hse','${satDateStr}','Caisse Samedi')">
                                            <span style="font-size:7.5px;font-weight:bold;background:#eff6ff;color:#1d4ed8;padding:2px 8px;border-radius:3px;border:1px solid #bfdbfe;">✍️ Visa Caisse (08h00)</span>
                                        </div>
                                        <div class="print-only-manual" style="display:none;padding:1px 2px;height:24px;">
                                            <div style="border-bottom:1px dashed #000;height:16px;margin:0 10px;"></div>
                                            <div style="font-size:6px;color:#475569;text-align:center;font-weight:bold;line-height:1;">Visa Caisse manuel HSE</div>
                                        </div>
                                    `}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- SECTION 3 : NOUVEAU - RÉGISTRE DES EFFECTIFS HABILITÉS & CONTRÔLES HSE STELLANTIS (REMPLISSAGE PLEIN FORMAT A4) -->
                    <div class="yellow-bar-header" style="background:#ffeb3b;border:1.2px solid #000;padding:3px 8px;font-weight:900;font-size:9px;margin-top:6px;letter-spacing:0.3px;">
                        RÉGISTRE DES ÉQUIPES HABILITÉES &amp; CONTRÔLES PRÉALABLES (59 INTERVENANTS SINYLON)
                    </div>
                    <div style="border:1.2px solid #000;border-top:none;padding:6px 8px;background:#fff;display:grid;grid-template-columns:1.2fr 1fr;gap:10px;">
                        <div>
                            <div style="font-size:8.5px;font-weight:900;color:#1e3a8a;margin-bottom:3px;text-transform:uppercase;">
                                👥 Répartition des Effectifs par Métier & Habilitations :
                            </div>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:8px;">
                                <div style="border:1px solid #cbd5e1;background:#f8fafc;padding:3px 5px;border-radius:3px;">
                                    <strong style="color:#0f172a;">Encadrement (x5) :</strong><br>
                                    <span>Chefs Projet & HSE (Xie X., Nouri C.)</span>
                                </div>
                                <div style="border:1px solid #cbd5e1;background:#f8fafc;padding:3px 5px;border-radius:3px;">
                                    <strong style="color:#0f172a;">Chefs Équipe (x4) :</strong><br>
                                    <span>Zhou Lin, Wang J., Chen H., Li M.</span>
                                </div>
                                <div style="border:1px solid #bfdbfe;background:#eff6ff;padding:3px 5px;border-radius:3px;">
                                    <strong style="color:#1e3a8a;">Nacellistes / Hauteur (x18) :</strong><br>
                                    <span>Habilités CACES PEMP + Lignes de vie</span>
                                </div>
                                <div style="border:1px solid #fee2e2;background:#fef2f2;padding:3px 5px;border-radius:3px;">
                                    <strong style="color:#dc2626;">Soudeurs Chaud (x12) :</strong><br>
                                    <span>Postes ARO, Pinces & Écrans pare-étincelles</span>
                                </div>
                                <div style="border:1px solid #fef3c7;background:#fffbeb;padding:3px 5px;border-radius:3px;">
                                    <strong style="color:#d97706;">Électriciens LOTO (x8) :</strong><br>
                                    <span>Consignation BT, VAT 0V & Gants 1000V</span>
                                </div>
                                <div style="border:1px solid #dcfce7;background:#f0fdf4;padding:3px 5px;border-radius:3px;">
                                    <strong style="color:#16a34a;">Monteurs & Manutention (x12) :</strong><br>
                                    <span>Palans DEMAG, Outillages & Échafaudages</span>
                                </div>
                            </div>
                            <div style="font-size:7.5px;color:#475569;margin-top:4px;font-style:italic;">
                                🛡️ Total effectif déclaré : <strong>54 Chinois + 5 Algériens = 59 Intervenants</strong> porteurs des badges et stickers casques certifiés Sinylon.
                            </div>
                        </div>

                        <div style="border-left:1px solid #e2e8f0;padding-left:10px;display:flex;flex-direction:column;justify-content:space-between;">
                            <div>
                                <div style="font-size:8.5px;font-weight:900;color:#0f172a;margin-bottom:3px;text-transform:uppercase;">
                                    📋 Points d'Arrêt & Contrôles Quotidiens (08h00) :
                                </div>
                                <ul style="margin:0;padding-left:14px;font-size:8px;line-height:1.35;color:#334155;">
                                    <li>Causerie de sécurité 15 min (Toolbox) tenue avant l'accès</li>
                                    <li>EPI obligatoires (Casque rouge SM, Lunettes, Gants, S3) vérifiés</li>
                                    <li>Contrôle visuel des 6 nacelles ciseaux et outillages de levage</li>
                                    <li>Zone balisée (UB / UAR / FUSA) avec extincteurs à poste</li>
                                </ul>
                            </div>
                            <div style="border:1px solid #1e3a8a;background:#f0f7ff;padding:4px 6px;border-radius:3px;margin-top:4px;">
                                <div style="font-size:8px;font-weight:900;color:#1e3a8a;text-align:center;">
                                    ENGAGEMENT HSE & VALIDATION FINALE SEMAINE
                                </div>
                                <div style="display:flex;justify-content:space-between;align-items:center;font-size:7.5px;margin-top:2px;">
                                    <span>Visa Suivi W.P.E.E.X / HSE : <strong>CONFORME</strong></span>
                                    <span>Levée le : <strong>${new Date(startDate.getTime() + 6*86400000).toISOString().split('T')[0]}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- PIED DE PAGE : Numéro d'urgence / Page 2/2 -->
                    <div style="display:flex;justify-content:space-between;align-items:center;font-size:9px;font-weight:bold;margin-top:4px;padding:0 6px;">
                        <div>Numéro d'urgence : <span style="font-weight:normal;">0562765157 / 14</span></div>
                        <div>Mobile : <span style="font-weight:normal;">0562765157</span></div>
                        <div>Page 2/2</div>
                    </div>
                </div>

                <!-- QR CODE FOOTER DÉDIÉ -->
                ${this.renderFooterQR(permit)}
            </div>
        `;
    },

    // =========================================================================
    // 3. ANNEXE A (BLEUE) — TRAVAIL EN HAUTEUR (PLEIN FORMAT A4)
    // REPRODUCTION EXACTE DU STANDARD SINYLON - STELLANTIS
    // =========================================================================
    heightAnnexe(permit) {
        const chefNom = permit.responsible || permit.chefNom || permit['chef-nom'] || 'Xie Xian';
        const hseNom = permit.hseNom || permit['hse-nom'] || 'Nouri Chahrour';
        const datePermis = permit.validFrom || permit['date-main'] || '2026-08-31';
        const sigs = permit.signatures || {};
        const chefSig = sigs.chef;
        const hseSig = sigs.hse;

        return `
            <div class="a4-document annexe-height-doc" id="a4-doc-${permit.id}-height" style="border:3px solid #004080;padding:7mm 9mm 6mm 9mm;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;font-size:8.5px;line-height:1.25;color:#000;display:flex;flex-direction:column;justify-content:space-between;height:297mm;max-height:297mm;overflow:hidden;position:relative;">
                <div>
                    <!-- EN-TÊTE EXACT PHOTO SINYLON - STELLANTIS -->
                    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #004080;padding-bottom:4px;margin-bottom:4px;">
                        <div style="display:flex;align-items:center;gap:10px;">
                            <div style="background:#000;color:#fff;font-size:24px;font-weight:900;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:3px;">A</div>
                            <div style="font-size:19px;font-weight:900;color:#004080;letter-spacing:0.3px;">Travail en hauteur</div>
                        </div>
                        <div style="display:flex;align-items:center;gap:10px;">
                            ${this.renderLogoSinylonStellantis()}
                            <div style="border:1.5px solid #004080;text-align:center;width:145px;border-radius:2px;background:#f8fafc;">
                                <div style="font-size:8px;font-weight:800;border-bottom:1px solid #004080;padding:2px 4px;background:#eff6ff;color:#1e3a8a;">Identifiant du permis</div>
                                <div style="font-size:13px;font-weight:900;padding:2px 4px;color:#000;font-family:monospace;">${permit.id || '0'}</div>
                            </div>
                        </div>
                    </div>

                    <div style="text-align:center;font-size:8.5px;font-weight:bold;margin-bottom:4px;color:#004080;">
                        Cette liste de vérification doit être toujours accompagnée par le permis de travail de sécurité générale
                    </div>

                    <div style="font-style:italic;font-size:8px;margin-bottom:3px;color:#333;">
                        Cette question est pour vous aider avec votre évaluation des risques.<br>
                        <strong>Usage de</strong> (si "oui" continuer à la colonne de droite):
                    </div>

                    <!-- TABLEAU ÉQUIPEMENTS & RISQUES SECTION 1 -->
                    <table style="width:100%;border-collapse:collapse;margin-bottom:4px;font-size:8px;">
                        <tbody>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;width:34%;">Échafaudage fixe</td>
                                <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;">${this.renderCheckYN(false)}</td>
                                <td style="border:1px solid #999;padding:2.5px 4px;width:52%;">Approuvé et cacheté par le personnel qualifié</td>
                                <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;">${this.renderCheckYN(false)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Échafaudage mobile</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Approuvé et cacheté par le personnel qualifié</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;" rowspan="3">Élévateur de plateforme mobile (PEMP / Nacelle)</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;" rowspan="3">${this.renderCheckYN(true)}</td>
                                <td style="border:1px solid #999;padding:2.5px 4px;">L'opérateur et le travailleur entraînés et habilités</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Ordre d'utilisation délivré par écrit</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Port obligatoire d'équipement d'arrêt de chute (Harnais double longe)</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;" rowspan="5">Échelle</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;" rowspan="5">${this.renderCheckYN(false)}</td>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Aucun autre équipement ne peut être utilisé</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;"><span style="border:1px solid #000;padding:1px 4px;font-weight:800;">Y</span></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Utilisé uniquement pour des activités à court terme</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Avec un potentiel de danger minimum</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Vérifier et cacheter avant accès</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Travailleur entraîné dans l'usage sécurisé</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;" rowspan="2">Équipement d'arrêt de chute requis ?</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;" rowspan="2">${this.renderCheckYN(true)}</td>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Vérifier avant de commencer le travail</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Moyens d'attachement définis par le personnel qualifié</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- SECTION 2 : TRAVAIL SUR TOIT -->
                    <div style="border:1.2px solid #000;margin-bottom:4px;font-size:8px;">
                        <div style="font-weight:bold;padding:3px 6px;border-bottom:1px solid #000;background:#f1f5f9;display:flex;justify-content:space-between;">
                            <span>Travail sur toit</span>
                            <span>${this.renderCheckYN(false)}</span>
                        </div>
                        <table style="width:100%;border-collapse:collapse;">
                            <tr>
                                <td style="border:1px solid #999;padding:3px 5px;width:40%;">Capacité de charge du toit suffisante à supporter</td>
                                <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;">${this.renderCheckYN(false)}</td>
                                <td style="border:1px solid #999;padding:3px 5px;width:46%;">Endroit coordonné fermé / balisé</td>
                                <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;">${this.renderCheckYN(false)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:3px 5px;">Présence d'une toiture fragile à proximité du site</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                                <td style="border:1px solid #999;padding:3px 5px;">Protection de chute / Protection de bord existante ?</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                            </tr>
                            <tr>
                                <td colspan="4" style="border:1px solid #999;padding:3px 5px;">
                                    Mesures additionnelles : <span style="border-bottom:1px solid #000;display:inline-block;width:75%;height:12px;">Filets de sécurité et lignes de vie installées</span>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <!-- SECTION 3 : CHECKLIST CONSIGNES SUR LE SITE -->
                    <table style="width:100%;border-collapse:collapse;margin-bottom:4px;font-size:8px;">
                        <tbody>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;width:92%;">Endroit de travail barré pour véhicules / trafic / piétons</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;width:8%;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">Obstacles sur ou à proximité du site (conduits de câble, câbles, tuyauteries, etc.)</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;"><span style="border:1px solid #000;padding:1px 4px;font-weight:800;">Y</span></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">Conduits d'aération, cheminées, échappements qui peuvent émettre des substances chaudes/odorantes</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">Parties d'équipement de l'usine à protéger</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">Issue de secours d'urgence dégagée et balisée</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">Matériels / outils qui ont besoin d'être déplacés</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">Directives de sécurité nécessaires communiquées à l'équipe</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">
                                    Autres précautions : <span style="border-bottom:1px solid #000;display:inline-block;width:60%;height:10px;">Port obligatoire Casque anti-choc et Ligne de vie</span>
                                </td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- SECTION 4 : CONDITIONS AMBIANTES AU MOMENT DU PROBLÈME -->
                    <div style="border:1.2px solid #000;padding:4px 6px;margin-bottom:4px;font-size:8px;">
                        <div style="font-weight:bold;margin-bottom:2px;font-size:8.5px;">Conditions ambiantes au moment du travail</div>
                        <div style="font-size:7.5px;font-style:italic;color:#555;margin-bottom:3px;">NOTE : Le permis doit être suspendu et revu si les conditions se détériorent.</div>
                        
                        <div style="display:flex;align-items:center;gap:12px;margin-bottom:2px;">
                            <span style="width:130px;font-weight:700;">Visibilité générale :</span>
                            <span>Claire <span style="border:1px solid #000;padding:1px 4px;font-weight:800;background:#000;color:#fff;">Y</span></span>
                            <span>Amoindrie ${this.renderCheckYN(false)}</span>
                            <span>Sombre ${this.renderCheckYN(false)}</span>
                            <span>Obscure ${this.renderCheckYN(false)}</span>
                        </div>
                        <div style="display:flex;align-items:center;gap:12px;margin-bottom:2px;">
                            <span style="width:130px;font-weight:700;">Pluie :</span>
                            <span>Aucune <span style="border:1px solid #000;padding:1px 4px;font-weight:800;background:#000;color:#fff;">Y</span></span>
                            <span>Légère ${this.renderCheckYN(false)}</span>
                            <span>Modérée ${this.renderCheckYN(false)}</span>
                            <span>Forte ${this.renderCheckYN(false)}</span>
                        </div>
                        <div style="display:flex;align-items:center;gap:12px;margin-bottom:2px;">
                            <span style="width:130px;font-weight:700;">Surface du site de travail :</span>
                            <span>Sec <span style="border:1px solid #000;padding:1px 4px;font-weight:800;background:#000;color:#fff;">Y</span></span>
                            <span>Mouillé ${this.renderCheckYN(false)}</span>
                            <span>Glissante ${this.renderCheckYN(false)}</span>
                        </div>
                        <div style="display:flex;align-items:center;gap:12px;margin-bottom:2px;">
                            <span style="width:130px;font-weight:700;">Vent :</span>
                            <span>Aucun <span style="border:1px solid #000;padding:1px 4px;font-weight:800;background:#000;color:#fff;">Y</span></span>
                            <span>Légère brise ${this.renderCheckYN(false)}</span>
                            <span>Modéré ${this.renderCheckYN(false)}</span>
                            <span>Fort ${this.renderCheckYN(false)}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:3px;border-top:1px dashed #aaa;padding-top:2px;">
                            <span>Surface de travail glissante suite au déversement d'huiles ou produits chimiques ?</span>
                            <span>${this.renderCheckYN(false)}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:2px;">
                            <span>Mesures additionnelles : <strong>Port obligatoire du harnais de sécurité avec double longe mousquetonnée</strong></span>
                            <span>${this.renderCheckYN(true)}</span>
                        </div>
                    </div>

                    <!-- SECTION 5 : SIGNATURES OFFICIELLES HAUTEUR -->
                    <table style="width:100%;border-collapse:collapse;border:2px solid #004080;margin-top:4px;">
                        <tr style="background:#dbeafe;font-size:8.5px;font-weight:900;text-align:center;color:#004080;">
                            <th style="border:1px solid #004080;padding:3px;width:38%;">CHEF DE PROJET (AUTORISATION)</th>
                            <th style="border:1px solid #004080;padding:3px;width:38%;">HSE ENTREPRISE (CONTRÔLE 360°)</th>
                            <th style="border:1px solid #004080;padding:3px;width:24%;">DATE / HEURE</th>
                        </tr>
                        <tr>
                            <td style="border:1px solid #004080;padding:4px 8px;min-height:55px;height:55px;vertical-align:top;font-size:8.5px;">
                                <div>Nom : <strong>${chefNom}</strong></div>
                                ${chefSig && chefSig.dataUrl ? `
                                    <div style="display:flex;align-items:center;justify-content:space-between;background:#f0fdf4;border:1px solid #86efac;border-radius:2px;padding:2px 5px;margin-top:3px;">
                                        <img src="${chefSig.dataUrl}" style="height:26px;max-width:110px;object-fit:contain;" alt="Signature Chef">
                                        <span style="font-size:6.5px;color:#16a34a;font-weight:900;text-align:right;">✓ SIGNÉ SUR SITE<br>${chefSig.date} ${chefSig.time}</span>
                                    </div>
                                ` : `
                                    <div style="margin-top:6px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;" onclick="if(window.SignaturePad)SignaturePad.open('${permit.id}','chef')">
                                        <span style="font-size:7.5px;color:#777;">En attente</span>
                                        <span style="font-size:7.5px;font-weight:bold;background:#eff6ff;color:#1d4ed8;padding:2px 8px;border-radius:2px;border:1px solid #bfdbfe;">✍️ Signer Chef</span>
                                    </div>
                                `}
                            </td>
                            <td style="border:1px solid #004080;padding:4px 8px;min-height:55px;height:55px;vertical-align:top;font-size:8.5px;">
                                <div>Nom : <strong>${hseNom}</strong></div>
                                ${hseSig && hseSig.dataUrl ? `
                                    <div style="display:flex;align-items:center;justify-content:space-between;background:#f0fdf4;border:1px solid #86efac;border-radius:2px;padding:2px 5px;margin-top:3px;">
                                        <img src="${hseSig.dataUrl}" style="height:26px;max-width:110px;object-fit:contain;" alt="Signature HSE">
                                        <span style="font-size:6.5px;color:#16a34a;font-weight:900;text-align:right;">✓ SIGNÉ SUR SITE<br>${hseSig.date} ${hseSig.time}</span>
                                    </div>
                                ` : `
                                    <div style="margin-top:6px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;" onclick="if(window.SignaturePad)SignaturePad.open('${permit.id}','hse')">
                                        <span style="font-size:7.5px;color:#777;">En attente</span>
                                        <span style="font-size:7.5px;font-weight:bold;background:#eff6ff;color:#1d4ed8;padding:2px 8px;border-radius:2px;border:1px solid #bfdbfe;">✍️ Signer HSE</span>
                                    </div>
                                `}
                            </td>
                            <td style="border:1px solid #004080;padding:4px 8px;min-height:55px;height:55px;vertical-align:middle;font-size:8.5px;">
                                <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;">
                                    <span>Date :</span>
                                    <span style="border:1px solid #000;flex:1;padding:2px 4px;font-family:monospace;font-size:8.5px;background:#f8fafc;">${chefSig && chefSig.date ? chefSig.date : datePermis}</span>
                                </div>
                                <div style="display:flex;gap:6px;align-items:center;">
                                    <span>Heure :</span>
                                    <span style="border:1px solid #000;flex:1;padding:2px 4px;font-family:monospace;font-size:8.5px;background:#f8fafc;">${chefSig && chefSig.time ? chefSig.time : '08h00'}</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- QR CODE FOOTER DÉDIÉ -->
                ${this.renderFooterQR(permit)}
            </div>
        `;
    },

    // =========================================================================
    // 4. ANNEXE B (ROUGE) — TRAVAIL CHAUD (PLEIN FORMAT A4)
    // REPRODUCTION EXACTE DU STANDARD SINYLON - STELLANTIS
    // =========================================================================
    hotAnnexe(permit) {
        const chefNom = permit.responsible || permit.chefNom || permit['chef-nom'] || 'Xie Xian';
        const hseNom = permit.hseNom || permit['hse-nom'] || 'Nouri Chahrour';
        const datePermis = permit.validFrom || permit['date-main'] || '2026-08-31';
        const sigs = permit.signatures || {};
        const chefSig = sigs.chef;
        const hseSig = sigs.hse;

        return `
            <div class="a4-document annexe-hot-doc" id="a4-doc-${permit.id}-hot" style="border:3px solid #cc0000;padding:7mm 9mm 6mm 9mm;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;font-size:8.5px;line-height:1.25;color:#000;display:flex;flex-direction:column;justify-content:space-between;height:297mm;max-height:297mm;overflow:hidden;position:relative;">
                <div>
                    <!-- EN-TÊTE EXACT PHOTO SINYLON - STELLANTIS -->
                    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #cc0000;padding-bottom:4px;margin-bottom:4px;">
                        <div style="display:flex;align-items:center;gap:10px;">
                            <div style="background:#000;color:#fff;font-size:24px;font-weight:900;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:3px;">B</div>
                            <div style="font-size:19px;font-weight:900;color:#cc0000;letter-spacing:0.3px;">Travail chaud</div>
                        </div>
                        <div style="display:flex;align-items:center;gap:10px;">
                            ${this.renderLogoSinylonStellantis()}
                            <div style="border:1.5px solid #cc0000;text-align:center;width:145px;border-radius:2px;background:#f8fafc;">
                                <div style="font-size:8px;font-weight:800;border-bottom:1px solid #cc0000;padding:2px 4px;background:#fee2e2;color:#991b1b;">Permit Identifier</div>
                                <div style="font-size:13px;font-weight:900;padding:2px 4px;color:#000;font-family:monospace;">${permit.id || '0'}</div>
                            </div>
                        </div>
                    </div>

                    <div style="text-align:center;font-size:8.5px;font-weight:bold;margin-bottom:4px;color:#cc0000;">
                        La liste de vérification doit être toujours accompagnée par le permis de travail de sécurité générale
                    </div>

                    <!-- CHECKLIST TRAVAIL CHAUD AVEC CASES [.Y .N.] (EXACT PHOTO) -->
                    <table style="width:100%;border-collapse:collapse;margin-bottom:4px;font-size:8px;">
                        <tbody>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;width:92%;">
                                    Tous les produits inflammables ou combustibles seront dégagés à <span style="border:1px solid #000;padding:0 4px;font-weight:bold;">10</span> m (min. 10 m)
                                </td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;width:8%;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">
                                    Si le déplacement n'est pas possible : produits protégés par des bâches ignifugées ou écrans thermiques
                                </td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">Tous débris, saleté, graisse ou poussière sont enlevés de la zone</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">
                                    Environnement vérifié incluant tuyauteries, gaines, derrière cloisons pour dissimulation de combustible
                                </td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">
                                    Présence de structure combustible : si oui, spécifier les précautions prises (ex. arrosage, couvertures inertes) :<br>
                                    <div style="border:1px solid #cc0000;padding:2px 6px;margin-top:2px;display:flex;justify-content:space-between;background:#fef2f2;">
                                        <span>Couvrir tous les matériaux inflammables hors du rayon de projection</span>
                                        <span>${this.renderCheckYN(true)}</span>
                                    </div>
                                </td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;vertical-align:top;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">Couvertures résistantes au feu / écrans équipés pour résister aux étincelles de meulage</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">Fermeture des vannes, égouts, caniveaux automatiquement ouvrables</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">Isolement sûr des conduits / convoyeurs / gaines d'aspiration évitant la propagation d'étincelles</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">Couverture étanche des trous, fentes et ouvertures de plancher</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">
                                    Ventilation suffisante sur le lieu de travail (naturelle <span style="border:1px solid #000;padding:0 3px;font-weight:bold;">Y</span> &nbsp; mécanique <span style="border:1px solid #000;padding:0 3px;font-weight:bold;">Y</span>)
                                </td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">Appareils électriques et câbles de soudure inspectés et protégés</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">Tous les équipements et tuyauteries de voisinage protégés des projections</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">Balisage et panneaux d'avertissement "DANGER TRAVAUX À CHAUD" installés</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">
                                    Surveillance gaz avant l'entame si vapeurs inflammables soupçonnées (Formulaire X requis si oui)
                                </td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(false)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- SECTION ÉQUIPEMENT DE LUTTE ANTI FEU FOURNI -->
                    <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:6px;margin-bottom:4px;border:1.5px solid #cc0000;padding:4px 6px;font-size:8px;">
                        <div>
                            <div style="font-weight:bold;margin-bottom:3px;font-size:8.5px;color:#991b1b;">Équipements de lutte anti-feu à disposition immédiate :</div>
                            <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
                                <span>Extincteurs :</span>
                                <span>Eau pulvérisée <span style="border:1px solid #000;padding:0 3px;font-weight:bold;">Y</span></span>
                                <span>Poudre ABC 6kg <span style="border:1px solid #000;padding:0 3px;font-weight:bold;background:#000;color:#fff;">Y</span></span>
                                <span>CO₂ 5kg <span style="border:1px solid #000;padding:0 3px;font-weight:bold;background:#000;color:#fff;">Y</span></span>
                            </div>
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:3px;">
                                <span>Couvertures anti-feu à poste <span style="border:1px solid #000;padding:0 3px;font-weight:bold;background:#000;color:#fff;">Y</span></span>
                                <span>Balisage de sécurité <span style="border:1px solid #000;padding:0 3px;font-weight:bold;background:#000;color:#fff;">Y</span></span>
                            </div>
                            <div style="display:flex;align-items:center;gap:6px;margin-top:4px;border-top:1px dashed #aaa;padding-top:3px;">
                                <span>Ronde de sécurité après fin des travaux :</span>
                                <span style="border:1px solid #000;padding:1px 5px;font-weight:bold;background:#000;color:#fff;">30 MINUTES MINIMUM OBLIGATOIRE</span>
                            </div>
                        </div>
                        <div style="border-left:1px solid #cc0000;padding-left:6px;display:flex;flex-direction:column;justify-content:space-between;">
                            <div style="border:1px solid #cc0000;background:#fee2e2;padding:3px 5px;margin-bottom:2px;">
                                <div style="font-weight:bold;font-size:8px;color:#991b1b;">HSE ENTREPRISE (VALIDATION CHAUD)</div>
                                <div style="font-size:7px;">Nom (lettres majuscule) et signature :</div>
                                <div style="font-weight:bold;font-size:8px;">${hseNom}</div>
                                ${hseSig && hseSig.dataUrl ? `
                                    <div style="display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid #16a34a;border-radius:2px;padding:1px 4px;margin-top:2px;">
                                        <img src="${hseSig.dataUrl}" style="height:20px;max-width:85px;object-fit:contain;" alt="Signature HSE">
                                        <span style="font-size:6px;color:#16a34a;font-weight:bold;">✓ VALIDÉ HSE<br>${hseSig.date}</span>
                                    </div>
                                ` : `
                                    <div style="height:18px;border-bottom:1px dashed #991b1b;cursor:pointer;display:flex;align-items:center;justify-content:flex-end;" onclick="if(window.SignaturePad)SignaturePad.open('${permit.id}','hse')">
                                        <span style="font-size:7px;color:#b91c1c;font-weight:bold;background:#fff;padding:1px 5px;border-radius:2px;border:1px solid #fca5a5;">✍️ Signer HSE</span>
                                    </div>
                                `}
                            </div>
                            <div style="font-size:7.5px;color:#991b1b;font-weight:bold;line-height:1.2;">
                                ⚠️ Surveillant d'incendie désigné obligatoirement présent durant le travail à chaud et 30 min après.
                            </div>
                        </div>
                    </div>

                    <!-- SECTION SIGNATURES OFFICIELLES CHAUD -->
                    <table style="width:100%;border-collapse:collapse;border:2px solid #cc0000;margin-top:4px;">
                        <tr style="background:#fee2e2;font-size:8.5px;font-weight:900;text-align:center;color:#991b1b;">
                            <th style="border:1px solid #cc0000;padding:3px;width:38%;">CHEF DE PROJET (AUTORISATION)</th>
                            <th style="border:1px solid #cc0000;padding:3px;width:38%;">HSE ENTREPRISE (CONTRÔLE EXTINCTEURS)</th>
                            <th style="border:1px solid #cc0000;padding:3px;width:24%;">DATE / HEURE</th>
                        </tr>
                        <tr>
                            <td style="border:1px solid #cc0000;padding:4px 8px;min-height:55px;height:55px;vertical-align:top;font-size:8.5px;">
                                <div>Nom : <strong>${chefNom}</strong></div>
                                ${chefSig && chefSig.dataUrl ? `
                                    <div style="display:flex;align-items:center;justify-content:space-between;background:#f0fdf4;border:1px solid #86efac;border-radius:2px;padding:2px 5px;margin-top:3px;">
                                        <img src="${chefSig.dataUrl}" style="height:26px;max-width:110px;object-fit:contain;" alt="Signature Chef">
                                        <span style="font-size:6.5px;color:#16a34a;font-weight:900;text-align:right;">✓ SIGNÉ SUR SITE<br>${chefSig.date} ${chefSig.time}</span>
                                    </div>
                                ` : `
                                    <div style="margin-top:6px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;" onclick="if(window.SignaturePad)SignaturePad.open('${permit.id}','chef')">
                                        <span style="font-size:7.5px;color:#777;">En attente</span>
                                        <span style="font-size:7.5px;font-weight:bold;background:#eff6ff;color:#1d4ed8;padding:2px 8px;border-radius:2px;border:1px solid #bfdbfe;">✍️ Signer Chef</span>
                                    </div>
                                `}
                            </td>
                            <td style="border:1px solid #cc0000;padding:4px 8px;min-height:55px;height:55px;vertical-align:top;font-size:8.5px;">
                                <div>Nom : <strong>${hseNom}</strong></div>
                                ${hseSig && hseSig.dataUrl ? `
                                    <div style="display:flex;align-items:center;justify-content:space-between;background:#f0fdf4;border:1px solid #86efac;border-radius:2px;padding:2px 5px;margin-top:3px;">
                                        <img src="${hseSig.dataUrl}" style="height:26px;max-width:110px;object-fit:contain;" alt="Signature HSE">
                                        <span style="font-size:6.5px;color:#16a34a;font-weight:900;text-align:right;">✓ SIGNÉ SUR SITE<br>${hseSig.date} ${hseSig.time}</span>
                                    </div>
                                ` : `
                                    <div style="margin-top:6px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;" onclick="if(window.SignaturePad)SignaturePad.open('${permit.id}','hse')">
                                        <span style="font-size:7.5px;color:#777;">En attente</span>
                                        <span style="font-size:7.5px;font-weight:bold;background:#eff6ff;color:#1d4ed8;padding:2px 8px;border-radius:2px;border:1px solid #bfdbfe;">✍️ Signer HSE</span>
                                    </div>
                                `}
                            </td>
                            <td style="border:1px solid #cc0000;padding:4px 8px;min-height:55px;height:55px;vertical-align:middle;font-size:8.5px;">
                                <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;">
                                    <span>Date :</span>
                                    <span style="border:1px solid #000;flex:1;padding:2px 4px;font-family:monospace;font-size:8.5px;background:#f8fafc;">${chefSig && chefSig.date ? chefSig.date : datePermis}</span>
                                </div>
                                <div style="display:flex;gap:6px;align-items:center;">
                                    <span>Heure :</span>
                                    <span style="border:1px solid #000;flex:1;padding:2px 4px;font-family:monospace;font-size:8.5px;background:#f8fafc;">${chefSig && chefSig.time ? chefSig.time : '08h00'}</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- QR CODE FOOTER DÉDIÉ -->
                ${this.renderFooterQR(permit)}
            </div>
        `;
    },

    // =========================================================================
    // 5. ANNEXE C (AMBRE / JAUNE) — TRAVAIL ÉLECTRIQUE & CONSIGNATION
    // REPRODUCTION EXACTE DU STANDARD SINYLON - STELLANTIS (PLEIN FORMAT A4)
    // =========================================================================
    electricAnnexe(permit) {
        const chefNom = permit.responsible || permit.chefNom || permit['chef-nom'] || 'Xie Xian';
        const hseNom = permit.hseNom || permit['hse-nom'] || 'Nouri Chahrour';
        const datePermis = permit.validFrom || permit['date-main'] || '2026-08-31';
        const sigs = permit.signatures || {};
        const chefSig = sigs.chef;
        const hseSig = sigs.hse;

        return `
            <div class="a4-document annexe-elec-doc" id="a4-doc-${permit.id}-electric" style="border:3px solid #d97706;padding:7mm 9mm 6mm 9mm;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;font-size:8.5px;line-height:1.25;color:#000;display:flex;flex-direction:column;justify-content:space-between;height:297mm;max-height:297mm;overflow:hidden;position:relative;">
                <div>
                    <!-- EN-TÊTE EXACT SINYLON - STELLANTIS -->
                    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #d97706;padding-bottom:4px;margin-bottom:4px;">
                        <div style="display:flex;align-items:center;gap:10px;">
                            <div style="background:#000;color:#fff;font-size:24px;font-weight:900;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:3px;">C</div>
                            <div style="font-size:19px;font-weight:900;color:#d97706;letter-spacing:0.3px;">Travail électrique &amp; Consignation</div>
                        </div>
                        <div style="display:flex;align-items:center;gap:10px;">
                            ${this.renderLogoSinylonStellantis()}
                            <div style="border:1.5px solid #d97706;text-align:center;width:145px;border-radius:2px;background:#f8fafc;">
                                <div style="font-size:8px;font-weight:800;border-bottom:1px solid #d97706;padding:2px 4px;background:#fef3c7;color:#b45309;">Identifiant du permis</div>
                                <div style="font-size:13px;font-weight:900;padding:2px 4px;color:#000;font-family:monospace;">${permit.id || '0'}</div>
                            </div>
                        </div>
                    </div>

                    <div style="text-align:center;font-size:8.5px;font-weight:bold;margin-bottom:4px;color:#d97706;">
                        Cette liste de vérification doit être toujours accompagnée par le permis de travail de sécurité générale
                    </div>

                    <!-- TABLEAU TYPES DE TRAVAUX ÉLECTRIQUES -->
                    <table style="width:100%;border-collapse:collapse;margin-bottom:4px;font-size:8px;">
                        <tbody>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;width:34%;">Tirage de câbles / Chemins de câbles</td>
                                <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;">${this.renderCheckYN(true)}</td>
                                <td style="border:1px solid #999;padding:2.5px 4px;width:52%;">Câbles hors tension et protégés mécaniquement</td>
                                <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Raccordement armoire électrique BT</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Consignation LOTO effectuée et cadenas posés</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;" rowspan="3">Intervention moteur / variateur</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;" rowspan="3">${this.renderCheckYN(true)}</td>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Vérification d'Absence de Tension (VAT 0V certifiée)</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Habilitations électriques des intervenants vérifiées</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Port d'EPI isolants (Gants 1000V, écran facial anti-arc)</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;" rowspan="3">Mise à la terre et court-circuit (MALT/CC)</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;" rowspan="3">${this.renderCheckYN(true)}</td>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Dispositif MALT raccordé avant intervention</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;"><span style="border:1px solid #000;padding:1px 4px;font-weight:800;">Y</span></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Outillage à main isolé 1000V certifié EN 60900</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 4px;">Balisage de sécurité autour des cellules sous tension</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- SECTION MESURES DE CONSIGNATION LOTO -->
                    <div style="border:1.5px solid #d97706;margin-bottom:4px;font-size:8px;">
                        <div style="font-weight:bold;padding:3px 6px;background:#fef3c7;border-bottom:1px solid #d97706;display:flex;justify-content:space-between;color:#92400e;">
                            <span>Procédure de Consignation et Déconsignation (LOTO - Lockout / Tagout)</span>
                            <span>${this.renderCheckYN(true)}</span>
                        </div>
                        <table style="width:100%;border-collapse:collapse;">
                            <tr>
                                <td style="border:1px solid #999;padding:3px 5px;width:40%;">Séparation de la source d'énergie (Disjoncteur / Sectionneur ouvert)</td>
                                <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;">${this.renderCheckYN(true)}</td>
                                <td style="border:1px solid #999;padding:3px 5px;width:46%;">Condamnation mécanique par cadenas individuel</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:3px 5px;">Pose de la pancarte d'interdiction de manœuvre (Tagout)</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                                <td style="border:1px solid #999;padding:3px 5px;">Vérification de décharge des condensateurs</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td colspan="4" style="border:1px solid #999;padding:3px 6px;background:#fffbeb;">
                                    Chargé de Consignation Sinylon / M. W.P.E.E.X : <strong>Nouri Chahrour / Xie Xian</strong> — N° Cadenas : <span style="border-bottom:1px solid #000;display:inline-block;width:35%;height:12px;font-weight:bold;">LOTO-SINY-01</span>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <!-- SECTION CHECKLIST DE SÉCURITÉ CHANTIER ÉLECTRIQUE -->
                    <table style="width:100%;border-collapse:collapse;margin-bottom:4px;font-size:8px;">
                        <tbody>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;width:92%;">Zone de tirage de câbles balisée avec ruban de signalisation et panneaux danger</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;width:8%;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">Présence d'un surveillant électricien habilité pendant les manœuvres</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">Éclairage de chantier 24V ou autonome protégé IP55</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">Extincteur CO₂ approprié pour feu électrique présent à proximité immédiate</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;"><span style="border:1px solid #000;padding:1px 4px;font-weight:800;">Y</span></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #999;padding:2.5px 5px;">Procédure d'urgence et coupure générale d'urgence localisée</td>
                                <td style="border:1px solid #999;padding:1px;text-align:center;">${this.renderCheckYN(true)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- SECTION SIGNATURES OFFICIELLES ÉLECTRIQUE -->
                    <table style="width:100%;border-collapse:collapse;border:2px solid #d97706;margin-top:4px;">
                        <tr style="background:#fef3c7;font-size:8.5px;font-weight:900;text-align:center;color:#b45309;">
                            <th style="border:1px solid #d97706;padding:3px;width:38%;">CHEF DE PROJET (AUTORISATION)</th>
                            <th style="border:1px solid #d97706;padding:3px;width:38%;">HSE / CHARGÉ CONSIGNATION</th>
                            <th style="border:1px solid #d97706;padding:3px;width:24%;">DATE / HEURE</th>
                        </tr>
                        <tr>
                            <td style="border:1px solid #d97706;padding:4px 8px;min-height:55px;height:55px;vertical-align:top;font-size:8.5px;">
                                <div>Nom : <strong>${chefNom}</strong></div>
                                ${chefSig && chefSig.dataUrl ? `
                                    <div style="display:flex;align-items:center;justify-content:space-between;background:#f0fdf4;border:1px solid #86efac;border-radius:2px;padding:2px 5px;margin-top:3px;">
                                        <img src="${chefSig.dataUrl}" style="height:26px;max-width:110px;object-fit:contain;" alt="Signature Chef">
                                        <span style="font-size:6.5px;color:#16a34a;font-weight:900;text-align:right;">✓ SIGNÉ SUR SITE<br>${chefSig.date} ${chefSig.time}</span>
                                    </div>
                                ` : `
                                    <div style="margin-top:6px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;" onclick="if(window.SignaturePad)SignaturePad.open('${permit.id}','chef')">
                                        <span style="font-size:7.5px;color:#777;">En attente</span>
                                        <span style="font-size:7.5px;font-weight:bold;background:#eff6ff;color:#1d4ed8;padding:2px 8px;border-radius:2px;border:1px solid #bfdbfe;">✍️ Signer Chef</span>
                                    </div>
                                `}
                            </td>
                            <td style="border:1px solid #d97706;padding:4px 8px;min-height:55px;height:55px;vertical-align:top;font-size:8.5px;">
                                <div>Nom : <strong>${hseNom}</strong></div>
                                ${hseSig && hseSig.dataUrl ? `
                                    <div style="display:flex;align-items:center;justify-content:space-between;background:#f0fdf4;border:1px solid #86efac;border-radius:2px;padding:2px 5px;margin-top:3px;">
                                        <img src="${hseSig.dataUrl}" style="height:26px;max-width:110px;object-fit:contain;" alt="Signature HSE">
                                        <span style="font-size:6.5px;color:#16a34a;font-weight:900;text-align:right;">✓ SIGNÉ SUR SITE<br>${hseSig.date} ${hseSig.time}</span>
                                    </div>
                                ` : `
                                    <div style="margin-top:6px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;" onclick="if(window.SignaturePad)SignaturePad.open('${permit.id}','hse')">
                                        <span style="font-size:7.5px;color:#777;">En attente</span>
                                        <span style="font-size:7.5px;font-weight:bold;background:#eff6ff;color:#1d4ed8;padding:2px 8px;border-radius:2px;border:1px solid #bfdbfe;">✍️ Signer HSE</span>
                                    </div>
                                `}
                            </td>
                            <td style="border:1px solid #d97706;padding:4px 8px;min-height:55px;height:55px;vertical-align:middle;font-size:8.5px;">
                                <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;">
                                    <span>Date :</span>
                                    <span style="border:1px solid #000;flex:1;padding:2px 4px;font-family:monospace;font-size:8.5px;background:#f8fafc;">${chefSig && chefSig.date ? chefSig.date : datePermis}</span>
                                </div>
                                <div style="display:flex;gap:6px;align-items:center;">
                                    <span>Heure :</span>
                                    <span style="border:1px solid #000;flex:1;padding:2px 4px;font-family:monospace;font-size:8.5px;background:#f8fafc;">${chefSig && chefSig.time ? chefSig.time : '08h00'}</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- QR CODE FOOTER DÉDIÉ -->
                ${this.renderFooterQR(permit)}
            </div>
        `;
    },

    // =========================================================================
    // 6. AFFICHE A4 OFFICIELLE D'ENTRÉE DE ZONE (UB / UAR / FUSA)
    // À COLLER SUR LES PALISSADES / ENTRÉES DE ZONE SUR CHANTIER
    // =========================================================================
    renderZonePosterA4(permit, zoneKey = null) {
        const p = permit || {};
        
        // Résolution stricte de la zone (UB, UAR ou FUSA)
        let z = (typeof zoneKey === 'string' && zoneKey !== 'ALL') ? zoneKey : (typeof p.zoneKey === 'string' ? p.zoneKey : '');
        if (typeof z !== 'string' || !['UB', 'UAR', 'FUSA'].includes(z.toUpperCase())) {
            if (p.id && String(p.id).includes('UAR')) z = 'UAR';
            else if (p.id && String(p.id).includes('FUSA')) z = 'FUSA';
            else if (p.id && String(p.id).includes('UB')) z = 'UB';
            else if (p.zone && String(p.zone).includes('UAR')) z = 'UAR';
            else if (p.zone && String(p.zone).includes('FUSA')) z = 'FUSA';
            else z = 'UB';
        }
        z = String(z).toUpperCase();

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

        const payload = (typeof QREngine !== 'undefined' && typeof QREngine.generateZonePayload === 'function') 
            ? QREngine.generateZonePayload(z) 
            : `https://permis-sinylon.onrender.com/?zone=${encodeURIComponent(z)}`;

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
        <div class="a4-document zone-poster-a4" style="font-family:Arial,Helvetica,sans-serif;color:#000;padding:7mm 9mm 6mm 9mm;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;height:297mm;max-height:297mm;overflow:hidden;border:3.5px solid ${activeZone.borderColor};background:#fff;">
            
            <!-- 1. EN-TÊTE CORPORATE OFFICIEL -->
            <div style="border-bottom:2px solid #000;padding-bottom:6px;display:flex;justify-content:space-between;align-items:center;">
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="background:#000;color:#fff;font-weight:900;font-size:16px;padding:3px 10px;border-radius:3px;letter-spacing:1px;">SINYLON</span>
                    <span style="border:2px solid #000;color:#000;font-weight:900;font-size:16px;padding:2px 10px;border-radius:3px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:12px;font-weight:900;color:#1e3a8a;text-transform:uppercase;letter-spacing:1px;">Chantier Tafraoui · Usine K9 CKD0</div>
                    <div style="font-size:8.5px;color:#475569;">Projet Assemblage Véhicules Utilitaires Stellantis Algérie</div>
                </div>
                <div style="border:2px solid #000;background:#f8fafc;padding:3px 10px;text-align:center;border-radius:4px;">
                    <div style="font-size:8px;font-weight:800;color:#64748b;">PERMIS N°</div>
                    <div style="font-size:13px;font-weight:900;font-family:monospace;color:#000;">${permitZoneId}</div>
                </div>
            </div>

            <!-- 2. TITRE GÉANT DU POSTER DE ZONE -->
            <div style="background:${activeZone.bgBadge};border:2.5px solid ${activeZone.borderColor};border-radius:8px;padding:8px 14px;text-align:center;margin-top:6px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                <div style="font-size:10.5px;font-weight:900;color:${activeZone.badgeColor};text-transform:uppercase;letter-spacing:1.5px;margin-bottom:2px;">
                    ${activeZone.icon} AFFICHAGE RÉGLEMENTAIRE DE SÉCURITÉ DE ZONE
                </div>
                <div style="font-size:19px;font-weight:900;color:#000;letter-spacing:0.5px;line-height:1.2;">
                    ${activeZone.name}
                </div>
                <div style="font-size:11.5px;color:#334155;font-weight:700;margin-top:2px;">
                    ${activeZone.nameZh}
                </div>
            </div>

            <!-- 3. BANDEAU DE VALIDITÉ HEBDOMADAIRE & HORAIRES -->
            <div style="display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:8px;margin-top:6px;">
                <div style="border:1.5px solid #16a34a;background:#f0fdf4;border-radius:6px;padding:6px 10px;text-align:center;">
                    <div style="font-size:8px;font-weight:800;color:#166534;">STATUT DU PERMIS DE ZONE</div>
                    <div style="font-size:12px;font-weight:900;color:#15803d;margin-top:1px;">🟢 AUTORISÉ & ACTIF (SEMAINE ${weekNum})</div>
                </div>
                <div style="border:1.5px solid #000;background:#f8fafc;border-radius:6px;padding:6px 10px;text-align:center;">
                    <div style="font-size:8px;font-weight:800;color:#475569;">PÉRIODE DE VALIDITÉ</div>
                    <div style="font-size:11px;font-weight:900;color:#000;margin-top:1px;">${validDeb} → ${validFin}</div>
                </div>
                <div style="border:1.5px solid #000;background:#f8fafc;border-radius:6px;padding:6px 10px;text-align:center;">
                    <div style="font-size:8px;font-weight:800;color:#475569;">HORAIRES AUTORISÉS</div>
                    <div style="font-size:11px;font-weight:900;color:#000;margin-top:1px;">08h00 → 17h30</div>
                </div>
            </div>

            <!-- 4. CORPS PRINCIPAL : QR CODE GÉANT DE SCAN + TÂCHES AUTORISÉES -->
            <div style="display:grid;grid-template-columns:220px 1fr;gap:12px;margin-top:8px;align-items:stretch;">
                
                <!-- BLOC QR CODE GÉANT -->
                <div style="border:2px solid #000;border-radius:8px;padding:10px;text-align:center;background:#f8fafc;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                    <div style="font-size:9px;font-weight:900;color:#000;text-transform:uppercase;margin-bottom:6px;letter-spacing:0.5px;">
                        📱 SCAN CONTRÔLE HSE
                    </div>
                    <div style="width:160px;height:160px;background:#fff;border:2px solid #000;border-radius:6px;padding:4px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(0,0,0,0.15);">
                        ${svgQr}
                    </div>
                    <div style="font-size:8px;font-weight:800;color:#1e3a8a;margin-top:6px;line-height:1.25;">
                        Scannez pour vérifier en direct les visas de M. W.P.E.E.X, habilitations et revalidation
                    </div>
                </div>

                <!-- BLOC TÂCHES AUTORISÉES & ÉQUIPEMENTS -->
                <div style="border:1.5px solid #000;border-radius:8px;padding:10px 12px;background:#fff;display:flex;flex-direction:column;justify-content:space-between;">
                    <div>
                        <div style="font-size:10px;font-weight:900;color:#000;border-bottom:1.5px solid #000;padding-bottom:3px;margin-bottom:6px;text-transform:uppercase;">
                            📋 ACTIVITÉS AUTORISÉES EN ${activeZone.name.split('—')[0].trim()} :
                        </div>
                        <ul style="margin:0;padding-left:14px;font-size:9px;line-height:1.4;color:#1e293b;">
                            ${tasksList.map(t => `<li style="margin-bottom:3px;"><strong>${t}</strong></li>`).join('')}
                        </ul>
                    </div>

                    <div style="margin-top:8px;background:#f1f5f9;border:1px solid #cbd5e1;border-radius:6px;padding:6px 8px;">
                        <div style="font-size:8px;font-weight:800;color:#475569;text-transform:uppercase;">Outillages & Équipements de Levage Homologués :</div>
                        <div style="font-size:8.5px;color:#0f172a;font-weight:600;margin-top:2px;">${activeZone.equip}</div>
                    </div>
                </div>
            </div>

            <!-- 5. MATRICE DE SÉCURITÉ & ANNEXES EXIGÉES POUR LA ZONE -->
            <div style="border:1.5px solid #000;border-radius:6px;padding:8px 12px;margin-top:8px;background:#fff;">
                <div style="font-size:9px;font-weight:900;color:#000;margin-bottom:4px;text-transform:uppercase;">
                    🛡️ CONSIGNES CRITIQUES & ANNEXES DU DOSSIER ASSOCIÉES À CETTE ZONE :
                </div>
                <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:6px;font-size:8px;">
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
                <div style="font-size:8.5px;font-weight:900;color:#000;margin-bottom:4px;text-transform:uppercase;text-align:center;">
                    VISAS & ÉMARGEMENTS DU PERMIS DE ZONE (VALIDITÉ SEMAINE ${weekNum})
                </div>
                <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:6px;">
                    ${this.renderSigBox(p, 'wpeex', 'M. W.P.E.E.X', p['wpeex-nom'] || 'M. W.P.E.E.X', 'Ingénieur de Suivi / Stellantis')}
                    ${this.renderSigBox(p, 'chef', 'Xie Xian', p['chef-nom'] || 'Xie Xian', 'Responsable Exécution Sinylon')}
                    ${this.renderSigBox(p, 'hse', 'Nouri Chahrour', p['hse-nom'] || 'Nouri Chahrour', 'Superviseur HSE Sinylon')}
                </div>
            </div>

            <!-- 7. FOOTER DE BAS D'AFFICHE -->
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:8px;color:#64748b;margin-top:4px;border-top:1px solid #cbd5e1;padding-top:3px;">
                <div>Document officiel de chantier · Affichage obligatoire à l'entrée de la zone de travail</div>
                <div>SINYLON & W.P.E.E.X · Système Permis Stellantis K9</div>
                <div>Date d'impression : ${new Date().toLocaleDateString('fr-FR')}</div>
            </div>
        </div>
        `;
    },

    // =========================================================================
    // 7. FEUILLE RÉCAPITULATIVE OFFICIELLE DE LA CAISSE WEEK-END (STELLANTIS)
    // =========================================================================
    weekendSummarySheet(dates, permitsList, powerCutConfig = null) {
        const d = dates || (typeof window !== 'undefined' && window.WeekendCaisseModule ? window.WeekendCaisseModule.getWeekendDates() : {
            rangeLabel: 'Vendredi & Samedi',
            fridayIso: '2026-09-11',
            saturdayIso: '2026-09-12'
        });
        const list = permitsList || [];
        const pc = powerCutConfig || (typeof window !== 'undefined' && window.WeekendCaisseModule ? window.WeekendCaisseModule.getPowerCutConfig() : {
            enabled: true,
            day: 'Vendredi',
            startTime: '08:00',
            endTime: '12:00',
            zones: 'Zone UB, Zone UAR, Zone FUSA (Soubassements K9)',
            responsable: 'Nouri Chahrour / Xie Xian (Sinylon) · Visa : M. W.P.E.E.X',
            lockoutDetails: 'Consignation LOTO TGBT & Armoires Secondaires'
        });

        const store = typeof window !== 'undefined' && window.Store ? window.Store : null;
        const currentWeek = (list.length > 0 && list[0].week) ? list[0].week : (store ? store.getCurrentWeekNumber() : 37);

        // QR Code pour la feuille récapitulative
        let summaryQr = '<div style="width:70px;height:70px;border:1px solid #000;display:flex;align-items:center;justify-content:center;font-size:8px;">QR DOSSIER</div>';
        if (typeof window !== 'undefined' && window.QRCodeGenerator) {
            summaryQr = window.QRCodeGenerator.toSVG(`https://sinylon-permis.onrender.com/?caisseWeek=${currentWeek}&view=weekend`, { size: 70, margin: 1 });
        }

        const rowsHtml = list.map((p, idx) => {
            const z = p.zoneKey || (p.id.includes('UAR') ? 'UAR' : (p.id.includes('FUSA') ? 'FUSA' : (p.id.includes('UB') ? 'UB' : 'WE')));
            const title = p.title || p['work-desc'] || 'Travaux de week-end';
            const sigW = (p.signatures && p.signatures.wpeex && p.signatures.wpeex.status === 'VALIDATED') ? '🟢 CONFORME (M. W.P.E.E.X)' : '🟡 EN ATTENTE';
            const dangers = [];
            if (p.dangers && p.dangers.height) dangers.push('Hauteur');
            if (p.dangers && p.dangers.hot) dangers.push('Chaud');
            if (p.dangers && p.dangers.electric) dangers.push('Électrique/LOTO');

            return `
                <tr style="font-size:8.5px;border-bottom:1px solid #cbd5e1;height:24px;">
                    <td style="border:1px solid #000;text-align:center;font-weight:bold;padding:3px;">${idx + 1}</td>
                    <td style="border:1px solid #000;text-align:center;font-family:monospace;font-weight:900;color:#1e3a8a;padding:3px;">${p.id}</td>
                    <td style="border:1px solid #000;font-weight:bold;padding:3px 6px;">ZONE ${z}</td>
                    <td style="border:1px solid #000;padding:3px 6px;">${title}</td>
                    <td style="border:1px solid #000;text-align:center;padding:3px;font-size:7.5px;">${dangers.join(', ') || 'Standard'}</td>
                    <td style="border:1px solid #000;text-align:center;font-weight:bold;padding:3px;font-size:8px;color:#15803d;">${sigW}</td>
                </tr>
            `;
        }).join('');

        return `
        <div class="a4-document" style="font-family:Arial,Helvetica,sans-serif;color:#000;padding:7mm 9mm 6mm 9mm;box-sizing:border-box;height:297mm;max-height:297mm;overflow:hidden;position:relative;display:flex;flex-direction:column;justify-content:space-between;">
            <div>
                <!-- EN-TÊTE OFFICIEL STELLANTIS & SINYLON -->
                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #000;padding-bottom:5px;margin-bottom:6px;">
                    <div style="display:flex;align-items:center;gap:6px;">
                        <span style="background:#000;color:#fff;font-weight:900;font-size:15px;padding:3px 8px;border-radius:2px;">SINYLON</span>
                        <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:15px;padding:2px 8px;border-radius:2px;background:#fff;">STELLANTIS</span>
                    </div>
                    <div style="text-align:center;flex:1;">
                        <div style="font-size:15px;font-weight:900;text-transform:uppercase;letter-spacing:0.5px;color:#0f172a;">
                            DOSSIER CAISSE WEEK-END — PERMIS SPÉCIAUX
                        </div>
                        <div style="font-size:9.5px;font-weight:bold;color:#1e3a8a;">
                            Projet Industrialisation Algeria K9 CKD0 · Maître d'Ouvrage : STELLANTIS
                        </div>
                    </div>
                    <div style="border:1.5px solid #000;padding:3px 8px;text-align:center;background:#eff6ff;border-radius:3px;">
                        <strong style="font-size:8px;color:#64748b;">PÉRIODE CIBLE</strong><br>
                        <span style="font-size:12px;font-weight:900;color:#1d4ed8;font-family:monospace;">SEMAINE ${currentWeek}</span>
                    </div>
                </div>

                <!-- BANDEAU D'ALERTES ET DATES -->
                <div style="background:#fef3c7;border:1.5px solid #d97706;border-radius:5px;padding:6px 10px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <strong style="color:#b45309;font-size:11px;">📅 INTERVENTIONS PROGRAMMÉES :</strong>
                        <span style="font-size:11px;font-weight:800;color:#0f172a;margin-left:6px;">${d.rangeLabel || 'Vendredi & Samedi'} (08h00 → 18h00)</span>
                    </div>
                    <div style="font-size:9px;font-weight:bold;background:#fff;border:1px solid #d97706;padding:2px 8px;border-radius:3px;color:#b45309;">
                        PRÉSENTATION DU MERCREDI À STELLANTIS &amp; W.P.E.E.X
                    </div>
                </div>

                <!-- BLOC 1 : CONSIGNE DE COUPURE DE COURANT VENDREDI -->
                <div style="border:2px solid ${pc.enabled ? '#0284c7' : '#94a3b8'};border-radius:6px;padding:6px 10px;margin-bottom:8px;background:${pc.enabled ? '#f0f9ff' : '#f8fafc'};">
                    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid ${pc.enabled ? '#0284c7' : '#cbd5e1'};padding-bottom:3px;margin-bottom:4px;">
                        <strong style="font-size:9.5px;color:${pc.enabled ? '#0369a1' : '#475569'};text-transform:uppercase;">
                            ⚡ CONSIGNE PARTICULIÈRE : COUPURE DE COURANT SUR SITE (VENDREDI)
                        </strong>
                        <span style="font-size:8px;font-weight:900;background:${pc.enabled ? '#0284c7' : '#64748b'};color:#fff;padding:1px 6px;border-radius:3px;">
                            ${pc.enabled ? 'ACTIF SUR SITE' : 'NON REQUIS'}
                        </span>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr 1.2fr;gap:8px;font-size:8.5px;">
                        <div>⏰ <strong>Plage Horaire :</strong> ${pc.startTime || '08:00'} → ${pc.endTime || '12:00'}</div>
                        <div>📍 <strong>Zones d'Isolement :</strong> ${pc.zones || 'UB / UAR / FUSA'}</div>
                        <div>🛡️ <strong>Consignation :</strong> ${pc.lockoutDetails || 'LOTO TGBT Cadenassé sous clé'}</div>
                    </div>
                </div>

                <!-- BLOC 2 : TABLEAU DES PERMIS INCLUS DANS LA CAISSE WEEK-END -->
                <div style="margin-bottom:6px;">
                    <div style="font-size:9.5px;font-weight:900;text-transform:uppercase;color:#000;margin-bottom:3px;">
                        📋 LISTE EXHAUSTIVE DES PERMIS DE TRAVAIL SPÉCIAUX (WEEK-END) :
                    </div>
                    <table style="width:100%;border-collapse:collapse;border:1.5px solid #000;">
                        <thead>
                            <tr style="background:#000;color:#fff;font-size:8px;text-transform:uppercase;">
                                <th style="border:1px solid #000;padding:4px;width:30px;">N°</th>
                                <th style="border:1px solid #000;padding:4px;width:100px;">N° Permis</th>
                                <th style="border:1px solid #000;padding:4px;width:95px;">Zone Chantier</th>
                                <th style="border:1px solid #000;padding:4px;">Description de l'Activité Autorisée</th>
                                <th style="border:1px solid #000;padding:4px;width:100px;">Annexes Risques</th>
                                <th style="border:1px solid #000;padding:4px;width:110px;">Visa W.P.E.E.X</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml || `
                                <tr>
                                    <td colspan="6" style="text-align:center;padding:10px;font-size:9px;color:#64748b;">
                                        Aucun permis spécial enregistré. Les permis de zone habituels restent valides.
                                    </td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>

                <!-- BLOC 3 : PROTOCOLE SÉCURITÉ & HABILITATIONS WEEK-END -->
                <div style="border:1.2px solid #000;border-radius:5px;padding:6px 10px;margin-bottom:8px;background:#fff;display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:8px;">
                    <div>
                        <strong style="color:#1e3a8a;text-transform:uppercase;display:block;margin-bottom:2px;">🛡️ Dispositions HSE Obligatoires :</strong>
                        <ul style="margin:0;padding-left:14px;line-height:1.35;color:#334155;">
                            <li>Présence permanente du Superviseur HSE Sinylon (Nouri Chahrour)</li>
                            <li>Vérification préalable des 59 badges et stickers casques certifiés</li>
                            <li>Contrôle de veille incendie (30 minutes après tout travail à chaud)</li>
                            <li>Balisage rigide des zones sous coupure électrique et travaux hauteur</li>
                        </ul>
                    </div>
                    <div>
                        <strong style="color:#1e3a8a;text-transform:uppercase;display:block;margin-bottom:2px;">📞 Canaux d'Alerte et d'Urgence :</strong>
                        <div style="line-height:1.35;color:#334155;">
                            <div>• Poste de Commandement Sinylon : <strong>0562765157</strong> (Nouri C.)</div>
                            <div>• Ingénieur de Suivi Stellantis : <strong>M. W.P.E.E.X</strong></div>
                            <div>• Responsable Exécution Travaux : <strong>Xie Xian</strong></div>
                            <div>• Point de Rassemblement Sécurité : <strong>Zone Nord Assemblage</strong></div>
                        </div>
                    </div>
                </div>

                <!-- BLOC 4 : VISAS TRIPARTITES OFFICIELS DU WEEK-END -->
                <div style="border:1.5px solid #000;border-radius:5px;padding:6px 8px;background:#f8fafc;">
                    <div style="font-size:9px;font-weight:900;text-transform:uppercase;text-align:center;margin-bottom:4px;color:#000;">
                        VISAS D'APPROBATION OFFICIELLE DU DOSSIER WEEK-END (STELLANTIS / SINYLON / W.P.E.E.X)
                    </div>
                    <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:6px;">
                        <div style="border:1px solid #000;background:#fff;padding:4px 6px;min-height:54px;border-radius:3px;">
                            <div style="font-size:7.5px;color:#64748b;font-weight:bold;">INGÉNIEUR DE SUIVI / STELLANTIS</div>
                            <div style="font-size:9px;font-weight:bold;color:#000;margin-top:1px;">M. W.P.E.E.X</div>
                            <div style="font-size:7px;color:#16a34a;font-weight:900;margin-top:3px;">✓ DOSSIER VÉRIFIÉ & VALIDÉ</div>
                            <div style="font-size:6.5px;color:#475569;">Date : ${d.fridayIso || '2026-09-11'} 08h00</div>
                        </div>
                        <div style="border:1px solid #000;background:#fff;padding:4px 6px;min-height:54px;border-radius:3px;">
                            <div style="font-size:7.5px;color:#64748b;font-weight:bold;">RESPONSABLE EXÉCUTION SINYLON</div>
                            <div style="font-size:9px;font-weight:bold;color:#000;margin-top:1px;">Xie Xian (Chef de Projet)</div>
                            <div style="font-size:7px;color:#16a34a;font-weight:900;margin-top:3px;">✓ ENGAGEMENT EXÉCUTION CONFORME</div>
                            <div style="font-size:6.5px;color:#475569;">Date : ${d.fridayIso || '2026-09-11'} 08h00</div>
                        </div>
                        <div style="border:1px solid #000;background:#fff;padding:4px 6px;min-height:54px;border-radius:3px;">
                            <div style="font-size:7.5px;color:#64748b;font-weight:bold;">SUPERVISEUR HSE CHANTIER</div>
                            <div style="font-size:9px;font-weight:bold;color:#000;margin-top:1px;">Nouri Chahrour</div>
                            <div style="font-size:7px;color:#16a34a;font-weight:900;margin-top:3px;">✓ SUPERVISION TERRAIN ACTIVE</div>
                            <div style="font-size:6.5px;color:#475569;">Date : ${d.fridayIso || '2026-09-11'} 08h00</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PIED DE PAGE AVEC QR CODE DE CONTRÔLE -->
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid #000;padding-top:4px;font-size:7.5px;color:#334155;">
                <div style="display:flex;align-items:center;gap:8px;">
                    <div style="width:38px;height:38px;background:#fff;border:1px solid #000;display:flex;align-items:center;justify-content:center;">
                        ${summaryQr}
                    </div>
                    <div>
                        <strong>Dossier Caisse Week-end Officiel · Algeria K9 CKD0</strong><br>
                        Imprimé pour présentation hebdomadaire du Mercredi à Stellantis &amp; W.P.E.E.X
                    </div>
                </div>
                <div style="text-align:right;">
                    Page 1 de Récapitulatif · Réf: SINYLON-K9-W${currentWeek}-CAISSE-WE<br>
                    Édité le : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})}
                </div>
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
