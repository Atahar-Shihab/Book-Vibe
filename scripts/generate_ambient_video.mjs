import { chromium } from "playwright-core";
import http from "http";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const CHROME_PATH = "C:\\Users\\USERAS\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const VIDEOS_DIR = path.resolve("./public/videos");
const PORT = 5199;

if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

// HTML5 Canvas animation generator for cinematic ambient background loop
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1920px; height: 1080px; overflow: hidden; background: #07090e; }
    canvas { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  <canvas id="c" width="1920" height="1080"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const W = 1920, H = 1080;
    const LOOP_DURATION = 12; // 12 seconds loop
    let startTime = null;

    // Create persistent particles
    const particles = [];
    const NUM_PARTICLES = 140;
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        baseX: Math.random() * W,
        baseY: Math.random() * H,
        speedX: (Math.random() - 0.5) * 40,
        speedY: -20 - Math.random() * 40,
        radius: 1.5 + Math.random() * 3.5,
        color: Math.random() > 0.4 ? 'rgba(251, 191, 36,' : (Math.random() > 0.5 ? 'rgba(167, 139, 250,' : 'rgba(56, 189, 248,'),
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 1 + Math.random() * 2,
      });
    }

    // Glowing nebula orbs
    const orbs = [
      { x: 300, y: 300, r: 450, color: 'rgba(124, 58, 237, 0.22)' },
      { x: 1600, y: 750, r: 550, color: 'rgba(14, 165, 233, 0.18)' },
      { x: 1000, y: 400, r: 400, color: 'rgba(245, 158, 11, 0.12)' },
      { x: 700, y: 900, r: 500, color: 'rgba(16, 185, 129, 0.15)' }
    ];

    function draw(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = ((timestamp - startTime) / 1000) % LOOP_DURATION;
      const progress = elapsed / LOOP_DURATION; // 0 to 1

      // 1. Deep Midnight Cosmic Backdrop
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, '#06080d');
      bgGrad.addColorStop(0.5, '#0b0f19');
      bgGrad.addColorStop(1, '#0e0b17');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // 2. Breathing Nebula Orbs
      ctx.globalCompositeOperation = 'screen';
      orbs.forEach((orb, idx) => {
        const breath = Math.sin(progress * Math.PI * 2 + idx) * 50;
        const driftX = Math.cos(progress * Math.PI * 2 + idx) * 60;
        const driftY = Math.sin(progress * Math.PI * 2 + idx * 1.5) * 40;

        const grad = ctx.createRadialGradient(
          orb.x + driftX, orb.y + driftY, 10,
          orb.x + driftX, orb.y + driftY, orb.r + breath
        );
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x + driftX, orb.y + driftY, orb.r + breath, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Ambient Floating Sparks & Stardust
      particles.forEach((p) => {
        // Compute seamless looping coordinate
        const currentY = (p.baseY + p.speedY * elapsed) % H;
        const normalizedY = currentY < 0 ? currentY + H : currentY;
        const currentX = (p.baseX + p.speedX * elapsed + Math.sin(progress * Math.PI * 4 + p.phase) * 30) % W;
        const normalizedX = currentX < 0 ? currentX + W : currentX;

        // Opacity oscillation
        const alpha = 0.2 + 0.6 * Math.abs(Math.sin(progress * Math.PI * 2 * p.pulseSpeed + p.phase));

        // Draw particle glow
        ctx.fillStyle = p.color + alpha + ')';
        ctx.beginPath();
        ctx.arc(normalizedX, normalizedY, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Extra halo for larger particles
        if (p.radius > 2.5) {
          ctx.fillStyle = p.color + (alpha * 0.3) + ')';
          ctx.beginPath();
          ctx.arc(normalizedX, normalizedY, p.radius * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 4. Subtle Light Rays & Dust Beams
      ctx.globalCompositeOperation = 'source-over';
      const rayGrad = ctx.createLinearGradient(0, 0, W, H);
      rayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.015)');
      rayGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.00)');
      rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
      ctx.fillStyle = rayGrad;
      ctx.fillRect(0, 0, W, H);

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  </script>
</body>
</html>
`;

async function main() {
  console.log("🎬 Generating 1080p Ambient Video...");

  const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(htmlContent);
  });

  await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));

  const tempDir = path.resolve("./recordings/ambient_temp");
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--enable-webgl", "--ignore-gpu-blocklist", "--use-gl=angle", "--window-size=1920,1080"],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: tempDir, size: { width: 1920, height: 1080 } },
  });

  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "load" });

  console.log("   Recording 12-second seamless ambient loop...");
  await new Promise((resolve) => setTimeout(resolve, 13000));

  await page.close();
  await context.close();
  await browser.close();
  server.close();

  const files = fs.readdirSync(tempDir).filter((f) => f.endsWith(".webm"));
  if (files.length === 0) throw new Error("No webm found!");

  const rawWebm = path.join(tempDir, files[0]);
  const finalMp4 = path.join(VIDEOS_DIR, "hero-ambient.mp4");

  console.log(`🎥 Encoding to H.264 at ${finalMp4}...`);
  const ffmpegCmd = `ffmpeg -y -ss 00:00:00.5 -t 12 -i "${rawWebm}" -c:v libx264 -pix_fmt yuv420p -preset medium -crf 22 -r 30 -movflags +faststart -an "${finalMp4}"`;
  execSync(ffmpegCmd, { stdio: "inherit" });

  console.log(`✅ Ambient background video created successfully! Size: ${(fs.statSync(finalMp4).size / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(console.error);
