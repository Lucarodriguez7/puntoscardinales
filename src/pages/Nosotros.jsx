import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const WA = 'https://wa.me/5492945441507';

const VALORES = [
    { num: '01', title: 'Transparencia', desc: 'Cada operación es clara desde el primer día. Sin letra chica, sin sorpresas. Tu confianza es nuestro capital.' },
    { num: '02', title: 'Compromiso familiar', desc: 'Somos una empresa familiar. Nos involucramos personalmente en cada operación como si fuera propia.' },
    { num: '03', title: 'Experiencia', desc: '25 años en el mercado inmobiliario de la Patagonia Argentina nos dieron el conocimiento que solo se adquiere con trayectoria real.' },
    { num: '04', title: 'Cercanía', desc: 'Atención personalizada con 3 profesionales dedicados. Hablás con nosotros, siempre.' },
];

const TIMELINE = [
    { year: '2001', text: 'Nace Puntos Cardinales Bienes Raíces como empresa familiar, con la visión de ofrecer un servicio inmobiliario cercano y profesional en la Patagonia Argentina.' },
    { year: '2008', text: 'Consolidamos presencia en las zonas de Parque Camet, Centro y Playa Grande, alcanzando las primeras 200 operaciones exitosas.' },
    { year: '2014', text: 'Expandimos a barrios residenciales: Los Troncos, Güemes, Alfar, Divino Rostro y Punta Mogotes.' },
    { year: '2020', text: 'Incorporamos tecnología al servicio: tasaciones digitales, recorridos virtuales y atención personalizada 24/7.' },
    { year: '2025', text: 'Celebramos 25 años en el mercado inmobiliario de la Patagonia Argentina y lanzamos nuestra plataforma web para conectar propietarios e inversores.' },
];

const STATS = [
    { number: '+500', label: 'Operaciones cerradas' },
    { number: '25', label: 'Años en la Patagonia Argentina' },
    { number: '3', label: 'Profesionales dedicados' },
    { number: '24hs', label: 'Respuesta garantizada' },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
.nos-page{min-height:100vh;background:#050508;font-family:'Montserrat',sans-serif;overflow-x:hidden;}

/* ═══ HERO ═══ */
.nos-hero{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden;}
.nos-hero-bg{position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80') center/cover;filter:brightness(0.25) saturate(0.6);}
.nos-hero-overlay{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(5,5,8,0.5),rgba(5,5,8,0.95));}
.nos-hero-content{position:relative;z-index:2;text-align:center;max-width:800px;padding:0 40px;}
.nos-hero-line{width:1px;height:80px;background:linear-gradient(to bottom,transparent,#C9A84C);margin:0 auto 32px;transform-origin:top;}
.nos-hero-label{font-size:10px;font-weight:600;letter-spacing:.4em;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:20px;}
.nos-hero h1{font-size:clamp(36px,7vw,80px);font-weight:900;color:#fff;line-height:1.02;margin-bottom:20px;letter-spacing:-1px;}
.nos-hero h1 .gt{background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8,#C9A84C);background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:nGold 5s ease infinite;}
.nos-hero p{font-size:16px;font-weight:300;color:rgba(255,255,255,0.45);line-height:1.85;max-width:520px;margin:0 auto;}
.nos-hero-scroll{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;}
.nos-hero-scroll span{font-size:8px;letter-spacing:.3em;text-transform:uppercase;color:rgba(201,168,76,0.35);}
.nos-hero-scroll-line{width:1px;height:40px;background:linear-gradient(to bottom,rgba(201,168,76,0.4),transparent);}

/* ═══ MISSION — split layout ═══ */
.nos-mission{position:relative;padding:160px 0;overflow:hidden;}
.nos-mission-inner{max-width:1300px;margin:0 auto;padding:0 60px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
.nos-mission-img-wrap{position:relative;height:550px;}
.nos-mission-img{position:absolute;border-radius:14px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,0.5);}
.nos-mission-img img{width:100%;height:100%;object-fit:cover;display:block;}
.nos-mission-img-1{top:0;left:0;width:70%;height:65%;z-index:2;border:2px solid rgba(201,168,76,0.1);}
.nos-mission-img-2{bottom:0;right:0;width:55%;height:50%;z-index:1;}
.nos-mission-float{position:absolute;bottom:60px;left:50%;transform:translateX(-50%);background:rgba(13,13,18,0.95);border:1px solid rgba(201,168,76,0.2);backdrop-filter:blur(16px);padding:18px 24px;border-radius:12px;z-index:3;display:flex;align-items:center;gap:14px;box-shadow:0 12px 40px rgba(0,0,0,0.5);}
.nos-mission-float-num{font-size:32px;font-weight:900;background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:nGold 4s ease infinite;line-height:1;}
.nos-mission-float-text{font-size:10px;font-weight:500;color:rgba(255,255,255,0.5);letter-spacing:.1em;text-transform:uppercase;line-height:1.4;}
.nos-mission-text h2{font-size:clamp(28px,4vw,48px);font-weight:800;color:#fff;line-height:1.1;margin-bottom:24px;}
.nos-mission-text h2 .gt{background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8,#C9A84C);background-size:300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:nGold 5s ease infinite;}
.nos-mission-text p{font-size:14px;font-weight:300;color:rgba(255,255,255,0.5);line-height:1.9;margin-bottom:18px;}
.nos-mission-text .highlight{font-size:15px;font-weight:500;color:rgba(201,168,76,0.7);border-left:2px solid #C9A84C;padding-left:16px;margin:28px 0;line-height:1.7;}

/* ═══ VALUES — horizontal reveal ═══ */
.nos-values{position:relative;padding:140px 0;background:#0A0A10;border-top:1px solid rgba(201,168,76,0.06);overflow:hidden;}
.nos-values-inner{max-width:1300px;margin:0 auto;padding:0 60px;}
.nos-values-header{text-align:center;margin-bottom:72px;}
.nos-values-header h2{font-size:clamp(28px,4vw,48px);font-weight:800;color:#fff;margin-bottom:10px;}
.nos-values-header p{font-size:14px;font-weight:300;color:rgba(255,255,255,0.4);max-width:400px;margin:0 auto;}
.nos-values-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;}
.nos-value{padding:48px 36px;border-right:1px solid rgba(201,168,76,0.06);position:relative;}
.nos-value:last-child{border-right:none;}
.nos-value::before{content:'';position:absolute;top:0;left:0;width:100%;height:2px;background:linear-gradient(90deg,#C9A84C,transparent);transform:scaleX(0);transform-origin:left;transition:transform .6s ease;}
.nos-value:hover::before{transform:scaleX(1);}
.nos-value-num{font-size:48px;font-weight:900;line-height:1;background:linear-gradient(120deg,rgba(201,168,76,0.15),rgba(201,168,76,0.05));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:20px;}
.nos-value h4{font-size:16px;font-weight:700;color:#fff;margin-bottom:12px;}
.nos-value p{font-size:12px;font-weight:300;color:rgba(255,255,255,0.4);line-height:1.8;}

/* ═══ TIMELINE — diagonal layout ═══ */
.nos-timeline{position:relative;padding:140px 0;overflow:hidden;}
.nos-timeline-inner{max-width:900px;margin:0 auto;padding:0 60px;position:relative;}
.nos-timeline-header{text-align:center;margin-bottom:80px;}
.nos-timeline-header h2{font-size:clamp(28px,4vw,48px);font-weight:800;color:#fff;margin-bottom:10px;}
.nos-timeline-line{position:absolute;top:0;bottom:0;left:50%;width:1px;background:linear-gradient(to bottom,transparent,rgba(201,168,76,0.15),rgba(201,168,76,0.15),transparent);}
.nos-tl-item{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:60px;position:relative;align-items:center;}
.nos-tl-item:nth-child(even){direction:rtl;}
.nos-tl-item:nth-child(even) > *{direction:ltr;}
.nos-tl-dot{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:#050508;border:2px solid rgba(201,168,76,0.3);z-index:2;transition:all .4s;}
.nos-tl-item.active .nos-tl-dot{background:#C9A84C;border-color:#C9A84C;box-shadow:0 0 16px rgba(201,168,76,0.5);}
.nos-tl-year{font-size:clamp(40px,5vw,64px);font-weight:900;text-align:right;line-height:1;background:linear-gradient(120deg,rgba(201,168,76,0.2),rgba(201,168,76,0.08));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.nos-tl-item:nth-child(even) .nos-tl-year{text-align:left;}
.nos-tl-text{font-size:14px;font-weight:300;color:rgba(255,255,255,0.5);line-height:1.8;padding:20px 0;}

/* ═══ STATS — big cinematic ═══ */
.nos-stats{position:relative;padding:120px 0;background:#0A0A10;border-top:1px solid rgba(201,168,76,0.06);overflow:hidden;}
.nos-stats-inner{max-width:1100px;margin:0 auto;padding:0 60px;display:grid;grid-template-columns:repeat(4,1fr);gap:40px;}
.nos-stat{text-align:center;padding:40px 0;position:relative;}
.nos-stat::after{content:'';position:absolute;right:0;top:20%;height:60%;width:1px;background:rgba(201,168,76,0.08);}
.nos-stat:last-child::after{display:none;}
.nos-stat-num{font-size:clamp(40px,6vw,72px);font-weight:900;line-height:1;background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8,#C9A84C);background-size:300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:nGold 5s ease infinite;margin-bottom:10px;}
.nos-stat-label{font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,0.3);}

/* ═══ CTA ═══ */
.nos-cta{position:relative;padding:140px 60px;text-align:center;overflow:hidden;}
.nos-cta-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:600px;background:radial-gradient(circle,rgba(201,168,76,0.06),transparent 70%);pointer-events:none;}
.nos-cta h2{font-size:clamp(28px,5vw,56px);font-weight:800;color:#fff;margin-bottom:16px;line-height:1.1;}
.nos-cta p{font-size:15px;font-weight:300;color:rgba(255,255,255,0.4);max-width:480px;margin:0 auto 40px;line-height:1.8;}
.nos-cta-actions{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
.nos-cta-wa{display:inline-flex;align-items:center;gap:10px;padding:18px 48px;background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8,#C9A84C);background-size:300% 300%;animation:nGold 5s ease infinite;color:#0a0800;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;border:none;cursor:pointer;transition:all .25s;position:relative;overflow:hidden;}
.nos-cta-wa::before{content:'';position:absolute;top:-60%;left:-120%;width:60%;height:220%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent);transform:skewX(-18deg);animation:nShimmer 3.5s ease infinite;}
.nos-cta-wa:hover{transform:translateY(-3px);box-shadow:0 14px 40px rgba(201,168,76,0.4);}
.nos-cta-ghost{display:inline-flex;align-items:center;gap:10px;padding:17px 40px;background:transparent;color:#C9A84C;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;text-decoration:none;border:1px solid rgba(201,168,76,0.4);transition:all .3s;}
.nos-cta-ghost:hover{background:rgba(201,168,76,0.08);transform:translateY(-3px);}

@keyframes nGold{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes nShimmer{0%{left:-120%}60%,100%{left:160%}}

@media(max-width:1024px){
  .nos-mission-inner{grid-template-columns:1fr;gap:48px;}
  .nos-mission-img-wrap{height:400px;}
  .nos-values-grid{grid-template-columns:1fr 1fr;}
  .nos-value{border-right:none;border-bottom:1px solid rgba(201,168,76,0.06);}
  .nos-stats-inner{grid-template-columns:1fr 1fr;gap:20px;}
}
@media(max-width:768px){
  .nos-hero h1{font-size:36px;}
  .nos-mission-inner{padding:0 24px;}
  .nos-mission-img-wrap{height:320px;}
  .nos-values-inner{padding:0 24px;}
  .nos-values-grid{grid-template-columns:1fr;}
  .nos-value{padding:32px 24px;}
  .nos-timeline-inner{padding:0 24px;}
  .nos-timeline-line{left:20px;}
  .nos-tl-item{grid-template-columns:1fr;gap:8px;padding-left:48px;}
  .nos-tl-item:nth-child(even){direction:ltr;}
  .nos-tl-dot{left:20px;}
  .nos-tl-year{text-align:left !important;font-size:36px;}
  .nos-stats-inner{padding:0 24px;grid-template-columns:1fr 1fr;}
  .nos-stat::after{display:none;}
  .nos-cta{padding:100px 24px;}
}
@media(max-width:480px){
  .nos-stats-inner{grid-template-columns:1fr;}
  .nos-hero h1{font-size:28px;}
}
`;

export default function Nosotros() {
    const heroRef = useRef(null);
    const heroLineRef = useRef(null);
    const missionRef = useRef(null);
    const missionImgsRef = useRef(null);
    const missionTextRef = useRef(null);
    const valuesRef = useRef(null);
    const valueCardsRef = useRef([]);
    const timelineRef = useRef(null);
    const tlItemsRef = useRef([]);
    const statsRef = useRef(null);
    const statItemsRef = useRef([]);
    const ctaRef = useRef(null);

    useEffect(() => {
        if (document.getElementById('nos-css')) return;
        const s = document.createElement('style'); s.id = 'nos-css'; s.textContent = CSS;
        document.head.appendChild(s);
        return () => { const el = document.getElementById('nos-css'); if (el) el.remove(); };
    }, []);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // ═══ HERO ═══
            const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            heroTl
                .fromTo(heroLineRef.current, { scaleY: 0 }, { scaleY: 1, duration: 1.2 }, 0.3)
                .fromTo('.nos-hero-label', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.8)
                .fromTo('.nos-hero h1', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 1)
                .fromTo('.nos-hero p', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 1.3)
                .fromTo('.nos-hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.6);

            // Parallax hero bg
            gsap.to('.nos-hero-bg', {
                y: 150,
                ease: 'none',
                scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 }
            });

            // ═══ MISSION ═══
            // Images: parallax offset
            gsap.fromTo('.nos-mission-img-1', { y: 60, opacity: 0 }, {
                y: 0, opacity: 1, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: missionRef.current, start: 'top 75%' }
            });
            gsap.fromTo('.nos-mission-img-2', { y: 80, opacity: 0, x: 40 }, {
                y: 0, opacity: 1, x: 0, duration: 1, delay: 0.2, ease: 'power3.out',
                scrollTrigger: { trigger: missionRef.current, start: 'top 75%' }
            });
            gsap.fromTo('.nos-mission-float', { y: 30, opacity: 0, scale: 0.9 }, {
                y: 0, opacity: 1, scale: 1, duration: 0.7, delay: 0.5, ease: 'back.out(1.7)',
                scrollTrigger: { trigger: missionRef.current, start: 'top 65%' }
            });
            // Text: stagger
            if (missionTextRef.current) {
                gsap.fromTo(missionTextRef.current.children, { y: 40, opacity: 0 }, {
                    y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
                    scrollTrigger: { trigger: missionTextRef.current, start: 'top 80%' }
                });
            }

            // Parallax on mission images while scrolling
            gsap.to('.nos-mission-img-1', {
                y: -40, ease: 'none',
                scrollTrigger: { trigger: missionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
            });
            gsap.to('.nos-mission-img-2', {
                y: -60, ease: 'none',
                scrollTrigger: { trigger: missionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
            });

            // ═══ VALUES ═══
            gsap.fromTo('.nos-values-header', { y: 40, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: valuesRef.current, start: 'top 80%' }
            });
            valueCardsRef.current.forEach((card, i) => {
                if (!card) return;
                gsap.fromTo(card, { y: 50, opacity: 0, rotateY: 8 }, {
                    y: 0, opacity: 1, rotateY: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
                    scrollTrigger: { trigger: valuesRef.current, start: 'top 70%' }
                });
            });

            // ═══ TIMELINE ═══
            gsap.fromTo('.nos-timeline-header', { y: 40, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: timelineRef.current, start: 'top 80%' }
            });
            // Line grows
            gsap.fromTo('.nos-timeline-line', { scaleY: 0 }, {
                scaleY: 1, ease: 'none', transformOrigin: 'top',
                scrollTrigger: { trigger: timelineRef.current, start: 'top 70%', end: 'bottom 60%', scrub: 1 }
            });
            // Items reveal + dot activates
            tlItemsRef.current.forEach((item, i) => {
                if (!item) return;
                gsap.fromTo(item, { y: 40, opacity: 0 }, {
                    y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: item, start: 'top 80%',
                        onEnter: () => item.classList.add('active'),
                    }
                });
            });

            // ═══ STATS ═══
            statItemsRef.current.forEach((stat, i) => {
                if (!stat) return;
                gsap.fromTo(stat, { y: 60, opacity: 0, scale: 0.85 }, {
                    y: 0, opacity: 1, scale: 1, duration: 0.8, delay: i * 0.12, ease: 'back.out(1.4)',
                    scrollTrigger: { trigger: statsRef.current, start: 'top 80%' }
                });
            });

            // ═══ CTA ═══
            gsap.fromTo(ctaRef.current?.children || [], { y: 40, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
                scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' }
            });

        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="nos-page">
            {/* ═══ HERO ═══ */}
            <section className="nos-hero" ref={heroRef}>
                <div className="nos-hero-bg" />
                <div className="nos-hero-overlay" />
                <div className="nos-hero-content">
                    <div className="nos-hero-line" ref={heroLineRef} />
                    <div className="nos-hero-label">Sobre nosotros</div>
                    <h1>No vendemos propiedades.<br /><span className="gt">Construimos confianza.</span></h1>
                    <p>Desde la Patagonia Argentina, Argentina, acompañamos a familias e inversores en una de las decisiones más importantes de su vida.</p>
                </div>
                <div className="nos-hero-scroll">
                    <span>Descubrí nuestra historia</span>
                    <div className="nos-hero-scroll-line" />
                </div>
            </section>

            {/* ═══ MISSION ═══ */}
            <section className="nos-mission" ref={missionRef}>
                <div className="nos-mission-inner">
                    <div className="nos-mission-img-wrap" ref={missionImgsRef}>
                        <div className="nos-mission-img nos-mission-img-1">
                            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80" alt="Oficina" />
                        </div>
                        <div className="nos-mission-img nos-mission-img-2">
                            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80" alt="Equipo" />
                        </div>
                        <div className="nos-mission-float">
                            <div className="nos-mission-float-num">25</div>
                            <div className="nos-mission-float-text">Años en el<br />mercado</div>
                        </div>
                    </div>
                    <div className="nos-mission-text" ref={missionTextRef}>
                        <h2>Nuestra misión es que<br />tomes la <span className="gt">mejor decisión</span></h2>
                        <p>Puntos Cardinales Bienes Raíces es una empresa familiar con 25 años de trayectoria en el mercado inmobiliario de la Patagonia Argentina. Contamos con 3 profesionales dedicados a brindarte atención personalizada.</p>
                        <div className="highlight">"Cada cliente que confía en nosotros recibe el mismo nivel de dedicación, sin importar el tamaño de la operación. Nos especializamos en tasaciones, venta y alquiler de inmuebles."</div>
                        <p>Trabajamos con un equipo comprometido que conoce cada barrio, cada calle y cada oportunidad del mercado de la Patagonia Argentina. Porque vender o comprar una propiedad no es una transacción — es un antes y un después.</p>
                    </div>
                </div>
            </section>

            {/* ═══ VALUES ═══ */}
            <section className="nos-values" ref={valuesRef}>
                <div className="nos-values-inner">
                    <div className="nos-values-header">
                        <h2>Nuestros <span className="gt">valores</span></h2>
                        <p>Los principios que guían cada operación que hacemos.</p>
                    </div>
                    <div className="nos-values-grid">
                        {VALORES.map((v, i) => (
                            <div key={v.num} className="nos-value" ref={el => valueCardsRef.current[i] = el}>
                                <div className="nos-value-num">{v.num}</div>
                                <h4>{v.title}</h4>
                                <p>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ TIMELINE ═══ */}
            <section className="nos-timeline" ref={timelineRef}>
                <div className="nos-timeline-inner">
                    <div className="nos-timeline-header">
                        <h2>Nuestra <span className="gt">trayectoria</span></h2>
                    </div>
                    <div className="nos-timeline-line" />
                    {TIMELINE.map((t, i) => (
                        <div key={t.year} className="nos-tl-item" ref={el => tlItemsRef.current[i] = el}>
                            <div className="nos-tl-year">{t.year}</div>
                            <div className="nos-tl-text">{t.text}</div>
                            <div className="nos-tl-dot" />
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ STATS ═══ */}
            <section className="nos-stats" ref={statsRef}>
                <div className="nos-stats-inner">
                    {STATS.map((s, i) => (
                        <div key={s.label} className="nos-stat" ref={el => statItemsRef.current[i] = el}>
                            <div className="nos-stat-num">{s.number}</div>
                            <div className="nos-stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className="nos-cta">
                <div className="nos-cta-glow" />
                <div ref={ctaRef} style={{ position: 'relative', zIndex: 2 }}>
                    <h2>¿Listo para <span className="gt">conocernos?</span></h2>
                    <p>Escribinos y descubrí por qué cientos de familias eligieron Puntos Cardinales Bienes Raíces para dar su próximo paso.</p>
                    <div className="nos-cta-actions">
                        <a href={WA + '?text=Hola, quiero conocer más sobre Puntos Cardinales Bienes Raíces'} target="_blank" rel="noreferrer" className="nos-cta-wa">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.025.506 3.932 1.395 5.608L.054 23.395a.5.5 0 00.611.586l5.584-1.468A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.332-1.546l-.382-.228-3.32.873.884-3.236-.253-.4A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>
                            Escribinos ahora
                        </a>
                        <Link to="/propiedades" className="nos-cta-ghost">Ver propiedades</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}