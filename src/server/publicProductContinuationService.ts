const internationalNumber = /^\+?[\d\s().-]+$/;
const localHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);

function governedOrigin(raw: string | undefined, production: boolean) {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const localHttp = !production && url.protocol === "http:" && localHosts.has(url.hostname);
    if (url.username || url.password || url.search || url.hash || url.pathname !== "/") return null;
    if (url.protocol !== "https:" && !localHttp) return null;
    return url.origin;
  } catch {
    return null;
  }
}

function governedWhatsAppNumber(raw: string | undefined) {
  const value = raw?.trim();
  if (!value || !internationalNumber.test(value)) return null;
  const digits = value.replace(/\D/g, "");
  return /^\d{8,15}$/.test(digits) ? digits : null;
}

export function normalizePublicProductName(value: string) {
  return value.normalize("NFC").replace(/\s+/gu, " ").trim();
}

export function buildPublicProductContinuations(
  product: { slug: string; name: string },
  environment: Record<string, string | undefined> = process.env,
) {
  const origin = governedOrigin(environment.PUBLIC_SITE_ORIGIN, environment.NODE_ENV === "production");
  if (!origin) return { canonicalUrl: null, whatsappUrl: null };
  const canonical = new URL(`/products/${encodeURIComponent(product.slug)}`, origin);
  canonical.search = "";
  canonical.hash = "";
  const canonicalUrl = canonical.toString();
  const recipient = governedWhatsAppNumber(environment.WHATSAPP_BUSINESS_NUMBER);
  if (!recipient) return { canonicalUrl, whatsappUrl: null };
  const name = normalizePublicProductName(product.name);
  const message = `Hola, estoy interesado en este producto: “${name}”. ${canonicalUrl}`;
  const whatsapp = new URL(`https://wa.me/${recipient}`);
  whatsapp.searchParams.set("text", message);
  const whatsappUrl = whatsapp.toString();
  return { canonicalUrl, whatsappUrl: whatsappUrl.length <= 2_048 ? whatsappUrl : null };
}
