import json

with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/k9_v2_permits.json', 'r', encoding='utf-8') as f:
    permits = json.load(f)

js_content = """/**
 * SINYLON - STELLANTIS | Data Store & State Management V2
 * Projet : Algeria K9 CKD0 (Installation & Commissioning)
 * Architecture centrée sur l'objet Permis et Semaine Active (KW25 à KW53)
 * Responsables : Chef de Projet : Xie Xian | Receveur : Xie Xian | Suivi : W.P.E.E.X | HSE : Nouri Chahrour
 */

const Store = {
    STORAGE_KEY: "sinylon_permits_database_v9",
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

    // Gestion du Code d'Autorisation
    getAuthCode() {
        const settings = this.getSettings();
        return settings.authCode || this.DEFAULT_AUTH_CODE;
    },

    setAuthCode(newCode) {
        if (!newCode || newCode.trim().length < 4) {
            return { success: false, error: "Le code doit comporter au moins 4 caractères." };
        }
        const settings = this.getSettings();
        settings.authCode = newCode.trim();
        this.saveSettings(settings);
        return { success: true };
    },

    verifyAuthCode(inputCode) {
        if (!inputCode) return false;
        const currentCode = this.getAuthCode();
        return inputCode.trim() === currentCode.trim();
    },

    // =========================================================================
    // MOTEUR DE SEMAINE ACTIVE (AUTO WEEK ENGINE)
    // =========================================================================

    // Calcul automatique de la semaine ISO actuelle
    getCurrentWeekNumber(targetDate = new Date()) {
        const d = new Date(Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        
        // Si on est dans la plage K9 (KW25-53)
        if (weekNo >= 25 && weekNo <= 53) return weekNo;
        // Par défaut pour la phase active (Août 2026) -> W35
        return 35;
    },

    // Plage de dates formatée d'une semaine
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
        return calendar[weekNum] || `Semaine ${weekNum}`;
    },

    // Liste triée des semaines disponibles
    getAvailableWeeks() {
        const weeks = [];
        for (let w = 25; w <= 53; w++) {
            weeks.push(w);
        }
        return weeks;
    },

    // Récupérer tous les permis d'une semaine spécifique sans doublons
    getPermitsByWeek(weekNum) {
        const permits = this.getAllPermits();
        const num = parseInt(weekNum, 10);
        const seen = new Set();
        const result = [];
        Object.values(permits).forEach(p => {
            if (p && p.week === num && !p.id.startsWith("SYN-K9-KW") && !seen.has(p.id)) {
                seen.add(p.id);
                result.push(p);
            }
        });
        return result;
    },

    // =========================================================================
    // ACCÈS ET GESTION DES PERMIS
    // =========================================================================

    // Obtenir tous les permis actifs
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

    // Sauvegarder l'ensemble des permis
    saveAllPermits(permits) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(permits));
        }
    },

    // Obtenir un permis par son ID (supporte K9-W35-01, SYN-K9-KW35, etc.)
    getPermit(id) {
        if (!id) return null;
        const permits = this.getAllPermits();
        if (permits[id]) return permits[id];
        
        const normalized = id.trim().toUpperCase();
        for (const key of Object.keys(permits)) {
            if (key.toUpperCase() === normalized) return permits[key];
        }
        return null;
    },

    // Créer ou mettre à jour un permis
    savePermit(permit) {
        if (!permit) return null;
        const permits = this.getAllPermits();
        if (!permit.id) {
            permit.id = this.generateId();
        }
        
        const now = new Date();
        if (!permit.createdAt) permit.createdAt = now.toISOString();
        permit.updatedAt = now.toISOString();

        if (!permit.historique_modifications) permit.historique_modifications = [];
        if (!permit.travailleurs) permit.travailleurs = [];
        if (!permit.revalidations) permit.revalidations = [];

        if (!permit.qr) permit.qr = {};
        permit.qr.enabled = true;
        permit.qr.url = `https://permis-sinylon.onrender.com/?permitId=${permit.id}`;

        permits[permit.id] = permit;
        this.saveAllPermits(permits);
        return permit;
    },

    // Supprimer un permis
    deletePermit(id) {
        const permits = this.getAllPermits();
        if (permits[id]) {
            delete permits[id];
            this.saveAllPermits(permits);
            return true;
        }
        return false;
    },

    // Réinitialiser les permis
    resetCleanPermits() {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(this.STORAGE_KEY);
        }
        const initial = this.getSeedData();
        this.saveAllPermits(initial);
        return initial;
    },

    // Générer un identifiant officiel
    generateId(weekNum = 35) {
        const randNum = Math.floor(10 + Math.random() * 90);
        return `K9-W${weekNum}-${randNum}`;
    },

    // Données initiales certifiées V2
    getSeedData() {
        return """ + json.dumps(permits, indent=2, ensure_ascii=False) + """;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Store;
}
"""

with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/js/store.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Built guarded and deduplicated js/store.js successfully!")
