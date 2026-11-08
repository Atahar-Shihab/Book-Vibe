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
    tags: ["Fiction", "Classic", "1920s"],
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
    tags: ["Social", "Justice", "Courage"],
    publisher: "J. B. Lippincott & Co.",
    yearOfPublishing: 1960
  },
  {
    bookId: 3,
    bookName: "1984",
    author: "George Orwell",
    image: "https://i.ibb.co.com/R0ZzZc2/1984.jpg",
    review: "A chilling dystopian masterpiece dissecting totalitarian surveillance, doublethink, and state truth control.",
    totalPages: 328,
    rating: 4.8,
    category: "Science",
    tags: ["Dystopian", "Politics", "Surveillance"],
    publisher: "Secker & Warburg",
    yearOfPublishing: 1949
  },
  {
    bookId: 6,
    bookName: "The Hobbit",
    author: "J.R.R. Tolkien",
    image: "https://i.ibb.co.com/xHq3n9C/The-Hobbit.jpg",
    review: "A journey of bravery and unexpected heroism through Middle-earth to reclaim the Lonely Mountain.",
    totalPages: 310,
    rating: 4.9,
    category: "Fantasy",
    tags: ["Adventure", "Fantasy", "Epic"],
    publisher: "George Allen & Unwin",
    yearOfPublishing: 1937
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

async function smoothMouseMove(page, startX, startY, endX, endY, steps = 25, delayMs = 15) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const x = startX + (endX - startX) * ease;
    const y = startY + (endY - startY) * ease;
    await page.mouse.move(x, y);
    await sleep(delayMs);
  }
}

async function smoothScroll(page, targetY, steps = 30, delayMs = 15) {
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

async function recordClip2(browser) {
  console.log("🎬 Recording Clip 2: Reading Lists & Management...");
  const tempDir = path.join(OUTPUT_DIR, "clip2_raw");
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1200, height: 750 },
    recordVideo: { dir: tempDir, size: { width: 1200, height: 750 } },
  });

  const page = await context.newPage();

  // Pre-seed read list & wishlist
  await page.addInitScript(({ books }) => {
    localStorage.setItem("bookvibe_read_list", JSON.stringify([books[0], books[1], books[2]]));
    localStorage.setItem("bookvibe_wishlist", JSON.stringify([books[3]]));
  }, { books: sampleBooks });

  await page.goto(`http://127.0.0.1:${PORT}/books`, { waitUntil: "networkidle" });
  await sleep(1200);

  // Smooth scroll to inspect read books
  await smoothScroll(page, 300, 25, 20);
  await sleep(800);

  // Select sort by Number of Pages
  const sortSelect = page.locator('select[aria-label="Sort listed books"]');
  if (await sortSelect.count()) {
    await sortSelect.selectOption("pages");
    console.log("   Sorted by pages");
    await sleep(1000);
  }

  // Switch to Wishlist tab
  const wishlistTab = page.locator('button:has-text("Wishlist Books")');
  if (await wishlistTab.count()) {
    await wishlistTab.click();
    console.log("   Switched to Wishlist tab");
    await sleep(1200);
  }

  // Switch back to Read tab
  const readTab = page.locator('button:has-text("Read Books")');
  if (await readTab.count()) {
    await readTab.click();
    console.log("   Switched back to Read Books tab");
    await sleep(1000);
  }

  // Hover and click remove button on first book
  const removeBtn = page.locator('button[aria-label="Remove book"]').first();
  if (await removeBtn.count()) {
    await removeBtn.hover();
    await sleep(500);
    await removeBtn.click();
    console.log("   Removed book from list");
    await sleep(1200);
  }

  await page.close();
  await context.close();

  const files = fs.readdirSync(tempDir).filter((f) => f.endsWith(".webm"));
  if (files.length > 0) {
    const rawWebm = path.join(tempDir, files[0]);
    const finalMp4 = path.join(OUTPUT_DIR, "clip2_reading_list.mp4");
    await convertWebmToMp4(rawWebm, finalMp4);
  }
}

async function recordClip3(browser) {
  console.log("🎬 Recording Clip 3: Pages-to-Read Custom Charts...");
  const tempDir = path.join(OUTPUT_DIR, "clip3_raw");
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1200, height: 750 },
    recordVideo: { dir: tempDir, size: { width: 1200, height: 750 } },
  });

  const page = await context.newPage();

  // Pre-seed read list with multiple books
  await page.addInitScript(({ books }) => {
    localStorage.setItem("bookvibe_read_list", JSON.stringify(books));
  }, { books: sampleBooks });

  await page.goto(`http://127.0.0.1:${PORT}/pages-to-read`, { waitUntil: "networkidle" });
  await sleep(1500);

  // Smooth scroll down to chart section
  await smoothScroll(page, 400, 25, 20);
  await sleep(1000);

  // Hover over chart bars
  const bars = page.locator(".group.cursor-pointer, div[class*='cursor-pointer']");
  const barCount = await bars.count();
  console.log(`   Found ${barCount} chart bars`);

  for (let i = 0; i < Math.min(barCount, 4); i++) {
    const bar = bars.nth(i);
    await bar.hover();
    await sleep(1000);
  }

  // Scroll down to Annual Reading Challenge section
  await smoothScroll(page, 750, 25, 20);
  await sleep(1500);

  await page.close();
  await context.close();

  const files = fs.readdirSync(tempDir).filter((f) => f.endsWith(".webm"));
  if (files.length > 0) {
    const rawWebm = path.join(tempDir, files[0]);
    const finalMp4 = path.join(OUTPUT_DIR, "clip3_analytics.mp4");
    await convertWebmToMp4(rawWebm, finalMp4);
  }
}

async function recordClip4(browser) {
  console.log("🎬 Recording Clip 4: Mobile First Responsive...");
  const tempDir = path.join(OUTPUT_DIR, "clip4_raw");
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    isMobile: true,
    hasTouch: true,
    recordVideo: { dir: tempDir, size: { width: 375, height: 667 } },
  });

  const page = await context.newPage();

  await page.addInitScript(({ books }) => {
    localStorage.setItem("bookvibe_read_list", JSON.stringify([books[0], books[1]]));
  }, { books: sampleBooks });

  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "networkidle" });
  await sleep(1200);

  // Smooth scroll down mobile layout
  await smoothScroll(page, 450, 30, 20);
  await sleep(800);
  await smoothScroll(page, 0, 25, 15);
  await sleep(600);

  // Open mobile drawer/menu
  const menuBtn = page.locator('button[aria-label="Toggle Navigation Menu"]');
  if (await menuBtn.count()) {
    await menuBtn.click();
    console.log("   Opened mobile menu drawer");
    await sleep(1000);

    const listedNav = page.locator('a:has-text("Listed Books")').first();
    if (await listedNav.count()) {
      await listedNav.click();
      console.log("   Navigated to Listed Books on mobile");
      await sleep(1500);
      await smoothScroll(page, 300, 25, 20);
      await sleep(1200);
    }
  }

  await page.close();
  await context.close();

  const files = fs.readdirSync(tempDir).filter((f) => f.endsWith(".webm"));
  if (files.length > 0) {
    const rawWebm = path.join(tempDir, files[0]);
    const finalMp4 = path.join(OUTPUT_DIR, "clip4_mobile.mp4");
    await convertWebmToMp4(rawWebm, finalMp4);
  }
}

async function main() {
  const server = await startServer();
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--enable-webgl", "--ignore-gpu-blocklist", "--use-gl=angle"],
  });

  try {
    // Record 2, 3, 4:
    await recordClip2(browser);
    await recordClip3(browser);
    await recordClip4(browser);
    console.log("🎉 All clips recorded and converted successfully!");
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch(console.error);
