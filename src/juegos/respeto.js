/**
 * ZONA 5 — Respetar al que llega (pp. 99-101)
 *
 * El eje ACTITUDINAL, que es el que la profesora va a evaluar con la ficha:
 * "escribe una accion con la que demuestres respeto a personas de culturas
 * diferentes a la tuya".
 *
 * Se evalua distinto a las otras zonas: aqui no hay un dato que recordar, hay
 * un criterio que aplicar. Por eso las preguntas son situaciones, no
 * definiciones.
 *
 * Tres formatos:
 *   A. Esta accion, ¿demuestra respeto?
 *   B. De estas tres, ¿cual demuestra respeto?
 *   C. El derecho a la educacion (recuadro "Somos ciudadania", p.96).
 */

import { ACCIONES, DERECHO_EDUCACION, AVISOS } from '../datos.js';
import { dibujo } from '../dibujos.js';
import { el, barajar, uno } from '../util.js';
import { correrZona } from '../motor.js';

const TOTAL = 10;

export function jugarRespeto({ zona, onSalir, onFin, modo }) {
  let bolsa = [];
  const sacar = () => {
    if (!bolsa.length) bolsa = barajar(ACCIONES);
    return bolsa.pop();
  };

  correrZona({
    zona,
    total: TOTAL,
    onSalir,
    onFin,
    modo,
    montar(ctx, i) {
      if (i === 4 || i === 9) montarEducacion(ctx);
      else if (i % 3 === 2) montarElegirBuena(ctx);
      else montarRespetaONo(ctx, sacar());
    },
  });
}

/* ---------- Formato A: esta accion demuestra respeto ---------- */
function montarRespetaONo(ctx, a) {
  ctx.pedir({
    instruccion: `"${a.texto}". ¿Esto demuestra respeto?`,
    apoyo: 'Respetar es tratar a los demás como te gustaría que te trataran a ti, '
         + 'aunque vengan de otro país.',
  });

  const tarjeta = el('div', 'tarjeta-dibujo chica');
  tarjeta.innerHTML = dibujo(a.respeta ? 'manos' : 'mundo');
  ctx.zonaJuego.append(tarjeta);

  const opciones = el('div', 'opciones dos');
  for (const op of [
    { v: true, t: '🤝 Sí, es respetuoso' },
    { v: false, t: '💔 No, es una falta de respeto' },
  ]) {
    const btn = el('button', 'opcion solo-texto', op.t, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = op.v === a.respeta;
      btn.classList.add(acerto ? 'correcta' : 'errada');

      ctx.responder({
        acerto,
        concepto: 'respeto',
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: a.respeta ? 'Sí demuestra respeto.' : 'Eso es una falta de respeto.',
        pista: a.respeta
          ? 'Cuando alguien llega a un país nuevo, todo le resulta distinto. Un gesto '
          + 'así lo ayuda a sentirse acogido.'
          : 'Reírse de alguien o dejarlo de lado por venir de otro país lo hace sentir '
          + 'mal, y no le da la oportunidad de mostrar quién es.',
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato B: cual de estas demuestra respeto ---------- */
function montarElegirBuena(ctx) {
  const buena = uno(ACCIONES.filter((a) => a.respeta));
  const malas = barajar(ACCIONES.filter((a) => !a.respeta)).slice(0, 2);
  const cartas = barajar([buena, ...malas]);

  ctx.pedir({
    instruccion: 'Llega a tu curso alguien de otro país. ¿Cuál de estas cosas '
               + 'demuestra respeto?',
  });

  const opciones = el('div', 'opciones lista');
  for (const a of cartas) {
    const btn = el('button', 'opcion solo-texto', a.texto, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      btn.classList.add(a.respeta ? 'correcta' : 'errada');
      if (!a.respeta) {
        [...opciones.children].find((o) => o.textContent === buena.texto)
          ?.classList.add('correcta');
      }

      ctx.responder({
        acerto: a.respeta,
        concepto: 'respeto',
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `La respetuosa es: ${buena.texto.toLowerCase()}.`,
        pista: 'Fíjate cuál de las tres ayuda a que la persona se sienta bienvenida.',
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato C: el derecho a la educacion (p.96) ---------- */
function montarEducacion(ctx) {
  ctx.pedir({
    instruccion: '¿Cómo ayuda Chile a las familias que llegan de otros países?',
  });

  const tarjeta = el('div', 'tarjeta-dibujo chica');
  tarjeta.innerHTML = dibujo('escuela');
  ctx.zonaJuego.append(tarjeta);

  const correcta = 'Garantizando el derecho a la educación de niños y niñas, sin condiciones';
  const cartas = barajar([
    correcta,
    'Pidiéndoles que dejen de hablar su idioma',
    'Permitiendo que vayan al colegio solo si hablan español',
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
        concepto: 'respeto',
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: 'Garantizando el derecho a la educación.',
        pista: DERECHO_EDUCACION,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}
