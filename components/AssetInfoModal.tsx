import React from 'react';
import { AssetInfo, Language } from '../types';
import { X, AlertTriangle, Building2, TrendingUp, Activity, ExternalLink } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface AssetInfoModalProps {
  info: AssetInfo | null;
  loading: boolean;
  onClose: () => void;
  symbol: string;
  lang: Language;
}

const AssetInfoModal: React.FC<AssetInfoModalProps> = ({ info, loading, onClose, symbol, lang }) => {
  if (!loading && !info) return null;
  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
            <p className="text-slate-400 text-sm">{t.modal.analyzing} {symbol}...</p>
          </div>
        ) : info ? (
          info.isRecognized ? (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold text-white">{info.name}</h3>
                </div>
                <span className="text-cyan-400 font-mono font-medium bg-cyan-950/30 px-2 py-1 rounded text-sm">
                  {info.symbol}
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    <p className="text-slate-300 text-sm leading-relaxed">
                        {info.description}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-800/30 rounded-lg">
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                            <Building2 size={12} /> {t.modal.sector}
                        </div>
                        <div className="text-slate-200 font-medium text-sm">{info.sector}</div>
                    </div>
                    <div className="p-3 bg-slate-800/30 rounded-lg">
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                            <Activity size={12} /> {t.modal.nature}
                        </div>
                        <div className="text-slate-200 font-medium text-sm">{info.trend}</div>
                    </div>
                </div>

                {/* Sources Section */}
                {info.sources && info.sources.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.modal.sources}</h4>
                    <div className="flex flex-wrap gap-2">
                      {info.sources.map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-cyan-400/80 hover:text-cyan-300 px-2 py-1 rounded border border-slate-700 transition-colors truncate max-w-full"
                        >
                          <span className="truncate max-w-[150px]">{source.title}</span>
                          <ExternalLink size={10} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
                <div className="bg-red-500/10 text-red-400 p-3 rounded-full w-fit mx-auto">
                    <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-semibold text-white">{t.modal.unknownTitle}</h3>
                <p className="text-slate-400 text-sm">
                    {t.modal.unknownDesc}
                </p>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default AssetInfoModal;