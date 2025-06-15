// Calendar.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Calendar from "./calendar";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

// Mock react-redux's useSelector hook.
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

// Create a helper variable for the mocked useSelector.
const mockedUseSelector = useSelector as unknown as jest.Mock;

describe("Calendar Component", () => {
  beforeEach(() => {
    // By default, set the language to English.
    mockedUseSelector.mockImplementation(callback =>
      callback({ language: "en" }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders Calendar with current month header and day names in English", () => {
    render(<Calendar />);

    // Compute expected month and year header.
    const currentDate = new Date();
    const expectedMonthYear = format(currentDate, "LLLL yyyy", {
      locale: enUS,
    });

    // The header is rendered as an h2 element with aria-live attribute.
    const header = screen.getByRole("heading", { level: 2 });
    expect(header).toHaveTextContent(expectedMonthYear);

    // Check that the day names are rendered in English.
    expect(screen.getByText("SUN")).toBeInTheDocument();
    expect(screen.getByText("MON")).toBeInTheDocument();
    expect(screen.getByText("TUE")).toBeInTheDocument();
    expect(screen.getByText("WED")).toBeInTheDocument();
    expect(screen.getByText("THU")).toBeInTheDocument();
    expect(screen.getByText("FRI")).toBeInTheDocument();
    expect(screen.getByText("SAT")).toBeInTheDocument();
  });

  test("clicking the Next Month button updates the header", () => {
    render(<Calendar />);
    const header = screen.getByRole("heading", { level: 2 });

    // Compute expected header for the next month.
    const currentDate = new Date();
    const nextMonthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    );
    const expectedNextMonthYear = format(nextMonthDate, "LLLL yyyy", {
      locale: enUS,
    });

    // Click the "Next month" button.
    const nextButton = screen.getByRole("button", { name: /next month/i });
    fireEvent.click(nextButton);

    expect(header).toHaveTextContent(expectedNextMonthYear);
  });

  test("clicking the Previous Month button updates the header", () => {
    render(<Calendar />);
    const header = screen.getByRole("heading", { level: 2 });

    // Compute expected header for the previous month.
    const currentDate = new Date();
    const prevMonthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );
    const expectedPrevMonthYear = format(prevMonthDate, "LLLL yyyy", {
      locale: enUS,
    });

    // Click the "Previous month" button.
    const prevButton = screen.getByRole("button", { name: /previous month/i });
    fireEvent.click(prevButton);

    expect(header).toHaveTextContent(expectedPrevMonthYear);
  });

  test("clicking on a day cell updates the selected date", () => {
    render(<Calendar />);
    // Find a clickable day cell (we choose the cell that displays "1").
    // (Note: there might be multiple gridcells, so we filter for those that are clickable.)
    const dayCells = screen.getAllByRole("gridcell");
    const clickableCells = dayCells.filter(
      cell =>
        cell.getAttribute("tabIndex") === "0" &&
        cell.textContent?.trim() === "1",
    );

    if (clickableCells.length === 0) {
      throw new Error("No clickable day cell with text '1' found");
    }

    const dayCell = clickableCells[0];
    fireEvent.click(dayCell);

    // After clicking, the cell should be marked as selected.
    // In our component, the selected cell gets "bg-primary" and "text-white" classes.
    expect(dayCell.className).toMatch(/bg-primary/);
    expect(dayCell.className).toMatch(/text-white/);
  });

  test("renders day names in Arabic when language is set to 'ar'", () => {
    // Override the Redux state to set language to Arabic.
    mockedUseSelector.mockImplementation(callback =>
      callback({ language: "ar" }),
    );

    render(<Calendar />);

    // Check that the Arabic day names are rendered.
    expect(screen.getByText("الأحد")).toBeInTheDocument();
    expect(screen.getByText("الإثنين")).toBeInTheDocument();
    expect(screen.getByText("الثلاثاء")).toBeInTheDocument();
    expect(screen.getByText("الأربعاء")).toBeInTheDocument();
    expect(screen.getByText("الخميس")).toBeInTheDocument();
    expect(screen.getByText("الجمعة")).toBeInTheDocument();
    expect(screen.getByText("السبت")).toBeInTheDocument();
  });
});
