import puppeteer from "puppeteer";
import { widthToDivChild, depthToDivChild} from "./helpScript";


export async function run(productType:string, productWidth:string, productDepth:string) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to idealo website
  await page.goto("https://idealo.de");

  // Get page title
  const title = await page.title();
  console.log("Page title:", title);

  // Wait for a while
  await page.waitForTimeout(2000);

  // Wait for the cookie banner to appear (adjust selector accordingly)
  const iframeHandle = await page.waitForSelector("#sp_message_iframe_934534");

  // Switch to the cookie iframe, if exists
  if (iframeHandle != null) {
    const iframe = await iframeHandle.contentFrame();

    // Click on the "Accept" or "OK" button on the cookie banner (adjust selector accordingly)
    if (iframe != null) {
      await iframe.waitForSelector(
        "#notice > div.message-component.message-row.mobile-reverse > div.message-component.message-column.container-accept-all > button"
      );

      await iframe.click(
        "#notice > div.message-component.message-row.mobile-reverse > div.message-component.message-column.container-accept-all > button"
      );
    }
  }

  //on main page input the search term like e.g. Waschbecken
  await page.type('input[type="search"]', productType);
  //wait for a while
  await page.waitForTimeout(2000);

  // Click on the button to submit the search
  await page.click(
    "#i-header-search > button.i-search-button.i-search-button--submit"
  );

  //Wait and click on the filter button to add filters to the search
  await page.waitForSelector(
    "#productcategory > main > div.row.resultlist__content > div > div > div > div.sr-topBar__titleToggleWrapper > div.sr-topBar__titleToggleWrapper--mobileFilterToggle > button"
  );
  await page.click(
    "#productcategory > main > div.row.resultlist__content > div > div > div > div.sr-topBar__titleToggleWrapper > div.sr-topBar__titleToggleWrapper--mobileFilterToggle > button"
  );

  //wait a while
  await page.waitForTimeout(2000);

  //Open one filter menu
  await page.waitForSelector(
    "#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(11) > div.sr-boxTitle.sr-boxTitle--clickable > svg"
  );
  await page.click(
    "#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(11) > div.sr-boxTitle.sr-boxTitle--clickable > svg"
  );

  // Wait for the checkbox to appear
  const productDivWidth = widthToDivChild(productWidth);
  await page.waitForSelector(
    "#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(11) > div.sr-filterBox__content.sr-filterBox__content--titled > div > div > div > div > div:nth-child(" +
      productDivWidth +
      ") > a"
  );
  // Click the checkbox to toggle its state
  await page.click(
    "#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(11) > div.sr-filterBox__content.sr-filterBox__content--titled > div > div > div > div > div:nth-child(" +
      productDivWidth +
      ") > a"
  );

  //wait a while
  await page.waitForTimeout(2000);

  //Open another filter menu
  await page.waitForSelector(
    "#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(8) > div.sr-boxTitle.sr-boxTitle--clickable > svg"
  );
  await page.click(
    "#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(8) > div.sr-boxTitle.sr-boxTitle--clickable > svg"
  );

  // Wait for the checkbox to appear
  const productDivDepth = depthToDivChild(productDepth);
  await page.waitForSelector(
    "#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(8) > div.sr-filterBox__content.sr-filterBox__content--titled > div > div > div > div > div:nth-child(" +
      productDivDepth +
      ") > a"
  );

  // Click the checkbox to toggle its state
  await page.click(
    "#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(8) > div.sr-filterBox__content.sr-filterBox__content--titled > div > div > div > div > div:nth-child(" +
      productDivDepth +
      ") > a"
  );

  //submit the filters
  await page.waitForSelector(
    "#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__footer > button"
  );
  await page.click(
    "#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__footer > button"
  );

  // Wait for the product items to appear
  await page.waitForSelector(
    "#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-searchResult__resultPanel > div:nth-child(2) > div"
  );

  //iterate over all products
  const productList = await page.evaluate(() => {
    const elements = document.querySelectorAll(
      "#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-searchResult__resultPanel > div:nth-child(2) > div > div"
    );
    const products: any = [];

    elements.forEach((element) => {

      // Access the text content of each element
      let name = element.querySelector("div > div");
      // Assuming you have a reference to the anchor element
      const anchorElement = name?.querySelector("a");
      // Get the value of the href attribute
      const hrefValue = anchorElement?.getAttribute("href");


      const titleElement = element.querySelector(
        "div > div > a > div.sr-resultItemTile__infoWrapper > div.sr-resultItemTile__summary > div > div.sr-productSummary__title"
      );
      const titleValue = titleElement?.textContent;


      const priceElement = element.querySelector(
        "div > div > a > div.sr-detailedPriceInfo.detailedPriceInfo--GRID > div.sr-detailedPriceInfo__price"
      );
      const priceValue = priceElement?.textContent;

      //Convert price to numeric value
      const numericPrice = priceValue?.match(/(\d|,)+/);
      if (numericPrice) {
        const extractedPrice = numericPrice[0];
        const numberPrice = parseFloat(extractedPrice.replace(",", "."));
        const product = {
          title: titleValue,
          price: numberPrice,
          link: hrefValue,
        };
        products.push(product);
        console.log("Extracted Price:", extractedPrice);
      } else {
        console.log("No numeric price found.");
      }

    });

    return products;
  });

  console.log("Products:", productList);

  return productList;
}
