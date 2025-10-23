"use client";

import { useState } from "react";
import { GlowingLineChart } from "./ui/glowing-line";
import ModelLegend from "./model-legend";

type DataPoint = {
  month: string;
  [key: string]: number | string;
};

// Note: live fetching omitted for now; DEMO_DATA renders the chart.

const DEMO_DATA = [
  {
    month: "00:00",
    gpt_5: 10_000,
    claude_sonnet_4_5: 10_000,
    gemini_2_5_pro: 10_000,
    grok_4: 10_000,
    deepseek_chat_v3_1: 10_000,
    qwen3_max: 10_000,
  },
  {
    month: "00:05",
    gpt_5: 9950,
    claude_sonnet_4_5: 10_080,
    gemini_2_5_pro: 10_030,
    grok_4: 10_100,
    deepseek_chat_v3_1: 10_070,
    qwen3_max: 10_090,
  },
  {
    month: "00:10",
    gpt_5: 9850,
    claude_sonnet_4_5: 10_120,
    gemini_2_5_pro: 10_090,
    grok_4: 10_200,
    deepseek_chat_v3_1: 10_150,
    qwen3_max: 10_160,
  },
  {
    month: "00:15",
    gpt_5: 9700,
    claude_sonnet_4_5: 10_300,
    gemini_2_5_pro: 10_150,
    grok_4: 10_400,
    deepseek_chat_v3_1: 10_350,
    qwen3_max: 10_280,
  },
  {
    month: "00:20",
    gpt_5: 9400,
    claude_sonnet_4_5: 10_600,
    gemini_2_5_pro: 10_300,
    grok_4: 10_750,
    deepseek_chat_v3_1: 10_800,
    qwen3_max: 10_500,
  },
  {
    month: "00:25",
    gpt_5: 9100,
    claude_sonnet_4_5: 11_100,
    gemini_2_5_pro: 10_600,
    grok_4: 11_000,
    deepseek_chat_v3_1: 11_500,
    qwen3_max: 10_900,
  },
  {
    month: "00:30",
    gpt_5: 8700,
    claude_sonnet_4_5: 11_800,
    gemini_2_5_pro: 11_000,
    grok_4: 11_350,
    deepseek_chat_v3_1: 12_300,
    qwen3_max: 11_250,
  },
  {
    month: "00:35",
    gpt_5: 8300,
    claude_sonnet_4_5: 12_250,
    gemini_2_5_pro: 11_500,
    grok_4: 11_800,
    deepseek_chat_v3_1: 13_800,
    qwen3_max: 11_700,
  },
  {
    month: "00:40",
    gpt_5: 7900,
    claude_sonnet_4_5: 12_000,
    gemini_2_5_pro: 10_800,
    grok_4: 11_400,
    deepseek_chat_v3_1: 14_000,
    qwen3_max: 11_300,
  },
  {
    month: "00:45",
    gpt_5: 7600,
    claude_sonnet_4_5: 11_750,
    gemini_2_5_pro: 10_400,
    grok_4: 11_100,
    deepseek_chat_v3_1: 13_600,
    qwen3_max: 11_150,
  },
  {
    month: "00:50",
    gpt_5: 7200,
    claude_sonnet_4_5: 11_400,
    gemini_2_5_pro: 9700,
    grok_4: 10_700,
    deepseek_chat_v3_1: 13_000,
    qwen3_max: 10_900,
  },
  {
    month: "00:55",
    gpt_5: 6800,
    claude_sonnet_4_5: 11_000,
    gemini_2_5_pro: 9300,
    grok_4: 10_350,
    deepseek_chat_v3_1: 12_500,
    qwen3_max: 10_600,
  },
  {
    month: "01:00",
    gpt_5: 6400,
    claude_sonnet_4_5: 10_400,
    gemini_2_5_pro: 8700,
    grok_4: 10_000,
    deepseek_chat_v3_1: 11_800,
    qwen3_max: 10_200,
  },
  {
    month: "01:05",
    gpt_5: 6000,
    claude_sonnet_4_5: 9700,
    gemini_2_5_pro: 8300,
    grok_4: 9500,
    deepseek_chat_v3_1: 11_000,
    qwen3_max: 9700,
  },
  {
    month: "01:10",
    gpt_5: 5700,
    claude_sonnet_4_5: 9400,
    gemini_2_5_pro: 7800,
    grok_4: 9100,
    deepseek_chat_v3_1: 10_600,
    qwen3_max: 9400,
  },
  {
    month: "01:15",
    gpt_5: 5200,
    claude_sonnet_4_5: 9100,
    gemini_2_5_pro: 7400,
    grok_4: 8700,
    deepseek_chat_v3_1: 10_200,
    qwen3_max: 9100,
  },
  {
    month: "01:20",
    gpt_5: 5000,
    claude_sonnet_4_5: 8700,
    gemini_2_5_pro: 7000,
    grok_4: 8500,
    deepseek_chat_v3_1: 10_000,
    qwen3_max: 8900,
  },
  {
    month: "01:25",
    gpt_5: 4700,
    claude_sonnet_4_5: 8500,
    gemini_2_5_pro: 6800,
    grok_4: 8200,
    deepseek_chat_v3_1: 9800,
    qwen3_max: 8600,
  },
  {
    month: "01:30",
    gpt_5: 4400,
    claude_sonnet_4_5: 8300,
    gemini_2_5_pro: 6500,
    grok_4: 7900,
    deepseek_chat_v3_1: 9600,
    qwen3_max: 8300,
  },
  {
    month: "01:35",
    gpt_5: 4200,
    claude_sonnet_4_5: 8100,
    gemini_2_5_pro: 6200,
    grok_4: 7700,
    deepseek_chat_v3_1: 9400,
    qwen3_max: 8100,
  },
  {
    month: "01:40",
    gpt_5: 4000,
    claude_sonnet_4_5: 8000,
    gemini_2_5_pro: 6000,
    grok_4: 7500,
    deepseek_chat_v3_1: 9300,
    qwen3_max: 7900,
  },
  {
    month: "01:45",
    gpt_5: 3800,
    claude_sonnet_4_5: 7950,
    gemini_2_5_pro: 5800,
    grok_4: 7400,
    deepseek_chat_v3_1: 9200,
    qwen3_max: 7800,
  },
  {
    month: "01:50",
    gpt_5: 3600,
    claude_sonnet_4_5: 7920,
    gemini_2_5_pro: 5600,
    grok_4: 7300,
    deepseek_chat_v3_1: 9100,
    qwen3_max: 7700,
  },
  {
    month: "01:55",
    gpt_5: 3400,
    claude_sonnet_4_5: 7999,
    gemini_2_5_pro: 4788,
    grok_4: 8538,
    deepseek_chat_v3_1: 9985,
    qwen3_max: 9478,
  },
];

export default function PerformanceGraph() {
  const [valueMode, setValueMode] = useState<"usd" | "percent">("usd");
  const [timeFilter, setTimeFilter] = useState<"all" | "72h">("all");
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);

  // Filter data based on time filter (72H = last 3 data points for demo)
  const filteredData = timeFilter === "72h"
    ? DEMO_DATA.slice(-3)
    : DEMO_DATA;

  const chartData: DataPoint[] = filteredData;

  // useEffect(() => {
  //   const fetchAndStore = async () => {
  //     try {
  //       const response = await fetch(
  //         "https://nof1.ai/api/account-totals?lastHourlyMarker=115"
  //       );
  //       const data: ApiResponse = await response.json();

  //       const timestamp = new Date(data.serverTime).toLocaleTimeString(
  //         "en-US",
  //         {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //         }
  //       );

  //       // Create data point with all models
  //       const dataPoint: DataPoint = {
  //         month: timestamp,
  //       };

  //       // Add each model's equity to the data point
  //       for (const account of data.accountTotals) {
  //         const modelKey = account.model_id.replace(/-/g, "_"); // Replace hyphens for valid keys
  //         dataPoint[modelKey] = account.dollar_equity;
  //       }

  //       // biome-ignore lint: debugging
  //       console.log("Data point:", dataPoint);
  //       // biome-ignore lint: debugging
  //       console.log(
  //         "Available models in response:",
  //         data.accountTotals.map((a) => a.model_id)
  //       );

  //       setChartData((prev) => {
  //         const updated = [...prev, dataPoint];
  //         // Keep last 50 data points for good visibility
  //         return updated.slice(-MAX_DATA_POINTS);
  //       });

  //       setLoading(false);
  //     } catch (error) {
  //       // biome-ignore lint: debugging
  //       console.error("Failed to fetch performance data:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchAndStore(); // Initial fetch
  //   const interval = setInterval(fetchAndStore, FETCH_INTERVAL);

  //   return () => clearInterval(interval);
  // }, []);

  // Dynamic chart config based on models - using exact colors from MODEL_INFO
  const chartConfig = {
    gpt_5: {
      label: "GPT 5",
      color: "#39B295",
    },
    claude_sonnet_4_5: {
      label: "Claude Sonnet 4.5",
      color: "#FF6B35",
    },
    gemini_2_5_pro: {
      label: "Gemini 2.5 Pro",
      color: "#4285F4",
    },
    grok_4: {
      label: "Grok 4",
      color: "#000000",
    },
    deepseek_chat_v3_1: {
      label: "DeepSeek V3.1",
      color: "#4D6BFE",
    },
    qwen3_max: {
      label: "Qwen3 Max",
      color: "#8B5CF6",
    },
  };

  // Compute display data based on value mode (USD vs % from first point)
  const PERCENT_SCALE = 100;

  const toPercentData = (source: DataPoint[]): DataPoint[] => {
    const first = source.at(0);
    if (!first) {
      return source;
    }
    const keys = Object.keys(chartConfig);
    const baseMap: Record<string, number> = {};
    for (const k of keys) {
      const baseVal = first[k];
      if (typeof baseVal === "number" && baseVal) {
        baseMap[k] = baseVal;
      }
    }

    const toPoint = (row: DataPoint): DataPoint => {
      const out: DataPoint = { month: row.month };
      for (const k of keys) {
        const base = baseMap[k];
        const val = row[k];
        if (typeof base === "number" && typeof val === "number") {
          out[k] = (val / base - 1) * PERCENT_SCALE;
        }
      }
      return out;
    };

    return source.map(toPoint);
  };

  const displayData: DataPoint[] = (() => {
    if (valueMode === "usd") {
      return chartData;
    }
    return toPercentData(chartData);
  })();

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">No data available yet...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0">
        <GlowingLineChart
          chartConfig={chartConfig}
          chartData={displayData}
          onValueModeChange={setValueMode}
          valueMode={valueMode}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          hoveredLine={hoveredLine}
          onHoverLine={setHoveredLine}
        />
      </div>
      <div className="flex-shrink-0">
        <ModelLegend
          chartData={displayData}
          chartConfig={chartConfig}
          valueMode={valueMode}
          hoveredLine={hoveredLine}
          onHoverLine={setHoveredLine}
        />
      </div>
    </div>
  );
}
