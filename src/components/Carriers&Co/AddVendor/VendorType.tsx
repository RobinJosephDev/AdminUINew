import { FC, useState } from 'react';
import DOMPurify from 'dompurify';
import { z } from 'zod';
import { Vendor } from '../../../styles/types/VendorTypes';

interface VendorTypeProps {
  vendor: Vendor;
  setVendor: React.Dispatch<React.SetStateAction<Vendor>>;
}

const vendorTypeSchema = z.object({
  type: z.enum(['Vendor', 'Factoring Company'], {
    errorMap: () => ({ message: 'Invalid vendor type' }),
  }),
});

const VendorType: FC<VendorTypeProps> = ({ vendor, setVendor }) => {
  const [errors, setErrors] = useState<{ type?: string }>({});
  const vendorTypeOptions = ['Vendor', 'Factoring Company'];

  const validateAndSetVendor = (value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value.trim());
    const tempVendor = { ...vendor, type: sanitizedValue };

    const result = vendorTypeSchema.safeParse(tempVendor);
    setErrors(result.success ? {} : { type: result.error.errors[0].message });
    if (result.success) setVendor(tempVendor);
  };

  return (
    <fieldset className="form-section">
      <legend>Vendor Type</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ width: '24%' }}>
          <label htmlFor="type">
            Vendor Type <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            id="type"
            value={vendor.type || ''}
            onChange={(e) => validateAndSetVendor(e.target.value)}
            style={{
              width: '100%',
              height: '40px',
              padding: '6px',
              fontSize: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          >
            <option value="" disabled>
              Select Vendor Type
            </option>
            {vendorTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.type && (
            <span className="error" style={{ color: 'red' }}>
              {errors.type}
            </span>
          )}
        </div>
      </div>
    </fieldset>
  );
};

export default VendorType;
