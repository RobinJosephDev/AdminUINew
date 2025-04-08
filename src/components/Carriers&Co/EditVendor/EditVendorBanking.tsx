import { useEffect, useRef, useState, FC } from 'react';
import { Vendor } from '../../../styles/types/VendorTypes';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { useGoogleAutocomplete } from '../../../hooks/useGoogleAutocomplete';

declare global {
  interface Window {
    google?: any;
  }
}

interface EditVendorBankingProps {
  formVendor: Vendor;
  setFormVendor: React.Dispatch<React.SetStateAction<Vendor>>;
}

const vendorBankingSchema = z.object({
  bank_name: z
    .string()
    .max(150, 'Bank name must be at most 150 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  bank_phone: z.string().max(15, 'Phone must be at most 15 digits').regex(/^\d*$/, 'Only numbers allowed').optional(),
  bank_email: z.string().max(255, 'Email must be at most 255 characters').email('Invalid email format').optional(),
  bank_us_acc_no: z
    .string()
    .length(9, 'US Account No must be exactly 9 digits')
    .regex(/^\d{9}$/, 'Only numbers allowed')
    .optional(),
  bank_cdn_acc_no: z.string().max(12, 'Canadian Account No must be at most 12 digits').regex(/^\d*$/, 'Only numbers allowed').optional(),
  bank_address: z
    .string()
    .max(100, 'Address too long')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
});

const EditVendorBanking: React.FC<EditVendorBankingProps> = ({ formVendor, setFormVendor }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const updateAddressFields = (place: google.maps.places.PlaceResult) => {
    const getComponent = (type: string) => place.address_components?.find((c) => c.types.includes(type))?.long_name || '';

    const fullAddress =
      place.formatted_address ||
      `${getComponent('street_number')} ${getComponent('route')}, ${getComponent('locality')}, ${getComponent(
        'administrative_area_level_1'
      )} ${getComponent('postal_code')}, ${getComponent('country')}`;

    setFormVendor((prev) => ({
      ...prev,
      bank_address: fullAddress,
    }));
  };

  const addressRef = useGoogleAutocomplete(updateAddressFields);

  const validateAndSetVendor = (field: keyof Vendor, value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    let error = '';

    const tempVendor = { ...formVendor, [field]: sanitizedValue };

    const result = vendorBankingSchema.safeParse(tempVendor);
    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormVendor(tempVendor);
  };

  const fields: { label: string; key: keyof Vendor }[] = [
    { label: 'Bank Name', key: 'bank_name' },
    { label: 'Phone', key: 'bank_phone' },
    { label: 'Email', key: 'bank_email' },
    { label: 'US Account No', key: 'bank_us_acc_no' },
    { label: 'Canadian Account No', key: 'bank_cdn_acc_no' },
    { label: 'Address', key: 'bank_address' },
  ];

  return (
    <fieldset className="form-section">
      <legend>Bank Details</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {fields.map(({ label, key }) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{label}</label>
            <input
              id={key}
              type="text"
              value={(formVendor[key] as string | number) || ''}
              onChange={(e) => validateAndSetVendor(key, e.target.value)}
              ref={key === 'bank_address' ? addressRef : undefined}
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

export default EditVendorBanking;
