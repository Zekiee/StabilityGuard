import React from 'react';
import { useAppStore } from '../store';
import { formatCurrency } from '../utils';
import { CONSTANTS } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { TrendingDown, TrendingUp, AlertOctagon, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const { incidents, annualBudget } = useAppStore();

  // Metrics Calculation
  const totalCost = incidents.reduce((sum, inc) => sum + inc.cost, 0);
  const remainingBudget = annualBudget - totalCost;
  const budgetUsagePercent = (totalCost / annualBudget) * 100;
  
  const quarterlyLimit = CONSTANTS.BUDGET.QUARTERLY_LIMIT;
  
  // Group by Month (Simplified for demo)
  const monthlyData = incidents.reduce((acc: any[], inc) => {
    const date = new Date(inc.startTime);
    const month = date.toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.name === month);
    if (existing) {
      existing.cost += inc.cost;
      existing.count += 1;
    } else {
      acc.push({ name: month, cost: inc.cost, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => new Date(Date.parse(`1 ${a.name} 2022`)).getMonth() - new Date(Date.parse(`1 ${b.name} 2022`)).getMonth());

  // Severity Distribution
  const severityData = [
    { name: '严重 (>¥5万)', value: incidents.filter(i => i.cost > 50000).length, color: '#EF4444' },
    { name: '重大 (>¥1万)', value: incidents.filter(i => i.cost > 10000 && i.cost <= 50000).length, color: '#F59E0B' },
    { name: '轻微 (<¥1万)', value: incidents.filter(i => i.cost <= 10000).length, color: '#10B981' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">财务稳定性概览</h1>
        <div className="text-sm text-slate-500">2024 财年</div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">剩余年度预算</p>
          <div className="mt-2 flex items-baseline">
            <span className={`text-3xl font-bold ${remainingBudget < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {formatCurrency(remainingBudget)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div 
              className={`h-2.5 rounded-full ${budgetUsagePercent > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} 
              style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">已使用 {budgetUsagePercent.toFixed(1)}%</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">累计事故 (年初至今)</p>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold text-slate-800">{incidents.length}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">已记录事件</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">平均恢复时间 (MTTR)</p>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold text-slate-800">
              {incidents.length > 0 ? Math.round(incidents.reduce((a, b) => a + b.mttrMinutes, 0) / incidents.length) : 0}
            </span>
            <span className="ml-1 text-sm text-slate-500">分钟</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Mean Time To Recovery</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">季度状态</p>
           {/* Mocking current quarter cost */}
          <div className="mt-2 flex items-baseline">
             <span className={`text-3xl font-bold ${totalCost > quarterlyLimit ? 'text-red-600' : 'text-slate-800'}`}>
               {totalCost > quarterlyLimit ? '危急' : '安全'}
             </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">红线阈值: {formatCurrency(quarterlyLimit)}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">成本趋势 (月度)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="cost" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">严重程度分布</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {severityData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Incidents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">近期事故</h3>
          <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-full text-slate-600">最近 5 条</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">日期</th>
                <th className="px-6 py-3 font-medium">事故详情</th>
                <th className="px-6 py-3 font-medium">恢复耗时 (MTTR)</th>
                <th className="px-6 py-3 font-medium">发现渠道</th>
                <th className="px-6 py-3 font-medium text-right">资损影响</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incidents.slice(0, 5).map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    {new Date(inc.startTime).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{inc.title}</div>
                    <div className="text-xs text-slate-500 truncate max-w-xs">{inc.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      inc.mttrMinutes > 60 ? 'bg-red-100 text-red-800' : 
                      inc.mttrMinutes > 30 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {inc.mttrMinutes} 分钟
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {inc.discoveryChannel === 'USER_COMPLAINT' ? (
                       <span className="flex items-center text-red-600 gap-1"><AlertOctagon size={14}/> 用户客诉</span>
                    ) : (
                       <span className="flex items-center text-emerald-600 gap-1"><CheckCircle size={14}/> 监控发现</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-900">
                    {formatCurrency(inc.cost)}
                  </td>
                </tr>
              ))}
              {incidents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    暂无事故记录。干得漂亮！
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;