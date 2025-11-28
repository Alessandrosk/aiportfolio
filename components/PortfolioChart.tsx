import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Allocation, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface PortfolioChartProps {
  data: Allocation[];
  lang: Language;
}

const CustomTooltip = ({ active, payload, lang }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const t = TRANSLATIONS[lang];
    
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl z-50">
        <p className="font-bold text-white mb-1">{data.name} ({data.symbol})</p>
        <div className="flex items-center justify-between gap-4 mt-1">
            <span className="text-slate-400 text-xs">{t.results.weight}:</span>
            <span className="text-cyan-400 font-mono font-bold text-lg">{data.percentage}%</span>
        </div>
        <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400 text-xs">{t.results.cagr}:</span>
            <span className={`font-mono font-bold ${data.cagr >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {data.cagr > 0 ? '+' : ''}{data.cagr}%
            </span>
        </div>
        <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400 text-xs">{t.results.maxDrawdown}:</span>
            <span className="font-mono font-bold text-red-400">
                -{data.maxDrawdown}%
            </span>
        </div>
        <p className="text-xs text-slate-400 max-w-[200px] mt-2 border-t border-slate-800 pt-2">{data.reason}</p>
      </div>
    );
  }
  return null;
};

const PortfolioChart: React.FC<PortfolioChartProps> = ({ data, lang }) => {
  // Sort data so the biggest chunks start at the top
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="h-[350px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sortedData as any[]}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="percentage"
            stroke="none"
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} className="outline-none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip lang={lang} />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value, entry: any) => (
               <span className="text-slate-300 ml-1">{entry.payload.symbol}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioChart;