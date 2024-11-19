const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router(); // <-- Router muss definiert werden!

router.post('/', (req, res) => {
    const { email, password } = req.body;

    // Debugging: Eingehende Daten anzeigen
    console.log('Anmeldedaten erhalten:', email, password);

    // Benutzer anhand der E-Mail suchen
    db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Datenbankfehler beim Suchen des Benutzers:', err);
            return res.status(500).json({ success: false, message: 'Serverfehler' });
        }
        if (results.length === 0) {
            console.log('Kein Benutzer mit der E-Mail gefunden:', email);
            return res.status(400).json({ success: false, message: 'Ungültige E-Mail oder Passwort' });
        }

        const user = results[0];

        // Passwort überprüfen
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            console.log('Falsches Passwort für Benutzer:', email);
            return res.status(400).json({ success: false, message: 'Ungültige E-Mail oder Passwort' });
        }

        // JWT-Token erstellen
        const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        console.log('Anmeldung erfolgreich:', email);
        console.log('JWT-Token erfolgreich erstellt:', token);

        res.status(200).json({ success: true, message: 'Anmeldung erfolgreich', token });
    });
});

module.exports = router;
