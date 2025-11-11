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

type DestinationInfo = {
  name: string;
  etaMinutes: number;
  distanceKm: number;
  baseSpeed: number;
  trafficLevel: string;
};

const DESTINATION_PRESETS = {
  memorial: {
    name: "トヨタ記念館",
    etaMinutes: 25,
    distanceKm: 13,
    baseSpeed: 45,
    trafficLevel: "やや混雑",
  },
  home: {
    name: "トヨタ車体本社",
    etaMinutes: 18,
    distanceKm: 21,
    baseSpeed: 52,
    trafficLevel: "順調",
  },
} satisfies Record<string, DestinationInfo>;

const SPEED_UPDATE_INTERVAL = 4000;
const SPEED_JITTER_RANGE = 10;
const MIN_SPEED = 20;
const MAX_SPEED = 90;
const PANEL_WIDTH = 420;

function App() {
  const [config, setConfig] = useState<UiLayoutConfig | null>(null);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const [destination, setDestination] = useState<DestinationInfo>(DESTINATION_PRESETS.memorial);
  const [currentSpeed, setCurrentSpeed] = useState(DESTINATION_PRESETS.memorial.baseSpeed);

  // 設定ファイルをキャッシュバスター付きで読み込む
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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCurrentSpeed(destination.baseSpeed);
  }, [destination]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSpeed(() => {
        const jitter = (Math.random() - 0.5) * SPEED_JITTER_RANGE;
        const next = destination.baseSpeed + jitter;
        const clamped = Math.max(MIN_SPEED, Math.min(MAX_SPEED, next));
        return Math.round(clamped);
      });
    }, SPEED_UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [destination]);

  const rows = config?.iconGridRows ?? 2;
  // 1行あたりのアイコン数。横3つ並べる想定。
  const cols = 3;
  const isCompact = viewportWidth < 900;

  const handleQuickSelect = (action: NavAction) => {
    if (action.label === "自宅") {
      setDestination(DESTINATION_PRESETS.home);
    } else {
      setDestination(DESTINATION_PRESETS.memorial);
    }
  };

  return (
    <div style={styles.app}>
      <div style={styles.shell}>
        {/* ヘッダー */}
        <header style={styles.header}>
          <div>
            <div style={styles.appTitle}>Navi Demo</div>
            <div style={styles.subtitle}>ハンズオン用デモインターフェース</div>
          </div>
          <div style={styles.locationTag}>現在地: 名古屋市栄周辺</div>
        </header>

        <section
          style={{
            ...styles.mainGrid,
            flexDirection: isCompact ? "column" : "row",
            flexWrap: isCompact ? "wrap" : "nowrap",
            justifyContent: isCompact ? "center" : "space-between",
            alignItems: isCompact ? "stretch" : "flex-start",
          }}
        >
          {/* ヒーローカード */}
          <div style={styles.hero}>
            <div style={styles.panelHead}>
              <div>
                <div style={styles.panelLabel}>目的地</div>
                <div style={styles.heroDestination}>{destination.name}</div>
              </div>
              <div style={styles.heroBadge}>ETA {destination.etaMinutes}分</div>
            </div>
            <div style={styles.progressTrack}>
              <div style={styles.progressValue} />
            </div>
            <div style={styles.heroStats}>
              <div style={styles.heroStat}>
                <span style={styles.statLabel}>残距離</span>
                <span style={styles.statValue}>{destination.distanceKm} km</span>
              </div>
              <div style={styles.heroStat}>
                <span style={styles.statLabel}>平均速度</span>
                <span style={styles.statValue}>{currentSpeed} km/h</span>
              </div>
              <div style={styles.heroStat}>
                <span style={styles.statLabel}>渋滞レベル</span>
                <span style={styles.trafficBadge}>{destination.trafficLevel}</span>
              </div>
            </div>
          </div>

          {/* クイック目的地 */}
          <div style={styles.quickPanel}>
            <div style={styles.panelHead}>
              <div>
                <div style={styles.panelLabel}>クイック目的地</div>
                <div style={styles.panelSubLabel}>現在地: 名古屋市栄周辺</div>
              </div>
              <div style={styles.panelMeta}>行数は設定で変更可</div>
            </div>
            <IconGrid actions={NAV_ACTIONS} rows={rows} cols={cols} onSelect={handleQuickSelect} />
          </div>
        </section>
      </div>

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
  shell: {
    maxWidth: "960px",
    margin: "0 auto",
    padding: "32px clamp(16px, 4vw, 48px)",
  },
  header: {
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  },
  appTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
  },
  subtitle: {
    fontSize: "0.75rem",
    opacity: 0.65,
    marginTop: 4,
  },
  locationTag: {
    padding: "6px 14px",
    borderRadius: "999px",
    background: "rgba(59, 130, 246, 0.15)",
    border: "1px solid rgba(59, 130, 246, 0.35)",
    fontSize: "0.75rem",
  },
  mainGrid: {
    display: "flex",
    gap: "24px",
    marginTop: "32px",
    justifyContent: "center",
  },
  hero: {
    flex: `0 0 ${PANEL_WIDTH}px`,
    maxWidth: PANEL_WIDTH,
    padding: "24px 28px",
    borderRadius: "28px",
    background: "rgba(15, 23, 42, 0.65)",
    border: "1px solid rgba(148, 163, 184, 0.28)",
    boxShadow: "0 25px 70px rgba(3, 7, 18, 0.65)",
    backdropFilter: "blur(18px)",
  },
  panelHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
  },
  panelLabel: {
    fontSize: "0.75rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    opacity: 0.7,
  },
  panelSubLabel: {
    marginTop: 4,
    fontSize: "0.8rem",
    opacity: 0.65,
  },
  panelMeta: {
    fontSize: "0.75rem",
    opacity: 0.7,
  },
  heroDestination: {
    fontSize: "2rem",
    fontWeight: 700,
    marginTop: 6,
  },
  heroBadge: {
    padding: "6px 14px",
    borderRadius: "999px",
    background: "rgba(59, 130, 246, 0.18)",
    border: "1px solid rgba(59, 130, 246, 0.45)",
    fontSize: "0.8rem",
  },
  progressTrack: {
    height: "6px",
    borderRadius: "999px",
    background: "rgba(255, 255, 255, 0.08)",
    marginTop: "20px",
  },
  progressValue: {
    width: "55%",
    height: "100%",
    borderRadius: "inherit",
    background: "linear-gradient(90deg, #38bdf8, #22d3ee)",
    boxShadow: "0 0 12px rgba(34, 211, 238, 0.65)",
  },
  heroStats: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginTop: "24px",
  },
  heroStat: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  statLabel: {
    fontSize: "0.75rem",
    opacity: 0.7,
  },
  statValue: {
    fontSize: "1.25rem",
    fontWeight: 600,
  },
  trafficBadge: {
    display: "inline-block",
    background: "rgba(248, 113, 113, 0.15)",
    border: "1px solid rgba(248, 113, 113, 0.6)",
    borderRadius: "999px",
    padding: "3px 10px",
    fontSize: "0.75rem",
  },
  quickPanel: {
    flex: `0 0 ${PANEL_WIDTH}px`,
    maxWidth: PANEL_WIDTH,
    padding: "24px 24px 20px",
    borderRadius: "24px",
    background: "rgba(15, 23, 42, 0.5)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    boxShadow: "0 20px 60px rgba(2, 6, 23, 0.55)",
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
