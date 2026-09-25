import { Link } from 'react-router-dom';
import { CLINIC_CONFIG } from '../../lib/clinicConfig';
import { ArrowUp, MapPin, Phone, Mail, Clock, Instagram, Send, Linkedin } from 'lucide-react';
import { FLOW } from '../../lib/flow';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer data-bg={FLOW.footer} className="text-white pt-20 pb-12">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Main Columns Grid */}
        <div data-stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Col 1: Brand & Philosophy */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[var(--c-accent)]">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C8 2 5 5 5 9c0 3 1.5 6 3 9l4 4 4-4c1.5-3 3-6 3-9 0-4-3-7-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 13h6" strokeLinecap="round" />
                    <path d="M10 16h4" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-[0.2em] text-white uppercase">
                    {CLINIC_CONFIG.name}
                  </span>
                  <span className="text-[10px] font-mono tracking-[0.14em] text-[var(--c-accent)] uppercase">
                    STOMATOLOGIYA KLINIKASI
                  </span>
                </div>
              </div>

              <p className="text-sm text-[var(--c-text-2)] font-light leading-relaxed max-w-sm mt-4">
                Butun oila uchun zamonaviy stomatologiya — profilaktika, davolash, estetika, ortodontiya va implantatsiya bir joyda.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <a
                href={CLINIC_CONFIG.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-[var(--c-text-2)] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={CLINIC_CONFIG.socials.telegram}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-[var(--c-text-2)] hover:text-white transition-colors"
                aria-label="Telegram"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href={CLINIC_CONFIG.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-[var(--c-text-2)] hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-mono font-semibold text-[var(--c-accent)] uppercase tracking-widest mb-4">
              Sahifalar
            </h4>
            <ul className="space-y-2.5 text-sm text-[var(--c-text-2)] font-light">
              <li><Link to="/" className="hover:text-white transition-colors">Bosh sahifa</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Xizmatlar</Link></li>
              <li><Link to="/implantatsiya" className="hover:text-white transition-colors">Implantatsiya (3D)</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Biz haqimizda</Link></li>
              <li><Link to="/doctors" className="hover:text-white transition-colors">Doktorlar</Link></li>
            </ul>
          </div>

          {/* Col 3: Contact & Hours */}
          <div className="lg:col-span-5 space-y-4 text-xs text-[var(--c-text-2)]">
            <h4 className="font-mono font-semibold text-[var(--c-accent)] uppercase tracking-widest mb-4">
              To&#39;g&#39;ridan-to&#39;g&#39;ri aloqa
            </h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[var(--c-accent)] shrink-0 mt-0.5" />
              <span>{CLINIC_CONFIG.address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-[var(--c-accent)] shrink-0" />
              <a href={`tel:${CLINIC_CONFIG.phone}`} className="hover:text-white transition-colors">
                {CLINIC_CONFIG.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[var(--c-accent)] shrink-0" />
              <a href={`mailto:${CLINIC_CONFIG.email}`} className="hover:text-white transition-colors">
                {CLINIC_CONFIG.email}
              </a>
            </div>
            <div className="flex items-center gap-2.5 pt-2 text-[var(--c-text-4)]">
              <Clock className="h-4 w-4 text-[var(--c-accent)] shrink-0" />
              <span>{CLINIC_CONFIG.hours}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div data-reveal className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--c-text-4)] font-mono">
          <div>
            © {new Date().getFullYear()} {CLINIC_CONFIG.name}. Barcha huquqlar himoyalangan.
          </div>

          <div className="flex items-center gap-6">
            <span>Litsenziya raqami: [—]</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[var(--c-text-2)] hover:text-white transition-colors cursor-pointer"
            >
              <span>Yuqoriga</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
