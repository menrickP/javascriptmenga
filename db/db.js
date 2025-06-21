const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'ballast.proxy.rlwy.net',
    port: 51038,
    user: 'root',
    password: 'nNnaJWjSDfWpeNKSLktHDwdXNrquwAqX',
    database: 'railway'
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Erreur de connexion à MySQL Railway :', err.stack);
        return;
    }
    console.log('✅ Connexion réussie à MySQL sur Railway !');
});

module.exports = connection;

