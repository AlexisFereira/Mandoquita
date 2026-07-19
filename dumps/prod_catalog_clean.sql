--
-- PostgreSQL database dump

\restrict aOqwTFZq2dHgUHNBzejIz4NBOVHGMyMKXI4bQXB2dXtg6A70LhE0BhA3ZMguwKt
-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14 (Homebrew)
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
-- Data for Name: TaxonomyVersion; Type: TABLE DATA; Schema: public; Owner: -
INSERT INTO public."TaxonomyVersion" VALUES ('taxonomy_es_1_0_0', '1.0.0', 'es', 'ACTIVE', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: -
INSERT INTO public."Category" VALUES ('cat_ropa_moda', 'ropa-y-moda', 'Ropa y moda', 'Prendas de vestir para mujer, hombre y público unisex.', 3, true, true, 'taxonomy_es_1_0_0', '2026-07-13 08:38:21.176', '2026-07-16 02:44:32.942', '/images/categories/ropa-y-moda.png', 'Prendas casuales y deportivas en tonos cálidos.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public."Category" VALUES ('cat_accesorios_moto', 'accesorios-para-moto', 'Accesorios para moto', 'Accesorios de protección, soporte y comunicación para motociclistas.', 5, true, true, 'taxonomy_es_1_0_0', '2026-07-13 08:38:21.176', '2026-07-16 02:44:33.209', '/images/categories/accesorios-para-moto.png', 'Soporte para celular, intercomunicador y accesorios de protección para moto.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public."Category" VALUES ('cat_electronica_seguridad', 'electronica-y-seguridad', 'Electrónica y seguridad', 'Dispositivos electrónicos para seguridad y vigilancia.', 6, true, true, 'taxonomy_es_1_0_0', '2026-07-13 08:38:21.176', '2026-07-16 02:44:33.311', '/images/categories/electronica-y-seguridad.png', 'Cámaras de seguridad compactas para vigilancia.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public."Category" VALUES ('cat_belleza_cuidado', 'belleza-y-cuidado-personal', 'Belleza y cuidado personal', 'Productos y equipos para higiene, belleza y cuidado personal.', 7, true, true, 'taxonomy_es_1_0_0', '2026-07-13 08:38:21.176', '2026-07-16 02:44:33.413', '/images/categories/belleza-y-cuidado-personal.png', 'Máquina de afeitar y elementos de cuidado personal.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public."Category" VALUES ('8c3cfffa-019b-4c3d-b5bd-82e0cb64408c', 'camisas-estampada', 'Camisas Estampadas', 'La sofisticación se encuentra con el diseño en nuestra línea de camisas con estampados exclusivos. Detalles sutiles y patrones modernos que elevan cualquier look casual o semi-formal. Prendas versátiles, ligeras y de alta calidad diseñadas para el hombre y la mujer actual', 1, true, true, 'taxonomy_es_1_0_0', '2026-07-16 02:44:21.223', '2026-07-16 02:46:26.351', 'https://d139alfkeie86e.cloudfront.net/images/categories/2026/07/38637766-2e38-4276-9337-c0c7df25922e.png', 'estampadas', 'images/categories/2026/07/38637766-2e38-4276-9337-c0c7df25922e.png', 'image/png', 880, 1210, 1931844, '6a14e23f6a4a6b91a70cf5b7f6576782f4e1e7868cd35662fcdfb7795b61bdaa', NULL, NULL);
INSERT INTO public."Category" VALUES ('ebf610f9-6f8c-42c8-8e50-a984943adb3b', 'combitos', 'Combos', 'Combinar siempre conviene. Nuestros combos están pensados para que te lleves más por menos: agrupamos productos complementarios con descuentos exclusivos que no vas a encontrar comprándolos por separado', 2, true, true, 'taxonomy_es_1_0_0', '2026-07-14 09:03:52.796', '2026-07-16 02:44:32.849', 'https://d139alfkeie86e.cloudfront.net/images/categories/2026/07/e45d99b8-ac31-45b6-ad1d-a5968dce4e05.png', 'combitos', 'images/categories/2026/07/e45d99b8-ac31-45b6-ad1d-a5968dce4e05.png', 'image/png', 1254, 1254, 3013260, '38ff599381d280d46ee88c7c81d52076ca2dd8ce93011936870cd1cf2012d0f5', NULL, NULL);
INSERT INTO public."Category" VALUES ('cat_accesorios_moda', 'accesorios-de-moda', 'Accesorios de moda', 'Complementos personales y accesorios para vestir.', 4, true, true, 'taxonomy_es_1_0_0', '2026-07-13 08:38:21.176', '2026-07-16 02:44:33.102', 'https://d139alfkeie86e.cloudfront.net/images/categories/2026/07/244df5fd-f502-49b2-98db-539c2c8e9285.png', 'Reloj, lentes, bolso y billetera de estilo contemporáneo.', 'images/categories/2026/07/244df5fd-f502-49b2-98db-539c2c8e9285.png', 'image/png', 1254, 1254, 2004253, '948ce5f29fe7b461851e6bc25d1031a2f485aee3dc71c7ba722a1923c96688c6', NULL, NULL);
INSERT INTO public."Category" VALUES ('cat_hogar_cocina', 'hogar-y-cocina', 'Hogar y cocina', 'Artículos prácticos para el hogar y la cocina.', 8, true, true, 'taxonomy_es_1_0_0', '2026-07-13 08:38:21.176', '2026-07-16 02:44:33.505', '/images/categories/hogar-y-cocina.png', 'Encendedor largo para estufa en una cocina cálida.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public."Category" VALUES ('cat_alimentos_bebidas', 'alimentos-y-bebidas', 'Alimentos y bebidas', 'Productos alimenticios y bebidas empacadas.', 9, true, true, 'taxonomy_es_1_0_0', '2026-07-13 08:38:21.176', '2026-07-16 02:44:33.624', '/images/categories/alimentos-y-bebidas.png', 'Café tostado servido junto a granos y un empaque neutro.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
-- Data for Name: CategorySlugAlias; Type: TABLE DATA; Schema: public; Owner: -
-- Data for Name: Subcategory; Type: TABLE DATA; Schema: public; Owner: -
INSERT INTO public."Subcategory" VALUES ('sub_camisetas', 'camisetas', 'Camisetas', 1, true, 'cat_ropa_moda', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."Subcategory" VALUES ('sub_conjuntos_mujer', 'conjuntos-para-mujer', 'Conjuntos para mujer', 2, true, 'cat_ropa_moda', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."Subcategory" VALUES ('sub_bodys', 'bodys', 'Bodys', 3, true, 'cat_ropa_moda', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."Subcategory" VALUES ('sub_ropa_deportiva_mujer', 'ropa-deportiva-para-mujer', 'Ropa deportiva para mujer', 4, true, 'cat_ropa_moda', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."Subcategory" VALUES ('sub_pantalonetas_bermudas', 'pantalonetas-y-bermudas', 'Pantalonetas y bermudas', 5, true, 'cat_ropa_moda', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."Subcategory" VALUES ('sub_relojes', 'relojes', 'Relojes', 1, true, 'cat_accesorios_moda', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."Subcategory" VALUES ('sub_lentes', 'lentes', 'Lentes', 2, true, 'cat_accesorios_moda', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."Subcategory" VALUES ('sub_bolsos', 'bolsos', 'Bolsos', 3, true, 'cat_accesorios_moda', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."Subcategory" VALUES ('sub_billeteras', 'billeteras', 'Billeteras', 4, true, 'cat_accesorios_moda', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."Subcategory" VALUES ('sub_proteccion_motociclista', 'proteccion-para-motociclista', 'Protección para motociclista', 1, true, 'cat_accesorios_moto', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."Subcategory" VALUES ('sub_soportes_celular_moto', 'soportes-para-celular', 'Soportes para celular', 2, true, 'cat_accesorios_moto', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."Subcategory" VALUES ('sub_comunicacion_casco', 'comunicacion-para-casco', 'Comunicación para casco', 3, true, 'cat_accesorios_moto', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."Subcategory" VALUES ('sub_camaras_seguridad', 'camaras-de-seguridad', 'Cámaras de seguridad', 1, true, 'cat_electronica_seguridad', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."Subcategory" VALUES ('sub_maquinas_afeitar', 'maquinas-de-afeitar', 'Máquinas de afeitar', 1, true, 'cat_belleza_cuidado', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."Subcategory" VALUES ('sub_encendedores_cocina', 'encendedores-de-cocina', 'Encendedores de cocina', 1, true, 'cat_hogar_cocina', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."Subcategory" VALUES ('sub_cafe', 'cafe', 'Café', 1, true, 'cat_alimentos_bebidas', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
-- Data for Name: ProductType; Type: TABLE DATA; Schema: public; Owner: -
INSERT INTO public."ProductType" VALUES ('Camiseta', 1, true, 'sub_camisetas', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Camiseta oversize', 2, true, 'sub_camisetas', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Camiseta básica', 3, true, 'sub_camisetas', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Conjunto de blusa y pantalón', 1, true, 'sub_conjuntos_mujer', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Conjunto de camiseta y bermuda', 2, true, 'sub_conjuntos_mujer', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Conjunto con blusón', 3, true, 'sub_conjuntos_mujer', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Body', 1, true, 'sub_bodys', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Leggings', 1, true, 'sub_ropa_deportiva_mujer', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Top deportivo', 2, true, 'sub_ropa_deportiva_mujer', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Malla corta', 3, true, 'sub_ropa_deportiva_mujer', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Falda short', 4, true, 'sub_ropa_deportiva_mujer', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Camiseta deportiva', 5, true, 'sub_ropa_deportiva_mujer', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Pantaloneta', 1, true, 'sub_pantalonetas_bermudas', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Bermuda', 2, true, 'sub_pantalonetas_bermudas', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Reloj', 1, true, 'sub_relojes', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Lentes de moda', 1, true, 'sub_lentes', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Lentes deportivos', 2, true, 'sub_lentes', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Bolso', 1, true, 'sub_bolsos', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Bolso bandolera', 2, true, 'sub_bolsos', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Billetera', 1, true, 'sub_billeteras', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Pasamontañas', 1, true, 'sub_proteccion_motociclista', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Mangas protectoras', 2, true, 'sub_proteccion_motociclista', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Protector para calzado', 3, true, 'sub_proteccion_motociclista', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Soporte para celular', 1, true, 'sub_soportes_celular_moto', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Intercomunicador', 1, true, 'sub_comunicacion_casco', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Cámara de seguridad', 1, true, 'sub_camaras_seguridad', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Cámara 360', 2, true, 'sub_camaras_seguridad', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Máquina de afeitar', 1, true, 'sub_maquinas_afeitar', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Encendedor para estufa', 1, true, 'sub_encendedores_cocina', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
INSERT INTO public."ProductType" VALUES ('Café', 1, true, 'sub_cafe', '2026-07-13 08:38:21.176', '2026-07-13 08:38:21.176');
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: -
-- Data for Name: ProductImage; Type: TABLE DATA; Schema: public; Owner: -
-- Data for Name: ProductSlugAlias; Type: TABLE DATA; Schema: public; Owner: -
INSERT INTO public."ProductSlugAlias" VALUES ('splahes', 220126, '2026-07-16 02:48:21.941');
INSERT INTO public."ProductSlugAlias" VALUES ('leggings-para-mujer-1041', 200011, '2026-07-16 03:03:39.155');
-- Data for Name: ProductTag; Type: TABLE DATA; Schema: public; Owner: -
-- Data for Name: ProductVariant; Type: TABLE DATA; Schema: public; Owner: -
-- Data for Name: VariantAttribute; Type: TABLE DATA; Schema: public; Owner: -
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
SELECT pg_catalog.setval('public."Product_id_seq"', 220133, true);
-- PostgreSQL database dump complete
\unrestrict aOqwTFZq2dHgUHNBzejIz4NBOVHGMyMKXI4bQXB2dXtg6A70LhE0BhA3ZMguwKt
