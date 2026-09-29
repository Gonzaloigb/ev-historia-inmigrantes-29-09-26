/**
 * ZONA 4 — Un país de muchas culturas (p.98)
 *
 * La definicion de sociedad multicultural y los tres ambitos de aporte: arte,
 * gastronomia y comercio.
 *
 * Tres formatos:
 *   A. Un ejemplo concreto → a que ambito pertenece.
 *   B. Que significa "sociedad multicultural".
 *   C. Verdadero o falso sobre los aportes actuales.
 *
 * Ocho preguntas. La definicion sale UNA vez: antes salia dos, identica.
 */

import { AMBITOS, MULTICULTURAL, AFIRMACIONES, AVISOS, REGLA_TODOS } from '../datos.js';
import { dibujo, DIBUJO_AMBITO } from '../dibujos.js';
import { el, barajar, uno, bolsa } from '../util.js';
import { correrZona } from '../motor.js';

const GUION = ['ambito', 'vf', 'ambito', 'definicion', 'ambito', 'vf', 'ambito', 'vf'];

/* Ejemplos concretos, cada uno de un solo ambito. */
const EJEMPLOS = [
  { texto: 'La salsa, un baile de origen caribeño', ambito: 'arte' },
  { texto: 'La música de grupos latinoamericanos', ambito: 'arte' },
  { texto: 'El ají de gallina, plato típico peruano', ambito: 'gastronomia' },
  { texto: 'La comida china y coreana', ambito: 'gastronomia' },
  { texto: 'La comida mexicana', ambito: 'gastronomia' },
  { texto: 'Un local con productos traídos de China', ambito: 'comercio' },
  { texto: 'Nuevos productos y servicios en el barrio', ambito: 'comercio' },
];

const VF_MULTI = AFIRMACIONES.filter((a) =>
  ['gastronomia', 'multicultural', 'generalizar'].includes(a.concepto));

export function jugarMulticultural({ zona, onSalir, onFin, modo }) {
  const sacar = bolsa(EJEMPLOS);
  const sacarVF = bolsa(VF_MULTI);

  correrZona({
    zona,
    total: GUION.length,
    onSalir,
    onFin,
    modo,
    montar(ctx, i) {
      switch (GUION[i]) {
        case 'ambito': return montarQueAmbito(ctx, sacar());
        case 'vf': return montarVF(ctx, sacarVF());
        case 'definicion': return montarDefinicion(ctx);
        default: throw new Error(`Formato desconocido: ${GUION[i]}`);
      }
    },
  });
}

/* ---------- Formato A: de que ambito es este ejemplo ---------- */
function montarQueAmbito(ctx, e) {
  ctx.pedir({
    instruccion: `"${e.texto}". ¿A qué tipo de aporte corresponde?`,
    apoyo: 'Los tres grandes aportes son las expresiones artísticas, la gastronomía '
         + 'y el comercio.',
  });

  const tarjeta = el('div', 'tarjeta-dibujo chica');
  tarjeta.innerHTML = dibujo(DIBUJO_AMBITO[e.ambito]);
  ctx.zonaJuego.append(tarjeta);

  // La palabra del libro siempre; en modo normal, debajo, que quiere decir.
  const opciones = el('div', 'opciones tres');
  for (const a of barajar(AMBITOS)) {
    const texto = `${a.icono} ${a.nombre}`
      + (ctx.ayuda ? `<small class="aclara">${a.simple}</small>` : '');
    const btn = el('button', 'opcion solo-texto', texto,
      { type: 'button', 'data-id': a.id });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = a.id === e.ambito;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) opciones.querySelector(`[data-id="${e.ambito}"]`)?.classList.add('correcta');

      const bueno = AMBITOS.find((x) => x.id === e.ambito);
      ctx.responder({
        acerto,
        concepto: e.ambito,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `Es un aporte de tipo ${bueno.nombre.toLowerCase()}.`,
        pista: `${bueno.nombre}: ${bueno.que} Por ejemplo, ${bueno.ejemplo}.`,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato B: que es una sociedad multicultural ---------- */
function montarDefinicion(ctx) {
  ctx.pedir({ instruccion: '¿Qué es una sociedad multicultural?' });

  const tarjeta = el('div', 'tarjeta-dibujo chica');
  tarjeta.innerHTML = dibujo('mundo');
  ctx.zonaJuego.append(tarjeta);

  const correcta = 'Una sociedad que incluye diversas culturas';
  const cartas = barajar([
    correcta,
    'Una sociedad donde todos vienen del mismo país',
    'Una sociedad donde solo se habla un idioma',
  ]);

  const opciones = el('div', 'opciones lista');
  for (const texto of cartas) {
    const btn = el('button', 'opcion solo-texto', texto, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = texto === correcta;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) {
        [...opciones.children].find((o) => o.textContent === correcta)
          ?.classList.add('correcta');
      }

      ctx.responder({
        acerto,
        concepto: 'multicultural',
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: 'Es la que incluye diversas culturas.',
        pista: MULTICULTURAL,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato C: verdadero o falso ---------- */
function montarVF(ctx, a) {
  ctx.pedir({
    instruccion: '¿Es verdadero o falso?',
    apoyo: a.concepto === 'generalizar'
      ? REGLA_TODOS
      : 'Lee con atención: a veces el error está en una sola palabra.',
  });

  ctx.zonaJuego.append(el('div', 'afirmacion', a.texto));

  const opciones = el('div', 'opciones dos');
  for (const op of [{ v: true, t: '✅ Verdadero' }, { v: false, t: '❌ Falso' }]) {
    const btn = el('button', 'opcion solo-texto', op.t, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = op.v === a.verdadero;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      // Son dos opciones: si se equivoco, la otra es la correcta. Se marca
      // en verde, como en las demas preguntas.
      if (!acerto) {
        [...opciones.children].find((o) => o !== btn)?.classList.add('correcta');
      }

      ctx.responder({
        acerto,
        concepto: a.concepto,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: a.verdadero ? 'Sí era verdadero.' : 'Era falso.',
        pista: a.porque,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}
