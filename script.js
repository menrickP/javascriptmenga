document.addEventListener('DOMContentLoaded', () => {
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

    function updateSchedule() {
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];

        // Reset schedule
        for (let day in teacherSchedule) {
            teacherSchedule[day].morning = [];
            teacherSchedule[day].afternoon = [];
        }

        // Fill schedule with reservations
        reservations.forEach((reservation, index) => {
            const reservationDate = new Date(reservation.date);
            const dayName = reservationDate.toLocaleString('fr-FR', { weekday: 'long' });
            const time = reservation.time;

            const courseInfo = `${reservation.courseTitle} - ${reservation.teacherName} (${reservation.room})`;

            if (time >= "07:30" && time < "11:30") {
                teacherSchedule[dayName].morning.push({ info: courseInfo, index });
            } else if (time >= "13:00" && time < "17:00") {
                teacherSchedule[dayName].afternoon.push({ info: courseInfo, index });
            }
        });

        // Update the table
        for (let day in teacherSchedule) {
            const morningCell = document.getElementById(`mon_${day.toLowerCase()}`);
            const afternoonCell = document.getElementById(`mon_${day.toLowerCase()}_apres`);

            morningCell.innerHTML = teacherSchedule[day].morning.length > 0 
                ? teacherSchedule[day].morning.map(item => `${item.info} <button class="delete-button" data-index="${item.index}" data-day="${day}" data-time="morning">Supprimer</button>`).join('<br>') 
                : "Libre";

            afternoonCell.innerHTML = teacherSchedule[day].afternoon.length > 0 
                ? teacherSchedule[day].afternoon.map(item => `${item.info} <button class="delete-button" data-index="${item.index}" data-day="${day}" data-time="afternoon">Supprimer</button>`).join('<br>') 
                : "Libre";
        }

        // Ajouter des écouteurs d'événements pour les boutons de suppression
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', deleteReservation);
        });
    }

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

    function deleteReservation(e) {
        const index = e.target.getAttribute('data-index');
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        reservations.splice(index, 1); // Supprimer la réservation de la liste
        localStorage.setItem('reservations', JSON.stringify(reservations)); // Mettre à jour le stockage local
        updateSchedule(); // Mettre à jour l'affichage
    }

    document.getElementById('downloadPdf').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text("Emploi du Temps", 20, 20);
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        
        let y = 30;
        const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

        days.forEach(day => {
            doc.text(day, 20, y);
            y += 10;

            const morningReservations = reservations.filter(reservation => {
                const reservationDate = new Date(reservation.date);
                return reservationDate.toLocaleString('fr-FR', { weekday: 'long' }) === day && reservation.time >= "07:30" && reservation.time < "11:30";
            });

            const afternoonReservations = reservations.filter(reservation => {
                const reservationDate = new Date(reservation.date);
                return reservationDate.toLocaleString('fr-FR', { weekday: 'long' }) === day && reservation.time >= "13:00" && reservation.time < "17:00";
            });

            doc.text("1ère Période:", 20, y);
            morningReservations.forEach(reservation => {
                doc.text(`${reservation.courseTitle} - ${reservation.teacherName} (${reservation.room})`, 30, y += 10);
            });
            y += 10;

            doc.text("2ème Période:", 20, y);
            afternoonReservations.forEach(reservation => {
                doc.text(`${reservation.courseTitle} - ${reservation.teacherName} (${reservation.room})`, 30, y += 10);
            });
            y += 10;
        });

        doc.save("emploi_du_temps.pdf");
    });

    // Logique pour l'étudiant
    document.getElementById('downloadStudentPdf').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text("Mon Emploi du Temps", 20, 20);
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        
        let y = 30;
        const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

        days.forEach(day => {
            doc.text(day, 20, y);
            y += 10;

            const morningReservations = reservations.filter(reservation => {
                const reservationDate = new Date(reservation.date);
                return reservationDate.toLocaleString('fr-FR', { weekday: 'long' }) === day && reservation.time >= "07:30" && reservation.time < "11:30";
            });

            const afternoonReservations = reservations.filter(reservation => {
                const reservationDate = new Date(reservation.date);
                return reservationDate.toLocaleString('fr-FR', { weekday: 'long' }) === day && reservation.time >= "13:00" && reservation.time < "17:00";
            });

            doc.text("1ère Période:", 20, y);
            morningReservations.forEach(reservation => {
                doc.text(`${reservation.courseTitle} - ${reservation.teacherName} (${reservation.room})`, 30, y += 10);
            });
            y += 10;

            doc.text("2ème Période:", 20, y);
            afternoonReservations.forEach(reservation => {
                doc.text(`${reservation.courseTitle} - ${reservation.teacherName} (${reservation.room})`, 30, y += 10);
            });
            y += 10;
        });

        doc.save("emploi_du_temps_etudiant.pdf");
    });

    updateSchedule();
});
