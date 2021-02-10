describe('Production Page', () => {
  it('Shows the title', () => {
    cy.visit('/production/legally-blonde');
    cy.contains('Legally Blonde');
  });
});
