import LeadContactForm from '../LeadContactForm';
import EditLeadDetails from './EditLeadDetails';
import EditAddressDetails from './EditAddressDetails';
import EditAdditionalInfo from './EditAdditionalInfo';
import { PlusOutlined } from '@ant-design/icons';
import { Lead, Contact } from '../../../styles/types/LeadTypes';
import useEditLead from '../../../hooks/edit/useEditLead';

interface EditLeadFormProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdate: (lead: Lead) => void;
}

const EditLeadForm: React.FC<EditLeadFormProps> = ({ lead, onClose, onUpdate }) => {
  const { formLead, setFormLead, updateLead, handleAddContact, handleRemoveContact, handleContactChange } = useEditLead(lead, onClose, onUpdate);

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateLead();
        }}
        className="form-main"
      >
        <EditLeadDetails formLead={formLead} setFormLead={setFormLead} />
        <EditAddressDetails formLead={formLead} setFormLead={setFormLead} />
        <EditAdditionalInfo formLead={formLead} setFormLead={setFormLead} />

        <fieldset className="form-section">
          <legend>Contacts</legend>
          <hr />
          <div className="form-row">
            {formLead.contacts.map((contact, index) => (
              <LeadContactForm
                key={index}
                contacts={formLead.contacts}
                index={index}
                onAddContact={handleAddContact}
                handleContactChange={handleContactChange}
                handleRemoveContact={handleRemoveContact}
              />
            ))}
            {formLead.contacts.length === 0 && (
              <button type="button" onClick={handleAddContact} className="add-button">
                <PlusOutlined />
              </button>
            )}
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Save
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLeadForm;
