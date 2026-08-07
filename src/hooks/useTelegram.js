import { useEffect, useState } from 'react';

export function useTelegram() {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const webapp = window.Telegram.WebApp;
      webapp.ready();
      webapp.expand();
      setTg(webapp);
      if (webapp.initDataUnsafe && webapp.initDataUnsafe.user) {
        setUser(webapp.initDataUnsafe.user);
      }
    }
  }, []);

  const onClose = () => {
    tg?.close();
  };

  const triggerHaptic = (style = 'medium') => {
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(style);
    }
  };

  return {
    tg,
    user: user || {
      id: '12345678',
      first_name: 'Sokha',
      last_name: 'Meng',
      username: 'sokhameng',
    },
    onClose,
    triggerHaptic,
    isInTelegram: !!window.Telegram?.WebApp?.initData,
  };
}
