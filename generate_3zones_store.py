import json
import datetime

# Load Excel weekly mapping
with open('excel_weekly_mapping.json', 'r', encoding='utf-8') as f:
    excel_map = json.load(f)

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

zone_configs = {
    "UB": {
        "name": "Zone UB",
        "name_full": "Zone UB — Underbody (Soubassement Central)",
        "name_zh": "UB 区域 (中底盘工位)",
        "name_en": "Zone UB — Underbody Main Line",
        "ouvrage": "Atelier Montage Stellantis K9 — Ligne UB",
        "location": "Bâtiment Assemblage — Secteur Soubassement Central (UB)",
        "default_equip": "Nacelles ciseaux (x2), Manlift, Palans DEMAG KBK, Visseuses dynamométriques, Échafaudages roulants",
        "dangers": {"height": True, "hot": False, "electric": False, "confined": False, "lifting": True, "tension": True, "emergencyPlan": False, "evacuationOk": True, "coactivity": True}
    },
    "UAR": {
        "name": "Zone UAR",
        "name_full": "Zone UAR — Underbody Rear (Soubassement Arrière)",
        "name_zh": "UAR 区域 (后底盘工位)",
        "name_en": "Zone UAR — Underbody Rear Line",
        "ouvrage": "Atelier Montage Stellantis K9 — Ligne UAR",
        "location": "Bâtiment Assemblage — Secteur Soubassement Arrière (UAR)",
        "default_equip": "Nacelles ciseaux (x2), Lignes de vie certifiées, Harnais doubles longes, Clés pneumatiques, Palans",
        "dangers": {"height": True, "hot": False, "electric": False, "confined": False, "lifting": True, "tension": True, "emergencyPlan": False, "evacuationOk": True, "coactivity": True}
    },
    "FUSA": {
        "name": "Zone FUSA",
        "name_full": "Zone FUSA — Front Underbody Sub-Assembly (Soubassement Avant)",
        "name_zh": "FUSA 区域 (前底盘分总成)",
        "name_en": "Zone FUSA — Front Underbody Sub-Assembly",
        "ouvrage": "Atelier Montage Stellantis K9 — Ligne FUSA",
        "location": "Bâtiment Assemblage — Secteur Soubassement Avant (FUSA)",
        "default_equip": "Postes de soudage conformes, Extincteurs CO2 6kg, Bâches ignifugées, Cadenas LOTO, Armoires TGBT",
        "dangers": {"height": True, "hot": True, "electric": True, "confined": False, "lifting": True, "tension": True, "emergencyPlan": False, "evacuationOk": True, "coactivity": True}
    }
}

permits_db = {}

for w_num in range(25, 54):
    w_str = str(w_num)
    w_info = excel_map.get(w_str, {})
    d_start, d_end = week_calendar.get(w_num, ("2026-08-24", "2026-08-30"))
    fri_date, sat_date = get_friday_saturday(d_start)
    range_lbl = format_date_range_label(d_start, d_end)
    status = "VALIDE" if w_num == 36 else ("CLOTURE" if w_num < 36 else "PLANIFIE")

    # Extraire les tâches par zone
    tasks_all_fr = w_info.get("tasks_fr", [])
    tasks_all_en = w_info.get("tasks_en", [])
    tasks_all_zh = w_info.get("tasks_zh", [])
    equip_list = w_info.get("equipmentList", [])

    # 1. Créer les 3 permis de zone distincts : UB, UAR, FUSA
    for z_key in ["UB", "UAR", "FUSA"]:
        z_conf = zone_configs[z_key]
        pid = f"K9-W{w_num}-{z_key}"

        # Filtrer tâches pour cette zone
        z_tasks_fr = [t for t in tasks_all_fr if f"[{z_key}]" in t]
        z_tasks_en = [t for t in tasks_all_en if f"[{z_key}]" in t]
        z_tasks_zh = [t for t in tasks_all_zh if f"[{z_key}]" in t]

        if not z_tasks_fr:
            z_tasks_fr = [f"[{z_key}] Installation, montage mécanique et outillages de la {z_conf['name_full']}"]
        if not z_tasks_en:
            z_tasks_en = [f"[{z_key}] Installation, mechanical assembly and tooling for {z_conf['name_en']}"]
        if not z_tasks_zh:
            z_tasks_zh = [f"[{z_key}] {z_conf['name_zh']} 机械与工装安装"]

        act_fr = "; ".join([t.replace(f"[{z_key}]", "").strip() for t in z_tasks_fr])
        act_en = "; ".join([t.replace(f"[{z_key}]", "").strip() for t in z_tasks_en])
        act_zh = "; ".join([t.replace(f"[{z_key}]", "").strip() for t in z_tasks_zh])

        permits_db[pid] = {
            "id": pid,
            "zoneKey": z_key,
            "week": w_num,
            "weekLabel": f"W{w_num} — {range_lbl}",
            "type": "general",
            "type_permis": f"Permis de Travail — {z_conf['name']}",
            "title": f"Installation & Montage — {z_conf['name_full']} (Semaine {w_num})",
            "title_en": f"Installation & Assembly — {z_conf['name_en']} (Week {w_num})",
            "title_zh": f"安装与装配 — {z_conf['name_zh']} (第 {w_num} 周)",
            "activity": {
                "fr": act_fr,
                "en": act_en,
                "zh": act_zh
            },
            "activite_detaillee_fr": f"Travaux autorisés en {z_conf['name_full']} : {act_fr}. Respect strict des consignes CSPS, port des EPI et balisage de la zone.",
            "activite_detaillee_en": f"Authorized activities in {z_conf['name_en']}: {act_en}. Strict compliance with CSPS safety rules.",
            "activite_detaillee_zh": f"{z_conf['name_zh']} 许可作业：{act_zh}。严格执行CSPS安全规范。",
            "tasks_fr": z_tasks_fr,
            "tasks_en": z_tasks_en,
            "tasks_zh": z_tasks_zh,
            "equipements_a_installer": z_conf["default_equip"],
            "area": "Atelier Assemblage Stellantis (Algeria K9 CKD0)",
            "ouvrage": z_conf["ouvrage"],
            "zone": z_conf["name_full"],
            "location": z_conf["location"],
            "contractor": "SINYLON",
            "company": "SINYLON & W.P.E.E.X",
            "responsible": "Xie Xian (Chef de Projet Sinylon)",
            "tel": "+213 550 12 34 56",
            "contact": "Nouri Chahrour (HSE Sinylon)",
            "chefNom": "Xie Xian (Chef de Projet)",
            "chefEquipe": "Zhou Lin (Chef d'Équipe)",
            "wpeexNom": "M. W.P.E.E.X (Ingénieur de Suivi)",
            "hseNom": "Nouri Chahrour (Superviseur HSE)",
            "validFrom": d_start,
            "validUntil": d_end,
            "timeStart": "08h00",
            "timeEnd": "17h30",
            "status": status,
            "weekend": False,
            "dangers": z_conf["dangers"],
            "signatures": {
                "wpeex": {"name": "M. W.P.E.E.X", "title": "Ingénieur de Suivi Sinylon / Stellantis", "status": "VALIDATED", "date": d_start},
                "chef": {"name": "Xie Xian", "title": "Responsable Exécution Sinylon", "status": "VALIDATED", "date": d_start},
                "hse": {"name": "Nouri Chahrour", "title": "Superviseur HSE Sinylon", "status": "VALIDATED", "date": d_start},
                "receveur": {"name": "Zhou Lin", "title": "Receveur du Permis", "status": "VALIDATED", "date": d_start}
            },
            "revalidations": [
                {
                    "id": f"REV-{pid}-{i}",
                    "dayIndex": i + 1,
                    "date": (datetime.datetime.strptime(d_start, "%Y-%m-%d") + datetime.timedelta(days=i)).strftime("%Y-%m-%d"),
                    "time": "08:00",
                    "unchangedInfo": True,
                    "unchangedConditions": True,
                    "securityMeasuresApplicable": True,
                    "wpeexEngineer": "M. W.P.E.E.X (Ingénieur de Suivi)",
                    "wpeexValidated": True,
                    "execManager": "Xie Xian (Responsable Exécution Sinylon)",
                    "comments": f"Revalidation conforme Jour {i+1} pour {z_conf['name']} (08:00)."
                } for i in range(6)
            ]
        }

    # 2. Permis Weekend Spécial pour la caisse
    p_we_id = f"K9-W{w_num}-WE"
    permits_db[p_we_id] = {
        "id": p_we_id,
        "week": w_num,
        "weekLabel": f"W{w_num} — {range_lbl} (WEEK-END)",
        "type": "weekend",
        "type_permis": "Intervention Spéciale Week-end (Vendredi / Samedi)",
        "title": f"Caisse Week-end Sinylon — Semaine {w_num} (UB / UAR / FUSA)",
        "title_en": f"Weekend Special Dossier — Week {w_num} (UB / UAR / FUSA)",
        "title_zh": f"周末特别作业许可 — 第 {w_num} 周 (UB / UAR / FUSA)",
        "activity": {
            "fr": f"Travaux continus de week-end : consignation électrique LOTO, travaux en hauteur et mise en service (Vendredi {fri_date} & Samedi {sat_date})",
            "en": f"Weekend operations: electrical LOTO lockout, high-elevation alignment and equipment commissioning ({fri_date} & {sat_date})",
            "zh": f"周末连续作业：电气LOTO上锁挂牌、高空作业与设备调试（{fri_date} 与 {sat_date}）"
        },
        "activite_detaillee_fr": f"Dossier officiel de week-end K9 : interventions sur Zones UB, UAR et FUSA avec vérification LOTO sous visa M. W.P.E.E.X.",
        "area": "Atelier Assemblage Stellantis (Algeria K9 CKD0)",
        "ouvrage": "Lignes d'Assemblage K9 (UB / UAR / FUSA)",
        "zone": "Zones UB / UAR / FUSA",
        "location": "Atelier Assemblage Stellantis — Zones UB / UAR / FUSA",
        "contractor": "SINYLON",
        "company": "SINYLON & W.P.E.E.X",
        "responsible": "Xie Xian (Chef de Projet Sinylon)",
        "tel": "+213 550 12 34 56",
        "contact": "Nouri Chahrour (HSE Sinylon)",
        "chefNom": "Xie Xian (Chef de Projet)",
        "chefEquipe": "Zhou Lin (Chef d'Équipe)",
        "wpeexNom": "M. W.P.E.E.X (Ingénieur de Suivi)",
        "hseNom": "Nouri Chahrour (Superviseur HSE)",
        "validFrom": fri_date,
        "validUntil": sat_date,
        "timeStart": "08h00",
        "timeEnd": "18h00",
        "status": status,
        "weekend": True,
        "isWeekendWork": True,
        "dangers": {"height": True, "hot": True, "electric": True, "confined": False, "lifting": True, "tension": True, "emergencyPlan": True, "evacuationOk": True, "coactivity": True},
        "signatures": {
            "wpeex": {"name": "M. W.P.E.E.X", "title": "Ingénieur de Suivi Sinylon / Stellantis", "status": "VALIDATED", "date": fri_date},
            "chef": {"name": "Xie Xian", "title": "Responsable Exécution Sinylon", "status": "VALIDATED", "date": fri_date},
            "hse": {"name": "Nouri Chahrour", "title": "Superviseur HSE Sinylon", "status": "VALIDATED", "date": fri_date},
            "receveur": {"name": "Zhou Lin", "title": "Receveur du Permis", "status": "VALIDATED", "date": fri_date}
        },
        "revalidations": [
            {
                "id": f"REV-{p_we_id}-1",
                "dayIndex": 1,
                "date": fri_date,
                "time": "08:00",
                "unchangedInfo": True,
                "unchangedConditions": True,
                "securityMeasuresApplicable": True,
                "wpeexEngineer": "M. W.P.E.E.X (Ingénieur de Suivi)",
                "wpeexValidated": True,
                "execManager": "Xie Xian (Responsable Exécution Sinylon)",
                "comments": f"Revalidation Vendredi Week-end (08:00) — M. W.P.E.E.X"
            },
            {
                "id": f"REV-{p_we_id}-2",
                "dayIndex": 2,
                "date": sat_date,
                "time": "08:00",
                "unchangedInfo": True,
                "unchangedConditions": True,
                "securityMeasuresApplicable": True,
                "wpeexEngineer": "M. W.P.E.E.X (Ingénieur de Suivi)",
                "wpeexValidated": True,
                "execManager": "Xie Xian (Responsable Exécution Sinylon)",
                "comments": f"Revalidation Samedi Week-end (08:00) — M. W.P.E.E.X"
            }
        ]
    }

    # 3. Aliases pour compatibilité K9-Wxx-01 et SYN-K9-KWxx
    permits_db[f"K9-W{w_num}-01"] = permits_db[f"K9-W{w_num}-UB"]
    permits_db[f"SYN-K9-KW{w_num}"] = permits_db[f"K9-W{w_num}-UB"]

with open('k9_v2_permits.json', 'w', encoding='utf-8') as f:
    json.dump(permits_db, f, indent=2, ensure_ascii=False)

print(f"Generated {len(permits_db)} permits in k9_v2_permits.json successfully!")
