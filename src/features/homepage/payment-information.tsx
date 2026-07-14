import React from "react";

import { Container } from "../../components/Container";
import { Section } from "../../components/Section";

export type PaymentInformationProps = {
  contactHref?: string;
};

export function PaymentInformation({ contactHref: _contactHref }: PaymentInformationProps) {
  return (
    <Section
      id="medios-de-pago"
      aria-labelledby="medios-de-pago-title"
      tone="default"
      spacing="spacious"
    >
      <Container size="wide" padding="lg">
        <div className="relative overflow-hidden rounded-[8px]">
          <img
            src="/images/payment-methods-banner.png"
            alt=""
            width="2172"
            height="724"
            sizes="(min-width: 1400px) 1352px, calc(100vw - 48px)"
            loading="lazy"
            className="h-[160px] w-full object-cover sm:h-[220px] lg:h-[300px] xl:h-[350px]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/55 to-transparent px-4 pb-4 pt-12 text-inverse-foreground sm:px-6 sm:pb-6 sm:pt-16 lg:px-8 lg:pb-8">
            <h2
              id="medios-de-pago-title"
              className="text-balance text-xl font-semibold tracking-[-0.02em] sm:text-2xl lg:text-3xl"
            >
              Medios de pago
            </h2>
            <p className="mt-1 max-w-3xl text-xs leading-5 text-inverse-muted sm:mt-2 sm:text-sm sm:leading-6 lg:text-base">
              Elige la opción que te resulte más cómoda: aceptamos Binance, Pago Móvil en
              Venezuela y dólares en efectivo.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
