import React from 'react';

interface ViewOrderRevenueProps {
  formOrder: {
    currency?: string;
    base_price?: string;
  };
}

const ViewOrderRevenue: React.FC<ViewOrderRevenueProps> = ({ formOrder }) => {
  return (
    <fieldset className="form-section">
      <legend>Revenue</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Currency</label>
          <div>{formOrder.currency || ''}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Base Price</label>
          <div>{formOrder.base_price || ''}</div>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewOrderRevenue;
