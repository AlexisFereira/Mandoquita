import React from "react";
import Head from "next/head";
import { APPLICATION_THEME_COLOR } from "../../src/design-system/metadata";

const HeadMetas = () => {
  const ogImage =
    "https://d139alfkeie86e.cloudfront.net/images/banners/banner-meta.png";

  return (
    <Head>
      <title>Mandoquita | Catálogo de productos</title>
      <meta
        name="description"
        content="Explora productos para tecnología, audio y hogar, y recibe atención personalizada de Mandoquita."
      />
      <meta name="robots" content="index,follow" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5"
      />
      <meta name="theme-color" content={APPLICATION_THEME_COLOR} />
      <link rel="canonical" href="/" />
      <meta property="og:title" content="Mandoquita | Catálogo de productos" />
      <meta
        property="og:description"
        content="Productos elegidos para acompañar tu día a día."
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content="https://main.d92kyqw1kgw5k.amplifyapp.com/"
      />
      <meta property="og:site_name" content="Mandoquita" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Catálogo Mandoquita" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Mandoquita" />
      <meta
        name="twitter:description"
        content="Catálogo de combos Mandoquita."
      />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
};

export default HeadMetas;
