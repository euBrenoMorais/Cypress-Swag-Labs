/// <reference types="cypress" />

describe('Carrinho de Compras - E-commerce', () => {
  const productNames = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket'
  ];

  beforeEach(() => {
    cy.visit('/');
    cy.login();
  });

  it('Adiciona um produto aleatório ao carrinho', () => {
    // Seleciona um produto aleatório da lista
    const randomIndex = Math.floor(Math.random() * productNames.length);
    const randomProduct = productNames[randomIndex];

    // Pega o preço do produto selecionado e armazena em uma variável
    cy.get('.inventory_item').contains(randomProduct).parents('.inventory_item').find('.inventory_item_price').invoke('text').then((productPrice) => {
      // Adiciona o produto ao carrinho e verifica se foi adicionado corretamente
      cy.addToCart(randomProduct);
      cy.get('.shopping_cart_badge').should('contain', '1');
      cy.get(`[data-test="remove-${randomProduct.toLowerCase().replace(/ /g, '-')}" ]`).should('be.visible');

      // Verifica se o produto correto está no carrinho
      cy.get('.shopping_cart_link').click();
      cy.get('.cart_item').should('have.length', 1);
      cy.get('.cart_item').first().find('.inventory_item_name').should('contain.text', randomProduct);
      cy.get('.cart_quantity').should('contain.text', '1');

      // Valida o preço do produto no carrinho
      cy.get('.cart_item').first().find('.inventory_item_price').should('contain.text', productPrice);
    });
    
  });

  it('Adiciona múltiplos produtos ao carrinho', () => {
    // Seleciona 3 produtos aleatórios da lista
    const selectedProducts = productNames.sort(() => 0.5 - Math.random()).slice(0, 3);

    // Adiciona os produtos selecionados ao carrinho
    selectedProducts.forEach((product) => {
      cy.addToCart(product);
    });

    // Verifica se os produtos foram adicionados corretamente
    cy.get('.shopping_cart_badge').should('contain', '3');
    selectedProducts.forEach((product) => {
      cy.get(`[data-test="remove-${product.toLowerCase().replace(/ /g, '-')}" ]`).should('be.visible');
    });

    // Pega o preço de cada produto, adiciona em um array
    cy.wrap([]).then((prices) => {
      // Para cada produto, pega o preço e armazena
      Cypress._.each(selectedProducts, (product, idx) => {
        cy.get('.inventory_item')
          .contains(product)
          .parents('.inventory_item')
          .find('.inventory_item_price')
          .invoke('text')
          .then((price) => {
            prices[idx] = price;
          });
      });

      // Após coletar os preços, valida cada um no carrinho
      cy.get('.shopping_cart_link').click();
      cy.get('.cart_item').should('have.length', selectedProducts.length);

      cy.get('.cart_item').each(($el, index) => {
        cy.wrap($el).find('.inventory_item_name').should('contain.text', selectedProducts[index]);
        cy.wrap($el).find('.inventory_item_price').should('contain.text', prices[index]);
      });
    });
  });

  it('Remove produtos do carrinho', () => {
    // Seleciona 3 produtos aleatórios da lista
    const selectedProducts = productNames.sort(() => 0.5 - Math.random()).slice(0, 3);

    // Adiciona os produtos selecionados ao carrinho
    selectedProducts.forEach((product) => {
      cy.addToCart(product);
    });

    // Valida se os produtos foram adicionados corretamente
    cy.get('.shopping_cart_badge').should('contain', '3');
    selectedProducts.forEach((product) => {
      cy.get(`[data-test="remove-${product.toLowerCase().replace(/ /g, '-')}" ]`).should('be.visible');
    });

    // Entra na página do carrinho
    cy.get('.shopping_cart_link').click();
    cy.get('.cart_item').should('have.length', 3);

    // Remove os produtos um a um e valida se o carrinho atualiza corretamente
    selectedProducts.forEach((product, index) => {
      cy.get(`[data-test="remove-${product.toLowerCase().replace(/ /g, '-')}" ]`).click();
      cy.get('.cart_item').should('have.length', 2 - index);
      if (index < 2 ) {
        cy.get('.shopping_cart_badge').should('contain', (2 - index).toString());
      } else {
        cy.get('.shopping_cart_badge').should('not.exist');
      }
    });

    // Valida se o carrinho está vazio
    cy.get('.cart_item').should('have.length', 0);
  });

  it('Valida os itens na página do carrinho', () => {
    const selectedProducts = productNames.sort(() => 0.5 - Math.random()).slice(0, 2);
    const prices = [];

    // Adiciona os produtos e coleta os preços sequencialmente
    cy.wrap(selectedProducts).each((product, idx) => {
      cy.addToCart(product);
      cy.get('.inventory_item')
        .contains(product)
        .parents('.inventory_item')
        .find('.inventory_item_price')
        .invoke('text')
        .then((price) => {
          prices[idx] = price;
        });
    }).then(() => {
      // Após adicionar os produtos, valida na página do carrinho
      cy.get('.shopping_cart_link').click();
      cy.get('.cart_item').should('have.length', 2);

      // Valida cada produto, quantidade e preço no carrinho
      cy.wrap(selectedProducts).each((product, index) => {
        cy.get('.cart_item').eq(index).find('.inventory_item_name').should('contain.text', product);
        cy.get('.cart_item').eq(index).find('.cart_quantity').should('contain.text', '1');
        cy.get('.cart_item').eq(index).find('.inventory_item_price').should('contain.text', prices[index]);
      });
    });
  });
});
