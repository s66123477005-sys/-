import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  PackagePlus, 
  ArrowDownRight, 
  Save, 
  Printer, 
  CheckCircle2, 
  RotateCcw, 
  Search, 
  FileText, 
  Boxes,
  Truck,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { StockTransaction } from '../types';

interface StockInViewProps {
  onOpenContinueModal: () => void;
}

export const StockInView: React.FC<StockInViewProps> = ({ onOpenContinueModal }) => {
  const { products, recordStockIn, transactions, currentUser } = useInventory();

  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(50);
  const [referenceNo, setReferenceNo] = useState(`PO-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [supplier, setSupplier] = useState('');
  const [unitCost, setUnitCost] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Voucher preview modal state
  const [savedVoucher, setSavedVoucher] = useState<StockTransaction | null>(null);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Auto update supplier & unit cost when product changes
  React.useEffect(() => {
    if (selectedProduct) {
      setSupplier(selectedProduct.supplierName || 'ซัพพลายเออร์ทั่วไป');
      setUnitCost(selectedProduct.costPrice);
    }
  }, [selectedProductId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const tx = recordStockIn({
      productId: selectedProduct.id,
      quantity,
      referenceNo,
      supplier,
      notes,
      unitCost,
    });

    if (tx) {
      setSavedVoucher(tx);
      // Reset form
      setQuantity(10);
      setReferenceNo(`PO-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      setNotes('');
    }
  };

  const filteredSelectableProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  const inboundTransactions = transactions.filter(t => t.type === 'IN');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ffc9b6]/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c45229] mb-1">
            <span className="bg-[#ffc9b6]/35 px-2 py-0.5 rounded border border-[#ffc9b6]">
              บันทึกรายการสินค้าเข้า
            </span>
            <span>➔</span>
            <span>บันทึกข้อมูล (ฐานข้อมูล)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            บันทึกรายการสินค้าเข้า (Goods Receipt / Stock In)
          </h1>
          <p className="text-xs text-slate-500">
            บันทึกการรับสินค้าจากซัพพลายเออร์หรือฝ่ายผลิต เพิ่มยอดสต็อกคงคลังอัตโนมัติ
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form Column (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#ffc9b6]/60 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl gradient-theme flex items-center justify-center text-slate-900 shadow-xs border border-white">
              <PackagePlus className="w-4 h-4 text-slate-900" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">ฟอร์มบันทึกรับสินค้าเข้าคลัง</h2>
              <p className="text-xs text-slate-500">กรอกรายละเอียดเพื่อบันทึกธุรกรรมลงฐานข้อมูล</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                เลือกสินค้าที่รับเข้า *
              </label>
              <div className="mb-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="พิมพ์เพื่อค้นหาชื่อสินค้า หรือ SKU..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <select
                required
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-emerald-600 focus:outline-none text-slate-900 font-medium"
              >
                {filteredSelectableProducts.map(p => (
                  <option key={p.id} value={p.id}>
                    [{p.sku}] {p.name} (คงเหลือ: {p.currentStock} {p.unit} · ชั้นวาง {p.shelfLocation})
                  </option>
                ))}
              </select>
            </div>

            {/* Product Status Snapshot Card */}
            {selectedProduct && (
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {selectedProduct.imageUrl ? (
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-emerald-200 shadow-2xs"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-500">
                      <PackagePlus className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-emerald-950">{selectedProduct.name}</p>
                    <p className="text-[11px] text-emerald-700">
                      รหัส SKU / บาร์โค้ด: <span className="font-mono font-bold text-slate-900">{selectedProduct.sku}</span> · ตำแหน่งจัดเก็บ: <span className="font-mono font-medium">{selectedProduct.shelfLocation}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-500 block">คงเหลือปัจจุบัน</span>
                  <span className="text-xs font-bold font-mono tabular-nums text-slate-900">
                    {selectedProduct.currentStock} {selectedProduct.unit}
                  </span>
                </div>
              </div>
            )}

            {/* Quantity and Unit Cost */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  จำนวนที่รับเข้า *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 text-sm font-mono font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:border-emerald-600 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                    {selectedProduct?.unit || 'หน่วย'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ราคาทุนต่อหน่วย (฿)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={unitCost}
                  onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Reference Number and Supplier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  เลขที่ใบสั่งซื้อ / เอกสารอ้างอิง (PO No.) *
                </label>
                <input
                  type="text"
                  required
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder="เช่น PO-2026-1090"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ผู้จำหน่าย / ซัพพลายเออร์ (Supplier)
                </label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="ชื่อบริษัทหรือโรงงานต้นทาง"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                หมายเหตุการรับเข้า
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ระบุเลขล็อต / ตรวจรับสภาพพัสดุ / หมายเหตุเพิ่มเติม..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-emerald-600 focus:outline-none"
              />
            </div>

            {/* Calculation Preview */}
            {selectedProduct && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-500">ผลลัพธ์การคำนวณสต็อก:</span>
                  <div className="font-mono text-slate-800 mt-0.5">
                    {selectedProduct.currentStock} + {quantity} = <strong className="text-emerald-700 font-bold">{selectedProduct.currentStock + quantity} {selectedProduct.unit}</strong>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">มูลค่ารวมการรับ:</span>
                  <p className="font-mono font-bold text-slate-900">
                    ฿{(quantity * unitCost).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 gradient-theme hover:opacity-95 text-slate-900 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 border border-[#ffb6c1]"
              >
                <Save className="w-4 h-4 text-slate-900" />
                <span>บันทึกข้อมูลสินค้าเข้า (Commit to Database)</span>
              </button>
            </div>
          </form>
        </div>

        {/* History / Slip Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">ประวัติรับสินค้าล่าสุด</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {inboundTransactions.length} รายการ
              </span>
            </div>

            <div className="space-y-3">
              {inboundTransactions.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">ยังไม่มีรายการรับเข้า</p>
              ) : (
                inboundTransactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-emerald-700">
                          {tx.transactionNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">· {tx.referenceNo}</span>
                      </div>
                      <p className="font-medium text-slate-900 truncate mt-0.5">
                        {tx.productName}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        จาก: {tx.partnerOrDepartment}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-emerald-600 block">
                        +{tx.quantity}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {tx.timestamp}
                      </span>
                      <button
                        onClick={() => setSavedVoucher(tx)}
                        className="text-[10px] text-indigo-600 hover:underline block mt-0.5"
                      >
                        ดูใบรับพัสดุ
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Voucher Slip Modal (ใบเสร็จรับสินค้าเข้าคลัง) */}
      {savedVoucher && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 print-area">
            {/* Header of Voucher */}
            <div className="text-center pb-4 mb-4 border-b border-slate-200">
              <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                เอกสารบันทึกข้อมูลเข้าฐานข้อมูลแล้ว
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                ใบสำคัญรับสินค้าเข้าคลัง (Goods Receipt Voucher)
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                เลขที่เอกสาร: {savedVoucher.transactionNumber} · วันที่: {savedVoucher.timestamp}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-3 text-xs text-slate-700 py-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">เอกสารอ้างอิง (PO):</span>
                <span className="font-mono font-semibold">{savedVoucher.referenceNo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">ซัพพลายเออร์:</span>
                <span className="font-medium">{savedVoucher.partnerOrDepartment}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">รายการสินค้า:</span>
                <span className="font-semibold text-slate-900">{savedVoucher.productName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">รหัส SKU / บาร์โค้ด:</span>
                <span className="font-mono font-bold text-slate-900">{savedVoucher.sku}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">จำนวนที่รับเข้า:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  +{savedVoucher.quantity}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">ยอดคงเหลือใหม่ในคลัง:</span>
                <span className="font-mono font-bold text-slate-900">
                  {savedVoucher.afterStock}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">มูลค่ารวม:</span>
                <span className="font-mono font-bold text-slate-900">
                  ฿{savedVoucher.totalValue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">ผู้รับพัสดุ:</span>
                <span>{savedVoucher.operatorName}</span>
              </div>
              {savedVoucher.notes && (
                <div className="py-1 text-slate-500 text-[11px]">
                  <span>หมายเหตุ: </span>
                  <span className="text-slate-700">{savedVoucher.notes}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 mt-2 border-t border-slate-200 flex items-center justify-between no-print">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>พิมพ์ใบสำคัญรับ</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSavedVoucher(null)}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
