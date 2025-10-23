"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { NumberTicker } from "./ui/number-ticker";

const holy_link = "https://nof1.ai";
const UPDATE_INTERVAL = 30_000; // 10 seconds

type CryptoPrice = {
  symbol: string;
  price: number;
};

export default function CryptoTracker() {
  const [crypto, setCrypto] = useState<CryptoPrice[]>([]);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(`${holy_link}/api/crypto-prices`);
        const data = await response.json();
        const cryptoArray = Object.values(data.prices) as CryptoPrice[];
        setCrypto(cryptoArray);
      } catch (_error) {
        // Failed to fetch crypto prices
      }
    };

    fetchCryptoData(); // Initial fetch
    const interval = setInterval(fetchCryptoData, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center border-b py-[5px] px-6">
      {crypto.map((coin, index) => (
        <React.Fragment key={coin.symbol}>
          <div className="flex flex-1 flex-col items-center">
            <div className="flex items-center space-x-2">
              <Image
                alt={coin.symbol}
                height={16}
                src={`${holy_link}/coins/${coin.symbol.toLowerCase()}.svg`}
                width={16}
              />
              <p className="text-muted-foreground text-sm">{coin.symbol}</p>
            </div>
            <p className="pt-0.5 font-mono font-semibold text-sm">
              $
              <NumberTicker decimalPlaces={2} value={coin.price} />
            </p>
          </div>
          {index !== crypto.length - 1 && (
            <div className="h-10 w-px bg-border" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
