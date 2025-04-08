import { FC, useState, useEffect } from 'react';
import { Customer } from '../../../styles/types/CustomerTypes';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { useGoogleAutocomplete } from '../../../hooks/useGoogleAutocomplete';

declare global {
  interface Window {
    google?: any;
  }
}

interface MailingAddressProps {
  formCustomer: Customer;
  setFormCustomer: React.Dispatch<React.SetStateAction<Customer>>;
}

const mailingSchema = z.object({
  cust_mailing_address: z
    .string()
    .max(255, 'Address is too long')
    .regex(/^[a-zA-Z0-9\s,.'-]*$/, 'Invalid street format')
    .optional(),
  cust_mailing_city: z
    .string()
    .max(200, 'City name is too long')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid city format')
    .optional(),
  cust_mailing_state: z
    .string()
    .max(200, 'Invalid state')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid state format')
    .optional(),
  cust_mailing_country: z
    .string()
    .max(100, 'Invalid country')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid country format')
    .optional(),
  cust_mailing_postal: z
    .string()
    .max(20, 'Postal code cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9\s-]*$/, 'Invalid postal code')
    .optional(),
  cust_mailing_unit_no: z
    .string()
    .max(30, 'Unit No cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9#/\s-]*$/, 'Only letters, numbers, #, hyphens, slashes, and spaces allowed')
    .optional(),
});

function MailingAddress({ formCustomer, setFormCustomer }: MailingAddressProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sameAsPrimary, setSameAsPrimary] = useState(false);
  useEffect(() => {
    if (!sameAsPrimary && addressRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(addressRef.current, {
        types: ['address'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        updateAddressFields(place);
      });
    }
  }, [sameAsPrimary]);

  const updateAddressFields = (place: google.maps.places.PlaceResult) => {
    const getComponent = (type: string) => place.address_components?.find((c) => c.types.includes(type))?.long_name || '';
    setFormCustomer((prev) => ({
      ...prev,
      cust_mailing_address: `${getComponent('street_number')} ${getComponent('route')}`.trim(),
      cust_mailing_city: getComponent('locality'),
      cust_mailing_state: getComponent('administrative_area_level_1'),
      cust_mailing_country: getComponent('country'),
      cust_mailing_postal: getComponent('postal_code'),
    }));
  };
  const addressRef = useGoogleAutocomplete(updateAddressFields);

  const validateAndSetField = (field: keyof Customer, value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    let error = '';

    const tempCustomer = { ...formCustomer, [field]: sanitizedValue };
    const result = mailingSchema.safeParse(tempCustomer);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormCustomer(tempCustomer);
  };

  const handleSameAsPrimaryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSameAsPrimary(isChecked);

    setFormCustomer((prev) => ({
      ...prev,
      cust_mailing_address: isChecked ? prev.cust_primary_address : '',
      cust_mailing_city: isChecked ? prev.cust_primary_city : '',
      cust_mailing_state: isChecked ? prev.cust_primary_state : '',
      cust_mailing_country: isChecked ? prev.cust_primary_country : '',
      cust_mailing_postal: isChecked ? prev.cust_primary_postal : '',
      cust_mailing_unit_no: isChecked ? prev.cust_primary_unit_no : '',
    }));

    try {
      const response = await fetch('/api/update-vendor', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sameAsPrimary: isChecked }),
      });

      if (!response.ok) {
        throw new Error('Failed to update the database');
      }

      const data = await response.json();
      console.log('Update successful:', data);
    } catch (error) {
      console.error('Error updating the database:', error);
    }
  };

  const fields = [
    { label: 'Street', key: 'cust_mailing_address', placeholder: 'Enter street address' },
    { label: 'City', key: 'cust_mailing_city', placeholder: 'Enter city name' },
    { label: 'State', key: 'cust_mailing_state', placeholder: 'Enter state' },
    { label: 'Country', key: 'cust_mailing_country', placeholder: 'Enter country' },
    { label: 'Postal Code', key: 'cust_mailing_postal', placeholder: 'Enter postal code' },
    { label: 'Unit No.', key: 'cust_mailing_unit_no', placeholder: 'Enter Unit No.' },
  ];

  return (
    <fieldset>
      <legend>Mailing Address</legend>
      <hr />
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          id="sameAsPrimary"
          checked={sameAsPrimary}
          onChange={handleSameAsPrimaryChange}
          style={{ transform: 'scale(1.1)', cursor: 'pointer', margin: 0 }}
        />
        <label htmlFor="sameAsPrimary" style={{ margin: 0, whiteSpace: 'nowrap' }}>
          Same as Primary Address
        </label>
      </div>

      {!sameAsPrimary && (
        <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {fields.map(({ label, key, placeholder }) => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{label}</label>
              <input
                type="text"
                id={key}
                placeholder={placeholder}
                value={(formCustomer[key as keyof Customer] as string) || ''}
                onChange={(e) => validateAndSetField(key as keyof Customer, e.target.value)}
                ref={key === 'cust_mailing_address' ? addressRef : undefined}
              />
              {errors[key] && (
                <span className="error" style={{ color: 'red' }}>
                  {errors[key]}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </fieldset>
  );
}

export default MailingAddress;
