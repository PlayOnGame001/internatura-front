import React, { useEffect, useRef } from "react";
import { initBannerAd } from "../utilits/ad";
import { tracker } from "../utilits/EventTracker";
import type { AdEvent } from "../utilits/EventTracker";

declare global { interface Window { pbjs: any } }

interface BannerProps {
  id: string;
  sizes: number[][];
  bidders?: { bidder: string; params: Record<string, any> }[];
}

const Banner: React.FC<BannerProps> = ({ id, sizes, bidders }) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (import.meta.env.VITE_ENABLE_ADS !== "true") return;
    if (initialized.current) return;

    initialized.current = true;

    const start = () => {
      initBannerAd(id, sizes, bidders);

      const loadEvent: AdEvent = { 
        type: 'load_ad_module', 
        adUnit: id, 
        timestamp: new Date().toISOString()
      };
      tracker.track(loadEvent);

      if (window.pbjs) {
        window.pbjs.onEvent('auctionInit', (data: any) => {
          if (data.adUnits?.[0]?.code === id) {
            const event: AdEvent = {
              type: 'auctionInit',
              adUnit: id,
              cpm: data.cpm,
              creativeId: data.creativeId,
              timestamp: new Date().toISOString()
            };
            tracker.track(event);
          }
        });

        window.pbjs.onEvent('bidRequested', (data: any) => {
          if (data.adUnits?.[0]?.code === id) {
            const event: AdEvent = {
              type: 'bidRequested',
              adUnit: id,
              timestamp: new Date().toISOString()
            };
            tracker.track(event);
          }
        });

        window.pbjs.onEvent('auctionEnd', (data: any) => {
          if (data.adUnits?.[0]?.code === id) {
            const event: AdEvent = {
              type: 'auctionEnd',
              adUnit: id,
              timestamp: new Date().toISOString(),
            };
            tracker.track(event);
          }
        });

        window.pbjs.onEvent('bidResponse', (data: any) => {
          if (data.adUnitCode === id) {
            const event: AdEvent = {
              type: 'bidResponse',
              adUnit: id,
              cpm: data.cpm,
              timestamp: new Date().toISOString()
            };
            tracker.track(event);
          }
        });

        window.pbjs.onEvent('bidWon', (data: any) => {
          if (data.adUnitCode === id) {
            const event: AdEvent = {
              type: 'bidWon',
              adUnit: id,
              cpm: data.cpm,
              creativeId: data.creativeId,
              timestamp: new Date().toISOString()
            };
            tracker.track(event);
          }
        });
      }
    };

    if (window.pbjs) {
      start();
    } else {
      const script = document.createElement("script");
      script.src = "/prebid10.10.0.js";
      script.async = true;
      script.onload = start;
      script.onerror = () => console.warn("⚠️ Prebid.js не удалось загрузить");
      document.body.appendChild(script);
    }
  }, [id, sizes, bidders]);

  if (import.meta.env.VITE_ENABLE_ADS !== "true") {
    return (
      <div
        id={id}
        style={{
          width: sizes[0][0],
          height: sizes[0][1],
          border: "1px solid #ccc",
          borderRadius: 4,
          background: "#f9f9f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        Ads disabled
      </div>
    );
  }

  return (
    <div
      id={id}
      style={{
        width: sizes[0][0],
        height: sizes[0][1],
        minWidth: sizes[0][0],
        minHeight: sizes[0][1],
        position: "relative",
      }}
    />
  );
};

export default Banner;