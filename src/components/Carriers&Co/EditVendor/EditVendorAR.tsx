import { FC, useState } from 'react';
import DOMPurify from 'dompurify';
import { z } from 'zod';
import { Vendor } from '../../../styles/types/VendorTypes';

interface EditVendorARProps {
  formVendor: Vendor;
  setFormVendor: React.Dispatch<React.SetStateAction<Vendor>>;
}

const vendorARSchema = z.object({
  ar_name: z
    .string()
    .max(200, 'Name must be at most 200 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  ar_email: z.string().max(255, 'Name must be at most 255 characters').email('Invalid email format').optional(),
  ar_contact_no: z.string().max(15, 'Contact No must be at most 15 characters').regex(/^\d*$/, 'Contact number must be numeric').optional(),
  ar_ext: z.string().max(10, 'Extension must be at most 10 characters').regex(/^\d*$/, 'Extension must be numeric').optional(),
});

const EditVendorAR: React.FC<EditVendorARProps> = ({ formVendor, setFormVendor }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndSetVendor = (field: keyof Vendor, value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    const tempVendor = { ...formVendor, [field]: sanitizedValue };

    const result = vendorARSchema.safeParse(tempVendor);
    setErrors(result.success ? {} : Object.fromEntries(result.error.errors.map((e) => [e.path[0], e.message])));
    setFormVendor(tempVendor);
  };

  const fields = [
    { label: 'Name', name: 'ar_name' },
    { label: 'Email', name: 'ar_email' },
    { label: 'Contact No', name: 'ar_contact_no' },
    { label: 'Ext', name: 'ar_ext' },
  ];

  return (
    <fieldset className="form-section">
      <legend>Account Receivable Details</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        {fields.map(({ label, name }) => (
          <div className="form-group" style={{ flex: 1 }} key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              type="text"
              id={name}
              value={(formVendor[name as keyof Vendor] as string | number) || ''}
              onChange={(e) => validateAndSetVendor(name as keyof Vendor, e.target.value)}
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

export default EditVendorAR;
