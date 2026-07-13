export function resolvePublicAssetUrl(source?: string): string | undefined {
  const value = source?.trim();
  if (!value) return undefined;
  if (/^(?:https?:)?\/\//i.test(value) || /^(?:data|blob):/i.test(value)) return value;

  const path = `/${value.replace(/^\/+/, "")}`;
  const baseUrl = (process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "")
    .trim()
    .replace(/\/+$/, "");
  return baseUrl ? `${baseUrl}${path}` : path;
}
