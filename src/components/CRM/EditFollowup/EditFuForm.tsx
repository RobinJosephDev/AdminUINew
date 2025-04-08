import EditFuAddress from './EditFuAddress';
import EditFuAddInfo from './EditFuAddInfo';
import { PlusOutlined } from '@ant-design/icons';
import FuContactForm from '../FuContactForm';
import FuProductForm from '../FuProductForm';
import { Followup } from '../../../styles/types/FollowupTypes';
import useEditFollowup from '../../../hooks/edit/useEditFollowup';
import EditLeadInfo from './EditLeadInfo';

interface EditFuFormProps {
  followup: Followup | null;
  onClose: () => void;
  onUpdate: (updatedFollowUp: Followup) => void;
}

const EditFuForm: React.FC<EditFuFormProps> = ({ followup, onClose, onUpdate }) => {
  const {
    followupEdit,
    setFollowupEdit,
    handleAddContact,
    handleAddProduct,
    handleContactChange,
    handleRemoveContact,
    handleProductChange,
    handleRemoveProduct,
    updateFollowup,
  } = useEditFollowup(followup, onClose, onUpdate);

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateFollowup();
        }}
        className="form-main"
      >
        <EditLeadInfo followupEdit={followupEdit} setFollowupEdit={setFollowupEdit} />
        <EditFuAddress followupEdit={followupEdit} setFollowupEdit={setFollowupEdit} />
        <EditFuAddInfo followupEdit={followupEdit} setFollowupEdit={setFollowupEdit} />
        <fieldset className="form-section">
          <legend>Contacts</legend>
          <hr />
          <div className="form-row">
            {followupEdit.contacts.map((contact, index) => (
              <FuContactForm
                key={index}
                contacts={followupEdit.contacts}
                index={index}
                onAddContact={handleAddContact}
                handleContactChange={handleContactChange}
                handleRemoveContact={handleRemoveContact}
              />
            ))}
          </div>
          {followupEdit.contacts.length === 0 && (
            <button type="button" onClick={handleAddContact} className="add-button">
              <PlusOutlined />
            </button>
          )}
        </fieldset>
        <fieldset className="form-section">
          <legend>Products</legend>
          <hr />
          <div className="form-row">
            {followupEdit.products.map((product, index) => (
              <FuProductForm
                key={index}
                products={followupEdit.products}
                index={index}
                onAddProduct={handleAddProduct}
                handleProductChange={handleProductChange}
                handleRemoveProduct={handleRemoveProduct}
              />
            ))}
          </div>
          {followupEdit.products.length === 0 && (
            <button type="button" onClick={handleAddProduct} className="add-button">
              <PlusOutlined />
            </button>
          )}
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

export default EditFuForm;
