import { aliasOperation, fetchReminderList } from '../utils';

describe('home page', () => {
  beforeEach(() => {
    cy.intercept('/v2/*/master', (req) => {
      aliasOperation(req, 'reminderLists', fetchReminderList.defaultReminderList);
    });

    cy.visit('/');
  });

  it('should display the list of reminders', () => {
    cy.findByRole('link', { name: 'Bills' })
      .should('be.visible')
      .should('have.attr', 'href', '/list/ckx80plqwibd50c20hgqhfgz2');

    cy.findByRole('link', { name: 'List 2' })
      .should('be.visible')
      .should('have.attr', 'href', '/list/ckx80plqwis20c20hgqhfgz2');
  });

  it('should create a new reminder list', () => {
    cy.intercept('/v2/*/master', (req) => {
      aliasOperation(req, 'createReminderList', { body: { data: {} } });
    });

    cy.findByRole('textbox', { name: 'title' }).should('not.exist');
    cy.findByRole('button', { name: 'Create a reminder list' }).click();
    cy.findByRole('textbox', { name: 'title' }).type('Example List');
    cy.findByRole('button', { name: 'Create list' }).click();

    cy.wait('@createReminderList').gqlAssertBody(`
      mutation createReminderList {
        createReminderList(data: { title: "Example List" }) {
          id
        }
      }`);
  });
});
