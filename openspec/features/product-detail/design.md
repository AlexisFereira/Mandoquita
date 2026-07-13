# Feature Summary

Status: Approved

Finalized: 2026-07-12

## Business Problem

La capacidad de detalle de producto requiere reglas de negocio mas estrictas para evitar interpretaciones divergentes sobre publicacion, disponibilidad comercial, manejo de media faltante y resultados de relacionados.

## Business Goal

Establecer un contrato de comportamiento de negocio deterministico para la consulta de detalle de producto, separando claramente dimensiones de ciclo de vida y asegurando resultados validos sin depender de decisiones de presentacion.

## Actors

- Visitante
- Operacion Comercial
- Negocio Ecommerce

## User Stories

- As a visitante
  I want ver informacion esencial y vigente del producto
  So that puedo evaluar una posible compra con confianza.

- As a visitante
  I want recibir un estado claro cuando el producto no esta disponible
  So that evito confusion y friccion en la navegacion.

- As a operacion comercial
  I want asegurar que el detalle aplique reglas separadas de publicacion y disponibilidad comercial
  So that se mantenga la calidad del catalogo visible.

## Functional Requirements

- FR-001: Resolver detalle de producto unicamente por Identificador Publico valido.
- FR-002: Presentar atributos esenciales definidos por negocio para el detalle: nombre comercial, descripcion comercial, precio vigente, moneda y categoria primaria.
- FR-003: Exponer referencia a media principal cuando exista, sin invalidar la entidad de negocio por ausencia de media.
- FR-004: Determinar elegibilidad de consulta del detalle en funcion del Estado de Publicacion.
- FR-005: Proveer estado de negocio No Disponible para identificadores inexistentes o para productos no Publicados.
- FR-006: Mantener trazabilidad entre entidad de catalogo y detalle para una navegacion no ambigua.
- FR-007: Proveer coleccion de relacionados elegibles por afinidad de categoria primaria.
- FR-008: Excluir siempre del conjunto de relacionados al producto actual.
- FR-009: Permitir coleccion vacia de relacionados como resultado valido de negocio.
- FR-010: Evaluar separadamente Estado Editorial, Estado de Publicacion y Disponibilidad Comercial sin construir cadenas lineales entre dimensiones.
- FR-011: Cuando una necesidad dependa de la capa visual, definir unicamente el resultado de negocio esperado y delegar presentacion al Design System.

## Non-functional Requirements

- Performance: La capacidad debe soportar consulta concurrente sin degradacion significativa en tiempos de respuesta percibidos.
- Accessibility: El contenido de detalle y estados de negocio debe ser interpretable por tecnologias de asistencia.
- Localization: Moneda y textos deben admitir adaptacion regional manteniendo el mismo significado de negocio.
- SEO: El contenido principal del detalle debe poder ser descubierto e indexado de forma estable.
- Reliability: Misma entrada de negocio debe producir mismo resultado de negocio.
- Security: No divulgar metadatos internos ni estados tecnicos en respuestas de no disponibilidad.
- Privacy: No requerir datos personales para acceder al detalle.
- Maintainability: Reglas deben estar documentadas con identificadores FR/BR y criterios asociados.
- Scalability: La logica de relacionados debe permanecer estable con crecimiento de productos por categoria.
- Availability: La capacidad debe alinearse al nivel de servicio del catalogo de descubrimiento.

## Business Rules

- BR-001: La existencia o ausencia de media de presentacion no determina validez de una entidad producto.
- BR-002: La visibilidad del detalle depende exclusivamente del Estado de Publicacion.
- BR-003: El precio mostrado depende de la dimension de Disponibilidad Comercial vigente al momento de consulta.
- BR-004: Estado Editorial, Estado de Publicacion y Disponibilidad Comercial son dimensiones independientes.
- BR-005: Ninguna regla debe mezclar dimensiones en una unica secuencia lineal de estados.
- BR-006: Categoria Primaria es unica por producto para determinar afinidad de relacionados.
- BR-007: Relacionados elegibles deben compartir Categoria Primaria y cumplir criterios de Publicacion.
- BR-008: El producto consultado no puede aparecer en su propia coleccion de relacionados.
- BR-009: Una coleccion vacia de relacionados es resultado valido y no introduce estado adicional de producto.
- BR-010: Las decisiones de representacion visual de informacion faltante pertenecen al Design System.

## Acceptance Criteria

```gherkin
Scenario: Detalle disponible para producto publicado
  Given un producto Publicado con Identificador Publico valido
  When la persona visitante consulta su detalle
  Then el sistema entrega los atributos esenciales definidos por negocio
  And el estado del detalle es Disponible
```

```gherkin
Scenario: Detalle no disponible por identificador inexistente
  Given un Identificador Publico sin correspondencia en catalogo
  When la persona visitante consulta el detalle
  Then el sistema retorna Estado No Disponible
  And la respuesta no expone informacion interna
```

```gherkin
Scenario: Detalle no disponible por producto no publicado
  Given un producto existente con Identificador Publico valido y Estado de Publicacion distinto de Publicado
  When la persona visitante consulta el detalle
  Then el sistema retorna Estado No Disponible
```

```gherkin
Scenario: Relacionados elegibles por categoria primaria
  Given un producto Publicado con Categoria Primaria definida
  And existen productos Publicados adicionales en la misma Categoria Primaria
  When la persona visitante consulta el detalle
  Then el sistema entrega relacionados elegibles de esa Categoria Primaria
  And excluye el producto consultado
```

```gherkin
Scenario: Detalle disponible con coleccion de relacionados vacia
  Given un producto Publicado sin relacionados elegibles
  When la persona visitante consulta el detalle
  Then el sistema mantiene disponible el detalle del producto
  And el sistema retorna la coleccion de relacionados vacia
```

```gherkin
Scenario: Producto publicado sin media principal
  Given un producto Publicado con Identificador Publico valido sin media principal disponible
  When la persona visitante consulta el detalle
  Then el sistema mantiene el detalle como Disponible
  And no invalida la entidad producto por ausencia de media
```

## Edge Cases

- Producto Publicado con categoria primaria ausente en origen: detalle disponible y coleccion de relacionados vacia.
- Precio no vigente por actualizacion simultanea: debe prevalecer siempre el ultimo precio vigente.
- Identificador con caracteres validos pero referencia obsoleta: resultado No Disponible uniforme.
- Producto que cambia de Publicado a no Publicado entre navegacion y consulta: resultado No Disponible.
- Categoria con cardinalidad minima: un solo producto Publicado, con relacionados vacios.
- Ausencia de media principal: no debe bloquear el detalle.

## Dependencies

- Depends On: Gobernanza de Estado Editorial, Estado de Publicacion y Disponibilidad Comercial.
- Depends On: Definicion de Categoria Primaria en dominio de productos.
- Depends On: Catalogo de productos de descubrimiento.
- Blocks: No bloquea funcionalidades transaccionales fuera de alcance.
- Related Features: Listado de catalogo, busqueda, recomendaciones basicas.
- Potential Conflicts: Criterios futuros de ranking o personalizacion pueden competir con afinidad por categoria.

## Open Questions

- El negocio requiere limite maximo de relacionados por categoria para evitar saturacion?
- Se debe priorizar novedad, disponibilidad comercial o afinidad pura al ordenar relacionados?
- Se define una politica temporal para transiciones de Estado de Publicacion durante picos de trafico?

## Glossary

- Estado Editorial: dimension que representa validacion de contenido comercial y calidad editorial.
- Estado de Publicacion: dimension que determina visibilidad del producto para visitantes.
- Disponibilidad Comercial: dimension que representa vigencia comercial de oferta y precio.
- Producto Publicado: producto visible para visitantes segun Estado de Publicacion.
- Identificador Publico: referencia estable para localizar un producto.
- Categoria Primaria: clasificacion principal unica de un producto.
- Estado Disponible: resultado de negocio para detalle publicable.
- Estado No Disponible: resultado de negocio para detalle inexistente o no publicable.
- Relacionados Elegibles: productos publicados de la misma categoria primaria, excluyendo el actual.

## Deliverables

- proposal.md
- design.md
- tasks.md

## Category Taxonomy V1 UX Synchronization

Under Category Taxonomy V1, `Categoria Primaria` corresponds to the Product's
single inherited Category. Product Detail preserves the same official hierarchy
language used by discovery:

- Category and eligible Subcategory provide understandable navigation context.
- Product Type is presented as non-interactive leaf-classification context.
- The hierarchy is ordered Category → Subcategory → Product Type and never
  represented as three competing navigation systems.
- A taxonomy destination is interactive only while it remains eligible for
  public discovery.
- Invalid or unavailable hierarchy destinations recover through the approved
  general Category discovery experience.

These UX rules do not change Product publication, commercial availability,
related-Product eligibility, or the existing unavailable-Product outcome.

## Product Content and Variants V1 Synchronization

- Product Detail presents the ordered Product Image gallery using Primary Image,
  otherwise first ordered Image, as its initial media.
- Gallery navigation never changes Product Variant, price, taxonomy, publication
  or Commercial Availability.
- Meaningful choices appear only when two or more Active Variants are
  distinguishable through approved attributes.
- A Base Variant, inactive Variant or indistinguishable Variant collection does
  not create a visitor selector.
- Variant selection may expose approved attributes and focus an associated
  Product Image without moving keyboard focus.
- Short description, complete description and optional merchandising metadata
  preserve the approved hierarchy; SEO content is not duplicated visually.
- SKU, barcode, reference, inventory, cost, supplier, warehouse and logistics
  remain absent from the visitor experience.

The authoritative experience and presentation contracts are
`openspec/changes/product-content-variants-v1/ux-blueprint.md` and `ui-design.md`.

## Discovery and Trust Experience V1 Synchronization

- The complete `Productos relacionados` section may opt into the shared
  `ScrollEntryMotion` primitive with `distance="sm"` and no stagger.
- Individual related Product cards never animate independently.
- Product identity, gallery, Variant controls, offer, price, Commercial
  Availability, description, metadata, errors and required actions remain
  immediately visible and outside motion.
- SSR, no-script, unsupported observation, reduced motion, focus and hash-target
  outcomes always render in the final visible state.
- Governed Icons may support visible labels and metadata, but never replace
  authoritative text or introduce Product/payment meaning.
