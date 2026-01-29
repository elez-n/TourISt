import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ObjectsPagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  const getPages = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) pages.push("ellipsis");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("ellipsis");

    pages.push(totalPages);

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent className="flex justify-center items-center gap-2 flex-wrap">
        <PaginationItem>
          <PaginationLink
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={`min-w-25 py-2 px-3 border rounded text-sm text-gray-700 ${
              currentPage === 1 ? "opacity-50 pointer-events-none" : "hover:bg-gray-100"
            }`}
          >
            ← Prethodna
          </PaginationLink>
        </PaginationItem>

        {getPages().map((p, i) =>
          p === "ellipsis" ? (
            <PaginationItem key={`e-${i}`}>
              <PaginationEllipsis className="px-2 text-gray-500" />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                onClick={() => onPageChange(p)}
                className={`min-w-10 py-2 px-3 border rounded text-sm text-gray-700 ${
                  p === currentPage
                    ? "bg-blue-500 text-white border-blue-500"
                    : "hover:bg-gray-100"
                }`}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationLink
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={`min-w-25 py-2 px-3 border rounded text-sm text-gray-700 ${
              currentPage === totalPages ? "opacity-50 pointer-events-none" : "hover:bg-gray-100"
            }`}
          >
            Sljedeća →
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ObjectsPagination;
