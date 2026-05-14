const baseUrl = process.env.TSP_SMOKE_BASE_URL ?? "http://127.0.0.1:3838";
const routes = ["/", "/en", "/verify", "/admin"];

async function fetchOk(path) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  if (response.status < 200 || response.status >= 400) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }
  const text = await response.text();
  if (!text || text.includes("Internal Server Error")) {
    throw new Error(`${path} returned an empty/error response`);
  }
}

async function waitForServer(proc) {
  const deadline = Date.now() + 30_000;
  let lastError;
  while (Date.now() < deadline) {
    if (proc.exitCode !== null) {
      throw new Error(`production server exited early with code ${proc.exitCode}`);
    }
    try {
      await fetchOk("/");
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 750));
    }
  }
  throw new Error(`production server did not become ready: ${lastError?.message ?? "timeout"}`);
}

const preflight = await fetch(`${baseUrl}/`, { redirect: "manual" }).catch(() => null);
if (preflight?.ok) {
  throw new Error(`${baseUrl} is already serving before smoke start; stop the local server and retry`);
}

const proc = Bun.spawn(["bun", "run", "start"], {
  stdout: "pipe",
  stderr: "pipe",
});

const stdout = new Response(proc.stdout).text();
const stderr = new Response(proc.stderr).text();

try {
  await waitForServer(proc);
  for (const route of routes) {
    await fetchOk(route);
  }
  console.log(`production start smoke ok (${routes.join(", ")})`);
} finally {
  if (process.platform === "win32") {
    const killer = Bun.spawn(["taskkill", "/pid", String(proc.pid), "/t", "/f"], {
      stdout: "pipe",
      stderr: "pipe",
    });
    await killer.exited.catch(() => undefined);
  } else {
    proc.kill();
  }
  await Promise.race([
    proc.exited.catch(() => undefined),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
  const [out, err] = await Promise.all([stdout, stderr]);
  if (process.env.TSP_SMOKE_VERBOSE === "1") {
    if (out.trim()) console.log(out.trim());
    if (err.trim()) console.error(err.trim());
  }
}
