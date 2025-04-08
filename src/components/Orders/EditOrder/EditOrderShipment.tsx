import { useState } from 'react';
import { Order } from '../../../styles/types/OrderTypes';
import { z } from 'zod';

interface OrderShipmentProps {
  formOrder: Order;
  setFormOrder: React.Dispatch<React.SetStateAction<Order>>;
}

const formOrderSchema = z.object({
  commodity: z
    .string()
    .max(100, 'Commodity cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9\s.,'"-]*$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),

  temperature: z
    .union([
      z
        .string()
        .max(10, 'Temperature cannot exceed 10 characters')
        .regex(/^-?\d+(\.\d+)?\s?[°CFK]?$/, 'Enter a valid temperature (e.g., 5°C, -10F, 273K)'),
      z.number(),
    ])
    .optional(),
  equipment: z.enum(["Dry Van 53'", "Flat Bed 53'", "Reefer 53'"], { message: 'Please select a valid equipment' }),
  load_type: z.enum(['Partial', 'FTL', 'LTL'], { message: 'Please select a valid load type' }),
});

const fields = [
  { key: 'commodity', label: 'Commodity', placeholder: 'Enter Commodity Type', type: 'text' },
  { key: 'temperature', label: 'Temperature', placeholder: 'Enter Required Temperature', type: 'text' },
];

const OrderShipment: React.FC<OrderShipmentProps> = ({ formOrder, setFormOrder }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const equipmentOptions = ["Dry Van 53'", "Flat Bed 53'", "Reefer 53'"];
  const loadTypeOptions = ['Partial', 'FTL', 'LTL'];

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
      <legend>Shipment</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label htmlFor="equipment">Equipment <span style={{ color: 'red' }}>*</span></label>
          <select id="equipment" value={formOrder.equipment} onChange={(e) => setFormOrder((prevOrder) => ({ ...prevOrder, equipment: e.target.value }))}>
            <option value="" disabled>Select...</option>
            {equipmentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.equipment && (
            <span className="error" style={{ color: 'red' }}>
              {errors.equipment}
            </span>
          )}
        </div>
        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label htmlFor="loadType">Load Type <span style={{ color: 'red' }}>*</span></label>
          <select id="loadType" value={formOrder.load_type} onChange={(e) => setFormOrder((prevOrder) => ({ ...prevOrder, load_type: e.target.value }))}>
            <option value="" disabled>Select...</option>
            {loadTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.load_type && (
            <span className="error" style={{ color: 'red' }}>
              {errors.load_type}
            </span>
          )}
        </div>
        {fields.map(({ label, key, placeholder }) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{label}</label>
            <input
              type="text"
              id={key}
              placeholder={placeholder}
              value={(formOrder[key as keyof Order] as string | number) || ''}
              onChange={(e) => validateAndSetOrder(key as keyof Order, e.target.value)}
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

export default OrderShipment;
