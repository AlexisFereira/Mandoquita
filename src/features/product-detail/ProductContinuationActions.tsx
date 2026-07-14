import React, { useRef, useState } from "react";

import { Button } from "../../components/Button";
import { Icon } from "../../components/Icon";
import { PoliteStatus } from "../../components/PoliteStatus";

export type ProductContinuationActionsProps = {
  productName: string;
  canonicalUrl: string | null;
  whatsappUrl: string | null;
};

function isShareCancellation(error: unknown) {
  return error instanceof DOMException
    ? error.name === "AbortError"
    : Boolean(error && typeof error === "object" && "name" in error && error.name === "AbortError");
}

export function ProductContinuationActions({
  productName,
  canonicalUrl,
  whatsappUrl,
}: ProductContinuationActionsProps) {
  const actionRegionRef = useRef<HTMLElement>(null);
  const sharePendingRef = useRef(false);
  const copyPendingRef = useRef(false);
  const [sharePending, setSharePending] = useState(false);
  const [copyPending, setCopyPending] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [status, setStatus] = useState("");

  function restoreActionFocus(selector: string) {
    window.setTimeout(() => {
      actionRegionRef.current?.querySelector<HTMLButtonElement>(selector)?.focus();
    }, 0);
  }

  if (!canonicalUrl) {
    return (
      <p className="mt-6 max-w-[440px] text-sm leading-6 text-[rgb(var(--muted)/1)]">
        Las opciones para contactar y compartir no están disponibles en este momento.
      </p>
    );
  }
  const safeCanonicalUrl = canonicalUrl;

  async function shareProduct() {
    if (sharePendingRef.current) return;
    setStatus("");

    if (typeof navigator.share !== "function") {
      setShowRecovery(true);
      return;
    }

    sharePendingRef.current = true;
    setShowRecovery(false);
    setSharePending(true);
    try {
      await navigator.share({
        title: `${productName} | Mandoquita`,
        text: `Mira “${productName}” en Mandoquita.`,
        url: safeCanonicalUrl,
      });
    } catch (error) {
      if (!isShareCancellation(error)) {
        setStatus("No pudimos abrir las opciones para compartir.");
        setShowRecovery(true);
      }
    } finally {
      sharePendingRef.current = false;
      setSharePending(false);
      restoreActionFocus("[data-product-share]");
    }
  }

  async function copyCanonicalUrl() {
    if (copyPendingRef.current) return;
    copyPendingRef.current = true;
    setStatus("");
    setCopyPending(true);
    try {
      if (typeof navigator.clipboard?.writeText !== "function") throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(safeCanonicalUrl);
      setStatus("Enlace copiado");
    } catch {
      setStatus("No pudimos copiar el enlace. Selecciónalo para copiarlo manualmente.");
    } finally {
      copyPendingRef.current = false;
      setCopyPending(false);
      restoreActionFocus("[data-product-copy]");
    }
  }

  return (
    <section ref={actionRegionRef} aria-labelledby="product-continuation-heading" className="mt-6 max-w-[440px] space-y-3">
      <h2 id="product-continuation-heading" className="ds-heading ds-heading-md">
        ¿Te interesa este producto?
      </h2>

      {whatsappUrl ? (
        <>
          <Button
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
            className="w-full gap-2"
          >
            <Icon name="contact" />
            Preguntar por este producto
            <Icon name="external-link" size="sm" />
          </Button>
          <p className="m-0 text-sm leading-6 text-[rgb(var(--muted)/1)]">
            Abriremos WhatsApp con el nombre y el enlace del producto listos para enviar.
          </p>
        </>
      ) : null}

      <Button
        data-product-share="true"
        variant="secondary"
        className="w-full"
        disabled={sharePending}
        aria-busy={sharePending || undefined}
        onClick={() => void shareProduct()}
      >
        {sharePending ? "Abriendo opciones…" : "Compartir producto"}
      </Button>

      {showRecovery ? (
        <div className="space-y-3 rounded-md border border-[rgb(var(--border)/1)] bg-[rgb(var(--surface-muted)/1)] p-4 sm:p-5">
          <h3 className="text-base font-semibold">Compartir enlace</h3>
          <p className="m-0 text-sm leading-6 text-[rgb(var(--muted)/1)]">
            Puedes copiar o abrir el enlace canónico del producto.
          </p>
          <Button
            data-product-copy="true"
            variant="secondary"
            className="w-full sm:w-auto"
            disabled={copyPending}
            aria-busy={copyPending || undefined}
            onClick={() => void copyCanonicalUrl()}
          >
            {copyPending ? "Copiando enlace…" : "Copiar enlace"}
          </Button>
          <a
            href={safeCanonicalUrl}
            aria-label={`Enlace canónico de ${productName}`}
            className="block min-h-11 content-center [overflow-wrap:anywhere] text-sm underline underline-offset-4"
          >
            {safeCanonicalUrl}
          </a>
        </div>
      ) : null}

      <PoliteStatus visuallyHidden={false} className="min-h-6 text-sm text-[rgb(var(--muted)/1)]">
        {status}
      </PoliteStatus>
    </section>
  );
}
