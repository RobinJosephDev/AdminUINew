import { useState, useEffect } from 'react';
import { Quote } from '../../../styles/types/QuoteTypes';
import { z } from 'zod';
import axios from 'axios';
import { Customer } from '../../../styles/types/CustomerTypes';

interface EditQuoteGeneralProps {
  formQuote: Quote;
  setFormQuote: React.Dispatch<React.SetStateAction<Quote>>;
}

const quoteSchema = z.object({
  load_type: z.enum(['FTL', 'LTL'], { message: 'Please select a valid load type' }),
  quote_booked_by: z
    .string()
    .max(100, 'Booked By cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'"-]*$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  quote_temperature: z
    .union([
      z
        .string()
        .max(10, 'Temperature cannot exceed 10 characters')
        .regex(/^-?\d+(\.\d+)?\s?[°CFK]?$/, 'Enter a valid temperature (e.g., 5°C, -10F, 273K)'),
      z.number(),
    ])
    .optional(),
  quote_customer: z
    .string()
    .min(1, 'Customer is required')
    .max(200, 'Customer name cannot exceed 200 characters')
    .regex(/^[a-zA-Z0-9\s.,'"-]+$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed'),
  quote_cust_ref_no: z
    .string()
    .min(1, 'Customer Ref. No is required')
    .max(100, 'Customer Ref. No cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'"-]+$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed'),
  quote_hot: z.boolean().optional(),
  quote_team: z.boolean().optional(),
  quote_air_ride: z.boolean().optional(),
  quote_tarp: z.boolean().optional(),
  quote_hazmat: z.boolean().optional(),
});

const fields = [
  { key: 'quote_booked_by', label: 'Booked By', placeholder: 'Enter Person Who Booked', type: 'text' },
  { key: 'quote_temperature', label: 'Temperature', placeholder: 'Enter Required Temperature', type: 'text' },
  { key: 'quote_hot', label: 'Hot', type: 'boolean' },
  { key: 'quote_team', label: 'Team', type: 'boolean' },
  { key: 'quote_air_ride', label: 'Air Ride', type: 'boolean' },
  { key: 'quote_tarp', label: 'TARP', type: 'boolean' },
  { key: 'quote_hazmat', label: 'Hazmat', type: 'boolean' },
];

const EditQuoteGeneral: React.FC<EditQuoteGeneralProps> = ({ formQuote, setFormQuote }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customers, setCustomers] = useState<{ value: string; label: string; refNo: string }[]>([]);
  const [customerRefNos, setCustomerRefNos] = useState<{ value: string; label: string }[]>([]);
  const loadTypeOptions = ['FTL', 'LTL'];
  const API_URL = process.env.API_BASE_URL;
  
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<Customer[]>(`${API_URL}/customer`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response || !response.data) {
          console.error('API response is undefined or invalid:', response);
          return;
        }

        console.log('Fetched customers:', response.data);

        const formattedCustomers = response.data.map((customer) => ({
          value: customer.cust_name,
          label: customer.cust_name,
          refNo: customer.cust_ref_no,
        }));

        setCustomers(formattedCustomers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    if (formQuote.quote_customer) {
      const selectedCustomer = customers.find((c) => c.value === formQuote.quote_customer);
      setCustomerRefNos(selectedCustomer ? [{ value: selectedCustomer.refNo, label: selectedCustomer.refNo }] : []);
    } else {
      setCustomerRefNos([]);
    }
  }, [formQuote.quote_customer, customers]);

  const validateAndSetQuote = (field: keyof Quote, value: string | boolean) => {
    let sanitizedValue = value;

    let error = '';
    const tempQuote = { ...formQuote, [field]: sanitizedValue };
    const result = quoteSchema.safeParse(tempQuote);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormQuote(tempQuote);
  };

  return (
    <fieldset className="form-section">
      <legend>General</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label htmlFor="equipment">
            Load Type <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            id="equipment"
            value={formQuote.quote_type}
            onChange={(e) => setFormQuote((prevQuote) => ({ ...prevQuote, quote_type: e.target.value }))}
          >
            <option value="" disabled>Select...</option>
            {loadTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.quote_type && (
            <span className="error" style={{ color: 'red' }}>
              {errors.quote_type}
            </span>
          )}
        </div>
        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label htmlFor="customer">
            Customer <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            id="quote_customer"
            value={formQuote.quote_customer || ''}
            onChange={(e) => validateAndSetQuote('quote_customer', e.target.value)}
            onBlur={() => validateAndSetQuote('quote_customer', formQuote.quote_customer || '')}
          >
            <option value="" disabled>
              Select a customer
            </option>
            {customers.length > 0 ? (
              customers.map((customer, index) => (
                <option key={`${customer.refNo}-${index}`} value={customer.value}>
                  {customer.label}
                </option>
              ))
            ) : (
              <option disabled>No customers found</option>
            )}
          </select>
          {errors.customer && (
            <span className="error" style={{ color: 'red' }}>
              {errors.customer}
            </span>
          )}
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="customerRefNo">
            Customer Ref. No <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            id="quote_customer_ref_no"
            value={formQuote.quote_cust_ref_no || ''}
            onChange={(e) => validateAndSetQuote('quote_cust_ref_no', e.target.value)}
            onBlur={() => validateAndSetQuote('quote_cust_ref_no', formQuote.quote_cust_ref_no || '')}
          >
            <option value="" disabled>
              Select a reference number
            </option>
            {customerRefNos.map((customer_ref_no) => (
              <option key={customer_ref_no.value} value={customer_ref_no.value}>
                {customer_ref_no.label}
              </option>
            ))}
          </select>
          {errors.customer_ref_no && (
            <span className="error" style={{ color: 'red' }}>
              {errors.customer_ref_no}
            </span>
          )}
        </div>

        {fields.map(({ key, label, placeholder, type }) => (
          <div key={key}>
            <div className="form-group" style={{ flex: '1 1 45%' }} key={key}>
              {type === 'boolean' ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id={key}
                    checked={!!formQuote[key as keyof Quote]}
                    onChange={(e) => validateAndSetQuote(key as keyof Quote, e.target.checked)}
                    style={{ transform: 'scale(1.1)', cursor: 'pointer', margin: 0 }}
                  />
                  <label htmlFor={key} style={{ margin: 0, whiteSpace: 'nowrap' }}>
                    {label}
                  </label>
                </div>
              ) : (
                <div className="form-group" style={{ flex: '1 1 45%' }}>
                  <label htmlFor={key}>{label}</label>{' '}
                  <input
                    type="text"
                    id={key}
                    placeholder={placeholder}
                    value={String(formQuote[key as keyof Quote] || '')}
                    onChange={(e) => validateAndSetQuote(key as keyof Quote, e.target.value)}
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
      </div>
    </fieldset>
  );
};

export default EditQuoteGeneral;
