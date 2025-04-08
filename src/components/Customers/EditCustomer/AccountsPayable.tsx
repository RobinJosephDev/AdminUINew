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

interface AccountPayableProps {
  formCustomer: Customer;
  setFormCustomer: React.Dispatch<React.SetStateAction<Customer>>;
}

const APSchema = z.object({
  cust_ap_name: z
    .string()
    .max(200, 'Name cannot exceed 200 characters')
    .regex(/^[a-zA-Z0-9\s.,'"-]+$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  cust_ap_address: z
    .string()
    .max(255, 'Address is too long')
    .regex(/^[a-zA-Z0-9\s,.'-]*$/, 'Invalid street format')
    .optional(),
  cust_ap_city: z
    .string()
    .max(200, 'City name is too long')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid city format')
    .optional(),
  cust_ap_state: z
    .string()
    .max(200, 'Invalid state')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid state format')
    .optional(),
  cust_ap_country: z
    .string()
    .max(100, 'Invalid country')
    .regex(/^[a-zA-Z\s.'-]*$/, 'Invalid country format')
    .optional(),
  cust_ap_postal: z
    .string()
    .max(20, 'Postal code cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9-\s]*$/, 'Invalid postal code')
    .optional(),
  cust_ap_unit_no: z
    .string()
    .max(30, 'Unit No cannot exceed 30 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid phone format')
    .optional(),
  cust_ap_email: z.string().max(255, 'Email cannot exceed 255 characters').email('Invalid email format').optional(),
  cust_ap_phone: z
    .string()
    .max(30, 'Phone cannot exceed 30 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid phone format')
    .optional(),
  cust_ap_phone_ext: z
    .string()
    .max(10, 'Phone Ext cannot exceed 10 characters')
    .regex(/^[a-zA-Z0-9-]*$/, 'Only letters, numbers, and hyphens allowed')
    .optional(),
  cust_ap_fax: z
    .string()
    .max(30, 'Fax cannot exceed 30 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid fax format')
    .optional(),
});

const AccountsPayable: FC<AccountPayableProps> = ({ formCustomer, setFormCustomer }) => {
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
    if (!place.address_components) return;

    const getComponent = (type: string) => place.address_components?.find((c) => c.types.includes(type))?.long_name || '';

    setFormCustomer((prev) => ({
      ...prev,
      cust_ap_address: `${getComponent('street_number')} ${getComponent('route')}`.trim(),
      cust_ap_city: getComponent('locality'),
      cust_ap_state: getComponent('administrative_area_level_1'),
      cust_ap_country: getComponent('country'),
      cust_ap_postal: getComponent('postal_code'),
    }));
  };

  const addressRef = useGoogleAutocomplete(updateAddressFields);

  const validateAndSetField = (field: keyof Customer, value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    let error = '';

    const tempVendor = { ...formCustomer, [field]: sanitizedValue };

    if (field in APSchema.shape) {
      const result = APSchema.safeParse(tempVendor);

      if (!result.success) {
        const fieldError = result.error.errors.find((err) => err.path[0] === field);
        error = fieldError ? fieldError.message : '';
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormCustomer(tempVendor);
  };

  const fields = [
    { label: 'Street', key: 'cust_ap_address', placeholder: 'Enter street address' },
    { label: 'City', key: 'cust_ap_city', placeholder: 'Enter city name' },
    { label: 'State', key: 'cust_ap_state', placeholder: 'Enter state' },
    { label: 'Country', key: 'cust_ap_country', placeholder: 'Enter country' },
    { label: 'Postal Code', key: 'cust_ap_postal', placeholder: 'Enter postal code' },
    { label: 'Unit No.', key: 'cust_ap_unit_no', placeholder: 'Enter Unit No.' },
    { label: 'Email', key: 'cust_ap_email', placeholder: 'Enter email id' },
    { label: 'Phone', key: 'cust_ap_phone', placeholder: 'Enter phone no' },
    { label: 'Phone ext', key: 'cust_ap_phone_ext', placeholder: 'Enter phone ext' },
    { label: 'Fax', key: 'cust_ap_fax', placeholder: 'Enter fax' },
  ];

  return (
    <fieldset>
      <legend>Account Payable</legend>
      <hr />

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
              ref={key === 'cust_ap_address' ? addressRef : undefined}
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

export default AccountsPayable;
