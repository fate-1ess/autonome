"use client";

import { TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";
import Image from "next/image";

type GlowingLineChartProps = {
  chartData: Array<{ month: string; [key: string]: number | string }>;
  chartConfig: ChartConfig;
  valueMode?: "usd" | "percent";
  onValueModeChange?: (mode: "usd" | "percent") => void;
  timeFilter?: "all" | "72h";
  onTimeFilterChange?: (filter: "all" | "72h") => void;
  hoveredLine?: string | null;
  onHoverLine?: (key: string | null) => void;
};

// Model logo URLs and colors
const MODEL_INFO: Record<
  string,
  { logo: string; color: string; label: string }
> = {
  gpt_5: {
    logo: "https://nof1.ai/logos_white/GPT_logo.png",
    color: "#39B295",
    label: "GPT 5",
  },
  gemini_2_5_pro: {
    logo: "https://nof1.ai/logos_white/Gemini_logo.webp",
    color: "#4285F4",
    label: "Gemini 2.5 Pro",
  },
  grok_4: {
    logo: "https://nof1.ai/logos_white/Grok_logo.webp",
    color: "#000000",
    label: "Grok 4",
  },
  claude_sonnet_4_5: {
    logo: "https://nof1.ai/logos_white/Claude_logo.png",
    color: "#FF6B35",
    label: "Claude Sonnet 4.5",
  },
  deepseek_chat_v3_1: {
    logo: "https://nof1.ai/logos_white/deepseek_logo.png",
    color: "#4D6BFE",
    label: "DeepSeek V3.1",
  },
  qwen3_max: {
    logo: "https://nof1.ai/logos_white/qwen_logo.png",
    color: "#8B5CF6",
    label: "Qwen3 Max",
  },
};

// Custom dot component for the last point with icon and value
const CustomEndDot = (props: {
  cx?: number;
  cy?: number;
  value?: number;
  payload?: { month: string };
  dataKey?: string;
  chartConfig?: ChartConfig;
  index?: number;
  data?: Array<{ month: string; [key: string]: number | string }>;
  hoveredLine?: string | null;
}) => {
  const { cx, cy, value, dataKey, index, data, hoveredLine } = props;

  if (!cx || !cy || !value || !dataKey || !data) {
    return null;
  }

  // Only render on the last data point
  if (index !== data.length - 1) {
    return null;
  }

  const modelInfo = MODEL_INFO[dataKey];
  if (!modelInfo) {
    return null;
  }

  const { logo, color } = modelInfo;
  const isHovered = hoveredLine === dataKey;
  const isDimmed = hoveredLine && hoveredLine !== dataKey;

  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

  return (
    <g>
      {/* Main circle with logo background */}
      <circle
        cx={cx}
        cy={cy}
        r={isHovered ? 16 : 14}
        fill={color}
        opacity={isDimmed ? 0.3 : 1}
      />
      {/* Model logo as image - full size */}
      <image
        x={cx - (isHovered ? 16 : 14)}
        y={cy - (isHovered ? 16 : 14)}
        width={isHovered ? 32 : 28}
        height={isHovered ? 32 : 28}
        href={logo}
        preserveAspectRatio="xMidYMid meet"
        style={{
          clipPath: `circle(${isHovered ? 16 : 14}px at 50% 50%)`,
          pointerEvents: 'none'
        }}
        opacity={isDimmed ? 0.3 : 1}
      />
      {/* Value label */}
      <foreignObject x={cx + 25} y={cy - 12} width={100} height={24} opacity={isDimmed ? 0.3 : 1}>
        <div
          style={{
            backgroundColor: color,
            color: "white",
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            border: isHovered ? "2px solid white" : "none",
          }}
        >
          {formattedValue}
        </div>
      </foreignObject>
    </g>
  );
};

// Custom tooltip that shows only the hovered line's value
const CustomTooltip = ({
  active,
  payload,
  hoveredLine,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
    payload: { month: string };
  }>;
  hoveredLine?: string | null;
}) => {
  if (!active || !payload || !payload.length || !hoveredLine) {
    return null;
  }

  const hoveredData = payload.find((p) => p.dataKey === hoveredLine);
  if (!hoveredData) {
    return null;
  }

  const modelInfo = MODEL_INFO[hoveredLine];
  if (!modelInfo) {
    return null;
  }

  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(hoveredData.value);

  return (
    <div
      style={{
        backgroundColor: modelInfo.color,
        color: "white",
        padding: "8px 12px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "bold",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {formattedValue}
    </div>
  );
};

export function GlowingLineChart({
  chartData,
  chartConfig,
  valueMode = "usd",
  onValueModeChange,
  timeFilter = "all",
  onTimeFilterChange,
  hoveredLine: externalHoveredLine,
  onHoverLine,
}: GlowingLineChartProps) {
  const [internalHoveredLine, setInternalHoveredLine] = useState<string | null>(null);
  const hoveredLine = externalHoveredLine ?? internalHoveredLine;

  const setHoveredLine = (key: string | null) => {
    setInternalHoveredLine(key);
    onHoverLine?.(key);
  };

  // Preload all model logos to prevent flickering
  useEffect(() => {
    const imageUrls = Object.values(MODEL_INFO).map(info => info.logo);
    imageUrls.forEach(url => {
      const img = new window.Image();
      img.src = url;
    });
  }, []);

  // Extract all model keys dynamically from chartConfig, excluding buynnhold_btc
  const modelKeys = Object.keys(chartConfig).filter(key => key !== "buynnhold_btc");

  const lastPoint = chartData.at(-1) ?? { month: "" };

  const isPercent = valueMode === "percent";

  const formatValue = (v?: number): string => {
    if (typeof v !== "number") {
      return "";
    }
    return isPercent
      ? `${Math.round(v)}%`
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 2,
        }).format(v);
  };

  // Calculate Y-axis domain
  const allValues: number[] = [];
  chartData.forEach((point) => {
    modelKeys.forEach((key) => {
      const val = point[key];
      if (typeof val === "number") {
        allValues.push(val);
      }
    });
  });

  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.1;
  const yMin = Math.floor((minValue - padding) / 1000) * 1000;
  const yMax = Math.ceil((maxValue + padding) / 1000) * 1000;



  return (
    <div className="flex h-full flex-col">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button
              aria-pressed={valueMode === "usd"}
              className="h-8 px-3 text-xs"
              onClick={() => onValueModeChange?.("usd")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onValueModeChange?.("usd");
                }
              }}
              type="button"
              variant={valueMode === "usd" ? "default" : "outline"}
            >
              $
            </Button>
            <Button
              aria-pressed={valueMode === "percent"}
              className="h-8 px-3 text-xs"
              onClick={() => onValueModeChange?.("percent")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onValueModeChange?.("percent");
                }
              }}
              type="button"
              variant={valueMode === "percent" ? "default" : "outline"}
            >
              %
            </Button>
          </div>
          <div>
            <div className="flex justify-around items-center gap-2">
              <h2 className="text-sm font-medium uppercase tracking-wide">
                TOTAL ACCOUNT VALUE
              </h2>
              <Badge
                className="border-none bg-green-500/10 text-green-500"
                variant="outline"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Live</span>
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Real-time model equity tracking</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              aria-pressed={timeFilter === "all"}
              className="h-8 px-3 text-xs"
              onClick={() => onTimeFilterChange?.("all")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onTimeFilterChange?.("all");
                }
              }}
              type="button"
              variant={timeFilter === "all" ? "default" : "outline"}
            >
              ALL
            </Button>
            <Button
              aria-pressed={timeFilter === "72h"}
              className="h-8 px-3 text-xs"
              onClick={() => onTimeFilterChange?.("72h")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onTimeFilterChange?.("72h");
                }
              }}
              type="button"
              variant={timeFilter === "72h" ? "default" : "outline"}
            >
              72H
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 px-6 py-4 min-h-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 10,
              right: 120,
              top: 10,
              bottom: 10,
            }}
            onMouseLeave={() => setHoveredLine(null)}
          >
            <defs>
              {/* Preload images in SVG defs to prevent flickering */}
              {Object.entries(MODEL_INFO).map(([key, info]) => (
                <image
                  key={`preload-${key}`}
                  href={info.logo}
                  width="0"
                  height="0"
                />
              ))}
            </defs>
            <title>Model performance over time</title>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
              opacity={0.3}
            />
            <XAxis
              axisLine={false}
              dataKey="month"
              tickLine={false}
              tickMargin={12}
              tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              domain={isPercent ? [-100, 80] : [2000, 16000]}
              ticks={isPercent ? undefined : [4000, 6000, 8000, 10000, 12000, 14000, 16000]}
              tickFormatter={(v: number) =>
                isPercent
                  ? `${Math.round(v)}%`
                  : new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(v)
              }
              tickLine={false}
              tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
              width={80}
            />
            {/* Reference line at starting value */}
            {!isPercent && (
              <ReferenceLine
                y={10000}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
                opacity={0.5}
              />
            )}
            <Tooltip
              content={<CustomTooltip hoveredLine={hoveredLine} />}
              cursor={{
                stroke: hoveredLine ? MODEL_INFO[hoveredLine]?.color : "#888",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
            />
            {modelKeys.map((key) => {
              const modelInfo = MODEL_INFO[key];
              const color = modelInfo?.color || chartConfig[key]?.color || "hsl(var(--chart-1))";
              const isHovered = hoveredLine === key;
              const isDimmed = hoveredLine && hoveredLine !== key;

              return (
                <Line
                  key={key}
                  connectNulls
                  dataKey={key}
                  dot={(dotProps) => (
                    <CustomEndDot
                      {...dotProps}
                      chartConfig={chartConfig}
                      data={chartData}
                      hoveredLine={hoveredLine}
                    />
                  )}
                  stroke={color}
                  strokeWidth={isHovered ? 4 : 2}
                  strokeOpacity={isDimmed ? 0.2 : 1}
                  type="monotone"
                  activeDot={false}
                  onMouseEnter={() => setHoveredLine(key)}
                />
              );
            })}
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
}
