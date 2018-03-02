const { switchToQASpace } = require('../utils')

describe('The Example App - Error pages', () => {
  context('non QA', () => {
    it('Detects invalid credentials and shows settings form', () => {
      cy.request({
        url: '/?space_id=1&delivery_token=2&preview_token=3'
      }).then((response) => {
        expect(response.status).to.equal(200)
        cy.contains('Settings')
        cy.contains('Error occurred')
        cy.contains('Some errors occurred. Please check the error messages next to the fields.')
        cy.contains('This space does not exist or your access token is not associated with your space.')
        cy.contains('Your Delivery API key is invalid.')
      })
    })
    it('Invalid key fragments does not throw an error', () => {
      cy.visit('/?foo=bar')
    })
    it('Invalid editorial_features values fall back to false', () => {
      cy.visit('/settings?editorial_features=enabled')
      cy.get('input#input-editorial-features').should('checked')
      cy.visit('/settings?editorial_features=foo')
      cy.get('input#input-editorial-features').should('not.checked')
    })
    it('Invalid API values fall back to cda', () => {
      cy.visit('/?api=foo&locale=en-US')
      cy.get('header').should('contain', 'API: Content Delivery API')
    })
    it('404 with non existing landing pages', () => {
      cy.request({
        url: '/foo', failOnStatusCode: false
      }).then((response) => {
        const { $ } = Cypress
        expect(response.status).to.equal(404)
        cy.contains('Oops, something went wrong (404)')
        cy.contains('The page you are trying to open does not exist.')
        cy.contains('Try the following to fix the issue(s):')
        cy.contains('Make sure the content you are trying to access exists and is published.')
        cy.contains('Check if the content is in a draft or pending changes state (Content Delivery API), or if it has been deleted')
        expect($('nav.breadcrumb', response.body).length).to.equal(0)
      })
    })
    it('404 with non existing subroutes', () => {
      cy.request({
        url: '/courses/hello-contentful/foo', failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404)
        cy.contains('The page you are trying to open does not exist.')
        cy.contains('Make sure the content you are trying to access exists and is published.')
        cy.contains('Check if the content is in a draft or pending changes state (Content Delivery API), or if it has been deleted')
      })
    })
    it('404 with non existing courses', () => {
      cy.request({
        url: '/courses/foo', failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404)
        cy.contains('The course you are trying to open does not exist.')
        cy.contains('Make sure the content you are trying to access exists and is published.')
        cy.contains('Check if the content is in a draft or pending changes state (Content Delivery API), or if it has been deleted')
      })
    })
    it('404 with non existing lessons', () => {
      cy.request({
        url: '/courses/hello-contentful/lessons/foo', failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404)
        cy.contains('The lesson you are trying to open does not exist.')
        cy.contains('Make sure the content you are trying to access exists and is published.')
        cy.contains('Check if the content is in a draft or pending changes state (Content Delivery API), or if it has been deleted')
      })
    })
    it('404 with non existing categories', () => {
      cy.request({
        url: '/courses/categories/foo', failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404)
        cy.contains('The category you are trying to open does not exist.')
        cy.contains('Make sure the content you are trying to access exists and is published.')
        cy.contains('Check if the content is in a draft or pending changes state (Content Delivery API), or if it has been deleted')
      })
    })

    it('does translate error pages', () => {
      cy.request({
        url: '/foo?locale=de-DE', failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404)
        cy.contains('Diese Seite existiert nicht.')
        cy.contains('Überprüfen Sie, ob dieser Inhalt existiert und veröffentlicht wurde.')
        cy.contains('Überprüfen Sie, ob der Inhalt veröffentlicht wurde, Änderungen enthält (Content Delivery API) oder gelöscht wurde')
      })
    })

    it('does not contain reset button with default space', () => {
      cy.request({
        url: '/foo', failOnStatusCode: false
      }).then((response) => {
        expect(response.body).not.to.contain('Reset credentials to default')
      })
    })
  })

  context('QA', () => {
    beforeEach(switchToQASpace)
    it('does contain reset button with custom space', () => {
      cy.request({
        url: '/foo', failOnStatusCode: false
      }).then((response) => {
        cy.contains('Reset credentials to default')
      })
    })
  })
})
