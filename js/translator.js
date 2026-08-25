/**
 * SINYLON - STELLANTIS | Trilingual Translation Engine (FR / EN / 中文)
 * Dictionnaire technique spécialisé industrie automobile Stellantis / Sécurité HSE
 */

const Translator = {
    currentLang: 'en', // Langue par défaut sur le terrain

    dictionary: {
        "travaux de maintenance": { en: "maintenance work", zh: "维护作业" },
        "maintenance préventive": { en: "preventive maintenance", zh: "预防性维护" },
        "installation tuyauterie": { en: "pipe installation", zh: "管道安装" },
        "travail en hauteur": { en: "work at height", zh: "高空作业" },
        "travail à chaud": { en: "hot work / welding", zh: "动火/焊接作业" },
        "travail électrique": { en: "electrical work", zh: "电气作业" },
        "espace confiné": { en: "confined space", zh: "受限空间作业" },
        "levage": { en: "heavy lifting", zh: "起重吊装作业" },
        "consignation": { en: "lockout / tagout (LOTO)", zh: "上锁挂牌 (LOTO)" },
        "ligne de montage": { en: "assembly line", zh: "总装线" },
        "atelier assemblage": { en: "assembly shop", zh: "总装车间" }
    },

    uiLabels: {
        en: {
            appTitle: "SINYLON - STELLANTIS | Work Permit Management",
            currentWeek: "CURRENT WEEK",
            activePermits: "ACTIVE PERMITS",
            weekendPermit: "WEEKEND PERMIT",
            allProgram: "29 WEEKS MASTER SCHEDULE",
            openBtn: "OPEN",
            modifyBtn: "MODIFY",
            qrBtn: "QR",
            printBtn: "PRINT",
            statusValid: "VALID",
            statusWeekend: "WEEKEND",
            statusClosed: "CLOSED",
            statusPlanned: "PLANNED",
            fieldInspection: "OFFICIAL FIELD INSPECTION CARD",
            contractor: "Contractor",
            area: "Area / Shop",
            responsible: "Responsible",
            validity: "Validity",
            activity: "Activity",
            ppe: "Required PPE",
            risks: "Identified Risks",
            visas: "Sign-offs & Visas",
            viewOfficial: "VIEW OFFICIAL PERMIT"
        },
        fr: {
            appTitle: "SINYLON - STELLANTIS | Gestionnaire de Permis de Travail",
            currentWeek: "SEMAINE EN COURS",
            activePermits: "PERMIS ACTIFS",
            weekendPermit: "PERMIS WEEK-END",
            allProgram: "PROGRAMME COMPLET (29 SEMAINES)",
            openBtn: "OUVRIR",
            modifyBtn: "MODIFIER",
            qrBtn: "QR",
            printBtn: "IMPRIMER",
            statusValid: "VALIDE",
            statusWeekend: "WEEK-END",
            statusClosed: "CLÔTURÉ",
            statusPlanned: "PLANIFIÉ",
            fieldInspection: "FICHE OFFICIELLE DE CONTRÔLE CHANTIER",
            contractor: "Entreprise",
            area: "Zone / Atelier",
            responsible: "Responsable",
            validity: "Période de Validité",
            activity: "Nature des Travaux",
            ppe: "EPI Obligatoires",
            risks: "Risques Identifiés",
            visas: "Visas & Signatures",
            viewOfficial: "VOIR LE PERMIS OFFICIEL"
        },
        zh: {
            appTitle: "SINYLON - STELLANTIS | 施工许可证智能管理系统",
            currentWeek: "当前作业周",
            activePermits: "有效许可证",
            weekendPermit: "周末特别许可证",
            allProgram: "29周总体施工计划",
            openBtn: "查看",
            modifyBtn: "修改",
            qrBtn: "二维码",
            printBtn: "打印",
            statusValid: "有效",
            statusWeekend: "周末作业",
            statusClosed: "已归档",
            statusPlanned: "计划中",
            fieldInspection: "现场官方安全核验单",
            contractor: "施工单位",
            area: "施工区域/车间",
            responsible: "现场负责人",
            validity: "作业有效期",
            activity: "作业内容",
            ppe: "劳保防护用品 (PPE)",
            risks: "重大危险源",
            visas: "审批与签发",
            viewOfficial: "查看官方许可证"
        }
    },

    setLang(lang) {
        if (['en', 'fr', 'zh'].includes(lang)) {
            this.currentLang = lang;
            const settings = Store.getSettings();
            settings.defaultLang = lang;
            Store.saveSettings(settings);
            if (window.App && typeof window.App.onLanguageChanged === 'function') {
                window.App.onLanguageChanged(lang);
            }
        }
    },

    getLabel(key) {
        const lang = this.currentLang || 'en';
        return (this.uiLabels[lang] && this.uiLabels[lang][key]) || (this.uiLabels['en'] && this.uiLabels['en'][key]) || key;
    },

    getText(obj, fallback = '') {
        if (!obj) return fallback;
        if (typeof obj === 'string') return obj;
        const lang = this.currentLang || 'en';
        return obj[lang] || obj['en'] || obj['fr'] || obj['zh'] || fallback;
    },

    localDictionaryTranslate(text) {
        if (!text) return '';
        const lower = text.toLowerCase().trim();
        for (const [key, val] of Object.entries(this.dictionary)) {
            if (lower.includes(key)) {
                return val.en;
            }
        }
        return text;
    },

    async translateFrToEn(text) {
        if (!text || text.trim() === '') return '';
        const dictMatch = this.localDictionaryTranslate(text);
        if (dictMatch && dictMatch !== text) return dictMatch;
        return text;
    }
};

window.Translator = Translator;
