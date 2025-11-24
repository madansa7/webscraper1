import React, { useState } from 'react';
import { Search, MapPin, Loader2, CircleDashed, X, Globe, Map, Hash } from 'lucide-react';
import { Coordinates, SearchStatus } from '../types';

interface SearchFormProps {
  onSearch: (query: string, coords: Coordinates | null, radius: string, country?: string, state?: string, zipCode?: string) => void;
  onClear: () => void;
  status: SearchStatus;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, onClear, status }) => {
  const [query, setQuery] = useState('');
  const [radius, setRadius] = useState('5 km');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleGetLocation = () => {
    setLocating(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError("Unable to retrieve your location. Please check permissions.");
        setLocating(false);
      }
    );
  };

  // Determine if we have enough info to search
  const hasManualLocation = country.trim().length > 0 || state.trim().length > 0 || zipCode.trim().length > 0;
  const hasLocation = coords !== null || hasManualLocation;
  const isBusy = status === SearchStatus.SEARCHING || status === SearchStatus.LOCATING;
  const canSubmit = query.trim().length > 0 && hasLocation && !isBusy;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      onSearch(query, coords, radius, country, state, zipCode);
    }
  };

  const handleClear = () => {
    setQuery('');
    setRadius('5 km');
    setCountry('');
    setState('');
    setZipCode('');
    setCoords(null);
    setLocationError(null);
    onClear();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Search Nearby Places</h2>
          <p className="text-slate-500 text-sm">Extract structured data (phones, emails, addresses) from local businesses.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Query Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Gym, Mechanic, Pizza"
            className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors shadow-sm"
            disabled={isBusy}
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Country Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors shadow-sm text-sm"
              disabled={isBusy}
            />
          </div>

          {/* State Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Map className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors shadow-sm text-sm"
              disabled={isBusy}
            />
          </div>

           {/* Zip Code Input */}
           <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Hash className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Zip / Pincode"
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors shadow-sm text-sm"
              disabled={isBusy}
            />
          </div>

          {/* Radius Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CircleDashed className="h-5 w-5 text-slate-400" />
            </div>
            <select
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="block w-full pl-10 pr-8 py-3 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors shadow-sm appearance-none bg-white text-slate-700 cursor-pointer text-sm"
                disabled={isBusy}
            >
                <option value="1 km">1 km Radius</option>
                <option value="2 km">2 km Radius</option>
                <option value="5 km">5 km Radius</option>
                <option value="10 km">10 km Radius</option>
                <option value="20 km">20 km Radius</option>
                <option value="50 km">50 km Radius</option>
                <option value="100 km">100 km Radius</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
          </div>
        </div>

        {/* Location Button */}
        <div>
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={locating || (coords !== null && !isBusy)} 
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg border transition-all ${
              coords 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {locating ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : coords ? (
              <MapPin className="h-5 w-5 mr-2 text-emerald-500" />
            ) : (
              <MapPin className="h-5 w-5 mr-2 text-slate-400" />
            )}
            {locating ? 'Locating...' : coords ? 'Location Set (Ready)' : 'Use My GPS Location'}
          </button>
        </div>

        {/* Error Message */}
        {locationError && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-center">
             <span className="mr-2">⚠️</span> {locationError}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-4 rounded-lg font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 flex items-center justify-center"
            disabled={isBusy}
          >
            <X className="h-5 w-5 mr-2" />
            Clear
          </button>
          
          <button
            type="submit"
            disabled={!canSubmit}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold text-lg shadow-md transition-all flex items-center justify-center ${
              canSubmit
                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-200 hover:shadow-primary-300 transform hover:-translate-y-0.5'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {status === SearchStatus.SEARCHING ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Searching...
              </>
            ) : (
              'Extract Data'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;