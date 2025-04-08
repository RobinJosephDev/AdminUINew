import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Carrier } from '../../styles/types/CarrierTypes';

const API_URL = process.env.API_BASE_URL;
const useCarrierTable = () => {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof Carrier>('created_at');
  const [sortDesc, setSortDesc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [selectedCarriers, setSelectedCarriers] = useState<number[]>([]);
  const [isViewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [isEmailModalOpen, setEmailModalOpen] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [emailData, setEmailData] = useState<{ subject: string; content: string }>({
    subject: '',
    content: '',
  });

  const fetchCarriers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      setLoading(true);
      const { data } = await axios.get<Carrier[]>(`${API_URL}/carrier`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCarriers(data);
    } catch (error) {
      console.error('Error loading carriers:', error);
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarriers();
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

  const filteredCarriers = carriers.filter((carrier) =>
    Object.values(carrier).some((val) => val && val.toString().toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedCarriers = filteredCarriers.sort((a, b) => {
    let valA = a[sortBy] ?? '';
    let valB = b[sortBy] ?? '';

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
    } else if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDesc ? valB - valA : valA - valB;
    }

    return 0;
  });
  const paginatedData = sortedCarriers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalPages = Math.ceil(filteredCarriers.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key as keyof Carrier);
      setSortDesc(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedCarriers.length === paginatedData.length) {
      setSelectedCarriers([]);
    } else {
      setSelectedCarriers(paginatedData.map((carrier) => carrier.id!).filter((id): id is number => id !== undefined));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedCarriers((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
  };

  const updateCarrier = (updatedCarrier: Carrier) => {
    setCarriers((prevCarriers) => prevCarriers.map((carrier) => (carrier.id === updatedCarrier.id ? { ...carrier, ...updatedCarrier } : carrier)));
  };

  const deleteSelected = async () => {
    if (!selectedCarriers.length) {
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

        await Promise.all(selectedCarriers.map((id) => axios.delete(`${API_URL}/carrier/${id}`, { headers: { Authorization: `Bearer ${token}` } })));

        setCarriers((prev) => prev.filter((carrier) => !selectedCarriers.includes(carrier.id)));
        setSelectedCarriers([]);
        Swal.fire('The selected carriers have been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting carriers:', error);
        Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to delete selected carriers.' });
      }
    }
  };

  const openEditModal = (carrier: Carrier) => {
    setSelectedCarrier(carrier);
    setEditModalOpen(true);
  };

  const openViewModal = (carrier: Carrier) => {
    setSelectedCarrier(carrier);
    setViewModalOpen(true);
  };

  const sendEmails = async () => {
    if (selectedCarriers.length === 0) {
      Swal.fire({ icon: 'warning', title: 'No carriers selected', text: 'Please select carriers to send emails to.' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      await axios.post(
        `${API_URL}/email`,
        { ids: selectedCarriers, ...emailData, module: 'carriers' },
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );

      Swal.fire('Success!', 'Emails have been sent.', 'success');
      setEmailModalOpen(false);
      setSelectedCarriers([]);
    } catch (error) {
      console.error('Error sending emails:', error);
      Swal.fire('Error!', 'Failed to send emails.', 'error');
    }
  };

  return {
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
    toggleSelectAll,
    toggleSelect,
    deleteSelected,
    openEditModal,
    emailData,
    setEmailData,
    sendEmails,
    openViewModal,
    handleSort,
    updateCarrier,
    handlePageChange,
  };
};

export default useCarrierTable;
