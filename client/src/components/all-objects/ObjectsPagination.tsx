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
            onClick={() => {
              onPageChange(Math.max(1, currentPage - 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`min-w-25 py-2 px-4 rounded-lg text-sm font-medium transition ${
              currentPage === 1
                ? "opacity-50 pointer-events-none bg-gray-100 text-gray-400!"
                : "bg-white border hover:bg-gray-50 text-gray-700!"
            }`}
          >
            ← Prethodna
          </PaginationLink>
        </PaginationItem>

        {getPages().map((p, i) =>
          p === "ellipsis" ? (
            <PaginationItem key={`e-${i}`}>
              <PaginationEllipsis className="px-2 text-gray-400!" />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                onClick={() => {
                  onPageChange(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`min-w-10 py-2 px-4 rounded-lg text-sm font-medium transition ${
                  p === currentPage
                    ? "bg-[#5c5c99] text-white! shadow-md"
                    : "bg-white border hover:bg-gray-50! text-gray-700!"
                }`}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationLink
            onClick={() => {
              onPageChange(Math.min(totalPages, currentPage + 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`min-w-25 py-2 px-4 rounded-lg text-sm font-medium transition ${
              currentPage === totalPages
                ? "opacity-50 pointer-events-none bg-gray-100 text-gray-400!"
                : "bg-white border hover:bg-gray-50 text-gray-700!"
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
