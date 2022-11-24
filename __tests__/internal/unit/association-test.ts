import association from "@lib/association";

describe("Unit | association", function () {
  test("it should accept any any traits and overrides", function () {
    const traitsAndOverrides = association("test1", "test2");
    expect(traitsAndOverrides.__isAssociation__).toBe(true);
    expect(traitsAndOverrides.traitsAndOverrides).toEqual(["test1", "test2"]);
  });
});
