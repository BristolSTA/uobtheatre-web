describe("Production Page", () => {
  it("Shows the title", () => {
    cy.visit("/production/legally-ginger");
    cy.contains("Legally Ginger");
  });
});
