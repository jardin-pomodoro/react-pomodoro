import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WrappedApp } from './App';

describe('App', () => {
  it('Renders hello world', () => {
    render(<WrappedApp />);
    expect(
      screen.getByText(
        "Pour utilisé ce site vous avez besoin d'installer le plugin metamask"
      )
    );
  });
  // 404 page is not show it's prevent by the metamask asker.
  // it('Renders not found if invalid path', () => {
  //   render(
  //     <MemoryRouter initialEntries={['/this-route-does-not-exist']}>
  //       <App />
  //     </MemoryRouter>
  //   );
  //   expect(
  //     screen.getByRole('heading', {
  //       level: 1,
  //     })
  //   ).toHaveTextContent('Not Found');
  // });
});
