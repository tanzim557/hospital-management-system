/**
 * DataTable
 *
 * A reusable, styled data table component.
 *
 * Props:
 * - title: string — Header title
 * - columns: Array<{ key, label, render? }> — Column definitions
 * - data: Array<object> — Row data
 * - actions: (row) => JSX — Optional actions column renderer
 * - emptyMessage: string — Message when data is empty
 */
export default function DataTable({
  title,
  columns,
  data = [],
  actions,
  emptyMessage = 'No data available.',
}) {
  return (
    <div className="data-table-container">
      {title && (
        <div className="data-table-header">
          <h3 className="data-table-title">{title}</h3>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {data.length} records
          </span>
        </div>
      )}

      {data.length === 0 ? (
        <div className="data-table-empty">{emptyMessage}</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              {actions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {actions && <td>{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
