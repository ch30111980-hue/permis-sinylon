import json
import datetime

# Load existing JSON
with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/k9_weekly_permits.json', 'r', encoding='utf-8') as f:
    raw_permits = json.load(f)

# Update raw_permits hours
for pid, p in raw_permits.items():
    p['time-start'] = '08h00'
    p['time-end'] = '17h30'

with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/k9_weekly_permits.json', 'w', encoding='utf-8') as f:
    json.dump(raw_permits, f, indent=2, ensure_ascii=False)

# Worker catalog for Sinylon (Xie + Nouri Chahrour)
official_workers = [
    {"id": "T-1", "nom": "Xie", "role": "Chef de Projet / Receveur", "badge": "SYN-001"},
    {"id": "T-2", "nom": "Nouri Chahrour", "role": "Superviseur HSE Sinylon", "badge": "SYN-003", "tel": "+213 550 12 34 56"}
]

v2_permits = {}

week_calendar = {
    25: ("2026-06-15", "2026-06-21"),
    26: ("2026-06-22", "2026-06-28"),
    27: ("2026-06-29", "2026-07-05"),
    28: ("2026-07-06", "2026-07-12"),
    29: ("2026-07-13", "2026-07-19"),
    30: ("2026-07-20", "2026-07-26"),
    31: ("2026-07-27", "2026-08-02"),
    32: ("2026-08-03", "2026-08-09"),
    33: ("2026-08-10", "2026-08-16"),
    34: ("2026-08-17", "2026-08-23"),
    35: ("2026-08-24", "2026-08-30"),
    36: ("2026-08-31", "2026-09-06"),
    37: ("2026-09-07", "2026-09-13"),
    38: ("2026-09-14", "2026-09-20"),
    39: ("2026-09-21", "2026-09-27"),
    40: ("2026-09-28", "2026-10-04"),
    41: ("2026-10-05", "2026-10-11"),
    42: ("2026-10-12", "2026-10-18"),
    43: ("2026-10-19", "2026-10-25"),
    44: ("2026-10-26", "2026-11-01"),
    45: ("2026-11-02", "2026-11-08"),
    46: ("2026-11-09", "2026-11-15"),
    47: ("2026-11-16", "2026-11-22"),
    48: ("2026-11-23", "2026-11-29"),
    49: ("2026-11-30", "2026-12-06"),
    50: ("2026-12-07", "2026-12-13"),
    51: ("2026-12-14", "2026-12-20"),
    52: ("2026-12-21", "2026-12-27"),
    53: ("2026-12-28", "2027-01-03")
}

def format_date_range_label(d_start, d_end):
    ds = datetime.datetime.strptime(d_start, "%Y-%m-%d")
    de = datetime.datetime.strptime(d_end, "%Y-%m-%d")
    return f"{ds.strftime('%d %b')} → {de.strftime('%d %b %Y')}"

def get_friday_saturday(d_start):
    ds = datetime.datetime.strptime(d_start, "%Y-%m-%d")
    fri = ds + datetime.timedelta(days=4)
    sat = ds + datetime.timedelta(days=5)
    return fri.strftime("%Y-%m-%d"), sat.strftime("%Y-%m-%d")

# Process each week from KW25 to KW53
for w_num in range(25, 54):
    old_key = f"SYN-K9-KW{w_num}"
    old_data = raw_permits.get(old_key, {})
    d_start, d_end = week_calendar.get(w_num, ("2026-08-24", "2026-08-30"))
    fri_date, sat_date = get_friday_saturday(d_start)
    range_lbl = format_date_range_label(d_start, d_end)
    
    status = "VALIDE" if w_num == 35 else ("CLOTURE" if w_num < 35 else "PLANIFIE")

    # 1. Main General / Mechanical Permit: K9-Wxx-01
    p1_id = f"K9-W{w_num}-01"
    v2_permits[p1_id] = {
        "id": p1_id,
        "legacyId": old_key,
        "week": w_num,
        "weekLabel": f"W{w_num} — {range_lbl}",
        "type": "general",
        "type_permis": "Permis Général de Travail & Mécanique",
        "title": f"Installation & Mécanique — Semaine {w_num}",
        "title_en": f"Mechanical & Assembly Installation — Week {w_num}",
        "title_zh": f"机械与装配安装 — 第 {w_num} 周",
        "activity": {
            "fr": f"Montage mécanique, fixation structures et outillages (W{w_num})",
            "en": f"Mechanical assembly, tooling fixtures and structural setup (W{w_num})",
            "zh": f"机械装配、夹具定位与结构安装（第 {w_num} 周）"
        },
        "area": "Atelier Assemblage Stellantis (Algeria K9 CKD0)",
        "ouvrage": "Ligne de Montage K9",
        "zone": "Zones FUSA / UAR / UB",
        "location": "Bâtiment Montage Stellantis — Lignes FUSA / UAR / UB",
        "contractor": "SINYLON",
        "company": "SINYLON & W.P.E.E.X",
        "responsible": "Xie (Chef de Projet)",
        "tel": "+213 550 12 34 56",
        "contact": "Nouri Chahrour (HSE Sinylon)",
        "chefNom": "Xie (Chef de Projet)",
        "chefEquipe": "Xian",
        "wpeexNom": "M. W.P.E.E.X (Ingénieur de Suivi)",
        "hseNom": "Nouri Chahrour (HSE Sinylon)",
        "validFrom": d_start,
        "validUntil": d_end,
        "timeStart": "08h00",
        "timeEnd": "17h30",
        "status": status,
        "weekend": False,
        "dangers": {
            "height": True,
            "hot": False,
            "electric": False,
            "confined": False,
            "lifting": True,
            "tension": True,
            "emergencyPlan": False,
            "ppe": True
        },
        "annexes": ["height"],
        "ppe": ["Casque de sécurité", "Chaussures S3", "Gilet haute visibilité", "Gants de protection", "Harnais antichute"],
        "heightDetails": {
            "platform": True,
            "scissorLiftsCount": 6,
            "manliftCount": 1,
            "equipmentDesc": "6 Nacelles Ciseaux + 1 Manlift (PEMP)",
            "harnessChecked": True,
            "operatorTrained": True
        },
        "visas": {
            "moex": {"name": "STELLANTIS MOEX", "status": "VALIDATED", "date": d_start},
            "wpeex": {"name": "M. W.P.E.E.X", "status": "VALIDATED", "date": d_start},
            "hse": {"name": "Nouri Chahrour (HSE)", "status": "VALIDATED", "date": d_start}
        },
        "workers": ["Xie (Chef de Projet)", "Nouri Chahrour (HSE Sinylon)"],
        "travailleurs": official_workers,
        "revalidations": old_data.get("revalidations", []),
        "qr": {
            "enabled": True,
            "url": f"https://permis-sinylon.onrender.com/?permitId={p1_id}"
        }
    }

    # 2. Hot Work / Welding Permit: K9-Wxx-02
    p2_id = f"K9-W{w_num}-02"
    v2_permits[p2_id] = {
        "id": p2_id,
        "week": w_num,
        "weekLabel": f"W{w_num} — {range_lbl}",
        "type": "hot",
        "type_permis": "Permis Travail à Chaud & Soudage",
        "title": f"Travaux à Chaud & Soudure — Semaine {w_num}",
        "title_en": f"Hot Work & Welding Operations — Week {w_num}",
        "title_zh": f"动火与焊接作业许可证 — 第 {w_num} 周",
        "activity": {
            "fr": f"Soudage, meulage et raccordement thermique (W{w_num})",
            "en": f"Welding, grinding and hot joint operations (W{w_num})",
            "zh": f"焊接、打磨与动火连接作业（第 {w_num} 周）"
        },
        "area": "Atelier Assemblage Stellantis",
        "ouvrage": "Lignes de Soudage & Pinces",
        "zone": "Zone UB / Postes de Soudure",
        "location": "Bâtiment Montage Stellantis — Lignes FUSA / UAR / UB",
        "contractor": "SINYLON",
        "company": "SINYLON & W.P.E.E.X",
        "responsible": "Xie (Chef de Projet)",
        "tel": "+213 550 12 34 56",
        "contact": "Nouri Chahrour (HSE Sinylon)",
        "chefNom": "Xie (Chef de Projet)",
        "chefEquipe": "Xian",
        "wpeexNom": "M. W.P.E.E.X (Ingénieur de Suivi)",
        "hseNom": "Nouri Chahrour (HSE Sinylon)",
        "validFrom": d_start,
        "validUntil": d_end,
        "timeStart": "08h00",
        "timeEnd": "17h30",
        "status": status,
        "weekend": False,
        "dangers": {
            "height": False,
            "hot": True,
            "electric": True,
            "confined": False,
            "lifting": False,
            "tension": True,
            "emergencyPlan": False,
            "ppe": True
        },
        "annexes": ["hot"],
        "ppe": ["Masque à souder", "Tablier cuir / manchettes", "Chaussures S3", "Extincteur CO2/Poudre à proximité", "Gants soudeur"],
        "hotDetails": {
            "inflammablesClear10m": True,
            "fireproofTarps": True,
            "extinguisherWater": True,
            "extinguisherPowder": True,
            "extinguisherCO2": True,
            "detectorBypass": False,
            "detectorStatus": "Usine en phase montage — Détecteurs de fumée non activés"
        },
        "visas": {
            "moex": {"name": "STELLANTIS MOEX", "status": "VALIDATED", "date": d_start},
            "wpeex": {"name": "M. W.P.E.E.X", "status": "VALIDATED", "date": d_start},
            "hse": {"name": "Nouri Chahrour (HSE)", "status": "VALIDATED", "date": d_start}
        },
        "workers": ["Xie (Chef de Projet)", "Nouri Chahrour (HSE Sinylon)"],
        "travailleurs": official_workers,
        "revalidations": [],
        "qr": {
            "enabled": True,
            "url": f"https://permis-sinylon.onrender.com/?permitId={p2_id}"
        }
    }

    # 3. Electrical / Commissioning Permit: K9-Wxx-03
    p3_id = f"K9-W{w_num}-03"
    v2_permits[p3_id] = {
        "id": p3_id,
        "week": w_num,
        "weekLabel": f"W{w_num} — {range_lbl}",
        "type": "electric",
        "type_permis": "Permis Consignation & Électricité",
        "title": f"Câblage & Raccordement Électrique — Semaine {w_num}",
        "title_en": f"Electrical Cabling & Power Connection — Week {w_num}",
        "title_zh": f"电气接线与通电测试许可证 — 第 {w_num} 周",
        "activity": {
            "fr": f"Câblage armoires, tirage câbles, raccordement moteurs et équipements (W{w_num})",
            "en": f"Control cabinet wiring, cable pulling, motors and equipment hookup (W{w_num})",
            "zh": f"控制柜接线、电缆敷设、电机与设备安装（第 {w_num} 周）"
        },
        "area": "Atelier Assemblage Stellantis",
        "ouvrage": "Armoires Électriques & TGBT",
        "zone": "Zones FUSA / UAR / UB",
        "location": "Bâtiment Montage Stellantis — Lignes FUSA / UAR / UB",
        "contractor": "SINYLON",
        "company": "SINYLON & W.P.E.E.X",
        "responsible": "Xie (Chef de Projet)",
        "tel": "+213 550 12 34 56",
        "contact": "Nouri Chahrour (HSE Sinylon)",
        "chefNom": "Xie (Chef de Projet)",
        "chefEquipe": "Xian",
        "wpeexNom": "M. W.P.E.E.X (Ingénieur de Suivi)",
        "hseNom": "Nouri Chahrour (HSE Sinylon)",
        "validFrom": d_start,
        "validUntil": d_end,
        "timeStart": "08h00",
        "timeEnd": "17h30",
        "status": status,
        "weekend": False,
        "dangers": {
            "height": False,
            "hot": False,
            "electric": True,
            "confined": False,
            "lifting": False,
            "tension": True,
            "emergencyPlan": False,
            "ppe": True
        },
        "annexes": ["electric"],
        "ppe": ["Gants isolants 1000V", "Écran facial anti-flash", "Chaussures isolantes", "Cadenas de consignation LOTO", "VAT"],
        "electricDetails": {
            "consignationChecked": True,
            "voltageAbsenceChecked": True,
            "lockoutTagout": True,
            "cablePulling": True,
            "switchboardInstall": True,
            "motorsInstall": True,
            "equipmentHookup": True
        },
        "visas": {
            "moex": {"name": "STELLANTIS MOEX", "status": "VALIDATED", "date": d_start},
            "wpeex": {"name": "M. W.P.E.E.X", "status": "VALIDATED", "date": d_start},
            "hse": {"name": "Nouri Chahrour (HSE)", "status": "VALIDATED", "date": d_start}
        },
        "workers": ["Xie (Chef de Projet)", "Nouri Chahrour (HSE Sinylon)"],
        "travailleurs": official_workers,
        "revalidations": [],
        "qr": {
            "enabled": True,
            "url": f"https://permis-sinylon.onrender.com/?permitId={p3_id}"
        }
    }

    # 4. Weekend Work Permit: K9-Wxx-WE (Friday / Saturday)
    pwe_id = f"K9-W{w_num}-WE"
    v2_permits[pwe_id] = {
        "id": pwe_id,
        "week": w_num,
        "weekLabel": f"W{w_num} — {range_lbl}",
        "type": "weekend",
        "type_permis": "Permis Travaux Week-end (Vendredi & Samedi)",
        "title": f"Intervention Spéciale Week-end — Semaine {w_num}",
        "title_en": f"Weekend Special Intervention — Week {w_num}",
        "title_zh": f"周末特别作业许可证（周五 / 周六）— 第 {w_num} 周",
        "activity": {
            "fr": f"Intervention autorisée Vendredi ({fri_date}) & Samedi ({sat_date}) — Travaux de finition et levée des réserves",
            "en": f"Authorized weekend intervention Friday ({fri_date}) & Saturday ({sat_date}) — Finishing and punch list closure",
            "zh": f"周五 ({fri_date}) 与周六 ({sat_date}) 特别作业 — 收尾调试与整改消缺"
        },
        "area": "Atelier Assemblage Stellantis (Algeria K9 CKD0)",
        "ouvrage": "Secteur Prioritaire K9",
        "zone": "Zones FUSA / UAR / UB",
        "location": "Bâtiment Montage Stellantis — Lignes FUSA / UAR / UB",
        "contractor": "SINYLON",
        "company": "SINYLON & W.P.E.E.X",
        "responsible": "Xie (Chef de Projet)",
        "tel": "+213 550 12 34 56",
        "contact": "Nouri Chahrour (HSE Sinylon)",
        "chefNom": "Xie (Chef de Projet)",
        "chefEquipe": "Xian",
        "wpeexNom": "M. W.P.E.E.X (Ingénieur de Suivi)",
        "hseNom": "Nouri Chahrour (HSE Sinylon)",
        "validFrom": fri_date,
        "validUntil": sat_date,
        "timeStart": "08h00",
        "timeEnd": "17h30",
        "status": "VALIDE" if w_num == 35 else ("CLOTURE" if w_num < 35 else "PLANIFIE"),
        "weekend": True,
        "isWeekendWork": True,
        "dangers": {
            "height": True,
            "hot": True,
            "electric": True,
            "confined": False,
            "lifting": False,
            "tension": True,
            "emergencyPlan": False,
            "ppe": True
        },
        "annexes": ["height", "hot"],
        "ppe": ["Casque de sécurité", "Chaussures S3", "Gilet haute visibilité", "Harnais si hauteur", "Extincteur"],
        "visas": {
            "moex": {"name": "STELLANTIS MOEX", "status": "VALIDATED", "date": fri_date},
            "wpeex": {"name": "M. W.P.E.E.X", "status": "VALIDATED", "date": fri_date},
            "hse": {"name": "Nouri Chahrour (HSE)", "status": "VALIDATED", "date": fri_date}
        },
        "workers": ["Xie (Chef de Projet)", "Nouri Chahrour (HSE Sinylon)"],
        "travailleurs": official_workers,
        "revalidations": [],
        "qr": {
            "enabled": True,
            "url": f"https://permis-sinylon.onrender.com/?permitId={pwe_id}"
        }
    }

    # Backward compatibility alias
    v2_permits[old_key] = v2_permits[p1_id]

# Save to JSON
with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/k9_v2_permits.json', 'w', encoding='utf-8') as f:
    json.dump(v2_permits, f, indent=2, ensure_ascii=False)

print(f"Generated {len(v2_permits)} permits in k9_v2_permits.json with 08h00 → 17h30 schedule successfully!")
