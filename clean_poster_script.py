with open('create_poster_a4_qr.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace CSPS FIAT with pure SINYLON - STELLANTIS
old_header = """        <div style="display:flex;align-items:center;gap:12px;">
            <span style="background:#000;color:#fff;font-weight:900;font-size:22px;padding:5px 12px;border-radius:4px;">SINYLON</span>
            <span style="border:2.5px solid #000;color:#000;font-weight:900;font-size:22px;padding:4px 12px;border-radius:4px;">STELLANTIS</span>
            <div class="csps-fiat-logo">
                <span class="csps-badge">CSPS</span>
                <span class="fiat-badge">FIAT</span>
            </div>
        </div>"""

new_header = """        <div style="display:flex;align-items:center;gap:12px;">
            <span style="background:#000;color:#fff;font-weight:900;font-size:24px;padding:5px 14px;border-radius:4px;letter-spacing:1px;">SINYLON</span>
            <span style="border:2.5px solid #000;color:#000;font-weight:900;font-size:24px;padding:4px 14px;border-radius:4px;letter-spacing:1px;background:#fff;">STELLANTIS</span>
        </div>"""

content = content.replace(old_header, new_header)

with open('create_poster_a4_qr.py', 'w', encoding='utf-8') as f:
    f.write(content)

print('create_poster_a4_qr.py updated without CSPS FIAT!')
