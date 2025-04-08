import EditOrderGeneral from './EditOrderGeneral';
import EditOrderShipment from './EditOrderShipment';
import OrderOrigin from '../OrderOrigin';
import OrderDestination from '../OrderDestination';
import EditOrderSpecs from './EditOrderSpecs';
import EditOrderRevenue from './EditOrderRevenue';
import OrderCharges from '../OrderCharges';
import OrderDiscounts from '../OrderDiscounts';
import EditOrderTax from './EditOrderTax';
import { PlusOutlined } from '@ant-design/icons';
import { Order, Location, Charge } from '../../../styles/types/OrderTypes';
import useEditOrder from '../../../hooks/edit/useEditOrder';

interface EditOrderFormProps {
  order: Order | null;
  onClose: () => void;
  onUpdate: (order: Order) => void;
}

const EditOrderForm: React.FC<EditOrderFormProps> = ({ order, onClose, onUpdate }) => {
  const {
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
  } = useEditOrder(order, onClose, onUpdate);

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateOrder();
        }}
        className="form-main"
      >
        {formOrder && (
          <>
            <EditOrderGeneral formOrder={formOrder} setFormOrder={setFormOrder} />
            <EditOrderShipment formOrder={formOrder} setFormOrder={setFormOrder} />

            <fieldset className="form-section">
              <legend>Origin</legend>
              <hr />
              <div className="form-row">
                {formOrder.origin_location?.map((origin, index) => (
                  <OrderOrigin
                    order={formOrder}
                    setOrder={setFormOrder}
                    key={index}
                    origin_location={formOrder.origin_location}
                    index={index}
                    onAddOrigin={handleAddOrigin}
                    handleOriginChange={handleOriginChange}
                    handleRemoveOrigin={handleRemoveOrigin}
                  />
                ))}
                {formOrder.origin_location.length === 0 && (
                  <button type="button" onClick={handleAddOrigin} className="add-button">
                    <PlusOutlined />
                  </button>
                )}
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>Destination</legend>
              <hr />
              <div className="form-row">
                {formOrder.destination_location.map((destination, index) => (
                  <OrderDestination
                    order={formOrder}
                    setOrder={setFormOrder}
                    key={index}
                    destination_location={formOrder.destination_location}
                    index={index}
                    onAddDestination={handleAddDestination}
                    handleDestinationChange={handleDestinationChange}
                    handleRemoveDestination={handleRemoveDestination}
                  />
                ))}
                {formOrder.destination_location.length === 0 && (
                  <button type="button" onClick={handleAddDestination} className="add-button">
                    <PlusOutlined />
                  </button>
                )}
              </div>
            </fieldset>

            <EditOrderSpecs formOrder={formOrder} setFormOrder={setFormOrder} />
            <EditOrderRevenue formOrder={formOrder} setFormOrder={setFormOrder} />

            <fieldset className="form-section">
              <legend>Charges</legend>
              <hr />
              <div className="form-row">
                {formOrder.charges.map((charge, index) => (
                  <OrderCharges
                    order={formOrder}
                    setOrder={setFormOrder}
                    key={index}
                    charges={formOrder.charges}
                    index={index}
                    onAddCharge={handleAddCharge}
                    handleChargeChange={handleChargeChange}
                    handleRemoveCharge={handleRemoveCharge}
                  />
                ))}
                {formOrder.charges.length === 0 && (
                  <button type="button" onClick={handleAddCharge} className="add-button">
                    <PlusOutlined />
                  </button>
                )}
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>Discounts</legend>
              <hr />
              <div className="form-row">
                {formOrder.discounts.map((discount, index) => (
                  <OrderDiscounts
                    order={formOrder}
                    setOrder={setFormOrder}
                    key={index}
                    discounts={formOrder.discounts}
                    index={index}
                    onAddDiscount={handleAddDiscount}
                    handleDiscountChange={handleDiscountChange}
                    handleRemoveDiscount={handleRemoveDiscount}
                  />
                ))}
                {formOrder.discounts.length === 0 && (
                  <button type="button" onClick={handleAddDiscount} className="add-button">
                    <PlusOutlined />
                  </button>
                )}
              </div>
            </fieldset>
            <EditOrderTax formOrder={formOrder} setFormOrder={setFormOrder} />
          </>
        )}
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Save
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOrderForm;
