import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Product, 
  StockTransaction, 
  SystemFlowStep, 
  TransactionType 
} from '../types';
import { INITIAL_USERS, INITIAL_PRODUCTS, INITIAL_TRANSACTIONS, resolveDollImageUrl } from '../data/mockData';

interface SystemNotification {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
}

interface InventoryContextType {
  currentUser: User | null;
  currentStep: SystemFlowStep;
  setCurrentStep: (step: SystemFlowStep) => void;
  users: User[];
  products: Product[];
  transactions: StockTransaction[];
  notification: SystemNotification | null;
  clearNotification: () => void;
  showNotification: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
  
  // Auth flow
  login: (username: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  continueWorking: () => void;
  restartSystem: () => void;
  
  // Product management
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Stock operations
  recordStockIn: (params: {
    productId: string;
    quantity: number;
    referenceNo: string;
    supplier: string;
    notes?: string;
    unitCost?: number;
  }) => StockTransaction | null;
  
  recordStockOut: (params: {
    productId: string;
    quantity: number;
    referenceNo: string;
    department: string;
    notes?: string;
  }) => { success: boolean; transaction?: StockTransaction; error?: string };

  adjustStock: (productId: string, newStock: number, reason: string) => StockTransaction | null;
  
  // User & permissions
  addUser: (userData: Omit<User, 'id'>) => User;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Utilities
  resetToDefaultData: () => void;
  activeFlowPath: string[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence keys
  const USERS_KEY = 'phichiankaew_dolls_users_v5';
  const PRODUCTS_KEY = 'phichiankaew_dolls_products_v5';
  const TRANSACTIONS_KEY = 'phichiankaew_dolls_tx_v5';
  const CURRENT_USER_KEY = 'phichiankaew_dolls_current_user_v5';

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_KEY) || localStorage.getItem('phichiankaew_dolls_users_v4');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_KEY) || localStorage.getItem('phichiankaew_dolls_products_v4');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.map(p => {
          const match = INITIAL_PRODUCTS.find(ip => ip.id === p.id || ip.sku === p.sku);
          return {
            ...p,
            imageUrl: resolveDollImageUrl(p.imageUrl || match?.imageUrl),
          };
        });
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [transactions, setTransactions] = useState<StockTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(TRANSACTIONS_KEY) || localStorage.getItem('phichiankaew_dolls_tx_v3');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Current system step in the flow diagram
  const [currentStep, setCurrentStep] = useState<SystemFlowStep>(() => {
    return currentUser ? 'DASHBOARD' : 'LOGIN';
  });

  const [notification, setNotification] = useState<SystemNotification | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setNotification({
      type,
      title,
      message,
      timestamp: Date.now(),
    });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  // Flow step 1 & 2: ผู้ใช้งานเข้าสู่ระบบ -> ตรวจสอบชื่อผู้ใช้งาน
  const login = (username: string, password?: string) => {
    // 2. ตรวจสอบชื่อผู้ใช้งาน
    setCurrentStep('VERIFY_USER');

    const trimmed = username.trim().toLowerCase();
    const user = users.find(u => u.username.toLowerCase() === trimmed);

    if (!user) {
      // ข้อมูลไม่ถูกต้อง -> แจ้งเตือนและเข้าสู่ระบบใหม่
      setCurrentStep('LOGIN_FAILED');
      showNotification('error', 'ข้อมูลไม่ถูกต้อง', 'ไม่พบบัญชีผู้ใช้งานนี้ในฐานข้อมูล กรุณาตรวจสอบและเข้าสู่ระบบใหม่');
      return { success: false, error: 'ไม่พบชื่อผู้ใช้งานในระบบ' };
    }

    if (!user.isActive) {
      setCurrentStep('LOGIN_FAILED');
      showNotification('warning', 'บัญชีถูกระงับ', 'บัญชีผู้ใช้นี้ถูกระงับสิทธิ์การเข้าถึงชั่วคราว ติดต่อผู้ดูแลระบบ');
      return { success: false, error: 'บัญชีผู้ใช้นี้ถูกระงับสิทธิ์' };
    }

    if (password && user.password && user.password !== password) {
      setCurrentStep('LOGIN_FAILED');
      showNotification('error', 'รหัสผ่านไม่ถูกต้อง', 'รหัสผ่านไม่ตรงกับฐานข้อมูล กรุณาลองใหม่อีกครั้ง');
      return { success: false, error: 'รหัสผ่านไม่ถูกต้อง' };
    }

    // ข้อมูลถูกต้อง -> บันทึกลงฐานข้อมูล & แสดงหน้าหลักของระบบ
    const updatedUser = {
      ...user,
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    setCurrentStep('DASHBOARD');
    showNotification('success', 'เข้าสู่ระบบสำเร็จ', `ยินดีต้อนรับ ${updatedUser.fullName} (${updatedUser.roleTitle})`);

    return { success: true };
  };

  // Flow control: ออกจากระบบ -> สิ้นสุด
  const logout = () => {
    setCurrentStep('LOGOUT');
    setTimeout(() => {
      setCurrentUser(null);
      setCurrentStep('END');
    }, 400);
  };

  // Flow control: ทำงานต่อ (ใช่) -> แสดงหน้าหลักของระบบ
  const continueWorking = () => {
    setCurrentStep('DASHBOARD');
    showNotification('info', 'กลับสู่หน้าหลัก', 'พร้อมสำหรับบันทึกรายการถัดไป');
  };

  // Flow control: จากหน้าสิ้นสุด -> เริ่มต้นระบบใหม่
  const restartSystem = () => {
    setCurrentUser(null);
    setCurrentStep('LOGIN');
    clearNotification();
  };

  // 4a. จัดการข้อมูลสินค้า: เพิ่มสินค้า
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
    const now = new Date().toISOString().substring(0, 10);
    const newId = `prod-${String(products.length + 1).padStart(3, '0')}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };

    setProducts(prev => [newProduct, ...prev]);

    // Record initial stock transaction if quantity > 0
    if (newProduct.currentStock > 0 && currentUser) {
      const txNum = `RC-${now.replace(/-/g, '').substring(0, 6)}-${String(transactions.length + 1).padStart(3, '0')}`;
      const newTx: StockTransaction = {
        id: `tx-${Date.now()}`,
        transactionNumber: txNum,
        type: 'IN',
        productId: newProduct.id,
        productName: newProduct.name,
        sku: newProduct.sku,
        quantity: newProduct.currentStock,
        beforeStock: 0,
        afterStock: newProduct.currentStock,
        referenceNo: 'INIT-STOCK',
        partnerOrDepartment: newProduct.supplierName || 'ยอดยกมาเริ่มต้น',
        notes: 'ลงทะเบียนสินค้าใหม่พร้อมยอดยกมา',
        operatorId: currentUser.id,
        operatorName: currentUser.fullName,
        unitCost: newProduct.costPrice,
        totalValue: newProduct.currentStock * newProduct.costPrice,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      setTransactions(prev => [newTx, ...prev]);
    }

    showNotification('success', 'บันทึกข้อมูลสินค้าเรียบร้อย', `เพิ่ม ${newProduct.name} (SKU: ${newProduct.sku}) สู่ฐานข้อมูลแล้ว`);
    return newProduct;
  };

  // 4a. จัดการข้อมูลสินค้า: แก้ไขสินค้า
  const updateProduct = (id: string, updates: Partial<Product>) => {
    const now = new Date().toISOString().substring(0, 10);
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          updatedAt: now,
        };
      }
      return p;
    }));
    showNotification('success', 'อัปเดตข้อมูลสำเร็จ', 'ข้อมูลสินค้าถูกบันทึกลงฐานข้อมูลแล้ว');
  };

  // 4a. จัดการข้อมูลสินค้า: ลบสินค้า
  const deleteProduct = (id: string) => {
    const target = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showNotification('info', 'ลบสินค้าเรียบร้อย', `ลบรายการ ${target?.name || id} ออกจากฐานข้อมูลแล้ว`);
  };

  // 4b. บันทึกรายการสินค้าเข้า (Goods Receipt / Stock In) -> บันทึกข้อมูล -> ฐานข้อมูล
  const recordStockIn = (params: {
    productId: string;
    quantity: number;
    referenceNo: string;
    supplier: string;
    notes?: string;
    unitCost?: number;
  }): StockTransaction | null => {
    if (!currentUser) return null;

    const product = products.find(p => p.id === params.productId);
    if (!product) {
      showNotification('error', 'ไม่พบสินค้า', 'รหัสสินค้าไม่ถูกต้องในฐานข้อมูล');
      return null;
    }

    if (params.quantity <= 0) {
      showNotification('error', 'จำนวนไม่ถูกต้อง', 'กรุณาระบุจำนวนสินค้าเข้าที่มากกว่า 0');
      return null;
    }

    const beforeStock = product.currentStock;
    const afterStock = beforeStock + params.quantity;
    const cost = params.unitCost !== undefined ? params.unitCost : product.costPrice;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const dateNum = new Date().toISOString().substring(0, 10).replace(/-/g, '').substring(0, 6);
    const txNum = `RC-${dateNum}-${String(transactions.length + 1).padStart(3, '0')}`;

    const newTx: StockTransaction = {
      id: `tx-${Date.now()}`,
      transactionNumber: txNum,
      type: 'IN',
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: params.quantity,
      beforeStock,
      afterStock,
      referenceNo: params.referenceNo || `PO-${Date.now().toString().slice(-4)}`,
      partnerOrDepartment: params.supplier || product.supplierName || 'ซัพพลายเออร์ทั่วไป',
      notes: params.notes,
      operatorId: currentUser.id,
      operatorName: currentUser.fullName,
      unitCost: cost,
      totalValue: params.quantity * cost,
      timestamp: nowStr,
    };

    // Update product stock in database
    setProducts(prev => prev.map(p => {
      if (p.id === product.id) {
        return {
          ...p,
          currentStock: afterStock,
          costPrice: params.unitCost ? params.unitCost : p.costPrice,
          updatedAt: nowStr.substring(0, 10),
        };
      }
      return p;
    }));

    // Record transaction
    setTransactions(prev => [newTx, ...prev]);

    showNotification(
      'success',
      'บันทึกรายการสินค้าเข้าสำเร็จ',
      `บันทึกรับเข้า ${product.name} จำนวน +${params.quantity} ${product.unit} (คงเหลือใหม่: ${afterStock})`
    );

    return newTx;
  };

  // 4c. บันทึกสินค้าเบิกออกจากคลัง (Goods Issue / Stock Out) -> บันทึกข้อมูล -> ฐานข้อมูล
  const recordStockOut = (params: {
    productId: string;
    quantity: number;
    referenceNo: string;
    department: string;
    notes?: string;
  }): { success: boolean; transaction?: StockTransaction; error?: string } => {
    if (!currentUser) return { success: false, error: 'กรุณาเข้าสู่ระบบ' };

    const product = products.find(p => p.id === params.productId);
    if (!product) {
      showNotification('error', 'ไม่พบสินค้า', 'รหัสสินค้าไม่ถูกต้องในฐานข้อมูล');
      return { success: false, error: 'ไม่พบสินค้าในระบบ' };
    }

    if (params.quantity <= 0) {
      showNotification('error', 'จำนวนไม่ถูกต้อง', 'กรุณาระบุจำนวนเบิกที่มากกว่า 0');
      return { success: false, error: 'จำนวนต้องมากกว่า 0' };
    }

    if (params.quantity > product.currentStock) {
      showNotification(
        'error',
        'สต็อกไม่เพียงพอสำหรับการเบิก',
        `สินค้า ${product.name} มีคงเหลือ ${product.currentStock} ${product.unit} ซึ่งน้อยกว่าจำนวนที่ขอเบิก (${params.quantity})`
      );
      return { 
        success: false, 
        error: `สินค้าคงเหลือไม่พอ (มีเพียง ${product.currentStock} ${product.unit})` 
      };
    }

    const beforeStock = product.currentStock;
    const afterStock = beforeStock - params.quantity;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const dateNum = new Date().toISOString().substring(0, 10).replace(/-/g, '').substring(0, 6);
    const txNum = `IS-${dateNum}-${String(transactions.length + 1).padStart(3, '0')}`;

    const newTx: StockTransaction = {
      id: `tx-${Date.now()}`,
      transactionNumber: txNum,
      type: 'OUT',
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: params.quantity,
      beforeStock,
      afterStock,
      referenceNo: params.referenceNo || `REQ-${Date.now().toString().slice(-4)}`,
      partnerOrDepartment: params.department || 'แผนกที่เบิก',
      notes: params.notes,
      operatorId: currentUser.id,
      operatorName: currentUser.fullName,
      unitCost: product.costPrice,
      totalValue: params.quantity * product.costPrice,
      timestamp: nowStr,
    };

    // Update product stock in database
    setProducts(prev => prev.map(p => {
      if (p.id === product.id) {
        return {
          ...p,
          currentStock: afterStock,
          updatedAt: nowStr.substring(0, 10),
        };
      }
      return p;
    }));

    // Record transaction
    setTransactions(prev => [newTx, ...prev]);

    showNotification(
      'success',
      'บันทึกการเบิกสินค้าสำเร็จ',
      `เบิกจ่าย ${product.name} จำนวน -${params.quantity} ${product.unit} (คงเหลือ: ${afterStock})`
    );

    return { success: true, transaction: newTx };
  };

  // 4d. ค้นหา ตรวจสอบสินค้าคงเหลือ -> ปรับยอดสต็อกจากการตรวจนับ (Auditing Adjustment)
  const adjustStock = (productId: string, newStock: number, reason: string): StockTransaction | null => {
    if (!currentUser) return null;
    const product = products.find(p => p.id === productId);
    if (!product) return null;

    const beforeStock = product.currentStock;
    const diff = newStock - beforeStock;
    if (diff === 0) return null;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const dateNum = new Date().toISOString().substring(0, 10).replace(/-/g, '').substring(0, 6);
    const txNum = `ADJ-${dateNum}-${String(transactions.length + 1).padStart(3, '0')}`;

    const newTx: StockTransaction = {
      id: `tx-${Date.now()}`,
      transactionNumber: txNum,
      type: 'ADJUST',
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: Math.abs(diff),
      beforeStock,
      afterStock: newStock,
      referenceNo: `AUDIT-${dateNum}`,
      partnerOrDepartment: 'การตรวจนับสต็อกประจำงวด',
      notes: `ปรับยอดตรวจนับจริง: ${reason} (${diff > 0 ? `+${diff}` : diff})`,
      operatorId: currentUser.id,
      operatorName: currentUser.fullName,
      unitCost: product.costPrice,
      totalValue: Math.abs(diff) * product.costPrice,
      timestamp: nowStr,
    };

    setProducts(prev => prev.map(p => p.id === productId ? { ...p, currentStock: newStock, updatedAt: nowStr.substring(0, 10) } : p));
    setTransactions(prev => [newTx, ...prev]);

    showNotification(
      'info',
      'ปรับยอดตรวจนับสำเร็จ',
      `ปรับยอด ${product.name} จาก ${beforeStock} เป็น ${newStock} ${product.unit}`
    );

    return newTx;
  };

  // 4f. จัดการสิทธิ์การใช้งาน: เพิ่มผู้ใช้
  const addUser = (userData: Omit<User, 'id'>): User => {
    const newId = `usr-${String(users.length + 1).padStart(3, '0')}`;
    const newUser: User = {
      ...userData,
      id: newId,
    };
    setUsers(prev => [...prev, newUser]);
    showNotification('success', 'เพิ่มผู้ใช้งานสำเร็จ', `สร้างบัญชี ${newUser.fullName} (${newUser.username}) เรียบร้อย`);
    return newUser;
  };

  // 4f. จัดการสิทธิ์การใช้งาน: แก้ไขสิทธิ์
  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
    showNotification('success', 'อัปเดตสิทธิ์สำเร็จ', 'สิทธิ์และข้อมูลผู้ใช้งานถูกบันทึกลงฐานข้อมูลแล้ว');
  };

  // 4f. จัดการสิทธิ์การใช้งาน: ลบผู้ใช้
  const deleteUser = (id: string) => {
    if (currentUser?.id === id) {
      showNotification('error', 'ไม่สามารถลบได้', 'ไม่สามารถลบบัญชีที่กำลังล็อกอินใช้งานอยู่');
      return;
    }
    const target = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    showNotification('info', 'ลบผู้ใช้สำเร็จ', `ลบบัญชี ${target?.fullName || id} เรียบร้อยแล้ว`);
  };

  // Reset to default data
  const resetToDefaultData = () => {
    setUsers(INITIAL_USERS);
    setProducts(INITIAL_PRODUCTS);
    setTransactions(INITIAL_TRANSACTIONS);
    showNotification('info', 'รีเซ็ตข้อมูลแล้ว', 'รีเซ็ตข้อมูลตัวอย่างทั้งหมดเรียบร้อยแล้ว');
  };

  // Active flow calculation for visual diagram highlighting
  const activeFlowPath = (() => {
    switch (currentStep) {
      case 'LOGIN':
        return ['ผู้ใช้งานเข้าสู่ระบบ'];
      case 'VERIFY_USER':
        return ['ผู้ใช้งานเข้าสู่ระบบ', 'ตรวจสอบชื่อผู้ใช้งาน'];
      case 'LOGIN_FAILED':
        return ['ผู้ใช้งานเข้าสู่ระบบ', 'ตรวจสอบชื่อผู้ใช้งาน', 'ข้อมูลไม่ถูกต้อง', 'แจ้งเตือนและเข้าสู่ระบบใหม่'];
      case 'DASHBOARD':
        return ['ผู้ใช้งานเข้าสู่ระบบ', 'ตรวจสอบชื่อผู้ใช้งาน', 'ข้อมูลถูกต้อง', 'ฐานข้อมูล', 'แสดงหน้าหลักของระบบ'];
      case 'MANAGE_PRODUCTS':
        return ['แสดงหน้าหลักของระบบ', 'จัดการข้อมูลสินค้า เพิ่ม-แก้ไข-ค้นหา', 'บันทึกข้อมูล', 'ฐานข้อมูล', 'ทำงานต่อ'];
      case 'STOCK_IN':
        return ['แสดงหน้าหลักของระบบ', 'บันทึกรายการสินค้าเข้า', 'บันทึกข้อมูล', 'ฐานข้อมูล', 'ทำงานต่อ'];
      case 'STOCK_OUT':
        return ['แสดงหน้าหลักของระบบ', 'บันทึกสินค้าเบิกออกจากคลัง', 'บันทึกข้อมูล', 'ฐานข้อมูล', 'ทำงานต่อ'];
      case 'CHECK_BALANCE':
        return ['แสดงหน้าหลักของระบบ', 'ค้นหา ตรวจสอบสินค้าคงเหลือ', 'ทำงานต่อ'];
      case 'REPORTS':
        return ['แสดงหน้าหลักของระบบ', 'รายงานยอดสินค้าทั้งหมด', 'ทำงานต่อ'];
      case 'PERMISSIONS':
        return ['แสดงหน้าหลักของระบบ', 'จัดการสิทธิ์การใช้งาน', 'ฐานข้อมูล', 'ทำงานต่อ'];
      case 'SAVE_DATA':
        return ['บันทึกข้อมูล', 'ฐานข้อมูล', 'ทำงานต่อ'];
      case 'CONTINUE_PROMPT':
        return ['ทำงานต่อ'];
      case 'LOGOUT':
        return ['ทำงานต่อ', 'ออกจากระบบ'];
      case 'END':
        return ['ออกจากระบบ', 'สิ้นสุด'];
      default:
        return [];
    }
  })();

  return (
    <InventoryContext.Provider
      value={{
        currentUser,
        currentStep,
        setCurrentStep,
        users,
        products,
        transactions,
        notification,
        clearNotification,
        showNotification,
        login,
        logout,
        continueWorking,
        restartSystem,
        addProduct,
        updateProduct,
        deleteProduct,
        recordStockIn,
        recordStockOut,
        adjustStock,
        addUser,
        updateUser,
        deleteUser,
        resetToDefaultData,
        activeFlowPath,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
