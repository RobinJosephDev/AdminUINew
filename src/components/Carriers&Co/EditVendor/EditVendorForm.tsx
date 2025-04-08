import { PlusOutlined } from '@ant-design/icons';
import VendorContact from '../VendorContact';
import EditVendorType from './EditVendorType';
import EditVendorDetails from './EditVendorDetails';
import EditVendorPrimaryAddress from './EditVendorPrimaryAddress';
import EditVendorMailingAddress from './EditVendorMailingAddress';
import EditVendorAdditional from './EditVendorAdditional';
import EditVendorAR from './EditVendorAR';
import EditVendorAP from './EditVendorAP';
import EditVendorBanking from './EditVendorBanking';
import EditVendorCargoInsurance from './EditVendorCargoInsurance';
import EditVendorLiabilityInsurance from './EditVendorLiabilityInsurance';
import useEditVendor from '../../../hooks/edit/useEditVendor';
import { Vendor } from '../../../styles/types/VendorTypes';

interface EditVendorFormProps {
  vendor: Vendor | null;
  onClose: () => void;
  onUpdate: (vendor: Vendor) => void;
}

const EditVendorForm: React.FC<EditVendorFormProps> = ({ vendor, onClose, onUpdate }) => {
  const { formVendor, setFormVendor, updateVendor, handleAddContact, handleRemoveContact, handleContactChange } = useEditVendor(
    vendor,
    onClose,
    onUpdate
  );

  console.log('Form vendor:', formVendor);

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateVendor();
        }}
        className="form-main"
      >
        {formVendor && (
          <>
            <EditVendorType formVendor={formVendor} setFormVendor={setFormVendor} />
            <EditVendorDetails formVendor={formVendor} setFormVendor={setFormVendor} />
            <EditVendorPrimaryAddress formVendor={formVendor} setFormVendor={setFormVendor} />
            <EditVendorMailingAddress formVendor={formVendor} setFormVendor={setFormVendor} />
            <EditVendorAdditional formVendor={formVendor} setFormVendor={setFormVendor} />
            <EditVendorAR formVendor={formVendor} setFormVendor={setFormVendor} />
            <EditVendorAP formVendor={formVendor} setFormVendor={setFormVendor} />
            <EditVendorBanking formVendor={formVendor} setFormVendor={setFormVendor} />
            <EditVendorCargoInsurance formVendor={formVendor} setFormVendor={setFormVendor} />
            <EditVendorLiabilityInsurance formVendor={formVendor} setFormVendor={setFormVendor} />

            {/* Contacts Section */}
            <fieldset className="form-section">
              <legend>Contacts</legend>
              <hr />
              <div className="form-row">
                {formVendor.contacts?.map((contact, index) => (
                  <VendorContact
                    key={index}
                    contacts={formVendor.contacts}
                    index={index}
                    onAddContact={handleAddContact}
                    handleRemoveContact={handleRemoveContact}
                    handleContactChange={handleContactChange}
                  />
                ))}
              </div>
              {formVendor.contacts.length === 0 && (
                <button type="button" onClick={handleAddContact} className="add-button">
                  <PlusOutlined />
                </button>
              )}
            </fieldset>
          </>
        )}

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

export default EditVendorForm;
