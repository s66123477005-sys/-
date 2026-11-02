import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Boxes, 
  DollarSign, 
  RotateCcw,
  Calendar,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

interface ReportsViewProps {
  onOpenContinueModal: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onOpenContinueModal }) => {
  const { products, transactions, currentUser } = useInventory();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [reportType, setReportType] = useState<'inventory' | 'movement'>('inventory');

  // Categories calculation
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Filtered products for inventory report
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Aggregated totals
  const totalStockUnits = filteredProducts.reduce((acc, p) => acc + p.currentStock, 0);
  const totalCostValuation = filteredProducts.reduce((acc, p) => acc + (p.currentStock * p.costPrice), 0);
  const totalRetailValuation = filteredProducts.reduce((acc, p) => acc + (p.currentStock * p.sellingPrice), 0);

  // Inbound & Outbound calculations
  const totalInQty = transactions.filter(t => t.type === 'IN').reduce((acc, t) => acc + t.quantity, 0);
  const totalInValue = transactions.filter(t => t.type === 'IN').reduce((acc, t) => acc + t.totalValue, 0);
  const totalOutQty = transactions.filter(t => t.type === 'OUT').reduce((acc, t) => acc + t.quantity, 0);
  const totalOutValue = transactions.filter(t => t.type === 'OUT').reduce((acc, t) => acc + t.totalValue, 0);

  // Category breakdown
  const categorySummary = categories.map(cat => {
    const prods = products.filter(p => p.category === cat);
    const count = prods.length;
    const units = prods.reduce((a, b) => a + b.currentStock, 0);
    const value = prods.reduce((a, b) => a + (b.currentStock * b.costPrice), 0);
    const percentage = totalCostValuation > 0 ? (value / totalCostValuation) * 100 : 0;
    return {
      category: cat,
      productCount: count,
      units,
      value,
      percentage,
    };
  }).sort((a, b) => b.value - a.value);

  // CSV Export handler
  const handleExportCSV = () => {
    let csvContent = '\uFEFF'; // UTF-8 BOM for Thai Excel

    if (reportType === 'inventory') {
      csvContent += 'รหัส SKU,ชื่อสินค้า,หมวดหมู่,ตำแหน่งชั้นวาง,คงเหลือ,หน่วยนับ,ราคาทุน (บาท),มูลค่ารวมราคาทุน,ราคาขาย (บาท),มูลค่ารวมราคาขาย\n';
      filteredProducts.forEach(p => {
        csvContent += `"${p.sku}","${p.name.replace(/"/g, '""')}","${p.category}","${p.shelfLocation}",${p.currentStock},"${p.unit}",${p.costPrice},${p.currentStock * p.costPrice},${p.sellingPrice},${p.currentStock * p.sellingPrice}\n`;
      });
    } else {
      csvContent += 'เลขที่เอกสาร,ประเภท,รหัส SKU,ชื่อสินค้า,จำนวน,ยอดก่อนหน้า,ยอดคงเหลือใหม่,เอกสารอ้างอิง,แผนก/คู่ค้า,ผู้ทำรายการ,วันเวลา\n';
      transactions.forEach(t => {
        csvContent += `"${t.transactionNumber}","${t.type}","${t.sku}","${t.productName.replace(/"/g, '""')}",${t.quantity},${t.beforeStock},${t.afterStock},"${t.referenceNo}","${t.partnerOrDepartment}","${t.operatorName}","${t.timestamp}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `รายงานยอดสินค้า_${new Date().toISOString().substring(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ffc9b6]/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#b83350] mb-1">
            <span className="bg-[#ffb6c1]/25 px-2 py-0.5 rounded border border-[#ffb6c1]/40">
              รายงานยอดสินค้าทั้งหมด
            </span>
            <span>➔</span>
            <span>สรุปข้อมูลเชิงสถิติ</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            รายงานยอดสินค้าทั้งหมด (Inventory & Movement Reports)
          </h1>
          <p className="text-xs text-slate-500">
            วิเคราะห์มูลค่าสินค้าคงคลัง ภาพรวมหมวดหมู่ และสถิติการรับ-จ่ายพัสดุ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenContinueModal}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-[#ffc9b6] hover:bg-[#ffc9b6]/20 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#b83350]" />
            <span>ทำงานต่อ / ออกจากระบบ</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-[#ffc9b6] hover:bg-[#ffc9b6]/20 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#c45229]" />
            <span>ส่งออก CSV (Excel)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-bold text-slate-900 gradient-theme hover:opacity-95 rounded-xl transition-all flex items-center gap-1.5 shadow-xs border border-[#ffb6c1]"
          >
            <Printer className="w-3.5 h-3.5 text-slate-900" />
            <span>พิมพ์รายงาน</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">มูลค่าสต็อกรวม (ราคาทุน)</span>
          <p className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            ฿{totalCostValuation.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {totalStockUnits.toLocaleString()} ชิ้นในคลัง
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">มูลค่าสต็อกประเมิน (ราคาขาย)</span>
          <p className="text-xl font-bold text-indigo-600 font-mono tabular-nums mt-1">
            ฿{totalRetailValuation.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            ส่วนต่างกำไรเบื้องต้น: +฿{(totalRetailValuation - totalCostValuation).toLocaleString()}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>การรับสินค้าเข้าสะสม</span>
            <span className="text-emerald-600 font-bold">+{totalInQty.toLocaleString()} ชิ้น</span>
          </div>
          <p className="text-xl font-bold text-emerald-700 font-mono tabular-nums mt-1">
            ฿{totalInValue.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {transactions.filter(t => t.type === 'IN').length} ธุรกรรม
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>การเบิกจ่ายสินค้าสะสม</span>
            <span className="text-purple-600 font-bold">-{totalOutQty.toLocaleString()} ชิ้น</span>
          </div>
          <p className="text-xl font-bold text-purple-700 font-mono tabular-nums mt-1">
            ฿{totalOutValue.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {transactions.filter(t => t.type === 'OUT').length} ธุรกรรม
          </span>
        </div>
      </div>

      {/* Category Distribution Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          สัดส่วนมูลค่าสินค้าคงคลังจำแนกตามหมวดหมู่ (Category Share)
        </h3>
        <div className="space-y-3">
          {categorySummary.map(item => (
            <div key={item.category} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-800">{item.category} ({item.productCount} รายการ)</span>
                <span className="font-mono text-slate-600 tabular-nums">
                  ฿{item.value.toLocaleString()} ({item.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="gradient-theme h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.max(3, item.percentage)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report View Toggle & Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setReportType('inventory')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              reportType === 'inventory'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            รายงานยอดคงเหลือตามรายการสินค้า
          </button>
          <button
            onClick={() => setReportType('movement')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              reportType === 'movement'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            รายงานบันทึกการเคลื่อนไหวรับ-จ่าย (Audit Log)
          </button>
        </div>

        {reportType === 'inventory' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">กรองหมวดหมู่:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            >
              <option value="all">ทุกหมวดหมู่ ({products.length} รายการ)</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs print-area">
        {reportType === 'inventory' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                  <th className="py-3 px-4">รหัส SKU / บาร์โค้ด</th>
                  <th className="py-3 px-4">ชื่อสินค้า</th>
                  <th className="py-3 px-4">หมวดหมู่</th>
                  <th className="py-3 px-4 text-center">ชั้นวาง</th>
                  <th className="py-3 px-4 text-right">คงเหลือ</th>
                  <th className="py-3 px-4 text-right">ราคาทุน</th>
                  <th className="py-3 px-4 text-right">มูลค่ารวมราคาทุน</th>
                  <th className="py-3 px-4 text-right">ราคาขาย</th>
                  <th className="py-3 px-4 text-right">มูลค่ารวมราคาขาย</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredProducts.map((p) => {
                  const costTotal = p.currentStock * p.costPrice;
                  const sellTotal = p.currentStock * p.sellingPrice;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{p.sku}</td>
                      <td className="py-2.5 px-4 font-sans font-medium text-slate-900">{p.name}</td>
                      <td className="py-2.5 px-4 font-sans text-slate-600">{p.category}</td>
                      <td className="py-2.5 px-4 text-center text-slate-700">{p.shelfLocation}</td>
                      <td className="py-2.5 px-4 text-right font-bold text-slate-900 tabular-nums">
                        {p.currentStock.toLocaleString()} {p.unit}
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-600 tabular-nums">
                        ฿{p.costPrice.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right font-semibold text-slate-900 tabular-nums">
                        ฿{costTotal.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-600 tabular-nums">
                        ฿{p.sellingPrice.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-indigo-700 tabular-nums">
                        ฿{sellTotal.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-300 font-bold text-slate-900">
                  <td colSpan={4} className="py-3 px-4 text-right font-sans">ยอดรวมทั้งสิ้น ({filteredProducts.length} รายการ):</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">{totalStockUnits.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-sans text-slate-400">-</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900">฿{totalCostValuation.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-sans text-slate-400">-</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-indigo-700">฿{totalRetailValuation.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                  <th className="py-3 px-4">เลขที่ธุรกรรม</th>
                  <th className="py-3 px-4">ประเภท</th>
                  <th className="py-3 px-4">สินค้า</th>
                  <th className="py-3 px-4">อ้างอิง (PO/REQ)</th>
                  <th className="py-3 px-4">คู่ค้า / แผนก</th>
                  <th className="py-3 px-4 text-right">จำนวน</th>
                  <th className="py-3 px-4 text-right">คงเหลือหลังทำ</th>
                  <th className="py-3 px-4">ผู้บันทึก</th>
                  <th className="py-3 px-4 text-right">เวลาทำรายการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {transactions.map((tx) => {
                  const isIn = tx.type === 'IN';
                  const isOut = tx.type === 'OUT';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{tx.transactionNumber}</td>
                      <td className="py-2.5 px-4 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          isIn ? 'bg-emerald-50 text-emerald-700' : isOut ? 'bg-purple-50 text-purple-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {isIn ? 'รับเข้า (IN)' : isOut ? 'เบิกออก (OUT)' : 'ปรับปรุง (ADJUST)'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-sans font-medium text-slate-900">{tx.productName}</td>
                      <td className="py-2.5 px-4 text-slate-600">{tx.referenceNo}</td>
                      <td className="py-2.5 px-4 font-sans text-slate-600">{tx.partnerOrDepartment}</td>
                      <td className={`py-2.5 px-4 text-right font-bold tabular-nums ${
                        isIn ? 'text-emerald-600' : isOut ? 'text-purple-600' : 'text-amber-600'
                      }`}>
                        {isIn ? `+${tx.quantity}` : isOut ? `-${tx.quantity}` : tx.quantity}
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-900 font-semibold tabular-nums">{tx.afterStock}</td>
                      <td className="py-2.5 px-4 font-sans text-slate-600">{tx.operatorName}</td>
                      <td className="py-2.5 px-4 text-right text-slate-400">{tx.timestamp}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
