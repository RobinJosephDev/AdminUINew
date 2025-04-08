import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Quote } from '../../styles/types/QuoteTypes';

const API_URL = process.env.API_BASE_URL;
const useQuoteTable = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof Quote>('created_at');
  const [sortDesc, setSortDesc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isEmailModalOpen, setEmailModalOpen] = useState<boolean>(false);
  const [emailData, setEmailData] = useState<{ subject: string; content: string }>({
    subject: '',
    content: '',
  });

  //Fetch
  const fetchQuotes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      setLoading(true);
      const { data } = await axios.get<Quote[]>(`${API_URL}/quote`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuotes(data);
    } catch (error) {
      console.error('Error loading quotes:', error);
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQuotes();
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
      setSortBy(key as keyof Quote);
      setSortDesc(false);
    }
  };

  const filteredQuotes = quotes.filter((quote) =>
    Object.values(quote).some((val) => val?.toString().toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedQuotes = filteredQuotes.sort((a, b) => {
    let valA = a[sortBy] ?? '';
    let valB = b[sortBy] ?? '';

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
    } else if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDesc ? valB - valA : valA - valB;
    }

    return 0;
  });

  const paginatedData = sortedQuotes.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredQuotes.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  //Selection
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map((quote) => quote.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
  };

  //Modal
  const openEditModal = (quote: Quote) => {
    setSelectedQuote(quote);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedQuote(null);
  };

  const openViewModal = (quote: Quote) => {
    setSelectedQuote(quote);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedQuote(null);
  };

  //CRUD
  const updateQuote = (updatedQuote: Quote) => {
    setQuotes((prevQuotes) => prevQuotes.map((quote) => (quote.id === updatedQuote.id ? { ...quote, ...updatedQuote } : quote)));
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

        await Promise.all(selectedIds.map((id) => axios.delete(`${API_URL}/quote/${id}`, { headers: { Authorization: `Bearer ${token}` } })));

        setQuotes((prevQuotes) => prevQuotes.filter((quote) => !selectedIds.includes(quote.id)));
        setSelectedIds([]);
        Swal.fire('Deleted!', 'Selected quotes have been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting quotes:', error);
        Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to delete selected quotes.' });
      }
    }
  };

  //Email
  const sendEmails = async () => {
    if (selectedIds.length === 0) {
      Swal.fire({ icon: 'warning', title: 'No quote selected', text: 'Please select quote to send emails to.' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      await axios.post(
        `${API_URL}/email`,
        { ids: selectedIds, ...emailData, module: 'quotes' },
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );

      Swal.fire('Success!', 'Emails have been sent.', 'success');
      setEmailModalOpen(false);
      setSelectedIds([]);
    } catch (error) {
      console.error('Error sending emails:', error);
      Swal.fire('Error!', 'Failed to send emails.', 'error');
    }
  };

  return {
    fetchQuotes,
    quotes,
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
    isViewModalOpen,
    isEmailModalOpen,
    selectedQuote,
    openEditModal,
    closeEditModal,
    openViewModal,
    closeViewModal,
    setEditModalOpen,
    setViewModalOpen,
    setEmailModalOpen,
    toggleSelectAll,
    toggleSelect,
    deleteSelected,
    emailData,
    setEmailData,
    sendEmails,
    handleSort,
    updateQuote,
    handlePageChange,
  };
};

export default useQuoteTable;
