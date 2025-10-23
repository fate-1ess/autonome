"use client"
import { useState } from "react";
import CryptoTracker from "@/components/crypto-tracker";
import Header from "@/components/header";
import PerformanceGraph from "@/components/performance-graph";
import TradesSidebar from "@/components/trades-sidebar";
import { LightRays } from "@/components/ui/light-rays";

export default function HomePage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <LightRays />
      <Header
        isSidebarExpanded={isSidebarExpanded}
        onToggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
      />
      <div className="flex flex-1 min-h-0 relative">
        <div className="flex-1 flex flex-col min-h-0">
          <CryptoTracker />
          <div className="flex-1 min-h-0">
            <PerformanceGraph />
          </div>
        </div>
        <TradesSidebar
          isExpanded={isSidebarExpanded}
          onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
        />
      </div>
    </div>
  );
}
