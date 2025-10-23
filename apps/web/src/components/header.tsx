"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";
import { Maximize2, Minimize2 } from "lucide-react";

type HeaderProps = {
  isSidebarExpanded: boolean;
  onToggleSidebar: () => void;
};

export default function Header({ isSidebarExpanded, onToggleSidebar }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now
        .toLocaleTimeString("en-US", {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .replace(/:/g, ":")
        .toUpperCase();
      setCurrentTime(timeString);
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-3">
        <Image alt="Autonome logo" height={32} src="/logo.png" width={32} />
        <div className="text-lg font-mono tracking-wider text-muted-foreground">
          AutonoMe
        </div>
      </div>
      <div className="flex items-center gap-8">
        {/*<div className="font-thin text-sm text-muted-foreground">{currentTime}</div>*/}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex items-center gap-1.5 text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
          aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarExpanded ? (
            <>
              <Minimize2 className="h-3.5 w-3.5" />
              Collapse
            </>
          ) : (
            <>
              <Maximize2 className="h-3.5 w-3.5" />
              Expand
            </>
          )}
        </button>
        <AnimatedThemeToggler />
      </div>
    </div>
  );
}
