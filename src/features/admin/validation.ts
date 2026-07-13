import type { AdminEditorValues, AdminFieldErrors, AdminProduct } from "./types";

export function productToEditorValues(product: AdminProduct): AdminEditorValues {
  return {
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
    brand: product.brand ?? "",
    collection: product.collection ?? "",
    genderApplicability: product.genderApplicability ?? "",
    price: product.price,
    currency: product.currency,
    commerciallyAvailable: product.commerciallyAvailable,
    active: product.active,
    editorialApproved: product.editorialApproved,
    published: product.published,
    featured: product.featured,
    featuredOrder: product.featuredOrder?.toString() ?? "",
    productTypeId: product.productType?.name ?? "",
    seoTitle: product.seoTitle ?? "",
    seoDescription: product.seoDescription ?? "",
  };
}

export function validateAdminProduct(values: AdminEditorValues, hasVariant: boolean): AdminFieldErrors {
  const errors: AdminFieldErrors = {};
  const required = values.name.trim();
  if (!required) errors.name = "Ingresa el nombre del producto.";
  else if (required.length > 200) errors.name = "Usa máximo 200 caracteres.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug.trim()) || values.slug.trim().length > 160) {
    errors.slug = "Usa letras minúsculas, números y guiones simples.";
  }
  const maximums: Array<[keyof AdminEditorValues, number]> = [
    ["shortDescription", 500], ["description", 5000], ["brand", 160],
    ["collection", 160], ["seoTitle", 200], ["seoDescription", 500],
  ];
  maximums.forEach(([field, maximum]) => {
    if (String(values[field]).trim().length > maximum) errors[field] = `Usa máximo ${maximum.toLocaleString("es-CO")} caracteres.`;
  });
  if (!/^(?:0|[1-9]\d{0,7})\.\d{2}$/.test(values.price.trim()) || Number(values.price) <= 0) {
    errors.price = "Ingresa un precio válido con dos decimales.";
  }
  if (!/^[A-Z]{3}$/.test(values.currency.trim())) errors.currency = "Ingresa una moneda de tres letras.";
  if (values.featuredOrder && (!/^\d+$/.test(values.featuredOrder) || Number(values.featuredOrder) < 1)) {
    errors.featuredOrder = "Ingresa un número entero positivo.";
  }
  if (values.published) {
    if (!values.editorialApproved) errors.published = "Para publicar, activa la aprobación editorial.";
    else if (!values.productTypeId) errors.productTypeId = "Para publicar, selecciona un tipo de producto.";
    else if (!hasVariant) errors.published = "Este producto necesita al menos una variante para publicarse.";
  }
  return errors;
}

export function changedEditorValues(baseline: AdminEditorValues, values: AdminEditorValues) {
  return Object.fromEntries(
    (Object.keys(values) as Array<keyof AdminEditorValues>)
      .filter((key) => values[key] !== baseline[key])
      .map((key) => [key, values[key]]),
  ) as Partial<AdminEditorValues>;
}
