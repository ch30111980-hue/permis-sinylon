/**
 * SINYLON - STELLANTIS | Revalidation Hebdomadaire
 * Gestion des cycles de revalidation (Semaine 1, Semaine 2, Semaine 3...),
 * checklist de conformité, validation Sinylon et journal d'audit
 */

const RevalidationModule = {
    // Ouvrir le modal de revalidation pour un permis
    openModal(permitId) {
        const permit = Store.getPermit(permitId);
        if (!permit) return;

        const modal = document.getElementById('modal-revalidation');
        if (!modal) return;

        // Informations du permis
        document.getElementById('reval-permit-id').innerText = permit.id;
        document.getElementById('reval-permit-title').innerText = permit.title || permit['work-desc'] || 'Permis de Travail';
        document.getElementById('reval-company').innerText = permit.company || 'N/A';
        document.getElementById('reval-zone').innerText = `${permit.ouvrage || ''} - ${permit.zone || ''}`;

        const nextWeekNum = (permit.revalidations ? permit.revalidations.length : 0) + 1;
        document.getElementById('reval-week-label').innerText = `Semaine ${nextWeekNum}`;

        // Date et heure automatiques
        const now = new Date();
        document.getElementById('reval-date').value = now.toISOString().split('T')[0];
        document.getElementById('reval-time').value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        document.getElementById('reval-wpeex-engineer').value = permit['wpeex-nom'] || 'M. Sinylon (Ingénieur de Suivi)';
        document.getElementById('reval-exec-manager').value = permit['chef-nom'] || 'Responsable Exécution';

        // Reset radio buttons
        document.getElementById('reval-q1-yes').checked = true;
        document.getElementById('reval-q2-yes').checked = true;
        document.getElementById('reval-q3-yes').checked = true;
        document.getElementById('reval-q4-no').checked = true;
        document.getElementById('reval-mod-box').style.display = 'none';
        document.getElementById('reval-mod-notes').value = '';

        // Rendu de l'historique précédent
        this.renderHistory(permit);

        modal.dataset.permitId = permit.id;
        modal.classList.add('active');
    },

    closeModal() {
        const modal = document.getElementById('modal-revalidation');
        if (modal) modal.classList.remove('active');
    },

    // Basculer l'affichage du champ de modification
    toggleModificationField(hasModifications) {
        const box = document.getElementById('reval-mod-box');
        if (box) {
            box.style.display = hasModifications ? 'block' : 'none';
        }
    },

    // Soumettre la revalidation
    submitRevalidation() {
        const modal = document.getElementById('modal-revalidation');
        if (!modal) return;
        const permitId = modal.dataset.permitId;
        if (!permitId) return;

        const q1 = document.getElementById('reval-q1-yes').checked;
        const q2 = document.getElementById('reval-q2-yes').checked;
        const q3 = document.getElementById('reval-q3-yes').checked;
        const q4 = document.getElementById('reval-q4-yes').checked;
        const modNotes = document.getElementById('reval-mod-notes').value;
        const date = document.getElementById('reval-date').value;
        const time = document.getElementById('reval-time').value;
        const wpeexEngineer = document.getElementById('reval-wpeex-engineer').value;
        const execManager = document.getElementById('reval-exec-manager').value;

        // Sauvegarder
        Store.addRevalidation(permitId, {
            unchangedInfo: q1,
            unchangedConditions: q2,
            securityMeasuresApplicable: q3,
            hasModifications: q4,
            modificationNotes: modNotes,
            date: date,
            time: time,
            wpeexEngineer: wpeexEngineer,
            execManager: execManager
        });

        this.closeModal();

        // Rafraîchir les vues
        if (window.App) {
            App.renderDashboard();
            App.renderPermitList();
            if (App.currentPermitId === permitId) {
                App.openPermitPreview(permitId);
            }
            App.showToast(`✅ Permis ${permitId} revalidé avec succès par Sinylon !`, 'success');
        }
    },

    // Rendu de l'historique des revalidations
    renderHistory(permit) {
        const container = document.getElementById('reval-history-list');
        if (!container) return;

        if (!permit.revalidations || permit.revalidations.length === 0) {
            container.innerHTML = `<div class="empty-history">Aucune revalidation précédente (Permis en Semaine 1).</div>`;
            return;
        }

        container.innerHTML = permit.revalidations.map((rev, idx) => `
            <div class="reval-history-item">
                <div class="reval-h-header">
                    <span class="reval-h-week">Semaine ${rev.weekNumber || idx + 1}</span>
                    <span class="reval-h-date">${rev.date} à ${rev.time}</span>
                    <span class="badge badge-success">Validé Sinylon</span>
                </div>
                <div class="reval-h-details">
                    <div><strong>Suivi :</strong> ${rev.wpeexEngineer}</div>
                    <div><strong>Exécution :</strong> ${rev.execManager}</div>
                    ${rev.hasModifications ? `<div class="reval-h-mod">⚠️ Modification : ${rev.modificationNotes}</div>` : '<div class="text-muted">Conditions et mesures inchangées.</div>'}
                </div>
            </div>
        `).join('');
    }
};

window.RevalidationModule = RevalidationModule;
