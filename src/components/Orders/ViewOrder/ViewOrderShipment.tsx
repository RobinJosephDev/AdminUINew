import React from 'react';

interface FormOrder {
  commodity?: string;
  equipment?: string;
  load_type?: string;
  temperature?: string;
}

interface ViewOrderShipmentProps {
  formOrder: FormOrder;
}

const ViewOrderShipment: React.FC<ViewOrderShipmentProps> = ({ formOrder }) => {
  return (
    <fieldset className="form-section">
      <legend>Shipment</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="commodity">Commodity</label>
          <div>{formOrder.commodity || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="equipment">Equipment</label>
          <div>{formOrder.equipment || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="load_type">Load Type</label>
          <div>{formOrder.load_type || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="temperature">Temperature</label>
          <div>{formOrder.temperature || ''}</div>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewOrderShipment;