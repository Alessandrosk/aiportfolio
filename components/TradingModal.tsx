import React, { useState } from 'react';
import { X, Zap, ArrowRight, ShieldAlert, TrendingDown, TrendingUp, RefreshCw, Settings, Wallet } from 'lucide-react';
import { Allocation, Language, MarketData, TradingStrategyResponse } from '../types';
import { TRANSLATIONS, DEMO_KEYS, FIXED_COLORS } from '../constants';
import { fetchMarketData } from '../services/marketDataService';
import { generateTradingStrategy } from '../services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAllocations: Allocation[];
  lang: Language;
}

const TradingModal: React.FC<TradingModalProps> = ({ isOpen, onClose, currentAllocations, lang }) => {
  const t = TRANSLATIONS[lang];
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<'coingecko' | 'twelvedata'>('coingecko');
  const [step, setStep] = useState<'input' | 'analyzing' | 'result'>('input');
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [strategy, setStrategy] = useState<TradingStrategyResponse | null>(null);

  if (!isOpen) return null;

  const handleUseDemo = () => {
      setProvider('coingecko');
      setApiKey(DEMO_KEYS.COINGECKO);
  };

  const handleReset = () => {
      setApiKey('');
      setStep('input');
      setStrategy(null);
      setMarketData([]);
  };

  const handleAnalyze = async () => {
      setStep('analyzing');
      const assets = currentAllocations.map(a => a.symbol);
      
      try {
          // 1. Fetch Real Data
          const data = await fetchMarketData(assets, apiKey, provider);
          setMarketData(data);
          
          // 2. Ask Gemini
          const strat = await generateTradingStrategy(currentAllocations, data, lang);
          setStrategy(strat);
          setStep('result');
      } catch (e) {
          console.error(e);
          setStep('input'); // Reset on error
      }
  };

  // Prepare Data for Charts with FIXED_COLORS integration
  const tacticalData = strategy?.tacticalAllocations.map(a => {
      const fixedColor = FIXED_COLORS[a.symbol.toUpperCase()];
      const fallbackColor = a.symbol === 'USD' ? FIXED_COLORS['USD'] : (currentAllocations.find(c => c.symbol === a.symbol)?.color || '#94a3b8');
      
      return {
        name: a.symbol,
        value: a.percentage,
        color: fixedColor || fallbackColor
      };
  }) || [];

  const strategicData = currentAllocations.map(a => ({
      name: a.symbol, 
      value: a.percentage, 
      color: a.color // These are already fixed in the main analysis response
  }));

  // Render Label Function for Pie Chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: any) => {
    if (value < 5) return null; // Don't show labels for tiny slices
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-[10px] font-bold drop-shadow-md">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom Tooltip for better visibility on dark backgrounds
  const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const data = payload[0];
        return (
          <div className="bg-slate-900 border border-slate-700 p-2 rounded-lg shadow-xl text-xs z-50">
            <p className="font-bold text-slate-200 mb-1">{data.name}</p>
            <div className="flex items-center gap-2">
               <span className="text-slate-400">Weight:</span>
               <span className="font-mono font-bold text-white">{data.value}%</span>
            </div>
          </div>
        );
      }
      return null;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur-sm">
            <div>
               <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                   <Zap className="text-yellow-400 fill-yellow-400" /> 
                   {t.trading.title}
               </h3>
               <p className="text-slate-400 text-sm mt-1">{t.trading.desc}</p>
            </div>
            <div className="flex gap-2">
                {step === 'result' && (
                    <button onClick={handleReset} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-xs font-bold transition-all">
                        <Settings size={14} /> Change API Key
                    </button>
                )}
                <button onClick={onClose} className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg transition-colors">
                    <X size={20} />
                </button>
            </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow bg-[#0B1120]">
            {step === 'input' && (
                <div className="max-w-md mx-auto space-y-8 py-10 animate-fade-in-up">
                    <div className="text-center">
                        <div className="bg-yellow-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/20">
                            <Zap size={32} className="text-yellow-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Setup Real-Time Data</h2>
                        <p className="text-slate-400 text-sm">To calculate max profit, Gemini needs live market feeds.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">{t.trading.provider}</label>
                            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                                <button 
                                    onClick={() => setProvider('coingecko')}
                                    className={`flex-1 py-2 text-sm font-bold rounded ${provider === 'coingecko' ? 'bg-slate-800 text-green-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    CoinGecko (Crypto)
                                </button>
                                <button 
                                    onClick={() => setProvider('twelvedata')}
                                    className={`flex-1 py-2 text-sm font-bold rounded ${provider === 'twelvedata' ? 'bg-slate-800 text-blue-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    TwelveData (Stocks)
                                </button>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase">{t.trading.apiKeyLabel}</label>
                             <input 
                                type="text" 
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none font-mono text-sm shadow-inner"
                                placeholder="api_key_..."
                             />
                             <div className="flex justify-end">
                                <button onClick={handleUseDemo} className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold hover:underline flex items-center gap-1">
                                    <Zap size={10} /> {t.trading.useDemo}
                                </button>
                             </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleAnalyze}
                        disabled={!apiKey}
                        className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl font-bold text-white text-lg shadow-lg shadow-orange-900/20 hover:shadow-orange-500/20 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {t.trading.analyze}
                    </button>
                </div>
            )}

            {step === 'analyzing' && (
                <div className="flex flex-col items-center justify-center py-24 space-y-6">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Zap size={20} className="text-yellow-400 animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                         <h3 className="text-xl font-bold text-white">Analyzing Market Momentum</h3>
                         <p className="text-slate-400 text-sm">Fetching {provider} live prices...</p>
                    </div>
                </div>
            )}

            {step === 'result' && strategy && (
                <div className="space-y-8 animate-fade-in pb-10">
                    
                    {/* Live Ticker Tape */}
                    <div className="bg-slate-900/50 border-y border-slate-800 -mx-6 px-6 py-3 overflow-hidden">
                        <div className="flex gap-8 animate-marquee whitespace-nowrap">
                            {marketData.map((m, i) => (
                                <div key={m.symbol + i} className="flex items-center gap-3">
                                    <span className="text-slate-400 font-bold text-xs">{m.symbol}</span>
                                    <span className="font-mono text-sm text-slate-200">${m.price.toLocaleString()}</span>
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${m.change24h >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {m.change24h > 0 ? '+' : ''}{m.change24h.toFixed(2)}%
                                    </span>
                                </div>
                            ))}
                             {/* Duplicate for infinite scroll illusion if few items */}
                             {marketData.length < 5 && marketData.map((m, i) => (
                                <div key={'dup' + m.symbol + i} className="flex items-center gap-3 opacity-50">
                                    <span className="text-slate-400 font-bold text-xs">{m.symbol}</span>
                                    <span className="font-mono text-sm text-slate-200">${m.price.toLocaleString()}</span>
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${m.change24h >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {m.change24h > 0 ? '+' : ''}{m.change24h.toFixed(2)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reasoning Box */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-900 border border-slate-700/50 rounded-xl p-5 shadow-lg relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-3 opacity-10">
                             <Zap size={100} />
                         </div>
                        <h5 className="font-bold text-yellow-500 mb-3 flex items-center gap-2 uppercase tracking-wider text-sm">
                             {strategy.action === 'HEDGE' ? <ShieldAlert size={18} /> : strategy.action === 'BUY' ? <TrendingUp size={18}/> : <TrendingDown size={18}/>}
                             AI Strategy: {strategy.action}
                        </h5>
                        <p className="text-slate-200 text-base leading-relaxed relative z-10 max-w-4xl">{strategy.reasoning}</p>
                    </div>

                    {/* Comparison Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Strategic (Left) */}
                        <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800 flex flex-col items-center">
                             <h4 className="font-bold text-slate-400 mb-6 uppercase text-sm tracking-wide">{t.trading.strategic}</h4>
                             <div className="w-full h-[250px] relative">
                                 <ResponsiveContainer>
                                     <PieChart>
                                         <Pie 
                                            data={strategicData} 
                                            dataKey="value" 
                                            innerRadius={60} 
                                            outerRadius={90}
                                            label={renderCustomizedLabel}
                                            labelLine={false}
                                         >
                                             {strategicData.map((entry, index) => <Cell key={index} fill={entry.color} stroke="none" />)}
                                         </Pie>
                                         <Tooltip content={<CustomTooltip />} />
                                     </PieChart>
                                 </ResponsiveContainer>
                                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                     <div className="text-center">
                                         <span className="text-slate-500 text-xs font-bold block">RISK</span>
                                         <span className="text-slate-300 font-bold">PROFILE</span>
                                     </div>
                                 </div>
                             </div>
                        </div>

                        {/* Tactical (Right) */}
                        <div className="bg-slate-900 p-6 rounded-2xl border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.05)] flex flex-col items-center relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                             <h4 className="font-bold text-yellow-400 mb-6 uppercase text-sm tracking-wide flex items-center gap-2">
                                <Zap size={16} /> {t.trading.tactical}
                             </h4>
                             <div className="w-full h-[250px] relative">
                                 <ResponsiveContainer>
                                     <PieChart>
                                         <Pie 
                                            data={tacticalData} 
                                            dataKey="value" 
                                            innerRadius={70} 
                                            outerRadius={105}
                                            label={renderCustomizedLabel}
                                            labelLine={false}
                                         >
                                             {tacticalData.map((entry, index) => <Cell key={index} fill={entry.color} stroke="none" />)}
                                         </Pie>
                                         <Tooltip content={<CustomTooltip />} />
                                     </PieChart>
                                 </ResponsiveContainer>
                                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                     <div className="text-center">
                                         <span className="text-yellow-500/70 text-xs font-bold block">MAX</span>
                                         <span className="text-yellow-400 font-bold">PROFIT</span>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* Comparison Table with Horizontal Scroll */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left whitespace-nowrap">
                                <thead className="bg-slate-950 text-slate-500 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3">Asset</th>
                                        <th className="px-6 py-3 text-right">Strategic %</th>
                                        <th className="px-6 py-3 text-right">Tactical %</th>
                                        <th className="px-6 py-3 text-right">Delta</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {tacticalData.map((tactical) => {
                                        const strategic = strategicData.find(s => s.name === tactical.name);
                                        const stratVal = strategic ? strategic.value : 0;
                                        const delta = tactical.value - stratVal;
                                        
                                        return (
                                            <tr key={tactical.name} className="hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-3 font-medium text-slate-200 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: tactical.color }} />
                                                    {tactical.name}
                                                    {tactical.name === 'USD' && <span className="text-[10px] bg-green-500/20 text-green-400 px-1 rounded">CASH</span>}
                                                </td>
                                                <td className="px-6 py-3 text-right text-slate-400 font-mono">
                                                    {stratVal}%
                                                </td>
                                                <td className="px-6 py-3 text-right font-bold text-white font-mono">
                                                    {tactical.value}%
                                                </td>
                                                <td className="px-6 py-3 text-right font-mono">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                        delta > 0 ? 'bg-green-500/10 text-green-400' : 
                                                        delta < 0 ? 'bg-red-500/10 text-red-400' : 'text-slate-500'
                                                    }`}>
                                                        {delta > 0 ? '+' : ''}{delta}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TradingModal;