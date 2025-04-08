import React from 'react';
import { Table, TableHeader } from '../common/Table';
import Modal from '../common/Modal';
import '../../styles/Form.css';
import EditLeadForm from './EditLead/EditLeadForm';
import ViewLeadForm from './ViewLead/ViewLeadForm';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, SearchOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import useLeadQuoteTable from '../../hooks/table/useLeadQuoteTable';
import { Lead } from '../../styles/types/LeadTypes';
import Pagination from '../common/Pagination';

const LeadQuoteTable: React.FC = () => {
  const {
    fetchLeads,
    leads,
    loading,
    convertToCustomer,
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDesc,
    selectedIds,
    paginatedData,
    totalPages,
    currentPage,
    isEditModalOpen,
    isAddModalOpen,
    isViewModalOpen,
    selectedLead,
    openEditModal,
    openViewModal,
    setEditModalOpen,
    setAddModalOpen,
    setViewModalOpen,
    toggleSelectAll,
    toggleSelect,
    deleteSelected,
    handleSort,
    updateLead,
    handlePageChange,
  } = useLeadQuoteTable();

  const renderSortableHeader = (header: TableHeader) => {
    if (header.key === 'checkbox' || header.key === 'actions') return header.label;
    return (
      <div className="sortable-header" onClick={() => handleSort(header.key)}>
        {header.label}
        <span className="sort-icon">{sortBy === header.key ? (sortDesc ? '▼' : '▲') : '▼'}</span>
      </div>
    );
  };

  const getStatusClass = (status: string) => {
    const statusClasses: Record<string, string> = {
      Prospect: 'badge-prospect',
      'Lanes discussed': 'badge-lanes',
      'Prod/Equip noted': 'badge-product',
      'E-mail sent': 'badge-email',
      'Portal registration': 'badge-carrier',
      Quotations: 'badge-quotation',
      'Fob/Have broker': 'badge-broker',
      'VM/No answer': 'badge-voicemail',
      'Diff Dept.': 'badge-different',
      'No reply': 'badge-callback',
      'Not Int.': 'badge-not-interested',
      'Asset based': 'badge-asset',
    };
    return statusClasses[status] || 'badge-default';
  };

  const headers: TableHeader[] = [
    {
      key: 'checkbox',
      label: (
        <input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.length === paginatedData.length && paginatedData.length > 0} />
      ) as JSX.Element,
      render: (item: Lead) => <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} />,
    },
    { key: 'lead_no', label: 'Lead#' },
    { key: 'customer_name', label: 'Name' },
    {
      key: 'lead_date',
      label: 'Date',
      render: (lead: Lead) => (
        <div className="date-picker-container-normal">
          <CalendarOutlined style={{ marginRight: 5 }} />
          {lead.lead_date ? dayjs(lead.lead_date).format('DD MMM, YYYY') : '-'}
        </div>
      ),
    },
    { key: 'city', label: 'City' },
    { key: 'lead_type', label: 'Type' },
    {
      key: 'assigned_to',
      label: 'Assigned To',
      render: (lead: Lead) => <span>{lead.assigned_to || 'Unassigned'}</span>,
    },
    {
      key: 'follow_up_date',
      label: 'Follow Up',
      render: (lead: Lead) => (
        <div className="date-picker-container">
          <CalendarOutlined style={{ marginRight: 5 }} />
          {lead.follow_up_date ? dayjs(lead.follow_up_date).format('DD MMM, YYYY') : '-'}
        </div>
      ),
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
          {item.lead_status === 'Quotations' && (
            <button onClick={() => convertToCustomer(item)} className="btn-convert">
              Convert to Customer
            </button>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="header-container">
        <div className="header-container-left">
          <h1 className="page-heading">Leads with quotes</h1>
        </div>
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
      ) : leads.length === 0 ? (
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

      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Lead">
        {selectedLead && <EditLeadForm lead={selectedLead} onClose={() => setEditModalOpen(false)} onUpdate={updateLead} />}
      </Modal>
      <Modal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} title="Lead Details">
        {selectedLead && <ViewLeadForm lead={selectedLead} onClose={() => setViewModalOpen(false)} />}
      </Modal>
    </div>
  );
};

export default LeadQuoteTable;
