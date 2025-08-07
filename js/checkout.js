document.addEventListener('DOMContentLoaded', function() {
    // Load order items on checkout page
    if (document.getElementById('order-items')) {
        loadOrderItems();
    }
    
    // Handle form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                fullName: document.getElementById('full-name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                notes: document.getElementById('notes').value,
                paymentMethod: document.querySelector('input[name="payment-method"]:checked').value,
                orderItems: JSON.parse(localStorage.getItem('cart')) || [],
                orderTotal: document.getElementById('order-total').textContent,
                orderNumber: generateOrderNumber()
            };
            
            // Send email using EmailJS
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData) // Replace with your EmailJS service ID and template ID
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Show success modal
                    document.getElementById('order-number').textContent = formData.orderNumber;
                    document.getElementById('order-confirmation').classList.add('active');
                    
                    // Clear cart
                    localStorage.removeItem('cart');
                    updateCartCount();
                }, function(error) {
                    console.log('FAILED...', error);
                    alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
                });
        });
    }
    
    // Load order items on order confirmation page
    if (document.getElementById('order-confirmation')) {
        loadOrderItems();
    }
});

// Load order items on checkout page
function loadOrderItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItemsContainer = document.getElementById('order-items');
    
    if (orderItemsContainer) {
        orderItemsContainer.innerHTML = '';
        
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
                    <p>${item.price * item.quantity} ر.س</p>
                    <p class="order-item-qty">${item.quantity} × ${item.price} ر.س</p>
                </div>
            `;
            
            orderItemsContainer.appendChild(orderItem);
        });
        
        updateCartSummary();
    }
}

// Generate random order number
function generateOrderNumber() {
    return 'ORD-' + Math.floor(Math.random() * 1000000);
}