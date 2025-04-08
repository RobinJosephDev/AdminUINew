import useEditUser from '../../hooks/edit/useEditUser';
import EditUserDetails from './EditUserDetails';
import { User } from '../../styles/types/UserTypes';

interface EditUserFormProps {
  user: User | null;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onClose, onUpdate }) => {
  const { formUser, setFormUser, updateUser } = useEditUser({ user, onUpdate, onClose });

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateUser();
        }}
        className="form-main"
      >
        <EditUserDetails formUser={formUser} setFormUser={setFormUser} />
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

export default EditUserForm;
