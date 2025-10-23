"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type ModelLegendProps = {
  chartData: Array<{ month: string; [key: string]: number | string }>;
  chartConfig: Record<string, { label: string; color: string }>;
  valueMode?: "usd" | "percent";
  hoveredLine: string | null;
  onHoverLine: (key: string | null) => void;
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

export default function ModelLegend({
  chartData,
  chartConfig,
  valueMode = "usd",
  hoveredLine,
  onHoverLine,
}: ModelLegendProps) {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const modelKeys = Object.keys(chartConfig).filter(
    (key) => key !== "buynnhold_btc"
  );
  const lastPoint = chartData.at(-1) ?? { month: "" };
  const isPercent = valueMode === "percent";

  // Preload all model logos
  useEffect(() => {
    const imageUrls = Object.values(MODEL_INFO).map(info => info.logo);
    const imagePromises = imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
    });

    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch(() => setImagesLoaded(true));
  }, []);

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

  // Sort model keys by current value (descending)
  const sortedModelKeys = [...modelKeys].sort((a, b) => {
    const aValue =
      typeof lastPoint[a] === "number" ? (lastPoint[a] as number) : 0;
    const bValue =
      typeof lastPoint[b] === "number" ? (lastPoint[b] as number) : 0;
    return bValue - aValue;
  });

  return (
    <div className="border-t px-6 py-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
        {sortedModelKeys.map((key) => {
          const modelInfo = MODEL_INFO[key];
          const color =
            modelInfo?.color ||
            chartConfig[key]?.color ||
            "hsl(var(--chart-1))";
          const label = modelInfo?.label || chartConfig[key]?.label || key;
          const logo = modelInfo?.logo;
          const value =
            typeof lastPoint[key] === "number"
              ? (lastPoint[key] as number)
              : undefined;
          const isHovered = hoveredLine === key;
          const isDimmed = hoveredLine && hoveredLine !== key;

          return (
            <div
              className="flex flex-col items-center justify-center rounded-md border px-3 py-2 text-sm transition-all cursor-pointer"
              key={key}
              onMouseEnter={() => onHoverLine(key)}
              onMouseLeave={() => onHoverLine(null)}
              style={{
                borderColor: isHovered ? color : "hsl(var(--border))",
                borderWidth: isHovered ? "2px" : "1px",
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            >
              <div className="flex items-center gap-2" style={{ opacity: isDimmed ? 0.4 : 1 }}>
                {logo ? (
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={String(logo)}
                      alt={String(label)}
                      width={20}
                      height={20}
                      style={{ objectFit: "cover", display: imagesLoaded ? "block" : "none" }}
                      priority
                      unoptimized
                    />
                  </div>
                ) : (
                  <span
                    aria-hidden
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}
                <span className="font-medium">{label}</span>
              </div>
              <span className="mt-1 text-xs tabular-nums text-muted-foreground" style={{ opacity: isDimmed ? 0.4 : 1 }}>
                {formatValue(value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
