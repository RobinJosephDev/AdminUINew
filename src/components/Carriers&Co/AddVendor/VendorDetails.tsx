import { FC, useState } from 'react';
import DOMPurify from 'dompurify';
import { z } from 'zod';
import { Vendor } from '../../../styles/types/VendorTypes';

interface VendorDetailsProps {
  vendor: Vendor;
  setVendor: React.Dispatch<React.SetStateAction<Vendor>>;
}

const vendorDetailSchema = z.object({
  legal_name: z
    .string()
    .min(1, 'Legal Name is required')
    .max(100, 'Legal Name must be at most 100 characters long')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed'),
  remit_name: z
    .string()
    .min(1, 'Remit Name is required')
    .max(200, 'Remit Name must be at most 200 characters long')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed'),
  vendor_type: z
    .string()
    .min(1, 'Vendor Type is required')
    .max(50, 'Vendor Type must be at most 50 characters long')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed'),
  service: z
    .string()
    .min(1, 'Service is required')
    .max(100, 'Service must be at most 100 characters long')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed'),
  scac: z
    .string()
    .max(10, 'SCAC must be at most 10 characters long')
    .regex(/^[a-zA-Z0-9-]*$/, 'Only letters, numbers, and dashes allowed')
    .optional(),
  docket_number: z
    .string()
    .max(50, 'Docket# must be at most 50 characters long')
    .regex(/^[a-zA-Z0-9-]*$/, 'Only letters, numbers, and dashes allowed')
    .optional(),
  vendor_code: z
    .string()
    .max(20, 'Vendor Code must be at most 20 characters long')
    .regex(/^[a-zA-Z\s0-9-]*$/, 'Only letters, numbers, spaces and dashes allowed')
    .optional(),
  gst_hst_number: z
    .string()
    .max(20, 'CA Bond# must be at most 50 characters long')
    .regex(/^[a-zA-Z0-9-]*$/, 'Only letters, numbers, and dashes allowed')
    .optional(),
  qst_number: z
    .string()
    .max(20, 'CA Bond# must be at most 50 characters long')
    .regex(/^[a-zA-Z0-9-]*$/, 'Only letters, numbers, and dashes allowed')
    .optional(),
  ca_bond_number: z
    .string()
    .max(50, 'CA Bond# must be at most 50 characters long')
    .regex(/^[a-zA-Z0-9-]*$/, 'Only letters, numbers, and dashes allowed')
    .optional(),
  website: z.string().max(255, 'Website must be at most 255 characters long').url('Invalid website URL').optional(),
});

const VendorDetails: FC<VendorDetailsProps> = ({ vendor, setVendor }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSetVendor = (field: keyof Vendor, value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    let error = '';

    const tempVendor = { ...vendor, [field]: sanitizedValue };
    const result = vendorDetailSchema.safeParse(tempVendor);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setVendor(tempVendor);
  };

  const fields = [
    { label: 'Legal Name', key: 'legal_name', placeholder: 'Enter legal name', required: true },
    { label: 'Remit Name', key: 'remit_name', placeholder: 'Enter remit name', required: true },
    { label: 'Vendor Type', key: 'vendor_type', placeholder: 'Enter vendor type', required: true },
    { label: 'Service', key: 'service', placeholder: 'Enter service type', required: true },
    { label: 'SCAC', key: 'scac', placeholder: 'Enter SCAC code' },
    { label: 'Docket#', key: 'docket_number', placeholder: 'Enter docket number' },
    { label: 'Vendor Code', key: 'vendor_code', placeholder: 'Enter vendor code' },
    { label: 'GST/HST#', key: 'gst_hst_number', placeholder: 'Enter GST/HST number' },
    { label: 'QST#', key: 'qst_number', placeholder: 'Enter QST number' },
    { label: 'CA Bond#', key: 'ca_bond_number', placeholder: 'Enter CA bond number' },
    { label: 'Website', key: 'website', placeholder: 'Enter website URL' },
  ];

  return (
    <fieldset className="form-section">
      <legend>Vendor Details</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {fields.map(({ label, key, placeholder, required }) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>
              {label} {required && <span style={{ color: 'red' }}>*</span>}
            </label>{' '}
            <input
              type="text"
              id={key}
              placeholder={placeholder}
              value={(vendor[key as keyof Vendor] as string | number) || ''}
              onChange={(e) => validateAndSetVendor(key as keyof Vendor, e.target.value)}
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

export default VendorDetails;
