import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  LayoutDashboard, 
  PackageSearch, 
  PackagePlus, 
  PackageMinus, 
  Boxes, 
  BarChart3, 
  ShieldCheck, 
  RotateCcw,
  Database,
} from 'lucide-react';
import { SystemFlowStep } from '../types';

interface SidebarProps {
  onOpenContinueModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenContinueModal }) => {
  const { 
    currentUser, 
    currentStep, 
    setCurrentStep, 
    products, 
    transactions,
  } = useInventory();

  // Metrics for badges
  const lowStockCount = products.filter(p => p.currentStock <= p.minStockLevel).length;

  const menuItems = [
    {
      id: 'DASHBOARD' as SystemFlowStep,
      label: 'หน้าหลักของระบบ',
      sublabel: 'แดชบอร์ดภาพรวมสต็อก',
      icon: LayoutDashboard,
      badge: null,
      permission: true,
    },
    {
      id: 'MANAGE_PRODUCTS' as SystemFlowStep,
      label: 'จัดการข้อมูลสินค้า',
      sublabel: 'เพิ่ม-แก้ไข-ค้นหา',
      icon: PackageSearch,
      badge: `${products.length} รายการ`,
      permission: currentUser?.permissions.manageProducts ?? true,
    },
    {
      id: 'STOCK_IN' as SystemFlowStep,
      label: 'บันทึกรายการสินค้าเข้า',
      sublabel: 'รับสินค้าเข้าคลัง (Stock-In)',
      icon: PackagePlus,
      badge: null,
      permission: currentUser?.permissions.stockIn ?? true,
    },
    {
      id: 'STOCK_OUT' as SystemFlowStep,
      label: 'บันทึกสินค้าเบิกออกจากคลัง',
      sublabel: 'เบิกจ่ายพัสดุ (Stock-Out)',
      icon: PackageMinus,
      badge: null,
      permission: currentUser?.permissions.stockOut ?? true,
    },
    {
      id: 'CHECK_BALANCE' as SystemFlowStep,
      label: 'ค้นหา ตรวจสอบสินค้าคงเหลือ',
      sublabel: 'เช็คยอดสต็อกและชั้นวาง',
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} เตือนใกล้หมด` : null,
      badgeColor: 'text-[#c45229] bg-[#ffc9b6]/30 border-[#ffc9b6]',
      permission: currentUser?.permissions.checkBalance ?? true,
    },
    {
      id: 'REPORTS' as SystemFlowStep,
      label: 'รายงานยอดสินค้าทั้งหมด',
      sublabel: 'สรุปการเคลื่อนไหว & สินทรัพย์',
      icon: BarChart3,
      badge: null,
      permission: currentUser?.permissions.viewReports ?? true,
    },
    {
      id: 'PERMISSIONS' as SystemFlowStep,
      label: 'จัดการสิทธิ์การใช้งาน',
      sublabel: 'ควบคุมบัญชีและบทบาทผู้ใช้',
      icon: ShieldCheck,
      badge: currentUser?.role === 'admin' ? 'Admin' : null,
      permission: currentUser?.permissions.managePermissions || currentUser?.role === 'admin',
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#ffc9b6]/60 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none shadow-xs">
      {/* Upper Section: Profile and Nav Links */}
      <div className="p-4 space-y-4 overflow-y-auto">
        {/* Active User Card */}
        {currentUser && (
          <div className="p-3 gradient-theme-soft rounded-xl border border-[#ffb6c1]/60 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full gradient-theme border border-white flex items-center justify-center text-xs font-bold text-slate-900 shrink-0 shadow-xs">
                {currentUser.username.substring(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {currentUser.fullName}
                </p>
                <p className="text-[11px] text-[#b83350] font-medium truncate">
                  {currentUser.roleTitle}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#ffb6c1]/40 text-[10px] text-slate-600">
              <span className="flex items-center gap-1 text-[#c45229] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb6c1]"></span>
                สิทธิ์พร้อมใช้งาน
              </span>
              <span className="truncate max-w-[100px]">{currentUser.department.split('&')[0]}</span>
            </div>
          </div>
        )}

        {/* Section title */}
        <div className="pt-1">
          <p className="text-[11px] font-semibold text-[#c45229] uppercase tracking-wider px-2">
            เมนูหลักของระบบ (6 โมดูล)
          </p>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentStep === item.id;
            const hasAccess = item.permission;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (hasAccess) {
                    setCurrentStep(item.id);
                  }
                }}
                disabled={!hasAccess}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-[#ffb6c1]/25 text-[#b83350] font-bold border border-[#ffb6c1] shadow-xs'
                    : hasAccess
                    ? 'text-slate-700 hover:bg-[#ffc9b6]/20 hover:text-slate-900'
                    : 'text-slate-300 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-[#ffb6c1] text-slate-900' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs leading-tight truncate">{item.label}</p>
                    <p className="text-[10px] text-slate-400 font-normal truncate">
                      {item.sublabel}
                    </p>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 border ${
                      item.badgeColor || 'bg-[#ffb6c1]/20 text-[#b83350] border-[#ffb6c1]/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: System Controls */}
      <div className="p-4 border-t border-[#ffc9b6]/60 space-y-2.5 bg-[#fff8f6]">
        <button
          onClick={onOpenContinueModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-900 bg-white hover:bg-[#ffc9b6]/30 border border-[#ffb6c1] rounded-xl transition-all shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#b83350]" />
          <span>ทำงานต่อ / ออกจากระบบ</span>
        </button>

        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="flex items-center gap-1.5">
            <Database className="w-3 h-3 text-[#c45229]" />
            <span>ฐานข้อมูลเชื่อมต่อแล้ว</span>
          </span>
          <span className="font-mono text-slate-600">{transactions.length} ประวัติ</span>
        </div>
      </div>
    </aside>
  );
};
