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

    const html = await page.content();
    const $ = cheerio.load(html);
    const $whatsNew = $('.whatsNewItems'); // Cache the parent once

    // images
    let images = [];
    $whatsNew.find('.syn-img').each((i, el) => {
      const childNode = $(el).children().first(); // Will be 'A' or 'SPAN'
      if (childNode.prop('tagName') === 'SPAN') images.push('https://placehold.co/200x200/png?text=n/a');
      else {
        const src = childNode.children().first().attr('src');
        images.push(src);
      }
    })

    // links
    const links = $whatsNew
      .find('.syn-body a')
      .map((i, el) => 'https://www.jw.org' + $(el).attr('href'))
      .get();

    console.log(`✅ Scraped ${images.length} images and ${links.length} links`);

    return { images: images, links: links };

  } catch (error) {
    console.error('❌ Failed:', error.message);
  } finally {
    await browser.close();
  }
}

module.exports = { headlessScrape }