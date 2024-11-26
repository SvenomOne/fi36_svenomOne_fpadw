// Funktion, um verschiedene Sektionen anzuzeigen
function showSection(section) {
    // Alle Sektionen ausblenden
    document.getElementById('products').style.display = 'none';
    document.getElementById('register').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('cart').style.display = 'none'; // Warenkorb ausblenden

    // Angeforderte Sektion anzeigen
    document.getElementById(section).style.display = 'block';

    // Nur für die Produktübersicht: Daten laden
    if (section === 'products') {
        loadProducts();
    }
}

// Funktion: Prüfen, ob der Benutzer eingeloggt ist
function isLoggedIn() {
    return !!localStorage.getItem('token'); // Token im Local Storage prüfen
}

// Funktion zum Laden der Produktdaten
function loadProducts() {
    fetch('http://fi.mshome.net:3000/products')
        .then(response => response.json())
        .then(data => {
            const productContainer = document.getElementById('product-container');
            productContainer.innerHTML = ''; // Vorherige Inhalte löschen

            data.forEach(product => {
                const productId = product.id || product.product_id; // Passe hier die ID an

                const productElement = document.createElement('div');
                productElement.className = 'product';
                productElement.setAttribute('data-id', productId);
                productElement.setAttribute('data-name', product.title);
                productElement.setAttribute('data-price', product.price);

                productElement.innerHTML = `
                    <h3>${product.title}</h3>
                    <img src="${product.image}" alt="${product.title}" width="150" height="150" />
                    <p>Beschreibung: ${product.description}</p>
                    <p>Preis: ${product.price}€</p>
                `;

                // Button nur anzeigen, wenn der Benutzer eingeloggt ist
                if (isLoggedIn()) {
                    const button = document.createElement('button');
                    button.textContent = "Zum Warenkorb hinzufügen";
                    button.classList.add('add-to-cart');
                    productElement.appendChild(button);
                }

                productContainer.appendChild(productElement);
            });
        })
        .catch(error => console.error('Fehler beim Abrufen der Produkte:', error));
}

// Warenkorb initialisieren
let cart = [];

// Event-Listener für "Zum Warenkorb hinzufügen"-Buttons
document.getElementById('product-container').addEventListener('click', function (event) {
    if (event.target.classList.contains('add-to-cart')) {
        const productElement = event.target.closest('.product');
        const productId = parseInt(productElement.getAttribute('data-id'));
        const productName = productElement.getAttribute('data-name');
        const productPrice = parseFloat(productElement.getAttribute('data-price'));

        const product = {
            id: productId,
            name: productName,
            price: productPrice,
        };

        addToCart(product);
    }
});

// Funktion: Produkt dem Warenkorb hinzufügen
function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1; // Menge erhöhen
    } else {
        cart.push({ ...product, quantity: 1 }); // Neues Produkt hinzufügen
    }

    const dataToSend = {
        userId: localStorage.getItem('userId'), // Benutzer-ID
        productId: product.id,
        quantity: 1,
    };

    fetch('http://fi.mshome.net:3000/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Auth-Token senden
        },
        body: JSON.stringify(dataToSend),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text);
                });
            }
            return response.json();
        })
        .then(() => alert('Produkt erfolgreich hinzugefügt!'))
        .catch(error => console.error('Fehler beim Hinzufügen zum Warenkorb:', error));

    updateCartUI();
}

// Funktion: Warenkorb-UI aktualisieren
function updateCartUI() {
    const cartSection = document.getElementById('cart-items');
    cartSection.innerHTML = cart.map(item => `
        <div>
            <p>${item.name} - ${item.quantity} Stück - ${(item.price * item.quantity).toFixed(2)} €</p>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalElement = document.createElement('p');
    totalElement.innerText = `Gesamt: ${total.toFixed(2)} €`;
    cartSection.appendChild(totalElement);
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});
