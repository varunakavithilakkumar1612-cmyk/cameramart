const products = [
  {
    id: 1,
    name: 'Nikon D3200',
    price: 599,
    image: 'img/nayris-aquino-Lidm0GHUL-0-unsplash.jpg',
    category: 'Cameras',
    description: 'A dependable DSLR for creators who want sharp photos, smooth handling, and excellent value.'
  },
  {
    id: 2,
    name: 'Pentax MZ-50',
    price: 299,
    image: 'img/mikedelta-zUnc4-eHw6E-unsplash.jpg',
    category: 'Cameras',
    description: 'Classic film-inspired design with modern performance for photography enthusiasts.'
  },
  {
    id: 3,
    name: 'Canon EOS R10',
    price: 699,
    image: 'img/rohit-jawalkar-bZvX1kozeRg-unsplash.jpg',
    category: 'Cameras',
    description: 'Compact mirrorless camera built for speed, image quality, and everyday creative shoots.'
  },
  {
    id: 4,
    name: 'Sigma 35mm Lens',
    price: 249,
    image: 'img/camera.webp',
    category: 'Lenses',
    description: 'A versatile prime lens with crisp detail, beautiful bokeh, and excellent low-light performance.'
  },
  {
    id: 5,
    name: 'Neewer Flash Kit',
    price: 129,
    image: 'img/flash_light_96.png',
    category: 'Lighting',
    description: 'Complete lighting setup for content creators, portraits, and studio-style shoots.'
  },
  {
    id: 6,
    name: 'Flexible Tripod Pro',
    price: 89,
    image: 'img/sling_bag_96.png',
    category: 'Tripods',
    description: 'A stable and portable tripod designed for travel, vlogging, and outdoor photography.'
  },
  {
    id: 7,
    name: 'DJI Mini Drone',
    price: 499,
    image: 'img/drone_96.png',
    category: 'Drones',
    description: 'Capture cinematic aerial footage with a lightweight, user-friendly drone platform.'
  },
  {
    id: 8,
    name: 'Camera Sling Bag',
    price: 79,
    image: 'img/sling_bag_96.png',
    category: 'Accessories',
    description: 'Protective storage bag that keeps your gear organized and close at hand.'
  },
  {
    id: 9,
    name: '4K Video Kit',
    price: 399,
    image: 'img/wesley-tingey-g1dqNiSZ_g0-unsplash.jpg',
    category: 'Video',
    description: 'A professional video package for creators demanding high-quality footage and consistent results.'
  },
  {
    id: 10,
    name: 'Brand Studio Pack',
    price: 899,
    image: 'img/Online_Shop_1.png',
    category: 'Brands',
    description: 'A premium bundle for brand shoots, social content, and campaign photography.'
  },
  {
    id: 11,
    name: 'Creator Special Bundle',
    price: 1099,
    image: 'img/Online_Shop_2.png',
    category: 'Special',
    description: 'An all-in-one creator package curated with camera, accessories, and photo essentials.'
  },
  {
    id: 12,
    name: 'Lens Cleaning Kit',
    price: 49,
    image: 'img/camera_Canon2.webp',
    category: 'Accessories',
    description: 'Keep your gear in peak condition with this practical maintenance bundle.'
  }
];

const STORAGE_KEYS = {
  cart: 'shoppingCart',
  wishlist: 'wishlist',
  checkoutSelection: 'checkoutSelection',
  lastOrder: 'lastOrder'
};

const state = {
  searchTerm: '',
  promoCode: '',
  promoError: '',
  showPromoInput: false,
  checkoutOpen: false
};

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  initializeLocalStorageDefaults();
  bindSearchInput();
  bindGlobalActions();
  renderAll();
  if (document.getElementById('checkout-page')) {
    renderCheckoutPage();
  }
  setupNavCategoryHighlight();
}

function initializeLocalStorageDefaults() {
  if (!localStorage.getItem(STORAGE_KEYS.cart)) {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.wishlist)) {
    localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify([]));
  }
}

function bindSearchInput() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (event) => {
    state.searchTerm = event.target.value.trim().toLowerCase();
    renderProductsPage();
  });
}

function bindGlobalActions() {
  document.addEventListener('click', (event) => {
    const addToCartButton = event.target.closest('[data-add-to-cart]');
    const buyNowButton = event.target.closest('[data-buy-now]');
    const viewDetailsButton = event.target.closest('[data-view-details]');
    const wishlistButton = event.target.closest('[data-wishlist]');
    const quantityButton = event.target.closest('[data-quantity-action]');
    const removeButton = event.target.closest('[data-remove-item]');
    const checkoutButton = event.target.closest('#checkout-button');
    const continueShoppingButton = event.target.closest('#continue-shopping');
    const continueShoppingEmptyButton = event.target.closest('#continue-shopping-empty');
    const promoToggle = event.target.closest('#promo-toggle');
    const applyPromoButton = event.target.closest('#apply-promo, #apply-checkout-promo');
    const paypalButton = event.target.closest('#paypal');
    const klarnaButton = event.target.closest('#klarna');
    const closeModalButton = event.target.closest('[data-close-modal]');
    const placeOrderButton = event.target.closest('#place-order');
    const cancelCheckoutButton = event.target.closest('#cancel-checkout');
    const continueShoppingConfirmedButton = event.target.closest('#continue-shopping-confirmed');
    const viewOrderDetailsButton = event.target.closest('#view-order-details');

    if (addToCartButton) {
      addToCart(Number(addToCartButton.dataset.addToCart));
    }

    if (buyNowButton) {
      buyNow(Number(buyNowButton.dataset.buyNow));
    }

    if (viewDetailsButton) {
      openProductDetails(Number(viewDetailsButton.dataset.viewDetails));
    }

    if (wishlistButton) {
      toggleWishlist(Number(wishlistButton.dataset.wishlist));
    }

    if (quantityButton) {
      const action = quantityButton.dataset.quantityAction;
      const productId = Number(quantityButton.dataset.productId);

      if (document.getElementById('checkout-page')) {
        if (action === 'increase') increaseCheckoutQuantity(productId);
        if (action === 'decrease') decreaseCheckoutQuantity(productId);
        return;
      }

      if (action === 'increase') increaseQuantity(productId);
      if (action === 'decrease') decreaseQuantity(productId);
    }

    if (removeButton) {
      removeFromCart(Number(removeButton.dataset.removeItem));
    }

    if (checkoutButton) {
      handleCheckoutClick();
    }

    if (continueShoppingButton || continueShoppingEmptyButton || continueShoppingConfirmedButton) {
      window.location.href = 'products.html';
    }

    if (promoToggle) {
      state.showPromoInput = !state.showPromoInput;
      renderCartPage();
    }

    if (applyPromoButton) {
      const promoInput = document.getElementById('promo-input') || document.getElementById('checkout-promo-input');
      applyPromoCode(promoInput ? promoInput.value : '');
    }

    if (paypalButton) {
      showToast('Demo payment option selected.', 'info');
    }

    if (klarnaButton) {
      showToast('Demo payment option selected.', 'info');
    }

    if (closeModalButton) {
      closeModal(closeModalButton.closest('.modal'));
    }

    if (placeOrderButton) {
      placeOrder();
    }

    if (cancelCheckoutButton) {
      closeModal(document.querySelector('.checkout-modal'));
    }

    if (viewOrderDetailsButton) {
      toggleOrderDetails();
    }
  });
}

function setupNavCategoryHighlight() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');

  if (!category) return;

  document.querySelectorAll('.nav-web a, .nav-mobile a').forEach((link) => {
    const linkText = link.textContent.trim();
    if (linkText === category) {
      link.classList.add('active');
    }
  });
}

function renderAll() {
  renderProductsPage();
  renderTrendingProducts();
  renderCartPage();
  updateCartCount();
}

function renderProductsPage() {
  const container = document.getElementById('products');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const selectedCategory = params.get('category');

  let filteredProducts = products.filter((product) => {
    const categoryMatches = !selectedCategory || product.category === selectedCategory;
    const searchMatches =
      !state.searchTerm ||
      product.name.toLowerCase().includes(state.searchTerm) ||
      product.category.toLowerCase().includes(state.searchTerm) ||
      product.description.toLowerCase().includes(state.searchTerm);

    return categoryMatches && searchMatches;
  });

  if (!filteredProducts.length) {
    container.innerHTML = `
      <div class="no-products-found">
        <h3>No products found</h3>
        <p>Try a different search term or browse another category.</p>
      </div>
    `;
    return;
  }

  const markup = filteredProducts.map((product) => getProductCardMarkup(product)).join('');
  container.innerHTML = markup;
}

function renderTrendingProducts() {
  const container = document.getElementById('prod-index');
  if (!container) return;

  const markup = products.slice(0, 3).map((product) => getProductCardMarkup(product)).join('');
  container.innerHTML = markup;
}

function renderCartPage() {
  const container = document.getElementById('prod-cart');
  if (!container) return;

  const cart = getCart();

  if (!cart.length) {
    container.innerHTML = `
      <div class="empty-cart">
        <h3>YOUR CART IS EMPTY</h3>
        <p>Looks like you haven't added anything yet.</p>
        <button id="continue-shopping-empty" class="empty-cart-btn">CONTINUE SHOPPING</button>
      </div>
    `;
    updateOrderSummary(0, 0, 0, 0);
    updateCartCount();
    return;
  }

  const cartMarkup = cart
    .map((item) => {
      const product = getProductById(item.id);
      if (!product) return '';

      const isWishlisted = getWishlist().includes(product.id);
      const lineTotal = product.price * item.quantity;

      return `
        <div class="cart-prod" data-product-id="${product.id}">
          <img src="${product.image}" alt="${product.name}" />
          <div class="desc-prod">
            <h4>${product.name}</h4>
            <p class="price">$${formatCurrency(product.price)}</p>
            <div class="amount-div">
              <button type="button" class="qty-btn" data-product-id="${product.id}" data-quantity-action="decrease" aria-label="Decrease quantity">
                <i class="fa-regular fa-square-minus"></i>
              </button>
              <p class="quantity">${item.quantity}</p>
              <button type="button" class="qty-btn" data-product-id="${product.id}" data-quantity-action="increase" aria-label="Increase quantity">
                <i class="fa-regular fa-square-plus"></i>
              </button>
            </div>
            <p class="line-total">Item total: $${formatCurrency(lineTotal)}</p>
          </div>
          <div class="cart-icons">
            <button type="button" class="remove-btn" data-remove-item="${product.id}" aria-label="Remove product">
              <i class="fa-regular fa-rectangle-xmark"></i>
            </button>
            <button type="button" class="wishlist-button ${isWishlisted ? 'active' : ''}" data-wishlist="${product.id}" aria-label="Add to wishlist">
              <i class="fa-solid fa-heart"></i>
            </button>
          </div>
        </div>
      `;
    })
    .join('');

  container.innerHTML = cartMarkup;

  const subtotal = cart.reduce((sum, item) => {
    const product = getProductById(item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const delivery = subtotal >= 500 ? 0 : 29;
  const discount = calculateDiscount(subtotal);
  const total = Math.max(subtotal + delivery - discount, 0);

  updateOrderSummary(subtotal, delivery, discount, total);
  updateCartCount();
}

function renderCheckoutPage() {
  const container = document.getElementById('checkout-page');
  if (!container) return;

  const checkoutItems = getCheckoutItems();

  if (!checkoutItems.length) {
    container.innerHTML = `
      <section class="checkout-page">
        <div class="checkout-empty-state">
          <h1>CHECKOUT</h1>
          <p>Your cart is empty.</p>
          <button id="continue-shopping-empty" class="checkout-primary-btn">CONTINUE SHOPPING</button>
        </div>
      </section>
    `;
    return;
  }

  const checkoutSummary = buildCheckoutSummary(checkoutItems);

  const productsMarkup = checkoutItems
    .map((item) => {
      const product = getProductById(item.id);
      if (!product) return '';

      const lineTotal = product.price * item.quantity;

      return `
        <div class="checkout-product-item">
          <img src="${product.image}" alt="${product.name}" />
          <div class="checkout-product-details">
            <div class="checkout-product-header">
              <h4>${product.name}</h4>
              <span class="checkout-price">$${formatCurrency(product.price)}</span>
            </div>
            <div class="checkout-product-toolbar">
              <div class="checkout-product-qty">
                <button type="button" class="qty-btn" data-product-id="${product.id}" data-quantity-action="decrease" aria-label="Decrease quantity">-</button>
                <span class="quantity">${item.quantity}</span>
                <button type="button" class="qty-btn" data-product-id="${product.id}" data-quantity-action="increase" aria-label="Increase quantity">+</button>
              </div>
              <span class="line-total">Subtotal: $${formatCurrency(lineTotal)}</span>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  container.innerHTML = `
    <section class="checkout-page">
      <div class="checkout-shell">
        <div class="checkout-form-section">
          <h1 class="title checkout-title">CHECKOUT</h1>
          <form id="checkout-form" novalidate>
            <div class="checkout-grid">
              <label>
                Full Name
                <input type="text" name="fullName" required />
              </label>
              <label>
                Email
                <input type="email" name="email" required />
              </label>
              <label>
                Phone Number
                <input type="tel" name="phone" required />
              </label>
              <label>
                Address
                <input type="text" name="address" required />
              </label>
              <label>
                City
                <input type="text" name="city" required />
              </label>
              <label>
                State
                <input type="text" name="state" required />
              </label>
              <label class="checkout-field-full">
                Pincode
                <input type="text" name="pincode" required />
              </label>
            </div>
            <div class="checkout-actions">
              <button type="button" id="place-order" class="checkout-primary-btn">PLACE ORDER</button>
            </div>
          </form>
        </div>

        <aside class="checkout-summary-pane">
          <h2>ORDER SUMMARY</h2>
          <div class="checkout-products-list">
            ${productsMarkup}
          </div>

          <div class="checkout-summary-rows">
            <div class="checkout-summary-row">
              <span>Subtotal</span>
              <span>$${formatCurrency(checkoutSummary.subtotal)}</span>
            </div>
            <div class="checkout-summary-row">
              <span>Delivery</span>
              <span>${checkoutSummary.delivery === 0 ? 'FREE' : `$${formatCurrency(checkoutSummary.delivery)}`}</span>
            </div>
            <div class="checkout-summary-row">
              <span>Discount</span>
              <span>-$${formatCurrency(checkoutSummary.discount)}</span>
            </div>
            <div class="checkout-summary-row checkout-total-row">
              <span>Total</span>
              <span>$${formatCurrency(checkoutSummary.total)}</span>
            </div>
          </div>

          <div class="checkout-promo">
            <input id="checkout-promo-input" type="text" placeholder="Enter promo code" value="${escapeHtml(state.promoCode)}" />
            <button id="apply-checkout-promo" type="button">Apply</button>
            ${state.promoError ? `<p class="promo-error">${state.promoError}</p>` : ''}
          </div>

          <div class="checkout-payment-buttons">
            <button type="button" id="paypal" class="secondary-btn">PayPal</button>
            <button type="button" id="klarna" class="secondary-btn">Klarna</button>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function getCheckoutItems() {
  const checkoutSelection = getCheckoutSelection();

  if (checkoutSelection && checkoutSelection.id) {
    return [{ id: Number(checkoutSelection.id), quantity: Number(checkoutSelection.quantity) || 1 }];
  }

  return getCart();
}

function buildCheckoutSummary(items) {
  const subtotal = items.reduce((sum, item) => {
    const product = getProductById(item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const delivery = subtotal >= 500 ? 0 : 29;
  const discount = calculateDiscount(subtotal);
  const total = Math.max(subtotal + delivery - discount, 0);

  return { subtotal, delivery, discount, total };
}

function increaseCheckoutQuantity(productId) {
  const checkoutSelection = getCheckoutSelection();

  if (checkoutSelection && checkoutSelection.id === productId) {
    checkoutSelection.quantity = (Number(checkoutSelection.quantity) || 1) + 1;
    saveCheckoutSelection(checkoutSelection);
    renderCheckoutPage();
    return;
  }

  const cart = getCart();
  const item = cart.find((entry) => entry.id === productId);

  if (!item) return;

  item.quantity += 1;
  saveCart(cart);
  renderCheckoutPage();
}

function decreaseCheckoutQuantity(productId) {
  const checkoutSelection = getCheckoutSelection();

  if (checkoutSelection && checkoutSelection.id === productId) {
    const nextQuantity = (Number(checkoutSelection.quantity) || 1) - 1;

    if (nextQuantity <= 0) {
      removeCheckoutSelection();
    } else {
      checkoutSelection.quantity = nextQuantity;
      saveCheckoutSelection(checkoutSelection);
    }

    renderCheckoutPage();
    return;
  }

  const cart = getCart();
  const item = cart.find((entry) => entry.id === productId);

  if (!item) return;

  if (item.quantity > 1) {
    item.quantity -= 1;
    saveCart(cart);
  } else {
    saveCart(cart.filter((entry) => entry.id !== productId));
  }

  renderCheckoutPage();
}

function buyNow(productId) {
  const product = getProductById(productId);
  if (!product) return;

  saveCheckoutSelection({ id: productId, quantity: 1 });
  window.location.href = 'checkout.html';
}

function getCheckoutSelection() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.checkoutSelection) || 'null');
  } catch (error) {
    return null;
  }
}

function saveCheckoutSelection(selection) {
  localStorage.setItem(STORAGE_KEYS.checkoutSelection, JSON.stringify(selection));
}

function removeCheckoutSelection() {
  localStorage.removeItem(STORAGE_KEYS.checkoutSelection);
}

function placeOrder() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
  const formData = new FormData(form);

  const customer = {
    fullName: String(formData.get('fullName') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    address: String(formData.get('address') || '').trim(),
    city: String(formData.get('city') || '').trim(),
    state: String(formData.get('state') || '').trim(),
    pincode: String(formData.get('pincode') || '').trim()
  };

  const missingField = requiredFields.some((field) => !customer[field]);

  if (missingField) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  const checkoutItems = getCheckoutItems();

  if (!checkoutItems.length) {
    showToast('Your cart is empty.', 'error');
    return;
  }

  const checkoutSummary = buildCheckoutSummary(checkoutItems);

  const order = {
    orderId: generateOrderId(),
    customerName: customer.fullName,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    state: customer.state,
    pincode: customer.pincode,
    products: checkoutItems.map((item) => {
      const product = getProductById(item.id);
      return {
        id: item.id,
        name: product ? product.name : 'Unknown Product',
        image: product ? product.image : '',
        quantity: item.quantity,
        price: product ? product.price : 0
      };
    }),
    subtotal: checkoutSummary.subtotal,
    delivery: checkoutSummary.delivery,
    discount: checkoutSummary.discount,
    total: checkoutSummary.total,
    orderDate: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEYS.lastOrder, JSON.stringify(order));
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify([]));
  removeCheckoutSelection();

  state.promoCode = '';
  state.promoError = '';
  state.showPromoInput = false;

  const checkoutPage = document.getElementById('checkout-page');
  if (checkoutPage) {
    checkoutPage.innerHTML = renderOrderSuccessMarkup(order);
  }

  updateCartCount();
  showToast('Order placed successfully!', 'success');
}

function renderOrderSuccessMarkup(order) {
  const detailRows = order.products
    .map((item) => `
      <div class="order-detail-row">
        <span>${item.name} × ${item.quantity}</span>
        <span>$${formatCurrency(item.price * item.quantity)}</span>
      </div>
    `)
    .join('');

  return `
    <section class="checkout-page">
      <div class="checkout-success">
        <p class="success-tag">ORDER CONFIRMED</p>
        <h1>✓ ORDER PLACED SUCCESSFULLY!</h1>
        <p class="success-subtitle">Your order has been placed successfully.</p>

        <div class="success-summary">
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Order Total:</strong> $${formatCurrency(order.total)}</p>
          <p><strong>Estimated Delivery:</strong> 3–5 Business Days</p>
        </div>

        <div class="success-buttons">
          <button id="continue-shopping-confirmed" class="checkout-primary-btn">CONTINUE SHOPPING</button>
          <button id="view-order-details" class="secondary-btn">VIEW ORDER DETAILS</button>
        </div>

        <div id="order-details-panel" class="order-details-panel" hidden>
          <h3>Order Details</h3>
          ${detailRows}
          <div class="order-detail-row total-line">
            <span>Total</span>
            <span>$${formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

function toggleOrderDetails() {
  const detailsPanel = document.getElementById('order-details-panel');
  const viewButton = document.getElementById('view-order-details');

  if (!detailsPanel || !viewButton) return;

  detailsPanel.hidden = !detailsPanel.hidden;
  viewButton.textContent = detailsPanel.hidden ? 'VIEW ORDER DETAILS' : 'HIDE ORDER DETAILS';
}

function generateOrderId() {
  return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
}

function handleCheckoutClick() {
  localStorage.removeItem(STORAGE_KEYS.checkoutSelection);
  window.location.href = 'checkout.html';
}

function closeModal(modal) {
  if (modal) {
    modal.remove();
  }
}

function applyPromoCode(code) {
  const normalized = (code || '').trim().toUpperCase();

  if (normalized === 'SAVE10' || normalized === 'CAMERA20') {
    state.promoCode = normalized;
    state.promoError = '';
    state.showPromoInput = true;

    if (document.getElementById('checkout-page')) {
      renderCheckoutPage();
    } else {
      renderCartPage();
    }

    showToast('Promo code applied successfully!', 'success');
    return;
  }

  state.promoCode = '';
  state.promoError = 'Invalid promo code';
  state.showPromoInput = true;

  if (document.getElementById('checkout-page')) {
    renderCheckoutPage();
  } else {
    renderCartPage();
  }
}

function updateOrderSummary(subtotal, delivery, discount, total) {
  const subtotalRow = document.querySelector('.order-summary-row[data-label="subtotal"] p:last-child');
  const deliveryRow = document.querySelector('.order-summary-row[data-label="delivery"] p:last-child');
  const discountRow = document.querySelector('.order-summary-row[data-label="discount"] p:last-child');
  const totalRow = document.querySelector('.order-summary-row[data-label="total"] p:last-child');

  if (subtotalRow) subtotalRow.textContent = `$${formatCurrency(subtotal)}`;
  if (deliveryRow) deliveryRow.textContent = delivery === 0 ? 'FREE' : `$${formatCurrency(delivery)}`;
  if (discountRow) discountRow.textContent = `-$${formatCurrency(discount)}`;
  if (totalRow) totalRow.textContent = `$${formatCurrency(total)}`;

  const promoContainer = document.getElementById('promo-container');
  if (promoContainer) {
    promoContainer.remove();
  }

  if (state.showPromoInput) {
    const summaryColumn = document.querySelector('.order-summary-column');
    if (summaryColumn) {
      summaryColumn.insertAdjacentHTML(
        'beforeend',
        `
          <div id="promo-container" class="promo-container">
            <input id="promo-input" type="text" placeholder="Enter promo code" value="${escapeHtml(state.promoCode)}" />
            <button id="apply-promo" type="button">Apply</button>
            ${state.promoError ? `<p class="promo-error">${state.promoError}</p>` : ''}
          </div>
        `
      );
    }
  }
}

function getProductCardMarkup(product) {
  const wishlist = getWishlist();
  const isWishlisted = wishlist.includes(product.id);

  return `
    <div class="img-products" data-product-id="${product.id}">
      <img src="${product.image}" alt="${product.name}" />
      <h4>${product.name}</h4>
      <p class="price">$${formatCurrency(product.price)}</p>
      <div class="overlay">
        <p class="description">${product.description}</p>
        <button type="button" class="rm-btn" data-view-details="${product.id}">View Details</button>
        <button type="button" class="atc-btn" data-add-to-cart="${product.id}">Add to Cart</button>
        <button type="button" class="buy-now-btn" data-buy-now="${product.id}">BUY NOW</button>
      </div>
      <button
        type="button"
        class="wishlist-button ${isWishlisted ? 'active' : ''}"
        data-wishlist="${product.id}"
        aria-label="Add to wishlist"
      >
        <i class="fa-solid fa-heart"></i>
      </button>
    </div>
  `;
}

function addToCart(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const cart = getCart();
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart(cart);
  renderCartPage();
  updateCartCount();
  showToast('Product added to cart!', 'success');
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  renderCartPage();
  updateCartCount();
}

function increaseQuantity(productId) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.quantity += 1;
  saveCart(cart);
  renderCartPage();
  updateCartCount();
}

function decreaseQuantity(productId) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;

  if (item.quantity > 1) {
    item.quantity -= 1;
  }

  saveCart(cart);
  renderCartPage();
  updateCartCount();
}

function toggleWishlist(productId) {
  const wishlist = getWishlist();

  if (wishlist.includes(productId)) {
    const updatedWishlist = wishlist.filter((id) => id !== productId);
    localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(updatedWishlist));
  } else {
    wishlist.push(productId);
    localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
  }

  renderAll();
}

function openProductDetails(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const existingModal = document.querySelector('.product-modal');
  if (existingModal) existingModal.remove();

  const modal = document.createElement('div');
  modal.className = 'modal product-modal';
  modal.innerHTML = `
    <div class="modal-content product-details-modal">
      <button type="button" class="close-modal" data-close-modal="true" aria-label="Close">&times;</button>
      <div class="product-details-layout">
        <img src="${product.image}" alt="${product.name}" />
        <div class="product-info">
          <p class="product-category">${product.category}</p>
          <h3>${product.name}</h3>
          <p class="product-price">$${formatCurrency(product.price)}</p>
          <p class="product-description">${product.description}</p>
          <div class="product-detail-actions">
            <button type="button" class="atc-btn" data-add-to-cart="${product.id}">Add to Cart</button>
            <button type="button" class="buy-now-btn" data-buy-now="${product.id}">BUY NOW</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function calculateDiscount(subtotal) {
  if (!state.promoCode) return 0;

  if (state.promoCode === 'SAVE10') return subtotal * 0.1;
  if (state.promoCode === 'CAMERA20') return subtotal * 0.2;

  return 0;
}

function formatCurrency(value) {
  return Number(value).toFixed(2);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || '[]');
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
}

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.wishlist) || '[]');
  } catch (error) {
    return [];
  }
}

function getProductById(productId) {
  return products.find((product) => product.id === productId);
}

function showToast(message, type = 'success') {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    document.body.appendChild(toast);
  }

  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.classList.add('visible');

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove('visible');
  }, 2200);
}

function updateCartCount() {
  const cartItems = getCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  document.querySelectorAll('.cart-count-badge').forEach((badge) => badge.remove());

  if (totalItems === 0) {
    return;
  }

  document.querySelectorAll('a[href="shopping-cart.html"]').forEach((link) => {
    const badge = document.createElement('span');
    badge.className = 'cart-count-badge';
    badge.textContent = totalItems;
    link.appendChild(badge);
  });
}
