import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.js",
  use: { baseURL: "http://localhost:5175", browserName: "chromium" },
  webServer: [
    {
      command: "npm run dev -- --host 127.0.0.1",
      url: "http://localhost:5175",
      reuseExistingServer: !process.env.CI,
    },
    {
      command:
        "npm --prefix ../mock-employment-frontend run dev -- --host 127.0.0.1 --port 5176 --strictPort",
      url: "http://127.0.0.1:5176",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
