import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { User } from '../../styles/types/UserTypes';

const API_URL = process.env.API_BASE_URL;
const useUserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof User>('created_at');
  const [sortDesc, setSortDesc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      setLoading(true);
      const { data } = await axios.get<User[]>(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (error: unknown) {
      console.error('Error loading users:', error);
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFetchError = (error: any) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You need to log in to access this resource.',
      });
    }
  };
  const filteredUsers = users.filter((user) => Object.values(user).some((val) => val?.toString().toLowerCase().includes(searchQuery.toLowerCase())));

  const sortedUsers = filteredUsers.sort((a, b) => {
    let valA = a[sortBy] ?? '';
    let valB = b[sortBy] ?? '';
    if (sortBy === 'created_at' || sortBy === 'updated_at') {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
    }
    return 0;
  });

  const paginatedData = sortedUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key as keyof User);
      setSortDesc(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map((user) => user.id!).filter((id): id is number => id !== undefined));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prevSelected) => (prevSelected.includes(id) ? prevSelected.filter((userId) => userId !== id) : [...prevSelected, id]));
  };

  const deleteSelected = async () => {
    if (!selectedIds.length) {
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

        await Promise.all(selectedIds.map((id) => axios.delete(`${API_URL}/user/${id}`, { headers: { Authorization: `Bearer ${token}` } })));

        setUsers((prev) => prev.filter((user) => !selectedIds.includes(user.id)));
        setSelectedIds([]);
        Swal.fire('Deleted!', 'The selected users have been removed.', 'success');
      } catch (error) {
        console.error('Error deleting selected users:', error);
        Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to delete selected users.' });
      }
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const updateUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? { ...user, ...updatedUser } : user)));
  };

  return {
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
  };
};

export default useUserTable;
