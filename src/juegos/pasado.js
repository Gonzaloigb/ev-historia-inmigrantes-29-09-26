/**
 * ZONA 1 — Los que llegaron antes (pp. 92-95)
 *
 * Las cuatro comunidades del pasado: afrodescendientes, alemanes, ingleses y
 * arabes. Lo que se pregunta es lo mismo que pregunta el crucigrama de la p.95:
 * quien es quien, por que llego y de donde viene.
 *
 * Cuatro formatos:
 *   A. Aporte → que comunidad lo trajo. (El del crucigrama.)
 *   B. Por que llegaron a Chile.
 *   C. De que continente vienen. (Arabes = Asia, el error mas probable.)
 *   D. Donde se instalaron.
 *
 * Ocho preguntas y no diez: con cuatro comunidades, diez obligaba a repetir.
 * Cada formato saca de su propia bolsa, asi que ninguna pregunta sale dos
 * veces en la misma vuelta.
 */

import { PASADO, pistaDeError, AVISOS } from '../datos.js';
import { dibujo, DIBUJO_DE } from '../dibujos.js';
import { el, barajar, uno, bolsa, elegirCon } from '../util.js';
import { correrZona } from '../motor.js';

const GUION = ['quien', 'porque', 'quien', 'continente', 'porque', 'quien', 'donde', 'porque'];

export function jugarPasado({ zona, onSalir, onFin, modo }) {
  // Solo las comunidades a las que el libro les atribuye un aporte (las tres
  // del crucigrama de la p.95), y solo los continentes que el libro dice.
  const sacarQuien = bolsa(PASADO.filter((c) => c.aporteClave));
  const sacarPorQue = bolsa(PASADO);
  const sacarContinente = bolsa(PASADO.filter((c) => c.preguntaContinente));

  correrZona({
    zona,
    total: GUION.length,
    onSalir,
    onFin,
    modo,
    montar(ctx, i) {
      switch (GUION[i]) {
        case 'quien': return montarDeQuienEs(ctx, sacarQuien());
        case 'porque': return montarPorQue(ctx, sacarPorQue());
        case 'continente': return montarContinente(ctx, sacarContinente());
        case 'donde': return montarDonde(ctx);
        default: throw new Error(`Formato desconocido: ${GUION[i]}`);
      }
    },
  });
}

/* ---------- Formato A: este aporte, de que comunidad es ---------- */
function montarDeQuienEs(ctx, c) {
  ctx.pedir({ instruccion: `¿Qué comunidad de inmigrantes aportó ${c.aporteClave}?` });

  const tarjeta = el('div', 'tarjeta-dibujo');
  tarjeta.innerHTML = dibujo(DIBUJO_DE[c.id]);
  ctx.zonaJuego.append(tarjeta);

  // Normal: tres alternativas. Dificil: las cuatro.
  const opciones = el('div', 'opciones dos');
  for (const op of elegirCon(PASADO, c, ctx.opciones)) {
    const btn = el('button', 'opcion solo-texto', op.corto,
      { type: 'button', 'data-id': op.id });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = op.id === c.id;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) opciones.querySelector(`[data-id="${c.id}"]`)?.classList.add('correcta');

      ctx.responder({
        acerto,
        concepto: c.id,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `Fueron los ${c.corto.toLowerCase()}.`,
        pista: pistaDeError(op.id, c.id) || `Los ${c.corto.toLowerCase()} aportaron ${c.aportes[0].toLowerCase()}.`,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato B: por que llegaron ---------- */
function montarPorQue(ctx, c) {
  ctx.pedir({ instruccion: `¿Por qué llegaron a Chile los ${c.corto.toLowerCase()}?` });

  const tarjeta = el('div', 'tarjeta-dibujo chica');
  tarjeta.innerHTML = dibujo(DIBUJO_DE[c.id]);
  ctx.zonaJuego.append(tarjeta);

  // Las alternativas van en su version corta ("Por negocios"): la frase entera
  // del libro son veinte palabras, demasiado para leer tres a los 7 anos. La
  // frase entera aparece como explicacion si se equivoca.
  const opciones = el('div', 'opciones lista');
  for (const op of elegirCon(PASADO, c, ctx.opciones)) {
    const btn = el('button', 'opcion solo-texto', op.porQueCorto,
      { type: 'button', 'data-id': op.id });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = op.id === c.id;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) opciones.querySelector(`[data-id="${c.id}"]`)?.classList.add('correcta');

      ctx.responder({
        acerto,
        concepto: c.id,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `${c.porQueCorto}.`,
        pista: pistaDeError(op.id, c.id) || c.porQue,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato C: de que continente vienen ----------
   Existe por un error concreto: "arabe" se asocia a Africa por el norte del
   continente, pero Palestina, Siria y Libano estan en Asia.

   Solo se pregunta por las comunidades cuyo continente dice el libro
   (arabes y afrodescendientes). Que Alemania o Inglaterra esten en Europa no
   lo ensena la leccion.                                                    */
function montarContinente(ctx, c) {
  ctx.pedir({
    instruccion: c.preguntaContinente,
    // El apoyo no puede ser "venian de Africa": eso es la respuesta.
    apoyo: c.origen_geo !== c.continente ? `Venían de ${c.origen_geo}.` : '',
  });

  const opciones = el('div', 'opciones tres');
  for (const cont of ['África', 'Europa', 'Asia']) {
    const btn = el('button', 'opcion solo-texto', cont, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = cont === c.continente;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) {
        [...opciones.children].find((o) => o.textContent === c.continente)
          ?.classList.add('correcta');
      }

      ctx.responder({
        acerto,
        concepto: c.id,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `Venían de ${c.continente}.`,
        pista: pistaDeError(cont, c.continente)
          || (c.origen_geo !== c.continente
            ? `Venían de ${c.origen_geo}, que está en ${c.continente}.`
            : `Las expediciones españolas los trajeron desde ${c.continente}.`),
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato D: donde se instalaron ---------- */
function montarDonde(ctx) {
  // Solo dos comunidades tienen lugar declarado en el libro.
  const conLugar = PASADO.filter((c) => c.donde);
  const c = uno(conLugar);

  ctx.pedir({ instruccion: `¿Dónde se instalaron principalmente los ${c.corto.toLowerCase()}?` });

  const otras = conLugar.filter((x) => x.id !== c.id).map((x) => x.donde);
  const falsas = ['la Zona Norte, cerca del desierto', 'la Isla de Pascua'];
  const cartas = barajar([c.donde, ...otras, ...falsas].slice(0, 3));

  const opciones = el('div', 'opciones lista');
  for (const texto of cartas) {
    const btn = el('button', 'opcion solo-texto', texto, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = texto === c.donde;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) {
        [...opciones.children].find((o) => o.textContent === c.donde)
          ?.classList.add('correcta');
      }

      ctx.responder({
        acerto,
        concepto: c.id,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `Se instalaron en ${c.donde}.`,
        pista: c.id === 'alemanes'
          ? 'Los alemanes llegaron a la Zona Sur. Un ejemplo del libro es una casa en Valdivia.'
          : 'Los ingleses llegaron a Punta Arenas, Valparaíso, Santiago y Antofagasta.',
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}
