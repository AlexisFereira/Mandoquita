const urlBase = `${process.env.NEXT_PUBLIC_BASE_URL}/images/banners/`;
const bannerImg = {
  1: `${urlBase}banner-perfumes.png`,
  2: `${urlBase}slide-accesorios.png`,
  3: `${urlBase}slide-oversizes.png`,
  4: `${urlBase}coleccion-bp.png`,
}

const carouselSlides = [
  {
    title: "Nueva colección de perfumes",
    description: "Fragancias inspiradas en las marcas más reconocidas, para él y para ella.",
    imageUrl: bannerImg[1],
    //action: {
    //  label: "Descubrir colección",
    //  href: "/categorias/ropa-y-moda/conjuntos-para-mujer",
    //},
  },
  {
    title: "Llegaron nuevas prendas",
    description: "Hay muchas opciones para combinar. Encuentra tu estilo y crea tu propio look.",
    imageUrl: bannerImg[4],
    //action: {
    //  label: "Descubrir colección",
    //  href: "/categorias/ropa-y-moda/conjuntos-para-mujer",
    //},
  },
  {
    title: "El detalle cambia el look",
    description:
      "Gorras, lentes y relojes para llevar tu estilo un paso más allá.",
    imageUrl: bannerImg[2],
    action: {
      label: "Explorar accesorios",
      href: "/categorias/accesorios-de-moda",
    },
  },
  {
    title: "Tu estilo. Sin uniforme.",
    description: "Oversize, estampadas y acid wash hechas para destacar.",
    imageUrl: bannerImg[3],
    action: {
      label: "Explorar colección",
      href: "/categorias/ropa-y-moda/camisetas",
    },
  },
];

const whatsappUrl =
  "https://wa.me/584245553041?text=Hola%2C%20vi%20el%20cat%C3%A1logo%20de%20Mandoquita%20y%20quisiera%20recibir%20informaci%C3%B3n%20sobre%20un%20producto.";


export { carouselSlides, whatsappUrl, urlBase };