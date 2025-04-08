import { PlusOutlined } from '@ant-design/icons';
import '../../../styles/Form.css';
import General from './General';
import CarrierDetails from './CarrierDetails';
import LiabilityInsurance from './LiabilityInsurance';
import CargoInsurance from './CargoInsurance';
import PrimaryAddress from './PrimaryAddress';
import MailingAddress from './MailingAddress';
import InternalNotes from './InternalNotes';
import CarrierContact from '../CarrierContact';
import CarrierEquipment from '../CarrierEquipment';
import CarrierLane from '../CarrierLane';
import { useAddCarrier } from '../../../hooks/add/useAddCarrier';

interface AddCarrierFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddCarrierForm: React.FC<AddCarrierFormProps> = ({ onClose, onSuccess }) => {
  const {
    carrier,
    setCarrier,
    handleSubmit,
    handleAddContact,
    handleAddEquipment,
    handleAddLane,
    handleContactChange,
    handleRemoveContact,
    handleEquipmentChange,
    handleRemoveEquipment,
    handleLaneChange,
    handleRemoveLane,
  } = useAddCarrier(onClose, onSuccess);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} data-testid="carrier-form" encType="multipart/form-data">
        <General carrier={carrier} setCarrier={setCarrier} />
        <CarrierDetails carrier={carrier} setCarrier={setCarrier} />
        <LiabilityInsurance carrier={carrier} setCarrier={setCarrier} />
        <CargoInsurance carrier={carrier} setCarrier={setCarrier} />
        <PrimaryAddress carrier={carrier} setCarrier={setCarrier} />
        <MailingAddress carrier={carrier} setCarrier={setCarrier} />
        <InternalNotes carrier={carrier} setCarrier={setCarrier} />

        <fieldset className="form-section">
          <legend>Contacts</legend>
          <hr />
          <div className="form-row">
            {carrier.contacts.map((contact, index) => (
              <CarrierContact
                key={index}
                contacts={carrier.contacts}
                index={index}
                onAddContact={handleAddContact}
                handleContactChange={handleContactChange}
                handleRemoveContact={handleRemoveContact}
              />
            ))}
          </div>
          {carrier.contacts.length === 0 && (
            <button type="button" onClick={handleAddContact} className="add-button">
              <PlusOutlined />
            </button>
          )}
        </fieldset>

        <fieldset className="form-section">
          <legend>Equipment</legend>
          <hr />
          <div className="form-row">
            {carrier.equipments.map((equipment, index) => (
              <CarrierEquipment
                key={index}
                equipments={carrier.equipments}
                index={index}
                onAddEquipment={handleAddEquipment}
                handleEquipmentChange={handleEquipmentChange}
                handleRemoveEquipment={handleRemoveEquipment}
              />
            ))}
          </div>
          {carrier.equipments.length === 0 && (
            <button type="button" onClick={handleAddEquipment} className="add-button">
              <PlusOutlined />
            </button>
          )}
        </fieldset>

        <fieldset className="form-section">
          <legend>Lanes</legend>
          <hr />
          <div className="form-row">
            {carrier.lanes.map((lane, index) => (
              <CarrierLane
                key={index}
                lanes={carrier.lanes}
                index={index}
                onAddLane={handleAddLane}
                handleLaneChange={handleLaneChange}
                handleRemoveLane={handleRemoveLane}
              />
            ))}
          </div>
          {carrier.lanes.length === 0 && (
            <button type="button" onClick={handleAddLane} className="add-button">
              <PlusOutlined />
            </button>
          )}
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="btn-submit" data-testid="submit-button">
            Add Carrier
          </button>

          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCarrierForm;
