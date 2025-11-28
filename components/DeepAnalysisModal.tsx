import React, { useState, useEffect } from 'react';
import { X, TrendingUp, DollarSign, Activity, GitFork, Target, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Language, PortfolioResponse, SimulationPoint, RiskLevel } from '../types';
import { generateSimulation } from '../services/geminiService';
import { TRANSLATIONS } from '../constants';

interface DeepAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: PortfolioResponse;
  riskLevel: RiskLevel; // Passed from parent
  assets: string[]; // Passed from parent
  lang: Language;
}

const DeepAnalysisModal: React.FC<DeepAnalysisModalProps> = ({ 
  isOpen, onClose, result, riskLevel, assets, lang 
}) => {
  const [amount, setAmount] = useState<number>(10000);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SimulationPoint[]>([]);
  const [insight, setInsight] = useState('');
  
  // Toggles
  const [showSPY, setShowSPY] = useState(false);
  const [showBTC, setShowBTC] = useState(false);
  const [showGold, setShowGold] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);
  
  // New features state
  const [duration, setDuration] = useState<number>(5);
  const [customCAGR, setCustomCAGR] = useState<string>('10');
  const [showCustom, setShowCustom] = useState(false);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (isOpen && assets.length > 0) {
      setLoading(true);
      generateSimulation(assets, riskLevel, lang, duration)
        .then(res => {
          setData(res.points);
          setInsight(res.insight);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, assets, riskLevel, lang, duration]);

  if (!isOpen) return null;

  // Transform normalized data (1.0, 1.15) to currency (10000, 11500)
  const chartData = data.map(point => {
    // Calculate custom benchmark locally: Amount * (1 + rate)^year
    const rate = parseFloat(customCAGR) / 100;
    const customValue = amount * Math.pow(1 + rate, point.year);

    return {
      ...point,
      portfolioValue: Math.round(point.portfolio * amount),
      portfolioBestValue: Math.round(point.portfolioBest * amount),
      portfolioWorstValue: Math.round(point.portfolioWorst * amount),
      sp500Value: Math.round(point.sp500 * amount),
      btcValue: Math.round(point.btc * amount),
      goldValue: Math.round((point.gold || 1) * amount),
      customValue: Math.round(customValue)
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
     if (active && payload && payload.length) {
         return (
             <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs z-50">
                 <p className="font-bold text-slate-200 mb-2">{t.deep.years} {label}</p>
                 {payload.map((entry: any, index: number) => (
                     <div key={index} className="flex items-center gap-2 mb-1" style={{ color: entry.stroke || entry.fill }}>
                         <span className="capitalize font-medium">{entry.name}:</span>
                         <span className="font-mono font-bold">
                             ${entry.value.toLocaleString()}
                         </span>
                     </div>
                 ))}
             </div>
         )
     }
     return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-900/50">
           <div>
               <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                   <Activity className="text-cyan-400" /> 
                   {t.deep.title}
               </h3>
               <p className="text-slate-400 text-sm mt-1">{t.deep.desc}</p>
           </div>
           <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"><X /></button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-6">
            
            {/* Top Controls Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Initial Investment */}
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                        {t.deep.initialInvestment}
                    </label>
                    <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-3 text-slate-400" />
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                        />
                    </div>
                </div>

                {/* 2. Duration Selector */}
                 <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                        <div className="flex items-center gap-1">
                          <Calendar size={12}/> {t.deep.years}
                        </div>
                    </label>
                    <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                        {[5, 10, 20].map((yr) => (
                           <button
                             key={yr}
                             onClick={() => setDuration(yr)}
                             className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all ${
                               duration === yr 
                               ? 'bg-cyan-600 text-white shadow' 
                               : 'text-slate-400 hover:text-slate-200'
                             }`}
                           >
                             {yr}Y
                           </button>
                        ))}
                    </div>
                </div>

                {/* 3. Custom Benchmark Input */}
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                        <span>{t.deep.custom}</span>
                        <input 
                          type="checkbox" 
                          checked={showCustom} 
                          onChange={(e) => setShowCustom(e.target.checked)}
                          className="w-3 h-3 rounded accent-purple-500 cursor-pointer"
                        />
                    </label>
                    <div className="relative">
                        <Target size={16} className="absolute left-3 top-3 text-purple-400" />
                        <input 
                            type="number" 
                            placeholder={t.deep.customPlaceholder}
                            value={customCAGR}
                            onChange={(e) => setCustomCAGR(e.target.value)}
                            disabled={!showCustom}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono disabled:opacity-50"
                        />
                         <span className="absolute right-3 top-3 text-slate-500 text-xs font-bold">% CAGR</span>
                    </div>
                </div>
            </div>

            {/* Benchmarks Toggles */}
            <div className="flex flex-wrap gap-2">
                 <span className="text-sm text-slate-400 self-center mr-2">{t.deep.benchmark}</span>
                 <button 
                    onClick={() => setShowSPY(!showSPY)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all ${showSPY ? 'bg-slate-700 border-slate-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'}`}
                 >
                    S&P 500
                 </button>
                 <button 
                    onClick={() => setShowBTC(!showBTC)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all ${showBTC ? 'bg-orange-950/40 border-orange-500/50 text-orange-400' : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'}`}
                 >
                    Bitcoin
                 </button>
                 <button 
                    onClick={() => setShowGold(!showGold)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all ${showGold ? 'bg-yellow-900/40 border-yellow-500/50 text-yellow-400' : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'}`}
                 >
                    Gold
                 </button>
                 <div className="w-px h-6 bg-slate-700 mx-1 self-center"></div>
                 <button 
                    onClick={() => setShowScenarios(!showScenarios)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all flex items-center gap-1 ${showScenarios ? 'bg-green-900/30 border-green-500/50 text-green-400' : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'}`}
                 >
                    <GitFork size={12} /> {t.deep.scenarios}
                 </button>
            </div>

            {/* Chart Area */}
            <div className="h-[400px] w-full bg-slate-950/50 rounded-xl border border-slate-800 p-4 relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                        <span className="text-slate-400 text-sm animate-pulse">{t.deep.generating}</span>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorBest" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorWorst" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis 
                                dataKey="year" 
                                stroke="#64748b" 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={(val) => `Y${val}`}
                            />
                            <YAxis 
                                stroke="#64748b" 
                                tickLine={false} 
                                axisLine={false}
                                tickFormatter={(val) => `$${val/1000}k`} 
                            />
                            <Tooltip content={<CustomTooltip />} />
                            
                            {/* Scenarios (Best/Worst) */}
                            {showScenarios && (
                                <>
                                    <Area 
                                        type="monotone" 
                                        dataKey="portfolioBestValue" 
                                        name={t.deep.bestCase}
                                        stroke="#4ade80" 
                                        strokeDasharray="5 5"
                                        strokeWidth={1}
                                        fillOpacity={1} 
                                        fill="url(#colorBest)" 
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="portfolioWorstValue" 
                                        name={t.deep.worstCase}
                                        stroke="#f87171" 
                                        strokeDasharray="5 5"
                                        strokeWidth={1}
                                        fillOpacity={1} 
                                        fill="url(#colorWorst)" 
                                    />
                                </>
                            )}

                            {/* Benchmarks */}
                            {showSPY && (
                                <Area 
                                    type="monotone" 
                                    dataKey="sp500Value" 
                                    name="S&P 500"
                                    stroke="#94a3b8" 
                                    strokeWidth={2}
                                    fill="none" 
                                />
                            )}
                            {showBTC && (
                                <Area 
                                    type="monotone" 
                                    dataKey="btcValue" 
                                    name="Bitcoin"
                                    stroke="#f97316" 
                                    strokeWidth={2}
                                    fill="none" 
                                />
                            )}
                            {showGold && (
                                <Area 
                                    type="monotone" 
                                    dataKey="goldValue" 
                                    name="Gold"
                                    stroke="#fbbf24" 
                                    strokeWidth={2}
                                    fill="none" 
                                />
                            )}
                            {showCustom && (
                                <Area 
                                    type="monotone" 
                                    dataKey="customValue" 
                                    name={`Target (${customCAGR}%)`}
                                    stroke="#d8b4fe" 
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                    fill="none" 
                                />
                            )}

                            {/* Main Portfolio */}
                            <Area 
                                type="monotone" 
                                dataKey="portfolioValue" 
                                name="Portfolio"
                                stroke="#22d3ee" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorPortfolio)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
            
            {/* Insight Text */}
            {!loading && insight && (
                <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-800/30 p-4 rounded-xl flex gap-3">
                    <TrendingUp className="text-cyan-400 flex-shrink-0" />
                    <p className="text-sm text-cyan-100 italic">"{insight}"</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DeepAnalysisModal;