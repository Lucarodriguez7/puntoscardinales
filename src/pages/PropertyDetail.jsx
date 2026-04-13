import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import gsap from 'gsap';

import { supabase } from '../lib/supabaseClient';

const WA = 'https://wa.me/5492945441507';

/* ─────────────────────────────────────────────
   CSS
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');
.pd-page{min-height:100vh;background:#050508;font-family:'Montserrat',sans-serif;padding-top:100px;padding-bottom:80px;}
.pd-inner{max-width:1320px;margin:0 auto;padding:0 40px;}
.pd-back{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.45);background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;text-decoration:none;transition:all .3s;margin-bottom:32px;}
.pd-back:hover{border-color:rgba(201,168,76,0.3);color:#C9A84C;}

/* Gallery */
.pd-gallery{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:320px 160px;gap:8px;border-radius:14px;overflow:hidden;margin-bottom:40px;}
.pd-gallery-main{grid-row:1/3;position:relative;overflow:hidden;cursor:pointer;}
.pd-gallery-main img{width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.16,1,.3,1);}
.pd-gallery-main:hover img{transform:scale(1.04);}
.pd-gallery-thumb{position:relative;overflow:hidden;cursor:pointer;}
.pd-gallery-thumb img{width:100%;height:100%;object-fit:cover;transition:transform .5s;opacity:.85;}
.pd-gallery-thumb:hover img{transform:scale(1.05);opacity:1;}
.pd-gallery-count{position:absolute;bottom:12px;right:12px;padding:6px 14px;background:rgba(5,5,8,0.75);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.1);border-radius:6px;font-size:11px;font-weight:500;color:rgba(255,255,255,0.7);cursor:pointer;}

/* ═══ LIGHTBOX ═══ */
.pd-lb-overlay{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.95);display:none;flex-direction:column;align-items:center;justify-content:center;padding:60px 80px;}
.pd-lb-overlay.open{display:flex;}
.pd-lb-close{position:absolute;top:24px;right:24px;width:50px;height:50px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .25s;z-index:3;}
.pd-lb-close:hover{background:rgba(201,168,76,0.2);border-color:rgba(201,168,76,0.5);}
.pd-lb-counter{position:absolute;top:28px;left:50%;transform:translateX(-50%);font-size:13px;font-weight:500;color:rgba(255,255,255,0.4);letter-spacing:2px;z-index:3;}
.pd-lb-img-wrap{flex:1;display:flex;align-items:center;justify-content:center;width:100%;max-height:100%;overflow:hidden;}
.pd-lb-img-wrap img{max-width:100%;max-height:75vh;object-fit:contain;border-radius:8px;box-shadow:0 20px 80px rgba(0,0,0,0.5);display:block;}
.pd-lb-nav{position:absolute;top:50%;transform:translateY(-50%);width:54px;height:54px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .25s;z-index:3;}
.pd-lb-nav:hover{background:rgba(201,168,76,0.15);border-color:rgba(201,168,76,0.4);}
.pd-lb-prev{left:24px;}
.pd-lb-next{right:24px;}
.pd-lb-dots{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);display:flex;gap:10px;z-index:3;}
.pd-lb-dot{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;cursor:pointer;padding:0;transition:all .25s;}
.pd-lb-dot.active{background:#C9A84C;box-shadow:0 0 10px rgba(201,168,76,0.5);transform:scale(1.2);}

/* Layout */
.pd-layout{display:grid;grid-template-columns:1fr 360px;gap:48px;}
.pd-tags{display:flex;gap:8px;margin-bottom:16px;}
.pd-tag{padding:5px 14px;font-size:9px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;border-radius:5px;}
.pd-tag-op{background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8);background-size:200%;animation:pdGold 4s ease infinite;color:#0a0800;}
.pd-tag-tipo{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);}
.pd-price{font-size:clamp(28px,3vw,40px);font-weight:800;line-height:1;margin-bottom:8px;background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8,#C9A84C);background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:pdGold 5s ease infinite;}
.pd-title{font-size:clamp(20px,2.5vw,28px);font-weight:700;color:#fff;margin-bottom:6px;}
.pd-location{font-size:13px;font-weight:300;color:rgba(255,255,255,0.4);display:flex;align-items:center;gap:6px;margin-bottom:32px;}
.pd-chars{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:36px;}
.pd-char{padding:18px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(201,168,76,0.08);border-radius:10px;text-align:center;transition:border-color .3s;}
.pd-char:hover{border-color:rgba(201,168,76,0.25);}
.pd-char-val{font-size:20px;font-weight:800;color:#fff;margin-bottom:4px;}
.pd-char-label{font-size:9px;font-weight:500;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,0.35);}
.pd-details{display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;padding:24px 0;border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);margin-bottom:36px;}
.pd-detail{display:flex;justify-content:space-between;padding:8px 0;}
.pd-detail-label{font-size:12px;font-weight:400;color:rgba(255,255,255,0.35);}
.pd-detail-val{font-size:12px;font-weight:600;color:rgba(255,255,255,0.7);}
.pd-desc-title{font-size:16px;font-weight:700;color:#fff;margin-bottom:14px;}
.pd-desc{font-size:14px;font-weight:300;color:rgba(255,255,255,0.5);line-height:1.9;margin-bottom:48px;}
.pd-maps-title{font-size:16px;font-weight:700;color:#fff;margin-bottom:18px;}
.pd-maps{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:48px;}
.pd-map-wrap{border-radius:12px;overflow:hidden;border:1px solid rgba(201,168,76,0.1);height:300px;}
.pd-map-wrap iframe{width:100%;height:100%;border:none;}
.pd-map-label{font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(201,168,76,0.5);margin-bottom:8px;}
.pd-similar-title{font-size:16px;font-weight:700;color:#fff;margin-bottom:20px;}
.pd-similar-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.pd-sim-card{background:rgba(255,255,255,0.02);border:1px solid rgba(201,168,76,0.08);border-radius:10px;overflow:hidden;transition:all .4s;text-decoration:none;display:block;}
.pd-sim-card:hover{border-color:rgba(201,168,76,0.25);transform:translateY(-4px);}
.pd-sim-img{height:160px;overflow:hidden;}
.pd-sim-img img{width:100%;height:100%;object-fit:cover;transition:transform .6s;}
.pd-sim-card:hover .pd-sim-img img{transform:scale(1.05);}
.pd-sim-body{padding:16px 18px;}
.pd-sim-price{font-size:16px;font-weight:800;background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8,#C9A84C);background-size:300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:pdGold 5s ease infinite;margin-bottom:4px;}
.pd-sim-name{font-size:12px;font-weight:600;color:rgba(255,255,255,0.7);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.pd-sim-zona{font-size:10px;font-weight:300;color:rgba(255,255,255,0.35);}

/* Contact */
.pd-contact{position:sticky;top:110px;background:rgba(255,255,255,0.03);border:1px solid rgba(201,168,76,0.12);border-radius:14px;padding:28px 24px;align-self:start;}
.pd-contact-title{font-size:14px;font-weight:700;color:#fff;margin-bottom:6px;}
.pd-contact-sub{font-size:12px;font-weight:300;color:rgba(255,255,255,0.4);margin-bottom:24px;line-height:1.6;}
.pd-contact-wa{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:14px;background:linear-gradient(135deg,#25D366,#128C7E);border:none;border-radius:10px;color:#fff;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;cursor:pointer;transition:all .25s;text-decoration:none;margin-bottom:20px;}
.pd-contact-wa:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(37,211,102,0.3);}
.pd-contact-divider{height:1px;background:rgba(255,255,255,0.06);margin:20px 0;position:relative;}
.pd-contact-divider span{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#0a0a10;padding:0 12px;font-size:10px;font-weight:500;color:rgba(255,255,255,0.25);text-transform:uppercase;letter-spacing:1px;}
.pd-form-group{margin-bottom:14px;}
.pd-form-label{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:6px;display:block;}
.pd-form-input{width:100%;padding:12px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;color:#fff;font-family:'Montserrat',sans-serif;font-size:12px;outline:none;transition:border-color .3s;resize:none;}
.pd-form-input::placeholder{color:rgba(255,255,255,0.2);}
.pd-form-input:focus{border-color:rgba(201,168,76,0.4);}
.pd-form-submit{width:100%;padding:13px;background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8,#C9A84C);background-size:300% 300%;animation:pdGold 5s ease infinite;border:none;border-radius:8px;color:#0a0800;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .25s;margin-top:6px;}
.pd-form-submit:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(201,168,76,0.35);}

@keyframes pdGold{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}

@media(max-width:1024px){
  .pd-layout{grid-template-columns:1fr;}.pd-contact{position:static;max-width:500px;}
  .pd-gallery{grid-template-rows:280px 140px;}
  .pd-lb-overlay{padding:40px 20px;}
  .pd-lb-prev{left:12px;}.pd-lb-next{right:12px;}
}
@media(max-width:768px){
  .pd-inner{padding:0 20px;}
  .pd-gallery{grid-template-columns:1fr;grid-template-rows:260px;}.pd-gallery-main{grid-row:auto;}
  .pd-gallery-thumb{display:none;}
  .pd-maps{grid-template-columns:1fr;}
  .pd-similar-grid{grid-template-columns:1fr 1fr;gap:14px;}
  .pd-chars{grid-template-columns:repeat(2,1fr);}
  .pd-details{grid-template-columns:1fr;}
  .pd-lb-nav{width:42px;height:42px;}
  .pd-lb-prev{left:8px;}.pd-lb-next{right:8px;}
}
@media(max-width:480px){
  .pd-similar-grid{grid-template-columns:1fr;}
  .pd-lb-overlay{padding:20px 10px;}
}
`;

/* ─────────────────────────────────────────────
   COMPONENTE
───────────────────────────────────────────── */
export default function PropertyDetail() {
    const { id } = useParams();
    const [prop, setProp] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);

    const [lightbox, setLightbox] = useState(false);
    const [lbIdx, setLbIdx] = useState(0);
    const [formData, setFormData] = useState({ nombre: '', telefono: '', mensaje: '' });
    const pageRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('properties')
                .select('*')
                .eq('id', id)
                .single();
            setProp(data);
            if (data) {
                const { data: sim } = await supabase
                    .from('properties')
                    .select('*')
                    .eq('publicado', true)
                    .neq('id', id)
                    .or(`tipo.eq.${data.tipo},zona.eq.${data.zona}`)
                    .limit(3);
                setSimilar(sim || []);
            }
            setLoading(false);
        };
        load();
    }, [id]);

    useEffect(() => {
        if (document.getElementById('pd-css')) return;
        const s = document.createElement('style'); s.id = 'pd-css'; s.textContent = CSS;
        document.head.appendChild(s);
        return () => { const el = document.getElementById('pd-css'); if (el) el.remove(); };
    }, []);

    useEffect(() => { window.scrollTo(0, 0); }, [id]);

    useEffect(() => {
        if (!pageRef.current) return;
        gsap.fromTo(pageRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    }, [id]);

    // Lightbox keyboard + body lock
    useEffect(() => {
        if (!lightbox || !prop) return;
        const h = e => {
            if (e.key === 'Escape') setLightbox(false);
            if (e.key === 'ArrowRight') setLbIdx(i => (i + 1) % (prop.imagenes?.length || 1));
            if (e.key === 'ArrowLeft') setLbIdx(i => (i - 1 + (prop.imagenes?.length || 1)) % (prop.imagenes?.length || 1));
        };
        window.addEventListener('keydown', h);
        document.body.style.overflow = 'hidden';
        return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; };
    }, [lightbox, prop]);

    if (loading) return (
        <div className="pd-page">
            <div className="pd-inner" style={{ textAlign: 'center', paddingTop: 80 }}>
                <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>Cargando...</h2>
            </div>
        </div>
    );

    if (!prop) return (
        <div className="pd-page"><div className="pd-inner" style={{ textAlign: 'center', paddingTop: 80 }}>
            <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Propiedad no encontrada</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>La propiedad que buscás no existe o fue removida.</p>
            <Link to="/propiedades" className="pd-back">← Volver al catálogo</Link>
        </div></div>
    );

    const fmtPrice = () => prop.moneda === 'USD' ? `USD ${prop.precio.toLocaleString('es-AR')}` : `$${prop.precio.toLocaleString('es-AR')}/mes`;
    const waMsg = `Hola, me interesa la propiedad: ${prop.titulo} (${fmtPrice()}) - ${prop.direccion}, ${prop.zona}`;

    const handleForm = () => {
        const msg = `Consulta desde web:%0A%0ANombre: ${formData.nombre}%0ATeléfono: ${formData.telefono}%0AMensaje: ${formData.mensaje}%0A%0APropiedad: ${prop.titulo} (${fmtPrice()})`;
        window.open(`${WA}?text=${msg}`, '_blank');
    };

    const openLb = (idx) => { setLbIdx(idx); setLightbox(true); };

    const mapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${prop.lng}!3d${prop.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sar!4v1`;
    const streetUrl = `https://www.google.com/maps/embed?pb=!4v1!6m8!1m7!1s!2m2!1d${prop.lat}!2d${prop.lng}!3f0!4f0!5f0.7820865974627469`;

    return (
        <>
            <div className="pd-page" ref={pageRef}>
                <div className="pd-inner">
                    <Link to="/propiedades" className="pd-back">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Volver al catálogo
                    </Link>

                    {/* Gallery */}
                    <div className="pd-gallery">
                        <div className="pd-gallery-main" onClick={() => openLb(0)}>
                            <img src={prop.imagenes?.[0] || 'https://via.placeholder.com/900x600?text=Sin+Imagen'} alt={prop.titulo} />
                        </div>
                        {prop.imagenes?.slice(1, 3).map((img, i) => (
                            <div key={i} className="pd-gallery-thumb" onClick={() => openLb(i + 1)}>
                                <img src={img} alt="" />
                                {i === 1 && prop.imagenes.length > 3 && <div className="pd-gallery-count">+{prop.imagenes.length - 3} fotos</div>}
                            </div>
                        ))}
                    </div>

                    {/* Layout */}
                    <div className="pd-layout">
                        <div>
                            <div className="pd-tags">
                                <span className="pd-tag pd-tag-op">{prop.operacion}</span>
                                <span className="pd-tag pd-tag-tipo">{prop.tipo}</span>
                            </div>
                            <div className="pd-price">{fmtPrice()}</div>
                            <h1 className="pd-title">{prop.titulo}</h1>
                            <div className="pd-location">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 00-3.5 3.5C2.5 7.5 6 11 6 11s3.5-3.5 3.5-6.5A3.5 3.5 0 006 1zm0 4.5a1 1 0 110-2 1 1 0 010 2z" fill="rgba(255,255,255,0.35)" /></svg>
                                {prop.direccion}, {prop.zona}, la Patagonia Argentina
                            </div>
                            <div className="pd-chars">
                                {prop.m2_cubiertos > 0 && <div className="pd-char"><div className="pd-char-val">{prop.m2_cubiertos}</div><div className="pd-char-label">m² cubiertos</div></div>}
                                {prop.m2_lote > 0 && <div className="pd-char"><div className="pd-char-val">{prop.m2_lote}</div><div className="pd-char-label">m² lote</div></div>}
                                {prop.dormitorios > 0 && <div className="pd-char"><div className="pd-char-val">{prop.dormitorios}</div><div className="pd-char-label">Dormitorios</div></div>}
                                {prop.banos > 0 && <div className="pd-char"><div className="pd-char-val">{prop.banos}</div><div className="pd-char-label">Baños</div></div>}
                                {prop.ambientes > 0 && <div className="pd-char"><div className="pd-char-val">{prop.ambientes}</div><div className="pd-char-label">Ambientes</div></div>}
                                {prop.cochera && <div className="pd-char"><div className="pd-char-val">Sí</div><div className="pd-char-label">Cochera</div></div>}
                            </div>
                            <div className="pd-details">
                                <div className="pd-detail"><span className="pd-detail-label">Antigüedad</span><span className="pd-detail-val">{prop.antiguedad}</span></div>
                                <div className="pd-detail"><span className="pd-detail-label">Estado</span><span className="pd-detail-val">{prop.estado}</span></div>
                                <div className="pd-detail"><span className="pd-detail-label">Orientación</span><span className="pd-detail-val">{prop.orientacion}</span></div>
                                <div className="pd-detail"><span className="pd-detail-label">Pisos</span><span className="pd-detail-val">{prop.pisos || '-'}</span></div>
                                <div className="pd-detail"><span className="pd-detail-label">Operación</span><span className="pd-detail-val">{prop.operacion}</span></div>
                                <div className="pd-detail"><span className="pd-detail-label">Zona</span><span className="pd-detail-val">{prop.zona}</span></div>
                            </div>
                            <h3 className="pd-desc-title">Descripción</h3>
                            <p className="pd-desc">{prop.descripcion}</p>
                            <h3 className="pd-maps-title">Ubicación</h3>
                            <div className="pd-maps">
                                <div><div className="pd-map-label">Mapa</div><div className="pd-map-wrap"><iframe src={mapUrl} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Mapa" /></div></div>
                                <div><div className="pd-map-label">Street View</div><div className="pd-map-wrap"><iframe src={streetUrl} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Street View" /></div></div>
                            </div>
                            {similar.length > 0 && <>
                                <h3 className="pd-similar-title">Propiedades similares</h3>
                                <div className="pd-similar-grid">
                                    {similar.map(s => (
                                        <Link key={s.id} to={`/propiedad/${s.id}`} className="pd-sim-card">
                                            <div className="pd-sim-img"><img src={s.imagenes?.[0] || 'https://via.placeholder.com/400x300'} alt={s.titulo} loading="lazy" /></div>
                                            <div className="pd-sim-body">
                                                <div className="pd-sim-price">{s.moneda === 'USD' ? `USD ${s.precio.toLocaleString('es-AR')}` : `$${s.precio.toLocaleString('es-AR')}/mes`}</div>
                                                <div className="pd-sim-name">{s.titulo}</div>
                                                <div className="pd-sim-zona">{s.zona}, la Patagonia Argentina</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </>}
                        </div>

                        <aside className="pd-contact">
                            <div className="pd-contact-title">¿Te interesa esta propiedad?</div>
                            <div className="pd-contact-sub">Escribinos y recibí información detallada al instante. Sin esperas.</div>
                            <a href={`${WA}?text=${encodeURIComponent(waMsg)}`} target="_blank" rel="noreferrer" className="pd-contact-wa">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.025.506 3.932 1.395 5.608L.054 23.395a.5.5 0 00.611.586l5.584-1.468A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.332-1.546l-.382-.228-3.32.873.884-3.236-.253-.4A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>
                                Consultar por WhatsApp
                            </a>
                            <div className="pd-contact-divider"><span>o dejá tus datos</span></div>
                            <div className="pd-form-group"><label className="pd-form-label">Nombre</label><input className="pd-form-input" placeholder="Tu nombre" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} /></div>
                            <div className="pd-form-group"><label className="pd-form-label">Teléfono</label><input className="pd-form-input" placeholder="Tu teléfono" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} /></div>
                            <div className="pd-form-group"><label className="pd-form-label">Mensaje</label><textarea className="pd-form-input" rows={3} placeholder="Quisiera más información sobre esta propiedad..." value={formData.mensaje} onChange={e => setFormData({ ...formData, mensaje: e.target.value })} /></div>
                            <button className="pd-form-submit" onClick={handleForm}>Enviar consulta</button>
                        </aside>
                    </div>
                </div>
            </div>

            {/* ═══ LIGHTBOX ═══ rendered OUTSIDE pd-page, at root level */}
            {lightbox && (
                <div className="pd-lb-overlay open" onClick={() => setLightbox(false)}>
                    <div className="pd-lb-counter">{lbIdx + 1} / {prop.imagenes?.length || 1}</div>
                    <button className="pd-lb-close" onClick={() => setLightbox(false)}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4l10 10M14 4L4 14" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </button>
                    <div className="pd-lb-img-wrap" onClick={e => e.stopPropagation()}>
                        <img src={prop.imagenes?.[lbIdx] || 'https://via.placeholder.com/900x600?text=Sin+Imagen'} alt={prop.titulo} />
                    </div>
                    <button className="pd-lb-nav pd-lb-prev" onClick={e => { e.stopPropagation(); setLbIdx(i => (i - 1 + (prop.imagenes?.length || 1)) % (prop.imagenes?.length || 1)); }}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <button className="pd-lb-nav pd-lb-next" onClick={e => { e.stopPropagation(); setLbIdx(i => (i + 1) % (prop.imagenes?.length || 1)); }}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 4l5 5-5 5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <div className="pd-lb-dots">
                        {(prop.imagenes || []).map((_, i) => <button key={i} className={`pd-lb-dot${i === lbIdx ? ' active' : ''}`} onClick={e => { e.stopPropagation(); setLbIdx(i); }} />)}
                    </div>
                </div>
            )}
        </>
    );
}