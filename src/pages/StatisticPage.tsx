import { useEffect, useState } from "react";
import { getStatistics } from "../data/Api/api";

interface StatsRow {
  id: string;
  eventType: string;
  ts: string;
  ts_ms: number;
  pageUrl: string;
  adUnit?: string;
  creativeId?: string;
  cpm?: number;
  adapter?: string;
  geo?: string;
}

const PAGE_SIZE = 20;

const EVENT_TYPES = [
  "load_page",
  "load_ad_module",
  "auctionInit",
  "auctionEnd",
  "bidRequested",
  "bidResponse",
  "bidWon",
];

const COLUMNS = [
  "ID",
  "AD init",
  "EVENT",
  "TS",
  "PAGE URL",
  "Creative ID",
  "CPM",
  "Adapter",
  "Geo",
];

export default function StatisticPage() {
  const [data, setData] = useState<StatsRow[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeEvents, setActiveEvents] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(["ID", "EVENT"]);

  const toggleEventType = (type: string) => {
    setActiveEvents((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const toggleColumn = (col: string) => {
    setVisibleColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const params: Record<string, any> = {
          page: currentPage,
          limit: PAGE_SIZE,
        };

        if (activeEvents.length) params.eventType = activeEvents.join(",");

        const response = await getStatistics(params);
        setData(response.data || []);
        setTotal(response.total || 0);
      } catch (err) {
        console.error("Ошибка при загрузке статистики:", err);
      }
    }

    fetchData();
  }, [activeEvents, currentPage]);

  const pageCount = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Filter by Event:</h2>
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => toggleEventType(type)}
              className={`px-3 py-1 rounded border transition ${
                activeEvents.includes(type)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-200 text-black border-gray-300 hover:bg-gray-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Columns:</h2>
        <div className="flex flex-wrap gap-2">
          {COLUMNS.map((col) => (
            <button
              key={col}
              onClick={() => toggleColumn(col)}
              className={`px-3 py-1 rounded border transition ${
                visibleColumns.includes(col)
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-gray-200 text-black border-gray-300 hover:bg-gray-300"
              }`}
            >
              {col}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 text-gray-600">Total records: {total}</div>

      <div className="overflow-x-auto">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr>
              {visibleColumns.includes("ID") && <th className="border px-2 py-1">ID</th>}
              {visibleColumns.includes("AD init") && <th className="border px-2 py-1">Ad Unit</th>}
              {visibleColumns.includes("EVENT") && <th className="border px-2 py-1">Event</th>}
              {visibleColumns.includes("TS") && <th className="border px-2 py-1">TS</th>}
              {visibleColumns.includes("PAGE URL") && <th className="border px-2 py-1">Page URL</th>}
              {visibleColumns.includes("Creative ID") && <th className="border px-2 py-1">Creative ID</th>}
              {visibleColumns.includes("CPM") && <th className="border px-2 py-1">CPM</th>}
              {visibleColumns.includes("Adapter") && <th className="border px-2 py-1">Adapter</th>}
              {visibleColumns.includes("Geo") && <th className="border px-2 py-1">Geo</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="border px-2 py-4 text-center text-gray-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={`${row.id}-${row.ts_ms}-${index}`}>
                  {visibleColumns.includes("ID") && (
                    <td className="border px-2 py-1 text-xs">{row.id}</td>
                  )}
                  {visibleColumns.includes("AD init") && (
                    <td className="border px-2 py-1">{row.adUnit || "-"}</td>
                  )}
                  {visibleColumns.includes("EVENT") && (
                    <td className="border px-2 py-1">{row.eventType}</td>
                  )}
                  {visibleColumns.includes("TS") && (
                    <td className="border px-2 py-1">
                      {new Date(row.ts).toLocaleString()}
                    </td>
                  )}
                  {visibleColumns.includes("PAGE URL") && (
                    <td className="border px-2 py-1 text-xs max-w-xs truncate">
                      {row.pageUrl}
                    </td>
                  )}
                  {visibleColumns.includes("Creative ID") && (
                    <td className="border px-2 py-1">{row.creativeId || "-"}</td>
                  )}
                  {visibleColumns.includes("CPM") && (
                    <td className="border px-2 py-1">
                      {row.cpm != null ? row.cpm.toFixed(2) : "-"}
                    </td>
                  )}
                  {visibleColumns.includes("Adapter") && (
                    <td className="border px-2 py-1">{row.adapter || "-"}</td>
                  )}
                  {visibleColumns.includes("Geo") && (
                    <td className="border px-2 py-1">{row.geo || "-"}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 mt-4 items-center">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <span className="px-3 py-1">
          Page {currentPage} of {pageCount || 1}
        </span>
        <button
          disabled={currentPage === pageCount || pageCount === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}