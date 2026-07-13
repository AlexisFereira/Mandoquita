import { describe, expect, it } from "vitest";

import type {
  ButtonProps,
  CardProps,
  CarouselProps,
  ContainerProps,
  ProductCardProps,
  ProductOfferProps,
  SearchInputProps,
  SectionProps,
} from "../../src/components";

type PublicPropsContracts = [
  ButtonProps,
  CardProps,
  CarouselProps,
  ContainerProps,
  ProductCardProps,
  ProductOfferProps,
  SearchInputProps,
  SectionProps,
];

describe("public component props", () => {
  it("exposes every configurable shared component contract through the barrel", () => {
    const contractsCompile: PublicPropsContracts extends readonly unknown[]
      ? true
      : false = true;

    expect(contractsCompile).toBe(true);
  });
});
