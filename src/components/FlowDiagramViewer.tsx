import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  LogIn, 
  IdCard, 
  AlertTriangle, 
  CheckCircle2, 
  Database, 
  LayoutDashboard, 
  PackageSearch, 
  PackagePlus, 
  PackageMinus, 
  Boxes, 
  BarChart3, 
  ShieldCheck, 
  Save, 
  RotateCcw, 
  LogOut, 
  Power,
  Maximize2,
  X,
  ExternalLink
} from 'lucide-react';
import { SystemFlowStep } from '../types';

interface FlowDiagramViewerProps {
  mode?: 'compact' | 'full' | 'modal';
  onClose?: () => void;
}

export const FlowDiagramViewer: React.FC<FlowDiagramViewerProps> = ({ mode = 'compact', onClose }) => {
  const { currentStep, setCurrentStep, activeFlowPath } = useInventory();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes = [
    {
      id: 'login',
      name: 'ผู้ใช้งานเข้าสู่ระบบ',
      subtitle: 'ระบุชื่อผู้ใช้และรหัสผ่าน',
      icon: LogIn,
      stepTarget: 'LOGIN' as SystemFlowStep,
      category: 'auth',
      x: 60,
      y: 190,
    },
    {
      id: 'verify',
      name: 'ตรวจสอบชื่อผู้ใช้งาน',
      subtitle: 'เช็คในฐานข้อมูลระบบ',
      icon: IdCard,
      stepTarget: 'VERIFY_USER' as SystemFlowStep,
      category: 'auth',
      x: 230,
      y: 190,
    },
    {
      id: 'invalid',
      name: 'แจ้งเตือนและเข้าสู่ระบบใหม่',
      subtitle: 'ข้อมูลไม่ถูกต้อง',
      icon: AlertTriangle,
      stepTarget: 'LOGIN_FAILED' as SystemFlowStep,
      category: 'error',
      x: 230,
      y: 50,
    },
    {
      id: 'valid',
      name: 'ข้อมูลถูกต้อง',
      subtitle: 'อนุมัติการเข้าถึง',
      icon: CheckCircle2,
      stepTarget: 'DASHBOARD' as SystemFlowStep,
      category: 'success',
      x: 350,
      y: 280,
    },
    {
      id: 'database',
      name: 'ฐานข้อมูล',
      subtitle: 'Database (สินค้า/สิทธิ์/ประวัติ)',
      icon: Database,
      stepTarget: 'DASHBOARD' as SystemFlowStep,
      category: 'storage',
      x: 440,
      y: 190,
    },
    {
      id: 'dashboard',
      name: 'แสดงหน้าหลักของระบบ',
      subtitle: 'แดชบอร์ดภาพรวมคลังสินค้า',
      icon: LayoutDashboard,
      stepTarget: 'DASHBOARD' as SystemFlowStep,
      category: 'main',
      x: 580,
      y: 190,
    },
    // 6 Modules
    {
      id: 'manage_products',
      name: 'จัดการข้อมูลสินค้า',
      subtitle: 'เพิ่ม-แก้ไข-ค้นหา',
      icon: PackageSearch,
      stepTarget: 'MANAGE_PRODUCTS' as SystemFlowStep,
      category: 'module',
      x: 750,
      y: 40,
    },
    {
      id: 'stock_in',
      name: 'บันทึกรายการสินค้าเข้า',
      subtitle: 'รับสินค้าเข้าสต็อก (Goods Receipt)',
      icon: PackagePlus,
      stepTarget: 'STOCK_IN' as SystemFlowStep,
      category: 'module',
      x: 750,
      y: 110,
    },
    {
      id: 'stock_out',
      name: 'บันทึกสินค้าเบิกออกจากคลัง',
      subtitle: 'เบิกจ่ายสินค้า (Goods Issue)',
      icon: PackageMinus,
      stepTarget: 'STOCK_OUT' as SystemFlowStep,
      category: 'module',
      x: 750,
      y: 180,
    },
    {
      id: 'check_balance',
      name: 'ค้นหา ตรวจสอบสินค้าคงเหลือ',
      subtitle: 'ตรวจนับยอดและชั้นวาง',
      icon: Boxes,
      stepTarget: 'CHECK_BALANCE' as SystemFlowStep,
      category: 'module',
      x: 750,
      y: 250,
    },
    {
      id: 'reports',
      name: 'รายงานยอดสินค้าทั้งหมด',
      subtitle: 'สรุปการเคลื่อนไหว & สินทรัพย์',
      icon: BarChart3,
      stepTarget: 'REPORTS' as SystemFlowStep,
      category: 'module',
      x: 750,
      y: 320,
    },
    {
      id: 'permissions',
      name: 'จัดการสิทธิ์การใช้งาน',
      subtitle: 'กำหนดสิทธิ์ผู้ใช้งานและบทบาท',
      icon: ShieldCheck,
      stepTarget: 'PERMISSIONS' as SystemFlowStep,
      category: 'module',
      x: 750,
      y: 390,
    },
    // Save data node
    {
      id: 'save_data',
      name: 'บันทึกข้อมูล',
      subtitle: 'Commit to Database',
      icon: Save,
      stepTarget: 'SAVE_DATA' as SystemFlowStep,
      category: 'storage',
      x: 930,
      y: 180,
    },
    // Continue prompt
    {
      id: 'continue',
      name: 'ทำงานต่อ',
      subtitle: 'ต้องการดำเนินการต่อหรือไม่?',
      icon: RotateCcw,
      stepTarget: 'CONTINUE_PROMPT' as SystemFlowStep,
      category: 'control',
      x: 930,
      y: 320,
    },
    // Logout
    {
      id: 'logout',
      name: 'ออกจากระบบ',
      subtitle: 'กรณีเลือก ไม่ (No)',
      icon: LogOut,
      stepTarget: 'LOGOUT' as SystemFlowStep,
      category: 'control',
      x: 1040,
      y: 320,
    },
    // End
    {
      id: 'end',
      name: 'สิ้นสุด',
      subtitle: 'ปิดการทำงานของระบบ',
      icon: Power,
      stepTarget: 'END' as SystemFlowStep,
      category: 'control',
      x: 1140,
      y: 320,
    },
  ];

  const handleNodeClick = (node: typeof nodes[0]) => {
    // If not logged in and clicking internal nodes, keep user aware
    if (node.id !== 'login' && node.id !== 'invalid' && node.id !== 'end' && !activeFlowPath.includes('แสดงหน้าหลักของระบบ') && currentStep === 'LOGIN') {
      setCurrentStep(node.stepTarget);
      return;
    }
    setCurrentStep(node.stepTarget);
    if (onClose) onClose();
  };

  const isNodeActive = (nodeName: string) => {
    return activeFlowPath.includes(nodeName);
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm ${mode === 'modal' ? 'p-6 max-w-6xl w-full mx-auto' : 'p-4'}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold">
            <LayoutDashboard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              System Flow Diagram (ผังการทำงานของระบบ)
              <span className="text-xs font-normal text-slate-500">· คลิกโหนดเพื่อเปลี่ยนหน้าหรือทดสอบโฟลว์</span>
            </h3>
            <p className="text-xs text-slate-500">
              สถานะปัจจุบัน: <strong className="text-indigo-600 font-medium">{activeFlowPath[activeFlowPath.length - 1] || 'แสดงหน้าหลักของระบบ'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'modal' && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Diagram Canvas */}
      <div className="relative overflow-x-auto overflow-y-hidden py-2 bg-slate-50/50 rounded-lg border border-slate-100">
        <div className="min-w-[1200px] h-[450px] relative">
          {/* SVG Connectors / Arrows */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748b" />
              </marker>
              <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4f46e5" />
              </marker>
              <marker id="arrow-error" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#e11d48" />
              </marker>
              <marker id="arrow-success" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#16a34a" />
              </marker>
            </defs>

            {/* 1. Login -> Verify */}
            <line x1="160" y1="210" x2="225" y2="210" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
            
            {/* 2. Verify -> Invalid (Up) */}
            <path d="M 280 185 L 280 105" fill="none" stroke="#e11d48" strokeWidth="2" markerEnd="url(#arrow-error)" />
            <text x="290" y="145" fill="#e11d48" fontSize="11" fontWeight="500">ข้อมูลไม่ถูกต้อง</text>

            {/* 3. Invalid -> Loop back to Login */}
            <path d="M 230 70 L 110 70 L 110 185" fill="none" stroke="#e11d48" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrow-error)" />

            {/* 4. Verify -> Valid (Down-Right) */}
            <path d="M 280 235 L 280 295 L 345 295" fill="none" stroke="#16a34a" strokeWidth="2" markerEnd="url(#arrow-success)" />
            <text x="290" y="275" fill="#16a34a" fontSize="11" fontWeight="500">ข้อมูลถูกต้อง</text>

            {/* 5. Valid -> Database */}
            <path d="M 430 295 L 485 295 L 485 240" fill="none" stroke="#16a34a" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* 6. Database -> Dashboard */}
            <line x1="535" y1="210" x2="575" y2="210" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* 7. Dashboard -> 6 Modules (Fan out branch) */}
            <path d="M 690 210 L 715 210 L 715 60 L 745 60" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <path d="M 690 210 L 715 210 L 715 130 L 745 130" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <path d="M 690 210 L 745 200" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <path d="M 690 210 L 715 210 L 715 270 L 745 270" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <path d="M 690 210 L 715 210 L 715 340 L 745 340" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <path d="M 690 210 L 715 210 L 715 410 L 745 410" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />

            {/* 8. Modules 1, 2, 3 -> Save Data (Document Save) */}
            <path d="M 880 60 L 905 60 L 905 190 L 925 190" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <path d="M 880 130 L 905 130 L 905 195 L 925 195" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <path d="M 880 200 L 925 200" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />

            {/* 9. Save Data -> Database (Commit loop) */}
            <path d="M 975 170 L 975 15 L 485 15 L 485 180" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#arrow-active)" />
            <text x="700" y="28" fill="#4f46e5" fontSize="10" fontWeight="600">อัปเดตและบันทึกลงฐานข้อมูล</text>

            {/* 10. Save Data -> Continue Prompt */}
            <line x1="975" y1="230" x2="975" y2="300" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* 11. Modules 4, 5, 6 -> Continue Prompt */}
            <path d="M 880 270 L 905 270 L 905 330 L 925 330" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <path d="M 880 340 L 925 340" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <path d="M 880 410 L 905 410 L 905 350 L 925 350" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />

            {/* 12. Continue Prompt -> Return to Dashboard (Loop if "Yes / ทำงานต่อ") */}
            <path d="M 975 370 L 975 435 L 635 435 L 635 240" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#arrow-success)" />
            <text x="780" y="445" fill="#059669" fontSize="11" fontWeight="600">ทำงานต่อ (ใช่) ⟵ กลับสู่หน้าหลัก</text>

            {/* 13. Continue Prompt -> Logout (if "No / ไม่") */}
            <line x1="1025" y1="340" x2="1035" y2="340" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="1010" y="315" fill="#64748b" fontSize="10" fontWeight="500">ไม่</text>

            {/* 14. Logout -> End */}
            <line x1="1115" y1="340" x2="1135" y2="340" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
          </svg>

          {/* Nodes */}
          {nodes.map(node => {
            const active = isNodeActive(node.name);
            const isHovered = hoveredNode === node.id;
            const Icon = node.icon;

            let borderColor = 'border-slate-300';
            let bgClass = 'bg-white';
            let textColor = 'text-slate-800';
            let iconColor = 'text-slate-600';

            if (node.category === 'error') {
              borderColor = active ? 'border-rose-500 ring-2 ring-rose-200' : 'border-rose-200';
              bgClass = active ? 'bg-rose-50' : 'bg-white';
              textColor = 'text-rose-900';
              iconColor = 'text-rose-600';
            } else if (node.category === 'success') {
              borderColor = active ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-emerald-200';
              bgClass = active ? 'bg-emerald-50' : 'bg-white';
              textColor = 'text-emerald-900';
              iconColor = 'text-emerald-600';
            } else if (active) {
              borderColor = 'border-indigo-600 ring-2 ring-indigo-200 shadow-md';
              bgClass = 'bg-indigo-50/90';
              textColor = 'text-indigo-950 font-semibold';
              iconColor = 'text-indigo-600';
            }

            return (
              <div
                key={node.id}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-10 cursor-pointer rounded-lg border ${borderColor} ${bgClass} p-2.5 transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center gap-2.5 min-w-[140px] max-w-[170px]`}
              >
                <div className={`p-1.5 rounded-md ${active ? 'bg-white text-indigo-600 shadow-xs' : 'bg-slate-100 text-slate-600'}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
                <div className="flex flex-col overflow-hidden text-left">
                  <span className={`text-xs ${textColor} leading-snug truncate`}>
                    {node.name}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">
                    {node.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info Legend */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block"></span>
            <span>ขั้นตอนปัจจุบัน (Active Step)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
            <span>ทำงานต่อ (Continue Loop)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block"></span>
            <span>ข้อมูลไม่ถูกต้อง (Error Loop)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
