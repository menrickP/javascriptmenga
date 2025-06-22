document.addEventListener('DOMContentLoaded', () => {
    const addSlotForm = document.getElementById('addSlotForm');
    const adminAlert = document.getElementById('adminAlert');
    const adminSchedule = document.getElementById('adminSchedule');
    const reservationForm = document.getElementById('reservationForm');
    const teacherAlert = document.getElementById('teacherAlert');
    const teacherSchedule = {
        "Lundi": { "morning": [], "afternoon": [] },
        "Mardi": { "morning": [], "afternoon": [] },
        "Mercredi": { "morning": [], "afternoon": [] },
        "Jeudi": { "morning": [], "afternoon": [] },
        "Vendredi": { "morning": [], "afternoon": [] },
        "Samedi": { "morning": [], "afternoon": [] },
    };

    // Fonction pour afficher les créneaux réservés dans admin.html
    function updateAdminSchedule() {
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        adminSchedule.innerHTML = ''; // Réinitialiser l'affichage

        if (reservations.length === 0) {
            adminSchedule.innerHTML = '<p>Aucun créneau réservé.</p>';
            return;
        }

        reservations.forEach((reservation, index) => {
            const reservationElement = document.createElement('div');
            reservationElement.className = 'alert alert-info d-flex justify-content-between align-items-center';
            reservationElement.innerHTML = `
                <div>
                    ${reservation.date} - ${reservation.time}: ${reservation.courseTitle} (${reservation.teacherName}, ${reservation.room})
                </div>
                <button class="btn btn-danger btn-sm delete-slot" data-index="${index}">Supprimer</button>
            `;
            adminSchedule.appendChild(reservationElement);
        });

        // Ajouter l'écouteur d'événements pour les boutons de suppression
        document.querySelectorAll('.delete-slot').forEach(button => {
            button.addEventListener('click', deleteSlot);
        });
    }

    // Fonction pour supprimer un créneau
    function deleteSlot(e) {
        const index = e.target.getAttribute('data-index');
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        reservations.splice(index, 1); // Supprimer la réservation de la liste
        localStorage.setItem('reservations', JSON.stringify(reservations)); // Mettre à jour le stockage local
        updateAdminSchedule(); // Mettre à jour l'affichage
        adminAlert.textContent = 'Créneau supprimé avec succès!';
        adminAlert.style.color = 'green';
        updateSchedule(); // Met à jour l'emploi du temps
    }

    // Ajouter un créneau
    addSlotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('slotDate').value;
        const time = document.getElementById('slotTime').value;

        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        reservations.push({ date, time });
        localStorage.setItem('reservations', JSON.stringify(reservations));
        adminAlert.textContent = 'Créneau ajouté avec succès!';
        adminAlert.style.color = 'green';
        updateAdminSchedule(); // Mettre à jour l'affichage
        updateSchedule(); // Met à jour l'emploi du temps
    });

    // Fonction de réservation pour l'enseignant
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const courseTitle = document.getElementById('courseTitle').value;
        const teacherName = document.getElementById('teacherName').value;
        const room = document.getElementById('room').value;

        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        const conflict = reservations.some(reservation => reservation.date === date && reservation.time === time);

        if (conflict) {
            teacherAlert.textContent = 'Ce créneau est déjà réservé!';
            teacherAlert.style.color = 'red';
        } else {
            reservations.push({ date, time, courseTitle, teacherName, room });
            localStorage.setItem('reservations', JSON.stringify(reservations));
            teacherAlert.textContent = 'Réservation réussie!';
            teacherAlert.style.color = 'green';
            updateSchedule();
        }
    });

    // Fonction pour mettre à jour l'emploi du temps de l'enseignant
    function updateSchedule() {
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];

        // Réinitialiser l'emploi du temps
        for (let day in teacherSchedule) {
            teacherSchedule[day].morning = [];
            teacherSchedule[day].afternoon = [];
        }

        // Remplir l'emploi du temps avec les réservations
        reservations.forEach((reservation) => {
            const reservationDate = new Date(reservation.date);
            const dayName = reservationDate.toLocaleString('fr-FR', { weekday: 'long' });
            const time = reservation.time;

            const courseInfo = `${reservation.courseTitle} - ${reservation.teacherName} (${reservation.room})`;

            if (time === "07:30") {
                teacherSchedule[dayName].morning.push(courseInfo);
            } else if (time === "13:00") {
                teacherSchedule[dayName].afternoon.push(courseInfo);
            }
        });

        // Mettre à jour le tableau
        for (let day in teacherSchedule) {
            const morningCell = document.getElementById(`mon_${day.toLowerCase()}`);
            const afternoonCell = document.getElementById(`mon_${day.toLowerCase()}_apres`);

            morningCell.innerHTML = teacherSchedule[day].morning.length > 0 
                ? teacherSchedule[day].morning.join('<br>') 
                : "Libre";

            afternoonCell.innerHTML = teacherSchedule[day].afternoon.length > 0 
                ? teacherSchedule[day].afternoon.join('<br>') 
                : "Libre";
        }
    }

    // Initialiser l'affichage
    updateAdminSchedule();
    updateSchedule();
});
