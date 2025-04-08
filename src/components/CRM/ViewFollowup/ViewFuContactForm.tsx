import React from 'react';
import { Contact } from '../../../styles/types/FollowupTypes';

interface ViewFuContactFormProps {
  contact: Contact;
}

const ViewFuContactForm: React.FC<ViewFuContactFormProps> = ({ contact }) => {
  return (
    <div className="contact-form">
      <div className="form-group">
        <label>Name</label>
        <div>{contact.name || 'N/A'}</div>
      </div>
      <div className="form-group">
        <label>Phone</label>
        <div>{contact.phone || 'N/A'}</div>
      </div>
      <div className="form-group">
        <label>Email</label>
        <div>{contact.email || 'N/A'}</div>
      </div>
    </div>
  );
};

export default ViewFuContactForm;
