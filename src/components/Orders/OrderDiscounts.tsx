import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ChangeEvent, FC, useCallback, useState } from 'react';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { Order, Charge } from '../../styles/types/OrderTypes';

interface OrderChargesProps {
  order: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
  discounts: Charge[];
  index: number;
  handleDiscountChange: (index: number, updatedDiscount: Charge) => void;
  handleRemoveDiscount: (index: number) => void;
  onAddDiscount: () => void;
}

const discountSchema = z.object({
  type: z
    .string()
    .max(200, 'Type must be at most 200 characters')
    .regex(/^[a-zA-Z\s.,'-]+$/, 'Only letters, spaces, apostrophes, periods, commas, and hyphens are allowed')
    .optional(),

  discount: z
    .string()
    .max(30, 'Charge value must be at most 30 characters')
    .regex(/^\d+(\.\d{1,2})?$/, 'Charge must be a valid number (e.g., 100 or 100.50)')
    .optional(),

  percent: z
    .string()
    .max(30, 'Percent/Flat Rate must be at most 30 characters')
    .regex(/^(Flat|Percentage)?$/, 'Value must be either "Flat" or "Percentage"')
    .optional(),
});

const OrderCharges: FC<OrderChargesProps> = ({ order, setOrder, discounts, index, handleDiscountChange, handleRemoveDiscount, onAddDiscount }) => {
  const discount = discounts[index] ?? {};
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSetDiscount = useCallback(
    (field: keyof Charge, value: string) => {
      const sanitizedValue = DOMPurify.sanitize(value);
      let error = '';

      const updatedCharge = { ...discount, [field]: sanitizedValue };
      const result = discountSchema.safeParse(updatedCharge);

      if (!result.success) {
        const fieldError = result.error.errors.find((err) => err.path[0] === field);
        error = fieldError ? fieldError.message : '';
      }

      setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
      handleDiscountChange(index, updatedCharge);
    },
    [discount, handleDiscountChange, index]
  );

  const fields = [
    { label: 'Type', key: 'type', type: 'text', placeholder: 'Enter Type' },
    { label: 'Charge', key: 'discount', type: 'text', placeholder: 'Enter Charge' },
    { label: 'Percent/Flat Rate', key: 'percent', type: 'dropdown', placeholder: 'Enter Percent/Flat Rate' },
  ];
  const rateOptions = ['Flat', 'Percentage'];

  return (
    <fieldset className="form-section" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {fields.map(({ label, key, type, placeholder }) => (
        <div className="form-group" key={key} style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor={`${key}-${index}`}>{label}</label>
          {type === 'dropdown' ? (
            <select
              id={`${key}-${index}`}
              name={key}
              value={discount.percent || ''}
              onChange={(e) => validateAndSetDiscount('percent', e.target.value)}
              style={{ width: '180px', padding: '8px' }}
            >
              <option value="">Select</option>
              {rateOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`${key}-${index}`}
              type={type}
              name={key}
              value={(discount[key as keyof Charge] as string) || ''}
              onChange={(e) => validateAndSetDiscount(key as keyof Charge, e.target.value)}
              placeholder={placeholder}
            />
          )}

          {errors[key] && (
            <span className="error" style={{ color: 'red' }}>
              {errors[key]}
            </span>
          )}
        </div>
      ))}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
        <button type="button" onClick={onAddDiscount} className="add-button">
          <PlusOutlined />
        </button>
        <button type="button" onClick={() => handleRemoveDiscount(index)} className="delete-button">
          <DeleteOutlined />
        </button>
      </div>
    </fieldset>
  );
};

export default OrderCharges;
