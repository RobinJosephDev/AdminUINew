import { FC, useState } from 'react';
import { Vendor } from '../../../styles/types/VendorTypes';
import { z } from 'zod';
import DOMPurify from 'dompurify';

interface VendorLiabilityInsuranceProps {
  vendor: Vendor;
  setVendor: React.Dispatch<React.SetStateAction<Vendor>>;
}

const liabilitySchema = z
  .object({
    liab_company: z
      .string()
      .max(150, 'Liability Insurance Provider must be at most 150 characters')
      .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
      .optional(),
    liab_policy_start: z
      .string()
      .regex(/^\d{2}-\d{2}-\d{4}$/, { message: 'Start date must be in DD-MM-YYYY format' })
      .optional(),
    liab_policy_end: z
      .string()
      .regex(/^\d{2}-\d{2}-\d{4}$/, { message: 'End date must be in DD-MM-YYYY format' })
      .optional(),
    liab_ins_amt: z.string().regex(/^\d*$/, 'Coverage amount must be a positive number').optional(),
  })
  .refine(
    (data) => {
      if (!data.liab_policy_start || !data.liab_policy_end) return true;
      const start = new Date(data.liab_policy_start);
      const end = new Date(data.liab_policy_end);
      return !isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['liab_policy_end'],
    }
  );

const VendorLiabilityInsurance: FC<VendorLiabilityInsuranceProps> = ({ vendor, setVendor }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSetVendor = (field: keyof Vendor, value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    let error = '';

    const tempVendor = { ...vendor, [field]: sanitizedValue };

    const result = liabilitySchema.safeParse(tempVendor);
    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setVendor(tempVendor);
  };
  const fields: { label: string; key: keyof Vendor; type?: string; placeholder?: string }[] = [
    { label: 'Liability Insurance Provider', key: 'liab_company', placeholder: 'Enter provider name' },
    { label: 'Start Date', key: 'liab_policy_start', type: 'date' },
    { label: 'End Date', key: 'liab_policy_end', type: 'date' },
    { label: 'Coverage Amount', key: 'liab_ins_amt', type: 'number', placeholder: 'Enter coverage amount' },
  ];
  return (
    <fieldset className="form-section">
      <legend>Liability Insurance Details</legend>
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

export default VendorLiabilityInsurance;
