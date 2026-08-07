export const MOCK_MENU = [
  {
    id: 'MNU-101',
    name: 'កាហ្វេការ៉ាមែលម៉ាគីអាតូ (Iced Caramel Macchiato)',
    category: 'កាហ្វេ (Espresso)',
    price: 3.80,
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600&auto=format&fit=crop',
    description: 'កាហ្វេអេសប្រេសសូឆុងស្រស់ជាមួយទឹកដោះគោស្រស់ ទឹកស៊ីរ៉ូវ៉ានីឡា និងស្រោចទឹកសេរ៉ូមការ៉ាមែលឈ្ងុយឆ្ងាញ់។',
    stock: 45,
    status: 'Active',
  },
  {
    id: 'MNU-102',
    name: 'ស្ប៉ានីសឡាតេ (Spanish Latte)',
    category: 'កាហ្វេ (Espresso)',
    price: 3.50,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop',
    description: 'កាហ្វេអេសប្រេសសូឌុបប៊លសុត ជាមួយទឹកដោះគោខាប់ និងទឹកដោះគោស្រស់ក្ដៅ/ត្រជាក់។',
    stock: 60,
    status: 'Active',
  },
  {
    id: 'MNU-103',
    name: 'ម៉ាតឆាគ្រីមហ្វ្រេប (Matcha Cream Frappe)',
    category: 'ភេសជ្ជៈក្រឡុក (Frappe)',
    price: 4.20,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop',
    description: 'ម្សៅតែបៃតងជប៉ុន Uji Premium ក្រឡុកជាមួយទឹកដោះគោ និងគ្របពីលើដោយគ្រីមទន់ល្មើយ។',
    stock: 30,
    status: 'Active',
  },
  {
    id: 'MNU-104',
    name: 'កាហ្វេត្រជាក់ទឹកដោះគោអូត (Cold Brew Oat Latte)',
    category: 'កាហ្វេត្រជាក់ (Cold Brew)',
    price: 4.00,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop',
    description: 'កាហ្វេត្រជាក់ 18 ម៉ោង ឆុងជាមួយទឹកដោះគោស្រូវអូត (Oat Milk Barista Edition)។',
    stock: 25,
    status: 'Active',
  },
  {
    id: 'MNU-105',
    name: 'នំបុ័ងខ្វាសង់ប៊ឺ (Butter Croissant)',
    category: 'នំបុ័ង (Pastry)',
    price: 2.50,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop',
    description: 'នំបុ័ងខ្វាសង់ប៊ឺបារាំងស្រស់ៗ ស្រទាប់ស្រួយ និងឈ្ងុយឆ្ងាញ់ខ្លាំង។',
    stock: 12,
    status: 'Active',
  },
  {
    id: 'MNU-106',
    name: 'ប៉ាស្តាអាវ៉ូកាដូតូស និងពងទា (Avocado Toast & Egg)',
    category: 'អាហារ (Food)',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop',
    description: 'នំបុ័ងស៊ួឌ័រ ជាមួយផ្លែប័រ និងពងមាន់ចំហុយ ព្រមទាំងគ្រឿងទេសប្រចាំហាង។',
    stock: 18,
    status: 'Active',
  },
  {
    id: 'MNU-107',
    name: 'តែឆៃឡាតេ (Dirty Chai Tea Latte)',
    category: 'តែ និងភេសជ្ជៈផ្សេងៗ (Tea)',
    price: 3.90,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop',
    description: 'តែគ្រឿងទេសឆៃ ឆុងបន្ថែមអេសប្រេសសូ ១សុត និងទឹកដោះគោស្រស់។',
    stock: 40,
    status: 'Active',
  },
  {
    id: 'MNU-108',
    name: 'នំទីរ៉ាមីស៊ូ (Tiramisu Cake Slice)',
    category: 'នំបុ័ង (Pastry)',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop',
    description: 'នំទីរ៉ាមីស៊ូអ៊ីតាលី ជ្រលក់កាហ្វេអេសប្រេសសូ និងគ្រីមម៉ាស្កាផូន។',
    stock: 8,
    status: 'Active',
  }
];

export const MOCK_ORDERS = [
  {
    order_id: 'ORD-849201',
    customer_name: 'ម៉េង សុខា (Sokha Meng)',
    telegram_id: '12345678',
    order_date: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    total: 10.80,
    payment_method: 'KHQR',
    status: 'Pending',
    items: [
      { order_id: 'ORD-849201', menu_id: 'MNU-101', menu_name: 'កាហ្វេការ៉ាមែលម៉ាគីអាតូ', qty: 2, price: 3.80, subtotal: 7.60 },
      { order_id: 'ORD-849201', menu_id: 'MNU-105', menu_name: 'នំបុ័ងខ្វាសង់ប៊ឺ', qty: 1, price: 2.50, subtotal: 2.50 }
    ]
  },
  {
    order_id: 'ORD-739102',
    customer_name: 'ចាន់ ណារិទ្ធ (Narith Chan)',
    telegram_id: '87654321',
    order_date: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    total: 8.00,
    payment_method: 'ABA QR',
    status: 'Preparing',
    items: [
      { order_id: 'ORD-739102', menu_id: 'MNU-104', menu_name: 'កាហ្វេត្រជាក់ទឹកដោះគោអូត', qty: 2, price: 4.00, subtotal: 8.00 }
    ]
  },
  {
    order_id: 'ORD-628103',
    customer_name: 'គឹម វណ្ណា (Vanna Kim)',
    telegram_id: '99887766',
    order_date: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    total: 13.90,
    payment_method: 'Cash',
    status: 'Ready',
    items: [
      { order_id: 'ORD-628103', menu_id: 'MNU-103', menu_name: 'ម៉ាតឆាគ្រីមហ្វ្រេប', qty: 1, price: 4.20, subtotal: 4.20 },
      { order_id: 'ORD-628103', menu_id: 'MNU-106', menu_name: 'ប៉ាស្តាអាវ៉ូកាដូតូស', qty: 1, price: 5.50, subtotal: 5.50 },
      { order_id: 'ORD-628103', menu_id: 'MNU-107', menu_name: 'តែឆៃឡាតេ', qty: 1, price: 3.90, subtotal: 3.90 }
    ]
  },
  {
    order_id: 'ORD-517104',
    customer_name: 'លី រតនា (Rathana Ly)',
    telegram_id: '44556677',
    order_date: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    total: 7.00,
    payment_method: 'KHQR',
    status: 'Completed',
    items: [
      { order_id: 'ORD-517104', menu_id: 'MNU-102', menu_name: 'ស្ប៉ានីសឡាតេ', qty: 2, price: 3.50, subtotal: 7.00 }
    ]
  }
];

export const MOCK_STOCK = [
  { id: 'STK-1', ingredient: 'គ្រាប់កាហ្វេអារ៉ាប៊ីកា (Arabica Coffee Beans)', qty: 18.5, unit: 'kg' },
  { id: 'STK-2', ingredient: 'ទឹកដោះគោស្រស់ (Fresh Milk)', qty: 4.0, unit: 'L' }, // Low stock
  { id: 'STK-3', ingredient: 'ទឹកដោះគោខាប់ (Condensed Milk)', qty: 12.0, unit: 'កំប៉ុង' },
  { id: 'STK-4', ingredient: 'ម្សៅតែបៃតងម៉ាតឆា (Uji Matcha Powder)', qty: 2.2, unit: 'kg' }, // Low stock
  { id: 'STK-5', ingredient: 'ទឹកដោះគោស្រូវអូត (Oat Milk Barista Edition)', qty: 15.0, unit: 'L' },
  { id: 'STK-6', ingredient: 'ទឹកស៊ីរ៉ូការ៉ាមែល (Caramel Syrup)', qty: 3.5, unit: 'ដប' }, // Low stock
  { id: 'STK-7', ingredient: 'កែវក្រដាសកាហ្វេ 16oz (Paper Coffee Cups)', qty: 350, unit: 'កែវ' },
];

export const MOCK_EXPENSES = [
  { id: 'EXP-1', title: 'ទិញគ្រាប់កាហ្វេប្រចាំសប្តាហ៍', amount: 180.00, date: '2026-08-01' },
  { id: 'EXP-2', title: 'ទិញទឹកដោះគោស្រស់ និងទឹកដោះគោអូត', amount: 65.50, date: '2026-08-03' },
  { id: 'EXP-3', title: 'ទិញកែវក្រដាស និងទុយោ', amount: 45.00, date: '2026-08-04' },
  { id: 'EXP-4', title: 'បង់ថ្លៃអ៊ីនធឺណិតល្បឿនលឿនប្រចាំខែ', amount: 35.00, date: '2026-08-05' },
];

export const MOCK_SETTINGS = {
  shop_name: 'ហាងកាហ្វេ Café Artisanal',
  address: 'ផ្លូវ ២៤០, រាជធានីភ្នំពេញ, កម្ពុជា',
  phone: '+855 12 345 678',
  telegram_bot_token: '7890123456:AAFx_EXAMPLE_BOT_TOKEN',
  chat_id: '-100123456789',
};
