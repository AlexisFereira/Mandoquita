import { useState } from "react";
import { adminApi, AdminApiError } from "../../api";

export type TaxonomyKind = "category" | "subcategory" | "productType";

type MutationInput =
  | {
    kind: "category";
    body: {
      slug: string;
      name: string;
      description?: string | null;
    };
  }
  | {
    kind: "subcategory";
    body: {
      name: string;
      slug: string;
      categoryId: string;
      sourceOrder: number;
    };
  }
  | {
    kind: "productType";
    body: {
      name: string;
      subcategoryId: string;
      active?: boolean;
    };
  };

export function useTaxonomyMutations(csrfToken: string) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (input: MutationInput) => {
    setBusy(true);
    setError(null);
    try {
      switch (input.kind) {
        case "category":
          return await adminApi.createCategory(csrfToken, input.body);
        case "subcategory":
          return await adminApi.createSubcategory(csrfToken, input.body);
        case "productType":
          return await adminApi.createProductType(csrfToken, input.body);
      }
    } catch (cause) {
      const message =
        cause instanceof AdminApiError
          ? `${cause.status}: ${cause.message ?? "sin detalle"}`
          : "Error inesperado al guardar.";
      setError(message);
      throw cause;
    } finally {
      setBusy(false);
    }
  };

  const archive = async (kind: TaxonomyKind, id: string, expectedUpdatedAt: string, callBack: () => void) => {
    setBusy(true);
    setError(null);
    try {
      switch (kind) {
        case "category":
          return await adminApi.categoryLifecycle(
            id,
            "retire",
            csrfToken,
            expectedUpdatedAt,
          );
        case "subcategory":
          return await adminApi.removeSubcategory(id, csrfToken, {
            expectedUpdatedAt,
          });
        case "productType":
          const resp = await adminApi.removeProductType(id, csrfToken, {
            expectedUpdatedAt,
          });
          console.log({ resp })
          callBack();
          return resp;
      }
    } catch (cause) {
      const message =
        cause instanceof AdminApiError
          ? `${cause.status}: ${cause.message ?? "sin detalle"}`
          : "Error inesperado al archivar.";
      setError(message);
      throw cause;
    } finally {
      setBusy(false);
    }
  };

  return { create, archive, busy, error };
}
