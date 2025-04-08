import { useState } from 'react';
import { Order } from '../../../styles/types/OrderTypes';
import { z } from 'zod';
import DOMPurify from 'dompurify';

interface OrderSpecsProps {
  order: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
}

const specSchema = z.object({
  hot: z.boolean().optional(),
  team: z.boolean().optional(),
  air_ride: z.boolean().optional(),
  tarp: z.boolean().optional(),
  hazmat: z.boolean().optional(),
});
const OrderSpecs: React.FC<OrderSpecsProps> = ({ order, setOrder }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSetSpecs = (field: keyof Order, value: string | boolean) => {
    let sanitizedValue = value;

    if (['hot', 'team', 'air_ride', 'tarp', 'hazmat'].includes(field) && typeof value !== 'boolean') {
      sanitizedValue = value === 'true';
    } else if (typeof value !== 'boolean') {
      sanitizedValue = DOMPurify.sanitize(value);
    }

    let error = '';
    const tempOrder = { ...order, [field]: sanitizedValue };
    const result = specSchema.safeParse(tempOrder);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setOrder(tempOrder);
  };

  return (
    <fieldset className="form-section">
      <legend>Load Specifications</legend>
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        {[
          { id: 'hot', label: 'Hot' },
          { id: 'team', label: 'Team' },
          { id: 'air_ride', label: 'Air Ride' },
          { id: 'tarp', label: 'TARP' },
          { id: 'hazmat', label: 'Hazmat' },
        ].map(({ id, label }) => (
          <div className="form-group" style={{ flex: 1 }} key={id}>
            <label htmlFor={id} style={{ display: 'inline-flex', alignItems: 'center', width: '100%' }}>
              {label}
              <input
                type="checkbox"
                id={id}
                checked={Boolean(order[id as keyof Order])}
                onChange={(e) => validateAndSetSpecs(id as keyof Order, e.target.checked)}
              />
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default OrderSpecs;
