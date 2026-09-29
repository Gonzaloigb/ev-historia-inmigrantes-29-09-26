"""
probar_preguntas.py — prueba de las PREGUNTAS del juego, no de las pantallas.

`verificar.py` mira que el juego se vea y funcione. Este mira lo que se
pregunta, jugando cada zona varias vueltas completas en modo normal:

  1. REPETICION. Falla si una misma pregunta sale dos veces en la misma vuelta
     de una zona. Antes de esta prueba, la version publicada repetia 24 de
     cada 130 preguntas: la definicion de "multicultural" salia dos veces
     identica en su zona, y una comunidad podia salir tres veces.

  2. NIVEL (2° basico, 7 anos). Falla si:
       - una alternativa pasa de MAX_PALABRAS_ALTERNATIVA palabras,
       - la pregunta (instruccion + afirmacion) pasa de MAX_PALABRAS_PREGUNTA,
       - una zona ofrece mas de 3 alternativas en modo normal (el ensayo
         queda fuera: mide sin ayudas).

  3. CONGRUENCIA CON EL LIBRO. No se puede automatizar del todo: que una
     pregunta tenga respaldo en el texto lo juzga una persona. Lo que el
     script hace es escribir en `preguntas.txt` TODAS las preguntas distintas
     que salieron, con su respuesta correcta, para revisarlas contra
     `CONTENIDOS.md` y las paginas del libro de una sola pasada.

Uso:
    npm run build
    python probar_preguntas.py        # 6 vueltas por zona
    python probar_preguntas.py 15     # mas vueltas, mas cobertura del catalogo

El reloj del navegador se adelanta a mano (page.clock), asi que no espera
las pausas del juego: seis vueltas por zona toman menos de un minuto.
"""

import random
import sys
from collections import Counter, defaultdict
from pathlib import Path

from playwright.sync_api import sync_playwright

RAIZ = Path(__file__).parent
DIST = RAIZ / "dist" / "index.html"
SALIDA = RAIZ / "preguntas.txt"

CLAVE_ESTADO = "inmigrantes-chile-v1"   # la de src/estado.js
ZONA_ENSAYO = "Ensayo de la ficha"       # mide sin ayudas: puede mostrar todas

MAX_PALABRAS_ALTERNATIVA = 12
MAX_PALABRAS_PREGUNTA = 20
MAX_ALTERNATIVAS_NORMAL = 3

problemas = []


def palabras(texto):
    return len(texto.split())


def leer_pregunta(page):
    instruccion = page.inner_text(".consigna .instruccion").strip()
    extra = []
    for sel in (".afirmacion", ".ficha-nino"):
        nodo = page.query_selector(sel)
        if nodo:
            extra.append(nodo.inner_text().strip())
    return instruccion, " ".join(extra)


def jugar_vuelta(page, zi, titulo, catalogo, apariciones):
    page.goto(DIST.as_uri())
    page.clock.run_for(400)
    page.click("button.btn-grande")
    page.clock.run_for(400)
    page.query_selector_all(".tarjeta-zona")[zi].click()
    page.clock.run_for(400)

    vistas = Counter()
    for n in range(40):
        if page.query_selector(".fiesta"):
            break
        opciones = page.query_selector_all(".opcion:not(.bloqueada)")
        if not opciones:
            problemas.append(f"{titulo} p{n + 1}: no hay alternativas para tocar")
            return
        instruccion, extra = leer_pregunta(page)
        firma = f"{instruccion} {extra}".strip()
        vistas[firma] += 1

        textos = [" ".join(o.inner_text().split()) for o in opciones]

        # --- Nivel ---
        if palabras(firma) > MAX_PALABRAS_PREGUNTA:
            problemas.append(f"{titulo}: pregunta de {palabras(firma)} palabras: {firma}")
        for t in textos:
            if palabras(t) > MAX_PALABRAS_ALTERNATIVA:
                problemas.append(f"{titulo}: alternativa de {palabras(t)} palabras: {t}")
        if titulo != ZONA_ENSAYO and len(textos) > MAX_ALTERNATIVAS_NORMAL:
            problemas.append(f"{titulo}: {len(textos)} alternativas en modo normal: {firma}")

        # Responder al azar, para pasar tambien por los errores
        random.choice(opciones).click()
        page.clock.run_for(100)
        buena = page.query_selector(".opcion.correcta")
        respuesta = " ".join(buena.inner_text().split()) if buena else "?"
        catalogo[titulo][firma].add(respuesta)
        apariciones[titulo][firma] += 1

        seguir = page.query_selector(".btn-seguir")
        if seguir:
            seguir.click()
        # El reloj es de mentira: adelantar de mas no cuesta nada, y cubre
        # juegos que esperan hasta 2,9 s tras un error.
        page.clock.run_for(3500)

    for firma, veces in vistas.items():
        if veces > 1:
            problemas.append(f"{titulo}: sale {veces} veces en la misma vuelta: {firma}")


def main():
    if not DIST.exists():
        print(f"No existe {DIST}. Corre primero: npm run build")
        sys.exit(1)
    vueltas = int(sys.argv[1]) if len(sys.argv) > 1 else 6

    catalogo = defaultdict(lambda: defaultdict(set))
    apariciones = defaultdict(Counter)

    with sync_playwright() as pw:
        nav = pw.chromium.launch()
        ctx = nav.new_context(viewport={"width": 390, "height": 800})
        page = ctx.new_page()
        errores = []
        page.on("pageerror", lambda e: errores.append(str(e)))
        page.clock.install()

        # Todas las zonas abiertas y en modo normal
        page.goto(DIST.as_uri())
        page.evaluate(
            """(clave) => localStorage.setItem(clave, JSON.stringify({
                estrellas: {pasado: 3, aportes: 3, presente: 3, multicultural: 3,
                            respeto: 3, simulacro: 3},
                palabras: {}, simulacros: [], modo: 'normal' }))""",
            CLAVE_ESTADO,
        )
        page.goto(DIST.as_uri())
        page.clock.run_for(400)
        page.click("button.btn-grande")
        page.clock.run_for(400)
        # "Zona 3: Los que llegan hoy" → "Los que llegan hoy"
        titulos = [
            t.get_attribute("aria-label").split(": ", 1)[-1]
            for t in page.query_selector_all(".tarjeta-zona")
        ]

        for zi, titulo in enumerate(titulos):
            for _ in range(vueltas):
                jugar_vuelta(page, zi, titulo, catalogo, apariciones)
            print(f"  {titulo}: {len(catalogo[titulo])} preguntas distintas en {vueltas} vueltas")

        problemas.extend(f"error de consola: {e[:150]}" for e in errores)
        nav.close()

    # --- Catalogo para la revision a mano contra el libro ---
    lineas = [
        "Catalogo de preguntas — generado por probar_preguntas.py.",
        "Revisar cada una contra CONTENIDOS.md y el libro: ¿tiene respaldo en el",
        "texto? ¿la respuesta es la del libro? ¿se entiende a los 7 anos?",
        "",
    ]
    for titulo in titulos:
        lineas.append(f"=== {titulo} ({len(catalogo[titulo])} preguntas distintas) ===")
        for firma in sorted(catalogo[titulo]):
            resp = " / ".join(sorted(catalogo[titulo][firma]))
            lineas.append(f"- {firma}")
            lineas.append(f"    → {resp}   (salió {apariciones[titulo][firma]} veces)")
        lineas.append("")
    SALIDA.write_text("\n".join(lineas), encoding="utf-8")
    print(f"\nCatalogo escrito en {SALIDA.name}")

    print("\n" + "=" * 60)
    if problemas:
        print(f"{len(problemas)} problema(s):")
        for p in problemas:
            print(f"  [X] {p}")
        sys.exit(1)
    print("Sin repeticiones ni problemas de nivel.")
    print("Falta a mano: revisar preguntas.txt contra el libro.")


if __name__ == "__main__":
    main()
