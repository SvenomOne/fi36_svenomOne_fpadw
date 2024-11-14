fetch('http://fi.mshome.net:3000/products')
    .then(response => response.json())
    .then(data => {
        const productContainer = document.getElementById('product-container');
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
