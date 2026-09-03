with open('generate_new_templates.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace CSPS FIAT logo function with SINYLON - STELLANTIS
old_logo = """    // Helper Logo CSPS FIAT conforme aux photos officielles
    renderLogoCSPSFIAT() {
        return `
            <div class="csps-fiat-logo" style="display:inline-flex;align-items:center;border:1.5px solid #000;border-radius:2px;overflow:hidden;height:24px;vertical-align:middle;">
                <span style="background:#000;color:#fff;font-weight:900;font-size:13px;padding:2px 6px;letter-spacing:1px;display:flex;align-items:center;height:100%;">CSPS</span>
                <span style="background:#fff;color:#c00;font-weight:900;font-size:13px;padding:2px 6px;letter-spacing:1px;font-style:italic;display:flex;align-items:center;height:100%;font-family:Arial,Helvetica,sans-serif;">FIAT</span>
            </div>
        `;
    },"""

new_logo = """    // Logo officiel SINYLON - STELLANTIS
    renderLogoSinylonStellantis() {
        return `
            <div style="display:inline-flex;align-items:center;gap:6px;vertical-align:middle;">
                <span style="background:#000;color:#fff;font-weight:900;font-size:13px;padding:2px 7px;border-radius:2px;letter-spacing:1px;">SINYLON</span>
                <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:13px;padding:1px 7px;border-radius:2px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
            </div>
        `;
    },"""

content = content.replace(old_logo, new_logo)

# In General P1
content = content.replace("""                    <div style="display:flex;align-items:center;gap:6px;">
                        <span style="background:#000;color:#fff;font-weight:900;font-size:13px;padding:2px 6px;border-radius:2px;">SINYLON</span>
                        <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:13px;padding:1px 6px;border-radius:2px;background:#fff;">STELLANTIS</span>
                        ${this.renderLogoCSPSFIAT()}
                    </div>""", """                    <div style="display:flex;align-items:center;gap:6px;">
                        ${this.renderLogoSinylonStellantis()}
                    </div>""")

# In General P2
content = content.replace("""                    <div style="display:flex;align-items:center;gap:6px;">
                        <span style="background:#000;color:#fff;font-weight:900;font-size:13px;padding:2px 6px;border-radius:2px;">SINYLON</span>
                        <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:13px;padding:1px 6px;border-radius:2px;background:#fff;">STELLANTIS</span>
                        ${this.renderLogoCSPSFIAT()}
                    </div>""", """                    <div style="display:flex;align-items:center;gap:6px;">
                        ${this.renderLogoSinylonStellantis()}
                    </div>""")

# In Annexes A, B, C
content = content.replace('${this.renderLogoCSPSFIAT()}', '${this.renderLogoSinylonStellantis()}')

# Remove Henkel
content = content.replace('(Tel. Henkel Insurance Dept., 24h/weekend)', '(Tel. Stellantis Security / HSE Sinylon 24h/24)')

# Update comments
content = content.replace('CSPS FIAT', 'SINYLON - STELLANTIS')
content = content.replace('csps-fiat', 'sinylon-stellantis')

with open('generate_new_templates.py', 'w', encoding='utf-8') as f:
    f.write(content)

print('generate_new_templates.py updated successfully without CSPS FIAT!')
