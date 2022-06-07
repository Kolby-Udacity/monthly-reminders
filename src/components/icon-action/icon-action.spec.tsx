/// <reference types="@testing-library/cypress" />
import { mount } from 'cypress/react';

import { IconButton } from '.';

const mountStyle = `body { display: flex; height: 100vh; width: 100vw; align-items: center; justify-content: center; background: #dddddd } button { width: 360px !important }`;

describe('Icon Action', () => {
  it('renders and clicks an icon action button', () => {
    cy.intercept('/_next/image*', {
      fixture: 'folder.png',
    });
    const handleClick = cy.stub().as('handleClick');

    mount(
      <IconButton
        onClick={handleClick}
        text="Icon Button Text"
        aria-label="Icon Button"
      />,
      {
        style: mountStyle,
      }
    );

    cy.findByRole('button', { name: 'Icon Button' })
      .findByText('Icon Button Text')
      .should('be.visible');

    cy.findByRole('button', { name: 'Icon Button' }).click();

    cy.get('@handleClick').should('have.been.called');
  });
});
