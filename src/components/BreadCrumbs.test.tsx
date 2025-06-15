// BreadCrumbs.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BreadCrumbs from "./BreadCrumbs";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

// --- Mocks ---

// Mock react-redux's useSelector.
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

// Mock next/navigation's usePathname.
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock react-icons/md so that we can easily test which icon is rendered.
jest.mock("react-icons/md", () => ({
  MdNavigateBefore: (props: any) => <span data-testid="navigate-before" />,
  MdNavigateNext: (props: any) => <span data-testid="navigate-next" />,
}));

// Create helper variables for our mocks.
const mockedUseSelector = useSelector as unknown as jest.Mock;
const mockedUsePathname = usePathname as jest.Mock;

describe("BreadCrumbs Component", () => {
  // Sample breadcrumbs data.
  const breadcrumbs = [
    {
      nameEn: "Home",
      nameAr: "الرئيسية",
      nameFr: "Accueil",
      href: "/home",
    },
    {
      nameEn: "About",
      nameAr: "حول",
      nameFr: "À propos",
      href: "/about",
    },
  ];

  // Clean up mocks after each test.
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders breadcrumbs in English with active link styling", () => {
    // Set up Redux state: boolean.value is true and language is 'en'
    mockedUseSelector.mockImplementation(callback =>
      callback({
        boolean: { value: true },
        language: { language: "en" },
      }),
    );
    // Set the current pathname so that the first breadcrumb ("/home") is active.
    mockedUsePathname.mockReturnValue("/home");

    render(<BreadCrumbs breadcrumbs={breadcrumbs} />);

    // The container should have a 'ltr' direction and the appropriate margin class for English.
    const container = screen.getByText("Home").closest("div");
    expect(container).toHaveAttribute("dir", "ltr");
    expect(container?.className).toContain("lg:ml-[100px]");

    // Verify that the links are rendered with the correct English texts.
    const homeLink = screen.getByRole("link", { name: "Home" });
    const aboutLink = screen.getByRole("link", { name: "About" });
    expect(homeLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();

    // The active link ("/home") should have active styling.
    expect(homeLink.className).toContain("border-b-2");
    expect(homeLink.className).toContain("border-primary");
    expect(homeLink.className).toContain("text-primary");

    // The inactive link should not have the active classes.
    expect(aboutLink.className).not.toContain("border-b-2");

    // For English, the arrow icon should be the "next" arrow.
    const nextIcon = screen.getByTestId("navigate-next");
    expect(nextIcon).toBeInTheDocument();

    // With two breadcrumbs, only one arrow should appear.
    const arrowIcons = screen.getAllByTestId("navigate-next");
    expect(arrowIcons.length).toBe(1);
  });

  test("renders breadcrumbs in Arabic with active link styling", () => {
    // Set up Redux state: boolean.value is false and language is 'ar'
    mockedUseSelector.mockImplementation(callback =>
      callback({
        boolean: { value: false },
        language: { language: "ar" },
      }),
    );
    // Set the current pathname so that the second breadcrumb ("/about") is active.
    mockedUsePathname.mockReturnValue("/about");

    render(<BreadCrumbs breadcrumbs={breadcrumbs} />);

    // The container should have a 'rtl' direction and the appropriate margin class for Arabic.
    const container = screen.getByText("الرئيسية").closest("div");
    expect(container).toHaveAttribute("dir", "rtl");
    expect(container?.className).toContain("lg:mr-[270px]");

    // Verify that the links are rendered with the correct Arabic texts.
    const homeLink = screen.getByRole("link", { name: "الرئيسية" });
    const aboutLink = screen.getByRole("link", { name: "حول" });
    expect(homeLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();

    // The active link ("/about") should have active styling.
    expect(aboutLink.className).toContain("border-b-2");
    expect(aboutLink.className).toContain("border-primary");
    expect(aboutLink.className).toContain("text-primary");

    // The inactive link should not have active styling.
    expect(homeLink.className).not.toContain("border-b-2");

    // For Arabic, the arrow icon should be the "before" arrow.
    const beforeIcon = screen.getByTestId("navigate-before");
    expect(beforeIcon).toBeInTheDocument();

    // Ensure only one arrow icon is rendered.
    const arrowIcons = screen.getAllByTestId("navigate-before");
    expect(arrowIcons.length).toBe(1);
  });

  test("renders breadcrumbs in French", () => {
    // Set up Redux state: boolean.value is true and language is 'fr'
    mockedUseSelector.mockImplementation(callback =>
      callback({
        boolean: { value: true },
        language: { language: "fr" },
      }),
    );
    // Set the current pathname so that the second breadcrumb ("/about") is active.
    mockedUsePathname.mockReturnValue("/about");

    render(<BreadCrumbs breadcrumbs={breadcrumbs} />);

    // For French, the links should display the French names.
    const homeLink = screen.getByRole("link", { name: "Accueil" });
    const aboutLink = screen.getByRole("link", { name: "À propos" });
    expect(homeLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();

    // The active link should have active styling.
    expect(aboutLink.className).toContain("border-b-2");

    // Since the language is not Arabic, the container should use "ltr" direction.
    const container = screen.getByText("Accueil").closest("div");
    expect(container).toHaveAttribute("dir", "ltr");
  });
});
