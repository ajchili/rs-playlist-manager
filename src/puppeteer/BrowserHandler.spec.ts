import * as puppeteer from "puppeteer";
import { beforeEach, describe, expect, it, vi } from "vitest";

import BrowserHandler from "./BrowserHandler.js";

vi.mock("puppeteer");
vi.mock("process");

beforeEach(() => {
  vi.resetAllMocks();
});

describe("BrowserHandler", () => {
  describe("constructor", () => {
    it("launches a new browser when CHROME_BROWSER_WS_ENDPOINT is not provided", async () => {
      const mock = vi
        .mocked(puppeteer.launch)
        .mockResolvedValue({} as puppeteer.Browser);
      const handler = new BrowserHandler();
      await handler.launchBrowser();
      expect(mock).toHaveResolved();
    });

    it("connects to an existing browser when CHROME_BROWSER_WS_ENDPOINT is provided", async () => {
      process.env.CHROME_BROWSER_WS_ENDPOINT = "TEST";
      const mock = vi
        .mocked(puppeteer.connect)
        .mockResolvedValue({} as puppeteer.Browser);
      const handler = new BrowserHandler();
      await handler.launchBrowser();
      expect(mock).toBeCalledWith({
        browserWSEndpoint: process.env.CHROME_BROWSER_WS_ENDPOINT,
      });
      expect(mock).toHaveResolved();
    });

    it("exists the application when the provided CHROME_BROWSER_WS_ENDPOINT is invalid", async () => {
      process.env.CHROME_BROWSER_WS_ENDPOINT = "TEST";
      const mock = vi
        .mocked(puppeteer.connect)
        .mockRejectedValue(new Error("SOME BROWSER CONNECT ERROR"));
      // @ts-expect-error type casting is not worth the effort within this test
      const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});
      const handler = new BrowserHandler();
      await handler.launchBrowser();
      expect(mock).toBeCalledWith({
        browserWSEndpoint: process.env.CHROME_BROWSER_WS_ENDPOINT,
      });
      expect(exitSpy).toBeCalledWith(1);
    });
  });

  describe("newPage", () => {
    it("throws an error when getting a page if a browser does not exist", async () => {
      const handler = new BrowserHandler();
      await expect(handler.newPage()).rejects.toThrowError(
        "Unable to create a new page, browser does not exist!",
      );
    });

		// TOOD: Fix mock issue
    // it("returns a page when a browser exists", async () => {
    //   const mock = vi.mocked(puppeteer.launch).mockResolvedValue({
    //     newPage: (): Promise<puppeteer.Page> =>
    //       Promise.resolve({} as puppeteer.Page),
    //   } as puppeteer.Browser);
    //   const handler = new BrowserHandler();
    //   await handler.launchBrowser();
    //   expect(mock).toHaveResolved();
    //   expect(handler.newPage()).toHaveResolved();
    // });
  });
});
