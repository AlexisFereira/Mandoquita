import { Container } from "./Container";

const catImgPathBase = "/images/categories/";

const categoriesConfig = {
  category1: {
    title: "Ropa y Moda",
    description: "Prendas para cada estilo, ocasión y momento.",
    link: "/categorias/ropa-y-moda",
    urlImg: `${catImgPathBase}ropa-y-moda.webp`,
  },
  category2: {
    title: "Calzado",
    description: "Comodidad y estilo para acompañar cada paso.",
    link: "/categorias/calzado",
    urlImg: `${catImgPathBase}calzado.webp`,
  },
  category3: {
    title: "Accesorios y Joyería",
    description: "",
    link: "/categorias/accesorios-de-moda",
    urlImg: `${catImgPathBase}accesorios-y-joyeria.webp`,
  },
  category4: {
    title: "Perfumes y Fragancias",
    description: "",
    link: "/categorias/belleza-y-cuidado-personal",
    urlImg: `${catImgPathBase}perfumes-y-fragancias.webp`,
  },
  category5: {
    title: "Electrónica y Gadgets",
    description: "",
    link: "/categorias/electronica-y-seguridad",
    urlImg: `${catImgPathBase}electronica-y-gadgets.webp`,
  },
};

function TextBlock({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text p-4 text-white">
      <h1 className="text-xl font-bold lg:text-xl">{title}</h1>
      <p>{description}</p>
    </div>
  );
}

function BlockCategory({
  title,
  description,
  link,
  size = "md",
  urlImg,
}: {
  title: string;
  description: string;
  link: string;
  size?: "md" | "lg" | "xl";
  urlImg: string;
}) {
  const sizeClasses = {
    md: "h-30 md:m-h-60 lg:h-full",
    lg: "h-30 md:h-60",
    xl: "h-30 md:h-80",
  };

  const backgroundImageStyle = {
    backgroundImage: `url(${urlImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div
      className={`shadow-md w-full bg-[rgb(var(--muted)/0.1)] rounded-2xl overflow-hidden relative ${sizeClasses[size]} hover:scale-98 transition-transform duration-300 ease-in-out`}
      style={backgroundImageStyle}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.6)] to-[rgb(var(--muted)/0.1)]"></div>
      <a href={link} className="block h-full w-full content-end relative">
        <div className="h-full w-full flex items-end">
          <TextBlock title={title} description={description} />
        </div>
      </a>
    </div>
  );
}
const CategoriesBlocks = () => {
  return (
    <Container size="wide" padding="lg" className="space-y-8 pt-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3 pt-6">
        <BlockCategory {...categoriesConfig.category1} size="xl" />
        <BlockCategory {...categoriesConfig.category2} size="xl" />
        <div className="grid grid-cols-1 gap-4 sm:col-span-2 sm:grid-cols-3 lg:grid-cols-1 lg:col-span-1">
          <BlockCategory {...categoriesConfig.category3} size="md" />
          <div className="grid grid-cols-2 gap-4 sm:col-span-2 lg:col-span-1">
            <BlockCategory {...categoriesConfig.category4} size="md" />
            <BlockCategory {...categoriesConfig.category5} size="md" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="grid grid-cols-1 gap-4 sm:col-span-1 sm:grid-cols-1">
          <div className="col-span-2 grid grid-cols-2 gap-4 sm:col-span-1 sm:grid-cols-1 lg:grid-cols-2"></div>
        </div>
      </section>
    </Container>
  );
};

export default CategoriesBlocks;
