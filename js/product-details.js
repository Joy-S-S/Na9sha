document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // جلب بيانات المنتج من ملف JSON
    fetch('data/products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);

            if (product) {
                loadProductDetails(product);
            } else {
                window.location.href = 'products.html';
            }
        })
        .catch(error => {
            console.error('Error loading product details:', error);
            window.location.href = 'products.html';
        });
});

function loadProductDetails(product) {
    // تحديث الصورة الرئيسية
    const mainImage = document.getElementById('main-image');
    if (mainImage) {
        mainImage.src = product.image;
        mainImage.alt = product.name;
    }

    // تحديث الثمبنييلز
    const thumbnailsContainer = document.querySelector('.thumbnail-images');
    if (thumbnailsContainer) {
        thumbnailsContainer.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="thumbnail active">
            ${product.altImages.map(img => `
                <img src="${img}" alt="${product.name}" class="thumbnail">
            `).join('')}
        `;
    }

    // تحديث معلومات المنتج
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = `${product.price} ج.م`;
    document.querySelector('.tab-content p').textContent = product.description;
    document.querySelector('.product-description p').textContent = product.description;

    // تحديث تفاصيل المنتج في تبويب الوصف
    const descriptionList = document.querySelector('#description ul');
    if (descriptionList) {
        descriptionList.innerHTML = product.details.map(detail => `
            <li>${detail}</li>
        `).join('');
    }

    // عرض المقاسات والألوان المتاحة
    const sizeOptionsContainer = document.querySelector('.size-options');
    const colorOptionsContainer = document.querySelector('.color-options');
    
    if (sizeOptionsContainer && product.availableOptions) {
        // مسح الخيارات القديمة
        sizeOptionsContainer.innerHTML = '';
        colorOptionsContainer.innerHTML = '';

        // إنشاء خيارات المقاسات
        Object.keys(product.availableOptions).forEach(size => {
            const sizeBtn = document.createElement('button');
            sizeBtn.className = 'size-option';
            sizeBtn.textContent = size;
            sizeBtn.dataset.size = size;
            sizeOptionsContainer.appendChild(sizeBtn);
        });

        // تحديد أول مقاس كافتراضي
        const firstSize = Object.keys(product.availableOptions)[0];
        const firstSizeBtn = sizeOptionsContainer.querySelector(`[data-size="${firstSize}"]`);
        firstSizeBtn.classList.add('active');
        
        // عرض الألوان المتاحة للمقاس الأول
        updateColorOptions(product.availableOptions[firstSize]);

        // إضافة حدث تغيير المقاس
        sizeOptionsContainer.querySelectorAll('.size-option').forEach(btn => {
            btn.addEventListener('click', function() {
                // إزالة التنشيط من جميع الأزرار
                sizeOptionsContainer.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
                
                // تنشيط الزر المحدد
                this.classList.add('active');
                
                // تحديث الألوان المتاحة لهذا المقاس
                const selectedSize = this.dataset.size;
                updateColorOptions(product.availableOptions[selectedSize]);
            });
        });
    }

    // تحديث زر إضافة إلى السلة
    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productName = document.getElementById('product-name').textContent;
            const productPrice = parseFloat(document.getElementById('product-price').textContent);
            const productImage = document.getElementById('main-image').src;
            const quantity = parseInt(document.querySelector('.quantity-input').value);
            const selectedSize = document.querySelector('.size-option.active')?.dataset.size;
            const selectedColor = document.querySelector('.color-option.active')?.dataset.color;
            
            // Generate a unique ID based on product name, size and color
            const productId = `${product.name.replace(/\s+/g, '-').toLowerCase()}-${selectedSize}-${selectedColor}`;
            
            addToCart(productId, productName, productPrice, productImage, quantity, selectedSize, selectedColor);
            
            // Show confirmation message
            alert('تمت إضافة المنتج إلى العربة');
        });
    }

    // تهيئة معرض الصور
    initImageGallery();
}

// دالة لتحديث خيارات الألوان حسب المقاس المحدد
function updateColorOptions(availableColors) {
    const colorOptionsContainer = document.querySelector('.color-options');
    colorOptionsContainer.innerHTML = '';

    if (!availableColors || availableColors.length === 0) {
        colorOptionsContainer.innerHTML = '<p class="no-colors">لا توجد ألوان متاحة لهذا المقاس</p>';
        return;
    }

    // الألوان الأساسية المتوفرة في المتجر
    const colorDefinitions = {
        "أسود": "#000000",
        "أبيض": "#ffffff",
        "أحمر": "#a01e1e",
        "أزرق": "#1e50a0",
        "أخضر": "#1e6a1e"
    };

    availableColors.forEach(colorName => {
        const colorBtn = document.createElement('button');
        colorBtn.className = 'color-option';
        colorBtn.style.backgroundColor = colorDefinitions[colorName];
        colorBtn.dataset.color = colorName;
        
        // إضافة border للأبيض ليكون مرئيًا
        if (colorName === "أبيض") {
            colorBtn.style.border = "1px solid #ddd";
        }
        
        colorOptionsContainer.appendChild(colorBtn);
    });

    // تحديد أول لون كافتراضي
    const firstColorBtn = colorOptionsContainer.querySelector('.color-option');
    if (firstColorBtn) {
        firstColorBtn.classList.add('active');
    }

    // إضافة أحداث النقر على الألوان
    colorOptionsContainer.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', function() {
            colorOptionsContainer.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function initImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-image');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function () {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));

            // Add active class to clicked thumbnail
            this.classList.add('active');

            // Change main image
            mainImage.src = this.src;
            mainImage.alt = this.alt;
        });
    });
}