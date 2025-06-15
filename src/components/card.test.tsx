// card.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Card from "./card";
import { useSelector } from "react-redux";

// Mock the react-redux module to control the language state.
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

// Cast useSelector to a Jest mock function.
const mockedUseSelector = useSelector as unknown as jest.Mock;

describe("Card Component", () => {
  // By default, set the language to "en" (LTR)
  beforeEach(() => {
    mockedUseSelector.mockImplementation((callback: any) =>
      callback({ language: "en" }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders card with image when imgSrc is provided", () => {
    render(
      <Card
        href="/test"
        title="Test Card"
        description="Test description"
        imgSrc="test-image.jpg"
      />,
    );

    // The container element (parent of the link) should have "dir" set to "ltr"
    const container = screen.getByRole("link").parentElement;
    expect(container).toHaveAttribute("dir", "ltr");

    // Verify that the link has the correct href.
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/test");

    // Check that the image is rendered with the correct src and alt attributes.
    const image = screen.getByAltText("Test Card");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "test-image.jpg");

    // Verify that the title and description texts are present.
    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  test("renders card with icon when imgSrc is not provided", () => {
    // Override the language to "ar" (RTL)
    mockedUseSelector.mockImplementation((callback: any) =>
      callback({ language: "ar" }),
    );

    render(
      <Card
        href="/test"
        title="Test Card"
        description="Test description"
        // Pass an icon as a ReactNode (a simple span with a test id)
        icon={<span data-testid="icon">Icon</span>}
      />,
    );

    // The container element should now have "dir" set to "rtl"
    const container = screen.getByRole("link").parentElement;
    expect(container).toHaveAttribute("dir", "rtl");

    // Verify the link's href.
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/test");

    // Check that the icon is rendered.
    expect(screen.getByTestId("icon")).toBeInTheDocument();

    // Verify that the title and description texts are rendered.
    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });
});
