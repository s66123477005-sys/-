import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  PackageMinus, 
  ArrowUpRight, 
  Save, 
  Printer, 
  AlertTriangle, 
  RotateCcw, 
  Search, 
  FileText, 
  Building,
  CheckCircle2,
  Users
} from 'lucide-react';
import { StockTransaction } from '../types';

interface StockOutViewProps {
  onOpenContinueModal: () => void;
}

const DEPARTMENTS = [
  'หน้าร้านสาขาหลัก (จัดวางโชว์ & จำหน่ายหน้าร้าน)',
  'แผนกจัดช่อของขวัญ & รับปริญญา',
  'แผนกแพ็คส่งออนไลน์ (Shopee / TikTok / LINE Shop)',
  'ฝ่ายออกบูธ & งานเทศกาลของขวัญ',
  'ฝ่ายสินค้าตัวอย่าง & รีวิวสตูดิโอ',
];

export const StockOutView: React.FC<StockOutViewProps> = ({ onOpenContinueModal }) => {
  const { products, recordStockOut, transactions, currentUser } = useInventory();

  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(5);
  const [referenceNo, setReferenceNo] = useState(`REQ-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [notes, setNotes] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Voucher preview modal state
  const [savedVoucher, setSavedVoucher] = useState<StockTransaction | null>(null);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedProduct) return;

    if (quantity > selectedProduct.currentStock) {
      setErrorMessage(`ไม่สามารถเบิกได้: สินค้ามีเพียง ${selectedProduct.currentStock} ${selectedProduct.unit} (ขอเบิก ${quantity})`);
      return;
    }

    const result = recordStockOut({
      productId: selectedProduct.id,
      quantity,
      referenceNo,
      department,
      notes,
    });

    if (result.success && result.transaction) {
      setSavedVoucher(result.transaction);
      // Reset form
      setQuantity(1);
      setReferenceNo(`REQ-2026-${Math.floor(100 + Math.random() * 900)}`);
      setNotes('');
    } else {
      setErrorMessage(result.error || 'เกิดข้อผิดพลาดในการบันทึกการเบิก');
    }
  };

  const filteredSelectableProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  const outboundTransactions = transactions.filter(t => t.type === 'OUT');
  const isStockInsufficient = selectedProduct ? quantity > selectedProduct.currentStock : false;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ffc9b6]/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#b83350] mb-1">
            <span className="bg-[#ffb6c1]/25 px-2 py-0.5 rounded border border-[#ffb6c1]/40">
              บันทึกสินค้าเบิกออกจากคลัง
            </span>
            <span>➔</span>
            <span>บันทึกข้อมูล (ฐานข้อมูล)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            บันทึกสินค้าเบิกออกจากคลัง (Goods Issue / Stock Out)
          </h1>
          <p className="text-xs text-slate-500">
            บันทึกการจ่ายพัสดุและอะไหล่ตามใบเบิก ตรวจสอบยอดคงคลังก่อนตัดสต็อก
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
              <PackageMinus className="w-4 h-4 text-slate-900" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">ฟอร์มบันทึกการเบิกสินค้า</h2>
              <p className="text-xs text-slate-500">ตรวจสอบความพร้อมของสินค้าก่อนยืนยันการตัดสต็อก</p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                เลือกสินค้าที่จะเบิกจ่าย *
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
                onChange={(e) => handleProductSelect(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-purple-600 focus:outline-none text-slate-900 font-medium"
              >
                {filteredSelectableProducts.map(p => (
                  <option key={p.id} value={p.id}>
                    [{p.sku}] {p.name} (คงเหลือ: {p.currentStock} {p.unit} · ชั้นวาง {p.shelfLocation})
                  </option>
                ))}
              </select>
            </div>

            {/* Product Stock Card */}
            {selectedProduct && (
              <div className="p-3 bg-[#ffb6c1]/20 rounded-xl border border-[#ffb6c1]/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {selectedProduct.imageUrl ? (
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#ffb6c1] shadow-2xs"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#ffb6c1]/50 flex items-center justify-center shrink-0 text-[#b83350]">
                      <PackageMinus className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-slate-900">{selectedProduct.name}</p>
                    <p className="text-[11px] text-slate-600">
                      รหัส SKU / บาร์โค้ด: <span className="font-mono font-bold text-[#b83350]">{selectedProduct.sku}</span> · ตำแหน่ง: <span className="font-mono font-medium">{selectedProduct.shelfLocation}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-500 block">คงเหลือที่เบิกได้</span>
                  <span className={`text-xs font-bold font-mono tabular-nums ${selectedProduct.currentStock === 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {selectedProduct.currentStock} {selectedProduct.unit}
                  </span>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                จำนวนที่ต้องการเบิก *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={selectedProduct?.currentStock || 9999}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                  className={`w-full px-3 py-2 text-sm font-mono font-semibold bg-slate-50 border rounded-lg focus:outline-none ${
                    isStockInsufficient 
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-200' 
                      : 'border-slate-200 focus:border-purple-600'
                  }`}
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                  {selectedProduct?.unit || 'หน่วย'}
                </span>
              </div>
              {isStockInsufficient && (
                <p className="text-[11px] text-rose-600 mt-1">
                  * ปริมาณขอเบิกเกินจำนวนคงเหลือในคลัง ({selectedProduct?.currentStock} {selectedProduct?.unit})
                </p>
              )}
            </div>

            {/* Reference No and Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  เลขที่ใบขอเบิก (Requisition No.) *
                </label>
                <input
                  type="text"
                  required
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder="เช่น REQ-2026-095"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  แผนก / หน่วยงานที่เบิก *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-purple-600 focus:outline-none"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                วัตถุประสงค์การเบิก / หมายเหตุ
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="เช่น เบิกประกอบคำสั่งซื้อเลขที่ SO-8812 / ใช้งานเปลี่ยนอะไหล่ฉุกเฉิน..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-purple-600 focus:outline-none"
              />
            </div>

            {/* Calculation Preview */}
            {selectedProduct && !isStockInsufficient && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-500">ผลลัพธ์การตัดสต็อก:</span>
                  <div className="font-mono text-slate-800 mt-0.5">
                    {selectedProduct.currentStock} - {quantity} = <strong className="text-purple-700 font-bold">{selectedProduct.currentStock - quantity} {selectedProduct.unit}</strong>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">มูลค่าพัสดุที่เบิก:</span>
                  <p className="font-mono font-bold text-slate-900">
                    ฿{(quantity * selectedProduct.costPrice).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isStockInsufficient || (selectedProduct?.currentStock ?? 0) <= 0}
                className="w-full py-3 px-4 gradient-theme hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 border border-[#ffb6c1]"
              >
                <Save className="w-4 h-4 text-slate-900" />
                <span>บันทึกการเบิกสินค้า (Commit to Database)</span>
              </button>
            </div>
          </form>
        </div>

        {/* History / Slip Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">ประวัติการเบิกจ่ายล่าสุด</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {outboundTransactions.length} รายการ
              </span>
            </div>

            <div className="space-y-3">
              {outboundTransactions.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">ยังไม่มีรายการเบิกจ่าย</p>
              ) : (
                outboundTransactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-lg border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-purple-700">
                          {tx.transactionNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">· {tx.referenceNo}</span>
                      </div>
                      <p className="font-medium text-slate-900 truncate mt-0.5">
                        {tx.productName}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        แผนก: {tx.partnerOrDepartment}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-purple-600 block">
                        -{tx.quantity}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {tx.timestamp}
                      </span>
                      <button
                        onClick={() => setSavedVoucher(tx)}
                        className="text-[10px] text-indigo-600 hover:underline block mt-0.5"
                      >
                        ดูใบเบิกพัสดุ
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Voucher Slip Modal (ใบสำคัญจ่ายสินค้าออกจากคลัง) */}
      {savedVoucher && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 print-area">
            {/* Header of Voucher */}
            <div className="text-center pb-4 mb-4 border-b border-slate-200">
              <span className="text-[10px] font-mono text-purple-700 font-bold uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                เอกสารบันทึกตัดสต็อกฐานข้อมูลแล้ว
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                ใบสำคัญจ่ายพัสดุ (Goods Issue Voucher)
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                เลขที่เอกสาร: {savedVoucher.transactionNumber} · วันที่: {savedVoucher.timestamp}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-3 text-xs text-slate-700 py-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">เลขที่ใบขอเบิก:</span>
                <span className="font-mono font-semibold">{savedVoucher.referenceNo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">แผนกที่ขอเบิก:</span>
                <span className="font-medium text-slate-900">{savedVoucher.partnerOrDepartment}</span>
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
                <span className="text-slate-500">จำนวนที่เบิกจ่าย:</span>
                <span className="font-mono font-bold text-purple-700 text-sm">
                  -{savedVoucher.quantity}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">ยอดคงเหลือในคลังหลังเบิก:</span>
                <span className="font-mono font-bold text-slate-900">
                  {savedVoucher.afterStock}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">เจ้าหน้าที่คลังผู้จ่าย:</span>
                <span>{savedVoucher.operatorName}</span>
              </div>
              {savedVoucher.notes && (
                <div className="py-1 text-slate-500 text-[11px]">
                  <span>วัตถุประสงค์: </span>
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
                <span>พิมพ์ใบสำคัญจ่าย</span>
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
