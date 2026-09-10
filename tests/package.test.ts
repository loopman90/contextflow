import { describe, expect, it } from "vitest";
import { mergePackage, parsePackage } from "../src/services/packageManager";

describe("action packages", () => {
  it("rejects malformed packages", () => expect(parsePackage("{}" ).errors.length).toBeGreaterThan(0));
  it("reports conflicts without overwriting", () => {
    const action = { id: "a", name: "A", description: "", icon: "zap", category: "custom" as const, keywords: [], template: "x", enabled: true, favorite: false, order: 1, selectionBehavior: "insert" as const, inputs: [], conditions: {} };
    expect(mergePackage([action], [{ ...action, name: "B" }], false).conflicts).toEqual(["a"]);
  });
});
