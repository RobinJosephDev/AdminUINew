import { useState, useEffect } from 'react';
import { Order } from '../../../styles/types/OrderTypes';
import { z } from 'zod';
import axios from 'axios';
import { Customer } from '../../../styles/types/CustomerTypes';

interface OrderGeneralProps {
  order: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
}

const orderSchema = z.object({
  branch: z
    .string()
    .max(150, 'Branch cannot exceed 150 characters')
    .regex(/^[a-zA-Z0-9\s.,'"-]*$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  booked_by: z
    .string()
    .max(100, 'Booked By cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'"-]*$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  account_rep: z
    .string()
    .max(100, 'Account Rep cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'"-]*$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  sales_rep: z
    .string()
    .max(100, 'Sales Rep cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'"-]*$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  customer_po_no: z
    .string()
    .max(20, 'Customer PO Number cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9-_\/]*$/, 'Only letters, numbers, dashes, underscores, and slashes allowed')
    .optional(),
  customer: z
    .string()
    .min(1, 'Customer is required')
    .max(200, 'Customer name cannot exceed 200 characters')
    .regex(/^[a-zA-Z0-9\s.,'"-]+$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed'),
  customer_ref_no: z
    .string()
    .min(1, 'Customer Ref. No is required')
    .max(100, 'Customer Ref. No cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'"-]+$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed'),
});

const fields = [
  { key: 'branch', label: 'Branch', placeholder: 'Enter Branch Name', type: 'text' },
  { key: 'booked_by', label: 'Booked By', placeholder: 'Enter Person Who Booked', type: 'text' },
  { key: 'account_rep', label: 'Account Rep', placeholder: 'Enter Account Representative Name', type: 'text' },
  { key: 'sales_rep', label: 'Sales Rep', placeholder: 'Enter Sales Representative Name', type: 'text' },
  { key: 'customer_po_no', label: 'Customer PO Number', placeholder: 'Enter Purchase Order Number', type: 'text' },
];

const OrderGeneral: React.FC<OrderGeneralProps> = ({ order, setOrder }) => {
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
    if (order.customer) {
      const selectedCustomer = customers.find((c) => c.value === order.customer);
      setCustomerRefNos(selectedCustomer ? [{ value: selectedCustomer.refNo, label: selectedCustomer.refNo }] : []);
    } else {
      setCustomerRefNos([]);
    }
  }, [order.customer, customers]);

  const validateAndSetOrder = (field: keyof Order, value: string | boolean) => {
    let sanitizedValue = value;

    let error = '';
    const tempOrder = { ...order, [field]: sanitizedValue };
    const result = orderSchema.safeParse(tempOrder);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setOrder(tempOrder);
  };

  return (
    <fieldset className="form-section">
      <legend>General</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="form-group" style={{ flex: '1 1 45%' }}>
          <label htmlFor="customer">
            Customer <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            id="quote_customer"
            value={order.customer || ''}
            onChange={(e) => validateAndSetOrder('customer', e.target.value)}
            onBlur={() => validateAndSetOrder('customer', order.customer || '')}
            
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
            value={order.customer_ref_no || ''}
            onChange={(e) => validateAndSetOrder('customer_ref_no', e.target.value)}
            onBlur={() => validateAndSetOrder('customer_ref_no', order.customer_ref_no || '')} 
            
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
        {fields.map(({ key, label, placeholder }) => (
          <div className="form-group" key={key} style={{ flex: '1 1 45%' }}>
            <label htmlFor={key}>{label}</label>
            <input
              type="text"
              id={key}
              placeholder={placeholder}
              value={String(order[key as keyof Order] || '')}
              onChange={(e) => validateAndSetOrder(key as keyof Order, e.target.value)}
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

export default OrderGeneral;
