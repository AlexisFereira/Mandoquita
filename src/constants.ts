const urlBase = "https://d139alfkeie86e.cloudfront.net";

const carouselSlides = [
  {
    title: "Tu próximo conjunto favorito",
    description: "Cómodos, versátiles y listos para combinar con tu estilo.",
    imageUrl: `${urlBase}/images/banners/slide-ropa-mujer.png`,
    action: {
      label: "Descubrir colección",
      href: "/categorias/ropa-y-moda/conjuntos-para-mujer",
    },
  },
  {
    title: "El detalle cambia el look",
    description:
      "Gorras, lentes y relojes para llevar tu estilo un paso más allá.",
    imageUrl: `${urlBase}/images/banners/slide-accesorios.png`,
    action: {
      label: "Explorar accesorios",
      href: "/categorias/accesorios-de-moda",
    },
  },
  {
    title: "Tu estilo. Sin uniforme.",
    description: "Oversize, estampadas y acid wash hechas para destacar.",
    imageUrl: `${urlBase}/images/banners/slide-oversizes.png`,
    action: {
      label: "Explorar colección",
      href: "/categorias/ropa-y-moda/camisetas",
    },
  },
];

const whatsappUrl =
  "https://wa.me/584245553041?text=Hola%2C%20vi%20el%20cat%C3%A1logo%20de%20Mandoquita%20y%20quisiera%20recibir%20informaci%C3%B3n%20sobre%20un%20producto.";


export { carouselSlides, whatsappUrl, urlBase };