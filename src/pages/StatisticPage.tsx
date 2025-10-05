import { useEffect, useState } from "react";

interface StatsRow {
  id: string;
  eventType: string;
  timestamp: string;
  pageUrl: string;
  adUnit?: string;
  creativeId?: string;
  cpm?: number;
}

const mockData: StatsRow[] = Array.from({ length: 120 }).map((_, i) => ({
  id: `${i + 1}`,
  eventType: ["load_page", "load_ad_module", "auctionInit", "auctionEnd", "bidRequested", "bidResponse", "bidWon"][i % 7],
  timestamp: new Date(Date.now() - i * 1000 * 60 * 5).toISOString(),
  pageUrl: `/page/${i % 5}`,
  adUnit: i % 2 === 0 ? `banner-left` : `banner-right`,
  creativeId: `creative-${i % 10}`,
  cpm: parseFloat((Math.random() * 5).toFixed(2)),
}));

const PAGE_SIZE = 20;

export default function StatisticPage() {
  const [data, setData] = useState<StatsRow[]>([]);
  const [filteredData, setFilteredData] = useState<StatsRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    eventType: "",
    adUnit: "",
    creativeId: "",
    cpmMin: "",
    cpmMax: "",
  });

  useEffect(() => {
    // НАПОМИНАЛКА СЮДА БЕК
    setData(mockData);
  }, []);

  useEffect(() => {
    let result = [...data];

    if (filters.eventType) {
      result = result.filter((row) => row.eventType === filters.eventType);
    }
    if (filters.adUnit) {
      result = result.filter((row) => row.adUnit === filters.adUnit);
    }
    if (filters.creativeId) {
      result = result.filter((row) => row.creativeId?.includes(filters.creativeId));
    }
    if (filters.cpmMin) {
      result = result.filter((row) => (row.cpm ?? 0) >= parseFloat(filters.cpmMin));
    }
    if (filters.cpmMax) {
      result = result.filter((row) => (row.cpm ?? 0) <= parseFloat(filters.cpmMax));
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [filters, data]);

  const pageCount = Math.ceil(filteredData.length / PAGE_SIZE);
  const pageData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Statistics Grid</h1>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap mb-6">
        <select
          value={filters.eventType}
          onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Events</option>
          <option value="load_page">load_page</option>
          <option value="load_ad_module">load_ad_module</option>
          <option value="auctionInit">auctionInit</option>
          <option value="auctionEnd">auctionEnd</option>
          <option value="bidRequested">bidRequested</option>
          <option value="bidResponse">bidResponse</option>
          <option value="bidWon">bidWon</option>
        </select>

        <input
          type="text"
          placeholder="Ad Unit"
          value={filters.adUnit}
          onChange={(e) => setFilters({ ...filters, adUnit: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Creative ID"
          value={filters.creativeId}
          onChange={(e) => setFilters({ ...filters, creativeId: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Min CPM"
          value={filters.cpmMin}
          onChange={(e) => setFilters({ ...filters, cpmMin: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Max CPM"
          value={filters.cpmMax}
          onChange={(e) => setFilters({ ...filters, cpmMax: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Event</th>
              <th className="border px-2 py-1">Timestamp</th>
              <th className="border px-2 py-1">Page URL</th>
              <th className="border px-2 py-1">Ad Unit</th>
              <th className="border px-2 py-1">Creative ID</th>
              <th className="border px-2 py-1">CPM</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-100">
                <td className="border px-2 py-1">{row.id}</td>
                <td className="border px-2 py-1">{row.eventType}</td>
                <td className="border px-2 py-1">{new Date(row.timestamp).toLocaleString()}</td>
                <td className="border px-2 py-1">{row.pageUrl}</td>
                <td className="border px-2 py-1">{row.adUnit}</td>
                <td className="border px-2 py-1">{row.creativeId}</td>
                <td className="border px-2 py-1">{row.cpm?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">{currentPage} / {pageCount}</span>
        <button
          disabled={currentPage === pageCount}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
