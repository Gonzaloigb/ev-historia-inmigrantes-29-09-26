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
 */

import { NINOS, nino, PASADO, PAISES_PRESENTE, pistaDeError, AVISOS } from '../datos.js';
import { dibujo } from '../dibujos.js';
import { el, barajar, uno } from '../util.js';
import { correrZona } from '../motor.js';

const TOTAL = 10;

/* Que se le pregunta a la ficha de un nino. */
const CAMPOS = [
  {
    id: 'pais',
    pregunta: (n) => `${n.nombre}, ¿de qué país viene?`,
    correcto: (n) => n.pais,
    opciones: () => NINOS.map((x) => x.pais),
  },
  {
    id: 'idioma',
    pregunta: (n) => `${n.nombre}, ¿qué idioma habla en su casa?`,
    correcto: (n) => n.idioma,
    opciones: () => ['creole', 'español', 'chino'],
  },
  {
    id: 'tradicion',
    pregunta: (n) => `${n.nombre}, ¿qué tradición de su país mantiene?`,
    correcto: (n) => n.tradicion,
    opciones: () => NINOS.map((x) => x.tradicion),
  },
];

export function jugarPresente({ zona, onSalir, onFin, modo }) {
  let bolsa = [];
  const sacar = () => {
    if (!bolsa.length) bolsa = barajar(NINOS);
    return bolsa.pop();
  };

  correrZona({
    zona,
    total: TOTAL,
    onSalir,
    onFin,
    modo,
    montar(ctx, i) {
      if (i === 2 || i === 6) montarSaludo(ctx, sacar());
      else if (i === 4 || i === 9) montarPasadoOPresente(ctx);
      else montarFicha(ctx, sacar());
    },
  });
}

/* ---------- Formato A: la ficha del nino (p.99) ---------- */
function montarFicha(ctx, n) {
  const campo = uno(CAMPOS);

  ctx.pedir({
    instruccion: campo.pregunta(n),
    apoyo: n.extra || n.idiomaNota,
  });

  // Tarjeta del nino, con su saludo. No se dibuja a la persona: se muestra
  // lo que ella misma cuenta, que es como lo presenta el libro.
  const tarjeta = el('div', 'ficha-nino');
  tarjeta.innerHTML =
    `<span class="bandera">${n.icono}</span>` +
    `<span class="dice">“${n.saludo}”</span>`;
  ctx.zonaJuego.append(tarjeta);

  const correcto = campo.correcto(n);
  const cartas = barajar([...new Set(campo.opciones())]).slice(0, 3);
  // Asegurar que la correcta este entre las tres
  if (!cartas.includes(correcto)) {
    cartas[cartas.length - 1] = correcto;
    barajar(cartas);
  }

  const opciones = el('div', 'opciones lista');
  for (const texto of barajar(cartas)) {
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
        pista: campo.id === 'idioma'
          ? n.idiomaNota
          : `${n.nombre} viene de ${n.pais} y mantiene ${n.tradicion}.`,
      });
    });
    opciones.append(btn);
  }
  ctx.zonaJuego.append(opciones);
}

/* ---------- Formato B: el saludo en su idioma ---------- */
function montarSaludo(ctx, n) {
  ctx.pedir({
    instruccion: `Alguien te saluda diciendo “${n.saludo}”. ¿De dónde viene?`,
    apoyo: 'Cada niño del libro saluda en el idioma de su país.',
  });

  const cartas = barajar(NINOS.map((x) => x.pais)).slice(0, 3);
  if (!cartas.includes(n.pais)) cartas[0] = n.pais;

  const opciones = el('div', 'opciones tres');
  for (const pais of barajar(cartas)) {
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
        mensajeMal: `Es ${n.nombre}, de ${n.pais}.`,
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
function montarPasadoOPresente(ctx) {
  const esPasado = Math.random() < 0.5;

  const grupo = esPasado
    ? uno(PASADO).corto
    : uno(Object.values(PAISES_PRESENTE).flat());

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
