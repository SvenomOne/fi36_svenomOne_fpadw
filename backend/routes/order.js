const express = require('express');
const router = express.Router();
const db = require('../db'); // Datenbankverbindung

// GET /order - Testroute
router.get('/', (req, res) => {
    res.status(200).send({ 
        message: 'GET-Anfrage erfolgreich', 
        info: 'Bestellungen können nur per POST erstellt werden.' 
    });
});

// POST /order - Bestellung verarbeiten
router.post('/', async (req, res) => {
    const { userId, cart } = req.body;

    if (!userId || !cart || cart.length === 0) {
        return res.status(400).send({ error: 'Ungültige Bestellung' });
    }

    try {
        // Bestellung in der Tabelle 'order' speichern
        const [orderResult] = await db.execute(
            'INSERT INTO `order` (user_id, created_at, status) VALUES (?, NOW(), ?)',
            [userId, 'pending']
        );

        const orderId = orderResult.insertId;

        // Produkte in 'order_items' speichern
        const orderItemsQueries = cart.map(item =>
            db.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price) SELECT ?, ?, ?, price FROM product WHERE id = ?',
                [orderId, item.productId, item.quantity, item.productId]
            )
        );

        await Promise.all(orderItemsQueries);

        res.status(201).send({ message: 'Bestellung erfolgreich angelegt', orderId });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Fehler beim Anlegen der Bestellung' });
    }
});

module.exports = router;
