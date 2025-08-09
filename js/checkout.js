const cities = {
    "القاهرة": 45,
    "الجيزة": 50,
    "الإسكندرية": 50,
    "الدقهلية": 50,
    "العريش": 130,
    "البحر الأحمر": 130,
    "البحيرة": 50,
    "الفيوم": 50,
    "الغربية": 50,
    "الإسماعيلية": 55,
    "المنوفية": 50,
    "المنيا": 60,
    "القليوبية": 50,
    "الوادي الجديد": 130,
    "شمال سيناء": 130,
    "جنوب سيناء": 130,
    "بورسعيد": 55,
    "قنا": 60,
    "السويس": 55,
    "اسوان": 65,
    "اسيوط": 60,
    "بني سويف": 60,
    "دمياط": 50,
    "دمنهور": 50,
    "الشرقية": 50,
    "سوهاج": 60,
    "كفر الشيخ": 50,
    "شرم الشيخ": 130,
    "الغردقة": 130,
    "الأقصر": 65,
    "مرسى مطروح": 130
};
document.addEventListener('DOMContentLoaded', function () {
    // Load order items on checkout page
    if (document.getElementById('order-items')) {
        loadOrderItems();
    }

    // Populate city dropdown
    const citySelect = document.getElementById('city');
    if (citySelect) {
        citySelect.innerHTML = '<option value="">اختر المدينة</option>';
        for (const [city, cost] of Object.entries(cities)) {
            citySelect.innerHTML += `<option value="${city}">${city} (${cost} ج.م)</option>`;
        }

        // عند تغيير المحافظة يحدث الشحن والمجموع
        citySelect.addEventListener('change', function () {
            updateCartSummary();
        });
    }

    // Update shipping cost when city changes
    if (citySelect) {
        citySelect.addEventListener('change', function () {
            const selectedCity = this.value;
            const shippingCost = cities[selectedCity] || 0;
            document.getElementById('shipping').textContent = `${shippingCost} ج.م`;
            document.getElementById('order-shipping').textContent = `${shippingCost} ج.م`;
            updateCartSummary();
        });
    }

    // Handle form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function (e) {
            const fullName = document.getElementById('full-name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;

            if (!fullName || !phone || !email || !address || !city) {
                e.preventDefault();
                alert('يرجى ملء جميع الحقول المطلوبة');
                return;
            }

            const orderNumber = generateOrderNumber(); // استدعاء واحد فقط
            document.getElementById('order-number').textContent = orderNumber;

            const formData = {
                fullName,
                phone,
                email,
                address,
                city,
                notes: document.getElementById('notes').value,
                paymentMethod: document.querySelector('input[name="payment-method"]:checked').value,
                orderItems: JSON.parse(localStorage.getItem('cart')) || [],
                orderTotal: document.getElementById('order-total').textContent,
                orderNumber,
                shippingCost: cities[city] || 0
            };

            console.log('Order Data:', formData);

            localStorage.removeItem('cart');
            updateCartSummary();
            // مفيش preventDefault هنا، فالفورم هيكمل ويتبعت
        });
    }

    // Close modal
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', function () {
            document.getElementById('order-confirmation').classList.remove('active');
        });
    }
});

// Load order items on checkout page
function loadOrderItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItemsContainer = document.getElementById('order-items');

    if (orderItemsContainer) {
        orderItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            orderItemsContainer.innerHTML = '<p>لا توجد عناصر في السلة</p>';
            return;
        }

        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';

            orderItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="order-item-img">
                <div class="order-item-details">
                    <h4 class="order-item-name">${item.name}</h4>
                    ${item.size ? `<p class="order-item-qty">الحجم: ${item.size}</p>` : ''}
                    ${item.color ? `<p class="order-item-qty">اللون: ${item.color}</p>` : ''}
                </div>
                <div class="order-item-price">
                    <p>${item.price * item.quantity} ج.م</p>
                    <p class="order-item-qty">${item.quantity} × ${item.price} ج.م</p>
                </div>
            `;

            orderItemsContainer.appendChild(orderItem);
        });

        updateCartSummary();
    }
}

// Update cart summary with shipping
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Get selected city shipping cost
    const citySelect = document.getElementById('city');
    const selectedCity = citySelect ? citySelect.value : '';
    const shippingCost = selectedCity ? cities[selectedCity] || 0 : 0;

    const total = subtotal + shippingCost;

    // Update cart page summary
    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').textContent = `${subtotal} ج.م`;
        document.getElementById('shipping').textContent = `${shippingCost} ج.م`;
        document.getElementById('total').textContent = `${total} ج.م`;
    }

    // Update checkout page summary
    if (document.getElementById('order-subtotal')) {
        document.getElementById('order-subtotal').textContent = `${subtotal} ج.م`;
        document.getElementById('order-shipping').textContent = `${shippingCost} ج.م`;
        document.getElementById('order-total').textContent = `${total} ج.م`;
    }
}

// Generate random order number
function generateOrderNumber() {
    return 'ORD-' + Math.floor(Math.random() * 1000000);
}