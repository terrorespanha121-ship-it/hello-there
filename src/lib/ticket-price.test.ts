import { describe, it, expect } from "vitest";
import { PLAN_PRICE_USD, PLAN_TO_PRODUCT } from "./whop-webhook.server";

describe("canonical ticket in USD", () => {
  it("front is always $27", () => expect(PLAN_PRICE_USD["plan_B7uUAUp9gdfSH"]).toBe(27));
  it("love scratch price is $16", () => expect(PLAN_PRICE_USD["plan_XwPkk2V3E9wNW"]).toBe(16));
  it("prosperity is $97 and roulette $67", () => {
    expect(PLAN_PRICE_USD["plan_YwEwLwMnWtodI"]).toBe(97);
    expect(PLAN_PRICE_USD["plan_Q7dYpQIFv8khA"]).toBe(67);
  });
  it("shield is $37 and downsell $19", () => {
    expect(PLAN_PRICE_USD["plan_8no2N6BqiV24Y"]).toBe(37);
    expect(PLAN_PRICE_USD["plan_JBwRz2KExCBxV"]).toBe(19);
  });
  it("every plan has a price", () => {
    for (const id of Object.keys(PLAN_TO_PRODUCT)) expect(PLAN_PRICE_USD[id]).toBeGreaterThan(0);
  });
});
