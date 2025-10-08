import { useEffect, useState } from "react";

declare global {
  interface Window {
    pbjs: any;
  }
}

export default function PageAdsDebug() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) =>
    setLogs(prev => [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev]);

  useEffect(() => {
    if (!window.pbjs) {
      window.pbjs = window.pbjs || {};
      window.pbjs.que = window.pbjs.que || [];

      const script = document.createElement("script");
      script.src = "/prebid10.10.0.js";
      script.async = true;
      script.onload = () => addLog("✅ Prebid.js loaded");
      script.onerror = () => addLog("❌ Failed to load Prebid.js");
      document.body.appendChild(script);
    }

    const waitForPbjs = setInterval(() => {
      if (window.pbjs && window.pbjs.que) {
        clearInterval(waitForPbjs);
        addLog("✅ Prebid.js ready");

        window.pbjs.que.push(() => {
          const events = ["bidRequested", "bidResponse", "bidWon", "adRenderFailed"];
          events.forEach(eventName =>
            window.pbjs.onEvent(eventName, (data: any) =>
              addLog(`[${eventName}] ${JSON.stringify(data)}`)
            )
          );
          addLog("✅ Prebid event subscriptions done");
        });
      }
    }, 200);

    const timeout = setTimeout(() => clearInterval(waitForPbjs), 10000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Prebid Debug Logs</h1>
      <div className="border rounded p-4 bg-white max-h-[80vh] overflow-y-auto">
        {logs.length === 0 && <p className="text-gray-500">Waiting for events...</p>}
        {logs.map((log, idx) => (
          <div key={idx} className="text-sm text-gray-800 mb-1 break-words">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
