import { EditOutlined, DeleteOutlined, MailOutlined, PlusOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { Table, TableHeader } from '../common/Table';
import Modal from '../common/Modal';
import Pagination from '../common/Pagination';
import AddBrokerForm from './AddBroker/AddBrokerForm';
import EditBrokerForm from './EditBroker/EditBrokerForm';
import ViewBrokerForm from './ViewBroker/ViewBrokerForm';
import useBrokerTable from '../../hooks/table/useBrokerTable';

const BrokerTable: React.FC = () => {
  const {
    fetchBrokers,
    brokers,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDesc,
    paginatedData,
    totalPages,
    currentPage,
    handlePageChange,
    handleSort,
    selectedBrokers,
    toggleSelectAll,
    toggleSelect,
    deleteSelected,
    isEditModalOpen,
    isAddModalOpen,
    isViewModalOpen,
    isEmailModalOpen,
    setEditModalOpen,
    setAddModalOpen,
    setViewModalOpen,
    setEmailModalOpen,
    emailData,
    setEmailData,
    sendEmails,
    selectedBroker,
    openEditModal,
    openViewModal,
    updateBroker,
  } = useBrokerTable();

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
        <input type="checkbox" onChange={toggleSelectAll} checked={selectedBrokers.length === paginatedData.length && paginatedData.length > 0} />
      ) as JSX.Element,
      render: (item) => <input type="checkbox" checked={selectedBrokers.includes(item.id!)} onChange={() => toggleSelect(item.id)} />,
    },
    { key: 'broker_name', label: 'Name', render: (item) => item.broker_name || <span>-</span> },
    { key: 'broker_city', label: 'City', render: (item) => item.broker_city || <span>-</span> },
    { key: 'broker_state', label: 'State', render: (item) => item.broker_state || <span>-</span> },
    { key: 'broker_email', label: 'Email', render: (item) => item.broker_email || <span>-</span> },
    { key: 'broker_phone', label: 'Phone', render: (item) => item.broker_phone || <span>-</span> },
    { key: 'broker_fax', label: 'Fax', render: (item) => item.broker_fax || <span>-</span> },
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

  return (
    <div>
      <div className="header-container">
        <div className="header-container-left">
          <h1 className="page-heading">Brokers</h1>
        </div>
        <div className="search-container">
          <div className="search-input-wrapper">
            <SearchOutlined className="search-icon" />
            <input className="search-bar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <button onClick={() => setAddModalOpen(true)} className="add-button">
            <PlusOutlined />
          </button>
          <button onClick={() => setEmailModalOpen(true)} className="send-email-button" disabled={selectedBrokers.length === 0}>
            <MailOutlined />
          </button>
          <button onClick={deleteSelected} className="delete-button">
            <DeleteOutlined />
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : brokers.length === 0 ? (
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

      <Modal isOpen={isEditModalOpen} title="Edit Broker" onClose={() => setEditModalOpen(false)}>
        {selectedBroker && <EditBrokerForm broker={selectedBroker} onUpdate={updateBroker} onClose={() => setEditModalOpen(false)} />}
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Add Broker">
        <AddBrokerForm onClose={() => setAddModalOpen(false)} onSuccess={fetchBrokers} />{' '}
      </Modal>

      <Modal isOpen={isEmailModalOpen} onClose={() => setEmailModalOpen(false)} title="Send Email">
        <div className="email-modal">
          <div>
            <label htmlFor="subject">Subject:</label>
            <input type="text" placeholder="Subject" onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} />
          </div>
          <div>
            <label htmlFor="content">Content:</label>
            <textarea placeholder="Content" onChange={(e) => setEmailData({ ...emailData, content: e.target.value })} />
          </div>
          <button type="submit" onClick={sendEmails}>
            Send
          </button>
        </div>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} title="Broker Details">
        {selectedBroker && <ViewBrokerForm broker={selectedBroker} onClose={() => setViewModalOpen(false)} />}
      </Modal>
    </div>
  );
};

export default BrokerTable;
