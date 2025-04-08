import { useState } from 'react';
import { Customer } from '../../../styles/types/CustomerTypes';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { useGoogleAutocomplete } from '../../../hooks/useGoogleAutocomplete';

declare global {
  interface Window {
    google?: any;
  }
}

interface PrimaryAddressProps {
  formCustomer: Customer;
  setFormCustomer: React.Dispatch<React.SetStateAction<Customer>>;
}

const primarySchema = z.object({
  cust_primary_address: z
    .string()
    .max(255, 'Address is too long')
    .regex(/^[a-zA-Z0-9\s,.'-]*$/, 'Invalid street format')
    .optional(),
  cust_primary_city: z
    .string()
    .max(200, 'City name is too long')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid city format')
    .optional(),
  cust_primary_state: z
    .string()
    .max(200, 'Invalid state')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid state format')
    .optional(),
  cust_primary_country: z
    .string()
    .max(100, 'Invalid country')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid country format')
    .optional(),
  cust_primary_postal: z
    .string()
    .max(20, 'Postal code cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9\s-]*$/, 'Invalid postal code')
    .optional(),
  cust_primary_unit_no: z
    .string()
    .max(30, 'Unit No cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9#/\s-]*$/, 'Only letters, numbers, #, hyphens, slashes, and spaces allowed')
    .optional(),
});

function PrimaryAddress({ formCustomer, setFormCustomer }: PrimaryAddressProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateAddressFields = (place: google.maps.places.PlaceResult) => {
    const getComponent = (type: string) => place.address_components?.find((c) => c.types.includes(type))?.long_name || '';
    setFormCustomer((prev) => ({
      ...prev,
      cust_primary_address: `${getComponent('street_number')} ${getComponent('route')}`.trim(),
      cust_primary_city: getComponent('locality'),
      cust_primary_state: getComponent('administrative_area_level_1'),
      cust_primary_country: getComponent('country'),
      cust_primary_postal: getComponent('postal_code'),
    }));
  };
  const addressRef = useGoogleAutocomplete(updateAddressFields);

  const validateAndSetField = (field: keyof Customer, value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    let error = '';

    const tempCustomer = { ...formCustomer, [field]: sanitizedValue };
    const result = primarySchema.safeParse(tempCustomer);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormCustomer(tempCustomer);
  };

  const fields = [
    { label: 'Street', key: 'cust_primary_address', placeholder: 'Enter street address' },
    { label: 'City', key: 'cust_primary_city', placeholder: 'Enter city name' },
    { label: 'State', key: 'cust_primary_state', placeholder: 'Enter state' },
    { label: 'Country', key: 'cust_primary_country', placeholder: 'Enter country' },
    { label: 'Postal Code', key: 'cust_primary_postal', placeholder: 'Enter postal code' },
    { label: 'Unit No.', key: 'cust_primary_unit_no', placeholder: 'Enter Unit No.' },
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
              value={(formCustomer[key as keyof Customer] as string | number) || ''}
              onChange={(e) => validateAndSetField(key as keyof Customer, e.target.value)}
              ref={key === 'cust_primary_address' ? addressRef : undefined}
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

export default PrimaryAddress;
