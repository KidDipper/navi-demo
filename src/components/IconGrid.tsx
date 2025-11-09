// src/components/IconGrid.tsx
import { useState, type FC } from "react";

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
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
        gridTemplateColumns: `repeat(${cols}, minmax(90px, 1fr))`,
      }}
      data-testid="icon-grid"
    >
      {showing.map((item: NavAction) => {
        const isHovered = hovered === item.label;
        return (
          <button
            key={item.label}
            onMouseEnter={() => setHovered(item.label)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(59,130,246,0.2))",
              border: "1px solid rgba(148, 163, 184, 0.3)",
              borderRadius: "18px",
              padding: "16px 12px 14px",
              textAlign: "center",
              color: "#f8fafc",
              boxShadow: isHovered
                ? "0 18px 35px rgba(2,6,23,0.65)"
                : "0 12px 28px rgba(2,6,23,0.45)",
              transform: isHovered ? "translateY(-4px)" : "translateY(0)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <div style={{ fontSize: "1.7rem" }}>{item.icon}</div>
            <div style={{ fontSize: "0.75rem", marginTop: 8 }}>{item.label}</div>
          </button>
        );
      })}
    </div>
  );
};
