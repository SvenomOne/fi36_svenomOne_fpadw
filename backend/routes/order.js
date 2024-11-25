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
    const connection = await db;
    const userId = req.user && req.user.userId; // Aktueller Nutzer
    console.log("kommentar");
    
    try {
        // Warenkorb des Nutzers abrufen
        const [cart] = await connection.query('SELECT * FROM cart WHERE user_id = ?', [userId]);
        
        if (cart.length === 0) {
            return res.status(400).send({ message: 'Warenkorb ist leer. Bestellung nicht möglich.' });
        }
        
        console.log(cart);

        // Bestellung in der Tabelle 'order' speichern
        const [orderResult] = await connection.query(
            'INSERT INTO `order` (user_id, order_date) VALUES (?, NOW())',
            [userId]
        );
        const orderId = orderResult.insertId;

        // Produkte in 'order_items' speichern
        const orderItemsQueries = cart.map(item =>
            connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
                [orderId, item.product_id, item.quantity]
            )
        );
        await Promise.all(orderItemsQueries);

        // Warenkorb leeren
        await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);

        res.status(201).send({ message: 'Bestellung erfolgreich angelegt', orderId });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Fehler beim Anlegen der Bestellung' });
    }
});

module.exports = router;
