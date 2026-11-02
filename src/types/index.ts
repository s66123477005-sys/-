export type UserRole = 'admin' | 'warehouse_officer' | 'auditor' | 'purchasing';

export interface UserPermissions {
  manageProducts: boolean;
  stockIn: boolean;
  stockOut: boolean;
  checkBalance: boolean;
  viewReports: boolean;
  managePermissions: boolean;
}

export interface User {
  id: string;
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
  lastLogin?: string;
}

export type ProductCategory = 
  | 'ตุ๊กตาหมีและสัตว์ขนปุย'
  | 'ตุ๊กตาคาแรคเตอร์ & อนิเมะ'
  | 'ตุ๊กตาผ้าฝ้ายแฮนด์เมด'
  | 'พวงกุญแจตุ๊กตา & กระเป๋า'
  | 'ชุดของขวัญ & ช่อดอกไม้ตุ๊กตา'
  | 'เสื้อผ้าตุ๊กตา & อุปกรณ์ตกแต่ง';

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: ProductCategory;
  unit: string; // เช่น ชิ้น, กล่อง, ม้วน, กิโลกรัม
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  shelfLocation: string; // เช่น A-01-02
  description?: string;
  supplierName?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 'IN' | 'OUT' | 'ADJUST';

export interface StockTransaction {
  id: string;
  transactionNumber: string; // e.g. RC-202611-001 or IS-202611-001
  type: TransactionType;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  beforeStock: number;
  afterStock: number;
  referenceNo: string; // เช่น PO-1029, SO-4421, AUDIT-01
  partnerOrDepartment: string; // ชื่อผู้จำหน่าย หรือ แผนกที่เบิก
  notes?: string;
  operatorId: string;
  operatorName: string;
  unitCost: number;
  totalValue: number;
  timestamp: string;
}

// Flow diagram steps matching the PDF
export type SystemFlowStep =
  | 'LOGIN'               // 1. ผู้ใช้งานเข้าสู่ระบบ
  | 'VERIFY_USER'         // 2. ตรวจสอบชื่อผู้ใช้งาน
  | 'LOGIN_FAILED'        // 2b. แจ้งเตือนและเข้าสู่ระบบใหม่ (ข้อมูลไม่ถูกต้อง)
  | 'DASHBOARD'           // 3. แสดงหน้าหลักของระบบ
  | 'MANAGE_PRODUCTS'     // 4a. จัดการข้อมูลสินค้า เพิ่ม-แก้ไข-ค้นหา
  | 'STOCK_IN'            // 4b. บันทึกรายการสินค้าเข้า
  | 'STOCK_OUT'           // 4c. บันทึกสินค้าเบิกออกจากคลัง
  | 'CHECK_BALANCE'       // 4d. ค้นหา ตรวจสอบสินค้าคงเหลือ
  | 'REPORTS'             // 4e. รายงานยอดสินค้าทั้งหมด
  | 'PERMISSIONS'         // 4f. จัดการสิทธิ์การใช้งาน
  | 'SAVE_DATA'           // 5. บันทึกข้อมูล (ฐานข้อมูล)
  | 'CONTINUE_PROMPT'     // 6. ทำงานต่อ? (ใช่ / ไม่)
  | 'LOGOUT'              // 7. ออกจากระบบ
  | 'END';                // 8. สิ้นสุด
