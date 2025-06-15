// Pagination.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./pagination";
import { useSelector } from "react-redux";

// -------------------------------------------------------------------
// MOCKING react-redux
// -------------------------------------------------------------------
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

const mockedUseSelector = useSelector as unknown as jest.Mock;

describe("Pagination Component", () => {
  // Default props for tests.
  const defaultProps = {
    totalPages: 5,
    currentPage: 2,
    elementsPerPage: 20,
    onChangePage: jest.fn(),
    onChangeElementsPerPage: jest.fn(),
  };

  beforeEach(() => {
    // Default language is set to English.
    mockedUseSelector.mockImplementation(callback =>
      callback({ language: "en" }),
    );
    jest.clearAllMocks();
  });

  test("renders localized labels in English", () => {
    render(<Pagination {...defaultProps} />);
    // The first label uses getLocalizedLabel("Show", "عرض", "Afficher")
    expect(screen.getByText("Show")).toBeInTheDocument();
    // The second label uses getLocalizedLabel("Rows", "الصفوف", "Lignes")
    expect(screen.getByText("Rows")).toBeInTheDocument();
  });

  test("renders localized labels in Arabic", () => {
    mockedUseSelector.mockImplementation(callback =>
      callback({ language: "ar" }),
    );
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText("عرض")).toBeInTheDocument();
    expect(screen.getByText("الصفوف")).toBeInTheDocument();
  });

  test("renders localized labels in French", () => {
    mockedUseSelector.mockImplementation(callback =>
      callback({ language: "fr" }),
    );
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText("Afficher")).toBeInTheDocument();
    expect(screen.getByText("Lignes")).toBeInTheDocument();
  });

  test("dropdown displays the correct elementsPerPage and calls onChangeElementsPerPage on change", () => {
    const onChangeElementsPerPage = jest.fn();
    render(
      <Pagination
        {...defaultProps}
        onChangeElementsPerPage={onChangeElementsPerPage}
      />,
    );
    // The select element is associated with the label "Show" (for English)
    const dropdown = screen.getByRole("combobox");
    expect(dropdown).toHaveValue("20");
    fireEvent.change(dropdown, { target: { value: "50" } });
    expect(onChangeElementsPerPage).toHaveBeenCalledWith(50);
  });

  test("clicking a page number button calls onChangePage with the correct index", () => {
    const onChangePage = jest.fn();
    render(
      <Pagination
        {...defaultProps}
        currentPage={2}
        onChangePage={onChangePage}
        totalPages={5}
      />,
    );
    // The page buttons are rendered with numbers starting at 1.
    // Clicking the button labeled "1" should call onChangePage with 0.
    const pageButton = screen.getByText("1");
    fireEvent.click(pageButton);
    expect(onChangePage).toHaveBeenCalledWith(0);
  });

  test("clicking the Previous button calls onChangePage with previous page number", () => {
    const onChangePage = jest.fn();
    render(
      <Pagination
        {...defaultProps}
        currentPage={2}
        onChangePage={onChangePage}
        totalPages={5}
      />,
    );
    // The component renders two button groups in its bottom section:
    // The first button in that group is the Previous button.
    const allButtons = screen.getAllByRole("button");
    const prevButton = allButtons[0];
    fireEvent.click(prevButton);
    // For currentPage 2, previous page should be 1.
    expect(onChangePage).toHaveBeenCalledWith(1);
  });

  test("clicking the Next button calls onChangePage with next page number", () => {
    const onChangePage = jest.fn();
    render(
      <Pagination
        {...defaultProps}
        currentPage={2}
        onChangePage={onChangePage}
        totalPages={5}
      />,
    );
    // When totalPages <= 5, the structure is:
    // [Previous Button] + (totalPages page buttons) + [Next Button]
    // For totalPages = 5, that makes 7 buttons in total.
    const allButtons = screen.getAllByRole("button");
    const nextButton = allButtons[allButtons.length - 1];
    fireEvent.click(nextButton);
    // For currentPage 2, next page should be 3.
    expect(onChangePage).toHaveBeenCalledWith(3);
  });

  test("Previous button is hidden when currentPage is 0", () => {
    render(<Pagination {...defaultProps} currentPage={0} totalPages={5} />);
    const allButtons = screen.getAllByRole("button");
    const prevButton = allButtons[0];
    expect(prevButton).toHaveStyle("visibility: hidden");
  });

  test("Next button is hidden when currentPage is totalPages - 1", () => {
    render(<Pagination {...defaultProps} currentPage={4} totalPages={5} />);
    const allButtons = screen.getAllByRole("button");
    // The Next button is the last button in the second group.
    const nextButton = allButtons[allButtons.length - 1];
    expect(nextButton).toHaveStyle("visibility: hidden");
  });

  test("renders ellipsis when totalPages > 5", () => {
    // With totalPages > 5 the component renders ellipsis in the page buttons.
    render(<Pagination {...defaultProps} currentPage={3} totalPages={7} />);
    // The ellipsis are rendered as spans containing "..."
    const ellipsis = screen.getAllByText("...");
    expect(ellipsis.length).toBeGreaterThan(0);
  });
});
