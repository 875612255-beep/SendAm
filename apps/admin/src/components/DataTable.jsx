import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { SearchX, FilterX } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

/**
 * Generic data table with row-click support, keyboard navigation,
 * and high-performance virtualized scrolling for large data sets (100+ items).
 *
 * Props:
 *   columns        — array of { header, accessor?, render? }
 *   data           — array of row objects
 *   caption        — accessible name for the table; rendered as a visually-hidden
 *                    <caption> (and used as the empty-state label) so screen-reader
 *                    users can identify the table's purpose
 *   keyField       — unique key field name (default: 'id')
 *   onRowClick     — optional (row) => void handler; makes rows focusable / clickable
 *   rowClassName   — optional extra class(es) added to every <tr>
 *   emptyState     — optional { title, description, icon } overriding the default
 *                    copy/icon used when a query yields no rows
 *   filtersActive  — optional boolean; when omitted it is derived from the URL
 *                    (any query param besides the pagination cursors counts as a filter)
 *   onResetFilters — optional callback for the empty-state "Reset Filters" button;
 *                    defaults to clearing the filter params from the URL
 *   rowHeight      — estimated height of each row in px (default: 53)
 *   maxHeight      — max scroll container height in px or CSS value (default: 600)
 *   overscan       — number of buffer items above and below viewport (default: 5)
 *   virtualizeThreshold — min rows before virtualization activates (default: 50)
 */

// Pagination cursors and page size are not filters — they must not trigger the
// "Reset Filters" recovery action in the empty state.
const NON_FILTER_PARAMS = new Set(['after', 'before', 'limit']);

export default function DataTable({
  columns,
  data,
  caption,
  keyField = 'id',
  onRowClick,
  rowClassName = '',
  emptyState,
  filtersActive,
  onResetFilters,
  rowHeight = 53,
  maxHeight = 600,
  overscan = 5,
  virtualizeThreshold = 50,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const hasActiveFilters =
    filtersActive ??
    Array.from(searchParams.keys()).some((key) => !NON_FILTER_PARAMS.has(key));

  const containerRef = useRef(null);
  const rowRefs = useRef(new Map());
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(
    typeof maxHeight === 'number' ? maxHeight : 600
  );
  const [focusedIndex, setFocusedIndex] = useState(null);

  const totalRows = data ? data.length : 0;
  const isVirtualized = totalRows >= virtualizeThreshold;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateHeight = () => {
      if (el.clientHeight > 0) {
        setContainerHeight(el.clientHeight);
      }
    };

    updateHeight();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateHeight);
      observer.observe(el);
      return () => observer.disconnect();
    }
  }, []);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const { startIndex, topPadding, bottomPadding, visibleRows } = useMemo(() => {
    if (!isVirtualized || totalRows === 0) {
      return {
        startIndex: 0,
        endIndex: totalRows - 1,
        topPadding: 0,
        bottomPadding: 0,
        visibleRows: data || [],
      };
    }

    const calculatedStart = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / rowHeight);
    const calculatedEnd = Math.min(totalRows - 1, calculatedStart + visibleCount + overscan * 2);

    const start = Math.max(0, calculatedStart);
    const end = Math.min(totalRows - 1, calculatedEnd);

    const topPad = start * rowHeight;
    const bottomPad = Math.max(0, (totalRows - 1 - end) * rowHeight);
    const sliced = data.slice(start, end + 1);

    return {
      startIndex: start,
      endIndex: end,
      topPadding: topPad,
      bottomPadding: bottomPad,
      visibleRows: sliced,
    };
  }, [isVirtualized, totalRows, scrollTop, rowHeight, overscan, containerHeight, data]);

  const scrollRowIntoView = useCallback(
    (targetIndex) => {
      const el = containerRef.current;
      if (!el || targetIndex == null || targetIndex < 0 || targetIndex >= totalRows) return;

      const targetTop = targetIndex * rowHeight;
      const targetBottom = targetTop + rowHeight;
      const currentScrollTop = el.scrollTop || scrollTop;
      const viewHeight = el.clientHeight || containerHeight;

      let newScrollTop = null;
      if (targetTop < currentScrollTop) {
        newScrollTop = targetTop;
      } else if (targetBottom > currentScrollTop + viewHeight) {
        newScrollTop = targetBottom - viewHeight;
      }

      if (newScrollTop != null) {
        el.scrollTop = newScrollTop;
        setScrollTop(newScrollTop);
      }
    },
    [totalRows, rowHeight, scrollTop, containerHeight]
  );

  const focusRow = useCallback(
    (index) => {
      const targetIndex = Math.max(0, Math.min(totalRows - 1, index));
      setFocusedIndex(targetIndex);
      scrollRowIntoView(targetIndex);
      const domEl = rowRefs.current.get(targetIndex);
      if (domEl) {
        domEl.focus();
      }
    },
    [totalRows, scrollRowIntoView]
  );

  useEffect(() => {
    if (focusedIndex != null) {
      const domEl = rowRefs.current.get(focusedIndex);
      if (domEl && document.activeElement !== domEl) {
        domEl.focus();
      }
    }
  }, [focusedIndex, visibleRows]);

  const handleKeyDown = (e, rowIndex) => {
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        focusRow(rowIndex + 1);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        focusRow(rowIndex - 1);
        break;
      }
      case 'Home': {
        e.preventDefault();
        focusRow(0);
        break;
      }
      case 'End': {
        e.preventDefault();
        focusRow(totalRows - 1);
        break;
      }
      case 'Enter':
      case ' ': {
        if (onRowClick) {
          e.preventDefault();
          onRowClick(data[rowIndex]);
        }
        break;
      }
      default:
        break;
    }
  };

  if (!data || data.length === 0) {
    const {
      title = 'No records found.',
      description = hasActiveFilters
        ? 'No records match your current search or filters. Reset them to see the full list again.'
        : 'There are no records to show right now. New records will appear here as soon as they exist.',
      icon: Icon = hasActiveFilters ? FilterX : SearchX,
    } = emptyState || {};

    const handleReset = () => {
      if (onResetFilters) {
        onResetFilters();
        return;
      }
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const key of Array.from(next.keys())) {
          if (key !== 'limit') next.delete(key);
        }
        return next;
      });
    };

    return (
      <div
        role="status"
        aria-label={caption}
        className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm px-6 py-14 sm:py-16 text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary dark:bg-teal-950/50 text-primary dark:text-teal-400">
          <Icon className="w-6 h-6" aria-hidden="true" />
        </div>
        <p className="mt-4 text-base sm:text-lg font-semibold text-dark dark:text-white">{title}</p>
        <p className="mt-2 mx-auto max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">{description}</p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            data-testid="empty-reset-filters"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary dark:bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <FilterX size={16} aria-hidden="true" />
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  const containerStyle = isVirtualized
    ? {
        maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
        overflowY: 'auto',
      }
    : undefined;

  return (
    <div
      ref={containerRef}
      onScroll={isVirtualized ? handleScroll : undefined}
      style={containerStyle}
      data-testid="datatable-container"
      data-virtualized={isVirtualized ? 'true' : 'false'}
      className="w-full max-w-full overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm focus:outline-none"
    >
      <table className="min-w-max w-full text-sm text-left text-gray-600 dark:text-gray-300 border-collapse">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className={`text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-slate-800/60 border-b border-gray-100 dark:border-slate-800 ${isVirtualized ? 'sticky top-0 z-10' : ''}`}>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} scope="col" className="px-4 sm:px-6 py-4 whitespace-nowrap bg-gray-50 dark:bg-slate-800">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Top virtual spacer */}
          {isVirtualized && topPadding > 0 && (
            <tr style={{ height: `${topPadding}px` }} aria-hidden="true">
              <td colSpan={columns.length} style={{ padding: 0, border: 'none' }} />
            </tr>
          )}

          {/* Visible Rows */}
          {visibleRows.map((row, relativeIdx) => {
            const absoluteIdx = isVirtualized ? startIndex + relativeIdx : relativeIdx;
            const rowKey = row[keyField] || absoluteIdx;
            const isClickable = Boolean(onRowClick);

            return (
              <tr
                key={rowKey}
                ref={(el) => {
                  if (el) rowRefs.current.set(absoluteIdx, el);
                  else rowRefs.current.delete(absoluteIdx);
                }}
                data-row-index={absoluteIdx}
                className={`border-b border-gray-50 dark:border-slate-800/60 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-gray-100 dark:focus:bg-slate-800 ${rowClassName}`}
                onClick={isClickable ? () => onRowClick(row) : undefined}
                onKeyDown={(e) => handleKeyDown(e, absoluteIdx)}
                tabIndex={isClickable || isVirtualized ? 0 : undefined}
                aria-label={isClickable ? `View details for row ${absoluteIdx + 1}` : undefined}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            );
          })}

          {/* Bottom virtual spacer */}
          {isVirtualized && bottomPadding > 0 && (
            <tr style={{ height: `${bottomPadding}px` }} aria-hidden="true">
              <td colSpan={columns.length} style={{ padding: 0, border: 'none' }} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
