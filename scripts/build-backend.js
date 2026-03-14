import { build } from "esbuild";

build({
  entryPoints: ["backend/server.js"],
  bundle: true,
  platform: "node",
  target: "node20",
  outfile: "dist-backend/server.cjs",
}).then(() => {
  console.log("Backend bundled successfully");
}).catch(() => process.exit(1));