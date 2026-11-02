import React, { useState } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { LoginView } from './components/LoginView';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ProductManagementView } from './components/ProductManagementView';
import { StockInView } from './components/StockInView';
import { StockOutView } from './components/StockOutView';
import { StockBalanceView } from './components/StockBalanceView';
import { ReportsView } from './components/ReportsView';
import { PermissionsView } from './components/PermissionsView';
import { ContinueModal } from './components/ContinueModal';
import { EndSessionView } from './components/EndSessionView';
import { 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Info, 
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentStep, notification, clearNotification } = useInventory();
  const [showContinueModal, setShowContinueModal] = useState(false);

  // If in auth flow steps
  if (currentStep === 'LOGIN' || currentStep === 'VERIFY_USER' || currentStep === 'LOGIN_FAILED') {
    return <LoginView />;
  }

  // If in terminal end state
  if (currentStep === 'END') {
    return <EndSessionView />;
  }

  return (
    <div className="min-h-screen bg-[#faf5f4] flex flex-col font-['Prompt',sans-serif]">
      {/* Top Header */}
      <Header
        onOpenContinueModal={() => setShowContinueModal(true)}
      />

      {/* Global Notification Toast */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 ${
              notification.type === 'success'
                ? 'bg-slate-900 text-white border-[#ffb6c1]'
                : notification.type === 'error'
                ? 'bg-rose-950 text-white border-rose-700'
                : notification.type === 'warning'
                ? 'bg-[#c45229] text-white border-[#ffc9b6]'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#ffb6c1] shrink-0 mt-0.5" />}
            {notification.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-[#ffc9b6] shrink-0 mt-0.5" />}
            {notification.type === 'info' && <Info className="w-5 h-5 text-[#ffb6c1] shrink-0 mt-0.5" />}

            <div className="flex-1 text-xs">
              <p className="font-bold">{notification.title}</p>
              <p className="opacity-90 mt-0.5">{notification.message}</p>
            </div>

            <button
              onClick={clearNotification}
              className="p-1 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Layout Area: Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          onOpenContinueModal={() => setShowContinueModal(true)}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[calc(100%-16rem)]">
          {currentStep === 'DASHBOARD' && (
            <DashboardView />
          )}
          {currentStep === 'MANAGE_PRODUCTS' && (
            <ProductManagementView onOpenContinueModal={() => setShowContinueModal(true)} />
          )}
          {currentStep === 'STOCK_IN' && (
            <StockInView onOpenContinueModal={() => setShowContinueModal(true)} />
          )}
          {currentStep === 'STOCK_OUT' && (
            <StockOutView onOpenContinueModal={() => setShowContinueModal(true)} />
          )}
          {currentStep === 'CHECK_BALANCE' && (
            <StockBalanceView onOpenContinueModal={() => setShowContinueModal(true)} />
          )}
          {currentStep === 'REPORTS' && (
            <ReportsView onOpenContinueModal={() => setShowContinueModal(true)} />
          )}
          {currentStep === 'PERMISSIONS' && (
            <PermissionsView onOpenContinueModal={() => setShowContinueModal(true)} />
          )}
          {currentStep === 'SAVE_DATA' && (
            <DashboardView />
          )}
          {currentStep === 'CONTINUE_PROMPT' && (
            <DashboardView />
          )}
        </main>
      </div>

      {/* Decision Modal: ทำงานต่อ? (ใช่ ➔ หน้าหลัก / ไม่ ➔ ออกจากระบบ ➔ สิ้นสุด) */}
      <ContinueModal
        isOpen={showContinueModal || currentStep === 'CONTINUE_PROMPT'}
        onClose={() => setShowContinueModal(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <InventoryProvider>
      <MainAppContent />
    </InventoryProvider>
  );
}
