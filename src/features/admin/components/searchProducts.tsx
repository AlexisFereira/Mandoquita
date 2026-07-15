import React from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Icon } from "../../../components/Icon";

const SearchProducts: React.FC<{
  q: string;
  setQ: (q: string) => void;
  retired: boolean;
  setRetired: (retired: boolean) => void;
  setPage: (page: number) => void;
  load: () => Promise<void>;
}> = ({ q, setQ, retired, setRetired, setPage, load }) => {
  return (
    <form
      className="flex flex-wrap items-start gap-3 justify-end items-center"
      onSubmit={(e) => {
        e.preventDefault();
        setPage(1);
        void load();
      }}
    >
      <div className="flex flex-wrap gap-3 justify-end items-center ">
        <div className="flex gap-3">
          <Input
            label=""
            id="product-search"
            placeholder="Buscar por nombre o slug"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="min-w-[240px] flex-1 mb-0"
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={retired}
            onChange={(e) => {
              setRetired(e.target.checked);
              setPage(1);
            }}
          />
          Mostrar retirados
        </label>
        <Button size="sm" type="submit">
          <Icon name="search" />
        </Button>
      </div>
    </form>
  );
};

export default SearchProducts;
