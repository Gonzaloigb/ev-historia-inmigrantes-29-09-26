/**
 * ZONA 6 — Ensayo de la ficha
 *
 * La profesora dijo que la evaluacion sera una "ficha de aprendizaje" con
 * formato similar a las actividades de las pp. 99-101. Esta zona replica ese
 * formato: sobre todo verdadero/falso, mas la pregunta de "menciona tres
 * ejemplos" y la ficha del nino.
 *
 * `forzarDuro: true` silencia el apoyo y las pistas aunque se juegue en modo
 * normal: aqui la idea es medir, no ensenar. No quita vidas — perder el ensayo
 * a la tercera no le ensena nada a nadie.
 *
 * El reparto sigue el peso de cada contenido en la leccion:
 *   5 verdadero/falso · 3 comunidades del pasado · 3 del presente ·
 *   2 aportes y multiculturalidad · 2 respeto
 */

import {
  AFIRMACIONES, PASADO, NINOS, AMBITOS, ACCIONES,
  PAISES_PRESENTE, comunidad, AVISOS,
} from '../datos.js';
import { dibujo, DIBUJO_DE, DIBUJO_AMBITO } from '../dibujos.js';
import { el, barajar, uno } from '../util.js';
import { correrZona } from '../motor.js';
import { guardarSimulacro } from '../estado.js';

const TOTAL = 15;

export function jugarSimulacro({ zona, onSalir, onFin, modo }) {
  const guion = barajar([
    'vf', 'vf', 'vf', 'vf', 'vf',
    'pasado', 'pasado', 'pasado',
    'presente', 'presente', 'presente',
    'aportes', 'aportes',
    'respeto', 'respeto',
  ]);

  // Bolsa de afirmaciones, para que no se repitan dentro de un mismo ensayo.
  let bolsaVF = barajar(AFIRMACIONES);

  correrZona({
    zona,
    total: TOTAL,
    onSalir,
    modo,
    forzarDuro: true,
    onFin(r) {
      guardarSimulacro(r.aciertos, r.total);
      onFin(r);
    },
    montar(ctx, i) {
      switch (guion[i]) {
        case 'vf': {
          if (!bolsaVF.length) bolsaVF = barajar(AFIRMACIONES);
          return preguntaVF(ctx, bolsaVF.pop());
        }
        case 'pasado': return preguntaPasado(ctx);
        case 'presente': return preguntaPresente(ctx);
        case 'aportes': return preguntaAportes(ctx);
        case 'respeto': return preguntaRespeto(ctx);
        default: throw new Error(`Pregunta desconocida: ${guion[i]}`);
      }
    },
  });
}

/* ---------- Helper: arma alternativas y cierra la pregunta ---------- */
function armar(ctx, { cartas, esCorrecta, clase = 'lista', concepto, mensajeMal }) {
  const opciones = el('div', `opciones ${clase}`);

  cartas.forEach((c, idx) => {
    const btn = el('button', 'opcion solo-texto', c.texto,
      { type: 'button', 'data-i': String(idx) });

    btn.addEventListener('click', () => {
      if (btn.classList.contains('bloqueada')) return;
      [...opciones.children].forEach((o) => o.classList.add('bloqueada'));

      const acerto = esCorrecta(c);
      btn.classList.add(acerto ? 'correcta' : 'errada');
      if (!acerto) {
        const iBuena = cartas.findIndex(esCorrecta);
        opciones.querySelector(`[data-i="${iBuena}"]`)?.classList.add('correcta');
      }

      ctx.responder({
        acerto,
        concepto: typeof concepto === 'function' ? concepto(c) : concepto,
        mensajeBien: uno(AVISOS.bien),
        mensajeMal: typeof mensajeMal === 'function' ? mensajeMal(c) : mensajeMal,
        pista: null,   // el ensayo mide, no ensena
      });
    });
    opciones.append(btn);
  });

  ctx.zonaJuego.append(opciones);
}

/* ---------- 1. Verdadero o falso: el formato de la ficha ---------- */
function preguntaVF(ctx, a) {
  ctx.pedir({ instruccion: '¿Es verdadero o falso?' });
  ctx.zonaJuego.append(el('div', 'afirmacion', a.texto));

  armar(ctx, {
    cartas: [{ texto: '✅ Verdadero', v: true }, { texto: '❌ Falso', v: false }],
    esCorrecta: (c) => c.v === a.verdadero,
    clase: 'dos',
    concepto: a.concepto,
    mensajeMal: a.verdadero ? 'Era verdadero.' : 'Era falso.',
  });
}

/* ---------- 2. Comunidades del pasado ---------- */
function preguntaPasado(ctx) {
  const c = uno(PASADO);
  const porAporte = Math.random() < 0.6;

  if (porAporte) {
    ctx.pedir({ instruccion: `¿Qué comunidad aportó ${c.aporteClave}?` });
    const t = el('div', 'tarjeta-dibujo chica');
    t.innerHTML = dibujo(DIBUJO_DE[c.id]);
    ctx.zonaJuego.append(t);

    armar(ctx, {
      cartas: barajar(PASADO).map((x) => ({ texto: x.corto, id: x.id })),
      esCorrecta: (x) => x.id === c.id,
      clase: 'dos',
      concepto: c.id,
      mensajeMal: `Fueron los ${c.corto.toLowerCase()}.`,
    });
    return;
  }

  ctx.pedir({
    instruccion: `Los ${c.corto.toLowerCase()} venían de ${c.origen_geo}. `
               + '¿De qué continente?',
  });
  armar(ctx, {
    cartas: [{ texto: 'África' }, { texto: 'Europa' }, { texto: 'Asia' }],
    esCorrecta: (x) => x.texto === c.continente,
    clase: 'tres',
    concepto: c.id,
    mensajeMal: `${c.origen_geo} está en ${c.continente}.`,
  });
}

/* ---------- 3. Comunidades del presente ---------- */
function preguntaPresente(ctx) {
  const n = uno(NINOS);
  const tipo = Math.random();

  // 3a: de que pais viene
  if (tipo < 0.4) {
    ctx.pedir({ instruccion: `Alguien te saluda diciendo “${n.saludo}”. ¿De dónde viene?` });
    armar(ctx, {
      cartas: barajar(NINOS).map((x) => ({ texto: x.pais, id: x.id })),
      esCorrecta: (x) => x.id === n.id,
      clase: 'dos',
      concepto: n.idioma === 'creole' ? 'creole' : n.id,
      mensajeMal: `Es ${n.nombre}, de ${n.pais}.`,
    });
    return;
  }

  // 3b: que idioma habla
  if (tipo < 0.7) {
    ctx.pedir({ instruccion: `${n.nombre} viene de ${n.pais}. ¿Qué idioma habla en su casa?` });
    armar(ctx, {
      cartas: [{ texto: 'creole' }, { texto: 'español' }, { texto: 'chino' }],
      esCorrecta: (x) => x.texto === n.idioma,
      clase: 'tres',
      concepto: n.idioma === 'creole' ? 'creole' : n.id,
      mensajeMal: `Habla ${n.idioma}.`,
    });
    return;
  }

  // 3c: pasado o presente
  const esPasado = Math.random() < 0.5;
  const grupo = esPasado
    ? uno(PASADO).corto
    : uno(Object.values(PAISES_PRESENTE).flat());

  ctx.pedir({
    instruccion: esPasado
      ? `Los ${grupo.toLowerCase()}, ¿cuándo llegaron a Chile?`
      : `Los inmigrantes de ${grupo}, ¿cuándo llegaron a Chile?`,
  });
  armar(ctx, {
    cartas: [
      { texto: '🕰️ En el pasado', v: 'pasado' },
      { texto: '🌎 En los últimos años', v: 'presente' },
    ],
    esCorrecta: (x) => x.v === (esPasado ? 'pasado' : 'presente'),
    clase: 'dos',
    concepto: esPasado ? 'pasado' : 'presente',
    mensajeMal: esPasado ? 'Llegaron en el pasado.' : 'Llegaron en los últimos años.',
  });
}

/* ---------- 4. Aportes y multiculturalidad ---------- */
function preguntaAportes(ctx) {
  const esDefinicion = Math.random() < 0.4;

  if (esDefinicion) {
    ctx.pedir({ instruccion: '¿Qué es una sociedad multicultural?' });
    armar(ctx, {
      cartas: barajar([
        { texto: 'Una sociedad que incluye diversas culturas', ok: true },
        { texto: 'Una sociedad donde todos vienen del mismo país', ok: false },
        { texto: 'Una sociedad donde solo se habla un idioma', ok: false },
      ]),
      esCorrecta: (c) => c.ok,
      concepto: 'multicultural',
      mensajeMal: 'Es la que incluye diversas culturas.',
    });
    return;
  }

  const a = uno(AMBITOS);
  ctx.pedir({ instruccion: `"${a.ejemplo}". ¿A qué tipo de aporte corresponde?` });

  const t = el('div', 'tarjeta-dibujo chica');
  t.innerHTML = dibujo(DIBUJO_AMBITO[a.id]);
  ctx.zonaJuego.append(t);

  armar(ctx, {
    cartas: barajar(AMBITOS).map((x) => ({ texto: `${x.icono} ${x.nombre}`, id: x.id })),
    esCorrecta: (x) => x.id === a.id,
    clase: 'tres',
    concepto: a.id,
    mensajeMal: `Es un aporte de tipo ${a.nombre.toLowerCase()}.`,
  });
}

/* ---------- 5. Respeto ---------- */
function preguntaRespeto(ctx) {
  const buena = uno(ACCIONES.filter((a) => a.respeta));
  const malas = barajar(ACCIONES.filter((a) => !a.respeta)).slice(0, 2);

  ctx.pedir({
    instruccion: 'Llega a tu curso alguien de otro país. ¿Cuál de estas cosas '
               + 'demuestra respeto?',
  });

  armar(ctx, {
    cartas: barajar([buena, ...malas]).map((a) => ({ texto: a.texto, ok: a.respeta })),
    esCorrecta: (c) => c.ok,
    concepto: 'respeto',
    mensajeMal: `La respetuosa es: ${buena.texto.toLowerCase()}.`,
  });
}
