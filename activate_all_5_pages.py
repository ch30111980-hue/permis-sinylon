import json

with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/k9_v2_permits.json', 'r', encoding='utf-8') as f:
    permits = json.load(f)

for pid, p in permits.items():
    if 'dangers' not in p or not isinstance(p['dangers'], dict):
        p['dangers'] = {}
    p['dangers']['height'] = True
    p['dangers']['hot'] = True
    p['dangers']['electric'] = True
    p['dangers']['lifting'] = True
    p['dangers']['tension'] = True
    p['annexes'] = ['height', 'hot', 'electric']
    p['tel'] = '0563765157'
    p['contact'] = 'Nouri Chahrour (HSE Sinylon - 0563765157)'

with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/k9_v2_permits.json', 'w', encoding='utf-8') as f:
    json.dump(permits, f, indent=2, ensure_ascii=False)

print("Updated all permits with all 3 annexes (height, hot, electric) active!")
