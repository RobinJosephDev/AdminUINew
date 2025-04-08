import { EditOutlined, DeleteOutlined, MailOutlined, PlusOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { Table, TableHeader } from '../common/Table';
import Modal from '../common/Modal';
import EditCarrierForm from './EditCarrier/EditCarrierForm';
import AddCarrierForm from './AddCarrier/AddCarrierForm';
import ViewCarrierForm from './ViewCarrier/ViewCarrierForm';
import Pagination from '../common/Pagination';
import useCarrierTable from '../../hooks/table/useCarrierTable';

const CarrierTable: React.FC = () => {
  const {
    fetchCarriers,
    carriers,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDesc,
    selectedCarriers,
    setSelectedCarriers,
    paginatedData,
    totalPages,
    currentPage,
    setCurrentPage,
    isEditModalOpen,
    isAddModalOpen,
    isViewModalOpen,
    isEmailModalOpen,
    selectedCarrier,
    setEditModalOpen,
    setAddModalOpen,
    setViewModalOpen,
    setEmailModalOpen,
    emailData,
    setEmailData,
    sendEmails,
    toggleSelectAll,
    toggleSelect,
    deleteSelected,
    openEditModal,
    openViewModal,
    handleSort,
    updateCarrier,
    handlePageChange,
  } = useCarrierTable();

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
        <input type="checkbox" onChange={toggleSelectAll} checked={selectedCarriers.length === paginatedData.length && paginatedData.length > 0} />
      ) as JSX.Element,
      render: (item) => <input type="checkbox" checked={selectedCarriers.includes(item.id!)} onChange={() => toggleSelect(item.id)} />,
    },
    { key: 'dba', label: 'DBA' },
    { key: 'legal_name', label: 'Legal Name' },
    { key: 'primary_phone', label: 'Phone' },
    { key: 'primary_city', label: 'City' },
    { key: 'carr_type', label: 'Carrier Type' },
    { key: 'rating', label: 'Rating' },
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
        <h1 className="page-heading">Carriers</h1>
        <div className="search-container">
          <div className="search-input-wrapper">
            <SearchOutlined className="search-icon" />
            <input className="search-bar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <button onClick={() => setAddModalOpen(true)} className="add-button">
            <PlusOutlined />
          </button>
          <button onClick={() => setEmailModalOpen(true)} className="send-email-button" disabled={selectedCarriers.length === 0}>
            <MailOutlined />
          </button>
          <button onClick={deleteSelected} className="delete-button">
            <DeleteOutlined />
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : carriers.length === 0 ? (
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

      <Modal isOpen={isEditModalOpen} title="Edit Carrier" onClose={() => setEditModalOpen(false)}>
        {selectedCarrier && <EditCarrierForm carrier={selectedCarrier} onUpdate={updateCarrier} onClose={() => setEditModalOpen(false)} />}
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Add Carrier">
        <AddCarrierForm onClose={() => setAddModalOpen(false)} onSuccess={fetchCarriers} />
      </Modal>

      <Modal isOpen={isEmailModalOpen} onClose={() => setEmailModalOpen(false)} title="Send Email">
        <button onClick={sendEmails}>Send</button>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} title="Carrier Details">
        {selectedCarrier && <ViewCarrierForm carrier={selectedCarrier} onClose={() => setViewModalOpen(false)} />}
      </Modal>
    </div>
  );
};

export default CarrierTable;
