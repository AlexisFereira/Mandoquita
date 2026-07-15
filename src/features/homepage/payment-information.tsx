import React from "react";

import { Container } from "../../components/Container";
import { Section } from "../../components/Section";

export type PaymentInformationProps = {
  contactHref?: string;
};

const urlBase = "https://d139alfkeie86e.cloudfront.net";

export function PaymentInformation({
  contactHref: _contactHref,
}: PaymentInformationProps) {
  return (
    <Section
      id="medios-de-pago"
      aria-labelledby="medios-de-pago-title"
      tone="default"
      spacing="spacious"
    >
      <Container size="wide" padding="lg">
        <div className="relative overflow-hidden md:hidden rounded-[8px]">
          <img
            src={`${urlBase}/images/banners/banner-forma-de-pago-sm.png`}
            alt=""
            width="2172"
            height="724"
            sizes="(min-width: 1400px) 1352px, calc(100vw - 48px)"
            loading="lazy"
            className="h-auto w-full object-cover"
          />
        </div>
        <div className="relative overflow-hidden hidden md:block rounded-[8px]">
          <img
            src={`${urlBase}/images/banners/banner-forma-de-pago-xxl.png`}
            alt=""
            width="2172"
            height="724"
            sizes="(min-width: 1400px) 1352px, calc(100vw - 48px)"
            loading="lazy"
            className="h-auto w-full object-cover"
          />
        </div>
      </Container>
    </Section>
  );
}
