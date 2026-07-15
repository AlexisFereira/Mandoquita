import React, { useEffect, useRef, useState } from "react";

import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { PoliteStatus } from "../../components/PoliteStatus";
import { AdminApiError, adminApi } from "./api";
import type {
  AdminCategoryMedia,
  AdminMediaUpload,
  AdminProductImage,
  AdminProductMedia,
  AdminSession,
} from "./types";

const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function mediaError(error: unknown) {
  if (!(error instanceof AdminApiError))
    return "Ocurrió un problema inesperado. El catálogo no cambió.";
  if (error.status === 409)
    return "Hay cambios más recientes. Tus cambios no se guardaron.";
  if (error.status === 413)
    return "La imagen supera el límite permitido por el servidor.";
  if (error.status === 429)
    return "Se alcanzó temporalmente el límite de cambios. Inténtalo más tarde.";
  if (error.status === 502 || error.status === 503)
    return "No pudimos procesar la imagen en este momento. El catálogo no cambió.";
  if (error.status === 400)
    return "La imagen o los datos no son válidos. El catálogo no cambió.";
  if (error.status === 404)
    return "El recurso ya no está disponible. Recarga la información.";
  return "No pudimos guardar el cambio. El catálogo no cambió.";
}

function isExpired(error: unknown) {
  return error instanceof AdminApiError && [401, 403].includes(error.status);
}

function validAltText(value: string) {
  const text = value.trim();
  return text.length >= 1 && text.length <= 240;
}

function UploadTask({
  title,
  kind,
  csrfToken,
  initialAlt = "",
  confirmLabel,
  saving,
  onConfirm,
  onCancel,
  onExpired,
}: {
  title: string;
  kind: "product" | "category";
  csrfToken: string;
  initialAlt?: string;
  confirmLabel: string;
  saving: boolean;
  onConfirm: (upload: AdminMediaUpload, altText: string) => Promise<void>;
  onCancel: () => void;
  onExpired: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState("");
  const [altText, setAltText] = useState(initialAlt);
  const [upload, setUpload] = useState<AdminMediaUpload | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    },
    [localPreview],
  );

  function choose(next: File | null) {
    if (localPreview) URL.revokeObjectURL(localPreview);
    setUpload(null);
    setError("");
    setFile(next);
    setLocalPreview(
      next && typeof URL.createObjectURL === "function"
        ? URL.createObjectURL(next)
        : "",
    );
  }

  async function startUpload() {
    if (!file || !acceptedTypes.includes(file.type)) {
      setError("Selecciona una imagen JPEG, PNG, WebP o AVIF.");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    if (!validAltText(altText)) {
      setError("Ingresa un texto alternativo de 1 a 240 caracteres.");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setUploading(true);
    setError("");
    try {
      const response = await adminApi.uploadMedia(kind, file, csrfToken);
      setUpload(response.upload);
    } catch (requestError) {
      if (isExpired(requestError)) return onExpired();
      setError(mediaError(requestError));
      requestAnimationFrame(() => summaryRef.current?.focus());
    } finally {
      setUploading(false);
    }
  }

  async function discard() {
    if (upload)
      await adminApi.cancelUpload(upload.id, csrfToken).catch(() => undefined);
    onCancel();
  }

  return (
    <Card
      as="section"
      className="mx-auto max-w-[720px] space-y-5"
      aria-labelledby="media-upload-title"
    >
      <h2 id="media-upload-title" className="ds-heading ds-heading-md">
        {title}
      </h2>
      <p className="text-sm text-[rgb(var(--muted)/1)]">
        JPEG, PNG, WebP o AVIF. Una imagen por carga. El servidor valida el
        límite permitido.
      </p>
      {error ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-md border border-[rgb(var(--danger)/0.35)] p-4"
        >
          {error}
        </div>
      ) : null}
      <div className="space-y-2">
        <label htmlFor="media-file" className="block text-sm font-medium">
          Archivo de imagen
        </label>
        <input
          id="media-file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          disabled={uploading || Boolean(upload)}
          onChange={(event) => choose(event.target.files?.[0] ?? null)}
          className="min-h-11 w-full rounded-md border border-[rgb(var(--border)/1)] p-2"
        />
      </div>
      {file || upload ? (
        <div className="space-y-2" aria-label="Vista previa de la carga">
          <div className="flex aspect-square w-full max-w-80 items-center justify-center overflow-hidden rounded-md border border-[rgb(var(--border)/1)] bg-[rgb(var(--surface-muted)/1)]">
            {localPreview || upload?.previewUrl ? (
              <img
                src={upload?.previewUrl ?? localPreview}
                alt=""
                className="h-full w-full object-contain"
              />
            ) : (
              <span>Vista previa no disponible</span>
            )}
          </div>
          <p className="text-sm [overflow-wrap:anywhere]">{file?.name}</p>
          {upload ? (
            <p className="text-xs text-[rgb(var(--muted)/1)]">
              {upload.width} × {upload.height}px ·{" "}
              {Math.ceil(upload.size / 1024)} KB
            </p>
          ) : null}
        </div>
      ) : null}
      <Input
        id="media-alt-text"
        label="Texto alternativo"
        helperText={`Describe lo importante de la imagen en el contexto del catálogo. ${altText.length}/240`}
        errorText={
          !validAltText(altText) && altText.length > 0
            ? "Usa entre 1 y 240 caracteres."
            : undefined
        }
        invalid={!validAltText(altText) && altText.length > 0}
        maxLength={241}
        value={altText}
        onChange={(event) => setAltText(event.target.value)}
        disabled={uploading || saving}
      />
      {uploading ? (
        <div className="space-y-2">
          <label htmlFor="media-progress" className="text-sm font-medium">
            Subiendo y validando imagen
          </label>
          <progress id="media-progress" className="w-full" />
          <PoliteStatus visuallyHidden={false} className="text-sm">
            La imagen todavía no forma parte del catálogo.
          </PoliteStatus>
        </div>
      ) : null}
      {upload ? (
        <div
          role="status"
          className="rounded-md border border-[rgb(var(--success)/0.35)] p-4"
        >
          <strong>Carga lista para guardar.</strong>
          <p className="text-sm">
            La imagen todavía no forma parte del catálogo.
          </p>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3">
        {!upload ? (
          <Button
            onClick={() => void startUpload()}
            disabled={!file || uploading || saving}
          >
            {uploading ? "Subiendo…" : "Subir imagen"}
          </Button>
        ) : (
          <Button
            onClick={() => void onConfirm(upload, altText.trim())}
            disabled={saving || !validAltText(altText)}
          >
            {saving ? "Guardando…" : confirmLabel}
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={() => void discard()}
          disabled={uploading || saving}
        >
          {upload ? "Descartar carga" : "Cancelar"}
        </Button>
      </div>
    </Card>
  );
}

function ProductGallery({
  productId,
  session,
  onBack,
  onExpired,
}: {
  productId: number;
  session: AdminSession;
  onBack: () => void;
  onExpired: () => void;
}) {
  const [media, setMedia] = useState<AdminProductMedia | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [task, setTask] = useState<
    | "add"
    | "reorder"
    | "primary"
    | ""
    | { type: "alt" | "replace" | "remove"; image: AdminProductImage }
  >("");
  const [order, setOrder] = useState<AdminProductImage[]>([]);
  const [primaryId, setPrimaryId] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [saving, setSaving] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const dirty = Boolean(task);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const next = await adminApi.productMedia(productId);
      setMedia(next);
      setOrder(next.images);
      setPrimaryId(next.images.find((image) => image.isPrimary)?.id ?? null);
      setTask("");
    } catch (requestError) {
      if (isExpired(requestError)) return onExpired();
      setError(mediaError(requestError));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function announce(message: string) {
    setStatus(message);
    requestAnimationFrame(() => summaryRef.current?.focus());
  }
  function handleFailure(requestError: unknown) {
    if (isExpired(requestError)) return onExpired();
    setError(mediaError(requestError));
    if (requestError instanceof AdminApiError && requestError.status === 409)
      announce("Hay cambios más recientes. Tus cambios no se guardaron.");
  }
  async function mutate(
    work: () => Promise<AdminProductMedia>,
    success: string,
  ) {
    setSaving(true);
    setError("");
    try {
      const next = await work();
      setMedia(next);
      setOrder(next.images);
      setPrimaryId(next.images.find((image) => image.isPrimary)?.id ?? null);
      setTask("");
      announce(success);
    } catch (requestError) {
      handleFailure(requestError);
    } finally {
      setSaving(false);
    }
  }
  function move(index: number, direction: -1 | 1) {
    const next = [...order];
    const target = index + direction;
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    setStatus(
      `Imagen movida a la posición ${target + 1} de ${next.length}. Orden sin guardar.`,
    );
  }

  if (loading)
    return (
      <PoliteStatus visuallyHidden={false}>Cargando galería…</PoliteStatus>
    );
  if (!media)
    return (
      <div role="alert" className="space-y-3">
        <p>{error}</p>
        <Button onClick={() => void load()}>Reintentar</Button>
      </div>
    );
  const activeImage = typeof task === "object" ? task.image : null;
  return (
    <div className="space-y-8">
      <Button
        variant="ghost"
        onClick={() => {
          if (
            !dirty ||
            window.confirm("Tienes cambios sin guardar. ¿Quieres descartarlos?")
          )
            onBack();
        }}
      >
        ← Volver a productos
      </Button>
      <div className="space-y-3">
        <span className="ds-eyebrow">Producto</span>
        <h1 className="ds-heading ds-heading-lg">{media.product.name}</h1>
        <p className="text-sm text-[rgb(var(--muted)/1)]">
          /{media.product.slug}
        </p>
      </div>
      <div ref={summaryRef} tabIndex={-1}>
        {status ? (
          <PoliteStatus
            visuallyHidden={false}
            className="rounded-md border border-[rgb(var(--border)/1)] p-4"
          >
            {status}
          </PoliteStatus>
        ) : null}
        {error ? (
          <div
            role="alert"
            className="mt-3 space-y-3 rounded-md border border-[rgb(var(--danger)/0.35)] p-4"
          >
            <p>{error}</p>
            <Button variant="secondary" onClick={() => void load()}>
              Recargar galería
            </Button>
          </div>
        ) : null}
      </div>
      <section aria-labelledby="gallery-title" className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="gallery-title" className="ds-heading ds-heading-md">
              Galería del producto
            </h2>
            <p className="text-sm text-[rgb(var(--muted)/1)]">
              {media.images.length} imágenes ·{" "}
              {media.images.some((image) => image.isPrimary)
                ? "Con imagen principal"
                : "Sin imagen principal"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setTask("add")}>Agregar imagen</Button>
            {media.images.length > 1 ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setOrder(media.images);
                  setTask("reorder");
                }}
              >
                Reordenar galería
              </Button>
            ) : null}
            {media.images.length ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setPrimaryId(
                    media.images.find((image) => image.isPrimary)?.id ?? null,
                  );
                  setTask("primary");
                }}
              >
                Cambiar imagen principal
              </Button>
            ) : null}
          </div>
        </div>
        {!media.images.length ? (
          <Card>
            <p>Este producto no tiene imágenes.</p>
          </Card>
        ) : (
          <ol className="space-y-4">
            {media.images.map((image, index) => (
              <Card
                as="li"
                key={image.id}
                className="grid gap-5 sm:grid-cols-[160px_minmax(0,1fr)] lg:grid-cols-[160px_minmax(0,1fr)_minmax(180px,auto)]"
              >
                <div className="aspect-square overflow-hidden rounded-md border border-[rgb(var(--border)/1)] bg-[rgb(var(--surface-muted)/1)]">
                  <img
                    src={image.previewUrl}
                    alt={image.altText}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <h3
                    id={`product-image-${image.id}`}
                    className="font-semibold"
                  >
                    Imagen {index + 1} de {media.images.length}
                  </h3>
                  <p className="[overflow-wrap:anywhere]">{image.altText}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={image.isPrimary ? "primary" : "neutral"}>
                      {image.isPrimary ? "Principal" : "No principal"}
                    </Badge>
                    <Badge
                      variant={
                        image.referencedByVariants ? "warning" : "neutral"
                      }
                    >
                      {image.referencedByVariants
                        ? `Usada por variantes (${image.variantReferenceCount})`
                        : "Sin referencias de variantes"}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-wrap content-start gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setAltText(image.altText);
                      setTask({ type: "alt", image });
                    }}
                  >
                    Editar texto alternativo
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setTask({ type: "replace", image })}
                  >
                    Reemplazar imagen
                  </Button>
                  {!image.referencedByVariants ? (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setTask({ type: "remove", image })}
                    >
                      Eliminar imagen
                    </Button>
                  ) : (
                    <p className="text-sm text-[rgb(var(--danger)/1)]">
                      No puedes eliminar esta imagen porque está usada por
                      variantes.
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </ol>
        )}
      </section>
      {task === "add" ? (
        <UploadTask
          title={`Agregar imagen a ${media.product.name}`}
          kind="product"
          csrfToken={session.csrfToken}
          confirmLabel="Agregar a la galería"
          saving={saving}
          onExpired={onExpired}
          onCancel={() => setTask("")}
          onConfirm={(upload, text) =>
            mutate(
              () =>
                adminApi.addProductImage(productId, session.csrfToken, {
                  expectedProductUpdatedAt: media.product.updatedAt,
                  uploadId: upload.id,
                  altText: text,
                  position: media.images.length,
                  isPrimary: false,
                }),
              "Imagen agregada a la galería",
            )
          }
        />
      ) : null}
      {task === "reorder" ? (
        <Card as="section" className="space-y-5">
          <h2 className="ds-heading ds-heading-md">Reordenar galería</h2>
          <ol className="space-y-3">
            {order.map((image, index) => (
              <li
                key={image.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[rgb(var(--border)/1)] p-3"
              >
                <span>
                  {index + 1}. {image.altText}
                </span>
                <span className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={index === 0}
                    aria-label={
                      index === 0
                        ? "Mover antes no disponible: ya es la primera imagen"
                        : `Mover antes imagen ${index + 1}`
                    }
                    onClick={() => move(index, -1)}
                  >
                    Mover antes
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={index === order.length - 1}
                    aria-label={
                      index === order.length - 1
                        ? "Mover después no disponible: ya es la última imagen"
                        : `Mover después imagen ${index + 1}`
                    }
                    onClick={() => move(index, 1)}
                  >
                    Mover después
                  </Button>
                </span>
              </li>
            ))}
          </ol>
          <div className="flex gap-3">
            <Button
              disabled={saving}
              onClick={() =>
                void mutate(
                  () =>
                    adminApi.saveProductImageOrder(
                      productId,
                      session.csrfToken,
                      {
                        expectedProductUpdatedAt: media.product.updatedAt,
                        imageIds: order.map((image) => image.id),
                        primaryImageId:
                          media.images.find((image) => image.isPrimary)?.id ??
                          null,
                      },
                    ),
                  "Orden de galería guardado",
                )
              }
            >
              Guardar orden
            </Button>
            <Button variant="secondary" onClick={() => setTask("")}>
              Cancelar reordenación
            </Button>
          </div>
        </Card>
      ) : null}
      {task === "primary" ? (
        <Card as="section" className="space-y-5">
          <fieldset className="space-y-3">
            <legend className="ds-heading ds-heading-md">
              Imagen principal
            </legend>
            <label className="flex min-h-11 items-center gap-3">
              <input
                type="radio"
                name="primary-image"
                checked={primaryId === null}
                onChange={() => setPrimaryId(null)}
              />{" "}
              Sin imagen principal
            </label>
            {media.images.map((image, index) => (
              <label
                key={image.id}
                className="flex min-h-11 items-center gap-3"
              >
                <input
                  type="radio"
                  name="primary-image"
                  checked={primaryId === image.id}
                  onChange={() => setPrimaryId(image.id)}
                />{" "}
                Imagen {index + 1}: {image.altText}
              </label>
            ))}
          </fieldset>
          <div className="flex gap-3">
            <Button
              disabled={saving}
              onClick={() =>
                void mutate(
                  () =>
                    adminApi.saveProductImageOrder(
                      productId,
                      session.csrfToken,
                      {
                        expectedProductUpdatedAt: media.product.updatedAt,
                        imageIds: media.images.map((image) => image.id),
                        primaryImageId: primaryId,
                      },
                    ),
                  primaryId
                    ? "Imagen principal actualizada"
                    : "El producto no tiene imagen principal",
                )
              }
            >
              Guardar imagen principal
            </Button>
            <Button variant="secondary" onClick={() => setTask("")}>
              Cancelar
            </Button>
          </div>
        </Card>
      ) : null}
      {typeof task === "object" && task.type === "alt" && activeImage ? (
        <Card as="section" className="max-w-[720px] space-y-5">
          <h2 className="ds-heading ds-heading-md">Editar texto alternativo</h2>
          <Input
            id="edit-media-alt"
            label="Texto alternativo"
            helperText={`${altText.length}/240 caracteres`}
            value={altText}
            maxLength={241}
            onChange={(event) => setAltText(event.target.value)}
          />
          <div className="flex gap-3">
            <Button
              disabled={
                !validAltText(altText) ||
                altText.trim() === activeImage.altText ||
                saving
              }
              onClick={() =>
                void mutate(
                  () =>
                    adminApi.updateProductImage(
                      productId,
                      activeImage.id,
                      session.csrfToken,
                      {
                        action: "metadata",
                        expectedProductUpdatedAt: media.product.updatedAt,
                        expectedImageUpdatedAt: activeImage.updatedAt,
                        altText: altText.trim(),
                      },
                    ),
                  "Texto alternativo actualizado",
                )
              }
            >
              Guardar texto alternativo
            </Button>
            <Button variant="secondary" onClick={() => setTask("")}>
              Cancelar
            </Button>
          </div>
        </Card>
      ) : null}
      {typeof task === "object" && task.type === "replace" && activeImage ? (
        <UploadTask
          title="Reemplazar imagen"
          kind="product"
          csrfToken={session.csrfToken}
          initialAlt={activeImage.altText}
          confirmLabel="Guardar reemplazo"
          saving={saving}
          onExpired={onExpired}
          onCancel={() => setTask("")}
          onConfirm={(upload, text) =>
            mutate(
              () =>
                adminApi.updateProductImage(
                  productId,
                  activeImage.id,
                  session.csrfToken,
                  {
                    action: "replace",
                    expectedProductUpdatedAt: media.product.updatedAt,
                    expectedImageUpdatedAt: activeImage.updatedAt,
                    uploadId: upload.id,
                    altText: text,
                  },
                ),
              "Imagen reemplazada",
            )
          }
        />
      ) : null}
      {typeof task === "object" && task.type === "remove" && activeImage ? (
        <Card as="section" className="max-w-[720px] space-y-4">
          <h2 className="ds-heading ds-heading-md">Eliminar imagen</h2>
          <p>
            La imagen “{activeImage.altText}” desaparecerá del catálogo y esta
            acción no ofrece deshacer.
          </p>
          {activeImage.isPrimary ? (
            <p>El producto quedará sin imagen principal.</p>
          ) : null}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setTask("")}>
              Conservar imagen
            </Button>
            <Button
              variant="danger"
              disabled={saving}
              onClick={() =>
                void mutate(
                  () =>
                    adminApi.removeProductImage(
                      productId,
                      activeImage.id,
                      session.csrfToken,
                      {
                        expectedProductUpdatedAt: media.product.updatedAt,
                        expectedImageUpdatedAt: activeImage.updatedAt,
                      },
                    ),
                  "Imagen eliminada",
                )
              }
            >
              Eliminar imagen
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function CategoryMedia({
  session,
  onExpired,
}: {
  session: AdminSession;
  onExpired: () => void;
}) {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<AdminCategoryMedia[]>([]);
  const [selected, setSelected] = useState<AdminCategoryMedia | null>(null);
  const [task, setTask] = useState<"" | "add" | "replace" | "alt" | "remove">(
    "",
  );
  const [altText, setAltText] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  async function load(q = query) {
    setLoading(true);
    setError("");
    try {
      setCategories((await adminApi.categories(q)).items);
    } catch (requestError) {
      if (isExpired(requestError)) return onExpired();
      setError(mediaError(requestError));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load("");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  async function mutate(
    work: () => Promise<{ category: AdminCategoryMedia }>,
    success: string,
  ) {
    setSaving(true);
    setError("");
    try {
      const response = await work();
      setSelected(response.category);
      setCategories((items) =>
        items.map((item) =>
          item.id === response.category.id ? response.category : item,
        ),
      );
      setTask("");
      setStatus(success);
    } catch (requestError) {
      if (isExpired(requestError)) return onExpired();
      setError(mediaError(requestError));
    } finally {
      setSaving(false);
    }
  }
  if (selected)
    return (
      <div className="space-y-8">
        <Button
          variant="ghost"
          onClick={() => {
            setSelected(null);
            setTask("");
            setStatus("");
          }}
        >
          ← Volver a imágenes de categorías
        </Button>
        <div className="space-y-3">
          <span className="ds-eyebrow">Categoría</span>
          <h1 className="ds-heading ds-heading-lg">{selected.name}</h1>
          <p className="text-sm text-[rgb(var(--muted)/1)]">
            /{selected.slug} · {selected.active ? "Activa" : "Inactiva"} ·{" "}
            {selected.visible ? "Visible" : "No visible"}
          </p>
        </div>
        {status ? (
          <PoliteStatus
            visuallyHidden={false}
            className="rounded-md border p-4"
          >
            {status}
          </PoliteStatus>
        ) : null}
        {error ? (
          <div
            role="alert"
            className="rounded-md border border-[rgb(var(--danger)/0.35)] p-4"
          >
            {error}
          </div>
        ) : null}
        <section aria-labelledby="category-image-title" className="space-y-5">
          <h2 id="category-image-title" className="ds-heading ds-heading-md">
            Imagen de la categoría
          </h2>
          {selected.image ? (
            <Card className="max-w-[720px] space-y-4">
              <div className="aspect-square w-full max-w-80 overflow-hidden rounded-md border">
                <img
                  src={selected.image.previewUrl}
                  alt={selected.image.altText ?? ""}
                  className="h-full w-full object-contain"
                />
              </div>
              <p>{selected.image.altText || "Texto alternativo pendiente"}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setAltText(selected.image?.altText ?? "");
                    setTask("alt");
                  }}
                >
                  Editar texto alternativo
                </Button>
                <Button variant="secondary" onClick={() => setTask("replace")}>
                  Reemplazar imagen
                </Button>
                <Button
                  variant="danger"
                  aria-label={`Solicitar eliminar imagen de ${selected.name}`}
                  onClick={() => setTask("remove")}
                >
                  Eliminar imagen
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="max-w-[720px] space-y-4">
              <p>Esta categoría no tiene imagen. La imagen es opcional.</p>
              <Button onClick={() => setTask("add")}>Agregar imagen</Button>
            </Card>
          )}
        </section>
        {task === "add" || task === "replace" ? (
          <UploadTask
            title={task === "add" ? "Agregar imagen" : "Reemplazar imagen"}
            kind="category"
            csrfToken={session.csrfToken}
            initialAlt={
              task === "replace" ? (selected.image?.altText ?? "") : ""
            }
            confirmLabel={
              task === "add"
                ? "Agregar imagen a la categoría"
                : "Guardar reemplazo"
            }
            saving={saving}
            onExpired={onExpired}
            onCancel={() => setTask("")}
            onConfirm={(upload, text) =>
              mutate(
                () =>
                  task === "add"
                    ? adminApi.addCategoryImage(
                        selected.id,
                        session.csrfToken,
                        {
                          expectedCategoryUpdatedAt: selected.updatedAt,
                          uploadId: upload.id,
                          altText: text,
                        },
                      )
                    : adminApi.updateCategoryImage(
                        selected.id,
                        session.csrfToken,
                        {
                          action: "replace",
                          expectedCategoryUpdatedAt: selected.updatedAt,
                          uploadId: upload.id,
                          altText: text,
                        },
                      ),
                task === "add"
                  ? "Imagen de categoría agregada"
                  : "Imagen de categoría reemplazada",
              )
            }
          />
        ) : null}
        {task === "alt" ? (
          <Card className="max-w-[720px] space-y-4">
            <h2 className="ds-heading ds-heading-md">
              Editar texto alternativo
            </h2>
            <Input
              id="category-alt"
              label="Texto alternativo"
              value={altText}
              maxLength={241}
              helperText={`${altText.length}/240 caracteres`}
              onChange={(event) => setAltText(event.target.value)}
            />
            <div className="flex gap-3">
              <Button
                disabled={!validAltText(altText) || saving}
                onClick={() =>
                  void mutate(
                    () =>
                      adminApi.updateCategoryImage(
                        selected.id,
                        session.csrfToken,
                        {
                          action: "metadata",
                          expectedCategoryUpdatedAt: selected.updatedAt,
                          altText: altText.trim(),
                        },
                      ),
                    "Texto alternativo actualizado",
                  )
                }
              >
                Guardar texto alternativo
              </Button>
              <Button variant="secondary" onClick={() => setTask("")}>
                Cancelar
              </Button>
            </div>
          </Card>
        ) : null}
        {task === "remove" ? (
          <Card className="max-w-[720px] space-y-4">
            <h2 className="ds-heading ds-heading-md">Eliminar imagen</h2>
            <p>
              La categoría seguirá siendo válida sin imagen. Esta acción no
              ofrece deshacer.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setTask("")}>
                Conservar imagen
              </Button>
              <Button
                variant="danger"
                disabled={saving}
                onClick={() =>
                  void mutate(
                    () =>
                      adminApi.removeCategoryImage(
                        selected.id,
                        session.csrfToken,
                        { expectedCategoryUpdatedAt: selected.updatedAt },
                      ),
                    "Imagen de categoría eliminada",
                  )
                }
              >
                Eliminar imagen
              </Button>
            </div>
          </Card>
        ) : null}
      </div>
    );
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <span className="ds-eyebrow">Catálogo administrativo</span>
        <h1 className="ds-heading ds-heading-lg">Imágenes de categorías</h1>
        <p className="text-[rgb(var(--muted)/1)]">
          Administra la imagen opcional de cada categoría existente.
        </p>
      </div>
      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          void load();
        }}
      >
        <Input
          id="category-media-search"
          label="Buscar categoría"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button type="submit">Buscar</Button>
      </form>
      {loading ? (
        <PoliteStatus visuallyHidden={false}>Cargando categorías…</PoliteStatus>
      ) : null}
      {error ? (
        <div role="alert" className="rounded-md border p-4">
          {error}
        </div>
      ) : null}
      {!loading && !categories.length ? (
        <Card>
          <p>No hay categorías que coincidan con la búsqueda.</p>
        </Card>
      ) : (
        <ul className="space-y-4">
          {categories.map((category) => (
            <Card
              as="li"
              key={category.id}
              className="grid gap-4 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md border bg-[rgb(var(--surface-muted)/1)]">
                {category.image ? (
                  <img
                    src={category.image.previewUrl}
                    alt={category.image.altText ?? ""}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-xs">Sin imagen</span>
                )}
              </div>
              <div>
                <h2 className="font-semibold">{category.name}</h2>
                <p className="text-sm text-[rgb(var(--muted)/1)]">
                  /{category.slug} ·{" "}
                  {category.image?.altText || "Sin texto alternativo"}
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => setSelected(category)}
                aria-label={`Administrar imagen de ${category.name}`}
              >
                Administrar imagen
              </Button>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ProductMediaAdmin(props: {
  productId: number;
  session: AdminSession;
  onBack: () => void;
  onExpired: () => void;
}) {
  return <ProductGallery {...props} />;
}
export function CategoryMediaAdmin(props: {
  session: AdminSession;
  onExpired: () => void;
}) {
  return <CategoryMedia {...props} />;
}
