const WA = 'https://wa.me/5492945441507';
const IG = 'https://www.instagram.com/puntoscardinalesbienesraices';

export default function Footer() {
    return (
        <>
            <style>{`
        .cp-footer {
          background: #030305;
          border-top: 1px solid rgba(201,168,76,0.08);
          padding: 64px 48px 28px;
          font-family: 'Montserrat', sans-serif;
        }
        .cp-footer-inner {
          max-width: 1280px;
          margin: 0 auto;
        }
        .cp-footer-top {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 56px;
        }

        /* Brand col */
        .cp-footer-brand-logo {
          height: 80px;
          width: auto;
          max-width: 250px;
          object-fit: contain;
          margin-bottom: 18px;
        }
        .cp-footer-brand-desc {
          font-weight: 300;
          font-size: 13px;
          color: rgba(255,255,255,0.38);
          line-height: 1.8;
          max-width: 320px;
          margin-bottom: 24px;
        }

        /* Social */
        .cp-footer-social {
          display: flex;
          gap: 12px;
        }
        .cp-footer-social a {
          width: 40px;
          height: 40px;
          border: 1px solid rgba(201,168,76,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .cp-footer-social a:hover {
          border-color: rgba(201,168,76,0.5);
          background: rgba(201,168,76,0.06);
          transform: translateY(-2px);
        }

        /* Columns */
        .cp-footer-col h4 {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #C9A84C;
          margin-bottom: 22px;
        }
        .cp-footer-col a {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 300;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          margin-bottom: 14px;
          transition: color 0.3s ease;
        }
        .cp-footer-col a:hover {
          color: #C9A84C;
        }
        .cp-footer-col p {
          font-size: 13px;
          font-weight: 300;
          color: rgba(255,255,255,0.38);
          line-height: 1.7;
        }

        /* Bottom bar */
        .cp-footer-bottom {
          border-top: 1px solid rgba(201,168,76,0.06);
          padding-top: 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .cp-footer-copy {
          font-size: 11px;
          font-weight: 300;
          color: rgba(255,255,255,0.2);
        }
        .cp-footer-credit {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 1px;
          color: rgba(201,168,76,0.25);
          text-decoration: none;
          transition: color 0.3s;
        }
        .cp-footer-credit:hover {
          color: rgba(201,168,76,0.5);
        }

        @media (max-width: 768px) {
          .cp-footer { padding: 48px 20px 20px; }
          .cp-footer-top {
            grid-template-columns: 1fr;
            gap: 36px;
          }
        }
      `}</style>

            <footer className="cp-footer">
                <div className="cp-footer-inner">
                    <div className="cp-footer-top">
                        {/* Brand */}
                        <div>
                            <img src="/logo.png" alt="Puntos Cardinales Bienes Raíces" className="cp-footer-brand-logo" />
                            <p className="cp-footer-brand-desc">
                                Tu inmobiliaria de confianza en la Patagonia Argentina.
                                Servicios de excelencia en ventas, tasaciones, alquileres y administración de propiedades.
                            </p>
                            <div className="cp-footer-social">
                                {/* Instagram */}
                                <a href={IG} target="_blank" rel="noreferrer" aria-label="Instagram">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" />
                                        <circle cx="12" cy="12" r="5" />
                                        <circle cx="17.5" cy="6.5" r="1.5" fill="#C9A84C" stroke="none" />
                                    </svg>
                                </a>
                                {/* WhatsApp */}
                                <a href={WA + '?text=Hola, quiero consultar'} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#C9A84C">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.025.506 3.932 1.395 5.608L.054 23.395a.5.5 0 00.611.586l5.584-1.468A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.332-1.546l-.382-.228-3.32.873.884-3.236-.253-.4A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Navegación */}
                        <div className="cp-footer-col">
                            <h4>Navegación</h4>
                            <a href="#">Inicio</a>
                            <a href="#propiedades">Propiedades</a>
                            <a href="#servicios">Tasación</a>
                            <a href="#nosotros">Nosotros</a>
                            <a href="#contacto">Contacto</a>
                        </div>

                        {/* Contacto */}
                        <div className="cp-footer-col">
                            <h4>Contacto</h4>
                            <a href="tel:+5492945441507">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                                </svg>
                                +54 9 2945 441507
                            </a>
                            <a href={WA + '?text=Hola, quiero consultar'} target="_blank" rel="noreferrer">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(201,168,76,0.5)">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.025.506 3.932 1.395 5.608L.054 23.395a.5.5 0 00.611.586l5.584-1.468A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.332-1.546l-.382-.228-3.32.873.884-3.236-.253-.4A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                                </svg>
                                WhatsApp
                            </a>
                            <a href={IG} target="_blank" rel="noreferrer">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" />
                                    <circle cx="12" cy="12" r="5" />
                                </svg>
                                Instagram
                            </a>
                            <a href="https://linktr.ee/PuntosCardinalesBienesRaices" target="_blank" rel="noreferrer" style={{ marginTop: 8 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                </svg>
                                linktr.ee/PuntosCardinalesBienesRaices
                            </a>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="cp-footer-bottom">
                        <span className="cp-footer-copy">© {new Date().getFullYear()} Puntos Cardinales Bienes Raíces. Todos los derechos reservados.</span>
                        <a href="https://entercompany.ar" target="_blank" rel="noreferrer" className="cp-footer-credit">
                            Diseño por Enter Company
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
}