import { describe, expect, it } from "vitest";
import { PRODUCTION_URL, resolveSiteUrl } from "@/lib/site";

describe("site address", () => {
  it("ignores a stale vercel.app address in production", () => {
    expect(resolveSiteUrl({ configured: "https://keepyourstay.vercel.app", vercelEnv: "production" })).toBe(PRODUCTION_URL);
  });
  it("uses the production domain when nothing is configured", () => {
    expect(resolveSiteUrl({ vercelEnv: "production" })).toBe(PRODUCTION_URL);
  });
  it("respects a custom domain setting in production", () => {
    expect(resolveSiteUrl({ configured: "https://www.example.com/", vercelEnv: "production" })).toBe("https://www.example.com");
  });
  it("leaves previews and local development alone", () => {
    expect(resolveSiteUrl({ configured: "https://x.vercel.app", vercelEnv: "preview" })).toBe("https://x.vercel.app");
    expect(resolveSiteUrl({})).toBe("http://localhost:3000");
  });
});
