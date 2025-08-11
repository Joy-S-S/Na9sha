document.addEventListener('DOMContentLoaded', function () {
    // Add to cart functionality
    const addToCartBtns = document.querySelectorAll('.add-to-cart');

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image');

            addToCart(productId, productName, productPrice, productImage);

            // Show confirmation message
            alert('تمت إضافة المنتج إلى العربة');
        });
    });

    // Add to cart from product details page
    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function () {
            const productName = document.getElementById('product-name').textContent;
            const productPrice = parseFloat(document.getElementById('product-price').textContent);
            const productImage = document.getElementById('main-image').src;
            const quantity = parseInt(document.querySelector('.quantity-input').value);
            const selectedSize = document.querySelector('.size-option.active')?.dataset.size;
            const selectedColor = document.querySelector('.color-option.active')?.dataset.color;

            

            // Generate a unique ID based on product name, size and color
            const productId = `${productName.replace(/\s+/g, '-').toLowerCase()}-${size}-${color}`;

            addToCart(productId, productName, productPrice, productImage, quantity, selectedSize, selectedColor);

            // Show confirmation message
            alert('تمت إضافة المنتج إلى العربة');
        });
    }

    // Load cart items on cart page
    if (document.querySelector('.cart-items')) {
        loadCartItems();
    }

    // Handle quantity changes in cart
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('quantity-btn')) {
            const input = e.target.parentElement.querySelector('input');
            let quantity = parseInt(input.value);

            if (e.target.classList.contains('minus')) {
                if (quantity > 1) {
                    input.value = quantity - 1;
                    updateCartItem(e.target.closest('.cart-item').getAttribute('data-id'), quantity - 1);
                }
            } else if (e.target.classList.contains('plus')) {
                input.value = quantity + 1;
                updateCartItem(e.target.closest('.cart-item').getAttribute('data-id'), quantity + 1);
            }
        }
    });

    // Handle item removal from cart
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-item')) {
            removeFromCart(e.target.closest('.cart-item').getAttribute('data-id'));
            e.target.closest('.cart-item').remove();
            updateCartSummary();

            // Show empty cart message if no items left
            if (document.querySelectorAll('.cart-item').length === 0) {
                document.querySelector('.empty-cart-message').style.display = 'block';
            }
        }
    });

    // Disable checkout button if cart is empty
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            checkoutBtn.style.opacity = '0.5';
            checkoutBtn.style.pointerEvents = 'none';
        }
    }
});

// Add item to cart
function addToCart(id, name, price, image, quantity = 1, size = '', color = '') {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // إنشاء معرف فريد للمنتج بناء على الخصائص
    const uniqueId = `${id}-${size}-${color}`;
    
    const existingItem = cart.find(item => item.uniqueId === uniqueId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            uniqueId,
            id,
            name,
            price,
            image,
            quantity,
            size,
            color
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // إظهار إشعار بإضافة المنتج
    showNotification('تمت إضافة المنتج إلى العربة');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Remove item from cart
function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update item quantity in cart
function updateCartItem(id, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === id);

    if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartSummary();
    }
}

// Load cart items on cart page
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.querySelector('.empty-cart-message');

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        return;
    }

    emptyCartMessage.style.display = 'none';

    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-id', item.id);

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                ${item.size ? `<p>الحجم: ${item.size}</p>` : ''}
                ${item.color ? `<p>اللون: ${item.color}</p>` : ''}
            </div>
            <div class="cart-item-actions">
                <p class="cart-item-price">${item.price * item.quantity} ج.م</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" value="${item.quantity}" min="1" readonly>
                    <button class="quantity-btn plus">+</button>
                </div>
                <span class="remove-item">إزالة</span>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    updateCartSummary();
}

// Update cart summary (subtotal, shipping, total)
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Default shipping cost (will be updated when city is selected in checkout)
    const shippingCost = 0;
    const total = subtotal + shippingCost;

    document.getElementById('subtotal').textContent = `${subtotal} ج.م`;
    document.getElementById('shipping').textContent = `${shippingCost} ج.م`;
    document.getElementById('total').textContent = `${total} ج.م`;

    // Also update on checkout page if exists
    if (document.getElementById('order-subtotal')) {
        document.getElementById('order-subtotal').textContent = `${subtotal} ج.م`;
        document.getElementById('order-shipping').textContent = `${shippingCost} ج.م`;
        document.getElementById('order-total').textContent = `${total} ج.م`;
    }
}
