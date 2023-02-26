describe('Create Booking Process', () => {
  it('redirects away unauthenticated user', () => {
    cy.visit('/production/legally-blonde/book/UGVyZm9ybWFuY2VOb2RlOjE=');
    cy.url().should('match', /login/);
  });
  it('doesnt redirect away authenticated user', () => {
    cy.login();
    cy.visit('/production/legally-blonde/book/UGVyZm9ybWFuY2VOb2RlOjE=');
    cy.url().should(
      'match',
      /production\/legally-blonde\/book\/UGVyZm9ybWFuY2VOb2RlOjE=/
    );
  });
});
