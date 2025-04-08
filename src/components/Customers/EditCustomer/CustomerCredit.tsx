import { useState } from 'react';
import { Customer } from '../../../styles/types/CustomerTypes';
import { z } from 'zod';
import DOMPurify from 'dompurify';

interface CustomerCreditProps {
  formCustomer: Customer;
  setFormCustomer: React.Dispatch<React.SetStateAction<Customer>>;
}
const creditStatusOptions = ['Approved', 'Not Approved'];
const API_URL = process.env.API_BASE_URL;

const creditSchema = z.object({
  cust_credit_status: z
    .enum(creditStatusOptions as [string, ...string[]], {
      errorMap: () => ({ message: 'Invalid equipment type' }),
    })
    .optional(),
  cust_credit_appd: z
    .string()
    // .regex(/^\d{2}-\d{2}-\d{4}$/, { message: 'Approval date must be in DD-MM-YYYY format' })
    .optional(),
  cust_credit_expd: z
    .string()
    // .regex(/^\d{2}-\d{2}-\d{4}$/, { message: 'Expiry date must be in DD-MM-YYYY format' })
    .optional(),
  cust_credit_mop: z
    .string()
    .max(100, 'Mode of payment must be at most 100 characters long')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  cust_credit_currency: z
    .string()
    .max(10, 'Currency must be at most 10 characters long')
    .regex(/^[a-zA-Z0-9-]*$/, 'Only letters, numbers, and dashes allowed')
    .optional(),
  cust_credit_application: z.boolean().optional(),
  cust_credit_terms: z
    .string()
    .max(100, 'Terms must be at most 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  cust_credit_limit: z.string().max(100, 'Limit must be at most 100 characters long').regex(/^\d*$/, 'Limit must be numeric').optional(),
  cust_credit_notes: z
    .string()
    .max(500, 'Notes cannot exceed 500 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
});

function CustomerCredit({ formCustomer, setFormCustomer }: CustomerCreditProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<boolean>(false);
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const validateAndSetCustomer = (field: keyof Customer, value: string | boolean) => {
    let sanitizedValue: string | boolean = typeof value === 'boolean' ? value : DOMPurify.sanitize(value);

    let error = '';
    const tempCustomer = { ...formCustomer, [field]: sanitizedValue };
    const result = creditSchema.safeParse(tempCustomer);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormCustomer(tempCustomer);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'cust_sbk_agreement' | 'cust_credit_agreement') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(fileType, file);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      console.log('Full Upload Response:', data); // Log full response

      // Ensure expected response structure
      if (data && data.files && data.files[fileType]) {
        console.log('File data:', data.files[fileType]); // Log file data

        if (data.files[fileType].fileUrl) {
          const baseURL = API_URL.replace('/api', '');
          const fullFileUrl = data.files[fileType].fileUrl.startsWith('http')
            ? data.files[fileType].fileUrl
            : `${baseURL}${data.files[fileType].fileUrl}`;

          setFormCustomer((prevCustomer) => ({
            ...prevCustomer,
            [fileType]: fullFileUrl,
            [`${fileType}_name`]: data.files[fileType].fileName,
          }));
        } else {
          console.error('File URL not found in response:', data);
          alert('File upload failed: No file URL returned.');
        }
      } else {
        console.error('Unexpected response structure:', data);
        alert('File upload failed: Unexpected response format.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Network error during file upload.');
    } finally {
      setUploading(false);
    }
  };

  const fields = [
    { key: 'cust_credit_appd', label: 'Approval date', type: 'date' },
    { key: 'cust_credit_expd', label: 'Expiry date', type: 'date' },
    { key: 'cust_credit_mop', label: 'Mode of Payment', type: 'text', placeholder: 'Enter mode of payment' },
    { key: 'cust_credit_currency', label: 'Currency', type: 'text', placeholder: 'Enter Currency' },
    { key: 'cust_credit_application', label: 'Credit Application', type: 'boolean' },
    { key: 'cust_credit_terms', label: 'Terms', type: 'text', placeholder: 'Enter credit terms' },
    { key: 'cust_credit_limit', label: 'Limit', type: 'text', placeholder: 'Enter credit limit' },
    { key: 'cust_credit_notes', label: 'Notes', type: 'textarea', placeholder: 'Enter notes' },
  ];

  return (
    <fieldset>
      <legend>Customer Credit</legend>
      <hr />
      <div
        className="form-grid"
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        }}
      >
        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label htmlFor="credStatus">Credit Status</label>
          <select
            id="credStatus"
            value={formCustomer.cust_credit_status}
            onChange={(e) => setFormCustomer((prevCustomer) => ({ ...prevCustomer, cust_credit_status: e.target.value }))}
          >
            <option value="">Select...</option>
            {creditStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.cust_credit_status && (
            <span className="error" style={{ color: 'red' }}>
              {errors.cust_credit_status}
            </span>
          )}
        </div>

        {fields.map(({ label, key, placeholder, type }) => (
          <div key={key} className="form-group" style={{ flex: '1 1 45%' }}>
            {type === 'boolean' ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id={key}
                  checked={!!formCustomer[key as keyof Customer]}
                  onChange={(e) => {
                    const value = e.target.checked;
                    setFormCustomer((prevCustomer) => ({
                      ...prevCustomer,
                      [key]: value,
                    }));
                  }}
                  style={{ transform: 'scale(1.1)', cursor: 'pointer', margin: 0 }}
                />
                <label htmlFor={key} style={{ margin: 0, whiteSpace: 'nowrap' }}>
                  {label}
                </label>
              </div>
            ) : type === 'textarea' ? (
              <div className="form-group" style={{ flex: '1 1 45%' }}>
                <label htmlFor={key}>{label}</label>
                <textarea
                  id={key}
                  name={key}
                  value={String(formCustomer[key as keyof Customer] || '')}
                  onChange={(e) => validateAndSetCustomer(key as keyof Customer, e.target.value)}
                  placeholder={placeholder}
                  rows={4}
                />
              </div>
            ) : (
              <div className="form-group" style={{ flex: '1 1 45%' }}>
                <label htmlFor={key}>{label}</label>
                <input
                  id={key}
                  type={type}
                  value={String(formCustomer[key as keyof Customer] || '')}
                  onChange={(e) => validateAndSetCustomer(key as keyof Customer, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            )}
            {errors[key] && (
              <span className="error" style={{ color: 'red' }}>
                {errors[key]}
              </span>
            )}
          </div>
        ))}

        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label htmlFor="shipBrokAggmt">Shipper Broker Agreement</label>
          <input type="file" onChange={(e) => handleFileChange(e, 'cust_sbk_agreement')} />
          {typeof formCustomer.cust_sbk_agreement === 'string' && formCustomer.cust_sbk_agreement && (
            <div>
              <a href={formCustomer.cust_sbk_agreement} target="_blank" rel="noopener noreferrer">
                Download Shipper Broker Agreement
              </a>
            </div>
          )}
          {uploading && <p>Uploading...</p>}
        </div>

        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label htmlFor="credAggmt">Credit Agreement</label>
          <input type="file" onChange={(e) => handleFileChange(e, 'cust_credit_agreement')} />
          {typeof formCustomer.cust_credit_agreement === 'string' && formCustomer.cust_credit_agreement && (
            <div>
              <a href={formCustomer.cust_credit_agreement} target="_blank" rel="noopener noreferrer">
                Download Credit Agreement
              </a>
            </div>
          )}
          {uploading && <p>Uploading...</p>}
        </div>
      </div>
    </fieldset>
  );
}

export default CustomerCredit;
