import { describe, expect, it } from "vitest";

import {
  buildPublicProductContinuations,
  normalizePublicProductName,
} from "../../src/server/publicProductContinuationService";

describe("Public Product continuation configuration", () => {
  it("builds one canonical URL and the exact safely encoded WhatsApp context", () => {
    const result = buildPublicProductContinuations({
      slug: "cafe-especial", name: "  Café\n“Especial”  ☕  ",
    }, {
      NODE_ENV: "production",
      PUBLIC_SITE_ORIGIN: "https://mandoquita.example",
      WHATSAPP_BUSINESS_NUMBER: "+57 (350) 692-8681",
    });
    expect(result.canonicalUrl).toBe("https://mandoquita.example/products/cafe-especial");
    const destination = new URL(result.whatsappUrl!);
    expect(destination.origin).toBe("https://wa.me");
    expect(destination.pathname).toBe("/573506928681");
    expect(destination.searchParams.get("text")).toBe(
      "Hola, estoy interesado en este producto: “Café “Especial” ☕”. https://mandoquita.example/products/cafe-especial",
    );
  });

  it("fails closed without guessing production origin or recipient", () => {
    expect(buildPublicProductContinuations({ slug: "safe", name: "Safe" }, {
      NODE_ENV: "production", PUBLIC_SITE_ORIGIN: "http://mandoquita.example",
      WHATSAPP_BUSINESS_NUMBER: "573506928681",
    })).toEqual({ canonicalUrl: null, whatsappUrl: null });
    expect(buildPublicProductContinuations({ slug: "safe", name: "Safe" }, {
      NODE_ENV: "production", PUBLIC_SITE_ORIGIN: "https://user:pass@mandoquita.example/path?q=1",
      WHATSAPP_BUSINESS_NUMBER: "573506928681,12345678",
    })).toEqual({ canonicalUrl: null, whatsappUrl: null });
  });

  it("allows explicit localhost HTTP only outside production and omits invalid WhatsApp", () => {
    expect(buildPublicProductContinuations({ slug: "safe", name: "Safe" }, {
      NODE_ENV: "development", PUBLIC_SITE_ORIGIN: "http://localhost:3000",
      WHATSAPP_BUSINESS_NUMBER: "https://wa.me/573506928681?text=unsafe",
    })).toEqual({ canonicalUrl: "http://localhost:3000/products/safe", whatsappUrl: null });
  });

  it("normalizes public whitespace without changing visible Unicode", () => {
    expect(normalizePublicProductName(" Café\n\tEspecial ☕ ")).toBe("Café Especial ☕");
  });
});
