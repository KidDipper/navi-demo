// src/App.tsx
import { useEffect, useState } from "react";
import { IconGrid, type NavAction } from "./components/IconGrid";

type UiLayoutConfig = {
  iconGridRows: number;
};

const NAV_ACTIONS: NavAction[] = [
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

function App() {
  const [config, setConfig] = useState<UiLayoutConfig | null>(null);

  // 設定を読み込む（?ts=でキャッシュ回避）
  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}config/ui-layout.json?ts=${Date.now()}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch config: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        const rows = typeof json.iconGridRows === "number" ? json.iconGridRows : 2;
        setConfig({ iconGridRows: rows });
      })
      .catch((err) => {
        console.error("Failed to load ui-layout.json:", err);
        setConfig({ iconGridRows: 2 });
      });
  }, []);

  const rows = config?.iconGridRows ?? 2;
  // 1行あたりのアイコン数（横3つ並べる想定）
  const cols = 3;

  return (
    <div style={styles.app}>
      {/* ヘッダー */}
      <header style={styles.header}>
        <div style={styles.appTitle}>Navi Demo</div>
        <div style={styles.subtitle}>現在地：刈谷市駅周辺</div>
      </header>

      {/* 情報カード */}
      <section style={styles.infoSection}>
        <div style={styles.infoCard}>
          <div style={styles.infoTitle}>目的地</div>
          <div style={styles.infoValue}>トヨタ記念館</div>
          <div style={styles.infoMeta}>約 25 分 / 13 km</div>
        </div>
        <div style={styles.infoCard}>
          <div style={styles.infoTitle}>渋滞レベル</div>
          <div style={styles.badgeRed}>やや混雑</div>
        </div>
      </section>

      {/* グリッド（ここが 2行→3行） - 共通コンポーネントを使用 */}
      <section style={styles.gridSection}>
        <div style={styles.gridHeader}>
          クイック目的地
          <small style={{ marginLeft: 8, opacity: 0.6 }}>{rows} 行表示（設定で変更）</small>
        </div>
        <IconGrid actions={NAV_ACTIONS} rows={rows} cols={cols} />
      </section>

      {/* フッター */}
      <footer style={styles.footer}>CI/CDで設定を変えて即反映するデモ画面です</footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
    color: "#e2e8f0",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    paddingBottom: "60px",
  },
  header: {
    padding: "16px 20px 8px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  appTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
  },
  subtitle: {
    fontSize: "0.7rem",
    opacity: 0.7,
    marginTop: 4,
  },
  infoSection: {
    display: "flex",
    gap: "12px",
    padding: "16px 20px 4px",
  },
  infoCard: {
    background: "rgba(15, 23, 42, 0.5)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: "16px",
    padding: "12px 14px",
    minWidth: "140px",
    boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
  },
  infoTitle: {
    fontSize: "0.7rem",
    opacity: 0.7,
  },
  infoValue: {
    fontSize: "1rem",
    fontWeight: 600,
    marginTop: 4,
  },
  infoMeta: {
    fontSize: "0.65rem",
    opacity: 0.6,
    marginTop: 6,
  },
  badgeRed: {
    display: "inline-block",
    background: "rgba(248, 113, 113, 0.15)",
    border: "1px solid rgba(248, 113, 113, 0.6)",
    borderRadius: "999px",
    padding: "3px 10px",
    fontSize: "0.6rem",
    marginTop: 6,
  },
  gridSection: {
    padding: "16px 20px",
  },
  gridHeader: {
    fontWeight: 600,
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
  },
  grid: {
    display: "grid",
    gap: "12px",
  },
  gridItem: {
    background: "rgba(15, 23, 42, 0.4)",
    border: "1px solid rgba(148, 163, 184, 0.12)",
    borderRadius: "14px",
    padding: "12px 10px 10px",
    textAlign: "center" as const,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  gridIcon: {
    fontSize: "1.5rem",
  },
  gridLabel: {
    fontSize: "0.7rem",
    marginTop: 6,
  },
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "rgba(15, 23, 42, 0.6)",
    borderTop: "1px solid rgba(255,255,255,0.03)",
    padding: "6px 12px",
    fontSize: "0.65rem",
    textAlign: "center" as const,
  },
};

export default App;
