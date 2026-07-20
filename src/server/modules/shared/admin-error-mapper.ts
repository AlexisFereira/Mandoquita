import type { NextApiResponse } from "next";
import { Prisma } from "@prisma/client";

/**
 * Errores que cualquier módulo puede lanzar. Sirven como contrato.
 */
export class AdminNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminNotFoundError";
  }
}

export class AdminConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminConflictError";
  }
}

export class AdminValidationError extends Error {
  constructor(public zodError: unknown) {
    super("Validation failed");
    this.name = "AdminValidationError";
  }
}

export class AdminDependenciesError extends Error {
  constructor(
    public dependencies: Record<string, number>,
    message = "Resource has protected dependencies",
  ) {
    super(message);
    this.name = "AdminDependenciesError";
  }
}

/**
 * Mapea errores del módulo a respuestas HTTP.
 * Devuelve true si manejó el error, false si debe propagarse.
 */
export function mapAdminErrorToHttp(
  res: NextApiResponse,
  error: unknown,
): boolean {
  if (error instanceof AdminNotFoundError) {
    res.status(404).json({ error: error.message });
    return true;
  }
  if (error instanceof AdminConflictError) {
    res.status(409).json({ error: error.message });
    return true;
  }
  if (error instanceof AdminDependenciesError) {
    res.status(409).json({
      error: error.message,
      dependencies: error.dependencies,
    });
    return true;
  }
  if (error instanceof AdminValidationError) {
    res.status(400).json({
      error: "Validation failed",
      details: error.zodError,
    });
    return true;
  }
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    res.status(404).json({ error: "Resource not found" });
    return true;
  }
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    res.status(409).json({ error: "Unique constraint violated" });
    return true;
  }
  return false;
}
