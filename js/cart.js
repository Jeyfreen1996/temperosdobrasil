/**
 * Temperos do Brasil - Shared Cart & Flow Controller
 */

const CART_STORAGE_KEY = 'temperos_cart_v1';
const ORDER_STORAGE_KEY = 'temperos_order_v1';

// Initial default cart items if none exist
const DEFAULT_CART = [
  {
    id: 'moqueca-1',
    name: 'Moqueca Baiana',
    detail: 'Peixe fresco, leite de coco artesanal e azeite de dendê legítimo',
    price: 48.90,
    quantity: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHhdBFMyj61NEiIxLepFLbnS615uRmW4535mcRfuO1tzk6dEwATlxyhi6NrxrbMgC5WCu4LHxWdeZ-9t_c9rHq37Qj_Unyxj1i5irFCi99LCd21DrrImbLb4cdfCCDYpwl9YQPjih3WHeAq7UgzYtUhD0VhDjOzlEKRrFlyLf09MgFepnrNalDjJ_OvHHCPU-d4A8N5J2ij3nb2x8eW5qxszHJjIo695bvA0NVdPx6w6bt6mka0efA'
  }
];

// Helper to format currency in BRL
function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// Get Cart items
function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(DEFAULT_CART));
      return DEFAULT_CART;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading cart', e);
    return DEFAULT_CART;
  }
}

// Save Cart items
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadges();
  } catch (e) {
    console.error('Error saving cart', e);
  }
}

// Add Item to Cart
function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({
      ...item,
      quantity: item.quantity || 1
    });
  }
  saveCart(cart);
  showToast(`"${item.name}" adicionado ao pedido!`);
}

// Remove Item from Cart
function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
}

// Update Quantity
function updateQuantity(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity = (item.quantity || 1) + delta;
    if (item.quantity <= 0) {
      removeFromCart(id);
      return;
    }
    saveCart(cart);
  }
}

// Calculate Cart Totals
function getCartSummary() {
  const cart = getCart();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 0.00 : 0; // Free delivery promo
  const total = subtotal + deliveryFee;

  return {
    cart,
    itemCount,
    subtotal,
    deliveryFee,
    total
  };
}

// Clear Cart
function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  updateCartBadges();
}

// Update Header & Nav Badges
function updateCartBadges() {
  const { itemCount } = getCartSummary();
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    badge.textContent = itemCount;
    if (itemCount > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });
}

// Order Management
function saveOrder(orderData) {
  const order = {
    id: 'TB-' + Math.floor(100000 + Math.random() * 900000),
    timestamp: new Date().toISOString(),
    status: 'preparando', // 'recebido', 'preparando', 'saiu', 'entregue'
    items: orderData.items || getCart(),
    address: orderData.address || 'Av. Beira Mar Norte, 1500 - Tubarão, SC',
    name: orderData.name || 'Cliente Especial',
    paymentMethod: orderData.paymentMethod || 'PIX',
    total: orderData.total || getCartSummary().total,
    notes: orderData.notes || ''
  };
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
  return order;
}

function getOrder() {
  try {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error fetching order', e);
  }
  // Fallback demo order
  return {
    id: 'TB-849201',
    timestamp: new Date().toISOString(),
    status: 'preparando',
    name: 'Maria Silva',
    address: 'Av. Beira Mar Norte, 1500 - Tubarão, SC',
    paymentMethod: 'PIX',
    items: DEFAULT_CART,
    subtotal: 48.90,
    deliveryFee: 0.00,
    total: 48.90,
    notes: 'Sem coentro, por favor.'
  };
}

// Toast notification helper
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none px-4 w-full max-w-sm';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'bg-primary text-on-primary text-sm font-semibold px-4 py-3 rounded-xl shadow-lg border border-primary-fixed/30 flex items-center justify-between animate-fade-in pointer-events-auto';
  toast.innerHTML = `
    <span class="flex items-center gap-2">
      <span class="material-symbols-outlined text-[18px]">check_circle</span>
      ${message}
    </span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Font loading FOUT prevention listener
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadges();

  if (document.fonts) {
    document.body.classList.add('fonts-loading');
    document.fonts.ready.then(() => {
      document.body.classList.remove('fonts-loading');
    });
  }
});
