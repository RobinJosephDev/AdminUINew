import { useEffect, useState } from 'react';
import axios from 'axios';

interface Customer {
  value: string;
  label: string;
  refNo: string;
}

interface FormOrder {
  customer?: string;
  customer_ref_no?: string;
  branch?: string;
  booked_by?: string;
  account_rep?: string;
  sales_rep?: string;
  customer_po_no?: string;
}

interface ViewOrderGeneralProps {
  formOrder: FormOrder;
}

const ViewOrderGeneral: React.FC<ViewOrderGeneralProps> = ({ formOrder }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerRefNos, setCustomerRefNos] = useState<{ value: string; label: string }[]>([]);
  const API_URL = process.env.API_BASE_URL;
  
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const { data } = await axios.get<Customer[]>(`${API_URL}/customer`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Fetched customers:', data);

        const formattedCustomers = data.map((customer) => ({
          value: customer.value,
          label: customer.label,
          refNo: customer.refNo,
        }));

        setCustomers(formattedCustomers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    if (formOrder.customer) {
      const selectedCustomer = customers.find((c) => c.value === formOrder.customer);
      setCustomerRefNos(selectedCustomer ? [{ value: selectedCustomer.refNo, label: selectedCustomer.refNo }] : []);
    } else {
      setCustomerRefNos([]);
    }
  }, [formOrder.customer, customers]);

  return (
    <fieldset className="form-section">
      <legend>General</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="customer">Customer</label>
          <div>{formOrder.customer}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="customerRefNo">Customer Ref. No</label>
          <div>{formOrder.customer_ref_no}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="remitName">Branch</label>
          <div>{formOrder.branch}</div>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="accNo">Booked By</label>
          <div>{formOrder.booked_by}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="branch">Account Rep</label>
          <div>{formOrder.account_rep}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="website">Sales Rep</label>
          <div>{formOrder.sales_rep}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="fedIdNo">Customer PO Number</label>
          <div>{formOrder.customer_po_no}</div>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewOrderGeneral;