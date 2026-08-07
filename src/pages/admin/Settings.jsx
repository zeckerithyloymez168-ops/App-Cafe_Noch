import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Send, BarChart, ExternalLink, CheckCircle } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { data: settingsData, loading, refetch } = useApi(api.getSettings);

  const [activeTab, setActiveTab] = useState('general'); // general | looker
  const [formData, setFormData] = useState({
    shop_name: 'Café Artisanal',
    address: 'Street 240, Phnom Penh, Cambodia',
    phone: '+855 12 345 678',
    telegram_bot_token: '',
    chat_id: '',
  });

  useEffect(() => {
    if (settingsData) {
      setFormData({
        shop_name: settingsData.shop_name || 'Café Artisanal',
        address: settingsData.address || '',
        phone: settingsData.phone || '',
        telegram_bot_token: settingsData.telegram_bot_token || '',
        chat_id: settingsData.chat_id || '',
      });
    }
  }, [settingsData]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.saveSettings(formData);
      toast.success('Shop settings & Telegram configuration saved');
      refetch();
    } catch (e) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Store Settings & Analytics</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure shop details, Telegram Bot credentials, and Looker Studio integration
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-coffee-200 dark:border-coffee-800/40 pb-2">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
            activeTab === 'general'
              ? 'bg-coffee-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-coffee-100 dark:hover:bg-espresso-light'
          }`}
        >
          General & Telegram Bot
        </button>
        <button
          onClick={() => setActiveTab('looker')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'looker'
              ? 'bg-coffee-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-coffee-100 dark:hover:bg-espresso-light'
          }`}
        >
          <BarChart className="w-3.5 h-3.5" />
          <span>Google Looker Studio Integration</span>
        </button>
      </div>

      {activeTab === 'general' ? (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Shop Information Card */}
          <div className="glass-card rounded-3xl p-6 border border-coffee-200/50 dark:border-coffee-800/40 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Shop Profile Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Shop Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.shop_name}
                  onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Phone Contact
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Shop Address
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800"
              />
            </div>
          </div>

          {/* Telegram Bot Credentials Card */}
          <div className="glass-card rounded-3xl p-6 border border-coffee-200/50 dark:border-coffee-800/40 space-y-4">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-sky-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Telegram Bot API Integration
              </h3>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Telegram Bot Token
              </label>
              <input
                type="password"
                value={formData.telegram_bot_token}
                onChange={(e) => setFormData({ ...formData, telegram_bot_token: e.target.value })}
                placeholder="7890123456:AAFx_EXAMPLE_BOT_TOKEN"
                className="w-full px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs font-mono border border-coffee-200 dark:border-coffee-800"
              />
              <p className="text-[10px] text-slate-400 mt-1">Obtained from @BotFather in Telegram</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Admin Chat ID
              </label>
              <input
                type="text"
                value={formData.chat_id}
                onChange={(e) => setFormData({ ...formData, chat_id: e.target.value })}
                placeholder="-100123456789"
                className="w-full px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs font-mono border border-coffee-200 dark:border-coffee-800"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Chat ID where instant new order alerts are sent
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3.5 bg-coffee-600 hover:bg-coffee-700 text-white font-extrabold rounded-2xl shadow-xl shadow-coffee-600/30 flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configurations</span>
          </button>
        </form>
      ) : (
        /* Looker Studio Setup Guide Tab */
        <div className="glass-card rounded-3xl p-6 border border-coffee-200/50 dark:border-coffee-800/40 space-y-6">
          <div className="flex items-center justify-between border-b border-coffee-100 dark:border-coffee-800/40 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Google Looker Studio Connection Guide
              </h3>
              <p className="text-xs text-slate-500">
                Visualize Google Sheets sales data in executive dashboards
              </p>
            </div>
            <a
              href="https://lookerstudio.google.com/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
            >
              <span>Open Looker Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-coffee-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Create Blank Report</h4>
                <p className="text-slate-500">
                  Open Looker Studio and click <strong>Create &gt; Blank Report</strong>. Select <strong>Google Sheets</strong> as the data source connector.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-coffee-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Select Database Sheets</h4>
                <p className="text-slate-500">
                  Choose your Coffee Shop Google Sheet and select the <strong>Orders</strong> worksheet as the primary table. Add <strong>OrderItems</strong> and <strong>Stock</strong> as secondary blended sources.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-coffee-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Add Recommended Visual Widgets</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-500">
                  <li>Scorecard: Total Revenue (SUM of <code>total</code>)</li>
                  <li>Scorecard: Total Orders (COUNT of <code>order_id</code>)</li>
                  <li>Time Series Area Chart: Revenue Trend over <code>order_date</code></li>
                  <li>Pie Chart / Bar Chart: Orders breakdown by <code>payment_method</code> and <code>status</code></li>
                  <li>Table: Low stock ingredients from <code>Stock</code> sheet</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
