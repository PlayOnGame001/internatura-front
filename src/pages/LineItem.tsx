import { useState, useEffect } from 'react';
import { AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { getLineItems } from '../data/Api/api';

interface LineItem {
  id: string;
  size: string;
  minCpm: number;
  maxCpm: number;
  geo: string;
  adType: string;
  frequency: number;
  creativeUrl?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function LineItemsPage() {
  const [items, setItems] = useState<LineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getLineItems();
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Line Items</h1>
            <p className="text-gray-600">Manage your advertising line items</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={loadItems}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 text-gray-700 font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <a
              href={`${API_URL}/line-item/form`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded"
              >
              <ExternalLink className="w-4 h-4" />
              Create Line Item
            </a>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded flex items-start gap-3 text-red-800">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error loading line items</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {loading && items.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading line items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded border border-gray-200">
            <p className="text-gray-600 mb-4">No line items found</p>
            <a
              href={`${API_URL}/line-item/form`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded"
            >
              <ExternalLink className="w-4 h-4" />
              Create your first Line Item
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{item.size}</h3>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded ${
                    item.adType === 'banner' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {item.adType}
                  </span>
                </div>

                {item.creativeUrl && (
                  <div className="mb-3">
                    <img 
                      src={`${API_URL}${item.creativeUrl}`} 
                      alt={`Creative for ${item.size}`}
                      className="w-full h-32 object-cover rounded border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>CPM Range:</span>
                    <span className="font-medium text-gray-900">
                      ${item.minCpm.toFixed(2)} - ${item.maxCpm.toFixed(2)}
                    </span>
                  </div>

                  {item.geo && (
                    <div className="flex justify-between items-center">
                      <span>Geo:</span>
                      <span className="font-medium text-gray-900">{item.geo}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Frequency:</span>
                    <span className="font-medium text-gray-900">{item.frequency}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">ID: {item.id.slice(0, 8)}...</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}