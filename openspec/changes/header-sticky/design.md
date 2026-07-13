## Context

El proyecto ya tiene un `Header` reusable en una experiencia ecommerce con foco responsive. Actualmente la navegación superior no permanece fija durante el scroll y mantiene señales de compra que no aplican a un catálogo visual.

El cambio se limita a frontend (Next.js + React) y debe mantener consistencia visual entre mobile, tablet y desktop, sin introducir deuda de layout ni regressions de accesibilidad.

## Goals / Non-Goals

**Goals:**

- Hacer el header sticky durante scroll con transición visual clara.
- Hacer el header sticky permanente, siempre visible y pegado al borde superior.
- Definir estado sticky robusto y estable (fondo, sombra, z-index, altura) para contraste adecuado.
- Garantizar comportamiento responsive en mobile/tablet/desktop.
- Preservar accesibilidad de navegación y foco en estado sticky.
- Evitar que el contenido quede tapado por la altura del header sticky.
- Renderizar header full-width sin card, con contenido interno centrado y ancho máximo de 1400px.
- Eliminar enlaces de carrito/compra y mantener navegación coherente con catálogo visual sin pagos/autenticación.

**Non-Goals:**

- No rediseñar identidad de marca (logo tipografía) fuera de ajustes necesarios para sticky.
- No agregar funcionalidades de carrito, autenticación o pagos.
- No introducir cambios de API, base de datos o rutas backend.

## Decisions

1. Sticky permanente con CSS `position: sticky` en top 0.
   Rationale: mantiene visibilidad continua con bajo costo de implementación y sin listeners complejos de umbral.
   Alternativas: `position: fixed` constante, que requiere más compensaciones manuales de layout.

2. Estado visual sticky único y estable (sin cambio por umbral).
   Rationale: simplifica comportamiento esperado y evita saltos visuales entre estados.
   Alternativas: estados por threshold, mayor complejidad y ambigüedad UX.

3. Header full-width edge-to-edge con contenedor interno `max-width: 1400px` centrado.
   Rationale: combina presencia visual de barra completa con legibilidad y orden del contenido.
   Alternativas: header encerrado en card, no cumple objetivo de barra superior continua.

4. Tokens/variables para altura y elevación del header.
   Rationale: centraliza ajustes responsive y evita hardcodes dispersos.
   Alternativas: estilos inline por breakpoint, más difícil de mantener.

5. Eliminar enlaces de compra (cart/checkout/buy) del header para consistencia de catálogo visual.
   Rationale: alinea navegación con no-goals del producto (sin pagos ni autenticación).
   Alternativas: mantener links deshabilitados, confuso para usuario final.

6. Validación responsive explícita (mobile/tablet/desktop) y verificación de overflow/solapamiento.
   Rationale: asegura que sticky no rompa layout en puntos intermedios.
   Alternativas: validar solo mobile+desktop, insuficiente para continuidad visual.

## Risks / Trade-offs

- [Riesgo] Solapamiento del contenido inicial por altura sticky. -> Mitigación: aplicar offset/padding superior ligado a altura real del header.
- [Riesgo] Header sticky con contraste insuficiente sobre fondos variables. -> Mitigación: fondo sólido y sombra consistente siempre activas.
- [Riesgo] Jank visual en cambios de estado de scroll. -> Mitigación: transición corta y propiedades de costo bajo (color, shadow).
- [Riesgo] Diferencias entre viewport mobile y desktop en hit areas. -> Mitigación: validar tamaños táctiles y foco por breakpoint.
- [Riesgo] Desalineación en pantallas grandes si no se respeta tope de ancho. -> Mitigación: contenedor interno único con `max-width: 1400px` y márgenes automáticos.

## Migration Plan

1. Actualizar `src/components/Header.tsx` para sticky permanente (`top: 0`) y navegación sin enlaces de compra.
2. Añadir reglas de estilo sticky full-width en `styles/globals.css` o tokens del design system.
3. Definir contenedor interno del header con `max-width: 1400px` y centrado horizontal.
4. Ajustar contenedor principal de páginas para evitar oclusión por header sticky.
5. Agregar tests de UI/componente para sticky permanente, responsive y accesibilidad básica.
6. Ejecutar suite completa y validar navegación manual en browser para mobile/tablet/desktop.
7. Rollback: revertir cambios de header y estilos sticky si aparecen regresiones visuales severas.

## Open Questions

- ¿En mobile el header sticky debe reducir altura (compact mode) o mantener tamaño original?
