import { useEffect, useState } from "react";
import { adminApi, AdminApiError } from "../../api";
import type {
  AdminCategory,
  AdminSubcategory,
  AdminProductType,
} from "../../types";

export type TaxonomyNode =
  | {
    kind: "category";
    data: AdminCategory;
    children: TaxonomyNode[];
  }
  | {
    kind: "subcategory";
    data: AdminSubcategory;
    children: TaxonomyNode[];
  }
  | {
    kind: "productType";
    data: AdminProductType;
    children: [];
  };

export function useTaxonomy() {
  const [tree, setTree] = useState<TaxonomyNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesRes, subcategoriesRes, productTypesRes] =
        await Promise.all([
          adminApi.categories("", 1, false),
          adminApi.subcategories("", 1),
          adminApi.productTypes("", 1),
        ]);

      const categories = categoriesRes.items;
      const subcategories = subcategoriesRes.items;
      const productTypes = productTypesRes.items;

      const tree = categories.map((category) => ({
        kind: "category" as const,
        data: category,
        children: subcategories
          .filter((s) => s.categoryId === category.id && s.active)
          .map((subcategory) => ({
            kind: "subcategory" as const,
            data: subcategory,
            children: productTypes
              .filter((pt) => pt.subcategoryId === subcategory.id)
              .map((pt) => ({
                kind: "productType" as const,
                data: pt,
                children: [] as [],
              })),
          })),
      }));

      setTree(tree);
    } catch (cause) {
      if (cause instanceof AdminApiError) {
        setError(`Error ${cause.status}: ${cause.message ?? "sin detalle"}`);
      } else {
        setError("No pudimos cargar la taxonomía.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { tree, loading, error, refresh };
}
