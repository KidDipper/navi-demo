/// <reference types="vitest/globals" />
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { IconGrid, type NavAction } from "../components/IconGrid";

const actions: NavAction[] = [
  { label: "自宅", icon: "🏠" },
  { label: "職場", icon: "🏢" },
  { label: "コンビニ", icon: "🏪" },
  { label: "ガソリン", icon: "⛽" },
  { label: "駐車場", icon: "🅿️" },
  { label: "履歴", icon: "🕘" },
  { label: "お気に入り", icon: "⭐" },
  { label: "高速回避", icon: "🛣️" },
  { label: "設定", icon: "⚙️" },
];

describe("IconGrid", () => {
  test("rows=2 のとき 2*3=6 件表示される", () => {
    render(<IconGrid actions={actions} rows={2} cols={3} />);
    const grid = screen.getByTestId("icon-grid");
    expect(grid.querySelectorAll("button")).toHaveLength(6);
  });

  test("rows=3 のとき 3*3=9 件表示される", () => {
    render(<IconGrid actions={actions} rows={3} cols={3} />);
    const grid = screen.getByTestId("icon-grid");
    expect(grid.querySelectorAll("button")).toHaveLength(9);
  });

  test("ホバー時にスタイルが変化する", () => {
    render(<IconGrid actions={actions} rows={2} cols={3} />);
    const firstButton = screen.getByRole("button", { name: /自宅/ });
    expect(firstButton).toHaveStyle({ transform: "translateY(0)" });
    fireEvent.mouseEnter(firstButton);
    expect(firstButton).toHaveStyle({ transform: "translateY(-4px)" });
    fireEvent.mouseLeave(firstButton);
    expect(firstButton).toHaveStyle({ transform: "translateY(0)" });
  });

  test("onSelect を渡すとクリックで発火する", () => {
    const handleSelect = vi.fn();
    render(<IconGrid actions={actions} rows={2} cols={3} onSelect={handleSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /自宅/ }));
    expect(handleSelect).toHaveBeenCalledWith(actions[0]);
  });
});
