import '../../styles/Table.css';
import '../../styles/Badge.css';
import '../../styles/Button.css';
import '../../styles/Pagination.css';
import '../../styles/Search.css';
import '../../styles/Navbar.css';

export interface TableHeader {
  key: string;
  label: string | JSX.Element; // Accept both string and JSX.Element
  width?: string;
  render?: (item: any) => JSX.Element; // Generalized item type
}


export interface TableProps {
  data: any[];
  headers: TableHeader[];
  handleSort: (key: string) => void; // Keep it as string for flexibility
  sortBy: string;
  sortDesc: boolean;
}


export const Table: React.FC<TableProps> = ({ data, headers, handleSort, sortBy, sortDesc }) => {
  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="table table-striped">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header.key} style={{ width: header.width || 'auto' }} onClick={() => handleSort(header.key)} className="col">
                  <div className="header-content">
                    {header.label}
                    <i
                      className={`fa ${
                        sortBy === header.key
                          ? sortDesc
                            ? 'fa-sort-down' // descending
                            : '' // ascending
                          : 'fa-sort-down' // default sort icon for unsorted columns
                      }`}
                      style={{ marginLeft: '5px' }}
                    ></i>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                {headers.map((header) => (
                  <td key={header.key} className="data-row">
                    {header.render ? header.render(item) : item[header.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        
      </div>
    </div>
  );
};

export default Table;
