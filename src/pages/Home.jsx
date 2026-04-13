import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';


gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   DATOS
───────────────────────────────────────────── */
const CATEGORIAS = [
    { id: 'terrenos', label: 'Terrenos', sub: 'INVERSIÓN', desc: 'Lotes con vista a la cordillera, lagos y meseta. Tu próximo proyecto comienza acá.', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80', filtro: 'tipo=Terreno' },
    { id: 'casas', label: 'Casas', sub: 'EXCLUSIVO', desc: 'Hogares con carácter patagónico. Espacios amplios, naturaleza y confort.', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', filtro: 'tipo=Casa' },
    { id: 'chacras', label: 'Chacras', sub: 'RURAL', desc: 'Vida de campo en la Patagonia. Hectáreas de libertad y paisajes únicos.', img: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600&q=80', filtro: 'tipo=Chacra' },
    { id: 'locales', label: 'Locales', sub: 'COMERCIAL', desc: 'Espacios comerciales en puntos estratégicos. Ideal para emprender.', img: 'https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=600&q=80', filtro: 'tipo=Local' },
];




const TESTIMONIOS = [
    { nombre: 'Guada Ramirez', texto: 'Gracias Matias por todo tu trabajo! Nos acompañaste siempre, desde ver la propiedad hasta el día de la firma de escritura. Siempre atento a todo lo que iba surgiendo y nuestras dudas. Gracias infinitas!', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Melisa Diaz', texto: 'Excelente servicio! Rodolfo fue muy atento y honesto para con mi Papa y nosotros. Recomiendo sus servicios a cualquier persona buscando comprar o vender su propiedad. Le estamos sumamente agradecidos!', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Mariana Medina', texto: 'Muy buen trato. Cordial. Atentos. Y muy responsables. Excelente atención.', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Mario au', texto: 'Muy buena la atención y la predisposición siempre, para sacar las dudas y mostrar las viviendas y terrenos, atendido por sus dueños.', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'WAYS TO GO', texto: 'Excelente atención, dedicación y trabajo, Rodolfo me ha vendido un departamento muy rápido, más teniendo en cuenta que vivo fuera del país, puse todo en sus manos y realmente, ha sido magnífico. ¡Gracias!!', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Larisa Cesar', texto: 'Es de mucha confianza esa inmobiliaria, siempre se ve gente!', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Greta Nencini', texto: 'Todo excelente, nos dieron una mano enorme ocupándose de la venta de nuestras propiedades. Muy prolijos.', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Hugo Santini', texto: 'Muy buena la atención, gente muy responsable.', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Diana Poblet', texto: 'Son muy recomendables, se ocupan, están siempre y logran generar la confianza necesaria para llevar adelante la operación requerida sin estrés. Uno siente haber llegado a un buen lugar.', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Cynthia Hermoso', texto: 'Excelente atención. Confiables, amables y predispuestos a solucionar cualquier inconveniente.', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Eduardo Rey', texto: 'Lo mejor de lo mejor! Se puede confiar totalmente en el Sr. Rodolfo y sus hijos. Logré vender mi propiedad al precio que yo pedía e hice una operación de compra también con Puntos Cardinales Bienes Raíces y estoy más que satisfecho. Merecen toda mi confianza, los recomiendo ampliamente.', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Aurysmar Guerra', texto: 'Desde el inicio de mi búsqueda por un terreno en la Patagonia, esta empresa se ganó mi confianza hasta el punto de decidirme en proceder con la compra. Sin duda este negocio familiar comparte grandes valores.', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Maria Candela', texto: 'Excelente! La mejor inmobiliaria de la Patagonia Argentina! Tuve la experiencia de comprar un lote con ellos y ahora me encuentro viviendo en el exterior y se ocupan de alquilar mi casa y llevar adelante temas del inmueble.', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Dana Montiel Deserio', texto: 'Estoy sumamente conforme con su atención, responsabilidad y honestidad. La paciencia de esperar la decisión a los clientes. En ventas muy profesionales y en tasaciones muy ubicados.', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Rafael Ojeda', texto: 'Excelente atención, están en todos los detalles generando confianza y seguridad. Sumamente conforme y altamente recomendable.', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'M. Matilde Perez Otaola', texto: 'Recibí siempre una confiable y amable atención, el equipo de Puntos Cardinales se ocupó siempre con esmero por encontrar el cliente adecuado. Estoy muy conforme.', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Fernando Garcia', texto: 'Destaco el empeño y constancia con que ha encarado la venta del terreno. Muy comprometido con su trabajo.', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Graciela Blanco', texto: 'Desde el primer momento que nos contactamos con la Inmobiliaria tuvimos una excelente atención. Muy profesionales!', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Daniela F.', texto: 'Muy buena atención! Son muy dedicados y comprometidos al trabajo, muy conforme!', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Patricia Quiroga', texto: 'Muy profesionales, muy atentos, resolutivos y más con la gente que vive lejos. Los súper recomiendo. Una familia dedicada a los inmuebles.', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'THE WARLOCK Wizard', texto: 'Esta inmobiliaria es impresionante, la atención, el esmero y las ganas que ponen en tratar al cliente. Impresionante, gracias Rodolfo y a tus hijos.', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Eduardo Rey', texto: 'Merecen toda mi confianza, y los recomiendo ampliamente.', estrellas: 5, tiempo: 'Hace un mes' },
    { nombre: 'Aurysmar Guerra', texto: 'Este negocio familiar comparte grandes valores y me decidí a proceder con la compra de una de las opciones que me ofrecieron.', estrellas: 5, tiempo: 'Hace un mes' },
];

const IG_HANDLE = '@puntoscardinalesbienesraices';
const IG_URL = 'https://www.instagram.com/puntoscardinalesbienesraices';
const IG_REELS = [
    { id: 'DNq0PNfB_2B', caption: 'Propiedad destacada' },
    { id: 'DN0oXzWXIQE', caption: 'Oportunidad en la Patagonia' },
    { id: 'DLQb6xgxPnZ', caption: 'Tu próximo hogar' },
    { id: 'DJ5GCHnx8m4', caption: 'Bienes Raíces Patagonia' },
    { id: 'DJNL5MjRWPP', caption: 'Invertí con nosotros' },
];

const SEARCH_OPTIONS = {
    tipo: ['Terreno', 'Casa', 'Alquiler', 'Chacra', 'Local'],
    precio: ['Sin límite', 'Hasta USD 80.000', 'Hasta USD 150.000', 'Hasta USD 250.000', 'Hasta USD 400.000'],
};

const WA = 'https://wa.me/5492945441507';
const CATALOGO = '/propiedades';

/* ─────────────────────────────────────────────
   CSS GLOBAL
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');

:root {
  --gold-1:#8B6914; --gold-2:#C9A84C; --gold-3:#FDEAA8;
  --black:#050508; --black2:#0D0D12; --black3:#131318;
  --white:#FFFFFF; --off:#F2EDE4;
  --border:rgba(201,168,76,0.18); --border-s:rgba(255,255,255,0.06);
}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--black);overflow-x:hidden;font-family:'Montserrat',sans-serif;}

@keyframes goldShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes shimmer{0%{left:-120%}60%,100%{left:160%}}
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes floatImg{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes cardFloat{0%,100%{transform:translateY(0) rotate(var(--rot,0deg))}50%{transform:translateY(-8px) rotate(var(--rot,0deg))}}
@keyframes starPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}
@keyframes glowPulse{0%,100%{opacity:0.4}50%{opacity:0.8}}

.gt{background:linear-gradient(120deg,var(--gold-1),var(--gold-2),var(--gold-3),var(--gold-2));background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:goldShift 5s ease infinite;}

.btn-gold{position:relative;display:inline-flex;align-items:center;gap:10px;padding:15px 38px;background:linear-gradient(120deg,var(--gold-1),var(--gold-2),var(--gold-3),var(--gold-2));background-size:300% 300%;animation:goldShift 5s ease infinite;color:#0a0800;font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;letter-spacing:2.5px;text-transform:uppercase;border:none;cursor:pointer;overflow:hidden;text-decoration:none;transition:transform .25s,box-shadow .25s;}
.btn-gold::before{content:'';position:absolute;top:-60%;left:-120%;width:60%;height:220%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent);transform:skewX(-18deg);animation:shimmer 3.5s ease infinite;}
.btn-gold:hover{transform:translateY(-3px);box-shadow:0 14px 40px rgba(201,168,76,0.45);}

.btn-ghost{display:inline-flex;align-items:center;gap:10px;padding:14px 36px;background:transparent;color:var(--gold-2);font-family:'Montserrat',sans-serif;font-weight:600;font-size:12px;letter-spacing:2.5px;text-transform:uppercase;border:1px solid rgba(201,168,76,0.4);cursor:pointer;text-decoration:none;transition:all .3s;}
.btn-ghost:hover{background:rgba(201,168,76,0.08);border-color:var(--gold-2);transform:translateY(-3px);}

.sec-label{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.sec-label-line{width:32px;height:1px;background:var(--gold-2);flex-shrink:0;}
.sec-label-text{font-family:'Montserrat',sans-serif;font-size:10px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:var(--gold-2);}
.sec-title{font-family:'Montserrat',sans-serif;font-weight:800;font-size:clamp(32px,4.5vw,58px);color:var(--white);line-height:1.1;}
.sec-title-sm{font-family:'Montserrat',sans-serif;font-weight:800;font-size:clamp(24px,3vw,38px);color:var(--white);line-height:1.1;}

.reveal{opacity:0;transform:translateY(32px);transition:opacity .85s cubic-bezier(.16,1,.3,1),transform .85s cubic-bezier(.16,1,.3,1);}
.reveal.visible{opacity:1;transform:translateY(0);}
.rv1{transition-delay:.1s}.rv2{transition-delay:.2s}.rv3{transition-delay:.3s}.rv4{transition-delay:.4s}

::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:var(--black)}::-webkit-scrollbar-thumb{background:rgba(201,168,76,.3);border-radius:3px}

/* ══════ HERO ══════ */
.hero{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden;background:#050508;}
.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.hero-gradient{position:absolute;inset:0;background:linear-gradient(90deg,rgba(5,5,8,0.92) 0%,rgba(5,5,8,0.7) 40%,rgba(5,5,8,0.25) 70%,rgba(5,5,8,0.1) 100%);}
.hero-gradient-bottom{position:absolute;bottom:0;left:0;right:0;height:200px;background:linear-gradient(to top,#050508,transparent);}
.hero-inner{position:relative;z-index:2;width:100%;max-width:1320px;margin:0 auto;padding:140px 60px 80px;}
.hero-content{max-width:720px;}

.hero h1{font-family:'Montserrat',sans-serif;font-weight:800;font-size:clamp(32px,4vw,56px);line-height:1.08;color:var(--white);margin-bottom:24px;}
.hero h1 em{font-style:normal;font-weight:800;background:linear-gradient(120deg,var(--gold-1),var(--gold-2),var(--gold-3),var(--gold-2));background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:goldShift 5s ease infinite;}
.hero-desc{font-family:'Montserrat',sans-serif;font-weight:300;font-size:15px;line-height:1.85;color:rgba(255,255,255,0.55);max-width:500px;margin-bottom:48px;}

.hero-search{display:flex;align-items:stretch;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-radius:30px;overflow:visible;width:100%;max-width:680px;position:relative;z-index:50;}
.hero-search-col{flex:1;position:relative;}
.hero-search-col + .hero-search-col{border-left:1px solid rgba(255,255,255,0.08);}
.hero-search-trigger{display:flex;flex-direction:column;gap:2px;padding:12px 24px;cursor:pointer;transition:background .2s;height:100%;justify-content:center;user-select:none;}
.hero-search-trigger:hover{background:rgba(255,255,255,0.04);}
.hero-search-label{font-size:10px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;color:rgba(255,255,255,0.4);}
.hero-search-value{font-size:14px;font-weight:500;color:var(--white);display:flex;align-items:center;gap:8px;}
.hero-search-value svg{opacity:.4;flex-shrink:0;transition:transform .3s;}
.hero-search-col.open .hero-search-value svg{transform:rotate(180deg);}

.hero-search-dropdown{position:absolute;top:calc(100% + 8px);left:0;right:0;background:#0D0D12;border:1px solid rgba(201,168,76,0.25);border-radius:12px;padding:8px 0;z-index:9999;opacity:0;transform:translateY(-8px);pointer-events:none;transition:opacity .25s,transform .25s;box-shadow:0 30px 80px rgba(0,0,0,0.95);}
.hero-search-col.open .hero-search-dropdown{opacity:1;transform:translateY(0);pointer-events:all;}
.hero-search-option{padding:12px 24px;font-size:13px;font-weight:400;color:rgba(255,255,255,0.6);cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:space-between;}
.hero-search-option:hover{background:rgba(201,168,76,0.08);color:var(--white);}
.hero-search-option.selected{color:var(--gold-2);font-weight:600;}
.hero-search-option.selected::after{content:'✓';font-size:11px;color:var(--gold-2);}

.hero-search-btn{display:flex;align-items:center;gap:8px;padding:0 32px;background:linear-gradient(120deg,var(--gold-1),var(--gold-2),var(--gold-3),var(--gold-2));background-size:300% 300%;animation:goldShift 5s ease infinite;border:none;cursor:pointer;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;color:#0a0800;transition:opacity .2s;white-space:nowrap;border-radius:0 30px 30px 0;min-width:130px;justify-content:center;}
.hero-search-btn:hover{opacity:.9;}

.hero-stats{display:flex;gap:48px;margin-top:56px;flex-wrap:wrap;}
.hero-stat{text-align:left;}
.hero-stat-number{font-family:'Montserrat',sans-serif;font-size:clamp(20px,2.5vw,32px);font-weight:800;line-height:1;background:linear-gradient(120deg,var(--gold-1),var(--gold-2),var(--gold-3),var(--gold-2));background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:goldShift 5s ease infinite;}
.hero-stat-label{font-family:'Montserrat',sans-serif;font-size:8px;font-weight:400;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-top:4px;}

/* ══════ CATEGORÍAS ══════ */
.cat-section{position:relative;padding:110px 0;background:var(--black);overflow:hidden;}
.cat-inner{max-width:1320px;margin:0 auto;padding:0 60px;}
.cat-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:52px;flex-wrap:wrap;gap:20px;}
.cat-viewport{overflow:hidden;position:relative;}
.cat-track{display:flex;gap:20px;}
.cat-card{position:relative;flex:0 0 calc(25% - 15px);height:440px;border-radius:14px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:border-color .4s;text-decoration:none;}
.cat-card:hover{border-color:rgba(201,168,76,0.35);}
.cat-card-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .8s cubic-bezier(.16,1,.3,1);}
.cat-card:hover .cat-card-img{transform:scale(1.06);}
.cat-card-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,5,8,0.1) 0%,rgba(5,5,8,0.78) 100%);transition:background .4s;}
.cat-card:hover .cat-card-overlay{background:linear-gradient(180deg,rgba(5,5,8,0.05) 0%,rgba(5,5,8,0.88) 100%);}
.cat-card-tag{position:absolute;top:16px;left:16px;padding:5px 14px;font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;background:linear-gradient(120deg,var(--gold-1),var(--gold-2),var(--gold-3));background-size:200%;animation:goldShift 4s ease infinite;color:#0a0800;border-radius:6px;}
.cat-card-content{position:absolute;bottom:0;left:0;right:0;padding:28px;}
.cat-card-sub{font-size:9px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:6px;}
.cat-card-title{font-family:'Montserrat',sans-serif;font-size:24px;font-weight:800;color:var(--white);margin-bottom:8px;}
.cat-card-desc{font-size:12px;font-weight:300;color:rgba(255,255,255,0.55);line-height:1.6;max-height:0;overflow:hidden;opacity:0;transition:max-height .6s cubic-bezier(.16,1,.3,1),opacity .5s ease;margin-bottom:6px;}
.cat-card:hover .cat-card-desc,.cat-card.cat-active .cat-card-desc{max-height:60px;opacity:1;}
.cat-card-desc::before{content:'';display:block;width:20px;height:1px;background:linear-gradient(90deg,var(--gold-2),transparent);margin-bottom:8px;}
.cat-card-explore{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--gold-2);text-decoration:none;transform:translateY(6px);opacity:0;transition:all .4s;}
.cat-card:hover .cat-card-explore,.cat-card.cat-active .cat-card-explore{transform:translateY(0);opacity:1;}
.cat-dots{display:none;justify-content:center;gap:8px;margin-top:24px;}
.cat-dot{width:7px;height:7px;border-radius:50%;border:none;cursor:pointer;padding:0;transition:all .3s;}

/* ══════ TESTIMONIOS PREMIUM ══════ */
.testi-section{position:relative;padding:120px 0;background:var(--black3);overflow:hidden;border-top:1px solid var(--border-s);}
.testi-bg-orb{position:absolute;border-radius:50%;pointer-events:none;}
.testi-inner{max-width:1320px;margin:0 auto;padding:0 60px;position:relative;z-index:2;}
.testi-header{text-align:center;margin-bottom:16px;}
.testi-google-badge{display:inline-flex;align-items:center;gap:10px;padding:8px 20px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:40px;margin-bottom:28px;}
.testi-google-badge-stars{display:flex;gap:3px;}
.testi-google-badge-star{color:#C9A84C;font-size:14px;}
.testi-google-badge-text{font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,0.5);}
.testi-track-wrap{overflow:hidden;mask-image:linear-gradient(90deg,transparent 0%,black 8%,black 92%,transparent 100%);-webkit-mask-image:linear-gradient(90deg,transparent 0%,black 8%,black 92%,transparent 100%);}
.testi-track{display:flex;gap:20px;width:max-content;will-change:transform;}
.testi-card{flex:0 0 340px;background:rgba(255,255,255,0.025);border:1px solid rgba(201,168,76,0.1);border-radius:16px;padding:28px;position:relative;overflow:hidden;cursor:default;transition:border-color .4s,box-shadow .4s,transform .4s;}
.testi-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent);opacity:0;transition:opacity .4s;}
.testi-card:hover{border-color:rgba(201,168,76,0.3);box-shadow:0 20px 60px rgba(0,0,0,0.4),0 0 40px rgba(201,168,76,0.05);transform:translateY(-6px) !important;}
.testi-card:hover::before{opacity:1;}
.testi-card.is-floating{animation:cardFloat var(--float-dur,6s) ease-in-out infinite;animation-delay:var(--float-delay,0s);}
.testi-card-quote{position:absolute;top:20px;right:22px;font-size:72px;font-weight:800;color:rgba(201,168,76,0.05);line-height:1;font-family:Georgia,serif;pointer-events:none;user-select:none;}
.testi-card-stars{display:flex;gap:4px;margin-bottom:16px;}
.testi-card-star{font-size:14px;color:#C9A84C;}
.testi-card-star.animate{animation:starPulse .6s ease-in-out var(--delay,.1s) both;}
.testi-card-text{font-size:13px;font-weight:300;color:rgba(255,255,255,0.65);line-height:1.8;margin-bottom:20px;min-height:60px;}
.testi-card-footer{display:flex;align-items:center;gap:12px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.05);}
.testi-card-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--gold-1),var(--gold-2));display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#0a0800;flex-shrink:0;}
.testi-card-name{font-size:13px;font-weight:600;color:var(--white);}
.testi-card-time{font-size:10px;font-weight:400;color:rgba(255,255,255,0.3);margin-top:2px;}
.testi-google-link{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,0.4);text-decoration:none;transition:color .3s;margin-top:40px;}
.testi-google-link:hover{color:var(--gold-2);}

/* Instagram section */
.ig-section{position:relative;overflow:hidden;}
.ig-inner{max-width:1320px;margin:0 auto;padding:0 60px;}
.ig-glow-orb{position:absolute;border-radius:50%;pointer-events:none;filter:blur(80px);}
.ig-profile{display:flex;align-items:center;justify-content:center;gap:20px;margin-bottom:48px;}
.ig-avatar{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);display:flex;align-items:center;justify-content:center;padding:2.5px;flex-shrink:0;}
.ig-avatar-inner{width:100%;height:100%;border-radius:50%;background:#0D0D12;display:flex;align-items:center;justify-content:center;}
.ig-avatar-inner img{width:38px;height:38px;border-radius:50%;object-fit:contain;}
.ig-handle{font-size:16px;font-weight:700;color:var(--white);}
.ig-handle span{display:block;font-size:10px;font-weight:400;color:rgba(255,255,255,0.35);margin-top:2px;letter-spacing:.05em;}
.ig-follow-btn{padding:9px 28px;background:linear-gradient(120deg,var(--gold-1),var(--gold-2),var(--gold-3));background-size:200%;animation:goldShift 4s ease infinite;border:none;border-radius:8px;font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0a0800;cursor:pointer;text-decoration:none;transition:all .25s;}
.ig-follow-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(201,168,76,0.35);}
.ig-carousel-wrap{position:relative;}
.ig-carousel-viewport{overflow:hidden;border-radius:14px;}
.ig-carousel-track{display:flex;gap:20px;transition:transform .6s cubic-bezier(.16,1,.3,1);}
.ig-reel-card{flex:0 0 calc(33.333% - 14px);position:relative;border-radius:14px;overflow:hidden;border:1px solid rgba(201,168,76,0.08);transition:all .4s cubic-bezier(.16,1,.3,1);background:#0a0a0f;}
.ig-reel-card:hover{border-color:rgba(201,168,76,0.3);transform:translateY(-4px);box-shadow:0 20px 50px rgba(0,0,0,0.4);}
.ig-reel-card iframe{width:100%;height:100%;min-height:480px;border:none;display:block;}
.ig-reel-caption{position:absolute;bottom:0;left:0;right:0;padding:16px 18px;background:linear-gradient(to top,rgba(5,5,8,0.9),transparent);pointer-events:none;font-size:11px;font-weight:500;color:rgba(255,255,255,0.7);letter-spacing:.03em;z-index:2;}
.ig-carousel-nav{display:flex;justify-content:center;align-items:center;gap:16px;margin-top:32px;}
.ig-nav-arrow{width:44px;height:44px;border:1px solid rgba(201,168,76,0.25);background:transparent;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .25s;}
.ig-nav-arrow:hover{background:rgba(201,168,76,0.08);border-color:rgba(201,168,76,0.5);}
.ig-nav-arrow:disabled{opacity:.25;cursor:default;}
.ig-nav-dots{display:flex;gap:6px;}
.ig-nav-dot{width:8px;height:8px;border-radius:50%;border:none;cursor:pointer;padding:0;transition:all .35s;}
.ig-cta-row{display:flex;justify-content:center;margin-top:40px;}
.ig-cta-link{display:inline-flex;align-items:center;gap:10px;padding:14px 40px;background:transparent;border:1px solid rgba(201,168,76,0.3);border-radius:50px;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold-2);text-decoration:none;transition:all .3s;}
.ig-cta-link:hover{background:rgba(201,168,76,0.08);border-color:var(--gold-2);transform:translateY(-2px);box-shadow:0 8px 28px rgba(201,168,76,0.15);}

/* ══════ RESPONSIVE ══════ */
@media(max-width:1024px){
  .hero-inner{padding:120px 32px 60px;}
  .hero-search{flex-wrap:wrap;border-radius:10px;}
  .hero-search-col{flex:1 1 45%;min-width:140px;}
  .hero-search-col + .hero-search-col{border-left:none;border-top:1px solid rgba(255,255,255,0.08);}
  .hero-search-btn{flex:1 1 100%;padding:16px;justify-content:center;border-radius:0 0 30px 30px;min-width:auto;}
  .cat-card{flex:0 0 calc(50% - 10px);height:380px;}
  .serv-grid{grid-template-columns:1fr !important;gap:40px !important;}
  .about-grid{grid-template-columns:1fr !important;gap:40px !important;}
  .ig-section-grid{grid-template-columns:1fr;gap:40px;}
}
@media(max-width:768px){
  .hero-inner{padding:110px 20px 48px;}
  .hero h1{font-size:clamp(32px,8vw,48px);}
  .hero-desc{font-size:14px;margin-bottom:32px;}
  .hero-search{flex-direction:column;}
  .hero-search-col + .hero-search-col{border-left:none;border-top:1px solid rgba(255,255,255,0.08);}
  .hero-search-trigger{padding:12px 20px;}
  .hero-search-btn{padding:16px 20px;justify-content:center;border-radius:0 0 30px 30px;min-width:auto;}
  .hero-stats{gap:28px;margin-top:40px;}
  .cat-inner{padding:0 20px;}
  .testi-inner{padding:0 20px;}
  .cat-card{flex:0 0 78vw;height:340px;}
  .cat-card .cat-card-explore{transform:translateY(0);opacity:1;}
  .cat-card .cat-card-desc{max-height:0;opacity:0;}
  .cat-card.cat-active .cat-card-desc{max-height:60px;opacity:1;}
  .cat-card.cat-active .cat-card-explore{transform:translateY(0);opacity:1;}
  .cat-dots{display:flex;}
  .sec-inner-r{padding:0 20px !important;}
  .feat-grid{grid-template-columns:1fr !important;}
  .stats-grid{grid-template-columns:1fr 1fr !important;gap:12px !important;}
  .ig-section-grid{grid-template-columns:1fr;}
  .ig-inner{padding:0 20px;}
  .ig-reel-card{flex:0 0 80vw;}
  .ig-reel-card iframe{min-height:420px;}
  .ig-profile{flex-wrap:wrap;gap:12px;}
  .testi-card{flex:0 0 80vw;}
}
@media(max-width:480px){
  .hero h1{font-size:28px;}
  .cat-card{flex:0 0 85vw;height:300px;}
  .cat-card-title{font-size:20px;}
  .testi-card{flex:0 0 88vw;}
}
`;

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useReveal() {
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
            { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
        );
        document.querySelectorAll('.reveal').forEach(el => io.observe(el));
        return () => io.disconnect();
    });
}

/* ─────────────────────────────────────────────
   SEARCH DROPDOWN
───────────────────────────────────────────── */
function SearchCol({ label, value, options, onChange, isOpen, onToggle }) {
    const ref = useRef(null);
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onToggle(false); };
        if (isOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onToggle]);

    return (
        <div className={`hero-search-col${isOpen ? ' open' : ''}`} ref={ref}>
            <div className="hero-search-trigger" onClick={() => onToggle(!isOpen)}>
                <span className="hero-search-label">{label}</span>
                <span className="hero-search-value">
                    {value}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
            </div>
            <div className="hero-search-dropdown">
                {options.map(opt => (
                    <div key={opt} className={`hero-search-option${opt === value ? ' selected' : ''}`}
                        onClick={() => { onChange(opt); onToggle(false); }}>
                        {opt}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   TESTIMONIOS SECTION
───────────────────────────────────────────── */
function TestimoniosSection() {
    const trackRef1 = useRef(null);
    const trackRef2 = useRef(null);
    const sectionRef = useRef(null);
    const animRef1 = useRef(null);
    const animRef2 = useRef(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [starsAnimated, setStarsAnimated] = useState(false);

    // Split testimonials into two rows
    const half = Math.ceil(TESTIMONIOS.length / 2);
    const row1 = TESTIMONIOS.slice(0, half);
    const row2 = TESTIMONIOS.slice(half);

    useEffect(() => {
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                setStarsAnimated(true);
                io.disconnect();
            }
        }, { threshold: 0.2 });
        if (sectionRef.current) io.observe(sectionRef.current);
        return () => io.disconnect();
    }, []);

    // Continuous marquee with GSAP
    useEffect(() => {
        const tracks = [trackRef1.current, trackRef2.current];
        const directions = [1, -1];
        const speeds = [28, 32]; // seconds per cycle

        tracks.forEach((track, idx) => {
            if (!track) return;
            const cards = track.querySelectorAll('.testi-card');
            const cardW = 340 + 20; // card width + gap
            const totalW = cardW * (idx === 0 ? row1.length : row2.length); // half the track (duplicated)

            gsap.set(track, { x: idx === 0 ? 0 : -totalW });

            const anim = gsap.to(track, {
                x: idx === 0 ? -totalW : 0,
                duration: speeds[idx],
                ease: 'none',
                repeat: -1,
                force3D: true,
            });

            if (idx === 0) animRef1.current = anim;
            else animRef2.current = anim;
        });

        return () => {
            animRef1.current?.kill();
            animRef2.current?.kill();
        };
    }, []);

    // Pause on hover
    const handleMouseEnter = (rowIdx) => {
        if (rowIdx === 0) animRef1.current?.pause();
        else animRef2.current?.pause();
    };
    const handleMouseLeave = (rowIdx) => {
        if (rowIdx === 0) animRef1.current?.play();
        else animRef2.current?.play();
    };

    // Random float animation trigger every ~8s for random cards
    // Random float animation removed for improved mobile performance

    const renderRow = (items, trackRef, rowIdx) => {
        const doubled = [...items, ...items]; // duplicate for seamless loop
        return (
            <div
                className="testi-track-wrap"
                style={{ marginBottom: rowIdx === 0 ? 20 : 0 }}
                onMouseEnter={() => handleMouseEnter(rowIdx)}
                onMouseLeave={() => handleMouseLeave(rowIdx)}
            >
                <div className="testi-track" ref={trackRef}>
                    {doubled.map((t, i) => {
                        const initials = t.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                        const cardKey = `${rowIdx}-${i}`;
                        return (
                            <div
                                key={cardKey}
                                className="testi-card"
                                onMouseEnter={() => setHoveredCard(cardKey)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="testi-card-quote">"</div>
                                <div className="testi-card-stars">
                                    {Array.from({ length: 5 }).map((_, si) => (
                                        <span
                                            key={si}
                                            className={`testi-card-star${starsAnimated ? ' animate' : ''}`}
                                            style={{ '--delay': `${si * 0.08 + i * 0.05}s` }}
                                        >★</span>
                                    ))}
                                </div>
                                <p className="testi-card-text">"{t.texto}"</p>
                                <div className="testi-card-footer">
                                    <div className="testi-card-avatar">{initials}</div>
                                    <div>
                                        <div className="testi-card-name">{t.nombre}</div>
                                        <div className="testi-card-time">{t.tiempo}</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto' }}>
                                        <GoogleIcon />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <section className="testi-section" ref={sectionRef} id="testimonios">
            {/* Background orbs */}
            <div className="testi-bg-orb" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)', top: '20%', left: '-10%' }} />
            <div className="testi-bg-orb" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', bottom: '10%', right: '-8%' }} />

            <div className="testi-inner">
                <div className="testi-header">
                    <div className="reveal" style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="testi-google-badge">
                            <div className="testi-google-badge-stars">
                                {Array.from({ length: 5 }).map((_, i) => <span key={i} className="testi-google-badge-star">★</span>)}
                            </div>
                            <span className="testi-google-badge-text">4.8 en Google Reviews</span>
                        </div>
                    </div>
                    <div className="sec-label reveal rv1" style={{ justifyContent: 'center' }}>
                        <div className="sec-label-line" />
                        <span className="sec-label-text">Lo que dicen nuestros clientes</span>
                        <div className="sec-label-line" style={{ background: 'linear-gradient(90deg,var(--gold-2),transparent)' }} />
                    </div>
                    <h2 className="sec-title reveal rv2" style={{ textAlign: 'center', marginBottom: 16 }}>
                        Opiniones <span className="gt">reales.</span>
                    </h2>
                    <p className="reveal rv3" style={{ textAlign: 'center', fontWeight: 300, fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, maxWidth: 480, margin: '0 auto 52px' }}>
                        Más de 90 familias y empresas confían en Puntos Cardinales Bienes Raíces. Estas son sus experiencias.
                    </p>
                </div>

                {renderRow(row1, trackRef1, 0)}
                {renderRow(row2, trackRef2, 1)}

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <a
                        href="https://www.google.com/search?q=Puntos Cardinales+Negocios+Inmobiliarios+Mar+del+Plata+reviews"
                        target="_blank"
                        rel="noreferrer"
                        className="testi-google-link"
                    >
                        <GoogleIcon />
                        Ver todas las opiniones en Google
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 10L10 2M10 2H5M10 2v5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round" /></svg>
                    </a>
                </div>
            </div>
        </section>
    );
}

const GoogleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────── */
export default function Home() {
    const navigate = useNavigate();
    const [propIdx, setPropIdx] = useState(0);
    const [catIdx, setCatIdx] = useState(0);
    const [ratingVisible, setRatingVisible] = useState(false);
    const igRef = useRef(null);
    const igTrackRef = useRef(null);
    const [igIdx, setIgIdx] = useState(0);

    // Search state
    const [searchTipo, setSearchTipo] = useState('Casa');
    const [searchPrecio, setSearchPrecio] = useState('Sin límite');
    const [openDrop, setOpenDrop] = useState(null);

    const heroRef = useRef(null);
    const heroH1Ref = useRef(null);
    const heroDescRef = useRef(null);
    const heroSearchRef = useRef(null);
    const heroStatsRef = useRef(null);
    const catSectionRef = useRef(null);
    const catCardsRef = useRef([]);
    const catHeaderRef = useRef(null);
    const catTrackRef = useRef(null);
    const [PROPIEDADES, setPropiedades] = useState([]);

    useEffect(() => {
        const load = async () => {
            const { data } = await supabase
                .from('properties')
                .select('*')
                .eq('publicado', true)
                .eq('destacado', true)
                .order('created_at', { ascending: false })
                .limit(5);
            setPropiedades((data || []).map(p => ({
                ...p,
                img: p.imagenes?.[0] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80',
                m2: p.m2_cubiertos,
                dorms: p.dormitorios,
            })));
        };
        load();
    }, []);
    useEffect(() => {
        if (document.getElementById('puntoscardinales-css')) return;
        const s = document.createElement('style');
        s.id = 'puntoscardinales-css';
        s.textContent = CSS;
        document.head.appendChild(s);
        return () => { const el = document.getElementById('puntoscardinales-css'); if (el) el.remove(); };
    }, []);

    useReveal();

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.fromTo(heroH1Ref.current?.children || [], { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15 }, 0.3)
                .fromTo(heroDescRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.7)
                .fromTo(heroSearchRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.9)
                .fromTo(heroStatsRef.current?.children || [], { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 }, 1.2);
        }, heroRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(catHeaderRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: catSectionRef.current, start: 'top 80%' } });
            gsap.fromTo(catCardsRef.current, { y: 60, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: catSectionRef.current, start: 'top 70%' } });
        }, catSectionRef);
        return () => ctx.revert();
    }, []);

    // Instagram carousel GSAP animation
    useEffect(() => {
        if (!igRef.current) return;
        const ctx = gsap.context(() => {
            // Staggered reel card reveals
            gsap.fromTo('.ig-reel-card', { y: 50, opacity: 0, scale: 0.92 }, {
                y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out',
                scrollTrigger: { trigger: igRef.current, start: 'top 75%' }
            });
            // Profile bar entrance
            gsap.fromTo('.ig-profile', { y: -20, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
                scrollTrigger: { trigger: igRef.current, start: 'top 80%' }
            });
            // Glow orbs
            gsap.fromTo('.ig-glow-orb', { scale: 0.5, opacity: 0 }, {
                scale: 1, opacity: 1, duration: 1.8, ease: 'power2.out',
                scrollTrigger: { trigger: igRef.current, start: 'top 85%' }
            });
            // CTA link
            gsap.fromTo('.ig-cta-link', { y: 20, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.7, delay: 0.5, ease: 'power3.out',
                scrollTrigger: { trigger: igRef.current, start: 'top 60%' }
            });
        }, igRef);
        return () => ctx.revert();
    }, []);

    // IG carousel slide
    useEffect(() => {
        if (!igTrackRef.current) return;
        const isMobile = window.innerWidth <= 768;
        const cardW = isMobile ? window.innerWidth * 0.8 + 20 : igTrackRef.current.firstChild?.offsetWidth + 20 || 0;
        gsap.to(igTrackRef.current, { x: -igIdx * cardW, duration: 0.6, ease: 'power3.out' });
    }, [igIdx]);

    const igTouchRef = useRef(null);
    const onIgTouchStart = e => { igTouchRef.current = e.touches[0].clientX; };
    const onIgTouchEnd = e => {
        if (!igTouchRef.current) return;
        const dx = e.changedTouches[0].clientX - igTouchRef.current;
        const maxIdx = IG_REELS.length - (window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1);
        if (dx < -50 && igIdx < maxIdx) setIgIdx(i => i + 1);
        if (dx > 50 && igIdx > 0) setIgIdx(i => i - 1);
        igTouchRef.current = null;
    };

    // Build catalog URL from search state
    const buildCatalogUrl = () => {
        const params = new URLSearchParams();
        if (searchTipo) params.set('tipo', searchTipo);
        if (searchPrecio && searchPrecio !== 'Sin límite') params.set('precio', searchPrecio);
        return `${CATALOGO}?${params.toString()}`;
    };

    const catTouch = useRef(null);
    const onCatTouchStart = e => { catTouch.current = e.touches[0].clientX; };
    const onCatTouchEnd = e => {
        if (!catTouch.current) return;
        const dx = e.changedTouches[0].clientX - catTouch.current;
        if (dx < -50 && catIdx < CATEGORIAS.length - 1) setCatIdx(i => i + 1);
        if (dx > 50 && catIdx > 0) setCatIdx(i => i - 1);
        catTouch.current = null;
    };
    useEffect(() => {
        if (!catTrackRef.current || window.innerWidth > 768) return;
        gsap.to(catTrackRef.current, { x: -catIdx * (window.innerWidth * 0.78 + 20), duration: 0.5, ease: 'power3.out' });
        // Add/remove active class for mobile description animation
        const cards = catTrackRef.current.querySelectorAll('.cat-card');
        cards.forEach((c, i) => {
            if (i === catIdx) c.classList.add('cat-active');
            else c.classList.remove('cat-active');
        });
    }, [catIdx]);

    // Mobile auto-cycle for categories
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const checkMobile = () => window.innerWidth <= 768;
        if (!checkMobile()) return;
        const interval = setInterval(() => {
            if (!checkMobile()) return;
            setCatIdx(prev => (prev + 1) % CATEGORIAS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const propTouch = useRef(null);
    const onPropTouchStart = e => { propTouch.current = e.touches[0].clientX; };
    const onPropTouchEnd = e => {
        if (!propTouch.current) return;
        const dx = e.changedTouches[0].clientX - propTouch.current;
        if (dx < -50 && propIdx < PROPIEDADES.length - 1) setPropIdx(i => i + 1);
        if (dx > 50 && propIdx > 0) setPropIdx(i => i - 1);
        propTouch.current = null;
    };

    return (
        <div style={{ background: 'var(--black)', minHeight: '100vh', overflowX: 'hidden', fontFamily: "'Montserrat',sans-serif" }}>

            {/* ══════ HERO ══════ */}
            <section className="hero" ref={heroRef}>
                <img className="hero-bg" src="hero.png" alt="Propiedad" />
                <div className="hero-gradient" />
                <div className="hero-gradient-bottom" />
                <div className="hero-inner">
                    <div className="hero-content">
                        <h1 ref={heroH1Ref}>
                            <span style={{ display: 'block' }}>Encontrá el lugar</span>
                            <span style={{ display: 'block' }}>que podés llamar <em>hogar</em></span>
                        </h1>
                        <p className="hero-desc" ref={heroDescRef}>
                            En Puntos Cardinales Bienes Raíces te acompañamos a encontrar la propiedad ideal en la Patagonia Argentina. Ventas, tasaciones, alquileres y administración de propiedades con atención personalizada.
                        </p>

                        <div className="hero-search" ref={heroSearchRef}>
                            <SearchCol label="Tipo de propiedad" value={searchTipo} options={SEARCH_OPTIONS.tipo} isOpen={openDrop === 'tipo'} onChange={setSearchTipo} onToggle={v => setOpenDrop(v ? 'tipo' : null)} />
                            <SearchCol label="Precio" value={searchPrecio} options={SEARCH_OPTIONS.precio} isOpen={openDrop === 'precio'} onChange={setSearchPrecio} onToggle={v => setOpenDrop(v ? 'precio' : null)} />
                            <button className="hero-search-btn" onClick={() => navigate(buildCatalogUrl())}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="#0a0800" strokeWidth="1.8" /><path d="M11 11l3.5 3.5" stroke="#0a0800" strokeWidth="1.8" strokeLinecap="round" /></svg>
                                Buscar
                            </button>
                        </div>

                        <div className="hero-stats" ref={heroStatsRef}>
                            {[['+ 500', 'Propiedades vendidas'], ['25 Años', 'De experiencia'], ['3', 'Profesionales']].map(([n, l]) => (
                                <div key={l} className="hero-stat">
                                    <div className="hero-stat-number">{n}</div>
                                    <div className="hero-stat-label">{l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════ MARQUEE ══════ */}
            <div style={sMarqueeWrap}>
                <div style={sMarqueeTrack}>
                    {[0, 1].map(r => (<div key={r} style={{ display: 'flex', flexShrink: 0 }}>{['Venta', '·', 'Alquiler', '·', 'Tasaciones', '·', 'Asesoramiento', '·', 'Inversiones', '·', 'Administración', '·'].map((t, i) => (<span key={`${r}-${i}`} style={sMarqueeItem}>{t}</span>))}</div>))}
                </div>
            </div>

            {/* ══════ CATEGORÍAS ══════ */}
            <section className="cat-section" ref={catSectionRef} id="categorias">
                <div className="cat-inner">
                    <div className="cat-header" ref={catHeaderRef}>
                        <div>
                            <div className="sec-label"><div className="sec-label-line" /><span className="sec-label-text">¿Qué estás buscando?</span></div>
                            <h2 style={{ fontWeight: 800, fontSize: 'clamp(28px,4vw,48px)', color: 'var(--white)', lineHeight: 1.1 }}>Encontrá el espacio <span className="gt">ideal.</span></h2>
                            <p style={{ fontWeight: 300, fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 12, lineHeight: 1.8, maxWidth: 480 }}>Desde el hogar de tus sueños hasta el próximo paso para tu negocio.</p>
                        </div>
                        <Link to={`${CATALOGO}`} className="btn-ghost" style={{ textDecoration: 'none' }}>Ver catálogo →</Link>
                    </div>
                    <div className="cat-viewport" onTouchStart={onCatTouchStart} onTouchEnd={onCatTouchEnd}>
                        <div className="cat-track" ref={catTrackRef}>
                            {CATEGORIAS.map((cat, i) => (
                                <Link
                                    to={`${CATALOGO}?${cat.filtro}`}
                                    key={cat.id}
                                    className="cat-card"
                                    ref={el => catCardsRef.current[i] = el}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <img className="cat-card-img" src={cat.img} alt={cat.label} loading="lazy" />
                                    <div className="cat-card-overlay" />
                                    <div className="cat-card-tag">{cat.sub}</div>
                                    <div className="cat-card-content">
                                        <div className="cat-card-sub">{cat.sub}</div>
                                        <div className="cat-card-title">{cat.label}</div>
                                        <div className="cat-card-desc">{cat.desc}</div>
                                        <span className="cat-card-explore">Explorar →</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="cat-dots">{CATEGORIAS.map((_, i) => (<button key={i} onClick={() => setCatIdx(i)} className="cat-dot" style={{ background: i === catIdx ? 'var(--gold-2)' : 'rgba(201,168,76,0.25)', transform: i === catIdx ? 'scale(1.3)' : 'scale(1)' }} />))}</div>
                </div>
            </section>

            {/* ══════ SERVICIOS ══════ */}
            <section style={{ ...sSec, background: 'var(--black2)', borderTop: '1px solid var(--border-s)', borderBottom: '1px solid var(--border-s)' }} id="servicios">
                <div className="sec-inner-r" style={sSecInner}>
                    <div className="serv-grid" style={sServGrid}>
                        <div className="reveal" style={{ position: 'relative' }}>
                            <div style={sServImgWrap}>
                                <div style={sServImg1}><img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /><div style={sServImg1Overlay} /></div>
                                <div style={sServImg2} className="reveal rv2"><img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                                <div style={sServBadge} className="reveal rv3">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ display: 'flex' }}>{['MG', 'RA', 'LF', 'SP'].map((ini, i) => (<div key={ini} style={{ ...sAvatar, marginLeft: i === 0 ? 0 : -8, zIndex: 4 - i }}><span style={{ fontSize: 9, fontWeight: 700, color: 'var(--gold-2)' }}>{ini}</span></div>))}</div>
                                        <div><div style={{ fontSize: 18, fontWeight: 800, color: 'var(--white)', lineHeight: 1 }}>+800</div><div style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Clientes satisfechos</div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div className="reveal">
                                <div className="sec-label"><div className="sec-label-line" /><span className="sec-label-text">Bienvenido a tu próxima inversión</span></div>
                                <h2 style={{ fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', color: 'var(--white)', lineHeight: 1.1, marginBottom: 16 }}>en <span className="gt">la Patagonia Argentina.</span></h2>
                                <p style={{ fontWeight: 300, fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.85, marginBottom: 36, maxWidth: 480 }}>Nos especializamos en propiedades con foco en inversión y calidad de vida. Empresa familiar con 25 años de trayectoria y 3 profesionales dedicados a brindarte la mejor atención.</p>
                            </div>
                            <div className="feat-grid" style={sFeatGrid}>
                                {[{ ico: <SearchIco />, title: 'Búsqueda a medida', desc: 'Analizamos tu perfil y te acercamos opciones que se ajustan a lo que buscás.' }, { ico: <TasIco />, title: 'Tasación gratuita', desc: 'Valuación profesional basada en datos reales del mercado local.' }, { ico: <LegalIco />, title: 'Respaldo legal', desc: 'Documentación verificada y acompañamiento jurídico en cada operación.' }, { ico: <InvIco />, title: 'Inversión inteligente', desc: 'Te asesoramos sobre ROI, renta proyectada y revalorización.' }].map((f, i) => (
                                    <div key={f.title} className={`reveal rv${i + 1}`} style={sFeature}><div style={{ marginBottom: 12 }}>{f.ico}</div><div style={{ fontSize: 13, fontWeight: 700, color: 'var(--white)', marginBottom: 6 }}>{f.title}</div><div style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{f.desc}</div></div>
                                ))}
                            </div>
                            <div className="reveal rv4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 32 }}>
                                <a href="/propiedades" className="btn-gold">Explorar propiedades →</a>
                                <a href={WA + '?text=Hola, quiero asesoramiento'} target="_blank" rel="noreferrer" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><WaIcoSmall />+54 9 2945 441507</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════ PROPIEDADES ══════ */}
            <section style={sSec} id="propiedades">
                <div className="sec-inner-r" style={sSecInner}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 52, flexWrap: 'wrap', gap: 20 }}>
                        <div className="reveal">
                            <div className="sec-label"><div className="sec-label-line" /><span className="sec-label-text">Selección exclusiva</span></div>
                            <h2 className="sec-title-sm">Propiedades <span className="gt">destacadas</span></h2>
                        </div>
                        <div className="reveal rv2" style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setPropIdx(i => Math.max(0, i - 1))} style={{ ...sArrow, opacity: propIdx === 0 ? .3 : 1 }}><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="var(--gold-2)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                            <button onClick={() => setPropIdx(i => Math.min(PROPIEDADES.length - 1, i + 1))} style={{ ...sArrow, opacity: propIdx === PROPIEDADES.length - 1 ? .3 : 1 }}><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 4l5 5-5 5" stroke="var(--gold-2)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                        </div>
                    </div>
                    <div style={{ overflow: 'hidden' }} onTouchStart={onPropTouchStart} onTouchEnd={onPropTouchEnd}>
                        <div style={{ display: 'flex', gap: 24, transition: 'transform .55s cubic-bezier(.16,1,.3,1)', transform: `translateX(calc(-${propIdx} * (min(340px, 90vw) + 24px)))` }}>
                            {PROPIEDADES.map(p => <PropCard key={p.id} prop={p} />)}
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                        {PROPIEDADES.map((_, i) => <button key={i} onClick={() => setPropIdx(i)} style={{ width: 6, height: 6, borderRadius: '50%', border: 'none', cursor: 'pointer', transition: 'all .3s', padding: 0, background: i === propIdx ? 'var(--gold-2)' : 'rgba(201,168,76,0.25)', transform: i === propIdx ? 'scale(1.3)' : 'scale(1)' }} />)}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 44 }} className="reveal"><Link to={CATALOGO} className="btn-ghost" style={{ textDecoration: 'none' }}>Ver todas las propiedades →</Link></div>
                </div>
            </section>

            {/* ══════ NOSOTROS ══════ */}
            <section style={{ ...sSec, background: 'var(--black3)', borderTop: '1px solid var(--border-s)' }} id="nosotros">
                <div className="sec-inner-r" style={sSecInner}>
                    <div className="about-grid" style={sAboutGrid}>
                        <div>
                            <div className="reveal"><div className="sec-label"><div className="sec-label-line" /><span className="sec-label-text">Quiénes somos</span></div><h2 style={{ fontWeight: 800, fontSize: 'clamp(28px,4vw,52px)', color: 'var(--white)', lineHeight: 1.1, marginBottom: 20 }}>Construyendo <span className="gt">confianza.</span></h2></div>
                            <div className="reveal rv1" style={{ width: 48, height: 2, background: 'linear-gradient(90deg,var(--gold-2),transparent)', marginBottom: 28 }} />
                            <p className="reveal rv2" style={{ fontWeight: 300, fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.9, marginBottom: 20 }}>Puntos Cardinales Bienes Raíces es una empresa familiar con 25 años de trayectoria en el mercado inmobiliario de la Patagonia Argentina. Contamos con 3 profesionales dedicados a brindarte atención personalizada.</p>
                            <p className="reveal rv3" style={{ fontWeight: 300, fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.9, marginBottom: 36 }}>Desde la Patagonia Argentina, Argentina, acompañamos a compradores, vendedores e inversores con tasaciones precisas, venta y alquiler de inmuebles.</p>
                            <div className="reveal rv4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}><a href={WA + '?text=Hola, quiero tasar mi propiedad'} target="_blank" rel="noreferrer" className="btn-gold">Tasá tu propiedad</a><a href="/tasacion" className="btn-ghost">Contactanos</a></div>
                        </div>
                        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignSelf: 'center' }}>
                            {[{ n: '+500', l: 'Propiedades vendidas' }, { n: '25 Años', l: 'En el mercado' }, { n: '3', l: 'Profesionales dedicados' }, { n: '24hs', l: 'Tiempo de respuesta' }].map((s, i) => (
                                <div key={s.l} className={`reveal rv${i + 1}`} style={sStatBox}><div className="gt" style={{ fontSize: 'clamp(32px,3.5vw,52px)', fontWeight: 300, lineHeight: 1, marginBottom: 8 }}>{s.n}</div><div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{s.l}</div></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════ INSTAGRAM ══════ */}
            <section style={{ ...sSec, background: 'var(--black2)', borderTop: '1px solid var(--border-s)', position: 'relative', overflow: 'hidden' }} ref={igRef}>
                <div className="ig-glow-orb" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(225,48,108,0.06), transparent 70%)', top: '-15%', left: '-8%' }} />
                <div className="ig-glow-orb" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(188,24,136,0.04), transparent 70%)', bottom: '0%', right: '-5%' }} />
                <div className="ig-glow-orb" style={{ width: 300, height: 300, background: 'radial-gradient(circle, rgba(201,168,76,0.04), transparent 70%)', top: '40%', left: '50%' }} />
                <div className="ig-inner">
                    <div style={{ textAlign: 'center', marginBottom: 20 }} className="reveal">
                        <div className="sec-label" style={{ justifyContent: 'center' }}><div className="sec-label-line" /><span className="sec-label-text">Seguinos en redes</span><div className="sec-label-line" style={{ background: 'linear-gradient(90deg,var(--gold-2),transparent)' }} /></div>
                        <h2 className="sec-title">Mirá nuestros <span className="gt">reels</span></h2>
                    </div>

                    <div className="ig-profile">
                        <div className="ig-avatar">
                            <div className="ig-avatar-inner">
                                <img src="/logo.png" alt="PC" style={{ background: '#0D0D12' }} />
                            </div>
                        </div>
                        <div className="ig-handle">
                            {IG_HANDLE}
                            <span>Puntos Cardinales Bienes Raíces</span>
                        </div>
                        <a href={IG_URL} target="_blank" rel="noreferrer" className="ig-follow-btn">Seguir</a>
                    </div>

                    <div className="ig-carousel-wrap">
                        <div className="ig-carousel-viewport" onTouchStart={onIgTouchStart} onTouchEnd={onIgTouchEnd}>
                            <div className="ig-carousel-track" ref={igTrackRef}>
                                {IG_REELS.map((reel, i) => (
                                    <div key={reel.id} className="ig-reel-card">
                                        <iframe
                                            src={`https://www.instagram.com/reel/${reel.id}/embed/`}
                                            title={reel.caption}
                                            loading="lazy"
                                            allowTransparency="true"
                                            allow="encrypted-media"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="ig-carousel-nav">
                            <button className="ig-nav-arrow" disabled={igIdx === 0} onClick={() => setIgIdx(i => Math.max(0, i - 1))}>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="var(--gold-2)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                            <div className="ig-nav-dots">
                                {IG_REELS.map((_, i) => (
                                    <button key={i} onClick={() => setIgIdx(i)} className="ig-nav-dot" style={{ background: i === igIdx ? 'var(--gold-2)' : 'rgba(201,168,76,0.2)', transform: i === igIdx ? 'scale(1.4)' : 'scale(1)' }} />
                                ))}
                            </div>
                            <button className="ig-nav-arrow" disabled={igIdx >= IG_REELS.length - (typeof window !== 'undefined' && window.innerWidth > 1024 ? 3 : 2)} onClick={() => setIgIdx(i => i + 1)}>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 4l5 5-5 5" stroke="var(--gold-2)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className="ig-cta-row">
                        <a href={IG_URL} target="_blank" rel="noreferrer" className="ig-cta-link">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /></svg>
                            Ver perfil completo
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                        </a>
                    </div>
                </div>
            </section>

            {/* ══════ TESTIMONIOS ══════ */}
            <TestimoniosSection />

            {/* ══════ CTA ══════ */}
            <section style={sCta} id="contacto">
                <div style={sCtaGlow} />
                <div style={{ ...sGridWrap, opacity: .4 }}>{[20, 50, 80].map(l => <div key={l} style={{ ...sGridV, left: `${l}%` }} />)}{[40, 70].map(t => <div key={t} style={{ ...sGridH, top: `${t}%` }} />)}</div>
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }} className="reveal"><div style={{ width: 60, height: 1, background: 'linear-gradient(90deg,transparent,var(--gold-2))' }} /><div style={{ width: 8, height: 8, background: 'var(--gold-2)', transform: 'rotate(45deg)' }} /><div style={{ width: 60, height: 1, background: 'linear-gradient(90deg,var(--gold-2),transparent)' }} /></div>
                    <h2 className="reveal rv1" style={{ fontWeight: 800, fontSize: 'clamp(28px,5vw,64px)', color: 'var(--white)', lineHeight: 1.1, marginBottom: 16 }}>¿Listo para el <span className="gt">próximo paso?</span></h2>
                    <p className="reveal rv2" style={{ fontWeight: 300, fontSize: 15, color: 'rgba(255,255,255,0.45)', maxWidth: 480, margin: '0 auto 44px', lineHeight: 1.8 }}>Escribinos por WhatsApp y recibí asesoramiento inmediato. Sin formularios, sin esperas.</p>
                    <div className="reveal rv3" style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
                        <a href={WA + '?text=Hola, quiero asesoramiento'} target="_blank" rel="noreferrer" className="btn-gold" style={{ fontSize: 13, padding: '18px 48px' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.025.506 3.932 1.395 5.608L.054 23.395a.5.5 0 00.611.586l5.584-1.468A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.332-1.546l-.382-.228-3.32.873.884-3.236-.253-.4A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>Escribinos ahora</a>
                        <a href="tel:+5492945441507" className="btn-ghost">Llamar al +54 9 2945 441507</a>
                    </div>
                </div>
            </section>

            <a href={WA + '?text=Hola, estoy navegando su web'} target="_blank" rel="noreferrer" style={sWaFloat}><svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.025.506 3.932 1.395 5.608L.054 23.395a.5.5 0 00.611.586l5.584-1.468A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.332-1.546l-.382-.228-3.32.873.884-3.236-.253-.4A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg></a>
        </div>
    );
}

/* ─── SUB-COMPONENTES ─── */
function PropCard({ prop }) {
    const [hov, setHov] = useState(false);

    // Format price correctly depending on the mock object
    const formatPrice = (p) => {
        if (p.moneda === 'USD') return `USD ${p.precio.toLocaleString('es-AR')}`;
        // Para pesos u otros
        return `$${p.precio.toLocaleString('es-AR')}`;
    };

    return (
        <Link to={`/propiedad/${prop.id}`} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ ...sPropCard, textDecoration: 'none', color: 'inherit', borderColor: hov ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.08)', transform: hov ? 'translateY(-8px)' : 'translateY(0)', boxShadow: hov ? '0 28px 70px rgba(0,0,0,0.55)' : '0 4px 20px rgba(0,0,0,0.2)' }}>
            <div style={{ position: 'relative', height: 240, overflow: 'hidden', flexShrink: 0 }}>
                <img src={prop.img} alt={prop.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .7s cubic-bezier(.16,1,.3,1)', transform: hov ? 'scale(1.07)' : 'scale(1)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 45%,rgba(5,5,8,0.85))' }} />
                <div style={{ position: 'absolute', top: 14, left: 14, padding: '5px 14px', fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', background: 'linear-gradient(120deg,var(--gold-1),var(--gold-2),var(--gold-3))', color: '#0a0800', backgroundSize: '200%', animation: 'goldShift 4s ease infinite' }}>{prop.tipo}</div>
            </div>
            <div style={{ padding: '22px 24px 24px' }}>
                <div className="gt" style={{ fontSize: 24, fontWeight: 400, lineHeight: 1, marginBottom: 6 }}>{formatPrice(prop)}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--white)', marginBottom: 4 }}>{prop.titulo}</div>
                <div style={{ fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.4)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 5 }}><svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 00-3.5 3.5C2.5 7.5 6 11 6 11s3.5-3.5 3.5-6.5A3.5 3.5 0 006 1zm0 4.5a1 1 0 110-2 1 1 0 010 2z" fill="rgba(255,255,255,0.4)" /></svg>{prop.zona}</div>
                <div style={{ display: 'flex', gap: 16, paddingTop: 14, borderTop: '1px solid rgba(201,168,76,0.08)', alignItems: 'center' }}>
                    {prop.dorms > 0 && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}><span style={{ fontWeight: 600, color: 'var(--off)' }}>{prop.dorms}</span> dorm.</div>}
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}><span style={{ fontWeight: 600, color: 'var(--off)' }}>{prop.banos}</span> baño{prop.banos > 1 ? 's' : ''}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}><span style={{ fontWeight: 600, color: 'var(--off)' }}>{prop.m2}m²</span></div>
                </div>
            </div>

        </Link>
    );
}

const SearchIco = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="8.5" cy="8.5" r="5.5" stroke="url(#si)" strokeWidth="1.5" /><path d="M13 13l4 4" stroke="url(#si)" strokeWidth="1.5" strokeLinecap="round" /><defs><linearGradient id="si" x1="0" y1="0" x2="20" y2="20"><stop stopColor="#C9A84C" /><stop offset="1" stopColor="#FDEAA8" /></linearGradient></defs></svg>;
const TasIco = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="13" rx="2" stroke="url(#ti)" strokeWidth="1.5" /><path d="M6 8h8M6 12h5" stroke="url(#ti)" strokeWidth="1.5" strokeLinecap="round" /><defs><linearGradient id="ti" x1="0" y1="0" x2="20" y2="20"><stop stopColor="#C9A84C" /><stop offset="1" stopColor="#FDEAA8" /></linearGradient></defs></svg>;
const LegalIco = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V5l7-3z" stroke="url(#li)" strokeWidth="1.5" strokeLinejoin="round" /><path d="M7 10l2 2 4-4" stroke="url(#li)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><defs><linearGradient id="li" x1="0" y1="0" x2="20" y2="20"><stop stopColor="#C9A84C" /><stop offset="1" stopColor="#FDEAA8" /></linearGradient></defs></svg>;
const InvIco = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 14l4-4 3 3 4-5 3 2" stroke="url(#ii)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="17" cy="5" r="2" stroke="url(#ii)" strokeWidth="1.5" /><defs><linearGradient id="ii" x1="0" y1="0" x2="20" y2="20"><stop stopColor="#C9A84C" /><stop offset="1" stopColor="#FDEAA8" /></linearGradient></defs></svg>;
const WaIcoSmall = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--gold-2)"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.025.506 3.932 1.395 5.608L.054 23.395a.5.5 0 00.611.586l5.584-1.468A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.332-1.546l-.382-.228-3.32.873.884-3.236-.253-.4A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>;

/* ─── STYLES ─── */
const sMarqueeWrap = { background: 'var(--black)', borderTop: '1px solid rgba(201,168,76,0.07)', borderBottom: '1px solid rgba(201,168,76,0.07)', padding: '18px 0', overflow: 'hidden' };
const sMarqueeTrack = { display: 'flex', animation: 'marquee 28s linear infinite' };
const sMarqueeItem = { fontSize: 17, fontWeight: 400, color: 'rgba(201,168,76,0.22)', letterSpacing: '.28em', textTransform: 'uppercase', padding: '0 40px', flexShrink: 0 };
const sSec = { position: 'relative', padding: '110px 0', background: 'var(--black)', overflow: 'hidden' };
const sSecInner = { maxWidth: 1320, margin: '0 auto', padding: '0 60px' };
const sServGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' };
const sServImgWrap = { position: 'relative', height: 500 };
const sServImg1 = { position: 'absolute', top: 0, left: 0, right: 60, height: 380, overflow: 'hidden', borderRadius: 2 };
const sServImg1Overlay = { position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 60%,rgba(13,13,18,0.7))' };
const sServImg2 = { position: 'absolute', bottom: 0, right: 0, width: '52%', height: 220, overflow: 'hidden', border: '3px solid var(--black2)', borderRadius: 2, boxShadow: '0 20px 60px rgba(0,0,0,0.6)' };
const sServBadge = { position: 'absolute', bottom: 40, left: -20, background: 'rgba(13,13,18,0.95)', border: '1px solid rgba(201,168,76,0.2)', padding: '16px 20px', backdropFilter: 'blur(10px)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' };
const sAvatar = { width: 30, height: 30, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '2px solid rgba(13,13,18,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const sFeatGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 };
const sFeature = { padding: '20px', border: '1px solid rgba(255,255,255,0.05)', transition: 'border-color .3s', borderRadius: 2 };
const sArrow = { width: 44, height: 44, border: '1px solid rgba(201,168,76,0.25)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s', borderRadius: 2 };
const sPropCard = { width: 'min(340px,82vw)', flexShrink: 0, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 2, overflow: 'hidden', transition: 'all .45s cubic-bezier(.16,1,.3,1)', display: 'flex', flexDirection: 'column' };
const sAboutGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' };
const sStatBox = { padding: '28px 24px', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 2, transition: 'all .3s' };
const sCta = { position: 'relative', padding: '140px 48px', background: 'var(--black)', overflow: 'hidden' };
const sCtaGlow = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, background: 'radial-gradient(circle, rgba(201,168,76,0.07), transparent 70%)', pointerEvents: 'none' };
const sGridWrap = { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 };
const sGridV = { position: 'absolute', top: 0, width: 1, height: '100%', background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.05), transparent)' };
const sGridH = { position: 'absolute', left: 0, height: 1, width: '100%', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.05), transparent)' };
const sWaFloat = { position: 'fixed', bottom: 28, right: 28, width: 58, height: 58, background: 'linear-gradient(135deg,#25D366,#128C7E)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px rgba(37,211,102,0.4)', zIndex: 999, transition: 'transform .2s', textDecoration: 'none' };