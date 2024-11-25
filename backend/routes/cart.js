const express = require('express');
const db = require('../db'); // Datenbankverbindung
const router = express.Router();

// GET /cart - Warenkorb abrufen
router.get('/', async (req, res) => {
    const connection = await db;
    const userId = req.user && req.user.userId;

    if (!userId) {
        return res.status(400).json({ error: 'Benutzer-ID fehlt im Request' });
    }

    try {
        const [results] = await connection.query(
            'SELECT c.product_id, p.title, c.quantity, p.price FROM cart c JOIN product p ON c.product_id = p.product_id WHERE c.user_id = ?',
            [userId]
        );
        res.status(200).json(results.length > 0 ? results : []);
    } catch (err) {
        console.error('Fehler beim Abrufen des Warenkorbs:', err);
        res.status(500).json({ error: 'Fehler beim Abrufen des Warenkorbs' });
    }
});

// POST /cart - Produkt zum Warenkorb hinzufügen
router.post('/', async (req, res) => {
    const connection = await db;
    const { productId, quantity } = req.body;
    const userId = req.user && req.user.userId;

    if (!userId) {
        return res.status(400).json({ error: 'Benutzer ist nicht authentifiziert' });
    }

    if (!productId || quantity == null) {
        return res.status(400).json({ error: 'Ungültige Anfrage: Produkt-ID oder Menge fehlen' });
    }

    try {
        const [results] = await connection.query(
            'SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (results.length > 0) {
            await connection.query(
                'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                [quantity, userId, productId]
            );
            res.status(200).json({ message: 'Produktmenge erhöht' });
        } else {
            await connection.query(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [userId, productId, quantity]
            );
            res.status(201).json({ message: 'Produkt zum Warenkorb hinzugefügt' });
        }
    } catch (err) {
        console.error('Fehler beim Hinzufügen des Produkts:', err);
        res.status(500).json({ error: 'Fehler beim Hinzufügen des Produkts' });
    }
});

// DELETE /cart/:productId - Produkt aus dem Warenkorb entfernen
router.delete('/:productId', async (req, res) => {
    const connection = await db;
    const userId = req.user && req.user.userId;
    const productId = req.params.productId;

    if (!userId) {
        return res.status(400).json({ error: 'Benutzer ist nicht authentifiziert' });
    }

    try {
        const [results] = await connection.query(
            'SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (results.length === 0) {
            return res.status(404).json({ message: 'Produkt nicht im Warenkorb gefunden' });
        }

        const currentQuantity = results[0].quantity;

        if (currentQuantity > 1) {
            await connection.query(
                'UPDATE cart SET quantity = quantity - 1 WHERE user_id = ? AND product_id = ?',
                [userId, productId]
            );
            res.status(200).json({ message: 'Menge erfolgreich reduziert' });
        } else {
            await connection.query(
                'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
                [userId, productId]
            );
            res.status(200).json({ message: 'Produkt erfolgreich entfernt' });
        }
    } catch (err) {
        console.error('Fehler beim Entfernen des Produkts:', err);
        res.status(500).json({ error: 'Fehler beim Entfernen des Produkts' });
    }
});

// POST /cart/order - Bestellung aufgeben
router.post('/order', async (req, res) => {
    const connection = await db;
    const userId = req.user && req.user.userId;

    if (!userId) {
        return res.status(400).json({ error: 'Benutzer ist nicht authentifiziert' });
    }

    try {
        // Bestellung erstellen
        const [orderResult] = await connection.query(
            'INSERT INTO `order` (user_id, order_date) VALUES (?, NOW())',
            [userId]
        );

        const orderId = orderResult.insertId;

        // Produkte aus dem Warenkorb in `order_items` übertragen
        await connection.query(
            'INSERT INTO order_items (order_id, product_id, quantity) SELECT ?, product_id, quantity FROM cart WHERE user_id = ?',
            [orderId, userId]
        );

        // Warenkorb leeren
        await connection.query(
            'DELETE FROM cart WHERE user_id = ?',
            [userId]
        );

        res.status(200).json({ message: 'Bestellung erfolgreich aufgegeben', orderId });
    } catch (err) {
        console.error('Fehler beim Aufgeben der Bestellung:', err);
        res.status(500).json({ error: 'Fehler beim Aufgeben der Bestellung' });
    }
});

module.exports = router;
