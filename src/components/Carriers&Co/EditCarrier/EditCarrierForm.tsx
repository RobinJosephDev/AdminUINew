import useEditCarrier from '../../../hooks/edit/useEditCarrier';
import EditGeneral from './EditGeneral';
import EditCarrierDetails from './EditCarrierDetails';
import EditLiabilityInsurance from './EditLiabilityInsurance';
import EditCargoInsurance from './EditCargoInsurance';
import EditPrimaryAddress from './EditPrimaryAddress';
import EditMailingAddress from './EditMailingAddress';
import { Carrier } from '../../../styles/types/CarrierTypes';
import EditInternalNotes from './EditInternalNotes';
import { PlusOutlined } from '@ant-design/icons';
import CarrierContact from '../CarrierContact';
import CarrierEquipment from '../CarrierEquipment';
import CarrierLane from '../CarrierLane';

interface EditCarrierFormProps {
  carrier: Carrier | null;
  onClose: () => void;
  onUpdate: (carrier: Carrier) => void;
}

const EditCarrierForm: React.FC<EditCarrierFormProps> = ({ carrier, onClose, onUpdate }) => {
  const {
    formCarrier,
    setFormCarrier,
    updateCarrier,
    handleAddContact,
    handleRemoveContact,
    handleContactChange,
    handleAddEquipment,
    handleRemoveEquipment,
    handleEquipmentChange,
    handleAddLane,
    handleRemoveLane,
    handleLaneChange,
  } = useEditCarrier(carrier, onClose, onUpdate);

  console.log('Form carrier:', formCarrier);

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateCarrier();
        }}
        className="form-main"
      >
        {formCarrier && (
          <>
            <EditGeneral formCarrier={formCarrier} setFormCarrier={setFormCarrier} />
            <EditCarrierDetails formCarrier={formCarrier} setFormCarrier={setFormCarrier} />
            <EditLiabilityInsurance formCarrier={formCarrier} setFormCarrier={setFormCarrier} />
            <EditCargoInsurance formCarrier={formCarrier} setFormCarrier={setFormCarrier} />
            <EditPrimaryAddress formCarrier={formCarrier} setFormCarrier={setFormCarrier} />
            <EditMailingAddress formCarrier={formCarrier} setFormCarrier={setFormCarrier} />
            <EditInternalNotes formCarrier={formCarrier} setFormCarrier={setFormCarrier} />

            {/* Contacts Section */}
            <fieldset className="form-section">
              <legend>Contacts</legend>
              <hr />
              <div className="form-row">
                {formCarrier.contacts.map((contact, index) => (
                  <CarrierContact
                    key={index}
                    contacts={formCarrier.contacts}
                    index={index}
                    onAddContact={handleAddContact}
                    handleRemoveContact={handleRemoveContact}
                    handleContactChange={handleContactChange}
                  />
                ))}
                {formCarrier.contacts.length === 0 && (
                  <button type="button" onClick={handleAddContact} className="add-button">
                    <PlusOutlined />
                  </button>
                )}
              </div>
            </fieldset>

            {/* Equipments Section */}
            <fieldset className="form-section">
              <legend>Equipments</legend>
              <hr />
              <div className="form-row">
                {formCarrier.equipments.map((equipment, index) => (
                  <CarrierEquipment
                    key={index}
                    equipments={formCarrier.equipments}
                    index={index}
                    onAddEquipment={handleAddEquipment}
                    handleRemoveEquipment={handleRemoveEquipment}
                    handleEquipmentChange={handleEquipmentChange}
                  />
                ))}
                {formCarrier.equipments.length === 0 && (
                  <button type="button" onClick={handleAddEquipment} className="add-button">
                    <PlusOutlined />
                  </button>
                )}
              </div>
            </fieldset>

            {/* Lanes Section */}
            <fieldset className="form-section">
              <legend>Lanes</legend>
              <hr />
              <div className="form-row">
                {formCarrier.lanes.map((lane, index) => (
                  <CarrierLane
                    key={index}
                    lanes={formCarrier.lanes}
                    index={index}
                    onAddLane={handleAddLane}
                    handleRemoveLane={handleRemoveLane}
                    handleLaneChange={handleLaneChange}
                  />
                ))}
                {formCarrier.lanes.length === 0 && (
                  <button type="button" onClick={handleAddLane} className="add-button">
                    <PlusOutlined />
                  </button>
                )}
              </div>
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

export default EditCarrierForm;
