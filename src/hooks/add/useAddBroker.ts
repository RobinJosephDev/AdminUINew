// src/hooks/useBrokerForm.ts
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Broker } from '../../styles/types/BrokerTypes';

const API_URL = process.env.API_BASE_URL;
export const useAddBroker = (onClose: () => void, onSuccess: () => void) => {
  const [broker, setBroker] = useState<Broker>({
    id: 0,
    broker_name: '',
    broker_address: '',
    broker_city: '',
    broker_state: '',
    broker_country: '',
    broker_postal: '',
    broker_email: '',
    broker_phone: '',
    broker_ext: '',
    broker_fax: '',
    created_at: '',
    updated_at: '',
  });

  const validateBroker = (): boolean => {
    return !!broker.broker_name;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateBroker()) {
      Swal.fire('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }
    try {
      let response;
      const token = localStorage.getItem('token');

      if (!token) {
        Swal.fire('Error', 'No token found', 'error');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      if (broker.id) {
        response = await axios.put<Broker>(`${API_URL}/broker/${broker.id}`, broker, { headers });
        Swal.fire('Success!', 'Broker details updated.', 'success');
      } else {
        response = await axios.post<Broker>(`${API_URL}/broker`, broker, { headers });
        Swal.fire('Success!', 'Broker added successfully.', 'success');
      }

      clearBrokerForm();
      onSuccess();
    } catch (error: any) {
      console.error('Error saving/updating broker:', error.response ? error.response.data : error.message);
      Swal.fire('Error', 'An error occurred while saving/updating the broker.', 'error');
    }
  };

  const clearBrokerForm = (): void => {
    setBroker({
      id: 0,
      broker_name: '',
      broker_address: '',
      broker_city: '',
      broker_state: '',
      broker_country: '',
      broker_postal: '',
      broker_email: '',
      broker_phone: '',
      broker_ext: '',
      broker_fax: '',
      created_at: '',
      updated_at: '',
    });
  };

  return { broker, setBroker, handleSubmit };
};
