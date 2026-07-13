# Component Examples

These examples reflect the current typed APIs. Visual values continue to be consolidated; avoid copying internal class strings from component source.

## Button

```tsx
<Button variant="primary" size="sm">Primary small</Button>
<Button variant="secondary" size="md">Secondary medium</Button>
<Button variant="danger" size="lg">Danger large</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline" href="#categorias">Outline link</Button>
<Button disabled>Disabled</Button>
```

Use primary once per decision group. Danger is reserved for destructive actions. Ghost supports low-emphasis actions.

## Card

```tsx
<Card elevation="none" padding="sm">Flat compact card</Card>
<Card elevation="sm" padding="md">Standard card</Card>
<Card elevation="md" padding="lg">Elevated content</Card>
<Card as="article" interactive>Interactive composition</Card>
```

Large elevation is reserved for genuine overlays rather than ordinary content.

## Input

```tsx
<Input label="Buscar" size="sm" placeholder="Nombre del producto" />

<Input
  label="Producto"
  size="md"
  helperText="Escribe el producto que deseas consultar."
/>

<Input
  label="Correo"
  size="lg"
  invalid
  errorText="Ingresa un correo válido."
/>

<Input
  label="Referencia"
  success
  successText="Referencia encontrada."
/>
```

Labels are required. Error and success messages must describe the state without relying on color alone.

## Badge

```tsx
<Badge variant="neutral" size="sm">Audio</Badge>
<Badge variant="primary">Destacado</Badge>
<Badge variant="success">Disponible</Badge>
<Badge variant="warning">Información pendiente</Badge>
<Badge variant="danger">No disponible</Badge>
<Badge variant="info">Nuevo dato</Badge>
```

Badge communicates short metadata or status. It is not an action and must not replace a button or link.

## Composed example

```tsx
import { Badge, Button, Card, Input } from "../src/components";

export function ProductInquiry() {
  return (
    <Card as="section" elevation="none" padding="lg">
      <Badge variant="neutral">Atención personalizada</Badge>
      <h2>Consulta un producto</h2>
      <Input
        label="Producto"
        helperText="Indica qué producto te interesa."
      />
      <Button variant="primary">Solicitar información</Button>
    </Card>
  );
}
```

## Carousel gallery mode

```tsx
const media = [
  { id: "front", src: "/front.jpg", alt: "Vista frontal del producto" },
  { id: "side", src: "/side.jpg", alt: "Vista lateral del producto" },
];

<Carousel
  mode="gallery"
  items={media}
  defaultActiveItemId="front"
  aria-label="Imágenes del producto"
/>
```

Gallery mode never autoplays. Use `activeItemId` and `onActiveItemChange` when a
feature owns selection. Stable media IDs are required; array indexes are not IDs.
The gallery changes media presentation only and never resolves feature state.

## Chip option mode and polite status

```tsx
const [color, setColor] = useState("azul");

<fieldset>
  <legend>Color</legend>
  <div className="flex flex-wrap gap-2">
    <Chip mode="option" value="azul" selected={color === "azul"} onSelect={setColor}>
      Azul
    </Chip>
    <Chip
      mode="option"
      value="verde"
      selected={color === "verde"}
      unavailable
      unavailableText="Esta combinación no está disponible."
      onSelect={setColor}
    >
      Verde bosque
    </Chip>
  </div>
</fieldset>
<PoliteStatus>{`Color seleccionado: ${color}.`}</PoliteStatus>
```

The feature owns option resolution. Do not pass inactive values. `unavailable`
means that a feature-defined combination cannot resolve; it never means stock,
inventory, price, or commercial availability.
