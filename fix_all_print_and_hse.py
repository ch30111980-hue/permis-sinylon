import json
import os
import re

# 1. Update k9_v2_permits.json
with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/k9_v2_permits.json', 'r', encoding='utf-8') as f:
    permits = json.load(f)

for pid, p in permits.items():
    p['tel'] = '0563765157'
    p['contact'] = 'Nouri Chahrour (HSE Sinylon - 0563765157)'
    p['timeStart'] = '08h00'
    p['timeEnd'] = '17h30'
    p['time-start'] = '08h00'
    p['time-end'] = '17h30'
    if 'travailleurs' in p:
        for w in p['travailleurs']:
            if isinstance(w, dict) and 'Nouri' in w.get('nom', ''):
                w['tel'] = '0563765157'

with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/k9_v2_permits.json', 'w', encoding='utf-8') as f:
    json.dump(permits, f, indent=2, ensure_ascii=False)

print("Updated k9_v2_permits.json with phone 0563765157")
