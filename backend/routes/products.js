const express = require('express');
const db = require('../db');            // Datenbankverbindung importieren

const router = express.Router();

// Route zum Abrufen aller Produkte
router.get('/',async  (req, res) => {
    const connection = await db;
    try{
        const [results] = await connection.query('SELECT * FROM product'); 
        // Bild-URL zusammenstellen
         results.forEach(product => {
            if (product.image) {
                product.image = `http://fi.mshome.net/fi36_schaklewski_fpadw/photos/${product.image}`;
            }
        });
                    
        res.json(results);
    } catch(err)
        {
        return res.status(500).json({ message: 'Fehler beim Abrufen der Produkte' });
    }
     
});

module.exports = router;
