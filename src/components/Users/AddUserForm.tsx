import '../../styles/Form.css';
import UserDetails from './UserDetails';
import { useAddUser } from '../../hooks/add/useAddUser';

interface AddUserFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onClose, onSuccess }) => {
  const { user, setUser, handleSubmit } = useAddUser(onClose, onSuccess);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-main">
        <UserDetails user={user} setUser={setUser} />
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Add User
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
