/**
 * ZONA 3 — Los que llegan hoy (pp. 96-97)
 *
 * Los cuatro ninos del libro: Marie, Juan Carlos, Yun y Facundo. Son material
 * directo de prueba — la ficha de la p.99 pide escoger a uno de ellos y
 * completar sus datos.
 *
 * Tres formatos:
 *   A. La ficha del nino: de que pais es, que idioma habla, que tradicion
 *      mantiene. (Es el formato de la p.99.)
 *   B. El saludo en su idioma → de donde viene.
 *   C. Pasado o presente: distinguir las dos listas de comunidades.
 *
 * Ocho preguntas, cada formato con su bolsa: ninguna se repite en la vuelta.
 */

import { NINOS, GRUPOS_CUANDO, pistaDeError, AVISOS } from '../datos.js';
import { dibujo } from '../dibujos.js';
import { el, barajar, uno, bolsa, elegirCon } from '../util.js';
import { correrZona } from '../motor.js';

const GUION = ['ficha', 'ficha', 'saludo', 'ficha', 'cuando', 'ficha', 'ficha', 'cuando'];

/* Que se le pregunta a la ficha de un nino. */
const CAMPOS = [
  {
    id: 'pais',
    pregunta: (n) => n.preguntaPais,
    correcto: (n) => n.pais,
    opciones: () => NINOS.map((x) => x.pais),
    pista: (n) => n.paisNota || `${n.nombre} viene de ${n.pais}.`,
  },
  {
    id: 'idioma',
    pregunta: (n) => `${n.nombre}, ¿qué idioma habla en su casa?`,
    correcto: (n) => n.idioma,
    opciones: () => ['creole', 'español', 'chino'],
    pista: (n) => n.idiomaNota,
  },
  {
    id: 'tradicion',
    // La frase de la ficha de la p.99: "comida o tradicion de mi pais".
    pregunta: (n) => `${n.nombre}, ¿qué comida o tradición de su país mantiene?`,
    correcto: (n) => n.tradicion,
    opciones: () => NINOS.map((x) => x.tradicion).filter(Boolean),
    pista: (n) => `${n.nombre} viene de ${n.pais} y mantiene ${n.tradicion}.`,
  },
];

/* Todas las preguntas de ficha posibles: cada nino, por cada dato que el libro
   da de el. Yun no tiene tradicion en el libro, asi que esa no existe.      */
const FICHAS = NINOS.flatMap((n) =>
  CAMPOS.filter((campo) => campo.correcto(n)).map((campo) => ({ n, campo })));

/* Solo los saludos en otro idioma. "Hola, ¿que tal?" no dice de donde viene
   nadie: podria ser de Argentina, de Venezuela o de Chile.                  */
const CON_SALUDO = NINOS.filter((n) => n.saludoDistinto);

export function jugarPresente({ zona, onSalir, onFin, modo }) {
  const sacarFicha = bolsa(FICHAS);
  const sacarSaludo = bolsa(CON_SALUDO);
  const sacarGrupo = bolsa(GRUPOS_CUANDO);

  correrZona({
    zona,
    total: GUION.length,
    onSalir,
    onFin,
    modo,
    montar(ctx, i) {
      switch (GUION[i]) {
        case 'ficha': return montarFicha(ctx, sacarFicha());
        case 'saludo': return montarSaludo(ctx, sacarSaludo());
        case 'cuando': return montarPasadoOPresente(ctx, sacarGrupo());
        default: throw new Error(`Formato desconocido: ${GUION[i]}`);
      }
    },
  });
}

/* ---------- Formato A: la ficha del nino (p.99) ---------- */
function montarFicha(ctx, { n, campo }) {
  ctx.pedir({
    instruccion: campo.pregunta(n),
    // El apoyo ayuda, pero no puede decir la respuesta: si se pregunta el
    // idioma, no se muestra la nota del idioma.
    apoyo: campo.id === 'idioma' ? (n.extra || '') : n.idiomaNota,
  });

  // Tarjeta del nino, con su saludo. No se dibuja a la persona: se muestra
  // lo que ella misma cuenta, que es como lo presenta el libro.
  const tarjeta = el('div', 'ficha-nino');
  tarjeta.innerHTML =
    `<span class="bandera">${n.icono}</span>` +
    `<span class="dice">“${n.saludo}”</span>`;
  ctx.zonaJuego.append(tarjeta);

  const correcto = campo.correcto(n);
  const cartas = elegirCon([...new Set(campo.opciones())], correcto, ctx.opciones);

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

      ctx.responder({
        acerto,
        concepto: campo.id === 'idioma' && n.idioma === 'creole' ? 'creole' : n.id,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `${n.nombre}: ${correcto}.`,
        pista: campo.pista(n),
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato B: el saludo en su idioma ---------- */
function montarSaludo(ctx, n) {
  ctx.pedir({
    // "¿De que pais es ese saludo?" y no "¿de donde viene?": Yun nacio en
    // Chile, pero su saludo es del idioma de China.
    instruccion: `Alguien te saluda diciendo “${n.saludo}”. ¿De qué país es ese saludo?`,
    apoyo: 'Cada niño del libro saluda en el idioma de su país.',
  });

  const cartas = elegirCon(NINOS.map((x) => x.pais), n.pais, ctx.opciones);

  const opciones = el('div', 'opciones tres');
  for (const pais of cartas) {
    const btn = el('button', 'opcion solo-texto', pais, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = pais === n.pais;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) {
        [...opciones.children].find((o) => o.textContent === n.pais)
          ?.classList.add('correcta');
      }

      ctx.responder({
        acerto,
        concepto: n.idioma === 'creole' ? 'creole' : n.id,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: `Es el saludo de ${n.nombre}: ${n.pais}.`,
        pista: n.idiomaNota,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato C: pasado o presente ----------
   Dos listas parecidas en paginas seguidas del libro. Sin este formato, se
   mezclan.                                                                 */
function montarPasadoOPresente(ctx, { texto: grupo, esPasado }) {
  ctx.pedir({
    instruccion: esPasado
      ? `Los ${grupo.toLowerCase()}, ¿llegaron a Chile en el pasado o en los últimos años?`
      : `Los inmigrantes de ${grupo}, ¿llegaron en el pasado o en los últimos años?`,
    apoyo: 'En el pasado: afrodescendientes, alemanes, ingleses y árabes. '
         + 'En los últimos años: de Haití, Venezuela, China, Argentina y otros países.',
  });

  const tarjeta = el('div', 'tarjeta-dibujo chica');
  tarjeta.innerHTML = dibujo(esPasado ? 'reloj' : 'mundo');
  ctx.zonaJuego.append(tarjeta);

  const opciones = el('div', 'opciones dos');
  for (const op of [
    { v: 'pasado', t: '🕰️ En el pasado' },
    { v: 'presente', t: '🌎 En los últimos años' },
  ]) {
    const btn = el('button', 'opcion solo-texto', op.t, { type: 'button' });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const esperado = esPasado ? 'pasado' : 'presente';
      const acerto = op.v === esperado;
      btn.classList.add(acerto ? 'correcta' : 'errada');
      // Son dos opciones: si se equivoco, la otra es la correcta. Se marca
      // en verde, como en las demas preguntas.
      if (!acerto) {
        [...opciones.children].find((o) => o !== btn)?.classList.add('correcta');
      }

      ctx.responder({
        acerto,
        concepto: esperado,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: esPasado ? 'Llegaron en el pasado.' : 'Llegaron en los últimos años.',
        pista: pistaDeError(op.v, esperado),
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}
