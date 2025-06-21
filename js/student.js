console.log('Chargement du tableau de bord étudiant...');

// Fonction pour afficher l'emploi du temps
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

// Fonction pour télécharger l'emploi du temps en PDF
function downloadEmploiDuTempsPDF() {
    const table = document.getElementById('emploiDuTempsTable');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.text('Emploi du temps', 10, 10); // Titre du PDF
    pdf.autoTable({ html: table }); // Convertit le tableau HTML en tableau PDF
    pdf.save('emploi_du_temps.pdf'); // Télécharge le fichier PDF
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadEmploiDuTemps(); // Charge et affiche l'emploi du temps

    document.getElementById('downloadButton').addEventListener('click', () => {
        downloadEmploiDuTempsPDF(); // Télécharge le PDF
    });
});

