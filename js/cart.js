/**
 * Temperos do Brasil - Shared Cart, Weekly Menu, Configs, Orders, WhatsApp, Supabase & SaaS POS Admin
 */

const CART_STORAGE_KEY = 'temperos_cart_v1';
const ORDER_STORAGE_KEY = 'temperos_order_v1';
const ORDERS_LIST_KEY = 'temperos_all_orders_v1';
const WEEKLY_MENU_KEY = 'temperos_weekly_menu_v1';
const CONFIG_STORAGE_KEY = 'temperos_config_v1';
const SELECTED_DAY_KEY = 'temperos_selected_day_v1';

// Restaurant WhatsApp Number (48 98878-1598)
const RESTAURANT_WHATSAPP = '5548988781598';

// Default App Settings
const DEFAULT_CONFIG = {
  whatsappNumber: '5548988781598',
  restaurantName: 'Temperos do Brasil',
  deliveryCity: 'Tubarão e região',
  heroTitle: 'Marmitas Caseiras com Sabor do Brasil',
  heroSubtitle: 'Comida de verdade, feita diariamente com ingredientes frescos e entregue quentinha em Tubarão e região.',
  promoBadge: '🔥 Marmita do Dia a partir de R$ 15,00',
  bannerHeadline: 'Peça seu almoço quentinho hoje!',
  bannerSubtext: 'Entrega rápida e grátis para Tubarão e região.',
  openingHours: 'Segunda a Sexta: 10h30 às 14h',
  announcementText: '📢 Cardápio de hoje atualizado! Faça seu pedido pelo WhatsApp.',
  announcementEnabled: true,
  customMarmitaEnabled: true,
  thermalHeaderNote: 'Temperos do Brasil • Marmitas Caseiras',
  thermalFooterNote: 'Obrigado pela preferência! Bom apetite! ♡',
  thermalPaperWidth: '80mm',
  marmitaPrices: {
    M: 15.00,
    G: 20.00,
    Executiva: 30.00
  },
  proteinLimits: {
    M: 1,
    G: 2,
    Executiva: 3
  },
  maxAccompaniments: 3,
  accompaniments: ['Arroz', 'Feijão', 'Macarrão', 'Polenta', 'Farofa', 'Salada'],
  extras: [
    { id: 'ext-1', name: 'Guaraná Antarctica 2L', price: 10.00 },
    { id: 'ext-2', name: 'Pudim Caseiro de Leite', price: 7.00 }
  ]
};

// User Session Authentication Helpers
function getUserSession() {
  try {
    const raw = localStorage.getItem('temperos_user_session_v1');
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}

function isUserLoggedIn() {
  const session = getUserSession();
  return !!(session && session.isLoggedIn);
}

function requireUserLogin(msg = 'Por favor, faça login ou crie sua conta para finalizar o pedido.') {
  if (!isUserLoggedIn()) {
    showToast(msg);
    setTimeout(() => {
      window.location.href = 'login.html?required=1';
    }, 600);
    return false;
  }
  return true;
}

function getConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch(e) {}
  return DEFAULT_CONFIG;
}

function saveConfig(config) {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    if (typeof syncConfigToSupabase === 'function') {
      syncConfigToSupabase(config);
    }
  } catch(e) {}
}

// Default Weekly Menu Data
const DEFAULT_WEEKLY_MENU = {
  1: {
    dayName: 'Segunda-feira',
    dateLabel: '20 de Julho',
    shortDay: 'SEG',
    specialName: 'Segunda da Feijoada Light & Virado',
    dishes: [
      { id: 'seg-1', name: 'Feijoada Light', price: 15.00, desc: 'Feijão preto temperado com carnes magras, couve e farofa.', available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQU1RjBmF5UfWAhVRTJqtt-FUElVR3_JUYuylRjb1EVgFl97bbiOmfIwwTAoWuRRlGizmpqyOIb1aMga1PcQouApHX3s77xy_hkzcXZVWBrjbz2KCNUSPvFT53w7UiLH-luhNRWYoO9AvD978GD4eRao1AdqgZvEXbpz6iK81-5yqsW8TuA8O7tn0Xa_CRjjINeJWTlxJXuPxIJiw4HUaT51A5ZLjv_Ext1JwPp_9c_WZlFT75KkN2' },
      { id: 'seg-2', name: 'Virado à Paulista', price: 20.00, desc: 'Tutu de feijão, bisteca suína grelhada, ovo frito e couve.', available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJGN1AVoTnCt_bHtcgU1lA3GN-ppywn1o1avK4mlJDL9yk0UnBpbRW6nf9JtJUEQnDUXQlurRqTDpzTXLi0u0j_NUzA-H_jKUbr1ASILn9_Ii07bpUna73xMMRYKEo5IUiT_3INgoDv4sgQIIWvOheN1-sx7PZDOG5E_VkePnW0UDVT8_iGovh4E9KVphfdNUeNPwxONcRffQpiZlfhtxPZ3yJty7pK7ih1jbmqxxCyyIIox6fUcvc' }
    ]
  },
  2: {
    dayName: 'Terça-feira',
    dateLabel: '21 de Julho',
    shortDay: 'TER',
    specialName: 'Cardápio Oficial • 21 de Julho',
    dishes: [
      { id: 'ter-carne-assada', name: 'Marmita Carne Assada no Forno', price: 15.00, desc: 'Carne assada no forno suculenta + Acompanhamentos completos.', available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJGN1AVoTnCt_bHtcgU1lA3GN-ppywn1o1avK4mlJDL9yk0UnBpbRW6nf9JtJUEQnDUXQlurRqTDpzTXLi0u0j_NUzA-H_jKUbr1ASILn9_Ii07bpUna73xMMRYKEo5IUiT_3INgoDv4sgQIIWvOheN1-sx7PZDOG5E_VkePnW0UDVT8_iGovh4E9KVphfdNUeNPwxONcRffQpiZlfhtxPZ3yJty7pK7ih1jbmqxxCyyIIox6fUcvc' },
      { id: 'ter-linguica', name: 'Marmita Linguiça Assada', price: 15.00, desc: 'Linguiça assada saborosa + Acompanhamentos completos.', available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnGlS76inrAx6drJUD7E5D4JOw7uKG8Ns9-ZkaRVRx0TA5CvhrR9tG-ms04G3gAl0ZsmS5vLDTFEPPzOWyc0gVkSZL5YcmiHlH4u0lC04SwRomJtnUqKKcZdwmyt6GgvatcDLvCbcEmMAP3KQV8RaMVURN-4O4u_J1qsKOJJFvytKf0JSagnbFt46p5tvwaKIeWEjt6-9xTp6C8UmUzPwgJRPyqeBaF56lg_DnoR6k51vNsBxJ75Kc' },
      { id: 'ter-frango', name: 'Marmita Frango Ensopado', price: 15.00, desc: 'Frango ensopado com molho caseiro + Acompanhamentos completos.', available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1PkwMJc_VcrN2ulOzWk2n4Wj8e-PZgSFC50u20-60ruWFUkrNIpZRgT0rJ5Vbk5xlisCJ_UxdYnl8NrmKGZitN2dOhlJdQ-dSIKyRuxzCfn_y-VneMqqrlzBEVdo9rOokkNPiwcwnqArD_Yhk5dEbDJKHRXYYI1tosoxa1mw-czyOHNB-UlcwKc3zJlcNavwnT7zQBWAXnCyvso3PTPit--pRajlg3DsLS2SgHVNqpplfNFHmXl1a' },
      { id: 'ter-marmita-g', name: 'Marmita G (2 Proteínas)', price: 20.00, desc: 'Escolha 2 proteínas + Acompanhamentos completos.', available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNElcq-0UBqJGWP1aEvfvNSVp-O7PVm4IlNUQy1P_R7sLMvKhG39KsA-J0FOGKktwk4qVpmNs5wOKAJ7TncSygMy_gYfR9VW3IdlRLosiXountFima8ZqZSN-0S-vX8Ex1PTPSOoWu5SYTkLvlmjtp_st74yqToHZPXtcDOXrzxeRieX9uNyIczQ0gjiLHX39ipsAAcxrnpBDJf4xBwLCiXRzXiZXTBN49OchoAJ7WJJUuMPxZTeht' }
    ]
  },
  3: {
    dayName: 'Quarta-feira',
    dateLabel: '22 de Julho',
    shortDay: 'QUA',
    specialName: 'Quarta da Feijoada Completa & Moqueca',
    dishes: [
      { id: 'qua-1', name: 'Feijoada Completa', price: 20.00, desc: 'Feijoada tradicional com pertences, arroz branco, couve e laranjas.', available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQU1RjBmF5UfWAhVRTJqtt-FUElVR3_JUYuylRjb1EVgFl97bbiOmfIwwTAoWuRRlGizmpqyOIb1aMga1PcQouApHX3s77xy_hkzcXZVWBrjbz2KCNUSPvFT53w7UiLH-luhNRWYoO9AvD978GD4eRao1AdqgZvEXbpz6iK81-5yqsW8TuA8O7tn0Xa_CRjjINeJWTlxJXuPxIJiw4HUaT51A5ZLjv_Ext1JwPp_9c_WZlFT75KkN2' },
      { id: 'qua-2', name: 'Moqueca Baiana', price: 30.00, desc: 'Peixe fresco com leite de coco artesanal e azeite de dendê.', available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHhdBFMyj61NEiIxLepFLbnS615uRmW4535mcRfuO1tzk6dEwATlxyhi6NrxrbMgC5WCu4LHxWdeZ-9t_c9rHq37Qj_Unyxj1i5irFCi99LCd21DrrImbLb4cdfCCDYpwl9YQPjih3WHeAq7UgzYtUhD0VhDjOzlEKRrFlyLf09MgFepnrNalDjJ_OvHHCPU-d4A8N5J2ij3nb2x8eW5qxszHJjIo695bvA0NVdPx6w6bt6mka0efA' }
    ]
  },
  4: {
    dayName: 'Quinta-feira',
    dateLabel: '23 de Julho',
    shortDay: 'QUI',
    specialName: 'Quinta do Escondidinho & Lasanha',
    dishes: [
      { id: 'qui-1', name: 'Escondidinho de Carne Seca', price: 20.00, desc: 'Carne seca desfiada coberta com purê de mandioca gratinado.', available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD2Q7D8wBnvJ_qZYJ1spQsmuqf6neMhlr6GvW5QMDw6NfUS-CxWKV7-xX6DTmCAQ27CL3KncTVAZu6uqJXS-QGxdOgFSbT5-jpUdx7aR93Y7T4ujZWZbmqU0wMb2dEHna_P87drCdMzPyQqx8V1_DwmYePYnE1_38DrGUNdTs8O81j4qXKssoshW3lI8OaidlE3Dcr_r9kg-PYYYu_xMyd5lxGnrhRcVdQNfLUYsT562wiDtL6QwAp' },
      { id: 'qui-2', name: 'Lasanha à Bolonhesa', price: 15.00, desc: 'Massa artesanal recheada com carne moída temperada e molho caseiro.', available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnGlS76inrAx6drJUD7E5D4JOw7uKG8Ns9-ZkaRVRx0TA5CvhrR9tG-ms04G3gAl0ZsmS5vLDTFEPPzOWyc0gVkSZL5YcmiHlH4u0lC04SwRomJtnUqKKcZdwmyt6GgvatcDLvCbcEmMAP3KQV8RaMVURN-4O4u_J1qsKOJJFvytKf0JSagnbFt46p5tvwaKIeWEjt6-9xTp6C8UmUzPwgJRPyqeBaF56lg_DnoR6k51vNsBxJ75Kc' }
    ]
  },
  5: {
    dayName: 'Sexta-feira',
    dateLabel: '24 de Julho',
    shortDay: 'SEX',
    specialName: 'Sexta Nordestina: Baião de Dois & Costela',
    dishes: [
      { id: 'sex-1', name: 'Baião de Dois', price: 20.00, desc: 'Arroz, feijão fradinho, queijo coalho grelhado e carne de sol.', available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHWYuPra0qtDl9CXxI8oPdUWNGDiCdBUrHEnS5ZRSzcUj3JKWSN4ik0wBjkPgddljee3kq8_FI85ypkVNYeAal86_QGTGi8-IEOnO9CPWfW4iCT0eHzG4OU25XEy0Wnoj4cF4sVDOEXwFpOIwk379-Ku7TOSRTz5LOPKPLzYCl_qHDt-PrxxsfmFw52xkY8mbcpzdXG4QJT9A22suVbsaHPT6LMquNIgjcj9lNcmX35ipz2w1KTEEn' },
      { id: 'sex-2', name: 'Costela Assada com Mandioca', price: 30.00, desc: 'Costela bovina assada lentamente com mandioca cozida na manteiga.', available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJGN1AVoTnCt_bHtcgU1lA3GN-ppywn1o1avK4mlJDL9yk0UnBpbRW6nf9JtJUEQnDUXQlurRqTDpzTXLi0u0j_NUzA-H_jKUbr1ASILn9_Ii07bpUna73xMMRYKEo5IUiT_3INgoDv4sgQIIWvOheN1-sx7PZDOG5E_VkePnW0UDVT8_iGovh4E9KVphfdNUeNPwxONcRffQpiZlfhtxPZ3yJty7pK7ih1jbmqxxCyyIIox6fUcvc' }
    ]
  }
};

function getWeeklyMenu() {
  try {
    const raw = localStorage.getItem(WEEKLY_MENU_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed[1] && parsed[2] && parsed[3]) {
        return parsed;
      }
    }
  } catch(e) {}

  localStorage.setItem(WEEKLY_MENU_KEY, JSON.stringify(DEFAULT_WEEKLY_MENU));
  return DEFAULT_WEEKLY_MENU;
}

function saveWeeklyMenu(menu) {
  try {
    localStorage.setItem(WEEKLY_MENU_KEY, JSON.stringify(menu));
    // Sync all dishes to Supabase
    if (typeof syncDishToSupabase === 'function') {
      Object.keys(menu).forEach(dayId => {
        const day = menu[dayId];
        if (day && day.dishes) {
          day.dishes.forEach(d => syncDishToSupabase(d, parseInt(dayId, 10)));
        }
      });
    }
  } catch(e) {}
}

const WEEKLY_MENU = getWeeklyMenu();

function getTodayDayIndex() {
  const day = new Date().getDay();
  if (day >= 1 && day <= 5) return day;
  return 2; // Default Terça-feira
}

function getSelectedDayIndex() {
  try {
    const saved = localStorage.getItem(SELECTED_DAY_KEY);
    if (saved) {
      const parsedInt = parseInt(saved, 10);
      if ([1, 2, 3, 4, 5].includes(parsedInt)) return parsedInt;
    }
  } catch(e) {}
  return getTodayDayIndex();
}

function setSelectedDayIndex(dayIdx) {
  try {
    localStorage.setItem(SELECTED_DAY_KEY, dayIdx.toString());
  } catch(e) {}
}

const DEFAULT_CART = [
  {
    id: 'ter-carne-assada',
    name: 'Marmita M - Carne Assada no Forno',
    detail: 'Terça-feira (21 de Julho) • Carne assada no forno + Acompanhamentos',
    targetDay: 'Terça-feira (21 de Julho)',
    price: 15.00,
    quantity: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJGN1AVoTnCt_bHtcgU1lA3GN-ppywn1o1avK4mlJDL9yk0UnBpbRW6nf9JtJUEQnDUXQlurRqTDpzTXLi0u0j_NUzA-H_jKUbr1ASILn9_Ii07bpUna73xMMRYKEo5IUiT_3INgoDv4sgQIIWvOheN1-sx7PZDOG5E_VkePnW0UDVT8_iGovh4E9KVphfdNUeNPwxONcRffQpiZlfhtxPZ3yJty7pK7ih1jbmqxxCyyIIox6fUcvc'
  }
];

function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
}

function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(DEFAULT_CART));
      return DEFAULT_CART;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_CART;
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadges();
  } catch (e) {}
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ ...item, quantity: item.quantity || 1 });
  }
  saveCart(cart);
  showToast(`"${item.name}" adicionado ao pedido!`);
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
}

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

function getCartSummary() {
  const cart = getCart();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 0.00;
  const total = subtotal + deliveryFee;

  return { cart, itemCount, subtotal, deliveryFee, total };
}

function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  updateCartBadges();
}

function updateCartBadges() {
  const { itemCount } = getCartSummary();
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    badge.textContent = itemCount;
    if (itemCount > 0) {
      badge.classList.remove('hidden');
      badge.style.display = 'flex';
    } else {
      badge.classList.add('hidden');
      badge.style.display = 'none';
    }
  });
}

function getAllOrders() {
  const deletedSet = (typeof getDeletedOrderIds === 'function') ? getDeletedOrderIds() : new Set();
  try {
    const raw = localStorage.getItem(ORDERS_LIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(o => !deletedSet.has(o.id));
      }
    }
  } catch(e) {}
  
  return [];
}

// Build Clean WhatsApp Message
function buildWhatsAppMessage(order) {
  let msg = `*NOVO PEDIDO #${order.id}* 🍱\n`;
  msg += `*Temperos do Brasil*\n`;
  msg += `====================================\n`;
  msg += `👤 *Cliente:* ${order.name}\n`;
  msg += `📍 *Endereço:* ${order.address}\n`;
  msg += `💳 *Pagamento:* ${order.paymentMethod}\n`;
  if (order.notes) {
    msg += `📝 *Observações:* ${order.notes}\n`;
  }
  msg += `====================================\n`;
  msg += `📋 *ITENS DO PEDIDO:*\n`;
  
  order.items.forEach(item => {
    msg += `• *${item.quantity}x* ${item.name} (${formatBRL(item.price * item.quantity)})\n`;
    if (item.detail) {
      msg += `   _${item.detail}_\n`;
    }
  });
  
  msg += `====================================\n`;
  msg += `🚚 *Entrega:* Grátis (Tubarão e região)\n`;
  msg += `💰 *VALOR TOTAL:* *${formatBRL(order.total)}*\n`;
  msg += `====================================\n`;
  msg += `Seu almoço com carinho e sabor! ♡`;

  return msg;
}

// User Address Management Helpers
function getSavedAddresses() {
  try {
    const raw = localStorage.getItem('temperos_user_addresses_v1');
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  
  const session = getUserSession();
  if (session && session.isLoggedIn) {
    return [
      { id: 'addr-1', label: 'Casa (Principal)', address: 'Av. Padre Geraldo Spettmann, 280 - Centro, Tubarão - SC' }
    ];
  }
  return [];
}

function saveUserAddress(label, fullAddress) {
  if (!fullAddress || fullAddress.trim().length < 5) return;
  const addresses = getSavedAddresses();
  const existingIdx = addresses.findIndex(a => a.address.toLowerCase() === fullAddress.toLowerCase());
  
  if (existingIdx >= 0) {
    addresses[existingIdx].label = label || addresses[existingIdx].label;
  } else {
    addresses.push({
      id: 'addr-' + Date.now(),
      label: label || 'Endereço Salvo ' + (addresses.length + 1),
      address: fullAddress.trim()
    });
  }
  localStorage.setItem('temperos_user_addresses_v1', JSON.stringify(addresses));
}

// Save Order & Sync to Supabase Database
function saveOrder(orderData) {
  const currentCart = getCart();
  const summary = getCartSummary();
  const config = getConfig();
  const session = getUserSession();

  const order = {
    id: 'TB-' + Math.floor(100000 + Math.random() * 900000),
    timestamp: new Date().toISOString(),
    status: 'recebido',
    items: orderData.items || currentCart,
    address: orderData.address || 'Av. Padre Geraldo Spettmann, 280 - Centro, Tubarão - SC',
    name: orderData.name || (session ? session.name : 'Cliente Especial'),
    userEmail: session ? session.email : '',
    paymentMethod: orderData.paymentMethod || 'PIX',
    total: orderData.total || summary.total,
    notes: orderData.notes || ''
  };

  if (order.address) {
    saveUserAddress('Endereço Salvo', order.address);
  }

  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
  
  const ordersList = getAllOrders();
  ordersList.unshift(order);
  localStorage.setItem(ORDERS_LIST_KEY, JSON.stringify(ordersList));

  // Sync with Supabase Database
  if (typeof syncOrderToSupabase === 'function') {
    syncOrderToSupabase(order);
  }

  const phone = (config.whatsappNumber || RESTAURANT_WHATSAPP).replace(/\D/g, '');
  const waText = encodeURIComponent(buildWhatsAppMessage(order));
  
  order.whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${waText}`;

  clearCart();
  return order;
}

async function updateOrderStatus(orderId, newStatus) {
  if (typeof markOrderConfirmedLocal === 'function') {
    markOrderConfirmedLocal(orderId);
  }

  const ordersList = getAllOrders();
  const target = ordersList.find(o => o.id === orderId);
  if (target) {
    target.status = newStatus;
    target.updatedAt = new Date().toISOString();
  } else {
    ordersList.push({ id: orderId, status: newStatus, updatedAt: new Date().toISOString() });
  }
  localStorage.setItem(ORDERS_LIST_KEY, JSON.stringify(ordersList));
  
  const active = getOrder();
  if (active && active.id === orderId) {
    active.status = newStatus;
    active.updatedAt = new Date().toISOString();
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(active));
  }

  // Await status change to Supabase Database
  if (typeof syncOrderStatusToSupabase === 'function') {
    await syncOrderStatusToSupabase(orderId, newStatus);
  }
}

async function deleteOrderAdmin(orderId) {
  if (typeof markOrderDeletedLocal === 'function') {
    markOrderDeletedLocal(orderId);
  }

  let ordersList = getAllOrders();
  ordersList = ordersList.filter(o => o.id !== orderId);
  localStorage.setItem(ORDERS_LIST_KEY, JSON.stringify(ordersList));

  if (typeof deleteOrderFromSupabase === 'function') {
    await deleteOrderFromSupabase(orderId);
  }
}

function getOrder() {
  const deletedSet = (typeof getDeletedOrderIds === 'function') ? getDeletedOrderIds() : new Set();
  try {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id && !deletedSet.has(parsed.id)) {
        return parsed;
      }
    }
  } catch (e) {}

  const orders = getAllOrders();
  const active = orders.find(o => o.status !== 'entregue' && !deletedSet.has(o.id));
  return active || null;
}

function getAdminMetrics() {
  const orders = getAllOrders();
  const revenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'recebido' || o.status === 'preparando').length;
  const deliveredOrders = orders.filter(o => o.status === 'entregue').length;

  return {
    revenue,
    totalOrders,
    pendingOrders,
    deliveredOrders
  };
}

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

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadges();
  if (document.fonts) {
    document.body.classList.add('fonts-loading');
    document.fonts.ready.then(() => {
      document.body.classList.remove('fonts-loading');
    });
  }
});
