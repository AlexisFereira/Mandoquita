-- Retire the ten approved demonstration fixtures before replacing the flat taxonomy.
DELETE FROM "Product";
DROP TABLE "Category" CASCADE;
ALTER TABLE "Product" DROP COLUMN "categoryId";

CREATE TYPE "TaxonomyStatus" AS ENUM ('PROPOSED', 'APPROVED', 'ACTIVE', 'SUPERSEDED');

CREATE TABLE "TaxonomyVersion" (
  "id" TEXT PRIMARY KEY,
  "version" TEXT NOT NULL UNIQUE,
  "locale" TEXT NOT NULL,
  "status" "TaxonomyStatus" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Category" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "sortOrder" INTEGER NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "visible" BOOLEAN NOT NULL DEFAULT true,
  "versionId" TEXT NOT NULL REFERENCES "TaxonomyVersion"("id") ON DELETE RESTRICT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Category_sortOrder_positive_check" CHECK ("sortOrder" > 0),
  CONSTRAINT "Category_versionId_sortOrder_key" UNIQUE ("versionId", "sortOrder")
);

CREATE TABLE "Subcategory" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "sourceOrder" INTEGER NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "categoryId" TEXT NOT NULL REFERENCES "Category"("id") ON DELETE RESTRICT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Subcategory_sourceOrder_positive_check" CHECK ("sourceOrder" > 0),
  CONSTRAINT "Subcategory_categoryId_sourceOrder_key" UNIQUE ("categoryId", "sourceOrder")
);

CREATE TABLE "ProductType" (
  "name" TEXT PRIMARY KEY,
  "sourceOrder" INTEGER NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "subcategoryId" TEXT NOT NULL REFERENCES "Subcategory"("id") ON DELETE RESTRICT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductType_sourceOrder_positive_check" CHECK ("sourceOrder" > 0),
  CONSTRAINT "ProductType_subcategoryId_sourceOrder_key" UNIQUE ("subcategoryId", "sourceOrder")
);

ALTER TABLE "Product" ADD COLUMN "productTypeId" TEXT;
ALTER TABLE "Product" ADD CONSTRAINT "Product_productTypeId_fkey"
  FOREIGN KEY ("productTypeId") REFERENCES "ProductType"("name") ON DELETE RESTRICT;
ALTER TABLE "Product" ADD CONSTRAINT "Product_published_requires_product_type_check"
  CHECK (NOT "published" OR "productTypeId" IS NOT NULL);

INSERT INTO "TaxonomyVersion" ("id", "version", "locale", "status")
VALUES ('taxonomy_es_1_0_0', '1.0.0', 'es', 'ACTIVE');

INSERT INTO "Category" ("id", "slug", "name", "description", "sortOrder", "versionId") VALUES
('cat_ropa_moda','ropa-y-moda','Ropa y moda','Prendas de vestir para mujer, hombre y público unisex.',1,'taxonomy_es_1_0_0'),
('cat_accesorios_moda','accesorios-de-moda','Accesorios de moda','Complementos personales y accesorios para vestir.',2,'taxonomy_es_1_0_0'),
('cat_accesorios_moto','accesorios-para-moto','Accesorios para moto','Accesorios de protección, soporte y comunicación para motociclistas.',3,'taxonomy_es_1_0_0'),
('cat_electronica_seguridad','electronica-y-seguridad','Electrónica y seguridad','Dispositivos electrónicos para seguridad y vigilancia.',4,'taxonomy_es_1_0_0'),
('cat_belleza_cuidado','belleza-y-cuidado-personal','Belleza y cuidado personal','Productos y equipos para higiene, belleza y cuidado personal.',5,'taxonomy_es_1_0_0'),
('cat_hogar_cocina','hogar-y-cocina','Hogar y cocina','Artículos prácticos para el hogar y la cocina.',6,'taxonomy_es_1_0_0'),
('cat_alimentos_bebidas','alimentos-y-bebidas','Alimentos y bebidas','Productos alimenticios y bebidas empacadas.',7,'taxonomy_es_1_0_0');

INSERT INTO "Subcategory" ("id", "slug", "name", "sourceOrder", "categoryId") VALUES
('sub_camisetas','camisetas','Camisetas',1,'cat_ropa_moda'),
('sub_conjuntos_mujer','conjuntos-para-mujer','Conjuntos para mujer',2,'cat_ropa_moda'),
('sub_bodys','bodys','Bodys',3,'cat_ropa_moda'),
('sub_ropa_deportiva_mujer','ropa-deportiva-para-mujer','Ropa deportiva para mujer',4,'cat_ropa_moda'),
('sub_pantalonetas_bermudas','pantalonetas-y-bermudas','Pantalonetas y bermudas',5,'cat_ropa_moda'),
('sub_relojes','relojes','Relojes',1,'cat_accesorios_moda'),
('sub_lentes','lentes','Lentes',2,'cat_accesorios_moda'),
('sub_bolsos','bolsos','Bolsos',3,'cat_accesorios_moda'),
('sub_billeteras','billeteras','Billeteras',4,'cat_accesorios_moda'),
('sub_proteccion_motociclista','proteccion-para-motociclista','Protección para motociclista',1,'cat_accesorios_moto'),
('sub_soportes_celular_moto','soportes-para-celular','Soportes para celular',2,'cat_accesorios_moto'),
('sub_comunicacion_casco','comunicacion-para-casco','Comunicación para casco',3,'cat_accesorios_moto'),
('sub_camaras_seguridad','camaras-de-seguridad','Cámaras de seguridad',1,'cat_electronica_seguridad'),
('sub_maquinas_afeitar','maquinas-de-afeitar','Máquinas de afeitar',1,'cat_belleza_cuidado'),
('sub_encendedores_cocina','encendedores-de-cocina','Encendedores de cocina',1,'cat_hogar_cocina'),
('sub_cafe','cafe','Café',1,'cat_alimentos_bebidas');

INSERT INTO "ProductType" ("name", "sourceOrder", "subcategoryId") VALUES
('Camiseta',1,'sub_camisetas'),('Camiseta oversize',2,'sub_camisetas'),('Camiseta básica',3,'sub_camisetas'),
('Conjunto de blusa y pantalón',1,'sub_conjuntos_mujer'),('Conjunto de camiseta y bermuda',2,'sub_conjuntos_mujer'),('Conjunto con blusón',3,'sub_conjuntos_mujer'),
('Body',1,'sub_bodys'),
('Leggings',1,'sub_ropa_deportiva_mujer'),('Top deportivo',2,'sub_ropa_deportiva_mujer'),('Malla corta',3,'sub_ropa_deportiva_mujer'),('Falda short',4,'sub_ropa_deportiva_mujer'),('Camiseta deportiva',5,'sub_ropa_deportiva_mujer'),
('Pantaloneta',1,'sub_pantalonetas_bermudas'),('Bermuda',2,'sub_pantalonetas_bermudas'),
('Reloj',1,'sub_relojes'),('Lentes de moda',1,'sub_lentes'),('Lentes deportivos',2,'sub_lentes'),('Bolso',1,'sub_bolsos'),('Bolso bandolera',2,'sub_bolsos'),('Billetera',1,'sub_billeteras'),
('Pasamontañas',1,'sub_proteccion_motociclista'),('Mangas protectoras',2,'sub_proteccion_motociclista'),('Protector para calzado',3,'sub_proteccion_motociclista'),
('Soporte para celular',1,'sub_soportes_celular_moto'),('Intercomunicador',1,'sub_comunicacion_casco'),
('Cámara de seguridad',1,'sub_camaras_seguridad'),('Cámara 360',2,'sub_camaras_seguridad'),
('Máquina de afeitar',1,'sub_maquinas_afeitar'),('Encendedor para estufa',1,'sub_encendedores_cocina'),('Café',1,'sub_cafe');

CREATE INDEX "Category_version_active_visible_order_idx" ON "Category"("versionId", "active", "visible", "sortOrder");
CREATE INDEX "Subcategory_category_active_order_idx" ON "Subcategory"("categoryId", "active", "sourceOrder");
CREATE INDEX "ProductType_subcategory_active_order_idx" ON "ProductType"("subcategoryId", "active", "sourceOrder");
CREATE INDEX "Product_productTypeId_idx" ON "Product"("productTypeId");
CREATE INDEX "Product_published_productTypeId_idx" ON "Product"("published", "productTypeId");

DROP INDEX IF EXISTS "Product_categoryId_idx";
DROP INDEX IF EXISTS "Product_published_categoryId_idx";
DROP INDEX IF EXISTS "Product_related_discovery_idx";
