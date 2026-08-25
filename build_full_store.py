import json

with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/k9_v2_permits.json', 'r', encoding='utf-8') as f:
    permits_data = json.load(f)

# Read the header of store.js
with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/js/store.js', 'r', encoding='utf-8') as f:
    store_content = f.read()

# Split at getSeedData()
parts = store_content.split('getSeedData() {')
if len(parts) >= 2:
    header = parts[0]
    # update storage key
    header = header.replace('sinylon_permits_database_v9', 'sinylon_permits_database_v11')
    header = header.replace('sinylon_permits_database_v10', 'sinylon_permits_database_v11')

    new_store = header + 'getSeedData() {\n        return ' + json.dumps(permits_data, indent=4, ensure_ascii=False) + ';\n    }\n};\n\nwindow.Store = Store;\n'
    with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/js/store.js', 'w', encoding='utf-8') as f:
        f.write(new_store)
    print("Updated js/store.js with new seed data successfully!")
else:
    print("Could not find getSeedData() split in store.js")
