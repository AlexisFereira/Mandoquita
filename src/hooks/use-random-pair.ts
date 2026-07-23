// hooks/use-random-pair.ts
"use client";

import { useEffect, useState } from "react";

type Die = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Pair = [Die, Die];

function generatePair(): Pair {
  const pool: Die[] = [1, 2, 3, 4, 5, 6, 7];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return [pool[0], pool[1]];
}

/**
 * Devuelve un par de dados diferentes entre 1 y 7.
 * El par se genera solo en el cliente, UNA vez por montaje del componente,
 * para evitar inconsistencias entre SSR e hidratación.
 */
export function useRandomPair(): Pair | null {
  const [pair, setPair] = useState<Pair | null>(null);

  useEffect(() => {
    setPair(generatePair());
  }, []); // [] = una sola vez al montar

  return pair;
}
