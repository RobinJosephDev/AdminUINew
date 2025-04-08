import { FC, useState } from 'react';
import { Vendor } from '../../../styles/types/VendorTypes';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { useGoogleAutocomplete } from '../../../hooks/useGoogleAutocomplete';

declare global {
  interface Window {
    google?: any;
  }
}

interface VendorPrimaryAddressProps {
  vendor: Vendor;
  setVendor: React.Dispatch<React.SetStateAction<Vendor>>;
}

const primarySchema = z.object({
  primary_address: z
    .string()
    .max(255, 'Address is too long')
    .regex(/^[a-zA-Z0-9\s,.'-]*$/, 'Invalid street format')
    .optional(),
  primary_city: z
    .string()
    .max(200, 'City name is too long')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid city format')
    .optional(),
  primary_state: z
    .string()
    .max(200, 'Invalid state')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid state format')
    .optional(),
  primary_country: z
    .string()
    .max(100, 'Invalid country')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid country format')
    .optional(),
  primary_postal: z
    .string()
    .max(20, 'Postal code cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9-\s ]*$/, 'Invalid postal code')
    .optional(),
  primary_email: z.string().max(255, 'Email cannot exceed 255 characters').email('Invalid email format').optional(),
  primary_phone: z
    .string()
    .max(30, 'Phone cannot exceed 30 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid phone format')
    .optional(),
  primary_fax: z
    .string()
    .max(30, 'Fax cannot exceed 30 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid fax format')
    .optional(),
});

const VendorPrimaryAddress: FC<VendorPrimaryAddressProps> = ({ vendor, setVendor }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateAddressFields = (place: google.maps.places.PlaceResult) => {
    const getComponent = (type: string) => place.address_components?.find((c) => c.types.includes(type))?.long_name || '';
    setVendor((prev) => ({
      ...prev,
      primary_address: `${getComponent('street_number')} ${getComponent('route')}`.trim(),
      primary_city: getComponent('locality'),
      primary_state: getComponent('administrative_area_level_1'),
      primary_country: getComponent('country'),
      primary_postal: getComponent('postal_code'),
    }));
  };
  const addressRef = useGoogleAutocomplete(updateAddressFields);

  const validateAndSetField = (field: keyof Vendor, value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    let error = '';

    const tempVendor = { ...vendor, [field]: sanitizedValue };
    const result = primarySchema.safeParse(tempVendor);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setVendor(tempVendor);
  };

  const fields = [
    { label: 'Street', key: 'primary_address', placeholder: 'Enter street address' },
    { label: 'City', key: 'primary_city', placeholder: 'Enter city name' },
    { label: 'State', key: 'primary_state', placeholder: 'Enter state' },
    { label: 'Country', key: 'primary_country', placeholder: 'Enter country' },
    { label: 'Postal Code', key: 'primary_postal', placeholder: 'Enter postal code' },
    { label: 'Phone', key: 'primary_phone', placeholder: 'Enter phone number' },
    { label: 'Fax', key: 'primary_fax', placeholder: 'Enter fax number' },
    { label: 'Email', key: 'primary_email', placeholder: 'Enter email address' },
  ];
  return (
    <fieldset>
      <legend>Primary Address</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {fields.map(({ label, key, placeholder }) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{label}</label>
            <input
              type="text"
              id={key}
              placeholder={placeholder}
              value={(vendor[key as keyof Vendor] as string | number) || ''}
              onChange={(e) => validateAndSetField(key as keyof Vendor, e.target.value)}
              ref={key === 'primary_address' ? addressRef : undefined}
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

export default VendorPrimaryAddress;
