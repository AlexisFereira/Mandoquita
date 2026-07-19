import { useEffect, useState } from "react";
import { AdminApiError, adminApi } from "../../api";
import type { AdminProduct, AdminProductType, AdminSession } from "../../types";
import { emptyProduct, type ProductFormValues } from "../types";
import {
  PRODUCT_VALIDATION_MESSAGE,
  isProductFormValid,
} from "../validation";
import { adminErrorMessage } from "../../utils/error-messages";

export type UseProductForm = {
  product: AdminProduct | null;
  setProduct: (next: AdminProduct) => void;
  types: AdminProductType[];
  values: ProductFormValues;
  status: string;
  busy: boolean;
  set: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => void;
  save: (event: React.FormEvent) => Promise<void>;
};

export function useProductForm(
  session: AdminSession,
  id: number | undefined,
  onExpired: () => void,
): UseProductForm {
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [types, setTypes] = useState<AdminProductType[]>([]);
  const [values, setValues] = useState<ProductFormValues>(emptyProduct);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(Boolean(id));

  useEffect(() => {
    void adminApi
      .productTypes()
      .then(({ items }) => setTypes(items))
      .catch(() => null);

    if (!id) return;

    setBusy(true);
    adminApi
      .product(id)
      .then(({ item }) => {
        setProduct(item);
        setValues({
          name: item.name,
          slug: item.slug,
          price: item.price,
          currency: item.currency,
          baseSku: item.baseVariant?.sku ?? "",
          shortDescription: item.shortDescription ?? "",
          description: item.description ?? "",
          brand: item.brand ?? "",
          collection: item.collection ?? "",
          genderApplicability: item.genderApplicability ?? "",
          productTypeId: item.productType?.name ?? "",
          seoTitle: item.seoTitle ?? "",
          seoDescription: item.seoDescription ?? "",
          featuredOrder:
            item.featuredOrder == null ? "" : String(item.featuredOrder),
          active: item.active,
          editorialApproved: item.editorialApproved,
          published: item.published,
          commerciallyAvailable: item.commerciallyAvailable,
          featured: item.featured,
        });
      })
      .catch((cause) => {
        if (cause instanceof AdminApiError && [401, 403].includes(cause.status))
          onExpired();
        else
          setStatus(
            adminErrorMessage(cause, "No pudimos cargar el producto."),
          );
      })
      .finally(() => setBusy(false));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => setValues((old) => ({ ...old, [key]: value }));

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!isProductFormValid(values, Boolean(id))) {
      setStatus(PRODUCT_VALIDATION_MESSAGE);
      return;
    }
    setBusy(true);
    setStatus("");
    try {
      if (id && product) {
        const { baseSku: _baseSku, ...changes } = values;
        const changesCleaned: Partial<typeof changes> = { ...changes };
        if (!changes.featured) {
          changesCleaned.featuredOrder = "";
        }
        if (
          changes.featured &&
          (changes.featuredOrder == null || changes.featuredOrder === "")
        ) {
          delete changesCleaned.featuredOrder;
        }
        const result = await adminApi.updateProduct(
          id,
          session.csrfToken,
          product.updatedAt,
          changes,
        );
        setProduct(result.item);
        setStatus("Cambios guardados.");
      } else {
        const result = await adminApi.createProduct(session.csrfToken, {
          name: values.name.trim(),
          slug: values.slug.trim(),
          price: values.price,
          currency: "USD",
          baseSku: values.baseSku.trim(),
          productTypeId: values.productTypeId.trim() || null,
        });
        setProduct(result.item);
        setStatus("Producto creado.");
      }
    } catch (cause) {
      if (cause instanceof AdminApiError && [401, 403].includes(cause.status))
        onExpired();
      else setStatus(adminErrorMessage(cause, "No se guardó el producto."));
    } finally {
      setBusy(false);
    }
  }

  return {
    product,
    setProduct,
    types,
    values,
    status,
    busy,
    set,
    save,
  };
}
