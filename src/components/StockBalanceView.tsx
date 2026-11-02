import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Boxes, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  History, 
  SlidersHorizontal, 
  ArrowDownRight, 
  ArrowUpRight, 
  RotateCcw,
  X,
  FileSpreadsheet,
  MapPin,
  Barcode
} from 'lucide-react';
import { Product, StockTransaction } from '../types';

interface StockBalanceViewProps {
  onOpenContinueModal: () => void;
}

export const StockBalanceView: React.FC<StockBalanceViewProps> = ({ onOpenContinueModal }) => {
  const { products, transactions, adjustStock, currentUser } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low' | 'out' | 'normal'>('all');
  const [shelfFilter, setShelfFilter] = useState<string>('all');

  // Ledger modal
  const [selectedProductForLedger, setSelectedProductForLedger] = useState<Product | null>(null);

  // Stock Adjustment modal
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [newCount, setNewCount] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState('ตรวจนับสินค้าประจำงวด (Physical Stock Audit)');

  const shelves = Array.from(new Set(products.map(p => p.shelfLocation.split('-')[0]))).sort();

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery) ||
      p.shelfLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesShelf = shelfFilter === 'all' || p.shelfLocation.startsWith(shelfFilter);

    let matchesStatus = true;
    if (statusFilter === 'low') {
      matchesStatus = p.currentStock <= p.minStockLevel && p.currentStock > 0;
    } else if (statusFilter === 'out') {
      matchesStatus = p.currentStock === 0;
    } else if (statusFilter === 'normal') {
      matchesStatus = p.currentStock > p.minStockLevel;
    }

    return matchesSearch && matchesShelf && matchesStatus;
  });

  const lowCount = products.filter(p => p.currentStock <= p.minStockLevel && p.currentStock > 0).length;
  const outCount = products.filter(p => p.currentStock === 0).length;

  const handleOpenAdjust = (product: Product) => {
    setAdjustingProduct(product);
    setNewCount(product.currentStock);
    setAdjustReason('ตรวจนับสินค้าจริงพบยอดไม่ตรง (Physical Count Discrepancy)');
  };

  const handleSaveAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;
    adjustStock(adjustingProduct.id, newCount, adjustReason);
    setAdjustingProduct(null);
  };

  // Get product ledger transactions
  const productTransactions = selectedProductForLedger 
    ? transactions.filter(t => t.productId === selectedProductForLedger.id)
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ffc9b6]/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c45229] mb-1">
            <span className="bg-[#ffc9b6]/35 px-2 py-0.5 rounded border border-[#ffc9b6]">
              ค้นหา ตรวจสอบสินค้าคงเหลือ
            </span>
            <span>➔</span>
            <span>ตรวจสอบสต็อก & ชั้นวาง</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            ค้นหา ตรวจสอบสินค้าคงเหลือ (Stock Balance & On-Hand Audit)
          </h1>
          <p className="text-xs text-slate-500">
            ตรวจสอบตำแหน่งชั้นวาง ระดับสต็อกขั้นต่ำ และประวัติการเคลื่อนไหวของสินค้า
          </p>
        </div>

        <button
          onClick={onOpenContinueModal}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-[#ffc9b6] hover:bg-[#ffc9b6]/20 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#b83350]" />
          <span>ทำงานต่อ / ออกจากระบบ</span>
        </button>
      </div>

      {/* Filter and Status Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#ffc9b6]/60 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#c45229]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหารหัส SKU, ชื่อสินค้า, บาร์โค้ด หรือชั้นวาง..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffb6c1] focus:border-[#ffb6c1] text-slate-900"
            />
          </div>

          {/* Shelf zone filter */}
          <div className="flex items-center gap-2">
            <select
              value={shelfFilter}
              onChange={(e) => setShelfFilter(e.target.value)}
              className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ffb6c1] focus:border-[#ffb6c1]"
            >
              <option value="all">ทุกโซนคลังสินค้า (Zone A - F)</option>
              {shelves.map(s => (
                <option key={s} value={s}>โซน {s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status segmented filters */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
          <span className="text-xs text-slate-400 mr-1">สถานะ:</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-xs rounded-xl font-bold transition-all ${
              statusFilter === 'all'
                ? 'gradient-theme text-slate-900 border border-[#ffb6c1] shadow-xs'
                : 'text-slate-600 hover:bg-[#ffc9b6]/20'
            }`}
          >
            ทั้งหมด ({products.length})
          </button>
          <button
            onClick={() => setStatusFilter('low')}
            className={`px-3 py-1 text-xs rounded-xl font-bold transition-all ${
              statusFilter === 'low'
                ? 'gradient-theme text-slate-900 border border-[#ffb6c1] shadow-xs'
                : 'text-[#b83350] hover:bg-[#ffb6c1]/20'
            }`}
          >
            ใกล้หมดขั้นต่ำ ({lowCount})
          </button>
          <button
            onClick={() => setStatusFilter('out')}
            className={`px-3 py-1 text-xs rounded-xl font-bold transition-all ${
              statusFilter === 'out'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            สินค้าหมดคลัง ({outCount})
          </button>
          <button
            onClick={() => setStatusFilter('normal')}
            className={`px-3 py-1 text-xs rounded-xl font-bold transition-all ${
              statusFilter === 'normal'
                ? 'gradient-theme text-slate-900 border border-[#ffb6c1] shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            สต็อกปกติ ({products.length - lowCount - outCount})
          </button>
        </div>
      </div>

      {/* Inventory Balance Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <th className="py-3 px-4">รหัส SKU / บาร์โค้ด & ชั้นวาง</th>
                <th className="py-3 px-4">ชื่อสินค้า & หมวดหมู่</th>
                <th className="py-3 px-4 text-center">ระดับขั้นต่ำ</th>
                <th className="py-3 px-4 text-right">คงเหลือปัจจุบัน</th>
                <th className="py-3 px-4 text-center">สถานะสต็อก</th>
                <th className="py-3 px-4 text-right">มูลค่าคงเหลือ</th>
                <th className="py-3 px-4 text-center">การตรวจสอบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Boxes className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-slate-600">ไม่พบรายการตามเงื่อนไข</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOut = p.currentStock === 0;
                  const isLow = p.currentStock <= p.minStockLevel && !isOut;
                  const totalValue = p.currentStock * p.costPrice;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#ffb6c1]/20 border border-[#ffb6c1]/40 font-mono font-bold text-slate-900 text-xs">
                          <Barcode className="w-3.5 h-3.5 text-[#b83350] shrink-0" />
                          <span>{p.sku || p.barcode}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="font-mono">{p.shelfLocation}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-xl object-cover shrink-0 border border-[#ffc9b6]/60 shadow-2xs"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                              <Boxes className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900">{p.name}</p>
                            <p className="text-[11px] text-slate-400">{p.category}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-600">
                        {p.minStockLevel} {p.unit}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        <span className={`text-sm font-bold ${
                          isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-900'
                        }`}>
                          {p.currentStock.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-500 ml-1">{p.unit}</span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        {isOut ? (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            สินค้าหมด
                          </span>
                        ) : isLow ? (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            ต่ำกว่าเกณฑ์
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ปกติ
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-800 font-medium">
                        ฿{totalValue.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedProductForLedger(p)}
                            className="px-2.5 py-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                            title="ดูประวัติการเคลื่อนไหว (Ledger)"
                          >
                            <History className="w-3.5 h-3.5" />
                            <span>ประวัติ</span>
                          </button>

                          <button
                            onClick={() => handleOpenAdjust(p)}
                            className="px-2.5 py-1 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                            title="ปรับยอดสต็อกจริง (Physical Count Adjustment)"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span>ปรับยอด</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Ledger Timeline Modal */}
      {selectedProductForLedger && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    สมุดบัญชีคุมสต็อกสินค้า (Stock Movement Ledger)
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedProductForLedger.name} (รหัส SKU / บาร์โค้ด: <span className="font-mono font-bold text-slate-700">{selectedProductForLedger.sku}</span>)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProductForLedger(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Quick Stats */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl mb-4 text-xs">
              <div>
                <span className="text-slate-500">ตำแหน่งจัดเก็บ:</span>
                <p className="font-mono font-bold text-slate-800">{selectedProductForLedger.shelfLocation}</p>
              </div>
              <div>
                <span className="text-slate-500">ยอดคงเหลือปัจจุบัน:</span>
                <p className="font-mono font-bold text-indigo-600">{selectedProductForLedger.currentStock} {selectedProductForLedger.unit}</p>
              </div>
              <div>
                <span className="text-slate-500">ราคาทุน:</span>
                <p className="font-mono font-bold text-slate-800">฿{selectedProductForLedger.costPrice.toLocaleString()}</p>
              </div>
            </div>

            {/* Transaction Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                ประวัติรายการเข้า-ออก-ปรับยอดในฐานข้อมูล
              </h4>

              {productTransactions.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">ไม่มีประวัติรายการเคลื่อนไหว</p>
              ) : (
                <div className="space-y-2">
                  {productTransactions.map((tx) => {
                    const isIn = tx.type === 'IN';
                    const isOut = tx.type === 'OUT';

                    return (
                      <div
                        key={tx.id}
                        className="p-3 rounded-lg border border-slate-100 bg-white flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                              isIn
                                ? 'bg-emerald-50 text-emerald-600'
                                : isOut
                                ? 'bg-purple-50 text-purple-600'
                                : 'bg-amber-50 text-amber-600'
                            }`}
                          >
                            {isIn ? (
                              <ArrowDownRight className="w-4 h-4" />
                            ) : isOut ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <SlidersHorizontal className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900">
                                {tx.transactionNumber}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                ({tx.referenceNo})
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {tx.partnerOrDepartment} · โดย {tx.operatorName}
                            </p>
                            {tx.notes && (
                              <p className="text-[10px] text-slate-400 mt-0.5">{tx.notes}</p>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`font-mono font-bold ${
                              isIn ? 'text-emerald-600' : isOut ? 'text-purple-600' : 'text-amber-600'
                            }`}
                          >
                            {isIn ? `+${tx.quantity}` : isOut ? `-${tx.quantity}` : `ปรับ ${tx.quantity}`}
                          </span>
                          <p className="text-[10px] text-slate-400 font-mono">
                            คงเหลือ: {tx.afterStock} {selectedProductForLedger.unit}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {tx.timestamp}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedProductForLedger(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal (Audit Discrepancy) */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">ปรับยอดสต็อกจริงจากการตรวจนับ</h3>
              </div>
              <button
                onClick={() => setAdjustingProduct(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjust} className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-900">{adjustingProduct.name}</p>
                <p className="text-[11px] text-slate-500">
                  รหัส SKU / บาร์โค้ด: <span className="font-mono font-bold text-slate-900">{adjustingProduct.sku}</span> · ปัจจุบันในระบบ: <strong className="font-mono text-slate-800">{adjustingProduct.currentStock} {adjustingProduct.unit}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ยอดตรวจนับได้จริง (Physical Stock Count) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newCount}
                  onChange={(e) => setNewCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg focus:border-amber-600 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  ผลต่างสต็อก: {newCount - adjustingProduct.currentStock > 0 ? `+${newCount - adjustingProduct.currentStock}` : newCount - adjustingProduct.currentStock} {adjustingProduct.unit}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  เหตุผลการปรับปรุงยอด *
                </label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="เช่น ตรวจนับประจำไตรมาส, สินค้าชำรุด, สินค้าสูญหาย"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
                >
                  บันทึกปรับยอดลงฐานข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
