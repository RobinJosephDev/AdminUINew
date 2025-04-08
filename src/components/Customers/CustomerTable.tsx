import { Table, TableHeader } from '../common/Table';
import Modal from '../common/Modal';
import '../../styles/Form.css';
import EditCustomerForm from './EditCustomer/EditCustomerForm';
import { EditOutlined, DeleteOutlined, MailOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import ViewCustomerForm from './ViewCustomer/ViewCustomerForm';
import useCustomerTable from '../../hooks/table/useCustomerTable';
import Pagination from '../common/Pagination';

const CustomerTable: React.FC = () => {
  const {
    customers,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDesc,
    selectedCustomers,
    paginatedData,
    totalPages,
    currentPage,
    setCurrentPage,
    isEditModalOpen,
    isEmailModalOpen,
    isViewModalOpen,
    selectedCustomer,
    setEditModalOpen,
    setViewModalOpen,
    setEmailModalOpen,
    toggleSelectAll,
    toggleSelect,
    deleteSelected,
    openEditModal,
    emailData,
    setEmailData,
    sendEmails,
    openViewModal,
    rowsPerPage,
    handleSort,
    updateCustomer,
    handlePageChange,
  } = useCustomerTable();

  const renderSortableHeader = (header: TableHeader) => {
    if (header.key === 'checkbox' || header.key === 'actions') return header.label;
    return (
      <div className="sortable-header" onClick={() => handleSort(header.key)}>
        {header.label}
        <span className="sort-icon">{sortBy === header.key ? (sortDesc ? '▼' : '▲') : '▼'}</span>
      </div>
    );
  };

  const headers: TableHeader[] = [
    {
      key: 'checkbox',
      label: (
        <input type="checkbox" onChange={toggleSelectAll} checked={selectedCustomers.length === paginatedData.length && paginatedData.length > 0} />
      ) as JSX.Element,
      render: (item) => <input type="checkbox" checked={selectedCustomers.includes(item.id!)} onChange={() => toggleSelect(item.id)} />,
    },
    { key: 'cust_name', label: 'Name' },
    { key: 'cust_type', label: 'Type' },
    { key: 'cust_email', label: 'Email' },
    { key: 'cust_contact_no', label: 'Contact No' },
    { key: 'cust_primary_city', label: 'Primary City' },
    { key: 'cust_primary_state', label: 'Primary State' },
    { key: 'cust_primary_country', label: 'Primary Country' },
    {
      key: 'cust_credit_status',
      label: 'Status',
      render: (item) => <span className={`badge ${getStatusClass(item.cust_credit_status)}`}>{item.cust_credit_status}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        <>
          <button onClick={() => openViewModal(item)} className="btn-view">
            <EyeOutlined />
          </button>
          <button onClick={() => openEditModal(item)} className="btn-edit">
            <EditOutlined />
          </button>
        </>
      ),
    },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'badge-product';
      case 'Not Approved':
        return 'badge-lanes';
      default:
        return 'badge-default';
    }
  };

  return (
    <div>
      <div className="header-container">
        <div className="header-container-left">
          <div className="header-actions">
            <h1 className="page-heading">Customers</h1>
          </div>
        </div>

        <div className="search-container">
          <div className="search-input-wrapper">
            <SearchOutlined className="search-icon" />
            <input className="search-bar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <button onClick={() => setEmailModalOpen(true)} className="send-email-button" disabled={selectedCustomers.length === 0}>
            <MailOutlined />
          </button>
          <button onClick={deleteSelected} className="delete-button">
            <DeleteOutlined />
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : customers.length === 0 ? (
        <div>No records found</div>
      ) : (
        <Table
          data={paginatedData}
          headers={headers.map((header) => ({
            ...header,
            label: renderSortableHeader(header), // Render sortable header logic
          }))}
          handleSort={handleSort}
          sortBy={sortBy}
          sortDesc={sortDesc}
        />
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Customer">
        {selectedCustomer && <EditCustomerForm customer={selectedCustomer} onClose={() => setEditModalOpen(false)} onUpdate={updateCustomer} />}
      </Modal>
      <Modal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} title="Customer Details">
        {selectedCustomer && <ViewCustomerForm customer={selectedCustomer} onClose={() => setViewModalOpen(false)} />}
      </Modal>
      <Modal isOpen={isEmailModalOpen} onClose={() => setEmailModalOpen(false)} title="Send Email">
        <button onClick={sendEmails}>Send</button>
      </Modal>
    </div>
  );
};

export default CustomerTable;
