import { describe, expect, it } from "vitest";

import type {
  ButtonProps,
  CardProps,
  CarouselProps,
  ChipProps,
  ContainerProps,
  ProductCardProps,
  ProductOfferProps,
  PoliteStatusProps,
  SearchInputProps,
  SectionProps,
} from "../../src/components";

type PublicPropsContracts = [
  ButtonProps,
  CardProps,
  CarouselProps,
  ChipProps,
  ContainerProps,
  ProductCardProps,
  ProductOfferProps,
  PoliteStatusProps,
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
