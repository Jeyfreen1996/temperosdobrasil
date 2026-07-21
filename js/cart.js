/**
 * Temperos do Brasil - Shared Cart, Weekly Menu & Flow Controller
 */

const CART_STORAGE_KEY = 'temperos_cart_v1';
const ORDER_STORAGE_KEY = 'temperos_order_v1';
const SELECTED_DAY_KEY = 'temperos_selected_day_v1';

// Weekly Menu Data (Segunda a Sexta)
const WEEKLY_MENU = {
  1: {
    dayName: 'Segunda-feira',
    shortDay: 'SEG',
    specialName: 'Segunda da Feijoada Light & Virado',
    dishes: [
      { id: 'seg-1', name: 'Feijoada Light', price: 34.90, desc: 'Feijão preto com carnes magras, couve refogada e farofa caseira.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQU1RjBmF5UfWAhVRTJqtt-FUElVR3_JUYuylRjb1EVgFl97bbiOmfIwwTAoWuRRlGizmpqyOIb1aMga1PcQouApHX3s77xy_hkzcXZVWBrjbz2KCNUSPvFT53w7UiLH-luhNRWYoO9AvD978GD4eRao1AdqgZvEXbpz6iK81-5yqsW8TuA8O7tn0Xa_CRjjINeJWTlxJXuPxIJiw4HUaT51A5ZLjv_Ext1JwPp_9c_WZlFT75KkN2' },
      { id: 'seg-2', name: 'Virado à Paulista', price: 32.00, desc: 'Tutu de feijão, bisteca suína grelhada, ovo frito e couve refogada.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJGN1AVoTnCt_bHtcgU1lA3GN-ppywn1o1avK4mlJDL9yk0UnBpbRW6nf9JtJUEQnDUXQlurRqTDpzTXLi0u0j_NUzA-H_jKUbr1ASILn9_Ii07bpUna73xMMRYKEo5IUiT_3INgoDv4sgQIIWvOheN1-sx7PZDOG5E_VkePnW0UDVT8_iGovh4E9KVphfdNUeNPwxONcRffQpiZlfhtxPZ3yJty7pK7ih1jbmqxxCyyIIox6fUcvc' }
    ]
  },
  2: {
    dayName: 'Terça-feira',
    shortDay: 'TER',
    specialName: 'Terça do Bife à Parmegiana & Strogonoff',
    dishes: [
      { id: 'ter-1', name: 'Bife à Parmegiana', price: 38.90, desc: 'Filet empanado coberto com queijo derretido e molho de tomate caseiro.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNElcq-0UBqJGWP1aEvfvNSVp-O7PVm4IlNUQy1P_R7sLMvKhG39KsA-J0FOGKktwk4qVpmNs5wOKAJ7TncSygMy_gYfR9VW3IdlRLosiXountFima8ZqZSN-0S-vX8Ex1PTPSOoWu5SYTkLvlmjtp_st74yqToHZPXtcDOXrzxeRieX9uNyIczQ0gjiLHX39ipsAAcxrnpBDJf4xBwLCiXRzXiZXTBN49OchoAJ7WJJUuMPxZTeht' },
      { id: 'ter-2', name: 'Strogonoff de Frango', price: 32.90, desc: 'Peito de frango em cubos com molho cremoso e batata palha artesanal.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1PkwMJc_VcrN2ulOzWk2n4Wj8e-PZgSFC50u20-60ruWFUkrNIpZRgT0rJ5Vbk5xlisCJ_UxdYnl8NrmKGZitN2dOhlJdQ-dSIKyRuxzCfn_y-VneMqqrlzBEVdo9rOokkNPiwcwnqArD_Yhk5dEbDJKHRXYYI1tosoxa1mw-czyOHNB-UlcwKc3zJlcNavwnT7zQBWAXnCyvso3PTPit--pRajlg3DsLS2SgHVNqpplfNFHmXl1a' }
    ]
  },
  3: {
    dayName: 'Quarta-feira',
    shortDay: 'QUA',
    specialName: 'Quarta da Feijoada Completa & Moqueca',
    dishes: [
      { id: 'qua-1', name: 'Feijoada Completa', price: 42.90, desc: 'Feijoada tradicional com pertences, arroz branco, couve e laranjas.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQU1RjBmF5UfWAhVRTJqtt-FUElVR3_JUYuylRjb1EVgFl97bbiOmfIwwTAoWuRRlGizmpqyOIb1aMga1PcQouApHX3s77xy_hkzcXZVWBrjbz2KCNUSPvFT53w7UiLH-luhNRWYoO9AvD978GD4eRao1AdqgZvEXbpz6iK81-5yqsW8TuA8O7tn0Xa_CRjjINeJWTlxJXuPxIJiw4HUaT51A5ZLjv_Ext1JwPp_9c_WZlFT75KkN2' },
      { id: 'qua-2', name: 'Moqueca Baiana', price: 48.90, desc: 'Peixe fresco com leite de coco artesanal, pimentões e azeite de dendê.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHhdBFMyj61NEiIxLepFLbnS615uRmW4535mcRfuO1tzk6dEwATlxyhi6NrxrbMgC5WCu4LHxWdeZ-9t_c9rHq37Qj_Unyxj1i5irFCi99LCd21DrrImbLb4cdfCCDYpwl9YQPjih3WHeAq7UgzYtUhD0VhDjOzlEKRrFlyLf09MgFepnrNalDjJ_OvHHCPU-d4A8N5J2ij3nb2x8eW5qxszHJjIo695bvA0NVdPx6w6bt6mka0efA' }
    ]
  },
  4: {
    dayName: 'Quinta-feira',
    shortDay: 'QUI',
    specialName: 'Quinta do Escondidinho & Lasanha',
    dishes: [
      { id: 'qui-1', name: 'Escondidinho de Carne Seca', price: 36.90, desc: 'Carne seca desfiada coberta com purê de mandioca gratinado com queijo.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD2Q7D8wBnvJ_qZYJ1spQsmuqf6neMhlr6GvW5QMDw6NfUS-CxWKV7-xX6DTmCAQ27CL3KncTVAZu6uqJXS-QGxdOgFSbT5-jpUdx7aR93Y7T4ujZWZbmqU0wMb2dEHna_P87drCdMzPyQqx8V1_DwmYePYnE1_38DrGUNdTs8O81j4qXKssoshW3lI8OaidlE3Dcr_r9kg-PYYYu_xMyd5lxGnrhRcVdQNfLUYsT562wiDtL6QwAp' },
      { id: 'qui-2', name: 'Lasanha à Bolonhesa', price: 34.00, desc: 'Massa artesanal recheada com carne moída temperada e molho caseiro.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnGlS76inrAx6drJUD7E5D4JOw7uKG8Ns9-ZkaRVRx0TA5CvhrR9tG-ms04G3gAl0ZsmS5vLDTFEPPzOWyc0gVkSZL5YcmiHlH4u0lC04SwRomJtnUqKKcZdwmyt6GgvatcDLvCbcEmMAP3KQV8RaMVURN-4O4u_J1qsKOJJFvytKf0JSagnbFt46p5tvwaKIeWEjt6-9xTp6C8UmUzPwgJRPyqeBaF56lg_DnoR6k51vNsBxJ75Kc' }
    ]
  },
  5: {
    dayName: 'Sexta-feira',
    shortDay: 'SEX',
    specialName: 'Sexta Nordestina: Baião de Dois & Costela',
    dishes: [
      { id: 'sex-1', name: 'Baião de Dois', price: 42.00, desc: 'Arroz, feijão fradinho, queijo coalho grelhado e carne de sol.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHWYuPra0qtDl9CXxI8oPdUWNGDiCdBUrHEnS5ZRSzcUj3JKWSN4ik0wBjkPgddljee3kq8_FI85ypkVNYeAal86_QGTGi8-IEOnO9CPWfW4iCT0eHzG4OU25XEy0Wnoj4cF4sVDOEXwFpOIwk379-Ku7TOSRTz5LOPKPLzYCl_qHDt-PrxxsfmFw52xkY8mbcpzdXG4QJT9A22suVbsaHPT6LMquNIgjcj9lNcmX35ipz2w1KTEEn' },
      { id: 'sex-2', name: 'Costela Assada com Mandioca', price: 44.90, desc: 'Costela bovina assada lentamente com mandioca cozida na manteiga.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJGN1AVoTnCt_bHtcgU1lA3GN-ppywn1o1avK4mlJDL9yk0UnBpbRW6nf9JtJUEQnDUXQlurRqTDpzTXLi0u0j_NUzA-H_jKUbr1ASILn9_Ii07bpUna73xMMRYKEo5IUiT_3INgoDv4sgQIIWvOheN1-sx7PZDOG5E_VkePnW0UDVT8_iGovh4E9KVphfdNUeNPwxONcRffQpiZlfhtxPZ3yJty7pK7ih1jbmqxxCyyIIox6fUcvc' }
    ]
  }
};

// Get real today index (1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri). If weekend (0 or 6), default to 1
function getTodayDayIndex() {
  const day = new Date().getDay();
  if (day >= 1 && day <= 5) return day;
  return 1; // Default to Monday if Saturday or Sunday
}

// Get selected day index
function getSelectedDayIndex() {
  try {
    const saved = localStorage.getItem(SELECTED_DAY_KEY);
    if (saved && WEEKLY_MENU[saved]) return parseInt(saved, 10);
  } catch(e) {}
  return getTodayDayIndex();
}

// Set selected day index
function setSelectedDayIndex(dayIdx) {
  try {
    localStorage.setItem(SELECTED_DAY_KEY, dayIdx.toString());
  } catch(e) {}
}

// Initial default cart items
const DEFAULT_CART = [
  {
    id: 'ter-1',
    name: 'Bife à Parmegiana',
    detail: 'Terça-feira • Filet empanado coberto com queijo derretido e molho de tomate',
    targetDay: 'Terça-feira',
    price: 38.90,
    quantity: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNElcq-0UBqJGWP1aEvfvNSVp-O7PVm4IlNUQy1P_R7sLMvKhG39KsA-J0FOGKktwk4qVpmNs5wOKAJ7TncSygMy_gYfR9VW3IdlRLosiXountFima8ZqZSN-0S-vX8Ex1PTPSOoWu5SYTkLvlmjtp_st74yqToHZPXtcDOXrzxeRieX9uNyIczQ0gjiLHX39ipsAAcxrnpBDJf4xBwLCiXRzXiZXTBN49OchoAJ7WJJUuMPxZTeht'
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
  const deliveryFee = 0.00; // Free delivery
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
    status: 'preparando',
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
  return {
    id: 'TB-849201',
    timestamp: new Date().toISOString(),
    status: 'preparando',
    name: 'Maria Silva',
    address: 'Av. Beira Mar Norte, 1500 - Tubarão, SC',
    paymentMethod: 'PIX',
    items: DEFAULT_CART,
    subtotal: 38.90,
    deliveryFee: 0.00,
    total: 38.90,
    notes: 'Sem cebola, por favor.'
  };
}

// Toast notification helper
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-16 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none px-4 w-full max-w-xs';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'bg-primary text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg shadow-md border border-primary-fixed/30 flex items-center justify-between animate-fade-in pointer-events-auto';
  toast.innerHTML = `
    <span class="flex items-center gap-1.5">
      <span class="material-symbols-outlined text-sm">check_circle</span>
      ${message}
    </span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 2200);
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
