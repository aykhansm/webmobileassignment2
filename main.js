document.addEventListener("DOMContentLoaded", function () {
    const productListElement = document.getElementById("productList");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");

    let products;

    const apiUrl = "https://dummyjson.com/products";

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            products = data.products;
            populateCategoryFilter(products);
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

    function populateCategoryFilter(products) {
        const categories = [...new Set(products.map(product => product.category))];
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    searchInput.addEventListener("input", handleSearch);
    categoryFilter.addEventListener("change", handleFilter);

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        fetch(`https://dummyjson.com/products/search?q=${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                displayProducts(data.products);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
            });
    }

    function handleFilter() {
        const selectedCategory = categoryFilter.value;
        fetch(`https://dummyjson.com/products/category/${selectedCategory}`)
            .then(response => response.json())
            .then(data => {
                displayProducts(data.products);
            })
            .catch(error => {
                console.error('Error fetching category results:', error);
            });
    }
});
