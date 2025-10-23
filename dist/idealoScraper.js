"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const helpScript_1 = require("./helpScript");
function run(productType, productWidth, productDepth) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch({ headless: false });
        const page = yield browser.newPage();
        // Navigate to idealo website
        yield page.goto("https://idealo.de");
        // Get page title
        const title = yield page.title();
        console.log("Page title:", title);
        // Wait for a while
        yield page.waitForTimeout(2000);
        // Wait for the cookie banner to appear (adjust selector accordingly)
        const iframeHandle = yield page.waitForSelector("#sp_message_iframe_934534");
        // Switch to the cookie iframe, if exists
        if (iframeHandle != null) {
            const iframe = yield iframeHandle.contentFrame();
            // Click on the "Accept" or "OK" button on the cookie banner (adjust selector accordingly)
            if (iframe != null) {
                yield iframe.waitForSelector("#notice > div.message-component.message-row.mobile-reverse > div.message-component.message-column.container-accept-all > button");
                yield iframe.click("#notice > div.message-component.message-row.mobile-reverse > div.message-component.message-column.container-accept-all > button");
            }
        }
        //on main page input the search term like e.g. Waschbecken
        yield page.type('input[type="search"]', productType);
        //wait for a while
        yield page.waitForTimeout(2000);
        // Click on the button to submit the search
        yield page.click("#i-header-search > button.i-search-button.i-search-button--submit");
        //Wait and click on the filter button to add filters to the search
        yield page.waitForSelector("#productcategory > main > div.row.resultlist__content > div > div > div > div.sr-topBar__titleToggleWrapper > div.sr-topBar__titleToggleWrapper--mobileFilterToggle > button");
        yield page.click("#productcategory > main > div.row.resultlist__content > div > div > div > div.sr-topBar__titleToggleWrapper > div.sr-topBar__titleToggleWrapper--mobileFilterToggle > button");
        //wait a while
        yield page.waitForTimeout(2000);
        //Open one filter menu
        yield page.waitForSelector("#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(11) > div.sr-boxTitle.sr-boxTitle--clickable > svg");
        yield page.click("#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(11) > div.sr-boxTitle.sr-boxTitle--clickable > svg");
        // Wait for the checkbox to appear
        const productDivWidth = (0, helpScript_1.widthToDivChild)(productWidth);
        yield page.waitForSelector("#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(11) > div.sr-filterBox__content.sr-filterBox__content--titled > div > div > div > div > div:nth-child(" +
            productDivWidth +
            ") > a");
        // Click the checkbox to toggle its state
        yield page.click("#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(11) > div.sr-filterBox__content.sr-filterBox__content--titled > div > div > div > div > div:nth-child(" +
            productDivWidth +
            ") > a");
        //wait a while
        yield page.waitForTimeout(2000);
        //Open another filter menu
        yield page.waitForSelector("#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(8) > div.sr-boxTitle.sr-boxTitle--clickable > svg");
        yield page.click("#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(8) > div.sr-boxTitle.sr-boxTitle--clickable > svg");
        // Wait for the checkbox to appear
        const productDivDepth = (0, helpScript_1.depthToDivChild)(productDepth);
        yield page.waitForSelector("#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(8) > div.sr-filterBox__content.sr-filterBox__content--titled > div > div > div > div > div:nth-child(" +
            productDivDepth +
            ") > a");
        // Click the checkbox to toggle its state
        yield page.click("#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__content > div:nth-child(8) > div.sr-filterBox__content.sr-filterBox__content--titled > div > div > div > div > div:nth-child(" +
            productDivDepth +
            ") > a");
        //submit the filters
        yield page.waitForSelector("#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__footer > button");
        yield page.click("#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-filterBar > div.sr-filterBar__footer > button");
        // Wait for the product items to appear
        yield page.waitForSelector("#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-searchResult__resultPanel > div:nth-child(2) > div");
        //iterate over all products
        const productList = yield page.evaluate(() => {
            const elements = document.querySelectorAll("#productcategory > main > div.row.resultlist__content > div > div > section > div.sr-searchResult__resultPanel > div:nth-child(2) > div > div");
            const products = [];
            elements.forEach((element) => {
                // Access the text content of each element
                let name = element.querySelector("div > div");
                // Assuming you have a reference to the anchor element
                const anchorElement = name === null || name === void 0 ? void 0 : name.querySelector("a");
                // Get the value of the href attribute
                const hrefValue = anchorElement === null || anchorElement === void 0 ? void 0 : anchorElement.getAttribute("href");
                const titleElement = element.querySelector("div > div > a > div.sr-resultItemTile__infoWrapper > div.sr-resultItemTile__summary > div > div.sr-productSummary__title");
                const titleValue = titleElement === null || titleElement === void 0 ? void 0 : titleElement.textContent;
                const priceElement = element.querySelector("div > div > a > div.sr-detailedPriceInfo.detailedPriceInfo--GRID > div.sr-detailedPriceInfo__price");
                const priceValue = priceElement === null || priceElement === void 0 ? void 0 : priceElement.textContent;
                //Convert price to numeric value
                const numericPrice = priceValue === null || priceValue === void 0 ? void 0 : priceValue.match(/(\d|,)+/);
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
                }
                else {
                    console.log("No numeric price found.");
                }
            });
            return products;
        });
        console.log("Products:", productList);
        return productList;
    });
}
exports.run = run;
