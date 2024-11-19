const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    
    // E-Mail-Domain prüfen
    if (!email.endsWith('@nivea.de')) {
        return res.status(400).json({ success: false, message: 'Ungültige E-Mail-Adresse' });
    }

    // Passwort-Hashen
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // In Datenbank speichern
    db.query('INSERT INTO user (email, password_hash) VALUES (?, ?)', [email, passwordHash], (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Fehler bei der Registrierung' });
        }
        res.status(201).json({ success: true, message: 'Benutzer erfolgreich registriert' });
    });
});

module.exports = router; 

