import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import FilterBar from './FilterBar';
import { useListQuery } from '@/lib/useListQuery';

const fields = [
  { key: 'status', label: 'Status', type: 'select', options: ['failed', 'success'] },
  { key: 'asset', label: 'Asset', placeholder: 'Asset' },
];

function Harness() {
  const { getFilter, setFilter, resetFilters } = useListQuery(['status', 'asset']);
  return <FilterBar fields={fields} getFilter={getFilter} setFilter={setFilter} onReset={resetFilters} />;
}

const renderAt = (url) => render(
  <MemoryRouter initialEntries={[url]}>
    <Harness />
  </MemoryRouter>
);

describe('FilterBar active filter chips', () => {
  it('renders no chips when nothing is filtered', () => {
    renderAt('/');
    expect(screen.queryByLabelText('Active filters')).not.toBeInTheDocument();
    expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
  });

  it('shows a labelled chip and no Clear All for a single filter', () => {
    renderAt('/?status=failed');
    expect(screen.getByText('Status: failed')).toBeInTheDocument();
    expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
  });

  it('clears only that filter when a chip is dismissed', async () => {
    renderAt('/?status=failed&asset=XLM');
    await userEvent.click(screen.getByRole('button', { name: 'Clear Status filter' }));
    expect(screen.queryByText('Status: failed')).not.toBeInTheDocument();
    expect(screen.getByText('Asset: XLM')).toBeInTheDocument();
    expect(screen.getByTestId('filter-status')).toHaveValue('');
  });

  it('shows Clear All for two or more filters and clears everything', async () => {
    renderAt('/?status=failed&asset=XLM');
    await userEvent.click(screen.getByText('Clear All'));
    expect(screen.queryByLabelText('Active filters')).not.toBeInTheDocument();
    expect(screen.getByTestId('filter-asset')).toHaveValue('');
  });
});
