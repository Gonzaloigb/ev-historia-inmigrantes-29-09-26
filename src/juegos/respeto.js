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
 *
 * Cinco preguntas, no diez: en el libro el respeto es una actividad (p.100)
 * y un recuadro (p.96), y la zona debe pesar lo que pesa en el temario. El
 * derecho a la educacion sale UNA vez (antes, dos identicas), y los formatos
 * A y B comparten el registro de acciones ya mostradas: las dos prefieren las
 * que todavia no salieron en la vuelta.
 */

import { ACCIONES, DERECHO_EDUCACION, AVISOS } from '../datos.js';
import { dibujo } from '../dibujos.js';
import { el, barajar, uno } from '../util.js';
import { correrZona } from '../motor.js';

const GUION = ['sino', 'elegir', 'sino', 'educacion', 'sino'];

/** Baraja poniendo primero las acciones que todavia no salieron. */
function primeroNuevas(lista, vistas) {
  return [
    ...barajar(lista.filter((a) => !vistas.has(a))),
    ...barajar(lista.filter((a) => vistas.has(a))),
  ];
}

export function jugarRespeto({ zona, onSalir, onFin, modo }) {
  const vistas = new Set();

  correrZona({
    zona,
    total: GUION.length,
    onSalir,
    onFin,
    modo,
    montar(ctx, i) {
      switch (GUION[i]) {
        case 'sino': {
          const a = primeroNuevas(ACCIONES, vistas)[0];
          vistas.add(a);
          return montarRespetaONo(ctx, a);
        }
        case 'elegir': return montarElegirBuena(ctx, vistas);
        case 'educacion': return montarEducacion(ctx);
        default: throw new Error(`Formato desconocido: ${GUION[i]}`);
      }
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
      // Son dos opciones: si se equivoco, la otra es la correcta. Se marca
      // en verde, como en las demas preguntas.
      if (!acerto) {
        [...opciones.children].find((o) => o !== btn)?.classList.add('correcta');
      }

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
function montarElegirBuena(ctx, vistas) {
  const buena = primeroNuevas(ACCIONES.filter((a) => a.respeta), vistas)[0];
  const malas = primeroNuevas(ACCIONES.filter((a) => !a.respeta), vistas)
    .slice(0, ctx.opciones - 1);
  const cartas = barajar([buena, ...malas]);
  cartas.forEach((a) => vistas.add(a));

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
