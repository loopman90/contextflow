import { describe, expect, it } from "vitest";
import { getSlashQuery } from "../src/utils/slash";

function editor(line: string, ch = line.length) { return { getCursor: () => ({ line: 0, ch }), getLine: () => line } as never; }

describe("slash menu detection", () => {
  it("detects a slash query at a word boundary", () => expect(getSlashQuery(editor("note /date"))).toMatchObject({ query: "date", from: 5, to: 10 }));
  it("ignores URLs and embedded paths", () => { expect(getSlashQuery(editor("https://example.com/date"))).toBeNull(); expect(getSlashQuery(editor("filename/date"))).toBeNull(); });
  it("supports a custom trigger", () => expect(getSlashQuery(editor("note ;task"), ";")?.query).toBe("task"));
});
