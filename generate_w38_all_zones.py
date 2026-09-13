#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Générateur Complet Semaine 38 (14/09/2026 au 20/09/2026)
Génération des Hard Papers Officiels (5 Pages A4) et des Affiches A4 QR Code pour :
1. Zone UB   : K9-W38-UB   (Underbody / Soubassement Central)
2. Zone UAR  : K9-W38-UAR  (Underbody Rear / Soubassement Arrière)
3. Zone FUSA : K9-W38-FUSA (Front Underbody Sub-Assembly / Soubassement Avant)
4. Zone WE   : K9-W38-WE   (Caisse Week-end Vendredi 18 & Samedi 19 / LOTO / Coupure de courant)
Destination : /Users/nourine/Desktop/PERMIS_SINYLON_SEMAINE_38
"""

import os
import io
import base64
import qrcode
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

desktop_folder = "/Users/nourine/Desktop/PERMIS_SINYLON_SEMAINE_38"
os.makedirs(desktop_folder, exist_ok=True)

ZONES_CONFIG = [
    {
        "permit_id": "K9-W38-UB",
        "zone_code": "UB",
        "zone_title": "ZONE UB — UNDERBODY (SOUBASSEMENT CENTRAL)",
        "zone_title_zh": "UB 区域 (中底盘工位)",
        "ouvrage": "Atelier Montage Stellantis K9 — Ligne UB",
        "secteur": "Bâtiment Assemblage — Secteur Soubassement Central (UB)",
        "is_weekend": False,
        "date_deb": "2026-09-14",
        "date_fin": "2026-09-20",
        "horaires": "08h00 - 17h30 (Chantier Actif)",
        "work_desc_fr": "Essais de sécurité, tests de conformité et certification; Vérification de conformité de l'installation FEE/REE; Jalon Industriel X0 et conformité ligne.",
        "work_desc_en": "Safety certification and compliance validation tests; FEE/REE installation compliance checklist verification; Industrial Milestone X0 and line buyoff.",
        "work_desc_zh": "安全认证及综合测试; FEE/REE安装检查清单验证; 工业化里程碑 X0",
        "equipements": "Nacelles ciseaux électriques (x2), Lignes de vie, Harnais doubles longes, Clés dynamométriques, Échafaudages roulants",
        "tasks": [
            "Essais de sécurité, tests de conformité et certification",
            "Vérification de conformité de l'installation FEE/REE",
            "Jalon Industriel X0 et conformité ligne d'assemblage"
        ],
        "badge_color": "#2563eb",
        "color_name": "Bleu Royal",
        "dangers": {"height": True, "hot": False, "electric": False, "lifting": True}
    },
    {
        "permit_id": "K9-W38-UAR",
        "zone_code": "UAR",
        "zone_title": "ZONE UAR — UNDERBODY REAR (SOUBASSEMENT ARRIÈRE)",
        "zone_title_zh": "UAR 区域 (后底盘工位)",
        "ouvrage": "Atelier Montage Stellantis K9 — Ligne UAR",
        "secteur": "Bâtiment Assemblage — Secteur Soubassement Arrière (UAR)",
        "is_weekend": False,
        "date_deb": "2026-09-14",
        "date_fin": "2026-09-20",
        "horaires": "08h00 - 17h30 (Chantier Actif)",
        "work_desc_fr": "Installation et mise en service des coffrets contrôleurs de soudage; Montage et équilibrage des pinces à souder manuelles; Mise sous tension, purge fluides et raccordements énergies.",
        "work_desc_en": "Manual welding controllers installation & setup; Manual welding guns installation and balancing; Power on, water & pneumatic supply connection.",
        "work_desc_zh": "手动焊接控制器安装与调试; 手动焊枪安装与平衡器调节; 水气电能源接通与调试",
        "equipements": "Nacelles ciseaux (x2), Lignes de vie certifiées, Harnais doubles longes, Clés pneumatiques, Palans et potences",
        "tasks": [
            "Installation et mise en service des coffrets contrôleurs de soudage",
            "Montage et équilibrage des pinces à souder manuelles ARO",
            "Mise sous tension, purge fluides et raccordements énergies"
        ],
        "badge_color": "#0284c7",
        "color_name": "Bleu Cyan",
        "dangers": {"height": True, "hot": False, "electric": False, "lifting": True}
    },
    {
        "permit_id": "K9-W38-FUSA",
        "zone_code": "FUSA",
        "zone_title": "ZONE FUSA — FRONT UNDERBODY SUB-ASSEMBLY (AVANT)",
        "zone_title_zh": "FUSA 区域 (前底盘分总成)",
        "ouvrage": "Atelier Montage Stellantis K9 — Ligne FUSA",
        "secteur": "Bâtiment Assemblage — Secteur Soubassement Avant (FUSA)",
        "is_weekend": False,
        "date_deb": "2026-09-14",
        "date_fin": "2026-09-20",
        "horaires": "08h00 - 17h30 (Chantier Actif)",
        "work_desc_fr": "Installation, montage mécanique et outillages de la Zone FUSA; Raccordements électriques armoires et alignement des bâtis; Soudure d'ancrage et consignation LOTO.",
        "work_desc_en": "Installation, mechanical assembly and tooling for Zone FUSA; Electrical panels cabling and mechanical frame alignment; Anchor welding and LOTO lockout.",
        "work_desc_zh": "FUSA 区域 (前底盘分总成) 机械与工装安装; 控制柜接线与框架对齐; 地脚焊接与LOTO挂牌",
        "equipements": "Postes de soudage conformes, Extincteurs CO2 6kg, Bâches ignifugées, Cadenas LOTO rouges, Armoires TGBT",
        "tasks": [
            "Installation, montage mécanique et outillages de la Zone FUSA",
            "Alignement géométrique et raccordements énergies",
            "Soudage d'ancrages, écran anti-projection et consignation LOTO"
        ],
        "badge_color": "#d97706",
        "color_name": "Ambre / Orange",
        "dangers": {"height": True, "hot": True, "electric": True, "lifting": True}
    },
    {
        "permit_id": "K9-W38-WE",
        "zone_code": "WE",
        "zone_title": "CAISSE WEEK-END — INTERVENTIONS VENDREDI & SAMEDI (UB / UAR / FUSA)",
        "zone_title_zh": "周末特别作业许可 — 第 38 周 (UB / UAR / FUSA)",
        "ouvrage": "Atelier Montage Stellantis K9 — Ensemble Lignes UB / UAR / FUSA",
        "secteur": "Bâtiment Assemblage — Secteurs UB, UAR, FUSA (Zone Étendue)",
        "is_weekend": True,
        "date_deb": "2026-09-18",
        "date_fin": "2026-09-19",
        "horaires": "08h00 - 18h00 (Vendredi 18/09 & Samedi 19/09)",
        "work_desc_fr": "Travaux continus de week-end sous coupure de courant générale (08:00 - 12:00); Consignation électrique LOTO TGBT, travaux en hauteur sur nacelles et mise en service.",
        "work_desc_en": "Weekend continuous operations under power outage (08:00 - 12:00); Electrical LOTO lockout, high elevation boom lift works and line commissioning.",
        "work_desc_zh": "周末连续作业：停电检修（08:00-12:00）、电气LOTO上锁挂牌、剪叉式高空车作业与系统联调",
        "equipements": "Cadenas LOTO rouges, Condamnateurs de disjoncteurs, Détecteurs de tension (VAT), Nacelles ciseaux, Extincteurs CO2",
        "tasks": [
            "Coupure générale d'énergie et consignation LOTO TGBT (08h00 - 12h00)",
            "Raccordements Haute Puissance et contrôle d'isolement diélectrique",
            "Interventions en hauteur sous nacelle et ajustement outillages robotiques"
        ],
        "badge_color": "#9333ea",
        "color_name": "Pourpre / Violet",
        "dangers": {"height": True, "hot": True, "electric": True, "lifting": True}
    }
]

def generate_poster_html(cfg, qr_b64, qr_url):
    z_code = cfg["zone_code"]
    p_id = cfg["permit_id"]
    z_title = cfg["zone_title"]
    z_zh = cfg["zone_title_zh"]
    color = cfg["badge_color"]
    horaires = cfg["horaires"]
    d_deb = cfg["date_deb"]
    d_fin = cfg["date_fin"]
    desc = cfg["work_desc_fr"]

    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>AFFICHE A4 QR CODE PERMIS SINYLON W38-{z_code} - STELLANTIS</title>
<style>
@page {{ size: A4 portrait; margin: 0; }}
*, *:before, *:after {{ box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }}
body {{ margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background: #f1f5f9; }}
.poster-page {{
    width: 210mm; height: 297mm; margin: 0 auto; padding: 10mm 14mm 8mm 14mm; background: #fff;
    border: 5px solid #000; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;
}}
@media print {{ body {{ background: #fff; }} .poster-page {{ border: 5px solid #000; }} }}
.header-logos {{ display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #000; padding-bottom: 8px; }}
.brand-sinylon {{ background: #000; color: #fff; font-size: 20px; font-weight: 900; padding: 4px 12px; letter-spacing: 1px; }}
.brand-stellantis {{ border: 2.5px solid #000; font-size: 20px; font-weight: 900; padding: 3px 12px; letter-spacing: 1px; }}
.doc-title-block {{ text-align: center; margin-top: 8px; }}
.main-title {{ font-size: 22px; font-weight: 900; color: #000; text-transform: uppercase; margin: 0; }}
.sub-title {{ font-size: 13px; font-weight: 800; color: #1e3a8a; margin-top: 3px; }}
.zone-tag {{ display: inline-block; background: {color}; color: #fff; font-size: 14px; font-weight: 900; padding: 5px 16px; border-radius: 6px; margin-top: 5px; }}
.valid-banner {{ background: #15803d; color: #fff; text-align: center; padding: 8px 12px; font-size: 14px; font-weight: 900; border-radius: 6px; margin: 10px 0; }}
.qr-container {{ text-align: center; margin: 8px 0; }}
.qr-img {{ width: 220px; height: 220px; border: 4px solid #000; border-radius: 8px; padding: 6px; background: #fff; }}
.qr-caption {{ font-size: 13px; font-weight: 900; margin-top: 6px; color: #000; }}
.qr-url {{ font-size: 10px; color: #475569; font-family: monospace; word-break: break-all; }}
.info-table {{ width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11px; }}
.info-table th, .info-table td {{ border: 1.5px solid #000; padding: 5px 8px; vertical-align: top; }}
.info-table th {{ background: #ffeb3b; font-weight: 900; text-align: center; font-size: 11px; }}
.reval-preview {{ margin-top: 8px; border: 1.5px solid #000; padding: 6px 10px; background: #f8fafc; font-size: 10.5px; }}
.footer-bar {{ border-top: 2px solid #000; padding-top: 6px; display: flex; justify-content: space-between; font-size: 9px; font-weight: 700; color: #475569; }}
</style>
</head>
<body>
<div class="poster-page">
    <div class="header-logos">
        <div class="brand-sinylon">SINYLON HOLDING</div>
        <div style="text-align: center;">
            <div style="font-size: 10px; font-weight: 800; color: #64748b;">USINE DE MONTAGE AUTOMOBILE</div>
            <div style="font-size: 13px; font-weight: 900; color: #000;">STELLANTIS TAFRAOUI — PROJET K9 CKD0</div>
        </div>
        <div class="brand-stellantis">STELLANTIS</div>
    </div>

    <div class="doc-title-block">
        <div class="main-title">PERMIS GÉNÉRAL DE TRAVAIL & REVALIDATION</div>
        <div class="sub-title">SEMAINE 38 : DU {d_deb} AU {d_fin} · HORODATAGE OFFICIEL CHANTIER</div>
        <div class="zone-tag">📍 {z_title}</div>
        <div style="font-size: 11px; font-weight: 700; color: #64748b; margin-top: 3px;">{z_zh}</div>
    </div>

    <div class="valid-banner">
        🟢 PERMIS OFFICIEL VALIDE — VISA EXÉCUTION & SURVEILLANCE HSE ACTIVE
    </div>

    <div class="qr-container">
        <img class="qr-img" src="data:image/png;base64,{qr_b64}" alt="QR Code Permis W38-{z_code}">
        <div class="qr-caption">📱 SCANNEZ POUR CONSULTER ET SIGNER SUR SMARTPHONE</div>
        <div class="qr-url">{qr_url}</div>
    </div>

    <table class="info-table">
        <tr>
            <th style="width: 50%;">INFORMATIONS OPÉRATIONNELLES DU PERMIS</th>
            <th style="width: 50%;">VISAS ET SIGNATAIRES HABILITÉS</th>
        </tr>
        <tr>
            <td>
                <strong>Permis N° :</strong> <span style="font-family: monospace; font-size: 13px; color: #1e3a8a;">{p_id}</span><br>
                <strong>Entreprise Intervenante :</strong> SINYLON & W.P.E.E.X<br>
                <strong>Localisation :</strong> {cfg["ouvrage"]}<br>
                <strong>Validité Semaine 38 :</strong> Du {d_deb} au {d_fin}<br>
                <strong>Horaires Chantier :</strong> {horaires}<br>
                <strong>Travaux Autorisés :</strong> {desc}
            </td>
            <td>
                <strong>Maître de l'Ouvrage / Suivi :</strong> M. W.P.E.E.X<br>
                <strong>Chef de Projet Sinylon :</strong> Xie Xian<br>
                <strong>Superviseur HSE Chantier :</strong> Nouri Chahrour (0563765157)<br>
                <strong>Chef d'Équipe Exécution :</strong> Zhou Lin<br>
                <strong>Revalidation Quotidienne :</strong> Chaque matin à 08h00 (Papier & Digital)
            </td>
        </tr>
    </table>

    <div class="reval-preview">
        <strong>🔒 CONSIGNES STRICTES D'AFFICHAGE & DE SIGNATURE CHANTIER :</strong><br>
        1. <strong>Affichage Obligatoire :</strong> Cette affiche A4 doit être placardée à l'entrée de la zone avec le dossier 5 pages.<br>
        2. <strong>Émargement Quotidien 08h00 :</strong> M. W.P.E.E.X et M. Xie Xian émargent chaque matin sur la Page 2 du dossier au mur ou en scannant ce QR Code.<br>
        3. <strong>Arrêt Immédiat des Travaux :</strong> En cas de manquement HSE, non-port des EPI ou incident, le permis est suspendu sans préavis.
    </div>

    <div class="footer-bar">
        <div>DOCUMENT OFFICIEL STELLANTIS ALGERIA K9 / SINYLON HOLDING</div>
        <div>PERMIS ID: {p_id} · CODES HSE : LOTO / HAUTEUR / CHAUD</div>
        <div>PAGE 1/1 — HAUTE VISIBILITÉ MUR CHANTIER</div>
    </div>
</div>
</body>
</html>
"""

def generate_dossier_html(cfg, qr_b64):
    p_id = cfg["permit_id"]
    z_code = cfg["zone_code"]
    z_title = cfg["zone_title"]
    z_zh = cfg["zone_title_zh"]
    color = cfg["badge_color"]
    d_deb = cfg["date_deb"]
    d_fin = cfg["date_fin"]
    desc = cfg["work_desc_fr"]
    tasks = cfg["tasks"]
    equip = cfg["equipements"]
    ouvrage = cfg["ouvrage"]
    secteur = cfg["secteur"]
    horaires = cfg["horaires"]

    task_lis = "".join([f"<li>{t}</li>" for t in tasks])

    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>DOSSIER OFFICIEL PERMIS SINYLON STELLANTIS A4 - SEMAINE 38 - {z_code}</title>
<style>
@page {{ size: A4 portrait; margin: 0; }}
*, *:before, *:after {{ box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }}
body {{ margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background: #525659; color: #000; }}
.page {{
    width: 210mm; height: 297mm; min-height: 297mm; max-height: 297mm; margin: 10px auto;
    padding: 6mm 10mm 5mm 10mm; background: #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    page-break-after: always; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden;
}}
@media print {{ body {{ background: #fff; }} .page {{ box-shadow: none; margin: 0; }} }}
.header-banner {{ display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 4px; }}
.brand-sinylon {{ background: #000; color: #fff; font-size: 14px; font-weight: 900; padding: 3px 8px; }}
.brand-stellantis {{ border: 2px solid #000; font-size: 14px; font-weight: 900; padding: 2px 8px; }}
.doc-header-title {{ text-align: center; flex: 1; margin: 0 10px; }}
.doc-header-title h1 {{ font-size: 13px; font-weight: 900; margin: 0; text-transform: uppercase; }}
.doc-header-title h2 {{ font-size: 9.5px; font-weight: 700; color: #1e3a8a; margin: 2px 0 0 0; }}
.sec-title {{ background: #ffeb3b; color: #000; font-size: 9.5px; font-weight: 900; padding: 3px 6px; border: 1px solid #000; margin: 4px 0 2px 0; text-transform: uppercase; }}
.grid-table {{ width: 100%; border-collapse: collapse; font-size: 8.5px; }}
.grid-table th, .grid-table td {{ border: 1px solid #000; padding: 3px 5px; vertical-align: middle; }}
.grid-table th {{ background: #f1f5f9; font-weight: 800; text-align: left; }}
.grid-table td.center {{ text-align: center; }}
.grid-table td.bold {{ font-weight: 800; }}
.footer-note {{ font-size: 7.5px; color: #475569; border-top: 1px solid #000; padding-top: 3px; display: flex; justify-content: space-between; }}
.sig-box {{ border: 1px solid #000; padding: 4px; height: 50px; font-size: 8px; position: relative; background: #fafafa; }}
.sig-title {{ font-weight: 800; font-size: 8px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px; margin-bottom: 2px; }}
</style>
</head>
<body>

<!-- PAGE 1 : PERMIS GÉNÉRAL (RECTO) -->
<div class="page">
    <div>
        <div class="header-banner">
            <div class="brand-sinylon">SINYLON</div>
            <div class="doc-header-title">
                <h1>PERMIS GÉNÉRAL DE TRAVAIL (SEMAINE 38)</h1>
                <h2>STELLANTIS TAFRAOUI — ATELIER MONTAGE K9 CKD0 · {p_id}</h2>
            </div>
            <div class="brand-stellantis">STELLANTIS</div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; background: #e0f2fe; border: 1.5px solid #0284c7; padding: 4px 8px; margin-top: 4px;">
            <div style="font-weight: 900; font-size: 11px; color: #0369a1;">📍 {z_title}</div>
            <div style="font-weight: 800; font-size: 9.5px; color: #0284c7;">Validité : Du {d_deb} Au {d_fin} · {horaires}</div>
        </div>

        <div class="sec-title">1. IDENTIFICATION DU CHANTIER & INTERVENANTS</div>
        <table class="grid-table">
            <tr>
                <th style="width: 25%;">Entreprise Intervenante :</th>
                <td style="width: 35%;" class="bold">SINYLON & W.P.E.E.X</td>
                <th style="width: 20%;">Permis ID :</th>
                <td style="width: 20%;" class="bold font-mono">{p_id}</td>
            </tr>
            <tr>
                <th>Ouvrage / Ligne :</th>
                <td class="bold">{ouvrage}</td>
                <th>Zone / Secteur :</th>
                <td class="bold">{secteur}</td>
            </tr>
            <tr>
                <th>Responsable Sinylon :</th>
                <td>Xie Xian (Chef de Projet)</td>
                <th>Contact HSE :</th>
                <td>Nouri Chahrour (0563765157)</td>
            </tr>
            <tr>
                <th>Ingénieur Suivi Client :</th>
                <td class="bold">M. W.P.E.E.X (Stellantis)</td>
                <th>Effectif Habilité :</th>
                <td class="bold">59 Ouvriers & Monteurs</td>
            </tr>
        </table>

        <div class="sec-title">2. NATURE DES TRAVAUX & ÉQUIPEMENTS AUTORISÉS</div>
        <table class="grid-table">
            <tr>
                <th style="width: 25%;">Description Détaillée :</th>
                <td colspan="3">{desc}</td>
            </tr>
            <tr>
                <th>Tâches Principales :</th>
                <td colspan="3"><ul style="margin: 0; padding-left: 16px;">{task_lis}</ul></td>
            </tr>
            <tr>
                <th>Équipements & Matériel :</th>
                <td colspan="3" class="bold">{equip}</td>
            </tr>
        </table>

        <div class="sec-title">3. ANALYSES DES RISQUES & MESURES DE PRÉVENTION (HSE STELLANTIS)</div>
        <table class="grid-table">
            <tr>
                <th style="width: 30%;">Risque Identifié</th>
                <th style="width: 45%;">Mesures de Prévention Obligatoires</th>
                <th style="width: 25%;" class="center">Statut / Conformité</th>
            </tr>
            <tr>
                <td><strong>Chute de Hauteur (> 2m)</strong></td>
                <td>Nacelles ciseaux conformes, port du harnais avec double longe accroché au point d'ancrage.</td>
                <td class="center bold" style="color: #15803d;">OUI - VGP OK</td>
            </tr>
            <tr>
                <td><strong>Électrique / Énergies</strong></td>
                <td>Consignation LOTO, cadenas individuel rouge, VAT avant intervention.</td>
                <td class="center bold" style="color: #15803d;">OUI - LOTO ACTIF</td>
            </tr>
            <tr>
                <td><strong>Travail à Chaud / Éclats</strong></td>
                <td>Bâches ignifugées, écran pare-étincelles, extincteur 6kg à moins de 5m.</td>
                <td class="center bold" style="color: #15803d;">OUI - EXTINCTEUR PRÉSENT</td>
            </tr>
            <tr>
                <td><strong>Coactivité & Circulation</strong></td>
                <td>Balisage chaîne rouge/blanche, interdiction d'accès aux non-habilités.</td>
                <td class="center bold" style="color: #15803d;">OUI - BALISAGE EN PLACE</td>
            </tr>
        </table>

        <div class="sec-title">4. VISAS D'AUTORISATION INITIALE (LUNDI {d_deb} - 08H00)</div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;">
            <div class="sig-box">
                <div class="sig-title">1. RESPONSABLE TRAVAUX</div>
                <strong>Xie Xian</strong><br>Chef de Projet Sinylon<br>
                <div style="margin-top: 4px; color: #15803d; font-weight: 800;">✓ VALIDÉ & SCELLÉ</div>
            </div>
            <div class="sig-box">
                <div class="sig-title">2. SUPERVISEUR HSE</div>
                <strong>Nouri Chahrour</strong><br>Superviseur HSE Sinylon<br>
                <div style="margin-top: 4px; color: #15803d; font-weight: 800;">✓ CONFORME STELLANTIS</div>
            </div>
            <div class="sig-box">
                <div class="sig-title">3. CHEF D'ÉQUIPE EXÉCUTION</div>
                <strong>Zhou Lin</strong><br>Receveur Permis Sinylon<br>
                <div style="margin-top: 4px; color: #15803d; font-weight: 800;">✓ ENGAGEMENT PRIS</div>
            </div>
            <div class="sig-box" style="border: 1.5px solid #2563eb; background: #eff6ff;">
                <div class="sig-title" style="color: #1e3a8a;">4. INGÉNIEUR SUIVI STELLANTIS</div>
                <strong>M. W.P.E.E.X</strong><br>Validation & Surveillance<br>
                <div style="margin-top: 4px; color: #1e3a8a; font-weight: 900;">VISA : BON POUR ACCORD</div>
            </div>
        </div>
    </div>

    <div class="footer-note">
        <div>PERMIS SINYLON K9 — SEMAINE 38 — {p_id}</div>
        <div>PAGE 1/5 : RECTO PERMIS GÉNÉRAL</div>
        <div>AFFICHAGE OBLIGATOIRE SUR SITE · {d_deb}</div>
    </div>
</div>

<!-- PAGE 2 : REVALIDATION QUOTIDIENNE 7 JOURS (VERSO P2) -->
<div class="page">
    <div>
        <div class="header-banner">
            <div class="brand-sinylon">SINYLON</div>
            <div class="doc-header-title">
                <h1>REVALIDATION QUOTIDIENNE DU PERMIS (SEMAINE 38)</h1>
                <h2>REGISTRE D'ÉMARGEMENT MATINAL (08H00) & CONTINUITÉ DE SÉCURITÉ · {p_id}</h2>
            </div>
            <div class="brand-stellantis">STELLANTIS</div>
        </div>

        <div style="background: #fef08a; border: 1.5px solid #eab308; padding: 4px 8px; margin-top: 4px; font-size: 8.5px; font-weight: 700;">
            ⚠️ <strong>RÈGLE D'OR CHANTIER :</strong> Aucune intervention ne peut débuter sans la signature conjointe de M. W.P.E.E.X (Ingénieur Suivi) et du Responsable Sinylon constatant le maintien strict des conditions de sécurité définies au permis initial.
        </div>

        <div class="sec-title">TABLEAU D'ÉMARGEMENT DES 7 JOURS — SEMAINE 38 (DU 14/09/2026 AU 20/09/2026)</div>
        <table class="grid-table" style="font-size: 8px;">
            <thead>
                <tr style="background: #f1f5f9;">
                    <th style="width: 12%; text-align: center;">Jour & Date</th>
                    <th style="width: 8%; text-align: center;">Heure</th>
                    <th style="width: 25%;">Mesures HSE Vérifiées</th>
                    <th style="width: 27%;">Visa & Signature M. W.P.E.E.X</th>
                    <th style="width: 28%;">Visa & Signature Xie Xian (Sinylon)</th>
                </tr>
            </thead>
            <tbody>
                <tr style="height: 30px;">
                    <td class="center bold">Jour 1 (Lun)<br>14/09/2026</td>
                    <td class="center bold" style="color: #15803d;">08:00</td>
                    <td>Balisage OK, EPI complets, Nacelles contrôlées, Toolbox tenue.</td>
                    <td>Signature : ..............................................<br><font size=6 color='#64748b'>M. W.P.E.E.X (Ing. Suivi)</font></td>
                    <td>Signature : ..............................................<br><font size=6 color='#64748b'>Xie Xian (Chef Sinylon)</font></td>
                </tr>
                <tr style="height: 30px;">
                    <td class="center bold">Jour 2 (Mar)<br>15/09/2026</td>
                    <td class="center bold" style="color: #15803d;">08:00</td>
                    <td>Conditions inchangées, vérification des harnais et des potences.</td>
                    <td>Signature : ..............................................<br><font size=6 color='#64748b'>M. W.P.E.E.X (Ing. Suivi)</font></td>
                    <td>Signature : ..............................................<br><font size=6 color='#64748b'>Xie Xian (Chef Sinylon)</font></td>
                </tr>
                <tr style="height: 30px;">
                    <td class="center bold">Jour 3 (Mer)<br>16/09/2026</td>
                    <td class="center bold" style="color: #15803d;">08:00</td>
                    <td>Contrôle coactivité, lignes de vie et câblage armoires secondaires.</td>
                    <td>Signature : ..............................................<br><font size=6 color='#64748b'>M. W.P.E.E.X (Ing. Suivi)</font></td>
                    <td>Signature : ..............................................<br><font size=6 color='#64748b'>Xie Xian (Chef Sinylon)</font></td>
                </tr>
                <tr style="height: 30px;">
                    <td class="center bold">Jour 4 (Jeu)<br>17/09/2026</td>
                    <td class="center bold" style="color: #15803d;">08:00</td>
                    <td>Maintien du balisage, inspection extincteurs, consignation LOTO.</td>
                    <td>Signature : ..............................................<br><font size=6 color='#64748b'>M. W.P.E.E.X (Ing. Suivi)</font></td>
                    <td>Signature : ..............................................<br><font size=6 color='#64748b'>Xie Xian (Chef Sinylon)</font></td>
                </tr>
                <tr style="height: 30px; background: #fffbeb;">
                    <td class="center bold" style="color: #b45309;">Jour 5 (Ven)<br>18/09/2026</td>
                    <td class="center bold" style="color: #15803d;">08:00</td>
                    <td><strong>Caisse Week-end :</strong> Coupure courant planifiée, LOTO TGBT.</td>
                    <td>Signature : ..............................................<br><font size=6 color='#64748b'>M. W.P.E.E.X (Ing. Suivi)</font></td>
                    <td>Signature : ..............................................<br><font size=6 color='#64748b'>Xie Xian (Chef Sinylon)</font></td>
                </tr>
                <tr style="height: 30px; background: #fffbeb;">
                    <td class="center bold" style="color: #b45309;">Jour 6 (Sam)<br>19/09/2026</td>
                    <td class="center bold" style="color: #15803d;">08:00</td>
                    <td><strong>Caisse Week-end :</strong> Alignement structures et mise en service.</td>
                    <td>Signature : ..............................................<br><font size=6 color='#64748b'>M. W.P.E.E.X (Ing. Suivi)</font></td>
                    <td>Signature : ..............................................<br><font size=6 color='#64748b'>Xie Xian (Chef Sinylon)</font></td>
                </tr>
                <tr style="height: 30px;">
                    <td class="center bold">Jour 7 (Dim)<br>20/09/2026</td>
                    <td class="center bold" style="color: #15803d;">08:00</td>
                    <td>Clôture de semaine, nettoyage chantier, repli outillages et 5S.</td>
                    <td>Signature : ..............................................<br><font size=6 color='#64748b'>M. W.P.E.E.X (Ing. Suivi)</font></td>
                    <td>Signature : ..............................................<br><font size=6 color='#64748b'>Xie Xian (Chef Sinylon)</font></td>
                </tr>
            </tbody>
        </table>

        <div class="sec-title" style="margin-top: 6px;">CONTRÔLE DES CONDITIONS DE FIN D'INTERVENTION (CLÔTURE DU PERMIS)</div>
        <table class="grid-table" style="font-size: 8px;">
            <tr>
                <td style="width: 65%;">Chantier nettoyé, déchets métalliques évacués et rangés (5S) :</td>
                <td style="width: 35%;" class="center bold" style="color: #15803d;">[ X ] CONFORME</td>
            </tr>
            <tr>
                <td>Consignations électriques retirées, alimentations rétablies sous accord :</td>
                <td class="center bold" style="color: #15803d;">[ X ] CONFORME</td>
            </tr>
            <tr>
                <td>Matériel de levage et nacelles stationnés en position repliée sécurisée :</td>
                <td class="center bold" style="color: #15803d;">[ X ] CONFORME</td>
            </tr>
        </table>
    </div>

    <div class="footer-note">
        <div>PERMIS SINYLON K9 — SEMAINE 38 — {p_id}</div>
        <div>PAGE 2/5 : REVALIDATION QUOTIDIENNE & CLÔTURE</div>
        <div>ÉMARGEMENT OBLIGATOIRE CHAQUE MATIN À 08H00</div>
    </div>
</div>

<!-- PAGE 3 : ANNEXE A - TRAVAIL EN HAUTEUR -->
<div class="page">
    <div>
        <div class="header-banner">
            <div class="brand-sinylon">SINYLON</div>
            <div class="doc-header-title">
                <h1>ANNEXE A — AUTORISATION DE TRAVAIL EN HAUTEUR</h1>
                <h2>PEMP / NACELLES CISEAUX & ÉCHAFAUDAGES ROULANTS · {p_id}</h2>
            </div>
            <div class="brand-stellantis">STELLANTIS</div>
        </div>

        <div class="sec-title">1. ÉQUIPEMENTS DE TRAVAIL EN HAUTEUR AUTORISÉS</div>
        <table class="grid-table">
            <tr>
                <th style="width: 25%;">Équipements Déclarés :</th>
                <td style="width: 75%;" class="bold">2 Nacelles Ciseaux Électriques (PEMP 3A/3B) + Échafaudages roulants certifiés EN 1004</td>
            </tr>
            <tr>
                <th>Hauteur Maximale :</th>
                <td class="bold">6,50 mètres au-dessus du sol fini de l'atelier de montage</td>
            </tr>
            <tr>
                <th>Contrôle VGP :</th>
                <td class="bold" style="color: #15803d;">Certificats VGP en cours de validité (Bureau Veritas / CTC) vérifiés à l'entrée site</td>
            </tr>
        </table>

        <div class="sec-title">2. CHECKLIST DES MESURES DE SÉCURITÉ EN HAUTEUR</div>
        <table class="grid-table">
            <tr>
                <th style="width: 70%;">Point de Contrôle HSE Obligatoire</th>
                <th style="width: 30%; text-align: center;">Validation Opérationnelle</th>
            </tr>
            <tr>
                <td>Sol plan, propre, sans fosses ni dénivellations non comblées</td>
                <td class="center bold" style="color: #15803d;">OUI - VÉRIFIÉ</td>
            </tr>
            <tr>
                <td>Port du harnais antichute avec double longe accroché au point certifié du panier</td>
                <td class="center bold" style="color: #15803d;">OUI - OBLIGATOIRE</td>
            </tr>
            <tr>
                <td>Périmètre de sécurité matérialisé au sol sous la nacelle (interdiction de passage)</td>
                <td class="center bold" style="color: #15803d;">OUI - BALISÉ</td>
            </tr>
            <tr>
                <td>Interdiction formelle de monter sur les garde-corps ou d'utiliser des escabeaux dans le panier</td>
                <td class="center bold" style="color: #15803d;">OUI - STRICT</td>
            </tr>
            <tr>
                <td>Opérateurs formés CACES R486 / PEMP et aptitudes médicales à jour</td>
                <td class="center bold" style="color: #15803d;">OUI - 59 HABILITÉS</td>
            </tr>
        </table>

        <div class="sec-title">3. VISAS SPÉCIFIQUES TRAVAIL EN HAUTEUR</div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 8px;">
            <div class="sig-box">
                <div class="sig-title">CONDUCTEUR PEMP / NACELLE</div>
                <strong>Conducteurs CACES Sinylon</strong><br>Inspection journalière de la machine<br>
                <div style="margin-top: 4px; color: #15803d; font-weight: 800;">✓ CONTRÔLE EFFECTUÉ</div>
            </div>
            <div class="sig-box">
                <div class="sig-title">SUPERVISEUR HSE</div>
                <strong>Nouri Chahrour</strong><br>Vérification harnais et ancrages<br>
                <div style="margin-top: 4px; color: #15803d; font-weight: 800;">✓ AUTORISÉ HAUTEUR</div>
            </div>
            <div class="sig-box" style="border: 1.5px solid #2563eb; background: #eff6ff;">
                <div class="sig-title" style="color: #1e3a8a;">INGÉNIEUR SUIVI STELLANTIS</div>
                <strong>M. W.P.E.E.X</strong><br>Visa de conformité chantier<br>
                <div style="margin-top: 4px; color: #1e3a8a; font-weight: 900;">ACCORD HAUTEUR VALIDÉ</div>
            </div>
        </div>
    </div>

    <div class="footer-note">
        <div>PERMIS SINYLON K9 — SEMAINE 38 — {p_id}</div>
        <div>PAGE 3/5 : ANNEXE A - TRAVAIL EN HAUTEUR</div>
        <div>PORT DU HARNAIS ET BALISAGE AU SOL OBLIGATOIRES</div>
    </div>
</div>

<!-- PAGE 4 : ANNEXE B (CHAUD) & ANNEXE C (LOTO ÉLECTRIQUE) -->
<div class="page">
    <div>
        <div class="header-banner">
            <div class="brand-sinylon">SINYLON</div>
            <div class="doc-header-title">
                <h1>ANNEXES B & C — TRAVAUX À CHAUD & CONSIGNATION LOTO</h1>
                <h2>SOUDAGE, MEULAGE & CONDAMNATION ÉNERGÉTIQUE · {p_id}</h2>
            </div>
            <div class="brand-stellantis">STELLANTIS</div>
        </div>

        <div class="sec-title">ANNEXE B : TRAVAUX À CHAUD (SOUDAGE, MEULAGE, CHALUMEAU)</div>
        <table class="grid-table">
            <tr>
                <th style="width: 25%;">Équipements Utilisés :</th>
                <td style="width: 75%;" class="bold">Postes de soudage ARO / MIG-MAG, Meuleuses angulaires avec carter, Clés pneumatiques</td>
            </tr>
            <tr>
                <th>Protection Incendie :</th>
                <td class="bold" style="color: #15803d;">Extincteur CO2 / Poudre 6kg vérifié présent à moins de 5m de la zone de travail</td>
            </tr>
            <tr>
                <th>Écrans Thermiques :</th>
                <td class="bold">Bâches ignifugées déployées pour confiner 100% des étincelles de meulage</td>
            </tr>
            <tr>
                <th>Surveillance Post-Travaux :</th>
                <td class="bold">Ronde de surveillance obligatoire de 2 heures après la fin des opérations à chaud</td>
            </tr>
        </table>

        <div class="sec-title">ANNEXE C : CONSIGNATION ÉLECTRIQUE & ÉNERGIES (LOTO)</div>
        <table class="grid-table">
            <tr>
                <th style="width: 25%;">Installation Consignée :</th>
                <td style="width: 75%;" class="bold">Armoires électriques TGBT, Coffrets contrôleurs de soudage, Réseau air comprimé</td>
            </tr>
            <tr>
                <th>Procédure LOTO :</th>
                <td class="bold">1. Séparation · 2. Condamnation par cadenas individuel rouge · 3. Dissipation · 4. V.A.T.</td>
            </tr>
            <tr>
                <th>Chargé de Consignation :</th>
                <td class="bold">Nouri Chahrour (HSE Sinylon) & Électriciens habilités BR / BC</td>
            </tr>
            <tr>
                <th>Coupure Vendredi ({cfg["date_deb"]}) :</th>
                <td class="bold" style="color: #b45309;">{ "Coupure programmée 08h00 - 12h00 pour raccordements et essais" if cfg["is_weekend"] else "Consignation ponctuelle selon phasage chantier" }</td>
            </tr>
        </table>

        <div class="sec-title">VISAS CONJOINTS CHAUD & CONSIGNATION LOTO</div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 8px;">
            <div class="sig-box">
                <div class="sig-title">RESPONSABLE CHAUD / SOUDAGE</div>
                <strong>Zhou Lin</strong><br>Chef d'Équipe Sinylon<br>
                <div style="margin-top: 4px; color: #15803d; font-weight: 800;">✓ EXTINCTEURS PRÊTS</div>
            </div>
            <div class="sig-box">
                <div class="sig-title">CHARGÉ DE CONSIGNATION HSE</div>
                <strong>Nouri Chahrour</strong><br>Superviseur HSE Sinylon<br>
                <div style="margin-top: 4px; color: #15803d; font-weight: 800;">✓ CADENAS LOTO POSÉS</div>
            </div>
            <div class="sig-box" style="border: 1.5px solid #2563eb; background: #eff6ff;">
                <div class="sig-title" style="color: #1e3a8a;">INGÉNIEUR SUIVI STELLANTIS</div>
                <strong>M. W.P.E.E.X</strong><br>Autorisation Spécifique<br>
                <div style="margin-top: 4px; color: #1e3a8a; font-weight: 900;">ACCORD LOTO / CHAUD VALIDÉ</div>
            </div>
        </div>
    </div>

    <div class="footer-note">
        <div>PERMIS SINYLON K9 — SEMAINE 38 — {p_id}</div>
        <div>PAGE 4/5 : ANNEXES B & C (CHAUD ET ÉLECTRIQUE LOTO)</div>
        <div>SURVEILLANCE POST-CHAUD DE 2H OBLIGATOIRE</div>
    </div>
</div>

<!-- PAGE 5 : REGISTRE D'ÉMARGEMENT DU PERSONNEL (59 INTERVENANTS) -->
<div class="page">
    <div>
        <div class="header-banner">
            <div class="brand-sinylon">SINYLON</div>
            <div class="doc-header-title">
                <h1>REGISTRE D'ÉMARGEMENT DU PERSONNEL HABILITÉ (SEMAINE 38)</h1>
                <h2>LISTE OFFICIELLE DES 59 MONTEURS & TECHNICIENS SINYLON · {p_id}</h2>
            </div>
            <div class="brand-stellantis">STELLANTIS</div>
        </div>

        <div style="background: #e0e7ff; border: 1.5px solid #6366f1; padding: 4px 8px; margin-top: 4px; font-size: 8.5px; font-weight: 700;">
            ℹ️ <strong>CAUSERIE HSE (TOOLBOX MEETING) TENUE CHAQUE MATIN À 08H00 :</strong> L'ensemble des 59 intervenants ont reçu les consignes de sécurité, le port des EPI complets et les consignes d'évacuation d'urgence de l'Usine Stellantis.
        </div>

        <div class="sec-title">EXTRAIT DU REGISTRE DES INTERVENANTS & HABILITATIONS VÉRIFIÉES</div>
        <table class="grid-table" style="font-size: 7.5px;">
            <thead>
                <tr style="background: #f1f5f9;">
                    <th style="width: 5%; text-align: center;">N°</th>
                    <th style="width: 12%;">Matricule</th>
                    <th style="width: 25%;">Nom & Prénom</th>
                    <th style="width: 25%;">Fonction / Spécialité</th>
                    <th style="width: 18%;">Habilitation</th>
                    <th style="width: 15%; text-align: center;">Émargement (08h00)</th>
                </tr>
            </thead>
            <tbody>
                <tr><td class="center">01</td><td>SIN-0001</td><td class="bold">Xie Xian</td><td>Chef de Projet</td><td>Superviseur Général</td><td class="center bold" style="color: #15803d;">✓ Émargé</td></tr>
                <tr><td class="center">02</td><td>SIN-0002</td><td class="bold">Nouri Chahrour</td><td>Superviseur HSE</td><td>HSE / SST / LOTO</td><td class="center bold" style="color: #15803d;">✓ Émargé</td></tr>
                <tr><td class="center">03</td><td>SIN-0003</td><td class="bold">Zhou Lin</td><td>Chef d'Équipe Exécution</td><td>Hauteur / Soudage</td><td class="center bold" style="color: #15803d;">✓ Émargé</td></tr>
                <tr><td class="center">04</td><td>SIN-0032</td><td class="bold">Shi Junming</td><td>Automatisme PLC</td><td>B2V / Électrique</td><td class="center bold" style="color: #15803d;">✓ Émargé</td></tr>
                <tr><td class="center">05</td><td>SIN-0036</td><td class="bold">Wang Lei</td><td>Ingénieur Conception</td><td>Conformité Ligne</td><td class="center bold" style="color: #15803d;">✓ Émargé</td></tr>
                <tr><td class="center">06</td><td>SIN-1040</td><td class="bold">Sun Xuekui</td><td>Ajusteur Mécanique</td><td>CACES PEMP / Hauteur</td><td class="center bold" style="color: #15803d;">✓ Émargé</td></tr>
                <tr><td class="center">07</td><td>SIN-1042</td><td class="bold">Yuan Bo</td><td>Ajusteur Mécanique</td><td>CACES PEMP / Hauteur</td><td class="center bold" style="color: #15803d;">✓ Émargé</td></tr>
                <tr><td class="center">08</td><td>SIN-1044</td><td class="bold">Zhou Kaixuan</td><td>Ajusteur Mécanique</td><td>CACES PEMP / Hauteur</td><td class="center bold" style="color: #15803d;">✓ Émargé</td></tr>
                <tr><td class="center">09</td><td>SIN-1046</td><td class="bold">Wang Zhen</td><td>Ajusteur Mécanique</td><td>CACES PEMP / Hauteur</td><td class="center bold" style="color: #15803d;">✓ Émargé</td></tr>
                <tr><td class="center">10</td><td>SIN-1048</td><td class="bold">Zhang Jiale</td><td>Ajusteur Mécanique</td><td>CACES PEMP / Hauteur</td><td class="center bold" style="color: #15803d;">✓ Émargé</td></tr>
                <tr><td class="center">11</td><td>SIN-1050</td><td class="bold">Qin Chenggang</td><td>Ajusteur Mécanique</td><td>CACES PEMP / Hauteur</td><td class="center bold" style="color: #15803d;">✓ Émargé</td></tr>
                <tr><td class="center">12</td><td>SIN-1054</td><td class="bold">Xiong Guangming</td><td>Soudeur Manuel ARO</td><td>Chaud / Soudure</td><td class="center bold" style="color: #15803d;">✓ Émargé</td></tr>
                <tr><td class="center">13</td><td>SIN-1056</td><td class="bold">Li Jiangang</td><td>Soudeur Manuel ARO</td><td>Chaud / Soudure</td><td class="center bold" style="color: #15803d;">✓ Émargé</td></tr>
                <tr><td class="center">14</td><td>SIN-1060</td><td class="bold">Xu Yanming</td><td>Électricien Câbleur</td><td>BR / BC / LOTO</td><td class="center bold" style="color: #15803d;">✓ Émargé</td></tr>
                <tr><td class="center">15</td><td>SIN-1062</td><td class="bold">Chen Wei</td><td>Électricien Câbleur</td><td>BR / BC / LOTO</td><td class="center bold" style="color: #15803d;">✓ Émargé</td></tr>
                <tr style="background: #f8fafc;"><td class="center">--</td><td>SIN-SEQ</td><td class="bold">... 44 autres monteurs habilités</td><td>Monteurs & Techniciens</td><td>Certifiés VGP / EPI</td><td class="center bold" style="color: #15803d;">✓ Émargés</td></tr>
            </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: center; border: 1px solid #000; padding: 6px 12px; margin-top: 8px; background: #fafafa; font-size: 8px;">
            <div>
                <strong>Superviseur HSE Sinylon :</strong> Nouri Chahrour<br>
                Signature : ..............................................
            </div>
            <div>
                <strong>Responsable Exécution :</strong> Xie Xian<br>
                Signature : ..............................................
            </div>
            <div>
                <strong>Pointage Toolbox :</strong> Lundi {d_deb} à 08h00<br>
                <span style="color: #15803d; font-weight: 800;">VISA GÉNÉRAL : 59/59 PRÉSENTS</span>
            </div>
        </div>
    </div>

    <div class="footer-note">
        <div>PERMIS SINYLON K9 — SEMAINE 38 — {p_id}</div>
        <div>PAGE 5/5 : REGISTRE D'ÉMARGEMENT GÉNÉRAL</div>
        <div>AFFICHAGE OBLIGATOIRE SUR SITE · CAUSERIE 08H00</div>
    </div>
</div>

</body>
</html>
"""

def generate_poster_pdf(cfg, qr_temp, output_pdf):
    doc = SimpleDocTemplate(output_pdf, pagesize=A4, leftMargin=20, rightMargin=20, topMargin=20, bottomMargin=20)
    story = []
    
    p_id = cfg["permit_id"]
    z_code = cfg["zone_code"]
    z_title = cfg["zone_title"]
    d_deb = cfg["date_deb"]
    d_fin = cfg["date_fin"]
    horaires = cfg["horaires"]
    qr_url = f"https://permis-sinylon.onrender.com/?permitId={p_id}"

    story.append(Paragraph("<b>PERMIS GÉNÉRAL DE TRAVAIL & REVALIDATION</b>", ParagraphStyle('PT1', fontName='Helvetica-Bold', fontSize=21, leading=25, alignment=1)))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>STELLANTIS ALGERIA K9 CKD0 — SINYLON</b>", ParagraphStyle('PT2', fontName='Helvetica-Bold', fontSize=13, leading=16, alignment=1, textColor=colors.HexColor('#1e3a8a'))))
    story.append(Spacer(1, 4))
    story.append(Paragraph(f"<b>{z_title}</b>", ParagraphStyle('PT2b', fontName='Helvetica-Bold', fontSize=10.5, leading=14, alignment=1, textColor=colors.HexColor(cfg["badge_color"]))))
    story.append(Spacer(1, 8))
    story.append(Paragraph(f"<b>🟢 PERMIS VALIDE & REVALIDÉ — VALIDITÉ : DU {d_deb} AU {d_fin}</b>", ParagraphStyle('PT3', fontName='Helvetica-Bold', fontSize=11.5, leading=15, alignment=1, textColor=colors.HexColor('#15803d'))))
    story.append(Spacer(1, 14))

    story.append(RLImage(qr_temp, width=220, height=220))
    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>📱 SCANNEZ CE QR CODE AVEC UN SMARTPHONE OU TABLETTE</b>", ParagraphStyle('PT4', fontName='Helvetica-Bold', fontSize=12, leading=15, alignment=1)))
    story.append(Paragraph(f"<i>{qr_url}</i>", ParagraphStyle('PT5', fontName='Helvetica', fontSize=9, leading=12, alignment=1, textColor=colors.HexColor('#475569'))))
    story.append(Spacer(1, 14))

    p_box_l = Paragraph(
        f"<b>Permis N° :</b> {p_id}<br/>"
        f"<b>Entreprise :</b> SINYLON & W.P.E.E.X<br/>"
        f"<b>Zone Autorisée :</b> {z_title}<br/>"
        f"<b>Période Semaine 38 :</b> Du {d_deb} Au {d_fin}<br/>"
        f"<b>Horaires Chantier :</b> {horaires}",
        ParagraphStyle('PTBoxL', fontName='Helvetica', fontSize=8.5, leading=13)
    )
    p_box_r = Paragraph(
        f"<b>📅 POINTAGE QUOTIDIEN :</b> <font color='#15803d'><b>08H00</b></font><br/>"
        f"<b>Ingénieur Suivi :</b> M. W.P.E.E.X (Stellantis)<br/>"
        f"<b>Chef de Projet :</b> Xie Xian (Sinylon)<br/>"
        f"<b>Superviseur HSE :</b> Nouri Chahrour (0563765157)<br/>"
        f"<b>Effectif Déclaré :</b> 59 Intervenants Habilités",
        ParagraphStyle('PTBoxR', fontName='Helvetica', fontSize=8.5, leading=13)
    )

    p_box = [
        [f"INFORMATIONS OFFICIELLES — SEMAINE 38 ({z_code})", "SURVEILLANCE HSE & VISAS (08H00)"],
        [p_box_l, p_box_r]
    ]
    t_box = Table(p_box, colWidths=[275, 275])
    t_box.setStyle(TableStyle([
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
    story.append(t_box)
    story.append(Spacer(1, 12))
    story.append(Paragraph(f"<font size=7.5 color='#64748b'>Permis officiel affiché obligatoirement à l'entrée de la Zone {z_code} · Revalidation physique ou électronique chaque matin à 08h00</font>", ParagraphStyle('PF', fontName='Helvetica', alignment=1)))

    doc.build(story)

def generate_dossier_pdf(cfg, qr_temp, output_pdf):
    doc = SimpleDocTemplate(output_pdf, pagesize=A4, leftMargin=18, rightMargin=18, topMargin=15, bottomMargin=15)
    story = []

    p_id = cfg["permit_id"]
    z_code = cfg["zone_code"]
    z_title = cfg["zone_title"]
    d_deb = cfg["date_deb"]
    d_fin = cfg["date_fin"]
    horaires = cfg["horaires"]
    desc = cfg["work_desc_fr"]
    tasks = cfg["tasks"]
    equip = cfg["equipements"]
    ouvrage = cfg["ouvrage"]
    secteur = cfg["secteur"]

    styles = getSampleStyleSheet()
    t_foot = Table([
        [f"PERMIS SINYLON K9 — SEMAINE 38 — {p_id}", "STELLANTIS ALGERIA K9 CKD0", f"VALIDITÉ : {d_deb} AU {d_fin}"]
    ], colWidths=[200, 180, 180])
    t_foot.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 6.5),
        ('TEXTCOLOR', (0,0), (-1,-1), colors.HexColor('#64748b')),
        ('ALIGN', (0,0), (0,-1), 'LEFT'),
        ('ALIGN', (1,0), (1,-1), 'CENTER'),
        ('ALIGN', (2,0), (2,-1), 'RIGHT'),
        ('LINEABOVE', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 2),
    ]))

    # --- PAGE 1 ---
    story.append(Paragraph(f"<b>PERMIS GÉNÉRAL DE TRAVAIL — SEMAINE 38 ({z_code})</b>", ParagraphStyle('P1T', fontName='Helvetica-Bold', fontSize=12, alignment=1)))
    story.append(Paragraph(f"<b>STELLANTIS TAFRAOUI — ATELIER MONTAGE K9 CKD0 · {p_id}</b>", ParagraphStyle('P1Sub', fontName='Helvetica-Bold', fontSize=8.5, alignment=1, textColor=colors.HexColor('#1e3a8a'))))
    story.append(Spacer(1, 4))

    banner_data = [[f"📍 {z_title}", f"Du {d_deb} Au {d_fin} · {horaires}"]]
    t_b = Table(banner_data, colWidths=[360, 200])
    t_b.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#e0f2fe')),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('TEXTCOLOR', (0,0), (-1,-1), colors.HexColor('#0369a1')),
        ('ALIGN', (1,0), (1,-1), 'RIGHT'),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#0284c7')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_b)
    story.append(Spacer(1, 4))

    sec1_data = [
        ["1. IDENTIFICATION DU CHANTIER & INTERVENANTS", "", "", ""],
        ["Entreprise Intervenante :", "SINYLON & W.P.E.E.X", "Permis ID :", p_id],
        ["Ouvrage / Ligne :", ouvrage, "Zone / Secteur :", secteur],
        ["Responsable Sinylon :", "Xie Xian (Chef de Projet)", "Contact HSE :", "Nouri Chahrour (0563765157)"],
        ["Ingénieur Suivi Client :", "M. W.P.E.E.X (Stellantis)", "Effectif Habilité :", "59 Travailleurs Déclarés"]
    ]
    t_sec1 = Table(sec1_data, colWidths=[120, 160, 110, 170])
    t_sec1.setStyle(TableStyle([
        ('SPAN', (0,0), (-1,0)),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7.5),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 7),
        ('FONTNAME', (0,1), (0,-1), 'Helvetica-Bold'),
        ('FONTNAME', (2,1), (2,-1), 'Helvetica-Bold'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_sec1)
    story.append(Spacer(1, 4))

    task_str = " · ".join(tasks)
    sec2_data = [
        ["2. NATURE DES TRAVAUX & ÉQUIPEMENTS AUTORISÉS", ""],
        ["Description :", desc],
        ["Tâches Clés :", task_str],
        ["Équipements :", equip]
    ]
    t_sec2 = Table(sec2_data, colWidths=[90, 470])
    t_sec2.setStyle(TableStyle([
        ('SPAN', (0,0), (-1,0)),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7.5),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 7),
        ('FONTNAME', (0,1), (0,-1), 'Helvetica-Bold'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_sec2)
    story.append(Spacer(1, 4))

    sec3_data = [
        ["3. ANALYSES DES RISQUES & MESURES DE PRÉVENTION HSE STELLANTIS", "", ""],
        ["Risque Identifié", "Mesures de Prévention Obligatoires", "Statut"],
        ["Chute de Hauteur (> 2m)", "Nacelles conformes, harnais double longe accroché, balisage sol.", "OUI - VGP OK"],
        ["Électrique / Énergies", "Consignation LOTO, cadenas individuel rouge, VAT avant intervention.", "OUI - LOTO ACTIF"],
        ["Travaux à Chaud / Éclats", "Bâches ignifugées, écran pare-étincelles, extincteur 6kg à moins de 5m.", "OUI - CONFORME"],
        ["Coactivité & Circulation", "Balisage chaîne rouge/blanche, interdiction d'accès aux non-habilités.", "OUI - BALISÉ"]
    ]
    t_sec3 = Table(sec3_data, colWidths=[130, 340, 90])
    t_sec3.setStyle(TableStyle([
        ('SPAN', (0,0), (-1,0)),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7.5),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#f1f5f9')),
        ('FONTNAME', (0,1), (-1,1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,1), (-1,1), 7),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('FONTNAME', (0,2), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,2), (-1,-1), 6.5),
        ('ALIGN', (2,1), (2,-1), 'CENTER'),
        ('TEXTCOLOR', (2,2), (2,-1), colors.HexColor('#15803d')),
        ('FONTNAME', (2,2), (2,-1), 'Helvetica-Bold'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_sec3)
    story.append(Spacer(1, 4))

    sec4_data = [
        ["4. VISAS D'AUTORISATION INITIALE (LUNDI 14/09/2026 - 08H00)", "", "", ""],
        ["1. RESPONSABLE TRAVAUX\nXie Xian (Chef Sinylon)\n\nSignature : ........................",
         "2. SUPERVISEUR HSE\nNouri Chahrour (Sinylon)\n\nSignature : ........................",
         "3. CHEF D'ÉQUIPE EXÉCUTION\nZhou Lin (Sinylon)\n\nSignature : ........................",
         "4. INGÉNIEUR SUIVI CLIENT\nM. W.P.E.E.X (Stellantis)\n\nVisa : BON POUR ACCORD"]
    ]
    t_sec4 = Table(sec4_data, colWidths=[140, 140, 140, 140])
    t_sec4.setStyle(TableStyle([
        ('SPAN', (0,0), (-1,0)),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7.5),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('FONTNAME', (0,1), (-1,1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,1), (-1,1), 6.5),
        ('BACKGROUND', (3,1), (3,1), colors.HexColor('#eff6ff')),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,1), (-1,1), 6),
    ]))
    story.append(t_sec4)
    story.append(Spacer(1, 4))
    story.append(t_foot)

    # --- PAGE 2 : REVALIDATION ---
    story.append(PageBreak())
    story.append(Paragraph(f"<b>REVALIDATION QUOTIDIENNE DU PERMIS (SEMAINE 38)</b>", ParagraphStyle('P2T', fontName='Helvetica-Bold', fontSize=12, alignment=1)))
    story.append(Paragraph(f"<b>ÉMARGEMENT MATINAL (08H00) & CONTINUITÉ DE SÉCURITÉ · {p_id}</b>", ParagraphStyle('P2Sub', fontName='Helvetica-Bold', fontSize=8.5, alignment=1, textColor=colors.HexColor('#1e3a8a'))))
    story.append(Spacer(1, 4))

    alert_box = [[Paragraph("⚠️ <b>RÈGLE D'OR CHANTIER :</b> Aucune intervention ne peut débuter sans la signature conjointe de M. W.P.E.E.X (Ingénieur Suivi) et du Responsable Sinylon constatant le maintien strict des conditions de sécurité définies au permis initial.", ParagraphStyle('ABox', fontName='Helvetica', fontSize=7.5, leading=10))]]
    t_alert = Table(alert_box, colWidths=[560])
    t_alert.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fef08a')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#eab308')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_alert)
    story.append(Spacer(1, 4))

    reval_headers = ["Jour & Date", "Heure", "Mesures HSE Vérifiées", "Visa M. W.P.E.E.X (Ing. Suivi)", "Visa Xie Xian (Chef Sinylon)"]
    reval_rows = [
        reval_headers,
        ["Jour 1 (Lun)\n14/09/2026", "08:00", "Balisage OK, EPI complets, Nacelles contrôlées, Toolbox tenue.", "Signature : ...................................\nM. W.P.E.E.X", "Signature : ...................................\nXie Xian"],
        ["Jour 2 (Mar)\n15/09/2026", "08:00", "Conditions inchangées, vérification harnais et potences.", "Signature : ...................................\nM. W.P.E.E.X", "Signature : ...................................\nXie Xian"],
        ["Jour 3 (Mer)\n16/09/2026", "08:00", "Contrôle coactivité, lignes de vie et câblage armoires.", "Signature : ...................................\nM. W.P.E.E.X", "Signature : ...................................\nXie Xian"],
        ["Jour 4 (Jeu)\n17/09/2026", "08:00", "Maintien balisage, inspection extincteurs, consignation.", "Signature : ...................................\nM. W.P.E.E.X", "Signature : ...................................\nXie Xian"],
        ["Jour 5 (Ven)\n18/09/2026", "08:00", "Caisse Week-end : Coupure courant, LOTO TGBT, nacelles.", "Signature : ...................................\nM. W.P.E.E.X", "Signature : ...................................\nXie Xian"],
        ["Jour 6 (Sam)\n19/09/2026", "08:00", "Caisse Week-end : Alignement structures et mise en service.", "Signature : ...................................\nM. W.P.E.E.X", "Signature : ...................................\nXie Xian"],
        ["Jour 7 (Dim)\n20/09/2026", "08:00", "Clôture de semaine, nettoyage chantier, repli outillages 5S.", "Signature : ...................................\nM. W.P.E.E.X", "Signature : ...................................\nXie Xian"]
    ]
    t_reval = Table(reval_rows, colWidths=[65, 35, 180, 140, 140])
    t_reval.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7),
        ('ALIGN', (0,0), (1,-1), 'CENTER'),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 6.5),
        ('FONTNAME', (0,1), (0,-1), 'Helvetica-Bold'),
        ('BACKGROUND', (0,5), (-1,6), colors.HexColor('#fffbeb')),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_reval)
    story.append(Spacer(1, 4))

    cloture_data = [
        ["CONTRÔLE DES CONDITIONS DE FIN D'INTERVENTION (CLÔTURE DU PERMIS)", ""],
        ["Chantier nettoyé, déchets métalliques évacués et rangés (5S) :", "[ X ] CONFORME"],
        ["Consignations électriques retirées, alimentations rétablies sous accord :", "[ X ] CONFORME"],
        ["Matériel de levage et nacelles stationnés en position repliée sécurisée :", "[ X ] CONFORME"]
    ]
    t_cloture = Table(cloture_data, colWidths=[420, 140])
    t_cloture.setStyle(TableStyle([
        ('SPAN', (0,0), (-1,0)),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 6.5),
        ('ALIGN', (1,1), (1,-1), 'CENTER'),
        ('TEXTCOLOR', (1,1), (1,-1), colors.HexColor('#15803d')),
        ('FONTNAME', (1,1), (1,-1), 'Helvetica-Bold'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_cloture)
    story.append(Spacer(1, 4))
    story.append(t_foot)

    # --- PAGE 3 : HAUTEUR ---
    story.append(PageBreak())
    story.append(Paragraph(f"<b>ANNEXE A — AUTORISATION DE TRAVAIL EN HAUTEUR ({z_code})</b>", ParagraphStyle('P3T', fontName='Helvetica-Bold', fontSize=12, alignment=1)))
    story.append(Paragraph(f"<b>PEMP / NACELLES CISEAUX & ÉCHAFAUDAGES ROULANTS · {p_id}</b>", ParagraphStyle('P3Sub', fontName='Helvetica-Bold', fontSize=8.5, alignment=1, textColor=colors.HexColor('#1e3a8a'))))
    story.append(Spacer(1, 6))

    h_data1 = [
        ["1. ÉQUIPEMENTS DE TRAVAIL EN HAUTEUR AUTORISÉS", ""],
        ["Équipements Déclarés :", "2 Nacelles Ciseaux Électriques (PEMP 3A/3B) + Échafaudages roulants certifiés EN 1004"],
        ["Hauteur Maximale :", "6,50 mètres au-dessus du sol fini de l'atelier de montage"],
        ["Contrôle VGP :", "Certificats VGP en cours de validité (Bureau Veritas / CTC) vérifiés à l'entrée site"]
    ]
    t_h1 = Table(h_data1, colWidths=[130, 430])
    t_h1.setStyle(TableStyle([
        ('SPAN', (0,0), (-1,0)),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7.5),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 7),
        ('FONTNAME', (0,1), (0,-1), 'Helvetica-Bold'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_h1)
    story.append(Spacer(1, 6))

    h_data2 = [
        ["2. CHECKLIST DES MESURES DE SÉCURITÉ EN HAUTEUR", ""],
        ["Point de Contrôle HSE Obligatoire", "Statut"],
        ["Sol plan, propre, sans fosses ni dénivellations non comblées", "OUI - VÉRIFIÉ"],
        ["Port du harnais antichute avec double longe accroché au point certifié", "OUI - OBLIGATOIRE"],
        ["Périmètre de sécurité matérialisé au sol sous la nacelle (interdiction de passage)", "OUI - BALISÉ"],
        ["Interdiction formelle de monter sur les garde-corps ou d'utiliser des escabeaux", "OUI - STRICT"],
        ["Opérateurs formés CACES R486 / PEMP et aptitudes médicales à jour", "OUI - 59 HABILITÉS"]
    ]
    t_h2 = Table(h_data2, colWidths=[420, 140])
    t_h2.setStyle(TableStyle([
        ('SPAN', (0,0), (-1,0)),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7.5),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#f1f5f9')),
        ('FONTNAME', (0,1), (-1,1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,1), (-1,1), 7),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('FONTNAME', (0,2), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,2), (-1,-1), 6.5),
        ('ALIGN', (1,1), (1,-1), 'CENTER'),
        ('TEXTCOLOR', (1,2), (1,-1), colors.HexColor('#15803d')),
        ('FONTNAME', (1,2), (1,-1), 'Helvetica-Bold'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_h2)
    story.append(Spacer(1, 6))

    h_sig = [
        ["CONDUCTEUR PEMP / NACELLE\nConducteurs CACES Sinylon\n\nSignature : ........................",
         "SUPERVISEUR HSE\nNouri Chahrour (Sinylon)\n\nSignature : ........................",
         "INGÉNIEUR SUIVI STELLANTIS\nM. W.P.E.E.X (Stellantis)\n\nVisa : ACCORD HAUTEUR VALIDÉ"]
    ]
    t_hsig = Table(h_sig, colWidths=[186, 187, 187])
    t_hsig.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 7),
        ('BACKGROUND', (2,0), (2,0), colors.HexColor('#eff6ff')),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_hsig)
    story.append(Spacer(1, 8))
    story.append(t_foot)

    # --- PAGE 4 : CHAUD & LOTO ---
    story.append(PageBreak())
    story.append(Paragraph(f"<b>ANNEXES B & C — TRAVAUX À CHAUD & CONSIGNATION LOTO ({z_code})</b>", ParagraphStyle('P4T', fontName='Helvetica-Bold', fontSize=12, alignment=1)))
    story.append(Paragraph(f"<b>SOUDAGE, MEULAGE & CONDAMNATION ÉNERGÉTIQUE · {p_id}</b>", ParagraphStyle('P4Sub', fontName='Helvetica-Bold', fontSize=8.5, alignment=1, textColor=colors.HexColor('#1e3a8a'))))
    story.append(Spacer(1, 6))

    bc_data = [
        ["ANNEXE B : TRAVAUX À CHAUD (SOUDAGE, MEULAGE, CHALUMEAU)", ""],
        ["Équipements :", "Postes de soudage ARO / MIG-MAG, Meuleuses angulaires avec carter, Clés pneumatiques"],
        ["Protection Incendie :", "Extincteur CO2 / Poudre 6kg vérifié présent à moins de 5m de la zone de travail"],
        ["Écrans Thermiques :", "Bâches ignifugées déployées pour confiner 100% des étincelles de meulage"],
        ["Surveillance :", "Ronde de surveillance obligatoire de 2 heures après la fin des opérations à chaud"],
        ["ANNEXE C : CONSIGNATION ÉLECTRIQUE & ÉNERGIES (LOTO)", ""],
        ["Installation :", "Armoires électriques TGBT, Coffrets contrôleurs de soudage, Réseau air comprimé"],
        ["Procédure LOTO :", "1. Séparation · 2. Condamnation par cadenas rouge · 3. Dissipation · 4. V.A.T."],
        ["Chargé Consignation :", "Nouri Chahrour (HSE Sinylon) & Électriciens habilités BR / BC"],
        ["Coupure Énergie :", "Vendredi 18/09 (08:00 - 12:00) : Coupure générale d'énergie et consignation TGBT" if cfg["is_weekend"] else "Consignation ponctuelle selon phasage chantier et accord Stellantis"]
    ]
    t_bc = Table(bc_data, colWidths=[130, 430])
    t_bc.setStyle(TableStyle([
        ('SPAN', (0,0), (-1,0)),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7.5),
        ('SPAN', (0,5), (-1,5)),
        ('BACKGROUND', (0,5), (-1,5), colors.HexColor('#ffeb3b')),
        ('FONTNAME', (0,5), (-1,5), 'Helvetica-Bold'),
        ('FONTSIZE', (0,5), (-1,5), 7.5),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 7),
        ('FONTNAME', (0,1), (0,-1), 'Helvetica-Bold'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_bc)
    story.append(Spacer(1, 6))

    bc_sig = [
        ["RESPONSABLE CHAUD / SOUDAGE\nZhou Lin (Chef Sinylon)\n\nSignature : ........................",
         "CHARGÉ DE CONSIGNATION HSE\nNouri Chahrour (HSE Sinylon)\n\nSignature : ........................",
         "INGÉNIEUR SUIVI STELLANTIS\nM. W.P.E.E.X (Stellantis)\n\nVisa : ACCORD LOTO/CHAUD VALIDÉ"]
    ]
    t_bcsig = Table(bc_sig, colWidths=[186, 187, 187])
    t_bcsig.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 7),
        ('BACKGROUND', (2,0), (2,0), colors.HexColor('#eff6ff')),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_bcsig)
    story.append(Spacer(1, 8))
    story.append(t_foot)

    # --- PAGE 5 : ÉMARGEMENT (59 INTERVENANTS) ---
    story.append(PageBreak())
    story.append(Paragraph(f"<b>REGISTRE D'ÉMARGEMENT DU PERSONNEL HABILITÉ — SEMAINE 38 ({z_code})</b>", ParagraphStyle('P5T', fontName='Helvetica-Bold', fontSize=11.5, alignment=1)))
    story.append(Paragraph(f"<b>TOTAL 59 INTERVENANTS DÉCLARÉS SINYLON & W.P.E.E.X · {p_id}</b>", ParagraphStyle('P5Sub', fontName='Helvetica-Bold', fontSize=8, alignment=1, textColor=colors.HexColor('#1e3a8a'))))
    story.append(Spacer(1, 4))

    workers_data = [
        ["N°", "Matricule", "Nom & Prénom", "Fonction / Métier", "Habilitation", "Émargement (08h00)"],
        ["01", "SIN-0001", "Xie Xian", "Chef de Projet", "Superviseur Général", "✓ Émargé 08h00"],
        ["02", "SIN-0002", "Nouri Chahrour", "Superviseur HSE", "HSE / SST / LOTO", "✓ Émargé 08h00"],
        ["03", "SIN-0003", "Zhou Lin", "Chef d'Équipe Exécution", "Hauteur / Soudage", "✓ Émargé 08h00"],
        ["04", "SIN-0032", "Shi Junming", "Automatisme PLC", "B2V / Électrique", "✓ Émargé 08h00"],
        ["05", "SIN-0036", "Wang Lei", "Ingénieur Conception", "Conformité Ligne", "✓ Émargé 08h00"],
        ["06", "SIN-1040", "Sun Xuekui", "Ajusteur Mécanique", "CACES PEMP / Hauteur", "✓ Émargé 08h00"],
        ["07", "SIN-1042", "Yuan Bo", "Ajusteur Mécanique", "CACES PEMP / Hauteur", "✓ Émargé 08h00"],
        ["08", "SIN-1044", "Zhou Kaixuan", "Ajusteur Mécanique", "CACES PEMP / Hauteur", "✓ Émargé 08h00"],
        ["09", "SIN-1046", "Wang Zhen", "Ajusteur Mécanique", "CACES PEMP / Hauteur", "✓ Émargé 08h00"],
        ["10", "SIN-1048", "Zhang Jiale", "Ajusteur Mécanique", "CACES PEMP / Hauteur", "✓ Émargé 08h00"],
        ["11", "SIN-1050", "Qin Chenggang", "Ajusteur Mécanique", "CACES PEMP / Hauteur", "✓ Émargé 08h00"],
        ["12", "SIN-1054", "Xiong Guangming", "Soudeur Manuel", "Chaud / Soudure ARO", "✓ Émargé 08h00"],
        ["13", "SIN-1056", "Li Jiangang", "Soudeur Manuel", "Chaud / Soudure ARO", "✓ Émargé 08h00"],
        ["14", "SIN-1060", "Xu Yanming", "Électricien Câbleur", "BR / BC / LOTO", "✓ Émargé 08h00"],
        ["15", "SIN-1062", "Chen Wei", "Électricien Câbleur", "BR / BC / LOTO", "✓ Émargé 08h00"],
        ["--", "SIN-SEQ", "... 44 autres intervenants", "Habilités Sinylon", "Certifiés VGP/EPI", "✓ Émargé 08h00"]
    ]
    t_workers = Table(workers_data, colWidths=[24, 65, 140, 130, 115, 86])
    t_workers.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 6.5),
        ('ALIGN', (0,0), (0,-1), 'CENTER'),
        ('ALIGN', (1,0), (1,-1), 'CENTER'),
        ('ALIGN', (5,0), (5,-1), 'CENTER'),
        ('TEXTCOLOR', (5,1), (5,-1), colors.HexColor('#15803d')),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_workers)
    story.append(Spacer(1, 6))

    w_sig = [
        ["SUPERVISEUR HSE SINYLON\nNouri Chahrour\n\nSignature : ........................",
         "RESPONSABLE EXÉCUTION\nXie Xian\n\nSignature : ........................",
         f"POINTAGE SEMAINE 38\nLundi {d_deb} à 08h00\n\nVisa : 59/59 PRÉSENTS"]
    ]
    t_wsig = Table(w_sig, colWidths=[186, 187, 187])
    t_wsig.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 7),
        ('BACKGROUND', (2,0), (2,0), colors.HexColor('#f8fafc')),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_wsig)
    story.append(Spacer(1, 8))
    story.append(t_foot)

    doc.build(story)

# =============================================================================
# EXÉCUTION POUR LES 4 ZONES (UB, UAR, FUSA, WE)
# =============================================================================
for cfg in ZONES_CONFIG:
    z_code = cfg["zone_code"]
    p_id = cfg["permit_id"]
    print(f"\n🚀 Génération Pack Semaine 38 pour {p_id} ({z_code})...")

    qr_url = f"https://permis-sinylon.onrender.com/?permitId={p_id}"
    qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=10, border=1)
    qr.add_data(qr_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    qr_b64 = base64.b64encode(buf.getvalue()).decode()

    qr_temp = f"/tmp/qr_w38_{z_code.lower()}_temp.png"
    img.save(qr_temp)

    # 1. Affiche HTML & PDF
    poster_html = generate_poster_html(cfg, qr_b64, qr_url)
    poster_html_path = os.path.join(desktop_folder, f"AFFICHE_A4_QR_CODE_PERMIS_SINYLON_W38_{z_code}.html")
    with open(poster_html_path, "w", encoding="utf-8") as f:
        f.write(poster_html)

    poster_pdf_path = os.path.join(desktop_folder, f"AFFICHE_A4_QR_CODE_PERMIS_SINYLON_W38_{z_code}.pdf")
    generate_poster_pdf(cfg, qr_temp, poster_pdf_path)
    print(f"  ✅ Affiche A4 QR Code -> {poster_pdf_path}")

    # 2. Dossier Officiel 5 Pages HTML & PDF
    dossier_html = generate_dossier_html(cfg, qr_b64)
    dossier_html_path = os.path.join(desktop_folder, f"DOSSIER_PERMIS_SINYLON_W38_{z_code}_OFFICIEL.html")
    with open(dossier_html_path, "w", encoding="utf-8") as f:
        f.write(dossier_html)

    dossier_pdf_path = os.path.join(desktop_folder, f"DOSSIER_PERMIS_SINYLON_W38_{z_code}_OFFICIEL.pdf")
    generate_dossier_pdf(cfg, qr_temp, dossier_pdf_path)
    print(f"  ✅ Dossier Officiel (5 Pages A4) -> {dossier_pdf_path}")

print("\n🎉 TOUS LES PERMIS ET AFFICHES W38 (UB, UAR, FUSA, WE) ONT ÉTÉ GÉNÉRÉS SUR LE BUREAU !")
