import { timingSafeEqual } from "node:crypto";

import type { NextApiRequest } from "next";

export function isAdminApiConfigured(apiKey: string | undefined): apiKey is string {
  return typeof apiKey === "string" && apiKey.length >= 32;
}

export function isAdminApiAuthorized(req: NextApiRequest, expectedKey: string) {
  const suppliedKey = req.headers["x-admin-api-key"];
  if (typeof suppliedKey !== "string") return false;
  const expected = Buffer.from(expectedKey);
  const supplied = Buffer.from(suppliedKey);
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}
