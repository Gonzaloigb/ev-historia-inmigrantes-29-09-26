/**
 * ZONA 2 — ¿Qué nos dejaron? (pp. 93-95, 98)
 *
 * Los aportes concretos de cada comunidad. Es la zona que mas se parece al
 * crucigrama de la p.95 y a las preguntas de la p.101.
 *
 * Tres formatos:
 *   A. Verdadero o falso sobre un aporte. (Formato literal de la evaluacion.)
 *   B. Un club de futbol → que comunidad lo formo.
 *   C. Emparejar: de estos tres aportes, cual es de tal comunidad.
 */

import { PASADO, comunidad, CLUBES, AFIRMACIONES, pistaDeError, AVISOS } from '../datos.js';
import { dibujo, DIBUJO_DE } from '../dibujos.js';
import { el, barajar, uno } from '../util.js';
import { correrZona } from '../motor.js';

const TOTAL = 10;

/* Solo las afirmaciones sobre comunidades del pasado y sus aportes. */
const VF_APORTES = AFIRMACIONES.filter((a) =>
  ['alemanes', 'ingleses', 'arabes', 'afrodescendientes'].includes(a.concepto));

export function jugarAportes({ zona, onSalir, onFin, modo }) {
  let bolsaVF = [];
  const sacarVF = () => {
    if (!bolsaVF.length) bolsaVF = barajar(VF_APORTES);
    return bolsaVF.pop();
  };

  correrZona({
    zona,
    total: TOTAL,
    onSalir,
    onFin,
    modo,
    montar(ctx, i) {
      if (i === 3 || i === 8) montarClub(ctx);
      else if (i % 2 === 0) montarVF(ctx, sacarVF());
      else montarEmparejar(ctx);
    },
  });
}

/* ---------- Formato A: verdadero o falso ----------
   Es el formato que la profesora anuncio para la ficha de evaluacion.      */
function montarVF(ctx, a) {
  ctx.pedir({
    instruccion: '¿Es verdadero o falso?',
    apoyo: 'Lee con atención: a veces el error está en una sola palabra.',
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

/* ---------- Formato B: los clubes de futbol ---------- */
function montarClub(ctx) {
  const c = uno(CLUBES);
  const dueno = comunidad(c.de);

  ctx.pedir({
    instruccion: `El club ${c.nombre}, ¿qué comunidad de inmigrantes lo formó?`,
    apoyo: c.nota ? `Pista del libro: es ${c.nota}.` : '',
  });

  const tarjeta = el('div', 'tarjeta-dibujo chica');
  tarjeta.innerHTML = dibujo('pelota');
  ctx.zonaJuego.append(tarjeta);

  const opciones = el('div', 'opciones dos');
  for (const op of barajar(PASADO)) {
    const btn = el('button', 'opcion solo-texto', op.corto,
      { type: 'button', 'data-id': op.id });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = op.id === dueno.id;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) opciones.querySelector(`[data-id="${dueno.id}"]`)?.classList.add('correcta');

      ctx.responder({
        acerto,
        concepto: dueno.id,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `Lo formó la comunidad ${dueno.corto.toLowerCase()}.`,
        pista: dueno.id === 'arabes'
          ? 'Palestino es el club más famoso que formó la comunidad árabe.'
          : 'Los ingleses trajeron el fútbol a Chile, y formaron equipos como '
          + 'Santiago Wanderers y Everton de Viña del Mar.',
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato C: cual de estos aportes es de tal comunidad ---------- */
function montarEmparejar(ctx) {
  const c = uno(PASADO);
  const correcto = uno(c.aportes);
  const otros = barajar(
    PASADO.filter((x) => x.id !== c.id).flatMap((x) => x.aportes),
  ).slice(0, 2);
  const cartas = barajar([correcto, ...otros]);

  ctx.pedir({ instruccion: `¿Cuál de estos es un aporte de los ${c.corto.toLowerCase()}?` });

  const tarjeta = el('div', 'tarjeta-dibujo chica');
  tarjeta.innerHTML = dibujo(DIBUJO_DE[c.id]);
  ctx.zonaJuego.append(tarjeta);

  const opciones = el('div', 'opciones lista');
  for (const texto of cartas) {
    const btn = el('button', 'opcion solo-texto', texto, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = texto === correcto;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) {
        [...opciones.children].find((o) => o.textContent === correcto)
          ?.classList.add('correcta');
      }

      // De quien era el aporte que marco, para dar una pista util
      const deQuien = PASADO.find((x) => x.aportes.includes(texto));

      ctx.responder({
        acerto,
        concepto: c.id,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `Ese aporte es de los ${deQuien ? deQuien.corto.toLowerCase() : 'otros'}.`,
        pista: pistaDeError(deQuien?.id, c.id)
          || `Los ${c.corto.toLowerCase()} aportaron ${c.aporteClave}.`,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}
