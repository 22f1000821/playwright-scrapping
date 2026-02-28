const { chromium } = require("playwright");

const urls = [
  "https://sanand0.github.io/tdsdata/js_table/?seed=84",
  "https://sanand0.github.io/tdsdata/js_table/?seed=85",
  "https://sanand0.github.io/tdsdata/js_table/?seed=86",
  "https://sanand0.github.io/tdsdata/js_table/?seed=87",
  "https://sanand0.github.io/tdsdata/js_table/?seed=88",
  "https://sanand0.github.io/tdsdata/js_table/?seed=89",
  "https://sanand0.github.io/tdsdata/js_table/?seed=90",
  "https://sanand0.github.io/tdsdata/js_table/?seed=91",
  "https://sanand0.github.io/tdsdata/js_table/?seed=92",
  "https://sanand0.github.io/tdsdata/js_table/?seed=93",
];

// Extract numbers like 12, -3, 4.56, 1,234 (we'll remove commas)
function extractNumbers(text) {
  const cleaned = text.replace(/,/g, "");
  const matches = cleaned.match(/-?\d+(\.\d+)?/g);
  if (!matches) return [];
  return matches.map(Number);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let grandTotal = 0;

  for (const url of urls) {
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Many pages render tables via JS; wait until at least one table cell exists
    await page.waitForSelector("table td, table th", { timeout: 30000 });

    // Grab ALL table text (all tables on the page)
    const tableText = await page.$$eval("table", (tables) =>
      tables.map((t) => t.innerText).join("\n")
    );

    const nums = extractNumbers(tableText);
    const sum = nums.reduce((a, b) => a + b, 0);

    console.log(`URL: ${url}`);
    console.log(`  Numbers found: ${nums.length}`);
    console.log(`  Page sum: ${sum}`);

    grandTotal += sum;
  }

  // Print final answer clearly in logs
  console.log("====================================");
  console.log("FINAL_TOTAL_SUM_ALL_PAGES =", grandTotal);
  console.log("====================================");

  await browser.close();
})();