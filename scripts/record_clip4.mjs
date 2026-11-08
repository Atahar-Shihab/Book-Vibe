import { chromium } from "playwright-core";
import http from "http";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const CHROME_PATH = "C:\\Users\\USERAS\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const OUTPUT_DIR = path.resolve("./recordings");
const DIST_DIR = path.resolve("./dist");
const PORT = 4173;

const sampleBooks = [
  {
    bookId: 1,
    bookName: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    image: "https://i.ibb.co.com/j69x427/The-Great-Gatsby.jpg",
    review: "A classic portrait of the Jazz Age exploring ambition, obsession, and the illusion of the American Dream.",
    totalPages: 180,
    rating: 4.7,
    category: "Classic",
    tags: ["Fiction", "Classic"],
    publisher: "Charles Scribner's Sons",
    yearOfPublishing: 1925
  },
  {
    bookId: 2,
    bookName: "To Kill a Mockingbird",
    author: "Harper Lee",
    image: "https://i.ibb.co.com/vH1y1B0/To-Kill-a-Mockingbird.jpg",
    review: "A poignant exploration of racial injustice and childhood innocence in the American Deep South.",
    totalPages: 281,
    rating: 4.9,
    category: "Fiction",
    tags: ["Social", "Justice"],
    publisher: "J. B. Lippincott & Co.",
    yearOfPublishing: 1960
  }
];

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function startServer() {
  const server = http.createServer((req, res) => {
    let urlPath = req.url.split("?")[0];
    let filePath = path.join(DIST_DIR, urlPath);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, "index.html");
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(PORT, "127.0.0.1", () => {
      console.log(`Server listening at http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function smoothScroll(page, targetY, steps = 25, delayMs = 15) {
  const currentY = await page.evaluate(() => window.scrollY);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const y = currentY + (targetY - currentY) * ease;
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await sleep(delayMs);
  }
}

async function convertWebmToMp4(webmPath, mp4Path) {
  console.log(`Encoding ${path.basename(webmPath)} -> ${path.basename(mp4Path)}...`);
  const cmd = `ffmpeg -y -i "${webmPath}" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 20 -an "${mp4Path}"`;
  execSync(cmd, { stdio: "ignore" });
}

async function recordClip4() {
  console.log("🎬 Recording Clip 4: Mobile First Responsive...");
  const server = await startServer();
  const tempDir = path.join(OUTPUT_DIR, "clip4_raw");
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--enable-webgl", "--ignore-gpu-blocklist", "--use-gl=angle"],
  });

  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    isMobile: true,
    hasTouch: true,
    recordVideo: { dir: tempDir, size: { width: 375, height: 667 } },
  });

  const page = await context.newPage();

  await page.addInitScript(({ books }) => {
    localStorage.setItem("bookvibe_read_list", JSON.stringify(books));
  }, { books: sampleBooks });

  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "networkidle" });
  await sleep(1000);

  // Smooth scroll down mobile layout
  await smoothScroll(page, 450, 25, 20);
  await sleep(600);
  await smoothScroll(page, 0, 20, 15);
  await sleep(500);

  // Open mobile drawer/menu
  const menuBtn = page.locator('button[aria-label="Toggle Navigation Menu"]');
  if (await menuBtn.count()) {
    await menuBtn.click();
    console.log("   Opened mobile menu drawer");
    await sleep(1000);

    // Click Listed Books inside mobile drawer
    const mobileLink = page.locator('.lg\\:hidden a:has-text("Listed Books"), .lg\\:hidden a[href="/books"]').first();
    if (await mobileLink.count()) {
      await mobileLink.click();
      console.log("   Navigated to Listed Books on mobile");
    }
  }

  await sleep(1500);
  await smoothScroll(page, 280, 20, 20);
  await sleep(1200);

  await page.close();
  await context.close();
  await browser.close();
  server.close();

  const files = fs.readdirSync(tempDir).filter((f) => f.endsWith(".webm"));
  if (files.length > 0) {
    const rawWebm = path.join(tempDir, files[0]);
    const finalMp4 = path.join(OUTPUT_DIR, "clip4_mobile.mp4");
    await convertWebmToMp4(rawWebm, finalMp4);
    console.log("✅ Clip 4 ready!");
  }
}

recordClip4().catch(console.error);
