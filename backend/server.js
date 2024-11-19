const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware-Konfiguration
const corsOptions = {
    origin: ['http://fi.mshome.net', 'https://fi.mshome.net'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Debugging-Middleware (füge das hier ein)
app.use((req, res, next) => {
    console.log(`Anfrage erhalten: ${req.method} ${req.url}`);
    next();
});

// Routen
const register = require('./routes/register');
const login = require('./routes/login');
const products = require('./routes/products');

app.use('/register', register);
app.use('/login', login);
app.use('/products', products);

// Statische Inhalte
app.use('/photos', express.static('photos'));

// Server starten
app.listen(3000, '0.0.0.0', () => {
    console.log('Server läuft auf Port 3000');
});
