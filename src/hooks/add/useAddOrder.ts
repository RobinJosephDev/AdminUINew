import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Order, Charge, Location } from '../../styles/types/OrderTypes';

const API_URL = process.env.API_BASE_URL;
export const useAddOrder = (onClose: () => void, onSuccess: () => void) => {
  const initialOrderState: Order = {
    id: 0,
    customer: '',
    customer_ref_no: '',
    branch: '',
    booked_by: '',
    account_rep: '',
    sales_rep: '',
    customer_po_no: '',
    commodity: '',
    equipment: '',
    load_type: '',
    temperature: '',
    origin_location: [],
    destination_location: [],
    hot: false,
    team: false,
    air_ride: false,
    tarp: false,
    hazmat: false,
    currency: '',
    base_price: '',
    charges: [],
    discounts: [],
    gst: '',
    pst: '',
    hst: '',
    qst: '',
    final_price: '',
    notes: '',
    created_at: '',
    updated_at: '',
  };

  const [order, setOrder] = useState<Order>(initialOrderState);

  const validateOrder = (): boolean => {
    return !!order.customer && !!order.customer_ref_no && !!order.equipment && !!order.load_type;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateOrder()) {
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

      const response = order.id
        ? await axios.put(`${API_URL}/order/${order.id}`, order, { headers })
        : await axios.post(`${API_URL}/order`, order, { headers });

      Swal.fire(order.id ? 'Success!' : 'Saved!', 'Order created successfully.', 'success');
      clearOrderForm();
      onSuccess();
    } catch (error: any) {
      console.error('Error saving/updating order:', error.response ? error.response.data : error.message);
      Swal.fire('Error', 'An error occurred while processing the order.', 'error');
    }
  };

  const clearOrderForm = (): void => {
    setOrder({
      id: 0,
      customer: '',
      customer_ref_no: '',
      branch: '',
      booked_by: '',
      account_rep: '',
      sales_rep: '',
      customer_po_no: '',
      commodity: '',
      equipment: '',
      load_type: '',
      temperature: '',
      origin_location: [],
      destination_location: [],
      hot: false,
      team: false,
      air_ride: false,
      tarp: false,
      hazmat: false,
      currency: '',
      base_price: '',
      charges: [],
      discounts: [],
      gst: '',
      pst: '',
      hst: '',
      qst: '',
      final_price: '',
      notes: '',
      created_at: '',
      updated_at: '',
    });
  };

  const handleAddOrigin = () => {
    setOrder((prev) => ({
      ...prev,
      origin_location: [
        ...prev.origin_location,
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
    }));
  };

  const handleRemoveOrigin = (index: number) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      origin_location: prevOrder.origin_location.filter((_, i) => i !== index),
    }));
  };

  const handleOriginChange = (index: number, updatedOrigin: Location) => {
    const updatedOrigins = order.origin_location.map((origin, i) => (i === index ? updatedOrigin : origin));
    setOrder((prevOrder) => ({
      ...prevOrder,
      origin_location: updatedOrigins,
    }));
  };

  const handleAddDestination = () => {
    setOrder((prev) => ({
      ...prev,
      destination_location: [
        ...prev.destination_location,
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
    }));
  };

  const handleRemoveDestination = (index: number) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      destination_location: prevOrder.destination_location.filter((_, i) => i !== index),
    }));
  };

  const handleDestinationChange = (index: number, updatedDestination: Location) => {
    const updatedDestinations = order.destination_location.map((destination, i) => (i === index ? updatedDestination : destination));
    setOrder((prevOrder) => ({
      ...prevOrder,
      destination_location: updatedDestinations,
    }));
  };

  const handleAddCharge = () => {
    setOrder((prev) => ({
      ...prev,
      charges: [
        ...prev.charges,
        {
          type: '',
          charge: 0,
          percent: '',
        },
      ],
    }));
  };

  const handleRemoveCharge = (index: number) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      charges: prevOrder.charges.filter((_, i) => i !== index),
    }));
  };

  const handleChargeChange = (index: number, updatedCharge: Charge) => {
    const updatedCharges = order.charges.map((charge, i) => (i === index ? updatedCharge : charge));
    setOrder((prevOrder) => ({
      ...prevOrder,
      charges: updatedCharges,
    }));
  };

  const handleAddDiscount = () => {
    setOrder((prev) => ({
      ...prev,
      discounts: [
        ...prev.discounts,
        {
          type: '',
          charge: 0,
          percent: '',
        },
      ],
    }));
  };

  const handleRemoveDiscount = (index: number) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      discounts: prevOrder.discounts.filter((_, i) => i !== index),
    }));
  };

  const handleDiscountChange = (index: number, updatedDiscount: Charge) => {
    const updatedDiscounts = order.discounts.map((discount, i) => (i === index ? updatedDiscount : discount));
    setOrder((prevOrder) => ({
      ...prevOrder,
      discounts: updatedDiscounts,
    }));
  };

  return {
    order,
    setOrder,
    handleSubmit,
    clearOrderForm,
    handleAddOrigin,
    handleOriginChange,
    handleRemoveOrigin,
    handleAddDestination,
    handleDestinationChange,
    handleRemoveDestination,
    handleAddCharge,
    handleChargeChange,
    handleRemoveCharge,
    handleAddDiscount,
    handleDiscountChange,
    handleRemoveDiscount,
  };
};

export default useAddOrder;
