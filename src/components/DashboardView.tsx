import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  PackageSearch, 
  PackagePlus, 
  PackageMinus, 
  Boxes, 
  BarChart3, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Database,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { SystemFlowStep } from '../types';

export const DashboardView: React.FC = () => {
  const { 
    currentUser, 
    setCurrentStep, 
    products, 
    transactions 
  } = useInventory();

  // Financial and stock calculations
  const totalStockUnits = products.reduce((acc, p) => acc + p.currentStock, 0);
  const totalAssetValue = products.reduce((acc, p) => acc + (p.currentStock * p.costPrice), 0);
  const lowStockItems = products.filter(p => p.currentStock <= p.minStockLevel);
  const inTransactions = transactions.filter(t => t.type === 'IN');
  const outTransactions = transactions.filter(t => t.type === 'OUT');

  const modules = [
    {
      step: 'MANAGE_PRODUCTS' as SystemFlowStep,
      title: 'จัดการข้อมูลสินค้า',
      desc: 'เพิ่มสินค้าใหม่ แก้ไขข้อมูล ปรับราคา และค้นหาสินค้าตามหมวดหมู่',
      icon: PackageSearch,
      iconBg: 'bg-[#ffb6c1]/25 text-[#b83350] border-[#ffb6c1]/60',
      stat: `${products.length} รายการ`,
      statLabel: 'ฐานข้อมูลสินค้า',
      enabled: currentUser?.permissions.manageProducts ?? true,
    },
    {
      step: 'STOCK_IN' as SystemFlowStep,
      title: 'บันทึกรายการสินค้าเข้า',
      desc: 'รับพัสดุและวัตถุดิบเข้าคลังสินค้า อ้างอิงใบสั่งซื้อ (PO) และคำนวณยอดคงเหลืออัตโนมัติ',
      icon: PackagePlus,
      iconBg: 'bg-[#ffc9b6]/35 text-[#c45229] border-[#ffc9b6]',
      stat: `${inTransactions.length} ครั้ง`,
      statLabel: 'รับเข้าสะสม',
      enabled: currentUser?.permissions.stockIn ?? true,
    },
    {
      step: 'STOCK_OUT' as SystemFlowStep,
      title: 'บันทึกสินค้าเบิกออกจากคลัง',
      desc: 'จ่ายสินค้าและอะไหล่ตามใบขอเบิก ตรวจสอบสต็อกพอก่อนเบิก พร้อมออกใบเบิก',
      icon: PackageMinus,
      iconBg: 'bg-[#ffb6c1]/25 text-[#b83350] border-[#ffb6c1]/60',
      stat: `${outTransactions.length} ครั้ง`,
      statLabel: 'เบิกจ่ายสะสม',
      enabled: currentUser?.permissions.stockOut ?? true,
    },
    {
      step: 'CHECK_BALANCE' as SystemFlowStep,
      title: 'ค้นหา ตรวจสอบสินค้าคงเหลือ',
      desc: 'ตรวจสอบตำแหน่งชั้นวางสินค้า ติดตามระดับสต็อกขั้นต่ำ และปรับยอดตรวจนับจริง',
      icon: Boxes,
      iconBg: 'bg-[#ffc9b6]/35 text-[#c45229] border-[#ffc9b6]',
      stat: `${lowStockItems.length} เตือน`,
      statLabel: 'สต็อกใกล้หมด',
      enabled: currentUser?.permissions.checkBalance ?? true,
    },
    {
      step: 'REPORTS' as SystemFlowStep,
      title: 'รายงานยอดสินค้าทั้งหมด',
      desc: 'สรุปภาพรวมมูลค่าสต็อก รายการรับ-เบิกประจำงวด ส่งออกข้อมูล CSV และพิมพ์รายงาน',
      icon: BarChart3,
      iconBg: 'bg-[#ffb6c1]/25 text-[#b83350] border-[#ffb6c1]/60',
      stat: `฿${(totalAssetValue / 1000).toFixed(1)}k`,
      statLabel: 'มูลค่าสต็อกรวม',
      enabled: currentUser?.permissions.viewReports ?? true,
    },
    {
      step: 'PERMISSIONS' as SystemFlowStep,
      title: 'จัดการสิทธิ์การใช้งาน',
      desc: 'กำหนดสิทธิ์การเข้าถึง กำกับดูแลบัญชีผู้ใช้งาน และบทบาทความรับผิดชอบในระบบ',
      icon: ShieldCheck,
      iconBg: 'bg-[#ffc9b6]/35 text-[#c45229] border-[#ffc9b6]',
      stat: currentUser?.role === 'admin' ? 'Super Admin' : 'Staff Level',
      statLabel: 'ระดับสิทธิ์คุณ',
      enabled: currentUser?.permissions.managePermissions || currentUser?.role === 'admin',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner & Welcome */}
      <div className="bg-white rounded-3xl border border-[#ffc9b6]/80 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 gradient-theme-soft">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#b83350] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#ffb6c1] inline-block shadow-xs"></span>
            <span>การพัฒนาระบบบริหารจัดการร้านค้า · กรณีศึกษา ร้านตุ๊กตาพิเชียรแก้ว</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            ยินดีต้อนรับ, {currentUser?.fullName || 'ผู้ดูแลระบบ'}
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            บทบาท: <span className="text-slate-900 font-bold">{currentUser?.roleTitle}</span> · สังกัด: <span className="text-slate-900 font-medium">{currentUser?.department}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white/90 px-4 py-2 rounded-2xl border border-[#ffb6c1] shadow-xs">
          <Database className="w-4 h-4 text-[#c45229]" />
          <span>ร้านตุ๊กตาพิเชียรแก้ว ออนไลน์</span>
        </div>
      </div>

      {/* 4 Metric Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#ffc9b6]/60 shadow-xs hover:border-[#ffb6c1] transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>รายการสินค้าทั้งหมด</span>
            <span className="p-2 rounded-xl bg-[#ffb6c1]/25 text-[#b83350]">
              <Boxes className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {products.length}
          </p>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
            <span>จำนวนคงคลังรวม</span>
            <span className="font-semibold text-slate-800 font-mono tabular-nums">
              {totalStockUnits.toLocaleString()} หน่วย
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#ffc9b6]/60 shadow-xs hover:border-[#ffb6c1] transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>มูลค่าสินค้าคงคลังรวม</span>
            <span className="p-2 rounded-xl bg-[#ffc9b6]/35 text-[#c45229]">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            ฿{totalAssetValue.toLocaleString()}
          </p>
          <div className="mt-2 text-xs text-[#c45229] flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>คำนวณตามราคาทุนในฐานข้อมูล</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#ffc9b6]/60 shadow-xs hover:border-[#ffb6c1] transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>สินค้าใกล้หมดสต็อก</span>
            <span className={`p-2 rounded-xl ${lowStockItems.length > 0 ? 'bg-[#ffb6c1]/35 text-[#b83350]' : 'bg-slate-50 text-slate-400'}`}>
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-[#b83350] font-mono tabular-nums">
            {lowStockItems.length}
          </p>
          <div className="mt-2 text-xs text-slate-500">
            {lowStockItems.length > 0 ? (
              <span className="text-[#b83350] font-medium">ต่ำกว่าเกณฑ์ขั้นต่ำที่กำหนด</span>
            ) : (
              <span className="text-emerald-700">ปริมาณสต็อกเพียงพอทุกรายการ</span>
            )}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-[#ffc9b6]/60 shadow-xs hover:border-[#ffb6c1] transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>ประวัติทำรายการ (Transactions)</span>
            <span className="p-2 rounded-xl bg-[#ffc9b6]/35 text-[#c45229]">
              <Database className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {transactions.length}
          </p>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-3">
            <span className="text-emerald-700 font-medium">เข้า: {inTransactions.length}</span>
            <span className="text-slate-300">|</span>
            <span className="text-[#b83350] font-medium">ออก: {outTransactions.length}</span>
          </div>
        </div>
      </div>

      {/* Featured Doll Showcase Section */}
      <div className="bg-white rounded-3xl border border-[#ffc9b6]/80 p-5 md:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#b83350] mb-0.5">
              <span className="w-2 h-2 rounded-full bg-[#ffb6c1] animate-pulse"></span>
              <span>ตัวอย่างสินค้าตุ๊กตา (Sample Doll Products)</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              คอลเลกชันตุ๊กตายอดนิยม ร้านพิเชียรแก้ว
            </h2>
          </div>
          <button
            onClick={() => setCurrentStep('MANAGE_PRODUCTS')}
            className="text-xs font-bold text-[#b83350] hover:text-[#99223c] flex items-center gap-1 group"
          >
            <span>ดูสินค้าทั้งหมด ({products.length})</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {products.slice(0, 5).map((p) => (
            <div
              key={p.id}
              onClick={() => setCurrentStep('MANAGE_PRODUCTS')}
              className="group cursor-pointer rounded-2xl border border-slate-100 hover:border-[#ffb6c1] bg-[#faf5f4]/50 hover:bg-white p-2.5 transition-all shadow-2xs hover:shadow-xs flex flex-col"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white mb-2 border border-slate-100">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                    <Boxes className="w-8 h-8" />
                  </div>
                )}
                <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/65 backdrop-blur-xs text-[10px] font-mono font-bold text-white">
                  ฿{p.sellingPrice.toLocaleString()}
                </span>
              </div>

              <p className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-[#b83350] transition-colors">
                {p.name}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span className="font-mono text-[10px] text-slate-400">{p.sku}</span>
                <span className={`font-semibold font-mono ${p.currentStock <= p.minStockLevel ? 'text-amber-600' : 'text-emerald-700'}`}>
                  คงเหลือ {p.currentStock}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Core Functional Modules */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              6 โมดูลหลักสำหรับบริหารจัดการ
            </h2>
            <p className="text-xs text-slate-500">
              เลือกเมนูเพื่อเข้าสู่กระบวนการทำงานและบันทึกข้อมูลลงฐานข้อมูล
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.step}
                onClick={() => {
                  if (m.enabled) setCurrentStep(m.step);
                }}
                disabled={!m.enabled}
                className={`text-left bg-white p-5 rounded-2xl border border-[#ffc9b6]/60 transition-all group ${
                  m.enabled 
                    ? 'hover:border-[#ffb6c1] hover:shadow-md cursor-pointer hover:bg-[#fffbfb]' 
                    : 'opacity-60 cursor-not-allowed bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${m.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {m.stat}
                    </span>
                    <p className="text-[10px] text-slate-400">{m.statLabel}</p>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-[#b83350] transition-colors flex items-center justify-between">
                  <span>{m.title}</span>
                  <ChevronRight className="w-4 h-4 text-[#ffc9b6] group-hover:text-[#ffb6c1] group-hover:translate-x-1 transition-transform" />
                </h3>
                
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                  {m.desc}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-[#c45229] font-medium">คลิกเพื่อเปิดหน้า</span>
                  <span>{m.enabled ? 'เปิดใช้งาน' : 'ไม่มีสิทธิ์'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Split section: Low Stock Alerts & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Low Stock Alerts (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#ffc9b6]/60 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#b83350]" />
              <h3 className="text-sm font-bold text-slate-900">สินค้าต้องสั่งซื้อเพิ่ม (Low Stock)</h3>
            </div>
            <button
              onClick={() => setCurrentStep('CHECK_BALANCE')}
              className="text-xs text-[#b83350] font-bold hover:underline"
            >
              ดูทั้งหมด
            </button>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-medium text-slate-700 pt-1">สต็อกสินค้าอยู่ในเกณฑ์ปกติ</p>
              <p>ไม่มีสินค้าที่ต่ำกว่าเกณฑ์ขั้นต่ำ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-[#ffb6c1]/15 border border-[#ffb6c1]/40 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#ffc9b6] bg-white"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                        <Boxes className="w-4 h-4" />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        รหัส: <span className="font-mono font-bold text-slate-700">{item.sku}</span> · ชั้นวาง: <span className="font-mono text-slate-700">{item.shelfLocation}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#b83350] font-mono tabular-nums">
                      {item.currentStock} / {item.minStockLevel} {item.unit}
                    </span>
                    <button
                      onClick={() => setCurrentStep('STOCK_IN')}
                      className="block text-[10px] text-[#c45229] font-bold hover:underline mt-0.5"
                    >
                      + รับเข้าสต็อก
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions Feed (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#ffc9b6]/60 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#c45229]" />
              <h3 className="text-sm font-bold text-slate-900">ประวัติบันทึกข้อมูลล่าสุด (Database Transactions)</h3>
            </div>
            <button
              onClick={() => setCurrentStep('REPORTS')}
              className="text-xs text-[#b83350] font-bold hover:underline"
            >
              ดูรายงานละเอียด
            </button>
          </div>

          <div className="space-y-2.5">
            {transactions.slice(0, 4).map((tx) => {
              const isIn = tx.type === 'IN';
              const isOut = tx.type === 'OUT';

              return (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl border border-slate-100 hover:border-[#ffc9b6] hover:bg-[#fffbf9] transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isIn
                          ? 'bg-[#ffc9b6]/35 text-[#c45229]'
                          : isOut
                          ? 'bg-[#ffb6c1]/25 text-[#b83350]'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {isIn ? (
                        <ArrowDownRight className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {tx.productName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        <span className="font-mono text-slate-700">{tx.transactionNumber}</span> · {tx.partnerOrDepartment} · โดย {tx.operatorName}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-bold font-mono tabular-nums ${
                        isIn ? 'text-emerald-700' : isOut ? 'text-[#b83350]' : 'text-[#c45229]'
                      }`}
                    >
                      {isIn ? `+${tx.quantity}` : `-${tx.quantity}`}
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {tx.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
