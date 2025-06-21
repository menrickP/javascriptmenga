console.log('Chargement du tableau de bord enseignant...');

// Fonction pour afficher l'emploi du temps dans le tableau
function loadEmploiDuTemps() {
    fetch('http://localhost:3000/api/emploi-du-temps')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#emploiDuTempsTable tbody');
            tableBody.innerHTML = ''; // Réinitialise le tableau

            const horaires = ['8h30-10h30', '10h30-12h30', '14h00-16h00', '16h00-18h00'];
            const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

            horaires.forEach(horaire => {
                const row = document.createElement('tr');
                const horaireCell = document.createElement('td');
                horaireCell.textContent = horaire;
                row.appendChild(horaireCell);

                jours.forEach(jour => {
                    const cell = document.createElement('td');
                    const slot = data.find(item => item.jour === jour && item.horaire === horaire);

                    if (slot && slot.enseignant_id) {
                        cell.textContent = `${slot.module} (${slot.salle})`;
                        cell.style.backgroundColor = '#ccc'; // Créneau réservé
                    } else {
                        cell.textContent = 'Libre';
                        cell.style.backgroundColor = '#a8e6a1'; // Créneau libre
                    }

                    row.appendChild(cell);
                });

                tableBody.appendChild(row);
            });
        })
        .catch(err => {
            console.error('Erreur lors de la récupération des données :', err);
        });
}

// Fonction pour réserver un créneau
function reservePeriod(teacherId, jour, horaire, salle, module) {
    fetch('http://localhost:3000/api/reserve-period', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId, jour, horaire, salle, module })
    })
        .then(response => response.json())
        .then(data => {
            const feedback = document.getElementById('feedbackMessage');
            if (data.success) {
                feedback.textContent = 'Réservation réussie !';
                feedback.style.color = 'green';
                loadEmploiDuTemps(); // Met à jour le tableau après réservation
            } else {
                feedback.textContent = data.message || 'Erreur.';
                feedback.style.color = 'red';
            }
        })
        .catch(err => {
            console.error('Erreur lors de la réservation :', err);
        });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const teacherId = 2; // Exemple d'ID enseignant
    loadEmploiDuTemps(); // Charge et affiche l'emploi du temps

    document.getElementById('reservationForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const jour = document.getElementById('jour').value;
        const horaire = document.getElementById('horaire').value;
        const salle = document.getElementById('salle').value;
        const module = document.getElementById('module').value;

        reservePeriod(teacherId, jour, horaire, salle, module);
    });
});

