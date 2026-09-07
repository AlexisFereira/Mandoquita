import Head from "next/head";
import { APPLICATION_THEME_COLOR } from "../design-system/metadata";
import { FC } from "react";

type Props = {
  title?: string;
  desc?: string;
  img?: string;
  canonicalUrl?: string;
};

const ogImage =
  "https://d139alfkeie86e.cloudfront.net/images/banners/banner-meta.png";

const domain = "mandoquita.com";

const MetaTags: FC<Props> = ({ title, desc, img, canonicalUrl }) => {
  const mapValues = {
    title: title || "Mandoquita | Catálogo de productos",
    desc:
      desc ||
      "Explora productos para tecnología, audio y hogar, y recibe atención personalizada de Mandoquita.",
    img: img || ogImage,
    url: canonicalUrl || "/",
  };

  return (
    <Head>
      <title>{mapValues.title}</title>
      <meta name="description" content={mapValues.desc} />
      <meta name="robots" content="index,follow" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5"
      />

      <meta name="theme-color" content={APPLICATION_THEME_COLOR} />
      <link rel="canonical" href={mapValues.url} />

      <meta property="og:title" content={mapValues.title} />
      <meta property="og:description" content={mapValues.desc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={domain} />
      <meta property="og:site_name" content="Mandoquita" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={mapValues.title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={mapValues.title} />
      <meta name="twitter:description" content={mapValues.desc} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
};

export default MetaTags;
