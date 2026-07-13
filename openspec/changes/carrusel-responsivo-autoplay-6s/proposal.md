## Why

El carrusel de la home hoy no define una politica clara de autoplay ni una experiencia consistente entre mobile y desktop. Necesitamos una rotacion automatica cada 6 segundos para mejorar descubrimiento de contenido destacado sin sacrificar accesibilidad y control del usuario.

## What Changes

- Estandarizar el comportamiento del carrusel principal para que avance automaticamente cada 6 segundos.
- Mantener soporte responsive con adaptacion correcta de layout e imagenes en movil, tablet y desktop.
- Pausar autoplay en hover y focus para reducir friccion en lectura e interaccion.
- Mantener navegacion manual por controles/indicadores sin romper autoplay al retomar.
- Definir fallback seguro cuando hay una sola slide o cuando autoplay no aplica.

## Capabilities

### New Capabilities

- `homepage-carousel-autoplay`: Comportamiento responsive del carrusel con autoplay de 6 segundos, controles manuales y reglas de pausa/reanudacion en tres tamanos (movil, tablet y desktop), con prioridad de experiencia en telefonos.

### Modified Capabilities

- Ninguna.

## Impact

- Frontend: ajustes en `src/components/Carousel.tsx` y pagina principal que consume el componente.
- Calidad: nuevos tests de UI/componente para autoplay, pausa en hover/focus y continuidad responsive en movil, tablet y desktop, validando calidad visual en telefonos.
- No hay cambios de base de datos ni de API.
- No-goals explicitos: no se implementan carrito, autenticacion ni pagos.
