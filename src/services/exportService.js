import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate } from '../utils/formatters';

export const exportService = {
  // EXPORT TO EXCEL
  exportToExcel: (data, filename = 'Report.xlsx', sheetName = 'Sales') => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      XLSX.writeFile(workbook, filename);
      return true;
    } catch (error) {
      console.error('Excel Export Error:', error);
      throw error;
    }
  },

  // EXPORT ORDERS REPORT TO PDF
  exportOrdersPDF: (orders, title = 'Sales Orders Report') => {
    try {
      const doc = new jsPDF();

      // Header Banner
      doc.setFillColor(135, 77, 41); // Coffee Brown
      doc.rect(0, 0, 210, 28, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text('CAFÉ ARTISANAL', 14, 15);
      doc.setFontSize(10);
      doc.text(`${title} - Generated ${new Date().toLocaleDateString()}`, 14, 22);

      // Summary statistics
      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(11);
      doc.text(`Total Orders: ${orders.length}`, 14, 38);
      doc.text(`Total Revenue: ${formatCurrency(totalRevenue)}`, 140, 38);

      // Table formatting
      const tableData = orders.map((o) => [
        o.order_id,
        o.customer_name || 'Guest',
        formatDate(o.order_date),
        o.payment_method || 'Cash',
        o.status,
        formatCurrency(o.total),
      ]);

      doc.autoTable({
        startY: 45,
        head: [['Order ID', 'Customer', 'Date & Time', 'Payment', 'Status', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [135, 77, 41], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [247, 241, 229] },
      });

      doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`);
      return true;
    } catch (error) {
      console.error('PDF Export Error:', error);
      throw error;
    }
  },

  // EXPORT PROFIT & LOSS REPORT TO PDF
  exportProfitLossPDF: (orders, expenses) => {
    try {
      const doc = new jsPDF();
      
      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
      const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
      const netProfit = totalRevenue - totalExpenses;

      // Header Banner
      doc.setFillColor(45, 21, 9); // Espresso Dark
      doc.rect(0, 0, 210, 30, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text('CAFÉ ARTISANAL - FINANCIAL REPORT', 14, 18);
      doc.setFontSize(10);
      doc.text(`Profit & Loss Statement | Generated: ${new Date().toLocaleDateString()}`, 14, 25);

      // Metrics Cards
      doc.setFillColor(247, 241, 229);
      doc.roundedRect(14, 38, 55, 25, 3, 3, 'F');
      doc.setTextColor(135, 77, 41);
      doc.setFontSize(9);
      doc.text('TOTAL REVENUE', 18, 46);
      doc.setFontSize(13);
      doc.text(formatCurrency(totalRevenue), 18, 56);

      doc.setFillColor(254, 226, 226);
      doc.roundedRect(77, 38, 55, 25, 3, 3, 'F');
      doc.setTextColor(185, 28, 28);
      doc.setFontSize(9);
      doc.text('TOTAL EXPENSES', 81, 46);
      doc.setFontSize(13);
      doc.text(formatCurrency(totalExpenses), 81, 56);

      const isProfit = netProfit >= 0;
      doc.setFillColor(isProfit ? 209 : 254, isProfit ? 250 : 226, isProfit ? 229 : 226);
      doc.roundedRect(140, 38, 56, 25, 3, 3, 'F');
      doc.setTextColor(isProfit ? 4 : 185, isProfit ? 120 : 28, isProfit ? 87 : 28);
      doc.setFontSize(9);
      doc.text('NET PROFIT / (LOSS)', 144, 46);
      doc.setFontSize(13);
      doc.text(formatCurrency(netProfit), 144, 56);

      // Expenses Table
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(12);
      doc.text('Operational Expenses Breakdown', 14, 73);

      const expData = expenses.map((e) => [
        e.id,
        e.title,
        e.date || 'N/A',
        formatCurrency(e.amount),
      ]);

      doc.autoTable({
        startY: 78,
        head: [['ID', 'Expense Title', 'Date', 'Amount']],
        body: expData,
        theme: 'grid',
        headStyles: { fillColor: [135, 77, 41], textColor: 255 },
        styles: { fontSize: 9 },
      });

      doc.save(`Profit_Loss_Report_${Date.now()}.pdf`);
      return true;
    } catch (error) {
      console.error('Profit Loss Export Error:', error);
      throw error;
    }
  },
};
