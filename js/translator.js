/**
 * SINYLON - STELLANTIS | Bilingual Translation Engine (FR ⇄ EN)
 * Traduction automatique instantanée pour les descriptions de travail, titres et consignes.
 * Fonctionne hors-ligne via un dictionnaire industriel technique complet + API en ligne si disponible.
 */

const Translator = {
    // Dictionnaire technique spécialisé BTPH / Industrie automobile Stellantis / Sécurité HSE
    dictionary: {
        // Opérations & Travaux
        "travaux de maintenance": "maintenance work",
        "maintenance préventive": "preventive maintenance",
        "maintenance corrective": "corrective maintenance",
        "pont roulant": "overhead crane",
        "structure métallique": "steel structure / metal framework",
        "inspection mécanique": "mechanical inspection",
        "graissage des paliers": "bearing lubrication",
        "graissage": "lubrication / greasing",
        "vérification des ancrages": "anchorage check / inspection",
        "ancrages": "anchorages",
        "remplacement tuyauterie": "piping replacement",
        "tuyauterie": "piping / pipelines",
        "soudure": "welding",
        "soudure à l'arc": "arc welding",
        "soudure tig": "TIG welding",
        "meulage": "grinding",
        "découpe": "cutting",
        "découpe meuleuse": "grinder cutting",
        "collecteur principal": "main manifold / header",
        "collecteur": "manifold / header",
        "centrale fluides": "fluids power plant",
        "réseau vapeur": "steam network",
        "purge préalable": "prior purging",
        "nettoyage": "cleaning",
        "réparation": "repair",
        "chéneaux": "gutters",
        "toiture usine": "plant roof",
        "toiture": "roof",
        "pose de ligne de vie": "lifeline installation",
        "ligne de vie": "lifeline",
        "plaques polycarbonates": "polycarbonate sheets",
        "étanchéité": "waterproofing / sealing",
        "consignation": "lockout / tagout (LOTO)",
        "consignation tgbt": "main LV switchboard lockout",
        "raccordement": "connection / wiring",
        "nouvelle ligne": "new line",
        "armoire automate": "PLC control cabinet",
        "sous-station électrique": "electrical substation",
        "transformateur": "transformer",
        "travail en hauteur": "work at height",
        "travail à chaud": "hot work",
        "travail électrique": "electrical work",
        "espace confiné": "confined space",
        "excavation": "excavation",
        "terrassement": "earthwork",
        "sous tension": "live / energized",
        "hors tension": "de-energized / disconnected",
        "bâche ignifugée": "fireproof tarp",
        "extincteur": "fire extinguisher",
        "surveillant incendie": "fire watcher",
        "harnais de sécurité": "safety harness",
        "échafaudage fixe": "fixed scaffolding",
        "échafaudage mobile": "mobile scaffolding",
        "échafaudage": "scaffolding",
        "nacelle": "aerial work platform / cherry picker",
        "plateforme élévatrice": "aerial platform (MEWP)",
        "absence de tension": "absence of voltage (VAT)",
        "gants isolants": "insulating gloves",
        "outils isolés": "insulated tools",
        "cadenas de consignation": "lockout padlock",
        "séparation": "isolation / disconnection",
        "condamnation": "lockout / locking",
        "identification": "identification",
        "atelier emboutissage": "stamping shop",
        "atelier montage": "assembly shop",
        "atelier peinture": "paint shop",
        "ferrage": "body-in-white / welding shop",
        "chaufferie": "boiler room",
        "bâtiment": "building",
        "secteur": "sector",
        "zone": "zone",
        "niveau": "level"
    },

    // Traduction de texte (Français -> Anglais)
    async translateFrToEn(text) {
        if (!text || text.trim() === '') return '';
        const trimmed = text.trim();

        // 1. Essayer une traduction via fetch API en ligne (MyMemory / LibreTranslate / Google gratuit) avec timeout court
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=fr|en`;
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                if (data && data.responseData && data.responseData.translatedText) {
                    const res = data.responseData.translatedText;
                    // Vérifier si la réponse est valide et non un message d'erreur
                    if (!res.includes('MYMEMORY WARNING') && !res.includes('QUERY LENGTH LIMIT')) {
                        return res;
                    }
                }
            }
        } catch (e) {
            // Mode hors-ligne / fallback local
        }

        // 2. Fallback Hors-ligne robuste : moteur de substitution contextuel par dictionnaire industriel
        return this.localDictionaryTranslate(trimmed);
    },

    // Moteur local de traduction par dictionnaire contextuel
    localDictionaryTranslate(text) {
        let result = text;
        const lower = text.toLowerCase();

        // Si correspondance exacte dans le dictionnaire
        if (this.dictionary[lower]) {
            return this.dictionary[lower];
        }

        // Remplacement trié par longueur décroissante des termes techniques
        const keys = Object.keys(this.dictionary).sort((a, b) => b.length - a.length);

        for (const frTerm of keys) {
            const enTerm = this.dictionary[frTerm];
            const regex = new RegExp('\\b' + this.escapeRegex(frTerm) + '\\b', 'gi');
            result = result.replace(regex, enTerm);
        }

        // Petites substitutions grammaticales courantes
        const basicWords = {
            " et ": " and ",
            " avec ": " with ",
            " pour ": " for ",
            " dans ": " in ",
            " sur ": " on ",
            " du ": " of the ",
            " de la ": " of the ",
            " des ": " of the ",
            " le ": " the ",
            " la ": " the ",
            " les ": " the ",
            " par ": " by ",
            " avant ": " before ",
            " après ": " after ",
            " sans ": " without ",
            " obligatoire ": " mandatory ",
            " requis ": " required ",
            " vérifié ": " verified / checked ",
            " conforme ": " compliant "
        };

        for (const [frW, enW] of Object.entries(basicWords)) {
            const regex = new RegExp(this.escapeRegex(frW), 'gi');
            result = result.replace(regex, enW);
        }

        return result;
    },

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
};

window.Translator = Translator;
