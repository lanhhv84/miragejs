import trait from "@lib/trait";

describe("Unit | trait", function () {
  test("it returns correct value", function () {
    const traited = trait({ key: "value" });
    expect(traited.__isTrait__).toBe(true);
    expect(traited.extension).toEqual({ key: "value" });
  });
});
