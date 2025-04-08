import { useState, useEffect } from 'react';
import { Carrier } from '../../../styles/types/CarrierTypes';
import * as z from 'zod';
import DOMPurify from 'dompurify';
import { useGoogleAutocomplete } from '../../../hooks/useGoogleAutocomplete';

declare global {
  interface Window {
    google?: any;
  }
}

interface EditMailingAddressProps {
  formCarrier: Carrier;
  setFormCarrier: React.Dispatch<React.SetStateAction<Carrier>>;
}

const mailingSchema = z.object({
  mailing_address: z
    .string()
    .max(255, 'Address is too long')
    .regex(/^[a-zA-Z0-9\s,.'-]*$/, 'Invalid street format')
    .optional(),
  mailing_city: z
    .string()
    .max(200, 'City name is too long')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid city format')
    .optional(),
  mailing_state: z
    .string()
    .max(200, 'Invalid state')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid state format')
    .optional(),
  mailing_country: z
    .string()
    .max(100, 'Invalid country')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid country format')
    .optional(),
  mailing_postal: z
    .string()
    .max(20, 'Postal code cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9-\s ]*$/, 'Invalid postal code')
    .optional(),
  mailing_phone: z
    .string()
    .max(30, 'Phone cannot exceed 30 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid phone format')
    .optional(),
});

function EditMailingAddress({ formCarrier, setFormCarrier }: EditMailingAddressProps) {
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
    setFormCarrier((prev) => ({
      ...prev,
      mailing_address: `${getComponent('street_number')} ${getComponent('route')}`.trim(),
      mailing_city: getComponent('locality'),
      mailing_state: getComponent('administrative_area_level_1'),
      mailing_country: getComponent('country'),
      mailing_postal: getComponent('postal_code'),
    }));
  };
  const addressRef = useGoogleAutocomplete(updateAddressFields);

  const validateAndSetField = (field: keyof Carrier, value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    let error = '';

    const tempVendor = { ...formCarrier, [field]: sanitizedValue };

    if (field in mailingSchema.shape) {
      const result = mailingSchema.safeParse(tempVendor);

      if (!result.success) {
        const fieldError = result.error.errors.find((err) => err.path[0] === field);
        error = fieldError ? fieldError.message : '';
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormCarrier(tempVendor);
  };

  const handleSameAsPrimaryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSameAsPrimary(isChecked);

    setFormCarrier((prev) => ({
      ...prev,
      mailing_address: isChecked ? prev.primary_address : '',
      mailing_city: isChecked ? prev.primary_city : '',
      mailing_state: isChecked ? prev.primary_state : '',
      mailing_country: isChecked ? prev.primary_country : '',
      mailing_postal: isChecked ? prev.primary_postal : '',
      mailing_phone: isChecked ? prev.primary_phone : '',
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
    { label: 'Street', key: 'mailing_address', placeholder: 'Enter street address' },
    { label: 'City', key: 'mailing_city', placeholder: 'Enter city name' },
    { label: 'State', key: 'mailing_state', placeholder: 'Enter state' },
    { label: 'Country', key: 'mailing_country', placeholder: 'Enter country' },
    { label: 'Postal Code', key: 'mailing_postal', placeholder: 'Enter postal code' },
    { label: 'Phone', key: 'mailing_phone', placeholder: 'Enter phone number' },
  ];

  return (
    <fieldset className="form-section">
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
          {fields.map(({ label, key }) => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{label}</label>
              <input
                type="text"
                id={key}
                placeholder={`Enter ${key.replace('mailing_', '')}`}
                value={(formCarrier[key as keyof Carrier] as string | number) || ''}
                onChange={(e) => validateAndSetField(key as keyof Carrier, e.target.value)}
                ref={key === 'mailing_address' ? addressRef : undefined}
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

export default EditMailingAddress;
