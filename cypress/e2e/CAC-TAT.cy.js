/// <reference types="cypress" />

describe('Central de Atendimento ao Cliente TAT', () =>{
  beforeEach(() => {
    cy.visit('./src/index.html')
  })

  it('verifyTitle', () =>{

    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', () =>{
    cy.clock()

    const longText = Cypress._.repeat('teste teste teste ', 10)

    cy.get('#firstName').type('Arthur')
    cy.get('#lastName').type('Pervital')
    cy.get('#email').type('arthur@gamil.com')
    cy.get('#open-text-area').type(longText, { delay:0 })
    cy.contains('button','Enviar').click()
    cy.get('.success').should('be.visible')

    cy.tick(3000)

    cy.get('.success').should('not.be.visible')

  })

  it('validando mensagem de erro', () => {
    cy.clock()

    cy.get('#firstName').type('Arthur')
    cy.get('form > :nth-child(1) > :nth-child(2)').type('Pervital')
    cy.get('#email').type('...')
    cy.get('#open-text-area').type('dsdjosdjdldfsfjof')
    cy.contains('button','Enviar').click()
    cy.get('.error').should('be.visible', 'Valide os campos obrigatórios!')

    cy.tick(3000)
    cy.get('.error').should('not.be.visible')
  })

  it('validando campo númerico', () => {
    cy.get('#firstName').type('Arthur')
    cy.get('#lastName').type('Pervital')
    cy.get('#email').type('ze@gmail.com')
    cy.get('#phone').type('soddl').should('not.have.value', 'abc')
    cy.get('#open-text-area').type('dsdjosdjdldfsfjof')
    cy.contains('button','Enviar').click()
    

  })

  it('preenche e limpa os campos nome, sobrenome, email', () => {
    cy.get('#firstName').type('Arthur').should('have.value', 'Arthur').clear()
    cy.get('#lastName').type('Pervital').should('have.value', 'Pervital').clear()
    cy.get('#email').type('ze@gmail.com').should('have.value', 'ze@gmail.com').clear()
    cy.get('#phone').type('9999999').should('not.have.value', 'abc').clear()
    cy.get('#open-text-area').type('dsdjosdjdldfsfjof').should('have.value', 'dsdjosdjdldfsfjof').clear()
    //cy.get('.button').click()
    
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.clock()

    cy.contains('button','Enviar').click()
    cy.get('.error > strong').should('be.visible')

    cy.tick(3000)
    cy.get('.error').should('not.be.visible')


  })

  it('envia o formulário com sucesso usando um comando customizado', () => {
    cy.clock()

    cy.filMandatoryFieldAndSubmit()

    cy.get('.success > strong').should('be.visible')

    cy.tick(3000)

    cy.get('.success').should('not.be.visible')
  })

  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product').select('YouTube').should('have.value', 'youtube')

  })

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product').select(3).should('have.value', 'mentoria')

  })

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product').select('blog').should('have.value', 'blog')

  })

  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="radio"][value ="feedback"]').check().should('be.checked')


  })

  it('marca cada tipo de atendimento', () => {
    cy.get('input[type=radio]')
        .each((typeOfService) => {
          cy.wrap(typeOfService)
          .check()
          .should('be.checked')

    })

  })

  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
  })

  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('#file-upload')
    .selectFile('cypress/fixtures/example.json')
    .should(input =>{
      expect(input[0].files[0].name).to.equal('example.json')
      console.log()
    })
  })

  it('seleciona um arquivo simulando um drag-and-drop', () =>{
    cy.get('#file-upload')
    .selectFile('cypress/fixtures/example.json',  {action: 'drag-drop'})
    .should(input =>{
      expect(input[0].files[0].name).to.equal('example.json')
      

    })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () =>{
    cy.fixture('example.json').as('sampleFile')
    cy.get('#file-upload')
    .selectFile('@sampleFile')
    .should(input =>{
      expect(input[0].files[0].name).to.equal('example.json')
      
    })
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique' , () =>{
    cy.contains('a', 'Política de Privacidade')
      .should('have.attr', 'href', 'privacy.html')
      .and('have.attr', 'target', '_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link' , () =>{
    cy.contains('a', 'Política de Privacidade')
      .invoke('removeAttr', 'target')
      .click()

    cy.contains('h1', 'CAC TAT - Política de privacidade').should('be.visible')

  })

  it('exibe e oculta as mensagens de sucesso e erro usando .invoke()', () => {
  cy.get('.success')
    .should('not.be.visible')
    .invoke('show')
    .should('be.visible')
    .and('contain', 'Mensagem enviada com sucesso.')
    .invoke('hide')
    .should('not.be.visible')
  cy.get('.error')
    .should('not.be.visible')
    .invoke('show')
    .should('be.visible')
    .and('contain', 'Valide os campos obrigatórios!')
    .invoke('hide')
    .should('not.be.visible')
})

it('preenche o campo da área de texto usando o comando invoke', () => {
  cy.get('#open-text-area')
    .invoke('val', 'Texto via invoke')
    .should('have.value', 'Texto via invoke')

  })


it('faz uma requisição HTTP' , () =>{
  cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
    .as('getResquest')
    .its('status')
    .should('be.equal', 200)
  cy.get('@getResquest')
    .its('statusText')
    .should('be.equal', 'OK')
  cy.get('@getResquest')
    .its('body')
    .should('include', 'CAC TAT')

  })

it('Encontra o gato', () => {
  cy.get('#cat')
  .invoke('show')
  .should('be.visible')
  cy.get('#title')
  .invoke('text' , 'CAT TAT')
  cy.get('#subtitle')
  .invoke('text' , 'O gato mais bonito do mundo')

  })
})
