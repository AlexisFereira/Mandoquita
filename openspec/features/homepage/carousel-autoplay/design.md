Status: Approved

Finalized: 2026-07-12

> **Placement amendment (2026-07-14):** Autoplay, pause, manual controls,
> single-slide and reduced-motion behavior below remain active. The Carousel is
> now full-width and replaces the separate Hero under
> `../merchandising-layout-v2.md`.

## Overview

La homepage funciona como punto de entrada al catalogo y el carrusel es el primer elemento de descubrimiento que recibe la atencion del visitante. Esta capacidad define el comportamiento de rotacion automatica y manual del carrusel principal para que la exploracion destaque productos o contenidos relevantes sin interrumpir la lectura ni el control del usuario.

El diseño UX debe garantizar que el carrusel sea comprensible, predecible y util en movil, tablet y desktop. El cambio no altera el alcance del resto de la homepage ni introduce nuevas funcionalidades transaccionales.

## User Flow

1. La persona visitante entra a la homepage y ve el carrusel principal como contenido destacado.
2. Si hay mas de una slide, el carrusel avanza automaticamente cada 6 segundos.
3. Si la persona interactua con controles, hover o foco, la rotacion automatica se pausa.
4. Cuando la interaccion termina, la rotacion automatica se reanuda.
5. La persona puede avanzar o retroceder manualmente en cualquier momento.
6. Al seleccionar una slide o su contenido accionable, la persona navega al destino asociado.
7. Si solo existe una slide, el carrusel se comporta como contenido estatico sin rotacion.

## Information Architecture

- Homepage
  - Carrusel principal
  - Contenido destacado asociado a la slide activa
  - Controles de navegacion del carrusel
  - Indicadores de posicion

El carrusel no introduce nuevas secciones de negocio. Solo organiza la presentacion de contenido destacado ya existente dentro de la homepage.

## Navigation

- Las acciones primarias del carrusel deben llevar a la pagina de detalle o destino definido para cada slide.
- Los controles de anterior y siguiente deben permitir exploracion secuencial.
- Los indicadores deben permitir salto directo entre slides.
- La navegacion manual no debe romper la continuidad del ciclo automatico.
- La experiencia debe mantenerse usable con teclado y tecnologia de asistencia.

## Page Structure

- Contenedor principal de homepage.
- Area destacada del carrusel.
- Zona de contenido de soporte vinculada a la slide activa.
- Controles de navegacion del carrusel.
- Imagen de reemplazo mientras la media principal termina de cargar.

La estructura debe mantener una jerarquia estable de informacion para que el contenido destacado sea identificable de inmediato y no compita con otros bloques de la homepage.

## Interaction Flow

- Autoplay activo cuando existen dos o mas slides.
- Pausa temporal durante hover sobre el carrusel.
- Pausa temporal cuando el foco entra en controles o contenido interactivo del carrusel.
- Reanudacion automatica cuando la interaccion termina.
- El avance manual debe actualizar la slide activa sin dejar al usuario sin control.
- La carga de media debe preservar continuidad visual mediante una imagen de reemplazo.

## Empty States

- Si no hay slides disponibles, el carrusel no debe generar un estado de negocio adicional; la homepage debe seguir siendo util con el resto de su contenido.
- Si solo hay una slide, no debe activarse autoplay.
- Si una slide no tiene media principal disponible, la entidad sigue siendo valida y la capa de presentacion resuelve el reemplazo visual.

## Error States

- Si la carga de una imagen falla o tarda, el carrusel debe seguir mostrando contenido util sin invalidar la slide.
- Si el usuario interactua rapidamente entre controles, el carrusel debe mantener consistencia en la slide activa sin saltos inesperados.
- Si una dependencia de datos no permite renderizar mas de una slide, el comportamiento debe degradar de forma segura a contenido estatico.

## Success States

- El carrusel destaca contenido relevante sin friccion.
- El visitante puede entender rapidamente que hay mas de un contenido disponible.
- La exploracion manual y automatica coexisten sin conflicto.
- El contenido sigue siendo util cuando la media principal aun no esta disponible.

## Responsive Behavior

- En movil, el carrusel debe priorizar legibilidad, control tactil claro y composicion estable.
- En tablet, debe conservar jerarquia y permitir exploracion sin saturacion visual.
- En desktop, debe aprovechar el espacio disponible sin romper proporciones ni provocar desbordes.
- Los tres contextos deben compartir el mismo contrato de comportamiento: autoplay, pausa, reanudacion y control manual.

## Accessibility Notes

- El carrusel debe ser operable por teclado.
- La pausa por foco debe proteger la lectura y la navegacion asistida.
- Los controles deben tener significado claro para tecnologias de asistencia.
- El contenido destacado debe mantener orden semantico estable entre slides.
- Los elementos faltantes de media no deben bloquear la comprension del contenido.

## Dependencies

- Carousel reusable component
- Homepage data already available for featured content
- Design System for fallback media and interaction states
- UI/component test coverage for autoplay, pause and responsive behavior

## Open Questions

- El intervalo de 6 segundos debe ser fijo o configurable en futuros usos del carrusel?
- Debe existir una politica de prioridad entre navegacion manual reciente y reanudacion del autoplay?
