import * as puppeteer from "puppeteer";

export default class BrowserHandler {
  private browser: puppeteer.Browser;

  public async launchBrowser(): Promise<void> {
    const { CHROME_BROWSER_WS_ENDPOINT: browserWSEndpoint } = process.env;

    // Use user profile if chrome remote debugger endpoint is provided. Otherwise create new browser instance
    if (browserWSEndpoint) {
      this.browser = await puppeteer.connect({ browserWSEndpoint });
    } else {
      this.browser = await puppeteer.launch({ headless: false });
    }
  }

  public async newPage(): Promise<puppeteer.Page> {
    if (!this.browser) {
      throw new Error("Unable to create a new page, browser does not exist!");
    }
    return await this.browser.newPage();
  }
}
