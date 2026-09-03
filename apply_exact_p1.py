#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
from exact_general_p1 import build_general_p1

# 1. Update generate_new_templates.py
with open('generate_new_templates.py', 'r', encoding='utf-8') as f:
    code = f.read()

new_p1 = build_general_p1()

# Replace generalP1 in generate_new_templates.py
pattern = r'generalP1\(permit\)\s*\{[\s\S]*?\n\s*\},'
code = re.sub(pattern, new_p1.strip(), code)

with open('generate_new_templates.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("generate_new_templates.py mis à jour avec le modèle exact de la photo !")
