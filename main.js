document.addEventListener("DOMContentLoaded", function () {
    const productListElement = document.getElementById("productList");

    const apiUrl = "https://dummyjson.com/products";

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const products = data.products;

            displayProducts(products);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    function displayProducts(products) {
        productListElement.innerHTML = ""; 

        if (!Array.isArray(products)) {
            console.error('Invalid data format:', products);
            return;
        }

        if (products.length === 0) {
            console.warn('No products found.');
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>Price: $${product.price}</p>
                <p>Discount: ${product.discountPercentage}%</p>
                <p>Category: ${product.category}</p>
                <p>Stock: ${product.stock}</p>
                <a href="product-details.html?id=${product.id}">View Details</a>
            `;

            productListElement.appendChild(productCard);
        });
    }
});
