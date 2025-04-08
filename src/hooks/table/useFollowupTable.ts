import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Followup } from '../../types/FollowupTypes';

const API_URL = process.env.API_BASE_URL;
const useFollowupTable = () => {
  const [followUps, setFollowUps] = useState<Followup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof Followup>('created_at');
  const [sortDesc, setSortDesc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedFollowup, setSelectedFollowup] = useState<Followup | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        setLoading(true);
        const { data } = await axios.get<Followup[]>(`${API_URL}/lead-followup`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched Leads:', data);
        setFollowUps(data);
      } catch (error) {
        console.error('Error loading leads:', error);
        handleFetchError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowUps();
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
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const openEditModal = (followUp: Followup) => {
    setSelectedFollowup(followUp);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedFollowup(null);
  };

  const openViewModal = (followUp: Followup) => {
    setSelectedFollowup(followUp);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedFollowup(null);
  };

  const updateFollowup = (updatedFollowup: Followup) => {
    setFollowUps((prevFollowups) =>
      prevFollowups.map((followUp) => (followUp.id === updatedFollowup.id ? { ...followUp, ...updatedFollowup } : followUp))
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === followUps.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(followUps.map((followUp) => followUp.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) {
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
          selectedIds.map((id) =>
            axios.delete(`${API_URL}/lead-followup/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          )
        );

        setFollowUps((prevFollowUps) => prevFollowUps.filter((followUp) => !selectedIds.includes(followUp.id)));
        setSelectedIds([]);
        Swal.fire('Deleted!', 'Selected follow-ups have been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting follow-ups:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete selected follow-ups.',
        });
      }
    }
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key as keyof Followup);
      setSortDesc(false);
    }
  };

  // Filter and Sort
  const filteredFollowUps = followUps.filter(
    (followUp) =>
      followUp.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      followUp.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      followUp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedFollowUps = filteredFollowUps.sort((a, b) => {
    let valA = a[sortBy] ?? '';
    let valB = b[sortBy] ?? '';

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
    } else if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDesc ? valB - valA : valA - valB;
    }

    return 0;
  });

  const paginatedData = sortedFollowUps.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredFollowUps.length / rowsPerPage);

  return {
    followUps,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDesc,
    selectedIds,
    setSelectedIds,
    selectedFollowup,
    paginatedData,
    totalPages,
    currentPage,
    setCurrentPage,
    isEditModalOpen,
    isViewModalOpen,
    setEditModalOpen,
    setViewModalOpen,
    openEditModal,
    closeEditModal,
    openViewModal,
    closeViewModal,
    toggleSelectAll,
    toggleSelect,
    deleteSelected,
    handleSort,
    updateFollowup,
    handlePageChange
  };
};

export default useFollowupTable;
