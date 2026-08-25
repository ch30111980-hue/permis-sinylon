import json

with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/k9_weekly_permits.json', 'r', encoding='utf-8') as f:
    permits = json.load(f)

for pid, p in permits.items():
    iso_week = p.get('week_num', 35)
    w_start = p.get('date_debut', '2026-08-24')
    w_end = p.get('date_fin', '2026-08-30')
    zones_str = p.get('zone', 'Zones UB / UAR / FUSA')
    
    # 1. Dangers Flags
    # Plan d'urgence retiré à la demande de l'utilisateur (pour éviter demandes de détails du maître d'ouvrage)
    p['dangers'] = {
        'height': True,
        'hot': True,
        'electric': True,
        'confined': False,
        'tension': True,
        'excavation': False,
        'rupture': True,
        'atmosphere': False,
        'methodReq': True,
        'moc': False,
        'emergencyPlan': False, # Pas de plan d'urgence attaché
        'ppe': True
    }
    
    # 2. Toutes les annexes disponibles
    p['annexes'] = ['height', 'hot', 'electric']
    
    # 3. Équipe et Intervenants : UNIQUEMENT Xie (Chef de Projet) et Nouri Chahrour (HSE).
    # Pas de faux prénoms inventés (laisser les slots d'intervenants vides / à compléter sur le terrain).
    p['chef-nom'] = 'Xie (Chef de Projet)'
    p['hse-nom'] = 'Nouri Chahrour (HSE Sinylon)'
    p['wpeex-nom'] = 'M. W.P.E.E.X (Ingénieur de Suivi)'
    p['receveur-nom'] = '' # Laisser vide pour signature sur site
    
    p['workers'] = [
        'Xie (Chef de Projet)',
        'Nouri Chahrour (HSE Sinylon)'
    ]
    
    p['travailleurs'] = [] # Liste vide pour ajout manuel sur le terrain sans faux prénoms
    
    # 4. Annexe A: Hauteur — 6 Nacelles Ciseaux + 1 Manlift (Pas d'échafaudages)
    p['heightDetails'] = {
        'platform': True, # Nacelles PEMP
        'mobileScaffold': False, # Pas d'échafaudage
        'fixedScaffold': False,  # Pas d'échafaudage
        'ladder': False,
        'scissorLiftsCount': 6, # 6 Nacelles ciseaux
        'manliftCount': 1,      # 1 Manlift
        'equipmentDesc': '6 Nacelles Ciseaux + 1 Manlift (PEMP)',
        'harnessChecked': True,
        'operatorTrained': True, # CACES / Opérateurs formés
        'weatherClear': True,
        'dryFloor': True,
        'qualifiedApproved': True,
        'fallArrest': True,
        'safetyNet': False,
        'perimeterBarred': True,
        'trafficBlocked': True,
        'overheadProtected': True,
        'emergencyExitClear': True,
        'equipmentToProtect': 'Chemins de câbles, armoires électriques et tuyauteries',
        'ambientConditions': 'Sol sec et nivelé, éclairage d\'atelier conforme',
        'specialMeasures': 'Port obligatoire du harnais de sécurité avec longe d\'assujettissement en nacelle'
    }
    
    # 5. Annexe B: Chaud & Soudage — Pas de détecteurs de fumée (usine en montage), pas de surveillance 2h après
    p['hotDetails'] = {
        'inflammablesClear10m': True,
        'debrisCleaned': True,
        'fireproofTarps': True,
        'drainsClosed': True,
        'ventilationAdequate': True,
        'cablesProtected': True,
        'gasSurveyDone': True,
        'extinguisherWater': True,
        'extinguisherPowder': True,
        'extinguisherCO2': True,
        'fireWatcherPresent': True,
        'fireWatcherName': '', # À renseigner sur site
        'alarmZone': 'Poste Central Sécurité Stellantis',
        'detectorBypass': False, # Pas de détecteurs de fumée actuellement dans l'usine
        'detectorStatus': 'Usine en phase montage — Détecteurs de fumée non activés',
        'postWorkWatch': False, # Pas de surveillance 2h requise
        'surveillanceDesc': 'Surveillance immédiate continue pendant l\'exécution des travaux de soudage / meulage'
    }
    
    # 6. Annexe C & Général: Tirage de câbles, armoires électriques, moteurs et équipements
    p['electricDetails'] = {
        'consignationChecked': True,
        'voltageAbsenceChecked': True,
        'lockoutTagout': True,
        'padlockRef': 'Cadenas de consignation SINYLON',
        'habilitationNiveau': 'B2V / BR / BC / H1V',
        'protectiveGloves': True,
        'isolatedTools': True,
        'schematicAttached': True,
        'cablePulling': True,      # Tirage de câbles
        'switchboardInstall': True, # Installation des armoires électriques
        'motorsInstall': True,      # Installation des moteurs et motoréducteurs
        'equipmentHookup': True,    # Raccordement et pose des équipements industriels
        'vatDeviceRef': 'Vérificateur d\'Absence de Tension (VAT conforme)',
        'groundingApplied': True
    }

with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/k9_weekly_permits.json', 'w', encoding='utf-8') as f:
    json.dump(permits, f, indent=2, ensure_ascii=False)

print('Enriched all 29 permits according to exact user instructions!')
