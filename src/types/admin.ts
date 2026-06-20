export interface DashboardStats {
  coupons: { total: number; active: number; expired: number; pending: number; addedToday: number };
  brands:  { total: number; active: number };
  traffic: { clicksToday: number; clicksThisMonth: number; conversionRate: number };
  revenue: { estimatedThisMonth: number };
  moderation: { pendingCount: number };
}
