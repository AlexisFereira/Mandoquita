import React, { useMemo, useState } from "react";

import type {
  ProductVariantAttributeItem,
  ProductVariantSelection,
  PublicProductVariantItem,
} from "../types/catalog";
import { Chip } from "./Chip";
import { PoliteStatus } from "./PoliteStatus";

type AttributeValue = ProductVariantAttributeItem["value"];
type SelectionState = Record<string, string>;

export type ProductVariantOptionsProps = {
  selection: ProductVariantSelection;
  onVariantResolved?: (variant: PublicProductVariantItem) => void;
};

type OptionValue = {
  key: string;
  label: string;
  value: AttributeValue;
};

type OptionGroup = {
  name: ProductVariantAttributeItem["name"];
  options: OptionValue[];
};

function valueKey(value: AttributeValue) {
  return JSON.stringify(value);
}

function valueLabel(value: AttributeValue) {
  if (typeof value === "boolean") return value ? "Sí" : "No";
  return String(value);
}

export function buildVariantOptionGroups(
  variants: PublicProductVariantItem[],
): OptionGroup[] {
  const groups = new Map<OptionGroup["name"], Map<string, OptionValue>>();

  variants.forEach((variant) => {
    variant.attributes.forEach((attribute) => {
      const values = groups.get(attribute.name) ?? new Map<string, OptionValue>();
      const key = valueKey(attribute.value);
      if (!values.has(key)) {
        values.set(key, {
          key,
          label: valueLabel(attribute.value),
          value: attribute.value,
        });
      }
      groups.set(attribute.name, values);
    });
  });

  return Array.from(groups, ([name, options]) => ({
    name,
    options: Array.from(options.values()),
  }));
}

function variantMatches(
  variant: PublicProductVariantItem,
  selections: SelectionState,
) {
  return Object.entries(selections).every(([name, key]) =>
    variant.attributes.some(
      (attribute) => attribute.name === name && valueKey(attribute.value) === key,
    ),
  );
}

export function resolveSelectedVariant(
  variants: PublicProductVariantItem[],
  groups: OptionGroup[],
  selections: SelectionState,
) {
  if (groups.length === 0 || groups.some((group) => selections[group.name] === undefined)) {
    return undefined;
  }
  const matches = variants.filter((variant) => variantMatches(variant, selections));
  return matches.length === 1 ? matches[0] : undefined;
}

function ReadOnlyCharacteristics({ variant }: { variant: PublicProductVariantItem }) {
  if (variant.attributes.length === 0) return null;
  return (
    <section aria-labelledby="product-characteristics-heading" className="space-y-3">
      <h2 id="product-characteristics-heading" className="text-base font-semibold">
        Características
      </h2>
      <dl className="m-0 grid gap-2 text-sm">
        {variant.attributes.map((attribute) => (
          <div key={attribute.name} className="flex flex-wrap gap-2">
            <dt className="font-semibold">{attribute.name}:</dt>
            <dd className="m-0">{valueLabel(attribute.value)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ProductVariantOptions({
  selection,
  onVariantResolved,
}: ProductVariantOptionsProps) {
  const [selections, setSelections] = useState<SelectionState>({});
  const [status, setStatus] = useState("");
  const groups = useMemo(
    () => buildVariantOptionGroups(selection.variants),
    [selection.variants],
  );

  if (selection.mode === "read_only") {
    return selection.variants[0]
      ? <ReadOnlyCharacteristics variant={selection.variants[0]} />
      : null;
  }
  if (selection.mode !== "selectable") return null;

  function selectValue(groupName: OptionGroup["name"], option: OptionValue) {
    const groupIndex = groups.findIndex((group) => group.name === groupName);
    const candidateSelections = { ...selections, [groupName]: option.key };
    const preservesFollowingChoices = selection.variants.some((variant) =>
      variantMatches(variant, candidateSelections),
    );
    const nextSelections = preservesFollowingChoices
      ? candidateSelections
      : Object.fromEntries(
          groups
            .slice(0, groupIndex + 1)
            .map((group) => [
              group.name,
              group.name === groupName ? option.key : selections[group.name],
            ])
            .filter((entry): entry is [string, string] => entry[1] !== undefined),
        );
    setSelections(nextSelections);
    setStatus(`${groupName} seleccionado: ${option.label}.`);
    const resolved = resolveSelectedVariant(selection.variants, groups, nextSelections);
    if (resolved) onVariantResolved?.(resolved);
  }

  const resolved = resolveSelectedVariant(selection.variants, groups, selections);

  return (
    <section aria-labelledby="product-options-heading" className="space-y-4">
      <div className="space-y-1">
        <h2 id="product-options-heading" className="text-base font-semibold">
          Opciones
        </h2>
        <p className="m-0 text-sm text-[rgb(var(--muted)/1)]">
          Elige una opción para conocer sus características.
        </p>
      </div>

      {groups.map((group, groupIndex) => (
        <fieldset key={group.name} className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-2 font-semibold">{group.name}</legend>
          <div className="flex flex-wrap gap-2">
            {group.options.map((option) => {
              const candidateSelections = Object.fromEntries([
                ...groups
                  .slice(0, groupIndex)
                  .filter((previousGroup) => selections[previousGroup.name] !== undefined)
                  .map((previousGroup) => [previousGroup.name, selections[previousGroup.name]]),
                [group.name, option.key],
              ]);
              const available = selection.variants.some((variant) =>
                variantMatches(variant, candidateSelections),
              );
              return (
                <Chip
                  key={option.key}
                  mode="option"
                  value={option.key}
                  selected={selections[group.name] === option.key}
                  unavailable={!available}
                  unavailableText="Esta combinación no está disponible."
                  onSelect={() => selectValue(group.name, option)}
                >
                  {option.label}
                </Chip>
              );
            })}
          </div>
        </fieldset>
      ))}

      {resolved ? (
        <div className="rounded-lg border border-[rgb(var(--border)/1)] bg-[rgb(var(--surface-muted)/1)] p-4">
          <h3 className="mb-2 text-sm font-semibold">Características seleccionadas</h3>
          <dl className="m-0 grid gap-1 text-sm">
            {resolved.attributes.map((attribute) => (
              <div key={attribute.name} className="flex flex-wrap gap-2">
                <dt className="font-semibold">{attribute.name}:</dt>
                <dd className="m-0">{valueLabel(attribute.value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      <PoliteStatus>{status}</PoliteStatus>
    </section>
  );
}
