import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, FileText, ShieldAlert } from 'lucide-react';

const Sidebar = () => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="w-64 bg-slate-900 min-h-screen text-slate-100 flex flex-col fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-8 h-8 text-indigo-500" />
          <span className="text-xl font-bold tracking-tight">StabilityGuard</span>
        </div>
        <p className="text-xs text-slate-500 mt-2">量化 SRE 评估平台</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/" className={navClass}>
          <LayoutDashboard className="w-5 h-5" />
          <span>仪表盘</span>
        </NavLink>
        <NavLink to="/incidents" className={navClass}>
          <AlertTriangle className="w-5 h-5" />
          <span>事故记录</span>
        </NavLink>
        <NavLink to="/rules" className={navClass}>
          <FileText className="w-5 h-5" />
          <span>规则与政策</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500">
          <p>年度错误预算</p>
          <p className="font-mono text-slate-300">¥ 1,500,000</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;