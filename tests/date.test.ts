import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime, formatTime } from "../src/utils/date";

describe("date formatting", () => {
  const date = new Date(2026, 0, 5, 9, 7);
  it("formats a date", () => expect(formatDate(date)).toBe("05-01-2026"));
  it("formats a time", () => expect(formatTime(date)).toBe("09:07"));
  it("formats date and time", () => expect(formatDateTime(date)).toBe("05-01-2026 09:07"));
});
