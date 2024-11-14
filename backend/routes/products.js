const express = require('express');
const db = require('../db');            // Datenbankverbindung importieren

const router = express.Router();

// Route zum Abrufen aller Produkte
router.get('/', (req, res) => {
    db.query('SELECT * FROM product', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Fehler beim Abrufen der Produkte' });
        }

        // Bild-URL zusammenstellen
        results.forEach(product => {
            if (product.image) {
                product.image = `https://fi.mshome.net/fi36_schaklewski_fpadw/photos/${product.image}`;
            }
        });
                    
        res.json(results);
    });
});

module.exports = router;
