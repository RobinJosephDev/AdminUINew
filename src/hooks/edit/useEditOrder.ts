import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Order, Location, Charge } from '../../styles/types/OrderTypes';

const API_URL = process.env.API_BASE_URL;
const useEditOrder = (order: Order | null, onClose: () => void, onUpdate: (order: Order) => void) => {
  const [formOrder, setFormOrder] = useState<Order>({
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

  useEffect(() => {
    if (order) {
      const parsedOrigins = Array.isArray(order.origin_location) ? order.origin_location : JSON.parse(order.origin_location || '[]');
      const parsedDestinations = Array.isArray(order.destination_location)
        ? order.destination_location
        : JSON.parse(order.destination_location || '[]');
      const parsedCharges = Array.isArray(order.charges) ? order.charges : JSON.parse(order.charges || '[]');
      const parsedDiscounts = Array.isArray(order.discounts) ? order.discounts : JSON.parse(order.discounts || '[]');

      const updatedOrder = {
        ...order,
        origin_location: parsedOrigins.length > 0 ? parsedOrigins : [],
        destination_location: parsedDestinations.length > 0 ? parsedDestinations : [],
        charges: parsedCharges.length > 0 ? parsedCharges : [],
        discounts: parsedDiscounts.length > 0 ? parsedDiscounts : [],
      };

      setFormOrder(updatedOrder);
    }
  }, [order]);

  const validateOrder = (): boolean => {
    return !!formOrder.customer && !!formOrder.customer_ref_no && !!formOrder.equipment && !!formOrder.load_type;
  };

  const updateOrder = async () => {
    if (!validateOrder()) {
      Swal.fire('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token || typeof token !== 'string') {
        Swal.fire({ icon: 'error', title: 'Unauthorized', text: 'Please log in again.' });
        return;
      }

      const response = await axios.put(`${API_URL}/order/${formOrder.id}`, formOrder, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({ icon: 'success', title: 'Updated!', text: 'Order updated successfully.' });
      onUpdate(response.data);
      onClose();
    } catch (error: any) {
      console.error('Error updating order:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to update order.',
      });
    }
  };

  //Origin
  const handleAddOrigin = () => {
    setFormOrder((prevOrder) =>
      prevOrder
        ? {
            ...prevOrder,
            origin_location: [
              ...prevOrder.origin_location,
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
        : prevOrder
    );
  };

  const handleRemoveOrigin = (index: number) => {
    setFormOrder((prevOrder) =>
      prevOrder
        ? {
            ...prevOrder,
            origin_location: prevOrder.origin_location.filter((_, i) => i !== index),
          }
        : prevOrder
    );
  };

  const handleOriginChange = (index: number, updatedOrigin: Location) => {
    setFormOrder((prevOrder) =>
      prevOrder
        ? {
            ...prevOrder,
            origin_location: prevOrder.origin_location.map((origin, i) => (i === index ? updatedOrigin : origin)),
          }
        : prevOrder
    );
  };

  //Destination
  const handleAddDestination = () => {
    setFormOrder((prevOrder) =>
      prevOrder
        ? {
            ...prevOrder,
            destination_location: [
              ...prevOrder.destination_location,
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
        : prevOrder
    );
  };

  const handleRemoveDestination = (index: number) => {
    setFormOrder((prevOrder) =>
      prevOrder
        ? {
            ...prevOrder,
            destination_location: prevOrder.destination_location.filter((_, i) => i !== index),
          }
        : prevOrder
    );
  };

  const handleDestinationChange = (index: number, updatedDestination: Location) => {
    setFormOrder((prevOrder) =>
      prevOrder
        ? {
            ...prevOrder,
            destination_location: prevOrder.destination_location.map((destination, i) => (i === index ? updatedDestination : destination)),
          }
        : prevOrder
    );
  };

  //Charges
  const handleAddCharge = () => {
    setFormOrder((prevOrder) =>
      prevOrder
        ? {
            ...prevOrder,
            charges: [
              ...prevOrder.charges,
              {
                type: '',
                charge: 0,
                percent: '',
              },
            ],
          }
        : prevOrder
    );
  };

  const handleRemoveCharge = (index: number) => {
    setFormOrder((prevOrder) =>
      prevOrder
        ? {
            ...prevOrder,
            charges: prevOrder.charges.filter((_, i) => i !== index),
          }
        : prevOrder
    );
  };

  const handleChargeChange = (index: number, updatedCharge: Charge) => {
    setFormOrder((prevOrder) =>
      prevOrder
        ? {
            ...prevOrder,
            charges: prevOrder.charges.map((charge, i) => (i === index ? updatedCharge : charge)),
          }
        : prevOrder
    );
  };

  //Discounts
  const handleAddDiscount = () => {
    setFormOrder((prevOrder) =>
      prevOrder
        ? {
            ...prevOrder,
            discounts: [
              ...prevOrder.discounts,
              {
                type: '',
                charge: 0,
                percent: '',
              },
            ],
          }
        : prevOrder
    );
  };

  const handleRemoveDiscount = (index: number) => {
    setFormOrder((prevOrder) =>
      prevOrder
        ? {
            ...prevOrder,
            discounts: prevOrder.discounts.filter((_, i) => i !== index),
          }
        : prevOrder
    );
  };

  const handleDiscountChange = (index: number, updatedDiscount: Charge) => {
    setFormOrder((prevOrder) =>
      prevOrder
        ? {
            ...prevOrder,
            discounts: prevOrder.discounts.map((discount, i) => (i === index ? updatedDiscount : discount)),
          }
        : prevOrder
    );
  };

  return {
    formOrder,
    setFormOrder,
    updateOrder,
    handleAddOrigin,
    handleRemoveOrigin,
    handleOriginChange,
    handleAddDestination,
    handleRemoveDestination,
    handleDestinationChange,
    handleAddCharge,
    handleRemoveCharge,
    handleChargeChange,
    handleAddDiscount,
    handleRemoveDiscount,
    handleDiscountChange,
  };
};

export default useEditOrder;
