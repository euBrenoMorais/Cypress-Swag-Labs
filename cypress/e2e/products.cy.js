/// <reference types="cypress" />

describe('Produtos - E-commerce', () => {
  let productNames = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket'
    ];

  beforeEach(() => {
    cy.visit('/');
    cy.login();
  });

  it('Valida adição de produtos ao carrinho', () => {
    // Seleciona um produto aleatório da lista de produtos
    const randomIndex = Math.floor(Math.random() * productNames.length);
    const randomProduct = productNames[randomIndex];

    // Adiciona o produto ao carrinho e verifica se foi adicionado corretamente
    cy.addToCart(randomProduct);
    cy.get('.shopping_cart_badge').should('contain', '1');
    cy.get(`[data-test="remove-${randomProduct.toLowerCase().replace(/ /g, '-')}" ]`).should('be.visible');
  });

  it('Valida remoção de produtos do carrinho', () => {
    // Seleciona um produto aleatório da lista de produtos
    const randomIndex = Math.floor(Math.random() * productNames.length);
    const randomProduct = productNames[randomIndex];

    // Adiciona o produto ao carrinho
    cy.addToCart(randomProduct);
    cy.get('.shopping_cart_badge').should('contain', '1');

    // Remove o produto do carrinho e verifica se foi removido corretamente
    cy.get(`[data-test="remove-${randomProduct.toLowerCase().replace(/ /g, '-')}" ]`).click();
    cy.get(`[data-test="remove-${randomProduct.toLowerCase().replace(/ /g, '-')}" ]`).should('not.exist');
    cy.get('.shopping_cart_badge').should('not.exist');
  });

  it('Valida filtro de produtos por ordem alfabética', () => {
    cy.get('.product_sort_container').select('az'); 
    cy.get('.inventory_item_name').then(($items) => {
      const names = $items.map((i, el) => Cypress.$(el).text()).get();
      const sorted = [...names].sort();
      expect(names).to.deep.equal(sorted);
    });
  });

  it('Valida filtro de produtos por menor preço', () => {
    cy.get('.product_sort_container').select('lohi'); 
    cy.get('.inventory_item_price').then(($prices) => {
      const priceNumbers = $prices.map((i, el) => parseFloat(Cypress.$(el).text().replace('$', ''))).get();
      const sorted = [...priceNumbers].sort((a, b) => a - b);
      expect(priceNumbers).to.deep.equal(sorted);
    });
  });
});
