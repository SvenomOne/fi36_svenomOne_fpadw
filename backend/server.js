require('dotenv').config();
const express  = require('express');
const db       = require('./db');              // Datenbankverbindung importieren
const register = require('./routes/register'); // Registrierung importieren 
const login    = require('./routes/login');    // Login importieren 
const products = require('./routes/products'); // Produkte aus der db importieren

const app = express();
app.use(express.json());

app.use(register);
app.use(login);
app.use('/products', products);
app.use('/photos', express.static('photos')); // Statischer Zugriff auf den Ordner "photos"

app.listen(3000, '0.0.0.0', () => {
    console.log('Server läuft auf Port 3000');
});