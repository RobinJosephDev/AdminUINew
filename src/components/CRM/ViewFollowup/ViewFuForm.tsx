import { useState, useEffect } from 'react';
import ViewFuInfo from './ViewFuInfo';
import ViewFuAddress from './ViewFuAddress';
import ViewFuLeadType from './ViewFuLeadType';
import ViewFuAddInfo from './ViewFuAddInfo';
import ViewFuDetail from './ViewFuDetail';
import ViewFuContactForm from './ViewFuContactForm';
import ViewFuProductForm from './ViewFuProductForm';
import { Followup, Contact, Product, Customer } from '../../../styles/types/FollowupTypes';

interface ViewFuFormProps {
  followUp?: Followup;
  onClose: () => void;
}

const ViewFuForm: React.FC<ViewFuFormProps> = ({ followUp, onClose }) => {
  const [followupEdit, setFollowupEdit] = useState<Followup>({
    id: 0,
    lead_no: '',
    lead_date: '',
    customer_name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    unit_no: '',
    lead_type: '',
    contact_person: '',
    notes: '',
    next_follow_up_date: '',
    followup_type: '',
    products: [],
    lead_status: '',
    remarks: '',
    equipment: '',
    contacts: [],
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (followUp) {
      const parsedContacts: Contact[] = Array.isArray(followUp.contacts) ? followUp.contacts : JSON.parse(followUp.contacts || '[]');

      const parsedProducts: Product[] = Array.isArray(followUp.products) ? followUp.products : JSON.parse(followUp.products || '[]');

      setFollowupEdit({
        ...followUp,
        contacts: parsedContacts.length > 0 ? parsedContacts : [],
        products: parsedProducts.length > 0 ? parsedProducts : [],
      });
    }
  }, [followUp]);

  return (
    <div className="form-container">
      <form className="form-main">
        <ViewFuInfo followupEdit={followupEdit} />
        <ViewFuAddress followupEdit={followupEdit} />
        <ViewFuLeadType followupEdit={followupEdit} />
        <ViewFuDetail followupEdit={followupEdit} />
        <ViewFuAddInfo followupEdit={followupEdit} />

        <fieldset className="form-section">
          <legend>Contacts</legend>
          <hr />
          {followupEdit.contacts.map((contact, index) => (
            <ViewFuContactForm key={index} contact={contact} />
          ))}
        </fieldset>

        <fieldset className="form-section">
          <legend>Products</legend>
          <hr />
          {followupEdit.products?.map((product, index) => (
            <ViewFuProductForm key={index} product={product} />
          ))}
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

export default ViewFuForm;
