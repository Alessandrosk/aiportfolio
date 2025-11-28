import React, { useState, useMemo } from 'react';
import { POPULAR_ASSETS, TRANSLATIONS } from '../constants';
import { AssetType, AssetInfo, Language } from '../types';
import { Plus, X, Search, Info, Trash2 } from 'lucide-react';
import { getAssetInfo } from '../services/geminiService';
import AssetInfoModal from './AssetInfoModal';

interface AssetSelectorProps {
  selectedAssets: string[];
  onToggleAsset: (symbol: string) => void;
  lang: Language;
}

const AssetSelector: React.FC<AssetSelectorProps> = ({ selectedAssets, onToggleAsset, lang }) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<AssetType | 'all'>('all');
  const t = TRANSLATIONS[lang];
  
  const CATEGORIES: { id: AssetType | 'all'; label: string }[] = [
    { id: 'all', label: t.categories.all },
    { id: 'stock', label: t.categories.stock },
    { id: 'crypto', label: t.categories.crypto },
    { id: 'etf', label: t.categories.etf },
    { id: 'commodity', label: t.categories.commodity },
  ];

  // Info Modal State
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);
  const [assetInfo, setAssetInfo] = useState<AssetInfo | null>(null);
  const [currentInfoSymbol, setCurrentInfoSymbol] = useState('');

  const handleAddCustom = () => {
    if (search && !selectedAssets.includes(search.toUpperCase())) {
      onToggleAsset(search.toUpperCase());
      setSearch('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustom();
    }
  };

  const handleClearSelection = () => {
    // We simulate toggling all off by calling toggle on each, or simpler:
    // Ideally the parent should expose a setAssets([]) but we only have toggle.
    // So we iterate.
    selectedAssets.forEach(a => onToggleAsset(a));
  };

  const handleOpenInfo = async (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setInfoModalOpen(true);
    setInfoLoading(true);
    setCurrentInfoSymbol(symbol);
    setAssetInfo(null);

    try {
        const info = await getAssetInfo(symbol, lang);
        setAssetInfo(info);
    } catch (err) {
        console.error("Failed to fetch asset info", err);
    } finally {
        setInfoLoading(false);
    }
  };

  const handleCloseInfo = () => {
    setInfoModalOpen(false);
    setAssetInfo(null);
  };

  // Filter assets based on search text AND active category tab
  const filteredAssets = useMemo(() => {
    return POPULAR_ASSETS.filter((asset) => {
      const matchesCategory = activeTab === 'all' || asset.type === activeTab;
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        asset.symbol.toLowerCase().includes(searchLower) || 
        asset.name.toLowerCase().includes(searchLower);
      
      return matchesCategory && matchesSearch;
    });
  }, [search, activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="bg-cyan-500/10 text-cyan-400 p-1 rounded">1</span> {t.step1}
        </h2>
        {selectedAssets.length > 0 && (
            <button 
                onClick={handleClearSelection}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-950/20 px-2 py-1 rounded hover:bg-red-950/40 transition-colors"
            >
                <Trash2 size={12} /> Clear
            </button>
        )}
      </div>
      
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.searchPlaceholder}
          className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder:text-slate-500 shadow-inner"
        />
        {search && (
           <button
             onClick={handleAddCustom}
             className="absolute right-2 top-2 p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold px-3"
           >
             <Plus size={14} />
             {t.searchAction}
           </button>
        )}
      </div>

      {/* Selected List Preview */}
      {selectedAssets.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {selectedAssets.map(asset => (
            <button 
                key={asset} 
                onClick={() => onToggleAsset(asset)}
                className="group flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-cyan-900/40 to-blue-900/40 text-cyan-200 border border-cyan-800/50 hover:border-red-500/50 hover:bg-red-900/20 transition-all"
            >
              <span>{asset}</span>
              <div className="bg-cyan-950/50 rounded-full p-0.5 group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors">
                 <X size={12} />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`
              whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
              ${activeTab === cat.id 
                ? 'bg-slate-800 text-cyan-400 border-cyan-500/50 shadow-lg shadow-cyan-900/20' 
                : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'}
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Assets Grid */}
      <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredAssets.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredAssets.map((asset) => {
              const isSelected = selectedAssets.includes(asset.symbol);
              return (
                <div
                  key={asset.symbol}
                  onClick={() => onToggleAsset(asset.symbol)}
                  className={`flex flex-col items-start p-3 rounded-xl border transition-all duration-200 text-left relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex justify-between w-full items-start">
                    <span className={`font-bold tracking-wide ${isSelected ? 'text-cyan-400' : 'text-slate-200 group-hover:text-white'}`}>
                      {asset.symbol}
                    </span>
                    <button
                        onClick={(e) => handleOpenInfo(asset.symbol, e)}
                        className="text-slate-500 hover:text-cyan-300 p-0.5 rounded hover:bg-cyan-900/50 transition-colors"
                        title="Info da Gemini"
                    >
                        <Info size={14} />
                    </button>
                  </div>
                  <div className="mt-1 mb-2">
                     <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase ${
                        asset.type === 'crypto' ? 'bg-purple-500/10 text-purple-400' :
                        asset.type === 'stock' ? 'bg-blue-500/10 text-blue-400' :
                        asset.type === 'etf' ? 'bg-green-500/10 text-green-400' :
                        'bg-orange-500/10 text-orange-400'
                    }`}>
                        {asset.type}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 truncate w-full group-hover:text-slate-300">
                    {asset.name}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
             <p>{t.noResults}</p>
             <div className="flex justify-center gap-3 mt-4">
                 <button 
                   onClick={handleAddCustom} 
                   className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2 border border-cyan-500/30 px-4 py-2 rounded-lg bg-cyan-950/30"
                 >
                    <Plus size={16} /> {t.add} "{search}"
                 </button>
                 <button
                   onClick={(e) => handleOpenInfo(search.toUpperCase(), e)}
                   className="text-slate-400 hover:text-white font-medium flex items-center gap-2 border border-slate-600 px-4 py-2 rounded-lg bg-slate-800/50"
                 >
                    <Info size={16} /> {t.searchInfo} "{search}"?
                 </button>
             </div>
          </div>
        )}
      </div>

      {/* Info Modal Integration */}
      {infoModalOpen && (
        <AssetInfoModal 
            loading={infoLoading}
            info={assetInfo}
            symbol={currentInfoSymbol}
            onClose={handleCloseInfo}
            lang={lang}
        />
      )}
    </div>
  );
};

export default AssetSelector;