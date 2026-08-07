import React from 'react';
import { STATUS_CONFIG } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export const StatusBadge = ({ status = 'Pending', className }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors',
        config.color,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', config.dot)} />
      {config.label}
    </span>
  );
};
