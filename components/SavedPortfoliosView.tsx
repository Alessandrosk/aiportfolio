import React from 'react';
import { SavedPortfolio, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Trash2, ArrowRight, Calendar, PieChart } from 'lucide-react';

interface SavedPortfoliosViewProps {
  portfolios: SavedPortfolio[];
  onLoad: (portfolio: SavedPortfolio) => void;
  onDelete: (id: string) => void;
  lang: Language;
}

const SavedPortfoliosView: React.FC<SavedPortfoliosViewProps> = ({ portfolios, onLoad, onDelete, lang }) => {
  const t = TRANSLATIONS[lang];

  if (portfolios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
         <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <PieChart size={40} className="text-slate-600" />
         </div>
         <h2 className="text-2xl font-bold text-white mb-2">{t.library.empty}</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          {t.library.title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((p) => (
          <div key={p.id} className="group relative bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-900/10 flex flex-col">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {p.strategyTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                     <Calendar size={12} />
                     <span>{t.library.createdOn} {new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
               </div>
               <button 
                 onClick={(e) => { e.stopPropagation(); onDelete(p.id); }}
                 className="text-slate-600 hover:text-red-400 p-2 rounded-lg hover:bg-red-950/30 transition-colors"
                 title={t.library.delete}
               >
                 <Trash2 size={16} />
               </button>
            </div>

            <div className="flex-grow space-y-4">
                <p className="text-sm text-slate-400 line-clamp-2 min-h-[40px]">
                    {p.expectedOutlook}
                </p>
                
                <div className="flex gap-2">
                    <div className="bg-slate-950/50 rounded px-2 py-1 border border-slate-800">
                        <span className="text-xs text-slate-500 block">CAGR</span>
                        <span className="text-sm font-bold text-green-400">{p.totalCAGR}%</span>
                    </div>
                    <div className="bg-slate-950/50 rounded px-2 py-1 border border-slate-800">
                        <span className="text-xs text-slate-500 block">Risk</span>
                        <span className={`text-sm font-bold ${
                            p.riskLevel === 'HIGH' ? 'text-red-400' : 
                            p.riskLevel === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                            {p.riskLevel}
                        </span>
                    </div>
                    <div className="bg-slate-950/50 rounded px-2 py-1 border border-slate-800 flex-grow text-center">
                         <span className="text-xs text-slate-500 block">Assets</span>
                         <span className="text-sm font-bold text-slate-300">{p.allocations.length}</span>
                    </div>
                </div>

                {/* Mini Asset Preview */}
                <div className="flex gap-1 overflow-hidden pt-2">
                    {p.allocations.slice(0, 5).map(a => (
                        <div key={a.symbol} className="h-1 flex-1 rounded-full" style={{ backgroundColor: a.color }} title={a.symbol} />
                    ))}
                </div>
            </div>

            <button 
                onClick={() => onLoad(p)}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-800 group-hover:bg-cyan-900/30 border border-slate-700 group-hover:border-cyan-500/30 text-slate-300 group-hover:text-cyan-300 py-2.5 rounded-xl font-medium transition-all"
            >
                {t.library.load} <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedPortfoliosView;