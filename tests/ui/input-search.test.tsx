import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Input, SearchInput } from "../../src/components";

afterEach(() => {
  cleanup();
});

describe("Input", () => {
  it("renders a labeled input with helper and error states", () => {
    render(
      <Input
        label="Email"
        placeholder="name@example.com"
        helperText="We will not share your email."
        errorText="Enter a valid email address"
        invalid
      />,
    );

    const input = screen.getByLabelText("Email");

    expect(input.getAttribute("placeholder")).toBe("name@example.com");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText("Enter a valid email address")).toBeTruthy();
  });

  it("supports success messaging", () => {
    render(<Input label="Code" success successText="Looks good" />);

    expect(screen.getByText("Looks good")).toBeTruthy();
  });
});

describe("SearchInput", () => {
  it("submits the current query and clears it", () => {
    const onSearch = vi.fn();
    const onClear = vi.fn();

    render(
      <SearchInput
        onSearch={onSearch}
        onClear={onClear}
        defaultValue="chairs"
      />,
    );

    const input = screen.getByLabelText("Search products");
    expect(input.getAttribute("value")).toBe("chairs");

    fireEvent.submit(input.closest("form") as HTMLFormElement);

    expect(onSearch).toHaveBeenCalledWith("chairs");

    const clearButton = screen.getByRole("button", { name: "Clear search" });
    expect(clearButton.className).toContain("min-h-11");
    expect(clearButton.className).toContain("min-w-11");
    expect(input.className).toContain("pr-16");

    fireEvent.click(clearButton);

    expect(onClear).toHaveBeenCalledTimes(1);
    expect(
      (screen.getByLabelText("Search products") as HTMLInputElement).value,
    ).toBe("");
  });

  it("keeps controlled values intact while searching", () => {
    const onSearch = vi.fn();

    render(<SearchInput value="tables" onSearch={onSearch} />);

    const input = screen.getByLabelText("Search products") as HTMLInputElement;
    expect(input.value).toBe("tables");

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(onSearch).toHaveBeenCalledWith("tables");
  });
});
