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

  it("Private Registry (npm.ppx520.com) should be reachable", async () => {
    try {
      // Using a short timeout because if it hangs, it's likely unreachable
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch("http://npm.ppx520.com/", { 
        method: "HEAD",
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      expect(response.status).toBe(200);
      console.log("✅ Private Registry is accessible");
    } catch (e) {
      console.warn("⚠️ Private Registry unreachable (VPN required?)");
      console.warn("   Functionality for @nova/rn-skill might be limited without VPN.");
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
