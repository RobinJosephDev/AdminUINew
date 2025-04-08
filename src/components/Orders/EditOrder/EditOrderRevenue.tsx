import { useState } from 'react';
import { Order } from '../../../styles/types/OrderTypes';
import { z } from 'zod';

interface OrderRevenueProps {
  formOrder: Order;
  setFormOrder: React.Dispatch<React.SetStateAction<Order>>;
}

const formOrderSchema = z.object({
  base_price: z
    .string()
    .max(20, 'Base price cannot exceed 15 characters')
    .regex(/^\d{1,3}(,\d{3})*(\.\d{1,2})?$/, 'Enter a valid amount (e.g., 1000, 1,000.50)')
    .optional(),

  currency: z.enum(['CAD', 'USD'], { message: 'Please select a valid currency' }).optional(),
});

const fields = [{ key: 'base_price', label: 'Base Price', placeholder: 'Enter Base Price', type: 'text' }];

const OrderRevenue: React.FC<OrderRevenueProps> = ({ formOrder, setFormOrder }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const currencyOptions = ['CAD', 'USD'];

  const validateAndSetOrder = (field: keyof Order, value: string | boolean) => {
    let sanitizedValue = value;
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

  return (
    <fieldset className="form-section">
      <legend>Revenue</legend>
      <hr />
      <div
        className="form-grid"
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          alignItems: 'center',
        }}
      >
        <div className="form-group" style={{ flex: '1 1 auto', minWidth: '250px' }}>
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            value={formOrder.currency}
            onChange={(e) => setFormOrder((prevOrder) => ({ ...prevOrder, currency: e.target.value }))}
            style={{
              minWidth: '250px',
              padding: '8px',
              width: '100%',
            }}
          >
            <option value="">Select...</option>
            {currencyOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.currency && (
            <span className="error" style={{ color: 'red' }}>
              {errors.currency}
            </span>
          )}
        </div>
        {fields.map(({ label, key, placeholder }) => (
          <div className="form-group" key={key} style={{ flex: '1 1 auto', minWidth: '250px' }}>
            <label htmlFor={key}>{label}</label>
            <input
              type="text"
              id={key}
              placeholder={placeholder}
              value={(formOrder[key as keyof Order] as string | number) || ''}
              onChange={(e) => validateAndSetOrder(key as keyof Order, e.target.value)}
              style={{
                minWidth: '250px',
                padding: '8px',
                width: '100%',
              }}
            />
            {errors[key] && (
              <span className="error" style={{ color: 'red' }}>
                {errors[key]}
              </span>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default OrderRevenue;
