#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Constructeur Universel de Dossiers et Affiches A4 pour toute Semaine N (W38, W39, W40, ...)
Basé sur la structure éprouvée W37 / W38.
"""

import os
import sys
import json
import base64
import qrcode
import io
import shutil
from datetime import datetime, timedelta

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_week_config(week_num):
    with open(os.path.join(BASE_DIR, 'excel_weekly_mapping.json'), 'r', encoding='utf-8') as f:
        mapping = json.load(f)
    
    w_str = str(week_num)
    if w_str not in mapping:
        raise ValueError(f"Semaine {week_num} introuvable dans excel_weekly_mapping.json")
    
    m = mapping[w_str]
    s_date = m["startDate"]
    e_date = m["endDate"]
    tasks_fr = m.get("tasks_fr", [])
    tasks_en = m.get("tasks_en", [])
    tasks_zh = m.get("tasks_zh", [])
    equip = ", ".join(m.get("equipmentList", [])[:5])

    start_dt = datetime.strptime(s_date, "%Y-%m-%d")
    we_fri = (start_dt + timedelta(days=4)).strftime("%Y-%m-%d")
    we_sat = (start_dt + timedelta(days=5)).strftime("%Y-%m-%d")

    zones = [
        {
            "permit_id": f"K9-W{week_num}-UB",
            "zone_code": "UB",
            "zone_title": "ZONE UB — UNDERBODY (SOUBASSEMENT CENTRAL)",
            "zone_title_zh": f"UB 区域 (中底盘工位) — 第 {week_num} 周",
            "ouvrage": "Atelier Montage Stellantis K9 — Ligne UB",
            "secteur": "Bâtiment Assemblage — Secteur Soubassement Central (UB)",
            "is_weekend": False,
            "date_deb": s_date,
            "date_fin": e_date,
            "horaires": "08h00 - 17h30 (Chantier Actif)",
            "work_desc_fr": "; ".join([t.replace("[UB] ", "") for t in tasks_fr if "[UB]" in t]) or "Ajustement outillages robotiques, contrôles géométriques et tests de conformité ligne.",
            "work_desc_en": "; ".join([t.replace("[UB] ", "") for t in tasks_en if "[UB]" in t]) or "Robotic tooling adjustment, geometric inspections and line compliance testing.",
            "work_desc_zh": "; ".join([t.replace("[UB] ", "") for t in tasks_zh if "[UB]" in t]) or "机器人夹具调整、几何检测及产线合规测试。",
            "equipements": equip or "Nacelles ciseaux électriques (x2), Lignes de vie, Harnais doubles longes, Clés dynamométriques",
            "tasks": [t.replace("[UB] ", "") for t in tasks_fr if "[UB]" in t] or [
                "Contrôle dimensionnel et serrage géométrique",
                "Essais fonctionnels et vérification des sécurités",
                "Validation de conformité et inspection HSE"
            ],
            "badge_color": "#2563eb",
            "color_name": "Bleu Royal",
            "dangers": {"height": True, "hot": False, "electric": False, "lifting": True}
        },
        {
            "permit_id": f"K9-W{week_num}-UAR",
            "zone_code": "UAR",
            "zone_title": "ZONE UAR — UNDERBODY REAR (SOUBASSEMENT ARRIÈRE)",
            "zone_title_zh": f"UAR 区域 (后底盘工位) — 第 {week_num} 周",
            "ouvrage": "Atelier Montage Stellantis K9 — Ligne UAR",
            "secteur": "Bâtiment Assemblage — Secteur Soubassement Arrière (UAR)",
            "is_weekend": False,
            "date_deb": s_date,
            "date_fin": e_date,
            "horaires": "08h00 - 17h30 (Chantier Actif)",
            "work_desc_fr": "; ".join([t.replace("[UAR] ", "") for t in tasks_fr if "[UAR]" in t]) or "Montage mécanique, raccordements fluides et réglage des pinces à souder.",
            "work_desc_en": "; ".join([t.replace("[UAR] ", "") for t in tasks_en if "[UAR]" in t]) or "Mechanical assembly, fluid connections and welding guns balancing.",
            "work_desc_zh": "; ".join([t.replace("[UAR] ", "") for t in tasks_zh if "[UAR]" in t]) or "机械安装、流体管路接通及焊枪平衡调试。",
            "equipements": "Nacelles ciseaux (x2), Lignes de vie certifiées, Harnais doubles longes, Clés pneumatiques, Palans et potences",
            "tasks": [t.replace("[UAR] ", "") for t in tasks_fr if "[UAR]" in t] or [
                "Installation mécanique et outillages UAR",
                "Raccordements énergies, eau et air comprimé",
                "Équilibrage des pinces et tests opérationnels"
            ],
            "badge_color": "#0284c7",
            "color_name": "Bleu Cyan",
            "dangers": {"height": True, "hot": False, "electric": False, "lifting": True}
        },
        {
            "permit_id": f"K9-W{week_num}-FUSA",
            "zone_code": "FUSA",
            "zone_title": "ZONE FUSA — FRONT UNDERBODY SUB-ASSEMBLY (AVANT)",
            "zone_title_zh": f"FUSA 区域 (前底盘分总成) — 第 {week_num} 周",
            "ouvrage": "Atelier Montage Stellantis K9 — Ligne FUSA",
            "secteur": "Bâtiment Assemblage — Secteur Soubassement Avant (FUSA)",
            "is_weekend": False,
            "date_deb": s_date,
            "date_fin": e_date,
            "horaires": "08h00 - 17h30 (Chantier Actif)",
            "work_desc_fr": "Installation outillages, pose de structures mécaniques, alignement et raccordements électriques avec consignation LOTO.",
            "work_desc_en": "Tooling installation, mechanical frames mounting, alignment and electrical wiring under LOTO lockout.",
            "work_desc_zh": "工装夹具安装、机械框架定位、电气接线及LOTO安全上锁。",
            "equipements": "Postes de soudage conformes, Extincteurs CO2 6kg, Bâches ignifugées, Cadenas LOTO rouges, Armoires TGBT",
            "tasks": [
                f"Travaux de montage et ajustement mécanique Ligne FUSA (S{week_num})",
                "Alignement géométrique au bras 3D et raccordements énergies",
                "Soudage d'ancrages, écran anti-projection et consignation LOTO"
            ],
            "badge_color": "#d97706",
            "color_name": "Ambre / Orange",
            "dangers": {"height": True, "hot": True, "electric": True, "lifting": True}
        },
        {
            "permit_id": f"K9-W{week_num}-WE",
            "zone_code": "WE",
            "zone_title": f"CAISSE WEEK-END — INTERVENTIONS VENDREDI & SAMEDI (UB / UAR / FUSA)",
            "zone_title_zh": f"周末特别作业许可 — 第 {week_num} 周 (UB / UAR / FUSA)",
            "ouvrage": "Atelier Montage Stellantis K9 — Ensemble Lignes UB / UAR / FUSA",
            "secteur": "Bâtiment Assemblage — Secteurs UB, UAR, FUSA (Zone Étendue)",
            "is_weekend": True,
            "date_deb": we_fri,
            "date_fin": we_sat,
            "horaires": f"08h00 - 18h00 (Vendredi {we_fri[-2:]}/{we_fri[5:7]} & Samedi {we_sat[-2:]}/{we_sat[5:7]})",
            "work_desc_fr": "Travaux continus de week-end sous coupure de courant générale (08:00 - 12:00); Consignation électrique LOTO TGBT, travaux en hauteur sur nacelles et mise en service.",
            "work_desc_en": "Weekend continuous operations under power outage (08:00 - 12:00); Electrical LOTO lockout, high elevation boom lift works and line commissioning.",
            "work_desc_zh": f"第 {week_num} 周末连续作业：停电检修（08:00-12:00）、电气LOTO上锁挂牌、剪叉式高空车作业与系统联调",
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
    return zones

def make_qr_base64(url):
    qr = qrcode.QRCode(version=1, box_size=8, border=2)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")

def build_week(week_num):
    desktop_folder = f"/Users/nourine/Desktop/PERMIS_SINYLON_SEMAINE_{week_num}"
    downloads_folder = f"/Users/nourine/Downloads/PERMIS_SINYLON_SEMAINE_{week_num}"
    os.makedirs(desktop_folder, exist_ok=True)
    os.makedirs(downloads_folder, exist_ok=True)

    zones = get_week_config(week_num)
    print(f"\n========================================================")
    print(f"🚀 GÉNÉRATION DU PACK COMPLET SEMAINE {week_num} ({zones[0]['date_deb']} au {zones[0]['date_fin']})")
    print(f"========================================================")
    
    import generate_w38_all_zones as gen
    
    for cfg in zones:
        p_id = cfg["permit_id"]
        z_code = cfg["zone_code"]
        url = f"https://permis-sinylon.onrender.com?permit={p_id}"
        qr_b64 = make_qr_base64(url)
        
        # 1. Affiche A4
        affiche_html = gen.generate_poster_html(cfg, qr_b64, url)
        affiche_path = os.path.join(desktop_folder, f"AFFICHE_A4_QR_CODE_{p_id}.html")
        with open(affiche_path, "w", encoding="utf-8") as af:
            af.write(affiche_html)
            
        # 2. Dossier Officiel 5 Pages
        dossier_html = gen.generate_dossier_html(cfg, qr_b64)
        dossier_path = os.path.join(desktop_folder, f"DOSSIER_OFFICIEL_5_PAGES_{p_id}.html")
        with open(dossier_path, "w", encoding="utf-8") as df:
            df.write(dossier_html)
            
        # 3. Génération des PDF Officiels ReportLab
        qr_temp = os.path.join(desktop_folder, f"temp_qr_{z_code}.png")
        qr_img = qrcode.make(url)
        qr_img.save(qr_temp)
        
        poster_pdf = os.path.join(desktop_folder, f"AFFICHE_A4_QR_CODE_PERMIS_SINYLON_W{week_num}_{z_code}.pdf")
        dossier_pdf = os.path.join(desktop_folder, f"DOSSIER_PERMIS_SINYLON_W{week_num}_{z_code}_OFFICIEL.pdf")
        
        gen.generate_poster_pdf(cfg, qr_temp, poster_pdf)
        gen.generate_dossier_pdf(cfg, qr_temp, dossier_pdf)
        
        if os.path.exists(qr_temp):
            os.remove(qr_temp)
            
        # 4. Copie miroir vers Downloads
        shutil.copy2(poster_pdf, os.path.join(downloads_folder, os.path.basename(poster_pdf)))
        shutil.copy2(dossier_pdf, os.path.join(downloads_folder, os.path.basename(dossier_pdf)))
        shutil.copy2(affiche_path, os.path.join(downloads_folder, os.path.basename(affiche_path)))
        shutil.copy2(dossier_path, os.path.join(downloads_folder, os.path.basename(dossier_path)))
        
        print(f"  ✅ Zone {z_code} ({p_id}) : Affiche A4 + Dossier 5 Pages PDF & HTML générés.")
        
    print(f"📁 Pack Semaine {week_num} synchronisé avec succès :")
    print(f"   -> {desktop_folder}")
    print(f"   -> {downloads_folder}")

if __name__ == "__main__":
    target_weeks = [39, 40]
    if len(sys.argv) > 1:
        target_weeks = [int(x) for x in sys.argv[1:]]
    for w in target_weeks:
        build_week(w)
