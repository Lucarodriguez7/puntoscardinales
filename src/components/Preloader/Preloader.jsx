import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader({ onFinish, fast = false }) {
    const overlayRef = useRef(null);
    const logoRef = useRef(null);
    const nameRef = useRef(null);
    const subRef = useRef(null);
    const lineRef = useRef(null);
    const barWrapRef = useRef(null);
    const barRef = useRef(null);
    const textRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    const exitTl = gsap.timeline({
                        onComplete: () => { if (onFinish) onFinish(); }
                    });

                    if (fast) {
                        exitTl.timeScale(5);
                    }

                    exitTl
                        .to(textRef.current, { opacity: 0, y: -8, duration: 0.3, ease: 'power2.in' })
                        .to(barWrapRef.current, { opacity: 0, scaleX: 0, duration: 0.3, ease: 'power2.in' }, '<0.05')
                        .to(lineRef.current, { scaleX: 0, opacity: 0, duration: 0.35, ease: 'power2.in' }, '<0.05')
                        .to(subRef.current, { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in' }, '<0.05')
                        .to(nameRef.current, { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in' }, '<0.05')
                        .to(logoRef.current, {
                            scale: 1.15,
                            opacity: 0,
                            duration: 0.5,
                            ease: 'power2.in'
                        }, '<0.05')
                        .to(glowRef.current, { opacity: 0, scale: 2, duration: 0.5, ease: 'power2.in' }, '<')
                        .to(overlayRef.current, {
                            yPercent: -100,
                            duration: 0.7,
                            ease: 'power4.inOut'
                        }, '-=0.2');
                }
            });

            // Initial states
            gsap.set(logoRef.current, { opacity: 0, scale: 0.7 });
            gsap.set(nameRef.current, { opacity: 0, y: 20, letterSpacing: '2px' });
            gsap.set(subRef.current, { opacity: 0, y: 14 });
            gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });
            gsap.set(barWrapRef.current, { opacity: 0 });
            gsap.set(barRef.current, { scaleX: 0 });
            gsap.set(textRef.current, { opacity: 0 });
            gsap.set(glowRef.current, { opacity: 0, scale: 0.5 });

            // Entrance
            tl
                .to(glowRef.current, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' })
                .to(logoRef.current, { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }, 0.2)
                .to(logoRef.current, { scale: 1.03, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0.9)
                .to(nameRef.current, { opacity: 1, y: 0, letterSpacing: '10px', duration: 0.8, ease: 'power3.out' }, 0.9)
                .to(subRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 1.15)
                .to(lineRef.current, { scaleX: 1, opacity: 1, duration: 0.7, ease: 'power2.out' }, 1.3)
                .to(barWrapRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 1.5)
                .to(barRef.current, { scaleX: 1, duration: 1.4, ease: 'power1.inOut' }, 1.6)
                .to(textRef.current, { opacity: 0.4, duration: 0.4, ease: 'power2.out' }, 1.6)
                .to({}, { duration: 0.3 });

            if (fast) {
                tl.timeScale(5); // Speed up x5 for ~0.8s total duration
            }
        }, overlayRef);

        return () => ctx.revert();
    }, [onFinish]);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;700&family=Montserrat:wght@300;400;600&display=swap');

        .preloader {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: #050508;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .preloader-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .preloader-inner {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .preloader-logo {
          width: 110px;
          height: 110px;
          object-fit: contain;
          margin-bottom: 24px;
          will-change: transform, opacity;
        }

        .preloader-name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          font-size: 42px;
          text-transform: uppercase;
          background: linear-gradient(120deg, #8B6914, #C9A84C, #FDEAA8, #C9A84C);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: preGoldShift 4s ease infinite;
          line-height: 1;
          will-change: transform, opacity;
          position: relative;
        }
        .preloader-name::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(253,234,168,0.25), transparent);
          transform: skewX(-15deg);
          animation: preShimmer 3s ease 1.5s infinite;
        }

        .preloader-sub {
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          font-size: 10px;
          letter-spacing: 6px;
          text-transform: uppercase;
          color: rgba(201,168,76,0.45);
          margin-top: 4px;
          will-change: transform, opacity;
        }

        .preloader-line {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #C9A84C, transparent);
          margin-top: 28px;
          transform-origin: center;
          will-change: transform, opacity;
        }

        .preloader-bar-wrap {
          width: 140px;
          height: 1.5px;
          background: rgba(201,168,76,0.08);
          margin-top: 22px;
          border-radius: 1px;
          overflow: hidden;
          will-change: opacity;
          transform-origin: center;
        }
        .preloader-bar {
          height: 100%;
          width: 100%;
          background: linear-gradient(90deg, #8B6914, #C9A84C, #FDEAA8);
          border-radius: 1px;
          transform-origin: left;
          will-change: transform;
        }

        .preloader-text {
          font-family: 'Montserrat', sans-serif;
          font-size: 8px;
          font-weight: 400;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-top: 16px;
          will-change: opacity;
        }

        .preloader-particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(201,168,76,0.2);
          pointer-events: none;
        }

        @keyframes preGoldShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes preShimmer {
          0% { left: -100%; }
          60%, 100% { left: 200%; }
        }
      `}</style>

            <div className="preloader" ref={overlayRef}>
                <div className="preloader-glow" ref={glowRef} />

                {[...Array(6)].map((_, i) => (
                    <div key={i} className="preloader-particle" style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                        opacity: 0.1 + Math.random() * 0.15,
                        width: 1 + Math.random() * 2,
                        height: 1 + Math.random() * 2,
                    }} />
                ))}

                <div className="preloader-inner">
                    <img ref={logoRef} className="preloader-logo" src="/logo.png" alt="Puntos Cardinales Bienes Raíces" />
                    <div ref={nameRef} className="preloader-name">Puntos Cardinales</div>
                    <div ref={subRef} className="preloader-sub">Bienes Raíces</div>
                    <div ref={lineRef} className="preloader-line" />
                    <div ref={barWrapRef} className="preloader-bar-wrap">
                        <div ref={barRef} className="preloader-bar" />
                    </div>
                    <div ref={textRef} className="preloader-text">Cargando</div>
                </div>
            </div>
        </>
    );
}