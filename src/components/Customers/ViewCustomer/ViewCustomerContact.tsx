import { DeleteOutlined } from '@ant-design/icons';

interface Contact {
  name?: string;
  phone?: string;
  ext?: string;
  email?: string;
  fax?: string;
  designation?: string;
}

interface ViewCustomerContactProps {
  contact?: Contact;
  index: number;
}

const ViewCustomerContact: React.FC<ViewCustomerContactProps> = ({ contact = {} }) => {
  return (
    <fieldset className="form-section">
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Name</label>
          <div>{contact.name || 'N/A'}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Contact No</label>
          <div>{contact.phone || 'N/A'}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Contact No Ext</label>
          <div>{contact.ext || 'N/A'}</div>
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Email</label>
          <div>{contact.email || 'N/A'}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Fax</label>
          <div>{contact.fax || 'N/A'}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Designation</label>
          <div>{contact.designation || 'N/A'}</div>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewCustomerContact;
