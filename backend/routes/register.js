const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    const connection = await db;

    try {
        // E-Mail-Domain prüfen
        if (!email.endsWith('@nivea.de')) {
            return res.status(400).json({ success: false, message: 'Ungültige E-Mail-Adresse' });
        }

        // Passwort-Hashen
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // In Datenbank speichern
        await connection.query(
            'INSERT INTO user (email, password_hash) VALUES (?, ?)',
            [email, passwordHash]
        );

        res.status(201).json({ success: true, message: 'Benutzer erfolgreich registriert' });
    } catch (err) {
        console.error('Fehler bei der Registrierung:', err);
        res.status(500).json({ success: false, message: 'Fehler bei der Registrierung' });
    }
});

module.exports = router;
