describe('monthly reminders', () => {
  beforeEach(() => {
    cy.initializeGqlIntercept({ method: 'POST', url: '/v2/*/master' });
    cy.interceptGql('reminderLists', { fixture: 'get-list' });

    cy.clock(new Date('2021, 12, 6'));
  });

  it('should display the landing page and add a new reminder list', () => {
    cy.interceptGql('createReminderList', { body: { data: {} } });

    cy.visit('/');
    cy.findByText('Bills').should('be.visible');
    cy.findByText('Chores').should('be.visible');

    cy.lighthouse();
    cy.injectAxe();
    cy.checkAccessibility();
    cy.compareSnapshot('home-page');

    cy.findByRole('button', { name: 'Create a reminder list' }).click();
    cy.findByRole('textbox', { name: 'title' }).type('List Name');
    cy.checkAccessibility();
    cy.findByRole('textbox', { name: 'title' }).blur();
    cy.compareSnapshot('create-reminder-list');
    cy.findByRole('button', { name: 'Create list' }).click();

    cy.wait('@createReminderList').gqlAssertBody(
      `mutation createReminderList {
        createReminderList(data: { title: "List Name" }) {
          id
        }
      }`
    );
  });

  it('should display a reminder list and have reminder list operations', () => {
    cy.interceptGql(
      [
        'deleteReminder',
        'updateReminder',
        'deleteReminderList',
        'createReminder',
      ],
      {
        body: { data: {} },
      }
    );
    cy.visit('/list/ckwawrhuwyd0g0d27sxp5nbsl');
    cy.findByRole('row', {
      name: 'Rent 2 www.rent.com late Remove Finish',
    }).should('be.visible');
    cy.findByRole('row', {
      name: 'Internet 12 www.internet.com due Remove Finish',
    }).should('be.visible');
    cy.findByRole('row', {
      name: 'Gas 2 www.gas.com done Remove Unfinish',
    }).should('be.visible');

    cy.lighthouse();

    cy.injectAxe();
    cy.checkAccessibility();
    cy.compareSnapshot('list-page');

    cy.findByRole('row', {
      name: 'Rent 2 www.rent.com late Remove Finish',
    })
      .findByRole('button', { name: 'Remove' })
      .click();
    cy.wait('@deleteReminder').gqlAssertBody(
      `mutation deleteReminder {
        deleteReminder(where: {id: "ckwd1ts34t3uw0c23p1ra6gzv"}) {
          id
        }
      }`
    );

    cy.findByRole('row', {
      name: 'Rent 2 www.rent.com late Remove Finish',
    })
      .findByRole('button', { name: 'Finish' })
      .click();
    cy.wait('@updateReminder').gqlAssertBody(
      `mutation updateReminder {
        updateReminder(data: {completed: true}, where: {id: "ckwd1ts34t3uw0c23p1ra6gzv"}) {
          id
        }
      }`
    );

    cy.findByRole('row', {
      name: 'Gas 2 www.gas.com done Remove Unfinish',
    })
      .should('be.visible')
      .findByRole('button', { name: 'Unfinish' })
      .click();
    cy.wait('@updateReminder').gqlAssertBody(
      `mutation updateReminder {
        updateReminder(data: {completed: false}, where: {id: "ckwz3ood4ew270b2887wh7a6z"}) {
          id
        }
      }`
    );

    cy.findByRole('button', { name: 'Create Reminder Item' }).click();
    cy.findByRole('textbox', { name: 'title' }).type('List Item Title');
    cy.findByRole('spinbutton', { name: 'due' }).type('3');
    cy.findByRole('textbox', { name: 'notes' }).type('List Item Notes');

    cy.checkAccessibility();

    cy.findByRole('textbox', { name: 'notes' }).blur();
    cy.compareSnapshot('create-reminder-item');
    cy.findByRole('button', { name: 'Create reminder' }).click();
    cy.wait('@createReminder').gqlAssertBody(
      `mutation createReminder {
        createReminder(
          data: {
            title: "List Item Title"
            notes: "List Item Notes"
            due: 3
            completed: false
            ckvr68ntz0dou01z9hvi5h3bz:{connect:{id:"ckwawrhuwyd0g0d27sxp5nbsl"}}}
        ) {
          id
        }
      }`
    );

    cy.findByRole('button', { name: 'Delete Reminder List' }).click();
    cy.wait('@deleteReminderList').gqlAssertBody(
      `mutation deleteReminderList {
        deleteReminderList(where: {id: "ckwawrhuwyd0g0d27sxp5nbsl"}) {
          id
        }
      }`
    );
  });
});
