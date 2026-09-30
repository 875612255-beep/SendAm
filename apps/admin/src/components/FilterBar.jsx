// Reusable filter bar for admin list pages. `fields` is an array of
// { key, label, placeholder?, type?: 'text' | 'select', options?: string[] }.
// Values are read from the URL via `getFilter` and written via `setFilter`,
// which keeps them in sync with the shared list query state.
export default function FilterBar({ fields = [], getFilter, setFilter, onReset }) {
  const activeFilters = fields
    .map((field) => ({ field, value: getFilter(field.key) }))
    .filter(({ value }) => value);

  return (
    <div className="mb-4">
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(e) => e.preventDefault()}
    >
      {fields.map((field) => {
        const value = getFilter(field.key);
        const common = 'text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 px-3 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40';
        return (
          <label key={field.key} className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
            {field.label}
            {field.type === 'select' ? (
              <select
                className={common}
                value={value}
                onChange={(e) => setFilter(field.key, e.target.value)}
                data-testid={`filter-${field.key}`}
              >
                <option value="">All</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                className={common}
                placeholder={field.placeholder || ''}
                value={value}
                onChange={(e) => setFilter(field.key, e.target.value)}
                data-testid={`filter-${field.key}`}
              />
            )}
          </label>
        );
      })}
      <button
        type="button"
        onClick={onReset}
        className="text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 px-3 py-1.5 font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700"
        data-testid="filter-reset"
      >
        Reset
      </button>
    </form>
    {activeFilters.length > 0 && (
      <ul className="flex flex-wrap items-center gap-2 mt-3" aria-label="Active filters">
        {activeFilters.map(({ field, value }) => (
          <li
            key={field.key}
            className="inline-flex items-center gap-1 rounded-full bg-gray-100 pl-3 pr-1 py-1 text-xs text-gray-700"
          >
            <span>{field.label}: {value}</span>
            <button
              type="button"
              onClick={() => setFilter(field.key, '')}
              aria-label={`Clear ${field.label} filter`}
              className="rounded-full px-1.5 leading-none hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
              data-testid={`filter-chip-clear-${field.key}`}
            >
              &times;
            </button>
          </li>
        ))}
        {activeFilters.length >= 2 && (
          <li>
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-medium text-gray-600 underline hover:text-gray-900"
              data-testid="filter-clear-all"
            >
              Clear All
            </button>
          </li>
        )}
      </ul>
    )}
    </div>
  );
}
