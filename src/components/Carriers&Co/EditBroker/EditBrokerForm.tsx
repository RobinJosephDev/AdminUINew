import useEditBroker from '../../../hooks/edit/UseEditBroker';
import EditBrokerDetails from './EditBrokerDetails';
import { Broker } from '../../../styles/types/BrokerTypes';

interface EditBrokerFormProps {
  broker: Broker | null;
  onClose: () => void;
  onUpdate: (updatedBroker: Broker) => void;
}

const EditBrokerForm: React.FC<EditBrokerFormProps> = ({ broker, onClose, onUpdate }) => {
  const { formBroker, setFormBroker, updateBroker } = useEditBroker({ broker, onUpdate, onClose });

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateBroker();
        }}
        className="form-main"
      >
        <EditBrokerDetails formBroker={formBroker} setFormBroker={setFormBroker} />
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Save Changes
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBrokerForm;