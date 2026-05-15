import { rm } from "node:fs/promises";
import net from "node:net";
import { spawn } from "node:child_process";
import path from "node:path";

const port = Number.parseInt(process.env.PORT ?? "3838", 10);
if (!Number.isInteger(port) || port <= 0) {
  console.error(`Invalid PORT value: ${process.env.PORT}`);
  process.exit(1);
}

const distDir = process.env.NEXT_DIST_DIR ?? ".next-dev";

const portIsBusy = await new Promise((resolve) => {
  const socket = net.connect({ host: "127.0.0.1", port });
  socket.once("connect", () => {
    socket.destroy();
    resolve(true);
  });
  socket.once("error", () => resolve(false));
});

if (portIsBusy && process.env.TSP_ALLOW_BUSY_PORT !== "1") {
  console.error(
    [
      `Port ${port} is already in use.`,
      "Use the existing dev server, stop it first, or run with a different PORT.",
      "Dev output is isolated from production builds, so avoid duplicate servers on the same port.",
    ].join("\n"),
  );
  process.exit(1);
}

await rm(path.join(process.cwd(), distDir), { recursive: true, force: true });

const command = process.execPath || "bun";
const child = spawn(command, ["x", "next", "dev", "-p", String(port)], {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_DIST_DIR: distDir,
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
