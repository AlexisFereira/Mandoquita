-- DTE-013/015: accelerate case-insensitive partial matching across the approved
-- public Product fields. No operational or Variant identifier is indexed for Search.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "Product_search_name_trgm_idx"
  ON "Product" USING GIN ("name" gin_trgm_ops);
CREATE INDEX "Product_search_short_description_trgm_idx"
  ON "Product" USING GIN ("shortDescription" gin_trgm_ops);
CREATE INDEX "Product_search_description_trgm_idx"
  ON "Product" USING GIN ("description" gin_trgm_ops);
CREATE INDEX "Product_search_brand_trgm_idx"
  ON "Product" USING GIN ("brand" gin_trgm_ops);
CREATE INDEX "Product_search_collection_trgm_idx"
  ON "Product" USING GIN ("collection" gin_trgm_ops);
CREATE INDEX "ProductTag_search_value_trgm_idx"
  ON "ProductTag" USING GIN ("value" gin_trgm_ops);
