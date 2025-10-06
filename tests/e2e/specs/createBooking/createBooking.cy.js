describe('Create Booking Process', () => {
  it('redirects away unauthenticated user', () => {
    cy.visit('/production/aurora-nights/book/UGVyZm9ybWFuY2VOb2RlOjI=');
    cy.url().should('match', /login/);
  });
  it('doesnt redirect away authenticated user', () => {
    cy.login();
    cy.visit('/production/aurora-nights/book/UGVyZm9ybWFuY2VOb2RlOjI=');
    cy.url().should(
      'match',
      /production\/aurora-nights\/book\/UGVyZm9ybWFuY2VOb2RlOjI=/
    );
  });
});
