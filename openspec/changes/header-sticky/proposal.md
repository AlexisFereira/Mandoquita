## Why

La navegación principal pierde visibilidad al desplazarse en páginas largas, lo que aumenta fricción para volver a secciones clave del catálogo. Un header sticky siempre visible mejora orientación continua en mobile, tablet y desktop para un catálogo estrictamente visual.

## What Changes

- Implementar comportamiento sticky permanente del header principal para mantenerlo siempre visible y pegado al borde superior de la pantalla.
- Definir estilo visual único del header sticky (fondo, sombra, altura y z-index) para mantener legibilidad estable.
- Ajustar interacción responsive en mobile/tablet/desktop sin solapamientos con contenido.
- Hacer que el header ocupe todo el ancho de pantalla (sin card) con un contenedor interno centrado y ancho máximo de 1400px.
- Eliminar links de navegación relacionados con carrito o compra.
- Garantizar accesibilidad y navegación por teclado en estado sticky.
- Validar que no se implementan capacidades fuera de alcance (cart, autenticación, pagos).

## Capabilities

### New Capabilities

- `sticky-header-navigation`: Header persistente durante scroll con comportamiento responsive y accesible.

### Modified Capabilities

- Ninguna.

## Impact

- Frontend: ajustes en `src/components/Header.tsx` y estilos globales relacionados al layout superior full-width.
- UI behavior: posible ajuste de espaciado superior en `pages/index.tsx` y páginas de detalle para evitar solapamiento.
- Calidad: nuevos tests de UI para sticky permanente, responsive, navegación sin links de compra y layout con contenedor máximo 1400px.
- No hay impacto en API ni base de datos.
- No-goals explícitos: no se implementan carrito, autenticación ni pagos.
