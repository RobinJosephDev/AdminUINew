import React, { useState } from 'react';
import { z } from 'zod';
import { Broker } from '../../../styles/types/BrokerTypes';
import { useGoogleAutocomplete } from '../../../hooks/useGoogleAutocomplete';

declare global {
  interface Window {
    google?: any;
  }
}
interface BrokerDetailsProps {
  broker: Broker;
  setBroker: React.Dispatch<React.SetStateAction<Broker>>;
}

const brokerSchema = z.object({
  broker_name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name cannot exceed 200 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]+$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed'),
  broker_address: z
    .string()
    .max(255, 'Street cannot be more than 255 characters')
    .regex(/^[a-zA-Z0-9\s,.'-]*$/, 'Invalid street format')
    .optional(),
  broker_city: z
    .string()
    .max(200, 'City cannot be more than 200 characters')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid city format')
    .optional(),
  broker_state: z
    .string()
    .max(200, 'State cannot be more than 200 characters')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid state format')
    .optional(),
  broker_country: z
    .string()
    .max(100, 'Country cannot be more than 100 characters')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid country format')
    .optional(),
  broker_postal: z
    .string()
    .max(20, 'Postal Code cannot be more than 20 characters')
    .regex(/^[0-9a-zA-Z\s-]*$/, 'Invalid postal code format')
    .optional(),
  broker_email: z.string().max(255, 'Email cannot be more than 255 characters').email('Invalid email format').optional(),
  broker_phone: z
    .string()
    .regex(/^[0-9\-\(\)\s]{0,15}$/, 'Invalid phone number')
    .optional(),
  broker_ext: z
    .string()
    .regex(/^\+?[0-9]{0,10}$/, 'Invalid extension')
    .optional(),
  broker_fax: z
    .string()
    .regex(/^[0-9\-\(\)\s]{0,15}$/, 'Invalid fax number')
    .optional(),
});

const BrokerDetails: React.FC<BrokerDetailsProps> = ({ broker, setBroker }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateAddressFields = (place: google.maps.places.PlaceResult) => {
    const getComponent = (type: string) => place.address_components?.find((c) => c.types.includes(type))?.long_name || '';
    setBroker((prev) => ({
      ...prev,
      broker_address: `${getComponent('street_number')} ${getComponent('route')}`.trim(),
      broker_city: getComponent('locality'),
      broker_state: getComponent('administrative_area_level_1'),
      broker_country: getComponent('country'),
      broker_postal: getComponent('postal_code'),
    }));
  };

  const addressRef = useGoogleAutocomplete(updateAddressFields);

  const validateAndSetField = (field: keyof Broker, value: string) => {
    let error = '';

    const tempBroker = { ...broker, [field]: value };
    const result = brokerSchema.safeParse(tempBroker);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setBroker(tempBroker);
  };

  const fields: { label: string; key: keyof Broker; type?: string; placeholder: string }[] = [
    { label: 'Name', key: 'broker_name', placeholder: 'Enter broker name' },
    { label: 'Street', key: 'broker_address', placeholder: '123 Main St' },
    { label: 'City', key: 'broker_city', placeholder: 'Enter city' },
    { label: 'State', key: 'broker_state', placeholder: 'Enter state' },
    { label: 'Country', key: 'broker_country', placeholder: 'Enter country' },
    { label: 'Postal Code', key: 'broker_postal', placeholder: '12345' },
    { label: 'Email', key: 'broker_email', type: 'email', placeholder: 'example@email.com' },
    { label: 'Phone', key: 'broker_phone', placeholder: '(123) 456-7890' },
    { label: 'Ext', key: 'broker_ext', placeholder: 'Enter extension' },
    { label: 'Fax', key: 'broker_fax', placeholder: '(123) 456-7890' },
  ];

  return (
    <fieldset>
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {fields.map(({ label, key, type, placeholder }) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>
              {label} {key === 'broker_name' && <span style={{ color: 'red' }}>*</span>}
            </label>
            <input
              id={key}
              type={type || 'text'}
              value={(broker[key] as string | number) || ''}
              onChange={(e) => validateAndSetField(key, e.target.value)}
              ref={key === 'broker_address' ? addressRef : undefined}
              placeholder={placeholder}
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

export default BrokerDetails;
