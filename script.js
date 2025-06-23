document.addEventListener('DOMContentLoaded', () => {
    const manageSlotsForm = document.getElementById('manageSlotsForm');
    const adminAlert = document.getElementById('manageAlert');
    const adminSchedule = document.getElementById('adminSchedule');
    const reservationForm = document.getElementById('reservationForm');
    const teacherAlert = document.getElementById('teacherAlert');
    const userForm = document.getElementById('userForm');
    const userAlert = document.getElementById('userAlert');
    const userList = document.getElementById('userList');

    // Afficher la date du jour
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('fr-FR');

    // Fonction pour afficher les créneaux réservés dans admin.html
    function updateAdminSchedule() {
        const slots = JSON.parse(localStorage.getItem('slots')) || [];
        adminSchedule.innerHTML = ''; // Réinitialiser l'affichage

        if (slots.length === 0) {
            adminSchedule.innerHTML = '<p>Aucun créneau ajouté.</p>';
            return;
        }

        slots.forEach((slot, index) => {
            const slotElement = document.createElement('div');
            slotElement.innerHTML = `${slot.date} - ${slot.time} <button class="btn btn-danger btn-sm delete-slot" data-index="${index}">Supprimer</button>`;
            adminSchedule.appendChild(slotElement);
        });

        // Ajouter l'écouteur d'événements pour les boutons de suppression
        document.querySelectorAll('.delete-slot').forEach(button => {
            button.addEventListener('click', deleteSlot);
        });
    }

    // Fonction pour supprimer un créneau
    function deleteSlot(e) {
        const index = e.target.getAttribute('data-index');
        const slots = JSON.parse(localStorage.getItem('slots')) || [];
        slots.splice(index, 1); // Supprimer le créneau de la liste
        localStorage.setItem('slots', JSON.stringify(slots)); // Mettre à jour le stockage local
        updateAdminSchedule(); // Mettre à jour l'affichage
        adminAlert.textContent = 'Créneau supprimé avec succès!';
        adminAlert.style.color = 'green';
    }

    // Ajouter un créneau
    manageSlotsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('slotDate').value;
        const time = document.getElementById('slotTime').value;

        const slots = JSON.parse(localStorage.getItem('slots')) || [];
        slots.push({ date, time });
        localStorage.setItem('slots', JSON.stringify(slots));
        adminAlert.textContent = 'Créneau ajouté avec succès!';
        adminAlert.style.color = 'green';
        updateAdminSchedule(); // Mettre à jour l'affichage
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
        const teacherSchedule = {
            "Lundi": { "morning": [], "afternoon": [] },
            "Mardi": { "morning": [], "afternoon": [] },
            "Mercredi": { "morning": [], "afternoon": [] },
            "Jeudi": { "morning": [], "afternoon": [] },
            "Vendredi": { "morning": [], "afternoon": [] },
            "Samedi": { "morning": [], "afternoon": [] },
        };

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

    // Fonction pour gérer les utilisateurs
    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('userName').value;
        const role = document.getElementById('userRole').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ name, role });
        localStorage.setItem('users', JSON.stringify(users));
        userAlert.textContent = 'Utilisateur ajouté avec succès!';
        userAlert.style.color = 'green';
        updateUserDisplay();
    });

    // Fonction pour afficher les utilisateurs
    function updateUserDisplay() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        userList.innerHTML = '';

        users.forEach((user, index) => {
            const userElement = document.createElement('div');
            userElement.innerHTML = `${user.name} - ${user.role} <button class="btn btn-danger btn-sm delete-user" data-index="${index}">Supprimer</button>`;
            userList.appendChild(userElement);
        });

        document.querySelectorAll('.delete-user').forEach(button => {
            button.addEventListener('click', deleteUser);
        });
    }

    // Fonction pour supprimer un utilisateur
    function deleteUser(e) {
        const index = e.target.getAttribute('data-index');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        updateUserDisplay();
    }

    // Initialiser l'affichage
    updateAdminSchedule();
    updateUserDisplay();
    updateSchedule();
});
