import { Container } from "./Container";
import { Icon } from "./Icon";
import { Button } from "./Button";

const catImgPathBase = "/images/categories/";

type CategoryConfig = {
  title: string;
  description: string;
  link: string;
  urlImg: string;
  size?: "md" | "lg" | "xl";
};

const categoriesConfig: { [key: string]: CategoryConfig } = {
  category1: {
    title: "Ropa y Moda",
    description: "Prendas para cada estilo, ocasión y momento.",
    link: "/categorias/ropa-y-moda",
    urlImg: `${catImgPathBase}ropa-y-moda.webp`,
    size: "xl",
  },
  category2: {
    title: "Calzado",
    description: "Comodidad y estilo para acompañar cada paso.",
    link: "/categorias/calzado",
    urlImg: `${catImgPathBase}calzado.webp`,
    size: "xl",
  },
  category3: {
    title: "Accesorios y Joyería",
    description: "",
    link: "/categorias/accesorios-de-moda",
    urlImg: `${catImgPathBase}accesorios-y-joyeria.webp`,
    size: "md",
  },
  category4: {
    title: "Perfumes y Fragancias",
    description: "",
    link: "/categorias/belleza-y-cuidado-personal",
    urlImg: `${catImgPathBase}perfumes-y-fragancias.webp`,
    size: "md",
  },
  category5: {
    title: "Electrónica y Gadgets",
    description: "",
    link: "/categorias/electronica-y-seguridad",
    urlImg: `${catImgPathBase}electronica-y-gadgets.webp`,
    size: "md",
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
    md: "h-40 md:m-h-60 lg:h-full",
    lg: "h-50 md:h-60",
    xl: "h-50 md:h-80",
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
  const { category1, category2, category3, category4, category5 } =
    categoriesConfig;

  return (
    <Container size="wide" padding="lg" className="space-y-8 pt-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3 pt-6">
        <BlockCategory {...category1} />
        <BlockCategory {...category2} />
        <div className="grid grid-cols-1 gap-4 sm:col-span-2 sm:grid-cols-3 lg:grid-cols-1 lg:col-span-1">
          <BlockCategory {...category3} />
          <div className="grid grid-cols-2 gap-4 sm:col-span-2 lg:col-span-1">
            <BlockCategory {...category4} />
            <BlockCategory {...category5} />
          </div>
        </div>
        <div className="sm:col-span-2 lg:col-span-3 pt-6 text-right">
          <Button
            href="/categorias"
            variant="secondary"
            className="max-w-60 ml-auto mr-0"
          >
            <span>Ver todas las categorías</span>
            <Icon name="arrowRight" className="ml-4" />
          </Button>
        </div>
      </section>
    </Container>
  );
};

export default CategoriesBlocks;
