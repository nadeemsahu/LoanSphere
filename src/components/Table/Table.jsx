import React from 'react';
import './Table.css';

const Table = ({ columns, data, actions, pagination = true, caption, plain = false }) => {
    return (
        <div className={`${plain ? 'table-plain' : 'table-wrapper'} fade-in delay-1`}>
            <div className="table-scroll" role="region" aria-label={caption || 'Data table'}>
                <table className="clean-table">
                    {caption && (
                        <caption className="sr-only">{caption}</caption>
                    )}
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    scope="col"
                                    className={col.align || 'text-left'}
                                >
                                    {col.header}
                                </th>
                            ))}
                            {actions && (
                                <th scope="col" className="text-right">
                                    <span className="sr-only">Actions</span>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr key={row.id || rowIndex}>
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className={col.align || 'text-left'}>
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="text-right actions-cell">
                                            {actions(row)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="no-data"
                                >
                                    No entries found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && data.length > 0 && (
                <div className="table-pagination" role="navigation" aria-label="Table pagination">
                    <span className="pagination-info" aria-live="polite">
                        Showing 1 to {data.length} of {data.length} results
                    </span>
                    <div className="pagination-controls">
                        <button className="page-btn" disabled aria-label="Previous page" type="button">Previous</button>
                        <button className="page-btn active" aria-label="Page 1" aria-current="page" type="button">1</button>
                        <button className="page-btn" disabled aria-label="Next page" type="button">Next</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
