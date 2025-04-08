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

type EditVendorPrimaryAddressProps = {
  formVendor: Vendor;
  setFormVendor: React.Dispatch<React.SetStateAction<Vendor>>;
};

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

function EditVendorPrimaryAddress({ formVendor, setFormVendor }: EditVendorPrimaryAddressProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateAddressFields = (place: google.maps.places.PlaceResult) => {
    const getComponent = (type: string) => place.address_components?.find((c) => c.types.includes(type))?.long_name || '';
    setFormVendor((prev) => ({
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

    const tempVendor = { ...formVendor, [field]: sanitizedValue };
    const result = primarySchema.safeParse(tempVendor);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormVendor(tempVendor);
  };

  const fields = [
    { label: 'Street', key: 'primary_address' },
    { label: 'City', key: 'primary_city' },
    { label: 'State', key: 'primary_state' },
    { label: 'Country', key: 'primary_country' },
    { label: 'Postal Code', key: 'primary_postal' },
    { label: 'Phone', key: 'primary_phone' },
    { label: 'Fax', key: 'primary_fax' },
    { label: 'Email', key: 'primary_email' },
  ];

  return (
    <fieldset>
      <legend>Primary Address</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {fields.map(({ label, key }) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{label}</label>
            <input
              type="text"
              id={key}
              value={(formVendor[key as keyof Vendor] as string | number) || ''}
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
}

export default EditVendorPrimaryAddress;
