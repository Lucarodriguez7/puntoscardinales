import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WA = 'https://wa.me/5492945441507';

const MOTIVOS = [
    { id: 'vender', label: 'Vender', desc: 'Quiero tasar para poner en venta', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="1.5" /><path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.5" /></svg> },
    { id: 'alquilar', label: 'Alquilar', desc: 'Quiero saber el valor de alquiler', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" /></svg> },
    { id: 'valor', label: 'Conocer el valor', desc: 'Solo quiero saber cuánto vale', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg> },
];

const TIPOS = [
    { id: 'casa', label: 'Casa', icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M4 12l10-8 10 8v12a2 2 0 01-2 2H6a2 2 0 01-2-2V12z" stroke="currentColor" strokeWidth="1.3" /><path d="M10 26V18h8v8" stroke="currentColor" strokeWidth="1.3" /></svg> },
    { id: 'depto', label: 'Departamento', icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="4" width="20" height="22" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M10 9h3M15 9h3M10 14h3M15 14h3M10 19h3M15 19h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg> },
    { id: 'ph', label: 'PH', icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="10" width="10" height="16" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="15" y="4" width="10" height="22" rx="1" stroke="currentColor" strokeWidth="1.3" /><path d="M7 15h2M7 20h2M19 9h2M19 14h2M19 19h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg> },
    { id: 'terreno', label: 'Terreno', icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M2 22l6-8 5 4 4-6 6 4 3-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 22h24" stroke="currentColor" strokeWidth="1.3" /></svg> },
    { id: 'local', label: 'Local', icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="8" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M3 13h22M8 8V5M20 8V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg> },
    { id: 'oficina', label: 'Oficina', icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="6" y="3" width="16" height="23" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M10 8h3M15 8h3M10 12h3M15 12h3M10 16h3M15 16h3M11 22h6v4h-6z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg> },
];

const BENEFICIOS = [
    { title: 'Gratuita y sin compromiso', desc: 'La tasación no tiene costo. Conocé el valor real de tu propiedad sin obligación de venta ni contrato.', icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.3" /><path d="M8 11l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    { title: 'Basada en datos reales', desc: 'Analizamos ventas recientes, demanda actual y ubicación para darte un valor preciso y competitivo.', icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 16l4-4 3 3 4-5 5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    { title: 'En menos de 48hs', desc: 'Recibís el informe de tasación en tu WhatsApp o email en un plazo máximo de 48 horas hábiles.', icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.3" /><path d="M11 6v5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg> },
    { title: 'Asesoramiento incluido', desc: 'Te orientamos sobre el mejor momento para vender o alquilar según las condiciones del mercado.', icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg> },
];

/* ─────────────────────────────────────────────
   CSS
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');
.tas-page{min-height:100vh;background:#050508;font-family:'Montserrat',sans-serif;padding-top:100px;padding-bottom:80px;overflow-x:hidden;}
.tas-inner{max-width:1100px;margin:0 auto;padding:0 40px;}

/* Hero */
.tas-hero{text-align:center;padding:60px 0 80px;}
.tas-hero-label{display:inline-flex;align-items:center;gap:10px;padding:8px 20px;border:1px solid rgba(201,168,76,0.2);border-radius:40px;margin-bottom:28px;font-size:10px;font-weight:600;letter-spacing:.25em;text-transform:uppercase;color:rgba(201,168,76,0.7);}
.tas-hero-label-dot{width:6px;height:6px;border-radius:50%;background:#C9A84C;box-shadow:0 0 8px rgba(201,168,76,0.6);}
.tas-hero h1{font-size:clamp(28px,5vw,52px);font-weight:800;color:#fff;line-height:1.1;margin-bottom:16px;}
.tas-hero h1 .gt{background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8,#C9A84C);background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:tGold 5s ease infinite;}
.tas-hero p{font-size:15px;font-weight:300;color:rgba(255,255,255,0.45);max-width:560px;margin:0 auto;line-height:1.85;}

/* Benefits */
.tas-benefits{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:80px;}
.tas-benefit{padding:28px 24px;background:rgba(255,255,255,0.02);border:1px solid rgba(201,168,76,0.08);border-radius:12px;transition:all .3s;}
.tas-benefit:hover{border-color:rgba(201,168,76,0.25);transform:translateY(-4px);}
.tas-benefit-ico{width:44px;height:44px;border:1px solid rgba(201,168,76,0.15);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;color:#C9A84C;}
.tas-benefit h4{font-size:13px;font-weight:700;color:#fff;margin-bottom:8px;}
.tas-benefit p{font-size:12px;font-weight:300;color:rgba(255,255,255,0.4);line-height:1.7;}

/* Form wrapper */
.tas-form-wrap{background:rgba(255,255,255,0.02);border:1px solid rgba(201,168,76,0.1);border-radius:20px;padding:48px;position:relative;overflow:hidden;}
.tas-form-wrap::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);opacity:.3;}

/* Progress */
.tas-progress{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:40px;}
.tas-progress-step{width:36px;height:36px;border-radius:50%;border:1.5px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:rgba(255,255,255,0.25);transition:all .4s;}
.tas-progress-step.active{border-color:#C9A84C;color:#C9A84C;background:rgba(201,168,76,0.1);}
.tas-progress-step.done{border-color:#C9A84C;background:#C9A84C;color:#0a0800;}
.tas-progress-line{width:40px;height:1px;background:rgba(255,255,255,0.08);transition:background .4s;}
.tas-progress-line.done{background:#C9A84C;}

/* Step content */
.tas-step{display:none;flex-direction:column;align-items:center;}
.tas-step.active{display:flex;}
.tas-step-title{font-size:clamp(18px,3vw,26px);font-weight:700;color:#fff;text-align:center;margin-bottom:6px;}
.tas-step-sub{font-size:13px;font-weight:300;color:rgba(255,255,255,0.4);text-align:center;margin-bottom:36px;}

/* Option cards */
.tas-options{display:flex;flex-wrap:wrap;gap:16px;justify-content:center;margin-bottom:36px;}
.tas-option{padding:24px 28px;background:rgba(255,255,255,0.03);border:1.5px solid rgba(255,255,255,0.08);border-radius:14px;cursor:pointer;transition:all .3s;text-align:center;min-width:160px;flex:1;max-width:220px;user-select:none;}
.tas-option:hover{border-color:rgba(201,168,76,0.3);background:rgba(201,168,76,0.03);}
.tas-option.selected{border-color:#C9A84C;background:rgba(201,168,76,0.08);box-shadow:0 0 20px rgba(201,168,76,0.1);}
.tas-option-ico{color:rgba(255,255,255,0.35);margin-bottom:12px;transition:color .3s;display:flex;justify-content:center;}
.tas-option.selected .tas-option-ico{color:#C9A84C;}
.tas-option-label{font-size:14px;font-weight:600;color:rgba(255,255,255,0.7);margin-bottom:4px;transition:color .3s;}
.tas-option.selected .tas-option-label{color:#fff;}
.tas-option-desc{font-size:11px;font-weight:300;color:rgba(255,255,255,0.3);}

/* Type grid */
.tas-types{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:36px;width:100%;max-width:550px;}
.tas-type{padding:22px 16px;background:rgba(255,255,255,0.03);border:1.5px solid rgba(255,255,255,0.08);border-radius:12px;cursor:pointer;transition:all .3s;text-align:center;user-select:none;}
.tas-type:hover{border-color:rgba(201,168,76,0.3);}
.tas-type.selected{border-color:#C9A84C;background:rgba(201,168,76,0.08);}
.tas-type-ico{color:rgba(255,255,255,0.3);margin-bottom:8px;display:flex;justify-content:center;transition:color .3s;}
.tas-type.selected .tas-type-ico{color:#C9A84C;}
.tas-type-label{font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);transition:color .3s;}
.tas-type.selected .tas-type-label{color:#fff;}

/* Characteristics */
.tas-chars{display:grid;grid-template-columns:1fr 1fr;gap:16px;width:100%;max-width:500px;margin-bottom:36px;}
.tas-char-group{display:flex;flex-direction:column;gap:6px;}
.tas-char-label{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.3);}
.tas-char-input{padding:14px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#fff;font-family:'Montserrat',sans-serif;font-size:13px;outline:none;transition:border-color .3s;}
.tas-char-input::placeholder{color:rgba(255,255,255,0.2);}
.tas-char-input:focus{border-color:rgba(201,168,76,0.4);}

/* Contact form */
.tas-contact{display:flex;flex-direction:column;gap:16px;width:100%;max-width:500px;margin-bottom:36px;}
.tas-contact-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;}

/* Navigation */
.tas-nav{display:flex;gap:14px;justify-content:center;}
.tas-btn-next{padding:14px 40px;background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8,#C9A84C);background-size:300% 300%;animation:tGold 5s ease infinite;border:none;border-radius:10px;color:#0a0800;font-family:'Montserrat',sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .25s;position:relative;overflow:hidden;}
.tas-btn-next::before{content:'';position:absolute;top:-60%;left:-120%;width:60%;height:220%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent);transform:skewX(-18deg);animation:tShimmer 3.5s ease infinite;}
.tas-btn-next:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(201,168,76,0.4);}
.tas-btn-next:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none;}
.tas-btn-back{padding:14px 32px;background:transparent;border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:rgba(255,255,255,0.45);font-family:'Montserrat',sans-serif;font-size:12px;font-weight:500;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .25s;}
.tas-btn-back:hover{border-color:rgba(201,168,76,0.3);color:#C9A84C;}

/* Success */
.tas-success{text-align:center;padding:20px 0;}
.tas-success-check{width:72px;height:72px;border-radius:50%;background:rgba(201,168,76,0.1);border:2px solid #C9A84C;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;}
.tas-success h3{font-size:22px;font-weight:700;color:#fff;margin-bottom:8px;}
.tas-success p{font-size:14px;font-weight:300;color:rgba(255,255,255,0.45);max-width:400px;margin:0 auto 28px;line-height:1.7;}
.tas-success-wa{display:inline-flex;align-items:center;gap:10px;padding:16px 40px;background:linear-gradient(135deg,#25D366,#128C7E);border:none;border-radius:12px;color:#fff;font-family:'Montserrat',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;cursor:pointer;transition:all .25s;text-decoration:none;}
.tas-success-wa:hover{transform:translateY(-3px);box-shadow:0 12px 36px rgba(37,211,102,0.35);}
.tas-success-detail{margin-top:24px;padding:20px 24px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;text-align:left;max-width:420px;margin-left:auto;margin-right:auto;}
.tas-success-detail-row{display:flex;justify-content:space-between;padding:6px 0;font-size:12px;}
.tas-success-detail-label{color:rgba(255,255,255,0.35);font-weight:400;}
.tas-success-detail-val{color:rgba(255,255,255,0.7);font-weight:600;}

@keyframes tGold{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes tShimmer{0%{left:-120%}60%,100%{left:160%}}

@media(max-width:768px){
  .tas-inner{padding:0 20px;}
  .tas-benefits{grid-template-columns:1fr 1fr;gap:14px;}
  .tas-form-wrap{padding:28px 20px;}
  .tas-options{flex-direction:column;align-items:stretch;}
  .tas-option{max-width:none;}
  .tas-types{grid-template-columns:repeat(2,1fr);}
  .tas-chars{grid-template-columns:1fr;}
  .tas-contact-row{grid-template-columns:1fr;}
  .tas-progress-line{width:24px;}
}
@media(max-width:480px){
  .tas-benefits{grid-template-columns:1fr;}
  .tas-types{grid-template-columns:repeat(2,1fr);}
}
`;

/* ─────────────────────────────────────────────
   COMPONENTE
───────────────────────────────────────────── */
export default function Tasaciones() {
    const [step, setStep] = useState(0);
    const [motivo, setMotivo] = useState('');
    const [tipo, setTipo] = useState('');
    const [chars, setChars] = useState({ m2: '', m2Lote: '', dorms: '', banos: '', antiguedad: '' });
    const [contact, setContact] = useState({ nombre: '', telefono: '', email: '', direccion: '', mensaje: '' });
    const [submitted, setSubmitted] = useState(false);

    const stepRef = useRef(null);
    const heroRef = useRef(null);
    const benefitsRef = useRef(null);

    const TOTAL_STEPS = 4;

    useEffect(() => {
        if (document.getElementById('tas-css')) return;
        const s = document.createElement('style'); s.id = 'tas-css'; s.textContent = CSS;
        document.head.appendChild(s);
        return () => { const el = document.getElementById('tas-css'); if (el) el.remove(); };
    }, []);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    // GSAP hero + benefits
    useEffect(() => {
        if (!heroRef.current || !benefitsRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(heroRef.current.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.2 });
            gsap.fromTo(benefitsRef.current.children, { y: 30, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: benefitsRef.current, start: 'top 80%' } });
        });
        return () => ctx.revert();
    }, []);

    // Animate step transitions
    useEffect(() => {
        if (!stepRef.current) return;
        gsap.fromTo(stepRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
    }, [step, submitted]);

    const canNext = () => {
        if (step === 0) return !!motivo;
        if (step === 1) return !!tipo;
        if (step === 2) return !!chars.m2;
        if (step === 3) return !!contact.nombre && !!contact.telefono && !!contact.direccion;
        return false;
    };

    const next = () => {
        if (step < TOTAL_STEPS - 1) setStep(s => s + 1);
        else handleSubmit();
    };
    const back = () => { if (step > 0) setStep(s => s - 1); };

    const handleSubmit = () => {
        setSubmitted(true);
        // Acá después se conecta al panel/API
    };

    const buildWaMsg = () => {
        const motivoLabel = MOTIVOS.find(m => m.id === motivo)?.label || motivo;
        const tipoLabel = TIPOS.find(t => t.id === tipo)?.label || tipo;
        return encodeURIComponent(
            `Hola! Solicité una tasación desde la web.\n\n` +
            `Motivo: ${motivoLabel}\n` +
            `Tipo: ${tipoLabel}\n` +
            `Superficie: ${chars.m2}m²${chars.m2Lote ? ` (Lote: ${chars.m2Lote}m²)` : ''}\n` +
            `${chars.dorms ? `Dormitorios: ${chars.dorms}\n` : ''}` +
            `${chars.banos ? `Baños: ${chars.banos}\n` : ''}` +
            `${chars.antiguedad ? `Antigüedad: ${chars.antiguedad}\n` : ''}` +
            `\nDirección: ${contact.direccion}\n` +
            `Nombre: ${contact.nombre}\n` +
            `Teléfono: ${contact.telefono}\n` +
            `${contact.email ? `Email: ${contact.email}\n` : ''}` +
            `${contact.mensaje ? `Mensaje: ${contact.mensaje}` : ''}`
        );
    };

    return (
        <div className="tas-page">
            <div className="tas-inner">
                {/* Hero */}
                <div className="tas-hero" ref={heroRef}>

                    <h1>Tasá tu propiedad<br /><span className="gt">de forma gratuita</span></h1>
                    <p>Completá el formulario y recibí una tasación profesional basada en datos reales del mercado de la Patagonia Argentina. Sin compromiso, sin costo.</p>
                </div>

                {/* Benefits */}
                <div className="tas-benefits" ref={benefitsRef}>
                    {BENEFICIOS.map(b => (
                        <div key={b.title} className="tas-benefit">
                            <div className="tas-benefit-ico">{b.icon}</div>
                            <h4>{b.title}</h4>
                            <p>{b.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <div className="tas-form-wrap">
                    {!submitted ? (
                        <>
                            {/* Progress */}
                            <div className="tas-progress">
                                {[0, 1, 2, 3].map((s, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div className={`tas-progress-step${step === s ? ' active' : ''}${step > s ? ' done' : ''}`}>
                                            {step > s ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> : s + 1}
                                        </div>
                                        {i < 3 && <div className={`tas-progress-line${step > s ? ' done' : ''}`} />}
                                    </div>
                                ))}
                            </div>

                            {/* Steps */}
                            <div ref={stepRef}>
                                {/* Step 0: Motivo */}
                                <div className={`tas-step${step === 0 ? ' active' : ''}`}>
                                    <div className="tas-step-title">¿Qué querés hacer?</div>
                                    <div className="tas-step-sub">Seleccioná el motivo de tu tasación</div>
                                    <div className="tas-options">
                                        {MOTIVOS.map(m => (
                                            <div key={m.id} className={`tas-option${motivo === m.id ? ' selected' : ''}`} onClick={() => setMotivo(m.id)}>
                                                <div className="tas-option-ico">{m.icon}</div>
                                                <div className="tas-option-label">{m.label}</div>
                                                <div className="tas-option-desc">{m.desc}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Step 1: Tipo */}
                                <div className={`tas-step${step === 1 ? ' active' : ''}`}>
                                    <div className="tas-step-title">¿Qué tipo de propiedad es?</div>
                                    <div className="tas-step-sub">Seleccioná una opción</div>
                                    <div className="tas-types">
                                        {TIPOS.map(t => (
                                            <div key={t.id} className={`tas-type${tipo === t.id ? ' selected' : ''}`} onClick={() => setTipo(t.id)}>
                                                <div className="tas-type-ico">{t.icon}</div>
                                                <div className="tas-type-label">{t.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Step 2: Características */}
                                <div className={`tas-step${step === 2 ? ' active' : ''}`}>
                                    <div className="tas-step-title">Contanos sobre la propiedad</div>
                                    <div className="tas-step-sub">Completá lo que sepas, no es obligatorio todo</div>
                                    <div className="tas-chars">
                                        <div className="tas-char-group">
                                            <label className="tas-char-label">Superficie cubierta (m²) *</label>
                                            <input className="tas-char-input" type="number" placeholder="Ej: 120" value={chars.m2} onChange={e => setChars({ ...chars, m2: e.target.value })} />
                                        </div>
                                        <div className="tas-char-group">
                                            <label className="tas-char-label">Superficie lote (m²)</label>
                                            <input className="tas-char-input" type="number" placeholder="Ej: 300" value={chars.m2Lote} onChange={e => setChars({ ...chars, m2Lote: e.target.value })} />
                                        </div>
                                        <div className="tas-char-group">
                                            <label className="tas-char-label">Dormitorios</label>
                                            <input className="tas-char-input" type="number" placeholder="Ej: 3" value={chars.dorms} onChange={e => setChars({ ...chars, dorms: e.target.value })} />
                                        </div>
                                        <div className="tas-char-group">
                                            <label className="tas-char-label">Baños</label>
                                            <input className="tas-char-input" type="number" placeholder="Ej: 2" value={chars.banos} onChange={e => setChars({ ...chars, banos: e.target.value })} />
                                        </div>
                                        <div className="tas-char-group" style={{ gridColumn: '1/-1' }}>
                                            <label className="tas-char-label">Antigüedad</label>
                                            <input className="tas-char-input" placeholder="Ej: 10 años, A estrenar, etc." value={chars.antiguedad} onChange={e => setChars({ ...chars, antiguedad: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3: Datos personales */}
                                <div className={`tas-step${step === 3 ? ' active' : ''}`}>
                                    <div className="tas-step-title">Tus datos de contacto</div>
                                    <div className="tas-step-sub">Para enviarte la tasación y contactarte</div>
                                    <div className="tas-contact">
                                        <div className="tas-contact-row">
                                            <div className="tas-char-group">
                                                <label className="tas-char-label">Nombre *</label>
                                                <input className="tas-char-input" placeholder="Tu nombre completo" value={contact.nombre} onChange={e => setContact({ ...contact, nombre: e.target.value })} />
                                            </div>
                                            <div className="tas-char-group">
                                                <label className="tas-char-label">Teléfono *</label>
                                                <input className="tas-char-input" placeholder="Tu teléfono" value={contact.telefono} onChange={e => setContact({ ...contact, telefono: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="tas-char-group">
                                            <label className="tas-char-label">Email</label>
                                            <input className="tas-char-input" type="email" placeholder="tu@email.com" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
                                        </div>
                                        <div className="tas-char-group">
                                            <label className="tas-char-label">Dirección de la propiedad *</label>
                                            <input className="tas-char-input" placeholder="Calle, número, barrio, la Patagonia Argentina" value={contact.direccion} onChange={e => setContact({ ...contact, direccion: e.target.value })} />
                                        </div>
                                        <div className="tas-char-group">
                                            <label className="tas-char-label">Mensaje adicional</label>
                                            <textarea className="tas-char-input" rows={3} placeholder="Algo que quieras contarnos sobre tu propiedad..." value={contact.mensaje} onChange={e => setContact({ ...contact, mensaje: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="tas-nav">
                                {step > 0 && <button className="tas-btn-back" onClick={back}>Anterior</button>}
                                <button className="tas-btn-next" onClick={next} disabled={!canNext()}>
                                    {step < TOTAL_STEPS - 1 ? 'Siguiente' : 'Enviar tasación'}
                                </button>
                            </div>
                        </>
                    ) : (
                        /* Success */
                        <div className="tas-success" ref={stepRef}>
                            <div className="tas-success-check">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M8 16l5 5 11-11" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            <h3>Tasación solicitada</h3>
                            <p>Tu solicitud fue registrada. Podés enviarnos los datos directamente por WhatsApp para que te contactemos de inmediato.</p>

                            <a href={`${WA}?text=${buildWaMsg()}`} target="_blank" rel="noreferrer" className="tas-success-wa">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.025.506 3.932 1.395 5.608L.054 23.395a.5.5 0 00.611.586l5.584-1.468A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.332-1.546l-.382-.228-3.32.873.884-3.236-.253-.4A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>
                                Enviar por WhatsApp
                            </a>

                            <div className="tas-success-detail">
                                <div className="tas-success-detail-row"><span className="tas-success-detail-label">Motivo</span><span className="tas-success-detail-val">{MOTIVOS.find(m => m.id === motivo)?.label}</span></div>
                                <div className="tas-success-detail-row"><span className="tas-success-detail-label">Tipo</span><span className="tas-success-detail-val">{TIPOS.find(t => t.id === tipo)?.label}</span></div>
                                <div className="tas-success-detail-row"><span className="tas-success-detail-label">Superficie</span><span className="tas-success-detail-val">{chars.m2}m²{chars.m2Lote ? ` / Lote: ${chars.m2Lote}m²` : ''}</span></div>
                                <div className="tas-success-detail-row"><span className="tas-success-detail-label">Dirección</span><span className="tas-success-detail-val">{contact.direccion}</span></div>
                                <div className="tas-success-detail-row"><span className="tas-success-detail-label">Contacto</span><span className="tas-success-detail-val">{contact.nombre} · {contact.telefono}</span></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}