import { CONSTANTS, DiscoveryChannel, TimeSlotType } from './types';

export const getMinutesDifference = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.max(0, (endDate.getTime() - startDate.getTime()) / (1000 * 60));
};

const getTimeSlotRate = (date: Date): number => {
  const hour = date.getHours();
  // 黄金时段: 18:00 - 24:00 (18, 19, 20, 21, 22, 23 点)
  if (hour >= 18 && hour < 24) return CONSTANTS.RATES[TimeSlotType.GOLD];
  // 白银时段: 09:00 - 18:00 (9 点到 17 点)
  if (hour >= 9 && hour < 18) return CONSTANTS.RATES[TimeSlotType.SILVER];
  // 青铜时段: 24:00 - 09:00 (0 点到 8 点)
  return CONSTANTS.RATES[TimeSlotType.BRONZE];
};

export const calculateBaseCost = (startStr: string, endStr: string): number => {
  let current = new Date(startStr);
  const end = new Date(endStr);
  let totalBaseCost = 0;

  // 逐分钟迭代以准确处理跨时段的情况
  while (current < end) {
    totalBaseCost += getTimeSlotRate(current);
    current = new Date(current.getTime() + 60000); // 增加 1 分钟
  }
  
  return totalBaseCost;
};

export const getMTTRCoefficient = (mttrMinutes: number, isZeroTolerance: boolean): number => {
  // 零容忍条款意味着没有减免系数。
  // 标准逻辑:
  // < 5 分钟: 0 (免责/神操作)
  // 5 - 15 分钟: 0.5 (减半)
  // 15 - 30 分钟: 1.0 (正常)
  // 30 - 60 分钟: 1.5 (加重)
  // > 60 分钟: 2.0 (灾难)

  if (isZeroTolerance) {
    // 如果触发零容忍，最小系数为 1.0。
    // 惩罚 (> 1.0) 仍然生效，但减免 (< 1.0) 作废。
    if (mttrMinutes > 60) return 2.0;
    if (mttrMinutes > 30) return 1.5;
    return 1.0; 
  }

  if (mttrMinutes < 5) return 0;
  if (mttrMinutes < 15) return 0.5;
  if (mttrMinutes < 30) return 1.0;
  if (mttrMinutes <= 60) return 1.5;
  return 2.0;
};

export const getDiscoveryCoefficient = (channel: DiscoveryChannel): number => {
  return channel === DiscoveryChannel.USER_COMPLAINT ? 1.5 : 1.0;
};

export const calculateIncidentFinancials = (
  start: string,
  end: string,
  detection: string,
  impactCoef: number,
  channel: DiscoveryChannel,
  isZeroTolerance: boolean,
  isGrayScale: boolean
) => {
  const lossDurationMinutes = getMinutesDifference(start, end);
  const mttrMinutes = getMinutesDifference(detection, end);

  // 灰度发布豁免
  if (isGrayScale) {
    return { 
      cost: 0, 
      mttrMinutes: Math.round(mttrMinutes), 
      lossDurationMinutes: Math.round(lossDurationMinutes),
      details: {
        baseCost: 0,
        mttrCoef: 0,
        discoveryCoef: 0
      }
    };
  }

  // 1. 计算基础资损 (分钟数 * 每分钟单价)
  const baseCost = calculateBaseCost(start, end);

  // 2. MTTR 系数
  const mttrCoef = getMTTRCoefficient(mttrMinutes, isZeroTolerance);

  // 3. 发现渠道系数
  const discoveryCoef = getDiscoveryCoefficient(channel);

  // 最终公式
  const finalCost = baseCost * impactCoef * mttrCoef * discoveryCoef;

  console.log("baseCost", baseCost, impactCoef, mttrCoef, discoveryCoef)

  return {
    cost: Math.round(finalCost),
    mttrMinutes: Math.round(mttrMinutes),
    lossDurationMinutes: Math.round(lossDurationMinutes),
    details: {
      baseCost,
      mttrCoef,
      discoveryCoef
    }
  };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 }).format(amount);
};