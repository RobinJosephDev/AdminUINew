import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { FC, useCallback, useState } from 'react';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { Order, Location } from '../../styles/types/OrderTypes';
import { useGoogleAutocomplete } from '../../hooks/useGoogleAutocomplete';

declare global {
  interface Window {
    google?: any;
  }
}

interface OrderDestinationProps {
  order: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
  destination_location: Location[];
  index: number;
  handleDestinationChange: (index: number, updatedDestination: Location) => void;
  handleRemoveDestination: (index: number) => void;
  onAddDestination: () => void;
}

const destinationSchema = z.object({
  address: z
    .string()
    .max(255, 'Address is too long')
    .regex(/^[a-zA-Z0-9\s,.'-]+$/, 'Invalid address format')
    .optional(),
  city: z
    .string()
    .max(100, 'City name is too long')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Invalid city format')
    .optional(),
  state: z
    .string()
    .max(100, 'State name is too long')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Invalid state format')
    .optional(),
  country: z
    .string()
    .max(100, 'Country name is too long')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Invalid country format')
    .optional(),
  postal: z
    .string()
    .max(20, 'Postal code cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Invalid postal code format')
    .optional(),
  phone: z
    .string()
    .max(30, 'Phone number cannot exceed 30 characters')
    .regex(/^[0-9+\-()\s]+$/, 'Invalid phone number format')
    .optional(),
  date: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, { message: 'Date must be in DD-MM-YYYY format' })
    .optional(),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format (24-hour)')
    .optional(),
  currency: z
    .string()
    .max(10, 'Currency code cannot exceed 10 characters')
    .regex(/^[A-Z]{3}$/, 'Invalid currency format (e.g., USD, EUR)')
    .optional(),
  equipment: z
    .string()
    .max(50, 'Equipment description cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Invalid equipment format')
    .optional(),
  pickup_po: z
    .string()
    .max(50, 'Pickup PO cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Invalid pickup PO format')
    .optional(),
  packages: z.number().int().min(1, 'Packages must be at least 1').max(99999, 'Packages cannot exceed 99,999').optional(),
  weight: z.number().min(0, 'Weight cannot be negative').max(1000000, 'Weight cannot exceed 1,000,000 kg').optional(),
  dimensions: z
    .string()
    .max(50, 'Dimensions cannot exceed 50 characters')
    .regex(/^\d+x\d+x\d+$/, 'Invalid dimensions format (e.g., 10x20x30)')
    .optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

const OrderDestination: FC<OrderDestinationProps> = ({
  setOrder,
  destination_location,
  index,
  handleDestinationChange,
  handleRemoveDestination,
  onAddDestination,
}) => {
  const destination = destination_location[index] ?? {};
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateAddressFields = (place: google.maps.places.PlaceResult) => {
    const getComponent = (type: string) => place.address_components?.find((c) => c.types.includes(type))?.long_name || '';

    setOrder((prev) => ({
      ...prev,
      destination_location: prev.destination_location.map((loc, i) =>
        i === index
          ? {
              ...loc,
              address: `${getComponent('street_number')} ${getComponent('route')}`.trim(),
              city: getComponent('locality'),
              state: getComponent('administrative_area_level_1'),
              country: getComponent('country'),
              postal: getComponent('postal_code'),
            }
          : loc
      ),
    }));
  };

  const addressRef = useGoogleAutocomplete(updateAddressFields);

  const validateAndSetDestination = useCallback(
    (field: keyof Location, value: string) => {
      const sanitizedValue = DOMPurify.sanitize(value);
      let parsedValue: string | number = sanitizedValue;

      // Convert numerical fields before validation
      if (field === 'packages' || field === 'weight') {
        parsedValue = sanitizedValue ? Number(sanitizedValue) : 0;
      }

      let error = '';
      const updatedDestination = { ...destination, [field]: parsedValue };
      const result = destinationSchema.safeParse(updatedDestination);

      if (!result.success) {
        const fieldError = result.error.errors.find((err) => err.path[0] === field);
        error = fieldError ? fieldError.message : '';
      }

      setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
      handleDestinationChange(index, updatedDestination);
    },
    [destination, handleDestinationChange, index]
  );

  const fields = [
    { label: 'Address', type: 'text', key: 'address', placeholder: 'Enter street address' },
    { label: 'City', key: 'city', type: 'text', placeholder: 'Enter city name' },
    { label: 'State', key: 'state', type: 'text', placeholder: 'Enter state' },
    { label: 'Country', key: 'country', type: 'text', placeholder: 'Enter country' },
    { label: 'Postal Code', key: 'postal', type: 'text', placeholder: 'Enter postal code' },
    { label: 'Phone', key: 'phone', type: 'text', placeholder: 'Enter phone number' },
    { label: 'Date', key: 'date', type: 'date', placeholder: 'Enter date (YYYY-MM-DD)' },
    { label: 'Time', key: 'time', placeholder: 'Enter time (HH:MM)' },
    { label: 'Currency', key: 'currency', type: 'text', placeholder: 'Enter currency (e.g., USD, EUR)' },
    { label: 'Equipment', key: 'equipment', type: 'text', placeholder: 'Enter equipment details' },
    { label: 'Pickup PO', key: 'pickup_po', type: 'text', placeholder: 'Enter pickup PO number' },
    { label: 'Packages', key: 'packages', type: 'text', placeholder: 'Enter number of packages' },
    { label: 'Weight', key: 'weight', type: 'text', placeholder: 'Enter weight (kg/lbs)' },
    { label: 'Dimensions', key: 'dimensions', type: 'text', placeholder: 'Enter dimensions (LxWxH cm/inches)' },
    { label: 'Notes', key: 'notes', type: 'textarea', placeholder: 'Enter additional notes' },
  ];

  return (
    <fieldset className="form-section" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div className="form-grid" style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(5, 1fr)', flex: 1 }}>
        {fields.map(({ label, key, type, placeholder }) => (
          <div className="form-group" key={key} style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor={`${key}-${index}`}>{label}</label>
            {type === 'textarea' ? (
              <textarea
                id={`${key}-${index}`}
                name={key}
                value={(destination[key as keyof Location] as string) || ''}
                onChange={(e) => validateAndSetDestination(key as keyof Location, e.target.value)}
                placeholder={placeholder}
                rows={4}
              />
            ) : (
              <input
                id={`${key}-${index}`}
                name={key}
                type={type}
                value={(destination[key as keyof Location] as string | number) || ''}
                onChange={(e) => validateAndSetDestination(key as keyof Location, e.target.value)}
                placeholder={placeholder}
                ref={key === 'address' ? addressRef : undefined}
              />
            )}

            {errors[key] && (
              <span className="error" style={{ color: 'red' }}>
                {errors[key]}
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
        <button type="button" onClick={onAddDestination} className="add-button">
          <PlusOutlined />
        </button>
        <button type="button" onClick={() => handleRemoveDestination(index)} className="delete-button">
          <DeleteOutlined />
        </button>
      </div>
    </fieldset>
  );
};

export default OrderDestination;
