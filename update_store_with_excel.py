import json
import datetime

# Load Excel weekly mapping
with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/excel_weekly_mapping.json', 'r', encoding='utf-8') as f:
    excel_weeks = json.load(f)

# Load existing permits
with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/k9_v2_permits.json', 'r', encoding='utf-8') as f:
    v2_permits = json.load(f)

# Official team
official_workers = [
    {"id": "T-1", "nom": "Xie", "role": "Chef de Projet / Receveur", "badge": "SYN-001"},
    {"id": "T-2", "nom": "Nouri Chahrour", "role": "Superviseur HSE Sinylon", "badge": "SYN-003", "tel": "+213 550 12 34 56"}
]

zone_name_full = {
    "UB": "Zone UB (Underbody / Soubassement)",
    "UAR": "Zone UAR (Underbody Rear / Soubassement Arrière)",
    "FUSA": "Zone FUSA (Front Underbody Sub-Assembly / Soubassement Avant)"
}

for pid, p in v2_permits.items():
    w_str = str(p.get('week', 35))
    w_info = excel_weeks.get(w_str, {})
    
    tasks_fr = w_info.get('tasks_fr', [])
    tasks_en = w_info.get('tasks_en', [])
    tasks_zh = w_info.get('tasks_zh', [])
    eq_list = w_info.get('equipmentList', [])
    zones_list = w_info.get('zones', ['UB', 'UAR', 'FUSA'])

    # Determine specific zone for this permit type
    p_type = p.get('type', 'general')
    
    if p_type == 'height':
        p['zone'] = f"Zone {' / '.join(zones_list)} — Travaux en Hauteur (Nacelles)"
        p['equipements_a_installer'] = [eq for eq in eq_list if any(k in eq.lower() for k in ['kbk', 'rail', 'poutre', 'charpente', 'éclairage', 'ventilateur', 'barre', 'nacelle'])] or eq_list[:4]
    elif p_type == 'hot':
        p['zone'] = f"Zone {' / '.join(zones_list)} — Soudage & Meulage"
        p['equipements_a_installer'] = [eq for eq in eq_list if any(k in eq.lower() for k in ['soudage', 'pince', 'contrôleur', 'tuyauterie', 'torche'])] or eq_list[:4]
    elif p_type == 'electric':
        p['zone'] = f"Zone {' / '.join(zones_list)} — Raccordement Électrique & Énergie"
        p['equipements_a_installer'] = [eq for eq in eq_list if any(k in eq.lower() for k in ['barre', 'câble', 'armoire', 'ig1', 'ig2', 'énergie', 'puissance'])] or eq_list[:4]
    elif p_type == 'weekend':
        p['zone'] = f"Zone {' / '.join(zones_list)} — Caisse Week-end Sinylon"
        p['equipements_a_installer'] = eq_list[:5]
    else:
        # General / Mechanical
        p['zone'] = f"Zone {' / '.join(zones_list)} ({' + '.join([zone_name_full.get(z, z) for z in zones_list])})"
        p['equipements_a_installer'] = eq_list

    # Trilingual task details from Excel
    if tasks_fr:
        p['activite_detaillee_fr'] = " • " + "\n • ".join(tasks_fr)
        p['activite_detaillee_en'] = " • " + "\n • ".join(tasks_en)
        p['activite_detaillee_zh'] = " • " + "\n • ".join(tasks_zh)
        p['work-desc'] = " ; ".join(tasks_fr[:3])
        p['activity']['fr'] = " ; ".join(tasks_fr[:3])
        p['activity']['en'] = " ; ".join(tasks_en[:3])
        p['activity']['zh'] = " ; ".join(tasks_zh[:3])

    p['timeStart'] = '08h00'
    p['timeEnd'] = '17h30'
    p['time-start'] = '08h00'
    p['time-end'] = '17h30'

# Save back to k9_v2_permits.json
with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/k9_v2_permits.json', 'w', encoding='utf-8') as f:
    json.dump(v2_permits, f, indent=2, ensure_ascii=False)

print("Updated all 145 permits in k9_v2_permits.json with exact Excel zones and equipment!")
