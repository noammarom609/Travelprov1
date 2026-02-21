import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  MapPin, Star, CheckCircle, Clock, AlertTriangle, Users, Navigation
} from 'lucide-react';
import L from 'leaflet';
import { suppliers, type Supplier } from './data';

// ─── Region config with real lat/lng ───
interface RegionDef {
  id: string;
  name: string;
  label: string;
  lat: number;
  lng: number;
  color: string;
}

const regionDefs: RegionDef[] = [
  { id: 'צפון',    name: 'צפון',    label: 'גליל וחיפה',      lat: 32.82,  lng: 35.18, color: '#22c55e' },
  { id: 'מרכז',    name: 'מרכז',    label: 'תל אביב והשרון',   lat: 32.07,  lng: 34.78, color: '#ff8c00' },
  { id: 'ירושלים', name: 'ירושלים', label: 'ירושלים והסביבה',  lat: 31.77,  lng: 35.21, color: '#8b5cf6' },
  { id: 'דרום',    name: 'דרום',    label: 'נגב ואילת',        lat: 30.65,  lng: 34.78, color: '#ef4444' },
];

const ISRAEL_CENTER: L.LatLngExpression = [31.5, 34.85];
const ISRAEL_ZOOM = 8;

// ─── Custom HTML for pin markers ───
function pinHtml(color: string, count: number, isActive: boolean) {
  const size = isActive ? 48 : 40;
  return `
    <div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${isActive ? color : '#fff'};
      border:3px solid ${color};
      display:flex;align-items:center;justify-content:center;
      box-shadow:${isActive
        ? `0 0 0 6px ${color}20, 0 4px 16px ${color}40`
        : '0 2px 8px rgba(0,0,0,0.18)'};
      transition:all .2s;cursor:pointer;position:relative;
    ">
      <span style="font-size:15px;font-weight:800;color:${isActive ? '#fff' : color};font-family:Assistant,sans-serif;">${count}</span>
      ${count >= 2 ? `<span style="position:absolute;inset:-4px;border-radius:50%;border:2px solid ${color}30;animation:leafpin 2.5s cubic-bezier(0,0,.2,1) infinite;"></span>` : ''}
    </div>`;
}

// ─── Popup HTML for a region ───
function popupHtml(region: RegionDef, list: Supplier[]) {
  const supplierRows = list.map(s => `
    <div style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:8px;cursor:pointer;" data-supplier-id="${s.id}"
      onmouseover="this.style.background='#f8f7f5'" onmouseout="this.style.background='transparent'">
      <div style="width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;background:${s.categoryColor}12;flex-shrink:0;">${s.icon}</div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="font-size:12px;color:#181510;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${s.name}</span>
          <span style="font-size:10px;color:${s.verificationStatus === 'verified' ? '#16a34a' : s.verificationStatus === 'pending' ? '#ca8a04' : '#8d785e'};font-weight:600;">
            ${s.verificationStatus === 'verified' ? '✓ מאומת' : s.verificationStatus === 'pending' ? '⏳ ממתין' : '⚠ לא מאומת'}
          </span>
        </div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:3px;">
          <span style="font-size:10px;padding:2px 6px;border-radius:99px;background:${s.categoryColor}12;color:${s.categoryColor};font-weight:600;">${s.category}</span>
          <span style="font-size:10px;color:#8d785e;font-weight:600;">⭐ ${s.rating}</span>
        </div>
      </div>
    </div>`).join('');

  return `
    <div dir="rtl" style="font-family:Assistant,sans-serif;min-width:260px;max-width:300px;">
      <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:linear-gradient(135deg,${region.color}10,${region.color}05);">
        <div style="width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:${region.color}20;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${region.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <div style="flex:1;">
          <div style="font-size:14px;color:#181510;font-weight:700;">${region.label}</div>
          <div style="font-size:11px;color:#8d785e;">${list.length} ספקים באזור</div>
        </div>
        <div style="font-size:18px;padding:2px 8px;border-radius:8px;background:${region.color}15;color:${region.color};font-weight:800;">${list.length}</div>
      </div>
      <div style="padding:8px 12px;max-height:220px;overflow-y:auto;">${supplierRows}</div>
    </div>`;
}

// ─── Verification badge (React) ───
function VerifBadge({ status }: { status: Supplier['verificationStatus'] }) {
  if (status === 'verified')
    return <span className="flex items-center gap-0.5 text-[10px] text-green-600" style={{ fontWeight: 600 }}><CheckCircle size={10} /> מאומת</span>;
  if (status === 'pending')
    return <span className="flex items-center gap-0.5 text-[10px] text-yellow-600" style={{ fontWeight: 600 }}><Clock size={10} /> ממתין</span>;
  return <span className="flex items-center gap-0.5 text-[10px] text-[#8d785e]" style={{ fontWeight: 600 }}><AlertTriangle size={10} /> לא מאומת</span>;
}

// ━━━━━━━━━━━━━━━━━ MAIN COMPONENT ━━━━━━━━━━━━━━━━━
export function SupplierMap() {
  const navigate = useNavigate();
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const mapElRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  const suppliersByRegion = useMemo(() => {
    const map: Record<string, Supplier[]> = {};
    for (const s of suppliers) {
      if (!map[s.region]) map[s.region] = [];
      map[s.region].push(s);
    }
    return map;
  }, []);

  // Initialise Leaflet map once
  useEffect(() => {
    if (!mapElRef.current || mapRef.current) return;

    const map = L.map(mapElRef.current, {
      center: ISRAEL_CENTER,
      zoom: ISRAEL_ZOOM,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Create markers for each region
    regionDefs.forEach((region) => {
      const list = suppliersByRegion[region.id] || [];
      if (list.length === 0) return;

      const icon = L.divIcon({
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -24],
        html: pinHtml(region.color, list.length, false),
      });

      const marker = L.marker([region.lat, region.lng], { icon }).addTo(map);

      marker.bindPopup(popupHtml(region, list), {
        className: 'supplier-map-popup',
        maxWidth: 320,
        minWidth: 260,
      });

      // On popup open, wire supplier click handlers
      marker.on('popupopen', () => {
        const popupEl = marker.getPopup()?.getElement();
        if (popupEl) {
          popupEl.querySelectorAll('[data-supplier-id]').forEach((el) => {
            (el as HTMLElement).onclick = () => {
              const id = (el as HTMLElement).getAttribute('data-supplier-id');
              if (id) navigate(`/suppliers/${id}`);
            };
          });
        }
      });

      markersRef.current[region.id] = marker;
    });

    mapRef.current = map;

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker icons when active region changes & fly to region
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    regionDefs.forEach((region) => {
      const marker = markersRef.current[region.id];
      if (!marker) return;
      const list = suppliersByRegion[region.id] || [];
      const isActive = activeRegion === region.id;

      marker.setIcon(L.divIcon({
        className: '',
        iconSize: [isActive ? 48 : 40, isActive ? 48 : 40],
        iconAnchor: [isActive ? 24 : 20, isActive ? 24 : 20],
        popupAnchor: [0, isActive ? -28 : -24],
        html: pinHtml(region.color, list.length, isActive),
      }));
    });

    if (activeRegion) {
      const region = regionDefs.find(r => r.id === activeRegion);
      if (region) {
        map.flyTo([region.lat, region.lng], 10, { duration: 0.8 });
      }
    } else {
      map.flyTo(ISRAEL_CENTER, ISRAEL_ZOOM, { duration: 0.6 });
    }
  }, [activeRegion, suppliersByRegion]);

  const resetView = useCallback(() => {
    setActiveRegion(null);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-[#e7e1da] shadow-sm overflow-hidden">
      {/* Global styles for Leaflet popup & pin animation */}
      <style>{`
        @keyframes leafpin {
          75%, 100% { transform: scale(1.6); opacity: 0; }
        }
        .supplier-map-popup .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.13) !important;
          border: 1px solid #e7e1da !important;
          padding: 0 !important;
          overflow: hidden;
        }
        .supplier-map-popup .leaflet-popup-content {
          margin: 0 !important;
        }
        .supplier-map-popup .leaflet-popup-tip {
          border-top-color: #fff !important;
          box-shadow: none !important;
        }
        .leaflet-control-zoom {
          border: 1px solid #e7e1da !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
        }
        .leaflet-control-zoom a {
          color: #181510 !important;
          background: #fff !important;
          border-bottom: 1px solid #f0ece6 !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f8f7f5 !important;
        }
        .leaflet-control-attribution {
          font-size: 9px !important;
          background: rgba(255,255,255,0.8) !important;
          border-radius: 8px 0 0 0 !important;
          padding: 2px 8px !important;
        }
      `}</style>

      {/* ── Header ── */}
      <div className="px-6 pt-5 pb-4 border-b border-[#f0ece6]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#fff3e0] flex items-center justify-center">
              <MapPin size={16} className="text-[#ff8c00]" />
            </div>
            <div>
              <h2 className="text-[18px] text-[#181510]" style={{ fontWeight: 600 }}>מפת ספקים ארצית</h2>
              <p className="text-[12px] text-[#8d785e] mt-0.5">התפלגות ספקים לפי אזור — לחץ על פין לצפייה בפרטים</p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {regionDefs.map((r) => (
              <div key={r.id} className="flex items-center gap-1.5 cursor-pointer"
                onClick={() => setActiveRegion(activeRegion === r.id ? null : r.id)}>
                <span className="w-2.5 h-2.5 rounded-full transition-transform"
                  style={{
                    backgroundColor: r.color,
                    transform: activeRegion === r.id ? 'scale(1.4)' : 'scale(1)',
                  }} />
                <span className="text-[11px] text-[#8d785e]">{r.name}</span>
                <span className="text-[12px] text-[#181510]" style={{ fontWeight: 700 }}>
                  {(suppliersByRegion[r.id] || []).length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col lg:flex-row" style={{ height: 620 }}>
        {/* ── Map ── */}
        <div className="relative flex-1 h-full">
          <div ref={mapElRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

          {/* Floating reset button */}
          {activeRegion && (
            <button
              onClick={resetView}
              className="absolute top-3 left-3 z-[1000] flex items-center gap-1.5 bg-white border border-[#e7e1da] rounded-xl px-3 py-2 text-[12px] text-[#181510] hover:border-[#ff8c00] hover:text-[#ff8c00] transition-all shadow-md"
              style={{ fontWeight: 600 }}
            >
              <Navigation size={13} />
              חזרה לתצוגה ארצית
            </button>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="lg:w-[260px] border-r border-[#f0ece6] bg-[#fdfcfa] flex flex-col h-full overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <p className="text-[13px] text-[#181510]" style={{ fontWeight: 700 }}>ספקים לפי אזור</p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-3 space-y-1.5">
            {regionDefs.map((pin) => {
              const list = suppliersByRegion[pin.id] || [];
              const isActive = activeRegion === pin.id;
              const pct = suppliers.length > 0 ? Math.round((list.length / suppliers.length) * 100) : 0;

              return (
                <div
                  key={pin.id}
                  className="w-full text-right rounded-xl px-3 py-3 transition-all cursor-pointer"
                  style={{
                    backgroundColor: isActive ? pin.color + '08' : 'transparent',
                    border: isActive ? `1px solid ${pin.color}25` : '1px solid transparent',
                  }}
                  onClick={() => setActiveRegion(isActive ? null : pin.id)}
                  onMouseEnter={() => setActiveRegion(pin.id)}
                  onMouseLeave={() => setActiveRegion(null)}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full transition-transform duration-200 shrink-0"
                        style={{
                          backgroundColor: pin.color,
                          transform: isActive ? 'scale(1.25)' : 'scale(1)',
                        }} />
                      <span className="text-[13px] text-[#181510]"
                        style={{ fontWeight: isActive ? 700 : 500 }}>
                        {pin.label}
                      </span>
                    </div>
                    <span className="text-[12px]" style={{ color: pin.color, fontWeight: 700 }}>
                      {list.length}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-[#f0ece6] rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full"
                      style={{ backgroundColor: pin.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }} />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-[#b09d84]">{pct}% מהמאגר</span>
                    {list.length > 0 && (
                      <span className="text-[10px] text-[#b09d84]">
                        {list.filter(s => s.verificationStatus === 'verified').length} מאומתים
                      </span>
                    )}
                  </div>

                  {/* Supplier chips on active */}
                  {isActive && list.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-[#f0ece6]">
                      {list.map((s) => (
                        <button
                          key={s.id}
                          onClick={(e) => { e.stopPropagation(); navigate(`/suppliers/${s.id}`); }}
                          className="flex items-center gap-1 text-[10px] bg-white border border-[#e7e1da] rounded-md px-1.5 py-1 hover:border-[#ff8c00] hover:text-[#ff8c00] transition-colors"
                          title={s.name}
                        >
                          <span>{s.icon}</span>
                          <span className="truncate max-w-[70px]" style={{ fontWeight: 500 }}>{s.name.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary footer */}
          <div className="px-5 py-3 border-t border-[#f0ece6] bg-[#fdfcfa] shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <Users size={13} className="text-[#8d785e]" />
              <span className="text-[12px] text-[#8d785e]">{'סה"כ במאגר:'}</span>
              <span className="text-[14px] text-[#181510]" style={{ fontWeight: 700 }}>
                {suppliers.length} ספקים
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#b09d84]">
              <span className="flex items-center gap-0.5">
                <CheckCircle size={9} className="text-green-500" />
                {suppliers.filter(s => s.verificationStatus === 'verified').length} מאומתים
              </span>
              <span className="flex items-center gap-0.5">
                <Clock size={9} className="text-yellow-500" />
                {suppliers.filter(s => s.verificationStatus === 'pending').length} ממתינים
              </span>
              <span className="flex items-center gap-0.5">
                <AlertTriangle size={9} className="text-[#8d785e]" />
                {suppliers.filter(s => s.verificationStatus === 'unverified').length} לא מאומתים
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
