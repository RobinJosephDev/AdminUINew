import { Table, TableHeader } from '../common/Table';
import Modal from '../common/Modal';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, EyeOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import EditOrderForm from './EditOrder/EditOrderForm';
import AddOrderForm from './AddOrder/AddOrderForm';
import ViewOrderForm from './ViewOrder/ViewOrderForm';
import useOrderTable from '../../hooks/table/useOrderTable';
import Pagination from '../common/Pagination';

const OrderTable: React.FC = () => {
  const {
    fetchOrders,
    orders,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDesc,
    selectedIds,
    setSelectedIds,
    paginatedData,
    totalPages,
    currentPage,
    setCurrentPage,
    isEditModalOpen,
    isAddModalOpen,
    isViewModalOpen,
    selectedOrder,
    openEditModal,
    closeEditModal,
    openViewModal,
    closeViewModal,
    setEditModalOpen,
    setAddModalOpen,
    setViewModalOpen,
    toggleSelectAll,
    toggleSelect,
    deleteSelected,
    handleSort,
    updateOrder,
    handlePageChange,
  } = useOrderTable();

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
      label: <input type="checkbox" checked={selectedIds.length === paginatedData.length && paginatedData.length > 0} onChange={toggleSelectAll} />,
      render: (order) => <input type="checkbox" checked={selectedIds.includes(order.id)} onChange={() => toggleSelect(order.id)} />,
    },
    { key: 'customer', label: 'Customer', render: (order) => order.customer || <span>-</span> },
    { key: 'customer_ref_no', label: 'Ref No', render: (order) => order.customer_ref_no || <span>-</span> },
    { key: 'customer_po_no', label: 'PO No', render: (order) => order.customer_po_no || <span>-</span> },
    { key: 'equipment', label: 'Equipment', render: (order) => order.equipment || <span>-</span> },
    {
      key: 'pickup_date',
      label: 'Pickup Date/Time',
      render: (order) => {
        try {
          const originLocations = typeof order.origin_location === 'string' ? JSON.parse(order.origin_location) : order.origin_location;
          const pickupDate = originLocations?.[0]?.date || null;
          const pickupTime = originLocations?.[0]?.time || null;

          return pickupDate && pickupTime ? (
            <div className="pickup-date-time">
              <CalendarOutlined /> {pickupDate} <ClockCircleOutlined /> {pickupTime}
            </div>
          ) : (
            <span>-</span>
          );
        } catch (error) {
          console.error('Error parsing pickup location data:', error);
          return <span>-</span>;
        }
      },
    },
    {
      key: 'delivery_date',
      label: 'Delivery Date/Time',
      render: (order) => {
        try {
          const destinationLocations =
            typeof order.destination_location === 'string' ? JSON.parse(order.destination_location) : order.destination_location;
          const deliveryDate = destinationLocations?.[0]?.date || null;
          const deliveryTime = destinationLocations?.[0]?.time || null;

          return deliveryDate && deliveryTime ? (
            <div className="delivery-date-time">
              <CalendarOutlined /> {deliveryDate} <ClockCircleOutlined /> {deliveryTime}
            </div>
          ) : (
            <span>-</span>
          );
        } catch (error) {
          console.error('Error parsing delivery location data:', error);
          return <span>-</span>;
        }
      },
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
  return (
    <div>
      <div className="header-container">
        <div className="header-container-left">
          <h1 className="page-heading">Orders</h1>
        </div>
        <div className="search-container">
          <div className="search-input-wrapper">
            <SearchOutlined className="search-icon" />
            <input className="search-bar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <button onClick={() => setAddModalOpen(true)} className="add-button">
            <PlusOutlined />
          </button>
          <button onClick={deleteSelected} className="delete-button">
            <DeleteOutlined />
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
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

      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Order">
        {selectedOrder && <EditOrderForm order={selectedOrder} onClose={() => setEditModalOpen(false)} onUpdate={updateOrder} />}
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Add Order">
        <AddOrderForm onClose={() => setAddModalOpen(false)} onSuccess={fetchOrders} />
      </Modal>
      <Modal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} title="Order Details">
        {selectedOrder && <ViewOrderForm order={selectedOrder} onClose={() => setViewModalOpen(false)} />}
      </Modal>
    </div>
  );
};

export default OrderTable;
