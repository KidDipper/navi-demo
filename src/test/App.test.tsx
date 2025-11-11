/// <reference types="vitest/globals" />
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import App from "../App";

const mockFetchResponse = () =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ iconGridRows: 3 }),
  });

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation(mockFetchResponse));
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  test("自宅を選択すると目的地と数値が更新される", async () => {
    render(<App />);
    await screen.findByText("トヨタ記念館");
    fireEvent.click(screen.getByRole("button", { name: /自宅/ }));
    expect(await screen.findByText("トヨタ車体本社")).toBeInTheDocument();
    expect(screen.getByText("21 km")).toBeInTheDocument();
    expect(screen.getByText("順調")).toBeInTheDocument();
  });

  test(
    "平均速度が一定間隔で変化する",
    async () => {
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(1);
    render(<App />);
      await screen.findByText("45 km/h");
      expect(await screen.findByText("50 km/h", undefined, { timeout: 6000 })).toBeInTheDocument();

      randomSpy.mockRestore();
    },
    10000,
  );
});
