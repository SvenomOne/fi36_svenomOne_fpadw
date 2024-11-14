const express = require('express');
const bcrypt  = require('bcryptjs');
const db      = require('../db');     

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // 1. Überprüfen der firmeneigenen E-Mail-Domain
    if (!email.endsWith('@nivea.de')) {
        return res.status(400).json({ message: 'Ungültige E-Mail-Adresse' });
    }

    // 2. Passwort verschlüsseln
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Benutzer in der Datenbank speichern
    db.query('INSERT INTO user (email, password_hash) VALUES (?, ?)', [email, passwordHash], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Fehler bei der Registrierung' });
        }
        res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
    });
});

module.exports = router;
