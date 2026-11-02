import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  RotateCcw, 
  LogOut, 
  X, 
  ArrowRight,
  CheckCircle2,
  Power
} from 'lucide-react';

interface ContinueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContinueModal: React.FC<ContinueModalProps> = ({ isOpen, onClose }) => {
  const { continueWorking, logout } = useInventory();

  if (!isOpen) return null;

  const handleContinue = () => {
    onClose();
    continueWorking();
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-[#ffc9b6] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-theme flex items-center justify-center text-slate-900 border border-white shadow-xs">
              <RotateCcw className="w-4 h-4 text-slate-900" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#b83350] uppercase tracking-wider block bg-[#ffb6c1]/20 px-2 py-0.5 rounded border border-[#ffb6c1]/30">
                สถานะการทำงาน
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                ทำงานต่อ หรือ ต้องการออกจากระบบ?
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            เลือกขั้นตอนที่ต้องการดำเนินการต่อในระบบ:
          </p>

          <div className="grid grid-cols-1 gap-3 pt-1">
            {/* Option 1: Continue (Yes) */}
            <button
              onClick={handleContinue}
              className="p-3.5 rounded-2xl border border-[#ffb6c1] bg-[#ffb6c1]/15 hover:bg-[#ffb6c1]/25 text-left transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gradient-theme text-slate-900 flex items-center justify-center shrink-0 shadow-xs border border-white">
                  <CheckCircle2 className="w-4 h-4 text-slate-900" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xs">
                    ทำงานต่อ (ใช่ / Yes)
                  </p>
                  <p className="text-[11px] text-[#b83350]">
                    กลับไปที่ &quot;แสดงหน้าหลักของระบบ&quot; เพื่อบันทึกรายการถัดไป
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#b83350] group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Option 2: Logout (No) */}
            <button
              onClick={handleLogout}
              className="p-3.5 rounded-2xl border border-[#ffc9b6] bg-white hover:bg-[#ffc9b6]/20 text-left transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-[#ffc9b6] text-slate-700 group-hover:text-slate-900 flex items-center justify-center shrink-0 shadow-xs transition-colors">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xs transition-colors">
                    ออกจากระบบ (ไม่ / No)
                  </p>
                  <p className="text-[11px] text-slate-500 transition-colors">
                    ไปยัง &quot;ออกจากระบบ&quot; ➔ &quot;สิ้นสุด&quot; (End Session)
                  </p>
                </div>
              </div>
              <Power className="w-4 h-4 text-slate-400 group-hover:text-[#c45229] transition-colors" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-1 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium"
          >
            ยกเลิก (อยู่หน้านี้ต่อ)
          </button>
        </div>

      </div>
    </div>
  );
};
