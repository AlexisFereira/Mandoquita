ALTER TABLE "Category"
  ADD COLUMN "imagePath" TEXT,
  ADD COLUMN "imageAltText" TEXT;

UPDATE "Category" SET
  "imagePath" = CASE "slug"
    WHEN 'ropa-y-moda' THEN '/images/categories/ropa-y-moda.png'
    WHEN 'accesorios-de-moda' THEN '/images/categories/accesorios-de-moda.png'
    WHEN 'accesorios-para-moto' THEN '/images/categories/accesorios-para-moto.png'
    WHEN 'electronica-y-seguridad' THEN '/images/categories/electronica-y-seguridad.png'
    WHEN 'belleza-y-cuidado-personal' THEN '/images/categories/belleza-y-cuidado-personal.png'
    WHEN 'hogar-y-cocina' THEN '/images/categories/hogar-y-cocina.png'
    WHEN 'alimentos-y-bebidas' THEN '/images/categories/alimentos-y-bebidas.png'
  END,
  "imageAltText" = CASE "slug"
    WHEN 'ropa-y-moda' THEN 'Prendas casuales y deportivas en tonos cálidos.'
    WHEN 'accesorios-de-moda' THEN 'Reloj, lentes, bolso y billetera de estilo contemporáneo.'
    WHEN 'accesorios-para-moto' THEN 'Soporte para celular, intercomunicador y accesorios de protección para moto.'
    WHEN 'electronica-y-seguridad' THEN 'Cámaras de seguridad compactas para vigilancia.'
    WHEN 'belleza-y-cuidado-personal' THEN 'Máquina de afeitar y elementos de cuidado personal.'
    WHEN 'hogar-y-cocina' THEN 'Encendedor largo para estufa en una cocina cálida.'
    WHEN 'alimentos-y-bebidas' THEN 'Café tostado servido junto a granos y un empaque neutro.'
  END;

ALTER TABLE "Category" ADD CONSTRAINT "Category_media_pair_check" CHECK (
  ("imagePath" IS NULL AND "imageAltText" IS NULL) OR
  (
    "imagePath" ~ '^/images/categories/[a-z0-9-]+\.png$' AND
    btrim("imageAltText") <> ''
  )
);
