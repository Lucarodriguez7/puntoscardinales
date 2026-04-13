import { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { supabase } from '../lib/supabaseClient';
import { Link, useSearchParams } from 'react-router-dom';


const OPERACIONES = ['Venta', 'Alquiler', 'Alquiler Temporal'];
const TIPOS = ['Departamento', 'Casa', 'PH', 'Local', 'Oficina', 'Terreno'];

const AMBIENTES_OPTS = [1, 2, 3, 4, 5, 6];
const DORMITORIOS_OPTS = [1, 2, 3, 4, 5];
const ORDEN_OPTS = [
    { value: 'recientes', label: 'Más recientes' },
    { value: 'precio-asc', label: 'Menor precio' },
    { value: 'precio-desc', label: 'Mayor precio' },
    { value: 'm2-desc', label: 'Mayor superficie' },
];

const WA = 'https://wa.me/5492945441507';

/* ─────────────────────────────────────────────
   CSS
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');

.catalog-page{min-height:100vh;background:#050508;font-family:'Montserrat',sans-serif;padding-top:100px;}

/* Layout */
.catalog-layout{max-width:1380px;margin:0 auto;padding:0 40px 80px;display:grid;grid-template-columns:300px 1fr;gap:40px;}

/* ── SIDEBAR ── */
.catalog-sidebar{position:sticky;top:110px;align-self:start;max-height:calc(100vh - 130px);overflow-y:auto;padding-right:8px;}
.catalog-sidebar::-webkit-scrollbar{width:3px;}
.catalog-sidebar::-webkit-scrollbar-thumb{background:rgba(201,168,76,0.2);border-radius:2px;}

.filter-section{margin-bottom:28px;}
.filter-title{font-size:10px;font-weight:700;letter-spacing:.25em;text-transform:uppercase;color:rgba(201,168,76,0.7);margin-bottom:14px;display:flex;align-items:center;gap:8px;}
.filter-title::before{content:'';width:16px;height:1px;background:var(--gold-2);flex-shrink:0;}

/* Search */
.filter-search{position:relative;margin-bottom:28px;}
.filter-search input{width:100%;padding:14px 18px 14px 44px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#fff;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:400;outline:none;transition:border-color .3s;}
.filter-search input::placeholder{color:rgba(255,255,255,0.25);}
.filter-search input:focus{border-color:rgba(201,168,76,0.4);}
.filter-search svg{position:absolute;left:16px;top:50%;transform:translateY(-50%);opacity:.35;}

/* Chips */
.filter-chips{display:flex;flex-wrap:wrap;gap:8px;}
.filter-chip{padding:8px 16px;font-size:11px;font-weight:500;letter-spacing:.05em;color:rgba(255,255,255,0.5);background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;cursor:pointer;transition:all .25s;user-select:none;}
.filter-chip:hover{border-color:rgba(201,168,76,0.3);color:rgba(255,255,255,0.7);}
.filter-chip.active{background:rgba(201,168,76,0.1);border-color:rgba(201,168,76,0.5);color:#C9A84C;font-weight:600;}

/* Number chips (ambientes/dorms) */
.filter-num-chips{display:flex;gap:6px;}
.filter-num{width:38px;height:38px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:500;color:rgba(255,255,255,0.45);background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;cursor:pointer;transition:all .25s;user-select:none;}
.filter-num:hover{border-color:rgba(201,168,76,0.3);}
.filter-num.active{background:rgba(201,168,76,0.1);border-color:rgba(201,168,76,0.5);color:#C9A84C;font-weight:700;}

/* Range */
.filter-range-row{display:flex;gap:10px;align-items:center;}
.filter-range-input{flex:1;padding:12px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;color:#fff;font-family:'Montserrat',sans-serif;font-size:12px;font-weight:400;outline:none;transition:border-color .3s;text-align:center;}
.filter-range-input::placeholder{color:rgba(255,255,255,0.2);}
.filter-range-input:focus{border-color:rgba(201,168,76,0.4);}
.filter-range-sep{color:rgba(255,255,255,0.15);font-size:12px;}

/* Checkbox (cochera) */
.filter-check{display:flex;align-items:center;gap:10px;cursor:pointer;user-select:none;}
.filter-check-box{width:20px;height:20px;border:1.5px solid rgba(255,255,255,0.15);border-radius:5px;display:flex;align-items:center;justify-content:center;transition:all .25s;flex-shrink:0;}
.filter-check-box.active{background:rgba(201,168,76,0.15);border-color:rgba(201,168,76,0.5);}
.filter-check-label{font-size:13px;font-weight:400;color:rgba(255,255,255,0.55);}

/* Ubicaciones grouped */
.filter-ubi-group{margin-bottom:14px;}
.filter-ubi-group-title{font-size:9px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:8px;padding-left:2px;}
.filter-ubi-items{display:flex;flex-wrap:wrap;gap:6px;}

/* Clear / Apply */
.filter-actions{display:flex;gap:10px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.06);}
.filter-clear{flex:1;padding:12px;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,0.4);background:transparent;border:1px solid rgba(255,255,255,0.08);border-radius:8px;cursor:pointer;transition:all .25s;text-align:center;}
.filter-clear:hover{border-color:rgba(255,255,255,0.2);color:rgba(255,255,255,0.6);}

/* ── MAIN CONTENT ── */
.catalog-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:32px;flex-wrap:wrap;gap:16px;}
.catalog-count{font-size:14px;font-weight:300;color:rgba(255,255,255,0.45);}
.catalog-count strong{color:var(--white);font-weight:700;}
.catalog-sort{position:relative;}
.catalog-sort-btn{display:flex;align-items:center;gap:8px;padding:10px 18px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;color:rgba(255,255,255,0.6);font-size:12px;font-weight:500;cursor:pointer;transition:all .25s;}
.catalog-sort-btn:hover{border-color:rgba(201,168,76,0.3);}
.catalog-sort-drop{position:absolute;top:calc(100% + 6px);right:0;min-width:180px;background:rgba(13,13,18,0.97);border:1px solid rgba(201,168,76,0.15);border-radius:10px;backdrop-filter:blur(20px);padding:6px 0;z-index:50;opacity:0;transform:translateY(-6px);pointer-events:none;transition:all .25s;box-shadow:0 16px 48px rgba(0,0,0,0.5);}
.catalog-sort.open .catalog-sort-drop{opacity:1;transform:translateY(0);pointer-events:all;}
.catalog-sort-opt{padding:10px 18px;font-size:12px;color:rgba(255,255,255,0.5);cursor:pointer;transition:all .2s;}
.catalog-sort-opt:hover{background:rgba(201,168,76,0.08);color:var(--white);}
.catalog-sort-opt.active{color:#C9A84C;font-weight:600;}

/* Grid */
.catalog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}

/* Cards */
.cat-prop-card{background:rgba(255,255,255,0.02);border:1px solid rgba(201,168,76,0.08);border-radius:10px;overflow:hidden;transition:all .4s cubic-bezier(.16,1,.3,1);cursor:pointer;}
.cat-prop-card:hover{border-color:rgba(201,168,76,0.25);transform:translateY(-6px);box-shadow:0 24px 60px rgba(0,0,0,0.45);}
.cat-prop-img-wrap{position:relative;height:220px;overflow:hidden;}
.cat-prop-img{width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.16,1,.3,1);}
.cat-prop-card:hover .cat-prop-img{transform:scale(1.05);}
.cat-prop-img-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(5,5,8,0.8));}
.cat-prop-tag{position:absolute;top:12px;left:12px;padding:4px 12px;font-size:9px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8);background-size:200%;animation:goldShift 4s ease infinite;color:#0a0800;border-radius:5px;}
.cat-prop-op-tag{position:absolute;top:12px;right:12px;padding:4px 10px;font-size:8px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;background:rgba(5,5,8,0.7);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);border-radius:5px;backdrop-filter:blur(8px);}
.cat-prop-body{padding:20px 22px 22px;}
.cat-prop-price{font-size:22px;font-weight:800;line-height:1;margin-bottom:6px;background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8,#C9A84C);background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:goldShift 5s ease infinite;}
.cat-prop-title{font-size:14px;font-weight:600;color:var(--white);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.cat-prop-zona{font-size:11px;font-weight:300;color:rgba(255,255,255,0.4);margin-bottom:16px;display:flex;align-items:center;gap:5px;}
.cat-prop-stats{display:flex;gap:14px;padding-top:14px;border-top:1px solid rgba(201,168,76,0.06);align-items:center;}
.cat-prop-stat{font-size:11px;color:rgba(255,255,255,0.45);}
.cat-prop-stat strong{font-weight:600;color:var(--off);}
.cat-prop-wa{margin-left:auto;width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#25D366,#128C7E);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .2s;text-decoration:none;}
.cat-prop-wa:hover{transform:scale(1.1);}

/* No results */
.catalog-empty{text-align:center;padding:80px 20px;grid-column:1/-1;}
.catalog-empty h3{font-size:20px;font-weight:700;color:var(--white);margin-bottom:12px;}
.catalog-empty p{font-size:14px;font-weight:300;color:rgba(255,255,255,0.4);}

/* Active filters bar */
.active-filters{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;}
.active-filter-tag{display:flex;align-items:center;gap:6px;padding:6px 14px;font-size:10px;font-weight:500;color:#C9A84C;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:20px;cursor:pointer;transition:all .2s;}
.active-filter-tag:hover{background:rgba(201,168,76,0.15);}
.active-filter-tag svg{opacity:.6;}

/* Mobile filter button */
.mobile-filter-btn{display:none;position:fixed;bottom:28px;left:50%;transform:translateX(-50%);z-index:998;padding:14px 32px;background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8,#C9A84C);background-size:300% 300%;animation:goldShift 5s ease infinite;color:#0a0800;font-family:'Montserrat',sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border:none;border-radius:50px;cursor:pointer;box-shadow:0 8px 32px rgba(201,168,76,0.4);transition:transform .2s;}
.mobile-filter-btn:hover{transform:translateX(-50%) translateY(-2px);}

/* Mobile drawer */
.mobile-drawer-overlay{display:none;position:fixed;inset:0;background:rgba(5,5,8,0.8);z-index:1100;opacity:0;transition:opacity .3s;}
.mobile-drawer-overlay.open{opacity:1;}
.mobile-drawer{position:fixed;top:0;left:0;bottom:0;width:85vw;max-width:360px;background:#0D0D12;z-index:1101;transform:translateX(-100%);transition:transform .4s cubic-bezier(.16,1,.3,1);overflow-y:auto;padding:24px 24px 100px;}
.mobile-drawer.open{transform:translateX(0);}
.mobile-drawer-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;padding-bottom:16px;border-bottom:1px solid rgba(201,168,76,0.1);}
.mobile-drawer-title{font-size:16px;font-weight:700;color:var(--white);}
.mobile-drawer-close{width:36px;height:36px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;}
.mobile-drawer-close:hover{border-color:rgba(201,168,76,0.3);}
.mobile-drawer-apply{position:sticky;bottom:0;left:0;right:0;padding:16px 24px;background:linear-gradient(to top,#0D0D12 80%,transparent);z-index:2;}
.mobile-drawer-apply button{width:100%;padding:14px;background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8,#C9A84C);background-size:300% 300%;animation:goldShift 5s ease infinite;color:#0a0800;font-family:'Montserrat',sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border:none;border-radius:10px;cursor:pointer;}

@keyframes goldShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}

/* ══════ RESPONSIVE ══════ */
@media(max-width:1100px){
  .catalog-grid{grid-template-columns:repeat(2,1fr);}
}
@media(max-width:900px){
  .catalog-layout{grid-template-columns:1fr;padding:0 20px 100px;}
  .catalog-sidebar{display:none;}
  .mobile-filter-btn{display:flex;align-items:center;gap:8px;}
  .mobile-drawer-overlay.open{display:block;}
  .catalog-grid{grid-template-columns:repeat(2,1fr);gap:16px;}
}
@media(max-width:550px){
  .catalog-grid{grid-template-columns:1fr;}
  .cat-prop-img-wrap{height:200px;}
}
`;

/* ─────────────────────────────────────────────
   COMPONENTE
───────────────────────────────────────────── */
export default function Catalog() {
    const [searchParams] = useSearchParams();
    const [allProps, setAllProps] = useState([]);

    useEffect(() => {
        const load = async () => {
            const { data } = await supabase
                .from('properties')
                .select('*')
                .eq('publicado', true)
                .order('created_at', { ascending: false });
            setAllProps(data || []);
        };
        load();
    }, []);

    // Filters
    const [search, setSearch] = useState('');
    const [operacion, setOperacion] = useState([]);
    const [tipos, setTipos] = useState(() => {
        const t = searchParams.get('tipo');
        return t ? [t] : [];
    });
    const [ubicaciones] = useState([]);
    const [ambientes, setAmbientes] = useState([]);
    const [dormitorios, setDormitorios] = useState([]);
    const [precioMin, setPrecioMin] = useState('');
    const [precioMax, setPrecioMax] = useState(() => {
        const p = searchParams.get('precio');
        if (p === 'Hasta USD 80.000') return '80000';
        if (p === 'Hasta USD 150.000') return '150000';
        if (p === 'Hasta USD 250.000') return '250000';
        if (p === 'Hasta USD 400.000') return '400000';
        return '';
    });
    const [m2Min, setM2Min] = useState('');
    const [m2Max, setM2Max] = useState('');
    const [cochera, setCochera] = useState(false);
    const [orden, setOrden] = useState('recientes');
    const [sortOpen, setSortOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const sortRef = useRef(null);
    const gridRef = useRef(null);

    // Inject CSS
    useEffect(() => {
        if (document.getElementById('catalog-css')) return;
        const s = document.createElement('style');
        s.id = 'catalog-css';
        s.textContent = CSS;
        document.head.appendChild(s);
        return () => { const el = document.getElementById('catalog-css'); if (el) el.remove(); };
    }, []);

    // Close sort dropdown on outside click
    useEffect(() => {
        const h = e => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    // Block scroll when drawer open
    useEffect(() => {
        document.body.style.overflow = drawerOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen]);

    // GSAP grid animation
    useEffect(() => {
        if (!gridRef.current) return;
        const cards = gridRef.current.querySelectorAll('.cat-prop-card');
        gsap.fromTo(cards, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' });
    }, [search, operacion, tipos, ambientes, dormitorios, precioMin, precioMax, m2Min, m2Max, cochera, orden]);

    // Toggle array
    const toggle = (arr, setArr, val) => {
        setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
    };

    // Clear all
    const clearAll = () => {
        setSearch(''); setOperacion([]); setTipos([]); setAmbientes([]); setDormitorios([]);
        setPrecioMin(''); setPrecioMax(''); setM2Min(''); setM2Max(''); setCochera(false); setOrden('recientes');
    };

    const hasFilters = search || operacion.length || tipos.length || ambientes.length || dormitorios.length || precioMin || precioMax || m2Min || m2Max || cochera;

    // Filter
    const filtered = useMemo(() => {
        let result = [...allProps];
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(p => p.titulo.toLowerCase().includes(q) || p.zona.toLowerCase().includes(q) || p.tipo.toLowerCase().includes(q));
        }
        if (operacion.length) result = result.filter(p => operacion.includes(p.operacion));
        if (tipos.length) result = result.filter(p => tipos.includes(p.tipo));
        if (ubicaciones.length) result = result.filter(p => ubicaciones.includes(p.zona));
        if (ambientes.length) result = result.filter(p => ambientes.includes(p.ambientes));
        if (dormitorios.length) result = result.filter(p => dormitorios.includes(p.dormitorios));
        if (precioMin) result = result.filter(p => p.precio >= Number(precioMin));
        if (precioMax) result = result.filter(p => p.precio <= Number(precioMax));
        if (m2Min) result = result.filter(p => p.m2_cubiertos >= Number(m2Min));
        if (m2Max) result = result.filter(p => p.m2_cubiertos <= Number(m2Max));
        if (cochera) result = result.filter(p => p.cochera);

        if (orden === 'precio-asc') result.sort((a, b) => a.precio - b.precio);
        else if (orden === 'precio-desc') result.sort((a, b) => b.precio - a.precio);
        else if (orden === 'm2-desc') result.sort((a, b) => b.m2_cubiertos - a.m2_cubiertos);

        return result;
    }, [allProps, search, operacion, tipos, ambientes, dormitorios, precioMin, precioMax, m2Min, m2Max, cochera, orden]);

    // Active filters for tag display
    const activeFilters = [];
    operacion.forEach(v => activeFilters.push({ label: v, clear: () => toggle(operacion, setOperacion, v) }));
    tipos.forEach(v => activeFilters.push({ label: v, clear: () => toggle(tipos, setTipos, v) }));

    if (cochera) activeFilters.push({ label: 'Con cochera', clear: () => setCochera(false) });

    const formatPrice = (p) => {
        if (p.moneda === 'USD') return `USD ${p.precio.toLocaleString('es-AR')}`;
        return `$${p.precio.toLocaleString('es-AR')}/mes`;
    };

    // Filter panel content (reused for sidebar and drawer)
    const FiltersContent = () => (
        <>
            {/* Búsqueda */}
            <div className="filter-search">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" /><path d="M11 11l3.5 3.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" /></svg>
                <input type="text" placeholder="Buscar propiedad..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Operación */}
            <div className="filter-section">
                <div className="filter-title">Operación</div>
                <div className="filter-chips">
                    {OPERACIONES.map(o => (<div key={o} className={`filter-chip${operacion.includes(o) ? ' active' : ''}`} onClick={() => toggle(operacion, setOperacion, o)}>{o}</div>))}
                </div>
            </div>

            {/* Tipo */}
            <div className="filter-section">
                <div className="filter-title">Tipo de propiedad</div>
                <div className="filter-chips">
                    {TIPOS.map(t => (<div key={t} className={`filter-chip${tipos.includes(t) ? ' active' : ''}`} onClick={() => toggle(tipos, setTipos, t)}>{t}</div>))}
                </div>
            </div>



            {/* Ambientes */}
            <div className="filter-section">
                <div className="filter-title">Ambientes</div>
                <div className="filter-num-chips">
                    {AMBIENTES_OPTS.map(n => (<div key={n} className={`filter-num${ambientes.includes(n) ? ' active' : ''}`} onClick={() => toggle(ambientes, setAmbientes, n)}>{n}{n === 6 ? '+' : ''}</div>))}
                </div>
            </div>

            {/* Dormitorios */}
            <div className="filter-section">
                <div className="filter-title">Dormitorios</div>
                <div className="filter-num-chips">
                    {DORMITORIOS_OPTS.map(n => (<div key={n} className={`filter-num${dormitorios.includes(n) ? ' active' : ''}`} onClick={() => toggle(dormitorios, setDormitorios, n)}>{n}{n === 5 ? '+' : ''}</div>))}
                </div>
            </div>

            {/* Precio */}
            <div className="filter-section">
                <div className="filter-title">Precio (USD)</div>
                <div className="filter-range-row">
                    <input type="number" className="filter-range-input" placeholder="Mín" value={precioMin} onChange={e => setPrecioMin(e.target.value)} />
                    <span className="filter-range-sep">—</span>
                    <input type="number" className="filter-range-input" placeholder="Máx" value={precioMax} onChange={e => setPrecioMax(e.target.value)} />
                </div>
            </div>

            {/* Superficie */}
            <div className="filter-section">
                <div className="filter-title">Superficie (m²)</div>
                <div className="filter-range-row">
                    <input type="number" className="filter-range-input" placeholder="Mín" value={m2Min} onChange={e => setM2Min(e.target.value)} />
                    <span className="filter-range-sep">—</span>
                    <input type="number" className="filter-range-input" placeholder="Máx" value={m2Max} onChange={e => setM2Max(e.target.value)} />
                </div>
            </div>

            {/* Cochera */}
            <div className="filter-section">
                <div className="filter-check" onClick={() => setCochera(!cochera)}>
                    <div className={`filter-check-box${cochera ? ' active' : ''}`}>
                        {cochera && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                    <span className="filter-check-label">Con cochera</span>
                </div>
            </div>

            {/* Limpiar */}
            {hasFilters && (
                <div className="filter-actions">
                    <button className="filter-clear" onClick={clearAll}>Limpiar filtros</button>
                </div>
            )}
        </>
    );

    return (
        <div className="catalog-page">
            <div className="catalog-layout">
                {/* Sidebar desktop */}
                <aside className="catalog-sidebar">
                    <FiltersContent />
                </aside>

                {/* Main */}
                <main>
                    <div className="catalog-top">
                        <div className="catalog-count">
                            <strong>{filtered.length}</strong> propiedad{filtered.length !== 1 ? 'es' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
                        </div>
                        <div className={`catalog-sort${sortOpen ? ' open' : ''}`} ref={sortRef}>
                            <button className="catalog-sort-btn" onClick={() => setSortOpen(!sortOpen)}>
                                {ORDEN_OPTS.find(o => o.value === orden)?.label}
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" /></svg>
                            </button>
                            <div className="catalog-sort-drop">
                                {ORDEN_OPTS.map(o => (
                                    <div key={o.value} className={`catalog-sort-opt${orden === o.value ? ' active' : ''}`} onClick={() => { setOrden(o.value); setSortOpen(false); }}>{o.label}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Active filter tags */}
                    {activeFilters.length > 0 && (
                        <div className="active-filters">
                            {activeFilters.map((f, i) => (
                                <div key={i} className="active-filter-tag" onClick={f.clear}>
                                    {f.label}
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="#C9A84C" strokeWidth="1.3" strokeLinecap="round" /></svg>
                                </div>
                            ))}
                            <div className="active-filter-tag" onClick={clearAll} style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)' }}>
                                Limpiar todo ✕
                            </div>
                        </div>
                    )}

                    {/* Grid */}
                    <div className="catalog-grid" ref={gridRef}>
                        {filtered.length > 0 ? filtered.map(p => (
                            <Link to={`/propiedad/${p.id}`} key={p.id} className="cat-prop-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="cat-prop-img-wrap">
                                    <img className="cat-prop-img" src={p.imagenes?.[0] || 'https://via.placeholder.com/700x500?text=Sin+Imagen'} alt={p.titulo} loading="lazy" />
                                    <div className="cat-prop-img-overlay" />
                                    <div className="cat-prop-tag">{p.tipo}</div>
                                    <div className="cat-prop-op-tag">{p.operacion}</div>
                                </div>
                                <div className="cat-prop-body">
                                    <div className="cat-prop-price">{formatPrice(p)}</div>
                                    <div className="cat-prop-title">{p.titulo}</div>
                                    <div className="cat-prop-zona">
                                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 00-3.5 3.5C2.5 7.5 6 11 6 11s3.5-3.5 3.5-6.5A3.5 3.5 0 006 1zm0 4.5a1 1 0 110-2 1 1 0 010 2z" fill="rgba(255,255,255,0.35)" /></svg>
                                        {p.zona}, la Patagonia Argentina
                                    </div>
                                    <div className="cat-prop-stats">
                                        {p.dormitorios > 0 && <span className="cat-prop-stat"><strong>{p.dormitorios}</strong> dorm.</span>}
                                        {p.banos > 0 && <span className="cat-prop-stat"><strong>{p.banos}</strong> baño{p.banos > 1 ? 's' : ''}</span>}
                                        <span className="cat-prop-stat"><strong>{p.m2_cubiertos}</strong> m²</span>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className="catalog-empty">
                                <h3>No encontramos propiedades</h3>
                                <p>Probá ajustando los filtros o buscando con otros términos.</p>
                                <button className="filter-clear" style={{ marginTop: 20, display: 'inline-block' }} onClick={clearAll}>Limpiar filtros</button>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Mobile filter button */}
            <button className="mobile-filter-btn" onClick={() => setDrawerOpen(true)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="#0a0800" strokeWidth="1.5" strokeLinecap="round" /></svg>
                Filtros{hasFilters ? ` (${activeFilters.length})` : ''}
            </button>

            {/* Mobile drawer */}
            <div className={`mobile-drawer-overlay${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(false)} />
            <div className={`mobile-drawer${drawerOpen ? ' open' : ''}`}>
                <div className="mobile-drawer-header">
                    <span className="mobile-drawer-title">Filtros</span>
                    <button className="mobile-drawer-close" onClick={() => setDrawerOpen(false)}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </button>
                </div>
                <FiltersContent />
                <div className="mobile-drawer-apply">
                    <button onClick={() => setDrawerOpen(false)}>Ver {filtered.length} propiedad{filtered.length !== 1 ? 'es' : ''}</button>
                </div>
            </div>
        </div>
    );
}