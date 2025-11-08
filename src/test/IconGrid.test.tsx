/// <reference types="vitest/globals" />
// src/components/IconGrid.test.tsx
import { render, screen } from "@testing-library/react";
import { IconGrid} from "../components/IconGrid";
import type { NavAction } from "../components/IconGrid";


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
  test("rows=2 のときは 2*3=6 件表示される", () => {
    render(<IconGrid actions={actions} rows={2} cols={3} />);
    const grid = screen.getByTestId("icon-grid");
    // buttonが6個あるはず
    expect(grid.querySelectorAll("button")).toHaveLength(6);
  });

  test("rows=3 のときは 3*3=9 件表示される", () => {
    render(<IconGrid actions={actions} rows={3} cols={3} />);
    const grid = screen.getByTestId("icon-grid");
    expect(grid.querySelectorAll("button")).toHaveLength(9);
  });
});
