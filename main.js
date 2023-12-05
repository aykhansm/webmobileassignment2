document.addEventListener("DOMContentLoaded", function () {
    const productListElement = document.getElementById("productList");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const pageSize = 10; 

    let products;
    let currentPage = 1;

    const apiUrl = "https://dummyjson.com/products?limit=100";

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            products = data.products;
            generateCategoryOptions(products);
            renderProducts(products, currentPage);
            establishPagination(products);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    function renderProducts(products, page) {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const productsToDisplay = products.slice(startIndex, endIndex);

        productListElement.innerHTML = "";

        if (!Array.isArray(productsToDisplay)) {
            console.error('Wrong data format:', productsToDisplay);
            return;
        }

        if (productsToDisplay.length === 0) {
            console.warn('No products found.');
            return;
        }

        productsToDisplay.forEach(product => {
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

    function generateCategoryOptions(products) {
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
                products = data.products;
                currentPage = 1;
                renderProducts(products, currentPage);
                establishPagination(products);
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
                products = data.products;
                currentPage = 1;
                renderProducts(products, currentPage);
                establishPagination(products);
            })
            .catch(error => {
                console.error('Error fetching category results:', error);
            });
    }

    function establishPagination(products) {
        const totalPages = Math.ceil(products.length / pageSize);
    
        const existingPaginationContainer = document.querySelector(".pagination");
        if (existingPaginationContainer) {
            existingPaginationContainer.remove();
        }
    
        const paginationContainer = document.createElement("div");
        paginationContainer.classList.add("pagination");
    
        const backwardButton = createPaginationButton("<", () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts(products, currentPage);
               
            }
        });
        paginationContainer.appendChild(backwardButton);
    
        const forwardButton = createPaginationButton(">", () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts(products, currentPage);
            }
        });
        paginationContainer.appendChild(forwardButton);
    
        document.body.appendChild(paginationContainer);
    
        }

    function createPaginationButton(label, clickHandler) {
        const button = document.createElement("button");
        button.textContent = label;
        button.addEventListener("click", clickHandler);
        return button;
    }
});
