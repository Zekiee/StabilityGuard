import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { DiscoveryChannel, IncidentLevel } from '../types';
import { calculateIncidentFinancials, formatCurrency } from '../utils';
import { Plus, X, Trash2, Calculator } from 'lucide-react';

const IncidentLog = () => {
  const { incidents, addIncident, deleteIncident } = useAppStore();
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [detectionTime, setDetectionTime] = useState('');
  const [recoveryTime, setRecoveryTime] = useState('');
  const [impactCoef, setImpactCoef] = useState<number>(1.0);
  const [discoveryChannel, setDiscoveryChannel] = useState<DiscoveryChannel>(DiscoveryChannel.MONITORING);
  const [isZeroTolerance, setIsZeroTolerance] = useState(false);
  const [isGrayScale, setIsGrayScale] = useState(false);

  // Live Preview State
  const [previewCost, setPreviewCost] = useState<any>(null);

  // Auto-calculate preview
  useEffect(() => {
    if (startTime && recoveryTime && detectionTime) {
      // 确保系数有效，如果为空(NaN)则默认为0参与计算，避免崩溃
      const safeCoef = isNaN(impactCoef) ? 0 : impactCoef;
      
      const result = calculateIncidentFinancials(
        startTime,
        recoveryTime,
        detectionTime,
        safeCoef,
        discoveryChannel,
        isZeroTolerance,
        isGrayScale
      );
      setPreviewCost(result);
    } else {
      setPreviewCost(null);
    }
  }, [startTime, recoveryTime, detectionTime, impactCoef, discoveryChannel, isZeroTolerance, isGrayScale]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewCost) return;

    // 提交前再次校验系数
    const finalCoef = isNaN(impactCoef) ? 0 : impactCoef;

    addIncident({
      title,
      description,
      startTime,
      detectionTime,
      recoveryTime,
      impactCoef: finalCoef,
      discoveryChannel,
      isZeroTolerance,
      isGrayScale
    });

    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartTime('');
    setDetectionTime('');
    setRecoveryTime('');
    setImpactCoef(1.0);
    setDiscoveryChannel(DiscoveryChannel.MONITORING);
    setIsZeroTolerance(false);
    setIsGrayScale(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">事故记录</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          上报事故
        </button>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {incidents.map((incident) => (
          <div key={incident.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                   incident.cost > 50000 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {formatCurrency(incident.cost)}
                </span>
                <h3 className="text-lg font-semibold text-slate-900">{incident.title}</h3>
                {incident.isZeroTolerance && (
                    <span className="bg-red-50 text-red-600 border border-red-200 text-[10px] px-1.5 py-0.5 rounded">零容忍条款</span>
                )}
                 {incident.isGrayScale && (
                    <span className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px] px-1.5 py-0.5 rounded">灰度豁免</span>
                )}
              </div>
              <p className="text-slate-600 text-sm mb-4">{incident.description}</p>
              
              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                <div>开始: <span className="font-mono">{new Date(incident.startTime).toLocaleString()}</span></div>
                <div>恢复: <span className="font-mono">{new Date(incident.recoveryTime).toLocaleString()}</span></div>
                <div>MTTR: <span className="font-semibold text-slate-700">{incident.mttrMinutes} 分钟</span></div>
                <div>影响系数: <span className="font-mono">{incident.impactCoef} ({(incident.impactCoef * 100).toFixed(0)}%)</span></div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-4 md:pt-0">
               <button 
                onClick={() => deleteIncident(incident.id)}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title="删除记录"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">新增事故报告</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">标题</label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="例如：数据库连接超时"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24"
                    placeholder="根本原因，受影响系统..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">开始时间 (T0)</label>
                    <input
                      required
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">发现时间 (T1)</label>
                    <input
                      required
                      type="datetime-local"
                      value={detectionTime}
                      onChange={(e) => setDetectionTime(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">恢复时间 (T2)</label>
                    <input
                      required
                      type="datetime-local"
                      value={recoveryTime}
                      onChange={(e) => setRecoveryTime(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">发现渠道</label>
                    <select
                      value={discoveryChannel}
                      onChange={(e) => setDiscoveryChannel(e.target.value as DiscoveryChannel)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value={DiscoveryChannel.MONITORING}>监控报警 / 研发自查 (1.0x)</option>
                      <option value={DiscoveryChannel.USER_COMPLAINT}>用户客诉 (1.5x)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">业务影响系数 (0.0 - 1.0)</label>
                    <div className="flex items-center gap-2">
                      <input
                        required
                        type="number"
                        min="0"
                        max="1"
                        step="0.001"
                        value={isNaN(impactCoef) ? '' : impactCoef}
                        onChange={(e) => setImpactCoef(e.target.valueAsNumber)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="0.0 - 1.0"
                      />
                      <div className="text-sm text-slate-500 whitespace-nowrap w-12 text-right">
                        {!isNaN(impactCoef) ? `${Math.round(impactCoef * 100)}%` : '-'}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">可根据监控平台数据手动输入精确值</p>
                  </div>
                </div>

                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isZeroTolerance}
                      onChange={(e) => setIsZeroTolerance(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-700">零容忍条款</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGrayScale}
                      onChange={(e) => setIsGrayScale(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-700">灰度发布豁免</span>
                  </label>
                </div>

                {/* Live Calculation Card */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-6">
                  <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold">
                    <Calculator size={18} />
                    <span>预估评估结果</span>
                  </div>
                  {previewCost ? (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                       <div>
                         <span className="text-slate-500 block">受损时长</span>
                         <span className="font-mono">{previewCost.lossDurationMinutes} 分钟</span>
                       </div>
                       <div>
                         <span className="text-slate-500 block">MTTR (T2-T1)</span>
                         <span className={`font-mono font-bold ${previewCost.mttrMinutes < 5 ? 'text-green-600' : ''}`}>
                            {previewCost.mttrMinutes} 分钟
                         </span>
                       </div>
                       <div>
                         <span className="text-slate-500 block">MTTR 系数</span>
                         <span className="font-mono">x {previewCost.details.mttrCoef}</span>
                       </div>
                       <div>
                         <span className="text-slate-500 block">计算资损</span>
                         <span className="text-xl font-bold text-indigo-600">{formatCurrency(previewCost.cost)}</span>
                       </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm italic">输入时间以计算资损...</p>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                >
                  提交报告
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentLog;