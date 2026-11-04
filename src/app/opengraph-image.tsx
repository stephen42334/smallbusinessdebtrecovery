import { ImageResponse } from "next/og";
import { site } from "@/config/site";
export const alt = "Debt recovery for Australian businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#050705", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80 }}>
        <div style={{ fontSize: 28, color: "#9fe91a", letterSpacing: 4 }}>{site.agencyName.toUpperCase()}</div>
        <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, marginTop: 24 }}>Debt recovery for Australian businesses</div>
        <div style={{ fontSize: 30, color: "#c9ced3", marginTop: 28 }}>Commercial &amp; consumer debt recovery. Commission-based pricing.</div>
      </div>
    ),
    size,
  );
}
