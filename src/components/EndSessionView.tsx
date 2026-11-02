import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Power, 
  RotateCcw, 
  CheckCircle2, 
  Boxes, 
  ShieldCheck, 
} from 'lucide-react';

export const EndSessionView: React.FC = () => {
  const { restartSystem } = useInventory();

  return (
    <div className="min-h-screen bg-[#fff9f8] flex flex-col justify-between p-6">
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-4 border-b border-[#ffc9b6]/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-theme flex items-center justify-center text-slate-900 border border-white shadow-xs">
            <Boxes className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">
              ร้านตุ๊กตาพิเชียรแก้ว
            </h1>
            <p className="text-[11px] text-[#c45229]">ระบบบริหารจัดการร้านค้า กรณีศึกษา ร้านตุ๊กตาพิเชียรแก้ว</p>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          เซสชันสิ้นสุดลงแล้ว
        </span>
      </div>

      {/* Main card */}
      <div className="max-w-md w-full mx-auto my-auto bg-white rounded-3xl border border-[#ffc9b6]/80 shadow-md p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl gradient-theme text-slate-900 flex items-center justify-center mx-auto shadow-xs border border-white">
          <Power className="w-8 h-8 text-slate-900" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-[#b83350] uppercase tracking-wider bg-[#ffb6c1]/25 px-2.5 py-1 rounded-md border border-[#ffb6c1]/40 inline-block">
            ออกจากระบบเรียบร้อย
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            สิ้นสุดการทำงาน (Session Ended)
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            ออกจากระบบและบันทึกข้อมูลทุกรายการลงฐานข้อมูลเรียบร้อยแล้ว หากต้องการเริ่มรอบการทำงานใหม่ สามารถกดปุ่มด้านล่างได้ทันที
          </p>
        </div>

        {/* Verification Badges */}
        <div className="p-4 bg-[#fff8f6] rounded-2xl border border-[#ffc9b6]/60 text-xs text-slate-600 space-y-2 text-left">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#c45229] shrink-0" />
            <span>ข้อมูลสินค้าและรายการตัดสต็อกได้รับการบันทึกปลอดภัย</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#b83350] shrink-0" />
            <span>เซสชันผู้ใช้งานถูกตัดการเชื่อมต่ออย่างถูกต้อง</span>
          </div>
        </div>

        {/* Restart Action */}
        <button
          onClick={restartSystem}
          className="w-full py-3 px-4 gradient-theme hover:opacity-95 text-slate-900 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 border border-[#ffb6c1]"
        >
          <RotateCcw className="w-4 h-4 text-slate-900" />
          <span>กลับสู่หน้า &quot;เข้าสู่ระบบใหม่&quot; (Start New Session)</span>
        </button>
      </div>

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-slate-400 pt-4 border-t border-[#ffc9b6]/60">
        ระบบบริหารคลังสินค้าและยอดพัสดุคงเหลือ
      </div>
    </div>
  );
};
