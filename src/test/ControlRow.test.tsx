import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ControlRow } from "../components/ControlRow";
import type { Control, FrameworkId } from "../types";

const control: Control = {
  id: "AC-AUTH",
  title: "Authentication Controls",
  domain: "Access Control",
  frameworks: {
    ISO27001: { refs: ["A.8.5"], summary: "Secure authentication" },
    NIS2: { refs: ["Art.21(2)(j)"], summary: "MFA required" },
  },
};

const defaultProps: Parameters<typeof ControlRow>[0] = {
  control,
  done: false,
  hasNote: false,
  isChild: false,
  activeFrameworks: ["ISO27001", "NIS2"] as FrameworkId[],
  filterFramework: null,
  isSelected: false,
  onToggleCheck: vi.fn(),
  onSelect: vi.fn(),
  onChipClick: vi.fn(),
};

function setup(props = defaultProps) {
  return {
    user: userEvent.setup(),
    ...render(<ControlRow {...props} />),
  };
}

describe("ControlRow — checkbox vs row click", () => {
  it("clicking the checkbox calls onToggleCheck, not onSelect", async () => {
    const onToggleCheck = vi.fn();
    const onSelect = vi.fn();
    const { user } = setup({ ...defaultProps, onToggleCheck, onSelect });

    await user.click(screen.getByRole("checkbox"));

    expect(onToggleCheck).toHaveBeenCalledOnce();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("clicking the row body (title area) calls onSelect, not onToggleCheck", async () => {
    const onToggleCheck = vi.fn();
    const onSelect = vi.fn();
    const { user } = setup({ ...defaultProps, onToggleCheck, onSelect });

    await user.click(screen.getByText("Authentication Controls"));

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onToggleCheck).not.toHaveBeenCalled();
  });

  it("clicking a framework chip calls onChipClick, not onSelect", async () => {
    const onSelect = vi.fn();
    const onChipClick = vi.fn();
    const { user } = setup({ ...defaultProps, onSelect, onChipClick });

    await user.click(screen.getByTitle("ISO 27001:2022"));

    expect(onChipClick).toHaveBeenCalledWith("ISO27001");
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("reflects done state with line-through on title", () => {
    setup({ ...defaultProps, done: true });
    expect(screen.getByText("Authentication Controls")).toHaveClass("line-through");
  });

  it("shows note indicator when hasNote is true", () => {
    setup({ ...defaultProps, hasNote: true });
    expect(screen.getByTitle("Has notes")).toBeInTheDocument();
  });

  it("shows fork icon and indents when isChild is true", () => {
    setup({ ...defaultProps, isChild: true });
    expect(screen.getByTitle("Specialization of parent control")).toBeInTheDocument();
  });
});
