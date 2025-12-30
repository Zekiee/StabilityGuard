import React from 'react';

const Rules = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-slate-800">考核规则与政策</h1>
        <p className="text-slate-500 mt-2">核心理念： 用“真金白银”定义稳定性。</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
          <span className="bg-indigo-100 p-1 rounded">1</span> 分钟级资损定价模型
        </h2>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">时段类型</th>
                <th className="px-4 py-3">时间范围</th>
                <th className="px-4 py-3">每分钟基准资损</th>
                <th className="px-4 py-3">备注</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 font-bold text-amber-600">黄金时段</td>
                <td className="px-4 py-3">18:00 - 24:00</td>
                <td className="px-4 py-3 font-mono">¥ 1,800</td>
                <td className="px-4 py-3 text-slate-500">全站瘫痪1分钟，直接+间接损失约1800元。</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-500">白银时段</td>
                <td className="px-4 py-3">09:00 - 18:00</td>
                <td className="px-4 py-3 font-mono">¥ 555</td>
                <td className="px-4 py-3 text-slate-500">常规日间流量。</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-orange-800">青铜时段</td>
                <td className="px-4 py-3">24:00 - 09:00</td>
                <td className="px-4 py-3 font-mono">¥ 200</td>
                <td className="px-4 py-3 text-slate-500">夜间低峰期。</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
            <span className="bg-indigo-100 p-1 rounded">2</span> MTTR 恢复速度系数
          </h2>
          <p className="text-sm text-slate-600">鼓励“快速止血”，将故障影响降到最低。</p>
          <ul className="space-y-2 text-sm bg-white p-4 rounded-lg border border-slate-200">
             <li className="flex justify-between items-center pb-2 border-b border-slate-100">
               <span>&lt; 5 分钟</span>
               <span className="font-bold text-green-600">0x (免责/神操作)</span>
             </li>
             <li className="flex justify-between items-center py-2 border-b border-slate-100">
               <span>5 - 15 分钟</span>
               <span className="font-bold text-green-500">0.5x (减半)</span>
             </li>
             <li className="flex justify-between items-center py-2 border-b border-slate-100">
               <span>15 - 30 分钟</span>
               <span className="font-bold text-slate-700">1.0x (正常)</span>
             </li>
             <li className="flex justify-between items-center py-2 border-b border-slate-100">
               <span>30 - 60 分钟</span>
               <span className="font-bold text-amber-600">1.5x (加重)</span>
             </li>
             <li className="flex justify-between items-center pt-2">
               <span>&gt; 60 分钟</span>
               <span className="font-bold text-red-600">2.0x (灾难)</span>
             </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
            <span className="bg-indigo-100 p-1 rounded">3</span> 零容忍条款
          </h2>
          <p className="text-sm text-slate-600">以下情况不适用任何减免系数：</p>
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-sm text-red-800 space-y-2">
            <p>• 重复犯错 (同一个原因导致的第二次事故)。</p>
            <p>• 直接在线上数据库执行写/删操作。</p>
            <p>• 将测试环境配置发布到线上。</p>
            <p>• 未经 Code Review 私自发布代码/配置。</p>
          </div>
        </section>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
          <span className="bg-indigo-100 p-1 rounded">4</span> 预算与熔断机制
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
           <div className="bg-white p-4 rounded-lg border border-slate-200">
             <div className="text-xs text-slate-500 uppercase font-semibold">年度预算池</div>
             <div className="text-xl font-bold text-slate-800">¥ 1,500,000</div>
             <p className="text-xs text-slate-500 mt-1">基于约 2 天的全站流水设定。</p>
           </div>
           <div className="bg-white p-4 rounded-lg border border-slate-200">
             <div className="text-xs text-slate-500 uppercase font-semibold">季度红线</div>
             <div className="text-xl font-bold text-orange-600">¥ 375,000</div>
             <p className="text-xs text-slate-500 mt-1">超额将强制进行“稳定性专项治理”。</p>
           </div>
           <div className="bg-white p-4 rounded-lg border border-slate-200">
             <div className="text-xs text-slate-500 uppercase font-semibold">用户客诉发现</div>
             <div className="text-xl font-bold text-red-600">1.5x 倍率</div>
             <p className="text-xs text-slate-500 mt-1">耻辱红线：用户骂上门才知道。</p>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Rules;