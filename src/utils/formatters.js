export const formatCurrency = (amount, currency = 'USD') => {
  const num = Number(amount) || 0;
  if (currency === 'KHR') {
    return `${Math.round(num * 4100).toLocaleString()} ៛`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('km-KH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('km-KH', { month: 'short', day: 'numeric' });
};

export const STATUS_CONFIG = {
  Pending: {
    label: 'រង់ចាំពិនិត្យ (Pending)',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    dot: 'bg-amber-500',
  },
  Preparing: {
    label: 'កំពុងឆុង (Preparing)',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    dot: 'bg-blue-500',
  },
  Ready: {
    label: 'ឆុងរួចរាល់ (Ready)',
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    dot: 'bg-emerald-500',
  },
  Completed: {
    label: 'បានបញ្ចប់ (Completed)',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700',
    dot: 'bg-gray-500',
  },
  Cancelled: {
    label: 'បានបោះបង់ (Cancelled)',
    color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-300 dark:border-rose-700',
    dot: 'bg-rose-500',
  },
};
