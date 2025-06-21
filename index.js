// Importation des modules nécessaires
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3000; // Utilise le port Render ou 3000 en local

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rendre le dossier "html" public pour accéder au frontend
app.use(express.static(path.join(__dirname, 'html')));

// Connexion à la base de données MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'emploi_user',
    password: process.env.DB_PASS || '12345678',
    database: process.env.DB_NAME || 'emploi_du_temps'
});

connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err.message);
    } else {
        console.log('Connecté à la base de données MySQL.');
    }
});

// Route par défaut
app.get('/', (req, res) => {
    res.send('Bienvenue sur la plateforme de gestion des emplois du temps !');
});

// --- API Routes ---

// Authentification
app.post('/api/login', (req, res) => {
    const { username, password, role } = req.body;
    const sql = `SELECT * FROM users WHERE username = ? AND password = ? AND role = ?`;
    connection.query(sql, [username, password, role], (err, results) => {
        if (err) {
            console.error('Erreur SQL :', err.message);
            res.status(500).json({ success: false, message: 'Erreur serveur.' });
        } else if (results.length > 0) {
            res.json({ success: true, message: 'Connexion réussie.' });
        } else {
            res.json({ success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
        }
    });
});

// Gestion des utilisateurs
app.get('/api/users', (req, res) => {
    const sql = `SELECT id, username, role FROM users`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs :', err.message);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        } else {
            res.json(results);
        }
    });
});

app.post('/api/add-user', (req, res) => {
    const { username, password, role } = req.body;
    const sql = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
    connection.query(sql, [username, password, role], (err) => {
        if (err) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur :', err.message);
            res.status(500).json({ success: false, message: 'Erreur serveur.' });
        } else {
            res.json({ success: true, message: 'Utilisateur ajouté avec succès.' });
        }
    });
});

app.put('/api/update-user/:id', (req, res) => {
    const { username, password, role } = req.body;
    const { id } = req.params;
    const sql = `UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?`;
    connection.query(sql, [username, password, role, id], (err) => {
        if (err) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur :', err.message);
            res.status(500).json({ success: false, message: 'Erreur serveur.' });
        } else {
            res.json({ success: true, message: 'Utilisateur mis à jour avec succès.' });
        }
    });
});

app.delete('/api/delete-user/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM users WHERE id = ?`;
    connection.query(sql, [id], (err) => {
        if (err) {
            console.error('Erreur lors de la suppression de l\'utilisateur :', err.message);
            res.status(500).json({ success: false, message: 'Erreur serveur.' });
        } else {
            res.json({ success: true, message: 'Utilisateur supprimé avec succès.' });
        }
    });
});

// Créneaux réservés
app.get('/api/reserved-slots', (req, res) => {
    const sql = `
        SELECT id, jour, horaire, module, salle, enseignant_id
        FROM emploi_du_temps
        WHERE enseignant_id IS NOT NULL
    `;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des créneaux réservés :', err.message);
            res.status(500).json({ success: false, message: 'Erreur serveur.' });
        } else {
            res.json(results);
        }
    });
});

app.delete('/api/release-slot/:id', (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE emploi_du_temps SET enseignant_id = NULL WHERE id = ?`;
    connection.query(sql, [id], (err) => {
        if (err) {
            console.error('Erreur lors de la libération du créneau :', err.message);
            res.status(500).json({ success: false, message: 'Erreur serveur.' });
        } else {
            res.json({ success: true, message: 'Créneau libéré avec succès.' });
        }
    });
});

// Emploi du temps
app.get('/api/emploi-du-temps', (req, res) => {
    const sql = `SELECT * FROM emploi_du_temps`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de l\'emploi du temps :', err.message);
            res.status(500).json({ success: false, message: 'Erreur serveur.' });
        } else {
            res.json(results);
        }
    });
});

app.post('/api/reserve-period', (req, res) => {
    const { teacherId, jour, horaire, salle, module } = req.body;

    const sqlCheck = `
        SELECT * FROM emploi_du_temps
        WHERE jour = ? AND horaire = ? AND enseignant_id IS NOT NULL
    `;
    const sqlInsert = `
        INSERT INTO emploi_du_temps (enseignant_id, jour, horaire, salle, module)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(sqlCheck, [jour, horaire], (err, results) => {
        if (err) {
            console.error('Erreur SQL (check) :', err.message);
            res.status(500).json({ success: false, message: 'Erreur serveur.' });
        } else if (results.length > 0) {
            res.json({ success: false, message: 'Ce créneau est déjà réservé.' });
        } else {
            connection.query(sqlInsert, [teacherId, jour, horaire, salle, module], (err) => {
                if (err) {
                    console.error('Erreur SQL (insert) :', err.message);
                    res.status(500).json({ success: false, message: 'Erreur lors de la réservation.' });
                } else {
                    res.json({ success: true, message: 'Créneau réservé avec succès.' });
                }
            });
        }
    });
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}.`);
});

