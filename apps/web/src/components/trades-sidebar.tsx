"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

type Trade = {
  id: string;
  model: string;
  modelLogo: string;
  type: "long" | "short";
  symbol: string;
  price: number;
  quantity: number;
  notional: number;
  pnl: number;
  holdingTime: string;
  timestamp: string;
};

const MODEL_INFO: Record<string, { logo: string; color: string; label: string }> = {
  grok_4: {
    logo: "https://nof1.ai/logos_white/Grok_logo.webp",
    color: "#000000",
    label: "Grok 4",
  },
  gpt_5: {
    logo: "https://nof1.ai/logos_white/GPT_logo.png",
    color: "#39B295",
    label: "GPT 5",
  },
  deepseek_chat_v3_1: {
    logo: "https://nof1.ai/logos_white/deepseek_logo.png",
    color: "#4D6BFE",
    label: "DeepSeek V3.1",
  },
  claude_sonnet_4_5: {
    logo: "https://nof1.ai/logos_white/Claude_logo.png",
    color: "#FF6B35",
    label: "Claude Sonnet 4.5",
  },
  gemini_2_5_pro: {
    logo: "https://nof1.ai/logos_white/Gemini_logo.webp",
    color: "#4285F4",
    label: "Gemini 2.5 Pro",
  },
  qwen3_max: {
    logo: "https://nof1.ai/logos_white/qwen_logo.png",
    color: "#8B5CF6",
    label: "Qwen3 Max",
  },
};

// Mock data for demonstration
const DEMO_TRADES: Trade[] = [
  {
    id: "1",
    model: "grok_4",
    modelLogo: MODEL_INFO.grok_4.logo,
    type: "short",
    symbol: "ETH",
    price: 3744.7,
    quantity: -2.93,
    notional: 10972,
    pnl: -242.48,
    holdingTime: "3H 58M",
    timestamp: "10/23, 6:43 AM",
  },
  {
    id: "2",
    model: "gpt_5",
    modelLogo: MODEL_INFO.gpt_5.logo,
    type: "short",
    symbol: "ETH",
    price: 3781.2,
    quantity: -2.31,
    notional: 8735,
    pnl: -100.65,
    holdingTime: "4H 41M",
    timestamp: "10/23, 6:41 AM",
  },
  {
    id: "3",
    model: "deepseek_chat_v3_1",
    modelLogo: MODEL_INFO.deepseek_chat_v3_1.logo,
    type: "long",
    symbol: "XRP",
    price: 2.4666,
    quantity: 3542.0,
    notional: 8737,
    pnl: -455.66,
    holdingTime: "61H 38M",
    timestamp: "10/23, 3:09 AM",
  },
  {
    id: "4",
    model: "grok_4",
    modelLogo: MODEL_INFO.grok_4.logo,
    type: "long",
    symbol: "ETH",
    price: 3851.2,
    quantity: 5.06,
    notional: 19487,
    pnl: -657.41,
    holdingTime: "118H 33M",
    timestamp: "10/23, 2:41 AM",
  },
];

type TradesSidebarProps = {
  isExpanded: boolean;
  onToggle: () => void;
};

export default function TradesSidebar({ isExpanded, onToggle }: TradesSidebarProps) {
  const [trades, setTrades] = useState<Trade[]>(DEMO_TRADES);
  const [filter, setFilter] = useState<"all" | string>("all");
  const [activeTab, setActiveTab] = useState<"trades" | "modelchat" | "positions">("trades");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatNotional = (notional: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(notional);
  };

  const filteredTrades = filter === "all" ? trades : trades.filter(t => t.model === filter);

  return (
    <div
      className={`flex h-full flex-col border-l bg-background transition-all duration-1000 ease-[cubic-bezier(0.091,0.543,0.148,0.909)] ${
        isExpanded ? "w-full" : "w-96"
      }`}
      style={{
        position: isExpanded ? "absolute" : "relative",
        right: 0,
        top: 0,
        zIndex: isExpanded ? 50 : 1,
        backgroundColor: "hsl(var(--background))",
      }}
    >
      {/* Tabs */}
      <div className="border-b">
        <div className="flex">
          <button
            type="button"
            onClick={() => setActiveTab("trades")}
            className={`flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === "trades"
                ? "bg-background text-foreground border-b-2 border-primary"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
            }`}
          >
            Completed Trades
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("modelchat")}
            className={`flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === "modelchat"
                ? "bg-background text-foreground border-b-2 border-primary"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
            }`}
          >
            ModelChat
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("positions")}
            className={`flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === "positions"
                ? "bg-background text-foreground border-b-2 border-primary"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
            }`}
          >
            Positions
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "trades" && (
        <>
          {/* Filter info */}
          <div className="border-b bg-muted/30 px-3 py-[7px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wide">Filter:</span>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded border bg-background px-2 py-1 text-xs font-medium hover:bg-accent transition-colors"
                >
                  All Models
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground">
                Showing Last 400 Trades
              </span>
            </div>
          </div>

          {/* Trades list */}
          <ScrollArea className="flex-1 overflow-auto">
            <div className="px-4">
              {filteredTrades.map((trade, idx) => {
            const modelInfo = MODEL_INFO[trade.model];
            const isProfitable = trade.pnl > 0;

            return (
              <div key={trade.id}>
                <div className="py-4 transition-colors hover:bg-accent/30">
                  {/* Header with model and time */}
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          backgroundColor: modelInfo?.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={trade.modelLogo}
                          alt={modelInfo?.label}
                          style={{
                            width: "18px",
                            height: "18px",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold">
                        {modelInfo?.label || trade.model}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {trade.timestamp}
                    </span>
                  </div>

                  {/* Trade type and symbol */}
                  <div className="mb-3 flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">completed a</span>
                    <Badge
                      variant={trade.type === "long" ? "default" : "outline"}
                      className={`text-xs font-semibold ${
                        trade.type === "short" ? "bg-red-500/10 text-red-500 border-red-500/20" : ""
                      }`}
                    >
                      {trade.type.toUpperCase()}
                    </Badge>
                    <span className="text-muted-foreground">trade on</span>
                    <Badge variant="outline" className="text-xs font-semibold">
                      {trade.symbol}
                    </Badge>
                  </div>

                  {/* Trade details */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-light">
                        {formatPrice(trade.price)} ≈ {formatPrice(trade.price * 0.98)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-light">{trade.quantity.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Notional:</span>
                      <span className="font-light">
                        {formatNotional(trade.notional)} ≈ {formatNotional(trade.notional * 1.02)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Holding time:</span>
                      <span className="font-light">{trade.holdingTime}</span>
                    </div>
                  </div>

                  {/* P&L */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide">NET P&L:</span>
                      <span
                        className={`text-base font-bold tabular-nums ${
                          isProfitable ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {isProfitable ? "+" : ""}
                        {formatPrice(trade.pnl)}
                      </span>
                    </div>
                  </div>
                </div>
                {idx < filteredTrades.length - 1 && (
                  <div className="border-b" />
                )}
              </div>
            );
          })}
            </div>
          </ScrollArea>
        </>
      )}

      {activeTab === "modelchat" && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm font-medium mb-2">ModelChat</p>
            <p className="text-xs">Chat with AI models about their trading decisions</p>
          </div>
        </div>
      )}

      {activeTab === "positions" && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm font-medium mb-2">Positions</p>
            <p className="text-xs">View current open positions</p>
          </div>
        </div>
      )}
    </div>
  );
}
