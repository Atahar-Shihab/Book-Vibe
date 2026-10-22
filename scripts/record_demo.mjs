import { chromium } from "playwright-core";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Users\\USERAS\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const OUTPUT_DIR = path.resolve("./recordings");
const TARGET_URL = "https://book-vibe-shihab.vercel.app/";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function smoothMouseMove(page, startX, startY, endX, endY, steps = 30, delayMs = 15) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Ease in out
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const x = startX + (endX - startX) * ease;
    const y = startY + (endY - startY) * ease;
    await page.mouse.move(x, y);
    await sleep(delayMs);
  }
}

async function smoothScroll(page, targetY, steps = 35, delayMs = 18) {
  const currentY = await page.evaluate(() => window.scrollY);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const y = currentY + (targetY - currentY) * ease;
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await sleep(delayMs);
  }
}

async function run() {
  console.log("🚀 Launching Chromium for 1080p Cinematic Recording...");
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--use-gl=angle",
      "--window-size=1920,1080",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: OUTPUT_DIR,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();

  console.log(`📡 Navigating to ${TARGET_URL}...`);
  await page.goto(TARGET_URL, { waitUntil: "networkidle" });
  await sleep(1500);

  // SCENE 1: Hero Section & 3D Tilt Glare (0s - 8s)
  console.log("🎬 Scene 1: Hero Section & 3D Perspective Tilt");
  await smoothMouseMove(page, 500, 300, 1350, 420, 40, 20);
  await sleep(400);
  // Orbit around hero book card to showcase specular glare reflection
  await smoothMouseMove(page, 1350, 420, 1480, 320, 25, 20);
  await smoothMouseMove(page, 1480, 320, 1300, 550, 30, 20);
  await smoothMouseMove(page, 1300, 550, 1420, 420, 25, 20);
  await sleep(800);

  // SCENE 2: Audio Atmosphere & Frequency Wave Visualizer (8s - 16s)
  console.log("🎬 Scene 2: Audio Atmosphere & Wave Visualizer");
  await smoothMouseMove(page, 1420, 420, 1480, 40, 30, 15);
  // Click ambient audio button in navbar
  const audioBtn = page.locator('button[title*="Toggle Ambient Audio"]');
  if (await audioBtn.count()) {
    await audioBtn.click();
    await sleep(600);
    // Click Cozy Library Rain or Alpha Focus
    const rainOption = page.locator('button:has-text("Cozy Library Rain")');
    if (await rainOption.count()) {
      await rainOption.click();
      console.log("   Activated Cozy Library Rain soundscape");
    }
  }
  await sleep(1200);

  // SCENE 3: Theme Switcher (16s - 23s)
  console.log("🎬 Scene 3: Atmospheric Theme Switcher");
  const themeBtn = page.locator('button[aria-label="Change theme"]');
  if (await themeBtn.count()) {
    await themeBtn.click();
    await sleep(600);
    // Switch to Moonlight Study (Dark Mode)
    const darkOption = page.locator('button:has-text("Moonlight Study")');
    if (await darkOption.count()) {
      await darkOption.click();
      console.log("   Switched to Moonlight Study (Dark)");
    }
    await sleep(1200);

    // Switch to Antique Parchment
    await themeBtn.click();
    await sleep(500);
    const sepiaOption = page.locator('button:has-text("Antique Parchment")');
    if (await sepiaOption.count()) {
      await sepiaOption.click();
      console.log("   Switched to Antique Parchment");
    }
    await sleep(1200);

    // Switch back to Daylight Library
    await themeBtn.click();
    await sleep(400);
    const lightOption = page.locator('button:has-text("Daylight Library")');
    if (await lightOption.count()) {
      await lightOption.click();
    }
  }
  await sleep(800);

  // SCENE 4: 3D Virtual Bookshelf (23s - 34s)
  console.log("🎬 Scene 4: 3D Virtual Bookshelf Interaction");
  await smoothScroll(page, 820, 40, 20);
  await sleep(800);

  // Click 3D Shelf View toggle
  const shelfToggle = page.locator('button[title="Virtual Shelf View"]');
  if (await shelfToggle.count()) {
    await shelfToggle.click();
    console.log("   Activated 3D Shelf View");
    await sleep(1200);

    // Hover across multiple 3D book spines to watch them pull forward
    const spines = page.locator(".group\\/book, [style*='preserve-3d']");
    const count = await spines.count();
    console.log(`   Found ${count} book spines on shelf`);

    // Smooth hover across shelf row 1
    await smoothMouseMove(page, 250, 920, 450, 900, 25, 20);
    await sleep(500);
    await smoothMouseMove(page, 450, 900, 680, 890, 25, 20);
    await sleep(600);
    await smoothMouseMove(page, 680, 890, 950, 910, 25, 20);
    await sleep(600);
    await smoothMouseMove(page, 950, 910, 1200, 900, 25, 20);
    await sleep(800);
  }

  // SCENE 5: 3D Two-Page Flip Reader Modal (34s - 43s)
  console.log("🎬 Scene 5: 3D Flip Reader Modal");
  // Click Flip 3D on a book
  const flipBtn = page.locator('button:has-text("Flip 3D"), button:has-text("3D Flip")').first();
  if (await flipBtn.count()) {
    await flipBtn.click();
    console.log("   Opened 3D Two-Page Reader Modal");
    await sleep(2000);
    // Smooth hover across open parchment pages
    await smoothMouseMove(page, 750, 500, 1150, 500, 30, 20);
    await sleep(1000);
    // Close modal
    const closeBtn = page.locator('button[aria-label="Close modal"], button:has-text("✕"), button:has(svg.lucide-x)').first();
    if (await closeBtn.count()) {
      await closeBtn.click();
    } else {
      await page.keyboard.press("Escape");
    }
    await sleep(800);
  }

  // Switch back to grid view for clean look
  const gridToggle = page.locator('button[title="Grid View"]');
  if (await gridToggle.count()) {
    await gridToggle.click();
    await sleep(800);
  }

  // SCENE 6: 2,700-Year Literary Galaxy Timeline (43s - 52s)
  console.log("🎬 Scene 6: 2,700-Year Literary Galaxy Timeline");
  await smoothScroll(page, 1950, 45, 18);
  await sleep(1000);

  // Click epoch buttons
  const epochs = ["Romanticism", "Modernist", "Post-War", "Cognitive"];
  for (const ep of epochs) {
    const epBtn = page.locator(`button:has-text("${ep}")`).first();
    if (await epBtn.count()) {
      await epBtn.click();
      console.log(`   Selected Epoch: ${ep}`);
      await sleep(1100);
    }
  }

  // SCENE 7: 3D Active-Recall Flashcards (52s - 60s)
  console.log("🎬 Scene 7: 3D Active Recall Flashcards & Confetti");
  await smoothScroll(page, 2850, 40, 18);
  await sleep(1000);

  // Click flashcard to flip in 3D
  const flashcard = page.locator(".perspective-1000, [class*='perspective']").first();
  if (await flashcard.count()) {
    await flashcard.click();
    console.log("   Flipped flashcard in 3D (revealed answer)");
    await sleep(1400);

    // Click "Mark as Mastered" to fire confetti
    const masterBtn = page.locator('button:has-text("Mark as Mastered")');
    if (await masterBtn.count()) {
      await masterBtn.click();
      console.log("   Triggered Confetti Celebration!");
      await sleep(2200);
    }
  }

  // SCENE 8: Analytics & 3D Bar Chart Visualizer (60s - 68s)
  console.log("🎬 Scene 8: Analytics & Reading Velocity Visualizer");
  const analyticsLink = page.locator('a[href="/pages-to-read"]').first();
  if (await analyticsLink.count()) {
    await analyticsLink.click();
    await page.waitForURL("**/pages-to-read");
    await sleep(1200);
    // Smooth scroll to 3D cylinder bar chart
    await smoothScroll(page, 450, 30, 20);
    await sleep(1000);
    // Hover across 3D glowing cylinder bars
    await smoothMouseMove(page, 500, 700, 1300, 700, 35, 25);
    await sleep(1500);
  }

  // SCENE 9: Closing Glory (68s - 72s)
  console.log("🎬 Scene 9: Closing shot on Home");
  const homeLink = page.locator('a[href="/"]').first();
  if (await homeLink.count()) {
    await homeLink.click();
    await page.waitForURL("**/");
    await smoothScroll(page, 0, 20, 15);
    await sleep(1500);
  }

  console.log("🏁 Walkthrough finished! Closing browser and saving video...");
  await page.close();
  await context.close();
  await browser.close();

  // Find recorded video file
  const files = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith(".webm"));
  if (files.length === 0) {
    throw new Error("No webm video found in output directory!");
  }

  // Pick most recent file
  files.sort((a, b) => {
    return (
      fs.statSync(path.join(OUTPUT_DIR, b)).mtimeMs -
      fs.statSync(path.join(OUTPUT_DIR, a)).mtimeMs
    );
  });
  const rawVideoPath = path.join(OUTPUT_DIR, files[0]);
  const finalMp4Path = path.join(OUTPUT_DIR, "book-vibe-showcase.mp4");

  console.log(`🎥 Raw WebM Video: ${rawVideoPath}`);
  console.log(`⚙️ Converting to High-Quality MP4 (1080p 60fps) using ffmpeg...`);

  // ffmpeg conversion command
  const ffmpegCmd = `ffmpeg -y -i "${rawVideoPath}" -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -movflags +faststart "${finalMp4Path}"`;
  execSync(ffmpegCmd, { stdio: "inherit" });

  const stats = fs.statSync(finalMp4Path);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`✅ Video successfully created!`);
  console.log(`📁 File: ${finalMp4Path}`);
  console.log(`📦 Size: ${sizeMb} MB`);
}

run().catch((err) => {
  console.error("❌ Recording failed:", err);
  process.exit(1);
});
