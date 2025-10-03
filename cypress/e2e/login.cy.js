describe('Login', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Logar com sucesso', () => {
    cy.login()
    cy.url().should('include', '/inventory.html')
  })

  it('Exibir erro ao logar com senha inválida', () => {
    cy.fixture('users.json').then((users) => {
      cy.get('[data-test="username"]').type(users.username_valid)
      cy.get('[data-test="password"]').type(users.password_invalid)
    });
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="error"]').should('be.visible')
    cy.get('[data-test="username"]').should('have.class', 'input_error').and('have.class', 'error')
    cy.get('[data-test="password"]').should('have.class', 'input_error').and('have.class', 'error')
  })

  it('Exibir erro ao logar com usuário inválido', () => {
    cy.fixture('users.json').then((users) => {
      cy.get('[data-test="username"]').type(users.username_invalid)
      cy.get('[data-test="password"]').type(users.password_valid)
    });
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="error"]').should('be.visible')
    cy.get('[data-test="username"]').should('have.class', 'input_error').and('have.class', 'error')
    cy.get('[data-test="password"]').should('have.class', 'input_error').and('have.class', 'error')
  })

  it('Fazer logout com sucesso', () => {
    cy.login()
    cy.get('#react-burger-menu-btn').click()
    cy.get('#logout_sidebar_link').click()
    cy.url().should('include', '/')
    cy.get('[data-test="login-button"]').should('be.visible')
  })
})
