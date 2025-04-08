import { useEffect, useState, useContext } from 'react';
import ViewOrderGeneral from './ViewOrderGeneral';
import ViewOrderShipment from './ViewOrderShipment';
import ViewOrderOrigin from './ViewOrderOrigin';
import ViewOrderDestination from './ViewOrderDestination';
import ViewOrderSpecs from './ViewOrderSpecs';
import ViewOrderRevenue from './ViewOrderRevenue';
import ViewOrderCharges from './ViewOrderCharges';
import ViewOrderDiscounts from './ViewOrderDiscounts';
import ViewOrderTax from './ViewOrderTax';
import { Order } from '../../../styles/types/OrderTypes';

interface ViewOrderFormProps {
  order: Order | null;
  onClose: () => void;
}

const ViewOrderForm: React.FC<ViewOrderFormProps> = ({ order, onClose }) => {
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
      setFormOrder({
        ...order,
        origin_location: Array.isArray(order.origin_location)
          ? order.origin_location
          : typeof order.origin_location === 'string'
          ? JSON.parse(order.origin_location)
          : [],

        destination_location: Array.isArray(order.destination_location)
          ? order.destination_location
          : typeof order.destination_location === 'string'
          ? JSON.parse(order.destination_location)
          : [],

        charges: Array.isArray(order.charges) ? order.charges : typeof order.charges === 'string' ? JSON.parse(order.charges) : [],

        discounts: Array.isArray(order.discounts) ? order.discounts : typeof order.discounts === 'string' ? JSON.parse(order.discounts) : [],
      });
    }
  }, [order]);

  return (
    <div className="form-container">
      <form className="form-main">
        <ViewOrderGeneral formOrder={formOrder} />
        <ViewOrderShipment formOrder={formOrder} />
        <fieldset className="form-section">
          <legend>Origin</legend>
          <hr />
          <div className="form-row">
            {formOrder.origin_location.map((origin, index) => (
              <ViewOrderOrigin key={index} origin={origin} index={index} />
            ))}
          </div>
        </fieldset>
        <fieldset className="form-section">
          <legend>Destination</legend>
          <hr />
          <div className="form-row">
            {formOrder.destination_location.map((destination, index) => (
              <ViewOrderDestination key={index} destination={destination} index={index} />
            ))}
          </div>
        </fieldset>
        <ViewOrderSpecs formOrder={formOrder} />
        <ViewOrderRevenue formOrder={formOrder} />

        <fieldset className="form-section">
          <legend>Charges</legend>
          <hr />
          <div className="form-row">
            {formOrder.charges.map((charge, index) => (
              <ViewOrderCharges key={index} charge={charge} index={index} />
            ))}
          </div>
        </fieldset>
        <fieldset className="form-section">
          <legend>Discounts</legend>
          <hr />
          <div className="form-row">
            {formOrder.discounts.map((discount, index) => (
              <ViewOrderDiscounts key={index} discount={discount} index={index} />
            ))}
          </div>
        </fieldset>
        <ViewOrderTax formOrder={formOrder} />
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose} style={{ padding: '9px 15px' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewOrderForm;
