const { chromium } = require('playwright');
const cheerio = require('cheerio');

async function headlessScrape() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    // slowMo: 100
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  try {
    await page.goto(`https://www.jw.org/en/whats-new/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.whatsNewItems', { timeout: 15000 });
    await page.waitForFunction(() => {
      const items = document.querySelectorAll('.whatsNewItems img');
      return items.length > 24; // adjust based on how many you expect
    }, { timeout: 12000 });

    const html = await page.content();
    const $ = cheerio.load(html);
    const $whatsNew = $('.whatsNewItems'); // Cache the parent once

    const articleImages = $whatsNew
      .find('img')
      .map((i, el) => $(el).attr('src'))
      .get();

    const articleLinks = $whatsNew
      .find('.syn-img a')
      .map((i, el) => $(el).attr('href'))
      .get();

    console.log(`✅ Scraped ${articleImages.length} images and ${articleLinks.length} links`);

    return { images: articleImages, links: articleLinks };

  } catch (error) {
    console.error('❌ Failed:', error.message);
  } finally {
    await browser.close();
  }
}

module.exports = { headlessScrape }