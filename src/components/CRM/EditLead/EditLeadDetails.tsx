import { useState } from 'react';
import DOMPurify from 'dompurify';
import { z } from 'zod';
import { Lead } from '../../../styles/types/LeadTypes';

interface EditLeadDetailsProps {
  formLead: Lead;
  setFormLead: React.Dispatch<React.SetStateAction<Lead>>;
}

const leadDetailSchema = z.object({
  lead_no: z
    .string()
    .max(200, 'Legal No must be at most 200 characters long')
    .regex(/^[a-zA-Z0-9\s.,'-]+$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
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
  website: z.string().max(255, 'Website must be at most 255 characters long').url('Invalid website URL').optional(),
  lead_type: z.enum(['AB', 'BC', 'BDS', 'CA', 'DPD MAGMA', 'MB', 'ON', 'Super Leads', 'TBAB', 'USA'], {
    errorMap: () => ({ message: 'Invalid lead type' }),
  }),
  lead_status: z.enum(
    [
      'Prospect',
      'Lanes discussed',
      'Prod/Equip noted',
      'E-mail sent',
      'Portal registration',
      'Quotations',
      'Fob/Have broker',
      'VM/No answer',
      'Diff Dept.',
      'No reply',
      'Not Int.',
      'Asset based',
    ],
    {
      errorMap: () => ({ message: 'Invalid lead status' }),
    }
  ),
});

const EditLeadDetails: React.FC<EditLeadDetailsProps> = ({ formLead, setFormLead }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSetLead = (field: keyof Lead, value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    let error = '';

    const tempLead = { ...formLead, [field]: sanitizedValue };
    const result = leadDetailSchema.safeParse(tempLead);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormLead(tempLead);
  };

  const fields = [
    { label: 'Lead#', key: 'lead_no', type: 'text', placeholder: 'Enter lead#', required: true },
    { label: 'Lead Date', key: 'lead_date', type: 'date', placeholder: 'Enter lead date', required: true },
    { label: 'Customer Name', key: 'customer_name', placeholder: 'Enter customer name' },
    { label: 'Phone', key: 'phone', type: 'text', placeholder: 'Enter phone number' },
    { label: 'Email', key: 'email', type: 'text', placeholder: 'Enter email' },
    { label: 'Website', key: 'website', type: 'text', placeholder: 'Enter website URL' },
  ];

  return (
    <fieldset className="form-section">
      <legend>Lead Details</legend>
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
              value={(formLead[key as keyof Lead] as string | number) || ''}
              onChange={(e) => validateAndSetLead(key as keyof Lead, e.target.value)}
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
          </label>{' '}
          <select
            id="lead_type"
            value={formLead.lead_type || ''}
            onChange={(e) => setFormLead((prevLead) => ({ ...prevLead, lead_type: e.target.value }))}
          >
            <option value="" disabled>Select Lead Type</option>
            <option value="AB">AB</option>
            <option value="BC">BC</option>
            <option value="BDS">BDS</option>
            <option value="CA">CA</option>
            <option value="DPD MAGMA">DPD MAGMA</option>
            <option value="MB">MB</option>
            <option value="ON">ON</option>
            <option value="Super Leads">Super Leads</option>
            <option value="TBAB">TBAB</option>
            <option value="USA">USA</option>
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
          </label>{' '}
          <select
            id="lead_status"
            value={formLead.lead_status || ''}
            onChange={(e) => setFormLead((prevLead) => ({ ...prevLead, lead_status: e.target.value }))}
          >
            <option value="" disabled>Select Lead Status</option>
            <option value="Prospect">Prospect</option>
            <option value="Lanes discussed">Lanes discussed</option>
            <option value="Prod/Equip noted">Prod/Equip noted</option>
            <option value="E-mail sent">E-mail sent</option>
            <option value="Portal registration">Portal registration</option>
            <option value="Quotations">Quotations</option>
            <option value="Fob/Have broker">Fob/Have broker</option>
            <option value="VM/No answer">VM/No answer</option>
            <option value="Diff Dept.">Diff Dept.</option>
            <option value="No reply">No reply</option>
            <option value="Not Int.">Not Int.</option>
            <option value="Asset based">Asset based</option>
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

export default EditLeadDetails;
