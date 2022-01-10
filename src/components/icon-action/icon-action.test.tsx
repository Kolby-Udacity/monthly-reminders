import userEvent from '@testing-library/user-event';

import { render, screen } from '@/__tests__/utils/test-utils';

import { IconButton } from './';

describe('Icon Button', () => {
  it('should call onClick', async () => {
    const handleClick = jest.fn();

    render(
      <IconButton
        onClick={handleClick}
        text="Button Text"
        aria-label="Button"
      />
    );

    expect(screen.getByText('Button Text')).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'Button' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
