import { aliasOperation, fetchReminderList } from '../utils';

describe('monthly reminder list page', () => {
  beforeEach(() => {
    cy.intercept('/v2/*/master', (req) => {
      aliasOperation(req, 'reminderLists', fetchReminderList.defaultReminderList);
    });

    cy.clock(new Date('20222, 6, 10'));
    cy.visit('/list/ckx80plqwibd50c20hgqhfgz2');
  });

  it('should display the reminder list information', () => {
    cy.findByRole('heading', { name: 'Bills' }).should('be.visible');

    cy.findByRole('row', { name: 'Rent 2 www.rent.com late Remove Finish' }).should('be.visible');
    cy.findByRole('row', { name: 'Power 12 www.power.com due Remove Finish' }).should('be.visible');
    cy.findByRole('row', { name: 'Internet 2 www.internet.com done Remove Unfinish' }).should('be.visible');
  });

  it('should have reminder list item modifying functionality', () => {
    cy.intercept('/v2/*/master', (req) => {
      aliasOperation(req, 'updateReminder', { body: { data: {} } });
    });
    cy.intercept('/v2/*/master', (req) => {
      aliasOperation(req, 'deleteReminder', { body: { data: {} } });
    });

    cy.findByRole('row', { name: 'Rent 2 www.rent.com late Remove Finish' })
      .findByRole('button', { name: 'Finish' })
      .click();

    cy.wait('@updateReminder').gqlAssertBody(`
      mutation updateReminder {
        updateReminder(data: {completed: true}, where: {id: "ckx80pxbkijp30b20xh0551yi"}) {
          id
        }
      }`);

    cy.findByRole('row', { name: 'Rent 2 www.rent.com late Remove Finish' })
      .findByRole('button', { name: 'Remove' })
      .click();

    cy.wait('@deleteReminder').gqlAssertBody(`
      mutation deleteReminder {
        deleteReminder(where: {id: "ckx80pxbkijp30b20xh0551yi"}) {
          id
        }
      }`);

    cy.findByRole('row', { name: 'Internet 2 www.internet.com done Remove Unfinish' })
      .findByRole('button', { name: 'Unfinish' })
      .click();

    cy.wait('@updateReminder').gqlAssertBody(`
      mutation updateReminder {
        updateReminder(data: {completed: false}, where: {id: "cl47b83avp26y0bk2qx95b8f3"}) {
          id
        }
      }`);
  });

  it('should add a new reminder list item', () => {
    cy.intercept('/v2/*/master', (req) => {
      aliasOperation(req, 'createReminder', { body: { data: {} } });
    });

    cy.findByRole('textbox', { name: 'title' }).should('not.exist');
    cy.findByRole('button', { name: 'Create Reminder Item' }).click();
    cy.findByRole('textbox', { name: 'title' }).type('titleText');
    cy.findByRole('spinbutton', { name: 'due' }).type('3');
    cy.findByRole('textbox', { name: 'notes' }).type('notesText');

    cy.findByRole('button', { name: 'Create reminder' }).click();

    cy.wait('@createReminder').gqlAssertBody(`
      mutation createReminder {
        createReminder(
          data: {
            title: "titleText"
            notes: "notesText"
            due: 3
            completed: false
            ckvr68ntz0dou01z9hvi5h3bz:{connect:{id:"ckx80plqwibd50c20hgqhfgz2"}}}
        ) {
          id
        }
      }`);
  });

  it('should remove the reminder list', () => {
    cy.intercept('/v2/*/master', (req) => {
      aliasOperation(req, 'deleteReminderList', { body: { data: {} } });
    });

    cy.wait('@reminderLists');
    cy.findByRole('button', { name: 'Delete Reminder List' }).click();

    cy.wait('@deleteReminderList').gqlAssertBody(`
      mutation deleteReminderList {
        deleteReminderList(where: {id: "ckx80plqwibd50c20hgqhfgz2"}) {
          id
        }
      }
    `);
  });
});
