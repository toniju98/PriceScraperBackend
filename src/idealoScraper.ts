import puppeteer, { Browser, Page } from "puppeteer";
import { widthToDivChild, depthToDivChild, WidthOption, DepthOption } from "./helpScript";

// Types
export interface Product {
  title: string | null;
  price: number;
  link: string | null;
}

interface ScrapingConfig {
  headless: boolean;
  timeout: number;
  userAgent: string;
}

// Configuration
const DEFAULT_CONFIG: ScrapingConfig = {
  headless: process.env.NODE_ENV === 'production',
  timeout: 30000,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

// Selectors (centralized for easier maintenance)
const SELECTORS = {
  cookieIframe: '#sp_message_iframe_934534',
  cookieAcceptButton: '#notice > div.message-component.message-row.mobile-reverse > div.message-component.message-column.container-accept-all > button',
  searchInput: 'input[type="search"]',
  searchButton: '#i-header-search > button.i-search-button.i-search-button--submit',
  filterToggle: '#productcategory > main > div.row.resultlist__content > div > div > div > div.sr-topBar__titleToggleWrapper > div.sr-topBar__titleToggleWrapper--mobileFilterToggle > button',
  widthFilter: '#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(11) > div.sr-boxTitle.sr-boxTitle--clickable > svg',
  depthFilter: '#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(8) > div.sr-boxTitle.sr-boxTitle--clickable > svg',
  filterSubmit: '#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__footer > button',
  productContainer: '#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-searchResult__resultPanel > div:nth-child(2) > div > div',
  productTitle: 'div > div > a > div.sr-resultItemTile__infoWrapper > div.sr-resultItemTile__summary > div > div.sr-productSummary__title',
  productPrice: 'div > div > a > div.sr-detailedPriceInfo.detailedPriceInfo--GRID > div.sr-detailedPriceInfo__price'
};

/**
 * Main scraping function
 * @param productType - Type of product to search for
 * @param productWidth - Width filter (50 or 100)
 * @param productDepth - Depth filter (30 or 60)
 * @returns Array of scraped products
 */
export async function run(productType: string, productWidth: string, productDepth: string): Promise<Product[]> {
  let browser: Browser | null = null;
  
  try {
    console.log(`Starting scrape for: ${productType} (${productWidth}x${productDepth})`);
    
    browser = await puppeteer.launch({
      headless: DEFAULT_CONFIG.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    await setupPage(page);

    // Navigate to idealo website
    await page.goto("https://idealo.de", { 
      waitUntil: 'networkidle2',
      timeout: DEFAULT_CONFIG.timeout 
    });

    console.log("Page loaded:", await page.title());

    // Handle cookie consent
    await handleCookieConsent(page);

    // Perform search
    await performSearch(page, productType);

    // Apply filters
    await applyFilters(page, productWidth, productDepth);

    // Extract products
    const products = await extractProducts(page);

    console.log(`Scraping completed. Found ${products.length} products`);
    return products;

  } catch (error) {
    console.error("Scraping error:", error);
    throw new Error(`Scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Setup page with proper configuration
 */
async function setupPage(page: Page): Promise<void> {
  await page.setUserAgent(DEFAULT_CONFIG.userAgent);
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setDefaultNavigationTimeout(DEFAULT_CONFIG.timeout);
  await page.setDefaultTimeout(DEFAULT_CONFIG.timeout);
}

/**
 * Handle cookie consent iframe
 */
async function handleCookieConsent(page: Page): Promise<void> {
  try {
    console.log("Checking for cookie consent...");
    const iframeHandle = await page.waitForSelector(SELECTORS.cookieIframe, { timeout: 5000 });
    
    if (iframeHandle) {
      const iframe = await iframeHandle.contentFrame();
      if (iframe) {
        await iframe.waitForSelector(SELECTORS.cookieAcceptButton, { timeout: 5000 });
        await iframe.click(SELECTORS.cookieAcceptButton);
        console.log("Cookie consent accepted");
        await page.waitForTimeout(1000);
      }
    }
  } catch (error) {
    console.log("No cookie consent found or already accepted");
  }
}

/**
 * Perform product search
 */
async function performSearch(page: Page, productType: string): Promise<void> {
  console.log(`Searching for: ${productType}`);
  
  await page.waitForSelector(SELECTORS.searchInput);
  await page.type(SELECTORS.searchInput, productType);
  await page.waitForTimeout(1000);
  
  await page.click(SELECTORS.searchButton);
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  
  console.log("Search completed");
}

/**
 * Apply width and depth filters
 */
async function applyFilters(page: Page, productWidth: string, productDepth: string): Promise<void> {
  console.log(`Applying filters: ${productWidth}x${productDepth}`);
  
  // Open filter panel
  await page.waitForSelector(SELECTORS.filterToggle);
  await page.click(SELECTORS.filterToggle);
  await page.waitForTimeout(1000);

  // Apply width filter
  await applyWidthFilter(page, productWidth);
  
  // Apply depth filter
  await applyDepthFilter(page, productDepth);

  // Submit filters
  await page.waitForSelector(SELECTORS.filterSubmit);
  await page.click(SELECTORS.filterSubmit);
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  
  console.log("Filters applied successfully");
}

/**
 * Apply width filter
 */
async function applyWidthFilter(page: Page, productWidth: string): Promise<void> {
  const productDivWidth = widthToDivChild(productWidth);
  if (productDivWidth === 0) {
    throw new Error(`Invalid width: ${productWidth}`);
  }

  await page.waitForSelector(SELECTORS.widthFilter);
  await page.click(SELECTORS.widthFilter);
  await page.waitForTimeout(500);

  const widthSelector = `#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(11) > div.sr-filterBox__content.sr-filterBox__content--titled > div > div > div > div > div:nth-child(${productDivWidth}) > a`;
  
  await page.waitForSelector(widthSelector);
  await page.click(widthSelector);
  await page.waitForTimeout(500);
}

/**
 * Apply depth filter
 */
async function applyDepthFilter(page: Page, productDepth: string): Promise<void> {
  const productDivDepth = depthToDivChild(productDepth);
  if (productDivDepth === 0) {
    throw new Error(`Invalid depth: ${productDepth}`);
  }

  await page.waitForSelector(SELECTORS.depthFilter);
  await page.click(SELECTORS.depthFilter);
  await page.waitForTimeout(500);

  const depthSelector = `#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(8) > div.sr-filterBox__content.sr-filterBox__content--titled > div > div > div > div > div:nth-child(${productDivDepth}) > a`;
  
  await page.waitForSelector(depthSelector);
  await page.click(depthSelector);
  await page.waitForTimeout(500);
}

/**
 * Extract products from the page
 */
async function extractProducts(page: Page): Promise<Product[]> {
  console.log("Extracting products...");
  
  await page.waitForSelector(SELECTORS.productContainer, { timeout: 10000 });
  await page.waitForTimeout(2000); // Wait for dynamic content to load

  const products = await page.evaluate((selectors) => {
    const elements = document.querySelectorAll(selectors.productContainer);
    const productList: Product[] = [];

    elements.forEach((element) => {
      try {
        const titleElement = element.querySelector(selectors.productTitle);
        const priceElement = element.querySelector(selectors.productPrice);
        const linkElement = element.querySelector('div > div > a');

        const title = titleElement?.textContent?.trim() || null;
        const priceText = priceElement?.textContent?.trim() || '';
        const link = linkElement?.getAttribute('href') || null;

        // Extract numeric price
        const numericPrice = priceText.match(/(\d|,)+/);
        if (numericPrice) {
          const extractedPrice = numericPrice[0];
          const numberPrice = parseFloat(extractedPrice.replace(",", "."));
          
          if (!isNaN(numberPrice)) {
            productList.push({
              title,
              price: numberPrice,
              link: link ? `https://idealo.de${link}` : null
            });
          }
        }
      } catch (error) {
        console.warn("Error extracting product:", error);
      }
    });

    return productList;
  }, SELECTORS);

  console.log(`Extracted ${products.length} products`);
  return products;
}
