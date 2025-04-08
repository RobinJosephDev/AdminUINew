import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Followup, Contact, Product } from '../../styles/types/FollowupTypes';

const API_URL = process.env.API_BASE_URL;
const useEditFollowup = (followup: Followup | null, onClose: () => void, onUpdate: (followup: Followup) => void) => {
  const [followupEdit, setFollowupEdit] = useState<Followup>({
    id: 0,
    lead_no: '',
    lead_date: '',
    customer_name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    unit_no: '',
    lead_type: '',
    contact_person: '',
    notes: '',
    next_follow_up_date: '',
    followup_type: '',
    lead_status: '',
    remarks: '',
    equipment: '',
    contacts: [],
    products: [],
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (followup) {
      setFollowupEdit({
        ...followup,
        contacts:
          Array.isArray(followup.contacts) && followup.contacts.length > 0
            ? followup.contacts.map((contact) => ({
                ...contact,
                id: contact.id,
              }))
            : [], // Default to empty array if contacts is NULL or invalid
        products:
          Array.isArray(followup.products) && followup.products.length > 0
            ? followup.products.map((product) => ({
                ...product,
                id: product.id,
              }))
            : [],
      });
    }
  }, [followup]);

  const validateFollowup = (): boolean => {
    return !!followupEdit.lead_no && !!followupEdit.lead_date && !!followupEdit.lead_type && !!followupEdit.lead_status;
  };

  const updateFollowup = async () => {
    if (!validateFollowup()) {
      Swal.fire('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'You are not logged in. Please log in again.',
        });
        return;
      }

      const response = await axios.put(`${API_URL}/lead-followup/${followupEdit.id}`, followupEdit, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Follow-up data has been updated successfully.',
      });

      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating follow-up:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to update follow-up.',
      });
    }
  };

  // ✅ Add new contact with a unique UUID
  const handleAddContact = () => {
    setFollowupEdit((prevFollowup) => ({
      ...prevFollowup,
      contacts: [
        ...prevFollowup.contacts,
        { id: '', name: '', phone: '', email: '' }, // Unique UUID
      ],
    }));
  };

  // ✅ Add new product with a unique UUID
  const handleAddProduct = () => {
    setFollowupEdit((prevFollowup) => ({
      ...prevFollowup,
      products: [
        ...prevFollowup.products,
        { id: '', name: '', quantity: 0 },
      ],
    }));
  };

  // ✅ Update a contact by ID
  const handleContactChange = (id: string | number, updatedContact: Contact) => {
    setFollowupEdit((prevFollowup) => ({
      ...prevFollowup,
      contacts: prevFollowup.contacts.map((contact) => (contact.id === id ? updatedContact : contact)),
    }));
  };

  const handleRemoveContact = (id: string | number) => {
    setFollowupEdit((prevFollowup) => ({
      ...prevFollowup,
      contacts: prevFollowup.contacts.filter((contact) => contact.id !== id), // Ensure ID is unique
    }));
  };

  // ✅ Update a product by ID
  const handleProductChange = (id: string | number, updatedProduct: Product) => {
    setFollowupEdit((prevFollowup) => ({
      ...prevFollowup,
      products: prevFollowup.products.map((product) => (product.id === id ? updatedProduct : product)),
    }));
  };

  // ✅ Remove a product by ID
  const handleRemoveProduct = (id: string | number) => {
    setFollowupEdit((prevFollowup) => ({
      ...prevFollowup,
      products: prevFollowup.products.filter((product) => product.id !== id),
    }));
  };

  return {
    followupEdit,
    setFollowupEdit,
    handleAddContact,
    handleAddProduct,
    handleContactChange,
    handleRemoveContact,
    handleProductChange,
    handleRemoveProduct,
    updateFollowup,
  };
};

export default useEditFollowup;
