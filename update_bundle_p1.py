#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import re

# Load JSON permit for SYN-K9-KW35
with open('k9_weekly_permits.json') as f:
    permits = json.load(f)
p = permits.get('SYN-K9-KW35', {})

exact_work_desc = p.get('work-desc', '')
exact_work_desc_en = p.get('work-desc-en', '')

with open('create_official_a4_bundle.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace Page 1 in create_official_a4_bundle.py HTML string
p1_html_old_pattern = r'<!-- =+ -->\s*<!-- PAGE 1 : PERMIS GÉNÉRAL DE TRAVAIL[\s\S]*?<!-- =+ -->\s*<!-- PAGE 2 :'

new_p1_html = f"""<!-- ========================================================================= -->
<!-- PAGE 1 : PERMIS DE TRAVAIL DE SECURITÉ GÉNÉRALE (RECTO - PAGE 1/2)       -->
<!-- REPRODUCTION EXACTE DE LA PHOTO CSPS FIAT ADAPTÉE POUR SINYLON - STELLANTIS -->
<!-- DESCRIPTION EXACTE DE L'APPLICATION POUR SYN-K9-KW35                      -->
<!-- ========================================================================= -->
<div class="page" id="page-1">
    <div>
        <!-- EN-TÊTE : EXACT PHOTO -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px;">
            <div style="flex:1;text-align:center;padding-left:40px;">
                <div style="font-size:16px;font-weight:900;letter-spacing:0.2px;text-transform:none;">
                    Permis de Travail de Securité Générale
                </div>
                <div style="font-size:8.5px;color:#000;margin-top:1px;">
                    (à afficher sur le site de travail )
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:12px;">
                <div style="display:flex;align-items:center;gap:5px;">
                    <span style="background:#000;color:#fff;font-weight:900;font-size:14px;padding:2px 7px;border-radius:2px;letter-spacing:1px;">SINYLON</span>
                    <span style="border:1.5px solid #000;color:#000;font-weight:900;font-size:14px;padding:1px 7px;border-radius:2px;background:#fff;letter-spacing:1px;">STELLANTIS</span>
                </div>
                <div style="border:1px solid #000;text-align:center;width:130px;">
                    <div style="font-size:7.5px;font-weight:700;border-bottom:1px solid #000;padding:1px 4px;background:#f8fafc;">Identifiant du permis</div>
                    <div style="font-size:12px;font-weight:900;padding:1px 4px;color:#000;">SYN-K9-KW35</div>
                </div>
            </div>
        </div>

        <!-- SECTION 1 : BRÈVE DESCRIPTION DU TRAVAIL (BANDEAU JAUNE) -->
        <div style="border:1px solid #000;margin-top:3px;">
            <div style="background:#ffeb3b;border-bottom:1px solid #000;padding:2px 6px;font-weight:900;font-size:8.5px;text-align:center;">
                Bréve description du travail
            </div>
            <div style="padding:4px 6px;min-height:38px;font-size:7.5px;line-height:1.25;color:#000;">
                {exact_work_desc}
                <div style="font-size:7px;color:#475569;font-style:italic;margin-top:2px;">{exact_work_desc_en}</div>
            </div>
        </div>

        <!-- SECTION 2 : ENDROIT DE TRAVAIL & ÉQUIPEMENTS (BANDEAUX JAUNES) -->
        <div style="display:grid;grid-template-columns:1fr 1fr;border:1px solid #000;border-top:none;">
            <div style="border-right:1px solid #000;">
                <div style="background:#ffeb3b;border-bottom:1px solid #000;padding:2px 6px;font-weight:900;font-size:8.5px;text-align:center;">
                    Endroit de travail:
                </div>
                <div style="padding:3px 6px;font-size:7.5px;min-height:34px;">
                    <strong>Localisation :</strong> Bâtiment Montage Stellantis — Lignes FUSA / UAR / UB<br>
                    <strong>Secteur :</strong> Atelier Assemblage Stellantis (Algeria K9 CKD0)
                </div>
            </div>
            <div>
                <div style="background:#ffeb3b;border-bottom:1px solid #000;padding:2px 6px;font-weight:900;font-size:8.5px;text-align:center;">
                    Equipment/Machinerie / Zone sur lequel s'effectue le travail
                </div>
                <div style="padding:3px 6px;font-size:7.5px;min-height:34px;">
                    <strong>ZONE :</strong> <span style="font-weight:bold;color:#1e3a8a;">Zones FUSA / UAR / UB</span><br>
                    <strong>Équipements :</strong> Postes de soudage ARO, Pinces manuelles, Nacelles ciseaux (x6), Manlift, Palans DEMAG
                </div>
            </div>
        </div>

        <!-- SECTION 3 : ENTREPRISE INTERVENANTE & CONTACTS -->
        <div style="display:grid;grid-template-columns:1.2fr 1fr;border:1px solid #000;border-top:none;font-size:7.5px;">
            <div style="border-right:1px solid #000;padding:3px 6px;">
                <div><strong>Entreprise Intervenante :</strong> <span style="font-weight:bold;">SINYLON</span></div>
                <div style="color:#333;margin-top:1px;">Avant de commencer le travail, veuillez contacter:</div>
                <div style="margin-top:1px;"><strong>Nom:</strong> XIE XIAN (Chef de Projet)</div>
            </div>
            <div style="padding:3px 6px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span>Plan d'urgence du site attaché</span>
                    <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                        <span style="padding:0 3px;">Y</span>
                        <span style="background:#000;color:#fff;padding:0 3px;">N</span>
                    </span>
                </div>
                <div style="margin-top:2px;">
                    <strong>Ouvrage :</strong> Stellantis K9&nbsp;&nbsp;&nbsp;
                    <strong>ZONE :</strong> FUSA/UAR/UB&nbsp;&nbsp;&nbsp;
                    <strong>Tél. :</strong> 0563765157
                </div>
            </div>
        </div>

        <!-- SECTION 4 : GRANDS DANGERS (EXACT PHOTO) -->
        <div style="border:1px solid #000;border-top:none;padding:2px 6px 4px 6px;font-size:7px;">
            <div style="font-size:7.5px;font-style:italic;margin-bottom:2px;color:#000;">
                si oui, la liste de verification des grands danger suivante doit etre attachée &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; de &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; de
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <!-- Colonne gauche -->
                <div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                        <span>Travail en hauteur</span>
                        <span>
                            <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                <span style="background:#000;color:#fff;padding:0 2px;">.Y.</span>
                                <span style="padding:0 2px;">N</span>
                            </span>
                            <strong style="margin-left:4px;font-size:8px;">A</strong>
                        </span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                        <span>Travail dans un espace confiné</span>
                        <span>
                            <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                <span style="padding:0 2px;">.Y.</span>
                                <span style="background:#000;color:#fff;padding:0 2px;">N</span>
                            </span>
                            <strong style="margin-left:4px;font-size:8px;">B</strong>
                        </span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                        <span>Travail sur un système électrique</span>
                        <span>
                            <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                <span style="background:#000;color:#fff;padding:0 2px;">.Y.</span>
                                <span style="padding:0 2px;">N</span>
                            </span>
                            <strong style="margin-left:4px;font-size:8px;">C</strong>
                        </span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                        <span>Ouvrir un système/une ligne de rupture ( ligne Hydraulique etc )</span>
                        <span>
                            <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                <span style="padding:0 2px;">.Y.</span>
                                <span style="background:#000;color:#fff;padding:0 2px;">N</span>
                            </span>
                            <strong style="margin-left:4px;font-size:8px;">D</strong>
                        </span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                        <span>Autre travaux dangereux: (si oui veuillez spécifier ci-dessous)</span>
                        <span>
                            <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                <span style="padding:0 2px;">.Y.</span>
                                <span style="background:#000;color:#fff;padding:0 2px;">N</span>
                            </span>
                            <strong style="margin-left:4px;font-size:8px;">E</strong>
                        </span>
                    </div>
                </div>

                <!-- Colonne droite -->
                <div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                        <span>Travail à chaud</span>
                        <span>
                            <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                <span style="background:#000;color:#fff;padding:0 2px;">Y</span>
                                <span style="padding:0 2px;">N</span>
                            </span>
                            <strong style="margin-left:4px;font-size:8px;">B</strong>
                        </span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                        <span>Excavation</span>
                        <span>
                            <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                <span style="padding:0 2px;">.Y.</span>
                                <span style="background:#000;color:#fff;padding:0 2px;">N</span>
                            </span>
                            <strong style="margin-left:4px;font-size:8px;">D</strong>
                        </span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                        <span>Travail sur equipement sous tension</span>
                        <span>
                            <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                <span style="background:#000;color:#fff;padding:0 2px;">.Y.</span>
                                <span style="padding:0 2px;">N</span>
                            </span>
                            <strong style="margin-left:4px;font-size:8px;">E</strong>
                        </span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 0;">
                        <span>Exposition/Cond. Atmosphérique</span>
                        <span>
                            <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                                <span style="padding:0 2px;">.Y.</span>
                                <span style="background:#000;color:#fff;padding:0 2px;">N</span>
                            </span>
                            <strong style="margin-left:4px;font-size:8px;">F</strong>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Lignes Déclaration de méthode & MOC -->
            <div style="border-top:1px dashed #aaa;margin-top:3px;padding-top:2px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1px;">
                    <span>Declaration de methode requis</span>
                    <span>
                        <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                            <span style="background:#000;color:#fff;padding:0 2px;">Y</span>
                            <span style="padding:0 2px;">N</span>
                        </span>
                        <strong style="margin-left:4px;font-size:8px;">G</strong>
                    </span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1px;">
                    <span>Autre listes de verification attachées (si oui spécifier ci-dessous)</span>
                    <span>
                        <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                            <span style="padding:0 2px;">Y</span>
                            <span style="background:#000;color:#fff;padding:0 2px;">N</span>
                        </span>
                    </span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span>Est ce travail, une modification couverte par MOC?</span>
                        <span style="border:1px solid #000;display:inline-flex;font-size:7px;font-weight:bold;">
                            <span style="padding:0 2px;">Y</span>
                            <span style="background:#000;color:#fff;padding:0 2px;">N</span>
                        </span>
                    </div>
                    <div>
                        <span>MOC Ref. Nr. / Id.</span>
                        <span style="border-bottom:1px solid #000;display:inline-block;width:90px;height:10px;"></span> /
                    </div>
                </div>
            </div>
        </div>

        <!-- SECTION 5 : VALIDITÉ DU PERMIS ET SIGNATURES -->
        <div style="border:1px solid #000;border-top:none;padding:3px 6px;">
            <div style="font-weight:900;font-size:8.5px;margin-bottom:2px;">
                validité du permis et signatures
            </div>
            <div style="display:flex;gap:15px;align-items:center;font-size:7.5px;margin-bottom:2px;">
                <div>Date du permis : <span style="border:1px solid #000;padding:1px 6px;font-weight:bold;font-family:monospace;">2026-08-24</span></div>
                <div>heure de début : <span style="border:1px solid #000;padding:1px 6px;font-weight:bold;font-family:monospace;">08h00</span></div>
                <div>heure de fin : <span style="border:1px solid #000;padding:1px 6px;font-weight:bold;font-family:monospace;">17h30</span></div>
            </div>
            <div style="font-size:6.5px;color:#333;line-height:1.2;margin-bottom:3px;">
                Ce permis de travail de sécurité générale et sa liste de verification des grands danger avec le meme identifiant du permis sont uniquement valide pour la date et la période spécifiée ci-dessus. Toute les signatures doivent etre obtenues avant l'entame du travail. Permis affiché sur le lieu de travail. Copies: Emetteur du permis,receveur du permis et si applicable: Coordinateurr, chef de quart et/ou salle de controle.
            </div>

            <!-- GRILLE DES SIGNATURES INITIALES (EXACT PHOTO - CASES VIDES POUR SIGNATURE AU STYLO) -->
            <!-- Ligne 1 : 2 grandes cases -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:3px;">
                <div style="border:1px solid #000;background:#fff;padding:2px 4px;font-size:7px;min-height:36px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;border-bottom:1px solid #000;font-size:7.5px;">Chef de Projet Entreprise</div>
                    <div>Nom (lettres en majuscule) et signature: <strong>XIE XIAN</strong></div>
                    <div style="height:14px;border-bottom:1px dashed #999;color:#777;font-size:6.5px;display:flex;align-items:flex-end;">Signature :</div>
                </div>
                <div style="border:1px solid #000;background:#fff;padding:2px 4px;font-size:7px;min-height:36px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;border-bottom:1px solid #000;font-size:7.5px;">MOEX - Ingénieur de Suivi</div>
                    <div>Nom(lettres en majuscule) et signature: <strong>M. W.P.E.E.X</strong></div>
                    <div style="height:14px;border-bottom:1px dashed #999;color:#777;font-size:6.5px;display:flex;align-items:flex-end;">Signature :</div>
                </div>
            </div>

            <!-- Ligne 2 : 3 cases -->
            <div style="display:grid;grid-template-columns:1fr 1fr 1.2fr;gap:4px;">
                <div style="border:1px solid #000;background:#fff;padding:2px 4px;font-size:7px;min-height:46px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;border-bottom:1px solid #000;font-size:7.5px;">Coordinateur HSE Sinylon</div>
                    <div>Nom (lettres en majuscule) et signature:<br><strong>Nouri Chahrour</strong></div>
                    <div style="height:14px;border-bottom:1px dashed #999;color:#777;font-size:6.5px;display:flex;align-items:flex-end;">Signature :</div>
                </div>
                <div style="border:1px solid #000;background:#fff;padding:2px 4px;font-size:7px;min-height:46px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;border-bottom:1px solid #000;font-size:7.5px;">HSE Entreprise</div>
                    <div>Nom (lettres en majuscule) et signature:<br><strong>Nouri Chahrour</strong></div>
                    <div style="height:14px;border-bottom:1px dashed #999;color:#777;font-size:6.5px;display:flex;align-items:flex-end;">Signature :</div>
                    <div style="font-size:5.5px;color:#333;line-height:1;margin-top:1px;">Confirmation que toutes les précautions et les vérifications nécessaires sont en place, comme la liste de vérification appliquée</div>
                </div>
                <div style="border:1px solid #000;background:#fff;padding:2px 4px;font-size:7px;min-height:46px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;border-bottom:1px solid #000;font-size:7.5px;">Receveur du permis</div>
                    <div>Nom (lettres en majuscule) et signature:<br><strong>ZHOU LIN</strong></div>
                    <div style="height:14px;border-bottom:1px dashed #999;color:#777;font-size:6.5px;display:flex;align-items:flex-end;">Signature :</div>
                    <div style="font-size:5.5px;color:#333;line-height:1;margin-top:1px;">Information que toutes les précautions et les vérifications nécessaires sont en place ont été reçues. Les instructions fournies dans le permis de travail seront suivies. Tout les travailleurs ont été informés.</div>
                </div>
            </div>
        </div>

        <!-- SECTION 6 : PERMIT HAND-BACK (EXACT PHOTO) -->
        <div style="border:1px solid #000;border-top:none;padding:3px 6px;font-size:7px;">
            <div style="font-weight:bold;font-size:8px;">
                Permit Hand-Back <span style="font-weight:normal;font-size:7px;">(renvoyer à l'emetteur du permis après signature)</span>
            </div>
            <div style="font-size:6.5px;color:#444;font-style:italic;margin-bottom:2px;">
                (superviseur d'unité: veuillez cocher les caases appropriées ci-dessous)
            </div>

            <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:8px;margin-bottom:3px;">
                <!-- Etat de travail -->
                <div>
                    <div style="font-weight:bold;margin-bottom:1px;">Etat de travail</div>
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span>Achevé</span>
                        <span style="border:1px solid #000;width:12px;height:12px;display:inline-block;"></span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1px;">
                        <span>Inachevé (veuillez spécifier ci-dessous)</span>
                        <span style="border:1px solid #000;width:12px;height:12px;display:inline-block;"></span>
                    </div>
                </div>
                <!-- Etat de la surface -->
                <div>
                    <div style="font-weight:bold;margin-bottom:1px;">Etat de la surface/installation/équipmer</div>
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span>pret pour l'operation normale</span>
                        <span style="border:1px solid #000;width:12px;height:12px;display:inline-block;"></span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1px;">
                        <span>pas pret (veuillez spécifier ci-dessous)</span>
                        <span style="border:1px solid #000;width:12px;height:12px;display:inline-block;"></span>
                    </div>
                </div>
            </div>

            <!-- Signatures Hand-Back (EXACT PHOTO - 2 LIGNES) -->
            <div style="display:grid;grid-template-columns:1.2fr 1.2fr 1fr;gap:4px;margin-bottom:3px;">
                <div style="border:1px solid #000;background:#fff;padding:2px 4px;min-height:30px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;font-size:7px;">Receveur du permis</div>
                    <div style="font-size:6px;color:#555;">Nom (lettres en majuscule) et signature:</div>
                    <div style="height:12px;border-bottom:1px dashed #999;font-size:6px;color:#777;">Signature :</div>
                </div>
                <div style="border:1px solid #000;background:#fff;padding:2px 4px;min-height:30px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;font-size:7px;">MOEX - Ingénieur de Suivi</div>
                    <div style="font-size:6px;color:#555;">Nom(lettres en majuscule) et signature:</div>
                    <div style="height:12px;border-bottom:1px dashed #999;font-size:6px;color:#777;">Signature :</div>
                </div>
                <div style="display:flex;flex-direction:column;justify-content:center;gap:3px;font-size:7px;">
                    <div style="display:flex;gap:4px;align-items:center;">
                        <span>Date:</span>
                        <span style="border:1px solid #000;flex:1;height:14px;"></span>
                    </div>
                    <div style="display:flex;gap:4px;align-items:center;">
                        <span>Heure:</span>
                        <span style="border:1px solid #000;flex:1;height:14px;"></span>
                    </div>
                </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
                <div style="border:1px solid #000;background:#fff;padding:2px 4px;min-height:30px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;font-size:7px;">Chef de Projet Entreprise</div>
                    <div style="font-size:6px;color:#555;">Nom (lettres en majuscule) et signature:</div>
                    <div style="height:12px;border-bottom:1px dashed #999;font-size:6px;color:#777;">Signature :</div>
                </div>
                <div style="border:1px solid #000;background:#fff;padding:2px 4px;min-height:30px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div style="background:#bfdbfe;font-weight:bold;padding:1px;text-align:center;font-size:7px;">HSE Entreprise</div>
                    <div style="font-size:6px;color:#555;">Nom (lettres en majuscule) et signature:</div>
                    <div style="height:12px;border-bottom:1px dashed #999;font-size:6px;color:#777;">Signature :</div>
                </div>
            </div>
        </div>

        <!-- PIED DE PAGE EXACT PHOTO : Numéro d'urgence / Mobile / Page 1/2 -->
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:8px;font-weight:bold;margin-top:3px;padding:0 4px;">
            <div>Numéro d'urgence : <span style="font-weight:normal;">0563765157 / 14</span></div>
            <div>Mobile : <span style="font-weight:normal;">0563765157</span></div>
            <div>Page 1/2</div>
        </div>
    </div>

    <!-- QR Footer -->
    <div class="footer-qr">
        <div class="footer-qr-text">
            <div style="font-weight:900;font-size:8.5px;text-transform:uppercase;letter-spacing:0.5px;">
                🛡️ VÉRIFICATION ÉLECTRONIQUE / DIGITAL WORK PERMIT QR VERIFICATION
            </div>
            <div style="font-size:7.5px;color:#334155;margin-top:1px;">
                Scannez ce QR Code pour vérifier en direct la validité journalière <strong>(Validé à 08h10 chaque matin)</strong>, les visas MOEX / W.P.E.E.X et les habilitations.
            </div>
            <div style="font-family:monospace;font-weight:800;font-size:8.5px;color:#1e3a8a;margin-top:1px;">
                PERMIS N° SYN-K9-KW35 · PROJET ALGERIA K9 CKD0 · STELLANTIS
            </div>
        </div>
        <img class="footer-qr-img" src="data:image/png;base64,{{qr_base64}}" alt="QR Code">
    </div>
</div>

<!-- ========================================================================= -->
<!-- PAGE 2 :"""

code = re.sub(p1_html_old_pattern, new_p1_html, code)

# Update the ReportLab paragraph for description as well
old_reportlab_desc = r'desc_p = Paragraph\("<b>Description des travaux :</b>.*?", styles\[\'Normal\'\]\)'
new_reportlab_desc = f'desc_p = Paragraph("<b>Description des travaux :</b> {exact_work_desc}<br/><i>{exact_work_desc_en}</i>", styles[\'Normal\'])'
code = re.sub(old_reportlab_desc, new_reportlab_desc, code)

with open('create_official_a4_bundle.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("create_official_a4_bundle.py mis à jour avec le modèle exact et la vraie description de l'application !")
