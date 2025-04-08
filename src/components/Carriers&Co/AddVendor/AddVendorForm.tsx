import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import '../../../styles/Form.css';
import VendorDetails from './VendorDetails';
import VendorPrimaryAddress from './VendorPrimaryAddress';
import VendorMailingAddress from './VendorMailingAddress';
import VendorCargoInsurance from './VendorCargoInsurance';
import VendorLiabilityInsurance from './VendorLiabilityInsurance';
import VendorAdditional from './VendorAdditional';
import VendorAR from './VendorAR';
import VendorAP from './VendorAP';
import VendorBanking from './VendorBanking';
import VendorContact from '../VendorContact';
import VendorType from './VendorType';
import { useAddVendor } from '../../../hooks/add/useAddVendor';

interface AddVendorFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddVendorForm: React.FC<AddVendorFormProps> = ({ onClose, onSuccess }) => {
  const { vendor, setVendor, handleAddContact, handleRemoveContact, handleContactChange, handleSubmit } = useAddVendor(onClose, onSuccess);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-main">
        <VendorType vendor={vendor} setVendor={setVendor} />
        <VendorDetails vendor={vendor} setVendor={setVendor} />
        <VendorPrimaryAddress vendor={vendor} setVendor={setVendor} />
        <VendorMailingAddress vendor={vendor} setVendor={setVendor} />
        <VendorAdditional vendor={vendor} setVendor={setVendor} />
        <VendorAR vendor={vendor} setVendor={setVendor} />
        <VendorAP vendor={vendor} setVendor={setVendor} />
        <VendorBanking vendor={vendor} setVendor={setVendor} />
        <VendorCargoInsurance vendor={vendor} setVendor={setVendor} />
        <VendorLiabilityInsurance vendor={vendor} setVendor={setVendor} />

        {/* Contacts Section */}
        <fieldset className="form-section">
          <legend>Contacts</legend>
          <hr />
          <div className="form-row">
            {vendor.contacts.map((contact, index) => (
              <VendorContact
                key={index}
                contacts={vendor.contacts}
                index={index}
                onAddContact={handleAddContact}
                handleContactChange={handleContactChange}
                handleRemoveContact={handleRemoveContact}
              />
            ))}
          </div>
          {vendor.contacts.length === 0 && (
            <button type="button" onClick={handleAddContact} className="add-button">
              <PlusOutlined />
            </button>
          )}
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Create Vendor
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVendorForm;
