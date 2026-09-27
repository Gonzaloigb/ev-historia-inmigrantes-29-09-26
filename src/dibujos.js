/**
 * dibujos.js — los dibujos del juego, en SVG generado.
 *
 * Equivalente de `agua.js` (ciencias), `animales.js` (ingles) y `figuras.js`
 * (matematica).
 *
 * Criterio de que se dibuja: el APORTE de cada comunidad, no la comunidad en
 * si. Dibujar personas por su origen seria ilustrar un estereotipo; el libro
 * tampoco lo hace — muestra una casa de Valdivia, un kuchen, un club de futbol.
 * Lo que Marina tiene que reconocer es el aporte, que ademas es lo evaluado.
 *
 * Todos comparten un lienzo de 100x100 para alinearse en rejillas.
 */

function svg(interior, clase = '') {
  return `<svg viewBox="0 0 100 100" class="dib ${clase}" role="img" aria-hidden="true">${interior}</svg>`;
}

const DIBUJOS = {
  /* ---------- Aportes del pasado ---------- */

  // Ingleses: futbol
  pelota: () => svg(`
    <circle cx="50" cy="50" r="34" fill="#F8FAFC" stroke="#334155" stroke-width="3"/>
    <path d="M50 28 L62 37 L57 51 L43 51 L38 37 Z" fill="#334155"/>
    <path d="M50 28 L50 16 M62 37 L74 32 M57 51 L66 62 M43 51 L34 62 M38 37 L26 32"
          stroke="#334155" stroke-width="3"/>
    <path d="M26 32 Q20 44 24 58 M74 32 Q80 44 76 58 M34 62 Q50 72 66 62"
          stroke="#334155" stroke-width="3" fill="none"/>
  `, 'd-pelota'),

  // Ingleses: bomberos
  bomberos: () => svg(`
    <rect x="16" y="46" width="52" height="30" rx="5" fill="#DC2626" stroke="#7F1D1D" stroke-width="3"/>
    <rect x="58" y="34" width="26" height="42" rx="5" fill="#EF4444" stroke="#7F1D1D" stroke-width="3"/>
    <rect x="63" y="40" width="15" height="12" rx="2" fill="#BFDBFE"/>
    <circle cx="30" cy="78" r="9" fill="#1F2937" stroke="#111827" stroke-width="2.5"/>
    <circle cx="68" cy="78" r="9" fill="#1F2937" stroke="#111827" stroke-width="2.5"/>
    <circle cx="30" cy="78" r="3.5" fill="#9CA3AF"/><circle cx="68" cy="78" r="3.5" fill="#9CA3AF"/>
    <rect x="22" y="36" width="8" height="12" rx="3" fill="#FBBF24"/>
    <path d="M20 54 L62 54" stroke="#FEF3C7" stroke-width="3"/>
  `, 'd-bomberos'),

  // Alemanes: arquitectura (casa de Valdivia)
  casa: () => svg(`
    <path d="M50 14 L88 44 L12 44 Z" fill="#B91C1C" stroke="#7F1D1D" stroke-width="3"/>
    <rect x="20" y="44" width="60" height="40" fill="#FEF3C7" stroke="#92400E" stroke-width="3"/>
    <rect x="28" y="52" width="14" height="14" fill="#BFDBFE" stroke="#92400E" stroke-width="2.5"/>
    <rect x="58" y="52" width="14" height="14" fill="#BFDBFE" stroke="#92400E" stroke-width="2.5"/>
    <path d="M35 52 L35 66 M28 59 L42 59 M65 52 L65 66 M58 59 L72 59" stroke="#92400E" stroke-width="2"/>
    <rect x="42" y="66" width="16" height="18" rx="2" fill="#92400E"/>
    <rect x="66" y="20" width="9" height="16" fill="#7F1D1D"/>
  `, 'd-casa'),

  // Alemanes: kuchen
  kuchen: () => svg(`
    <ellipse cx="50" cy="76" rx="36" ry="9" fill="#E7E5E4"/>
    <path d="M16 52 L84 52 L80 76 L20 76 Z" fill="#FDE68A" stroke="#B45309" stroke-width="3"/>
    <ellipse cx="50" cy="52" rx="34" ry="10" fill="#FCD34D" stroke="#B45309" stroke-width="3"/>
    <circle cx="36" cy="50" r="5" fill="#B91C1C"/>
    <circle cx="52" cy="53" r="5" fill="#7C2D12"/>
    <circle cx="66" cy="49" r="5" fill="#B91C1C"/>
    <path d="M20 64 L80 64" stroke="#B45309" stroke-width="2" opacity=".5"/>
  `, 'd-kuchen'),

  // Arabes: telas y comercio
  telas: () => svg(`
    <rect x="12" y="24" width="20" height="56" rx="4" fill="#15803D" stroke="#14532D" stroke-width="3"/>
    <rect x="36" y="18" width="20" height="62" rx="4" fill="#B91C1C" stroke="#7F1D1D" stroke-width="3"/>
    <rect x="60" y="28" width="20" height="52" rx="4" fill="#1D4ED8" stroke="#1E3A8A" stroke-width="3"/>
    <path d="M12 38 Q22 44 32 38 M36 32 Q46 38 56 32 M60 42 Q70 48 80 42"
          stroke="#FEF3C7" stroke-width="2.5" fill="none"/>
    <path d="M12 56 Q22 62 32 56 M36 50 Q46 56 56 50 M60 60 Q70 66 80 60"
          stroke="#FEF3C7" stroke-width="2.5" fill="none"/>
  `, 'd-telas'),

  // Afrodescendientes: tambor (Baile de Morenos de Paso)
  tambor: () => svg(`
    <path d="M28 34 L72 34 L68 74 L32 74 Z" fill="#B45309" stroke="#78350F" stroke-width="3"/>
    <ellipse cx="50" cy="34" rx="22" ry="8" fill="#FDE68A" stroke="#78350F" stroke-width="3"/>
    <path d="M30 44 L70 44 M31 58 L69 58" stroke="#78350F" stroke-width="2.5"/>
    <path d="M30 44 L40 58 M40 44 L30 58 M60 44 L70 58 M70 44 L60 58"
          stroke="#FEF3C7" stroke-width="2.5"/>
    <rect x="16" y="20" width="5" height="22" rx="2.5" fill="#78350F" transform="rotate(-22 18 30)"/>
    <rect x="80" y="20" width="5" height="22" rx="2.5" fill="#78350F" transform="rotate(22 82 30)"/>
  `, 'd-tambor'),

  /* ---------- Presente: aportes actuales ---------- */

  // Gastronomia
  plato: () => svg(`
    <ellipse cx="50" cy="56" rx="38" ry="28" fill="#F8FAFC" stroke="#94A3B8" stroke-width="3"/>
    <ellipse cx="50" cy="54" rx="27" ry="19" fill="#FEF3C7" stroke="#D97706" stroke-width="2.5"/>
    <ellipse cx="44" cy="50" rx="11" ry="8" fill="#F59E0B"/>
    <circle cx="60" cy="56" r="6" fill="#16A34A"/>
    <circle cx="54" cy="44" r="4" fill="#DC2626"/>
    <path d="M22 84 L78 84" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>
  `, 'd-plato'),

  // Arte: musica y danza
  danza: () => svg(`
    <circle cx="50" cy="22" r="10" fill="#F472B6" stroke="#9D174D" stroke-width="3"/>
    <path d="M50 32 L50 56" stroke="#9D174D" stroke-width="5" stroke-linecap="round"/>
    <path d="M50 38 L30 28 M50 38 L72 30" stroke="#9D174D" stroke-width="5" stroke-linecap="round"/>
    <path d="M50 56 L36 82 M50 56 L66 80" stroke="#9D174D" stroke-width="5" stroke-linecap="round"/>
    <path d="M30 56 Q50 70 70 56 L66 80 L36 82 Z" fill="#EC4899" opacity=".85"/>
    <g fill="#7C3AED">
      <circle cx="18" cy="42" r="4"/><rect x="21" y="26" width="3" height="17"/>
      <circle cx="82" cy="54" r="4"/><rect x="85" y="38" width="3" height="17"/>
    </g>
  `, 'd-danza'),

  // Comercio
  tienda: () => svg(`
    <rect x="14" y="40" width="72" height="42" fill="#FEF3C7" stroke="#B45309" stroke-width="3"/>
    <path d="M10 40 L90 40 L84 24 L16 24 Z" fill="#DC2626" stroke="#7F1D1D" stroke-width="3"/>
    <path d="M24 24 L30 40 M40 24 L44 40 M56 24 L58 40 M72 24 L72 40" stroke="#FEF3C7" stroke-width="3"/>
    <rect x="24" y="52" width="22" height="30" fill="#BFDBFE" stroke="#B45309" stroke-width="2.5"/>
    <rect x="56" y="56" width="26" height="14" rx="2" fill="#FDE68A" stroke="#B45309" stroke-width="2.5"/>
    <circle cx="62" cy="63" r="3" fill="#16A34A"/><circle cx="72" cy="63" r="3" fill="#DC2626"/>
  `, 'd-tienda'),

  // Idioma
  idioma: () => svg(`
    <path d="M14 22 L54 22 Q60 22 60 28 L60 56 Q60 62 54 62 L30 62 L18 74 L20 62 L14 62 Q8 62 8 56 L8 28 Q8 22 14 22 Z"
          fill="#0EA5E9" stroke="#075985" stroke-width="3"/>
    <path d="M18 34 L50 34 M18 42 L44 42 M18 50 L46 50" stroke="#E0F2FE" stroke-width="3" stroke-linecap="round"/>
    <path d="M52 44 L88 44 Q94 44 94 50 L94 72 Q94 78 88 78 L74 78 L64 88 L66 78 Q60 78 60 72 L60 50 Q60 44 66 44 Z"
          fill="#F59E0B" stroke="#92400E" stroke-width="3"/>
    <path d="M68 56 L88 56 M68 64 L84 64" stroke="#FEF3C7" stroke-width="3" stroke-linecap="round"/>
  `, 'd-idioma'),

  /* ---------- Actitudinal ---------- */

  manos: () => svg(`
    <path d="M14 56 q0-10 10-10 l22 0 q8 0 8 8 l0 10 q0 10-10 10 l-20 0 q-10 0-10-10 Z"
          fill="#FDBA74" stroke="#C2410C" stroke-width="3"/>
    <path d="M86 56 q0-10-10-10 l-22 0 q-8 0-8 8 l0 10 q0 10 10 10 l20 0 q10 0 10-10 Z"
          fill="#A16207" stroke="#713F12" stroke-width="3"/>
    <path d="M40 50 L60 50 L60 72 L40 72 Z" fill="#FBBF24" opacity=".55"/>
    <path d="M50 26 l4 10 11 1 -8 8 2 11 -9-6 -9 6 2-11 -8-8 11-1 Z" fill="#F59E0B"/>
  `, 'd-manos'),

  escuela: () => svg(`
    <rect x="14" y="42" width="72" height="40" fill="#FEF3C7" stroke="#92400E" stroke-width="3"/>
    <path d="M10 42 L50 18 L90 42 Z" fill="#DC2626" stroke="#7F1D1D" stroke-width="3"/>
    <rect x="42" y="60" width="16" height="22" rx="2" fill="#92400E"/>
    <rect x="22" y="52" width="13" height="13" fill="#BFDBFE" stroke="#92400E" stroke-width="2.5"/>
    <rect x="65" y="52" width="13" height="13" fill="#BFDBFE" stroke="#92400E" stroke-width="2.5"/>
    <rect x="47" y="10" width="3" height="10" fill="#475569"/>
    <path d="M50 11 L64 15 L50 19 Z" fill="#2563EB"/>
  `, 'd-escuela'),

  mundo: () => svg(`
    <circle cx="50" cy="50" r="36" fill="#38BDF8" stroke="#075985" stroke-width="3"/>
    <path d="M20 36 q12-7 22 0 t16 5 q-7 9-19 7 t-19-12 Z" fill="#16A34A"/>
    <path d="M56 64 q12-9 24-3 q-5 14-19 14 q-10 0-5-11 Z" fill="#15803D"/>
    <path d="M60 26 q12 3 16 12 q-12 5-19-3 Z" fill="#22C55E"/>
    <ellipse cx="50" cy="50" rx="36" ry="14" fill="none" stroke="#E0F2FE" stroke-width="2" opacity=".65"/>
  `, 'd-mundo'),

  /* ---------- Genericos ---------- */

  barco: () => svg(`
    <path d="M12 62 L88 62 L78 80 L22 80 Z" fill="#B45309" stroke="#78350F" stroke-width="3"/>
    <rect x="48" y="16" width="4" height="46" fill="#78350F"/>
    <path d="M52 20 L78 40 L52 48 Z" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.5"/>
    <path d="M46 24 L24 42 L46 50 Z" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2.5"/>
    <path d="M8 84 q12-6 22 0 t22 0 t22 0 t20-3" stroke="#0EA5E9" stroke-width="3" fill="none"/>
  `, 'd-barco'),

  reloj: () => svg(`
    <circle cx="50" cy="52" r="34" fill="#FEF3C7" stroke="#92400E" stroke-width="3.5"/>
    <circle cx="50" cy="52" r="27" fill="#FFFBEB" stroke="#B45309" stroke-width="2"/>
    <path d="M50 52 L50 34 M50 52 L64 60" stroke="#78350F" stroke-width="4" stroke-linecap="round"/>
    <circle cx="50" cy="52" r="4" fill="#78350F"/>
    <path d="M50 28 L50 32 M74 52 L70 52 M50 76 L50 72 M26 52 L30 52" stroke="#92400E" stroke-width="3"/>
    <rect x="44" y="12" width="12" height="7" rx="3" fill="#92400E"/>
  `, 'd-reloj'),
};

/**
 * Devuelve el SVG de un dibujo.
 * Lanza si no existe: un dibujo que falta debe verse al primer intento, no
 * dejar un hueco silencioso en la pantalla.
 */
export function dibujo(id, ...args) {
  const f = DIBUJOS[id];
  if (!f) throw new Error(`Dibujo desconocido: ${id}`);
  return f(...args);
}

export function catalogo() {
  return Object.keys(DIBUJOS);
}

/** Que dibujo representa a cada comunidad del pasado. */
export const DIBUJO_DE = {
  afrodescendientes: 'tambor',
  alemanes: 'casa',
  ingleses: 'pelota',
  arabes: 'telas',
};

/** Que dibujo representa a cada ambito de aporte. */
export const DIBUJO_AMBITO = {
  arte: 'danza',
  gastronomia: 'plato',
  comercio: 'tienda',
};
