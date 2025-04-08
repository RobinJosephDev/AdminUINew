import { Table, TableHeader } from '../common/Table';
import Modal from '../common/Modal';
import EditUserForm from './EditUserForm';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import AddUserForm from './AddUserForm';
import ViewUserForm from './ViewUserForm';
import Pagination from '../common/Pagination';
import useUserTable from '../../hooks/table/useUserTable';

const UserTable: React.FC = () => {
  const {
    fetchUsers,
    users,
    setSelectedUser,
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
    selectedIds,
    toggleSelectAll,
    toggleSelect,
    deleteSelected,
    isEditModalOpen,
    isAddModalOpen,
    isViewModalOpen,
    setEditModalOpen,
    setAddModalOpen,
    setViewModalOpen,
    selectedUser,
    openEditModal,
    openViewModal,
    updateUser,
  } = useUserTable();

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
      render: (item) => <input type="checkbox" checked={selectedIds.includes(item.id!)} onChange={() => toggleSelect(item.id)} />,
    },
    { key: 'name', label: 'Name', render: (item) => item.name || <span>-</span> },
    { key: 'username', label: 'Username', render: (item) => item.username || <span>-</span> },
    { key: 'email', label: 'Email', render: (item) => item.email || <span>-</span> },
    { key: 'emp_code', label: 'Employee Code', render: (item) => item.emp_code || <span>-</span> },
    { key: 'role', label: 'Role', render: (item) => item.role || <span>-</span> },
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
          <h1 className="page-heading">Users</h1>
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
      ) : users.length === 0 ? (
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
        {selectedUser && <EditUserForm user={selectedUser} onUpdate={updateUser} onClose={() => setEditModalOpen(false)} />}
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Add User">
        <AddUserForm onClose={() => setAddModalOpen(false)} onSuccess={fetchUsers} />{' '}
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} title="User Details">
        {selectedUser && <ViewUserForm user={selectedUser} onClose={() => setViewModalOpen(false)} />}
      </Modal>
    </div>
  );
};

export default UserTable;
