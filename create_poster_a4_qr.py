#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import qrcode
import io
import base64
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

qr_url = "https://permis-sinylon.onrender.com/?permitId=SYN-K9-KW35"
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=12,
    border=1
)
qr.add_data(qr_url)
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white")
buffered = io.BytesIO()
img.save(buffered, format="PNG")
qr_base64 = base64.b64encode(buffered.getvalue()).decode()

html_poster = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>AFFICHE A4 QR CODE PERMIS SINYLON - STELLANTIS</title>
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
    padding: 12mm 15mm;
    background: #fff;
    border: 5px solid #000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
}}
@media print {{
    body {{ background: #fff; }}
    .no-print {{ display: none !important; }}
    .poster-page {{ border: 5px solid #000; }}
}}
.csps-fiat-logo {{
    display: inline-flex;
    align-items: center;
    border: 2px solid #000;
    border-radius: 3px;
    overflow: hidden;
    height: 36px;
}}
.csps-badge {{
    background: #000;
    color: #fff;
    font-weight: 900;
    font-size: 18px;
    padding: 3px 8px;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    height: 100%;
}}
.fiat-badge {{
    background: #fff;
    color: #c00;
    font-weight: 900;
    font-size: 18px;
    padding: 3px 8px;
    letter-spacing: 1px;
    font-style: italic;
    display: flex;
    align-items: center;
    height: 100%;
}}
</style>
</head>
<body>

<div class="no-print" style="background:#1e293b;color:#fff;padding:10px;text-align:center;">
    <button onclick="window.print()" style="background:#2563eb;color:#fff;border:none;padding:10px 20px;font-size:15px;font-weight:bold;border-radius:6px;cursor:pointer;">
        🖨️ IMPRIMER L'AFFICHE QR CODE A4
    </button>
</div>

<div class="poster-page">
    <!-- En-tête -->
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3.5px solid #000;padding-bottom:12px;">
        <div style="display:flex;align-items:center;gap:12px;">
            <span style="background:#000;color:#fff;font-weight:900;font-size:24px;padding:5px 14px;border-radius:4px;letter-spacing:1px;">SINYLON</span>
            <span style="border:2.5px solid #000;color:#000;font-weight:900;font-size:24px;padding:4px 14px;border-radius:4px;letter-spacing:1px;background:#fff;">STELLANTIS</span>
        </div>
        <div style="text-align:right;">
            <div style="font-size:12px;font-weight:bold;color:#475569;">PROJET ALGERIA K9 CKD0</div>
            <div style="font-size:22px;font-weight:900;color:#1e3a8a;">SYN-K9-KW35</div>
        </div>
    </div>

    <!-- Titres -->
    <div style="text-align:center;margin:20px 0 10px 0;">
        <div style="font-size:30px;font-weight:900;letter-spacing:1px;text-transform:uppercase;">
            PERMIS GÉNÉRAL DE TRAVAIL
        </div>
        <div style="font-size:14px;font-weight:bold;color:#475569;margin-top:4px;">
            VÉRIFICATION &amp; CONTRÔLE SÉCURITÉ EN TEMPS RÉEL SUR SITE
        </div>
        <div style="background:#15803d;color:#fff;font-weight:900;font-size:16px;padding:8px 24px;border-radius:24px;display:inline-block;margin-top:14px;">
            🟢 PERMIS VALIDE &amp; REVALIDÉ À 08H10 CHAQUE MATIN
        </div>
    </div>

    <!-- QR Code Central -->
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

    <!-- Informations Chantier -->
    <div style="border:2.5px solid #000;border-radius:8px;padding:14px;background:#f8fafc;margin:10px 0;">
        <div style="font-size:14px;font-weight:900;color:#0f172a;border-bottom:2px solid #cbd5e1;padding-bottom:6px;margin-bottom:10px;display:flex;justify-content:space-between;">
            <span>📋 INFORMATIONS ET VALIDITÉ DU PERMIS</span>
            <span style="color:#15803d;">⏰ HORAIRE POINTAGE : 08H10 MATIN</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px;">
            <div>🏢 <strong>Entreprise Intervenante :</strong> SINYLON</div>
            <div>🏛️ <strong>Donneur d'Ordre :</strong> STELLANTIS ALGERIA</div>
            <div>📍 <strong>Zones Autorisées :</strong> FUSA / UAR / UB</div>
            <div>👨‍💼 <strong>Chef de Projet :</strong> Xie Xian</div>
            <div>🛡️ <strong>Superviseur HSE :</strong> Nouri Chahrour (0563765157)</div>
            <div>⏰ <strong>Horaires Chantier :</strong> 08h00 - 17h30</div>
            <div>🧗 <strong>Annexes Activées :</strong> A (Hauteur) + B (Chaud) + C (Électrique)</div>
            <div>✅ <strong>Ingénieur de Suivi :</strong> M. W.P.E.E.X</div>
        </div>
    </div>

    <!-- Pied de page -->
    <div style="text-align:center;font-size:10.5px;color:#475569;border-top:2px solid #000;padding-top:10px;">
        Permis officiel affiché obligatoirement à l'entrée de la zone de travail.<br>
        Revalidation physique effectuée sur le document papier à <strong>08h10 chaque matin</strong> par l'Ingénieur de Suivi W.P.E.E.X et le Responsable HSE Sinylon.
    </div>
</div>

</body>
</html>
"""

poster_html_path = os.path.expanduser("~/Desktop/AFFICHE_A4_QR_CODE_PERMIS_SINYLON.html")
with open(poster_html_path, "w", encoding="utf-8") as f:
    f.write(html_poster)
print(f"Succès : Affiche HTML sauvegardée sur le Bureau -> {poster_html_path}")

# PDF de l'affiche
poster_pdf_path = os.path.expanduser("~/Desktop/AFFICHE_A4_QR_CODE_PERMIS_SINYLON.pdf")
doc = SimpleDocTemplate(
    poster_pdf_path,
    pagesize=A4,
    leftMargin=20,
    rightMargin=20,
    topMargin=20,
    bottomMargin=20
)
styles = getSampleStyleSheet()
story = []

story.append(Paragraph("<b>PERMIS GÉNÉRAL DE TRAVAIL</b>", ParagraphStyle('PT1', fontName='Helvetica-Bold', fontSize=26, alignment=1)))
story.append(Paragraph("<b>STELLANTIS ALGERIA K9 CKD0 — SINYLON</b>", ParagraphStyle('PT2', fontName='Helvetica-Bold', fontSize=14, alignment=1, textColor=colors.HexColor('#1e3a8a'))))
story.append(Spacer(1, 10))
story.append(Paragraph("<b>🟢 PERMIS VALIDE & REVALIDÉ À 08H10 CHAQUE MATIN</b>", ParagraphStyle('PT3', fontName='Helvetica-Bold', fontSize=14, alignment=1, textColor=colors.HexColor('#15803d'))))
story.append(Spacer(1, 25))

# Image QR
qr_temp = "/tmp/qr_poster_temp.png"
img.save(qr_temp)
story.append(RLImage(qr_temp, width=240, height=240))
story.append(Spacer(1, 15))
story.append(Paragraph("<b>📱 SCANNEZ CE QR CODE AVEC UN SMARTPHONE OU TABLETTE</b>", ParagraphStyle('PT4', fontName='Helvetica-Bold', fontSize=13, alignment=1)))
story.append(Paragraph(f"<i>{qr_url}</i>", ParagraphStyle('PT5', fontName='Helvetica', fontSize=9, alignment=1, textColor=colors.HexColor('#475569'))))
story.append(Spacer(1, 25))

p_box = [
    ["INFORMATIONS OFFICIELLES DU CHANTIER", "HORODATAGE HSE CERTIFIÉ"],
    ["Permis N° : SYN-K9-KW35\nEntreprise : SINYLON\nZones : FUSA / UAR / UB (Bâtiment Montage)", "Revalidation quotidienne : 08h10 chaque matin\nSuperviseur HSE : Nouri Chahrour (0563765157)\nChef de Projet : Xie Xian\nIngénieur Suivi : M. W.P.E.E.X"]
]
t_box = Table(p_box, colWidths=[275, 275])
t_box.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 1.5, colors.black),
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffeb3b')),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(t_box)

doc.build(story)
print(f"Succès : Affiche PDF sauvegardée sur le Bureau -> {poster_pdf_path}")
