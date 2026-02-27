const { chromium } = require('playwright');

const seeds = [82, 83, 84, 85, 86, 87, 88, 89, 90, 91];

(async () => {
  const browser = await chromium.launch();
  let grandTotal = 0;

  for (const seed of seeds) {
    const page = await browser.newPage();
    const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;
    await page.goto(url, { waitUntil: 'networkidle' });

    // Wait for table to render
    await page.waitForSelector('table', { timeout: 15000 });

    const seedSum = await page.evaluate(() => {
      let total = 0;
      document.querySelectorAll('table td, table th').forEach(cell => {
        const val = parseFloat(cell.innerText.replace(/,/g, ''));
        if (!isNaN(val)) total += val;
      });
      return total;
    });

    console.log(`Seed ${seed}: ${seedSum}`);
    grandTotal += seedSum;
    await page.close();
  }

  await browser.close();
  console.log(`\nTotal sum across all seeds: ${grandTotal}`);
})();
