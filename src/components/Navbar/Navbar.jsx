import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const WA = 'https://wa.me/5492945441507';

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Propiedades', href: '/propiedades' },
  { label: 'Tasación', href: '/tasaciones' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },

];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        .cp-nav-bar{position:fixed;top:0;left:0;width:100%;z-index:1000;padding:22px 48px;display:flex;align-items:center;justify-content:space-between;transition:all .4s ease;}
        .cp-nav-bar.scrolled{padding:14px 48px;background:rgba(5,5,8,0.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1px solid rgba(201,168,76,0.08);}
        .cp-nav-logo{display:flex;align-items:center;gap:12px;text-decoration:none;}
        .cp-nav-logo-img{height:60px;width:auto;max-width:250px;object-fit:contain;}
        .cp-nav-links{display:flex;align-items:center;gap:36px;}
        .cp-nav-link{font-family:'Montserrat',sans-serif;font-weight:400;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.6);text-decoration:none;position:relative;transition:color .3s;padding:4px 0;}
        .cp-nav-link::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:linear-gradient(90deg,#C9A84C,#FDEAA8);transition:width .3s;}
        .cp-nav-link:hover{color:#C9A84C;}
        .cp-nav-link:hover::after{width:100%;}
        .cp-nav-cta{position:relative;display:inline-flex;align-items:center;gap:8px;padding:10px 26px;background:linear-gradient(120deg,#8B6914,#C9A84C,#FDEAA8,#C9A84C);background-size:300% 300%;animation:goldShift 5s ease infinite;color:#0a0800;font-family:'Montserrat',sans-serif;font-weight:700;font-size:10px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;border:none;overflow:hidden;transition:transform .25s,box-shadow .25s;}
        .cp-nav-cta::before{content:'';position:absolute;top:-60%;left:-120%;width:60%;height:220%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent);transform:skewX(-18deg);animation:shimmer 3.5s ease infinite;}
        .cp-nav-cta:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(201,168,76,0.4);}
        .cp-nav-hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:8px;z-index:1002;}
        .cp-nav-hamburger span{display:block;width:26px;height:1.5px;background:#C9A84C;transition:all .35s ease;transform-origin:center;}
        .cp-nav-hamburger.open span:nth-child(1){transform:rotate(45deg) translate(4.5px,4.5px);}
        .cp-nav-hamburger.open span:nth-child(2){opacity:0;transform:scaleX(0);}
        .cp-nav-hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(4.5px,-4.5px);}
        .cp-nav-mobile-overlay{position:fixed;inset:0;background:rgba(5,5,8,0.97);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);z-index:1001;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;opacity:0;pointer-events:none;transition:opacity .4s ease;}
        .cp-nav-mobile-overlay.open{opacity:1;pointer-events:all;}
        .cp-nav-mobile-link{font-family:'Montserrat',sans-serif;font-weight:300;font-size:36px;color:rgba(255,255,255,0.8);text-decoration:none;padding:16px 0;transition:color .3s;opacity:0;transform:translateY(20px);}
        .cp-nav-mobile-overlay.open .cp-nav-mobile-link{opacity:1;transform:translateY(0);}
        .cp-nav-mobile-link:nth-child(1){transition:all .4s ease .05s;}
        .cp-nav-mobile-link:nth-child(2){transition:all .4s ease .1s;}
        .cp-nav-mobile-link:nth-child(3){transition:all .4s ease .15s;}
        .cp-nav-mobile-link:nth-child(4){transition:all .4s ease .2s;}
        .cp-nav-mobile-link:nth-child(5){transition:all .4s ease .25s;}
        .cp-nav-mobile-link:hover{color:#C9A84C;}
        .cp-nav-mobile-cta{margin-top:32px;opacity:0;transform:translateY(20px);}
        .cp-nav-mobile-overlay.open .cp-nav-mobile-cta{opacity:1;transform:translateY(0);transition:all .4s ease .35s;}
        .cp-nav-mobile-divider{width:40px;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.3),transparent);margin:20px 0;}
        @keyframes goldShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes shimmer{0%{left:-120%}60%,100%{left:160%}}
        @media(max-width:900px){.cp-nav-bar{padding:16px 20px;}.cp-nav-bar.scrolled{padding:12px 20px;}.cp-nav-links{display:none;}.cp-nav-hamburger{display:flex;}}
      `}</style>

      <header className={`cp-nav-bar${scrolled ? ' scrolled' : ''}`}>
        <Link to="/" className="cp-nav-logo">
          <img src="/logo.png" alt="Puntos Cardinales Bienes Raíces" className="cp-nav-logo-img" />
        </Link>

        <nav className="cp-nav-links">
          {NAV_LINKS.map(link => (
            <Link key={link.label} to={link.href} className="cp-nav-link">{link.label}</Link>
          ))}
          <a href={WA + '?text=Hola, quiero consultar por propiedades'} target="_blank" rel="noreferrer" className="cp-nav-cta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.025.506 3.932 1.395 5.608L.054 23.395a.5.5 0 00.611.586l5.584-1.468A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.332-1.546l-.382-.228-3.32.873.884-3.236-.253-.4A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>
            Consultanos
          </a>
        </nav>

        <button className={`cp-nav-hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
          <span /><span /><span />
        </button>
      </header>

      <div className={`cp-nav-mobile-overlay${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(link => (
          <Link key={link.label} to={link.href} className="cp-nav-mobile-link" onClick={handleLinkClick}>
            {link.label}
          </Link>
        ))}
        <div className="cp-nav-mobile-divider" />
        <a href={WA + '?text=Hola, quiero consultar por propiedades'} target="_blank" rel="noreferrer" className="cp-nav-cta cp-nav-mobile-cta" onClick={handleLinkClick}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.025.506 3.932 1.395 5.608L.054 23.395a.5.5 0 00.611.586l5.584-1.468A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.332-1.546l-.382-.228-3.32.873.884-3.236-.253-.4A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>
          Escribinos por WhatsApp
        </a>
      </div>
    </>
  );
}