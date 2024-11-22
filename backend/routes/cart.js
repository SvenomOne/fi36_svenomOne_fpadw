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
                console.error('Fehler beim Abrufen des Warenkorbs:', err);
                return res.status(500).json({ error: 'Fehler beim Abrufen des Warenkorbs' });
            }

            res.status(200).json(results.length > 0 ? results : []);
        }
    );
});

// POST /cart - Produkt zum Warenkorb hinzufügen
router.post('/', (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user && req.user.userId;

    if (!userId) {
        return res.status(400).json({ error: 'Benutzer ist nicht authentifiziert' });
    }

    if (!productId || quantity == null) {
        return res.status(400).json({ error: 'Ungültige Anfrage: Produkt-ID oder Menge fehlen' });
    }

    // Prüfen, ob das Produkt bereits im Warenkorb ist
    db.query(
        'SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?',
        [userId, productId],
        (err, results) => {
            if (err) {
                console.error('Fehler beim Abrufen des Warenkorbs:', err);
                return res.status(500).json({ error: 'Datenbankfehler' });
            }

            if (results.length > 0) {
                // Produkt existiert, Menge erhöhen
                db.query(
                    'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                    [quantity, userId, productId],
                    (updateErr) => {
                        if (updateErr) {
                            console.error('Fehler beim Aktualisieren der Menge:', updateErr);
                            return res.status(500).json({ error: 'Datenbankfehler' });
                        }
                        res.status(200).json({ message: 'Produktmenge erhöht' });
                    }
                );
            } else {
                // Neues Produkt hinzufügen
                db.query(
                    'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                    [userId, productId, quantity],
                    (insertErr) => {
                        if (insertErr) {
                            console.error('Fehler beim Hinzufügen des Produkts:', insertErr);
                            return res.status(500).json({ error: 'Datenbankfehler' });
                        }
                        res.status(201).json({ message: 'Produkt zum Warenkorb hinzugefügt' });
                    }
                );
            }
        }
    );
});

// DELETE /cart/:productId - Produkt aus dem Warenkorb entfernen
router.delete('/:productId', (req, res) => {
    const userId = req.user && req.user.userId;
    const productId = req.params.productId;

    if (!userId) {
        return res.status(400).json({ error: 'Benutzer ist nicht authentifiziert' });
    }

    db.query(
        'SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?',
        [userId, productId],
        (err, results) => {
            if (err) {
                console.error('Fehler beim Abrufen des Produkts:', err);
                return res.status(500).json({ error: 'Datenbankfehler' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Produkt nicht im Warenkorb gefunden' });
            }

            const currentQuantity = results[0].quantity;

            if (currentQuantity > 1) {
                // Menge um 1 reduzieren
                db.query(
                    'UPDATE cart SET quantity = quantity - 1 WHERE user_id = ? AND product_id = ?',
                    [userId, productId],
                    (updateErr) => {
                        if (updateErr) {
                            console.error('Fehler beim Reduzieren der Menge:', updateErr);
                            return res.status(500).json({ error: 'Datenbankfehler' });
                        }
                        res.status(200).json({ message: 'Menge erfolgreich reduziert' });
                    }
                );
            } else {
                // Produkt löschen, wenn Menge 1 ist
                db.query(
                    'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
                    [userId, productId],
                    (deleteErr) => {
                        if (deleteErr) {
                            console.error('Fehler beim Löschen des Produkts:', deleteErr);
                            return res.status(500).json({ error: 'Datenbankfehler' });
                        }
                        res.status(200).json({ message: 'Produkt erfolgreich entfernt' });
                    }
                );
            }
        }
    );
});

module.exports = router;
