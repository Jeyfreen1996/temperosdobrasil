/**
 * Temperos do Brasil - Supabase Integration Module
 * Project: Tempero do Brazil (xqsqiiwkhiwvgbzfriek)
 */

const SUPABASE_URL = 'https://xqsqiiwkhiwvgbzfriek.supabase.co';
const SUPABASE_ANON_KEY = ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxc3FpaXdraGl3dmdiemZyaWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5OTExMjAsImV4cCI6MjA5OTU2NzEyMH0', 'OBidiPNMgbXYwXJerpq1QGUiT4jaeLEAYpNtGs4Irx4'].join('.');

// Helper for Supabase REST API calls with RLS
async function supabaseFetch(table, options = {}) {
  const method = options.method || 'GET';
  const query = options.query || '';
  const url = `${SUPABASE_URL}/rest/v1/${table}${query ? '?' + query : ''}`;

  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': options.prefer || 'return=representation'
  };

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`Supabase API Notice (${table}):`, errText);
      return null;
    }

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    return true;
  } catch (err) {
    console.warn(`Supabase Fetch Notice (${table}):`, err);
    return null;
  }
}

// Sync Order to Supabase Database
async function syncOrderToSupabase(order) {
  const payload = {
    id: order.id,
    customer_name: order.name,
    address: order.address,
    payment_method: order.paymentMethod,
    notes: order.notes || '',
    status: order.status || 'recebido',
    subtotal: order.subtotal || order.total,
    delivery_fee: order.deliveryFee || 0.00,
    total: order.total,
    items_json: order.items,
    updated_at: new Date().toISOString()
  };

  return await supabaseFetch('orders', {
    method: 'POST',
    body: payload,
    prefer: 'resolution=merge-duplicates'
  });
}

// Sync Order Status Update to Supabase Database
async function syncOrderStatusToSupabase(orderId, status) {
  return await supabaseFetch('orders', {
    method: 'PATCH',
    query: `id=eq.${orderId}`,
    body: { status, updated_at: new Date().toISOString() }
  });
}

// Delete Order from Supabase Database Permanently
async function deleteOrderFromSupabase(orderId) {
  return await supabaseFetch('orders', {
    method: 'DELETE',
    query: `id=eq.${orderId}`
  });
}

// Sync Dishes to Supabase Database
async function syncDishToSupabase(dish, dayId) {
  const payload = {
    id: dish.id,
    day_id: dayId,
    name: dish.name,
    price: dish.price,
    description: dish.desc || '',
    image_url: dish.image || '',
    available: dish.available !== false
  };

  return await supabaseFetch('dishes', {
    method: 'POST',
    body: payload,
    prefer: 'resolution=merge-duplicates'
  });
}

// Fetch Config & Thermal Printer Settings from Supabase
async function fetchConfigFromSupabase() {
  const data = await supabaseFetch('restaurant_config', { query: 'id=eq.default' });
  if (data && Array.isArray(data) && data[0]) {
    const c = data[0];
    const formatted = {
      whatsappNumber: c.whatsapp_number || '5548988781598',
      restaurantName: c.restaurant_name || 'Temperos do Brasil',
      deliveryCity: c.delivery_city || 'Tubarão e região',
      heroTitle: c.hero_title || 'Marmitas Caseiras com Sabor do Brasil',
      heroSubtitle: c.hero_subtitle || 'Comida de verdade, feita diariamente com ingredientes frescos e entregue quentinha em Tubarão e região.',
      promoBadge: c.promo_badge || '🔥 Marmita do Dia a partir de R$ 15,00',
      bannerHeadline: c.banner_headline || 'Peça seu almoço quentinho hoje!',
      bannerSubtext: c.banner_subtext || 'Entrega rápida e grátis para Tubarão e região.',
      openingHours: c.opening_hours || 'Segunda a Sexta: 10h30 às 14h',
      announcementText: c.announcement_text || '📢 Cardápio de hoje atualizado! Faça seu pedido pelo WhatsApp.',
      announcementEnabled: c.announcement_enabled !== false,
      customMarmitaEnabled: c.custom_marmita_enabled !== false,
      thermalHeaderNote: c.thermal_header_note || 'Temperos do Brasil • Marmitas Caseiras',
      thermalFooterNote: c.thermal_footer_note || 'Obrigado pela preferência! Bom apetite! ♡',
      thermalPaperWidth: c.thermal_paper_width || '80mm',
      marmitaPrices: {
        M: parseFloat(c.marmita_m_price || 15.00),
        G: parseFloat(c.marmita_g_price || 20.00),
        Executiva: parseFloat(c.marmita_executiva_price || 30.00)
      },
      proteinLimits: {
        M: parseInt(c.marmita_m_max_proteins || 1, 10),
        G: parseInt(c.marmita_g_max_proteins || 2, 10),
        Executiva: parseInt(c.marmita_exec_max_proteins || 3, 10)
      },
      maxAccompaniments: parseInt(c.max_accompaniments || 3, 10),
      accompaniments: c.accompaniments || ['Arroz', 'Feijão', 'Macarrão', 'Polenta', 'Farofa', 'Salada'],
      extras: c.extras || [
        { id: 'ext-1', name: 'Guaraná Antarctica 2L', price: 10.00 },
        { id: 'ext-2', name: 'Pudim Caseiro de Leite', price: 7.00 }
      ]
    };

    localStorage.setItem('temperos_config_v1', JSON.stringify(formatted));
    return formatted;
  }
  return null;
}

// Sync Config Changes to Supabase
async function syncConfigToSupabase(config) {
  const payload = {
    id: 'default',
    whatsapp_number: config.whatsappNumber,
    restaurant_name: config.restaurantName,
    delivery_city: config.deliveryCity,
    hero_title: config.heroTitle,
    hero_subtitle: config.heroSubtitle,
    promo_badge: config.promoBadge,
    banner_headline: config.bannerHeadline,
    banner_subtext: config.bannerSubtext,
    opening_hours: config.openingHours,
    announcement_text: config.announcementText,
    announcement_enabled: config.announcementEnabled !== false,
    custom_marmita_enabled: config.customMarmitaEnabled !== false,
    thermal_header_note: config.thermalHeaderNote || 'Temperos do Brasil • Marmitas Caseiras',
    thermal_footer_note: config.thermalFooterNote || 'Obrigado pela preferência! Bom apetite! ♡',
    thermal_paper_width: config.thermalPaperWidth || '80mm',
    marmita_m_price: config.marmitaPrices ? config.marmitaPrices.M : 15.00,
    marmita_g_price: config.marmitaPrices ? config.marmitaPrices.G : 20.00,
    marmita_executiva_price: config.marmitaPrices ? config.marmitaPrices.Executiva : 30.00,
    marmita_m_max_proteins: config.proteinLimits ? config.proteinLimits.M : 1,
    marmita_g_max_proteins: config.proteinLimits ? config.proteinLimits.G : 2,
    marmita_exec_max_proteins: config.proteinLimits ? config.proteinLimits.Executiva : 3,
    max_accompaniments: config.maxAccompaniments || 3,
    accompaniments: config.accompaniments || ['Arroz', 'Feijão', 'Macarrão', 'Polenta', 'Farofa', 'Salada'],
    extras: config.extras || [],
    updated_at: new Date().toISOString()
  };

  return await supabaseFetch('restaurant_config', {
    method: 'POST',
    body: payload,
    prefer: 'resolution=merge-duplicates'
  });
}

// Fetch Real-Time Orders from Supabase with Smart Local Merge
async function fetchOrdersFromSupabase() {
  const orders = await supabaseFetch('orders', { query: 'select=*&order=created_at.desc' });
  if (orders && Array.isArray(orders)) {
    const rawLocal = localStorage.getItem('temperos_all_orders_v1');
    const localOrders = rawLocal ? JSON.parse(rawLocal) : [];
    const localMap = new Map(localOrders.map(o => [o.id, o]));

    const formatted = orders.map(o => {
      const local = localMap.get(o.id);
      let status = o.status;
      if (local && local.status !== o.status && local.updatedAt && new Date(local.updatedAt) > new Date(o.updated_at || 0)) {
        status = local.status;
      }
      return {
        id: o.id,
        timestamp: o.created_at,
        status: status,
        name: o.customer_name,
        address: o.address,
        paymentMethod: o.payment_method,
        items: o.items_json || [],
        subtotal: parseFloat(o.subtotal || 0),
        deliveryFee: parseFloat(o.delivery_fee || 0),
        total: parseFloat(o.total || 0),
        notes: o.notes || '',
        updatedAt: o.updated_at
      };
    });

    localStorage.setItem('temperos_all_orders_v1', JSON.stringify(formatted));
    return formatted;
  }
  return null;
}

// Fetch Dishes from Supabase
async function fetchDishesFromSupabase() {
  const dishes = await supabaseFetch('dishes', { query: 'select=*' });
  if (dishes && Array.isArray(dishes) && dishes.length > 0) {
    const weeklyMenu = getWeeklyMenu();
    dishes.forEach(d => {
      const dayId = d.day_id || 2;
      if (weeklyMenu[dayId]) {
        if (!weeklyMenu[dayId].dishes) weeklyMenu[dayId].dishes = [];
        const existingIdx = weeklyMenu[dayId].dishes.findIndex(item => item.id === d.id);
        const formattedDish = {
          id: d.id,
          name: d.name,
          price: parseFloat(d.price),
          desc: d.description || '',
          image: d.image_url || '',
          available: d.available !== false
        };

        if (existingIdx >= 0) {
          weeklyMenu[dayId].dishes[existingIdx] = formattedDish;
        } else {
          weeklyMenu[dayId].dishes.push(formattedDish);
        }
      }
    });

    localStorage.setItem('temperos_weekly_menu_v1', JSON.stringify(weeklyMenu));
    return weeklyMenu;
  }
  return null;
}

// Auto sync on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchConfigFromSupabase();
  fetchOrdersFromSupabase();
  fetchDishesFromSupabase();
});
