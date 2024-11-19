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

// Funktion zum Laden der Produktdaten
function loadProducts() {
    fetch('http://fi.mshome.net:3000/products')
        .then(response => response.json())
        .then(data => {
            const productContainer = document.getElementById('product-container');
            productContainer.innerHTML = ''; // Vorherige Inhalte löschen

            // Produktdaten einfügen
            data.forEach(product => {
                const productElement = document.createElement('div');
                productElement.innerHTML = `
                    <h3>${product.title}</h3>
                    <img src="${product.image}" alt="${product.title}" width="150" height="150" />
                    <p>Beschreibung: ${product.description}</p>
                    <p>Preis: ${product.price}€</p>
                `;
                productContainer.appendChild(productElement);
            });
        })
        .catch(error => console.error('Fehler beim Abrufen der Produkte:', error));
}
