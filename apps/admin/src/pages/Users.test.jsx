import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import Users from './Users';
import { server } from '../mocks/server';
import { describe, it, expect } from 'vitest';

const renderPage = (initialEntries = ['/users']) => render(
  <MemoryRouter initialEntries={initialEntries}>
    <Users />
  </MemoryRouter>
);

describe('Users Component', () => {
  it('displays loading state initially', () => {
    renderPage();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders the data table after a successful fetch', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    expect(screen.getByText('+1234567890')).toBeInTheDocument();
    expect(screen.getAllByText(/Total: 1/).length).toBeGreaterThan(0);
  });

  it('renders the empty state when the phone filter matches nobody', async () => {
    // The handlers return an empty page for ?phone=missing, and useListQuery
    // reads the filter straight from the URL - same URL-state bridge the
    // Transactions test pins.
    renderPage(['/users?phone=missing']);

    await waitFor(() => {
      expect(screen.getByText('No records found.')).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Phone')).toHaveValue('missing');
  });

  it('stays up and renders the empty table when the API errors', async () => {
    server.use(
      http.get('*/api/admin/users', () => (
        HttpResponse.json({ message: 'Server error' }, { status: 500 })
      )),
    );

    renderPage();

    // The page swallows the fetch error (it logs and clears loading), so the
    // observable contract is: no crash, heading still there, empty table.
    await waitFor(() => {
      expect(screen.getByText('No records found.')).toBeInTheDocument();
    });
    expect(screen.getByText('Users')).toBeInTheDocument();
  });
});
