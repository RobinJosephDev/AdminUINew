import { useState } from 'react';
import { Lead } from '../../../styles/types/LeadTypes';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { useGoogleAutocomplete } from '../../../hooks/useGoogleAutocomplete';

declare global {
  interface Window {
    google?: any;
  }
}

interface EditAddressDetailsProps {
  formLead: Lead;
  setFormLead: React.Dispatch<React.SetStateAction<Lead>>;
}

const addressSchema = z.object({
  address: z
    .string()
    .max(255, 'Address is too long')
    .regex(/^[a-zA-Z0-9\s,.'-]*$/, 'Invalid street format')
    .optional(),
  city: z
    .string()
    .max(200, 'City name is too long')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid city format')
    .optional(),
  state: z
    .string()
    .max(200, 'Invalid state')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid state format')
    .optional(),
  country: z
    .string()
    .max(100, 'Invalid country')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid country format')
    .optional(),
  postal_code: z
    .string()
    .max(20, 'Postal code cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9-\s ]*$/, 'Invalid postal code')
    .optional(),
  unit_no: z
    .string()
    .max(30, 'Phone cannot exceed 30 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid phone format')
    .optional(),
});

const EditAddressDetails: React.FC<EditAddressDetailsProps> = ({ formLead, setFormLead }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateAddressFields = (place: google.maps.places.PlaceResult) => {
    const getComponent = (type: string) => place.address_components?.find((c) => c.types.includes(type))?.long_name || '';
    setFormLead((prev) => ({
      ...prev,
      address: `${getComponent('street_number')} ${getComponent('route')}`.trim(),
      city: getComponent('locality'),
      state: getComponent('administrative_area_level_1'),
      country: getComponent('country'),
      postal_code: getComponent('postal_code'),
    }));
  };
  const addressRef = useGoogleAutocomplete(updateAddressFields);

  const validateAndSetField = (field: keyof Lead, value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    let error = '';

    const tempLead = { ...formLead, [field]: sanitizedValue };
    const result = addressSchema.safeParse(tempLead);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormLead(tempLead);
  };

  const fields = [
    { label: 'Address', key: 'address', placeholder: 'Enter street address' },
    { label: 'City', key: 'city', placeholder: 'Enter city name' },
    { label: 'State', key: 'state', placeholder: 'Enter state' },
    { label: 'Country', key: 'country', placeholder: 'Enter country' },
    { label: 'Postal Code', key: 'postal_code', placeholder: 'Enter postal code' },
    { label: 'Unit No.', key: 'unit_no', placeholder: 'Enter unit number' },
  ];

  return (
    <fieldset className="form-section">
      <legend>Address Details</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {fields.map(({ label, key, placeholder }) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{label}</label>
            <input
              type="text"
              id={key}
              placeholder={placeholder}
              value={(formLead[key as keyof Lead] as string | number) || ''}
              onChange={(e) => validateAndSetField(key as keyof Lead, e.target.value)}
              ref={key === 'address' ? addressRef : undefined}
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

export default EditAddressDetails;
