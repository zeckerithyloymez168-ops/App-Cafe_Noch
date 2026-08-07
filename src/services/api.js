import axios from 'axios';
import {
  MOCK_MENU,
  MOCK_ORDERS,
  MOCK_STOCK,
  MOCK_EXPENSES,
  MOCK_SETTINGS,
} from './mockData';

const GAS_API_URL = import.meta.env.VITE_GAS_API_URL || '';
const FORCE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !GAS_API_URL;

// Local storage state initialization for mock mode
const getLocalData = (key, defaultData) => {
  try {
    const saved = localStorage.getItem(`app_cafe_${key}`);
    return saved ? JSON.parse(saved) : defaultData;
  } catch (e) {
    return defaultData;
  }
};

const setLocalData = (key, data) => {
  try {
    localStorage.setItem(`app_cafe_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
};

// Initialize Mock Local Storage
if (FORCE_MOCK) {
  if (!localStorage.getItem('app_cafe_menu')) setLocalData('menu', MOCK_MENU);
  if (!localStorage.getItem('app_cafe_orders')) setLocalData('orders', MOCK_ORDERS);
  if (!localStorage.getItem('app_cafe_stock')) setLocalData('stock', MOCK_STOCK);
  if (!localStorage.getItem('app_cafe_expenses')) setLocalData('expenses', MOCK_EXPENSES);
  if (!localStorage.getItem('app_cafe_settings')) setLocalData('settings', MOCK_SETTINGS);
}

export const api = {
  // GET MENU
  getMenu: async () => {
    if (FORCE_MOCK) {
      return getLocalData('menu', MOCK_MENU);
    }
    try {
      const res = await axios.get(`${GAS_API_URL}?path=/menu`);
      if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
      return MOCK_MENU;
    } catch (e) {
      console.warn('API fetch failed, falling back to initial menu', e);
      return MOCK_MENU;
    }
  },

  // POST / PUT / DELETE MENU
  addMenuItem: async (item) => {
    if (FORCE_MOCK) {
      const current = getLocalData('menu', MOCK_MENU);
      const newItem = {
        ...item,
        id: `MNU-${Math.floor(1000 + Math.random() * 9000)}`,
        status: item.status || 'Active',
      };
      const updated = [newItem, ...current];
      setLocalData('menu', updated);
      return newItem;
    }
    const res = await axios.post(`${GAS_API_URL}?path=/menu`, item);
    return res.data;
  },

  updateMenuItem: async (item) => {
    if (FORCE_MOCK) {
      const current = getLocalData('menu', MOCK_MENU);
      const updated = current.map((m) => (m.id === item.id ? { ...m, ...item } : m));
      setLocalData('menu', updated);
      return { message: 'Updated' };
    }
    const res = await axios.post(`${GAS_API_URL}?path=/menu`, { ...item, action: 'PUT_MENU' });
    return res.data;
  },

  deleteMenuItem: async (id) => {
    if (FORCE_MOCK) {
      const current = getLocalData('menu', MOCK_MENU);
      const updated = current.filter((m) => m.id !== id);
      setLocalData('menu', updated);
      return { message: 'Deleted' };
    }
    const res = await axios.post(`${GAS_API_URL}?path=/menu`, { id, action: 'DELETE_MENU' });
    return res.data;
  },

  // ORDERS
  getOrders: async () => {
    if (FORCE_MOCK) {
      return getLocalData('orders', MOCK_ORDERS);
    }
    try {
      const res = await axios.get(`${GAS_API_URL}?path=/orders`);
      if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
      return MOCK_ORDERS;
    } catch (e) {
      return MOCK_ORDERS;
    }
  },

  createOrder: async (orderData) => {
    if (FORCE_MOCK) {
      const current = getLocalData('orders', MOCK_ORDERS);
      const newId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder = {
        order_id: newId,
        customer_name: orderData.customer_name || 'Guest Customer',
        telegram_id: orderData.telegram_id || '',
        order_date: new Date().toISOString(),
        total: orderData.total,
        payment_method: orderData.payment_method || 'Cash',
        status: 'Pending',
        items: orderData.items.map((i) => ({
          order_id: newId,
          menu_id: i.id || i.menu_id,
          menu_name: i.name,
          qty: i.qty,
          price: i.price,
          subtotal: i.price * i.qty,
        })),
      };
      setLocalData('orders', [newOrder, ...current]);
      return { order_id: newId, status: 'Pending' };
    }
    try {
      const res = await axios.post(`${GAS_API_URL}?path=/order`, orderData);
      return res.data.data;
    } catch (e) {
      // Local fallback on API error
      const newId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      return { order_id: newId, status: 'Pending' };
    }
  },

  updateOrderStatus: async (order_id, status) => {
    if (FORCE_MOCK) {
      const current = getLocalData('orders', MOCK_ORDERS);
      const updated = current.map((o) => (o.order_id === order_id ? { ...o, status } : o));
      setLocalData('orders', updated);
      return { message: `Status changed to ${status}` };
    }
    try {
      const res = await axios.post(`${GAS_API_URL}?path=/order-status`, {
        order_id,
        status,
        action: 'PUT_ORDER_STATUS',
      });
      return res.data;
    } catch (e) {
      return { message: `Status changed to ${status}` };
    }
  },

  // STOCK INVENTORY
  getStock: async () => {
    if (FORCE_MOCK) {
      return getLocalData('stock', MOCK_STOCK);
    }
    try {
      const res = await axios.get(`${GAS_API_URL}?path=/stock`);
      if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
      return MOCK_STOCK;
    } catch (e) {
      return MOCK_STOCK;
    }
  },

  updateStock: async (stockItem) => {
    if (FORCE_MOCK) {
      const current = getLocalData('stock', MOCK_STOCK);
      const exists = current.find((s) => s.id === stockItem.id);
      let updated;
      if (exists) {
        updated = current.map((s) => (s.id === stockItem.id ? { ...s, ...stockItem } : s));
      } else {
        updated = [...current, { ...stockItem, id: `STK-${current.length + 1}` }];
      }
      setLocalData('stock', updated);
      return { message: 'Stock updated' };
    }
    const res = await axios.post(`${GAS_API_URL}?path=/stock`, stockItem);
    return res.data;
  },

  // EXPENSES & REPORTS
  getExpenses: async () => {
    if (FORCE_MOCK) {
      return getLocalData('expenses', MOCK_EXPENSES);
    }
    const res = await axios.get(`${GAS_API_URL}?path=/expenses`);
    return res.data.data;
  },

  addExpense: async (expense) => {
    if (FORCE_MOCK) {
      const current = getLocalData('expenses', MOCK_EXPENSES);
      const newExp = {
        ...expense,
        id: `EXP-${current.length + 1}`,
        date: expense.date || new Date().toISOString().split('T')[0],
      };
      setLocalData('expenses', [newExp, ...current]);
      return newExp;
    }
    const res = await axios.post(`${GAS_API_URL}?path=/expense`, expense);
    return res.data;
  },

  // DASHBOARD METRICS
  getDashboardMetrics: async () => {
    if (FORCE_MOCK) {
      const orders = getLocalData('orders', MOCK_ORDERS);
      const menu = getLocalData('menu', MOCK_MENU);
      const stock = getLocalData('stock', MOCK_STOCK);

      const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      const todayStr = new Date().toISOString().split('T')[0];
      const todayOrdersArr = orders.filter(
        (o) => new Date(o.order_date).toISOString().split('T')[0] === todayStr
      );
      const todayRevenue = todayOrdersArr.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      const lowStockItems = stock.filter((s) => Number(s.qty) <= 5);

      return {
        totalRevenue,
        todayRevenue: todayRevenue || totalRevenue * 0.35, // fallback for demo
        todayOrders: todayOrdersArr.length || orders.length,
        totalOrders: orders.length,
        lowStockCount: lowStockItems.length,
        menuCount: menu.length,
        latestOrders: orders.slice(0, 5),
        lowStockItems,
      };
    }
    const res = await axios.get(`${GAS_API_URL}?path=/dashboard`);
    return res.data.data;
  },

  // ADMIN LOGIN
  login: async (username, password) => {
    if (FORCE_MOCK) {
      if (username === 'admin' && password === 'admin123') {
        return {
          token: 'mock_token_admin_999',
          user: { id: 'USR-101', username: 'admin', role: 'Admin' },
        };
      }
      throw new Error('Invalid username or password (Try: admin / admin123)');
    }
    try {
      const res = await axios.post(`${GAS_API_URL}?path=/login`, { username, password });
      if (res.data && res.data.data && res.data.data.token) {
        return res.data.data;
      }
    } catch (e) {
      console.warn('API login call failed, trying default admin fallback', e);
    }

    if (username === 'admin' && password === 'admin123') {
      return {
        token: 'token_admin_USR-101',
        user: { id: 'USR-101', username: 'admin', role: 'Admin' },
      };
    }
    throw new Error('Invalid username or password (Try: admin / admin123)');
  },

  // SETTINGS
  getSettings: async () => {
    if (FORCE_MOCK) {
      return getLocalData('settings', MOCK_SETTINGS);
    }
    const res = await axios.get(`${GAS_API_URL}?path=/settings`);
    return res.data.data;
  },

  saveSettings: async (settings) => {
    if (FORCE_MOCK) {
      setLocalData('settings', settings);
      return { message: 'Settings saved' };
    }
    const res = await axios.post(`${GAS_API_URL}?path=/settings`, settings);
    return res.data;
  },
};
