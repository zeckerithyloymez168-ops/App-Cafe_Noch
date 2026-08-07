/**
 * Google Apps Script REST API & Telegram Bot Integration
 * Coffee Shop Management System
 * 
 * Instructions:
 * 1. Create a Google Sheet and name the sheets:
 *    - Menu
 *    - Orders
 *    - OrderItems
 *    - Stock
 *    - Users
 *    - Expense
 *    - Settings
 * 2. Paste this code into Extensions > Apps Script.
 * 3. Deploy as Web App:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL into your React .env file as VITE_GAS_API_URL.
 */

// Helper to return formatted JSON responses with CORS headers
function responseJSON(data, status) {
  status = status || 200;
  var output = JSON.stringify({
    status: status === 200 ? "success" : "error",
    code: status,
    data: data
  });
  return ContentService.createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON);
}

// Global Sheets Helper
function getSheet(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    initializeSheetHeaders(sheet, sheetName);
  }
  return sheet;
}

// Automatically create table headers if missing
function initializeSheetHeaders(sheet, sheetName) {
  var headers = [];
  switch (sheetName) {
    case 'Menu':
      headers = ['id', 'name', 'category', 'price', 'image', 'description', 'stock', 'status'];
      break;
    case 'Orders':
      headers = ['order_id', 'customer_name', 'telegram_id', 'order_date', 'total', 'payment_method', 'status'];
      break;
    case 'OrderItems':
      headers = ['order_id', 'menu_id', 'menu_name', 'qty', 'price', 'subtotal'];
      break;
    case 'Stock':
      headers = ['id', 'ingredient', 'qty', 'unit'];
      break;
    case 'Users':
      headers = ['id', 'username', 'password', 'role'];
      break;
    case 'Expense':
      headers = ['id', 'title', 'amount', 'date'];
      break;
    case 'Settings':
      headers = ['shop_name', 'address', 'phone', 'telegram_bot_token', 'chat_id'];
      break;
  }
  if (headers.length > 0 && sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
}

// Convert sheet rows into array of objects
function sheetToObjects(sheetName) {
  var sheet = getSheet(sheetName);
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var result = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    result.push(obj);
  }
  return result;
}

// Handle GET Requests
function doGet(e) {
  try {
    var path = e.parameter.path || '/menu';
    
    switch (path) {
      case '/menu':
        return responseJSON(sheetToObjects('Menu'));
        
      case '/orders':
        var orders = sheetToObjects('Orders');
        var items = sheetToObjects('OrderItems');
        // Group items under each order
        var ordersWithItems = orders.map(function(ord) {
          ord.items = items.filter(function(it) {
            return String(it.order_id) === String(ord.order_id);
          });
          return ord;
        });
        return responseJSON(ordersWithItems.reverse()); // Latest first
        
      case '/stock':
        return responseJSON(sheetToObjects('Stock'));
        
      case '/expenses':
        return responseJSON(sheetToObjects('Expense'));
        
      case '/settings':
        var settings = sheetToObjects('Settings');
        return responseJSON(settings.length > 0 ? settings[0] : {});
        
      case '/dashboard':
        return responseJSON(getDashboardMetrics());
        
      default:
        return responseJSON({ error: "Endpoint not found: " + path }, 404);
    }
  } catch (err) {
    return responseJSON({ error: err.message }, 500);
  }
}

// Handle POST, PUT, DELETE Requests
function doPost(e) {
  try {
    var contents = e.postData ? JSON.parse(e.postData.contents) : {};
    var path = e.parameter.path || contents.path || '/order';
    var action = contents.action || e.parameter.action; // Support method override (PUT/DELETE)

    if (action === 'PUT_MENU' || path === '/menu' && action === 'PUT') {
      return updateMenuItem(contents);
    }
    if (action === 'DELETE_MENU' || path === '/menu' && action === 'DELETE') {
      return deleteMenuItem(contents.id);
    }
    if (action === 'PUT_ORDER_STATUS' || path === '/order-status') {
      return updateOrderStatus(contents.order_id, contents.status);
    }

    switch (path) {
      case '/login':
        return handleLogin(contents.username, contents.password);
        
      case '/order':
        return createOrder(contents);
        
      case '/menu':
        return createMenuItem(contents);
        
      case '/stock':
        return updateOrCreateStock(contents);
        
      case '/expense':
        return createExpense(contents);
        
      case '/settings':
        return saveSettings(contents);
        
      case '/order-status':
        return updateOrderStatus(contents.order_id, contents.status);
        
      default:
        return responseJSON({ error: "Endpoint not found: " + path }, 404);
    }
  } catch (err) {
    return responseJSON({ error: err.message }, 500);
  }
}

// Login Handler
function handleLogin(username, password) {
  var users = sheetToObjects('Users');
  if (users.length === 0) {
    // Seed default admin user if missing
    var usersSheet = getSheet('Users');
    usersSheet.appendRow(['USR-101', 'admin', 'admin123', 'Admin']);
    users = sheetToObjects('Users');
  }
  
  var found = users.find(function(u) {
    return String(u.username).trim() === String(username).trim() && String(u.password).trim() === String(password).trim();
  });
  
  if (found) {
    return responseJSON({
      token: "token_" + found.id + "_" + new Date().getTime(),
      user: { id: found.id, username: found.username, role: found.role }
    });
  } else {
    return responseJSON({ error: "Invalid username or password" }, 401);
  }
}

// Create Order & Send Telegram Notification
function createOrder(orderData) {
  var ordersSheet = getSheet('Orders');
  var itemsSheet = getSheet('OrderItems');
  
  var orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  var orderDate = new Date().toISOString();
  var status = "Pending";
  
  ordersSheet.appendRow([
    orderId,
    orderData.customer_name || 'Guest',
    orderData.telegram_id || '',
    orderDate,
    orderData.total,
    orderData.payment_method || 'Cash',
    status
  ]);
  
  if (orderData.items && Array.isArray(orderData.items)) {
    orderData.items.forEach(function(item) {
      itemsSheet.appendRow([
        orderId,
        item.menu_id || item.id,
        item.name,
        item.qty,
        item.price,
        item.qty * item.price
      ]);
    });
  }
  
  // Telegram Bot Notification to Admin
  sendAdminTelegramNotification(orderId, orderData);
  
  return responseJSON({ order_id: orderId, status: status, message: "Order placed successfully" });
}

// Menu Endpoints
function createMenuItem(item) {
  var sheet = getSheet('Menu');
  var newId = "MNU-" + Math.floor(1000 + Math.random() * 9000);
  sheet.appendRow([
    newId,
    item.name,
    item.category || 'Drinks',
    item.price,
    item.image || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500',
    item.description || '',
    item.stock || 50,
    item.status || 'Active'
  ]);
  return responseJSON({ id: newId, message: "Item added successfully" });
}

function updateMenuItem(item) {
  var sheet = getSheet('Menu');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(item.id)) {
      sheet.getRange(i + 1, 2).setValue(item.name || data[i][1]);
      sheet.getRange(i + 1, 3).setValue(item.category || data[i][2]);
      sheet.getRange(i + 1, 4).setValue(item.price !== undefined ? item.price : data[i][3]);
      sheet.getRange(i + 1, 5).setValue(item.image || data[i][4]);
      sheet.getRange(i + 1, 6).setValue(item.description || data[i][5]);
      sheet.getRange(i + 1, 7).setValue(item.stock !== undefined ? item.stock : data[i][6]);
      sheet.getRange(i + 1, 8).setValue(item.status || data[i][7]);
      return responseJSON({ message: "Menu item updated successfully" });
    }
  }
  return responseJSON({ error: "Item not found" }, 404);
}

function deleteMenuItem(id) {
  var sheet = getSheet('Menu');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return responseJSON({ message: "Item deleted successfully" });
    }
  }
  return responseJSON({ error: "Item not found" }, 404);
}

// Order Status Update & Notification to Customer
function updateOrderStatus(orderId, newStatus) {
  var sheet = getSheet('Orders');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(orderId)) {
      sheet.getRange(i + 1, 7).setValue(newStatus);
      var telegramId = data[i][2]; // Column C: telegram_id
      
      // Notify Customer via Telegram
      if (telegramId) {
        sendCustomerTelegramNotification(telegramId, orderId, newStatus);
      }
      return responseJSON({ message: "Order status updated to " + newStatus });
    }
  }
  return responseJSON({ error: "Order not found" }, 404);
}

// Stock Management
function updateOrCreateStock(stockItem) {
  var sheet = getSheet('Stock');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).toLowerCase() === String(stockItem.ingredient).toLowerCase()) {
      sheet.getRange(i + 1, 3).setValue(stockItem.qty);
      sheet.getRange(i + 1, 4).setValue(stockItem.unit || data[i][3]);
      return responseJSON({ message: "Stock updated successfully" });
    }
  }
  var newId = "STK-" + (data.length);
  sheet.appendRow([newId, stockItem.ingredient, stockItem.qty, stockItem.unit || 'kg']);
  return responseJSON({ id: newId, message: "Stock item added" });
}

// Dashboard Aggregates
function getDashboardMetrics() {
  var orders = sheetToObjects('Orders');
  var menu = sheetToObjects('Menu');
  var stock = sheetToObjects('Stock');
  
  var totalRevenue = 0;
  var todayRevenue = 0;
  var todayOrders = 0;
  var todayStr = new Date().toISOString().split('T')[0];
  
  orders.forEach(function(o) {
    var orderDateStr = new Date(o.order_date).toISOString().split('T')[0];
    var amount = Number(o.total) || 0;
    totalRevenue += amount;
    if (orderDateStr === todayStr) {
      todayRevenue += amount;
      todayOrders += 1;
    }
  });
  
  var lowStock = stock.filter(function(s) { return Number(s.qty) <= 5; });
  
  return {
    totalRevenue: totalRevenue,
    todayRevenue: todayRevenue,
    todayOrders: todayOrders,
    totalOrders: orders.length,
    lowStockCount: lowStock.length,
    menuCount: menu.length,
    latestOrders: orders.slice(-5).reverse(),
    lowStockItems: lowStock
  };
}

// Telegram Helpers
function getTelegramSettings() {
  var settings = sheetToObjects('Settings');
  if (settings.length > 0) {
    return {
      token: settings[0].telegram_bot_token,
      chat_id: settings[0].chat_id
    };
  }
  return { token: '', chat_id: '' };
}

function sendTelegramMessage(botToken, chatId, text) {
  if (!botToken || !chatId) return;
  var url = "https://api.telegram.org/bot" + botToken + "/sendMessage";
  var payload = {
    chat_id: chatId,
    text: text,
    parse_mode: "HTML"
  };
  try {
    UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  } catch(e) {
    Logger.log("Telegram notification failed: " + e.message);
  }
}

function sendAdminTelegramNotification(orderId, orderData) {
  var tg = getTelegramSettings();
  if (!tg.token || !tg.chat_id) return;
  
  var itemsStr = (orderData.items || []).map(function(i) {
    return "• " + i.name + " (x" + i.qty + ") - $" + (i.price * i.qty).toFixed(2);
  }).join("\n");
  
  var msg = "<b>☕ NEW COFFEE ORDER</b>\n\n" +
    "<b>Order ID:</b> <code>" + orderId + "</code>\n" +
    "<b>Customer:</b> " + (orderData.customer_name || 'Guest') + "\n" +
    "<b>Payment:</b> " + (orderData.payment_method || 'Cash') + "\n\n" +
    "<b>Items:</b>\n" + itemsStr + "\n\n" +
    "<b>Total Amount:</b> $" + Number(orderData.total).toFixed(2) + "\n" +
    "<b>Time:</b> " + new Date().toLocaleString();
    
  sendTelegramMessage(tg.token, tg.chat_id, msg);
}

function sendCustomerTelegramNotification(customerId, orderId, newStatus) {
  var tg = getTelegramSettings();
  if (!tg.token || !customerId) return;
  
  var statusEmojis = {
    'Pending': '⏳',
    'Preparing': '☕',
    'Ready': '🔔',
    'Completed': '✅',
    'Cancelled': '❌'
  };
  var emoji = statusEmojis[newStatus] || '📢';
  
  var msg = "<b>" + emoji + " ORDER STATUS UPDATE</b>\n\n" +
    "Your order <code>" + orderId + "</code> status is now: <b>" + newStatus.toUpperCase() + "</b>.\n\n" +
    (newStatus === 'Ready' ? "🎉 Your coffee is ready for pickup/delivery!" : "Thank you for choosing Café Artisanal!");
    
  sendTelegramMessage(tg.token, customerId, msg);
}

function createExpense(data) {
  var sheet = getSheet('Expense');
  var newId = "EXP-" + (sheet.getLastRow());
  sheet.appendRow([newId, data.title, data.amount, data.date || new Date().toISOString().split('T')[0]]);
  return responseJSON({ id: newId, message: "Expense logged" });
}

function saveSettings(data) {
  var sheet = getSheet('Settings');
  sheet.clearContents();
  sheet.appendRow(['shop_name', 'address', 'phone', 'telegram_bot_token', 'chat_id']);
  sheet.appendRow([data.shop_name, data.address, data.phone, data.telegram_bot_token, data.chat_id]);
  return responseJSON({ message: "Settings saved successfully" });
}
