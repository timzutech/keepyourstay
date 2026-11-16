import { ImageResponse } from "next/og";

export const alt = "KeepYourStay — Your property. Your website. Your bookings.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social sharing image. Pages with their own photograph override it.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f4ecdd", color: "#000", padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", fontSize: 40, fontWeight: 700 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "#000", marginRight: 18 }} />
          KeepYourStay
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, fontWeight: 700, lineHeight: 1, letterSpacing: -3 }}>
          <span>Your property.</span>
          <span>Your website.</span>
          <span style={{ color: "#2e4a3b" }}>Your bookings.</span>
        </div>
        <div style={{ display: "flex", fontSize: 30 }}>Vacation rental websites and direct-booking solutions</div>
      </div>
    ),
    size,
  );
}
