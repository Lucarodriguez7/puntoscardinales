import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/* ─────────────────────────────────────────────
   CSS
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
.adm{min-height:100vh;background:#0a0a0f;font-family:'Montserrat',sans-serif;color:#fff;display:flex;}

.adm-login{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#050508;padding:20px;}
.adm-login-box{width:100%;max-width:400px;background:rgba(255,255,255,0.02);border:1px solid rgba(201,168,76,0.12);border-radius:16px;padding:40px 32px;}
.adm-login-logo{text-align:center;margin-bottom:32px;}
.adm-login-logo img{height:60px;}
.adm-login-title{font-size:20px;font-weight:700;text-align:center;margin-bottom:6px;}
.adm-login-sub{font-size:12px;font-weight:300;color:rgba(255,255,255,0.4);text-align:center;margin-bottom:28px;}
.adm-input-group{margin-bottom:16px;}
.adm-input-label{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:6px;display:block;}
.adm-input{width:100%;padding:13px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#fff;font-family:'Montserrat',sans-serif;font-size:13px;outline:none;transition:border-color .3s;}
.adm-input:focus{border-color:rgba(201,168,76,0.4);}
.adm-input::placeholder{color:rgba(255,255,255,0.2);}
.adm-btn-gold{width:100%;padding:14px;background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8,#C9A84C);background-size:300% 300%;animation:admGold 5s ease infinite;border:none;border-radius:10px;color:#0a0800;font-family:'Montserrat',sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .25s;margin-top:8px;}
.adm-btn-gold:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(201,168,76,0.3);}
.adm-btn-gold:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.adm-error{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:8px;padding:10px 14px;font-size:12px;color:#ef4444;margin-bottom:16px;}

.adm-sidebar{width:260px;background:#08080d;border-right:1px solid rgba(201,168,76,0.06);display:flex;flex-direction:column;flex-shrink:0;height:100vh;position:sticky;top:0;}
.adm-sidebar-logo{padding:24px;border-bottom:1px solid rgba(255,255,255,0.04);}
.adm-sidebar-logo img{height:40px;}
.adm-sidebar-nav{flex:1;padding:16px 12px;display:flex;flex-direction:column;gap:4px;}
.adm-nav-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;font-size:13px;font-weight:500;color:rgba(255,255,255,0.45);cursor:pointer;transition:all .2s;border:none;background:none;width:100%;text-align:left;}
.adm-nav-item:hover{color:rgba(255,255,255,0.7);background:rgba(255,255,255,0.03);}
.adm-nav-item.active{color:#C9A84C;background:rgba(201,168,76,0.08);font-weight:600;}
.adm-nav-item svg{width:18px;height:18px;flex-shrink:0;}
.adm-sidebar-footer{padding:16px;border-top:1px solid rgba(255,255,255,0.04);}
.adm-user-info{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
.adm-user-avatar{width:32px;height:32px;border-radius:50%;background:rgba(201,168,76,0.15);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#C9A84C;flex-shrink:0;}
.adm-user-name{font-size:12px;font-weight:600;color:rgba(255,255,255,0.7);}
.adm-user-role{font-size:9px;font-weight:500;color:rgba(201,168,76,0.5);text-transform:uppercase;letter-spacing:1px;}
.adm-btn-logout{width:100%;padding:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;color:rgba(255,255,255,0.35);font-family:'Montserrat',sans-serif;font-size:11px;font-weight:500;cursor:pointer;transition:all .2s;}
.adm-btn-logout:hover{border-color:rgba(239,68,68,0.3);color:rgba(239,68,68,0.7);}

.adm-main{flex:1;padding:32px;overflow-y:auto;height:100vh;}
.adm-page-title{font-size:24px;font-weight:800;margin-bottom:8px;}
.adm-page-sub{font-size:13px;font-weight:300;color:rgba(255,255,255,0.4);margin-bottom:32px;}

.adm-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:36px;}
.adm-stat-card{padding:24px;background:rgba(255,255,255,0.02);border:1px solid rgba(201,168,76,0.08);border-radius:12px;}
.adm-stat-num{font-size:28px;font-weight:800;background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:admGold 4s ease infinite;margin-bottom:4px;}
.adm-stat-label{font-size:10px;font-weight:500;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,0.3);}

.adm-table-wrap{background:rgba(255,255,255,0.02);border:1px solid rgba(201,168,76,0.08);border-radius:12px;overflow:hidden;}
.adm-table-header{display:flex;justify-content:space-between;align-items:center;padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.04);}
.adm-table-title{font-size:15px;font-weight:700;}
.adm-btn-new{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8,#C9A84C);background-size:300%;animation:admGold 5s ease infinite;border:none;border-radius:8px;color:#0a0800;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .2s;}
.adm-btn-new:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(201,168,76,0.3);}
table.adm-table{width:100%;border-collapse:collapse;}
.adm-table th{padding:12px 20px;font-size:10px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,0.3);text-align:left;border-bottom:1px solid rgba(255,255,255,0.04);}
.adm-table td{padding:14px 20px;font-size:13px;color:rgba(255,255,255,0.6);border-bottom:1px solid rgba(255,255,255,0.03);vertical-align:middle;}
.adm-table tr:hover td{background:rgba(255,255,255,0.02);}
.adm-table-img{width:48px;height:36px;border-radius:6px;object-fit:cover;}
.adm-badge{padding:3px 10px;border-radius:20px;font-size:9px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;}
.adm-badge-pub{background:rgba(34,197,94,0.1);color:#22c55e;border:1px solid rgba(34,197,94,0.2);}
.adm-badge-draft{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.35);border:1px solid rgba(255,255,255,0.08);}
.adm-badge-new{background:rgba(59,130,246,0.1);color:#3b82f6;border:1px solid rgba(59,130,246,0.2);}
.adm-badge-contacted{background:rgba(201,168,76,0.1);color:#C9A84C;border:1px solid rgba(201,168,76,0.2);}
.adm-badge-closed{background:rgba(34,197,94,0.1);color:#22c55e;border:1px solid rgba(34,197,94,0.2);}
.adm-table-actions{display:flex;gap:6px;}
.adm-btn-sm{padding:6px 12px;border-radius:6px;font-size:10px;font-weight:600;cursor:pointer;transition:all .2s;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);color:rgba(255,255,255,0.5);}
.adm-btn-sm:hover{border-color:rgba(201,168,76,0.3);color:#C9A84C;}
.adm-btn-sm-danger{border-color:rgba(239,68,68,0.2);color:rgba(239,68,68,0.5);}
.adm-btn-sm-danger:hover{border-color:rgba(239,68,68,0.5);color:#ef4444;background:rgba(239,68,68,0.08);}
.adm-btn-sm-wa{border-color:rgba(37,211,102,0.2);color:rgba(37,211,102,0.6);}
.adm-btn-sm-wa:hover{border-color:rgba(37,211,102,0.5);color:#25D366;background:rgba(37,211,102,0.08);}

.adm-editor{background:rgba(255,255,255,0.02);border:1px solid rgba(201,168,76,0.08);border-radius:12px;padding:32px;margin-bottom:24px;}
.adm-editor-title{font-size:16px;font-weight:700;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.04);}
.adm-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.adm-form-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;}
.adm-form-full{grid-column:1/-1;}
.adm-select{width:100%;padding:13px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#fff;font-family:'Montserrat',sans-serif;font-size:13px;outline:none;transition:border-color .3s;appearance:none;cursor:pointer;}
.adm-select:focus{border-color:rgba(201,168,76,0.4);}
.adm-select option{background:#0a0a0f;color:#fff;}
.adm-textarea{min-height:120px;resize:vertical;}
.adm-check{display:flex;align-items:center;gap:10px;cursor:pointer;padding:8px 0;user-select:none;}
.adm-check-box{width:20px;height:20px;border:1.5px solid rgba(255,255,255,0.15);border-radius:5px;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0;}
.adm-check-box.active{background:rgba(201,168,76,0.15);border-color:#C9A84C;}
.adm-check-label{font-size:13px;color:rgba(255,255,255,0.6);}

.adm-images{display:flex;flex-wrap:wrap;gap:12px;margin-top:12px;}
.adm-img-item{position:relative;width:120px;height:90px;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);cursor:grab;}
.adm-img-item:active{cursor:grabbing;}
.adm-img-item img{width:100%;height:100%;object-fit:cover;}
.adm-img-item-del{position:absolute;top:4px;right:4px;width:22px;height:22px;background:rgba(239,68,68,0.8);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;transition:all .2s;}
.adm-img-item-del:hover{background:#ef4444;transform:scale(1.1);}
.adm-img-item-num{position:absolute;bottom:4px;left:4px;width:20px;height:20px;background:rgba(0,0,0,0.7);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;}
.adm-img-upload{width:120px;height:90px;border:2px dashed rgba(201,168,76,0.2);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;transition:all .2s;color:rgba(201,168,76,0.4);font-size:9px;font-weight:600;letter-spacing:1px;text-transform:uppercase;}
.adm-img-upload:hover{border-color:rgba(201,168,76,0.5);color:rgba(201,168,76,0.7);}

/* Map */
.adm-map-wrap{height:350px;border-radius:10px;overflow:hidden;border:1px solid rgba(201,168,76,0.1);margin-top:12px;}
.adm-map-wrap .leaflet-container{height:100%;width:100%;background:#111;}
.adm-map-search{position:relative;margin-bottom:8px;}
.adm-map-search input{width:100%;padding:12px 16px 12px 40px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#fff;font-family:'Montserrat',sans-serif;font-size:13px;outline:none;transition:border-color .3s;}
.adm-map-search input:focus{border-color:rgba(201,168,76,0.4);}
.adm-map-search input::placeholder{color:rgba(255,255,255,0.2);}
.adm-map-search svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);opacity:.35;}
.adm-map-suggestions{position:absolute;top:100%;left:0;right:0;background:#0D0D12;border:1px solid rgba(201,168,76,0.2);border-radius:8px;margin-top:4px;z-index:1000;max-height:200px;overflow-y:auto;}
.adm-map-suggestion{padding:10px 16px;font-size:12px;color:rgba(255,255,255,0.6);cursor:pointer;transition:all .2s;border-bottom:1px solid rgba(255,255,255,0.03);}
.adm-map-suggestion:hover{background:rgba(201,168,76,0.08);color:#fff;}
.adm-map-suggestion:last-child{border-bottom:none;}
.adm-map-coords{display:flex;gap:12px;margin-top:8px;font-size:11px;color:rgba(255,255,255,0.35);}
.adm-map-coords span{background:rgba(255,255,255,0.04);padding:4px 10px;border-radius:6px;font-family:monospace;font-size:11px;}

.adm-form-actions{display:flex;gap:12px;margin-top:24px;}
.adm-btn-save{padding:13px 36px;background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8,#C9A84C);background-size:300%;animation:admGold 5s ease infinite;border:none;border-radius:8px;color:#0a0800;font-family:'Montserrat',sans-serif;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all .2s;}
.adm-btn-save:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(201,168,76,0.3);}
.adm-btn-save:disabled{opacity:.5;cursor:not-allowed;}
.adm-btn-cancel{padding:13px 28px;background:transparent;border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:rgba(255,255,255,0.45);font-family:'Montserrat',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;}
.adm-btn-cancel:hover{border-color:rgba(255,255,255,0.2);color:rgba(255,255,255,0.6);}

.adm-loading{text-align:center;padding:60px;color:rgba(255,255,255,0.3);font-size:13px;}
.adm-empty{text-align:center;padding:60px;color:rgba(255,255,255,0.25);font-size:13px;}
.adm-views-badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;color:rgba(255,255,255,0.35);}
.adm-views-badge svg{opacity:.4;}

@keyframes admGold{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}

@media(max-width:900px){
  .adm{flex-direction:column;}
  .adm-sidebar{width:100%;height:auto;position:static;flex-direction:row;align-items:center;padding:12px;border-right:none;border-bottom:1px solid rgba(201,168,76,0.06);}
  .adm-sidebar-nav{flex-direction:row;padding:0;overflow-x:auto;flex:1;}
  .adm-nav-item{white-space:nowrap;padding:8px 14px;font-size:11px;}
  .adm-sidebar-footer{display:none;}
  .adm-sidebar-logo{padding:0;border:none;}
  .adm-main{height:auto;padding:20px;}
  .adm-stats{grid-template-columns:1fr 1fr;}
  .adm-form-grid,.adm-form-grid-3{grid-template-columns:1fr;}
}
`;

/* ─────────────────────────────────────────────
   MAP COMPONENTS
───────────────────────────────────────────── */
function MapClickHandler({ onMapClick }) {
    useMapEvents({ click(e) { onMapClick(e.latlng); } });
    return null;
}

function MapFlyTo({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo(center, 16, { duration: 1 });
    }, [center, map]);
    return null;
}

function LocationPicker({ lat, lng, onLocationChange, onAddressFound }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [flyCenter, setFlyCenter] = useState(null);
    const [clickAddress, setClickAddress] = useState('');
    const debounceRef = useRef(null);
    const position = lat && lng ? [parseFloat(lat), parseFloat(lng)] : null;
    const defaultCenter = [-41.1335, -71.3103]; // la Patagonia Argentina centro

    // Búsqueda de dirección → coordenadas
    const searchAddress = useCallback(async (q) => {
        if (q.length < 3) { setSuggestions([]); return; }
        try {
            // Buscar con viewbox centrado en la Patagonia Argentina para priorizar resultados locales
            const viewbox = '-75.0,-55.0,-63.0,-35.0';
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&viewbox=${viewbox}&bounded=0&limit=6&addressdetails=1&countrycodes=ar`
            );
            const data = await res.json();
            setSuggestions(data.map(d => {
                const parts = [];
                if (d.address?.road) parts.push(d.address.road);
                if (d.address?.house_number) parts[0] = (parts[0] || '') + ' ' + d.address.house_number;
                if (d.address?.city || d.address?.town || d.address?.village) parts.push(d.address.city || d.address.town || d.address.village);
                if (d.address?.state) parts.push(d.address.state);
                return { display: parts.join(', ') || d.display_name, fullDisplay: d.display_name, lat: parseFloat(d.lat), lng: parseFloat(d.lon) };
            }));
        } catch { setSuggestions([]); }
    }, []);

    // Geocoding inverso: coordenadas → dirección
    const reverseGeocode = useCallback(async (lat, lng) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`);
            const data = await res.json();
            if (data?.address) {
                const parts = [];
                if (data.address.road) parts.push(data.address.road);
                if (data.address.house_number) parts[0] = (parts[0] || '') + ' ' + data.address.house_number;
                if (data.address.city || data.address.town || data.address.village) parts.push(data.address.city || data.address.town || data.address.village);
                const addr = parts.join(', ') || data.display_name?.split(',').slice(0, 3).join(',');
                setClickAddress(addr);
                if (onAddressFound) onAddressFound(addr);
                return addr;
            }
        } catch { }
        setClickAddress('');
        return '';
    }, [onAddressFound]);

    const handleInput = (val) => {
        setQuery(val);
        setClickAddress('');
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => searchAddress(val), 400);
    };

    const selectSuggestion = (s) => {
        onLocationChange(s.lat, s.lng);
        setFlyCenter([s.lat, s.lng]);
        setQuery(s.display);
        setClickAddress('');
        setSuggestions([]);
        if (onAddressFound) onAddressFound(s.display);
    };

    const handleMapClick = async (latlng) => {
        onLocationChange(latlng.lat, latlng.lng);
        setFlyCenter(null);
        setSuggestions([]);
        const addr = await reverseGeocode(latlng.lat, latlng.lng);
        if (addr) setQuery(addr);
    };

    return (
        <>
            <div className="adm-map-search">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" /><path d="M11 11l3.5 3.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" /></svg>
                <input placeholder="Buscar dirección (ej: Mitre 100, Bariloche)" value={query} onChange={e => handleInput(e.target.value)} />
                {suggestions.length > 0 && (
                    <div className="adm-map-suggestions">
                        {suggestions.map((s, i) => (
                            <div key={i} className="adm-map-suggestion" onClick={() => selectSuggestion(s)}>
                                {s.display.length > 80 ? s.display.slice(0, 80) + '...' : s.display}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {clickAddress && <div style={{ fontSize: 11, color: 'rgba(201,168,76,0.6)', marginBottom: 8, padding: '6px 0' }}>📍 {clickAddress}</div>}
            <div className="adm-map-wrap">
                <MapContainer center={position || defaultCenter} zoom={position ? 16 : 13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                    <MapClickHandler onMapClick={handleMapClick} />
                    {flyCenter && <MapFlyTo center={flyCenter} />}
                    {position && <Marker position={position} />}
                </MapContainer>
            </div>
            {position && (
                <div className="adm-map-coords">
                    Lat: <span>{parseFloat(lat).toFixed(6)}</span>
                    Lng: <span>{parseFloat(lng).toFixed(6)}</span>
                </div>
            )}
        </>
    );
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export default function AdminPanel() {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('dashboard');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        if (document.getElementById('adm-css')) return;
        const s = document.createElement('style'); s.id = 'adm-css'; s.textContent = CSS;
        document.head.appendChild(s);
        return () => { const el = document.getElementById('adm-css'); if (el) el.remove(); };
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setLoading(false); });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setSession(session));
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!session) { setProfile(null); return; }
        supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => setProfile(data));
    }, [session]);

    if (loading) return <div className="adm-login"><div className="adm-loading">Cargando...</div></div>;
    if (!session) return <LoginScreen />;

    return (
        <div className="adm">
            <Sidebar view={view} setView={setView} profile={profile} setEditId={setEditId} />
            <main className="adm-main">
                {view === 'dashboard' && <Dashboard setView={setView} />}
                {view === 'properties' && <PropertiesList setView={setView} setEditId={setEditId} />}
                {view === 'property-edit' && <PropertyEditor id={editId} setView={setView} setEditId={setEditId} />}
                {view === 'leads' && <LeadsList />}
                {view === 'settings' && <Settings profile={profile} setProfile={setProfile} />}
            </main>
        </div>
    );
}

/* ─── LOGIN ─── */
function LoginScreen() {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [nombre, setNombre] = useState('');

    const handleAuth = async () => {
        setError(''); setLoading(true);
        try {
            if (isRegister) {
                const { error } = await supabase.auth.signUp({ email, password: pass, options: { data: { nombre } } });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
                if (error) throw error;
            }
        } catch (e) { setError(e.message); }
        setLoading(false);
    };

    return (
        <div className="adm-login">
            <div className="adm-login-box">
                <div className="adm-login-logo"><img src="/logo.png" alt="Puntos Cardinales Bienes Raíces" /></div>
                <div className="adm-login-title">{isRegister ? 'Crear cuenta' : 'Panel de Administración'}</div>
                <div className="adm-login-sub">{isRegister ? 'Registrate para acceder al panel' : 'Ingresá con tus credenciales'}</div>
                {error && <div className="adm-error">{error}</div>}
                {isRegister && <div className="adm-input-group"><label className="adm-input-label">Nombre</label><input className="adm-input" placeholder="Tu nombre" value={nombre} onChange={e => setNombre(e.target.value)} /></div>}
                <div className="adm-input-group"><label className="adm-input-label">Email</label><input className="adm-input" type="email" placeholder="admin@inmobiliariaPuntos Cardinales.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div className="adm-input-group"><label className="adm-input-label">Contraseña</label><input className="adm-input" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAuth()} /></div>
                <button className="adm-btn-gold" onClick={handleAuth} disabled={loading || !email || !pass}>{loading ? 'Cargando...' : isRegister ? 'Registrarme' : 'Ingresar'}</button>
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'none', border: 'none', color: 'rgba(201,168,76,0.6)', fontSize: 12, cursor: 'pointer' }}>{isRegister ? 'Ya tengo cuenta → Ingresar' : '¿No tenés cuenta? → Registrate'}</button>
                </div>
            </div>
        </div>
    );
}

/* ─── SIDEBAR ─── */
function Sidebar({ view, setView, profile, setEditId }) {
    const nav = [
        { id: 'dashboard', label: 'Dashboard', icon: <svg viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.3" /><rect x="11" y="2" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.3" /><rect x="2" y="11" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.3" /><rect x="11" y="11" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.3" /></svg> },
        { id: 'properties', label: 'Propiedades', icon: <svg viewBox="0 0 20 20" fill="none"><path d="M3 8l7-5 7 5v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" stroke="currentColor" strokeWidth="1.3" /><path d="M8 17V11h4v6" stroke="currentColor" strokeWidth="1.3" /></svg> },
        { id: 'leads', label: 'Consultas', icon: <svg viewBox="0 0 20 20" fill="none"><path d="M3 5h14a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3" /><path d="M2 5l8 5 8-5" stroke="currentColor" strokeWidth="1.3" /></svg> },
        { id: 'settings', label: 'Ajustes', icon: <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.3" /><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg> },
    ];
    return (
        <aside className="adm-sidebar">
            <div className="adm-sidebar-logo"><img src="/logo.png" alt="CP" style={{ height: 40 }} /></div>
            <nav className="adm-sidebar-nav">
                {nav.map(n => (<button key={n.id} className={`adm-nav-item${view === n.id || (view === 'property-edit' && n.id === 'properties') ? ' active' : ''}`} onClick={() => { setView(n.id); setEditId(null); }}>{n.icon}{n.label}</button>))}
            </nav>
            <div className="adm-sidebar-footer">
                <div className="adm-user-info"><div className="adm-user-avatar">{profile?.nombre?.[0]?.toUpperCase() || 'U'}</div><div><div className="adm-user-name">{profile?.nombre || 'Usuario'}</div><div className="adm-user-role">{profile?.rol || 'empleado'}</div></div></div>
                <button className="adm-btn-logout" onClick={() => supabase.auth.signOut()}>Cerrar sesión</button>
            </div>
        </aside>
    );
}

/* ─── DASHBOARD ─── */
function Dashboard({ setView }) {
    const [stats, setStats] = useState({ props: 0, pub: 0, leads: 0, newLeads: 0, totalViews: 0 });
    const [recentLeads, setRecentLeads] = useState([]);

    useEffect(() => {
        const load = async () => {
            const { count: props } = await supabase.from('properties').select('*', { count: 'exact', head: true });
            const { count: pub } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('publicado', true);
            const { count: leads } = await supabase.from('leads').select('*', { count: 'exact', head: true });
            const { count: newLeads } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('estado', 'nuevo');
            const { data: viewsData } = await supabase.from('properties').select('views');
            const totalViews = (viewsData || []).reduce((sum, p) => sum + (p.views || 0), 0);
            setStats({ props: props || 0, pub: pub || 0, leads: leads || 0, newLeads: newLeads || 0, totalViews });
            const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5);
            setRecentLeads(data || []);
        };
        load();
    }, []);

    return (
        <>
            <div className="adm-page-title">Dashboard</div>
            <div className="adm-page-sub">Resumen general de tu inmobiliaria</div>
            <div className="adm-stats">
                <div className="adm-stat-card"><div className="adm-stat-num">{stats.props}</div><div className="adm-stat-label">Total propiedades</div></div>
                <div className="adm-stat-card"><div className="adm-stat-num">{stats.pub}</div><div className="adm-stat-label">Publicadas</div></div>
                <div className="adm-stat-card"><div className="adm-stat-num">{stats.totalViews}</div><div className="adm-stat-label">Visitas totales</div></div>
                <div className="adm-stat-card"><div className="adm-stat-num">{stats.newLeads}</div><div className="adm-stat-label">Consultas nuevas</div></div>
            </div>
            <div className="adm-table-wrap">
                <div className="adm-table-header"><span className="adm-table-title">Últimas consultas</span><button className="adm-btn-sm" onClick={() => setView('leads')}>Ver todas →</button></div>
                <table className="adm-table">
                    <thead><tr><th>Nombre</th><th>Teléfono</th><th>Tipo</th><th>Estado</th><th>Fecha</th></tr></thead>
                    <tbody>
                        {recentLeads.map(l => (<tr key={l.id}><td style={{ fontWeight: 600, color: '#fff' }}>{l.nombre}</td><td>{l.telefono}</td><td><span className="adm-badge adm-badge-pub">{l.tipo}</span></td><td><span className={`adm-badge adm-badge-${l.estado === 'nuevo' ? 'new' : l.estado === 'contactado' ? 'contacted' : 'closed'}`}>{l.estado}</span></td><td>{new Date(l.created_at).toLocaleDateString('es-AR')}</td></tr>))}
                        {recentLeads.length === 0 && <tr><td colSpan={5} className="adm-empty">No hay consultas aún</td></tr>}
                    </tbody>
                </table>
            </div>
        </>
    );
}

/* ─── PROPERTIES LIST ─── */
function PropertiesList({ setView, setEditId }) {
    const [props, setProps] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
        setProps(data || []);
        setLoading(false);
    };
    useEffect(() => { load(); }, []);

    const del = async (id) => { if (!confirm('¿Eliminar esta propiedad?')) return; await supabase.from('properties').delete().eq('id', id); load(); };
    const togglePub = async (id, current) => { await supabase.from('properties').update({ publicado: !current }).eq('id', id); load(); };
    const fmtPrice = (p) => p.moneda === 'USD' ? `USD ${Number(p.precio).toLocaleString('es-AR')}` : `$${Number(p.precio).toLocaleString('es-AR')}`;

    return (
        <>
            <div className="adm-page-title">Propiedades</div>
            <div className="adm-page-sub">Gestión del catálogo de propiedades</div>
            <div className="adm-table-wrap">
                <div className="adm-table-header">
                    <span className="adm-table-title">{props.length} propiedad{props.length !== 1 ? 'es' : ''}</span>
                    <button className="adm-btn-new" onClick={() => { setEditId(null); setView('property-edit'); }}>+ Nueva propiedad</button>
                </div>
                {loading ? <div className="adm-loading">Cargando...</div> : (
                    <table className="adm-table">
                        <thead><tr><th></th><th>Título</th><th>Precio</th><th>Tipo</th><th>Views</th><th>Estado</th><th>Acciones</th></tr></thead>
                        <tbody>
                            {props.map(p => (
                                <tr key={p.id}>
                                    <td>{p.imagenes?.[0] ? <img className="adm-table-img" src={p.imagenes[0]} alt="" /> : <div style={{ width: 48, height: 36, background: 'rgba(255,255,255,0.05)', borderRadius: 6 }} />}</td>
                                    <td style={{ fontWeight: 600, color: '#fff', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.titulo}</td>
                                    <td>{fmtPrice(p)}</td>
                                    <td>{p.tipo}</td>
                                    <td><span className="adm-views-badge"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2" /><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" /></svg>{p.views || 0}</span></td>
                                    <td><span className={`adm-badge ${p.publicado ? 'adm-badge-pub' : 'adm-badge-draft'}`}>{p.publicado ? 'Publicada' : 'Borrador'}</span></td>
                                    <td><div className="adm-table-actions"><button className="adm-btn-sm" onClick={() => { setEditId(p.id); setView('property-edit'); }}>Editar</button><button className="adm-btn-sm" onClick={() => togglePub(p.id, p.publicado)}>{p.publicado ? 'Ocultar' : 'Publicar'}</button><button className="adm-btn-sm adm-btn-sm-danger" onClick={() => del(p.id)}>Eliminar</button></div></td>
                                </tr>
                            ))}
                            {props.length === 0 && <tr><td colSpan={7} className="adm-empty">No hay propiedades. Creá la primera.</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

/* ─── PROPERTY EDITOR ─── */
function PropertyEditor({ id, setView }) {
    const emptyProp = { titulo: '', descripcion: '', operacion: 'Venta', tipo: 'Casa', precio: '', moneda: 'USD', direccion: '', zona: '', lat: '', lng: '', m2_cubiertos: '', m2_lote: '', ambientes: '', dormitorios: '', banos: '', cochera: false, pisos: '', antiguedad: '', estado: '', orientacion: '', imagenes: [], publicado: true, destacado: false };
    const [form, setForm] = useState(emptyProp);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef(null);
    const [dragIdx, setDragIdx] = useState(null);

    useEffect(() => {
        if (!id) { setForm(emptyProp); return; }
        supabase.from('properties').select('*').eq('id', id).single().then(({ data }) => {
            if (data) setForm({ ...emptyProp, ...data, precio: String(data.precio), lat: String(data.lat || ''), lng: String(data.lng || ''), m2_cubiertos: String(data.m2_cubiertos || ''), m2_lote: String(data.m2_lote || ''), ambientes: String(data.ambientes || ''), dormitorios: String(data.dormitorios || ''), banos: String(data.banos || ''), pisos: String(data.pisos || '') });
        });
    }, [id]);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const uploadImages = async (files) => {
        setUploading(true);
        const urls = [...form.imagenes];
        for (const file of files) {
            const ext = file.name.split('.').pop();
            const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
            const { error } = await supabase.storage.from('property-images').upload(path, file);
            if (!error) { const { data } = supabase.storage.from('property-images').getPublicUrl(path); urls.push(data.publicUrl); }
        }
        set('imagenes', urls);
        setUploading(false);
    };

    const removeImg = (idx) => set('imagenes', form.imagenes.filter((_, i) => i !== idx));
    const onDragStart = (idx) => setDragIdx(idx);
    const onDragOver = (e, idx) => { e.preventDefault(); if (dragIdx === null || dragIdx === idx) return; const imgs = [...form.imagenes]; const [moved] = imgs.splice(dragIdx, 1); imgs.splice(idx, 0, moved); set('imagenes', imgs); setDragIdx(idx); };
    const onDragEnd = () => setDragIdx(null);

    const save = async () => {
        setSaving(true);
        const payload = { ...form, precio: Number(form.precio) || 0, lat: Number(form.lat) || null, lng: Number(form.lng) || null, m2_cubiertos: Number(form.m2_cubiertos) || 0, m2_lote: Number(form.m2_lote) || 0, ambientes: Number(form.ambientes) || 0, dormitorios: Number(form.dormitorios) || 0, banos: Number(form.banos) || 0, pisos: Number(form.pisos) || 0 };
        delete payload.id; delete payload.created_at; delete payload.updated_at; delete payload.slug; delete payload.created_by; delete payload.views;
        if (id) await supabase.from('properties').update(payload).eq('id', id);
        else await supabase.from('properties').insert(payload);
        setSaving(false);
        setView('properties');
    };

    return (
        <>
            <div className="adm-page-title">{id ? 'Editar propiedad' : 'Nueva propiedad'}</div>
            <div className="adm-page-sub">{id ? 'Modificá los datos y guardá los cambios' : 'Completá la información de la propiedad'}</div>

            <div className="adm-editor">
                <div className="adm-editor-title">Información principal</div>
                <div className="adm-form-grid">
                    <div className="adm-input-group adm-form-full"><label className="adm-input-label">Título *</label><input className="adm-input" placeholder="Ej: Casa con pileta en Barrio Jardín" value={form.titulo} onChange={e => set('titulo', e.target.value)} /></div>
                    <div className="adm-input-group"><label className="adm-input-label">Operación *</label><select className="adm-select" value={form.operacion} onChange={e => set('operacion', e.target.value)}><option>Venta</option><option>Alquiler</option><option>Alquiler Temporal</option></select></div>
                    <div className="adm-input-group"><label className="adm-input-label">Tipo *</label><select className="adm-select" value={form.tipo} onChange={e => set('tipo', e.target.value)}><option>Casa</option><option>Departamento</option><option>PH</option><option>Terreno</option><option>Local</option><option>Oficina</option></select></div>
                    <div className="adm-input-group"><label className="adm-input-label">Precio *</label><input className="adm-input" type="number" placeholder="150000" value={form.precio} onChange={e => set('precio', e.target.value)} /></div>
                    <div className="adm-input-group"><label className="adm-input-label">Moneda</label><select className="adm-select" value={form.moneda} onChange={e => set('moneda', e.target.value)}><option>USD</option><option>ARS</option></select></div>
                    <div className="adm-input-group adm-form-full"><label className="adm-input-label">Descripción</label><textarea className="adm-input adm-textarea" placeholder="Descripción detallada..." value={form.descripcion} onChange={e => set('descripcion', e.target.value)} /></div>
                </div>
            </div>

            <div className="adm-editor">
                <div className="adm-editor-title">Ubicación</div>
                <div className="adm-form-grid" style={{ marginBottom: 16 }}>
                    <div className="adm-input-group"><label className="adm-input-label">Dirección</label><input className="adm-input" placeholder="Calle 25 e/ 28 y 30" value={form.direccion} onChange={e => set('direccion', e.target.value)} /></div>
                    <div className="adm-input-group"><label className="adm-input-label">Zona / Barrio</label><input className="adm-input" placeholder="Centro, Barrio Jardín, etc." value={form.zona} onChange={e => set('zona', e.target.value)} /></div>
                </div>
                <div className="adm-input-label" style={{ marginBottom: 8 }}>Hacé click en el mapa o buscá una dirección para marcar la ubicación</div>
                <LocationPicker lat={form.lat} lng={form.lng} onLocationChange={(lat, lng) => { set('lat', String(lat)); set('lng', String(lng)); }} onAddressFound={(addr) => { if (!form.direccion) set('direccion', addr); }} />
            </div>

            <div className="adm-editor">
                <div className="adm-editor-title">Características</div>
                <div className="adm-form-grid-3">
                    <div className="adm-input-group"><label className="adm-input-label">m² Cubiertos</label><input className="adm-input" type="number" value={form.m2_cubiertos} onChange={e => set('m2_cubiertos', e.target.value)} /></div>
                    <div className="adm-input-group"><label className="adm-input-label">m² Lote</label><input className="adm-input" type="number" value={form.m2_lote} onChange={e => set('m2_lote', e.target.value)} /></div>
                    <div className="adm-input-group"><label className="adm-input-label">Ambientes</label><input className="adm-input" type="number" value={form.ambientes} onChange={e => set('ambientes', e.target.value)} /></div>
                    <div className="adm-input-group"><label className="adm-input-label">Dormitorios</label><input className="adm-input" type="number" value={form.dormitorios} onChange={e => set('dormitorios', e.target.value)} /></div>
                    <div className="adm-input-group"><label className="adm-input-label">Baños</label><input className="adm-input" type="number" value={form.banos} onChange={e => set('banos', e.target.value)} /></div>
                    <div className="adm-input-group"><label className="adm-input-label">Pisos</label><input className="adm-input" type="number" value={form.pisos} onChange={e => set('pisos', e.target.value)} /></div>
                    <div className="adm-input-group"><label className="adm-input-label">Antigüedad</label><input className="adm-input" placeholder="5 años" value={form.antiguedad} onChange={e => set('antiguedad', e.target.value)} /></div>
                    <div className="adm-input-group"><label className="adm-input-label">Estado</label><input className="adm-input" placeholder="Excelente" value={form.estado} onChange={e => set('estado', e.target.value)} /></div>
                    <div className="adm-input-group"><label className="adm-input-label">Orientación</label><input className="adm-input" placeholder="Norte" value={form.orientacion} onChange={e => set('orientacion', e.target.value)} /></div>
                </div>
                <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
                    <div className="adm-check" onClick={() => set('cochera', !form.cochera)}><div className={`adm-check-box${form.cochera ? ' active' : ''}`}>{form.cochera && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" /></svg>}</div><span className="adm-check-label">Cochera</span></div>
                    <div className="adm-check" onClick={() => set('destacado', !form.destacado)}><div className={`adm-check-box${form.destacado ? ' active' : ''}`}>{form.destacado && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" /></svg>}</div><span className="adm-check-label">Destacada</span></div>
                    <div className="adm-check" onClick={() => set('publicado', !form.publicado)}><div className={`adm-check-box${form.publicado ? ' active' : ''}`}>{form.publicado && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" /></svg>}</div><span className="adm-check-label">Publicada</span></div>
                </div>
            </div>

            <div className="adm-editor">
                <div className="adm-editor-title">Imágenes {uploading && <span style={{ fontSize: 11, color: 'rgba(201,168,76,0.6)', fontWeight: 400 }}>(subiendo...)</span>}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>Arrastrá para reordenar. La primera imagen es la principal.</div>
                <div className="adm-images">
                    {form.imagenes.map((url, i) => (
                        <div key={i} className="adm-img-item" draggable onDragStart={() => onDragStart(i)} onDragOver={e => onDragOver(e, i)} onDragEnd={onDragEnd} style={{ opacity: dragIdx === i ? 0.5 : 1 }}>
                            <img src={url} alt="" />
                            <div className="adm-img-item-num">{i + 1}</div>
                            <button className="adm-img-item-del" onClick={() => removeImg(i)}><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" /></svg></button>
                        </div>
                    ))}
                    <div className="adm-img-upload" onClick={() => fileRef.current?.click()}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        Subir foto
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={e => { if (e.target.files.length) uploadImages(Array.from(e.target.files)); e.target.value = ''; }} />
                </div>
            </div>

            <div className="adm-form-actions">
                <button className="adm-btn-save" onClick={save} disabled={saving || !form.titulo || !form.precio}>{saving ? 'Guardando...' : id ? 'Guardar cambios' : 'Crear propiedad'}</button>
                <button className="adm-btn-cancel" onClick={() => setView('properties')}>Cancelar</button>
            </div>
        </>
    );
}

/* ─── LEADS ─── */
function LeadsList() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => { setLoading(true); const { data } = await supabase.from('leads').select('*, properties(titulo)').order('created_at', { ascending: false }); setLeads(data || []); setLoading(false); };
    useEffect(() => { load(); }, []);

    const updateEstado = async (id, estado) => { await supabase.from('leads').update({ estado }).eq('id', id); load(); };
    const waMsg = (l) => { const msg = encodeURIComponent(`Hola ${l.nombre}, te contactamos desde Puntos Cardinales Bienes Raíces por tu consulta${l.properties?.titulo ? ` sobre "${l.properties.titulo}"` : ''}. ¿En qué podemos ayudarte?`); return `https://wa.me/${l.telefono.replace(/[^0-9]/g, '')}?text=${msg}`; };

    return (
        <>
            <div className="adm-page-title">Consultas</div>
            <div className="adm-page-sub">Todas las consultas recibidas desde la web</div>
            <div className="adm-table-wrap">
                <div className="adm-table-header"><span className="adm-table-title">{leads.length} consulta{leads.length !== 1 ? 's' : ''}</span></div>
                {loading ? <div className="adm-loading">Cargando...</div> : (
                    <table className="adm-table">
                        <thead><tr><th>Nombre</th><th>Teléfono</th><th>Tipo</th><th>Propiedad</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead>
                        <tbody>
                            {leads.map(l => (<tr key={l.id}><td style={{ fontWeight: 600, color: '#fff' }}>{l.nombre}</td><td>{l.telefono}</td><td><span className="adm-badge adm-badge-pub">{l.tipo}</span></td><td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.properties?.titulo || '-'}</td><td><select className="adm-select" style={{ padding: '6px 10px', fontSize: 10, minWidth: 120 }} value={l.estado} onChange={e => updateEstado(l.id, e.target.value)}><option value="nuevo">Nuevo</option><option value="contactado">Contactado</option><option value="en_proceso">En proceso</option><option value="cerrado">Cerrado</option></select></td><td>{new Date(l.created_at).toLocaleDateString('es-AR')}</td><td><div className="adm-table-actions"><a href={waMsg(l)} target="_blank" rel="noreferrer" className="adm-btn-sm adm-btn-sm-wa" style={{ textDecoration: 'none' }}>WhatsApp</a></div></td></tr>))}
                            {leads.length === 0 && <tr><td colSpan={7} className="adm-empty">No hay consultas aún</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

/* ─── SETTINGS ─── */
function Settings({ profile, setProfile }) {
    const [nombre, setNombre] = useState(profile?.nombre || '');
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const save = async () => { setSaving(true); await supabase.from('profiles').update({ nombre }).eq('id', profile.id); setProfile({ ...profile, nombre }); setMsg('Guardado'); setSaving(false); setTimeout(() => setMsg(''), 2000); };
    return (
        <>
            <div className="adm-page-title">Ajustes</div>
            <div className="adm-page-sub">Configuración de tu cuenta</div>
            <div className="adm-editor" style={{ maxWidth: 500 }}>
                <div className="adm-editor-title">Perfil</div>
                <div className="adm-input-group"><label className="adm-input-label">Nombre</label><input className="adm-input" value={nombre} onChange={e => setNombre(e.target.value)} /></div>
                <div className="adm-input-group"><label className="adm-input-label">Email</label><input className="adm-input" value={profile?.email || ''} disabled style={{ opacity: .5 }} /></div>
                <div className="adm-input-group"><label className="adm-input-label">Rol</label><input className="adm-input" value={profile?.rol || ''} disabled style={{ opacity: .5 }} /></div>
                <div className="adm-form-actions"><button className="adm-btn-save" onClick={save} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>{msg && <span style={{ color: '#22c55e', fontSize: 12, alignSelf: 'center' }}>{msg}</span>}</div>
            </div>
        </>
    );
}