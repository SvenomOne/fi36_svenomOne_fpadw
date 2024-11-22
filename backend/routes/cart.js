const express = require('express');
const router = express.Router();
const db = require('../db'); // Datenbankverbindung

// GET /cart - Warenkorb abrufen
router.get('/', (req, res) => {
    const userId = req.user && req.user.userId;

    if (!userId) {
        return res.status(400).json({ error: 'Benutzer-ID fehlt im Request' });
    }

    db.query(
        'SELECT c.product_id, p.title, c.quantity, p.price FROM cart c JOIN product p ON c.product_id = p.product_id WHERE c.user_id = ?',
        [userId],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Fehler beim Abrufen des Warenkorbs' });
            }

            res.status(200).json(results.length > 0 ? results : []);
        }
    );
});

// POST /cart - Produkt zum Warenkorb hinzufügen
router.post('/', (req, res) => {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
        return res.status(400).json({ error: 'Ungültige Anfrage: Daten fehlen' });
    }

    db.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
        [userId, productId, quantity, quantity],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Fehler beim Hinzufügen zum Warenkorb' });
            }

            res.status(201).json({ message: 'Produkt erfolgreich zum Warenkorb hinzugefügt' });
        }
    );
});

// Debugging: Prüfen, ob der Body korrekt empfangen wird
router.use((req, res, next) => {
    console.log('Empfangener Anfrage-Body:', req.body);
    next();
});

module.exports = router;
