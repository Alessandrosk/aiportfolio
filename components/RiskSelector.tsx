import React from 'react';
import { RiskLevel, Language } from '../types';
import { ShieldCheck, TrendingUp, Zap } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface RiskSelectorProps {
  value: RiskLevel;
  onChange: (level: RiskLevel) => void;
  lang: Language;
}

const RiskSelector: React.FC<RiskSelectorProps> = ({ value, onChange, lang }) => {
  const t = TRANSLATIONS[lang];

  const options = [
    { level: RiskLevel.LOW, label: t.risks.LOW.label, desc: t.risks.LOW.desc, icon: ShieldCheck, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/50' },
    { level: RiskLevel.MEDIUM, label: t.risks.MEDIUM.label, desc: t.risks.MEDIUM.desc, icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/50' },
    { level: RiskLevel.HIGH, label: t.risks.HIGH.label, desc: t.risks.HIGH.desc, icon: Zap, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/50' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
        <span className="bg-purple-500/10 text-purple-400 p-1 rounded">2</span> {t.step2}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((option) => {
            const isSelected = value === option.level;
            const Icon = option.icon;
            return (
                <button
                    key={option.level}
                    onClick={() => onChange(option.level)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
                        isSelected 
                        ? `${option.bg} ${option.border} shadow-lg` 
                        : 'bg-slate-800/30 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-slate-900/30' : 'bg-slate-900'} ${option.color}`}>
                        <Icon size={24} />
                    </div>
                    <div className="text-left">
                        <div className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {option.label}
                        </div>
                        <div className="text-xs text-slate-500">
                             {option.desc}
                        </div>
                    </div>
                    {isSelected && (
                        <div className={`absolute right-3 top-3 w-2 h-2 rounded-full ${option.color.replace('text-', 'bg-')} animate-pulse`} />
                    )}
                </button>
            )
        })}
      </div>
    </div>
  );
};

export default RiskSelector;