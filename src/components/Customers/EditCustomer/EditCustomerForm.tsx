import CustomerInfo from './CustomerInfo';
import PrimaryAddress from './PrimaryAddress';
import MailingAddress from './MailingAddress';
import AccountsPayable from './AccountsPayable';
import CustomBroker from './CustomBroker';
import CustomerCredit from './CustomerCredit';
import CustomerContact from '../CustomerContact';
import CustomerEquipment from '../CustomerEquipment';
import { PlusOutlined } from '@ant-design/icons';
import useEditCustomer from '../../../hooks/edit/useEditCustomer';
import { Customer } from '../../../styles/types/CustomerTypes';

interface EditCustomerFormProps {
  customer: Customer | null;
  onClose: () => void;
  onUpdate: (customer: Customer) => void;
}

const EditCustomerForm: React.FC<EditCustomerFormProps> = ({ customer, onClose, onUpdate }) => {
  const {
    formCustomer,
    setFormCustomer,
    updateCustomer,
    handleAddContact,
    handleContactChange,
    handleAddEquipment,
    handleEquipmentChange,
    handleRemoveContact,
    handleRemoveEquipment,
  } = useEditCustomer(customer, onClose, onUpdate);

  console.log('Form customer:', formCustomer);

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateCustomer();
        }}
        className="form-main"
      >
        <CustomerInfo formCustomer={formCustomer} setFormCustomer={setFormCustomer} />
        <PrimaryAddress formCustomer={formCustomer} setFormCustomer={setFormCustomer} />
        <MailingAddress formCustomer={formCustomer} setFormCustomer={setFormCustomer} />
        <AccountsPayable formCustomer={formCustomer} setFormCustomer={setFormCustomer} />
        <CustomBroker formCustomer={formCustomer} setFormCustomer={setFormCustomer} />
        <CustomerCredit formCustomer={formCustomer} setFormCustomer={setFormCustomer} />

        <fieldset className="form-section">
          <legend>Contacts</legend>
          <hr />
          <div className="form-row">
            {formCustomer.cust_contact.map((contact, index) => (
              <CustomerContact
                key={index}
                contacts={formCustomer.cust_contact}
                index={index}
                onAddContact={handleAddContact}
                handleRemoveContact={handleRemoveContact}
                handleContactChange={handleContactChange}
              />
            ))}
            {formCustomer.cust_contact.length === 0 && (
              <button type="button" onClick={handleAddContact} className="add-button">
                <PlusOutlined />
              </button>
            )}
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>Equipments</legend>
          <hr />
          <div className="form-row">
            {formCustomer.cust_equipment.map((equipment, index) => (
              <CustomerEquipment
                key={index}
                equipments={formCustomer.cust_equipment}
                index={index}
                onAddEquipment={handleAddEquipment}
                handleEquipmentChange={handleEquipmentChange}
                handleRemoveEquipment={handleRemoveEquipment}
              />
            ))}
            {formCustomer.cust_equipment.length === 0 && (
              <button type="button" onClick={handleAddEquipment} className="add-button">
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

export default EditCustomerForm;
