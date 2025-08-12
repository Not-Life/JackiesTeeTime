/* Shared JavaScript functions for the MedAssist Tees site */

// Sample product catalog. In a real application this could be fetched from a server
// or external JSON file. Feel free to edit or extend this array without touching
// any code — the site will render your changes automatically.
const PRODUCTS = [
  {
    id: 'Cush-Tshirt',
    title: 'Cushism Tee',
    price: 24.99,
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
    description: 'Show off Dr. John Cush’s wit with this comfy tee featuring his funniest, quotable Cushisms',
    colors: ['Black', 'Grey', 'Navy Blue', 'Crimson Red'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    id: 'Support-MA-Tshirt',
    title: 'Support Your Local MA Tee',
    price: 22.99,
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
    description: 'Show pride in medical assistants with this bold, heart-filled tee supporting healthcare’s unsung heroes',
    colors: ['White', 'Black', 'Royal Blue', 'Heather Grey'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'Charity-Tshirt',
    title: 'Charity Tee',
    price: 25.00,
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
    description: 'Spread awareness and compassion with this charity tee—proceeds support healthcare access for those in need',
    colors: ['Black', 'Navy Blue', 'Heather Grey', 'White'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    id: 'Company-Brand-Tshirt',
    title: 'Official Company Tee',
    price: 23.50,
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
    description: 'Rep our brand in style with this comfortable, everyday tee featuring our bold company logo',
    colors: ['Black', 'Charcoal', 'Navy Blue', 'White'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
];


/* Cart helpers */

function loadCart() {
  try {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Failed to parse cart from localStorage', err);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (err) {
    console.error('Failed to save cart to localStorage', err);
  }
}

// Compose a unique key for a cart item based on product id, color and size
function cartKey(id, color, size) {
  return `${id}-${color || 'default'}-${size || 'default'}`;
}

function addToCart(id, color, size) {
  const cart = loadCart();
  const key = cartKey(id, color, size);
  const existing = cart.find((item) => item.key === key);
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      key,
      id,
      title: product.title,
      img: product.img,
      price: product.price,
      color,
      size,
      qty: 1,
    });
  }
  saveCart(cart);
  renderCart();
  openCart();
}

function removeFromCart(key) {
  let cart = loadCart();
  cart = cart.filter((item) => item.key !== key);
  saveCart(cart);
  renderCart();
}

function changeCartQty(key, delta) {
  const cart = loadCart();
  const item = cart.find((i) => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    const idx = cart.indexOf(item);
    cart.splice(idx, 1);
  }
  saveCart(cart);
  renderCart();
}

function cartItemCount() {
  const cart = loadCart();
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartTotal() {
  const cart = loadCart();
  return cart.reduce((sum, item) => sum + item.qty * item.price, 0);
}

function openCart() {
  const drawer = document.querySelector('.cart-drawer');
  if (drawer) drawer.classList.add('open');
}

function closeCart() {
  const drawer = document.querySelector('.cart-drawer');
  if (drawer) drawer.classList.remove('open');
}

function renderCart() {
  const drawer = document.querySelector('.cart-drawer');
  if (!drawer) return;
  const cart = loadCart();
  // Update badge in nav if exists
  const badge = document.querySelector('#cart-count');
  if (badge) badge.textContent = cartItemCount();
  // Build items list
  const itemsContainer = drawer.querySelector('.cart-items');
  itemsContainer.innerHTML = '';
  if (cart.length === 0) {
    itemsContainer.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cart.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${item.img}" alt="${item.title}">
        <div class="cart-item-info">
          <span class="title">${item.title}</span>
          <span class="details">${item.color || ''}${item.size ? ' • ' + item.size : ''}</span>
          <div class="cart-item-controls">
            <button aria-label="Decrease quantity">−</button>
            <span>${item.qty}</span>
            <button aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div>
          <button class="remove-btn" aria-label="Remove item">×</button>
          <div style="font-size:0.875rem; font-weight:600; margin-top:0.25rem;">$${(item.price * item.qty).toFixed(2)}</div>
        </div>
      `;
      // Attach event listeners
      const [minusBtn, plusBtn] = div.querySelectorAll('.cart-item-controls button');
      minusBtn.addEventListener('click', () => changeCartQty(item.key, -1));
      plusBtn.addEventListener('click', () => changeCartQty(item.key, 1));
      const removeBtn = div.querySelector('.remove-btn');
      removeBtn.addEventListener('click', () => removeFromCart(item.key));
      itemsContainer.appendChild(div);
    });
  }
  // Update subtotal
  const subtotalEl = drawer.querySelector('.cart-subtotal');
  if (subtotalEl) {
    subtotalEl.textContent = `$${cartTotal().toFixed(2)}`;
  }
}

/* Product rendering for index page */
function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = '';
  PRODUCTS.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    // Create inner HTML
    card.innerHTML = `
      <img src="${product.img}" alt="${product.title}">
      <div class="product-card-body">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <div class="product-meta">$${product.price.toFixed(2)}</div>
        <div class="variant-select">
          <label for="color-${product.id}">Color:</label>
          <select id="color-${product.id}">
            ${product.colors
              .map((c) => `<option value="${c}">${c}</option>`)
              .join('')}
          </select>
        </div>
        <div class="variant-select">
          <label for="size-${product.id}">Size:</label>
          <select id="size-${product.id}">
            ${product.sizes
              .map((s) => `<option value="${s}">${s}</option>`)
              .join('')}
          </select>
        </div>
        <button class="btn add-btn">Add to cart</button>
      </div>
    `;
    // Event handler for Add to cart
    const addBtn = card.querySelector('.add-btn');
    addBtn.addEventListener('click', () => {
      const colorSelect = card.querySelector(`#color-${product.id}`);
      const sizeSelect = card.querySelector(`#size-${product.id}`);
      const color = colorSelect ? colorSelect.value : '';
      const size = sizeSelect ? sizeSelect.value : '';
      addToCart(product.id, color, size);
    });
    grid.appendChild(card);
  });
}

// Setup cart drawer actions on all pages
function initCartDrawer() {
  const openBtn = document.getElementById('openCartBtn');
  const closeBtn = document.getElementById('closeCartBtn');
  if (openBtn) openBtn.addEventListener('click', openCart);
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
}

document.addEventListener('DOMContentLoaded', () => {
  // Attempt to update cart count across pages
  const badge = document.querySelector('#cart-count');
  if (badge) badge.textContent = cartItemCount();
  // Initialize cart drawer buttons
  initCartDrawer();
  // Render cart contents (for pages that have a cart drawer)
  renderCart();
});