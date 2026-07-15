const { chromium } = require('playwright');
const cheerio = require('cheerio');

async function headlessScrape() {
  const browser = await chromium.launch({
    headless: true,
    // slowMo: 100
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  try {
    await page.goto(`https://www.jw.org/en/whats-new/`, { waitUntil: 'networkidle' });

    const html = await page.content();
    const $ = cheerio.load(html);
    const articleImages = $('.whatsNewItems img').map((i, el) => $(el).attr('src')).get();
    const articleLinks = $('.whatsNewItems .syn-img a').map((i, el) => $(el).attr('href')).get();

    return { images: articleImages, links: articleLinks };

  } catch (error) {
    console.error('❌ Failed:', error.message);
  } finally {
    await browser.close();
  }
}

module.exports = { headlessScrape }