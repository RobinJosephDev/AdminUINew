import { useEffect, useState, FC } from 'react';
import ViewBrokerDetails from './ViewBrokerDetails';
import { Broker } from '../../../styles/types/BrokerTypes';

interface ViewBrokerFormProps {
  broker: Broker | null;
  onClose: () => void;
}

// Default Broker Object
const defaultBroker: Broker = {
  id: 0,
  broker_name: '',
  broker_address: '',
  broker_city: '',
  broker_state: '',
  broker_country: '',
  broker_postal: '',
  broker_email: '',
  broker_phone: '',
  broker_ext: '',
  broker_fax: '',
  created_at:'',
  updated_at:''
};

const ViewBrokerForm: FC<ViewBrokerFormProps> = ({ broker, onClose }) => {
  const [formBroker, setFormBroker] = useState<Broker>(defaultBroker);

  useEffect(() => {
    setFormBroker(broker ?? defaultBroker);
  }, [broker]);

  return (
    <div className="form-container">
      <form className="form-main">
        <ViewBrokerDetails formBroker={formBroker} />
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose} style={{ padding: '9px 15px' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewBrokerForm;
