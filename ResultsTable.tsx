import React from 'react';
import { Place } from '../types';
import { Download, Phone, MapPin, Star, Mail } from 'lucide-react';

interface ResultsTableProps {
  data: Place[];
  query: string;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ data, query }) => {
  if (data.length === 0) return null;

  const downloadCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Address', 'Rating'];
    const rows = data.map(place => [
      `"${place.name.replace(/"/g, '""')}"`,
      `"${place.phone.replace(/"/g, '""')}"`,
      `"${place.email.replace(/"/g, '""')}"`,
      `"${place.address.replace(/"/g, '""')}"`,
      place.rating
    ]);
    
    const csvContent = [
      headers.join(','), 
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${query.replace(/\s+/g, '_')}_places.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100 animate-fade-in-up">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50">
        <h3 className="text-lg font-semibold text-slate-800">
          Top Results for <span className="text-primary-600">"{query}"</span>
        </h3>
        <button 
          onClick={downloadCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-colors shadow-sm"
        >
          <Download className="h-4 w-4" />
          <span>Download CSV</span>
        </button>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-4 rounded-tl-lg">Name</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4 rounded-tr-lg">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((place) => (
              <tr key={place.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {place.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {place.phone !== 'N/A' ? (
                     <div className="flex items-center text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-md">
                        <Phone className="h-3 w-3 mr-1.5" />
                        {place.phone}
                     </div>
                  ) : (
                    <span className="text-slate-400">N/A</span>
                  )}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                  {place.email !== 'N/A' ? (
                     <div className="flex items-center text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded-md">
                        <Mail className="h-3 w-3 mr-1.5" />
                        <span className="truncate max-w-[150px]">{place.email}</span>
                     </div>
                  ) : (
                    <span className="text-slate-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start min-w-[200px]">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{place.address}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center font-medium text-amber-500">
                    <Star className="h-4 w-4 fill-current mr-1.5" />
                    {place.rating}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-xs text-slate-400 flex justify-between">
        <span>Showing top {data.length} results</span>
        <span>Data sourced via Google Maps</span>
      </div>
    </div>
  );
};

export default ResultsTable;