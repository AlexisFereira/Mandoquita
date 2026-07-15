import { Button } from "@/components";
import { Icon } from "@/components";

const Pagination: React.FC<{
  page: number;
  setPage: (page: number) => void;
  data: {
    metadata: {
      page: number;
      totalPages: number;
    };
  };
}> = ({ page, setPage, data }) => {
  return (
    <nav
      aria-label="Paginación de productos"
      className="flex items-center gap-3"
    >
      <Button
        size="sm"
        variant="secondary"
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
      >
        <Icon name="previous" />
      </Button>
      <span aria-current="page">
        Pág. {data.metadata.page} de {data.metadata.totalPages}
      </span>
      <Button
        size="sm"
        variant="secondary"
        disabled={page >= data.metadata.totalPages}
        onClick={() => setPage(page + 1)}
      >
        <Icon name="next" />
      </Button>
    </nav>
  );
};

export default Pagination;
