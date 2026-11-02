import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Boxes, 
  RotateCcw, 
} from 'lucide-react';

interface HeaderProps {
  onOpenContinueModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenContinueModal }) => {
  const { currentStep, setCurrentStep } = useInventory();

  return (
    <header className="bg-white/95 backdrop-blur-xs border-b border-[#ffc9b6]/60 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8 h-16">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl gradient-theme flex items-center justify-center text-slate-800 shadow-xs border border-white">
            <Boxes className="w-5 h-5 text-slate-900" />
          </div>
          <button 
            onClick={() => setCurrentStep('DASHBOARD')}
            className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap hover:text-[#b83350] transition-colors"
          >
            ร้านตุ๊กตาพิเชียรแก้ว
          </button>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setCurrentStep('DASHBOARD')}
            className={`hover:text-[#b83350] transition-colors whitespace-nowrap shrink-0 ${
              currentStep === 'DASHBOARD' ? 'text-[#b83350] font-semibold border-b-2 border-[#ffb6c1] pb-1 -mb-1' : ''
            }`}
          >
            หน้าหลัก
          </button>
          <button
            onClick={() => setCurrentStep('MANAGE_PRODUCTS')}
            className={`hover:text-[#b83350] transition-colors whitespace-nowrap shrink-0 ${
              currentStep === 'MANAGE_PRODUCTS' ? 'text-[#b83350] font-semibold border-b-2 border-[#ffb6c1] pb-1 -mb-1' : ''
            }`}
          >
            จัดการสินค้า
          </button>
          <button
            onClick={() => setCurrentStep('STOCK_IN')}
            className={`hover:text-[#b83350] transition-colors whitespace-nowrap shrink-0 ${
              currentStep === 'STOCK_IN' ? 'text-[#b83350] font-semibold border-b-2 border-[#ffb6c1] pb-1 -mb-1' : ''
            }`}
          >
            บันทึกรับเข้า
          </button>
          <button
            onClick={() => setCurrentStep('STOCK_OUT')}
            className={`hover:text-[#b83350] transition-colors whitespace-nowrap shrink-0 ${
              currentStep === 'STOCK_OUT' ? 'text-[#b83350] font-semibold border-b-2 border-[#ffb6c1] pb-1 -mb-1' : ''
            }`}
          >
            บันทึกเบิกออก
          </button>
          <button
            onClick={() => setCurrentStep('CHECK_BALANCE')}
            className={`hover:text-[#b83350] transition-colors whitespace-nowrap shrink-0 ${
              currentStep === 'CHECK_BALANCE' ? 'text-[#b83350] font-semibold border-b-2 border-[#ffb6c1] pb-1 -mb-1' : ''
            }`}
          >
            ตรวจนับคงเหลือ
          </button>
          <button
            onClick={() => setCurrentStep('REPORTS')}
            className={`hover:text-[#b83350] transition-colors whitespace-nowrap shrink-0 ${
              currentStep === 'REPORTS' ? 'text-[#b83350] font-semibold border-b-2 border-[#ffb6c1] pb-1 -mb-1' : ''
            }`}
          >
            รายงาน
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenContinueModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 gradient-theme hover:opacity-95 rounded-xl transition-all whitespace-nowrap shrink-0 shadow-xs border border-[#ffb6c1]"
            title="ทำงานต่อ หรือ ออกจากระบบตามขั้นตอน"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-800" />
            <span>ทำงานต่อ / ออกจากระบบ</span>
          </button>
        </div>

      </div>
    </header>
  );
};
