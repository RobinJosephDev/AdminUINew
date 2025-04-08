import { useState } from 'react';
import DOMPurify from 'dompurify';
import { z } from 'zod';
import { Followup } from '../../../styles/types/FollowupTypes';

interface leadInfoProps {
  followupEdit: Followup;
  setFollowupEdit: React.Dispatch<React.SetStateAction<Followup>>;
}

const leadInfoSchema = z.object({
  lead_no: z
    .string()
    .min(1, 'Lead No is required')
    .max(100, 'Lead No must be at most 100 characters long')
    .regex(/^[a-zA-Z0-9\s.,'-]+$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed'),
  lead_date: z
    .string()
    .min(1, 'Lead Date is required')
    .regex(/^\d{2}-\d{2}-\d{4}$/, { message: 'Date must be in DD-MM-YYYY format' })
    .optional(),
  customer_name: z
    .string()
    .max(200, 'Customer Name must be at most 200 characters long')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  phone: z
    .string()
    .max(30, 'Phone cannot exceed 30 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid phone format')
    .optional(),
  email: z.string().max(255, 'Email cannot exceed 255 characters').email('Invalid email format').optional(),
  lead_type: z.enum(['AB', 'BC', 'BDS', 'CA', 'DPD MAGMA', 'MB', 'ON', 'Super Leads', 'TBAB', 'USA'], {
    errorMap: () => ({ message: 'Invalid lead type' }),
  }),
  lead_status: z.enum(['New', 'In Progress', 'Completed', 'On Hold', 'Lost'], {
    errorMap: () => ({ message: 'Invalid lead status' }),
  }),
});

const EditLeadInfo: React.FC<leadInfoProps> = ({ followupEdit, setFollowupEdit }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const leadTypeOptions = ['AB', 'BC', 'BDS', 'CA', 'DPD MAGMA', 'MB', 'ON', 'Super Leads', 'TBAB', 'USA'];
  const leadStatusOptions = ['New', 'In Progress', 'Completed', 'On Hold', 'Lost'];

  const validateAndSetFollowup = (field: keyof Followup, value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    let error = '';

    const tempLead = { ...followupEdit, [field]: sanitizedValue };
    const result = leadInfoSchema.safeParse(tempLead);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFollowupEdit(tempLead);
  };

  const fields = [
    { label: 'Lead#', key: 'lead_no', type: 'text', placeholder: 'Enter lead#', required: true },
    { label: 'Lead Date', key: 'lead_date', type: 'date', placeholder: 'Enter lead date', required: true },
    { label: 'Customer Name', key: 'customer_name', placeholder: 'Enter customer name' },
    { label: 'Phone', key: 'phone', type: 'text', placeholder: 'Enter phone number' },
    { label: 'Email', key: 'email', type: 'text', placeholder: 'Enter email' },
  ];

  return (
    <fieldset className="form-section">
      <legend>Lead Info</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {fields.map(({ label, key, type, placeholder, required }) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>
              {label} {required && <span style={{ color: 'red' }}>*</span>}
            </label>{' '}
            <input
              type={type}
              id={key}
              placeholder={placeholder}
              value={(followupEdit[key as keyof Followup] as string | number) || ''}
              onChange={(e) => validateAndSetFollowup(key as keyof Followup, e.target.value)}
            />
            {errors[key] && (
              <span className="error" style={{ color: 'red' }}>
                {errors[key]}
              </span>
            )}
          </div>
        ))}
        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label htmlFor="lead_type">
            Lead Type <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            id="lead_type"
            value={followupEdit.lead_type || ''}
            onChange={(e) => setFollowupEdit((prevLead) => ({ ...prevLead, lead_type: e.target.value }))}
          >
            <option value="" disabled>
              Select Lead Type
            </option>
            {leadTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.lead_type && (
            <span className="error" style={{ color: 'red' }}>
              {errors.lead_type}
            </span>
          )}
        </div>
        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label htmlFor="lead_status">
            Lead Status <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            id="lead_status"
            value={followupEdit.lead_status || ''}
            onChange={(e) => setFollowupEdit((prevLead) => ({ ...prevLead, lead_status: e.target.value }))}
          >
            <option value="" disabled>
              Select Lead Status
            </option>
            {leadStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.lead_status && (
            <span className="error" style={{ color: 'red' }}>
              {errors.lead_status}
            </span>
          )}
        </div>
      </div>
    </fieldset>
  );
};

export default EditLeadInfo;
