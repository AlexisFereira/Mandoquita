import React from "react";

import { Button } from "../../components/Button";
import { Container } from "../../components/Container";
import { Icon } from "../../components/Icon";
import { Section } from "../../components/Section";

const paymentMethods = ["Binance", "Pago móvil", "Dólares en efectivo"] as const;

export type PaymentInformationProps = {
  contactHref?: string;
};

export function PaymentInformation({ contactHref }: PaymentInformationProps) {
  return (
    <Section id="medios-de-pago" tone="default" spacing="spacious">
      <Container size="xl" padding="lg">
        <div className="rounded-2xl border border-[rgb(var(--border)/1)] bg-[rgb(var(--surface-muted)/1)] p-6 sm:p-8 lg:p-10">
          <div className="max-w-3xl space-y-4">
            <h2 className="flex items-center gap-2 text-balance text-2xl font-semibold tracking-[-0.02em] text-[rgb(var(--foreground)/1)] sm:text-3xl">
              <Icon name="payment-information" />
              <span>Medios de pago</span>
            </h2>
            <p className="text-sm leading-6 text-[rgb(var(--muted)/1)] sm:text-base">
              Aceptamos Binance, pago móvil y dólares en efectivo. Confirma los detalles del
              pago directamente con Mandoquita.
            </p>
          </div>

          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paymentMethods.map((method) => (
              <li
                key={method}
                className="rounded-xl border border-[rgb(var(--border)/1)] bg-[rgb(var(--surface)/1)] p-4 font-medium text-[rgb(var(--foreground)/1)]"
              >
                {method}
              </li>
            ))}
          </ul>

          {contactHref ? (
            <Button
              href={contactHref}
              target="_blank"
              rel="noreferrer"
              className="mt-6 w-full gap-2 sm:w-auto"
            >
              <Icon name="contact" />
              <span>Consultar por WhatsApp</span>
            </Button>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
