#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Générateur Semaine 36 (du 31/08/2026 au 06/09/2026) — Date du jour : 02 Septembre 2026
Permis SYN-K9-KW36 — Sinylon Stellantis
Clone exact de la photo du Permis Général + Revalidations 08h10 + Annexes A, B, C + Affiche QR
"""

import os
import qrcode
import io
import base64
import json
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

# Charger données SYN-K9-KW36
with open('k9_weekly_permits.json') as f:
    permits = json.load(f)
p = permits.get('SYN-K9-KW36', {})

work_desc = p.get('work-desc', '')
work_desc_en = p.get('work-desc-en', '')
permit_id = p.get('id', 'SYN-K9-KW36')
date_deb = p.get('date_debut', '2026-08-31')
date_fin = p.get('date_fin', '2026-09-06')
date_today = '2026-09-02' # 02 Septembre 2026

qr_url = f"https://permis-sinylon.onrender.com/?permitId={permit_id}"
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=10,
    border=1
)
qr.add_data(qr_url)
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white")
buffered = io.BytesIO()
img.save(buffered, format="PNG")
qr_base64 = base64.b64encode(buffered.getvalue()).decode()

html_content = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>DOSSIER OFFICIEL PERMIS SINYLON STELLANTIS A4 - SEMAINE 36 (02/09/2026)</title>
<style>
@page {{
    size: A4 portrait;
    margin: 0;
}}
*, *:before, *:after {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}}
body {{
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    background: #525659;
    color: #000;
}}
.page {{
    width: 210mm;
    height: 297mm;
    min-height: 297mm;
    max-height: 297mm;
    margin: 10px auto;
    padding: 5mm 8mm 4mm 8mm;
    background: #fff;
    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    page-break-after: always;
    page-break-inside: avoid;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    position: relative;
}}
@media print {{
    body {{ background: #fff; }}
    .page {{
        margin: 0;
        box-shadow: none;
        width: 210mm;
        height: 297mm;
    }}
    .no-print {{ display: none !important; }}
}}
.footer-qr {{
    border: 1.5px solid #000;
    padding: 3px 8px;
    background: #f8fafc;
    border-radius: 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
}}
.footer-qr-text {{
    font-size: 7.5px;
    color: #000;
    line-height: 1.2;
    flex: 1;
}}
.footer-qr-img {{
    width: 44px;
    height: 44px;
    border: 1.5px solid #000;
    background: #fff;
    padding: 1px;
    margin-left: 8px;
}}
.border-blue {{ border: 3px solid #004080 !important; }}
.border-red {{ border: 3px solid #cc0000 !important; }}
.border-amber {{ border: 3px solid #d97706 !important; }}
.check-box-yn {{
    border: 1px solid #000;
    display: inline-flex;
    font-size: 7px;
    font-weight: 800;
    line-height: 1;
    margin-left: 4px;
    vertical-align: middle;
}}
.check-box-yn span {{ padding: 1px 3px; }}
.check-box-yn span.checked {{ background: #000; color: #fff; }}
</style>
</head>
<body>

<div class="no-print" style="background:#1e293b;color:#fff;padding:12px;text-align:center;font-family:sans-serif;position:sticky;top:0;z-index:9999;box-shadow:0 4px 10px rgba(0,0,0,0.3);">
    <strong style="font-size:16px;">🖨️ DOSSIER COMPLET PERMIS SINYLON — SEMAINE 36 (DATE DU JOUR : 02 SEPTEMBRE 2026)</strong>
    <span style="margin:0 15px;color:#94a3b8;">|</span>
    <span>Permis N° {permit_id} · Valide du {date_deb} au {date_fin}</span>
    <button onclick="window.print()" style="background:#2563eb;color:#fff;border:none;padding:8px 18px;font-size:14px;font-weight:bold;border-radius:6px;cursor:pointer;margin-left:20px;">
        🖨️ IMPRIMER TOUT EN A4 (PDF)
    </button>
</div>

<!-- ========================================================================= -->
<!-- PAGE 1 : PERMIS DE TRAVAIL DE SECURITÉ GÉNÉRALE (RECTO - SEMAINE 36)      -->
<!-- CLONE EXACT DE LA PHOTO CSPS FIAT ADAPTÉE POUR SINYLON - STELLANTIS      -->
<!-- ========================================================================= -->
<div class="page" id="page-1">
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
                    <div style="font-size:12px;font-weight:900;padding:1px 4px;color:#000;">{permit_id}</div>
                </div>
            </div>
        </div>

        <!-- SECTION 1 : BRÈVE DESCRIPTION DU TRAVAIL (BANDEAU JAUNE) - SEMAINE 36 DYNAMIQUE -->
        <div style="border:1px solid #000;margin-top:3px;">
            <div style="background:#ffeb3b;border-bottom:1px solid #000;padding:2px 6px;font-weight:900;font-size:8.5px;text-align:center;">
                Bréve description du travail
            </div>
            <div style="padding:4px 6px;min-height:38px;font-size:7.5px;line-height:1.25;color:#000;">
                {work_desc}
                <div style="font-size:7px;color:#475569;font-style:italic;margin-top:2px;">{work_desc_en}</div>
            </div>
        </div>

        <!-- SECTION 2 : ENDROIT DE TRAVAIL & ÉQUIPEMENTS (BANDEAUX JAUNES) -->
        <div style="display:grid;grid-template-columns:1fr 1fr;border:1px solid #000;border-top:none;">
            <div style="border-right:1px solid #000;">
                <div style="background:#ffeb3b;border-bottom:1px solid #000;padding:2px 6px;font-weight:900;font-size:8.5px;text-align:center;">
                    Endroit de travail:
                </div>
                <div style="padding:3px 6px;font-size:7.5px;min-height:34px;">
                    <strong>Localisation :</strong> Bâtiment Montage Stellantis — Lignes FUSA / UAR / UB<br>
                    <strong>Secteur :</strong> Atelier Assemblage Stellantis (Algeria K9 CKD0)
                </div>
            </div>
            <div>
                <div style="background:#ffeb3b;border-bottom:1px solid #000;padding:2px 6px;font-weight:900;font-size:8.5px;text-align:center;">
                    Equipment/Machinerie / Zone sur lequel s'effectue le travail
                </div>
                <div style="padding:3px 6px;font-size:7.5px;min-height:34px;">
                    <strong>ZONE :</strong> <span style="font-weight:bold;color:#1e3a8a;">Zones FUSA / UAR / UB</span><br>
                    <strong>Équipements :</strong> Postes de soudage ARO, Préhenseurs (grippers), Gabarits d'assemblage, Nacelles ciseaux (x6), Manlift, Palans DEMAG
                </div>
            </div>
        </div>

        <!-- SECTION 3 : ENTREPRISE INTERVENANTE & CONTACTS -->
        <div style="display:grid;grid-template-columns:1.2fr 1fr;border:1px solid #000;border-top:none;font-size:7.5px;">
            <div style="border-right:1px solid #000;padding:3px 6px;">
                <div><strong>Entreprise Intervenante :</strong> <span style="font-weight:bold;">SINYLON</span></div>
                <div style="color:#333;margin-top:1px;">Avant de commencer le travail, veuillez contacter:</div>
                <div style="margin-top:1px;"><strong>Nom:</strong> XIE XIAN (Chef de Projet)</div>
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
                    <strong>Ouvrage :</strong> Stellantis K9&nbsp;&nbsp;&nbsp;
                    <strong>ZONE :</strong> FUSA/UAR/UB&nbsp;&nbsp;&nbsp;
                    <strong>Tél. :</strong> 0563765157
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
                                <span style="background:#000;color:#fff;padding:0 2px;">.Y.</span>
                                <span style="padding:0 2px;">N</span>
                            </span>
                            <strong style="margin-left:4px;font-size:8px;">A</strong>
                        </span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                        <span>Travail dans un espace confiné</span>
                        <span>
                            <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                <span style="padding:0 2px;">.Y.</span>
                                <span style="background:#000;color:#fff;padding:0 2px;">N</span>
                            </span>
                            <strong style="margin-left:4px;font-size:8px;">B</strong>
                        </span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                        <span>Travail sur un système électrique</span>
                        <span>
                            <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                <span style="background:#000;color:#fff;padding:0 2px;">.Y.</span>
                                <span style="padding:0 2px;">N</span>
                            </span>
                            <strong style="margin-left:4px;font-size:8px;">C</strong>
                        </span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                        <span>Ouvrir un système/une ligne de rupture ( ligne Hydraulique etc )</span>
                        <span>
                            <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                <span style="padding:0 2px;">.Y.</span>
                                <span style="background:#000;color:#fff;padding:0 2px;">N</span>
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
                                <span style="background:#000;color:#fff;padding:0 2px;">Y</span>
                                <span style="padding:0 2px;">N</span>
                            </span>
                            <strong style="margin-left:4px;font-size:8px;">B</strong>
                        </span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                        <span>Excavation</span>
                        <span>
                            <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                <span style="padding:0 2px;">.Y.</span>
                                <span style="background:#000;color:#fff;padding:0 2px;">N</span>
                            </span>
                            <strong style="margin-left:4px;font-size:8px;">D</strong>
                        </span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                        <span>Travail sur equipement sous tension</span>
                        <span>
                            <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                <span style="background:#000;color:#fff;padding:0 2px;">.Y.</span>
                                <span style="padding:0 2px;">N</span>
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

        <!-- SECTION 5 : VALIDITÉ DU PERMIS ET SIGNATURES - SEMAINE 36 (02 SEP 2026) -->
        <div style="border:1px solid #000;border-top:none;padding:3px 6px;">
            <div style="font-weight:900;font-size:8.5px;margin-bottom:2px;">
                validité du permis et signatures
            </div>
            <div style="display:flex;gap:15px;align-items:center;font-size:7.5px;margin-bottom:2px;">
                <div>Date du permis : <span style="border:1px solid #000;padding:1px 6px;font-weight:bold;font-family:monospace;">{date_today}</span></div>
                <div>heure de début : <span style="border:1px solid #000;padding:1px 6px;font-weight:bold;font-family:monospace;">08h00</span></div>
                <div>heure de fin : <span style="border:1px solid #000;padding:1px 6px;font-weight:bold;font-family:monospace;">17h30</span></div>
            </div>
            <div style="font-size:6.5px;color:#333;line-height:1.2;margin-bottom:3px;">
                Ce permis de travail de sécurité générale et sa liste de verification des grands danger avec le meme identifiant du permis sont uniquement valide pour la date et la période spécifiée ci-dessus. Toute les signatures doivent etre obtenues avant l'entame du travail. Permis affiché sur le lieu de travail. Copies: Emetteur du permis,receveur du permis et si applicable: Coordinateurr, chef de quart et/ou salle de controle.
            </div>

            <!-- GRILLE DES SIGNATURES INITIALES (EXACT PHOTO - CASES VIDES POUR SIGNATURE AU STYLO) -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:3px;">
                <div style="border:1px solid #000;background:#fff;padding:2px 4px;font-size:7px;min-height:36px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;border-bottom:1px solid #000;font-size:7.5px;">Chef de Projet Entreprise</div>
                    <div>Nom (lettres en majuscule) et signature: <strong>XIE XIAN</strong></div>
                    <div style="height:14px;border-bottom:1px dashed #999;color:#777;font-size:6.5px;display:flex;align-items:flex-end;">Signature :</div>
                </div>
                <div style="border:1px solid #000;background:#fff;padding:2px 4px;font-size:7px;min-height:36px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;border-bottom:1px solid #000;font-size:7.5px;">MOEX - Ingénieur de Suivi</div>
                    <div>Nom(lettres en majuscule) et signature: <strong>M. W.P.E.E.X</strong></div>
                    <div style="height:14px;border-bottom:1px dashed #999;color:#777;font-size:6.5px;display:flex;align-items:flex-end;">Signature :</div>
                </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr 1.2fr;gap:4px;">
                <div style="border:1px solid #000;background:#fff;padding:2px 4px;font-size:7px;min-height:46px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;border-bottom:1px solid #000;font-size:7.5px;">Coordinateur HSE Sinylon</div>
                    <div>Nom (lettres en majuscule) et signature:<br><strong>Nouri Chahrour</strong></div>
                    <div style="height:14px;border-bottom:1px dashed #999;color:#777;font-size:6.5px;display:flex;align-items:flex-end;">Signature :</div>
                </div>
                <div style="border:1px solid #000;background:#fff;padding:2px 4px;font-size:7px;min-height:46px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;border-bottom:1px solid #000;font-size:7.5px;">HSE Entreprise</div>
                    <div>Nom (lettres en majuscule) et signature:<br><strong>Nouri Chahrour</strong></div>
                    <div style="height:14px;border-bottom:1px dashed #999;color:#777;font-size:6.5px;display:flex;align-items:flex-end;">Signature :</div>
                    <div style="font-size:5.5px;color:#333;line-height:1;margin-top:1px;">Confirmation que toutes les précautions et les vérifications nécessaires sont en place, comme la liste de vérification appliquée</div>
                </div>
                <div style="border:1px solid #000;background:#fff;padding:2px 4px;font-size:7px;min-height:46px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;border-bottom:1px solid #000;font-size:7.5px;">Receveur du permis</div>
                    <div>Nom (lettres en majuscule) et signature:<br><strong>ZHOU LIN</strong></div>
                    <div style="height:14px;border-bottom:1px dashed #999;color:#777;font-size:6.5px;display:flex;align-items:flex-end;">Signature :</div>
                    <div style="font-size:5.5px;color:#333;line-height:1;margin-top:1px;">Information que toutes les précautions et les vérifications nécessaires sont en place ont été reçues. Les instructions fournies dans le permis de travail seront suivies. Tout les travailleurs ont été informés.</div>
                </div>
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

            <div style="display:grid;grid-template-columns:1.2fr 1.2fr 1fr;gap:4px;margin-bottom:3px;">
                <div style="border:1px solid #000;background:#fff;padding:2px 4px;min-height:30px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;font-size:7px;">Receveur du permis</div>
                    <div style="font-size:6px;color:#555;">Nom (lettres en majuscule) et signature:</div>
                    <div style="height:12px;border-bottom:1px dashed #999;font-size:6px;color:#777;">Signature :</div>
                </div>
                <div style="border:1px solid #000;background:#fff;padding:2px 4px;min-height:30px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;font-size:7px;">MOEX - Ingénieur de Suivi</div>
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

        <!-- PIED DE PAGE EXACT PHOTO -->
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:8px;font-weight:bold;margin-top:3px;padding:0 4px;">
            <div>Numéro d'urgence : <span style="font-weight:normal;">0563765157 / 14</span></div>
            <div>Mobile : <span style="font-weight:normal;">0563765157</span></div>
            <div>Page 1/2</div>
        </div>
    </div>

    <!-- QR Footer -->
    <div class="footer-qr">
        <div class="footer-qr-text">
            <div style="font-weight:900;font-size:8.5px;text-transform:uppercase;letter-spacing:0.5px;">
                🛡️ VÉRIFICATION ÉLECTRONIQUE / DIGITAL WORK PERMIT QR VERIFICATION
            </div>
            <div style="font-size:7.5px;color:#334155;margin-top:1px;">
                Scannez ce QR Code pour vérifier en direct la validité journalière <strong>(Validé à 08h10 chaque matin)</strong>, les visas MOEX / W.P.E.E.X et les habilitations.
            </div>
            <div style="font-family:monospace;font-weight:800;font-size:8.5px;color:#1e3a8a;margin-top:1px;">
                PERMIS N° {permit_id} · SEMAINE 36 ({date_deb} AU {date_fin}) · STELLANTIS
            </div>
        </div>
        <img class="footer-qr-img" src="data:image/png;base64,{qr_base64}" alt="QR Code">
    </div>
</div>

<!-- ========================================================================= -->
<!-- PAGE 2 : REVALIDATION QUOTIDIENNE DU PERMIS (SEMAINE 36)                  -->
<!-- Tableau des 7 journées avec date du jour 02/09/2026 (Mercredi)           -->
<!-- ========================================================================= -->
<div class="page" id="page-2">
    <div>
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #000;padding-bottom:4px;margin-bottom:4px;">
            <div style="display:flex;align-items:center;gap:6px;">
                <span style="background:#000;color:#fff;font-weight:900;font-size:14px;padding:2px 8px;border-radius:2px;letter-spacing:1px;">SINYLON</span>
                <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:14px;padding:1px 8px;border-radius:2px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
            </div>
            <div style="font-size:14px;font-weight:900;text-align:center;flex:1;">
                Revalidation Quotidienne du Permis de Travail (Semaine 36)<br>
                <span style="font-size:7.5px;font-weight:normal;color:#333;">Daily Work Permit Revalidation Sheet (Contrôle et émargement chaque matin à 08h10)</span>
            </div>
            <div style="border:1.5px solid #000;padding:2px 8px;text-align:center;border-radius:2px;background:#f8fafc;">
                <strong style="font-size:7.5px;">Permit ID</strong><br>
                <span style="font-size:12px;font-weight:900;color:#1e3a8a;">{permit_id}</span>
            </div>
        </div>

        <div style="background:#ffeb3b;border:1px solid #000;padding:3px 6px;font-weight:900;font-size:8.5px;margin-top:6px;display:flex;justify-content:space-between;">
            <span>REVALIDATION QUOTIDIENNE DU PERMIS — SEMAINE 36 (DU 31/08/2026 AU 06/09/2026)</span>
            <span style="font-size:7.5px;font-weight:normal;font-style:italic;">Pointage sur site à 08h10 chaque matin</span>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-top:4px;">
            <thead>
                <tr style="background:#f1f5f9;font-size:7.5px;">
                    <th rowspan="2" style="border:1px solid #000;padding:3px 4px;width:100px;">JOURNÉE</th>
                    <th rowspan="2" style="border:1px solid #000;padding:3px 4px;width:75px;">DATE</th>
                    <th colspan="3" style="border:1px solid #000;padding:2px;background:#eff6ff;color:#1e3a8a;">W.P.E.E.X - Ingénieur de Suivi</th>
                    <th colspan="3" style="border:1px solid #000;padding:2px;">Responsable d'exécution (SINYLON)</th>
                    <th rowspan="2" style="border:1px solid #000;padding:2px;width:75px;">STATUT</th>
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
                <tr style="height:26px;">
                    <td style="font-weight:bold;font-size:8px;border:1px solid #000;padding:2px 4px;">Jour 1 (Lundi)</td>
                    <td style="font-family:monospace;font-size:8px;border:1px solid #000;padding:2px 4px;text-align:center;">2026-08-31</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">M. W.P.E.E.X</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Ingénieur Suivi</td>
                    <td style="border:1px solid #000;padding:2px;width:110px;"><div style="height:20px;border-bottom:1px dashed #999;margin:1px 4px;"></div></td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Xie Xian</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Chef de Projet</td>
                    <td style="border:1px solid #000;padding:2px;width:110px;"><div style="height:20px;border-bottom:1px dashed #999;margin:1px 4px;"></div></td>
                    <td style="border:1px solid #000;padding:2px;text-align:center;font-size:7.5px;color:#16a34a;font-weight:bold;">Validé 08h10</td>
                </tr>
                <tr style="height:26px;">
                    <td style="font-weight:bold;font-size:8px;border:1px solid #000;padding:2px 4px;">Jour 2 (Mardi)</td>
                    <td style="font-family:monospace;font-size:8px;border:1px solid #000;padding:2px 4px;text-align:center;">2026-09-01</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">M. W.P.E.E.X</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Ingénieur Suivi</td>
                    <td style="border:1px solid #000;padding:2px;width:110px;"><div style="height:20px;border-bottom:1px dashed #999;margin:1px 4px;"></div></td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Xie Xian</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Chef de Projet</td>
                    <td style="border:1px solid #000;padding:2px;width:110px;"><div style="height:20px;border-bottom:1px dashed #999;margin:1px 4px;"></div></td>
                    <td style="border:1px solid #000;padding:2px;text-align:center;font-size:7.5px;color:#16a34a;font-weight:bold;">Validé 08h10</td>
                </tr>
                <!-- AUJOURD'HUI 02 SEPTEMBRE 2026 -->
                <tr style="height:26px;background:rgba(254,240,138,0.35);">
                    <td style="font-weight:bold;font-size:8px;border:1.5px solid #15803d;padding:2px 4px;color:#15803d;">👉 Jour 3 (Mercredi - AUJOURD'HUI)</td>
                    <td style="font-family:monospace;font-size:8.5px;font-weight:bold;border:1.5px solid #15803d;padding:2px 4px;text-align:center;color:#15803d;">2026-09-02</td>
                    <td style="border:1.5px solid #15803d;padding:2px 4px;font-size:7.5px;font-weight:bold;">M. W.P.E.E.X</td>
                    <td style="border:1.5px solid #15803d;padding:2px 4px;font-size:7.5px;">Ingénieur Suivi</td>
                    <td style="border:1.5px solid #15803d;padding:2px;width:110px;"><div style="height:20px;border-bottom:1px dashed #15803d;margin:1px 4px;"></div></td>
                    <td style="border:1.5px solid #15803d;padding:2px 4px;font-size:7.5px;font-weight:bold;">Xie Xian</td>
                    <td style="border:1.5px solid #15803d;padding:2px 4px;font-size:7.5px;">Chef de Projet</td>
                    <td style="border:1.5px solid #15803d;padding:2px;width:110px;"><div style="height:20px;border-bottom:1px dashed #15803d;margin:1px 4px;"></div></td>
                    <td style="border:1.5px solid #15803d;padding:2px;text-align:center;font-size:7.5px;color:#15803d;font-weight:900;background:#dcfce7;">À ÉMARGER 08H10</td>
                </tr>
                <tr style="height:26px;">
                    <td style="font-weight:bold;font-size:8px;border:1px solid #000;padding:2px 4px;">Jour 4 (Jeudi)</td>
                    <td style="font-family:monospace;font-size:8px;border:1px solid #000;padding:2px 4px;text-align:center;">2026-09-03</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">M. W.P.E.E.X</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Ingénieur Suivi</td>
                    <td style="border:1px solid #000;padding:2px;width:110px;"><div style="height:20px;border-bottom:1px dashed #999;margin:1px 4px;"></div></td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Xie Xian</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Chef de Projet</td>
                    <td style="border:1px solid #000;padding:2px;width:110px;"><div style="height:20px;border-bottom:1px dashed #999;margin:1px 4px;"></div></td>
                    <td style="border:1px solid #000;padding:2px;text-align:center;font-size:7.5px;color:#64748b;">À signer 08h10</td>
                </tr>
                <tr style="height:26px;">
                    <td style="font-weight:bold;font-size:8px;border:1px solid #000;padding:2px 4px;">Jour 5 (Vendredi)</td>
                    <td style="font-family:monospace;font-size:8px;border:1px solid #000;padding:2px 4px;text-align:center;">2026-09-04</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">M. W.P.E.E.X</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Ingénieur Suivi</td>
                    <td style="border:1px solid #000;padding:2px;width:110px;"><div style="height:20px;border-bottom:1px dashed #999;margin:1px 4px;"></div></td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Xie Xian</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Chef de Projet</td>
                    <td style="border:1px solid #000;padding:2px;width:110px;"><div style="height:20px;border-bottom:1px dashed #999;margin:1px 4px;"></div></td>
                    <td style="border:1px solid #000;padding:2px;text-align:center;font-size:7.5px;color:#64748b;">À signer 08h10</td>
                </tr>
                <tr style="height:26px;">
                    <td style="font-weight:bold;font-size:8px;border:1px solid #000;padding:2px 4px;">Jour 6 (Samedi)</td>
                    <td style="font-family:monospace;font-size:8px;border:1px solid #000;padding:2px 4px;text-align:center;">2026-09-05</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">M. W.P.E.E.X</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Ingénieur Suivi</td>
                    <td style="border:1px solid #000;padding:2px;width:110px;"><div style="height:20px;border-bottom:1px dashed #999;margin:1px 4px;"></div></td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Xie Xian</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Chef de Projet</td>
                    <td style="border:1px solid #000;padding:2px;width:110px;"><div style="height:20px;border-bottom:1px dashed #999;margin:1px 4px;"></div></td>
                    <td style="border:1px solid #000;padding:2px;text-align:center;font-size:7.5px;color:#64748b;">À signer 08h10</td>
                </tr>
                <tr style="height:26px;">
                    <td style="font-weight:bold;font-size:8px;border:1px solid #000;padding:2px 4px;">Jour 7 (Dimanche)</td>
                    <td style="font-family:monospace;font-size:8px;border:1px solid #000;padding:2px 4px;text-align:center;">2026-09-06</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">M. W.P.E.E.X</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Ingénieur Suivi</td>
                    <td style="border:1px solid #000;padding:2px;width:110px;"><div style="height:20px;border-bottom:1px dashed #999;margin:1px 4px;"></div></td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Xie Xian</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7.5px;">Chef de Projet</td>
                    <td style="border:1px solid #000;padding:2px;width:110px;"><div style="height:20px;border-bottom:1px dashed #999;margin:1px 4px;"></div></td>
                    <td style="border:1px solid #000;padding:2px;text-align:center;font-size:7.5px;color:#64748b;">À signer 08h10</td>
                </tr>
            </tbody>
        </table>

        <!-- Supervision Week-end Semaine 36 -->
        <div style="background:#ffeb3b;border:1px solid #000;padding:3px 6px;font-weight:900;font-size:8.5px;margin-top:10px;">
            SUPERVISION SPÉCIALE CAISSE WEEK-END SEMAINE 36 (08H10)
        </div>
        <table style="width:100%;border-collapse:collapse;margin-top:4px;font-size:7.5px;">
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
                    <td style="border:1px solid #000;font-weight:bold;padding:3px;text-align:center;">Vendredi</td>
                    <td style="border:1px solid #000;font-family:monospace;padding:3px;text-align:center;">2026-09-04</td>
                    <td style="border:1px solid #000;padding:3px;">M. W.P.E.E.X</td>
                    <td style="border:1px solid #000;padding:3px;">Vérification 360°, Nacelles, Extincteurs, Balisage</td>
                    <td style="border:1px solid #000;padding:2px;text-align:center;">
                        <div style="height:20px;border-bottom:1px dashed #999;margin:1px 6px;"></div>
                    </td>
                </tr>
                <tr style="height:28px;">
                    <td style="border:1px solid #000;font-weight:bold;padding:3px;text-align:center;">Samedi</td>
                    <td style="border:1px solid #000;font-family:monospace;padding:3px;text-align:center;">2026-09-05</td>
                    <td style="border:1px solid #000;padding:3px;">M. W.P.E.E.X</td>
                    <td style="border:1px solid #000;padding:3px;">Vérification 360°, Nacelles, Extincteurs, Balisage</td>
                    <td style="border:1px solid #000;padding:2px;text-align:center;">
                        <div style="height:20px;border-bottom:1px dashed #999;margin:1px 6px;"></div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- QR Footer -->
    <div class="footer-qr">
        <div class="footer-qr-text">
            <div style="font-weight:900;font-size:8.5px;text-transform:uppercase;letter-spacing:0.5px;">
                🛡️ VÉRIFICATION ÉLECTRONIQUE / DIGITAL WORK PERMIT QR VERIFICATION
            </div>
            <div style="font-size:7.5px;color:#334155;margin-top:1px;">
                Scannez ce QR Code pour vérifier en direct la validité journalière <strong>(Validé à 08h10 chaque matin)</strong>, les visas MOEX / W.P.E.E.X et les habilitations.
            </div>
            <div style="font-family:monospace;font-weight:800;font-size:8.5px;color:#1e3a8a;margin-top:1px;">
                PERMIS N° {permit_id} · SEMAINE 36 ({date_deb} AU {date_fin}) · STELLANTIS
            </div>
        </div>
        <img class="footer-qr-img" src="data:image/png;base64,{qr_base64}" alt="QR Code">
    </div>
</div>

<!-- ========================================================================= -->
<!-- PAGE 3 : ANNEXE A (BLEUE) — TRAVAIL EN HAUTEUR (SEMAINE 36)               -->
<!-- ========================================================================= -->
<div class="page border-blue" id="page-3">
    <div>
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #004080;padding-bottom:3px;margin-bottom:3px;">
            <div style="display:flex;align-items:center;gap:8px;">
                <div style="background:#000;color:#fff;font-size:22px;font-weight:900;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:2px;">A</div>
                <div style="font-size:17px;font-weight:900;color:#000;letter-spacing:0.3px;">Travail en hauteur</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
                <div style="display:flex;align-items:center;gap:6px;">
                    <span style="background:#000;color:#fff;font-weight:900;font-size:13px;padding:2px 7px;border-radius:2px;letter-spacing:1px;">SINYLON</span>
                    <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:13px;padding:1px 7px;border-radius:2px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
                </div>
                <div style="border:1px solid #000;text-align:center;width:125px;">
                    <div style="font-size:7.5px;font-weight:700;border-bottom:1px solid #000;padding:1px 4px;background:#f8fafc;">Identifiant du permis</div>
                    <div style="font-size:12px;font-weight:900;padding:1px 4px;color:#000;">{permit_id}</div>
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

        <!-- TABLEAU SECTION 1 -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:3px;font-size:7px;">
            <tbody>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 3px;width:34%;">Echaffaudage fixe</td>
                    <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;"><span class="check-box-yn"><span>.Y</span><span>.N</span></span></td>
                    <td style="border:1px solid #999;padding:1.5px 3px;width:52%;">approuvé et cacheté par le personnel qua</td>
                    <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;"><span class="check-box-yn"><span>.Y</span><span>.N</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 3px;">Echaffaudage mobile</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span>.Y</span><span>.N</span></span></td>
                    <td style="border:1px solid #999;padding:1.5px 3px;">approuvé et cacheté par le personnel qua</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span>.Y</span><span>.N</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 3px;" rowspan="3">Elevateur de plateforme mobile (6 nacelles ciseaux + manlift)</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;" rowspan="3"><span class="check-box-yn"><span class="checked">.Y</span><span>.N</span></span></td>
                    <td style="border:1px solid #999;padding:1.5px 3px;">L'opérateur et le travailleur entrainés</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 3px;">Order to use given in written</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 3px;">Port d'équipement d'arret de chute</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 3px;" rowspan="5">Echelle</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;" rowspan="5"><span class="check-box-yn"><span>Y</span><span>N</span></span></td>
                    <td style="border:1px solid #999;padding:1.5px 3px;">aucun autre équipement ne peut etre utilisé</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span style="border:1px solid #000;padding:0 3px;font-weight:800;">Y</span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 3px;">Utilisé pour des activités à court terme</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span>.Y</span><span>.N</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 3px;">Avec un potentiel de danger minimum</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span>Y</span><span>N</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 3px;">verifier et cacheter</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span>Y</span><span>N</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 3px;">travailleur entrainé dans l'usage</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span>Y</span><span>N</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 3px;" rowspan="2">Equipement d'arret de chute requis ?</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;" rowspan="2"><span class="check-box-yn"><span class="checked">.Y</span><span>.N.</span></span></td>
                    <td style="border:1px solid #999;padding:1.5px 3px;">Verfiyer avant de commencer le travail</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N.</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 3px;">Moyens d'attachement définis par le personnel qualifié</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N.</span></span></td>
                </tr>
            </tbody>
        </table>

        <!-- SECTION 2 : TRAVAIL SUR TOIT -->
        <div style="border:1px solid #000;margin-bottom:3px;font-size:7px;">
            <div style="font-weight:bold;padding:2px 4px;border-bottom:1px solid #000;background:#f1f5f9;display:flex;justify-content:space-between;">
                <span>Travail sur toit</span>
                <span><span class="check-box-yn"><span>.Y</span><span>.N</span></span></span>
            </div>
            <table style="width:100%;border-collapse:collapse;">
                <tr>
                    <td style="border:1px solid #999;padding:2px 4px;width:40%;">Capacité de Charge du toit suffisante à supporter</td>
                    <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;"><span class="check-box-yn"><span>.Y</span><span>.N</span></span></td>
                    <td style="border:1px solid #999;padding:2px 4px;width:46%;">Endroit coordonné fermé</td>
                    <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;"><span class="check-box-yn"><span>.Y</span><span>.N</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:2px 4px;">Présence d'une toiture fragile proximité du site d</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span>.Y</span><span>.N</span></span></td>
                    <td style="border:1px solid #999;padding:2px 4px;">Protection de chute/Protection de bord existante?</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span>.Y</span><span>.N</span></span></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #999;padding:2px 4px;">
                        Mesures additionnel : <span style="border-bottom:1px solid #000;display:inline-block;width:75%;height:10px;"></span>
                    </td>
                </tr>
            </table>
        </div>

        <!-- SECTION 3 : CHECKLIST SITE -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:3px;font-size:7px;">
            <tbody>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 4px;width:92%;">Endroit de travail barré pour véhicules/traffic/piétons</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;width:8%;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N.</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 4px;">Obstacles sur ou approximité du site de travail (conduit de cable, cables seul, tuyauteries, etc.)</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span style="border:1px solid #000;padding:0 3px;font-weight:800;">Y</span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 4px;">Issue de secours d'urgence</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 4px;">Directives de sécurité necessaires</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N</span></span></td>
                </tr>
            </tbody>
        </table>

        <!-- SECTION 4 : CONDITIONS AMBIANTES -->
        <div style="border:1px solid #000;padding:3px 4px;margin-bottom:3px;font-size:7px;">
            <div style="font-weight:bold;margin-bottom:1px;">Conditions ambiantes au moment du problème (Contrôle 08h10)</div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
                <span style="width:110px;font-weight:600;">visibilité générale</span>
                <span>claire <span style="border:1px solid #000;padding:0 3px;font-weight:800;background:#000;color:#fff;">Y</span></span>
                <span>Amoindrit <span class="check-box-yn"><span>.Y.</span><span>.N.</span></span></span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
                <span style="width:110px;font-weight:600;">pluit</span>
                <span>aucune <span style="border:1px solid #000;padding:0 3px;font-weight:800;background:#000;color:#fff;">Y</span></span>
                <span>légère <span class="check-box-yn"><span>.Y.</span><span>.N.</span></span></span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
                <span style="width:110px;font-weight:600;">Surface du site de travail</span>
                <span>sec <span style="border:1px solid #000;padding:0 3px;font-weight:800;background:#000;color:#fff;">Y</span></span>
                <span>Mouillé <span class="check-box-yn"><span>.Y.</span><span>.N.</span></span></span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
                <span style="width:110px;font-weight:600;">Vent</span>
                <span>aucun <span style="border:1px solid #000;padding:0 3px;font-weight:800;background:#000;color:#fff;">Y</span></span>
                <span>Légère <span class="check-box-yn"><span>.Y.</span><span>.N.</span></span></span>
            </div>
        </div>

        <!-- SECTION 5 : SIGNATURES VIDES SEMAINE 36 (02/09/2026) -->
        <table style="width:100%;border-collapse:collapse;margin-top:auto;border:1.5px solid #004080;margin-bottom:2px;">
            <tr style="background:#dbeafe;font-size:7.5px;font-weight:900;text-align:center;">
                <th style="border:1px solid #004080;padding:2px;width:38%;">CHEF DE PROJET</th>
                <th style="border:1px solid #004080;padding:2px;width:38%;">HSE ENTREPRISE</th>
                <th style="border:1px solid #004080;padding:2px;width:24%;">DATE / HEURE</th>
            </tr>
            <tr>
                <td style="border:1px solid #004080;padding:3px 6px;height:38px;vertical-align:top;font-size:7.5px;">
                    <div>Nom : <strong>XIE XIAN</strong></div>
                    <div style="margin-top:8px;font-size:7px;color:#777;">Signature : </div>
                </td>
                <td style="border:1px solid #004080;padding:3px 6px;height:38px;vertical-align:top;font-size:7.5px;">
                    <div>Nom : <strong>Nouri Chahrour</strong></div>
                    <div style="margin-top:8px;font-size:7px;color:#777;">Signature : </div>
                </td>
                <td style="border:1px solid #004080;padding:3px 6px;height:38px;vertical-align:middle;font-size:7.5px;">
                    <div style="display:flex;gap:4px;align-items:center;margin-bottom:3px;">
                        <span>Date :</span>
                        <span style="border:1px solid #000;flex:1;padding:1px 3px;font-family:monospace;font-size:7.5px;">{date_today}</span>
                    </div>
                    <div style="display:flex;gap:4px;align-items:center;">
                        <span>Heure :</span>
                        <span style="border:1px solid #000;flex:1;padding:1px 3px;font-family:monospace;font-size:7.5px;">08h10</span>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- QR Footer -->
    <div class="footer-qr">
        <div class="footer-qr-text">
            <div style="font-weight:900;font-size:8.5px;text-transform:uppercase;letter-spacing:0.5px;">
                🛡️ VÉRIFICATION ÉLECTRONIQUE / DIGITAL WORK PERMIT QR VERIFICATION
            </div>
            <div style="font-size:7.5px;color:#334155;margin-top:1px;">
                Scannez ce QR Code pour vérifier en direct la validité journalière <strong>(Validé à 08h10 chaque matin)</strong>, les visas MOEX / W.P.E.E.X et les habilitations.
            </div>
            <div style="font-family:monospace;font-weight:800;font-size:8.5px;color:#1e3a8a;margin-top:1px;">
                PERMIS N° {permit_id} · SEMAINE 36 ({date_deb} AU {date_fin}) · STELLANTIS
            </div>
        </div>
        <img class="footer-qr-img" src="data:image/png;base64,{qr_base64}" alt="QR Code">
    </div>
</div>

<!-- ========================================================================= -->
<!-- PAGE 4 : ANNEXE B (ROUGE) — TRAVAIL CHAUD (SEMAINE 36)                    -->
<!-- ========================================================================= -->
<div class="page border-red" id="page-4">
    <div>
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #cc0000;padding-bottom:3px;margin-bottom:3px;">
            <div style="display:flex;align-items:center;gap:8px;">
                <div style="background:#000;color:#fff;font-size:22px;font-weight:900;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:2px;">B</div>
                <div style="font-size:17px;font-weight:900;color:#000;letter-spacing:0.3px;">Travail chaud</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
                <div style="display:flex;align-items:center;gap:6px;">
                    <span style="background:#000;color:#fff;font-weight:900;font-size:13px;padding:2px 7px;border-radius:2px;letter-spacing:1px;">SINYLON</span>
                    <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:13px;padding:1px 7px;border-radius:2px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
                </div>
                <div style="border:1px solid #000;text-align:center;width:125px;">
                    <div style="font-size:7.5px;font-weight:700;border-bottom:1px solid #000;padding:1px 4px;background:#f8fafc;">Permit Identifier</div>
                    <div style="font-size:12px;font-weight:900;padding:1px 4px;color:#000;">{permit_id}</div>
                </div>
            </div>
        </div>

        <div style="text-align:center;font-size:7.5px;font-weight:bold;margin-bottom:3px;color:#000;">
            La liste de vérification doit être toujours accompagnée par le permis de travail de sécurité générale
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:3px;font-size:7px;">
            <tbody>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 4px;width:92%;">Tous les produits inflamable ou combustible seront déga 10 m (min. 10 m)</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;width:8%;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N.</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 4px;">Si le déplacement n'est pas possible: les produits inflamable ou combustible seront protégés</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N.</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 4px;">Tous debris, saleté, ou poussière est enlevé</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N.</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 4px;">couvertures resistantes au feu/écran equipé à resister aux eteincelles</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N.</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 4px;">ventillation suffisante sur le lieu de travail (naturel [Y] technique [Y])</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N.</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 4px;">Apareils électrique et cables protégés</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N.</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 4px;">Le Site du travail est marqué/posté et barricadé adequetement</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N.</span></span></td>
                </tr>
            </tbody>
        </table>

        <!-- LUTTE ANTI FEU -->
        <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:4px;margin-bottom:3px;border:1px solid #cc0000;padding:3px;font-size:7px;">
            <div>
                <div style="font-weight:bold;margin-bottom:2px;">Equipement de lutte anti feu fourni</div>
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
                    <span>Extincteur :</span>
                    <span>Water <span style="border:1px solid #000;padding:0 2px;font-weight:bold;">Y</span></span>
                    <span>Poudre <span style="border:1px solid #000;padding:0 2px;font-weight:bold;background:#000;color:#fff;">Y</span></span>
                    <span>CO₂ <span style="border:1px solid #000;padding:0 2px;font-weight:bold;">Y</span></span>
                </div>
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
                    <span>Couvertures anti-feu <span style="border:1px solid #000;padding:0 2px;font-weight:bold;background:#000;color:#fff;">Y</span></span>
                    <span>surveillant d'incendie <span style="border:1px solid #000;padding:0 2px;font-weight:bold;background:#000;color:#fff;">Y</span></span>
                </div>
                <div style="font-size:6.5px;color:#991b1b;font-weight:bold;margin-top:2px;">
                    Surveillant d'incendie présent durant le travail à chaud et 30 minutes après
                </div>
            </div>
            <div style="border-left:1px solid #cc0000;padding-left:4px;">
                <div style="border:1px solid #cc0000;background:#fee2e2;padding:2px 4px;">
                    <div style="font-weight:bold;font-size:7px;color:#991b1b;">HSE ENTREPRISE</div>
                    <div style="font-weight:bold;font-size:7.5px;">Nouri Chahrour</div>
                    <div style="height:12px;border-bottom:1px dashed #991b1b;"></div>
                </div>
            </div>
        </div>

        <!-- ALARME & NOTIFICATIONS -->
        <div style="border:1px solid #000;padding:3px;margin-bottom:3px;font-size:7px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <span>L'alarme d'incendie la plus proche / appel d'urgence :</span>
                <span style="border:1px solid #000;padding:1px 6px;font-weight:bold;background:#f8fafc;">BLOC SÉCURITÉ</span>
            </div>
            <div style="font-size:6.5px;color:#555;margin-top:2px;">
                (Tel. Stellantis Security / HSE Sinylon 24h/24 : 0563765157)
            </div>
        </div>

        <!-- SIGNATURES ANNEXE B SEMAINE 36 (02/09/2026) -->
        <table style="width:100%;border-collapse:collapse;margin-top:auto;border:1.5px solid #cc0000;margin-bottom:2px;">
            <tr style="background:#fee2e2;font-size:7.5px;font-weight:900;text-align:center;">
                <th style="border:1px solid #cc0000;padding:2px;width:38%;">CHEF DE PROJET</th>
                <th style="border:1px solid #cc0000;padding:2px;width:38%;">HSE ENTREPRISE</th>
                <th style="border:1px solid #cc0000;padding:2px;width:24%;">DATE / HEURE</th>
            </tr>
            <tr>
                <td style="border:1px solid #cc0000;padding:3px 6px;height:38px;vertical-align:top;font-size:7.5px;">
                    <div style="font-size:6.5px;color:#555;">Nom et signature :</div>
                    <div style="font-weight:700;font-size:8px;">XIE XIAN</div>
                    <div style="margin-top:8px;font-size:7px;color:#777;">Signature : </div>
                </td>
                <td style="border:1px solid #cc0000;padding:3px 6px;height:38px;vertical-align:top;font-size:7.5px;">
                    <div style="font-size:6.5px;color:#555;">Nom et signature :</div>
                    <div style="font-weight:700;font-size:8px;">Nouri Chahrour</div>
                    <div style="margin-top:8px;font-size:7px;color:#777;">Signature : </div>
                </td>
                <td style="border:1px solid #cc0000;padding:3px 6px;height:38px;vertical-align:middle;font-size:7.5px;">
                    <div style="display:flex;gap:4px;align-items:center;margin-bottom:3px;">
                        <span>Date :</span>
                        <span style="border:1px solid #000;flex:1;padding:1px 3px;font-family:monospace;font-size:7.5px;">{date_today}</span>
                    </div>
                    <div style="display:flex;gap:4px;align-items:center;">
                        <span>Heure :</span>
                        <span style="border:1px solid #000;flex:1;padding:1px 3px;font-family:monospace;font-size:7.5px;">08h10</span>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- QR Footer -->
    <div class="footer-qr">
        <div class="footer-qr-text">
            <div style="font-weight:900;font-size:8.5px;text-transform:uppercase;letter-spacing:0.5px;">
                🛡️ VÉRIFICATION ÉLECTRONIQUE / DIGITAL WORK PERMIT QR VERIFICATION
            </div>
            <div style="font-size:7.5px;color:#334155;margin-top:1px;">
                Scannez ce QR Code pour vérifier en direct la validité journalière <strong>(Validé à 08h10 chaque matin)</strong>, les visas MOEX / W.P.E.E.X et les habilitations.
            </div>
            <div style="font-family:monospace;font-weight:800;font-size:8.5px;color:#1e3a8a;margin-top:1px;">
                PERMIS N° {permit_id} · SEMAINE 36 ({date_deb} AU {date_fin}) · STELLANTIS
            </div>
        </div>
        <img class="footer-qr-img" src="data:image/png;base64,{qr_base64}" alt="QR Code">
    </div>
</div>

<!-- ========================================================================= -->
<!-- PAGE 5 : ANNEXE C (AMBRE) — TRAVAIL ÉLECTRIQUE & CONSIGNATION (SEMAINE 36) -->
<!-- ========================================================================= -->
<div class="page border-amber" id="page-5">
    <div>
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #d97706;padding-bottom:3px;margin-bottom:3px;">
            <div style="display:flex;align-items:center;gap:8px;">
                <div style="background:#000;color:#fff;font-size:22px;font-weight:900;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:2px;">C</div>
                <div style="font-size:17px;font-weight:900;color:#000;letter-spacing:0.3px;">Travail électrique &amp; Consignation</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
                <div style="display:flex;align-items:center;gap:6px;">
                    <span style="background:#000;color:#fff;font-weight:900;font-size:13px;padding:2px 7px;border-radius:2px;letter-spacing:1px;">SINYLON</span>
                    <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:13px;padding:1px 7px;border-radius:2px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
                </div>
                <div style="border:1px solid #000;text-align:center;width:125px;">
                    <div style="font-size:7.5px;font-weight:700;border-bottom:1px solid #000;padding:1px 4px;background:#f8fafc;">Identifiant du permis</div>
                    <div style="font-size:12px;font-weight:900;padding:1px 4px;color:#000;">{permit_id}</div>
                </div>
            </div>
        </div>

        <div style="text-align:center;font-size:7.5px;font-weight:bold;margin-bottom:3px;color:#000;">
            Cette liste de verification doit etre toujours accompagnée par le permis de travail de sécurité générale
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:3px;font-size:7px;">
            <tbody>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 3px;width:34%;">Tirage de câbles / Chemins de câbles</td>
                    <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N</span></span></td>
                    <td style="border:1px solid #999;padding:1.5px 3px;width:52%;">Câbles hors tension et protégés mécaniquement</td>
                    <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 3px;">Raccordement armoire électrique BT</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N</span></span></td>
                    <td style="border:1px solid #999;padding:1.5px 3px;">Consignation LOTO effectuée et cadenas posés</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 3px;" rowspan="2">Intervention moteurs / variateurs</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;" rowspan="2"><span class="check-box-yn"><span class="checked">.Y</span><span>.N</span></span></td>
                    <td style="border:1px solid #999;padding:1.5px 3px;">Vérification d'Absence de Tension (VAT 0V certifiée)</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N</span></span></td>
                </tr>
                <tr>
                    <td style="border:1px solid #999;padding:1.5px 3px;">Port d'EPI isolants (Gants 1000V, écran anti-arc)</td>
                    <td style="border:1px solid #999;padding:1px;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N</span></span></td>
                </tr>
            </tbody>
        </table>

        <!-- LOTO -->
        <div style="border:1px solid #d97706;margin-bottom:3px;font-size:7px;">
            <div style="font-weight:bold;padding:2px 4px;background:#fef3c7;border-bottom:1px solid #d97706;display:flex;justify-content:space-between;">
                <span>Procédure de Consignation LOTO (Lockout / Tagout)</span>
                <span><span class="check-box-yn"><span class="checked">.Y</span><span>.N</span></span></span>
            </div>
            <table style="width:100%;border-collapse:collapse;">
                <tr>
                    <td style="border:1px solid #999;padding:2px 4px;width:40%;">Séparation de la source d'énergie (Sectionneur ouvert)</td>
                    <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N</span></span></td>
                    <td style="border:1px solid #999;padding:2px 4px;width:46%;">Condamnation mécanique par cadenas individuel</td>
                    <td style="border:1px solid #999;padding:1px;width:7%;text-align:center;"><span class="check-box-yn"><span class="checked">.Y</span><span>.N</span></span></td>
                </tr>
                <tr>
                    <td colspan="4" style="border:1px solid #999;padding:2px 4px;">
                        Chargé de Consignation Sinylon / MOEX : <strong>Nouri Chahrour / Xie Xian</strong> — N° Cadenas : LOTO-SINY-KW36
                    </td>
                </tr>
            </table>
        </div>

        <!-- SIGNATURES ANNEXE C SEMAINE 36 (02/09/2026) -->
        <table style="width:100%;border-collapse:collapse;margin-top:auto;border:1.5px solid #d97706;margin-bottom:2px;">
            <tr style="background:#fef3c7;font-size:7.5px;font-weight:900;text-align:center;">
                <th style="border:1px solid #d97706;padding:2px;width:38%;">CHEF DE PROJET</th>
                <th style="border:1px solid #d97706;padding:2px;width:38%;">HSE ENTREPRISE / CHARGÉ LOTO</th>
                <th style="border:1px solid #d97706;padding:2px;width:24%;">DATE / HEURE</th>
            </tr>
            <tr>
                <td style="border:1px solid #d97706;padding:3px 6px;height:38px;vertical-align:top;font-size:7.5px;">
                    <div style="font-size:6.5px;color:#555;">Nom et signature :</div>
                    <div style="font-weight:700;font-size:8px;">XIE XIAN</div>
                    <div style="margin-top:8px;font-size:7px;color:#777;">Signature : </div>
                </td>
                <td style="border:1px solid #d97706;padding:3px 6px;height:38px;vertical-align:top;font-size:7.5px;">
                    <div style="font-size:6.5px;color:#555;">Nom et signature :</div>
                    <div style="font-weight:700;font-size:8px;">Nouri Chahrour</div>
                    <div style="margin-top:8px;font-size:7px;color:#777;">Signature : </div>
                </td>
                <td style="border:1px solid #d97706;padding:3px 6px;height:38px;vertical-align:middle;font-size:7.5px;">
                    <div style="display:flex;gap:4px;align-items:center;margin-bottom:3px;">
                        <span>Date :</span>
                        <span style="border:1px solid #000;flex:1;padding:1px 3px;font-family:monospace;font-size:7.5px;">{date_today}</span>
                    </div>
                    <div style="display:flex;gap:4px;align-items:center;">
                        <span>Heure :</span>
                        <span style="border:1px solid #000;flex:1;padding:1px 3px;font-family:monospace;font-size:7.5px;">08h10</span>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- QR Footer -->
    <div class="footer-qr">
        <div class="footer-qr-text">
            <div style="font-weight:900;font-size:8.5px;text-transform:uppercase;letter-spacing:0.5px;">
                🛡️ VÉRIFICATION ÉLECTRONIQUE / DIGITAL WORK PERMIT QR VERIFICATION
            </div>
            <div style="font-size:7.5px;color:#334155;margin-top:1px;">
                Scannez ce QR Code pour vérifier en direct la validité journalière <strong>(Validé à 08h10 chaque matin)</strong>, les visas MOEX / W.P.E.E.X et les habilitations.
            </div>
            <div style="font-family:monospace;font-weight:800;font-size:8.5px;color:#1e3a8a;margin-top:1px;">
                PERMIS N° {permit_id} · SEMAINE 36 ({date_deb} AU {date_fin}) · STELLANTIS
            </div>
        </div>
        <img class="footer-qr-img" src="data:image/png;base64,{qr_base64}" alt="QR Code">
    </div>
</div>

<!-- ========================================================================= -->
<!-- PAGE 6 : GRANDE AFFICHE A4 QR CODE — SEMAINE 36 (02/09/2026)              -->
<!-- ========================================================================= -->
<div class="page" id="page-6" style="border:4px solid #000;padding:10mm 12mm;">
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #000;padding-bottom:10px;">
        <div style="display:flex;align-items:center;gap:10px;">
            <span style="background:#000;color:#fff;font-weight:900;font-size:22px;padding:5px 14px;border-radius:4px;letter-spacing:1px;">SINYLON</span>
            <span style="border:2.5px solid #000;color:#000;font-weight:900;font-size:22px;padding:4px 14px;border-radius:4px;letter-spacing:1px;background:#fff;">STELLANTIS</span>
        </div>
        <div style="text-align:right;">
            <div style="font-size:11px;font-weight:bold;color:#475569;">PROJET ALGERIA K9 CKD0 — SEMAINE 36</div>
            <div style="font-size:18px;font-weight:900;color:#1e3a8a;">{permit_id}</div>
        </div>
    </div>

    <div style="text-align:center;margin:15px 0;">
        <div style="font-size:26px;font-weight:900;letter-spacing:1px;text-transform:uppercase;">
            PERMIS GÉNÉRAL DE TRAVAIL
        </div>
        <div style="font-size:13px;font-weight:bold;color:#475569;margin-top:2px;">
            CONTRÔLE ÉLECTRONIQUE ET AUDIT HSE INSTANTANÉ SUR SITE
        </div>
        <div style="background:#15803d;color:#fff;font-weight:900;font-size:14px;padding:6px 20px;border-radius:20px;display:inline-block;margin-top:10px;">
            🟢 PERMIS VALIDE &amp; REVALIDÉ À 08H10 (MERCREDI 02/09/2026)
        </div>
    </div>

    <div style="text-align:center;margin:10px 0;">
        <div style="display:inline-block;padding:12px;background:#fff;border:3px solid #000;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,0.15);">
            <img src="data:image/png;base64,{qr_base64}" style="width:200px;height:200px;display:block;" alt="QR Code Affiche">
        </div>
        <div style="font-size:12px;font-weight:800;color:#1e3a8a;margin-top:8px;">
            📱 SCANNEZ AVEC UN SMARTPHONE OU TABLETTE
        </div>
        <div style="font-size:10px;color:#64748b;font-family:monospace;margin-top:2px;">
            {qr_url}
        </div>
    </div>

    <div style="border:2px solid #000;border-radius:8px;padding:12px;background:#f8fafc;margin:10px 0;">
        <div style="font-size:13px;font-weight:900;color:#0f172a;border-bottom:1.5px solid #cbd5e1;padding-bottom:6px;margin-bottom:8px;display:flex;justify-content:space-between;">
            <span>📋 INFORMATIONS DU POSTE DE TRAVAIL — SEMAINE 36</span>
            <span style="color:#15803d;">DATE DU JOUR : 02/09/2026</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;">
            <div>🏢 <strong>Entreprise :</strong> SINYLON</div>
            <div>🏛️ <strong>Client :</strong> STELLANTIS ALGERIA</div>
            <div>📍 <strong>Zone(s) :</strong> FUSA / UAR / UB</div>
            <div>👨‍💼 <strong>Chef de Projet :</strong> Xie Xian</div>
            <div>🛡️ <strong>Superviseur HSE :</strong> Nouri Chahrour (0563765157)</div>
            <div>⏰ <strong>Horaires :</strong> 08h00 - 17h30</div>
            <div>📅 <strong>Période :</strong> Du {date_deb} Au {date_fin}</div>
            <div>✅ <strong>Contrôle Matinal :</strong> 08h10 chaque matin</div>
        </div>
    </div>

    <div style="text-align:center;font-size:9.5px;color:#475569;border-top:1.5px solid #000;padding-top:8px;margin-top:auto;">
        Permis obligatoire affiché sur le lieu de travail · Vérification quotidienne effectuée à 08h10 par l'Ingénieur de Suivi W.P.E.E.X et le Superviseur HSE Sinylon.
    </div>
</div>

</body>
</html>
"""

# Sauvegarde des fichiers dans le dossier dédié sur le Bureau
permis_folder = os.path.expanduser("~/Desktop/PERMIS_SINYLON_SEMAINE_36")
os.makedirs(permis_folder, exist_ok=True)

desktop_html_path = os.path.join(permis_folder, "DOSSIER_PERMIS_SINYLON_A4_OFFICIEL.html")
with open(desktop_html_path, "w", encoding="utf-8") as f:
    f.write(html_content)
print(f"Succès : HTML sauvegardé dans le dossier Bureau -> {desktop_html_path}")

# Génération du PDF avec ReportLab
desktop_pdf_path = os.path.join(permis_folder, "DOSSIER_PERMIS_SINYLON_A4_OFFICIEL.pdf")
doc = SimpleDocTemplate(
    desktop_pdf_path,
    pagesize=A4,
    leftMargin=15,
    rightMargin=15,
    topMargin=15,
    bottomMargin=15
)
styles = getSampleStyleSheet()
story = []

def get_header_table(annexe_letter, annexe_title, border_color):
    p_letter = Paragraph(f"<font color='white'><b>{annexe_letter}</b></font>", ParagraphStyle('HLet', fontName='Helvetica-Bold', fontSize=18, leading=20, alignment=1))
    p_title = Paragraph(f"<b>{annexe_title}</b>", ParagraphStyle('HTitle', fontName='Helvetica-Bold', fontSize=12, leading=15, textColor=border_color))
    p_brand = Paragraph("<b>SINYLON</b><br/><b>STELLANTIS</b>", ParagraphStyle('HBrand', fontName='Helvetica-Bold', fontSize=9, leading=11, alignment=1, textColor=colors.black))
    p_id = Paragraph(f"<font size=7 color='#475569'>Identifiant du permis</font><br/><b><font size=10 color='black'>{permit_id}</font></b>", ParagraphStyle('HId', fontName='Helvetica', alignment=1, leading=11))
    
    t_data = [
        [p_letter, p_title, p_brand, p_id]
    ]
    t = Table(t_data, colWidths=[28, 290, 105, 142])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.black),
        ('ALIGN', (0,0), (0,0), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (3,0), (3,0), 1, colors.black),
        ('BACKGROUND', (3,0), (3,0), colors.HexColor('#f8fafc')),
        ('LINEBELOW', (0,0), (-1,-1), 1.5, border_color),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    return t

# Page 1
p1_title = Paragraph(f"<b>PERMIS DE TRAVAIL DE SECURITÉ GÉNÉRALE — SEMAINE 36 ({date_today})</b>", ParagraphStyle('P1', fontName='Helvetica-Bold', fontSize=12, alignment=1))
story.append(p1_title)
story.append(Spacer(1, 6))

info_data = [
    [f"Date du permis : {date_today}", f"Période : Du {date_deb} Au {date_fin}", "Horaires : 08h00 → 17h30 (Validé 08h10)"],
    ["Entreprise : SINYLON", "Secteur : Atelier Montage Stellantis", "Zones : FUSA / UAR / UB"],
    ["Chef de Projet : Xie Xian", "HSE Sinylon : Nouri Chahrour (0563765157)", f"Permis N° : {permit_id}"]
]
t_info = Table(info_data, colWidths=[185, 200, 180])
t_info.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 1, colors.black),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 8),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(t_info)
story.append(Spacer(1, 6))

desc_p = Paragraph(f"<b>Brève description du travail (Semaine 36) :</b> {work_desc}<br/><i>{work_desc_en}</i>", styles['Normal'])
story.append(desc_p)
story.append(Spacer(1, 8))

danger_data = [
    ["Travail en hauteur (Annexe A)", "[.Y.] A", "Travail à chaud (Annexe B)", "[.Y.] B"],
    ["Travail Électrique & Consignation (Annexe C)", "[.Y.] C", "Espace confiné", "[ N ] D"],
    ["Excavation / Fouille", "[ N ] E", "Tension ou rupture de conduite", "[ N ] F"],
]
t_dang = Table(danger_data, colWidths=[200, 75, 215, 75])
t_dang.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 1, colors.black),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 7.5),
    ('ALIGN', (1,0), (1,-1), 'CENTER'),
    ('ALIGN', (3,0), (3,-1), 'CENTER'),
]))
story.append(t_dang)
story.append(Spacer(1, 10))

sig_header = Paragraph("<b>VALIDITÉ DU PERMIS ET SIGNATURES INITIALES (08H10)</b> — <i>Émargement manuscrit au stylo / tampon</i>", ParagraphStyle('SH', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.HexColor('#1e3a8a')))
story.append(sig_header)
story.append(Spacer(1, 4))

sig_data = [
    ["Chef de Projet Entreprise", "MOEX - Ingénieur Suivi", "Coordinateur HSE Sinylon", "Receveur du permis"],
    ["Nom : Xie Xian", "Nom : M. W.P.E.E.X", "Nom : Nouri Chahrour", "Nom : Zhou Lin"],
    ["\n\nSignature :", "\n\nSignature :", "\n\nSignature :", "\n\nSignature :"]
]
t_sig = Table(sig_data, colWidths=[140, 145, 140, 140])
t_sig.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 1, colors.black),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#bfdbfe')),
    ('FONTNAME', (0,0), (-1,1), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 7.5),
    ('ALIGN', (0,0), (-1,0), 'CENTER'),
    ('BOTTOMPADDING', (0,2), (-1,2), 16),
]))
story.append(t_sig)
story.append(Spacer(1, 10))

qr_temp = "/tmp/qr_w36_temp.png"
img.save(qr_temp)

p_footer_text = Paragraph(
    f"<b>🛡️ VÉRIFICATION ÉLECTRONIQUE / DIGITAL QR VERIFICATION</b><br/>"
    f"Scannez ce QR Code pour vérifier en direct la validité journalière <b>(Validé à 08h10 chaque matin)</b>.<br/>"
    f"<b>PERMIS N° {permit_id} · SEMAINE 36 ({date_deb} AU {date_fin}) · DATE: {date_today} · REVALIDÉ À: 08h10</b>",
    ParagraphStyle('PFoot', fontName='Helvetica', fontSize=7.5, leading=10, textColor=colors.black)
)
footer_data = [
    [p_footer_text, RLImage(qr_temp, width=42, height=42)]
]
t_foot = Table(footer_data, colWidths=[510, 55])
t_foot.setStyle(TableStyle([
    ('BOX', (0,0), (-1,-1), 1.5, colors.black),
    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('ALIGN', (1,0), (1,0), 'CENTER'),
    ('LEFTPADDING', (0,0), (0,0), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
]))
story.append(t_foot)

# Page 2 : Revalidation Quotidienne
story.append(PageBreak())
story.append(Paragraph(f"<b>REVALIDATION QUOTIDIENNE DU PERMIS — SEMAINE 36 ({date_deb} AU {date_fin})</b>", ParagraphStyle('P2T', fontName='Helvetica-Bold', fontSize=12, alignment=1)))
story.append(Spacer(1, 6))

reval_data = [
    ["JOUR", "DATE", "W.P.E.E.X (Ingénieur)", "VISA W.P.E.E.X (08h10)", "SINYLON (Responsable)", "SIGNATURE (08h10)", "STATUT"],
    ["Jour 1 (Lundi)", "2026-08-31", "M. W.P.E.E.X", "", "Xie Xian", "", "Validé 08h10"],
    ["Jour 2 (Mardi)", "2026-09-01", "M. W.P.E.E.X", "", "Xie Xian", "", "Validé 08h10"],
    ["Jour 3 (Mercredi)", "2026-09-02", "M. W.P.E.E.X", "", "Xie Xian", "", "À signer 08h10"],
    ["Jour 4 (Jeudi)", "2026-09-03", "M. W.P.E.E.X", "", "Xie Xian", "", "À signer 08h10"],
    ["Jour 5 (Vendredi)", "2026-09-04", "M. W.P.E.E.X", "", "Xie Xian", "", "À signer 08h10"],
    ["Jour 6 (Samedi)", "2026-09-05", "M. W.P.E.E.X", "", "Xie Xian", "", "À signer 08h10"],
    ["Jour 7 (Dimanche)", "2026-09-06", "M. W.P.E.E.X", "", "Xie Xian", "", "À signer 08h10"]
]
t_rev = Table(reval_data, colWidths=[80, 65, 95, 105, 95, 105, 55])
t_rev.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 1, colors.black),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
    ('BACKGROUND', (0,3), (-1,3), colors.HexColor('#fef08a')),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 7.5),
    ('ALIGN', (0,0), (1,-1), 'CENTER'),
    ('ALIGN', (6,0), (6,-1), 'CENTER'),
    ('TEXTCOLOR', (6,1), (6,-1), colors.HexColor('#15803d')),
    ('BOTTOMPADDING', (0,1), (-1,-1), 8),
]))
story.append(t_rev)
story.append(Spacer(1, 15))

caisse_data = [
    ["JOUR", "DATE", "SUPERVISEUR W.P.E.E.X", "CONTRÔLE SÉCURITÉ (08H10)", "VISA CAISSE STELLANTIS"],
    ["Vendredi", "2026-09-04", "M. W.P.E.E.X", "Vérification 360°, Nacelles, Extincteurs, Balisage", ""],
    ["Samedi", "2026-09-05", "M. W.P.E.E.X", "Vérification 360°, Nacelles, Extincteurs, Balisage", ""]
]
t_caisse = Table(caisse_data, colWidths=[65, 65, 120, 200, 115])
t_caisse.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 1, colors.black),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 7.5),
    ('ALIGN', (0,0), (1,-1), 'CENTER'),
    ('BOTTOMPADDING', (0,1), (-1,-1), 12),
]))
story.append(t_caisse)
story.append(Spacer(1, 20))
story.append(t_foot)

# Page 3 : Annexe A
story.append(PageBreak())
story.append(get_header_table("A", "Travail en hauteur (Annexe A)", colors.HexColor('#004080')))
story.append(Spacer(1, 4))
story.append(Paragraph("<i>Cette liste de verification doit etre toujours accompagnée par le permis de travail de sécurité générale</i>", ParagraphStyle('Asub', fontName='Helvetica-Bold', fontSize=7.5, alignment=1)))
story.append(Spacer(1, 6))

hauteur_rows = [
    ["Équipements déclarés (Semaine 36)", "Y/N", "Vérification requise", "Y/N"],
    ["Echaffaudage fixe / mobile", "[.Y .N]", "approuvé et cacheté par le personnel qua", "[.Y .N]"],
    ["Elevateur de plateforme mobile (6 nacelles + manlift)", "[.Y.]", "L'opérateur et le travailleur entrainés\nOrder to use given in written\nPort d'équipement d'arret de chute", "[.Y.]\n[.Y.]\n[.Y.]"],
    ["Echelle", "[ Y N ]", "activités court terme — verifier et cacheter", "[ Y N ]"],
    ["Equipement d'arret de chute requis ?", "[.Y.]", "Verfiyer avant de commencer le travail — Attachements définis", "[.Y.]\n[.Y.]"],
    ["Balisage et directives de sécurité", "[.Y.]", "Endroit barré véhicules/traffic — Issue de secours dégagée", "[.Y.]\n[.Y.]"],
    ["Conditions ambiantes (Visibilité, pluie, vent)", "[ OK ]", "Visibilité claire, aucune pluie, surface sèche, vent faible", "[.Y.]"]
]
t_haut = Table(hauteur_rows, colWidths=[185, 45, 290, 45])
t_haut.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#004080')),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#dbeafe')),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 7),
    ('ALIGN', (1,0), (1,-1), 'CENTER'),
    ('ALIGN', (3,0), (3,-1), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(t_haut)
story.append(Spacer(1, 15))

sig_a_data = [
    ["CHEF DE PROJET : Xie Xian", "HSE ENTREPRISE : Nouri Chahrour", "DATE / HEURE"],
    ["\n\nSignature :", "\n\nSignature :", f"Date : {date_today}\nHeure : 08h10"]
]
t_sig_a = Table(sig_a_data, colWidths=[200, 200, 165])
t_sig_a.setStyle(TableStyle([
    ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#004080')),
    ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#004080')),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#dbeafe')),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 7.5),
    ('BOTTOMPADDING', (0,1), (1,1), 15),
]))
story.append(t_sig_a)
story.append(Spacer(1, 15))
story.append(t_foot)

# Page 4 : Annexe B
story.append(PageBreak())
story.append(get_header_table("B", "Travail chaud (Annexe B)", colors.HexColor('#cc0000')))
story.append(Spacer(1, 4))
story.append(Paragraph("<i>La liste de vérification doit être toujours accompagnée par le permis de travail de sécurité générale</i>", ParagraphStyle('Bsub', fontName='Helvetica-Bold', fontSize=7.5, alignment=1)))
story.append(Spacer(1, 6))

chaud_rows = [
    ["Points de Contrôle Prévention Incendie (Semaine 36)", "Y/N"],
    ["Tous les produits inflamable ou combustible seront déga 10 m (min. 10 m)", "[.Y.]"],
    ["Si déplacement impossible : produits protégés par bâches ignifugées", "[.Y.]"],
    ["Tous debris, saleté, ou poussière est enlevé — environnement de travail vérifié", "[.Y.]"],
    ["Couvertures resistantes au feu/écran equipé à resister aux eteincelles", "[.Y.]"],
    ["Ventillation suffisante sur le lieu de travail (naturel [Y] technique [Y])", "[.Y.]"],
    ["Apareils électrique et cables protégés / matériel de voisinnage protégé", "[.Y.]"],
    ["Extincteurs présents : Water [Y] Poudre [Y] CO2 [Y] — Bâches anti-feu déployées", "[.Y.]"],
    ["Surveillant d'incendie présent durant le travail et 30 minutes après son achèvement", "[.Y.]"],
    ["Alarme incendie la plus proche : BLOC SÉCURITÉ (Tel HSE : 0563765157)", "[ OK ]"]
]
t_chaud = Table(chaud_rows, colWidths=[505, 60])
t_chaud.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#cc0000')),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#fee2e2')),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 7),
    ('ALIGN', (1,0), (1,-1), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(t_chaud)
story.append(Spacer(1, 15))

sig_b_data = [
    ["CHEF DE PROJET : Xie Xian", "HSE ENTREPRISE : Nouri Chahrour", "DATE / HEURE"],
    ["\n\nSignature :", "\n\nSignature :", f"Date : {date_today}\nHeure : 08h10"]
]
t_sig_b = Table(sig_b_data, colWidths=[200, 200, 165])
t_sig_b.setStyle(TableStyle([
    ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#cc0000')),
    ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#cc0000')),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#fee2e2')),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 7.5),
    ('BOTTOMPADDING', (0,1), (1,1), 15),
]))
story.append(t_sig_b)
story.append(Spacer(1, 15))
story.append(t_foot)

# Page 5 : Annexe C
story.append(PageBreak())
story.append(get_header_table("C", "Travail électrique & Consignation (Annexe C)", colors.HexColor('#d97706')))
story.append(Spacer(1, 4))
story.append(Paragraph("<i>Cette liste de verification doit etre toujours accompagnée par le permis de travail de sécurité générale</i>", ParagraphStyle('Csub', fontName='Helvetica-Bold', fontSize=7.5, alignment=1)))
story.append(Spacer(1, 6))

elec_rows = [
    ["Protocole de Sécurité Électrique & LOTO Lockout (Semaine 36)", "Y/N"],
    ["Tirage de câbles / Chemins de câbles — Câbles hors tension et protégés", "[.Y.]"],
    ["Raccordement armoire électrique BT — Consignation LOTO effectuée et cadenas posés", "[.Y.]"],
    ["Intervention moteurs / variateurs — Vérification d'Absence de Tension (VAT 0V certifiée)", "[.Y.]"],
    ["Habilitations électriques des intervenants vérifiées (B2V / BR / BC / H1V)", "[.Y.]"],
    ["Port des EPI isolants obligatoires (Gants 1000V, écran facial arc-flash)", "[.Y.]"],
    ["Chargé de consignation Sinylon / MOEX : Nouri Chahrour / Xie Xian (LOTO-SINY-KW36)", "[ OK ]"],
    ["Extincteur CO2 dédié feu électrique présent à proximité immédiate", "[.Y.]"]
]
t_elec = Table(elec_rows, colWidths=[505, 60])
t_elec.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#d97706')),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#fef3c7')),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 7),
    ('ALIGN', (1,0), (1,-1), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(t_elec)
story.append(Spacer(1, 15))

sig_c_data = [
    ["CHEF DE PROJET : Xie Xian", "HSE ENTREPRISE / CHARGÉ LOTO", "DATE / HEURE"],
    ["\n\nSignature :", "Nom : Nouri Chahrour\n\nSignature :", f"Date : {date_today}\nHeure : 08h10"]
]
t_sig_c = Table(sig_c_data, colWidths=[200, 200, 165])
t_sig_c.setStyle(TableStyle([
    ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#d97706')),
    ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#d97706')),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#fef3c7')),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 7.5),
    ('BOTTOMPADDING', (0,1), (1,1), 15),
]))
story.append(t_sig_c)
story.append(Spacer(1, 15))
story.append(t_foot)

# Page 6 : Affiche QR Semaine 36
story.append(PageBreak())
story.append(Paragraph("<b>PERMIS GÉNÉRAL DE TRAVAIL — SEMAINE 36</b>", ParagraphStyle('QRT1', fontName='Helvetica-Bold', fontSize=22, leading=26, alignment=1)))
story.append(Spacer(1, 4))
story.append(Paragraph("<b>STELLANTIS ALGERIA K9 CKD0 — SINYLON</b>", ParagraphStyle('QRT2', fontName='Helvetica-Bold', fontSize=13, leading=16, alignment=1, textColor=colors.HexColor('#1e3a8a'))))
story.append(Spacer(1, 6))
story.append(Paragraph(f"<b>🟢 PERMIS VALIDE & REVALIDÉ — DATE : {date_today} | HEURE : 08H10</b>", ParagraphStyle('QRT3', fontName='Helvetica-Bold', fontSize=12, leading=15, alignment=1, textColor=colors.HexColor('#15803d'))))
story.append(Spacer(1, 14))

story.append(RLImage(qr_temp, width=220, height=220))
story.append(Spacer(1, 10))
story.append(Paragraph("<b>📱 SCANNEZ CE QR CODE AVEC UN SMARTPHONE OU TABLETTE</b>", ParagraphStyle('QRT4', fontName='Helvetica-Bold', fontSize=12, leading=15, alignment=1)))
story.append(Paragraph(f"<i>{qr_url}</i>", ParagraphStyle('QRT5', fontName='Helvetica', fontSize=9, leading=12, alignment=1, textColor=colors.HexColor('#475569'))))
story.append(Spacer(1, 14))

p_box_left = Paragraph(
    f"<b>Permis N° :</b> {permit_id}<br/>"
    f"<b>Entreprise :</b> SINYLON<br/>"
    f"<b>Zones Autorisées :</b> FUSA / UAR / UB<br/>"
    f"<b>Période Semaine 36 :</b> Du {date_deb} Au {date_fin}",
    ParagraphStyle('PBoxL', fontName='Helvetica', fontSize=8.5, leading=13)
)
p_box_right = Paragraph(
    f"<b>📅 DATE DU JOUR :</b> {date_today}<br/>"
    f"<b>⏰ HEURE DE VALIDATION :</b> <font color='#15803d'><b>08H10</b></font><br/>"
    f"<b>🛡️ REVALIDATION :</b> Validé & Pointé à 08h10 chaque matin<br/>"
    f"<b>Superviseur HSE :</b> Nouri Chahrour (0563765157)<br/>"
    f"<b>Chef de Projet :</b> Xie Xian",
    ParagraphStyle('PBoxR', fontName='Helvetica', fontSize=8.5, leading=13)
)

poster_box = [
    ["INFORMATIONS DU CHANTIER — SEMAINE 36", "HORODATAGE HSE CERTIFIÉ (DATE & HEURE)"],
    [p_box_left, p_box_right]
]
t_pbox = Table(poster_box, colWidths=[275, 285])
t_pbox.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 1.5, colors.black),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,0), 8.5),
    ('ALIGN', (0,0), (-1,0), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,1), (-1,-1), 6),
    ('BOTTOMPADDING', (0,1), (-1,-1), 6),
    ('LEFTPADDING', (0,1), (-1,-1), 8),
    ('RIGHTPADDING', (0,1), (-1,-1), 8),
]))
story.append(t_pbox)

doc.build(story)
print(f"Succès : PDF généré sur le Bureau -> {desktop_pdf_path}")

# Mise à jour de l'affiche séparée QR Code A4
poster_html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>AFFICHE A4 QR CODE PERMIS SINYLON - SEMAINE 36 ({date_today})</title>
<style>
@page {{ size: A4 portrait; margin: 0; }}
body {{ margin: 0; padding: 0; font-family: Arial, sans-serif; background: #f1f5f9; }}
.poster-page {{
    width: 210mm; height: 297mm; margin: 0 auto; padding: 12mm 15mm;
    background: #fff; border: 5px solid #000; display: flex; flex-direction: column;
    justify-content: space-between; box-sizing: border-box;
}}
@media print {{ body {{ background: #fff; }} .no-print {{ display: none !important; }} }}
</style>
</head>
<body>
<div class="no-print" style="background:#1e293b;color:#fff;padding:10px;text-align:center;">
    <button onclick="window.print()" style="background:#2563eb;color:#fff;border:none;padding:10px 20px;font-size:15px;font-weight:bold;border-radius:6px;cursor:pointer;">
        🖨️ IMPRIMER L'AFFICHE QR CODE A4 (SEMAINE 36)
    </button>
</div>
<div class="poster-page">
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3.5px solid #000;padding-bottom:12px;">
        <div style="display:flex;align-items:center;gap:12px;">
            <span style="background:#000;color:#fff;font-weight:900;font-size:24px;padding:5px 14px;border-radius:4px;letter-spacing:1px;">SINYLON</span>
            <span style="border:2.5px solid #000;color:#000;font-weight:900;font-size:24px;padding:4px 14px;border-radius:4px;letter-spacing:1px;background:#fff;">STELLANTIS</span>
        </div>
        <div style="text-align:right;">
            <div style="font-size:12px;font-weight:bold;color:#475569;">PROJET ALGERIA K9 CKD0 — SEMAINE 36</div>
            <div style="font-size:22px;font-weight:900;color:#1e3a8a;">{permit_id}</div>
        </div>
    </div>
    <div style="text-align:center;margin:20px 0 10px 0;">
        <div style="font-size:30px;font-weight:900;letter-spacing:1px;text-transform:uppercase;">
            PERMIS GÉNÉRAL DE TRAVAIL
        </div>
        <div style="font-size:14px;font-weight:bold;color:#475569;margin-top:4px;">
            VÉRIFICATION &amp; CONTRÔLE SÉCURITÉ EN TEMPS RÉEL SUR SITE
        </div>
        <div style="background:#15803d;color:#fff;font-weight:900;font-size:16px;padding:8px 24px;border-radius:24px;display:inline-block;margin-top:14px;">
            🟢 PERMIS VALIDE &amp; REVALIDÉ — DATE : {date_today} | HEURE : 08H10
        </div>
    </div>
    <div style="text-align:center;margin:15px 0;">
        <div style="display:inline-block;padding:16px;background:#fff;border:3.5px solid #000;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,0.18);">
            <img src="data:image/png;base64,{qr_base64}" style="width:230px;height:230px;display:block;" alt="QR Code Affiche">
        </div>
        <div style="font-size:14px;font-weight:800;color:#1e3a8a;margin-top:10px;">
            📱 SCANNEZ AVEC VOTRE SMARTPHONE OU TABLETTE
        </div>
        <div style="font-size:11px;color:#64748b;font-family:monospace;margin-top:3px;">
            {qr_url}
        </div>
    </div>
    <div style="border:2.5px solid #000;border-radius:8px;padding:14px;background:#f8fafc;margin:10px 0;">
        <div style="font-size:14px;font-weight:900;color:#0f172a;border-bottom:2px solid #cbd5e1;padding-bottom:6px;margin-bottom:10px;display:flex;justify-content:space-between;">
            <span>📋 INFORMATIONS ET VALIDITÉ DU PERMIS — SEMAINE 36</span>
            <span style="color:#15803d;font-weight:900;">📅 DATE : {date_today} &nbsp;|&nbsp; ⏰ HEURE : 08H10</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px;">
            <div>🏢 <strong>Entreprise Intervenante :</strong> SINYLON</div>
            <div>🏛️ <strong>Donneur d'Ordre :</strong> STELLANTIS ALGERIA</div>
            <div>📍 <strong>Zones Autorisées :</strong> FUSA / UAR / UB</div>
            <div>👨‍💼 <strong>Chef de Projet :</strong> Xie Xian</div>
            <div>🛡️ <strong>Superviseur HSE :</strong> Nouri Chahrour (0563765157)</div>
            <div>⏰ <strong>Heure de Validation :</strong> <strong style="color:#15803d;">08h10</strong> (Chantier 08h00 - 17h30)</div>
            <div>📅 <strong>Période Active :</strong> Du {date_deb} Au {date_fin}</div>
            <div>✅ <strong>Statut :</strong> <strong style="color:#15803d;">Validé &amp; Pointé à 08h10</strong></div>
        </div>
    </div>
    <div style="text-align:center;font-size:10.5px;color:#475569;border-top:2px solid #000;padding-top:10px;">
        Permis officiel affiché obligatoirement à l'entrée de la zone de travail.<br>
        Revalidation physique effectuée sur le document papier à <strong>08h10 chaque matin</strong> par l'Ingénieur de Suivi W.P.E.E.X et le Responsable HSE Sinylon.
    </div>
</div>
</body>
</html>
"""

poster_html_path = os.path.join(permis_folder, "AFFICHE_A4_QR_CODE_PERMIS_SINYLON.html")
with open(poster_html_path, "w", encoding="utf-8") as f:
    f.write(poster_html)

poster_pdf_path = os.path.join(permis_folder, "AFFICHE_A4_QR_CODE_PERMIS_SINYLON.pdf")
doc_poster = SimpleDocTemplate(
    poster_pdf_path,
    pagesize=A4,
    leftMargin=20,
    rightMargin=20,
    topMargin=20,
    bottomMargin=20
)
story_p = []
story_p.append(Paragraph("<b>PERMIS GÉNÉRAL DE TRAVAIL — SEMAINE 36</b>", ParagraphStyle('PT1', fontName='Helvetica-Bold', fontSize=24, leading=28, alignment=1)))
story_p.append(Spacer(1, 6))
story_p.append(Paragraph("<b>STELLANTIS ALGERIA K9 CKD0 — SINYLON</b>", ParagraphStyle('PT2', fontName='Helvetica-Bold', fontSize=14, leading=18, alignment=1, textColor=colors.HexColor('#1e3a8a'))))
story_p.append(Spacer(1, 8))
story_p.append(Paragraph(f"<b>🟢 PERMIS VALIDE & REVALIDÉ — DATE : {date_today} | HEURE : 08H10</b>", ParagraphStyle('PT3', fontName='Helvetica-Bold', fontSize=13, leading=16, alignment=1, textColor=colors.HexColor('#15803d'))))
story_p.append(Spacer(1, 16))
story_p.append(RLImage(qr_temp, width=240, height=240))
story_p.append(Spacer(1, 12))
story_p.append(Paragraph("<b>📱 SCANNEZ CE QR CODE AVEC UN SMARTPHONE OU TABLETTE</b>", ParagraphStyle('PT4', fontName='Helvetica-Bold', fontSize=13, leading=16, alignment=1)))
story_p.append(Paragraph(f"<i>{qr_url}</i>", ParagraphStyle('PT5', fontName='Helvetica', fontSize=9, leading=12, alignment=1, textColor=colors.HexColor('#475569'))))
story_p.append(Spacer(1, 16))

p_box_l = Paragraph(
    f"<b>Permis N° :</b> {permit_id}<br/>"
    f"<b>Entreprise :</b> SINYLON<br/>"
    f"<b>Zones Autorisées :</b> FUSA / UAR / UB<br/>"
    f"<b>Période Semaine 36 :</b> Du {date_deb} Au {date_fin}",
    ParagraphStyle('PTBoxL', fontName='Helvetica', fontSize=9, leading=14)
)
p_box_r = Paragraph(
    f"<b>📅 DATE DU JOUR :</b> {date_today}<br/>"
    f"<b>⏰ HEURE DE VALIDATION :</b> <font color='#15803d'><b>08H10</b></font><br/>"
    f"<b>🛡️ REVALIDATION :</b> Validé & Pointé à 08h10 chaque matin<br/>"
    f"<b>Superviseur HSE :</b> Nouri Chahrour (0563765157)<br/>"
    f"<b>Chef de Projet :</b> Xie Xian",
    ParagraphStyle('PTBoxR', fontName='Helvetica', fontSize=9, leading=14)
)

p_box = [
    ["INFORMATIONS DU CHANTIER — SEMAINE 36", "HORODATAGE HSE CERTIFIÉ (DATE & HEURE)"],
    [p_box_l, p_box_r]
]
t_box = Table(p_box, colWidths=[275, 275])
t_box.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 1.5, colors.black),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,0), 9),
    ('ALIGN', (0,0), (-1,0), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,1), (-1,-1), 6),
    ('BOTTOMPADDING', (0,1), (-1,-1), 6),
    ('LEFTPADDING', (0,1), (-1,-1), 8),
    ('RIGHTPADDING', (0,1), (-1,-1), 8),
]))
story_p.append(t_box)
doc_poster.build(story_p)
print(f"Succès : Affiche PDF sauvegardée sur le Bureau -> {poster_pdf_path}")
