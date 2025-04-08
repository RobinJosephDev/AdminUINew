import { useState, useEffect } from 'react';
import { Order } from '../../../styles/types/OrderTypes';
import { z } from 'zod';

interface OrderTaxProps {
  formOrder: Order;
  setFormOrder: React.Dispatch<React.SetStateAction<Order>>;
}

const formOrderSchema = z.object({
  base_price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid price (e.g., 100.50)')
    .optional(),
  gst: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid GST amount (e.g., 5.00)')
    .optional(),
  pst: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid PST amount (e.g., 7.50)')
    .optional(),
  hst: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid HST amount (e.g., 13.00)')
    .optional(),
  qst: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid QST amount (e.g., 9.97)')
    .optional(),
  final_price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid price (e.g., 150.75)')
    .optional(),
  notes: z
    .string()
    .max(500, 'Notes cannot exceed 500 characters')
    .regex(/^[a-zA-Z0-9\s,.'-]*$/, 'Invalid notes format')
    .optional(),
});

const fields = [
  { key: 'base_price', label: 'Base Price' },
  { key: 'gst', label: 'GST' },
  { key: 'pst', label: 'PST' },
  { key: 'hst', label: 'HST' },
  { key: 'qst', label: 'QST' },
];

const OrderTax: React.FC<OrderTaxProps> = ({ formOrder, setFormOrder }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSetOrder = (field: keyof Order, value: string) => {
    const sanitizedValue = value.trim();
    let error = '';

    const tempOrder = { ...formOrder, [field]: sanitizedValue };
    const result = formOrderSchema.safeParse(tempOrder);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormOrder(tempOrder);
  };

  useEffect(() => {
    const base = Number(formOrder.base_price) || 0;
    const gst = Number(formOrder.gst) || 0;
    const pst = Number(formOrder.pst) || 0;
    const hst = Number(formOrder.hst) || 0;
    const qst = Number(formOrder.qst) || 0;

    const finalPrice = (base + gst + pst + hst + qst).toFixed(2);

    setFormOrder((prevOrder) => ({
      ...prevOrder,
      final_price: finalPrice,
    }));
  }, [formOrder.base_price, formOrder.gst, formOrder.pst, formOrder.hst, formOrder.qst, setFormOrder]);

  return (
    <fieldset className="form-section">
      <legend>Tax</legend>
      <hr />
      <div
        className="form-grid"
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {fields.map(({ label, key }) => (
          <div className="form-group" key={key} style={{ flex: '1 1 150px' }}>
            <label htmlFor={key}>{label}</label>
            <input
              type="text"
              id={key}
              placeholder={`Enter ${label}`}
              value={(formOrder[key as keyof Order] as string) || ''}
              onChange={(e) => validateAndSetOrder(key as keyof Order, e.target.value)}
            />
            {errors[key] && (
              <span className="error" style={{ color: 'red' }}>
                {errors[key]}
              </span>
            )}
          </div>
        ))}
        <div className="form-group" style={{ flex: '1 1 150px' }}>
          <label htmlFor="final_price">Final Price</label>
          <input
            type="text"
            id="final_price"
            value={formOrder.final_price || '0.00'}
            readOnly
            style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
          />
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '1rem' }}>
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          placeholder="Enter Additional Notes"
          value={formOrder.notes || ''}
          onChange={(e) => validateAndSetOrder('notes', e.target.value)}
          style={{ width: '100%', minHeight: '80px' }}
        />
        {errors.notes && (
          <span className="error" style={{ color: 'red' }}>
            {errors.notes}
          </span>
        )}
      </div>
    </fieldset>
  );
};

export default OrderTax;
