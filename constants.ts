import { AssetOption, Translation, Language } from './types';

export const TRANSLATIONS: Record<Language, Translation> = {
  it: {
    appTitle: "Gemini",
    appSubtitle: "Portfolio",
    heroTitle: "Costruisci il tuo futuro con l'",
    heroTitleHighlight: "AI",
    heroDesc: "Seleziona i tuoi asset preferiti e lascia che Gemini analizzi il mercato per creare un portafoglio su misura per te.",
    step1: "Seleziona Asset",
    step2: "Profilo di Rischio",
    searchPlaceholder: "Cerca ticker (es. AAPL, ENEL.MI) o categoria...",
    searchAction: "AGGIUNGI",
    searchInfo: "Cos'è",
    add: "Aggiungi",
    noResults: "Nessun risultato trovato tra gli asset popolari.",
    categories: {
      all: 'Tutti',
      stock: 'Azioni',
      crypto: 'Crypto',
      etf: 'ETF',
      commodity: 'Materie Prime',
    },
    risks: {
      LOW: { label: "Basso", desc: "(Conservativo)" },
      MEDIUM: { label: "Medio", desc: "(Bilanciato)" },
      HIGH: { label: "Alto", desc: "(Aggressivo)" },
    },
    analyzeBtn: "Analizza e Crea Portafoglio",
    loading: "Analisi in corso...",
    nav: {
        create: "Crea",
        library: "Libreria"
    },
    results: {
      outlook: "Outlook",
      cagr: "CAGR Storico (5Y)",
      maxDrawdown: "Max Drawdown",
      volatility: "Volatilità",
      allocation: "Allocazione & Performance",
      analysis: "Analisi Strategica",
      weight: "Peso",
      asset: "Asset",
      reset: "Nuova Analisi",
      deepAnalysis: "Simulazione",
      saveToLibrary: "Salva in Libreria",
      disclaimer: "Nota: L'analisi si basa su dati storici e sulla conoscenza interna di Gemini. Non costituisce una consulenza finanziaria. Le info sugli asset usano dati live.",
      edit: "Modifica",
      save: "Salva",
      cancel: "Annulla",
      total: "Totale",
      tradingMode: "Trading Mode"
    },
    library: {
        title: "I Miei Portafogli",
        empty: "Non hai ancora salvato nessun portafoglio.",
        load: "Carica",
        delete: "Elimina",
        createdOn: "Creato il",
        assets: "asset"
    },
    modal: {
      sector: "Settore",
      nature: "Natura",
      sources: "Fonti",
      unknownTitle: "Asset non riconosciuto",
      unknownDesc: "Gemini non riesce a trovare informazioni finanziarie affidabili per questo ticker.",
      analyzing: "Gemini sta analizzando"
    },
    deep: {
      title: "Simulazione & Benchmark",
      desc: "Proiezione dell'evoluzione del capitale basata sulla volatilità storica stimata.",
      initialInvestment: "Investimento Iniziale",
      years: "Anni",
      benchmark: "Confronta con:",
      custom: "Target Personalizzato",
      customPlaceholder: "CAGR Target %",
      generating: "Calcolo simulazione...",
      scenarios: "Analisi Scenari",
      bestCase: "Best Case",
      worstCase: "Worst Case",
      timeframe: {
        y5: "5 Anni",
        y10: "10 Anni",
        y20: "20 Anni"
      }
    },
    trading: {
        title: "Trading Tattico (24h)",
        desc: "Inserisci la tua API Key per analizzare i dati in real-time. Gemini ri-bilancerà il portafoglio proteggendo il capitale (USD) se il mercato è ribassista.",
        apiKeyLabel: "Inserisci API Key",
        provider: "Provider Dati",
        useDemo: "Usa Chiavi Demo",
        analyze: "Analizza Mercato Live",
        strategic: "Strategico (Lungo Termine)",
        tactical: "Tattico (24 Ore)",
        cash: "Liquidità (USD)",
        marketData: "Dati di Mercato Live"
    },
    error: "Si è verificato un errore durante l'analisi. Riprova più tardi."
  },
  en: {
    appTitle: "Gemini",
    appSubtitle: "Portfolio",
    heroTitle: "Build your future with ",
    heroTitleHighlight: "AI",
    heroDesc: "Select your favorite assets and let Gemini analyze the market to create a tailored portfolio for you.",
    step1: "Select Assets",
    step2: "Risk Profile",
    searchPlaceholder: "Search ticker (e.g. AAPL, BTC) or category...",
    searchAction: "ADD",
    searchInfo: "What is",
    add: "Add",
    noResults: "No results found among popular assets.",
    categories: {
      all: 'All',
      stock: 'Stocks',
      crypto: 'Crypto',
      etf: 'ETFs',
      commodity: 'Commodities',
    },
    risks: {
      LOW: { label: "Low", desc: "(Conservative)" },
      MEDIUM: { label: "Medium", desc: "(Balanced)" },
      HIGH: { label: "High", desc: "(Aggressive)" },
    },
    analyzeBtn: "Analyze & Create Portfolio",
    loading: "Analyzing...",
    nav: {
        create: "Create",
        library: "Library"
    },
    results: {
      outlook: "Outlook",
      cagr: "Hist. CAGR (5Y)",
      maxDrawdown: "Max Drawdown",
      volatility: "Volatility",
      allocation: "Allocation & Performance",
      analysis: "Strategic Analysis",
      weight: "Weight",
      asset: "Asset",
      reset: "New Analysis",
      deepAnalysis: "Simulation",
      saveToLibrary: "Save to Library",
      disclaimer: "Note: Analysis is based on historical data and Gemini's internal knowledge base. Not financial advice. Asset details use live data.",
      edit: "Edit",
      save: "Save",
      cancel: "Cancel",
      total: "Total",
      tradingMode: "Trading Mode"
    },
    library: {
        title: "My Portfolios",
        empty: "You haven't saved any portfolios yet.",
        load: "Load",
        delete: "Delete",
        createdOn: "Created on",
        assets: "assets"
    },
    modal: {
      sector: "Sector",
      nature: "Nature",
      sources: "Sources",
      unknownTitle: "Asset not recognized",
      unknownDesc: "Gemini cannot find reliable financial information for this ticker.",
      analyzing: "Gemini is analyzing"
    },
    deep: {
      title: "Simulation & Benchmark",
      desc: "Projection of capital evolution based on estimated historical volatility.",
      initialInvestment: "Initial Investment",
      years: "Years",
      benchmark: "Compare with:",
      custom: "Custom Target",
      customPlaceholder: "Target CAGR %",
      generating: "Calculating simulation...",
      scenarios: "Scenario Analysis",
      bestCase: "Best Case",
      worstCase: "Worst Case",
      timeframe: {
        y5: "5 Years",
        y10: "10 Years",
        y20: "20 Years"
      }
    },
    trading: {
        title: "Tactical Trading (24h)",
        desc: "Enter your API Key to analyze real-time data. Gemini will rebalance the portfolio, protecting capital (USD) if the market is bearish.",
        apiKeyLabel: "Enter API Key",
        provider: "Data Provider",
        useDemo: "Use Demo Keys",
        analyze: "Analyze Live Market",
        strategic: "Strategic (Long Term)",
        tactical: "Tactical (24 Hours)",
        cash: "Cash (USD)",
        marketData: "Live Market Data"
    },
    error: "An error occurred during analysis. Please try again later."
  },
  es: {
    appTitle: "Gemini",
    appSubtitle: "Portfolio",
    heroTitle: "Construye tu futuro con ",
    heroTitleHighlight: "IA",
    heroDesc: "Selecciona tus activos favoritos y deja que Gemini analice el mercado para crear un portafolio a tu medida.",
    step1: "Seleccionar Activos",
    step2: "Perfil de Riesgo",
    searchPlaceholder: "Buscar ticker (ej. AAPL, BTC) o categoría...",
    searchAction: "AÑADIR",
    searchInfo: "¿Qué es",
    add: "Añadir",
    noResults: "No se encontraron resultados entre los activos populares.",
    categories: {
      all: 'Todos',
      stock: 'Acciones',
      crypto: 'Cripto',
      etf: 'ETF',
      commodity: 'Materias Primas',
    },
    risks: {
      LOW: { label: "Bajo", desc: "(Conservador)" },
      MEDIUM: { label: "Medio", desc: "(Equilibrado)" },
      HIGH: { label: "Alto", desc: "(Agresivo)" },
    },
    analyzeBtn: "Analizar y Crear Portafolio",
    loading: "Analizando...",
    nav: {
        create: "Crear",
        library: "Biblioteca"
    },
    results: {
      outlook: "Perspectiva",
      cagr: "CAGR Hist. (5A)",
      maxDrawdown: "Max Drawdown",
      volatility: "Volatilidad",
      allocation: "Asignación y Rendimiento",
      analysis: "Análisis Estratégico",
      weight: "Peso",
      asset: "Activo",
      reset: "Nuevo Análisis",
      deepAnalysis: "Simulación",
      saveToLibrary: "Guardar en Biblioteca",
      disclaimer: "Nota: El análisis se basa en datos históricos y el conocimiento interno de Gemini. No es asesoramiento financiero. Los detalles de activos usan datos en vivo.",
      edit: "Editar",
      save: "Guardar",
      cancel: "Cancelar",
      total: "Total",
      tradingMode: "Modo Trading"
    },
    library: {
        title: "Mis Portafolios",
        empty: "Aún no has guardado ningún portafolio.",
        load: "Cargar",
        delete: "Eliminar",
        createdOn: "Creado el",
        assets: "activos"
    },
    modal: {
      sector: "Sector",
      nature: "Naturaleza",
      sources: "Fuentes",
      unknownTitle: "Activo no reconocido",
      unknownDesc: "Gemini no puede encontrar información financiera confiable para este ticker.",
      analyzing: "Gemini está analizando"
    },
    deep: {
      title: "Simulación y Benchmark",
      desc: "Proyección de capital basada en volatilidad histórica estimada.",
      initialInvestment: "Inversión Inicial",
      years: "Años",
      benchmark: "Comparar con:",
      custom: "Objetivo Personalizado",
      customPlaceholder: "CAGR Objetivo %",
      generating: "Calculando simulación...",
      scenarios: "Análisis de Escenarios",
      bestCase: "Mejor Caso",
      worstCase: "Peor Caso",
      timeframe: {
        y5: "5 Años",
        y10: "10 Años",
        y20: "20 Años"
      }
    },
    trading: {
        title: "Trading Táctico (24h)",
        desc: "Ingrese su clave API para analizar datos en tiempo real. Gemini reequilibrará la cartera protegiendo el capital (USD) si el mercado es bajista.",
        apiKeyLabel: "Ingrese Clave API",
        provider: "Proveedor de Datos",
        useDemo: "Usar Claves Demo",
        analyze: "Analizar Mercado en Vivo",
        strategic: "Estratégico (Largo Plazo)",
        tactical: "Táctico (24 Horas)",
        cash: "Efectivo (USD)",
        marketData: "Datos de Mercado en Vivo"
    },
    error: "Ocurrió un error durante el análisis. Por favor intente más tarde."
  }
};

export const POPULAR_ASSETS: AssetOption[] = [
  // --- US Tech & Growth ---
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' },
  { symbol: 'MSFT', name: 'Microsoft', type: 'stock' },
  { symbol: 'GOOGL', name: 'Alphabet', type: 'stock' },
  { symbol: 'AMZN', name: 'Amazon', type: 'stock' },
  { symbol: 'TSLA', name: 'Tesla', type: 'stock' },
  { symbol: 'NVDA', name: 'NVIDIA', type: 'stock' },
  { symbol: 'META', name: 'Meta Platforms', type: 'stock' },
  { symbol: 'NFLX', name: 'Netflix', type: 'stock' },
  { symbol: 'AMD', name: 'AMD', type: 'stock' },
  { symbol: 'PLTR', name: 'Palantir', type: 'stock' },
  { symbol: 'COIN', name: 'Coinbase', type: 'stock' },
  { symbol: 'CRM', name: 'Salesforce', type: 'stock' },
  { symbol: 'UBER', name: 'Uber Technologies', type: 'stock' },
  { symbol: 'ABNB', name: 'Airbnb', type: 'stock' },

  // --- Italian (FTSE MIB) & European ---
  { symbol: 'RACE.MI', name: 'Ferrari', type: 'stock' },
  { symbol: 'ENEL.MI', name: 'Enel', type: 'stock' },
  { symbol: 'ENI.MI', name: 'Eni', type: 'stock' },
  { symbol: 'ISP.MI', name: 'Intesa Sanpaolo', type: 'stock' },
  { symbol: 'UCG.MI', name: 'UniCredit', type: 'stock' },
  { symbol: 'STLAM.MI', name: 'Stellantis', type: 'stock' },
  { symbol: 'LDO.MI', name: 'Leonardo', type: 'stock' },
  { symbol: 'MONC.MI', name: 'Moncler', type: 'stock' },
  { symbol: 'Terna.MI', name: 'Terna', type: 'stock' },
  { symbol: 'SRG.MI', name: 'Snam', type: 'stock' },
  { symbol: 'LVMH.PA', name: 'LVMH', type: 'stock' },
  { symbol: 'AIR.PA', name: 'Airbus', type: 'stock' },
  { symbol: 'SAP.DE', name: 'SAP SE', type: 'stock' },

  // --- Crypto ---
  { symbol: 'BTC', name: 'Bitcoin', type: 'crypto' },
  { symbol: 'ETH', name: 'Ethereum', type: 'crypto' },
  { symbol: 'SOL', name: 'Solana', type: 'crypto' },
  { symbol: 'BNB', name: 'Binance Coin', type: 'crypto' },
  { symbol: 'ADA', name: 'Cardano', type: 'crypto' },
  { symbol: 'XRP', name: 'Ripple', type: 'crypto' },
  { symbol: 'DOT', name: 'Polkadot', type: 'crypto' },
  { symbol: 'DOGE', name: 'Dogecoin', type: 'crypto' },
  { symbol: 'SHIB', name: 'Shiba Inu', type: 'crypto' },
  { symbol: 'PEPE', name: 'Pepe', type: 'crypto' },
  { symbol: 'MATIC', name: 'Polygon', type: 'crypto' },
  { symbol: 'AVAX', name: 'Avalanche', type: 'crypto' },
  { symbol: 'LINK', name: 'Chainlink', type: 'crypto' },
  { symbol: 'UNI', name: 'Uniswap', type: 'crypto' },
  { symbol: 'LTC', name: 'Litecoin', type: 'crypto' },
  { symbol: 'NEAR', name: 'NEAR Protocol', type: 'crypto' },

  // --- ETFs ---
  { symbol: 'SPY', name: 'S&P 500 ETF', type: 'etf' },
  { symbol: 'QQQ', name: 'Nasdaq 100 ETF', type: 'etf' },
  { symbol: 'VTI', name: 'Total Stock Mkt', type: 'etf' },
  { symbol: 'VOO', name: 'Vanguard S&P 500', type: 'etf' },
  { symbol: 'ARKK', name: 'ARK Innovation', type: 'etf' },
  { symbol: 'TLT', name: '20+ Year Treasury', type: 'etf' },
  { symbol: 'VWCE.DE', name: 'Vanguard All-World', type: 'etf' },
  { symbol: 'SMH', name: 'Semiconductor ETF', type: 'etf' },
  { symbol: 'XLE', name: 'Energy Select Sector', type: 'etf' },
  { symbol: 'XLK', name: 'Technology Select', type: 'etf' },
  { symbol: 'JEPI', name: 'JPMorgan Equity Prem', type: 'etf' },

  // --- Commodities ---
  { symbol: 'GLD', name: 'Gold Trust', type: 'commodity' },
  { symbol: 'SLV', name: 'Silver Trust', type: 'commodity' },
  { symbol: 'USO', name: 'United States Oil', type: 'commodity' },
  { symbol: 'DBC', name: 'Commodity Index', type: 'commodity' },
  { symbol: 'PPLT', name: 'Platinum', type: 'commodity' },
  { symbol: 'CORN', name: 'Corn Fund', type: 'commodity' },
  { symbol: 'WEAT', name: 'Wheat Fund', type: 'commodity' },
];

export const DEMO_KEYS = {
    COINGECKO: "CG-zvFm8QotGAyPR1LwrYmArokM",
    TWELVEDATA: "a109b23799394789a937c66745758478"
};

export const COINGECKO_MAP: Record<string, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'BNB': 'binancecoin',
    'ADA': 'cardano',
    'XRP': 'ripple',
    'DOT': 'polkadot',
    'DOGE': 'dogecoin',
    'SHIB': 'shiba-inu',
    'PEPE': 'pepe',
    'MATIC': 'matic-network',
    'AVAX': 'avalanche-2',
    'LINK': 'chainlink',
    'UNI': 'uniswap',
    'LTC': 'litecoin',
    'NEAR': 'near',
};

// Colors for top assets to ensure brand consistency
export const FIXED_COLORS: Record<string, string> = {
  // Crypto
  'BTC': '#F7931A',
  'ETH': '#627EEA',
  'SOL': '#14F195',
  'BNB': '#F3BA2F',
  'USDT': '#26A17B',
  'USDC': '#2775CA',
  'ADA': '#60A5FA',
  'XRP': '#3B82F6',
  'DOGE': '#C2A633',
  'DOT': '#E6007A',
  'USD': '#10B981', // Cash

  // Tech Stocks
  'AAPL': '#94A3B8',
  'MSFT': '#00A4EF',
  'GOOGL': '#4285F4',
  'AMZN': '#FF9900',
  'TSLA': '#E31937',
  'NVDA': '#76B900',
  'META': '#0668E1',
  'NFLX': '#E50914',

  // Commodities/Others
  'GLD': '#FFD700',
  'SLV': '#C0C0C0'
};