# Feature Summary

Status: Approved

Finalized: 2026-07-12

> **Active additive capability (2026-07-14):** Product Detail Contact and Sharing
> V1 adds complete released-gallery consumption, WhatsApp inquiry and canonical
> Share behavior without changing this Product Detail lifecycle contract. See
> `contact-sharing-v1.md`. Frontend and Accessibility evidence is complete;
> independent QA/Release evidence remains pending.

## Business Problem

Las personas interesadas en un producto no cuentan con una experiencia de detalle estandarizada y confiable para validar informacion clave antes de decidir. Esto provoca abandono, comparaciones incompletas y menor conversion en la fase de descubrimiento.

## Business Goal

Definir una capacidad de detalle de producto que entregue informacion suficiente, consistente y verificable para apoyar decisiones de compra informadas durante la etapa de descubrimiento.

## Actors

- Visitante: persona que navega el catalogo sin autenticacion.
- Operacion Comercial: equipo que mantiene la calidad y disponibilidad del catalogo.
- Negocio Ecommerce: responsable de conversion, confianza y cumplimiento de alcance.

## User Stories

- As a visitante
  I want consultar el detalle completo de un producto
  So that puedo decidir si ese producto satisface mi necesidad.

- As a visitante
  I want recibir una respuesta clara cuando un producto no existe o no esta disponible
  So that no pierdo tiempo intentando acceder a informacion invalida.

- As a operacion comercial
  I want que el detalle solo muestre productos publicados y consistentes
  So that la informacion publicada mantenga confianza y calidad.

## Functional Requirements

- FR-001: El sistema debe permitir consultar un detalle de producto mediante un identificador publico valido del catalogo.
- FR-002: El sistema debe mostrar en el detalle la informacion esencial del producto definida por negocio: nombre comercial, descripcion comercial, precio vigente, moneda y categoria primaria.
- FR-003: El sistema debe exponer la referencia a media principal del producto cuando exista, sin invalidar la entidad de negocio cuando la media no este disponible.
- FR-004: El sistema debe informar estado no disponible cuando el identificador no corresponda a un producto existente o publicado.
- FR-005: El sistema debe permitir navegar desde una entidad de catalogo hacia su detalle correspondiente sin ambiguedad.
- FR-006: El sistema debe entregar una coleccion de productos relacionados basada en la misma categoria primaria, excluyendo el producto actual.
- FR-007: El sistema debe permitir que la coleccion de relacionados sea vacia como resultado valido de negocio.
- FR-008: El sistema debe aplicar separadamente las dimensiones de ciclo de vida Editorial, Publicacion y Disponibilidad Comercial para resolver si el producto puede mostrarse en detalle.

## Non-functional Requirements

- Performance: El detalle debe estar disponible dentro de un tiempo percibido como inmediato por la persona usuaria en condiciones normales de red.
- Accessibility: La capacidad debe ser operable por teclado, entendible por tecnologias de asistencia y mantener semantica de contenido.
- Localization: Textos y moneda deben poder adaptarse a locale configurado sin redefinir reglas de negocio.
- SEO: El detalle debe ser indexable con contenido canonico y metadatos consistentes del producto.
- Reliability: La consulta de detalle debe mantener comportamiento deterministico ante entradas validas e invalidas.
- Security: No debe exponerse informacion interna o sensible al resolver detalle de producto.
- Privacy: No se requiere identificacion personal para consultar detalle; no debe forzarse captura de datos personales.
- Maintainability: Reglas y definiciones del detalle deben mantenerse centralizadas y trazables a requerimientos.
- Scalability: La capacidad debe sostener crecimiento del catalogo sin degradar la experiencia de consulta.
- Availability: El acceso al detalle debe estar disponible de forma continua acorde al nivel de servicio del catalogo.

## Business Rules

- BR-001: La publicacion de un producto en detalle depende de su Estado de Publicacion y no de la existencia de activos de presentacion.
- BR-002: Si el producto no existe o no esta Publicado, el resultado debe ser No Disponible para la persona usuaria.
- BR-003: El precio mostrado en detalle debe corresponder al precio vigente segun su Disponibilidad Comercial al momento de la consulta.
- BR-004: La categoria primaria del producto debe ser unica y consistente para determinar relacionados.
- BR-005: Los productos relacionados deben pertenecer a la misma categoria primaria y cumplir criterios de Publicacion definidos por negocio.
- BR-006: El producto actual nunca debe aparecer en su propia coleccion de relacionados.
- BR-007: Una coleccion vacia de relacionados es un resultado valido y no crea un nuevo estado de negocio del producto.
- BR-008: Las dimensiones Editorial, Publicacion y Disponibilidad Comercial deben evaluarse de forma separada y no como una cadena lineal unica.
- BR-009: La ausencia de media principal no invalida la entidad producto ni su elegibilidad de negocio en detalle.
- BR-010: Cualquier necesidad de representacion visual de datos faltantes queda delegada a la capa de presentacion.

## Acceptance Criteria

```gherkin
Scenario: Consulta de detalle con identificador valido y producto publicado
	Given existe un producto Publicado con identificador publico valido
	When la persona visitante solicita el detalle de ese identificador
	Then el sistema entrega nombre comercial, descripcion comercial, precio vigente, moneda y categoria primaria
	And el detalle se presenta como disponible
```

```gherkin
Scenario: Consulta de detalle con identificador inexistente
	Given no existe un producto para el identificador solicitado
	When la persona visitante solicita el detalle
	Then el sistema responde estado No Disponible
	And no expone datos internos del catalogo
```

```gherkin
Scenario: Consulta de detalle con producto no publicable
	Given existe un producto con identificador valido pero no Publicado
	When la persona visitante solicita el detalle
	Then el sistema responde estado No Disponible
```

```gherkin
Scenario: Relacionados por categoria primaria
	Given existe un producto Publicado con categoria primaria definida
	And existen otros productos Publicados en la misma categoria primaria
	When la persona visitante consulta el detalle
	Then el sistema muestra productos relacionados de la misma categoria primaria
	And excluye el producto actual de la lista
```

```gherkin
Scenario: Coleccion vacia de relacionados
	Given existe un producto Publicado con categoria primaria definida
	And no existen otros productos Publicados elegibles en esa categoria primaria
	When la persona visitante consulta el detalle
	Then el sistema muestra el detalle principal del producto
	And el sistema retorna una coleccion de relacionados vacia
```

```gherkin
Scenario: Producto publicado sin media principal
	Given existe un producto Publicado con identificador publico valido y sin media principal disponible
	When la persona visitante solicita el detalle
	Then el sistema responde el detalle del producto como disponible
	And no invalida la entidad producto por ausencia de media
```

## Edge Cases

- Coleccion vacia de relacionados para una categoria con un solo producto elegible.
- Identificador con formato valido pero asociado a producto no Publicado.
- Producto publicado sin media principal; la consulta de detalle se mantiene disponible.
- Cambios de precio entre consultas consecutivas; debe prevalecer siempre el precio vigente.
- Categoria primaria faltante o inconsistente en origen de datos; el detalle se mantiene y relacionados retorna coleccion vacia.
- Intentos repetidos sobre identificadores inexistentes; el comportamiento debe ser estable y uniforme.

## Dependencies

- Depends On: Capacidad de catalogo de productos publicables.
- Depends On: Category Taxonomy V1; la Categoria Primaria se hereda del unico Product Type aprobado del Producto.
- Depends On: Definicion de Estado Editorial, Estado de Publicacion y Disponibilidad Comercial.
- Blocks: No bloquea checkout ni autenticacion por estar fuera de alcance.
- Related Features: Descubrimiento de catalogo, busqueda, recomendaciones basicas por categoria.
- Potential Conflicts: Reglas futuras de personalizacion o ranking avanzado pueden alterar criterios de relacionados.

## Open Questions

- Cual es la prioridad de negocio entre relacion por categoria primaria y reglas editoriales manuales?
- Se requiere politica de desempate cuando existan muchos relacionados elegibles?
- Debe existir una politica temporal para productos recientemente no Publicados pero aun indexados?

## Glossary

- Estado Editorial: dimension que representa validacion de contenido comercial y calidad editorial.
- Estado de Publicacion: dimension que determina si el producto puede ser visible para visitantes.
- Disponibilidad Comercial: dimension que representa vigencia comercial de oferta y precio.
- Producto Publicado: producto visible para personas visitantes segun Estado de Publicacion.
- Identificador Publico: clave estable usada para consultar un producto en contexto de navegacion.
- Categoria Primaria: Category unica heredada del Product Type aprobado del Producto; se usa para navegacion y afinidad.
- Subcategoria: clasificacion intermedia unica heredada del Product Type aprobado.
- Product Type: clasificacion hoja unica y autoritativa del Producto dentro de Category Taxonomy V1.
- Producto Relacionado: producto alternativo o complementario elegible bajo reglas de categoria primaria.
- Estado No Disponible: resultado de negocio para productos inexistentes o no publicables.

## Deliverables

- proposal.md
- design.md
- tasks.md

## Category Taxonomy V1 Synchronization

Category Taxonomy V1 reemplaza cualquier interpretacion plana o independiente de Categoria Primaria. Cada Producto publicamente descubrible tiene un unico Product Type aprobado y hereda de este exactamente una Subcategoria y una Categoria Primaria.

Product Detail conserva el mismo lenguaje oficial en espanol utilizado por Homepage y Product Catalog. Product Type es contexto de clasificacion y no crea por si solo un destino publico. Esta sincronizacion no modifica Estado Editorial, Estado de Publicacion, Disponibilidad Comercial ni las reglas de Productos Relacionados.
