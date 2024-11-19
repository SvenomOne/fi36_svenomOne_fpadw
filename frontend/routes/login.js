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
       
        .then(response => {console.log(response);return response})
        .then(response => response.json())
        .then(data => {
            const messageElement = document.getElementById('login-message');
            if (data.message) {
                messageElement.innerText = data.message;
                messageElement.style.color = data.success ? 'green' : 'red';
            }
    
            // Falls die Anmeldung erfolgreich war, den Warenkorb anzeigen
            if (data.success) {
                document.getElementById('cart').style.display = 'block';
                console.log('JWT-Token:', data.token); // JWT-Token anzeigen
            }
        })
        .catch(error => console.error('Anmeldefehler:', error));
    
});
