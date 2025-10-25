describe('Production Page', () => {
  it('Shows the title', () => {
    cy.visit('/production/aurora-nights');
    cy.contains('Aurora Nights');
  });
});
