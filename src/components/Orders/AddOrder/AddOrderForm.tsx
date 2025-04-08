import '../../../styles/Form.css';
import OrderGeneral from './OrderGeneral';
import OrderShipment from './OrderShipment';
import OrderOrigin from '../OrderOrigin';
import OrderDestination from '../OrderDestination';
import OrderSpecs from './OrderSpecs';
import OrderRevenue from './OrderRevenue';
import OrderCharges from '../OrderCharges';
import OrderDiscounts from '../OrderDiscounts';
import OrderTax from './OrderTax';
import { PlusOutlined } from '@ant-design/icons';
import { useAddOrder } from '../../../hooks/add/useAddOrder';

interface AddOrderFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddOrderForm: React.FC<AddOrderFormProps> = ({ onClose, onSuccess }) => {
  const {
    order,
    setOrder,
    handleSubmit,
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
  } = useAddOrder(onClose, onSuccess);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-main">
        <OrderGeneral order={order} setOrder={setOrder} />
        <OrderShipment order={order} setOrder={setOrder} />
        <fieldset className="form-section">
          <legend>Origin</legend>
          <hr />
          <div className="form-row">
            {order.origin_location.map((origin, index) => (
              <OrderOrigin
                order={order}
                setOrder={setOrder}
                key={index}
                origin_location={order.origin_location}
                index={index}
                onAddOrigin={handleAddOrigin}
                handleOriginChange={handleOriginChange}
                handleRemoveOrigin={handleRemoveOrigin}
              />
            ))}
          </div>
          {order.origin_location.length === 0 && (
            <button type="button" onClick={handleAddOrigin} className="add-button">
              <PlusOutlined />
            </button>
          )}
        </fieldset>
        <fieldset className="form-section">
          <legend>Destination</legend>
          <hr />
          <div className="form-row">
            {order.destination_location.map((destination, index) => (
              <OrderDestination
                order={order}
                setOrder={setOrder}
                key={index}
                destination_location={order.destination_location}
                index={index}
                onAddDestination={handleAddDestination}
                handleDestinationChange={handleDestinationChange}
                handleRemoveDestination={handleRemoveDestination}
              />
            ))}
          </div>
          {order.destination_location.length === 0 && (
            <button type="button" onClick={handleAddDestination} className="add-button">
              <PlusOutlined />
            </button>
          )}
        </fieldset>

        <OrderSpecs order={order} setOrder={setOrder} />
        <OrderRevenue order={order} setOrder={setOrder} />
        <fieldset className="form-section">
          <legend>Charges</legend>
          <hr />
          <div className="form-row">
            {order.charges.map((charge, index) => (
              <OrderCharges
                order={order}
                setOrder={setOrder}
                key={index}
                charges={order.charges}
                index={index}
                onAddCharge={handleAddCharge}
                handleChargeChange={handleChargeChange}
                handleRemoveCharge={handleRemoveCharge}
              />
            ))}
          </div>
          {order.charges.length === 0 && (
            <button type="button" onClick={handleAddCharge} className="add-button">
              <PlusOutlined />
            </button>
          )}
        </fieldset>
        <fieldset className="form-section">
          <legend>Discounts</legend>
          <hr />
          <div className="form-row">
            {order.discounts.map((discount, index) => (
              <OrderDiscounts
                order={order}
                setOrder={setOrder}
                key={index}
                discounts={order.discounts}
                index={index}
                onAddDiscount={handleAddDiscount}
                handleDiscountChange={handleDiscountChange}
                handleRemoveDiscount={handleRemoveDiscount}
              />
            ))}
          </div>
          {order.discounts.length === 0 && (
            <button type="button" onClick={handleAddDiscount} className="add-button">
              <PlusOutlined />
            </button>
          )}
        </fieldset>

        <OrderTax order={order} setOrder={setOrder} />

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Generate Order
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrderForm;
