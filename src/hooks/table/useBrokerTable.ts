import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Broker } from '../../styles/types/BrokerTypes';

const API_URL = process.env.API_BASE_URL;
const useBrokerTable = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof Broker>('created_at');
  const [sortDesc, setSortDesc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [selectedBrokers, setSelectedBrokers] = useState<number[]>([]);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [isEmailModalOpen, setEmailModalOpen] = useState<boolean>(false);
  const [emailData, setEmailData] = useState<any>(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchBrokers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      setLoading(true);
      const { data } = await axios.get<Broker[]>(`${API_URL}/broker`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrokers(data);
    } catch (error) {
      console.error('Error loading brokers:', error);
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
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

  const filteredBrokers = brokers.filter((broker) =>
    Object.values(broker).some((val) => val && val.toString().toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedBrokers = filteredBrokers.sort((a, b) => {
    let valA = a[sortBy] || '';
    let valB = b[sortBy] || '';
    return sortDesc ? valB.toString().localeCompare(valA.toString()) : valA.toString().localeCompare(valB.toString());
  });

  const paginatedData = sortedBrokers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredBrokers.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key as keyof Broker);
      setSortDesc(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedBrokers.length === paginatedData.length) {
      setSelectedBrokers([]);
    } else {
      setSelectedBrokers(paginatedData.map((broker) => broker.id!).filter((id): id is number => id !== undefined));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedBrokers((prevSelected) => (prevSelected.includes(id) ? prevSelected.filter((brokerId) => brokerId !== id) : [...prevSelected, id]));
  };

  const deleteSelected = async () => {
    if (!selectedBrokers.length) {
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

        await Promise.all(selectedBrokers.map((id) => axios.delete(`${API_URL}/broker/${id}`, { headers: { Authorization: `Bearer ${token}` } })));

        setBrokers((prev) => prev.filter((broker) => !selectedBrokers.includes(broker.id)));
        setSelectedBrokers([]);
        Swal.fire('Deleted!', 'The selected brokers have been removed.', 'success');
      } catch (error) {
        console.error('Error deleting selected brokers:', error);
        Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to delete selected brokers.' });
      }
    }
  };

  const openEditModal = (broker: Broker) => {
    setSelectedBroker(broker);
    setEditModalOpen(true);
  };

  const openViewModal = (broker: Broker) => {
    setSelectedBroker(broker);
    setViewModalOpen(true);
  };

  const updateBroker = (updatedBroker: Broker) => {
    setBrokers((prev) => prev.map((broker) => (broker.id === updatedBroker.id ? { ...broker, ...updatedBroker } : broker)));
  };

  //Email Handler
  const sendEmails = async () => {
    if (selectedBrokers.length === 0) {
      Swal.fire({ icon: 'warning', title: 'No brokers selected', text: 'Please select a broker to send an email to.' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      await axios.post(
        `${API_URL}/email`,
        { ids: selectedBrokers, ...emailData, module: 'brokers' },
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );

      Swal.fire('Success!', 'Email sent.', 'success');
      setEmailModalOpen(false);
      setSelectedBrokers([]);
    } catch (error) {
      console.error('Error sending email:', error);
      Swal.fire('Error!', 'Failed to send email.', 'error');
    }
  };

  return {
    fetchBrokers,
    brokers,
    setSelectedBrokers,
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
  };
};

export default useBrokerTable;
