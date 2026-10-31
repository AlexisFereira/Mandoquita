import React from "react";
import { Card } from "./Card";
import { Container } from "./Container";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { whatsappUrl } from "@/constants";

const payments = [
  {
    id: "pago-movil",
    title: "Pago móvil",
    icon: "/images/payments/pago-movil.png",
    description: "Rápido y fácil desde tu banco.",
  },
  {
    id: "transferencia-bancaria",
    title: "Transferencia bancaria",
    icon: "/images/payments/transferencia-bancaria.png",
    description: "Realiza tu pago mediante transferencia bancaria nacional.",
  },
  {
    id: "binance-usdt",
    title: "Binance / USDT",
    icon: "/images/payments/binance-usdt.png",
    description: "Aceptamos pagos en USDT a través de Binance.",
  },
  {
    id: "pago-contra-entrega",
    title: "Pago contra entrega",
    icon: "/images/payments/pago-contra-entrega.png",
    description: "Paga al recibir tu pedido, según disponibilidad.",
  },
  {
    id: "efectivo-usd",
    title: "Efectivo en USD",
    icon: "/images/payments/efectivo-usd.png",
    description: "También puedes pagar en efectivo en dólares.",
  },
];

type Payment = Omit<(typeof payments)[number], "id">;

function PaymentOption({ title, icon, description }: Payment) {
  return (
    <Card className="p-4">
      <img
        src={icon}
        alt=""
        height={80}
        width={80}
        className="rounded-full mb-3"
      />
      <h3 className="font-bold text-md mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </Card>
  );
}

const PaymentOptions = () => {
  const backgroundImageStyle = {
    backgroundImage: `url(${"/images/payments/fondo-payments.png"})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <section className="py-10 sm:py-12 lg:py-16 " style={backgroundImageStyle}>
      <Container size="wide" padding="lg" className="space-y-8 pt-6">
        <h1 className="text-balance text-2xl mb-1 font-semibold tracking-[-0.02em] sm:text-3xl">
          Paga como prefieras
        </h1>
        <p className="max-w-2xl leading-7 text-[rgb(var(--muted)/1)] ">
          Te ofrecemos diferentes opciones de pago para que elijas la más
          conveniente. Confirma tu pedido por WhatsApp y te indicaremos cómo
          realizar tu pago.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:grid-cols-5 xl:grid-cols-7">
          {payments.map(({ id, ...obj }) => (
            <PaymentOption {...obj} key={id} />
          ))}
        </div>

        <div className="grid-rows-auto gap-4 grid-cols-12 grid rounded-xl shadow-md shadow-black bg-secondary-100 p-4 mb-4">
          <div className="icon content-center  text-center col-span-4 md:col-span-4 lg:col-span-1 border-r-2 border-primary-500">
            <Icon name="info" className="text-primary" size="xl" />
          </div>
          <div className="col-span-8 md:col-span-7 pl-4">
            <p className="font-bold">¿Cómo realizar tu pago?</p>
            <div className="max-w-100">
              <span className="text-gray-600 text-sm">
                Una vez confirmado tu pedido, te compartiremos los datos
                necesarios según el método de pago que prefieras.
              </span>
            </div>
          </div>
          <div className="icon col-span-12 md:col-span-4 text-center content-center">
            <Button href={whatsappUrl} size="md" className="mx-auto">
              Escríbenos por WhatsApp{" "}
              <Icon name="arrowRight" className="ml-4" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PaymentOptions;
