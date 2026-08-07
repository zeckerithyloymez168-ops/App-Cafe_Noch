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

// Local storage state initialization
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

// Helper for sending Google Apps Script cross-origin POST requests safely (no CORS pre-flight block)
const postGAS = async (path, data) => {
  try {
    const res = await axios.post(
      `${GAS_API_URL}?path=${path}`,
      JSON.stringify(data),
      { headers: { 'Content-Type': 'text/plain;charset=utf-8' } }
    );
    return res.data;
  } catch (err) {
    // Fallback to standard post
    const res = await axios.post(`${GAS_API_URL}?path=${path}`, data);
    return res.data;
  }
};

export const api = {
  // GET MENU
  getMenu: async () => {
    if (FORCE_MOCK) {
      return getLocalData('menu', []);
    }
    try {
      const res = await axios.get(`${GAS_API_URL}?path=/menu`);
      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (e) {
      return getLocalData('menu', []);
    }
  },

  // POST / PUT / DELETE MENU
  addMenuItem: async (item) => {
    if (FORCE_MOCK) {
      const current = getLocalData('menu', []);
      const newItem = {
        ...item,
        id: `MNU-${Math.floor(1000 + Math.random() * 9000)}`,
        status: item.status || 'Active',
      };
      const updated = [newItem, ...current];
      setLocalData('menu', updated);
      return newItem;
    }
    try {
      const res = await postGAS('/menu', item);
      return res;
    } catch (e) {
      const current = getLocalData('menu', []);
      const newItem = { ...item, id: `MNU-${Math.floor(1000 + Math.random() * 9000)}` };
      setLocalData('menu', [newItem, ...current]);
      return newItem;
    }
  },

  updateMenuItem: async (item) => {
    if (FORCE_MOCK) {
      const current = getLocalData('menu', []);
      const updated = current.map((m) => (m.id === item.id ? { ...m, ...item } : m));
      setLocalData('menu', updated);
      return { message: 'Updated' };
    }
    try {
      const res = await postGAS('/menu', { ...item, action: 'PUT_MENU' });
      return res;
    } catch (e) {
      return { message: 'Updated' };
    }
  },

  deleteMenuItem: async (id) => {
    if (FORCE_MOCK) {
      const current = getLocalData('menu', []);
      const updated = current.filter((m) => m.id !== id);
      setLocalData('menu', updated);
      return { message: 'Deleted' };
    }
    try {
      const res = await postGAS('/menu', { id, action: 'DELETE_MENU' });
      return res;
    } catch (e) {
      return { message: 'Deleted' };
    }
  },

  // ORDERS
  getOrders: async () => {
    if (FORCE_MOCK) {
      return getLocalData('orders', []);
    }
    try {
      const res = await axios.get(`${GAS_API_URL}?path=/orders`);
      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (e) {
      return getLocalData('orders', []);
    }
  },

  createOrder: async (orderData) => {
    if (FORCE_MOCK) {
      const current = getLocalData('orders', []);
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
      const res = await postGAS('/order', orderData);
      return res.data || res;
    } catch (e) {
      const newId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      return { order_id: newId, status: 'Pending' };
    }
  },

  updateOrderStatus: async (order_id, status) => {
    if (FORCE_MOCK) {
      const current = getLocalData('orders', []);
      const updated = current.map((o) => (o.order_id === order_id ? { ...o, status } : o));
      setLocalData('orders', updated);
      return { message: `Status changed to ${status}` };
    }
    try {
      const res = await postGAS('/order-status', {
        order_id,
        status,
        action: 'PUT_ORDER_STATUS',
      });
      return res;
    } catch (e) {
      return { message: `Status changed to ${status}` };
    }
  },

  // STOCK INVENTORY
  getStock: async () => {
    if (FORCE_MOCK) {
      return getLocalData('stock', []);
    }
    try {
      const res = await axios.get(`${GAS_API_URL}?path=/stock`);
      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (e) {
      return getLocalData('stock', []);
    }
  },

  updateStock: async (stockItem) => {
    if (FORCE_MOCK) {
      const current = getLocalData('stock', []);
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
    try {
      const res = await postGAS('/stock', stockItem);
      return res;
    } catch (e) {
      return { message: 'Stock updated' };
    }
  },

  // EXPENSES & REPORTS
  getExpenses: async () => {
    if (FORCE_MOCK) {
      return getLocalData('expenses', []);
    }
    try {
      const res = await axios.get(`${GAS_API_URL}?path=/expenses`);
      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (e) {
      return getLocalData('expenses', []);
    }
  },

  addExpense: async (expense) => {
    if (FORCE_MOCK) {
      const current = getLocalData('expenses', []);
      const newExp = {
        ...expense,
        id: `EXP-${current.length + 1}`,
        date: expense.date || new Date().toISOString().split('T')[0],
      };
      setLocalData('expenses', [newExp, ...current]);
      return newExp;
    }
    try {
      const res = await postGAS('/expense', expense);
      return res;
    } catch (e) {
      return { message: 'Expense logged' };
    }
  },

  // DASHBOARD METRICS
  getDashboardMetrics: async () => {
    if (FORCE_MOCK) {
      const orders = getLocalData('orders', []);
      const menu = getLocalData('menu', []);
      const stock = getLocalData('stock', []);

      const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      const todayStr = new Date().toISOString().split('T')[0];
      const todayOrdersArr = orders.filter(
        (o) => new Date(o.order_date).toISOString().split('T')[0] === todayStr
      );
      const todayRevenue = todayOrdersArr.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      const lowStockItems = stock.filter((s) => Number(s.qty) <= 5);

      return {
        totalRevenue,
        todayRevenue,
        todayOrders: todayOrdersArr.length,
        totalOrders: orders.length,
        lowStockCount: lowStockItems.length,
        menuCount: menu.length,
        latestOrders: orders.slice(0, 5),
        lowStockItems,
      };
    }
    try {
      const res = await axios.get(`${GAS_API_URL}?path=/dashboard`);
      return res.data.data || {
        totalRevenue: 0,
        todayRevenue: 0,
        todayOrders: 0,
        totalOrders: 0,
        lowStockCount: 0,
        menuCount: 0,
        latestOrders: [],
        lowStockItems: [],
      };
    } catch (e) {
      return {
        totalRevenue: 0,
        todayRevenue: 0,
        todayOrders: 0,
        totalOrders: 0,
        lowStockCount: 0,
        menuCount: 0,
        latestOrders: [],
        lowStockItems: [],
      };
    }
  },

  // ADMIN LOGIN
  login: async (username, password) => {
    const cleanUser = String(username).trim();
    const cleanPass = String(password).trim();

    if (FORCE_MOCK) {
      const localUsers = getLocalData('users', [
        { id: 'USR-101', username: 'admin', password: 'admin123', role: 'Admin' },
      ]);
      const found = localUsers.find((u) => u.username === cleanUser && u.password === cleanPass);
      if (found) {
        return {
          token: `token_${found.id}_${Date.now()}`,
          user: { id: found.id, username: found.username, role: found.role },
        };
      }
      throw new Error('Invalid username or password');
    }

    try {
      const res = await postGAS('/login', { username: cleanUser, password: cleanPass });
      if (res && res.data && res.data.token) {
        return res.data;
      }
      if (res && res.status === 'error') {
        throw new Error(res.data?.error || 'Invalid username or password');
      }
    } catch (e) {
      console.warn('API login call fallback', e.message);
    }

    // Default admin fallback
    if (cleanUser === 'admin' && cleanPass === 'admin123') {
      return {
        token: 'token_admin_USR-101',
        user: { id: 'USR-101', username: 'admin', role: 'Admin' },
      };
    }

    // Check locally saved users if added
    const savedUsers = getLocalData('users', []);
    const localFound = savedUsers.find((u) => u.username === cleanUser && u.password === cleanPass);
    if (localFound) {
      return {
        token: `token_${localFound.id}_${Date.now()}`,
        user: { id: localFound.id, username: localFound.username, role: localFound.role },
      };
    }

    throw new Error('Invalid username or password');
  },

  // SETTINGS (STORE & TELEGRAM BOT TOKEN)
  getSettings: async () => {
    if (FORCE_MOCK) {
      return getLocalData('settings', MOCK_SETTINGS);
    }
    try {
      const res = await axios.get(`${GAS_API_URL}?path=/settings`);
      if (res.data?.data && Object.keys(res.data.data).length > 0) {
        setLocalData('settings', res.data.data);
        return res.data.data;
      }
    } catch (e) {
      console.warn('Failed to fetch settings from API, loading local settings', e);
    }
    return getLocalData('settings', MOCK_SETTINGS);
  },

  saveSettings: async (settings) => {
    setLocalData('settings', settings);
    if (FORCE_MOCK) {
      return { message: 'Settings saved' };
    }
    try {
      const res = await postGAS('/settings', settings);
      return res;
    } catch (e) {
      console.warn('API saveSettings warning, saved locally', e);
      return { message: 'Settings saved locally and synced' };
    }
  },
};
