import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Lead, Contact } from '../../styles/types/LeadTypes';

const API_URL = process.env.API_BASE_URL;
export const useAddLead = (onClose: () => void, onSuccess: () => void) => {
  const [lead, setLead] = useState<Lead>({
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
    lead_type: '',
    contact_person: '',
    notes: '',
    lead_status: '',
    follow_up_date: '',
    equipment_type: '',
    assigned_to: '',
    contacts: [],
    created_at: '',
    updated_at: '',
  });

  const validateLead = (): boolean => {
    return !!lead.lead_no && !!lead.lead_date && !!lead.lead_type && !!lead.lead_status;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateLead()) {
      Swal.fire('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Error', 'No token found', 'error');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const response = lead.id
        ? await axios.put(`${API_URL}/lead/${lead.id}`, lead, { headers })
        : await axios.post(`${API_URL}/lead`, lead, { headers });

      Swal.fire('Success', 'Lead data has been saved successfully.', 'success');
      clearLeadForm();
      onSuccess();
    } catch (error) {
      console.error('Error saving/updating lead:', error);
      Swal.fire('Error', 'An error occurred while saving/updating the lead.', 'error');
    }
  };

  const clearLeadForm = (): void => {
    setLead({
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
      lead_type: '',
      contact_person: '',
      notes: '',
      lead_status: '',
      follow_up_date: '',
      equipment_type: '',
      assigned_to: '',
      contacts: [],
      created_at: '',
      updated_at: '',
    });
  };

  const handleAddContact = () => {
    setLead((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', phone: '', email: '', fax: '', designation: '' }],
    }));
  };

  const handleRemoveContact = (index: number) => {
    setLead((prevVendor) => ({
      ...prevVendor,
      contacts: prevVendor.contacts.filter((_, i) => i !== index),
    }));
  };

  const handleContactChange = (index: number, updatedContact: Contact) => {
    const updatedContacts = lead.contacts.map((contact, i) => (i === index ? updatedContact : contact));
    setLead((prevVendor) => ({
      ...prevVendor,
      contacts: updatedContacts,
    }));
  };

  return {
    lead,
    setLead,
    handleAddContact,
    handleRemoveContact,
    handleContactChange,
    handleSubmit,
    clearLeadForm,
  };
};
