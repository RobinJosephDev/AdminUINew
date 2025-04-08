import { useState } from 'react';
import { Carrier } from '../../../styles/types/CarrierTypes';
import * as z from 'zod';
import DOMPurify from 'dompurify';

interface EditLiabilityInsuranceProps {
  formCarrier: Carrier;
  setFormCarrier: React.Dispatch<React.SetStateAction<Carrier>>;
}

const EditLiabilityInsurance: React.FC<EditLiabilityInsuranceProps> = ({ formCarrier, setFormCarrier }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const sanitizeInput = (input: string) => DOMPurify.sanitize(input);

  const carrierSchema = z
    .object({
      li_provider: z
        .string()
        .max(150, 'Liability Insurance Provider must be at most 150 characters')
        .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
        .optional(),
      li_policy_no: z
        .string()
        .max(50, 'Policy Number must be at most 50 characters')
        .regex(/^[a-zA-Z0-9\s.-]*$/, 'Only letters, numbers, spaces, periods, and hyphens allowed')
        .optional(),
      li_coverage: z.number().optional(),
      li_start_date: z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, { message: 'Start date must be in DD-MM-YYYY format' })
        .optional(),
      li_end_date: z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, { message: 'End date must be in DD-MM-YYYY format' })
        .optional(),
    })
    .refine((data) => !data.li_start_date || !data.li_end_date || new Date(data.li_start_date) <= new Date(data.li_end_date), {
      message: 'End date must be after or equal to start date',
      path: ['li_end_date'],
    });

  const handleChange = (key: keyof Carrier, value: string | number) => {
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;

    const newCarrier = { ...formCarrier, [key]: sanitizedValue };

    const result = carrierSchema.safeParse(newCarrier);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
    }
    setFormCarrier(newCarrier);
  };

  const fields = [
    { label: 'Liability Insurance Provider', key: 'li_provider', type: 'text', placeholder: 'Provider' },
    { label: 'Policy Number', key: 'li_policy_no', type: 'text', placeholder: 'Policy Number' },
    { label: 'Coverage Amount', key: 'li_coverage', type: 'number', placeholder: 'Coverage Amount' },
    { label: 'Start Date', key: 'li_start_date', type: 'date' },
    { label: 'End Date', key: 'li_end_date', type: 'date' },
  ];

  return (
    <fieldset className="form-section">
      <legend>Liability Insurance Details</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {fields.map(({ label, key, type, placeholder }) => (
          <div key={key} className="form-group" style={{ flex: 1 }}>
            <label htmlFor={key}>{label}</label>
            <input
              type={type}
              id={key}
              value={(formCarrier[key as keyof Carrier] as string | number) || ''}
              onChange={(e) => handleChange(key as keyof Carrier, type === 'number' ? Number(e.target.value) : e.target.value)}
              placeholder={placeholder || ''}
            />
            {errors[key] && (
              <span className="error-text" style={{ color: 'red' }}>
                {errors[key]}
              </span>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default EditLiabilityInsurance;
