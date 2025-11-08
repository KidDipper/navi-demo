// src/components/IconGrid.tsx
import type { FC } from "react";

export type NavAction = {
  label: string;
  icon: string;
};

type Props = {
  actions: NavAction[];
  rows: number;
  cols?: number;
};

export const IconGrid: FC<Props> = ({ actions, rows, cols = 3 }) => {
  const max = rows * cols;
  const showing = actions.slice(0, max);

  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
        gridTemplateColumns: `repeat(${cols}, minmax(90px, 1fr))`,
      }}
      data-testid="icon-grid"
    >
      {showing.map((item: NavAction) => (
        <button
          key={item.label}
          style={{
            background: "rgba(15, 23, 42, 0.4)",
            border: "1px solid rgba(148, 163, 184, 0.12)",
            borderRadius: "14px",
            padding: "12px 10px 10px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "1.5rem" }}>{item.icon}</div>
          <div style={{ fontSize: "0.7rem", marginTop: 6 }}>{item.label}</div>
        </button>
      ))}
    </div>
  );
};
