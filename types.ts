export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export type Language = 'it' | 'en' | 'es';

export interface Allocation {
  symbol: string;
  name: string;
  percentage: number;
  reason: string;
  color: string;
  cagr: number; // Estimated 5-year CAGR
  maxDrawdown: number; // Estimated historical Max Drawdown
}

export interface PortfolioResponse {
  strategyTitle: string;
  allocations: Allocation[];
  analysis: string;
  expectedOutlook: string;
  totalCAGR: number; // Weighted average CAGR of the portfolio
  totalMaxDrawdown: number; // Estimated portfolio Max Drawdown
  volatility: string; // Text description of volatility
}

export interface SavedPortfolio extends PortfolioResponse {
  id: string;
  createdAt: number;
  originalAssets: string[];
  riskLevel: RiskLevel;
}

export type AssetType = 'crypto' | 'stock' | 'etf' | 'commodity' | 'forex';

export interface AssetOption {
  symbol: string;
  name: string;
  type: AssetType;
}

export interface AssetInfo {
  symbol: string;
  name: string;
  description: string;
  sector: string;
  trend: string;
  isRecognized: boolean;
  sources?: { title: string; uri: string }[];
}

export interface SimulationPoint {
  year: number;
  portfolio: number; // Multiplier relative to 1.0
  portfolioBest: number; // Optimistic multiplier
  portfolioWorst: number; // Pessimistic multiplier
  sp500: number;
  btc: number;
  gold: number;
}

export interface SimulationResponse {
  points: SimulationPoint[];
  insight: string;
}

// --- Trading & Market Data ---
export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
}

export interface TradingAllocation {
  symbol: string;
  percentage: number;
}

export interface TradingStrategyResponse {
  tacticalAllocations: TradingAllocation[];
  reasoning: string;
  action: 'BUY' | 'SELL' | 'HOLD' | 'HEDGE';
}

export interface Translation {
  appTitle: string;
  appSubtitle: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroDesc: string;
  step1: string;
  step2: string;
  searchPlaceholder: string;
  searchAction: string;
  searchInfo: string;
  add: string;
  noResults: string;
  categories: {
    all: string;
    stock: string;
    crypto: string;
    etf: string;
    commodity: string;
  };
  risks: {
    LOW: { label: string; desc: string };
    MEDIUM: { label: string; desc: string };
    HIGH: { label: string; desc: string };
  };
  analyzeBtn: string;
  loading: string;
  nav: {
    create: string;
    library: string;
  };
  results: {
    outlook: string;
    cagr: string;
    maxDrawdown: string;
    volatility: string;
    allocation: string;
    analysis: string;
    weight: string;
    asset: string;
    reset: string;
    deepAnalysis: string;
    saveToLibrary: string;
    disclaimer: string;
    edit: string;
    save: string;
    cancel: string;
    total: string;
    tradingMode: string;
  };
  library: {
    title: string;
    empty: string;
    load: string;
    delete: string;
    createdOn: string;
    assets: string;
  };
  modal: {
    sector: string;
    nature: string;
    sources: string;
    unknownTitle: string;
    unknownDesc: string;
    analyzing: string;
  };
  deep: {
    title: string;
    desc: string;
    initialInvestment: string;
    years: string;
    benchmark: string;
    custom: string;
    customPlaceholder: string;
    generating: string;
    scenarios: string;
    bestCase: string;
    worstCase: string;
    timeframe: {
      y5: string;
      y10: string;
      y20: string;
    }
  };
  trading: {
    title: string;
    desc: string;
    apiKeyLabel: string;
    provider: string;
    useDemo: string;
    analyze: string;
    strategic: string;
    tactical: string;
    cash: string;
    marketData: string;
  };
  error: string;
}