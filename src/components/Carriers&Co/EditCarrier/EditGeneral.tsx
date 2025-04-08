import { useState } from 'react';
import { Carrier } from '../../../styles/types/CarrierTypes';
import DOMPurify from 'dompurify';
import { z } from 'zod';

interface EditGeneralProps {
  formCarrier: Carrier;
  setFormCarrier: React.Dispatch<React.SetStateAction<Carrier>>;
}

const carrierSchema = z.object({
  dba: z
    .string()
    .min(1, 'DBA is required')
    .max(100, 'DBA cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]+$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed'),
  legal_name: z
    .string()
    .min(1, 'Legal Name is required')
    .max(100, 'Legal Name cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]+$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed'),
  remit_name: z
    .string()
    .max(100, 'Remit Name cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  acc_no: z
    .string()
    .max(50, 'Account Number cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9-]*$/, 'Only letters, numbers, and dashes allowed')
    .optional(),
  branch: z
    .string()
    .max(50, 'Branch cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  website: z.string().max(150, 'Website URL too long').url('Invalid URL').optional(),
  fed_id_no: z
    .string()
    .max(20, 'Federal ID Number cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9-]*$/, 'Only letters, numbers, and dashes allowed')
    .optional(),
  pref_curr: z.enum(['USD', 'CAD']).optional(),
  pay_terms: z
    .string()
    .max(50, 'Payment Terms cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  form_1099: z.boolean().optional(),
  advertise: z.boolean().optional(),
  advertise_email: z.string().max(255, 'Email cannot exceed 255 characters').email('Invalid email format').optional(),
});

const fields = [
  { key: 'dba', label: 'DBA', placeholder: 'Enter DBA', type: 'text', required: true },
  { key: 'legal_name', label: 'Legal Name', placeholder: 'Enter Legal Name', type: 'text', required: true },
  { key: 'remit_name', label: 'Remit Name', placeholder: 'Enter Remit Name', type: 'text' },
  { key: 'acc_no', label: 'Account Number', placeholder: 'Enter Account Number', type: 'text' },
  { key: 'branch', label: 'Branch', placeholder: 'Enter Branch', type: 'text' },
  { key: 'website', label: 'Website', placeholder: 'Enter Website URL', type: 'text' },
  { key: 'fed_id_no', label: 'Federal ID Number', placeholder: 'Enter Federal ID Number', type: 'text' },
  { key: 'pay_terms', label: 'Payment Terms', placeholder: 'Enter Payment Terms', type: 'text' },
  { key: 'advertise_email', label: 'Advertise Email', placeholder: 'Enter Advertise Email', type: 'text' },
  { key: 'advertise', label: 'Advertise', type: 'boolean' },
  { key: 'form_1099', label: '1099', type: 'boolean' },
];

const EditGeneral: React.FC<EditGeneralProps> = ({ formCarrier, setFormCarrier }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSetCarrier = (field: keyof Carrier, value: string | boolean) => {
    let sanitizedValue = value;

    if (['approved', 'form_1099', 'advertise'].includes(field) && typeof value !== 'boolean') {
      sanitizedValue = value === 'true';
    } else if (typeof value !== 'boolean') {
      sanitizedValue = DOMPurify.sanitize(value);
    }

    let error = '';
    const tempCarrier = { ...formCarrier, [field]: sanitizedValue };
    const result = carrierSchema.safeParse(tempCarrier);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormCarrier(tempCarrier);
  };

  return (
    <fieldset className="form-section">
      <legend>General</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {/* Dynamic Input Fields */}
        {fields.map(({ key, label, placeholder, type, required }) => (
          <div key={key}>
            <div className="form-group" style={{ flex: '1 1 45%' }} key={key}>
              {type === 'boolean' ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id={key}
                    checked={!!formCarrier[key as keyof Carrier]}
                    onChange={(e) => validateAndSetCarrier(key as keyof Carrier, e.target.checked)}
                    style={{ transform: 'scale(1.1)', cursor: 'pointer', margin: 0 }}
                  />
                  <label htmlFor={key} style={{ margin: 0, whiteSpace: 'nowrap' }}>
                    {label}
                  </label>
                </div>
              ) : (
                <div className="form-group" style={{ flex: '1 1 45%' }}>
                  <label htmlFor={key}>
                    {label} {required && <span style={{ color: 'red' }}>*</span>}
                  </label>{' '}
                  <input
                    type="text"
                    id={key}
                    placeholder={placeholder}
                    value={String(formCarrier[key as keyof Carrier] || '')}
                    onChange={(e) => validateAndSetCarrier(key as keyof Carrier, e.target.value)}
                  />
                </div>
              )}
              {errors[key] && (
                <span className="error" style={{ color: 'red' }}>
                  {errors[key]}
                </span>
              )}
            </div>
          </div>
        ))}
        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label htmlFor="pref_curr">Preferred Currency</label>
          <select
            id="pref_curr"
            value={formCarrier.pref_curr || ''}
            onChange={(e) => setFormCarrier((prevCarrier) => ({ ...prevCarrier, pref_curr: e.target.value }))}
          >
            <option value="">Select Currency</option>
            <option value="USD">USD</option>
            <option value="CAD">CAD</option>
          </select>
          {errors.pref_curr && (
            <span className="error" style={{ color: 'red' }}>
              {errors.pref_curr}
            </span>
          )}
        </div>
      </div>
    </fieldset>
  );
};

export default EditGeneral;
