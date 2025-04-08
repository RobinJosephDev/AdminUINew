import { FC, useState } from 'react';
import { Vendor } from '../../../styles/types/VendorTypes';
import { z } from 'zod';
import DOMPurify from 'dompurify';

// Helper function to format date strings
const formatDateForInput = (date: string | Date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

interface EditVendorLiabilityInsuranceProps {
  formVendor: Vendor;
  setFormVendor: React.Dispatch<React.SetStateAction<Vendor>>;
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

const EditVendorLiabilityInsurance: React.FC<EditVendorLiabilityInsuranceProps> = ({ formVendor, setFormVendor }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSetVendor = (field: keyof Vendor, value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    let error = '';

    const tempVendor = { ...formVendor, [field]: sanitizedValue };

    const result = liabilitySchema.safeParse(tempVendor);
    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormVendor(tempVendor);
  };
  const fields: { label: string; key: keyof Vendor; type?: string }[] = [
    { label: 'Liability Insurance Provider', key: 'liab_company' },
    { label: 'Start Date', key: 'liab_policy_start', type: 'date' },
    { label: 'End Date', key: 'liab_policy_end', type: 'date' },
    { label: 'Coverage Amount', key: 'liab_ins_amt', type: 'number' },
  ];

  return (
    <fieldset className="form-section">
      <legend>Liability Insurance Details</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {fields.map(({ label, key, type }) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{label}</label>
            <input
              id={key}
              type={type || 'text'}
              value={type === 'date' ? formatDateForInput(formVendor[key] as string | Date) : String(formVendor[key] || '')}
              onChange={(e) => validateAndSetVendor(key, e.target.value)}
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

export default EditVendorLiabilityInsurance;
