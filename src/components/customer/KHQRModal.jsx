import React, { useState } from 'react';
import { QrCode, CheckCircle2, Copy, Download, X, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

export const KHQRModal = ({ isOpen, onClose, totalAmount, paymentMethod, onConfirmPayment }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const isABA = paymentMethod === 'ABA QR';
  const qrColor = isABA ? 'from-red-600 to-rose-700' : 'from-red-700 to-red-900';

  const mockPayload = `00020101021238580011kh.gov.nbc.bakong0115cafeartisanal@aba02081234567852045999530384054${totalAmount.toFixed(
    2
  )}5802KH5914CAFE ARTISANAL6010PHNOM PENH6304`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mockPayload);
    toast.success('QR payload copied to clipboard!');
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmPayment();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-espresso-light border border-coffee-200 dark:border-coffee-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full text-xs font-bold mb-3 border border-red-200 dark:border-red-800/40">
          <ShieldCheck className="w-4 h-4" />
          <span>{isABA ? 'ABA PAY KHQR' : 'BAKONG KHQR'}</span>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">
          Scan to Pay
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Scan with Bakong, ABA Mobile, or any Cambodian Bank App
        </p>

        {/* QR Code Container */}
        <div className={`relative p-5 rounded-3xl bg-gradient-to-br ${qrColor} shadow-xl mb-4 text-white flex flex-col items-center`}>
          <div className="bg-white p-3 rounded-2xl shadow-inner mb-3">
            {/* SVG QR Code Simulation */}
            <svg className="w-44 h-44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" rx="8" fill="white" />
              {/* Outer corners */}
              <rect x="5" y="5" width="25" height="25" fill="#1E1E1E" rx="3" />
              <rect x="9" y="9" width="17" height="17" fill="white" rx="2" />
              <rect x="13" y="13" width="9" height="9" fill="#B91C1C" rx="1" />
              
              <rect x="70" y="5" width="25" height="25" fill="#1E1E1E" rx="3" />
              <rect x="74" y="9" width="17" height="17" fill="white" rx="2" />
              <rect x="78" y="13" width="9" height="9" fill="#B91C1C" rx="1" />

              <rect x="5" y="70" width="25" height="25" fill="#1E1E1E" rx="3" />
              <rect x="9" y="74" width="17" height="17" fill="white" rx="2" />
              <rect x="13" y="78" width="9" height="9" fill="#B91C1C" rx="1" />

              {/* Data Matrix Dots */}
              <rect x="36" y="8" width="6" height="6" fill="#1E1E1E" />
              <rect x="48" y="8" width="12" height="6" fill="#1E1E1E" />
              <rect x="36" y="20" width="12" height="6" fill="#B91C1C" />
              <rect x="54" y="20" width="8" height="6" fill="#1E1E1E" />
              
              <rect x="8" y="36" width="6" height="12" fill="#1E1E1E" />
              <rect x="20" y="36" width="12" height="6" fill="#1E1E1E" />
              <rect x="38" y="36" width="24" height="24" fill="#B91C1C" rx="4" />
              <rect x="68" y="36" width="8" height="12" fill="#1E1E1E" />

              <rect x="8" y="54" width="12" height="6" fill="#1E1E1E" />
              <rect x="24" y="54" width="6" height="6" fill="#B91C1C" />
              
              <rect x="36" y="70" width="8" height="8" fill="#1E1E1E" />
              <rect x="50" y="70" width="14" height="6" fill="#1E1E1E" />
              <rect x="70" y="70" width="24" height="24" fill="#1E1E1E" rx="4" />
              <circle cx="50" cy="50" r="6" fill="white" />
              <circle cx="50" cy="50" r="4" fill="#B91C1C" />
            </svg>
          </div>

          <div className="text-center">
            <p className="text-[11px] opacity-90 tracking-wide font-medium">TOTAL PAYABLE</p>
            <p className="text-2xl font-black">{formatCurrency(totalAmount)}</p>
            <p className="text-[11px] opacity-80 mt-0.5">≈ {Math.round(totalAmount * 4100).toLocaleString()} KHR</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleCopy}
            className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy Payload
          </button>
        </div>

        {/* Simulate Payment Confirmation */}
        <button
          onClick={handleSimulatePayment}
          disabled={isProcessing}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-98"
        >
          {isProcessing ? (
            <span className="text-sm">Verifying Bakong Transaction...</span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              I Have Paid (Confirm Order)
            </>
          )}
        </button>
      </div>
    </div>
  );
};
