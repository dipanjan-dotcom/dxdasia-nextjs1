const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox", "--ignore-certificate-errors"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.screenshot({ path: "/tmp/claude-0/-home-user-dxdasia-nextjs1/fe0cf738-4cc1-5f8c-ae17-9cd9b6c8f266/scratchpad/home.png", fullPage: true });
  console.log("console errors:", JSON.stringify(errors, null, 2));
  await browser.close();
})();
