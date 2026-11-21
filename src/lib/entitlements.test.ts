import { describe, expect, it } from "vitest";
import { mergeOwned, parseBought } from "./entitlements";
describe("entitlements", () => {
  it("front always unlocked", () => expect(mergeOwned([], [])).toEqual(["front"]));
  it("only bought upsells unlock", () => expect(mergeOwned([], parseBought("love,hack"))).toEqual(["front", "love"]));
  it("remembers earlier purchases", () => expect(mergeOwned(["shield"], ["love"]).sort()).toEqual(["front", "love", "shield"]));
});
