import { FC, useState } from 'react';
import DOMPurify from 'dompurify';
import { z } from 'zod';
import { Vendor } from '../../../styles/types/VendorTypes';

interface VendorAdditionalProps {
  vendor: Vendor;
  setVendor: (vendor: Vendor) => void;
}

const vendorSchema = z.object({
  us_tax_id: z
    .string()
    .regex(/^\d{9}$/, 'US Tax ID must be exactly 9 digits')
    .optional(),
  payroll_no: z.string().max(50, 'Payroll# must be at most 50 characters').regex(/^\d*$/, 'Payroll# must be numeric').optional(),
  wcb_no: z.string().max(50, 'WCB# must be at most 50 characters').regex(/^\d*$/, 'WCB# must be numeric').optional(),
});

const VendorAdditional: FC<VendorAdditionalProps> = ({ vendor, setVendor }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndSetVendor = (field: keyof Vendor, value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value).replace(/\D/g, '');
    const updatedVendor = { ...vendor, [field]: sanitizedValue };

    const result = vendorSchema.safeParse(updatedVendor);
    setErrors(result.success ? {} : Object.fromEntries(result.error.errors.map((e) => [e.path[0], e.message])));
    setVendor(updatedVendor);
  };

  const fields = [
    { label: 'US Tax ID', name: 'us_tax_id', placeholder: 'Enter 9-digit Tax ID (e.g., 123456789)' },
    { label: 'Payroll#', name: 'payroll_no', placeholder: 'Enter payroll number' },
    { label: 'WCB#', name: 'wcb_no', placeholder: 'Enter WCB number' },
  ];

  return (
    <fieldset className="form-section">
      <legend>Additional Details</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        {fields.map(({ label, name, placeholder }) => (
          <div className="form-group" style={{ flex: 1 }} key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              type="text"
              id={name}
              value={
                typeof vendor[name as keyof Vendor] === 'string' || typeof vendor[name as keyof Vendor] === 'number'
                  ? vendor[name as keyof Vendor].toString()
                  : ''
              }
              onChange={(e) => validateAndSetVendor(name as keyof Vendor, e.target.value)}
              placeholder={placeholder}
            />
            {errors[name] && (
              <span className="error" style={{ color: 'red' }}>
                {errors[name]}
              </span>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default VendorAdditional;
