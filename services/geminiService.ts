import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PortfolioResponse, RiskLevel, AssetInfo, Language, SimulationResponse, Allocation, MarketData, TradingStrategyResponse } from "../types";
import { FIXED_COLORS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const portfolioSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    strategyTitle: {
      type: Type.STRING,
      description: "A catchy title for the portfolio strategy.",
    },
    allocations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          symbol: { type: Type.STRING },
          name: { type: Type.STRING, description: "Full name of the asset" },
          percentage: { type: Type.NUMBER, description: "Percentage allocation (0-100)" },
          reason: { type: Type.STRING, description: "Brief reason for this specific allocation" },
          color: { type: Type.STRING, description: "A hex color code suitable for a chart for this asset" },
          cagr: { type: Type.NUMBER, description: "Estimated 5-year historical CAGR (percentage, e.g., 12.5 for 12.5%)" },
          maxDrawdown: { type: Type.NUMBER, description: "Estimated historical Maximum Drawdown percentage (positive number, e.g. 35 for 35% drop)" }
        },
        required: ["symbol", "name", "percentage", "reason", "color", "cagr", "maxDrawdown"],
      },
    },
    analysis: {
      type: Type.STRING,
      description: "A comprehensive markdown analysis of why this portfolio works for the risk level.",
    },
    expectedOutlook: {
      type: Type.STRING,
      description: "A short sentence describing the potential outlook.",
    },
    totalCAGR: {
      type: Type.NUMBER,
      description: "The weighted average historical CAGR of the entire portfolio (percentage).",
    },
    totalMaxDrawdown: {
      type: Type.NUMBER,
      description: "The estimated historical Maximum Drawdown of the entire weighted portfolio, considering diversification benefits (percentage, positive number).",
    },
    volatility: {
      type: Type.STRING,
      description: "A 1-2 word description of volatility (translated into the target language).",
    }
  },
  required: ["strategyTitle", "allocations", "analysis", "expectedOutlook", "totalCAGR", "totalMaxDrawdown", "volatility"],
};

const simulationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    points: {
      type: Type.ARRAY,
      description: "Data points representing Year 0 to Year N.",
      items: {
        type: Type.OBJECT,
        properties: {
          year: { type: Type.NUMBER },
          portfolio: { type: Type.NUMBER, description: "Baseline Cumulative return multiplier (start at 1.0). If +10%, it is 1.10." },
          portfolioBest: { type: Type.NUMBER, description: "Optimistic scenario multiplier (e.g., Bull market)." },
          portfolioWorst: { type: Type.NUMBER, description: "Pessimistic scenario multiplier (e.g., Recession)." },
          sp500: { type: Type.NUMBER, description: "Cumulative return multiplier for S&P 500." },
          btc: { type: Type.NUMBER, description: "Cumulative return multiplier for Bitcoin." },
          gold: { type: Type.NUMBER, description: "Cumulative return multiplier for Gold." },
        },
        required: ["year", "portfolio", "portfolioBest", "portfolioWorst", "sp500", "btc", "gold"]
      }
    },
    insight: { type: Type.STRING, description: "A brief comparison insight (1 sentence)." }
  },
  required: ["points", "insight"]
};

const tradingSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    tacticalAllocations: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                symbol: { type: Type.STRING },
                percentage: { type: Type.NUMBER }
            }
        }
    },
    reasoning: { type: Type.STRING, description: "Explain the strategy for Maximum Profit based on 24h momentum." },
    action: { type: Type.STRING, enum: ['BUY', 'SELL', 'HOLD', 'HEDGE'] }
  }
};

const getLanguageName = (lang: Language) => {
  switch (lang) {
    case 'en': return 'English';
    case 'es': return 'Spanish';
    default: return 'Italian';
  }
};

const applyFixedColors = (allocations: any[]) => {
  return allocations.map(a => ({
    ...a,
    color: FIXED_COLORS[a.symbol.toUpperCase()] || a.color
  }));
};

export const generatePortfolioAnalysis = async (
  assets: string[],
  riskLevel: RiskLevel,
  lang: Language
): Promise<PortfolioResponse> => {
  if (assets.length === 0) {
    throw new Error("No assets selected");
  }

  const langName = getLanguageName(lang);

  const prompt = `
    Act as a quantitative financial analyst.
    My risk profile is: ${riskLevel}.
    I want to build a portfolio using ONLY the following assets: ${assets.join(", ")}.
    
    1. Create a balanced percentage allocation that respects my risk profile.
    2. Estimate the 5-year historical CAGR for each individual asset based on your historical market knowledge.
    3. Estimate the historical Maximum Drawdown (Max DD) for each asset based on major market corrections (e.g. 2008, 2020, 2022).
    4. Calculate the weighted total portfolio CAGR.
    5. Estimate the Total Portfolio Max Drawdown. IMPORTANT: Consider diversification. If assets are uncorrelated (e.g., Stocks + Bonds + Gold), the portfolio Max DD should be lower than the weighted average of individual Max DDs.
    
    Provide HEX colors for a dark theme pie chart.
    
    IMPORTANT: 
    - The 'analysis', 'reason', 'strategyTitle', 'expectedOutlook', and 'volatility' fields MUST be written in ${langName}.
    - This analysis is based on historical patterns stored in your training data, not real-time feeds.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: portfolioSchema,
        temperature: 0.4, 
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text) as PortfolioResponse;
      // Overwrite colors with branded ones if available
      data.allocations = applyFixedColors(data.allocations);
      return data;
    }
    throw new Error("No data returned from Gemini");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const getAssetInfo = async (symbol: string, lang: Language): Promise<AssetInfo> => {
  const langName = getLanguageName(lang);
  
  const prompt = `
    Use Google Search to identify the financial ticker: "${symbol}".
    
    Return EXCLUSIVELY a JSON object (no markdown or other text) with this exact structure:
    {
      "symbol": "${symbol}",
      "name": "Full name of the company/asset found",
      "description": "Describe what it is in two sentences (IN ${langName}).",
      "sector": "The sector it belongs to (IN ${langName}).",
      "trend": "Short summary of the asset's nature e.g. 'Volatile', 'Defensive' (IN ${langName}).",
      "isRecognized": true
    }

    If the ticker does not exist or is not a financial asset, set "isRecognized": false.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, 
      },
    });

    let data: AssetInfo;
    
    try {
      const rawText = response.text || "{}";
      const jsonString = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      data = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse JSON from search result", e);
      return {
        symbol: symbol,
        name: "Format Error",
        description: "Unable to retrieve structured data.",
        sector: "-",
        trend: "-",
        isRecognized: false
      };
    }

    const sources: { title: string; uri: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri,
          });
        }
      });
    }

    return { ...data, sources };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export const generateSimulation = async (
  assets: string[],
  riskLevel: RiskLevel,
  lang: Language,
  duration: number
): Promise<SimulationResponse> => {
  const langName = getLanguageName(lang);
  const prompt = `
    Generate a ${duration}-year forward-looking simulation for a portfolio composed of: ${assets.join(", ")}.
    Risk Level: ${riskLevel}.
    
    Return a JSON object containing ${duration + 1} data points (Year 0 to ${duration}).
    Year 0 must be exactly 1.0 for all (baseline).
    
    For Years 1-${duration}, provide cumulative growth multipliers (e.g., 1.15 for +15% total growth since start).
    - "portfolio": The baseline probable simulated path.
    - "portfolioBest": An OPTIMISTIC scenario (e.g. favorable market conditions, +1 standard deviation).
    - "portfolioWorst": A PESSIMISTIC scenario (e.g. recession, -1 standard deviation).
    - "sp500": A standard simulation for the S&P 500.
    - "btc": A standard simulation for Bitcoin (BTC).
    - "gold": A standard simulation for Gold (GLD/XAU).
    
    Also provide a short "insight" sentence in ${langName} comparing the portfolio to the benchmarks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: simulationSchema,
        temperature: 0.5,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as SimulationResponse;
    }
    throw new Error("No simulation data returned");
  } catch (error) {
    console.error("Gemini Simulation Error:", error);
    throw error;
  }
};

export const generateTradingStrategy = async (
    currentAllocations: Allocation[],
    marketData: MarketData[],
    lang: Language
): Promise<TradingStrategyResponse> => {
    const langName = getLanguageName(lang);
    
    // Construct a context string for Gemini
    const portfolioContext = currentAllocations.map(a => `${a.symbol}: ${a.percentage}%`).join(', ');
    const marketContext = marketData.map(d => `${d.symbol}: Price $${d.price}, 24h Change ${d.change24h}%`).join('\n');

    const prompt = `
      Act as a high-frequency algorithmic trader aiming for MAXIMUM PROFIT over the next 24 hours.
      Current Strategic Portfolio: ${portfolioContext}
      
      REAL-TIME MARKET DATA (24h):
      ${marketContext}
      
      Task:
      Rebalance the portfolio for a tactical 24h horizon to capture short-term alpha (Maximum Profit).
      
      Rules:
      1. MOMENTUM IS KEY. If an asset is surging (> +3%), INCREASE its allocation significantly to ride the wave.
      2. CUT LOSERS. If an asset is dropping significantly (< -2%), reduce it immediately.
      3. SAFETY. If the entire market is crashing (all red), move funds to "USD" (Cash) to preserve capital.
      4. If an asset is flat, maintain or slightly reduce to fund the winners.
      5. The total allocation MUST sum to 100%.
      
      Output reasoning in ${langName} explaining your aggressive moves.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: tradingSchema,
                temperature: 0.3
            }
        });
        
        if (response.text) {
            const data = JSON.parse(response.text) as TradingStrategyResponse;
            // Apply branded colors logic here too for tactical allocations
            // For USD we use a specific green
            data.tacticalAllocations = data.tacticalAllocations.map(a => ({
                 ...a,
                 // We don't have a 'color' field in TradingAllocation schema directly but the UI derives it.
                 // However, we can handle it in the UI mapping.
                 // The main fix is in the Portfolio generation.
                 // For trading, the UI uses the strategic color or a fallback.
            }));
            return data;
        }
        throw new Error("No trading data");
    } catch (e) {
        console.error(e);
        throw e;
    }
}