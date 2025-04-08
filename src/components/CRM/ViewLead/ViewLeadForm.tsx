import { useState, useEffect } from 'react';
import '../../../styles/Form.css';
import ViewLeadDetails from './ViewLeadDetails';
import ViewAddressDetails from './ViewAddressDetails';
import ViewAdditionalInfo from './ViewAdditionalInfo';
import ViewLeadContactForm from './ViewLeadContactForm';
import { Lead, Contact } from '../../../styles/types/LeadTypes';

interface ViewLeadFormProps {
  lead: Lead | null;
  onClose: () => void;
}

const ViewLeadForm: React.FC<ViewLeadFormProps> = ({ lead, onClose }) => {
  const [formLead, setFormLead] = useState<Lead>({
    id: 0,
    lead_no: '',
    lead_date: '',
    customer_name: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    unit_no: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    equipment_type: '',
    lead_type: '',
    lead_status: '',
    contact_person: '',
    notes: '',
    follow_up_date: '',
    assigned_to: '',
    contacts: [],
  });

  useEffect(() => {
    if (lead) {
      let parsedContacts: Contact[] = [];

      if (Array.isArray(lead.contacts)) {
        parsedContacts = lead.contacts;
      } else if (typeof lead.contacts === 'string') {
        try {
          parsedContacts = JSON.parse(lead.contacts) || [];
        } catch (error) {
          parsedContacts = [];
        }
      }

      setFormLead({
        ...lead,
        contacts: parsedContacts.length > 0 ? parsedContacts : [],
      });
    }
  }, [lead]);

  return (
    <div className="form-container">
      <form className="form-main">
        <ViewLeadDetails formLead={formLead} />
        <ViewAddressDetails formLead={formLead} />
        <ViewAdditionalInfo formLead={formLead} />
        <fieldset className="form-section">
          <legend>Contacts</legend>
          <hr />
          <div className="form-row">
            {formLead.contacts && formLead.contacts.map((contact, index) => <ViewLeadContactForm key={index} contact={contact} index={index} />)}
          </div>
        </fieldset>
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose} style={{ padding: '9px 15px' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewLeadForm;
