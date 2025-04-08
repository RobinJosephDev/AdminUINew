import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Vendor } from '../../styles/types/VendorTypes';

const API_URL = process.env.API_BASE_URL;
const useVendorTable = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof Vendor>('created_at');
  const [sortDesc, setSortDesc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [selectedVendors, setSelectedVendors] = useState<number[]>([]);
  const [isViewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [isEmailModalOpen, setEmailModalOpen] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [emailData, setEmailData] = useState<{ subject: string; content: string }>({
    subject: '',
    content: '',
  });

  //Fetching
  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      setLoading(true);
      const { data } = await axios.get<Vendor[]>(`${API_URL}/vendor`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVendors(data);
    } catch (error) {
      console.error('Error loading vendors:', error);
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleFetchError = (error: any) => {
    if (error.response?.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You need to log in to access this resource.',
      });
    }
  };

  //Searching, Sorting & Pagination
  const filteredVendors = vendors.filter((vendor) =>
    Object.values(vendor).some((val) => val && val.toString().toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedVendors = filteredVendors.sort((a, b) => {
    let valA = a[sortBy] || '';
    let valB = b[sortBy] || '';
    return sortDesc ? valB.toString().localeCompare(valA.toString()) : valA.toString().localeCompare(valB.toString());
  });

  const paginatedData = sortedVendors.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalPages = Math.ceil(filteredVendors.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key as keyof Vendor);
      setSortDesc(false);
    }
  };

  //Selection
  const toggleSelectAll = () => {
    if (selectedVendors.length === paginatedData.length) {
      setSelectedVendors([]);
    } else {
      setSelectedVendors(paginatedData.map((vendor) => vendor.id).filter((id): id is number => id !== undefined));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedVendors((prevSelected) => (prevSelected.includes(id) ? prevSelected.filter((vendorId) => vendorId !== id) : [...prevSelected, id]));
  };

  //Updation & Deletion
  const updateVendor = (updatedVendor: Vendor) => {
    setVendors((prev) => prev.map((vendor) => (vendor.id === updatedVendor.id ? { ...vendor, ...updatedVendor } : vendor)));
  };

  const deleteSelected = async () => {
    if (selectedVendors.length === 0) {
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

        await Promise.all(selectedVendors.map((id) => axios.delete(`${API_URL}/vendor/${id}`, { headers: { Authorization: `Bearer ${token}` } })));

        setVendors((prev) => prev.filter((vendor) => !selectedVendors.includes(vendor.id)));
        setSelectedVendors([]);
        Swal.fire('Deleted!', 'The selected vendors have been removed.', 'success');
      } catch (error) {
        console.error('Error deleting vendors:', error);
        Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to delete selected vendors.' });
      }
    }
  };

  //Modal Handlers
  const openEditModal = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setEditModalOpen(true);
  };

  const openViewModal = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setViewModalOpen(true);
  };

  const sendEmails = async () => {
    if (selectedVendors.length === 0) {
      Swal.fire({ icon: 'warning', title: 'No vendors selected', text: 'Please select a vendor to send an email to.' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      await axios.post(
        `${API_URL}/email`,
        { ids: selectedVendors, ...emailData, module: 'vendors' },
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );

      Swal.fire('Success!', 'Email sent.', 'success');
      setEmailModalOpen(false);
      setSelectedVendors([]);
    } catch (error) {
      console.error('Error sending email:', error);
      Swal.fire('Error!', 'Failed to send email.', 'error');
    }
  };

  return {
    fetchVendors,
    vendors,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDesc,
    selectedVendors,
    setSelectedVendors,
    paginatedData,
    totalPages,
    currentPage,
    setCurrentPage,
    isEditModalOpen,
    isAddModalOpen,
    isViewModalOpen,
    isEmailModalOpen,
    selectedVendor,
    setEditModalOpen,
    setAddModalOpen,
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
    handleSort,
    updateVendor,
    handlePageChange,
  };
};

export default useVendorTable;
