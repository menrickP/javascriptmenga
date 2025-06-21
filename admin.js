console.log('Chargement du tableau de bord administrateur...');

// Fonction pour charger les utilisateurs
function loadUsers() {
    fetch('http://localhost:3000/api/users')
        .then(response => response.json())
        .then(data => {
            const userTableBody = document.querySelector('#userTable tbody');
            userTableBody.innerHTML = ''; // Réinitialise le tableau

            data.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.role}</td>
                    <td>
                        <button onclick="editUser(${user.id})">Modifier</button>
                        <button onclick="deleteUser(${user.id})">Supprimer</button>
                    </td>
                `;
                userTableBody.appendChild(row);
            });
        })
        .catch(err => console.error('Erreur lors de la récupération des utilisateurs :', err));
}

// Fonction pour supprimer un utilisateur
function deleteUser(userId) {
    fetch(`http://localhost:3000/api/delete-user/${userId}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            loadUsers(); // Recharge les utilisateurs après suppression
        })
        .catch(err => console.error('Erreur lors de la suppression de l\'utilisateur :', err));
}

// Fonction pour charger les créneaux réservés
function loadReservedSlots() {
    fetch('http://localhost:3000/api/reserved-slots')
        .then(response => response.json())
        .then(data => {
            const slotsTableBody = document.querySelector('#reservedSlotsTable tbody');
            slotsTableBody.innerHTML = ''; // Réinitialise le tableau

            data.forEach(slot => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${slot.jour}</td>
                    <td>${slot.horaire}</td>
                    <td>${slot.module}</td>
                    <td>${slot.salle}</td>
                    <td>${slot.enseignant_id || 'Non attribué'}</td>
                    <td>
                        <button onclick="releaseSlot(${slot.id})">Libérer</button>
                    </td>
                `;
                slotsTableBody.appendChild(row);
            });
        })
        .catch(err => console.error('Erreur lors de la récupération des créneaux réservés :', err));
}

// Fonction pour libérer un créneau réservé
function releaseSlot(slotId) {
    fetch(`http://localhost:3000/api/release-slot/${slotId}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            loadReservedSlots(); // Recharge les créneaux après libération
        })
        .catch(err => console.error('Erreur lors de la libération du créneau :', err));
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadUsers(); // Charge les utilisateurs
    loadReservedSlots(); // Charge les créneaux réservés

    document.getElementById('addUserButton').addEventListener('click', () => {
        console.log('Ajouter un utilisateur - Fonctionnalité à implémenter');
    });
});

