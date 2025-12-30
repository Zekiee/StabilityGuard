import React, { createContext, useContext, useState, useEffect } from 'react';
import { Incident, CONSTANTS, IncidentLevel, DiscoveryChannel } from './types';
import { calculateIncidentFinancials } from './utils';

interface AppState {
  incidents: Incident[];
  addIncident: (incident: Omit<Incident, 'id' | 'cost' | 'mttrMinutes' | 'lossDurationMinutes' | 'createdAt'>) => void;
  deleteIncident: (id: string) => void;
  annualBudget: number;
}

const AppContext = createContext<AppState | undefined>(undefined);

// 初始模拟数据
const MOCK_INCIDENTS: Incident[] = [
  {
    id: '1',
    title: '登录服务高延迟',
    description: '数据库连接池饱和导致登录超时。',
    startTime: new Date(new Date().getFullYear(), new Date().getMonth(), 10, 19, 0).toISOString(),
    detectionTime: new Date(new Date().getFullYear(), new Date().getMonth(), 10, 19, 5).toISOString(),
    recoveryTime: new Date(new Date().getFullYear(), new Date().getMonth(), 10, 19, 20).toISOString(),
    impactCoef: 0.5,
    discoveryChannel: DiscoveryChannel.MONITORING,
    isZeroTolerance: false,
    isGrayScale: false,
    cost: 18000, // 近似计算
    mttrMinutes: 15,
    lossDurationMinutes: 20,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: '支付网关故障',
    description: '第三方支付证书过期，导致无法充值。',
    startTime: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 14, 0).toISOString(),
    detectionTime: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 14, 30).toISOString(),
    recoveryTime: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 15, 0).toISOString(),
    impactCoef: 1.0,
    discoveryChannel: DiscoveryChannel.USER_COMPLAINT,
    isZeroTolerance: false,
    isGrayScale: false,
    cost: 74925, // 60 mins * 555 * 1.5 (MTTR) * 1.5 (User)
    mttrMinutes: 30,
    lossDurationMinutes: 60,
    createdAt: new Date().toISOString()
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);

  const addIncident = (data: Omit<Incident, 'id' | 'cost' | 'mttrMinutes' | 'lossDurationMinutes' | 'createdAt'>) => {
    const financials = calculateIncidentFinancials(
      data.startTime,
      data.recoveryTime,
      data.detectionTime,
      data.impactCoef,
      data.discoveryChannel,
      data.isZeroTolerance,
      data.isGrayScale
    );

    const newIncident: Incident = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      cost: financials.cost,
      mttrMinutes: financials.mttrMinutes,
      lossDurationMinutes: financials.lossDurationMinutes,
      createdAt: new Date().toISOString()
    };

    setIncidents(prev => [newIncident, ...prev]);
  };

  const deleteIncident = (id: string) => {
    setIncidents(prev => prev.filter(i => i.id !== id));
  };

  return (
    <AppContext.Provider value={{ incidents, addIncident, deleteIncident, annualBudget: CONSTANTS.BUDGET.ANNUAL }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};