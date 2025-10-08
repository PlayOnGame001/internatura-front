import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { getLineItems, createLineItem, type LineItemData } from '../data/Api/api';

interface LineItem {
  id: string;
  size: string;
  minCpm: number;
  maxCpm: number;
  geo: string;
  adType: string;
  frequency: number;
}

export default function LineItemsPage() {
  const [items, setItems] = useState<LineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    size: '',
    minCpm: '',
    maxCpm: '',
    geo: '',
    adType: 'banner',
    frequency: '1',
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await getLineItems();
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a creative file');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data: LineItemData = {
        size: formData.size,
        minCpm: parseFloat(formData.minCpm),
        maxCpm: parseFloat(formData.maxCpm),
        geo: formData.geo,
        adType: formData.adType,
        frequency: parseInt(formData.frequency, 10),
        creative: file,
      };

      await createLineItem(data);
      setSuccess('Line Item created successfully!');

      setFormData({
        size: '',
        minCpm: '',
        maxCpm: '',
        geo: '',
        adType: 'banner',
        frequency: '1',
      });
      setFile(null);

      await loadItems();
    } catch (err: any) {
      setError(err.message || 'Failed to create Line Item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Line Items</h1>
        <p className="text-gray-600 mb-6">Manage your advertising line items</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2 text-red-800 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-start gap-2 text-green-800 text-sm">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            {success}
          </div>
        )}

        <div className="bg-white rounded p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Create New Line Item</h2>
          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                placeholder="e.g., 728x90"
                className="w-full px-3 py-2 border border-gray-300 rounded outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min CPM <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="minCpm"
                  value={formData.minCpm}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max CPM <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="maxCpm"
                  value={formData.maxCpm}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Geo
              </label>
              <input
                type="text"
                name="geo"
                value={formData.geo}
                onChange={handleInputChange}
                placeholder="e.g., US, UK, UA"
                className="w-full px-3 py-2 border border-gray-300 rounded outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="adType"
                  value={formData.adType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded outline-none bg-white text-black"
                >
                  <option value="banner">Banner</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Add Photo:</span>
                <input type="file" onChange={(e) => {
                    const selectedFile = e.target.files?.[0] || null;
                    setFile(selectedFile);
                }}
                id="file-upload"
                accept="image/*,video/*"
                className="hidden"
            />
            <label htmlFor="file-upload"
                className="px-3 py-1 border border-gray-300 rounded text-sm cursor-pointer bg-white hover:bg-gray-50 flex items-center gap-2">
            <span className="text-gray-800">{file ? file.name : 'Choose'}</span>
            <span className="flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full text-xs">+</span>
            </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.size || !formData.minCpm || !formData.maxCpm || !file}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded"
              >
                {loading ? 'Creating...' : 'Create Line Item'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{item.size}</h3>
                <span className={`px-2 py-1 text-xs font-medium ${
                  item.adType === 'banner' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {item.adType}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>CPM:</span>
                  <span className="font-medium text-gray-900">${item.minCpm} - ${item.maxCpm}</span>
                </div>
                {item.geo && (
                  <div className="flex justify-between">
                    <span>Geo:</span>
                    <span className="font-medium text-gray-900">{item.geo}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Frequency:</span>
                  <span className="font-medium text-gray-900">{item.frequency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
