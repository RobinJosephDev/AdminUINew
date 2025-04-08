import { EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, CalendarOutlined } from '@ant-design/icons';
import { Table, TableHeader } from '../common/Table';
import Modal from '../common/Modal';
import EditFuForm from './EditFollowup/EditFuForm';
import ViewFuForm from './ViewFollowup/ViewFuForm';
import Pagination from '../common/Pagination';
import useFollowupTable from '../../hooks/table/useFollowupTable';
import { Followup } from '../../styles/types/FollowupTypes';

const LeadFollowupTable: React.FC = () => {
  const {
    followUps,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDesc,
    selectedIds,
    paginatedData,
    totalPages,
    currentPage,
    setCurrentPage,
    isEditModalOpen,
    isViewModalOpen,
    selectedFollowup,
    setEditModalOpen,
    setViewModalOpen,
    openEditModal,
    closeEditModal,
    openViewModal,
    closeViewModal,
    toggleSelectAll,
    toggleSelect,
    deleteSelected,
    handleSort,
    updateFollowup,
    handlePageChange,
  } = useFollowupTable();

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
        <input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.length === paginatedData.length && paginatedData.length > 0} />
      ) as JSX.Element,
      render: (item: Followup) => <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} />,
    },
    { key: 'lead_no', label: 'Lead#' },
    { key: 'lead_date', label: 'Date' },
    { key: 'customer_name', label: 'Customer Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'lead_type', label: 'Lead Type' },
    {
      key: 'lead_status',
      label: 'Status',
      render: (item: { lead_status: string }) => <span className={`badge ${getStatusClass(item.lead_status)}`}>{item.lead_status}</span>,
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

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'New':
        return 'badge-new';
      case 'In Progress':
        return 'badge-in-progress';
      case 'Completed':
        return 'badge-completed';
      case 'On Hold':
        return 'badge-on-hold';
      case 'Lost':
        return 'badge-lost';
      default:
        return 'badge-default';
    }
  };

  return (
    <div>
      <div className="header-container">
        <h1 className="page-heading">Lead Follow-ups</h1>
        <div className="search-container">
          <div className="search-input-wrapper">
            <SearchOutlined className="search-icon" />
            <input className="search-bar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <button onClick={deleteSelected} className="delete-button">
            <DeleteOutlined />
          </button>
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : followUps.length === 0 ? (
        <div>No records found</div>
      ) : (
        <Table
          data={paginatedData}
          headers={headers.map((header) => ({
            ...header,
            label: renderSortableHeader(header),
          }))}
          handleSort={handleSort}
          sortBy={sortBy}
          sortDesc={sortDesc}
        />
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      {/* Edit Followup Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Edit Followup">
        {selectedFollowup && <EditFuForm followup={selectedFollowup} onClose={closeEditModal} onUpdate={updateFollowup} />}
      </Modal>

      {/* View Followup Modal */}
      <Modal isOpen={isViewModalOpen} onClose={closeViewModal} title="Follow-up Details">
        {selectedFollowup && <ViewFuForm followUp={selectedFollowup} onClose={closeViewModal} />}
      </Modal>
    </div>
  );
};

export default LeadFollowupTable;
