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
    items_json: order.items
  };

  const result = await supabaseFetch('orders', {
    method: 'POST',
    body: payload,
    prefer: 'resolution=merge-duplicates'
  });

  return result;
}

// Sync Order Status Update to Supabase Database
async function syncOrderStatusToSupabase(orderId, status) {
  return await supabaseFetch('orders', {
    method: 'PATCH',
    query: `id=eq.${orderId}`,
    body: { status, updated_at: new Date().toISOString() }
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

// Fetch Real-Time Orders from Supabase
async function fetchOrdersFromSupabase() {
  const orders = await supabaseFetch('orders', { query: 'select=*&order=created_at.desc' });
  if (orders && Array.isArray(orders) && orders.length > 0) {
    const formatted = orders.map(o => ({
      id: o.id,
      timestamp: o.created_at,
      status: o.status,
      name: o.customer_name,
      address: o.address,
      paymentMethod: o.payment_method,
      items: o.items_json || [],
      subtotal: parseFloat(o.subtotal || 0),
      deliveryFee: parseFloat(o.delivery_fee || 0),
      total: parseFloat(o.total || 0),
      notes: o.notes || ''
    }));

    localStorage.setItem('temperos_all_orders_v1', JSON.stringify(formatted));
    return formatted;
  }
  return null;
}

// Auto sync on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchOrdersFromSupabase();
});
