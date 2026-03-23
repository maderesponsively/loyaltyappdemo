import type { NextConfig } from "next";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Turbopack can resolve nested CSS imports (e.g. @heroui → tailwindcss) from
 * process.cwd() when cwd is a parent folder (e.g. …/Documents/apps). Discover
 * this app’s directory from the config file and cwd, then pin module paths.
 */
function getAppRoot(): string {
  const fromConfig = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    fromConfig,
    process.cwd(),
    path.join(process.cwd(), "loyaltyappdemo"),
  ];
  for (const c of candidates) {
    const pkgPath = path.join(c, "package.json");
    if (!existsSync(pkgPath)) continue;
    try {
      const name = (JSON.parse(readFileSync(pkgPath, "utf8")) as { name?: string })
        .name;
      if (name === "loyaltyappdemo") return path.resolve(c);
    } catch {
      /* ignore */
    }
  }
  return path.resolve(fromConfig);
}

const appRoot = getAppRoot();

const nextConfig: NextConfig = {
  /** Allow phone / other devices on LAN to use dev HMR (webpack-hmr / turbopack). */
  allowedDevOrigins: ["192.168.4.92"],
  turbopack: {
    root: appRoot,
    // Relative to `root` — fixes nested @imports in @heroui/styles when cwd is a parent folder.
    resolveAlias: {
      "@heroui/styles": "./node_modules/@heroui/styles",
      tailwindcss: "./node_modules/tailwindcss",
      "tw-animate-css": "./node_modules/tw-animate-css",
    },
  },
};

export default nextConfig;
