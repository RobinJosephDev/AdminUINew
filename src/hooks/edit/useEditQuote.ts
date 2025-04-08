import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Quote, Location } from '../../styles/types/QuoteTypes';

const API_URL = process.env.API_BASE_URL;
const useEditQuote = (quote: Quote | null, onClose: () => void, onUpdate: (quote: Quote) => void) => {
  const [formQuote, setFormQuote] = useState<Quote>({
    id: 0,
    quote_type: '',
    quote_customer: '',
    quote_cust_ref_no: '',
    quote_booked_by: '',
    quote_temperature: '',
    quote_hot: false,
    quote_team: false,
    quote_air_ride: false,
    quote_tarp: false,
    quote_hazmat: false,
    quote_pickup: [],
    quote_delivery: [],
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (quote) {
      const parsedPickups = Array.isArray(quote.quote_pickup) ? quote.quote_pickup : JSON.parse(quote.quote_pickup || '[]');
      const parsedDeliveries = Array.isArray(quote.quote_delivery) ? quote.quote_delivery : JSON.parse(quote.quote_delivery || '[]');

      const updatedQuote = {
        ...quote,
        quote_pickup: parsedPickups.length > 0 ? parsedPickups : [],
        quote_delivery: parsedDeliveries.length > 0 ? parsedDeliveries : [],
      };

      setFormQuote(updatedQuote);
    }
  }, [quote]);

  const validateQuote = (): boolean => {
    return !!formQuote.quote_type && !!formQuote.quote_customer && !!formQuote.quote_cust_ref_no;
  };

  const updateQuote = async () => {
    if (!validateQuote()) {
      Swal.fire('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token || typeof token !== 'string') {
        Swal.fire({ icon: 'error', title: 'Unauthorized', text: 'Please log in again.' });
        return;
      }

      const response = await axios.put(`${API_URL}/quote/${formQuote.id}`, formQuote, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({ icon: 'success', title: 'Updated!', text: 'Quote updated successfully.' });
      onUpdate(response.data);
      onClose();
    } catch (error: any) {
      console.error('Error updating quote:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to update quote.',
      });
    }
  };

  //Pickup
  const handleAddPickup = () => {
    setFormQuote((prevQuote) =>
      prevQuote
        ? {
            ...prevQuote,
            quote_pickup: [
              ...prevQuote.quote_pickup,
              {
                address: '',
                city: '',
                state: '',
                postal: '',
                country: '',
                date: '',
                time: '',
                currency: '',
                equipment: '',
                pickup_po: '',
                phone: '',
                packages: 0,
                weight: 0,
                dimensions: '',
                notes: '',
              },
            ],
          }
        : prevQuote
    );
  };

  const handleRemovePickup = (index: number) => {
    setFormQuote((prevQuote) =>
      prevQuote
        ? {
            ...prevQuote,
            quote_pickup: prevQuote.quote_pickup.filter((_, i) => i !== index),
          }
        : prevQuote
    );
  };

  const handlePickupChange = (index: number, updatedPickup: Location) => {
    setFormQuote((prevQuote) =>
      prevQuote
        ? {
            ...prevQuote,
            quote_pickup: prevQuote.quote_pickup.map((pickup, i) => (i === index ? updatedPickup : pickup)),
          }
        : prevQuote
    );
  };

  //Delivery
  const handleAddDelivery = () => {
    setFormQuote((prevQuote) =>
      prevQuote
        ? {
            ...prevQuote,
            quote_delivery: [
              ...prevQuote.quote_delivery,
              {
                address: '',
                city: '',
                state: '',
                postal: '',
                country: '',
                date: '',
                time: '',
                currency: '',
                equipment: '',
                pickup_po: '',
                phone: '',
                packages: 0,
                weight: 0,
                dimensions: '',
                notes: '',
              },
            ],
          }
        : prevQuote
    );
  };

  const handleRemoveDelivery = (index: number) => {
    setFormQuote((prevQuote) =>
      prevQuote
        ? {
            ...prevQuote,
            quote_delivery: prevQuote.quote_delivery.filter((_, i) => i !== index),
          }
        : prevQuote
    );
  };

  const handleDeliveryChange = (index: number, updatedDelivery: Location) => {
    setFormQuote((prevQuote) =>
      prevQuote
        ? {
            ...prevQuote,
            quote_delivery: prevQuote.quote_delivery.map((delivery, i) => (i === index ? updatedDelivery : delivery)),
          }
        : prevQuote
    );
  };

  return {
    formQuote,
    setFormQuote,
    updateQuote,
    handleAddPickup,
    handleRemovePickup,
    handlePickupChange,
    handleAddDelivery,
    handleRemoveDelivery,
    handleDeliveryChange,
  };
};

export default useEditQuote;
