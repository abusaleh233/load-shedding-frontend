/**
 * Types mirrored from the backend's Prisma enums and API response shapes.
 * Keep these in sync with load-shedding-api/prisma/schema/enums.prisma —
 * they are NOT auto-generated, so a backend enum change needs a matching
 * edit here.
 */

export type Role = "ADMIN" | "OPERATOR" | "CONSUMER";

export type SubstationStatus = "ACTIVE" | "MAINTENANCE" | "DECOMMISSIONED";
export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ScheduleStatus = "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
export type OutageType = "SCHEDULED" | "EMERGENCY";
export type OutageLogStatus = "REPORTED" | "IN_PROGRESS" | "RESOLVED";
export type BillStatus = "UNPAID" | "PAID" | "OVERDUE" | "CANCELLED";
export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Substation {
  id: string;
  name: string;
  code: string;
  location: string;
  capacityMW: number;
  status: SubstationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Area {
  id: string;
  name: string;
  feederCode: string;
  substationId: string;
  substation?: Pick<Substation, "id" | "name" | "code">;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  areaId: string;
  area?: Pick<Area, "id" | "name" | "feederCode">;
  startTime: string;
  endTime: string;
  reason: string;
  status: ScheduleStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface OutageLog {
  id: string;
  areaId: string;
  area?: Area & { substation?: Pick<Substation, "id" | "name"> };
  type: OutageType;
  status: OutageLogStatus;
  priority: PriorityLevel;
  description?: string | null;
  startTime: string;
  endTime?: string | null;
  reportedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bill {
  id: string;
  userId: string;
  user?: Pick<User, "id" | "name" | "email">;
  areaId: string;
  area?: Pick<Area, "id" | "name" | "feederCode">;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  unitsConsumedKWh: number;
  amountDue: number; // smallest currency unit
  currency: string;
  status: BillStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  user?: Pick<User, "id" | "name" | "email">;
  billId?: string | null;
  bill?: Pick<Bill, "id" | "billingPeriodStart" | "billingPeriodEnd" | "status">;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripeCheckoutSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  description?: string | null;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string | null;
  user?: Pick<User, "id" | "name" | "email" | "role">;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** The backend's mandatory success envelope: { success, message, data }. */
export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

/** The backend's mandatory error envelope: { success, message, errors }. */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: Array<{ field?: string; message: string }>;
}

/** e.g. PaginatedResponse<Schedule, "schedules"> => { schedules: Schedule[]; pagination: Pagination } */
export type PaginatedResponse<T, Key extends string> = Record<Key, T[]> & { pagination: Pagination };
