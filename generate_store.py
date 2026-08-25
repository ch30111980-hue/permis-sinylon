import json

with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/k9_weekly_permits.json', 'r', encoding='utf-8') as f:
    permits = json.load(f)

js_content = """/**
 * SINYLON - STELLANTIS | Data Store & State Management
 * Projet : Algeria K9 CKD0 (Installation & Commissioning)
 * Permis hebdomadaires automatiques du planning officiel (KW25 à KW53)
 * Responsables : Chef de Projet : Xie | Receveur : Xian | Suivi : W.P.E.E.X | HSE : Nouri Chahrour
 */

const Store = {
    STORAGE_KEY: "sinylon_permits_database_v8",
    SETTINGS_KEY: "sinylon_app_settings_v8",
    ARCHIVE_KEY: "sinylon_permits_archive_v8",
    DEFAULT_AUTH_CODE: "SINYLON2026",

    // Obtenir les paramètres de l'application
    getSettings() {
        const raw = localStorage.getItem(this.SETTINGS_KEY);
        if (!raw) {
            const defaults = {
                authCode: this.DEFAULT_AUTH_CODE,
                projectName: "Algeria K9 CKD0",
                siteName: "STELLANTIS - Site Industriel Assemblage",
                companyName: "SINYLON & W.P.E.E.X",
                defaultHSE: "Nouri Chahrour (0563765157)",
                defaultWPEEX: "M. W.P.E.E.X (Ingénieur de Suivi)",
                defaultChef: "XIE XIAN (Chef de Projet)",
                defaultChefEquipe: "ZHOULIN (Chef d'Équipe)"
            };
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(defaults));
            return defaults;
        }
        try {
            return JSON.parse(raw);
        } catch (e) {
            return { authCode: this.DEFAULT_AUTH_CODE };
        }
    },

    saveSettings(settings) {
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    },

    // Gestion sécurisée du Code d'Autorisation
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

    // Obtenir tous les permis actifs (29 semaines Algeria K9 CKD0)
    getAllPermits() {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (!raw) {
            const initial = this.getSeedData();
            this.saveAllPermits(initial);
            return initial;
        }
        try {
            return JSON.parse(raw);
        } catch (e) {
            console.error("Error parsing stored permits, resetting seed:", e);
            const initial = this.getSeedData();
            this.saveAllPermits(initial);
            return initial;
        }
    },

    // Sauvegarder l'ensemble des permis
    saveAllPermits(permits) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(permits));
    },

    // Obtenir un permis par son ID
    getPermit(id) {
        if (!id) return null;
        const permits = this.getAllPermits();
        return permits[id] || null;
    },

    // Créer ou mettre à jour un permis
    savePermit(permit) {
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

        permit.status = this.calculateStatus(permit);

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

    // Archiver tous les permis
    archiveCurrentPermits() {
        const permits = this.getAllPermits();
        localStorage.setItem(this.ARCHIVE_KEY, JSON.stringify(permits));
    },

    // Vider et réinitialiser les 29 permis hebdomadaires K9 CKD0
    resetCleanPermits() {
        localStorage.removeItem(this.STORAGE_KEY);
        const initial = this.getSeedData();
        this.saveAllPermits(initial);
        return initial;
    },

    // Générer un identifiant officiel SINYLON standardisé
    generateId(suffix = "") {
        const year = new Date().getFullYear();
        const randNum = Math.floor(10000 + Math.random() * 90000);
        return suffix ? `SYN-K9-${year}-${suffix}` : `SYN-K9-${year}-${randNum}`;
    },

    // Calcul dynamique du statut du permis
    calculateStatus(permit) {
        if (permit.is_blocked || permit.isBlocked) return "BLOQUE";
        if (permit.is_closed || permit.isClosed) return "CLOTURE";
        if (permit.is_suspended || permit.isSuspended) return "SUSPENDU";
        if (permit.statusOverride) return permit.statusOverride;
        
        if (!permit.wpeexValidated && !permit["wpeex-nom"]) {
            return "EN_ATTENTE_WPEEX";
        }

        if (permit.needsRevalidation) {
            return "REVALIDATION_REQUISE";
        }

        return permit.status || "VALIDE";
    },

    // =========================================================================
    // MODIFICATION SÉCURISÉE PAR CODE D'AUTORISATION (QR TERRAIN)
    // =========================================================================

    applyFieldModification(permitId, fieldKey, newValue, inputAuthCode, authorName = "Superviseur Chantier") {
        if (!this.verifyAuthCode(inputAuthCode)) {
            return {
                success: false,
                error: "Code d'autorisation incorrect. Modification rejetée."
            };
        }

        const permit = this.getPermit(permitId);
        if (!permit) {
            return {
                success: false,
                error: `Permis [${permitId}] introuvable.`
            };
        }

        const protectedFields = [
            "id", "createdAt", "date_creation", "_numero_permis_cache", 
            "signatures", "historique_modifications", "type", "type_permis"
        ];
        if (protectedFields.includes(fieldKey)) {
            return {
                success: false,
                error: `Le champ [${fieldKey}] est strictement protégé et ne peut pas être modifié depuis le terrain.`
            };
        }

        const allowedFieldsMap = {
            "chef-nom": "Responsable / Chef de Projet",
            "receveur-nom": "Receveur du Permis",
            "chef_equipe": "Chef d'Équipe",
            "contact": "Personne de Contact",
            "tel": "Téléphone Contact",
            "location": "Localisation / Détails",
            "zone": "Zone de Travail",
            "notes_chantier": "Notes & Remarques Terrain"
        };

        const now = new Date();
        const dateStr = now.toLocaleDateString("fr-FR");
        const heureStr = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

        let oldValue = "";
        let labelChamp = allowedFieldsMap[fieldKey] || fieldKey;

        if (fieldKey === "travailleurs_add") {
            labelChamp = "Ajout d'intervenant";
            oldValue = `${(permit.travailleurs || []).length} intervenants`;
            if (!permit.travailleurs) permit.travailleurs = [];
            permit.travailleurs.push(newValue);
            newValue = `${newValue.nom} (${newValue.badge || "Sans badge"})`;
        } else if (fieldKey === "travailleurs_remove") {
            labelChamp = "Retrait d'intervenant";
            oldValue = newValue.nom || "Intervenant";
            permit.travailleurs = (permit.travailleurs || []).filter(t => t.id !== newValue.id && t.nom !== newValue.nom);
            newValue = "Retiré de l'équipe";
        } else {
            oldValue = permit[fieldKey] !== undefined ? String(permit[fieldKey]) : "Non renseigné";
            permit[fieldKey] = newValue;
        }

        if (!permit.historique_modifications) permit.historique_modifications = [];

        const logEntry = {
            id: "LOG-" + Date.now(),
            permis_id: permit.id,
            champ: labelChamp,
            champ_key: fieldKey,
            ancienne_valeur: oldValue,
            nouvelle_valeur: String(newValue),
            methode: "QR_TERRAIN",
            date: dateStr,
            heure: heureStr,
            timestamp: now.toISOString(),
            auteur: authorName || "Superviseur Chantier"
        };

        permit.historique_modifications.unshift(logEntry);
        permit.updatedAt = now.toISOString();

        this.savePermit(permit);

        return {
            success: true,
            permit: permit,
            log: logEntry
        };
    },

    // Ajouter une revalidation
    addRevalidation(permitId, revalData) {
        const permit = this.getPermit(permitId);
        if (!permit) return null;

        if (!permit.revalidations) permit.revalidations = [];

        const weekNumber = permit.revalidations.length + 1;
        const now = new Date();

        const newEntry = {
            id: "REV-" + Date.now(),
            weekNumber: weekNumber,
            session: revalData.session || "Matin",
            date: revalData.date || now.toISOString().split("T")[0],
            time: revalData.time || `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
            unchangedInfo: revalData.unchangedInfo !== false,
            unchangedConditions: revalData.unchangedConditions !== false,
            securityMeasuresApplicable: revalData.securityMeasuresApplicable !== false,
            hasModifications: !!revalData.hasModifications,
            modificationNotes: revalData.modificationNotes || "",
            wpeexEngineer: revalData.wpeexEngineer || permit["wpeex-nom"] || "M. W.P.E.E.X (Ingénieur de Suivi)",
            wpeexValidated: true,
            execManager: revalData.execManager || permit["chef-nom"] || "Xie (Chef de Projet)",
            comments: revalData.comments || "Revalidation conforme (K9 CKD0 Protocol)"
        };

        permit.revalidations.push(newEntry);
        permit.needsRevalidation = false;
        permit.lastRevalidationDate = newEntry.date;
        if (permit.status !== "CLOTURE") {
            permit.status = "VALIDE";
        }

        this.savePermit(permit);
        return permit;
    },

    // 29 Permis Hebdomadaires Générés depuis le Planning Officiel Algeria K9 CKD0
    getSeedData() {
        return """ + json.dumps(permits, indent=4, ensure_ascii=False) + """;
    }
};

window.Store = Store;
"""

with open('/Users/nourine/.gemini/antigravity-ide/scratch/permis-sinylon/js/store.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print('Store.js regenerated cleanly with double quotes!')
