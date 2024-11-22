// Warenkorb anzeigen
function displayCart() {
    const token = localStorage.getItem('token'); // Token aus dem Login
    fetch('http://fi.mshome.net:3000/cart', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(cart => {
        if (!Array.isArray(cart)) {
            console.error('Fehler: Warenkorbdaten sind kein Array', cart);
            return;
        }

        const cartContainer = document.getElementById('cart-items');
        cartContainer.innerHTML = ''; // Bestehende Inhalte löschen

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Ihr Warenkorb ist leer.</p>';
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.innerHTML = `
                    <p>${item.title} - ${item.quantity} Stück - ${item.price} €</p>
                    <button onclick="removeFromCart(${item.product_id})">Entfernen</button>
                `;
                cartContainer.appendChild(cartItem);
            });
        }
    })
    .catch(error => console.error('Fehler beim Abrufen des Warenkorbs:', error));
}



// Produkt zum Warenkorb hinzufügen
function addToCart(productId) {
    const token = localStorage.getItem('token'); // Token aus dem Login
    fetch('http://fi.mshome.net:3000/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 1 }) // Menge standardmäßig 1
    })
    .then(response => {
        if (response.ok) {
            console.log('Artikel erfolgreich hinzugefügt');
            displayCart(); // Warenkorb aktualisieren
        } else {
            console.error('Fehler beim Hinzufügen zum Warenkorb:', response.statusText);
        }
    })
    .catch(error => console.error('Netzwerkfehler:', error));
}

// Produkt aus dem Warenkorb entfernen
function removeFromCart(productId) {
    const token = localStorage.getItem('token'); // Token aus dem Login
    fetch(`http://fi.mshome.net:3000/cart/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Artikel erfolgreich entfernt');
            displayCart(); // Warenkorb aktualisieren
        } else {
            console.error('Fehler beim Entfernen:', response.statusText);
        }
    })
    .catch(error => console.error('Netzwerkfehler:', error));
}

// Warenkorb abschicken
function submitCart(userId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    fetch('http://fi.mshome.net:3000/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, cart })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Bestellung erfolgreich:', data);
        localStorage.removeItem('cart'); // Warenkorb leeren
    })
    .catch(error => console.error('Fehler:', error));
}
