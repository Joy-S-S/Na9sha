document.addEventListener('DOMContentLoaded', function() {
    // Get category from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    // Set category title
    if (category) {
        let categoryTitle = '';
        switch(category) {
            case 'tshirts':
                categoryTitle = 'تيشيرتات';
                break;
            case 'hoodies':
                categoryTitle = 'هوديز';
                break;
            case 'new':
                categoryTitle = 'منتجات جديدة';
                break;
            case 'offers':
                categoryTitle = 'العروض';
                break;
            default:
                categoryTitle = 'جميع المنتجات';
        }
        
        document.getElementById('category-title').textContent = categoryTitle;
    }
    
    // Load products based on category
    loadProducts(category);
    
    // Handle sorting
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            loadProducts(category, this.value);
        });
    }
});

// Sample product data
const products = [
    {
        id: 1,
        name: 'تيشيرت تصميم خاص',
        price: 75,
        image: 'images/product1.jpg',
        category: 'tshirts',
        isNew: true,
        isOffer: false
    },
    {
        id: 2,
        name: 'هودي شتوي دافئ',
        price: 120,
        image: 'images/product2.jpg',
        category: 'hoodies',
        isNew: false,
        isOffer: true
    },
    {
        id: 3,
        name: 'تيشيرت قطني',
        price: 65,
        image: 'images/product3.jpg',
        category: 'tshirts',
        isNew: false,
        isOffer: false
    },
    {
        id: 4,
        name: 'هودي رياضي',
        price: 110,
        image: 'images/product4.jpg',
        category: 'hoodies',
        isNew: true,
        isOffer: false
    },
    {
        id: 5,
        name: 'تيشيرت أزرق',
        price: 70,
        image: 'images/product5.jpg',
        category: 'tshirts',
        isNew: false,
        isOffer: true
    },
    {
        id: 6,
        name: 'هودي أسود',
        price: 130,
        image: 'images/product6.jpg',
        category: 'hoodies',
        isNew: false,
        isOffer: false
    },
    {
        id: 7,
        name: 'تيشيرت أبيض',
        price: 60,
        image: 'images/product7.jpg',
        category: 'tshirts',
        isNew: true,
        isOffer: false
    },
    {
        id: 8,
        name: 'هودي رمادي',
        price: 125,
        image: 'images/product8.jpg',
        category: 'hoodies',
        isNew: false,
        isOffer: true
    }
];

// Load products based on category and sort
function loadProducts(category, sort = 'default') {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    // Filter products by category
    let filteredProducts = products;
    if (category) {
        switch(category) {
            case 'tshirts':
            case 'hoodies':
                filteredProducts = products.filter(p => p.category === category);
                break;
            case 'new':
                filteredProducts = products.filter(p => p.isNew);
                break;
            case 'offers':
                filteredProducts = products.filter(p => p.isOffer);
                break;
        }
    }
    
    // Sort products
    switch(sort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.isNew - a.isNew);
            break;
    }
    
    // Display products
    productsContainer.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p>لا توجد منتجات في هذه الفئة</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price} ر.س</p>
            <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">أضف إلى العربة</button>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to new add to cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image');
            
            addToCart(productId, productName, productPrice, productImage);
            
            // Show confirmation message
            alert('تمت إضافة المنتج إلى العربة');
        });
    });
}