import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const WA = 'https://wa.me/5492945441507';
const IG = 'https://www.instagram.com/Puntos Cardinalespropiedades';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');
.ct-page{min-height:100vh;background:#050508;font-family:'Montserrat',sans-serif;padding-top:100px;padding-bottom:80px;}
.ct-inner{max-width:1100px;margin:0 auto;padding:0 40px;}

/* Header */
.ct-header{text-align:center;padding:60px 0 64px;}
.ct-header-label{display:inline-flex;align-items:center;gap:10px;padding:8px 20px;border:1px solid rgba(201,168,76,0.2);border-radius:40px;margin-bottom:24px;font-size:10px;font-weight:600;letter-spacing:.25em;text-transform:uppercase;color:rgba(201,168,76,0.7);}
.ct-header-dot{width:6px;height:6px;border-radius:50%;background:#C9A84C;box-shadow:0 0 8px rgba(201,168,76,0.6);}
.ct-header h1{font-size:clamp(28px,4.5vw,48px);font-weight:800;color:#fff;line-height:1.1;margin-bottom:14px;}
.ct-header h1 .gt{background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8,#C9A84C);background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:ctGold 5s ease infinite;}
.ct-header p{font-size:15px;font-weight:300;color:rgba(255,255,255,0.45);max-width:480px;margin:0 auto;line-height:1.8;}

/* Layout */
.ct-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-bottom:64px;}

/* Contact info */
.ct-info{display:flex;flex-direction:column;gap:24px;}
.ct-card{padding:28px;background:rgba(255,255,255,0.02);border:1px solid rgba(201,168,76,0.08);border-radius:14px;transition:all .3s;display:flex;align-items:flex-start;gap:18px;text-decoration:none;cursor:pointer;}
.ct-card:hover{border-color:rgba(201,168,76,0.25);transform:translateY(-3px);box-shadow:0 16px 48px rgba(0,0,0,0.3);}
.ct-card-ico{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .3s;}
.ct-card-ico-wa{background:rgba(37,211,102,0.1);border:1px solid rgba(37,211,102,0.2);}
.ct-card:hover .ct-card-ico-wa{background:rgba(37,211,102,0.2);}
.ct-card-ico-phone{background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.15);}
.ct-card:hover .ct-card-ico-phone{background:rgba(201,168,76,0.15);}
.ct-card-ico-ig{background:rgba(225,48,108,0.08);border:1px solid rgba(225,48,108,0.15);}
.ct-card:hover .ct-card-ico-ig{background:rgba(225,48,108,0.15);}
.ct-card-ico-loc{background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.15);}
.ct-card-body h3{font-size:14px;font-weight:700;color:#fff;margin-bottom:4px;}
.ct-card-body p{font-size:12px;font-weight:300;color:rgba(255,255,255,0.4);line-height:1.6;}
.ct-card-body span{font-size:13px;font-weight:500;color:rgba(255,255,255,0.6);}

/* Form */
.ct-form-wrap{background:rgba(255,255,255,0.02);border:1px solid rgba(201,168,76,0.1);border-radius:18px;padding:36px 32px;}
.ct-form-title{font-size:18px;font-weight:700;color:#fff;margin-bottom:6px;}
.ct-form-sub{font-size:12px;font-weight:300;color:rgba(255,255,255,0.35);margin-bottom:28px;}
.ct-form-group{margin-bottom:18px;}
.ct-form-label{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:6px;display:block;}
.ct-form-input{width:100%;padding:14px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#fff;font-family:'Montserrat',sans-serif;font-size:13px;outline:none;transition:border-color .3s;resize:none;}
.ct-form-input::placeholder{color:rgba(255,255,255,0.2);}
.ct-form-input:focus{border-color:rgba(201,168,76,0.4);}
.ct-form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.ct-form-submit{width:100%;padding:15px;background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8,#C9A84C);background-size:300% 300%;animation:ctGold 5s ease infinite;border:none;border-radius:10px;color:#0a0800;font-family:'Montserrat',sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .25s;margin-top:8px;position:relative;overflow:hidden;}
.ct-form-submit::before{content:'';position:absolute;top:-60%;left:-120%;width:60%;height:220%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent);transform:skewX(-18deg);animation:ctShimmer 3.5s ease infinite;}
.ct-form-submit:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(201,168,76,0.4);}

/* Map */
.ct-map-wrap{border-radius:16px;overflow:hidden;border:1px solid rgba(201,168,76,0.1);height:320px;}
.ct-map-wrap iframe{width:100%;height:100%;border:none;}
.ct-map-label{font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(201,168,76,0.5);margin-bottom:10px;text-align:center;}

/* Divider */
.ct-divider{width:60px;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.3),transparent);margin:0 auto 48px;}

@keyframes ctGold{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes ctShimmer{0%{left:-120%}60%,100%{left:160%}}

@media(max-width:768px){
  .ct-inner{padding:0 20px;}
  .ct-grid{grid-template-columns:1fr;gap:32px;}
  .ct-form-row{grid-template-columns:1fr;}
  .ct-form-wrap{padding:28px 22px;}
}
`;

export default function Contacto() {
    const [form, setForm] = useState({ nombre: '', telefono: '', email: '', mensaje: '' });
    const [sent, setSent] = useState(false);
    const pageRef = useRef(null);

    useEffect(() => {
        if (document.getElementById('ct-css')) return;
        const s = document.createElement('style'); s.id = 'ct-css'; s.textContent = CSS;
        document.head.appendChild(s);
        return () => { const el = document.getElementById('ct-css'); if (el) el.remove(); };
    }, []);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    useEffect(() => {
        if (!pageRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo('.ct-header > *', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.2 });
            gsap.fromTo('.ct-card', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.5 });
            gsap.fromTo('.ct-form-wrap', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.6 });
            gsap.fromTo('.ct-map-wrap', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.8 });
        }, pageRef);
        return () => ctx.revert();
    }, []);

    const handleSubmit = () => {
        const msg = encodeURIComponent(
            `Consulta desde la web:\n\nNombre: ${form.nombre}\nTeléfono: ${form.telefono}\n${form.email ? `Email: ${form.email}\n` : ''}Mensaje: ${form.mensaje}`
        );
        window.open(`${WA}?text=${msg}`, '_blank');
        setSent(true);
        setTimeout(() => setSent(false), 4000);
    };

    const canSubmit = form.nombre && form.telefono && form.mensaje;

    return (
        <div className="ct-page" ref={pageRef}>
            <div className="ct-inner">
                {/* Header */}
                <div className="ct-header">
                    <div className="ct-header-label"><div className="ct-header-dot" /><span>Estamos para ayudarte</span></div>
                    <h1>Hablemos de tu <span className="gt">próximo paso</span></h1>
                    <p>Escribinos por WhatsApp, llamanos o completá el formulario. Respondemos en menos de 24 horas.</p>
                </div>

                {/* Grid */}
                <div className="ct-grid">
                    {/* Info cards */}
                    <div className="ct-info">
                        <a href={WA + '?text=Hola, quiero consultar sobre propiedades'} target="_blank" rel="noreferrer" className="ct-card">
                            <div className="ct-card-ico ct-card-ico-wa">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.025.506 3.932 1.395 5.608L.054 23.395a.5.5 0 00.611.586l5.584-1.468A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.332-1.546l-.382-.228-3.32.873.884-3.236-.253-.4A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>
                            </div>
                            <div className="ct-card-body">
                                <h3>WhatsApp</h3>
                                <span>+54 9 2945 441507</span>
                                <p>Respuesta inmediata. Escribinos y te atendemos al instante.</p>
                            </div>
                        </a>

                        <a href="tel:+5492945441507" className="ct-card">
                            <div className="ct-card-ico ct-card-ico-phone">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                            </div>
                            <div className="ct-card-body">
                                <h3>Teléfono</h3>
                                <span>+54 9 2945 441507</span>
                                <p>Llamanos de lunes a sábados de 9 a 18hs.</p>
                            </div>
                        </a>

                        <a href={IG} target="_blank" rel="noreferrer" className="ct-card">
                            <div className="ct-card-ico ct-card-ico-ig">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="#E1306C" stroke="none" /></svg>
                            </div>
                            <div className="ct-card-body">
                                <h3>Instagram</h3>
                                <span>@Puntos Cardinalespropiedades</span>
                                <p>Seguinos para ver las últimas propiedades y novedades.</p>
                            </div>
                        </a>

                        <div className="ct-card" style={{ cursor: 'default' }}>
                            <div className="ct-card-ico ct-card-ico-loc">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            </div>
                            <div className="ct-card-body">
                                <h3>Ubicación</h3>
                                <span>Gandhi 3800, Parque Camet</span>
                                <p>la Patagonia Argentina, Argentina</p>
                                <span style={{ fontSize: 12, marginTop: 8, display: 'block' }}>Av. Jara 599 esq. Ituzaingó</span>
                                <p>la Patagonia Argentina, Argentina</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="ct-form-wrap">
                        <div className="ct-form-title">Envianos tu consulta</div>
                        <div className="ct-form-sub">Te respondemos por WhatsApp con toda la información.</div>
                        <div className="ct-form-row">
                            <div className="ct-form-group">
                                <label className="ct-form-label">Nombre *</label>
                                <input className="ct-form-input" placeholder="Tu nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                            </div>
                            <div className="ct-form-group">
                                <label className="ct-form-label">Teléfono *</label>
                                <input className="ct-form-input" placeholder="Tu teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
                            </div>
                        </div>
                        <div className="ct-form-group">
                            <label className="ct-form-label">Email</label>
                            <input className="ct-form-input" type="email" placeholder="tu@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div className="ct-form-group">
                            <label className="ct-form-label">Mensaje *</label>
                            <textarea className="ct-form-input" rows={4} placeholder="¿En qué podemos ayudarte?" value={form.mensaje} onChange={e => setForm({ ...form, mensaje: e.target.value })} />
                        </div>
                        <button className="ct-form-submit" onClick={handleSubmit} disabled={!canSubmit} style={{ opacity: canSubmit ? 1 : 0.4, cursor: canSubmit ? 'pointer' : 'not-allowed' }}>
                            {sent ? '✓ Enviado' : 'Enviar consulta'}
                        </button>
                    </div>
                </div>

                {/* Map */}
                <div className="ct-divider" />
                <div className="ct-map-label">Nuestra ubicación</div>
                <div className="ct-map-wrap">
                    <iframe src="https://maps.google.com/maps?q=Gandhi+3800,+Mar+del+Plata,+Argentina&t=&z=16&ie=UTF8&iwloc=&output=embed" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Gandhi 3800, la Patagonia Argentina, Argentina" />
                </div>
            </div>
        </div>
    );
}