import { chromium } from "playwright-core";
import http from "http";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const CHROME_PATH = "C:\\Users\\USERAS\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const RECORDINGS_DIR = path.resolve("./recordings");
const PORT = 5174;

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".aac": "audio/aac",
};

// HTTP Server with byte-range support for flawless HTML5 video playback
function startServer() {
  const server = http.createServer((req, res) => {
    let urlPath = req.url.split("?")[0];
    if (urlPath === "/") urlPath = "/presentation.html";
    let filePath = path.join(RECORDINGS_DIR, urlPath);

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      return res.end("Not Found");
    }

    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || "application/octet-stream";

    const range = req.headers.range;
    if (range && ext === ".mp4") {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": contentType,
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": stat.size,
        "Content-Type": contentType,
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, "127.0.0.1", () => {
      console.log(`Presentation server running at http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("🚀 Starting Presentation Video Recording...");
  const server = await startServer();

  const tempDir = path.join(RECORDINGS_DIR, "presentation_raw");
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--use-gl=angle",
      "--autoplay-policy=no-user-gesture-required",
      "--window-size=1920,1080",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: tempDir,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();

  console.log("📡 Opening presentation page...");
  await page.goto(`http://127.0.0.1:${PORT}/presentation.html`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await sleep(1500);

  console.log("🎬 Starting presentation playback...");
  await page.evaluate(() => window.startPresentation());

  // Wait for presentation to complete (timeline is ~78.4s)
  const startTime = Date.now();
  const maxWait = 95000; // 95s safety timeout
  while (Date.now() - startTime < maxWait) {
    const isDone = await page.evaluate(() => window.isPresentationDone);
    if (isDone) {
      console.log("✨ Presentation reached completion signal!");
      break;
    }
    await sleep(1000);
  }

  // Hold final slide for 2 seconds
  await sleep(2000);

  console.log("💾 Finalizing video recording...");
  await page.close();
  await context.close();
  await browser.close();
  server.close();

  // Find recorded webm
  const files = fs.readdirSync(tempDir).filter((f) => f.endsWith(".webm"));
  if (files.length === 0) {
    throw new Error("No webm recording found in " + tempDir);
  }

  const rawWebm = path.join(tempDir, files[0]);
  const finalOutputInRepo = path.join(RECORDINGS_DIR, "book-vibe-linkedin-showcase.mp4");
  const finalOutputOnD = "D:\\book-vibe-linkedin-showcase.mp4";

  console.log(`🎥 Encoding master 1080p MP4 to ${finalOutputInRepo}...`);
  const ffmpegCmd = `ffmpeg -y -i "${rawWebm}" -c:v libx264 -pix_fmt yuv420p -preset medium -crf 19 -r 30 -movflags +faststart "${finalOutputInRepo}"`;
  execSync(ffmpegCmd, { stdio: "inherit" });

  // Generate high-res thumbnail
  const thumbCmd = `ffmpeg -y -ss 00:00:20 -i "${finalOutputInRepo}" -vframes 1 -q:v 2 "${path.join(RECORDINGS_DIR, 'book-vibe-thumbnail.png')}"`;
  execSync(thumbCmd, { stdio: "ignore" });

  // Copy to D:\ for convenience
  fs.copyFileSync(finalOutputInRepo, finalOutputOnD);
  fs.copyFileSync(path.join(RECORDINGS_DIR, 'book-vibe-thumbnail.png'), 'D:\\book-vibe-thumbnail.png');
  console.log(`✅ Master LinkedIn Showcase Video ready at: ${finalOutputOnD} (${(fs.statSync(finalOutputOnD).size / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch(console.error);
