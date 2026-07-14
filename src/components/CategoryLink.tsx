import Link from "next/link";
import React from "react";

import { resolvePublicAssetUrl } from "../lib/publicAssetUrl";
import { Icon, type IconName } from "./Icon";

export type CategoryLinkProps = {
  title: string;
  href: string;
  imageUrl?: string;
  imageAltText?: string;
  icon?: IconName;
};

export function CategoryLink({ title, href, imageUrl, imageAltText, icon }: CategoryLinkProps) {
  const resolvedImageUrl =
    resolvePublicAssetUrl(imageUrl) ?? "/images/banners/default-banner.svg";

  return (
    <Link
      href={href}
      aria-label={title}
      className="group flex w-[100px] flex-col items-center gap-2 rounded-md no-underline"
    >
      <span className="flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-full bg-[rgb(var(--background)/1)]">
        {icon ? (
          <Icon name={icon} size="lg" className="text-[rgb(var(--foreground)/1)]" />
        ) : (
          <img
            src={resolvedImageUrl}
            alt={imageAltText ?? title}
            width="200"
            height="200"
            sizes="100px"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = "/images/banners/default-banner.svg";
            }}
            className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
          />
        )}
      </span>
      <h3 className="text-center text-xs font-semibold leading-4 tracking-[-0.01em] text-[rgb(var(--foreground)/1)]">
        {title}
      </h3>
    </Link>
  );
}
