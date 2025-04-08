import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Customer } from '../../styles/types/CustomerTypes';

const API_URL = process.env.API_BASE_URL;
const useCustomerTable = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof Customer>('created_at');
  const [sortDesc, setSortDesc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [isEmailModalOpen, setEmailModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [emailData, setEmailData] = useState<{ subject: string; content: string }>({ subject: '', content: '' });
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) throw new Error('No token found');

        setLoading(true);
        const { data } = await axios.get<Customer[]>(`${API_URL}/customer`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCustomers(data);
      } catch (error) {
        console.error('Error loading customers:', error);
        handleFetchError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleFetchError = (error: any) => {
    if (error.response?.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You need to log in to access this resource.',
      });
      window.location.href = '/login';
    }
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) => (customer.id === updatedCustomer.id ? { ...customer, ...updatedCustomer } : customer))
    );
  };

  const toggleSelectAll = () => {
    if (selectedCustomers.length === paginatedData.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(paginatedData.map((customer) => customer.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedCustomers((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
  };

  const deleteSelected = async () => {
    if (selectedCustomers.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No record selected',
        text: 'Please select a record to delete.',
      });
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
        if (!token) {
          throw new Error('No token found');
        }

        await Promise.all(
          selectedCustomers.map((id) =>
            axios.delete(`${API_URL}/customer/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );

        setCustomers((prevCustomers) => prevCustomers.filter((customer) => !selectedCustomers.includes(customer.id)));
        setSelectedCustomers([]);
        Swal.fire('Deleted!', 'Selected customers have been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting customers:', error);
        Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to delete selected customers.' });
      }
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    Object.values(customer).some((val) => val !== null && val !== undefined && val.toString().toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedCustomers = filteredCustomers.sort((a, b) => {
    let valA = a[sortBy] ?? '';
    let valB = b[sortBy] ?? '';

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
    } else if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDesc ? valB - valA : valA - valB;
    }

    return 0;
  });

  const paginatedData = sortedCustomers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditModalOpen(true);
  };

  const openViewModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewModalOpen(true);
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key as keyof Customer);
      setSortDesc(false);
    }
  };

  const sendEmails = async () => {
    if (selectedCustomers.length === 0) {
      Swal.fire({ icon: 'warning', title: 'No customers selected', text: 'Please select customers to send emails to.' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      await axios.post(
        `${API_URL}/email`,
        { ids: selectedCustomers, ...emailData, module: 'customers' },
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );

      Swal.fire('Success!', 'Emails have been sent.', 'success');
      setEmailModalOpen(false);
      setSelectedCustomers([]);
    } catch (error) {
      console.error('Error sending emails:', error);
      Swal.fire('Error!', 'Failed to send emails.', 'error');
    }
  };

  return {
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
  };
};

export default useCustomerTable;
