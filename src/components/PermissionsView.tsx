import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  ShieldCheck, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Edit3, 
  Trash2, 
  KeyRound, 
  RotateCcw, 
  Save, 
  X, 
  Check, 
  Lock,
  Layers,
  Database
} from 'lucide-react';
import { User, UserPermissions, UserRole } from '../types';

interface PermissionsViewProps {
  onOpenContinueModal: () => void;
}

export const PermissionsView: React.FC<PermissionsViewProps> = ({ onOpenContinueModal }) => {
  const { users, currentUser, addUser, updateUser, deleteUser } = useInventory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<{
    username: string;
    password?: string;
    fullName: string;
    role: UserRole;
    roleTitle: string;
    department: string;
    email: string;
    avatarUrl: string;
    isActive: boolean;
    permissions: UserPermissions;
  }>({
    username: '',
    password: 'password123',
    fullName: '',
    role: 'warehouse_officer',
    roleTitle: 'เจ้าหน้าที่คลังสินค้า',
    department: 'ฝ่ายคลังสินค้าและการจัดส่ง',
    email: '',
    avatarUrl: '',
    isActive: true,
    permissions: {
      manageProducts: true,
      stockIn: true,
      stockOut: true,
      checkBalance: true,
      viewReports: true,
      managePermissions: false,
    },
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      password: 'password123',
      fullName: '',
      role: 'warehouse_officer',
      roleTitle: 'เจ้าหน้าที่คลังสินค้า',
      department: 'ฝ่ายคลังสินค้าและการจัดส่ง',
      email: '',
      avatarUrl: '',
      isActive: true,
      permissions: {
        manageProducts: true,
        stockIn: true,
        stockOut: true,
        checkBalance: true,
        viewReports: true,
        managePermissions: false,
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: user.password || 'password123',
      fullName: user.fullName,
      role: user.role,
      roleTitle: user.roleTitle,
      department: user.department,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      permissions: { ...user.permissions },
    });
    setIsModalOpen(true);
  };

  const handleRolePresetChange = (role: UserRole) => {
    let roleTitle = 'เจ้าหน้าที่คลังสินค้า';
    let permissions: UserPermissions = {
      manageProducts: true,
      stockIn: true,
      stockOut: true,
      checkBalance: true,
      viewReports: true,
      managePermissions: false,
    };

    if (role === 'admin') {
      roleTitle = 'ผู้ดูแลระบบ (Admin)';
      permissions = {
        manageProducts: true,
        stockIn: true,
        stockOut: true,
        checkBalance: true,
        viewReports: true,
        managePermissions: true,
      };
    } else if (role === 'auditor') {
      roleTitle = 'เจ้าหน้าที่ตรวจสอบสต็อก (Auditor)';
      permissions = {
        manageProducts: false,
        stockIn: false,
        stockOut: false,
        checkBalance: true,
        viewReports: true,
        managePermissions: false,
      };
    } else if (role === 'purchasing') {
      roleTitle = 'เจ้าหน้าที่จัดซื้อ (Purchasing)';
      permissions = {
        manageProducts: true,
        stockIn: true,
        stockOut: false,
        checkBalance: true,
        viewReports: true,
        managePermissions: false,
      };
    }

    setFormData(prev => ({
      ...prev,
      role,
      roleTitle,
      permissions,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ffc9b6]/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#b83350] mb-1">
            <span className="bg-[#ffb6c1]/25 px-2 py-0.5 rounded border border-[#ffb6c1]/40">
              จัดการสิทธิ์การใช้งาน
            </span>
            <span>➔</span>
            <span>ฐานข้อมูล</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            จัดการสิทธิ์การใช้งาน (User Roles & Permissions)
          </h1>
          <p className="text-xs text-slate-500">
            กำหนดบทบาทหน้าที่ สิทธิ์การเข้าถึงแต่ละโมดูล และความปลอดภัยในระบบ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenContinueModal}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-[#ffc9b6] hover:bg-[#ffc9b6]/20 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#b83350]" />
            <span>ทำงานต่อ / ออกจากระบบ</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 text-xs font-bold text-slate-900 gradient-theme hover:opacity-95 rounded-xl transition-all flex items-center gap-1.5 shadow-xs border border-[#ffb6c1]"
          >
            <UserPlus className="w-4 h-4 text-slate-900" />
            <span>เพิ่มผู้ใช้งานใหม่</span>
          </button>
        </div>
      </div>

      {/* Users List Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">
              รายชื่อผู้ใช้งานและตารางกำหนดสิทธิ์ในฐานข้อมูล
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            ทั้งหมด {users.length} บัญชี
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <th className="py-3 px-4">ผู้ใช้งาน</th>
                <th className="py-3 px-4">บทบาท & แผนก</th>
                <th className="py-3 px-3 text-center">จัดการสินค้า</th>
                <th className="py-3 px-3 text-center">รับสินค้าเข้า</th>
                <th className="py-3 px-3 text-center">เบิกออกจากคลัง</th>
                <th className="py-3 px-3 text-center">ตรวจนับคงเหลือ</th>
                <th className="py-3 px-3 text-center">ดูรายงาน</th>
                <th className="py-3 px-3 text-center">จัดการสิทธิ์</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
                <th className="py-3 px-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const isCurrent = currentUser?.id === u.id;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold flex items-center justify-center font-mono">
                          {u.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{u.fullName}</span>
                            {isCurrent && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-normal">
                                คุณ
                              </span>
                            )}
                          </p>
                          <p className="font-mono text-[11px] text-slate-400">@{u.username}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 block">{u.roleTitle}</span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[160px] block">{u.department}</span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block w-4 h-4 rounded-full text-center leading-4 text-[10px] font-bold ${
                        u.permissions.manageProducts ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-300'
                      }`}>
                        {u.permissions.manageProducts ? '✓' : '-'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block w-4 h-4 rounded-full text-center leading-4 text-[10px] font-bold ${
                        u.permissions.stockIn ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-300'
                      }`}>
                        {u.permissions.stockIn ? '✓' : '-'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block w-4 h-4 rounded-full text-center leading-4 text-[10px] font-bold ${
                        u.permissions.stockOut ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-300'
                      }`}>
                        {u.permissions.stockOut ? '✓' : '-'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block w-4 h-4 rounded-full text-center leading-4 text-[10px] font-bold ${
                        u.permissions.checkBalance ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-300'
                      }`}>
                        {u.permissions.checkBalance ? '✓' : '-'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block w-4 h-4 rounded-full text-center leading-4 text-[10px] font-bold ${
                        u.permissions.viewReports ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-300'
                      }`}>
                        {u.permissions.viewReports ? '✓' : '-'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block w-4 h-4 rounded-full text-center leading-4 text-[10px] font-bold ${
                        u.permissions.managePermissions ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-300'
                      }`}>
                        {u.permissions.managePermissions ? '✓' : '-'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {u.isActive ? 'เปิดใช้งาน' : 'ระงับชั่วคราว'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          title="แก้ไขสิทธิ์"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {!isCurrent && (
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="ลบผู้ใช้"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingUser ? 'แก้ไขข้อมูลและสิทธิ์ผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่ในระบบ'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    กำหนดบทบาทและสิทธิ์การเข้าถึงโมดูลทั้ง 6
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ชื่อผู้ใช้งาน (Username) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="เช่น thanaporn.s"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    รหัสผ่าน (Password)
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ชื่อ - นามสกุลจริง *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="เช่น ธนพร สุขเกษม"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    บทบาทหลัก (Role Preset)
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRolePresetChange(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="warehouse_officer">เจ้าหน้าที่คลังสินค้า</option>
                    <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                    <option value="auditor">ผู้ตรวจสอบสต็อก (Auditor)</option>
                    <option value="purchasing">เจ้าหน้าที่จัดซื้อ (Purchaser)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    สังกัดแผนก
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="เช่น ฝ่ายคลังสินค้าและการจัดส่ง"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Granular Module Permissions */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-semibold text-slate-800 block">
                  กำหนดสิทธิ์รายโมดูล (Granular Permissions):
                </span>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.manageProducts}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, manageProducts: e.target.checked }
                      })}
                      className="rounded text-indigo-600"
                    />
                    <span>จัดการสินค้า (เพิ่ม-แก้)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.stockIn}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, stockIn: e.target.checked }
                      })}
                      className="rounded text-indigo-600"
                    />
                    <span>บันทึกรับเข้า (Stock-In)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.stockOut}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, stockOut: e.target.checked }
                      })}
                      className="rounded text-indigo-600"
                    />
                    <span>บันทึกเบิกออก (Stock-Out)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.checkBalance}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, checkBalance: e.target.checked }
                      })}
                      className="rounded text-indigo-600"
                    />
                    <span>ตรวจสอบสต็อก & ปรับยอด</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.viewReports}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, viewReports: e.target.checked }
                      })}
                      className="rounded text-indigo-600"
                    />
                    <span>ดูรายงานยอดสินค้า</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.managePermissions}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, managePermissions: e.target.checked }
                      })}
                      className="rounded text-indigo-600"
                    />
                    <span className="text-purple-700 font-medium">จัดการสิทธิ์ผู้ใช้อื่น</span>
                  </label>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-medium text-slate-700">สถานะการใช้งานบัญชี:</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors ${
                    formData.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {formData.isActive ? 'เปิดใช้งาน (Active)' : 'ระงับชั่วคราว (Suspended)'}
                </button>
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
                  <span>บันทึกข้อมูลสิทธิ์ลงฐานข้อมูล</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
