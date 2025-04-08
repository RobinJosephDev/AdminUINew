import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { z } from 'zod';
import { Broker } from '../../../styles/types/BrokerTypes';
import { useGoogleAutocomplete } from '../../../hooks/useGoogleAutocomplete';

declare global {
  interface Window {
    google?: any;
  }
}

interface EditBrokerDetailsProps {
  formBroker: Broker;
  setFormBroker: React.Dispatch<React.SetStateAction<Broker>>;
}

const brokerSchema = z.object({
  broker_name: z
    .string()
    .min(1, 'Name is required')
    .max(200)
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

const EditBrokerDetails: React.FC<EditBrokerDetailsProps> = ({ formBroker, setFormBroker }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateAddressFields = (place: google.maps.places.PlaceResult) => {
    const getComponent = (type: string) => place.address_components?.find((c) => c.types.includes(type))?.long_name || '';
    setFormBroker((prev) => ({
      ...prev,
      broker_address: `${getComponent('street_number')} ${getComponent('route')}`.trim(),
      broker_city: getComponent('locality'),
      broker_state: getComponent('administrative_area_level_1'),
      broker_country: getComponent('country'),
      broker_postal: getComponent('postal_code'),
    }));
  };
  const addressRef = useGoogleAutocomplete(updateAddressFields);

  const handleChange = (key: keyof Broker, value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value.trim());
    setFormBroker((prev) => ({ ...prev, [key]: sanitizedValue }));

    const result = brokerSchema.safeParse({ ...formBroker, [key]: sanitizedValue });
    if (!result.success) {
      const error = result.error.errors.find((err) => err.path[0] === key)?.message || '';
      setErrors((prev) => ({ ...prev, [key]: error }));
    } else {
      setErrors((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const fields: { label: string; key: keyof Broker; type?: string }[] = [
    { label: 'Name', key: 'broker_name' },
    { label: 'Street', key: 'broker_address' },
    { label: 'City', key: 'broker_city' },
    { label: 'State', key: 'broker_state' },
    { label: 'Country', key: 'broker_country' },
    { label: 'Postal Code', key: 'broker_postal' },
    { label: 'Email', key: 'broker_email', type: 'email' },
    { label: 'Phone', key: 'broker_phone' },
    { label: 'Ext', key: 'broker_ext' },
    { label: 'Fax', key: 'broker_fax' },
  ];

  return (
    <fieldset>
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {fields.map(({ label, key, type }) => (
          <div className="form-group" key={key}>
            {label} {key === 'broker_name' && <span style={{ color: 'red' }}>*</span>}
            <input
              id={key}
              type={type || 'text'}
              value={(formBroker[key] as string | number) || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              ref={key === 'broker_address' ? addressRef : undefined}
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

export default EditBrokerDetails;
