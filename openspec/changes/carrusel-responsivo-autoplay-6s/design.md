## Context

El proyecto usa Next.js con Pages Router y un componente `Carousel` reutilizable en la home. Actualmente existe una base funcional, pero el comportamiento de rotacion automatica no esta especificado como contrato y puede ser inconsistente entre viewports e interacciones de usuario.

La implementacion debe mantenerse en alcance frontend, sin cambios de API ni base de datos. Tambien debe preservar accesibilidad y evitar movimiento inesperado mientras el usuario interactua.

## Goals / Non-Goals

**Goals:**

- Implementar autoplay cada 6 segundos para carrusel de home con mas de una slide.
- Garantizar comportamiento responsive legible en movil, tablet y desktop.
- Pausar autoplay en hover/focus y reanudar al terminar la interaccion.
- Mantener navegacion manual coherente con autoplay.
- Mostrar una imagen de banner por defecto mientras la imagen principal de cada slide carga.
- Cubrir reglas con tests de componente/UI.

**Non-Goals:**

- No introducir nuevas rutas de API ni cambios en Prisma/PostgreSQL.
- No rediseñar globalmente el design system.
- No implementar carrito, autenticacion ni pagos.

## Decisions

1. Temporizador basado en `setInterval` controlado por estado del componente.
   Rationale: simple, predecible y suficiente para un intervalo fijo de 6 segundos.
   Alternativas: `requestAnimationFrame` (innecesario para ticks discretos) o libreria externa (sobrecarga para este alcance).

2. Modelo de pausa con banderas de interaccion (`isHovered`, `isFocusedWithin`).
   Rationale: separa claramente causas de pausa y evita condiciones ambiguas.
   Alternativas: un unico flag derivado por eventos agregados, mas propenso a errores al combinar entradas.

3. Guard clause para `slides.length <= 1`.
   Rationale: evita trabajo innecesario, elimina transiciones irrelevantes y mejora claridad.
   Alternativas: mantener timer activo con no-op, menos eficiente y menos explicito.

4. Estrategia responsive con tres tamanos explicitos: movil, tablet y desktop.
   Rationale: evita interpretaciones ambiguas de breakpoints y simplifica QA.
   Alternativas: mantener solo mobile/desktop, insuficiente para garantizar continuidad visual intermedia.

5. Pruebas centradas en comportamiento observable.
   Rationale: validar avance temporal, pausa/reanudacion y compatibilidad manual sin acoplar a implementacion interna.
   Alternativas: snapshots extensivos de markup, de menor valor para logica temporal.

6. Estrategia de carga progresiva de imagen con fallback visual.
   Rationale: evita parpadeo o espacios vacios al cargar imagenes remotas y mejora la experiencia en telefonos con red variable.
   Alternativas: mostrar fondo vacio o spinner solamente, con peor continuidad visual para un banner de alto impacto.

7. Estandar de organizacion de assets de banner en carpeta dedicada.
   Rationale: centraliza mantenimiento de imagenes de carrusel y evita rutas dispersas.
   Alternativas: ubicar assets en rutas generales de `public/`, con menor claridad para ownership del componente.

## Risks / Trade-offs

- [Riesgo] Fugas de intervalos por montajes/desmontajes o dependencias incorrectas. -> Mitigacion: cleanup estricto en `useEffect` y pruebas con fake timers.
- [Riesgo] Conflictos entre input manual y tick automatico. -> Mitigacion: reiniciar/reprogramar ciclo tras navegacion manual.
- [Riesgo] Variaciones UX por diferencias de hover en touch devices. -> Mitigacion: hover solo afecta puntero; focus cubre teclado/accesibilidad.
- [Riesgo] Que el layout se vea correcto en desktop pero se degrade en telefonos. -> Mitigacion: validacion phone-first y casos de prueba dedicados para anchos de smartphone.
- [Riesgo] Cambio brusco entre imagen por defecto y real al completar carga. -> Mitigacion: mantener mismo contenedor/aspect ratio y transicion visual suave sin reflow.

## Migration Plan

1. Ajustar `src/components/Carousel.tsx` para autoplay 6s con pausa/reanudacion.
2. Revisar integracion en `pages/index.tsx` sin romper props actuales.
3. Definir e integrar imagen por defecto del banner mientras carga la imagen principal.
4. Crear carpeta dedicada `public/images/banners/` y ubicar ahi la imagen por defecto del banner.
5. Agregar/actualizar tests de componente/UI para reglas de autoplay, responsive en movil/tablet/desktop y fallback de carga.
6. Ejecutar suite de tests existente y verificar render manual en navegador.
7. Rollback: revertir cambios del componente y tests si aparecen regresiones.

## Open Questions

- ¿Se requiere una prop opcional para sobrescribir el intervalo en futuros usos del carrusel (default 6000 ms)?
- ¿Debemos exponer una configuracion para deshabilitar autoplay por seccion en home, o mantenerlo fijo para esta iteracion?
