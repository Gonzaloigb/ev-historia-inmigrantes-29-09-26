# Chile, país de muchas culturas

Juego para practicar la prueba de historia de 2° básico: las comunidades de
inmigrantes que se han establecido en Chile, sus aportes y la sociedad
multicultural.

**Jugar:** https://gonzaloigb.github.io/ev-historia-inmigrantes-29-09-26/

## Qué trae

Seis zonas, sobre la Lección 2 del texto de estudio (pp. 92-101):

| Zona | Contenido |
|---|---|
| 1 · Los que llegaron antes | Afrodescendientes, alemanes, ingleses y árabes |
| 2 · ¿Qué nos dejaron? | Fútbol, bomberos, kuchen, telas |
| 3 · Los que llegan hoy | Marie, Juan Carlos, Yun y Facundo |
| 4 · Un país de muchas culturas | Arte, gastronomía y comercio |
| 5 · Respetar al que llega | Cómo se demuestra en el día a día |
| 6 · Ensayo de la ficha | Como la evaluación, sin ayudas |

La evaluación es una **ficha de aprendizaje** con formato similar a las
actividades de las pp. 99-101, así que el juego practica sobre todo
verdadero/falso.

## Dos modos

- **🌱 Normal** — tres alternativas y, al fallar, la explicación de la regla.
- **🔥 Difícil** — todas las alternativas, sin pistas y con 3 vidas.

El modo difícil nunca esconde materia nueva: solo quita ayudas.

## Desarrollo

```bash
npm install
npm run dev      # servidor con recarga en vivo
npm run build    # compila a dist/index.html, en UN solo archivo
python verificar.py --todos   # prueba de humo en WebKit y Chromium
```

El build produce un único HTML autocontenido a propósito, para que funcione al
abrirlo con doble clic (`file://`), donde los navegadores bloquean los módulos ES.

Se publica solo en cada push a `master`.
