import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import DataTable from './DataTable';

const columns = [{ header: 'Name', accessor: 'name' }];

/** Exposes the current URL search string so tests can assert on resets. */
function LocationProbe() {
  const { search } = useLocation();
  return <span data-testid="location-search">{search}</span>;
}

function renderTable(ui, initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {ui}
      <LocationProbe />
    </MemoryRouter>
  );
}

describe('DataTable empty state', () => {
  it('shows the default message without a reset button when no filters are active', () => {
    renderTable(<DataTable columns={columns} data={[]} />);

    expect(screen.getByText('No records found.')).toBeInTheDocument();
    expect(screen.getByText(/no records to show right now/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reset filters/i })).not.toBeInTheDocument();
  });

  it('offers a one-click reset when filters caused the empty state', async () => {
    renderTable(<DataTable columns={columns} data={[]} />, ['/users?phone=555&after=cursor']);

    expect(screen.getByText(/current search or filters/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /reset filters/i }));

    // Filters and the stale cursor are cleared from the URL, which also
    // removes the reset action itself.
    expect(screen.getByTestId('location-search').textContent).toBe('');
    expect(screen.queryByRole('button', { name: /reset filters/i })).not.toBeInTheDocument();
  });

  it('does not treat pagination cursors alone as active filters', () => {
    renderTable(<DataTable columns={columns} data={[]} />, ['/users?after=abc&limit=50']);

    expect(screen.getByText(/no records to show right now/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reset filters/i })).not.toBeInTheDocument();
  });

  it('renders a custom emptyState title, description and icon', () => {
    const CustomIcon = () => <svg data-testid="custom-icon" />;
    renderTable(
      <DataTable
        columns={columns}
        data={[]}
        emptyState={{ title: 'Nothing here', description: 'Custom explanation.', icon: CustomIcon }}
      />,
      ['/users?phone=555']
    );

    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.getByText('Custom explanation.')).toBeInTheDocument();
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    // Custom copy wins, but the reset action still works.
    expect(screen.getByRole('button', { name: /reset filters/i })).toBeInTheDocument();
  });

  it('prefers the onResetFilters callback over clearing the URL', async () => {
    const onResetFilters = vi.fn();
    renderTable(
      <DataTable columns={columns} data={[]} onResetFilters={onResetFilters} />,
      ['/users?phone=555']
    );

    await userEvent.click(screen.getByRole('button', { name: /reset filters/i }));

    expect(onResetFilters).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('location-search').textContent).toBe('?phone=555');
  });
});

describe('DataTable populated table', () => {
  const cols = [
    { header: 'Name', accessor: 'name' },
    { header: 'Role', accessor: 'role' },
    { header: 'Upper', render: (row) => row.name.toUpperCase() },
  ];
  const rows = [
    { id: 'a', name: 'Ada', role: 'admin' },
    { id: 'b', name: 'Bo', role: 'viewer' },
  ];

  it('renders a header cell per column and a row per record', () => {
    renderTable(<DataTable columns={cols} data={rows} />);

    expect(screen.getAllByRole('columnheader').map((th) => th.textContent)).toEqual([
      'Name',
      'Role',
      'Upper',
    ]);
    // 1 header row + 2 body rows
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getByRole('cell', { name: 'Ada' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'viewer' })).toBeInTheDocument();
  });

  it('uses custom render functions for cell content', () => {
    renderTable(<DataTable columns={cols} data={rows} />);

    expect(screen.getByRole('cell', { name: 'ADA' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'BO' })).toBeInTheDocument();
  });

  it('marks every header cell with scope="col"', () => {
    renderTable(<DataTable columns={cols} data={rows} />);

    for (const th of screen.getAllByRole('columnheader')) {
      expect(th).toHaveAttribute('scope', 'col');
    }
  });

  it('falls back to the row index as key when keyField is missing on rows', () => {
    renderTable(<DataTable columns={cols} data={[{ name: 'X', role: 'r' }, { name: 'Y', role: 'r' }]} />);

    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('makes rows focusable and activates onRowClick with Enter, Space and click', async () => {
    const onRowClick = vi.fn();
    renderTable(<DataTable columns={cols} data={rows} onRowClick={onRowClick} />);

    const row = screen.getByRole('row', { name: 'View details for row 1' });
    expect(row).toHaveAttribute('tabindex', '0');

    await userEvent.click(row);
    row.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');

    expect(onRowClick).toHaveBeenCalledTimes(3);
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);
  });

  it('does not make rows focusable without onRowClick', () => {
    renderTable(<DataTable columns={cols} data={rows} />);

    expect(screen.queryByRole('row', { name: /View details/ })).not.toBeInTheDocument();
    expect(screen.getAllByRole('row')[1]).not.toHaveAttribute('tabindex');
  });
});

describe('DataTable accessible name', () => {
  const rows = [{ id: 'a', name: 'Ada' }];

  it('names the table from the caption prop with a visually-hidden caption', () => {
    renderTable(<DataTable caption="Registered users" columns={columns} data={rows} />);

    expect(screen.getByRole('table', { name: 'Registered users' })).toBeInTheDocument();
    const caption = screen.getByText('Registered users');
    expect(caption.tagName).toBe('CAPTION');
    expect(caption).toHaveClass('sr-only');
  });

  it('renders no caption element when the prop is omitted', () => {
    const { container } = renderTable(<DataTable columns={columns} data={rows} />);

    expect(container.querySelector('caption')).toBeNull();
  });

  it('labels the empty-state status region with the caption', () => {
    renderTable(<DataTable caption="Registered users" columns={columns} data={[]} />);

    expect(screen.getByRole('status', { name: 'Registered users' })).toBeInTheDocument();
  });

  it('treats a missing data prop as an empty table', () => {
    renderTable(<DataTable columns={columns} />);

    expect(screen.getByText('No records found.')).toBeInTheDocument();
  });
});
