/**
 * datos.js — el contenido de la leccion, como datos.
 *
 * Es la FUENTE DE VERDAD del juego. Ningun texto de la materia debe escribirse
 * dentro de la logica de un minijuego: se declara aqui y desde aqui se consume.
 * Se refleja de `CONTENIDOS.md`; si algo cambia alla, cambia aqui.
 *
 * TEMA: Leccion 2, "Que comunidades de inmigrantes se han establecido en Chile"
 * (pp. 92-101). NO es el mestizaje — eso fue la prueba de agosto, y su juego
 * vive en `Historia/2026-08-26 mestizaje/`.
 *
 * SOBRE EL CAMPO `origen`:
 *
 *   'libro'    → el ejercicio literal de las pp. 99-101.
 *   'variante' → misma materia y mismo formato, con otras frases.
 *
 * La profesora pidio no desarrollar esas paginas en casa. Gonzalo decidio el
 * 27-09-2026 incluirlas igual, para que Marina practique el formato exacto.
 * Van las dos cosas: si la ficha de la prueba trae frases distintas, la
 * practica sirve igual. Si la decision se revisa, se quitan las 'libro'.
 */

/* =========================================================================
   1. Comunidades del PASADO (pp. 92-95)
   ========================================================================= */

export const PASADO = [
  {
    id: 'afrodescendientes',
    nombre: 'Pueblo Tribal Afrodescendiente Chileno',
    corto: 'Afrodescendientes',
    origen_geo: 'África',
    continente: 'África',
    porQue: 'Fueron traídos por las expediciones españolas en condición de esclavitud. '
          + 'Tiempo después se prohibió la esclavitud y pudieron ser libres.',
    porQueCorto: 'Los trajeron en esclavitud, sin su libertad',
    aportes: ['Mantienen sus costumbres ancestrales', 'El Baile de Morenos de Paso'],
    // Sin aporte preguntable: el libro los describe ("mantienen sus costumbres
    // ancestrales"), no les atribuye un aporte como a los otros tres. Y el
    // crucigrama de la p.95 solo pregunta por alemanes, ingleses y arabes.
    aporteClave: null,
    preguntaContinente: '¿De qué continente trajeron a las personas afrodescendientes?',
    donde: null,
    color: '#B45309',
    icono: '🪘',
  },
  {
    id: 'alemanes',
    nombre: 'Alemanes',
    corto: 'Alemanes',
    origen_geo: 'Alemania',
    continente: 'Europa',
    porQue: 'Llegaron gracias a una ley de inmigración que existió en Chile.',
    porQueCorto: 'Por una ley de inmigración',
    aportes: ['La arquitectura de sus viviendas', 'Comidas y pasteles, como los kuchenes'],
    aporteClave: 'la arquitectura y los kuchenes',
    // El libro no dice de que continente es Alemania: no se pregunta.
    preguntaContinente: null,
    donde: 'la Zona Sur del país',
    color: '#CA8A04',
    icono: '🏡',
  },
  {
    id: 'ingleses',
    nombre: 'Ingleses',
    corto: 'Ingleses',
    origen_geo: 'Inglaterra',
    continente: 'Europa',
    porQue: 'Llegaron principalmente por temas de negocios.',
    porQueCorto: 'Por negocios',
    aportes: ['Las primeras compañías de bomberos voluntarios', 'La difusión del fútbol'],
    aporteClave: 'el fútbol y los bomberos',
    preguntaContinente: null,
    donde: 'Punta Arenas, Valparaíso, Santiago y Antofagasta',
    color: '#1D4ED8',
    icono: '⚽',
  },
  {
    id: 'arabes',
    nombre: 'Árabes',
    corto: 'Árabes',
    origen_geo: 'Palestina, Siria y Líbano',
    continente: 'Asia',   // ojo: NO Africa. Es el error mas probable.
    porQue: 'Llegaron por dificultades en sus países de origen.',
    porQueCorto: 'Por dificultades en sus países',
    // "Conservan sus tradiciones y creencias" NO va aqui: el libro lo cuenta
    // de ellos, pero no como un aporte a Chile. Los clubes si (p.94).
    aportes: ['El comercio y la industria, especialmente de telas',
              'Clubes deportivos, como Palestino'],
    aporteClave: 'el comercio de telas',
    // El libro lo dice explicito (p.94): "paises de Asia, como Palestina...".
    preguntaContinente: '¿De qué continente venían los árabes?',
    donde: null,
    color: '#15803D',
    icono: '🧵',
  },
];

export function comunidad(id) {
  const c = PASADO.find((x) => x.id === id);
  if (!c) throw new Error(`Comunidad desconocida: ${id}`);
  return c;
}

/** Clubes de futbol que dejaron, con foto en el libro. */
export const CLUBES = [
  { nombre: 'Palestino', de: 'arabes', nota: 'el más famoso de la comunidad árabe' },
  { nombre: 'Santiago Wanderers', de: 'ingleses', nota: 'el equipo más antiguo de Chile' },
  { nombre: 'Everton de Viña del Mar', de: 'ingleses', nota: null },
];

/* =========================================================================
   2. Comunidades del PRESENTE (pp. 96-97)
   ========================================================================= */

/** De donde vienen los grupos recientes, por continente. */
export const PAISES_PRESENTE = {
  América: ['Argentina', 'Perú', 'Bolivia', 'Colombia', 'Haití', 'Venezuela'],
  Europa: ['España'],
  Asia: ['China'],
};

/**
 * Para preguntar "¿llegaron en el pasado o en los ultimos anos?".
 *
 * Espana queda fuera: el libro la nombra entre los inmigrantes recientes
 * (p.96), pero los espanoles tambien llegaron en el pasado — es la Leccion 1,
 * que Marina ya estudio. La pregunta tendria dos respuestas.
 */
export const GRUPOS_CUANDO = [
  ...PASADO.map((c) => ({ texto: c.corto, esPasado: true })),
  ...Object.values(PAISES_PRESENTE).flat()
    .filter((p) => p !== 'España')
    .map((p) => ({ texto: p, esPasado: false })),
];

/**
 * Los cuatro ninos del libro. Son material directo de prueba: la ficha de la
 * p.99 pide escoger a uno de ellos.
 */
export const NINOS = [
  {
    id: 'marie',
    nombre: 'Marie',
    pais: 'Haití',
    continente: 'América',
    saludo: 'Bonjou, koman ou ye?',
    // Solo los saludos en otro idioma dicen de donde viene alguien. "Hola,
    // ¿que tal?" podria ser de Argentina, de Venezuela o de Chile.
    saludoDistinto: true,
    preguntaPais: '¿De qué país viene Marie?',
    idioma: 'creole',
    idiomaNota: 'Hablan creole, pero está aprendiendo español.',
    tradicion: 'el poul fri, que es pollo frito',
    tipoTradicion: 'comida',
    color: '#DC2626',
    icono: '🇭🇹',
  },
  {
    id: 'juancarlos',
    nombre: 'Juan Carlos',
    pais: 'Venezuela',
    continente: 'América',
    saludo: '¡Hola! Soy Juan Carlos',
    saludoDistinto: false,
    preguntaPais: '¿De qué país viene Juan Carlos?',
    idioma: 'español',
    idiomaNota: 'Habla español, igual que en Chile.',
    tradicion: 'las arepas',
    tipoTradicion: 'comida',
    extra: 'Extraña el clima de su país: aquí en invierno le da frío.',
    color: '#CA8A04',
    icono: '🇻🇪',
  },
  {
    id: 'yun',
    nombre: 'Yun',
    pais: 'China',
    continente: 'Asia',
    saludo: 'Nǐhǎo',
    saludoDistinto: true,
    // Yun nacio en Chile (p.97): "¿de que pais viene?" seria una pregunta mal
    // hecha. Lo que el libro dice es que sus PADRES son de China.
    preguntaPais: '¿De qué país son los papás de Yun?',
    paisNota: 'Yun nació en Chile, pero sus papás son de China.',
    idioma: 'chino',
    idiomaNota: 'Con su familia habla chino, y aprendió muy bien el español.',
    // El libro no le atribuye una comida ni una tradicion: no se pregunta.
    tradicion: null,
    tipoTradicion: null,
    extra: 'Nació en Chile; sus padres son de China y se dedican al comercio.',
    color: '#B91C1C',
    icono: '🇨🇳',
  },
  {
    id: 'facundo',
    nombre: 'Facundo',
    pais: 'Argentina',
    continente: 'América',
    saludo: 'Hola, ¿qué tal?',
    saludoDistinto: false,
    preguntaPais: '¿De qué país viene Facundo?',
    idioma: 'español',
    idiomaNota: 'Habla español, igual que en Chile.',
    tradicion: 'el asado en familia',
    tipoTradicion: 'costumbre',
    extra: 'Llegó hace un año por el trabajo de su papá. Le gusta el fútbol.',
    color: '#0891B2',
    icono: '🇦🇷',
  },
];

export function nino(id) {
  const n = NINOS.find((x) => x.id === id);
  if (!n) throw new Error(`Niño desconocido: ${id}`);
  return n;
}

/* =========================================================================
   3. Sociedad multicultural y aportes (p.98)
   ========================================================================= */

export const MULTICULTURAL =
  'Una sociedad multicultural es la que incluye diversas culturas. Se forma porque ' +
  'todas las comunidades de inmigrantes mantienen y comparten aspectos de su cultura.';

export const AMBITOS = [
  {
    id: 'arte',
    nombre: 'Expresiones artísticas',
    // La palabra del libro va siempre; la explicacion simple, solo en modo
    // normal. "Gastronomia" no es una palabra que se sepa a los 7 anos.
    simple: 'música y baile',
    que: 'La música y la danza de distintos grupos latinoamericanos.',
    ejemplo: 'la salsa, un baile de origen caribeño',
    icono: '💃',
  },
  {
    id: 'gastronomia',
    nombre: 'Gastronomía',
    simple: 'comidas',
    que: 'Comidas de distintas culturas que aportan diversidad de sabores.',
    ejemplo: 'el ají de gallina, plato típico peruano',
    otros: ['comida peruana', 'comida mexicana', 'comida china', 'comida coreana'],
    icono: '🍲',
  },
  {
    id: 'comercio',
    nombre: 'Comercio',
    simple: 'productos y tiendas',
    que: 'Gran diversidad de productos y servicios.',
    ejemplo: 'los locales con productos chinos',
    otros: ['chinos', 'peruanos', 'venezolanos', 'colombianos'],
    icono: '🏪',
  },
];

/* =========================================================================
   4. Respeto a la diversidad (pp. 99-101) — el eje actitudinal
   ========================================================================= */

export const ACCIONES = [
  { texto: 'Invitar a jugar a un compañero nuevo que llegó de otro país', respeta: true },
  { texto: 'Preguntarle con interés cómo se dice algo en su idioma', respeta: true },
  { texto: 'Probar una comida típica de su país sin decir "qué asco"', respeta: true },
  { texto: 'Aprender a decir bien su nombre', respeta: true },
  { texto: 'Escuchar lo que cuenta de sus tradiciones', respeta: true },
  { texto: 'Reírse de cómo pronuncia las palabras en español', respeta: false },
  { texto: 'Dejarlo solo en el recreo porque habla distinto', respeta: false },
  { texto: 'Decirle que las comidas de su país son raras', respeta: false },
  { texto: 'No invitarlo al cumpleaños porque es de otro país', respeta: false },
];

/** Del recuadro "Somos ciudadania" (p.96). */
export const DERECHO_EDUCACION =
  'Una forma en la que Chile ayuda a las familias que migran es garantizando el ' +
  'derecho a la educación de niños y niñas sin condiciones.';

/* =========================================================================
   5. Afirmaciones verdadero / falso

   Formato literal de la p.101, que es lo que la profesora dijo que tendria la
   ficha de evaluacion. Ver la nota sobre `origen` en la cabecera.
   ========================================================================= */

export const AFIRMACIONES = [
  /* --- Las cuatro literales del libro (p.101) --- */
  {
    texto: 'El fútbol llegó a Chile por la inmigración argentina.',
    verdadero: false,
    porque: 'El fútbol es legado de la inmigración inglesa, no argentina.',
    concepto: 'ingleses',
    origen: 'libro',
  },
  {
    texto: 'En Haití se habla el idioma creole.',
    verdadero: true,
    porque: 'Marie, que viene de Haití, cuenta que hablan creole.',
    concepto: 'creole',
    origen: 'libro',
  },
  {
    texto: 'Un aporte importante de las comunidades inmigrantes tiene relación con sus comidas.',
    verdadero: true,
    porque: 'La gastronomía es uno de los tres grandes aportes, junto con el arte y el comercio.',
    concepto: 'gastronomia',
    origen: 'libro',
  },
  {
    texto: 'Todas las personas inmigrantes tienen dificultades con el idioma del país al que llegan.',
    verdadero: false,
    // El error esta en "todas". Esa distincion es lo que de verdad se evalua.
    porque: 'Fíjate en la palabra "todas". Facundo y Juan Carlos ya hablaban español, '
          + 'y Yun aprendió muy bien. Algunas personas sí tienen dificultades, pero no todas.',
    concepto: 'generalizar',
    origen: 'libro',
  },

  /* --- Variantes: misma materia y mismo formato, otras frases --- */
  {
    texto: 'Los alemanes se instalaron principalmente en la Zona Sur de Chile.',
    verdadero: true,
    porque: 'Llegaron a la Zona Sur; un ejemplo del libro es una casa en Valdivia.',
    concepto: 'alemanes',
    origen: 'variante',
  },
  {
    texto: 'El kuchen es un aporte de la comunidad alemana.',
    verdadero: true,
    porque: 'Los alemanes aportaron sus comidas y pasteles, entre ellos los kuchenes.',
    concepto: 'alemanes',
    origen: 'variante',
  },
  {
    texto: 'Los árabes que llegaron a Chile venían de países de África.',
    verdadero: false,
    porque: 'Venían de países de Asia: Palestina, Siria y Líbano.',
    concepto: 'arabes',
    origen: 'variante',
  },
  {
    texto: 'Las primeras compañías de bomberos voluntarios se formaron con aporte inglés.',
    verdadero: true,
    porque: 'Es uno de los dos grandes aportes ingleses, junto con el fútbol.',
    concepto: 'ingleses',
    origen: 'variante',
  },
  {
    texto: 'Todos los inmigrantes que llegan a Chile vienen de países de América.',
    verdadero: false,
    porque: 'Fíjate en la palabra "todos". También llegan de Europa, como España, '
          + 'y de Asia, como China.',
    concepto: 'generalizar',
    origen: 'variante',
  },
  {
    texto: 'El club deportivo Palestino fue formado por la comunidad árabe.',
    verdadero: true,
    porque: 'Es el más famoso de los clubes que formó la comunidad árabe.',
    concepto: 'arabes',
    origen: 'variante',
  },
  {
    texto: 'Las personas afrodescendientes llegaron a Chile por una ley de inmigración.',
    verdadero: false,
    porque: 'Fueron traídas por las expediciones españolas en condición de esclavitud. '
          + 'La ley de inmigración fue la que trajo a los alemanes.',
    concepto: 'afrodescendientes',
    origen: 'variante',
  },
  {
    texto: 'Una sociedad multicultural es la que incluye diversas culturas.',
    verdadero: true,
    porque: 'Es la definición del libro: se forma porque cada comunidad mantiene y '
          + 'comparte aspectos de su cultura.',
    concepto: 'multicultural',
    origen: 'variante',
  },

  /* --- Mas generalizaciones ---
     Marina fallo justo la afirmacion con "todas" en su libro (p.101): marco V
     cuando era F. No es una conjetura, es su error real. Por eso este patron
     tiene cuatro afirmaciones y no una: es lo que mas hay que reforzar.      */
  {
    // Reemplaza a "Todos los alemanes se dedicaron a la arquitectura", cuya
    // justificacion mezclaba "a que se dedicaron" con "que aportaron". Esta la
    // desmiente el propio libro, como la de la p.101: Yun nacio en Chile.
    texto: 'Marie, Juan Carlos, Yun y Facundo nacieron todos en otro país.',
    verdadero: false,
    porque: 'Fíjate en la palabra "todos". Yun nació en Chile; sus papás son de China.',
    concepto: 'generalizar',
    origen: 'variante',
  },
  {
    texto: 'Algunas comunidades de inmigrantes conservan sus tradiciones y creencias.',
    verdadero: true,
    // El contrapeso: no toda frase con cuantificador es falsa. Si todas las
    // generalizaciones fueran falsas, Marina aprenderia a marcar F sin leer.
    porque: 'Aquí dice "algunas", y es cierto: los árabes, por ejemplo, conservan sus '
          + 'tradiciones y creencias religiosas.',
    concepto: 'generalizar',
    origen: 'variante',
  },
];

/**
 * La regla que Marina no aplico en la p.101: marco V en "Todas las personas
 * inmigrantes tienen dificultades con el idioma", y era F. En modo normal se
 * muestra como apoyo justo en las frases donde aplica.
 */
export const REGLA_TODOS =
  'Si la frase dice "todos" o "todas", revisa si es cierto para todos. '
  + 'Si hay uno solo que no, es falsa.';

/* =========================================================================
   6. Pistas de error
   ========================================================================= */

/**
 * Devuelve la regla que explica un error concreto, o null si no hay nada util
 * que decir.
 *
 * Igual que en los otros juegos del proyecto: la pista DEBE verificar que el
 * error es el que cree. Explicar la regla equivocada confunde mas que callar.
 */
export function pistaDeError(respondio, esperaba) {
  // --- El distractor que el propio libro usa ---
  if (esperaba === 'ingleses' && respondio === 'argentina') {
    return 'El fútbol lo trajeron los ingleses, no los argentinos. Los ingleses también '
         + 'formaron las primeras compañías de bomberos.';
  }

  // --- Arabes: Asia, no Africa ---
  if (esperaba === 'arabes' && respondio === 'afrodescendientes') {
    return 'Los árabes vienen de Asia: Palestina, Siria y Líbano. Las personas '
         + 'afrodescendientes vienen de África.';
  }
  if (esperaba === 'Asia' && respondio === 'África') {
    return 'Ojo: los árabes vienen de Asia, no de África. Palestina, Siria y Líbano '
         + 'están en Asia.';
  }

  // --- Pasado vs presente: dos listas parecidas en paginas seguidas ---
  if (esperaba === 'pasado' && respondio === 'presente') {
    return 'Esa es una comunidad del pasado: afrodescendientes, alemanes, ingleses y '
         + 'árabes llegaron hace mucho tiempo.';
  }
  if (esperaba === 'presente' && respondio === 'pasado') {
    return 'Esa es una comunidad de los últimos años: haitianos, venezolanos, chinos, '
         + 'argentinos y otros.';
  }

  // --- Por que llegaron: cada comunidad tuvo su razon ---
  if (esperaba === 'alemanes' && respondio === 'afrodescendientes') {
    return 'Los alemanes llegaron por una ley de inmigración. Las personas '
         + 'afrodescendientes fueron traídas en condición de esclavitud.';
  }

  return null;
}

/* =========================================================================
   7. Las zonas del mapa
   ========================================================================= */

export const ZONAS = [
  {
    id: 'pasado',
    n: 1,
    titulo: 'Los que llegaron antes',
    subtitulo: 'Afrodescendientes, alemanes, ingleses y árabes',
    icono: '🕰️',
    momento: 'pasado',
  },
  {
    id: 'aportes',
    n: 2,
    titulo: '¿Qué nos dejaron?',
    subtitulo: 'Fútbol, bomberos, kuchen, telas',
    icono: '🎁',
    momento: 'aportes',
  },
  {
    id: 'presente',
    n: 3,
    titulo: 'Los que llegan hoy',
    subtitulo: 'Marie, Juan Carlos, Yun y Facundo',
    icono: '🌎',
    momento: 'presente',
  },
  {
    id: 'multicultural',
    n: 4,
    titulo: 'Un país de muchas culturas',
    subtitulo: 'Arte, comida y comercio',
    icono: '🎨',
    momento: 'multi',
  },
  {
    id: 'respeto',
    n: 5,
    titulo: 'Respetar al que llega',
    subtitulo: 'Cómo se demuestra en el día a día',
    icono: '🤝',
    momento: 'respeto',
  },
  {
    id: 'simulacro',
    n: 6,
    titulo: 'Ensayo de la ficha',
    subtitulo: 'Como la evaluación, sin ayudas',
    icono: '📝',
    momento: 'prueba',
  },
];

export function zona(id) {
  const z = ZONAS.find((x) => x.id === id);
  if (!z) throw new Error(`Zona desconocida: ${id}`);
  return z;
}

/* =========================================================================
   8. Avisos
   ========================================================================= */

export const AVISOS = {
  bien: ['¡Muy bien! 🎉', '¡Correcto! 🌎', '¡Eso es! ⭐', '¡Perfecto! 🤝'],
  mal: ['Casi… 💪', 'No es esa 🤔', 'Vuelve a mirar 👀'],
};
