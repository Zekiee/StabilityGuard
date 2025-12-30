export enum TimeSlotType {
  GOLD = 'GOLD',     // 黄金时段 18:00 - 24:00
  SILVER = 'SILVER', // 白银时段 09:00 - 18:00
  BRONZE = 'BRONZE'  // 青铜时段 24:00 - 09:00
}

export enum DiscoveryChannel {
  MONITORING = 'MONITORING', // 监控发现 (系数 1.0)
  USER_COMPLAINT = 'USER_COMPLAINT' // 用户客诉 (系数 1.5)
}

export enum IncidentLevel {
  P0 = 'P0', // 100% 影响
  P1 = 'P1', // 50% 影响
  P2 = 'P2', // 局部 / 按比例计算
  P3 = 'P3'  // 轻微
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  startTime: string; // ISO String
  detectionTime: string; // ISO String
  recoveryTime: string; // ISO String
  impactCoef: number; // 0.0 - 1.0
  discoveryChannel: DiscoveryChannel;
  isZeroTolerance: boolean; // 重复错误、低级失误等
  isGrayScale: boolean; // 灰度发布豁免
  cost: number;
  mttrMinutes: number;
  lossDurationMinutes: number;
  createdAt: string;
}

export interface BudgetConfig {
  annualTotal: number;
  quarterlyWarning: number;
  currency: string;
}

export const CONSTANTS = {
  RATES: {
    [TimeSlotType.GOLD]: 1800,
    [TimeSlotType.SILVER]: 555,
    [TimeSlotType.BRONZE]: 200,
  },
  BUDGET: {
    ANNUAL: 1500000,
    QUARTERLY_LIMIT: 375000,
  }
};