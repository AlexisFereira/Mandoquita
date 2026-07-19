/**
 * Constantes de validación para ProductForm.
 * Centralizadas para reusar y testear.
 */

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const CURRENCY_PATTERN = /^[A-Z]{3}$/;

/**
 * Mensaje de error unificado para validación inicial del formulario.
 * Se muestra en el Notice superior.
 */
export const PRODUCT_VALIDATION_MESSAGE =
  "Revisa nombre, slug, precio, moneda y SKU base.";

/**
 * Valida los campos requeridos del formulario.
 * Retorna true si pasa todas las validaciones.
 */
export function isProductFormValid(values: {
  name: string;
  slug: string;
  price: string;
  currency: string;
  baseSku?: string;
}, isEditing: boolean): boolean {
  if (!values.name.trim()) return false;
  if (!SLUG_PATTERN.test(values.slug)) return false;
  if (Number(values.price) <= 0) return false;
  if (!CURRENCY_PATTERN.test(values.currency)) return false;
  if (!isEditing && !values.baseSku?.trim()) return false;
  return true;
}
