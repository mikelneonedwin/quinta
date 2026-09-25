import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0a2540",
        color: "#fdfbf7",
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "26px",
            fontWeight: 800,
            fontFamily: "monospace",
            color: "#fdfbf7",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          QA
        </div>
        <span
          style={{
            fontSize: "24px",
            fontWeight: 600,
            letterSpacing: "-0.5px",
            color: "#e0e7ff",
          }}
        >
          Quinta Akpan
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            margin: 0,
          }}
        >
          Journalist & Writer
        </h1>
        <p
          style={{
            fontSize: "28px",
            color: "#94a3b8",
            lineHeight: 1.4,
            margin: 0,
            maxWidth: "900px",
          }}
        >
          Reporting, essays, investigative projects, and cultural commentary.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255, 255, 255, 0.15)",
          paddingTop: "24px",
          fontSize: "20px",
          color: "#64748b",
          fontFamily: "monospace",
        }}
      >
        <span>quintaakpan.cv</span>
        <span>Articles · Projects · Reporting</span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
