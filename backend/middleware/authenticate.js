const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extrahiere das Token aus dem Header

    if (!token) {
        console.error('Token fehlt');
        return res.sendStatus(401); // Unauthorized
    }

    // Token validieren
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
        if (err) {
            console.error('Token ungültig:', err);
            return res.sendStatus(403); // Forbidden
        }

        // Benutzerdaten in req speichern, um sie in der Route weiterzuverwenden
        req.user = user;
        console.log('Benutzer aus Token extrahiert:', user);
        next();
    });
}

module.exports = authenticateToken;
