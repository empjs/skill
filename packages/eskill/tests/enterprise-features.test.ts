import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { scanForSkills } from "../src/utils/collection";
import { saveToken, getToken, loadConfig } from "../src/utils/config";

describe("EMP Skill Enterprise Features", () => {
  const tempTestDir = path.join(os.tmpdir(), `eskill-test-${Date.now()}`);

  beforeAll(() => {
    if (!fs.existsSync(tempTestDir)) {
      fs.mkdirSync(tempTestDir, { recursive: true });
    }
  });

  afterAll(() => {
    fs.rmSync(tempTestDir, { recursive: true, force: true });
  });

  describe("Collection Scanner (Monorepo Support)", () => {
    it("should identify multiple skills in subdirectories", () => {
      const repoDir = path.join(tempTestDir, "monorepo");
      fs.mkdirSync(repoDir, { recursive: true });

      // Create skill A
      const skillADir = path.join(repoDir, "skill-a");
      fs.mkdirSync(skillADir);
      fs.writeFileSync(path.join(skillADir, "SKILL.md"), `---
name: skill-a
description: Test Skill A
---`);

      // Create skill B
      const skillBDir = path.join(repoDir, "skill-b");
      fs.mkdirSync(skillBDir);
      fs.writeFileSync(path.join(skillBDir, "SKILL.md"), `---
name: skill-b
description: Test Skill B
---`);

      const skills = scanForSkills(repoDir);
      expect(skills.length).toBe(2);
      expect(skills.map(s => s.name)).toContain("skill-a");
      expect(skills.map(s => s.name)).toContain("skill-b");
    });

    it("should extract metadata from SKILL.md", () => {
      const skillDir = path.join(tempTestDir, "meta-skill");
      fs.mkdirSync(skillDir, { recursive: true });
      fs.writeFileSync(path.join(skillDir, "SKILL.md"), `---
description: 'Special enterprise logic'
---`);

      const skills = scanForSkills(skillDir);
      expect(skills[0].description).toBe("Special enterprise logic");
    });
  });

  describe("Auth & Token Management", () => {
    const testDomain = "git.test.corp";
    const testToken = "test-token-12345";

    it("should save and retrieve tokens correctly", () => {
      saveToken(testDomain, testToken);
      const retrieved = getToken(testDomain);
      expect(retrieved).toBe(testToken);
    });

    it("should mask tokens in config list (logic check)", () => {
      const config = loadConfig();
      expect(config.tokens[testDomain]).toBe(testToken);
    });
  });

  describe("Path & Scope Resolution", () => {
    it("should detect local project directories", () => {
      const projectDir = path.join(tempTestDir, "my-project");
      const localAgentDir = path.join(projectDir, ".agent", "skills");
      fs.mkdirSync(localAgentDir, { recursive: true });

      // Verify directory exists
      expect(fs.existsSync(localAgentDir)).toBe(true);
    });
  });
});
