import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  LogIn, 
  User as UserIcon, 
  AlertTriangle, 
  ShieldCheck, 
  Boxes, 
  ArrowRight,
  Database,
  Lock,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, users, currentStep } = useInventory();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsVerifying(true);

    setTimeout(() => {
      const result = login(username, password);
      setIsVerifying(false);
      if (!result.success) {
        setErrorMsg(result.error || 'ข้อมูลไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่');
      }
    }, 450);
  };

  const handleQuickLogin = (uname: string) => {
    setUsername(uname);
    setPassword('password123');
    setErrorMsg(null);
    setIsVerifying(true);
    setTimeout(() => {
      login(uname, 'password123');
      setIsVerifying(false);
    }, 350);
  };

  const handleTestInvalidLogin = () => {
    setUsername('wrong_user_demo');
    setPassword('wrongpass');
    setErrorMsg(null);
    setIsVerifying(true);
    setTimeout(() => {
      const result = login('wrong_user_demo', 'wrongpass');
      setIsVerifying(false);
      setErrorMsg(result.error || 'ชื่อผู้ใช้งานไม่ถูกต้องในฐานข้อมูล');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#fff9f8] flex flex-col justify-between p-4 md:p-8">
      {/* Top Bar Simple Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-[#ffc9b6]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-theme flex items-center justify-center text-slate-900 shadow-xs border border-white">
            <Boxes className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              ร้านตุ๊กตาพิเชียรแก้ว
            </h1>
            <p className="text-xs text-[#c45229] font-medium">กรณีศึกษา: การพัฒนาระบบบริหารจัดการร้านค้า</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Database className="w-3.5 h-3.5 text-[#b83350]" />
          <span>ฐานข้อมูลร้านค้าพร้อมใช้งาน</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl w-full mx-auto my-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: System & Step Explanation */}
          <div className="md:col-span-5 space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#b83350] uppercase tracking-wider bg-[#ffb6c1]/25 px-2.5 py-1 rounded-md border border-[#ffb6c1]/40 inline-block">
                ระบบบริหารจัดการร้านค้า
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                ร้านตุ๊กตาพิเชียรแก้ว
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                ระบบจัดการสต็อกและสินค้าครบวงจร: บันทึกรับตุ๊กตาจากโรงงาน เบิกจัดวางหน้าร้านและส่งออนไลน์ ตรวจนับยอดคงเหลือ และสรุปยอดขาย
              </p>
            </div>

            {/* Quick Test Role Selectors */}
            <div className="p-5 bg-white rounded-2xl border border-[#ffc9b6]/70 shadow-xs space-y-3">
              <span className="text-xs font-semibold text-slate-800 block">
                เลือกบทบาททดสอบ (Quick Test Accounts):
              </span>
              <div className="grid grid-cols-1 gap-2">
                {users.slice(0, 3).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u.username)}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-[#ffb6c1] hover:bg-[#ffb6c1]/15 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg gradient-theme flex items-center justify-center text-xs font-bold text-slate-900 shadow-xs">
                        {u.username.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{u.fullName}</p>
                        <p className="text-[11px] text-slate-500">{u.roleTitle}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#b83350] font-semibold group-hover:translate-x-0.5 transition-transform">
                      เข้าสู่ระบบ →
                    </span>
                  </button>
                ))}
              </div>

              {/* Simulation button for error flow */}
              <button
                type="button"
                onClick={handleTestInvalidLogin}
                className="w-full mt-2 py-2 px-3 text-xs text-rose-600 border border-rose-200 hover:bg-rose-50 rounded-xl flex items-center justify-center gap-1.5 transition-colors font-medium"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>ทดสอบกรณี &quot;ข้อมูลไม่ถูกต้อง&quot; (Error Loop)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-3xl border border-[#ffc9b6]/80 shadow-md p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl gradient-theme flex items-center justify-center text-slate-900 shadow-xs">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">ฟอร์มเข้าสู่ระบบ (Sign In)</h3>
                    <p className="text-xs text-slate-500">กรอกชื่อผู้ใช้และรหัสผ่านเพื่อตรวจสอบสิทธิ์</p>
                  </div>
                </div>
              </div>

              {/* Error Alert Box */}
              {(errorMsg || currentStep === 'LOGIN_FAILED') && (
                <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-rose-800">
                      แจ้งเตือนและเข้าสู่ระบบใหม่ (ข้อมูลไม่ถูกต้อง)
                    </p>
                    <p className="text-rose-700">
                      {errorMsg || 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง'}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ชื่อผู้ใช้งาน (Username)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="เช่น admin, somchai.w"
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffb6c1] focus:border-[#ffb6c1] text-slate-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    รหัสผ่าน (Password)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffb6c1] focus:border-[#ffb6c1] text-slate-900 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-3 px-4 gradient-theme hover:opacity-95 text-slate-900 font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-[#ffb6c1]"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                        <span>กำลังตรวจสอบชื่อผู้ใช้งาน...</span>
                      </>
                    ) : (
                      <>
                        <span>ตรวจสอบชื่อผู้ใช้งาน & เข้าสู่ระบบ</span>
                        <ArrowRight className="w-4 h-4 text-slate-900" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#c45229]" />
                  <span>ระบบควบคุมสิทธิ์ระดับ Role-Based (RBAC)</span>
                </span>
                <span className="font-mono text-[11px] text-slate-400">v1.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="max-w-6xl w-full mx-auto pt-6 border-t border-[#ffc9b6]/60 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <span>ระบบจัดการข้อมูลคลังและสต็อกสินค้า</span>
        </div>
        <div className="flex items-center gap-4">
          <span>รองรับ 6 ฟังก์ชันหลักตามข้อกำหนด</span>
          <span>·</span>
          <span>จำลองการเชื่อมต่อฐานข้อมูลสมบูรณ์</span>
        </div>
      </div>
    </div>
  );
};
