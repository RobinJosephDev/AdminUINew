import { FC, useState } from 'react';
import { Vendor } from '../../../styles/types/VendorTypes';
import { z } from 'zod';
import DOMPurify from 'dompurify';

interface VendorCargoInsuranceProps {
  vendor: Vendor;
  setVendor: React.Dispatch<React.SetStateAction<Vendor>>;
}

const vendorCargoSchema = z
  .object({
    cargo_company: z
      .string()
      .max(150, 'Cargo company must be at most 150 characters')
      .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
      .optional(),
    cargo_policy_start: z
      .string()
      .regex(/^\d{2}-\d{2}-\d{4}$/, { message: 'Start date must be in DD-MM-YYYY format' })
      .optional(),
    cargo_policy_end: z
      .string()
      .regex(/^\d{2}-\d{2}-\d{4}$/, { message: 'End date must be in DD-MM-YYYY format' })
      .optional(),
    cargo_ins_amt: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'Coverage amount must be a valid number')
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.cargo_policy_start || !data.cargo_policy_end) return true; // Skip validation if empty
      const start = new Date(data.cargo_policy_start);
      const end = new Date(data.cargo_policy_end);
      return !isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['cargo_policy_end'],
    }
  );

const VendorCargoInsurance: FC<VendorCargoInsuranceProps> = ({ vendor, setVendor }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndSetVendor = (field: keyof Vendor, value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    const tempVendor = { ...vendor, [field]: sanitizedValue };

    const result = vendorCargoSchema.safeParse(tempVendor);
    if (!result.success) {
      const newErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          newErrors[err.path[0]] = err.message;
        }
      });
      setErrors(newErrors);
    } else {
      setErrors({});
    }

    setVendor(tempVendor);
  };

  const fields: { label: string; key: keyof Vendor; type?: string; placeholder?: string }[] = [
    { label: 'Cargo Insurance Provider', key: 'cargo_company', placeholder: 'Enter provider name' },
    { label: 'Start Date', key: 'cargo_policy_start', type: 'date' },
    { label: 'End Date', key: 'cargo_policy_end', type: 'date' },
    { label: 'Coverage Amount', key: 'cargo_ins_amt', type: 'text', placeholder: 'Enter coverage amount' },
  ];

  return (
    <fieldset className="form-section">
      <legend>Cargo Insurance Details</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {fields.map(({ label, key, type, placeholder }) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{label}</label>
            <input
              id={key}
              type={type || 'text'}
              value={(vendor[key] as string | number) || ''}
              onChange={(e) => validateAndSetVendor(key, e.target.value)}
              placeholder={placeholder}
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

export default VendorCargoInsurance;
