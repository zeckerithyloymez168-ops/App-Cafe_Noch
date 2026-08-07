import axios from 'axios';

export const sendDirectTelegramAlert = async (orderId, orderData) => {
  try {
    const savedSettings = localStorage.getItem('app_cafe_settings');
    if (!savedSettings) {
      console.warn('Telegram alert skipped: app_cafe_settings missing in localStorage');
      return;
    }

    const settings = JSON.parse(savedSettings);
    const token = settings.telegram_bot_token;
    const rawChatIds = settings.chat_id;

    if (!token || !rawChatIds) {
      console.warn('Telegram Bot Token or Admin Chat ID missing in settings');
      return;
    }

    const itemsStr = (orderData.items || [])
      .map((i) => `• ${i.name} (x${i.qty}) - $${(i.price * i.qty).toFixed(2)}`)
      .join('\n');

    const msg = `<b>☕ NEW COFFEE ORDER</b>\n\n` +
      `<b>Order ID:</b> <code>${orderId}</code>\n` +
      `<b>Customer:</b> ${orderData.customer_name || 'Guest'}\n` +
      `<b>Payment:</b> ${orderData.payment_method || 'Cash'}\n\n` +
      `<b>Items:</b>\n${itemsStr}\n\n` +
      `<b>Total Amount:</b> $${Number(orderData.total).toFixed(2)}\n` +
      `<b>Time:</b> ${new Date().toLocaleString()}`;

    // Support comma, semicolon, space, or newline delimited Chat IDs
    const chatIds = String(rawChatIds)
      .split(/[,;\s]+/)
      .map((id) => id.trim())
      .filter(Boolean);

    console.log(`Sending Telegram alert to ${chatIds.length} recipient(s):`, chatIds);

    const requests = chatIds.map((chatId) => {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      return axios.post(url, {
        chat_id: chatId,
        text: msg,
        parse_mode: 'HTML',
      }).then(() => {
        console.log(`✅ Alert sent to Telegram Chat ID: ${chatId}`);
      }).catch((err) => {
        console.error(`❌ Failed to send alert to Chat ID: ${chatId}`, err.response?.data || err.message);
      });
    });

    await Promise.allSettled(requests);
  } catch (e) {
    console.error('Error in sendDirectTelegramAlert:', e);
  }
};
