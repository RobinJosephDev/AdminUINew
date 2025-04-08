import { useState, useEffect } from 'react';
import axios from 'axios';

interface FollowUpEdit {
  lead_no?: string;
  lead_date?: string;
  customer_name?: string;
  phone?: string;
  email?: string;
}

interface Customer {
  value: string;
  label: string;
}

interface ViewFuInfoProps {
  followupEdit: FollowUpEdit;
}

const ViewFuInfo: React.FC<ViewFuInfoProps> = ({ followupEdit }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const API_URL = process.env.API_BASE_URL;
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');

        const { data } = await axios.get<{ customer_name: string }[]>(`${API_URL}/lead`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Fetched leads:', data);
        const leads = Array.isArray(data) ? data : data;

        if (!Array.isArray(leads)) {
          console.error('Unexpected API response format:', data);
          return;
        }
        const formattedCustomers = leads.map((customer) => ({
          value: customer.customer_name,
          label: customer.customer_name,
        }));

        setCustomers(formattedCustomers);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <fieldset className="form-section">
      <legend>Follow-up Information</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Lead No</label>
          <div>{followupEdit.lead_no || 'N/A'}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Lead Date</label>
          <div>{followupEdit.lead_date || 'N/A'}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Lead</label>
          <div>{followupEdit.customer_name || 'N/A'}</div>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Phone</label>
          <div>{followupEdit.phone || 'N/A'}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Email</label>
          <div>{followupEdit.email || 'N/A'}</div>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewFuInfo;
