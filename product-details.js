document.addEventListener("DOMContentLoaded", function () {
    const productDetailsElement = document.getElementById("productDetails");

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (productId) {
        const apiUrl = `https://dummyjson.com/products/${productId}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then(product => {
                displayProductDetails(product);
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
            });
    } else {
        console.error('Product ID not provided in the URL parameters.');
    }

    function displayProductDetails(product) {
        const productDetailsContainer = document.createElement("div");
        productDetailsContainer.classList.add("product-details-container");

        productDetailsContainer.innerHTML = `
        <div class="product-details-header">
            <img src="${product.thumbnail}" alt="${product.title}">
            <div class="product-details-info">
                <h2>${product.title}</h2>
                <p class="price">Price: $${product.price}</p>
                <p>Discount: ${product.discountPercentage}%</p>
                <p>Category: ${product.category}</p>
                <p>Stock: ${product.stock}</p>
            </div>
        </div>

        <div class="product-details-body">
            <h3>Description</h3>
            <p>${product.description}</p>
        </div>

        <div class="product-details-gallery">
            <h3>Product Gallery</h3>
            <div class="gallery-container">
                ${product.images.map(image => `<img src="${image}" alt="${product.title}">`).join('')}
            </div>
        </div>

        <a href="index.html">Back to Product List</a>
    `;


        productDetailsElement.appendChild(productDetailsContainer);
    }
});
