import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Sliders } from 'lucide-react';
import { Button } from '../ui/Button';
import { CLINIC_CONFIG } from '../../lib/clinicConfig';

interface NavbarProps {
  onOpenConsultation: () => void;
  onOpen3DViewer: () => void;
}

export function Navbar({ onOpenConsultation, onOpen3DViewer }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Bosh sahifa', to: '/' },
    { label: 'Xizmatlar', to: '/services' },
    { label: 'Implantatsiya', to: '/implantatsiya' },
    { label: 'Biz haqimizda', to: '/about' },
    { label: 'Doktorlar', to: '/doctors' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'py-3.5 bg-[#0a141d]/80 backdrop-blur-md border-b border-white/10'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8fc7d4]/15 border border-white/15 text-[#a9d8e4] transition-transform group-hover:scale-105">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8 2 5 5 5 9c0 3 1.5 6 3 9l4 4 4-4c1.5-3 3-6 3-9 0-4-3-7-7-7z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 13h6" strokeLinecap="round" />
              <path d="M10 16h4" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-[0.2em] uppercase leading-none text-white">
              {CLINIC_CONFIG.name}
            </span>
            <span className="text-[10px] font-medium tracking-[0.14em] uppercase mt-0.5 text-[#8fb0ba]">
              STOMATOLOGIYA KLINIKASI
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 rounded-full px-6 py-2 backdrop-blur-md border bg-white/[0.06] border-white/10">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `text-xs font-medium transition-colors relative group py-1 ${
                  isActive ? 'text-white' : 'text-white/70 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 bg-[#a9d8e4] ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onOpen3DViewer}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-full border transition-all cursor-pointer text-[#a9d8e4] bg-[#8fc7d4]/10 hover:bg-[#8fc7d4]/20 border-[#8fc7d4]/25"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>3D model ko&#8216;rigi</span>
          </button>

          <Button
            variant="white"
            size="sm"
            onClick={onOpenConsultation}
            icon={<ArrowUpRight className="h-3.5 w-3.5" />}
          >
            Konsultatsiya
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="white" size="sm" onClick={onOpenConsultation}>
            Yozilish
          </Button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/10 border border-white/15 text-white cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a141d]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base py-2 border-b border-white/10 ${isActive ? 'text-[#a9d8e4]' : 'text-white/85'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpen3DViewer();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono text-white"
            >
              <Sliders className="h-4 w-4 text-[#a9d8e4]" />
              <span>3D modelni ochish</span>
            </button>

            <Button
              variant="white"
              size="md"
              fullWidth
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
            >
              Konsultatsiyaga yozilish
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
