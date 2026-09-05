import json

with open('k9_v2_permits.json', 'r', encoding='utf-8') as f:
    permits = json.load(f)

js_content = """/**
 * SINYLON - STELLANTIS | Data Store & State Management V2 (Hybrid Server Sync & Offline LocalStorage)
 * Projet : Algeria K9 CKD0 (Installation & Commissioning)
 * Architecture 3 Zones : Zone UB, Zone UAR, Zone FUSA
 */

const Store = {
    STORAGE_KEY: "sinylon_permits_database_v12",
    SETTINGS_KEY: "sinylon_app_settings_v9",
    ARCHIVE_KEY: "sinylon_permits_archive_v9",
    DEFAULT_AUTH_CODE: "SINYLON2026",

    // Obtenir les paramètres de l'application
    getSettings() {
        const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(this.SETTINGS_KEY) : null;
        if (!raw) {
            const defaults = {
                authCode: this.DEFAULT_AUTH_CODE,
                projectName: "Algeria K9 CKD0",
                siteName: "STELLANTIS - Site Industriel Assemblage",
                companyName: "SINYLON & W.P.E.E.X",
                defaultHSE: "Nouri Chahrour (0563765157)",
                defaultWPEEX: "M. W.P.E.E.X (Ingénieur de Suivi)",
                defaultChef: "XIE XIAN (Chef de Projet)",
                defaultChefEquipe: "ZHOULIN (Chef d'Équipe)",
                defaultLang: "en"
            };
            if (typeof localStorage !== 'undefined') localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(defaults));
            return defaults;
        }
        try {
            return JSON.parse(raw);
        } catch (e) {
            return { authCode: this.DEFAULT_AUTH_CODE, defaultLang: "en" };
        }
    },

    saveSettings(settings) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
        }
    },

    // Gestion du Code d'Autorisation (hashé SHA-256)
    async initAuth() {
        const settings = this.getSettings();
        if (settings.authCode && !settings.authHash) {
            settings.authHash = await this.hashCode(settings.authCode.trim());
            delete settings.authCode;
            this.saveSettings(settings);
        } else if (!settings.authHash) {
            settings.authHash = await this.hashCode(this.DEFAULT_AUTH_CODE);
            delete settings.authCode;
            this.saveSettings(settings);
        } else if (settings.authCode) {
            delete settings.authCode;
            this.saveSettings(settings);
        }
    },

    async hashCode(code) {
        if (!code) return '';
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(code.trim());
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            return Array.from(new Uint8Array(hashBuffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        } catch (e) {
            return btoa(code.trim()).split('').reverse().join('');
        }
    },

    async verifyAuthCode(inputCode) {
        if (!inputCode) return false;
        const settings = this.getSettings();
        const storedHash = settings.authHash;
        if (!storedHash) return false;
        const inputHash = await this.hashCode(inputCode.trim());
        return inputHash === storedHash;
    },

    async setAuthCode(newCode) {
        if (!newCode || newCode.trim().length < 4) {
            return { success: false, error: 'Le code doit comporter au moins 4 caractères.' };
        }
        const settings = this.getSettings();
        settings.authHash = await this.hashCode(newCode.trim());
        delete settings.authCode;
        this.saveSettings(settings);
        return { success: true };
    },

    // =========================================================================
    // MOTEUR DE SEMAINE ACTIVE (AUTO WEEK ENGINE)
    // =========================================================================

    getCurrentWeekNumber(targetDate = new Date()) {
        const d = new Date(Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        
        if (weekNo >= 25 && weekNo <= 53) return weekNo;
        return 36;
    },

    getWeekRange(weekNum) {
        const calendar = {
            25: "15 Jun → 21 Jun 2026",
            26: "22 Jun → 28 Jun 2026",
            27: "29 Jun → 05 Jul 2026",
            28: "06 Jul → 12 Jul 2026",
            29: "13 Jul → 19 Jul 2026",
            30: "20 Jul → 26 Jul 2026",
            31: "27 Jul → 02 Aug 2026",
            32: "03 Aug → 09 Aug 2026",
            33: "10 Aug → 16 Aug 2026",
            34: "17 Aug → 23 Aug 2026",
            35: "24 Aug → 30 Aug 2026",
            36: "31 Aug → 06 Sep 2026",
            37: "07 Sep → 13 Sep 2026",
            38: "14 Sep → 20 Sep 2026",
            39: "21 Sep → 27 Sep 2026",
            40: "28 Sep → 04 Oct 2026",
            41: "05 Oct → 11 Oct 2026",
            42: "12 Oct → 18 Oct 2026",
            43: "19 Oct → 25 Oct 2026",
            44: "26 Oct → 01 Nov 2026",
            45: "02 Nov → 08 Nov 2026",
            46: "09 Nov → 15 Nov 2026",
            47: "16 Nov → 22 Nov 2026",
            48: "23 Nov → 29 Nov 2026",
            49: "30 Nov → 06 Dec 2026",
            50: "07 Dec → 13 Dec 2026",
            51: "14 Dec → 20 Dec 2026",
            52: "21 Dec → 27 Dec 2026",
            53: "28 Dec → 03 Jan 2027"
        };
        return calendar[weekNum] || "Semaine active";
    },

    getAvailableWeeks() {
        const weeks = [];
        for (let w = 25; w <= 53; w++) {
            weeks.push(w);
        }
        return weeks;
    },

    getPermitsByWeek(weekNum) {
        const permits = this.getAllPermits();
        const num = parseInt(weekNum, 10);
        const seen = new Set();
        const result = [];
        
        // Ordre prioritaire : UB, UAR, FUSA, WE
        const preferredIds = [
            `K9-W${num}-UB`,
            `K9-W${num}-UAR`,
            `K9-W${num}-FUSA`,
            `K9-W${num}-WE`
        ];

        preferredIds.forEach(id => {
            if (permits[id] && !seen.has(id)) {
                seen.add(id);
                result.push(permits[id]);
            }
        });

        // Ajouter tout autre permis personnalisé pour cette semaine
        Object.values(permits).forEach(p => {
            if (p && p.week === num && !p.id.startsWith("SYN-K9-KW") && !p.id.endsWith("-01") && !seen.has(p.id)) {
                seen.add(p.id);
                result.push(p);
            }
        });

        return result;
    },

    // =========================================================================
    // SYNCHRONISATION SERVEUR & LOCALSTORAGE
    // =========================================================================

    async syncWithServer() {
        if (typeof fetch === 'undefined') return;
        try {
            const res = await fetch('/api/permits', { cache: 'no-cache' });
            if (res.ok) {
                const serverPermits = await res.json();
                if (serverPermits && Object.keys(serverPermits).length > 0) {
                    this.saveAllPermits(serverPermits);
                    console.log('🔄 Données synchronisées avec le serveur Render en direct.');
                }
            }
        } catch (e) {
            console.log('Mode hors-ligne / LocalStorage actif.');
        }
    },

    async getPermitAsync(id) {
        if (!id) return null;
        if (typeof fetch !== 'undefined') {
            try {
                const res = await fetch(`/api/permits/${encodeURIComponent(id)}`, { cache: 'no-cache' });
                if (res.ok) {
                    const freshPermit = await res.json();
                    if (freshPermit && freshPermit.id) {
                        const local = this.getAllPermits();
                        local[freshPermit.id] = freshPermit;
                        this.saveAllPermits(local);
                        return freshPermit;
                    }
                }
            } catch (e) {}
        }
        return this.getPermit(id);
    },

    getAllPermits() {
        const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(this.STORAGE_KEY) : null;
        if (!raw) {
            const initial = this.getSeedData();
            if (typeof localStorage !== 'undefined') this.saveAllPermits(initial);
            return initial;
        }
        try {
            return JSON.parse(raw);
        } catch (e) {
            console.error("Error parsing stored permits, resetting seed:", e);
            const initial = this.getSeedData();
            if (typeof localStorage !== 'undefined') this.saveAllPermits(initial);
            return initial;
        }
    },

    saveAllPermits(permits) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(permits));
        }
    },

    getPermit(id) {
        const permits = this.getAllPermits();
        if (!permits || Object.keys(permits).length === 0) return null;
        if (!id) return permits['K9-W36-UB'] || Object.values(permits)[0];
        
        // 1. Match direct
        if (permits[id]) return permits[id];
        
        // 2. Match insensible à la casse et sans espaces
        const clean = String(id).trim().toUpperCase();
        for (const key of Object.keys(permits)) {
            if (key.toUpperCase() === clean) return permits[key];
        }

        // 3. Fallback syntaxique (ex: K9-W36-01 -> K9-W36-UB)
        if (clean.endsWith('-01')) {
            const ubId = clean.replace('-01', '-UB');
            if (permits[ubId]) return permits[ubId];
        }
        if (clean.startsWith('SYN-K9-KW')) {
            const wNum = clean.replace('SYN-K9-KW', '');
            const ubId = `K9-W${wNum}-UB`;
            if (permits[ubId]) return permits[ubId];
        }

        return Object.values(permits)[0];
    },

    savePermit(permit) {
        if (!permit || !permit.id) return;
        const permits = this.getAllPermits();
        permits[permit.id] = permit;
        this.saveAllPermits(permits);

        if (typeof fetch !== 'undefined') {
            fetch('/api/permits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(permits)
            }).catch(() => console.log('Mode hors-ligne, données stockées localement.'));
        }
    },

    getSeedData() {
        return """ + json.dumps(permits, indent=4, ensure_ascii=False) + """;
    }
};

if (typeof window !== 'undefined') {
    window.Store = Store;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Store;
}
"""

with open('js/store.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Generated js/store.js with 3-Zone Architecture successfully!")
