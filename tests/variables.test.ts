import { describe, expect, it } from "vitest";
import { resolveVariables } from "../src/utils/variables";

const context = { editor: {} as never, filePath: "Projects/Plan.md", fileName: "Plan", folder: "Projects", selection: "gekozen tekst", cursorLine: "" };

describe("variable replacement", () => {
  it("replaces note context", () => expect(resolveVariables("{{title}} — {{selection}}", context).text).toBe("Plan — gekozen tekst"));
  it("reports unknown variables without crashing", () => expect(resolveVariables("{{unknown}}", context).unknown).toEqual(["unknown"]));
});
