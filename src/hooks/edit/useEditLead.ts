import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Lead, Contact } from '../../types/LeadTypes';

// Helper function to format date strings
const formatDateForInput = (date: string | Date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

const API_URL = process.env.API_BASE_URL;
const useEditLead = (lead: Lead | null, onClose: () => void, onUpdate: (lead: Lead) => void) => {
  const [formLead, setFormLead] = useState<Lead>({
    id: 0,
    lead_no: '',
    lead_date: '',
    customer_name: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    unit_no: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    equipment_type: '',
    lead_type: '',
    lead_status: '',
    follow_up_date: '',
    contact_person: '',
    notes: '',
    assigned_to: '',
    contacts: [],
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (lead) {
      const parsedContacts = Array.isArray(lead.contacts) ? lead.contacts : JSON.parse(lead.contacts || '[]');
      const updatedLead = {
        ...lead,
        contacts: parsedContacts.length > 0 ? parsedContacts : [],
        lead_date: formatDateForInput(lead.lead_date),
        follow_up_date: formatDateForInput(lead.follow_up_date),
      };
      setFormLead(updatedLead);
    }
  }, [lead]);

  const validateLead = (): boolean => {
    return !!formLead.lead_no && !!formLead.lead_date && !!formLead.lead_type && !!formLead.lead_status;
  };

  const updateLead = async () => {
    if (!validateLead()) {
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

      const response = await axios.put(`${API_URL}/lead/${formLead.id}`, formLead, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Lead data has been updated successfully.',
      });

      onUpdate(response.data);
      onClose();
    } catch (error: any) {
      console.error('Error updating lead:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response && error.response.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to update lead.',
      });
    }
  };

  const handleAddContact = () => {
    setFormLead((prevLead) => (prevLead ? { ...prevLead, contacts: [...prevLead.contacts, { name: '', phone: '', email: '' }] } : prevLead));
  };

  const handleRemoveContact = (index: number) => {
    setFormLead((prevLead) => (prevLead ? { ...prevLead, contacts: prevLead.contacts.filter((_, i) => i !== index) } : prevLead));
  };

  const handleContactChange = (index: number, updatedContact: Contact) => {
    setFormLead((prevLead) =>
      prevLead ? { ...prevLead, contacts: prevLead.contacts.map((contact, i) => (i === index ? updatedContact : contact)) } : prevLead
    );
  };

  return {
    formLead,
    setFormLead,
    updateLead,
    handleAddContact,
    handleRemoveContact,
    handleContactChange,
  };
};

export default useEditLead;
