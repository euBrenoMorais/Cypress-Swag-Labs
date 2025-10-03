// Realiza o login na aplicação
Cypress.Commands.add('login', () => {
  cy.fixture('users.json').then((users) => {
    cy.get('[data-test="username"]').type(users.username_valid)
    cy.get('[data-test="password"]').type(users.password_valid)
  });
  cy.get('[data-test="login-button"]').click()
});

// Adiciona um produto ao carrinho com base no nome do produto
Cypress.Commands.add('addToCart', (productName) => {
  cy.contains('.inventory_item', productName)
    .find('button')
    .click()
});

// Realiza o checkout com os dados fornecidos
Cypress.Commands.add('checkout', (firstName, lastName, postalCode) => {
  cy.get('[data-test="checkout"]').click()
  cy.get('[data-test="firstName"]').type(firstName)
  cy.get('[data-test="lastName"]').type(lastName)
  cy.get('[data-test="postalCode"]').type(postalCode)
  cy.get('[data-test="continue"]').click()
  cy.get('[data-test="finish"]').click()
});

// Realiza o logout da aplicação
Cypress.Commands.add('logout', () => {
  cy.get('#react-burger-menu-btn').click()
  cy.get('#logout_sidebar_link').click()
});
