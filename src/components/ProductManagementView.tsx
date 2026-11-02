import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  PackageSearch, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Boxes, 
  Tag, 
  Layers, 
  RotateCcw,
  Barcode,
  LayoutGrid,
  List,
  Eye,
  Sparkles,
  Image as ImageIcon,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { SAMPLE_DOLL_PHOTOS } from '../data/mockData';

interface ProductManagementViewProps {
  onOpenContinueModal: () => void;
}

const CATEGORIES: ProductCategory[] = [
  'ตุ๊กตาหมีและสัตว์ขนปุย',
  'ตุ๊กตาคาแรคเตอร์ & อนิเมะ',
  'ตุ๊กตาผ้าฝ้ายแฮนด์เมด',
  'พวงกุญแจตุ๊กตา & กระเป๋า',
  'ชุดของขวัญ & ช่อดอกไม้ตุ๊กตา',
  'เสื้อผ้าตุ๊กตา & อุปกรณ์ตกแต่ง',
];

export const ProductManagementView: React.FC<ProductManagementViewProps> = ({ onOpenContinueModal }) => {
  const { products, addProduct, updateProduct, deleteProduct, currentUser } = useInventory();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'normal'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewDoll, setPreviewDoll] = useState<Product | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    sku: '',
    barcode: '',
    name: '',
    category: 'ตุ๊กตาหมีและสัตว์ขนปุย' as ProductCategory,
    unit: 'ตัว',
    costPrice: 0,
    sellingPrice: 0,
    currentStock: 0,
    minStockLevel: 10,
    maxStockLevel: 200,
    shelfLocation: 'โซน A-01 (หน้าร้าน)',
    description: '',
    supplierName: '',
    imageUrl: SAMPLE_DOLL_PHOTOS[0].imageUrl,
  });

  const handleOpenAdd = () => {
    const nextCode = `DOL-${Date.now().toString().slice(-6)}`;
    setEditingProduct(null);
    setFormData({
      sku: nextCode,
      barcode: nextCode,
      name: '',
      category: 'ตุ๊กตาหมีและสัตว์ขนปุย',
      unit: 'ตัว',
      costPrice: 200,
      sellingPrice: 450,
      currentStock: 20,
      minStockLevel: 5,
      maxStockLevel: 100,
      shelfLocation: 'โซน A-01 (หน้าร้าน)',
      description: '',
      supplierName: 'โรงงานตัดเย็บตุ๊กตาสยามพลัช',
      imageUrl: SAMPLE_DOLL_PHOTOS[0].imageUrl,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    const unifiedCode = product.sku || product.barcode;
    setEditingProduct(product);
    setFormData({
      sku: unifiedCode,
      barcode: unifiedCode,
      name: product.name,
      category: product.category,
      unit: product.unit,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      currentStock: product.currentStock,
      minStockLevel: product.minStockLevel,
      maxStockLevel: product.maxStockLevel,
      shelfLocation: product.shelfLocation,
      description: product.description || '',
      supplierName: product.supplierName || '',
      imageUrl: product.imageUrl || SAMPLE_DOLL_PHOTOS[0].imageUrl,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    setIsModalOpen(false);
  };

  // Filtered products list
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery) ||
      p.shelfLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = p.currentStock <= p.minStockLevel;
    } else if (stockFilter === 'normal') {
      matchesStock = p.currentStock > p.minStockLevel;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ffc9b6]/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#b83350] mb-1">
            <span className="bg-[#ffb6c1]/25 px-2 py-0.5 rounded border border-[#ffb6c1]/40">
              จัดการข้อมูลสินค้า
            </span>
            <span>➔</span>
            <span>บันทึกข้อมูล (ฐานข้อมูล)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            จัดการข้อมูลสินค้า (Product Management)
          </h1>
          <p className="text-xs text-slate-500">
            ลงทะเบียนสินค้าใหม่ แก้ไขข้อมูล ปรับราคาทุน-ขาย และค้นหาในระบบ
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenContinueModal}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-[#ffc9b6] hover:bg-[#ffc9b6]/20 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#b83350]" />
            <span>ทำงานต่อ / ออกจากระบบ</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 text-xs font-bold text-slate-900 gradient-theme hover:opacity-95 border border-[#ffb6c1] rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-slate-900" />
            <span>เพิ่มสินค้าใหม่</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar with View Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-[#ffc9b6]/60 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-[#c45229]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาด้วยชื่อตุ๊กตา, รหัส SKU, บาร์โค้ด หรือชั้นวาง..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffb6c1] focus:border-[#ffb6c1] text-slate-900"
          />
        </div>

        {/* Filters and View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ffb6c1] focus:border-[#ffb6c1]"
          >
            <option value="all">ทุกหมวดหมู่สินค้า ({products.length})</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Stock state filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ffb6c1] focus:border-[#ffb6c1]"
          >
            <option value="all">สถานะสต็อกทั้งหมด</option>
            <option value="low">เตือนใกล้หมด (Low Stock)</option>
            <option value="normal">สต็อกปกติ</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="มุมมองแกลเลอรีรูปภาพตุ๊กตา"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#b83350]" />
              <span className="hidden sm:inline">การ์ดรูปภาพ</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="มุมมองตารางรายการ"
            >
              <List className="w-3.5 h-3.5 text-[#c45229]" />
              <span className="hidden sm:inline">ตาราง</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Product Showcase: Cards Mode or Table Mode */}
      {viewMode === 'cards' ? (
        /* Doll Gallery Card Grid */
        <div>
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <PackageSearch className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="font-medium text-slate-600">ไม่พบรายการสินค้าที่ค้นหา</p>
              <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหา หรือกด &quot;เพิ่มสินค้าใหม่&quot;</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((p) => {
                const isLow = p.currentStock <= p.minStockLevel && p.currentStock > 0;
                const isOut = p.currentStock === 0;

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-[#ffc9b6]/60 hover:border-[#ffb6c1] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                  >
                    {/* Doll Photo with Hover Zoom Overlay */}
                    <div className="relative aspect-square w-full bg-[#faf5f4] overflow-hidden border-b border-slate-100">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#ffb6c1]/20 to-[#ffc9b6]/30 text-slate-400 p-6 text-center">
                          <ImageIcon className="w-12 h-12 text-[#b83350]/40 mb-2" />
                          <span className="text-xs font-medium text-slate-500">ไม่มีรูปภาพสินค้า</span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs text-[11px] font-bold text-slate-800 shadow-xs border border-white">
                          {p.category}
                        </span>

                        {isOut ? (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-500 text-white text-[11px] font-bold shadow-xs">
                            สินค้าหมด
                          </span>
                        ) : isLow ? (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-[11px] font-bold shadow-xs flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            เตือนสต็อกต่ำ
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-semibold shadow-xs">
                            พร้อมจำหน่าย
                          </span>
                        )}
                      </div>

                      {/* Clickable Quick Zoom button */}
                      {p.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewDoll(p)}
                          className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors shadow-sm flex items-center gap-1.5 text-xs font-medium"
                          title="ดูรูปภาพขนาดใหญ่"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>ดูรูปชัด</span>
                        </button>
                      )}
                    </div>

                    {/* Doll Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* SKU / Barcode */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ffb6c1]/20 border border-[#ffb6c1]/40 font-mono text-[11px] font-bold text-[#b83350]">
                            <Barcode className="w-3 h-3" />
                            <span>{p.sku || p.barcode}</span>
                          </div>

                          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                            <MapPin className="w-3 h-3 text-[#c45229]" />
                            {p.shelfLocation}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-sm text-slate-900 line-clamp-2 min-h-[2.5rem]">
                          {p.name}
                        </h3>

                        {p.description && (
                          <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                            {p.description}
                          </p>
                        )}
                      </div>

                      {/* Price & Stock Section */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="flex items-end justify-between mb-3">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">ราคาขายหน้าร้าน</span>
                            <span className="text-base font-bold text-slate-900 font-mono">
                              ฿{p.sellingPrice.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-1 font-mono">
                              (ทุน ฿{p.costPrice.toLocaleString()})
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-medium">คงเหลือในคลัง</span>
                            <span className={`text-sm font-bold font-mono ${isLow ? 'text-amber-600' : isOut ? 'text-rose-600' : 'text-slate-900'}`}>
                              {p.currentStock.toLocaleString()} {p.unit}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="flex-1 py-1.5 px-2.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-[#ffc9b6]/30 border border-slate-200 hover:border-[#ffc9b6] rounded-xl transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                            <span>แก้ไข</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xl transition-colors"
                            title="ลบสินค้า"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Products Table View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                  <th className="py-3 px-4 w-16 text-center">รูปตัวอย่าง</th>
                  <th className="py-3 px-4">รหัส SKU / บาร์โค้ด</th>
                  <th className="py-3 px-4">ชื่อสินค้า</th>
                  <th className="py-3 px-4">หมวดหมู่</th>
                  <th className="py-3 px-4 text-right">ราคาทุน</th>
                  <th className="py-3 px-4 text-right">ราคาขาย</th>
                  <th className="py-3 px-4 text-right">คงเหลือ / เกณฑ์</th>
                  <th className="py-3 px-4 text-center">ชั้นวาง</th>
                  <th className="py-3 px-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <PackageSearch className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-medium text-slate-600">ไม่พบรายการสินค้าที่ค้นหา</p>
                      <p className="text-[11px] text-slate-400 mt-1">ลองเปลี่ยนคำค้นหา หรือกด &quot;เพิ่มสินค้าใหม่&quot;</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isLow = p.currentStock <= p.minStockLevel && p.currentStock > 0;
                    const isOut = p.currentStock === 0;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Doll Photo Thumbnail */}
                        <td className="py-2 px-3 text-center">
                          {p.imageUrl ? (
                            <button
                              type="button"
                              onClick={() => setPreviewDoll(p)}
                              className="relative group block w-11 h-11 mx-auto rounded-xl overflow-hidden border border-[#ffc9b6]/60 shadow-2xs hover:ring-2 hover:ring-[#ffb6c1] transition-all"
                              title="คลิกเพื่อดูรูปขยาย"
                            >
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                <Eye className="w-3.5 h-3.5" />
                              </div>
                            </button>
                          ) : (
                            <div className="w-11 h-11 mx-auto rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                              <ImageIcon className="w-4 h-4 text-slate-400" />
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ffb6c1]/20 border border-[#ffb6c1]/40 font-mono font-bold text-slate-900 text-xs">
                            <Barcode className="w-3.5 h-3.5 text-[#b83350] shrink-0" />
                            <span>{p.sku || p.barcode}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-900">{p.name}</p>
                          {p.supplierName && (
                            <p className="text-[11px] text-slate-400 truncate max-w-xs">
                              {p.supplierName}
                            </p>
                          )}
                        </td>

                        <td className="py-3 px-4 text-slate-600">
                          {p.category}
                        </td>

                        <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                          ฿{p.costPrice.toLocaleString()}
                        </td>

                        <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900 font-semibold">
                          ฿{p.sellingPrice.toLocaleString()}
                        </td>

                        <td className="py-3 px-4 text-right font-mono tabular-nums">
                          <span className={`font-bold ${isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-900'}`}>
                            {p.currentStock.toLocaleString()} {p.unit}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            เกณฑ์: {p.minStockLevel} {p.unit}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {p.shelfLocation}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                              title="แก้ไขข้อมูลสินค้า"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(p.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title="ลบสินค้า"
                            >
                              <Trash2 className="w-4 h-4" />
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
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Save className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingProduct ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มข้อมูลสินค้าใหม่'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    ขั้นตอนผังงาน: บันทึกข้อมูล ➔ อัปเดตลงฐานข้อมูล
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  รหัส SKU / บาร์โค้ด (รวมรหัสเดียวกัน) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#b83350]">
                    <Barcode className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, sku: val, barcode: val });
                    }}
                    placeholder="เช่น DOL-BR-120 หรือ 8859123450011"
                    className="w-full pl-9 pr-3.5 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffb6c1] focus:border-[#ffb6c1] text-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  * รหัสสินค้าและบาร์โค้ดรวมเป็นรหัสเดียวกัน สามารถใช้สแกนเนอร์บาร์โค้ดหรือพิมพ์รหัสเดียวกันได้ทันที
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ชื่อสินค้า (Product Name) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="เช่น ไมโครคอนโทรลเลอร์ ESP32..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    หมวดหมู่สินค้า
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    หน่วยนับ (Unit)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="เช่น ชิ้น, กล่อง, ม้วน"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ตำแหน่งชั้นวาง (Shelf)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shelfLocation}
                    onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
                    placeholder="เช่น A-01-02"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ราคาทุน (฿) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ราคาขาย (฿)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {editingProduct ? 'จำนวนคงคลังปัจจุบัน' : 'จำนวนสต็อกเริ่มต้น'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ระดับแจ้งเตือนขั้นต่ำ (Min Stock)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ชื่อซัพพลายเออร์ / ผู้ผลิต
                  </label>
                  <input
                    type="text"
                    value={formData.supplierName}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    placeholder="เช่น ไทยคอนโทรลเทค จำกัด"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Doll Photo Selector Section */}
              <div className="p-3.5 bg-[#faf5f4] rounded-xl border border-[#ffc9b6]/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#b83350]" />
                    <span>รูปภาพตุ๊กตาตัวอย่างสินค้า (Doll Product Photo)</span>
                  </label>
                  <span className="text-[11px] text-slate-500">เลือกจากตัวอย่างหรือใส่ลิงก์รูป</span>
                </div>

                {/* Preset Doll Samples */}
                <div>
                  <span className="text-[11px] font-medium text-slate-600 block mb-1.5">
                    กดเลือกรูปตุ๊กตาตัวอย่างของร้าน (5 แบบยอดนิยม):
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {SAMPLE_DOLL_PHOTOS.map((sample) => {
                      const isSelected = formData.imageUrl === sample.imageUrl;
                      return (
                        <button
                          key={sample.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: sample.imageUrl })}
                          className={`group relative rounded-xl overflow-hidden border-2 transition-all p-0.5 text-left aspect-square ${
                            isSelected
                              ? 'border-[#b83350] ring-2 ring-[#ffb6c1] bg-[#ffb6c1]/20'
                              : 'border-slate-200 hover:border-[#ffc9b6] bg-white'
                          }`}
                          title={sample.label}
                        >
                          <img
                            src={sample.imageUrl}
                            alt={sample.label}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-[#b83350] text-white p-0.5 rounded-full shadow-xs">
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom URL and Preview Row */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-white shrink-0 flex items-center justify-center">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="ตัวอย่างรูป"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1">
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      ลิงก์ URL รูปภาพ (หรือแก้ไขด้วยตนเอง)
                    </label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="เช่น /src/assets/images/... หรือ https://..."
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#ffb6c1]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  รายละเอียด / บันทึกเพิ่มเติม
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="ข้อมูลจำเพาะหรือหมายเหตุ..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-900 gradient-theme hover:opacity-95 rounded-xl transition-all flex items-center gap-1.5 shadow-xs border border-[#ffb6c1]"
                >
                  <Save className="w-3.5 h-3.5 text-slate-900" />
                  <span>บันทึกข้อมูลสินค้า</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Doll Photo Inspection Modal */}
      {previewDoll && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Image Header */}
            <div className="relative aspect-square w-full bg-slate-100">
              {previewDoll.imageUrl ? (
                <img
                  src={previewDoll.imageUrl}
                  alt={previewDoll.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-16 h-16" />
                </div>
              )}

              <button
                type="button"
                onClick={() => setPreviewDoll(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-xl bg-white/95 backdrop-blur-xs text-xs font-bold text-[#b83350] shadow-md border border-white">
                  {previewDoll.category}
                </span>
              </div>
            </div>

            {/* Doll Details Body */}
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ffb6c1]/25 border border-[#ffb6c1]/40 font-mono text-xs font-bold text-[#b83350]">
                    <Barcode className="w-3.5 h-3.5" />
                    <span>{previewDoll.sku || previewDoll.barcode}</span>
                  </div>

                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#c45229]" />
                    {previewDoll.shelfLocation}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {previewDoll.name}
                </h3>

                {previewDoll.description && (
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {previewDoll.description}
                  </p>
                )}
              </div>

              {/* Specs & Pricing */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#faf5f4] border border-[#ffc9b6]/60">
                <div>
                  <span className="text-[11px] text-slate-500 block">ราคาจำหน่ายหน้าร้าน</span>
                  <span className="text-xl font-bold font-mono text-slate-900">
                    ฿{previewDoll.sellingPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    ราคาทุน ฿{previewDoll.costPrice.toLocaleString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">สถานะคงคลังปัจจุบัน</span>
                  <span className={`text-xl font-bold font-mono ${
                    previewDoll.currentStock <= previewDoll.minStockLevel ? 'text-amber-600' : 'text-emerald-700'
                  }`}>
                    {previewDoll.currentStock.toLocaleString()} {previewDoll.unit}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    เกณฑ์แจ้งเตือน: {previewDoll.minStockLevel} {previewDoll.unit}
                  </span>
                </div>
              </div>

              {previewDoll.supplierName && (
                <p className="text-xs text-slate-500">
                  ผู้ผลิต/ซัพพลายเออร์: <span className="font-medium text-slate-800">{previewDoll.supplierName}</span>
                </p>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEdit(previewDoll);
                    setPreviewDoll(null);
                  }}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-900 gradient-theme hover:opacity-95 border border-[#ffb6c1] rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-900" />
                  <span>แก้ไขข้อมูลตุ๊กตานี้</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewDoll(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-bold text-slate-900">ยืนยันการลบรายการสินค้า</h4>
              <p className="text-xs text-slate-500 mt-1">
                คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้ออกจากฐานข้อมูลระบบ?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="w-full py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  deleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="w-full py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
