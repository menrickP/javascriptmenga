function authenticateUser(username, password, role) {
    console.log(`Tentative de connexion avec : ${username}, rôle : ${role}`);

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, role })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau ou serveur');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log('Connexion réussie');
                window.location.href = `./${role}.html`; // Redirige vers la page correspondante
            } else {
                console.log('Erreur d\'authentification :', data.message);
                displayError(data.message);
            }
        })
        .catch(err => {
            console.error('Erreur réseau :', err);
            displayError('Erreur de connexion au serveur, veuillez réessayer.');
        });
}

// Fonction pour afficher les messages d'erreur
function displayError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Initialisation de l'événement "submit" sur le formulaire
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    authenticateUser(username, password, role); // Appelle la fonction de connexion
});

