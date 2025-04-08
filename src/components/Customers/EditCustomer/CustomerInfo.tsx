import { useState, useEffect } from 'react';
import { z } from 'zod';
import axios from 'axios';
import { Customer } from '../../../styles/types/CustomerTypes';

interface CustomerInfoProps {
  formCustomer: Customer;
  setFormCustomer: React.Dispatch<React.SetStateAction<Customer>>;
}
const customerTypeOptions = ['Manufacturer', 'Trader', 'Distributor', 'Retailer', 'Freight Forwarder'];

const formCustomerSchema = z.object({
  cust_name: z
    .string()
    .min(1, 'Customer is required')
    .max(200, 'Customer name cannot exceed 200 characters')
    .regex(/^[a-zA-Z0-9\s.,'"-]+$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed'),
  cust_ref_no: z
    .string()
    .min(1, 'Customer Ref. No is required')
    .max(100, 'Customer Ref. No cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'"-]+$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed'),
  cust_type: z
    .enum(customerTypeOptions as [string, ...string[]], {
      errorMap: () => ({ message: 'Invalid customer type' }),
    }),
  cust_website: z
    .string()
    .max(150, 'Branch cannot exceed 150 characters')
    .regex(/^[a-zA-Z0-9\s.,'"-]*$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  cust_email: z.string().max(255, 'Email cannot exceed 255 characters').email('Invalid email format').optional(),
  cust_contact_no: z
    .string()
    .max(30, 'Contact no cannot exceed 30 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid phone format')
    .optional(),
  cust_contact_no_ext: z
    .string()
    .max(10, 'Phone Ext cannot exceed 10 characters')
    .regex(/^[a-zA-Z0-9-]*$/, 'Only letters, numbers, and hyphens allowed')
    .optional(),
  cust_tax_id: z
    .string()
    .max(20, 'Tax ID cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_/.-]*$/, 'Only letters, numbers, dashes, underscores, slashes, and spaces allowed')
    .optional(),
});

const fields = [
  { key: 'cust_website', label: 'Website', placeholder: 'Enter website', type: 'text' },
  { key: 'cust_email', label: 'Email', placeholder: 'Enter email', type: 'text' },
  { key: 'cust_contact_no', label: 'Contact no', placeholder: 'Enter contact no', type: 'text' },
  { key: 'cust_contact_no_ext', label: 'Extension', placeholder: 'Enter contact extension', type: 'text' },
  { key: 'cust_tax_id', label: 'Tax id', placeholder: 'Enter tax id', type: 'text' },
];

const CustomerInfo: React.FC<CustomerInfoProps> = ({ formCustomer, setFormCustomer }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customers, setCustomers] = useState<{ value: string; label: string; refNo: string }[]>([]);
  const [customerRefNos, setCustomerRefNos] = useState<{ value: string; label: string }[]>([]);

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
    if (formCustomer.cust_name) {
      const selectedCustomer = customers.find((c) => c.value === formCustomer.cust_name);
      setCustomerRefNos(selectedCustomer ? [{ value: selectedCustomer.refNo, label: selectedCustomer.refNo }] : []);
    } else {
      setCustomerRefNos([]);
    }
  }, [formCustomer.cust_name, customers]);

  const validateAndSetCustomer = (field: keyof Customer, value: string | boolean) => {
    let sanitizedValue = value;

    let error = '';
    const tempCustomer = { ...formCustomer, [field]: sanitizedValue };
    const result = formCustomerSchema.safeParse(tempCustomer);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormCustomer(tempCustomer);
  };

  return (
    <fieldset className="form-section">
      <legend>Customer Information</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label htmlFor="customer">
            Customer <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            id="quote_customer"
            value={formCustomer.cust_name || ''}
            onChange={(e) => validateAndSetCustomer('cust_name', e.target.value)}
            onBlur={() => validateAndSetCustomer('cust_name', formCustomer.cust_name || '')}
            required
          >
            <option value="" disabled>
              Select a customer
            </option>
            {customers.length > 0 ? (
              customers.map((cust_name, index) => (
                <option key={`${cust_name.refNo}-${index}`} value={cust_name.value}>
                  {cust_name.label}
                </option>
              ))
            ) : (
              <option disabled>No customers found</option>
            )}
          </select>
          {errors.cust_name && (
            <span className="error" style={{ color: 'red' }}>
              {errors.cust_name}
            </span>
          )}
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="customerRefNo">
            Customer Ref. No <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            id="quote_customer_ref_no"
            value={formCustomer.cust_ref_no || ''}
            onChange={(e) => validateAndSetCustomer('cust_ref_no', e.target.value)}
            onBlur={() => validateAndSetCustomer('cust_ref_no', formCustomer.cust_ref_no || '')}
            required
          >
            <option value="" disabled>
              Select a reference number
            </option>
            {customerRefNos.map((cust_ref_no) => (
              <option key={cust_ref_no.value} value={cust_ref_no.value}>
                {cust_ref_no.label}
              </option>
            ))}
          </select>
          {errors.cust_ref_no && (
            <span className="error" style={{ color: 'red' }}>
              {errors.cust_ref_no}
            </span>
          )}
        </div>
        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label htmlFor="loadType">
            Customer Type <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            id="loadType"
            value={formCustomer.cust_type}
            onChange={(e) => setFormCustomer((prevOrder) => ({ ...prevOrder, cust_type: e.target.value }))}
          >
            <option value="" disabled>Select...</option>
            {customerTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.load_type && (
            <span className="error" style={{ color: 'red' }}>
              {errors.load_type}
            </span>
          )}
        </div>
        {fields.map(({ key, label, placeholder, type }) => (
          <div className="form-group" key={key} style={{ flex: '1 1 45%' }}>
            <label htmlFor={key}>{label}</label>
            <input
              type={type}
              id={key}
              placeholder={placeholder}
              value={String(formCustomer[key as keyof Customer] || '')}
              onChange={(e) => validateAndSetCustomer(key as keyof Customer, e.target.value)}
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

export default CustomerInfo;
