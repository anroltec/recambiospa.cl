import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

export const alt = "Recambio SpA - Repuestos y accesorios para transporte en Chile";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const chipStyle = {
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.08)",
  padding: "14px 18px",
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "rgba(255,255,255,0.82)",
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #0f1720 0%, #152434 54%, #d4002a 130%)",
          color: "#ffffff",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(212,0,42,0.35), transparent 38%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -120,
            bottom: -160,
            width: 520,
            height: 520,
            borderRadius: 520,
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "68px 78px",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 18,
                background: "#d4002a",
              }}
            />
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.82)",
              }}
            >
              {SITE_NAME}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 900,
            }}
          >
            <div
              style={{
                fontSize: 70,
                fontWeight: 900,
                lineHeight: 1.04,
                textTransform: "uppercase",
              }}
            >
              Repuestos y accesorios para transporte en todo Chile
            </div>
            <div
              style={{
                marginTop: 24,
                fontSize: 30,
                lineHeight: 1.35,
                color: "rgba(255,255,255,0.82)",
              }}
            >
              Cat&aacute;logo para veh&iacute;culos livianos y pesados, con soporte t&eacute;cnico especializado.
            </div>
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            <div style={chipStyle}>Repuestos</div>
            <div style={chipStyle}>Accesorios</div>
            <div style={chipStyle}>Servicio t&eacute;cnico</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
