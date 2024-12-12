"use client";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  elementsPerPage: number;
  onChangePage: (pageNum: number) => void;
  onChangeElementsPerPage: (num: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  elementsPerPage,
  onChangePage,
  onChangeElementsPerPage,
  totalPages,
}) => {
  const numOfPages = totalPages;
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );

  const prevPage = () => {
    let prevPage = currentPage - 1;
    if (prevPage < 0) prevPage = numOfPages;
    onChangePage(prevPage);
  };

  const nextPage = () => {
    let nextPage = currentPage + 1;
    if (nextPage > numOfPages) nextPage = numOfPages;
    onChangePage(nextPage);
  };

  const addPageButton = ({
    pageNum,
    activeClass,
  }: {
    pageNum: number;
    activeClass: boolean;
  }) => (
    <button
      className="rounded-xl"
      key={pageNum}
      style={{
        padding: "0.75rem 1rem",
        fontSize: "14px",
        backgroundColor: activeClass ? "#0077cc" : "transparent",
        color: activeClass ? "#FFFFFF" : "#B2B1B4",
        border: "none",
        cursor: "pointer",
      }}
      onClick={() => onChangePage(pageNum)}
    >
      {pageNum + 1}
    </button>
  );

  const renderPageButton = () => {
    const pagesButtons: React.ReactNode[] = [];

    if (numOfPages <= 5) {
      for (let i = 0; i < numOfPages; i++) {
        pagesButtons.push(
          addPageButton({ pageNum: i, activeClass: currentPage === i }),
        );
      }
    } else {
      pagesButtons.push(
        addPageButton({ pageNum: 1, activeClass: currentPage === 1 }),
      );

      if (currentPage > 3) {
        pagesButtons.push(
          <span key="dots-1" style={{ margin: "0 0.5rem" }}>
            ...
          </span>,
        );
      }

      if (currentPage > 2 && currentPage < numOfPages - 1) {
        pagesButtons.push(
          addPageButton({ pageNum: currentPage - 1, activeClass: false }),
        );
      }

      if (currentPage !== 1 && currentPage !== numOfPages) {
        pagesButtons.push(
          addPageButton({ pageNum: currentPage, activeClass: true }),
        );
      }

      if (currentPage < numOfPages - 1) {
        pagesButtons.push(
          addPageButton({ pageNum: currentPage + 1, activeClass: false }),
        );
      }

      if (currentPage < numOfPages - 2) {
        pagesButtons.push(
          <span key="dots-2" style={{ margin: "0 0.5rem" }}>
            ...
          </span>,
        );
      }

      pagesButtons.push(
        addPageButton({
          pageNum: numOfPages,
          activeClass: currentPage === numOfPages,
        }),
      );
    }

    return pagesButtons;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 1.5rem",
        color: "#1A202C",
      }}
      className="mt-4 rounded-lg bg-thead"
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        className="font-semibold"
      >
        <label
          htmlFor="elementsPerPage"
          className="text-textPrimary"
          style={{ fontSize: "14px" }}
        >
          {currentLanguage === "en"
            ? "Show"
            : currentLanguage === "ar"
              ? "عرض"
              : currentLanguage === "fr"
                ? "Afficher"
                : "Show"}
        </label>
        <select
          id="elementsPerPage"
          style={{
            padding: "0.75rem",
            outline: "none",
          }}
          className="rounded-xl border-borderPrimary text-textPrimary"
          value={elementsPerPage}
          onChange={e => onChangeElementsPerPage(Number(e.target.value))}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <label
          htmlFor="elementsPerPage"
          className="text-textPrimary"
          style={{ fontSize: "14px" }}
        >
          {currentLanguage === "en"
            ? "Rows"
            : currentLanguage === "ar"
              ? "الصفوف"
              : currentLanguage === "fr"
                ? "Lignes"
                : "Rows"}
        </label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button
          style={{
            visibility: currentPage === 0 ? "hidden" : "visible",
            border: "none",
            cursor: "pointer",
          }}
          onClick={prevPage}
          className="rounded-lg bg-bgSecondary px-3 py-2"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="#0077cc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {renderPageButton()}
        <button
          style={{
            visibility: currentPage === numOfPages ? "hidden" : "visible",
            border: "none",
            cursor: "pointer",
          }}
          onClick={nextPage}
          className="rounded-lg bg-bgSecondary px-3 py-2"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="#0077cc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
