document.addEventListener('DOMContentLoaded', function() {
    // جلب البيانات من ملف JSON
    fetch('data/products.json')
        .then(response => response.json())
        .then(products => {
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category');
            
            // تعيين عنوان الفئة
            if (category) {
                let categoryTitle = '';
                switch(category) {
                    case 'tshirts': categoryTitle = 'تيشيرتات'; break;
                    case 'hoodies': categoryTitle = 'هوديز'; break;
                    case 'new': categoryTitle = 'منتجات جديدة'; break;
                    case 'offers': categoryTitle = 'العروض'; break;
                    default: categoryTitle = 'جميع المنتجات';
                }
                document.getElementById('category-title').textContent = categoryTitle;
            }
            
            // تحميل المنتجات
            loadProducts(products, category);
            
            // التعامل مع الفرز
            const sortSelect = document.getElementById('sort');
            if (sortSelect) {
                sortSelect.addEventListener('change', function() {
                    loadProducts(products, category, this.value);
                });
            }
        })
        .catch(error => console.error('Error loading products:', error));
});

// دالة تحميل المنتجات
function loadProducts(products, category, sort = 'default') {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    // تصفية المنتجات حسب الفئة
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
    
    // ترتيب المنتجات
    switch(sort) {
        case 'price-low': filteredProducts.sort((a, b) => a.price - b.price); break;
        case 'price-high': filteredProducts.sort((a, b) => b.price - a.price); break;
        case 'newest': filteredProducts.sort((a, b) => b.isNew - a.isNew); break;
    }
    
    // عرض المنتجات
    productsContainer.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p>لا توجد منتجات في هذه الفئة</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <a href="product-details.html?id=${product.id}" class="product-link">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${product.price}ج.م</p>
            </a>
            <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">أضف إلى العربة</button>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // إضافة مستمعات الأحداث لأزرار إضافة إلى السلة
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image');
            
            addToCart(productId, productName, productPrice, productImage);
            alert('تمت إضافة المنتج إلى العربة');
        });
    });
}