import React from "react";
import { useTable } from "react-table";

import "../assets/styles/table.css";

const DataTable = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <div className="table-container">
      <div>
        <table className="whereabouts-data-table" {...getTableProps()}>
          <thead className="whereabouts-data-header">
            {headerGroups.map((headerGroup) => (
              <tr className="whereabouts-data-header-row"{...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th className="whereabouts-data-header-th"{...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="whereabouts-data-body" {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr className="whereabouts-data-row" {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td className="whereabouts-data-td" {...cell.getCellProps()}> {cell.render("Cell")} </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;