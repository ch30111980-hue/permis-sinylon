with open('create_official_a4_bundle.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace CSS classes
content = content.replace('.csps-fiat-logo', '.sinylon-logo-brand')
content = content.replace('.csps-badge', '.sinylon-badge')
content = content.replace('.fiat-badge', '.stellantis-badge')

# Replace CSPS FIAT header in all pages
old_div = """                <div class="csps-fiat-logo">
                    <span class="csps-badge">CSPS</span>
                    <span class="fiat-badge">FIAT</span>
                </div>"""

new_div = """                <div style="display:flex;align-items:center;gap:6px;">
                    <span style="background:#000;color:#fff;font-weight:900;font-size:13px;padding:2px 7px;border-radius:2px;letter-spacing:1px;">SINYLON</span>
                    <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:13px;padding:1px 7px;border-radius:2px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
                </div>"""

content = content.replace(old_div, new_div)

# In General P1 and P2 where there were separate SINYLON STELLANTIS spans plus CSPS FIAT
content = content.replace("""            <div style="display:flex;align-items:center;gap:6px;">
                <span style="background:#000;color:#fff;font-weight:900;font-size:13px;padding:2px 6px;border-radius:2px;">SINYLON</span>
                <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:13px;padding:1px 6px;border-radius:2px;background:#fff;">STELLANTIS</span>
                <div style="display:flex;align-items:center;gap:6px;">
                    <span style="background:#000;color:#fff;font-weight:900;font-size:13px;padding:2px 7px;border-radius:2px;letter-spacing:1px;">SINYLON</span>
                    <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:13px;padding:1px 7px;border-radius:2px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
                </div>
            </div>""", """            <div style="display:flex;align-items:center;gap:6px;">
                <span style="background:#000;color:#fff;font-weight:900;font-size:14px;padding:2px 8px;border-radius:2px;letter-spacing:1px;">SINYLON</span>
                <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:14px;padding:1px 8px;border-radius:2px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
            </div>""")

# ReportLab header table
content = content.replace('[annexe_letter, annexe_title, "CSPS FIAT", "Permis N°\\nSYN-K9-KW35"]', '[annexe_letter, annexe_title, "SINYLON\\nSTELLANTIS", "Permis N°\\nSYN-K9-KW35"]')

# Remove Henkel
content = content.replace('(Tel. Henkel Insurance Dept., 24h/weekend)', '(Tel. Stellantis Security / HSE Sinylon 24h/24)')

# Remove remaining mentions
content = content.replace('CSPS FIAT', 'SINYLON - STELLANTIS')
content = content.replace('csps_fiat', 'sinylon_stellantis')

with open('create_official_a4_bundle.py', 'w', encoding='utf-8') as f:
    f.write(content)

print('create_official_a4_bundle.py updated without CSPS FIAT!')
