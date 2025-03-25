// TimePicker.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TimePicker from "./TimePacker";

describe("TimePicker Component", () => {
  beforeEach(() => {
    render(<TimePicker />);
  });

  test("renders with default time 08:00 and AM active", () => {
    // Check that the hour and minute inputs show the default values.
    const hourInput = screen.getByDisplayValue("08") as HTMLInputElement;
    const minuteInput = screen.getByDisplayValue("00") as HTMLInputElement;
    expect(hourInput).toBeInTheDocument();
    expect(minuteInput).toBeInTheDocument();

    // Check the default state of AM/PM buttons.
    const amButton = screen.getByText("AM");
    const pmButton = screen.getByText("PM");
    // When isAM is true, the AM button should have the active styling.
    expect(amButton).toHaveClass("bg-blue-500");
    expect(pmButton).toHaveClass("bg-primary-dark");
  });

  test("updates hour input on manual change and wraps correctly", () => {
    const hourInput = screen.getByDisplayValue("08") as HTMLInputElement;

    // Simulate entering a value greater than 12. For example, "13" should wrap to "01".
    fireEvent.change(hourInput, { target: { value: "13" } });
    expect(hourInput.value).toBe("01");

    // Simulate entering a value less than 1. For example, "0" should wrap to "12".
    fireEvent.change(hourInput, { target: { value: "0" } });
    expect(hourInput.value).toBe("12");
  });

  test("updates minute input on manual change and wraps correctly", () => {
    const minuteInput = screen.getByDisplayValue("00") as HTMLInputElement;

    // Simulate entering a value greater than 59. For example, "60" should wrap to "00".
    fireEvent.change(minuteInput, { target: { value: "60" } });
    expect(minuteInput.value).toBe("00");

    // Simulate entering a value less than 0. For example, "-1" should wrap to "59".
    fireEvent.change(minuteInput, { target: { value: "-1" } });
    expect(minuteInput.value).toBe("59");
  });

  test("handles wheel event on hour input to increment and decrement hour", () => {
    const hourInput = screen.getByDisplayValue("08") as HTMLInputElement;

    // Scroll upward (deltaY negative) to increase the hour from 8 to 9.
    fireEvent.wheel(hourInput, { deltaY: -100 });
    expect(hourInput.value).toBe("09");

    // Scroll downward (deltaY positive) to decrease the hour from 9 back to 8.
    fireEvent.wheel(hourInput, { deltaY: 100 });
    expect(hourInput.value).toBe("08");
  });

  test("handles wheel event on minute input to increment and decrement minute", () => {
    const minuteInput = screen.getByDisplayValue("00") as HTMLInputElement;

    // Scroll upward (deltaY negative) to increase the minute from 0 to 1.
    fireEvent.wheel(minuteInput, { deltaY: -100 });
    expect(minuteInput.value).toBe("01");

    // Scroll downward (deltaY positive) to decrease the minute from 1 back to 0.
    fireEvent.wheel(minuteInput, { deltaY: 100 });
    expect(minuteInput.value).toBe("00");
  });

  test("toggles AM/PM when clicking on the toggle buttons", () => {
    const amButton = screen.getByText("AM");
    const pmButton = screen.getByText("PM");

    // Initially, isAM is true so the AM button is active.
    expect(amButton).toHaveClass("bg-blue-500");
    expect(pmButton).toHaveClass("bg-primary-dark");

    // Clicking either button toggles the state. Click the AM button.
    fireEvent.click(amButton);
    // After toggle, isAM should become false; PM button becomes active.
    expect(pmButton).toHaveClass("bg-blue-500");
    expect(amButton).toHaveClass("bg-primary-dark");

    // Click the PM button to toggle back.
    fireEvent.click(pmButton);
    expect(amButton).toHaveClass("bg-blue-500");
    expect(pmButton).toHaveClass("bg-primary-dark");
  });
});
