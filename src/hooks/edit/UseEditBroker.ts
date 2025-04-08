import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Broker } from '../../styles/types/BrokerTypes';

interface UseEditBrokerProps {
  broker: Broker | null;
  onUpdate: (updatedBroker: Broker) => void;
  onClose: () => void;
}

const useEditBroker = ({ broker, onUpdate, onClose }: UseEditBrokerProps) => {
  const [formBroker, setFormBroker] = useState<Broker>({
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

  const API_URL = process.env.API_BASE_URL;
  
  useEffect(() => {
    if (broker) {
      setFormBroker({
        id: broker.id || 0,
        broker_name: broker.broker_name || '',
        broker_address: broker.broker_address || '',
        broker_city: broker.broker_city || '',
        broker_state: broker.broker_state || '',
        broker_country: broker.broker_country || '',
        broker_postal: broker.broker_postal || '',
        broker_email: broker.broker_email || '',
        broker_phone: broker.broker_phone || '',
        broker_ext: broker.broker_ext || '',
        broker_fax: broker.broker_fax || '',
        created_at: broker.created_at || '',
        updated_at: broker.updated_at || '',
      });
    }
  }, [broker]);

  const validateBroker = (): boolean => {
    return !!formBroker.broker_name;
  };

  const updateBroker = async () => {
    if (!validateBroker()) {
      Swal.fire('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({ icon: 'error', title: 'Unauthorized', text: 'You are not logged in. Please log in again.' });
        return;
      }

      const response = await axios.put<Broker>(`${API_URL}/broker/${formBroker.id}`, formBroker, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({ icon: 'success', title: 'Success!', text: 'Broker details updated.' });
      onUpdate(response.data);
      onClose();
    } catch (error: any) {
      console.error('Error updating broker:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to update broker.',
      });
    }
  };

  return { formBroker, setFormBroker, updateBroker };
};

export default useEditBroker;
