import React, { useState } from 'react';

const AddBin = () => {
  const [fillLevel, setFillLevel] = useState(0);
  const [segregationType, setSegregationType] = useState('MIXED');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleGetLocation = () => {
    setMessage({ type: '', text: '' });
    setLoadingLoc(true);
    if (!navigator.geolocation) {
      setMessage({ type: 'error', text: 'Geolocation is not supported by your browser' });
      setLoadingLoc(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setMessage({ type: 'success', text: 'Location detected successfully!' });
        setLoadingLoc(false);
      },
      (error) => {
        setMessage({ type: 'error', text: 'Unable to retrieve your location. Please check your browser permissions.' });
        setLoadingLoc(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (lat === '' || lng === '') {
      setMessage({ type: 'error', text: 'Please provide valid location coordinates' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/bins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fillLevel: Number(fillLevel),
          segregationType,
          location: {
            lat: Number(lat),
            lng: Number(lng),
          },
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Bin added successfully!' });
        setFillLevel(0);
        setSegregationType('MIXED');
        setLat('');
        setLng('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to add bin' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while connecting to the server' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Add New Bin</h2>
        <p className="text-gray-500 mt-2">Register a new waste collection bin to the network.</p>
      </div>
      
      {message.text && (
        <div className={`p-4 mb-6 rounded-lg text-sm font-medium transition-all ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fill Level (0-100)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              required
              value={fillLevel}
              onChange={(e) => setFillLevel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50"
              placeholder="Enter fill percentage"
            />
            <span className="absolute right-4 top-3 text-gray-400 font-medium">%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Segregation Type
          </label>
          <select
            value={segregationType}
            onChange={(e) => setSegregationType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50 font-medium"
          >
            <option value="WET">WET</option>
            <option value="DRY">DRY</option>
            <option value="PLASTIC">PLASTIC</option>
            <option value="E_WASTE">E_WASTE</option>
            <option value="MIXED">MIXED</option>
          </select>
        </div>

        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
            <div>
              <h3 className="text-sm font-bold text-indigo-900">Location Details</h3>
              <p className="text-xs text-indigo-700 mt-1">Specify where this bin will be placed</p>
            </div>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={loadingLoc}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {loadingLoc ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Detecting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Use Current Location
                </>
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-indigo-800 mb-1.5 uppercase tracking-wider">Latitude</label>
              <input
                type="number"
                step="any"
                required
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full px-3 py-2.5 border border-indigo-200 rounded-md bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g. 18.5204"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-indigo-800 mb-1.5 uppercase tracking-wider">Longitude</label>
              <input
                type="number"
                step="any"
                required
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full px-3 py-2.5 border border-indigo-200 rounded-md bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g. 73.8567"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 bg-gray-900 hover:bg-black text-white text-lg font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : 'Submit New Bin'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBin;
