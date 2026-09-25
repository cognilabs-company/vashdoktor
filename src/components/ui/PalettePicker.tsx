import { useEffect, useState } from 'react';
import { PALETTES } from '../../lib/palettes';

const KEY = 'vd-palette';
export const PALETTE_EVENT = 'palettechange';

/** Apply a palette to the document and let the 3D scene know. */
export function applyPalette(slug: string) {
  const root = document.documentElement;
  if (slug === 'default') root.removeAttribute('data-palette');
  else root.dataset.palette = slug;
  try {
    localStorage.setItem(KEY, slug);
  } catch {
    /* private mode — the choice just will not stick */
  }
  window.dispatchEvent(new CustomEvent(PALETTE_EVENT, { detail: slug }));
}

/** The palette saved from a previous visit, or one named in the URL. */
export function initialPalette(): string {
  const fromUrl = new URLSearchParams(window.location.search).get('palette');
  if (fromUrl) return fromUrl;
  try {
    return localStorage.getItem(KEY) || 'default';
  } catch {
    return 'default';
  }
}

/**
 * A temporary control for choosing the site's colour palette. Shown in dev, or
 * on any URL carrying `?palettes` — never to an ordinary visitor.
 */
export function PalettePicker() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('default');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const url = new URLSearchParams(window.location.search);
    setShow(import.meta.env.DEV || url.has('palettes'));
    const start = initialPalette();
    setCurrent(start);
    applyPalette(start);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[100] font-sans">
      {open && (
        <div className="mb-2 w-60 overflow-hidden rounded-2xl bg-[#0b0f14]/95 p-1.5 ring-1 ring-white/15 backdrop-blur-md">
          {PALETTES.map((p) => (
            <button
              key={p.slug}
              onClick={() => {
                setCurrent(p.slug);
                applyPalette(p.slug);
              }}
              className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] transition-colors ${
                current === p.slug ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'
              }`}
            >
              <Swatch slug={p.slug} />
              {p.label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-[#0b0f14]/95 px-4 py-2.5 text-[13px] text-white/85 ring-1 ring-white/15 backdrop-blur-md transition-colors hover:text-white"
      >
        <Swatch slug={current} />
        Ranglar
      </button>
    </div>
  );
}

/** Three dots in the palette's OWN colours: carrying the attribute here scopes
 * that palette's custom properties to this element, whatever the page is set to. */
function Swatch({ slug }: { slug: string }) {
  return (
    <span className="flex shrink-0 gap-1" data-palette={slug === 'default' ? undefined : slug}>
      {(['--c-bg', '--c-accent', '--c-text-2'] as const).map((t) => (
        <span key={t} className="h-3 w-3 rounded-full ring-1 ring-white/20" style={{ background: `var(${t})` }} />
      ))}
    </span>
  );
}
