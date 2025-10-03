/// <reference types="cypress" />
/// <reference types="cypress" />
import { faker } from "@faker-js/faker"


describe('Checkout - E-commerce', () => {
  const productNames = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket'
  ];
  const randomIndex = Math.floor(Math.random() * productNames.length);
  const productRandom = productNames[randomIndex];

  beforeEach(() => {
    cy.visit('/');
    cy.login();

    // Sempre começa com 1 produto aleatório no carrinho
    cy.addToCart(productRandom);
    cy.get('.shopping_cart_link').click();
    cy.get('.cart_item').should('have.length', 1);
    cy.get('[data-test="checkout"]').click();
  });

  it('Deve validar campos obrigatórios no Step One', () => {
    // Tenta continuar sem preencher nada e valida mensagem de erro
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="error"]').should('contain.text', 'Error: First Name is required');
    cy.get('[data-test="firstName"]').should('have.class', 'input_error').and('have.class', 'error');
    cy.get('[data-test="lastName"]').should('have.class', 'input_error').and('have.class', 'error');
    cy.get('[data-test="postalCode"]').should('have.class', 'input_error').and('have.class', 'error');

    // Preenche apenas o campo First Name
    cy.get('[data-test="firstName"]').type(faker.person.firstName());
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="error"]').should('contain.text', 'Error: Last Name is required');

    // Preenche First + Last Name
    cy.get('[data-test="lastName"]').type(faker.person.lastName());
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="error"]').should('contain.text', 'Error: Postal Code is required');

    // Limpa o Last Name e preenche o Postal Code
    cy.get('[data-test="lastName"]').clear();
    cy.get('[data-test="postalCode"]').type(faker.location.zipCode());
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="error"]').should('contain.text', 'Error: Last Name is required');

    // Limpa o First Name e preenche o Last Name
    cy.get('[data-test="firstName"]').clear();
    cy.get('[data-test="lastName"]').type(faker.person.lastName());
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="error"]').should('contain.text', 'Error: First Name is required');
  });

  it('Valida Step Two', () => {
    // Preenche Step One
    cy.get('[data-test="firstName"]').type(faker.person.firstName());
    cy.get('[data-test="lastName"]').type(faker.person.lastName());
    cy.get('[data-test="postalCode"]').type(faker.location.zipCode());
    cy.get('[data-test="continue"]').click();

    // Armazena preço do produto e valida informações no Step Two
    cy.get('.inventory_item_price').invoke('text').then((priceText) => {
      const itemPrice = parseFloat(priceText.replace('$', ''));
      const tax = parseFloat((itemPrice * 0.08).toFixed(2));
      const total = parseFloat((itemPrice + tax).toFixed(2));
      cy.url().should('include', 'checkout-step-two.html');
      cy.get('.cart_item').should('have.length', 1);
      cy.get('.inventory_item_name').should('contain.text', productRandom);
      cy.contains('[data-test="payment-info-label"]', 'Payment Information').should('be.visible');
      cy.contains('[data-test="payment-info-value"]', 'SauceCard').should('be.visible');
      cy.contains('[data-test="shipping-info-label"]', 'Shipping Information').should('be.visible');
      cy.contains('[data-test="shipping-info-value"]', 'Free Pony Express Delivery!').should('be.visible');
      cy.contains('.summary_info_label', 'Price Total').should('be.visible');
      cy.contains('.summary_subtotal_label', `Item total: $${itemPrice}`).should('be.visible');
      cy.contains('.summary_tax_label', `Tax: $${tax}`).should('be.visible');
      cy.contains('.summary_total_label', `Total: $${total}`).should('be.visible');
    });
  });

  it('Deve validar valores e finalizar compra com sucesso', () => {
    // Preenche Step One
    cy.get('[data-test="firstName"]').type(faker.person.firstName());
    cy.get('[data-test="lastName"]').type(faker.person.lastName());
    cy.get('[data-test="postalCode"]').type(faker.location.zipCode());
    cy.get('[data-test="continue"]').click();

    // Valida preço do item e totais
    cy.get('.inventory_item_price').invoke('text').then((priceText) => {
      const itemPrice = parseFloat(priceText.replace('$', ''));
      const tax = parseFloat((itemPrice * 0.08).toFixed(2));
      const total = parseFloat((itemPrice + tax).toFixed(2));
      cy.contains('.summary_subtotal_label', `Item total: $${itemPrice}`).should('be.visible');
      cy.contains('.summary_tax_label', `Tax: $${tax}`).should('be.visible');
      cy.contains('.summary_total_label', `Total: $${total}`).should('be.visible');
    });

    // Finaliza compra
    cy.get('[data-test="finish"]').click();
    cy.url().should('include', 'checkout-complete.html');
    cy.contains('.title', 'Checkout: Complete!').should('be.visible');
    cy.contains('.complete-header', 'Thank you for your order!').should('be.visible');
    cy.contains('.complete-text', 'Your order has been dispatched, and will arrive just as fast as the pony can get there!').should('be.visible');

    // Volta para página inicial e valida carrinho zerado
    cy.get('[data-test="back-to-products"]').click();
    cy.url().should('include', 'inventory.html');
    cy.get('.shopping_cart_badge').should('not.exist');
  });
});
