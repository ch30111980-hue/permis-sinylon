#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Générateur Officiel Semaine 38 (du 14/09/2026 au 20/09/2026) — Zone UB (Soubassement Central)
Permis K9-W38-UB — Sinylon Stellantis K9 CKD0
Création de :
1. AFFICHE_A4_QR_CODE_PERMIS_SINYLON_W38_UB.html & .pdf
2. DOSSIER_PERMIS_SINYLON_W38_UB_OFFICIEL.html & .pdf (5 Pages A4 complètes)
Destination : /Users/nourine/Desktop/PERMIS_SINYLON_SEMAINE_38
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

desktop_folder = "/Users/nourine/Desktop/PERMIS_SINYLON_SEMAINE_38"
os.makedirs(desktop_folder, exist_ok=True)

permit_id = "K9-W38-UB"
date_deb = "2026-09-14"
date_fin = "2026-09-20"
date_today = "2026-09-14" # Lundi 14 Septembre 2026 (08h00)

work_desc_fr = "Essais de sécurité, tests de conformité et certification; Vérification de conformité de l'installation FEE/REE; Jalon Industriel X0 et conformité ligne."
work_desc_en = "Safety certification and compliance validation tests; FEE/REE installation compliance checklist verification; Industrial Milestone X0 and line buyoff."
work_desc_zh = "安全认证及综合测试; FEE/REE安装检查清单验证; 工业化里程碑 X0"

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

qr_temp = "/tmp/qr_w38_ub_temp.png"
img.save(qr_temp)

# =============================================================================
# 1. GÉNÉRATION DE L'AFFICHE A4 QR CODE HAUTE VISIBILITÉ (MUR CHANTIER)
# =============================================================================
html_poster = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>AFFICHE A4 QR CODE PERMIS SINYLON W38-UB - STELLANTIS</title>
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
    background: #f1f5f9;
}}
.poster-page {{
    width: 210mm;
    height: 297mm;
    margin: 0 auto;
    padding: 10mm 14mm 8mm 14mm;
    background: #fff;
    border: 5px solid #000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
}}
@media print {{
    body {{ background: #fff; }}
    .poster-page {{
        border: 5px solid #000;
        margin: 0;
        width: 210mm;
        height: 297mm;
    }}
}}
</style>
</head>
<body>

<div class="poster-page">
    <!-- En-tête Logos et Titre -->
    <div>
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #000;padding-bottom:8px;">
            <div style="display:flex;align-items:center;gap:12px;">
                <span style="background:#000;color:#fff;font-weight:900;font-size:24px;padding:4px 14px;border-radius:4px;letter-spacing:1px;">SINYLON</span>
                <span style="border:2px solid #000;color:#000;font-weight:900;font-size:24px;padding:3px 14px;border-radius:4px;letter-spacing:1px;">STELLANTIS</span>
            </div>
            <div style="text-align:right;">
                <div style="font-size:12px;font-weight:bold;color:#64748b;">USINE ALGERIA K9 CKD0</div>
                <div style="font-size:14px;font-weight:900;color:#1e3a8a;">ATELIER MONTAGE & ASSEMBLAGE</div>
            </div>
        </div>

        <div style="text-align:center;margin-top:12px;">
            <div style="font-size:24px;font-weight:900;letter-spacing:0.5px;color:#000;text-transform:uppercase;">
                PERMIS GÉNÉRAL DE TRAVAIL & REVALIDATION
            </div>
            <div style="font-size:15px;font-weight:bold;color:#1e3a8a;margin-top:2px;">
                SEMAINE 38 · DU 14/09/2026 AU 20/09/2026
            </div>
            <div style="display:inline-block;background:#2563eb;color:#fff;font-size:14px;font-weight:900;padding:4px 16px;border-radius:6px;margin-top:6px;letter-spacing:0.5px;">
                ZONE UB — UNDERBODY (SOUBASSEMENT CENTRAL)
            </div>
        </div>
    </div>

    <!-- Badge Statut & Revalidation Matinale -->
    <div style="background:#f0fdf4;border:2.5px solid #16a34a;border-radius:10px;padding:10px 14px;text-align:center;">
        <div style="font-size:15px;font-weight:900;color:#15803d;display:flex;align-items:center;justify-content:center;gap:8px;">
            <span style="font-size:20px;">🟢</span> PERMIS VALIDE & REVALIDÉ CHAQUE MATIN À 08H00
        </div>
        <div style="font-size:11px;color:#166534;font-weight:700;margin-top:2px;">
            Pointage officiel obligatoire sur site par l'Ingénieur de Suivi M. W.P.E.E.X et le Chef de Projet Xie Xian
        </div>
    </div>

    <!-- Cœur : Gros QR Code Haute Visibilité -->
    <div style="text-align:center;background:#f8fafc;border:2.5px solid #000;border-radius:14px;padding:16px 12px;box-shadow:inset 0 2px 6px rgba(0,0,0,0.05);">
        <div style="font-size:13px;font-weight:900;color:#0f172a;letter-spacing:0.5px;margin-bottom:10px;text-transform:uppercase;">
            📱 Scannez ce QR Code avec un Smartphone ou une Tablette
        </div>
        
        <div style="display:inline-block;background:#fff;padding:10px;border:3px solid #000;border-radius:12px;box-shadow:0 8px 20px rgba(0,0,0,0.15);">
            <img src="data:image/png;base64,{qr_base64}" style="width:230px;height:230px;display:block;" alt="QR Code Permis K9-W38-UB">
        </div>

        <div style="font-family:monospace;font-size:10px;color:#1e3a8a;font-weight:bold;margin-top:8px;">
            {qr_url}
        </div>
        <div style="font-size:11px;font-weight:800;color:#15803d;margin-top:6px;">
            ✍️ Émargement électronique en direct · Visa journalier au doigt/stylet · Consultation des 5 Permis A4
        </div>
    </div>

    <!-- Tableaux d'informations du chantier & Horodatage -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div style="border:2px solid #000;border-radius:8px;overflow:hidden;">
            <div style="background:#ffeb3b;color:#000;font-weight:900;font-size:10px;padding:5px 8px;text-align:center;border-bottom:1.5px solid #000;text-transform:uppercase;">
                Informations du Chantier — Semaine 38
            </div>
            <div style="padding:8px 10px;font-size:9.5px;line-height:1.45;color:#0f172a;background:#fff;">
                <div><strong>Permis N° :</strong> <span style="font-family:monospace;color:#1e3a8a;font-weight:900;">{permit_id}</span></div>
                <div><strong>Entreprise :</strong> SINYLON & W.P.E.E.X</div>
                <div><strong>Zone Active :</strong> Zone UB — Soubassement Central</div>
                <div><strong>Période :</strong> Du {date_deb} Au {date_fin}</div>
                <div><strong>Horaires :</strong> 08h00 - 17h30 (Chantier Actif)</div>
                <div><strong>Travaux :</strong> Certification, Essais FEE/REE, Jalon X0</div>
            </div>
        </div>

        <div style="border:2px solid #000;border-radius:8px;overflow:hidden;">
            <div style="background:#ffeb3b;color:#000;font-weight:900;font-size:10px;padding:5px 8px;text-align:center;border-bottom:1.5px solid #000;text-transform:uppercase;">
                Responsables & Signataires Officiels
            </div>
            <div style="padding:8px 10px;font-size:9.5px;line-height:1.45;color:#0f172a;background:#fff;">
                <div><strong>Ingénieur Suivi :</strong> M. W.P.E.E.X (Stellantis / Sinylon)</div>
                <div><strong>Chef de Projet :</strong> Xie Xian (Sinylon)</div>
                <div><strong>Superviseur HSE :</strong> Nouri Chahrour (0563765157)</div>
                <div><strong>Chef d'Équipe :</strong> Zhou Lin (Receveur Zone UB)</div>
                <div><strong>Sécurité :</strong> Port des EPI complets + Harnais vérifiés</div>
                <div><strong>Revalidation :</strong> Pointage journalier chaque matin à 08h00</div>
            </div>
        </div>
    </div>

    <!-- Pied de page officiel -->
    <div style="text-align:center;font-size:9px;color:#475569;border-top:2px solid #000;padding-top:6px;line-height:1.35;">
        Document réglementaire affiché obligatoirement à l'entrée de la Zone UB (Atelier Montage K9).<br>
        En cas d'urgence ou d'incident, contacter immédiatement le Superviseur HSE Nouri Chahrour au <strong>0563765157</strong> ou la Sécurité Stellantis.
    </div>
</div>

</body>
</html>
"""

poster_html_path = os.path.join(desktop_folder, "AFFICHE_A4_QR_CODE_PERMIS_SINYLON_W38_UB.html")
with open(poster_html_path, "w", encoding="utf-8") as f:
    f.write(html_poster)
print(f"✅ Affiche HTML générée -> {poster_html_path}")

# PDF de l'Affiche
poster_pdf_path = os.path.join(desktop_folder, "AFFICHE_A4_QR_CODE_PERMIS_SINYLON_W38_UB.pdf")
doc_poster = SimpleDocTemplate(
    poster_pdf_path,
    pagesize=A4,
    leftMargin=20,
    rightMargin=20,
    topMargin=20,
    bottomMargin=20
)
story_p = []
story_p.append(Paragraph("<b>PERMIS GÉNÉRAL DE TRAVAIL & REVALIDATION</b>", ParagraphStyle('PT1', fontName='Helvetica-Bold', fontSize=22, leading=26, alignment=1)))
story_p.append(Spacer(1, 4))
story_p.append(Paragraph("<b>STELLANTIS ALGERIA K9 CKD0 — SINYLON</b>", ParagraphStyle('PT2', fontName='Helvetica-Bold', fontSize=13, leading=16, alignment=1, textColor=colors.HexColor('#1e3a8a'))))
story_p.append(Spacer(1, 4))
story_p.append(Paragraph("<b>ZONE UB — SOUS-ENSEMBLE SOUS-CHÂSSIS CENTRAL (UNDERBODY)</b>", ParagraphStyle('PT2b', fontName='Helvetica-Bold', fontSize=11, leading=14, alignment=1, textColor=colors.HexColor('#2563eb'))))
story_p.append(Spacer(1, 8))
story_p.append(Paragraph(f"<b>🟢 PERMIS VALIDE & REVALIDÉ — DATE : {date_today} | HEURE : 08H00</b>", ParagraphStyle('PT3', fontName='Helvetica-Bold', fontSize=12, leading=15, alignment=1, textColor=colors.HexColor('#15803d'))))
story_p.append(Spacer(1, 16))

story_p.append(RLImage(qr_temp, width=230, height=230))
story_p.append(Spacer(1, 12))
story_p.append(Paragraph("<b>📱 SCANNEZ CE QR CODE AVEC UN SMARTPHONE OU TABLETTE</b>", ParagraphStyle('PT4', fontName='Helvetica-Bold', fontSize=12, leading=15, alignment=1)))
story_p.append(Paragraph(f"<i>{qr_url}</i>", ParagraphStyle('PT5', fontName='Helvetica', fontSize=9, leading=12, alignment=1, textColor=colors.HexColor('#475569'))))
story_p.append(Spacer(1, 16))

p_box_l = Paragraph(
    f"<b>Permis N° :</b> {permit_id}<br/>"
    f"<b>Entreprise :</b> SINYLON & W.P.E.E.X<br/>"
    f"<b>Zone Autorisée :</b> Zone UB (Soubassement)<br/>"
    f"<b>Période Semaine 38 :</b> Du {date_deb} Au {date_fin}<br/>"
    f"<b>Horaires :</b> 08h00 - 17h30 (Chantier Actif)",
    ParagraphStyle('PTBoxL', fontName='Helvetica', fontSize=8.5, leading=13)
)
p_box_r = Paragraph(
    f"<b>📅 DATE DU JOUR :</b> {date_today}<br/>"
    f"<b>⏰ POINTAGE MATINAL :</b> <font color='#15803d'><b>08H00</b></font><br/>"
    f"<b>Ingénieur Suivi :</b> M. W.P.E.E.X<br/>"
    f"<b>Chef de Projet :</b> Xie Xian<br/>"
    f"<b>Superviseur HSE :</b> Nouri Chahrour (0563765157)",
    ParagraphStyle('PTBoxR', fontName='Helvetica', fontSize=8.5, leading=13)
)

p_box = [
    ["INFORMATIONS DU CHANTIER — SEMAINE 38", "HORODATAGE HSE CERTIFIÉ (08H00)"],
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
story_p.append(Spacer(1, 14))
story_p.append(Paragraph("<font size=7.5 color='#64748b'>Permis officiel affiché obligatoirement à l'entrée de la Zone UB · Revalidation physique ou électronique chaque matin à 08h00</font>", ParagraphStyle('PF', fontName='Helvetica', alignment=1)))

doc_poster.build(story_p)
print(f"✅ Affiche PDF générée -> {poster_pdf_path}")


# =============================================================================
# 2. GÉNÉRATION DU DOSSIER OFFICIEL A4 (5 PAGES COMPLÈTES)
# =============================================================================
# Page 1 : Permis Général Recto (K9-W38-UB)
# Page 2 : Revalidation Quotidienne des 7 Jours (Verso P2)
# Page 3 : Annexe A (Hauteur)
# Page 4 : Annexe B (Chaud) & Annexe C (Électrique)
# Page 5 : Registre d'Émargement des 59 Travailleurs Autorisés Sinylon

html_dossier = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>DOSSIER OFFICIEL PERMIS SINYLON STELLANTIS A4 - SEMAINE 38 - ZONE UB</title>
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
</style>
</head>
<body>

<!-- ========================================================================= -->
<!-- PAGE 1 : PERMIS GÉNÉRAL DE TRAVAIL (RECTO - ZONE UB - SEMAINE 38)        -->
<!-- ========================================================================= -->
<div class="page" id="page-1">
    <div>
        <!-- En-tête -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px;">
            <div style="flex:1;text-align:center;padding-left:40px;">
                <div style="font-size:16px;font-weight:900;letter-spacing:0.2px;">
                    Permis de Travail de Securité Générale
                </div>
                <div style="font-size:8px;font-style:italic;color:#333;margin-top:1px;">
                    General Safety Work Permit (Ce permis doit être toujours affiché sur le lieu de travail)
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
                <span style="background:#000;color:#fff;font-weight:900;font-size:13px;padding:2px 7px;border-radius:2px;letter-spacing:1px;">SINYLON</span>
                <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:13px;padding:1px 7px;border-radius:2px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
            </div>
        </div>

        <!-- Tableau Synthétique N° / Date / Période -->
        <table style="width:100%;border-collapse:collapse;margin-top:2px;font-size:7.5px;">
            <tr style="background:#ffeb3b;font-weight:bold;text-align:center;">
                <td style="border:1px solid #000;padding:2px 4px;width:18%;">Identifiant du Permis</td>
                <td style="border:1px solid #000;padding:2px 4px;width:24%;">Date d'Émission</td>
                <td style="border:1px solid #000;padding:2px 4px;width:34%;">Période Autorisée (Semaine 38)</td>
                <td style="border:1px solid #000;padding:2px 4px;width:24%;">Horaires Chantier</td>
            </tr>
            <tr style="text-align:center;background:#fff;">
                <td style="border:1px solid #000;padding:2px 4px;font-weight:900;font-size:10px;color:#1e3a8a;">{permit_id}</td>
                <td style="border:1px solid #000;padding:2px 4px;">{date_today} (08h00)</td>
                <td style="border:1px solid #000;padding:2px 4px;font-weight:bold;">Du {date_deb} Au {date_fin}</td>
                <td style="border:1px solid #000;padding:2px 4px;">08h00 - 17h30 (Validé 08h00)</td>
            </tr>
        </table>

        <!-- Section 1 : Informations Générales -->
        <div style="background:#ffeb3b;border:1px solid #000;padding:2px 6px;font-weight:900;font-size:8px;margin-top:4px;">
            1. INFORMATIONS GÉNÉRALES & LOCALISATION DES TRAVAUX
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:7.5px;">
            <tr>
                <td style="border:1px solid #000;padding:2px 4px;width:50%;"><strong>Entreprise Exécutante :</strong> SINYLON & W.P.E.E.X</td>
                <td style="border:1px solid #000;padding:2px 4px;width:50%;"><strong>Donneur d'Ordre :</strong> STELLANTIS ALGERIA K9 CKD0</td>
            </tr>
            <tr>
                <td style="border:1px solid #000;padding:2px 4px;"><strong>Zone Spécifique :</strong> <span style="color:#1e3a8a;font-weight:900;">Zone UB — Underbody (Soubassement Central)</span></td>
                <td style="border:1px solid #000;padding:2px 4px;"><strong>Bâtiment :</strong> Atelier Montage & Assemblage</td>
            </tr>
            <tr>
                <td style="border:1px solid #000;padding:2px 4px;"><strong>Chef de Projet :</strong> Xie Xian (Sinylon)</td>
                <td style="border:1px solid #000;padding:2px 4px;"><strong>Superviseur HSE :</strong> Nouri Chahrour (0563765157)</td>
            </tr>
            <tr>
                <td style="border:1px solid #000;padding:2px 4px;"><strong>Ingénieur de Suivi :</strong> M. W.P.E.E.X (Stellantis / Sinylon)</td>
                <td style="border:1px solid #000;padding:2px 4px;"><strong>Chef d'Équipe :</strong> Zhou Lin (Receveur Zone UB)</td>
            </tr>
        </table>

        <!-- Section 2 : Activités autorisées -->
        <div style="background:#ffeb3b;border:1px solid #000;padding:2px 6px;font-weight:900;font-size:8px;margin-top:4px;">
            2. ACTIVITÉS & TÂCHES AUTORISÉES — SEMAINE 38 (ZONE UB)
        </div>
        <div style="border:1px solid #000;border-top:none;padding:4px 6px;font-size:7.5px;line-height:1.35;background:#fff;">
            <strong>Travaux programmés :</strong> {work_desc_fr}<br>
            <span style="font-style:italic;color:#334155;"><strong>English :</strong> {work_desc_en}</span><br>
            <span style="color:#475569;"><strong>Chinese :</strong> {work_desc_zh}</span><br>
            <strong>Équipements déclarés :</strong> Nacelles ciseaux (x2), Manlift, Palans DEMAG KBK, Visseuses dynamométriques, Échafaudages roulants.
        </div>

        <!-- Section 3 : Dangers & Annexes Applicables -->
        <div style="background:#ffeb3b;border:1px solid #000;padding:2px 6px;font-weight:900;font-size:8px;margin-top:4px;">
            3. DANGERS IDENTIFIÉS & ANNEXES SPÉCIFIQUES OBLIGATOIRES
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:7.5px;">
            <tr style="background:#f8fafc;">
                <td style="border:1px solid #000;padding:3px 6px;width:33%;">
                    <strong>[ X ] ANNEXE A — TRAVAIL EN HAUTEUR</strong><br>
                    Nacelles ciseaux, échafaudages, port du harnais et ligne de vie
                </td>
                <td style="border:1px solid #000;padding:3px 6px;width:33%;">
                    <strong>[ X ] ANNEXE B — TRAVAUX À CHAUD</strong><br>
                    Pinces de soudage manuel, meulage, écrans pare-étincelles, extincteurs
                </td>
                <td style="border:1px solid #000;padding:3px 6px;width:34%;">
                    <strong>[ X ] ANNEXE C — ÉLECTRIQUE & LOTO</strong><br>
                    Consignation BT, armoires électriques, vérification VAT 0V
                </td>
            </tr>
        </table>

        <!-- Section 4 : Mesures de Sécurité & EPI -->
        <div style="background:#ffeb3b;border:1px solid #000;padding:2px 6px;font-weight:900;font-size:8px;margin-top:4px;">
            4. MESURES PRÉVENTIVES HSE & ÉQUIPEMENTS DE PROTECTION INDIVIDUELLE (EPI)
        </div>
        <div style="border:1px solid #000;border-top:none;padding:4px 6px;font-size:7px;line-height:1.3;background:#fff;">
            • Port obligatoire des EPI de base : Casque de sécurité avec jugulaire, Chaussures S3, Lunettes de protection, Gants adaptés aux risques mécaniques et chimiques.<br>
            • Travaux en hauteur : Contrôle préalable des nacelles (VGP valide, carnet de maintenance), vérification des harnais EN 361 et longes avec absorbeur d'énergie.<br>
            • Délimitation et balisage de la Zone UB : Chaînes de sécurité et panneaux d'avertissement empêchant l'accès des tiers non habilités.<br>
            • Présence obligatoire des moyens d'extinction d'incendie (Extincteurs Eau pulvérisée + CO2) à moins de 5 mètres des postes de travail.
        </div>

        <!-- Section 5 : Signatures Initiales d'Ouverture du Permis -->
        <div style="background:#ffeb3b;border:1px solid #000;padding:2px 6px;font-weight:900;font-size:8px;margin-top:4px;">
            5. AUTORISATION & SIGNATURES INITIALES DU PERMIS (DÉBUT SEMAINE 38 — 14/09/2026 À 08H00)
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:7px;text-align:center;">
            <tr style="background:#f1f5f9;font-weight:bold;">
                <td style="border:1px solid #000;padding:3px;width:25%;">Ingénieur Suivi (W.P.E.E.X)</td>
                <td style="border:1px solid #000;padding:3px;width:25%;">Chef de Projet (Sinylon)</td>
                <td style="border:1px solid #000;padding:3px;width:25%;">Superviseur HSE (Sinylon)</td>
                <td style="border:1px solid #000;padding:3px;width:25%;">Receveur Zone UB (Zhou Lin)</td>
            </tr>
            <tr style="height:36px;vertical-align:bottom;background:#fff;">
                <td style="border:1px solid #000;padding:2px;">
                    <div style="font-size:7px;color:#1e3a8a;font-weight:bold;">M. W.P.E.E.X</div>
                    <div style="font-size:6px;color:#16a34a;font-weight:bold;">✓ VALIDÉ SUR SITE 08H00</div>
                </td>
                <td style="border:1px solid #000;padding:2px;">
                    <div style="font-size:7px;color:#0f172a;font-weight:bold;">Xie Xian</div>
                    <div style="font-size:6px;color:#16a34a;font-weight:bold;">✓ VALIDÉ SUR SITE 08H00</div>
                </td>
                <td style="border:1px solid #000;padding:2px;">
                    <div style="font-size:7px;color:#0f172a;font-weight:bold;">Nouri Chahrour</div>
                    <div style="font-size:6px;color:#16a34a;font-weight:bold;">✓ VISA HSE CONFORME</div>
                </td>
                <td style="border:1px solid #000;padding:2px;">
                    <div style="font-size:7px;color:#0f172a;font-weight:bold;">Zhou Lin</div>
                    <div style="font-size:6px;color:#16a34a;font-weight:bold;">✓ REÇU ZONE UB 08H00</div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Pied de page QR Code -->
    <div class="footer-qr">
        <div class="footer-qr-text">
            <strong>PERMIS SINYLON K9-W38-UB — SEMAINE 38 (14/09/2026 AU 20/09/2026) — ZONE UB</strong><br>
            Scannez ce QR Code pour vérifier en direct les visas de M. W.P.E.E.X, Xie Xian et Nouri Chahrour. Revalidation quotidienne obligatoire chaque matin à 08h00.
        </div>
        <img src="data:image/png;base64,{qr_base64}" class="footer-qr-img" alt="QR">
    </div>
</div>


<!-- ========================================================================= -->
<!-- PAGE 2 : REVALIDATION QUOTIDIENNE DU PERMIS (7 JOURS — SEMAINE 38)        -->
<!-- ========================================================================= -->
<div class="page" id="page-2">
    <div>
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #000;padding-bottom:3px;margin-bottom:3px;">
            <div style="display:flex;align-items:center;gap:6px;">
                <span style="background:#000;color:#fff;font-weight:900;font-size:13px;padding:2px 7px;border-radius:2px;letter-spacing:1px;">SINYLON</span>
                <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:13px;padding:1px 7px;border-radius:2px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
            </div>
            <div style="font-size:13px;font-weight:900;text-align:center;flex:1;">
                Revalidation Quotidienne du Permis de Travail<br>
                <span style="font-size:7.5px;font-weight:normal;color:#333;">Daily Work Permit Revalidation Sheet (Contrôle et émargement chaque matin à 08h00)</span>
            </div>
            <div style="border:1.5px solid #000;padding:2px 8px;text-align:center;border-radius:2px;background:#f8fafc;">
                <strong style="font-size:7px;">Permit ID</strong><br>
                <span style="font-size:11px;font-weight:900;color:#1e3a8a;">{permit_id}</span>
            </div>
        </div>

        <div style="background:#ffeb3b;border:1px solid #000;padding:2px 6px;font-weight:900;font-size:8px;margin-top:4px;display:flex;justify-content:space-between;">
            <span>REVALIDATION QUOTIDIENNE DU PERMIS (DU JOUR 1 AU JOUR 7 — ÉMARGEMENT SUR SITE À 08H00)</span>
            <span style="font-size:7.5px;font-weight:normal;font-style:italic;">Chaque matin avant le démarrage des travaux</span>
        </div>

        <!-- GRILLE DE REVALIDATION COMPLÈTE DES 7 JOURS AVEC CASES D'ÉMARGEMENT PROPRES AU STYLO -->
        <table style="width:100%;border-collapse:collapse;margin-top:2px;">
            <thead>
                <tr style="background:#f1f5f9;font-size:7.5px;">
                    <th rowspan="2" style="border:1px solid #000;padding:2px 4px;width:85px;">JOURNÉE</th>
                    <th rowspan="2" style="border:1px solid #000;padding:2px 4px;width:75px;">DATE</th>
                    <th colspan="3" style="border:1px solid #000;padding:2px;background:#eff6ff;color:#1e3a8a;">W.P.E.E.X - Ingénieur de Suivi</th>
                    <th colspan="3" style="border:1px solid #000;padding:2px;">Responsable d'Exécution (SINYLON)</th>
                    <th rowspan="2" style="border:1px solid #000;padding:2px;width:70px;">STATUT</th>
                </tr>
                <tr style="background:#f8fafc;font-size:7px;">
                    <th style="border:1px solid #000;padding:1px;">Nom</th>
                    <th style="border:1px solid #000;padding:1px;">Fonction</th>
                    <th style="border:1px solid #000;padding:1px;background:#eff6ff;color:#1e3a8a;">Visa Manuscrit (08h00)</th>
                    <th style="border:1px solid #000;padding:1px;">Nom</th>
                    <th style="border:1px solid #000;padding:1px;">Fonction</th>
                    <th style="border:1px solid #000;padding:1px;">Signature Manuscrite (08h00)</th>
                </tr>
            </thead>
            <tbody>
                <!-- Jour 1 (Lundi 14/09) -->
                <tr style="height:26px;background:#fefce8;">
                    <td style="font-weight:bold;font-size:7.5px;border:1px solid #000;padding:2px 4px;">Jour 1 (Lundi)</td>
                    <td style="font-family:monospace;font-size:7.5px;border:1px solid #000;padding:2px 4px;text-align:center;">2026-09-14</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;font-weight:bold;">M. W.P.E.E.X</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Ingénieur Suivi</td>
                    <td style="border:1px solid #000;padding:2px;width:115px;"><div style="height:18px;border-bottom:1px dashed #000;margin:1px 4px;display:flex;align-items:flex-end;justify-content:center;"><span style="font-size:6px;color:#94a3b8;">(Visa WPEEX 08h00)</span></div></td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;font-weight:bold;">Xie Xian</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Chef de Projet</td>
                    <td style="border:1px solid #000;padding:2px;width:115px;"><div style="height:18px;border-bottom:1px dashed #000;margin:1px 4px;display:flex;align-items:flex-end;justify-content:center;"><span style="font-size:6px;color:#94a3b8;">(Signature Xie X. 08h00)</span></div></td>
                    <td style="border:1px solid #000;padding:2px;text-align:center;font-size:7px;color:#15803d;font-weight:bold;">À signer 08h00</td>
                </tr>
                <!-- Jour 2 (Mardi 15/09) -->
                <tr style="height:26px;">
                    <td style="font-weight:bold;font-size:7.5px;border:1px solid #000;padding:2px 4px;">Jour 2 (Mardi)</td>
                    <td style="font-family:monospace;font-size:7.5px;border:1px solid #000;padding:2px 4px;text-align:center;">2026-09-15</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">M. W.P.E.E.X</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Ingénieur Suivi</td>
                    <td style="border:1px solid #000;padding:2px;width:115px;"><div style="height:18px;border-bottom:1px dashed #000;margin:1px 4px;display:flex;align-items:flex-end;justify-content:center;"><span style="font-size:6px;color:#94a3b8;">(Visa WPEEX 08h00)</span></div></td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Xie Xian</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Chef de Projet</td>
                    <td style="border:1px solid #000;padding:2px;width:115px;"><div style="height:18px;border-bottom:1px dashed #000;margin:1px 4px;display:flex;align-items:flex-end;justify-content:center;"><span style="font-size:6px;color:#94a3b8;">(Signature Xie X. 08h00)</span></div></td>
                    <td style="border:1px solid #000;padding:2px;text-align:center;font-size:7px;color:#15803d;font-weight:bold;">À signer 08h00</td>
                </tr>
                <!-- Jour 3 (Mercredi 16/09) -->
                <tr style="height:26px;">
                    <td style="font-weight:bold;font-size:7.5px;border:1px solid #000;padding:2px 4px;">Jour 3 (Mercredi)</td>
                    <td style="font-family:monospace;font-size:7.5px;border:1px solid #000;padding:2px 4px;text-align:center;">2026-09-16</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">M. W.P.E.E.X</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Ingénieur Suivi</td>
                    <td style="border:1px solid #000;padding:2px;width:115px;"><div style="height:18px;border-bottom:1px dashed #000;margin:1px 4px;display:flex;align-items:flex-end;justify-content:center;"><span style="font-size:6px;color:#94a3b8;">(Visa WPEEX 08h00)</span></div></td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Xie Xian</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Chef de Projet</td>
                    <td style="border:1px solid #000;padding:2px;width:115px;"><div style="height:18px;border-bottom:1px dashed #000;margin:1px 4px;display:flex;align-items:flex-end;justify-content:center;"><span style="font-size:6px;color:#94a3b8;">(Signature Xie X. 08h00)</span></div></td>
                    <td style="border:1px solid #000;padding:2px;text-align:center;font-size:7px;color:#15803d;font-weight:bold;">À signer 08h00</td>
                </tr>
                <!-- Jour 4 (Jeudi 17/09) -->
                <tr style="height:26px;">
                    <td style="font-weight:bold;font-size:7.5px;border:1px solid #000;padding:2px 4px;">Jour 4 (Jeudi)</td>
                    <td style="font-family:monospace;font-size:7.5px;border:1px solid #000;padding:2px 4px;text-align:center;">2026-09-17</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">M. W.P.E.E.X</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Ingénieur Suivi</td>
                    <td style="border:1px solid #000;padding:2px;width:115px;"><div style="height:18px;border-bottom:1px dashed #000;margin:1px 4px;display:flex;align-items:flex-end;justify-content:center;"><span style="font-size:6px;color:#94a3b8;">(Visa WPEEX 08h00)</span></div></td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Xie Xian</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Chef de Projet</td>
                    <td style="border:1px solid #000;padding:2px;width:115px;"><div style="height:18px;border-bottom:1px dashed #000;margin:1px 4px;display:flex;align-items:flex-end;justify-content:center;"><span style="font-size:6px;color:#94a3b8;">(Signature Xie X. 08h00)</span></div></td>
                    <td style="border:1px solid #000;padding:2px;text-align:center;font-size:7px;color:#15803d;font-weight:bold;">À signer 08h00</td>
                </tr>
                <!-- Jour 5 (Vendredi 18/09) -->
                <tr style="height:26px;">
                    <td style="font-weight:bold;font-size:7.5px;border:1px solid #000;padding:2px 4px;">Jour 5 (Vendredi)</td>
                    <td style="font-family:monospace;font-size:7.5px;border:1px solid #000;padding:2px 4px;text-align:center;">2026-09-18</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">M. W.P.E.E.X</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Ingénieur Suivi</td>
                    <td style="border:1px solid #000;padding:2px;width:115px;"><div style="height:18px;border-bottom:1px dashed #000;margin:1px 4px;display:flex;align-items:flex-end;justify-content:center;"><span style="font-size:6px;color:#94a3b8;">(Visa WPEEX 08h00)</span></div></td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Xie Xian</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Chef de Projet</td>
                    <td style="border:1px solid #000;padding:2px;width:115px;"><div style="height:18px;border-bottom:1px dashed #000;margin:1px 4px;display:flex;align-items:flex-end;justify-content:center;"><span style="font-size:6px;color:#94a3b8;">(Signature Xie X. 08h00)</span></div></td>
                    <td style="border:1px solid #000;padding:2px;text-align:center;font-size:7px;color:#15803d;font-weight:bold;">À signer 08h00</td>
                </tr>
                <!-- Jour 6 (Samedi 19/09) -->
                <tr style="height:26px;">
                    <td style="font-weight:bold;font-size:7.5px;border:1px solid #000;padding:2px 4px;">Jour 6 (Samedi)</td>
                    <td style="font-family:monospace;font-size:7.5px;border:1px solid #000;padding:2px 4px;text-align:center;">2026-09-19</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">M. W.P.E.E.X</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Ingénieur Suivi</td>
                    <td style="border:1px solid #000;padding:2px;width:115px;"><div style="height:18px;border-bottom:1px dashed #000;margin:1px 4px;display:flex;align-items:flex-end;justify-content:center;"><span style="font-size:6px;color:#94a3b8;">(Visa WPEEX 08h00)</span></div></td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Xie Xian</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Chef de Projet</td>
                    <td style="border:1px solid #000;padding:2px;width:115px;"><div style="height:18px;border-bottom:1px dashed #000;margin:1px 4px;display:flex;align-items:flex-end;justify-content:center;"><span style="font-size:6px;color:#94a3b8;">(Signature Xie X. 08h00)</span></div></td>
                    <td style="border:1px solid #000;padding:2px;text-align:center;font-size:7px;color:#15803d;font-weight:bold;">À signer 08h00</td>
                </tr>
                <!-- Jour 7 (Dimanche 20/09) -->
                <tr style="height:26px;">
                    <td style="font-weight:bold;font-size:7.5px;border:1px solid #000;padding:2px 4px;">Jour 7 (Dimanche)</td>
                    <td style="font-family:monospace;font-size:7.5px;border:1px solid #000;padding:2px 4px;text-align:center;">2026-09-20</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">M. W.P.E.E.X</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Ingénieur Suivi</td>
                    <td style="border:1px solid #000;padding:2px;width:115px;"><div style="height:18px;border-bottom:1px dashed #000;margin:1px 4px;display:flex;align-items:flex-end;justify-content:center;"><span style="font-size:6px;color:#94a3b8;">(Visa WPEEX 08h00)</span></div></td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Xie Xian</td>
                    <td style="border:1px solid #000;padding:2px 4px;font-size:7px;">Chef de Projet</td>
                    <td style="border:1px solid #000;padding:2px;width:115px;"><div style="height:18px;border-bottom:1px dashed #000;margin:1px 4px;display:flex;align-items:flex-end;justify-content:center;"><span style="font-size:6px;color:#94a3b8;">(Signature Xie X. 08h00)</span></div></td>
                    <td style="border:1px solid #000;padding:2px;text-align:center;font-size:7px;color:#15803d;font-weight:bold;">À signer 08h00</td>
                </tr>
            </tbody>
        </table>

        <!-- SECTION 2 : CAISSE WEEK-END -->
        <div style="background:#ffeb3b;border:1px solid #000;padding:2px 6px;font-weight:900;font-size:8px;margin-top:4px;">
            SUPERVISION SPÉCIALE CAISSE WEEK-END (VENDREDI / SAMEDI — 08H00)
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:7.5px;">
            <tr style="background:#f1f5f9;">
                <th style="border:1px solid #000;padding:2px;width:75px;">JOURNÉE</th>
                <th style="border:1px solid #000;padding:2px;width:75px;">DATE</th>
                <th style="border:1px solid #000;padding:2px;width:120px;">SUPERVISEUR HSE</th>
                <th style="border:1px solid #000;padding:2px;">CONTRÔLE SÉCURITÉ 360°</th>
                <th style="border:1px solid #000;padding:2px;width:150px;">VISA CAISSE STELLANTIS</th>
            </tr>
            <tr style="height:24px;">
                <td style="border:1px solid #000;padding:2px;font-weight:bold;text-align:center;">Vendredi</td>
                <td style="border:1px solid #000;padding:2px;text-align:center;font-family:monospace;">2026-09-18</td>
                <td style="border:1px solid #000;padding:2px;font-weight:bold;">Nouri Chahrour</td>
                <td style="border:1px solid #000;padding:2px;">Vérification 360°, Nacelles, Extincteurs, Balisage</td>
                <td style="border:1px solid #000;padding:2px;"><div style="height:16px;border-bottom:1px dashed #000;margin:1px 6px;display:flex;align-items:flex-end;justify-content:center;"><span style="font-size:6px;color:#94a3b8;">(Visa Caisse HSE 08h00)</span></div></td>
            </tr>
            <tr style="height:24px;">
                <td style="border:1px solid #000;padding:2px;font-weight:bold;text-align:center;">Samedi</td>
                <td style="border:1px solid #000;padding:2px;text-align:center;font-family:monospace;">2026-09-19</td>
                <td style="border:1px solid #000;padding:2px;font-weight:bold;">Nouri Chahrour</td>
                <td style="border:1px solid #000;padding:2px;">Vérification 360°, Nacelles, Extincteurs, Balisage</td>
                <td style="border:1px solid #000;padding:2px;"><div style="height:16px;border-bottom:1px dashed #000;margin:1px 6px;display:flex;align-items:flex-end;justify-content:center;"><span style="font-size:6px;color:#94a3b8;">(Visa Caisse HSE 08h00)</span></div></td>
            </tr>
        </table>

        <!-- SECTION 3 : EFFECTIFS & HABILITATIONS (59 INTERVENANTS) -->
        <div style="background:#ffeb3b;border:1px solid #000;padding:2px 6px;font-weight:900;font-size:8px;margin-top:4px;">
            RÉGISTRE DES ÉQUIPES HABILITÉES &amp; CONTRÔLES PRÉALABLES (59 INTERVENANTS SINYLON)
        </div>
        <div style="border:1px solid #000;border-top:none;padding:4px 6px;background:#fff;display:grid;grid-template-columns:1.2fr 1fr;gap:8px;">
            <div>
                <div style="font-size:7.5px;font-weight:900;color:#1e3a8a;margin-bottom:2px;text-transform:uppercase;">
                    👥 Répartition des Effectifs par Métier & Habilitations :
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;font-size:7px;">
                    <div style="border:1px solid #cbd5e1;background:#f8fafc;padding:2px 4px;border-radius:2px;">
                        <strong style="color:#0f172a;">Encadrement (x5) :</strong> Chefs Projet & HSE (Xie X., Nouri C.)
                    </div>
                    <div style="border:1px solid #cbd5e1;background:#f8fafc;padding:2px 4px;border-radius:2px;">
                        <strong style="color:#0f172a;">Chefs Équipe (x4) :</strong> Zhou Lin, Wang J., Chen H., Li M.
                    </div>
                    <div style="border:1px solid #bfdbfe;background:#eff6ff;padding:2px 4px;border-radius:2px;">
                        <strong style="color:#1e3a8a;">Nacellistes / Hauteur (x18) :</strong> Habilités CACES PEMP + Lignes de vie
                    </div>
                    <div style="border:1px solid #fee2e2;background:#fef2f2;padding:2px 4px;border-radius:2px;">
                        <strong style="color:#dc2626;">Soudeurs Chaud (x12) :</strong> Postes ARO, Pinces & Écrans pare-étincelles
                    </div>
                    <div style="border:1px solid #fef3c7;background:#fffbeb;padding:2px 4px;border-radius:2px;">
                        <strong style="color:#d97706;">Électriciens LOTO (x8) :</strong> Consignation BT, VAT 0V & Gants 1000V
                    </div>
                    <div style="border:1px solid #dcfce7;background:#f0fdf4;padding:2px 4px;border-radius:2px;">
                        <strong style="color:#16a34a;">Monteurs & Manutention (x12) :</strong> Palans DEMAG, Outillages & Échafaudages
                    </div>
                </div>
                <div style="font-size:7px;color:#475569;margin-top:3px;font-style:italic;">
                    🛡️ Total effectif déclaré : <strong>54 Chinois + 5 Algériens = 59 Intervenants</strong> porteurs des badges et stickers casques certifiés Sinylon.
                </div>
            </div>

            <div style="border-left:1px solid #e2e8f0;padding-left:8px;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                    <div style="font-size:7.5px;font-weight:900;color:#0f172a;margin-bottom:2px;text-transform:uppercase;">
                        📋 Points d'Arrêt & Contrôles Quotidiens (08h00) :
                    </div>
                    <ul style="margin:0;padding-left:12px;font-size:7px;line-height:1.3;color:#334155;">
                        <li>Causerie de sécurité 15 min (Toolbox) tenue avant l'accès</li>
                        <li>EPI obligatoires (Casque, Lunettes, Gants, S3) vérifiés</li>
                        <li>Contrôle visuel des 2 nacelles ciseaux et outillages de levage</li>
                        <li>Zone balisée (UB) avec extincteurs à poste</li>
                    </ul>
                </div>
                <div style="border:1px solid #1e3a8a;background:#f0f7ff;padding:3px 5px;border-radius:2px;margin-top:2px;">
                    <div style="font-size:7px;font-weight:900;color:#1e3a8a;text-align:center;">
                        ENGAGEMENT HSE & VALIDATION FINALE SEMAINE 38
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;font-size:6.5px;margin-top:1px;">
                        <span>Visa Suivi W.P.E.E.X / HSE : <strong>CONFORME</strong></span>
                        <span>Levée le : <strong>2026-09-20</strong></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Pied de page QR Code -->
    <div class="footer-qr">
        <div class="footer-qr-text">
            <strong>REVALIDATION QUOTIDIENNE DU PERMIS SINYLON K9-W38-UB — SEMAINE 38</strong><br>
            Pointage matinal obligatoire sur site à 08h00. Émargement papier ou numérique certifié.
        </div>
        <img src="data:image/png;base64,{qr_base64}" class="footer-qr-img" alt="QR">
    </div>
</div>


<!-- ========================================================================= -->
<!-- PAGE 3 : ANNEXE A (BLEUE) — TRAVAIL EN HAUTEUR (SEMAINE 38)               -->
<!-- ========================================================================= -->
<div class="page border-blue" id="page-3">
    <div>
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #004080;padding-bottom:3px;margin-bottom:3px;">
            <div style="display:flex;align-items:center;gap:8px;">
                <div style="background:#000;color:#fff;font-size:20px;font-weight:900;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:2px;">A</div>
                <div style="font-size:16px;font-weight:900;color:#000;letter-spacing:0.3px;">Travail en hauteur</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
                <div style="display:flex;align-items:center;gap:6px;">
                    <span style="background:#000;color:#fff;font-weight:900;font-size:13px;padding:2px 7px;border-radius:2px;letter-spacing:1px;">SINYLON</span>
                    <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:13px;padding:1px 7px;border-radius:2px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
                </div>
                <div style="border:1px solid #000;text-align:center;width:125px;">
                    <div style="font-size:7px;font-weight:700;border-bottom:1px solid #000;padding:1px 4px;background:#f8fafc;">Identifiant du permis</div>
                    <div style="font-size:11px;font-weight:900;padding:1px 4px;color:#000;">{permit_id}</div>
                </div>
            </div>
        </div>

        <div style="text-align:center;font-size:7.5px;font-weight:bold;margin-bottom:3px;color:#000;">
            Cette liste de verification doit être toujours accompagnée par le permis de travail de sécurité générale
        </div>

        <!-- Tableau Hauteur -->
        <table style="width:100%;border-collapse:collapse;border:1.5px solid #004080;font-size:7px;">
            <tr style="background:#004080;color:#fff;font-weight:bold;">
                <th style="border:1px solid #004080;padding:2px 4px;text-align:left;width:28%;">Equipement Déclaré</th>
                <th style="border:1px solid #004080;padding:2px;text-align:center;width:8%;">Y/N</th>
                <th style="border:1px solid #004080;padding:2px 4px;text-align:left;width:56%;">Mesures Préventives Spécifiques Recommandées</th>
                <th style="border:1px solid #004080;padding:2px;text-align:center;width:8%;">Y/N</th>
            </tr>
            <tr style="height:26px;">
                <td style="border:1px solid #004080;padding:2px 4px;"><strong>Echaffaudage fixe / mobile</strong></td>
                <td style="border:1px solid #004080;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
                <td style="border:1px solid #004080;padding:2px 4px;">Approuvé et cacheté par le personnel qualifié Sinylon / Stellantis<br>Surface solide, de niveau, lisse, stabilisateurs déployés et roues bloquées</td>
                <td style="border:1px solid #004080;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
            </tr>
            <tr style="height:26px;background:#f0f7ff;">
                <td style="border:1px solid #004080;padding:2px 4px;"><strong>Elevateur de plateforme mobile (Nacelles x2)</strong></td>
                <td style="border:1px solid #004080;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
                <td style="border:1px solid #004080;padding:2px 4px;">L'opérateur et le travailleur entraînés et autorisés (CACES PEMP)<br>Port d'équipement d'arrêt de chute attaché au point d'ancrage dédié du panier</td>
                <td style="border:1px solid #004080;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
            </tr>
            <tr style="height:26px;">
                <td style="border:1px solid #004080;padding:2px 4px;"><strong>Échelle / Escabeau</strong></td>
                <td style="border:1px solid #004080;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
                <td style="border:1px solid #004080;padding:2px 4px;">Pour activités court terme uniquement — vérifiée, barreaux solides et semelles antidérapantes</td>
                <td style="border:1px solid #004080;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
            </tr>
            <tr style="height:26px;background:#f0f7ff;">
                <td style="border:1px solid #004080;padding:2px 4px;"><strong>Equipement d'arrêt de chute requis ?</strong></td>
                <td style="border:1px solid #004080;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
                <td style="border:1px solid #004080;padding:2px 4px;">Vérifier avant de commencer le travail — Harnais complet EN 361 et longe double avec absorbeur</td>
                <td style="border:1px solid #004080;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
            </tr>
            <tr style="height:26px;">
                <td style="border:1px solid #004080;padding:2px 4px;"><strong>Balisage et directives de sécurité</strong></td>
                <td style="border:1px solid #004080;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
                <td style="border:1px solid #004080;padding:2px 4px;">Endroit barré véhicules/traffic — Issue de secours dégagée — Panneaux Danger Chute d'objets</td>
                <td style="border:1px solid #004080;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
            </tr>
            <tr style="height:26px;background:#f0f7ff;">
                <td style="border:1px solid #004080;padding:2px 4px;"><strong>Conditions ambiantes (Vent, visibilité)</strong></td>
                <td style="border:1px solid #004080;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
                <td style="border:1px solid #004080;padding:2px 4px;">Travail en atelier couvert — éclairage suffisant, ventilation naturelle active</td>
                <td style="border:1px solid #004080;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
            </tr>
        </table>

        <!-- Signatures Annexe A -->
        <table style="width:100%;border-collapse:collapse;border:1.5px solid #004080;margin-top:6px;font-size:7px;">
            <tr style="background:#004080;color:#fff;font-weight:bold;text-align:center;">
                <td style="border:1px solid #004080;padding:2px;width:33%;">Responsable d'Exécution Sinylon</td>
                <td style="border:1px solid #004080;padding:2px;width:33%;">Superviseur HSE Sinylon</td>
                <td style="border:1px solid #004080;padding:2px;width:34%;">Ingénieur de Suivi Stellantis</td>
            </tr>
            <tr style="height:35px;vertical-align:bottom;background:#fff;text-align:center;">
                <td style="border:1px solid #004080;padding:2px;">
                    <div><strong>Xie Xian</strong></div>
                    <div style="font-size:6.5px;color:#16a34a;font-weight:bold;">✓ VALIDÉ TRAVAUX HAUTEUR</div>
                </td>
                <td style="border:1px solid #004080;padding:2px;">
                    <div><strong>Nouri Chahrour</strong> (0563765157)</div>
                    <div style="font-size:6.5px;color:#16a34a;font-weight:bold;">✓ CONTRÔLE EPI & NACELLES OK</div>
                </td>
                <td style="border:1px solid #004080;padding:2px;">
                    <div><strong>M. W.P.E.E.X</strong></div>
                    <div style="font-size:6.5px;color:#16a34a;font-weight:bold;">✓ VISA AUTORISATION HAUTEUR</div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Pied de page QR Code -->
    <div class="footer-qr" style="border-color:#004080;">
        <div class="footer-qr-text">
            <strong>ANNEXE A (BLEUE) — PERMIS TRAVAUX EN HAUTEUR K9-W38-UB</strong><br>
            Respect strict de la procédure Hauteur Stellantis. Arrêt immédiat en cas de déviation.
        </div>
        <img src="data:image/png;base64,{qr_base64}" class="footer-qr-img" alt="QR">
    </div>
</div>


<!-- ========================================================================= -->
<!-- PAGE 4 : ANNEXE B (CHAUD) & ANNEXE C (ÉLECTRIQUE & LOTO)                  -->
<!-- ========================================================================= -->
<div class="page" id="page-4">
    <div>
        <!-- SECTION 1 : ANNEXE B (CHAUD) -->
        <div style="border:2px solid #cc0000;border-radius:4px;padding:4px;margin-bottom:8px;background:#fff;">
            <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #cc0000;padding-bottom:2px;margin-bottom:3px;">
                <div style="display:flex;align-items:center;gap:6px;">
                    <div style="background:#cc0000;color:#fff;font-size:16px;font-weight:900;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:2px;">B</div>
                    <div style="font-size:13px;font-weight:900;color:#cc0000;">Travail Chaud / Permis de Feu (Annexe B)</div>
                </div>
                <div style="font-size:9px;font-weight:bold;color:#000;">SINYLON / STELLANTIS — {permit_id}</div>
            </div>

            <table style="width:100%;border-collapse:collapse;font-size:6.5px;">
                <tr style="background:#fee2e2;font-weight:bold;">
                    <th style="border:1px solid #cc0000;padding:2px 4px;text-align:left;width:88%;">Points de Contrôle Prévention Incendie (Semaine 38)</th>
                    <th style="border:1px solid #cc0000;padding:2px;text-align:center;width:12%;">Y/N</th>
                </tr>
                <tr>
                    <td style="border:1px solid #cc0000;padding:2px 4px;">Produits inflammables ou combustibles dégagés à plus de 10 m de la zone de travail</td>
                    <td style="border:1px solid #cc0000;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
                </tr>
                <tr style="background:#fef2f2;">
                    <td style="border:1px solid #cc0000;padding:2px 4px;">Écrans pare-étincelles et bâches ignifugées déployés autour des pinces de soudage manuel</td>
                    <td style="border:1px solid #cc0000;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
                </tr>
                <tr>
                    <td style="border:1px solid #cc0000;padding:2px 4px;">Moyens d'extinction vérifiés : Extincteurs Eau pulvérisée + CO2 opérationnels à poste immédiat</td>
                    <td style="border:1px solid #cc0000;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
                </tr>
                <tr style="background:#fef2f2;">
                    <td style="border:1px solid #cc0000;padding:2px 4px;">Surveillance incendie assurée pendant les opérations et 30 minutes après l'arrêt des travaux</td>
                    <td style="border:1px solid #cc0000;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
                </tr>
            </table>

            <div style="display:flex;justify-content:space-between;align-items:center;font-size:7px;margin-top:3px;padding:2px 4px;background:#fef2f2;border:1px solid #fca5a5;">
                <span>Responsable Feu Sinylon : <strong>Xie Xian</strong></span>
                <span>Superviseur HSE : <strong>Nouri Chahrour (0563765157)</strong></span>
                <span>Visa : <strong style="color:#15803d;">✓ AUTORISÉ 08H00</strong></span>
            </div>
        </div>

        <!-- SECTION 2 : ANNEXE C (ÉLECTRIQUE & LOTO) -->
        <div style="border:2px solid #d97706;border-radius:4px;padding:4px;background:#fff;">
            <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #d97706;padding-bottom:2px;margin-bottom:3px;">
                <div style="display:flex;align-items:center;gap:6px;">
                    <div style="background:#d97706;color:#fff;font-size:16px;font-weight:900;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:2px;">C</div>
                    <div style="font-size:13px;font-weight:900;color:#d97706;">Travail Électrique & Consignation LOTO (Annexe C)</div>
                </div>
                <div style="font-size:9px;font-weight:bold;color:#000;">SINYLON / STELLANTIS — {permit_id}</div>
            </div>

            <table style="width:100%;border-collapse:collapse;font-size:6.5px;">
                <tr style="background:#fef3c7;font-weight:bold;">
                    <th style="border:1px solid #d97706;padding:2px 4px;text-align:left;width:88%;">Protocole de Sécurité Électrique & Lockout/Tagout (LOTO)</th>
                    <th style="border:1px solid #d97706;padding:2px;text-align:center;width:12%;">Y/N</th>
                </tr>
                <tr>
                    <td style="border:1px solid #d97706;padding:2px 4px;">Raccordement et vérification des coffrets contrôleurs : Consignation LOTO réalisée et cadenas posés</td>
                    <td style="border:1px solid #d97706;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
                </tr>
                <tr style="background:#fffbeb;">
                    <td style="border:1px solid #d97706;padding:2px 4px;">Vérification d'Absence de Tension (VAT) certifiée 0V effectuée avant toute intervention sous tension</td>
                    <td style="border:1px solid #d97706;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
                </tr>
                <tr>
                    <td style="border:1px solid #d97706;padding:2px 4px;">Habilitations électriques des intervenants Sinylon vérifiées (B2V / BR / BC / H1V certifiés)</td>
                    <td style="border:1px solid #d97706;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
                </tr>
                <tr style="background:#fffbeb;">
                    <td style="border:1px solid #d97706;padding:2px 4px;">Port des EPI isolants obligatoires : Gants 1000V, tapis isolant, écran facial anti-arc électrique</td>
                    <td style="border:1px solid #d97706;padding:2px;text-align:center;font-weight:bold;">[.Y.]</td>
                </tr>
            </table>

            <div style="display:flex;justify-content:space-between;align-items:center;font-size:7px;margin-top:3px;padding:2px 4px;background:#fffbeb;border:1px solid #fde68a;">
                <span>Chargé de Consignation : <strong>Nouri Chahrour / Xie Xian</strong></span>
                <span>Numéro de Cadenas LOTO : <strong>LOTO-SINY-W38-UB</strong></span>
                <span>Visa : <strong style="color:#15803d;">✓ CONSIGNATION CONFORME</strong></span>
            </div>
        </div>

        <!-- Section récapitulative des habilitations pour Chaud & Élec -->
        <div style="border:1.5px solid #000;border-radius:4px;padding:4px;margin-top:8px;background:#f8fafc;font-size:7px;line-height:1.35;">
            <strong>CONSIGNES GÉNÉRALES DE COACTIVITÉ & SUPERVISION SEMAINE 38 :</strong><br>
            Toutes les interventions en Zone UB doivent être coordonnées en temps réel avec le Chef d'Équipe Zhou Lin. Les essais de mise sous tension et purges fluides doivent obligatoirement être précédés d'un avertissement sonore et d'un contrôle visuel complet de l'absence de toute personne dans le périmètre dangereux.
        </div>
    </div>

    <!-- Pied de page QR Code -->
    <div class="footer-qr">
        <div class="footer-qr-text">
            <strong>ANNEXES B & C — PERMIS DE FEU ET CONSIGNATION ÉLECTRIQUE K9-W38-UB</strong><br>
            Toutes les opérations à chaud et sous tension nécessitent l'accord préalable du Superviseur HSE.
        </div>
        <img src="data:image/png;base64,{qr_base64}" class="footer-qr-img" alt="QR">
    </div>
</div>


<!-- ========================================================================= -->
<!-- PAGE 5 : REGISTRE D'ÉMARGEMENT DES TRAVAILLEURS HABILITÉS (59 EFFECTIFS) -->
<!-- ========================================================================= -->
<div class="page" id="page-5">
    <div>
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #000;padding-bottom:3px;margin-bottom:3px;">
            <div style="display:flex;align-items:center;gap:6px;">
                <span style="background:#000;color:#fff;font-weight:900;font-size:13px;padding:2px 7px;border-radius:2px;letter-spacing:1px;">SINYLON</span>
                <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:13px;padding:1px 7px;border-radius:2px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
            </div>
            <div style="font-size:13px;font-weight:900;text-align:center;flex:1;">
                Registre d'Émargement des Travailleurs Autorisés<br>
                <span style="font-size:7.5px;font-weight:normal;color:#333;">Authorized Workers Sign-in Roster — Semaine 38 (Zone UB)</span>
            </div>
            <div style="border:1.5px solid #000;padding:2px 8px;text-align:center;border-radius:2px;background:#f8fafc;">
                <strong style="font-size:7px;">Permit ID</strong><br>
                <span style="font-size:11px;font-weight:900;color:#1e3a8a;">{permit_id}</span>
            </div>
        </div>

        <div style="background:#ffeb3b;border:1px solid #000;padding:2px 6px;font-weight:900;font-size:8px;margin-top:4px;display:flex;justify-content:space-between;">
            <span>ÉMARGEMENT DU PERSONNEL HABILITÉ SUR LE CHANTIER (59 INTERVENANTS DÉCLARÉS)</span>
            <span style="font-size:7.5px;font-weight:normal;font-style:italic;">Causerie de sécurité Toolbox tenue à 08h00</span>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-top:3px;font-size:6.5px;">
            <thead>
                <tr style="background:#f1f5f9;font-weight:bold;">
                    <th style="border:1px solid #000;padding:2px;width:3%;">N°</th>
                    <th style="border:1px solid #000;padding:2px;width:10%;">Matricule</th>
                    <th style="border:1px solid #000;padding:2px;width:24%;">Nom & Prénom</th>
                    <th style="border:1px solid #000;padding:2px;width:20%;">Fonction / Métier</th>
                    <th style="border:1px solid #000;padding:2px;width:15%;">Habilitations</th>
                    <th style="border:1px solid #000;padding:2px;width:12%;">Badge / Sticker</th>
                    <th style="border:1px solid #000;padding:2px;width:16%;">Émargement (08h00)</th>
                </tr>
            </thead>
            <tbody>
                <!-- Extrait représentatif de l'équipe officielle Sinylon -->
                <tr><td style="border:1px solid #000;padding:1px 2px;text-align:center;">01</td><td style="border:1px solid #000;padding:1px 2px;">SIN-0001</td><td style="border:1px solid #000;padding:1px 2px;font-weight:bold;">Xie Xian</td><td style="border:1px solid #000;padding:1px 2px;">Chef de Projet</td><td style="border:1px solid #000;padding:1px 2px;">Superviseur Général</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;">BADGE-01</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;color:#16a34a;font-weight:bold;">✓ Émargé</td></tr>
                <tr style="background:#f8fafc;"><td style="border:1px solid #000;padding:1px 2px;text-align:center;">02</td><td style="border:1px solid #000;padding:1px 2px;">SIN-0002</td><td style="border:1px solid #000;padding:1px 2px;font-weight:bold;">Nouri Chahrour</td><td style="border:1px solid #000;padding:1px 2px;">Superviseur HSE</td><td style="border:1px solid #000;padding:1px 2px;">HSE / SST / LOTO</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;">BADGE-02</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;color:#16a34a;font-weight:bold;">✓ Émargé</td></tr>
                <tr><td style="border:1px solid #000;padding:1px 2px;text-align:center;">03</td><td style="border:1px solid #000;padding:1px 2px;">SIN-0003</td><td style="border:1px solid #000;padding:1px 2px;font-weight:bold;">Zhou Lin</td><td style="border:1px solid #000;padding:1px 2px;">Chef d'Équipe Zone UB</td><td style="border:1px solid #000;padding:1px 2px;">Hauteur / Soudage</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;">BADGE-03</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;color:#16a34a;font-weight:bold;">✓ Émargé</td></tr>
                <tr style="background:#f8fafc;"><td style="border:1px solid #000;padding:1px 2px;text-align:center;">04</td><td style="border:1px solid #000;padding:1px 2px;">SIN-0032</td><td style="border:1px solid #000;padding:1px 2px;">Shi Junming</td><td style="border:1px solid #000;padding:1px 2px;">Automatisme PLC</td><td style="border:1px solid #000;padding:1px 2px;">B2V / Électrique</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;">BADGE-04</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;color:#16a34a;font-weight:bold;">✓ Émargé</td></tr>
                <tr><td style="border:1px solid #000;padding:1px 2px;text-align:center;">05</td><td style="border:1px solid #000;padding:1px 2px;">SIN-0036</td><td style="border:1px solid #000;padding:1px 2px;">Wang Lei</td><td style="border:1px solid #000;padding:1px 2px;">Ingénieur Conception</td><td style="border:1px solid #000;padding:1px 2px;">Conformité Ligne</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;">BADGE-05</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;color:#16a34a;font-weight:bold;">✓ Émargé</td></tr>
                <tr style="background:#f8fafc;"><td style="border:1px solid #000;padding:1px 2px;text-align:center;">06</td><td style="border:1px solid #000;padding:1px 2px;">SIN-1040</td><td style="border:1px solid #000;padding:1px 2px;">Sun Xuekui</td><td style="border:1px solid #000;padding:1px 2px;">Ajustement Mécanique</td><td style="border:1px solid #000;padding:1px 2px;">CACES PEMP / Hauteur</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;">BADGE-06</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;color:#16a34a;font-weight:bold;">✓ Émargé</td></tr>
                <tr><td style="border:1px solid #000;padding:1px 2px;text-align:center;">07</td><td style="border:1px solid #000;padding:1px 2px;">SIN-1042</td><td style="border:1px solid #000;padding:1px 2px;">Yuan Bo</td><td style="border:1px solid #000;padding:1px 2px;">Ajustement Mécanique</td><td style="border:1px solid #000;padding:1px 2px;">CACES PEMP / Hauteur</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;">BADGE-07</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;color:#16a34a;font-weight:bold;">✓ Émargé</td></tr>
                <tr style="background:#f8fafc;"><td style="border:1px solid #000;padding:1px 2px;text-align:center;">08</td><td style="border:1px solid #000;padding:1px 2px;">SIN-1044</td><td style="border:1px solid #000;padding:1px 2px;">Zhou Kaixuan</td><td style="border:1px solid #000;padding:1px 2px;">Ajustement Mécanique</td><td style="border:1px solid #000;padding:1px 2px;">CACES PEMP / Hauteur</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;">BADGE-08</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;color:#16a34a;font-weight:bold;">✓ Émargé</td></tr>
                <tr><td style="border:1px solid #000;padding:1px 2px;text-align:center;">09</td><td style="border:1px solid #000;padding:1px 2px;">SIN-1046</td><td style="border:1px solid #000;padding:1px 2px;">Wang Zhen</td><td style="border:1px solid #000;padding:1px 2px;">Ajustement Mécanique</td><td style="border:1px solid #000;padding:1px 2px;">CACES PEMP / Hauteur</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;">BADGE-09</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;color:#16a34a;font-weight:bold;">✓ Émargé</td></tr>
                <tr style="background:#f8fafc;"><td style="border:1px solid #000;padding:1px 2px;text-align:center;">10</td><td style="border:1px solid #000;padding:1px 2px;">SIN-1048</td><td style="border:1px solid #000;padding:1px 2px;">Zhang Jiale</td><td style="border:1px solid #000;padding:1px 2px;">Ajustement Mécanique</td><td style="border:1px solid #000;padding:1px 2px;">CACES PEMP / Hauteur</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;">BADGE-10</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;color:#16a34a;font-weight:bold;">✓ Émargé</td></tr>
                <tr><td style="border:1px solid #000;padding:1px 2px;text-align:center;">11</td><td style="border:1px solid #000;padding:1px 2px;">SIN-1050</td><td style="border:1px solid #000;padding:1px 2px;">Qin Chenggang</td><td style="border:1px solid #000;padding:1px 2px;">Ajustement Mécanique</td><td style="border:1px solid #000;padding:1px 2px;">CACES PEMP / Hauteur</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;">BADGE-11</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;color:#16a34a;font-weight:bold;">✓ Émargé</td></tr>
                <tr style="background:#f8fafc;"><td style="border:1px solid #000;padding:1px 2px;text-align:center;">12</td><td style="border:1px solid #000;padding:1px 2px;">SIN-1054</td><td style="border:1px solid #000;padding:1px 2px;">Xiong Guangming</td><td style="border:1px solid #000;padding:1px 2px;">Soudeur Manuel</td><td style="border:1px solid #000;padding:1px 2px;">Chaud / Soudure ARO</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;">BADGE-12</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;color:#16a34a;font-weight:bold;">✓ Émargé</td></tr>
                <tr><td style="border:1px solid #000;padding:1px 2px;text-align:center;">13</td><td style="border:1px solid #000;padding:1px 2px;">SIN-1056</td><td style="border:1px solid #000;padding:1px 2px;">Li Jiangang</td><td style="border:1px solid #000;padding:1px 2px;">Soudeur Manuel</td><td style="border:1px solid #000;padding:1px 2px;">Chaud / Soudure ARO</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;">BADGE-13</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;color:#16a34a;font-weight:bold;">✓ Émargé</td></tr>
                <tr style="background:#f8fafc;"><td style="border:1px solid #000;padding:1px 2px;text-align:center;">14</td><td style="border:1px solid #000;padding:1px 2px;">SIN-1060</td><td style="border:1px solid #000;padding:1px 2px;">Xu Yanming</td><td style="border:1px solid #000;padding:1px 2px;">Électricien Câbleur</td><td style="border:1px solid #000;padding:1px 2px;">BR / BC / LOTO</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;">BADGE-14</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;color:#16a34a;font-weight:bold;">✓ Émargé</td></tr>
                <tr><td style="border:1px solid #000;padding:1px 2px;text-align:center;">15</td><td style="border:1px solid #000;padding:1px 2px;">SIN-1062</td><td style="border:1px solid #000;padding:1px 2px;">Chen Wei</td><td style="border:1px solid #000;padding:1px 2px;">Électricien Câbleur</td><td style="border:1px solid #000;padding:1px 2px;">BR / BC / LOTO</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;">BADGE-15</td><td style="border:1px solid #000;padding:1px 2px;text-align:center;color:#16a34a;font-weight:bold;">✓ Émargé</td></tr>
                <tr style="background:#f0fdf4;"><td colspan="7" style="border:1px solid #000;padding:2px 4px;text-align:center;font-weight:bold;color:#166534;">... et 44 autres intervenants Sinylon qualifiés et habilités (Liste complète 59 travailleurs consultable via le QR Code)</td></tr>
            </tbody>
        </table>

        <!-- Visa HSE Registre -->
        <div style="border:1.5px solid #000;background:#f8fafc;padding:4px 8px;margin-top:4px;display:flex;justify-content:space-between;align-items:center;font-size:7px;">
            <div>Superviseur HSE Sinylon : <strong>Nouri Chahrour (0563765157)</strong></div>
            <div>Contrôle Toolbox & Badges : <strong style="color:#15803d;">✓ 59 EFFECTIFS CONFORMES</strong></div>
            <div>Date de validation : <strong>2026-09-14 (08h00)</strong></div>
        </div>
    </div>

    <!-- Pied de page QR Code -->
    <div class="footer-qr">
        <div class="footer-qr-text">
            <strong>REGISTRE D'ÉMARGEMENT DU PERSONNEL HABILITÉ K9-W38-UB — SEMAINE 38</strong><br>
            Tout travailleur non émargé ou dépourvu de badge certifié se verra refuser l'accès au chantier.
        </div>
        <img src="data:image/png;base64,{qr_base64}" class="footer-qr-img" alt="QR">
    </div>
</div>

</body>
</html>
"""

dossier_html_path = os.path.join(desktop_folder, "DOSSIER_PERMIS_SINYLON_W38_UB_OFFICIEL.html")
with open(dossier_html_path, "w", encoding="utf-8") as f:
    f.write(html_dossier)
print(f"✅ Dossier HTML (5 Pages) généré -> {dossier_html_path}")


# =============================================================================
# 3. GÉNÉRATION DU PDF DU DOSSIER OFFICIEL A4 (5 PAGES REPORTLAB)
# =============================================================================
dossier_pdf_path = os.path.join(desktop_folder, "DOSSIER_PERMIS_SINYLON_W38_UB_OFFICIEL.pdf")
doc = SimpleDocTemplate(
    dossier_pdf_path,
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

# Footer réutilisable
p_foot_text = Paragraph(
    f"<b>PERMIS SINYLON {permit_id} — SEMAINE 38 ({date_deb} AU {date_fin}) — ZONE UB</b><br/>"
    "<i>Scannez le QR Code pour vérifier en direct les visas de M. W.P.E.E.X, Xie Xian et Nouri Chahrour. Revalidation 08h00.</i>",
    ParagraphStyle('FText', fontName='Helvetica', fontSize=7, leading=9)
)
t_foot_data = [
    [p_foot_text, RLImage(qr_temp, width=36, height=36)]
]
t_foot = Table(t_foot_data, colWidths=[520, 45])
t_foot.setStyle(TableStyle([
    ('BOX', (0,0), (-1,-1), 1, colors.black),
    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
]))

# ---------------- PAGE 1 : PERMIS GÉNÉRAL RECTO ----------------
p1_title = Paragraph(f"<b>PERMIS DE TRAVAIL DE SECURITÉ GÉNÉRALE — SEMAINE 38 ({date_today})</b>", ParagraphStyle('P1', fontName='Helvetica-Bold', fontSize=12, alignment=1))
story.append(p1_title)
story.append(Spacer(1, 4))

info_data = [
    [f"Date d'Émission : {date_today}", f"Période : Du {date_deb} Au {date_fin}", "Horaires : 08h00 → 17h30 (Pointage 08h00)"],
    ["Entreprise : SINYLON & W.P.E.E.X", "Secteur : Atelier Montage Stellantis K9", "Zone : Zone UB (Soubassement Central)"],
    ["Chef de Projet : Xie Xian", "HSE Sinylon : Nouri Chahrour (0563765157)", f"Permis N° : {permit_id}"]
]
t_info = Table(info_data, colWidths=[185, 200, 180])
t_info.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 1, colors.black),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 7.5),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
]))
story.append(t_info)
story.append(Spacer(1, 6))

desc_p = Paragraph(
    f"<b>Description des travaux autorisés :</b> {work_desc_fr}<br/>"
    f"<i>{work_desc_en}</i><br/>"
    f"<b>Équipements déclarés :</b> Nacelles ciseaux (x2), Manlift, Palans DEMAG KBK, Visseuses dynamométriques, Échafaudages roulants",
    ParagraphStyle('PDesc', fontName='Helvetica', fontSize=7.5, leading=10.5)
)
story.append(desc_p)
story.append(Spacer(1, 6))

danger_data = [
    ["Travail en hauteur (Annexe A)", "[.Y.] A", "Travail à chaud & Soudure (Annexe B)", "[.Y.] B"],
    ["Travail Électrique & LOTO (Annexe C)", "[.Y.] C", "Espace confiné", "[ N ] D"],
    ["Levage & Palans DEMAG KBK", "[.Y.] E", "Coactivité & Balisage Zone UB", "[.Y.] F"],
]
t_dang = Table(danger_data, colWidths=[205, 75, 210, 75])
t_dang.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 1, colors.black),
    ('BACKGROUND', (1,0), (1,0), colors.HexColor('#dbeafe')),
    ('BACKGROUND', (3,0), (3,0), colors.HexColor('#fee2e2')),
    ('BACKGROUND', (1,1), (1,1), colors.HexColor('#fef3c7')),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 7),
    ('ALIGN', (1,0), (1,-1), 'CENTER'),
    ('ALIGN', (3,0), (3,-1), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 2),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
]))
story.append(t_dang)
story.append(Spacer(1, 6))

p_epi = Paragraph(
    "<b>EPI & Consignes Préventives :</b> Casque de sécurité SM avec jugulaire, Chaussures S3, Lunettes de protection EN 166, Gants de précision, Harnais complet EN 361 raccordé pour travail sur nacelle, extincteurs à poste, balisage rigide Zone UB.",
    ParagraphStyle('PEpi', fontName='Helvetica', fontSize=7, leading=9.5)
)
story.append(p_epi)
story.append(Spacer(1, 8))

sig_p1 = [
    ["Ingénieur de Suivi (W.P.E.E.X)", "Chef de Projet (Sinylon)", "Superviseur HSE (Sinylon)", "Receveur Permis (Zhou Lin)"],
    ["M. W.P.E.E.X\n\n✓ VALIDÉ SUR SITE", "Xie Xian\n\n✓ VALIDÉ SUR SITE", "Nouri Chahrour\n\n✓ VISA HSE CONFORME", "Zhou Lin\n\n✓ REÇU ZONE UB"]
]
t_sig_p1 = Table(sig_p1, colWidths=[141, 141, 141, 142])
t_sig_p1.setStyle(TableStyle([
    ('BOX', (0,0), (-1,-1), 1.5, colors.black),
    ('GRID', (0,0), (-1,-1), 1, colors.black),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 7),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ('BOTTOMPADDING', (0,1), (-1,1), 8),
    ('TOPPADDING', (0,0), (-1,-1), 2),
]))
story.append(t_sig_p1)
story.append(Spacer(1, 10))
story.append(t_foot)


# ---------------- PAGE 2 : REVALIDATION QUOTIDIENNE (7 JOURS) ----------------
story.append(PageBreak())
story.append(Paragraph(f"<b>REVALIDATION QUOTIDIENNE DU PERMIS — SEMAINE 38 ({date_deb} AU {date_fin})</b>", ParagraphStyle('P2T', fontName='Helvetica-Bold', fontSize=12, alignment=1)))
story.append(Spacer(1, 4))
story.append(Paragraph("<i>Pointage obligatoire chaque matin à 08h00 par l'Ingénieur de Suivi et le Responsable d'Exécution</i>", ParagraphStyle('P2Sub', fontName='Helvetica-Bold', fontSize=7.5, alignment=1, textColor=colors.HexColor('#1e3a8a'))))
story.append(Spacer(1, 6))

reval_data = [
    ["JOUR", "DATE", "W.P.E.E.X (Ingénieur)", "VISA WPEEX (08h00)", "SINYLON (Responsable)", "SIGNATURE Xie Xian (08h00)", "STATUT"],
    ["Jour 1 (Lundi)", "2026-09-14", "M. W.P.E.E.X", "\n...........................", "Xie Xian", "\n...........................", "À signer 08h00"],
    ["Jour 2 (Mardi)", "2026-09-15", "M. W.P.E.E.X", "\n...........................", "Xie Xian", "\n...........................", "À signer 08h00"],
    ["Jour 3 (Mercredi)", "2026-09-16", "M. W.P.E.E.X", "\n...........................", "Xie Xian", "\n...........................", "À signer 08h00"],
    ["Jour 4 (Jeudi)", "2026-09-17", "M. W.P.E.E.X", "\n...........................", "Xie Xian", "\n...........................", "À signer 08h00"],
    ["Jour 5 (Vendredi)", "2026-09-18", "M. W.P.E.E.X", "\n...........................", "Xie Xian", "\n...........................", "À signer 08h00"],
    ["Jour 6 (Samedi)", "2026-09-19", "M. W.P.E.E.X", "\n...........................", "Xie Xian", "\n...........................", "À signer 08h00"],
    ["Jour 7 (Dimanche)", "2026-09-20", "M. W.P.E.E.X", "\n...........................", "Xie Xian", "\n...........................", "À signer 08h00"]
]
t_rev = Table(reval_data, colWidths=[75, 65, 95, 110, 95, 110, 55])
t_rev.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 1, colors.black),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
    ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#fef08a')),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 7),
    ('ALIGN', (0,0), (1,-1), 'CENTER'),
    ('ALIGN', (6,0), (6,-1), 'CENTER'),
    ('TEXTCOLOR', (6,1), (6,-1), colors.HexColor('#15803d')),
    ('BOTTOMPADDING', (0,1), (-1,-1), 6),
    ('TOPPADDING', (0,0), (-1,-1), 2),
]))
story.append(t_rev)
story.append(Spacer(1, 8))

# Caisse Week-end
caisse_data = [
    ["JOUR", "DATE", "SUPERVISEUR HSE Sinylon", "CONTRÔLE SÉCURITÉ 360° (08H00)", "VISA CAISSE STELLANTIS"],
    ["Vendredi", "2026-09-18", "Nouri Chahrour (0563765157)", "Vérification 360°, Nacelles, Extincteurs, Balisage", "\n..........................."],
    ["Samedi", "2026-09-19", "Nouri Chahrour (0563765157)", "Vérification 360°, Nacelles, Extincteurs, Balisage", "\n..........................."]
]
t_caisse = Table(caisse_data, colWidths=[65, 65, 130, 200, 105])
t_caisse.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 1, colors.black),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 7),
    ('ALIGN', (0,0), (1,-1), 'CENTER'),
    ('BOTTOMPADDING', (0,1), (-1,-1), 6),
    ('TOPPADDING', (0,0), (-1,-1), 2),
]))
story.append(t_caisse)
story.append(Spacer(1, 8))

# Équipes Habilitées Synthèse
eff_text = Paragraph(
    "<b>Registre des 59 Intervenants Habilités Sinylon :</b> 5 Encadrement (Xie X., Nouri C.) · 4 Chefs d'Équipe (Zhou Lin, Wang J.) · 18 Nacellistes Hauteur (CACES PEMP) · 12 Soudeurs Chaud (ARO) · 8 Électriciens LOTO (B2V/BR) · 12 Monteurs Manutention (Palans DEMAG). Causerie Toolbox et vérification des 59 badges effectuée chaque matin à 08h00.",
    ParagraphStyle('PEff', fontName='Helvetica', fontSize=6.5, leading=9)
)
story.append(eff_text)
story.append(Spacer(1, 8))
story.append(t_foot)


# ---------------- PAGE 3 : ANNEXE A (BLEUE) HAUTEUR ----------------
story.append(PageBreak())
story.append(get_header_table("A", "Travail en hauteur (Annexe A) — Zone UB", colors.HexColor('#004080')))
story.append(Spacer(1, 4))
story.append(Paragraph("<i>Cette liste de vérification doit être toujours accompagnée par le permis de travail de sécurité générale</i>", ParagraphStyle('Asub', fontName='Helvetica-Bold', fontSize=7.5, alignment=1)))
story.append(Spacer(1, 6))

hauteur_rows = [
    ["Équipements Déclarés (Semaine 38 — Zone UB)", "Y/N", "Vérification Requise & Directives HSE", "Y/N"],
    ["Échafaudage fixe / mobile roulant", "[.Y.]", "Approuvé et cacheté par le personnel qualifié Sinylon / Stellantis", "[.Y.]"],
    ["Élévateur de plateforme mobile (Nacelles ciseaux x2)", "[.Y.]", "Opérateur entraîné CACES PEMP · Port d'équipement d'arrêt de chute", "[.Y.]"],
    ["Échelle / Escabeau certifié", "[.Y.]", "Activités court terme uniquement — vérifiée et semelles intactes", "[.Y.]"],
    ["Équipement d'arrêt de chute requis (Harnais EN 361)", "[.Y.]", "Vérifier avant le travail — Longe double avec absorbeur d'énergie", "[.Y.]"],
    ["Balisage de la Zone UB et directives de sécurité", "[.Y.]", "Périmètre délimité chaînes/rubalise — Accès tiers strictement interdit", "[.Y.]"],
    ["Conditions ambiantes atelier (Ventilation, éclairage)", "[ OK ]", "Atelier couvert, visibilité optimale, sol sec et dégagé", "[.Y.]"]
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
    ('TOPPADDING', (0,0), (-1,-1), 2.5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
]))
story.append(t_haut)
story.append(Spacer(1, 10))

sig_a_data = [
    ["CHEF DE PROJET : Xie Xian", "HSE ENTREPRISE : Nouri Chahrour", "INGÉNIEUR SUIVI : M. W.P.E.E.X"],
    ["\n\nSignature : .................................", "Tél : 0563765157\n\nSignature : .................................", f"Date : {date_today} (08h00)\n\nVisa : ................................."]
]
t_sig_a = Table(sig_a_data, colWidths=[188, 188, 189])
t_sig_a.setStyle(TableStyle([
    ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#004080')),
    ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#004080')),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#dbeafe')),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 7.5),
    ('BOTTOMPADDING', (0,1), (-1,1), 10),
    ('TOPPADDING', (0,0), (-1,-1), 3),
]))
story.append(t_sig_a)
story.append(Spacer(1, 10))
story.append(t_foot)


# ---------------- PAGE 4 : ANNEXE B (CHAUD) & ANNEXE C (ÉLEC) ----------------
story.append(PageBreak())
story.append(get_header_table("B", "Travail Chaud (Annexe B) & Consignation LOTO (Annexe C)", colors.HexColor('#cc0000')))
story.append(Spacer(1, 4))

chaud_rows = [
    ["Points de Contrôle Prévention Incendie — Permis de Feu (Annexe B)", "Y/N"],
    ["Tous les produits inflammables ou combustibles sont dégagés à plus de 10 m", "[.Y.]"],
    ["Écrans pare-étincelles et bâches ignifugées déployés autour des postes de travail", "[.Y.]"],
    ["Ventilation suffisante sur le lieu de travail (naturelle / forcée)", "[.Y.]"],
    ["Extincteurs appropriés présents à poste : Eau pulvérisée + CO2 vérifiés", "[.Y.]"],
    ["Surveillant incendie présent durant les travaux et 30 minutes après l'arrêt", "[.Y.]"]
]
t_chaud = Table(chaud_rows, colWidths=[505, 60])
t_chaud.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#cc0000')),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#fee2e2')),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 7),
    ('ALIGN', (1,0), (1,-1), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 2),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
]))
story.append(t_chaud)
story.append(Spacer(1, 8))

elec_rows = [
    ["Protocole de Sécurité Électrique & LOTO Lockout (Annexe C)", "Y/N"],
    ["Raccordement coffrets contrôleurs : Consignation LOTO effectuée et cadenas posés", "[.Y.]"],
    ["Vérification d'Absence de Tension (VAT 0V) certifiée avant toute intervention", "[.Y.]"],
    ["Habilitations électriques vérifiées des intervenants (B2V / BR / BC)", "[.Y.]"],
    ["Port des EPI isolants obligatoires (Gants 1000V, écran facial anti-arc)", "[.Y.]"],
    ["Chargé de consignation Sinylon : Nouri Chahrour / Xie Xian (LOTO-SINY-W38-UB)", "[ OK ]"]
]
t_elec = Table(elec_rows, colWidths=[505, 60])
t_elec.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#d97706')),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#fef3c7')),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 7),
    ('ALIGN', (1,0), (1,-1), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 2),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
]))
story.append(t_elec)
story.append(Spacer(1, 8))

sig_bc_data = [
    ["CHEF DE PROJET : Xie Xian", "HSE / CHARGÉ LOTO : Nouri Chahrour", "INGÉNIEUR SUIVI : M. W.P.E.E.X"],
    ["\n\nSignature : .................................", "Tél : 0563765157\n\nSignature : .................................", f"Date : {date_today} (08h00)\n\nVisa : ................................."]
]
t_sig_bc = Table(sig_bc_data, colWidths=[188, 188, 189])
t_sig_bc.setStyle(TableStyle([
    ('BOX', (0,0), (-1,-1), 1.5, colors.black),
    ('GRID', (0,0), (-1,-1), 1, colors.black),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 7.5),
    ('BOTTOMPADDING', (0,1), (-1,1), 8),
    ('TOPPADDING', (0,0), (-1,-1), 2),
]))
story.append(t_sig_bc)
story.append(Spacer(1, 8))
story.append(t_foot)


# ---------------- PAGE 5 : REGISTRE D'ÉMARGEMENT DES TRAVAILLEURS ----------------
story.append(PageBreak())
story.append(Paragraph(f"<b>REGISTRE D'ÉMARGEMENT DU PERSONNEL HABILITÉ — SEMAINE 38 (ZONE UB)</b>", ParagraphStyle('P5T', fontName='Helvetica-Bold', fontSize=11, alignment=1)))
story.append(Spacer(1, 4))
story.append(Paragraph("<i>Total 59 Intervenants Déclarés Sinylon & W.P.E.E.X — Causerie Toolbox tenue à 08h00</i>", ParagraphStyle('P5Sub', fontName='Helvetica', fontSize=7.5, alignment=1, textColor=colors.HexColor('#1e3a8a'))))
story.append(Spacer(1, 6))

workers_data = [
    ["N°", "Matricule", "Nom & Prénom", "Fonction / Métier", "Habilitation", "Badge", "Émargement (08h00)"],
    ["01", "SIN-0001", "Xie Xian", "Chef de Projet", "Superviseur Général", "BADGE-01", "✓ Émargé 08h00"],
    ["02", "SIN-0002", "Nouri Chahrour", "Superviseur HSE", "HSE / SST / LOTO", "BADGE-02", "✓ Émargé 08h00"],
    ["03", "SIN-0003", "Zhou Lin", "Chef d'Équipe Zone UB", "Hauteur / Soudage", "BADGE-03", "✓ Émargé 08h00"],
    ["04", "SIN-0032", "Shi Junming", "Automatisme PLC", "B2V / Électrique", "BADGE-04", "✓ Émargé 08h00"],
    ["05", "SIN-0036", "Wang Lei", "Ingénieur Conception", "Conformité Ligne", "BADGE-05", "✓ Émargé 08h00"],
    ["06", "SIN-1040", "Sun Xuekui", "Ajustement Mécanique", "CACES PEMP / Hauteur", "BADGE-06", "✓ Émargé 08h00"],
    ["07", "SIN-1042", "Yuan Bo", "Ajustement Mécanique", "CACES PEMP / Hauteur", "BADGE-07", "✓ Émargé 08h00"],
    ["08", "SIN-1044", "Zhou Kaixuan", "Ajustement Mécanique", "CACES PEMP / Hauteur", "BADGE-08", "✓ Émargé 08h00"],
    ["09", "SIN-1046", "Wang Zhen", "Ajustement Mécanique", "CACES PEMP / Hauteur", "BADGE-09", "✓ Émargé 08h00"],
    ["10", "SIN-1048", "Zhang Jiale", "Ajustement Mécanique", "CACES PEMP / Hauteur", "BADGE-10", "✓ Émargé 08h00"],
    ["11", "SIN-1050", "Qin Chenggang", "Ajustement Mécanique", "CACES PEMP / Hauteur", "BADGE-11", "✓ Émargé 08h00"],
    ["12", "SIN-1054", "Xiong Guangming", "Soudeur Manuel", "Chaud / Soudure ARO", "BADGE-12", "✓ Émargé 08h00"],
    ["13", "SIN-1056", "Li Jiangang", "Soudeur Manuel", "Chaud / Soudure ARO", "BADGE-13", "✓ Émargé 08h00"],
    ["14", "SIN-1060", "Xu Yanming", "Électricien Câbleur", "BR / BC / LOTO", "BADGE-14", "✓ Émargé 08h00"],
    ["15", "SIN-1062", "Chen Wei", "Électricien Câbleur", "BR / BC / LOTO", "BADGE-15", "✓ Émargé 08h00"],
    ["--", "SIN-SEQ", "... 44 autres intervenants", "Habilités Sinylon", "Certifiés VGP/EPI", "BADGES", "✓ Émargé 08h00"]
]
t_workers = Table(workers_data, colWidths=[24, 56, 125, 115, 105, 55, 85])
t_workers.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 1, colors.black),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 6.5),
    ('ALIGN', (0,0), (0,-1), 'CENTER'),
    ('ALIGN', (1,0), (1,-1), 'CENTER'),
    ('ALIGN', (5,0), (6,-1), 'CENTER'),
    ('TEXTCOLOR', (6,1), (6,-1), colors.HexColor('#15803d')),
    ('TOPPADDING', (0,0), (-1,-1), 2),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
]))
story.append(t_workers)
story.append(Spacer(1, 8))

w_sig = [
    ["Superviseur HSE Sinylon : Nouri Chahrour", "Responsable Exécution : Xie Xian", "Date de Pointage"],
    ["\nSignature : .................................", "\nSignature : .................................", f"{date_today} à 08h00\nVisa : CONFORME"]
]
t_w_sig = Table(w_sig, colWidths=[200, 200, 165])
t_w_sig.setStyle(TableStyle([
    ('BOX', (0,0), (-1,-1), 1, colors.black),
    ('GRID', (0,0), (-1,-1), 1, colors.black),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f8fafc')),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 7),
    ('BOTTOMPADDING', (0,1), (-1,1), 8),
    ('TOPPADDING', (0,0), (-1,-1), 2),
]))
story.append(t_w_sig)
story.append(Spacer(1, 8))
story.append(t_foot)

doc.build(story)
print(f"✅ Dossier PDF (5 Pages) généré -> {dossier_pdf_path}")
print("🎯 GÉNÉRATION COMPLÈTE RÉUSSIE AVEC SUCCÈS DANS /Users/nourine/Desktop/PERMIS_SINYLON_SEMAINE_38")
