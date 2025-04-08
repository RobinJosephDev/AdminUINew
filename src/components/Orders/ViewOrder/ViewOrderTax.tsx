import React, { useEffect } from 'react';

interface FormOrder {
  base_price?: string;
  gst?: string;
  pst?: string;
  hst?: string;
  qst?: string;
  final_price?: string;
  notes?: string;
}

interface ViewOrderTaxProps {
  formOrder: FormOrder;
}

const ViewOrderTax: React.FC<ViewOrderTaxProps> = ({ formOrder }) => {
  return (
    <fieldset className="form-section">
      <legend>Tax</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        {['base_price', 'gst', 'pst', 'hst', 'qst', 'final_price'].map((field) => (
          <div className="form-group" style={{ flex: 1 }} key={field}>
            <label>{field.replace('_', ' ').toUpperCase()}</label>
            <div>{formOrder[field as keyof FormOrder] || ''}</div>
          </div>
        ))}
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Notes</label>
          <div>{formOrder.notes || ''}</div>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewOrderTax;
