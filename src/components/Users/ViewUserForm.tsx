import { useState, useEffect } from 'react';
import { User } from '../../styles/types/UserTypes';

interface ViewUserFormProps {
  onClose: () => void;
  user: User | null;
}

const ViewUserForm: React.FC<ViewUserFormProps> = ({ onClose, user }) => {
  const [formUser, setFormUser] = useState<User>({
    id: 0,
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
    emp_code: '',
    created_at: '',
    updated_at: '',
  });

  // Update form when user changes
  useEffect(() => {
    if (user) {
      console.log('Selected User:', user);

      setFormUser({
        id: user.id,
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.role || '',
        emp_code: user.emp_code || '',
        created_at: '',
        updated_at: '',
      });
    }
  }, [user]);

  return (
    <div className="form-container">
      <form className="form-main">
        <fieldset className="form-section">
          <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="name">Name</label>
              <div>{formUser.name}</div>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="username">Username</label>
              <div>{formUser.username}</div>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="email">Email</label>
              <div>{formUser.email}</div>
            </div>
          </div>
          <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="role">User Role</label>
              <div>{formUser.role}</div>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="emp_code">Employee Code</label>
              <div>{formUser.emp_code}</div>
            </div>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose} style={{ padding: '9px 15px' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewUserForm;
