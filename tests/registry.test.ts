import { describe, it, expect } from "bun:test";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

describe("Environment & Registry Checks", () => {
  it("Public NPM Registry should be reachable", async () => {
    try {
      const response = await fetch("https://registry.npmjs.org/", { method: "HEAD" });
      expect(response.status).toBe(200);
      console.log("✅ Public NPM Registry is accessible");
    } catch (e) {
      console.error("❌ Failed to reach Public NPM Registry");
      throw e;
    }
  });


  it("NPM should be installed", async () => {
    try {
      const { stdout } = await execAsync("npm --version");
      expect(stdout.trim()).toBeTruthy();
      console.log(`✅ NPM detected: v${stdout.trim()}`);
    } catch (e) {
      console.error("❌ NPM not found in PATH");
      throw e;
    }
  });
});
