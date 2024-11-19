// Event-Listener für das Registrierungsformular
document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Verhindert das Standardverhalten 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const messageElement = document.getElementById('registration-message');

    // Überprüfen, ob die E-Mail-Adresse mit @nivea.de endet
    if (!email.endsWith('@nivea.de')) {
        messageElement.innerText = 'Die E-Mail-Adresse muss mit @nivea.de enden.';
        messageElement.style.color = 'red';
        return;
    }

    // Überprüfung, ob die Passwörter übereinstimmen
    if (password !== confirmPassword) {
        messageElement.innerText = 'Die Passwörter stimmen nicht überein.';
        messageElement.style.color = 'red';
        return;
    }

    // Senden der Registrierungsdaten an das Backend
    fetch('http://fi.mshome.net:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messageElement.innerText = 'Registrierung erfolgreich!';
            messageElement.style.color = 'green';
        } else {
            messageElement.innerText = data.message || 'Registrierung fehlgeschlagen.';
            messageElement.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Registrierungsfehler:', error);
        messageElement.innerText = 'Ein Fehler ist aufgetreten.';
        messageElement.style.color = 'red';
    });
});
