import React, { useContext, useState } from 'react';
import { UserContext } from '../../../UserProvider';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../../styles/Form.css';
import ShipmentDetails from './ShipmentDetails';

interface Shipment {
  id?: string;
  ship_load_date: string;
  ship_pickup_location: string;
  ship_delivery_location: string;
  ship_driver: string;
  ship_weight: string;
  ship_ftl_ltl: string;
  ship_tarp: boolean;
  ship_equipment: string;
  ship_price: string;
  ship_notes: string;
}

interface AddShipmentFormProps {
  onClose: () => void;
  onAddShipment: (shipment: Shipment) => void;
}

const AddShipmentForm: React.FC<AddShipmentFormProps> = ({ onClose, onAddShipment }) => {
  const { currentUser } = useContext(UserContext);
  const [shipment, setShipment] = useState<Shipment>({
    ship_load_date: '',
    ship_pickup_location: '',
    ship_delivery_location: '',
    ship_driver: '',
    ship_weight: '',
    ship_ftl_ltl: '',
    ship_tarp: false,
    ship_equipment: '',
    ship_price: '',
    ship_notes: '',
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      let response;
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Error', 'No token found', 'error');
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      if (shipment.id) {
        response = await axios.put(`${API_URL}/shipment/${shipment.id}`, shipment, { headers });
        Swal.fire('Updated!', 'Shipment data has been updated successfully.', 'success');
      } else {
        response = await axios.post(`${API_URL}/shipment`, shipment, { headers });
        Swal.fire('Saved!', 'Shipment data has been saved successfully.', 'success');
      }

      onAddShipment(response.data);
      clearShipmentForm();
      onClose();
    } catch (error) {
      console.error('Error saving/updating shipment:', error.response ? error.response.data : error.message);
      Swal.fire('Error', 'An error occurred while saving/updating the shipment.', 'error');
    }
  };

  const clearShipmentForm = () => {
    setShipment({
      ship_load_date: '',
      ship_pickup_location: '',
      ship_delivery_location: '',
      ship_driver: '',
      ship_weight: '',
      ship_ftl_ltl: '',
      ship_tarp: false,
      ship_equipment: '',
      ship_price: '',
      ship_notes: '',
    });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-main">
        <ShipmentDetails shipment={shipment} setShipment={setShipment} />
        <button type="submit" className="btn-submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddShipmentForm;
