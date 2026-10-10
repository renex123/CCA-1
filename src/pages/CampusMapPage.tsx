import React, { useState } from 'react';
import { db } from '../services/dbStore';
import { CampusFacility } from '../types';
import {
  MapPin,
  Clock,
  Phone,
  Search,
  Filter,
  Navigation,
  Compass,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet icon paths in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export const CampusMapPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeFacility, setActiveFacility] = useState<CampusFacility | null>(null);

  const facilities = db.getFacilities();

  const filtered = facilities.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const center: [number, number] = [20.2965, 85.8248];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Campus Map & Facility Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive GPS navigation • Department locations • Facility hours & contacts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm">
            Coordinates: 20.296° N, 85.824° E (Campus HQ)
          </Badge>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search academic buildings, computing labs, library, canteen, medical center..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Categories</option>
          <option value="academic">Academic Classrooms</option>
          <option value="lab">Research & Computing Labs</option>
          <option value="library">Central Library</option>
          <option value="canteen">Food Court & Canteen</option>
          <option value="admin">Innovation & Admin Hub</option>
          <option value="medical">Health & Emergency Care</option>
          <option value="sports">Sports Arena</option>
        </select>
      </div>

      {/* Main Map + Directory View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaflet Interactive Map View */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md h-[460px] relative z-10">
          <MapContainer center={center} zoom={16} scrollWheelZoom={false} className="w-full h-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map((facility) => (
              <Marker
                key={facility.id}
                position={facility.coordinates}
                eventHandlers={{
                  click: () => setActiveFacility(facility),
                }}
              >
                <Popup>
                  <div className="p-1 max-w-[200px]">
                    <h4 className="font-bold text-xs text-slate-900">{facility.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{facility.building}</p>
                    <p className="text-[10px] text-indigo-600 font-semibold mt-1">{facility.service_hours}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Facility Directory Sidebar Cards */}
        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
          {filtered.map((facility) => {
            const isSelected = activeFacility?.id === facility.id;
            return (
              <div
                key={facility.id}
                onClick={() => setActiveFacility(facility)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 dark:border-indigo-400 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {facility.category}
                  </span>
                  <Badge variant={facility.status === 'open' ? 'success' : 'warning'} size="sm">
                    {facility.status}
                  </Badge>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {facility.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {facility.building} • {facility.floor}
                </p>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                  {facility.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {facility.service_hours}
                  </span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    {facility.contact_phone}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
