import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Lead } from '../../../src/types/LeadTypes';

const API_URL = process.env.API_BASE_URL;
const useLeadTable = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof Lead>('created_at');
  const [sortDesc, setSortDesc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  //Fetch
  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      setLoading(true);
      const { data } = await axios.get<Lead[]>(`${API_URL}/lead`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredData = data.filter((lead) => lead.lead_status === 'Quotations');

      setLeads(filteredData);
    } catch (error) {
      console.error('Error loading leads:', error);
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLeads();
  }, []);

  const handleFetchError = (error: any) => {
    if (error.response && error.response.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You need to log in to access this resource.',
      });
    }
  };

  //Sorting, Filtering & Pagination
  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key as keyof Lead);
      setSortDesc(false);
    }
  };

  const filteredLeads = leads.filter((lead) =>
    Object.values(lead).some((val) => val !== null && val !== undefined && val.toString().toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedLeads = filteredLeads.sort((a, b) => {
    let valA = a[sortBy] ?? '';
    let valB = b[sortBy] ?? '';

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
    } else if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDesc ? valB - valA : valA - valB;
    }

    return 0;
  });

  const paginatedData = sortedLeads.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredLeads.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  //Selection
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map((lead) => lead.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
  };

  //Modal
  const openEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedLead(null);
  };

  const openViewModal = (lead: Lead) => {
    setSelectedLead(lead);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedLead(null);
  };

  //CRUD
  const convertToCustomer = async (lead: Lead) => {
    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: 'This lead will be converted to a customer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, convert it!',
      cancelButtonText: 'No, cancel!',
    });

    if (confirmed.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const customerData = {
          cust_name: lead.customer_name,
          cust_email: lead.email,
          cust_primary_state: lead.state,
        };
        console.log('Customer data to be inserted:', customerData);

        const response = await axios.post(`${API_URL}/customer`, customerData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Converted to customer:', response.data);

        await axios.delete(`${API_URL}/lead/${lead.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Update leads state to reflect changes in the UI
        setLeads((prevLeads) => prevLeads.filter((item) => item.id !== lead.id));

        Swal.fire('Converted!', 'The lead has been converted to a customer.', 'success');
      } catch (error) {
        console.error('Error converting lead to customer:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to convert the lead to a customer.',
        });
      }
    }
  };

  const updateLead = (updatedLead: Lead) => {
    setLeads((prevLeads) => prevLeads.map((lead) => (lead.id === updatedLead.id ? { ...lead, ...updatedLead } : lead)));
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) {
      Swal.fire({ icon: 'warning', title: 'No record selected', text: 'Please select a record to delete.' });
      return;
    }

    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete selected!',
      cancelButtonText: 'No, cancel!',
    });

    if (confirmed.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        await Promise.all(
          selectedIds.map((id) =>
            axios.delete(`${API_URL}/lead/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );

        setLeads((prevLeads) => prevLeads.filter((lead) => !selectedIds.includes(lead.id)));
        setSelectedIds([]);
        Swal.fire('Deleted!', 'Selected leads have been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting leads:', error);
        Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to delete selected leads.' });
      }
    }
  };

  return {
    fetchLeads,
    leads,
    loading,
    convertToCustomer,
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
    selectedLead,
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
    updateLead,
    handlePageChange,
  };
};

export default useLeadTable;
