// Sheet.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Sheet from "./sheet";

describe("Sheet Component", () => {
  const onClose = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  test("does not appear visible when isOpen is false", () => {
    const { container, queryByText } = render(
      <Sheet isOpen={false} onClose={onClose}>
        <div>Sheet Content</div>
      </Sheet>,
    );

    // The outer container (backdrop) should have classes that hide it.
    const backdrop = container.firstChild;
    expect(backdrop).toHaveClass("opacity-0");
    expect(backdrop).toHaveClass("pointer-events-none");

    // The children should not be accessible (since the sheet is hidden).
    expect(queryByText("Sheet Content")).not.toBeInTheDocument();
  });

  test("renders children when isOpen is true", () => {
    const { getByText, container } = render(
      <Sheet isOpen={true} onClose={onClose}>
        <div>Sheet Content</div>
      </Sheet>,
    );

    // The backdrop should have the visible classes.
    const backdrop = container.firstChild;
    expect(backdrop).toHaveClass("opacity-100");
    // And the inner sheet should be translated into view.
    const sheetContent = container.querySelector(".translate-x-0");
    expect(sheetContent).toBeInTheDocument();

    // The children are rendered.
    expect(getByText("Sheet Content")).toBeInTheDocument();
  });

  test("calls onClose when the backdrop is clicked", () => {
    const { container } = render(
      <Sheet isOpen={true} onClose={onClose}>
        <div>Sheet Content</div>
      </Sheet>,
    );

    // The backdrop is the outermost element.
    const backdrop = container.firstChild;
    if (backdrop) {
      fireEvent.click(backdrop);
    }
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("does not call onClose when clicking inside the sheet content", () => {
    const { container } = render(
      <Sheet isOpen={true} onClose={onClose}>
        <div>Sheet Content</div>
      </Sheet>,
    );

    // The inner sheet content has a translation class when open.
    const sheetContent = container.querySelector(".translate-x-0");
    if (sheetContent) {
      fireEvent.click(sheetContent);
    }
    // onClose should not be triggered when clicking inside.
    expect(onClose).not.toHaveBeenCalled();
  });

  test("calls onClose when the close button is clicked", () => {
    const { getByText } = render(
      <Sheet isOpen={true} onClose={onClose}>
        <div>Sheet Content</div>
      </Sheet>,
    );

    // The close button is rendered with the text "✕".
    const closeButton = getByText("✕");
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
