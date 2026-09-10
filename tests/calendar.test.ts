import { describe, expect, it } from "vitest";
import { eventToIcs, parseIcs } from "../src/services/calendar";

describe("calendar exchange", () => { it("round trips a basic event", () => { const event = { id: "1", title: "Overleg", start: "2026-09-10T10:00:00.000Z" }; expect(parseIcs(`BEGIN:VCALENDAR\n${eventToIcs(event)}\nEND:VCALENDAR`)[0].title).toBe("Overleg"); }); });
