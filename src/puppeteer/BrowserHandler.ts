import * as puppeteer from 'puppeteer';

export default class BrowserHandler {
  private browser: puppeteer.Browser;

  public async launchBrowser(): Promise<void> {
    this.browser = await puppeteer.launch({ headless: false });
  }

  public async newPage(): Promise<puppeteer.Page> {
    if (!this.browser) {
      throw new Error('Unable to create a new page, browser does not exist!');
    }
    return await this.browser.newPage();
  }
}
