// Event-Listener für das Anmeldeformular
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Verhindert das Standard-Absenden des Formulars

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Senden der Anmeldedaten an das Backend
    fetch('http://fi.mshome.net:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        const messageElement = document.getElementById('login-message');
        if (data.message) {
            messageElement.innerText = data.message;
            messageElement.style.color = data.success ? 'green' : 'red';
        }

        // Falls die Anmeldung erfolgreich war, den Benutzername anzeigen und Warenkorb anzeigen
        if (data.success) {
            console.log("Login erfolgreich:", data);
            // Token und Benutzername speichern
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', email);

            // Sektionen aktualisieren
            showSection('products'); // Produkte anzeigen (falls gewünscht)
            displayCart(); // Warenkorb-Inhalte anzeigen

            // Benutzerinfo anzeigen
            console.log("handleLoginSuccess() aufgerufen", email);
            handleLoginSuccess(email);
        }
    })
    .catch(error => console.error('Anmeldefehler:', error));
});

// Funktion zum Verarbeiten der erfolgreichen Anmeldung
function handleLoginSuccess(username) {
    console.log("handleLoginSuccess() aufgerufen", username);

    // Benutzerinfo im Navbar-Bereich anzeigen
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    usernameDisplay.textContent = `Angemeldet als: ${username}`;
    userInfo.style.display = 'inline';

    // Warenkorb anzeigen
    const cartSection = document.getElementById('cart');
    console.log("Warenkorb sichtbar machen:", cartSection);
    cartSection.style.display = 'block';
}

// Funktion zum Ausloggen
function logout() {
    // Token und Benutzername aus dem lokalen Speicher entfernen
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // Benutzerinfo ausblenden
    const userInfo = document.getElementById('user-info');
    userInfo.style.display = 'none';

    // Warenkorb ausblenden
    const cartSection = document.getElementById('cart');
    cartSection.style.display = 'none';

    // Zurück zur Anmeldeseite wechseln
    showSection('login');
}
