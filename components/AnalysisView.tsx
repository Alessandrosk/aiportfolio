import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { PortfolioResponse, Language, RiskLevel, Allocation } from '../types';
import PortfolioChart from './PortfolioChart';
import DeepAnalysisModal from './DeepAnalysisModal';
import TradingModal from './TradingModal';
import { RefreshCcw, TrendingUp, Activity, PieChart, TrendingDown, AlertCircle, BarChart2, Edit2, Check, X as XIcon, Save, Bookmark, Zap } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface AnalysisViewProps {
  result: PortfolioResponse;
  onReset: () => void;
  onSaveToLibrary: (portfolio: PortfolioResponse) => void;
  lang: Language;
  riskLevel: RiskLevel; // Passed through to modal
  assets: string[]; // Passed through to modal
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onReset, onSaveToLibrary, lang, riskLevel, assets }) => {
  const t = TRANSLATIONS[lang];
  const [isDeepModalOpen, setIsDeepModalOpen] = useState(false);
  const [isTradingModalOpen, setIsTradingModalOpen] = useState(false);
  
  // State for editable allocations and dynamic stats
  const [currentAllocations, setCurrentAllocations] = useState<Allocation[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [totalStats, setTotalStats] = useState({ cagr: 0, dd: 0 });

  // Initialize state when result changes
  useEffect(() => {
    setCurrentAllocations(result.allocations);
    setTotalStats({
        cagr: result.totalCAGR,
        dd: result.totalMaxDrawdown
    });
  }, [result]);

  // Recalculate weighted stats whenever allocations change
  useEffect(() => {
    const totalWeight = currentAllocations.reduce((sum, a) => sum + a.percentage, 0);
    if (totalWeight === 0) return;

    // Recalculate CAGR (Weighted Average)
    const newCAGR = currentAllocations.reduce((sum, a) => sum + (a.cagr * (a.percentage / 100)), 0);
    
    // Recalculate Max DD (Weighted Average approx - accurate enough for frontend adjustment)
    const newDD = currentAllocations.reduce((sum, a) => sum + (a.maxDrawdown * (a.percentage / 100)), 0);

    setTotalStats({
        cagr: Number(newCAGR.toFixed(2)),
        dd: Number(newDD.toFixed(2))
    });
  }, [currentAllocations]);

  const handlePercentageChange = (symbol: string, newValue: string) => {
      const val = parseFloat(newValue);
      if (isNaN(val) || val < 0 || val > 100) return;

      setCurrentAllocations(prev => prev.map(a => 
          a.symbol === symbol ? { ...a, percentage: val } : a
      ));
  };

  const handleSave = () => {
      // Validate 100%
      const total = currentAllocations.reduce((sum, a) => sum + a.percentage, 0);
      if (Math.abs(total - 100) > 0.1) return; // Allow tiny float error
      
      setIsEditing(false);
      // Here we would ideally notify the parent or save to a backend
  };

  const handleCancel = () => {
      setCurrentAllocations(result.allocations); // Revert
      setIsEditing(false);
  };

  const currentTotalPercentage = currentAllocations.reduce((sum, a) => sum + a.percentage, 0);
  const isValidTotal = Math.abs(currentTotalPercentage - 100) < 0.1;

  // Clone result object but with current allocations for the chart/modal
  const currentResult: PortfolioResponse = {
      ...result,
      allocations: currentAllocations,
      totalCAGR: totalStats.cagr,
      totalMaxDrawdown: totalStats.dd
  };

  return (
    <div className="animate-fade-in space-y-8">
      
      {/* Header Summary */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                {result.strategyTitle}
            </h2>
            
            {/* Header Actions */}
            <div className="flex gap-2">
                 <button 
                    onClick={() => setIsTradingModalOpen(true)}
                    className="flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-[0_0_10px_rgba(234,179,8,0.1)] hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                 >
                    <Zap size={16} className="fill-current" />
                    {t.results.tradingMode}
                 </button>
            </div>
          </div>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
            {result.expectedOutlook}
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-2 flex items-center gap-3">
               <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                  <TrendingUp size={20} />
               </div>
               <div>
                 <div className="text-xs text-slate-400 uppercase font-semibold">{t.results.cagr}</div>
                 <div className="text-xl font-bold text-green-400 transition-all duration-300">{totalStats.cagr}%</div>
               </div>
            </div>

            <div className="bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-2 flex items-center gap-3">
               <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                  <TrendingDown size={20} />
               </div>
               <div>
                 <div className="text-xs text-slate-400 uppercase font-semibold">{t.results.maxDrawdown} (Est.)</div>
                 <div className="text-xl font-bold text-red-400 transition-all duration-300">-{totalStats.dd}%</div>
               </div>
            </div>

            <div className="bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-2 flex items-center gap-3">
               <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                  <Activity size={20} />
               </div>
               <div>
                 <div className="text-xs text-slate-400 uppercase font-semibold">{t.results.volatility}</div>
                 <div className="text-xl font-bold text-orange-400">{result.volatility}</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
                <PieChart size={18} className="text-cyan-400" />
                <h3 className="text-lg font-semibold text-slate-200">{t.results.allocation}</h3>
             </div>
             
             {!isEditing ? (
                 <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-500/30 px-3 py-1.5 rounded-lg transition-colors"
                 >
                    <Edit2 size={12} /> {t.results.edit}
                 </button>
             ) : (
                 <div className="flex gap-2">
                    <button 
                        onClick={handleCancel}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title={t.results.cancel}
                    >
                        <XIcon size={16} />
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={!isValidTotal}
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all border ${
                            isValidTotal 
                             ? 'text-green-400 bg-green-950/30 border-green-500/30 hover:bg-green-900/50' 
                             : 'text-slate-500 bg-slate-800 border-slate-700 cursor-not-allowed'
                        }`}
                        title={t.results.save}
                    >
                        <Save size={14} /> {t.results.save}
                    </button>
                 </div>
             )}
          </div>
          
          <PortfolioChart data={currentAllocations} lang={lang} />
          
          <div className="w-full mt-6 space-y-3">
             {isEditing && (
                 <div className={`flex justify-between items-center px-4 py-2 rounded-lg border mb-4 ${isValidTotal ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                     <span className="text-xs font-bold uppercase text-slate-400">{t.results.total}</span>
                     <span className={`font-mono font-bold ${isValidTotal ? 'text-green-400' : 'text-red-400'}`}>
                         {Math.round(currentTotalPercentage)}%
                     </span>
                 </div>
             )}

             <div className="grid grid-cols-12 text-xs font-semibold text-slate-500 px-3 uppercase tracking-wider mb-2">
                <div className="col-span-4">{t.results.asset}</div>
                <div className="col-span-3 text-right text-green-600/80">CAGR</div>
                <div className="col-span-3 text-right text-red-600/80">Max DD</div>
                <div className="col-span-2 text-right">{t.results.weight}</div>
             </div>
             {currentAllocations.map((alloc) => (
               <div key={alloc.symbol} className="grid grid-cols-12 items-center p-3 bg-slate-900 rounded-lg border border-slate-800/50 hover:border-slate-700 transition-colors">
                  <div className="col-span-4 flex items-center gap-2">
                     <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: alloc.color }}></div>
                     <div className="overflow-hidden">
                       <div className="text-sm font-medium text-slate-200 truncate">{alloc.name}</div>
                       <div className="text-xs text-slate-500 font-mono">{alloc.symbol}</div>
                     </div>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className={`font-mono text-sm ${alloc.cagr >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {alloc.cagr > 0 ? '+' : ''}{alloc.cagr}%
                    </span>
                  </div>
                   <div className="col-span-3 text-right">
                    <span className="font-mono text-sm text-red-400">
                      -{alloc.maxDrawdown}%
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    {isEditing ? (
                        <input 
                            type="number"
                            min="0"
                            max="100"
                            value={alloc.percentage}
                            onChange={(e) => handlePercentageChange(alloc.symbol, e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-1 py-1 text-right text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500 text-sm"
                        />
                    ) : (
                        <div className="text-cyan-400 font-mono font-bold">{alloc.percentage}%</div>
                    )}
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Text Analysis Section */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col h-full">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">{t.results.analysis}</h3>
          <div className="prose prose-invert prose-slate max-w-none prose-p:text-slate-400 prose-headings:text-slate-200 prose-strong:text-cyan-400 text-sm leading-relaxed flex-grow">
            <ReactMarkdown>{result.analysis}</ReactMarkdown>
          </div>
          
          <div className="mt-8 pt-4 border-t border-slate-800 flex items-start gap-2 text-xs text-slate-500">
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
              <p>{t.results.disclaimer}</p>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-4 pb-8">
        
        <button
          onClick={() => setIsDeepModalOpen(true)}
          className="w-full md:w-auto group flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-900/40 to-cyan-900/40 hover:from-purple-900/60 hover:to-cyan-900/60 text-cyan-200 rounded-full font-medium transition-all duration-300 border border-cyan-800 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-900/20"
        >
          <BarChart2 size={18} />
          {t.results.deepAnalysis}
        </button>

        <button
          onClick={() => onSaveToLibrary(currentResult)}
          className="w-full md:w-auto group flex items-center justify-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full font-medium transition-all duration-300 border border-slate-700 hover:border-cyan-500/50"
        >
           <Bookmark size={18} />
           {t.results.saveToLibrary}
        </button>

        <button
          onClick={onReset}
          className="w-full md:w-auto group flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full font-medium transition-all duration-300 border border-slate-800 hover:border-slate-600"
        >
          <RefreshCcw size={18} className="group-hover:-rotate-180 transition-transform duration-500" />
          {t.results.reset}
        </button>
      </div>

      <DeepAnalysisModal 
         isOpen={isDeepModalOpen} 
         onClose={() => setIsDeepModalOpen(false)}
         result={currentResult} // Use currentResult to pass updated allocations to Modal
         riskLevel={riskLevel}
         assets={assets}
         lang={lang}
      />
      
      <TradingModal 
         isOpen={isTradingModalOpen}
         onClose={() => setIsTradingModalOpen(false)}
         currentAllocations={currentAllocations}
         lang={lang}
      />
    </div>
  );
};

export default AnalysisView;