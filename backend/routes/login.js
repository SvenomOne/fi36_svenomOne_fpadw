const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('../db');

const router = express.Router();

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // 1. Benutzer anhand der E-Mail suchen
    db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ message: 'Ungültige E-Mail oder Passwort' });
        }

        const user = results[0];

        // 2. Passwort-Überprüfung
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Ungültige E-Mail oder Passwort' });
        }

        // 3. JWT-Token erstellen
        const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Anmeldung erfolgreich', token });
    });
});

module.exports = router;
